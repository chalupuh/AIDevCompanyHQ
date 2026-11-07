# Code review: Internal Sprint 1 (tasks 1–5)

**Reviewer:** code-reviewer (Opus) · **Date:** 2026-11-06
**Scope:** the 5 unchecked tasks in `docs/internal/eng-backlog.md`, `docs/internal/sprint-log.md`, `docs/internal/qa/*.md`, and the working-tree diff (`git diff` + untracked files).

**What I ran:** `npm --prefix .studio/app run build` → **PASS** (tsc clean, 47 modules). I wasn't allowed to run `node` here, so I traced the engine self-tests by hand (B1–B3). The QA reports for Tasks 1 and 2 are also trace-only: neither self-test was ever executed, and B3 shows the Task 2 test fails.

| Task | QA | Review |
|---|---|---|
| 1 Engine: unrecognized_model warning | PASS (trace only) | **Blocker** (B4) |
| 2 Engine: build agent from design.md Team line | PASS (trace only) | **Blocker** (B1, B2, B3): the feature doesn't work |
| 3 Control Room Village tab | PASS | Should fix (S4) |
| 4 Team view zoom/pan + owner token | PASS | Should fix (S1, S2) |
| 5 vitest + unit tests | PASS (92 tests) | Should fix (S7) |

---

## Blockers

**B1. `resolveTeamLead` never finds the Team line.** `tools/engine/engine.js:152`
`txt.split('\n').find((l) => /^(?:Team|team):/im)` returns a regex literal, which is always truthy, and never tests `l`. So `line` is always the **first line** of the file (e.g. `# Design: …`), and the function always returns `mobile-dev`. That is exactly the bug Task 2 was meant to fix.
*Fix:* `const line = txt.split(/\r?\n/).find((l) => /^\s*(?:[-*]\s*)?(?:\*\*)?team(?:\*\*)?\s*:/i.test(l));`. This also accepts a `**Team:**` bold label. Drop the redundant `(?:Team|team)` and the `m` flag.

**B2. Wrong design.md path.** `tools/engine/engine.js:200`
`fill('{{slug}}.design.md', vars)` resolves to `<repo>/<slug>.design.md`. The pipeline writes `docs/specs/{{slug}}.design.md` (`lite-build.json:10-11`). The file is never found, so even with B1 fixed the result is always `mobile-dev`.
*Fix:* `fill('docs/specs/{{slug}}.design.md', vars)`. Better: add a `"designDoc"` field to the build stage in `lite-build.json` and read `stage.designDoc`, so the path lives in one place.

**B3. Task 2 self-test fails, so the QA PASS is invalid.** `tools/engine/selftest-team-lead.js:75`, `:9`
The test passes an **absolute** path into `resolveTeamLead`, which does `path.join(REPO, designPath)` (`engine.js:149`). On Windows that gives `C:\…\AI Development Company\C:\…\design.md`, which never exists, so every case returns `mobile-dev`. Tests 1, 4 and 5 (expecting `frontend-dev`) fail: 7/10. Because of B1, they would fail even with a correct path. Also, `TEST_DIR` (`:9`) resolves to `tools/.studio/…`, not `.studio/…`.
*Fix:* in `resolveTeamLead` use `path.isAbsolute(designPath) ? designPath : path.join(REPO, designPath)`. Write the fixtures under `os.tmpdir()`. Add one case that goes through the real `docs/specs/<slug>.design.md` path. **Actually run** both self-tests (S8).

**B4. The warning now hides every failed local run.** `tools/engine/engine.js:85-90`, `:133`
`suppress = modelWarning` clears `error` whenever the warning appears in stderr. Local runs always print that warning, so in practice **a local run can't fail any more**. A timeout (`spawnSync` gives `status: null`), a crash, or an `is_error` run with no result are all treated as success. `verify()` then also skips the "empty final answer" check (`:133`). For stages with no `expect`/`check`, such as the lite-build `build` stage (`lite-build.json:16-17`), nothing decides the outcome at all. That breaks ADR 0001 rule 5 ("checks decide success, never the model's own claim"). It also goes against the backlog text: *"treat the warning as a warning … only is_error/non-zero status with no result counts as an error."* Self-test 11 locks in the wrong behaviour.
*Fix:* `hasFailure = out.is_error || r.status !== 0 || !!r.error || !!r.signal`; `error = hasFailure && !hasResult ? (stderr.slice(-800) || out.subtype || String(r.error || r.signal)) : null`; keep `ignoredWarning` for logging only. Remove the `&& !res.ignoredWarning` bypass at `:133`. Flip test 11 to expect an error, and add a timeout case (`status: null, signal: 'SIGTERM'`) plus a direct `verify()` test (QA gap G1). If the warning really does come with an empty `result` on a good run, show the stdout from that run first. The fallback then belongs in `verify()`, gated on the stage's `expect` files existing, not a blanket suppression.

---

## Should fix

**S1. Avatar change goes beyond the owner.** `.studio/app/src/features/org/org.css:55`, `AgentCard.tsx:15-16`
`.o-avatar-fallback[data-team] rect { fill: var(--av-team) }` beats the SVG `fill` attribute. Every agent without a portrait now loses its own `c.color` and shows its team colour. The task only asked for the **owner** fallback to use `--owner`, and `Chart.tsx:174` (`color: 'var(--owner)'`) already does that.
*Fix:* remove the CSS rule, the `team` prop, `data-team` and `--av-team` from `Portrait`, or limit the rule to `[data-team="owner"]`.

