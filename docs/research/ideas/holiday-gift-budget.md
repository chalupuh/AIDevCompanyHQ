# Holiday Gift Budget

**Working name:** GiftPlan
**Pitch:** A private, on-device gift list and budget tracker that remembers what you gave each person last year—so every holiday season starts from where you left off, not from a blank spreadsheet.

---

## Target user and job-to-be-done

**Target user:** Holiday gift planners (family, friends, coworkers) who currently use notes apps, spreadsheets, or mental lists. Peaks Nov–Dec.

**Job-to-be-done:** "I need to track who to buy for, what I want to get them, how much I can spend, and whether each gift is bought and wrapped—without my surprise gifts leaking to the cloud or being ruined by an ad-filled app."

---

## Differentiator

| Pain signal (scan.md) | How GiftPlan closes the gap |
|---|---|
| Generic notes and spreadsheets are used | Purpose-built gift workflow: person → gift idea → budget → bought → wrapped. |
| Existing apps are ad-heavy or seasonal clutter | Zero ads. Clean, focused UI that only matters for 6–8 weeks a year. |
| No year-over-year memory | "What did I give Mum last year?" built in. Past years are one tap away. |
| Surprise lists on shared accounts risk exposure | Fully local. No cloud, no accounts, no data leaving the device. |

The specific gap: **year-over-year gift history combined with local-only privacy.** Most gift apps reset every year or require an account; GiftPlan carries your history forward.

---

## MVP feature list

1. **Gift list entry** — add a person, desired gift, budget per person, overall budget.
2. **Status tracking** — bought / wrapped / gifted checkboxes per item; running total vs budget.
3. **Year-over-year history** — past gift lists archived and viewable per person ("gave a scarf in 2025").
4. **Budget overview** — one screen showing total budget, spent, remaining, with per-person breakdown.
5. **Reset helper** — at season's end, one-tap archive + carry forward recipient names (but clear gift details for next year).
6. **Export** — plain-text summary for sharing with spouse/partner who may be co-gifting.

**Deliberately left out (MVP):**
- Web version (mobile is where people shop and plan).
- Wishlists for others to fill in (requires sync/accounts; deferred).
- Integration with Amazon/retail links (API complexity; deferred).
- Reminders ("buy by Nov 20") — nice to have, but notifications are extra platform work on Android (background task limits).

---

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [n: ad-free, free MVP] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local storage:** SQLite via expo-sqlite. Simple relational schema: recipients, gifts, seasons, statuses. Fully local-first; no sync.
- **Notifications:** Not in MVP. Adding push reminders would be V2 (and requires platform notification handling on both iOS and Android).
- **Payments:** MVP is free and ad-free. Monetization deferred to V2 (one-time unlock for advanced features like gift ideas per category, or PDF export).
- **APIs:** None.
- **Hard things:** Nothing technically difficult. Seasonal nature means the app window is narrow—must ship by early November to catch the cycle. Data model is straightforward (3–4 tables).

---

## Ease-of-development estimate

**Ease score: 5** — standard CRUD + local storage, 4–5 screens. Matches the rubric: "1–2 weeks; local data, a few screens."

**Estimated MVP time: ~7 days (just over 1 week)**
- Days 1–2: data model (recipients, gifts, seasons tables), schema, local DB.
- Days 3–4: gift list entry and status tracking screens.
- Day 5: budget overview and year-over-year history view.
- Day 6: reset helper and export.
- Day 7: polish and QA.

Reasoning: This is arguably the simplest idea on the list. The data model is tiny, there are no integrations, and the UI is basically a list with filters and checkboxes. The real constraint is timing, not complexity.

---

## Monetization idea

- **MVP:** Completely free, no ads. This is a planting play—get installs before the season, build trust.
- **V2 (next cycle or post-season):** One-time unlock (~$1.99) for gift idea suggestions per recipient category (kid, parent, coworker), PDF export, and custom categories.
- **Alternative:** Stay free forever as a loss-leader / portfolio piece that builds studio credibility and reviews.
- **Rationale:** The seasonal window is too narrow to justify gating core features. Monetization can happen in year 2 when the app has a base of returning users.

