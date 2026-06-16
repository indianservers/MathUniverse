# Linear Equations — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit and design premium linear equation learning through balance, graph, table, slope, and symbolic steps.
## 2. Current Status Classification
Existing — upgrade current module. Algebra route and linear visualizer exist.
## 3. Existing Routes and Files Found
`/algebra`; `/problem-solver`; `/math-lab/graphing-calculator`; `src/visualizations/algebra/LinearEquationVisualizer.tsx`; `src/problem-solver/algebraStepSolver.ts`.
## 4. Existing Features Found
Linear visualizer, algebra page, solver helpers, graphing route, and formula data.
## 5. Existing Weaknesses
Needs stronger balance metaphor, drag line controls, misconception repair, and linked representations.
## 6. Upgrade/Create Decision
Upgrade existing algebra/linear equation module; do not create a new linear-equation route.
## 7. Student Learning Goals
Solve equations, understand equivalent operations, read slope/intercept, and connect solution to graph/table.
## 8. Professor-Level Teaching Strategy
Use equivalence transformations, affine functions, slope as rate, and graph intersections.
## 9. Premium Interaction Design
Include click step reveal, drag line points, snap slope triangles, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Balance scale, number line, coordinate graph, table, slope triangle, and equation-step column.
## 11. Practice and Challenge Ideas
Solve for x, match graph, create line, repair illegal operation, and identify slope/intercept.
## 12. Beginner Mode
Use integer equations and explicit "same to both sides" language.
## 13. Professor Mode
Show transformation notation, domain/range, parameter form, and proof links.
## 14. Accessibility Requirements
Keyboard graph movement, ARIA step updates, non-color graph labels, and reduced motion.
## 15. Mobile Requirements
Use tabs for graph, balance, table, and steps.
## 16. Math Safety Requirements
Handle no solution, infinite solutions, zero coefficient, vertical-line warnings, and fractions.
## 17. Component Recommendations
Refine `LinearEquationVisualizer` and add `EquationBalanceScene`, `LinearGraphScene`, `SlopeTriangleScene`, and `EquationStepPanel`.
## 18. Testing Plan
Test positive/negative slopes, zero slope, no solution, infinite solutions, fractions, and graph updates.
## 19. Risks and Things Not to Touch
Do not break `/algebra`, graphing calculator, or problem-solver behavior.
## 20. Phase B Implementation Strategy
Upgrade the existing visualizer and reuse solver helpers for correctness.
## 21. Acceptance Criteria for Phase A
Linear equations are classified as existing with a clear upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade the existing LinearEquationVisualizer with balance, graph, table, checks, hints, and tests without adding a duplicate route.

