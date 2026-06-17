# Visual Proofs Phase 15 QA Results

## Routes Upgraded

- `/visual-proofs/calculus/mean-value-theorem`
- `/visual-proofs/calculus/fundamental-theorem-of-calculus`
- `/visual-proofs/calculus/integration-by-parts-visual-proof`
- `/visual-proofs/calculus/derivative-of-sine`
- `/visual-proofs/calculus/derivative-of-exponential`
- `/visual-proofs/calculus/taylor-series-approximation`
- `/visual-proofs/calculus/optimization-derivative-max-min`

## Calculus Full Consistency Pass Results

- All 15 available Calculus routes are now marked `phase-upgraded`.
- All 15 Calculus routes use `graph-limit` learning metadata.
- All 15 Calculus routes are included in `visualProofsRouteSmokeManifest`.
- The seven Phase 15 routes use `VisualProofShell` through `PhaseTwoProofExperience`.
- `hasVisualRegressionTest` remains `false` because no browser visual regression suite exists.
- Metadata exposes formula-token support, prediction prompts, misconception checks, keyboard controls, state inspector, teacher mode, Olympyard exits, snapshot support, expected visual kind, and expected primary selector for all Calculus routes.

## Shared Calculus Graph Primitives Added/Reused

- Reused the Phase 14 graph-limit language, SVG-backed primary visuals, compact labels, and drag-handle control model.
- Added focused Phase 15 guides for:
  - Mean Value Theorem secant/tangent slope matching.
  - Fundamental Theorem accumulated area and thin-strip growth.
  - Integration by parts as product-rule strip rearrangement.
  - Derivative of sine through unit-circle projection and sine graph tangent.
  - Derivative of exponential through height/slope equality.
  - Taylor approximation with degree, center, test point, and error.
  - Optimization with derivative sign strip and critical-point classification.

## Graph/Dragging/Controls Verified

- MVT: draggable endpoints `a`, `b`, and interior point `c`.
- FTC: draggable moving endpoint `x`, plus fixed lower-bound and strip-width controls.
- Integration by parts: draggable `u`, `v`, `du`, and `dv` rectangle handles.
- Derivative of sine: draggable unit-circle angle `x`.
- Derivative of exponential: draggable input `a` on the graph.
- Taylor series: draggable center `a` and test point `x`, plus bounded degree slider.
- Optimization: draggable point `x` along the curve, with derivative sign and critical-point state.

## Keyboard Fallback Verified

- All direct manipulation parameters are mirrored in the shared shell parameter panel.
- `DraggableHandle` remains keyboard focusable with arrow-key nudges.
- Previous, next, reset, labels, formula, reveal, challenge, and teacher controls remain inherited from `ProofControls`.

## Formula Highlighting Verified

- MVT: `f'(c)`, `f(b)-f(a)`, `b-a`, secant slope, and `c`.
- FTC: `A(x)`, `integral_a^x`, `f(x)`, `A'(x)`, and `F(b)-F(a)`.
- Integration by parts: `uv`, `u dv`, `v du`, `integral u dv`, and `uv - integral v du`.
- Derivative of sine: `sin x`, `cos x`, and `d/dx`.
- Derivative of exponential: `e^x`, derivative `e^x`, and height=slope relation.
- Taylor series: `f(a)`, linear term, higher-order terms, degree `n`, and approximation error.
- Optimization: `f'(x)>0`, `f'(x)<0`, `f'(x)=0`, max, and min.

## Prediction Prompts Verified

- MVT predicts tangent slope matching secant slope.
- FTC predicts faster area growth when graph height is larger.
- Integration by parts identifies the product rule.
- Derivative of sine checks slope at `x = 0`.
- Derivative of exponential explains rate equals current value.
- Taylor series predicts improved local accuracy near the center.
- Optimization explains horizontal tangent as critical-point candidate.

## Misconception Checks Verified

- MVT is about matching slopes, not function values.
- FTC derivative of accumulated area is height, not another area.
- Integration by parts is product-rule rearrangement, not a random formula.
- Derivative of sine is cosine, not sine.
- Derivative of exponential is not a power-rule case.
- Taylor polynomials are local approximations, not equally accurate everywhere.
- Zero derivative does not automatically imply maximum or minimum.

## Snapshot JSON/SVG Export Status

- Phase 15 routes inherit versioned snapshot JSON copy/fallback through `SnapshotExportButton`.
- SVG export is available because the upgraded primary visuals are SVG-backed.
- SVG export still gracefully disables if a future proof has no SVG in the primary visual area.
- PNG export remains pending.

## Mobile Label Resilience Checks

- Phase 15 visuals use compact SVG labels and keep dense formulas in formula/state panels.
- Shared Phase 10 shell guardrails still provide overflow containment, formula wrapping, responsive SVG width, and control wrapping.
- No automated mobile label-collision detector exists yet.

## Route Smoke Manifest Updates

- The route smoke manifest includes all seven Phase 15 routes automatically through `phase-upgraded` metadata.
- All 15 Calculus routes are now present in the manifest.
- Manifest entries retain SVG primary selector expectations and snapshot/control/inspector flags.

## Typecheck, Build, And Focused Test Results

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseFifteen.test.tsx`: passed, 1 test file and 5 tests.
- Phase 1 and Phase 3-15 focused proof ladder: passed, 14 test files and 60 tests.

## Focused ESLint Result

- Focused ESLint verification on Phase 15 touched TypeScript/TSX files passed with `--max-warnings=0`.

## Full Lint/Test Unrelated Debt Status

- Full `npm run lint` still fails with 83 pre-existing unrelated lint problems across service worker globals, unused imports/locals, React hook dependency warnings, no-useless-escape findings, workspace code, and the legacy `GeometryProofTemplate` unused `AngleArc`.
- Full `npm run test` still fails in 3 unrelated suites:
  - `src/problem-solver/problemSolverQualityRegression.test.ts`
  - `src/workspace/workspaceBaselineGuards.test.ts`
  - `src/workspace/workspaceQaSuite.test.ts`
- No unrelated lint/test debt was fixed as part of Phase 15.

## Route Smoke Checks

HTTP route smoke checks passed with status `200` for:

- `/visual-proofs`
- `/visual-proofs/calculus`
- all 15 Calculus routes
- `/visual-proofs/sequences-and-series`
- `/visual-proofs/geometry`
- `/visual-proofs/algebraic-identities`
- `/visual-proofs/trigonometry`
- `/visual-proofs/coordinate-geometry`
- representative upgraded routes from Calculus, Sequences, Geometry, Algebra, Trigonometry, and Coordinate Geometry.

## Known Limitations

- No Playwright/Cypress browser visual regression framework exists.
- Nonblank checks remain metadata/static and HTTP smoke checks, not browser pixel checks.
- Mobile overlap remains structurally guarded but not automatically detected.
- Phase 15 graph visuals are schematic teaching models rather than full symbolic calculus engines.
- PNG export is still not implemented.
- `VisualProofPage` category-level lazy splitting remains pending.

## Recommended Phase 16 Focus

Start Number Theory. It is the next available legacy category with strong potential for number-line, array, clock, grouping, and proof-by-structure visuals, and it would broaden Visual Proofs beyond the now-complete Calculus family.
