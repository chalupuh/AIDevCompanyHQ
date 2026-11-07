# QA Report — Task 3: Control Room "Village" Tab

**Date:** 2026-11-06
**Scope:** Web (React/TypeScript/Vite) — matches design.md Team block.
**Build status:** ✅ `tsc --noEmit` clean, `vite build` succeeded (47 modules, 348ms).

---

## Verdict: **PASS**

---

## Acceptance Criterion Matrix

| # | Criterion (from sprint-log) | Verdict | Evidence |
|---|----------------------------|---------|----------|
| A1 | App.tsx: third tab "Village" registered, renders `VillageView` | ✅ PASS | `App.tsx` line 11: import; line 33: tab button; line 46: conditional render. State type `'org' \| 'village' \| 'ops'`. |
| A2 | `model.ts`: layout (HQ + Eng/R&D/Creative buildings, paths), home positions, walk directions, `truncate` | ✅ PASS | 4 `Building` objects (HQ, ENG_BLDG, RD_BLDG, CRE_BLDG). `homePos()` places owner/manager at HQ, others at dept building. `walkDir()` maps `done→to-hq`, `start→to-home`, null otherwise. `truncate()` with ellipsis. |
| A3 | `VillageView.tsx`: SVG grass map | ✅ PASS | `<svg viewBox="0 0 800 600">` with radial gradient background, fallback grass dots, asset-backed tile pattern. |
| A4 | Flat placeholder buildings (with art fallback) | ✅ PASS | `BuildingArt` renders shadow rect + main rect + door + windows + label. Switches to `<image>` when `/village/buildings/{id}.png` loads. |
| A5 | Circular portrait tokens with initials fallback | ✅ PASS | `CharacterToken`: `<image>` clipped via `<clipPath>` when `c.portrait` exists; else colored circle + `initials(name)`. |
| A6 | Speech bubble with truncated task for working agents | ✅ PASS | Lines 87–92: renders `<g className="v-bubble">` with `truncate(task, 20)` when `isWorking && task`. |
| A7 | rAF-driven walking animation | ✅ PASS | Lines 156–167: single `requestAnimationFrame` loop, restarts on new walk (`kick` state), stops when all walks done. Frame counter triggers re-render. |
| A8 | Profile drawer reusing org drawer styles/components | ✅ PASS | Line 220: `<Drawer id={drawerId} ... />` from `../org/Drawer`. Drawer uses `Portrait`, `Ring`, `StatusPill`, `ModelChips` from `AgentCard.tsx`. |
| B1 | One rAF loop (see A7) | ✅ PASS | Single `useEffect` with `kick` dependency; cancelAnimationFrame in cleanup. |
| B2 | Position map never pruned; finished walk parks agent | ✅ PASS | `positions` ref persists across renders. `posAt()` returns `p.to` when `!isWalking()`. |
| B3 | Every event processed once (Set of keys); bounded cleanup | ✅ PASS | `seen` Set stores event keys (`ts|agent|type`). Prunes when `done.size > events.length * 2 + 50`. History load (first init) parks agents without animation. |
| B4 | Reduced motion: reactive matchMedia, walks get duration 0 | ✅ PASS | `useReducedMotion()` hook with `addEventListener('change')`. `reducedRef` kept current. `startWalk()` sets `duration: 0` when reduced. CSS `@media (prefers-reduced-motion)` disables bubble animation and hover opacity change. |
| B5 | `useAsset` probes village art URLs, draws flat placeholders otherwise | ✅ PASS | `useAsset` for `/village/buildings/{hq,eng,rd,creative}.png` and `/village/tiles/grass.png`. All fallback to flat shapes. |
| B6 | Static route `GET /village/*` in studio.js with safeJoin | ✅ PASS | `studio.js` lines 411–415: route with extension whitelist (`png/jpe?g/webp/svg`) and `safeJoin`. Vite proxy configured at `vite.config.ts` line 6. |
| B7 | CSS isolation (v- prefix) | ✅ PASS | `village.css`: all selectors use `.v-` prefix — `.v-root`, `.v-map`, `.v-char`, `.v-bubble`, `.v-legend`, `.v-legend-item`. No leakage. |
| B8 | Accessibility: keyboard navigation, ARIA labels | ✅ PASS | Character tokens: `role="button"`, `tabIndex={0}`, `aria-label`, `onKeyDown` (Enter/Space). SVG map: `role="img"`, `aria-label="Studio Village Map"`. Legend: `aria-label="Village legend"`. CSS: `:focus-visible` outline on tokens. |
| B9 | Responsive layout | ✅ PASS | CSS `@media (max-width: 720px)`: map max-height reduced, legend gap/size adjusted. |

