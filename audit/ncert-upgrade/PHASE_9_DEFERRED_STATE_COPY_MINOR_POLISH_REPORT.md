# Phase 9 Deferred State Copy and Minor Polish Report

Date: 2026-07-09

## Scope

Phase 9 was limited to cleaning user-facing deferred-state wording, AR preview/fallback copy, CAS unsupported-command boundaries, and small regression tests. It did not start Phase 10, did not build a new visual-proof library, did not implement full AR rendering, and did not expand CAS parity.

## Summary of Changes

| Area | Files | Result |
|---|---|---|
| Visual proof cards and filters | `src/visual-proofs/components/ProofCard.tsx`, `src/visual-proofs/components/CategoryCard.tsx`, `src/visual-proofs/pages/VisualProofsHomePage.tsx`, `src/visual-proofs/pages/VisualProofCategoryPage.tsx` | Deferred proof/category labels now say `Planned`, `Planned proof`, and `Open Roadmap` instead of `Coming soon` or preview-style copy that could imply a complete proof. |
| Visual proof roadmap data | `src/visual-proofs/data/visualProofsIndex.ts` | Future generated routes now use roadmap wording and avoid `placeholder` / `coming soon` phrasing in visible metadata. Current index remains fully available with 185 live proof routes. |
| Visual proof route fallback | `src/visual-proofs/pages/VisualProofPage.tsx` | The route fallback now describes a planned proof route and roadmap outline, while making clear that a custom animation is queued. |
| AR Math Lab fallback copy | `src/pages/ARMathLab.tsx`, `src/ar-math-lab/arExamples.ts` | AR states now use `preview`, `placement guide`, `camera preview overlay`, and `fallback preview` wording instead of placeholder language. |
| CAS unsupported command copy | `src/cas/casResult.ts`, `src/cas/casParser.ts` | Planned/unsupported CAS command paths now describe current product boundaries and suggest supported commands instead of saying `not implemented yet`. |
| Regression tests | `src/pages/ARMathLab.test.tsx`, `src/visual-proofs/data/visualProofsDeferredCopy.test.tsx`, `src/cas/casResult.test.ts` | Added guards for AR preview copy, visual proof deferred labels, and unsupported CAS wording. |

## AR / Latest Chrome Clarification

Desktop Chrome can expose camera access and WebGL on localhost, but full room-anchored `immersive-ar` WebXR is generally available only on AR-capable mobile devices/browsers. The AR Math Lab copy now tells users that Camera Preview is an overlay fallback and that true spatial AR needs an AR-capable device/browser.

## NCERT Minor Polish

No broad NCERT UI rewrite was done in this phase. The existing NCERT route smoke tests were rerun to confirm the Phase 9 copy changes did not regress NCERT pages, blank-route handling, or mobile overflow.

## Validation Results

| Command | Result | Notes |
|---|---|---|
| `npm run lint` | Passed | ESLint completed with zero warnings. |
| `npm test -- src/pages/ARMathLab.test.tsx src/visual-proofs/data/visualProofsDeferredCopy.test.tsx src/cas/casResult.test.ts` | Passed | 3 files, 16 tests. React Router SSR warnings appeared in server-rendered tests only. |
| `npm test` | Passed | 159 files, 1101 tests. Existing React Router `useLayoutEffect` SSR warnings appeared in rendered tests. |
| `npm run build` | Passed | Vite build completed. Existing large chunk warning remains. |
| `npx playwright test tests/ncert/ncertRoutesSmoke.e2e.ts` | Passed | 2 Chromium tests. |
| `npx playwright test tests/app/appRouteInventorySmoke.e2e.ts` | Passed | 2 Chromium tests. |
| `npm run test:e2e` | Passed | Rebuilt app and ran 8 visual-proofs Chromium smoke tests. Existing large chunk warning remains. |

## Remaining Limitations

| Limitation | Status | Recommended Next Step |
|---|---|---|
| Some audit Markdown files still contain historical words like placeholder/missing because they are audit records, not app UI. | Accepted | Leave audit records intact unless a future documentation cleanup phase is requested. |
| Developer-only parity notes still mention unimplemented GeoGebra gaps. | Accepted | Keep internal parity tracking separate from user-facing UI copy. |
| Existing Vite chunk-size warning remains. | Not caused by Phase 9 | Consider route-level splitting and larger vendor chunk review in a performance phase. |
| React Router SSR warnings appear in server-rendered unit tests. | Existing test warning | Consider a test harness that avoids server-rendering `MemoryRouter` links if warning noise becomes a priority. |

## Final Phase 9 Verdict

Phase 9 is complete. Deferred-state copy is clearer, AR fallback language is more honest, unsupported CAS command messages now read as product boundaries, and the required unit/build/browser validation passed.
