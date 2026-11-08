# Runbook: move the studio to BLD

Step-by-step move of the always-on studio host from the 5090 PC to **BLD** (Windows, RTX 3090 24 GB, `192.168.1.117`, user `goldg`). SSH key auth from the 5090 PC to BLD already works.

Names used below:

- **5090** = the current PC (RTX 5090, 32 GB). **BLD** = the target host.
- `HQ` = `C:\Users\goldg\AIDevCompanyHQ` (org repo, runtime data in `HQ\.studio`).
- `SOFT` = `C:\Users\goldg\StudioControlRoom` (software repo).
- Commands marked **[BLD]** run on BLD (in PowerShell, either on its console or via `ssh goldg@192.168.1.117`). Commands marked **[5090]** run on the 5090 PC.

Rules while following this runbook:

- Do each step in order. Do not continue past a failed step; use the "If it fails" line.
- No secrets go into files or into this runbook. Tokens and logins stay on the machines.
- Sections 1–8 do not interrupt the 5090. Section 9 (cutover) does, and only the owner starts it.
- Some `studio.js` commands used here (`supervise`, `pair`, `backup`, `token`) and the files `machine.js`, `machine.example.json`, `firewall.ps1`, `install-service.ps1` and `bench/concurrency.js` come from Sprint 4 (lanes H and I) in StudioControlRoom. Make sure those PRs are merged before you start (see 2.2).

---

## 1. Prerequisites check [BLD]

Run the checks one by one. Every one must pass before section 2.

> A read-only script that runs all of these checks and prints PASS/FAIL (`tools/bld-preflight.ps1`) is planned in Sprint 4 lane J. Once it exists, run `powershell -File tools\bld-preflight.ps1` from `HQ` and use the manual commands below only for anything it reports as FAIL.

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
claude -p "Reply with the single word: ready" --output-format text
```

Expected: a version number, then `ready`.

If it fails: install Claude Code (`npm install -g @anthropic-ai/claude-code`, or the current installer from the Claude Code docs), then **the owner** runs `claude` once on the BLD console and completes the login. An agent cannot do this login. If the second command asks you to log in, the owner must finish the login first.

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
gh repo clone chalupuh/AIDevCompanyHQ
gh repo clone chalupuh/StudioControlRoom
Get-ChildItem -Directory | Where-Object Name -in 'AIDevCompanyHQ','StudioControlRoom'
```

Expected: both folders listed, directly under `C:\Users\goldg` (the software finds the org by the sibling path and by `studio.home.json`).

If it fails: `authentication failed` → redo 1.4. `destination path already exists` → the repo is already cloned; run `git -C <folder> pull --ff-only` instead.

### 2.2 Check the branch and the Sprint 4 features

```powershell
git -C C:\Users\goldg\StudioControlRoom checkout main
git -C C:\Users\goldg\StudioControlRoom pull --ff-only
git -C C:\Users\goldg\AIDevCompanyHQ checkout main
git -C C:\Users\goldg\AIDevCompanyHQ pull --ff-only
Test-Path C:\Users\goldg\StudioControlRoom\studio\machine.js
Test-Path C:\Users\goldg\StudioControlRoom\studio\supervisor.js
Test-Path C:\Users\goldg\StudioControlRoom\studio\install-service.ps1
Test-Path C:\Users\goldg\StudioControlRoom\studio\firewall.ps1
```

Expected: both pulls succeed and all four `Test-Path` lines print `True`.

If it fails: a `False` means the Sprint 4 PR for that file (lane H: machine, supervisor, install-service; lane I: firewall, pairing) is not merged yet. Stop and ask the Engineering Manager to merge it first.

### 2.3 studio.home.json

`SOFT\studio.home.json` points the software at the org checkout.

```powershell
Get-Content C:\Users\goldg\StudioControlRoom\studio.home.json
```

Expected: a JSON object whose home path is `C:\Users\goldg\AIDevCompanyHQ` (or a relative `..\AIDevCompanyHQ`).

If it fails or shows another path (for example a path from the 5090): edit the file so it names `C:\Users\goldg\AIDevCompanyHQ`, and commit that change through a PR only if the repo tracks it. Alternatively set `STUDIO_HOME` (user env var) to the same path:

```powershell
[Environment]::SetEnvironmentVariable('STUDIO_HOME','C:\Users\goldg\AIDevCompanyHQ','User')
```

