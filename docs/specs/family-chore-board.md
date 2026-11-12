# HiveBoard — Family Chore Board

> **Full track** (owner override 2026-11-07; Ease 5 would default to Lite) · Estimated MVP: ~10–14 days of build plus design time
> "HiveBoard" is the working name. See `docs/specs/family-chore-board.naming.md` (not clearly taken; low-to-medium risk).
> AC numbers AC-1..AC-60 are stable (existing design doc refers to them). New criteria are AC-61 and up. Criteria changed by the 2026-11-11 scope change carry "(revised 2026-11-11)"; criteria added by it carry "(new 2026-11-11)". Each is tagged with the milestone (M3 or M4) it lands in.

---

## Scope change 2026-11-11: households

**Owner's words:** "As of right now the intent of the app looks to be for parents to track chores for kids. I also want this to be usable by families in general to track chores for everyone. Applicable to any situation. For example, if someone has a horse barn with applicable chores then the husband and wife can delegate recurring chores. Does not have to be just kids."

**Summary:** HiveBoard is no longer kids-only. "Children" become **Household members**, each of type **Kid** or **Adult**. Chores can be assigned to anyone, points and rewards are optional per member, and the PIN-protected area becomes the **Manager area**. All child-safety behaviour stays.

**Rules for this change (set by the Engineering Manager so the build plan is not disrupted):**
- Milestones 1 and 2 are built (schema with a `child` table, Children CRUD in the parent area, PIN-gated parent area, kid board routes). No M1/M2 criterion is removed or weakened. A **Kid member with "Earns points & rewards" ON behaves exactly like a "child" in the original criteria**, so M1/M2 acceptance results stay valid.
- Everything below lands in **Milestone 3 (board + settings)** or **Milestone 4 (trial/IAP + store setup)**. Screen and route names in UX are labels; renaming routes or tables is the architect's call and is not required.
- Still true and unchanged: 4-digit shared PIN (AC-2, AC-4, AC-34), weekly schedule and reset day (AC-15..17, AC-35), export/import, sound and haptics (AC-48..51), accessibility (AC-58..60), privacy and no tracking (AC-31..33, AC-52, AC-54, AC-56, AC-57), $4.99 one-time price, local-only data, no accounts, no sync.

| # | Change | Criteria | Milestone |
|---|--------|----------|-----------|
| C1 | Children become Household members with a type (Kid or Adult); age optional, Kid-only (4–12 kept for Kids) | AC-61, AC-63; revised AC-7 | 3 |
| C2 | Existing data and older backups migrate cleanly (existing children become Kids, points ON) | AC-62; revised AC-9 | 3 |
| C3 | Points and rewards optional per member (toggle, default ON for Kids, OFF for Adults); points-off members still tick chores, see progress and celebrations | AC-64, AC-65, AC-66, AC-67; revised AC-19, AC-21, AC-37, AC-39, AC-42 | 3 |
| C4 | Board shows all members; chores assignable to any members; recurring days unchanged | AC-68; revised AC-12, AC-14 | 3 |
| C5 | PIN area becomes the Manager area (any adult who knows the one shared PIN) | AC-69; revised AC-1, AC-3 | 3 |
| C6 | Neutral copy; kid-directed wording only for Kid members | AC-70 | 3 |
| C7 | Kid-safety rules (no prices, links, purchases outside the PIN gate) apply to the shared board for every member | AC-71; revised AC-53 | 3 |
| C8 | Optional onboarding step "What kind of household?" with 3 presets that only seed example chore suggestions (local, no network) | AC-72, AC-73, AC-74 | 3 |
| C9 | Full-access cap 4 to 8 members; demo keeps the oldest 1 member + oldest 3 chores | revised AC-5, AC-6, AC-8, AC-22, AC-43, AC-45, AC-46; AC-75 | 4 |
| C10 | Paywall, trial and demo copy say "members" and "8" | AC-76 | 4 |
| C11 | Store category moves from Kids / Designed for Families to a general category, keeping all child-safety behaviour (Owner open question 4) | AC-77; revised AC-55 | 4 |
| C12 | Store listing text, keywords and screenshots show households, not only children | AC-78 | 4 |

---

## 1. Problem & Goal

