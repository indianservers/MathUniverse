# Phase 10 - Exact Link Mapping, Resource Integrity, and Remaining Route Polish

Date: 2026-07-09

## Scope

Phase 10 strengthened internal resource links for NCERT concept routes, formula/theorem/visual proof references, Math Lab/workspace links, AR/XR metadata, and search/dashboard discovery.

This phase did not add new curriculum modules, full AR rendering, full CAS, performance optimization, or a large practice bank.

## Files Changed

| Area | Files | Purpose |
|---|---|---|
| Central mapping | `src/data/ncertResourceLinks.ts` | New single source of truth for NCERT formula, theorem, visual proof, tool, workspace, AR/XR, and reference links. |
| NCERT concept pages | `src/pages/NCERTConceptPage.tsx` | Replaced local ad hoc links with central exact/category/related resource links. |
| Class 10 priority labs | `src/components/ncert/class10/Class10BoardExamLabs.tsx` | Replaced repeated broad/stale link arrays with central resource links. |
| Class 12 guided labs | `src/components/ncert/class12/Class12GuidedLabs.tsx` | Replaced broad defaults with exact determinant, calculus, probability, vector, and LPP links. |
| Search/menu metadata | `src/data/siteLinks.ts` | Added resource labels, routes, types, exactness, and keywords to NCERT route metadata. |
| Dashboard metadata | `src/pages/NCERTDashboardPage.tsx` | Search now includes linked resources; badges now reflect mapped formula/theorem/proof/tool coverage. |
| Tests | `src/data/ncertResourceLinks.test.ts` | Added route integrity and stale-link regression tests. |

## Link Exactness Rules

| Exactness | Meaning |
|---|---|
| Exact | The link points to a concrete existing formula category, theorem detail, visual proof detail, Math Lab, workspace, or route that directly supports the NCERT concept. |
| Category fallback | No exact detail route exists, so the best existing category route is kept. |
| Related | The route is useful but not a direct proof/formula page, such as a workspace, dashboard, or concept map. |

## Resource Link Audit Table

