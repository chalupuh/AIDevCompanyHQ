# Code Review: Milestone 4 (Trial end and one-time unlock), re-check after rework round 1

**Project:** family-chore-board (HiveBoard) · **Reviewer:** code-reviewer · **Date:** 2026-11-12
**Scope:** `git diff 346bf09..ecb3949` (rework commit "Rework M4 review nit fixes (round 1)"), plus the full M4 diff it sits on.
**Prior report:** `family-chore-board.review-m4-round1.md`
**Against:** design.md §2 (access, parental gate), §3 (entitlement contract), §4 (layout), M4 task 7.

## Checks I ran

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass (no output) |
| `npx eslint .` | 0 errors, the same 2 warnings as before (kid routes, exhaustive-deps) |
| `npx jest` | 27 suites / 350 tests pass |
| `grep isValidProductId` | no matches left in `src/` or `__tests__/` |
| `src/ui/tokens.ts` | `color.meadow`, `color.inkSoft`, `color.berry` exist |

## Status of the requested IDs (N-1 to N-8)

| ID | Status | Evidence |
|---|---|---|
| N-1 | **FIXED** | `app/parent/full-access.tsx`: the `status === 'success' && !isPremium` branch is gone. Status messages (lines 155-167) cover only cancelled, failed and not-found. |
| N-2 | **FIXED** | `full-access.tsx:22,192`: `useWindowDimensions()` is used and the origin is `{ x: dims.width / 2, y: dims.height / 2 }`. |
| N-3 | **FIXED** | `full-access.tsx:35,51-55,71,97`: the `initiated` ref is set only by `doPurchase`/`doRestore`. The subscriber plays the sound and fires confetti only when it is true, then clears it. Each failure path also clears it. |
| N-4 | **FIXED** | `app/parent/settings.tsx:184-186` now uses `color.meadow`, `color.inkSoft` and `color.berry`. |
| N-5 | **FIXED** | `settings.tsx:138` now reads "Full access is active.", which is true for both a store restore and the cached case (the reword option the finding offered). |
| N-6 | **FIXED** | `isValidProductId` is removed from `src/iap/entitlement.ts` and from the test. grep finds no remaining uses. |
| N-7 | **FIXED** | `app.config.ts:33-35` adds `extra.iapProductId`. `entitlement.ts:7` reads `Constants.expoConfig?.extra?.iapProductId`, with the same literal as a fallback. `expo-constants ~17.0.0` is already a dependency. |
| N-8 | **FIXED** | `src/db/DbProvider.tsx:42`: `restoreIap(db).then(() => { void refreshSettings(); })`. `refreshSettings` is guarded by `alive`. |

All eight requested IDs are fixed.

## Earlier findings the rework did not touch

The rework commit addressed only the nits. Both blockers and all seven should-fix items from round 1 are still in the code exactly as reported. No B-* or S-* item was marked as deferred or accepted by the owner, so they still block this milestone.

| ID | Status | Evidence |
|---|---|---|
| B-1 | **STILL FAILING** | `DbProvider.tsx:42` still calls `restoreIap(db)` on every launch, and `entitlement.ts:78` still calls `IAP.restorePurchases()` (on iOS this is `AppStore.sync()`, which can show an Apple ID sign-in sheet). The app opens on the kids' board with no PIN gate, so AC-53 is broken. There is no `refreshEntitlement` and no test that the launch path skips `restorePurchases`. |
| B-2 | **STILL FAILING** | `entitlement.ts:54-64`: the listener still grants premium and finishes the transaction without checking `purchaseState === 'purchased'`, so pending purchases and Ask to Buy requests unlock premium. The listeners still live only while `purchase()` runs, so late or deferred purchases are never finished, and Play refunds unacknowledged purchases after 3 days. `purchase()` still has no timeout. `restore()` (lines 79-80) still grants on any state and never acknowledges unfinished purchases. No pending or late-purchase tests exist. |
| S-1 | STILL FAILING | `src/domain/gate.ts` and `requirePin()` still do not exist, and three call sites still wire `PinGateModal` themselves. design.md is unchanged. |
| S-2 | STILL FAILING | `src/ui/PinGateModal.tsx` was not changed in the rework: the cooldown is still never cleared and no countdown is shown. |
| S-3 | STILL FAILING | `jest.setup.ts:5` still has `process.on('unhandledRejection', () => {})`. |
| S-4 | FIXED | `full-access.tsx:26,104,163-166` adds the `'not-found'` status with the text "No previous purchase found.". This was already in the working tree. |
| S-5 | STILL FAILING | `entitlement.ts:16-19` still matches cancellations with the `/cancel/` regex instead of `ErrorCode.UserCancelled`. |
| S-6 | STILL FAILING | `__tests__/iap/entitlement.test.ts` still has 4 tests and no failure, no-connection, no-match or wrong-product cases. There are no `PinGateModal` or Full Access component tests. `e2e/` has no flows for trial expiry, purchase, restore, the 9th member or demo mode. |
| S-7 | STILL FAILING | `package.json:32` is still `"expo-iap": "^6.0.0"`. There is no plugin entry in `app.config.ts` and no confirmed EAS dev-client build. |

## New findings in the rework

### Nits
- **N-9** `app/parent/full-access.tsx:2,4`: `react-native` is imported twice. Merge `useWindowDimensions` into the line-2 import.
- **N-10** `app/parent/settings.tsx:56`: `play('purchase_success')` still plays when `restore()` returns true only from the offline cache, even though nothing was restored. Play it only when the store confirms the purchase (this ties in with the result type from B-1/B-2).
- **N-11** `app/parent/settings.tsx:183-186`: spacing is still hard-coded (`gap: 8`, `marginTop: 8`). Use `space.*` tokens, as `full-access.tsx` does.
- **N-12** `src/iap/entitlement.ts:7`: the fallback `'hiveboard_full_unlock'` copies the ID that is in `app.config.ts`, so a rename would need two edits. Either drop the fallback and treat a missing ID as "store unavailable", or keep it and add a comment that it must match the config.

## Security notes
- No secrets or network endpoints were added. The product ID is a public store SKU, so reading it from `extra` is fine.
- B-1 remains the main security and child-safety issue: a store UI that a child can trigger without the parental gate.

## Verdict
All of N-1 to N-8 are **FIXED**. The rework does not address the two round-1 blockers, though. B-1 (launch restore can open an ungated App Store sign-in sheet) and B-2 (pending or deferred purchases unlock premium, and late transactions are never finished, so Play refunds them) are unchanged, and so are S-1 to S-3 and S-5 to S-7. Next round: fix B-1 and B-2 with the tests listed in round 1, then the should-fix items.

VERDICT: FAIL

REQUEST CHANGES
