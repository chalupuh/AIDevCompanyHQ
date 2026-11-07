# Studio recommendations (2026-11-07)

Source: `docs/research/internal/2026-11-07/findings.md` (finding numbers like "3.7" mean section 3, item 7). Context: ADR 0001, `tools/engine/engine.js`, `.studio/events.jsonl`, initiatives A (Control Room v2) and B (org flow).

Scales: impact 1 (minor) to 5 (major). Effort S (≤1 day), M (2–4 days), L (1+ week). "Local" = whether a local model (qwen3.6:27b) can do the work.

**Evidence caveat:** findings 2.6 (RACI), 2.7 (DoR, editorial calendar), 3.5 (AI Village) and 3.6 (Smallville UI) were not verified from fetched sources. Items that lean on them say so.

---

## Control Room UI

### 1. Owner Inbox with approve / park / reject buttons
- **Department:** process
- **What to change:** Add an Inbox panel to the Control Room (`.studio/` dashboard served by `studio.js serve`). It lists pending owner gates from the run files in `.studio/runs/` and has buttons that call the same logic as `engine.js approve <runId> approve|reject "<note>"`. Add a "park" outcome that writes to `docs/research/backlog.md`. The dashboard is view-only today.
- **Why:** Tracing tools are view-only, and the Owner Inbox is where we differ. Prioritise it first (finding 3.7). ChatDev 2.0 also puts human feedback in the launch tab (1.4).
- **Impact:** 5 | **Effort:** M | **Local model:** Yes, as a small, well-specified UI and endpoint task. A human must test the approve path, and the supervisor must never auto-approve.

### 2. Token and cost meter with threshold alerts
- **Department:** eng
- **What to change:** Have the engine write token counts, tier (local, sonnet, opus) and role into each `events.jsonl` entry. Add a dashboard panel that breaks usage down by role, project and tier. Add an alert banner when a daily budget or fallback-rate threshold is crossed.
- **Why:** Langfuse offers cost tracking and threshold alerts (3.1). Helicone breaks cost down by dimension (3.4). Multi-agent runs used about 15x chat tokens (1.1), so Claude spend needs watching.
- **Impact:** 4 | **Effort:** M | **Local model:** Yes. It is mostly aggregation and rendering.

### 3. Click-through from a stage to its exact prompt, output and score
- **Department:** eng
- **What to change:** Save each stage's prompt, output path and QA/review verdict alongside its event (a `.studio/runs/<id>/` folder). Add a stage drawer in the UI that opens them and shows a waterfall timeline of the run.
- **Why:** AgentOps shows the exact prompt and completion for a selected event (3.3). LangSmith attaches feedback and scores to runs (3.2). This speeds up debugging when local models fail.
- **Impact:** 4 | **Effort:** M | **Local model:** Yes.

---

## Village view

### 4. Day-by-day history replay of the event trail
- **Department:** eng
- **What to change:** Add a date scrubber to the Village and trail views that replays `events.jsonl` for a chosen day. Show each agent's last ~20 actions in the profile drawer. Build it after the Inbox, meter and click-through.
- **Why:** AI Village offers day-by-day history and a per-agent view of recent actions (3.5, search only, so re-check the blog post first). AgentOps provides session replay (3.3). The findings place replay last in priority (Suggestions for A).
- **Impact:** 3 | **Effort:** M | **Local model:** Yes.

### 5. Village as a skin over real data, with no simulated personalities
- **Department:** eng
- **What to change:** Keep the Village a visual layer that reads only agent status and events. Do not add personality or memory simulation. If anything is added, give each role a `lessons-learned` file that is condensed periodically (see item 11).
- **Why:** Smallville's memory and reflection help believability, but simulating personalities costs tokens without improving output (3.6). The demo UI was not fetched, so this is design guidance only.
- **Impact:** 2 | **Effort:** S | **Local model:** Yes.

---

## Workflows & roles

### 6. Keep the static pipeline; no manager-agent dispatch
- **Department:** process
- **What to change:** Add a short note to ADR 0001 (or a new ADR) stating that managers act only as gate reviewers. Delegation inside a stage is not dynamic. Update `CLAUDE.md` to match.
- **Why:** The simplest workable design is recommended (1.2). Hierarchical manager agents are the expensive pattern (1.6). Coding has few parallelisable subtasks (1.1).
- **Impact:** 3 | **Effort:** S | **Local model:** Yes.

### 7. Standard stage-prompt template and a schema per document type
- **Department:** process
- **What to change:** Add a template to the pipeline JSONs and `.claude/agents/*.md` so that every stage prompt states the objective, output path and format, tools and boundaries. Add a simple structural check (required headings) per doc type (spec, design.md, idea, proposal) to the engine's file verifier.
- **Why:** Vague delegation caused duplicated work (1.1). MetaGPT passes fixed-shape documents between roles, and experts check intermediate output (1.3).
- **Impact:** 4 | **Effort:** M | **Local model:** Yes. Heading checks are deterministic code.

