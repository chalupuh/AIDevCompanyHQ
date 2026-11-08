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

## Sprint 1b Task 1 — Restore real failure detection in parseRunOutput/verify

**Problem (B4 critical):** Task 1's fix over-suppressed: the `[claude-code:unrecognized_model]` warning suppressed ALL errors, even genuine failures with no result. `verify()` also skipped the "empty final answer" check when `ignoredWarning` was set, masking broken runs.

**Changed (tools/engine/engine.js — parseRunOutput):**
- `hasFailure` expanded: `out.is_error || r.status !== 0 || !!r.error || !!r.signal` (added `r.error` and `r.signal` for spawn failures and signal-terminated processes).
- Removed the `suppress = modelWarning` flag — the warning is logged to `ignoredWarning` for observability but NEVER suppresses an error.
- Error condition simplified to `(hasFailure && !hasResult)` — a partial success (hasFailure but hasResult) still does not report an error.

**Changed (tools/engine/engine.js — verify):**
- Removed `&& !res.ignoredWarning` bypass from the "empty final answer" check, so empty results are always flagged regardless of warnings.
- Exported `verify` in `module.exports` for direct testing.

**Changed (tools/engine/selftest.js):**
- Flipped test 11: `unrecognized_model + failure + no result` now expects an error (was suppressed before).
- Flipped test 13: `unrecognized_model buried in stderr + failure` now expects an error (was suppressed before).
- Added test 15: timeout case — `status: null`, `signal: SIGTERM`, no result → error reported via `r.signal` in `hasFailure`.
- Added test 16: direct `verify()` tests — error + empty result reports both problems; clean success has no problems; ignoredWarning does not bypass "empty final answer".

**Verification (self-test):** `node tools/engine/selftest.js` → **37 passed, 0 failed** across 16 test scenarios.

**Verification (QA):** QA engineer ran selftest and additional edge-case probes. All 37 assertions pass. Edge cases confirmed: whitespace-only result caught by verify(), r.error object (EACCES) detected, signal-based timeout detected, partial success (hasFailure+hasResult) not flagged. Report: `docs/internal/qa/s1b-task-1.md`.

```
✓ clean success → no error
  ✓ clean success → result preserved
  ✓ clean success → turns parsed
  ✓ stderr warning on success → no error
  ✓ stderr warning on success → result preserved
  ✓ is_error + has result → no error (partial success)
  ✓ is_error + has result → result preserved
  ✓ is_error + no result → error reported
  ✓ is_error + no result → stderr captured
  ✓ non-zero status + no result → error reported
  ✓ non-zero status + no result → stderr captured
  ✓ is_error + non-zero + no result → error reported
  ✓ is_error + non-zero + no result → stderr captured
  ✓ empty stderr + is_error + no result → subtype used
  ✓ empty stderr + is_error + no result → hitTurnCap true
  ✓ empty stdout → no error
  ✓ empty stdout → result is empty string
  ✓ malformed JSON → no error
  ✓ malformed JSON → result is empty string
  ✓ usage parsed correctly
  ✓ unrecognized_model + failure + no result → error reported (not suppressed)
  ✓ unrecognized_model → ignoredWarning still logged
  ✓ unrecognized_model → ignoredWarning contains the message
  ✓ unrecognized_model → turns still parsed
  ✓ unrecognized_model + has result → no error
  ✓ unrecognized_model + has result → result preserved
  ✓ unrecognized_model + has result → ignoredWarning set
  ✓ unrecognized_model buried in stderr → error reported (not suppressed)
  ✓ unrecognized_model buried → ignoredWarning still logged
  ✓ genuine failure without model warning → error reported
  ✓ genuine failure → ignoredWarning is null
  ✓ timeout (signal SIGTERM, no result) → error reported
  ✓ timeout → stderr captured in error
  ✓ timeout → ignoredWarning is null
  ✓ verify() with error + empty result → reports both error and empty answer
  ✓ verify() with clean success → no problems
  ✓ verify() with ignoredWarning + empty result → empty final answer still reported

37 passed, 0 failed.
```

## Sprint 1b Task 3 — Externalize Git Bash path + engine test runner

**Problem (S6 engine + S8):** Hard-coded Git Bash path `E:\Claude Projects\Git\bin\bash.exe` in `engine.js` meant every new machine needed a code change to find its shell. No single npm-free command ran all engine self-tests.

