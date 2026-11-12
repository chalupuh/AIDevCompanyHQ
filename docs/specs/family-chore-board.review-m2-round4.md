# Code review: Milestone 2 (family-chore-board / HiveBoard), round 4

Reviewer: code-reviewer (Opus) · Date: 2026-11-12
Scope: `build/m1`, milestone diff `4d4024d..HEAD` at tip `facac3e` (M2 round 5).

| Check | Result |
|---|---|
| `npm run typecheck` | Clean |
| `npm run lint` | Clean |
| `node scripts/check-deps.js` | OK |
| `npx jest` | 23 suites and 319 tests pass |
| Maestro | Not run: there is no device or emulator on this host |

## Round-3 follow-up
- **B-1 (duplicate Finish): fixed.**
  - The step-6 card renders only while setup is not done (`app/onboarding/index.tsx:332`), and so do the step dots (`:235`).
  - `finishSetup` returns early once setup is done (`:200`).
  - The Maestro flow now asserts that Finish is gone.
- **S-1 (`unlock()` bypass): fixed.** The call was removed. Only `verifyPin` or a newly set PIN unlocks the parent area.
- **N-1 (copy): partly fixed.**
- **New test** at `__tests__/onboarding/Onboarding.test.tsx:330-359`. It would fail against the old code.

## Blockers
None.

## Should fix
None.

## Nits
- **N-1:** two taps in the same frame can still call `finishSetup` twice (`:200`, `:353`). Guard it with a `useRef` "finishing" flag.
- **N-2:** the title "All set! Your board is ready." is hard-coded (`:373`). Move it into `COPY`.
- **N-3:** round-3 N-2, N-3 and N-4 are still open.
- **Carried over to M3:**
  - error matching on the "PIN already set" string;
  - the Skip-setup update has no try block;
  - resuming after step 5 can create a duplicate child;
  - "Try again" relies on the screen remounting;
  - the resume-guard Maestro flow depends on another flow and has no wrong-PIN case;
  - the PIN cooldown can be skipped by changing the device clock;
  - the schema is defined twice;
  - no `computeAccess` limit check in `saveChild` / `saveChore`;
  - no length CHECK on reward names;
  - the folder layout differs from design.md §4;
  - the Maestro screenshots are missing.

## Security
The parent gate holds on every path checked. PIN hashing, the constant-time compare, the persistent lockout, the parameterised SQL and the settings whitelist are unchanged.

VERDICT: APPROVE
