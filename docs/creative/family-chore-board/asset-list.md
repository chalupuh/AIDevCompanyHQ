# HiveBoard asset list

Brand rules: `docs/creative/family-chore-board/brand.md`. Output root: `assets/family-chore-board/` in HQ. When an asset is approved, copy it into the app repo `C:/Users/goldg/family-chore-board/assets/` (devops-engineer, separate PR).
App facts: Expo, `supportsTablet: true` (iPad screenshots are required), splash and adaptive-icon background #FFF7E6, store category Lifestyle.
Global acceptance for every image: on-brand palette, no generated text or letters, no humans/faces/hands, no artifacts, exact pixel size, sRGB.

## Production order

1. **copy-voice**: C1 listing copy and C2 screenshot captions (captions feed the visuals).
2. **image-artist**: I1 icon master, then I2/I3 derived (review gate: icon approved before anything else, since it appears in all later assets).
3. **image-artist**: I4 splash, I5 screenshot background plates, I6 onboarding art.
4. **mobile-dev or image-artist**: S0 raw screen captures from simulator/emulator with demo data.
5. **image-artist**: S1-S4 composite screenshots (captions overlaid), I7 feature graphic.
6. **copy-voice**: V2 voice-over; then **video-producer**: V1 app preview (one GPU job at a time; video last).
7. **creative-director**: Mode B review → `review.md`. Max 2 redo loops, then owner. Owner approves before listing.

## Copy (copy-voice) → `docs/creative/family-chore-board/copy.md`

| ID | Asset | Limits | Acceptance |
|---|---|---|---|
| C1a | App name / title | iOS 30 chars, Play 30 chars | "HiveBoard" + descriptor, e.g. "HiveBoard: Household Chores" |
| C1b | iOS subtitle | 30 chars | Households, not kids-only |
| C1c | Play short description | 80 chars | Mentions one-time purchase or no accounts |
| C1d | Full description (both stores) | Play 4000, iOS 4000 | Covers families, couples/roommates, farm/barn; trial then $4.99 one-time; privacy claims only from brand.md section 6 |
| C1e | iOS keywords | 100 chars, comma-separated, no spaces after commas | No competitor names, no "kids category" |
| C1f | iOS promotional text | 170 chars | Optional |
| C1g | What's New (v1.0) | short | |
| C2 | Screenshot captions S1-S6 | max 2 lines, ~28 chars/line | One idea each, matches the screen shown |
| C3 | Video title cards + VO script | 15-30 s spoken | Matches V1 storyboard |

## Icons and splash (image-artist)

| ID | Asset | Size / format | Acceptance |
|---|---|---|---|
| I1 | App icon master (iOS) | 1024x1024 PNG, no alpha, no rounded corners (OS masks it), sRGB | Honey jar (hero) with honey drop, ink outline, on honey or paper field; optional tiny bee only if legible. Reads at 48 px and 29 px (check downscaled). No text. Distinct from any existing honey/bee brand mark. → `assets/family-chore-board/icon/icon-1024.png` |
| I2 | Android adaptive foreground | 1024x1024 (432 dp at 4x) PNG with alpha; subject inside the central 66% safe circle (~676 px) | Same jar as I1, transparent background, nothing important outside safe zone; survives circle, squircle and teardrop masks. → `icon/adaptive-foreground.png` |
| I3 | Android adaptive background + Play icon | Background: 1024x1024 PNG solid #FFF7E6 (or faint hex pattern). Play store icon: 512x512 PNG 32-bit | Play icon = I1 downscaled, checked at 512. Monochrome themed-icon layer (Android 13): 1024x1024 single-colour silhouette of the jar. → `icon/adaptive-background.png`, `icon/play-512.png`, `icon/monochrome.png` |
| I4 | Splash image | 1284x2778 reference; centred mark ~ 400x400 PNG with alpha on #FFF7E6 (Expo `resizeMode: contain`) | Jar mark only, no text; background exactly #FFF7E6 so there is no seam with `splash.backgroundColor`. → `splash/splash.png` |

