# Phase 31 Browser E2E QA Results

## Scope

Phase 31 adds full route-matrix browser smoke coverage for all 183 phase-upgraded Visual Proof routes while preserving the faster representative Playwright suite as the PR-level command.

This phase also adds a route-level browser coverage map. The coverage level is `nonblank-dom`, not screenshot-baseline visual regression.

## Files Added Or Updated

- Added `tests/visual-proofs/visualProofsFullMatrix.e2e.ts`.
- Added `tests/visual-proofs/visualProofsBrowserAssertions.ts`.
- Updated `tests/visual-proofs/visualProofsSmoke.e2e.ts` to reuse shared browser assertions.
- Added `src/visual-proofs/data/visualProofsBrowserCoverage.ts`.
- Added `src/visual-proofs/data/visualProofsBrowserCoverage.test.ts`.
- Updated `package.json` scripts:
  - `test:e2e` now runs the fast Visual Proofs smoke suite.
  - `test:e2e:visual-proofs` remains the fast PR-level suite.
  - `test:e2e:visual-proofs:full` runs the full 183-route matrix.

## Fast Suite

Command:

`npm run test:e2e:visual-proofs`

Purpose:

- `/visual-proofs`
- all category pages
- one representative proof route per category
- dense mobile routes at 320 px, 375 px, 390 px, 430 px, and 768 px

The fast suite remains the recommended PR-level browser smoke.

## Full Matrix Suite

Command:

`npm run test:e2e:visual-proofs:full`

Purpose:

- all 183 phase-upgraded proof routes
- desktop Chromium
- HTTP 200
- no Vite/runtime overlay
- no internal/application error text
- visible `visual-proof-shell`
- visible `visual-proof-primary-visual`
- positive primary visual bounding box
- nonblank DOM evidence
- visible controls
- visible formula panel
- visible state inspector or inspector toggle
- reachable snapshot control through teacher mode

The full suite is grouped by category to keep runtime reasonable and failures readable.

## Route-Level Browser Coverage Map

File:

`src/visual-proofs/data/visualProofsBrowserCoverage.ts`

Coverage artifact:

- one entry per phase-upgraded proof route
- 183 entries total
- derived from `visualProofsIndex`
- `coverageLevel: "nonblank-dom"`
- `browser: "chromium"`
- `testFile: "tests/visual-proofs/visualProofsFullMatrix.e2e.ts"`
- `hasSnapshotControlCheck: true`
- `hasMobileCoverage: true` only for the eight dense mobile smoke routes

`hasVisualRegressionTest` remains false. The new map documents browser smoke coverage; it does not claim screenshot-baseline visual regression.

## Command Results

### Typecheck

`npm run typecheck`

Result: Pass.

### Focused ESLint

`npx eslint --max-warnings=0 playwright.config.ts tests/visual-proofs/visualProofsBrowserAssertions.ts tests/visual-proofs/visualProofsSmoke.e2e.ts tests/visual-proofs/visualProofsFullMatrix.e2e.ts src/visual-proofs/data/visualProofsBrowserCoverage.ts src/visual-proofs/data/visualProofsBrowserCoverage.test.ts`

Result: Pass.

### Browser Coverage Metadata Test

`npm run test -- src/visual-proofs/data/visualProofsBrowserCoverage.test.ts src/visual-proofs/data/visualProofsPhaseTwentyEight.test.tsx`

Result: Pass.

- 2 files passed
- 11 tests passed

### Build

`npm run build`

Result: Pass.

Observed Visual Proof route chunk:

- `VisualProofPage-D3pG9XQ3.js`: 53.43 kB uncompressed / 11.98 kB gzip

### Fast Browser Smoke

`npx playwright test tests/visual-proofs/visualProofsSmoke.e2e.ts`

Result: Pass.

- 8 Chromium tests passed
- Runtime: about 1.8 minutes

### Full Browser Route Matrix

`npx playwright test tests/visual-proofs/visualProofsFullMatrix.e2e.ts`

Result: Pass.

- 18 Chromium category-group tests passed
- 183 proof routes covered
- Runtime: about 5.1 minutes

### Full Matrix NPM Script

`npm run test:e2e:visual-proofs:full`

Result: Pass.

- Production build passed
- 18 Chromium category-group tests passed
- 183 proof routes covered
- Runtime: about 5.0 minutes after build

## Category Matrix Results

All category groups passed:

- geometry
- algebraic-identities
- trigonometry
- coordinate-geometry
- calculus
- number-theory
- probability
- statistics
- matrices-linear-algebra
- vectors
- complex-numbers
- mensuration
- conic-sections
- inequalities
- logarithms-exponents
- transformations-symmetry
- engineering-mathematics
- sequences-and-series

## `hasVisualRegressionTest` Status

`hasVisualRegressionTest` remains false for Visual Proof routes.

Reason: Phase 31 adds mapped Chromium browser smoke coverage with nonblank DOM checks, but it still does not add screenshot-baseline or canvas-pixel visual regression evidence. The correct coverage label is `nonblank-dom`.

## Known Limitations

- Full matrix coverage is Chromium-only.
- Full matrix coverage is desktop-only.
- Mobile coverage remains limited to the eight dense routes from the fast suite.
- No screenshot baseline or pixel-diff assertions were introduced.
- Canvas routes are checked for canvas existence and nonzero size; pixel sampling remains future work.
- Snapshot control reachability is checked, but download/copy side effects are not executed.
- Full repo lint and full repo Vitest debt remain outside this phase and were not fixed.

## Recommendation

Use `npm run test:e2e:visual-proofs` for PR-level browser confidence and `npm run test:e2e:visual-proofs:full` for nightly, release-candidate, or pre-deploy validation. Keep `hasVisualRegressionTest` false until screenshot-baseline or canvas-pixel checks are added and mapped per route.
