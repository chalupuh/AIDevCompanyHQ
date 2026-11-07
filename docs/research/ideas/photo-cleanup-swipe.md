# Photo Cleanup Swipe

## Working name and pitch

**PhotoSift** — A one-time-purchase photo cleanup tool that lets you swipe through your library month by month, keeping what matters and deleting the rest — entirely on-device, no subscription.

## Target user and job-to-be-done

**Target:** Smartphone users whose photo libraries have grown unwieldy (thousands of blurry, duplicate, or screenshot photos) and who are tired of aggressive cleaner apps.

**Job-to-be-done:** "I want to reclaim storage space by going through my photos methodically, without any app forcing me into a subscription or uploading my personal images."

## Differentiator

The scan identified a recurring complaint theme: cleaner apps are known for aggressive weekly subscription paywalls and upload-based processing. PhotoSift directly closes this gap:

- **One-time price, no subscription** — addresses the paywall complaint (scan §5 pain signals).
- **Fully local processing** — no uploads, so private photos never leave the device (addresses "privacy concerns" pain pattern from METHODOLOGY §2).
- **Monthly navigation** — instead of showing everything at once, users tackle one month at a time, making the task less overwhelming.

## MVP feature list

1. **Month-by-month browse view** — scroll or jump to any month/year to start cleaning.
2. **Swipe-left-to-delete / swipe-right-to-keep** gesture with haptic feedback.
3. **Review bin (30-day hold)** — deleted photos sit in a quarantine before final removal, with an "undo" option.
4. **Auto-detect duplicates** using on-device hash comparison (no ML, no upload).
5. **Storage progress bar** — shows before/after space reclamation in real time.
6. **Filter modes** — blur detection, screenshots, HEIC/large files — to focus cleanup passes.

**Deliberately left out:**

- Cloud sync / multi-device support (core value is local-only).
- AI-powered photo sorting or face recognition (too complex, privacy risk).
- Social sharing or photo export features.
- Any form of account or user registration.

