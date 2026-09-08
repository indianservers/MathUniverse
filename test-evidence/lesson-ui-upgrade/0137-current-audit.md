# Target 0137 Current Audit

## Lesson

- Lesson ID: 45
- Title: Point Plotter
- Route: `/lessons/graphs-and-functions/45-point-plotter`
- Target: `0137-interactive-foundational-advanced-2d-graphing-calculator-point-plotter-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated point workspace | `PointPlotterTargetLesson45` replaces the generic graph renderer | Adapter regression test |
| Five target points | A through E own editable coordinates and colors in a collection model | Model and surface tests |
| Real graph interaction | Every point supports pointer dragging, keyboard movement, and selection | Model conversion test and component inspection |
| Coordinate table | Numeric x/y inputs update the same point objects shown on the graph | Component inspection |
| Row ordering | Native row dragging reorders the collection and optional connecting path | Model reorder test |
| Color controls | Palette buttons assign the selected point's real color | Component inspection |
| Add point | Creates the next named point, selects it, and assigns a palette color | Component inspection |
| Exact plotting guidance | Selected-point x-first and y-second guides and examples derive from live coordinates | Surface test and component inspection |
| Graph options | Snap-to-grid and optional point connection controls alter model behavior and rendering | Model and component inspection |
| Lesson actions | Language, reset, share, previous, and next controls are wired | Component inspection |

## Verification Run

- `pointPlotterLesson45Model.test.ts`: passed
- `PointPlotterTargetLesson45.test.tsx`: passed
- focused lesson 45 adapter route test: passed
- ESLint on lesson 45 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the surface hierarchy, point set, and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

