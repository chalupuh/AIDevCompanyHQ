# ADR 0002: Repositories and git workflow

**Status:** Accepted · **Date:** 2026-11-07 · **Owner:** studio owner (GitHub: `chalupuh`)

## Context
The owner wants standard GitHub practices: one repo per development project, plus a separate repo for the studio's own software (Control Room, engine, org tooling). Existing repos (`LanguageLearningApp`, `WorkoutBuddy`) use PascalCase names, TypeScript and a `main` default branch.

## Decision: repos

| Repo | Contains | Visibility |
|---|---|---|
| **`AIDevCompanyHQ`** (this folder) | The org itself: `.claude/agents`, `CLAUDE.md`, pipelines config, `docs/` (research, specs, ADRs, plans, creative reviews), roster and portraits. Runtime state is git-ignored. | **Public** |
| **`StudioControlRoom`** | The studio software: Control Room app (`.studio/app`), server (`studio.js`), workflow engine, benchmark harness, creative tooling. Configurable to point at an HQ workspace (`STUDIO_HOME`). | **Public** |
| **`<AppName>`**, one per external project | One app per repo, created by `devops-engineer` at project start from the standard template below. | **Public** |

Names are PascalCase, matching the owner's convention. App repos use the app's working name (e.g. `FamilyChoreBoard`).

**Owner rule (updated 2026-11-07): repos are PUBLIC** so that GitHub Free branch protection works (the owner first chose private, then switched after hitting the plan limit). Before anything becomes public: commits must use the GitHub noreply email (`<id>+chalupuh@users.noreply.github.com`), never a personal address; scan for secrets and personal data; and never commit keys, .env files or private research raw data. If a specific project must stay private, the owner says so per project.

## Decision: git workflow (every repo)

- **`main` is always releasable and protected.** No direct pushes. Changes land only through pull requests that pass CI.
- **One branch per task:** `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`. Each engine task or backlog line is one branch and one PR.
- **Conventional Commits:** `feat: …`, `fix: …`, `chore: …`, `docs: …`, `test: …`, `refactor: …`, with `BREAKING CHANGE:` when relevant. Agent commits carry a `Co-Authored-By` trailer naming the model.
- **Every PR** uses the template: what/why, how it was tested, screenshots for UI changes, a link to its backlog item or issue, and a checklist.
  - **Required checks:** CI (install → lint → typecheck → test → build).
  - **Review:** `code-reviewer`'s verdict is posted as the PR review (Opus at milestone or sprint level, per ADR 0001).
  - **Merge:** squash merge, and the branch is deleted after merging.
- **The owner merges** user-facing or release PRs (the engine's owner gate equals "merge the PR"). Small internal fixes that are green and reviewer-approved may be merged by the engine *only if* the owner enables auto-merge for that repo.
- **Issues are the backlog.** Each `docs/internal/*-backlog.md` line maps to a GitHub issue (label = department; e.g. `eng`, `creative`, `rd`). PRs close issues with `Closes #n`.
- **Releases:** SemVer tags (`v0.3.0`), GitHub Releases with notes generated from Conventional Commits, and a `CHANGELOG.md`.
- **No secrets in git.** Each repo has a `.env.example`, with real values in GitHub Actions secrets or local env only.
- **Hygiene files in every repo:** `README.md`, `.gitignore`, `.github/pull_request_template.md`, `.github/workflows/ci.yml`, `CODEOWNERS` (`* @chalupuh`), `CONTRIBUTING.md` (this workflow, short), and `LICENSE` (proprietary / "All rights reserved" while private).

## Plan limitation (found 2026-11-07, resolved by going public)
On GitHub **Free**, private repos cannot have branch protection or rulesets (the API returns 403: "Upgrade to GitHub Pro or make this repository public"). Making repos public is ruled out, so until the owner decides on GitHub Pro (≈ $4/month):
- Each clone gets a **local `pre-push` hook** that blocks pushes to `main` (bypass only for an owner-approved emergency: `ALLOW_MAIN_PUSH=1`).
- The engine and agents never push to `main`. They push `feat/*` branches and open PRs, and **only the owner merges**.
- With Pro, enable real protection: PR required, CI required, no force-push, no deletion.

## Agents' responsibilities
- **devops-engineer:** creates app repos from the template, sets up branch protection and CI, and cuts releases.
- **Builder agents** (frontend/backend/mobile): work only on their task branch, commit with Conventional Commits, and never push to `main`.
- **Engine:** per task it creates a branch, has the agent build, commits, pushes and opens a PR (`gh pr create`). QA runs, the reviewer posts a review, and the owner gate merges.
- **Never** force-push to `main`, rewrite published history, or change branch protection without the owner.

## Consequences
- The studio software and the org config version separately. The HQ repo pins a known-good StudioControlRoom version.
- Splitting the software out of this folder means paths in `studio.js` and `engine.js` must come from config (`STUDIO_HOME`). This is done as the first PR in `StudioControlRoom`, **after** the current internal sprint finishes, so no files move under a running pipeline.
