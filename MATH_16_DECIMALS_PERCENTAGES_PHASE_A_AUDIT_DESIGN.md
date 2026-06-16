# Decimals and Percentages — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit decimal and percentage coverage and design conversion, place-value, percent, discount, tax, and interest visuals.
## 2. Current Status Classification
Partial — extend current module. Decimal and percentage topics exist in syllabus/navigation, but no complete premium module was found.
## 3. Existing Routes and Files Found
`/number-systems`; `/ncert/class-7-fractions-decimals`; `/ncert/class-7-comparing-quantities`; `src/data/syllabus.ts`; `src/data/unitUpgradePlan.ts`; `src/components/layout/navItems.ts`.
## 4. Existing Features Found
Fraction/decimal syllabus links, comparing quantities route reference, number-system route, and upgrade-plan references for percentage, tax, discount, and interest.
## 5. Existing Weaknesses
Decimal place value, percent bars, conversion, and real-world percentage scenarios need integrated visuals.
## 6. Upgrade/Create Decision
Extend current number-system/NCERT coverage and add missing interaction layers.
## 7. Student Learning Goals
Convert fractions, decimals, and percentages; compare values; and apply percentages to real scenarios.
## 8. Professor-Level Teaching Strategy
Connect decimal place value, denominator powers of ten, percent as per-hundred, and proportional reasoning.
## 9. Premium Interaction Design
Include click-to-fill hundred grids, drag decimal markers, snap to tenths/hundredths, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Decimal place-value chart, hundred grid, percent bar, conversion triangle, number line, and scenario cards.
## 11. Practice and Challenge Ideas
Convert forms, calculate discounts, repair rounding mistakes, compare percentages, and solve tax/interest stories.
## 12. Beginner Mode
Use tenths/hundredths, money, sale tags, and simple percent bars.
## 13. Professor Mode
Show repeating decimals, proportional equations, compound percent change, and exact/rounded distinctions.
## 14. Accessibility Requirements
Keyboard sliders, table equivalents, non-color fills, and reduced motion.
## 15. Mobile Requirements
Use compact grids, stacked scenario panels, and sticky conversion readout.
## 16. Math Safety Requirements
Mark rounded values, handle percentages over 100, negative percent change, and repeating decimals.
## 17. Component Recommendations
Create or refine `DecimalPlaceValueScene`, `HundredGridScene`, `PercentBarScene`, `ConversionPanel`, and `PercentScenarioCard`.
## 18. Testing Plan
Test conversions, rounding, repeating decimals, percent over 100, negative change, discount/tax/interest examples.
## 19. Risks and Things Not to Touch
Do not break NCERT routes, number-system route, or existing syllabus navigation.
## 20. Phase B Implementation Strategy
Extend existing decimal/percentage syllabus surfaces and reuse fraction/ratio helpers where possible.
## 21. Acceptance Criteria for Phase A
Decimals and percentages are classified as partial with exact files and an extension strategy.
## 22. Suggested Codex Prompt for Phase B
Extend existing decimal and percentage coverage with hundred-grid, percent-bar, conversion, and real-world scenario components plus tests.

