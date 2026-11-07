# QA Report: Task 1 — Suppress `[claude-code:unrecognized_model]` stderr warning

**Date:** 2026-11-06
**Reviewer:** qa-engineer
**Files under review:**
- `tools/engine/engine.js` — `parseRunOutput()` and `verify()`
- `tools/engine/selftest.js` — 14 test cases, 31 assertions
- `docs/internal/sprint-log.md` — Task 1 description

---

## Acceptance Criteria (from sprint task description)

| # | Criterion | Status |
|---|-----------|--------|
| AC1 | `parseRunOutput()` treats `[claude-code:unrecognized_model]` stderr warning as a warning, not a run error | ✅ PASS |
| AC2 | Only `is_error` / non-zero status with **no result** counts as an error | ✅ PASS |
| AC3 | Self-test script `tools/engine/selftest.js` covers the parsing logic | ✅ PASS |
| AC4 | `verify()` skips empty-result check when `ignoredWarning` is set | ✅ PASS |

---

## Code Review: `parseRunOutput()` (engine.js lines 77–94)

### Logic trace

```
modelWarning = stderr.includes('[claude-code:unrecognized_model]')
hasFailure   = out.is_error || r.status !== 0
hasResult    = !!out.result
suppress     = modelWarning        // always true when warning present
error = (hasFailure && !hasResult && !suppress) ? stderr.slice(-800) || out.subtype : null
ignoredWarning = suppress ? stderr.slice(0, 300) : null
```

**Correctness:** The suppression logic is sound. When `[claude-code:unrecognized_model]` appears anywhere in stderr, the `suppress` flag becomes `true`, and the `error` field is always `null` regardless of `is_error` or exit status. This matches the task description: "suppresses the error flag entirely when present, regardless of the `result` field content."

### Per-test-code path verification

| Test | Input | Expected | Code produces |
|------|-------|----------|---------------|
| 1 — clean success | status=0, result='done', no stderr | error=null, result='done', turns=5 | ✅ |
| 2 — warning on success | status=0, result='done', warning in stderr | error=null, result='done' | ✅ |
| 3 — is_error + result | status=0, is_error=true, result present | error=null (hasResult blocks error) | ✅ |
| 4 — is_error + no result | status=0, is_error=true, no result, no warning | error='Timed out...' | ✅ |
| 5 — non-zero + no result | status=1, no result, no warning | error='Process crashed...' | ✅ |
| 6 — both signals + no result | status=2, is_error=true, no result | error='Fatal: config missing' | ✅ |
| 7 — empty stderr fallback | status=1, is_error=true, stderr='' | error='error_max_turns' (subtype), hitTurnCap=true | ✅ |
| 8 — empty stdout | status=0, stdout='' | error=null, result='' | ✅ |
| 9 — malformed JSON | status=0, stdout='not json' | error=null, result='' | ✅ |
| 10 — usage parsing | status=0, result='ok', usage present | usage={in:1000, out:500, cached:200} | ✅ |
| 11 — **KEY BUG**: warning + failure + no result | status=1, is_error=true, no result, warning | error=null, ignoredWarning set, turns=3 | ✅ |
| 12 — warning + result | status=1, is_error=true, result present, warning | error=null, result preserved | ✅ |
| 13 — warning buried mid-stderr | status=1, is_error=true, warning surrounded by text | error=null, ignoredWarning set | ✅ |
| 14 — genuine failure no warning | status=1, is_error=true, no warning | error set, ignoredWarning=null | ✅ |

**All 14 test cases trace correctly against the code.**

---

## Code Review: `verify()` integration (engine.js lines 122–136)

```javascript
if (res.error) problems.push('run error: ' + res.error);
if (res.hitTurnCap) problems.push('...');
if (!res.result.trim() && !res.ignoredWarning) problems.push('empty final answer');
```

- Line 126: The `&& !res.ignoredWarning` guard correctly prevents the "empty final answer" problem when suppression was triggered. When the model warning caused suppression, `ignoredWarning` is a non-empty string (truthy), so the empty-result check is skipped.
- Line 124: `res.error` is `null` when suppressed, so no "run error" is pushed either.
- **The verify() integration is correct.** A suppressed run that produced no result will not trigger a false failure through either path.

---

## Self-test Coverage Assessment

### Coverage gaps (minor)

| Gap | Severity | Description |
|-----|----------|-------------|
| G1 | Low | No test calls `verify()` directly. The test suite only covers `parseRunOutput()`. The interaction between `parseRunOutput().ignoredWarning` and `verify()` empty-result guard is verified by code inspection but not by an automated assertion. |
| G2 | Low | Assertion count discrepancy: sprint-log.md says "30 assertions" but the script has 31 `assert()` calls. Minor documentation inaccuracy. |
| G3 | Low | Test 10 bundles 3 conditions (`r.usage.in === 1000 && r.usage.out === 500 && r.usage.cached === 200`) into a single `assert()`. If one sub-condition failed, the assertion name wouldn't indicate which one. Consider splitting for better diagnostics. |

### Edge cases NOT covered (informational, not blocking)

| Edge case | Risk | Notes |
|-----------|------|-------|
| `suppress=true` + a real crash alongside the model warning (e.g., OOM) | Low | The current design suppresses ALL errors when the model warning is present, which is the stated intent. A real crash in the same run would also be suppressed, but this is by design per the task description. |
| Whitespace-only result (e.g., `result: "   "`) | Low | `hasResult` checks `!!out.result` which is truthy for `"   "`, so `parseRunOutput` would not report an error. However, `verify()` checks `!res.result.trim()` which would catch this. The split is consistent. |
| Very long stderr (> 300 chars with warning, > 800 chars without) | Negligible | `slice(0, 300)` and `slice(-800)` are reasonable truncations for logging/debugging. |

---

## Build / Test Execution

**Self-test script:** `node tools/engine/selftest.js`
- The script has a correct entry point (`process.exit(fail > 0 ? 1 : 0)`) and will return non-zero on any assertion failure.
- All 14 test cases were traced against the implementation code and produce the expected results.
- **Note:** Unable to execute `node` commands in this environment. Verification is by code inspection and static trace. In a live environment, run `node tools/engine/selftest.js` to confirm 31/31 assertions pass.

**Lint / Typecheck:** The project has no ESLint or TypeScript config for `tools/engine/`. The code is plain JavaScript with no type annotations, which is consistent with the rest of the engine codebase.

---

## Verdict

**PASS**

The implementation correctly suppresses the `[claude-code:unrecognized_model]` stderr warning as a non-error condition. The self-test covers the core bug scenario (test 11) plus regression guards (tests 1-10, 14) and edge positions (test 13). The `verify()` integration properly skips the empty-result check when suppression occurs. Three minor gaps (G1–G3) are noted but do not affect correctness.

VERDICT: PASS
