# Internal Initiatives: plan (2026-11-06)

These are three internal initiatives to finish before major app projects start. They depend on each other, so the order matters:

> **C (model standard) → B (org flow) → A (Control Room v2).**
> Moving work to local models changes who orchestrates, and that changes what the Control Room has to show and control.

---

## A. Control Room v2: the centrepiece

### What's wrong with v1
- It's a single 370-line HTML file that polls three endpoints every second. That's fine for a prototype, but hard to grow.
- It's view-only. Every decision (approvals, R&D picks) still happens in chat or by editing Markdown.
- There's no sense of the people: the cards are generic, and you can't click into a worker.
- It doesn't show cost (Claude tokens vs local), GPU load, or which models are loaded right now.
- The org-chart layout wraps awkwardly as teams grow (4 teams, 17 workers).

### Characters and identity
Each role gets a name, a portrait, a personality line, and a signature colour, shown on its card, profile and trail entries.

**Copyright note:** real anime characters' names and likenesses are owned (Toei, Shueisha, and others). Using them privately is low-risk. But generating their portraits is exactly the kind of copying our own originality rules forbid, and it becomes a problem the day the dashboard is shown publicly, open-sourced, or turned into a product.

**Recommendation:** **original anime-style characters**, designed by our own Creative Studio, the first real job for the Image Artist (Z-Image-Turbo) and a good test of the pipeline.

Example cast, with archetypes inspired by the genre but entirely our own:

| Role | Name | Archetype |
|---|---|---|
| Eng. Manager (orchestrator) | **Kaito** | calm strategist, the captain |
| R&D Manager | **Professor Rin** | sharp-eyed scholar |
| Market Researcher | **Sora** | scout with binoculars |
| Opportunity Analyst | **Mika** | numbers prodigy with a clipboard |
| Product Manager | **Hana** | organised class president |
| Architect | **Daichi** | stoic master builder |
| UI/UX Designer | **Yuki** | gentle perfectionist |
| Frontend / Backend / Mobile | **Ren / Taro / Aoi** | the hotshot trio |
| DevOps | **Gen** | mechanic who keeps the ship flying |
| QA Engineer | **Nami** | relentless inspector |
| Code Reviewer | **Sensei Kuro** | strict veteran mentor |
| Creative Director | **Akira** | visionary artist |
| Image / Video / Copy & Voice | **Hikari / Kenji / Emi** | the art crew |

*(You can rename any of them. Names live in one config file.)*

### Features, in priority order

**Phase 1: foundation and identity (≈1 week)**
1. Rebuild as a small **Vite + React + TypeScript** app served by `studio.js`, with **live updates pushed from the server (SSE)** instead of polling every second.
2. **Character cards:** portrait, name, role, status ring, model chips (brain and local), current task.
3. **Profile drawer** (click any worker): bio, model(s), current task and progress, last 20 actions, checkpoint, and that worker's stats (tasks done, pass rate, average time, tokens used).
4. **Better org chart:** zoom and pan, collapsible teams, and team lanes that don't wrap. A mobile layout (cards list) for checking from your phone.
5. Animated handoffs, kept: a character "passes" a document along the wire to the next.

**Phase 2: control, not just view (≈1 week)**
6. **Owner Inbox:** every gate in one place (R&D proposals, spec + design approvals, asset reviews, ship approvals). **Approve / Park / Reject buttons** write straight into the decision blocks, so there's no Markdown editing.
7. **Per-team pause switches** (R&D / Engineering / Creative) alongside the global safe-stop.
8. **Work board:** a kanban of tasks by project and milestone (Backlog → In progress → QA → Review → Done), built from design.md task lists.
9. **Project switcher:** filter everything to one app.

**Phase 3: resources and cost (≈3–4 days)**
10. **Model and GPU panel:** loaded Ollama models, VRAM used out of 32 GB, ComfyUI queue, GPU temperature and utilisation (from `nvidia-smi`).
11. **Token meter:** Claude tokens and estimated $ per day, per project and per role, against a **daily Claude budget** you set, plus the local-vs-Claude share. This tracks how well initiative C is working.
12. **Alerts:** a toast and sound when a gate needs you, an agent is blocked, or the budget passes 80%. Desktop notifications are optional.

