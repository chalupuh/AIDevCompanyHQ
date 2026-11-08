# QA Report: Sprint 2d Task 1 — Fixed per-asset review format for creative-director Mode B

**Date:** 2025-11-08
**QA Engineer:** qa-engineer
**Scope:** `.claude/agents/creative-director.md`, `tools/engine/pipelines/creative-portraits.json`

---

## Acceptance Criteria & Results

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Mode B uses a fixed per-asset format with **Verdict (APPROVE / REDO)** | PASS | Line 18 in fenced code block: `- **Verdict:** APPROVE / REDO` |
| 2 | Mode B format includes **What works** (specific strengths) | PASS | Line 20: `- **What works:** (specific strengths aligned to the brief)` |
| 3 | Mode B format includes **What doesn't** (specific visible issues) | PASS | Line 21: `- **What doesn't:** (specific visible issues — colour, composition, artifacts, dimensions, legibility, originality)` |
| 4 | Mode B format includes **Redo instruction** (exact prompt change) | PASS | Line 22: `- **Redo instruction:** (exact prompt change or parameter tweak; omit if APPROVE)` |
| 5 | Mode B format includes **Originality check** | PASS | Line 23: `- **Originality check:** (confirm no imitation...)` |
| 6 | `creative-portraits.json` pick task requires the fixed format | PASS | Task text contains "using the fixed per-asset format: Verdict (APPROVE/REDO), Chosen file..., What works, What doesn't, Redo instruction, Originality check." |
| 7 | Copy instruction replaced `cp` with `node fs.copyFileSync` one-liner | PASS | Task text: `node -e "require('fs').copyFileSync('src','dst')"` — old `with \`cp\`` removed |
| 8 | `allowedTools` has `Bash(node -e*)` entry | PASS | `allowedTools` includes `Bash(node -e*)` at index 7 |
| 9 | Old `Bash(cp *)` removed from `allowedTools` | PASS | No entry containing "cp" found in `allowedTools` |
| 10 | JSON is valid | PASS | `JSON.parse()` succeeds, `check-config.js` reports ✓ for `creative-portraits.json` |
| 11 | Trailing newline on creative-director.md (per QA round 1 finding) | PASS | Last byte is `\n` |

---

## Automated Checks

### `node tools/ci/check-config.js`
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

### `node tools/engine/test.js`
Not available in this worktree (self-test runner lives in StudioControlRoom repo; `tools/engine/engine.js` here is a forwarding shim). No engine logic was modified by this task — only pipeline JSON and an agent prompt file — so this is not a gap.

### Custom validation (`validate-t1.js`)
All 11 checks passed (see criterion table above).

---

## Edge Case Analysis

| Edge Case | Assessment |
|-----------|------------|
| `Bash(node -e*)` is broad — allows arbitrary `node -e` code | **Known limitation, deferred per sprint log.** The rework notes file this as a StudioControlRoom follow-up (add a `pick` subcommand to `portraits.js` so the agent doesn't need raw `node -e`). Not in-scope for this HQ-only lane. |
| `copyFileSync('src','dst')` uses relative paths — works only from correct CWD | Acceptable: the engine runs agent stages from the project root, and the task instructs full paths like `.studio/portraits/candidates/<id>_*.png` → `.studio/portraits/<id>.png`. |
| Originality check is free-text — agent could skip meaningful analysis | The format mandates the field presence. Enforcement depends on Opus's compliance with the prompt, which is the agent's responsibility. No code-level fix possible without a structured output schema. |
| Multiple candidates (`_1.png`, `_2.png`) — which is "better"? | Task text says "Pick the better one" — subjective judgment delegated to Opus. Format captures the choice via "Chosen file" for traceability. |
| Both candidates bad — regeneration loop | Task text covers this: "If both are bad, regenerate... and pick again." `allowedTools` includes `Bash(node "{{soft}}/creative/portraits.js"*)` for this path. |

---

## Findings

### S1 (Severity: Low — Deferred)
**`Bash(node -e*)` unrestricted code execution.** The `node -e` glob is very permissive: any Node one-liner is allowed, not just `copyFileSync`. This is a security/scoping concern but was already identified in round 1 review and deferred to StudioControlRoom (adding a `--pick` subcommand to `portraits.js`).

**No action required** — filed as follow-up per sprint log.

### No other findings.

---

## Files Reviewed

| File | Lines Changed | Verified |
|------|---------------|----------|
| `.claude/agents/creative-director.md` | +13/-1 (Mode B section) | Manual read + scripted validation |
| `tools/engine/pipelines/creative-portraits.json` | +43/-12 (reformatted + content changes) | `JSON.parse()`, `check-config.js`, scripted field checks |

---

VERDICT: PASS — All 11 acceptance criteria met. JSON valid, check-config.js passes, format fields present in both agent prompt and pipeline task text, old `cp` removed and replaced with `copyFileSync`, trailing newline added. One low-severity finding (broad `Bash(node -e*)` scope) deferred to StudioControlRoom follow-up per sprint plan.
