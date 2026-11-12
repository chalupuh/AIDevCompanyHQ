# HiveBoard icon checkpoint (I1-I3)

Reviewed: option A (seed 202), option B (seed 201), option C (seed 301), adaptive-foreground, monochrome, against brand.md and asset-list.md I1-I3.

## Candidates
- **A (seed 202), CHOSEN.** Squat jar, ink outline, cream die-cut border, honey drop on the lid, offset shadow. On-brand, original (generic honey pot, no resemblance to an existing mark), no text, no artifacts. Weak points: the field is a pale honey (around #F8D86A) instead of #FFC93C, so jar and field blend together. The label is a soft rectangle, not a hexagon. The jar fills only about 62% of the canvas.
- **B (seed 201), runner-up.** Has the better hex label, but the lid knob reads as a bead or button, not a honey drop. Same pale field.
- **C (seed 301), rejected.** Bold and large, but it has a cream field, a pure-white label (off-palette), no drop, and a green ground smear. At small sizes it reads as a generic jar.

## Layers
- adaptive-foreground: clean cutout inside the safe circle. The cream halo is acceptable and nearly invisible on the #FFF7E6 background. Keep it.
- monochrome: clean, solid silhouette that reads as a lidded jar. The halo makes the shape slightly blobby but it is acceptable. Keep it.
- adaptive-background: #FFF7E6, correct.

## Post-fixes (image-artist, Pillow, no regeneration)
1. **Field colour:** in icon-1024.png, replace the background field (everything outside the cream sticker border, including the soft ground shadow) with flat #FFC93C. Redraw the ground shadow as a flat ellipse in honey.dark #7A4A00 at about 18% opacity. Do not change the jar's own colours.
2. **Scale:** enlarge the sticker (jar plus cream border) about 1.12x around its centre, so the jar body spans about 70% of the width and the drop sits at least 80 px below the top edge. Keep it centred and keep the canvas at 1024x1024 RGB with no alpha.
3. Regenerate play-512.png from the fixed master (512x512, 32-bit).
4. Re-check the result at 48 px and 29 px over a #FFC93C field. The cream border must separate the jar from the field. Save the checks as `icon/check-48.png` and `icon/check-29.png`.
5. Do not change the hex label. The rectangle is acceptable, and the hex motif will come from the UI and backgrounds.

Downstream assets (splash, onboarding, screenshots) may use option A's jar now. Only the icon field changes.

DECISION: APPROVE WITH FIXES
