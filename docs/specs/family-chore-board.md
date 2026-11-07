# HiveBoard — Family Chore Board

> **Full track** (owner override 2026-11-07; Ease 5 would default to Lite) · Estimated MVP: ~10–14 days of build plus design time
> "HiveBoard" is the working name. See `docs/specs/family-chore-board.naming.md` (not clearly taken; low-to-medium risk).
> AC numbers AC-1..AC-33 are stable (existing design doc refers to them). New criteria are AC-34 and up.

---

## 1. Problem & Goal

A parent manages household chores for 1–4 children (ages ~4–12) on a single shared family tablet. Existing chore-chart apps charge monthly subscriptions, cap the number of children, or require creating accounts for each kid. **HiveBoard** fills that gap: a one-time-purchase, local-only chore board where parents assign age-appropriate chores, kids tap to complete them, and a point-based reward system keeps motivation high. There are no subscriptions, no accounts, and no child data leaving the device. The app is published in the **App Store Kids category** and **Google Play "Designed for Families"**, so it must be trustworthy for parents and delightful for kids: the look, motion and sound are a core part of the product, not decoration. This matters because subscription fatigue is real among families, and parents want a frictionless tool that "just works" on the one tablet kids already use.

---

## 2. User Stories

| # | Story |
|---|-------|
| US-1 | As a **parent**, I want to set a 4-digit PIN so that only I can configure children, chores, rewards, purchases and external links. |
| US-2 | As a **parent**, I want to add up to 4 children (first name + age) so that each has their own chore list. |
| US-3 | As a **parent**, I want to create chores with point values (e.g., "Make bed" = 5 pts) so that I can assign meaningful tasks. |
| US-4 | As a **parent**, I want to configure a reward chart (e.g., "Ice cream outing" costs 100 pts) so that kids have goals to work toward. |
| US-5 | As a **parent**, I want a weekly rotating schedule, with the week's reset day set to Monday by default and changeable, so that chores repeat automatically and match my family's week. |
| US-6 | As a **parent**, I want to export my family data as JSON so that I can restore it on a new device. |
| US-7 | As a **child**, I want large, icon-driven tap targets so that I can mark chores done without reading. |
| US-8 | As a **child**, I want to see my point total and a progress bar toward my next reward so that I feel motivated. |
| US-9 | As a **child**, I want to redeem earned points for a reward so that completing chores feels rewarding. |
| US-10 | As a **parent**, I want a 14-day free trial with full access, then a free demo mode (1 child, 3 chores), so that I can evaluate the app properly before purchasing. |
| US-11 | As a **parent**, I want to unlock the full app with a one-time in-app purchase so that I never pay a recurring fee. |
| US-12 | As a **parent**, I want to choose how often points reset (Never, Weekly, Monthly, Quarterly) so that point totals stay meaningful for my family. |
| US-13 | As a **child**, I want playful animations, sounds and vibration when I finish a chore or redeem a reward so that using the app feels fun. |
| US-14 | As a **parent**, I want to mute sounds so that the app is quiet when needed. |
| US-15 | As a **parent of young children**, I want the app to contain no ads, tracking or unprotected purchase and external-link paths so that I can trust it with my kids. |

---

## 3. Acceptance Criteria

### PIN & Parent Gate
- **AC-1:** On first launch, the app prompts the parent to set a 4-digit numeric PIN.
- **AC-2:** The PIN must be **exactly 4 digits**; all-four-same digits are allowed.
- **AC-3:** Returning to the parent area from the kid view requires re-entering the PIN.
- **AC-4:** After 5 consecutive incorrect PIN entries, the app waits 30 seconds before allowing another attempt.
- **AC-34:** The PIN is the only authentication method. There is no biometric option.

### Children Management
- **AC-5:** In demo mode (trial expired, not purchased), exactly 1 child slot is available.
- **AC-6:** In unlocked mode or during the trial, up to 4 child slots are available.
- **AC-7:** Each child requires a first name (1–20 chars) and an age (4–12).
- **AC-8:** Adding a 5th child in unlocked mode shows an error: "Maximum of 4 children reached."
- **AC-9:** Deleting a child shows a confirmation dialog; that child's completed chores **and redemptions** are deleted.

