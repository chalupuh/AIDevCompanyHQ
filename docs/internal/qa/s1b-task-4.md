# QA Report — Sprint 1b Task 4

**Date:** 2026-11-06
**Reviewer:** qa-engineer
**Scope:** S1 (revert team-colour avatar override) + S2 (drag-to-pan improvements in Chart.tsx)

## Acceptance Criteria Matrix

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| S1-1 | Remove `.o-avatar-fallback[data-team] rect` rule from org.css | PASS | Rule removed (was line ~54). Grep for `data-team` / `--av-team` in `.studio/app/src` returns zero matches. |
| S1-2 | Remove `team` prop from `Portrait` in AgentCard.tsx | PASS | `Portrait` signature is now `{ id, c, size }` — `team` prop gone. All call sites updated (no `team={team}` in any `Portrait` usage). |
| S1-3 | Remove `data-team` attribute and `--av-team` CSS variable from Portrait's SVG | PASS | SVG no longer has `data-team={team}` or `style={team ? { ['--av-team']: TEAM_VAR[team] } : undefined}`. |
| S1-4 | Agents keep their own `c.color` for avatar fill | PASS | `<rect fill={fill}>` where `fill = c?.color \|\| 'var(--faint)'` — unchanged, agents render with their character color. |
| S1-5 | Only the owner fallback uses `var(--owner)` | PASS | `Chart.tsx` line 233: owner fallback object sets `color: 'var(--owner)'`, which flows through `c?.color` → `fill`. |
| S2-1 | Drag > 4 px cancels the next click (no card opens after a drag) | PASS | `DRAG_THRESHOLD = 4` constant. `moved` flag set when displacement exceeds threshold. A capture-phase `click` listener (`stopPropagation` + `preventDefault`, `once: true`) is installed on mouseup when `moved === true`. Cleanup via `setTimeout(..., 0)`. |
| S2-2 | `preventDefault()` on mousedown for pan starts | PASS | `e.preventDefault()` called in `onDown`. |
| S2-3 | `preventDefault()` skipped when target is within `button, a, .o-card, .o-toggle` | PASS | Early return if `(e.target).closest('button, a, .o-card, .o-toggle')` matches. |
| S2-4 | Cursor via CSS: `.o-zoom-viewport { cursor: grab }` | PASS | `org.css` line 16: `cursor: grab` on `.o-zoom-viewport`. No inline `style={{ cursor: 'grab' }}` on the viewport div. |
| S2-5 | Cursor via CSS: `.dragging { cursor: grabbing }` class toggled on viewport | PASS | `org.css` line 17: `.o-zoom-viewport.dragging { cursor: grabbing; user-select: none; }`. JS adds/removes `dragging` class in `onDown`/`onUp`. |

## Build & Test Results

```
$ npm --prefix .studio/app run build
tsc --noEmit && vite build
✓ 47 modules transformed.
✓ built in 374ms
→ PASS (typecheck + production build, zero errors)

$ npm --prefix .studio/app test
vitest run
Test Files  3 passed (3)
Tests      92 passed (92)
Duration   454ms
→ PASS
```

## Edge Case Analysis (code review only — no DOM test environment)

| Edge case | Finding |
|-----------|---------|
| Double-drag (start new drag before previous click swallower fires) | Each swallower uses `once: true` so at most one click is consumed per swallower. Multiple swallowers stack harmlessly; each fires once then self-removes. Acceptable. |
| Drag < 4 px (tap-like gesture) | `moved` stays `false`, no swallower installed, click proceeds normally — card opens as expected. |
| Mousedown on a card, then drag | `onDown` returns early for `.o-card` target — pan never starts, card click fires. Correct. |
| Mousedown on a button (zoom controls), then drag | `onDown` returns early for `button` target — pan never starts, button click fires. Correct. |
| `preventDefault()` on mousedown | Blocks text selection and native drag during pan. Only fires for non-interactive targets. Correct. |
| Cleanup of click swallower | `once: true` removes on first click; `setTimeout(removeEventListener, 0)` is belt-and-suspenders safety. No leak. |
| Touch events | Touch pan handler added but does not replicate the click-swallow logic. Minor gap — however, mobile users use `MobileList` view (no chart pan), so low impact. |
| `user-select: none` on `.dragging` class | Prevents accidental text selection while dragging the chart viewport. Good UX. |

## Findings & Minor Notes

**No bugs found.** All acceptance criteria met. Code is clean, dependency arrays in `useEffect`/`useCallback` are correct, no stale closure risks.

One minor observation (not a blocker):
- **Touch click-swallow gap:** The touch handler in Chart.tsx does not track `moved` or install a click swallower. A long press followed by release on mobile could theoretically fire a click on a card. Risk is low because the chart view is desktop-first and mobile renders `MobileList`. Could be addressed in a future hardening task.

VERDICT: PASS — All 10 acceptance criteria satisfied. Build and typecheck clean. 92/92 tests pass. No regressions.
