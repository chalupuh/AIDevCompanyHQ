# QA Report — Sprint 1b Task 4

**Date:** 2026-11-06
**Reviewer:** qa-engineer
**Branch:** `feat/internal-sprint-1`

## Scope

Two sub-changes:
- **S1:** Revert the team-colour avatar override — remove `.o-avatar-fallback[data-team] rect` CSS rule, remove `team` prop / `data-team` / `--av-team` from `Portrait` in `AgentCard.tsx` and `org.css`. Agents keep their own `c.color`; only the owner fallback uses `var(--owner)`.
- **S2:** Drag-to-pan in `Chart.tsx` — don't open a card after a drag (>4 px moved cancels the next click), `preventDefault` on mousedown except on buttons, cursor via CSS classes.

## Build & Test

| Check | Result |
|---|---|
| `npm --prefix .studio/app run build` (tsc + vite) | **PASS** — 47 modules, 0 errors |
| `npm --prefix .studio/app run test` (vitest) | **PASS** — 3 files, 92 tests, 0 failures |

---

## S1 — Avatar team-colour revert

### Acceptance criteria review

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| S1-1 | Remove `.o-avatar-fallback[data-team] rect` rule from `org.css` | **PASS** | Line removed (diff confirms). No remaining `[data-team]` selector in `org.css`. |
| S1-2 | Remove `team` prop from `Portrait` component | **PASS** | Signature changed from `{ id, c, size, team }` to `{ id, c, size }`. Call site no longer passes `team`. |
| S1-3 | Remove `data-team` attribute from SVG | **PASS** | `data-team={team}` attribute gone from `<svg>`. |
| S1-4 | Remove `--av-team` CSS custom property from SVG | **PASS** | `style={team ? { ['--av-team' as string]: TEAM_VAR[team] } : undefined}` gone. |
| S1-5 | Agents keep their own `c.color` | **PASS** | `Portrait` uses `const fill = c?.color \|\| 'var(--faint)'` — each agent's `Character.color` is the fill source. |
| S1-6 | Only the owner fallback uses `var(--owner)` | **PASS** | `Chart.tsx:214` — when `owner` roster entry is missing, fallback `Character` has `color: 'var(--owner)'`. No other code path injects `var(--owner)` as an avatar fill. |

**S1 summary:** All 6 criteria met. S1 is correct.

---

## S2 — Drag-to-pan in Chart.tsx

### Acceptance criteria review

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| S2-1 | Don't open a card after a drag (>4 px moved cancels the next click) | **FAIL** | No drag-distance tracking. `handleEnd()` only sets `isDragging.current = false`. After a drag ends, a subsequent click on any `.o-card` fires the card's `onClick` handler (`onOpen(id)`), opening the profile drawer. See Bug S2-B1 below. |
| S2-2 | `preventDefault` on mousedown except on buttons | **FAIL** | `onDown` (line 69-73) returns early for `button, a, .o-card, .o-toggle` but never calls `e.preventDefault()`. The wheel handler (line 41) and touchmove handler (line 103) do call `preventDefault()`, but the mousedown handler does not. See Bug S2-B2 below. |
| S2-3 | Cursor via CSS classes | **FAIL** | Cursor is set via inline style: `el.style.cursor = 'grabbing'` (line 73) and `el.style.cursor = 'grab'` (line 80). Initial cursor is inline JSX `style={{ cursor: 'grab' }}` (line 205). `org.css` has no `.o-zoom-viewport { cursor: grab }` or `.o-zoom-viewport.dragging { cursor: grabbing }` rules. See Bug S2-B3 below. |

**S2 summary:** All 3 criteria failed. The drag-to-pan refactoring added touch support and extracted shared handlers, but did not implement the three behavioral requirements.

---

## Bugs

### S2-B1 — Drag does not cancel subsequent click (severity: **high**)

**What the spec says:** ">4 px moved cancels the next click" — after a meaningful drag, the card that the pointer is over should not open when clicked.

**Actual code (`Chart.tsx`):**
```ts
const handleEnd = useCallback(() => { isDragging.current = false; }, []);
```
No distance is tracked. No flag suppresses the next click.

