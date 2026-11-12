# AI Development Company

A small studio of Claude Code subagents that builds web and mobile apps the same way every time.
The main Claude session acts as the **Engineering Manager (orchestrator)**: it does not write feature code itself, it delegates to the roles below and keeps the work moving.

## Org chart

```
                     You (Owner / CEO): picks what to build, approves scope, merges, deploys
                                        │
              ┌─────────────────────────┴──────────────────────────┐
     R&D Manager (rd-manager)                     Main session = Engineering Manager
              │                                                     │
     ┌────────┴─────────┐          ┌──────────────┬──────────────┼──────────────┬─────────────────┐
  market-researcher  opportunity-  product-manager architect  ui-ux-designer  Build team       Quality
                     analyst                                                  frontend-dev     qa-engineer
                                                                              backend-dev      code-reviewer
                                                                              mobile-dev
                                                                              devops-engineer
```

Agent definitions live in `.claude/agents/`.

Subagents can't start other subagents, so the main session runs **both** teams' workflows. On the org chart, R&D reports to the owner, not to Engineering.

## Repositories (ADR 0002)

- **AIDevCompanyHQ** (this folder): the org. Agents, CLAUDE.md, docs, pipeline definitions (`tools/engine/pipelines/`) and runtime data (`.studio/`).
- **StudioControlRoom** (`../StudioControlRoom`, github.com/chalupuh/StudioControlRoom): the software. Control Room server and UI, workflow engine, benchmark, creative tools. Its `studio.home.json` points back here.
- `.studio/studio.js` and `tools/engine/engine.js` in this repo are **forwarding shims** to that checkout, so every command below keeps working. Set `STUDIO_SOFT` if the software lives elsewhere.
- **Control Room / engine changes are made in StudioControlRoom** (internal-build runs with `workdir={{soft}}`). Org and docs changes are made here. Both repos: branch, PR, required CI, then squash merge.

## Auto-merge policy (owner decision 2026-11-07)

The owner does not approve routine merges. **Internal PRs** (AIDevCompanyHQ, StudioControlRoom) are merged by Claude or the engine with `node tools/ci/merge-pr.js <owner/repo> <pr> --wait` when: CI is green, the PR is not a draft and targets main, and the work passed QA plus an Opus review APPROVE (or is a small fix Claude tested itself). The script enforces the mechanical guards and refuses anything else.

**Still the owner's call:** which app to build and its spec; releasing or shipping anything external (stores, deploys, user-facing); spending money; destructive or irreversible actions (deleting repos, force-push, visibility changes). Label a PR `owner-review` to force a manual decision.

## Workflow Engine: default way to run work (ADR 0001)

Pipelines run through `tools/engine/engine.js`, not through this chat session. The engine runs each stage as a headless Claude Code run using the role's agent file: **local models** (`qwen3.6:27b` via Ollama) for worker stages and **Claude Opus** for gate reviews (design, milestone code review, R&D calibration). Milestone code-review gates also run a parallel **Codex** reviewer — both Opus and Codex must not REJECT (`docs/adr/0004-codex-tier.md`). Success is decided by file and test checks, never by the model's own claim. Failed stages climb the ladder (local → local retry → **Codex** → Sonnet → **blocked** → owner); Codex rate/usage limits fall through to Sonnet without counting as a failure (`docs/adr/0004-codex-tier.md`).

```
node tools/engine/engine.js pipelines                         # rd-cycle, lite-build, smoke
node tools/engine/engine.js start rd-cycle --var theme="health habits"
node tools/engine/engine.js start lite-build --var slug=water-tracker --var idea=docs/research/ideas/water-tracker-ad-free.md
node tools/engine/engine.js status [runId]
node tools/engine/engine.js approve <runId> approve|reject "<note>"   # owner gates
node tools/engine/engine.js resume <runId>                    # after un-pausing or fixing a block
```

**The main Claude session is the supervisor:** it starts runs (in the background), relays owner gates, and helps with **blocked** runs. It does not do the stages' work itself. Never approve an owner gate on the owner's behalf, except for the `smoke` self-test. Pipelines can take a long time, so always start them with `run_in_background`.

