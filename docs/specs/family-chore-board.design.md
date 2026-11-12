# HiveBoard (Family Chore Board): Design (Full track)

Spec: `docs/specs/family-chore-board.md` (revised 2026-11-07, scope change "households" 2026-11-11 absorbed into M3/M4, Full track) · UX source of truth: `docs/specs/family-chore-board.ux.md` (ui-ux-designer, in parallel) · Platforms: iOS + Android tablets/phones, local-only, one-time IAP, App Store Kids category + Play Designed for Families

```
Team: mobile-dev, ui-ux-designer, qa-engineer, code-reviewer, devops-engineer (CI, EAS builds, store IAP products, privacy-policy hosting, store compliance forms),
      Creative Studio: creative-director + copy-voice (sound cue pack, spec section 4a)
Not needed: frontend-dev (no web app), backend-dev (no accounts/sync/server; all data on-device, purchase verified by the native store SDK)
```

Build tasks are tagged only [mobile] or [devops]. Design (ux.md) and the sound pack are inputs produced outside the task list.

**Repo:** private GitHub repo `chalupuh/family-chore-board`, local clone `C:\Users\goldg\family-chore-board`, one Expo app at the repo root. One platform family, so no monorepo and no `packages/shared`. Spec, UX and design docs stay in HQ `docs/specs/`.

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| App | Expo (latest SDK) + TypeScript strict + **expo-router** | Studio default |
| Storage | **expo-sqlite**, hand-written SQL migrations (`PRAGMA user_version`) | AC-32. Small schema, no ORM |
| PIN | `expo-crypto` SHA-256(salt + PIN) in **expo-secure-store** | Never plaintext, never exported |
| IAP | **expo-iap** (StoreKit 2 + Play Billing), one non-consumable `hiveboard_full_unlock` | Native flows only, no RevenueCat (AC-31, AC-52). Needs EAS dev client |
| Animation | **react-native-reanimated** (springs, layout, shared values) + **react-native-gesture-handler** + **@shopify/react-native-skia** for particles (confetti, sparkles, honey drops) | Reanimated runs on the UI thread (60 fps, AC/goal 7, never blocks input). Skia over Lottie: celebrations are code-driven and parametric (particle count, colors from tokens, Reduce Motion fallback) with no After Effects authoring pipeline in the studio; Creative Studio produces images/audio, not Lottie JSON. If ux.md delivers Lottie files anyway, `lottie-react-native` can be added for those assets only |
| Reduce Motion | Reanimated `useReducedMotion()` behind our own `useMotion()` hook | AC-59: one switch swaps springs/particles for fades and static states |
| Audio | **expo-audio**, players preloaded at startup; audio mode `playsInSilentMode: false`, `interruptionMode: 'mixWithOthers'` | AC-49/50: respects mute switch, never interrupts other audio (ambient) |
| Haptics | `expo-haptics` | AC-51 |
| Backup | `expo-file-system` + `expo-sharing`, `expo-document-picker`, **zod** | AC-27–30 |
| Reminder | `expo-notifications`, local daily only (see Risks: may be dropped) | AC-57 |
| Tests | Jest + RNTL, **Maestro** E2E | Studio default |

No third-party analytics, crash reporting, ads or attribution SDKs (AC-52); CI enforces a dependency allowlist. ADR: `docs/adr/0005-hiveboard-motion-audio-trial-ledger.md`.

**Sound pack format (for Creative Studio):** 15 cues named exactly by Cue ID (`assets/sounds/<cue_id>.m4a`), AAC-LC mono 44.1 kHz ~96 kbps, normalized to -18 LUFS integrated / -1 dBTP peak, no leading silence > 10 ms, total pack ≤ 1 MB. `points_tick` is one sample; pitch rise is done in code via playback rate. Until delivery, mobile-dev ships placeholder files with the same names, so the swap is a file drop with no code change.

## 2. Data model (SQLite)

```
settings(id=1,
  weekStartsOn INT=1 /*0=Sun..6=Sat, default Mon*/,
  pointsResetFrequency TEXT 'never'|'weekly'|'monthly'|'quarterly' = 'never',
  lastResetBoundaryAt INT NULL /*epoch ms of last boundary handled*/,
  pendingResetNotice TEXT NULL /*JSON for AC-42, cleared on dismiss*/,
  soundsEnabled INT=1, notifyEnabled INT=0, notifyTime TEXT 'HH:MM',
  trialStartedAt INT /*set on first launch*/, lastSeenAt INT /*max clock seen, AC-47*/,
  trialReminderDismissed INT=0,
  isPremium INT /*cache of store entitlement*/, pinFailCount INT, pinLockedUntil INT,
  householdType TEXT NULL 'family'|'couple'|'property' /*M3, onboarding preset; NULL = skipped = family*/)
  -- PIN hash + salt in SecureStore
child(id TEXT pk, name 1–20, age INT NULL /*4–12 required for kid, NULL for adult*/, avatarEmoji, sortOrder INT, createdAt INT,
      memberType TEXT 'kid'|'adult' DEFAULT 'kid', earnsPoints INT DEFAULT 1   /*M3*/)
  -- table keeps the name `child` (= household member) to avoid churn in M1/M2 code; UI says "member"
chore(id TEXT pk, name 1–50, points INT 1–500, emoji NULL, daysMask INT /*bit0=Mon..bit6=Sun*/, createdAt INT)
chore_child(choreId → chore CASCADE, childId → child CASCADE, PK(choreId, childId))
reward(id TEXT pk, name, cost INT 1–1000, emoji NULL, createdAt INT)
completion(id pk, choreId → chore CASCADE, childId → child CASCADE, date 'YYYY-MM-DD' local,
           points INT /*snapshot*/, createdAt INT, UNIQUE(choreId, childId, date))
redemption(id pk, childId → child CASCADE, rewardId /*no FK*/, rewardName, cost INT, createdAt INT)
points_adjustment(id pk, childId → child CASCADE, kind TEXT 'reset', amount INT /*negative*/,
                  boundaryAt INT, createdAt INT, UNIQUE(childId, boundaryAt))
```

**Households migration (M3, task 5b):** a new migration bumps `PRAGMA user_version` by 1: `ALTER TABLE child ADD memberType TEXT NOT NULL DEFAULT 'kid'`, `ADD earnsPoints INTEGER NOT NULL DEFAULT 1`, `ALTER TABLE settings ADD householdType TEXT`. SQLite cannot drop NOT NULL in place, so `age` becomes nullable by table rebuild (create `child_new`, copy, drop, rename, inside one transaction with `PRAGMA foreign_keys=OFF` / `foreign_key_check`). Existing rows become Kid + points ON (AC-62). The kid/adult age rule moves from the column to the repo + zod validation.

Domain rules (pure functions in `src/domain/`, unit-tested; no React imports):
- **Balance** = Σ completion.points − Σ redemption.cost + Σ points_adjustment.amount. Always derived; nothing stored as a total. Completions by a member with `earnsPoints = 0` are stored with `points = 0` (AC-66); toggling OFF hides but never deletes balance/history (AC-67).
- **Points ON only:** balance display, rewards screen and `redeem` require `earnsPoints = 1` (AC-19, AC-65); redeem rejects otherwise.
- **Points reset** (`resets.ts`, AC-36–42): `latestBoundary(now, frequency, weekStartsOn)` gives the most recent 00:00-local boundary (weekly = reset day, monthly = 1st, quarterly = 1 Jan/Apr/Jul/Oct). On launch and on foreground, if frequency ≠ never and `latestBoundary > lastResetBoundaryAt`: for each member with `earnsPoints = 1` (AC-67), balance at the boundary (entries with `createdAt < boundary`) > 0 → insert one `reset` adjustment of −balance; set `lastResetBoundaryAt`, write `pendingResetNotice`. One transaction; the UNIQUE key makes it idempotent, and only the latest boundary is applied, so missed boundaries never double-reset (AC-40). Changing frequency or `weekStartsOn` sets `lastResetBoundaryAt = latestBoundary(now)` so nothing resets immediately (AC-35, AC-41).
- **Schedule** (`schedule.ts`): today's chores = assigned chores with today's bit; done = completion row for today; un-tap deletes it (same day only). The week view starts at `weekStartsOn`. "Today" is recomputed on `AppState` foreground.
- **Access state** (`access.ts`, the only place limits live): `state = premium | trial | demo`. Trial elapsed uses `effectiveNow = max(now, lastSeenAt)` and `lastSeenAt` is bumped forward only (AC-47); trial = 14 days from `trialStartedAt`. In demo: active children = oldest 1 by `createdAt`, active chores = oldest 3; the rest are `locked` (visible, dimmed, no completion or edit), redemption disabled (AC-45, AC-21). Premium/trial: max 4 children, unlimited chores. `daysLeft` and `showExpiryReminder` (≤ 3 days) for AC-46. **Changes in M4 (task 7):** max **8 members** (AC-6, AC-8); demo = oldest 1 member by `createdAt` regardless of `memberType` + oldest 3 chores (AC-75). Until task 7 lands, M3 keeps the M2 cap of 4.
- **Redeem** in a transaction: balance ≥ cost, then insert.
- **Export** `{ schemaVersion, exportedAt, settings (week/reset/sound/notify only), children, chores, choreChildren, rewards, completions, redemptions, pointsAdjustments }`. Never exports PIN, isPremium, trial fields. From M3 the export `schemaVersion` is bumped (1 → 2): `children[]` carry `memberType`, `earnsPoints`, nullable `age`; settings carry `householdType`. Import accepts v1 and v2; v1 children map to `memberType 'kid'`, `earnsPoints 1` (AC-62). **Import** validates with zod and replaces data in one transaction; trial and purchase state untouched (AC-30). Invalid file → no change + "Import failed — check file format".
- **Parental gate** (`gate.ts`): purchase, restore and every external link (privacy policy, support, review) call `requirePin()` first, even inside the parent area (AC-53). Kid routes import nothing from `src/iap` or `Linking` (lint rule `no-restricted-imports` on `app/kid/**`). `app/kid/**` is the shared board for **all** members (AC-71), so the rule already covers Adults.
- **Copy** (`src/copy/wording.ts`, M3): kid-directed strings only when the current member is a Kid; neutral otherwise (AC-70). Household presets and their 3 chore suggestion chips are a bundled constant `src/domain/presets.ts` (AC-72–74).

## 3. API contracts

None over the network. The only external calls are the store SDKs (purchase, restore, product price) via `src/iap/entitlement.ts`:
```ts
getPrice(): Promise<string | null>          // localized "$4.99"
purchase(): Promise<'ok' | 'cancelled' | 'failed'>
restore(): Promise<boolean>                 // also run silently on launch
onEntitlementChange(cb: (premium: boolean) => void): () => void
```
Internal module contracts: `src/db/repos/*` (typed CRUD), `src/domain/*` (pure), `src/sound/useSound()` → `play(cueId, { rate? })` (no-op when `soundsEnabled` is false), `src/motion/useMotion()` → `{ reduced, spring(name), duration(name) }` with names taken from ux.md motion tokens.

## 4. Folder layout (owner: mobile-dev unless noted)

Households change: **file paths stay as they are** (`app/kid/*` = the Board, `app/parent/*` = the Manager area, `parent/children.tsx` = Members, `[childId]` = member id). Only UI labels change ("Board", "Manager area", "Members"). New files: `app/onboarding/household.tsx`, `src/domain/presets.ts`, `src/notify/reminder.ts`, a new migration in `src/db/migrations.ts`.

```
app/                         expo-router screens (layouts per ux.md)
  index.tsx                  → onboarding if no PIN, else Kid Home
  onboarding/  pin.tsx
  kid/index.tsx  kid/[childId]/index.tsx  kid/[childId]/rewards.tsx  kid/[childId]/celebrate.tsx
  kid/[childId]/schedule.tsx (weekly view)
  parent/_layout.tsx (PIN guard)  parent/index.tsx  children.tsx  chores.tsx  rewards.tsx
  parent/schedule.tsx  parent/settings.tsx  parent/about.tsx  parent/full-access.tsx
  parent/change-pin.tsx  parent/reminder.tsx  parent/backup.tsx (Export / Import)
  dev/gallery.tsx            design-system + motion + sound gallery (dev builds only)
src/db/        migrations.ts (source of truth for the schema; the old schema.sql was removed), repos/*.ts
src/domain/    points.ts, resets.ts, schedule.ts, access.ts, trialClock.ts, pin.ts, gate.ts, backup.ts (+ tests)
src/ui/        tokens.ts (from ux.md), components (BigTapTile ≥48pt, ChoreCard, PointsCounter, ProgressBar, PinPad, EmojiPicker, LockedOverlay, EmptyState)
src/motion/    useMotion.ts, springs.ts, Confetti.tsx (Skia), PointsFly.tsx, transitions.ts
src/sound/     cues.ts (Cue IDs from spec 4a), SoundProvider.tsx (expo-audio), haptics.ts
src/iap/       entitlement.ts
src/notify/    reminder.ts
assets/sounds/ <cue_id>.m4a  (placeholders → Creative Studio pack)
e2e/           Maestro flows                                         (qa-engineer)
.github/workflows/ci.yml, eas.json, app.config.ts, scripts/check-deps.js   (devops-engineer)
```

## Milestone 1: Foundation and design system
1. **[mobile] Scaffold, data and domain.** Expo + expo-router + TS strict + ESLint (incl. kid-route import restriction) in `C:\Users\goldg\family-chore-board`. SQLite schema + migrations + repos. `src/domain`: points ledger, resets, schedule with `weekStartsOn`, access (trial/demo/premium + locked items), trialClock, pin (exactly 4 digits, 5 fails → 30 s), backup, with unit tests for every boundary case (month/quarter edges, missed boundaries, clock rollback). *Deps: none.*
2. **[devops] CI and builds.** GitHub Actions: lint, typecheck, jest, and `check-deps.js` (fails on any analytics/ads/tracking/crash SDK, AC-52). `eas.json` dev/preview/production; iOS + Android dev-client builds. *Deps: 1.*
3. **[mobile] Design system, motion and sound primitives.** Tokens and base components from ux.md; `useMotion` with Reduce Motion fallback; Reanimated springs/transitions; Skia confetti and PointsFly; `SoundProvider` (expo-audio, preload, ambient mode, mute toggle) with 15 placeholder cues; haptics wrapper. `dev/gallery` screen shows every component, motion and cue. *Deps: 1.*

*Try it:* open the dev gallery on a tablet, tap through components, hear placeholder cues, toggle Reduce Motion and see fades instead of springs.

