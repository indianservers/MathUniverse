# Visual Proofs Phase 18 QA Results

## Routes Created/Upgraded

- `/visual-proofs/statistics/mean-as-balance-point`
- `/visual-proofs/statistics/median-and-quartiles`
- `/visual-proofs/statistics/variance-standard-deviation`
- `/visual-proofs/statistics/histogram-frequency-distribution`
- `/visual-proofs/statistics/sampling-distribution-mean`
- `/visual-proofs/statistics/normal-distribution-empirical-rule`
- `/visual-proofs/statistics/correlation-scatterplot`
- `/visual-proofs/statistics/linear-regression-least-squares`

## Starter Route Treatment

- The old generic `/visual-proofs/statistics/starter-visual-proof` placeholder is no longer generated for Statistics.
- Statistics is now an available category with 8 real `data-display` proof routes.
- The category page now lists real Statistics proof cards rather than a generic coming-soon card.

## Statistics Consistency Pass Results

- All 8 real Statistics routes are marked `phase-upgraded`.
- All 8 Statistics routes use `data-display` learning metadata.
- All 8 Statistics routes are included in `visualProofsRouteSmokeManifest`.
- The Phase 18 routes use `VisualProofShell` through `PhaseTwoProofExperience`.
- `hasVisualRegressionTest` remains `false` because no browser visual regression suite exists.
- Metadata exposes formula-token support, prediction prompts, misconception checks, keyboard controls, state inspector, teacher mode, Olympyard exits, snapshot support, expected visual kind, and expected primary selector.

## Data-Display/Dragging/Controls Verified

- Mean: six data-point controls plus a drag handle expose mean balance and signed deviations.
- Median/quartiles: six data-point controls plus a drag handle expose sorting, quartiles, IQR, and boxplot construction.
- Variance/standard deviation: data controls plus a drag handle expose deviations, squared deviations, variance, and standard deviation.
- Histogram: data controls plus bin-count control expose bin width, frequencies, and frequency-total invariant.
- Sampling distribution: sample-size and sample-count controls expose repeated sample means and sampling spread.
- Normal empirical rule: mean and sigma controls plus drag handles expose curve center, spread, and empirical-rule intervals.
- Correlation: r and noise controls expose trend direction, strength, and spread.
- Regression: slope/intercept controls plus a slope drag handle expose residuals, squared-error bars, and least-squares comparison.

## Keyboard Fallback Verified

- All direct manipulation parameters are mirrored in the shared shell parameter panel.
- `DraggableHandle` remains keyboard focusable with arrow-key nudges where drag handles are present.
- Previous, next, reset, labels, formula, reveal, challenge, and teacher controls remain inherited from `ProofControls`.

## Formula Highlighting Verified

- Mean: `sum x_i`, `n`, mean, and deviations.
- Median/quartiles: median, Q1, Q3, and IQR.
- Variance/standard deviation: `x_i - mu`, squared term, sum, `/n`, and square root.
- Histogram: bin, frequency, and data count.
- Sampling distribution: sample mean, population mean, and sample size n.
- Normal empirical rule: mu, sigma, 68%, 95%, and 99.7%.
- Correlation: r, trend line, and spread around line.
- Regression: residual, residual squared, sum of residual squared, and least squares.

## Prediction Prompts Verified

- Phase 18 prompts cover mean sensitivity, sorting before median, spread and standard deviation, histogram frequency totals, sample-size effects, sigma and bell-curve width, negative correlation direction, and why residuals are squared.

## Misconception Checks Verified

- Phase 18 checks target common false ideas around mean as an observed value, median as arithmetic average, standard deviation as average unsquared distance, histogram bars as exact data values, identical sample means, empirical rule applying to all distributions, correlation proving causation, and best-fit lines passing through every point.

## Snapshot JSON/SVG Export Status

- Phase 18 routes inherit versioned snapshot JSON copy/fallback through `SnapshotExportButton`.
- SVG export is available because the upgraded primary visuals are SVG-backed.
- SVG export still gracefully disables if a future proof has no SVG in the primary visual area.
- PNG export remains pending.

## Mobile Label Resilience Checks

- Phase 18 visuals use compact SVG labels and keep dense formulas in formula/state panels.
- Dot plots, boxplots, deviation displays, histograms, sampling distributions, normal curves, scatterplots, and regression residual plots use fixed SVG viewboxes with responsive width.
- Shared Phase 10 shell guardrails still provide overflow containment, formula wrapping, responsive SVG width, and control wrapping.
- No automated mobile label-collision detector exists yet.

## Route Smoke Manifest Updates

- The route smoke manifest includes all 8 Phase 18 routes automatically through `phase-upgraded` metadata.
- All real Statistics routes are present in the manifest.
- Manifest entries retain SVG primary selector expectations and snapshot/control/inspector flags.

## Typecheck, Build, And Focused Test Results

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseEighteen.test.tsx`: passed, 1 file / 5 tests.
- Phase 1 and Phase 3-18 focused proof ladder: passed, 17 files / 75 tests.

## Focused ESLint Result

- Focused ESLint on Phase 18 touched TypeScript/TSX files passed with `--max-warnings=0`.

## Full Lint/Test Unrelated Debt Status

- Full `npm run lint` failed with 83 pre-existing/unrelated repository lint problems across service worker globals, unused symbols, no-useless-escape entries, hook dependency warnings, and legacy workspace files.
- Full `npm run test` failed in 3 unrelated suites: `problemSolverQualityRegression.test.ts`, `workspaceBaselineGuards.test.ts`, and `workspaceQaSuite.test.ts`.
- No unrelated lint/test debt was fixed as part of Phase 18.

## Route Smoke Checks

Production preview HTTP route smoke passed with status 200 for:

- `/visual-proofs`
- `/visual-proofs/statistics`
- all 8 Phase 18 Statistics routes
- `/visual-proofs/probability`
- `/visual-proofs/number-theory`
- `/visual-proofs/calculus`
- `/visual-proofs/sequences-and-series`
- `/visual-proofs/geometry`
- `/visual-proofs/algebraic-identities`
- `/visual-proofs/trigonometry`
- `/visual-proofs/coordinate-geometry`
- representative already-upgraded routes from Probability, Number Theory, Calculus, Sequences, Geometry, Algebra, Trigonometry, and Coordinate Geometry.

## Known Limitations

- No Playwright/Cypress browser visual regression framework exists.
- Nonblank checks remain metadata/static and HTTP smoke checks, not browser pixel checks.
- Mobile overlap remains structurally guarded but not automatically detected.
- Phase 18 statistics visuals are schematic teaching models rather than exhaustive statistical engines.
- Sampling displays are deterministic teaching simulations, not statistical random generators.
- PNG export is still not implemented.
- `VisualProofPage` category-level lazy splitting remains pending.

## Recommended Phase 19 Focus

Start Matrices and Linear Algebra. It is the next high-impact legacy category where tile models, grids, transformations, determinants, eigenvectors, and linear-system geometry can extend the premium shell into foundational engineering mathematics.
