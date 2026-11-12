# Code Review: Milestone 3 (Kids use the board, parent settings), round 2

**Feature:** HiveBoard / family-chore-board · **Reviewer:** code-reviewer · **Date:** 2026-11-12
**Scope:** Re-check after rework round 1. Baseline is HEAD `78cb482`. The 25 changed files listed by the engine were read in full.
**Previous report:** `family-chore-board.review-m3-round1.md` (REQUEST CHANGES)
**Design / spec:** `family-chore-board.design.md` (Milestone 3 tasks 5, 5b, 6) · `family-chore-board.md` (AC-61..AC-74 and revised criteria)

## How this review was done

- **Git:** All `git` commands were refused in this session (`git -C ... status/log/diff`, and `cd ... && git ...`). I therefore reviewed the current contents of every changed file and compared them with the round-1 findings. Line numbers refer to the current files.
- **Real SQLite run:** I ran the actual `SCHEMA_SQL` and `V3_MIGRATION_SQL` strings from `src/db/migrations.ts` against real SQLite (Node 24 `node:sqlite`), using a scratch script outside the repo. The upgraded DB was seeded with 1 child, 1 chore, 1 link, 1 completion, 1 redemption and 1 adjustment. Results:
  - Row counts before and after the migration were identical (1/1/1/1/1).
  - `PRAGMA foreign_key_check` returned 0 rows.
  - The upgraded child became `memberType='kid'`, `earnsPoints=1`, `updatedAt=createdAt`.
  - The rebuilt `chore_child` table has foreign keys to `child` and `chore`.
  - Re-ticking after undo gives 1 live completion row.
  - Re-saving a soft-deleted chore link gives 1 live link row.
  - A fresh install runs v1, v2 and v3 cleanly.
  - An Adult with an age is rejected by a CHECK constraint.
- **Tests and type check:** `npx jest` passed (23 suites, 320 tests). `npx tsc --noEmit` reported 0 errors.
- I edited no repo files.

### ID mapping

The engine's IDs map to the round-1 report in order:
- **F1-F8** are B-1..B-8. **F9-F18** are S-1..S-10.
- The remaining IDs are the bullets of B-7, in order:
  - **AC-72**: onboarding
  - **AC-69**: copy, with sub-items F21 `pinCreate`, F22 "Open parent area", F23 empty/demo/trial copy, F24 Members screen labels, F25 validation messages
  - **AC-37**: resets
  - **F27**: settings task 6, with sub-items F28 chips not selected, F29 no `seedBoundary`, F30 missing AC-41 warning / AC-42 notice / Change PIN / reminder / Export-Import / About, F31 Sounds state
  - **AC-62**: backup v2
  - **AC-66**: chore-sheet note
  - **F34**: Task 5 kid experience, with sub-items F35 points fly and counter tick, F36 progress fill and milestone, F37 all-done celebration, F38 `celebrate.tsx` redeem celebration, F39 transitions, F40 weekly schedule view

## Finding status

