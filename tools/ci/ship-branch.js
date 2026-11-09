#!/usr/bin/env node
// Ship a finished sprint lane: commit the worktree's changes on its current branch, push, open a PR,
// then auto-merge it through tools/ci/merge-pr.js (which enforces the policy guards).
//
//   node tools/ci/ship-branch.js <workdir> <owner/repo> "<title>" <review-file>
//
// Refuses if: the workdir is on main, there is nothing to commit, or the review file doesn't end with APPROVE.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const GH = process.platform === 'win32' ? 'C:\\Program Files\\GitHub CLI\\gh.exe' : 'gh';
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const fail = (m) => { console.error('SHIP REFUSED: ' + m); process.exit(2); };

const [workdir, repo, title, reviewFile] = process.argv.slice(2);
if (!workdir || !repo || !title || !reviewFile) fail('usage: ship-branch.js <workdir> <owner/repo> "<title>" <review-file>');
const review = fs.existsSync(reviewFile) ? fs.readFileSync(reviewFile, 'utf8').trim() : '';
if (!/APPROVE\s*$/.test(review)) fail(`review ${reviewFile} does not end with APPROVE`);

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], workdir);
if (branch === 'main') fail('workdir is on main');
run('git', ['add', '-A'], workdir);
const staged = run('git', ['diff', '--cached', '--name-only'], workdir);
const ahead = run('git', ['rev-list', '--count', 'origin/main..HEAD'], workdir);
if (!staged && ahead === '0') fail('nothing to ship');
// Never ship personal emails or obvious secrets.
const diff = staged ? run('git', ['diff', '--cached'], workdir) : '';
if (/newhart|@gmail\.com|sk-ant-|ghp_[A-Za-z0-9]{20}|BEGIN [A-Z ]*PRIVATE KEY/.test(diff)) fail('diff contains an email or secret-like string');
if (/\{\{\w+\}\}/.test(title)) fail(`title has an unfilled variable: ${title}`);
if (staged) run('git', ['commit', '-q', '-m', `${title}\n\nShipped by the studio engine after QA and Opus review APPROVE.\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`], workdir);
// Lanes run in parallel, so main often moved on while this one was in review. Bring main in first: a conflicted
// PR gets no CI and merge-pr.js refuses it. A real conflict stops here for a human to resolve.
run('git', ['fetch', '-q', 'origin', 'main'], workdir);
try { run('git', ['merge', '--no-edit', '-q', 'origin/main'], workdir); }
catch {
  let files = ''; try { files = run('git', ['diff', '--name-only', '--diff-filter=U'], workdir); } catch {}
  try { run('git', ['merge', '--abort'], workdir); } catch {}
  fail(`branch ${branch} conflicts with main in: ${files.split('\n').join(', ') || '(unknown)'}. Merge origin/main by hand, re-run the tests, then resume.`);
}
run('git', ['push', '-q', '-u', 'origin', branch], workdir);

let url;
try { url = run(GH, ['pr', 'view', branch, '--repo', repo, '--json', 'url', '-q', '.url'], workdir); } catch {}
if (!url) {
  const body = `${title}\n\nBuilt by the studio engine (local model), QA'd per task, reviewed by Opus (APPROVE).\n\n## Review\n\n${review.slice(-3000)}\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`;
  url = run(GH, ['pr', 'create', '--repo', repo, '--base', 'main', '--head', branch, '--title', title, '--body', body], workdir).split('\n').pop();
}
const num = url.split('/').pop();
console.log('PR ' + url);
execFileSync(process.execPath, [path.join(__dirname, 'merge-pr.js'), repo, num, '--wait'], { stdio: 'inherit' });
