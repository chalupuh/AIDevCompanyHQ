# Code review: Internal Sprint 1b (fix round)

**Reviewer:** code-reviewer (Opus) · **Date:** 2026-11-06 · **Branch:** `feat/internal-sprint-1`
**Scope:** the 5 unchecked tasks in `docs/internal/eng-backlog-sprint1-fixes.md`, checked against `docs/internal/review-sprint.md`; `docs/internal/sprint-log.md`; `docs/internal/qa/s1b-task-*.md`; the working-tree diff (`git diff HEAD` plus untracked `tools/engine/test.js` and `src/features/village/model.test.ts`).

**What I ran:** `npm --prefix .studio/app run build` → **PASS** (tsc clean, 47 modules). This stage can't run `node`, so I traced the 18 `resolveTeamLead` cases and the new `parseRunOutput`/`verify` cases (11, 13, 15, 16) by hand. All pass on my trace, which matches the QA reports. This time QA had a shell and pasted real output.

| Task | Prior findings | QA | Review |
|---|---|---|---|
| 1 parseRunOutput / verify | B4 | PASS | **Fixed.** Should fix S2 |
| 2 resolveTeamLead | B1, B2, B3 | PASS | **Fixed** for lite-build. Should fix S1, S3, S4 |
| 3 Git Bash config + test runner | S6 (engine), S8 | PASS | **Fixed.** Should fix S5 |
| 4 Avatar revert + drag-to-pan | S1, S2 | FAIL → PASS (round 2) | **Fixed.** Nits |
| 5 Village vitest + package.json cleanup | S4, S7 | PASS (149 tests) | **Fixed.** Nit |

---

## Blockers

None. B1–B4 from the first review are resolved:
- **B4:** `engine.js:81` now treats `is_error`, a non-zero status, `r.error` and `r.signal` as failure. `:86` no longer suppresses anything. `:87` keeps the warning only for logging. `:132` always runs the empty-answer check. Tests 11 and 13 were flipped, and tests 15 (timeout) and 16 (direct `verify()`) were added.
- **B1:** `engine.js:153-154` actually tests each line.
- **B2:** `lite-build.json:16` sets `designDoc: docs/specs/{{slug}}.design.md`, and `engine.js:204` reads it. `{{slug}}` is filled when the foreach expands.
- **B3:** `engine.js:149` handles absolute paths, and the fixtures are under `os.tmpdir()`.

## Should fix

**S1. The default design-doc path is still wrong.** `tools/engine/engine.js:204`
The code is `fill(stage.designDoc || '{{slug}}.design.md', vars)`. The comment at `:201-202` says the fallback is `docs/specs/{{slug}}.design.md`, but the code still falls back to `<repo>/<slug>.design.md`, the path B2 flagged. lite-build works only because it sets `designDoc`. Any other pipeline that uses `__team_lead__` silently gets `mobile-dev`.
*Fix:* `fill(stage.designDoc || 'docs/specs/{{slug}}.design.md', vars)`.

**S2. A failure with empty stderr leaves `error` as `undefined`.** `tools/engine/engine.js:86`
`stderr.slice(-800) || out.subtype` is `undefined` when stderr is empty and the JSON has no subtype. That is typical for a `spawnSync` timeout (`r.error` ETIMEDOUT, `signal: 'SIGTERM'`, nothing on stderr) or an ENOENT spawn error. `verify()` (`:130`) then logs no "run error". The stage still fails, but only on "empty final answer", so the history and the ladder feedback lose the real cause. Test 15 passes only because it supplies stderr.
*Fix:* `(stderr.slice(-800) || out.subtype || String(r.error?.code || r.error || r.signal || 'exit ' + r.status))`. Add a selftest with `{ status: null, signal: 'SIGTERM', error: { code: 'ETIMEDOUT' }, stdout: '', stderr: '' }` that asserts `typeof r.error === 'string'` and that it includes `ETIMEDOUT`.

**S3. The Team regex misses common markdown variants, and a miss silently picks `mobile-dev`.** `tools/engine/engine.js:153`, `:155`, `:158`
`/^[ \t]*[*\->]?\s*\*?Team\*?:/i` misses `- **Team:** ...` (bullet plus bold, which the backlog item names) and `**Team**: ...` (colon outside the bold). Both are likely from a local-model architect. When the regex misses, a web-only project gets built by `mobile-dev`, which breaks the CLAUDE.md staffing rule.
*Fix:* `/^\s*(?:[-*>]\s*)?(?:\*{1,2})?team(?:\*{1,2})?\s*:/i`, with selftest cases for both variants. Recommended: when no Team line or no build role is found, return `null`, and have `advance()` block the run (`blockedReason: 'no Team: line with a build role in <designDoc>'`) instead of guessing. If you keep the fallback, at least warn about it and record it in the run history. Drop the redundant `m` flag.