### Chore Creation
- **AC-10:** In demo mode, exactly 3 chore slots are available.
- **AC-11:** In unlocked mode or during the trial, chores are unlimited.
- **AC-12:** Each chore has a name (1–50 chars), a point value (1–500), and is assigned to one or more children.
- **AC-13:** An optional emoji/icon picker accompanies chore creation.
- **AC-14:** Editing a chore updates it for all children it is assigned to.

### Weekly Schedule & Reset Day
- **AC-15:** Chores can be tagged with one or more days of the week (Mon–Sun).
- **AC-16:** The weekly schedule resets at midnight local time at the start of the configured reset day. The default reset day is **Monday**.
- **AC-35:** Settings has a "Week starts on" option (Mon–Sun) that the parent can change. Changing it applies from the next occurrence of the new day and does not delete any data.
- **AC-17:** Completed chores on the current day show a green check mark; unchecked chores are gray.

### Rewards
- **AC-18:** Each reward has a name, point cost (1–1000), and optional emoji.
- **AC-19:** A child can redeem a reward only if their current points >= reward cost.
- **AC-20:** Redeeming deducts points and shows a celebration screen (see UX moments and AC-44).
- **AC-21:** In demo mode, rewards are visible but cannot be redeemed. The child sees "Ask a grown-up to unlock rewards" and no purchase button (the purchase flow is reachable only from the PIN-protected parent area).

### Points & Points Reset
- **AC-36:** By default points accumulate indefinitely until spent on rewards.
- **AC-37:** Settings has a "Reset points" option: **Never** (default), **Weekly**, **Monthly**, **Quarterly**. The choice is global, not per child.
- **AC-38:** Reset boundaries (00:00 local time): Weekly = the configured reset day; Monthly = the 1st of each month; Quarterly = 1 Jan, 1 Apr, 1 Jul, 1 Oct.
- **AC-39:** At a reset boundary, each child's **unredeemed point balance is set to 0**. Completed-chore history and past redemptions are kept. Earned-points history before the reset is not editable.
- **AC-40:** If one or more boundaries pass while the app is closed, the reset is applied once at the next launch (no double-reset).
- **AC-41:** Selecting a reset frequency shows a warning: "Unspent points will be set to 0 at the start of each {period}. Continue?" Changing the frequency never resets points immediately.
- **AC-42:** When a reset has occurred, the parent dashboard shows once: "Points were reset on {date}. {Name}: {n} pts cleared." (per child, dismissible).

### Free Trial, Demo Mode & Purchase
- **AC-43:** The app starts a **14-day free trial** with full access (up to 4 children, unlimited chores, redemption enabled) on first launch. The trial start date is stored on the device (local database). No network or account is needed.
- **AC-22:** After the trial ends without purchase, the app enters demo mode: 1 child, 3 chores, no redemption; other features stay visible but locked behind a "Get Full Access" prompt (parent area only).
- **AC-45:** When the trial ends, no data is deleted. The oldest child and the 3 oldest chores stay active. Additional children and chores are kept but shown locked (dimmed, no completion or editing) until purchase, and unlock immediately on purchase.
- **AC-46:** The parent area shows trial status: "{n} days left in your free trial" while in trial, and a dismissible reminder 3 days before expiry. Kids never see trial or purchase messaging.
- **AC-23:** "Get Full Access" opens the store's in-app purchase flow ($4.99 one-time) only after a successful PIN entry (parental gate).
- **AC-24:** After successful purchase, all demo limits are removed immediately and the trial UI disappears.
- **AC-25:** If the purchase fails or is cancelled, the user returns to the previous mode without data loss.
- **AC-26:** Purchase state is restored on app re-launch via StoreKit / Play Billing restore API. A "Restore purchase" button is in Settings.
- **AC-47:** If the device clock is set backwards, the trial never gains time (the app keeps the latest-seen date and counts elapsed time from it). Trial reset by reinstall is accepted (see Decisions log).

### Local Backup / Restore
- **AC-27:** The parent area has an "Export Data" button that generates a JSON file.
- **AC-28:** The generated file can be shared via the system share sheet (AirDrop, Files, etc.).
- **AC-29:** The parent area has an "Import Data" button that reads a JSON file from the system picker.
- **AC-30:** Import replaces all existing data after a confirmation warning. Import does not restore or extend the trial or purchase state.

