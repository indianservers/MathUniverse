# Target 0149 Current Audit

## Lesson

- Lesson ID: 92
- Title: Algebra Tiles
- Route: `/lessons/algebra/92-algebra-tiles`
- Target: `0149-interactive-intermediate-expressions-and-manipulation-algebra-tiles-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated algebra-tile workspace | `AlgebraTilesTargetLesson92` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated object model | Problems, coefficients, expressions, tile edits, and numerical evaluation use `algebraTilesLesson92Model` | Model tests |
| Real tile bank | Clicking or dragging positive/negative variable, unit, and square tiles changes the expression | Model tests and component inspection |
| Combine workspace | Before and after regions derive from the same current tile inventory | Surface test |
| Zero pairs | Variable and unit zero pairs can be added and cleared without changing expression value | Component inspection |
| New problems | New Problem cycles through separate modeled tile inventories | Component inspection |
| Area model | The `(x+2)(x+3)` area model and calculation toggle remain functional | Adapter test and component inspection |
| Symbolic trace | Start, grouped coefficients, and simplified result derive from current tiles | Surface test |
| Functional lesson tabs | Explain, Examples, Formulas, and Know more render distinct model-derived content | Component inspection |
| Real validation | The displayed expression and evaluation at `x=2` derive from the tile coefficients | Model and surface tests |

## Mathematical Correction

The target image reports one `x²` tile while its active expression is `2x + 3x - 1`, which contains no `x²` term. The live count now reports zero until a square tile is actually added. This intentionally favors the requested real object model over reproducing an inconsistent counter.

## Verification Run

- `algebraTilesLesson92Model.test.ts`: passed
- `AlgebraTilesTargetLesson92.test.tsx`: passed
- focused lesson 92 adapter route test: passed
- ESLint on lesson 92 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the tile builder, bank, counters, checklist, area model, symbolic trace, tabs, and validation rail. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
