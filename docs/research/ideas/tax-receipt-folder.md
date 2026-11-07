# tax-receipt-folder

## Working name and pitch

**ReceiptCrate** — A local receipt photo folder with smart categories, CSV/PDF export for your accountant, and no OCR, no account, no subscription.

## Target user and job-to-be-done

- **Primary user:** Self-employed individuals, freelancers, and side-hustlers who need to collect and organize expense receipts for tax time.
- **JTBD:** "I want to snap a photo of every expense receipt, file it under a category my accountant recognizes, and export everything as a clean CSV or PDF at tax time — without paying a monthly subscription or trusting my data to the cloud."

## Differentiator

The scan identified **subscription fatigue and OCR failure** as the pain signals. Incumbents like Easy Expense (4.9★ but subscription-required), QuickBooks Self-Employed ($15/month per blog), and Receipto (OCR misreads, corrupted exports on Trustpilot) all lean on cloud services, subscriptions, and OCR.

ReceiptCrate's differentiator:

- **No OCR.** Deliberately dumb: photograph receipt → assign category → store locally. This avoids OCR misreads (a verified pain point), removes server costs, and eliminates privacy concerns.
- **One-time price (~$2.99–$4.99).** No subscription. Direct answer to the $9–$15/month pricing pain signal.
- **Accountant-friendly custom categories.** Not just "Deductible / Nondeductible" — user-configurable category groups matching their specific tax situation.
- **CSV + PDF zip export.** One-tap export that produces a summary spreadsheet and bundled PDF of all receipt images.
- **Local-first, no account.** Data never leaves the device. No cloud sync, no data breach risk.

## MVP feature list

1. **Camera capture + photo import** — snap a receipt or import from gallery, auto-stamped with date.
2. **Category assignment** — user-configurable categories (default presets: Supplies, Meals, Travel, Software, etc.). Tap to categorize.
3. **Receipt list with filters** — sortable by date, category, amount (manual entry optional).
4. **CSV export** — generates a spreadsheet with date, category, amount, notes, and filename references.
5. **PDF zip export** — bundles all receipt images as a single PDF with category grouping.

**Deliberately left out:**
- OCR / automatic data extraction (this is the differentiator, not a gap).
- Bank sync or credit card integration.
- Cloud sync or accounts.
- Mileage tracking (covered by gig-mileage-log in same cycle).
- Multi-currency or international tax support.
- Photo editing/cropping beyond basic preview.

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local storage only.** Camera roll / gallery for receipt photos; SQLite for metadata. No backend needed.
- **No sync, no accounts.** Core value is local-first privacy.
- **Notifications:** optional — daily or weekly nudge to "capture today's receipts." Local notification APIs only.
- **Payments:** one-time in-app purchase via StoreKit (iOS) / Billing Library (Android).
- **No external APIs.** Purely local app.
- **PDF generation:** needs a mobile PDF library (e.g., `react-native-pdf-lib` or native PDFKit/PDFRenderer). Feasible, not hard.
- **CSV generation:** trivial with local libraries.
- **Financial-adjacent flag:** record-keeping only, no tax advice, no calculation of deductions. Must include disclaimer in App Store description.
- **Nothing technically hard.** Camera access + local photo storage + CRUD + export = standard mobile app.

## Ease-of-development estimate

- **Rubric score: 5.** This is a ~1–2 week app: camera integration, local photo storage, CRUD for categories and receipts, CSV/PDF export. No backend, no sync, no external APIs. Fits rubric score 5.
- **Estimated MVP time:** ~12–16 days for a single mobile-dev (Expo/RN shared codebase for iOS + Android), plus QA and review. PDF generation adds a small complexity bump but is well-documented.

## Monetization idea

**One-time in-app purchase unlock (~$2.99).** Free tier: capture up to 10 receipts. Unlock for unlimited receipts, unlimited categories, and export features. This pricing matches The Christmas List's proven model ($2.99 one-time, 4.8★, ~5.1K ratings) and is well below the $9–$15/month competitors charge.

