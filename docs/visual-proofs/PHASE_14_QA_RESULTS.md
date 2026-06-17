# Visual Proofs Phase 14 QA Results

## Routes Upgraded

- `/visual-proofs/calculus/limit-approaches-point`
- `/visual-proofs/calculus/derivative-slope-of-tangent`
- `/visual-proofs/calculus/secant-becomes-tangent`
- `/visual-proofs/calculus/derivative-power-rule`
- `/visual-proofs/calculus/product-rule-visual-proof`
- `/visual-proofs/calculus/chain-rule-visual-proof`
- `/visual-proofs/calculus/riemann-sums-area-under-curve`
- `/visual-proofs/calculus/definite-integral-accumulated-area`

## Calculus Partial Consistency Pass Results

- 8 of 15 available Calculus routes are now marked `phase-upgraded`.
- The 8 Phase 14 routes use `graph-limit` learning metadata.
- The 8 Phase 14 routes are included in `visualProofsRouteSmokeManifest`.
- The 8 Phase 14 routes use `VisualProofShell` through `PhaseTwoProofExperience`.
- The remaining 7 Calculus routes remain available legacy experiences:
  - `/visual-proofs/calculus/mean-value-theorem`
  - `/visual-proofs/calculus/fundamental-theorem-of-calculus`
  - `/visual-proofs/calculus/integration-by-parts-visual-proof`
  - `/visual-proofs/calculus/derivative-of-sine`
  - `/visual-proofs/calculus/derivative-of-exponential`
  - `/visual-proofs/calculus/taylor-series-approximation`
  - `/visual-proofs/calculus/optimization-derivative-max-min`
- `hasVisualRegressionTest` remains `false` because no browser visual regression suite exists.

## Shared Calculus Graph Primitives

- Shared SVG graph frame with coordinate mapping, grid, axes, compact labels, and formula-token highlighting hooks.
- Shared curve rendering for limit, derivative, secant, tangent, Riemann, and accumulated-area scenes.
- Shared secant/tangent overlays with rise, horizontal change, and limiting tangent indicators.
- Shared Riemann rectangle and signed-area slice primitives for area-under-curve experiences.
- Shared small classroom info panels so dense numeric values stay out of mobile SVG labels.

## Dragging And Controls Verified

- Limit: draggable approach point `a` and approach distance `h`.
- Derivative tangent: draggable point `a` and horizontal change `h`.
- Secant to tangent: draggable starting point `x1` and `dx`.
- Power rule: draggable input `a` and `h`, plus bounded power slider.
- Product rule: draggable `u`, `v`, `du`, and `dv` rectangle handles.
- Chain rule: draggable input `x` and small `dx` handle.
- Riemann sums: draggable interval endpoints `a` and `b`, with sliders for `n` and sampling method.
- Definite integral: draggable lower bound `a` and endpoint `b`, with slice-count slider.

## Keyboard Fallback Verified

- All direct-manipulation values are mirrored in the shared shell parameter panel.
- `DraggableHandle` remains keyboard focusable with arrow-key nudges.
- Previous, next, reset, labels, formula, reveal, challenge, and teacher controls remain inherited from `ProofControls`.

## Formula Highlighting Verified

- Limit: `x -> a`, `f(x)`, `L`, and limit approach points.
- Derivative tangent: `h`, rise, divide-by-`h`, `h -> 0`, and derivative slope.
- Secant to tangent: `delta x`, `delta y`, average slope, and instantaneous slope.
- Power rule: `x^n`, `n`, `x^(n-1)`, and `nx^(n-1)`.
- Product rule: base area `uv`, strips `u'v` and `uv'`, and tiny corner `du dv`.
- Chain rule: inner rate, outer rate, rate product, and chain derivative.
- Riemann sums: sigma sum, rectangle heights, `dx`, and `n -> infinity`.
- Definite integral: integral region, endpoints, `f(x)`, and `dx`.

## Prediction Prompts Verified

- Limit checks whether a removable hole can still have a limit.
- Derivative tangent predicts the secant approaching the tangent.
- Secant proof explains tangent as a limiting secant.
- Power rule predicts the coefficient for `x^5`.
- Product rule explains why the tiny corner disappears.
- Chain rule explains why linked rates multiply.
- Riemann sums predicts `dx` shrinking as `n` grows.
- Definite integral predicts negative contribution below the axis.

