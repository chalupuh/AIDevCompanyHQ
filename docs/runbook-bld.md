# Runbook: move the studio to BLD

Step-by-step move of the always-on studio host from the 5090 PC to **BLD** (Windows, RTX 3090 24 GB, `192.168.1.117`, user `goldg`). SSH key auth from the 5090 PC to BLD already works.

Names used below:

- **5090** = the current PC (RTX 5090, 32 GB). **BLD** = the target host.
- `HQ` = `C:\Users\goldg\AI Development Company` (org repo, runtime data in `HQ\.studio`).
- `SOFT` = `C:\Users\goldg\StudioControlRoom` (software repo).
- Commands marked **[BLD]** run on BLD (in PowerShell, either on its console or via `ssh goldg@192.168.1.117`). Commands marked **[5090]** run on the 5090 PC.

Rules while following this runbook:

- Do each step in order. Do not continue past a failed step; use the "If it fails" line.
- No secrets go into files or into this runbook. Tokens and logins stay on the machines.
- Sections 1–8 do not interrupt the 5090. Section 9 (cutover) does, and only the owner starts it.
- Some `studio.js` commands used here (`supervise`, `pair`, `backup`, `token`) and the files `machine.js`, `machine.example.json`, `firewall.ps1`, `install-service.ps1` and `bench/concurrency.js` come from Sprint 4 (lanes H and I) in StudioControlRoom. Make sure those PRs are merged before you start (see 2.2).

---

## 1. Prerequisites check [BLD]

From the HQ directory, run:

```powershell
powershell -ExecutionPolicy Bypass -File tools\bld-preflight.ps1
```

A convenience wrapper also exists: `tools\bld-run-preflight.bat` handles the PowerShell flags automatically (just run it from any CMD/terminal).

It prints PASS/FAIL for every prerequisite plus GPU name/VRAM and exits non-zero on any failure. Every check must pass before section 2. Use the manual commands below only for sections it reports as FAIL.

### 1.1 NVIDIA driver and CUDA

```powershell
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
nvidia-smi
```

Expected: `NVIDIA GeForce RTX 3090, 24576 MiB, <driver>`; the full output header shows a `CUDA Version: 12.x` or newer.

If it fails: `nvidia-smi` not found or no GPU listed → install the current Game Ready or Studio driver from nvidia.com, reboot, retry. A different GPU name means you are on the wrong machine; stop.

### 1.2 Node 24

```powershell
node --version
npm --version
```

Expected: `v24.x.x`, then an npm version.

If it fails: install Node 24 LTS (`winget install OpenJS.NodeJS.LTS`, or the MSI from nodejs.org), open a **new** terminal, retry. If `node` is older, uninstall the old one first.

### 1.3 Git and Git Bash path

```powershell
git --version
Test-Path "C:\Program Files\Git\bin\bash.exe"
```

Expected: `git version 2.x`, then `True`.

