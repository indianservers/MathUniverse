# Phase 4 immutable baseline — 2026-08-20

This report records the repository before Phase 4 implementation. It does not infer correctness from route or command existence.

## Phase 1–3 gates

`npm run verify:phase3` exited successfully before Phase 4 changes. Math foundation 39/39, truth layer 4/4, document 4/4, Phase 2 15/15, Phase 2 benchmark 2/2, Phase 3 21/21, curriculum 7/7, and practice-family 3/3 checks passed. Type-checking and both production builds passed with the existing large-chunk warning.

## CAS inventory

- `src/cas/casCommandRegistry.ts`: 154 commands marked `implemented`; none marked partial or planned.
- The executable surface delegates to `src/utils/symbolic.ts`, which contains several command-specific string/matrix/list parsers and numerical evaluators alongside the universal `src/math-foundation/parser.ts`.
- Existing CAS results use `status: ok/error/planned/partial` and expose `steps: string[]`. Those strings are not versioned transformation-rule records.
- Existing notebook assumptions are free-form strings. They are displayed and forwarded but do not consistently alter every symbolic transformation.
- Candidate-root verification exists for supported legacy solvers, but conditions, branches, excluded values, precision, and convergence are not represented by one required result type.

## Probability inventory

- 27 visual distribution specifications: 11 discrete and 16 continuous.
- Specifications provide parameter sliders, sampled points, and basic summary text.
- They do not all expose one consistent PMF/PDF, CDF, survival, log probability, quantile, sampling, estimation, goodness-of-fit, and stable-tail contract.

## Tables and statistics

- Spreadsheet workbooks support formulas, dependency/cycle checks, delimited paste, summary statistics, and simple linear regression.
- The default workbook is demonstration-oriented. General typed dataframe transformations, immutable parents, invalid-conversion rows, joins/reshape, analysis cards, and model/inference assumption registries were absent.
- Regression and probability pages include useful computations, but general dataset-driven regression and inference were not exposed as one integrated production workflow.

## Duplicate or parallel computation surfaces

- Universal parser/evaluator: `src/math-foundation/parser.ts`, `evaluator.ts`.
- CAS command parser: `src/cas/casParser.ts` for command syntax.
- Legacy symbolic helpers: `src/utils/symbolic.ts` includes literal, matrix, vector, list, complex, polynomial, and solution parsing.
- General math utility parser: `src/utils/mathEngine/parser.ts`.
- Spreadsheet formula parser/evaluator: `src/workspace/spreadsheetStudioEngine.ts`.

Phase 4 must not add another expression language. Its certified layer therefore uses the universal AST for mathematical identity and the existing CAS command parser/executor for the legacy command surface.

## Baseline capability conclusion

The repository had broad calculation breadth, graphing and spreadsheet functionality. It did not yet have a unified certified CAS result, versioned rule-linked steps, consistent assumptions/branches, a general immutable dataframe, stable distribution API, seeded analysis provenance, or portable structured analysis cards.
