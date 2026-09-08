# Target 0132 Current Audit

## Lesson

- Lesson ID: 40
- Title: Function Plotter
- Route: `/lessons/graphs-and-functions/40-function-plotter`
- Target: `0132-interactive-foundational-advanced-2d-graphing-calculator-function-plotter-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Independent function workspace | Dedicated `FunctionPlotterTargetLesson40` route replaces the generic 2D lesson surface | Adapter regression test |
| Three target functions | Editable f, g, and h definitions start at `x^2 - 2`, `0.8x + 1`, and `sin(x)` | Model and surface tests |
| Real expression behavior | Constrained parser evaluates supported quadratic, linear, trigonometric, identity, and constant expressions without dynamic code execution | Model tests |
| Linked graph | Every visible function generates its own SVG polyline from the current definition | Model geometry test and component inspection |
| Intersections | Pairwise intersections are numerically solved from current visible function definitions | Model tests |
| Function controls | Visibility, checkbox, expression editing, preset cycling, clipboard copy, and graph removal alter real state or perform the labeled action | Component inspection |
| Shared trace | Range and numeric controls update one trace value used by graph markers and output cards | Surface test and component inspection |
| Sample table | All values are calculated from the current definitions; the trace column is highlighted | Surface test and component inspection |
| Lesson navigation | Reset, fit, share, previous, and next controls are wired | Component inspection |

## Verification Run

- `functionPlotterLesson40Model.test.ts`: passed
- `FunctionPlotterTargetLesson40.test.tsx`: passed
- focused lesson 40 adapter route test: passed
- ESLint on lesson 40 and adapter files: passed
- targeted TypeScript error scan: passed
- `git diff --check`: passed; line-ending warnings only

## Acceptance Boundary

The target PNG was inspected and used to define the workspace hierarchy, functions, trace state, outputs, and table. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

