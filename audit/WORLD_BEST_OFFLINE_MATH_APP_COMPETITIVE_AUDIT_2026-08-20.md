# Math Universe: World-Class Offline Mathematics App Audit

Date: 20 August 2026  
Benchmark set: Math Universe, GeoGebra, Desmos, Wolfram|Alpha  
Method: repository inspection, current engineering gates, existing browser/QA artifacts, and current official competitor documentation.

## Executive verdict

Math Universe is the broadest **mathematics learning environment** in this benchmark, but it is not yet the best **mathematical workbench** or a release-certified **offline app**.

Its defensible advantage is the combination of curriculum, visual proofs, interactive lessons, NCERT coverage, AR/XR, graph/discrete mathematics, theorem/formula libraries, practice, and multiple computational workspaces in one local-first codebase. None of the three competitors combines all of those learning surfaces.

The current product is held back by four structural issues:

1. Browser offline mode is deliberately disabled: `src/pwa.ts` unregisters every service worker and clears Math Universe/Workbox caches; `public/sw.js` deletes caches, unregisters itself, and performs no fetch handling.
2. The current tree is not release-clean: strict lint reports 60 errors and one warning.
3. The product contains many overlapping calculators, graphers, labs, formula visualizers, and topic pages without one universal mathematical object/dependency model.
4. Breadth is ahead of depth in the core areas where GeoGebra, Desmos, and Wolfram|Alpha have mature engines and highly refined interaction models.

### Benchmark ranking (offline-first product objective)

This is a weighted product benchmark, not a claim about global market share. Weights: offline capability 25%, core mathematics 25%, learning 20%, reliability 15%, accessibility 10%, ecosystem 5%.

| Rank | Product | Score / 10 | Verdict |
| --- | --- | ---: | --- |
| 1 | GeoGebra | 8.9 | Best complete offline interactive mathematics workbench today; strongest linked geometry/algebra/CAS/3D model. |
| 2 | Desmos | 7.9 | Best graphing UX and accessibility; narrower CAS, curriculum, offline, and authoring scope. |
| 3 | Math Universe | 7.4 | Broadest learning scope and strongest upside, but release integrity, browser offline, engine depth, and UX consolidation are not yet world-leading. |
| 4 | Wolfram\|Alpha | 6.8 | Best query-based mathematical breadth and symbolic knowledge, but officially requires connectivity and is not a construction-first offline environment. |

If the ranking is instead based on **online computational breadth**, Wolfram|Alpha ranks first. If based on **dynamic construction**, GeoGebra ranks first. If based on **fast graphing interaction and accessibility**, Desmos ranks first. If based on **integrated visual curriculum breadth**, Math Universe ranks first.

## Current product evidence

| Signal | Current result |
| --- | --- |
| React routes | 155 route declarations |
| Lazy-loaded route modules | 102 |
| Files under `src` | 2,111 |
| Test/E2E files under `src` and `tests` | 291 |
| Existing `dist` footprint | 646 files, about 34.2 MB |
| Largest current JS chunk | `MathWorkspace`, about 1.43 MB |
| Strict lint | Failed: 60 errors, 1 warning |
| TypeScript stage | Completed before Vite bundling started |
| Normal production bundle | Failed while Vite cleared `dist/assets/math-icons` (`ENOTEMPTY`) |
| Isolated Vite bundle | Did not finish inside the 180-second audit window |
| Selected unit run | Did not finish inside the 180-second audit window; no pass/fail claim made |
| Fresh live-browser inspection | Browser connection could not reach the local server; existing repository screenshots/E2E artifacts were used instead |
| Browser/PWA offline | Not implemented in the current tree; service workers and caches are explicitly removed |
| Packaged mobile offline potential | Strong: Capacitor packages `dist`, but a reproducible production build and device-level offline certification are still required |

Historical repository audit documents claim substantially stronger test and responsive results. Those are valuable evidence, but they do not override the failing current-tree lint/build gates.

## Module-by-module ranking

Scores measure the current product, not planned features. Rank is within these four products. “MU gap” is what prevents Math Universe from taking first place.

