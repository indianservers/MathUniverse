# Target 0134 Current Audit

## Lesson

- Lesson ID: 42
- Title: Inequality Grapher
- Route: `/lessons/graphs-and-functions/42-inequality-grapher`
- Target: `0134-interactive-foundational-advanced-2d-graphing-calculator-inequality-grapher-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated inequality workspace | `InequalityGrapherTargetLesson42` replaces the generic graph renderer | Adapter regression test |
| Two linear inequalities | Each rule owns slope, intercept, inclusion state, shade direction, color, and generated notation | Model tests |
| Real shaded regions | SVG polygons are generated from current boundaries; the overlap uses clipped region geometry | Model and component inspection |
| Boundary controls | Solid/dashed controls change inclusive/strict comparison and line rendering | Component inspection |
| Shade controls | Below, no-shade, and above modes change both the displayed region and truth test | Model and component inspection |
| Point tester | Pointer drag, arrow keys, and numeric x/y inputs update a snapped test point | Model conversion test and component inspection |
| Live truth cards | LHS, RHS, per-rule verdicts, and system result are derived from the same current rules and point | Model and surface tests |
| Lesson actions | Reset, share, fit, fullscreen, previous, and next actions are wired | Component inspection |

## Mockup Correction

The target calls `A(1, 2)` a solution to `y ≤ 0.8x + 1`, but `2 ≤ 1.8` is false. Its plotted marker is also closer to `x = 2`. The implementation uses the consistent point `A(2, 2)`, for which `2 ≤ 2.6` and `2 > 1` are both true. This keeps the displayed point, graph position, calculations, and overlap verdict synchronized as required by the no-dummy-controls rule.

## Verification Run

- `inequalityGrapherLesson42Model.test.ts`: passed
- `InequalityGrapherTargetLesson42.test.tsx`: passed
- focused lesson 42 adapter route test: passed
- ESLint on lesson 42 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the surface hierarchy and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

