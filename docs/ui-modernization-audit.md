# UI Modernization Audit And Migration Map

This audit covers the application-wide modernization brief for learning, visualization, calculator, explorer, laboratory, studio, and workspace pages.

## Non-Negotiables

- Existing main left navigation remains untouched.
- Uploaded mockup sidebars are ignored.
- Workspace routes are excluded from the current upgrade scope per the latest request.
- Existing math, graph, geometry, CAS, spreadsheet, WebGL, animation, and validation engines are reused.
- Page-specific CSS must be route-scoped or component-scoped.
- Migrations are incremental and testable.

## Route Inventory

### Workspace And Studio Routes

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/workspace` | Workspace hub | Workspace registry | Hub/cards | Compact hub with status and recent tools | `mathWorkspaces`, workspace navigation |
| `/workspace/graph` | 2D graphing workspace | Graph studio, expression/layer state | Studio | Excluded from current scope | `GraphWorkspacePanel`, graph engine |
| `/workspace/3d` | 3D graph/geometry workspace | Three.js graph/geometry engines | Studio | Excluded from current scope | `Workspace3D`, `ThreeSceneWrapper` |
| `/workspace/geometry` | 2D construction workspace | Geometry workspace engine | Studio | Excluded from current scope | `GeometryWorkspacePanel`, geometry kernels |
| `/workspace/data/*` | Spreadsheet/CAS/data workspace | CAS/spreadsheet kernels | Multi-panel | Excluded from current scope | `WorkspaceData`, CAS table kernel |
| `/graph-theory` | Weighted graph theory lab | Graph theory engine/store | Redesigned | Compact graph studio | `graphTheoryEngine`, `graphTheoryStore` |

### Geometry And Shapes

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/geometry` | Geometry Universe | SVG/Three geometry helpers | Redesigned | Multi-tab geometry studio | `Geometry.tsx`, math utilities, Three wrapper |
| `/shapes` | 2D/3D shape explorer | Shape explorer engine | Studio-like | Shape library + canvas + inspector | `ShapesExplorer` |
| `/circle-to-triangle` | Geometry proof visual | SVG proof engine | Visual proof | Proof workspace | Existing visual proof component |
| `/geometry/:conceptId` | Concept-specific geometry learning | Concept media utilities | Lesson/concept | Compact lesson studio | `GeometryConceptPage` |

### Graphing And 3D

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/math-lab/graphing-calculator` | Function graph calculator | Math lab graph engine | Lab | Graphing studio | `FunctionGraphCanvas`, shared controls |
| `/math-lab/function-explorer` | Function exploration | Graphing/calculus utilities | Lab | Function analysis studio | Existing graph helpers |
| `/math-lab/3d-graphing` | 3D surface graphing | Three.js surface engine | 3D studio | Preserve and standardize | `GraphStudio3DWorkspace` |
| `/surface-plotter` | Standalone 3D surface plotter | Three.js surface engine | Plotter | 3D viewport + inspector | `SurfacePlotter3D` |
| `/parametric-curves` | Parametric curve explorer | SVG/graph sampler | Explorer | Curve studio | `ParametricCurveExplorer` |
| `/polar-visualizer` | Polar graph explorer | SVG polar renderer | Explorer | Polar studio | `PolarCoordinatesVisualizer` |
| `/graph-comparison` | Compare functions | Graph comparison engine | Tool page | Analysis studio | Existing comparison page |

### Calculus

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/calculus` and `/calculus/*` | Calculus atlas and submodes | Calculus visualizers | Subject shell | Family studio with submodes | `Calculus.tsx` |
| `/math/limits-continuity` | Limits/continuity visualizer | Existing limits engine | Redesigned CSS present | Standard studio shell | `LimitsContinuityVisualizer` |
| `/math/derivatives` | Tangent/secant visualizer | Existing derivative engine | Redesigned CSS present | Standard studio shell | `DerivativesTangentVisualizer` |
| `/math/integration` | Riemann/area visualizer | Existing integration engine | Redesigned CSS present | Standard studio shell | `IntegrationAreaVisualizerPage` |
| `/math/derivatives/formula-visualizer` | Derivative formula studio | Formula visualizer | Studio CSS present | Keep and standardize | `DerivativesFormulaStudio` |
| `/math/integration/formula-visualizer` | Integration formula studio | Formula visualizer | Studio CSS present | Keep and standardize | `IntegrationFormulaStudio` |
| `/math/slope-fields` | Slope fields | ODE/vector field renderer | Visualizer | Differential equation studio | `SlopeFieldsVisualizerPage` |

### Algebra, CAS, Matrices, Linear Algebra

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/linear-algebra` | Vector/matrix lab | Vector and matrix engines | Redesigned | Single-screen vector/matrix studio | `VectorVisualizer`, linear algebra utils |
| `/matrices` | Matrix operations | Matrix operations engine | Subject page | Matrix calculator studio | `MatrixOperations` |
| `/matrices/:operationId` | Operation detail | Matrix operation engine | Tool page | Focused calculator studio | `MatrixOperationPage` |
| `/math/matrix-transformations` | Matrix transform visualizer | Linear transform engine | Visualizer | Transformation studio | `MatrixTransformationsVisualizerPage` |
| `/math/eigenvectors` | Eigenvector visualizer | Eigen/vector engine | Visualizer | Eigen studio | `EigenvectorsVisualizerPage` |
| `/problem-solver` | Step solver | Symbolic solver | Solver | Problem entry + steps + verification | `StepByStepProblemSolver` |
| `/algebra` | Algebra learning/visuals | Algebra visualizers | Subject shell | Subject studio | `Algebra.tsx` |

### Probability, Statistics, Discrete, Logic

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/probability-statistics` | Statistics hub | Statistics modules | Hub | Statistics studio hub | Probability-statistics modules |
| `/probability-statistics/*` | Distribution/statistics studios | Distribution engines | Module pages | Compact lab pages | Existing module pages |
| `/math-lab/probability` | Probability lab | Simulation engine | Lab | Simulation studio | `MathLabProbability` |
| `/set-theory` | Set theory module | Set engine | Lab | Set/logic studio | `SetTheoryModule` |
| `/truth-table`, `/mathematical-logic` | Truth tables | Truth table engine | Calculator | Logic calculator studio | `TruthTableGenerator` |
| `/combinatorics` | Combinatorics visualizer | Counting utilities | Learning page | Counting studio | `Combinatorics` |

### Formula, Dictionary, Learning, Practice

| Route | Page Purpose | Existing Engine | Current Pattern | Proposed Pattern | Reuse |
| --- | --- | --- | --- | --- | --- |
| `/formulas`, `/formulas/:categorySlug` | Formula library | Formula data | Library | Searchable formula workspace | `Formulas`, formula data |
| `/visual-formulas/*` | Formula visualizer | Formula visualizer configs | Visualizer | Formula studio | `FormulaVisualizerPage` |
| `/theorems/*` | Theorem library | Theorem data/proofs | Library | Theorem workspace | `Theorems` |
| `/visual-dictionary` | Visual dictionary | Dictionary data | Dictionary | Search + definition + diagram | `MathVisualDictionary` |
| `/lessons/*` | Lessons | Lesson factories | Lesson pages | Compact lesson studio | Lesson modules |
| `/worked-examples` | Worked examples | Examples data | Library | Example + validation studio | `WorkedExamplesLibrary` |
| `/daily-challenge`, `/quiz`, `/spaced-repetition` | Practice | Quiz engines | Practice pages | Practice/validation studio | Existing quiz pages |

## Artificial Restrictions Found

| Location | Restriction Type | Status |
| --- | --- | --- |
| `src/modules/graph-theory/graphTheoryStore.ts` | `String.fromCharCode(65 + length)` label ceiling | Fixed: stable `node-N` IDs and spreadsheet-style labels |
| `src/graph-studio/graph3dSurfaceModel.test.ts` | Unlimited surface collection test exists | Preserve |
| `src/workspace/browserShareLinks.ts` | Max inline URL length | Practical browser constraint; preserve fallback |
| `src/workspace/browserProjectCenter.ts` | Recovery slot count | Practical persisted recovery slots; preserve |
| `src/workspace/geometry2dWorkspaceEngine.ts` | Max inferred relations | Performance guard; preserve |
| `src/modules/set-theory/setTheoryEngine.ts` | Element subset cap | Needs future review; likely classroom/performance guard |
| `src/workspace/geometryConstructionBuilder.ts` | Point labels use A-Z style | Needs future scalable label migration |

## Already Redesigned Or Partially Modernized

| Route | Status | Notes |
| --- | --- | --- |
| `/geometry` | Redesigned | Geometry Universe multi-tab studio; further cleanup can reuse shared shell later |
| `/graph-theory` | Redesigned | Compact single-screen graph studio using existing graph engine |
| `/linear-algebra` | Partially redesigned | Compact vector workspace added; compile issue fixed |
| `/workspace/graph` | Partially redesigned | Graph object visibility/colors and interaction improvements are in progress |
| `/workspace/3d`, `/shapes` | Partially redesigned | Existing advanced studio CSS and controls are present |
| Calculus visualizer pages | Partially redesigned | Dedicated CSS files exist for limits, derivatives, integration |

## Shared Studio Pattern

Use a reusable page shell for migrations:

- Compact header with breadcrumb, title, purpose, live status chips, difficulty/duration, share action.
- Internal tabs that are route-local.
- Main workspace grid: library/toolbox, primary visual/canvas, contextual inspector.
- Result strip, formula cards, validation cards, and guided learning are contextual.
- CSS classes are scoped to `studio-shell` or route-specific roots.

## Migration Order

1. Finish and verify representative pages:
   - 2D: `/geometry`
   - 3D: `/workspace/3d` or `/math-lab/3d-graphing`
   - graph/data-heavy: `/graph-theory` and `/workspace/graph`
2. Extract common studio layout primitives into `StudioPageShell`.
3. Migrate related families incrementally:
   - graphing pages
   - geometry/shapes pages
   - calculus pages
   - algebra/CAS/matrix pages
   - statistics/probability pages
   - dictionary/learning/practice pages
4. For each route, run direct load, tab/control smoke tests, TypeScript, and targeted tests.

## Deferred Routes

Most routes remain deferred by design. The modernization brief explicitly requires audit and incremental migration, not an unsafe all-at-once rewrite. Deferred pages need route-specific inspection and verification before migration.
