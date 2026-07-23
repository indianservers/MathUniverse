# Lessons Module — Four-Phase Design and Delivery Plan

Status: design baseline

Source: `C:\Users\saisa\Downloads\GeoGebra_Style_Math_App_Pages.xlsx`

Workbook coverage: 674 of 674 page specifications, IDs 1–674

## 1. Product decision

Create a new data-driven `lessons` module with:

- `/lessons` — searchable lesson catalog.
- `/lessons/:categorySlug` — compact category index.
- `/lessons/:categorySlug/:lessonSlug` — one canonical URL for one concept.
- One shared `LessonPage` shell, a typed lesson registry, reusable workspace adapters, and topic-specific presets.
- Exactly 674 registered lesson routes at completion, with no duplicated page components.

The existing graph, geometry, 3D, CAS, spreadsheet, calculator, animation, authoring, persistence, and assessment code remains the mathematical foundation. The lessons module will configure and compose those engines; it will not rebuild them.

## 2. Workbook audit

The `Math Pages Master` sheet contains 674 unique IDs and no missing rows. The priority mix is 471 P0, 155 P1, and 48 P2.

| Category | Pages | Delivery phase |
|---|---:|---:|
| Core Workspaces | 38 | 1 |
| Numbers and Arithmetic | 35 | 1 |
| Authoring and Learning System | 39 | 1 |
| Platform Capabilities | 18 | 1 |
| Algebra | 37 | 2 |
| Graphs and Functions | 56 | 2 |
| Geometry | 90 | 2 |
| Trigonometry | 20 | 2 |
| Symbolic Mathematics | 22 | 2 |
| Calculus | 57 | 3 |
| Data and Probability | 106 | 3 |
| Advanced Mathematics | 44 | 4 |
| 3D Mathematics | 50 | 4 |
| Discrete and Applied Mathematics | 62 | 4 |
| **Total** | **674** | **4 phases** |

Some titles occur in more than one mathematical context, including `Hyperbolic Functions`, `Substitution`, `Partial Fractions`, `Frequency Tables`, and `Angle Between Lines`. Routes and registry keys must therefore be based on workbook ID plus category/topic slugs, never title alone.

## 3. Compact lesson-page experience

The page should feel like a focused GeoGebra activity, not an article.

### Desktop layout

1. A slim header: back, lesson title, level, progress, reset, share.
2. A narrow task rail: four stages only — `Discover`, `Explore`, `Try`, `Check`.
3. A large live canvas using the relevant existing 2D, 3D, graph, CAS, data, or calculator pane.
4. A compact control dock with at most three primary controls visible at once.
5. A collapsible object/value inspector.
6. One bottom prompt with answer/check controls.

### Mobile layout

- Canvas first, minimum 52% of the initial viewport.
- Controls in a bottom sheet.
- Stages in a four-item segmented control.
- Object list and hints in drawers.
- Touch targets at least 44 px; no hover-only action.

### Text budget

The workbook's eight-part blueprint is preserved as behavior, but not shown as eight long sections.

| Workbook intent | Page treatment | Maximum visible copy |
|---|---|---:|
| Learn | One-line concept goal and optional formula chip | 140 characters |
| Visualise + Manipulate | Live canvas and controls | Labels only |
| Predict | One prediction prompt before run/reveal | 120 characters |
| Calculate | Expandable worked stepper | One step at a time |
| Practise | One generated problem at a time | Prompt only |
| Apply | Optional scenario card | 160 characters |
| Review | Exit check and mastery state | One question |

No page should paste the workbook's `Purpose`, `What the Page Does`, and `Key Learning Outcome` as three repeated paragraphs. Those fields drive metadata, prompts, analytics, and author QA.

## 4. Required interaction contract for every lesson

Every lesson must include all of the following:

1. A mathematically meaningful input: drag, slider, construction tool, expression, data edit, parameter, or selection.
2. Immediate linked feedback in at least two representations when the concept supports it.
3. Reset and reproducible starting state.
4. A prediction recorded before reveal or simulation.
5. A checkable task using mathematical equivalence or a concept-specific validator where possible.
6. A visible value, invariant, measurement, trace, residual, or calculation that explains the change.
7. Keyboard and touch access to the primary action.
8. A deterministic seed for randomised practice and simulations.

A slider that only changes decorative color does not satisfy the interaction contract.

## 5. Proposed module architecture

```text
src/modules/lessons/
  LessonsModule.tsx
  pages/
    LessonsHomePage.tsx
    LessonsCategoryPage.tsx
    LessonPage.tsx
  components/
    LessonShell.tsx
    LessonStageRail.tsx
    LessonControlDock.tsx
    LessonPrompt.tsx
    LessonInspector.tsx
    LessonErrorBoundary.tsx
  catalog/
    lessonCatalog.ts
    lessonRoutes.ts
    phase1.ts
    phase2.ts
    phase3.ts
    phase4.ts
  adapters/
    calculatorAdapter.tsx
    algebraAdapter.tsx
    graphAdapter.tsx
    geometry2dAdapter.tsx
    geometry3dAdapter.tsx
    casAdapter.tsx
    spreadsheetAdapter.tsx
    statisticsAdapter.tsx
    probabilityAdapter.tsx
    discreteAdapter.tsx
    authoringAdapter.tsx
  presets/
    numbers/
    algebra/
    graphs/
    geometry/
    trigonometry/
    calculus/
    data/
    advanced/
    three-d/
    discrete-applied/
  engine/
    lessonRuntime.ts
    lessonProgress.ts
    lessonValidation.ts
    lessonPersistence.ts
  types.ts
  tests/
```

The registry is the source of truth. A lesson definition should contain metadata and behavior, not page markup:

```ts
type LessonDefinition = {
  id: number;
  slug: string;
  category: string;
  topic: string;
  title: string;
  phase: 1 | 2 | 3 | 4;
  level: string;
  priority: "P0" | "P1" | "P2";
  adapter: LessonAdapterId;
  preset: string;
  objective: string;
  initialState: unknown;
  controls: LessonControl[];
  prediction: LessonPromptSpec;
  practice: LessonPracticeSpec;
  check: LessonCheckSpec;
};
```

The runtime resolves `adapter + preset`, loads only the relevant engine chunk, restores lesson progress, and renders it inside `LessonShell`.

## 6. Existing code to reuse

| Lesson need | Existing foundation | Reuse approach |
|---|---|---|
| Shared object model, history, selection | `src/workspace/workspaceStore.ts`, `coreObjects.ts`, `universalObjectGraph.ts` | Expose scoped lesson sessions; do not fork the store per topic |
| Graphs, functions, tables, regression | `GraphWorkspacePanel.tsx`, `graphPanelUtils.ts`, `graphSampler.ts`, `graphAnalysis.ts` | Extract a controlled graph surface and preset factories |
| 2D construction | `GeometryWorkspacePanel.tsx`, `geometry2dKernel.ts`, construction builders/controllers | Add lesson-safe tool whitelists and seeded constructions |
| 3D objects and surfaces | `MathWorkspace.tsx`, `geometry3dKernel.ts`, `geometry3dWorkspaceEngine.ts`, `spaceStudio.ts` | Extract the current 3D scene/panel behind a controlled adapter |
| CAS | `src/cas/*`, `casTableKernel.ts`, symbolic utilities | Provide command presets, exact/numeric toggle, and linked graph output |
| Spreadsheet and data | `spreadsheetKernel.ts`, `dataWorkspaceIntegration.ts` | Use compact grids with lesson-defined ranges and locked formula cells |
| Probability and simulation | Existing probability pages plus data/graph engines | Standardise seeded simulations and distribution visual layers |
| Teaching and authoring | `classroomAuthoring.ts`, `beyondGeoGebraKernel.ts` | Extend the current lesson model rather than replace it |
| Practice | `practiceAssessment.ts` and existing practice banks | Replace token-only checks with typed validators over time |
| Share, save, export | `browserShareLinks.ts`, `browserProjectCenter.ts`, import/export utilities | Store lesson ID, stage, seed, response, and workspace snapshot |
| Accessibility | Existing platform controls and workspace shell | Enforce the same commands and state through keyboard/touch interfaces |