| Module / capability | #1 | #2 | #3 | #4 | MU score | MU gap to #1 |
| --- | --- | --- | --- | --- | ---: | --- |
| Offline installed use | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.0 | Restore real PWA caching; certify cold-start and every critical route without a network. |
| 2D graphing | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.5 | Expression semantics, points of interest, lists/actions, audio trace, polish, and performance. |
| 3D graphing | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.2 | Broader implicit/parametric objects, intersections, complex mode, exact analysis, and smoother navigation. |
| Dynamic 2D geometry | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.0 | Mature construction protocol, snapping, constraint transparency, algebra-linked objects, and authoring depth. |
| Dynamic 3D geometry | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.4 | Expand exact constructions, incidence/intersection coverage, proof-quality dependency inspection, and file interchange. |
| CAS / symbolic mathematics | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.3 | Exact-domain coverage, assumptions, branch conditions, special functions, verification, canonicalization, and trusted steps. |
| Natural-language math query | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 6.6 | Robust intent parsing, ambiguity resolution, unit/domain awareness, and much deeper offline knowledge. |
| Step-by-step problem solving | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 7.6 | Steps must be engine-derived, independently verified, misconception-aware, and coverage-certified. |
| Scientific calculator | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.6 | Complex/statistical depth, input ergonomics, accessibility, exact/decimal policy, and exam mode. |
| Spreadsheet / data table | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.8 | Universal live object links, broader formulas/statistics, large-data performance, and polished cell interaction. |
| Statistics / probability | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 8.0 | Validate advanced inference numerically; unify distribution, sampling, regression, Bayesian, and workbook flows. |
| Algebra learning | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 8.7 | Consolidate repeated tools; add formal coverage/accuracy certification and adaptive mastery. |
| Number systems / number theory learning | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 8.5 | Strengthen computational number theory, proof verification, and advanced exploration. |
| Trigonometry learning | Math Universe | GeoGebra | Desmos | Wolfram\|Alpha | 8.8 | Remove duplicated surfaces and certify identities/edge cases across DEG/RAD and domains. |
| Calculus / differential equations / Fourier | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.2 | Symbolic rigor, ODE/PDE breadth, convergence/branch handling, numerical solvers, and unified graph/CAS flow. |
| Linear algebra / matrices | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.1 | Sparse/large matrices, decompositions, conditioning, numerical stability, and proof-grade step validation. |
| Complex numbers | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.0 | Branch cuts, analytic functions, conformal maps, residues, exact symbolic integration, and complex 3D/4D views. |
| Set theory / logic | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 8.4 | Add proof assistant-like checking, richer first-order logic, model finding, and scalable set computation. |
| Combinatorics / graph theory / automata | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 8.3 | Reconnect or remove large quantities of dead Graph Theory UI code; certify every algorithm and complexity boundary. |
| Theorems / visual proofs | Math Universe | GeoGebra | Wolfram\|Alpha | Desmos | 9.0 | Formal provenance, dependency maps, correctness review, localization, and accessibility descriptions. |
| Curriculum / guided lessons | Math Universe | GeoGebra | Desmos | Wolfram\|Alpha | 9.1 | Teacher sequencing, diagnostic assessment, adaptive paths, localization, and content governance. |
| Practice / quizzes / spaced repetition | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 8.4 | Item calibration, answer equivalence, generated variants, analytics, and integrity controls. |
| AR/XR mathematics | Math Universe | GeoGebra | Desmos | Wolfram\|Alpha | 8.6 | Device certification, occlusion/scale accuracy, accessibility fallback, and offline model asset management. |
| Smart board / handwriting / recognition | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | 7.4 | Current recognition can depend on a configured endpoint; provide an offline recognizer, OCR, and confidence/review loop. |
| Teacher/classroom workflow | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 6.8 | Real teacher studio, assignment authoring, roster/analytics options, presentation mode, and safe local classroom sync. |
| Exam mode | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 3.0 | Add locked, auditable exam profiles; offline policy; session evidence; and regional calculator configurations. |
| Accessibility | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.0 | Audio trace/sonification, Braille math, systematic screen-reader math narration, reduced-motion and keyboard certification across all routes. |
| Authoring / reusable constructions | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 5.8 | Build a unified document format, object inspector, reusable components, templates, versioning, and offline sharing. |
| Import/export/interchange | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.5 | One export center; stable native file format; SVG/PNG/PDF/CSV/XLSX/LaTeX/MathML; import validation and migration. |
| Cross-workspace object linking | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.3 | Replace transfer envelopes and limited persistent parameters with one reactive dependency graph. |
| Mathematical knowledge breadth | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.2 | Curated advanced packs, citations/provenance, units/constants/data, and reliable offline search. |
| Release reliability / maintainability | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 5.5 | Clean lint/build/test gates, eliminate dead UI, reduce giant modules, deterministic bundles, and current evidence. |

## Internal architecture findings

### Strengths

- Broad local code/data footprint with very little runtime network dependence.
- Route-level lazy loading is used extensively.
- Dedicated engines exist for symbolic work, geometry, graph theory, set theory, probability/statistics, lessons, visual proofs, AR, and workspaces.
- Strong local persistence patterns and cross-workspace transfer concepts already exist.
- Existing tests cover unit, browser, responsive, accessibility, export, route inventory, and mathematical accuracy concerns.
- Capacitor configuration creates a credible route to fully offline Android/iOS distribution.
- The visual-proof, theorem, curriculum, and NCERT layers are genuine differentiators.

### Critical weaknesses

- `src/pwa.ts` and `public/sw.js` contradict the README’s offline PWA claim.
- Large page/module files contain extensive unused components and state. Graph Theory and Theorem Library are the clearest symptoms of features existing in source but not being part of the active product.
- Several major concepts have multiple disconnected implementations: general topic pages, Math Lab tools, workspaces, formula visualizers, visual proofs, syllabus labs, and advanced studios.
- The app lacks one canonical `MathDocument` / `MathObject` model shared by graphing, geometry, CAS, spreadsheet, lessons, and exports.
- Current output size and several very large chunks increase memory/startup risk on lower-end offline devices.
- Build output handling is not deterministic on the audited Windows environment.
- Historical certification documents can become stale; release evidence must be generated from the exact commit being shipped.