**S2. Drag-to-pan interferes with clicks and text selection.** `.studio/app/src/features/org/Chart.tsx:56-70`
(a) Releasing a drag over a card fires its click and opens the drawer. (b) `onDown` doesn't `preventDefault`, so dragging selects text. (c) `onUp` sets `cursor = ''`, which wipes the inline `grab` set at `:165`. (d) The pan clamp is fixed at ±1200/±600.
*Fix:* track the distance moved. Past 4 px, cancel the next click with a capture-phase `click` listener. Call `e.preventDefault()` in `onDown` unless the target is a button. Move the cursor to CSS (`.o-zoom-viewport{cursor:grab}` / `:active{cursor:grabbing}`). Clamp the pan to the canvas size × scale.

**S3. Zoom isn't anchored.** `Chart.tsx:42-45`, `:169`
Ctrl+wheel scales around `top center`, so the content under the cursor shifts away. *Fix:* adjust `tx/ty` by `(cursor − origin) × (1 − newScale/oldScale)`.

**S4. The Village tests are dead and one fails.** `.studio/app/tests/village-model.test.ts:88`, `tests/village.test.ts:2`
QA finding 1 was never fixed: line 88 still expects `'a very long…'`, but `truncate(s,10)` correctly returns `'a very lon…'`. `vitest.config.ts:6` only includes `src/**/*.test.ts`, so `npm test` never runs either file. `village.test.ts` imports `@playwright/test`, which isn't installed. Nothing tests the walking model (`routeFor`, `pointOnPolyline`, `posAt`, `startWalk` with reduced motion).
*Fix:* move the model tests to `src/features/village/model.test.ts` as vitest, fix the expectation, and delete `tests/village.test.ts` and `tests/tsconfig.test.json` (or add Playwright properly as a separate task).

**S5. Leftover files in the tree.** These should be deleted, or gitignored if generated at runtime: `.studio/app/temp_check.js` (empty), `.studio/app/install-and-build.bat`, `temp_build.ps1`, `temp_qa_log.txt`, `.studio/progress.json`, `.studio/qa-progress.txt`, `.studio/qa_progress.json`, `.studio/run_build.json`, `tools/engine/run-selftest-team-lead.ps1`.

**S6. The diff mixes in unrelated work.** CLAUDE.md requires one task per branch/PR. This working tree also changes `CLAUDE.md`, `.claude/agents/*.md`, `docs/adr/0002-*`, 17 portraits, `docs/creative/`, and `tools/engine/pipelines/internal-build.json`. The `internal-build.json` change renames the outputs to `qa/s{{sprint}}-task-N.md` and `review-sprint{{sprint}}.md` partway through a sprint. This run's QA files and this review use the old names, so the next run of this pipeline won't line up with them. Also `engine.js:102-106` (Git Bash autodetect with a machine-specific `E:\Claude Projects\Git` path) isn't in any backlog item.
*Fix:* commit each backlog task on its own branch. Land the pipeline rename and the Git Bash change as their own reviewed PR, with the bash path taken from `STUDIO_GIT_BASH`/config instead of a hard-coded drive.

**S7. `jsdom` added but unused and not pinned.** `.studio/app/package.json:20`
`"jsdom": "^31.0.0"` isn't used (`environment: 'node'`), and it's the only caret range in a manifest that otherwise pins exact versions. It also adds a large dependency tree. *Fix:* remove it, and add it pinned when component tests need it. `allowScripts` (`:25-27`) isn't an npm field and does nothing: remove it or document which tool reads it.

**S8. The engine self-tests aren't run by any check.** QA for Tasks 1 and 2 was "manual trace", and B1–B3 got through that way. *Fix:* add a script or pipeline check, e.g. `node tools/engine/selftest.js && node tools/engine/selftest-team-lead.js`, and have the internal-build QA stage run it.

---

## Nits

- `tools/engine/engine.js:148-157, 242-268`: tab indentation in a 2-space file.
- `tools/engine/engine.js:72-76`: the comment says the warning is ignored only on a run that has a result, while the next lines say it suppresses everything. Make it match the behaviour after B4.
- `.studio/app/src/features/village/model.ts:85`: `eventKey` = `ts|agent|type` collides when two events share a millisecond. Add `task`/`message` to the key.
- `.studio/studio.js:411-415`: the `/village/` route serves `.svg` same-origin with the control API. If you open one directly, scripts in it would run. Low risk (local, owner-supplied files). Drop `svg` from the allowlist or send `Content-Security-Policy: sandbox` for it.
- `.studio/app/src/features/village/VillageView.tsx:102,160`: the whole map re-renders every frame while walking. Fine at this roster size. If it grows, memoise `BuildingArt` and the grass layer.
- `docs/internal/sprint-log.md`: there's no Task 4 entry. Task 1 says "30 assertions" but the file has 31. Task 3 has stale round notes ("build unverified") that later QA superseded.

## Security summary
No secrets, no new network calls, no injection paths. `{{g1}}` from the backlog is limited to `[\w-]+`. The new static route uses `safeJoin` and an extension allowlist. The main risk is in correctness, not security: B4 removes the engine's ability to detect a failed local stage.

## What's good
The Village model is clean: pure functions, polyline routes, a bounded seen-set, and a reactive reduced-motion listener. The zoom controls are accessible (aria-labels, `focus-visible`). The vitest suite (Task 5) covers the event types and edge cases well and passes. The `require.main` guard plus the exports make the engine testable.

**Required before approval:** B1–B4 (fix and actually run both engine self-tests), plus S1, S4 and S5.

REQUEST CHANGES
