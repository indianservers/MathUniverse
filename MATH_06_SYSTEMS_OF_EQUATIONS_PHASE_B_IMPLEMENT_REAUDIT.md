# Systems of Equations — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade the existing systems experience with graph, substitution, elimination, and solution classification.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/algebra`, `/problem-solver`, `/math-lab/graphing-calculator`, and `/matrices/linear-equations`.
## 5. Files to Inspect Before Coding
`src/visualizations/algebra/SimultaneousEquationsVisualizer.tsx`; `src/problem-solver/systemSolver.ts`; algebra, graphing, and matrix pages.
## 6. Files Expected to Change
Existing systems visualizer, method panels, helpers/tests, and docs.
## 7. Components to Create or Refine
`SimultaneousEquationsVisualizer`, `SystemGraphScene`, `EliminationAnimator`, `SubstitutionFlowPanel`, `SolutionTypeBadge`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Graph and algebra methods must show the same solution state.
## 10. Practice / Challenge Requirements
Add method choice, intersection prediction, and solution-type tasks.
## 11. Math Correctness Requirements
Detect parallel, coincident, vertical, horizontal, inconsistent, and dependent systems.
## 12. Accessibility Requirements
Keyboard line control, text summaries, non-color labels, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use graph-first stack and collapsible method panels.
## 14. Performance Requirements
Avoid expensive graph recomputation while dragging.
## 15. Testing Requirements
Test system helpers, route rendering, edge cases, and build.
## 16. Route Verification Checklist
Verify algebra, solver, graphing, and matrix links.
## 17. Documentation Updates
Document upgraded methods and solution-type logic.
## 18. Final Codex Completion Report Format
Report files, systems tested, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
The existing systems module is upgraded without route duplication.

