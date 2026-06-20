# Phase 4 Proof Learning Links Audit

## Scope

Phase 4 creates a typed relationship layer between formulas, theorem proofs, and Visual Proof routes.

The goal is to make the app feel connected: a student should be able to start from a formula, jump to the theorem that explains why it works, and open a Visual Proof that shows the idea.

## Files Created

- `src/proof-explanations/proofLearningLinks.ts`
- `src/proof-explanations/proofLearningLinks.test.ts`
- `docs/proofs/PHASE_04_PROOF_LEARNING_LINKS_AUDIT.md`

## Files Modified

- `src/pages/FormulaLibraryPage.tsx`
- `src/pages/TheoremLibraryPage.tsx`

## What Changed

Curated learning link layer:

- Added a typed curated formula-to-theorem-to-visual-proof map.
- Added validation that every curated formula target exists.
- Added validation that every curated theorem target exists.
- Added validation that every curated Visual Proof route exists.
- Added reverse theorem lookup so theorem pages can point back to formula sections and Visual Proofs.

Formula Library integration:

- Formula cards now prefer curated proof links first.
- Existing heuristic discovery remains as fallback for formulas not yet curated.
- Related theorem and Visual Proof chips continue to render in formula cards.

Theorem Library integration:

- Theorem cards and theorem detail pages now prefer curated links first.
- Existing heuristic formula/proof discovery remains as fallback.
- Connected Learning panels stay useful while the curated graph grows.

## Current Curated Backbone

Initial high-confidence curated links include:

- Pythagorean theorem
- Triangle area
- Circle circumference and circle area
- Trigonometric ratios and identities
- Sine, cosine, and double-angle formulas
- Sine rule and cosine rule
- Distance, midpoint, slope, point-slope, and circle equations
- Derivative definition, power rule, product rule, and chain rule
- Fundamental theorem of calculus and integration by parts
- Dot product, cross product, and vector projection
- Complex modulus and Euler form
- Probability addition and multiplication rules
- Statistics mean
- Arithmetic and geometric sequence formulas

## QA Results

Focused tests:

- `src/proof-explanations/proofLearningLinks.test.ts`
- `src/pages/FormulaLibraryPage.test.tsx`
- `src/pages/TheoremLibraryPage.test.tsx`

Result:

- 3 test files passed.
- 17 tests passed.

Typecheck:

- `npm run typecheck` passed.

## Known Limitations

- Not every formula has a curated relationship yet.
- The heuristic fallback is still used for long-tail formula and theorem matches.
- Visual Proof pages do not yet display reciprocal formula/theorem links directly.
- Browser rendering was not visually certified in this phase.

## Recommended Next Phase

Phase 5 should certify the proof explanation experience in the browser: route smoke, readable linked panels, mobile overflow checks, and representative visual proof/theorem/formula journeys.
