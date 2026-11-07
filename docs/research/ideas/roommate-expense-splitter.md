# Hearthtab: roommate and group expense splitter (scan #11)

**Slug:** roommate-expense-splitter | **Analyst:** opportunity-analyst | **Date:** 2026-11-06 | **Status:** analyzed

## 1. Working name and pitch
**Hearthtab.** Log shared expenses with housemates, see who owes whom and settle up; no daily entry cap, entries work offline and sync when you reconnect.

## 2. Target user and job-to-be-done
Roommates, couples and small friend groups sharing bills and trips. Job: "Track shared costs fairly and know the balance without arguing."

## 3. Differentiator
No daily cap or entry countdown on the free tier, offline entry, simple settle-up. Signals (re-checked 2026-11-06): free-tier daily limit around 3-4 entries, a 10-second wait before adding, ads and a pricing change drive complaints ([Kimola](https://kimola.com/reports/splitwise-feedback-analysis-unlock-user-sentiments-google-play-154450), [Trustpilot](https://no.trustpilot.com/review/splitwise.com?page=2), [search summary](https://getfinny.app/blog/best-splitwise-alternatives-2026)). Limit numbers vary by source; much 2026 material is competitor marketing. **Counter-evidence:** several alternatives (Tricount, Kittysplit, others) already advertise "no cap", so the gap is real but crowded, and network effects favour the incumbent.

## 4. MVP feature list
1. Groups with members (invite by link/code)
2. Add expense: payer, amount, equal/percent/custom split, category
3. Balances and simplified "who pays whom" settle-up
4. Offline entry with later sync
5. Mark payments as settled (record only, no money movement)
6. Export group history (CSV)

**Left out:** payment processing, receipt scanning/OCR, bank linking, multi-currency conversion (v2), push-heavy social features.

## 5. Platforms and technical notes
Expo + web; needs accounts and a backend (e.g. Supabase/Firebase) with row-level security, invite flow, conflict handling for offline edits (append-only expense log keeps it tractable), and push notifications. The multi-user sync is the main complexity and the reason Ease is 3, not 4.

## 6. Ease-of-development
**3.** Estimated MVP 5-8 weeks: accounts, shared groups, sync/conflicts and invites (rubric: social features and third-party services).

## 7. Monetization
Free with no daily cap; paid unlock or small annual fee (about $3-5/yr or $8 one-time, assumption) for receipts, multi-currency, charts. Backend running costs argue for a modest recurring element.

## 8. Score table
| Criterion | Weight | Score | Conf | Justification |
|---|---|---|---|---|
| Demand | 20% | 4 | M | Large incumbent and widespread alternative content; Splitwise user counts not retrieved |
| Gap | 20% | 3 | M | Cap complaints corroborated across Trustpilot/Kimola, but multiple "no cap" alternatives already exist |
| Ease | 20% | 3 | M | Accounts, sync and invites: 5-8 weeks |
| Monetization | 10% | 3 | M | Splitwise Pro proves some willingness to pay |
| Competition | 10% | 2 | M | Splitwise plus network effects; many alternatives |
| Retention | 10% | 3 | M | Ongoing while a household or trip lasts; trip groups end |
| Risk | 10% | 4 | M | Personal and financial-ish data (names, amounts); no payment handling |

**Arithmetic:** 4×.20=0.80; 3×.20=0.60; 3×.20=0.60; 3×.10=0.30; 2×.10=0.20; 3×.10=0.30; 4×.10=0.40. Sum = 3.20. 3.20 ÷ 5 × 100 = **64** (Promising; park if room is short).

**Overall confidence: M.** Better evidenced than most (cap complaints confirmed across several sources), but sources are aggregators and competitors.

## 9. Risks and originality check
- Originality gate: PASS. Original name; avoid Splitwise's name, green/logo styling and wording; "Splitwise alternative" positioning in store copy is not allowed (own differentiator only).
- Risks: network effects (a group must all adopt it); backend cost and privacy; store policy on user accounts and deletion; finance-adjacent (record-keeping only, no payments).
- What would raise the score: a simpler local-only "two-person" mode that removes the backend; validated willingness to pay.

**Calibration notes (rd-manager, 2026-11-06):** No score changes; 64 stands. Ease 3 is outside the brief's first-build limit (Ease >= 4), network effects favour the incumbent. Record-keeping only, no money movement. Status: parked (revisit with a local-only two-person mode, which would lift Ease to 4).
