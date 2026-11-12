# HiveBoard store assets: Mode B review

Reviewer: creative-director, 2026-11-12. Against brand.md, asset-list.md, review-icon.md, and store specs.
Method: I checked the pixel size, colour mode and alpha of every PNG with Pillow. I viewed the iPhone 6.9 and 6.5 sets in full, plus the full iPad 13 and Android phone sets, the icon set with its 48/29 px checks, the splash, all onboarding pieces, the feature graphic and the background plates. I read every notes.md and copy.md.

## Technical summary
All sizes are correct. All store screenshots, icon-1024, the feature graphic and splash.png are RGB with no alpha. icon-1024 field = #FFC93C, adaptive background and splash = #FFF7E6 exactly. The play-512 alpha channel is fully opaque, which is accepted. No generated text. The only rendered text is the Fredoka/Nunito overlay and real app UI. No people or faces. Originality: the jar is a generic honey pot that resembles no known mark, and there is no bee mascot.

## Copy (copy.md)
| ID | Verdict | Notes |
|---|---|---|
| C1a-C1g | PASS | All within limits. Claims are only from brand.md §6. There is no Kids/COPPA/sync/competitor language, and "free" always appears as "14-day free trial". Owner must split the iPhone/Android sentence per store at upload (already noted). |
| C2 captions | PASS | S3 is reworded to "Points and rewards, optional" so it stays truthful to the shipped UI (no jar visual). This is accepted. |
| C3 / V1 / V2 / V3 | NOT DELIVERED | Deferred. Optional per asset-list, so it does not block. |

## Icons and splash
| Asset | Verdict | Notes |
|---|---|---|
| I1 icon-1024.png | PASS | The fixes from review-icon.md are applied. The jar reads at 48 and 29 px because the cream border separates it from the field. At 29 px the drop is tiny, which is acceptable. |
| I2 adaptive-foreground.png | PASS | Inside the safe circle, transparent. |
| I3 adaptive-background / play-512 / monochrome | PASS | The slight halo blob on the monochrome is acceptable. |
| I4 splash.png, splash-mark-400.png | PASS | #FFF7E6, so there is no seam. Jar mark only. |

## Illustrations
| Asset | Verdict | Notes |
|---|---|---|
| I5 bg plates (6 sizes) | PASS | Paper, 4% hex pattern, honey blob, empty caption band. |
| I6 welcome-honey-jar.png | PASS | |
| I6 household-couple.png | PASS | |
| I6 household-farm.png | PASS | |
| I6 household-home.png | **REDO** | Keying artifact. The lavender key removed the toy block's top and right faces, which are now transparent holes with a ragged blue fringe. Fix: re-key with a tighter tolerance plus a flood fill from the canvas edges only, so interior pale faces are kept. Alternatively, fill the two faces with a solid colour (top face paper #FFF7E6, right face plum.light #D9C8F5) inside the ink outline. Check the result on both #FFF7E6 and a dark background. The teddy bear is an object, so it is fine. |
| I7 feature-graphic.png | PASS | 1024x500 RGB. The wordmark and tagline are real fonts, and content stays clear of the edges and the centre. The wordmark sits around x 500-970, close to the centre play-button zone. Optional: shift the text block right by about 40 px. |

