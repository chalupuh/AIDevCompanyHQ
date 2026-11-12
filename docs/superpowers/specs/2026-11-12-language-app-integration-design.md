# Language app integration + "Read Along": design

Date: 2026-11-12 · Status: draft for owner approval

## Intent

The owner runs a live language-learning app, **À l'Oreille** (repo `chalupuh/LanguageLearningApp`), hosted on **chatgptsites** (OpenAI Sites, Cloudflare Worker + D1 + R2). It has a few active users, and the owner's wife is the main one. Until now it has been built in Codex. The owner wants the studio's agents to help build it from here on, for two reasons:

1. **Cost.** OpenAI API usage, mostly TTS for pre-made lesson audio, is expensive. Local models on the 5090 (and later BLD) should do that work wherever quality allows.
2. **Capability.** The next big request needs voice and image work that the Creative Studio is built for.

The first project through the new setup is the wife's request (French, submitted through the in-app feedback center):

> A new "Read Along" section: B1/B2 paragraphs read aloud while she follows the text, then she writes what she thinks it was about. Easier than the listening challenge, good for learning words in context. Lore flavoured like Elden Ring, Dark Souls, Tainted Grail.

The owner added: narration that sounds like a dark-fantasy game narrator, in French, and a small cartoonish talking character on screen in the style of the narrated world. **Voice quality gets tested before we commit to it.**

## Goals

- G1: The app repo becomes a studio project. The engine pipelines, agents, QA and review gates and Control Room all work on it, and worker stages run on local LLMs first, as with HiveBoard.
- G2: Hosting and deployment stay exactly as they are: chatgptsites, published by the owner through the Sites workflow. A GitHub push never deploys.
- G3: Codex and the studio share the repo safely. The repo's existing `AGENTS.md` stays the shared rulebook for both.
- G4: Feature requests from the in-app feedback center (`feature_requests` table in D1, owner view at `/feedback`) become studio work items without retyping.
- G5: A French voice bake-off picks the narration voice by listening, not by assumption. OpenAI TTS is the fallback.
- G6: Read Along ships for French with original dark-fantasy lore passages (B1 and B2), pre-generated narration, word-level read-along highlighting, an animated talking narrator character, and a written summary step.

## Non-goals

- Moving hosting, the database or auth off chatgptsites.
- Live (runtime) local inference. The hosted site never calls the owner's PC. All audio and images are made ahead of time and committed or uploaded as static assets.
- Replacing the live OpenAI calls the app already makes (`/api/speech`, `/api/comprehension`, `/api/feedback`, `/api/writing`, `/api/phrase-help`). They stay as they are for now. Read Along's summary step reuses the existing comprehension grader.
- Swedish/Spanish Read Along (later; Kokoro has no Swedish voice anyway).
- Rewriting the app's stack or splitting `app/page.tsx`.

## Anti-goals (failure even if it "works")

- **Using real game IP.** No characters, names, likenesses, logos, quotes or lore text from Elden Ring, Dark Souls, Tainted Grail or any other game. Everything is original: invented worlds, characters and narrators that share the *genre mood* (melancholy, ruined kingdoms, cryptic NPCs, knights, witches, hollowed pilgrims). This protects the live app and keeps the content ours. The "per game" idea becomes **three original worlds**, each loosely in the spirit of one game's mood.
- A narrator voice that sounds robotic or mispronounces French. That is worse than today's OpenAI voices. If the bake-off can't beat OpenAI, use OpenAI.
- Breaking her current progress, review schedule or the Codex workflow.
- Bloating the deploy: the site already ships ~180 MB of audio in `public/audio`.

## Constraints (from the repo)

- Stack: vinext (Next-style app router on Vite 8), React 19, Cloudflare Worker via `@openai/sites-vite-plugin`, D1 through Drizzle, R2 `BUCKET`. Node ≥ 22.13.
- Checks before every commit: `npm run typecheck`, `npm test` (builds first), `npm run lint:baseline`.
- `app/page.tsx` (~129 KB) is the merge-conflict hotspot. Adding a view touches 4 places there (view union, hash-restore whitelist, navigation arrays + labels, render chain), plus the tutorial `Destination` type. Agents make small exact-substring edits only.
- Audio pipeline already exists: `scripts/rebuild-aligned-audio.mjs` (+ `audio:*` npm scripts) produces versioned, transcript-validated clips into `public/audio/passages`. It calls OpenAI `gpt-4o-mini-tts`. Read Along adds a **local voice backend** to this pipeline instead of building a new one.
- Studio rules: one repo per project (ADR 0002), auto-merge policy for internal PRs. **This app is external/user-facing**, so per the auto-merge policy its PRs merge only with the owner's OK. Publishing to chatgptsites is always the owner's action.

## Part 1: Bring the repo into the studio

1. **Register the project.** Add it to the studio's project registry (the same mechanism HiveBoard uses) with slug `a-loreille`, local checkout `../LanguageLearningApp`, `workdir` for pipelines pointing there. Label: external app, owner-merge.
2. **Shared rulebook.** Studio agents read the app's `AGENTS.md` + `CLAUDE.md` first. Add one section to `AGENTS.md` ("Studio agents"): branch naming `studio/<task>`, never edit on `main`, pull/fetch rules already there, and the PR is labeled `owner-review` so auto-merge never picks it up. Codex keeps working as before.
3. **Specs live in the app repo** under `docs/specs/` (the app already keeps plans in `docs/`). The studio HQ keeps only the pipeline and this integration doc.
4. **Feature-request intake.** A small script (`tools/intake/a-loreille-requests.js` in StudioControlRoom) reads submitted requests. The owner exports them, or, if the app offers an owner-authenticated JSON endpoint (`/api/requests` exists; builder confirms it), the script uses an owner token stored outside the repo. It turns each request into `docs/research/ideas/a-loreille-<id>.md`. The owner still picks which ones get built. Updating request status in the app stays manual at first.
5. **Pipelines.** Reuse `lite-build` with `workdir` = app repo and Team = frontend-dev (+ backend-dev only if a D1 table is needed). Add one new pipeline, `content-audio`, for batch narration/image jobs (script stages on the GPU, Creative Director review on Opus, owner gate).
6. **Smoke test** before real work: run a tiny `lite-build` task on the app (e.g. a copy fix) to prove checkout, checks, branch and PR all work against this repo.

## Part 2: French narrator voice bake-off (test before committing)

Run by `copy-voice`, judged by `creative-director`, decided by the owner (and the wife, who knows best what helps her listen).

- **Test script:** 3 short original passages (B1 neutral, B2 lore narration, a dialogue line for a character), ~30–45 s each.
- **Candidates** (all run locally; builder confirms each installs on Windows/5090 and checks the license):
  - Kokoro-82M French voice (already installed; baseline)
  - XTTS-v2 (strong French, voice cloning; *non-commercial license: flag to owner*)
  - F5-TTS with a French fine-tune
  - Chatterbox Multilingual (French support, permissive license)
  - Fish Speech / OpenAudio
  - Control: current OpenAI `gpt-4o-mini-tts` with a "weary dark-fantasy narrator" instruction
- **Style:** deep, slow, reverent narrator; optional light post-processing (subtle reverb/room, EQ, ffmpeg) to get the "game narrator" feel. Each world gets its own narrator voice.
- **Automatic checks:** Whisper large-v3-turbo transcribes each clip and the word error rate is compared to the text (pronunciation guard); clips must also pass the existing `audio:validate-french` checks.
- **Output:** `docs/creative/a-loreille/voice-bakeoff/` with the clips, a scorecard and a simple HTML listening page (blind A/B labels). The owner gate picks a winner per world or falls back to OpenAI.
- **Exit rule:** if no local model is at least as good as OpenAI on blind listening, use OpenAI for the narration and log the cost estimate.

## Part 3: Read Along feature (French)

