# Quadratic Equations — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit quadratic coverage and design premium parabola, roots, vertex, forms, discriminant, and completing-square learning.
## 2. Current Status Classification
Existing — upgrade current module. Quadratic visualizer and algebra route exist.
## 3. Existing Routes and Files Found
`/algebra`; `/problem-solver`; `/math-lab/function-explorer`; `src/visualizations/algebra/QuadraticEquationVisualizer.tsx`; `src/problem-solver/algebraStepSolver.ts`; `src/components/inquiry/InquirySimulationLabs.tsx`.
## 4. Existing Features Found
Quadratic visualizer, solver support, inquiry quadratic scene, function explorer, and formula data.
## 5. Existing Weaknesses
Needs stronger form switching, completing-square area model, discriminant meaning, and complex-root messaging.
## 6. Upgrade/Create Decision
Upgrade existing quadratic visualizer; do not create a duplicate quadratic route.
## 7. Student Learning Goals
Understand roots, vertex, axis, opening, forms, solution count, and graph-equation links.
## 8. Professor-Level Teaching Strategy
Connect standard, factor, and vertex forms through transformations and area completion.
## 9. Premium Interaction Design
Include click proof steps, drag roots/vertex, snap integer roots, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Parabola graph, root markers, vertex tracker, completing-square area, factor tiles, and discriminant meter.
## 11. Practice and Challenge Ideas
Match graph to equation, predict roots, complete square, create double root, and classify discriminant.
## 12. Beginner Mode
Use simple parabolas and "where it crosses/touches x-axis" language.
## 13. Professor Mode
Show derivation, form transformations, discriminant proof, and complex root interpretation.
## 14. Accessibility Requirements
Keyboard graph controls, text root summaries, non-color discriminant status, and reduced motion.
## 15. Mobile Requirements
Use tabs for graph, forms, proof, and practice.
## 16. Math Safety Requirements
Handle `a = 0`, no real roots, double roots, complex roots, and rounded values.
## 17. Component Recommendations
Refine `QuadraticEquationVisualizer` and add `QuadraticGraphScene`, `CompletingSquareScene`, `QuadraticFormsPanel`, and `DiscriminantMeter`.
## 18. Testing Plan
Test two roots, one root, no real roots, negative/positive `a`, vertex/factor forms, and `a = 0`.
## 19. Risks and Things Not to Touch
Do not break `/algebra`, solver helpers, function explorer, or inquiry labs.
## 20. Phase B Implementation Strategy
Upgrade current visualizer and connect helper math to graph/form panels.
## 21. Acceptance Criteria for Phase A
Quadratics are classified as existing with an upgrade-only path.
## 22. Suggested Codex Prompt for Phase B
Upgrade the existing quadratic visualizer with linked graph, forms, completing-square, discriminant, checks, hints, and tests.

