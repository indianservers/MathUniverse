# Phase 8 Browser QA, Route Crawler, and No-Scaffold Audit Report

Date: 2026-07-09

Scope: Phase 8 only. This phase added browser QA coverage, route inventory helpers, search/discoverability tests, and a no-scaffold audit. It did not add new curriculum features, new 3D scenes, or Phase 9 content.

## 1. Route Inventory Summary

Route inventory helper added:

- `tests/helpers/routeInventory.ts`

Inventory sources covered:

| Source | Route family | Notes |
|---|---:|---|
| `src/App.tsx` | Core app routes | Home, NCERT, Math Lab, visual proofs, formulas, theorems, AR/XR, workspace routes |
| `src/data/siteLinks.ts` | Search/menu index | Used as discoverability source |
| `src/data/ncertConcepts.ts` | 64 NCERT concept routes | Browser smoke priority: Class 7, Class 10, Class 12 |
| `src/data/mathLabTools.ts` | 24 Math Lab tool links | Covered by discoverability tests |
| `src/visual-proofs/data/visualProofsIndex.ts` | Visual proof routes | Available routes smoke-tested by existing visual-proof e2e |
| `src/data/formulaLibrary.ts` | Formula category routes | Covered by discoverability tests |
| `src/data/theoremLibrary.ts` | Theorem category/detail routes | Covered by discoverability tests |

Feature types represented: home, NCERT, Math Lab, Visual Proof, Formula, Theorem, AR/XR, Workspace, Search/Menu, Other.

## 2. NCERT Routes Browser-Tested

New Playwright crawler:

- `tests/ncert/ncertRoutesSmoke.e2e.ts`

Browser-tested routes:

| Group | Count | Viewports | Result |
|---|---:|---|---|
| Home route `/` | 1 | Desktop 1280x720, mobile 390x844 | Passed |
| NCERT dashboard `/ncert` | 1 | Desktop 1280x720, mobile 390x844 | Passed |
| Class 7 NCERT routes | 15 | Desktop 1280x720, mobile 390x844 | Passed |
| Class 10 NCERT routes | 27 | Desktop 1280x720, mobile 390x844 | Passed |
| Class 12 NCERT routes | 9 | Desktop 1280x720, mobile 390x844 | Passed |

Checks performed:

- Page loads without crash.
- No visible route error.
- Main content is not blank.
- No visible `coming soon`, `under construction`, `not implemented`, or lorem placeholder text on tested NCERT routes.
- Priority NCERT routes expose at least one interactive control or visual element.
- Mobile viewport does not create horizontal overflow above tolerance.

## 3. Broader App Routes Browser-Tested

New Playwright smoke test:

- `tests/app/appRouteInventorySmoke.e2e.ts`

Routes tested:

| Route | Feature | Result |
|---|---|---|
| `/` | Home | Passed |
| `/ncert` | NCERT dashboard | Passed |
| `/math-lab` | Math Lab hub | Passed |
| `/visual-proofs` | Visual Proofs hub | Passed |
| `/formulas` | Formula library | Passed |
| `/theorems` | Theorem library | Passed |
| `/modules/ar-math-lab` | AR/XR module | Passed |
| `/workspace` | Math workspace | Passed |
| `/workspace/graph` | Graph workspace | Passed |
| `/workspace/3d` | 3D workspace | Passed |
| `/workspace/data` | Data/CAS workspace | Passed |

## 4. Failed Routes Found and Fixes Made

No product route failures remained after the final crawler run.

Test-harness fixes made during Phase 8:

| Finding | Action |
|---|---|
| Raw `innerText`/`textContent` length checks were unstable against the app shell despite rendered content appearing in Playwright snapshots. | Replaced with role/main-content assertions and heading-count checks. |
| `/formulas` has a nested `main`, causing strict locator ambiguity. | Scoped browser smoke assertions to the first app-level `main`. |
| Running the two direct Playwright commands in parallel competed for the same preview server. | Ran the required direct Playwright commands sequentially for final validation. |

## 5. No-Scaffold Search Findings

Search terms audited:

`scaffold-only`, `placeholder`, `coming soon`, `TODO`, `FIXME`, `dummy`, `mock`, `temporary`, `under construction`, `future work`, `not implemented`, `needs visualization`, `needs browser QA`, `sample only`, `lorem`, `stub`, `WIP`

Representative findings:

| File | Route / Feature | Finding | User-facing? | Action taken | Remaining risk |
|---|---|---|---|---|---|
| `src/visual-proofs/data/visualProofsIndex.ts` | Deferred visual proofs | Generates deferred proof entries with `A scalable placeholder...` and `Coming soon`. | Yes, through visual proof category cards. | Reported only. This is a known deferred proof system and outside Phase 8 feature expansion. | Users can still see deferred visual-proof cards. |
| `src/visual-proofs/components/ProofCard.tsx` | Visual proof cards | Shows `Coming soon` for unavailable proof cards. | Yes. | Reported only. | Deferred proof language remains. |
| `src/visual-proofs/components/CategoryCard.tsx` | Visual proof category cards | Shows `Coming soon` counts/status. | Yes. | Reported only. | Deferred category status remains visible. |
| `src/visual-proofs/pages/VisualProofCategoryPage.tsx` | Visual proof category pages | Section title includes `Coming-soon proofs`; empty text mentions placeholders. | Yes. | Reported only. | Needs a later visual-proof cleanup phase. |
| `src/pages/ARMathLab.tsx` | AR Math Lab | Internal and visible session messages use `placeholder` wording for AR placement/fallback scene. | Partly yes. | Reported only because AR rendering expansion is out of Phase 8 scope. | AR module still communicates fallback/placeholder states. |
| `src/ar-math-lab/arExamples.ts` | AR Math Lab examples | Coordinate and measurement demos describe placeholders. | Yes. | Reported only. | Needs AR content copy cleanup or full rendering phase. |
| `src/cas/casResult.ts` and `src/cas/casParser.ts` | CAS commands | Planned commands can return `not implemented yet`. | Yes when unsupported CAS command is used. | Reported only. | CAS parity gaps remain. |
| `src/cas/casGeoGebraParity.ts` | CAS parity tracking | Internal note says `Not implemented yet`. | No, developer tracking. | Left untouched. | None for normal UI. |
| Test files under `tests/` and `src/**/*.test.*` | Tests | `mock`, `stub`, and scaffold-related assertions. | No. | Left untouched. | None. |
| Search input placeholders across UI | Search/form inputs | Many legitimate `placeholder=` attributes. | Yes, but normal input hint text. | Left untouched. | None. |

## 6. User-Facing Placeholders Fixed

None changed in this phase. The user-facing findings are either intentional deferred visual-proof states or AR/CAS future-phase states. Removing those without implementing the underlying feature would overclaim completeness.

## 7. Internal TODOs Left Untouched

Internal/developer-only findings were left untouched, including:

- Test mocks/stubs in unit and e2e tests.
- CAS parity tracking notes.
- Existing audit documents and implementation notes referencing future work.
- Legitimate input placeholder attributes.

## 8. Real Interaction Audit Table

