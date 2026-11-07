# QA — Task 3: Control Room "Village" tab

Checked against the task description, `docs/internal/sprint-log.md` (Task 3 + round 3), `git diff`, and the files in `.studio/app/src/features/village/`.

## Commands run
| Command | Result |
|---|---|
| `npm run build` in `.studio/app` (`tsc --noEmit && vite build`) | **PASS**: 47 modules, built with no type errors |
| `tests/village-model.test.ts` (standalone assert script; bundled with esbuild and run in node) | 54 passed, **1 failed**: "truncates with ellipsis" |
| `tests/village.test.ts` (Playwright) | **Not run**: `@playwright/test` is not installed in `.studio/app`, and the repo has no test runner script |

## Acceptance mapping
| Requirement | Result |
|---|---|
| Third tab "Village" registered in `src/App.tsx` | PASS (tab type, button, and `VillageView` render) |
| New folder `src/features/village/` | PASS (`VillageView.tsx`, `model.ts`, `village.css`, `index.ts`) |
| SVG top-down map on grass, HQ plus Engineering, R&D and Creative buildings | PASS (by code read; no browser render) |
| Every roster character is a token: portrait in a circle, initials fallback | PASS (`clipPath` circle; initials via `initials()`) |
| Idles near its building | PASS (`homePos`) |
| Walks along paths to HQ on `done` and back on `start` | PASS by code read: `walkDir`, `routeFor` and the polyline route follow the drawn paths. Model tests cover this. Not seen in a live browser. |
| Working characters show a speech bubble with the truncated current task | PASS (`truncate(task, 20)`) |
| Click a character → reuse the org profile drawer | PASS (shared `org/Drawer`) |
| Uses `.studio/village/buildings/*.png` and `tiles/*.png` if present, else flat placeholders | PASS. `.studio/village/` doesn't exist, so placeholders are used. `useAsset` probes `/village/...` and `studio.js` gained a static route. The `/village/` route and the PNG branch were not exercised. |
| Respects `prefers-reduced-motion` (position change only) | PASS (reactive `matchMedia` listener, duration 0) |
| `npm run build` passes | PASS |

## Findings
1. **Test bug, not a product bug (low).** `tests/village-model.test.ts:88` expects `truncate('a very long task name here', 10) === 'a very long…'`. That string is 11 characters before the ellipsis. `truncate` does `s.slice(0,10)+'…'`, which gives `'a very lon…'`, and that is correct for the `max` argument. The test should expect `'a very lon…'`. Because of this the script exits 1. Reproduce: bundle the test with esbuild and run it in node.
2. **No test harness (low).** `package.json` has no `test` script, the tests use extensionless imports so `node --test` can't load them directly, and `@playwright/test` is missing, so `village.test.ts` can't run. The E2E coverage is therefore unverified.
3. **Stray files (info).** `.studio/app/temp_check.js` and `install-and-build.bat` are untracked leftovers and should be removed or ignored before commit.
4. **Not verified in a browser (info).** Walking animation, speech bubble layout and the placeholder look were checked only by reading code.

## Verdict reasoning
Every functional requirement is implemented. The build and typecheck are clean. The only failing check is a wrong expectation in a test, not a defect in the product. The gaps are the missing runner for the tests and the lack of visual verification. Neither is a requirement of the task, and I'm recording both as non-blocking.

VERDICT: PASS