---

## Edge Case Analysis

| Edge Case | Result | Details |
|-----------|--------|---------|
| Empty roster (`state?.roster` undefined) | ✅ Safe | `buildOrg(undefined)` returns default depts. `allAgentIds` returns `['owner', 'manager']` + defaults. Agents show as initials with default color. |
| Missing character portrait | ✅ Safe | `charOf(roster, id)` returns `undefined`; token falls back to initials + colored circle. |
| No village art files on disk | ✅ Safe | `.studio/village/` doesn't exist yet. `useAsset` probes fail gracefully, all flat placeholders render. Studio.js returns 404 for missing files (harmless). |
| Owner receives 'done'/'start' event | ✅ Safe | `walkDir()` returns `null` for `owner` — no walking animation triggered. |
| Agent not in any department | ✅ Safe | `homePos()` returns `{x:400, y:300}` default. `routeFor()` produces empty path → direct walk to HQ slot/home. |
| Manager in department | ✅ Safe | `routeFor()` uses `id !== 'manager'` guard to skip department path for manager → walks directly via HQ door. |
| Double event (same ts + agent + type) | ✅ Safe | `seen` Set prevents reprocessing. |
| Server event window shrinks | ✅ Safe | Bounded cleanup prunes stale keys when `done.size > events.length * 2 + 50`. |
| Reduced motion preference changes at runtime | ✅ Safe | `matchMedia('change')` listener updates `reduced` state. New walks get `duration: 0`. CSS media query handles bubble animation. |
| Unmounted component still animating | ✅ Safe | `cancelAnimationFrame(raf)` in useEffect cleanup. `useAsset` cleanup sets `live = false`. |
| Concurrent event processing during render | ✅ Safe | `reducedRef` keeps reactive value current in the event effect; `positions` ref persists across renders; `setFrame` queues React re-render. |

---

## Security

| Check | Result |
|-------|--------|
| Path traversal in village static route | ✅ `safeJoin` enforces path stays within `.studio/village/` |
| File extension whitelist | ✅ Only `png/jpe?g/webp/svg` served |
| SVG clipPath IDs unique | ✅ Template literal `v-clip-${id}` uses agent id |

---

## Minor Non-Blocking Notes (not bugs, just observability)

1. **`initialised` is misspelled** — `initialised` vs `initialized`. Cosmetic only (British English spelling is valid).
2. **No error boundary** — VillageView doesn't wrap in React ErrorBoundary. If the component crashes, the whole app shell breaks. This is a pre-existing pattern (OrgView and OpsPanel also lack it), not a regression.
3. **No loading fallback for Drawer content** — Drawer renders with whatever `state.roster.agents[id]` returns; if the character is unknown, it shows the id as the name. Acceptable given it's only opened after clicking an existing token.

---

## Regression Guards

| Area | Status |
|------|--------|
| App.tsx tab switching (Org/Operations still work) | ✅ Unchanged code paths, build passes |
| Org module exports (buildOrg, TEAM_VAR, etc.) | ✅ Village imports all exist and are exported |
| Drawer component (Portrait, Ring, StatusPill, ModelChips) | ✅ Reused, no changes to AgentCard.tsx |
| API types (StudioEvent, Character, Roster) | ✅ VillageView types match api.ts interface |
| Store (useStudio, deriveLive) | ✅ Unchanged, VillageView receives `studio` as prop |

---

## Summary

**Everything passes.** The Village tab is a well-constructed feature with:
- Clean separation (model.ts = pure logic, VillageView.tsx = UI, village.css = isolated styles)
- Proper accessibility (ARIA roles, keyboard nav, focus management)
- Robust animation system (deduplicated events, bounded memory, rAF cleanup)
- Defensive defaults (portrait fallback, asset fallback, missing roster)
- Responsive design and reduced-motion compliance
- Secure static asset serving with path validation
