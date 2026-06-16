# Decimals and Percentages — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend existing decimal/percentage coverage into a premium conversion and real-world quantity lab.
## 2. Current Status from Phase A
Partial.
## 3. Implementation Decision
Extend.
## 4. Target Routes
`/number-systems`, `/ncert/class-7-fractions-decimals`, and `/ncert/class-7-comparing-quantities`.
## 5. Files to Inspect Before Coding
`src/pages/NumberSystems.tsx`; `src/data/syllabus.ts`; `src/data/unitUpgradePlan.ts`; `src/pages/NCERTConceptPage.tsx`; shared UI components.
## 6. Files Expected to Change
Number-system/NCERT UI, decimal/percent components, helper tests, and docs.
## 7. Components to Create or Refine
`DecimalPlaceValueScene`, `HundredGridScene`, `PercentBarScene`, `ConversionPanel`, `PercentScenarioCard`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Show decimal, fraction, percent, number-line, and scenario views together.
## 10. Practice / Challenge Requirements
Add conversion, discount, tax, interest, rounding, and misconception tasks.
## 11. Math Correctness Requirements
Handle rounded values, repeating decimals, percentages over 100, and negative percentage change.
## 12. Accessibility Requirements
Keyboard controls, chart/table equivalents, non-color fills, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use stacked panels and large grid controls.
## 14. Performance Requirements
Avoid rendering excessive grid cells; summarize where necessary.
## 15. Testing Requirements
Test conversion helpers, routes, edge cases, and build.
## 16. Route Verification Checklist
Verify `/number-systems`, NCERT decimal/percentage routes, and nav search.
## 17. Documentation Updates
Document conversion behavior and rounding policy.
## 18. Final Codex Completion Report Format
Report files, decimal/percent cases, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Existing decimal and percentage coverage is extended without creating duplicate modules.

