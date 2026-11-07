# Trip Packing List

**Working name:** PackRight
**Pitch:** A fully offline, account-free packing list app built from reusable trip-type templates that learns from your past trips—so you never forget a charger again.

---

## Target user and job-to-be-done

**Target user:** Casual to frequent travelers (1–4 trips/year) who currently use mental checklists, notes apps, or ad-heavy packing apps.

**Job-to-be-done:** "Before every trip, I need a personalized checklist that covers everything I need for this type of trip—without signing up for an account or wrestling with paywalls."

---

## Differentiator

| Pain signal (scan.md) | How PackRight closes the gap |
|---|---|
| Free packing apps lean on ads | Zero ads, ever. One-time unlock for extras. |
| Free packing apps require accounts | Fully offline, no account. All data local. |
| Free packing apps have paywalled templates | Core templates (weekend, beach, business, camping, winter) ship free. Extra templates one-time purchase. |
| Users rebuild lists from scratch each trip | "Copy from last trip" and a trip-history system so you only tweak, never start over. |

The specific gap: **a packing-list app that treats your past trips as the real value, not a premium upsell.**

---

## MVP feature list

1. **Template library** — 5 built-in trip templates (weekend, beach, business, camping, winter) covering ~30–50 items each.
2. **Trip builder** — create a new trip from a template; add/remove items, add per-person variants.
3. **Check & copy-forward** — check off items while packing; after trip, save as "last trip" for one-tap reuse.
4. **Offline mode** — everything stored in SQLite/WASM local DB; no network calls.
5. **Export/share** — export a trip list as plain text or PDF to share with travel companions.

**Deliberately left out (MVP):**
- Cloud sync / multi-device (no backend needed; share via export instead).
- Smart suggestions / AI packing ("based on weather…") — deferred to V2.
- Social features or community templates — scope creep.
- In-app purchases for individual templates — all extras behind a single unlock.

---

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y: one-time IAP] · external APIs [none] · Track: Lite
```

**Technical notes:**
- **Local storage:** SQLite via SQLite Storage plugin in Expo/RN. Entire app is local-first; no sync needed.
- **Notifications:** Not needed for MVP. Packing happens before the trip, not on a recurring schedule.
- **Payments:** Single IAP unlock for extra templates. Uses expo-in-app-purchases (standard, well-documented).
- **APIs:** None. Weather integration could be V2 but is not in MVP.
- **Hard things:** Nothing technically difficult. The UX challenge is making the template system feel useful rather than cluttered. Template data can ship as bundled JSON.

---

## Ease-of-development estimate

**Ease score: 5** — standard CRUD + local storage + 5–6 screens. Matches the rubric: "1–2 weeks; local data, a few screens, notifications."

**Estimated MVP time: ~10 days (2 weeks)**
- Days 1–2: data model, template JSON, local DB schema.
- Days 3–5: template library and trip builder screens.
- Days 6–7: check-off flow, trip history, copy-forward.
- Days 8–9: export, polish, IAP integration.
- Day 10: QA pass, bug fix.

Reasoning: This is a list app with structured templates. No APIs, no sync, no real-time features. The entire data surface fits in one SQLite table plus a templates directory.

---

## Monetization idea

- **Free tier:** 5 core templates, unlimited trips, copy-forward, export.
- **One-time unlock (~$2.99):** 10+ additional templates (cruise, skiing, road trip, baby travel, digital nomad, etc.) and custom template creation.
- **Rationale:** The free tier is generous enough to install and try; the paid tier adds depth for repeat travelers. One-time price avoids subscription fatigue, which is a recurring complaint in this category.

---

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 3 | L | Packing apps are a known category, but no fetched evidence; *assumption* only. |
| **Gap / Differentiation** | 3 | M | Ad-free, no-account, copy-forward is a real differentiator vs existing ad-heavy apps; pain is *assumption* but plausible. |
| **Ease of development** | 5 | H | Pure local CRUD, 5 screens, no APIs or sync. textbook Lite-track app. |
| **Monetization** | 4 | M | One-time IAP for template packs is a proven micro-utility model. |
| **Competition** | 3 | L | Category is established but fragmented; several apps exist but none verified. Moderate competition. |
| **Retention** | 3 | M | Trip frequency is intermittent (1–4/year); not daily, but returns are predictable before each trip. |
| **Risk** | 5 | H | No regulated content, no sensitive data, purely personal lists stored locally. |

### Opportunity Score calculation

```
Opportunity Score = Σ (score × weight) ÷ 5 × 100

= (3×0.20 + 3×0.20 + 5×0.20 + 4×0.10 + 3×0.10 + 3×0.10 + 5×0.10) ÷ 5 × 100
= (0.60 + 0.60 + 1.00 + 0.40 + 0.30 + 0.30 + 0.50) ÷ 5 × 100
= 3.70 ÷ 5 × 100
= 74.0
```

**Opportunity Score: 74.0** — Promising (60–74 range).

---

## Risks and originality check

### Originality (§3 gate): ✅ PASS
- Working name "PackRight" is original (not taken from an existing app).
- No "clone of X" positioning; the differentiator (copy-forward + ad-free + local-only) is our own combination.
- Template content will be original checklists we write, not scraped.
- No regulated territory; no personal-data sensitivity beyond user's own packing choices.

### Key risks
1. **Retention gap:** Between trips, the app sits idle. May struggle with post-install churn. Mitigation: a "trip coming up?" push notification (if user enables) or a seasonal nudge.
2. **Differentiation may not matter:** If the top competing apps are already "good enough" and free (ads don't bother everyone), our gap narrows. The *assumption* tag on demand is the real risk.
3. **Seasonality:** Travel planning peaks around holidays and spring/summer. Timing of release matters.

---

*Confidence note: Demand and Competition are tagged L because no store pages or review sections were fetched. This idea benefits from a web-evidence pass before final ranking.*

---

## Calibration notes (rd-manager, cycle 2026-11-07)
- **Cycle-wide rule:** the scan fetched no evidence, so all pain is an *assumption*. Demand and Gap are capped at 3 with **L** confidence for every idea this cycle. Gap 3 M -> **3 L** (confidence only).
- **Monetization 4 M -> 3 L:** a one-time unlock with no evidence of willingness to pay scores 3 this cycle. That matches cycle 1, where the water tracker and the habit tracker both got Money 3. An app opened 1–4 times a year also gives few chances to upsell.
- **Retention 3 M -> 2 M:** use is episodic (1–4 trips a year). That matches photo-cleanup-swipe and holiday-gift-budget, which are both 2 for periodic use.
- **Overlap:** this is a travel-specific front end on the same mechanic as the parked cycle-1 `reusable-checklist-runner` and scan #11 `seasonal-home-checklist`. Not merged: the travel templates and copy-forward are a distinct job. If it is built, the checklist engine could later serve both of them.
- Platforms & needs line checked: correct (mobile, local, one-time IAP, Lite).
- **Recomputed:** (3·.2 + 3·.2 + 5·.2 + 3·.1 + 3·.1 + 2·.1 + 5·.1) ÷ 5 × 100 = **70** (was 74).