### Sound & Haptics
- **AC-48:** The app plays the sound cues in section 4a for the matching events.
- **AC-49:** Settings has a "Sounds" toggle (default on). When off, no sound cue plays anywhere. The setting persists.
- **AC-50:** Sounds respect the device silent/mute switch and never play over other audio (ambient behavior).
- **AC-51:** Haptic feedback fires on chore completion (light tick), reward redemption (success pattern) and PIN error. Haptics follow device settings and are skipped on devices without a haptic engine.

### Kids Category & Family Compliance
- **AC-52:** The app contains **no third-party analytics, advertising, attribution, crash-reporting-with-identifiers or tracking SDKs**. The in-app purchase uses the native StoreKit / Play Billing flows without a third-party purchase backend that collects data.
- **AC-53:** The PIN parental gate protects the entire purchase flow, the restore-purchase action, and every external link (privacy policy, support, store review). No external link or purchase path is reachable from the kid view.
- **AC-54:** A privacy policy is published at a public URL and linked from the store listings and from the Settings > About screen (the link is behind the PIN gate).
- **AC-55:** The store listings declare the Kids age band chosen by the owner (see Open questions) and the Data Safety / App Privacy forms declare "no data collected".
- **AC-56:** The app has no ads, no social features, no user-generated content shared outside the device, no links out, and no behavioral prompts that pressure kids to buy.
- **AC-57:** The app does not request any permission other than notifications (requested only from the parent area, only when the parent turns the reminder on) and file access via the system picker for import/export.

### Accessibility & Motion
- **AC-58:** All tap targets are at least 48 × 48 pt.
- **AC-59:** If the device has "Reduce Motion" enabled, large animations are replaced with simple fades and static states, and the sound and haptics behavior is unchanged.
- **AC-60:** Text and key icons meet WCAG AA contrast, and information is never conveyed by color alone (a check also has a shape).

### Data Privacy
- **AC-31:** No network calls are made except for store purchase verification and restore.
- **AC-32:** All data is stored in on-device SQLite.
- **AC-33:** The app's privacy policy states: "No data is collected or transmitted."

---

## 4. Scope

### In Scope (MVP)
- Parent PIN lock (4 digits, PIN only)
- Child profiles (first name + age, up to 4)
- Chore CRUD with point values and emoji icons
- Weekly rotating schedule (Mon–Sun), configurable week-start/reset day, default Monday
- Kid completion view (tap to mark done)
- Point tracker, reward chart, reward redemption
- Points reset frequency setting (Never / Weekly / Monthly / Quarterly)
- 14-day local free trial, then demo mode (1 child, 3 chores)
- One-time $4.99 in-app purchase unlock, with restore
- Local JSON export/import backup
- Local daily notification ("Time to check your chores!"), toggleable by parent, default off
- Sound effects (cue list in 4a) with a parent mute toggle; haptics on key moments
- Kids-category compliance (AC-52..AC-57)
- Full design pass: tokens, motion spec, screens (owned by `ui-ux-designer`)

### Out of Scope ("Later")
- Sync across multiple devices
- Multi-language support (English only for MVP)
- Avatars with characters or story-driven gamification (the animation and celebration moments listed in section 6.2 are in; collectible/animated characters are not)
- Calendar integration (Google Calendar, Apple Calendar)
- Push notifications or parent push alerts
- Photo capture for chore completion proof
- Age-based chore suggestions or templates
- Biometric parent lock
- Per-child points reset frequency
- Background music or voice-over
- Haptics toggle separate from the system setting
- Server-side trial or receipt validation

### 4a. Sound cue list (produced by Creative Studio: `creative-director` leads, `copy-voice` produces)

Style direction: warm, playful, gentle (not shrill; parents will hear these hundreds of times). Short, no spoken words unless noted, consistent "hive/honey" family of timbres (soft marimba, pops, chimes). Each cue is delivered in the format the architect specifies, normalized to the same loudness, with a total pack size budget set by the architect.

