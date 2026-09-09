# Target 0158 Current Audit

## Lesson

- Lesson ID: 101
- Title: Rationalisation
- Route: `/lessons/algebra/101-rationalisation`
- Target: `0158-interactive-intermediate-expressions-and-manipulation-rationalisation-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated denominator-cleaning workspace | `RationalisationTargetLesson101` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated rationalisation model | Matching-radical and conjugate paths, denominator result, exact result, decimal proof, grading, and drag validation use `rationalisationLesson101Model` | Model tests |
| Target default expression | The surface opens at `1/√2`, multiplies by `√2/√2`, and returns `√2/2` | Model and surface tests |
| Selectable expressions | Radical and binomial-denominator presets regenerate multiplier choices, result, balance, stages, and proof | Component inspection |
| Real multiplier choices | Matching radical, alternate radical, and conjugate compute valid or invalid rationalisation states from the selected expression | Model tests |
| Validated multiplier drag | Only recognized multiplier payloads are accepted; drag state clears after invalid drops and drag end | Model tests and component inspection |
| Staged workflow | Choose, multiply, and simplify stages are enabled according to mathematical validity | Component inspection |
| Balance representation | Both sides derive from multiplying by a modeled form of one | Component inspection |
| Decimal equivalence | Original and rationalised forms are independently evaluated and compared within tolerance | Model tests |
| Graded practice | Numerator and denominator inputs accept normalized radical notation and are checked against the modeled result | Model tests |
| Functional lesson tabs | Explain, Examples, Guided Steps, Practice, and Formula & Rules render separate model-derived content | Component inspection |
| Real share and bookmark | Share uses the native share sheet or clipboard; bookmark state persists in local storage | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `rationalisationLesson101Model.test.ts`: passed
- `RationalisationTargetLesson101.test.tsx`: passed
- focused lesson 101 adapter route test: passed
- ESLint on lesson 101 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the multiplier flow, balance, expression chooser, stage buttons, rule and warning cards, decimal proof, guided steps, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