Legacy (manual) flows below still describe *what* each stage does. The engine pipelines encode them.

## R&D workflow (deciding what to build)

Full method and scoring: `docs/research/METHODOLOGY.md`. Trigger: *"Run an R&D cycle"* (optionally with a theme).

1. **Brief**: the orchestrator fills `docs/research/brief-template.md` into `docs/research/cycles/<date>/brief.md`. Call `rd-manager` (Mode A) only for a strategic change of direction.
2. **Scan**: `market-researcher` → `scan.md` (~12 merged, filtered ideas, with fetched evidence for Hot entries).
3. **Analyze**: run **two `opportunity-analyst` calls in parallel**, splitting the Hot + best Warm entries (~6) between them.
4. **Rank**: `rd-manager` (Mode B) calibrates, ranks, writes `proposal.md`, and updates `backlog.md`.
5. **Stop.** Show the owner the summary table and wait. Never start engineering on an idea the owner hasn't approved.
6. **Read the decision**: parse the proposal's "Owner decision" block (or the owner's chat reply). Set each idea's status in `backlog.md` (`approved` → `in-build`, `parked`, `rejected`), then start each approved idea on its track below with the idea file as input.

## Staffing: only call the roles a project needs

The spec's **Platforms & needs** line (METHODOLOGY §4b) and the **Team** block at the top of design.md decide who works. The orchestrator never calls a role that isn't on the Team.

| Project shape | Team |
|---|---|
| Mobile only, local data | mobile-dev, qa, reviewer, devops (EAS build only) |
| Web only, local/no accounts | frontend-dev, qa, reviewer, devops |
| Any platform + accounts/sync/payments | add backend-dev |
| Web + mobile | both front-ends + `packages/shared` monorepo |

## Engineering workflow: two tracks

**Track is set by Ease:** 4–5 → **Lite**, 1–3 → **Full**. The owner can override it.

**Lite track** (small apps, ~1–3 weeks)
1. **Spec + UX**: `product-manager` writes one doc with a UX section. No designer.
2. **Design**: `architect` writes a one-page design.md with Team, stack, data model, and ≤ ~6 tasks in 2–3 milestones. No ADRs unless it deviates from the defaults.
3. **One owner approval** covering the spec's open questions and the design together.
4. **Build** each milestone's tasks with the Team engineers. Independent tasks run in parallel.
5. **Verify once per milestone**: `qa-engineer`, then `code-reviewer`, over the whole milestone.
6. **Ship**: `devops-engineer`, only with the owner's explicit OK.

**Full track** (bigger apps)
1. **Spec**: `product-manager`. → Owner answers open questions.
2. **Design**: `architect` (full design.md + ADRs) and `ui-ux-designer` in parallel. → Owner approves.
3. **Build** task by task in dependency order. Independent tasks that touch different files run in parallel.
4. **Verify after each task**: `qa-engineer` then `code-reviewer`.
5. **Ship**: `devops-engineer`, only with the owner's explicit OK.

Both tracks: when QA or review fails, send the findings back to the same engineer. After 3 failed loops, escalate to the owner.

## Shared rules for every agent

- The documents in `docs/specs/` are the source of truth. If code and spec disagree, flag it; don't guess.
- Small changes: one task per branch/PR.
- Definition of done: lint + typecheck + tests pass, QA PASS, reviewer APPROVE.
- No secrets in the repo. No pushes, deploys, or paid services without the owner's OK.
- Each agent ends with a short report: what changed, how to check it, what's left.
- **Report progress to the Control Room** at each milestone (roughly every 20–25% of your task) by running:
  `node .studio/studio.js log <your-agent-name> <percent> "<what you're doing>"`
  Add `blocked` as a fifth argument if you're stuck or QA/review failed, and `done` when finished.
  The orchestrator logs as `manager`. Start/finish of each handoff is recorded automatically by hooks.
