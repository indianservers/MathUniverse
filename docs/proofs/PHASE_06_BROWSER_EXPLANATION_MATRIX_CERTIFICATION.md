# Phase 6 Browser Explanation Matrix Certification

## Scope

Phase 6 expands proof explanation certification from one flagship browser journey to a representative matrix across the main teaching modes:

- Geometry
- Trigonometry
- Coordinate Geometry
- Calculus
- Probability
- Vectors

This phase does not change proof educational content. It strengthens the typed certification layer and browser tests that prove formulas, theorem scaffolds, and Visual Proof routes remain connected in production-preview browser execution.

## Files Modified

- `src/proof-explanations/proofLearningLinks.ts`
- `src/proof-explanations/proofLearningLinks.test.ts`
- `tests/proofs/proofLearningJourneys.e2e.ts`

## Files Created

- `docs/proofs/PHASE_06_BROWSER_EXPLANATION_MATRIX_CERTIFICATION.md`

## Certified Journey Matrix

| Area | Formula route | Theorem route | Visual Proof route |
| --- | --- | --- | --- |
| Geometry: Pythagorean theorem | `/formulas/geometry` | `/theorems/geometry/pythagorean-theorem-1` | `/visual-proofs/geometry/pythagorean-theorem-area-rearrangement` |
| Trigonometry: Pythagorean identity | `/formulas/trigonometry` | `/theorems/trigonometry/pythagorean-identity-theorem-1` | `/visual-proofs/trigonometry/pythagorean-trig-identity` |
| Coordinate Geometry: Distance formula | `/formulas/coordinate-geometry` | `/theorems/coordinate-geometry/distance-formula-theorem-1` | `/visual-proofs/coordinate-geometry/distance-formula` |
| Calculus: Fundamental theorem | `/formulas/integrals` | `/theorems/calculus-analysis/fundamental-theorem-of-calculus-i-1` | `/visual-proofs/calculus/fundamental-theorem-of-calculus` |
| Probability: Addition rule | `/formulas/probability` | `/theorems/probability-statistics/addition-rule-theorem-1` | `/visual-proofs/probability/addition-rule-overlapping-events` |
| Vectors: Dot product | `/formulas/vectors` | `/theorems/linear-algebra-vectors/dot-product-angle-theorem-1` | `/visual-proofs/vectors/dot-product-as-projection` |

## Technical Changes

### Typed Certification Seeds

`proofLearningLinks.ts` now exports:

- `ProofLearningCertificationSeed`
- `ProofLearningCertificationJourney`
- `proofLearningCertificationSeeds`
- `getProofLearningCertificationJourneys()`

The browser test consumes resolved journeys rather than hardcoded theorem slugs. If a formula, theorem, or Visual Proof target disappears, the focused unit test fails before the browser test runs.

### Browser Matrix Test

`tests/proofs/proofLearningJourneys.e2e.ts` now loops through the certification matrix and checks:

- formula page shows the theorem scaffold link
- formula page shows the Visual Proof link
- theorem page shows the formula link
- theorem page shows the Visual Proof link
- Visual Proof page renders the proof shell
- Visual Proof page renders a nonblank primary visual
- Visual Proof page links back to formula and theorem pages
- formula, theorem, and Visual Proof pages do not overflow horizontally at 360 px mobile width

## Commands Run

### Focused Unit Tests

`npm run test -- src/proof-explanations/proofLearningLinks.test.ts src/pages/FormulaLibraryPage.test.tsx src/pages/TheoremLibraryPage.test.tsx`

Result: passed, 3 files and 19 tests.

### Browser Matrix Certification

`npx playwright test tests/proofs/proofLearningJourneys.e2e.ts`

Result: passed, 2 browser tests covering 6 journeys and 18 route visits.

## Known Limitations

- This is a representative matrix, not full coverage of every curated proof relationship.
- The matrix tests link presence, shell readiness, nonblank Visual Proof rendering, and mobile overflow. It does not perform screenshot-baseline visual regression.
- Category pages and theorem pages are verified through the selected formula/theorem/Visual Proof routes, not every item in those categories.

## Readiness Certificate

Phase 6 is ready to close.

The proof explanation system now has representative browser-certified learning journeys across six core proof families, with typed data guards preventing stale formula, theorem, or Visual Proof targets.

## Recommended Next Phase

Phase 7 should add a compact teacher lesson-path export for certified journeys:

- export formula route, theorem route, and Visual Proof route as a single JSON lesson path
- include title, category, and recommended teaching order
- keep it browser-only and generated from `proofLearningCertificationSeeds`
- add tests that every certified journey can be exported without stale links
