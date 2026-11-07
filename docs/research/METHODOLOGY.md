# R&D Methodology: finding the next app to build

**Team:** R&D Manager (`rd-manager`) leads two agents: Market Researcher (`market-researcher`) and Opportunity Analyst (`opportunity-analyst`).
**Mission:** find app ideas that are in demand, have a real gap to fill, and are realistic for this studio to build. Score them the same way every time and hand the owner a short, ranked list to choose from.
**Output:** a portfolio proposal. The owner picks; R&D does not start engineering work.

---

## 1. The R&D cycle

| # | Stage | Owner | Output |
|---|---|---|---|
| 1 | **Brief** | Eng. Manager (orchestrator) fills `docs/research/brief-template.md` | `docs/research/cycles/<YYYY-MM-DD>/brief.md`: theme (or "open scan"), constraints (including max Ease / build time), target counts |
| 2 | **Scan** | market-researcher | `scan.md`: a longlist of **~12** opportunities with evidence (see §2). Overlapping ideas are merged and ideas that break the brief's constraints are filtered out **before** handoff |
| 3 | **Analyze** | opportunity-analyst ×2 **in parallel** | one `docs/research/ideas/<slug>.md` per Hot entry plus the best 2–3 Warm ones (about 6 total), split evenly between two analyst runs |
| 4 | **Calibrate & rank** | rd-manager | checks evidence, adjusts scores so they're consistent across ideas, removes duplicates, applies the hard gates |
| 5 | **Proposal** | rd-manager | `proposal.md` with the top 3–5 ideas, ready for the owner to decide |
| 6 | **Owner decision** | **You** | tick `[x]` and write **Approve**, **Park** or **Reject** on each line of the proposal's decision block (or say it in chat) |
| 7 | **Handoff** | Eng. Manager | reads the decision block, updates `backlog.md` automatically, and starts approved ideas on the right track (see CLAUDE.md) |

Every idea, including rejected and parked ones, is tracked in `docs/research/backlog.md` so nothing gets researched twice. Parked ideas are re-scored in later cycles.

Suggested cadence: one cycle every 1–2 weeks, or on demand.

---

## 2. Where ideas come from (Scan)

The researcher looks for **demand signals** and **pain signals**:

- **Top charts and category rankings** (App Store / Google Play) in categories like Health & Fitness, Productivity, Lifestyle, Finance, Education, Utilities.
- **Bad reviews of popular apps (1–3 stars):** recurring complaints such as "too many ads", "paywall for basic feature", "no offline", "no Android/web version", "too complicated", "privacy concerns". Each recurring complaint is a possible gap.
- **Community demand:** Reddit, Product Hunt, Hacker News, forums. Look for "is there an app that…", "I wish X did Y".
- **Search and trend interest:** rising topics and seasonal patterns.
- **Underserved niches:** a popular general app that a specific audience uses awkwardly (e.g. a generic habit tracker used by people with ADHD, shift workers, students).
- **Simple, proven utilities:** water intake, habit streaks, budgeting, timers, checklists. Demand is proven; win on simplicity, privacy, design, or a niche twist.

Each longlist entry records: the idea in one line, the source signals with links, the apps it would compete with, and the gap.

**Evidence rule:** search results alone aren't enough. For every **Hot** entry, open (fetch) at least one primary page, such as a store listing's review section, a Reddit or forum thread, or a Product Hunt page, and cite it. An entry with no fetched source can be Warm at most.

---

## 3. Originality rules (hard gate)

We build **original apps in proven categories**. A category, a mechanic, or a common feature (streaks, reminders, charts) is fine. Copying a specific product is not.

