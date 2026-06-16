# Coordinate Geometry — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit coordinate geometry coverage and design premium point, distance, midpoint, slope, section, and line-relation visuals.
## 2. Current Status Classification
Existing — upgrade current module. Geometry concept and coordinate visual proofs exist.
## 3. Existing Routes and Files Found
`/geometry/coordinate-geometry`; `/workspace/geometry`; `/workspace/graph`; `/visual-proofs/coordinate-geometry`; `src/data/geometryConcepts.ts`; `src/visual-proofs/proofs/coordinate-geometry/*`.
## 4. Existing Features Found
Coordinate geometry concept, workspace tools, coordinate proof library, and graph workspace.
## 5. Existing Weaknesses
Needs stronger drag-to-formula derivations, snap-to-grid, and misconception feedback.
## 6. Upgrade/Create Decision
Upgrade existing geometry/coordinate proof coverage.
## 7. Student Learning Goals
Plot points, compute distance, midpoint, slope, section, and classify parallel/perpendicular lines.
## 8. Professor-Level Teaching Strategy
Derive formulas from deltas, Pythagoras, averages, vectors, and slope products.
## 9. Premium Interaction Design
Include click point selection, drag points, snap to grid, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Coordinate grid, delta triangle, midpoint balance, slope triangle, line relation panel, and proof overlay.
## 11. Practice and Challenge Ideas
Find distance, midpoint, slope, section point, and repair coordinate-sign mistakes.
## 12. Beginner Mode
Use integer grid points and large coordinate labels.
## 13. Professor Mode
Show vector notation, derivations, section formula, and analytic geometry links.
## 14. Accessibility Requirements
Keyboard point movement, coordinate table, graph summaries, non-color markers, and reduced motion.
## 15. Mobile Requirements
Responsive SVG grid and bottom controls.
## 16. Math Safety Requirements
Handle vertical lines, same points, negative coordinates, fractions, and simplified radicals.
## 17. Component Recommendations
Create or refine `CoordinateGridScene`, `DeltaTriangleOverlay`, `MidpointBalanceScene`, `SlopeRelationshipPanel`, and `CoordinatePracticeCard`.
## 18. Testing Plan
Test quadrants, vertical/horizontal lines, same point, fractional midpoint, and negative coordinates.
## 19. Risks and Things Not to Touch
Do not break workspace geometry, graph workspace, or visual proof routes.
## 20. Phase B Implementation Strategy
Upgrade existing coordinate route and reuse visual proof/math helpers.
## 21. Acceptance Criteria for Phase A
Coordinate geometry is classified as existing with an upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing coordinate geometry with draggable grid scenes, formula derivations, checks, hints, and tests.

