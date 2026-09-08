# Target 0136 Current Audit

## Lesson

- Lesson ID: 44
- Title: Polar Graphs
- Route: `/lessons/graphs-and-functions/44-polar-graphs`
- Target: `0136-interactive-foundational-advanced-2d-graphing-calculator-polar-graphs-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated polar workspace | `PolarGraphsTargetLesson44` replaces the generic graph renderer | Adapter regression test |
| Polar rose equation | `r = a sin(nθ)` generates the current rose path | Model geometry test |
| Polar grid and reference | Concentric grid, angle spokes, degree labels, and `r = 2 + cos(θ)` reference are independently generated | Model and component inspection |
| Real angle control | Slider, pointer drag, and arrow keys update the polar angle | Pointer conversion test and component inspection |
| Radius and multiplier controls | `a` and integer `n` regenerate the curve, point, radius, Cartesian result, and petal count | Model and surface tests |
| Live conversion | Signed radius and `(x, y)` are calculated from the active equation and angle | Model tests |
| Petal rule | Odd `n` yields `n` petals and even `n` yields `2n` petals | Model tests |
| Lesson actions | Language, reset, share, previous, and next controls are wired | Component inspection |

## Mockup Correction

With `a = 4`, `n = 3`, and `θ = 40°`, the target's equation gives `r = 4sin(120°) ≈ 3.464`, not `2.57`. The corresponding Cartesian point is approximately `(2.654, 2.227)`. The implementation uses these equation-derived values so the graph and readout remain synchronized.

## Verification Run

- `polarGraphsLesson44Model.test.ts`: passed
- `PolarGraphsTargetLesson44.test.tsx`: passed
- focused lesson 44 adapter route test: passed
- ESLint on lesson 44 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the surface hierarchy and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