`src/pages/MathWorkspace.tsx` is currently a large integrated page. Reuse its engines and extracted surfaces, but do not mount the entire workspace inside every lesson and do not add lesson-specific branches to that file.

## 7. Adapter and preset matrix

| Workbook topic | Default adapter | Standard preset behavior |
|---|---|---|
| Scientific Calculator | calculator | Expression input, exact/decimal toggle, short history |
| Algebra and Dynamic Variables | algebra | Object list, dependency links, sliders, animation |
| 2D Graphing Calculator | graph | Plot/trace/table with constrained tools |
| Numbers and Number Theory | number-manipulative | Number line, factor arrays, base blocks, step animation |
| Fractions, Decimals, Ratios and Percentages | number-manipulative | Bars, grids, double number lines, value entry |
| Expressions and Manipulation | algebra-manipulative | Tiles plus linked symbolic steps |
| Equations and Inequalities | algebra-cas-graph | Balance model, CAS steps, graph/shading |
| Functions / transformations | graph | Linked coefficients, table, trace, comparison overlay |
| Coordinate Geometry | geometry2d | Seeded points, measures, construction tools |
| Vectors | geometry2d-3d | Draggable arrows, components, resultant/projection |
| Dynamic Geometry Constructions | geometry2d | Tool whitelist, construction replay, relation check |
| Transformations and Loci | geometry2d | Transform handles, animation, trace, invariant check |
| Trigonometry | graph-geometry2d | Unit circle/triangle/graph linked by angle |
| Calculus | graph-cas | Secants/tangents/areas/fields plus symbolic result |
| Sequences and Series | graph-cas | Term generator, partial sums, convergence trace |
| Matrices and Linear Algebra | matrix-2d-3d | Editable matrix, row steps, linked transform |
| Complex Numbers | complex-plane | Draggable points, polar form, multiplication/transform |
| 3D Geometry and Solids | geometry3d | Orbit, drag, slice, unfold, measure |
| 3D Functions and Surfaces | surface3d-cas | Parameters, contours, sections, gradient/tangent plane |
| CAS Workspace | cas | Command input, stepper, exact/numeric, linked plot |
| Spreadsheet | spreadsheet | Edit/fill/sort/filter with linked plot |
| Statistics and Regression | statistics | Data selection, bins/models, residual diagnostics |
| Probability and Distributions | probability | Parameter controls, shaded probability, seeded simulation |
| Inferential Statistics | statistics | Sample input, rejection regions, interval/test simulation |
| Combinatorics, Graph Theory and Logic | discrete | Draggable network/set/table plus algorithm playback |
| Financial Mathematics and Modelling | spreadsheet-graph | Assumptions, scenario comparison, table, chart |
| Interactive Authoring | authoring | Add/configure a control and preview its effect |
| Lesson and Assessment Pages | authoring-learning | Build or experience one stage of the lesson flow |
| Common Tools and Accessibility | platform-demo | Focused, checkable demo of the platform capability |

## 8. Phase 1 — Foundation and compact lesson shell

Scope: 130 pages.

| Workbook IDs | Topic | Pages |
|---|---|---:|
| 1–18 | Scientific Calculator | 18 |
| 19–38 | Algebra and Dynamic Variables | 20 |
| 57–74 | Numbers and Number Theory | 18 |
| 75–91 | Fractions, Decimals, Ratios and Percentages | 17 |
| 618–639 | Interactive Authoring | 22 |
| 640–656 | Lesson and Assessment Pages | 17 |
| 657–674 | Common Tools and Accessibility | 18 |

