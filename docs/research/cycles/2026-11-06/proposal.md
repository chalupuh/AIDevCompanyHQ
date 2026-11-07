# R&D Proposal: Cycle 1, 2026-11-06 (open scan)

**Author:** rd-manager | **Inputs:** brief.md, scan.md (20 entries), 8 idea files (7 after merging the two timers)

**Read first:** All evidence this cycle comes from aggregators, vendor blogs or store listings. **No Demand or Gap score carries H confidence.** After calibration **no idea reaches Strong (>= 75)**. All five shortlisted ideas are Promising (70-74). Working names are placeholders and **have not been trademark-checked**. Every shortlisted idea passes the originality gate.

## 1. Summary table

| Rank | Idea | Score | Ease (est. MVP) | Differentiator |
|---|---|---|---|---|
| 1 | Forgiving habit tracker (`forgiving-habit-tracker`) | 74 | 5 (1.5-2 wks) | Rolling 30-day consistency and pause days instead of a streak that resets; local-only, one-time unlock |
| 2= | Ad-free water tracker (`water-tracker-ad-free`) | 72 (was 76) | 5 (1-1.5 wks) | No ads, no account, core free, honest one-time unlock |
| 2= | Local-first freelancer time log (`freelancer-time-log`) | 72 | 4 (2-3 wks) | No account, no cloud, PDF/CSV timesheet export, one-time price |
| 4= | Focus + routine visual timer, merged (`focus-visual-timer`, absorbs `routine-step-timer`) | 70 | 4 (~3 wks) | Uncapped focus timer plus sequenced routine steps with a "finish by" time; offline, one-time unlock |
| 4= | Rotating-shift calendar (`rotating-shift-calendar`) | 70 | 5 (~2 wks) | Enter the pattern once, add overrides, share with family as image/ICS; free core |

Not shortlisted: subscription tracker 68 (parked) and roommate expense splitter 64 (parked, Ease 3). Calibration changes: water tracker Demand 5->4; subscription tracker Monetization 3->2; the two timers merged into one idea (see the Calibration notes in each idea file).

## 2. Shortlisted ideas

