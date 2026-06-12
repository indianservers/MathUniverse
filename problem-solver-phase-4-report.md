# Problem Solver Phase 4 Report

## 1. Summary

Phase 4 adds real browser-only expression-operation workflows to `/problem-solver` while preserving the Phase 2 classifier and Phase 3 algebra step solver. The module now produces deterministic educational steps for supported simplify, factor, expand, and evaluate inputs, including simple rational-expression domain restrictions.

No backend/API dependency was added. No shared symbolic utility was modified.

## 2. Files Added

| File | Purpose |
| --- | --- |
| `src/problem-solver/expressionOperationSolver.ts` | Deterministic expression-operation solver for simplify, factor, expand, evaluate, and simple domain restrictions. |
| `src/problem-solver/expressionOperationSolver.test.ts` | Unit tests for Phase 4 expression workflows and domain restrictions. |
| `problem-solver-phase-4-report.md` | Phase 4 implementation and verification report. |

## 3. Files Modified

| File | Change |
| --- | --- |
| `src/pages/StepByStepProblemSolver.tsx` | Integrated Phase 4 solver after equation solving and before safe future-phase placeholders; added expression-operation preset examples. |

## 4. Expression Operation Solver Design

The solver accepts the Phase 2 `ProblemClassification` model and returns the existing `ProblemSolverResult` model used by the page. It is intentionally deterministic and scoped to supported school-level forms.

Solver priority inside `/problem-solver` is:

1. Phase 2 classifier.
2. Phase 3 algebra step solver for equations.
3. Phase 4 expression operation solver for simplify/factor/expand/evaluate.
4. Safe placeholder response for future phases such as calculus, systems, statistics, and matrices.

The Phase 4 solver includes a small local polynomial parser for expressions up to degree 2. It supports addition, subtraction, multiplication, division by constants, powers up to 2, and simple parentheses. Numeric evaluation is offline and limited to whitelisted arithmetic plus `sqrt`, `abs`, `sin`, `cos`, and `tan`.

## 5. Supported Operations

| Operation | Example | Method | Status |
| --- | --- | --- | --- |
| Simplify rational expression | `simplify (x^2 - 1)/(x - 1)` | Factor numerator/denominator, detect restrictions, cancel common factor | Implemented |
| Simplify like terms | `simplify 2x + 3x - 5` | Parse polynomial and combine coefficients | Implemented |
| Reduce rational expression | `reduce (x^2 - 4)/(x - 2)` | Factor/cancel with domain restriction | Implemented |
| Factor quadratic | `factor x^2 - 5x + 6` | Integer/rational quadratic factor matching | Implemented |
| Factor difference of squares | `factor x^2 - 4` | Quadratic integer factorization | Implemented |
| Expand binomial square | `expand (x+1)^2` | Polynomial multiplication and collection | Implemented |
| Expand products | `expand 2(x+1)(x-1)` | Distributive expansion | Implemented |
| Evaluate arithmetic | `2 + 3 * 4` | Numeric precedence evaluation | Implemented |
| Evaluate functions | `sqrt(16)`, `abs(-5)` | Whitelisted numeric function evaluation | Implemented |
| Evaluate trig | `sin(30)`, `cos(60)` | Degree-mode numeric trig assumption | Implemented |

## 6. Domain Restriction Handling

The solver detects simple rational-expression denominator restrictions by factoring the denominator and solving linear factors.

Examples:

| Expression | Restriction |
| --- | --- |
| `(x^2 - 1)/(x - 1)` | `x != 1` |
| `(x^2 - 4)/(x - 2)` | `x != 2` |
| `1/(x+1)` | `x != -1` |

Restrictions are shown before cancellation and repeated in the final answer/warnings. More complex domains such as nested radicals, logs, piecewise expressions, and higher-degree denominators are not fully solved in this phase.

## 7. Test Results

Command run:

```bash
npm test -- expressionOperationSolver algebraStepSolver problemClassifier symbolic
```

