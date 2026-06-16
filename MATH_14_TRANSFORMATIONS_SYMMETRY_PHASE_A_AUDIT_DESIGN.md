# Transformations and Symmetry — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit transformation coverage and design premium translation, rotation, reflection, dilation, symmetry, and matrix-rule visuals.
## 2. Current Status Classification
Existing — upgrade current module. Geometry transformations and matrix transformation routes exist.
## 3. Existing Routes and Files Found
`/geometry/transformations`; `/geometry/symmetry`; `/math/matrix-transformations`; `/visual-proofs/transformations-symmetry`; `src/visualizations/linear-algebra/MatrixTransformationVisualizer.tsx`; `src/components/matrix/MatrixTransformationCanvas.tsx`.
## 4. Existing Features Found
Geometry transformation concepts, matrix transformation visualizer, matrix canvas, and transformation/symmetry visual proof links.
## 5. Existing Weaknesses
Needs a clearer beginner bridge from shape movement to coordinate rules and matrix notation.
## 6. Upgrade/Create Decision
Upgrade existing geometry/matrix transformation modules.
## 7. Student Learning Goals
Identify translations, rotations, reflections, dilations, symmetry, compositions, and coordinate rules.
## 8. Professor-Level Teaching Strategy
Start with geometric movement, then coordinates, then matrices, determinants, and composition.
## 9. Premium Interaction Design
Include click transformation selection, drag shapes, snap centers/axes, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Before/after plane, ghost shape, mapping arrows, mirror line, rotation center, dilation rays, and matrix rule panel.
## 11. Practice and Challenge Ideas
Match rule to image, find reflection axis, rotate about center, compose moves, and detect symmetry.
## 12. Beginner Mode
Use one shape and one transformation at a time.
## 13. Professor Mode
Show matrices, determinants, orientation, eigenvectors, and composition algebra.
## 14. Accessibility Requirements
Keyboard shape movement, coordinate table, non-color before/after markers, and reduced motion.
## 15. Mobile Requirements
Mode tabs and large drag handles.
## 16. Math Safety Requirements
Handle zero/negative scale, angle wrap, reflection ambiguity, and coordinate rounding.
## 17. Component Recommendations
Refine existing matrix transformation visualizer and add `TransformationPlaneScene`, `GhostShapeLayer`, `ReflectionMirrorScene`, `RotationCenterScene`, and `MatrixRulePanel`.
## 18. Testing Plan
Test translate, rotate, reflect, dilate, compose, inverse, zero/negative scale, and mobile layout.
## 19. Risks and Things Not to Touch
Do not break matrix transformation route, geometry concept IDs, or matrix canvas behavior.
## 20. Phase B Implementation Strategy
Upgrade existing geometry and matrix transformation surfaces with shared transformation scenes.
## 21. Acceptance Criteria for Phase A
Transformations are classified as existing with an upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing transformation routes with ghost shapes, mapping arrows, coordinate rules, matrix links, checks, hints, and tests.

