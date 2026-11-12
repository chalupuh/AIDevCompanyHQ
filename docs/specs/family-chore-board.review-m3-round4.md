# Code Review: Milestone 3 (Kids use the board, parent settings), round 4

**Feature:** HiveBoard / family-chore-board · **Reviewer:** code-reviewer · **Date:** 2026-11-12
**Scope:** Re-check after the latest rework. The diff runs from the rejection baseline `5cc3078` to HEAD `5a352fc`: 36 files, +1209/-204. I read every changed file, and the working tree is clean.
**Previous reports:**
- `family-chore-board.review-m3-round2.md` (the engine's baseline)
- `family-chore-board.review-m3-round3.md`, the most recent rejection, for HEAD `81a58fc`. This round also re-checks its B-1, B-2, F17, S-1..S-5 and N-1..N-7.

**Design / spec:** `family-chore-board.design.md` (M3 tasks 5, 5b, 6) · `family-chore-board.ux.md` (motion M2/M3/M4/M5/M7) · `family-chore-board.md` (AC-37..AC-42, AC-61..AC-74)

## How this review was done

- I ran `git diff --stat 5cc3078fd` and read the full diffs of `src/`, `app/`, `e2e/` and `__tests__/`.
- `npx tsc --noEmit`: **0 errors.**
- `npx jest`: **25 suites, 344 tests, all passing.** This includes `__tests__/db/realEngine.test.ts`, which runs on the real `node:sqlite` engine.
- I checked the motion spec (`ux.md:184,188`) against `src/ui/ProgressBar.tsx`, `src/motion/transitions.ts` and `app/_layout.tsx`.
- **Could not run:** the Maestro flows (no device or emulator). One compound `git diff ... > file` command was refused by the permission layer. I re-ran the diffs as single commands instead, so nothing was lost.
- I edited no repo files and did not change git state.

### ID mapping (same as round 3)

- F1-F18 are as in round 2.
- **F19 = AC-72/73/74** (household onboarding)
- **F20 = AC-69** (Manager naming)
- F21-F24 are as in round 2.
- **F32 = AC-62** (backup v2)
- **F33 = AC-66** (chore-sheet note)
- S-1..S-7 are the round-2 "Should fix" items.
- F31 and F34-F40 are the round-2 task-5 and settings sub-items.

## Finding status

| ID | Finding | Status | Evidence |
|----|---------|--------|----------|
| F1 | v3 migration non-constant default | **FIXED** | `realEngine.test.ts` "v2 -> v3 migration" seeds a real v2 DB and runs `migrate`. |
| F2 | child rebuild wipes history | **FIXED** | Same test: row counts are kept, balances are 6 and 5, and `foreign_key_check` is empty. |
| F3 | chore_child FKs / reassignment | **FIXED** | `realEngine.test.ts` "re-saving a chore with the same assignees" gets 1 live link. |
| F4 | undo then re-tick | **FIXED** | `realEngine.test.ts` "re-tick after undo" gives balances of 5, then 0, then 5. |
| F5 | Board ignores stored completions | **FIXED** | `app/kid/[childId]/index.tsx` uses `family.doneToday` for `done`. |
| F6 | points-OFF "+0" chips | **FIXED** | `showPoints={member.earnsPoints}`. Tested in `rework2.test.tsx` "ChoreCard showPoints=false". |
| F7 | large parts of M3 missing | **FIXED** (except F36) | The household step, settings task 6, the celebrate route, the weekly view, points-fly and all-done confetti are all present. The one remaining gap is F36. |
| F8 | no real-SQL / migration tests | **FIXED** | `__tests__/helpers/realDb.ts` and `__tests__/db/realEngine.test.ts` cover the migration, upserts, soft delete, reset-first load, the lock throw, points-OFF zero and the backup round trip. |
| F9 | soft delete half done | **FIXED** | Covered by the real-engine test "soft-deleted rows are excluded … removing a chore keeps points". |
| F10 | locked member deep link | **FIXED** | `kid/[childId]/index.tsx:50` returns `<Redirect href="/kid" />`. `schedule.tsx` does the same, and the domain layer throws (real-engine test). |
| F11 | AC-64 "unless touched" | **FIXED** | Tested in `rework2.test.tsx` "switching Adult resets points default, unless the toggle was touched". |
| F12 | Adult "Name, null" | **FIXED** | Unchanged. |
| F13 | Adult to Kid silently uses age 7 | **FIXED** | `editors.tsx:66` starts the age as `null`. The Kid chip calls `setAge(null)`. `forms.tsx:102,107` shows "Pick an age", and the first "+" picks the minimum. Tested in `parentFlows.test.tsx:84-87` and `rework2.test.tsx`. |
| F14 | progress target | **FIXED** | `index.tsx:55,73` targets the cheapest reward the member cannot afford yet, and shows "No rewards yet" when there are none. |
| F15 | member cap 8 vs 4 | **FIXED** | 8 everywhere. The export path now caps **live** members only (`backup.ts:16`, a `.refine` on `deletedAt === null`). |
| F16 | earnsPoints boolean / CHECKs | **FIXED** | Unchanged. The migration test asserts `earnsPoints === 1`. |
| F17 | `schema.sql` stale | **FIXED** | `src/db/schema.sql` is deleted, and `design.md:98` now says "migrations.ts (source of truth for the schema; the old schema.sql was removed)". `SCHEMA_SQL` is exported for the migration test. |
| F18 | deviceId not UUIDv4 | **FIXED** | Unchanged. |
| F19 (AC-72/73/74) | household step | **FIXED** | **Navigation:** `onboarding/index.tsx` uses `router.replace('/onboarding/household')` after the PIN confirm, so there is no stale PIN screen on the stack. `household.tsx` uses the spec labels (`presets.ts:4,6`), and Skip selects Family. **Step 5:** resume sets `initial.memberType` from the preset (`:337-338`). **Step 6:** shows the preset chores (`:353`), and the Reward section appears only when the member earns points. **Tests:** `Onboarding.test.tsx` adds 3 S-4 tests, and the Maestro files are updated. |
| F20 (AC-69) | "Manager area" naming | **FIXED** | "Open Manager area" / "Go to the Board". The dead `src/copy/wording.ts` is deleted. |
| F21 | `COPY.pinCreate` | **FIXED** | Unchanged. |
| F22 | "Open parent area" / kid CTA | **FIXED** | See F20. Both e2e flows assert the new labels. |
| F23 | empty / demo / trial copy | **FIXED** | Unchanged. |
| F24 | Members screen labels | **FIXED** | `children.tsx:27` title "Members". |
| S-1 | age default 7 (AC-63) | **FIXED** | See F13. |
| S-2 | onboarding CTA / dead wording.ts | **FIXED** | See F20 and F22. |
| S-3 | "Children" loading title | **FIXED** | `children.tsx:27`. |
| S-4 | finish message kid-directed for Adults | **FIXED** | `copy.ts:42-44` and `finishMessage(child.name, child.memberType)`. Tested in `rework2.test.tsx`. |
| S-5 | delete-chore copy false | **FIXED** | `copy.ts:54` "Points already earned are kept." This matches `removeChore`, as asserted in the real-engine test. |
| S-6 | test gaps | **FIXED** | `rework2.test.tsx` covers `planReset` with points-OFF members, v1 import to Kid with points ON, an Adult round trip, an Adult with an age being rejected, `showPoints=false`, and `pointsTouched`. The real-engine tests cover locked-member and points-OFF behaviour. |
| S-7 | reset after balances; N+1 in toggle | **FIXED** | `family.ts:39-51` applies the reset first and re-reads settings. `accessOnly` (`family.ts:86-89`) is used by `toggleCompletion`. Tested in "a due reset is applied before balances are returned". |
| F31 | Sounds button state | **FIXED** | `settings.tsx:62-65`. |
| F32 (AC-62) | backup v2 + legacy | **FIXED** | Round-3 B-2 is closed: a live-only cap, plus the real-engine "9 members ever (8 live + 1 removed)" export → parse → import test, with equal balances and an empty FK check. Import re-seeds `lastResetBoundaryAt`, clears `pendingResetNotice` (tested), and reconciles the OS reminder (`reconcileReminder`). |
| F33 (AC-66) | chore-sheet note | **FIXED** | Unchanged. |
| F34 | task 5 kid experience | **FIXED** (except F36) | See F35, F37, F40 and round-2 F38. |
| F35 | points fly + counter tick | **FIXED** | `PointsCounter` ticks and plays `points_tick` through `onTick`. `PointsFly` carries the chore's real points (`index.tsx:100`) and plays `points_fly`. |
| F36 | progress fill + milestone (ux M3) | **STILL FAILING** | The fill animates (`ProgressBar.tsx:32`), but the M3 "becoming affordable" milestone can never happen on the board. `index.tsx:55` picks only rewards with `cost > points`, so the jar is never full and `ProgressBar` never shows "Ready!". When a tick makes a reward affordable, the bar just switches to the next reward. There is no `milestone` cue on reaching affordability: `play('milestone')` at `:38` fires only on all-done. `design.md` task 5 lists "progress fill + milestone (M3)" in this milestone. |
| F37 | all-done celebration | **FIXED** | `index.tsx:25-41`: Confetti and the `milestone` cue fire on the transition to all-done. The `null` baseline keeps an already-finished board quiet (round-3 N-2 fixed). |
| F39 | transitions (ux M7) | **UNVERIFIED** | No changed file touches transitions. `app/_layout.tsx:47` applies `transitionFor('kidForward')`, a 280 ms `slide_from_right` with a Reduce Motion fade. The shared-element avatar expansion and the PIN "gate-door" sheet cannot be checked statically. This needs a device check by QA. |
| F40 | weekly schedule view | **FIXED** | `app/kid/[childId]/schedule.tsx` shows 7 days from `weekStartsOn`, reached through "This week". It redirects missing or locked members (round-3 S-5 fixed). |

**Round-2 and round-3 IDs not in the engine's list (for completeness):**
- **F27/F30 (settings task 6): FIXED.**
  - AC-41 confirm: `settings.tsx` `ConfirmDialog` with `periodLabel`.
  - AC-42 notice: `parent/index.tsx:61,87`, with Dismiss.
  - Change PIN, Daily reminder, Export/Import and About are each implemented as a screen under `app/parent/`.
- **F38 (redeem celebration): FIXED.** `rewards.tsx:20` replaces to `/kid/[childId]/celebrate` with the reward name. `celebrate.tsx` plays `reward_redeem` and returns to `/kid/${childId}`.
- **Round-3 B-1 (Maestro flows): FIXED statically.**
  - `onboarding_flow.yaml` now has the Skip, "Increase Age" and "Open Manager area" steps.
  - `household_preset.yaml` asserts "Who's helping out?" and taps "Name" before `inputText`.
  - Neither flow could be run. See S-1 below.
- **Round-3 B-2: FIXED** (see F32).
- **Round-3 S-1 (change-pin): FIXED.** It uses `ParentScreen` with Back, wraps `setPin` in try/catch, and shows "PIN changed".
- **Round-3 S-2 / S-3 / S-4 / S-5: FIXED** (see F32, F35, F19 and F40).
- **Round-3 N-2, N-3, N-4, N-5: FIXED.**
- **Round-3 N-1:** mostly fixed. `rewards.tsx:20` is still one long line.
- **Round-3 N-6 and N-7:** still open. They are carried below as nits.

## Blockers

**B-1 (F36). The honey jar never reaches "Ready!", and there is no affordability milestone (ux M3, design task 5).**
- **Where:** `app/kid/[childId]/index.tsx:55,70-71`
- **Problem:** `nextReward` is always a reward the member cannot afford yet. So:
  - the "becoming affordable" moment that ux M3 specifies (jar fills to full, "Ready!", `milestone` cue) never occurs;
  - the member gets no signal that a reward just became available. The only sign is the "Get it!" button, two screens away.
- **Fix (about 15 lines):**
  1. Remember the previous balance in a ref. On a balance change, find any reward where `prev < cost <= points`.
  2. If there is one, `play('milestone')`, and briefly keep the target at that reward with `<ProgressBar … affordable />` so the jar fills to full and shows "Ready!". Then move on to the next reward on the next focus or reload.
  3. If no reward is affordable, keep today's behaviour.
  4. Add a component test: from a balance of 8 with a reward costing 10, ticking a 5-point chore plays `milestone` and shows "Ready!".
- **Alternative:** if the EM decides the lid/shimmer flourish is post-M3 polish, record that in `design.md` task 5. Even then, the `milestone` cue and "Ready!" state should ship, because the reward progress bar is otherwise misleading at the exact moment it matters.

## Should fix

- **S-1 `e2e/household_preset.yaml:28-31`:**
  - **Problem:**
    - The flow taps "Save" right after `inputText` without dismissing the keyboard. `onboarding_flow.yaml` uses `tapOutside` for exactly this reason.
    - `assertVisible: "Dishes"` will probably not match. The chip's text is "🍽️ Dishes 5" and its accessibility label is "Dishes, 5 points" (`onboarding/index.tsx:355-356`), and Maestro matches the whole string as a regex.
  - **Fix:** Add `- tapOutside` before Save. Assert `"Dishes, 5 points"` or `".*Dishes.*"`.
  - Note that QA (`qa-m3.md:136`) has not yet run any Maestro flow on a device. Run both flows once before M4.
- **S-2 `app/parent/change-pin.tsx:21`:**
  - **Problem:** `setTimeout(() => router.back(), 1200)` is never cleared. If the manager taps Back during the 1.2 s window, the timer runs `router.back()` a second time. That pops out of `/parent`, so the parent layout locks and the manager lands on the kid board.
  - **Fix:** Keep the timer in a ref, clear it in an unmount effect, and guard with `navigation.isFocused()`. Alternatively, navigate back immediately and show "PIN changed" on Settings.
- **S-3 `app/parent/backup.tsx:28,47`:**
  - **Problem:**
    - The export JSON is written to `cacheDirectory` and never deleted. It contains the family's names and history.
    - `size ?? 0` skips the 5 MB guard when the picker does not report a size.
  - **Fix:**
    - Call `FileSystem.deleteAsync(uri, { idempotent: true })` after `shareAsync` resolves, in a `finally`.
    - When `size` is undefined, run `FileSystem.getInfoAsync(uri)` and check its `size` before `readAsStringAsync`.

## Nits

- **N-1:** `app/parent/settings.tsx:23-31` (`saveReset`), the Sounds toggle at `:64`, and the dashboard Dismiss at `parent/index.tsx:87` have no `catch`. A DB error becomes an unhandled rejection with no message. Wrap each one and `setMessage('Could not save. Try again.')`.
- **N-2:** `src/ui/forms.tsx:102` hard-codes "Pick an age" in the generic `Stepper`. Add an `emptyLabel` prop; only the Age stepper needs it today.
- **N-3:** `app/onboarding/index.tsx:199,337`: `key={presetKey}` remounts `ChildForm` when the async settings read resolves. Anything typed in the first few ms is lost. Render step 5 only after the preset has loaded.
- **N-4:** `app/kid/[childId]/rewards.tsx:20` is still a single minified line. Run prettier on it.
- **N-5 (carried):**
  - `ChoreCard.tsx:30` still announces points for points-OFF members. Pass `showPoints ? points : 0`.
  - The `chore_child` soft deletes at `family.ts:109` and `chore.ts:73` do not bump `updatedAt`, so sync will miss them.
  - `ExportInput = any` (`backup.ts:20`).
- **N-6 (carried):** Settings gives no feedback after a reset frequency is saved. Confirm in `ux.md` that the selected chip is enough.
- **N-7:** `design.md:94-96` does not list `kid/[childId]/schedule.tsx` or `parent/{backup,reminder,change-pin}.tsx` in the folder layout. Add them so the layout stays the source of truth.

## Security notes

- **Secrets and endpoints:** none in code. The only external URL is the privacy link in `parent/about.tsx`, which is reachable only inside the PIN-gated `/parent` stack (`parent/_layout.tsx`). Kid routes contain no links or prices.
- **SQL:** `backupIo.ts` interpolates table and column names only from the fixed in-code `TABLES` map and literal arrays. Every value is a bound parameter, so there is no injection path.
- **Import:**
  - It validates with zod: types, ranges, the HH:MM regex, referential integrity and the live-member cap.
  - It requires an explicit "Replace" confirmation.
  - It runs in one transaction, never touches PIN, premium or trial state, and has a 5 MB size guard (see S-3 for the undefined-size gap).
- **Export:** it never reads the PIN (stored in secure-store) or the entitlement and trial fields, because settings are mapped explicitly. The leftover cache file is covered in S-3.
- **Change PIN:** it requires the current PIN through `verifyPin`, which keeps the 5-fail / 30 s cooldown. The onboarding resume gate is skipped only when the session is already unlocked by PIN creation, so there is no bypass.
- **Notifications:** permission is requested only when the reminder is turned on. `reconcileReminder` never prompts.
- **Dependencies:** none added. The `expo-notifications`, `expo-document-picker`, `expo-sharing`, `expo-file-system` and `expo-constants` versions match SDK 52, and `expo-file-system` ~18 still has the legacy API used here.

## Verdict

**Strong rework.** Every blocker from round 3 is closed:
- Both Maestro flows are corrected statically.
- The backup cap applies to live members only, with a real-engine round-trip test.
- `schema.sql` is removed and `design.md` updated.
- Import re-seeds the reset boundary and reconciles the reminder.
- Change PIN is a complete screen.
- PointsFly carries real points.
- The household step uses `replace` and has unit tests.

`tsc` is clean and 344 tests pass.

One deliverable that `design.md` assigns to this milestone is still missing: the ux M3 "becoming affordable" milestone (F36). The board's target logic makes the "Ready!" state unreachable, and no `milestone` cue plays when a reward becomes affordable. It is a small, contained fix (B-1). Alternatively, the EM can formally defer the flourish while the cue and "Ready!" state ship.

Statuses for the 40 listed IDs:
- **38 FIXED**
- **1 STILL FAILING:** F36
- **1 UNVERIFIED:** F39 (needs a device check)

VERDICT: FAIL

REQUEST CHANGES
