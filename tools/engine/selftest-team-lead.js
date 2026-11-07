#!/usr/bin/env node
// Self-test for resolveTeamLead() — agent selection from design.md "Team:" line.
// Run: node tools/engine/selftest-team-lead.js

const fs = require('fs');
const path = require('path');
const { resolveTeamLead } = require('./engine');

const TEST_DIR = path.join(__dirname, '..', '.studio', 'selftest-team-lead');

const tests = [
  {
    name: 'frontend-dev listed first',
    content: '# Design\nTeam: frontend-dev, qa-engineer\n## Milestone 1\nstuff',
    expect: 'frontend-dev',
  },
  {
    name: 'mobile-dev only',
    content: '# Design\nTeam: mobile-dev, qa-engineer\n## Milestone 1\nstuff',
    expect: 'mobile-dev',
  },
  {
    name: 'backend-dev and mobile-dev present: priority picks mobile-dev',
    content: '# Design\nTeam: backend-dev, mobile-dev, qa\n## Milestone 1\nstuff',
    expect: 'mobile-dev',
  },
  {
    name: 'mobile-dev listed first but frontend-dev present: priority picks frontend-dev',
    content: '# Design\nTeam: mobile-dev, frontend-dev, qa\n## Milestone 1\nstuff',
    expect: 'frontend-dev',
  },
  {
    name: 'all three: picks frontend-dev (first in candidate order)',
    content: '# Design\nTeam: frontend-dev, mobile-dev, backend-dev, qa\n## Milestone 1\nstuff',
    expect: 'frontend-dev',
  },
  {
    name: 'Team line with other roles only (no build role) → default',
    content: '# Design\nTeam: qa-engineer, code-reviewer\n## Milestone 1\nstuff',
    expect: 'mobile-dev',
  },
  {
    name: 'no Team line at all → default',
    content: '# Design\nJust some text without a team line.\n## Milestone 1\nstuff',
    expect: 'mobile-dev',
  },
  {
    name: 'empty file → default',
    content: '',
    expect: 'mobile-dev',
  },
  {
    name: 'missing file → default',
    missing: true,
    expect: 'mobile-dev',
  },
  {
    name: 'team: lowercase spelling',
    content: '# Design\nteam: mobile-dev, qa\n## Milestone 1\nstuff',
    expect: 'mobile-dev',
  },
];

// Setup
fs.mkdirSync(TEST_DIR, { recursive: true });
let passed = 0, failed = 0;

for (const t of tests) {
  const fp = path.join(TEST_DIR, 'design.md');
  if (t.missing) {
    try { fs.unlinkSync(fp); } catch {}
  } else {
    fs.writeFileSync(fp, t.content);
  }
  const got = resolveTeamLead(path.join(TEST_DIR, 'design.md'));
  const ok = got === t.expect;
  if (ok) { passed++; console.log(`  ✓ ${t.name}`); }
  else { failed++; console.log(`  ✗ ${t.name}: expected "${t.expect}", got "${got}"`); }
}

// Cleanup
try { fs.rmSync(TEST_DIR, { recursive: true }); } catch {}

console.log(`\n${passed}/${tests.length} passed${failed ? ` (${failed} failed)` : ''}`);
process.exit(failed > 0 ? 1 : 0);
