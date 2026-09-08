# Target 0133 Current Audit

## Lesson

- Lesson ID: 41
- Title: Equation Grapher
- Route: `/lessons/graphs-and-functions/41-equation-grapher`
- Target: `0133-interactive-foundational-advanced-2d-graphing-calculator-equation-grapher-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated equation workspace | `EquationGrapherTargetLesson41` replaces the generic graph renderer | Adapter regression test |
| Three solution sets | Ellipse, line, and comparison circle have independent exact residual functions and generated paths | Model tests |
| Real point tester | Pointer drag, arrow-key movement, numeric x/y inputs, optional snapping, and visibility are wired to one point model | Model conversion test and component inspection |
| Accurate substitution cards | Each card calculates both sides and reports membership from the equation residual | Model and surface tests |
| Graph display controls | Axes, grid, labels, test point, and snapping checkboxes update the rendered state | Component inspection |
| Equation visibility | Each equation has an independent working checkbox | Component inspection |
| Tool modes | Point tester, ellipse trace, analytic intersection finder, and clear points produce distinct state and overlays | Component inspection and intersection tests |
| Navigation and viewport actions | Reset, fit, fullscreen, previous, and next actions are wired | Component inspection |

## Mockup Correction

The target image labels the ellipse and line as satisfying the point `(2, 1)`, but its own displayed arithmetic shows otherwise: `25/36` is not `1`, and `1` is not `2`. Because the project requirement explicitly forbids dummy or false calculations, the implementation correctly reports that `(2, 1)` does not satisfy any of the three displayed equations. This is an intentional mathematical correction rather than a missing UI state.

## Verification Run

- `equationGrapherLesson41Model.test.ts`: passed
- `EquationGrapherTargetLesson41.test.tsx`: passed
- focused lesson 41 adapter route test: passed
- ESLint on lesson 41 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the surface hierarchy and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

