# Lesson 0883: Transportation-Style LPP Introduction

Status: completed for the current one-by-one pass; browser and visual acceptance recorded below.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0883-school-class-12-linear-programming-transportation-style-lpp-introduction-redesigned.png`.
Catalog ID: 10209. Route: `/lessons/school/class-12/class-12-linear-programming-transportation-style-lpp-introduction`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / intentional difference |
| --- | --- | --- |
| Balance summary | Fixed supply/demand balance plus independently computed allocation feasibility | Correctly distinguishes balanced problem from feasible allocation |
| Shipment map | Four source/destination routes, costs and live chips; positive/zero styling | Uses Lucide factory/warehouse icons; exact route curvature, arrows and decorative icon fidelity remain pending |
| Drag / Steppers modes | Drag mode activates horizontal chip dragging and keyboard arrows/Home/End; Steppers disables map editing while preserving table controls | Browser pointer/keyboard behavior not executed in this pass |
| Shipment table | Four independent numeric inputs and +/- controls, live row/column totals and progress meters | Over/under-allocation is highlighted, not silently rebalanced |
| Allocation status | Validates nonnegative shipments and all four row/column equalities | Precise typography and panel placement deferred |
| Mathematical model | Both supply equations, both demand equations, nonnegativity and cost objective | Reference symbols retained |
| Cost summary | Computed four-route breakdown and total | Default [25,5,0,20] costs 190; exact visual sizing deferred |
| Feasible family | t in [5,25] updates all four shipments; explicit reapply action after independent edits | Corrected x22 = t - 5, not target's x22 = t. Correct cost expansion includes 3(t - 5), yielding C(t) = 290 - 4t |
| Common mistake | Separate row-only example [20,10,0,20] and correct example [20,10,5,15] | Replaced inconsistent reference miniature tables with actual row/column arithmetic |
| Practice | Yes/No, Check Answer, collapsible explanation and calculated cost 210 | Starts unanswered; feedback is not a preselected screenshot |
| Navigation / reset / info | All section tabs scroll, reset restores initial state, cost info expands, previous lesson route verified | App shell/footer and exact responsive visual match remain unverified |

## Verification

- Seven focused Vitest model and initial-markup tests pass.
- Feasible-family constraints and cost verified at 81 quarter-unit parameter values.
- Minimum 190 independently verified over all integer row-balanced candidates within the two source supplies.
- Tests cover row-only and column-only invalid allocations, nonnegativity, input bounds and practice cost.
- Focused strict TypeScript and ESLint checks pass.
- The earlier surface-only status is superseded by the one-by-one browser pass below.

Next sequential catalog lesson: 0884 / 10210 Conditional Probability. Aggregate completion counts have not been re-audited here.

## One-by-one acceptance — 2026-09-08

- Desktop route rendered at 1024 × 1536 and captured at `artifacts/studio-control-audit/0883-current.png`.
- Reference comparison confirms the ordered composition: route tabs, balance summary, transportation map, shipment table, mathematical model, cost summary, feasible family, common-mistake comparison, practice and footer navigation.
- Live validation passed for shipment keyboard editing, Drag/Steppers mode, table edits, feasible-family updates, explanation reveal and practice grading.
- Scoped SVG sizing keeps factory, warehouse, status and action icons proportional under the shared stylesheet.
