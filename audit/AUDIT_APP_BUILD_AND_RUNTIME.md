# Audit App Build And Runtime

Generated on 2026-06-30.

## Commands Executed

| Command | Result | Notes |
|---|---|---|
| npm install | Not run | node_modules and package-lock.json already existed; no dependency install was required for this audit. |
| npm run lint | Failed / timed out after reporting errors | ESLint reported 72 errors and 13 warnings before timeout. Key classes: service-worker globals in public/sw.js, unused variables, no-useless-escape warnings, hook dependency warnings, and no-explicit-any in MathWorkspace. |
| npm test -- --runInBand | Failed immediately | Vitest rejects the Jest-only --runInBand option. |
| npm test | Failed | 135 test files ran: 122 passed and 13 failed. 971 tests passed and 20 failed. Failures concentrate in visual proof route inventory/loader coverage, symbolic/CAS helpers, workspace QA/performance, formula library SSR rendering, and workspace route smoke guards. |
| npm run build | Passed | TypeScript project build and Vite production build completed successfully; 4414 modules transformed. |
| Browser check | Partially passed | Existing dev server at http://127.0.0.1:5199 was used for representative route checks. Full route-by-route browser testing was not completed for every visualization due project size. |

## Impact On Visualization Audit

- Production build passing means the app is deployable at bundle level.
- Lint failures reduce maintainability confidence, especially in workspace-heavy visualizers and shared formula/CAS code.
- Test failures reduce confidence in visual proof route coverage, lazy loading, symbolic solving, CAS evaluation, and formula library SSR behavior.
- Individual reports are source-and-build audits unless their Basic Information section says they were sampled in browser.

## Recommended Fixes

1. Configure ESLint globals for service workers or exclude generated public/sw.js from app lint.
2. Fix unused variables and no-useless-escape warnings in CAS, formula, workspace, and page files.
3. Update visual proof route inventories and lazy loader coverage so route smoke tests match actual proof categories.
4. Rebaseline or repair workspace QA/performance expectations after recent layout/workspace changes.
5. Add targeted tests for every interactive visualization's math kernel and edge states.
