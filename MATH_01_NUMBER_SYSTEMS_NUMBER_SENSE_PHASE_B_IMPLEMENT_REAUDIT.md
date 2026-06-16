# Number Sense / Counting Blocks / Place Value — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend `/number-systems` into a premium number sense lab without duplicating the module.

## 2. Current Status from Phase A
Partial.

## 3. Implementation Decision
Extend.

## 4. Target Routes
`/number-systems` and existing linked NCERT number routes.

## 5. Files to Inspect Before Coding
`src/pages/NumberSystems.tsx`; `src/data/syllabus.ts`; `src/components/layout/navItems.ts`; `src/visual-proofs/proofs/number-theory/*`; `src/hooks/useProgress.ts`.

## 6. Files Expected to Change
Number systems page, new number-sense components, helper tests, and documentation.

## 7. Components to Create or Refine
`PlaceValueBlockScene`, `NumberLineZoomScene`, `FactorTreeScene`, `NumberSetMap`, `DecimalExpansionStrip`.

## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof links, check/submit, instant correction, and progressive hints.

## 9. Visual Requirements
Concrete blocks must link to numeric notation, expanded form, and number-line position.

## 10. Practice / Challenge Requirements
Add build, classify, compare, factor, and misconception-repair cards.

## 11. Math Correctness Requirements
Handle zero, negatives, exact/approximate values, HCF/LCM, repeated decimals, and irrational estimates.

## 12. Accessibility Requirements
Keyboard controls, ARIA summaries, non-color grouping, visible focus, and reduced-motion support.

## 13. Mobile Responsiveness Requirements
Use stacked panels and large touch targets.

## 14. Performance Requirements
Cap rendered blocks and summarize large values.

## 15. Testing Requirements
Add helper tests and run build after implementation.

## 16. Route Verification Checklist
Verify `/number-systems`, linked NCERT number routes, nav search, and progress persistence.

## 17. Documentation Updates
Update roadmap and concept notes with implemented scenes and edge cases.

## 18. Final Codex Completion Report Format
Report files changed, scenes added, math cases tested, routes verified, accessibility checks, limitations, and next steps.

## 19. Acceptance Criteria
The existing number-systems module is extended into a visual number sense lab without route duplication.

