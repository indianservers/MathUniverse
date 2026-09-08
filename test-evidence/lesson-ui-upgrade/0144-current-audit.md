# Target 0144 Current Audit

## Lesson

- Lesson ID: 52
- Title: Multiple Graphics Views
- Route: `/lessons/graphs-and-functions/52-multiple-graphics-views`
- Target: `0144-interactive-foundational-advanced-2d-graphing-calculator-multiple-graphics-views-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated four-view workspace | `MultipleGraphicsViewsTargetLesson52` replaces the generic graph renderer | Adapter regression test |
| Shared function object | Algebra, graph, table, and detail views derive from `f(x) = sin(x) + 0.25x` | Model and surface tests |
| Algebra representation | Formula, selected x, and evaluated output update from the live cursor | Surface test and component inspection |
| Full graph representation | The generated curve has a draggable, keyboard-accessible vertical cursor and coordinate readout | Model mapping test and component inspection |
| Table representation | Rows use computed function values and selecting a row moves the live cursor | Model and component inspection |
| Detail representation | A local viewport is recalculated around the selected point with horizontal and vertical guides | Model tests |
| Cursor synchronization | Sync mode updates all four representations; disabling it preserves independent view cursors | Component inspection |
| Real layout controls | 1x1, 2x2, split, and stack modes change the rendered workspace layout | Surface test and component inspection |
| Pane controls | Each ellipsis action hides its view and the restore controls return hidden views | Component inspection |
| Selected x input | Numeric view edits are clamped to the supported domain and recompute `f(x)` | Model tests |
| Lesson actions | Language, reset, share, workspace, previous, and next controls are wired | Component inspection |

## Verification Run

- `multipleViewsLesson52Model.test.ts`: passed
- `MultipleGraphicsViewsTargetLesson52.test.tsx`: passed
- focused lesson 52 adapter route test: passed
- ESLint on lesson 52 files: passed with zero warnings
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the four-pane composition, synchronized representations, control rail, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
