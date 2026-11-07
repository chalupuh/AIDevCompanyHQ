# Internal research: agent orgs, team workflow frameworks, control-room UIs (2026-11-07)

**Scope:** inform initiatives B (org flow) and A (Control Room v2) in `docs/plans/2026-11-internal-initiatives.md`, given ADR 0001 (local-first, Claude at gates) and `tools/engine/engine.js` (JSON pipelines, gate/agent stages, escalation ladder local → local → sonnet → opus, owner gates, `.studio/events.jsonl`).

**Method note:** every finding was taken from a page fetched on 2026-11-06/07 unless marked *(search only)*. Many doc sites returned thin index pages, so I only claim what the fetched text said. Where detail was missing I say so. The `studio.js log` progress command could not be run: this session had no shell tool.

**What we already have (for context):** a deterministic state machine (engine), owner gates, a role→model ladder with auto-fallback, an independent QA/review role, checkpoints, an event log, and a view-only dashboard.

---

## 1. Multi-agent frameworks: role and org designs

1. **Anthropic's orchestrator-worker research system**
   - **What:** A lead agent plans and spawns parallel subagents. A separate citation agent attributes claims to sources. The lead saves its plan to memory because context can be truncated. Each subagent needs an objective, output format, tool and source guidance, and clear task boundaries. Vague delegation caused duplicated work. Agents resume from the point of failure using checkpoints plus deterministic retries. Multi-agent runs used about 15x the tokens of chat, and the post says coding is a poor fit because it has fewer parallelisable subtasks.
   - **Source:** https://www.anthropic.com/engineering/multi-agent-research-system
   - **Relevance:** Our stage prompts should always state objective, output path/format, tools and boundaries. Parallelism pays only for research-style stages, not for code.

2. **Five workflow patterns, and "start simple"**
   - **What:** Prompt chaining with programmatic checks between steps, routing to cheaper models, parallelisation, orchestrator-workers, and evaluator-optimizer loops. The post recommends the simplest solution that works, stopping conditions such as max iterations, and human checkpoints. It says human review of coding agents is still important.
   - **Source:** https://www.anthropic.com/engineering/building-effective-agents (LangGraph's docs list the same patterns: https://docs.langchain.com/oss/python/langgraph/workflows-agents)
   - **Relevance:** Our engine is already a chain with checks, plus routing by tier and an evaluator loop (QA/review). This validates the design. Keep it deterministic and add no more agent autonomy.

3. **MetaGPT: SOPs as the organising idea**
   - **What:** Roles (product manager, architect, project manager, engineer) work as an assembly line. Standard operating procedures are encoded into prompt sequences ("Code = SOP(Team)"). One line of requirement yields user stories, requirements, data structures and APIs. The abstract says agents with domain expertise check intermediate results to limit cascading hallucination. Evidence is the abstract and README only: I could not fetch the full paper (too large), so I did not verify details such as the message pool.
   - **Source:** https://arxiv.org/abs/2308.00352 and https://github.com/FoundationAgents/MetaGPT
   - **Relevance:** This is close to our PM → Architect → Engineer flow. The takeaway is that each role's output should be a fixed-shape document that the next role checks, which is what our file-check verifier does. Consider adding a schema per doc type.

