# Phase 08 Geometry Command Controller Extraction Audit

Date: 2026-06-20

## Scope

Phase 08 extracts pure geometry command/controller logic out of `src/pages/MathWorkspace.tsx` without changing the user-facing geometry board, the `GeometryWorkspacePanel` props contract, route behavior, or educational geometry content.

Reviewed continuity documents:

- `docs/PHASE_01_PROBLEM_SOLVER_TRUST_AUDIT.md`
- `docs/PHASE_02_WORKSPACE_QA_STABILIZATION_AUDIT.md`
- `docs/PHASE_03_BROWSER_VISUAL_QA_AUDIT.md`
- `docs/PHASE_04_WORKSPACE_ARCHITECTURE_SAFETY_AUDIT.md`
- `PHASE_05_WORKSPACE_GRAPH_PANEL_EXTRACTION_REPORT.md`
- `PHASE_06_WORKSPACE_GEOMETRY_PANEL_EXTRACTION_REPORT.md`
- `docs/PHASE_07_GEOMETRY_CLEANUP_COMMAND_BOUNDARY_AUDIT.md`
- `PHASE_07_GEOMETRY_CLEANUP_COMMAND_BOUNDARY_REPORT.md`

## Extraction Boundary

Created `src/workspace/geometryCommandController.ts` as a React-free typed controller for:

- Geometry construction data types.
- Point lookup by id.
- Selected object lookup.
- Point dependency expansion for selected objects.
- Immutable geometry style patching.
- Immutable geometry object deletion.
- Shared unsupported-action result for no-selection delete.
- Shared unsupported-action result for no-selection geometry transform.
- Typed transform request creation for selected points or selected objects.

Kept inside `MathWorkspace.tsx`:

- SVG board events and pointer handling.
- Drag lifecycle state.
- Construction solving and snapping.
- Trace sampling and trace locus creation.
- Workspace history/status updates.
- Image, graph, 3D, data, and teacher orchestration.
- Panel rendering and route selection.

This keeps Phase 08 low-risk: the extracted file owns pure command decisions, while the page still owns browser interaction and React state.

## Preserved Behavior

- `/workspace/geometry` continues to render through the existing workspace route.
- `GeometryWorkspacePanel` remains the geometry visual/panel boundary.
- Delete selected geometry uses the same cascade behavior as before, now through the controller.
- Delete/Backspace with no selected workspace object still returns a shared unsupported-action message.
- Move/rotate/dilate with no selected geometry still returns a shared unsupported-action message and preserves state.
- Selected point transforms still take priority over selected object transforms.
- Selected object transforms still expand to the object point ids.
- Existing graph/data/3D/teacher module contracts were not intentionally changed.

## Guard Updates

Updated source guard tests so protected geometry source signals can live across:

- `src/pages/MathWorkspace.tsx`
- `src/workspace/geometryCommandController.ts`
- `src/components/workspace/panels/GeometryWorkspacePanel.tsx`

This prevents future phases from assuming all protected geometry strings must remain inside the large page file.

## Pure Test Coverage Added

Created `src/workspace/geometryCommandController.test.ts`.

Coverage:

- Point lookup.
- Selected geometry object lookup.
- Point dependency expansion for point, line, circle, polygon, arc, and locus selections.
- Immutable style patch and explicit style reset.
- Point delete cascade across dependent lines, polygons, loci, and constraints.
- Non-point delete behavior.
- No-selection delete unsupported-action contract.
- Transform request creation from selected points and selected objects.
- No-selection transform unsupported-action contract.

## Current File Size

- `src/pages/MathWorkspace.tsx`: 7,345 lines after extraction.
- `src/workspace/geometryCommandController.ts`: 140 lines.

Phase 08 reduces page-owned command code but does not claim a complete workspace architecture split. More geometry creation helpers, trace helpers, and construction command handlers remain in the page.

## Known Inherited Risks

- Full repo lint debt is still outside this phase.
- Full repo test health has previously been blocked by Visual Proofs Phase 11 expectations unrelated to workspace geometry.
- Browser visual tests remain smoke-level, not pixel-baseline regression tests.
- Geometry trace, construction solving, and advanced tool creation logic still live in `MathWorkspace.tsx`.
- The worktree contains many pre-existing modified/untracked phase files; Phase 08 does not revert or normalize unrelated work.

## Phase 09 Recommendation

Extract geometry construction command builders next, especially point/line/circle/polygon creation command handlers that are still page-local. Keep browser event handling in the page until a dedicated workspace controller/store boundary is ready.
