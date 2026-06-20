# Phase 6: Workspace Route-Panel Extraction - Geometry Panel Report

## Summary

Phase 6 extracted the geometry workspace route UI from `src/pages/MathWorkspace.tsx` into `GeometryWorkspacePanel`. MathWorkspace remains the orchestration layer for construction state, selection, dragging, transformations, persistence, registry wiring, and unsupported-action safety, while the extracted panel now owns the geometry route rendering surface and geometry-only UI.

This phase did not change educational content or construction behavior. It reduced the visible geometry UI surface inside the workspace monolith while preserving browser route behavior, construction board rendering, stable test IDs, SVG export wiring, and geometry unsupported-action safety.

## Files Changed

- `src/pages/MathWorkspace.tsx`
- `src/workspace/workspaceBaselineGuards.test.ts`
- `src/workspace/workspaceRouteSmoke.test.tsx`

## Files Added

- `docs/PHASE_06_WORKSPACE_GEOMETRY_PANEL_EXTRACTION_AUDIT.md`
- `src/components/workspace/panels/GeometryWorkspacePanel.tsx`
- `src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`

## Phase 5 Carryforward Risks

Phase 5 extracted the graph panel but left MathWorkspace as the dominant workspace module. Phase 6 continues the same conservative pattern:

- Extract route-specific UI first.
- Keep state and command orchestration in MathWorkspace.
- Preserve stable browser selectors.
- Verify with focused unit, workspace, browser smoke, unsupported-action, build, and e2e checks.

Carryforward risks still present:

- MathWorkspace remains large.
- Full repo lint remains blocked by pre-existing lint debt.
- Full Vitest remains blocked by unrelated Visual Proofs Phase 11 assertions.
- Route panel extraction alone does not materially improve production chunk size.

## Geometry Panel Extraction

Moved into `GeometryWorkspacePanel`:

- Geometry route panel shell.
- Geometry tool palette.
- Geometry units toggle.
- Pending object-pick panel.
- Hidden image input.
- SVG construction board.
- Workspace image rendering.
- Point, line, circle, polygon, arc, and locus rendering.
- Selection styling for geometry objects.
- Polygon draft preview.
- Angle tool preview.
- Measurement overlays.
- Hidden SVG export surface.

MathWorkspace now passes:

- active geometry tool
- construction data
- selected geometry object
- selected point IDs
- polygon draft state
- geometry object pick state
- workspace image state
- selected image ID
- geometry units visibility
- board and export refs
- sidebar content
- event handlers for board, points, objects, images, tools, persistence, export, and image upload

Construction mutation remains in MathWorkspace. The extracted panel is a typed view/controller boundary, not a new state store.

## Preserved Behavior

Preserved geometry behavior includes:

- Direct geometry route rendering.
- Existing construction board SVG rendering.
- Existing geometry object display for points, lines, circles, polygons, arcs, and loci.
- Existing image rendering and image selection behavior.
- Existing point and object event wiring.
- Existing polygon draft and angle preview behavior.
- Existing measurement overlay display.
- Existing hidden SVG export surface.
- Existing sidebar content, including construction help, object panels, protocol, measurements, constraints, and workspace object panel.
- Existing no-selection transform safety behavior.

## Unsupported-Action Safety

Unsupported-action handling remains in the shared workspace shell and MathWorkspace command paths.

Confirmed safety surfaces remain:

- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`
- geometry no-selection transform safe failure path

The Playwright unsupported-action suite passed after extraction.

## Test IDs And Accessibility

Stable selectors preserved:

- `workspace-geometry-board`
- `workspace-geometry-measurements`
- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`

Added focused geometry tool selectors:

- `workspace-geometry-tool-point`
- `workspace-geometry-tool-line`
- `workspace-geometry-tool-circle`

The panel keeps semantic button controls for tools and route actions, and measurement content remains available through a stable rendered region.

## Geometry Panel Tests

Added `src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`.

Coverage:

- Renders the geometry board with stable test ID.
- Renders supported tool buttons and active state.
- Renders point, line, circle, polygon, locus, and measurement content.
- Renders selected object and pending construction picks.
- Renders polygon draft preview, angle preview, and selected image state.
- Handles an empty construction safely.

The test file passed in focused runs and also passed together with the existing graph panel tests.

## MathWorkspace Size Impact

- After Phase 5: 8,399 lines.
- After Phase 6: 8,339 lines.
- Net visible reduction in `MathWorkspace.tsx`: 60 lines.
- Extracted geometry panel: 709 lines.
- New geometry panel tests: 190 lines.

