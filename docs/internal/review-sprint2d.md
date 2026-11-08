# Code review: Sprint 2, Lane D (HQ org docs, branch `docs/s2-hq`)

**Reviewer:** code-reviewer · **Date:** 2026-11-07 (second pass)
**Scope:** all four unchecked tasks in `docs/internal/sprint2/lane-d-hq.md`, the Sprint 2d entries in `docs/internal/sprint-log.md`, and QA reports `docs/internal/qa/s2d-task-{1,2,3,4}.md` (+ `s2d-task-3-round1.md`, `s2d-task-3-verify.js`).
**Diff reviewed:** working tree vs `bc7f60d`: `.claude/agents/creative-director.md`, `.claude/agents/internal-analyst.md` (new), `CLAUDE.md`, `docs/adr/0003-static-pipelines-managers-review.md` (new), `docs/internal/sprint-log.md`, `tools/engine/pipelines/{creative-portraits,internal-research,rd-cycle}.json`. I also checked the untracked `AGENTS.md` and `.codex/`.
**Cross-checked against:** the Lane A engine in `../s2-engine/engine/engine.js`: `fill()` 69-72, `verify()` dod loop 191-204, `checkRequires()` 210-218, and the requires pre-check at 338-349, which skips gates. Also `docs/research/METHODOLOGY.md`, `docs/research/brief-template.md`, and the market-researcher, opportunity-analyst and rd-manager role files.

**Re-review note:** no Lane D file has changed since the first pass. The latest edits are `rd-cycle.json` at 18:06, `internal-research.json` at 18:07 and `sprint-log.md` at 18:08. I checked every finding again against the current tree and the current Lane A engine, and all of them still hold. Only the engine line numbers have moved, and they are updated below. QA reports `s2d-task-3.md` and `s2d-task-4.md` still PASS based on JSON validity and reading the files, and `s2d-task-4.md` still says a glob in `requires` is valid.

**Checks:** all pipeline JSON files parse. `node tools/ci/check-config.js` passes (11/11, per QA). I couldn't run `s2d-task-3-verify.js` in this session. Reading it, it would exit 1 on this tree (see S4).

## Summary per task

| Task | Result |
|---|---|
| 1. creative-director critique format + copyFileSync | Done as specified. Should fix: S1 (security), S2 (chosen-file mapping lost) |
| 2. ADR 0003 + CLAUDE.md link | Done. The ADR has factual errors about the pipelines (S3) |
| 3. internal-analyst + synthesize switch | Wiring done. The stage still runs on the local model, so the original problem isn't fixed (S4). No sprint-log entry (S6) |
| 4. Stage contracts requires/dod | **Blocker.** The `dod` shape doesn't match the engine, the headings contradict the role files, and `requires` uses a glob (B1-B3) |

---

## Blocker

### B1. `dod` entries are plain strings, but the engine expects `{ file, headings }` objects
- **Where:** `tools/engine/pipelines/rd-cycle.json:20-24, 40-45, 73-75, 101-103, 129-133`; `tools/engine/pipelines/internal-research.json:21-25, 51-57, 81-84`
- **Why:** `s2-engine/engine/engine.js:192-203` loops over `stage.dod` and reads `entry.file` and `entry.headings`. With a string entry, `entry.file` is undefined, `fill(undefined)` returns `''` (`engine.js:70`), and `path.resolve(REPO, '')` is the repo root. That path exists, so `fs.readFileSync(<dir>)` throws EISDIR inside `verify()`, and the engine crashes after the first `brief` stage of every R&D cycle. Even if it didn't crash, `entry.headings` is undefined, so the loop would check nothing. QA (`s2d-task-4.md`, checks 3-4 and 10) only confirmed that the fields exist and that the JSON parses. It never ran `verify()` on these stages.
- **Fix:** Use the engine schema, for example `"dod": [{ "file": "docs/research/cycles/{{date}}/brief.md", "headings": ["Targets", "Constraints"] }]`. Write the heading text **without** `## `. The regex at `engine.js:199` adds `^\s*#{1,6}\s+` itself, so `"## Targets"` would only match a line like `## ## Targets`. Then extend `tools/ci/check-config.js` to check that every `dod` entry is an object with a string `file` and a non-empty string array `headings`, and that `requires` entries are strings without `*`.