### Design intent

Establish the complete reusable lesson system and prove it on low-risk, high-reuse interactions. This phase must make all later phases mostly catalog and preset work.

### Build work

- Add the three routes and catalog/category navigation.
- Create the lesson schema, adapter contract, preset loader, route manifest, and runtime error boundary.
- Create the compact four-stage shell and responsive control/inspector drawers.
- Extract calculator, algebra-variable, and number-manipulative surfaces.
- Add progress persistence keyed by lesson ID and schema version.
- Add prediction capture, deterministic practice seed, reset, answer checking, and completion state.
- Add lesson-safe share links and recovery snapshots.
- Build authoring/platform pages as interactive capability demonstrations, not documentation pages.
- Create route generation tests proving exactly 130 Phase 1 entries and no duplicate canonical paths.

### Phase 1 page patterns

- Calculator lessons change the keypad/mode/preset, not the page component.
- Variable lessons start with one visible dependency graph and at most two parameters.
- Number lessons use direct manipulation before symbolic notation.
- Authoring lessons let the learner add/configure one artifact and immediately preview it.
- Accessibility lessons include a pass/fail task, such as completing the primary interaction using only the keyboard.

### Exit gate

- All 130 URLs resolve directly and after refresh.
- Every page has a working primary interaction, reset, prediction, and check.
- Catalog count equals the Phase 1 workbook count.
- No page requires more than one vertical screen of explanatory copy.
- Keyboard, touch, reduced motion, high contrast, and screen-reader smoke checks pass.

## 9. Phase 2 — 2D mathematics, graphing, geometry, and CAS

Scope: 225 pages.

| Workbook IDs | Topic | Pages |
|---|---|---:|
| 39–56 | 2D Graphing Calculator | 18 |
| 92–106 | Expressions and Manipulation | 15 |
| 107–128 | Equations and Inequalities | 22 |
| 129–155 | Functions | 27 |
| 156–166 | Function Transformations | 11 |
| 167–182 | Coordinate Geometry | 16 |
| 183–197 | Vectors | 15 |
| 198–235 | Dynamic Geometry Constructions | 38 |
| 236–256 | Transformations and Loci | 21 |
| 257–276 | Trigonometry | 20 |
| 428–449 | CAS Workspace | 22 |

### Design intent

Turn the existing graph, construction, trigonometry, and CAS capabilities into focused concept activities. The lesson controls expose only the tools relevant to the concept; the full workspace remains available as an optional “Open workspace” action.

### Build work

- Extract controlled graph and 2D geometry surfaces from the current workspace integration.
- Add seeded objects and a per-lesson tool whitelist.
- Add linked algebra/graph/table views and common special-point overlays.
- Add construction replay and invariant/relation validators.
- Add algebra-tile and balance-model layers that publish into the shared object graph.
- Connect CAS steps to graph and geometry outputs.
- Reuse the strongest existing trigonometry visualizers behind lesson presets.
- Add equivalence validators for expressions, equations, coordinate results, and trig values.
- Add geometric tolerance validators for constructions and drag-to-target challenges.
- Add per-topic visual regression fixtures for graph discontinuities, shaded inequalities, loci, angles, and transformations.

### Interaction examples

- `Quadratic Equations`: drag coefficients, predict root count, inspect graph/CAS/discriminant, solve a new instance.
- `Vertical Translation`: predict the new graph, move one slider, compare overlays, match a target.
- `Perpendicular Bisector`: construct with a limited toolbar, drag endpoints, verify equidistance.
- `Unit Circle`: rotate one point and keep triangle, coordinates, ratios, and graphs linked.
- `Partial Fractions`: edit the expression, reveal one decomposition step, verify by recombination.

### Exit gate

- All 225 routes have topic-specific starting states and tasks.
- Dragging or editing updates every linked representation within the same animation frame or controlled compute cycle.
- Geometry checks use computed relationships, not expected pixel positions.
- CAS checks compare mathematical meaning where supported, not raw strings.
- Phase 1 regression suite remains green.

