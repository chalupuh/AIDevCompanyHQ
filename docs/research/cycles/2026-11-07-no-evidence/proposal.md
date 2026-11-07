# R&D Proposal: Cycle 2, 2026-11-07 (open scan)

**Author:** rd-manager | **Inputs:** brief.md, scan.md (12 entries, **0 Hot**), 6 idea files

**Read first: this cycle has no evidence.** WebSearch and WebFetch were denied to the researcher, and to rd-manager during calibration. **No source was fetched, and every Demand and Gap statement is an *assumption*.** So I applied a cycle-wide rule: **Demand and Gap are capped at 3 with L confidence on every idea.** After calibration **no idea reaches Strong (≥ 75)**. Family-chore-board was the analysts' 76 and is now 70. Every ranked idea carries **L on both Demand and Gap**, so per METHODOLOGY §4 the #1 position needs a note, and here it is: **the ranking is driven by Ease and Risk, not by proven demand. Treat it as an order for verification, not a build list.** The scores are comparable with each other, but they are less trustworthy than cycle 1's (70–74 with M evidence). Working names are placeholders and have **not been trademark-checked**. All ideas pass the originality gate (§3). Two carry owner-review flags (children's data; financial-adjacent).

## 1. Summary table

| Rank | Idea | Score | Ease (est. MVP) | Platforms & track | Differentiator |
|---|---|---|---|---|---|
| 1= | Family chore board (`family-chore-board`) | 70 (was 76) | 5 (~2 wks) | iOS + Android, local, one-time IAP · **Lite** | One shared family device, no child accounts, no data collected, one-time price |
| 1= | Trip packing list (`trip-packing-list`) | 70 (was 74) | 5 (~2 wks) | iOS + Android, local, one-time IAP · **Lite** | Free trip templates, "copy from last trip", no account, no ads |
| 3 | Holiday gift budget (`holiday-gift-budget`) | 68 (was 72) | 5 (~1–1.5 wks) | iOS + Android, local, free · **Lite** (web-only PWA option for timing) | Year-over-year "what did I give them last year", surprise lists stay on device |
| 4 | Tax receipt folder (`tax-receipt-folder`) | 64 (was 72) | 4 (~2.5–3 wks) | iOS + Android, local, one-time IAP · **Lite** | Local-only receipts plus an accountant-ready CSV + ZIP "tax pack", no advice |
| 5 | Photo cleanup swipe (`photo-cleanup-swipe`) | 62 (was 72) | 4 (~3 wks; iOS-only ~2) | iOS (first) + Android, local, one-time IAP · **Lite** | Month-by-month swipe cleanup, review bin, on-device, no subscription |

**Not shortlisted:** `meal-plan-pantry` 60 (was 68), **parked**, because its Ease 3 breaks the brief's Ease ≥ 4 limit and Gap/Competition were lowered (see its Calibration notes). The analysts did not analyze `bill-calendar-glance` (Warm, kept `new`). The scan's Cold entries are parked: plant-watering-log, second-brain-lite, language-phrase-drill, pet-vaccine-wallet, seasonal-home-checklist.

**Calibration changes (details in each idea file's "Calibration notes"):**
- Cycle-wide: Gap is capped at 3 L (chore, gift, tax and photo each went from 4 to 3). All Demand and Gap confidence is L.
- Monetization: a one-time unlock with no willingness-to-pay evidence scores **3** (packing, tax, photo, chore and meal went from 4 to 3). This matches cycle 1, where the water tracker, habit tracker and freelancer log all got 3. No H confidence is allowed without evidence.
- Retention: episodic use scores 2 (packing went from 3 to 2). Tax went from 4 to 3 because receipts arrive irregularly.
- Competition: photo went from 4 to 2 (the analyst's "fragmented" contradicts the scan's "several in the charts"). Tax went from 3 to 2 (free scanners built into phones). Meal went from 3 to 2.
- Risk: tax went from 3 to 4 (local, no advice; the store-metadata issue is handled with wording).

**Red flag on the inputs:** the analysts' original scores were 72–76 with **L confidence on Demand and M/H on Monetization** while no evidence existed. High scores with low confidence are exactly what calibration should cut, and it did, by 4–10 points.

## 2. Shortlisted ideas

### 2.1 Family chore board (70)
- **Pitch:** A family chore rota on one shared tablet or phone. Kids tap to complete, earn points and see a weekly summary. No accounts and no data leave the device.
- **Target user:** Parents of 2–4 children aged about 4–14.
- **Evidence:** none fetched. That parenting organizers are an established category, and that competitors require family accounts and subscriptions, are both *assumptions*. The named competitors (OurHome, ChoreMonster) are unverified, and ChoreMonster may be defunct.
- **Competitors and our edge:** account-based family organizers. Our edge is structural: single device, nothing collected. That only matters if the competitors really do require accounts.
- **MVP:** member profiles (built-in avatars, no photos), weekly rota with recurrence, big tap-to-complete view, points and a reward chart, weekly summary, 20–30 chore presets by age band, local reminders.
- **Scores:** Demand 3 L, Gap 3 L, Ease 5 H, Money 3 M, Competition 3 L, Retention 4 L, Risk 3 M.
- **Risks:** **children's-data flag (owner review)**. Children use it even though nothing is collected, so the age rating, Kids-category rules and the privacy policy must be decided in the spec. The family may stop using it once the novelty wears off. A single device doesn't suit families where each child has their own phone.

### 2.2 Trip packing list (70)
- **Pitch:** Packing lists built from trip-type templates. Each trip is saved, so the next one starts from "copy from last trip". Fully offline, no account.
- **Target user:** People who travel 1–4 times a year and pack from memory or a notes app.
- **Evidence:** none fetched. Category existence, ad-heavy competitors and paywalled templates are *assumptions*.
- **Competitors and our edge:** existing packing-list apps (unverified). Our edge: free core templates, no ads or account, and trip history as the core value.
- **MVP:** 5 built-in templates, trip builder with per-person lists, check-off mode, copy-forward, plain-text/PDF export, one unlock for extra templates and custom templates.
- **Scores:** Demand 3 L, Gap 3 L, Ease 5 H, Money 3 L, Competition 3 L, Retention 2 M, Risk 5 H.
- **Risks:** low retention (idle between trips); few chances to upsell; the free "notes app" substitute is good enough for many people. Same mechanic as the parked cycle-1 `reusable-checklist-runner`, whose engine could later serve both.

### 2.3 Holiday gift budget (68)
- **Pitch:** Who, what, budget, bought/wrapped, and a running total, with each person's past gifts one tap away next year.
- **Target user:** Holiday gift planners who use notes or spreadsheets today.
- **Evidence:** none fetched. The Nov–Dec seasonal peak is an *assumption*, though a very safe one.
- **Competitors and our edge:** gift-list apps (unverified), plus notes and spreadsheets. Our edge: year-over-year history and on-device privacy. First-year users never see the history benefit.
- **MVP:** people and gifts with budgets, bought/wrapped/given status, budget overview, history by person, season archive with names carried forward, text export.
- **Scores:** Demand 3 L, Gap 3 L, Ease 5 H, Money 2 M, Competition 3 L, Retention 2 M, Risk 5 H.
- **Risks:** **timing.** Today is 2026-11-06. With an owner gate, build, QA and store review, a store release lands in early-to-mid December, which is late for 2026. Only a **web/PWA-only** MVP (no store review) can realistically catch this season. Otherwise this is a September 2027 launch. Monetization is weak in year 1.

### 2.4 Tax receipt folder (64)
- **Pitch:** Snap a receipt, tag the category and amount, and at tax time export a CSV plus a ZIP of images for your accountant. Local-only, record-keeping only.
- **Target user:** Freelancers, side-hustlers and sole traders.
- **Evidence:** none fetched. Subscription fatigue with scanner apps is an *assumption*.
- **Competitors and our edge:** cloud expense apps and the free document scanners built into phones. Our edge: privacy plus an export built for an accountant. The lack of OCR is a real disadvantage on capture speed.
- **MVP:** camera/gallery capture, manual tags (category, amount, date, vendor), searchable list with a yearly total, tax-pack export, year rollover, custom categories, storage indicator.
- **Scores:** Demand 3 L, Gap 3 L, Ease 4 H, Money 3 L, Competition 2 L, Retention 3 M, Risk 4 M.
- **Risks:** **financial-adjacent flag (owner review).** No tax advice; use "for your records" store wording. Image storage grows on the device. Same audience as cycle-1 `freelancer-time-log`, a possible later bundle.

### 2.5 Photo cleanup swipe (62)
- **Pitch:** Swipe through your photo library one month at a time, keep or delete, with a review bin before anything is removed. All on the device, with a one-time price.
- **Target user:** Phone users with a full storage bar and tired of cleaner-app subscriptions.
- **Evidence:** none fetched. Subscription-heavy cleaner apps are an *assumption*, and the category looks crowded with swipe-style apps (*assumption*).
- **Competitors and our edge:** many cleaner apps in the Utilities charts. "One-time price, on-device" is our only edge, and it may already be taken.
- **MVP (trimmed for Ease 4):** month browse, swipe gestures, review bin, storage counter, screenshot/large-file filters from metadata. **Blur detection is cut** because it is media processing. Duplicates use exact hashes only, or are cut.
- **Scores:** Demand 3 L, Gap 3 L, Ease 4 M, Money 3 M, Competition 2 L, Retention 2 M, Risk 4 M.
- **Risks:** platform rules for deleting photos (iOS PhotoKit, Android MediaStore delete requests) and store review of bulk-delete flows; crowded category; periodic use.

## 3. R&D Manager's recommendation

1. **Don't start a build from this cycle yet.** Every shortlisted idea rests on assumptions alone, and calibration took 4–10 points off each. The cheapest fix is a **web-enabled evidence pass**: rerun the scan's evidence step with WebSearch/WebFetch allowed, for the top 3 only (chore board, packing list, gift budget). Read 20–30 store reviews per category and check whether "needs accounts / ads / paywalled templates" really repeats. That costs about one researcher run and could move each idea ±10 points.
2. **Cycle 1's shortlist is still waiting for your decision and is better evidenced** (M confidence, 70–74, real links). If you want to build now, pick from cycle 1 first. The ad-free water tracker is still the safest pipeline test, and the freelancer time log is still the better bet.
3. **If you want a cycle-2 build now anyway:** **family chore board** is the strongest candidate. It has the highest retention of the five (daily household use), a structural differentiator rather than "no ads", and Ease 5. Approve it only if you accept the children's-data flag (to be settled in the spec). **Trip packing list** ties on score with no regulatory flags but has weak retention. It is the lower-risk, lower-upside choice.
4. **Holiday gift budget:** approve now only as a **web/PWA-only** sprint to catch December 2026. That changes its Platforms line to web y, iOS n, Android n, still Lite. Otherwise park it for re-scoring in September 2027.
5. **Tax receipt folder and photo cleanup:** park unless the evidence pass shows a strong gap. Tax could pair with the freelancer time log later.
6. **Before any store launch:** trademark-check the working name.

## Owner decision
- [ ] family-chore-board: Approve / Park / Reject   Notes:
- [ ] trip-packing-list: Approve / Park / Reject   Notes:
- [ ] holiday-gift-budget: Approve / Park / Reject   Notes: (if approving, say "web-only PWA" or "mobile, 2027")
- [ ] tax-receipt-folder: Approve / Park / Reject   Notes:
- [ ] photo-cleanup-swipe: Approve / Park / Reject   Notes:
- [ ] Re-run the evidence pass with web tools for the top 3 before deciding: Yes / No   Notes:
