# Target 0153 Current Audit

## Lesson

- Lesson ID: 96
- Title: Double Brackets
- Route: `/lessons/algebra/96-double-brackets`
- Target: `0153-interactive-intermediate-expressions-and-manipulation-double-brackets-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated double-brackets workspace | `DoubleBracketsTargetLesson96` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated binomial model | Expressions, four products, middle-term combination, evaluation, and grading use `doubleBracketsLesson96Model` | Model tests |
| Target default expression | The surface opens at `(x + 2)(x + 3)` and expands to `x² + 5x + 6` | Model and surface tests |
| Editable bracket controls | Variable and both constants regenerate the area model, products, steps, result, and proof | Component inspection |
| Four-product area model | The four regions derive from the current binomials; middle products remain draggable into the combination region | Surface test and component inspection |
| Real middle-term combination | The uncombined and combined forms are independently generated from the current coefficients | Model tests |
| Substitution proof | Original and expanded forms are independently evaluated at the selected value | Model test |
| Working display options | Product visibility, middle-term combination, and substitution proof switches alter their related output | Component inspection |
| Graded practice | Enter grades normalized polynomial input; challenge and solution controls use lesson-specific modeled expressions | Model tests and component inspection |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render separate model-derived content instead of changing decoration only | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `doubleBracketsLesson96Model.test.ts`: passed
- `DoubleBracketsTargetLesson96.test.tsx`: passed
- focused lesson 96 adapter route test: passed
- ESLint on lesson 96 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the area model, builder controls, result proof, guided steps, concept cards, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