Alternate: seasonal urgency — launch in October to capture the pre-tax-season audience.

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 4 | H | Easy Expense has 4.9★ / ~2.5K ratings [fetched]; many receipt/mileage apps compete [search only]. Self-employed tax recording is a proven need. |
| **Gap / Differentiation** | 3 | M | OCR failure pain verified (Trustpilot [search only]). Subscription pricing pain plausible but no direct "too expensive" review fetched. No-OCR positioning is distinctive but may confuse users. |
| **Ease of development** | 5 | H | Camera + local storage + CRUD + CSV/PDF export. No backend, no APIs, no sync. Fits rubric 5. |
| **Monetization** | 4 | H | One-time IAP proven in adjacent categories. $2.99 price point validated by competitors. |
| **Competition** | 3 | M | Many apps in the field (Easy Expense, 1tap receipts, Receipto, Hurdlr), but most are subscription + OCR. Our no-OCR angle is defensible but also a feature gap for some users. |
| **Retention** | 3 | M | High use during tax season (Jan–Apr), lower use in summer. Annual spike pattern. Moderate retention. |
| **Risk** | 3 | M | Financial-adjacent: must avoid any tax advice language. "Record-keeping only" disclaimer required. No regulated data stored, but receipts may contain sensitive financial info — local-only mitigates this. |

**Opportunity Score calculation:**

```
(4×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 3×0.10 + 3×0.10) ÷ 5 × 100
= (0.80 + 0.60 + 1.00 + 0.40 + 0.30 + 0.30 + 0.30) ÷ 5 × 100
= 3.70 ÷ 5 × 100
= 74
```

**Opportunity Score: 74 / 100** (Promising — shortlist if room, otherwise Park)

## Risks and originality check

**§3 Originality gate:** ✅ Passes. ReceiptCrate uses its own name and branding. No copying of Easy Expense or any competitor's UI, assets, or copy. The no-OCR positioning is a deliberate product choice, not a clone.

**Risks:**
- **No-OCR may confuse users:** "Why can't it read my receipt?" — will require clear messaging in store listing and onboarding. Some users expect OCR as standard.
- **Seasonal demand spike:** Best launch window is October–November. Building in Nov–Dec misses the season. May need to wait or reposition for year-round use (side-hustlers file quarterly).
- **Category overlap with gig-mileage-log:** Both target self-employed users. Could be bundled as a "freelancer pack" but that adds complexity. For MVP, keep them separate.
- **PDF generation quality:** Needs testing across devices to ensure receipt images are legible in exported PDFs. Edge case: very large camera photos need compression.
- **Competition from free tools:** Spreadsheets + photo album is a "good enough" free alternative. Must convince users the app adds real value over a Notes folder.

## Calibration notes (rd-manager, cycle 2026-11-07)

**Calibrated Opportunity Score: 68 (analyst 74).** Rank 4 of this cycle.

| Criterion | Analyst | Calibrated | Why |
|---|---|---|---|
| Demand | 4 H | **4 M** | One fetched listing (Easy Expense, ~2.5K ratings). The rest is search-only. |
| Gap | 3 M | **3 L** | The OCR-misread pain is a search-only Trustpilot snippet. The single fetched critical note asks for more category groups, which is minor. No price complaint was fetched. |
| Ease | 5 H | **4 H** | The analyst's own estimate (12–16 days) is above the Ease-5 band of 1–2 weeks. Bundling photos into a PDF, compressing them and managing on-device image storage add work. Matches last cycle's 4. Still **Lite**. |
| Monetization | 4 H | **3 M** | Studio rule: one-time unlock = 3. Easy Expense's required subscription shows people pay in this category (M). |
| Competition | 3 M | **2 M** | Strong incumbents (Easy Expense 4.9★, QuickBooks, Expensify, Hurdlr) plus the free document scanners built into phones. Matches last cycle. |
| Retention | 3 M | 3 M | No change. |
| Risk | 3 M | **4 M** | Local-only, record-keeping, no advice. The financial-adjacent wording is handled in store copy. Matches last cycle. |

- Calc: (4·.2 + 3·.2 + 4·.2 + 3·.1 + 2·.1 + 3·.1 + 4·.1) ÷ 5 × 100 = **68**.
- Platforms line is correct (Track Lite, Ease 4). `payments [y]` = store in-app purchase only, no backend.
- Overlap: same audience as `freelancer-time-log` (cycle 1) and `gig-mileage-log` (this cycle). Receipt capture is shared with `return-warranty-tracker`, but the job to be done is different, so the ideas are **not merged**.
- Gates: originality PASS. **Financial-adjacent flag** (record-keeping only, no tax advice). Timing: the US tax season (Jan–Apr) is still reachable if it's approved this month.
