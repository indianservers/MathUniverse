# Phase 4 Discoverability, Search, Menu, And Route Audit

Date: 2026-07-09

## Executive Summary

Phase 4 focused on discoverability. The app already had many NCERT, formula, theorem, visual proof, Math Lab, and AR Math Lab pages, but several were not easy to find from the homepage, sidebar, or global search index.

This phase added a first-class `/ncert` dashboard, connected it to the router, homepage, sidebar menu, legacy nav list, and search index, then expanded search coverage for formulas, theorems, visual proofs, Math Lab tools, AR Math Lab, and NCERT concept pages.

No application source unrelated to discoverability was intentionally changed in this phase.

## Route Inventory Summary

| Feature / Route | Exists as page/component | In App route | In menu | In search | In syllabus/NCERT index | Issue | Fix needed |
|---|---:|---:|---:|---:|---:|---|---|
| `/ncert` | Yes, new dashboard | Yes | Yes | Yes | Yes | Was missing as a hub route | Done |
| `/ncert/:conceptId` | Yes | Yes | Via dashboard | Yes | Yes | Individual pages existed but lacked a browsable class hub | Done |
| Class 7 NCERT concepts | Yes | Yes | Via `/ncert` | Yes | Yes | Hard to discover without direct route | Done |
| Class 10 NCERT concepts | Yes | Yes | Via `/ncert` | Yes | Yes | Hard to discover without direct route | Done |
| Class 12 NCERT concepts | Yes | Yes | Via `/ncert` | Yes | Yes | Class 12 was not represented in the gap widget filter | Done |
| `/modules/ar-math-lab` | Yes | Yes | Yes | Yes | No | AR/XR module existed but needed stronger search/menu discovery | Done |
| `/math-lab/*` tools | Yes | Yes | Partially | Yes | No | Tool pages were not fully indexed for search | Done |
| `/visual-proofs/*` | Yes | Yes | Partially | Yes | No | Proof pages were not fully indexed as individual searchable routes | Done |
| `/formulas/*` | Yes | Yes | Yes | Yes | No | Formula categories needed richer searchable entries | Done |
| `/theorems/*` | Yes | Yes | Yes | Yes | No | Category and theorem detail routes needed richer searchable entries | Done |
| `/workspace/*` | Yes | Yes | Yes | Existing | No | Source-level route exists; layout issues remain outside Phase 4 | Later UI phase |
| `/probability-statistics` | Yes | Yes | Existing | Existing | Partial | Search discovery is present; NCERT mapping still needs deeper content QA | Later curriculum phase |

## Features Found But Missing In Search

| Feature | Previous discoverability risk | Phase 4 action |
|---|---|---|
| NCERT concept pages | Students needed direct URLs or had to find links indirectly | Added every NCERT concept to `siteLinks` with class, chapter, formula, outcome, task, visual, and exam keywords |
| NCERT dashboard | No central route to browse Class 7, Class 10, Class 12 concepts | Added `/ncert` as a searchable link |
| AR Math Lab | Search did not strongly expose AR/XR terms | Added searchable AR Math Lab link with AR, XR, camera, 3D graph, solid, and measurement terms |
| Math Lab tools | Individual tools were not consistently present in global search | Added entries from `mathLabTools` |
| Formula categories | Formula pages were findable through navigation, but not broadly indexed | Added category-level formula links |
| Theorem categories and theorem detail pages | Theorem pages needed direct query discovery | Added category and theorem-level links |
| Visual proofs | Individual proof pages were not all directly searchable | Added links generated from `visualProofsIndex` |

## Features Found But Missing In Menu / Navigation

| Feature | Previous state | Phase 4 action |
|---|---|---|
| NCERT Dashboard | Missing from primary sidebar and legacy nav | Added under Home with `BookOpen` icon |
| AR Math Lab | Already present in current navigation work, but tested for search/menu coverage | Added menu/search regression coverage |
| NCERT class browsing | No single classroom-friendly entry point | Added dashboard link from homepage and sidebar |

## Features Found But Missing In NCERT / Syllabus Dashboards

| Feature | Previous state | Phase 4 action |
|---|---|---|
| Class 12 gap visibility | Gap analysis widget only listed Class 7 and Class 10 | Added Class 12 to class-level filters and title |
| Real visualization status | Concept cards did not give a quick real-vs-placeholder signal | New `/ncert` dashboard shows real visualization count and visual status badges |
| Formula/theorem/practice status | Students and teachers had to open pages to inspect coverage | New `/ncert` dashboard shows compact badges for formula, theorem, practice, visual QA, and browser QA |
| Search by class/chapter/title | Not available from a dedicated NCERT hub | New dashboard supports text search and class filtering |

