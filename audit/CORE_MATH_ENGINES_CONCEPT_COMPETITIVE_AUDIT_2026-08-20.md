# Core Mathematics Engines and Concepts — Competitive Audit

Date: 20 August 2026  
Scope: 2D Graphing, 3D Graphing, Geometry, CAS, Probability & Statistics  
Competitors: GeoGebra, Desmos, Wolfram|Alpha  

## What this audit measures

This audit is primarily about mathematics, concept coverage, executable depth, analysis tools, interaction quality, and internal engine design. Offline capability is not used to determine the rankings.

Scoring weights:

- Mathematical correctness and computational depth: 30%
- Concept and representation coverage: 20%
- Interaction and visualization quality: 20%
- Analysis and discovery features: 15%
- Cross-module integration and document model: 10%
- Accessibility: 5%

## Executive ranking across the five modules

| Rank | Product | Composite | Primary advantage |
| --- | --- | ---: | --- |
| 1 | GeoGebra | 9.2/10 | Best unified mathematical object system spanning algebra, geometry, CAS, 2D, 3D, tables, and probability. |
| 2 | Wolfram\|Alpha | 8.1/10 | Deepest symbolic, statistical, probability, and natural-language computation. |
| 3 | Desmos | 7.9/10 | Best 2D graphing experience; excellent interactive 3D, regressions, and accessibility. |
| 4 | Math Universe | 7.6/10 | Broadest teaching/concept layer, but its concepts are not always backed by equally deep reusable engines. |

Math Universe ranks much higher when the question is **“Which app explains and visualizes the greatest number of concepts?”**:

| Rank | Product | Concept-learning score |
| --- | --- | ---: |
| 1 | Math Universe | 9.0/10 |
| 2 | GeoGebra | 8.6/10 |
| 3 | Wolfram\|Alpha | 8.2/10 |
| 4 | Desmos | 7.5/10 |

The goal is therefore not to add hundreds of new concept pages. It is to make every important concept executable through a shared, verified engine.

---

## 1. 2D Graphing

### Overall ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | Desmos | 9.7 | Best expression workflow, curve interaction, points of interest, sliders, tables, regressions, actions, and graph accessibility. |
| 2 | GeoGebra | 9.2 | Nearly as capable graphically, with substantially stronger links to CAS, geometry, spreadsheet, and construction objects. |
| 3 | Math Universe | 7.5 | Good breadth of plot types and a useful learning/workspace layer; analysis, expression language, scale, and interaction depth trail the leaders. |
| 4 | Wolfram\|Alpha | 7.2 | Very broad plot computation and analysis, but less suited to continuous direct manipulation. |

### Math Universe implemented concepts

The shared graph panel defines these native plot kinds:

- Explicit functions
- Implicit equations
- Parametric curves
- Polar curves
- Inequalities
- Piecewise functions
- Scatter plots
- Regression plots
- Tables of values
- Parameters `a` and `b`

The sampler supports explicit, implicit, parametric, polar, piecewise, and inequality descriptors. The UI includes graph validation, visibility, locking, duplication, styling, trace state, value tables, viewport bounds, scatter data, and regression transfer.

### Concept-by-concept ranking

