# Geometry Basics — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit geometry basics and design premium points, lines, rays, angles, parallel lines, triangles, and construction interactions.
## 2. Current Status Classification
Existing — upgrade current module. Geometry routes, data, workspace kernels, and visual proofs exist.
## 3. Existing Routes and Files Found
`/geometry`; `/workspace/geometry`; `/visual-proofs/geometry`; `src/data/geometryConcepts.ts`; `src/pages/Geometry.tsx`; `src/pages/WorkspaceGeometry.tsx`; `src/workspace/geometry2dKernel.ts`; `src/visual-proofs/proofs/geometry/*`.
## 4. Existing Features Found
Geometry concept route, geometry workspace, 2D construction kernels, theorem visualizers, and visual proofs.
## 5. Existing Weaknesses
Needs consistent preview construction, angle arcs, tick marks, parallel marks, and guided misconception correction.
## 6. Upgrade/Create Decision
Upgrade existing geometry module and workspace behavior safely.
## 7. Student Learning Goals
Understand points, lines, rays, angles, parallel relationships, triangle basics, and construction dependencies.
## 8. Professor-Level Teaching Strategy
Connect primitive objects to Euclidean reasoning, congruence, transformations, and theorem proof.
## 9. Premium Interaction Design
Include click-to-start tools, drag points, snap to special cases, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Construction canvas, angle arcs, parallel markers, congruence ticks, triangle labels, and construction replay.
## 11. Practice and Challenge Ideas
Construct objects, identify angle pairs, mark equal sides, build a bisector, and detect invalid diagrams.
## 12. Beginner Mode
Use fewer tools, large labels, and guided steps.
## 13. Professor Mode
Show dependencies, theorem names, proof relations, and construction protocol.
## 14. Accessibility Requirements
Keyboard object movement, object list, ARIA tool names, non-color geometry marks, and reduced motion.
## 15. Mobile Requirements
Tool drawer, large handles, and non-overlapping labels.
## 16. Math Safety Requirements
Handle degenerate triangles and distinguish segment/line/ray accurately.
## 17. Component Recommendations
Create or refine `GeometryPreviewCanvas`, `AngleArcLayer`, `ParallelMarkerLayer`, `CongruenceTickLayer`, and `ConstructionReplayPanel`.
## 18. Testing Plan
Test line/ray/segment previews, angle measures, parallel marks, triangle degeneracy, and construction toggles.
## 19. Risks and Things Not to Touch
Do not break geometry workspace tools, context menus, kernels, visual proofs, or concept IDs.
## 20. Phase B Implementation Strategy
Upgrade existing geometry concepts and workspace UI incrementally with preview and marker layers.
## 21. Acceptance Criteria for Phase A
Geometry basics are classified as existing with an upgrade-only path.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing geometry basics with construction previews, arcs, tick marks, parallel marks, checks, hints, and tests.