| NCERT route | Current formula link | Current theorem link | Current proof link | Current tool link | Exact link available? | Action |
|---|---|---|---|---|---|---|
| `/ncert/class-7-integers` | Category: `/formulas/number-systems` | Not applicable | Exact: `/visual-proofs/number-theory/even-odd-pairing` | Not applicable | Yes | Centralized exact proof plus formula fallback. |
| `/ncert/class-7-fractions-decimals` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept documented number-system fallback. |
| `/ncert/class-7-comparing-quantities` | Category: `/formulas/fractions-decimals-percent` | Not applicable | Not applicable | Not applicable | No exact detail | Kept arithmetic/formula fallback. |
| `/ncert/class-7-rational-numbers` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-7-exponents` | Category: `/formulas/algebra` | Exact: `/theorems/algebra/exponent-laws-theorem-16` | Exact: `/visual-proofs/logarithms-exponents/laws-of-exponents-same-base` | Not applicable | Yes | Replaced broad algebra link with exponent proof/theorem links. |
| `/ncert/class-7-large-numbers-around-us` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-7-arithmetic-expressions` | Category: `/formulas/fractions-decimals-percent` | Not applicable | Not applicable | Not applicable | No exact detail | Kept arithmetic fallback. |
| `/ncert/class-7-decimal-operations` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-7-fraction-operations` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-7-constructions-and-tilings` | Category: `/formulas/geometry` | Category: `/theorems/geometry` | Category: `/visual-proofs/geometry` | Not applicable | No exact detail | Kept geometry fallback. |
| `/ncert/class-7-lines-and-triangles` | Category: `/formulas/geometry` | Exact: `/theorems/geometry/triangle-angle-sum-theorem-3` | Exact: `/visual-proofs/geometry/triangle-angle-sum` | Not applicable | Yes | Linked exact angle-sum proof/theorem. |
| `/ncert/class-7-algebraic-expressions` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Category: `/visual-proofs/algebraic-identities` | Not applicable | No exact detail | Kept algebra fallback. |
| `/ncert/class-7-data-handling` | Category: `/formulas/statistics` | Not applicable | Exact: `/visual-proofs/statistics/mean-as-balance-point` | Not applicable | Yes | Linked exact mean/median statistics proofs. |
| `/ncert/class-8-rational-numbers` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-8-square-cube-roots` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-8-comparing-quantities` | Category: `/formulas/fractions-decimals-percent` | Not applicable | Not applicable | Not applicable | No exact detail | Kept arithmetic fallback. |
| `/ncert/class-8-exponents` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept inherited unit fallback; exact exponent mapping should be added later. |
| `/ncert/class-8-algebraic-identities` | Category: `/formulas/algebra` | Not applicable | Exact: `/visual-proofs/algebraic-identities/square-of-sum` | Not applicable | Yes | Linked exact identity proofs. |
| `/ncert/class-8-proportion` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Category: `/visual-proofs/algebraic-identities` | Not applicable | No exact detail | Kept algebra fallback. |
| `/ncert/class-9-number-systems` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Category: `/visual-proofs/number-theory` | Not applicable | No exact detail | Kept number-system fallback. |
| `/ncert/class-9-euclid-geometry` | Not applicable | Category: `/theorems/geometry` | Category: `/visual-proofs/geometry` | Not applicable | No exact Euclid detail | Kept proof/theorem category fallback. |
| `/ncert/class-9-heron` | Category: `/formulas/geometry` | Category: `/theorems/geometry` | Exact: `/visual-proofs/geometry/triangle-area-half-rectangle` | Not applicable | Yes | Linked exact triangle area proof; Heron detail still missing. |
| `/ncert/class-9-polynomials` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Category: `/visual-proofs/algebraic-identities` | Not applicable | No exact detail | Kept algebra fallback. |
| `/ncert/class-10-real-numbers` | Category: `/formulas/number-systems` | Exact: `/theorems/number-theory/euclidean-algorithm-theorem-2` | Exact: `/visual-proofs/number-theory/gcd-euclidean-algorithm` | Not applicable | Yes | Replaced broad number-theory fallback with Euclid algorithm links. |
| `/ncert/class-10-arithmetic-progressions` | Category: `/formulas/sequences-series` | Not applicable | Exact: `/visual-proofs/sequences-and-series/arithmetic-progression-equal-steps` | Not applicable | Yes | Linked AP and AP-sum visual proofs. |
| `/ncert/class-10-section-formula` | Category: `/formulas/coordinate-geometry` | Exact: `/theorems/coordinate-geometry/section-formula-theorem-3` | Exact: `/visual-proofs/coordinate-geometry/section-formula` | Not applicable | Yes | Linked exact section formula resources. |
| `/ncert/class-10-heights-distances` | Category: `/formulas/trigonometry` | Not applicable | Exact: `/visual-proofs/trigonometry/right-triangle-trig-ratios` | Related: `/trigonometry` | Yes | Linked trig ratio proof and lab. |
| `/ncert/class-10-polynomials` | Category: `/formulas/polynomials` | Exact: `/theorems/algebra/factor-theorem-1` | Exact: `/visual-proofs/algebraic-identities/quadratic-factorization-area-model` | Exact: `/workspace?template=polynomials` | Yes | Linked polynomial theorem/proof/workspace. |
| `/ncert/class-10-pair-linear` | Category: `/formulas/algebra` | Not applicable | Exact: `/visual-proofs/matrices-linear-algebra/linear-system-line-intersection` | Exact: `/workspace/graph` | Yes | Linked line-intersection proof and graph workspace. |
| `/ncert/class-10-quadratic` | Category: `/formulas/polynomials` | Exact: `/theorems/algebra/quadratic-discriminant-theorem-6` | Exact: `/visual-proofs/algebraic-identities/completing-the-square` | Exact: `/workspace/graph` | Yes | Linked discriminant theorem and completing-square proof. |
| `/ncert/class-10-irrational-numbers` | Category: `/formulas/number-systems` | Category: `/theorems/number-theory` | Exact: `/visual-proofs/number-theory/irrationality-of-square-root-2` | Not applicable | Yes | Linked exact irrationality proof. |
| `/ncert/class-10-polynomial-zero-coefficients` | Category: `/formulas/polynomials` | Exact: `/theorems/algebra/vieta-theorem-5` | Exact: `/visual-proofs/algebraic-identities/quadratic-factorization-area-model` | Not applicable | Yes | Linked Vieta and factorization proof. |
| `/ncert/class-10-linear-substitution-elimination` | Category: `/formulas/algebra` | Not applicable | Exact: `/visual-proofs/matrices-linear-algebra/linear-system-line-intersection` | Exact: `/workspace/graph` | Yes | Linked graph workspace and exact line-system proof. |
| `/ncert/class-10-linear-consistency` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Exact: `/visual-proofs/matrices-linear-algebra/linear-system-line-intersection` | Not applicable | Yes | Linked exact line-system proof. |
| `/ncert/class-10-triangle-bpt-converse` | Category: `/formulas/geometry` | Exact: `/theorems/geometry/basic-proportionality-theorem-10` | Exact: `/visual-proofs/geometry/similar-triangles-proportional-sides` | Not applicable | Yes | Linked BPT theorem/proof. |
| `/ncert/class-10-similarity-criteria` | Category: `/formulas/geometry` | Exact: `/theorems/geometry/aa-similarity-theorem-9` | Exact: `/visual-proofs/geometry/similar-triangles-proportional-sides` | Not applicable | Yes | Linked similarity proof/theorem. |
| `/ncert/class-10-areas-similar-triangles` | Category: `/formulas/geometry` | Exact: `/theorems/coordinate-geometry/homothety-scale-theorem-18` | Exact: `/visual-proofs/geometry/similar-triangles-proportional-sides` | Not applicable | Yes | Linked scale/area resources. |
| `/ncert/class-10-special-trig-angles` | Category: `/formulas/trigonometry` | Not applicable | Exact: `/visual-proofs/trigonometry/right-triangle-trig-ratios` | Not applicable | Yes | Linked trig ratio and unit circle proofs. |
| `/ncert/class-10-circle-tangent-radius` | Category: `/formulas/geometry` | Exact: `/theorems/geometry/tangent-radius-theorem-15` | Category: `/visual-proofs/geometry` | Not applicable | Theorem exact; no exact visual proof | Removed broken fake proof route; kept category fallback. |
| `/ncert/class-10-two-tangents` | Category: `/formulas/geometry` | Exact: `/theorems/geometry/power-of-a-point-theorem-18` | Category: `/visual-proofs/geometry` | Not applicable | Theorem exact; no exact visual proof | Kept circle proof category until exact proof exists. |
| `/ncert/class-10-sector-segment-area` | Category: `/formulas/mensuration-units` | Not applicable | Exact: `/visual-proofs/geometry/sector-area-formula` | Not applicable | Yes | Linked exact sector/circle area proofs. |
| `/ncert/class-10-composite-circle-regions` | Category: `/formulas/mensuration-units` | Not applicable | Exact: `/visual-proofs/geometry/circle-to-triangle` | Not applicable | Yes | Linked circle-to-triangle and sector proofs. |
| `/ncert/class-10-combination-solids` | Category: `/formulas/mensuration-units` | Not applicable | Exact: `/visual-proofs/mensuration/composite-solids-and-units` | Exact: `/workspace/3d` | Yes | Linked exact mensuration proof and 3D workspace. |
| `/ncert/class-10-recasting-solids` | Category: `/formulas/mensuration-units` | Not applicable | Exact: `/visual-proofs/mensuration/cylinder-volume-surface-area` | Exact: `/workspace/3d` | Yes | Linked cylinder proof and 3D workspace. |
| `/ncert/class-10-frustum-cone` | Category: `/formulas/mensuration-units` | Not applicable | Exact: `/visual-proofs/mensuration/cone-volume-surface-area` | Exact: `/workspace/3d` | Yes | Linked cone proof and 3D workspace. |
| `/ncert/class-10-grouped-mean-methods` | Category: `/formulas/statistics` | Exact: `/theorems/probability-statistics/expected-value-linearity-theorem-6` | Exact: `/visual-proofs/statistics/mean-as-balance-point` | Not applicable | Yes | Linked exact mean proof and related theorem. |
| `/ncert/class-10-grouped-mode` | Category: `/formulas/statistics` | Category: `/theorems/probability-statistics` | Exact: `/visual-proofs/statistics/histogram-frequency-distribution` | Not applicable | Yes | Linked histogram proof; theorem stays category. |
| `/ncert/class-10-grouped-median` | Category: `/formulas/statistics` | Category: `/theorems/probability-statistics` | Exact: `/visual-proofs/statistics/median-and-quartiles` | Not applicable | Yes | Linked median/quartile proof. |
| `/ncert/class-10-proof-reasoning` | Not applicable | Category: `/theorems/discrete-logic` | Category: `/visual-proofs` | Not applicable | No exact detail | Kept reasoning fallback. |
| `/ncert/class-10-mathematical-modelling` | Not applicable | Not applicable | Not applicable | Related: `/workspace` | No exact detail | Kept modelling/workspace fallback. |
| `/ncert/class-11-permutations` | Category: `/formulas/probability` | Category: `/theorems/probability-statistics` | Category: `/visual-proofs/probability` | Not applicable | No exact detail | Kept probability/counting fallback. |
| `/ncert/class-11-binomial` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Category: `/visual-proofs/algebraic-identities` | Not applicable | No exact detail | Kept algebra fallback. |
| `/ncert/class-11-conics` | Category: `/formulas/geometry` | Category: `/theorems/geometry` | Category: `/visual-proofs/geometry` | Not applicable | No exact detail from unit fallback | Later improvement: map to conic-sections exact proofs. |
| `/ncert/class-11-linear-inequalities` | Category: `/formulas/algebra` | Category: `/theorems/algebra` | Category: `/visual-proofs/algebraic-identities` | Not applicable | No exact detail from unit fallback | Later improvement: map to inequalities exact proofs. |
| `/ncert/class-12-relations-functions` | Category: `/formulas/relations-functions` | Exact: `/theorems/algebra/inverse-function-theorem-for-algebra-17` | Not applicable | Exact: `/math/functions` | Yes | Linked exact function theorem and function explorer. |
| `/ncert/class-12-determinants` | Category: `/formulas/determinants` | Exact: `/theorems/linear-algebra-vectors/determinant-area-theorem-7` | Exact: `/visual-proofs/matrices-linear-algebra/determinant-area-scale-factor` | Related: `/linear-algebra` | Yes | Linked determinant proof/theorem/lab. |
| `/ncert/class-12-continuity-differentiability` | Category: `/formulas/derivatives` | Exact: `/theorems/calculus-analysis/mean-value-theorem-5` | Exact: `/visual-proofs/calculus/derivative-slope-of-tangent` | Exact: `/math/derivatives` | Yes | Linked derivative proof/theorem/lab. |
| `/ncert/class-12-integration-methods` | Category: `/formulas/integrals` | Exact: `/theorems/calculus-analysis/fundamental-theorem-of-calculus-i-8` | Exact: `/visual-proofs/calculus/definite-integral-accumulated-area` | Exact: `/math/integration` | Yes | Linked FTC/integral resources. |
| `/ncert/class-12-differential-equations` | Category: `/formulas/differential-equations` | Not applicable | Exact: `/visual-proofs/engineering-mathematics/first-order-differential-equation-slope-field` | Exact: `/math/slope-fields` | Yes | Linked slope-field proof and lab. |
| `/ncert/class-12-vectors-3d-geometry` | Category: `/formulas/vectors` | Exact: `/theorems/linear-algebra-vectors/dot-product-angle-theorem-14` | Exact: `/visual-proofs/vectors/vector-projection-component` | Related: `/linear-algebra` | Yes | Linked vector theorem/proof/lab. |
| `/ncert/class-12-bayes-theorem` | Category: `/formulas/probability` | Exact: `/theorems/probability-statistics/bayes-theorem-3` | Exact: `/visual-proofs/probability/conditional-probability` | Not applicable | Yes | Linked Bayes theorem and probability proof. |
| `/ncert/class-12-linear-programming` | Category: `/formulas/linear-programming` | Not applicable | Exact: `/visual-proofs/engineering-mathematics/linear-programming-feasible-region` | Related: `/concept-map` | Yes | Linked feasible-region proof and concept map. |
| `/ncert/class-12-inverse-trig` | Category: `/formulas/trigonometry` | Exact: `/theorems/trigonometry/inverse-trig-range-theorem-18` | Exact: `/visual-proofs/trigonometry/complementary-angle-identities` | Related: `/trigonometry` | Yes | Linked inverse trig theorem and proof. |