## Required target architecture

The product should converge on five layers:

1. **Verified math kernel** — exact and numeric arithmetic, units, symbolic algebra, solvers, geometry predicates, statistics, linear algebra, graph algorithms, and proof/step verification.
2. **Universal object graph** — expressions, parameters, tables, points, curves, surfaces, geometric objects, datasets, proofs, and lesson states represented as reactive typed objects with dependencies.
3. **Unified studio shell** — consistent expression editor, canvas, object inspector, history, parameters, accessibility, export, and command palette across every workspace.
4. **Learning layer** — explanations, visual proofs, lessons, practice, mastery, curriculum maps, teacher presentation, and offline content packs using the same underlying objects.
5. **Offline platform layer** — signed/versioned asset manifest, PWA/native packaging, indexed local storage, migrations, crash recovery, local search, optional offline recognition/model packs, and deterministic updates.

## Roadmap to first place

### P0 — Release and offline truth (must precede new features)

- Fix all 60 lint errors and the hook dependency warning; reconnect useful dead components or delete them.
- Make `npm run verify` deterministic and preserve a machine-readable report for the exact release commit.
- Restore a production service worker with precache + navigation fallback + versioned migrations, or stop claiming browser PWA offline support.
- Add automated offline tests: fresh install, warm cache, deep-link reload, every critical workspace, exports, local persistence, upgrade, rollback, and corrupted-cache recovery.
- Add a route/asset offline manifest and fail CI when a route requests an uncached runtime asset.
- Certify Android/iOS airplane-mode behavior on low-, mid-, and high-tier devices.

### P1 — Consolidate the product

- Define a canonical typed `MathObject` and reactive dependency graph.
- Merge overlapping 2D graphers, 3D plotters, calculators, and formula studios into shared engines and shells.
- Preserve topic-specific guided modes as configurations of the shared studio, not independent calculators.
- Add one global command/search system and one native document format.
- Split giant page modules and enforce chunk, complexity, dead-code, and bundle budgets.

### P2 — Beat the specialist tools at their strengths

- **Desmos bar:** instantaneous expressions, lists, actions, regressions, points of interest, complex mode, sonification/audio trace, and exceptional keyboard/touch UX.
- **GeoGebra bar:** fully linked algebra/geometry/CAS/table/3D objects, construction protocol, loci, reusable tools, spreadsheet, exam modes, and authoring.
- **Wolfram bar:** robust natural-language parsing, assumptions, exact domains, special functions, units, advanced symbolic/numeric algorithms, and verified step-by-step results.
- Publish a mathematical conformance suite with oracle comparisons, randomized/property tests, numerical tolerances, branch/domain cases, and expert sign-off.

### P3 — Own offline learning

- Downloadable curriculum packs by country/board/grade/language.
- Fully local mastery, spaced repetition, hints, misconception diagnosis, and teacher presentation mode.
- Offline handwriting/equation OCR with confidence display and mandatory review before calculation.
- Optional local tutoring model constrained to verified tools and curated content; never let a language model invent mathematical results.
- Local classroom sharing over QR/file/LAN with privacy-preserving opt-in sync.

### P4 — Ecosystem and trust

- Stable plugin/content SDK and signed offline packages.
- Construction/lesson authoring with templates, versioning, attribution, licenses, and portable files.
- Accessibility certification: keyboard, screen reader, MathML/Braille, audio trace, color independence, reduced motion, and touch targets.
- Exam profiles with auditable restrictions and regional approval paths.
- Public accuracy dashboard generated from the shipping build.

## Acceptance criteria for “world’s best offline mathematics app”

Do not use the claim until all of these are true:

- 100% of advertised core features work after installation in airplane mode.
- Zero lint/type/build failures and zero known critical/high defects.
- All critical routes pass desktop, tablet, and phone offline E2E tests.
- Symbolic/numeric/geometry/statistics engines pass published conformance and property-test suites.
- One saved document can contain linked CAS, graph, geometry, table, 3D, proof, and lesson objects.
- Accessibility includes keyboard-only operation, screen-reader math, Braille-compatible math output, and graph sonification/audio trace.
- Authoring, export/import, crash recovery, and upgrade/migration are certified.
- Exam mode and teacher presentation are real product workflows, not navigation placeholders.
- Every feature claim maps to automated evidence from the exact release build.

## Official competitor evidence used

- GeoGebra Calculator Suite: linked Graphing, 3D, Geometry, CAS, and Probability calculators; multi-platform downloads.
- GeoGebra app comparison: graphing, sliders, vectors/matrices, construction, 3D, probability, CAS, and spreadsheet coverage.
- GeoGebra apps: installed and portable offline versions plus exam modes.
- Desmos official help: graphing, points of interest, audio trace, regression, distributions, Geometry, 3D, complex/Braille modes.
- Wolfram|Alpha FAQ and examples: broad higher mathematics and plotting; officially requires web connectivity and cannot be used offline.

