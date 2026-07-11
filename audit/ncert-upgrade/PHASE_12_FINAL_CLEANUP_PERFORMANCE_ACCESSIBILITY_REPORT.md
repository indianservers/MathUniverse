# Phase 12 Final Cleanup, Performance, Accessibility Report

Date: 2026-07-10

## Executive Verdict

Phase 12 is validated for release-candidate use of the NCERT upgrade. The required lint, unit, build, NCERT browser smoke, route inventory, practice-bank browser smoke, visual-proofs smoke, and full e2e gates pass.

This phase intentionally did not add new curriculum, backend features, PDF generation, or broad risky refactors. The remaining issues are documented and should not be hidden: the Vite large chunk warning remains, React Router SSR `useLayoutEffect` warning noise remains in server-rendered tests, the practice bank is a strong first pass rather than full textbook scale, teacher worksheet output is print-friendly HTML rather than PDF, and local mastery is browser-local only.

## Validation Results

| Command | Result | Notes |
|---|---:|---|
| `npm run lint` | Pass | ESLint completed with `--max-warnings=0`. |
| `npm test` | Pass | 164 test files passed, 1114 tests passed. SSR warning noise remains. |
| `npm run build` | Pass | Build completed. Large chunk warning remains. |
| `npx playwright test tests/visual-proofs/visualProofsSmoke.e2e.ts --reporter=line --workers=1` | Pass | 25 passed. Slow but stable. |
| `npx playwright test tests/ncert/ncertRoutesSmoke.e2e.ts --reporter=line --workers=1` | Pass | 2 passed. |
| `npx playwright test tests/app/appRouteInventorySmoke.e2e.ts --reporter=line --workers=1` | Pass | 2 passed. |
| `npx playwright test tests/ncert/ncertPracticeBank.e2e.ts --reporter=line --workers=1` | Pass | 3 passed. |
| `npm run test:e2e` | Pass | 25 visual-proofs tests passed after build. |

## Performance / Bundle Audit

### Current Route Splitting

`src/App.tsx` already lazy-loads the major page surfaces, including:

- AR Math Lab
- NCERT dashboard and concept pages
- visual proofs hub, category pages, and proof pages
- workspace routes
- graph/3D/math-lab pages
- formula visualizer routes

This is good route-level hygiene and should be preserved.

### Heavy Imports Observed

The app still uses large libraries where they are educationally appropriate:

| Area | Heavy dependency | Current containment |
|---|---|---|
| 3D / AR / workspace | `three`, `@react-three/fiber`, `@react-three/drei` | Mostly route/component level; still produces a large vendor chunk. |
| charts | `recharts` | Used across visualizers and graph pages. |
| export / snapshot tools | `jspdf`, `html2canvas` | Utility-level import still contributes a large chunk. |
| math rendering | `katex` | Shared across formula/theorem/math expression surfaces. |
| graph/flow modules | `reactflow`, `framer-motion` | Isolated to module pages, but still contributes to route chunks. |

### Build Warning Status

The large chunk warning remains:

| Chunk | Approx size | Notes |
|---|---:|---|
| `assets/index-BR0U3Y7A.js` | 1,001.17 kB | Main app/data/navigation shell remains over warning threshold. |
| `assets/vendor-three-CdRpycHy.js` | 839.14 kB | Large but below the configured 900 kB warning threshold. |
| `assets/jspdf.es.min-DSKv692V.js` | 593.33 kB | Export tooling chunk. |
| `assets/GraphTheory-Vz-GQhLb.js` | 470.32 kB | Heavy interactive module. |
| `assets/vendor-cas-DjBBu-NR.js` | 441.66 kB | CAS engine chunk. |
| `assets/MathWorkspace-BnTXvNtc.js` | 410.30 kB | Workspace route chunk. |

### Safe Cleanup Decision

No risky bundle refactor was made in Phase 12. The remaining biggest opportunity is to split the main app/data/navigation shell more deeply, especially broad site search data, formula/theorem indexes, and NCERT concept/lab imports. That is a Phase 13-style performance project, not a final certification patch.

## SSR Warning Review

The unit suite passes, but React Router SSR warning noise remains:

