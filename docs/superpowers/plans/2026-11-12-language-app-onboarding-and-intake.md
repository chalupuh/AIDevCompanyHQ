# Language App Onboarding + Hana Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the À l'Oreille repo a studio project the engine can build on, and give Hana (product-manager) an intake mode that turns feature requests, bugs and enhancements into ranked, runnable work orders.

**Architecture:** No project registry exists. A project is a checkout plus pipelines run with `--var workdir=<checkout>`. A new `app-build` pipeline (a copy of `lite-build` whose specs live in the app repo) and new `intake` and `quick-fix` pipelines go in HQ `tools/engine/pipelines/`. Small helper scripts (feedback import, intake-file checker) go in StudioControlRoom `tools/intake/`, tested with `node --test`. Hana's intake mode is a new section of `.claude/agents/product-manager.md` plus a template.

**Tech Stack:** Node ≥ 22 (CommonJS, `node:test`), engine JSON pipelines, Claude/Codex agent files, `gh`.

**Spec:** `docs/superpowers/specs/2026-11-12-language-app-integration-design.md` (Milestones 1 and 1b). The voice bake-off (Milestone 2) and Read Along (Milestone 3) are **not** in this plan. Their work orders come out of Task 6 via Hana, as the spec says.

## Global Constraints

- The app stays on chatgptsites. Nothing in this plan publishes, deploys or uploads to the hosted site.
- App repo PRs are merged only by the owner. `tools/ci/merge-pr.js` already refuses any repo outside `INTERNAL_REPOS` (`chalupuh/AIDevCompanyHQ`, `chalupuh/StudioControlRoom`). Do not add the app repo to that set. App PRs also get the label `owner-review`.
- App repo rules come from its `AGENTS.md`: before commit run `npm run typecheck`, `npm test`, `npm run lint:baseline`. Never force-push. Keep `.openai/hosting.json` tracked. Never commit `.env*`, `.wrangler/`, `.sites-runtime/` or build output.
- `app/page.tsx` edits are small exact-substring edits only.
- Studio-side changes: HQ and StudioControlRoom each get a branch, a PR, green CI, and a merge via `merge-pr.js` (internal).
- No agent holds a production token. Intake input is a manual export pasted or saved by the owner.
- Every engine-built item stops at an owner gate before anything merges in the app repo.
- After editing any `.claude/agents/*.md`, regenerate the Codex agents: `node ../StudioControlRoom/tools/sync-codex-agents.js --write`.

## Review Focus

1. **A feedback export with odd text** (French accents, quotes, emoji, multi-line, the `[fr · open path · #practice/...]` prefix) must import losslessly: the original text is kept verbatim and the prefix is parsed into language and route. Test in Task 4.
2. **Re-importing the same export** must not create duplicate intake items. The import is keyed by a stable id. Test in Task 4.
3. **An intake file missing its work order or Team line** must fail the checker, so the `intake` stage fails instead of handing the manager a half plan. Test in Task 3.
4. **An `app-build` run started without `workdir`** must fail at start, not write specs into HQ. Check in Task 2.
5. **Hana putting a request that names real game IP** (Elden Ring etc.) on a build route must be caught: those items get route `needs-owner` or an IP note. Assert in the Task 3 checker (a `games-ip` flag must carry an "IP:" line).

---

### Task 1: Clone the app and add the studio rules to its AGENTS.md

**Files (app repo `../LanguageLearningApp`):**
- Modify: `AGENTS.md` (append a "Studio agents" section)

- [ ] **Step 1:** `git clone https://github.com/chalupuh/LanguageLearningApp ../LanguageLearningApp`, then `npm ci` in it. Expected: `npm run typecheck` and `npm test` pass on `main`. If they fail on `main`, stop and report to the owner, because the baseline must be green.
- [ ] **Step 2:** Branch `studio/onboarding`. Append to `AGENTS.md`:
  ```
  ## Studio agents (AIDevCompanyHQ engine)
  - Work only on branches named `studio/<task>`; never commit to `main`.
  - Open a PR labelled `owner-review`; the owner merges and publishes to Sites. The studio never deploys.
  - Specs and intake work orders live in `docs/specs/` and `docs/intake/`.
  - Progress: `node "<HQ>/.studio/studio.js" log <agent> <pct> "<msg>"` when the HQ checkout is present.
  ```
- [ ] **Step 3:** Create the `owner-review` label on the repo if it's missing (`gh label create owner-review --repo chalupuh/LanguageLearningApp --color B60205 || true`).
- [ ] **Step 4:** Commit, push, open the PR with label `owner-review`. **Owner merges.** Do not wait on it for Tasks 2–6.

### Task 2: `app-build` pipeline (lite-build for external app repos)

**Files (HQ):**
- Create: `tools/engine/pipelines/app-build.json`

**Interfaces:**
- Produces: `node tools/engine/engine.js start app-build --var workdir=../LanguageLearningApp --var slug=<slug> --var idea=<path-to-intake-file>`

