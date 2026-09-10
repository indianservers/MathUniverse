# Target 0181 / Lesson 124 - Quadratic Inequalities

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Quadratic Inequalities surface and standalone lesson-specific sign-interval solver model.
- The target inequality `x^2 - 5x + 6 > 0` calculates roots `2` and `3`, factorization `(x - 2)(x - 3)`, positive outside intervals, and solution `(-infinity, 2) union (3, infinity)`.
- Root positions and leading-coefficient controls recalculate expanded coefficients, factorization, sign samples, interval selection, parabola regions, and worked reasoning.
- Both roots support pointer dragging and keyboard movement, with sorted critical points retained throughout the model.
- Strict and inclusive comparators correctly exclude or include roots.
- Repeated roots are handled without fabricating a sign change, including all-real, excluded-point, singleton, and empty-set outcomes.
- Sign-chart test values are evaluated from the factored quadratic and matched against the active comparator.
- The quick-practice check verifies the modeled solution of `y^2 - 4 <= 0` rather than unconditionally reporting success.
- Reset, language, native sharing, native fullscreen, workspace, examples, and lesson tabs have functional behavior.
- Explain, Examples, Formulas, and Know more tabs expose substantive content without changing the example as a tab side effect.
- Adjacent lesson and footer navigation use real links.
- External reset initialization no longer reports a false user interaction.

## Verification

- Five lesson-model tests passed.
- Dedicated rendered-surface test passed.
- Full algebra/CAS adapter suite passed: 38 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Scoped malformed-token and diff checks passed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
