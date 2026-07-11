# Phase 10.6 - Visual Proofs E2E Timeout Fix Report

## 1. Root Cause

The timeout was caused by test structure, not by a broken visual-proof route.

`tests/visual-proofs/visualProofsSmoke.e2e.ts` loaded every Visual Proofs category page inside one Playwright test with a 60 second timeout. The category pages now render many proof cards, thumbnails, math text, and planned/available proof metadata. The aggregate loop could exceed the single-test timeout even when each category route loaded correctly.

The direct focused run before the fix showed the failure area as:

- Test: `loads every Visual Proofs category page`
- Failure mode: Playwright test timeout
- No route-not-found or internal error surface was identified as the root cause.

## 2. Files Changed

| File | Purpose |
|---|---|
| `tests/visual-proofs/visualProofsSmoke.e2e.ts` | Split the single aggregate category-page smoke test into one test per category route and strengthened route assertions. |
| `audit/ncert-upgrade/PHASE_10_6_VISUAL_PROOFS_E2E_TIMEOUT_FIX_REPORT.md` | Documents the Phase 10.6 root cause, fix, validation, and readiness. |

## 3. Test Stabilization Approach

The large category loop was replaced with per-category Playwright tests generated from `visualProofCategories`.

Each category route now checks:

- The route returns HTTP 200.
- The exact category heading is visible.
- Browser error overlays and application error text are absent.
- The page is not showing `Proof not found`.
- At least one category section heading is visible.
- Available proof links render when available proofs exist.
- Planned proof roadmap links render when a planned-proof section is present.

This keeps equivalent category coverage while giving each route its own Playwright test budget and a precise failing test name if a specific category regresses.

## 4. Route / Component Optimization

No application route or component optimization was needed for Phase 10.6.

The category pages loaded individually in under roughly one second during the successful full e2e run. The instability was from the aggregate test timeout, not from a single pathological category route.

## 5. Commands Run And Results

| Command | Result | Notes |
|---|---|---|
| `npx playwright test tests/visual-proofs/visualProofsSmoke.e2e.ts --reporter=line --workers=1` | Passed | 25 passed in about 2.0 minutes. |
| `npm run test:e2e` | Passed | Builds production bundle, then runs the visual-proofs smoke suite. 25 passed in about 2.0 minutes after build. |
| `npm run lint` | Passed | ESLint completed with `--max-warnings=0`. |
| `npm test` | Passed | 160 test files passed, 1105 tests passed. Existing React Router SSR `useLayoutEffect` warnings appeared, but no failures. |
| `npm run build` | Passed | TypeScript build and Vite production build completed. Vite still reports existing large chunk warnings. |

## 6. E2E Status

`npm run test:e2e` is now green.

The previous visual-proofs category-page timeout is fixed.

## 7. Remaining Risks

- The visual-proofs suite is still broad and takes about two minutes after build. Future proof-list growth could increase runtime again.
- Vite still reports large production chunk warnings. This is not part of Phase 10.6 and was not changed.
- Unit tests still emit existing React Router SSR `useLayoutEffect` warnings. These do not fail the test run and were not caused by this phase.

## 8. Readiness For Phase 11

Phase 10.6 is validated and ready to proceed to Phase 11.

