# Target 0157 Current Audit

## Lesson

- Lesson ID: 100
- Title: Surds
- Route: `/lessons/algebra/100-surds`
- Target: `0157-interactive-intermediate-expressions-and-manipulation-surds-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated square-factor extractor | `SurdsTargetLesson100` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated surd model | Divisors, largest square factor, candidates, exact simplification, decimal proof, grading, and drop parsing use `surdsLesson100Model` | Model tests |
| Target default radicand | The surface opens at `√50`, splits `50 = 25 × 2`, and extracts `5√2` | Model and surface tests |
| Editable radicand | Bounded numeric input resets the staged extraction and recomputes candidate factors | Component inspection |
| Real square-factor candidates | Candidate buttons and Find square factor derive from the current radicand | Model tests and component inspection |
| Working radical and factor drag | Candidate factors drop into the tree; dropping the large radical auto-selects its largest square factor | Model tests and component inspection |
| Valid extraction stages | Pull root outside requires a valid perfect-square divisor; decimal comparison requires extraction | Component inspection |
| Exact and decimal equivalence | Exact coefficient/residual and both decimal values derive independently from the current factorization | Model tests |
| Root-addition warning | Correct multiplication splitting remains distinct from the invalid addition split | Component inspection |
| Graded practice | The `√72` multiple-choice task is checked against the modeled correct choice | Model tests |
| Functional lesson tabs | Explain, Examples, Formulas, and Know more render separate model-derived content | Component inspection |
| Working language control | Selecting Hindi changes the primary lesson explanation while preserving the mathematical model | Component inspection |
| Real share action | Share invokes the native share sheet where available and falls back to the clipboard | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `surdsLesson100Model.test.ts`: passed
- `SurdsTargetLesson100.test.tsx`: passed
- focused lesson 100 adapter route test: passed
- ESLint on lesson 100 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the factor tree, extractor controls, exact result, decimal check, guided steps, formula and warning cards, worked example, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
