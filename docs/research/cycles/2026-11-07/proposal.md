# R&D Proposal: Cycle 2 re-run, 2026-11-07 (open scan + re-verify)

**Author:** rd-manager | **Inputs:** [brief.md](brief.md), [scan.md](scan.md) (13 entries, **0 Hot**, 7 Warm, 6 Cold), 6 idea files

**Read first:**
- This cycle had web tools, and **the re-check weakened the earlier ideas**. Two of the brief's core hypotheses turned out false: packing apps already copy a previous trip, and the leading gift-list app already keeps a year-by-year archive. A third didn't hold: no fetched chore-app reviews complain about accounts.
- **No idea reaches Strong (≥ 75).** The analysts scored 74–80. Calibration cut 4–12 points, and everything now sits at 68–72 (Promising).
- **Red flag on the inputs.** The analysts gave **H confidence on Demand and Monetization to every idea, even where the evidence was search-only.** The worst case was `gig-mileage-log`: 80 with Gap 4, resting on a vendor blog and one review the analyst never fetched. During calibration I found that **Stride is a free mileage tracker with no trip cap**, which removes most of that gap. A high score with low confidence is exactly what calibration is meant to cut, and here it did.
- **Calibration rules** (kept the same as cycles 1 and 2):
  - A one-time unlock with no willingness-to-pay evidence for that model scores **Monetization 3**.
  - H confidence needs fetched evidence.
  - Weekly ongoing use scores **Retention 4**, monthly use 3, seasonal use 2.
  - A crowded category with a big incumbent scores **Competition 2**.
- **Gates:** all six ideas pass originality (§3), and none is rejected. Owner-review flags: children's data (chore board), financial or tax-adjacent (tax receipts, bills, mileage).
- **Names:** working names have **not been trademark-checked**. "Evergreen" is very likely to clash.
- **Payments:** every idea's `payments [y]` means a **one-time store in-app purchase only** (StoreKit / Play Billing, no server). No backend-dev is needed; the architect confirms this.
- **Progress logs:** the Bash tool wasn't available to rd-manager in this session, so the `studio.js` progress logs could not be sent.

## 1. Summary table

| Rank | Idea | Score | Ease (est. MVP) | Platforms & track | Differentiator |
|---|---|---|---|---|---|
| 1 | Family chore board (`family-chore-board`) | **72** (was 76) | 5 (~2 wks) | iOS + Android, local, one-time IAP · **Lite** | One shared family device, no accounts, no per-kid cap, one-time price instead of ~$9/month |
| 2 | Plant watering log (`plant-watering-log`) | **72** (was 76) | 5 (~1.5–2 wks) | iOS + Android, local, one-time IAP · **Lite** | Unlimited plants, no paywall prompts, winter mode, one-time price |
| 3 | Bill calendar glance (`bill-calendar-glance`) | **70** (was 78) | 5 (~2 wks) | iOS + Android, local, one-time IAP · **Lite** | Bills laid out around payday; recurring bills never disappear; automatic local backup; no bank link |
| 4 | Tax receipt folder (`tax-receipt-folder`) | **68** (was 74) | 4 (~2.5–3 wks) | iOS + Android, local, one-time IAP · **Lite** | Local-only receipt photos + accountant-ready CSV/PDF pack, custom category groups, no OCR, no subscription |

**Not shortlisted (parked):**
- `gig-mileage-log` scored 68 (was 80). Free Stride undercuts the "no subscription" wedge, so Gap went 4 → 2 L.
- `return-warranty-tracker` scored 68 (was 76). Demand and Gap are both L, it's seasonal, and a store release would arrive too late for most of the 2026 return window.
- Scan Cold entries (re-verified, now parked with evidence): `trip-packing-list` (copy-forward already exists), `holiday-gift-budget` (the incumbent already has budgets and an archive at $2.99), `photo-cleanup-swipe` (crowded, iOS delete-flow risk), `meal-plan-pantry` (Ease 3, no evidence), `second-brain-lite`, `language-phrase-drill`, `pet-vaccine-wallet`, `seasonal-home-checklist` (merged into packing).

