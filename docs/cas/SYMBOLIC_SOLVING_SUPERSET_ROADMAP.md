# Symbolic Solving Superset Roadmap

## Goal

Make Math Universe's browser-only symbolic solving feel stronger than a static CAS page by combining exact algebra, step explanations, visual verification, notebook memory, and connected learning paths.

The ambition is not to clone WolframAlpha or GeoGebra CAS feature-for-feature on day one. The product direction is to exceed them for students and teachers by making every supported symbolic result explainable, visual, verifiable, and reusable inside the browser.

## Competitive Position

### WolframAlpha Strengths

- Very broad mathematical coverage.
- Natural-language parsing.
- Strong numeric and symbolic backends.
- Step-by-step explanations for many paid flows.

### GeoGebra CAS Strengths

- Classroom-friendly CAS commands.
- Strong graph/geometry/CAS integration.
- Lightweight enough for student use.

### Math Universe Advantage Target

- Browser-only exact solving with no server dependency.
- Step-by-step explanations by default.
- Visual proof and formula links beside symbolic work.
- CAS notebook memory and export.
- Teacher-friendly routes, screenshots, and classroom projection.
- Trust labels and verification checks instead of opaque answers.

## Phase Plan

### Phase 1: Symbolic Core Strengthening

Improve the shared symbolic engine and expose the new operations through the CAS notebook.

Scope:

- Better student notation normalization.
- Definite integrals.
- Tangent-line solving.
- Identity verification with exact and numeric-sampling fallback.
- Notebook operation support and tests.

Status: complete.

### Phase 2: Equation Solving Depth

Target:

- Linear, quadratic, polynomial, rational, radical, absolute-value, exponential, logarithmic, and trigonometric equation families.
- Domain restrictions and extraneous-root checks.
- Real/complex mode labeling.

Status: started. The first solve-depth upgrade is complete for CAS fallback candidate guardrails.

### Phase 3: Step Explanation Engine

Target:

- Transformation-by-transformation symbolic steps.
- Rule names for every move.
- Verification after each transformation.
- Student-friendly and exam-mode explanations.

### Phase 4: CAS + Graph + Visual Proof Sync

Target:

- Graph answers beside symbolic roots.
- Tangent/normal lines plotted from CAS results.
- Area/integral visuals from CAS integral cells.
- Related formulas, theorem pages, and Visual Proof links.

### Phase 5: Browser Certification Matrix

Target:

- Browser tests for equation solving, simplification, calculus, notebook memory, graph sync, and mobile layout.
- CAS trust certificate with supported/partial/unsupported labels.

## Phase 1 Implementation

### Files Modified

- `src/utils/symbolic.ts`
- `src/utils/symbolic.test.ts`
- `src/cas/casNotebookEngine.ts`
- `src/cas/casNotebookEngine.test.ts`

### Features Added

#### Student Notation Normalization

The symbolic parser now accepts common classroom input forms:

- Unicode minus signs.
- Multiplication symbols such as `×` and `·`.
- Division symbol `÷`.
- Pi symbol `π`.
- Square root symbol `√`.
- Trigonometric powers such as `sin^2(x)`.

#### Definite Integrals

Added `symbolicDefiniteIntegral(expression, lower, upper, variable)`.

Example:

`symbolicDefiniteIntegral("x^2", "0", "2")` returns `8/3`.

#### Tangent Lines

Added `symbolicTangentLine(expression, point, variable)`.

Example:

`symbolicTangentLine("x^2", "3")` returns `y = -9+6*x`.

#### Identity Verification

Added `symbolicVerifyIdentity(left, right, variable)`.

The verifier first tries exact simplification. If exact simplification is inconclusive, it runs numeric sampling and reports the verification method.

Example:

`tan(x)` vs `sin(x)/cos(x)` verifies by numeric sampling.

#### CAS Notebook Exposure

Added notebook operations:

- `definite-integral`
- `tangent-line`
- `verify-identity`

These appear in notebook operation options and examples.

## QA Results

### Focused Tests

`npm run test -- src/utils/symbolic.test.ts src/cas/casNotebookEngine.test.ts`

Result: passed, 2 files and 13 tests.

## Phase 2 Implementation

### Files Modified

- `src/utils/symbolic.ts`
- `src/utils/symbolic.test.ts`
- `src/problem-solver/problemSolverEngine.ts`

### Features Added

#### Candidate Verification

`symbolicSolve()` now analyzes the raw CAS solution set instead of returning it blindly.

It now:

- parses candidate roots
- deduplicates numerically equivalent candidates
- substitutes candidates back into the original equation
- records substitution residuals
- removes candidates that fail real-domain restrictions

#### Domain Restrictions

The symbolic solve wrapper now detects and reports simple real-domain restrictions:

- square-root arguments must be nonnegative
- logarithm arguments must be positive
- simple denominators must be nonzero

Example:

`(x^2-1)/(x-1)=0`

The underlying CAS can return `x=1` and `x=-1`, but `x=1` makes the denominator zero. Math Universe now returns only:

`x = -1`

and records the rejected candidate.

#### Problem Solver Integration

CAS fallback results in `problemSolverEngine` now carry symbolic-solve restrictions and verification notes forward into the trusted result contract where available.

### Phase 2 QA

`npm run test -- src/utils/symbolic.test.ts src/cas/casNotebookEngine.test.ts src/problem-solver/problemSolverQualityRegression.test.ts src/problem-solver/problemSolverTrustCertification.test.ts`

Result: passed, 4 files and 146 tests.

`npm run typecheck`

Result: passed.

## Known Limitations

- Identity verification by numeric sampling is strong for classroom checks but is not a formal proof for all domains.
- Assumptions are recorded but still not fully enforced by the offline CAS.
- Advanced equation solving depth is not yet expanded in this phase.
- Screenshot/browser certification is not included in Phase 1.

## Immediate Next Recommendation

Phase 2 should focus on equation solving depth with domain and extraneous-root checks. That is the most visible area where students compare a solver against WolframAlpha and GeoGebra CAS.
