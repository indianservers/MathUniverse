# Problem Solver Phase 3 Report

## 1. Summary

Phase 3 adds deterministic, browser-only algebra step generation to `/problem-solver` for supported linear equations, quadratic equations, and simple rational equations.

The page still uses the Phase 2 classifier as the routing gate. Supported algebra forms now use real generated steps before any CAS fallback. Unsupported algebra forms can still use the existing Nerdamer solver, but the UI labels that path as "CAS fallback" and explicitly says those are not human derivation steps.

No backend/API dependency was added.

## 2. Files Added

| File | Purpose |
| --- | --- |
| `src/problem-solver/algebraStepSolver.ts` | Deterministic algebra parser and step generator for linear, quadratic, and simple rational equations. |
| `src/problem-solver/algebraStepSolver.test.ts` | Unit tests for required linear, quadratic, and rational examples. |
| `problem-solver-phase-3-report.md` | This Phase 3 completion report. |

## 3. Files Modified

| File | Change |
| --- | --- |
| `src/pages/StepByStepProblemSolver.tsx` | Integrates deterministic algebra steps, method/final-answer summary cards, verification steps, restrictions, warnings, and labeled CAS fallback. |
| `src/problem-solver/problemTypes.ts` | Adds optional method, restrictions, and verification fields to the route-local result model. |

## 4. Algebra Step Solver Design

The solver is local to `src/problem-solver/` and does not modify shared symbolic utilities.

Design:

- Normalizes implicit multiplication such as `2x` -> `2*x`.
- Parses supported polynomial expressions with a small route-local parser.
- Represents expressions as polynomial coefficients up to degree 2.
- Solves linear equations by isolating `x`.
- Solves quadratics by factoring when integer roots are easy, otherwise by quadratic formula.
- Detects simple rational equations with one variable denominator.
- Extracts denominator restrictions.
- Clears denominators.
- Solves the resulting polynomial equation.
- Rejects candidate roots that violate denominator restrictions.
- Generates explicit verification text by substitution.

Nerdamer is not used as the primary step source for these supported forms.

## 5. Supported Equation Types

| Equation Type | Example | Method | Status |
| --- | --- | --- | --- |
| Linear equation | `2x + 5 = 15` | Linear isolation | Implemented |
| Linear with negative coefficient | `-2x + 4 = 8` | Linear isolation | Implemented |
| Linear with constant denominator | `x/3 + 2 = 5` | Linear isolation | Implemented |
| Factorable quadratic | `x^2 - 5x + 6 = 0` | Factoring | Implemented |
| Difference of squares | `x^2 - 4 = 0` | Factoring | Implemented |
| Scaled quadratic | `2x^2 - 8 = 0` | Factoring / quadratic formula support | Implemented |
| Simple rational equation | `(x^2 - 1)/(x - 1) = 0` | Clear denominators, reject invalid root | Implemented |
| Simple rational equation | `(x + 2)/(x - 3) = 5` | Clear denominators | Implemented |
| Reciprocal equation | `1/(x+1) = 2` | Clear denominators | Implemented |
| Unsupported algebra | Higher/complex forms outside parser scope | CAS fallback | Safe fallback only |

## 6. Test Results

Automated:

- `npm test -- algebraStepSolver problemClassifier symbolic`
- Result: 3 test files passed, 32 tests passed.

TypeScript:

- `npm run typecheck`
- Result: passed.

Required solver cases covered:

- `2x + 5 = 15` -> `x = 5`
- `3x - 7 = 11` -> `x = 6`
- `-2x + 4 = 8` -> `x = -2`
- `x/3 + 2 = 5` -> `x = 9`
- `x^2 - 5x + 6 = 0` -> `x = 2, 3`
- `x^2 + 5x + 6 = 0` -> `x = -3, -2`
- `x^2 - 4 = 0` -> `x = -2, 2`
- `2x^2 - 8 = 0` -> `x = -2, 2`
- `(x^2 - 1)/(x - 1) = 0` -> `x = -1`, restriction `x != 1`
- `(x + 2)/(x - 3) = 5` -> `x = 4.25`, restriction `x != 3`
- `1/(x+1) = 2` -> `x = -0.5`, restriction `x != -1`

## 7. Manual Browser Verification

