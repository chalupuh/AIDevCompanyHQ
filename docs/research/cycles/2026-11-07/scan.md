# Scan: cycle 2026-11-07 (open scan, re-verify run)

**Author:** market-researcher · **Date:** 2026-11-06 · **Brief:** [brief.md](brief.md)

**Headline: no Hot entries.** Re-verifying with fetched pages weakened most of the earlier ideas. Several incumbents already do the "gap" (copy-forward packing, year-by-year gift archive). The best remaining bets are Warm: a **price/ownership gap** (one-time purchase, no account, on-device) against subscription incumbents, rather than a missing feature.

**Method notes**
- Fetched primary pages are marked **[fetched]**. Items from search snippets only are marked **[search only]**.
- Reddit isn't indexed by the search tool, so no Reddit threads were opened. Community pain is therefore thin across the board. Store-review pages that I fetched showed few or no recent complaints.
- Ratings come from App Store listings at the time of fetching (Nov 2026).
- The Bash tool was not available in this session, so the `studio.js` progress logs could not be sent.
- Entries that stay Cold have no fetched evidence beyond searches. Cold means "don't spend analyst time", not "proven bad".

---

## Longlist

### 1. family-chore-board: Warm
- **Idea:** A chore rota for one shared family device. It uses a PIN-locked parent view and a simple kid view, with no accounts, no subscription and no per-kid chore cap.
- **Category / platforms:** Family / Lifestyle · iOS, Android, web. Children's-data flag: store nothing but first names and chores, locally.
- **Demand signals:**
  - Chorsee has 4.6★ from ~12K ratings [fetched](https://apps.apple.com/us/app/id1611068600).
  - The search showed a dozen or more chore-chart apps, mostly new, so demand is real but the field is crowded [search only](https://growtide.pages.dev/blog/best-chore-apps-for-kids-2026.html).
- **Pain signals:**
  - **Answer to Q1:** the fetched Chorsee reviews had **no** "too many accounts" or "kids can't use it" complaints. The only complaint there was a 2023 review about chores doubled or missing after upgrading, plus a sync issue ([fetched](https://apps.apple.com/us/app/id1611068600)).
  - The pain is **price and gating**. Chorsee lists $8.99/month, $39.99/year or $119.99 lifetime [fetched](https://apps.apple.com/us/app/id1611068600). ChoreTree puts kid mode and more than 5 chores per child behind a subscription. Kid Chore gates unlimited kids behind premium. Chorly has no free tier beyond the trial [search only](https://apps.apple.com/app/id6790678296).
- **Competing apps:** Chorsee (4.6★, ~12K), ChoreTree, Kid Chore, Chorly (new, few ratings).
- **The gap:** a one-time price (not $9/month) with no kid caps and no accounts. It is a price and privacy gap, not a feature gap. The pain evidence for it is moderate.
- **Quick take:** **Warm.** There is no fetched evidence of the account complaint, so the brief's hypothesis does not hold. The pricing gap does.

### 2. trip-packing-list (+ seasonal-home-checklist merged): Cold
- **Idea:** A reusable-checklist engine with trip and seasonal-home templates. Both overlap the existing `reusable-checklist-runner` and `seasonal-home-checklist` backlog entries.
- **Category / platforms:** Travel / Productivity · iOS, Android, web.
- **Demand signals:**
  - Packing lists are a mature category with many apps [search only](https://apps.apple.com/app/id6755727078).
  - Forum users duplicate a template list each trip in generic list apps [search only](https://www.rememberthemilk.com/forums/tips/15538/).
- **Pain signals:**
  - **Answer to Q2: copy-forward already exists.** Pack, Repeat (4.6★, ~90 ratings) advertises "copy a previous trip and adjust it". Its pricing is $19.99/year or $29.99 lifetime [fetched](https://apps.apple.com/us/app/id6473901846). QuickPack and Packo also advertise duplicating lists [search only](https://appgoblin.info/apps/6761728443).
  - The only fetched complaints were about editing custom categories and missing sub-lists. They are minor.
- **Competing apps:** Pack, Repeat (4.6★, ~90), Packo, QuickPack. TripIt/Packpoint not checked.
- **The gap:** none that is clear. Seasonal-home templates have no fetched evidence at all.
- **Quick take:** **Cold.** The brief's key claim ("copy-forward is missing") is false. Low retention as well.

### 3. holiday-gift-budget: Cold
- **Idea:** Gift list and budget with year-over-year history.
- **Category / platforms:** Lifestyle / Finance · iOS, Android, web.
- **Demand signals:**
  - **Answer to Q3:** demand is strongly **seasonal (Nov–Dec)**. The leading incumbent, The Christmas List, is **#2 in Shopping (top paid)**, with 4.8★ from ~5.1K ratings at $2.99 one-time [fetched](https://apps.apple.com/us/app/the-christmas-list/id340779800).
  - There are many alternatives: Christmas Gift List Tracker, Scrooge List, Giftful ($0.99), ChristmasListApp [search only](https://apps.apple.com/app/id1444504033).
- **Pain signals:**
  - The incumbent **already has per-person budgets and a year-by-year gift archive**, so the claimed gap is closed [fetched](https://apps.apple.com/us/app/the-christmas-list/id340779800).
  - Visible requests were minor (larger fonts, PC access, group budget sharing). No data-loss complaints appeared.
- **Competing apps:** The Christmas List (4.8★, ~5.1K), Christmas Gift List Tracker, Scrooge List, Giftful.
- **The gap:** only cross-device web and sync. That is a thin gap, and the 2026 season is nearly over.
- **Quick take:** **Cold.** The incumbent is cheap, one-time and well rated. Re-score in Sep 2027 only if a new angle appears.

### 4. tax-receipt-folder: Warm
- **Idea:** A local receipt-photo folder with categories and a CSV/PDF zip for an accountant. No OCR, no account, one-time price.
- **Category / platforms:** Finance / Utilities · iOS, Android. Financial-adjacent flag (record-keeping only, no tax advice).
- **Demand signals:**
  - Easy Expense (Receipt Scanner) has 4.9★ from ~2.5K ratings and requires an active subscription [fetched](https://apps.apple.com/us/app/id1528787066).
  - Many receipt and mileage apps compete, all with export [search only](https://appfollow.io/ios/1tap-receipts-track-expenses/1092491157?country=gb).
- **Pain signals:**
  - Sample is weak. The fetched page's one critical note, from an accountant, asked for more category groups than Tax Deductible and Nondeductible, and a friendlier UI.
  - Trustpilot reports of OCR misreads and corrupted exports target OCR-based apps, which supports our no-OCR choice [search only](https://nl-be.trustpilot.com/review/receipto.app).
  - A QuickBooks Self-Employed reviewer calls it overpriced ($15/month in a blog) [search only](https://solofinancehub.vercel.app/blog/best-expense-tracking-apps).
- **Competing apps:** Easy Expense (4.9★, ~2.5K), 1tap receipts, Receipts: Mileage Tax Tracker (~18 reviews), Hurdlr.
- **The gap:** one-time price, on-device storage, accountant-friendly export with custom category groups.
- **Quick take:** **Warm.** The subscription-required angle is verified, but direct complaints about it are not.

### 5. photo-cleanup-swipe: Cold
- **Idea:** Month-by-month swipe photo cleanup, one-time price.
- **Category / platforms:** Utilities · iOS (Android possible). Photo library permission is sensitive.
- **Demand signals:**
  - A dozen or more swipe-cleaner apps already sit on the App Store [search only](https://apps.apple.com/us/app/id6744836008).
- **Pain signals:**
  - **Answer to Q4:** there is **no hard blocker**, but friction is real. Deletion goes through the system confirmation prompt. Under limited access, an app only sees the photos the user selected [search only](https://www.zdsoft.com/photo-cleaner/support.html).
  - Apple forum threads report that `PHPhotoLibrary.performChanges` on iOS 26 sometimes never calls its completion handler and never shows the dialog. The reports are anecdotal, on few devices and not reproducible in a sample app [search only](https://developer.apple.com/forums/thread/806349).
  - A fetched swipe-cleaner page shows a paywall appearing after purchase, losing your place after a delete, and a fixed bug that blocked granting more library access [fetched](https://apps.apple.com/us/app/id6744836008). That app has only 3 ratings, so it is a single-review signal.
- **Competing apps:** Photo Delete Swipe Cleaner (3 ratings), Space Swipe, Photo Cleaner: Daily Delete, Simple Photo Cleaner.
- **The gap:** one-time price and month-by-month order. Many apps already offer swipe flow.
- **Quick take:** **Cold.** It is crowded and there is a platform risk. Android parity is unverified.

### 6. meal-plan-pantry: Cold
- **Idea:** Weekly meal plan with pantry subtraction.
- **Category / platforms:** Food / Lifestyle · iOS, Android, web.
- **Demand signals:** *assumption.* I fetched nothing for this idea this cycle.
- **Pain signals:** *assumption.* No fetched evidence.
- **Competing apps:** not re-checked. The backlog assumes incumbents offer pantry and one-time pricing.
- **The gap:** unverified.
- **Quick take:** **Cold.** It is Ease 3, which is above the brief's limit, and there is no evidence. It is not sent to analysis.

### 7. bill-calendar-glance: Warm
- **Idea:** A bills-due month strip organised by payday, with manual entry only. No bank links, no account.
- **Category / platforms:** Finance / Utilities · iOS, Android, web. Financial flag (record-keeping only).
- **Demand signals:**
  - Many manual-entry bill apps exist: DueAhead, Bills Monitor, DueBox, ClearDue, My Bill Calendar [search only](https://hunted.space/product/dueahead).
  - Bill Watch: 4.2★, ~158 ratings, Pro $19.99 [fetched](https://apps.apple.com/us/app/bill-watch/id949348178).
- **Pain signals:**
  - Fetched Bill Watch reviews: a Dec 2025 crash on reports, bills with no end date disappearing (a late fee resulted), manual backup, and cluttered features [fetched](https://apps.apple.com/us/app/bill-watch/id949348178).
  - A competitor already pitches "no account, no bank link, on-device, one-time purchase after a 30-day trial": DueAhead has only 2 upvotes and 1 comment on Product Hunt [fetched](https://hunted.space/product/dueahead).
- **Competing apps:** Bill Watch (4.2★, ~158), DueAhead (new, almost no ratings), Bills Organizer & Reminder, Bills Monitor.
- **The gap:** a payday-first month strip and reliable reminders. It does not lose bills, and it backs up automatically.
- **Quick take:** **Warm.** The positioning is partly taken, but the incumbents are weak and the risk is low. The pain evidence is about reliability, not price.

### 8. plant-watering-log: Warm
- **Idea:** Plant care reminders with no plant cap, and a winter mode that stretches schedules.
- **Category / platforms:** Lifestyle / Home · iOS, Android, web.
- **Demand signals:**
  - Many apps: Planta, Plant Parent, Plant Daddy, Water My Plant, PlantWaterAI. All come from search results [search only](https://apps.apple.com/app/id1474539700).
  - Fetched: Plant Watering Reminder, 4.6★, premium ~$5.99, per one aggregator's 90-review analysis [fetched](https://justuseapp.com/en/app/1592638714/plant-watering-reminder/reviews).
- **Pain signals:**
  - Aggregators report paywall and subscription confusion as the top complaint for Plant Parent, plant-count paywalls for Plant Daddy, and ~20% of Planta reviewers saying reminders don't adjust to early or late watering [search only](https://kimola.com/reports/comprehensive-planta-app-customer-feedback-report-app-store-us-155863). These figures are unverified third-party numbers.
  - The one fetched page showed a different pain: an update merged plants on different schedules into one date and dropped notes. It also showed a request for per-plant fertilizer tracking.
- **Competing apps:** Planta (large), Plant Parent, Water My Plant, Plant Watering Reminder (4.6★).
- **The gap:** no cap, no ads or paywall prompts at launch, adaptive reminders (snooze that reschedules) and a winter mode.
- **Quick take:** **Warm.** Pain looks real but rests on aggregator data. Retention is moderate, and the field is crowded with many apps.

### 9. second-brain-lite: Cold
- **Idea:** Quick-capture notes that resurface on a spaced schedule.
- **Category / platforms:** Productivity · iOS, Android, web.
- **Demand / pain signals:** *assumption.* Nothing fetched.
- **Competing apps:** large incumbents, not re-checked.
- **The gap:** unverified. Sync expectations are high.
- **Quick take:** **Cold.** No evidence.

### 10. language-phrase-drill: Cold
- **Idea:** An offline travel-phrase drill scoped to one trip.
- **Category / platforms:** Education / Travel · iOS, Android.
- **Demand / pain signals:** *assumption.* Nothing fetched.
- **Competing apps:** large language-learning incumbents, not re-checked.
- **The gap:** unverified. It needs original phrase content, which is a heavy content task.
- **Quick take:** **Cold.**

### 11. pet-vaccine-wallet: Cold
- **Idea:** A pet vaccine and document wallet with PDF export.
- **Category / platforms:** Pets · iOS, Android.
- **Demand signals:**
  - Many apps exist: Vet Record (4.5★, ~1.4K reviews, on the developer's own page), VitusVet (4.9★, ~10.8K per an aggregator), PawLog, VetVault, Pet Passport [search only](https://www.producthunt.com/products/vet-record-pet-health-tracker-ios/reviews).
- **Pain signals:** none found. A Pawzy user asked to share records directly with a vet [search only](https://www.producthunt.com/products/pawzy-2).
- **Competing apps:** VitusVet, Vet Record, PawLog, Pet Passport.
- **The gap:** none identified. Several apps already generate a shareable vaccine card.
- **Quick take:** **Cold.** Crowded with no pain found. It is adjacent to the parked `multi-pet-care-log`.

### 12. return-warranty-tracker (NEW): Warm
- **Idea:** Track return deadlines and warranty end dates for purchases. Manual entry with a receipt photo, all on-device. Sold as a one-time purchase.
- **Category / platforms:** Utilities / Lifestyle · iOS, Android, web.
- **Demand signals:**
  - It is **seasonal**: holiday return windows run into January. One article cites Amazon until Jan 31 for most Nov–Dec purchases, with other retailers differing [search only](https://www.inkl.com/news/five-steps-to-organize-your-holiday-returns).
  - Search found 7+ return-tracker apps and 15+ warranty-tracker apps, almost all new: Return Tracker, ReturnWindow, Return Keeper ($2.99, local), Return Window ($0.99), Wrnty, Warranty Vault [search only](https://apps.apple.com/us/app/return-tracker/id6749532557).
- **Pain signals:** none fetched. The newcomers have few or no ratings, so quality of the field is unproven. Pricing is mixed: some subscription ($4.99/month, $19.99/year), some one-time, some email-scanning (privacy cost) [search only](https://apps.apple.com/us/app/return-radar/id6761351819).
- **Competing apps:** Return Tracker, ReturnWindow, Return Keeper, Wrnty. All low-rating-count.
- **The gap:** a combined view of "return by" and "warranty until", a calendar-free reminder flow, and local storage.
- **Quick take:** **Warm.** There is timely demand, but the market is crowded with unrated apps and there is no pain evidence. Possible overlap with `tax-receipt-folder` (shared receipt capture).

### 13. gig-mileage-log (NEW): Warm
- **Idea:** A manual-first mileage log for gig and self-employed drivers (date, from/to, purpose, miles) with a one-tap IRS-style CSV/PDF export. No background GPS, no subscription.
- **Category / platforms:** Finance / Utilities · iOS, Android, web. Tax-adjacent flag (record-keeping only).
- **Demand signals:**
  - Gridwise, TripLog, MileIQ, Everlance, MileageWise, GigReal, and others fill the category [search only](https://gridwise.io/blog/5-best-mileage-trackers-for-gig-drivers).
- **Pain signals:**
  - Subscription pricing is high: Gridwise Plus is $9.95/month or $95.99/year, per its own blog [search only](https://gridwise.io/blog/best-mileage-tracker-app). MileageWise's free tier is limited to 15 trips/month in one listing.
  - One App Store review of Gridwise says the app isn't tracking miles, even manually, and demands a refund [search only](https://apps.apple.com/US/app/id1215991382?mt=8).
  - **Counter-evidence:** automatic tracking is the main draw. A manual-only app is a niche, and the "manual log is enough" claim is a vendor-sourced view.
- **Competing apps:** Gridwise (large), TripLog, MileIQ, MileageTracker3000 ("coming soon", no subscription).
- **The gap:** a manual-first, one-time-price log with a clean export. It pairs with `freelancer-time-log` and `tax-receipt-folder` as a "self-employed pack".
- **Quick take:** **Warm.** Pricing pain is plausible, but I have not fetched a store review page that proves it.

---

## Dropped (one line each)
- **gratitude-journal-one-time** (new): crowded, no verified pain, low retention beyond January.
- **post-holiday returns via email scanning** (new): privacy-heavy and needs email APIs, so Ease ≤ 3. Folded into entry 12 as a manual-entry variant.
- **seasonal-home-checklist:** merged into entry 2.
- **Any native desktop app:** breaks the platform constraint. Nothing was proposed.

## Answers to the brief's questions
1. **Chore apps:** no fetched account or kid-access complaints. Real pain is subscription gating and price.
2. **Packing:** copy-forward already exists (Pack, Repeat and others).
3. **Gift lists:** seasonal, and the leader already offers budget plus year archive at $2.99 one-time.
4. **Photo cleanup:** no hard blocker. System delete confirmation, limited-library access and flaky iOS 26 deletion reports are risks. The field is crowded.
5. **New signals:** return and warranty tracking (post-holiday timing) and subscription-fatigue in mileage logs. I could not verify rising Reddit or Product Hunt demand, because the search tool does not index Reddit and returned no November Product Hunt launches.

## Recommendation for analysis
No Hot entries. The best Warm entries are the six below. The two NEW entries (12, 13) most need analyst validation, since their evidence is search-only.

ANALYZE: family-chore-board, tax-receipt-folder, bill-calendar-glance, plant-watering-log, gig-mileage-log, return-warranty-tracker

## Analyst status (second half: entries 4–6)
- **plant-watering-log** → [docs/research/ideas/plant-watering-log.md](../../ideas/plant-watering-log.md) — scored 76 (Strong)
- **gig-mileage-log** → [docs/research/ideas/gig-mileage-log.md](../../ideas/gig-mileage-log.md) — scored 80 (Strong)
- **return-warranty-tracker** → [docs/research/ideas/return-warranty-tracker.md](../../ideas/return-warranty-tracker.md) — scored 76 (Strong)
