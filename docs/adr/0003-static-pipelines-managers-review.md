# ADR 0003: Static pipelines; managers review at gates only

**Status:** Accepted · **Date:** 2026-11-07 · **Owner:** studio owner

**Related:** [ADR 0001](0001-model-placement-standard.md) (model placement), [ADR 0002](0002-repos-and-git-workflow.md) (repos and git workflow)

## Context

The workflow engine (`tools/engine/engine.js`) drives all studio work — R&D cycles, builds, creative pipelines, and internal tooling. Each pipeline is a JSON file under `tools/engine/pipelines/` (e.g. `rd-cycle.json`, `lite-build.json`, `smoke.json`). The engine reads the JSON, iterates over stages, and launches each as a headless Claude Code run with the role's agent file.

Before this ADR, the informal assumption was that "manager" roles (`rd-manager`, `creative-director`, `code-reviewer`) might dynamically decide the next step based on their output — e.g., the `rd-manager` could say "this idea needs more research, so run another scan" or the `code-reviewer` could add new tasks. This introduces several problems:

1. **Unpredictable cost.** A manager's free-form reasoning could chain into arbitrary extra Claude calls, making it impossible to budget Opus tokens per cycle or per milestone.
2. **Non-deterministic execution.** Two runs with the same input could follow different paths depending on a model's mood, breaking reproducibility and making debugging impossible.
3. **No clear end condition.** Dynamic routing has no bounded stage list, so the engine cannot know when a pipeline is "done" without trusting the model to say so.
4. **Violation of ADR 0001's tier separation.** ADR 0001 assigns Opus to gate reviews (architecture, code review, R&D calibration) and local models to worker stages. A manager that dynamically routes would be a worker *and* a gatekeeper, blurring that boundary.

## Decision

**Pipelines are static JSON. The engine is the sole router. Manager roles only review at gates and never route work dynamically.**

Concretely:

| What | How |
|---|---|
| **Pipeline structure** | Declared in `tools/engine/pipelines/*.json`. Each stage has a fixed `type`, `agent`, `tier`, `maxTurns`, `task`, `expect`, and optional `check`. The engine iterates stages in order. No stage emits instructions that the engine interprets as routing commands. |
| **Parallelism** | Expressed in the JSON as separate stages declared side by side (e.g., `rd-cycle.json` has two `opportunity-analyst` stages, `analyze-a` and `analyze-b`). The engine, not a manager, decides what runs in parallel. |
| **Gates** | A stage with `"type": "gate"` pauses the pipeline and waits for the owner's explicit `approve` or `reject` command. The gate shows specified files to the owner for decision. |
| **Manager roles at gates** | `rd-manager` (Opus, `rd-cycle.json` stage `calibrate`), `code-reviewer` (Opus, `lite-build.json` stage `review`), `creative-director` (Opus, creative pipeline `pick` stage) — these run as **agent stages with `tier: "opus"`**. They produce a review or calibration document that the engine's `check` field validates (e.g., ends with `APPROVE` or `VERDICT: PASS`). Their output feeds the **next gate** (owner decision), not a routing decision. |
| **Failure handling** | The engine enforces the escalation ladder from ADR 0001: local → local retry → Sonnet → **blocked** → owner. A manager role never says "escalate this"; the engine detects repeated failures and escalates automatically. |
| **Dynamic content** | Agent stages *do* read and write Markdown files (specs, designs, proposals, QA reports). These files are data artifacts between stages — the engine passes them via the filesystem, and the next stage's `task` text references them. The files shape *what* work gets done, not *whether* or *how many* stages run. |

### Why this matters

- **Cost predictability.** Every pipeline has a known upper bound on Opus calls (one per gate review stage). The `rd-cycle.json` pipeline uses Opus exactly once (the `calibrate` stage). The `lite-build.json` pipeline uses Opus once per milestone (the `review` stage). Budgeting is straightforward.
- **Predictability and reproducibility.** The same input always produces the same sequence of stages. A failed run can be resumed from the exact failed stage without ambiguity.
- **Consistent with ADR 0001.** Worker stages run on local models (cheap, fast). Gate reviews run on Opus (expensive, high quality). The separation is structural, not prompt-dependent.
- **Engine as source of truth for flow.** The engine's JSON is version-controlled, reviewed, and tested (the `smoke` pipeline self-test). A model's free-text reasoning is not.

## Consequences

### Positive
- Each pipeline's Opus budget is known at pipeline-design time.
- Debugging a failed run means looking at one stage, not untangling a dynamic decision tree.
- Adding a new pipeline step is a JSON edit + review, not a prompt change that might be ignored.
- The escalation ladder works uniformly: failure is detected by file checks (`check` fields) and turn caps, not by a manager's judgement.

### Trade-offs
- **Less flexibility at runtime.** If an R&D cycle reveals that more scanning is needed, the pipeline does not auto-repeat. The owner starts a new cycle (or the pipeline is edited to add a scan stage for the next run).
- **Manager roles are constrained.** `rd-manager` cannot say "skip idea X, it's bad" — it must rate every idea and let the owner decide. This is intentional: the owner picks what to build, not the model (see CLAUDE.md: "You (Owner / CEO): picks what to build").
- **Pipeline editing requires a human.** Adding stages or changing order means editing JSON and merging a PR. For an internal studio this is acceptable; the alternative (a model editing its own pipeline) would be a security and cost risk.

### Implementation notes
- The `rd-cycle.json` pipeline already follows this pattern: `brief` (local) → `scan` (Sonnet, for WebSearch access per ADR 0001) → two parallel `analyze` stages (local) → `calibrate` (Opus gate review) → `owner-decision` gate.
- The `lite-build.json` pipeline follows the same pattern: `spec` (local) → `design` (Opus) → owner gate → per-milestone `build` (local) → `qa` (local) → `review` (Opus) → ship gate.
- The `smoke.json` self-test pipeline validates the engine itself with all-local stages and file-based checks.
