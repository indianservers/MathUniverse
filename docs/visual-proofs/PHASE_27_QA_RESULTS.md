# Phase 27 QA Results - Engineering Mathematics

Date: 2026-06-18

## Routes Created / Upgraded

Phase 27 replaced the final generated Engineering Mathematics coming-soon category with eight real `phase-upgraded` applied-system proof routes:

- `/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field`
- `/visual-proofs/engineering-mathematics/simple-harmonic-motion`
- `/visual-proofs/engineering-mathematics/fourier-series-wave-building`
- `/visual-proofs/engineering-mathematics/laplace-transform-decay-system`
- `/visual-proofs/engineering-mathematics/gradient-steepest-increase`
- `/visual-proofs/engineering-mathematics/divergence-curl-vector-field`
- `/visual-proofs/engineering-mathematics/trapezoidal-rule-numerical-integration`
- `/visual-proofs/engineering-mathematics/linear-programming-feasible-region`

## Starter Route Treatment

- The previous generated Engineering Mathematics `starter-visual-proof` entry is no longer part of the Visual Proofs index.
- Engineering Mathematics now lists eight available real routes.
- Production-preview HTTP fallback still returns the SPA shell for `/visual-proofs/engineering-mathematics/starter-visual-proof`, but the route is not registered as a proof and is not shown as a category card.

## Engineering Mathematics Consistency Pass

- Category status: available.
- Category proof count: 8.
- All eight real routes use `proofUpgradeStatus: "phase-upgraded"`.
- All eight real routes use `proofLearningModel: "applied-system"`.
- All eight routes have formula tokens, prediction prompts, misconception checks, keyboard controls, state inspector metadata, teacher mode metadata, Olympyard practice exits, and snapshot support.
- `hasVisualRegressionTest` remains false because no Playwright/Cypress browser visual regression suite is configured.
- All Visual Proofs categories are now real available categories; no generated coming-soon Visual Proofs category remains.

## Applied-System / Graph / Vector Controls Verified

- Slope field exposes equation preset, draggable initial condition, step size, local tangent slope, and approximate solution curve.
- Simple harmonic motion exposes amplitude, angular frequency, phase, time, oscillator displacement, cosine graph, period, and range.
- Fourier series exposes target wave, harmonic count, selected time, harmonic bars, partial sum, target comparison, and approximation error.
- Laplace decay exposes decay rate, selected time, selected s value, time-domain curve, and s-domain expression panel.
- Gradient exposes draggable contour point, gradient vector, selected direction, directional derivative, and contour map.
- Divergence/curl exposes field preset, draggable test region, vector field, divergence/curl values, and source/sink/rotation status.
- Trapezoidal rule exposes function preset, interval endpoints, subinterval count, trapezoids, approximation, reference area, and error.
- Linear programming exposes constraints, feasible polygon, objective coefficients, objective level, vertex values, and optimum vertex.
- Every Phase 27 visual includes an explicit top-of-scene line beginning with `Showing...` so learners know exactly what the grid/graph is currently displaying.

## Keyboard Fallback Verified

- Phase 27 uses the shared `PhaseTwoProofExperience` parameter panel, so draggable or visual state changes have bounded slider/stepper keyboard-accessible fallback controls.
- Focused metadata tests verify `hasKeyboardControls` for all eight routes.

## Formula Highlighting Verified

- Phase 27 configs include route-specific formula tokens for slope fields, oscillation parameters, harmonics, Laplace transform pieces, gradient components, div/curl terms, trapezoid coefficients, constraints, objective lines, and vertices.
- Focused tests verify each route exposes its expected token IDs.

## Prediction Prompts Verified

- Each Phase 27 config includes a prediction prompt with a correct answer option.
- Focused tests verify prompt presence and correctness metadata for all eight configs.

## Misconception Checks Verified

- Each Phase 27 route includes a targeted misconception check:
  - slope field as one single solution curve
  - amplitude changing period
  - Fourier series as one sine wave only
  - Laplace as merely another time graph
  - gradient along a contour
  - divergence and curl as the same concept
  - trapezoidal rule always exact
  - optimum in the middle of the feasible region
