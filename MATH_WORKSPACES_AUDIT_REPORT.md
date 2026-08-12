# Math Workspaces Audit Report

## Audit Status

This report was rebuilt in three phases and completed on 12 August 2026. The release decision below is based on current machine-readable unit, browser, accessibility, lifecycle, and performance evidence.

- Phase 1: architecture, claim verification, CAS/Graphs correction, truthful capability states, focused regression evidence - **Complete**
- Phase 2: mathematical coverage, shared objects, spreadsheet, exports, and end-to-end workflows - **Complete with documented limitations**
- Phase 3: complete responsive matrix, accessibility, performance, full-suite remediation, and release decision - **Complete**
- Current release recommendation: **Production-ready for the implemented workspace scope**

## Corrected Baseline

Independent source and live-browser checks invalidated several claims in the previous report:

| Previous claim | Independent result | Evidence |
| --- | --- | --- |
| CAS was correctly graph-first | Incorrect product architecture | The graph occupied the permanent center of `CasStudioWorkspaceV2`; Phase 1 replaced it with the CAS notebook and made the graph an on-demand preview. |
| 2D Graphs was an acceptable scroll workbench | Did not meet the requested single-screen architecture | At 1280x720 the old content measured 1,536px tall. Phase 1 now uses bounded left/canvas/right panes and no stage scrolling at desktop. |
| Notes was safely disabled | Partially correct, but still an unsupported visible reference | Notes had no route and appeared as a disabled module. Phase 1 removed it from the CAS workspace bar. A real Notes workspace is deferred. |
| Voice input was unavailable | Too broad | Browser Web Speech capability can be detected. Phase 1 added capability detection, explicit unsupported state, listening/cancel states, and review-before-use. |
| Equation scanning was implemented | False | No OCR dependency exists. The control is disabled and explicitly says no OCR engine is installed. |
| Lint had 39 errors | Stale | `npm run lint -- --max-warnings=0` passes in the Phase 1 worktree. |
| 27 full-suite failures were an accepted baseline | Not accepted as current proof | The old count is retired. The current Vitest full-run invocation exited without a reliable summary artifact; full-suite accounting remains a Phase 3 gate. |

## Phase 1 Architecture

### CAS

The CAS route is symbolic-computation-first:

- The center contains editable notebook cells, exact output, warnings, transformations, and selection state.
- Result, Steps, Properties, Assumptions, and Related panels use the selected notebook cell.
- Graphing is absent by default and opens as a dismissible preview overlay.
- Closing the preview leaves the notebook mounted and preserves the selected cell.
- Calculation history and spreadsheet preview remain visible without replacing the notebook.
- Notes is not advertised because `/workspace/notes` does not exist.
- Voice input is enabled only when `SpeechRecognition` or `webkitSpeechRecognition` exists.
- Recognized speech is normalized into a review field and is never calculated until the user accepts it.
- Equation scanning remains disabled because no OCR engine is installed.

### 2D Graphs

At desktop width (1280px and above), the route uses three bounded areas:

1. Left: expression input, plot list/table switcher, presets, and viewport bounds.
2. Center: continuously visible graph canvas.
3. Right: parameters and live values table.

The expression and table panes scroll internally. The graph stage itself does not scroll at 1280x720. Below the desktop breakpoint, the route retains a stacked, touch-scrollable layout with one explicit scroll owner.

## Phase 2 Implementation

### CAS mathematics and steps

- Added real engine-backed one-sided limits, implicit differentiation, Taylor polynomials, Laplace/inverse Laplace, ODE solving, complete-square, rationalize, numerical/complex/inequality solving, determinant, inverse, matrix multiplication, RREF, rank, eigenvalues, and eigenvectors.
- Added structured step records with previous expression, operation, rule, resulting expression, token-level changed terms, explanation, and verification text. The UI supports **Next step** and **Show all**. These records summarize engine output; they do not invent intermediate algebra not returned by the symbolic engine.
- Added selected-calculation LaTeX/plain syntax copy, MathML copy, and JSON export.
- CAS notebooks persist in local storage and survive CAS to Graphs/Spreadsheet navigation.

### Connected workspaces and sliders

- Added an expiring, target-aware, single-consumption transfer envelope for CAS, Graphs, 3D Graphs, Spreadsheet, Geometry, and 3D Geometry.
- CAS can send a selected object to Graphs, 3D Graphs, or Spreadsheet. Spreadsheet sends selected formulas or the live regression model to CAS/Graphs. 3D Graphs accepts a CAS surface and returns the active surface to CAS or 3D Geometry.
- Parameter `a`/`b` values persist across Graphs sessions and synchronize with `v_a`/`v_b` query parameters. CAS **Create slider** creates a stored linked parameter.
- This is persistent parameter sharing, not a live multi-tab reactive dependency graph. Animation policy, circular slider dependencies, and all-workspace real-time propagation remain open.