## Broken / Stale Links Fixed

| Old link | Status | Phase 10 action |
|---|---|---|
| `/visual-proofs/geometry/circle-tangent-radius-theorem` | Broken / invented route | Removed from Class 10 tangent lab links. Replaced with exact theorem `/theorems/geometry/tangent-radius-theorem-15` and category fallback `/visual-proofs/geometry`. |
| Broad Class 12 `Formula library`, `Theorem library`, `Visual proofs` defaults | Category-only links | Replaced with concept-specific resources from `ncertResourceLinks.ts`. |
| Standard NCERT local `ncertResourceLinks()` helper | Ad hoc and incomplete | Replaced with central mapping and exactness labels. |

## Remaining Category Fallbacks

The following areas still use category fallbacks because exact detail routes do not currently exist or should be added in a later content phase:

- Class 7 arithmetic/fraction/decimal operational micro-topics.
- Class 8 square/cube roots and direct/inverse proportion.
- Class 9 Euclid geometry and Heron-specific proof route.
- Class 10 circle tangent visual proofs for tangent-radius and two-tangent theorems.
- Class 10 proof reasoning and mathematical modelling.
- Class 11 conics and inequalities could be mapped more tightly in a future route-specific pass.

## Search/Menu/Dashboard Consistency

- NCERT dashboard search now includes resource labels, exact routes, resource types, exactness, and keywords.
- NCERT cards now show Formula, Theorem, Proof, and Tool badges from actual mapped resources rather than regex guesses.
- Global `siteLinks` NCERT entries now include the same resource metadata for search/menu/discoverability.

