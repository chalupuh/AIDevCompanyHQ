# QA: internal sprint 1, task 3 (Village view), round 1

(Restored by the orchestrator from the QA agent's report; the original file was removed when the task was sent back for rework.)

## Requirement check
| Requirement | Result |
|---|---|
| Third tab "Village" registered in App.tsx | PASS (tab button and `VillageView` render present) |
| SVG top-down map with HQ and Engineering, R&D, Creative buildings on grass | PASS (static review) |
| Roster characters as circular portrait tokens, initials fallback | PASS |
| Idle near own building; owner and manager at HQ | PASS |
| Walks along paths to HQ on `done`, back on `start` | **FAIL** (see bugs 1-3) |
| Working characters show truncated task bubble | PASS |
| Click opens org profile drawer (reuses org styles and components) | PASS (static review) |
| Use `.studio/village/` assets if present | **FAIL** (not wired; sprint log admits it; the folder is empty or missing) |
| `prefers-reduced-motion`: no walking | PASS in intent (rAF is skipped and walks are not interpolated), but the preference is read once and never updates |
| `npm run build` passes | **UNVERIFIED** |

## Bugs
1. **High: the walk is not animated.** In `VillageView`, positions are computed during render from `Date.now()`. The rAF `tick` only calls `setNow` when a walk *finishes*. While a walk is active it just schedules the next frame and does not re-render. Tokens therefore jump rather than walk. Once any walk completes, the `setNow` branch does not reschedule rAF, and the effect has `[]` deps, so the loop never restarts. Expected: smooth movement for each event. Actual: no frames, and the loop dies after the first completion.
2. **High: the token returns home right after reaching HQ.** Completed walks are filtered out of `walksRef` on completion, so the `lastWalk` "stay at destination" branch can never find them. A `done` agent walks to HQ and then snaps back to its building. Expected: it stays at HQ until a `start` event.
3. **High: walks are re-triggered repeatedly.** The events effect depends on `now`, and `setNow` fires on every walk completion. Each rerun re-scans the last 30 events with `ts > loadedAt` and pushes new walks. There is no dedupe by `walkId`, so the same `done`/`start` events replay in a loop. Also, `from` for a repeated walk is computed from stale state.
4. Medium: walking goes in a straight line from building to building, not along the drawn paths. The requirement says "walks along paths".
5. Low: the reduced-motion media query is read once, and a live change is ignored.
6. Low: `.studio/village/` assets (buildings/*.png, tiles/*.png) are not loaded. The placeholders always render.
7. Low: the drawer is a local copy (`OrgDrawer`) rather than the shared org drawer component. It has no Escape-key close or focus handling, which makes it inconsistent with the org tab.

## Reproduction (bugs 1-3)
1. Run the Control Room and open the Village tab.
2. Emit `node .studio/studio.js log qa-engineer 100 "x" done` (a `done` event).
3. Expected: the token walks smoothly to HQ and stays. Actual (from code): the token jumps, returns home, and the event can replay.

VERDICT: FAIL - the walking behaviour (the core of the feature) is broken in three ways (bugs 1-3), assets are not wired, and the build could not be verified in this run.
