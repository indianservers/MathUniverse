# Phase 33 PNG Artifact QA Results

Date: 2026-06-19

## Scope

Phase 33 upgrades Visual Proof PNG export QA from behavior-tested to artifact-tested. The export test now saves downloaded PNG files, validates PNG file structure, checks expected dimensions, and performs lightweight nonblank pixel sampling through browser canvas APIs.

This phase does not change educational proof content, proof routing, category routing, visual design, JSON export UX, SVG export UX, or PNG export UX.

## Files Created

- `docs/visual-proofs/PHASE_33_PNG_ARTIFACT_QA_RESULTS.md`

## Files Modified

- `tests/visual-proofs/visualProofsExport.e2e.ts`

## PNG Artifact Validation Strategy

The existing representative Playwright export suite was extended instead of replaced. Each route still validates JSON copy behavior, SVG download behavior, PNG download behavior, and export status text.

The PNG artifact path now adds:

- save downloaded PNG to Playwright test output
- assert suggested filename ends with `.png`
- assert saved file exists through filesystem `stat`
- assert saved file size is greater than 1,000 bytes
- parse the first 8 bytes and verify the PNG signature: `89 50 4E 47 0D 0A 1A 0A`
- parse the IHDR chunk
- assert IHDR width and height are both greater than zero
- assert IHDR dimensions are not unexpectedly tiny
- compare IHDR dimensions against the current SVG bounding box at expected 2x export scaling
- load the saved PNG back into the browser as a data URL
- draw it to a canvas
- sample pixels across the canvas
- assert visible samples exist
- assert more than one visible color is present

The nonblank sampling fails for empty PNGs, transparent-only PNGs, and plain single-color blank PNGs.

## Routes Covered

- `/visual-proofs/geometry/sector-area-formula`
- `/visual-proofs/trigonometry/unit-circle-sine-cosine`
- `/visual-proofs/coordinate-geometry/distance-formula`
- `/visual-proofs/statistics/linear-regression-least-squares`
- `/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field`

## Validated Fields

- download filename
- file existence
- file size
- PNG signature
- IHDR dimensions
- 2x SVG-to-PNG export dimensions
- nonblank visible pixel/content variation

## Command Results

### Focused ESLint

`npx eslint --max-warnings=0 tests/visual-proofs/visualProofsExport.e2e.ts`

Result: Pass.

### PNG Export Artifact E2E

`npm run test:e2e:visual-proofs:export`

Result: Pass.

- production build passed
- 5 Chromium export tests passed
- JSON copy regression checks passed
- SVG download regression checks passed
- PNG download behavior checks passed
- PNG artifact signature, IHDR, dimension, and nonblank pixel checks passed

Note: the first attempt timed out while an orphaned Vite build process was still running. That timed-out build process was stopped and the command was rerun with a longer timeout. The rerun passed.

### Typecheck

`npm run typecheck`

Result: Pass.

### Build

`npm run build`

Result: Pass.

Observed Visual Proof route chunk:

- `VisualProofPage-CFYah6up.js`: 53.43 kB uncompressed / 11.98 kB gzip

### Fast Browser Smoke

`npm run test:e2e:visual-proofs`

Result: Pass.

- production build passed
- 8 Chromium smoke tests passed
- covered Visual Proofs hub, all category pages, representative proof routes, and dense mobile widths

## Unit Test Status

No separate Node unit test was added because the PNG parser is intentionally tiny and scoped to the Playwright artifact test. The parser validates PNG signature and IHDR in the same test that saves real browser-exported artifacts.

## `hasVisualRegressionTest` Status

`hasVisualRegressionTest` should remain false.

Reason: Phase 33 adds artifact-level PNG integrity and nonblank sampling, but it still does not implement screenshot-baseline comparison or pixel-diff visual regression against an approved golden image. This is stronger export QA, not full visual regression coverage.

## Known Limitations

- PNG artifact validation is representative-route coverage, not all 183 Visual Proof routes.
- Pixel sampling checks that the PNG is decoded and visibly varied; it does not verify mathematical visual correctness against a baseline.
- The test uses Chromium only, matching the current Playwright project.
- PNG export remains SVG-backed only.
- Full repo lint/test debt was not rerun or fixed because Phase 33 did not touch unrelated areas.

## Recommendation

The next export QA phase should either extend artifact inspection to the full route matrix or introduce a small approved-baseline set for true screenshot or PNG visual regression. Keep the baseline set small at first so maintenance stays sane.
