# Geometry Basics — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing geometry basics and workspace interactions with premium construction learning.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/geometry`, `/workspace/geometry`, and `/visual-proofs/geometry`.
## 5. Files to Inspect Before Coding
`src/data/geometryConcepts.ts`; `src/pages/Geometry.tsx`; `src/pages/GeometryConceptPage.tsx`; `src/pages/WorkspaceGeometry.tsx`; `src/workspace/geometry2dKernel.ts`.
## 6. Files Expected to Change
Existing geometry UI/workspace components, shared marker layers, tests, and docs.
## 7. Components to Create or Refine
`GeometryPreviewCanvas`, `AngleArcLayer`, `ParallelMarkerLayer`, `CongruenceTickLayer`, `ConstructionReplayPanel`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Show clear labels, arcs, tick marks, parallel arrows, and construction previews.
## 10. Practice / Challenge Requirements
Add construct, identify, measure, proof-relation, and error-correction tasks.
## 11. Math Correctness Requirements
Handle degenerate figures, exact object definitions, and measurement accuracy.
## 12. Accessibility Requirements
Keyboard construction, object list, ARIA labels, non-color markers, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use bottom tool drawer and large drag handles.
## 14. Performance Requirements
Keep preview and dragging smooth.
## 15. Testing Requirements
Test tools, geometry helpers, routes, mobile layout, and build.
## 16. Route Verification Checklist
Verify geometry, workspace geometry, and visual proof routes.
## 17. Documentation Updates
Document construction preview behavior and preserved workspace behavior.
## 18. Final Codex Completion Report Format
Report files, tools tested, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing geometry basics are upgraded without route or workspace duplication.