- [ ] **Step 1:** Copy `lite-build.json` to `app-build.json`. Changes:
  - `required`: `["slug", "idea", "workdir"]`
  - spec/design paths: `{{workdir}}/docs/specs/{{slug}}.md` and `.design.md` instead of `{{home}}/docs/specs/…`
  - the first stage is a `script` stage, `branch`, run `git fetch origin && git switch -c studio/{{slug}} origin/main` (in workdir), so the AGENTS.md pull rule holds
  - the build/qa `check` uses `npm run typecheck && npm test && npm run lint:baseline`
  - the final stage before `ship-gate`: a `script` stage `pr` that pushes and runs `gh pr create --label owner-review --fill`. **No merge stage.** `ship-gate` text: "Owner: review and merge the PR, then publish via Sites."
  - `description` states the above.
- [ ] **Step 2:** Verify: `node tools/engine/engine.js pipelines` lists `app-build` without errors. `node tools/engine/engine.js start app-build --var slug=x --var idea=y` (no workdir) exits with a missing-var error. Expected: a non-zero exit, and no files created in HQ `docs/specs/`.
- [ ] **Step 3: Smoke.** Write `../LanguageLearningApp/docs/intake/a-loreille/smoke-copy-fix.md` (a one-line copy tweak the owner would accept, e.g. a typo, or a README line if none is found). Run `app-build` with it **in the background**. Expected: a PR on the app repo with label `owner-review`, the checks passed locally, and the run waiting at `ship-gate`. Relay the gate to the owner; never approve it on their behalf.
- [ ] **Step 4:** Commit on an HQ branch, PR, merge via `merge-pr.js`.

### Task 3: Hana intake mode, template and checker

**Files:**
- Modify (HQ): `.claude/agents/product-manager.md` (add a `## Intake mode` section)
- Create (HQ): `docs/intake/TEMPLATE.md`
- Create (SCR): `tools/intake/check-intake.js`, `tools/intake/check-intake.test.js`

**Interfaces:**
- Produces: `checkIntake(markdown: string) -> { ok: boolean, problems: string[], meta: { id, type, priority, route, project } }`. CLI: `node tools/intake/check-intake.js <file...>` exits 0 if all are OK, else 1 and prints the problems.

- [ ] **Step 1: Template** `docs/intake/TEMPLATE.md`, a front-matter block plus fixed headings:
  ```
  ---
  id: <project>-<source-id or yyyymmdd-n>
  project: a-loreille
  type: feature | enhancement | bug
  priority: P1 | P2 | P3
  route: quick-fix | lite | full | needs-owner
  status: new
  flags: []            # e.g. [games-ip, assets, money, release]
  duplicate-of: none
  ---
  ## Original request      (verbatim, with source + date + submitter role, not their email)
  ## Problem
  ## Acceptance criteria   (Given/When/Then; for bugs: Repro / Expected / Actual / Severity)
  ## Team                  (one line: Team: role, role, …)
  ## Work order            (### Milestone N: … → tasks with role, inputs, outputs, depends-on, parallel-with;
                           checkpoint line per milestone: log 25/50/75/100, QA → review gate; owner gates)
  ## Start command
  ## Open questions for the owner
  ```
- [ ] **Step 2: Failing tests** in `check-intake.test.js`:
  - `valid file passes`: a fixture with all headings → `ok === true`, `meta.route === 'lite'`
  - `missing work order fails`: delete the `## Work order` section → `ok === false`, problems include `"missing section: Work order"`
  - `missing Team line fails`: problems include `"Team: line required"`
  - `bad enum fails`: `route: medium` → problems include `"route must be one of quick-fix, lite, full, needs-owner"`
  - `games-ip needs IP note`: `flags: [games-ip]` without an `IP:` line in Open questions or Problem → problems include `"games-ip flag requires an IP: note"`
  - `bug needs repro`: `type: bug` without `Repro` → problems include `"bug requires Repro/Expected/Actual"`
  - `non-quick-fix needs start command`: `route: lite` and an empty `## Start command` → it fails
  - `email is rejected`: any `@…\.` email address in the body → `"remove submitter email"`
- [ ] **Step 3:** Run `node --test tools/intake/` in SCR. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement `check-intake.js`: a front-matter parse by regex, no dependencies.
- [ ] **Step 5:** Run the tests. Expected: PASS.
- [ ] **Step 6: Agent prompt.** Add `## Intake mode` to `product-manager.md`, covering the spec's Part 1b steps 1–5: classify, dedupe against `docs/intake/<project>/queue.md`, size/route (Ease 4–5 → lite, 1–3 → full, one small change → quick-fix, unclear/money/release/real-IP → needs-owner), write one file per item from `TEMPLATE.md`, update `queue.md` (columns: id | type | priority | route | status | title), never include submitter emails, and finish by running `node "<soft>/tools/intake/check-intake.js" <files>` and fixing until it passes. The Team line follows the CLAUDE.md staffing table, including Creative Studio roles when assets are involved.
- [ ] **Step 7:** Regenerate the Codex agents (`sync-codex-agents.js --write`). Commit the SCR and HQ changes on branches, PR, merge via `merge-pr.js`.