- ❌ No reusing another app's name, logo, branding, characters, artwork, copy, or distinctive UI.
- ❌ No "clone of X" positioning. Every idea must state its own **differentiator**.
- ❌ No scraping or reusing another app's proprietary data or content.
- ⚠️ Flag anything in regulated territory (medical diagnosis, financial advice, children's data, gambling) for owner review. These aren't banned, but they carry extra risk.

An idea that fails the gate is rejected no matter how it scores.

---

## 4. Scoring system

Each idea gets a **1–5 score on 7 criteria**. The weighted total is turned into a **0–100 Opportunity Score**.

| Criterion | Weight | 1 = | 5 = |
|---|---|---|---|
| **Demand**: proven people want this | 20% | little evidence | top-chart category, many searches/requests |
| **Gap / Differentiation**: clear reason to pick us | 20% | me-too | repeated, unmet complaints we directly solve |
| **Ease of development**: studio can ship an MVP fast | 20% | months, hard tech (ML, real-time sync, hardware) | ~1–2 weeks, standard CRUD + local storage |
| **Monetization**: realistic revenue path | 10% | none obvious | proven model (subscription, one-time unlock, ads people accept) |
| **Competition**: how crowded/entrenched (higher = easier) | 10% | dominated by giants with network effects | fragmented, mostly weak or stale apps |
| **Retention**: will people come back | 10% | one-time use | daily habit / ongoing need |
| **Risk**: legal, IP, platform, data (higher = safer) | 10% | regulated, sensitive data, policy-heavy | no personal-data sensitivity, no regulation |

**Formula**

```
Opportunity Score = Σ (score × weight) ÷ 5 × 100
```

Example, a "water intake tracker with a niche twist": Demand 5, Gap 3, Ease 5, Money 3, Competition 2, Retention 4, Risk 5
→ (5·.20 + 3·.20 + 5·.20 + 3·.10 + 2·.10 + 4·.10 + 5·.10) ÷ 5 × 100 = **80**

**Ease-of-development rubric** (so different agents score it the same way):

| Score | Typical MVP | Example |
|---|---|---|
| 5 | 1–2 weeks; local data, a few screens, notifications | water / habit / counter / timer apps |
| 4 | 2–4 weeks; accounts + cloud sync, simple charts | budget tracker with sync |
| 3 | 1–2 months; third-party APIs, payments, social features | recipe planner with grocery integration |
| 2 | 2–4 months; real-time collaboration, maps, media processing | shared live itinerary app |
| 1 | 4+ months; custom ML, hardware, heavy compliance | medical symptom checker |

**Confidence:** every score is tagged **H / M / L** depending on the evidence behind it. If an idea has any **L** on Demand or Gap, it can't be ranked #1 without a note explaining why.

**Thresholds**

- **≥ 75** → Strong. Shortlist.
- **60–74** → Promising. Shortlist if there's room, otherwise Park.
- **< 60** → Park, with a note on what would raise the score.

**Weights belong to the owner.** If you want to favour fast wins, increase *Ease of development*; for bigger bets, increase *Demand* and *Monetization*. Change the table above and the rd-manager uses the new weights from the next cycle.

---

## 4b. Platforms & needs (decides who builds it)

Every idea brief and every spec carries this line, because it decides which engineering roles are called (CLAUDE.md, "Staffing"):

```
Platforms & needs: web [y/n] · iOS [y/n] · Android [y/n] · accounts/sync [y/n] · payments [y/n] · external APIs [list or none] · Track: Lite|Full
```

**Track** comes from Ease: Ease 4–5 → **Lite**, Ease 1–3 → **Full**.

## 5. Proposal format (what reaches the owner)

`docs/research/cycles/<date>/proposal.md`:

1. **Summary table:** rank, idea, Opportunity Score, ease (est. MVP time), platforms & track, one-line differentiator
2. **One section per idea (top 3–5):** pitch, target user, evidence (links), competitors and our edge, MVP feature list, score breakdown with confidence, risks
3. **R&D Manager's recommendation**, with reasoning: which one to build first and why (e.g. "fast win to exercise the pipeline" vs "bigger bet")
4. **Decision block:**

```
## Owner decision
- [ ] <idea-1>: Approve / Park / Reject   Notes:
- [ ] <idea-2>: Approve / Park / Reject   Notes:
```

Once the owner decides, the Eng. Manager updates `backlog.md` and sends each approved idea's file to `product-manager`.

---

## 6. Quality bar for R&D agents

- Every claim about demand or complaints needs a source link or is labelled *assumption*.
- No invented numbers. Give ranges with a note on where they came from ("~4.6★ from ~100k ratings on Play, Nov 2026").
- Prefer fewer, well-evidenced ideas over many thin ones.
- All outputs are plain Markdown in the paths above, so any model (Claude or a local LLM) can read and continue the work.
