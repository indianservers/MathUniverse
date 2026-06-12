# Geometry Kernel Phase Report

## 1. Summary

Phase 2 focused on strengthening the 2D geometry kernel behind the workspace without redesigning the existing geometry UI or disturbing other modules.

The app already had many visible geometry tools and a useful construction workspace. The main gap was kernel depth: dependent objects with arbitrary IDs were not always recomputed after dragging, constraints had limited diagnostic feedback, and several GeoGebra-style relation constraints were not available in the shared exact construction kernel.

This phase adds deterministic constraint handling, drag-safe dependency recomputation, invalid-construction diagnostics, and focused regression coverage for the geometry engine.

## 2. Files Modified

| File | Purpose |
| --- | --- |
| `src/workspace/constructionKernels.ts` | Expanded the exact 2D construction kernel with relation constraints, diagnostics, and safer object rebuilding. |
| `src/workspace/constructionKernels.test.ts` | Added regression tests for GeoGebra-style constraints and invalid-construction diagnostics. |
| `src/workspace/geometry2dWorkspaceEngine.ts` | Added diagnostic solve flow, drag helper, and parent-based dependent object recomputation. |
| `src/workspace/geometry2dWorkspaceEngine.test.ts` | Added tests for drag recomputation, on-object projection, and diagnostic surfacing. |

No shared layout, route, global app shell, problem solver, engineering math page, or formula page was modified for this phase.

## 3. What Already Existed

The existing codebase already had:

- 2D geometry primitives: points, lines, segments, rays, circles, conics, polygons.
- Intersection logic for major 2D primitive combinations.
- Geometry measurements including distance, slope, midpoint, angle, polygon area, and perimeter.
- A geometry workspace UI with many construction tools.
- Construction protocol support.
- Locus sampling support.
- 3D geometry workspace engine and tests.

## 4. What Phase 2 Fixed

This phase improved the shared kernel in these areas:

- Added explicit solve diagnostics so invalid constructions can be reported instead of silently failing.
- Added fixed and locked point support.
- Added generic `on-object` projection for lines, segments, rays, and circles.
- Added equal-length constraints.
- Added parallel and perpendicular line construction constraints.
- Added circle tangent-at-point construction constraints.
- Added angle construction constraints.
- Added drag-safe solve helper for point movement.
- Recomputed dependent lines, segments, rays, circles, and polygons from `parents` metadata, even when object IDs are not encoded.
- Preserved existing behavior for ID-encoded generated objects.

## 5. Geometry Kernel Design

The exact 2D kernel remains deterministic and browser-only. It does not depend on a server or external geometry engine.

The solve flow is:

1. Start from the exact construction state.
2. Apply constraints in repeated passes.
3. Rebuild dependent objects after each pass.
4. Collect diagnostics for missing references, invalid constraints, and undefined intersections.
5. Return both solved geometry and validity metadata.

The workspace engine can now request either:

- A normal solved scene for existing callers.
- A solved scene with diagnostics for audit/debug panels and future UI warnings.

## 6. Supported Constraint Behaviors

| Behavior | Status | Notes |
| --- | --- | --- |
| Coincident points | Supported | Existing behavior preserved. |
| Midpoint construction | Supported | Reports missing references through diagnostics. |
| Fixed / locked point | Added | Keeps a point at its original or supplied position during solving. |
| Point on line | Supported | Projects onto infinite line. |
| Point on segment | Added through `on-object` | Projection clamps to segment endpoints. |
| Point on ray | Added through `on-object` | Projection clamps to ray direction. |
| Point on circle | Added through `on-object` | Projects point to circle circumference. |
| Intersections | Supported | Undefined intersections now produce diagnostics. |
| Fixed distance | Supported | Existing behavior preserved. |
| Equal length | Added | Places a target point at the same distance as a reference segment. |
| Parallel through point | Added | Recomputes target line from reference direction. |
| Perpendicular through point | Added | Recomputes target line from rotated reference direction. |
| Tangent at circle point | Added | Builds tangent line perpendicular to radius. |
| Fixed angle | Added | Places target point by angle from a reference ray. |
| Parent-based recomputation | Added | Works for lines, segments, rays, circles, and polygons with arbitrary IDs. |
| Drag recomputation | Added | `dragGeometryPoint` updates point and resolves dependent objects. |
| Invalid construction diagnostics | Added | Errors and warnings are returned to callers. |

## 7. Tests

Focused tests were added for:

- Parallel, perpendicular, equal-length, tangent, and angle constraints.
- Invalid/missing references and undefined intersections.
- Dependent segment, circle, and polygon recomputation after dragging a parent point.
- On-object circle projection.
- Diagnostic surfacing through the workspace engine.

Commands run:

| Command | Status |
| --- | --- |
| `npm test -- src/workspace/constructionKernels.test.ts src/workspace/geometry2dWorkspaceEngine.test.ts src/workspace/geometry3dWorkspaceEngine.test.ts src/workspace/constructionProtocol.test.ts` | Passed, 16 tests. |
| `npm run typecheck` | Passed. |
| `npm test -- src/workspace` | Passed, 99 tests. |
| `npx eslint src/workspace/constructionKernels.ts src/workspace/constructionKernels.test.ts src/workspace/geometry2dWorkspaceEngine.ts src/workspace/geometry2dWorkspaceEngine.test.ts --max-warnings=0` | Passed. |
| `npm run build` | Passed. |

## 8. Browser Verification

Checked with the in-app browser:

| Route | Result |
| --- | --- |
| `http://localhost:3526/workspace/geometry` | Loaded `Geometry Constructor`; no console errors observed. |
| `http://localhost:3526/workspace` | Loaded `Math Workspace`; no console errors observed. |

## 9. Remaining Limitations

The geometry system is stronger, but it is still not full GeoGebra parity yet.

- The kernel is deterministic and local, not a full nonlinear constraint solver.
- Over-constrained and under-constrained systems are diagnosed only in simple cases.
- Locus remains sampled rather than symbolic.
- Tangency support currently covers tangent-at-point on a circle, not all possible external/internal tangent constructions.
- The UI does not yet expose a dedicated construction validity panel powered by the new diagnostics.
- Construction replay exists elsewhere in the app, but this phase did not redesign the replay UI.
- Transform-created objects still need deeper dependency metadata in the UI layer to behave like first-class constructions everywhere.

## 10. Risk Areas

Areas to avoid disturbing without a focused follow-up:

- `src/pages/MathWorkspace.tsx`, because it contains the visible geometry workflow and many tool-specific interactions.
- Existing construction protocol behavior, because other tests depend on its output format.
- 3D geometry engine behavior, because this phase intentionally stayed focused on exact 2D constraints.
- Shared workspace state, because Phase 1 already introduced universal object graph publishing.

## 11. Phase 2 Readiness

Phase 2 is ready as a kernel hardening step. It improves correctness and auditability underneath the current UI while preserving existing features.

## 12. Recommended Phase 3

Phase 3 should target CAS Notebook parity:

- Worksheet memory across cells.
- Exact/numeric mode toggles.
- Assumption management.
- Multi-cell dependencies.
- Matrix and list support inside notebook cells.
- Symbolic simplification history.
- Exportable educational solution notebooks.
- Safe unsupported-state messaging instead of confident fallback output.
