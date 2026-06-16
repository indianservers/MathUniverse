# Fractions — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit fraction coverage and design premium fraction learning for part-whole, number-line, equivalence, comparison, and operations.
## 2. Current Status Classification
Partial — extend current module. Fraction links exist through number systems and NCERT, but no standalone premium fraction lab was found.
## 3. Existing Routes and Files Found
`/number-systems`; `/ncert/class-7-fractions-decimals`; `/ncert/class-7-rational-numbers`; `src/pages/NumberSystems.tsx`; `src/data/syllabus.ts`; `src/components/layout/navItems.ts`.
## 4. Existing Features Found
Rational-number navigation, fraction/decimal syllabus topic, number-system route, and NCERT concept links.
## 5. Existing Weaknesses
Fraction strips, area models, equivalence, improper fractions, and operations need stronger direct manipulation.
## 6. Upgrade/Create Decision
Extend existing number-system/NCERT coverage; do not create a duplicate route unless Phase B proves no safe integration point.
## 7. Student Learning Goals
See fractions as parts, measures, quotients, ratios, and numbers on a line.
## 8. Professor-Level Teaching Strategy
Connect partitioning, unit fraction iteration, equivalence classes, and rational-number notation.
## 9. Premium Interaction Design
Include click-to-fill parts, drag fraction markers, snap to partitions, sliders for numerator/denominator, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Fraction strips, area circles/rectangles, number line, equivalence grid, operation model, and simplification panel.
## 11. Practice and Challenge Ideas
Build a fraction, simplify, compare, order, add like/unlike denominators, and repair misconception cards.
## 12. Beginner Mode
Use halves, thirds, fourths, and visual language before symbols.
## 13. Professor Mode
Show rational notation, GCD simplification, common denominator reasoning, and proof links.
## 14. Accessibility Requirements
Patterns beyond color, keyboard partition controls, text summaries, and reduced motion.
## 15. Mobile Requirements
Large partition targets and tabbed models for strip, area, and line.
## 16. Math Safety Requirements
Prevent denominator zero and label improper, mixed, simplified, and equivalent forms clearly.
## 17. Component Recommendations
Create or refine `FractionStripScene`, `FractionAreaScene`, `RationalNumberLine`, `EquivalentFractionsPanel`, and `FractionOperationBuilder`.
## 18. Testing Plan
Test zero numerator, denominator zero prevention, improper fractions, simplification, comparison, and unlike-denominator operations.
## 19. Risks and Things Not to Touch
Do not break `/number-systems`, NCERT links, or rational-number navigation.
## 20. Phase B Implementation Strategy
Add a fraction lab to the safest existing number-system/NCERT surface and reuse shared math display components.
## 21. Acceptance Criteria for Phase A
Fractions are classified as partial and have an extension strategy grounded in found files.
## 22. Suggested Codex Prompt for Phase B
Extend the existing number-system/NCERT fraction coverage with interactive fraction strips, area models, number lines, checks, and tests.

