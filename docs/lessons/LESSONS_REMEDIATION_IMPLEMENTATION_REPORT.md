# Lessons Remediation — Two-Phase Implementation Report

Status: Phase 1 complete; Phase 2 adapter-by-adapter certification in progress  
Preview: `http://localhost:5537/lessons`

## Delivery split

### Phase 1 — safety, contracts, and priority correctness (complete)

- Introduce a typed interaction contract for every lesson.
- Resolve every lesson through an explicit preset, with `lesson` or `family` specificity.
- Replace the old boolean interaction flag with persisted control/output evidence.
- Build challenges from the current model state and require relevant evidence before checking.
- Replace the five static priority pages with genuine interactive activities.
- Correct the seven confirmed concept-to-tool mismatches.
- Add model, catalog, runtime, rendering, and route verification.

### Phase 2 — catalog-wide certification (in progress)

- Audit all 674 lessons at concept level rather than adapter-family level.
- Replace remaining family fallbacks with explicit concept presets and activities.
- Add richer direct manipulation, playback, and compact context toolbars where appropriate.
- Complete keyboard, screen-reader, reduced-motion, responsive, persistence, and reset certification matrices.
- Produce route-by-route interaction evidence and the final certification report.

## Phase 2 progress

### Calculator family — IDs 1–18

- All 18 routes resolve through typed, lesson-specific presets.
- Numeric models, controls, visible output, and challenges match the named calculator concept.
- Current-state evidence replaces the adapter-wide fallback challenge.

### Discrete family — IDs 556–590

- All 35 routes resolve through typed, lesson-specific presets.
- Counting lessons use distinct product, factorial, permutation, combination, Pascal, inclusion-exclusion, and pigeonhole models.
- Graph lessons use the existing graph engine for degree, paths/cycles, components, Euler/Hamiltonian tests, trees, MST, shortest paths, bipartite/planar tests, flow, TSP, and adjacency.
- Set, Cartesian-product, logic, quantifier, proof, and priority activities no longer fall through to Dijkstra.
- Graph vertices are keyboard selectable; graph edits, edge weights, and algorithm steps update current-state challenges.

### Sequences and Series family — IDs 334–346

- All 13 routes resolve through typed, lesson-specific presets instead of title-based arithmetic/geometric inference.
- Distinct models cover explicit generators, arithmetic and geometric sequences, recursive sequences, seeded Fibonacci sequences, sigma notation, finite arithmetic/geometric series, and convergence classification.
- Advanced routes now compute power-series truncations, Taylor/Maclaurin approximations with visible error, generalized binomial series, and applied recurrence models.
- Each lesson links exact-value controls to a term plot, partial-sum overlay, compact value table, dynamic screen-reader summary, and current-state Check challenge.
- Convergence tests include zero sequences, constant sequences, oscillation, and divergent ratios.
- Live Taylor and Binomial Series checks passed. At 375 px, the Binomial Series route had no page-level horizontal overflow.

### Finance family — IDs 591–617

- All 27 routes resolve through typed, lesson-specific presets.
- The former shared declining-balance schedule was removed from unrelated concepts.
- Formula-derived models now cover simple/compound interest, effective rates, present/future value, annuities, EMI and amortisation, depreciation, inflation, currency conversion, markup/margin, break-even, tax/discount order, and investment comparison.
- Applied modelling routes now have distinct linear, quadratic, logistic, periodic, piecewise, parameter-estimation, dimensional-analysis, sensitivity, residual, scenario-comparison, and linear-programming activities.
- Every non-simple finance lesson links three exact-value controls to a derived chart, compact value table, dynamic screen-reader summary, and current-state challenge.
- Live checks on Break-Even, Compound Interest, and Linear Programming passed. At 375 px, the Linear Programming lesson had no page-level horizontal overflow.

### Current Phase 2 verification

- TypeScript: `npm run typecheck` — pass.
- Lint: `npm run lint` — pass with zero warnings.
- Tests: `npm test` — 198 files and 1,259 tests passed.
- Production build: `npm run build` — pass; Vite transformed 4,570 modules.
- Finance focused tests: 14 tests passed across preset, model, adapter, and active-challenge coverage.
- Sequence focused tests: 15 tests passed across preset, model, adapter, and active-challenge coverage.
- Port 5537: development server listening and serving the updated lesson routes.
- Existing advisory: the production build still reports a chunk larger than 900 kB.