Result: 4 test files passed, 50 tests passed.

Command run:

```bash
npm run typecheck
```

Result: passed.

Coverage includes:

| Area | Result |
| --- | --- |
| Simplify rational expressions | Passed |
| Combine like terms | Passed |
| Factor supported quadratics | Passed |
| Expand supported products | Passed |
| Evaluate arithmetic/functions/trig | Passed |
| Domain restrictions | Passed |
| Phase 2 classifier regression | Passed |
| Phase 3 algebra regression | Passed |

## 8. Manual Browser Verification

Manual browser verification was performed at `http://localhost:3526/problem-solver` using the visible preset chips.

| Input | Verified Browser Behavior |
| --- | --- |
| `simplify (x^2 - 1)/(x - 1)` | Shows Simplify, Rational simplification, final `(x + 1), x != 1`, restriction, and steps. |
| `factor x^2 - 5x + 6` | Shows Factor, Integer factorization, final `(x - 2)(x - 3)`, and steps. |
| `expand (x+1)^2` | Shows Expand, Distributive expansion, final `x^2 + 2x + 1`, and steps. |
| `2 + 3 * 4` | Shows Evaluate, Numeric evaluation, final `14`, and arithmetic steps. |
| `sin(30)` | Shows Evaluate, degree-mode trig method, final `0.5`, and degree assumption. |
| `2*x+5=11` | Phase 3 linear solver still returns `x = 3` with real steps. |
| `x^2-5*x+6=0` | Phase 3 quadratic solver still returns `x = 2, 3` with factoring steps. |
| `(x^2 - 1)/(x - 1) = 0` | Phase 3 rational equation solver still returns `x = -1` with restriction-aware steps. |
| `derivative of x^3 + 2x` | Still uses safe future-phase classification; no fake derivative steps. |
| `mean of 4, 6, 8, 10` | Still uses safe future-phase classification; no fake statistics answer. |

Console logs checked during browser verification: no errors or warnings.

## 9. Before vs After

| Input | Previous Behavior | Phase 4 Behavior |
| --- | --- | --- |
| `simplify (x^2 - 1)/(x - 1)` | Classified as Simplify but deferred to future phase. | Shows factorization, cancellation, `x + 1`, and `x != 1`. |
| `factor x^2 - 5x + 6` | Classified as Factor but deferred to future phase. | Shows quadratic coefficients and final `(x - 2)(x - 3)`. |
| `expand (x+1)^2` | Classified as Expand but deferred to future phase. | Shows distributive expansion and final `x^2 + 2x + 1`. |
| `2 + 3 * 4` | Classified as Evaluate but deferred/basic placeholder behavior. | Shows numeric evaluation and final `14`. |
| `sin(30)` | Classified as Evaluate with no actual trig result. | Shows degree assumption and final `0.5`. |

## 10. Risk Review

- No unrelated modules changed.
- No route outside `/problem-solver` was modified.
- `src/utils/symbolic.ts` was not modified.
- Phase 2 classifier remains the first step in the solver flow.
- Phase 3 algebra step solver remains the first solver used for equation inputs.
- Future-phase categories still use safe classification responses instead of fake steps.

## 11. Known Limitations

- This is not full CAS-level simplification.
- Polynomial parsing is intentionally limited to simple one-variable forms up to degree 2.
- Rational simplification handles simple factorable numerator/denominator forms only.
- Complex domains are not fully solved.
- `sqrt(x-2)` and `log(x)` domain warnings are not fully implemented yet.
- Trig evaluation defaults to degrees for plain numeric inputs; no user-facing angle-mode toggle is wired in this phase.
- Calculus, systems, statistics, and matrices remain future phases with safe placeholder handling.

## 12. Recommended Phase 5

Phase 5 should implement a Calculus Engine for `/problem-solver`: derivatives, integrals, and limits with educational step explanations, safe classification-aware fallbacks, and exact/numeric final answer rendering.
