# Functions and Graphs — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit graphing/function tools and design premium input-output, domain/range, transformations, and graph-reading learning.
## 2. Current Status Classification
Existing — upgrade current module. Multiple graph/function routes and components exist.
## 3. Existing Routes and Files Found
`/math/functions-graphs`; `/math-lab/function-explorer`; `/workspace/graph`; `/graph-comparison`; `src/pages/FunctionsGraphsVisualizer.tsx`; `src/pages/MathLabFunctionExplorer.tsx`; `src/components/math-lab/FunctionGraphCanvas.tsx`; `src/utils/functionParser.ts`; `src/utils/graph.ts`.
## 4. Existing Features Found
Function visualizer, function explorer, graph workspace, comparison mode, graph canvas, parser, and sampler utilities.
## 5. Existing Weaknesses
Powerful graphing exists, but beginner scaffolding for function meaning, domain/range, and transformations needs strengthening.
## 6. Upgrade/Create Decision
Upgrade existing function/graph routes and components.
## 7. Student Learning Goals
Understand input-output, graph trace, table, domain, range, intercepts, transformations, and non-function tests.
## 8. Professor-Level Teaching Strategy
Connect mapping diagrams, formulas, tables, graphs, transformations, and composition/inverse ideas.
## 9. Premium Interaction Design
Include click trace, drag point/transform handles, snap to special values, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Function machine, mapping diagram, table, graph trace, domain mask, transformation handles, and intercept markers.
## 11. Practice and Challenge Ideas
Find output, identify domain/range, match graph to rule, transform graph, and detect non-functions.
## 12. Beginner Mode
Use simple rules, discrete points, and input-output language.
## 13. Professor Mode
Show notation, composition, inverse, continuity hints, and transformation algebra.
## 14. Accessibility Requirements
Keyboard trace controls, table equivalents, graph summaries, non-color markers, and reduced motion.
## 15. Mobile Requirements
Graph-first layout with table/values in tabs.
## 16. Math Safety Requirements
Handle undefined values, invalid expressions, discontinuities, asymptotes, and domain restrictions.
## 17. Component Recommendations
Refine `FunctionGraphCanvas` and add `FunctionMachineScene`, `GraphTraceScene`, `DomainRangePanel`, and `TransformationControls`.
## 18. Testing Plan
Test linear, quadratic, reciprocal, absolute value, square root, invalid input, transformations, and asymptotes.
## 19. Risks and Things Not to Touch
Do not break graph workspace, parser behavior, or graphing calculator route.
## 20. Phase B Implementation Strategy
Upgrade existing function routes with scaffolded learning panels and reuse current graph utilities.
## 21. Acceptance Criteria for Phase A
Functions/graphs are classified as existing and require upgrade, not creation.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing function and graph tools with function-machine, trace, domain/range, transformations, checks, hints, and tests.