## Phase 1 architecture

Each `LessonDefinition` now contains:

- `preset`: resolved adapter preset, concept family, and specificity.
- `contract`: required control types and IDs, observable outputs, representations, interaction verbs, workspace objects, keyboard alternative, screen-reader summary, reset assertions, and challenge-factory ID.

All 674 generated workbook rows pass through the same enrichment and validation boundary. An empty preset, cross-adapter preset, incomplete contract, or challenge/preset mismatch fails catalog creation and the automated tests.

Interaction events record the control ID, action kind, before/after state, affected outputs, and timestamp. Progress persistence keeps the latest evidence. Discover/Explore/Try/Check gating now depends on contract evidence rather than a generic click.

## Priority pages implemented

| ID | Concept | Interactive implementation |
|---:|---|---|
| 359 | Eigenvalues and Eigenvectors | Editable 2×2 matrix, vector-angle control, `v`/`Av` plane, eigendirections, characteristic polynomial, eigenvalues, and alignment status. |
| 404 | Nets of Solids | Selectable linked faces, 2D cube net, 3D fold view, and fold-progress slider. |
| 443 | Differential Equations | Safe ODE selector, initial condition and Euler-step controls, slope field, Euler solution curve, and live next-point calculation. |
| 480 | Box Plot | Editable dataset, five-number summary, selectable whisker rule, 1.5×IQR fences, whiskers, and outliers. |
| 576 | Graph Colouring | Keyboard-operable vertices, selectable palette, conflict-edge highlighting, color count, validity status, and hint assignment using the existing graph engine. |
| 582 | Set Builder | Editable finite universe, safe predicate selector, roster/notation output, number-line representation, and membership test. |
| 583 | Union, Intersection and Difference | Editable sets, operation selector, computed roster/cardinality, and linked Venn representation. |
| 586 | Subsets and Power Sets | Toggleable source/candidate sets, generated power set, `2^n` count, and proper-subset feedback. |
| 587 | Truth Tables | Safe logic parser, editable proposition, generated table, keyboard-selectable rows, and tautology/contradiction/contingency classification. |
| 588 | Logical Connectives | Toggleable truth values, connective selector, symbolic/plain-language result, and highlighted valuation. |
| 589 | Quantifiers | Editable finite domain, safe predicate and quantifier selectors, per-element evaluation, and witness/counterexample output. |
| 591 | Simple Interest | Principal/rate/time controls, `I = P × r × t`, formula-derived table, linear graph, interest, and final amount; amortization/payment behavior was removed. |

The five formerly static discrete pages are IDs 582, 586, 587, 588, and 589. The seven confirmed mismatch corrections are IDs 359, 404, 443, 480, 576, 583, and 591.

## User experience changes

- Lesson titles wrap instead of truncating.
- Locked stages expose their reason.
- Prediction and challenge inputs have accessible names.
- Share confirmation is announced through a live status region.
- Compact input/status styles are consistent in light and dark themes.
- Hooks remain stable when navigating between generic and concept-specific adapters.
- Reset restores each priority model to deterministic defaults.
- Activities are lazy-loaded through the existing lesson surface and reuse current math, logic, graph, 2D/3D, CAS, statistics, and spreadsheet foundations.

## Verification evidence

- TypeScript: `npm run typecheck` — pass.
- Lint: `npm run lint` — pass with zero warnings.
- Tests: `npm test` — 187 files and 1,227 tests passed.
- Production build: `npm run build` — pass.
- Live browser route smoke: all 12 priority routes rendered the expected lesson ID/title, live controls, SVG/visual output, and no application error on port 5537.
- Live interaction check: changing lesson 443 from `y′ = y` to `y′ = x − y` changed the Euler next value from `1.200` to `0.800`; the evidence unlocked Explore/Try and generated the current-state next-value challenge.

The build still reports the repository's existing large-chunk advisory. It is not a Phase 1 correctness failure; broader bundle splitting belongs in Phase 2 performance work.

## Phase 2 entry criteria

Phase 2 should begin from the contract/preset inventory, prioritizing family presets that still share a generic adapter. A lesson is certified only when its required controls produce its declared outputs, reset assertions pass, keyboard behavior matches the contract, the challenge is tied to current evidence, and responsive/browser checks are recorded. The presence of a family preset alone is not certification.
