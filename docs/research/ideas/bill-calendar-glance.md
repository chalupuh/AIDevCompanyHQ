# bill-calendar-glance

## Working name and pitch

**BillGlimpse** — A bills-due month strip organized by payday, with manual entry only: no bank links, no accounts, no subscriptions.

## Target user and job-to-be-done

- **Primary user:** Anyone with recurring monthly bills (rent, utilities, subscriptions, loans) who wants to know what's due without checking a bank-linked app or full calendar.
- **JTBD:** "I want to see at a glance what bills are due this month, organized around my payday, so I never miss a due date and never get hit with a late fee — without linking my bank or paying a subscription."

## Differentiator

The scan found that **reliability is the real pain**, not price. Bill Watch (4.2★, ~158 ratings) had fetched complaints about: bills disappearing with no end date (causing a late fee), crashes on reports, manual backup burden, and cluttered features. DueAhead already pitches "no account, no bank link, one-time after trial" but has only 2 Product Hunt upvotes and 1 comment — essentially unproven.

BillGlimpse's differentiator:

- **Payday-first organization.** Bills are displayed relative to your payday, not just calendar date. This answers "can I afford this bill right now?" — a gap none of the incumbents address.
- **Bills never disappear.** Explicit "no end date" handling. A bill that recurs monthly stays visible until the user manually archives it.
- **Month strip view.** A horizontal scroll showing the month at a glance — designed for quick checking, not detailed financial management.
- **Reliable local backups.** Automatic local backup so data is never lost (addressing Bill Watch's manual backup complaint).
- **No bank links, no accounts.** Manual entry only — fast setup, zero privacy risk, works offline.

## MVP feature list

1. **Bill entry form** — bill name, amount, due day of month (or specific date), frequency (monthly/biweekly/custom), and a "recurring indefinitely" toggle.
2. **Month strip view** — horizontal month with bills positioned by due date, color-coded by proximity to payday. Tap for details.
3. **Payday setting** — user sets their payday; bills are organized relative to it (before/after payday).
4. **Local push notifications** — configurable reminder: "X bill due in 3 days." Uses local notification APIs.
5. **Auto backup to local storage** — periodic JSON backup to device storage. Manual restore option.

**Deliberately left out:**
- Bank synchronization or Plaid integration.
- Cloud sync or multi-device support.
- Budget tracking or spending analytics.
- Payment links or bill-pay integration.
- Shared family bills (single user only).
- Currency conversion or multi-currency.

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local storage only.** SQLite for bill records, due dates, notification settings. No backend needed.
- **No sync, no accounts.** Core value is simplicity and privacy.
- **Notifications:** critical feature. Local scheduled notifications for bill due dates. Uses UNUserNotificationCenter (iOS) / WorkManager (Android). Needs testing for reliability across OS updates.
- **Payments:** one-time in-app purchase via StoreKit / Billing Library.
- **No external APIs.** Purely local app.
- **Financial flag (record-keeping only):** no bank data, no financial advice, no payment processing.
- **Nothing technically hard.** Standard CRUD with local notifications and a horizontal scroll UI.

## Ease-of-development estimate

- **Rubric score: 5.** This is a ~1–2 week app: bill CRUD, month strip UI, local notifications, auto-backup. No backend, no sync, no APIs. Fits rubric score 5.
- **Estimated MVP time:** ~10–14 days for a single mobile-dev (Expo/RN shared codebase), plus QA and review. Notification reliability testing is the main time sink.

## Monetization idea

**One-time in-app purchase unlock (~$2.99).** Free tier: track up to 5 bills. Unlock for unlimited bills, custom notification timing, and auto-backup. This pricing is well below Bill Watch Pro ($19.99) and most competitors.

Alternate: flat $1.99–$2.99 upfront purchase (no freemium). Bill apps are simple enough that many users will pay upfront for a "set and forget" tool.

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | M | Bill Watch has 4.2★ / ~158 ratings [fetched]; many manual-entry bill apps exist [search only]. Demand is proven but incumbents are small, suggesting a modest but steady market. |
| **Gap / Differentiation** | 3 | M | Reliability pain is fetched (Bill Watch reviews: bills disappearing, crashes). Payday-first org is a genuine differentiator — no competitor does this. But "reliability" is a defensive feature (users don't buy it, they stop leaving when it's broken). |
| **Ease of development** | 5 | H | Local CRUD + notifications + horizontal month UI. No backend, no APIs. Fits rubric 5. |
| **Monetization** | 4 | H | One-time IAP at $2.99 is well below competitor pricing. Bill Watch charges $19.99 for Pro. Clear price advantage. |
| **Competition** | 3 | M | Many apps exist (DueAhead, Bills Monitor, ClearDue, My Bill Calendar), but most are new, small, or stale. No dominant player with network effects. |
| **Retention** | 4 | H | Monthly bills are inherently recurring. Once set up, users check monthly and get notifications — good ongoing engagement. |
| **Risk** | 4 | H | Financial-adjacent but record-keeping only. No bank data, no advice, no payment processing. Low regulatory risk. |

**Opportunity Score calculation:**

```
(4×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 4×0.10 + 4×0.10) ÷ 5 × 100
= (0.80 + 0.60 + 1.00 + 0.40 + 0.30 + 0.40 + 0.40) ÷ 5 × 100
= 3.90 ÷ 5 × 100
= 78
```

**Opportunity Score: 78 / 100** (Strong — shortlist)

## Risks and originality check

**§3 Originality gate:** ✅ Passes. BillGlimpse uses its own name and branding. No copying of Bill Watch or any competitor's UI, assets, or copy. The payday-first organization is an original concept, not cloned from any competitor.

**Risks:**
- **Notification reliability is a platform risk.** iOS and Android both throttle background notifications. A missed bill notification defeats the core value. Mitigation: use scheduled local notifications (not background fetch), and test thoroughly on target OS versions.
- **DueAhead is already positioning similarly** ("no account, no bank link, one-time after trial"). However, it has essentially zero ratings or reviews — unproven. Our payday-first angle differentiates.
- **Market is modest.** Bill tracker apps are niche — users set up once and come back monthly. Growth depends on ASO and reviews, not virality.
- **Manual entry friction.** Users who link their bank in Mint or Monzo may find manual entry tedious. Target audience is privacy-conscious or light-bill users (1–5 recurring bills).
- **Differentiation may be too subtle.** "Payday-first" is a nice-to-have, not a must-have. Store listing must make this value clear in the first sentence.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 70 (analyst 78).** Rank 3 of this cycle. This was the largest cut among the shortlisted ideas.

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 M | **3 M** | The only fetched listing is Bill Watch at ~158 ratings. The analyst wrote "incumbents are small, suggesting a modest market", which describes a 3, not a 4. |
| Gap | 3 M | 3 M | The score is unchanged but the reasoning changes. The reliability pain (bills vanishing, a late fee, crashes) is fetched. The claim that **no competitor does payday-first is false**. My search found Bills Organizer & Reminder with income tracking and bi-weekly cycles, where a reviewer mentions planning around a paycheck ([listing](https://apps.apple.com/app/id1352782733) via [appfollow](https://apps.appfollow.io/ios/bills-organizer-reminder/1352782733?country=si)). There is also a Taskade "bill calendar with paydays" template ([taskade](https://www.taskade.com/app/bill-calendar-tracker-uhho8j6kpsyfb1s5)). DueAhead already holds the no-account, one-time positioning. |
| Ease | 5 H | 5 H | No change. Testing notification reliability is the main cost. |
| Monetization | 4 H | **3 M** | Studio rule: one-time unlock = 3. Bill Watch Pro at $19.99 (fetched) supports M. |
| Competition | 3 M | 3 M | No change. |
| Retention | 4 H | **3 M** | The app is driven by notifications and has a monthly cadence. The analyst's own risk note says users "come back monthly". Weekly use scores 4 (freelancer log, plant log), monthly use scores 3. H is not allowed without usage evidence. |
| Risk | 4 H | 4 M | The score is unchanged and confidence drops to M (financial-adjacent wording). |

- Calc: (3·.2 + 3·.2 + 5·.2 + 3·.1 + 3·.1 + 3·.1 + 4·.1) ÷ 5 × 100 = **70**.
- Overlap: this largely overlaps the parked cycle-1 `subscription-trial-tracker` (a manual recurring-payment reminder). They are not merged now because the jobs differ (bills by payday vs. trial cancellations). If this is approved, the spec should treat subscriptions as one bill type and retire that backlog entry.
- Platforms line is correct. `payments [y]` = store in-app purchase only, no backend. A web/PWA version is a reasonable option because no notifications are needed for glancing, but it's not in the MVP.
- Gates: originality PASS. **Financial flag** (record-keeping only).
