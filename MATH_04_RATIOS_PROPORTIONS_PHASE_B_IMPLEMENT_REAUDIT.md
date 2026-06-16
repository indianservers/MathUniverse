# Ratios and Proportions — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend current ratio-related geometry/trigonometry pieces into a proportional reasoning lab.
## 2. Current Status from Phase A
Partial.
## 3. Implementation Decision
Extend.
## 4. Target Routes
`/geometry/similar-triangles`, `/geometry/trig-in-geometry`, and `/trigonometry/right-triangle-ratios`.
## 5. Files to Inspect Before Coding
`src/data/geometryConcepts.ts`; `src/pages/GeometryConceptPage.tsx`; `src/pages/TrigonometryConceptPage.tsx`; ratio-related visualizers.
## 6. Files Expected to Change
Existing geometry/trig concept UI, new ratio components, helper tests, and docs.
## 7. Components to Create or Refine
`RatioBarScene`, `DoubleNumberLineScene`, `ProportionSolverPanel`, `ScaleDrawingScene`, `UnitRateGraph`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Show invariant scale factor across bars, shapes, tables, and graphs.
## 10. Practice / Challenge Requirements
Add recipe, map, unit price, similar-shape, and false-proportion challenges.
## 11. Math Correctness Requirements
Handle units, zero denominators, negative rates where meaningful, and rounding.
## 12. Accessibility Requirements
Keyboard handles, text summaries, non-color markers, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use stacked visuals with readable line labels.
## 14. Performance Requirements
Keep SVG scenes lightweight during drag.
## 15. Testing Requirements
Test ratio helpers, route loading, edge cases, and build.
## 16. Route Verification Checklist
Verify listed geometry/trigonometry routes and nav access.
## 17. Documentation Updates
Document extension points and proportional reasoning visuals.
## 18. Final Codex Completion Report Format
Report files, ratio cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing partial ratio coverage is extended without duplicate routes.

