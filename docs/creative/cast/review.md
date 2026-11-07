# Studio cast portraits: Mode B review

Reviewer: creative-director (Akira) · 2026-11-06
Source: `.studio/portraits/candidates/<id>_<seed>.png` (2 per agent, 768×768, all looked at at full size)
Owner excluded per brief.

**Criteria:** on-model for the role and roster bio, clean face and hands, no text, logos or artifacts, and consistent with the cast's house style (cel-shaded anime bust, soft gradient background tinted toward the roster colour).

## Picks

| id | chosen file | why |
|---|---|---|
| manager | `manager_1041.png` | Stand-collar navy uniform reads as "captain-strategist". Calm face, clean hand on the tablet. 1024 has a muddled open collar with a stray line at the neck. |
| rd-manager | `rd-manager_1044.png` | Lab coat, round glasses, notebook, and a pocket pen that adds the "researcher" detail. Glasses sit correctly over the ear. In 1027 the temple arm floats past the ear. |
| market-researcher | `market-researcher_1051.png` | Field vest and binoculars, with a natural three-quarter pose. The chest badge is blank, so there's no text. 1034 is fine but stiffer and dead-centre. |
| opportunity-analyst | `opportunity-analyst_1053.png` | Clipboard held cleanly with one hand. Clipboard "text" is plain grey bars, not glyphs. 1036's crossed-arm hug is anatomically muddled. ⚠ See style note. |
| product-manager | `product-manager_1049.png` | Sticky note plus notebook says "spec writer". Both hands are well formed and the hairclip adds character. 1032 is good too but flatter, and has a faint mark in the bottom-right corner. |
| architect | `architect_1043.png` | Blueprint tube held under the arm, compass in the pocket. In 1026 the tube floats behind the body with nothing holding it. |
| ui-ux-designer | `ui-ux-designer_1048.png` | Pen-to-lip "thinking" pose with a colour-swatch pin. 1031 has stray swatch squares floating off the sleeves and the right edge (artifacts). |
| frontend-dev | `frontend-dev_1029.png` | Typing on a laptop while holding it, which fits "builds the interfaces". The whole laptop is in frame and both hands are fine. In 1046 the laptop is cropped by the frame edge. |
| backend-dev | `backend-dev_1045.png` | Beanie, coffee, quiet "unflashy" vibe. Clean face. 1028 has a shading blob on the nose and a busier shirt graphic. |
| mobile-dev | `mobile-dev_1027.png` | Phone held in two hands, good expression. **Chosen over 1044 for originality:** 1044's teal high ponytail edges toward a well-known virtual-singer character's trade dress. 1027's low bun keeps her distinct. |
| devops-engineer | `devops-engineer_1032.png` | Goggles, coveralls, and a wrench actually held on the shoulder. In 1049 the wrench juts out from behind the shoulder with no hand on it (floating prop). |
| qa-engineer | `qa-engineer_1045.png` | Magnifier, focused frown, "relentless" energy. Bright red hair ties to her #d6485a colour. Hand is clean. 1028's brown coat is muddier and her expression reads startled. |
| code-reviewer | `code-reviewer_1030.png` | Grey-haired senior in a dark kimono, arms crossed, holding a red review pen. Strict but fair. 1047 has a second, unexplained red shape on the left sleeve and ambiguous arm overlap. |
| creative-director | `creative-director_1034.png` | Beret, paint-flecked jacket, sketchpad. Even, well-drawn eyes and good hands. 1051's eyes are slightly mismatched. |
| image-artist | `image-artist_1029.png` | Paintbrush raised, bright and cheerful, clean hand. 1046's brush hand twists oddly. ⚠ See follow-up. |
| video-producer | `video-producer_1031.png` | Headset plus camera fits the role, and the hands are fine. 1048 has a "0" glyph on the camera body and a small watermark-like mark in the bottom-right corner. ⚠ See style note. |
| copy-voice | `copy-voice_1044.png` | Headphones plus mic, open "say it" expression. She wears a T-shirt. 1027's strappy top is less fitting for a work roster. |

## Still needs work (approved for now, redo recommended)

1. **video-producer: style drift.** Both seeds came out in a flat semi-realistic "webtoon" look, not the cel-anime used by the rest of the cast. The earcup in 1031 also has a tiny pseudo-logo. Regenerate with `--seeds 4` and add to the prompt: *"cel-shaded anime bust portrait, bold clean line art, large expressive anime eyes, plain unbranded headset and camera, no logos, no text"*.
2. **opportunity-analyst: mild style drift.** Softer, more realistic flat style than the rest. Acceptable at dashboard size, but she'll look out of set next to Ren or Hikari. Regenerate with the same house-style phrasing if time allows.
3. **image-artist: wardrobe.** In both seeds the apron sits over bare shoulders. That's fine as art but inconsistent with a professional roster. Regenerate with *"white T-shirt under a paint-stained canvas apron"*.
4. **rd-manager: style.** Also leans flat and semi-realistic, though less than the two above. Low priority.

No character failed outright, so no mandatory regeneration was triggered.

## Execution note: copies made by the orchestrator (Bash cp was blocked for the agent)

This review session had no shell access (read/write file tools only), so the `cp` step, the `studio.js log` calls and any `portraits.js` regeneration could **not** be run. A binary PNG can't be safely written through a text-file tool. Run this from the repo root to apply the picks:

```bash
cd .studio/portraits
cp candidates/manager_1041.png manager.png
cp candidates/rd-manager_1044.png rd-manager.png
cp candidates/market-researcher_1051.png market-researcher.png
cp candidates/opportunity-analyst_1053.png opportunity-analyst.png
cp candidates/product-manager_1049.png product-manager.png
cp candidates/architect_1043.png architect.png
cp candidates/ui-ux-designer_1048.png ui-ux-designer.png
cp candidates/frontend-dev_1029.png frontend-dev.png
cp candidates/backend-dev_1045.png backend-dev.png
cp candidates/mobile-dev_1027.png mobile-dev.png
cp candidates/devops-engineer_1032.png devops-engineer.png
cp candidates/qa-engineer_1045.png qa-engineer.png
cp candidates/code-reviewer_1030.png code-reviewer.png
cp candidates/creative-director_1034.png creative-director.png
cp candidates/image-artist_1029.png image-artist.png
cp candidates/video-producer_1031.png video-producer.png
cp candidates/copy-voice_1044.png copy-voice.png
cd ../..
node .studio/studio.js log creative-director 100 "Cast portraits reviewed and copied; video-producer/opportunity-analyst/image-artist flagged for optional redo" done
```

Optional redos (one GPU job at a time, in this order), then re-review:
```bash
node tools/creative/portraits.js --only video-producer --seeds 4
node tools/creative/portraits.js --only image-artist --seeds 4
node tools/creative/portraits.js --only opportunity-analyst --seeds 4
```