## Features Added To Search

Implementation file: `src/data/siteLinks.ts`

Added or expanded:

- `/ncert`
- every `/ncert/:conceptId`
- `/modules/ar-math-lab`
- every Math Lab tool route from `mathLabTools`
- formula category routes from `formulaCategories`
- theorem category and theorem detail routes from `theoremCategories`
- visual proof routes from `visualProofsIndex`

New regression tests:

- `src/data/siteLinks.discoverability.test.ts`
- Updated `src/components/layout/Sidebar.search.test.ts`

## Features Added To Menu / Navigation

Implementation file: `src/components/layout/navItems.ts`

Added:

- `NCERT Dashboard`
- Route: `/ncert`
- Icon: `BookOpen`
- Search terms: `ncert`, `class 7`, `class 10`, `class 12`, `board exam`, `textbook`, `visual practice`, `formula theorem`

Also added to `legacyNavItems` so older menu surfaces can still find it.

## `/ncert` Dashboard Changes

New page: `src/pages/NCERTDashboardPage.tsx`

Route added in `src/App.tsx`:

- `/ncert`

Dashboard capabilities:

- Class filter for All, Class 7, Class 10, Class 12.
- Search by class, chapter, title, concept, formula, and learning outcome.
- Class summary cards.
- Concept cards with direct links to `/ncert/:conceptId`.
- Badges for formulas, theorem-like coverage, real visualization status, practice, and browser QA.
- Gap analysis bridge from `ncertGapItems`.

Homepage update:

- Added an `NCERT Dashboard` card in `src/pages/Home.tsx`.

## Broken / Dead Routes Found

No broken routes were found from the source-level route/index audit performed in this phase.

Browser route QA was covered indirectly by the configured visual-proofs Playwright smoke test, not by a full all-route crawler. A full crawler over every internal route is still recommended because the app now contains many generated/deep routes.

## Commands Run And Results

| Command | Result | Notes |
|---|---|---|
| `npx vitest run src/data/siteLinks.discoverability.test.ts src/components/layout/Sidebar.search.test.ts src/data/ncertConcepts.audit.test.ts --reporter=verbose` | Passed | Focused discoverability and NCERT regression tests |
| `npm run lint` | Passed | ESLint completed with zero warnings |
| `npm run build` | Passed | Production build succeeded after fixing a `visualProofsIndex` metadata reference |
| `npm test` | Passed | 148 test files, 1064 tests |
| `npm run test:e2e` | Passed | 8 Playwright visual-proof smoke/mobile-overflow tests |

## Warnings / Non-Blocking Findings

| Finding | Source | Impact | Recommendation |
|---|---|---|---|
| Large chunk warning over 900 kB | Vite build | Performance risk, not a compile failure | Continue code-splitting large route/data bundles |
| React Router SSR `useLayoutEffect` warnings | Existing FormulaLibraryPage tests | Test noise, not a Phase 4 failure | Add a client-only test harness wrapper or adjust SSR-style render tests later |
| No full route crawler | Phase 4 validation scope | Some deep routes may still have runtime-only issues | Add an internal route crawler test in a later phase |

## Remaining Discoverability Gaps

| Gap | Priority | Recommended next step |
|---|---:|---|
| No complete internal route crawler for all generated links | High | Build a Playwright route inventory smoke test using `internalSiteLinks` and route arrays |
| Search relevance ranking is still basic keyword matching | Medium | Add weighted tags for NCERT, visual proof, formula, theorem, interactive, and exam-intent searches |
| Dashboard does not yet show per-chapter NCERT completion percentages | Medium | Add chapter-level coverage cards from `ncertGapItems` and `ncertConcepts` |
| Visual proof/theorem/formula cross-links are indexed, but not deeply audited for dead related links | Medium | Add link integrity tests for generated related links |
| Workspace routes remain layout-heavy and need UI fixes from prior user feedback | Medium | Handle in a dedicated workspace layout phase |

## Phase 4 Status

Phase 4 is complete.

The app now has a discoverable NCERT dashboard, stronger menu placement, broader search coverage, and tests protecting the most important route/search entries added in this phase.