### Spreadsheet and exports

- Added actual XLSX import/export using ExcelJS. The exported default workbook preserves Dataset, Regression, and Residual sheets and formula strings.
- XLSX round-trip is tested for non-empty output, sheet names, headers, and formulas. The initially considered SheetJS package was removed after its security advisories were identified.
- Existing JSON, CSV, TSV, print/PDF, regression preview, CAS, and Graphs actions remain available.

### Geometry and 3D validation

- Existing 2D and 3D kernels were revalidated rather than replaced. Tests cover parent-based recomputation, snapping, intersections, measures, transforms, loci, cross-sections, construction serialization, and undo/redo snapshots.
- 3D Graphs route rendering verifies multiple surfaces, slices, opacity, wireframe/solid controls, save, and camera controls.

## Phase 1 Findings

| ID | Severity | Finding | Root cause | Phase 1 result |
| --- | --- | --- | --- | --- |
| P1-001 | Critical | CAS architecture contradicted the symbolic-first requirement. | A permanent graph was the center workspace. | Fixed: notebook is central; graph is optional preview. |
| P1-002 | High | Graphs was a vertically stacked workbench. | Inputs, canvas, sliders, and table shared a document flow. | Fixed at desktop: three bounded panes and status bar. |
| P1-003 | High | Voice was disabled without checking browser capability. | No browser speech adapter. | Fixed: capability-detected adapter and review flow. |
| P1-004 | High | Equation scan could imply future functionality without identifying the missing dependency. | No OCR package/service. | Clarified and disabled; implementation deferred. |
| P1-005 | Medium | Notes appeared in CAS without a route. | Module inventory drift. | Removed unsupported CAS module reference. |
| P1-006 | Medium | Graph stage had competing scroll owners and no keyboard-scroll region. | Stage/root overflow conflict. | Fixed for stacked breakpoints; desktop is single-screen. |
| P1-007 | Medium | Route smoke tests asserted obsolete product copy. | Tests were not updated after Geometry/CAS redesigns. | Fixed; current route contracts now pass. |
| P1-008 | High | Full-suite counts in the old report are not independently reproducible yet. | Reporter/run behavior did not produce a reliable final summary artifact. | Open Phase 3 release gate. |

## Live Evidence

### CAS reproduction and result

1. Open `/workspace/data` at 1280x720.
2. Confirm `CAS notebook calculations` is the central region and four starter cells render.
3. Confirm no `.cas-graph-preview` exists initially.
4. Activate **Graph preview**; preview and close control appear.
5. Activate **Close graph preview**; preview disappears and notebook remains mounted.
6. Confirm Notes is absent from the module bar.
7. Confirm equation scan is disabled with `Equation scanning is unavailable because no OCR engine is installed.`

Observed body size: 1280x720 at a 1280x720 viewport, with no page overflow.

### Graphs reproduction and result

1. Open `/workspace/graph?v_a=1&v_b=0` at 1280x720.
2. Confirm the stage is 662px high and `overflow-y: hidden`.
3. Confirm the card is fully contained from y=70 to y=708.
4. Confirm columns resolve to 300px / 565.6px / 300px.
5. Confirm the graph canvas remains visible at 565.6x384px.
6. Confirm the left editor has its own scroll range (493px content in a 382px viewport).
7. Confirm the status bar shows plot count, ranges, parameter values, and sampling state.

## Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Pass | `npm run typecheck` |
| Lint | Pass | `npm run lint -- --max-warnings=0` |
| Production build | Pass | `npm run build` |
| Phase 1 focused tests | Pass, 24/24 | Speech adapter, graph panel, shared layout, and workspace route smoke tests |
| CAS live interaction | Pass | Notebook default; preview open/close; Notes absent; truthful camera/voice states |
| Graphs live layout | Pass at 1280x720 | Three bounded panes, nonzero canvas, no stage scroll |
| Full repository suite | Inconclusive in Phase 1 | Runner did not emit a reliable complete summary artifact; Phase 3 gate |

