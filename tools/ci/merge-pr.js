#!/usr/bin/env node
// Auto-merge policy (owner decision 2026-11-07, ADR 0002): Claude/the engine may merge INTERNAL PRs
// without asking when every guard below passes. Anything else is refused and goes to the owner.
//
//   node tools/ci/merge-pr.js <owner/repo> <pr-number> [--wait]
//
// Guards: repo is one of the studio's internal repos · PR is open, not draft, targets main ·
// every CI check passed (with --wait, waits up to 15 min for pending checks) · no "owner-review"
// or "release" label. Then: squash merge, delete the branch, print MERGED.
const { execFileSync } = require('child_process');

const INTERNAL_REPOS = new Set(['chalupuh/AIDevCompanyHQ', 'chalupuh/StudioControlRoom']);
const GH = process.platform === 'win32' ? 'C:\\Program Files\\GitHub CLI\\gh.exe' : 'gh';
const gh = (...a) => execFileSync(GH, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const refuse = (why) => { console.error(`REFUSED: ${why}. Ask the owner.`); process.exit(2); };

(async () => {
  const [repo, num, ...flags] = process.argv.slice(2);
  if (!repo || !/^\d+$/.test(num || '')) refuse('usage: merge-pr.js <owner/repo> <pr-number> [--wait]');
  if (!INTERNAL_REPOS.has(repo)) refuse(`${repo} is not an internal studio repo (app repos and releases need the owner)`);

  const pr = JSON.parse(gh('pr', 'view', num, '--repo', repo, '--json', 'state,isDraft,baseRefName,labels,title,headRefName'));
  if (pr.state !== 'OPEN') refuse(`PR #${num} is ${pr.state}`);
  if (pr.isDraft) refuse(`PR #${num} is a draft`);
  if (pr.baseRefName !== 'main') refuse(`PR #${num} targets ${pr.baseRefName}, not main`);
  const labels = pr.labels.map((l) => l.name.toLowerCase());
  if (labels.some((l) => ['owner-review', 'release', 'do-not-merge'].includes(l))) refuse(`PR #${num} is labelled ${labels.join(', ')}`);

  const deadline = Date.now() + (flags.includes('--wait') ? 15 * 60e3 : 0);
  for (;;) {
    let checks = [];
    try { checks = JSON.parse(gh('pr', 'checks', num, '--repo', repo, '--json', 'name,bucket')); } catch (e) { checks = JSON.parse((e.stdout || '[]').toString() || '[]'); }
    if (!checks.length) refuse(`PR #${num} has no CI checks`);
    const failed = checks.filter((c) => ['fail', 'cancel'].includes(c.bucket));
    if (failed.length) refuse(`CI failed: ${failed.map((c) => c.name).join(', ')}`);
    const pending = checks.filter((c) => c.bucket === 'pending');
    if (!pending.length) break;
    if (Date.now() > deadline) refuse(`CI still running: ${pending.map((c) => c.name).join(', ')} (use --wait)`);
    await sleep(15000);
  }

  gh('pr', 'merge', num, '--repo', repo, '--squash', '--delete-branch');
  const state = gh('pr', 'view', num, '--repo', repo, '--json', 'state', '-q', '.state');
  if (state !== 'MERGED') refuse(`merge did not complete (state ${state})`);
  console.log(`MERGED ${repo}#${num}: ${pr.title}`);
})().catch((e) => refuse(e.message.split('\n')[0]));
