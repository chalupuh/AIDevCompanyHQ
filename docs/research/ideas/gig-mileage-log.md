# gig-mileage-log

**Working name:** MileMark
**Pitch:** A manual-first mileage log for gig and self-employed drivers with one-tap IRS-style CSV/PDF export, one-time price, no subscription, no GPS tracking.

---

## Target user and job-to-be-done

**User:** Ride-share drivers (Uber/Lyft), delivery couriers (DoorDash, Amazon Flex), and freelancers who drive for work and need simple mileage records for tax time.
**JTBD:** "Log my business drives manually throughout the year so I can export a clean mileage report for my accountant at tax time — without paying $80/year for GPS tracking I don't need."

---

## Differentiator

The scan identified these pain signals:

1. **Subscription pricing is high:** Gridwise Plus at $9.95/month ($95.99/year) [search only](https://gridwise.io/blog/best-mileage-tracker-app). MileageWise limits free tier to 15 trips/month.
2. **Reliability complaints:** Gridwise reviewer reports the app isn't tracking miles even manually, demanded a refund [search only](https://apps.apple.com/US/app/id1215991382?mt=8).
3. **GPS-first design is overkill for many:** Users who already remember their routes don't need background tracking — they need a fast log + clean export.

**MileMark closes this by:** being truly manual-first (no GPS, no battery drain), one-time purchase (not $80+/year), and producing a ready-to-send CSV/PDF that matches IRS reporting format.

---

## MVP feature list

1. **Trip entry form** — date, from/to locations, purpose tag (work/delivery/personal), mileage. Saved immediately to local storage.
2. **IRS-style export** — one-tap CSV or PDF with total business miles, breakdown by trip, and a summary section matching Schedule C format.
3. **Monthly/annual summary screen** — running totals with simple bar chart showing miles per month.
4. **Purpose tags** — categorize trips (client visit, delivery, supply run, etc.) with 5 default + user-defined tags.
5. **Local storage only** — all data on-device via SQLite. No account, no sync.
6. **Backup export** — manual CSV backup of all trips for personal archiving.

**Deliberately left out:**
- GPS auto-tracking (adds battery drain, permission complexity, and Ease penalty).
- Multi-device sync (gig drivers typically use one phone).
- Map integration / route drawing (manual entry is the differentiator, not a bug).
- Multi-driver / family sharing (v2 scope).
- Integration with QuickBooks or tax software (nice-to-have, but not MVP).

---

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local-first:** SQLite for trip storage. No backend — removes server costs, sync complexity, and data hosting concerns.
- **Payments:** single one-time purchase via StoreKit (iOS) / Billing Library (Android). No subscription management needed.
- **APIs:** none required. All data is user-entered.
- **PDF generation:** use a lightweight PDF library (e.g., `pdf-lib` on web, `android.graphics.pdf` / `UIGraphicsPDFRenderer` on native). Straightforward.
- **Flag:** nothing technically hard. This is a focused CRUD + report app. The IRS-format CSV/PDF is a formatting exercise, not a compliance challenge.

---

## Ease-of-development estimate

**Ease score: 5** — 1–2 weeks MVP.

Reasoning: Manual entry forms, local SQLite storage, simple aggregations (monthly totals), and formatted CSV/PDF output. No external APIs, no sync, no GPS, no maps, no payment processing backend. The PDF/CSV export is templated, not dynamic. Matches the Ease-5 rubric exactly: "~1–2 weeks, standard CRUD + local storage."

**Estimated MVP time:** ~8–12 calendar days for a single developer (or ~5 days per platform with parallel mobile devs).

---

## Monetization idea

**One-time purchase** at $4.99–$6.99. This undercuts Gridwise's $95.99/year by a wide margin and positions as the "buy once, use forever" alternative. The target audience (gig workers) is price-sensitive, making a low one-time price more appealing than any subscription.

Optional future: a "self-employed pack" bundle with `tax-receipt-folder` (both from this cycle) at a discount — cross-promotion within the studio's own portfolio.

---

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | H | 7+ established apps (Gridwise, MileIQ, TripLog, Everlance); category is proven with real users. |
| **Gap / Differentiation** | 4 | M | Subscription fatigue is real ($80+/year for Gridwise) and manually confirmed via a refund complaint; manual-first + one-time is a clear wedge. |
| **Ease of development** | 5 | H | Plain CRUD + local storage + CSV/PDF export; no APIs, no GPS, no sync. Ease-5 rubric match. |
| **Monetization** | 4 | H | One-time purchase proven across adjacent categories; gig workers are price-sensitive, favoring upfront over recurring. |
| **Competition** | 3 | M | Fragmented — Gridwise is the largest but subscription model is a weakness, not a moat. Many smaller alternatives exist. |
| **Retention** | 3 | M | Year-round for active gig workers, but usage drops during slow seasons; not a daily habit for everyone. |
| **Risk** | 4 | H | Tax-adjacent only (record-keeping, no advice). Local data, no regulated claims, no bank connections. |

**Opportunity Score calculation:**

```
(4×0.20 + 4×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 3×0.10 + 4×0.10) ÷ 5 × 100
= (0.80 + 0.80 + 1.00 + 0.40 + 0.30 + 0.30 + 0.40) ÷ 5 × 100
= 4.00 ÷ 5 × 100
= **80**
```

**Threshold:** 80 → **Strong** (≥ 75). Shortlist candidate.

---

## Risks and originality check

### §3 Originality gate: **PASS**

- Name "MileMark" is original (not copying Gridwise, MileIQ, TripLog, etc.).
- Positioning is "manual-first, one-time price, IRS export" — not a "clone of X."
- No scraping of any proprietary data (trip data is user-entered).
- Tax-adjacent flag: record-keeping only, no tax advice given, no filing. This is a spreadsheet-in-app form, not regulated financial service. Flagged for owner awareness only.

### Key risks

1. **Manual-entry friction (M confidence on Gap):** The scan notes "automatic tracking is the main draw" for existing users [scan entry 13]. Some users may resist manual logging entirely. This is a design challenge (make entry dead simple) but not a technical blocker.
2. **Seasonal demand:** Gig driving peaks in certain months; tax-time urgency (Jan–Apr) is the main conversion window. Marketing timing matters.
3. **Competition from free tools:** Users might stick with a spreadsheet or Notes app. The app must offer clearly better UX + one-tap IRS formatting to justify a download.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 68 (analyst 80).** This is the largest cut this cycle. **Parked.**

**Red flag:** the analyst gave the cycle's top score (80) and a Gap of **4**, while every pain source is search-only. One source is the vendor's own blog, and there is a single refund review. The analyst also described that review as "manually confirmed", which is not true: it was never fetched. The scan itself recorded counter-evidence ("automatic tracking is the main draw").

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 H | **4 M** | The category is clearly real (MileIQ, Gridwise, Everlance, TripLog), but nothing was fetched. Demand for *manual-only* tracking is niche. |
| Gap | 4 M | **2 L** | **Stride is a free mileage tracker with no subscription and no trip cap, and it produces IRS-style reports.** Several 2026 roundups describe it that way, and DoorDash promotes it to drivers ([Ride Share Guy](https://therideshareguy.com/day-5-what-are-the-best-apps-to-track-your-mileage/), [hackceleration](https://hackceleration.com/labs/best/mileage-tracker-app), [Gridwise comparison](https://gridwise.io/blog/gridwise-vs-everlance-vs-stride); all search-only, partly vendor sources). A paid one-time manual log competes against a free tool with automatic tracking. The subscription-fatigue wedge mostly disappears. |
| Ease | 5 H | 5 H | No change. |
| Monetization | 4 H | **3 M** | Studio rule: one-time unlock = 3. Drivers already pay Gridwise, but a free Stride caps the price people will pay. |
| Competition | 3 M | **2 M** | These are established, funded players, plus a free leader that earns money from referrals rather than from users. |
| Retention | 3 M | 3 M | No change. Daily logging for active drivers, but manual entry is the churn risk. |
| Risk | 4 H | 4 M | Score unchanged, confidence drops to M. Tax-adjacent: the export must not claim to be "IRS-compliant" or to "match Schedule C" in store copy. Use "for your records". |

- Calc: (4·.2 + 2·.2 + 5·.2 + 3·.1 + 2·.1 + 3·.1 + 4·.1) ÷ 5 × 100 = **68**.
- What would raise it: fetched store reviews showing drivers rejecting GPS trackers (battery, privacy, inaccuracy) *and* rejecting Stride. Or reposition it as part of a "self-employed pack" with `freelancer-time-log` and `tax-receipt-folder`, where the export bundle is the value.
- Platforms line is correct. `payments [y]` = store in-app purchase only.
- Gates: originality PASS. Tax-adjacent flag (record-keeping only).
