# HiveBoard: UX, Visual Direction and Motion Spec

> Owner: `ui-ux-designer` · Source of truth: `docs/specs/family-chore-board.md` (AC-1..AC-60, section 4a cues, section 6 moments)
> Status: draft for owner approval · Mobile-first (phone 390 x 844 pt reference), tablet adaptation noted per screen (family tablet is the primary device, 820 x 1180 pt reference)
> Tokens in section 2 are the single source for the Expo app. The project had no `docs/design-tokens.md`; it is created alongside this file and mirrors section 2.

---

## 1. Visual direction

### 1.1 Concept: "Sticker Hive"

HiveBoard looks like a **sticker book made of honeycomb**. Every kid-facing object is a chunky, rounded, flat-colour shape with a **thick warm-ink outline and a hard offset shadow**, as if it were a die-cut sticker pressed onto warm paper. Shapes lean on the **hexagon-with-rounded-corners** as a motif (avatars, the points badge, check stamps), never on literal beehive clip-art. Chores are physical things you **press down and stamp**; points are **honey drops** that fly into a **honey jar** which fills toward the next reward.

Why this is not a template: the outline-plus-offset-shadow "sticker" language, the stamp-down check, the honey-jar meter and the rounded-hex shapes are consistent across every kid screen, and they are built from a handful of original illustrations rather than stock icon packs.

### 1.2 Mood in words

Kid mode: **warm, bouncy, tactile, sunny, generous.** Think a well-made wooden toy: heavy, friendly, a little glossy, never neon. Saturated but warm colours on cream paper, big rounded type, things that squish and pop when touched.

Parent mode: **calm, clear, trustworthy, quiet.** Same bones (rounded, friendly, same type family) but cooler, flatter, denser, no outlines-and-offset-shadows, almost no animation. A parent should feel they have stepped from the playroom into the kitchen-table office.

### 1.3 Premium without babyish

| Do | Avoid |
|---|---|
| A restrained palette: honey, cream, ink-brown, one green, one plum accent | Rainbow primaries, gradients on everything, glitter |
| One display font used big and confidently; generous whitespace around big tiles | Cartoon fonts with wobbly baselines, drop-shadow text |
| Motion with weight (springs with slight overshoot, 1 hero moment per action) | Constant idle bouncing, flashing, anything that loops forever |
| Illustrations in a consistent claymation-flat style, slightly textured paper grain | Stock clip-art, mixed styles, photographs |
| Short, kind, specific copy ("Nice! +5") | Baby talk, exclamation marks everywhere, streak-shaming, countdown pressure |
| Kids ~6-8 treated as capable: icon-first, but numbers and short words are fine | Treating the child as a pre-reader only; hiding all text |

### 1.4 Kid mode vs parent mode

| Dimension | Kid mode (Kid Home, Chores, Rewards, Celebration) | Parent mode (PIN, Dashboard, Edit*, Schedule, Settings, Full Access) |
|---|---|---|
| Background | Warm cream paper `bg.kid`, subtle hex pattern at 4% | Cool paper `bg.parent` flat |
| Shapes | Sticker: 3pt ink outline, hard offset shadow, radius 24+ | Flat cards: 1pt hairline, soft shadow `elev.1`, radius 16 |
| Colour | Honey, meadow green, plum, pastel avatars | Teal-slate primary `parent.primary`, honey only as small accent (logo, badges) |
| Type | Fredoka, large (min 20 pt body, 28+ for labels on tiles) | Nunito, 16 pt body, denser |
| Targets | 64 pt and up (never below 56) | 48 pt minimum, 56 for primary buttons |
| Motion | Full spec section 3 | Fades and 150-250 ms slides only; PIN shake; purchase celebration is the one exception (M11) |
| Sound | All 4a cues | `ui_tap`, `ui_back`, `pin_*`, `purchase_success` only |
| Mode switch | Persistent 56 pt "Grown-ups" hex button, top-right, bee-wing glyph, no label. Tap opens PIN Entry (M7) | "Back to kids" button in the header, no PIN needed to return to kid view |
| Mode cue | Header band is honey | Header band is teal-slate with a small lock-open icon, so a parent (and an adult glancing at the screen) always knows which side they are on |

---

## 2. Design tokens

Contrast ratios are computed (WCAG relative luminance). Pairs marked "text" need 4.5:1 (3:1 for large text 24 pt+ or 19 pt bold), pairs marked "UI" need 3:1.

### 2.1 Colour (light theme, the shipped theme)

**Core**

| Token | Hex | Use |
|---|---|---|
| `ink` | `#2B1A0F` | Outlines, primary text on light, icons |
| `ink.soft` | `#6B4A2B` | Secondary text on cream (7.46:1 on `bg.kid`) |
| `paper` | `#FFF7E6` | Kid background (`bg.kid`) |
| `paper.2` | `#F2EDE0` | Kid secondary surface, inactive chips |
| `white` | `#FFFFFF` | Cards, inputs |
| `honey` | `#FFC93C` | Primary kid colour: fills, header band, buttons |
| `honey.light` | `#FFE9B0` | Soft fills, selected tint |
| `honey.dark` | `#7A4A00` | Text/icons on honey when ink is not wanted (4.87:1 on honey) |
| `meadow` | `#1F7A4D` | Done / success (check stamp fill, white glyph) |
| `meadow.light` | `#9ADBC0` | Done card tint |
| `plum` | `#4A2C8F` | Rewards / celebration accent, secondary buttons (white text 10.25:1) |
| `plum.light` | `#D9C8F5` | Reward tile tint |
| `sky.light` | `#BFE3F5` | Avatar tint, info |
| `coral.light` | `#FFC2B3` | Avatar tint |
| `berry` | `#B3402A` | Error text/icon (5.70:1 on white), destructive button fill (white text 5.70:1) |

**Parent**

| Token | Hex | Use |
|---|---|---|
| `bg.parent` | `#F4F6F2` | Parent background |
| `parent.primary` | `#1D5C73` | Buttons, header, links (white text 7.42:1; 6.82:1 on `bg.parent`) |
| `parent.text` | `#1F2A30` | Body (13.48:1 on `bg.parent`) |
| `parent.muted` | `#56656C` | Secondary text (5.56:1 on `bg.parent`) |

**Verified text pairs (all >= 4.5:1)**

