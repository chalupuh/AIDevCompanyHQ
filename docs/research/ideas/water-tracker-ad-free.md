# Drizzlemark: ad-free water tracker (scan #4)

**Slug:** water-tracker-ad-free | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Drizzlemark.** A minimal hydration log with quick-add buttons and gentle reminders; no ads, no account, and an honest one-time unlock.

## 2. Target user and job-to-be-done
Anyone building a drink-more-water habit. Job: "Log a glass in one tap and get a reminder that does not nag."

## 3. Differentiator
Ad-free, no account, core features free (reminders, history), one-time unlock for extras. Signals: ads in AQUALERT, ads/sync/subscription frustration with WaterMinder, a basic function behind a paywall in Waterllama ([Kimola](https://kimola.com/reports/unlock-insights-waterminderr-app-user-feedback-report-app-store-us-148033), [JustUseApp](https://justuseapp.com/en/app/952835359/aqualert-water-tracker-daily/reviews)). Honest view: the differentiation is thin, since Waterllama is highly rated and other apps already compete on "simple".

## 4. MVP feature list
1. One-tap quick-add (customizable cup sizes)
2. Daily goal with progress ring
3. Smart reminder cadence (skips when goal is met, quiet hours)
4. History with week/month charts
5. Units (ml/oz) and manual goal
6. Local backup/export

**Left out:** health-platform sync (v1.1), wearables, social, mascots/gamification, personalised medical goal calculation.

## 5. Platforms and technical notes
Expo; local storage; local notifications; Apple Health / Health Connect writes are optional later (permissions and review). No backend. Keep goal copy non-medical.

## 6. Ease-of-development
**5.** Estimated MVP 1-1.5 weeks.

## 7. Monetization
Free core, no ads; one-time unlock (about $3-5, assumption) for themes, widgets, health sync. Existing apps rely on subscriptions or ads, so a one-time model is a plausible but unproven wedge.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 5 | M | Waterllama about 140-340k ratings at ~4.9 (conflicting trackers; even the low end is large) |
| Gap | 20% | 2 | M | Ad/paywall complaints exist but strong, well-liked apps and many free options cover the need |
| Ease | 20% | 5 | H | Methodology's reference example for ease 5 |
| Monetization | 10% | 3 | M | Subscription and one-time both seen; low ARPU |
| Competition | 10% | 2 | M | Waterllama, WaterMinder entrenched |
| Retention | 10% | 4 | M | Daily use, but novelty decays |
| Risk | 10% | 5 | H | No sensitive data, no regulation |

**Arithmetic:** 5×.20=1.00; 2×.20=0.40; 5×.20=1.00; 3×.10=0.30; 2×.10=0.20; 4×.10=0.40; 5×.10=0.50. Sum = 3.80. 3.80 ÷ 5 × 100 = **76** (Strong on paper).

**Overall confidence: M.** The 76 is driven by Demand 5 and Ease 5; with Gap at 2 it is borderline, and a one-point drop in Demand would put it at 72. Treat it as a low-risk pipeline test rather than a differentiated bet.

## 9. Risks and originality check
- Originality gate: PASS. Original name; avoid Waterllama's characters/style and WaterMinder's naming.
- Risks: commodity product with high acquisition cost; reviews of incumbents already strong; ads/paywall are the only wedge.
- What would raise the score: a distinctive hook (e.g. widget-first, or a niche such as runners/pregnancy-safe copy flagged for review) and verified store rankings.

**Calibration notes (rd-manager, 2026-11-06):** Demand 5 -> 4. The only evidence is conflicting aggregator rating snapshots (140-340k) at M confidence; Forest at ~850k was scored 4, so 5 here was inconsistent, and a 5 should need H-grade chart/search data. Score 76 -> **72** (Promising, no longer Strong). Gap 2 stands: this is a pipeline test, not a differentiated bet. Working name 'Drizzlemark' not trademark-checked. Status: proposed (as fast pipeline win).
