# Phase 5: Workspace Route-Panel Extraction - Graph First Report

## Summary

Phase 5 extracted the graph workspace UI and graph-only helpers out of `src/pages/MathWorkspace.tsx` into a focused graph panel module. MathWorkspace remains the orchestration layer, but the graph route now delegates rendering, local graph controls, SVG plotting, graph tables, and regression display to `GraphWorkspacePanel`.

This phase did not add new graph features. It reduced the monolith safely while preserving Phase 4 graph validation, route safety behavior, browser-only operation, and stable browser test selectors.

## Files Changed

- `src/pages/MathWorkspace.tsx`
- `tests/workspace/workspaceBrowserVisualSmoke.e2e.ts`
- `tests/workspace/workspaceUnsupportedActions.e2e.ts`

## Files Added

- `docs/PHASE_05_WORKSPACE_GRAPH_PANEL_EXTRACTION_AUDIT.md`
- `src/components/workspace/panels/GraphWorkspacePanel.tsx`
- `src/components/workspace/panels/graphPanelUtils.ts`
- `src/components/workspace/panels/GraphWorkspacePanel.test.tsx`

## Phase 4 Carryforward Risks

Phase 4 hardened graph validation, workspace mode typing, and unsupported-action safety, but left `MathWorkspace.tsx` as the dominant workspace module. Phase 5 addresses the first part of that architecture risk by extracting the graph route panel behind typed props.

Carryforward risks still present:

- MathWorkspace still owns shell layout and most non-graph route panels.
- Shared command interpretation and workspace persistence are still centralized.
- Full repo lint and full test debt remain outside this phase.

## Graph Panel Extraction

Moved into `GraphWorkspacePanel`:

- Graph expression input and presets.
- Add/remove/visibility UI.
- Graph validation status rendering.
- Graph viewport controls.
- Slider parameter controls.
- SVG graph surface and labels.
- Value table UI.
- Regression summary UI.

Moved into `graphPanelUtils`:

- Plot sampling and SVG path creation.
- Plot kind inference and parameter substitution.
- Value-table generation.
- Graph scaling helpers.
- Linear and polynomial regression helpers.

MathWorkspace now passes:

- `plots`
- `colors`
- `regressionSeed`
- `tableRange`
- `onChange`
- `onTableRangeChange`

## Preserved Behavior

Preserved graph behavior includes:

- Direct graph route rendering.
- Existing plot rendering for functions, points, and inequality-style graph inputs.
- Existing valid plots remain visible when a new invalid expression is entered.
- Graph validation messages are visible and accessible.
- Unsupported workspace actions still report through the shared safety status.
- Browser visual smoke and unsupported-action tests still use stable workspace selectors.

## Graph Validation

Invalid graph expressions still validate before state mutation through `validateGraphExpression`.

Confirmed behavior:

- Unsafe fragments are blocked before adding a plot.
- A visible validation message is shown.
- Existing valid plots are preserved.
- The graph route does not blank or throw fatal page errors.
- Suggested supported formats remain available through the validation result.

## Test IDs And Accessibility

Stable selectors preserved:

- `workspace-graph-surface`
- `workspace-command-bar`
- `workspace-tool-rail`
- `workspace-safety-status`
- `workspace-graph-validation-message`

The graph validation message uses:

- `role="status"`
- `aria-live="polite"`

The message is visible text and is not color-only.

## Graph Panel Tests

Added `src/components/workspace/panels/GraphWorkspacePanel.test.tsx`.

Coverage:

- Renders with a valid expression.
- Renders `workspace-graph-surface`.
- Produces non-empty graph marks.
- Renders validation messages with suggestions.
- Handles empty graph state safely.
- Keeps existing plots visible during invalid validation state.
- Verifies add-expression payload construction.
- Verifies remove-expression behavior.

## MathWorkspace Size Impact

- Before Phase 5: 8,737 lines.
- After Phase 5: 8,399 lines.
- Net reduction: 338 lines.
- Extracted graph panel: 188 lines.
- Extracted graph helpers: 231 lines.

Production build still reports:

- `MathWorkspace-LJsxQTiT.js`: 371.26 kB uncompressed / 103.13 kB gzip.

