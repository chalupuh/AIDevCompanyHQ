# family-chore-board

## Working name and pitch

**HiveBoard** — A family chore chart for one shared device: parents assign and reward, kids complete — no accounts, no subscription, no kid cap.

## Target user and job-to-be-done

- **Primary user:** One parent (or both) managing household chores for 1–4 children, ages ~4–12.
- **JTBD:** "I want to assign age-appropriate chores to each child on our family tablet so they can complete them independently, earn rewards, and I can see progress — without paying a monthly subscription or creating accounts for my kids."

## Differentiator

The scan identified a **price and gating gap**, not a feature gap. Incumbents like Chorsee ($8.99/mo, $39.99/yr, $119.99 lifetime), ChoreTree, Kid Chore, and Chorly all use subscription or paywall models that gate kid count or kid-mode behind premium. HiveBoard's differentiator:

- **One-time price (~$4.99), no subscription.** Direct answer to the pricing pain signal.
- **No accounts, no per-kid cap.** Every child on the family gets a slot from day one.
- **No ads, no paywall prompts.** The app does what it says — full access after purchase.
- **Local-only storage.** First names and chore lists only; no child data leaves the device.

This is a *price/privacy gap* against subscription incumbents. The pain evidence is moderate (pricing data fetched; no direct "too expensive" review fetched, but the pricing structure itself is the blocker).

## MVP feature list

1. **Parent PIN-gated setup screen** — add/edit children (first name + age), create chores with point values.
2. **Kid completion view** — large tap targets, visual progress bars, no text required. PIN-locked behind parent area.
3. **Reward tracker** — earn points, redeem against a reward chart (parent-configured).
4. **Weekly view** — rotating chore schedule that repeats each week.
5. **Local backup/restore** — export/import a JSON file for device migration.

**Deliberately left out:**
- Sync across devices (not needed for single-device use case).
- Multi-language launch (English only for MVP).
- Gamification beyond points/rewards (no avatars, no animated characters).
- Calendar integration.
- Parent notifications/reminders.

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local storage only.** SQLite or MMKV — everything stays on device. No backend needed.
- **No sync, no accounts.** Core value proposition is local-first privacy.
- **Notifications:** optional — daily gentle "check your chores" reminder. Uses local notification APIs only.
- **Payments:** in-app purchase (one-time unlock) via StoreKit (iOS) / Billing Library (Android).
- **No external APIs.** Purely local app.
- **Children's data flag:** Store only first names + chore assignments. No PII, no location, no photos. Flag for App Store review notes (COPRA compliance — minimal data collection).
- **Nothing technically hard.** Standard CRUD with a PIN lock.

## Ease-of-development estimate

- **Rubric score: 5.** This is a 1–2 week app: local data, a handful of screens (parent setup, kid view, rewards, weekly schedule), local notifications. No backend, no sync, no APIs. Fits the rubric's top tier exactly (comparable to water/habit/counter apps in complexity).
- **Estimated MVP time:** ~10–14 days for a single mobile-dev working both platforms (shared UI code via Expo/RN), plus QA and review overhead.

## Monetization idea

**One-time in-app purchase unlock (~$4.99).** The entire app is free to try with one child and three chores as a demo. Purchase unlocks unlimited children, unlimited chores, and reward features. This is a proven model in the utility category (see The Christmas List at $2.99 one-time, 4.8★).

Alternate: flat $4.99 upfront purchase (no free trial), but the demo-first model reduces friction for parents browsing the store.

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | H | Chorsee has 4.6★ / ~12K ratings [fetched]; 12+ competitor apps found [search only]. Demand for chore apps is proven. |
| **Gap / Differentiation** | 3 | M | Pricing gap is real (fetched data), but no direct "too expensive" review was fetched — pain is structural, not complained-about. |
| **Ease of development** | 5 | H | Local CRUD, a few screens, no backend. Fits rubric score 5 exactly. |
| **Monetization** | 4 | H | One-time IAP is proven in this category (Christmas List, Plant Watering Reminder). Clear path. |
| **Competition** | 3 | M | 12+ apps in the field, but most are new or small. Chorsee is the leader but subscription-only. Fragmented enough to enter. |
| **Retention** | 3 | M | Weekly chores drive recurring use during school year, but summer/holidays are low-use periods. Moderate retention. |
| **Risk** | 4 | H | No regulated data, no financial advice. Children's data flag is minimal (first names only) — low risk with proper App Store notes. |

**Opportunity Score calculation:**

```
(4×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 3×0.10 + 4×0.10) ÷ 5 × 100
= (0.80 + 0.60 + 1.00 + 0.40 + 0.30 + 0.30 + 0.40) ÷ 5 × 100
= 3.80 ÷ 5 × 100
= 76
```

**Opportunity Score: 76 / 100** (Strong — shortlist)

## Risks and originality check

**§3 Originality gate:** ✅ Passes. HiveBoard uses its own name and branding. No copying of Chorsee or any competitor's UI, assets, or copy. The differentiator (one-time price, no kid cap, local-only) is a positioning choice, not a clone.

**Risks:**
- **Differentiation may be too thin:** Parents who don't mind $9/mo won't care. The real audience is the ~20% of households that resist subscriptions — hard to size.
- **Discovery challenge:** "Chore chart" is a crowded App Store keyword. SEO and ASO will matter.
- **Platform risk (children's data):** Need COPRA-compliant privacy nutrition label. Storing only first names is defensible but needs careful App Store submission notes.
- **Chorsee could drop their price:** If they add a one-time option, the gap narrows. Mitigation: build brand loyalty and reviews before that happens.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 72 (analyst 76).** Rank 1 of this cycle.

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 H | **4 M** | Only one fetched listing (Chorsee, ~12K ratings). The rest of the field is search-only, so not H. |
| Gap | 3 M | 3 M | No change. The price/gating gap is fetched. No complaint text about price was fetched. Chorsee already sells a $119.99 lifetime tier, so "one-time" exists, just at a high price. |
| Ease | 5 H | 5 H | No change. |
| Monetization | 4 H | **3 M** | Studio rule since cycle 1: a one-time unlock with no willingness-to-pay evidence *for that model* scores 3. Parents paying Chorsee subscriptions supports M. The Christmas List is a different category and doesn't count as proof. |
| Competition | 3 M | 3 M | No change. |
| Retention | 3 M | 3 M | No change. The earlier assumption-based 4 L is retired. Novelty wear-off and summer dips are real. |
| Risk | 4 H | **3 M** | Children use the app (children's-data flag, owner review). Kids-category / age-rating rules apply even when nothing is collected. Same as last cycle's 3 M. |

- Calc: (4·.2 + 3·.2 + 5·.2 + 3·.1 + 3·.1 + 3·.1 + 3·.1) ÷ 5 × 100 = **72**.
- Correction: "COPRA" in this file means **COPPA** (US children's privacy law). The spec must settle COPPA / Kids-category handling.
- Platforms line is correct. `payments [y]` means a **store in-app purchase only** (StoreKit / Play Billing, no server). No backend-dev needed; the architect confirms this. A web/PWA version for a family computer is a possible later add-on and is not in the MVP.
- Gates: originality PASS. Risk gate PASS with the **children's-data flag for owner review**. The name "HiveBoard" has not been trademark-checked.
