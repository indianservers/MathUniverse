# Target 0138 Current Audit

## Lesson

- Lesson ID: 46
- Title: Data Plotter
- Route: `/lessons/graphs-and-functions/46-data-plotter`
- Target: `0138-interactive-foundational-advanced-2d-graphing-calculator-data-plotter-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated data workspace | `DataPlotterTargetLesson46` replaces the generic graph renderer | Adapter regression test |
| Editable dataset | Ten target rows support bounded x/y editing, row deletion, and adding new rows | Model and component inspection |
| Real graph interaction | Every observation supports pointer dragging and keyboard movement | Pointer conversion test and component inspection |
| Outlier detection | Leave-one-out residual analysis identifies the target row dynamically | Model tests |
| Regression models | Linear and quadratic least-squares fits are real calculations; none disables the fit | Model tests |
| Chart modes | Scatter, line, and bar controls render distinct SVG geometry | Component inspection |
| Correlation | Pearson correlation is recalculated from the currently included observations | Model test |
| Residual plot | Residual stems and points derive from the active regression and current data | Model and component inspection |
| Outlier switch | Controls whether detected outliers participate in regression and correlation | Component inspection |
| Lesson actions | Workspace, reset, share, previous, and next controls are wired | Component inspection |

## Verification Run

- `dataPlotterLesson46Model.test.ts`: passed
- `DataPlotterTargetLesson46.test.tsx`: passed
- focused lesson 46 adapter route test: passed
- ESLint on lesson 46 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the dataset, chart, residual panel, and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

