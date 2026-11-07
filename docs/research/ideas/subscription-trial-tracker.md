# Lapsewatch: manual subscription and trial-renewal tracker (scan #5)

**Slug:** subscription-trial-tracker | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Lapsewatch.** Add your subscriptions and free trials by hand, get a reminder days before each renewal or trial end, and see your monthly total; no bank link, nothing leaves the device.

## 2. Target user and job-to-be-done
Anyone juggling streaming, app and software subscriptions and free trials. Job: "Warn me before I get charged and show what I really spend each month."

## 3. Differentiator
Reliable local notifications, no cap on number of subscriptions, calendar export, no bank access. Signals: missed renewal alerts after updates, bank-sync failures and free tiers capped near 3 subscriptions ([Gerald blog, a competing vendor](https://joingerald.com/learn/financial-wellness/subscription-tracker-apps-common-problems)). Market is many low-review-count trackers ([listings](https://apps.apple.com/us/app/-/id6749521313)), so a fragmented field but also a very low barrier to entry. Caveat: iOS and Android already show subscriptions natively in system settings, and many people never add a manual tracker.

## 4. MVP feature list
1. Add subscription: name, price, currency, billing cycle, next date, category
2. Trial mode: trial end date with earlier warning
3. Local reminders (configurable days before)
4. Monthly/yearly total and breakdown chart
5. Upcoming renewals list
6. Calendar (ICS) and CSV export

**Left out:** bank/email scanning, cancellation concierge, price-hike detection, sharing, accounts, cloud sync.

## 5. Platforms and technical notes
Expo; local SQLite; scheduled local notifications (reliability of rescheduling after app update/reboot is the key quality point and must be tested on Android battery optimizations). Multi-currency display needs either user-entered rates or a free rates API (avoid in MVP). No backend.

## 6. Ease-of-development
**5.** Estimated MVP about 1.5-2 weeks.

## 7. Monetization
Free with a generous cap (e.g. 10 items); one-time unlock (about $4-6, assumption) for unlimited, export and themes. Low willingness to pay is likely for a saving-money tool; some users will pay if it saves one trial charge.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 3 | M | Dozens of entrants signal interest, but most have too few ratings to show demand |
| Gap | 20% | 3 | L | Complaints come from a competitor blog; "no cap + reliable alerts" is weak and easy to copy |
| Ease | 20% | 5 | H | Local CRUD and notifications |
| Monetization | 10% | 3 | L | No evidence of willingness to pay; OS-native alternatives |
| Competition | 10% | 4 | M | Fragmented weak apps, though low barrier invites more |
| Retention | 10% | 2 | M | Set-and-forget; opened mainly when reminders fire |
| Risk | 10% | 4 | M | Tracking only, no bank data; finance-adjacent, avoid advice |

**Arithmetic:** 3×.20=0.60; 3×.20=0.60; 5×.20=1.00; 3×.10=0.30; 4×.10=0.40; 2×.10=0.20; 4×.10=0.40. Sum = 3.50. 3.50 ÷ 5 × 100 = **70** (Promising).

**Overall confidence: L.** Gap rests on one vendor blog; Monetization is also L. Not rankable #1 without a note.

## 9. Risks and originality check
- Originality gate: PASS. Original name and UI; do not use the names listed in the scan (SubTracker, Subo, Subtrack, ReSubs). Finance-adjacent: keep strictly to record-keeping, no advice.
- Risks: low retention, low ARPU, saturation, notification reliability.
- What would raise the score: evidence of real missed-reminder complaints in reviews; a retention loop (e.g. annual "what I spent" recap).

**Calibration notes (rd-manager, 2026-11-06):** Monetization 3 -> 2. Confidence was L, there is no willingness-to-pay evidence, and iOS/Android show subscriptions natively, which is a free substitute. Score 70 -> **68**. Record-keeping only, no financial advice. Working name not trademark-checked. Status: parked (re-score if a retention loop or real review complaints are found).