## 10. Phase 3 — Calculus, data, statistics, and probability

Scope: 163 pages.

| Workbook IDs | Topic | Pages |
|---|---|---:|
| 277–305 | Limits and Differential Calculus | 29 |
| 306–333 | Integral Calculus and Differential Equations | 28 |
| 450–466 | Spreadsheet | 17 |
| 467–499 | Statistics and Regression | 33 |
| 500–536 | Probability and Distributions | 37 |
| 537–555 | Inferential Statistics | 19 |

### Design intent

Make abstract change, accumulation, variation, and uncertainty visible. Data remains editable and every chart, statistic, probability region, or calculus object must be derived from the displayed inputs.

### Build work

- Add reusable calculus layers: approach points, secants/tangents, derivative overlays, partitions, accumulation, vector/direction fields, phase plane, and cobweb diagrams.
- Add compact spreadsheet presets with editable and protected ranges.
- Standardise linked chart/table/statistic state through the existing data integration.
- Implement a seeded simulation worker for repeated trials without UI blocking.
- Implement shared distribution interfaces for density/mass, CDF, inverse probability, interval shading, and sampling.
- Add regression/model adapters with residuals and comparison metrics.
- Add inference adapters for intervals, tests, power, error types, and coverage simulation.
- Add unit-aware formatting, accessible chart summaries, and exportable data snapshots.
- Add numeric tolerance and statistical-result validators with visible rounding rules.

### Interaction examples

- `Derivative from First Principles`: shrink `h`, compare secant and tangent, predict limiting slope, enter the derivative.
- `Riemann Sums`: change partition count and sampling rule, predict over/under estimate, compare with CAS integral.
- `Linear Regression`: edit/drag points, inspect line and residuals, predict the effect of an outlier.
- `Normal Distribution`: change mean/standard deviation, shade an interval, connect area and z-score.
- `Power of a Test`: move effect size/sample size, simulate rejection rates, explain the tradeoff.

### Exit gate

- All 163 routes are driven by visible data or parameters.
- Random simulations reproduce exactly from the saved seed.
- Numerical methods expose error/step size and handle invalid domains.
- Charts have keyboard-readable summaries and never rely on color alone.
- Phase 1–2 regression suites remain green.

## 11. Phase 4 — Advanced, 3D, discrete, and applied mathematics

Scope: 156 pages.

| Workbook IDs | Topic | Pages |
|---|---|---:|
| 334–346 | Sequences and Series | 13 |
| 347–364 | Matrices and Linear Algebra | 18 |
| 365–377 | Complex Numbers | 13 |
| 378–412 | 3D Geometry and Solids | 35 |
| 413–427 | 3D Functions and Surfaces | 15 |
| 556–590 | Combinatorics, Graph Theory and Logic | 35 |
| 591–617 | Financial Mathematics and Modelling | 27 |

### Design intent

Complete the workbook with high-compute and specialist lessons while reusing the stable shell and adapter contracts. Three-dimensional lessons must retain spatial orientation and make important sections/measurements available in a linked 2D view.

### Build work

- Extract the existing 3D scene, object tools, camera presets, transforms, slicing, and measurement code into the 3D adapter.
- Add surface presets, contour/section linking, gradients, normals, and tangent planes.
- Add matrix editing, row-operation replay, basis/eigenvector overlays, and linked 2D/3D transformations.
- Add complex-plane arithmetic and grid-mapping presets.
- Add sequence term/partial-sum generators and convergence visual checks.
- Reuse the existing discrete-world engines for graph algorithms, automata/logic foundations where relevant, and algorithm playback.
- Add finance/model templates with editable assumptions, formula-driven schedules, linked graphs, scenario comparison, and units.
- Add 3D performance budgets, WebGL fallback states, and reduced-motion camera behavior.
- Complete cross-phase catalog search, prerequisites, next lesson, mastery rollups, and release certification.