Open a new terminal afterwards.

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
cd C:\Users\goldg\AIDevCompanyHQ
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
| Roster | `roster.json` |
| Portraits | `portraits\` |
| Events log | `events.jsonl` (and any rotated `events*.jsonl`) |

Do **not** copy (they are per machine or secret):

- `machine.json` (host profile; BLD gets its own in section 4)
- `auth.json` (LAN token; BLD creates its own on first LAN start)
- `server.pid` (stale process id)
- `locks\` (run lock files hold pids from the 5090)
- `backups\` and `logs\` (optional; large and host specific)

### 3.3 Copy over SSH with robocopy to a share, or scp

Choose **one** method. Method A uses an SMB share on BLD; method B needs nothing but SSH.

**Method A: SMB (recommended, robocopy resumes and verifies).** On BLD, create the target folders and share them once:

```powershell
# [BLD]
New-Item -ItemType Directory -Force C:\Users\goldg\AIDevCompanyHQ\.studio | Out-Null
net share StudioState=C:\Users\goldg\AIDevCompanyHQ\.studio /GRANT:goldg,CHANGE
```

Then on the 5090:

```powershell
# [5090]  (you will be asked for the BLD goldg password once)
net use \\192.168.1.117\StudioState /user:goldg
$src = 'C:\Users\goldg\AIDevCompanyHQ\.studio'
$dst = '\\192.168.1.117\StudioState'
robocopy "$src\runs"        "$dst\runs"        /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy "$src\checkpoints" "$dst\checkpoints" /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy "$src\portraits"   "$dst\portraits"   /E /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
robocopy $src $dst roster.json events.jsonl /COPY:DAT /R:2 /W:2 /NP /LOG+:$env:TEMP\bld-copy.log
net use \\192.168.1.117\StudioState /delete
```

**Method B: SSH (no share).**

```powershell
# [5090]
$src = 'C:\Users\goldg\AIDevCompanyHQ\.studio'
$bld = 'goldg@192.168.1.117'
ssh $bld "powershell -Command New-Item -ItemType Directory -Force C:\Users\goldg\AIDevCompanyHQ\.studio | Out-Null"
scp -r "$src\runs" "$src\checkpoints" "$src\portraits" "${bld}:C:/Users/goldg/AIDevCompanyHQ/.studio/"
scp "$src\roster.json" "$src\events.jsonl" "${bld}:C:/Users/goldg/AIDevCompanyHQ/.studio/"
```

Expected (method A): each robocopy ends with a summary table and `Failed : 0`, and the exit code is 0–7 (robocopy codes 0–7 are success; 8 or more is failure). Method B: scp prints each file with 100%.

If it fails: `System error 53` or `1219` on `net use` → SMB is blocked or credentials differ; use method B. Robocopy exit 8+ → read `%TEMP%\bld-copy.log`, fix the cause (locked file means something is still running: redo 3.1), and run the same command again (robocopy only copies what is missing or newer). `Permission denied (publickey)` on ssh → the key auth is broken; fix it before continuing.

### 3.4 Verify the copy [BLD]

```powershell
cd C:\Users\goldg\AIDevCompanyHQ\.studio
(Get-ChildItem runs -Recurse -File | Measure-Object).Count
Get-ChildItem checkpoints -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count
Test-Path roster.json, events.jsonl
Test-Path machine.json, auth.json, server.pid, locks
```

Expected: the run file count equals the 5090's count (`(Get-ChildItem runs -Recurse -File | Measure-Object).Count` on the 5090); `Test-Path roster.json, events.jsonl` prints `True True`; the last line prints `False False False False`.

If it fails: counts differ → rerun the copy. A `True` for `machine.json`, `auth.json`, `server.pid` or `locks` means it was copied by mistake: delete it (`Remove-Item -Recurse -Force <name>`), then continue.

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

Expected: a JSON object with two profiles, `goldg-5090` (32 GB, `numParallel` 4, `llmSlots` 3) and `bld-3090` (24 GB, `numParallel` 2, `llmSlots` 2, `contextLength` 32768).

Write the BLD profile (adjust `gitBash` if you recorded a different path in 1.3). This writes the profile's contents as the file itself, not the wrapper with two profiles:

```powershell
$m = Get-Content studio\machine.example.json -Raw | ConvertFrom-Json
$m.'bld-3090' | ConvertTo-Json -Depth 8 | Set-Content C:\Users\goldg\AIDevCompanyHQ\.studio\machine.json -Encoding UTF8
Get-Content C:\Users\goldg\AIDevCompanyHQ\.studio\machine.json
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

Make sure nothing else uses the GPU, then:

```powershell
cd C:\Users\goldg\StudioControlRoom
node bench/concurrency.js --live
```

Expected: the benchmark runs the model at 1, 2, 3 … parallel requests, prints tokens/s per level, and ends with a recommendation such as `recommended: llmSlots=2 numParallel=2`. It takes several minutes.

If it fails: `ECONNREFUSED` → Ollama is down (1.6). `--live` not recognised → run `node bench/concurrency.js --help` and use the flag it lists for a real (non-simulated) run. Out-of-memory or CPU offload during the run → go back to 5.1 and lower the context first.

