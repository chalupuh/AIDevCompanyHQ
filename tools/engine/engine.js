#!/usr/bin/env node
// Shim: the workflow engine moved to the StudioControlRoom repo (ADR 0002).
// Kept at this path so docs and habits (`node tools/engine/engine.js …`) keep working.
// Software location: STUDIO_SOFT env, else a StudioControlRoom checkout next to this repo.
// Runs the real engine as a child process (its CLI only runs when it is the main module).
const path = require('path');
const { spawnSync } = require('child_process');
const root = process.env.STUDIO_SOFT || path.resolve(__dirname, '..', '..', '..', 'StudioControlRoom');
const r = spawnSync(process.execPath, [path.join(root, 'engine', 'engine.js'), ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
