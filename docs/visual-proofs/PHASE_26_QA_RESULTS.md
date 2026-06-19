# Phase 26 QA Results - Transformations and Symmetry

Date: 2026-06-18

## Routes Created / Upgraded

Phase 26 replaced the generic Transformations and Symmetry coming-soon surface with eight real `phase-upgraded` proof routes:

- `/visual-proofs/transformations-symmetry/translation-sliding-vector`
- `/visual-proofs/transformations-symmetry/reflection-mirror-line`
- `/visual-proofs/transformations-symmetry/rotation-about-point`
- `/visual-proofs/transformations-symmetry/dilation-similarity-scale-factor`
- `/visual-proofs/transformations-symmetry/congruence-rigid-motions`
- `/visual-proofs/transformations-symmetry/line-rotational-symmetry`
- `/visual-proofs/transformations-symmetry/tessellations-repeated-transformations`
- `/visual-proofs/transformations-symmetry/transformation-matrices-2d`

## Starter Route Treatment

- The previous generated Transformations and Symmetry `starter-visual-proof` entry is no longer part of the Visual Proofs index.
- The Transformations and Symmetry category now lists eight available real routes.
- Production-preview HTTP fallback still returns the SPA shell for `/visual-proofs/transformations-symmetry/starter-visual-proof`, but the route is not registered as a proof and is not a category card.

## Consistency Pass Results

- Category status: available.
- Category proof count: 8.
- All eight real routes use `proofUpgradeStatus: "phase-upgraded"`.
- All eight real routes use `proofLearningModel: "transformation-grid"`.
- All eight real routes have formula tokens, prediction prompts, misconception checks, keyboard controls, state inspector metadata, teacher mode metadata, Olympyard practice exits, and snapshot support.
- `hasVisualRegressionTest` remains false because no Playwright/Cypress browser visual regression suite is configured.

## Transformation-Grid / Shape-Control Behavior Verified

- Translation exposes preimage, image, shared vector arrows, vector handle, and coordinate/vector fallback controls.
- Reflection exposes mirror line selection, reflected image, equal-distance guides, and coordinate fallback controls.
- Rotation exposes draggable center, angle controls, rotation arcs, and preserved-radius indicators.
- Dilation exposes center handle, scale-factor control, dilation rays, and side-ratio state values.
- Congruence exposes a rigid-motion sequence model for translation, rotation, reflection, and overlay.
- Symmetry exposes selectable shapes, symmetry lines, rotation-angle testing, line counts, and rotational order.
- Tessellation exposes tile, repeat mode, spacing controls, gap/overlap status, and vertex angle fit.
- Matrix transformations expose matrix selection, basis vectors, determinant, area scale, orientation, and transformed shape.

## Keyboard Fallback Verified

- Phase 26 uses the shared `PhaseTwoProofExperience` parameter panel, so every draggable or selectable state also has bounded slider/stepper keyboard-accessible fallback controls.
- Focused metadata tests verify `hasKeyboardControls` for all eight routes.

## Formula Highlighting Verified

- Phase 26 configs include route-specific formula tokens for vectors, mirror lines, rotation centers, scale factors, rigid motions, symmetry axes, tile conditions, basis vectors, determinants, and coordinate rules.
- Focused tests verify each route exposes its expected token IDs.

## Prediction Prompts Verified

- Each Phase 26 config includes a prediction prompt with a correct answer option.
- Focused tests verify prompt presence and correctness metadata for all eight configs.

## Misconception Checks Verified

- Each Phase 26 route includes a targeted misconception check:
  - translation changes size
  - reflection preserves orientation
  - rotation changes size
  - dilation adds instead of multiplies
  - congruent shapes must start in the same position
  - all shapes have the same symmetry counts
  - any repeated shape tessellates
  - a matrix transforms only one point
- Focused tests verify misconception metadata for all eight configs.

## Snapshot JSON / SVG Export Status

- Snapshot JSON support is inherited through `PhaseTwoProofExperience` and `SnapshotExportButton`.
- All eight Phase 26 proofs are SVG-backed and report `expectedVisualKind: "svg"`.
- SVG export is available through the existing SVG snapshot path.
- PNG export remains unimplemented.

## Mobile Label Resilience Checks

- Phase 26 visual models use bounded coordinate ranges, compact SVG viewBox layout, optional label toggles, and small state panels inside the SVG scene.
- Automated mobile label collision detection is still not implemented.
- No browser visual connector check was attempted in this phase.

## Route Smoke Manifest Updates

- `visualProofsRouteSmokeManifest` is generated from `visualProofsIndex`.
- All eight Phase 26 routes are included automatically because they are `phase-upgraded`.
- Focused tests verify manifest inclusion.

## Automated Results

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseTwentySix.test.tsx`: passed, 1 file / 5 tests.
- Phase 1 and Phase 3-26 focused proof ladder: passed, 25 files / 115 tests.
- Focused ESLint on Phase 26 touched TS/TSX files: passed with `--max-warnings=0`.

## Production Preview Route Smoke

Preview command used:

```bash
npm run preview -- --host 127.0.0.1 --port 4192
```

All requested routes returned HTTP 200:

- `/visual-proofs`
- `/visual-proofs/transformations-symmetry`
- all eight Phase 26 Transformations and Symmetry routes
- `/visual-proofs/transformations-symmetry/starter-visual-proof` as SPA fallback, not registered proof metadata
- all requested already-upgraded category pages
- all requested representative already-upgraded proof routes

## Full Lint / Test Debt Status

Full repo lint still fails due to unrelated existing debt:

- `npm run lint`: failed with 83 problems, 71 errors and 12 warnings.
- Failures remain in unrelated files such as `public/sw.js`, `src/pages/MathWorkspace.tsx`, `src/data/formulaLibrary.ts`, workspace modules, and other non-Phase-26 areas.

Full repo tests still fail due to unrelated existing suites:

- `npm run test`: failed with 3 failed suites / 101 passed suites.
- Test total: 3 failed / 691 passed / 694 total.
- Failing suites:
  - `src/problem-solver/problemSolverQualityRegression.test.ts`
  - `src/workspace/workspaceBaselineGuards.test.ts`
  - `src/workspace/workspaceQaSuite.test.ts`

## Browser Visual Connector Status

- Browser visual connector was not attempted for Phase 26.
- Production preview HTTP smoke was completed instead.
- No Playwright/Cypress visual regression framework is configured.

## Known Limitations

- PNG export is still not implemented.
- Automated nonblank SVG/canvas checks are still pending.
- Automated mobile label collision detection is still pending.
- `VisualProofPage` remains large; category-level lazy splitting is still pending.
- The starter URL returns the SPA fallback in production preview even though it is no longer registered as a proof route.
- Full repo lint/test failures remain outside Phase 26 scope.

## Recommended Phase 27 Focus

Phase 27 should upgrade Engineering Mathematics into real applied-system visual proofs, because it is now the only remaining generated coming-soon Visual Proofs category. It should also include a small architecture pass for `VisualProofPage` lazy splitting, since the page chunk continues to grow as each category becomes real.