| Concept / feature | #1 | #2 | #3 | #4 | MU score | Finding |
| --- | --- | --- | --- | --- | ---: | --- |
| Explicit functions | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 8.3 | Solid basic sampling; needs adaptive discontinuity handling and a much richer expression language. |
| Implicit curves | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 6.8 | Implemented, but sampling/contouring is less mature and less precise than specialist engines. |
| Parametric curves | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.5 | Range syntax exists; needs vector-valued expressions, better domains, animation, derivatives, and curvature. |
| Polar curves and regions | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.3 | Curves exist; polar inequalities, period detection, polar grid controls, and analysis need work. |
| Inequality regions | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 6.5 | Present, but compound Boolean regions, boundary controls, intersections, and robust shading are limited. |
| Piecewise functions | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.4 | `if(...)` form is supported; needs interval notation, endpoint styling, nested conditions, and domain UI. |
| Tables and scatter data | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 7.3 | Tables exist but are not yet a first-class high-volume linked data system. |
| Sliders and animation | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 6.7 | Only the shared `a` and `b` parameter path is mature; arbitrary variables and dependency animation are required. |
| Points of interest | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 5.3 | Missing automatic roots, intercepts, extrema, discontinuities, and reliable curve intersections on the graph itself. |
| Function analysis | Wolfram\|Alpha | GeoGebra | Desmos | Math Universe | 5.6 | Needs domain/range, zeros, extrema, asymptotes, monotonicity, concavity, derivative/integral overlays, and error bounds. |
| Regression | Desmos | Wolfram\|Alpha | GeoGebra | Math Universe | 6.6 | Linear, quadratic, cubic, and exponential kernels exist, but the main graph button currently adds only linear regression. |
| Lists, sequences, folders, actions | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 3.8 | This is a major functional gap in the expression language and document model. |
| Complex graphing | Desmos | Wolfram\|Alpha | GeoGebra | Math Universe | 4.2 | Needs complex mode, domain coloring, Re/Im plots, loci, and branch visualization. |
| Accessibility / audio trace | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 4.8 | No Desmos-class sonification/audio trace or complete narrated graph exploration. |
| CAS/geometry integration | GeoGebra | Math Universe | Wolfram\|Alpha | Desmos | 7.5 | Transfer exists, but not as a fully reactive shared dependency graph. |

### Internal limitations

- `buildAddedGraphPlots(...).slice(0, 10)` limits the principal 2D graph surface to ten plots.
- Expression evaluation ultimately uses a restricted string transformation and generated function. It is guarded, but it is not a full typed mathematical AST/runtime.
- Sampling resolution is largely fixed. Adaptive subdivision, interval arithmetic, discontinuity classification, and robust implicit contouring are not evident.
- Scatter/regression data and spreadsheet data are transferred rather than universally linked.
- There is no single extensible expression engine shared consistently with CAS and geometry.

### Required upgrade

Build one typed expression compiler and adaptive graph kernel supporting arbitrary parameters, lists, sequences, actions, restrictions, complex mode, automatic analysis objects, exact/numeric intersections, regression families, residuals, confidence bands, and graph sonification.

---

## 2. 3D Graphing

### Overall ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | GeoGebra | 9.5 | Strongest combination of 3D surfaces and exact dynamic 3D geometry. |
| 2 | Desmos | 9.0 | Excellent expression-first 3D plotting, familiar interaction, restrictions, transparency, and complex mode. |
| 3 | Math Universe | 7.6 | Attractive object studio, solid presets, transforms, slices, materials, and teaching views; general mathematical surface support is still limited. |
| 4 | Wolfram\|Alpha | 7.4 | Extremely broad plot generation and analysis, but less direct manipulation than the three studios. |

### Math Universe implemented concepts

- Explicit custom surfaces `z=f(x,y)`
- Preset paraboloid, saddle, plane, wave, ripple, and cone surfaces
- One parametric torus preset
- One implicit sphere preset
- Points, vectors, lines, planes, and many solid types
- Cross-section plane
- XY and XZ projections
- Multiple independently styled scene objects
- Translation, rotation, scaling, dimensions, opacity, materials, visibility, and locking
- Matte, glass, and wireframe materials
- Camera presets, zoom, rotation, animation speed, and performance mode
- Surface/plane/sphere intersection overlays and measurements
- CAS-to-3D and 3D-to-CAS/Geometry transfer

### Concept-by-concept ranking