A household manager (a parent, a couple, roommates, or the owners of a farm or horse barn) needs to track recurring chores for **up to 8 household members, kids and adults**, on a single shared tablet or phone. Two typical users: a parent managing chores for 1–4 children (ages ~4–12), and a husband and wife who run a horse barn and want to delegate recurring chores (feed horses, muck stalls, fill water troughs) between themselves and a helper. Existing chore-chart apps charge monthly subscriptions, cap the number of members, require an account for each person, or assume the users are kids. **HiveBoard** fills that gap: a one-time-purchase, local-only chore board where a manager assigns recurring chores to anyone in the household, members tap to complete them, and an optional point-based reward system keeps motivation high (on by default for kids, off by default for adults). There are no subscriptions, no accounts, and no personal data leaving the device. Child-safety behaviour stays in force for everyone (PIN-gated purchases and links, no ads, no tracking SDKs), so it is still trustworthy for parents and delightful for kids: the look, motion and sound are a core part of the product, not decoration. This matters because subscription fatigue is real, and households of every shape want a frictionless tool that "just works" on the one shared device.

---

## 2. User Stories

| # | Story |
|---|-------|
| US-1 | As a **household manager (any adult)**, I want to set a 4-digit PIN so that only adults who know it can configure members, chores, rewards, purchases and external links in the Manager area. *(revised 2026-11-11)* |
| US-2 | As a **manager**, I want to add up to 8 household members (name, Kid or Adult, and an age for Kids) so that each person has their own chore list. *(revised 2026-11-11)* |
| US-3 | As a **manager**, I want to create chores with point values (e.g., "Make bed" = 5 pts) so that I can assign meaningful tasks. |
| US-4 | As a **manager**, I want to configure a reward chart (e.g., "Ice cream outing" costs 100 pts) so that members who earn points have goals to work toward. |
| US-5 | As a **manager**, I want a weekly rotating schedule, with the week's reset day set to Monday by default and changeable, so that chores repeat automatically and match my household's week. |
| US-6 | As a **manager**, I want to export my household data as JSON so that I can restore it on a new device. |
| US-7 | As a **Kid member**, I want large, icon-driven tap targets so that I can mark chores done without reading. *(revised 2026-11-11)* |
| US-8 | As a **member who earns points**, I want to see my point total and a progress bar toward my next reward so that I feel motivated. *(revised 2026-11-11)* |
| US-9 | As a **member who earns points**, I want to redeem earned points for a reward so that completing chores feels rewarding. *(revised 2026-11-11)* |
| US-10 | As a **manager**, I want a 14-day free trial with full access, then a free demo mode (1 member, 3 chores), so that I can evaluate the app properly before purchasing. *(revised 2026-11-11)* |
| US-11 | As a **manager**, I want to unlock the full app with a one-time in-app purchase so that I never pay a recurring fee. |
| US-12 | As a **manager**, I want to choose how often points reset (Never, Weekly, Monthly, Quarterly) so that point totals stay meaningful for my household. |
| US-13 | As a **member**, I want playful animations, sounds and vibration when I finish a chore or redeem a reward so that using the app feels fun. *(revised 2026-11-11)* |
| US-14 | As a **manager**, I want to mute sounds so that the app is quiet when needed. |
| US-15 | As a **parent of young children**, I want the app to contain no ads, tracking or unprotected purchase and external-link paths so that I can trust it with my kids, even though adults use the same board. *(revised 2026-11-11)* |
| US-16 | As a **manager**, I want to add an Adult member (no age needed) so that adults can have their own recurring chores on the same board. *(new 2026-11-11)* |
| US-17 | As a **manager**, I want to turn points and rewards on or off per member so that kids can earn rewards while adults simply tick off their chores. *(new 2026-11-11)* |
| US-18 | As a **member who does not earn points**, I want to tick chores and still see my progress and a "done for today" celebration so that the board is satisfying without points. *(new 2026-11-11)* |
| US-19 | As a **husband or wife running a horse barn**, I want to assign recurring chores (e.g., "Feed horses" every day, "Muck stalls" Mon/Wed/Fri) to either of us or to a helper so that nothing is forgotten and the work is shared fairly. *(new 2026-11-11)* |
| US-20 | As a **new user**, I want to say what kind of household I have (family with kids, couple/roommates, farm/barn/property) so that I get relevant example chores to start from. *(new 2026-11-11)* |
| US-21 | As **either adult in the household**, I want to open the Manager area with the same PIN so that we can both manage chores without creating accounts. *(new 2026-11-11)* |

---

## 3. Acceptance Criteria

