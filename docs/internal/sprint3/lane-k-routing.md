# Sprint 3, Lane K: usage-aware model routing (StudioControlRoom + HQ, branch feat/s3-routing)
Start AFTER lane G (Codex tier, `feat/s3-codex`) has merged: this lane builds on its `codex` tier and touches engine/engine.js. Paths are relative to the StudioControlRoom checkout unless marked HQ. `node engine/test.js` and the app build must pass.

**Owner decision (2026-11-11):**
- **Local first.** Local models (Ollama, qwen) do the majority of the work. Cloud models are for the jobs each one is best at, plus fallback.
- **Best model for the job.** Claude and ChatGPT/Codex models are picked by job type, not one fixed ladder.
- **Usage-aware.** Balance between Claude and ChatGPT by their remaining plan usage. For example, when ChatGPT is near its limit, send its share to a Claude model, and the reverse.
- **Never halt for a usage limit.** One provider being limited is never a reason to stop development: route to the other provider, or to local. Only wait when *both* cloud providers are limited, and keep local stages running meanwhile.

Default job → model preferences (the router may reorder cloud entries by usage headroom; local always comes first where listed):

| Job (stage kind) | Preference order |
|---|---|
| build / implement | local → local retry → codex (gpt-6.1-sol) ⇄ sonnet |
| small edits, docs, sync | local-fast → local → codex (gpt-6-luna) ⇄ haiku/sonnet |
| QA | local → local retry → sonnet ⇄ codex (gpt-6.1-sol) |
| milestone code review (gate) | opus **and** codex (gpt-6-astra) in parallel; if one provider is limited, the other reviews alone (not blocked) |
| design / architecture, R&D calibration | opus ⇄ codex (gpt-6-astra) |

`⇄` = the router picks whichever provider has more headroom (see Task 1); the other is the next fallback.

- [ ] [backend-dev] Usage probe: engine/usage.js reads current 5-hour and weekly utilisation for Claude (claude CLI `--output-format stream-json --verbose` rate_limit_event, as C:/Users/goldg/studio-discord.js does) and for Codex (latest `rate_limits` in ~/.codex/sessions/**/*.jsonl), cached for 10 minutes in .studio/usage-cache.json. Exposes `headroom(provider)` = 100 − max(5h%, weekly%) and `limited(provider)` (≥ 95% or a recent usage-limit error). Unit tests with fixture files; no network in tests.
- [ ] [backend-dev] Router: replace the fixed LADDER with `ladderFor(stage, usage)` driven by a `routing` table in HQ `.studio/models.json` (job kinds above, keyed by stage id prefix or an explicit `kind` on the stage). Cloud entries marked `⇄` are ordered by headroom; a provider with `limited()` true is skipped (no failed attempt recorded) unless every cloud provider is limited. Log the chosen order on each stage start (`routing: local, local, codex(78%), sonnet(41%)`).
- [ ] [backend-dev] Never halt: when a cloud attempt hits a usage limit, immediately try the other provider's equivalent model instead of waiting; mark that provider limited until its reset time. Only when both are limited, wait (existing LIMIT_WAIT logic) and post a Discord/Control Room note; other runs' local stages keep running. Review gates: if one reviewer's provider is limited, the other reviews alone; record "single reviewer (X limited)" in the review file.
- [ ] [frontend-dev] Control Room Ops: "Model usage" card shows Claude and ChatGPT 5-hour/weekly bars with headroom, the current routing order per job kind, and which provider is limited until when. Live model badges (Team view) already show the model each employee is using.
- [ ] [frontend-dev] ChatGPT usage visible everywhere (owner request 2026-11-11). Use the provider colours already on the Team tab (local GPU green `--local`, Claude purple `--claude`, ChatGPT blue `--chatgpt` in features/org/org.css) and the `providerOf()` helper in studio/app/src/store.ts. **Operations tab:** (a) in the budget/usage card, the "By provider" table from lane G gets a stacked bar of tokens and runs split local / Claude / ChatGPT, today and last 7 days; (b) a per-day chart (last 14 days) of attempts by provider; (c) escalation and failure lists show the provider chip on each attempt; (d) the 5-hour and weekly plan gauges from the task above, one row each for Claude and ChatGPT, showing reset time, turning amber at 80% and red at 95%. **Team tab:** (e) the profile drawer shows each employee's usage split by provider (runs and tokens, last 7 days); (f) the work trail tags each start/done event with the provider colour. Vitest tests for the provider split and day buckets; check the build at phone width.
- [ ] [backend-dev] HQ: update CLAUDE.md "Workflow Engine" paragraph and docs/adr/0004-codex-tier.md (or a new ADR 0006) to describe job-based, usage-aware routing and the never-halt rule. Selftests for: local-first order, headroom swap, limited provider skipped without a failed attempt, both-limited wait, single-reviewer gate.