**Calibration changes** (full tables in each idea file's "Calibration notes"):
- **Monetization:** 4 H → 3 on all six ideas (studio rule).
- **Demand:**
  - H → M on four ideas (only one fetched listing each).
  - Bills 4 → 3: the only fetched incumbent has ~158 ratings.
  - Returns 4 H → 3 L: lots of unrated apps shows supply, not demand.
- **Gap:**
  - Mileage 4 → 2 L (Stride is free).
  - Plants 3 → 2 L: Planta already markets reminders that adapt, and the pain data is from aggregators.
  - Tax and returns M → L.
  - Bills stays 3 M, but the claim "no competitor is payday-first" is **false** (Bills Organizer & Reminder tracks income and bi-weekly cycles).
- **Ease:** tax 5 → 4. The analyst's own estimate was 12–16 days, and the PDF/image work adds more.
- **Competition:**
  - Tax, plants and mileage 3 → 2 (big incumbents and free substitutes).
  - Returns 4 H → 3 M.
- **Retention:**
  - Plants 3 → 4 (watering is weekly-plus).
  - Bills 4 H → 3 M (monthly use, driven by notifications).
- **Risk:**
  - Chore board 4 → 3 (children's data).
  - Tax 3 → 4 (local, record-keeping only).
  - Plants 4 → 5 (no sensitive data).

## 2. Shortlisted ideas

### 2.1 Family chore board (72): `family-chore-board`
- **Pitch:** A chore chart on one shared family tablet or phone.
  - Parents assign chores behind a PIN.
  - Kids tap to complete chores and earn points toward rewards.
  - No accounts, no per-kid cap, no subscription.
- **Target user:** Parents of 1–4 children aged about 4–12 who don't want another monthly subscription.
- **Evidence:**
  - Chorsee: 4.6★ from ~12K ratings, $8.99/month, $39.99/year or $119.99 lifetime ([App Store, fetched](https://apps.apple.com/us/app/id1611068600)).
  - ChoreTree, Kid Chore and Chorly gate kid mode, extra kids or chores behind premium ([search only](https://apps.apple.com/app/id6790678296)).
  - **No fetched reviews complain about accounts or kid usability.** The original hypothesis failed. The gap is price and gating.
- **Competitors and our edge:** Chorsee, ChoreTree, Kid Chore, Chorly. Our edge is a one-time price of about $4.99 with everything unlocked, nothing stored but first names, and local storage only. Chorsee's lifetime tier means "one-time" exists already, but at $119.99.
- **MVP:**
  - PIN-gated parent setup (kids, chores, points).
  - Kid completion view with big tap targets.
  - Reward chart.
  - Weekly repeating rota.
  - JSON backup/restore.
  - Free demo with 1 kid and 3 chores, plus a one-time unlock.
- **Scores:** Demand 4 M · Gap 3 M · Ease 5 H · Money 3 M · Competition 3 M · Retention 3 M · Risk 3 M → **72**.
- **Risks:**
  - **Children's-data flag (owner review):** the spec must settle COPPA, Kids-category and age-rating handling.
  - Novelty wear-off and summer dips.
  - A crowded "chore chart" keyword for app store search.
  - Single-device use doesn't fit families where each child has a phone.
  - Chorsee could cut its lifetime price.

### 2.2 Plant watering log (72): `plant-watering-log`
- **Pitch:** Per-plant watering reminders that reschedule from the day you actually watered. Unlimited plants, a winter mode that stretches every schedule, and a one-time price with no nag screens.
- **Target user:** Indoor plant owners with 1–20+ plants who are tired of plant caps and upgrade prompts.
- **Evidence:**
  - Plant Watering Reminder: 4.6★, ~$5.99 one-time ([justuseapp, fetched aggregator](https://justuseapp.com/en/app/1592638714/plant-watering-reminder/reviews)).
  - Paywall, plant-cap and rigid-reminder complaints for Plant Parent, Plant Daddy and Planta come only from **aggregator figures** ([Kimola, search only](https://kimola.com/reports/comprehensive-planta-app-customer-feedback-report-app-store-us-155863)).
  - Planta already markets reminders that adapt (weather-based) and a snooze ([getplanta.com](https://getplanta.com/)).
- **Competitors and our edge:** Planta (large), Plant Parent, Greg, Plant Daddy, Water My Plant. Our edge comes down to **price and no cap**, the same kind of gap as the cycle-1 water tracker.
- **MVP:**
  - Unlimited plant cards with photo and notes.
  - Per-plant reminders that reschedule when you mark "watered".
  - Global winter mode.
  - Local storage.
  - One-time unlock.
- **Scores:** Demand 4 M · **Gap 2 L** · Ease 5 H · Money 3 M · Competition 2 M · Retention 4 M · Risk 5 H → **72**.
- **Risks:**
  - **Gap is L.** The score rests on Ease, Risk and Retention, not on a proven gap.
  - Getting noticed among dozens of plant apps.
  - "Evergreen" name clash.
  - Winter engagement dip.
  - It ties with the chore board but ranks **#2 because of the L on Gap** (METHODOLOGY §4). It has no regulatory flags at all.

### 2.3 Bill calendar glance (70): `bill-calendar-glance`
- **Pitch:** A month strip of bills laid out before and after your payday, with dependable local reminders. Recurring bills never vanish, and backups happen automatically. Manual entry only, so no bank link and no account.
- **Target user:** People with a handful of recurring bills who want "what's due before my next paycheck" without linking a bank.
- **Evidence:**
  - Bill Watch: 4.2★ from ~158 ratings, Pro $19.99 ([App Store, fetched](https://apps.apple.com/us/app/bill-watch/id949348178)).
  - Bill Watch reviews: bills with no end date disappearing (a late fee resulted), crashes on reports, manual backup.
  - DueAhead pitches the same "no account, no bank link, one-time" positioning but has 2 Product Hunt upvotes ([fetched](https://hunted.space/product/dueahead)).
  - Payday-oriented planning already exists in Bills Organizer & Reminder ([appfollow, search only](https://apps.appfollow.io/ios/bills-organizer-reminder/1352782733?country=si)).
- **Competitors and our edge:** Bill Watch, DueAhead, Bills Organizer & Reminder, iBill Reminder, Bills Monitor. Our edge is **reliability**: bills never disappear and backups are automatic. The payday-first view is a partial differentiator, not a unique one.
- **MVP:**
  - Bill form with an "indefinite" recurrence.
  - Payday setting.
  - Month strip colored by payday.
  - Local reminders.
  - Automatic JSON backup and restore.
  - One-time unlock beyond 5 bills.
- **Scores:** Demand 3 M · Gap 3 M · Ease 5 H · Money 3 M · Competition 3 M · Retention 3 M · Risk 4 M → **70**.
- **Risks:**
  - **Financial flag:** record-keeping only.
  - A missed notification defeats the product, so reliability testing across OS versions matters.
  - A modest market.
  - **Overlaps the parked cycle-1 `subscription-trial-tracker`.** If this is approved, treat subscriptions as one bill type and retire that entry.

### 2.4 Tax receipt folder (68): `tax-receipt-folder`
- **Pitch:**
  - Photograph a receipt, then tag its category and amount.
  - At tax time, export a CSV plus a PDF/ZIP of the images for your accountant.
  - Local-only, no OCR, no subscription.
- **Target user:** Freelancers, side-hustlers and sole traders.
- **Evidence:**
  - Easy Expense: 4.9★ from ~2.5K ratings, subscription required ([App Store, fetched](https://apps.apple.com/us/app/id1528787066)). An accountant reviewer there asked for more category groups.
  - OCR misreads and corrupted exports in Receipto reviews ([Trustpilot, search only](https://nl-be.trustpilot.com/review/receipto.app)).
  - QuickBooks Self-Employed is called overpriced ([blog, search only](https://solofinancehub.vercel.app/blog/best-expense-tracking-apps)).
- **Competitors and our edge:** Easy Expense, 1tap receipts, Hurdlr, QuickBooks, Expensify, and the free scanners built into phones. Our edge: one-time price, on-device storage, custom accountant category groups and a clean "tax pack" export. **No OCR is a real disadvantage on capture speed.**
- **MVP:**
  - Camera or gallery capture.
  - Custom categories.
  - Optional amount and notes.
  - Filtered list.
  - CSV and PDF/ZIP export.
  - Free tier of 10 receipts, plus a one-time unlock.
- **Scores:** Demand 4 M · **Gap 3 L** · Ease 4 H · Money 3 M · Competition 2 M · Retention 3 M · Risk 4 M → **68**.
- **Risks:**
  - **Financial-adjacent flag:** no tax advice; use "for your records" wording.
  - On-device image storage grows over time.
  - "Good enough" free alternatives (Notes or Files plus a spreadsheet).
  - Same audience as cycle-1 `freelancer-time-log`, so they could later form a "self-employed pack".
  - To reach the Jan–Apr 2027 tax season it needs to start soon.

## 3. R&D Manager's recommendation

1. **Cycle 1's shortlist is still waiting for your decision and is at least as strong** (70–74, M evidence). Cycle 2's re-run doesn't beat it. If you only want one build, **cycle 1's freelancer time log (better bet) or water tracker (pipeline test) are still my picks.** Nothing here outranks them.
2. **Best of this cycle: family chore board (72).** It has the strongest fetched demand (a ~12K-rating leader), a structural price gap you can see in the incumbent's own listing, Ease 5, and no L on Demand or Gap. Approve it only if you accept the **children's-data flag**, which the product-manager will settle in the spec (COPPA, Kids category, age rating).
3. **Lowest-risk alternative: plant watering log (72).** It has no regulatory flags, a weekly-plus use pattern and Risk 5. Its Gap is L, so treat it like the water tracker: a clean pipeline exercise with modest upside, not a bet. Choose it **instead of** the water tracker, not as well, if you'd rather test the pipeline on a product with better retention.
4. **Bill calendar glance (70):** a solid Lite build with low risk, but its differentiator is reliability more than novelty. It's a good later build and absorbs the parked subscription tracker.
5. **Tax receipt folder (68):** park, or approve only alongside `freelancer-time-log` as a self-employed bundle aimed at the 2027 tax season.
6. **Process fix for the next cycle:** the analysts must not use H confidence without a fetched source, and must not cite unfetched reviews as "confirmed". I recommend the orchestrator add this line to the next brief's constraints. Gig mileage (80 → 68) showed what happens otherwise.
7. **Before any store launch:** trademark-check the chosen working name.

## Owner decision
- [x] family-chore-board: Approve   Notes: (approving accepts the children's-data flag for the spec to resolve) Owner 2026-11-07: first external app.
- [ ] plant-watering-log: Approve / Park / Reject   Notes:
- [ ] bill-calendar-glance: Approve / Park / Reject   Notes: (if approved, it absorbs subscription-trial-tracker)
- [ ] tax-receipt-folder: Approve / Park / Reject   Notes: (consider pairing it with cycle-1 freelancer-time-log)
- [ ] gig-mileage-log (parked by R&D, 68): Approve / Park / Reject   Notes:
- [ ] return-warranty-tracker (parked by R&D, 68): Approve / Park / Reject   Notes:
