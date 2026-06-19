# Phase 30 Browser E2E QA Results

## Scope

Phase 30 adds a real browser smoke layer for Visual Proofs using Playwright and Chromium.

The browser suite is intentionally focused on production-preview confidence rather than full screenshot visual regression. It verifies the hub, every category page, representative proof routes, nonblank primary visuals, proof shell regions, teacher snapshot access on desktop proof routes, and dense mobile layouts at multiple viewport widths.

## Files Added Or Updated

- Added `playwright.config.ts`.
- Added `tests/visual-proofs/visualProofsSmoke.e2e.ts`.
- Added `@playwright/test` as a dev dependency in `package.json` and `package-lock.json`.
- Added `test:e2e` and `test:e2e:visual-proofs` scripts.
- Updated Phase 10 and Phase 28 metadata guards so they recognize that a browser runner now exists while continuing to require `hasVisualRegressionTest: false` until route-level coverage is explicitly mapped.
- Increased the representative lazy resolver import test timeout to keep the focused proof ladder stable under full-suite load.

## Browser Smoke Coverage

The Playwright suite covers:

- `/visual-proofs`
- all 18 Visual Proof category pages from `visualProofCategories`
- one representative proof route per category from `visualProofsRepresentativeSmokeRoutes`
- dense mobile proof routes across 320 px, 375 px, 390 px, 430 px, and 768 px widths

Representative proof checks assert:

- route returns HTTP 200
- no Vite error overlay
- no application/internal error text
- `visual-proof-shell` is visible
- `visual-proof-primary-visual` is visible
- controls, formula panel, and state inspector are visible
- teacher snapshot export control is reachable on desktop representative proof routes
- primary visual is nonblank by DOM evidence: SVG/canvas/text presence, positive bounding box, and SVG mark count when applicable

Mobile checks assert:

- dense proof shells render at each target viewport
- primary visuals are nonblank
- horizontal document overflow remains within a 4 px tolerance

Dense mobile route set:

- Riemann sums area under curve
- Parabola focus/directrix
- First-order differential equation slope field
- Linear regression least squares
- Dot product as projection
- Complex multiplication rotation/scaling
- Distance formula
- Trig graphs from unit circle

## Command Results

### Dependency Setup

`npm install -D @playwright/test`

Result: Pass. The install completed. NPM reported the existing `@capacitor/cli@8.4.0` engine warning because the current Node runtime is v20.20.0 while that package requests Node >=22. NPM also reported existing audit findings; they were not changed in this phase.

`npx playwright install chromium`

Result: Pass. Chromium and the headless shell installed successfully.

### Typecheck

`npm run typecheck`

Result: Pass.

### Build

`npm run build`

Result: Pass.

Observed Visual Proof chunk:

- `VisualProofPage-D3pG9XQ3.js`: 53.43 kB uncompressed / 11.98 kB gzip

This preserves the Phase 29 lazy-splitting improvement over the Phase 28 audit baseline of approximately 675.77 kB uncompressed / 171.96 kB gzip.

### Focused Phase 28 Test

`npm run test -- src/visual-proofs/data/visualProofsPhaseTwentyEight.test.tsx`

Result: Pass.

- 1 file passed
- 7 tests passed

### Lazy Resolver Test

`npm run test -- src/visual-proofs/proofs/loadVisualProofComponent.test.ts`

Result: Pass.

- 1 file passed
- 4 tests passed

### Focused Visual Proof Ladder

`npm run test -- src/visual-proofs/proofs/loadVisualProofComponent.test.ts src/visual-proofs/data/visualProofsPhaseTwentyEight.test.tsx src/visual-proofs/data/visualProofsPhaseTwentySeven.test.tsx src/visual-proofs/data/visualProofsPhaseTwentySix.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyFive.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyFour.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyThree.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyTwo.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyOne.test.tsx src/visual-proofs/data/visualProofsPhaseTwenty.test.tsx src/visual-proofs/data/visualProofsPhaseNineteen.test.tsx src/visual-proofs/data/visualProofsPhaseEighteen.test.tsx src/visual-proofs/data/visualProofsPhaseSeventeen.test.tsx src/visual-proofs/data/visualProofsPhaseSixteen.test.tsx src/visual-proofs/data/visualProofsPhaseFifteen.test.tsx src/visual-proofs/data/visualProofsPhaseFourteen.test.tsx src/visual-proofs/data/visualProofsPhaseThirteen.test.tsx src/visual-proofs/data/visualProofsPhaseTwelve.test.tsx src/visual-proofs/data/visualProofsPhaseEleven.test.tsx src/visual-proofs/data/visualProofsPhaseTen.test.tsx src/visual-proofs/data/visualProofsPhaseNine.test.tsx src/visual-proofs/data/visualProofsPhaseEight.test.tsx src/visual-proofs/data/visualProofsPhaseSeven.test.tsx src/visual-proofs/data/visualProofsPhaseSix.test.tsx src/visual-proofs/data/visualProofsPhaseFive.test.tsx src/visual-proofs/data/visualProofsPhaseFour.test.tsx src/visual-proofs/data/visualProofsPhaseThree.test.tsx src/visual-proofs/data/visualProofsPhaseOne.test.tsx`

