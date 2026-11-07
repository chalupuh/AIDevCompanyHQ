# Hushclock: focus and visual timer, one-time unlock (scan #6)

**Slug:** focus-visual-timer | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Hushclock.** A calm Pomodoro and shrinking-disc visual timer where the full core is free to use and a single one-time purchase unlocks the extras; no subscription, no session cap.

## 2. Target user and job-to-be-done
Students and people who struggle to start or stay on task (including ADHD users). Job: "Let me run focus sessions and see time passing, without a paywall mid-session."

## 3. Differentiator
No free-tier time cap, one-time unlock, visual countdown and presets for study/work. Signals: features moved behind a subscription, a 30-minute free cap and unexpected trial charges around Forest ([Kimola analysis, small sample](https://kimola.com/reports/exclusive-forest-app-user-feedback-analysis-report-google-play-en-us-151945)); a weekly subscription on a Pomodoro app ([listing](https://apps.appfollow.io/ios/pomodoro-focus-timer-study/1548846593?country=us)). Caveat: Pomofocus (free web) and many free timers already satisfy basic needs, and Forest's value is its tree gamification, which we will not copy.

## 4. MVP feature list
1. Focus/break timer with configurable lengths and long-break cycle
2. Visual shrinking-disc display (full-screen, glanceable)
3. Presets (study 25/5, deep work 50/10, custom)
4. Background-safe end-of-session notification and sound
5. Session log with daily/weekly totals
6. Optional tag per session (subject/task)

**Left out:** app blocking, social/leaderboards, tree/gamification, accounts, sync, ambient sound library.

## 5. Platforms and technical notes
Expo; timers computed from timestamps (not intervals) so they survive backgrounding; scheduled local notification for the end time. Keep-awake during session. Optional web build for desktop use. No backend.

## 6. Ease-of-development
**5.** Estimated MVP 1-2 weeks (timer app, rubric row 5).

## 7. Monetization
Free core; one-time unlock (about $4-7, assumption) for stats history, themes, sounds, tags. No ads.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 4 | M | Forest at roughly 850k reviews on one tracker snapshot, large category; counts from a single third-party source |
| Gap | 20% | 2 | M | Paywall complaints exist but free alternatives (Pomofocus, many free timers) already cover the gap |
| Ease | 20% | 5 | H | Timer, a few screens, local notifications |
| Monetization | 10% | 3 | M | One-time unlock is proven in utilities but modest ARPU |
| Competition | 10% | 2 | M | Forest, Be Focused and many free options |
| Retention | 10% | 3 | M | Used during study/work periods; seasonal with exam cycles |
| Risk | 10% | 5 | H | No sensitive data; avoid medical claims for ADHD |

**Arithmetic:** 4×.20=0.80; 2×.20=0.40; 5×.20=1.00; 3×.10=0.30; 2×.10=0.20; 3×.10=0.30; 5×.10=0.50. Sum = 3.50. 3.50 ÷ 5 × 100 = **70** (Promising).

**Overall confidence: M.** Demand is plausible; complaint evidence is small-sample aggregator analysis.

## 9. Risks and originality check
- Originality gate: PASS. Original name; do not reuse Forest's tree, Time Timer's red disc styling or Pomodoro branding as a mark (the technique name is generic). Design a distinct visual.
- Risks: me-too feel; low willingness to pay; overlap with scan #8 (visual routine timer): consider merging into one app with a "routine" mode to avoid two weak entries.
- What would raise the score: a distinctive mode (e.g. body-doubling-style prompts, accessibility-first design) and verified review counts.

**Calibration notes (rd-manager, 2026-11-06):** Merged with routine-step-timer (scan #8) into one app: Focus mode (Pomodoro/visual disc) + Routine mode (timed step chains with 'finish by'). Merged scores: Demand 4/M (Forest-scale category, unchanged); Gap 2 -> 3/L (no-cap focus timer plus sequenced routines in one offline, one-time app is more distinct than either alone, but unverified); Ease 5 -> 4/M (routine builder and chained background notifications, ~3 weeks); Money 3/M; Competition 2/M; Retention 3 -> 4/M (daily routines add a daily loop); Risk 5 -> 4/M (ADHD-wording flag from #8). Arithmetic: .80+.60+.80+.30+.20+.40+.40 = 3.50 -> **70** (Promising). Working names 'Hushclock'/'Stepglow' not trademark-checked; pick one. Status: proposed.
