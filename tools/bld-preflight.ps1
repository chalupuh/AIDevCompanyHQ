<#
.SYNOPSIS
  Read-only preflight check for the BLD host (runbook section 1).
  Prints PASS/FAIL for every prerequisite plus GPU name/VRAM.
  Exits non-zero when any check fails. Does not install or change anything.

.NOTES
  Run from the HQ root:  powershell -ExecutionPolicy Bypass -File tools\bld-preflight.ps1
#>

$ErrorActionPreference = 'Stop'
$script:failures = 0
$script:warnings = 0

function Check($name, $script) {
    try {
        $result = & $script
        if ($result) {
            Write-Host ("  [PASS] " + $name)
        } else {
            Write-Host ("  [FAIL] " + $name) -ForegroundColor Red
            $script:failures++
        }
    } catch {
        Write-Host ("  [FAIL] " + $name + " - " + $_.Exception.Message) -ForegroundColor Red
        $script:failures++
    }
    $null
}

function Warn($name, $script) {
    try {
        $result = & $script
        if (-not $result) {
            Write-Host ("  [WARN] " + $name) -ForegroundColor Yellow
            $script:warnings++
        }
    } catch {
        Write-Host ("  [WARN] " + $name + " - " + $_.Exception.Message) -ForegroundColor Yellow
        $script:warnings++
    }
    $null
}

Write-Host ""
Write-Host "BLD Preflight - checking prerequisites"
Write-Host ("=" * 52)
Write-Host ""

# ---------------------------------------------------------------------------
# 1.1  NVIDIA driver and CUDA
# ---------------------------------------------------------------------------
Write-Host "1.1  NVIDIA driver & CUDA"

