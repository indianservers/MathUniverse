# Arithmetic Operations — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend calculator and solver surfaces with visual arithmetic learning scenes.

## 2. Current Status from Phase A
Partial.

## 3. Implementation Decision
Extend.

## 4. Target Routes
`/calculator`, `/magic-maths`, and `/problem-solver`.

## 5. Files to Inspect Before Coding
`src/pages/ScientificCalculator.tsx`; `src/components/calculator/*`; `src/pages/MagicMaths.tsx`; `src/problem-solver/expressionOperationSolver.ts`; `src/utils/calculator.ts`.

## 6. Files Expected to Change
Calculator page/components, arithmetic visual components, operation helpers, tests, and docs.

## 7. Components to Create or Refine
`ArithmeticBlocksScene`, `OperationNumberLine`, `ArrayMultiplicationScene`, `DivisionSharingScene`, `OrderOfOperationsTree`.

## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.

## 9. Visual Requirements
Each operation must show a concrete quantity model and a symbolic expression model.

## 10. Practice / Challenge Requirements
Add estimation, error repair, inverse operation, and precedence challenges.

## 11. Math Correctness Requirements
Handle division by zero, negative values, decimals, order of operations, and exact vs rounded results.

## 12. Accessibility Requirements
Keyboard controls, ARIA live results, non-color grouping, and reduced-motion support.

## 13. Mobile Responsiveness Requirements
Use thumb-sized controls and stacked panels.

## 14. Performance Requirements
Summarize large block counts and avoid slow animations.

## 15. Testing Requirements
Test helper math, calculator regression, edge cases, and build.

## 16. Route Verification Checklist
Verify `/calculator`, `/magic-maths`, `/problem-solver`, and nav links.

## 17. Documentation Updates
Update arithmetic planning notes and note preserved calculator behaviors.

## 18. Final Codex Completion Report Format
Report files changed, operation cases tested, routes verified, accessibility checks, limitations, and next steps.

## 19. Acceptance Criteria
The existing arithmetic surfaces are extended into visual learning tools without duplicating modules.

