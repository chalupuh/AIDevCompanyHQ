# QA: internal sprint 1, task 3 (Village view), round 2

## Requirement check

| Requirement | Result | Notes |
|---|---|---|
| Third tab "Village" registered in App.tsx | **PASS** | Tab button and `VillageView` render present (line 33, 46) |
| SVG top-down map with HQ + Engineering, R&D, Creative buildings on grass | **PASS** | Static review: `ALL_BLDGS`, `PATHS`, grass gradient, path lines all present |
| Roster characters as circular portrait tokens, initials fallback | **PASS** | `CharacterToken` component with portrait/initials logic |
| Idle near own building; owner and manager at HQ | **PASS** | `homePos()` in model.ts handles owner/manager at HQ, members spread around building |
| Walks along paths to HQ on `done`, back on `start` | **FAIL** | Bugs 1–3 below — animation is completely broken |
| Working characters show truncated task bubble | **PASS** | `v-bubble` with `truncate(task, 20)` |
| Click opens profile drawer reusing org styles/components | **PARTIAL** | Reuses CSS classes and component imports (`Portrait`, `Ring`, `StatusPill`, `ModelChips`) but drawer is a local copy missing Escape-close, focus trap, checkpoint, and stats sections (Bug 6) |
| Use `.studio/village/` assets if present | **FAIL** | Directory does not exist; placeholders always render |
| `prefers-reduced-motion`: no walking | **PARTIAL** | Works on mount but ref is never updated (Bug 5) |
| `npm run build` passes / TypeScript strict | **UNVERIFIED** | No shell access; static analysis shows no obvious type mismatches but build not run |

## Bugs

### Bug 1 — CRITICAL: rAF animation loop dies after first walk completion

**File:** `VillageView.tsx` lines 137–149

**Code:**
```js
const tick = () => {
  const t = Date.now();
  const prev = walksRef.current.length;
  walksRef.current = walksRef.current.filter((ws) => t - ws.startTime < WALK_DURATION);
  if (walksRef.current.length !== prev) setNow(t);    // ← fires on completion
  else animRef.current = requestAnimationFrame(tick);  // ← only fires when NOTHING completes
};
```

**Problem:** When any walk completes, `setNow(t)` fires to trigger a re-render, but the `else` branch does NOT fire, so `requestAnimationFrame(tick)` is never called. The animation loop terminates permanently. The effect has `[]` deps, so it will not re-run.

**Impact:** No character ever animates smoothly. Characters jump from A to B (on re-render only), then the loop dies.

**Expected:** Loop continues ticking for remaining walks AND triggers re-render. Both should happen:
```js
if (walksRef.current.length !== prev) setNow(t);
if (walksRef.current.length > 0) animRef.current = requestAnimationFrame(tick);
```

**Severity:** CRITICAL

---

### Bug 2 — HIGH: Character snaps back to home immediately after reaching HQ

**File:** `VillageView.tsx` lines 168–189

**Code:**
```js
if (walking) { /* animated position */ }
else {
  const lastWalk = walksRef.current.find((ws) => ws.agent === id);
  if (lastWalk && Date.now() - lastWalk.startTime >= WALK_DURATION) {
    x = lastWalk.toX; y = lastWalk.toY;  // ← this branch can NEVER fire
  } else {
    const hp = homePos(id, depts);        // ← always falls here
    x = hp.x; y = hp.y;
  }
}
```

**Problem:** Completed walks are filtered out of `walksRef` in `tick()` (line 141: `filter(... < WALK_DURATION)`). The `else` branch that checks for `lastWalk` with `Date.now() - lastWalk.startTime >= WALK_DURATION` will never match because those walks have already been removed from the array. Every character always falls through to `homePos`.

**Impact:** After a `done` event triggers a walk to HQ, the character never stays at HQ. Even if the animation loop worked, the character would appear at HQ for one frame then snap back.

**Expected:** Track completed walk destinations separately (e.g., a `lastDestination` ref per agent) so the character stays at the walk destination until a new event triggers another walk.

**Severity:** HIGH

---

### Bug 3 — HIGH: Walk events replay in a loop — no deduplication

**File:** `VillageView.tsx` lines 111–134

**Code:**
```js
useEffect(() => {
  // ...
  for (let i = events.length - 1; i >= 0 && i >= events.length - 30; i--) {
    const w = walkFor(events[i], loadedAt.current);
    if (!w) continue;
    // ...no check for duplicate walkId...
    walksRef.current.push({ ... });
  }
}, [events, depts, now]);   // ← `now` in deps = re-runs on every walk completion
```

