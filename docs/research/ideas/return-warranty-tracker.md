# return-warranty-tracker

**Working name:** ReturnSafe
**Pitch:** Track return deadlines and warranty end dates for your purchases — manual entry with receipt photo, all on-device, one-time purchase.

---

## Target user and job-to-be-done

**User:** Online shoppers (regular Amazon/retail buyers) and holiday gift purchasers who need to remember return windows and warranty expiry dates.
**JTBD:** "Make sure I don't miss a return deadline or let a warranty expire without me knowing — without creating an account or giving my email to a stranger."

---

## Differentiator

The scan found:

1. **Seasonal demand spike:** Holiday return windows run into January; Amazon allows returns until Jan 31 for most Nov–Dec purchases, retailers differ [search only](https://www.inkl.com/news/five-steps-to-organize-your-holiday-returns).
2. **No pain signals fetched** — the newcomer apps (Return Tracker, ReturnWindow, Return Keeper, Wrnty) have few or no ratings, so quality of the field is unproven. Pricing is mixed: some subscription ($4.99/month), some one-time ($2.99), some email-scanning (privacy cost).
3. **The gap is in combining return + warranty tracking** — most apps do one or the other, and none are well-established.

**ReturnSafe closes this by:** unifying "return by" and "warranty until" in one view, adding a calendar-free reminder flow (notification N days before deadline), and keeping everything local — no email scanning, no account.

---

## MVP feature list

1. **Item entry** — product name, store, purchase date, return deadline, warranty end date, price paid, receipt photo.
2. **Dual reminder system** — configurable push notifications: "return deadline in X days" and "warranty expiring in X days."
3. **Dashboard view** — sorted list showing upcoming deadlines, color-coded by urgency (red = within 7 days, amber = within 14, green = later).
4. **Receipt photo** — capture or attach a photo for each item, stored locally.
5. **Local storage only** — all data on-device via SQLite. No account, no sync.
6. **CSV export** — export all items to CSV for personal backup or accountant use.

**Deliberately left out:**
- Email scanning for automatic return detection (privacy-heavy, requires email APIs, Ease penalty).
- Barcode/ISBN scanning (nice-to-have, adds camera + API complexity; v2).
- Multi-device sync (not core to a personal tracker).
- Price-drop alerts or deal tracking (out of scope; different app).
- Shared household view (v2 scope).

---

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local-first:** SQLite for item storage with photo blobs. No backend — removes server costs, sync complexity, and data hosting.
- **Notifications:** local push for deadline reminders. Standard notification scheduling on both platforms.
- **Payments:** single one-time purchase via StoreKit (iOS) / Billing Library (Android). No subscription management.
- **APIs:** none required. All data is user-entered.
- **Flag:** nothing technically hard. Photo storage is local only. CSV export is a standard serialization. The dual-reminder system is just two notification tracks per item.

---

## Ease-of-development estimate

**Ease score: 5** — 1–2 weeks MVP.

Reasoning: Standard CRUD app with local SQLite, photo storage, notification scheduling, and CSV export. No sync, no external APIs, no payment backend. The dual-deadline logic is straightforward date comparison. Two platforms but both are thin mobile shells over the same data model. Matches Ease-5 rubric exactly: "~1–2 weeks, standard CRUD + local storage, notifications."

**Estimated MVP time:** ~8–12 calendar days for a single developer (or ~5 days per platform with parallel mobile devs).

---

## Monetization idea

**One-time purchase** at $2.99–$3.99. This matches the pricing of existing one-time return-trackers (Return Keeper at $2.99) while positioning below subscription alternatives ($4.99/month). The seasonal nature means users want a no-strings-attached purchase.

Future seasonal pricing strategy: launch 4–6 weeks before Black Friday to capture holiday return demand, then maintain year-round utility via warranty tracking.

---

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | H | 20+ apps in return/warranty tracking category; holiday return season drives real demand [scan entry 12]. |
| **Gap / Differentiation** | 3 | M | Combined return+warranty view is novel, but no direct pain signals were fetched; field quality is unproven. |
| **Ease of development** | 5 | H | Plain CRUD + local storage + photos + notifications. Ease-5 rubric match. |
| **Monetization** | 4 | H | One-time purchase proven in category ($2.99 Return Keeper); seasonal launch timing supports conversion. |
| **Competition** | 4 | H | Fragmented field — all competitors are new with few/no ratings; no entrenched player to displace. |
| **Retention** | 2 | M | Heavily seasonal (Nov–Jan return window); warranty tracking helps year-round but is lower-frequency. |
| **Risk** | 4 | H | No regulated data, local-only storage, no sensitive information beyond personal purchase records. |

**Opportunity Score calculation:**

```
(4×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 4×0.10 + 2×0.10 + 4×0.10) ÷ 5 × 100
= (0.80 + 0.60 + 1.00 + 0.40 + 0.40 + 0.20 + 0.40) ÷ 5 × 100
= 3.80 ÷ 5 × 100
= **76**
```

**Threshold:** 76 → **Strong** (≥ 75). Shortlist candidate.

---

## Risks and originality check

### §3 Originality gate: **PASS**

- Name "ReturnSafe" is original (not copying Return Tracker, ReturnWindow, Return Keeper, Wrnty, etc.).
- Positioning is "combined return + warranty, local-first, one-time" — not a "clone of X."
- No scraping or reuse of any proprietary data.
- No regulated territory (personal purchase records, no financial advice, no health data).

### Key risks

1. **Seasonal demand is the biggest risk (L confidence on Retention):** The app's primary value is Nov–Jan. Outside holiday season, warranty tracking is the only retention hook — but users check warranties infrequently. This is the weakest criterion (score 2).
2. **No pain evidence fetched:** The scan explicitly states "none fetched" for pain signals. The opportunity rests on market size + pricing gap, not on verified complaints.
3. **Overlap with tax-receipt-folder:** Both apps capture receipt photos and store locally. If the owner pursues both, a unified "personal finance toolkit" brand could reduce confusion but adds coordination cost.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 68 (analyst 76).** **Parked.** It has **L on both Demand and Gap**.

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 H | **3 L** | "20+ apps exist, almost all new with few or no ratings" is evidence of *supply*, not demand. If anything, unrated apps suggest weak pull. The seasonal claim comes from one search-only article. Nothing was fetched. |
| Gap | 3 M | **3 L** | The scan says no pain was fetched, so M isn't supported. Whether the combined return-plus-warranty view is novel is unverified. |
| Ease | 5 H | 5 H | No change. |
| Monetization | 4 H | **3 L** | Studio rule: one-time unlock = 3. The $2.99 Return Keeper price is search-only. Seasonal use limits the upside. |
| Competition | 4 H | **3 M** | The field is fragmented, but it's crowded (20+ apps), and free substitutes (calendar reminders, notes) cover the need. H isn't allowed on search-only evidence. |
| Retention | 2 M | 2 M | No change. |
| Risk | 4 H | 4 M | Score unchanged, confidence drops to M. Receipt photos can show partial card details. Local storage reduces the risk. |

- Calc: (3·.2 + 3·.2 + 5·.2 + 3·.1 + 3·.1 + 2·.1 + 4·.1) ÷ 5 × 100 = **68**.
- Timing: today is 2026-11-06. A store release after build, QA and store review lands around mid-to-late December, which only catches the tail of the January return window. Re-score in Sep 2027 with fetched reviews. Alternatively, fold the "warranty until" field into `tax-receipt-folder` if that one ships.
- Platforms line is correct. `payments [y]` = store in-app purchase only.
- Gates: originality PASS. No regulated flags.