If it fails: `winget install Git.Git`. If Git is installed somewhere else, find the path with `where.exe git` (bash is in `..\bin\bash.exe` next to `cmd\`) and **write that path down**: it goes into `machine.json` `gitBash` in section 4.

Commit identity must be the GitHub noreply address (ADR 0002):

```powershell
git config --global user.name
git config --global user.email
```

Expected: your name and the `...@users.noreply.github.com` address. If not set, set them with `git config --global user.name "<name>"` and `git config --global user.email "<id>+chalupuh@users.noreply.github.com"` (use the exact noreply address from GitHub → Settings → Emails).

### 1.4 GitHub CLI

```powershell
gh --version
gh auth status
```

Expected: `Logged in to github.com account chalupuh` with `Git operations protocol: https` (or ssh).

If it fails: `winget install GitHub.cli`, then the **owner** runs `gh auth login` (browser flow). Do not paste tokens anywhere.

### 1.5 Claude Code installed and logged in (owner)

```powershell
claude --version
```

Expected: a version number (e.g. `0.x.x`).

If it fails: install Claude Code (`npm install -g @anthropic-ai/claude-code`, or the current installer from the Claude Code docs), then **the owner** runs `claude` once on the BLD console and completes the login. An agent cannot do this login. After install, if `claude --version` reports a version but subsequent runs prompt for login, the owner must finish the login first.

> **Note:** The preflight script (§1) checks `claude --version` only — it does not make a live model call. If you want to confirm the login works interactively, run `claude -p "Reply with the single word: ready" --output-format text` after the preflight passes.

### 1.6 Ollama

```powershell
ollama --version
Invoke-RestMethod http://127.0.0.1:11434/api/version
```

Expected: a version number, then `version : 0.x.x`.

If it fails: install from ollama.com (`winget install Ollama.Ollama`), start it from the Start menu, retry. If the API call is refused, run `ollama serve` in a separate window and retry.

### 1.7 Free disk space ≥ 150 GB

```powershell
Get-PSDrive C | Select-Object @{n='FreeGB';e={[math]::Round($_.Free/1GB)}}
```

Expected: `FreeGB` of 150 or more (models, runs, backups, node_modules).

If it fails: free space (old downloads, `%TEMP%`, Windows Disk Cleanup) or point Ollama at a bigger drive by setting the user environment variable `OLLAMA_MODELS` (e.g. `D:\ollama`) and restarting Ollama. Do not continue under 150 GB.

---

## 2. Get the code [BLD]

### 2.1 Clone both repos side by side

```powershell
cd C:\Users\goldg
gh repo clone chalupuh/AIDevCompanyHQ "C:\Users\goldg\AI Development Company"
gh repo clone chalupuh/StudioControlRoom
Get-ChildItem -Directory | Where-Object Name -in 'AI Development Company','StudioControlRoom'
```

Expected: both folders listed, directly under `C:\Users\goldg` (the software finds the org by the sibling path and by `studio.home.json`).

If it fails: `authentication failed` → redo 1.4. `destination path already exists` → the repo is already cloned; run `git -C <folder> pull --ff-only` instead.

### 2.2 Check the branch and the Sprint 4 features

```powershell
git -C C:\Users\goldg\StudioControlRoom checkout main
git -C C:\Users\goldg\StudioControlRoom pull --ff-only
git -C C:\Users\goldg\AI Development Company checkout main
git -C C:\Users\goldg\AI Development Company pull --ff-only
Test-Path C:\Users\goldg\StudioControlRoom\studio\machine.js
Test-Path C:\Users\goldg\StudioControlRoom\studio\supervisor.js
Test-Path C:\Users\goldg\StudioControlRoom\studio\install-service.ps1
Test-Path C:\Users\goldg\StudioControlRoom\studio\firewall.ps1
```

Expected: both pulls succeed and all four `Test-Path` lines print `True`.

If it fails: a `False` means the Sprint 4 PR for that file (lane H: machine, supervisor, install-service; lane I: firewall, pairing) is not merged yet. Stop and ask the Engineering Manager to merge it first.

### 2.3 Create studio.home.json

`SOFT\studio.home.json` is git-ignored, so a fresh clone does not have one. Create it to point the software at the org checkout:

```powershell
$json = @{ home = 'C:/Users/goldg/AI Development Company' } | ConvertTo-Json
[IO.File]::WriteAllText('C:\Users\goldg\StudioControlRoom\studio.home.json', $json, (New-Object Text.UTF8Encoding $false))
Get-Content C:\Users\goldg\StudioControlRoom\studio.home.json
```

Expected: outputs `{"home":"C:/Users/goldg/AI Development Company"}`.

If `Get-Content` shows another path: overwrite with the correct command above. Do not commit this file — it is git-ignored because it contains a host-specific path.

### 2.4 Install and build the Control Room UI

```powershell
cd C:\Users\goldg\StudioControlRoom
npm ci --prefix studio/app
npm --prefix studio/app run build
npm --prefix studio/app test
node engine/test.js
```

Expected: `npm ci` ends with `added N packages`; the build prints `✓ built in …s`; the app tests report all passing; `node engine/test.js` exits 0 (check with `$LASTEXITCODE`).

If it fails: `npm ci` errors about the Node version → redo 1.2. Build errors → do not fix on BLD; report them (the same commit builds on the 5090). Engine test failures that mention `bash.exe` → finish section 4 (`gitBash`) first, then re-run.

---

## 3. Copy runtime state from the 5090 PC

Runtime state lives in `HQ\.studio` and is not in git. Copy it **with the studio Paused**, so no run writes while you copy. The copy in this section is a trial; section 9 repeats it as the final copy.

### 3.1 Pause the studio [5090]

```powershell
cd C:\Users\goldg\AI Development Company
node .studio\studio.js pause
node .studio\studio.js status
```

Expected: `status` shows the switch as **Paused** and no agent mid-task. Agents that were mid-task write a checkpoint and stop.

If it fails: a run still shows `running` after a minute → wait for it to checkpoint, or check `node tools\engine\engine.js status`. Do not copy while a run is writing.

### 3.2 What to copy, and what not to

Copy:

| Item | Path under `HQ\.studio` |
|---|---|
| Engine runs | `runs\` |
| Checkpoints | `checkpoints\` |
| Pause switch | `control.json` |
| Roster | `roster.json` (only if uncommitted changes exist — tracked in git) |
| Portraits | `portraits\` (only if uncommitted changes exist — tracked in git) |
| Events log | `events.jsonl` (rotated `events*.jsonl` are host-specific logs and optional) |

Do **not** copy (they are per machine or secret):

- `machine.json` (host profile; BLD gets its own in section 4)
- `auth.json` (LAN token; BLD creates its own on first LAN start)
- `server.pid` (stale process id)
- `locks\` (run lock files hold pids from the 5090)
- `backups\` and `logs\` (optional; large and host specific)

### 3.3 Copy over SSH with robocopy to a share, or scp

Choose **one** method. Method A uses an SMB share on BLD; method B needs nothing but SSH.

**Method A: SMB (recommended, robocopy resumes and verifies).** On BLD, create the target folders and share them once (requires an elevated/ administrator PowerShell for `net share`):

```powershell
# [BLD]
New-Item -ItemType Directory -Force C:\Users\goldg\AI Development Company\.studio | Out-Null
net share StudioState="C:\Users\goldg\AI Development Company\.studio" /GRANT:goldg,CHANGE
```

Then on the 5090:

```powershell
# [5090]  (you will be asked for the BLD goldg password once)
net use \\192.168.1.117\StudioState /user:goldg
$src = 'C:\Users\goldg\AI Development Company\.studio'
$dst = '\\192.168.1.117\StudioState'
$bld = 'goldg@192.168.1.117'
robocopy "$src\runs"        "$dst\runs"        /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy "$src\checkpoints" "$dst\checkpoints" /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy "$src\portraits"   "$dst\portraits"   /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy $src $dst roster.json control.json events.jsonl /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
net use \\192.168.1.117\StudioState /delete
# Clean up the SMB share on BLD (run on BLD or via ssh):
ssh $bld "powershell -Command net share StudioState /delete"
```

Expected: each robocopy ends with `Failed : 0`, share delete prints `"StudioState was deleted successfully."`. The same share cleanup applies in §9.4 (final copy).

**Method B: SSH (no share).**

```powershell
# [5090]
$src = 'C:\Users\goldg\AI Development Company\.studio'
$bld = 'goldg@192.168.1.117'
ssh $bld "powershell -Command New-Item -ItemType Directory -Force C:\Users\goldg\AI Development Company\.studio"
scp -r "$src\runs" "$src\checkpoints" "$src\portraits" "${bld}:'C:/Users/goldg/AI Development Company/.studio/'"
scp "$src\roster.json" "$src\control.json" "$src\events.jsonl" "${bld}:'C:/Users/goldg/AI Development Company/.studio/'"
```

Expected (method A): each robocopy ends with a summary table and `Failed : 0`, and the exit code is 0–7 (robocopy codes 0–7 are success; 8 or more is failure). Method B: scp prints each file with 100%.

If it fails: `System error 53` or `1219` on `net use` → SMB is blocked or credentials differ; use method B. Robocopy exit 8+ → read `%TEMP%\bld-copy.log`, fix the cause (locked file means something is still running: redo 3.1), and run the same command again (robocopy only copies what is missing or newer). `Permission denied (publickey)` on ssh → the key auth is broken; fix it before continuing.

### 3.4 Verify the copy [BLD]

```powershell
cd C:\Users\goldg\AI Development Company\.studio
(Get-ChildItem runs -Recurse -File | Measure-Object).Count
Get-ChildItem checkpoints -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count
Test-Path roster.json, events.jsonl
Test-Path machine.json, auth.json, server.pid, locks
```

Expected: the run file count equals the 5090's count (`(Get-ChildItem runs -Recurse -File | Measure-Object).Count` on the 5090); `Test-Path roster.json, events.jsonl` prints `True True`; the last line prints `False False False False`.

If it fails: counts differ → rerun the copy. A `True` for `machine.json`, `auth.json`, `server.pid` or `locks` means it was copied by mistake: delete it (`Remove-Item -Recurse -Force <name>`), then continue.

**Clean up trial state on BLD and pause the switch.** After the trial copy, BLD holds run records that could resume on both hosts. Delete them and set the switch to Paused so the supervisor (§8) does not pick them up prematurely:

```powershell
# [BLD]
cd C:\Users\goldg\AI Development Company\.studio
Remove-Item -Recurse -Force -Path runs, checkpoints -ErrorAction SilentlyContinue
cd C:\Users\goldg\AI Development Company
node .studio\studio.js pause
node .studio\studio.js status
```

Expected: `status` shows the switch as **Paused**, and `(Get-ChildItem runs -ErrorAction SilentlyContinue | Measure-Object).Count` returns `0`.

### 3.5 Resume the 5090 for now [5090]

The trial copy is done. Keep the 5090 as the primary until section 9:

```powershell
node .studio\studio.js resume
node .studio\studio.js status
```

Expected: switch shows **Running**.

---

## 4. machine.json from the bld-3090 profile [BLD]

`HQ\.studio\machine.json` holds the per-machine settings and is git-ignored. Start from the `bld-3090` profile in `SOFT\studio\machine.example.json`.

```powershell
cd C:\Users\goldg\StudioControlRoom
Get-Content studio\machine.example.json
```

Expected: a JSON object with a `profiles` object containing `goldg-5090` (32 GB, `numParallel` 4, `llmSlots` 3) and `bld-3090` (24 GB, `numParallel` 2, `llmSlots` 2, `contextLength` 32768).

Write the BLD profile (adjust `gitBash` if you recorded a different path in 1.3). The profile sits under `profiles` in the example file, so we extract `$m.profiles.'bld-3090'`. We use `[IO.File]::WriteAllText` with a BOM-less UTF-8 encoding so `machine.js` can parse the file without throwing on a BOM byte:

```powershell
$m = Get-Content studio\machine.example.json -Raw | ConvertFrom-Json
$json = $m.profiles.'bld-3090' | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText('C:\Users\goldg\AI Development Company\.studio\machine.json', $json, (New-Object Text.UTF8Encoding $false))
Get-Content C:\Users\goldg\AI Development Company\.studio\machine.json
```

Expected fields, with these values (shape from `studio/machine.js`):

```json
{
  "name": "bld-3090",
  "gitBash": "C:\\Program Files\\Git\\bin\\bash.exe",
  "ollama": { "url": "http://127.0.0.1:11434", "numParallel": 2, "keepAlive": "5m", "contextLength": 32768 },
  "comfyUrl": "http://127.0.0.1:8188",
  "gpu": { "vramGB": 24, "llmModel": "qwen3.6:27b", "llmSlots": 2 },
  "controlRoom": { "port": 4777, "bind": "127.0.0.1" }
}
```

(`bind` stays loopback until section 7.)

Check that the software loads it without warnings:

```powershell
node -e "const m=require('./studio/machine.js'); console.log(JSON.stringify(m.load ? m.load() : m, null, 1))"
```

Expected: the merged config prints with `name: bld-3090` and `vramGB: 24`, and no `warning` line.

If it fails: `Cannot find module` → the lane H PR is not merged (redo 2.2). A `bad JSON` warning → the file has a syntax error or a UTF-8 BOM; rewrite it with the command above. If the example has no `bld-3090` key, stop and report it; do not invent values.

---

## 5. Models [BLD]

```powershell
ollama pull qwen3.6:27b
ollama list
```

Expected: the pull ends with `success`; `ollama list` shows `qwen3.6:27b` (about 17 GB).

If it fails: `connection refused` → Ollama is not running (1.6). Pull interrupted → rerun the same command, it resumes. `no space` → redo 1.7.

### 5.1 Verify it loads in 24 GB at the chosen context

The profile sets `contextLength` 32768. Load the model at that context and check that it fits fully on the GPU:

```powershell
$body = @{ model='qwen3.6:27b'; prompt='Say ok.'; stream=$false; options=@{ num_ctx=32768 } } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:11434/api/generate -Method Post -Body $body -ContentType 'application/json' | Select-Object response, total_duration
ollama ps
nvidia-smi --query-gpu=memory.used,memory.total --format=csv,noheader
```

Expected: a short `response`; `ollama ps` lists `qwen3.6:27b` with `PROCESSOR` = `100% GPU` and `CONTEXT` = `32768`; `nvidia-smi` shows memory used under about 23000 MiB of 24576 MiB.

If it fails: `PROCESSOR` shows a CPU share (for example `18%/82% CPU/GPU`) → the model plus cache does not fit. Lower `ollama.contextLength` in `machine.json` (try 24576, then 16384), or lower `numParallel` (the KV cache is multiplied by it), then `ollama stop qwen3.6:27b` and repeat 5.1. Note the final context length you use; section 6 and the roadmap rely on it.

---

## 6. Calibrate [BLD]

### 6.1 Concurrency benchmark (live)

(The benchmark comes from Sprint 2 lane B; confirm it is present in 2.2.)

Make sure nothing else uses the GPU, then:

```powershell
cd C:\Users\goldg\StudioControlRoom
node bench/concurrency.js run
```

Expected: the benchmark runs the model at 1, 2, 3 ... parallel requests, prints tokens/s per level, and ends with a recommendation such as `Recommended llmSlots: 2`. It takes several minutes. A results file is written to `bench/results/concurrency-<date>.md`.

**Note:** the benchmark measures at `num_ctx: 16384` (half the 32768 in the profile). It may recommend more `llmSlots` than fit at the real context length. After applying the values, recheck §5.1 (100% GPU). Set `numParallel` to at least `llmSlots`.

If it fails: `ECONNREFUSED` → Ollama is down (1.6). `run` not recognised → check that `bench/concurrency.js` exists (redo 2.2 if missing). Out-of-memory or CPU offload during the run → go back to 5.1 and lower the context first.

### 6.2 Apply the recommendation

Edit `C:\Users\goldg\AI Development Company\.studio\machine.json`:

- `gpu.llmSlots` = the recommended value (concurrent local worker stages)
- `ollama.numParallel` = the recommended value

Set the parallelism in the current session for the manual restart test below. Do **not** persist it as a user variable — the supervisor (§8) reads `ollama.numParallel` from `machine.json`, and a user variable would override `machine.json` for all processes (see `power.js:105`).

```powershell
$env:OLLAMA_NUM_PARALLEL = '<value from bench>'
```

Then stop and restart Ollama, and confirm the value took effect (not just `/api/version` which passes either way):

```powershell
Get-Process ollama* -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Process ollama -ArgumentList serve -WindowStyle Hidden -RedirectStandardError "$env:TEMP\ollama-serve.log"
Start-Sleep 5
Invoke-RestMethod http://127.0.0.1:11434/api/version
Select-String -Path "$env:TEMP\ollama-serve.log" -Pattern 'OLLAMA_NUM_PARALLEL' | Select-Object -Last 3
```

Expected: a version is returned; the redirected log shows `OLLAMA_NUM_PARALLEL: <value>` matching what you set.

If it fails: Ollama does not come back → start it from the Start menu and check `%LOCALAPPDATA%\Ollama\server.log`.

### 6.3 Smoke pipeline

```powershell
cd C:\Users\goldg\AI Development Company
node tools\engine\engine.js start smoke
node tools\engine\engine.js status
```

Expected: the run is created, its stages go to `done`, and the final status is `done` (the smoke pipeline needs no owner gate; it is the self-test). If you run this while the studio switch is Paused, first `node .studio\studio.js resume` on BLD. BLD has its own copy of the state, so this does not affect the 5090.

After smoke passes, **pause BLD again** and clean up the smoke run so the supervisor (§8) does not pick it up:

```powershell
node .studio\studio.js pause
Remove-Item -Recurse -Force .studio\runs\smoke-* -ErrorAction SilentlyContinue
```

If it fails: `bash.exe not found` → fix `gitBash` (section 4). A stage that fails verification → open its log under `.studio\runs\<runId>\`. Model errors → check `ollama ps` and 5.1. Do not go on until smoke is green.

---

## 7. Network [BLD]

Goal: open the Control Room from the 5090 and from the owner's phone on the home network only. No port forwarding.

### 7.1 Firewall rule

Run PowerShell **as administrator**:

```powershell
cd C:\Users\goldg\StudioControlRoom
powershell -ExecutionPolicy Bypass -File studio\firewall.ps1 -WhatIf
powershell -ExecutionPolicy Bypass -File studio\firewall.ps1
Get-NetFirewallRule -DisplayName 'Studio Control Room (LAN)' | Get-NetFirewallAddressFilter
```

Expected: `-WhatIf` describes the rule without creating it; the real run creates the inbound rule "Studio Control Room (LAN)" for the Control Room port; the address filter shows `RemoteAddress : LocalSubnet`.

If it fails: `not elevated` → open PowerShell as administrator. Rule already exists → rerun is safe. To remove it later: `firewall.ps1 -Remove`.

### 7.2 Bind to the LAN

Pick one (the machine file is preferred because the service in section 8 reads it too):

```powershell
# A) machine.json: set controlRoom.bind to "0.0.0.0" in C:\Users\goldg\AI Development Company\.studio\machine.json
# B) one-off, for this terminal only:
$env:STUDIO_BIND = '0.0.0.0'
```

Start the Control Room and check it is reachable from the LAN address:

```powershell
cd C:\Users\goldg\AI Development Company
node .studio\studio.js serve
# in a second terminal:
netstat -ano | Select-String ':4777'
```

Expected: the line shows `0.0.0.0:4777  LISTENING` (not `127.0.0.1:4777`). The first LAN start creates `.studio\auth.json` with a token. Any non-private source address is rejected with 403, and a request without the token gets 401.

If it fails: still `127.0.0.1` → the machine.json field is misspelled or the env var is not set in that terminal. Port already in use → another Control Room is running (`Get-Process node`); stop it.

### 7.3 Pair and open from the phone

```powershell
node .studio\studio.js pair
```

Expected: it prints one URL per private IPv4 address, for example `http://192.168.1.117:4777/pair?t=…`, plus a QR code.

On the phone (same Wi-Fi as BLD), scan the QR code or open the link. The browser is redirected to `/` with a cookie set and the Control Room loads.

If it fails: phone times out → the phone is on another network or guest Wi-Fi; check 7.1 (`LocalSubnet` only covers the BLD subnet). `401` → open the full pairing link again, or rotate the token with `node .studio\studio.js token rotate` and pair again (old cookies stop working). To check from the 5090 instead: open `http://192.168.1.117:4777/pair?t=<token>` in its browser.

Keep the pairing link private. Do not paste it into chat, issues, or files.

---

## 8. Always-on [BLD]

### 8.1 Install the supervisor as a scheduled task

Run PowerShell **as administrator**:

```powershell
cd C:\Users\goldg\StudioControlRoom
powershell -ExecutionPolicy Bypass -File studio\install-service.ps1 -WhatIf
powershell -ExecutionPolicy Bypass -File studio\install-service.ps1
Get-ScheduledTask -TaskName StudioSupervisor | Select-Object TaskName, State
```

Expected: `-WhatIf` prints what it would register; the real run registers the task "StudioSupervisor" (At startup, runs whether the user is logged on or not, restart every 1 minute up to 999 times, highest privileges) running `node studio\studio.js supervise` with `STUDIO_HOME` set. `State` is `Ready`.

**Before starting:** if you have a manual `studio.js serve` still running from section 7, stop it now (the supervisor will start its own). Also make sure `machine.json.controlRoom.bind` is set to `0.0.0.0` if you only used the `$env:STUDIO_BIND` shortcut in 7.2 — the scheduled task does not inherit terminal env vars.

**Credential check from task context.** The task uses `-LogonType S4U` ("no password"), so no password prompt appears. However, S4U sessions cannot decrypt DPAPI-protected credentials (where `gh` and Git store tokens by default). Verify access works from the task context with a one-shot check:

```powershell
# Register a temporary S4U task that writes its output to a temp file
$outFile = "$env:TEMP\s4u-cred-check.txt"
Remove-Item $outFile -ErrorAction SilentlyContinue
$hqPath = "C:\Users\goldg\AI Development Company"
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -Command gh auth status *>> `"$outFile`"; gh api user --jq .login *>> `"$outFile`"; git -C `"`"$hqPath`"`" push --dry-run origin HEAD:refs/heads/s4u-credcheck *>> `"$outFile`""
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest
Register-ScheduledTask -TaskName CredentialCheck -Action $action -Principal $principal -Force
Start-ScheduledTask -TaskName CredentialCheck
Start-Sleep 15
Get-Content $outFile
Unregister-ScheduledTask -TaskName CredentialCheck -Confirm:$false
```

Expected: the file contains `Logged in to github.com account chalupuh`, a line with `chalupuh` from `gh api user`, and a dry-run line such as `[new branch] HEAD -> s4u-credcheck` with **no** `Authentication failed` or `could not read Username` errors. The dry-run verifies push credentials (which S4U cannot decrypt from DPAPI) without creating any remote ref.

If `gh auth status` fails from the task context, `git push` and `gh pr create` from supervisor-launched runs will fail. The fallback options (changing the logon type to `Interactive`/`Password` in lane H, or `gh auth login --insecure-storage` on BLD) are the owner's decision. See also §9.7 failure path.

**Do not start the supervisor from this terminal yet.** It is started in §9.5 after the final copy. A boot-time start by the scheduled task is expected and safe — BLD is in Paused state with an empty `runs` folder (`supervisor.js:160`), so it simply waits. Verify the installation with a dry-run manual supervise:

```powershell
node studio\studio.js supervise
Start-Sleep 10
Get-Content C:\Users\goldg\AI Development Company\.studio\logs\supervisor.log -Tail 10
```

Expected: the log shows supervisor ticks, Ollama and the Control Room kept alive. Stop the manual supervise with `Ctrl+C` — note that `Ctrl+C` stops only the supervisor process; the Control Room and Ollama it started via `power.startup` keep running until you log off or stop them manually. To remove the scheduled task later: `install-service.ps1 -Uninstall`.

If it fails: the manual supervise itself shows errors on stdout. Log empty → `STUDIO_HOME` not set for the task; rerun the installer.

### 8.2 Power settings: never sleep

Administrator PowerShell:

```powershell
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /change monitor-timeout-ac 30
powercfg /hibernate off
powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE
```

Expected: the last command shows `Current AC Power Setting Index: 0x00000000`. (Turning the screen off is fine; sleeping is not.) Also in Settings → System → Power, set "Sleep" to Never when plugged in. Also disable "USB selective suspend" and set the PCIe link state power management to Off in the Advanced power plan settings if the GPU drops out after idle.

### 8.3 Auto-login is not required

The scheduled task runs without a logged-in user, so no auto-login is needed and none should be set up (it would leave the PC logged in to the owner's account). After a reboot, wait about two minutes, then open the Control Room from the 5090; it must load without anyone touching BLD. Claude Code login is stored per user and stays valid for the task run by `goldg`.

If agents fail after a reboot with a login error: the owner logs in once to the console, runs `claude`, and re-authenticates; then restart the task (`Start-ScheduledTask -TaskName StudioSupervisor`).

### 8.4 Restart after power loss (BIOS)

At the BLD console, reboot into BIOS/UEFI (usually `Del` or `F2`) and set **AC Power Recovery** / **Restore on AC Power Loss** / **After G3** to **Power On** (the exact name differs by motherboard). Save and exit. Test once, with the owner's OK: shut BLD down, unplug the power for 10 seconds, plug it in again, and confirm it boots on its own.

If the option is not found: look in "Advanced → Power Management" or "APM"; if the board has no such option, a smart plug that restores power on is not a substitute, so tell the owner and note it in the log.

### 8.5 Windows Update: active hours

Settings → Windows Update → Advanced options → **Active hours** → set to the longest span (18 hours, for example 06:00–00:00) so automatic restarts only happen at night. Optionally pause updates for a week during the cutover. After a patch restart the scheduled task starts the supervisor again by itself.

Check:

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings' | Select-Object ActiveHoursStart, ActiveHoursEnd
```

Expected: the start and end hours you set.

---

## 9. Cutover

Only the owner starts this section. It makes BLD the primary host. Allow about 30 minutes; there will be a short pause in work.

### 9.1 Pause the 5090 [5090]

```powershell
cd C:\Users\goldg\AI Development Company
node .studio\studio.js pause
node .studio\studio.js status
node tools\engine\engine.js status
```

Expected: switch **Paused**; every agent checkpointed; no run still `running`.

If it fails: a run is stuck → wait up to 2 minutes; if it still runs, `node tools\engine\engine.js status <runId>` and decide with the owner. Never copy while it runs.

### 9.2 Make a safety backup [5090]

```powershell
node .studio\studio.js backup
Get-ChildItem .studio\backups | Sort-Object LastWriteTime | Select-Object -Last 1
```

Expected: a new `<date>.zip` in `.studio\backups`. Keep it until the rollback window (section 10) has passed.

If it fails: `backup` unknown → the lane H PR is missing on the 5090 checkout; instead zip the folders by hand: `Compress-Archive -Path .studio\runs,.studio\checkpoints,.studio\roster.json,.studio\events.jsonl -DestinationPath $env:USERPROFILE\studio-before-cutover.zip`.

### 9.3 Stop the 5090's background work [5090]

```powershell
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, Path
```

Stop the studio supervisor, Control Room and any engine on the 5090 (close their terminals, or `Stop-Process -Id <id>` for the node processes that run `studio.js` or `engine.js`). Leave Ollama on the 5090 as it is; it can keep serving as a spare.

Expected: no node process on the 5090 runs `studio.js` or `engine.js`.

### 9.4 Final state copy

**[BLD] Stop the supervisor first** so it does not read `control.json` while robocopy overwrites it:

```powershell
Stop-ScheduledTask -TaskName StudioSupervisor
cd C:\Users\goldg\AI Development Company
node .studio\studio.js status   # must show Paused
```

Before the final copy, handle any unfinished runs that point at worktrees only on the 5090:
1. On the 5090, `node tools\engine\engine.js status` — list each run not yet `done` or `parked`.
2. For each, note the `workdir` (a `StudioLanes/<lane>` path or an app repo). Review what would be committed:
   ```powershell
   git -C <workdir> status --short   # review: nothing secret, nothing generated
   git -C <workdir> add <paths>      # only the paths you reviewed above
   git -C <workdir> commit -m "wip: save state before cutover"
   git -C <workdir> push -u origin HEAD
   ```
   Never push to `main`. If anything in `status` looks like a secret, stop and ask the owner.
3. On BLD, `git -C <parent-repo> fetch` then `git -C <parent-repo> worktree add <workdir> <branch>`, or `git clone <repo> <workdir>` for each. If you prefer to finish or park those runs first, do so and skip this step.

Repeat section 3.3 (the same method) from the 5090 to BLD. For a final copy remove stale files too: change `/E` to `/MIR` in the robocopy lines for `runs`, `checkpoints` and `portraits`. Note that `scp` cannot mirror — if you used method B, change `/MIR` to `/E` and manually delete files on BLD that no longer exist on the 5090.

**Verification (BLD):** do **not** rerun §3.4 — that check is for the trial copy and would tell you to delete BLD's legitimate `machine.json` and `auth.json`. Instead:

```powershell
# [BLD]  — confirm BLD's own config is intact
(Get-Content C:\Users\goldg\AI Development Company\.studio\machine.json | ConvertFrom-Json).name
Test-Path C:\Users\goldg\AI Development Company\.studio\auth.json
```

Expected: `bld-3090` and `True`.

If it fails: `machine.json` prints `goldg-5090` → the 5090 file was copied by mistake; redo section 4.

Also verify that carried-over run records point at BLD's correct HQ path (they were created on the 5090 and freeze `vars.home` at creation time):

```powershell
# [BLD]  — check one carried-over run record
$runFile = Get-ChildItem C:\Users\goldg\AI Development Company\.studio\runs\*.json | Select-Object -First 1
if ($runFile) {
    (Get-Content $runFile | ConvertFrom-Json).vars.home
} else {
    Write-Host "No run records found (expected if no runs were carried over)"
}
```

Expected: outputs `C:\Users\goldg\AI Development Company` (matching BLD's HQ path), or "No run records found".

If a run record shows a different path: all stages for that run will fail their file checks. The run must be parked or its `vars.home` manually corrected in the JSON before resuming.

### 9.5 Start the supervisor on BLD

**Precondition:** BLD's switch must be **Paused** before starting the supervisor, otherwise it will auto-resume runs that haven't been verified yet.

```powershell
# [BLD]
cd C:\Users\goldg\AI Development Company
node .studio\studio.js status   # must show Paused
```

If the switch shows **Running**, pause first: `node .studio\studio.js pause`. Then start:

```powershell
Start-ScheduledTask -TaskName StudioSupervisor
```

Expected: the supervisor is `Running`; `status` shows the switch still **Paused** and lists the checkpoints that came across.

If it fails: `status` shows Running instead of Paused after the supervisor starts → the `control.json` that was copied had the wrong state; run `node .studio\studio.js pause` and retry. See also 8.1.

### 9.6 Resume the runs

```powershell
node .studio\studio.js resume
Start-Sleep 90
node tools\engine\engine.js status
Get-Content .studio\logs\supervisor.log -Tail 15
```

Expected: the switch shows **Running**. Within about a minute the supervisor resumes runs that were `paused` or `running` and logs a progress event for each (one engine process per run; a lock file appears under `.studio\locks\`). Runs that were `blocked`, `waiting-gate` or `parked` stay as they are. Agents that were checkpointed are re-delegated by the Engineering Manager session (see CLAUDE.md "Start / safe-stop switch").

If it fails: no run resumes → check the supervisor log for the reason, and that `Test-Path .studio\locks` has no stale lock for a dead pid (stale locks are replaced automatically). A run resumes twice → stop the supervisor immediately and report it. Roll back with section 10 if it cannot be fixed.

### 9.7 Verify one internal-build task end to end

Start a small, harmless internal task (the owner picks one; a docs-only task is enough):

```powershell
node tools\engine\engine.js start internal-build --var task="<one small docs task>" --var workdir="C:\Users\goldg\AI Development Company"
node tools\engine\engine.js status
```

Expected: the run goes through build → QA → review, local stages run on `qwen3.6:27b` on BLD (`ollama ps` on BLD shows it loaded), the Opus review gate approves, and the run ends `done` with a PR opened on GitHub from BLD. CI on that PR is green. Merge only under the auto-merge policy in CLAUDE.md.

If it fails: follow the escalation ladder; open the failing stage log under `.studio\runs\<runId>\`. A failure caused by BLD itself (Git Bash path, `gh` login, Claude login) goes back to section 1 or 4. If it cannot be fixed within the hour, use section 10.

### 9.8 The 5090 only browses

From now on the 5090 PC is a client: it opens `http://192.168.1.117:4777` in a browser (paired as in 7.3) and does nothing else for the studio. Bookmark it. Specifically:

- Do not run `studio.js serve`, `supervise` or `engine.js` on the 5090 (two hosts writing to GitHub and to separate state would diverge).
- The Claude chat session that acts as Engineering Manager runs on BLD (or against the BLD checkout) from now on.

### 9.9 Update the docs

Open a PR (docs only) that notes in `docs/local-llm-roadmap.md` that BLD has become the primary host, with the date and the final `contextLength`, `numParallel` and `llmSlots` chosen in sections 5 and 6.

---

## 10. Rollback

Use this if BLD cannot do the work. The 5090 state stays intact until you delete it, so a rollback is quick. Do it within the first week; after that, work done on BLD must be copied back first (step 10.2).

### 10.1 Pause BLD

```powershell
# [BLD]
cd C:\Users\goldg\AI Development Company
node .studio\studio.js pause
Stop-ScheduledTask -TaskName StudioSupervisor
node tools\engine\engine.js status
```

Expected: the switch is **Paused**, the task is `Ready` (stopped), no engine is running.

If it fails: an engine will not stop → `Get-Process node | Stop-Process` for the process that runs `engine.js`, then check `.studio\locks\`.

### 10.2 Copy BLD's newer state back (only if BLD ran work after the cutover)

Reverse the direction of section 3.3: robocopy or scp from BLD's `.studio` (`runs`, `checkpoints`, `portraits`, `roster.json`, `events.jsonl`) to the 5090's `.studio`. Never copy `machine.json`, `auth.json`, `server.pid` or `locks`. If you did not run BLD for long and want to discard its work, restore from the backup in 9.2 instead:

```powershell
# [5090]
Expand-Archive -Force <path to the 9.2 zip> -DestinationPath C:\Users\goldg\AI Development Company\.studio\restore
```

Then copy the wanted folders from `restore` into `.studio` by hand.

### 10.3 Resume on the 5090

```powershell
# [5090]
cd C:\Users\goldg\AI Development Company
Remove-Item -Recurse -Force .studio\locks -ErrorAction SilentlyContinue
node .studio\studio.js resume
node .studio\studio.js status
node tools\engine\engine.js status
```

Expected: the switch is **Running**; paused runs continue (start them with `node tools\engine\engine.js resume <runId>` if the 5090 has no supervisor).

### 10.4 Keep BLD from restarting the work

Make sure BLD stays quiet, so two hosts never work at once:

```powershell
# [BLD]
powershell -ExecutionPolicy Bypass -File C:\Users\goldg\StudioControlRoom\studio\install-service.ps1 -Uninstall
Get-ScheduledTask -TaskName StudioSupervisor -ErrorAction SilentlyContinue
```

Expected: the second command prints nothing (the task is gone). Optionally remove the firewall rule too: `studio\firewall.ps1 -Remove`.

### 10.5 Tell the owner

Record in the sprint log what failed and at which step, and revert the docs PR from 9.9 if it was merged. Fix the cause on BLD, then start again from section 9.
