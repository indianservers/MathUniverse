# Phase 10.5 Resource Link Validation Report

Date: 2026-07-09

## Scope

Phase 10.5 reran the requested validation commands for Phase 10 exact link mapping, resource integrity, and route polish. No new curriculum features, Phase 11 work, AR/CAS expansion, or source changes were made.

## Commands Run and Results

| Command | Result | Notes |
|---|---|---|
| `npm test -- src/data/ncertResourceLinks.test.ts` | Passed | 1 test file, 4 tests. Validates centralized NCERT resource links, internal route integrity, priority exact-link coverage, and stale tangent-proof URL regression. |
| `npm run lint` | Passed | No lint failures. |
| `npm test` | Passed | 160 test files, 1105 tests. Existing React Router SSR warnings appeared in output, but no failures. |
| `npm run build` | Passed | Production build completed. Vite reported existing large chunk warnings only. |
| `npx playwright test tests/ncert/ncertRoutesSmoke.e2e.ts` | Passed | 2 browser smoke tests passed. |
| `npx playwright test tests/app/appRouteInventorySmoke.e2e.ts` | Passed | 2 browser route inventory smoke tests passed. |
| `npm run test:e2e` | Timed out | Ran twice: once with a 5 minute command timeout and once with a 15 minute command timeout. The script maps to `npm run build && playwright test tests/visual-proofs/visualProofsSmoke.e2e.ts`. No Phase 10 link-mapping assertion failure was captured from the wrapper command. |
| `npx playwright test tests/visual-proofs/visualProofsSmoke.e2e.ts --reporter=line --workers=1` | Failed outside Phase 10 scope | Direct diagnostic run completed in about 9.3 minutes: 7 passed, 1 failed. The failing test was `loads every Visual Proofs category page`, timing out after 60 seconds inside the visual proof category loop. This is a visual-proofs smoke runtime issue, not an NCERT resource-link mapping failure. |

## Failures Found

No failures were found in the Phase 10 resource-link mapping layer.

The only unresolved validation issue is the broad visual-proofs e2e smoke timeout. The failure occurred in `tests/visual-proofs/visualProofsSmoke.e2e.ts` while loading every visual proof category page. The captured context did not indicate a broken NCERT resource link, a missing mapped route, or the stale tangent proof URL fixed in Phase 10.

## Fixes Made

None. Phase 10.5 was validation-only, and no directly Phase 10-caused link-mapping issue was found.

## Link Integrity Status

| Area | Status |
|---|---|
| Central NCERT resource mapping | Validated by `src/data/ncertResourceLinks.test.ts`. |
| Internal NCERT resource hrefs | Validated by unit tests against known app route patterns. |
| NCERT browser routes | Passed Playwright smoke coverage. |
| App route inventory | Passed Playwright smoke coverage. |
| Stale/broken tangent proof URL regression | Passed. The fake `/visual-proofs/geometry/circle-tangent-radius-theorem` route was not reintroduced. |
| Full visual-proofs e2e suite | Not fully green. One non-Phase-10 visual proof category smoke test timed out. |

## Remaining Category Fallbacks

Category fallbacks are still intentionally present where no exact existing route is available. These were documented in Phase 10 and preserved in Phase 10.5:

- Class 7 arithmetic, fractions, decimals, and operational micro-topics.
- Class 8 square/cube roots, exponents, proportion, and related number-system/algebra topics.
- Class 9 Euclid geometry, Heron-specific proof coverage, and broad polynomial topics.
- Class 10 circle tangent visual proofs for tangent-radius and two-tangent topics, where exact theorem links exist but exact visual proof routes do not.
- Class 10 proof reasoning and mathematical modelling.
- Class 11 permutations, binomial theorem, conics, and inequalities.
- Unit-level fallbacks for formula categories such as algebra, geometry, trigonometry, statistics, probability, mensuration, number systems, and coordinate geometry.
- General fallbacks to `/ncert`, `/formulas`, and `/visual-proofs` where no exact concept route exists.

## Phase 10 Readiness

Phase 10 resource-link mapping is validated and ready from the NCERT/resource-link perspective.

The overall repository validation gate is not completely green because `npm run test:e2e` does not complete cleanly. Its underlying visual-proofs smoke suite has one category-page timeout that should be investigated separately before calling all e2e checks fully green. This timeout is outside the Phase 10 link-mapping scope, so no Phase 10 source fix was made.

## Recommendation

Ready to move to Phase 11 for NCERT/resource-link work, with one caveat: treat the visual-proofs category-page e2e timeout as a separate follow-up QA task before relying on the full `npm run test:e2e` suite as a release gate.