| Cue ID | Trigger | Length | Notes |
|--------|---------|--------|-------|
| `ui_tap` | Generic button/avatar tap | < 0.15 s | Very soft; must not annoy on repetition |
| `ui_back` | Back / close | < 0.15 s | Softer variant of `ui_tap` |
| `pin_key` | PIN digit entered | < 0.1 s | Parent area only |
| `pin_success` | Correct PIN | ~0.4 s | Gentle unlock |
| `pin_error` | Wrong PIN | ~0.4 s | Low and soft, not scary |
| `chore_complete` | Child taps a chore to done | ~0.6 s | The most-heard sound; rewarding pop plus sparkle |
| `chore_undo` | Chore marked not done | ~0.3 s | Neutral |
| `points_fly` | Points travel to the total | ~0.5 s | Rising sweep, syncs with animation |
| `points_tick` | Counter increments | < 0.1 s per tick | Repeatable, pitch rises with each tick |
| `progress_fill` | Progress bar fills toward reward | ~0.6 s | Soft rising tone |
| `milestone` | A reward becomes affordable, or all of today's chores are done | ~1.2 s | Small fanfare |
| `reward_redeem` | Reward redeemed celebration | ~2.5 s | Biggest cue: cheerful fanfare with confetti pops |
| `reward_locked` | Child taps a locked/unaffordable reward | ~0.3 s | Gentle "not yet", encouraging |
| `onboarding_welcome` | Welcome screen intro | ~1.5 s | Buzz-and-chime brand sting |
| `purchase_success` | Full Access unlocked | ~1.2 s | Parent area; short celebratory chime |

---

## 5. Platforms & Needs

```
Platforms & needs: web [n] · iOS [y] · Android [y] · accounts/sync [n] · payments [y] · external APIs [none] · Track: Full
```

Staffing is unchanged (mobile-dev, qa, reviewer, devops; no backend). Track changed from Lite to Full by owner decision, so `ui-ux-designer` joins the Team and the existing design.md needs a revision by `architect`.

---

## 6. UX

The `ui-ux-designer` **owns** design tokens, the motion spec, and screen designs in `docs/specs/family-chore-board.ux.md`. This spec states goals, the screen inventory and the moments that must be designed; it does not prescribe colors, type, spacing or layouts. The designer has creative latitude, including the visual identity of "HiveBoard".

### 6.1 UX Goals

1. **Appealing first.** The app should look like a premium kids' product that a parent is proud to leave on the family tablet. The owner wants a "heavy hand" from design.
2. **Delightful and alive.** Motion and sound reward every meaningful action, are fast (never block the child), and feel physical (springs, squash-and-stretch, particles).
3. **Intuitive for a 4-year-old.** A child who cannot read must complete a chore without help: big icons, one obvious action per screen, no deep navigation in the kid area.
4. **Calm and efficient for the parent.** The parent area is clean and quick, with clear separation from the kid area (a clearly different look/mood is welcome).
5. **Accessible.** 48 × 48 pt minimum targets, AA contrast, Reduce Motion support (AC-58..AC-60), and nothing conveyed by color alone.
6. **Kids-category safe.** No dark patterns; the kid area never shows prices, trial messaging or external links.
7. **Performance.** Animations at 60 fps on a mid-range tablet; the app is usable immediately, with no animation blocking input.

### 6.2 Moments that need animation / delight (designer to specify motion, timing, sound/haptic pairing)

| # | Moment | Paired cue | Expectation |
|---|--------|-----------|-------------|
| M1 | **Chore tick**: child taps a chore to done | `chore_complete`, light haptic | Satisfying check animation (not just a color change); chore card reacts; instant and undo-able |
| M2 | **Points fly to total**: "+n" points travel from the chore to the point total | `points_fly`, `points_tick` | Counter ticks up; the total reacts on arrival |
| M3 | **Progress bar fill** toward the next reward | `progress_fill` | Smooth fill; extra flourish when a reward becomes affordable (`milestone`) |
| M4 | **All of today's chores done** | `milestone` | Small celebration, "great job" state |
| M5 | **Reward redeem celebration** | `reward_redeem`, success haptic | Full-screen celebration (confetti/bees/honey), shows the reward, easy dismiss |
| M6 | **Onboarding**: welcome, PIN setup, adding the first child, chore and reward | `onboarding_welcome`, `pin_success` | Friendly guided flow with motion; explains the product in a few steps; ends in a populated, inviting state |
| M7 | **Screen transitions**: kid home to kid view, to rewards, to parent PIN | `ui_tap`, `ui_back` | Consistent, quick transitions that show where you are |
| M8 | **PIN entry feedback** | `pin_key`, `pin_error`, `pin_success` | Dots fill; gentle shake on error |
| M9 | **Empty states** | none | Illustrated/animated, with a clear next step |
| M10 | **Locked reward / not enough points** | `reward_locked` | Encouraging nudge showing how many points remain |
| M11 | **Purchase success** (parent) | `purchase_success` | Brief celebration; limits visibly lift |
| M12 | **Reset points notice** (parent) | none | Calm, clear summary, not alarming |

