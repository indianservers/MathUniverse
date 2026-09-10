# Target 0177 / Lesson 120 - Trigonometric Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Trigonometric Equations surface and standalone lesson-specific solver model.
- The target equation `sin(theta) = 1/2` calculates both principal solutions `30 degrees` and `150 degrees`, identifies quadrants I and II, and writes both periodic solution families.
- Sine and cosine presets recalculate their exact reference angle, partner angle, function value, relevant quadrants, worked steps, and general solutions.
- Unit-circle points and wave intersections share the same calculated angles and function value instead of maintaining independent display-only values.
- The reference-angle point supports pointer dragging and keyboard movement; dependent circle geometry, wave crossings, labels, reasoning, and families update together.
- Degree/radian mode uses exact common-angle labels such as `pi/6`, `5pi/6`, and `2pi`.
- Quick practice accepts two learner-entered angles and grades the complete cosine solution pair in either order.
- Equation presets, reset, language, sharing, native fullscreen, workspace, and lesson tabs have functional behavior.
- Explain, Examples, Formulas, and Know More expose substantive content without changing the problem as an unrelated tab side effect.
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
