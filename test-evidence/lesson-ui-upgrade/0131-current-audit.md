# Target 0131 Current Audit

## Lesson

- Lesson ID: 39
- Title: Cartesian Graphing
- Route: `/lessons/graphs-and-functions/39-cartesian-graphing`
- Target: `0131-interactive-foundational-advanced-2d-graphing-calculator-cartesian-graphing-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Cartesian ordered-pair workspace | Dedicated `CartesianGraphingTargetLesson39` route, outside the generic 2D renderer | Adapter regression test |
| Point P starts at `(2, 3)` | Extracted model owns the default point and ordered-pair output | Model and surface tests |
| Read x first, then y | Horizontal and vertical graph paths, labels, steps, and order summary derive from live coordinates | Surface test and static markup inspection |
| Real graph interaction | Pointer drag maps pixels to snapped coordinates; arrow keys move by `0.5` | Model conversion tests and interaction handlers |
| Coordinate controls | Sliders, numeric inputs, and decrement/increment buttons update the same point model | Component inspection and lint/type checks |
| Quadrant feedback | Origin, axes, and all four quadrants are calculated from the point | Model tests |
| Sample ordered pairs | P, A, B, and C rows are selectable and update the graph | Component inspection |
| Lesson actions | Language, reset, share, tabs, and workspace navigation are wired | Component inspection |

## Verification Run

- `cartesianGraphingLesson39Model.test.ts`: passed
- `CartesianGraphingTargetLesson39.test.tsx`: passed
- focused lesson 39 adapter route test: passed
- ESLint on lesson 39 and adapter files: passed
- targeted TypeScript error scan: passed
- `git diff --check`: passed; line-ending warnings only

## Acceptance Boundary

The target PNG was used to define the surface structure and object model. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity therefore remains pending, while code routing, behavior, and structural correspondence are verified.