**Content.** Three original worlds (working names chosen by `copy-voice`/`creative-director`), each with a narrator character. Start with **12 passages**: 2 worlds × … (builder's call on the split), half B1 and half B2, ~120–200 words each. Written by a local LLM, then checked by an Opus pass for CEFR level, natural French and the no-real-IP rule. Each passage has a short glossary of key words. Stored in a new `content/read-along.ts`, following the shape of existing content files.

**Audio.** Generated by the winning voice through the existing audio pipeline (new local backend), versioned the same way. Word-level timestamps come from Whisper alignment so the text can highlight word by word. Shipped like other clips, as compressed audio; the builder checks the size budget against the 180 MB already shipped (R2 is an option if it's too large).

**Talking narrator character.** Made by `image-artist` in ComfyUI (Z-Image-Turbo, Qwen-Image-Edit for variants, rembg for transparency): a small cartoonish, original character per world in the dark-fantasy style, as a sprite set: idle, mouth closed/half/open, blink. In the app, the mouth frame follows the audio loudness (Web Audio analyser) and it blinks at random. No video files, so it's light and works offline. `video-producer` is *not* needed for v1. Optional per-passage background illustration if the size budget allows.

**Screen flow (one passage):** pick a passage (world + level) → narrator appears, plays audio with the text highlighting along (1× / 0.8×, replay, tap a word for its glossary entry) → "What was it about?" free-text summary → existing `/api/comprehension` grades it → result + option to save phrases to the existing phrase/review system → mark complete.

**Where it lives:** a new view `readalong` in the French navigation (and its route `#readalong/<passageId>`), following the 4-place pattern in `page.tsx`. Progress uses the existing progress/review storage; it awards XP like a rehearse (builder's call on the exact value, consistent with `lib/journey.ts`).

**Team:** frontend-dev (view, player, sprite animation), copy-voice, image-artist, creative-director, qa-engineer, code-reviewer. No backend-dev unless storage needs a new table.

## Milestones

1. **Studio onboarding + smoke** (Part 1). Done when a trivial engine task produces a green PR on the app repo.
1b. **Hana intake mode + `intake`/`quick-fix` pipelines** (Part 1b). Done when the exported requests become a ranked queue with runnable work orders. Read Along's own work order comes out of this step.
2. **Voice bake-off** (Part 2). Done when the owner picks the voice(s).
3. **Read Along v1:** content + audio + sprites + view, 12 passages. QA on desktop and phone width, Opus + Codex review. Owner merges and publishes to chatgptsites.
4. *(Later)* More worlds/passages through `content-audio`; consider moving the other pre-made audio generation from OpenAI to the local voice if it won the bake-off.

## Owner gates

- Approve this design.
- Pick the narrator voice(s) from the bake-off.
- Approve the character art + world names (Creative Director review first).
- Merge the app PR and publish to chatgptsites.

## Calls made after the builder check (Claude's calls, owner can override)

- **Grader:** `/api/comprehension` already accepts any `passage` + `summary` (+ level/language), so Read Along reuses it unchanged. No backend-dev is needed for grading.
- **Worlds:** v1 has **3 worlds × 4 passages** (2 B1 + 2 B2 each) = 12 passages, so 3 narrator voices and 3 sprite sets.
- **Audio location:** v1 ships compressed audio in `public/audio/read-along/` (12 short clips is small). R2 is considered only in Milestone 4, and any upload to the hosted site is done by the owner.
- **Intake:** v1 uses a **manual export** (the owner copies requests or exports them from `/feedback`) and the script converts them. No agent holds a production token.
- **Merging:** the app is registered as owner-merge. The pipeline for this repo has **no merge step**: it stops at an owner gate after opening the PR. `tools/ci/merge-pr.js` refuses this repo (add it to a deny list), and the `owner-review` label is set as a second guard.
- **Bake-off licensing:** see owner decisions below.

## Owner decisions (2026-11-12)

- **License:** the app is free, for family and a few friends, with no plans to charge. Non-commercial voice licences (e.g. XTTS-v2) are allowed. Record the licence of whatever ships in `docs/creative/a-loreille/licenses.md`, so it can be revisited if that ever changes.
- **Judge:** the owner's wife judges the blind listening, and her pick wins.
- **Several voices:** she wants a few different voices. Each world gets its own narrator, and the bake-off offers 2–3 voice options per world. Where a model supports cloning or speaker presets (XTTS, F5, Chatterbox), make several distinct narrators from it.

## Part 1b: Hana (product-manager) as the intake desk

The owner wants the product manager (**Hana**, `product-manager`) tuned to take in **feature requests, bug reports and general enhancements**. That covers this app's feedback center and any other studio project. She turns each into a ready-to-run plan that the Engineering Manager (main session / engine) can delegate, with the same checkpoints and handoffs the studio uses now.

**New "Intake mode" in `.claude/agents/product-manager.md`** (alongside the existing spec mode):

1. **Read** the raw item (exported feedback request, owner chat message, or a QA/user bug note) and the project's own `CLAUDE.md`/`AGENTS.md`.
2. **Classify:** `feature` | `enhancement` | `bug`. Check for duplicates against the open intake items and the backlog, and link to the duplicate if there is one.
3. **Size and route:**
   - `quick-fix`: one small change, no spec. Goes to a new `quick-fix` pipeline (build → QA → review → owner/auto merge per repo policy).
   - `lite`: Ease 4–5. Writes the spec + UX, then the normal `lite-build` pipeline.
   - `full`: Ease 1–3. Writes the spec, then the Full track (architect + ui-ux-designer).
   - `needs-owner`: unclear, or it touches money, releases or IP. Stops and lists the questions.
4. **Write one intake file per item:** `docs/intake/<project>/<id>-<slug>.md`, with a fixed shape:
   - source + original text (verbatim), type, priority (P1 broken for users / P2 asked-for / P3 nice-to-have), size/route
   - for bugs: repro steps, expected vs actual, affected area (file paths if she can find them by reading), severity
   - for features/enhancements: problem, user story, acceptance criteria (Given/When/Then)
   - **Team** (only the roles needed, per the CLAUDE.md staffing table, including Creative Studio roles when assets are involved)
   - **Work order for the Engineering Manager:** milestones → tasks (≤ ~6), each with its role, inputs/outputs (file paths), the dependency order, which tasks run in parallel, the checkpoint at each milestone (`studio.js log` at ~25/50/75/100%, QA then review gate), and the owner gates
   - **Pipeline command** to start it, e.g. `node tools/engine/engine.js start lite-build --var slug=… --var idea=docs/intake/…`
   - open questions for the owner
5. **Queue file:** `docs/intake/<project>/queue.md`, a ranked table (id, type, priority, route, status: new / needs-owner / approved / in-build / done / rejected). The owner approves items there or in chat. Nothing is built without approval, except `quick-fix` bugs on internal repos, which follow the auto-merge policy.

**Engine support:** a new `intake` pipeline (Hana on a local model; an Opus check on the work order only for `full` items) that processes a batch, plus the `quick-fix` pipeline. `lite-build` accepts an intake file as its `idea` input, unchanged.

**Done when:** a batch of the app's real exported requests (including Read Along) turns into intake files + a queue, and starting one item's pipeline command runs without the manager re-planning it.

## Left to the builder

Exact file names, the intake script's mechanics, passage split per world, XP value, audio format/bitrate, sprite frame count, and how the local TTS backend plugs into `rebuild-aligned-audio.mjs`.