| Concept / feature | #1 | #2 | #3 | #4 | MU score | Finding |
| --- | --- | --- | --- | --- | ---: | --- |
| Explicit `z=f(x,y)` surfaces | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 8.0 | Useful custom surface entry; needs richer domains, adaptive meshing, singularity handling, and analysis. |
| General implicit surfaces | GeoGebra | Desmos | Wolfram\|Alpha | Math Universe | 4.5 | Current `implicit` surface is effectively a sphere preset, not a general `F(x,y,z)=0` engine. |
| General parametric surfaces | GeoGebra | Desmos | Wolfram\|Alpha | Math Universe | 4.8 | Current `parametric` surface is a torus preset, not arbitrary `r(u,v)`. |
| Curves in 3D | GeoGebra | Desmos | Wolfram\|Alpha | Math Universe | 5.0 | General parametric space curves, helices, curve intersections, tangents, and Frenet frames need a native model. |
| Multiple expressions | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 8.0 | Multiple scene objects work; expression management must become as fluid as the 2D list. |
| Restrictions and regions | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | 4.8 | Needs Boolean restrictions, clipped regions, bounded solids, and domain controls. |
| Cross-sections and intersections | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.0 | Present, but some overlays are descriptive/preset-based rather than general computed intersection curves. |
| Contours and level sets | Wolfram\|Alpha | GeoGebra | Desmos | Math Universe | 3.5 | Add contour planes, projected contour maps, labeled levels, and linked 2D views. |
| Vector fields and differential geometry | Wolfram\|Alpha | GeoGebra | Desmos | Math Universe | 3.0 | Missing vector fields, gradient fields, divergence/curl, normals, tangent planes, curvature, and flow lines. |
| Coordinate systems | Wolfram\|Alpha | GeoGebra | Desmos | Math Universe | 4.0 | Add cylindrical, spherical, and user-defined coordinate transformations. |
| Solid/object studio | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 8.4 | Math Universe is strong here, with many solids and object properties. |
| Styling and camera | Desmos | GeoGebra | Math Universe | Wolfram\|Alpha | 8.0 | Good material/camera controls; improve selection, snapping, lighting, legends, and export. |
| 3D geometry integration | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 8.0 | A genuine strength, but object dependencies must become fully reactive and exact. |

### Internal limitations

- “Parametric” and “implicit” are named capabilities but are currently preset implementations.
- `surfaceZ` is a height-function architecture; it cannot represent general multi-valued or vertical implicit surfaces.
- Intersection overlays include hard-coded/preset visual logic alongside kernel calculations.
- The renderer and mathematical sampler are tightly coupled inside a very large page module.

### Required upgrade

Create a standalone 3D math kernel for explicit, parametric, implicit, and volumetric regions. Use adaptive meshing/isosurfaces; general curve/surface intersections; derivatives, normals, curvature, gradients and fields; contour projections; coordinate systems; precise probing; and a reusable scene-object graph.

---

## 3. Dynamic Geometry

### Overall ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | GeoGebra | 9.8 | The reference product for algebra-linked dynamic construction, exact dependencies, loci, protocol, 3D, and authoring. |
| 2 | Desmos | 8.9 | Excellent modern 2D geometry with expression tokens, transformations, measurements, and algebra connections. |
| 3 | Math Universe | 8.0 | Broad tool palette and real dependency recomputation; needs a more general constraint engine, stronger algebra linkage, and mature authoring. |
| 4 | Wolfram\|Alpha | 6.8 | Strong at computing geometric properties but not a construction-first dynamic system. |

### Math Universe implemented concepts

Basic objects:

- Point, segment, line, ray, vector, circle, polygon, angle
- Freehand, text, image, canvas movement, and zoom

Constructions:

- Parallel and perpendicular lines
- Perpendicular and angle bisectors
- Midpoint and intersection
- Fixed length and point-on-circle constraints
- Circle by radius and circle through three points
- Triangle, rectangle, regular polygon
- Parabola, ellipse, hyperbola
- Tangent, polar construction, locus, arc, sector, compass
- Reflection, rotation, dilation, and translation

Internal features:

- Parent-based dependency recomputation
- Object and grid snapping
- Measurement overlays and units
- Locus traces
- Object styling, labels, locking, visibility, duplication, deletion, undo/redo
- Construction protocol/history and serialization
- Geometry-to-CAS/Graph/3D object transfer

### Concept-by-concept ranking

| Concept / feature | #1 | #2 | #3 | #4 | MU score | Finding |
| --- | --- | --- | --- | --- | ---: | --- |
| Basic constructions | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 8.5 | Broad palette with good school-level coverage. |
| Constraint/dependency solving | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.5 | Key dependencies recompute, but the constraint system is not yet general or algebraically inspectable enough. |
| Intersections | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.7 | Lines and circles are supported; expand all conic/curve combinations and degenerate cases. |
| Transformations | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.8 | Core transforms exist; current preset 45-degree rotation and 1.5x dilation must become fully parameterized tools. |
| Conics | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.6 | Good concept coverage; construction definitions, foci/directrices, tangency, and algebra links need depth. |
| Loci and traces | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 7.7 | Live trace exists; needs exact locus generation, equation inference, and dependency animation. |
| Measurement and units | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.5 | Useful units/precision; add dimension analysis and exact symbolic measures. |
| Construction protocol | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 8.0 | Strong internal feature; make steps editable, replayable, branching, and exportable. |
| Algebra-expression linkage | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 6.5 | Transfer is not the same as every geometric object having a live algebraic definition. |
| Geometric proof/theorem learning | Math Universe | GeoGebra | Wolfram\|Alpha | Desmos | 9.2 | Math Universe’s major competitive advantage. |
| 3D continuation | GeoGebra | Math Universe | Desmos | Wolfram\|Alpha | 8.2 | Strong route-level integration; needs a single shared object identity across 2D and 3D. |
| Authoring and reusable tools | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 5.8 | Add custom tools, macros, templates, reusable constructions, metadata, and a stable native file format. |

### Internal limitations

- Several construction tools are implemented as fixed presets rather than parameter-driven reusable operations.
- The dependency solver uses a defined set of constraint cases and iterative recomputation, not a general symbolic/numeric constraint graph.
- Objects can be transferred between workspaces, but their identity and dependency relations are not universally live.
- Geometry UI/kernel code remains concentrated in very large files, increasing regression risk.

### Required upgrade

Adopt a universal geometry object schema with exact predicates, general constraints, symbolic definitions, robust degeneracy handling, full conic intersections, parameterized transforms, construction replay, macros/custom tools, theorem conditions, and seamless 2D/3D identities.

---

## 4. CAS and Symbolic Mathematics

### Overall ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | Wolfram\|Alpha | 9.8 | Deepest algorithms, domains, assumptions, special functions, equation solving, and mathematical interpretation. |
| 2 | GeoGebra | 8.8 | Strong educational CAS with direct links to graphs, geometry, sliders, tables, and construction objects. |
| 3 | Math Universe | 7.7 | Impressive offline notebook operation inventory and useful structured explanations; engine/domain depth remains below mature CAS systems. |
| 4 | Desmos | 3.8 | Primarily numeric/graphical rather than a general symbolic CAS. |

### Math Universe operation inventory

The CAS notebook exposes 36 operation types:

- Simplify, factor, expand
- Solve equation, system, inequality, numerical equation, and complex equation
- Differentiate, implicit differentiate, integrate, definite integrate
- Limit and one-sided limit
- Taylor polynomial
- Laplace and inverse Laplace transforms
- ODE solving
- Tangent line
- Identity verification and substitution
- Partial fractions, polynomial division, complete square, rationalize
- Matrix display, determinant, inverse, multiply, RREF, rank, eigenvalues, eigenvectors
- Lists

Notebook features include assignments, earlier-cell references, exact/numeric modes, assumptions text, dependencies, warnings, structured steps, history, persistence, graph preview, spreadsheet preview, LaTeX/MathML/plain copy, JSON/Markdown export, and transfer to graph/3D/spreadsheet.

### Concept-by-concept ranking

| Concept / feature | #1 | #2 | #3 | #4 | MU score | Finding |
| --- | --- | --- | --- | --- | ---: | --- |
| Algebraic manipulation | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 8.1 | Strong school/UG basics; needs deeper domains and canonical simplification policies. |
| Equation/system solving | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.8 | Multiple modes exist; expand multivariate, parametric, transcendental, conditional, and domain-aware solutions. |
| Inequalities | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.0 | Needs compound systems, exact interval/set output, parameter cases, and graphical linkage. |
| Differential calculus | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.8 | Standard and implicit differentiation exist; add higher/partial/directional/tensor derivatives as first-class operations. |
| Integral calculus | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.5 | Indefinite/definite exist; add improper, multiple, line/surface integrals and stronger condition handling. |
| Limits and series | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.4 | One-sided limits and Taylor are useful; add arbitrary series, convergence tests, asymptotics, and branch conditions. |
| Transforms and ODEs | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 7.4 | Broad operation labels; actual equation/function family coverage requires systematic certification. |
| Linear algebra | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.7 | Core exact operations exist; LU/QR/SVD, Jordan form, null spaces, decompositions, conditioning, and sparse/numeric methods are missing. |
| Complex analysis | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 5.5 | Complex roots are not complex analysis; add branches, residues, analytic functions, contours, and conformal maps. |
| Assumptions/domains | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 5.8 | Assumption summaries/warnings exist, but assumptions are not yet a comprehensive engine-level domain system. |
| Step-by-step derivation | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 7.6 | Structured records are valuable, but the code acknowledges that some steps summarize engine output instead of exact intermediate algebra. |
| Verification | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 7.8 | Identity verification and step verification text are good foundations; add independent numeric/symbolic certificates. |
| Notebook memory/dependencies | GeoGebra | Math Universe | Wolfram\|Alpha | Desmos | 8.0 | Assignments and prior-cell references work; dependencies need reactive recalculation and cycle detection. |
| Graph/geometry/table integration | GeoGebra | Math Universe | Wolfram\|Alpha | Desmos | 7.8 | Transfers and previews exist, but they are not one universal live object graph. |
| Units, probability, sets, Boolean algebra | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 4.8 | Visible navigation implies some of this breadth, but the CAS operation model does not yet expose validated general operations for it. |

### Internal limitations

- The core is built substantially on Nerdamer plus application-specific symbolic helpers. This is practical, but it does not match the algorithm/domain breadth of Wolfram technology.
- “Assumptions” are partly summary/warning metadata rather than pervasive constraints governing all transformations.
- Structured steps can be explanatory wrappers when the underlying engine does not return exact intermediate expressions.
- Some advanced operations exist as individual helpers without a published conformance matrix of supported mathematical families and failure modes.
- Earlier-cell references are resolved, but notebook cells are not yet a fully reactive dependency DAG.

### Required upgrade

Publish a CAS capability contract by operation, domain, supported input family, exactness, conditions, and failure state. Add reactive dependencies, domain/assumption objects, solution sets, higher/partial calculus, series/convergence, advanced linear algebra, complex analysis, optimization, units, probability, set/logic operations, and independently verified step certificates.

---

## 5. Probability & Statistics

### Overall ranking

Two rankings are required because Math Universe’s concept breadth and executable analysis depth differ substantially.

#### Computational tool ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | Wolfram\|Alpha | 9.6 | Deep descriptive/inferential statistics, distributions, random variables, regressions, probability, and natural-language computation. |
| 2 | GeoGebra | 8.5 | Strong probability calculator, linked tables/spreadsheet, distributions, statistical tests, and classroom interaction. |
| 3 | Desmos | 7.9 | Excellent regressions, residuals, distributions, data tables, and approachable visualization. |
| 4 | Math Universe | 7.3 | Very broad dedicated studios, but the shared data-analysis workspace still exposes important disabled features. |

#### Concept-learning ranking

| Rank | Product | Score | Assessment |
| --- | --- | ---: | --- |
| 1 | Math Universe | 9.4 | The broadest explicit curriculum from school statistics through Bayesian, stochastic, multivariate, survival, actuarial, and official statistics. |
| 2 | Wolfram\|Alpha | 9.0 | Extremely broad computational knowledge and explanations. |
| 3 | GeoGebra | 8.1 | Strong core probability/statistics learning through dynamic calculation. |
| 4 | Desmos | 7.6 | Excellent concept exploration around graphs, distributions, regression, and classroom activities. |

### Math Universe concept inventory

The Distribution Atlas contains 27 explicitly defined distributions, including foundational discrete and continuous families plus heavy-tailed, lifetime, mixture-related, and advanced models.

Dedicated core studios cover:

- Sampling distributions and central-limit behavior
- Confidence intervals, hypothesis tests, p-values, power, and ANOVA
- Regression, residuals, R-squared, RMSE, outliers, and model diagnostics
- Bayesian priors, likelihood, posterior belief, and beta conjugacy
- Markov chains, queues, Poisson-process intuition, reliability, and steady state
- Multivariate normal geometry, covariance, entropy, KL divergence, and mixtures

Thirteen syllabus studios add:

- Survey sampling
- Design of experiments
- Statistical quality control
- Time series
- Nonparametric tests
- Multivariate analysis
- Advanced inference
- Official statistics
- Survival analysis
- Actuarial/reliability statistics
- Statistical computing
- Applied modelling
- School statistics

### Concept-by-concept ranking

| Concept / feature | #1 | #2 | #3 | #4 | MU score | Finding |
| --- | --- | --- | --- | --- | ---: | --- |
| Descriptive statistics | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.2 | Strong teaching coverage; needs a single robust data-analysis command/workbook experience. |
| Probability rules/combinatorics | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.3 | Good learning breadth; expand executable event algebra and exact combinatorial models. |
| Distribution breadth | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.8 | Twenty-seven explicit models are excellent; certification of PDF/PMF/CDF, inverse CDF, sampling, moments, and tails is needed. |
| Distribution interaction | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 8.0 | Sliders and charts are good; add tail dragging, quantile solving, overlays, fitting, sampling, and comparison. |
| Sampling and CLT learning | Math Universe | GeoGebra | Wolfram\|Alpha | Desmos | 9.0 | A standout conceptual area. |
| Confidence intervals/testing | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | 7.2 | Dedicated pages exist, but the spreadsheet ribbon currently disables hypothesis tests and confidence intervals. |
| ANOVA/design of experiments | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.2 | Strong concepts; needs real dataset-driven model fitting, ANOVA tables, diagnostics, and post-hoc tests. |
| Regression and residuals | Desmos | Wolfram\|Alpha | GeoGebra | Math Universe | 6.8 | Separate learning studio is useful; shared spreadsheet enables only linear regression and disables other visible models. |
| Bayesian statistics | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.6 | Excellent prior/likelihood/posterior intuition; add general likelihood models, posterior predictive checks, MCMC, and model comparison. |
| Stochastic processes | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.4 | Markov/queue/reliability concepts are strong; add general state matrices, simulation paths, hitting times, and fitted processes. |
| Time series | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.0 | Broad concept page; needs real imports, decomposition, ACF/PACF, estimation, forecast intervals, backtesting, and diagnostics. |
| Nonparametric methods | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.1 | Good syllabus breadth; needs real ranked-data engines, exact/asymptotic p-values, ties, and effect sizes. |
| Multivariate analysis | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.0 | PCA/MANOVA/Hotelling concepts exist; add executable matrix/data workflows and diagnostic plots. |
| Survival/actuarial/reliability | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.6 | Rare and valuable educational coverage; needs uploaded datasets, censoring tables, KM estimation, Cox models, and uncertainty. |
| Simulation/bootstrap/permutation | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | 8.2 | Concepts exist; implement seeded reproducible simulations, resampling data, convergence, and performance controls. |
| Spreadsheet/data workflow | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | 7.1 | XLSX/CSV capabilities are useful; statistical commands, plots, cleaning, pivots, missing data, and model objects require consolidation. |

### Critical internal mismatch

In `CasSpreadsheetStudio`, these visible features are currently disabled:

- Polynomial regression
- Exponential regression
- Logistic regression
- Hypothesis testing
- Confidence intervals
- Distribution analysis

Yet separate pages teach many of those concepts. This makes the app appear broader than its reusable analysis engine actually is.

Many of the thirteen syllabus studios are parameterized educational simulations with formulas, metrics, lines, and bars. They are valuable learning experiences, but they are not substitutes for general dataset-driven statistical implementations.

### Required upgrade

Build one verified statistics engine and analysis workbook supporting typed datasets, missing data, transformations, descriptive statistics, distribution objects, PMF/PDF/CDF/quantiles/sampling, estimation, confidence intervals, tests, effect sizes, ANOVA/DOE, regression/GLMs, diagnostics, resampling, Bayesian models, time series, multivariate methods, survival analysis, and reproducible reports.

---

## Shared internal-feature ranking

| Internal capability | #1 | #2 | #3 | #4 | Math Universe assessment |
| --- | --- | --- | --- | --- | --- |
| Unified live object model | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | Transfer envelopes and partial object graph exist; full reactive identity/dependencies do not. |
| Expression language | Wolfram\|Alpha | Desmos | GeoGebra | Math Universe | Multiple internal parsers/evaluators need consolidation. |
| Exact symbolic engine | Wolfram\|Alpha | GeoGebra | Math Universe | Desmos | Good operation breadth, limited domain depth. |
| Direct manipulation | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | Good foundations, inconsistent across modules. |
| Concept explanations | Math Universe | Wolfram\|Alpha | GeoGebra | Desmos | Current competitive strength. |
| Mathematical steps/protocol | Wolfram\|Alpha | Math Universe | GeoGebra | Desmos | Strong foundation, but not every step is an engine certificate. |
| Data workflow | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | Import/export exists; analysis commands remain fragmented. |
| Accessibility of graphs | Desmos | GeoGebra | Wolfram\|Alpha | Math Universe | Sonification and Braille math interaction are major gaps. |
| Authoring/reusable documents | GeoGebra | Desmos | Math Universe | Wolfram\|Alpha | Stable unified document format and custom tools are needed. |
| Cross-module learning integration | Math Universe | GeoGebra | Desmos | Wolfram\|Alpha | Strong route/content links; mathematical object links need matching depth. |

## Priority order to become #1

### P0 — One engine truth

1. Replace parallel expression evaluators with one typed AST, parser, evaluator, and domain system shared by 2D, 3D, CAS, geometry, and statistics.
2. Define universal objects: expression, parameter, point, curve, region, surface, geometry construction, table, distribution, statistical model, CAS result, proof step.
3. Make all dependencies reactive with cycle detection, exact/numeric modes, units/domains, provenance, undo/redo, and serialization.
4. Publish mathematical conformance tests and capability matrices for every advertised concept.

### P1 — Win 2D and Geometry

1. Arbitrary sliders, lists, sequences, actions, folders, restrictions, points of interest, analysis objects, and audio trace.
2. Adaptive sampling and exact/numeric intersection services.
3. General parameterized geometry constraints, algebra-linked objects, reusable tools/macros, and construction replay.
4. Treat formula/proof/lesson modes as guided views of the same live graph/geometry objects.

### P2 — Win CAS

1. Reactive notebook DAG and comprehensive assumptions/domains.
2. Certified solver coverage and conditional solution sets.
3. Higher/partial calculus, convergence/asymptotics, advanced linear algebra, complex analysis, optimization, probability, units, sets, and logic.
4. Engine-derived, independently verified step certificates.

### P3 — Win 3D

1. General parametric and implicit surfaces, space curves, regions, and adaptive meshing.
2. General intersections, contours, restrictions, vector fields, gradients, normals, tangent planes, curvature, and coordinate systems.
3. One scene object list with the same expression language and parameter system as 2D/CAS.

### P4 — Win Probability & Statistics

1. Convert every major concept studio into a reusable dataset/model engine.
2. Enable all currently disabled spreadsheet analysis features.
3. Add diagnostics, uncertainty, simulation, reproducibility, and downloadable analysis reports.
4. Make distributions/statistical models first-class objects graphable in 2D/3D and manipulable in CAS/spreadsheet.

## Product acceptance target

Math Universe should claim leadership only when a user can:

1. Define data, parameters, equations, geometric objects, distributions, and models once.
2. Use those same objects live in 2D, 3D, Geometry, CAS, and P&S.
3. Inspect exact definitions, assumptions, dependencies, numerical methods, errors, and provenance.
4. Receive verified analysis, visual explanations, and step-by-step learning from the same mathematical result.
5. Save/export the complete linked document without losing object identity.

That unified experience—not additional disconnected pages—is the path to surpassing GeoGebra, Desmos, and Wolfram|Alpha.

## Official competitor references

- GeoGebra Calculator Suite and app comparison: linked Graphing, Geometry, 3D, CAS, Probability, table, and spreadsheet views.
- Desmos official Graphing, Geometry, 3D, Regression, Distribution, Polar, and Supported Functions documentation.
- Wolfram|Alpha official Mathematics, Plotting, Algebra, Probability, Statistics, and Step-by-Step examples.

