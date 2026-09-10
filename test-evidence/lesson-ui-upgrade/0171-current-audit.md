# Target 0171 / Lesson 114 - Quadratic Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Quadratic Equations surface and standalone lesson-specific quadratic model.
- Coefficients drive the discriminant, real roots, vertex, factors, graph curve, x-intercepts, and substitution evaluation.
- The target equation calculates roots `2` and `3`, discriminant `1`, and vertex `(2.5, -0.25)`.
- Pointer and keyboard root movement rebuilds the coefficients from the selected roots, keeping factor cards and the graph synchronized.
- Factoring, quadratic-formula, and completing-the-square choices now select real calculated derivations rather than a fixed select value.
- Invalid linear input and negative-discriminant equations no longer emit non-finite SVG root or vertex coordinates.
- Show factors, mark roots, check roots, reset, new equation, and step controls update real state.
- Guided practice grades both roots numerically in either order.
- Interactive, Guided Practice, Examples, Formulas, and Know more tabs expose substantive content without changing examples as an unrelated side effect.
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
