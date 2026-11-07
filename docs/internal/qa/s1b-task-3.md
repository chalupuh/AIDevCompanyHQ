# QA Report: Sprint 1b Task 3 — Externalize Git Bash path + engine test runner

**Date:** 2026-11-06
**QA Engineer:** qa-engineer (automated)
**Task:** Review S6 (engine part) + S8: move the Git Bash path out of the hard-coded list; read `STUDIO_GIT_BASH` env, then `.studio/machine.json` `gitBash`, then `C:\Program Files\Git\bin\bash.exe`. Add `tools/engine/test.js` npm-free test runner. Make internal-build QA stage require `node tools/engine/test.js` when engine files changed.

---

## Acceptance Criteria vs. Implementation

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Git Bash path resolution order: (1) `STUDIO_GIT_BASH` env, (2) `.studio/machine.json` `gitBash`, (3) `C:\Program Files\Git\bin\bash.exe` | PASS | `engine.js` line 102: `candidates = [process.env.STUDIO_GIT_BASH, machineCfg.gitBash, 'C:\\Program Files\\Git\\bin\\bash.exe']` — order matches spec exactly. |
| 2 | Hard-coded `E:\Claude Projects\Git\bin\bash.exe` removed from `engine.js` candidates | PASS | Diff confirms removal. Source scan of `runAgent()` section finds zero occurrences of the old `E:\` path. |
| 3 | `.studio/machine.json` created with `{"gitBash": "E:\\Claude Projects\\Git\\bin\\bash.exe"}` | PASS | File exists, parses valid JSON, `gitBash` value matches. Path exists on disk (`fs.existsSync` = true). |
| 4 | `.studio/machine.json` is gitignored | PASS | `.gitignore` contains `.studio/machine.json` on line 17 with comment. |
| 5 | `machine.json` read with safe error handling (try/catch, empty fallback) | PASS | `engine.js` line 101: `(() => { try { return JSON.parse(fs.readFileSync(...)); } catch { return {}; } })()` — returns `{}` on any failure. |
| 6 | `tools/engine/test.js` created as npm-free test runner | PASS | File exists. Uses only `child_process.spawnSync` and `path` — no npm dependencies. Runs both `selftest.js` and `selftest-team-lead.js`. |
| 7 | `test.js` exits non-zero on any failure | PASS | `anyFailed` flag tracked across suites; `process.exit(1)` on failure. `process.exit(0)` only if all pass. |
| 8 | `internal-build.json` QA stage task instructs to run `node tools/engine/test.js` when engine files changed | PASS | QA task text: *"If any file under tools/engine/ changed in this task, run `node tools/engine/test.js` and treat a non-zero exit as a QA failure."* |
| 9 | All engine self-tests pass | PASS | 37/37 parseRunOutput/verify assertions + 18/18 resolveTeamLead assertions = 55/55 total. |
| 10 | App build passes | PASS | `npm --prefix .studio/app run build` → tsc clean, vite built 47 modules, 386ms. |

---

## Test Execution Summary

### `node tools/engine/test.js`
```
--- parseRunOutput / verify (selftest.js) ---
37 passed, 0 failed.
  OK

--- resolveTeamLead (selftest-team-lead.js) ---
18/18 passed
  OK

All self-tests passed.
```
Exit code: 0.

### `npm --prefix .studio/app run build`
```
tsc --noEmit && vite build
✓ 47 modules transformed.
✓ built in 386ms
```
Exit code: 0.

---

## Edge Case Probes

| Probe | Result |
|-------|--------|
| `machine.json` `gitBash` path exists on disk | PASS — `fs.existsSync()` = true |
| Old `E:\` path not present in `engine.js` candidates array | PASS — source scan clean |
| `machine.json` missing/unreadable → no crash (empty object fallback) | PASS — try/catch returns `{}` |
| `test.js` references both selftest files | PASS — `selftest.js` and `selftest-team-lead.js` both listed |
| `test.js` exits non-zero on failure | PASS — `process.exit(1)` confirmed in source |
| `.gitignore` prevents committing `machine.json` | PASS — entry present with comment |
| `verify()` exported for testing (from Sprint 1b Task 1 carryover) | PASS — `module.exports` includes `verify` |
| `parseRunOutput` detects `r.error` and `r.signal` (spawn/timeout) | PASS — `hasFailure` expanded to `out.is_error \|\| r.status !== 0 \|\| !!r.error \|\| !!r.signal` |

---

## Bug Findings

None.

---

## Notes

- The `resolveTeamLead` function was also improved in this diff: now accepts absolute paths (via `path.isAbsolute` check) and uses a more robust regex for the Team line (handles list bullets, bold markdown, and case variations). These changes are covered by 8 additional test cases in `selftest-team-lead.js` (tests 11-18).
- The `__team_lead__` resolution now supports `stage.designDoc` override, allowing pipeline authors to specify a non-default design.md path. This is a positive side effect of the sprint work.
- The `ignoredWarning` bypass from Sprint 1b Task 1 was correctly removed in `verify()` — empty results are always flagged regardless of warning presence.

---

VERDICT: PASS
