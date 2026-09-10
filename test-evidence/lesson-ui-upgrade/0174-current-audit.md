# Target 0174 / Lesson 117 - Radical Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Radical Equations surface and standalone lesson-specific radical solver model.
- Offset and right-side editing calculate the domain boundary, squared candidate, candidate radicand, principal square root, and final validity.
- The target equation `sqrt(x + 1) = 4` calculates domain `x >= -1`, candidate `x = 15`, and verifies the original equation as `4 = 4`.
- Negative right sides still generate the candidate caused by squaring but are explicitly marked extraneous, rejected, and removed from the solution set.
- The domain boundary supports pointer and keyboard movement and rebuilds all dependent algebra values and steps.
- Native square-both-sides dragging uses a non-empty payload tied to the complete current equation; stale and mismatched drops are rejected.
- Edit, new example, reset, candidate check, and new-practice controls update real state.
- Practice grading checks both the entered candidate and original-equation validity.
- Interactive Lab, Examples, Key Ideas, and Formula Sheet tabs expose substantive content without changing examples as an unrelated side effect.
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