---

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 3 | L | Holiday planning is a known spike; scan flags it explicitly. No fetched evidence; *assumption*. |
| **Gap / Differentiation** | 4 | M | Year-over-year history + local-only privacy is a real gap most gift apps ignore. Pain is *assumption* but the pattern is well-known. |
| **Ease of development** | 5 | H | Simplest possible CRUD app. 4–5 screens, 3 tables, no integrations. |
| **Monetization** | 2 | M | MVP is free. Monetization deferred to V2. Seasonal apps struggle with ongoing revenue. |
| **Competition** | 3 | L | Gift-list apps exist but are fragmented and ad-heavy. None verified; moderate competition. |
| **Retention** | 2 | M | Extremely seasonal (6–8 weeks/year). Returns next year at best, but long dormant periods hurt rankings. |
| **Risk** | 5 | H | No regulated content. Gift data is private by default (local-only). Low risk. |

### Opportunity Score calculation

```
Opportunity Score = Σ (score × weight) ÷ 5 × 100

= (3×0.20 + 4×0.20 + 5×0.20 + 2×0.10 + 3×0.10 + 2×0.10 + 5×0.10) ÷ 5 × 100
= (0.60 + 0.80 + 1.00 + 0.20 + 0.30 + 0.20 + 0.50) ÷ 5 × 100
= 3.60 ÷ 5 × 100
= 72.0
```

**Opportunity Score: 72.0** — Promising (60–74 range).

---

## Risks and originality check

### Originality (§3 gate): ✅ PASS
- Working name "GiftPlan" is original.
- No "clone of X" positioning; the differentiator (year-over-year history + local-only) is our own.
- No regulated territory.

### Key risks
1. **Timing is everything:** Must ship by early November to catch this year's holiday season. If development slips past Nov 10, the window may close for 2026 and the app sits idle until October 2027.
2. **Seasonal retention kills rankings:** App stores penalize apps with long dormant periods. A gift app that's unused Nov–Nov will have declining chart position.
3. **Monetization is weak:** Free MVP with deferred monetization means no revenue in year 1. This is an "exercise the pipeline" play more than a revenue play.
4. **Differentiation may be niche:** Year-over-year history is genuinely useful, but first-year users won't experience it. They need to come back next year to see the value.

---

*Confidence note: Demand, Competition, and Retention are tagged L or M with *assumption* on demand. The timing risk makes this a high-reward / high-timing-dependence idea. If the pipeline needs a fast win and November launch is feasible, this is one of the fastest ideas to build.*

---

## Calibration notes (rd-manager, cycle 2026-11-07)
- **Gap 4 M -> 3 L:** cycle-wide rule (no fetched evidence, so Gap is capped at 3 with L confidence). It is also unverified that existing gift apps lack year-over-year history. As the analyst notes, first-year users never see that differentiator.
- Demand 3 L, Ease 5 H, Money 2 M, Competition 3 L, Retention 2 M and Risk 5 H stay as scored. Notes and spreadsheets are a free substitute, which supports Competition staying at 3.
- **Timing (not scored, but decisive):** today is 2026-11-06. With an owner gate, a 1–1.5 week build, QA/review and store review, a realistic store release is early-to-mid December. That is late in the 2026 gift season. The only way to catch it is a **web/PWA-only** MVP, which skips store review. That would change the Platforms line to web [y] · iOS [n] · Android [n], still Lite. Otherwise treat this as a September 2027 launch.
- Platforms & needs line checked: correct as written (mobile, local, no payments, Lite). See the web option above.
- **Recomputed:** (3·.2 + 3·.2 + 5·.2 + 2·.1 + 3·.1 + 2·.1 + 5·.1) ÷ 5 × 100 = **68** (was 72).
