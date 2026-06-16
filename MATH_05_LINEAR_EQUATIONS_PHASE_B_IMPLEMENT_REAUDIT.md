# Linear Equations — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade the existing linear equation experience with linked balance, graph, table, and step visuals.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/algebra`, `/problem-solver`, and `/math-lab/graphing-calculator`.
## 5. Files to Inspect Before Coding
`src/visualizations/algebra/LinearEquationVisualizer.tsx`; `src/pages/Algebra.tsx`; `src/problem-solver/algebraStepSolver.ts`; graphing components.
## 6. Files Expected to Change
Existing linear visualizer, shared equation components, helper tests, and docs.
## 7. Components to Create or Refine
`LinearEquationVisualizer`, `EquationBalanceScene`, `LinearGraphScene`, `SlopeTriangleScene`, `EquationStepPanel`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Balance, graph, table, and symbolic steps must remain synchronized.
## 10. Practice / Challenge Requirements
Add solve, graph-match, line-create, and error-repair cards.
## 11. Math Correctness Requirements
Handle no solution, infinite solutions, zero coefficients, fractions, and undefined slope warnings.
## 12. Accessibility Requirements
Keyboard graph controls, ARIA live steps, non-color labels, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use tabbed panels and safe equation wrapping.
## 14. Performance Requirements
Keep graph updates smooth during coefficient changes.
## 15. Testing Requirements
Test solver helpers, visual states, routes, and build.
## 16. Route Verification Checklist
Verify `/algebra`, `/problem-solver`, and graphing route links.
## 17. Documentation Updates
Document upgraded visual models and edge cases.
## 18. Final Codex Completion Report Format
Report files, equation cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
The existing linear module is upgraded without route duplication.