**Changed (tools/engine/engine.js — runAgent):**
- Git Bash resolution order: (1) env `STUDIO_GIT_BASH`, (2) `.studio/machine.json` field `gitBash`, (3) system default `C:\Program Files\Git\bin\bash.exe`. Hard-coded `E:\` path removed.
- `machine.json` is read safely (try/catch, empty object fallback if missing).

**Changed (.studio/machine.json — created):**
- `{"gitBash": "E:\\Claude Projects\\Git\\bin\\bash.exe"}` — machine-local config for this PC. Other developers create their own with their path.

**Changed (.gitignore):**
- Added `.studio/machine.json` so per-machine paths never get committed.

**Changed (tools/engine/test.js — created):**
- NPM-free test runner: `node tools/engine/test.js` spawns both `selftest.js` (parseRunOutput/verify, 37 assertions) and `selftest-team-lead.js` (resolveTeamLead, 18 assertions), inherits output, exits 1 if any suite fails.

**Changed (tools/engine/pipelines/internal-build.json):**
- QA stage task now instructs: "If any file under tools/engine/ changed in this task, run `node tools/engine/test.js` and treat a non-zero exit as a QA failure."

**Verification:**
- `node tools/engine/test.js` → 37/37 parseRunOutput assertions + 18/18 resolveTeamLead assertions, all PASS, exit 0.
- Resolution logic tested in three scenarios: no env → picks machine.json path; bad env → picks machine.json path; no machine.json → falls through to system default (correct on this PC where system default doesn't exist).

## Sprint 1b Task 4
**S1 (kept):** team-colour avatar override reverted in `AgentCard.tsx` / `org.css`; agents use their own `c.color`, only the owner fallback uses `var(--owner)`.

**S2 rework (`.studio/app/src/features/org/Chart.tsx`, `org.css`):**
- S2-B1: a drag moving >4 px (`DRAG_THRESHOLD`) installs a one-shot capture-phase `click` swallower on mouseup, so the drag doesn't open a card.
- S2-B2: `preventDefault()` on mousedown for pan starts; skipped when the target is within `button, a, .o-card, .o-toggle`.
- S2-B3: cursor via CSS: `.o-zoom-viewport{cursor:grab}` and `.dragging{cursor:grabbing}` (class toggled on the viewport); inline cursor styles removed.

**Verified:** `npm --prefix .studio/app run build` OK; `npm --prefix .studio/app test` 92/92 pass. Drag behaviour has no unit test (no DOM test environment in the app); checked by code reading only.

## Sprint 2d Task 1 — Fixed per-asset review format for creative-director Mode B

**Changed (.claude/agents/creative-director.md):**
- **Mode B: Review** section now specifies a fixed per-asset format block (in a fenced code block) that must be used for every asset reviewed. The format requires five fields per asset:
  - **Verdict:** APPROVE / REDO
  - **What works:** (specific strengths aligned to the brief)
  - **What doesn't:** (specific visible issues — colour, composition, artifacts, dimensions, legibility, originality)
  - **Redo instruction:** (exact prompt change or parameter tweak; omit if APPROVE)
  - **Originality check:** (confirm no imitation of another brand's logo/mascot/trade dress; no living-artist name or "style of <studio>"; no real-person likeness)

**Changed (tools/engine/pipelines/creative-portraits.json):**
- **'pick' task text:** now explicitly requires the fixed per-asset format when writing the review.md.
- **Copy instruction:** replaced `cp` with `node -e "require('fs').copyFileSync('src','dst')"` — a Node.js one-liner that avoids shell compatibility issues.
- **allowedTools:** replaced `Bash(cp *)` with `Bash(node -e*)` to permit the new copy command while keeping the tool scope narrow.

**Verification:**
- creative-director.md: grepped for `Verdict.*APPROVE.*REDO` — found on line 18 inside the fenced format block.
- creative-portraits.json: parsed with `JSON.parse()` — valid JSON. Confirmed `allowedTools` contains `Bash(node -e*)` (not `cp`), task text contains `copyFileSync` and `per-asset format`.

## Sprint 2d Task 2 — ADR 0003: Static pipelines; managers review at gates only

**Changed:**
- **`docs/adr/0003-static-pipelines-managers-review.md`** (created): Documents the decision that pipelines are static JSON run by the engine; manager roles (`rd-manager`, `creative-director`, `code-reviewer`) only review at gates and never route work dynamically. Covers why (cost predictability, reproducibility, consistency with ADR 0001's tier separation), consequences (positive and trade-offs), and implementation notes mapping the existing pipeline JSON files to the pattern.
- **`CLAUDE.md`** (line 33): Added `(ADR 0003)` reference to the Workflow Engine section heading alongside the existing ADR 0001 link.

**Verification:**
- ADR follows the same structure as ADR 0001 and ADR 0002: Status/Date/Owner header, Context, Decision (with table), Consequences (positive, trade-offs, implementation notes).
- Cross-references ADR 0001 (model placement tiers) and ADR 0002 (repos).
- Concrete examples drawn from actual pipeline files (`rd-cycle.json`, `lite-build.json`, `smoke.json`).
- CLAUDE.md heading updated and grep-confirmed at line 33.

## Sprint 2d Task 4 — Stage contracts: `requires` (inputs) and `dod` (output headings) on pipeline stages

**Problem:** Pipeline stage definitions had `expect` (output file paths) and `check` (validation commands) but no declarative list of which inputs each stage reads, and no Definition of Done for the required structure of outputs. The engine and the reading agent had to infer contracts from the `task` text alone.

**Changed (tools/engine/pipelines/rd-cycle.json):**
- **brief**: `requires` — `brief-template.md`, `backlog.md`; `dod` — `## Theme`, `## Constraints`, `## Targets`
- **scan**: `requires` — `brief.md`; `dod` — `## Hot`, `## Warm`, `## Cold`, `ANALYZE:`
- **analyze-a / analyze-b**: `requires` — `scan.md`; `dod` — idea briefs each containing `## Pitch`, `## Target User`, `## Evidence`, `## Competitors & Differentiation`, `## MVP Features`, `## Score Breakdown`, `## Risks`
- **calibrate**: `requires` — `scan.md`, `ideas/*.md`; `dod` — `## Summary Table`, `## R&D Manager's Recommendation`, `## Owner decision`
- **owner-decision** (gate): `requires` — `proposal.md`

