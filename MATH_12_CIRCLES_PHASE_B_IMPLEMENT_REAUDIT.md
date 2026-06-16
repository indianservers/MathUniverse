# Circles — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Upgrade existing circle learning with interactive theorem and formula scenes.
## 2. Current Status from Phase A
Existing.
## 3. Implementation Decision
Upgrade.
## 4. Target Routes
`/geometry/circles`, `/geometry/arcs-sectors`, `/geometry/chords-secants`, and `/geometry/tangents`.
## 5. Files to Inspect Before Coding
`src/visualizations/geometry/CircleExplorer.tsx`; `src/data/geometryConcepts.ts`; `src/pages/GeometryConceptPage.tsx`; circle visual proof files.
## 6. Files Expected to Change
Existing circle visualizer/concept UI, shared circle components, tests, and docs.
## 7. Components to Create or Refine
`CircleExplorer`, `CirclePartsScene`, `CircumferenceUnwrapScene`, `CircleAreaRearrangement`, `ChordSecantScene`, `TangentRadiusScene`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Every formula/theorem should have a dedicated circle action or proof.
## 10. Practice / Challenge Requirements
Add label, sector, tangent, chord, and misconception tasks.
## 11. Math Correctness Requirements
Handle radians/degrees, zero radius, tangent perpendicularity, and sector proportionality.
## 12. Accessibility Requirements
Keyboard controls, theorem summaries, non-color markers, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use stacked controls and readable labels.
## 14. Performance Requirements
Keep SVG animations light.
## 15. Testing Requirements
Test circle helpers, routes, edge cases, and build.
## 16. Route Verification Checklist
Verify all circle-related geometry routes and proof links.
## 17. Documentation Updates
Document upgraded circle models and edge-case behavior.
## 18. Final Codex Completion Report Format
Report files, circle cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing circle coverage is upgraded without duplicate routes.

