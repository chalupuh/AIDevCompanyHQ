# plant-watering-log

**Working name:** Evergreen
**Pitch:** A plant-care reminder app with no plant cap, no paywall prompts, adaptive reminders, and a winter dormancy mode — one-time price, no account.

---

## Target user and job-to-be-done

**User:** Indoor plant owners (1–20+ plants) who forget watering schedules and get frustrated by subscription prompts.
**JTBD:** "Help me water each plant on its own schedule without nagging me to upgrade or burying me in ads."

---

## Differentiator

The scan found three pain signals from incumbents:

1. **Plant-parent paywall confusion** — top complaint on aggregator reviews [search only](https://kimola.com/reports/comprehensive-planta-app-customer-feedback-report-app-store-us-155863).
2. **Plant Daddy's plant-count paywall** — gates features behind a plant limit [search only](https://kimola.com/reports/comprehensive-planta-app-customer-feedback-report-app-store-us-155863).
3. **Planta's reminder rigidity** — ~20% of reviewers say reminders don't adjust after early/late watering [search only](https://kimola.com/reports/comprehensive-planta-app-customer-feedback-report-app-store-us-155863).

**Evergreen closes this by:** unlimited plants from day one, no paywall prompts, adaptive reminders that reschedule after actual watering, and a winter mode that stretches all schedules during dormancy months.

---

## MVP feature list

1. **Plant cards** — name, photo, species, watering schedule, notes. Unlimited.
2. **Adaptive reminders** — push notification for each due plant; tapping "watered" reschedules based on that plant's interval.
3. **Winter mode toggle** — globally stretches all watering intervals by a configurable factor (e.g., 1.5×) during dormancy months.
4. **Local storage only** — all data on-device via SQLite/MMKV. No account, no sync.
5. **Photo capture** — snap a photo when adding/editing a plant for visual ID.
6. **One-time unlock** — app is fully functional; no ads, no IAP nag screens.

**Deliberately left out:**
- Plant-identification AI (hard tech, Ease penalty).
- Multi-device sync (not core to watering reminders).
- Soil-moisture sensor integration (hardware dependency).
- Community / social features (scope creep).

---

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local-first:** all data in SQLite (or MMKV for smaller payloads). No backend needed — removes server costs entirely.
- **Notifications:** local push via WorkManager (Android) / UserNotifications (iOS). Standard, well-documented.
- **Payments:** single one-time purchase via StoreKit (iOS) / Billing Library (Android). No subscription management.
- **APIs:** none required. Species info entered manually.
- **Flag:** nothing particularly hard. Photo access requires permission, but this is a standard flow on both platforms.

---

## Ease-of-development estimate

**Ease score: 5** — 1–2 weeks MVP.

Reasoning: Standard CRUD app with local SQLite storage, notification scheduling, and photo capture. No sync, no external APIs, no payments backend. The adaptive-reschedule logic is a simple date math calculation. Two platforms but both are thin mobile shells over the same data model. Matches the rubric definition of Ease 5 exactly: "~1–2 weeks, standard CRUD + local storage, notifications."

**Estimated MVP time:** ~10–14 calendar days for a single developer (or 2 parallel mobile devs finishing in ~1 week each).

---

## Monetization idea

**One-time purchase** at $3.99–$5.99 on each store. This is priced between the free-with-paywall incumbents (Plant Parent, Planta) and the existing one-time app (Plant Watering Reminder at ~$5.99). Value prop: fully featured from install, zero paywall friction.

Optional future: a "plant encyclopedia" IAP bundle for auto-filling species schedules, but not in MVP.

---

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | H | Multiple well-rated apps exist (Planta, Plant Parent, Plant Watering Reminder 4.6★); category is established. |
| **Gap / Differentiation** | 3 | M | Paywall and reminder-rigidity complaints exist but come from aggregator data, not fetched store pages. |
| **Ease of development** | 5 | H | Plain CRUD + local storage + notifications; matches Ease-5 rubric exactly. |
| **Monetization** | 4 | H | One-time purchase proven in category ($5.99 for Plant Watering Reminder). |
| **Competition** | 3 | M | Fragmented field with many apps but no single dominant player; Planta is large but not entrenched enough to block. |
| **Retention** | 3 | M | Weekly watering habit; decent but not daily. Winter mode helps sustain through low-engagement months. |
| **Risk** | 4 | H | No regulated data, local-only storage, no children's-data concerns. |

**Opportunity Score calculation:**

```
(4×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 3×0.10 + 4×0.10) ÷ 5 × 100
= (0.80 + 0.60 + 1.00 + 0.40 + 0.30 + 0.30 + 0.40) ÷ 5 × 100
= 3.80 ÷ 5 × 100
= **76**
```

**Threshold:** 76 → **Strong** (≥ 75). Shortlist candidate.

---

## Risks and originality check

### §3 Originality gate: **PASS**

- Name "Evergreen" is original (not copying any existing app name).
- Positioning is "one-time price, unlimited plants, adaptive reminders" — not a "clone of X."
- No scraping or reuse of proprietary plant databases.
- No regulated territory (not medical, not financial, no COPPA issues).

### Key risks

1. **Pain evidence quality (M confidence on Gap):** The paywall and reminder complaints come from third-party aggregators, not directly fetched App Store pages. The rd-manager calibration step may down-weight this.
2. **Seasonal retention dip:** Plant watering slows in winter; even with winter mode, engagement may drop. Mitigated by the mode itself but worth watching.
3. **Crowded market:** Users may not discover Evergreen among dozens of plant apps. Differentiation must be clear in store listing.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 72 (analyst 76).** Rank 2 of this cycle. It has **L confidence on Gap**, and the score rests on Ease, Risk and Retention, not on a proven gap.

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 H | **4 M** | The only fetched page is an aggregator (justuseapp). Planta's size is search-only. |
| Gap | 3 M | **2 L** | All three pain signals are unverified aggregator figures (the scan says so). The one fetched page showed a different pain. **Adaptive reminders are not unique**: Planta markets reminders that "always adapt the schedule" using weather data, and it has a snooze ([getplanta.com](https://getplanta.com/), [Gizmodo](https://gizmodo.com/this-app-is-keeping-my-plants-alive-no-thanks-to-me-1844535855)). What is left is a price/no-cap gap, the same kind as the water tracker's Gap 2. |
| Ease | 5 H | 5 H | No change. |
| Monetization | 4 H | **3 M** | Studio rule: one-time unlock = 3. Plant Watering Reminder's ~$5.99 one-time price (aggregator) supports M. |
| Competition | 3 M | **2 M** | Planta is large and well-funded, and there are dozens of others (Plant Parent, Greg, Plant Daddy…). A crowded category scores 2 for consistency (habit and water tracker in cycle 1). |
| Retention | 3 M | **4 M** | Watering happens several times a week across a plant collection, which is weekly-plus ongoing use. Cycle 1 scored weekly-need apps 4 (freelancer log, shift calendar). Winter mode addresses the dip. |
| Risk | 4 H | **5 H** | No personal-data sensitivity and no regulation. This matches the rubric's 5, as for the water tracker. |

- Calc: (4·.2 + 2·.2 + 5·.2 + 3·.1 + 2·.1 + 4·.1 + 5·.1) ÷ 5 × 100 = **72**.
- Platforms line is correct. `payments [y]` = store in-app purchase only, no backend.
- Name: "Evergreen" is very generic and very likely to clash with existing marks or apps. A trademark check is needed before launch.
- Gates: originality PASS. Risk gate PASS, no flags.
