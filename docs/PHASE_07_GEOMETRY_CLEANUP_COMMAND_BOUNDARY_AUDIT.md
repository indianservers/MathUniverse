# Phase 7 Geometry Cleanup And Command-Boundary Audit

## 1. Unused Legacy Geometry Helpers Remaining Before Cleanup

Phase 6 left a geometry rendering island inside `src/pages/MathWorkspace.tsx` after the route UI moved to `GeometryWorkspacePanel`.

The named Phase 6 leftover helpers were confirmed unused in `MathWorkspace.tsx`:

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

During cleanup, their supporting unused render-only helpers were also confirmed as dead code:

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

## 2. Replacement Status

Each removed helper is now represented inside `src/components/workspace/panels/GeometryWorkspacePanel.tsx` or no longer needed:

- Hidden SVG export is rendered by `GeometryWorkspacePanel`.
- Geometry palette and tool buttons are rendered by `GeometryWorkspacePanel`.
- Pending object-pick guidance is rendered by `GeometryWorkspacePanel`.
- Geometry board grid and object rendering are rendered by `GeometryWorkspacePanel`.
- Selected-object styling and point labels are rendered by `GeometryWorkspacePanel`.
- Polygon draft and angle preview are rendered by `GeometryWorkspacePanel`.
- Measurement and constraint overlays are rendered by `GeometryWorkspacePanel`.

Retained in MathWorkspace:

- `geometryToolLabel`, because MathWorkspace command/status text and `ConstructionHelp` still use it.
- `geometryObjectLabel`, because command steps and object-pick status text still use it.
- `pointById`, `pointIdsForObject`, `geometryObjectBySelection`, `patchGeometryObject`, trace helpers, delete/duplicate helpers, and construction mutation helpers because MathWorkspace still owns construction state and command orchestration.

## 3. Geometry Command, Selection, And Measurement Paths Still Owned By MathWorkspace

MathWorkspace still owns:

- construction state
- selected geometry state
- selected point IDs
- object-pick state
- image state
- board pointer handlers
- point creation
- point and object selection
- point dragging
- object dragging
- delete command behavior
- keyboard Escape/Delete command boundaries
- selected-object transformations
- show/hide, lock, trace, restore, duplicate, and delete handlers
- measurement calculation for sidebar panels
- construction persistence and SVG export refs
- object registry synchronization

This is intentional for Phase 7. No construction state was moved into the extracted panel.

## 4. Existing Tests Covering These Paths

Existing coverage retained:

- `src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`
- `src/workspace/geometryWorkflowRegression.test.ts`
- `src/workspace/workspaceBaselineGuards.test.ts`
- `src/workspace/workspaceQaSuite.test.ts`
- `src/workspace/workspaceRouteSmoke.test.tsx`
- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
- `tests/workspace/workspaceUnsupportedActions.e2e.ts`

These already cover static panel rendering, deterministic geometry workflow operations, route smoke, baseline guards, browser visual smoke, and unsupported-action safety.

## 5. New Regression Tests Added In Phase 7

Added:

- `tests/workspace/geometryCommandBoundary.e2e.ts`

Coverage:

- Creates a point through the extracted geometry panel and deletes it through the real keyboard command boundary.
- Verifies no-selection Delete reports a safe unsupported status and preserves construction state.
- Verifies no-selection Move Selected reports a safe unsupported status and preserves construction state.
- Creates two points, creates a line through the stable Line tool selector, verifies measurement overlays become nonblank, drags a point, and verifies the measurement overlay region remains present and nonblank.
- Switches Point, Line, Circle, and Move tools and verifies construction state is not corrupted.

## 6. Exact Cleanup Changes Made

Modified:

- `src/pages/MathWorkspace.tsx`
- `tests/workspace/geometryCommandBoundary.e2e.ts`

Added:

- `tests/workspace/geometryCommandBoundary.e2e.ts`

Removed from MathWorkspace:

- 10 Phase 6 named unused legacy helpers.
- 17 supporting unused render-only helpers.
- unused geometry kernel imports that only supported the removed render island.

Preserved:

- construction state
- command handlers
- selection state
- drag state
- persistence
- object registry wiring
- unsupported-action status
- Phase 5 GraphWorkspacePanel behavior
- Phase 6 GeometryWorkspacePanel behavior

## 7. Remaining Risks For Phase 8

- MathWorkspace remains large at 7,806 lines.
- MathWorkspace still has older non-geometry lint debt.
- Full repo lint remains blocked by pre-existing repo-wide issues.
- Full Vitest remains blocked by unrelated Visual Proofs Phase 11 assertions.
- Geometry state and command orchestration are still centralized.
- Deeper extraction should focus on command/controller boundaries, not visual rendering.
- Route-level lazy loading is still not addressed by this cleanup phase.

Recommended Phase 8 should extract geometry command/controller helpers behind typed pure functions or a focused hook, starting with selection/delete/transform boundaries now covered by browser regression tests.