### PIN & Manager Gate
- **AC-1:** On first launch, the app prompts the adult setting it up to set a 4-digit numeric PIN that protects the Manager area. *(revised 2026-11-11, M3: wording only)*
- **AC-2:** The PIN must be **exactly 4 digits**; all-four-same digits are allowed.
- **AC-3:** Returning to the Manager area from the board requires re-entering the PIN. *(revised 2026-11-11, M3: wording only)*
- **AC-4:** After 5 consecutive incorrect PIN entries, the app waits 30 seconds before allowing another attempt.
- **AC-34:** The PIN is the only authentication method. There is no biometric option.

### Household Members Management (formerly Children Management)
- **AC-5:** In demo mode (trial expired, not purchased), exactly 1 member slot is active: the oldest member (AC-75). *(revised 2026-11-11, M4: "child" becomes "member")*
- **AC-6:** In unlocked mode or during the trial, up to **8** member slots are available (was 4). *(revised 2026-11-11, M4)*
- **AC-7:** Each member requires a first name (1–20 chars) and a type (Kid or Adult). A **Kid** also requires an age (4–12). An **Adult** has no age. *(revised 2026-11-11, M3; Kid behaviour is exactly the original criterion)*
- **AC-8:** Adding a 9th member in unlocked mode or trial shows an error: "Maximum of 8 household members reached." *(revised 2026-11-11, M4)*
- **AC-9:** Deleting a member shows a confirmation dialog; that member's completed chores **and redemptions** are deleted. Chores assigned only to that member are handled as before (M2 behaviour unchanged). *(revised 2026-11-11, M3: "child" becomes "member")*

### Chore Creation
- **AC-10:** In demo mode, exactly 3 chore slots are available.
- **AC-11:** In unlocked mode or during the trial, chores are unlimited.
- **AC-12:** Each chore has a name (1–50 chars), a point value (1–500), and is assigned to one or more **household members (Kid or Adult)**. The point value is paid only to assignees who earn points (AC-66). *(revised 2026-11-11, M3)*
- **AC-13:** An optional emoji/icon picker accompanies chore creation.
- **AC-14:** Editing a chore updates it for all members it is assigned to. *(revised 2026-11-11, M3: wording only)*

### Weekly Schedule & Reset Day
- **AC-15:** Chores can be tagged with one or more days of the week (Mon–Sun).
- **AC-16:** The weekly schedule resets at midnight local time at the start of the configured reset day. The default reset day is **Monday**.
- **AC-35:** Settings has a "Week starts on" option (Mon–Sun) that the parent can change. Changing it applies from the next occurrence of the new day and does not delete any data.
- **AC-17:** Completed chores on the current day show a green check mark; unchecked chores are gray.

### Rewards
- **AC-18:** Each reward has a name, point cost (1–1000), and optional emoji.
- **AC-19:** A member who earns points can redeem a reward only if their current points >= reward cost. Members who do not earn points have no rewards screen (AC-65). *(revised 2026-11-11, M3)*
- **AC-20:** Redeeming deducts points and shows a celebration screen (see UX moments and AC-44).
- **AC-21:** In demo mode, rewards are visible but cannot be redeemed. A Kid member sees "Ask a grown-up to unlock rewards"; an Adult member who earns points sees "Ask the manager to unlock rewards". Neither sees a purchase button (the purchase flow is reachable only from the PIN-protected Manager area). *(revised 2026-11-11, M3)*

### Points & Points Reset
- **AC-36:** By default points accumulate indefinitely until spent on rewards.
- **AC-37:** Settings has a "Reset points" option: **Never** (default), **Weekly**, **Monthly**, **Quarterly**. The choice is global, not per member, and applies only to members who earn points. *(revised 2026-11-11, M3)*
- **AC-38:** Reset boundaries (00:00 local time): Weekly = the configured reset day; Monthly = the 1st of each month; Quarterly = 1 Jan, 1 Apr, 1 Jul, 1 Oct.
- **AC-39:** At a reset boundary, the **unredeemed point balance of each member who earns points is set to 0**. Completed-chore history and past redemptions are kept. Earned-points history before the reset is not editable. A hidden balance of a member whose points are OFF is not touched (AC-67). *(revised 2026-11-11, M3)*
- **AC-40:** If one or more boundaries pass while the app is closed, the reset is applied once at the next launch (no double-reset).
- **AC-41:** Selecting a reset frequency shows a warning: "Unspent points will be set to 0 at the start of each {period}. Continue?" Changing the frequency never resets points immediately.
- **AC-42:** When a reset has occurred, the Manager dashboard shows once: "Points were reset on {date}. {Name}: {n} pts cleared." (per member who had points cleared, dismissible). *(revised 2026-11-11, M3)*

