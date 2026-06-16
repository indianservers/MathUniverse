# Circles — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit circle coverage and design premium radius, diameter, circumference, area, arcs, sectors, chords, secants, and tangents visuals.
## 2. Current Status Classification
Existing — upgrade current module. Circle routes, explorer, and visual proofs exist.
## 3. Existing Routes and Files Found
`/geometry/circles`; `/geometry/arcs-sectors`; `/geometry/chords-secants`; `/geometry/tangents`; `src/visualizations/geometry/CircleExplorer.tsx`; `src/visual-proofs/proofs/geometry/CircleCircumferenceUnwrappingProof.tsx`; `src/visual-proofs/proofs/CircleAreaUnrollingProof.tsx`.
## 4. Existing Features Found
Circle geometry concepts, circle explorer, circumference/area proofs, sectors, tangents, and chord/secant concept entries.
## 5. Existing Weaknesses
Needs stronger unwrapping, rearrangement, chord/secant, tangent-radius, and theorem-check interactions.
## 6. Upgrade/Create Decision
Upgrade existing circle geometry and visual proof coverage.
## 7. Student Learning Goals
Identify circle parts and understand circumference, area, sectors, tangents, chords, and secants.
## 8. Professor-Level Teaching Strategy
Use unwrapping, sector rearrangement, proportional angle fractions, and tangent perpendicularity.
## 9. Premium Interaction Design
Include click labels, drag radius/chord/tangent points, snap to special sectors, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Circle part diagram, circumference unwrap, area rearrangement, sector meter, chord/secant scene, and tangent-radius scene.
## 11. Practice and Challenge Ideas
Label parts, calculate sector area, predict tangent angle, compare chords, and repair radius/diameter confusion.
## 12. Beginner Mode
Use wheel/string metaphors and simple angles.
## 13. Professor Mode
Show radians, arc length derivation, theorem proof hints, and exact notation.
## 14. Accessibility Requirements
Keyboard point movement, text theorem summaries, non-color markers, and reduced motion.
## 15. Mobile Requirements
Large circle scenes with formula panels below.
## 16. Math Safety Requirements
Handle zero radius, invalid angles, tangent degeneracy, and degree/radian labels.
## 17. Component Recommendations
Refine `CircleExplorer` and add `CirclePartsScene`, `CircumferenceUnwrapScene`, `CircleAreaRearrangement`, `ChordSecantScene`, and `TangentRadiusScene`.
## 18. Testing Plan
Test radius, sector angle, chord offset, tangent contact, zero radius, and exact/decimal values.
## 19. Risks and Things Not to Touch
Do not break circle concept IDs, geometry route, or circle proof pages.
## 20. Phase B Implementation Strategy
Upgrade existing circle concepts and reuse visual proof assets for formula understanding.
## 21. Acceptance Criteria for Phase A
Circles are classified as existing with a clear upgrade-only strategy.
## 22. Suggested Codex Prompt for Phase B
Upgrade existing circle routes with unwrapping, area rearrangement, chord/secant, tangent-radius, checks, hints, and tests.