### Task 4: Feedback export importer

**Files (SCR):** Create `tools/intake/import-feedback.js`, `tools/intake/import-feedback.test.js`, fixture `tools/intake/fixtures/feedback-export.txt` (built from the screenshot's format, with the email replaced by `user@example.com`).

**Interfaces:**
- Produces: `parseFeedback(text: string) -> Array<{ sourceId: string, status: string, language: 'fr'|'sv'|'es'|null, route: string|null, text: string }>`. CLI: `node tools/intake/import-feedback.js <export.txt> --project a-loreille --out <workdir>/docs/intake/a-loreille/raw/` writes one `raw/<sourceId>.md` per item and skips ids that already exist (prints `skipped N existing`).
- Input format: text copied from `/feedback`. Each item starts with a line `<Status> · <Language>`, then the submitter line, then the body. The body may start with `[fr · open path · #practice/…]`. If the page offers a JSON/CSV export, support that too (the builder decides after looking at `/api/requests` in the app source).

- [ ] **Step 1: Failing tests:**
  - `parses the screenshot item`: status `Submitted`, language `fr`, route `#practice/avance-retour-achat`, text starting `I would like a complete new section called "Read Along"` and keeping the accents and quotes exactly.
  - `drops the submitter email`: no output field or written file contains `@`.
  - `stable id`: parsing the same export twice gives the same `sourceId`s (hash of status-independent text + language).
  - `re-import skips existing`: the second CLI run into the same out dir writes 0 files.
  - `multi-line + emoji body` is preserved.
- [ ] **Step 2:** Run. Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit, PR, merge via `merge-pr.js`.

### Task 5: `intake` and `quick-fix` pipelines

**Files (HQ):** Create `tools/engine/pipelines/intake.json`, `tools/engine/pipelines/quick-fix.json`.

**Interfaces:**
- `intake`: required `workdir`, `project`, `export`. Stages:
  1. script `import`: `node "{{soft}}/tools/intake/import-feedback.js" "{{export}}" --project {{project}} --out "{{workdir}}/docs/intake/{{project}}/raw/"`
  2. agent `triage` (product-manager, tier `local`, Intake mode): process every file in `raw/` that has no intake file yet. Expect `queue.md`. Check `node "{{soft}}/tools/intake/check-intake.js" {{workdir}}/docs/intake/{{project}}/*.md` (exclude `queue.md`, `raw/`).
  3. agent `plan-check` (architect, tier `opus`): only for items with `route: full`, review the work order for task order and parallel conflicts, and edit it in place.
  4. gate `approve-queue`: "Owner: mark items approved/rejected in queue.md (or reply in chat)." Show `queue.md`.
- `quick-fix`: required `workdir`, `slug`, `idea`. Stages: branch → build (agent from the Team line, tier `local`, using the same rule as lite-build) → qa (local) → review (opus + codex, as for milestone gates) → pr (label `owner-review` for external repos; for internal repos, run `merge-pr.js` per policy) → owner gate for external repos only.
- [ ] **Step 1:** Write both files, modelled on `app-build.json`.
- [ ] **Step 2:** Verify: `engine.js pipelines` lists `intake`, `quick-fix`, `app-build`. Run `intake` against the Task 4 fixture with `workdir` = a temp copy of the app repo. Expected: intake files pass the checker, `queue.md` exists, and the run stops at `approve-queue`.
- [ ] **Step 3:** Add the pipelines to the CLAUDE.md engine command list (one line each), plus a short "Intake" paragraph: *"Feature requests/bugs: export from the app's /feedback, then `engine.js start intake --var workdir=… --var project=… --var export=…`; approved items run with the Start command in their intake file."*
- [ ] **Step 4:** Commit, PR, merge via `merge-pr.js`.

### Task 6: Live run on the real requests (owner input)

- [ ] **Step 1:** Ask the owner to copy all requests from `/feedback` into `../LanguageLearningApp/docs/intake/a-loreille/export-2026-11.txt`. The file is **gitignored**, because it holds emails. Add `docs/intake/*/export-*.txt` to the app's `.gitignore` in the Task 1 PR or a follow-up.
- [ ] **Step 2:** Start `intake` in the background with that export. Expected: the Read Along request becomes a `lite` or `full` intake item with Team `frontend-dev, copy-voice, image-artist, creative-director, qa-engineer, code-reviewer`, an IP note (original worlds only), and a work order whose first milestone is the voice bake-off (2–3 voices per world, the wife judges).
- [ ] **Step 3:** Relay `approve-queue` to the owner with the ranked table. Never approve it for them.
- [ ] **Step 4:** Log `node .studio/studio.js log manager 100 "a-loreille onboarded; intake queue ready" done`.

---

**Done when:** the smoke PR sits at the owner gate (Task 2), all intake tests pass (Tasks 3–4), the three pipelines are listed, and the real queue is waiting for the owner's approval with a runnable Read Along work order.
