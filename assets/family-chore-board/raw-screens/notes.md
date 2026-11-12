# Raw screens: capture notes (family-chore-board / HiveBoard)

Captured 2026-11-12 from the Expo web build (SDK 52, app branch build/m1 + capture tooling on branch `screens/capture`), headless Chrome via playwright-core. No simulator/emulator was available.

Sizes (CSS viewport x deviceScaleFactor, so the phone/tablet layout is used): iphone-6.9 = 430x932 @3 -> 1290x2796; iphone-6.5 = 414x896 @3 -> 1242x2688; ipad-13 = 1032x1376 @2 -> 2064x2752; android-phone = 360x640 @3 -> 1080x1920. S1-S5 exist in every folder. Extras: S2-before, S4-home, S5-gate.

Reproduce (in C:/Users/goldg/family-chore-board, branch screens/capture):
  HIVEBOARD_CAPTURE=1 npx expo start --web --port 8099
  node capture/capture.js
Native-only modules are shimmed only when HIVEBOARD_CAPTURE=1 (metro.config.js + capture/shims): expo-sqlite (sql.js in memory), expo-secure-store (localStorage), expo-iap, expo-notifications. Demo data is seeded by capture/capture.js into the migrated schema; no production code path changed.

Demo data: family (Ava 8, Sam 10, Mia 6 as Kids with points; Dana Adult, no points; rewards Movie night/Pick a board game/Ice cream trip) and barn (Chris, Dana, Leo, all Adults, points off; Feed the horses, Fill water buckets, Collect eggs, Muck out stalls, Check the fence). Premium flag set so no trial banner; no prices anywhere.

Mapping: S1 kid home (4 members incl. Adult), S2 Ava's board after tapping "Feed the dog", S3 Rewards screen, S4 Chris's board (Adult, points off), S5 Manager dashboard after PIN 1234.

Not faithful / caveats:
- No status bar: web has none. The top band (59/48/24/24 CSS px) is empty paper; composite the 9:41 status bar there. Bottom inset likewise reserved. In S5 the band is paper-coloured while the manager screen is #F4F6F2 (slight seam; crop or cover).
- S2: the stamp animation finished or nearly so by capture time (shot ~280 ms after tap; confetti/points-fly not visibly caught). Result shows all stamped chores plus +points counter; "mid-celebration" is not truly achieved. Needs a device recording or manual retake.
- S3: the app's current Rewards screen is a list with "N more to go!"; the honey-jar progress is only a flat progress bar on the member board (S2). No jar visual exists in this build (M1/M3 UI is plain). Check the storyboard against what ships.
- S6 (privacy card): no in-app screen exists; overlay-only, not captured.
- Kid home (S1) and boards are left-aligned grids with a lot of empty space on iPad; that is the app's current layout, not a capture artefact.
- Fonts (Fredoka/Nunito) load fine; emoji render with the host's Noto/Segoe emoji set, which differs from Apple/Google system emoji.
- Verified by eye: iphone-6.9 S1-S5 and ipad-13 S1; other devices produced by the same script but only checked for correct size.

## Update 2026-11-12 (recapture on build/m1 55dfdd9, tablet layout)
All four device sets re-captured from one seed (same points/counts; barn board = Chris with 5 chores). S2 is shot 1.8 s after the tap (stamped state kept) and a lingering "+8" fly chip is hidden by capture.js. Android S4 (1080x2402) and iPad S4 (2064x3180) are taller captures so all 5 barn chores show; compose scales the frame to fit, so those frames are a bit narrower than the other shots. Layout-check shots at 688x918 and 1024x1366 (1x CSS px) are in tablet-check/.
