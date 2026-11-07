# Internal proposal: studio improvements (2026-11-07)

**Inputs:** `findings.md` and `recommendations.md` in this folder. I checked them against the current code: `tools/engine/engine.js`, `.studio/studio.js`, `.studio/app/src/features/ops/OpsPanel.tsx`, ADR 0001 and `docs/internal/eng-backlog.md`.
**Reviewer:** rd-manager (calibration gate).

## What changed from the recommendations

- **Two items were partly built already, so I cut their scope.**
  - **Item 1, Owner Inbox.** The Control Room v2 Ops view already has it. It lists waiting gates and blocked runs, has Approve and Reject (with a confirm step) through `POST /api/gates/:runId`, and has Resume for blocked runs. The recommendation says the dashboard "is view-only today", which is wrong. What's still missing: a **Park** outcome, and **per-item decisions**. The rd-cycle gate can only approve or reject the whole proposal, and the owner picks idea by idea. The item is now scoped to that gap.
  - **Item 2, token meter.** Already built. The engine writes a `usage` event (agent, tier, model, cloud, tokens, secs) for every attempt. `/api/usage` breaks usage down by agent and by day against `.studio/budget.json`. The Budget card shows warn and over states. What's still missing: a per-project breakdown (usage events have no project or run id) and a fallback-rate alert. Both are metrics work, so **the rest of item 2 merges into item 11**.
- **Merged:** item 8 (DoD per role, DoR input check) into item 7. Both define the contract of a stage: what must exist before it starts, and what its output must look like when it's done. The DoR source was never fetched (finding 2.7). The input check stands on its own merits: it is a deterministic precondition and doesn't need a citation.
- **Dropped:**
  - **Item 5 (Village as skin only).** It is a "don't do", not work. The finding behind it is only partly verified: the Smallville UI wasn't fetched (3.6). The "lessons-learned files" add-on has no problem it solves yet. The constraint (Village reads real status and events only, no simulated personalities) is still good. It already matches the Village task in eng-backlog Sprint 1, so nothing new needs approving.
  - **Item 14 (dated asset schedule).** The only source is unverified (2.7), it depends on a queue-ordering feature we don't need, and nothing shows that missed asset dates are a problem.
- **Impact and effort changes:**
  - **Item 10, WIP limits.** Cut down to a **GPU lock**. The Opus-cap half has no evidence of a problem, because each run executes stages one at a time and concurrent Opus gates are rare. ComfyUI queue length is already on the GPU panel. A lock file around GPU stages is S, not M. Impact stays 3. The risk is real: the local qwen3.6:27b worker and ComfyUI share the same 32 GB card, and only `CLAUDE.md` text prevents two jobs at once.
  - **Item 6, static pipeline ADR.** Impact 3 → **2**. ADR 0001 already says "Claude reviews at the gates", and the engine is already static. This item only writes down current practice. The CrewAI manager details it cites are search-only (1.6).
  - **Item 1, Owner Inbox (rescoped).** Impact 5 → **4**, because most of the value has shipped. Effort stays M: the engine needs a new gate status, and decisions have to be written back into Markdown decision blocks.
  - **Item 3, click-through.** Impact 4 → **3**. Attempt history with per-attempt problems, tier and time is already shown. The gap is saving the actual prompt (not stored today) and the full output (`result` is cut to 2,000 chars).
  - **Item 9, postmortems.** Cut to the engine-written stub on `blocked` and Opus escalation. "A retro after each milestone" adds a model call per milestone and would cost more than it returns. Impact 3, S.
  - **Item 4, replay.** Impact 3 → **2**. Its main source is search-only (3.5), and the plan itself puts it last (Phase 4).
  - **Item 12, isolation and schedules.** Impact 3 → **2**. The source only says "worth considering" (1.8), and no local coder has damaged the main tree yet. Effort stays L.

**Ranking rule:** impact ÷ effort, using S = 1, M = 2.5, L = 6. Ties are broken by impact, then by dependency order.

## Ranked table

| Rank | Item | Dept | Impact | Effort | Local-ok | Score | Was |
|---|---|---|---|---|---|---|---|
| 1 | GPU capacity scheduler (owner rescoped: parallel LLM agents, exclusive creative batches) | eng | 3 | S | Yes | 3.0 | #10 (rescoped) |
| 2 | Postmortem stub on blocked runs and Opus escalations | process | 3 | S | Partly | 3.0 | #9 (rescoped) |
| 3 | Critique-format Creative Director gate | creative | 3 | S | Partly | 3.0 | #13 |
| 4 | ADR note: static pipeline, managers only review at gates | process | 2 | S | Yes | 2.0 | #6 |
| 5 | Owner Inbox: Park outcome plus per-item decisions | process | 4 | M | Yes (human tests approve path) | 1.6 | #1 (rescoped) |
| 6 | Stage contract: prompt template, input-ready check, per-doc heading check, DoD | process | 4 | M | Yes | 1.6 | #7 + #8 |
| 7 | Flow, fallback and cost metrics (with project id and fallback alert) | eng | 4 | M | Yes | 1.6 | #11 + rest of #2 |
| 8 | Stage click-through to saved prompt and full output | eng | 3 | M | Yes | 1.2 | #3 (rescoped) |
| 9 | Day-by-day replay of the event trail | eng | 2 | M | Yes | 0.8 | #4 |
| 10 | Per-run isolation and scheduled triggers (spike) | eng | 2 | L | Partly | 0.33 | #12 |

Dropped: #5 (Village skin only), #14 (asset schedule). Merged: #2 into 7, #8 into 6.

