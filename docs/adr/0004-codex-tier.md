# ADR 0004: Codex tier in the model ladder

**Status:** Accepted · **Date:** 2026-11-08, revised 2026-11-11 · **Owner:** studio owner

## Context

ADR 0001 set up a five-level model ladder: local → local retry → Sonnet → blocked → owner. The owner's ChatGPT Pro plan includes OpenAI Codex, used through the official `codex` CLI signed in with ChatGPT (no API key, no pay-per-token). Codex can serve two purposes:
- (a) an extra escalation rung between local models and Sonnet for worker stages;
- (b) an independent code-review voice at milestone gates, alongside Opus.

Pro usage is limited by rolling **5-hour and weekly windows**. When Codex hits a limit, the attempt falls through to Sonnet and does not count as a failure. That way the Pro allowance is used and tasks still complete.

**Data:** code sent to Codex goes to OpenAI. By owner decision (2026-11-11), this is allowed for public and private repos.

## Decision

### Ladder change

The worker-stage escalation ladder becomes:

| Tier | Role | When |
|---|---|---|
| **L1 local** | `qwen3.6:27b` (Ollama) | first attempt |
| **L2 local retry** | same model, fresh prompt | first attempt failed its checks |
| **C1 Codex** | OpenAI Codex via `codex exec` | local retry failed; Pro usage available |
| **C2 Sonnet** | Claude Sonnet | Codex failed **or** Codex usage-limited |
| **blocked** | owner | Sonnet failed |

A Codex usage-limit response falls through to Sonnet **without** using up an attempt. The engine detects it from the CLI's output text (`CODEX_LIMIT_RE` in `engine/engine.js`). The task is not retried on Codex in the same run.

### Gate review: two reviewers at milestones

Milestone code reviews run **two independent reviewers in parallel**: Claude Opus and Codex. A gate passes when neither reviewer REJECTs:

| Opus | Codex | Gate |
|---|---|---|
| APPROVE | APPROVE | passes |
| APPROVE | no verdict (usage-limited) | passes (Opus alone is enough) |
| REJECT | APPROVE | **fails** |
| APPROVE | REJECT | **fails** (Codex's concerns must be fixed) |

If Codex is unavailable (usage-limited or not installed), Opus reviews alone, and the gate is not blocked. The parallel gate reviewer is a backlog item: see `docs/internal/eng-backlog.md`, "engine: parallel Codex gate reviewer (ADR 0004)".

### Usage

Codex usage is bounded by the Pro plan's rolling 5-hour and weekly windows. The engine records Codex tokens in usage events (`tier: "codex"`, `provider: "openai"`). While Codex is limited, stages that would reach Codex go straight to Sonnet. This is logged as a usage event, not a failure. Lane K (`docs/internal/sprint3/lane-k-routing.md`) replaces this fixed fallback with usage-aware routing between Claude and ChatGPT.

## Rules

1. **A Codex failure is not a task failure.** When the Codex CLI reports a usage or rate limit, the stage falls through to Sonnet and no attempt is used.
2. **A REJECT from either gate reviewer fails the gate.** Findings from both reviewers are merged and sent back to the engineer.
3. **Neither reviewer overrules the other.** An Opus REJECT fails the gate whatever Codex says, and a Codex REJECT fails it whatever Opus says.
4. **A missing Codex reviewer does not block.** When Codex is usage-limited or unavailable, Opus reviews alone, and the gate is not escalated to blocked.
5. **Usage tracking.** Each Codex call emits a usage event with `tier: "codex"`. The Control Room shows Codex usage alongside the Claude and local-model counters.

## Consequences

- The ladder gains one rung, so Sonnet is used less for tasks Codex can handle.
- Milestone gates get a second independent review, which catches issues Opus might miss.
- Codex usage needs watching. When the weekly window runs out, escalations run on Sonnet until it resets.
- `engine/engine.js` needs the Codex tier in the ladder, limit detection, and (backlog) the parallel gate reviewer.
- `studio/studio.js` and the Control Room UI show Codex in the usage breakdown.
- This ADR is linked from the Workflow Engine section of HQ `CLAUDE.md`.

## Next steps

1. Codex tier in the `engine/engine.js` ladder: lane G, task 2.
2. Parallel gate-review orchestrator (Opus + Codex): backlog.
3. Codex usage tracking and limit detection: lane G, tasks 2 and 3.
4. Control Room Codex usage: lane G, task 3, then lane K.
5. Pipeline integration test: one full lite-build run with Codex in the ladder.