| ID | Round-1 finding | Status | Evidence |
|----|-----------------|--------|----------|
| F1 | B-1 v3 migration fails (non-constant default) | **FIXED** | `migrations.ts:104,118,126,136,141,146,151,156` use `DEFAULT 0` and then backfill. Ran cleanly in real SQLite (upgrade and fresh install). |
| F2 | B-2 child rebuild wipes history | **FIXED** | `migrations.ts:176-178` turns FKs off before the transaction. `:219-224` runs `foreign_key_check` and throws on violations. `:229-236` turns FKs back on, including on failure. Real-SQLite row counts were unchanged and the FK check was empty. |
| F3 | B-3 chore_child loses FKs; reassignment breaks | **FIXED** | `migrations.ts:123-129` restores the REFERENCES clauses. `chore.ts:94-119` upserts with `ON CONFLICT ... deletedAt = NULL` and soft-deletes only the links that were dropped. Verified in real SQLite. |
| F4 | B-4 undo then re-tick never completes | **FIXED** | `ledger.ts:36-55` uses an `ON CONFLICT(choreId, childId, date) DO UPDATE SET deletedAt = NULL`. Verified in real SQLite (1 live row). |
| F5 | B-5 Board ignores stored completions | **FIXED** | `family.ts:55-61` builds `doneToday`. `app/kid/[childId]/index.tsx:22,28` renders `done` from it. |
| F6 | B-6 points-OFF members see "+0" chips | **FIXED** | `ChoreCard.tsx:14,37,53-59` adds `showPoints`; the board passes `showPoints={member.earnsPoints}`. See N-3 for the remaining a11y detail. |
| F7 | B-7 large parts of M3 missing | **STILL FAILING** | Household step is not wired in (AC-72). Settings task 6 is still incomplete (F30). Kid-experience pieces are missing (F35, F37, F38, F40). Details below. |
| F8 | B-8 no migration test on an M2-shaped DB, no real-SQL tests | **STILL FAILING** | `__tests__/db/repos.test.ts:9-18` still uses `mockDb()`. Test `:95` only checks the SQL text. No test runs the migration on a v2 DB. The fact that the SQL is correct was established by this review's manual run, not by the suite. |
| F9 | S-1 soft delete half done | **FIXED** | `family.ts:97-120` soft-deletes links, completions, redemptions and adjustments in one transaction. `chore.ts:69-80` soft-deletes the chore and its links. `removeReward` soft-deletes. Copy mismatch: see S-5. |
| F10 | S-2 locked member reachable by deep link | **FIXED** | `app/kid/[childId]/index.tsx:21` redirects a locked member. `family.ts:126` throws for a locked member or chore. See N-1. |
| F11 | S-3 AC-64 "unless touched" | **FIXED** | `editors.tsx:68,92,94` adds a `pointsTouched` guard. |
| F12 | S-4 Adult renders "Name, null" | **FIXED** | `children.tsx:63`. |
| F13 | S-5 Adult to Kid silently uses age 7 | **STILL FAILING** | `editors.tsx:92` Kid chip calls `setAge(7)`, and `:65` defaults to 7. AC-63 says "switching from Adult to Kid requires an age before saving". A preset 7 means the user is never made to choose. |
| F14 | S-6 progress target is the most expensive reward | **FIXED** | `app/kid/[childId]/index.tsx:24` targets the cheapest reward that is not yet affordable, with an "Everything is affordable!" state. See N-2. |
| F15 | S-7 member cap 8 vs 4 inconsistent | **FIXED** | It is now consistent at 8: `backup.ts:16-17` `.max(8)`, `copy.ts:19,21,24`, `backup.test.ts:92`. |
| F16 | S-8 earnsPoints 0/1 vs boolean; missing CHECKs | **FIXED** | `child.ts:31-33` normalizes to a boolean. `migrations.ts:99,106` add CHECKs; the Adult-with-age insert was rejected in real SQLite. |
| F17 | S-9 `schema.sql` stale | **STILL FAILING** | `src/db/schema.sql:1` still says "(version 1)". The file is not in the changed set. |
| F18 | S-10 deviceId not UUIDv4 | **FIXED** | `migrations.ts:209-215` uses `Crypto.randomUUID()`. |
| AC-72 | Onboarding "What kind of household?" | **STILL FAILING** | `app/onboarding/household.tsx` exists, but nothing navigates to it: no reference anywhere in `app/` or `src/`. Onboarding goes from PIN (step 4) to step 5 (`onboarding/index.tsx:305`). The labels do not match the spec ("Family" / "Property"), and there is no **Skip**. The preset never sets the first-member default (`index.tsx:321` `ChildForm` has no `initial`). The first-chore step still uses the generic `choreSuggestions` (`index.tsx:337`), not the preset's chores (AC-73). Reward chips are unconditional (`index.tsx:349`, AC-74). |
| AC-69 | "Manager area" naming everywhere | **STILL FAILING** | `onboarding/index.tsx:381` still says "Open parent area". `src/copy/wording.ts` is never imported (dead). |
| F21 | `COPY.pinCreate` | **FIXED** | `copy.ts:7` |
| F22 | "Open parent area" button | **STILL FAILING** | `onboarding/index.tsx:381` is unchanged. `:377` "Go to kid view" is not neutral for Adult-first households (AC-70). |
| F23 | empty / demo / trial copy | **FIXED** | `copy.ts:13-24` now says "member" or "members". |
| F24 | Members screen labels | **STILL FAILING** | The labels flagged in round 1 (`:45,55,76,78`) are fixed, but the loading and error state title is still "Children" (`children.tsx:27`). This is a one-word fix. |
| F25 | validation messages | **FIXED** | `validation.ts:27-28` |
| AC-37 | resets ignore earnsPoints and never run | **FIXED** | `resets.ts:49,88-89` skips points-OFF members. `family.ts:74-80` applies the reset atomically on load. No test covers the `earnsPoints` filter: see S-6. |
| F27 | Settings task 6 | **STILL FAILING** | `app/parent/settings.tsx` still lacks several pieces: see F30. |
| F28 | chips never `selected` | **FIXED** | `settings.tsx:15` |
| F29 | frequency / week change does not seed the boundary | **FIXED** | `settings.tsx:14` calls `seedBoundary(...)` on every reset or week-start change. |
| F30 | AC-41 warning, AC-42 notice, Change PIN, reminder, Export/Import, About | **STILL FAILING** | No "Unspent points will be set to 0... Continue?" confirm (AC-41). `pendingResetNotice` is written (`family.ts:78`) but never read or shown (AC-42). "Change PIN" goes to `/onboarding`, which redirects a completed install to `/kid` (`onboarding/index.tsx:56-57,110-111`), so it ejects the manager instead of changing the PIN. There is no reminder setting and no Export/Import UI (`buildExport` and `parseImport` have no callers in `app/`). "About" only sets a message. |
| F31 | Sounds button has no state | **FIXED** | `settings.tsx:15` labels it "Sounds: On" / "Sounds: Off". |
| AC-62 | backup v2 + legacy migration | **FIXED** | DB: verified in real SQLite (above). Backup: `backup.ts:3,9,16-17,27` adds schemaVersion 2, nullable Kid-only age, `memberType`/`earnsPoints`/`updatedAt`/`deletedAt`, and maps v1 to v2. Tests for the v1 import and an Adult round trip are missing: see S-6. |
| AC-66 | chore-sheet note | **FIXED** | `editors.tsx:176`, with zero points enforced in `family.ts:129`. |
| F34 | Task 5 kid experience | **STILL FAILING** | Some sub-items are still failing: see F35, F37, F38, F40. |
| F35 | points fly + counter tick | **STILL FAILING** | `src/ui/PointsCounter.tsx` has no animation (no `Animated` or `withTiming`). There is no points-fly on completion in the board (`app/kid/[childId]/index.tsx:28`). |
| F36 | progress fill + milestone | **UNVERIFIED** | The `ProgressBar` fill animates (`ProgressBar.tsx:32`). I could not confirm a milestone cue; the file was not in the changed set. |
| F37 | all-done celebration with confetti/sound | **STILL FAILING** | The board still shows only a static line (`app/kid/[childId]/index.tsx:27`), with no Confetti and no sound cue. |
| F38 | `kid/[childId]/celebrate.tsx` redeem celebration | **STILL FAILING** | The file was added, but nothing routes to it. `rewards.tsx:18` still shows an inline "Reward Redeemed!" block. `celebrate.tsx:8` also replaces to `/kid` instead of the member's board, and uses a fixed `burstKey`/`origin`. |
| F39 | transitions | **UNVERIFIED** | No change in the changed files. Not checkable statically. |
| F40 | weekly schedule view | **STILL FAILING** | No weekly view under `app/kid/` (no file or text mentions a week). |

## Blockers

**B-1. The household onboarding step is unreachable and not connected to the rest of onboarding (AC-72, AC-73, AC-74).**
- **Where:** `app/onboarding/household.tsx` and `app/onboarding/index.tsx:300-357`
- **Fix:**
  1. After the PIN confirm (`index.tsx:305`), route to `/onboarding/household`. When it continues, resume at step 5. Do not `replace('/onboarding')` blindly: the resolver at `:56-66` jumps straight to step 5 only because a PIN exists, so make that explicit.
  2. Use the spec labels "Family with kids", "Couple or roommates" and "Farm, barn or property", and add a **Skip** that behaves as Family.
  3. Pass the preset's `firstMemberType` to `ChildForm` as `initial.memberType`.
  4. Render the preset's `chores` list in step 6.
  5. Render the Reward heading and chips only if the member you just created earns points.
  6. Add unit tests for these, plus a Maestro flow.

**B-2. Settings task 6 is still incomplete, and "Change PIN" is broken (AC-41, AC-42 and the design's task 6).**
- **Where:** `app/parent/settings.tsx:14-15`
- **Fix:**
  1. Show a ConfirmDialog with "Unspent points will be set to 0 at the start of each (periodLabel). Continue?" before saving a non-"never" frequency.
  2. On the Manager dashboard, read `settings.pendingResetNotice`, show "Points were reset on ... Name: n pts cleared." once, and clear it on dismiss.
  3. Make "Change PIN" a real flow: verify the current PIN, then the PinCreate component, then save. Do not route to `/onboarding`.
  4. Add the reminder, Export/Import (wiring `buildExport`/`parseImport` with the existing file APIs) and About with the PIN-gated link, or get the EM to formally move them out of M3 in design.md.

**B-3. The kid-experience items of task 5 are still missing (F35, F37, F38, F40).**
- **Fix:**
  1. Animate `PointsCounter` and add the points-fly on tick.
  2. Show Confetti and the sound cue when `progress.allDone` turns true.
  3. Route a successful redeem to `/kid/[childId]/celebrate`, passing the reward name, and return to `/kid/[childId]`.
  4. Add the weekly schedule view.
  5. If any of these are deliberately deferred, the design doc must say so. As it stands, the milestone claims them.

**B-4. There is still no automated test of the v3 migration or the soft-delete upserts (F8).**
- **Where:** `__tests__/db/repos.test.ts`
- **Problem:** The mock DB can only assert SQL strings. The three round-1 blockers that were only visible in real SQLite (B-1 to B-4 of round 1) are now fixed, but any regression would still ship green.
- **Fix:** Add a real-engine adapter, using `better-sqlite3` as a devDependency (add it to the check-deps allowlist) or `node:sqlite` if Jest runs on Node 22.5+. Then add these tests:
  - Seed a v2 DB, run `migrate`, and assert row counts, balances, `memberType='kid'`, `earnsPoints=1` and an empty `foreign_key_check`.
  - Re-tick after undo.
  - Re-save a chore with the same assignees.
  - Soft-deleted rows are excluded from `loadFamily` and balances.

My scratch script for this review is a ready-made template.

## Should fix

- **S-1 (F13, AC-63):** `src/ui/editors.tsx:65,92` defaults or resets the age to 7. Make the age `null` for a new Kid and after switching Adult to Kid. Render the Stepper with a "Pick an age" empty state so that `validateChild` returns `errors.age` until the user picks one.
- **S-2 (AC-69, F22):** `app/onboarding/index.tsx:377,381` should say "Go to the Board" and "Open Manager area". Either use `src/copy/wording.ts` or delete it. Today it is dead code that suggests the copy is centralised when it is not.
- **S-3 (F24):** `app/parent/children.tsx:27` should use the title "Members".
- **S-4 (AC-70):** `copy.ts:42-44` `finishMessage` ("Hand the tablet to ...") and the onboarding finish CTA are kid-directed even when the first member is an Adult. Pick the wording by `memberType`.
- **S-5:** `src/domain/copy.ts:54` `deleteChoreMessage` says "Its completed history will be deleted", but `removeChore` (`family.ts:163-165`) now keeps the completions live. That is the correct choice, because balances should not change, but the dialog now says something false. Change the copy to something like "Points already earned are kept", or soft-delete the completions too. Record the decision.
- **S-6, test gaps for this rework:** add tests for:
  - `planReset` with `earnsPoints: false` (no adjustment, not in `cleared`)
  - importing a v1 file (`schemaVersion: 1`) maps to Kid with points ON
  - an Adult round trip (`age: null`)
  - an Adult with an age is rejected
  - `ChoreCard` with `showPoints` false (no "+n")
  - the `pointsTouched` logic in `ChildForm`
  - `toggleCompletion` gives 0 points for a points-OFF member and throws for a locked member
- **S-7:** `src/data/family.ts:74` runs `planReset`/`applyResetAdjustments` after `points` and `settings` have been computed. So the first load after a boundary returns pre-reset balances and a stale `lastResetBoundaryAt`, and the board shows the old totals until the next reload. Apply the reset first, then compute balances (and re-read settings).
  - Also, `toggleCompletion` (`:125`) calls the full `loadFamily` (N+1 ledger loads plus a possible reset write) just to read `access`.
  - Fix: extract an access-only helper and call that instead.

## Nits

- **N-1:** `app/kid/[childId]/index.tsx:21` calls `router.replace` during render. Return a `Redirect` to `/kid` instead, as `onboarding/index.tsx:111` already does.
- **N-2:** `app/kid/[childId]/index.tsx:26` shows "Everything is affordable!" when there are **no** rewards at all. Show a neutral "No rewards yet" instead.
- **N-3:** `src/ui/ChoreCard.tsx:30`: `choreDoneAnnouncement(name, points)` still speaks the points for a points-OFF member. Pass `showPoints ? points : 0`, as line 37 does.
- **N-4:** `src/data/family.ts:101-104` and `src/db/repos/chore.ts:72-75` soft-delete `chore_child` without bumping `updatedAt`, unlike every other soft delete. Sync will miss these rows.
- **N-5:** `src/domain/backup.ts:20` `ExportInput = any`, plus the `any` casts at `:23`. Type it as `BackupData`-shaped input with optional sync fields.
- **N-6:** `app/parent/settings.tsx`, `app/onboarding/household.tsx`, `app/kid/[childId]/index.tsx`, `celebrate.tsx` and `src/domain/backup.ts` are still single-line, minified-style code. Run prettier on them.
- **N-7:** Round-1 N-1 is fixed (`keys.length` is checked before `updatedAt` in `child.ts:75` and `chore.ts:61`). Round-1 N-2 is fixed (`updatedAt` is not in the settings `COLUMNS`).

## Security notes

- No secrets. No network calls. No new dependencies. All SQL values are parameterised, and the dynamic column names come from fixed whitelists.
- Authorization: the round-1 deep-link gap is closed in the UI (`kid/[childId]/index.tsx:21`) and in the domain layer (`family.ts:126`). The undo path (`done=true`) skips the lock check. That is acceptable, because undo cannot earn points.
- Backup import validates with zod, checks referential integrity (`refs`) and drops premium, trial and PIN fields. The import has no UI yet (F30).
- "Change PIN" sends the manager to the kid board instead of a PIN flow (B-2). It is a broken feature, not a bypass.

## Verdict

The data-layer rework is solid. The migration, foreign-key handling, upserts, soft-delete cascades and points-OFF behaviour are all fixed, and I verified them against a real SQLite engine.

The milestone is still not complete:
- The household onboarding step exists but is unreachable and not connected to the rest of onboarding.
- Settings still lacks the AC-41 warning, the AC-42 notice, a working Change PIN and Export/Import.
- Several task-5 kid-experience items are missing.
- "Open parent area" remains.
- There is still no real-engine migration test.

Statuses: 23 IDs FIXED, 15 STILL FAILING (F7, F8, F13, F17, AC-72, AC-69, F22, F24, F27, F30, F34, F35, F37, F38, F40), 2 UNVERIFIED (F36, F39).

VERDICT: FAIL

REQUEST CHANGES