- Focused tests verify misconception metadata for all eight configs.

## Snapshot JSON / SVG Export Status

- Snapshot JSON support is inherited through `PhaseTwoProofExperience` and `SnapshotExportButton`.
- All eight Phase 27 proofs are SVG-backed and report `expectedVisualKind: "svg"`.
- SVG export is available through the existing SVG snapshot path.
- PNG export remains unimplemented.

## Mobile Label Resilience Checks

- Phase 27 visual models use bounded parameter ranges, responsive SVG viewBox layout, optional label toggles, compact scene headers, and compact state panels.
- Automated mobile label collision detection is still not implemented.
- No browser visual connector check was attempted in this phase.

## Route Smoke Manifest Updates

- `visualProofsRouteSmokeManifest` is generated from `visualProofsIndex`.
- All eight Phase 27 routes are included automatically because they are `phase-upgraded`.
- Focused tests verify manifest inclusion.

## VisualProofPage Lazy-Splitting Review

- Reviewed the current `VisualProofPage` structure.
- The page currently imports and switches over all proof components directly, including many prior phase additions.
- Build output shows `VisualProofPage` remains a large route chunk: about 675.77 kB uncompressed, 171.96 kB gzip in this build.
- Category-level lazy splitting was not implemented in Phase 27 because it would require a broader route-component resolver refactor across all phase-upgraded categories and should have its own verification pass.
- Recommended next architecture work: create a dedicated Phase 28 refactor to introduce a typed component-loader map by category, preserve direct URL behavior, and add resolver tests before changing runtime routing.

## Automated Results

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseTwentySeven.test.tsx`: passed, 1 file / 5 tests.
- Phase 1 and Phase 3-27 focused proof ladder: passed, 26 files / 120 tests.
- Focused ESLint on Phase 27 touched TS/TSX files: passed with `--max-warnings=0`.

## Production Preview Route Smoke

Preview command used:

```bash
npm run preview -- --host 127.0.0.1 --port 4193
```

All requested routes returned HTTP 200:

- `/visual-proofs`
- `/visual-proofs/engineering-mathematics`
- all eight Phase 27 Engineering Mathematics routes
- `/visual-proofs/engineering-mathematics/starter-visual-proof` as SPA fallback, not registered proof metadata
- all requested already-upgraded category pages
- all requested representative already-upgraded proof routes

## Full Lint / Test Debt Status

Full repo lint still fails due to unrelated existing debt:

- `npm run lint`: failed with 83 problems, 71 errors and 12 warnings.
- Failures remain in unrelated files such as `public/sw.js`, `src/pages/MathWorkspace.tsx`, `src/data/formulaLibrary.ts`, workspace modules, and other non-Phase-27 areas.

Full repo tests still fail due to unrelated existing suites:

- `npm run test`: failed with 3 failed suites / 102 passed suites.
- Test total: 3 failed / 696 passed / 699 total.
- Failing suites:
  - `src/problem-solver/problemSolverQualityRegression.test.ts`
  - `src/workspace/workspaceBaselineGuards.test.ts`
  - `src/workspace/workspaceQaSuite.test.ts`

## Browser Visual Connector Status

- Browser visual connector was not attempted for Phase 27.
- Production preview HTTP smoke was completed instead.
- No Playwright/Cypress visual regression framework is configured.

## Known Limitations

- PNG export is still not implemented.
- Automated nonblank SVG/canvas checks are still pending.
- Automated mobile label collision detection is still pending.
- `VisualProofPage` category-level lazy splitting remains pending.
- The old starter URL returns the SPA fallback in production preview even though it is no longer registered as a proof route.
- Full repo lint/test failures remain outside Phase 27 scope.

## Recommended Phase 28 / Final Focus

Phase 28 should be a focused architecture and QA hardening phase:

- implement typed category-level lazy splitting for `VisualProofPage`
- add browser E2E route smoke with nonblank SVG checks
- add mobile label collision checks
- add PNG export if product-priority remains high
- create a final all-categories readiness audit now that every Visual Proofs category is real and available
