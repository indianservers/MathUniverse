# Target 0172 / Lesson 115 - Polynomial Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Polynomial Equations surface and standalone lesson-specific cubic root model.
- The three editable roots generate the factor stack, expanded Vieta coefficients, cubic graph, marked x-intercepts, and substitution checks.
- The target roots `1, 2, 3` generate `x^3 - 6x^2 + 11x - 6 = 0` and three exact zero checks.
- Pointer and keyboard movement of any root rebuilds the factor cards, coefficients, graph, legend, and test-a-root calculation.
- Exact zero evaluation is normalized to `0` instead of exposing JavaScript negative zero.
- Each zero-product switch independently controls whether its root is included, and the result/warning state detects dropped factors.
- Factored/expanded form, show factors, mark roots, check all, test value, reset, new example, and practice-step controls update real state.
- Three-root practice validates the complete root set numerically in any order.
- Interaction, Explain, Examples, Practice, Formulas, and Know more tabs expose substantive content without changing examples as an unrelated side effect.
- English/Hindi selection changes key copy, native Share has clipboard fallback, and Workspace exposes the current polynomial and root set.
- Footer navigation uses real links instead of inert buttons.
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