**Reproduction steps:**
1. Open the Control Room app, navigate to the Org tab.
2. Click on an empty area of the chart canvas and drag to pan (move >4 px).
3. Release the mouse button (drag ends).
4. Click on any agent card without moving the mouse.
5. **Actual:** The card's `onClick` fires → profile drawer opens.
6. **Expected:** The click is suppressed because a drag with >4 px movement just occurred.

**Fix needed:** Track cumulative drag distance in `handleStart`/`handleMove`/`handleEnd`. If `dragDistance > 4`, set a `suppressNextClick` flag. Add a one-shot `click` listener on the container that calls `e.stopPropagation()` / `e.preventDefault()` then removes itself.

---

### S2-B2 — `mousedown` does not call `preventDefault()` (severity: **medium**)

**What the spec says:** "preventDefault on mousedown except on buttons".

**Actual code (`Chart.tsx`):**
```ts
const onDown = (e: MouseEvent) => {
  if (e.button !== 0) return;
  if ((e.target as HTMLElement).closest('button, a, .o-card, .o-toggle')) return;
  handleStart(e.clientX, e.clientY);
  el.style.cursor = 'grabbing';
};
```
No `e.preventDefault()` call. This means text selection, drag-highlight, and context-menu defaults are not suppressed on the chart canvas.

**Reproduction steps:**
1. Click and drag on the chart canvas (empty area between cards).
2. **Actual:** Text/elements may become selected; browser default drag behaviour may activate.
3. **Expected:** `e.preventDefault()` fires, preventing all default mousedown behaviour on the canvas.

**Fix needed:** Add `e.preventDefault()` after the early returns (i.e., for non-button mousedown on the canvas).

---

### S2-B3 — Cursor set via inline style instead of CSS classes (severity: **low**)

**What the spec says:** "cursor via CSS classes".

**Actual code (`Chart.tsx`):**
- Line 73: `el.style.cursor = 'grabbing'`
- Line 80: `containerRef.current.style.cursor = 'grab'`
- Line 205: `style={{ cursor: 'grab' }}`

**org.css:** No `.o-zoom-viewport` cursor rule, no `.o-zoom-viewport.dragging` class.

**Expected:**
```css
.o-zoom-viewport { cursor: grab; }
.o-zoom-viewport.dragging { cursor: grabbing; }
```
```tsx
// in onDown
el.classList.add('dragging');
// in onUp
el.classList.remove('dragging');
// initial inline style removed
```

**Fix needed:** Move cursor control from inline style to CSS class toggle.

---

## Edge case probes

| Edge case | Result | Notes |
|---|---|---|
| Double-submit (rapid clicks on card) | Not tested (no E2E runner for this internal app) | N/A |
| Empty chart (no agents) | Build passes, no runtime test | N/A |
| Touch drag on mobile viewport | Added in this change but not tested against S2-1 criterion | Touch `onEnd` also lacks drag-distance tracking and click suppression |
| Scrollbar interaction during drag | `overflow: auto` on `.o-zoom-viewport` could conflict with pan | Not explicitly addressed |

---

## Verdict

S1 (avatar revert): **PASS** — all 6 criteria verified correct.
S2 (drag-to-pan): **FAIL** — all 3 criteria unimplemented. Three bugs filed (S2-B1 high, S2-B2 medium, S2-B3 low).

Build and test suite: **PASS** (tsc + vite build clean, 92 unit tests pass), but the test suite does not cover the S2 behavioral requirements, so no test failure surfaced the missing implementation.

Re-verified on retry (git diff HEAD plus grep of Chart.tsx): build and 92 tests still pass. S1 is fully done: `data-team`, `--av-team`, the `team` prop and the CSS rule are all gone, and no `[data-team]` remains in src. In Chart.tsx, `preventDefault` appears only in the wheel and touchmove handlers (lines 41 and 103). There is no drag-distance or click-suppression code, and the cursor is still set inline (lines 73, 80, 205). The S2 requirements are therefore not met, and this report cannot honestly say PASS until the engineer implements them.

VERDICT: FAIL — S2 drag-to-pan requirements (drag-distance click suppression, preventDefault on mousedown, CSS-class cursor) are not implemented. See bugs S2-B1, S2-B2, S2-B3.