## Tests Added

| Test | Coverage |
|---|---|
| `src/data/ncertResourceLinks.test.ts` | Every NCERT concept has resource links. |
| `src/data/ncertResourceLinks.test.ts` | Every generated internal resource link resolves to known app route data or a known dynamic route. |
| `src/data/ncertResourceLinks.test.ts` | Class 10/Class 12 priority routes keep strong exact-link coverage. |
| `src/data/ncertResourceLinks.test.ts` | Regression check prevents reintroducing the fake tangent visual proof URL. |

## Validation Status

Validation commands are listed here and should be rerun at the end of the implementation turn:

| Command | Expected |
|---|---|
| `npm test -- src/data/ncertResourceLinks.test.ts` | Pass |
| `npm run lint` | Pass |
| `npm test` | Pass |
| `npm run build` | Pass |
| `npx playwright test tests/ncert/ncertRoutesSmoke.e2e.ts` | Pass |
| `npx playwright test tests/app/appRouteInventorySmoke.e2e.ts` | Pass |
| `npm run test:e2e` | Pass |

## Final Phase 10 Recommendation

Ready for validation. Phase 10 completed the resource-linking foundation without inventing unavailable exact routes. Remaining category fallbacks are documented and should be handled in a later content route-expansion phase, not in this integrity phase.
