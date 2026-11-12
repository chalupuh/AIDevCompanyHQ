# Code Review: Milestone 3 (Kids use the board, parent settings), round 3

**Feature:** HiveBoard / family-chore-board · **Reviewer:** code-reviewer · **Date:** 2026-11-12
**Scope:** Re-check after rework round 2. Diff `5cc3078..HEAD` (`81a58fc`): 33 files, +773/-108. I read every changed file in full. The working tree is clean.
**Previous report:** `family-chore-board.review-m3-round2.md` (REQUEST CHANGES)
**Design / spec:** `family-chore-board.design.md` (M3 tasks 5, 5b, 6) · `family-chore-board.md` (AC-37..AC-42, AC-61..AC-74)

## How this review was done

- `git diff --stat 5cc3078 HEAD`, plus a full diff of `app/`, `src/`, `e2e/` and `__tests__/`.
- `npx jest`: **25 suites, 339 tests, all passing.** This includes the new `__tests__/db/realEngine.test.ts`, which runs on the real `node:sqlite` engine under Node 24.
- `npx tsc --noEmit`: **0 errors.**
- I checked by hand that the column lists in `backupIo.ts` `TABLES` match `SCHEMA_SQL` plus `V3_MIGRATION_SQL`. They match.
- `package.json` already declares the new native modules: `expo-notifications`, `expo-document-picker`, `expo-sharing`, `expo-file-system` and `expo-constants`.
- I could not run the Maestro flows (no device or emulator). I reviewed the e2e YAML statically against the screen copy.
- I did not edit any repo files and did not change git state.

### ID mapping

The engine's list numbers the round-2 table rows by position:
- F1-F18 are as in round 2.
- **F19 = AC-72** (household onboarding)
- **F20 = AC-69** (Manager naming)
- F21-F24 are as in round 2.
- **F32 = AC-62** (backup v2)
- **F33 = AC-66** (chore note)
- S-1..S-7 are the round-2 "Should fix" items.

The round-2 rows F25-F30 and F38 are not in the engine's list. For completeness I report them in a separate table at the end of the status section.

## Finding status

