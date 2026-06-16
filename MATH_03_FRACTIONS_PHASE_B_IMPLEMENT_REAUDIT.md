# Fractions — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend existing number-system/NCERT fraction coverage into an interactive fraction lab.
## 2. Current Status from Phase A
Partial.
## 3. Implementation Decision
Extend.
## 4. Target Routes
`/number-systems`, `/ncert/class-7-fractions-decimals`, and `/ncert/class-7-rational-numbers`.
## 5. Files to Inspect Before Coding
`src/pages/NumberSystems.tsx`; `src/data/syllabus.ts`; `src/components/layout/navItems.ts`; `src/pages/NCERTConceptPage.tsx`; shared UI components.
## 6. Files Expected to Change
Number-system or NCERT concept UI, new fraction components, helper tests, and docs.
## 7. Components to Create or Refine
`FractionStripScene`, `FractionAreaScene`, `RationalNumberLine`, `EquivalentFractionsPanel`, `FractionOperationBuilder`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Every fraction value should appear as part-whole, line position, and symbol.
## 10. Practice / Challenge Requirements
Add build, simplify, compare, operate, and misconception checks.
## 11. Math Correctness Requirements
Prevent denominator zero and handle equivalence, simplification, improper fractions, and mixed numbers.
## 12. Accessibility Requirements
Keyboard controls, text summaries, non-color patterns, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use tabbed models and large partition controls.
## 14. Performance Requirements
Cap rendered partitions and summarize large denominators.
## 15. Testing Requirements
Test fraction helpers, route load, edge cases, and build.
## 16. Route Verification Checklist
Verify `/number-systems`, NCERT fraction/rational routes, and nav search.
## 17. Documentation Updates
Document supported fraction models and edge cases.
## 18. Final Codex Completion Report Format
Report files, fraction cases, route checks, accessibility, limitations, and next steps.
## 19. Acceptance Criteria
Existing fraction coverage is extended into a visual lab without duplicate modules.

