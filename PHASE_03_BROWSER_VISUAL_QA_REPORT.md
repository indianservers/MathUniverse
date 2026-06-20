# Phase 3: Browser Visual QA and Workspace Rendering Certification Report

## Summary

Phase 3 adds browser-level Workspace rendering certification on top of the Phase 2 deterministic and SSR/static coverage. The new Playwright suite proves that the main Workspace routes load in Chromium, expose visible controls, render nonblank math surfaces, survive basic interactions, and fail on fatal console/page errors.

No product feature behavior was changed. The only UI edits were minimal stable `data-testid` attributes for browser QA.

## Files Changed

- `src/pages/MathWorkspace.tsx`
- `src/components/workspace/CommandBar.tsx`
- `src/components/workspace/ToolRail.tsx`

## Files Added

- `tests/workspace/workspaceBrowserAssertions.ts`
- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
- `docs/PHASE_03_BROWSER_VISUAL_QA_AUDIT.md`
- `docs/WORKSPACE_BROWSER_VISUAL_QA_PHASE_03.json`
- `docs/WORKSPACE_RELEASE_HEALTH_PHASE_03.json`
- `PHASE_03_BROWSER_VISUAL_QA_REPORT.md`

## Phase 2 Carryforward Risks

Phase 3 addresses the missing browser visual smoke layer from Phase 2:

- Browser visual/pixel smoke tests were missing: added Playwright route coverage.
- Canvas/SVG/Three.js nonblank checks were missing: added graph SVG, geometry SVG, and 3D canvas/container checks.
- Unsupported action helper is not wired through every command path: still a Phase 4 limitation.
- `MathWorkspace.tsx` remains large: still a Phase 4 architecture risk.

## Browser Test Infrastructure

The repo already had Playwright configured through `playwright.config.ts`, with existing e2e tests in `tests/**/*.e2e.ts`. Phase 3 reused that setup and did not introduce a new framework or dependency.

## Routes Covered

- `/workspace`
- `/workspace/graph`
- `/workspace/geometry`
- `/workspace/3d`
- `/workspace/data`
- `/workspace/teach`

## Graphing Visual Certification

The graph route is SVG-backed. Phase 3 verifies SVG dimensions, visible SVG marks, and at least one non-empty plotted path. It also adds `x^2`, rechecks the graph as nonblank, then adds an invalid expression and confirms the route remains visible and does not crash.

## Geometry Visual Certification

The geometry route is SVG-backed. Phase 3 verifies board dimensions and visible SVG marks, selects the Point tool, creates a point on the board, performs a basic board drag interaction, and rechecks that the board remains nonblank.

## 3D Visual Certification

The 3D route uses React Three Fiber canvas rendering. Phase 3 verifies the 3D surface container, canvas dimensions, and canvas PNG data evidence, then toggles rotation from pause to start without crashing.

## Data/CAS And Teacher Route Certification

The Data/CAS route verifies the data surface, spreadsheet/function-analysis navigation, and navigation into the spreadsheet subpage. The teacher route verifies guided activity, teacher presentation controls, and teaching-mode toggle behavior.

## Console Error Guard

`failOnFatalConsoleErrors(page)` fails on uncaught page errors, unexpected `console.error`, Vite error overlay, `Internal server error`, `Application error`, and common crash-marker text. The only documented allowed console fragment is `THREE.WebGLRenderer: Context Lost`.

## Visual QA Artifacts

- `docs/PHASE_03_BROWSER_VISUAL_QA_AUDIT.md`
- `docs/WORKSPACE_BROWSER_VISUAL_QA_PHASE_03.json`
- `docs/WORKSPACE_RELEASE_HEALTH_PHASE_03.json`

## Commands Run

- `npm run test -- src/problem-solver/problemSolverTrustCertification.test.ts`
  - Passed: 1 test file, 113 tests.
- `npm run test -- src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceQaSuite.test.ts`
  - Passed: 2 test files, 8 tests.
- `npm run test -- src/workspace`
  - Passed: 33 test files, 115 tests.
- `npm run typecheck`
  - Passed.
- `npm run build`
  - Passed.
- `npm run test`
  - Passed: 121 test files, 880 tests.
- `npx playwright test tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
  - Passed: 6 browser tests.
- `npm run test:e2e`
  - Passed: build plus 8 Visual Proofs browser smoke tests.
- `npx eslint tests/workspace/workspaceBrowserAssertions.ts tests/workspace/workspaceBrowserVisualSmoke.e2e.ts src/components/workspace/CommandBar.tsx src/components/workspace/ToolRail.tsx --max-warnings=0`
  - Passed.
- `npm run lint`
  - Failed repo-wide with existing unrelated lint debt: 86 problems, 73 errors, 13 warnings.

## Known Limitations

- No screenshot-baseline visual regression is claimed.
- 3D certification uses canvas dimensions and data URL evidence, not a full pixel histogram.
- Geometry drag is smoke-level and does not yet assert exact coordinate deltas or dependent measurement updates in browser.
- Invalid graph expressions are certified as safe/no-crash but do not yet have a dedicated browser-visible validation message contract.
- Unsupported action safety is still not wired through every command path.
- `MathWorkspace.tsx` remains large and still has pre-existing lint debt.

## Recommendation For Phase 4

Phase 4 should split `MathWorkspace.tsx` by workspace area and deepen browser workflow tests: graph validation messages, geometry coordinate/measurement assertions, 3D pixel histogram checks, and fuller unsupported-command UI safety coverage.
