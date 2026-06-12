# Problem Solver Phase 5 Report

## 1. Summary

Phase 5 adds calculus workflows to `/problem-solver` for derivatives, integrals, and limits. The page now returns correct final answers and educational steps for the required common calculus forms instead of safe placeholders.

The implementation remains browser-only and offline-capable. It preserves the Phase 2 classifier, Phase 3 algebra solver, and Phase 4 expression solver. CAS-assisted fallback is used only when deterministic Phase 5 rules do not cover a calculus form, and those results are clearly labeled.

## 2. Files Added

| File | Purpose |
| --- | --- |
| `src/problem-solver/calculusSolver.ts` | Deterministic calculus solver plus clearly labeled CAS-assisted fallback for derivatives, integrals, and limits. |
| `src/problem-solver/calculusSolver.test.ts` | Unit tests for derivative, integral, limit, and routing behavior. |
| `problem-solver-phase-5-report.md` | Phase 5 implementation and verification report. |

## 3. Files Modified

| File | Change |
| --- | --- |
| `src/pages/StepByStepProblemSolver.tsx` | Integrated the Phase 5 calculus solver after algebra and expression workflows; added visible preset examples for calculus and safe future-phase checks. |

## 4. Calculus Solver Design

The solver accepts the Phase 2 `ProblemClassification` model and returns the existing `ProblemSolverResult` model. Routing inside `/problem-solver` now follows this order:

1. Phase 2 classifier.
2. Phase 3 algebra solver for equations.
3. Phase 4 expression solver for simplify/factor/expand/evaluate.
4. Phase 5 calculus solver for derivative/integral/limit.
5. Safe placeholders for system/statistics/matrix and unsupported inputs.

The deterministic Phase 5 engine handles simple one-variable polynomial and trig cases directly. For unsupported calculus forms, it calls the existing browser-side symbolic helper and labels the response as `CAS-assisted result`.

## 5. Supported Calculus Operations

| Operation | Example | Method | Status |
| --- | --- | --- | --- |
| Polynomial derivative | `derivative of x^3 + 2x` | Power, sum, and constant multiple rules | Implemented |
| Quadratic derivative | `differentiate x^2 + 5x + 6` | Term-by-term derivative rules | Implemented |
| Power derivative | `d/dx x^4` | Power rule | Implemented |
| Trig derivative | `derivative of sin(x)` | Basic sine derivative rule | Implemented |
| Polynomial integral | `integrate 2x` | Power rule for antiderivatives | Implemented |
| Polynomial sum integral | `integral of x^2 + 3x` | Term-by-term antiderivative rules | Implemented |
| Trig integral | `integrate cos(x)` | Basic cosine antiderivative rule | Implemented |
| Direct substitution limit | `limit x->2 x^2 + 1` | Substitute approach value and simplify | Implemented |
| Standard sine limit | `lim x->0 sin(x)/x` | Recognized standard radian limit | Implemented |
| Other calculus forms | More complex derivatives/integrals/limits | CAS-assisted result where available | Safe fallback |

## 6. Derivative Handling

Derivatives show:

- Original function.
- Variable, defaulting to `x`.
- Term-by-term differentiation.
- Rule used per term.
- Combined derivative.
- Final answer.

Implemented deterministic rules include constants, powers, constant multiples, sums/differences, `sin(x) -> cos(x)`, and `cos(x) -> -sin(x)`.

## 7. Integral Handling

Integrals show:

- Original integrand.
- Variable, defaulting to `x`.
- Term-by-term integration.
- Rule used per term.
- Constant of integration.
- Final answer.

Every integral result includes the assumption: `For indefinite integrals, a constant of integration + C is included.`

## 8. Limit Handling

Limits show:

- Expression.
- Variable and approach value.
- Direct substitution attempt when applicable.
- Standard limit explanation for `lim x->0 sin(x)/x`.
- CAS-assisted fallback for other supported symbolic forms.
- Final answer.

Direct substitution is used for simple finite expressions like `limit x->2 x^2 + 1`. The standard sine limit is recognized before direct substitution because direct substitution gives `0/0`.

