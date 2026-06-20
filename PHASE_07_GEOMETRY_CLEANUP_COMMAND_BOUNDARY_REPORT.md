# Phase 7: Geometry Cleanup and Command-Boundary Regression Certification Report

## Summary

Phase 7 removed the unused legacy geometry render helpers left in `src/pages/MathWorkspace.tsx` after Phase 6 and added browser-level command-boundary regression coverage for geometry selection, delete, no-selection safety, measurement overlays, and tool switching.

No geometry engine rewrite was performed. Construction state, selection state, dragging, persistence, registry wiring, and command orchestration remain in MathWorkspace. `GeometryWorkspacePanel` remains the route UI boundary.

## Files Changed

- `src/pages/MathWorkspace.tsx`

## Files Added

- `docs/PHASE_07_GEOMETRY_CLEANUP_COMMAND_BOUNDARY_AUDIT.md`
- `PHASE_07_GEOMETRY_CLEANUP_COMMAND_BOUNDARY_REPORT.md`
- `tests/workspace/geometryCommandBoundary.e2e.ts`

## Phase 6 Carryforward Risks

Phase 6 successfully extracted `GeometryWorkspacePanel`, but left unused old geometry view helpers in MathWorkspace. Phase 7 addressed that limitation by removing the stale render island and adding regression coverage before any deeper command/controller extraction.

Still carried forward:

- MathWorkspace remains large.
- Geometry state and command orchestration are still centralized.
- Build chunk size does not materially change because the panel is still statically imported.
- Full repo lint and full Vitest are still blocked by unrelated/carryforward issues.

## Removed Legacy Helpers

Removed all 10 named Phase 6 leftovers:

- `HiddenGeometryExport`
- `GeometryPendingPickPanel`
- `GeometryToolPalette`
- `ToolButton`
- `isSelectedGeometry`
- `pointLabelText`
- `PolygonDraftPreview`
- `AngleToolPreview`
- `GeometryMeasurementOverlays`
- `ConstraintOverlays`

Also removed 17 render-only supporting helpers that became unused with the same old geometry view island:

- `GeometryPaletteSection`
- `GeometryPaletteTool`
- `GeometryPaletteAction`
- `GeometryGrid`
- `GeometryLine`
- `linearDisplayEndpoints`
- `arrowHeadPoints`
- `GeometryCircle`
- `GeometryPolygon`
- `GeometryArc`
- `GeometryLocus`
- `arcPath`
- `angleArcPath`
- `angleLabelPoint`
- `AngleLabel`
- `directedAngleDegrees`
- `interiorAngleDegrees`

Replacement confirmation:

- Rendering, palette, selected styling, pick guidance, preview, measurement overlay, constraint overlay, and hidden export behavior now live in `GeometryWorkspacePanel`.

## Retained Geometry Helpers

Retained in MathWorkspace because command orchestration still uses them:

- `geometryToolLabel`
- `geometryObjectLabel`
- `geometryToolExpectedPick`
- `pointById`
- `pointIdsForObject`
- `geometryObjectBySelection`
- `patchGeometryObject`
- trace helpers
- construction mutation helpers
- delete, duplicate, restore, lock, style, image, and persistence handlers

These are command/state helpers, not stale route UI helpers.

## Geometry Command-Boundary Coverage

Added `tests/workspace/geometryCommandBoundary.e2e.ts`.

The new browser suite covers:

- point creation through the extracted geometry panel
- point selection through the Move tool
- selected point deletion through the keyboard Delete command boundary
- no-selection Delete safety status
- no-selection Move Selected safety status
- construction state preservation after unsupported commands
- tool switching without construction corruption

## Measurement Regression Coverage

The new browser suite creates two points, creates a line through the stable Line tool selector, verifies `workspace-geometry-measurements` becomes nonblank, drags a point, and verifies the measurement region remains present and nonblank.

Existing deterministic coverage in `src/workspace/geometryWorkflowRegression.test.ts` still covers distance, angle, area, perimeter, slope, equation, relation, intersection, snapping, transform, export/import, undo/redo, and unsupported action behavior.

## Selection And Transform Regression Coverage

Selection coverage:

- creates a point
- switches to Move
- selects the rendered point through its actual SVG hitbox
- deletes via keyboard Delete
- verifies point count returns to its prior value

Transform/no-selection coverage:

- no-selection Move Selected reports `Geometry transform is not supported`
- construction state is unchanged
- board remains nonblank

Selected-object transforms remain covered deterministically by `geometryWorkflowRegression.test.ts` through `transformGeometryObject`.

## Test IDs And Accessibility

Stable selectors remain preserved:

- `workspace-geometry-board`
- `workspace-geometry-measurements`
- `workspace-geometry-tool-point`
- `workspace-geometry-tool-line`
- `workspace-geometry-tool-circle`
- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`

Safety messages remain visible through `role="status"` and `aria-live="polite"`. Geometry tools remain semantic buttons.

## MathWorkspace Size Impact

- Before Phase 7 cleanup: 8,339 lines.
- After Phase 7 cleanup: 7,806 lines.
- Net reduction: 533 lines.
- Removed unused helpers: 27 definitions.

Focused MathWorkspace lint improved:

- Before cleanup: 51 problems, 43 errors, 8 warnings in the focused MathWorkspace-related lint run.
- After cleanup: 46 problems, 38 errors, 8 warnings in the focused MathWorkspace-related lint run.
- The removed Phase 6 geometry helper warnings/errors are gone.

Production build chunk:

- `MathWorkspace-BstgjXrX.js`: 370.62 kB uncompressed / 103.16 kB gzip.

This is effectively unchanged from Phase 6. No bundle-size improvement is claimed.

## Certification Preservation

Focused certification passed:

- Phase 1 Problem Solver trust certification: passed.
- Phase 5 GraphWorkspacePanel tests: passed.
- Phase 6 GeometryWorkspacePanel tests: passed.
- Phase 2 workspace baseline and QA suite: passed.
- Workspace mode config tests: passed.
- Geometry workflow regression tests: passed.
- Full `src/workspace` focused suite: passed.
- Phase 3 browser visual smoke: passed.
- Phase 4 unsupported-action browser tests: passed.
- New Phase 7 geometry command-boundary browser tests: passed.
- Typecheck: passed.
- Build: passed.
- `npm run test:e2e`: passed.

## Commands Run

- `npm run test -- src/problem-solver/problemSolverTrustCertification.test.ts` - passed, 113 tests.
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx` - passed, 7 tests.
- `npm run test -- src/components/workspace/panels/GeometryWorkspacePanel.test.tsx` - passed, 6 tests.
- `npm run test -- src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceQaSuite.test.ts` - passed, 8 tests.
- `npm run test -- src/workspace/workspaceModeConfig.test.ts` - passed, 11 tests.
- `npm run test -- src/workspace/geometryWorkflowRegression.test.ts` - passed, 3 tests.
- `npm run test -- src/workspace` - passed, 34 files and 126 tests.
- `npx playwright test tests/workspace/workspaceBrowserVisualSmoke.e2e.ts --timeout=90000` - passed, 6 tests.
- `npx playwright test tests/workspace/workspaceUnsupportedActions.e2e.ts --timeout=90000` - passed, 4 tests.
- `npx playwright test tests/workspace/geometryCommandBoundary.e2e.ts --timeout=90000` - passed, 4 tests.
- `npx eslint tests/workspace/geometryCommandBoundary.e2e.ts --max-warnings=0` - passed.
- `npx eslint src/pages/MathWorkspace.tsx src/components/workspace/panels/GeometryWorkspacePanel.tsx src/components/workspace/panels/GeometryWorkspacePanel.test.tsx tests/workspace/geometryCommandBoundary.e2e.ts --max-warnings=0` - failed due older MathWorkspace lint debt, but the Phase 6 geometry leftovers were removed.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- `npm run test` - failed due unrelated Visual Proofs Phase 11 assertions.
- `npm run lint` - failed due existing repo-wide lint debt.
- `npm run test:e2e` - passed, production build plus 8 Visual Proofs browser smoke tests.

Full `npm run test` failures:

- `src/visual-proofs/data/visualProofsPhaseEleven.test.tsx:63` - `formulaTokens(values).length` expected at least 4, received 2.
- `src/visual-proofs/data/visualProofsPhaseEleven.test.tsx:90` - circle area unrolling parameters expected `["radius","sectors"]`, received `["radius"]`.

These failures are unrelated to Phase 7 workspace geometry cleanup.

Full `npm run lint` failed with 80 problems: 68 errors and 12 warnings. Remaining files include:

- `public/sw.js`
- `src/components/syllabus/ConceptVisualMedia.tsx`
- `src/components/workspace/InspectorPanel.tsx`
- `src/components/workspace/ObjectList.tsx`
- `src/data/engineeringMathBlueprint.ts`
- `src/data/formulaLibrary.ts`
- `src/pages/AdvancedSyllabusLabPage.tsx`
- `src/pages/FormulasWorkspace.tsx`
- `src/pages/MathWorkspace.tsx`
- `src/pages/ShapesExplorer.tsx`
- `src/pages/TheoremLibraryPage.tsx`
- `src/trigonometry/pages/TrigFormulaVisualizerPage.tsx`
- `src/visual-proofs/proofs/geometry/GeometryProofTemplate.tsx`
- `src/visual-proofs/proofs/phase-eleven/PhaseElevenGeometryVisualModels.tsx`
- `src/workspace/dynamicWorkspaceEngine.ts`

## Known Limitations

- MathWorkspace remains a large orchestration module at 7,806 lines.
- Geometry command/state ownership has not yet been extracted.
- Full repo lint remains blocked by older unrelated debt.
- Full Vitest remains blocked by unrelated Visual Proofs Phase 11 assertions.
- Segment creation from blank-board clicks was not certified because the current supported browser path used in Phase 7 is point creation followed by Line tool selection.
- No route-level lazy loading was added.

## Recommendation For Phase 8

Phase 8 should extract geometry command/controller logic behind typed pure functions or a focused hook, starting with the now-certified command boundaries:

- selected object delete
- no-selection safety
- point selection
- line/measurement update
- transform command routing

Keep `GeometryWorkspacePanel` as the view boundary and keep the Phase 7 browser suite as a regression gate while moving command code out of MathWorkspace.
