# Target 0146 Current Audit

## Lesson

- Lesson ID: 54
- Title: Graph Inspector
- Route: `/lessons/graphs-and-functions/54-graph-inspector`
- Target: `0146-interactive-foundational-advanced-2d-graphing-calculator-graph-inspector-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated inspector workspace | `GraphInspectorTargetLesson54` replaces the generic graph renderer | Adapter regression test |
| Selectable cubic | Function choices regenerate the curve and every fact panel value | Component inspection |
| Direct inspection probe | The selected point supports pointer dragging and keyboard movement | Model mapping test and component inspection |
| Local facts | Probe value, first derivative, and monotonic classification are live calculations | Model and surface tests |
| Global facts | Roots, intercept, extrema, domain, and range derive from the selected cubic | Model tests |
| Interval analysis | Critical points divide generated increasing and decreasing bands | Model and component inspection |
| Average rate | The secant rate on `[-1, 1]` is calculated from the function | Model test |
| Concavity | Second-derivative signs generate the two concavity intervals | Component inspection |
| View actions | Fit View, Reset, Share, previous, and next controls are wired | Component inspection |

## Mathematical Corrections

For `f(x) = x³ - 3x` at `x = 1.2`, the target mockup displays values that do not satisfy the equation. The implementation computes `f(1.2) = -1.872` and `f′(1.2) = 1.32`. The target also reverses the monotonicity intervals; the live surface correctly reports increasing on `(-∞, -1)` and `(1, ∞)`, and decreasing on `(-1, 1)`.

## Verification Run

- `graphInspectorLesson54Model.test.ts`: passed
- `GraphInspectorTargetLesson54.test.tsx`: passed
- focused lesson 54 adapter route test: passed
- ESLint on lesson 54 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the probe graph, interval shading, facts rail, toolbar, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
