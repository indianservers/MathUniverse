# Phase 09 Geometry Construction Builder Report

Date: 2026-06-20

## Summary

Phase 09 extracted the first pure geometry construction-builder layer from `src/pages/MathWorkspace.tsx` into `src/workspace/geometryConstructionBuilder.ts`.

The extraction keeps browser event handling, pointer conversion, snapping, solving, history, persistence, and view rendering in their existing boundaries while making the core construction deltas independently testable.

## Files Added

- `docs/PHASE_09_GEOMETRY_CONSTRUCTION_BUILDER_AUDIT.md`
- `src/workspace/geometryConstructionBuilder.ts`
- `src/workspace/geometryConstructionBuilder.test.ts`
- `PHASE_09_GEOMETRY_CONSTRUCTION_BUILDER_REPORT.md`

## Files Changed

- `src/pages/MathWorkspace.tsx`
- `src/workspace/workspaceBaselineGuards.test.ts`
- `src/workspace/workspaceRouteSmoke.test.tsx`

## Phase 8 Carryforward Risks

Phase 8 left geometry command-controller behavior safer and testable, but construction creation still lived mostly inside `MathWorkspace.tsx`.

Phase 09 reduces that risk by extracting deterministic builders for common construction outputs while preserving the command-controller boundary from Phase 8.

## Extracted Construction Builders

The new builder module includes:

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

These builders are React-free, deterministic with an injected id factory, and return status metadata for completed, incomplete, unsupported, and warning paths.

## Retained MathWorkspace Responsibilities

`MathWorkspace.tsx` still owns:

- browser pointer and DOM handling.
- `clientToBoard` coordinate conversion.
- snap behavior.
- construction solving through `solveConstruction`.
- workspace history and status messaging.
- selection and draft React state.
- drag lifecycle.
- image/object interactions.
- persistence, import/export, and protocol playback.

This keeps Phase 09 narrowly scoped to construction output logic instead of moving browser orchestration.

## Command Controller Boundary

`geometryCommandController.ts` remains responsible for lookup, patching, delete, transform requests, and unsupported-command safety.

`geometryConstructionBuilder.ts` now owns creation of construction objects and draft decisions for point, line, segment, ray, vector, circle, polygon, triangle, angle, measurement routing, and circle-through-three-points behavior.

No view-layer responsibility was moved into the builder.

## Incomplete And Unsupported Construction Safety

The builder preserves safety paths:

- one-point line/segment/ray/vector selection remains incomplete.
- repeated point picks do not create invalid lines.
- polygon completion before three vertices is blocked.
- collinear circle-through-three-point picks return a warning and preserve construction.
- unsupported measurement types return an explicit unsupported result instead of silently mutating construction.

## Builder Tests

Added `src/workspace/geometryConstructionBuilder.test.ts`.

Coverage includes:

- immutable point creation.
- deterministic ids and labels.
- line, segment, ray, and vector creation.
- incomplete and repeated point picks.
- circle creation.
- polygon draft and completion behavior.
- triangle completion.
- angle arc creation.
- supported and unsupported measurement routing.
- circle-through-three-points creation and collinear rejection.

## Browser Construction Preservation

Existing browser workflows remain protected by:

- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
- `tests/workspace/workspaceUnsupportedActions.e2e.ts`
- `tests/workspace/geometryCommandBoundary.e2e.ts`

No new browser-only behavior was introduced in Phase 09.

## Test IDs And Accessibility

Phase 09 did not alter visible workspace markup or `GeometryWorkspacePanel` rendering, so existing test IDs and accessibility surfaces were preserved.

## MathWorkspace Size Impact

- Before Phase 09: `MathWorkspace.tsx` had 7,344 lines.
- After Phase 09: `MathWorkspace.tsx` has 7,341 lines.
- New builder module: 254 lines.
- Extracted builder functions: 11.

The line-count reduction is small because orchestration code intentionally remains page-local. The value of this phase is purity, testability, and future extraction readiness.

Build chunk snapshot:

- `MathWorkspace-Dx4fvYPj.js`: 374.69 kB uncompressed / 104.28 kB gzip.

No bundle-size improvement is claimed for this phase because the new builder is statically imported by the same route chunk.

## Certification Preservation

Focused certification passed:

- Phase 1 Problem Solver trust certification.
- Phase 5 GraphWorkspacePanel tests.
- Phase 6 GeometryWorkspacePanel tests.
- Phase 8 command-controller tests.
- New Phase 9 construction-builder tests.
- Workspace unit/regression suite.
- Workspace browser visual smoke.
- Workspace unsupported-action browser tests.
- Geometry command-boundary browser tests.

## Commands Run

Passed:

- `npm run test -- src/problem-solver/problemSolverTrustCertification.test.ts`
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx`
- `npm run test -- src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`
- `npm run test -- src/workspace/geometryCommandController.test.ts src/workspace/geometryConstructionBuilder.test.ts src/workspace/geometryWorkflowRegression.test.ts src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceQaSuite.test.ts src/workspace/workspaceModeConfig.test.ts`
- `npm run test -- src/workspace`
- `npx playwright test tests/workspace/workspaceBrowserVisualSmoke.e2e.ts --timeout=90000`
- `npx playwright test tests/workspace/workspaceUnsupportedActions.e2e.ts --timeout=90000`
- `npx playwright test tests/workspace/geometryCommandBoundary.e2e.ts --timeout=90000`
- `npx eslint src/workspace/geometryConstructionBuilder.ts src/workspace/geometryConstructionBuilder.test.ts --max-warnings=0`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

Blocked by unrelated existing debt:

- `npm run test`
- `npm run lint`

## Known Limitations

- Advanced construction helpers remain inside `MathWorkspace.tsx`.
- Constraint and transform construction logic remains page-local.
- Full repo lint still fails on existing repo-wide issues outside the new builder.
- Full Vitest still fails on unrelated Visual Proofs Phase 11 assertions.
- The workspace route chunk did not shrink because the builder is imported into the same route.

## Recommendation For Phase 10

Phase 10 should extract advanced geometry construction helpers into a focused `geometryAdvancedConstructionBuilder.ts`.

Recommended scope:

- parallel and perpendicular construction.
- midpoint.
- fixed-length segments.
- point-on-circle constraints.
- intersections.
- compass copy.
- regular polygon.
- mirror, rotate, dilate, and translate construction payloads.

Keep solving, pointer handling, snapping, history, and visible workspace status in `MathWorkspace.tsx` until the advanced builder is certified with focused pure tests and browser smoke coverage.
