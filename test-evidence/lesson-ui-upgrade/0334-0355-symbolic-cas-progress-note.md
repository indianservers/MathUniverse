# Symbolic Mathematics / CAS Workspace target batch 0334-0355

Dedicated rebuild target: **5 of 22 lessons completed; 17 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0334 | 428 Symbolic Evaluation | `editable-linear-expression-parse-transform-substitution-practice` | Reworked individually and browser-validated |
| 0335 | 429 Simplify | `factor-multiset-cancellation-preserved-domain-equivalence-practice` | Reworked individually and browser-validated |
| 0336 | 430 Expand | `parsed-binomial-four-products-area-tiles-combine-practice` | Reworked individually and browser-validated |
| 0337 | 431 Factor | `monic-quadratic-factor-pair-roots-area-tiles-challenge` | Reworked individually and browser-validated |
| 0338 | 432 Substitute | `dual-occurrence-substitution-tree-order-of-operations-practice` | Reworked individually and browser-validated |

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

## Lesson 430 / Mockup 0336 - Expand

Reworked individually around a dedicated binomial-expansion object model. The lesson parses editable pairs `(ax+b)(cx+d)`, computes all four distribution products, combines the two middle coefficients, and drives the expression tree, FOIL area model, algebra tiles, staged symbolic view, and final polynomial from those values. Expression editing/reset, tile/symbolic modes, reverse/restore, real product-tile drag and keyboard collection, algebra-step reveal, editable challenge, answer checking, hint, practice steps, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `(x+2)*(x-3)`, derives products `1, -3, 2, -6` and coefficients `1, -1, -6`, then edits the model to `(3x+2)*(2x-5)` and derives `6x^2 - 11x - 10`. It switches display modes, reverses the collection stage, drags the `x^2` product into the live collection zone, collects the remaining products, and returns to the verified final stage. The independent challenge rejects `2x^2 + 8x - 4`, accepts `2x^2 + 7x - 4`, and exposes its hint and four-product steps.

Final exact 1022x1539 validation matches the target stack: sidebar width 207, header y=107-371, four-step guide y=126-331, tabs y=380-428, dedicated workspace y=437-909, result y=918-999, learning cards y=1012-1192, practice y=1204-1328, adjacent navigation y=1340-1396, and footer y=1408-1532. It reports no horizontal overflow and zero console messages.

Evidence:

- `0336-reference.png`
- `0336-desktop.png`
- `0336-dedicated-target-validation.json`

## Lesson 431 / Mockup 0337 - Factor

Reworked individually around a dedicated monic-quadratic factor model. The lesson parses editable `x^2 + bx + c` expressions, searches integer pairs satisfying both `m+n=b` and `mn=c`, derives the ordered roots, generates canonical binomial factors, and rebuilds a mathematically coherent four-cell area model. Expression editing, Factor, Find roots, Clear, Random example, fullscreen, real tile drag/drop and keyboard placement, unordered two-factor challenge checking, solution reveal, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `x^2-x-6`, derives pair `2, -3`, roots `-2, 3`, and factors `(x + 2)(x - 3)`. It edits to `x^2+7x+12` and derives pair `4, 3`, clears the model, generates and factors `x^2-9`, opens/closes fullscreen, drags the `x^2` tile into the factor zone, places the remaining tiles, rejects challenge constants `1, 6`, accepts `3, 2`, and reveals `(x + 2)(x + 3)`. The target image's area labels do not multiply or sum to its stated polynomial; the implementation intentionally uses the correct cells `x^2`, `-3x`, `+2x`, and `-6` so the model remains real and internally consistent.

Final exact 1014x1551 validation matches the target stack: sidebar width 207, header y=107-305, tabs y=318-362, four-step flow y=389-503, dedicated factor workspace y=520-1120, challenge y=1150-1327, adjacent navigation y=1339-1396, and footer y=1410-1540. It reports no horizontal overflow and zero console messages.

Evidence:

- `0337-reference.png`
- `0337-desktop.png`
- `0337-dedicated-target-validation.json`

## Lesson 432 / Mockup 0338 - Substitute

Reworked individually around a dedicated two-occurrence substitution tree. Each variable occurrence is an independent drop target; draggable and keyboard-accessible value chips update the slots, while every power, multiplication, addition, status, and exact-result row is calculated from current state. Main-value application, mixed occurrence values, independent practice slots, exact-answer checking, shell Reset, and Previous/Next navigation are functional.

Browser validation begins with x=3 in both occurrences of `x^2 + 2^2x` and derives the mathematically correct result 21. It drags y=4 onto one occurrence to derive the mixed-slot result 28, applies -2 to both occurrences to derive -4, resets, then drags -2 separately into both practice targets. The checker rejects the mockup's incorrect -28 and accepts -4. The target image incorrectly squares the already evaluated `2^2` a second time to produce 96 and repeats that error in practice; the implementation intentionally preserves the displayed expression and correct order-of-operations arithmetic.

Final exact 996x1579 validation matches the target stack: sidebar width 220, header y=89-326, tabs y=337-383, four-step flow y=394-486, dedicated substitution workspace y=497-966, learning cards y=978-1210, practice y=1222-1477, and adjacent navigation y=1493-1548. The target omits the site footer at this viewport; the dedicated route does the same. Validation reports no horizontal overflow and zero console messages.

Evidence:

- `0338-reference.png`
- `0338-desktop.png`
- `0338-dedicated-target-validation.json`
