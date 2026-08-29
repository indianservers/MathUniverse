# Symbolic Mathematics / CAS Workspace target batch 0334-0355

Dedicated rebuild target: **2 of 22 lessons completed; 20 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0334 | 428 Symbolic Evaluation | `editable-linear-expression-parse-transform-substitution-practice` | Reworked individually and browser-validated |
| 0335 | 429 Simplify | `factor-multiset-cancellation-preserved-domain-equivalence-practice` | Reworked individually and browser-validated |

## Lesson 428 / Mockup 0334 - Symbolic Evaluation

Reworked individually against the target mockup instead of routing through the reusable CAS presentation. The dedicated model parses an editable signed linear expression into variable and constant terms, derives the canonical exact result, rebuilds the visible parse structure, and drives every transformation row from the same state. Evaluate, Clear, assumptions editing, real/integer/positive domains, substitution value, substitution verification, outer lesson tabs, shell Reset, fullscreen invocation, practice checking, solution reveal, copy, and Next navigation are functional.

The initial target expression is `2*x+3*x-x+4-2`. Its mathematically correct simplification is `4x + 2`, not the mockup's `5x + 2`; the lesson intentionally preserves coherent arithmetic and verifies both forms give 14 at x=3. Browser validation also edits the model to `7*x-2*x+9-4`, derives `5x + 5`, and verifies 15 at x=2. The independent challenge rejects `3y + 2`, accepts `3y - 2`, calculates both sides at y=2, and exposes a real derivation.

Final exact 995x1581 validation matches the target stack: sidebar width 212, header y=89-317, tabs y=324-365, learning flow y=372-484, dedicated CAS lab y=490-1407, property strip y=1414-1440, Next navigation y=1444-1491, and footer beginning at y=1495. It reports no horizontal overflow and zero console messages.

Evidence:

- `0334-reference.png`
- `0334-desktop.png`
- `0334-dedicated-target-validation.json`

## Lesson 429 / Mockup 0335 - Simplify

Reworked individually around a dedicated rational-expression object model. The lesson parses an editable factored numerator and denominator, cancels matching factors, preserves the original denominator roots as domain restrictions, renders the cancellation and reduced expression from model state, and numerically verifies equivalence only at values allowed by the original domain. Expression editing, Simplify, equivalence checks, shell Reset, independent practice checking, practice reset, and Previous/Next navigation are functional.

Browser validation starts from `2*(x+3)*(x-2)/(x*(x+3))`, derives `2(x-2)/x`, records the cancelled factor `(x+3)`, and preserves exclusions `-3, 0`. It then edits the model to `3*(x-4)*(x+2)/(x*(x+2))`, derives `3(x-4)/x`, preserves `-2, 0`, verifies x=3, and refuses x=-2 because it is excluded. The independent practice rejects a missing restriction, accepts `4(x+2)/x` with exclusions `0, 1`, and resets cleanly.

Final exact 1011x1555 validation matches the target stack: sidebar width 212, header y=89-303, tabs y=306-348, learning flow y=361-479, dedicated workspace y=495-989, learning cards y=1003-1273, practice y=1289-1469, and adjacent navigation y=1485-1535. It reports no horizontal overflow and zero console messages.

Evidence:

- `0335-reference.png`
- `0335-desktop.png`
- `0335-dedicated-target-validation.json`
