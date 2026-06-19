# Phase 32 PNG Export QA Results

Date: 2026-06-19

## Scope

Phase 32 adds browser-only PNG export for SVG-backed Visual Proofs while preserving JSON snapshot export, SVG download export, category routing, proof routing, and existing browser smoke coverage.

The implementation does not change proof educational content, does not add dependencies, and does not claim screenshot-baseline visual regression coverage.

## Files Created

- `src/visual-proofs/utils/visualProofExportUtils.ts`
- `src/visual-proofs/utils/visualProofExportUtils.test.ts`
- `tests/visual-proofs/visualProofsExport.e2e.ts`
- `docs/visual-proofs/PHASE_32_PNG_EXPORT_QA_RESULTS.md`

## Files Modified

- `src/visual-proofs/components/SnapshotExportButton.tsx`
- `docs/visual-proofs/PNG_EXPORT_STRATEGY.md`
- `package.json`

## PNG Export Implementation

- Added shared export utilities for route slug extraction, timestamped filenames, SVG namespace handling, SVG serialization, SVG blob creation, SVG-to-PNG canvas conversion, and blob download.
- Added a PNG export action to the existing Visual Proof snapshot/export controls.
- PNG export locates the primary SVG in the configured visual area, serializes a clone, renders it through a browser `Image`, draws it to a canvas at 2x scale, and downloads the result through `canvas.toBlob("image/png")`.
- PNG export removes cloned `foreignObject` nodes before image decoding to avoid browser decode failures from embedded HTML controls. SVG export remains unchanged and preserves the original serialized SVG.
- PNG and SVG controls are disabled when the current proof has no SVG-backed primary visual.

## JSON And SVG Regression Status

- JSON snapshot copy remains available through the snapshot export control.
- SVG export remains available for SVG-backed proofs.
- Existing snapshot utility exports are re-exported from `SnapshotExportButton.tsx` for compatibility with existing focused tests.

## Browser Export Coverage

Added representative Playwright export coverage for:

- `/visual-proofs/geometry/sector-area-formula`
- `/visual-proofs/trigonometry/unit-circle-sine-cosine`
- `/visual-proofs/coordinate-geometry/distance-formula`
- `/visual-proofs/statistics/linear-regression-least-squares`
- `/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field`

Each route checks:

- route loads without browser error surface
- proof shell is visible
- primary visual is nonblank by existing browser smoke assertions
- JSON, SVG, and PNG export buttons are visible
- SVG and PNG buttons are enabled
- JSON copy status updates
- SVG download filename ends in `.svg`
- PNG download filename ends in `.png`
- SVG and PNG success status text appears

## Command Results

### Utility Tests

`npm run test -- src/visual-proofs/utils/visualProofExportUtils.test.ts`

Result: Pass.

- 1 test file passed
- 5 tests passed

### Focused Proof Ladder

`npm run test -- src/visual-proofs/utils/visualProofExportUtils.test.ts src/visual-proofs/data/visualProofsBrowserCoverage.test.ts src/visual-proofs/proofs/loadVisualProofComponent.test.ts src/visual-proofs/data/visualProofsPhaseTwentyEight.test.tsx src/visual-proofs/data/visualProofsPhaseTwentySeven.test.tsx src/visual-proofs/data/visualProofsPhaseTwentySix.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyFive.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyFour.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyThree.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyTwo.test.tsx src/visual-proofs/data/visualProofsPhaseTwentyOne.test.tsx src/visual-proofs/data/visualProofsPhaseTwenty.test.tsx src/visual-proofs/data/visualProofsPhaseNineteen.test.tsx src/visual-proofs/data/visualProofsPhaseEighteen.test.tsx src/visual-proofs/data/visualProofsPhaseSeventeen.test.tsx src/visual-proofs/data/visualProofsPhaseSixteen.test.tsx src/visual-proofs/data/visualProofsPhaseTen.test.tsx src/visual-proofs/data/visualProofsPhaseOne.test.tsx`

Result: Pass.

- 30 test files passed
- 140 tests passed

### Focused ESLint

`npx eslint --max-warnings=0 src/visual-proofs/components/SnapshotExportButton.tsx src/visual-proofs/utils/visualProofExportUtils.ts src/visual-proofs/utils/visualProofExportUtils.test.ts tests/visual-proofs/visualProofsExport.e2e.ts tests/visual-proofs/visualProofsBrowserAssertions.ts tests/visual-proofs/visualProofsSmoke.e2e.ts tests/visual-proofs/visualProofsFullMatrix.e2e.ts`

Result: Pass.

### Typecheck

`npm run typecheck`

Result: Pass.

### Build

`npm run build`

Result: Pass.

Observed Visual Proof route chunk:

- `VisualProofPage-CFYah6up.js`: 53.43 kB uncompressed / 11.98 kB gzip

### Playwright Export Test

`npm run test:e2e:visual-proofs:export`

Result: Pass.

- production build passed
- 5 Chromium export tests passed

### Fast Browser Smoke

`npm run test:e2e:visual-proofs`

Result: Pass.

- production build passed
- 8 Chromium smoke tests passed
- covered Visual Proofs hub, all category pages, representative proof routes, and dense mobile widths

### Full Browser Route Matrix

`npm run test:e2e:visual-proofs:full`

Result: Pass.

- production build passed
- 18 Chromium category-group tests passed
- all 183 phase-upgraded proof routes covered

### Full Repo Lint

`npm run lint`

Result: Fail due to unrelated existing repository debt.

- 83 problems
- 71 errors
- 12 warnings
- Phase 32 export files were not listed in the repo-wide lint failures

Failing areas include:

- `public/sw.js`
- `src/components/syllabus/ConceptVisualMedia.tsx`
- `src/components/workspace/InspectorPanel.tsx`
- `src/components/workspace/ObjectList.tsx`
- `src/data/engineeringMathBlueprint.ts`
- `src/data/formulaLibrary.ts`
- `src/pages/AdvancedSyllabusLabPage.tsx`
- `src/pages/FormulasWorkspace.tsx`
- `src/pages/MathWorkspace.tsx`
- `src/pages/ShapesExplorer.tsx`
- `src/visual-proofs/proofs/geometry/GeometryProofTemplate.tsx`
- `src/workspace/dynamicWorkspaceEngine.ts`
- `src/workspace/workspaceQaSuite.ts`

### Full Repo Test

`npm run test`

Result: Fail due to unrelated existing repository debt.

- 3 failed test files
- 106 passed test files
- 3 failed tests
- 716 passed tests

Failing tests:

- `src/problem-solver/problemSolverQualityRegression.test.ts`: expected unsupported classification, received `word-problem`
- `src/workspace/workspaceBaselineGuards.test.ts`: expected backup archive to exist
- `src/workspace/workspaceQaSuite.test.ts`: expected `report.failed` to be 0, received 1

## `hasVisualRegressionTest` Status

`hasVisualRegressionTest` remains false.

Reason: Phase 32 adds export side-effect coverage and existing nonblank DOM smoke checks, but it does not add screenshot-baseline comparison, PNG pixel sampling, or canvas-pixel regression checks.

## Known Limitations

- PNG export is SVG-backed only.
- PNG export omits cloned `foreignObject` HTML controls to keep browser image decoding reliable.
- PNG export does not capture the full proof shell, side panels, or teacher notes.
- PNG export is browser-only and depends on native image/canvas APIs.
- Export tests validate download behavior and filenames but do not yet pixel-sample the downloaded PNG.
- Dark/light deterministic export comparison remains future work.
- Full repo lint/test debt is documented only and remains outside this phase.

## Recommendation

Phase 33 should add automated PNG artifact inspection: save downloaded PNGs in Playwright, read their dimensions and MIME signature, and add lightweight nonblank pixel sampling for representative exports. This would upgrade PNG export from behavior-tested to artifact-tested without changing proof content.