| Class | Route group | Has tabbed layout | Has real visual | Has controls | Has practice/checking | Has formula/theorem/proof links | Browser QA | Status |
|---|---|---|---|---|---|---|---|---|
| Class 7 | `class-7-large-numbers-around-us` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-arithmetic-expressions` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-decimal-operations` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-fraction-operations` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-constructions-and-tilings` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-lines-and-triangles` | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | `class-7-algebraic-expressions`, `class-7-data-handling`, and Grade 7 manipulative priority set | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 7 | Older standard SVG routes: integers, fractions/decimals, comparing quantities, rational numbers, exponents, simple equations | Yes | Yes | Slider-style | Prompt-style | Yes | Passed | Complete with minor polish |
| Class 10 | Board-exam priority routes: tangents, triangles, linear equations, grouped statistics, circles, solids, heights/distances | Yes | Yes | Yes | Yes | Yes | Passed | Complete |
| Class 10 | Standard SVG/preset routes: real numbers, AP, section formula, polynomials, pair linear, quadratic, irrational numbers, root coefficients, special trig, proof reasoning, modelling | Yes | Yes | Slider-style | Prompt-style | Yes | Passed | Complete with minor polish |
| Class 12 | Relations/functions, determinants, continuity/differentiability, integration, differential equations, vectors/3D, Bayes, LPP, inverse trig | Yes | Yes | Yes | Yes | Yes | Passed | Complete with minor polish |

Notes:

- “Complete with minor polish” means the route is real and tested, but still relies more on presets/sliders than fully open-ended construction.
- No Phase 8 browser-tested NCERT route is marked Broken.

## 9. Search/Menu QA Results

Updated/strengthened:

- `src/data/siteLinks.discoverability.test.ts`

Coverage added:

| Search/Menu requirement | Result |
|---|---|
| `/ncert` appears in searchable links/menu data | Passed |
| Every Class 7 NCERT concept route is searchable | Passed |
| Every Class 10 NCERT concept route is searchable | Passed |
| Every Class 12 NCERT concept route is searchable | Passed |
| AR Math Lab is searchable | Passed |
| Math Lab tools are searchable | Passed |
| Formula category routes are searchable | Passed |
| Theorem category/detail routes are searchable | Passed |
| Visual-proof routes are searchable | Passed |

## 10. Mobile Overflow Results

| Test | Viewport | Result |
|---|---|---|
| NCERT crawler mobile sweep | 390x844 | Passed |
| Existing visual-proofs mobile dense-route smoke | 320, 375, 390, 430, 768 px widths | Passed |

No Phase 8 mobile overflow CSS fix was needed for the tested routes.

## 11. Tests Added or Updated

Added:

- `tests/helpers/routeInventory.ts`
- `tests/ncert/ncertRoutesSmoke.e2e.ts`
- `tests/app/appRouteInventorySmoke.e2e.ts`

Updated:

- `src/data/siteLinks.discoverability.test.ts`

## 12. Commands Run and Results

| Command | Result | Notes |
|---|---|---|
| `npx vitest run src/data/siteLinks.discoverability.test.ts --reporter=dot` | Passed | 5 tests passed |
| `npx playwright test tests/app/appRouteInventorySmoke.e2e.ts` | Passed | 2 tests passed |
| `npx playwright test tests/ncert/ncertRoutesSmoke.e2e.ts` | Passed | 2 tests passed; 53 routes exercised across desktop/mobile loops |
| `npm run lint` | Passed | No warnings/errors |
| `npm test` | Passed | 158 files, 1097 tests passed; existing React Router SSR warnings in FormulaLibrary tests |
| `npm run build` | Passed | Existing large chunk warning remains |
| `npm run test:e2e` | Passed | Build plus 8 visual-proof Playwright smoke tests |

## 13. Remaining Partial or Deferred Routes

| Area | Status | Recommended next action |
|---|---|---|
| Visual-proof deferred/coming-soon card system | Deferred | Replace placeholder card copy with explicit “planned proof” language or implement the missing proof pages in a later visual-proof phase. |
| AR Math Lab placeholder/fallback wording | Partial | Replace user-facing placeholder wording after full AR placement/rendering is implemented, or relabel as “preview/fallback” where accurate. |
| CAS planned command support | Partial | Add command-pack implementation or suppress unsupported command language behind clearer “available commands” UX. |
| Older standard NCERT SVG routes | Complete with minor polish | Upgrade the remaining slider-style standard routes into richer checker-based labs in Phase 9 if desired. |

## 14. Recommended Phase 9 Focus

1. Upgrade the remaining “Complete with minor polish” NCERT standard routes into deeper guided labs with answer checking.
2. Replace visual-proof deferred placeholder language with a cleaner planned-proof taxonomy, then implement the highest-priority deferred proof cards.
3. Clean AR Math Lab user-facing copy so preview/fallback states do not read as unfinished placeholders.
4. Add route inventory reporting as generated JSON/Markdown so future phases can compare route counts automatically.
5. Add CI grouping for app smoke, NCERT smoke, and visual-proof smoke so browser regressions are easier to isolate.

Final Phase 8 recommendation: Ready to proceed to Phase 9, with the explicit limitation that non-NCERT deferred visual-proof cards and AR/CAS placeholder-style wording still remain outside the Phase 8 scope.
