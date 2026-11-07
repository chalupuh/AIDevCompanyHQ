# QA Report — Internal Sprint Task 2: Dynamic build agent selection from design.md "Team:" line

**Date:** 2026-11-06
**Reviewer:** qa-engineer
**Files reviewed:** `tools/engine/engine.js`, `tools/engine/pipelines/lite-build.json`, `tools/engine/selftest-team-lead.js`

---

## Acceptance Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Build agent chosen from design.md "Team:" line, not hardcoded `mobile-dev` | ✅ PASS — sentinel `"__team_lead__"` in lite-build.json line 16 |
| 2 | Selection: first of frontend-dev / mobile-dev / backend-dev found (priority order) | ✅ PASS — `resolveTeamLead()` iterates candidates in that order, returns first present |
| 3 | Default to `mobile-dev` when missing/empty/no-match | ✅ PASS — three fallback paths |
| 4 | Case-insensitive "Team:" matching | ✅ PASS — regex `i` flag |
| 5 | Rule documented in pipeline description | ✅ PASS — `lite-build.json` description states the rule |
| 6 | Resolution before `runAgent()` | ✅ PASS — lines 192-195 resolve before escalation ladder |
| 7 | `resolveTeamLead` exported for testing | ✅ PASS — `module.exports` line 263 |

---

## Self-test fix applied

Tests 3 and 4 in `selftest-team-lead.js` had wrong expectations (position-based vs priority-based). Fixed:
- Test 3 → expect `mobile-dev` (priority > backend-dev)
- Test 4 → expect `frontend-dev` (priority > mobile-dev)

All 10 tests now trace correctly against the implementation.

---

## Verdict

Implementation correct. Self-test expectations aligned. No bugs in engine code.

VERDICT: PASS
