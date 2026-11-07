# QA – Task 3: Control Room "Village" tab

Reviewed: `.studio/app/src/App.tsx`, `features/village/{model.ts,VillageView.tsx,village.css,index.ts}`, and the sprint-log '## Task 3' notes.

## Limits of this run
This QA session had no shell tool. I could not run `npm --prefix .studio/app run build`, tests, lint or `studio.js log`. **The build is unverified.** The dev's log also says the build was not run. Findings below come from reading the code.

## Acceptance check

| Requirement | Result |
|---|---|
| Third tab "Village" registered in `src/App.tsx` | PASS (tab button and `<VillageView>` render present) |
| New folder `src/features/village/` | PASS |
| SVG top-down map, grass, HQ plus Engineering / R&D / Creative buildings | PASS (placeholder flat buildings, dashed paths) |
| Owner and Eng. Manager at HQ | PASS (`homePos`) |
| Every roster character is a token, portrait in a circle, initials fallback | PASS |
| Idle near own building | PASS |
| Walks along paths to HQ on `done`, back on `start` | **FAIL** (see B1–B3) |
| Walking follows the paths | FAIL (straight lerp from home to HQ, not along the path lines; minor) |
| Working characters show a truncated task bubble | PASS |
| Click opens the org profile drawer | PASS (reuses `o-drawer` styles and the `Portrait`/`Ring`/`StatusPill`/`ModelChips` components; it is a re-implementation, not the org Drawer component itself) |
| Use `.studio/village/` assets if present, else placeholders | PARTIAL (placeholders only; files are never loaded, which the dev acknowledged) |
| `prefers-reduced-motion`: no walking, position just changes | PARTIAL/FAIL (see B4) |
| `npm run build` passes | UNVERIFIED (not run) |

## Bugs

### B1 – No animation frames render during a walk (High)
Steps: trigger a `done` event for an agent.
Expected: the token glides to HQ over 1.2 s.
Actual: `tick` only calls `setNow` when a walk *finishes*. Otherwise it only requests another frame and never re-renders. Positions are computed during render from `Date.now()`, so the token stays put and then jumps.

### B2 – Character never stays at HQ, and the rAF loop dies (High)
`tick` removes finished walks from `walksRef`. The "completed walk destination" branch in the render (`lastWalk … >= WALK_DURATION`) can therefore never match. After a `done` walk the token snaps back to its home position. Also, when a walk completes, `tick` calls `setNow` but does not schedule the next frame. The loop ends after the first completed walk and later walks are never animated.

### B3 – Events are re-processed endlessly (High)
The events effect depends on `now`, scans the last 30 events every time, and does not dedupe by `walkId`. Each `setNow` re-pushes walks for all recent `done`/`start` events (those with `ts` after load). The result is duplicate or repeating walks, and the `walksRef` array grows without bound, especially under reduced motion where nothing prunes it.

### B4 – Reduced-motion is read once and is not reactive (Low)
`matchMedia` is read once into a ref and there is no change listener. Under reduced motion there is no pruning (B3), and the "position change" relies on that leak.

### B5 – Assets never wired (Low)
`.studio/village/buildings|tiles/*.png` are not used. The spec said to use them if present.

### B6 – Build unverified (Blocker until run)
Previous rounds hit TS2300 duplicate imports. Unused imports are also possible: `Character` is imported in `VillageView` but used, `VW`/`VH` are used, and `useStudio` is imported with `import type` for a value used only in `typeof`, which is fine. This needs a real `tsc`/`vite build` run (`noUnusedLocals` may flag things).

## Verdict reasoning
The core behaviour of the feature is broken: walking does not animate (B1), characters do not stay at HQ (B2), and there is an event re-processing loop (B3). The build has also not been verified. Send back to frontend-dev: drive animation with a per-frame state tick, keep a persistent per-agent position or target model, dedupe events by id, then re-run the build.

VERDICT: FAIL
