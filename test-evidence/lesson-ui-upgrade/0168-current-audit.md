# Target 0168 / Lesson 111 - Linear Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Linear Equations surface and standalone lesson-specific first-degree equation model.
- Every selectable equation calculates its constant-removal intermediate, solution, substitution check, graph line, and target intersection.
- The target example calculates `4x + 1 = 13`, `4x = 12`, `x = 3`, and confirms the point `(3, 13)` on both graph equations.
- Constant and coefficient operations are independently draggable to their matching balance rows.
- Drag payloads must be non-empty and match the current problem and operation row; stale and mismatched operations are rejected.
- The graph probe supports pointer dragging and keyboard movement and evaluates its y-coordinate from the current line equation.
- Show algebra, show graph, check solution, equation selection, reset, and workspace controls update real lesson state.
- Practice answers are graded against a calculated solution for each generated problem.
- Interact, Explain, Examples, Practice, Formulas, and Know more tabs expose substantive lesson content without mutating unrelated state.
- Language selection changes key visible lesson copy and Share uses the native share API with a clipboard fallback.
- External reset initialization no longer reports a false user interaction.

## Verification

- Four lesson-model tests passed.
- Dedicated surface test passed.
- Full algebra/CAS adapter suite passed: 38 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit` passed.
- Scoped diff and malformed-token checks passed.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