### 6.3 Screen Inventory (functional; layouts are the designer's)

| Screen | Purpose | Empty State | Loading State | Error State |
|--------|---------|-------------|---------------|-------------|
| **Welcome / Onboarding** | First launch intro, set PIN, first setup | N/A | None | N/A |
| **PIN Entry** | Gate between kid and parent views, purchases, links | N/A | None | "Incorrect PIN — try again"; after 5 failures, 30 s cooldown |
| **Parent Dashboard** | Overview: kids, points, today's completion, trial status | "Add your first child to get started!" | Skeleton | N/A |
| **Edit Children** | Add/edit/remove child profiles | "No children yet — tap + to add one." | N/A | "Name required", "Age must be 4–12" |
| **Edit Chores** | Create/edit chores, assign days and kids | "No chores yet — tap + to create one." | N/A | "Name required", "Points must be 1–500" |
| **Edit Rewards** | Create/edit rewards | "No rewards yet — set one as a goal!" | N/A | "Name required", "Cost must be 1–1000" |
| **Weekly Schedule** | Chore assignments per day for the current week | "No chores scheduled this week." | N/A | N/A |
| **Kid Home** | Child picks their profile | "Ask a grown-up to set up children." | N/A | N/A |
| **Kid Chore View** | Today's chores: tap to complete | "No chores for today — you're all set!" | Skeleton | N/A |
| **Reward Screen** | Point total, progress, redeemable rewards | "Complete chores to earn points!" | N/A | N/A |
| **Reward Celebration** | Redeem confirmation (M5) | N/A | N/A | N/A |
| **Settings** | PIN change, week-start day, points reset, sounds, reminder, backup, restore purchase, privacy policy and about | N/A | N/A | "Import failed — check file format" |
| **Full Access (paywall)** | Parent-only purchase screen after PIN | N/A | Store sheet loading | "Purchase didn't go through. You haven't been charged." |

### 6.4 Main Flow

```
First Launch (trial starts silently) -> Onboarding -> Set 4-digit PIN (twice)
  -> Parent Dashboard (guided: add child, chore, reward)

Daily Use: App opens -> Kid Home -> child taps their profile -> Kid Chore View
  -> tap chore (M1, M2, M3) -> Reward Screen -> Redeem (M5)
  -> "Parent Area" -> PIN Entry -> Parent Dashboard -> Settings / edit / purchase
```

### 6.5 Key UX Copy (draft; designer and copy-voice may refine tone)

| Element | Copy |
|---------|------|
| Welcome title | "Welcome to HiveBoard" |
| Welcome subtitle | "Your family's chore chart — simple, private, one-time purchase." |
| PIN setup prompt | "Create a 4-digit PIN to protect the parent area." |
| PIN confirm | "Re-enter your PIN to confirm." |
| Empty parent dashboard CTA | "Add your first child to get started!" |
| Empty chore list (kid view) | "No chores for today — you're all set!" |
| Empty rewards (kid view) | "Complete chores to earn points!" |
| Chore completed | "Great job! +{n} pts" |
| Reward redeemed title | "Reward Redeemed!" |
| Reward redeemed subtitle | "{reward name} is yours!" |
| Reward locked in demo (kid) | "Ask a grown-up to unlock rewards." |
| Full Access title | "Unlock the Full HiveBoard" |
| Full Access body | "Add up to 4 children and unlimited chores with a one-time purchase. No subscription, no ads." |
| Full Access CTA | "Get Full Access — $4.99" |
| Trial status (parent) | "{n} days left in your free trial" |
| Trial ended (parent) | "Your free trial has ended. HiveBoard is in demo mode (1 child, 3 chores). Get Full Access to unlock everything." |
| Demo limit warning (children) | "Demo mode includes 1 child. Get Full Access for up to 4." |
| Demo limit warning (chores) | "Maximum of 3 chores in demo mode. Get Full Access for unlimited chores." |
| Sounds toggle | "Sounds" |
| Week start label | "Week starts on" |
| Points reset label | "Reset points" (options: Never, Weekly, Monthly, Quarterly) |
| Points reset warning | "Unspent points will be set to 0 at the start of each {period}. Continue?" |
| Points reset notice | "Points were reset on {date}. {Name}: {n} pts cleared." |
| Notification label | "Daily chore reminder" |
| Notification hint | "A gentle nudge each morning to check today's chores." |
| Import confirmation warning | "This will replace all current data. Continue?" |
| Delete child confirmation | "Remove {name}? Their completed chores and redeemed rewards will be deleted." |
| About screen legal | "HiveBoard — No data collected. Everything stays on this device." |

