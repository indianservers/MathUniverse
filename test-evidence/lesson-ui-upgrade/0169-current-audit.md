# Target 0169 / Lesson 112 - Simultaneous Linear Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated simultaneous-equations surface and standalone lesson-specific two-equation model.
- Every preset calculates its determinant, ordered-pair solution, both substitution checks, scaled equations, and combined elimination equation.
- The target system calculates `x + y = 7`, `x - y = 1`, `2x = 8`, and the ordered pair `(4, 3)`.
- Elimination and substitution produce distinct symbolic step sequences from the selected system.
- Native operation dragging uses a non-empty token tied to the current system and active method; stale and cross-method drops are rejected.
- Changing method clears the prior derivation instead of carrying a completed operation into a different method.
- The dual-line graph is generated from both equation coefficient sets, with working intersection and grid controls.
- Step-detail selection, graph themes, equation presets, both-equation verification, reset, and favorite controls update real state.
- Ordered-pair practice is graded against the calculated solution and both source equations.
- Interaction, Explain, Examples, Formulas, and Know more tabs expose substantive content without triggering unrelated shortcuts.
- External reset initialization no longer reports a false user interaction.

## Verification

- Four lesson-model tests passed.
- Dedicated surface test passed.
- Full algebra/CAS adapter suite passed: 38 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Scoped malformed-token checks passed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
