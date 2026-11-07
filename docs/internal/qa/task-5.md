# QA Report — Task 5: Control Room test runner (vitest 2.1.x)

**Date:** 2026-11-06
**Agent:** qa-engineer
**Scope:** `.studio/app` — vitest setup + unit tests for `src/store.ts`, `src/features/org/model.ts`, `src/features/ops/format.ts`

---

## Task description (from sprint-log.md)

> Control Room: add a test runner (vitest 2.1.x, pinned) to .studio/app with `npm test`, and unit tests for src/store.ts deriveLive, src/features/org/model.ts and src/features/ops/format.ts.

---

## Verification steps performed

| Step | Command | Result |
|---|---|---|
| Dependency install | `npm install` (in `.studio/app`) | OK |
| Run test suite | `npm test` | **3 files, 92 tests — all PASS** |
| TypeScript check | `npm run typecheck` | **clean (0 errors)** |
| Production build | `npm run build` | **OK — 47 modules, built in 354ms** |

---

## Acceptance criteria — pass/fail table

| # | Criterion | Status | Notes |
|---|---|:---:|---|
| 1 | vitest 2.1.x added as dev dependency | PASS | `vitest: "2.1.4"` — exact version, no caret/tilde |
| 2 | vitest is pinned (not `^2.1.x`) | PASS | `package.json` has `"vitest": "2.1.4"` (bare string); `package-lock.json` resolves to `2.1.4` |
| 3 | `npm test` script configured | PASS | `"test": "vitest run"` in scripts |
| 4 | `vitest.config.ts` exists, node environment | PASS | `environment: 'node'`, `include: ['src/**/*.test.ts']` |
| 5 | Unit tests for `src/store.ts` — `deriveLive` | PASS | `store.test.ts`: 16 tests covering all event types, edge cases, multi-agent |
| 6 | Unit tests for `src/features/org/model.ts` | PASS | `model.test.ts`: 53 tests covering `buildOrg`, `teamOf`, `prettyId`, `displayName`, `initials`, `relTime`, `fmtTokens`, `agentStats`, `recentEvents`, `trailEvents`, `describeEvent`, `packetFor` |
| 7 | Unit tests for `src/features/ops/format.ts` | PASS | `format.test.ts`: 23 tests covering `fmtDuration`, `fmtTokens`, `isCloudTier`, `budgetLevel`, `isEscalation`, `needsOwner` |
| 8 | Full test suite passes (all 92 tests) | PASS | vitest 2.1.4 output: `3 passed (3)`, `92 passed (92)` |
| 9 | TypeScript typecheck clean | PASS | `tsc --noEmit` exits 0, no diagnostics |
| 10 | Production build succeeds | PASS | `vite build` OK, 47 modules transformed |

---

## Edge case coverage review

### `deriveLive` (store.test.ts — 16 tests)

| Edge case | Covered? | Test |
|---|:---:|---|
| Empty events array | YES | "returns empty object for no events" |
| Event with empty/falsy agent | YES | "skips events without an agent" |
| `start` event — agent creation, task, since, lastTool reset | YES | "creates agent entry on start event" |
| `tool` pct increment + 90 cap | YES | "increments pct on tool events, capped at 90" (30 tool events) |
| `tool` with only tool name (no detail) | YES | "handles tool with only tool name" |
| `progress` overrides pct/status/task | YES | "updates pct and status on progress event" |
| `progress` with no pct (keeps existing) | YES | "keeps existing pct when progress event omits pct" |
| `done` sets status + pct=100 | YES | "sets status to done and pct 100 on done event" |
| `done` does NOT overwrite `blocked` status | YES | "does not overwrite blocked status with done" |
| `done` does NOT overwrite `paused` status | YES | "does not overwrite paused status with done" |
| `checkpoint` sets paused + task prefix | YES | "sets status to paused on checkpoint event" |
| `checkpoint` with no message | YES | "handles checkpoint with no message" |
| `resumed-agent` transitions back to working | YES | "sets status to working on resumed-agent event" |
| Multiple agents independent | YES | "tracks multiple agents independently" |
| `start` with undefined task | YES | "uses empty string as default task when start event has no task" |

### `model.ts` (model.test.ts — 53 tests)

| Function | Tests | Notable edge cases |
|---|---|---|
| `buildOrg` | 5 | default members, head exclusion, roster override, roster-only agents, parent-based assignment |
| `teamOf` | 4 | owner, members, heads, unknown agent |
| `prettyId` | 2 | kebab-case multi-word, single word |
| `displayName` | 3 | char name, fallback to prettyId, empty name fallback |
| `initials` | 5 | single word, multi-word, hyphenated, empty, whitespace-only |
| `relTime` | 6 | just-now, seconds, minutes, hours, days, future timestamps (clamp) |
| `fmtTokens` | 3 | small, thousands (k), millions (M) |
| `agentStats` | 6 | zeroed, counts, cross-agent filter, blocked, cloud/local tokens, missing fields |
| `recentEvents` | 3 | reverse order, agent filter, limit |
| `trailEvents` | 3 | excludes tool/usage, reverse order, limit |
| `describeEvent` | 8 | all event types: start, done, progress, checkpoint, paused/resumed, gate, tool, usage |
| `packetFor` | 4 | age filter, start=down, done=up, null for other types |

### `format.ts` (format.test.ts — 23 tests)

| Function | Tests | Notable edge cases |
|---|---|---|
| `fmtDuration` | 5 | negative/Infinity/NaN dash, seconds, min+s, h+m, d+h |
| `fmtTokens` | 3 | small, k (with rounding at 1e4), M (with rounding at 1e7) |
| `isCloudTier` | 3 | opus, sonnet, local, undefined |
| `budgetLevel` | 4 | zero/negative budget, <80% ok, 80-99% warn, >=100% over |
| `isEscalation` | 5 | tier mismatch, tier match, missing stage tier, missing attempt tier, stage not found |
| `needsOwner` | 3 | waiting-gate, blocked, other statuses |

---

## Observations & minor notes

1. **`jsdom` in devDependencies but not used** — `package.json` includes `jsdom: ^31.0.0` but `vitest.config.ts` uses `environment: 'node'`, so jsdom is unused. Not a blocker — jsdom may be needed for future React component tests.

2. **No test for `useStudio()` hook** — The hook is a React hook (uses `useState`, `useEffect`, `useMemo`), so unit-testing it in node environment is not feasible. Testing `deriveLive` directly is the correct approach.

3. **No lint step** — The project does not have an eslint configuration. Only typecheck (`tsc --noEmit`) and tests gate the build. This is consistent with the existing project setup (pre-dates Task 5).

4. **vitest version** — The task asked for "2.1.x pinned". `2.1.4` is the latest 2.1.x minor release. Pinning is exact (no caret), satisfying the requirement.

---

VERDICT: PASS — All 10 acceptance criteria met: vitest 2.1.4 pinned (no caret), `npm test` runs 92 tests across 3 files (all pass), typecheck clean, production build succeeds. Tests cover deriveLive (16), org/model (53), ops/format (23) with edge cases for empty input, boundary values, bad data, multi-agent, and all event types.