---

## 7. Open Questions

1. **Kids age band.** Apple's Kids category requires one band (5 and under, 6–8, 9–11). The app targets ages 4–12 with a parent buyer. Recommendation: "6–8". Owner to confirm. (Google Play "Designed for Families" also needs a target age group.)
2. **Name risk appetite.** HiveBoard is not clearly taken (see naming doc), but the "Hive" prefix is crowded. Is the owner comfortable launching after only a self-run tmsearch.uspto.gov check, or should a trademark attorney confirm first (cost)? Fallback name: TidyHive.
3. **Daily reminder in Kids apps.** Local notifications are kept (parent-enabled only, default off). The owner should confirm this is acceptable for Kids-category review, or drop it from MVP if the app-review risk is not wanted.

---

## 8. Decisions log

| Date | Question | Owner's decision | Spec impact |
|------|----------|------------------|-------------|
| 2026-11-07 | Age rating | App Store **Kids category** and Google Play **Designed for Families** | AC-52..AC-57: no third-party analytics/ads/tracking, PIN as parental gate for purchase and external links, privacy policy, age band |
| 2026-11-07 | Demo vs. trial | **14-day free trial** with full access, then demo limits unless purchased; $4.99 one-time unlock stays | AC-43, AC-45..AC-47, US-10. **Mechanism chosen:** trial start date stored locally on first launch (simplest, works identically on both stores, no account/network/server). **Trade-off:** reinstalling or clearing app data resets the trial; a backwards clock is neutralized (AC-47) but a determined user can still get another trial. Accepted for a $4.99 app. Alternatives considered: store-side free-trial offers do not apply cleanly to a non-consumable one-time purchase on both stores, and a server/receipt check conflicts with the no-backend, no-data goal |
| 2026-11-07 | PIN or biometric | **PIN only**, no biometrics | AC-34 |
| 2026-11-07 | Weekly reset day | Default **Monday**, parent can change in Settings | AC-16, AC-35 |
| 2026-11-07 | Point persistence | Accumulate forever by default; parent chooses reset frequency: **Never** (default), Weekly, Monthly, Quarterly | AC-36..AC-42. Unredeemed points are set to 0 at reset (decision by PM, to be confirmed by owner on review); history kept |
| 2026-11-07 | Trademark | Run a conflict check; keep HiveBoard unless clearly taken | `family-chore-board.naming.md`; HiveBoard stays; TidyHive is the top alternative |
| 2026-11-07 | Haptics and sound | **Yes to both**, with a parent mute toggle; sounds produced by Creative Studio | AC-48..AC-51, section 4a cue list; removed from Out of Scope |
| 2026-11-07 | Look and feel | Design team has a **heavy hand**; appealing, animated, intuitive. Moved to **Full design treatment** | Track: Full; section 6 rewritten to goals and moments; `ui-ux-designer` owns tokens, motion spec and screens in `family-chore-board.ux.md`; palette/type removed from this spec |
| 2026-11-07 | Spec fixes (from architect, design.md "Risks and trade-offs") | PIN is exactly 4 digits; kids demo-limit copy is "Demo mode includes 1 child. Get Full Access for up to 4."; deleting a child also deletes their redemptions | AC-2, AC-9, copy table |

### Owner final approval (2026-11-07)
Approved spec, design (ADR 0005) and UX with all recommendations: Kids age band 6-8; points reset zeroes unspent balance (history kept); name HiveBoard (self-check only, fallback TidyHive); daily reminder kept, default off; static mascot Pip yes; bundled emoji set yes; 'Get {reward}?' confirm before redeem yes; PIN re-asked before opening the privacy policy link yes.