## Misconception Checks Verified

- Limit is not necessarily `f(a)`.
- Derivative is not one ordinary secant slope.
- Tangent is related to nearby secants through a limit.
- Power rule needs the exponent as coefficient.
- Product rule is not only `u'v'`.
- Chain rule uses a product of rates, not a sum.
- One rectangle is not exact curved area.
- Definite integral is signed area, not only positive area.

## Snapshot JSON/SVG Export Status

- Phase 14 routes inherit versioned snapshot JSON copy/fallback through `SnapshotExportButton`.
- SVG export is available because the upgraded primary visuals are SVG-backed.
- SVG export still gracefully disables if a future proof has no SVG in the primary visual area.
- PNG export remains pending.

## Mobile Label Resilience Checks

- Phase 14 visuals use compact SVG labels and keep dense formulas in the formula/state panels.
- Shared Phase 10 shell guardrails still provide overflow containment, formula wrapping, responsive SVG width, and control wrapping.
- No automated mobile label-collision detector exists yet.

## Route Smoke Manifest Updates

- The route smoke manifest includes all 8 Phase 14 routes automatically through `phase-upgraded` metadata.
- Manifest entries retain SVG primary selector expectations and snapshot/control/inspector flags.

## Typecheck, Build, And Focused Test Results

- `npm run typecheck`: pass after final verification.
- `npm run build`: pass after final verification.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseFourteen.test.tsx`: pass, 6 tests.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseTen.test.tsx src/visual-proofs/data/visualProofsPhaseEleven.test.tsx src/visual-proofs/data/visualProofsPhaseTwelve.test.tsx src/visual-proofs/data/visualProofsPhaseThirteen.test.tsx src/visual-proofs/data/visualProofsPhaseFourteen.test.tsx`: pass, 5 files / 29 tests.
- Phase 1 and Phase 3-14 focused proof ladder: pass, 13 files / 55 tests.
- Focused ESLint on Phase 14 touched TypeScript/TSX files: pass after final verification.

## Full Lint/Test Unrelated Debt Status

- `npm run lint`: fails on known unrelated repository lint debt, including `public/sw.js` worker globals, unused imports/values, hook dependency warnings, old no-useless-escape issues, workspace lint debt, and legacy `GeometryProofTemplate` unused `AngleArc`.
- `npm run test`: fails on 3 unrelated suites outside Visual Proofs Phase 14 scope:
  - `src/problem-solver/problemSolverQualityRegression.test.ts`
  - `src/workspace/workspaceBaselineGuards.test.ts`
  - `src/workspace/workspaceQaSuite.test.ts`
- No unrelated lint/test debt was fixed as part of Phase 14.

## Route Smoke Checks

HTTP route smoke checks passed after final verification for:

- `/visual-proofs`
- `/visual-proofs/calculus`
- all 8 Phase 14 Calculus upgraded routes
- all 7 remaining Calculus legacy routes
- `/visual-proofs/sequences-and-series`
- `/visual-proofs/geometry`
- `/visual-proofs/algebraic-identities`
- `/visual-proofs/trigonometry`
- `/visual-proofs/coordinate-geometry`
- representative upgraded routes from Sequences, Geometry, Algebra, Trigonometry, and Coordinate Geometry.

## Known Limitations

- No Playwright/Cypress browser visual regression framework exists.
- Nonblank checks remain metadata/static and HTTP smoke checks, not browser pixel checks.
- Mobile overlap remains structurally guarded but not automatically detected.
- Phase 14 graph visuals are schematic teaching models rather than full symbolic calculus engines.
- PNG export is still not implemented.
- `VisualProofPage` category-level lazy splitting remains pending.
- The seven remaining Calculus routes are still legacy.

## Recommended Phase 15 Focus

Upgrade the remaining Calculus routes. This would complete the Calculus category by extending the new graph-limit primitives into mean value theorem, fundamental theorem of calculus, integration by parts, derivative identities, Taylor approximation, and optimization.
