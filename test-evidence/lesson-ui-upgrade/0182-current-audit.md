# Target 0182 / Lesson 125 - Polynomial Inequalities

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred.

## Target-aligned implementation

- Dedicated Polynomial Inequalities surface backed by a standalone, lesson-specific numerical sign-analysis model.
- The target inequality `(x + 2)(x - 1)(x - 3) >= 0` evaluates test points `-3`, `-0.5`, `2`, and `4` as `-24`, `7.875`, `-4`, and `18`, producing `[-2, 1] union [3, infinity)`.
- Root positions, root multiplicities, leading-coefficient sign, and comparator recalculate the factorization, degree, graph, interval tests, numeric function values, pass/fail decisions, endpoint inclusion, and solution union.
- All displayed roots support pointer dragging and keyboard movement; roots are sorted for analysis and coincident roots are grouped by combined multiplicity before intervals are constructed.
- Even-multiplicity roots preserve the surrounding sign. Inclusive comparators retain a qualifying repeated root as an isolated singleton when neither adjacent interval qualifies.
- Three selectable worked examples exercise simple roots, a repeated root, and a negative leading coefficient. Every example exposes a concrete test-point substitution and a solution computed by the same solver used by the main surface.
- The sign chart displays actual numeric `f(x)` evaluations in addition to signs, so the worked reasoning is directly checkable.
- Reset restores the target example without reporting an initialization interaction; lesson-tab selection no longer mutates the polynomial as a side effect.
- Language, Share, Workspace, fullscreen, comparator, leading-sign, multiplicity, root-drag, and worked-example controls all update lesson-owned state.

## Verification

- Five focused lesson-model tests passed.
- Dedicated rendered-surface test passed.
- Full algebra/CAS adapter suite passed: 38 route/render tests.
- Combined targeted run passed: 44 tests across 3 files.
- ESLint passed for the lesson-specific implementation and tests.
- `tsc --noEmit` was run for the application project.

## Acceptance boundary

This entry records code reconciliation and focused model/render verification. Browser screenshot capture and pixel comparison remain deferred, so it does not claim pixel-perfect visual acceptance.