| ID | Finding | Status | Evidence |
|----|---------|--------|----------|
| F1 | v3 migration non-constant default | **FIXED** | `realEngine.test.ts:19-45` seeds a real v2 DB and runs `migrate`. Row counts and balances are preserved and `foreign_key_check` is empty. |
| F2 | child rebuild wipes history | **FIXED** | Same test: 2 children, 3 completions and 1 redemption survive. The balances are 6 and 5. |
| F3 | chore_child loses FKs / reassignment breaks | **FIXED** | `realEngine.test.ts:60-67` re-saves a chore with the same assignees and gets 1 live link. |
| F4 | undo then re-tick never completes | **FIXED** | `realEngine.test.ts:48-58` gets a balance of 5, then 0, then 5 on the real engine. |
| F5 | Board ignores stored completions | **FIXED** | Unchanged from round 2 (`family.ts` `doneToday`; `kid/[childId]/index.tsx:35`). |
| F6 | points-OFF members see "+0" | **FIXED** | Unchanged. Now tested in `rework2.test.tsx:86-92`. |
| F7 | large parts of M3 missing | **FIXED** | The household step is wired in. Settings task 6 is complete. The kid experience (counter ticks, points-fly, all-done confetti, celebrate route, weekly view) is present. Only F36 and F39 remain unverified (see below). |
| F8 | no real-SQL / migration tests | **FIXED** | `__tests__/helpers/realDb.ts` wraps `node:sqlite`. `realEngine.test.ts` covers the migration, re-tick, re-save, soft-delete exclusion, reset-first load, the lock throw and points-OFF zero. |
| F9 | soft delete half done | **FIXED** | Unchanged from round 2. `realEngine.test.ts:69-83` now covers it. |
| F10 | locked member deep link | **FIXED** | `kid/[childId]/index.tsx:28` now returns `<Redirect href="/kid" />` (round-2 N-1 also fixed). `realEngine.test.ts:102-113` checks that the domain layer throws. |
| F11 | AC-64 "unless touched" | **FIXED** | Unchanged. Tested in `rework2.test.tsx:109-123`. |
| F12 | Adult renders "Name, null" | **FIXED** | Unchanged (`children.tsx:63`). |
| F13 | Adult to Kid silently uses age 7 | **FIXED** | `editors.tsx:66`: the age starts as `null`. `:93`: the Kid chip calls `setAge(null)`. `:94` plus `forms.tsx:102`: the Stepper shows "Pick an age", and its first "+" picks the minimum. Tested in `rework2.test.tsx:96-107` and `parentFlows.test.tsx:84-87`. |
| F14 | progress target | **FIXED** | Unchanged. "No rewards yet" is now shown when there are no rewards (`index.tsx:32`; round-2 N-2 fixed). |
| F15 | member cap 8 vs 4 | **FIXED** | Unchanged (8 everywhere). The export path has a related new bug: see B-2. |
| F16 | earnsPoints boolean / CHECKs | **FIXED** | Unchanged. The migration test confirms `earnsPoints === 1` after upgrade. |
| F17 | `src/db/schema.sql` stale | **STILL FAILING** | `src/db/schema.sql:1` still reads "HiveBoard SQLite Schema (version 1)". The file is not in the changed set, yet `design.md:98` lists it as part of `src/db/`. |
| F18 | deviceId not UUIDv4 | **FIXED** | Unchanged from round 2. |
| F19 (AC-72/73/74) | household step unreachable | **FIXED** (code); e2e broken, see B-1 | `onboarding/index.tsx:309` pushes `/onboarding/household` after the PIN confirm. `household.tsx` uses the spec labels (`presets.ts:4-6`), adds **Skip**, which sets Family (`household.tsx:143-148`), and resumes at step 5. `index.tsx:337-338` passes `initial.memberType` from the preset. `:353` shows the preset chores. `:362-377` shows the Reward section only when the member earns points. No unit test covers the routing or the conditional reward section, and the new Maestro flow cannot pass (B-1). |
| F20 (AC-69) | "Manager area" naming | **FIXED** | `onboarding/index.tsx:398` "Open Manager area". The dead `src/copy/wording.ts` is deleted. |
| F21 | `COPY.pinCreate` | **FIXED** | `copy.ts:7`. |
| F22 | "Open parent area" / kid-directed CTA | **FIXED** | `onboarding/index.tsx:393,398` "Go to the Board" / "Open Manager area". |
| F23 | empty/demo/trial copy | **FIXED** | Unchanged. |
| F24 | Members screen labels | **FIXED** | `children.tsx:27` title "Members". |
| S-1 | age default 7 (AC-63) | **FIXED** | See F13. |
| S-2 | onboarding CTA copy / dead wording.ts | **FIXED** | See F20/F22. |
| S-3 | "Children" loading title | **FIXED** | `children.tsx:27`. |
| S-4 | finish message kid-directed for Adults | **FIXED** | `copy.ts:42-44` chooses the message by `memberType`; `onboarding/index.tsx:388` passes it. Tested in `rework2.test.tsx:80-83`. |
| S-5 | delete-chore copy false | **FIXED** | `copy.ts:54` "Points already earned are kept." This matches `removeChore`, and `realEngine.test.ts:79` asserts that points are kept. |
| S-6 | test gaps | **FIXED** | `rework2.test.tsx` covers: `planReset` with points-OFF; v1 import mapping to Kid with points ON; an Adult round trip; an Adult with an age being rejected; `ChoreCard` with `showPoints=false`; `pointsTouched`. `realEngine.test.ts:115-123` covers points-OFF zero, and `:102-113` covers the lock throw. |
| S-7 | reset applied after balances; N+1 in toggle | **FIXED** | `family.ts:39-50` plans and applies the reset first and re-reads settings, and only then computes balances. `family.ts:86-89` adds `accessOnly`, which `toggleCompletion` uses at `:132`. Tested in `realEngine.test.ts:85-100`. |
| F31 | Sounds button state | **FIXED** | Unchanged (`settings.tsx`). |
| F32 (AC-62) | backup v2 + legacy migration | **FIXED** (schema/mapping) | `backup.ts` v1-to-v2 mapping is tested. The new Export/Import I/O has its own defects: see B-2 and S-2. |
| F33 (AC-66) | chore-sheet note | **FIXED** | Unchanged. |
| F34 | Task 5 kid experience | **FIXED** | See F35, F37, F38 and F40. |
| F35 | points fly + counter tick | **FIXED** | `PointsCounter.tsx:37-62` already ticks (my round-2 note was wrong on this point). It is now wired to the `points_tick` cue (`index.tsx:31`). `PointsFly` fires on a completion that earns points (`index.tsx:33,35`). See S-3 for the hard-coded "+1". |
| F36 | progress fill + milestone | **UNVERIFIED** | The `ProgressBar` fill animates (`ProgressBar.tsx:32`). I found no separate cue for reaching the reward target. `ProgressBar.tsx` is not in the changed set. |
| F37 | all-done celebration | **FIXED** | `index.tsx:24` adds Confetti and the `milestone` cue on the transition to all-done. See N-2. |
| F39 | transitions | **UNVERIFIED** | No changed file touches screen transitions. Only `app/parent/_layout.tsx:74` sets `animation: 'fade'`. Transitions cannot be checked statically. |
| F40 | weekly schedule view | **FIXED** | `app/kid/[childId]/schedule.tsx` shows 7 days from `weekStartsOn`. It is reachable through "This week" (`index.tsx:32`). |