**S4. The selftest still never covers the repo-relative / `designDoc` path.** `tools/engine/selftest-team-lead.js:97-110`, `:132`
Every case passes an absolute tmpdir path. The "absolute path is accepted" case is no different from the other 17, and the "docs/specs sub-path" case is also absolute. So the `path.join(REPO, ...)` branch (`engine.js:149`) and the `fill(stage.designDoc)` wiring (`:204`) have no test, and that wiring is where B2 lived.
*Fix:* write `docs/specs/__selftest-<pid>.design.md` in the repo, call `resolveTeamLead('docs/specs/__selftest-<pid>.design.md')`, and delete the file in `finally`. Better: extract `teamLeadFor(stage, vars)` from `advance()` (`:203-206`), export it, and test it with `designDoc: 'docs/specs/{{slug}}.design.md'`.

**S5. Engine tests depend on the local QA model following a prose instruction.** `tools/engine/pipelines/internal-build.json:12`, `:15`
S8 asked for a *check*. What landed is a sentence in the QA task, which leaves the decision to the model. ADR 0001 rule 5 says checks decide. The selftests take under a second.
*Fix:* make the build stage check `npm --prefix .studio/app run build && node tools/engine/test.js`, and keep the QA sentence too. Add `Bash(node tools/engine/test.js)` and `Bash(npm --prefix .studio/app test)` to the review stage `allowedTools` (`:20`) so the gate reviewer can run them instead of tracing by hand.

**S6. The sprint log is missing two task entries and the required test output.** `docs/internal/sprint-log.md`
There are entries for 1b Tasks 1, 3 and 4, but none for **Task 2** (resolveTeamLead) or **Task 5** (village tests and package.json). Task 2 explicitly required pasting the `selftest-team-lead.js` output here. The only evidence is an "18/18" claim inside the Task 3 entry.
*Fix:* add `## Sprint 1b Task 2` (files changed, the 18-line output) and `## Sprint 1b Task 5` (files deleted/added, `npm test`: 4 files, 149 tests). Mark the original Task 1 entry (`:5-22`) "superseded by Sprint 1b Task 1", because it still describes the suppression behaviour as current.

## Nits

- `tools/engine/engine.js:148-159`: still tab-indented in a 2-space file (carried over from the first review).
- `tools/engine/engine.js:100-105`: if no Git Bash candidate exists, the agent quietly runs without a shell, which caused the original "QA couldn't run the build" problem. Add a single `console.warn` telling the user to set `STUDIO_GIT_BASH` or `.studio/machine.json` `gitBash`.
- `.gitignore:16` says "keep template in code", but there is no template. Commit `.studio/machine.example.json`, or document the file in `docs/runbook.md`.
- `tools/engine/test.js:19`: use `process.execPath` instead of `'node'` so the runner uses the same Node binary and doesn't depend on PATH.
- `.studio/app/src/features/org/Chart.tsx:76`: `.o-card` is already a `<button>` (`AgentCard.tsx:70`), so listing it is redundant. Because cards are excluded, a pan can only start in the gaps between cards, and the click swallow (`:94-99`) only matters in edge cases. That's acceptable. If you want to pan from anywhere, exclude only the zoom controls and `.o-toggle`, and the swallow will then stop the drag from opening the card.
- `Chart.tsx:114-135`: touch panning wasn't in the backlog item (scope creep), and unlike the mouse path it starts pans on buttons/cards. Apply the same `closest(...)` exclusion or move it to its own task. The pan clamp (`:26-27`) and zoom anchoring (S2d/S3 from the first review) are still open. They weren't in this backlog, so add them to sprint 2.
- `.studio/app/src/features/village/model.test.ts:411-434`: there's no mid-walk `posAt` assertion. That probe only existed in QA's temp file. Add `posAt(walk, now + walk.duration / 2)` ≈ `{50, 50}`. The dedupe tests (`:238-262`) cover `eventKey` only, not the `Set` in `VillageView`. That's fine without a DOM environment. The same-millisecond collision nit from the first review still applies.

## Security

No secrets in the diff. `.studio/machine.json` holds a local path and is gitignored. It is parsed inside try/catch, and its value only goes through `fs.existsSync` and then into an env var for the child process. Nothing passes through a shell, so there's no injection path. `designDoc` comes from checked-in pipeline JSON plus `{{slug}}`. `resolveTeamLead` only reads the file and matches against a fixed list of three role names, so a hostile design.md can't choose an arbitrary agent. Removing `jsdom` shrinks the dependency tree, and nothing new was added.

## What's good

The B4 fix is small and correct, and its comments now match the behaviour. The flipped and added selftests lock in the right semantics, including a direct `verify()` test. `tools/engine/test.js` is a clean, dependency-free runner. The S1 revert is complete: no `data-team` or `--av-team` is left in `src`. The S2 rework uses CSS-class cursors and a bounded one-shot capture listener with no leak. The village tests are real vitest now (57 tests), the truncate expectation is fixed, and the dead Playwright files are gone. QA earned its keep: the round-1 FAIL on Task 4 correctly caught a no-op implementation.

**Verdict:** every Blocker and required item from the first review (B1–B4, S1, S4, S5, S7, S8) is resolved, and the build passes. S1–S6 above are small and low-risk. I recommend one follow-up commit on this branch before merge, or making them the first sprint-2 backlog items. They don't block approval.

APPROVE
