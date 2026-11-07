# QA – Task 4: Control Room Team view zoom/pan + owner avatar token

Scope reviewed (git diff): `.studio/app/src/features/org/Chart.tsx`, `org.css`, `AgentCard.tsx`.

## Checks
| Check | Result |
|---|---|
| `npm run build` in `.studio/app` (`tsc --noEmit && vite build`) | PASS – 47 modules, built OK, no type errors |
| Zoom buttons (−, reset, +) | PASS (code review): clamp 0.4–2, step 0.12, aria-labels, focus-visible style |
| Ctrl/Cmd + wheel zoom | PASS (code review): non-passive wheel listener, preventDefault only when ctrl/meta held, so normal scroll is unaffected |
| Drag-to-pan | PASS (code review): left-button mousedown, window mousemove/mouseup, listeners cleaned up on unmount |
| Owner avatar fallback uses `--owner` token | PASS: hard-coded `#fbbf24` replaced with `var(--owner)` (theme.css defines `--owner: #fbbf24`); SVG fallback rect is also filled via `--av-team` from `TEAM_VAR` |
| Reduced-motion respected | PASS: transition disabled under `prefers-reduced-motion` |

No automated tests exist for this feature (existing tests in `.studio/app/tests` cover the village feature only). Verification was by build plus code review; no browser E2E was run.

## Minor findings (non-blocking)
1. Low: after the first drag, `onUp` sets `el.style.cursor = ''`, which clears the inline `grab` cursor, so the grab hint is lost until re-render. Fix: restore `'grab'` or use CSS `:active`.
2. Low: a drag that starts on an agent card may still fire the card's click and open the detail panel. Suggest ignoring the click after movement past a small threshold.
3. Low: pan clamp is fixed (±1200/±600 px) rather than based on content size.

## Conclusion
The change matches the task description, builds cleanly, and has no blocking defects.

VERDICT: PASS
