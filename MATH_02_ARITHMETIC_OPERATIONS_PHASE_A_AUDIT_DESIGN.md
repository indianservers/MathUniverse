# Arithmetic Operations — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit arithmetic-related routes and design visual operation learning for addition, subtraction, multiplication, division, estimation, and order of operations.

## 2. Current Status Classification
Partial — extend current module. Calculator, magic maths, and solver pieces exist, but a dedicated arithmetic learning module was not found.

## 3. Existing Routes and Files Found
`/calculator`; `/magic-maths`; `/problem-solver`; `src/pages/ScientificCalculator.tsx`; `src/pages/MagicMaths.tsx`; `src/components/calculator/*`; `src/utils/calculator.ts`; `src/problem-solver/expressionOperationSolver.ts`.

## 4. Existing Features Found
Scientific calculator, keypad, display, history, operation solver, and magic math experiences.

## 5. Existing Weaknesses
Operations are useful but not yet taught through regrouping, arrays, sharing, inverse operations, and estimation visuals.

## 6. Upgrade/Create Decision
Extend partial module using calculator and solver anchors; do not create a separate duplicate calculator.

## 7. Student Learning Goals
Understand operations as combining, comparing, grouping, sharing, repeated addition, and inverse relationships.

## 8. Professor-Level Teaching Strategy
Connect algorithms to place value, inverse operations, distributive property, and expression trees.

## 9. Premium Interaction Design
Include click-to-build quantities, drag/regroup, snap to columns, sliders for operands, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.

## 10. Visual Models Required
Base-ten blocks, number-line jumps, multiplication arrays, division trays, operation balance, and expression tree.

## 11. Practice and Challenge Ideas
Estimate first, repair a carry error, match inverse operations, build arrays, and choose correct precedence.

## 12. Beginner Mode
Use small whole numbers and concrete manipulatives.

## 13. Professor Mode
Show properties, precedence trees, modular checks, and algorithm invariants.

## 14. Accessibility Requirements
Keyboard keypad, live result announcements, text labels for grouped blocks, and reduced motion.

## 15. Mobile Requirements
Large keypad, stacked visual panels, and sticky result summary.

## 16. Math Safety Requirements
Handle zero, negatives, decimals, division by zero, and rounding.

## 17. Component Recommendations
Create or refine `ArithmeticBlocksScene`, `OperationNumberLine`, `ArrayMultiplicationScene`, `DivisionSharingScene`, and `OrderOfOperationsTree`.

## 18. Testing Plan
Test carrying, borrowing, multiplication arrays, division remainders, precedence, negatives, decimals, and division by zero.

## 19. Risks and Things Not to Touch
Do not regress calculator keyboard input, history, solver behavior, or magic maths modules.

## 20. Phase B Implementation Strategy
Add arithmetic teaching panels around existing calculator/solver surfaces and reuse existing calculator helpers.

## 21. Acceptance Criteria for Phase A
The plan classifies arithmetic as partial and defines extension, not duplication.

## 22. Suggested Codex Prompt for Phase B
Extend the existing calculator/problem-solver arithmetic experience with visual operation scenes, preserving current calculator behavior and adding tests.

