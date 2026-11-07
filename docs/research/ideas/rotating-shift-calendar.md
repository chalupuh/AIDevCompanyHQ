# Shiftloom: pattern-first rotating-shift calendar (scan #3)

**Slug:** rotating-shift-calendar | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Shiftloom.** Enter your repeating shift pattern once and get a clean calendar, a countdown to your next shift and a days-off view; data stays on your phone.

## 2. Target user and job-to-be-done
Nurses, factory, emergency and hospitality workers on rotating patterns (4-on/3-off, continental, rotating nights). Job: "Show me my rota months ahead and tell my family when I'm free, without re-entering shifts."

## 3. Differentiator
Pattern-first entry with one-off overrides (swaps, overtime), free core patterns, read-only share image/link-free export for family. **Evidence gap:** the scan found many competing apps ([listing](https://apps.apple.com/us/app/id6762512550), [Rota Calendar](https://apps.apple.com/app/id430229059), [Shift Worker Pro](https://www.bluestacks.com/campaign/com.taulapps.shiftworker2/es)) but no retrieved complaint text. "Paywalled patterns/export" is an assumption and must be checked in store reviews before building.

## 4. MVP feature list
1. Pattern builder (cycle length, named shift types with times and colors)
2. Month/week calendar generated from pattern and start date
3. Per-day overrides (swap, overtime, leave)
4. Next-shift countdown and "next day off" on home screen
5. Local reminders before a shift
6. Share calendar as image / ICS export

**Left out:** employer integrations, team rosters, pay calculators, sleep advice (scan #18 is a separate later add-on), cloud sync, widgets (v1.1).

## 5. Platforms and technical notes
Expo; local storage; pattern-generation logic is simple but must handle DST and overnight shifts crossing midnight. ICS export is straightforward. Widgets need native modules (later). No backend.

## 6. Ease-of-development
**5.** Estimated MVP about 2 weeks.

## 7. Monetization
Free core; one-time unlock (about $4-6, assumption) for multiple patterns/profiles, widgets, ICS export. Competitors rely on in-app purchases, so a one-time price is plausible but untested.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 3 | L | Several apps exist implying a niche, but no ratings, rankings or request threads retrieved |
| Gap | 20% | 2 | L | No complaint evidence; gap is an assumption (paywalls) |
| Ease | 20% | 5 | H | Local data, calendar generation, notifications |
| Monetization | 10% | 3 | M | IAP/one-time model is the norm in niche; small audience |
| Competition | 10% | 3 | L | Fragmented niche apps, ratings unknown |
| Retention | 10% | 4 | M | Checked daily/weekly by users with ongoing shifts |
| Risk | 10% | 5 | H | No sensitive data, no regulation |

**Arithmetic:** 3×.20=0.60; 2×.20=0.40; 5×.20=1.00; 3×.10=0.30; 3×.10=0.30; 4×.10=0.40; 5×.10=0.50. Sum = 3.50. 3.50 ÷ 5 × 100 = **70** (Promising).

**Overall confidence: L.** Demand and Gap are both L: it cannot be ranked #1 without a note justifying why (METHODOLOGY §4). The score is held up mostly by ease.

## 9. Risks and originality check
- Originality gate: PASS. Original name/design; avoid copying any named app's pattern naming or UI.
- Risks: unverified gap; discoverability among many similar apps; calendar-edge bugs (overnight shifts, DST).
- What would raise the score: 20-30 store reviews of Shift Worker Pro/Rota Calendar quantifying paywall and pattern complaints.

**Calibration notes (rd-manager, 2026-11-06):** No score changes; 70 stands, but flagged: Demand L and Gap L, score is carried by Ease 5 and Risk 5. Competition 3/L kept (fragmented but unverified). Must not be ranked #1 without store-review verification. Working name 'Shiftloom' not trademark-checked. Status: proposed (conditional on review check).
