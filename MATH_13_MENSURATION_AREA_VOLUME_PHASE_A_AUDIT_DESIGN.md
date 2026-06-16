# Mensuration / Area / Volume — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit mensuration coverage and design premium perimeter, area, surface area, volume, unit, net, and scaling visuals.
## 2. Current Status Classification
Existing — upgrade current module. Shapes and measurement geometry routes exist.
## 3. Existing Routes and Files Found
`/shapes`; `/geometry/area-perimeter`; `/geometry/mensuration-3d`; `/geometry/surface-area-volume`; `src/pages/ShapesExplorer.tsx`; `src/visualizations/geometry/Shape3DExplorer.tsx`; `src/data/geometryConcepts.ts`.
## 4. Existing Features Found
Shapes explorer, area/perimeter concept, 3D mensuration, surface-area/volume concept, and geometry data.
## 5. Existing Weaknesses
Needs clearer separation of perimeter, area, surface area, volume, units, nets, and scale factor effects.
## 6. Upgrade/Create Decision
Upgrade existing shapes/geometry measurement modules.
## 7. Student Learning Goals
Distinguish boundary, covered surface, outside wrapping, filled space, and units.
## 8. Professor-Level Teaching Strategy
Use dimensional analysis, decomposition, nets, unit squares/cubes, and scaling laws.
## 9. Premium Interaction Design
Include click unit tiles, drag dimensions, snap net folds, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Perimeter trace, area tiling, decomposition, net unfolding, solid volume fill, surface wrapping, and scaling comparison.
## 11. Practice and Challenge Ideas
Estimate area, select formula, build a net, compare same perimeter/different area, and fix unit errors.
## 12. Beginner Mode
Use rectangles, triangles, cuboids, and visible unit squares/cubes.
## 13. Professor Mode
Show derivations, composite shapes, dimensional analysis, and scale factor `k`.
## 14. Accessibility Requirements
Keyboard dimension controls, text descriptions of filled units, non-color units, and reduced motion.
## 15. Mobile Requirements
Simple stacked scenes and optional 2D fallback for complex solids.
## 16. Math Safety Requirements
Prevent negative dimensions, label units, separate exact/rounded values, and handle zero dimensions.
## 17. Component Recommendations
Refine shapes/3D explorer and add `AreaTilingScene`, `PerimeterTraceScene`, `SolidVolumeScene`, `NetUnfoldScene`, and `UnitConversionPanel`.
## 18. Testing Plan
Test zero/positive dimensions, unit changes, composite shapes, scaling, surface area, and volume.
## 19. Risks and Things Not to Touch
Do not break `/shapes`, geometry concept IDs, or 3D explorer behavior.
## 20. Phase B Implementation Strategy
Upgrade existing measurement routes with unit-based scenes and reuse geometry utilities.
## 21. Acceptance Criteria for Phase A
Mensuration is classified as existing with an upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing mensuration routes with tiling, tracing, nets, volume fill, check/submit, hints, and tests.