**Round-2 IDs not in the engine's list (for completeness):**
- **F27/F30 (settings task 6): FIXED.**
  - AC-41 confirm: `settings.tsx:15` `ConfirmDialog`, using `periodLabel`.
  - AC-42 notice: `parent/index.tsx:61,87` with `formatResetNotice`, and Dismiss clears it.
  - Change PIN is a real flow: `parent/change-pin.tsx` (see S-1).
  - Reminder: `parent/reminder.tsx`.
  - Export/Import: `parent/backup.tsx` + `src/data/backupIo.ts`.
  - About: `parent/about.tsx`, behind the PIN.
- **F38 (redeem celebration): FIXED.** `rewards.tsx:17` replaces to `/kid/[childId]/celebrate` with the reward name, and `celebrate.tsx:8` returns to `/kid/${childId}`.

## Blockers

**B-1. Both Maestro onboarding flows fail deterministically.**

`e2e/onboarding_flow.yaml` (AC-1/2/34/43 regression):
- **Problem:**
  1. After the PIN confirm (`:39-44`), the app now lands on "What kind of household?". The flow asserts "Who's helping out?" (`:46`) and stops there.
  2. Even past that point, `:52` taps Save without choosing an age. Because of the F13 fix, validation now blocks that save.
  3. `:64` still asserts "Open parent area", but the button now reads "Open Manager area".
- **Fix:**
  1. Add `assertVisible: "What kind of household?"` and `tapOn: "Skip"` (or "Family with kids" then "Continue") after the PIN.
  2. Add `tapOn: "Increase Age"` before Save.
  3. Change `:64` to `"Open Manager area"`.

`e2e/household_preset.yaml:25` asserts "Add your first":
- **Problem:** That string exists only in `COPY.emptyDashboard`. Step 5 shows `COPY.firstChild`, "Who's helping out?". Also, `:27` `inputText` has no preceding `tapOn: "Name"`, so nothing has focus.
- **Fix:** Assert "Who's helping out?", and add `tapOn: "Name"` before `inputText`.

**B-2. A backup can be impossible to re-import once more than 8 members have ever existed.**

- **Where:** `src/data/backupIo.ts:11` (`SELECT * FROM ${t}`) exports soft-deleted rows as well. `src/domain/backup.ts:16` validates `children: z.array(child).max(8)`.
- **Problem:** A household with 8 live members and one removed member, or one that removes and re-adds members over time, produces an export that its own `parseImport` rejects with "Import failed". The user only finds out when restoring after losing a device. That is data loss in the feature this milestone ships.
- **Fix:**
  1. Apply the cap to live members only, for example `.superRefine(arr => arr.filter(c => c.deletedAt === null).length <= 8)`. Alternatively, leave soft-deleted rows out of the export, keeping only the ledger rows that live balances need. Keeping them is preferable for sync.
  2. Add a real-engine test: create 8 members, remove 1, add 1, then `exportAll` → `serializeExport` → `parseImport` → `importAll`, and assert that the balances are equal.

## Still failing from the ID list

**F17.** `src/db/schema.sql:1` is still a stale v1 schema that `design.md:98` names as part of `src/db/`.
- **Fix:** Regenerate it from `SCHEMA_SQL` + `V3_MIGRATION_SQL` (and the v2 `onboardingCompleted` column) and label it "version 3". Alternatively, delete it and update `design.md:98` to say `migrations.ts` is the source of truth.
- This is a 5-minute fix, but it was flagged in round 1 and round 2.

## Should fix

- **S-1 `app/parent/change-pin.tsx:5`:**
  - There is no title, Back or Cancel. The screen is a bare `SafeAreaView`, so on iOS the manager can only leave by finishing the flow.
  - `setPin` failures are unhandled: the promise rejects and the user gets no message.
  - There is no success confirmation.
  - The file is also a single minified line.
  - **Fix:** Wrap it in `ParentScreen title="Change PIN" onBack={router.back}`. Wrap `setPin` in try/catch and show "Couldn't save your PIN. Try again." Show "PIN changed" before going back. Format the file.
- **S-2 `src/data/backupIo.ts:56-63` (import):**
  - The import writes `notifyEnabled`/`notifyTime` without scheduling or cancelling the OS notification. Settings can then say "Reminder: On" while nothing is scheduled, or the reverse.
  - It also keeps this device's `lastResetBoundaryAt` while it may change `pointsResetFrequency` and `weekStartsOn`. With a `null` boundary `planReset` is a no-op forever (`resets.ts:71-72`); with a stale one the reset can fire immediately.
  - **Fix:** Inside the import, set `lastResetBoundaryAt: seedBoundary(Date.now(), freq, weekStartsOn)` and `pendingResetNotice: null`. After the import, have `backup.tsx` reconcile notifications: cancel all, then reschedule if the reminder is enabled and permission is granted (extract `schedule()` from `reminder.tsx` into `src/notify/`).
  - There are no tests for `exportAll`/`importAll` at all. Add the round trip from B-2.
- **S-3 `app/kid/[childId]/index.tsx:33`:** `PointsFly` uses `points={1}`, so every chore flies "+1" whatever its value. Store the points with the fly trigger (`setFly({ n: x.n + 1, points: chore.points })`) and pass them through. Also play the `points_fly` cue, which exists in `cues.ts:13`.
- **S-4 `app/onboarding/household.tsx:19` / `onboarding/index.tsx:61`:**
  - The `resume: 'member'` param is never read. The resume works only because a PIN exists, and the comment says "explicit" when it is not.
  - `router.push` followed by `router.replace('/onboarding')` leaves the old flow instance, still at the PIN step, on the stack. Back from step 5 returns to a PIN-confirm screen whose `setInitialPin` throws "PIN already set" and jumps to `/parent` with `onboardingCompleted=0`.
  - **Fix:** Navigate with `router.replace('/onboarding/household')` from the PIN step. Alternatively, render the household step inline as a step in `OnboardingFlow`, which is simpler.
  - Add an `Onboarding.test.tsx` case for: PIN confirm leads to household; Continue resumes at step 5 with the preset `memberType`; an Adult means no Reward heading.
- **S-5 `app/kid/[childId]/schedule.tsx:14`:** A locked member (demo mode) is not redirected, and an unknown id renders a blank screen (`return null`). Mirror the board: `<Redirect href="/kid" />` for a missing or locked member.

## Nits

- **N-1:** `app/parent/settings.tsx:12-15`, `change-pin.tsx`, `celebrate.tsx` and `kid/[childId]/index.tsx` are still minified one-liners (round-2 N-6). Run prettier.
- **N-2:** `kid/[childId]/index.tsx:20,24`: `wasAllDone` starts as `false`, so opening a board that is already all-done fires confetti and the cue on every mount. Initialise it from the first ready state, or only celebrate after a tap in this session.
- **N-3:** `celebrate.tsx:8` plays no `reward_redeem` cue (`cues.ts:16`, 2.5 s, designed for this screen).
- **N-4:** `__tests__/domain/rework2.test.tsx:57` `age: 30 > 12 ? 9 : 9` is a confusing literal. Write `age: 9`.
- **N-5:** `realEngine.test.ts:92-95` depends on the wall clock (`Date.now() + 90 days`) because `addCompletion` stamps `createdAt` with `Date.now()`. Pass `now` through `toggleCompletion` so that the test is deterministic.
- **N-6:** `app/parent/settings.tsx` no longer gives any feedback after saving a reset frequency (the old "Reset turned off." message was removed). The selected chip is enough, but say so in the UX doc.
- **N-7 (carried):** Round-2 N-3 (`ChoreCard` announcement speaks points for points-OFF members), N-4 (`chore_child` soft delete without `updatedAt`) and N-5 (`ExportInput = any`, `backup.ts:20`) are untouched.

## Security notes

- No secrets in code. The only new external link is the privacy URL in `about.tsx`, reachable only inside the PIN-gated `/parent` stack.
- SQL: `backupIo.ts:11,46,53` interpolates table and column names only from fixed in-code lists (`TABLES`, the literal arrays). All values are bound parameters. No injection path.
- Import validates with zod: types, ranges and the HH:MM regex, plus referential integrity (`refs`). It never touches PIN, premium or trial fields. Import also requires an explicit "Replace" confirmation and runs inside a single transaction, so a failure rolls back.
  - Residual risk: `readAsStringAsync` has no size limit. A very large file is read into memory before parsing. Consider a size check on `res.assets[0].size` (for example 5 MB).
- Change PIN requires the current PIN through `verifyPin`, which keeps the 5-fail / 30 s cooldown, before `setPin`. That is correct.
- `onboarding/index.tsx:129` skips the resume PIN gate only when the session is already unlocked, which is set at PIN creation. This is acceptable: it cannot be reached without the PIN.
- The notification permission is requested only when the reminder is turned on (`reminder.tsx:60-62`), and a denied state links to the OS settings.
- No new dependencies beyond those already declared in `package.json`.

## Verdict

This round closes nearly everything from round 2:
- The household onboarding step is wired in end to end.
- Settings task 6 is complete: the AC-41 warning, the AC-42 notice, a real Change PIN, Reminder, Export/Import and About.
- The kid-experience pieces are in place.
- Copy is fixed.
- Most importantly, there is now a real-SQLite test suite covering the migration and the soft-delete and upsert behaviour.

Jest is green (339 tests) and tsc is clean.

The milestone cannot be approved yet:
- **B-1:** Both Maestro onboarding flows will fail on a device.
- **B-2:** An exported backup can be rejected by its own importer once more than 8 members have ever existed.
- **F17** is still failing (`schema.sql` is stale).

All three are small, contained fixes.

Statuses for the 40 listed IDs:
- **37 FIXED**
- **1 STILL FAILING:** F17
- **2 UNVERIFIED:** F36, F39

VERDICT: FAIL

REQUEST CHANGES
