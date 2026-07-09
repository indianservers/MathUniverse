# Phase 1 Project Path and Coverage Check

Date: 2026-07-09  
Phase: 1 inspection only  
Rule followed: no application source files were edited, renamed, or deleted in this phase.

## Project Root Confirmed

Confirmed project root:

`C:\Indian Servers\Math Universe Visualizations`

The current working directory is the active app repository. The workspace already contains uncommitted source changes from earlier work, so later coding phases must preserve them and avoid reverting unrelated edits.

## Package / Framework Detected

Package manager and runtime:

| Area | Detection |
|---|---|
| Package manager | npm, via `package-lock.json` and npm scripts |
| App framework | Vite + React |
| Language | TypeScript |
| Routing | `react-router-dom` v7 |
| Styling | Tailwind CSS plus existing app classes |
| Math rendering | KaTeX dependency and app math display components |
| 3D rendering | `three`, `@react-three/fiber`, `@react-three/drei` |
| Data / charts | D3, Recharts, Cytoscape, React Flow |
| Animation | Framer Motion |
| Symbolic / algebra utility | `nerdamer` |
| Tests | Vitest and Playwright |
| Mobile shell | Capacitor |

Important package scripts:

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run typecheck` | TypeScript build check |
| `npm run lint` | ESLint with zero warnings |
| `npm test` | Vitest test suite |
| `npm run build` | TypeScript build plus Vite production build |
| `npm run verify` | Lint plus build |
| `npm run test:e2e` | Visual proof Playwright smoke route |
| `npm run test:e2e:visual-proofs:full` | Full visual proof matrix |

## Existing NCERT Architecture

Primary NCERT source files:

| File | Role |
|---|---|
| `src/data/ncertConcepts.ts` | Main NCERT concept registry with `NCERTConcept`, `NCERTVisualType`, route helper, slider metadata, tasks, outcomes, and concept IDs. |
| `src/pages/NCERTConceptPage.tsx` | Generic route renderer for `/ncert/:conceptId`; contains many embedded SVG/visual renderers keyed by `NCERTVisualType`. |
| `src/data/ncertGapAnalysis.ts` | Current NCERT gap metadata for Classes 7-10, used by syllabus UI. |
| `src/components/syllabus/NCERTGapAnalysis.tsx` | Renders gap status and links in the syllabus page. |
| `src/data/siteLinks.ts` | Auto-generates site/search links from `ncertConcepts`. |
| `src/App.tsx` | Registers generic route `ncert/:conceptId`. |

Current NCERT concept registry count by class:

| Class | Registered concept records |
|---|---:|
| Class 7 | 7 |
| Class 8 | 6 |
| Class 9 | 4 |
| Class 10 | 27 |
| Class 11 | 4 |
| Class 12 | 2 |

Current NCERT route model:

| Route | Renderer |
|---|---|
| `/ncert/:conceptId` | `NCERTConceptPage` looks up `conceptId` in `ncertConcepts`. |

Existing Grade 7 NCERT routes include:

- `/ncert/class-7-integers`
- `/ncert/class-7-fractions-decimals`
- `/ncert/class-7-comparing-quantities`
- `/ncert/class-7-rational-numbers`
- `/ncert/class-7-exponents`
- `/ncert/class-7-simple-equations`

Existing Class 10 NCERT routes include:

- `/ncert/class-10-real-numbers`
- `/ncert/class-10-polynomials`
- `/ncert/class-10-pair-linear`
- `/ncert/class-10-quadratic`
- `/ncert/class-10-arithmetic-progressions`
- `/ncert/class-10-section-formula`
- `/ncert/class-10-heights-distances`
- `/ncert/class-10-irrational-numbers`
- `/ncert/class-10-polynomial-zero-coefficients`
- `/ncert/class-10-linear-substitution-elimination`
- `/ncert/class-10-linear-consistency`
- `/ncert/class-10-triangle-bpt-converse`
- `/ncert/class-10-similarity-criteria`
- `/ncert/class-10-areas-similar-triangles`
- `/ncert/class-10-special-trig-angles`
- `/ncert/class-10-circle-tangent-radius`
- `/ncert/class-10-two-tangents`
- `/ncert/class-10-sector-segment-area`
- `/ncert/class-10-composite-circle-regions`
- `/ncert/class-10-combination-solids`
- `/ncert/class-10-recasting-solids`
- `/ncert/class-10-frustum-cone`
- `/ncert/class-10-grouped-mean-methods`
- `/ncert/class-10-grouped-mode`
- `/ncert/class-10-grouped-median`
- `/ncert/class-10-proof-reasoning`
- `/ncert/class-10-mathematical-modelling`

Existing Class 12 NCERT routes include:

- `/ncert/class-12-linear-programming`
- `/ncert/class-12-inverse-trig`

Observation: Class 10 has broad direct coverage. Grade 7 and Class 12 still depend heavily on generic app tools rather than textbook-facing chapter routes.

## Existing Formula / Theorem / Visual Proof Architecture

Formula architecture:

| File | Role |
|---|---|
| `src/data/formulaLibrary.ts` | Large formula category registry. Includes base formulas plus advanced append sections. |
| `src/pages/Formulas.tsx` and `src/pages/FormulaLibraryPage.tsx` | Formula library routes and UI. |
| `src/components/ui/MathExpression.tsx` and `src/components/ui/FormulaBlock.tsx` | Reusable formula display components. |

Theorem architecture:

| File | Role |
|---|---|
| `src/data/theoremLibrary.ts` | Theorem category and theorem item registry. |
| `src/pages/Theorems.tsx` and `src/pages/TheoremLibraryPage.tsx` | Theorem library routes and UI. |
| `src/data/theorems/*ProofDrafts.ts` | Theorem/proof draft data grouped by topic. |

Visual proof architecture:

| File / folder | Role |
|---|---|
| `src/visual-proofs/data/visualProofsIndex.ts` | Master visual proof index with categories, slugs, titles, summaries, and metadata. |
| `src/visual-proofs/data/visualProofCategories.ts` | Category metadata. |
| `src/visual-proofs/pages/VisualProofsHomePage.tsx` | Visual proofs landing page. |
| `src/visual-proofs/pages/VisualProofCategoryPage.tsx` | Category route. |
| `src/visual-proofs/pages/VisualProofPage.tsx` | Individual proof route. |
| `src/visual-proofs/components/VisualProofShell.tsx` | Shared proof shell. |
| `src/visual-proofs/components/ProofStepTimeline.tsx` | Step timeline. |
| `src/visual-proofs/components/ProofControls.tsx` | Step/playback controls. |
| `src/visual-proofs/components/FormulaInsightPanel.tsx` | Formula explanation panel. |
| `src/visual-proofs/components/SymbolLegendPanel.tsx` | Symbol/variable labels. |
| `src/visual-proofs/proofs/**` | Individual proof implementations by topic. |

Visual proof coverage is broad across algebra, geometry, trigonometry, coordinate geometry, calculus, number theory, probability, statistics, matrices/linear algebra, vectors, transformations, mensuration, sequences, conics, logarithms/exponents, inequalities, and engineering mathematics.

## Existing Visualization Architecture

Main visualization and tool surfaces:

| Area | Files / routes | Notes |
|---|---|---|
| Math Lab tools | `src/data/mathLabTools.ts`, `/math-lab`, `/math-lab/:toolId` | Registry includes graphing, geometry, CAS, equations, functions, trigonometry, conics, calculus, matrices, vectors, 3D graphing, logic, set theory, graph theory, combinatorics, solver, query. |
| Workspace | `src/pages/MathWorkspace.tsx`, `WorkspaceGraph.tsx`, `WorkspaceGeometry.tsx`, `Workspace3D.tsx`, `WorkspaceData.tsx`, `src/components/workspace/**` | Unified graph/geometry/3D/data workspace. |
| Algebra | `src/visualizations/algebra/**`, `/algebra` | Linear equations, simultaneous equations, quadratics. |
| Geometry | `src/visualizations/geometry/**`, `/geometry`, `/shapes` | Triangle, circle, 3D shape, Pythagoras, theorem visualizers. |
| Trigonometry | `src/visualizations/trigonometry/**`, `src/trigonometry/**`, `/trigonometry` | Unit circle, formula visualizer, graph studio, practice, inverse trig, waves. |
| Calculus | `src/visualizations/calculus/**`, `/calculus`, `/math/derivatives`, `/math/integration`, `/math/slope-fields` | Limits, derivatives, integration, motion, slope fields, series. |
| Linear algebra | `src/visualizations/linear-algebra/**`, `/linear-algebra`, `/matrices` | Vector visualizer, matrices, transformations, eigenvectors. |
| Complex numbers | `src/visualizations/complex/**`, `/complex-numbers` | Complex plane and Euler visuals. |
| AR Math Lab | `src/pages/ARMathLab.tsx`, `src/ar-math-lab/**`, `/modules/ar-math-lab` | AR/XR module exists from earlier phases. |

Reusable UI and scaffold components:

| Component | Use in later phases |
|---|---|
| `src/components/ui/LearningScaffolds.tsx` | Student task, teacher note, guided scaffold, invalid-state message, diagram summary. Must be reused. |
| `src/components/ui/DualPaneMathLayout.tsx` | Useful for two-pane / controls-and-visual layouts. |
| `src/components/ui/SliderControl.tsx` | Reusable sliders for parameterized visuals. |
| `src/components/ui/MathExpression.tsx` | Use for formulas instead of raw `^` text. |
| `src/components/math-input/SmartMathInput.tsx` | Use for math entry when needed. |
| `src/components/math-lab/FunctionGraphCanvas.tsx` | Reuse for 2D graphing. |
| `src/components/three/ThreeSceneWrapper.tsx` | Reuse for 3D panes. |
| `src/components/matrix/**` | Reuse for matrix/determinant steppers. |
| `src/components/workspace/**` | Reuse workspace panels and object/inspector patterns. |

## Existing Test / Build Commands

Detected tests:

- 157 test/e2e files by filename pattern.
- Unit tests are colocated in `src/**`.
- E2E tests live under `tests/**`.

Safe inspection phase did not run lint/build/test because Phase 1 asks for inspection only and no source changes were made.

Commands available for coding phases:

| Phase after coding | Required commands |
|---|---|
| Phase 2 | `npm run lint`, `npm test`, `npm run build` |
| Phase 3 | `npm run lint`, `npm test`, `npm run build` |
| Phase 4 | `npm run lint`, `npm test`, `npm run build` |
| Phase 5 | `npm run lint`, `npm test`, `npm run build`, plus `npm run test:e2e` if practical |

## Existing Coverage by Class

### Grade 7

Existing strong or partial records:

- Integers
- Fractions and decimals
- Comparing quantities
- Rational numbers
- Exponents and powers
- Simple equations
- Generic lines/angles/triangles via geometry routes

Missing or weak textbook-facing NCERT 2026-style chapters:

- Large Numbers Around Us
- Arithmetic Expressions
- A Peek Beyond the Point / decimal operations
- Expressions Using Letter-Numbers as a dedicated Grade 7 expression route
- Number Play as a guided route
- Working with Fractions as an operations route
- Geometric Twins
- Another Peek Beyond the Point
- Connecting the Dots as Grade 7 data route
- Constructions and Tilings
- Lines and triangles as a single Grade 7 guided route

### Class 10

Strong or near-strong direct NCERT coverage:

- Real Numbers
- Irrational Numbers
- Polynomials
- Pair of Linear Equations
- Quadratic Equations
- Arithmetic Progressions
- Coordinate Geometry
- Trigonometry
- Heights and Distances
- Circle tangents
- Areas related to circles
- Surface areas and volumes
- Grouped statistics
- Probability
- Proofs and Mathematical Modelling appendices

Partial areas to strengthen:

- Grouped statistics needs richer table-entry practice and ogive/cumulative frequency views.
- Circle tangent pages need formal theorem proof sequences and RHS congruence explanation.
- Triangle similarity needs theorem-by-theorem proof stepper depth.
- Linear equations need stronger symbolic stepper and consistency cards.
- Solids need hidden/exposed face and recasting/frustum animations.
- Polynomial zeroes/coefficient relation can be more explicit through factor-to-standard transformation.

### Class 12

Existing direct NCERT records:

- Inverse Trigonometric Functions
- Linear Programming

Generic tool coverage exists for:

- Matrices
- Determinants
- Calculus
- Integration
- Differential equations via slope fields
- Vectors
- 3D graphing / geometry
- Probability
- Set theory / relations in generic tools

Missing or partial NCERT-facing scaffolds:

- Relations and Functions
- Composition and invertibility
- Determinant minors/cofactors/adjoint/inverse workflow
- Cramer's rule and matrix equations
- Continuity/differentiability classifiers
- Logarithmic differentiation
- Parametric derivatives
- Second derivative and concavity
- Integration methods: substitution, partial fractions, by parts
- Differential equation solution methods
- 3D line geometry and shortest distance
- Bayes theorem tree/table simulator

## Missing or Partial Concepts Confirmed

| Class | Concept area | Status | Confirmation |
|---|---|---|---|
| Grade 7 | Large Numbers Around Us | Missing | No direct NCERT concept record found. |
| Grade 7 | Arithmetic Expressions | Missing/Partial | Generic algebra exists; no dedicated expression tree/order page. |
| Grade 7 | Decimal Operations | Partial | Fraction-decimal page exists but operations are not dedicated. |
| Grade 7 | Fraction Operations | Partial | Fraction-decimal concept exists; unlike-denominator and operation workflows are weak. |
| Grade 7 | Constructions and Tilings | Partial | Geometry constructor and tessellation proof exist, but no Grade 7 guided route. |
| Grade 7 | Lines and Triangles | Partial | Generic geometry/proofs exist, but no chapter-facing Grade 7 guided route. |
| Class 10 | Grouped Statistics | Partial/Strong | Direct concept pages exist; still needs richer steppers, ogive, and table-entry practice. |
| Class 10 | Circle Tangents | Partial/Strong | Direct concept pages exist; proof-level RHS/congruence flow should be strengthened. |
| Class 10 | Triangle Similarity | Partial/Strong | Direct pages exist; theorem-specific proof stepper can be deeper. |
| Class 10 | Linear Equations | Partial/Strong | Direct pages exist; symbolic method steppers need more detail. |
| Class 12 | Relations and Functions | Partial/Missing | Generic set theory exists; no dedicated NCERT route. |
| Class 12 | Determinants | Partial | Matrix tools/proofs exist; minors/cofactors/adjoint/inverse NCERT workflow missing. |
| Class 12 | Calculus Methods | Partial | Strong graphing/proofs; missing NCERT-specific method steppers. |
| Class 12 | Differential Equations | Partial | Slope fields exist; solving workflow is weak. |
| Class 12 | 3D Geometry | Partial | 3D workspace exists; line equation and shortest-distance scaffold missing. |
| Class 12 | Bayes theorem | Partial | Probability tools exist; dedicated Bayes tree/table missing. |

## Reusable Components

Use these instead of duplicating UI or math logic:

| Need | Reuse |
|---|---|
| Student tasks and teacher notes | `StudentTaskCard`, `TeacherNotes`, `GuidedScaffoldPanel`, `DiagramSummary`, `InvalidMathStateMessage` from `LearningScaffolds.tsx` |
| NCERT route model | Extend `ncertConcepts.ts` and existing `/ncert/:conceptId` route where possible |
| Formula rendering | `MathExpression`, `FormulaBlock`, formula library entries |
| Theorem/proof links | `theoremLibrary.ts`, `visualProofsIndex.ts`, visual proof pages |
| 2D graphing | `FunctionGraphCanvas`, existing calculus/graphing pages |
| 3D scenes | `ThreeSceneWrapper`, existing linear algebra and 3D workspace components |
| Matrices | `src/components/matrix/**`, `src/data/matrixOperations.ts` |
| Probability | Existing probability page/lab and probability proof utilities |
| Statistics | Existing statistics visual proofs and grouped statistics concept page |
| Accessibility scaffold | Existing aria-live patterns, reduced-motion hooks, diagram summaries |
| Route progress | Existing `RouteProgressBar` in `App.tsx` |

## Risks Before Coding

1. `src/pages/NCERTConceptPage.tsx` already contains many embedded visual components. Adding many more there could make it too monolithic. Later phases should consider extracting NCERT visuals into `src/components/ncert/` or `src/ncert/`.
2. Some strings in `src/data/ncertConcepts.ts` show mojibake characters from previous text encoding issues. Later phases should avoid copying those strings and may need a cleanup pass.
3. Class 10 coverage is broad, so duplicating routes would confuse navigation. Strengthen existing IDs unless a new page is clearly needed.
4. Class 12 tools exist but are not NCERT-facing. The risk is building isolated pages that do not reuse matrix/vector/calculus utilities.
5. Visual proof and theorem libraries are already large. New links should be deep links to existing proofs where possible.
6. Browser QA is important because previous issues included white space, hidden controls, overflow, and pane visibility.
7. Every coding phase must preserve the existing dirty worktree and not revert unrelated changes.

## Proposed Implementation Map for Phase 2 to Phase 5

### Phase 2: Grade 7 NCERT Textbook-Facing Alignment

Recommended files to add or edit:

| Purpose | Files |
|---|---|
| Data model entries | `src/data/ncertConcepts.ts` |
| Extracted Grade 7 visuals | `src/components/ncert/grade7/Grade7LargeNumbersLab.tsx`, `Grade7ArithmeticExpressionsLab.tsx`, `Grade7DecimalOperationsLab.tsx`, `Grade7FractionOperationsLab.tsx`, `Grade7ConstructionsTilingsLab.tsx`, `Grade7LinesTrianglesLab.tsx` |
| Shared NCERT cards/presets | `src/components/ncert/NCERTPracticePresets.tsx`, `src/components/ncert/NCERTChapterScaffold.tsx` |
| Route renderer wiring | `src/pages/NCERTConceptPage.tsx` or extracted NCERT visual renderer file |
| Navigation/search links | likely automatic through `siteLinks.ts`; add sidebar links only if needed in `src/components/layout/navItems.ts` |
| Tests | `src/data/ncertConcepts.audit.test.ts`, new Grade 7 visual utility tests if logic is extracted |
| Report | `audit/ncert-upgrade/PHASE_2_GRADE_7_ALIGNMENT_REPORT.md` |

Expected routes:

- `/ncert/class-7-large-numbers-around-us`
- `/ncert/class-7-arithmetic-expressions`
- `/ncert/class-7-decimal-operations`
- `/ncert/class-7-fraction-operations`
- `/ncert/class-7-constructions-and-tilings`
- `/ncert/class-7-lines-and-triangles`

### Phase 3: Class 10 Board-Exam Critical Strengthening

Recommended files to add or edit:

| Purpose | Files |
|---|---|
| Strengthen existing Class 10 entries | `src/data/ncertConcepts.ts` |
| Extracted Class 10 steppers | `src/components/ncert/class10/GroupedStatisticsStepper.tsx`, `CircleTangentTheoremLab.tsx`, `TriangleSimilarityStepper.tsx`, `LinearPairMethodStepper.tsx`, `CircleRegionLab.tsx`, `SolidsSurfaceVolumeLab.tsx`, `PolynomialZeroCoefficientLab.tsx`, `SpecialTrigAnglesPractice.tsx` |
| Existing proof links | `src/visual-proofs/data/visualProofsIndex.ts` only if missing metadata/deep links |
| Formula/theorem links | `src/data/formulaLibrary.ts`, `src/data/theoremLibrary.ts` only if missing |
| Tests | Class 10 utility tests for statistics, tangents, similarity ratios, linear consistency |
| Report | `audit/ncert-upgrade/PHASE_3_CLASS_10_STRENGTHENING_REPORT.md` |

Implementation note: prefer improving existing Class 10 concept IDs over adding duplicate routes.

### Phase 4: Class 12 Guided Steppers and Advanced NCERT Scaffolding

Recommended files to add or edit:

| Purpose | Files |
|---|---|
| Class 12 concept entries | `src/data/ncertConcepts.ts` |
| Relations/functions | `src/components/ncert/class12/RelationsFunctionsLab.tsx` |
| Determinants | `src/components/ncert/class12/DeterminantStepper.tsx` |
| Calculus | `src/components/ncert/class12/ContinuityDifferentiabilityLab.tsx`, `IntegrationMethodsStepper.tsx` |
| Differential equations | `src/components/ncert/class12/DifferentialEquationsStepper.tsx` |
| Vectors/3D geometry | `src/components/ncert/class12/Vectors3DGeometryLab.tsx` |
| LPP/Bayes | `src/components/ncert/class12/LinearProgrammingStepper.tsx`, `BayesTreeTableLab.tsx` |
| Shared utilities | Prefer existing math utilities under `src/visual-proofs/utils/**`, `src/data/matrixOperations.ts`, and existing pages before adding new symbolic logic |
| Tests | Class 12 utility tests for relation properties, determinant calculations, integration method validation, DE classifiers, Bayes updates |
| Report | `audit/ncert-upgrade/PHASE_4_CLASS_12_GUIDED_STEPPERS_REPORT.md` |

Expected route IDs can use:

- `/ncert/class-12-relations-functions`
- `/ncert/class-12-determinants`
- `/ncert/class-12-continuity-differentiability`
- `/ncert/class-12-integration-methods`
- `/ncert/class-12-differential-equations`
- `/ncert/class-12-vectors-3d-geometry`
- `/ncert/class-12-bayes-theorem`

### Phase 5: NCERT Practice Layer, Dashboard, QA, and Hardening

Recommended files to add or edit:

| Purpose | Files |
|---|---|
| Unified NCERT index | `src/pages/NCERTIndexPage.tsx` or `src/pages/Syllabus.tsx` enhancement |
| Route registration | `src/App.tsx` for `/ncert` only if adding index route |
| Dashboard data | `src/data/ncertConcepts.ts`, possible new `src/data/ncertPracticePresets.ts` |
| Status badges | reuse or extend `src/components/syllabus/TopicStatusBadge.tsx` |
| Practice mode | new `src/components/ncert/NCERTPracticeMode.tsx` |
| Teacher mode | new `src/components/ncert/NCERTTeacherPanel.tsx` |
| Local mastery | new `src/data/ncertProgressLite.ts` or local-storage hook under `src/hooks/` |
| Accessibility QA | route-specific aria labels and diagram summaries in new components |
| Browser tests | `tests/ncert/ncertCriticalRoutes.e2e.ts` |
| Final reports | `audit/ncert-upgrade/PHASE_5_NCERT_PRACTICE_DASHBOARD_QA_REPORT.md`, `audit/ncert-upgrade/FINAL_NCERT_COVERAGE_STATUS_AFTER_UPGRADE.md` |

Phase 5 should also search and document unresolved placeholder text, TODOs, broken links, and stub pages without deleting valid future-work notes.

## Inspection Commands Run

Safe inspection commands only:

- `Get-Location`
- `Get-Content -Raw package.json`
- `Get-ChildItem` for top-level, `src`, `tests`, and `audit`
- `rg --files src`
- `Select-String` / `rg` searches in app routing, data, NCERT, theorem, formula, visual proof, and navigation files
- Count scripts for NCERT concept records and tests

No lint, test, build, browser automation, source edits, renames, or deletes were performed in Phase 1.