### Free Trial, Demo Mode & Purchase
- **AC-43:** The app starts a **14-day free trial** with full access (up to 8 members, unlimited chores, redemption enabled) on first launch. The trial start date is stored on the device (local database). No network or account is needed. *(revised 2026-11-11, M4: 4 becomes 8)*
- **AC-22:** After the trial ends without purchase, the app enters demo mode: 1 member, 3 chores, no redemption; other features stay visible but locked behind a "Get Full Access" prompt (Manager area only). *(revised 2026-11-11, M4)*
- **AC-45:** When the trial ends, no data is deleted. The oldest member and the 3 oldest chores stay active. Additional members and chores are kept but shown locked (dimmed, no completion or editing) until purchase, and unlock immediately on purchase. "Oldest" is by creation time and ignores member type. *(revised 2026-11-11, M4)*
- **AC-46:** The Manager area shows trial status: "{n} days left in your free trial" while in trial, and a dismissible reminder 3 days before expiry. The board never shows trial or purchase messaging to any member. *(revised 2026-11-11, M4: "kids" becomes "any member")*
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

### Child Safety & Store Compliance (formerly Kids Category & Family Compliance)
- **AC-52:** The app contains **no third-party analytics, advertising, attribution, crash-reporting-with-identifiers or tracking SDKs**. The in-app purchase uses the native StoreKit / Play Billing flows without a third-party purchase backend that collects data.
- **AC-53:** The PIN parental gate protects the entire purchase flow, the restore-purchase action, and every external link (privacy policy, support, store review). No external link or purchase path is reachable from the board by any member. *(revised 2026-11-11, M3: wording only, behaviour unchanged)*
- **AC-54:** A privacy policy is published at a public URL and linked from the store listings and from the Settings > About screen (the link is behind the PIN gate).
- **AC-55:** The store listings declare the audience and category chosen by the owner (see Open question 4). If the owner keeps the Kids category, the Kids age band applies (Open question 1). If the owner moves to a general category, the listings do not claim Kids category / Designed for Families status. In every case the Data Safety / App Privacy forms declare "no data collected". *(revised 2026-11-11, M4)*
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

### Households (added 2026-11-11)