- If the project agents or hooks aren't loaded (they load at session start), the orchestrator should say so and recommend starting a new session, rather than quietly using stand-ins.

## Creative Studio (reports to the owner)

`creative-director` (Opus) leads `image-artist`, `video-producer` and `copy-voice` (Sonnet brains driving **local** models on this PC: ComfyUI for images/video, Kokoro/Whisper for audio). Trigger: *"Create the store assets for <app>"*.

1. `creative-director` Mode A → `docs/creative/<slug>/brand.md` + `asset-list.md`
2. `copy-voice` (copy first; captions and names feed the visuals) → `copy.md`
3. `image-artist` → `assets/<slug>/…`, then `video-producer`. Image/video jobs are **exclusive on the GPU** (the scheduler pauses local LLM work while they run); LLM agents can run several at once on the shared model.
4. `creative-director` Mode B review → `review.md`. Redo loops max 2, then the owner decides.
5. Owner approves the assets before they go into a store listing.

Which model each worker uses lives in `.studio/models.json` (local) and each agent's `model:` line (Claude); the dashboard shows both.

## Start / safe-stop switch

The owner controls all studio work with the switch in the Control Room (or `node .studio/studio.js pause` / `resume` / `status`).

**When paused:** a hook blocks every tool except reading files and `studio.js` commands, so no new work starts. Each agent that is mid-task, including the orchestrator (as `manager`), must immediately save its place and end its turn:
```
node .studio/studio.js checkpoint <agent-name> "<exactly where I stopped>" "<the very next step>" "<files I changed>"
```
Write checkpoints a stranger could resume from: name the task from design.md or the R&D stage, the file and function, and what is half-done.

**When resumed** (the owner flips the switch, then asks to resume):
1. The orchestrator reads `.studio/checkpoints/*.md` (`node .studio/studio.js status`).
2. For each one, it re-delegates to that same agent and includes the checkpoint text in the prompt: "Continue from this checkpoint."
3. It archives each checkpoint once that agent has picked it up: `node .studio/studio.js checkpoint-clear <agent>`.
4. Then it continues the normal workflow.

Checkpoints are also good for ending a session cleanly, not just for stopping in an emergency.

## Local models on this PC

Ollama runs on this PC (RTX 5090, 32 GB) at `127.0.0.1:11434`. Models unload after 5 minutes idle, so the GPU frees up. This is an interim setup while BLD is being repaired; keep model names identical to BLD so switching back is a one-line config change. Studio agents still run on Claude for now. Routing roles to local models is a later step (see `docs/local-llm-roadmap.md`).

## Control Room dashboard

Run `node .studio/studio.js serve` and open http://localhost:4777 to watch agents, progress gauges, and the work trail live.
`node .studio/studio.js reset` clears the log for a new project.

## Folder layout

```
docs/research/  METHODOLOGY.md, backlog.md, cycles/<date>/, ideas/<slug>.md
docs/specs/   specs, design docs, UX docs per feature
docs/adr/     architecture decision records
docs/runbook.md
apps/web  apps/mobile  packages/shared   (created per project)
```

## How to start

- *"Run an R&D cycle on health and habit apps."* → R&D proposal for you to decide on
- *"New app: a habit tracker for web and iOS. Run the studio workflow."* → straight to engineering

## Portability

This workflow is meant to move later to an always-on server running local LLMs, with Claude and the owner providing oversight. See `docs/local-llm-roadmap.md`. Keep every handoff as a plain Markdown file in a known path, and keep agent prompts self-contained, so any model can do the work.

<!-- claude-reflect: learned rules (saved from the band; edit freely) -->
## Learned rules
- Create a separate GitHub repo for each individual development project using standard GitHub practices, and keep Studio control room in its own dedicated repo.
- Ensure developers and employees use applicable local LLMs wherever possible, and keep full focus on developing HiveBoard.
- Route most development work to local LLMs, pick Claude and ChatGPT models by task fit, and rebalance around usage limits instead of halting work.
<!-- end claude-reflect -->
