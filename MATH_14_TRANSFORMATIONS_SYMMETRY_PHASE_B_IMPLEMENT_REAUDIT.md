# Transformations and Symmetry — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing transformation and symmetry routes with linked geometry and matrix visuals.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/geometry/transformations`, `/geometry/symmetry`, `/math/matrix-transformations`, and `/visual-proofs/transformations-symmetry`.
## 5. Files to Inspect Before Coding
`src/data/geometryConcepts.ts`; `src/pages/GeometryConceptPage.tsx`; `src/visualizations/linear-algebra/MatrixTransformationVisualizer.tsx`; `src/components/matrix/MatrixTransformationCanvas.tsx`.
## 6. Files Expected to Change
Existing transformation UI, shared transformation components, helper tests, and docs.
## 7. Components to Create or Refine
`TransformationPlaneScene`, `GhostShapeLayer`, `ReflectionMirrorScene`, `RotationCenterScene`, `MatrixRulePanel`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Show original, image, mapping arrows, coordinate rule, and matrix link.
## 10. Practice / Challenge Requirements
Add classify, match rule, compose, inverse, and symmetry tasks.
## 11. Math Correctness Requirements
Handle angle wrap, scale factors, matrices, orientation, and coordinate rounding.
## 12. Accessibility Requirements
Keyboard movement, coordinate tables, non-color shape labels, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use mode tabs and large touch handles.
## 14. Performance Requirements
Use lightweight SVG transforms and avoid expensive recomputation.
## 15. Testing Requirements
Test transformations, route load, matrix links, and build.
## 16. Route Verification Checklist
Verify geometry, matrix transformation, and visual-proof routes.
## 17. Documentation Updates
Document coordinate rules and matrix bridge.
## 18. Final Codex Completion Report Format
Report files, transformations tested, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing transformation coverage is upgraded without duplicate modules.

