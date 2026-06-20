# Phase 6 Workspace Geometry Panel Extraction Audit

## 1. Current Geometry Responsibilities In MathWorkspace

Before Phase 6, `src/pages/MathWorkspace.tsx` owned the geometry workspace route end to end:

- Geometry route layout, toolbar controls, and object editing sidebar placement.
- SVG construction board rendering.
- Geometry image layer rendering.
- Point, line, circle, polygon, arc, locus, and measurement rendering.
- Geometry tool palette and tool-specific helper text.
- Pending object-pick hints for transformations and constraints.
- Polygon draft and angle preview overlays.
- Hidden SVG export surface.
- Selection, drag, delete, visibility, lock, trace, transform, persistence, and board pointer event wiring.

The file also owned broader workspace orchestration that remains intentionally centralized in Phase 6:

- Workspace route selection.
- Shared command bar and tool rail behavior.
- Unsupported-action safety status.
- Construction state ownership.
- Object registry integration.
- Geometry command handlers.
- Import/export wiring.
- Cross-route panels and shared workspace shell layout.

## 2. Geometry State Currently Owned By MathWorkspace

MathWorkspace still owns the geometry state because that state participates in route-level commands, persistence, object registry updates, and shared workspace safety behavior.

State intentionally retained in `MathWorkspace.tsx`:

- `tool`
- `construction`
- `selectedGeometry`
- `selectedPointIds`
- `polygonDraft`
- `geometryObjectPicks`
- geometry drag state
- workspace image state
- selected image state
- image input ref
- board ref
- hidden SVG export ref
- show-geometry-units preference

This keeps Phase 6 conservative. The new panel receives this state through typed props and renders the geometry route, but it does not become a second source of truth.

## 3. Geometry Construction, Drag, Select, Delete, And Measurement Paths

Construction behavior remains routed through existing MathWorkspace handlers:

- Board pointer down, move, and up handlers.
- Board context-menu handler.
- Object selection handlers.
- Point selection and point drag handlers.
- Geometry object drag handlers.
- Image select, drag, rotate, dilate, lock, visibility, trace, and delete handlers.
- Construction reset, save, load, export, and image upload handlers.

The extracted `GeometryWorkspacePanel` now renders:

- construction points
- construction lines
- construction circles
- construction polygons
- construction arcs
- construction loci
- workspace images
- polygon draft preview
- angle preview
- measurement overlays
- hidden export SVG

The panel delegates mutation back to MathWorkspace through callbacks. No construction algorithm was rewritten in Phase 6.

## 4. Geometry Unsupported-Action Safety Paths

Unsupported-action safety remains in the shared workspace shell and MathWorkspace command paths:

- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`
- route-aware unsupported action handling
- no-selection transform safety

Phase 6 did not move unsupported-action policy into the panel. Browser tests continue to verify that geometry no-selection transform actions fail safely and report through the visible safety status instead of throwing fatal UI errors.

## 5. Geometry Browser Test IDs Stable

The following stable selectors remain available after extraction:

- `data-testid="workspace-geometry-board"`
- `data-testid="workspace-geometry-measurements"`
- `data-testid="workspace-command-bar"`
- `data-testid="workspace-tool-rail"`
- `data-testid="workspace-safety-status"`

Phase 6 also added stable tool button selectors for the extracted geometry panel:

- `data-testid="workspace-geometry-tool-point"`
- `data-testid="workspace-geometry-tool-line"`
- `data-testid="workspace-geometry-tool-circle"`

These selectors are intended to support browser visual smoke tests and focused component tests without depending on fragile class names or text position.

## 6. Candidate Helpers And Components Extracted

Extracted in Phase 6:

- Geometry route panel layout.
- Hidden image input used by geometry import.
- Geometry tool palette.
- Geometry units toggle.
- Pending construction-pick panel.
- SVG construction board.
- Geometry image layer.
- Geometry object rendering.
- Measurement overlays.
- Polygon draft preview.
- Angle preview.
- Hidden SVG export surface.
- Geometry display labels and pick-hint labels.

Intentionally not extracted in Phase 6:

- Construction state ownership.
- Construction creation algorithms.
- Drag and selection state transitions.
- Transformation commands.
- Constraint solving and measurement calculation.
- Persistence/import/export command orchestration.
- Shared workspace shell and route registry.
- Object registry mutation.

Display helpers live inside `GeometryWorkspacePanel.tsx` for this phase. A separate geometry panel utility module was not introduced because the immediate priority was to move route UI behind a typed boundary without changing construction behavior.

## 7. Exact Changes Made In Phase 6

Added:

- `src/components/workspace/panels/GeometryWorkspacePanel.tsx`
- `src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`

Modified:

- `src/pages/MathWorkspace.tsx`
- `src/workspace/workspaceBaselineGuards.test.ts`
- `src/workspace/workspaceRouteSmoke.test.tsx`

MathWorkspace now renders `GeometryWorkspacePanel` for the geometry route and passes construction data, active tool state, selected geometry state, image state, refs, sidebar content, and event callbacks through typed props.

The baseline and route-smoke source guards were updated to treat the extracted geometry panel as part of the protected geometry source surface. This preserves the guard intent instead of weakening it after source movement.

## 8. Remaining Extraction Risks For Phase 7

- MathWorkspace remains large at 8,339 lines.
- Old geometry render helpers still exist inside MathWorkspace as unused carryforward code after the panel extraction.
- Construction state and command orchestration are still centralized in MathWorkspace.
- Build chunk size does not materially improve because the geometry panel is still imported by MathWorkspace.
- Full repo lint remains blocked by existing repo-wide debt and Phase 6-unused old geometry helpers.
- Full Vitest remains blocked by unrelated Visual Proofs Phase 11 assertions.
- Deeper geometry extraction should proceed cautiously because construction mutation, selection, measurement, constraints, and object registry updates are tightly connected.

Recommended Phase 7 should remove the now-unused legacy geometry render helpers from `MathWorkspace.tsx` and then extract the remaining geometry command/selection helpers only after a focused regression harness is in place.
