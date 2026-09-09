# Target 0156 Current Audit

## Lesson

- Lesson ID: 99
- Title: Indices
- Route: `/lessons/algebra/99-indices`
- Target: `0156-interactive-intermediate-expressions-and-manipulation-indices-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated exponent-law workspace | `IndicesTargetLesson99` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated indices model | Superscripts, powers, repeated factors, combined exponent, evaluation, grading, and drag validation use `indicesLesson99Model` | Model tests |
| Target default powers | The surface opens at `x³ × x² = x⁵` with five repeated factors | Model and surface tests |
| Editable base and exponents | Base selection and bounded steppers regenerate both powers, factor groups, combined result, steps, and check values | Component inspection |
| Repeated-factor visualization | Each visible factor is generated from its exponent and remains an individually draggable object | Surface test and component inspection |
| Validated factor drops | Only current blue/purple factor IDs within their exponent bounds register in the combined product | Model tests |
| Working combine switch | Disabling Add exponents changes the visible combined equation to an uncombined pending state | Component inspection |
| Numeric equality proof | Product-of-powers and combined-power values are independently evaluated at the selected base value | Model tests |
| Important-rule validation | Same-base multiplication and the invalid different-base example remain distinct | Component inspection |
| Graded practice | Superscript, caret, and plain exponent forms are normalized and checked | Model tests |
| Functional lesson tabs | Explain, Examples, Practice, Formulas, and Know more render separate model-derived content | Component inspection |
| Real share action | Share invokes the native share sheet where available and falls back to writing the route to the clipboard | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `indicesLesson99Model.test.ts`: passed
- `IndicesTargetLesson99.test.tsx`: passed
- focused lesson 99 adapter route test: passed
- ESLint on lesson 99 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the repeated-factor lab, controls, numeric result, guided steps, law and warning cards, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
