# Target 0166 / Lesson 109 - Equations with Fractions

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Equations with Fractions surface and standalone lesson-specific fraction-equation model.
- Every example calculates its LCD, cleared coefficient, cleared constant, cleared right-hand side, isolated numerator, and solution.
- Examples with numerator coefficients greater than one include the required final coefficient-division step.
- Positive and negative constant terms generate correct signed equation and inverse-operation text.
- Original-equation verification evaluates the complete fractional expression at the calculated solution.
- One native LCD multiplier can be dragged independently to the fraction, constant, and right-side targets.
- Drag payloads must be non-empty and match the selected example's LCD; duplicate term drops are prevented.
- Clicking the multiplier provides a valid all-terms shortcut and records every multiplied term.
- Next Step performs the LCD multiplication before advancing from the original equation.
- Example selection resets the worked sequence while remaining in the Interact view.
- Independent guided practice validates both the chosen LCD and the answer by substitution in the original equation.
- Show steps, hint, next practice, previous/next stage, Reset, and New Example controls update real state.
- Learn, Examples, Practice, Formula, and Know more tabs expose substantive fraction-equation content.
- Catalog-correct navigation points to lesson 108 Multi-Step Equations and lesson 110 Literal Equations.
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