| Foreground | Background | Ratio |
|---|---|---|
| `ink` | `paper` | 15.67 |
| `ink` | `honey` | 10.87 |
| `ink` | `white` | 16.70 |
| `ink` | `honey.light` | 13.95 |
| `ink` | `meadow.light` | 10.55 |
| `ink` | `plum.light` | 10.76 |
| `ink` | `sky.light` | 12.34 |
| `ink` | `coral.light` | 10.83 |
| `ink.soft` | `paper` | 7.46 |
| `white` | `meadow` | 5.32 |
| `white` | `plum` | 10.25 |
| `white` | `berry` | 5.70 |
| `white` | `parent.primary` | 7.42 |
| `honey.dark` | `honey` | 4.87 |
| `meadow` | `paper` (text/icon) | 4.99 |
| `parent.muted` | `bg.parent` | 5.56 |

**Non-text UI (>= 3:1)**: because `honey` on `paper` is only ~1.5:1, **every honey, light-tint or pastel shape carries the 3pt `ink` outline** (15.67:1 against paper). That outline is both the signature look and the AA fix. Never use `honey` as the only border or the only state indicator. Disabled text uses `ink.soft` at 100% with a dashed outline (not opacity alone); `#C9BFA8` on paper (1.71:1) is forbidden for anything meaningful.

**Dark theme (optional, post-MVP)**: not shipped. If added: `paper` -> `#1E140C`, `ink` -> `#FFF7E6`, honey and meadow unchanged, re-verify all pairs. Parent screens only first.

### 2.2 Typography

| Role | Font (free, SIL OFL, bundle via `@expo-google-fonts`) | Use |
|---|---|---|
| Display / kid | **Fredoka** (SemiBold 600, Bold 700) | Kid headings, tile labels, all numerals in points and counters |
| Body / parent | **Nunito** (Regular 400, SemiBold 600, ExtraBold 800) | Parent UI, body copy, forms |

Both support Dynamic Type / font scaling; layouts must hold at 200% on parent screens and 150% on kid screens (tiles grow vertically, never truncate numerals).

| Token | Font / weight | Size / line (pt) | Use |
|---|---|---|---|
| `display.xl` | Fredoka 700 | 56 / 60 | Points total, celebration number |
| `display.l` | Fredoka 700 | 40 / 44 | Screen hero, "Reward Redeemed!" |
| `title.kid` | Fredoka 600 | 28 / 32 | Tile labels, kid screen titles |
| `label.kid` | Fredoka 600 | 20 / 24 | Chips, small kid labels, "+5" |
| `title.parent` | Nunito 800 | 24 / 30 | Parent screen titles |
| `heading` | Nunito 800 | 18 / 24 | Section headings |
| `body` | Nunito 400 | 16 / 24 | Body |
| `body.strong` | Nunito 600 | 16 / 24 | Row titles |
| `caption` | Nunito 600 | 13 / 18 | Helper text (min 13 pt; never smaller) |
| `button` | Fredoka 600 (kid) / Nunito 800 (parent) | 20 / 24 | Buttons |

### 2.3 Spacing, radius, elevation, sizing

| Token | Value |
|---|---|
| Spacing scale (pt) | `s1` 4, `s2` 8, `s3` 12, `s4` 16, `s5` 24, `s6` 32, `s7` 48, `s8` 64 |
| Screen padding | Phone 20, tablet 40 (content max width 720, centred) |
| Gutter between kid tiles | 16 (phone), 24 (tablet) |
| Radius | `r.sm` 8 (input inner), `r.md` 16 (parent card, chip), `r.lg` 24 (kid tile), `r.xl` 32 (sheet, big tile), `r.hex` 28 (rounded-hex corner), `r.pill` 999 |
| Kid outline | `stroke.kid` 3 pt `ink` |
| Parent outline | `stroke.parent` 1 pt `#D5DAD3` (decorative) / 2 pt `parent.primary` on focus |
| Hard shadow (kid) | `elev.sticker`: offset (0, 5), blur 0, colour `ink` at 100%. Pressed state: offset (0, 1) and node translates down 4 (see BigTapTile) |
| Soft shadow (parent) | `elev.1`: y 2, blur 8, `ink` 8%; `elev.2` (sheets): y 8, blur 24, `ink` 14% |
| Touch targets | Kid: min 64 x 64 (hard floor 56). Parent: min 48 x 48 (AC-58). Gap between adjacent targets >= 12 |

### 2.4 Iconography and emoji style

- **UI icons** (back, close, plus, lock, gear, trash, pencil): custom 24 pt grid, rounded 2.5 pt stroke, round caps, drawn in `ink`, filled variants when active. Source: draw once as SVG, ship via `react-native-svg`. Kid-area icons are rendered at 32-40 pt inside 64 pt tiles.
- **Chore and reward pictures**: use a **single bundled emoji set so iOS and Android look identical**: Noto Color Emoji (Apache 2.0), a curated picker of ~120 chore/food/outing/toy emoji, shipped as PNG sprites (no system-emoji fallback, which would break consistency and kid-safety review). On kid tiles the emoji sits on a 72 pt white round "plate" with the ink outline, so every picture reads on any tile colour.
- **State shapes (AC-60)**: Done = a **check stamp** (meadow disc, white heavy check, ink outline). Not done = empty **dashed ring**. Locked = a **padlock badge**. Never rely on green vs grey alone.

### 2.5 Avatar system

- An avatar is a **rounded hex** (`r.hex`) with the 3pt outline, filled with one of **6 tints** (`honey.light`, `meadow.light`, `plum.light`, `sky.light`, `coral.light`, `paper.2`) and containing one emoji from a curated **24-emoji "face" set** (animals, a rocket, a star...). No custom characters, no photos (out of scope).
- The kid's first name sits under the avatar in `title.kid`; the first letter is the screen-reader fallback and the avatar fallback if emoji is unset.
- Up to 4 kids: tints auto-assigned in order so siblings are always distinguishable; the parent can change tint and emoji in Edit Children.
- Each kid's tint tints their whole Chore/Reward header band, so a child instantly knows "this is my page" without reading.

---

## 3. Motion spec

### 3.1 Global principles

