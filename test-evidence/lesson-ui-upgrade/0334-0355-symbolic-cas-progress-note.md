# Symbolic Mathematics / CAS Workspace target batch 0334-0355

Dedicated rebuild target: **11 of 22 lessons completed; 11 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0334 | 428 Symbolic Evaluation | `editable-linear-expression-parse-transform-substitution-practice` | Reworked individually and browser-validated |
| 0335 | 429 Simplify | `factor-multiset-cancellation-preserved-domain-equivalence-practice` | Reworked individually and browser-validated |
| 0336 | 430 Expand | `parsed-binomial-four-products-area-tiles-combine-practice` | Reworked individually and browser-validated |
| 0337 | 431 Factor | `monic-quadratic-factor-pair-roots-area-tiles-challenge` | Reworked individually and browser-validated |
| 0338 | 432 Substitute | `dual-occurrence-substitution-tree-order-of-operations-practice` | Reworked individually and browser-validated |
| 0339 | 433 Solve | `balanced-quadratic-inverse-operations-factor-roots-verification` | Reworked individually and browser-validated |
| 0340 | 434 Numerical Solve | `adaptive-bisection-newton-iteration-graph-residual-practice` | Reworked individually and browser-validated |
| 0341 | 435 Solve Systems | `two-equation-determinant-elimination-intersection-drag-classification-practice` | Reworked individually and browser-validated |
| 0342 | 436 Eliminate Variables | `row-multiplier-matrix-addition-reduction-back-substitution-practice` | Reworked individually and browser-validated |
| 0343 | 437 Partial Fractions | `distinct-linear-factor-residue-coefficients-drag-recombine-practice` | Reworked individually and browser-validated |
| 0344 | 438 Polynomial Division | `linked-polynomial-long-synthetic-division-identity-practice` | Reworked individually and browser-validated |

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

## Lesson 433 / Mockup 0339 - Solve

Reworked individually around a dedicated monic-quadratic balance model. The editable equation parser derives `b`, `c`, the integer factor pair, both roots, canonical factors, substitution checks, algebra tiles, cancellation state, and every displayed balance row from one coherent model. The inverse-operation chips support real click, keyboard, and drag/drop progression; equation editing, model-view selection, fullscreen, independent two-root practice checking, solution reveal, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `x^2-5x+6=0`, derives factor pair `-2, -3`, factors `(x - 2)(x - 3)`, and roots `2, 3`. It edits the equation to `x^2+2x-8=0` and derives factors `(x + 4)(x - 2)` with roots `-4, 2`; then restores the target equation, drags the add-linear operation, applies subtraction and factoring, opens and closes fullscreen, rejects practice roots `-4, 3`, accepts `-4, 2`, reveals the solution, and resets cleanly.

Final exact 1012x1555 validation matches the target stack: sidebar width 205, header y=110-353, tabs y=369-415, four-step flow y=505-598, dedicated balance workspace y=615-1258, misconception/practice y=1274-1419, lab y=426-1476, and adjacent navigation y=1485-1546. It reports no horizontal overflow and zero console messages.

Evidence:

- `0339-reference.png`
- `0339-desktop.png`
- `0339-dedicated-target-validation.json`

## Lesson 434 / Mockup 0340 - Numerical Solve

Reworked individually around a dedicated graph-linked numerical root model. The editable monic-quadratic parser drives the function graph, endpoint values, interval shading, adaptive bisection table, safeguarded Newton iterations, root estimate, residual, convergence status, and worked example. Method switching, interval/function/tolerance/max-iteration editing, Start Solve, Reset All, fullscreen, shell Reset, independent `cos(x)-x` bracket practice, hint, and Previous/Next navigation are functional.

Browser validation starts from `x^2-5x+6` on `[1,4]` and converges to the first root near 2 with residual below `1e-6`. It switches to safeguarded Newton and converges in five iterations without dividing by the zero derivative at the mockup's midpoint, then edits the function to `x^2+2x-8` and again derives root 2. The challenge rejects `[0,0.5]`, accepts `[0,1]`, reveals its mathematically verified hint, and resets cleanly. The target incorrectly labels `f(4)=-2` for `x^2-5x+6`; the implementation correctly reports `f(4)=2` and performs a midpoint isolation step before bisection rather than claiming a nonexistent initial sign change.

Final exact 1024x1536 validation matches the target stack: sidebar width 208, header y=103-299, tabs y=310-358, dedicated numerical workspace y=368-970, four-step flow y=981-1097, learning panels y=1106-1317, misconception/practice y=1326-1471, and adjacent navigation y=1480-1536. It reports no horizontal overflow and zero console messages.

Evidence:

- `0340-reference.png`
- `0340-desktop.png`
- `0340-dedicated-target-validation.json`

## Lesson 435 / Mockup 0341 - Solve Systems

Reworked individually around a dedicated two-equation linear-system model. Editable coefficients and constants drive determinant classification, exact intersection coordinates, both plotted lines, a five-step elimination derivation, solution formatting, and the system-type state. Method selection, equation editing, graph zoom, fullscreen, unique/no-solution/infinite example controls, keyboard movement, true pointer dragging of the intersection, independent practice checking, hint, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `2x+3y=13` and `x-y=1`, deriving the unique solution `(3.2,2.2)`. Editing the first constant to 14 updates the solution to `(3.4,2.4)`. A real pointer drag moves the intersection to approximately `(3.59,2.2)` and recalculates both constants so the dragged point remains on both lines. Validation also exercises zoom, switches to mathematically valid parallel and coincident examples, selects Substitution, rejects practice `(2.5,2)`, accepts `(2.5,2.25)`, reveals the hint, opens/closes fullscreen, and resets cleanly. The target graph labels the initial intersection `(2,3)`, which contradicts both its equations and its own elimination card; the implementation consistently uses the correct `(3.2,2.2)` everywhere.

Final exact 1011x1556 validation matches the target stack: sidebar width 209, compact header y=100-273 with actions y=229-263, custom instruction strip y=284-408, dedicated system workspace y=416-1083, worked-example/misconception/practice row y=1091-1327, insight y=1335-1382, adjacent navigation y=1392-1444, and site footer y=1455-1549. It reports no horizontal overflow and zero console messages.

Evidence:

- `0341-reference.png`
- `0341-desktop.png`
- `0341-dedicated-target-validation.json`

## Lesson 436 / Mockup 0342 - Eliminate Variables

Reworked individually around a dedicated row-operation model. Two source equations and independently editable row multipliers drive the scaled elimination matrix, row-addition coefficients, eliminated-variable detection, reduced equation, back-substitution, final solution, verification, and worked example. Auto-check, main multipliers, independent practice multipliers, exact answer checking, back-substitution verification, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from the coherent system `2x+3y=-2`, `x-y=4` with multipliers `1,-2`, producing `0x+5y=-10`, `y=-2`, and `x=2`. Changing the second multiplier to `-1` correctly yields `x+4y=-6` and reports that no variable has yet been eliminated; restoring `-2` restores the solution. The separate challenge scales `3x+2y=5` and `5x-2y=-1` by `5,-3`, derives `16y=28`, rejects `y=2`, and accepts `y=1.75`. The target image combines incompatible equations, matrix coefficients, row sums, and verification values; the implementation preserves its layout while keeping every displayed calculation internally consistent.

Final exact 1012x1554 validation matches the target stack: sidebar width 221, compact header y=94-284, tabs y=291-341, four-step flow y=364-479, elimination workspace y=503-919, rule/misconception y=928-1100, worked example y=1107-1241, practice y=1248-1478, and adjacent navigation y=1487-1544. It reports no horizontal overflow and zero console messages.

Evidence:

- `0342-reference.png`
- `0342-desktop.png`
- `0342-dedicated-target-validation.json`

## Lesson 437 / Mockup 0343 - Partial Fractions

Reworked individually around a dedicated distinct-linear-factor residue model. The factor list drives each denominator slot, cover-up denominator, coefficient, decomposition term, and a true polynomial recombination of `Ai * product(x+kj)` terms. Custom workspace tabs, real factor-slot drag/reordering, keyboard reordering, adding a third distinct factor, quick-check toggle, independent practice inputs, hint, practice reset, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `1/((x+1)(x+2))`, derives coefficients `1,-1`, and reconstructs numerator `1`. Dragging the factor chips into the opposite order changes the ordered coefficients to `-1,1` while preserving the same rational expression. Adding `(x+3)` derives the three residues `1/2,-1,1/2`, and coefficient-by-coefficient polynomial recombination again proves numerator `1`. The practice rejects `A=1/4,B=1/4`, accepts `A=1/4,B=-1/4`, reveals the root-substitution hint, resets independently, and then shell-resets cleanly.

Final exact 1023x1537 validation matches the target stack: sidebar width 208, compact header y=97-326, custom tabs y=336-375, dedicated decomposition workspace y=381-989, misconception/practice y=1003-1260, takeaways y=1277-1370, adjacent navigation y=1388-1431, and site footer y=1447-1537. It reports no horizontal overflow and zero console messages.

Evidence:

- `0343-reference.png`
- `0343-desktop.png`
- `0343-dedicated-target-validation.json`

## Lesson 438 / Mockup 0344 - Polynomial Division

Reworked individually around a dedicated linked polynomial-division model. Editable dividend and divisor coefficient arrays drive the quotient, every long-division subtraction row, the remainder, the synthetic products and accumulated row, and a coefficient-by-coefficient reconstruction of `P(x) = D(x)Q(x) + R(x)`. Long/synthetic mode switching, invalid-divisor handling, Clear all, shell Reset, independent practice inputs, answer checking, solution reveal, lesson tabs, and Previous/Next navigation are functional.

Browser validation starts from `(2x^4 + 3x^3 - x^2 + 4x - 2) / (2x - 4)`, derives the mathematically correct quotient `x^3 + 3.5x^2 + 6.5x + 15` and remainder `58`, and reconstructs the original dividend exactly. Editing the leading dividend coefficient to `3` recalculates the quotient to `1.5x^3 + 4.5x^2 + 8.5x + 19`, remainder `74`, and a matching identity. Validation also switches to the live synthetic view, rejects a zero leading divisor, rejects an incorrect practice constant, accepts `Q(x)=3x^2+8x+11, R=23`, reveals the answer, and resets to a clean initial state. The mockup's result panel shows coefficients unrelated to its own long-division rows; the implementation keeps the visual layout while using the coherent result proved by those rows and the identity check.

Final exact 1016x1548 validation matches the target stack: sidebar width 203, header y=91-317, tabs y=325-367, four-step flow y=377-463, dedicated workspace y=473-1169, learning row y=1179-1321, practice y=1331-1395, adjacent navigation y=1405-1453, and site footer y=1463-1548. It reports no horizontal overflow and zero console messages.

Evidence:

- `0344-reference.png`
- `0344-desktop.png`
- `0344-dedicated-target-validation.json`