### B2. The `dod` headings don't match what the role files and templates tell the agents to write
Even with the right shape, these stages would fail `dod` on every run and climb the ladder to blocked:
- `rd-cycle.json:21` `## Theme`: `brief-template.md:3` writes `**Theme:**` as a bold field, not a heading. Keep only `Targets` and `Constraints` (template lines 6 and 11).
- `rd-cycle.json:41-44` `## Hot/Warm/Cold`, `ANALYZE:`: `market-researcher.md:23` puts "Quick take: Hot / Warm / Cold" on each entry, not as headings. `ANALYZE:` isn't a heading, and the `check` at `:50` already enforces it. Fix: either drop this `dod`, or require `## Hot` / `## Warm` / `## Cold` grouping in both the scan `task` and `market-researcher.md`.
- `rd-cycle.json:74, 102` (analyze-a/b): this is free text, not a file path. Its headings (`Pitch`, `Target User`, `Evidence`, `Score Breakdown`...) also don't match `opportunity-analyst.md:12-19`, which uses numbered bold items such as "Working name and pitch" and "Score table". The slugs aren't known when the pipeline is written. Fix: remove `dod` here and enforce the format with a `check` script that reads the slugs from the `ANALYZE:` line. Or file per-glob dod support as a Lane A follow-up.
- `rd-cycle.json:130-131` `## Summary Table`, `## R&D Manager's Recommendation`: METHODOLOGY section 5 (lines 116-117) lists these as numbered bold items. Only `## Owner decision` (line 122) is a real heading. Fix: keep only `Owner decision`, or add the headings to METHODOLOGY section 5 and `rd-manager.md` in this PR.
- `internal-research.json:22-24` and `:52-56`: the `task` text (lines 36, 66) says "per area" and "Group as: ...". It never requires these exact `##` headings, so a local model will word them differently. Fix: in each `task`, write "Use exactly these `##` headings: ...", use the same strings in `dod`, and make `internal-analyst.md:17` match.
- `internal-research.json:82` `## Summary Table`: the rank task (line 94) asks for "a ranked table", not this heading. Add the heading to the task or drop it from `dod`.

### B3. `requires` uses a glob, but the engine checks with `fs.existsSync`, so `calibrate` always blocks
- **Where:** `tools/engine/pipelines/rd-cycle.json:127` `"docs/research/ideas/*.md"`
- **Why:** `checkRequires` (`engine.js:210-218`, called at 340 before every non-gate stage) runs `fs.existsSync` on that literal path. No file has that name, so every R&D cycle blocks before calibration. QA's claim "Valid glob pattern for file existence checks" (`s2d-task-4.md`, Edge Cases) is wrong.
- **Fix:** Remove the entry (scan.md is already required), or use the directory `docs/research/ideas`. Add the CI rule from B1 that rejects `*` in `requires`.

## Should fix

### S1. `Bash(node -e*)` gives the creative-director stage unrestricted code execution
- **Where:** `tools/engine/pipelines/creative-portraits.json:24` (task text `:27`)
- **Why:** `node -e` runs arbitrary JS, including child_process, network and `fs.rmSync`, so this entry is as broad as `Bash(*)`. The old `Bash(cp *)` was narrow. The lane task asked for this one-liner, so this is Should fix rather than Blocker. Still, it is the widest permission in any HQ pipeline.
- **Fix:** Add a `--pick <id> <candidate>` subcommand to `{{soft}}/creative/portraits.js` that copies only from `.studio/portraits/candidates/` to `.studio/portraits/<id>.png`. The existing allowed entry at `:25` already covers that command, so remove `Bash(node -e*)`. File it as a StudioControlRoom follow-up if this lane can't touch the software repo.

### S2. The `pick` task no longer asks for the chosen-file mapping
- **Where:** `tools/engine/pipelines/creative-portraits.json:27`; `.claude/agents/creative-director.md:13-20`
- **Why:** The old task asked for "a table of id | chosen file | why". The `owner-look` gate shows only `review.md`. Without the table, the owner can't tell which candidate went live.
- **Fix:** Add `- **Chosen file:**` to the per-asset block, or keep a short id | file summary table at the top of `review.md` and say so in the task.

