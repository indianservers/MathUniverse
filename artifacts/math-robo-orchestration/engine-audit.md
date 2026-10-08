# Math Robo orchestration audit — Phase A

Audit completed before application behavior changes for this task. The machine-readable engine inventory is in `engine-inventory.json`.

| Request | Current path | Existing engine to reuse | Integration gap |
|---|---|---|---|
| Draw, select, transform, delete | liveAssistant → SemanticEngine → executionPlanner → offline workspace bridge | Real graph/geometry workspace handlers | Preserve verified commits, rollback and undo |
| Geometry properties and construction | geometryQueries / derivedGeometry / resultVerifier | geometry2dKernel, geometry3dKernel, geometryPhase2, constructionEngine.evaluate | Some formulas already duplicated in Robo; migrate through adapters, do not create more |
| Solve / calculus / matrices / statistics | UI fallback → problemSolverEngine.solveProblem | Existing delegated step, expression, calculus, matrix, system, statistics, word, proportion and fractal solvers | Results and steps bypass canonical conversational memory |
| CAS and assumptions | Independent CAS notebook | evaluateCertifiedCas; createNotebookCell / evaluateNotebookCells; assumptionEngine | Expose typed, lazy adapters and bounded session notebook |
| Natural-language routing | Local neural heads + rules; separate routeQuery | Existing queryRouter | Treat neural output as a routing signal; capability-driven dispatch |
| Dynamic constructions | Native construction studio evaluator; dynamicWorkspaceEngine for definitions | constructionEngine.evaluate; workspace dependencyGraph | Robo marks/constructions mostly static; persist parent references and re-evaluate through existing evaluator |
| Algebra, calculus, complex, discrete, geometry, linear algebra, modelling, statistics, trigonometry | Separate studio engines | Existing studio enhancement engines and platform engine | Register callable functions, distinguish executable capabilities from discovery-only engine inventory |
| Subject modules | Separate engines | Set/set-expression, logic, graph theory, combinatorics, algebraic structures, decimal, foundations, automata, grammar, Turing, complexity, graph extensions | Add typed adapters and discoverable capabilities without copying algorithms |
| Spreadsheet, animation, AR | Native workspace/studio engines | spreadsheetStudioEngine, animationEngine, AR exploration/learning | Register engine interfaces; mutation must use the active workspace bridge, not disconnected state |
| Training security | buildPolicy + worker guards + admin-only bundle | Existing protected admin build, isolated candidate weights and correction queue | Preserve runtime inference; no training imports from runtime registry |

Plan: retain SemanticEngine and contextEngine; add a lazy engine/capability registry, structured specialist result adapter and response composer, bounded specialist memory, construction dependency adapter, then conversational tests. Use existing mathematical outputs for prose. Unsupported operations must remain explicit failures. Do not advertise every inventoried export as a working natural-language command.

Baseline evidence: preceding real 100-case suite passed 98/100, 4/4 workspace conversations passed, and 4,726 intelligence/offline regression tests passed. Rays/vectors lacked native execution in that phase; the audited native workspace and construction engines do contain primitives that can be adapted without creating new algorithms.
