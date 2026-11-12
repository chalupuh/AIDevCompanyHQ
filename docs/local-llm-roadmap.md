# Roadmap: moving the studio to an always-on, local-LLM server

**Goal:** a server that runs the studio around the clock, with local LLMs doing most of the work. Claude and the owner handle guidance, judgement calls and approvals.

## Design rules we're already following (keep them)

1. **Handoffs are files.** Every stage reads and writes Markdown in known paths (`docs/research/…`, `docs/specs/…`). Any model, or any orchestrator, can pick up where another stopped.
2. **Prompts are self-contained.** Each agent's file in `.claude/agents/*.md` holds its whole job. These become the system prompts for local models without rewriting.
3. **Human gates are explicit.** The R&D proposal, spec approval and production deploy are hard stops. A server can queue them up and wait for you.
4. **Events are a log.** `.studio/events.jsonl` plus the dashboard work the same no matter which model is behind each agent.

## Which model does what (target split)

| Work | Model | Why |
|---|---|---|
| Market scanning, summarising reviews, first-draft idea briefs | **Local** (general instruct model) | High volume, tolerant of errors, gets checked later |
| Front-end / back-end / mobile implementation, tests | **Local** (coding model) | Bulk of the tokens; QA + review catch mistakes |
| QA test runs and first-pass review | **Local** | Mechanical, tool-driven |
| R&D calibration and ranking, architecture, final code/security review | **Claude** | Judgement-heavy; mistakes cost the most |
| Choosing ideas, approving scope, merges, deploys | **You** | Owner gates |

Rule of thumb: **local models generate, Claude checks, you decide.** Escalate to Claude automatically when a local agent fails the QA/review loop twice.

## Phased plan

**Phase 1: Now (this repo, Claude Code on your PC)**
Run R&D cycles and builds here. Tune the agent prompts and scoring weights until the outputs are reliably good. That tuning is what makes the later move work.

**Phase 2: Server + local models, Claude Code still orchestrating**
- A dedicated machine (Linux) with a GPU sized to the models you pick; VRAM is the main constraint.
- Serve local models with **Ollama** or **vLLM**.
- Put a gateway such as **LiteLLM** in front, so each agent can be routed to a local model or to Claude by name.
- Claude Code can be pointed at a compatible gateway (`ANTHROPIC_BASE_URL`), so the same agents and hooks keep working. Check the current Claude Code docs for model-routing support when you get here; it changes often.

**Phase 3: Always on**
- Scheduled R&D cycles (e.g. weekly cron or a scheduled Claude Code run) that drop a new `proposal.md` and notify you.
- A job queue: an approved idea becomes a project, and its tasks flow through the engineering workflow automatically.
- The Control Room dashboard is served from the server, so you can watch it from any device, with approval buttons for the gates.
- Notifications for gates and blockers (email, Slack, or push).

**Phase 4: Hardening**
- Each project runs in its own container or sandbox. Agents only touch their own workspace.
- Budget and rate limits on Claude calls; local-model fallbacks.
- Metrics: ideas proposed vs approved, build-loop counts, QA pass rates per model. Use them to decide which roles can move to local models safely.

## Moving to BLD

The first always-on host is BLD (Windows, RTX 3090 24 GB). The full move-over, with checks, calibration, cutover and rollback, is in [`runbook-bld.md`](runbook-bld.md). After cutover BLD is the primary host and the 5090 PC only browses the Control Room.

## Decisions for later (owner)

- Hardware budget, which sets the size of local model you can run
- Which roles move to local models first. Suggested order: researcher → analyst → QA → front-end dev
- Where the server lives (home box vs cloud GPU) and how you reach it remotely
