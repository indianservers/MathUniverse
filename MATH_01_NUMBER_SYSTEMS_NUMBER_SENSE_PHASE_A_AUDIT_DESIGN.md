# Number Sense / Counting Blocks / Place Value — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit and design a premium number sense experience for counting blocks, place value, number classification, factorization, and real-line intuition.

## 2. Current Status Classification
Partial — extend current module. `/number-systems` exists, but dedicated counting-block and place-value interactions were not found as standalone premium scenes.

## 3. Existing Routes and Files Found
`/number-systems`; `src/pages/NumberSystems.tsx`; `src/data/topics.ts`; `src/data/syllabus.ts`; `src/components/layout/navItems.ts`; `src/visual-proofs/proofs/number-theory/*`; `src/hooks/useProgress.ts`.

## 4. Existing Features Found
Number systems topic, rational/irrational navigation, NCERT links, number-theory visual proofs, progress storage, and syllabus references.

## 5. Existing Weaknesses
Concrete counting blocks, place-value regrouping, decimal zoom, and set hierarchy need a unified beginner-friendly interaction layer.

## 6. Upgrade/Create Decision
Extend partial module; do not create a duplicate number-system route.

## 7. Student Learning Goals
Build numbers, read place value, classify numbers, compare magnitudes, and connect factors/prime structure to the real line.

## 8. Professor-Level Teaching Strategy
Move from manipulatives to number line to symbolic sets and proofs.

## 9. Premium Interaction Design
Include click to add blocks, drag to regroup, snap to place columns, sliders for value size, live values, formula builders for expanded form, visual proof links, check/submit, instant correction, and progressive hints.

## 10. Visual Models Required
Base-ten blocks, place-value chart, zoomable number line, set hierarchy, factor tree, prime grid, decimal expansion strip.

## 11. Practice and Challenge Ideas
Build a number, classify it, find HCF/LCM, place square-root estimates, repair wrong place value, and compare decimals.

## 12. Beginner Mode
Use whole numbers, large blocks, spoken labels, and minimal notation.

## 13. Professor Mode
Show set notation, Euclid algorithm, rational decimal rules, and proof links.

## 14. Accessibility Requirements
Keyboard block movement, ARIA summaries, non-color grouping, visible focus, and reduced motion.

## 15. Mobile Requirements
Stack blocks, chart, and explanation; keep drag targets large.

## 16. Math Safety Requirements
Avoid rounding ambiguity; mark approximate values; handle zero, negatives, and repeating decimals.

## 17. Component Recommendations
Create or refine `PlaceValueBlockScene`, `NumberLineZoomScene`, `FactorTreeScene`, `NumberSetMap`, and `DecimalExpansionStrip`.

## 18. Testing Plan
Test zero, negatives, primes, composites, HCF, LCM, terminating decimals, repeating decimals, and irrational estimates.

## 19. Risks and Things Not to Touch
Do not break `/number-systems`, NCERT links, number-theory proofs, nav search terms, or local progress.

## 20. Phase B Implementation Strategy
Integrate new scenes into the existing number systems route and reuse visual proof links for factorization and irrationality.

## 21. Acceptance Criteria for Phase A
Status, existing files, extension decision, visual models, interactions, and tests are clearly defined.

## 22. Suggested Codex Prompt for Phase B
Implement the Number Sense premium extension in `/number-systems`, preserving all existing routes and adding block, place-value, number-line, and factor scenes with tests.

