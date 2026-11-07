# Pennyhour: local-first freelancer time log (scan #2)

**Slug:** freelancer-time-log | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Pennyhour.** Start/stop time tracking per client with weekly totals and one-tap PDF/CSV timesheets; all data stays on your device, one-time price.

## 2. Target user and job-to-be-done
Solo freelancers and contractors who bill hourly. Job: "Know what I worked on for whom, and hand a clean timesheet to the client, without another monthly subscription or an account."

## 3. Differentiator
Zero account and zero cloud as the headline, one-time price, timesheet export built for invoicing. Signals: price hikes after acquisition ([Harvest write-up](https://dev.to/wubingwx/harvest-raised-prices-10x-heres-what-freelancers-actually-need-from-an-invoice-tool-1phd)), tools seen as $10-20/mo or bloated ([roundup](https://www.wearefounders.uk/best-time-tracking-apps-for-freelancers-in-2026/)), indie local-first launches ([NotaTime](https://www.producthunt.com/p/notatime-simple-time-tracking), [Local Hours](https://hnshowcase.com/post/47170940/local-hours-local-first-time-tracking-app-macos-ios-open-sou)). Caveat: Clockify and Toggl have generous free tiers, so "cheaper" alone is not an edge; privacy/simplicity must carry it.

## 4. MVP feature list
1. Clients and projects with hourly rate
2. Start/stop timer (survives app close) and manual entries
3. Weekly/monthly totals per client
4. PDF and CSV timesheet export via share sheet
5. Idle/forgotten-timer reminder notification
6. Local backup file export/import

**Left out:** invoicing, payments, teams, cloud sync, integrations, tax features, screenshots/activity monitoring.

## 5. Platforms and technical notes
Expo; SQLite; PDF generation via expo-print; share sheet. Hard parts: reliable timer across backgrounding (store start timestamp, compute duration), PDF layout polish. Optional web PWA is a later add. No backend.

## 6. Ease-of-development
**4.** Estimated MVP 2-3 weeks: local CRUD is easy, PDF export, timer edge cases and backup add time.

## 7. Monetization
Free for 2 clients; one-time unlock (about $10-15, assumption) for unlimited clients and branded PDF export. No subscription.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 4 | M | Freelancer time tracking is a busy search area; evidence is indie launches and vendor/aggregator roundups |
| Gap | 20% | 3 | M | Price-hike pain is real, but Clockify/Toggl free tiers blunt it; local-first indie entrants exist |
| Ease | 20% | 4 | H | 2-3 weeks (timer robustness, PDF) |
| Monetization | 10% | 3 | M | Professionals pay, but free competitors cap willingness; one-time price limits LTV |
| Competition | 10% | 2 | M | Clockify, Toggl, Harvest entrenched |
| Retention | 10% | 4 | M | Ongoing weekly need while the user is working |
| Risk | 10% | 5 | H | Local data, no regulated content |

**Arithmetic:** 4×.20=0.80; 3×.20=0.60; 4×.20=0.80; 3×.10=0.30; 2×.10=0.20; 4×.10=0.40; 5×.10=0.50. Sum = 3.60. 3.60 ÷ 5 × 100 = **72** (Promising).

**Overall confidence: M.** No direct user-request threads retrieved; pain evidence is one dev blog plus a vendor roundup.

## 9. Risks and originality check
- Originality gate: PASS. Original name and design; export layout must be our own. Do not mimic Toggl/Harvest UI.
- Risks: strong free incumbents; local-only data loss without backups; freelancers often want invoicing next (scope creep).
- What would raise the score: store reviews showing paid-tier frustration with counts; a niche (e.g. contractors billing by retainer).

**Calibration notes (rd-manager, 2026-11-06):** No score changes; 72 stands. Ease 4 confirmed (PDF export + timer robustness, 2-3 weeks). Retention 4 justified by weekly billing need, consistent with shift calendar. Watch scope creep into invoicing (scan #15). Working name 'Pennyhour' not trademark-checked. Status: proposed.
