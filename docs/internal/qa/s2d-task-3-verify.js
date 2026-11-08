#!/usr/bin/env node
// QA verification for Sprint 2d Task 3:
// 1. .claude/agents/internal-analyst.md exists with correct frontmatter
// 2. tools/engine/pipelines/internal-research.json synthesize stage uses internal-analyst
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
let pass = 0, fail = 0;

function check(name, ok, detail) {
  if (ok) { console.log(`  ✓ ${name}`); pass++; }
  else    { console.error(`  ✗ ${name}${detail ? ': ' + detail : ''}`); fail++; }
}

console.log('--- Agent file frontmatter ---');
const agentPath = path.join(root, '.claude/agents/internal-analyst.md');
const agentContent = fs.existsSync(agentPath) ? fs.readFileSync(agentPath, 'utf8') : null;
check('internal-analyst.md exists', !!agentContent);
if (agentContent) {
  const fmMatch = agentContent.match(/^---\n([\s\S]*?)\n---/m);
  const fm = fmMatch ? fmMatch[1] : '';
  check('name: internal-analyst', fm.includes('name: internal-analyst'),
    fm.includes('name:') ? `got: ${fm.match(/name: (.*)/)?.[1]}` : 'missing');
  check('description present', fm.includes('description:'));
  check('tools: Read, Write, Edit, Glob, Grep, Bash', fm.includes('tools: Read, Write, Edit, Glob, Grep, Bash'));
  check('model: sonnet', fm.includes('model: sonnet'));
  check('body mentions NOT app ideas/market scoring',
    agentContent.includes('NOT') && (agentContent.includes('app idea') || agentContent.includes('market')));
}

console.log('\n--- Pipeline wiring ---');
const pipePath = path.join(root, 'tools/engine/pipelines/internal-research.json');
let pipe;
try {
  pipe = JSON.parse(fs.readFileSync(pipePath, 'utf8'));
  check('internal-research.json is valid JSON', true);
} catch (e) {
  check('internal-research.json is valid JSON', false, e.message);
  console.log(`Result: ${pass} pass, ${fail} fail`);
  process.exit(1);
}

const synthesize = pipe.stages.find(s => s.id === 'synthesize');
check('synthesize stage exists', !!synthesize);
if (synthesize) {
  check('synthesize.agent === internal-analyst',
    synthesize.agent === 'internal-analyst',
    `got "${synthesize.agent}"`);
  check('synthesize.tier === sonnet',
    synthesize.tier === 'sonnet',
    `got "${synthesize.tier}"`);
}

console.log(`\nResult: ${pass} pass, ${fail} fail — ${fail === 0 ? 'OK' : 'FAILURES'}`);
process.exit(fail > 0 ? 1 : 0);