This is slightly larger than the Phase 4 reported chunk and should not be treated as a bundle-size improvement. Phase 5 is a source modularization phase; route-level chunk optimization should be handled separately.

## Certification Preservation

Focused certification results:

- Phase 1 Problem Solver trust certification: passed.
- Phase 2 workspace baseline and QA suite: passed in focused runs.
- Phase 3 workspace browser visual smoke: passed.
- Phase 4 unsupported-action browser tests: passed.
- New Phase 5 graph panel tests: passed.
- Typecheck: passed.
- Build: passed.
- Visual Proofs e2e command: passed.

## Commands Run

- `npm run typecheck` - passed.
- `npm run build` - passed after rerun with a longer timeout. Build completed in about 2m 11s during the focused build run.
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx` - passed, 7 tests.
- `npm run test -- src/problem-solver/problemSolverTrustCertification.test.ts` - passed, 113 tests.
- `npm run test -- src/workspace/workspaceBaselineGuards.test.ts src/workspace/workspaceQaSuite.test.ts` - passed, 8 tests.
- `npm run test -- src/workspace/workspaceModeConfig.test.ts` - passed, 11 tests.
- `npm run test -- src/workspace` - passed on rerun, 34 files and 126 tests. One earlier parallel run exposed the existing timing-sensitive QA performance check.
- `npm run test -- src/components/workspace/panels/GraphWorkspacePanel.test.tsx src/workspace src/problem-solver/problemSolverTrustCertification.test.ts` - passed, 36 files and 246 tests.
- `npx eslint src/components/workspace/panels/GraphWorkspacePanel.tsx src/components/workspace/panels/graphPanelUtils.ts src/components/workspace/panels/GraphWorkspacePanel.test.tsx tests/workspace/workspaceBrowserVisualSmoke.e2e.ts tests/workspace/workspaceUnsupportedActions.e2e.ts --max-warnings=0` - passed.
- `npx playwright test tests/workspace/workspaceBrowserVisualSmoke.e2e.ts --timeout=90000` - passed, 6 tests.
- `npx playwright test tests/workspace/workspaceUnsupportedActions.e2e.ts` - passed, 4 tests.
- `npm run test:e2e` - passed, production build plus 8 Visual Proofs browser smoke tests.
- `npm run test` - failed due carryforward/unrelated failures.
- `npm run lint` - failed due carryforward repo-wide lint debt.

Full `npm run test` failures observed:

- `src/visual-proofs/data/visualProofsPhaseEleven.test.tsx` - two existing Phase 11 assertions around formula tokens and circle area unrolling parameters.
- `src/visual-proofs/proofs/loadVisualProofComponent.test.ts` - representative category loader test timed out in full-suite load.
- `src/workspace/largeConstructionPerformance.test.ts` - timing-sensitive large construction benchmark failed in full-suite load.
- `src/workspace/workspaceQaSuite.test.ts` - timing-sensitive performance report showed one failure in full-suite load, while focused reruns passed.
- `src/pages/FormulaLibraryPage.test.tsx` - two unrelated formula library rendering tests failed in the full run.

Full `npm run lint` failed with existing repo-wide issues in files including:

- `public/sw.js`
- `src/components/syllabus/ConceptVisualMedia.tsx`
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

The new Phase 5 graph panel files passed focused ESLint.

## Known Limitations

- MathWorkspace is still a large orchestration module at 8,399 lines.
- The graph panel is extracted, but graph state still lives in MathWorkspace.
- Build chunk size did not improve.
- Repo-wide lint remains blocked by unrelated existing debt.
- Full Vitest remains blocked by unrelated/carryforward failures and timing-sensitive tests.
- The 3D Playwright tests required page unloads after WebGL checks to avoid teardown instability in long runs.

## Recommendation For Phase 6

Extract the geometry workspace panel next. Geometry has strong Phase 3 and Phase 4 browser safety coverage, visible route behavior, and clear boundaries around construction state, validation, and unsupported actions. Keep MathWorkspace as orchestration for one more phase, and move only geometry-specific UI and helpers behind typed props.
