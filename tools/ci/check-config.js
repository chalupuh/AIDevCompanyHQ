#!/usr/bin/env node
// HQ config checks (CI): every pipeline and data file parses, pipeline agents exist, shims are valid JS.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..', '..');
let fail = 0;
const bad = (m) => { console.error('✗ ' + m); fail++; };
const agents = new Set(fs.readdirSync(path.join(root, '.claude/agents')).map((f) => f.replace(/\.md$/, '')));
const pdir = path.join(root, 'tools/engine/pipelines');
for (const f of fs.readdirSync(pdir).filter((f) => f.endsWith('.json'))) {
  let p; try { p = JSON.parse(fs.readFileSync(path.join(pdir, f), 'utf8')); } catch (e) { bad(`${f}: invalid JSON (${e.message})`); continue; }
  const walk = (stages) => (stages || []).forEach((s) => {
    if (s.type === 'agent' && !/^__\w+__$|\{\{/.test(String(s.agent)) && !agents.has(s.agent)) bad(`${f}: stage ${s.id} uses unknown agent "${s.agent}"`);
    if (s.type === 'foreach') walk(s.stages);
  });
  walk(p.stages);
  console.log(`✓ pipeline ${f}`);
}
for (const f of ['.studio/roster.json', '.studio/models.json', '.studio/budget.json']) {
  try { JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); console.log(`✓ ${f}`); } catch (e) { bad(`${f}: ${e.message}`); }
}
for (const f of ['.studio/studio.js', 'tools/engine/engine.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, f)]); console.log(`✓ shim ${f}`); } catch { bad(`${f}: syntax error`); }
}
if (fail) { console.error(`\n${fail} problem(s)`); process.exit(1); }
console.log('\nAll HQ config checks passed.');
