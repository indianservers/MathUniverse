# Target 0141 Current Audit

## Lesson

- Lesson ID: 49
- Title: Zoom and Pan
- Route: `/lessons/graphs-and-functions/49-zoom-and-pan`
- Target: `0141-interactive-foundational-advanced-2d-graphing-calculator-zoom-and-pan-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated viewport workspace | `ZoomPanTargetLesson49` replaces the generic graph renderer | Adapter regression test |
| Constant function model | All panes render `f(x) = 0.25x³ − x` from one evaluator | Model geometry test |
| Current viewport | Independent center, width, and height start at x `[-2, 2]`, y `[-1, 1]` | Model test |
| Real zoom | Zoom in/out changes viewport width and height with bounded scale limits | Model test and component inspection |
| Real two-axis pan | Main arrows and control-column arrows change the bounded viewport center | Model tests |
| Direct viewport manipulation | Purple rectangle supports pointer dragging and keyboard movement | Model conversion test and component inspection |
| Synchronized panes | Full graph, zoomed region, and overview project the same function and viewport | Model and surface tests |
| Viewport readouts | x/y ranges are derived from current center and dimensions | Component inspection |
| Reset | Restores the exact target viewport rather than changing the equation | Model and component inspection |
| Lesson navigation | Previous and next controls are wired | Component inspection |

## Verification Run

- `zoomPanLesson49Model.test.ts`: passed
- `ZoomPanTargetLesson49.test.tsx`: passed
- focused lesson 49 adapter route test: passed
- ESLint on lesson 49 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the three-pane hierarchy, viewport rectangle, and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

