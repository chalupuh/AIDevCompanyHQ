# Design tokens

Project: HiveBoard (family chore board). Canonical rationale, usage and motion are in `docs/specs/family-chore-board.ux.md`; this file is the quick reference for implementers. Shared by iOS and Android (Expo).

## Colour (light)
| Token | Hex |
|---|---|
| ink | #2B1A0F |
| ink.soft | #6B4A2B |
| paper (bg.kid) | #FFF7E6 |
| paper.2 | #F2EDE0 |
| white | #FFFFFF |
| honey | #FFC93C |
| honey.light | #FFE9B0 |
| honey.dark | #7A4A00 |
| meadow | #1F7A4D |
| meadow.light | #9ADBC0 |
| plum | #4A2C8F |
| plum.light | #D9C8F5 |
| sky.light | #BFE3F5 |
| coral.light | #FFC2B3 |
| berry | #B3402A |
| bg.parent | #F4F6F2 |
| parent.primary | #1D5C73 |
| parent.text | #1F2A30 |
| parent.muted | #56656C |

Kid shapes always carry a 3 pt ink outline (non-text 3:1). Never white text on honey.

## Type
Fredoka (kid display, numerals) and Nunito (body, parent), both SIL OFL via @expo-google-fonts.
display.xl 56/60 · display.l 40/44 · title.kid 28/32 · label.kid 20/24 · title.parent 24/30 · heading 18/24 · body 16/24 · caption 13/18 · button 20/24.

## Spacing / radius / sizing
Spacing 4, 8, 12, 16, 24, 32, 48, 64. Radius sm 8, md 16, lg 24, xl 32, hex 28, pill 999.
Touch targets: parent >= 48 pt, kid >= 64 pt (floor 56).

## Elevation
Kid sticker: offset (0,5), blur 0, ink. Parent: y2 blur8 ink 8% (elev.1), y8 blur24 ink 14% (elev.2).

## Motion
spring.pop damping 12 / stiffness 220 / mass 0.8; spring.soft damping 18 / stiffness 160 / mass 1; easeOut cubic-bezier(0.22,1,0.36,1); easeInOut cubic-bezier(0.65,0,0.35,1). Reduce Motion: cross-fades only, no translation > 8 pt, no particles.
