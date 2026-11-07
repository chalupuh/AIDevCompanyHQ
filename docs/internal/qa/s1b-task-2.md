# QA Report — Sprint 1b Task 2: resolveTeamLead

**Date:** 2026-11-06
**Reviewer:** qa-engineer
**Scope:** `tools/engine/engine.js` (resolveTeamLead), `tools/engine/pipelines/lite-build.json`, `tools/engine/selftest-team-lead.js`

---

## Acceptance Criteria vs. Implementation

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| B1 | Regex accepts plain `Team:` format | **PASS** | `resolveTeamLead()` regex `^[ \t]*[*\->]?\s*\*?Team\*?:/im` matches `Team: frontend-dev` (test case 1) |
| B2 | Regex accepts `**Team:**` bold markdown | **PASS** | Test case 12 `**Team:** bold markdown` passes; verified by manual regex trace on `**Team:** frontend-dev` |
| B3 | Regex accepts `*Team:*` single-asterisk italic | **PASS** | Test case 13 `*Team:* single-asterisk bold` passes |
| B3 | Regex accepts list bullets (`-`, `*`, `>`) | **PASS** | Test cases 14–16 cover `- Team:`, `* Team:`, `  - Team:`; edge-case probe confirmed `> Team:` |
| B3 | Regex is case-insensitive | **PASS** | Test cases 10–11 cover `team:` and `TEAM:` |
| B3 | Regex rejects false positives | **PASS** | Edge-case probe: `My team includes`, `The teammate is`, `teamwork is important` all rejected |
| B4 | Read design doc from stage's `designDoc` field | **PASS** | `engine.js` line 202: `const designPath = fill(stage.designDoc \|\| '{{slug}}.design.md', vars)` — uses `stage.designDoc` when present, falls back to convention |
| B5 | Build stage has `"designDoc": "docs/specs/{{slug}}.design.md"` | **PASS** | `lite-build.json` line 16: build stage includes `"designDoc": "docs/specs/{{slug}}.design.md"` |
| B6 | Accept absolute paths | **PASS** | `resolveTeamLead()` line 147: `path.isAbsolute(designPath) ? designPath : path.join(REPO, designPath)` — absolute paths used as-is |
| B7 | Accept repo-relative paths | **PASS** | Same line — relative paths joined with `REPO` root; verified with template resolution `{{slug}}` → actual slug |
| B8 | Selftest writes fixtures under `os.tmpdir()` | **PASS** | `selftest-team-lead.js` line 10: `const TEST_DIR = path.join(os.tmpdir(), 'studio-selftest-team-lead')`; cleanup via `fs.rmSync` at line 139 |
| B9 | Selftest includes `docs/specs/<slug>.design.md` case | **PASS** | Test case 18 (lines 104–110): creates `docs/specs/test-slug.design.md` in temp dir with `**Team:** backend-dev` content |
| B10 | All selftest cases pass | **PASS** | `node tools/engine/selftest-team-lead.js` → 18/18 passed |

## Test Results

### resolveTeamLead self-test (tools/engine/selftest-team-lead.js)
```
18/18 passed — 0 failed
```

### Engine self-test (tools/engine/selftest.js)
```
37 passed, 0 failed
```

### App test suite (vitest)
```
3 test files, 92 tests, all PASS
```

### TypeScript typecheck
```
tsc --noEmit — clean, 0 errors
```

## Edge Case Probes

| Probe | Result |
|-------|--------|
| `## Team:` (markdown heading, not plain line) | Correctly NOT matched by regex — design.md uses plain `Team:` line, not headings for the team label |
| Leading whitespace / tabs | Matched by `^[ \t]*` prefix |
| Blockquote `> Team:` | Matched — `>` is in the `[*\->]` character class |
| Absolute path to existing file | `resolveTeamLead()` reads and parses correctly |
| Absolute path to subdirectory structure | Works — `docs/specs/test-slug.design.md` under temp dir parsed correctly |
| Relative path to non-existent file | Falls back to `mobile-dev` default (correct) |
| Empty file | Falls back to `mobile-dev` default (correct) |
| Missing file | Falls back to `mobile-dev` default (correct) |
| Candidate priority order | `frontend-dev` > `mobile-dev` > `backend-dev` verified in 4 test cases |
| Template `{{slug}}` resolution | Verified `docs/specs/{{slug}}.design.md` → `docs/specs/water-tracker.design.md` |

## Code Quality Notes

- `resolveTeamLead()` is a self-contained pure function (lines 146–157), exported for testing.
- The sentinel `__team_lead__` is resolved at the right point in the state machine (line 201, after foreach expansion, before the escalation ladder).
- `designDoc` field is pipeline-level override; fallback to `{{slug}}.design.md` convention covers the common case.
- Selftest fixtures are created in `os.tmpdir()` and cleaned up — no side effects on the repo.

## Verdict

All 10 acceptance criteria met. All test suites pass. Edge cases handled correctly. No bugs found.

VERDICT: PASS
