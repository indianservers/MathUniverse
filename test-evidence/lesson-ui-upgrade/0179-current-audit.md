# Target 0179 / Lesson 122 - Linear Inequalities

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Linear Inequalities surface and standalone lesson-specific inequality solver model.
- The target inequality `2x + 3 > 9` calculates boundary `3`, solution `x > 3`, an open endpoint, rightward shading, interval `(3, infinity)`, and a passing test point `x = 4`.
- Editable coefficients, constant, comparator, and right side recalculate every algebra step, comparator direction, endpoint type, interval, graph, summary, and test-point result.
- Negative coefficients reverse the solved comparator after division and update all dependent visual and symbolic results.
- The boundary point supports pointer dragging and keyboard movement; the right side is recalculated from the original coefficients so the algebra and graph remain linked.
- Strict comparators use open endpoints while inclusive comparators use closed endpoints.
- Test points are evaluated against the original inequality rather than inferred from display direction.
- Quick practice loads a complete related inequality into the same calculated solver.
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
- Scoped malformed-token checks passed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