## Milestone 2: Parent sets up the family
4. **[mobile] Onboarding, PIN and parent area.** Onboarding flow (M6, `onboarding_welcome`), PIN setup twice and PIN entry with dots/shake/cooldown (M8). Parent guard and dashboard (kids, today's progress, trial status, AC-46). Children, Chores (days, kids, emoji) and Rewards CRUD with spec validation copy, confirm-delete (AC-9), empty states (M9). Limit prompts link to a stub Full Access screen. All screens built from M1 primitives. *Deps: 1, 3.*

*Try it:* first launch → onboarding → PIN → add 2 children, chores and a reward; dashboard shows "14 days left in your free trial".

## Milestone 3: Kids use the board, parent settings
5. **[mobile] Kid experience.** Kid Home avatar grid, Kid Chore View with chore tick + undo (M1), points fly + counter tick (M2), progress fill + milestone (M3), all-done celebration (M4), Reward screen with locked/not-enough nudge (M10), redeem confirmation + full-screen celebration (M5), transitions (M7), weekly schedule view. "Parent Area" re-asks PIN. No prices, trial text or links in kid routes. **Households:** Board lists all members (AC-68). A points-OFF member's view shows tiles, ticks, "{done} of {total}" and the all-done celebration, but no counter, "+n" chips, honey jar or Rewards tab (AC-65). Demo-locked reward text: Kid "Ask a grown-up to unlock rewards", Adult "Ask the manager to unlock rewards" (AC-21). Maestro check that no member's board shows prices or links (AC-71). *Deps: 4, 5b.*
5b. **[mobile] Households data, members and onboarding** (spec C1–C8). Migration above (user_version bump, `age` nullable, `memberType`, `earnsPoints`, `householdType`) with tests on an M2-shaped DB (AC-62). Repo + zod validation per AC-7/AC-63. Member form: Kid/Adult choice, age only for Kid, "Earns points & rewards" toggle with type defaults unless touched (AC-61, AC-63, AC-64). Chore sheet: assign to any members, note "Points go only to members who earn points." (AC-66, AC-68). Optional onboarding step "What kind of household?" storing `householdType` and setting the first-member default type; first-chore step shows the preset's 3 chips and a reward chip only if a member earns points (AC-72–74). Rename UI labels to Manager area / Board / Members and add `src/copy/wording.ts` (AC-69, AC-70). Domain: zero-point completions and redeem guard for points-OFF members, resets skip them (AC-66, AC-67). *Deps: 4. Runs first in M3; 5 and 6 build on its schema.*
   **Sync-ready data (owner decision 2026-11-11, sync itself ships in v1.1):** in the same migration, every syncable table (child, chore, chore_child, reward, completion, redemption, points_adjustment, settings) gets `updatedAt INT NOT NULL` (epoch ms, set on every write) and `deletedAt INT NULL` (soft delete: repos filter `deletedAt IS NULL`; deletes set it instead of removing rows, and CASCADE becomes an app-level soft delete of dependent rows). All ids are random UUIDv4 text (check that existing rows already are; new ids come from expo-crypto `randomUUID()`). `settings` gets `deviceId TEXT` (a UUID created once). Export includes `updatedAt` and `deletedAt`. No network code, no accounts and no sync UI in v1. Unit tests: soft-deleted rows never appear in queries, balances or exports of live data; `updatedAt` bumps on every edit.
6. **[mobile] Settings.** Week starts on, Reset points with warning (AC-41) and once-only dashboard notice (AC-42, M12), Sounds toggle, Change PIN, daily reminder (permission asked only here), Export/Import, About with PIN-gated privacy-policy link. **Households:** Reset copy says it applies only to members who earn points; notice lists only those (AC-37, AC-42). Export writes schemaVersion 2; import accepts v1 (→ Kid, points ON) and v2 (AC-62). *Deps: 4, 5b (parallel with 5: different files).*

*Try it:* onboarding offers "What kind of household?"; pick "Couple or roommates", add an Adult (points OFF) and a Kid (points ON), assign one chore to both. The Kid completes chores, sees points fly, redeems a reward with the celebration; the Adult ticks the same chore and sees progress and the all-done celebration, no points. Manager sets weekly reset, moves the device date past the reset day, relaunches, sees the notice for the Kid only. Import an old (v1) backup: children come back as Kids with balances intact.

## Milestone 4: Trial end and one-time unlock
7. **[mobile] Trial expiry, IAP and restore.** Post-trial demo mode with locked children/chores (AC-45) and trial-ended copy; 3-day reminder. Full Access screen behind `requirePin()` with store price; purchase, finish transaction, cache `isPremium`, `purchase_success` (M11), limits lift immediately. Silent restore on launch + "Restore purchase" (PIN-gated). Cancel/failure returns with no data loss. Swap in the Creative Studio sound pack if delivered. Maestro flows: onboarding, chore → redeem, trial expiry (debug clock), purchase (sandbox), restore. *Deps: 2, 5, 6.* **Households (C9, C10):** `access.ts` cap 4 → 8 members with "Maximum of 8 household members reached." (AC-6, AC-8); demo = oldest 1 member regardless of type + oldest 3 chores (AC-5, AC-22, AC-45, AC-75); Full Access, trial and demo copy say "members" and "8", no kid-only wording (AC-43, AC-46, AC-76). Maestro: add a 9th member blocked; demo with an Adult as oldest member.
8. **[devops] Store setup and compliance.** IAP product in App Store Connect / Play Console sandbox; privacy policy page at a public URL ("No data is collected or transmitted."); draft App Privacy / Data Safety ("no data collected") for owner review. **Category depends on owner Open question 4** (C11, AC-55, AC-77): default is a **general category** (e.g. Lifestyle / Productivity), not submitted to App Store Kids or Play Designed for Families, target audience per owner; if the owner keeps Kids, draft the Kids/Families age-band answers instead (Q1). Either way all child-safety behaviour stays (AC-52–54, AC-56, AC-57) and QA re-checks it. Draft listing text, keywords and a screenshot list showing households incl. an Adult member, no prices on the board, no real children (AC-78; screenshots/copy via Creative Studio). Owner OK required for store accounts, category and any spend; nothing is submitted without it. *Deps: 2 (parallel with 7); category answers wait on Q4.*

*Try it:* with debug clock at day 15, the 2nd member and 4th chore show locked (oldest member active even if Adult); PIN → buy in sandbox → everything unlocks with the celebration; add members up to 8, the 9th is refused; reinstall → restore → still premium. Store drafts show the chosen category.

## 5. Risks and trade-offs
- **Households (2026-11-11).** Moving to a general category (Q4 default) lowers Kids-category review risk (no Kids age band, no Families policy audit) but the app is still used by children, so all mitigations below stay. If the owner keeps Kids, Adult members and household marketing may draw reviewer questions; the listing must stay child-first. One shared PIN on one shared device is assumed (spec Q5); no per-person logins. Migration risk: the `child` table rebuild runs on real M2 data; covered by migration tests on an M2-shaped DB and an export-before-migrate recommendation in release notes.
- **Kids category review.** Apple and Google review Kids apps strictly: any third-party SDK, an ungated link or purchase path, or a permission prompt in the kid flow can cause rejection. Mitigations: CI dependency allowlist, kid-route import lint rule, `requirePin()` on all purchase/restore/link paths, Maestro check that kid routes show no prices or links. Expo itself sends no telemetry from release builds, but `expo-updates` is **not** used (no OTA network calls, AC-31).
- **Local trial resets on reinstall** (or clearing app data). Backwards clock is neutralized by `lastSeenAt`, but a reinstall grants a new 14 days. Accepted by the owner for a $4.99 app; no server or receipt check. Import never touches trial state, so backups can't extend it.
- **Entitlement cached locally**; tampering on a rooted device is possible. Accepted.
- **IAP needs dev-client builds and sandbox store accounts** (owner action, possible enrollment cost). This is why IAP is the last milestone and T2 builds the dev client early.
- **Motion performance on low-end Android tablets.** Skia particle counts and blur are capped via tokens; Reduce Motion path doubles as a perf fallback. Profile in M1 gallery on a mid-range device.
- **Sound pack dependency.** Creative Studio delivers in parallel; placeholders with identical names keep the build unblocked. Loudness and size budget above keep the pack small.
- **Design dependency.** Screens wait on ux.md tokens/motion names. T1 and T2 do not depend on it; T3 starts as soon as tokens and motion spec are drafted.
- **Points reset semantics.** "Set to 0" is modeled as ledger adjustment entries so balance stays derived and history is kept. Only the latest missed boundary is applied, which equals one reset (AC-40). Timezone changes mid-day can shift "today" and boundaries; accepted for MVP.
- **Data loss on uninstall** is inherent to local-only storage; versioned JSON export is the mitigation.
- **Owner confirmations still pending** (do not change the architecture):
  - Kids age band: **6–8** recommended (also sets the Play target age group).
  - Trademark: HiveBoard screened OK by self-check; attorney check optional (cost). Fallback name **TidyHive**; app name, bundle id and IAP product id are config in `app.config.ts`, so a rename is cheap before store setup (T8).
  - Daily reminder: keep or drop. If dropped, remove `src/notify` and the setting from T6; no other impact.
  - Points reset zeroing unspent points (PM decision awaiting owner confirmation).
