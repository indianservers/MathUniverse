# Target 0155 Current Audit

## Lesson

- Lesson ID: 98
- Title: Algebraic Fractions
- Route: `/lessons/algebra/98-algebraic-fractions`
- Target: `0155-interactive-intermediate-expressions-and-manipulation-algebraic-fractions-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated rational-expression workspace | `AlgebraicFractionsTargetLesson98` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated algebraic-fraction model | Factoring, simplification, domain restriction, evaluation, grading, and drag validation use `algebraicFractionsLesson98Model` | Model tests |
| Target default expression | The surface opens at `(x² − 1)/(x − 1)`, simplifies to `x + 1`, and preserves `x ≠ 1` | Model and surface tests |
| Selectable expressions | Each preset regenerates numerator factors, denominator, cancelled factor, restriction, proof, and result | Component inspection |
| Guided cancellation | Factor, cancellation, restriction, and substitution switches alter their corresponding lesson outputs | Component inspection |
| Validated common-factor drag | Only numerator and denominator common-factor sources register in the cancellation target | Model tests and component inspection |
| Domain restriction | The original denominator’s zero is retained after cancellation and shown on the number line | Model tests and component inspection |
| Substitution proof | Original and simplified forms are evaluated independently; the excluded input returns undefined | Model tests |
| Misconception panel | Non-factor term cancellation is explicitly rejected and a correct decomposition is shown | Component inspection |
| Graded practice | Simplified expression and restriction are both required; normalized `!=` input is accepted | Model tests |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render separate model-derived content | Component inspection |
| Honest interaction accounting | External resets restore target defaults without reporting a false user interaction | Component inspection |

## Verification Run

- `algebraicFractionsLesson98Model.test.ts`: passed
- `AlgebraicFractionsTargetLesson98.test.tsx`: passed
- focused lesson 98 adapter route test: passed
- ESLint on lesson 98 files: passed with zero warnings
- TypeScript project check: passed
- scoped `git diff --check`: passed

## Acceptance Boundary

The target PNG was inspected and used for the rational-expression display, controls, guided factor/cancel/restriction steps, substitution result, misconception panel, practice, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