### Interaction examples

- `Eigenvalues and Eigenvectors`: transform a draggable vector and identify directions preserved up to scale.
- `Möbius Transformations`: drag a complex point and inspect the live grid mapping.
- `Cross-Sections`: move the slicing plane, predict the section, compare 3D and 2D outlines.
- `Gradient Vector`: move on a surface, view contour and tangent plane, test steepest ascent.
- `Shortest Path`: edit a weighted network, predict a route, then play the algorithm.
- `Amortisation Table`: adjust rate/term, inspect payment split, compare scenarios.

### Exit gate

- All 156 routes work with WebGL and show a useful fallback when WebGL is unavailable.
- 3D lessons keep labeled axes/orientation and provide reset camera.
- Algorithm animations expose state, not just motion.
- Financial lessons keep assumptions editable and derived values formula-driven.
- Global registry certifies 674 unique IDs and 674 unique canonical routes.

## 12. Catalog and route rules

- Canonical slug format: `/lessons/{category-slug}/{id}-{lesson-slug}`.
- Use the numeric ID to prevent collisions and preserve workbook traceability.
- Store workbook source fields in the registry, but show only compact derived copy.
- Category pages group by topic and support level/priority/view filters.
- Search indexes title, topic, outcome, tools, and notation; it does not render all metadata.
- Each page links to previous/next within the topic and to the full workspace with the current state transferred.
- Unknown routes show a lesson-specific not-found state, not a silent home redirect.

## 13. Quality and certification strategy

### Automated inventory tests

- IDs equal the integer set 1 through 674.
- Every ID appears once and only once.
- Every route is unique.
- Phase totals equal 130, 225, 163, and 156.
- Category and topic totals reconcile to the workbook.
- Every lesson declares an adapter, preset, initial state, primary interaction, prediction, practice, and validator.

### Mathematical tests

- Unit-test each adapter independently from React.
- Use property tests for invariants, transformations, distributions, and numeric edge cases.
- Test undefined domains, degenerate geometry, empty data, singular matrices, zero denominators, and extreme parameter values.
- Certify displayed values against engine results, not duplicated UI formulas.

### Browser and visual tests

- One smoke test for every route at desktop and mobile viewport.
- A representative full interaction test for every topic (31 topic families).
- Screenshot baselines for each adapter/state family, not all random instances.
- Verify no canvas, controls, labels, tooltips, or answer actions are clipped.
- Measure input-to-visual latency and 3D frame-rate budgets.

### Accessibility tests

- Keyboard path for the primary task.
- Focus order and visible focus.
- Accessible name and current value for every control.
- Text alternative or data summary for visual output.
- Reduced motion, high contrast, zoom to 200%, and screen-reader announcements for checks.

## 14. Definition of done for a single lesson

A lesson is complete only when:

- Its canonical route loads directly and after refresh.
- The title, objective, level, and topic match the workbook.
- Its visualization is concept-specific and mathematically correct.
- At least one input changes the mathematics and linked output.
- Prediction is captured before reveal.
- Practice is checkable and provides actionable feedback.
- Reset restores the documented starting state.
- Progress and seed survive reload.
- The primary task works by mouse, touch, and keyboard.
- Mobile and desktop visual checks pass.
- No placeholder text, dead control, decorative-only interaction, or copied full-workspace clutter remains.

## 15. Delivery sequence inside each phase

Each phase should be executed topic-by-topic in this order:

1. Register every lesson and make every route resolve.
2. Build or extract the shared adapter once.
3. Implement presets and concept-specific validators.
4. Add concise prompts and practice.
5. Run mathematical unit tests.
6. Run browser interaction and accessibility checks.
7. Reconcile registry counts to the workbook.
8. Freeze the phase baseline before starting the next phase.

This sequence prevents a false “page complete” state where routes exist but interactions are generic, decorative, or mathematically unverified.
