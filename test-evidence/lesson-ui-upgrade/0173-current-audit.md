# Target 0173 / Lesson 116 - Rational Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Rational Equations surface and standalone lesson-specific restriction/solution model.
- Numerator, denominator restriction, and right side calculate an exact reduced candidate, restriction result, original-equation substitution, and solution classification.
- The target equation `1/(x - 2) = 3` calculates `x = 7/3` and verifies both the domain restriction and substitution.
- Editable zero-numerator and zero-right-side cases are classified as unique, no solution, or infinitely many solutions instead of always being accepted.
- The forbidden denominator value has pointer and keyboard movement on the number line and rebuilds every downstream step.
- Native LCD dragging uses a non-empty payload tied to the current variable and forbidden value; stale and mismatched drops are rejected.
- Auto-check, show steps, edit, new problem, hint, reset, candidate check, and new-practice controls update real state.
- Exact fractional practice input is parsed safely, rejects zero denominators, and grades equivalent fractions and decimals numerically.
- Interaction, Explain, Examples, Formulas, and Know more tabs expose substantive content without changing problems as an unrelated side effect.
- Share uses the native share API with clipboard fallback, and footer navigation uses real links.
- External reset initialization no longer reports a false user interaction.

## Verification

- Four lesson-model tests passed.
- Dedicated rendered-surface test passed.
- Full algebra/CAS adapter suite passed: 38 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Focused rerun was warning-free after duplicate status attributes were removed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