**Phase 4: polish (ongoing)**
13. Session replay: scrub through a day's timeline.
14. An "office" view mode: characters at desks that light up when working. Purely for fun, built on the same data.
15. Light and dark themes, sounds on/off, an accessibility pass (keyboard, contrast, reduced motion).

### Built by the studio itself
This is a good first internal project for the engineering flow (Lite track, web only): `product-manager` → `architect` → `frontend-dev` → QA/review, with `image-artist` doing the portraits. It tests the whole org end to end.

---

## B. Org structure review: is this a good flow?

### What's working
- **Owner gates** at the right points: what to build, scope, ship.
- **Independent quality** (QA + reviewer separate from the builders).
- **File-based handoffs** (portable to BLD and to local models).
- **Lite vs Full tracks** and platform-based staffing.

### Problems

1. **The orchestrator is the most expensive part.** The main Claude session reads every report and makes every routing decision. Most of that is mechanical: "QA passed → call the reviewer". That's the biggest source of Claude tokens, and the opposite of goal C.
   → **Fix:** a **workflow engine** (a deterministic script, the "Kaito" role) that runs the pipelines as a state machine: read the stage, call the agent for that stage, check the output file exists and passes a schema check, move on. It escalates to Claude only for judgement calls, and to you for gates.

2. **The Eng. Manager runs all three teams.** R&D and Creative are drawn as peers, but in practice everything goes through one session.
   → With the engine in place, each team is just a pipeline definition (`pipelines/rd.yaml`, `engineering.yaml`, `creative.yaml`), and the managers become **reviewers/approvers** inside their own pipeline.

3. **The UI/UX Designer sits in Engineering, but visual decisions now live in Creative.** Brand tokens and screen visuals overlap with the Creative Director.
   → Move **ui-ux-designer under Creative** as "Product Designer". Engineering keeps ownership of flows and specs; Creative owns the look.

4. **Creative runs after the build.** Store assets, icons and onboarding art are on the critical path at launch.
   → Start Creative **in parallel once the spec is approved**: brand and icon early, screenshots after the first milestone.

5. **There's no "after launch".** Nothing watches reviews, crashes or metrics, or feeds them back.
   → Add a small **Growth & Feedback** loop later: one agent (local model) that summarises store reviews and analytics weekly into the R&D backlog. R&D becomes continuous instead of one-off.

6. **There's no memory of how well roles perform.** We can't tell which roles are reliable on local models.
   → The Control Room records per-role pass rates and loop counts (A, Phase 3). Initiative C uses them to decide what moves to local models.

### Proposed structure

```
                         Owner (you): gates via the Owner Inbox
                                       │
                     Workflow Engine "Kaito" (script + local model)
             runs pipelines, routes work, enforces gates, logs everything
        ┌────────────────────┬─────────┴──────────┬──────────────────────┐
     R&D                Engineering            Creative + Design      Growth (later)
  Prof. Rin (review)   Hana PM → Daichi arch   Akira (review)         review/analytics
  Sora, Mika           Ren/Taro/Aoi, Gen       Yuki (product design)  digest → R&D backlog
                       Nami QA · Kuro review   Hikari, Kenji, Emi
```
Flow: **R&D → Owner → Spec → (Engineering ∥ Creative) → QA/Review → Owner → Ship → Growth → R&D**

---

## C. Model placement standard

### Principle
> **Local models do the work. Claude checks the work at the gates. You decide.**

Claude is used only where a mistake is expensive or where local models have *measurably* failed.

### Tiers

| Tier | Runs on | Used for |
|---|---|---|
| **L1: local helper** | `qwen3:4b` (always loaded, tiny) | routing, classifying, summarising logs, checkpoint text, schema checks |
| **L2: local worker** | `qwen3.6:27b` (general + vision) · `qwen3-coder:30b` (code) | drafting, research synthesis, coding, tests, copy, first-pass QA |
| **L3: local creative** | ComfyUI (Z-Image, Qwen-Edit, Wan2.2) · Kokoro · Whisper | all images, video, voice, transcripts |
| **C1: Claude Sonnet** | cloud, limited | escalation when L2 fails twice; tricky multi-file changes |
| **C2: Claude Opus** | cloud, rare | architecture, final code + security review, R&D calibration, creative sign-off |