## Platforms & needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Lite
```

**Technical notes:**

- **Local storage only:** all data (review bin state, filter preferences) stored via SQLite or on-device equivalents. No backend needed.
- **Push notifications:** optional — a weekly "cleanup reminder" nudge. Not core to the value.
- **Payments:** one-time in-app purchase (or free with no extras, since the pitch is ad-free). Simple, no subscription infrastructure.
- **APIs needed:** none external. Photo library access is OS-native.
- **⚠️ Platform-API risk (hard):** iOS `Photos` framework and Android `MediaStore` impose constraints:
  - iOS: deleting photos programmatically requires `PHPhotoLibrary.performChanges()` and Apple review scrutiny. The app must request explicit permission and explain why.
  - Android: scoped storage (API 29+) limits deletion to photos the app itself captured, unless using `MediaStore.ACTION_DELETE`. Workaround is possible but requires testing per Android version.
  - This is flagged as hard because platform API limitations could reduce the feature set or create App Store / Play Store review risk. Prefer iOS-first to validate.

## Ease-of-development estimate

**Rubric score: 4** (2–4 weeks standard CRUD + local storage + notifications — but photo API friction bumps it from a clean 5).

**Estimated MVP time: 3 weeks.**

Reasoning: The core UI (browse, swipe, review bin) is straightforward. Duplicate detection via hash is simple and on-device. The main complexity is navigating iOS/Android photo permission models and deletion APIs, which requires platform-specific work and thorough testing. A single iOS MVP would validate in ~2 weeks; adding Android pushes to ~3.

## Monetization idea

**Free core + one-time unlock.** The free version includes the swipe cleaner and review bin. A one-time $2.99 unlock adds filter modes (blur, screenshots, large files) and duplicate detection. This avoids the subscription fatigue that users complain about and is a proven model for utility apps.

Alternatively, the entire app could be a flat one-time price of $1.99 to maximize differentiation against subscription competitors.

## Score table

| Criterion | Score | Confidence | Justification |
|---|---|---|---|
| **Demand** | 3 | L | Photo storage-full is a real pain, but scan fetched no evidence; demand is assumption-only. |
| **Gap / Differentiation** | 4 | M | One-time price + fully local directly solves recurring "aggressive paywall" and "privacy" complaints. |
| **Ease of development** | 4 | M | Standard local CRUD, but photo library APIs add platform-specific complexity; still Lite-track. |
| **Monetization** | 4 | H | One-time unlock is a proven model for utility apps; no subscription infrastructure needed. |
| **Competition** | 4 | L | Cleaner apps are fragmented and low-rated; no entrenched giant in this exact niche. Assumption. |
| **Retention** | 2 | M | Primarily a periodic cleanup task (monthly/seasonal), not a daily habit; new photos accumulate slowly. |
| **Risk** | 4 | H | No regulated data, no children's data; platform API friction is technical, not legal. |

**Opportunity Score calculation:**

```
= (3×0.20 + 4×0.20 + 4×0.20 + 4×0.10 + 4×0.10 + 2×0.10 + 4×0.10) ÷ 5 × 100
= (0.60 + 0.80 + 0.80 + 0.40 + 0.40 + 0.20 + 0.40) ÷ 5 × 100
= 3.60 ÷ 5 × 100
= 72.0
```

**Opportunity Score: 72** (Promising — shortlist if room).

## Risks and originality check

### Originality gate (§3)

**PASSES.** PhotoSift is an original product in a proven category (photo cleanup utilities). No app's name, branding, or distinctive UI is being copied. The differentiator (one-time price, local-only, monthly navigation) is stated clearly. No scraping or reuse of proprietary content.

### Key risks

1. **Platform API limitations (medium-high):** iOS and Android photo permissions may restrict deletion capabilities. The MVP must verify that a user-initiated delete flow works on both platforms before committing. This is the biggest technical risk.
2. **Retention (medium):** This is inherently a periodic-use app. Without daily engagement, organic discoverability depends on ASO and seasonal campaigns (New Year cleanup, storage-full prompts).
3. **Demand unverified (medium):** The scan has no fetched evidence. Before building, the owner should verify that cleaner app reviews actually cite subscription fatigue as a top complaint.
4. **App Store category competition (low-medium):** The Utilities/Photography category is crowded. A strong icon, clear "no subscription" messaging, and a few five-star reviews will be critical for initial traction.

---

## Calibration notes (rd-manager, cycle 2026-11-07)
- **Gap 4 M -> 3 L:** cycle-wide cap (no fetched evidence). The swipe-to-keep/delete mechanic is common in this category, and free, no-subscription cleaners are believed to exist (*assumption*, unverified). So "one-time price" is not a guaranteed edge.
- **Competition 4 L -> 2 L:** the analyst's "fragmented, no entrenched giant" contradicts the scan, which says several cleaner apps sit in the Utilities charts. A charting category full of look-alike swipe apps is crowded, not fragmented.
- **Monetization 4 H -> 3 M:** H confidence needs evidence, and none was fetched. A one-time unlock with no evidence of willingness to pay scores 3 this cycle.
- **Risk 4 H -> 4 M:** Apple/Google review of bulk-delete flows is unverified, so confidence is lowered.
- **Ease stays 4 M, on a condition:** MVP feature 6 ("blur detection") is image analysis, which pushes toward the rubric's "media processing" (Ease 2). Duplicate detection should stay exact-hash only, or be cut. The MVP for Ease 4 is: month browse, swipe, review bin, storage counter, screenshot/large-file filters from metadata.
- Platforms & needs line checked: correct. iOS-first is advised, Lite.
- **Recomputed:** (3·.2 + 3·.2 + 4·.2 + 3·.1 + 2·.1 + 2·.1 + 4·.1) ÷ 5 × 100 = **62** (was 72).