> `Warning: useLayoutEffect does nothing on the server...`

Affected test areas include server-render style tests around:

- `ConceptMapPage`
- `FormulaLibraryPage`
- `ARMathLab`
- `TheoremLibraryPage`
- visual proof category/card rendering
- Class 10 board exam lab routing

This is non-blocking because these routes run as browser SPA routes in production, and the tests still pass. The recommended later fix is to separate server-render snapshot tests from client-router component tests, or introduce a dedicated client-style test harness for components using React Router `Link`/`MemoryRouter`.

## Accessibility Audit

Critical surfaces were inspected:

- `/ncert`
- Grade 7 NCERT concept pages
- Class 10 board-exam concept pages
- Class 12 guided concept pages
- Practice tab
- Teacher worksheet panel
- Resource links tab
- sidebar/search/menu
- visual proofs hub and proof pages
- AR Math Lab

Observed support:

| Area | Status |
|---|---|
| NCERT tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and keyboard arrow/Home/End behavior are present. |
| Practice feedback | Text feedback and checkable states are present. |
| Teacher worksheets | Print CSS is present through `@media print`; no PDF dependency added. |
| Search/menu/sidebar | Search inputs, navigation landmarks, and button labels are present. |
| Visual proofs | SVGs generally use `role="img"` and `aria-label`; proof controls and full-screen buttons have labels. |
| AR Math Lab | Mode controls, camera/preview states, equation input labels, and text fallback states are present. |
| Mobile overflow | Covered by NCERT and visual-proofs smoke tests. |

Remaining accessibility polish:

- Some complex SVG visuals could still benefit from richer `<title>`/`<desc>` text on every diagram, not only `aria-label`.
- Some canvas/3D-heavy panes remain best-effort text summaries rather than full semantic equivalents.
- Keyboard traversal is covered by component semantics, but not exhaustively tested end-to-end across every route.

## No-Scaffold / User-Facing Copy Audit

Search terms audited:

- `placeholder`
- `coming soon`
- `under construction`
- `not implemented`
- `not implemented yet`
- `needs visualization`
- `needs browser QA`
- `scaffold-only`
- `lorem`
- `WIP`

Result summary:

| Finding type | User-facing? | Action |
|---|---|---|
| Form/input placeholder attributes | Yes, but legitimate UI hints | Kept. |
| Test guardrails checking for scaffold wording | No | Kept. |
| Historical audit/documentation mentions | No | Kept. |
| CAS GeoGebra parity note: "Not implemented yet" | Developer parity metadata, not primary UI | Documented, kept. |
| Unsupported workspace regression test string | Test-only | Kept. |
| `SyllabusVisualPage` phrase "not a generic placeholder" | User-facing but positive assurance, not unfinished copy | Kept. |

No release-blocking scaffold-only NCERT route copy was found in app UI source.

## Search / Menu / Link Integrity

Coverage is backed by:

- `src/data/ncertResourceLinks.test.ts`
- `src/data/siteLinks.discoverability.test.ts`
- `tests/ncert/ncertRoutesSmoke.e2e.ts`
- `tests/app/appRouteInventorySmoke.e2e.ts`
- `tests/ncert/ncertPracticeBank.e2e.ts`

Final resource-link mapping count:

| Metric | Count |
|---|---:|
| NCERT concepts mapped | 64 |
| Resource links generated | 194 |
| Exact links | 74 |
| Category fallbacks | 109 |
| Related links | 11 |

Category fallbacks remain where no exact formula/theorem/proof route exists. This is intentional and documented; no fake routes were introduced.

## Remaining Limitations

- Large Vite chunk warning remains.
- React Router SSR `useLayoutEffect` warning noise remains in unit test output.
- Practice bank is not full textbook scale.
- Teacher worksheet output is browser-print HTML, not PDF.
- Mastery is local-only browser storage.
- Some category fallbacks remain because exact resource routes do not exist.
- Some 3D/AR/canvas panes rely on text summaries rather than complete semantic equivalents.

## Phase 12 Recommendation

Ready to proceed beyond the NCERT upgrade certification, with the above limitations clearly documented. The next sensible phase is performance and bundle-splitting work, not more curriculum expansion.
