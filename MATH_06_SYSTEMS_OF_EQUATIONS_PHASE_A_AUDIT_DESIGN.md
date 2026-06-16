# Systems of Equations — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit systems coverage and design graph, substitution, elimination, and solution-type learning.
## 2. Current Status Classification
Existing — upgrade current module. Simultaneous-equation visualizer and system solver exist.
## 3. Existing Routes and Files Found
`/algebra`; `/problem-solver`; `/math-lab/graphing-calculator`; `/matrices/linear-equations`; `src/visualizations/algebra/SimultaneousEquationsVisualizer.tsx`; `src/problem-solver/systemSolver.ts`.
## 4. Existing Features Found
Systems visualizer, algebra route, solver tests/helpers, graphing route, and matrix linear-equation link.
## 5. Existing Weaknesses
Needs clearer direct vs expanded method comparison, solution classification, and misconception correction.
## 6. Upgrade/Create Decision
Upgrade existing systems visualizer and solver-linked UI.
## 7. Student Learning Goals
Understand one solution, no solution, infinite solutions, graph intersection, substitution, and elimination.
## 8. Professor-Level Teaching Strategy
Connect line geometry to algebraic elimination and matrix consistency.
## 9. Premium Interaction Design
Include click method reveal, drag lines, snap to integer intersections, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Two-line graph, elimination stack, substitution flow, coefficient table, and solution-type badge.
## 11. Practice and Challenge Ideas
Predict solution type, solve by method, make parallel/coincident lines, and repair algebra errors.
## 12. Beginner Mode
Use integer intersections and plain "both equations true" language.
## 13. Professor Mode
Show determinant, matrix form, rank/consistency, and row-operation links.
## 14. Accessibility Requirements
Keyboard line movement, patterned line labels, text solution summaries, and reduced motion.
## 15. Mobile Requirements
Graph-first layout with collapsible method panels.
## 16. Math Safety Requirements
Handle parallel, coincident, vertical, horizontal, near-singular, and rounded intersections.
## 17. Component Recommendations
Refine `SimultaneousEquationsVisualizer` and add `SystemGraphScene`, `EliminationAnimator`, `SubstitutionFlowPanel`, and `SolutionTypeBadge`.
## 18. Testing Plan
Test intersecting, parallel, coincident, vertical/horizontal, fractional, inconsistent, and dependent systems.
## 19. Risks and Things Not to Touch
Do not break algebra route, system solver, graphing calculator, or matrix pages.
## 20. Phase B Implementation Strategy
Upgrade existing visualizer and reuse system solver helpers for validation.
## 21. Acceptance Criteria for Phase A
Systems are classified as existing with an upgrade-only path.
## 22. Suggested Codex Prompt for Phase B
Upgrade the existing systems visualizer with graph, substitution, elimination, solution classification, checks, and tests.