## Store screenshots
| Set | Verdict | Notes |
|---|---|---|
| iPhone 6.9 (01-06) | PASS (with device note) | Clean, consistent, captions legible at thumbnail size, generic 9:41 bar, no prices. S1 member labels are small, but that is the shipped UI. |
| iPhone 6.5 (01-06) | PASS (with device note) | Matches 6.9. |
| iPad 13 (01-06) | **REDO** | The UI is far too small. S1 is a thin strip with unreadable member tiles, and S5 text is unreadable at real size. The iPad is the primary device per the brief, so these shots must show a full, readable board. Fix: recapture with a smaller CSS viewport at a higher scale (e.g. 688x917 @3 = 2064x2751, pad 1 px; or 826x1101 @2.5), so the app renders larger and fills the frame. Then compose as a full-height tablet frame like the phones instead of the cropped "window". If the app's tablet layout is still a small left-aligned grid, flag it to the owner and mobile-dev as a product issue before shipping, because screenshots must show the real app. |
| Android phone (01-06) | **REDO** | The 360 CSS-px viewport forces a single-column layout. S1 shows only Ava, Sam and part of Mia, so the Adult (Dana) is not visible and the shot fails S1's acceptance. S2 is scrolled past the header (no name, points or progress), and S4 shows only 2 chores. Fix: capture at 412x732 @2.625 (1080x1921, crop 1 px) or switch to 1080x2400 (412x915 @2.625) using a matching plate. Scroll to the top for S2. All 4 members must be visible on S1. |
| Android 7"/10" tablet | NOT DELIVERED | Recommended, not required. Plates exist (1200x1920, 1600x2560). Do this after the iPad redo using the same capture approach. |

## Needs a real device / simulator (all sets)
- **S2 mid-celebration:** the web capture missed the stamp animation. Retake on an iOS simulator / Android emulator (or a screen recording, then frame-grab) at the moment the stamp lands. Until then, the current S2 is truthful and acceptable for the iPhone sets.
- **Status bar and emoji:** the real 9:41 status bar and Apple/Google system emoji (currently the host's Noto set) need a device capture. This is not blocking, because the generic bar is fine.
- **S3 jar:** if a honey-jar progress visual ships later, retake S3 and restore the original caption.
- V1 app preview needs real screen recordings from a device, not web captures.

## Redo list (loop 1 of max 2)
1. image-artist: re-key household-home.png (above).
2. mobile-dev or image-artist: recapture iPad 13 and Android phone raws at the viewports above, then re-run compose.py for those sets.
3. Optional: nudge the feature-graphic text right.

DECISION: REDO

---

# Round 2 re-review (redo loop 1 results), 2026-11-12

I viewed all 12 recaptured screenshots, household-home.png composited on paper, and the feature graphic. All are the correct size, and the screenshots and feature graphic are RGB with no alpha.

| Asset | Verdict | Notes |
|---|---|---|
| I6 household-home.png | PASS | The toy block's faces are now solid (plum, meadow, sky), with no holes or fringe. The edges are clean on paper. |
| I7 feature-graphic.png | PASS | The text block sits right of centre, clear of the edges. |
| Android phone 01-06 | PASS | S1 shows all 4 members including Dana (Adult). S2 has the header, name, points and progress. S4 shows the barn board. Text is legible at real size. |
| iPad 13 01-06 | PASS (interim) | The full-height tablet frame works, captions are strong, and S2-S5 are legible. S1 member tiles are small and the board is sparse, which reflects the app's current layout, not the composite. This is acceptable as an interim set. **Recapture required** after mobile-dev's tablet-aware layout lands, using the same compose.py and frame. |

Minor consistency notes (not blocking, but fix on the next capture pass, i.e. the iPad recapture):
- Demo data differs between sets. Ava shows 53 pts on iPad and Android but 52 on iPhone. Chris's barn board shows "2 of 4 done" (no "Check the fence") on iPad and Android but "2 of 5" on iPhone. Use one seed for every set and recapture all four sets together so they match. The store acceptance asks for consistency across sets.
- iPad S2: the "+8" points-fly badge overlaps the "Ava" title. Either capture after the badge clears or catch it clearly mid-flight as part of the S2 mid-celebration retake on a real device.

Still open from round 1 (needs a real device or simulator, not blocking): S2 mid-celebration retake, the real status bar and system emoji, and V1 from device recordings. Not delivered (optional): the Android tablet set, C3, V1, V2 and V3.

DECISION: APPROVE
(Ready for owner approval. The iPad set is interim and must be recaptured after the tablet layout lands. Unify the demo data at that recapture.)
