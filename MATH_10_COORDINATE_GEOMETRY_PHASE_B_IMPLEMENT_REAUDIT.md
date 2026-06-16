# Coordinate Geometry — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing coordinate geometry with draggable formula-derivation scenes.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/geometry/coordinate-geometry`, `/workspace/geometry`, `/workspace/graph`, and `/visual-proofs/coordinate-geometry`.
## 5. Files to Inspect Before Coding
`src/data/geometryConcepts.ts`; `src/pages/GeometryConceptPage.tsx`; workspace geometry/graph files; `src/visual-proofs/proofs/coordinate-geometry/*`.
## 6. Files Expected to Change
Existing coordinate concept UI, shared coordinate components, helper tests, and docs.
## 7. Components to Create or Refine
`CoordinateGridScene`, `DeltaTriangleOverlay`, `MidpointBalanceScene`, `SlopeRelationshipPanel`, `CoordinatePracticeCard`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Every formula should be visually derived from grid movement.
## 10. Practice / Challenge Requirements
Add distance, midpoint, slope, section, and misconception tasks.
## 11. Math Correctness Requirements
Handle vertical slopes, radicals, fractions, quadrants, and identical points.
## 12. Accessibility Requirements
Keyboard movement, coordinate tables, graph summaries, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use responsive grid and large handles.
## 14. Performance Requirements
Keep drag smooth and limit grid label density.
## 15. Testing Requirements
Test helper formulas, routes, edge cases, and build.
## 16. Route Verification Checklist
Verify target geometry/workspace/proof routes.
## 17. Documentation Updates
Document formulas, edge cases, and upgraded scenes.
## 18. Final Codex Completion Report Format
Report files, coordinate cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing coordinate geometry is upgraded without duplicate routes.

