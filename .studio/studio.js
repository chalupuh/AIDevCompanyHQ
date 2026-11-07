#!/usr/bin/env node
// Shim: the Control Room server, hooks and CLI moved to the StudioControlRoom repo (ADR 0002).
// Kept at this path so hooks, agent instructions and docs keep working.
// Software location: STUDIO_SOFT env, else a StudioControlRoom checkout next to this repo.
const path = require('path');
const root = process.env.STUDIO_SOFT || path.resolve(__dirname, '..','..', 'StudioControlRoom');
require(path.join(root, 'studio/studio.js'));
