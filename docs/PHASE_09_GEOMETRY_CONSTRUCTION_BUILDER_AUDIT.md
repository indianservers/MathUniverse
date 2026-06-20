# Phase 09 Geometry Construction Builder Audit

Date: 2026-06-20

## Scope

Phase 09 extracts pure geometry construction-building logic from `src/pages/MathWorkspace.tsx` into `src/workspace/geometryConstructionBuilder.ts`.

This phase does not move browser events, drag lifecycle, snapping, solving, history, persistence, full construction state, or the `GeometryWorkspacePanel` view boundary.

## Prior Phase Context Read

Reviewed:

- `PHASE_08_GEOMETRY_COMMAND_CONTROLLER_EXTRACTION_REPORT.md`
- `docs/PHASE_08_GEOMETRY_COMMAND_CONTROLLER_EXTRACTION_AUDIT.md`
- `PHASE_07_GEOMETRY_CLEANUP_COMMAND_BOUNDARY_REPORT.md`
- `PHASE_06_WORKSPACE_GEOMETRY_PANEL_EXTRACTION_REPORT.md`
- `PHASE_05_WORKSPACE_GRAPH_PANEL_EXTRACTION_REPORT.md`
- `PHASE_04_WORKSPACE_ARCHITECTURE_SAFETY_REPORT.md`
- `PHASE_03_BROWSER_VISUAL_QA_REPORT.md`
- `PHASE_02_WORKSPACE_QA_STABILIZATION_REPORT.md`
- `PHASE_01_PROBLEM_SOLVER_TRUST_CERTIFICATION_REPORT.md`

## Construction Logic Remaining In MathWorkspace

`MathWorkspace.tsx` still owns:

- `handleBoardPointerDown`
- `handleBoardPointerMove`
- `clientToBoard`
- `createPointForActiveGeometryTool`
- `consumeGeometryToolPointWithObjectPick`
- `consumeGeometryToolObject`
- advanced construction helpers for constraints and transforms
- construction solving through `solveConstruction`
- snap behavior through `snapBoardPoint`
- workspace history through `recordWorkspaceStep`
- visible status updates through `setProjectStatus`
- persistence, import/export, and protocol playback

This is intentional. These areas are not pure construction delta builders yet.

## Construction Paths Audited

Point:

- Blank-board Point tool creates a snapped point and records a workspace step.
- Pick-based tools create a new point first, then feed the point id back into the point-pick state machine.

Line, segment, ray, vector:

- Two picked points create a line collection entry with tool-specific style.
- One picked point is instructional, not an error.
- Repeated points do not create geometry.

Circle:

- Two picked points create a circle where the first point is center and the second is edge.
- Circle-radius uses the same supported two-point data model.

Polygon and triangle:

- Polygon drafts are held in `polygonDraft`.
- Polygon closes when the first draft point is picked again after at least three vertices.
- Triangle completes after three unique picks.

Angle and measurement:

- Angle tool uses three picked points in side, vertex, side order.
- Manual measurement extraction currently supports angle construction as an arc with `kind: "angle"`.
- Other manual measurement types are reported as unsupported by the builder; live line/circle/polygon measurements remain automatic overlays in `GeometryWorkspacePanel`.

Circle through three points:

- Three non-collinear picks create a computed center point and circle.
- Collinear picks return a warning and preserve construction.

## Builders Extracted

Created `src/workspace/geometryConstructionBuilder.ts` with:

- `nextGeometryPointLabel`
- `buildPointCreation`
- `buildLineFromPoints`
- `buildSegmentFromPoints`
- `buildRayFromPoints`
- `buildCircleFromPoints`
- `buildPolygonDraftUpdate`
- `buildPolygonCompletion`
- `buildTriangleCompletion`
- `buildAngleFromPoints`
- `buildMeasurementFromSelection`
- `buildCircleThroughThreePoints`

These functions are React-free, deterministic when given an injected id factory, and return construction results with status metadata.

## Command Controller Boundary

`geometryCommandController.ts` remains responsible for selection lookup, point dependency lookup, patching, delete, and transform request safety.

`geometryConstructionBuilder.ts` is responsible for creating construction deltas and draft-state decisions.

No circular dependency was introduced. The builder imports shared construction types and `pointById` from the command controller.

## Browser And State Logic Kept In MathWorkspace

Kept in `MathWorkspace.tsx` because it depends on React/browser state:

- DOM target inspection.
- SVG pointer capture.
- board-coordinate conversion.
- touch prevention.
- image drag and geometry drag lifecycle.
- snapping.
- construction solving.
- record/history messages.
- status message timing.
- selected geometry state.
- selected point state.
- object-pick state.

## Existing Behavior Protected

Existing tests protect:

- Phase 1 Problem Solver trust certification.
- Phase 2 workspace QA and baseline guards.
- Phase 3 browser visual workspace smoke.
- Phase 4 unsupported-action browser safety.
- Phase 5 graph panel behavior.
- Phase 6 geometry panel behavior.
- Phase 7 geometry command-boundary browser workflows.
- Phase 8 geometry command-controller pure contracts.

## New Tests Added

Created `src/workspace/geometryConstructionBuilder.test.ts`.

Coverage:

- point creation immutability and label/id structure.
- line creation.
- segment creation.
- ray creation.
- vector creation.
- incomplete/repeated line picks.
- circle creation.
- polygon draft preservation.
- early polygon completion blocking.
- polygon completion and draft clearing.
- angle construction.
- supported/unsupported measurement routing.
- circle-through-three-points creation.
- collinear circle-through-three-points rejection.

## Source Guards Updated

Updated source guard coverage so protected geometry signals can live across:

- `src/pages/MathWorkspace.tsx`
- `src/workspace/geometryCommandController.ts`
- `src/workspace/geometryConstructionBuilder.ts`
- `src/components/workspace/panels/GeometryWorkspacePanel.tsx`

## Size Snapshot

- Before Phase 09: `MathWorkspace.tsx` had 7,344 lines.
- After extraction: `MathWorkspace.tsx` has 7,341 lines.
- New builder module: 254 lines.
- Extracted builder functions: 11.

The line-count reduction is intentionally small because this phase favors pure testability over moving browser/state orchestration.

## Remaining Risks For Phase 10

- Advanced construction helpers remain page-local.
- Constraint builders remain page-local.
- Default tool-object creation is only partially backed by the new builder.
- Full repo lint debt remains outside this phase.
- Full Vitest remains expected to be blocked by unrelated Visual Proofs Phase 11 assertions unless those are fixed separately.
- Bundle chunk improvement is not expected because the builder is still imported by the same workspace route.

## Phase 10 Recommendation

Extract advanced constraint/transform construction helpers next or create a focused `geometryAdvancedConstructionBuilder.ts` for parallel/perpendicular, midpoint, fixed length, on-circle, intersections, compass, regular polygon, mirror, rotate, dilate, and translate. Keep solving and browser pointer orchestration in `MathWorkspace` until that layer is certified.