1. **Never block input.** Every animation is cosmetic and runs on the UI thread (Reanimated worklets). The state change (check, points) commits immediately; the animation catches up. A second tap during any animation is accepted.
2. **Physical, with weight.** Prefer springs. Default spring `spring.pop`: damping 12, stiffness 220, mass 0.8 (about 8% overshoot). Soft spring `spring.soft`: damping 18, stiffness 160, mass 1. Timing fallback easing: `easeOut = cubic-bezier(0.22, 1, 0.36, 1)`, `easeInOut = cubic-bezier(0.65, 0, 0.35, 1)`.
3. **One hero per action.** Each tap has a single primary animation plus at most 2 supporting ones. No more than ~24 live particles on screen; none on a second simultaneous action beyond a reduced burst (cap 40 particles total).
4. **Duration bands**: micro 80-150 ms, standard 200-300 ms, hero 500-900 ms, celebration up to 2.5 s (M5 only, dismissable at any time after 600 ms).
5. **Squash and stretch** only on kid objects, scale deltas <= 12%.
6. **Sound and haptic lead by <= 30 ms** so the touch feels causal. Cues come from section 4a by ID. Sounds off (AC-49) does not change any visual.
7. **Idle motion**: only two allowed: the mascot "breathing" on empty states (scale 1 to 1.03, 3 s, easeInOut, loops) and the "ready" shimmer on an affordable reward (one 700 ms sweep every 4 s). Both stop under Reduce Motion.
8. **60 fps budget**: transform and opacity only; no layout animation on lists; confetti is a single pooled `Canvas` (react-native-skia) or <= 40 animated views as fallback; test on a mid-range tablet.
9. **Reduce Motion (AC-59)**: read `AccessibilityInfo.isReduceMotionEnabled` plus change listener. Rule: **no translation over 8 pt, no scale over 3%, no particles, no shake, no loops; use opacity cross-fades (150 ms) and static end states.** Sound and haptics are unchanged. Every row below has an explicit fallback.

### 3.2 Moment specs

| # | Moment | Trigger | What moves / how | Duration, easing / spring | Sound, haptic | Reduce Motion fallback |
|---|---|---|---|---|---|---|
| M1 | **Chore tick** (stamp) | Tap on chore tile (touch-down starts press; commit on release) | 1) Press: tile translates down 4 pt, shadow collapses to offset 1, scale 0.97 (80 ms, easeOut). 2) Release: check stamp scales 2.2 -> 1.0 with rotation -12 deg -> 0 (`spring.pop`, ~320 ms) and lands with a 6-ray ink "impact" ring (scale 0.6 -> 1.4, opacity 1 -> 0, 250 ms). 3) Tile fill cross-fades paper -> `meadow.light` (200 ms) and emoji plate does a small hop (y -10 -> 0, `spring.pop`). 4) Dashed ring morphs away. **Undo** (tap a done tile): stamp scales to 0 and fades (150 ms), tile fill reverts, no particles | Stamp ~320 ms, total settle <= 450 ms | `chore_complete` + light haptic (impact Light). Undo: `chore_undo`, no haptic | Stamp appears with 150 ms fade, tile colour cross-fade only; no hop, no ring |
| M2 | **Points fly to total** | Fires 120 ms after M1 stamp lands | A "+n" honey-drop chip (honey fill, ink outline, `label.kid`) spawns on the tile and flies along a quadratic arc to the PointsCounter badge in the header (apex 40 pt above the chord), scaling 1 -> 0.7, drops a 2-frame sparkle trail. On arrival: counter badge squashes (scale 1.0 -> 1.18 -> 1.0, `spring.pop`), number ticks up one unit per frame budget, **max 12 ticks** (n > 12 steps in chunks), each tick pitches up one semitone; honey ripple ring 0 -> 48 pt | Fly 550 ms, `easeInOut`; ticks spaced 40 ms; squash 300 ms | `points_fly` at launch; `points_tick` per tick (cap 12); no extra haptic | Chip fades in over the tile (150 ms), cross-fades into the counter, number swaps with a 150 ms fade (no ticking motion); `points_tick` still plays once per tick |
| M3 | **Progress fill** (honey jar) | After M2 arrival; also on screen enter | Honey in the jar rises from old to new level, with a wavy top surface (sine amplitude 4 pt decaying to 0 over 500 ms). 3 bubbles float up and pop. Marker on the jar side for the next reward ticks. **Becoming affordable:** jar fills to full, lid pops up (y -14, `spring.pop`), reward card gets "ready" shimmer, jar glows `honey` ring pulse once (scale 1 -> 1.15, opacity .6 -> 0, 600 ms) | Fill 600 ms `easeOut`; flourish +600 ms | `progress_fill`; affordable also `milestone` | Level changes with a 200 ms cross-fade of two static fill levels; no wave, bubbles or pulse; "Ready!" label appears with a fade |
| M4 | **All of today's chores done** | Last undone chore for today ticks | After M1/M2 settle (+500 ms): a banner sticker "Great job!" with Pip the mascot slides up from the bottom (y +120 -> 0, `spring.soft`), 18 star-confetti pieces burst from the banner (velocity 280-480 pt/s, gravity 900, fade 1.2 s), all chore tiles do a staggered wave hop (40 ms stagger, 8 pt). Banner is tappable and auto-dismisses after 4 s | 800 ms hero, confetti 1.2 s | `milestone`; haptic Success notification once | Banner fades in (200 ms), static stars drawn around it; no confetti, wave or slide |
| M5 | **Reward redeem celebration** | Tap "Get it!" on affordable reward, confirm tap | Full-screen takeover (plum background wipes in as a hex-shaped iris from the button, 450 ms, `easeInOut`). Reward emoji on a big plate drops from the top and bounces (y -300 -> 0, 2 bounces, `spring` damping 9, stiffness 180) at 300 ms. Title letters pop in staggered (50 ms each). Honey drops + bees-free confetti (hex shapes and stars, 60 pieces from two bottom corners, then 30 from the top at 1.2 s). Points subtract: counter in corner counts down with ticks while the jar level drops. Rays slowly rotate behind the plate (one rotation per 12 s). "Yay!" button appears at 900 ms; whole screen dismisses on tap anywhere after 600 ms; auto-dismiss never | Entry 450 ms, bursts to 2.5 s, rays loop until dismissed | `reward_redeem` (~2.5 s); haptic Success notification at plate landing | Plum background cross-fades in (200 ms); plate, title and button visible immediately in final positions; static confetti illustration; no rays, no drop, count swap fade |
| M6 | **Onboarding** | First launch and each step | 6 steps (3.3). Mascot Pip flies in with a curved path (700 ms, `spring.soft`) on step 1; each step is a card that slides horizontally (translateX 40 -> 0 + fade, 280 ms `easeOut`) with a progress row of 6 hex dots that fill honey. On finishing, the populated dashboard "assembles": cards drop in with 60 ms stagger (y -16 -> 0, `spring.pop`) | Per step 280 ms; welcome sting 1.5 s | Step 1 `onboarding_welcome`; PIN set success `pin_success`; step taps `ui_tap`. Haptic: Success on PIN set | Pip appears with a fade; steps cross-fade (150 ms); dots swap without motion |
| M7 | **Screen transitions** | Navigation | Kid hierarchy uses a **horizontal slide with parallax** (new screen x 100% -> 0, old moves -25%, 280 ms `easeOut`). Kid Home -> Chore View: the tapped avatar hex **shared-element expands** to the header band (320 ms). Chore <-> Rewards: switched by two large tab-tiles (swipe also works), content cross-slides 16 pt (200 ms). To PIN: a gate-door sheet rises from the bottom (y 100% -> 0, 300 ms `easeOut`), kid screen dims to 40% ink. Back reverses | 200-320 ms | `ui_tap` on forward, `ui_back` on back/close | All transitions become 150 ms cross-fades; no shared-element expansion or parallax |
| M8 | **PIN entry** | Each digit; wrong; right | Digit key: key presses (scale .94, 80 ms) and the next dot fills with a pop (scale 0 -> 1.2 -> 1, 160 ms `spring.pop`). **Wrong:** the 4 dots turn berry and the row shakes horizontally (+-10 pt, 3 cycles, 360 ms, damped), then clear; message fades in. **Correct:** dots turn meadow and hop in sequence (30 ms stagger, 4 pt), lock icon opens, sheet dissolves into the parent screen (250 ms). **Cooldown:** keypad dims, a ring timer counts down 30 s | Dot pop 160 ms; shake 360 ms; unlock 400 ms | `pin_key` per digit; `pin_error` + Error haptic (notificationError); `pin_success` + Success haptic | Dots fill instantly (no pop); error: dots turn berry, a "Wrong PIN" text with an alert icon appears, no shake; success: dots meadow for 200 ms then 150 ms fade |
| M9 | **Empty states** | Screen has no data | Pip (mascot) or a spot illustration sits in a plate; idle "breathing" (principle 7); the call-to-action button does one attention bounce on entry (scale 1 -> 1.08 -> 1, `spring.pop`, once after 600 ms). Illustration drawn in with a 300 ms fade + 12 pt rise | Entry 300 ms | none | Static illustration, fade 150 ms, no breathing or bounce |
| M10 | **Locked reward / not enough points** | Tap a reward costing more than balance | Reward card does a gentle "nope wobble" (rotate +-3 deg, 2 cycles, 280 ms) and the jar's marker for that reward pulses; a speech-bubble sticker rises showing "{n} more to go!" with a small honey-drop count (auto-hide 2.5 s). Never red, never shake. In demo mode: the card shows a padlock and "Ask a grown-up to unlock rewards." | 280 ms wobble | `reward_locked`; no haptic (avoid a "buzz" for failing) | Bubble fades in (150 ms), static marker highlight (thicker outline), no wobble |
| M11 | **Purchase success** (parent) | Store purchase resolves OK | Short, 1.2 s: the Full Access screen's padlock badge pops open (lid rotates 40 deg, `spring.pop`), 24 honey hex confetti burst from the badge, "Unlocked!" title scales in; then limit chips ("1 child", "3 chores") flip like split-flap tiles to "4 children", "Unlimited chores" (300 ms each, 100 ms stagger); trial banner collapses out (height to 0, 250 ms) | 1.2 s + 0.8 s flip | `purchase_success`; haptic Success | Static unlocked badge, chips swap with fade, banner fades out; no confetti |
| M12 | **Points reset notice** (parent) | First dashboard view after reset (AC-42) | Calm: info card with a clock-arrow icon slides down 12 pt + fade (250 ms `easeOut`); per-child rows list "{Name}: {n} pts cleared"; dismiss X collapses the card (200 ms). No sound, no colour alarm (uses `sky.light`, not berry) | 250 ms | none | Fade only |

