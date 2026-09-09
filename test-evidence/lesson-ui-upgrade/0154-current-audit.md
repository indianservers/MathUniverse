# Target 0154 Current Audit

## Lesson

- Lesson ID: 97
- Title: Factorisation
- Route: `/lessons/algebra/97-factorisation`
- Target: `0154-interactive-intermediate-expressions-and-manipulation-factorisation-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated reverse-area workspace | `FactorisationTargetLesson97` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated factorisation model | Pair search, candidates, expressions, split terms, factor form, substitution proof, grading, and drop validation use `factorisationLesson97Model` | Model tests |
| Target default quadratic | The surface opens at `x² + 5x + 6`, splits to `x² + 2x + 3x + 6`, and factors to `(x + 2)(x + 3)` | Model and surface tests |
| Editable product and sum | Both targets recompute the valid pair, candidate choices, rectangle, proof, and result | Component inspection |
| Real factor-pair choices | Candidate product and sum calculations derive from the current quadratic; only the valid pair advances the workflow | Model tests and component inspection |
| Validated draggable rectangle | Squared, split-middle, and constant terms only register when dropped into the mathematically matching area cell | Model tests and component inspection |
| Reverse-area side lengths | Rectangle labels and final binomial factors derive from the active pair | Surface test |
| Substitution proof | Expanded and factored forms are independently evaluated and equivalence requires a valid pair | Model tests |
| Guided practice | Pair choice and factor-form input are graded; either factor order is accepted | Model tests and component inspection |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render separate model-derived content | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `factorisationLesson97Model.test.ts`: passed
- `FactorisationTargetLesson97.test.tsx`: passed
- focused lesson 97 adapter route test: passed
- ESLint on lesson 97 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the factor-pair workflow, reverse-area model, worked proof, value check, warning, guided practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
