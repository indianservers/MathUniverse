# Problem Solver Phase 2 Report

## 1. Summary

Phase 2 added a route-local intent classification layer for `/problem-solver` so the page no longer treats every input as an equation in `x`.

Implemented:

- A typed intent model for problem classification and solver responses.
- A browser-only classifier for equations, simplify/factor/expand commands, calculus intents, systems, statistics, matrices, evaluation, and unsupported prompts.
- Classifier-first page flow in `StepByStepProblemSolver`.
- Safe placeholder responses for detected but not-yet-implemented operations.
- A "Detected Problem Type" panel showing type, confidence, normalized input, assumptions, warnings, and reason.
- Unsupported-input suggestions.
- Automated classifier tests for all required Phase 2 cases.

No backend/API dependency was added.

## 2. Files Added

| File | Purpose |
| --- | --- |
| `src/problem-solver/problemTypes.ts` | Route-local typed model for intent kinds, classification objects, and solver results. |
| `src/problem-solver/problemClassifier.ts` | Safe classifier and extraction helpers for Problem Solver input routing. |
| `src/problem-solver/problemClassifier.test.ts` | Vitest coverage for required intent classification cases. |
| `problem-solver-phase-2-report.md` | This completion report. |

## 3. Files Modified

| File | Change |
| --- | --- |
| `src/pages/StepByStepProblemSolver.tsx` | Calls classifier first, routes only equation intents to existing symbolic solve, renders classification panel, safe placeholders, and unsupported suggestions. |

Shared symbolic utilities were not modified.

## 4. Classifier Design

The classifier is conservative and route-local. It receives raw input and returns a `ProblemClassification` with:

- `kind`
- `rawInput`
- `normalizedInput`
- optional `expression`
- optional `variable` / `variables`
- `confidence`
- `assumptions`
- `warnings`
- `reason`

Classification order:

1. Empty input -> `unsupported`
2. Matrix-like input or matrix operation keyword -> `matrix`
3. Multiple equations joined by `and`, newline, or semicolon -> `system`
4. Explicit commands -> `simplify`, `factor`, `expand`, `derivative`, `integral`, `limit`
5. Statistics commands -> `statistics`
6. Single equation -> degree-based `linear-equation`, `quadratic-equation`, or `polynomial-equation`
7. Numeric/trig expression -> `evaluate`
8. Word-problem style prompt -> `unsupported`
9. Anything unclear -> `unsupported`

Only `linear-equation`, `quadratic-equation`, and `polynomial-equation` are routed to the existing Nerdamer-backed `symbolicSolve` in Phase 2. Other intents render safe detection output and explicitly state that no equation-solving fallback was used.

## 5. Supported Intent Types

| Intent | Detection Rule | Status | Notes |
| --- | --- | --- | --- |
| `linear-equation` | One-variable equation with max degree 1 | Solves using existing symbolic solver | Steps remain generic CAS wrapper steps. |
| `quadratic-equation` | One-variable equation with max degree 2 | Solves using existing symbolic solver | No real factoring/quadratic-formula steps yet. |
| `polynomial-equation` | One-variable equation with max degree above 2 | Solves using existing symbolic solver | Safe routing only; advanced step logic deferred. |
| `simplify` | `simplify ...`, `simplify(...)`, `reduce ...` | Detected only | Safe placeholder, no wrong equation solve. |
| `factor` | `factor ...`, `factorise ...`, `factorize ...` | Detected only | Solver implementation deferred. |
| `expand` | `expand ...` | Detected only | Solver implementation deferred. |
| `evaluate` | Plain numeric expression or supported function call like `sin(30)` | Detected only | No degree/radian or numeric evaluation yet. |
| `derivative` | `derivative of ...`, `differentiate ...`, `d/dx ...`, `dy/dx ...` | Detected only | Solver implementation deferred. |
| `integral` | `integrate ...`, `integral of ...`, `∫ ...`, mojibake `âˆ« ...` | Detected only | Solver implementation deferred. |
| `limit` | `limit ...`, `lim x->0 ...`, arrow variants | Detected only | Solver implementation deferred. |
| `system` | Multiple equations joined by `and`, semicolon, or newline | Detected only | Does not call equation solver incorrectly. |
| `statistics` | `mean of ...`, `median of ...`, `mode of ...`, `variance of ...`, `standard deviation of ...` | Detected only | Solver implementation deferred. |
| `matrix` | `[[...]]`, `matrix ...`, `determinant ...`, `inverse ...` | Detected only | Solver implementation deferred. |
| `unsupported` | Empty, risky, word-problem style, or unclear input | Safe unsupported state | Shows suggestions. |

