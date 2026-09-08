# Target 0139 Current Audit

## Lesson

- Lesson ID: 47
- Title: Table of Values
- Route: `/lessons/graphs-and-functions/47-table-of-values`
- Target: `0139-interactive-foundational-advanced-2d-graphing-calculator-table-of-values-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated table workspace | `TableValuesTargetLesson47` replaces the generic graph renderer | Adapter regression test |
| Editable function | Target quadratic syntax is parsed into real coefficients; invalid input is surfaced | Model tests and component inspection |
| Generated table | Seven x rows and all f(x) values derive from the active function and step | Model and surface tests |
| Differences | First differences and constant/nonconstant second differences are calculated from current rows | Model tests |
| Row-to-point mapping | Selecting a table row highlights the matching graph point and callout | Surface test |
| Real graph interaction | Selected point supports horizontal pointer drag and keyboard stepping; y is recalculated from f(x) | Model and component inspection |
| Step controls | Increment/decrement regenerates the x sequence and dependent outputs | Component inspection |
| Display controls | Points and function curve toggles independently control graph layers | Component inspection |
| View controls | Zoom fit computes bounds from current rows; reset restores the target viewport | Model test and component inspection |
| Lesson actions | Language, reset, share, workspace, previous, and next controls are wired | Component inspection |

## Verification Run

- `tableValuesLesson47Model.test.ts`: passed
- `TableValuesTargetLesson47.test.tsx`: passed
- focused lesson 47 adapter route test: passed
- ESLint on lesson 47 and adapter files: passed with zero warnings
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the table, graph, controls, and explanation flow. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

