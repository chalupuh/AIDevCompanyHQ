# QA Report: Sprint 1b Task 1 — Restore real failure detection (B4 critical)

**Date:** 2026-11-06
**Agent:** qa-engineer
**Source commit:** `c70bb99` (feat(control-room): internal sprint 1)
**Files under review:** `tools/engine/engine.js` (parseRunOutput, verify, module.exports), `tools/engine/selftest.js`

---

## Acceptance Criteria Verification

| # | Criterion (from task description) | Status | Notes |
|---|---|---|---|
| 1 | `hasFailure = out.is_error \|\| r.status !== 0 \|\| !!r.error \|\| !!r.signal` | PASS | Line 81 — all four signals present, including new `r.error` and `r.signal` |
| 2 | Error only when `hasFailure && no result` | PASS | Line 86 — `(hasFailure && !hasResult)` guard, partial success (hasFailure+hasResult) does not error |
| 3 | unrecognized_model warning logged to `ignoredWarning` but NEVER suppresses error | PASS | Line 87 — `ignoredWarning` populated when warning detected; no `suppress` variable exists; error condition on line 86 is independent of `modelWarning` |
| 4 | Remove `&& !res.ignoredWarning` bypass in `verify()` so "empty final answer" is always checked | PASS | Line 130 — `if (!res.result.trim())` fires unconditionally, no `ignoredWarning` guard |
| 5 | Flip test 11 to expect an error | PASS | Test 11 (line 134) asserts `r.error !== null` for `unrecognized_model + is_error + status!=0 + no result` |
| 6 | Add timeout case (status null, signal SIGTERM) | PASS | Test 15 (lines 175-187) — `status: null, signal: 'SIGTERM', no result → error reported` |
| 7 | Add direct `verify()` test | PASS | Test 16 (lines 189-217) — three sub-tests: error+empty, clean success, ignoredWarning+empty result |

## Self-Test Results

```
37 passed, 0 failed.
```

All 16 test scenarios (tests 1-16) pass, covering 37 individual assertions.

## Edge Case Probes

| Scenario | Expected | Actual | Status |
|---|---|---|---|
| `status=0 + r.error` (spawn error with zero exit) | Error reported | Error reported | PASS |
| `status=0 + signal` (defensive, impossible in practice) | Error reported | Error reported | PASS |
| Whitespace-only result, no failure signals | parseRunOutput: no error; verify(): "empty final answer" | Correct | PASS |
| Partial success (hasFailure+hasResult) | No error (result produced despite failure signals) | No error | PASS |
| `r.error` as Error object (EACCES), no result | Error reported | Error reported | PASS |
| `status: null + signal: null + no result` (theoretical) | No failure (all four signals falsy) | No error | PASS |

## Code Quality Notes

1. **Comment update (lines 70-75):** The doc comment for `parseRunOutput()` accurately describes the new behavior: four failure signals, error only when `hasFailure && !hasResult`, and the explicit note that the unrecognized_model warning is logged but never suppresses errors.

2. **`verify()` export (line 267):** Added `verify` to `module.exports` alongside `parseRunOutput` and `resolveTeamLead`, enabling direct unit testing of the verify function.

3. **Defensive coding:** The expanded `hasFailure` now catches `r.error` (spawnSync error object) and `r.signal` (termination signal). This means timeout-killed processes and spawn errors are detected even if status is null.

4. **Backward compatibility:** The `ignoredWarning` field is still populated for observability when `[claude-code:unrecognized_model]` is in stderr. Callers can log this for diagnostics. The change only affects whether the error is suppressed (no longer suppressed) — the warning is still visible.

## No Bugs Found

The implementation matches the task specification exactly. All acceptance criteria verified. All tests pass. Edge cases behave correctly.

---

VERDICT: PASS