### 6.2 Apply the recommendation

Edit `C:\Users\goldg\AIDevCompanyHQ\.studio\machine.json`:

- `gpu.llmSlots` = the recommended value (concurrent local worker stages)
- `ollama.numParallel` = the recommended value

Then restart Ollama so the new parallelism applies, and confirm:

```powershell
Get-Process ollama* -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Process ollama -ArgumentList serve -WindowStyle Hidden
Start-Sleep 5
Invoke-RestMethod http://127.0.0.1:11434/api/version
```

Expected: a version is returned. If you set the profile in the machine file, the Control Room start-up helper also exports `OLLAMA_NUM_PARALLEL` from it.

If it fails: Ollama does not come back → start it from the Start menu and check `%LOCALAPPDATA%\Ollama\server.log`.

### 6.3 Smoke pipeline

```powershell
cd C:\Users\goldg\AIDevCompanyHQ
node tools\engine\engine.js start smoke
node tools\engine\engine.js status
```

Expected: the run is created, its stages go to `done`, and the final status is `done` (the smoke pipeline needs no owner gate; it is the self-test). If you run this while the studio switch is Paused, first `node .studio\studio.js resume` on BLD. BLD has its own copy of the state, so this does not affect the 5090.

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
# A) machine.json: set controlRoom.bind to "0.0.0.0" in C:\Users\goldg\AIDevCompanyHQ\.studio\machine.json
# B) one-off, for this terminal only:
$env:STUDIO_BIND = '0.0.0.0'
```

Start the Control Room and check it is reachable from the LAN address:

```powershell
cd C:\Users\goldg\AIDevCompanyHQ
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

You may be asked for the `goldg` password, because the task runs when the user is not logged on.

Start it now and check:

```powershell
Start-ScheduledTask -TaskName StudioSupervisor
Start-Sleep 70
Get-Content C:\Users\goldg\AIDevCompanyHQ\.studio\logs\supervisor.log -Tail 10
```

Expected: the log shows supervisor ticks, Ollama and the Control Room kept alive. The task `State` becomes `Running`. To remove later: `install-service.ps1 -Uninstall`.

If it fails: `State` goes to `Ready` right away → run `node studio\studio.js supervise` in a terminal to see the error. Log empty → `STUDIO_HOME` not set for the task; rerun the installer. Logon failure → the password was wrong; reinstall.

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
cd C:\Users\goldg\AIDevCompanyHQ
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

### 9.3 Final state copy

Repeat section 3.3 (the same method) from the 5090 to BLD. For a final copy remove stale files too: change `/E` to `/MIR` in the robocopy lines for `runs`, `checkpoints` and `portraits`. Then run the verification in 3.4 on BLD. Make sure `locks\`, `server.pid`, `auth.json` and `machine.json` are still **not** copied (BLD's own `machine.json` must remain).

```powershell
# [BLD] machine.json must still be the BLD profile
(Get-Content C:\Users\goldg\AIDevCompanyHQ\.studio\machine.json | ConvertFrom-Json).name
```

Expected: `bld-3090`.

If it fails: it prints `goldg-5090` → the 5090 file was copied by mistake; redo section 4 and delete `locks\`.

### 9.4 Stop the 5090's background work [5090]

```powershell
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, Path
```

Stop the studio supervisor, Control Room and any engine on the 5090 (close their terminals, or `Stop-Process -Id <id>` for the node processes that run `studio.js` or `engine.js`). Leave Ollama on the 5090 as it is; it can keep serving as a spare.

Expected: no node process on the 5090 runs `studio.js` or `engine.js`.

### 9.5 Start the supervisor on BLD

```powershell
# [BLD]
Get-ScheduledTask -TaskName StudioSupervisor | Select-Object State
Start-ScheduledTask -TaskName StudioSupervisor   # if it is not already Running
cd C:\Users\goldg\AIDevCompanyHQ
node .studio\studio.js status
```

Expected: the supervisor is `Running`; `status` shows the switch still **Paused** (the state came over paused) and lists the checkpoints that came across.

If it fails: see 8.1.

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
node tools\engine\engine.js start internal-build --var task="<one small docs task>" --var workdir="C:\Users\goldg\AIDevCompanyHQ"
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
cd C:\Users\goldg\AIDevCompanyHQ
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
Expand-Archive -Force <path to the 9.2 zip> -DestinationPath C:\Users\goldg\AIDevCompanyHQ\.studio\restore
```

Then copy the wanted folders from `restore` into `.studio` by hand.

### 10.3 Resume on the 5090

```powershell
# [5090]
cd C:\Users\goldg\AIDevCompanyHQ
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
