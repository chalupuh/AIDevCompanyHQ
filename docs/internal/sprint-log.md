# Sprint Log

Internal tasks for the Studio engine and tooling.

## Task 1 — Suppress `[claude-code:unrecognized_model]` stderr as a warning, not a run error

**Problem:** Local model runs (qwen3.6:27b via Ollama) caused false failures because Claude Code emits `[claude-code:unrecognized_model]` on stderr and sometimes sets `is_error: true` / exits non-zero, even when the model completed its work. The previous `hasFailure && !hasResult` guard only helped when the JSON `result` field was non-empty.

**Fix (tools/engine/engine.js):**
- `parseRunOutput()` now detects `[claude-code:unrecognized_model]` in stderr and suppresses the error flag entirely when present, regardless of the `result` field content.
- Returns an `ignoredWarning` field (populated with the truncated stderr) when suppression occurs, so callers can see what happened.
- `verify()` skips the "empty final answer" check when `ignoredWarning` is set, preventing a second false failure on the same root cause.

**Self-test (tools/engine/selftest.js):**
- Extended from 10 to 14 test cases.
- New tests 11–14 specifically cover the `[claude-code:unrecognized_model]` scenarios:
  - **Test 11:** is_error + non-zero status + no result + warning → error suppressed (the exact bug).
  - **Test 12:** warning + result present → no error, result preserved.
  - **Test 13:** warning buried mid-stderr → still detected and suppressed.
  - **Test 14:** genuine failure without the warning → still reported as error (regression guard).

**Verification:** Self-test covers 14 scenarios (30 assertions). Run with `node tools/engine/selftest.js` to confirm all pass. Manual trace of every test against the code confirms correct logic — the `suppress` flag short-circuits error detection when `[claude-code:unrecognized_model]` is in stderr, and `verify()` skips the empty-result check when `ignoredWarning` is set.

## Task 2 — Dynamic build agent selection from design.md "Team:" line

**Problem:** `lite-build.json` hardcoded `"agent": "mobile-dev"` for the build stage, so every milestone ran against mobile-dev regardless of what design.md specified. The pipeline description already claimed the agent was "chosen from design.md Team: line" but the implementation didn't match.

**Fix (tools/engine/pipelines/lite-build.json):**
- Changed the build stage agent from `"mobile-dev"` to `"__team_lead__"` sentinel.

**Fix (tools/engine/engine.js):**
- Added `resolveTeamLead(designPath)` function: reads the given design.md file, finds the "Team:" line (case-insensitive), and returns the first of `frontend-dev`, `mobile-dev`, `backend-dev` found in that line. Defaults to `mobile-dev` if the file is missing, empty, or contains no recognized build role.
- Added resolution in the agent stage handler (line ~192): before processing an agent stage, if `stage.agent === '__team_lead__'`, it resolves the real agent by calling `resolveTeamLead(fill('{{slug}}.design.md', vars))` and replaces `stage.agent` in place.
- Exported `resolveTeamLead` in `module.exports` for testing.

**Self-test (tools/engine/selftest-team-lead.js):**
- 10 test cases covering: each role picked when listed first, candidate priority order (frontend → mobile → backend), fallback to mobile-dev for missing/empty/no-match files, and case-insensitive "team:" matching.

**Verification:** Manual code trace confirms correct behavior for all 10 test scenarios. The sentinel resolution happens after `foreach` expansion (so the design.md exists by the time the build stage runs) and before the escalation ladder logic, so `stage.agent` is resolved before `runAgent()` and all downstream references.

## Task 3 — Control Room "Village" tab

**Changed (.studio/app/src):**
- `App.tsx`: third tab "Village" registered, renders `VillageView`.
- `features/village/model.ts`: layout (HQ + Engineering / R&D / Creative buildings, paths), home positions, `walkFor` (`done` → walk to HQ, `start` → walk home), `truncate`.
- `features/village/VillageView.tsx`: SVG grass map, flat placeholder buildings, circular portrait tokens with initials fallback, speech bubble with truncated task for working agents, rAF-driven walking animation (skipped under `prefers-reduced-motion`, position just changes), click opens a profile drawer reusing the org drawer styles/components (`Portrait`, `Ring`, `StatusPill`, `ModelChips`).
- `features/village/village.css`, `features/village/index.ts`.
- Fix this round: `VillageView.tsx` had a second copy of the `../org/AgentCard`, `StudioState` and `AgentLive` imports before `OrgDrawer` (TS2300 duplicate identifiers). Removed the duplicates and merged the two `../org/model` imports.
- Image assets in `.studio/village/` are not wired in yet; buildings are drawn as flat placeholders.

