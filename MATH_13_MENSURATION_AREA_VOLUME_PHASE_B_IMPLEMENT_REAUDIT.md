# Mensuration / Area / Volume — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing measurement routes with visual perimeter, area, surface-area, and volume scenes.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/shapes`, `/geometry/area-perimeter`, `/geometry/mensuration-3d`, and `/geometry/surface-area-volume`.
## 5. Files to Inspect Before Coding
`src/pages/ShapesExplorer.tsx`; `src/visualizations/geometry/Shape3DExplorer.tsx`; `src/data/geometryConcepts.ts`; `src/pages/GeometryConceptPage.tsx`.
## 6. Files Expected to Change
Existing shapes/measurement UI, shared measurement components, helper tests, and docs.
## 7. Components to Create or Refine
`AreaTilingScene`, `PerimeterTraceScene`, `SolidVolumeScene`, `NetUnfoldScene`, `UnitConversionPanel`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Show boundary, covered area, wrapped surface, filled volume, and unit conversion distinctly.
## 10. Practice / Challenge Requirements
Add estimate, formula-choice, net, composite, scale, and unit-error tasks.
## 11. Math Correctness Requirements
Handle units, exact/rounded values, zero dimensions, no negative dimensions, and scaling laws.
## 12. Accessibility Requirements
Keyboard controls, text summaries, non-color unit markers, and reduced motion.
## 13. Mobile Responsiveness Requirements
Stack panels and simplify 3D previews.
## 14. Performance Requirements
Cap rendered unit cubes and summarize large volumes.
## 15. Testing Requirements
Test formulas, routes, edge cases, mobile layout, and build.
## 16. Route Verification Checklist
Verify shapes and measurement geometry routes.
## 17. Documentation Updates
Document formulas, units, scale behavior, and preserved routes.
## 18. Final Codex Completion Report Format
Report files, shape cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing mensuration coverage is upgraded without duplicate modules.