## Rationale for the top items

1. **GPU lock.** A hard rule that today exists only as text. The local worker model and ComfyUI share one 32 GB GPU, so two jobs at once can fail by running out of memory. Fix: a lock file in `.studio/` that GPU stages (creative pipelines, and local tiers if needed) wait on, plus a `wip.gpu: 1` setting. Cheap and deterministic. Evidence: Kanban WIP limits (2.2, fetched).
2. **Postmortem stub.** When a run goes `blocked`, or an attempt escalates to an Opus tier, the engine writes `docs/postmortems/<runId>.md`. The stub holds impact, the failed stage and tier, the problems list (already in `run.history`), and empty root-cause and follow-up sections. This gives the promotion and demotion rule (plan §C) a written record and not just a counter. Evidence: SRE postmortem practice (2.4, fetched). A local model may draft the root cause. The owner or Opus reviews it.
3. **Critique-format CD gate.** A prompt and template change to `creative-director` Mode B. It restates the brief's objectives, scores each asset against them, gives balanced notes without fixes, and ends with a numbered redo list. That list is the input to the max-2 redo loop. Evidence: NN/g design critique (2.5, fetched). The gate stays on Opus per ADR 0001.
4. **ADR note.** A half-hour doc change. It records why we don't move to manager-agent dispatch, so later sessions stop re-proposing it. It is low impact because it changes nothing in how we work. Evidence: 1.1 and 1.2 (fetched), 1.6 (manager details search-only).
5. **Owner Inbox: Park and per-item decisions.** This is the real gap left from initiative A, Phase 2, item 6. Today an R&D or internal proposal is one approve/reject gate, but the owner decides per item. Then someone has to edit the "Owner decision" block by hand. Fix: add `park` to `engine.js approve`, and render the proposal's decision-block checkboxes in the Inbox with Approve, Park and Reject per line. Write the choices back into the decision block. Leave the backlog updates to the orchestrator, as now. A human must test it, and the supervisor must never click it.
6. **Stage contract.** Every agent stage states its objective, inputs, output path and format, tools and boundaries. The engine already appends the "Studio rules / You MUST create" lines, so this extends what exists. New engine checks: an `inputs` list must exist before a stage starts, and a `headings` list must be present in each expected file (spec, design.md, idea, proposal). Plus a short done checklist in each agent file. This targets the most common local-model failure: the output exists but has the wrong shape. Evidence: 1.1 (fetched), 1.3 (MetaGPT abstract and README only), 2.1 (fetched).
7. **Metrics.** Add `run` and `project` to every `usage` event. Then `studio.js metrics` computes the fallback rate per role (ADR rule, demote above 25%), stage pass rate, and lead time from spec approval to ship. The fallback-rate alert goes on the existing Budget card. Change failure rate can wait: we have no shipped apps yet, so there's no data. Evidence: 2.2 and 2.3 (fetched), 3.1 and 3.4 (fetched, for cost breakdown). This is the item that tells us whether initiative C is working.

Items 8–10 are useful but not urgent. **8 (click-through)** is the next step once 6 and 7 land. **9 (replay)** is decorative until we have enough history. **10** should wait until a local coder actually damages the working tree, or until the Growth loop needs a schedule.

## Things to watch

- **Shaky evidence.** No item in the top 7 depends only on search-only or unfetched findings. Item 6's DoR half and item 4's CrewAI point lean on unverified sources, but neither needs them to stand. Before anything cites RACI (2.6), DoR or the editorial calendar (2.7), AI Village (3.5) or Smallville's UI (3.6) in a design doc, re-fetch the source. That follows the findings' own "Gaps to close".
- **Out of scope, but please look.** `parseRunOutput()` in `engine.js` suppresses the run error whenever the `[claude-code:unrecognized_model]` warning appears, even when the result is empty. `verify()` then skips the "empty final answer" check, so a local stage that printed the warning and produced nothing can pass if it has no `expect` files. Item 6's heading checks would reduce the risk. Worth a separate bug line.
- **Progress logging.** This session had no shell tool, so `node .studio/studio.js log rd-manager …` could not be run. The engine's start and done events still record this stage.

## Owner decision

Tick one option per line. After you decide, the orchestrator adds approved items to `docs/internal/eng-backlog.md` (eng and process items) or `docs/internal/creative-backlog.md` (creative items). I have not added anything.

- [ ] 1. GPU lock (eng): Approve / Park / Reject
- [ ] 2. Postmortem stub on blocked runs and Opus escalations (process → eng-backlog): Approve / Park / Reject
- [ ] 3. Critique-format Creative Director gate (creative → creative-backlog): Approve / Park / Reject
- [ ] 4. ADR note: static pipeline, managers only review at gates (process → eng-backlog): Approve / Park / Reject
- [ ] 5. Owner Inbox: Park outcome plus per-item decisions (process → eng-backlog): Approve / Park / Reject
- [ ] 6. Stage contract: template, input check, heading check, DoD (process → eng-backlog): Approve / Park / Reject
- [ ] 7. Flow, fallback and cost metrics (eng): Approve / Park / Reject
- [ ] 8. Stage click-through to saved prompt and full output (eng): Approve / Park / Reject
- [ ] 9. Day-by-day replay (eng): Approve / Park / Reject
- [ ] 10. Per-run isolation and scheduled triggers spike (eng): Approve / Park / Reject

**My recommendation:** approve 1–7 as one internal sprint (about 4 S-sized items and 3 M-sized items). Park 8–10. If you want to revive the dropped items (#5 Village skin only, #14 asset schedule), say so in your notes.

Notes:
