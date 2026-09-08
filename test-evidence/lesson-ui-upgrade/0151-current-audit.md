# Target 0151 Current Audit

## Lesson

- Lesson ID: 94
- Title: Substitution
- Route: `/lessons/algebra/94-substitution`
- Target: `0151-interactive-intermediate-expressions-and-manipulation-substitution-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated substitution workspace | `SubstitutionTargetLesson94` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated evaluation model | Expressions, substitution strings, intermediate values, results, and practice data use `substitutionLesson94Model` | Model tests |
| Direct value controls | Stepper, numeric input, range slider, and draggable value token share one bounded value | Surface test and component inspection |
| Functional drop slot | Dropping the chosen value into the expression records a completed substitution | Component inspection |
| Live step sequence | Replacement, exponent/multiplication, addition/subtraction, and result derive from the active expression | Model and surface tests |
| Real bracket precedence | Omitting brackets around a negative square changes the interpreted result and produces a warning | Model tests |
| Expression selector | Changing expressions updates variable, initial value, power, operation, and result | Component inspection |
| Functional toggles | Slot visibility and negative brackets change rendered behavior | Component inspection |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render separate model-derived content | Component inspection |
| Practice cycling | Try another advances through modeled exercises and answers | Component inspection |

## Verification Run

- `substitutionLesson94Model.test.ts`: passed
- `SubstitutionTargetLesson94.test.tsx`: passed
- focused lesson 94 adapter route test: passed
- ESLint on lesson 94 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the substitution machine, controls, step cards, bracket comparison, worked example, practice, tips, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
