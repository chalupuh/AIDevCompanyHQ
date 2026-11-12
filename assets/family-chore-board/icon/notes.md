# HiveBoard icon set notes

Model: Z-Image-Turbo via ComfyUI (`comfy.js image`, 1024x1024, default steps). Generated 7 candidates, kept 3, rest deleted.
Derived files (foreground cutout, background, monochrome, play-512) were made with a Python/Pillow script, since `rmbg` is not implemented in comfy.js.

Base prompt A (seeds 201, 202):
"flat claymation-inspired icon illustration, a squat rounded honey jar with a blank cream hexagon label, a golden lid, one honey drop falling above, chunky rounded shapes, thick dark brown outline, die-cut sticker look with cream border, hard offset shadow straight down, vivid saturated honey yellow flat background, palette honey yellow, cream, dark brown, centered, simple bold, no text, no letters"
Prompt B (seed 301): "...a squat rounded honey jar overflowing with honey, honey dripping down the sides, blank hexagon label, thick dark brown outline, cream background, jar large and centered filling most of the frame, palette honey yellow, cream, dark brown, small meadow green accent, simple bold, no text, no letters"

## Top 3 (1024x1024 RGB, no alpha)
- `icon-1024-option-a-a202.png` (prompt A, seed 202) **RECOMMENDED**. Cleanest silhouette, honey drop reads on the lid, sticker border, hex label. Chosen as `icon-1024.png`.
- `icon-1024-option-b-a201.png` (prompt A, seed 201). Similar; the top knob reads as a bead rather than a drop. Runner-up.
- `icon-1024-option-c-b301.png` (prompt B, seed 301). Boldest and largest at small sizes, but cream field instead of honey, and a white (not cream) label.

## Final files
- `icon-1024.png`: iOS master = option A. No alpha, no text.
- `adaptive-foreground.png`: 1024 RGBA, jar cut out of option A, max radius about 321 px, inside the 338 px safe circle.
- `adaptive-background.png`: solid #FFF7E6.
- `monochrome.png`: black silhouette (jar alpha) on transparent, 1024.
- `play-512.png`: option A downscaled to 512, RGBA.

## Caveats
- Field colour is a softer honey than token #FFC93C (model drift); could be colour-corrected in post if the CD wants an exact match.
- Foreground and monochrome include the cream sticker halo; monochrome silhouette therefore has a slight outline-blob look. Checked 180/120/60/48/29 px: still readable as a jar.
- Honey drop is tiny at 29 px.

## Post-fixes applied (CD review-icon.md), 2026-11-12
- icon-1024.png: field flattened to #FFC93C, flat ground shadow ellipse #7A4A00 at ~18%, sticker scaled 1.12x (jar body ~70% width, drop top ~85 px from top). RGB, no alpha. Label left as is.
- play-512.png regenerated (512 RGBA). check-48.png and check-29.png saved (downscaled master; cream border separates jar from the field).
- jar-sticker.png: tight cutout of option A jar (RGBA), reused by splash, onboarding and feature graphic.