**Milestone 3: members, points toggle, Manager area, onboarding**
- **AC-61:** *(new 2026-11-11, M3)* Given the Add/Edit member form, when it opens, then it shows a **Kid / Adult** type choice. A new member defaults to Kid, unless onboarding set another default (AC-72).
- **AC-62:** *(new 2026-11-11, M3)* Given an install or a JSON backup (AC-29/30) created before this change, when it is opened or imported, then every existing child becomes a **Kid member with points ON**, and name, age, avatar, chores, completions, balances and redemptions are unchanged. Exports made after this change include member type and the points setting, and re-import without loss.
- **AC-63:** *(new 2026-11-11, M3)* Given type **Kid**, then age (4–12) is required and the Kid rules of AC-7 apply. Given type **Adult**, then no age field is shown and no age is stored. Switching a form from Kid to Adult discards the age; switching from Adult to Kid requires an age before saving.
- **AC-64:** *(new 2026-11-11, M3)* Given the Add/Edit member form, then it has an **"Earns points & rewards"** toggle. A new Kid defaults to ON and a new Adult defaults to OFF. Changing the type in the form resets the toggle to the new type's default only if the manager has not touched it. The manager can change the toggle for any existing member at any time.
- **AC-65:** *(new 2026-11-11, M3)* Given a member with points OFF, when they open their chore view, then they see: the chore tiles, the check state for done chores, a "{done} of {total}" progress indicator for today, and the "all done for today" celebration (M4 in the UX moments). They do **not** see a points counter, "+n" point chips, the honey jar, a Rewards tab or any reward.
- **AC-66:** *(new 2026-11-11, M3)* Given a chore assigned to several members, when a member with points OFF completes it, then no points are credited to them; when a member with points ON completes the same chore, they receive the chore's points. Each assignee's completion is independent. When the chore sheet's selection includes a member with points OFF, a note says: "Points go only to members who earn points."
- **AC-67:** *(new 2026-11-11, M3)* Given a member whose points toggle is switched OFF, then their existing balance, history and redemptions are kept (hidden, not deleted or reset); switching ON again shows them unchanged. Points resets (AC-37..AC-42) apply only to members whose points are ON at the boundary.
- **AC-68:** *(new 2026-11-11, M3)* Given any mix of members, then the board lists all of them (Kids and Adults) on the member picker, and any chore can be assigned to any combination of members. The day-of-week schedule (AC-15..AC-17) works identically for every member.
- **AC-69:** *(new 2026-11-11, M3)* Given the PIN-protected area, then it is named **"Manager area"** everywhere in the UI. Any adult who knows the single shared PIN has full access to it. There are no accounts, no per-person logins or permissions, and no sync. Members use the board without a PIN.
- **AC-70:** *(new 2026-11-11, M3)* Given any screen or message, then kid-directed wording (for example "Ask a grown-up", "Hand the tablet to {name}") appears only in the context of a Kid member. Screens with no member context, and anything shown to an Adult, use neutral wording ("Manager area", "Board", "Who's in your household?", "Ask the manager").
- **AC-71:** *(new 2026-11-11, M3)* Given the shared board, then for every member (Kid or Adult) it shows no prices, trial or purchase messaging, external links or purchase paths. These exist only behind the PIN gate (restates AC-53 and AC-56 for the household model).
- **AC-72:** *(new 2026-11-11, M3)* Given onboarding, after the PIN is confirmed, then an optional step **"What kind of household?"** offers three presets: **Family with kids**, **Couple or roommates**, **Farm, barn or property**, plus **Skip**. Choosing a preset sets the default type in the first-member step (Family with kids: Kid; the other two: Adult) and selects the suggestion list for AC-73. Skipping behaves as Family with kids. The step needs no network and stores nothing beyond these defaults.
- **AC-73:** *(new 2026-11-11, M3)* Given a chosen preset, then the first-chore step offers exactly the 3 suggestion chips listed for that preset in `family-chore-board.ux.md` section 4.1. A chore is created only when its chip is tapped; nothing is created automatically. Suggestions come from a list bundled in the app.
- **AC-74:** *(new 2026-11-11, M3)* Given the first-chore step, then a reward suggestion chip is shown only if at least one member added so far earns points.

**Milestone 4: limits, store**
- **AC-75:** *(new 2026-11-11, M4)* Given the trial has ended, when demo mode applies, then the active member is the one with the earliest creation time and the active chores are the 3 earliest created, regardless of member type. All other members and chores are locked per AC-45 and are never deleted.
- **AC-76:** *(new 2026-11-11, M4)* Given the Full Access screen, trial and demo messages, then they say "members" and "8" and use no kid-only wording (copy in section 6.5).
- **AC-77:** *(new 2026-11-11, M4)* Given the store listings, then they use the category the owner picked in Open question 4. If the owner picks a general category (recommended), the listing is not submitted to App Store Kids category or Play Designed for Families, the target audience matches the owner's choice, and AC-52, AC-53, AC-54, AC-56, AC-57 remain true and are re-checked in QA.
- **AC-78:** *(new 2026-11-11, M4)* Given the store listing text, keywords and screenshots, then they present HiveBoard as a household chore board (family, couple, roommates, farm/barn) and include at least one screenshot with an Adult member; no screenshot shows prices on the board or real children.

---

## 4. Scope

### In Scope (MVP)
- PIN-protected Manager area (4 digits, PIN only, one shared PIN, any adult)
- Household members (Kids and Adults, up to 8): name, type, age for Kids only, avatar, optional points and rewards
- Chore CRUD with point values and emoji icons
- Weekly rotating schedule (Mon–Sun), configurable week-start/reset day, default Monday
- Board: shared completion view for all members (tap to mark done), with progress and celebrations for members who do not earn points
- Point tracker, reward chart, reward redemption for members who earn points (per-member toggle)
- Points reset frequency setting (Never / Weekly / Monthly / Quarterly)
- 14-day local free trial, then demo mode (1 member, 3 chores)
- One-time $4.99 in-app purchase unlock, with restore
- Local JSON export/import backup
- Local daily notification ("Time to check your chores!"), toggleable by parent, default off
- Sound effects (cue list in 4a) with a parent mute toggle; haptics on key moments
- Child-safety compliance retained (AC-52..AC-57); store category per owner decision (Open question 4)
- Full design pass: tokens, motion spec, screens (owned by `ui-ux-designer`)
- Optional onboarding step "What kind of household?" with 3 presets that seed example chore suggestions (local list)