### 8. Definition of Done per role output, plus a Definition of Ready check at stage start
- **Department:** process
- **What to change:** Add a `done` checklist per role to the agent files. Add an `inputs` check to the engine so that a stage does not start until its input files exist and the spec's open questions are answered.
- **Why:** Scrum items that miss the DoD return to the backlog (2.1). DoR is *unverified* (2.7), so treat the DoR half as a trial and confirm with a working source.
- **Impact:** 3 | **Effort:** S | **Local model:** Yes.

### 9. Blameless postmortem file on blocked runs and Opus escalations
- **Department:** process
- **What to change:** When a run becomes blocked or an escalation reaches Opus, have the engine create a stub in `docs/postmortems/<runId>.md` (impact, mitigation, root cause, follow-ups). Add a short retro after each R&D cycle and each milestone.
- **Why:** Defined triggers and written, reviewed records are the practice (2.4). Scrum retrospectives feed improvement (2.1). The data drives model promotion and demotion decisions.
- **Impact:** 3 | **Effort:** S | **Local model:** Partly. The engine writes the stub, and a local model can draft the root cause, but Opus or the owner should review it.

---

## Engine

### 10. WIP limits per queue (GPU and Opus gate)
- **Department:** eng
- **What to change:** Add a `wip` setting in the engine config. Enforce one creative GPU job at a time in code, not just in `CLAUDE.md`. Cap concurrent Opus gate reviews, and show queue length on the Control Room.
- **Why:** Kanban WIP limits cut delay and create pull signals (2.2). The single-GPU rule already exists only as a written rule.
- **Impact:** 4 | **Effort:** M | **Local model:** Yes.

### 11. Flow and delivery metrics derived from `events.jsonl`
- **Department:** eng
- **What to change:** Add `node .studio/studio.js metrics` that computes lead time (spec approved to ship), change failure rate (ships followed by a bug-fix run), local-to-Claude fallback rate and stage pass rate. Show them as a dashboard card. Use LangSmith-style names (project, thread, trace, run) in the event schema.
- **Why:** DORA's four measures can be derived from events (2.3). Kanban's flow metrics are lead time, delivery rate and WIP (2.2). LangSmith's hierarchy maps to our model (3.2).
- **Impact:** 4 | **Effort:** M | **Local model:** Yes.

### 12. Per-run isolation and scheduled triggers (investigate first)
- **Department:** eng
- **What to change:** Prototype running each build stage in its own git worktree, or a container, so a misbehaving local coder cannot damage the main tree. Separately, add an optional schedule trigger to `engine.js start` for recurring jobs such as the planned Growth loop.
- **Why:** OpenHands uses per-conversation sandboxes and scheduled or event-triggered automations (1.8). The findings only call this "worth considering", so run a spike before committing.
- **Impact:** 3 | **Effort:** L | **Local model:** Partly. A local model can write the scripts, but design and safety review need Claude.

---

## Creative pipeline

### 13. Critique-format Creative Director gate
- **Department:** creative
- **What to change:** Change `creative-director` Mode B so that `review.md` follows the critique format. It restates the brief's objectives, scores each asset against them, balances positives and negatives, does not propose fixes in the review, and ends with a numbered list of redo items. This list is the input to the max-2 redo loop.
- **Why:** Design critique practice sets objectives first, a scope, balanced notes and follow-up action items (2.5). It also supports the existing 2-loop limit.
- **Impact:** 3 | **Effort:** S | **Local model:** Partly. A local model can fill the template, but the gate stays on Opus per ADR 0001.

### 14. Dated asset schedule per app
- **Department:** creative
- **What to change:** Add a `schedule.md` section to `docs/creative/<slug>/asset-list.md` listing each asset, its stage and its target date, and have the engine's GPU queue (item 10) use it for ordering.
- **Why:** An editorial calendar is a candidate idea (2.7), but the finding is *unverified*. Treat this as a trial and confirm the source first.
- **Impact:** 2 | **Effort:** S | **Local model:** Yes.

---

## Summary

| # | Title | Group | Dept | Impact | Effort | Local? |
|---|---|---|---|---|---|---|
| 1 | Owner Inbox | Control Room UI | process | 5 | M | Yes |
| 2 | Token/cost meter and alerts | Control Room UI | eng | 4 | M | Yes |
| 3 | Stage click-through | Control Room UI | eng | 4 | M | Yes |
| 4 | Day-by-day replay | Village view | eng | 3 | M | Yes |
| 5 | Village as skin only | Village view | eng | 2 | S | Yes |
| 6 | Static pipeline ADR | Workflows & roles | process | 3 | S | Yes |
| 7 | Prompt template and doc schemas | Workflows & roles | process | 4 | M | Yes |
| 8 | DoD per role, DoR check | Workflows & roles | process | 3 | S | Yes |
| 9 | Postmortems and retros | Workflows & roles | process | 3 | S | Partly |
| 10 | WIP limits | Engine | eng | 4 | M | Yes |
| 11 | Flow metrics | Engine | eng | 4 | M | Yes |
| 12 | Isolation and schedules | Engine | eng | 3 | L | Partly |
| 13 | Critique-format gate | Creative pipeline | creative | 3 | S | Partly |
| 14 | Asset schedule | Creative pipeline | creative | 2 | S | Yes |

**Suggested order:** 1, 2, 3, 7, 10, 11 first. Then 6, 8, 9, 13. Then 4, 5, 14. Item 12 needs a spike.
