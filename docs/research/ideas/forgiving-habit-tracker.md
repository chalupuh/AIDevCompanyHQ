# Tidemark: forgiving habit tracker (scan #1)

**Slug:** forgiving-habit-tracker | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Tidemark.** A local-only habit tracker that shows a rolling consistency tide instead of a streak counter, so a missed day never resets your progress to zero.

## 2. Target user and job-to-be-done
People who start habits and quit after one lapse (including ADHD and chronic-illness users who cannot show up daily). Job: "Keep me going after a bad day without making me feel I lost everything."

## 3. Differentiator
Rolling 30-day consistency % and cumulative total as the headline numbers; declared pause days (sick, travel); gentle copy; no account; one-time unlock. Pain signals: streak reset shame and quitting ([habitdoom blog, vendor](https://habitdoom.com/blog/streak-anxiety-habit-trackers); [Polar Habits reviews](https://www.producthunt.com/products/polar-habits/reviews?page=3)).
**Honest gap check (extra verification, 2026-11-06):** the "forgiving" angle is not empty. Loop Habit Tracker (Android, free, score-based), SetHabits (monthly targets), Habi (streak protection), Kintsu and Polar Habits all market it ([search results, mostly vendor blogs](https://habi.app/insights/streaks-alternatives/); [Kintsu on Product Hunt](https://www.producthunt.com/p/kintsu-beautiful-habit-tracker/kintsu-the-forgiving-habit-tracker)). Our edge is therefore execution plus iOS/Android parity and one-time pricing, not the concept itself.

## 4. MVP feature list
1. Create habits (daily or X-times-per-week), one-tap check-in
2. Rolling 30-day consistency % and lifetime total per habit (no streak reset)
3. Pause days / vacation mode
4. Local reminders per habit
5. Week/month heatmap history, edit past days
6. Local export (CSV) and one-time unlock for >3 habits

**Left out:** accounts, sync, social, gamification/avatars, AI coaching, widgets (later), Apple Watch.

## 5. Platforms and technical notes
Expo (iOS + Android), SQLite/AsyncStorage, expo-notifications. No backend. Nothing hard; the scoring formula needs a clear, explainable definition. Backup/restore is a v1.1 item because local-only means data loss on device change.

## 6. Ease-of-development
**5.** Estimated MVP 1.5-2 weeks (local data, few screens, notifications; matches rubric row 5).

## 7. Monetization
Free for 3 habits; one-time unlock (about $5-8, assumption) for unlimited habits, export, themes. No subscription, no ads.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 4 | M | Large, active category and recurring streak complaints; no store rating counts retrieved, complaint evidence is anecdotal/vendor-sourced |
| Gap | 20% | 3 | M | Pain is real but at least 5 apps already position as forgiving/streak-free |
| Ease | 20% | 5 | H | Local data, few screens, notifications |
| Monetization | 10% | 3 | M | One-time unlock works in category but incumbents are subscription-based; price anchor unproven |
| Competition | 10% | 2 | M | Streaks, Habitica, many indies; crowded |
| Retention | 10% | 3 | M | Habit apps churn quickly; forgiving design may help (hypothesis) |
| Risk | 10% | 5 | H | No sensitive data, no regulation |

**Arithmetic:** 4×.20=0.80; 3×.20=0.60; 5×.20=1.00; 3×.10=0.30; 2×.10=0.20; 3×.10=0.30; 5×.10=0.50. Sum = 3.70. 3.70 ÷ 5 × 100 = **74** (Promising, 1 point under Strong).

**Overall confidence: M.** Evidence is thin (no Reddit/HN thread fetched in scan; my extra search surfaced mirrored Reddit snippets and vendor blogs only).

## 9. Risks and originality check
- Originality gate: PASS. Original name, mechanic (rolling consistency, pause days) is generic; no copying of any app's branding or UI. State differentiator without "X but forgiving" positioning.
- Risks: crowded category and discoverability; forgiving angle easily copied; health-adjacent wording (avoid claims about ADHD treatment).
- What would raise the score: store-review evidence of Streaks/Habitica complaints with counts; a distinct hook beyond forgiveness.

**Calibration notes (rd-manager, 2026-11-06):** No score changes; 74 stands. Demand 4/M is consistent with focus timer and freelancer. Gap 3 kept but the analyst's own check shows 5+ apps already market 'forgiving', so this is execution-led, not concept-led. Working name 'Tidemark' not trademark-checked. Status: proposed.