Target: `http://localhost:3526/problem-solver`

Verified through visible preset interactions:

- `2*x+5=11`
  - Type: Linear Equation
  - Method: Linear isolation
  - Final answer: `x = 3`
  - Real isolation steps shown.
- `x^2-5*x+6=0`
  - Type: Quadratic Equation
  - Method: Factoring
  - Final answer: `x = 2, 3`
  - Factoring, zero-product, and verification steps shown.
- `(x^2 - 1)/(x - 1) = 0`
  - Solver response type: Rational Equation
  - Method: Rational equation clearing denominators
  - Final answer: `x = -1`
  - Domain restriction: `x != 1`
  - Invalid root rejection shown.
- `derivative of x^3 + 2x`
  - Still classified safely as Derivative.
  - No equation-solving fallback used.
- `mean of 4, 6, 8, 10`
  - Still classified safely as Statistics.
  - No equation-solving fallback used.

Console errors/warnings during browser preset verification: none captured.

Note: direct browser automation typing is still blocked by the in-app browser automation environment's virtual clipboard limitation, so manual verification used page-visible preset buttons and automated tests covered the full requested typed-input matrix.

## 8. Before vs After

| Input | Old Phase 2 Behavior | New Phase 3 Behavior |
| --- | --- | --- |
| `2x + 5 = 15` | Correctly classified and solved through CAS-style generic steps. | Solved with real linear isolation steps and substitution check. |
| `3x - 7 = 11` | Classified as linear and solved through generic CAS wrapper if typed. | Solved with linear isolation, final `x = 6`, verification. |
| `x/3 + 2 = 5` | Classified as linear and solved through generic CAS wrapper if typed. | Solved with linear isolation, final `x = 9`, verification. |
| `x^2 - 5x + 6 = 0` | Correctly classified and solved through CAS-style generic steps. | Solved with factoring steps, zero-product rule, final `x = 2, 3`, verification. |
| `2x^2 - 8 = 0` | Classified as quadratic and solved through generic CAS wrapper if typed. | Solved with quadratic path, final `x = -2, 2`, verification. |
| `(x^2 - 1)/(x - 1) = 0` | Classified by degree and would rely on generic equation solving. | Solved as rational equation with restriction `x != 1` and invalid root rejection. |
| `derivative of x^3 + 2x` | Safely classified as derivative placeholder in Phase 2. | Same safe behavior preserved; not routed to algebra solving. |
| `mean of 4, 6, 8, 10` | Safely classified as statistics placeholder in Phase 2. | Same safe behavior preserved; not routed to algebra solving. |

## 9. CAS Fallback Handling

CAS fallback is only used after:

1. Phase 2 classifier detects an equation intent.
2. Phase 3 deterministic algebra solver returns no supported step result.

Fallback behavior:

- UI method is labeled `CAS fallback`.
- First fallback step states that deterministic algebra does not support the exact equation form.
- Second fallback step states that CAS wrapper steps are not a human derivation.
- Existing Nerdamer result is still available for safe supported symbolic solving.

This avoids fake step generation.

## 10. Known Limitations

- Parser supports only one-variable equations in `x`.
- Polynomial parser is intentionally limited to degree 2 for deterministic steps.
- Rational solver supports simple single-fraction equations and simple denominators.
- Complex roots are not expanded in Phase 3.
- Decimal final answers are used for some rational equations, e.g. `x = 4.25`.
- Classification panel may still classify rational examples by polynomial degree, but the solver response correctly labels the method as rational equation clearing denominators.
- Full simplify/factor/expand operations are still not implemented in the `/problem-solver` UI.
- Derivative, integral, limit, matrix, statistics, and word-problem solving remain safely classified but not solved.

## 11. Recommended Phase 4

Recommended next phase: Expression Operations.

Phase 4 should implement:

- Simplify command execution.
- Factor command execution.
- Expand command execution.
- Domain restrictions for simplification.
- Final answer rendering for expression operations.
- Step-by-step expression transformations for simple cases.

Priority examples:

- `simplify (x^2 - 1)/(x - 1)` -> `x + 1`, with `x != 1`.
- `factor x^2 - 5x + 6` -> `(x - 2)(x - 3)`.
- `expand (x+1)^2` -> `x^2 + 2x + 1`.
