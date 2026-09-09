# Target 0164 / Lesson 107 - One-Step Equations

## Status

Code reconciled; browser screenshot and pixel-diff acceptance deferred at the user's request.

## Target-aligned implementation

- Dedicated One-Step Equations balance surface and standalone lesson-specific linear-equation model.
- Addition, subtraction, multiplication, and division examples derive solutions from coefficient, constant, and right-hand side.
- Substitution checks evaluate the selected equation rather than comparing stored display values.
- Equation and inverse-operation selectors update the balance, inverse step, solution, and check state together.
- Initial and resolved scales render variable and unit objects for each equation; the fractional example displays `x/4`.
- Automatic Apply to both sides resolves both pans immediately, matching the target default.
- With automatic application disabled, the second balance remains unresolved until the inverse-operation token is dropped on both pans.
- Drag payloads must be non-empty and match the selected equation; duplicate pan drops are prevented and drag state is cleared.
- Show balance, Apply to both sides, Guided Practice, Notes, and Check solution controls update visible or calculated state.
- Independent practice equations derive their solutions and grade answers by substitution.
- Explain, Examples, Formulas, Practice, and Know more tabs expose real lesson content while preserving target dimensions.
- Catalog-correct navigation points to lesson 106 Identities and lesson 108 Multi-Step Equations.
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
