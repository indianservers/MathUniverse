# Phase 1 Problem Solver Trust Audit

## Scope

Phase 1 focuses on correctness trust, safe unsupported handling, and result transparency for the browser-only Step-by-Step Problem Solver. It does not expand the solver into a general CAS and does not modify unrelated math modules.

## Implemented

- Added a shared typed solver result contract in `src/problem-solver/types/solverResult.ts`.
- Added `solveProblem` in `src/problem-solver/problemSolverEngine.ts` to adapt existing solver outputs into the trust contract.
- Added confidence labels: `verified`, `partially-supported`, `unsupported`, `ambiguous`, and `error`.
- Added safe unsupported result creation through `createUnsupportedResult`.
- Preserved existing deterministic solvers for algebra, expressions, calculus, systems, statistics, matrix, and word problems.
- Exposed trust status and verification notes in `StepByStepProblemSolver`.
- Added classifier gates for recognized but uncertified advanced topics:
  - Laplace/Fourier transforms
  - numerical methods
  - differential equations
  - advanced engineering math
  - proof/theorem requests
  - plot/graph requests
- Allowed variable-free equations such as `5 = 5` and `7 = 8` to reach deterministic identity/contradiction handling.

## Degenerate Equations

The deterministic algebra solver now certifies these forms through the trust wrapper:

- `0x + 5 = 5`: identity, all real numbers.
- `x = x`: identity, all real numbers.
- `x + 1 = x + 1`: identity, all real numbers.
- `0x + 5 = 8`: contradiction, no solution.
- `x + 1 = x + 2`: contradiction, no solution.
- `7 = 8`: contradiction, no solution.

Each result includes verification notes from the algebra solver and is marked `verified`.

## Trust Policy

- `verified`: deterministic supported solver produced a copyable answer.
- `partially-supported`: a CAS-assisted path produced an answer but not a fully deterministic human derivation.
- `unsupported`: no answer is generated; the UI explains why and suggests supported examples.
- `ambiguous` and `error`: reserved in the shared contract for later phases.

## Golden Tests

Added `src/problem-solver/problemSolverTrustCertification.test.ts`.

Coverage:

- 30 arithmetic expressions.
- 25 linear equations.
- 15 factorable quadratic equations.
- 8 identity/contradiction equations.
- 12 expression/trigonometry/log/domain-safe examples.
- 10 calculus/statistics/matrix examples.
- 2 partially supported CAS-assisted examples.
- 10 unsupported advanced-topic examples.

Total golden cases: 102.

## UI Trust Surface

`StepByStepProblemSolver` now shows:

- Trust status badge.
- Verification method.
- Solver family.
- Unsupported reason when applicable.
- Verification notes before result cards.

Copy remains disabled for unsupported results.

## Known Limitations

- This phase certifies result labeling and safety, not full mathematical coverage.
- CAS-assisted outputs are intentionally marked partially supported.
- Full-repo test/lint debt outside problem-solver remains out of scope.
- Browser visual QA was not added in this phase.