Result: Pass.

- 28 files passed
- 131 tests passed

### Focused ESLint

`npx eslint --max-warnings=0 playwright.config.ts tests/visual-proofs/visualProofsSmoke.e2e.ts src/visual-proofs/data/visualProofsPhaseTwentyEight.test.tsx src/visual-proofs/data/visualProofsPhaseTen.test.tsx src/visual-proofs/proofs/loadVisualProofComponent.test.ts`

Result: Pass.

### Browser E2E Visual Proof Smoke

`npm run test:e2e:visual-proofs`

Result: Pass.

- Build passed before browser launch
- 8 Playwright tests passed in Chromium
- Production preview served at `http://127.0.0.1:4301`

Passed browser tests:

- Visual Proofs hub
- every Visual Proofs category page
- one representative proof shell and nonblank visual per category
- dense mobile routes at 320 px
- dense mobile routes at 375 px
- dense mobile routes at 390 px
- dense mobile routes at 430 px
- dense mobile routes at 768 px

### Full Repo ESLint

`npm run lint`

Result: Fail due to existing unrelated repo lint debt.

Representative failures remain in:

- `public/sw.js`
- `src/components/syllabus/ConceptVisualMedia.tsx`
- `src/data/engineeringMathBlueprint.ts`
- `src/data/formulaLibrary.ts`
- `src/pages/AdvancedSyllabusLabPage.tsx`
- `src/pages/FormulasWorkspace.tsx`
- `src/pages/MathWorkspace.tsx`
- `src/pages/ShapesExplorer.tsx`
- `src/visual-proofs/proofs/geometry/GeometryProofTemplate.tsx`
- `src/workspace/dynamicWorkspaceEngine.ts`
- `src/workspace/workspaceQaSuite.ts`

No unrelated lint debt was fixed in this phase.

### Full Repo Vitest

`npm run test`

Result: Fail due to existing unrelated repo test debt.

Current failures:

- `src/problem-solver/problemSolverQualityRegression.test.ts`: unsupported engineering recognition expectation
- `src/workspace/workspaceBaselineGuards.test.ts`: missing recoverable backup archive path
- `src/workspace/workspaceQaSuite.test.ts`: one workspace QA failure
- `src/visualizations/trigonometry/InverseTrigVisualizer.test.ts`: timeout in inverse trig graph sampling

The Visual Proof focused ladder passes.

## `hasVisualRegressionTest` Status

`hasVisualRegressionTest` remains false for Visual Proof routes.

Reason: Phase 30 establishes a real browser smoke suite, but it does not yet map pass/fail results to every individual proof route and does not run screenshot-baseline visual regression. Route-level flags should remain false until each route is covered by a documented browser visual check and that mapping is represented in metadata.

## Known Limitations

- The default browser suite is representative, not a full 183-proof route matrix.
- It performs nonblank DOM checks, not pixel-diff screenshot baseline regression.
- It currently runs Chromium only.
- Canvas pixel sampling is not yet implemented; the current nonblank check verifies canvas presence when canvas routes are encountered.
- Desktop proof smoke verifies snapshot export control reachability, but it does not execute download/copy side effects.
- Mobile checks skip snapshot export because their purpose is layout overflow and nonblank visual safety.
- Full repo lint and full repo Vitest remain blocked by unrelated debt outside the Visual Proofs Phase 30 scope.

## Recommendation

Keep the current Playwright suite as the PR-level browser smoke because it is fast enough to run locally and catches route, shell, nonblank visual, teacher snapshot control, and mobile overflow regressions.

Add a separate nightly or pre-release suite for the full 183-route Visual Proof matrix, then only flip `hasVisualRegressionTest` per route after the route has a mapped browser result and preferably screenshot or canvas-pixel evidence.
