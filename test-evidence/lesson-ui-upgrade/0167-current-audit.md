# Target 0167 / Lesson 110 - Literal Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Literal Equations surface and standalone lesson-specific formula model.
- Rectangle area, distance-rate-time, simple-interest, circumference, and rectangular-volume practice formulas calculate from their entered values.
- Every selectable subject has its own symbolic arrangement, inverse operation, restriction, numerical evaluator, and original-formula verification.
- The target example calculates `w = A / l`, `w = 4`, and verifies `6 x 4 = 24` against `A = 24`.
- Native inverse-operation dragging uses a non-empty payload tied to the selected formula, subject, and divisor; unrelated or stale operations are rejected.
- Formula and subject selection rebuild the step sequence and values for the selected object model.
- Numeric inputs recalculate the target variable and substitution check rather than displaying fixed results.
- Interaction, Explain, Examples, Formulas, and Know more tabs expose substantive content without mutating unrelated lesson state.
- Example and formula panels load their selected formula into the real rearranger.
- English/Hindi selection changes key visible lesson copy.
- Share invokes the native share sheet with clipboard fallback and reports success only after the action completes.
- Workspace, expansion, guided-practice hint, new-practice, reset, and formula-check controls update real state.
- External reset initialization no longer reports a false user interaction.
- Catalog-correct navigation points to lesson 109 Equations with Fractions and lesson 111 Linear Equations.

## Verification

- Four lesson-model tests passed.
- Dedicated rendered-surface test passed.
- Full algebra/CAS adapter suite passed: 43 tests total across the three requested files.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Malformed-token scan passed; its only output was the intentional `operationApplied` state identifier.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