The modest net reduction is expected because Phase 6 moved the route JSX but left old geometry helper components in MathWorkspace for safety. Those old helpers now show up as unused lint leftovers and should be removed in the next cleanup-focused phase.

Production build reported:

- `MathWorkspace-Eco1zHvE.js`: 370.62 kB uncompressed / 103.16 kB gzip.

Compared with Phase 5's reported `371.26 kB / 103.13 kB`, uncompressed size improved slightly, while gzip did not materially improve. This should be treated as source modularization, not a real chunk-size win.

## Certification Preservation

Focused certification results:

- Phase 1 Problem Solver trust certification: passed.
- Phase 2 workspace baseline and QA suite: passed.
- Workspace mode config tests: passed.
- Full `src/workspace` focused suite: passed.
- Phase 5 graph panel tests: passed.
- New Phase 6 geometry panel tests: passed.
- Workspace browser visual smoke: passed.
- Workspace unsupported-action browser tests: passed.
- Typecheck: passed.
- Build: passed.
- `npm run test:e2e`: passed.

## Commands Run

- `npm run typecheck` - passed.
- `npm run build` - passed. Build completed in about 1m 5s during the focused build run.
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx` - passed, 7 tests.
- `npm run test -- src/components/workspace/panels/GeometryWorkspacePanel.test.tsx` - passed, 6 tests.
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx src/components/workspace/panels/GeometryWorkspacePanel.test.tsx` - passed, 2 files and 13 tests.
- `npm run test -- src/problem-solver/problemSolverTrustCertification.test.ts` - passed, 113 tests.
- `npm run test -- src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceQaSuite.test.ts` - passed after updating the baseline guard to include the extracted geometry panel source.
- `npm run test -- src/workspace/workspaceModeConfig.test.ts` - passed, 11 tests.
- `npm run test -- src/workspace` - passed after updating the route-smoke source guard to include the extracted geometry panel source; 34 files and 126 tests.
- `npx eslint src/components/workspace/panels/GeometryWorkspacePanel.tsx src/components/workspace/panels/GeometryWorkspacePanel.test.tsx --max-warnings=0` - passed.
- `npx eslint src/components/workspace/panels/GeometryWorkspacePanel.tsx src/components/workspace/panels/GeometryWorkspacePanel.test.tsx src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceRouteSmoke.test.tsx --max-warnings=0` - passed.
- `npx playwright test tests/workspace/workspaceBrowserVisualSmoke.e2e.ts --timeout=90000` - passed, 6 tests.
- `npx playwright test tests/workspace/workspaceUnsupportedActions.e2e.ts --timeout=90000` - passed, 4 tests.
- `npm run test:e2e` - passed, including production build and 8 Visual Proofs browser smoke tests.
- `npm run test` - failed due unrelated Visual Proofs Phase 11 assertions.
- `npm run lint` - failed due repo-wide lint debt and unused old geometry helpers left in MathWorkspace after extraction.

Full `npm run test` failures observed:

- `src/visual-proofs/data/visualProofsPhaseEleven.test.tsx:63` - `formulaTokens(values).length` expected at least 4, received 2.
- `src/visual-proofs/data/visualProofsPhaseEleven.test.tsx:90` - circle area unrolling parameters expected `["radius","sectors"]`, received `["radius"]`.

These failures are unrelated to Phase 6 workspace geometry extraction.

Full `npm run lint` failed with existing repo-wide issues in files including:

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

Phase 6-specific lint leftovers in `MathWorkspace.tsx` are old geometry helpers that became unused after extraction:

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

The new Phase 6 geometry panel files and touched guard files passed focused ESLint.

## Known Limitations

- MathWorkspace remains very large at 8,339 lines.
- Geometry state and command orchestration still live in MathWorkspace.
- Some old geometry render helpers remain in MathWorkspace as unused code after the extraction.
- Build chunk size did not materially improve because the extracted panel is still statically imported by MathWorkspace.
- Full repo lint remains blocked by unrelated existing debt and the old unused geometry helper leftovers.
- Full Vitest remains blocked by unrelated Visual Proofs Phase 11 assertions.
- No new browser visual regression system was added; existing browser smoke coverage was preserved.

## Recommendation For Phase 7

Phase 7 should be a geometry cleanup and command-boundary phase:

- Remove the now-unused legacy geometry render helpers from `MathWorkspace.tsx`.
- Keep construction state in MathWorkspace until the cleanup is certified.
- Add focused regression coverage around geometry selection, transform, and measurement command boundaries.
- Only then consider moving construction command helpers into a dedicated geometry controller or hook.

This is the safest next step because it reduces lint debt introduced by the extraction without rewriting the construction engine or changing user-facing geometry behavior.