## Illustrations (image-artist)

| ID | Asset | Size / format | Acceptance |
|---|---|---|---|
| I5 | Screenshot background plates | 1290x2796, 1242x2688, 2064x2752, 1080x1920 PNG | Paper + 4% hex pattern + one honey blob; empty top band for captions; no text. → `screens/bg-<size>.png` |
| I6 | Onboarding / empty-state art (3-4 pieces) | 1024x1024 PNG with alpha (rendered at ~240 pt) | Welcome: honey jar filling. Household types: home with bed and toys; couple/roommates: two mugs and a plant; farm/barn: hay bale, bucket, horseshoe. Objects only, no people. Same sticker style. → `onboarding/*.png` |
| I7 | Google Play feature graphic | 1024x500 PNG or JPG, no alpha | Left: honey jar + chore stickers; right: empty area for "HiveBoard" wordmark overlaid in Fredoka (post). Key content away from edges (Play may crop/overlay a play button centre). No device frames needed. → `store/feature-graphic.png` |

## Store screenshots

S0 raw captures (owner: mobile-dev using the sim/emulator, demo data per brand.md section 5; or image-artist if the app runs in the dev gallery). Then image-artist composites S0 onto I5 with C2 captions.

| Set | Size (portrait PNG/JPG, no alpha) | Count | Required? |
|---|---|---|---|
| iPhone 6.9"/6.7" | 1290x2796 | 4-6 | Yes |
| iPhone 6.5" | 1242x2688 | 4-6 | Recommended (fallback set) |
| iPad 13" | 2064x2752 | 4-6 | **Yes** (supportsTablet: true). Show the tablet board, the primary device |
| Android phone | 1080x1920 (or 1080x2400) | 4-8 | Yes |
| Android 7"/10" tablet | 1200x1920 / 1600x2560 | 4 | Recommended (tablet shelf eligibility) |

Screenshot storyboard (same order every set):
- **S1** Board Home with 3-4 members incl. one Adult: "One board for the whole household".
- **S2** Member chores with a stamp-check mid-celebration + honey jar: "Tap, stamp, done".
- **S3** Rewards / honey jar filling (Kid member): "Points and rewards, if you want them".
- **S4** Barn/farm household with Adult members, points off: "Works for the barn too" (AC-78).
- **S5** Manager area (Manager look): "Set chores once. They repeat weekly."
- **S6** Privacy card (plain, can be overlay-only): "No ads. No accounts. Pay once."

Acceptance: real app UI (no generated UI), caption legible at thumbnail size, no prices or paywall on board shots, no real children or photos, invented names only, status bar clean (full battery, 9:41), consistent across sets.

## Video and audio (optional, recommended)

| ID | Asset | Spec | Owner | Acceptance |
|---|---|---|---|---|
| V1 | App preview video (iOS) | 15-30 s, H.264 .mp4/.mov, 1080x1920 portrait for 6.7" (886x1920 also accepted); iPad 1200x1600; 30 fps; poster frame chosen | video-producer | Built from **real screen recordings** of the app plus brand-styled title cards; Apple requires footage captured from the app; no generated UI. Shows S1, S2, S4, S5 flows. Captions burned in from C3. Works muted. |
| V1b | Play promo video | YouTube URL (owner uploads; external, needs owner OK) | video-producer → owner | Same cut as V1, 16:9 or 9:16 |
| V2 | Voice-over | 48 kHz WAV, -16 LUFS, warm calm adult voice (Kokoro stock voice, not a cloned real person) | copy-voice | Script from C3, no mispronunciation of "HiveBoard", Whisper transcript matches script |
| V3 | Music bed | royalty-free or original, -24 LUFS under VO | video-producer | License documented in `assets/family-chore-board/LICENSES.md` |

## Not in scope here

Privacy policy page and support URL (devops-engineer, AC-54); store forms (Data Safety / App Privacy: "no data collected"); uploading to stores (owner OK required).
