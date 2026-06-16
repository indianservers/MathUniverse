# Ratios and Proportions — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit ratio/proportion coverage and design scale, unit-rate, double-number-line, similar-shape, and proportion-solving visuals.
## 2. Current Status Classification
Partial — extend current module. Ratio ideas exist in geometry/trigonometry, but no complete ratio/proportion module was found.
## 3. Existing Routes and Files Found
`/geometry/similar-triangles`; `/geometry/trig-in-geometry`; `/trigonometry/right-triangle-ratios`; `src/data/geometryConcepts.ts`; `src/pages/TrigonometryConceptPage.tsx`.
## 4. Existing Features Found
Similar triangles, trig ratios, right-triangle ratio route, geometry tasks, and proportional side comparisons.
## 5. Existing Weaknesses
General ratio, unit rate, double number lines, missing-value proportions, and real-world scaling need a focused layer.
## 6. Upgrade/Create Decision
Extend current geometry/trigonometry pieces instead of creating a duplicate isolated module.
## 7. Student Learning Goals
Compare ratios, find unit rates, solve proportions, identify proportional relationships, and detect non-proportional cases.
## 8. Professor-Level Teaching Strategy
Connect multiplicative comparison, invariant scale factor, similar triangles, slope, and cross products.
## 9. Premium Interaction Design
Include click-to-select quantities, drag scale handles, snap equivalent ratios, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Ratio bars, double number line, scale drawing, similar triangles, unit-rate table, and proportional graph.
## 11. Practice and Challenge Ideas
Scale recipes, map distances, compare prices, solve missing values, and break a false proportion.
## 12. Beginner Mode
Use recipes, speed, price, and map examples.
## 13. Professor Mode
Show `a/b = c/d`, cross products, slope as rate, and similarity proof.
## 14. Accessibility Requirements
Keyboard handles, text ratio summaries, non-color paired markers, and reduced motion.
## 15. Mobile Requirements
Stack number lines and keep live-value cards sticky.
## 16. Math Safety Requirements
Reject zero denominators, preserve units, and label rounded rates.
## 17. Component Recommendations
Create or refine `RatioBarScene`, `DoubleNumberLineScene`, `ProportionSolverPanel`, `ScaleDrawingScene`, and `UnitRateGraph`.
## 18. Testing Plan
Test equivalent ratios, zero cases, unit conversion, non-proportional examples, and rounding.
## 19. Risks and Things Not to Touch
Do not break geometry concept IDs or trigonometry right-triangle visualizers.
## 20. Phase B Implementation Strategy
Add proportion scenes into existing geometry/trigonometry anchors and reuse shared controls.
## 21. Acceptance Criteria for Phase A
Ratios are classified as partial and have a safe extension path.
## 22. Suggested Codex Prompt for Phase B
Extend existing geometry/trigonometry ratio coverage with ratio bars, double number lines, unit-rate graphing, checks, and tests.