## 9. Test Results

Command run:

```bash
npm test -- calculusSolver expressionOperationSolver algebraStepSolver problemClassifier symbolic
```

Result: 5 test files passed, 64 tests passed.

Command run:

```bash
npm run typecheck
```

Result: passed.

## 10. Manual Browser Verification

Manual browser verification was performed at `http://localhost:3526/problem-solver` using visible preset chips.

| Input | Verified Browser Behavior |
| --- | --- |
| `derivative of x^3 + 2x` | Shows Derivative, Derivative rules, final `3x^2 + 2`, and steps. |
| `differentiate x^2 + 5x + 6` | Shows Derivative, Derivative rules, final `2x + 5`, and steps. |
| `integrate 2x` | Shows Integral, Antiderivative rules, final `x^2 + C`, and constant-of-integration note. |
| `integral of x^2 + 3x` | Shows Integral, Antiderivative rules, final `x^3/3 + 3x^2/2 + C`, and steps. |
| `limit x->2 x^2 + 1` | Shows Limit, Direct substitution, final `5`, and approach value. |
| `lim x->0 sin(x)/x` | Shows Limit, Standard limit, final `1`, and approach value. |
| `2*x+5=11` | Existing linear equation solver still returns `x = 3`. |
| `x^2-5*x+6=0` | Existing quadratic solver still returns `x = 2, 3`. |
| `(x^2 - 1)/(x - 1) = 0` | Existing rational equation solver still returns `x = -1`. |
| `simplify (x^2 - 1)/(x - 1)` | Existing expression solver still returns `(x + 1), x != 1`. |
| `factor x^2 - 5x + 6` | Existing expression solver still returns `(x - 2)(x - 3)`. |
| `expand (x+1)^2` | Existing expression solver still returns `x^2 + 2x + 1`. |
| `2 + 3 * 4` | Existing expression solver still returns `14`. |
| `solve 2x + y = 7 and x - y = 2` | Still safe future-phase classification; no fake system solution. |
| `mean of 4, 6, 8, 10` | Still safe future-phase classification; no fake statistics answer. |
| `[[1,2],[3,4]]` | Still safe future-phase classification; no fake matrix answer. |

Console logs checked during browser verification: no errors or warnings.

## 11. Before vs After

| Input | Previous Behavior | Phase 5 Behavior |
| --- | --- | --- |
| `derivative of x^3 + 2x` | Classified as Derivative but returned safe placeholder. | Shows derivative rules and final `3x^2 + 2`. |
| `differentiate x^2 + 5x + 6` | Classified as Derivative but returned safe placeholder. | Shows derivative rules and final `2x + 5`. |
| `integrate 2x` | Classified as Integral but returned safe placeholder. | Shows antiderivative steps and final `x^2 + C`. |
| `integral of x^2 + 3x` | Classified as Integral but returned safe placeholder. | Shows antiderivative steps and final `x^3/3 + 3x^2/2 + C`. |
| `limit x->2 x^2 + 1` | Classified as Limit but returned safe placeholder. | Shows direct substitution and final `5`. |
| `lim x->0 sin(x)/x` | Classified as Limit but returned safe placeholder. | Shows standard sine limit and final `1`. |

## 12. Risk Review

- No unrelated modules changed.
- Existing algebra equation solving still works.
- Existing expression operations still work.
- System/statistics/matrix inputs still use safe placeholders.
- Shared symbolic utility was not modified.
- CAS-assisted fallback is clearly labeled and does not pretend to be a full human derivation.

## 13. Known Limitations

- This is not full textbook-level calculus derivation yet.
- Product rule, quotient rule, and chain rule are limited to CAS-assisted fallback unless the form is simple enough for deterministic rules.
- Definite integrals are not supported yet.
- Complex limit forms may use CAS-assisted fallback.
- Multivariable calculus is not supported in `/problem-solver` Phase 5.

## 14. Recommended Phase 6

Phase 6 should implement a Systems of Equations Solver for `/problem-solver`: 2x2 and 3x3 systems with substitution, elimination, matrix method, and verification.