## 6. Test Results

Automated:

- `npm test -- problemClassifier symbolic`
- Result: 2 test files passed, 21 tests passed.

TypeScript:

- `npm run typecheck`
- Result: passed.

Manual browser verification:

- Target: `http://localhost:3526/problem-solver`
- Verified visible updated UI with the `Detected Problem Type` panel.
- Verified preset interactions for:
  - `x^2-5*x+6=0` -> `Quadratic Equation`, existing solving still works.
  - `simplify (x^2 - 1)/(x - 1)` -> `Simplify`, safe placeholder, no equation-solving fallback.
  - `derivative of x^3 + 2x` -> `Derivative`, safe placeholder, no equation-solving fallback.
  - `mean of 4, 6, 8, 10` -> `Statistics`, safe placeholder, no equation-solving fallback.
- Console errors/warnings during the preset browser verification: none captured.

Note: direct browser automation typing was blocked by the in-app browser automation environment's virtual clipboard limitation, so the full typed-input matrix was verified through automated classifier tests and the visible page was verified through clickable presets.

## 7. Inputs Fixed From Phase 1 Audit

| Input | Old Behavior | New Behavior |
| --- | --- | --- |
| `simplify (x^2 - 1)/(x - 1)` | Treated as equation and returned `x = -1`. | Classified as `simplify`; shows expression and safe Phase 3 placeholder. |
| `derivative of x^3 + 2x` | Treated as equation involving fake symbol `derivativeofx`. | Classified as `derivative`; no equation-solving fallback. |
| `integrate 2x` | Treated as `integrate*2*x=0` and returned `x = 0`. | Classified as `integral`; no equation-solving fallback. |
| `sin(30)` | Treated as `sin(30)=0` and returned no symbolic solution for `x`. | Classified as `evaluate`; no equation-solving fallback. |
| `solve 2x + y = 7 and x - y = 2` | Solve failed, then simplification discarded most of the input. | Classified as `system`; normalized as `2*x+y=7; x-y=2`; no wrong simplification. |
| `mean of 4, 6, 8, 10` | Treated as symbolic text and returned `(4*meanof,6,8,10)`. | Classified as `statistics`; no equation-solving fallback. |

## 8. Risk Review

Confirmed:

- No backend or API dependency was added.
- No shared layout files were modified.
- No global state was modified.
- `src/utils/symbolic.ts` was not modified.
- Routing in `src/App.tsx` was not modified.
- The implementation is browser-only/offline-compatible.
- Existing linear/quadratic equation solving remains routed to the previous symbolic solver.

Changed scope was limited to:

- `src/pages/StepByStepProblemSolver.tsx`
- new `src/problem-solver/*` files
- this report file

## 9. Remaining Limitations

- This is not full Wolfram Alpha functionality.
- Non-equation intents are classified but not solved yet.
- Equation steps are still generic CAS-wrapper explanations.
- No real linear-equation transformation steps yet.
- No quadratic factoring, completing-square, or quadratic-formula step generation yet.
- No rational simplification with domain restrictions yet.
- No actual derivative/integral/limit/statistics/matrix solving in the `/problem-solver` UI yet.
- No graph, alternate methods, assumptions editor, exact/numeric toggle, or educational rule explanations yet.

## 10. Recommended Phase 3

Phase 3 should implement a real Algebra Step Generator for:

- linear equations
- quadratic equations
- rational simplification/equations with excluded values

Recommended Phase 3 priorities:

1. Build deterministic linear equation steps: normalize, collect terms, isolate variable, divide, verify.
2. Build quadratic detection paths: factoring first, then quadratic formula fallback.
3. Add rational-expression simplification with cancelled-factor warnings and domain restrictions.
4. Add answer verification by substitution.
5. Keep the classifier from Phase 2 as the routing gate so unsupported intents never fall into wrong solvers.