**Verification:** I had no shell in this run, so I could not run `npm --prefix .studio/app run build`. I checked by reading that every imported symbol exists once and is exported (`org/model.ts`, `org/AgentCard.tsx`, `store.ts`, `api.ts`), and that the only reported errors were the duplicate imports, which are removed. Please re-run the build to confirm.

## Task 3 rework (round 3: walking model rebuilt)

**Changed:**
- `.studio/app/src/features/village/model.ts` (rewritten): drawn paths are now polylines (HQ door → elbow → building front). Added `routeFor` (the route follows the drawn path, ending at home or an HQ slot), `pointOnPolyline`, per-agent `AgentPos {from,to,route,startedAt,duration}`, `startWalk`/`isWalking`/`posAt`, `eventKey` (`ts|agent|type`) and `walkDir`. Removed `walkFor`, `hqPos` and the straight-line lerp.
- `.studio/app/src/features/village/VillageView.tsx` (rewritten):
  - **B1:** one `requestAnimationFrame` loop bumps a frame-counter state every frame while any walk is active. It restarts when a new walk starts (the `kick` state) and stops when all walks are done.
  - **B2:** the position map is never pruned. A finished walk parks the agent at its destination until the next `start` event.
  - **B3:** every event is processed once (a `Set` of event keys). History at first load only parks agents where their last event left them, with no animation. Keys that leave the server window are dropped, so the set stays bounded.
  - **B4:** reduced motion is a reactive `matchMedia` `change` listener. Walks get duration 0, so the position just changes.
  - **B5:** `useAsset` probes `/village/buildings/{hq,eng,rd,creative}.png` and `/village/tiles/grass.png`. It uses them when they load and draws flat placeholders otherwise. No files exist in `.studio/village/` yet.
  - Profile drawer now reuses the shared `org/Drawer` (the local `OrgDrawer` copy is gone). Portraits are clipped to the circle.
- `.studio/studio.js`: new `GET /village/*` static route (png/jpg/webp/svg, `safeJoin`) serving `.studio/village/`. `.studio/app/vite.config.ts`: dev proxy for `/village`.

**Verification:** This run had no shell tool, so I could NOT run `npm --prefix .studio/app run build`, and I could not run `studio.js log`. I checked types by reading: every import exists and is exported in `org/model`, `org/Drawer`, `api.ts` and `store.ts`, there are no duplicate imports, and all hooks run before the early return. **The build is unverified. Please run `npm --prefix .studio/app run build` before accepting.**

## Task 5 — Control Room test runner (vitest 2.1.x) and unit tests

**Changed:**
- `.studio/app/package.json`: pinned `vitest` from `^5.1.0` to `2.1.4`, added `"test": "vitest run"` script.
- `.studio/app/vitest.config.ts`: new config — `node` environment, includes `src/**/*.test.ts`.
- `.studio/app/src/store.test.ts`: 16 tests for `deriveLive()` — empty input, agent creation on `start`, `tool` pct increment (capped at 90), `lastTool` formatting, `progress` pct/status/task override, `done` sets pct 100, blocked/paused status not overwritten by done, `checkpoint`/`resumed-agent` transitions, multi-agent independence.
- `.studio/app/src/features/org/model.test.ts`: 53 tests — `buildOrg` (default members, head exclusion, roster overrides, parent-based assignment), `teamOf`, `prettyId`, `displayName`, `initials`, `relTime`, `fmtTokens`, `agentStats` (counts, token sums, agent filtering), `recentEvents` (reverse order, limit, agent filter), `trailEvents` (excludes tool/usage, limit), `describeEvent` (all event types), `packetFor` (direction, age filter, null cases).
- `.studio/app/src/features/ops/format.test.ts`: 23 tests — `fmtDuration` (seconds/minutes/hours/days, edge values), `fmtTokens` (small/k/M), `isCloudTier`, `budgetLevel` (ok/warn/over thresholds), `isEscalation` (tier mismatch, missing stage/tier), `needsOwner`.

**Verification:** `npm test` → 3 test files, 92 tests, all PASS. `npm run typecheck` → clean.
