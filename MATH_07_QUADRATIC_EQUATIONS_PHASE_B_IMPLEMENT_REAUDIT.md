# Quadratic Equations — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing quadratic learning with linked graph, forms, discriminant, and completing-square scenes.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/algebra`, `/problem-solver`, and `/math-lab/function-explorer`.
## 5. Files to Inspect Before Coding
`src/visualizations/algebra/QuadraticEquationVisualizer.tsx`; `src/problem-solver/algebraStepSolver.ts`; `src/pages/Algebra.tsx`; function explorer files.
## 6. Files Expected to Change
Existing quadratic visualizer, new scene components, helper tests, and docs.
## 7. Components to Create or Refine
`QuadraticEquationVisualizer`, `QuadraticGraphScene`, `CompletingSquareScene`, `QuadraticFormsPanel`, `DiscriminantMeter`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Standard, factor, vertex, graph, and area models must stay synchronized.
## 10. Practice / Challenge Requirements
Add graph matching, root prediction, discriminant classification, and completing-square checks.
## 11. Math Correctness Requirements
Handle `a = 0`, double roots, complex roots, exact/rounded values, and sign errors.
## 12. Accessibility Requirements
Keyboard controls, text summaries, non-color state labels, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use stacked/tabs layout and safe equation wrapping.
## 14. Performance Requirements
Memoize sampled graph points and keep dragging smooth.
## 15. Testing Requirements
Test discriminant helpers, route rendering, edge cases, and build.
## 16. Route Verification Checklist
Verify algebra, solver, and function explorer.
## 17. Documentation Updates
Document upgraded forms and edge-case messages.
## 18. Final Codex Completion Report Format
Report files, quadratic cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
The existing quadratic module is upgraded without route duplication.