### Role → model (target)

| Role | Primary | Claude's job |
|---|---|---|
| Workflow engine (Kaito) | script + L1 | none (escalates only) |
| Market Researcher | L2 general | none |
| Opportunity Analyst | L2 general | none |
| R&D Manager | L2 drafts the ranking | **Opus calibrates and signs off** on the proposal (1 call per cycle) |
| Product Manager | L2 general | Sonnet review only on Full track |
| Architect | **Opus** (small output, high leverage) | stays on Claude. One call per project. |
| UI/UX → Product Designer | L2 + vision | none |
| Frontend / Backend / Mobile | L2 coder | Sonnet when QA fails twice |
| DevOps | L2 coder | none (owner approves ship) |
| QA Engineer | L2 coder (runs tests, writes E2E) | none |
| Code Reviewer | L2 first pass | **Opus final pass per milestone**, not per task |
| Creative Director | L2 vision drafts the brief and pre-screens assets | **Opus sign-off** on the final asset set |
| Image / Video / Copy & Voice | L3 + L2 | none |

Expected effect: Claude goes from *every step* to roughly **3–6 calls per project** (architecture, milestone reviews, final creative sign-off) plus escalations.

### How it's wired (the technical part)
- **One gateway (LiteLLM) on this PC** in front of Ollama and Claude, with the same config as BLD's `stack/litellm-config.yaml`.
- **Option 1 (recommended to try first): Claude Code through the gateway.** Point Claude Code at LiteLLM and map model names. Agents marked `model: haiku` route to local L2 models, while `sonnet` and `opus` still go to Claude. The agent files, hooks and dashboard stay as they are.
  - *Risk:* Claude Code's agent loop needs reliable tool calling, and local models are weaker at it. Benchmark first.
- **Option 2: the workflow engine calls local models directly** (Ollama API) for the roles that don't need full tool use (research synthesis, copy, briefs, review summaries). Keep Claude Code only where agents edit code in the repo.
- Most likely we end up with **both**: Option 2 for writing roles, Option 1 for coding roles once a local coder passes the benchmark.

### Promotion rule: when a role moves to local, and back
1. Create a fixed **eval set per role** (e.g. 5 past tasks with known-good outputs).
2. Run it on the local model. Owner and Opus score it 1–5.
3. **Promote to local** if the score is ≥ 4 and the QA/review loop count is no worse than Claude's.
4. Use the **Auto-fallback**: if a local agent fails its loop twice on a live task, that task escalates to Sonnet, and the dashboard counts it.
5. Re-check monthly. Demote a role back to Claude if its fallback rate goes above 25%.

### Budget guardrails
- A **daily Claude token budget** is enforced by the gateway: past 80% you get an alert, past 100% only gate reviews run.
- Every Claude call is logged with its role and project and shown in the Control Room token meter.

---

## Suggested order of work

| # | Step | Size |
|---|---|---|
| 1 | Finish the creative install, then write and test the creative helper scripts | ½ day |
| 2 | Set up LiteLLM on this PC and a **benchmark harness** with eval sets for 4 roles (researcher, analyst, frontend-dev, QA) | 1–2 days |
| 3 | Decide Option 1 vs 2 per role from the results; record it as the model standard (ADR) | ½ day |
| 4 | Build the **workflow engine** (pipelines + gates), then rewire CLAUDE.md so the main session is a supervisor | 2–3 days |
| 5 | Move UI/UX under Creative and start Creative in parallel (doc changes) | ½ day |
| 6 | Character design: Creative Studio produces 17 portraits (first creative job) | 1 day |
| 7 | **Control Room v2**, phases 1 → 3, built by the studio | ~2–3 weeks |

## Decisions needed from the owner
1. Original anime-style characters, or real anime names (internal-only)?
2. The daily Claude budget, as a starting number.
3. OK to move UI/UX under Creative?
4. OK to build the workflow engine before Control Room v2? This is the recommended order.
