# Target 0178 / Lesson 121 - Absolute-Value Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Absolute-Value Equations surface and standalone lesson-specific distance-equation model.
- The target equation `|x - 3| = 2` calculates center `3`, solution points `1` and `5`, both linear branches, and both substitution-distance checks.
- Center and distance inputs recalculate the equation, number-line bounds, symmetric solution points, branch equations, final answer, and reasoning rail.
- Center and solution handles support pointer dragging and keyboard movement while preserving equal-distance geometry.
- Negative right sides produce an explicit no-real-solution state because an absolute value cannot equal a negative distance.
- The related equation `|y + 4| = 3` accepts two learner-entered solutions and grades the complete pair in either order.
- Reset, language, sharing, native fullscreen, workspace, examples, and lesson tabs have functional behavior.
- Explain, Examples, Formulas, and Know more tabs expose substantive content without changing the example as a tab side effect.
- Adjacent lesson and footer navigation use real links.
- External reset initialization no longer reports a false user interaction.

## Verification

- Four lesson-model tests passed.
- Dedicated rendered-surface test passed.
- Full algebra/CAS adapter suite passed: 38 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Scoped malformed-token checks passed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
