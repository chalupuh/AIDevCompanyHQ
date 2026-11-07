# QA Report — Sprint 1b Task 5

**Date:** 2026-11-06
**QA Engineer:** qa-engineer (automated)
**Task:** Village model tests migration + walking model tests + cleanup

---

## Task Description (from sprint-log.md §Sprint 1b Task 5)

Move village model tests to `.studio/app/src/features/village/model.test.ts` as vitest (fix the truncate expectation to `'a very lon…'`), add tests for the walking model (route/path interpolation, posAt, startWalk under reduced motion, event dedupe), delete `.studio/app/tests/village.test.ts`, `tests/village-model.test.ts` and `tests/tsconfig.test.json`, and remove the unused jsdom dependency and the bogus `allowScripts` field from `.studio/app/package.json`. `npm --prefix .studio/app test` must run the village tests and pass.

---

## Acceptance Criteria Mapping

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Village model tests moved to `.studio/app/src/features/village/model.test.ts` as vitest | **PASS** | File exists, 57 tests, `vitest run` discovers and runs them |
| 2 | Truncate expectation fixed to `'a very lon…'` | **PASS** | Line 191: `expect(truncate('a very long task name here', 10)).toBe('a very lon…');` — correct (10 chars + ellipsis) |
| 3a | Walking model: route/path interpolation (`pointOnPolyline`) | **PASS** | 6 tests covering midpoint, f=0, f=1, empty polyline, bent path, single-point polyline |
| 3b | Walking model: `posAt` (destination parking, start point, reduced motion) | **PASS** | 3 tests in `posAt` describe block + boundary verified by QA edge probe |
| 3c | Walking model: `startWalk` under reduced motion | **PASS** | `startWalk` sets duration=0 when reduced=true (test in startWalk block), reduced-motion lifecycle section with 2 tests |
| 3d | Walking model: event dedupe (`eventKey`) | **PASS** | 4 tests: different timestamps, types, agents produce unique keys; identical events produce identical keys |
| 4 | Delete `.studio/app/tests/village.test.ts` | **PASS** | File does not exist; `tests/` directory removed entirely |
| 5 | Delete `.studio/app/tests/village-model.test.ts` | **PASS** | File does not exist |
| 6 | Delete `.studio/app/tests/tsconfig.test.json` | **PASS** | File does not exist |
| 7 | Remove `jsdom` from `package.json` | **PASS** | `grep jsdom package.json` returns no matches |
| 8 | Remove `allowScripts` from `package.json` | **PASS** | `grep allowScripts package.json` returns no matches |
| 9 | `npm --prefix .studio/app test` runs village tests and passes | **PASS** | 4 test files, 149 tests total (57 village), all pass |
| 10 | Build succeeds (`npm run build`) | **PASS** | `tsc --noEmit` clean, vite build produces 47 modules, ~192 kB JS + 22 kB CSS |
| 11 | Typecheck succeeds (`npm run typecheck`) | **PASS** | `tsc --noEmit` exits 0, no errors |

---

## QA Edge-Case Probes

Additional edge cases probed via temporary `qa-edge.test.ts` (8 tests, all PASS):

| Edge Case | Result |
|-----------|--------|
| `truncate()` with 1000-char string | Correctly truncates to max + ellipsis |
| `posAt()` at exact boundary (`now + duration`) | Parks at destination (isWalking returns false) |
| `posAt()` at midpoint of walk | Returns position along route (~50, 50) |
| `routeFor()` to-hq has 2+ points | Route has multiple points |
| `routeFor()` to-home has 2+ points | Route has multiple points |
| `polyLength()` with identical points | Returns 0 |
| `pointOnPolyline()` with negative fraction | Clamped to start point |
| `pointOnPolyline()` with fraction > 1 | Clamped to end point |

---

## Test Coverage Summary

**village/model.test.ts** — 57 tests across 17 describe blocks:

| Module | Tests |
|--------|-------|
| viewport dimensions | 1 |
| building constants | 4 |
| `buildingForTeam` | 3 |
| `hqDoor` | 1 |
| `pathPoints` | 3 |
| `homePos` | 4 |
| `hqSlot` | 1 |
| `truncate` | 4 |
| `walkDir` | 4 |
| `eventKey` (dedupe) | 4 |
| `routeFor` | 3 |
| `polyLength` | 3 |
| `pointOnPolyline` (interpolation) | 6 |
| `startWalk` | 3 |
| `isWalking` | 2 |
| `posAt` | 3 |
| reduced motion walking | 2 |
| `allAgentIds` | 3 |
| `charOf` | 3 |

---

## Findings

**No bugs found.** All acceptance criteria met. Code quality is good:

- Pure functions with no side effects
- Proper type exports for testing
- Edge cases handled (empty polyline, null truncate input, reduced motion)
- Event deduplication via stable keys
- Reduced-motion accessibility support (duration=0, instant position change)

**Minor note (not a blocker):** `truncate()` has a truthiness guard (`if (!s)`) that treats `0` and other falsy non-string values as empty. The type signature accepts `string`, so this is defensive but correct behavior.

---

VERDICT: PASS
