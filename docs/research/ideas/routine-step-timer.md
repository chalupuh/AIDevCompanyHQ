# Stepglow: visual routine timer for time-blind users (scan #8)

**Slug:** routine-step-timer | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Stepglow.** Build a morning or evening routine as a chain of timed steps, each with a visual countdown, so you can see how much time is left for each task.

## 2. Target user and job-to-be-done
People who lose track of time (commonly ADHD, also parents setting routines for kids). Job: "Get me out the door on time by showing what I'm doing now and how long I have."

## 3. Differentiator
Step sequencing with a per-step visual countdown and an overall "finish by" time, offline, calm design, templates. Signals: new apps pairing visual timers with routines ([Orbit Zone](https://apps.apple.com/no/app/orbit-zone/id6757920940), Brili via [roundup](https://add.org/adhd-tools-for-adults/)); abundant time-blindness content ([Flow Club blog](https://www.flow.club/blog/adhd-time-blindness)). **Evidence gap:** no review complaints were retrieved; "generic timers have no sequencing" is an assumption, and Brili/Orbit Zone already do sequencing.

## 4. MVP feature list
1. Routine builder: ordered steps with durations and icons
2. Run mode: current step big, visual countdown, next-step preview
3. "Finish by" time with running ahead/behind indicator
4. Gentle step-change sounds/haptics
5. Starter templates (morning, bedtime, leaving the house)
6. Optional daily reminder to start a routine

**Left out:** accounts, child profiles with rewards, caregiver sync, clinical or diagnostic language, voice assistants, wearables.

## 5. Platforms and technical notes
Expo; local storage; timestamp-based timers; local notifications for step changes when backgrounded (chained scheduled notifications). Keep-awake during run mode. Reliable audio/haptics when the screen is locked is the tricky part. No backend.

## 6. Ease-of-development
**4.** Estimated MVP 2-3 weeks: builder UI, run mode and background step-change notifications are more than a single timer.

## 7. Monetization
Free for 2 routines; one-time unlock (about $5-8, assumption) for unlimited routines, themes, icon packs. Alternatively a small family pack.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 3 | L | New apps and abundant content suggest interest; no rankings, ratings or request threads retrieved |
| Gap | 20% | 3 | L | Gap asserted, not evidenced; direct competitors already sequence steps |
| Ease | 20% | 4 | M | 2-3 weeks |
| Monetization | 10% | 3 | M | Neurodivergent-tool users do pay for good tools; unproven here |
| Competition | 10% | 3 | L | Few strong apps (Brili, Time Timer), ratings unknown |
| Retention | 10% | 4 | M | Daily routine use if it works |
| Risk | 10% | 4 | M | Health-adjacent wording; if aimed at children, extra privacy rules (keep no accounts, no child data collection) |

**Arithmetic:** 3×.20=0.60; 3×.20=0.60; 4×.20=0.80; 3×.10=0.30; 3×.10=0.30; 4×.10=0.40; 4×.10=0.40. Sum = 3.40. 3.40 ÷ 5 × 100 = **68** (Promising).

**Overall confidence: L.** Demand and Gap are both L (note required before ranking #1).

## 9. Risks and originality check
- Originality gate: PASS with a flag. Original name; avoid Brili's/Time Timer's names, characters and visuals. **Regulated-adjacent flag:** do not make ADHD treatment or therapeutic claims; "ADHD" in store copy should be limited and reviewed by the owner.
- Risks: overlap with #6 (consider one app with a routine mode); unverified gap.
- What would raise the score: store reviews of Brili/Orbit Zone showing unmet needs; user interviews.

**Calibration notes (rd-manager, 2026-11-06):** Merged into focus-visual-timer as a 'Routine' mode (same timestamp-timer engine, same audience, both analysts flagged the overlap). Standalone score 68 retired. ADHD-wording flag carries over to the merged idea: no treatment/therapeutic claims, store copy using 'ADHD' needs owner review; no child accounts or child data. Status: merged -> focus-visual-timer.