### S3. ADR 0003 makes wrong claims about the pipelines it documents
- `docs/adr/0003-static-pipelines-managers-review.md:27` says `rd-cycle` runs `analyze-a`/`analyze-b` in parallel via `foreach`. They are two **sequential** agent stages (`rd-cycle.json:64, 92`). `foreach` appears only in `lite-build.json:14`, and it is a loop over milestones. Fix: describe what the engine actually does.
- `:29` and `:46` say manager output is validated by the stage's `check`. `pick` and `calibrate` have no `check`. Fix: cite `expect`/`dod`, and use `lite-build.json:25` as the example.
- `:38` refers to `tools/engine/selftest.js`. Since `bc7f60d`, self-tests live in StudioControlRoom (`engine/selftest*.js`).
- `:55`: the lite-build flow leaves out the `approve-plan` gate.
- Add one line saying the engine-side `__team_lead__` / `resolveTeamLead` agent selection (`lite-build.json:16`) is allowed routing, so it doesn't read as a contradiction.

### S4. Synthesize still runs on `tier: "local"`, so the original problem isn't fixed, and the QA verify script disagrees
- **Where:** `tools/engine/pipelines/internal-research.json:45`; `docs/internal/qa/s2d-task-3-verify.js:48-50`
- **Why:** The task exists because the local model mixed up internal work and app ideas. The engine picks the model by stage `tier` (`engine.js:392`, `--model tier.model` at 146), so qwen still runs synthesize, whatever `model: sonnet` says in the agent file. QA noticed this (`s2d-task-3.md` Observation 1) and passed it anyway. QA's own verify script asserts `tier === 'sonnet'`, so it exits 1 on this tree.
- **Fix:** The manager or owner decides one of two options: (a) set `"tier": "sonnet"`, or (b) keep `local` on purpose, add a `"note"` saying why, and fix the script. Either way, don't commit `docs/internal/qa/s2d-task-3-verify.js`. Fold it into the QA report or delete it.

### S5. Unrelated, broken files are in the worktree: `AGENTS.md` and `.codex/`
- **Where:** repo root, untracked
- **Why:** These files aren't part of any Lane D task. `AGENTS.md` is a find-and-replace copy of CLAUDE.md with errors such as "Agent definitions live in `.Codex/agents/`" and "**Codex Opus** only for gate reviews". This belongs to Sprint 3 lane G.
- **Fix:** Leave both out of the Lane D commit: stage files by path, with no `git add -A`.

### S6. The sprint log has no Task 3 entry
- **Where:** `docs/internal/sprint-log.md:197-209` (Task 2 starts at 197 and is followed directly by Task 4 at 209)
- **Fix:** Add a "Sprint 2d Task 3 — internal-analyst" entry: what changed, how it was verified, and the S4 tier decision.

## Nit
- `.claude/agents/creative-director.md:28`: there's no newline at the end of the file.
- `.claude/agents/internal-analyst.md:11,13`: write `DATE` as `<date>`, like the other role files. At `:21`, give the literal command `node .studio/studio.js log internal-analyst <pct> "<msg>"`, because local models follow literal commands better.
- Mention `internal-analyst` in CLAUDE.md (R&D or internal section) so the orchestrator knows the role exists.
- `internal-research.json` and `creative-portraits.json` were fully reformatted from compact to expanded JSON, which hides the semantic diff. Do reformats in a separate commit.
- `rd-cycle.json:77-79, 105-107` (already there before this change): analyze-a/b `expect` is their *input* `scan.md`, so the stage passes even if it writes no idea files. Out of scope, but track it for Lane A/E. It is the real gap that B2's analyze `dod` was trying to close.
- `docs/adr/0003-...md:3`: `Status: Accepted` was set by the architect. Use `Proposed` until the owner merges.
- `internal-research.json:103-106`, `rd-cycle.json:153-155`: the engine ignores `requires` on gates (`engine.js:339`, `if (stage.type !== 'gate')`). Remove it, or ask Lane A to check gates too.

## Test coverage
Lane D was verified only by QA reading the files and by `check-config.js`, which only checks that JSON parses and that agents exist. **Nothing ran the changed stages through the engine that consumes `requires`/`dod`**, so B1-B3 went unnoticed. Before re-review, run Lane A's `checkRequires`/`verify` (both are exported from `engine.js:471`) against fixture files for each changed stage, and add the CI schema check from B1.

## To approve
1. Fix B1-B3: the `dod` object shape, headings that match the role files or templates (or update those files in this PR), and no globs in `requires`.
2. Fix S4 (tier decision + verify script) and S5 (leave out `AGENTS.md` and `.codex/`).
3. Fix S1-S3 and S6 in this PR too. They're small edits; S1 can become a tracked StudioControlRoom follow-up.

REQUEST CHANGES
