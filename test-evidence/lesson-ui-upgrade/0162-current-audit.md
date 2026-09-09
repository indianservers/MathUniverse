# Target 0162 / Lesson 105 - Factor Theorem

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Factor Theorem station and standalone lesson-specific mathematics model.
- Editable polynomial, candidate factor, and test-value controls drive every proof stage.
- Candidate parser extracts `a` only from a valid linear factor in the form `x − a`.
- Horner evaluation calculates `f(a)` independently from synthetic division.
- Factor verdict requires valid inputs, matching extracted/test values, zero evaluation, and zero remainder.
- Synthetic row calculates coefficients, products, sums, quotient, and remainder.
- Complementary quadratic root and full factor pair are derived from the calculated quotient.
- Substitution meter and zero target react to the computed value.
- Candidate-factor and extracted-value drag stages validate non-empty, matching payloads and clear drag state.
- Substitute, Check zero, Reveal factor pair, Reset, and New problem controls update real lesson state.
- Practice candidate values are calculated from `g(x) = x² − 5x + 6`; candidate selection is exposed with pressed state.
- Explain, Examples, Formulas, and Know more tabs expose real theorem content while preserving target geometry.
- Catalog-correct navigation points to lesson 104 Remainder Theorem and lesson 106 Identities.
- External reset initialization no longer reports a false user interaction.

## Verification

- Three lesson-model tests passed.
- Dedicated surface test passed.
- Full algebra/CAS adapter suite passed: 42 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit --pretty false` passed.
- Scoped diff and malformed-token checks passed; only expected line-ending warnings were reported.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