**Changed (tools/engine/pipelines/internal-research.json):**
- **research**: `requires` — `CLAUDE.md`, `internal-initiatives.md`, `adr/0001`, `engine.js`; `dod` — `## Multi-Agent Frameworks`, `## Workflow Frameworks`, `## Observability & Control UIs`
- **synthesize**: `requires` — `findings.md`; `dod` — `## Control Room UI`, `## Village View`, `## Workflows & Roles`, `## Engine`, `## Creative Pipeline`
- **rank**: `requires` — `recommendations.md`, `findings.md`; `dod` — `## Summary Table`, `## Owner decision`
- **owner-decision** (gate): `requires` — `proposal.md`, `findings.md`

**Verification:**
- Both JSON files parsed with `JSON.parse()` — valid.
- Every `requires` entry maps to a file the stage's `task` text references or a predecessor stage's `expect` output.
- Every `dod` heading is called out in either the `task` text or METHODOLOGY.md §5 (proposal format).
## Sprint 2d Task 1 rework (round 1) - creative-director review findings

**Findings fixed:**
- **S2** (chosen-file mapping lost from pick task): Added Chosen file field to the fixed per-asset format in creative-director.md Mode B. Updated creative-portraits.json pick task text to require it.
- **Nit** (no newline at end of creative-director.md): Added trailing newline.

**Findings deferred:**
- **S1** (Bash node -e star unrestricted code): The review recommends a pick subcommand in portraits.js in StudioControlRoom repo. Filed as a StudioControlRoom follow-up; not in-scope for this HQ-only lane.

**Files changed:** .claude/agents/creative-director.md, tools/engine/pipelines/creative-portraits.json.

**Verification:** JSON parsed successfully; task text confirmed to contain all six format fields plus copyFileSync instruction. Agent file confirmed to have Chosen file line inside the fenced format block and trailing newline.

## Sprint 2d Task 2 (fix round)

**Changed:** `CLAUDE.md` now has a real Markdown link to `docs/adr/0003-static-pipelines-managers-review.md` in the Workflow Engine section. In the ADR, removed two inaccurate references (a `foreach` stage type and a nonexistent `tools/engine/selftest.js`).

**Verified:** grep confirms the link in CLAUDE.md and no remaining `foreach` in the ADR. I checked the stage ids and tiers against `rd-cycle.json`.

## Sprint 2d Task 3 — Enrich internal-analyst agent definition for internal synthesis

**Problem:** The existing `.claude/agents/internal-analyst.md` was sparse (~12 lines of body). On 2026-11-07 the local model confused internal studio synthesis with app-idea market scoring because the agent's scope boundaries were not explicit enough.

**Changed (.claude/agents/internal-analyst.md):**
- Enriched from ~12 to ~36 lines of body text, matching the style of `opportunity-analyst.md` and `market-researcher.md`.
- **Explicit anti-goal:** "**You do NOT do:** app idea scoring, market analysis, MVP scoping, monetization, or any customer-facing product work. That is `opportunity-analyst`."
- **Structured inputs:** lists `findings.md` and specific codebase paths (`CLAUDE.md`, pipeline JSONs, agent definitions, engine code, Control Room app).
- **Output format:** each recommendation item requires Title, Department, What to change, Why, Impact, Effort, Local-ok.
- **Group headings:** Control Room UI, Village View, Workflows & Roles, Engine, Creative Pipeline.
- **Rules:** references ADR 0001 and ADR 0003, sprint-feasible constraint, "**No app ideas**" rule.
- **Progress reporting:** `studio.js log internal-analyst` at milestones.
- Frontmatter preserved: `name: internal-analyst`, `tools: Read, Write, Edit, Glob, Grep, Bash`, `model: sonnet`.

**Changed (tools/engine/pipelines/internal-research.json):**
- No change needed — synthesize stage already has `"agent": "internal-analyst"` with `"tier": "local"`. Verified.

**Verification:**
- Agent file: frontmatter parsed correctly (name, description, tools, model: sonnet). Body contains explicit NOT scope, ADR references, and "No app ideas" rule.
- Pipeline: `JSON.parse()` valid, synthesize stage agent = `internal-analyst`, tier = `local`.
- Style consistency: compared against `opportunity-analyst.md` and `market-researcher.md` — same structure (frontmatter, role intro, anti-goals, inputs, output format, rules, progress reporting).
