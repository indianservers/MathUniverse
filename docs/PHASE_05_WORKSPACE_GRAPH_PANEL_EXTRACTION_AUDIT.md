# Phase 5 Workspace Graph Panel Extraction Audit

## 1. Current Graph Responsibilities In MathWorkspace

Before Phase 5, `src/pages/MathWorkspace.tsx` owned the graph workspace end to end:

- Graph route panel layout and graph-specific toolbar controls.
- Plot list rendering, visibility toggles, add/remove behavior, and expression presets.
- SVG graph surface rendering, axes, grid lines, curves, points, inequalities, and annotations.
- Local graph viewport controls for x/y ranges.
- Graph slider parameter controls for `a` and `b`.
- Value table generation and table range controls.
- Regression model summaries sourced from result-table seed data.
- Graph validation message rendering for invalid expressions.
- Graph helper logic for expression sampling, paths, scaling, table generation, and regression.

The file also still owns broader workspace orchestration that was intentionally not moved in this phase: command handling, route selection, unsupported-action safety wiring, shared shell layout, CAS/result cards, geometry, 3D, data/CAS views, teacher controls, export actions, and object registry integration.

## 2. Graph State Currently Owned By MathWorkspace

MathWorkspace still owns the graph state that participates in broader workspace behavior:

- `plots`
- `setPlots`
- `regressionSeed`
- `tableStart`
- `tableEnd`
- `tableStep`
- the `handlePlotsChange` path that keeps graph state aligned with graph validation and workspace orchestration.

The extracted panel owns only route-local interaction state:

- draft graph expression input
- local validation message after add attempts
- viewport bounds
- graph slider values `a` and `b`

This keeps Phase 5 conservative and avoids changing persistence, command interpretation, or route-level workspace contracts.

## 3. Graph Validation Paths

Phase 4 graph validation remains the active contract through `src/workspace/graphValidation.ts`.

The extracted `GraphWorkspacePanel` validates draft graph input before adding a plot:

- Calls `validateGraphExpression(draft)`.
- Blocks mutation when `isGraphValidationBlocking(validation)` is true.
- Shows the validation result in a visible status region.
- Preserves existing plots when validation fails.

MathWorkspace continues to use the shared validation path for graph state mutations outside the extracted panel.

## 4. Unsupported-Action Safety Paths

Unsupported-action safety remains in MathWorkspace and the shared workspace shell:

- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`
- route-mode unsupported action handling

The graph extraction does not move or weaken those paths. Phase 4 browser tests for unsupported actions continue to exercise the safety status surface after this extraction.

## 5. Stable Graph Test IDs

The following selectors remain stable:

- `data-testid="workspace-graph-surface"`
- `data-testid="workspace-command-bar"`
- `data-testid="workspace-tool-rail"`
- `data-testid="workspace-safety-status"`
- `data-testid="workspace-graph-validation-message"`

The graph validation message remains a visible, accessible status region with `role="status"` and `aria-live="polite"`.

## 6. Candidate Helpers And Components To Extract

Extracted in Phase 5:

- Graph route panel UI.
- Graph expression presets.
- Plot type inference.
- Plot parameter application.
- Plot sampling.
- SVG path generation.
- Graph scaling helpers.
- Value-table generation.
- Regression helpers.

Intentionally not extracted in Phase 5:

- Shared command parsing.
- Workspace persistence.
- Object registry wiring.
- CAS result orchestration.
- Export/import plumbing.
- Shell-level route and mode controls.

## 7. Exact Changes Made In Phase 5

Added:

- `src/components/workspace/panels/GraphWorkspacePanel.tsx`
- `src/components/workspace/panels/graphPanelUtils.ts`
- `src/components/workspace/panels/GraphWorkspacePanel.test.tsx`

Modified:

- `src/pages/MathWorkspace.tsx`
- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
- `tests/workspace/workspaceUnsupportedActions.e2e.ts`

MathWorkspace now renders `GraphWorkspacePanel` for the graph route and passes plot data, color palette, regression seed data, table range state, and update callbacks through typed props.

The Playwright workspace tests were stabilized around WebGL teardown by unloading the page after 3D visual checks. The dedicated 3D visual smoke test still checks canvas evidence; the unsupported-action 3D test focuses on safe failure status and visible surface availability.

## 8. Remaining Extraction Risks For Phase 6

- MathWorkspace remains large and still owns many unrelated panels.
- Graph state is still orchestrated from MathWorkspace, so deeper graph-store extraction is not complete.
- Some graph command paths are still mixed into broader workspace command handling.
- Full repo lint remains blocked by pre-existing debt in several files, including MathWorkspace.
- Full Vitest remains affected by unrelated Visual Proofs, formula library, and timing-sensitive workspace failures.
- Build chunk size did not improve materially in this phase; this was a source modularization step, not a route-level lazy-loading step.

Recommended Phase 6 should extract the next route panel with strong existing safety coverage, preferably the geometry workspace panel, while leaving shared command and persistence contracts intact.