$nvidiaOnPath = $null -ne (Get-Command nvidia-smi -ErrorAction SilentlyContinue)
if ($nvidiaOnPath) {
    Write-Host ("  [PASS] nvidia-smi on PATH")
    try {
        $csv = nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>$null | Select-Object -First 1
        $smiLines = nvidia-smi 2>$null
        $smiFull  = $smiLines -join "`n"
    } catch {
        $csv = $null
        $smiFull = $null
        Write-Host ("  [FAIL] nvidia-smi query") -ForegroundColor Red
        $script:failures++
    }

    # ---------------------------------------------------------------------------
    # Parse GPU name / VRAM / driver from --query-gpu output
    # ---------------------------------------------------------------------------
    $gpuName = $gpuVram = $gpuDriver = ''
    if ($csv) {
        $lastComma  = $csv.LastIndexOf(',')
        $prevComma  = $csv.LastIndexOf(',', $lastComma - 1)
        $gpuName    = $csv.Substring(0, $prevComma).Trim()
        $gpuVram    = $csv.Substring($prevComma + 1, $lastComma - $prevComma - 1).Trim()
        $gpuDriver  = $csv.Substring($lastComma + 1).Trim()
    }

    $cudaVer = 0
    $cudaFallback = $false
    # Try extracting CUDA version from nvidia-smi header.
    # Iterate explicitly (not Where-Object) so $Matches stays in scope.
    if ($smiLines) {
        foreach ($line in $smiLines) {
            if ($line -match 'CUDA\s+Version:\s*([0-9]+)') {
                $cudaVer = [int]$Matches[1]
                break
            }
        }
    }
    # Fallback: estimate CUDA from driver version (nvidia-smi header may not
    # parse reliably on all locales/encodings). Driver 527+ -> CUDA 12, etc.
    if ($cudaVer -eq 0 -and $gpuDriver) {
        $drvMajor = 0
        if ($gpuDriver -match '^(\d+)') { $drvMajor = [int]$Matches[1] }
        if ($drvMajor -ge 527)    { $cudaVer = 12 }
        elseif ($drvMajor -ge 452) { $cudaVer = 11 }
        elseif ($drvMajor -ge 390) { $cudaVer = 10 }
        elseif ($drvMajor -ge 384) { $cudaVer = 9 }
        $cudaFallback = $true
    }

    if ($csv) {

        Write-Host ("        GPU      : " + $gpuName)
        Write-Host ("        VRAM     : " + $gpuVram)
        Write-Host ("        Driver   : " + $gpuDriver)

        $null = Warn "GPU is RTX 3090" { $gpuName -match 'RTX 3090' }

        $null = Check "VRAM >= 24576 MiB" {
            $miB = [int]($gpuVram -replace '[^0-9]', '')
            $miB -ge 24576
        }

        $cudaLabel = $cudaVer
        if ($cudaFallback) { $cudaLabel = "$cudaVer (estimated from driver)" }
        Write-Host ("        CUDA     : " + $cudaLabel)
        $null = Check "CUDA >= 12" { $cudaVer -ge 12 }
    } else {
        Write-Host ("  [FAIL] Could not query GPU info") -ForegroundColor Red
        $script:failures++
    }
} else {
    Write-Host ("  [FAIL] nvidia-smi on PATH") -ForegroundColor Red
    $script:failures++
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.2  Node 24
# ---------------------------------------------------------------------------
Write-Host "1.2  Node 24"

$null = Check "node installed" {
    $null -ne (Get-Command node -ErrorAction SilentlyContinue)
}

$null = Check "node v24.x" {
    $ver = node --version 2>$null
    $ver -match '^v24\.'
}

$null = Check "npm available" {
    $null -ne (Get-Command npm -ErrorAction SilentlyContinue)
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.3  Git and Git Bash path
# ---------------------------------------------------------------------------
Write-Host "1.3  Git & Git Bash"

$null = Check "git installed" {
    $null -ne (Get-Command git -ErrorAction SilentlyContinue)
}

# Git Bash: test default path as a warning (runbook section 1.3 allows a custom path).
# Also try deriving from `where.exe git` for non-default installs.
$foundBashPath = ''
$null = Warn "Git Bash found" {
    $ok = Test-Path "C:\Program Files\Git\bin\bash.exe"
    if ($ok) { $foundBashPath = "C:\Program Files\Git\bin\bash.exe" }
    if (-not $ok) {
        # Derive bash path from `where.exe git` -> parent/bin/bash.exe
        $gitPath = where.exe git 2>$null | Select-Object -First 1
        if ($gitPath) {
            $bashPath = Join-Path (Split-Path (Split-Path $gitPath) ) "bin\bash.exe"
            $ok = Test-Path $bashPath
            if ($ok) { $foundBashPath = $bashPath }
        }
    }
    if ($foundBashPath) { Write-Host ("        Path   : " + $foundBashPath) }
    $ok
}

$null = Check "git user.name set" {
    $name = git config --global user.name 2>$null
    [string]::IsNullOrWhiteSpace($name) -eq $false
}

$null = Check "git user.email is noreply" {
    $email = git config --global user.email 2>$null
    [string]::IsNullOrWhiteSpace($email) -eq $false -and $email -match '@users\.noreply\.github\.com$'
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.4  GitHub CLI
# ---------------------------------------------------------------------------
Write-Host "1.4  GitHub CLI"

$null = Check "gh installed" {
    $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
}

$null = Check "gh authenticated" {
    # gh auth status writes to stderr; under $ErrorActionPreference=Stop PS 5.1
    # can treat native stderr as a terminating error.  Suppress errors here
    # and check $LASTEXITCODE instead.
    $ErrorActionPreference = 'Continue'
    gh auth status *>$null
    $rc = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    $rc -eq 0
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.5  Claude Code
# ---------------------------------------------------------------------------
Write-Host "1.5  Claude Code"

$null = Check "claude installed" {
    $null -ne (Get-Command claude -ErrorAction SilentlyContinue)
}

$null = Check "claude versioned" {
    $ver = claude --version 2>$null
    $null -ne $ver
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.6  Ollama
# ---------------------------------------------------------------------------
Write-Host "1.6  Ollama"

$null = Check "ollama installed" {
    $null -ne (Get-Command ollama -ErrorAction SilentlyContinue)
}

$null = Check "Ollama API reachable" {
    try {
        $r = Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/version' -TimeoutSec 5
        $r.PSObject.Properties.Name -contains 'version'
    } catch {
        $false
    }
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.7  Free disk space >= 150 GB
# ---------------------------------------------------------------------------
Write-Host "1.7  Disk space"

$null = Check "C: free >= 150 GB" {
    $drv = Get-PSDrive C
    $freeGB = [math]::Round($drv.Free / 1GB)
    Write-Host ("        Free     : " + $freeGB + " GB")
    $freeGB -ge 150
}

Write-Host ""

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ("=" * 52)
if ($script:warnings -gt 0) {
    Write-Host ("Notices   : " + $script:warnings + " WARN") -ForegroundColor Yellow
}
if ($script:failures -gt 0) {
    Write-Host ("RESULT    : " + $script:failures + " FAIL - prerequisites NOT met") -ForegroundColor Red
    Write-Host "Fix the failures listed above and re-run."
    exit 1
} else {
    Write-Host "RESULT    : all checks PASS - prerequisites met." -ForegroundColor Green
    exit 0
}
