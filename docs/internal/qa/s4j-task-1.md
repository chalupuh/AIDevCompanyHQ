# QA Report: Sprint 4j Task 1 — BLD Move-over Runbook

**Date:** 2026-11-08
**Scope:** Documentation only — `docs/runbook-bld.md`, `CLAUDE.md` (Hosts section), `docs/local-llm-roadmap.md`

---

## Verdict: **PASS**

---

## Acceptance Criteria → Result

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | `docs/runbook-bld.md` created with 10 sections | ✅ PASS | All 10 sections present (1–10, 35 subsections) |
| 2 | Section 1: Prerequisites checks (NVIDIA, Node, Git, gh, Claude Code, Ollama, disk) | ✅ PASS | 7 subsections (1.1–1.7), each with commands, expected output, failure actions |
| 3 | Section 2: Clone repos, check Sprint 4 features, `studio.home.json`, install & build | ✅ PASS | 4 subsections (2.1–2.4); `Test-Path` gates for lane H/I PRs; build + test steps |
| 4 | Section 3: Runtime state copy (pause, what to copy/not copy, SMB/SCP, verify, resume) | ✅ PASS | 5 subsections (3.1–3.5); two methods (robocopy/SCP); excludes per-machine files |
| 5 | Section 4: `machine.json` from `bld-3090` profile | ✅ PASS | Profiles validated; JSON structure matches `machine.js` shape; `bind` loopback noted |
| 6 | Section 5: Ollama model pull, GPU fit verification at context 32768 | ✅ PASS | Model pull + `ollama ps` 100% GPU check; fallback to lower context |
| 7 | Section 6: Calibrate — concurrency benchmark, apply recommendation, smoke pipeline | ✅ PASS | 3 subsections (6.1–6.3); benchmark then adjust then verify |
| 8 | Section 7: Network — firewall, LAN bind, phone pairing | ✅ PASS | 3 subsections (7.1–7.3); `LocalSubnet` firewall; QR pairing; token rotation path |
| 9 | Section 8: Always-on — scheduled task, power settings, BIOS, Windows Update | ✅ PASS | 5 subsections (8.1–8.5); supervisor task, no auto-login, AC recovery, active hours |
| 10 | Section 9: Cutover — pause 5090, backup, final copy, resume on BLD, verify, docs PR | ✅ PASS | 9 subsections (9.1–9.9); safety backup before cutover; full rollback window |
| 11 | Section 10: Rollback — pause BLD, copy state back, resume 5090, stop BLD | ✅ PASS | 5 subsections (10.1–10.5); undo supervisor + firewall; within-first-week window |
| 12 | `CLAUDE.md` — "Local models on this PC" renamed to "Hosts"; BLD IP, role change noted | ✅ PASS | Header renamed; BLD details added; `runbook-bld.md` linked |
| 13 | `docs/local-llm-roadmap.md` — "Moving to BLD" section added with link to runbook | ✅ PASS | Section added before "Decisions for later"; links to `runbook-bld.md` |
| 14 | Each step has commands, expected output, and "If it fails" action | ✅ PASS | Verified by spot-checking every subsection — all three elements present |
| 15 | Tokens/logins never go into files or runbook | ✅ PASS | `gh auth login` is browser flow; pairing link kept private; no secrets in text |
| 16 | Sprint 4 PRs (lanes H/I) checked before use (section 2.2) | ✅ PASS | `Test-Path` for `machine.js`, `supervisor.js`, `install-service.ps1`, `firewall.ps1` |
| 17 | `tools/bld-preflight.ps1` referenced as future tool (lane J task 2) | ✅ PASS | Mentioned in 1.1 preamble with "planed in Sprint 4 lane J" |

---

## Edge Cases Probed

| Scenario | Result |
|----------|--------|
| Runbook followed in wrong order | §17 preamble warns "Do each step in order. Do not continue past a failed step" |
| No Sprint 4 features merged yet | §2.2 `Test-Path` gates stop execution; failure action names the missing PRs |
| Disk space < 150 GB | §1.7 explicit stop; suggests `OLLAMA_MODELS` alternative path |
| Model doesn't fit 24 GB GPU at context 32768 | §5.1 fallback: lower context (24576 → 16384), lower `numParallel` |
| SMB share blocked | §3.3 provides SCP method B as alternative |
| Cutover fails mid-way | §10 rollback restores 5090 from backup; undo supervisor + firewall |
| BLD reboots after power loss | §8.4 BIOS AC recovery; §8.3 scheduled task auto-restarts |
| Windows Update restarts during work | §8.5 active hours minimize risk; supervisor restarts after patch |
| Two hosts diverge (5090 still running post-cutover) | §9.8 explicit instruction: 5090 only browses; no `studio.js` or `engine.js` |
| Per-machine files accidentally copied | §3.4, §9.3 verify `machine.json` still shows `bld-3090`; §3.2 lists exclusions |

---

## Findings

No bugs found. Documentation-only task; no code to compile or test. All cross-references resolve correctly:
- `runbook-bld.md` ↔ `local-llm-roadmap.md` ↔ `CLAUDE.md` all link consistently
- Section numbers match task spec (10 sections as required)
- Every step has commands + expected output + failure actions
