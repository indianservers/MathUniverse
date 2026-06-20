# Phase 3 Browser Visual QA Audit

## 1. Workspace Routes Requiring Browser Visual QA

Phase 3 covers the main Workspace routes that Phase 2 identified as needing real browser rendering certification:

- `/workspace`
- `/workspace/graph`
- `/workspace/geometry`
- `/workspace/3d`
- `/workspace/data`
- `/workspace/teach`

These routes all resolve through `src/pages/MathWorkspace.tsx` or a thin route wrapper around it.

## 2. Existing Browser Test Setup

The project already has Playwright configured:

- `playwright.config.ts`
- `tests/**/*.e2e.ts`
- Existing visual proof tests under `tests/visual-proofs/`
- Existing workspace angle-tool e2e test under `tests/workspace/geometryAngleTool.e2e.ts`

Phase 3 reuses the existing Playwright Chromium setup and Vite preview server convention. No new browser framework or dependency was introduced.

## 3. Reusable Browser Smoke Patterns

The Visual Proofs e2e suite already provides useful patterns:

- route navigation with status assertions
- nonblank primary visual checks
- Vite overlay/error-surface checks
- mobile and route-matrix oriented smoke structure

Phase 3 mirrors that style with a Workspace-specific helper:

- `tests/workspace/workspaceBrowserAssertions.ts`
- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`

## 4. Graph, SVG, Canvas, And 3D Rendering Risks

- Graphing can silently regress if sampled plot paths disappear while the route shell still renders.
- Geometry can silently regress if the SVG board renders only the shell but no grid, point, or object marks.
- 3D can silently regress if React Three Fiber mounts a route but no canvas or visible scene evidence is produced.
- Data/CAS and teacher pages can pass unit tests while their browser panels are hidden, blank, or broken by route-shell layout changes.
- Unexpected browser console errors can be missed by Vitest and SSR/static route smoke.

## 5. Exact Browser Checks Added In Phase 3

Phase 3 adds:

- Fatal console/page-error guard through `failOnFatalConsoleErrors(page)`.
- Route smoke for `/workspace`, `/workspace/graph`, `/workspace/geometry`, `/workspace/3d`, `/workspace/data`, and `/workspace/teach`.
- Stable browser QA selectors on actual rendered surfaces:
  - `data-testid="workspace-command-bar"`
  - `data-testid="workspace-tool-rail"`
  - `data-testid="workspace-graph-surface"`
  - `data-testid="workspace-geometry-board"`
  - `data-testid="workspace-3d-surface"`
  - `data-testid="workspace-3d-canvas"`
  - `data-testid="workspace-data-surface"`
  - `data-testid="workspace-teacher-surface"`
- Graph SVG certification:
  - dimensions greater than zero
  - visible SVG marks
  - at least one non-empty plotted path
  - adding `x^2` keeps graph nonblank
  - adding an invalid expression does not blank or crash the route
- Geometry SVG certification:
  - board dimensions greater than zero
  - visible board marks
  - Point tool can create a point
  - board drag interaction does not crash
- 3D certification:
  - 3D route surface visible
  - canvas exists and has nonzero backing dimensions
  - canvas PNG data evidence exists
  - rotation control toggles safely
- Data/CAS certification:
  - data surface visible
  - spreadsheet and function-analysis navigation visible
  - spreadsheet subroute navigation works
- Teacher certification:
  - teacher surface visible
  - guided activity and presentation panels visible
  - teaching mode toggle works

## 6. Known Limitations Remaining For Phase 4

- No screenshot-baseline visual regression is claimed.
- 3D certification uses canvas dimension and data URL evidence, not a full pixel histogram.
- Geometry browser drag is smoke-level and does not yet assert exact coordinate delta or dependent measurement updates.
- Invalid graph expressions are certified as safe/no-crash, but there is not yet a dedicated browser-visible validation message contract.
- Unsupported action safety is still not wired through every command path.
- `MathWorkspace.tsx` remains large and should be split by workspace area in a future architecture phase.
