# Visual Proofs Phase 17 QA Results

## Routes Created/Upgraded

- `/visual-proofs/probability/probability-favorable-over-total`
- `/visual-proofs/probability/complement-rule`
- `/visual-proofs/probability/addition-rule-overlapping-events`
- `/visual-proofs/probability/multiplication-rule-independent-events`
- `/visual-proofs/probability/conditional-probability`
- `/visual-proofs/probability/tree-diagram-compound-probability`
- `/visual-proofs/probability/experimental-probability-law-large-numbers`
- `/visual-proofs/probability/expected-value-long-run-average`

## Starter Route Treatment

- The old generic `/visual-proofs/probability/starter-visual-proof` placeholder is no longer generated for Probability.
- Probability is now an available category with 8 real `simulation-board` proof routes.
- The category page now lists real Probability proof cards rather than a generic coming-soon card.

## Probability Consistency Pass Results

- All 8 real Probability routes are marked `phase-upgraded`.
- All 8 Probability routes use `simulation-board` learning metadata.
- All 8 Probability routes are included in `visualProofsRouteSmokeManifest`.
- The Phase 17 routes use `VisualProofShell` through `PhaseTwoProofExperience`.
- `hasVisualRegressionTest` remains `false` because no browser visual regression suite exists.
- Metadata exposes formula-token support, prediction prompts, misconception checks, keyboard controls, state inspector, teacher mode, Olympyard exits, snapshot support, expected visual kind, and expected primary selector.

## Simulation-Board/Dragging/Controls Verified

- Favorable/total: total and favorable sliders plus a drag handle expose sample-space ratios.
- Complement: total and event-size controls expose event/complement partition.
- Addition rule: A, B, intersection, and total controls expose union correction.
- Multiplication rule: P(A) and P(B) controls plus product-grid drag handles expose independent product area.
- Conditional probability: total, B, and A-inside-B controls expose restricted sample space.
- Tree diagram: branch-probability controls expose path products and selected path sums.
- Experimental probability: p and trials controls expose deterministic browser-only frequency simulation.
- Expected value: outcome and probability controls expose weighted contribution bars.

## Keyboard Fallback Verified

- All direct manipulation parameters are mirrored in the shared shell parameter panel.
- `DraggableHandle` remains keyboard focusable with arrow-key nudges where drag handles are present.
- Previous, next, reset, labels, formula, reveal, challenge, and teacher controls remain inherited from `ProofControls`.

## Formula Highlighting Verified

- Favorable/total: `P(A)`, favorable outcomes, total outcomes, and ratio.
- Complement: `A`, `A complement`, `1`, and `1 - P(A)`.
- Addition rule: union, `P(A)`, `P(B)`, intersection, and subtract-overlap correction.
- Multiplication rule: `P(A)`, `P(B)`, product, and intersection.
- Conditional probability: `B`, `A intersection B`, `P(A|B)`, and divide by `P(B)`.
- Tree diagram: branch probability, path product, and sum of paths.
- Experimental probability: successes/trials, theoretical p, and large-number trend.
- Expected value: outcome value, probability weight, contribution, and summation.

## Prediction Prompts Verified

- Phase 17 prompts cover favorable/total probability, complement, overlap subtraction, independent products, conditional sample spaces, tree path multiplication, long-run frequency, and expected value as long-run average.

## Misconception Checks Verified

- Phase 17 checks target common false ideas around favorable-only counting, negative complements, always-adding unions, independence as impossibility, conditioning as unchanged probability, adding along tree branches, exact convergence after many trials, and expected value as a guaranteed single result.

## Snapshot JSON/SVG Export Status

- Phase 17 routes inherit versioned snapshot JSON copy/fallback through `SnapshotExportButton`.
- SVG export is available because the upgraded primary visuals are SVG-backed.
- SVG export still gracefully disables if a future proof has no SVG in the primary visual area.
- PNG export remains pending.

## Mobile Label Resilience Checks

- Phase 17 visuals use compact SVG labels and keep dense formulas in formula/state panels.
- Sample-space grids, Venn diagrams, product grids, tree diagrams, frequency charts, and contribution bars use fixed SVG viewboxes with responsive width.
- Shared Phase 10 shell guardrails still provide overflow containment, formula wrapping, responsive SVG width, and control wrapping.
- No automated mobile label-collision detector exists yet.

## Route Smoke Manifest Updates

- The route smoke manifest includes all 8 Phase 17 routes automatically through `phase-upgraded` metadata.
- All real Probability routes are present in the manifest.
- Manifest entries retain SVG primary selector expectations and snapshot/control/inspector flags.

## Typecheck, Build, And Focused Test Results

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run test -- src/visual-proofs/data/visualProofsPhaseSeventeen.test.tsx`: passed, 1 file / 5 tests.
- Phase 1 and Phase 3-17 focused proof ladder: passed, 16 files / 70 tests.

## Focused ESLint Result

- Focused ESLint on Phase 17 touched TypeScript/TSX files passed with `--max-warnings=0`.

## Full Lint/Test Unrelated Debt Status

- Full `npm run lint` failed with 83 pre-existing/unrelated repository lint problems across service worker globals, unused symbols, no-useless-escape entries, hook dependency warnings, and legacy workspace files.
- Full `npm run test` failed in 3 unrelated suites: `problemSolverQualityRegression.test.ts`, `workspaceBaselineGuards.test.ts`, and `workspaceQaSuite.test.ts`.
- No unrelated lint/test debt was fixed as part of Phase 17.

## Route Smoke Checks

Production preview HTTP route smoke passed with status 200 for:

- `/visual-proofs`
- `/visual-proofs/probability`
- all 8 Phase 17 Probability routes
- `/visual-proofs/number-theory`
- `/visual-proofs/calculus`
- `/visual-proofs/sequences-and-series`
- `/visual-proofs/geometry`
- `/visual-proofs/algebraic-identities`
- `/visual-proofs/trigonometry`
- `/visual-proofs/coordinate-geometry`
- representative already-upgraded routes from Number Theory, Calculus, Sequences, Geometry, Algebra, Trigonometry, and Coordinate Geometry.

## Known Limitations

- No Playwright/Cypress browser visual regression framework exists.
- Nonblank checks remain metadata/static and HTTP smoke checks, not browser pixel checks.
- Mobile overlap remains structurally guarded but not automatically detected.
- Phase 17 probability visuals are schematic teaching models rather than full stochastic engines.
- Simulation runs are deterministic teaching simulations, not cryptographic or statistical random generators.
- PNG export is still not implemented.
- `VisualProofPage` category-level lazy splitting remains pending.

## Recommended Phase 18 Focus

Start Statistics. It naturally follows Probability with data displays, mean/variance decomposition, distribution intuition, regression visuals, sampling variability, and confidence-interval reasoning.
