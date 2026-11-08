# QA Report — Sprint 2d Task 3

**Date:** 2026-11-07
**Task:** Create `.claude/agents/internal-analyst.md` and switch `internal-research.json` synthesize stage
**Reviewer:** qa-engineer

## Task Description

Create `.claude/agents/internal-analyst.md` (frontmatter: name, description, tools Read/Write/Edit/Glob/Grep/Bash, model sonnet) for INTERNAL synthesis: turning research findings into concrete improvements to our studio (files, features, workflows), explicitly NOT app ideas or market scoring (the local model confused the two on 2026-11-07). Switch the 'synthesize' stage in `tools/engine/pipelines/internal-research.json` to agent `internal-analyst`.

## Files Changed

| File | Status | Change |
|------|--------|--------|
| `.claude/agents/internal-analyst.md` | New (untracked) | Agent definition for internal synthesis |
| `tools/engine/pipelines/internal-research.json` | Modified | synthesize stage agent: `opportunity-analyst` → `internal-analyst`; JSON reformatted (compact → pretty-printed) |

## Acceptance Criteria Verification

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `.claude/agents/internal-analyst.md` created | ✅ PASS | File exists, 21 lines, valid Markdown |
| 2 | Frontmatter `name: internal-analyst` | ✅ PASS | Verified via JS parse |
| 3 | Frontmatter `description` present, describes INTERNAL synthesis | ✅ PASS | "Internal synthesis analyst. Turns research findings into concrete studio improvements (files, features, pipelines). NOT for app ideas or market scoring." |
| 4 | Frontmatter `tools: Read, Write, Edit, Glob, Grep, Bash` | ✅ PASS | All 6 tools present, no extras |
| 5 | Frontmatter `model: sonnet` | ✅ PASS | Verified |
| 6 | Content explicitly excludes app ideas / market scoring | ✅ PASS | Line 3: "NOT for app ideas or market scoring."; Line 9: "You do NOT do: app idea scoring, market analysis, MVP scoping, or monetization." |
| 7 | `internal-research.json` synthesize stage agent = `internal-analyst` | ✅ PASS | JSON parse confirms |
| 8 | No other substantive changes to pipeline stages | ✅ PASS | Semantic diff: only synthesize.agent changed; all tiers, maxTurns, timeoutMin, allowedTools, task text, expect paths identical |
| 9 | Pipeline JSON is valid | ✅ PASS | `node tools/ci/check-config.js` → all checks passed, exit 0 |
| 10 | Agent resolves in registry | ✅ PASS | `check-config.js` validates all pipeline agent references against `.claude/agents/*.md`; no unknown agent errors |

## Config Check

```
✓ pipeline creative-portraits.json
✓ pipeline internal-build.json
✓ pipeline internal-research.json
✓ pipeline lite-build.json
✓ pipeline rd-cycle.json
✓ pipeline smoke.json
✓ .studio/roster.json
✓ .studio/models.json
✓ .studio/budget.json
✓ shim .studio/studio.js
✓ shim tools/engine/engine.js
All HQ config checks passed.
```

## Edge Case Probes

| Probe | Result |
|-------|--------|
| JSON parses without errors | ✅ |
| All 4 stages have required fields (id, type, agent for agent stages) | ✅ |
| No stage uses `opportunity-analyst` in this pipeline | ✅ |
| Top-level fields (description, required, defaults) unchanged | ✅ |
| Agent file frontmatter is valid YAML | ✅ |
| Agent file body is valid Markdown (no syntax errors) | ✅ |
| `tools/engine/test.js` (self-tests) | ⚠️ Not available in this worktree — engine.js is a shim to StudioControlRoom. Config validation (`check-config.js`) is the available gate and it passed. |

## Observations (non-blocking)

1. **`model: sonnet` vs `tier: local`**: The agent frontmatter declares `model: sonnet`, but the synthesize stage's pipeline tier is `local`. On the current engine, the pipeline `tier` controls which model runs the stage, while the agent's `model` field serves as documentation/intent. This means the local model (qwen3.6:27b) would still execute this stage despite the `sonnet` declaration. The behavioral fix comes from the agent's explicit "NOT app ideas" instructions, not from model change. If the intent was for a cloud Sonnet to handle synthesis, the pipeline tier should be changed to `sonnet` (not `local`). **Severity: low** — the agent's prompt guardrails should prevent the original confusion even on a local model.

2. **JSON reformatting**: The entire pipeline was reformatted from compact single-line to multi-line (20 → 80 lines). This is purely cosmetic and does not affect semantics (verified by semantic diff), but increases diff noise.

VERDICT: PASS
