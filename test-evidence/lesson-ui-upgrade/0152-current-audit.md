# Target 0152 Current Audit

## Lesson

- Lesson ID: 95
- Title: Expanding Brackets
- Route: `/lessons/algebra/95-expanding-brackets`
- Target: `0152-interactive-intermediate-expressions-and-manipulation-expanding-brackets-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated distributive workspace | `ExpandingBracketsTargetLesson95` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated algebra model | Expansion, signs, brackets, substitution proof, practice, and grading use `expandingBracketsLesson95Model` | Model tests |
| Direct factor control | Numeric input, steppers, and draggable outside factor share one bounded value | Surface test and component inspection |
| Editable bracket terms | Variable and constant inputs regenerate expression, area, steps, and result | Component inspection |
| Real area partition | Unit-cell count equals `|factor × constant|` and supports negative unit cells | Model and surface tests |
| Distribution arrows | The arrow layer independently toggles without changing the mathematics | Component inspection |
| Substitution proof | Original and expanded forms are independently evaluated at the check value | Model test |
| Guided steps | Both products and final sum derive from the current expression | Component inspection |
| Graded practice | Normalized answers are checked against modeled positive and negative expansions | Model tests |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render separate model-derived content | Component inspection |

## Verification Run

- `expandingBracketsLesson95Model.test.ts`: passed
- `ExpandingBracketsTargetLesson95.test.tsx`: passed
- focused lesson 95 adapter route test: passed
- ESLint on lesson 95 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the area model, controls, result proof, guided steps, concept cards, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