## Phase 2 Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Pass | `npx tsc --noEmit` after final Phase 2 edits |
| Lint | Pass | `npm run lint -- --max-warnings=0` |
| Production build | Pass | `npm run build` |
| CAS/transfer/XLSX focused tests | Pass, 17/17 | CAS operations, structured steps, persistence, transfer expiry/consumption, workbook formulas |
| Geometry/3D/rendered-route tests | Pass, 25/25 | `artifacts/phase2-kernel-tests.json` |
| Graph slider/transfer/XLSX retest | Pass, 12/12 | Query hydration, persistent controls, transfer, XLSX |
| Full repository suite | Inconclusive | Full JSON invocation again produced no summary file; Phase 3 gate remains |
| Phase 2 live browser capture | Blocked | In-app browser webview timed out attaching twice; no Phase 2 screenshot is claimed |

## Remaining Phase 2 Limitations

- OCR/equation scanning has no recognition engine and remains disabled truthfully.
- Notes remains intentionally omitted. A complete Notes authoring and PDF workflow was not added in this phase.
- CAS does not support every requested command. Cancel, higher/partial derivatives as dedicated notebook commands, LU/QR/SVD, probability, units, set, and Boolean operations remain omitted where a validated engine workflow was not established.
- Structured steps cannot show mathematically exact intermediate expressions when the underlying engine returns only a narrative rule; the UI does not fabricate them.
- Shared slider storage is not a real-time cross-tab reactive object/dependency graph.
- Spreadsheet PDF uses the browser print path. Generated PDF readability was not independently parsed in Phase 2.
- Shapes formula-by-formula live interaction and physically draggable mobile bottom sheet remain Phase 3 evidence/work.
- Complete shared export-dialog unification remains open; Phase 2 connected supported formats without replacing every workspace-specific export surface.

## Phase 3 Completion

- Exercised CAS, Spreadsheet, Geometry, 3D Geometry, Graphs, 3D Graphs, and Shapes across 14 phone, tablet, desktop, ultrawide, and 4K viewports: 98 combinations total.
- Recorded zero horizontal overflow, zero clipped visible controls, zero non-WebGL console errors, and a maximum audited route load of 2,192ms.
- Ran WCAG 2 A/AA axe checks and keyboard-focus checks on all seven routes with zero violations.
- Re-entered and exited all three WebGL routes three times each. All nine cycles mounted a canvas and left zero tagged canvases after navigation.
- Added durable large-construction benchmarks for 499, 999, and 1,999 evaluated objects. All met their budgets; the largest completed in 4,335.67ms against 5,000ms.
- Removed quadratic dynamic-workspace replacement work and bounded inferred pairwise relation measurements, preventing export string exhaustion on large constructions.
- Remediated the full repository suite, including stale additive-catalog assumptions, exact NCERT theorem routes, lesson-content normalization, engineering readiness panels, and router-aware Geometry panel tests.
- Updated the browser matrix to isolate each viewport in a fresh context and save evidence incrementally, preventing accumulated WebGL/lazy-module state from invalidating long audits.

## Phase 3 Verification Results

| Check | Result | Evidence |
| --- | --- | --- |
| Full repository suite | Pass, 1,463/1,463 tests; 518/518 suites; 0 timeouts | `artifacts/phase3-full-tests.json` |
| Responsive matrix | Pass, 98/98 combinations | `artifacts/math-workspaces-phase3/responsive.json` |
| Accessibility | Pass, 7/7 routes; 0 axe violations | `artifacts/math-workspaces-phase3/accessibility.json` |
| WebGL lifecycle | Pass, 9/9 cycles; 0 retained canvases | `artifacts/math-workspaces-phase3/webgl-lifecycle.json` |
| Large-construction performance | Pass, 3/3 scenarios | `artifacts/math-workspaces-phase3/performance.json` |
| TypeScript | Pass | `npm run typecheck` and production build |
| Lint | Pass | `npm run lint` |
| Production build | Pass | `npm run build` |

## Screenshots

- Before evidence retained from the previous cycle: `artifacts/cas-studio-ui/` and `artifacts/graph-studio-phase1/`
- Phase 1 CAS after: `artifacts/math-workspaces-phase1/cas-symbolic-first-after.png`
- Phase 1 Graphs after: `artifacts/math-workspaces-phase1/graphs-single-screen-after.png`

## Release Recommendation

The seven audited workspace routes are production-ready for their implemented scope. Every Phase 3 release gate is green on the current build. Deferred product breadth such as OCR, Notes, real-time cross-tab dependency propagation, and several advanced CAS operations remains accurately represented as unavailable or out of scope and should be planned as future feature work rather than treated as a quality-gate failure.
