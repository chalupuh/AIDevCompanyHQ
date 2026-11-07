# Scan: R&D Cycle 1, 2026-11-06 (open scan)

**Researcher:** market-researcher. **Backlog check:** only the example row exists, so nothing was skipped.

## Evidence caveats (read first)
- Search tooling returned mostly app-store listings, aggregator pages (Kimola, JustUseApp, marlvel.ai, AppFollow) and vendor blogs, and few direct Reddit/HN threads. Pain signals below are paraphrased from those, and vendor/aggregator sources are flagged. No direct chart-rank data was obtained, so "demand" rests on rating counts, launch activity and complaint volume. Treat everything as indicative and verify in the stores before building.
- Rating counts come from third-party trackers and conflict between sources. They are given as rough ranges.
- Pattern across the cycle: complaints cluster on (a) subscription or price changes, (b) free-tier caps, (c) sync failures, (d) clutter, (e) requests for no-account / offline-first. Launch activity on Product Hunt and Show HN shows indie builders already chasing (e), so a distinct angle is needed.
- Ease is a rough researcher estimate (METHODOLOGY §4 rubric), for the analyst to re-score. "LB" = later bet.

## Cross-cutting signals (answers to the brief's questions)
1. **Recurring 1-3★ complaints:** subscription/price hikes and plan limits (Invoice Simple, Splitwise, WaterMinder), features moved behind a paywall (Forest, Waterllama delete), ads (AQUALERT), sync failures (grocery apps), missed renewal alerts (subscription trackers). Links are in the entries below.
2. **Niche misuse of generic apps:** streak resets for users who lapse (habit trackers), time blindness (ADHD), rotating shift patterns (shift workers). See entries 1, 3, 8.
3. **"Is there an app that..." requests:** direct threads were not retrievable. Closest proxies are Show HN / Product Hunt launches built because existing apps were too complex or subscription-based: [Just Track](https://www.producthunt.com/p/just-track/just-track), [NotaTime](https://www.producthunt.com/p/notatime-simple-time-tracking), [Local Hours](https://hnshowcase.com/post/47170940/local-hours-local-first-time-tracking-app-macos-ios-open-sou), [offline book tracker](https://d4dfb987.hackernews-40s.pages.dev/item/48459010).
4. **Privacy / offline / no-account:** a recurring pitch. An HN commenter questioned why a local-first planner needs a subscription ([source](https://brios-git-crit-brianlovin.vercel.app/hn/45810856)). Most "offline budget" evidence is vendor blogs, e.g. [Simple Offline Budget](https://apps.apple.com/app/id6758187910).

---

## A. Simple proven utilities (Ease 4-5)

### 1. Forgiving habit tracker ("no lost streaks")
- **Idea:** A habit tracker that shows cumulative progress and weekly consistency, so one missed day never zeroes a counter. Local-only, no account.
- **Category / platforms:** Health & Fitness / Productivity; Expo (iOS+Android), optional web. Ease ~5.
- **Demand:** Active category: new no-account trackers keep launching ([Just Track](https://www.producthunt.com/p/just-track/just-track)); streak-free positioning exists ([Polar Habits](https://www.producthunt.com/products/polar-habits/reviews)).
- **Pain:** Streak resets cause shame and abandonment; users log falsely to protect streaks ([habitdoom, vendor blog](https://habitdoom.com/blog/streak-anxiety-habit-trackers); [Polar Habits reviews](https://www.producthunt.com/products/polar-habits/reviews?page=3)).
- **Competitors:** Streaks, Habitica, Polar Habits (ratings not retrieved; *assumption*: large incumbents have 10k+ reviews).
- **Gap:** Rolling-window consistency score, "pause days" and a gentle ADHD-friendly tone; one-time unlock instead of subscription.
- **Quick take:** **Hot** (crowded, but a clear pain point and the fastest possible build).

### 2. Local-first freelancer time log with invoice-ready export
- **Idea:** Start/stop timer per client, weekly totals, one-tap PDF/CSV timesheet. Data stays on device; one-time price.
- **Category / platforms:** Productivity / Small business; Expo + web PWA. Ease ~4-5.
- **Demand:** Freelancer tools search is busy; indie launches like [NotaTime](https://www.producthunt.com/p/notatime-simple-time-tracking) and [Local Hours](https://hnshowcase.com/post/47170940/local-hours-local-first-time-tracking-app-macos-ios-open-sou) show interest.
- **Pain:** Price hikes after acquisition (Harvest, per [one dev write-up](https://dev.to/wubingwx/harvest-raised-prices-10x-heres-what-freelancers-actually-need-from-an-invoice-tool-1phd)); trackers seen as $10-20/mo or bloated ([search summary](https://www.wearefounders.uk/best-time-tracking-apps-for-freelancers-in-2026/)); generous free tiers exist (Clockify, Toggl).
- **Competitors:** Clockify, Toggl Track, Harvest, NotaTime.
- **Gap:** Zero account, zero cloud, privacy as headline; strong free competitors mean the edge must be simplicity and one-time pricing.
- **Quick take:** **Hot**

### 3. Rotating-shift calendar (pattern-first)
- **Idea:** Enter a repeating shift pattern once (e.g. 4-on/3-off, rotating nights); see a clean calendar, countdown to next shift and days-off view. Local data, widgets later.
- **Category / platforms:** Lifestyle / Utilities; Expo. Ease ~5.
- **Demand:** Many shift-calendar apps exist ([search listing](https://apps.apple.com/us/app/id6762512550), [Rota Calendar](https://apps.apple.com/app/id430229059), [Shift Worker Pro](https://www.bluestacks.com/campaign/com.taulapps.shiftworker2/es)), which indicates a real niche.
- **Pain:** Direct complaint text not retrieved. Competing apps lean on in-app purchases. *Assumption:* paywalled patterns/export are the main friction; to be verified in store reviews.
- **Competitors:** Shift Worker Pro, Rota Calendar, My Calendar Shift Schedule (ratings not retrieved).
- **Gap:** Clean UI, free-for-core patterns, shareable read-only schedule for family.
- **Quick take:** **Warm**

### 4. Water intake tracker, no ads / one-time
- **Idea:** Minimal hydration log with quick-add buttons and a gentle reminder cadence; no account.
- **Category / platforms:** Health & Fitness; Expo. Ease 5.
- **Demand:** Waterllama shows roughly 140-340k ratings at ~4.9 by tracker snapshots that conflict ([AppFollow/AppGoblin via search](https://appgoblin.info/apps/1454778585/trends)).
- **Pain:** Ads in AQUALERT, ads/sync/subscription frustration with WaterMinder, a basic function behind a paywall in Waterllama ([Kimola](https://kimola.com/reports/unlock-insights-waterminderr-app-user-feedback-report-app-store-us-148033), [JustUseApp](https://justuseapp.com/en/app/952835359/aqualert-water-tracker-daily/reviews)).
- **Competitors:** Waterllama, WaterMinder, AQUALERT.
- **Gap:** Ad-free, honest one-time unlock. Differentiation is thin and incumbents are strong.
- **Quick take:** **Warm** (proven demand, weak differentiation; best as a pipeline test).

### 5. Manual subscription and trial-renewal tracker
- **Idea:** Add subscriptions by hand (no bank link), get reminders days before renewal/trial end, see monthly total. On-device.
- **Category / platforms:** Personal Finance (tracking only, not advice); Expo. Ease 5.
- **Demand:** Dozens of new trackers on the App Store ([listings](https://apps.apple.com/us/app/-/id6749521313)); most have too few ratings to show a score ([search summary](https://apps.apple.com/app/id6759149326)).
- **Pain:** Missed renewal alerts after updates, bank-sync failures, and free tiers capped at ~3 subscriptions ([Gerald blog, a vendor](https://joingerald.com/learn/financial-wellness/subscription-tracker-apps-common-problems)).
- **Competitors:** SubTracker, Subo, Subtrack, ReSubs (all low review counts).
- **Gap:** Reliable local notifications, no cap on subscriptions, calendar export.
- **Quick take:** **Warm** (fragmented market of weak apps, but low barrier means more entrants).

### 6. Focus / visual timer with one-time unlock
- **Idea:** A simple Pomodoro and shrinking-disc visual timer for students and ADHD users; no 30-minute free cap, no subscription.
- **Category / platforms:** Productivity / Education; Expo + web. Ease 5.
- **Demand:** Forest shows roughly 850k reviews at ~4.4 on one tracker ([marlvel snapshot](https://marlvel.ai/apps/forest-focus-for-productivity/reviews)); visual timers recommended for time blindness ([roundup](https://add.org/adhd-tools-for-adults/)).
- **Pain:** Features moved behind subscription, 30-minute free cap, unexpected trial charges ([marlvel/Kimola analyses, small samples](https://kimola.com/reports/exclusive-forest-app-user-feedback-analysis-report-google-play-en-us-151945)); weekly sub on a Pomodoro app ([listing](https://apps.appfollow.io/ios/pomodoro-focus-timer-study/1548846593?country=us)).
- **Competitors:** Forest, Pomofocus (web), Be Focused, Time Timer (physical/app).
- **Gap:** Fully usable free core and one-time unlock; ADHD-oriented visual/preset modes.
- **Quick take:** **Warm**

### 7. Reusable checklist runner (packing, routines, pre-flight lists)
- **Idea:** Create a checklist template, run it, and auto-reset; templates for travel, opening/closing a shop, moving day. Local-only.
- **Category / platforms:** Productivity / Lifestyle; Expo + web. Ease 5.
- **Demand:** *Assumption*: checklists are a perennial utility category; no specific chart or search data was gathered this cycle.
- **Pain:** *Assumption*: general to-do apps are used awkwardly for repeatable lists; not verified.
- **Competitors:** Apple Reminders, Google Keep, Microsoft To Do (large incumbents; sync complaints exist for To Do, [MS forum](https://techcommunity.microsoft.com/discussions/to-do/sync-issue/4129703)).
- **Gap:** Template reset flow and print/share.
- **Quick take:** **Cold** (weak evidence collected; may stay a filler candidate until verified).

### 8. Visual routine timer for time-blind users
- **Idea:** Morning/evening routine as a sequence of timed steps with a visual countdown per step, to counter time blindness.
- **Category / platforms:** Health & Wellness (non-medical) / Productivity; Expo. Ease 4-5.
- **Demand:** Multiple new apps pairing visual timers with ADHD routines ([Orbit Zone](https://apps.apple.com/no/app/orbit-zone/id6757920940), [Brili via roundup](https://add.org/adhd-tools-for-adults/)); time-blindness content is abundant ([Flow Club blog](https://www.flow.club/blog/adhd-time-blindness)).
- **Pain:** Direct review complaints not retrieved. *Assumption:* generic timers have no step sequencing.
- **Competitors:** Brili, Time Timer, Orbit Zone (ratings not retrieved).
- **Gap:** Offline, templates, calm design; avoid medical claims (flag: ADHD wording).
- **Quick take:** **Warm**

### 9. Visa / days-in-country tracker
- **Idea:** Log entry/exit dates, show days remaining against user-entered limits (e.g. 90/180 rule). Local-only.
- **Category / platforms:** Travel / Utilities; Expo. Ease 5.
- **Demand:** A Show HN launch of a local-first iOS visa-and-tax-residency tracker ([HN Showcase](https://hnshowcase.com/post/46978574/nomad-tracker-a-local-first-ios-app-to-track-visas-and-tax-r)) points to interest. *Assumption:* digital-nomad audience is sizeable; not quantified.
- **Pain:** Not retrieved. *Assumption:* spreadsheets are the current workaround.
- **Competitors:** Nomad Tracker and similar indie apps (ratings not retrieved).
- **Gap:** Clear rule presets and calendar view. **Flag:** legal-adjacent, so ship with "not legal advice" and user-entered rules.
- **Quick take:** **Warm**

### 10. Offline-first reading tracker
- **Idea:** Log books, pages, finish dates and yearly goals; works entirely offline, export to CSV.
- **Category / platforms:** Lifestyle / Education; Expo. Ease 5.
- **Demand:** A Show HN question, "why aren't popular book trackers offline-first?" ([HN mirror](https://d4dfb987.hackernews-40s.pages.dev/item/48459010)), suggests an unserved ask. Volume unverified.
- **Pain:** Not retrieved beyond that thread. *Assumption:* popular trackers require accounts and connectivity.
- **Competitors:** Goodreads, StoryGraph (ratings not retrieved).
- **Gap:** Local data and no social layer. Metadata lookup is optional and needs an open API.
- **Quick take:** **Cold** (thin evidence).

---

## B. Mid-complexity (Ease 3-4)

### 11. Roommate / group expense splitter without daily caps
- **Idea:** Add shared expenses and see who owes whom; no daily entry cap, simple settle-up.
- **Category / platforms:** Personal Finance / Lifestyle; Expo + web, accounts + sync. Ease ~3-4.
- **Demand:** Splitwise is entrenched with a large user base (*assumption*; count not retrieved); price-driven "alternative" content is widespread ([Kimola](https://kimola.com/reports/splitwise-app-feedback-report-uncover-user-insights-google-play-en-144452)).
- **Pain:** Free-tier daily expense cap (reports vary, 3 to 10 per day), paywalled receipt scanning, ads ([Trustpilot](https://no.trustpilot.com/review/splitwise.com?page=2), [Kimola](https://kimola.com/reports/splitwise-feedback-analysis-unlock-user-sentiments-google-play-154450)).
- **Competitors:** Splitwise, Tricount, newer indie apps.
- **Gap:** Fair free tier and offline entry with later sync. Network effects favour the incumbent.
- **Quick take:** **Warm**

### 12. Reliable shared grocery list
- **Idea:** A two-person/household list that syncs reliably and works offline in-store, with last-write-wins and no duplicates.
- **Category / platforms:** Lifestyle/Home; Expo + lightweight backend. Ease ~3-4.
- **Demand:** Many long-lived apps (Out of Milk, Grocery Gadget, Our Groceries) ([listing](https://apps.apple.com/in/app/grocery-gadget/id287932487)).
- **Pain:** Sync failures, duplicates and partner items not appearing across several apps ([JustUseApp](https://justuseapp.com/en/app/339684652/grocery-pal-in-store-weekly-savings-sales-coupons-shopping-list/reviews), [AppsHunter](https://appshunter.io/ios/app/998850627/reviews)).
- **Competitors:** Out of Milk, Grocery Gadget, Grocery Pal, Our Groceries.
- **Gap:** Sync reliability is the product. Hard to prove before building; many reviews are old.
- **Quick take:** **Warm**

### 13. Home maintenance logbook with history
- **Idea:** Recurring tasks (filters, gutters, boiler service) with a searchable history, appliance notes and receipts.
- **Category / platforms:** Lifestyle/Home; Expo. Ease ~4.
- **Demand:** Many new entrants and several established apps ([Upkept](https://apps.apple.com/us/app/upkept/id1546005008), [Dwellable](https://apps.apple.com/us/app/-/id6444394386)); one app cited with ~400k combined reviews ([HomeLight roundup](https://homelight.com/blog/buyer-home-maintenance-app)).
- **Pain:** Limited customization and weak history in some apps ([Upkept reviews via search](https://apps.apple.com/us/app/upkept/id1546005008)).
- **Competitors:** Upkept, Dwellable, HIA Home.
- **Gap:** Custom items and history first, offline, one-time price.
- **Quick take:** **Warm**

### 14. Multi-pet care log without pet caps
- **Idea:** Feeding, walks, meds, vet visits for any number of pets, shareable with a partner.
- **Category / platforms:** Lifestyle; Expo. Ease ~4.
- **Demand:** Many new App Store listings, but most have too few ratings to score ([PiwPaw](https://apps.apple.com/us/app/-/id6761027577), [FedPet](https://apps.apple.com/ca/app/fedpet/id6753065946)).
- **Pain:** Pet-count caps on free tiers (FedPet 2, another 3) and weekly subscriptions ([listings](https://apps.apple.com/us/app/-/id6757833623)). Not user-reported complaints.
- **Competitors:** FedPet, PiwPaw, iPetReminder.
- **Gap:** No pet cap, simple sharing. Evidence of user pain is weak.
- **Quick take:** **Cold**

---

## C. Ambitious / later bets (LB)

### 15. Solo-tradesperson invoice and estimate app, one-time price (LB)
- **Idea:** Quote-to-invoice for plumbers, cleaners and similar; offline job-site use; PDF export.
- **Category / platforms:** Small-business tools; Expo + backend, PDF. Ease ~3. **Flag:** tax/legal invoice formats vary by country.
- **Demand:** Invoice Simple has hundreds of Trustpilot reviews (~3.9 score) and ~3.7 on Capterra from 44 reviews ([Trustpilot](https://uk.trustpilot.com/review/invoicesimple.com?page=2), [Capterra](https://www.capterra.com/p/165683/Invoice-Simple/reviews/)).
- **Pain:** Steep price increases, invoice caps per plan, hard cancellation, support ([Trustpilot](https://ie.trustpilot.com/review/invoicesimple.com?page=2), [Kimola](https://kimola.com/reports/invoice-simple-feedback-analysis-insights-unveiled-app-store-us-156837)).
- **Competitors:** Invoice Simple, Wave, FreshBooks.
- **Gap:** Transparent flat pricing and offline mode.
- **Quick take:** **Warm**

### 16. Offline no-account budget (envelope-style) (LB-ish)
- **Idea:** Manual-entry envelope budgeting with no bank link, on-device data, optional encrypted backup.
- **Category / platforms:** Personal Finance (tracking, not advice); Expo. Ease ~4 (charts, recurring rules, backup).
- **Demand:** A wave of "offline budget" apps and blogs ([Simple Offline Budget](https://apps.apple.com/app/id6758187910), [PerDiem](https://perdiem-site.pages.dev/blog/best-envelope-budget-apps-no-bank)), though mostly vendor-authored. YNAB price complaints appear in alternative-seeking content ([vendor blog](https://forge-28o.pages.dev/blog/best-ynab-alternative/)).
- **Pain:** Optional-account apps pushing sign-up, premium nagging ([vendor article](https://pocketclear.app/blog/best-budget-app-privacy-2026.html)).
- **Competitors:** YNAB, Wallet by BudgetBakers, Simple Offline Budget, PerDiem.
- **Gap:** Polish and honest pricing; the crowd of small indie apps makes standing out hard.
- **Quick take:** **Warm** (flag: financial; keep it to record-keeping, no advice).

### 17. Medication reminders with caregiver view (LB, regulated)
- **Idea:** Shared dose schedule for an elderly parent with missed-dose alerts to a family member.
- **Category / platforms:** Health; Expo + push + backend. Ease ~2-3. **Flag:** medical-adjacent, health data and possibly minors/seniors; owner review required.
- **Demand:** Medisafe has roughly 92-100k US iOS ratings at ~4.7 by tracker snapshots ([AppFollow](https://apps.appfollow.io/ios/medisafe-medication-management/573916946?country=us)).
- **Pain:** Medication-editing bugs, duplicate or late reminders, support delays (Caring Village, a competing vendor: [source](https://caringvillage.com/2026/05/13/medication-reminder-apps/)); Apple Health has no caregiver view per the same roundup.
- **Competitors:** Medisafe, Round Health, Apple Health Medications.
- **Gap:** Caregiver escalation done simply. Regulatory and liability risk is high.
- **Quick take:** **Cold** (for this studio now; revisit as an LB).

### 18. Evidence-based shift-worker sleep planner (LB)
- **Idea:** Sleep, light and caffeine timing from the user's rota.
- **Category / platforms:** Health & Wellness; Expo. Ease ~3. **Flag:** health claims need care.
- **Demand:** Many apps already (Timeshifter, Shiftwell, Riseo, Drowze) ([listing](https://apps.apple.com/us/app/drowze/id6760787156), [Timeshifter](https://healthify.nz/apps/t/timeshifter-shift-work-app)).
- **Pain:** No independent complaints found; claims are developer-written.
- **Competitors:** Timeshifter, Shiftwell, Riseo, Drowze.
- **Gap:** Unclear. Could pair with idea 3 (rota) as an add-on rather than a standalone app.
- **Quick take:** **Cold**

### 19. Lightweight student flashcards, fair pricing (LB)
- **Idea:** Spaced-repetition flashcards with a simple UI, import from CSV, offline; one-time price lower than Anki's iOS price.
- **Category / platforms:** Education; Expo. Ease ~3 (scheduling algorithm, import, sync).
- **Demand:** Anki, Quizlet, Brainscape all active; AnkiMobile costs about $25 on iOS ([Anki forum](https://forums.ankiweb.net/t/free-version-of-the-iphone-app/56407), [Anki FAQ](https://docs.ankiweb.net/faqs/why-does-ankimobile-cost-more-than-a-typical-mobile-app)).
- **Pain:** iOS price, utilitarian UI and steep learning curve ([unstar.app, 1-star analysis](https://unstar.app/blog/quizlet-anki-brainscape-knowt-studysmarter-flashcard-study-apps-ranked-2026)).
- **Competitors:** Anki, Quizlet, Brainscape, RemNote.
- **Gap:** Friendly UI with an open scheduling algorithm. Anki is free on other platforms and has deep community content, so this is a hard fight.
- **Quick take:** **Warm**

### 20. Local-first calorie / food log (LB, health flag)
- **Idea:** Offline food diary with no account and no ads.
- **Category / platforms:** Health & Fitness; Expo. Ease ~3 (food database sourcing is the hard part). **Flag:** health-adjacent; data licensing.
- **Demand:** [SnackTax](https://www.producthunt.com/products/snacktax-offline-opnsrc-calorie-tracker) launch shows interest; category is dominated by large incumbents (*assumption*).
- **Pain:** Not retrieved.
- **Competitors:** MyFitnessPal, Lose It (ratings not retrieved).
- **Gap:** Privacy angle; food database is the blocker.
- **Quick take:** **Cold**

---

## Top picks for the analyst (ranked by researcher judgment)
1. Forgiving habit tracker (#1) Hot
2. Local-first freelancer time log (#2) Hot
3. Rotating-shift calendar (#3) Warm
4. Focus / visual timer, one-time unlock (#6) Warm
5. Manual subscription tracker (#5) Warm
6. Visual routine timer for time-blind users (#8) Warm
7. Roommate expense splitter without caps (#11) Warm (LB-leaning)
8. Water tracker, ad-free (#4) Warm
Others worth a look if room: #9 visa tracker, #13 home maintenance, #15 tradesperson invoices, #16 offline budget.

Counts: 20 entries; 10 simple utilities (Ease 4-5), 4 mid-complexity, 6 later bets; categories covered: Health & Fitness, Productivity, Personal Finance, Lifestyle/Home, Education, Utilities/Travel, Small-business tools.