**Problem:** The effect depends on `now`. Every time a walk completes, `setNow(t)` fires (Bug 1 path), which re-runs this effect. The effect re-scans the last 30 events and pushes new walks for the same events again, because `walkId` is never deduplicated. Each replay creates a walk from stale `from` coordinates.

**Impact:** Every event triggers multiple duplicate walks that overwrite each other's state. Combined with Bug 2, characters jitter between home and HQ repeatedly.

**Expected:** Maintain a `seen` set (like OrgView's `seen.current` for packets) to prevent replaying the same walk event. Or move walk creation to a one-time initialization that only processes events newer than `loadedAt`.

**Severity:** HIGH

---

### Bug 4 — MEDIUM: Characters walk in straight lines, not along the drawn paths

**File:** `model.ts` lines 22–26; `VillageView.tsx` walking logic

**Problem:** Paths are drawn as straight lines from HQ to each building, and `lerp` interpolates directly between endpoints. The requirement says "walks along paths" — which is satisfied for straight paths but the paths themselves are just visual decorations with no relationship to the walking interpolation. If paths were ever curved or multi-segment, walking would not follow them. This is a design limitation rather than a current bug.

**Severity:** MEDIUM (works today because paths are straight; fragile for future changes)

---

### Bug 5 — LOW: `prefers-reduced-motion` read once, never updates

**File:** `VillageView.tsx` lines 103–105

**Code:**
```js
const reducedMotion = useRef(
  window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);
```

**Problem:** No `.addEventListener('change', ...)` listener. If the user toggles reduced motion while the page is open, the village will not respond. Contrast with `OrgView.tsx` lines 10–19 where `useNarrow()` correctly sets up a live listener.

**Expected:** Add a `useEffect` that listens for `change` on the media query and updates `reducedMotion.current`, restarting/stopping the rAF loop accordingly.

**Severity:** LOW

---

### Bug 6 — LOW: Drawer is a local copy (`OrgDrawer`) missing features of the shared `Drawer`

**File:** `VillageView.tsx` lines 285–341

**Problem:** The village view defines its own `OrgDrawer` component instead of importing the shared `Drawer` from `../org/Drawer`. This local copy is missing:

- **Escape-key close** — the shared `Drawer` has `e.key === 'Escape'` handler (line 27)
- **Focus trap** — the shared `Drawer` has tab-rotation focus trapping (lines 29–34)
- **Focus restore** — the shared `Drawer` restores focus to opener on close (line 37)
- **`aria-labelledby`** — the shared `Drawer` has `aria-labelledby="o-dr-name"` with matching `id` on the `<h2>`
- **Checkpoint display** — the shared `Drawer` shows checkpoint data
- **Agent stats** — the shared `Drawer` shows started/done/blocked/token counts
- **`recentEvents`** — the shared `Drawer` uses `recentEvents()` for activity; the local copy filters events differently

These are accessibility and feature regressions versus the org tab drawer.

**Severity:** LOW (cosmetic/accessibility, not a functional blocker)

---

### Bug 7 — LOW: `.studio/village/` assets directory missing

**Problem:** The sprint log admits "Image assets in `.studio/village/` are not wired in yet; buildings are drawn as flat placeholders." The directory `.studio/village/` does not exist on disk. The requirement says "Use `.studio/village/` assets if present." Since the folder doesn't exist, the code technically meets the "if present" qualifier, but the assets should be created as part of this milestone.

**Severity:** LOW

---

## Summary

The walking animation is the core interactive feature of the Village tab, and it is broken in three interrelated ways:

| Bug | Severity | Status (round 1 → round 2) |
|---|---|---|
| rAF loop dies (Bug 1) | CRITICAL | Still broken |
| Snap back to home (Bug 2) | HIGH | Still broken |
| Event replay loop (Bug 3) | HIGH | Still broken |
| Straight-line walking (Bug 4) | MEDIUM | Still present |
| Reduced motion static (Bug 5) | LOW | Still present |
| Drawer feature parity (Bug 6) | LOW | Still present |
| Assets missing (Bug 7) | LOW | Still missing |

The static import/types check passes — all imports resolve to existing exports, no duplicate imports (the TS2300 error from round 1 is fixed). TypeScript strict mode should compile without errors based on manual tracing, but `npm run build` was not run.

**VERDICT: FAIL** — The walking animation has three critical/high bugs that make the core feature non-functional. The rAF loop termination (Bug 1) alone is a showstopper: characters never animate, never stay at their destination, and the event loop causes repeated walk replays. These are logic bugs in `VillageView.tsx` lines 111–149 that need to be rewritten.