### Out of Scope ("Later")
- Sync across multiple devices
- Multi-language support (English only for MVP)
- Avatars with characters or story-driven gamification (the animation and celebration moments listed in section 6.2 are in; collectible/animated characters are not)
- Calendar integration (Google Calendar, Apple Calendar)
- Push notifications or parent push alerts
- Photo capture for chore completion proof
- Age-based chore suggestions, or a chore template library beyond the three onboarding presets
- Biometric parent lock
- Per-member points reset frequency
- Background music or voice-over
- Haptics toggle separate from the system setting
- Server-side trial or receipt validation
- Multi-device sync, so two adults can each use their own phone (needs accounts or a backend; see Open question 5)
- Multiple PINs, per-adult permissions, or roles (only one shared PIN)
- Unassigned or "anyone can do it" chores; rotating assignment between members
- Chores without a point value (the value is still required by AC-12 even if no assignee earns points)
- Re-opening the household-type suggestions after onboarding; more presets
- Avatar emoji aimed at adults and barn/farm themes beyond the existing set
- Streaks (the approved spec has none; "progress" in AC-65 means today's done count)

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

The 2026-11-11 households change does not alter this line, the Team or the Track.

---

## 6. UX

The `ui-ux-designer` **owns** design tokens, the motion spec, and screen designs in `docs/specs/family-chore-board.ux.md`. This spec states goals, the screen inventory and the moments that must be designed; it does not prescribe colors, type, spacing or layouts. The designer has creative latitude, including the visual identity of "HiveBoard".

### 6.1 UX Goals

1. **Appealing first.** The app should look like a premium product a family is proud to leave on the shared tablet: playful enough for kids, never babyish for adults. The owner wants a "heavy hand" from design.
2. **Delightful and alive.** Motion and sound reward every meaningful action, are fast (never block the child), and feel physical (springs, squash-and-stretch, particles).
3. **Intuitive for a 4-year-old.** A Kid member who cannot read must complete a chore without help: big icons, one obvious action per screen, no deep navigation on the board. The same board must feel natural, not babyish, to an Adult member.
4. **Calm and efficient for the manager.** The Manager area is clean and quick, with clear separation from the board (a clearly different look/mood is welcome).
5. **Accessible.** 48 × 48 pt minimum targets, AA contrast, Reduce Motion support (AC-58..AC-60), and nothing conveyed by color alone.
6. **Child-safe for everyone.** No dark patterns; the board never shows prices, trial messaging or external links to any member.
7. **Performance.** Animations at 60 fps on a mid-range tablet; the app is usable immediately, with no animation blocking input.

### 6.2 Moments that need animation / delight (designer to specify motion, timing, sound/haptic pairing)

| # | Moment | Paired cue | Expectation |
|---|--------|-----------|-------------|
| M1 | **Chore tick**: child taps a chore to done | `chore_complete`, light haptic | Satisfying check animation (not just a color change); chore card reacts; instant and undo-able |
| M2 | **Points fly to total**: "+n" points travel from the chore to the point total | `points_fly`, `points_tick` | Counter ticks up; the total reacts on arrival |
| M3 | **Progress bar fill** toward the next reward | `progress_fill` | Smooth fill; extra flourish when a reward becomes affordable (`milestone`) |
| M4 | **All of today's chores done** | `milestone` | Small celebration, "great job" state |
| M5 | **Reward redeem celebration** | `reward_redeem`, success haptic | Full-screen celebration (confetti/bees/honey), shows the reward, easy dismiss |
| M6 | **Onboarding**: welcome, PIN setup, household type (optional), adding the first member, chore and reward | `onboarding_welcome`, `pin_success` | Friendly guided flow with motion; explains the product in a few steps; ends in a populated, inviting state |
| M7 | **Screen transitions**: kid home to kid view, to rewards, to parent PIN | `ui_tap`, `ui_back` | Consistent, quick transitions that show where you are |
| M8 | **PIN entry feedback** | `pin_key`, `pin_error`, `pin_success` | Dots fill; gentle shake on error |
| M9 | **Empty states** | none | Illustrated/animated, with a clear next step |
| M10 | **Locked reward / not enough points** | `reward_locked` | Encouraging nudge showing how many points remain |
| M11 | **Purchase success** (parent) | `purchase_success` | Brief celebration; limits visibly lift |
| M12 | **Reset points notice** (parent) | none | Calm, clear summary, not alarming |

### 6.3 Screen Inventory (functional; layouts are the designer's)

| Screen | Purpose | Empty State | Loading State | Error State |
|--------|---------|-------------|---------------|-------------|
| **Welcome / Onboarding** | First launch intro, set PIN, optional household type, first member, first chore and reward | N/A | None | N/A |
| **PIN Entry** | Gate between the board and the Manager area, purchases, links | N/A | None | "Incorrect PIN — try again"; after 5 failures, 30 s cooldown |
| **Manager Dashboard** (was Parent Dashboard) | Overview: members, points (where earned), today's completion, trial status | "Add your first household member to get started!" | Skeleton | N/A |
| **Household Members** (was Edit Children) | Add/edit/remove members; set type (Kid/Adult) and the "Earns points & rewards" toggle | "No one here yet — tap + to add someone." | N/A | "Name required", "Age must be 4–12" (Kids only), "Maximum of 8 household members reached." |
| **Edit Chores** | Create/edit chores, assign days and members | "No chores yet — tap + to create one." | N/A | "Name required", "Points must be 1–500" |
| **Edit Rewards** | Create/edit rewards | "No rewards yet — set one as a goal!" | N/A | "Name required", "Cost must be 1–1000" |
| **Weekly Schedule** | Chore assignments per day for the current week | "No chores scheduled this week." | N/A | N/A |
| **Board Home** (was Kid Home) | Pick who is checking in | "No one's on the board yet. Open the Manager area to add your household." | N/A | N/A |
| **Member Chore View** (was Kid Chore View) | Today's chores: tap to complete; progress indicator for members without points | "No chores for today — you're all set!" | Skeleton | N/A |
| **Reward Screen** | Point total, progress, redeemable rewards (members who earn points only) | "Complete chores to earn points!" | N/A | N/A |
| **Reward Celebration** | Redeem confirmation (M5) | N/A | N/A | N/A |
| **Settings** | PIN change, week-start day, points reset, sounds, reminder, backup, restore purchase, privacy policy and about | N/A | N/A | "Import failed — check file format" |
| **Full Access (paywall)** | Parent-only purchase screen after PIN | N/A | Store sheet loading | "Purchase didn't go through. You haven't been charged." |
| **Household type (onboarding step)** | Optional choice of Family with kids / Couple or roommates / Farm, barn or property to seed example chores | N/A | None | N/A |

Screen names above are UX labels. Routes, files and the `child` table may keep their M1/M2 names; renaming is the architect's call.

### 6.4 Main Flow

```
First Launch (trial starts silently) -> Onboarding -> Set 4-digit PIN (twice)
  -> optional "What kind of household?" -> first member -> first chore (and reward if anyone earns points)
  -> Manager Dashboard (guided)

Daily Use: App opens -> Board Home -> member taps their profile -> Member Chore View
  -> tap chore (M1; M2 and M3 only for members who earn points) -> Reward Screen (those members) -> Redeem (M5)
  -> "Manager" -> PIN Entry -> Manager Dashboard -> Settings / edit / purchase
```

### 6.5 Key UX Copy (draft; designer and copy-voice may refine tone)

| Element | Copy |
|---------|------|
| Welcome subtitle | "Your household's chore board — simple, private, one-time purchase." |
| Welcome subtitle | "Your family's chore chart — simple, private, one-time purchase." |
| PIN setup prompt | "Create a 4-digit PIN to protect the Manager area." |
| PIN confirm | "Re-enter your PIN to confirm." |
| Empty Manager dashboard CTA | "Add your first household member to get started!" |
| Empty chore list (kid view) | "No chores for today — you're all set!" |
| Empty rewards (kid view) | "Complete chores to earn points!" |
| Chore completed | "Great job! +{n} pts" |
| Reward redeemed title | "Reward Redeemed!" |
| Reward redeemed subtitle | "{reward name} is yours!" |
| Reward locked in demo | Kid: "Ask a grown-up to unlock rewards." Adult who earns points: "Ask the manager to unlock rewards." |
| Full Access title | "Unlock the Full HiveBoard" |
| Full Access body | "Add up to 8 household members and unlimited chores with a one-time purchase. No subscription, no ads." |
| Full Access CTA | "Get Full Access — $4.99" |
| Trial status (parent) | "{n} days left in your free trial" |
| Trial ended (manager) | "Your free trial has ended. HiveBoard is in demo mode (1 member, 3 chores). Get Full Access to unlock everything." |
| Demo limit warning (members) | "Demo mode includes 1 member. Get Full Access for up to 8." |
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
| Household type title | "What kind of household?" |
| Household type hint | "This only picks example chores to start you off. You can change everything later." |
| Household presets | "Family with kids", "Couple or roommates", "Farm, barn or property" |
| First member title / Members list title | "Who's in your household?" |
| Member type label | "Kid" / "Adult" |
| Points toggle label | "Earns points & rewards" |
| Points toggle helper (on) | "Completed chores earn points that can be traded for rewards." |
| Points toggle helper (off) | "Chores are ticked off and tracked, with no points or rewards." |
| Member limit | "Maximum of 8 household members reached." |
| Chore sheet note (mixed assignees) | "Points go only to members who earn points." |
| Rewards screen note (nobody earns points) | "No one earns points yet. Turn on "Earns points & rewards" for a member to use rewards." |
| Progress indicator (no points) | "{done} of {total} done" |
| Onboarding finish | "All set! Your board is ready." (Kid first member: "Hand the tablet to {name}!") |
| Empty board | "No one's on the board yet. Open the Manager area to add your household." |

---

## 7. Open Questions

1. **Kids age band.** *(Applies only if the owner keeps the Kids category; see question 4.)* Apple's Kids category requires one band (5 and under, 6–8, 9–11). The app targets Kid members aged 4–12 with a parent buyer. Recommendation: "6–8". Owner to confirm. (Google Play "Designed for Families" also needs a target age group.)
2. **Name risk appetite.** HiveBoard is not clearly taken (see naming doc), but the "Hive" prefix is crowded. Is the owner comfortable launching after only a self-run tmsearch.uspto.gov check, or should a trademark attorney confirm first (cost)? Fallback name: TidyHive.
3. **Daily reminder in Kids apps.** Local notifications are kept (parent-enabled only, default off). The owner should confirm this is acceptable for Kids-category review, or drop it from MVP if the app-review risk is not wanted.
4. **Store category after the households change (new 2026-11-11, affects only M4 store setup).** HiveBoard is no longer kids-only, so the App Store Kids category and Google Play "Designed for Families" no longer fit well (they restrict marketing and audience to children, and adult households are a main audience now). **Recommendation: move to a general category (Lifestyle, or Productivity as the alternative) and keep every child-safety behaviour** (parental PIN gate, no tracking SDKs, no data collected, AC-52..AC-57). Trade-off: less discoverability in the Kids shelf, but a wider audience and no age-band restrictions on adult-facing screenshots and copy. If Kids category is kept, adult-oriented listing copy and screenshots must be limited, and question 1 still applies. Owner to decide. **Owner answer (2026-11-11): Lifestyle (general category), keep all child-safety behaviour. Q1 (Kids age band) no longer applies.**
5. **Two adults, two phones (new 2026-11-11).** The barn example says husband and wife "delegate" chores. This MVP serves one shared device (both adults use the same PIN). If each adult needs their own phone with live updates, that needs sync (accounts or a backend), which is out of scope and conflicts with the no-data goal. Owner to confirm one shared device is enough for launch.
6. **Points hidden when toggled off (new 2026-11-11, PM default in AC-67).** I keep the balance and history hidden, and restore them when points are turned back on. Owner can ask instead for the balance to be cleared when points are turned off. **Owner answer (2026-11-11): hide the balance (AC-67 as written).**

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
| 2026-11-11 | Households scope change | HiveBoard is usable by any household, not only children. Members are Kid or Adult; points and rewards optional per member (Kid ON, Adult OFF); PIN area is the Manager area with one shared PIN; member cap 8; optional household-type onboarding step; propose general store category | Section "Scope change 2026-11-11: households"; AC-61..AC-78 and revised ACs; lands in M3 (board + settings) and M4 (trial/IAP + store). Open questions 4-6 |

### Owner final approval (2026-11-07)
Approved spec, design (ADR 0005) and UX with all recommendations: Kids age band 6-8; points reset zeroes unspent balance (history kept); name HiveBoard (self-check only, fallback TidyHive); daily reminder kept, default off; static mascot Pip yes; bundled emoji set yes; 'Get {reward}?' confirm before redeem yes; PIN re-asked before opening the privacy policy link yes.