### 3.3 Supporting micro-interactions

| Element | Spec |
|---|---|
| Any button press (kid) | Sticker press: translate down 4 pt, shadow to offset 1, scale 0.97, 80 ms; release `spring.pop`. `ui_tap` |
| Any button press (parent) | Opacity .85 and scale .98 over 80 ms; `ui_tap` |
| Day chip selection | Chip fills honey.light with ink outline and a check glyph; 120 ms |
| List item added/removed | Insert: height 0 -> auto + fade, 220 ms. Remove: slide left 24 pt + fade, 180 ms, undo toast 5 s |
| Skeleton loading | Static paper.2 shapes with one 1.2 s diagonal shimmer loop; Reduce Motion: static shapes |
| Toast | Slides up 16 pt + fade (200 ms), stays 3-5 s, `role=alert` for errors |

---

## 4. Screens

Conventions: wireframes are phone portrait. `[ ]` = tap target, `(( ))` = hex avatar, `~jar~` = honey jar meter. Tablet: kid screens scale tiles up and lay out in 2-3 columns (max content width 720), parent screens use a two-pane list/detail where noted. Landscape: keep layout, grid reflows to more columns.

Persistent kid-area chrome: top band (honey, or the child's tint inside Chore/Reward views) containing the back button (left, 64 pt) and the "Grown-ups" hex (right, 64 pt). Sound-off state shows nothing in kid area (no mute toggle for kids; Settings only).

### 4.1 Welcome / Onboarding (M6)

Six steps, one idea each, in parent mode visuals with a kid-mode flourish (honey hero area). A parent is reading; the child is not required.

1. Welcome (Pip flies in, `onboarding_welcome`) 2. How it works (3-panel carousel: tap chore, earn honey, get rewards; each panel a mini looping illustration, loop disabled for Reduce Motion) 3. Create PIN 4. Confirm PIN 5. First child (name, age, avatar) 6. First chore + first reward (pre-filled suggestions from a short list as tappable chips, e.g. "Make bed 5", "Ice cream 100"; tapping creates and ends in the populated dashboard).

```
+------------------------------+
|                    . . o . . .|  <- 6 hex dots, honey fill = done
|        [ Pip, hero ]         |
|                              |
|   Welcome to HiveBoard       |  display.l
|   Your family's chore chart  |
|   simple, private, one-time  |
|   purchase.                  |
|                              |
|   [      Let's go      ]     |  primary 56pt
|            Skip setup  (link)|  -> goes to PIN step only
+------------------------------+
```

- Components: Hero, StepDots, PrimaryButton, PinPad (steps 3-4), TextField, AgePicker, AvatarPicker, SuggestionChip.
- Empty: n/a. Loading: none. Error: PIN mismatch "PINs didn't match - try again" with the shake (M8); Name required / Age must be 4-12 inline.
- Locked/trial: trial starts silently; nothing shown at onboarding.
- Copy: title/subtitle from spec 6.5; step 3 "Create a 4-digit PIN to protect the parent area."; step 4 "Re-enter your PIN to confirm."; step 2 panel captions "Tap a chore when it's done", "Collect honey points", "Trade points for rewards"; step 5 "Who's helping out?"; step 6 "Pick a first chore and a first reward - you can change them anytime."; finish "All set. Hand the tablet to {name}!" with button "Go to kid view".
- A11y: stepper announced "Step 3 of 6"; Skip is reachable; no timed content.

### 4.2 PIN Entry (M8)

```
+------------------------------+
| [x]            (lock icon)   |
|        Grown-ups only        |  title.parent
|        Enter your PIN        |
|          o  o  o  o          |  4 dots, 24pt
|   [1]  [2]  [3]              |  keys 72x72, gap 16
|   [4]  [5]  [6]              |
|   [7]  [8]  [9]              |
|   [  ]  [0]  [<x]           |
+------------------------------+
```

- PinPad is **scrambled? No**: fixed layout (predictable for the parent; the gate's job is to stop young children via a PIN they do not know). Keys 72 pt, haptics per 4a/AC-51.
- States: Idle; Typing; Error ("Incorrect PIN - try again", dots berry, shake, haptic); Cooldown after 5 failures: keypad disabled, ring countdown with "Try again in 24 s" (`aria-live` updates every 5 s, not every second); Success.
- Used for: kid -> parent, purchase flow, restore purchase, external links (AC-53). Context line changes: "Enter your PIN to continue".
- Loading: none. Never biometric (AC-34).
- Cooldown copy: "Too many tries. You can try again in {n} seconds."
- A11y: each key has label "1".."9","0","Delete"; dots are one element "{k} of 4 digits entered"; error and cooldown are announced.

### 4.3 Parent Dashboard

```
+------------------------------+
| HiveBoard      [Back to kids]|  teal header
+------------------------------+
| [Trial] 9 days left in your  |  dismissible when <=3d rule
| free trial          [Details]|
| [Reset notice card] (M12) [x]|
| Today                        |
| ((A)) Ana    3/5 done  120pt |  row, tap -> child's chores
| ((B)) Ben    5/5 done   45pt |
| ((+)) Add child     (slot 2/4)|
| Quick actions                |
| [Chores] [Rewards] [Schedule]|
| [Children]        [Settings] |
+------------------------------+
```

- Components: ParentHeader, TrialBanner, ResetNoticeCard, ChildSummaryRow (avatar, mini ProgressBar, points), ActionTile (parent variant), AddRow.
- Tablet: two columns, left child list, right quick actions.
- Empty (no children): Pip illustration, "Add your first child to get started!" and button "Add child".
- Loading: skeleton rows (3). Error: n/a.
- Trial: banner "{n} days left in your free trial"; 3 days before expiry a dismissible reminder with "Get Full Access". After expiry (demo): banner "Your free trial has ended. HiveBoard is in demo mode (1 child, 3 chores). Get Full Access to unlock everything." (persistent, not dismissible) and locked children rows dimmed with padlock badge and dashed outline.
- Reset notice (M12): "Points were reset on {date}. {Name}: {n} pts cleared." with dismiss.

### 4.4 Edit Children

```
+------------------------------+
| <  Children            [ + ] |
| ((A)) Ana, 7      [edit][del]|
| ((B)) Ben, 5   (locked) [..] |
| Add child 2 of 4             |
+------------------------------+
Add/Edit child (sheet):
 Avatar tile preview  ((A))
 [Name        ] 1-20 chars
 Age  [-] 7 [+]        4-12
 Emoji  [24-grid]  Colour [6]
 [Save]   [Cancel]
 Remove child (berry text link)
```

- Components: ChildRow, Sheet, TextField, Stepper (age), AvatarPicker, ConfirmDialog.
- Empty: "No children yet - tap + to add one." with Pip.
- Error: "Name required", "Age must be 4-12", limit "Maximum of 4 children reached.", demo "Demo mode includes 1 child. Get Full Access for up to 4." with a Get Full Access button (PIN already satisfied in parent area).
- Locked children (AC-45): dimmed 60% **plus** padlock badge and dashed outline, not editable, label "Locked - unlocks with Full Access".
- Delete confirm (AC-9): "Remove {name}? Their completed chores and redeemed rewards will be deleted." Buttons: "Remove" (berry), "Keep".

### 4.5 Edit Chores

```
+------------------------------+
| <  Chores              [ + ] |
| Filter: [All] [Ana] [Ben]    |
| (bed) Make bed          5 pt |
|   Ana, Ben  Mon Tue Wed ...  |
| (dog) Walk dog         10 pt |
| Chores 3 of 3 (demo)  [Get Full Access]
+------------------------------+
Chore sheet:
 Emoji plate [change] [Name 1-50]
 Points  [-] 5 [+]   (1-500; quick chips 1 2 5 10 20)
 Who: [(A)] [(B)] ...   (multi-select hex chips)
 Days: [M][T][W][T][F][S][S]   (selected = honey + check glyph)
 [Save]
```

- Components: ChoreRow, EmojiPicker (Noto set grid), Stepper with long-press repeat, AvatarChip (multi), DayChip.
- Empty: "No chores yet - tap + to create one." Error: "Name required", "Points must be 1-500".
- Demo limit: "Maximum of 3 chores in demo mode. Get Full Access for unlimited chores." as a banner above the list at 3/3, with the "+" button replaced by a dashed padlock "+" that opens the paywall.
- Locked chores (beyond 3 oldest): dimmed + padlock.
- Editing text: "Changes apply to everyone this chore is assigned to." (AC-14).

### 4.6 Edit Rewards

Same pattern as 4.5. Row: emoji plate, name, cost with honey-drop icon. Sheet fields: emoji, name, cost (1-1000, chips 25 50 100 250), optional "Set as goal for" (child chips) to feed the jar's target.
- Empty: "No rewards yet - set one as a goal!" Errors: "Name required", "Cost must be 1-1000".
- Demo: rewards editable but note "Kids can redeem rewards with Full Access." Non-blocking.

### 4.7 Weekly Schedule

```
+------------------------------+
| <  This week   [Week starts: Mon]
| Mon Tue Wed Thu Fri Sat Sun  |  day tabs, today ringed
| (bed) Make bed   (A)(B)      |
| (dog) Walk dog   (A)         |
| --- Tue ---                  |
```

- Phone: day tabs with a vertical list below. Tablet: 7-column grid, rows = chores, cells = avatar chips (tap toggles assignment).
- Components: DayTabs, ScheduleRow, AvatarChip.
- Empty: "No chores scheduled this week." and button "Edit chores". Loading: skeleton. Error: n/a.
- Shows a one-line hint "Week resets on {day} at midnight."

### 4.8 Kid Home

```
+------------------------------+
|                    [Grown-up]|  honey band, hex wing button
|                              |
|     Who's helping today?     |  display.l (and Pip waving)
|                              |
|     ((  A  ))   ((  B  ))    |  BigTapTile avatar, 140pt hex
|       Ana          Ben       |
|     ((  C  ))   ((  +  ))    |  (+ not shown to kids)
+------------------------------+
```

- Components: AvatarTile (hero, 140-160 pt on phone, 200 on tablet), Pip, GrownUpsButton.
- Each avatar tile shows a tiny **PointsPill** and a **ring progress** of today's chores around the hex, so a child sees "I'm 3 of 5" without opening.
- Empty (no kids): Pip with "Ask a grown-up to set up children." and only the Grown-ups button emphasised (pulse once).
- Loading: skeleton hexes. Error: n/a.
- Locked children (demo): hex dimmed with padlock and tapping gives `reward_locked`-style wobble, no copy about money; text "Ask a grown-up." Kids never see trial or price text (UX goal 6).
- A11y: each tile is a button "Ana, 3 of 5 chores done, 120 points".

### 4.9 Kid Chore View (M1-M4, M7)

```
+------------------------------+
| [<]  ((A)) Ana     [120 pt]  |  band in Ana's tint; PointsCounter
|  ~~jar~~ 80/100  [Rewards >] |  jar + rewards tab-tile
| Today                        |
| +----------+ +----------+    |
| |  (bed)   | |  (dog)   |    |  BigTapTile chore, 2 columns
| | Make bed | | Walk dog |    |  min 160x160 phone; 1 col at 150% type
| |  +5      | |  +10     |    |
| |  (O dashed)| |  [check]  |  |
| +----------+ +----------+    |
+------------------------------+
```

- Components: KidHeader, PointsCounter, HoneyJar (compact), ChoreTile, TabTile (Chores / Rewards), Celebration banner (M4).
- Chore tile: emoji plate 72 pt, name (`title.kid`, max 2 lines, then ellipsis with full label for screen reader), reward chip "+5" (`label.kid`), and the state mark at the top-right (dashed ring / check stamp / padlock).
- Ordering: not-done first, done sink to bottom after 600 ms (reorder 250 ms), so a child always sees what is left.
- Empty: Pip with a sun, "No chores for today - you're all set!" Loading: 4 skeleton tiles. Error: n/a.
- Done-for-day: M4 banner + the header band glows `honey`. Locked chores (demo overflow): dimmed + padlock; tap gives soft wobble, no copy.
- Interaction: the whole tile is the target (no tiny checkbox). Undo is the same tap, with a 3 s inline hint the first time ever ("Tap again to undo"), stored in local state.
- A11y: tile role button, label "Make bed, 5 points, not done", state flips to "done" with announcement "Make bed done, plus 5 points".

### 4.10 Reward Screen

```
+------------------------------+
| [<]  ((A)) Ana     [120 pt]  |
|  [Chores]  [Rewards*]        |  tab-tiles 64pt
|  Next reward                 |
|  ~~~~ big honey jar 80/100 ~~~|
|  20 more to go!              |
| +----------+ +----------+    |
| | (icecream)| | (movie)  |   |  RewardCard grid
| | 100 (drop)| | 250 (drop)|  |
| | [Get it!] | | 130 more  |  |
| +----------+ +----------+    |
+------------------------------+
```

- Components: PointsCounter (large `display.xl`), HoneyJar (large), RewardCard (states: affordable, not-yet, goal, locked-demo), TabTile.
- RewardCard states: **Ready** (plum outline thickness 4, shimmer sweep, white plum "Get it!" button), **Not yet** (paper.2 fill, cost + small progress bar "20 more", taps trigger M10), **Goal** (child's chosen/closest target, a star badge, is the jar's target), **Demo-locked** (padlock, "Ask a grown-up to unlock rewards.", no button).
- Redeem confirm: bottom mini sheet "Get {reward}?" with big "Yes!" (honey) and "Not now" (outline); prevents accidental redemptions, 2 taps total.
- Empty (no rewards or zero points): Pip + "Complete chores to earn points!" with a chore-tab arrow. Loading: skeleton. Error: n/a.

### 4.11 Reward Celebration (M5)

```
+------------------------------+
|        (rays rotate)         |
|      ( big reward plate )    |
|       Reward Redeemed!       |  display.l, white on plum
|    Ice cream is yours!       |
|       -100 (honey drop)      |
|         [   Yay!   ]         |
+------------------------------+
```

- White-on-plum text (10.25:1). Tap anywhere (after 600 ms) or "Yay!" to dismiss -> returns to Reward screen with balance updated and jar refilled to new level. Also announced to screen readers immediately; focus lands on "Yay!".
- Copy: "Reward Redeemed!" and "{reward name} is yours!". No "tell your parent" or purchase wording. The parent still hands over the real-world reward; subtext optional: "Show a grown-up".

### 4.12 Settings (parent)

```
+------------------------------+
| <  Settings                  |
| Plan: Trial - 9 days left [Get Full Access]
| Sounds                [ON ]  |
| Week starts on        Mon >  |
| Reset points          Never >|
| Daily chore reminder  [OFF]  |
|   A gentle nudge each morning to check today's chores.
| Change PIN               >   |
| Export data / Import data    |
| Restore purchase             |
| About and privacy policy  >  |
+------------------------------+
```

- Components: SettingsRow (toggle, picker, link), SegmentedPicker, ConfirmDialog, Toast.
- Reset points: picking Weekly/Monthly/Quarterly shows "Unspent points will be set to 0 at the start of each {period}. Continue?" with "Continue"/"Cancel"; nothing resets immediately (AC-41).
- Import: "This will replace all current data. Continue?" -> picker. Error toast: "Import failed - check file format". Export: share sheet.
- Reminder: turning it on prompts the OS notification permission here only.
- About: "HiveBoard - No data collected. Everything stays on this device." Privacy policy link: external link, behind PIN (the user is already in a PIN-gated area; the link additionally shows the PIN gate again if the session is older than 5 min, to satisfy AC-53 literally. Decision for architect to confirm).
- Loading: none. A11y: switches labelled with state; picker dialogs are standard.

### 4.13 Full Access (paywall, parent, M11)

```
+------------------------------+
| <                            |
|     (padlock badge, Pip)     |
|   Unlock the Full HiveBoard  |
|  Add up to 4 children and    |
|  unlimited chores with a     |
|  one-time purchase. No       |
|  subscription, no ads.       |
|  [4 children] [Unlimited]    |
|  [ Get Full Access - $4.99 ] |
|  Restore purchase            |
+------------------------------+
```

- Only reachable after PIN (AC-23). No countdown timers, no fake urgency, no sale framing, no mention in kid screens.
- Loading: button shows spinner and "Opening store...", whole screen non-interactive except back. Error: inline berry card "Purchase didn't go through. You haven't been charged." with "Try again"; cancelled returns quietly to the previous screen (AC-25).
- Success: M11, then "You're all set" and a Done button. Price is read from the store (shown as localised price; $4.99 is the US default).
- Trial users see "{n} days left in your free trial" in a quiet caption; demo users see the demo copy from the spec.

---

## 5. Component inventory

No components exist yet (greenfield). Build as a small shared kit in `apps/mobile/src/ui/`, tokens from `docs/design-tokens.md`.

| Component | Variants / props | Notes |
|---|---|---|
| **BigTapTile** | `kind`: chore, avatar, tab, action; `state`: default, pressed, done, locked, disabled; size: 160 (phone), 200 (tablet) | Sticker style; hit area = whole tile; emits `ui_tap` or its own cue; baseline for kid taps (>= 64 pt) |
| **StampCheck** | `state`: empty (dashed ring), done, locked | Drives M1; vector SVG for crisp scaling |
| **PointsCounter** | `size`: pill (32), header (48), hero (`display.xl`); `animatedTo` | Hex badge with honey drop icon; ticking logic (M2); `accessibilityLiveRegion=polite` announces final value only |
| **PointsFlyChip** | from/to rects | Absolute overlay on a root-level portal so it can cross screens |
| **HoneyJar (ProgressBar)** | `variant`: jar-large, jar-compact, bar-flat (parent, linear); `value`, `target`, `affordable` | Skia/SVG liquid; text alternative "80 of 100 points toward Ice cream" |
| **RewardCard** | `state`: ready, notYet, goal, demoLocked | Shimmer on ready; M10 wobble |
| **AvatarHex** | `size`: 40, 64, 96, 140; `tint`, `emoji`, `ring` (daily progress) | Fallback to initial |
| **KidHeader / ParentHeader** | band colour from child tint / teal | Includes GrownUpsButton or BackToKids |
| **GrownUpsButton** | -- | 64 pt hex, wing icon, label "Grown-ups" (a11y only) |
| **PinPad + PinDots** | `mode`: set, confirm, enter; `state`: idle, error, cooldown, success | Keys 72 pt; M8 |
| **Celebration overlay** | `variant`: reward (M5), daily (M4 banner), purchase (M11) | Shared particle engine (pooled), single Reduce Motion switch |
| **Button** | `kid-primary` (honey), `kid-secondary` (white), `kid-plum`; `parent-primary` (teal), `parent-secondary` (outline), `destructive` (berry); sizes 56/64 | Loading state with spinner; disabled = dashed outline |
| **TextField, Stepper, SegmentedPicker, Toggle, DayChip, EmojiPicker, AvatarPicker, SuggestionChip** | Parent styles | Min 48 pt; labels always visible (no placeholder-only) |
| **Sheet / ConfirmDialog** | `destructive` flag | Focus trap, esc/back closes |
| **TrialBanner / ResetNoticeCard** | `tone`: info (sky.light), reminder (honey.light) | Dismissible; parent only |
| **EmptyState** | `illustration`, `title`, `cta` | Pip or spot art; M9 |
| **Skeleton** | row, tile, avatar | Reduce Motion: static |
| **Toast** | `tone`: info, error | `role=alert` for errors |
| **LockBadge** | on any tile | Padlock + dashed outline: the non-colour locked cue |
| **Pip (mascot)** | poses: wave, sun, think, cheer, sleep | Static SVG/PNG with simple Lottie option for entry only |

Build order suggestion for mobile-dev: tokens + Button + BigTapTile + StampCheck, then PointsCounter + HoneyJar + particle engine, then screens.

---

## 6. Accessibility notes (WCAG 2.1 AA)

- **Contrast**: text pairs verified in 2.1; all kid shapes carry the 3 pt ink outline (3:1 non-text). Large display text on plum/white >= 10:1. Do not place white text on `honey`.
- **Not colour alone (AC-60)**: done = check stamp shape; locked = padlock + dashed outline; error = icon + text + shake/fade; affordable = shimmer + "Get it!" button + thicker outline.
- **Targets (AC-58)**: parent >= 48 pt (primary buttons 56); kid >= 64 pt, hard floor 56. Gaps >= 12 pt between adjacent targets. Dismiss targets for toasts/banners also >= 48 pt.
- **Screen reader (VoiceOver / TalkBack)**: all tiles are single focusable buttons with composed labels ("Make bed, 5 points, not done"); decorative art `accessibilityElementsHidden`; completion, points, and redemption are announced via `AccessibilityInfo.announceForAccessibility` once (not per tick). Reading order: header, points, jar, list. Modals trap focus and restore it on close. Celebration focus goes to "Yay!".
- **Reduce Motion (AC-59)**: global rule in 3.1; every moment has a stated fallback. Also respect "Prefer cross-fade transitions" on iOS.
- **Motion safety**: nothing flashes more than 3 times per second; confetti is not high-contrast strobing; the shimmer is a single slow sweep.
- **Dynamic Type**: supports up to 150% (kid) / 200% (parent); tiles grow vertically; numbers never truncate; verify with 2-line labels.
- **Keyboard / switch access** (tablets with keyboards, switch control): full tab order, visible 3 pt focus ring `plum` offset 2 pt on all focusable elements, PIN pad accepts hardware digits and Backspace.
- **Sound / haptics (AC-48..AC-51)**: sound is never the only feedback; haptics skipped without engine; ambient audio category so music is never interrupted.
- **Cognitive**: one primary action per kid screen; consistent positions (back left, Grown-ups right, points top); no timers visible to kids; no time-limited rewards.
- **Safety (Kids category)**: no links, prices, or purchase CTAs on any kid screen; Pip never speaks or pressures; no "streak lost" messaging.

---

## 7. UX copy additions (beyond spec 6.5)

| Element | Copy |
|---|---|
| Kid home prompt | "Who's helping today?" |
| Chore tile first-time hint | "Tap when it's done. Tap again to undo." |
| Day done banner | "Great job! All done for today." |
| Chore completed toast/chip | "Great job! +{n} pts" (spec) shown as the flying chip "+{n}" |
| Not enough points | "{n} more to go!" |
| Reward ready | "Ready!" |
| Confirm redeem | "Get {reward}?" / "Yes!" / "Not now" |
| Celebration | "Reward Redeemed!" / "{reward name} is yours!" / "Yay!" |
| Demo locked reward (kid) | "Ask a grown-up to unlock rewards." (spec) |
| PIN prompt | "Grown-ups only" / "Enter your PIN" |
| PIN error | "Incorrect PIN - try again" |
| PIN cooldown | "Too many tries. You can try again in {n} seconds." |
| PIN mismatch | "PINs didn't match - try again" |
| Back to kids | "Back to kids" |
| Purchase success | "Unlocked! Thank you for supporting HiveBoard." |
| Purchase failure | "Purchase didn't go through. You haven't been charged." (spec) |
| Locked item (parent) | "Locked - unlocks with Full Access" |
| Delete undo toast | "{name} removed. Undo" (only for chores/rewards; child delete uses the confirm dialog) |
| Import failure | "Import failed - check file format" (spec) |

Tone: short, kind, concrete, present tense; no sarcasm, no pressure; max 6 words on kid surfaces where possible. `copy-voice` may polish.

---

## 8. Illustration and asset list (for the Creative Studio)

All art is **original**. Style brief: flat-colour shapes with the 3 pt warm-ink outline, soft paper-grain texture, rounded-hex geometry, tiny clay-like highlight on top-left. The palette is limited to section 2.1. No resemblance to existing apps, characters, mascots or brand icons. Deliver SVG where possible (PNG @3x fallback), transparent background, plus a layered source for animation.

| Asset | Description | Format / size |
|---|---|---|
| **App icon** | A rounded-hex "honey badge" in `honey` with ink outline, containing a bold white-and-ink **check stamp** that looks like a bee wing at one corner (two translucent wing ovals behind the hex). Single focal element, no text. Background: `paper` flat. Not a bee face, not a stripe-bee silhouette | 1024 x 1024 master, adaptive Android layers (foreground 432 safe zone, background flat), iOS tinted/dark variants optional |
| **Splash** | Hex badge on `paper`, 600 ms fade; uses Reduce Motion-safe static | 1284 x 2778 + tablet |
| **Mascot "Pip"** (owner decision) | A small, round, fuzzy golden creature with one dark stripe, tiny rounded wings, two dot eyes, no mouth detail beyond a small smile. Never speaks. 5 poses: wave, sun (relaxed), think, cheer, sleep. Original silhouette: wide pill body, small wings, no antennae curls like common bee mascots, no gloves, no sunglasses | SVG layers + 5 PNG @3x, <= 300 KB each |
| **Honey jar** | Jar with hex-pattern glass, cork lid that can pop, 6 fill states for static fallback (0, 20, 40, 60, 80, 100%), plus drop and bubble sprites | SVG + liquid mask |
| **Honey drop** | The points icon in 3 sizes (16, 24, 40) with highlight | SVG |
| **Check stamp** | Meadow disc, white heavy check, ink outline, plus impact ring | SVG |
| **Emoji set** | Noto Color Emoji subset (~120): chores (bed, teeth, dishes, laundry, trash, pet, plants, homework, tidy toys, table setting...), rewards (ice cream, movie, park, book, game time, pizza, bike, sleepover...) | PNG @3x sprite, Apache-2.0 attribution in About |
| **Avatar emoji set** | 24 face/animal emoji from the same family | included above |
| **Empty-state spot art** (M9) | 5 illustrations with Pip: no children, no chores today, no rewards, no chores scheduled, all done | SVG, 240 x 240 |
| **Onboarding panels** | 3 panel scenes ("tap a chore", "collect honey", "get a reward") plus welcome hero | SVG, 640 x 480 |
| **Celebration art** | Rotating rays, hex and star confetti pieces (6 shapes, 4 colours), banner sticker "Great job!", big plum background with hex pattern | SVG / sprite sheet |
| **Paper texture + hex pattern** | Tileable 4% hex pattern for kid background; 2% paper grain | PNG 512 tile |
| **Lock badge, wing "Grown-ups" icon, icon set** | Custom 24 pt icon set (section 2.4) | SVG |
| **Store assets** | Screenshots in kid mode (Chore View mid-celebration, Rewards ready, Kid Home), parent mode (Dashboard, Schedule), Kids category-safe: no prices on kid shots, no real children | per store spec (Creative Studio `asset-list.md`) |
| **Sound pack** | Per section 4a; timbres: soft marimba, pop, chime. `copy-voice` | per architect format |

---

## 9. Open decisions for the owner

1. **Mascot "Pip"**: allow a static mascot (empty states, onboarding, celebration) or no mascot at all? Spec lists "avatars with characters" as out of scope; Pip is a non-collectible static illustration. Recommended: yes.
2. **Emoji set**: bundle Noto Color Emoji PNGs (consistent look, ~1 MB) versus system emoji (smaller, differs per OS). Recommended: bundle.
3. **Redeem confirmation**: add the 2-tap "Get {reward}?" sheet before the celebration (prevents accidental spends), or redeem on one tap? Recommended: 2 taps.
4. **Particles via react-native-skia**: adds a dependency; fallback is <= 40 Animated views. Architect to confirm (affects bundle size and Kids review is unaffected, Skia is local).
5. **Age band** (spec Q1): this design assumes 6-8 (icon-first with numerals and short words). If the band becomes "5 and under", kid copy should shrink further and kid-side numerals get speech-free pictograms.
6. **Privacy-policy link PIN re-prompt** (4.12): confirm a second PIN prompt for external links is acceptable, or rely on being already in the gated area.
