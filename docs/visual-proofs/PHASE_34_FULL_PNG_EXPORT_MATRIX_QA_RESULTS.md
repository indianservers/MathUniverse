# Phase 34 Full PNG Export Matrix QA Results

Date: 2026-06-19

## Scope

Phase 34 extends Phase 33 PNG artifact validation from the representative export set to the full SVG-backed Visual Proof route matrix.

The phase preserves proof educational content, proof routing, category routing, visual design, JSON export UX, SVG export UX, and PNG export UX. It only expands browser export reliability coverage and extracts the PNG artifact assertions into shared Playwright test helpers.

## Files Created

- `tests/visual-proofs/visualProofsExportAssertions.ts`
- `tests/visual-proofs/visualProofsExportFullMatrix.e2e.ts`
- `docs/visual-proofs/PHASE_34_FULL_PNG_EXPORT_MATRIX_QA_RESULTS.md`

## Files Modified

- `package.json`
- `tests/visual-proofs/visualProofsExport.e2e.ts`

## Full Matrix Selection Strategy

The full matrix test imports `visualProofsRouteSmokeManifest` and selects every route whose `expectedVisualKind` is `svg`.

Current Phase 28 metadata pins:

- total phase-upgraded Visual Proof routes: 183
- SVG-backed phase-upgraded routes: 183
- non-SVG or PNG-disabled routes in this matrix: 0
- categories covered: 18

The suite groups routes by category so failures identify the category and route while keeping the Playwright report readable.

## Artifact Checks Per Route

For each SVG-backed route, the full matrix test verifies:

- route loads through production preview
- browser error surface is absent
- Visual Proof shell renders
- primary visual is nonblank at DOM/SVG level
- SVG export button is visible and enabled
- PNG export button is visible and enabled
- PNG download completes
- export status reports PNG success
- suggested filename ends with `.png`
- downloaded file exists in Playwright output
- file size is greater than 1,000 bytes
- PNG signature is valid
- IHDR width and height are parsed and non-tiny
- IHDR dimensions match the current SVG bounding box at expected 2x export scale within a 2 px tolerance
- PNG decodes in the browser
- browser canvas sampling finds visible pixels
- sampled pixels contain more than one visible color

These checks catch empty downloads, non-PNG downloads, transparent-only PNGs, unexpectedly tiny exports, and single-color blank PNGs.

## Command Results

### Focused ESLint

`npx eslint --max-warnings=0 tests/visual-proofs/visualProofsExport.e2e.ts tests/visual-proofs/visualProofsExportFullMatrix.e2e.ts tests/visual-proofs/visualProofsExportAssertions.ts`

Result: Pass.

### Representative PNG Export Artifact E2E

`npm run test:e2e:visual-proofs:export`

Result: Pass.

- production build passed
- 5 Chromium representative export tests passed
- JSON copy checks passed
- SVG download checks passed
- PNG artifact signature, IHDR, 2x SVG dimension, and nonblank pixel checks passed

### Full PNG Export Artifact Matrix E2E

`npm run test:e2e:visual-proofs:export:full`

Result: Pass.

- production build passed
- 18 Chromium category-group tests passed
- 183 SVG-backed phase-upgraded routes validated
- all PNG artifact checks passed

Observed category group runtimes:

- geometry: 42.6s
- algebraic-identities: 18.3s
- trigonometry: 1.6m
- coordinate-geometry: 1.4m
- calculus: 22.1s
- number-theory: 18.4s
- probability: 12.0s
- statistics: 12.2s
- matrices-linear-algebra: 11.8s
- vectors: 12.3s
- complex-numbers: 13.0s
- mensuration: 53.8s
- conic-sections: 13.2s
- inequalities: 12.7s
- logarithms-exponents: 15.4s
- transformations-symmetry: 15.4s
- engineering-mathematics: 14.3s
- sequences-and-series: 26.5s

Playwright runtime after build: 18 tests passed in 8.3m.

### Typecheck

`npm run typecheck`

Result: Pass.

### Build

`npm run build`

Result: Pass.

Observed Visual Proof route chunk:

- `VisualProofPage-CFYah6up.js`: 53.43 kB uncompressed / 11.98 kB gzip

### Broader Visual Proofs Browser Smoke

`npm run test:e2e:visual-proofs`

Result: Pass.

- production build passed
- 8 Chromium smoke tests passed
- covered Visual Proofs hub
- covered all category pages
- covered representative proof shells and nonblank visuals per category
- covered dense mobile widths at 320px, 375px, 390px, 430px, and 768px

## `hasVisualRegressionTest` Status

`hasVisualRegressionTest` remains false.

Reason: Phase 34 validates exported PNG artifacts across the full route matrix, but it does not compare screenshots or exported PNGs against approved golden baselines. This is export integrity and nonblank artifact QA, not full visual regression testing.

## Known Limitations

- The full matrix currently targets Chromium only, matching the existing Playwright project.
- The matrix validates SVG-backed PNG export only.
- Pixel sampling proves decoded visible variation, not mathematical correctness against a visual baseline.
- The test is intentionally slower than the representative export suite because it downloads and inspects PNG artifacts for all 183 SVG-backed routes.
- Full repo lint/test debt was not run or fixed because this phase only touched Visual Proof export QA files.

## Recommendation

Keep the representative export suite as the fast default gate and use `npm run test:e2e:visual-proofs:export:full` as the release-confidence gate for Visual Proof export changes. The next export reliability phase should add a small approved-baseline visual regression set for the highest-value proofs instead of marking all routes as visual-regression covered.