### 2.1 Forgiving habit tracker (74)
- **Pitch:** A habit tracker where one missed day never resets your progress to zero.
- **Target user:** People who give up on habits after a lapse, including people who cannot show up every day.
- **Evidence:** pain from streak anxiety ([habitdoom, vendor](https://habitdoom.com/blog/streak-anxiety-habit-trackers); [Polar Habits reviews](https://www.producthunt.com/products/polar-habits/reviews?page=3)); active no-account launches ([Just Track](https://www.producthunt.com/p/just-track/just-track)).
- **Competitors and our edge:** Streaks, Habitica, Loop, Habi, Kintsu, Polar Habits. The "forgiving" angle is already crowded (Gap 3), so our edge is execution, iOS/Android parity and one-time pricing.
- **MVP:** habits (daily or X per week), rolling consistency %, lifetime total, pause days, reminders, heatmap with editing of past days, CSV export, unlock for more than 3 habits.
- **Scores:** Demand 4 M, Gap 3 M, Ease 5 H, Money 3 M, Competition 2 M, Retention 3 M, Risk 5 H.
- **Risks:** hard to get noticed in a crowded category; the angle is easy to copy; no ADHD or health claims; data loss on device change until backup ships.

### 2.2 Ad-free water tracker (72)
- **Pitch:** Log a glass of water in one tap, with reminders that stop once you hit your goal. No ads, no account.
- **Target user:** Anyone trying to drink more water.
- **Evidence:** Waterllama has roughly 140-340k ratings (trackers conflict, [AppGoblin](https://appgoblin.info/apps/1454778585/trends)); complaints about ads and paywalls ([Kimola](https://kimola.com/reports/unlock-insights-waterminderr-app-user-feedback-report-app-store-us-148033), [JustUseApp](https://justuseapp.com/en/app/952835359/aqualert-water-tracker-daily/reviews)).
- **Competitors and our edge:** Waterllama, WaterMinder, AQUALERT. Our only edge is "no ads, honest pricing" (Gap 2).
- **MVP:** quick-add cups, goal ring, smart reminders with quiet hours, week/month history, ml/oz, local export.
- **Scores:** Demand 4 M (calibrated down from 5), Gap 2 M, Ease 5 H, Money 3 M, Competition 2 M, Retention 4 M, Risk 5 H.
- **Risks:** a commodity product with little commercial upside. The score comes from Demand and Ease, not from differentiation, so treat it as a pipeline test, not a bet.

### 2.3 Local-first freelancer time log (72)
- **Pitch:** A start/stop timer per client and one-tap timesheets, with all data kept on your device.
- **Target user:** Solo freelancers and contractors who bill by the hour.
- **Evidence:** write-up on Harvest's price hike ([dev.to](https://dev.to/wubingwx/harvest-raised-prices-10x-heres-what-freelancers-actually-need-from-an-invoice-tool-1phd)); roundup on pricing and bloat ([wearefounders](https://www.wearefounders.uk/best-time-tracking-apps-for-freelancers-in-2026/)); indie launches ([NotaTime](https://www.producthunt.com/p/notatime-simple-time-tracking), [Local Hours](https://hnshowcase.com/post/47170940/local-hours-local-first-time-tracking-app-macos-ios-open-sou)).
- **Competitors and our edge:** Clockify, Toggl and Harvest, which have strong free tiers. Our edge: privacy, no account, export ready for invoicing, one-time price.
- **MVP:** clients/projects with rates, a reliable timer plus manual entries, weekly/monthly totals, PDF/CSV export, a reminder for a forgotten running timer, backup file.
- **Scores:** Demand 4 M, Gap 3 M, Ease 4 H, Money 3 M, Competition 2 M, Retention 4 M, Risk 5 H.
- **Risks:** strong free incumbents; scope creep into invoicing (scan #15); data loss without backups.

### 2.4 Focus + routine visual timer (merged, 70)
- **Pitch:** One calm timer app with two modes. Focus mode is an uncapped Pomodoro with a shrinking disc. Routine mode is a chain of timed steps with a "finish by" time.
- **Target user:** Students, people who lose track of time, and parents running routines (no child accounts).
- **Evidence:** Forest has roughly 850k reviews on one tracker, with complaints about paywalls and a 30-minute cap ([marlvel](https://marlvel.ai/apps/forest-focus-for-productivity/reviews), [Kimola, small sample](https://kimola.com/reports/exclusive-forest-app-user-feedback-analysis-report-google-play-en-us-151945)); recent routine-timer launches ([Orbit Zone](https://apps.apple.com/no/app/orbit-zone/id6757920940), [add.org roundup](https://add.org/adhd-tools-for-adults/)).
- **Competitors and our edge:** Forest, Pomofocus, Be Focused, Brili, Time Timer, Orbit Zone. Neither mode stands out alone. Combined, offline and with one-time pricing, they stand out somewhat more.
- **MVP:** focus/break timer with presets, visual disc, routine builder, run mode with a preview of the next step and an ahead/behind indicator, notifications that work in the background, session log.
- **Scores:** Demand 4 M, Gap 3 L, Ease 4 M, Money 3 M, Competition 2 M, Retention 4 M, Risk 4 M.
- **Risks:** **ADHD-wording flag (owner review):** no treatment or therapeutic claims, and limited use of "ADHD" in store copy. The gap is unverified. Getting sounds and haptics to play when the screen is locked is the tricky part.

### 2.5 Rotating-shift calendar (70)
- **Pitch:** Enter your rota pattern once and see months ahead, your next shift and your days off.
- **Target user:** Nurses and factory, emergency and hospitality workers on rotating patterns.
- **Evidence:** many apps already exist ([listing](https://apps.apple.com/us/app/id6762512550), [Rota Calendar](https://apps.apple.com/app/id430229059), [Shift Worker Pro](https://www.bluestacks.com/campaign/com.taulapps.shiftworker2/es)). **No complaint text was found.**
- **Competitors and our edge:** Shift Worker Pro, Rota Calendar and others. Our edge (clean UI, free patterns, family sharing) is an assumption.
- **MVP:** pattern builder, generated calendar, overrides for single days, countdown to the next shift, reminders, sharing as image/ICS.
- **Scores:** Demand 3 L, Gap 2 L, Ease 5 H, Money 3 M, Competition 3 L, Retention 4 M, Risk 5 H.
- **Risks:** **Red flag: Demand and Gap are both L**, so the score rests on Ease and Risk. Edge cases with DST and overnight shifts. Read 20-30 store reviews before committing.

## 3. R&D Manager's recommendation

- **First build (fast pipeline win): ad-free water tracker.** It is the smallest and lowest-risk MVP (1-1.5 weeks, no backend, no regulated data) and is the methodology's own reference example for Ease 5. It runs spec -> build -> test -> store release end to end with almost no product risk. Its commercial upside is weak (Gap 2), so judge it on what the pipeline learns, not on revenue.
- **Better bet: local-first freelancer time log.** Professional users with a weekly need (Retention 4), clear pain from incumbent price hikes, and room for a higher one-time price (about $10-15, assumption). It still fits the brief (Ease 4, 2-3 weeks). Build it second.
- **Forgiving habit tracker** has the top score (74) but sits in a crowded niche. It is a good alternative first build if the owner wants more upside than the water tracker for about the same build cost.
- **Merged timer and shift calendar:** approve only after a cheap pass through store reviews (Gap is L on both).
- **Before any store launch:** trademark check on the chosen working name.

## Owner decision
- [ ] water-tracker-ad-free: Approve / Park / Reject   Notes:
- [ ] freelancer-time-log: Approve / Park / Reject   Notes:
- [ ] forgiving-habit-tracker: Approve / Park / Reject   Notes:
- [ ] focus-visual-timer (merged with routine-step-timer): Approve / Park / Reject   Notes:
- [ ] rotating-shift-calendar: Approve / Park / Reject   Notes:
