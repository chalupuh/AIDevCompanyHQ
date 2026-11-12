# Code Review: Milestone 3 (Kids use the board, parent settings)

**Feature:** HiveBoard / family-chore-board · **Reviewer:** code-reviewer · **Date:** 2026-11-12
**Branch:** `build/m1` (HEAD `78cb482`, "Fix F1 ...") vs `main` (`437e625`, initial commit). Working tree clean.
**Design:** `family-chore-board.design.md` §2, §4, Milestone 3 tasks 5, 5b, 6 · **Spec:** AC-61..AC-74 + revised criteria
**Also read:** `family-chore-board.qa-m3-round1.md`, `family-chore-board.qa-m3.md`

## How this review was done

- `main...HEAD` covers M1+M2+M3 together (131 files) and there is no single M3 commit, so I reviewed the M3 scope file by file: migration v3, repos, `src/data/family.ts`, validation, editors, Members screen, Board (`app/kid/**`), onboarding, settings, copy, access, backup.
- Git commands were refused partway through the session (`git -C ... log`, `cd ... && git log`). I could not get per-commit M3 diffs, so line numbers refer to the current files.
- I checked the SQLite claims against a real engine (Node 24 `node:sqlite`, SQLite 3.53.4) with in-memory statements. I modified no repo files.

**Verified in real SQLite:**
1. `ALTER TABLE ... ADD COLUMN updatedAt INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)` fails with `Cannot add a column with non-constant default`.
2. With `PRAGMA foreign_keys=ON`, doing `DROP TABLE child` inside the rebuild deleted every `completion` row through `ON DELETE CASCADE` (1 row before, 0 after).
3. After a row is soft-deleted, `INSERT OR IGNORE` on the same UNIQUE/PK key is silently ignored, so 0 live rows come back.

The jest suite passes (QA: 320 tests) because `__tests__/db/repos.test.ts` uses a mock DB that never runs SQL. None of the problems below can show up in the current tests.

---

## Blockers

**B-1. The v3 migration cannot run, so the app cannot start (new or existing installs).**
- **Where:** `src/db/migrations.ts:118, 137, 142, 147, 152, 157`
- **Problem:** `ADD COLUMN ... NOT NULL DEFAULT (strftime(...))` is not allowed in SQLite. `migrate()` throws and the transaction rolls back. Fresh installs fail too, because `version < 1` falls straight through to `version < 3`.
- **Fix:** Use a constant default, then backfill: `ADD COLUMN updatedAt INTEGER NOT NULL DEFAULT 0; UPDATE chore SET updatedAt = createdAt;`. Apply the same pattern to reward, completion, redemption and points_adjustment. For settings, use `DEFAULT 0` and then the `nowMs` update already at line 199.

**B-2. The child table rebuild wipes all history on upgrade (AC-62 data loss).**
- **Where:** `src/db/migrations.ts:96-111`, together with `src/db/db.ts:11`
- **Problem:** Foreign keys are ON and `PRAGMA foreign_keys` cannot be changed inside `withTransactionAsync`. So `DROP TABLE child` cascades and deletes every `completion`, `chore_child`, `redemption` and `points_adjustment` row. Once B-1 is fixed, this is the next failure every M2 user would hit.
- **Fix:** Before opening the transaction, run `PRAGMA foreign_keys=OFF` (outside any transaction). Inside the transaction, do the rebuild. Then run `PRAGMA foreign_key_check` and throw if it returns any rows. After commit, run `PRAGMA foreign_keys=ON`. This is the SQLite 12-step procedure, and design §2 already prescribes it.

**B-3. The `chore_child` rebuild drops its FKs, and soft delete breaks reassignment.**
- **Where:** `src/db/migrations.ts:124-134` and `src/db/repos/chore.ts:94-100`
- **Problem 1:** `chore_child_new` has no `REFERENCES` clauses, so it loses its integrity guarantees.
- **Problem 2:** `assignChildren` soft-deletes every existing link and then runs `INSERT OR IGNORE`. That insert hits the PK of the soft-deleted row and is ignored. Result: saving a chore without changing its assignees unassigns everyone, and the chore disappears from every member's board.
- **Fix:** Rebuild with `REFERENCES chore(id)` and `REFERENCES child(id)`. In `assignChildren`, use `INSERT ... ON CONFLICT(choreId, childId) DO UPDATE SET deletedAt = NULL, updatedAt = excluded.updatedAt`, and soft-delete only the links that are not in the new set.

**B-4. Undo then re-tick on the same day never completes the chore again (M1 tick + undo).**
- **Where:** `src/db/repos/ledger.ts:35-62`
- **Problem:** `removeCompletion` soft-deletes the row. `addCompletion` then hits `UNIQUE(choreId, childId, date)` and `INSERT OR IGNORE` does nothing, so no points are credited and progress does not count it.
- **Fix:** Upsert with `ON CONFLICT(choreId, childId, date) DO UPDATE SET deletedAt = NULL, points = excluded.points, createdAt = excluded.createdAt, updatedAt = excluded.updatedAt`. Add a test against a real SQLite engine.

**B-5. The Board ignores stored completions.**
- **Where:** `app/kid/[childId]/index.tsx:17, 26`
- **Problem:** `doneIds` is local state that starts as `[]`. A chore finished earlier today shows as not done when the member reopens their view. Tapping it calls `toggleCompletion(..., done=false)`, which hits B-4, so the member can neither see it as done nor undo it. This breaks AC-65 ("the check state for done chores") and the M1 undo.
- **Fix:** Expose today's completed chore ids from `loadFamily` (for example `doneToday[childId]`), drop the local `doneIds`, and render `done` from that set.

**B-6. Points-OFF members still see "+0" chips (AC-65).**
- **Where:** `app/kid/[childId]/index.tsx:26` passes `points={0}`; `src/ui/ChoreCard.tsx:52-56` always renders the chip.
- **Fix:** Add a `showPoints` prop to `ChoreCard` and hide the chip and the points part of the a11y label when it is off.

**B-7. Large parts of the M3 scope are missing.**
Design tasks 5, 5b and 6 are not delivered:
- **AC-72 / AC-73 / AC-74 (onboarding):** No `app/onboarding/household.tsx`, no `src/domain/presets.ts`. `householdType` is never written. Reward chips are shown unconditionally (`app/onboarding/index.tsx:349`). `HouseholdType` in `src/db/repos/settings.ts:4` is `family|flatmates|classroom|other`, but the contract is `family|couple|property`.
- **AC-69 / AC-70 / AC-3 / AC-53 (copy):** No `src/copy/wording.ts`. These strings still say "parent area" or "child":
  - `COPY.pinCreate` (`src/domain/copy.ts:7`)
  - "Open parent area" (`app/onboarding/index.tsx:381`)
  - `emptyDashboard`, `emptyChildren`, `demoChildLimit`, `rewardDemoNote`, `trialEnded` (`copy.ts:13-24`)
  - "Add child" / "Edit child" / "Children n of m" (`app/parent/children.tsx:45, 55, 76, 78`)
  - "Pick at least one child" / "Add a child first" (`src/domain/validation.ts:27-28`)
- **AC-37 / AC-39 / AC-42 / AC-67 (resets):** `planReset` (`src/domain/resets.ts:87`) has no `earnsPoints` filter, and `ChildLedger` has no field for it. Nothing in `app/` or `src/` calls `planReset` or `applyResetAdjustments`, so resets never run on launch or foreground.
- **Task 6 (settings):** `app/parent/settings.tsx` is a stub:
  - The chips are never `selected`.
  - Changing frequency or week start does not set `lastResetBoundaryAt` via `seedBoundary`. This breaks AC-35/AC-41: there is either no reset ever, or an immediate reset if a boundary was seeded earlier.
  - There is no AC-41 warning, no AC-42 notice, no working Change PIN, no reminder, no Export/Import and no About with the PIN-gated link.
  - The Sounds button has no visible state.
- **AC-62 (backup):** `src/domain/backup.ts:7, 21-28, 52` is still schemaVersion 1. `age` is required, there is no `memberType`/`earnsPoints`/`updatedAt`/`deletedAt`, and import accepts at most `.max(4)` children. Adults cannot be exported, a v2 file is rejected (`__tests__/domain/backup.test.ts:79` asserts that), and there is no v1-to-v2 mapping.
- **AC-66 note:** The chore sheet has no note "Points go only to members who earn points."
- **Task 5 kid experience:** Missing pieces:
  - points fly and counter tick (M2)
  - progress fill + `milestone` (M3)
  - all-done celebration with confetti/sound (M4; only a static text line exists)
  - `kid/[childId]/celebrate.tsx` full-screen redeem celebration (M5)
  - transitions (M7)
  - weekly schedule view
  - demo-locked reward text (Kid "Ask a grown-up to unlock rewards" / Adult "Ask the manager to unlock rewards", AC-21)
  - the AC-71 Maestro flow (`e2e/` has no board flows)
- **Fix:** Implement these per design §2, §4 and Milestone 3. Each AC above needs a unit test or a Maestro flow.

**B-8. No migration test on an M2-shaped DB, and no real-SQL tests for soft delete.**
- **Where:** `__tests__/db/repos.test.ts:132-151`
- **Problem:** Design 5b requires "tests on an M2-shaped DB (AC-62)" and "soft-deleted rows never appear in queries, balances or exports". The mock DB cannot catch B-1 to B-4.
- **Fix:** Run DB tests against a real SQLite engine:
  - Option: `better-sqlite3` as a devDependency (add it to the `check-deps` allowlist) behind a thin adapter that mimics `getAllAsync`, `runAsync`, `execAsync` and `withTransactionAsync`.
  - Seed a v2 DB with children, completions, redemptions and adjustments, run `migrate`, then assert row counts, balances, `memberType='kid'` and `earnsPoints=1`.
  - Also test re-tick after undo and re-save of chore assignees.

## Should fix

**S-1. Soft delete is only half done.**
- `removeChild` (`src/data/family.ts:83-85`) leaves the member's `chore_child` links live. So `chores[].childIds` and `todayProgress` still include a removed member.
- `removeChore` and `removeReward` (`family.ts:126-128, 144-146`) still hard-delete:
  - Deleting a chore cascades away its completions, which changes balances.
  - `chore_child` rows are orphaned because B-3 removed the FK.
- **Fix:** Add app-level soft-delete cascades in one transaction (`choreRepo.softDelete` already exists, so use it). Decide and document whether a deleted member's completions are soft-deleted. `deleteChildMessage` says they are deleted.

**S-2. Locked (demo) members and chores can be used through a deep link or the domain layer.**
- **Where:** `app/kid/[childId]/index.tsx:20-21`, `src/data/family.ts:88-93`
- **Problem:** The member view does not check `access.lockedChildIds`, so `/kid/<lockedId>` lets a locked member complete chores. `toggleCompletion` does not check locked chores either.
- **Fix:** Redirect to `/kid` when the member is locked, and check access in `toggleCompletion`.

**S-3. AC-64 "unless touched" is not implemented.**
- **Where:** `src/ui/editors.tsx:91`
- **Problem:** Switching type always overwrites `earnsPoints`.
- **Fix:** Track `pointsTouched`. Only reset to the type default while it is false. Set it when the toggle is pressed.

**S-4. Adult members render as "Name, null".**
- **Where:** `app/parent/children.tsx:63`
- **Fix:** Show the age only for Kids. Otherwise show "Adult".

**S-5. Switching Adult to Kid silently uses age 7 (AC-63 requires an age before saving).**
- **Where:** `src/ui/editors.tsx:65`
- **Fix:** Make `age` nullable, starting as null for new members and after a type switch, and require an explicit pick so validation fires.

**S-6. The progress bar target is the most expensive reward, not the next one.**
- **Where:** `app/kid/[childId]/index.tsx:24`
- **Problem:** `Math.max(...costs)` is the wrong target, and the `1` fallback hides the "no rewards" case.
- **Fix:** Target the cheapest reward with cost greater than the balance. If there is none, use an "everything affordable" state, per ux.md.

**S-7. The member cap of 8 contradicts the design for M3.**
- **Where:** `src/domain/access.ts:9` and `copy.ts:19, 21`
- **Problem:** The design says "Until task 7 lands, M3 keeps the M2 cap of 4". The F1 "fix" pulled AC-6 (tagged M4) forward. It is now inconsistent with `backup.ts:52` (`.max(4)`), so a household with more than 4 members cannot round-trip a backup. Demo and trial copy is also half-migrated (AC-76 is M4).
- **Fix:** Either revert to 4 for M3, or take all of C9/C10 now: the backup max, all "members/8" copy and the AC-75 tests. Get the EM to record which one.

**S-8. Child rows are typed `earnsPoints: boolean` but SQLite returns 0 or 1.**
- **Where:** `src/db/repos/child.ts:11, 21-27`
- **Problem:** It works today because only truthiness is used. Any strict `=== true` check, or passing the value to a `Switch`, will break.
- **Fix:** Map rows in `findAll` and `findById` to a real boolean. Add `CHECK (memberType IN ('kid','adult'))` and `CHECK (memberType='kid' OR age IS NULL)` to the rebuilt table (`migrations.ts:96-107`).

**S-9. `schema.sql` is stale.**
- **Where:** `src/db/schema.sql`
- **Problem:** The header in `migrations.ts:6-10` calls it the canonical latest schema, but it still describes v1/v2 (`age NOT NULL`, none of the v3 columns).
- **Fix:** Update it to v3, or delete it and the comment.

**S-10. `deviceId` from SQLite `randomblob` is not a valid UUIDv4.**
- **Where:** `migrations.ts:161-164`
- **Problem:** There are no version or variant bits. The design says ids come from expo-crypto `randomUUID()`.
- **Fix:** Set it in TS after the SQL step: `UPDATE settings SET deviceId = ? WHERE id = 1 AND deviceId IS NULL` with `Crypto.randomUUID()`.

## Nits

- **N-1.** `src/db/repos/child.ts:71` and `src/db/repos/chore.ts:63`: `if (keys.length === 0) return;` is dead code because `updatedAt` was pushed just before it. The "empty patch does nothing" test passes only because of the mock. Move the check before the push.
- **N-2.** `src/db/repos/settings.ts:47, 60-62`: `updatedAt` is both whitelisted and auto-appended, which can produce two assignments. Remove it from `COLUMNS`.
- **N-3.** `app/kid/[childId]/index.tsx`, `app/kid/[childId]/rewards.tsx` and `app/parent/settings.tsx` are written as single-line, minified-style JSX. They are hard to review and diff. Format them with prettier and pull out small components.
- **N-4.** `app/kid/index.tsx:14-17`: the comment still says "Placeholder Kid Home ... Milestone 3". Avatar tints are hard-coded hex values instead of `avatarTints` from tokens.
- **N-5.** `app/kid/[childId]/rewards.tsx:16`: a points-OFF member who opens `/rewards` by deep link gets a bare "Back to board" screen. Use `router.replace` to the member view instead.
- **N-6.** `migrations.ts:120`: the comment "use actual current time" is misleading. Once B-1 switches to `DEFAULT 0`, the backfill `WHERE` clause is right as written.

## Security notes

- No secrets in code. No new network calls. `app/kid/**` imports nothing from `Linking` or IAP (AC-71 holds statically).
- Every SQL value is parameterised. The dynamic column names in `update()` come from fixed whitelists, so there is no injection path.
- Authorization gap: demo locks are enforced only in the UI, and locked members can be reached by deep link (S-2).
- No risky dependencies were added.

## Test coverage

- The mock-DB repo tests cannot verify the migration, soft delete or upsert behaviour (B-8).
- There are no tests for: the AC-65 UI (no "+n", no counter, no Rewards on points-OFF), the AC-64 touched-toggle logic, AC-66 zero-point completion in `toggleCompletion`, the `redeemReward` guard, `planReset` with `earnsPoints`, backup v1-to-v2, or any Maestro board flow (AC-71).

---

**Verdict:** The migration fails on every install (B-1). Once that is fixed, it would delete all history on upgrade (B-2). Soft delete breaks chore reassignment and re-ticking (B-3, B-4). Much of the milestone is not implemented yet (B-7).

REQUEST CHANGES