4. **ChatDev: a role "company" with replay and human-as-reviewer**
   - **What:** A virtual software company with CEO, CTO and Programmer roles holding "seminars" across design, coding, testing and documentation. The repo adds a human-agent mode in which you play the reviewer, an art mode with a designer agent, log and replay modes, and a visualiser. Version 2.0 (Jan 2026) moves agents and workflows into YAML config, with real-time logs, intermediate artifacts and human feedback in a launch tab. The abstract (https://arxiv.org/abs/2307.07924) says natural language helps with design and code-level communication helps with debugging. It gives no role list or numbers.
   - **Source:** https://github.com/OpenBMB/ChatDev
   - **Relevance:** Three of our planned Control Room features (replay, artifact inspection, human feedback in the loop) already exist in a comparable system. This suggests our config-driven pipelines are on the same path.

5. **AutoGen Swarm: decentralised handoffs**
   - **What:** Agents pass control through handoff tool calls. All agents share the same message context. A handoff to `"user"` stops the run and waits for human input, and the reply returns to the requesting agent. Parallel tool calls can cause multiple handoffs, so they are disabled. It needs tool-calling models.
   - **Source:** https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/swarm.html (patterns page: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/intro.html lists group chat, reflection, handoffs, sequential and mixture of agents, with little detail)
   - **Relevance:** A shared context across all roles would burn local-model context and tokens. Our file-based handoffs are the leaner choice. "Hand off to user" maps directly onto our owner gate.

6. **CrewAI: roles plus sequential or hierarchical processes**
   - **What:** Agents are composed with tools, memory, knowledge and structured outputs. Processes are sequential, hierarchical or hybrid, with guardrails, callbacks and human-in-the-loop triggers. In hierarchical mode a manager agent allocates tasks by capability and checks results against required standards. Sequential is the default, and a manager LLM must be set. The fetched docs were index pages only, so manager details come from search results and are *(search only)*: https://docs.crewai.com/en/learn/hierarchical-process
   - **Source:** https://docs.crewai.com/en/concepts/crews (index) and the search result above
   - **Relevance:** A manager agent that dynamically assigns work is the expensive pattern ADR 0001 and initiative B aim to remove. We keep a static pipeline with managers acting only as gate reviewers.

7. **LangGraph: state graph with persistence**
   - **What:** Workflows are graphs whose nodes read and write shared state. The agent pattern alternates an LLM node and a tool node until the model stops requesting tools. The docs list persistence and streaming as benefits, with separate pages for persistence and interrupts. My fetch of the persistence page timed out, so I cannot detail checkpoints or time travel from a fetched source.
   - **Source:** https://docs.langchain.com/oss/python/langgraph/workflows-agents
   - **Relevance:** Our `.studio/runs/<id>.json` plus cursor is the same idea in miniature. Nothing to adopt wholesale.

8. **OpenHands: agent platform with sandboxes and a control UI**
   - **What:** The paper abstract describes a platform for agents that write code, use a CLI and browse, with sandboxed execution, multi-agent coordination and evaluation on 15 benchmarks including SWE-bench and WebArena (https://arxiv.org/abs/2407.16741). The README describes an Agent Server (REST API for running agents), per-conversation Docker sandboxes, an automation server (schedule or event triggers), and a canvas UI that switches between local, remote and cloud backends. It can drive third-party agents such as Claude Code. It says nothing about delegation or an event stream.
   - **Source:** https://github.com/All-Hands-AI/OpenHands
   - **Relevance:** Sandboxing and scheduled or event-triggered automations are worth considering. Per-run isolation would limit damage when local coders misbehave. Scheduled runs fit the planned Growth loop.

---

## 2. Team workflow frameworks per role

1. **Scrum: Definition of Done and a Sprint Goal as commitments**
   - **What:** Three artifacts, each with a commitment: Product Backlog (Product Goal), Sprint Backlog (Sprint Goal), Increment (Definition of Done). Items that don't meet the DoD return to the backlog. Events are Planning, Daily, Review and Retrospective, and accountabilities are Developers, Product Owner and Scrum Master.
   - **Source:** https://scrumguides.org/scrum-guide.html
   - **Relevance:** Write one explicit DoD per role output (we have a global one in CLAUDE.md). Treat each milestone as a "sprint" with one goal. A short retro after each cycle would feed the pass-rate data.

2. **Kanban: visualise, limit WIP, track flow**
   - **What:** Boards should show the real workflow, including bottlenecks. WIP limits (per state, person, lane or system) reduce delay and context switching and create pull signals ("Stop starting, start finishing"). Flow metrics in the guide are lead time, delivery rate and WIP.
   - **Source:** https://kanban.university/kanban-guide/
   - **Relevance:** The Phase 2 work board should enforce WIP limits per stage, especially the single-GPU creative queue (CLAUDE.md already says one GPU job at a time) and the Opus gate queue.

3. **DORA metrics: four delivery measures**
   - **What:** Deployment frequency, lead time for changes, change failure rate and time to restore service. The Four Keys project derives them from deploy and incident events. The article notes a fifth metric (reliability) was added in 2021.
   - **Source:** https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance
   - **Relevance:** Cheap to derive from `events.jsonl`. Adapt: lead time = spec approved → ship, change failure rate = ships followed by a bug-fix run, plus fallback rate (already ADR rule 3).

4. **Blameless postmortems with defined triggers**
   - **What:** Focus on systems, not people. Define triggers in advance (for example data loss, rollbacks, or manual discovery of a monitoring failure). A written record covers impact, mitigation, root cause and follow-ups. It is reviewed, shared and archived, because "an unreviewed postmortem might as well never have existed."
   - **Source:** https://sre.google/sre-book/postmortem-culture/
   - **Relevance:** Trigger a short postmortem file whenever a run goes blocked or an escalation reaches Opus, and store it in `docs/postmortems/`. This feeds model promotion and demotion decisions.

5. **Design critique ritual with named roles**
   - **What:** Presenter, critiquer, facilitator (rotating) and optional recorder. Agree objectives first, set a scope, time-box, balance positive and negative notes, don't solve problems in the session, and follow up with action items.
   - **Source:** https://www.nngroup.com/articles/design-critiques/
   - **Relevance:** Model the Creative Director gate on this: the brief states objectives, the reviewer scores assets against them, and notes become a list of redo items. This also supports the 2-redo-loop limit.

6. **RACI for who decides**
   - **What:** Responsible, Accountable, Consulted, Informed per task. The Atlassian page I tried returned 404 and a second page 404 as well, so there is no fetched source here. *Assumption:* the standard definitions apply.
   - **Source:** none fetched (Atlassian URLs 404)
   - **Relevance:** A one-table RACI per pipeline (the owner is always A for gates) would remove ambiguity when UI/UX moves under Creative. Verify the definitions from a working source before citing in a doc.

7. **Definition of Ready and editorial calendar: not verified**
   - **What:** The Atlassian pages on Definition of Ready and on editorial calendars returned truncated or 404 content, so I have no fetched evidence. *Assumption:* a DoR is a checklist an item must meet before work starts, and an editorial calendar schedules content by stage and date.
   - **Source:** none fetched
   - **Relevance:** A DoR check at stage start (inputs exist, open questions answered) is easy to add to the engine's verifier. For Creative, a simple dated asset schedule per app is worth considering. Treat both as follow-up research.

---

## 3. Agent observability, control UIs and "village" views

1. **Langfuse: traces, sessions, scores, dashboards, alerts**
   - **What:** Open source and self-hostable. Nested traces show inputs, outputs, timing and metadata across multi-step workflows (including agent graphs). Features include cost and token tracking, evaluations (including LLM-as-judge), prompt management, datasets, custom dashboards, and alerts when a metric crosses a threshold. SDKs send data asynchronously in batches.
   - **Source:** https://langfuse.com/docs/observability/overview
   - **Relevance:** Matches our planned token meter, alerts and pass-rate stats. Self-hosting fits our local-first stance. It could be a drop-in alternative if we don't want to build every panel ourselves.

2. **LangSmith: runs, traces, threads, feedback**
   - **What:** A run is one unit of work (model call, tool call, retrieval), comparable to an OpenTelemetry span. A trace groups runs for one operation, and a thread links the traces of a multi-turn session. Feedback attaches a tag and a score to a run. The fetched page did not cover alerts or annotation queues.
   - **Source:** https://docs.langchain.com/langsmith/observability-concepts
   - **Relevance:** This hierarchy maps to our model: project → pipeline run (thread) → stage (trace) → agent call (run). Use the same vocabulary in the event schema and attach QA/review scores as feedback on the stage.

3. **AgentOps: session waterfall, replay, multi-agent view**
   - **What:** Each run is a session. A waterfall timeline shows LLM calls, actions, tool calls and errors, and selecting an event shows the exact prompt and completion. The features list names session replay, cost tracking, time-travel and multi-agent visualisation. It integrates with CrewAI and AutoGen, among others.
   - **Source:** https://docs.agentops.ai/v1/introduction
   - **Relevance:** The waterfall is a good model for the Phase 4 replay and the profile drawer's "last 20 actions". Click-through to the exact prompt would help debug local-model failures.

4. **Helicone: session trees and cost breakdowns**
   - **What:** Session trees for multi-step workflows across LLM calls. Cost tracking by user, feature or custom dimension, shown as it happens. The comparison table lists caching and custom rate limits. The page does not mention alerts.
   - **Source:** https://docs.helicone.ai/getting-started/platform-overview
   - **Relevance:** Our token meter should break down by role, project and tier (local vs Claude). Rate limits resemble our daily budget guardrail.

5. **AI Village: persistent agents, shared chat, day-by-day history**
   - **What:** Each agent has its own Linux computer, internet and a Google workspace, plus a shared group chat. Goals are posted in chat. Agents see recent chat and their own recent actions and thoughts, and use a search-history tool for older events. Anyone can watch the history day by day. The operators later closed chat to observe fully autonomous efforts. The official pages did not load (theaidigest.org/village showed only a loading message and agentvillage.org refused the connection), so this finding comes from a search summary and the official blog post titles, *(search only)*: https://theaidigest.org/village/blog/how-the-ai-village-works
   - **Source:** https://theaidigest.org/village/blog/how-the-ai-village-works
   - **Relevance:** The useful parts are a per-day history view and a "what each agent sees" panel. Our trail-by-day replay (plan item 13) copies this idea. Re-check against the blog post itself before relying on details.

6. **Generative Agents (Smallville): memory stream, reflection, planning**
   - **What:** 25 agents in a Sims-like town. Each stores experiences in natural language (the memory stream), condenses them into higher-level reflections, and retrieves memory to plan. Ablations showed observation, planning and reflection each add believability. I could not fetch the demo page (file too large), so what the UI shows is not verified.
   - **Source:** https://arxiv.org/abs/2304.03442
   - **Relevance:** Supports the optional "office" view as a skin over real data. The memory idea suggests per-role lessons-learned files that get condensed periodically. It does not suggest simulating personalities, which would add token cost without improving output.

7. **Cross-tool pattern: what the UIs consistently offer**
   - **What:** Across the sources above the repeated features are nested trace or timeline views, cost and token tracking, scores attached to runs or sessions, replay, and threshold alerts. Control features beyond viewing appear in ChatDev 2.0 (human feedback in the launch tab) and OpenHands (a canvas to start conversations, switch backends and set up automations).
   - **Source:** https://langfuse.com/docs/observability/overview, https://docs.agentops.ai/v1/introduction, https://github.com/OpenBMB/ChatDev, https://github.com/All-Hands-AI/OpenHands
   - **Relevance:** The tracing tools are view-only, so our Owner Inbox (approve/park/reject buttons) is where we differ. Prioritise it, along with the token meter and alerts, over decorative features.

---

## Suggestions for B and A

- **B:** The evidence supports keeping the static, engine-driven pipeline rather than a manager-agent design (findings 1.2, 1.6). Add a DoD per role output, WIP limits on the GPU and Opus queues, a retro and postmortem file on blocked runs, and a critique format for the Creative gate.
- **A:** Use LangSmith-style vocabulary (project, thread, trace, run) in the event schema. Build the Owner Inbox, token meter, alerts and a click-through to the exact prompt and output first. Replay and the office view come last.
- **Gaps to close:** RACI, Definition of Ready and editorial-calendar sources failed to fetch. LangGraph persistence, the AI Village official pages and the Smallville demo also failed. Re-fetch these before they are cited in a design doc.
