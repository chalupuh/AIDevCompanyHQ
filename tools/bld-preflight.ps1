<#
.SYNOPSIS
  Read-only preflight check for the BLD host (runbook §1).
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
        Write-Host ("  [FAIL] " + $name + " — " + $_.Exception.Message) -ForegroundColor Red
        $script:failures++
    }
    # Return nothing — caller uses $null = Check … to avoid stray pipeline output (B3)
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
        # Warn is non-fatal on error too
        Write-Host ("  [WARN] " + $name + " — " + $_.Exception.Message) -ForegroundColor Yellow
        $script:warnings++
    }
    $null
}

Write-Host ""
Write-Host "BLD Preflight — checking prerequisites"
Write-Host ("=" * 52)
Write-Host ""

# ---------------------------------------------------------------------------
# 1.1  NVIDIA driver and CUDA
# ---------------------------------------------------------------------------
Write-Host "§1.1  NVIDIA driver & CUDA"

$nvidiaOnPath = $null -ne (Get-Command nvidia-smi -ErrorAction SilentlyContinue)  # B5
if ($nvidiaOnPath) {
    Write-Host ("  [PASS] nvidia-smi on PATH")
    # GPU name, VRAM, driver
    $csv = nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>$null
    # CUDA version from the full header
    $smiFull = nvidia-smi 2>$null
    $cudaVer = 0
    if ($smiFull -match 'CUDA Version:\s*([0-9]+)') { $cudaVer = [int]$Matches[1] }

    if ($csv) {
        # CSV fields may contain spaces (GPU name). Parse by field count: name is everything
        # up to the last two comma-separated fields.
        $lastComma  = $csv.LastIndexOf(',')
        $prevComma  = $csv.LastIndexOf(',', $lastComma - 1)
        $gpuName    = $csv.Substring(0, $prevComma).Trim()
        $gpuVram    = $csv.Substring($prevComma + 1, $lastComma - $prevComma - 1).Trim()
        $gpuDriver  = $csv.Substring($lastComma + 1).Trim()

        Write-Host ("        GPU      : " + $gpuName)
        Write-Host ("        VRAM     : " + $gpuVram)
        Write-Host ("        Driver   : " + $gpuDriver)

        # B4: 3090 check is a WARN, not a FAIL — safe to run on any host
        $null = Warn "GPU is RTX 3090" { $gpuName -notmatch 'RTX 3090' }

        $null = Check "VRAM >= 24576 MiB" {
            $miB = [int]($gpuVram -replace '[^0-9]', '')
            $miB -ge 24576
        }

        Write-Host ("        CUDA     : " + $cudaVer)
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
Write-Host "§1.2  Node 24"

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
Write-Host "§1.3  Git & Git Bash"

$null = Check "git installed" {
    $null -ne (Get-Command git -ErrorAction SilentlyContinue)
}

$null = Check "Git Bash at default path" {
    Test-Path "C:\Program Files\Git\bin\bash.exe"
}

# Git identity (informational — noreply address)
$null = Check "git user.name set" {
    $name = git config --global user.name 2>$null
    [string]::IsNullOrWhiteSpace($name) -eq $false
}

$null = Check "git user.email set" {
    $email = git config --global user.email 2>$null
    [string]::IsNullOrWhiteSpace($email) -eq $false
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.4  GitHub CLI
# ---------------------------------------------------------------------------
Write-Host "§1.4  GitHub CLI"

$null = Check "gh installed" {
    $null -ne (Get-Command gh -ErrorAction SilentlyContinue)
}

$null = Check "gh authenticated" {
    $out = gh auth status 2>&1
    $out -notmatch 'not logged in'
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.5  Claude Code
# ---------------------------------------------------------------------------
Write-Host "§1.5  Claude Code"

$null = Check "claude installed" {
    $null -ne (Get-Command claude -ErrorAction SilentlyContinue)
}

# B2: use --version only, no live model call
$null = Check "claude versioned" {
    $ver = claude --version 2>$null
    $null -ne $ver
}

Write-Host ""

# ---------------------------------------------------------------------------
# 1.6  Ollama
# ---------------------------------------------------------------------------
Write-Host "§1.6  Ollama"

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
Write-Host "§1.7  Disk space"

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
    Write-Host ("RESULT    : " + $script:failures + " FAIL — prerequisites NOT met") -ForegroundColor Red
    Write-Host "Fix the failures listed above and re-run."
    exit 1
} else {
    Write-Host "RESULT    : all checks PASS — prerequisites met." -ForegroundColor Green
    exit 0
}
