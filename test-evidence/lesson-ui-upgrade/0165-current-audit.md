# Target 0165 / Lesson 108 - Multi-Step Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated Multi-Step Equations balance sequence and standalone lesson-specific linear-equation model.
- Every selectable equation derives its intermediate value and solution from coefficient, constant, and right-hand side.
- Expression and inverse-operation text is generated correctly for positive and negative constants.
- Target default opens at completed Step 3 with constant removal and equal-group division recorded.
- Selecting a new equation returns the sequence to Start and clears completed operations.
- Stage navigation controls visibility of the intermediate equation, equal groups, and final result without shifting the layout.
- Remove-constant and equal-group action cards update mathematical operation state rather than only changing labels.
- Native drag payloads are validated against the selected equation and expected operation.
- Equal-group division is rejected until constant removal is complete, enforcing the target's stated operation order.
- Check answer requires both inverse operations before revealing the completed stage.
- Balance blocks, equal groups, summary steps, solution, and substitution check all use calculated values.
- Independent practice equations derive solutions and grade answers by substitution.
- Step guide and nudge controls expose and hide genuine practice guidance.
- Catalog-correct navigation points to lesson 107 One-Step Equations and lesson 109 Equations with Fractions.
- External reset initialization no longer reports a false user interaction.

## Verification

- Three lesson-model tests passed.
- Dedicated surface test passed.
- Full algebra/CAS adapter suite passed: 42 tests.
- ESLint passed for all lesson-specific and routing files.
- `tsc --noEmit --pretty false` passed.
- Scoped diff and malformed-token checks passed; only expected line-ending warnings were reported.

## Acceptance boundary

The target mockup was inspected while implementing the surface. Browser-based screenshot capture and pixel comparison remain deferred, so this entry records code reconciliation rather than pixel-perfect visual acceptance.
