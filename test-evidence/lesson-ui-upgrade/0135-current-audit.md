# Target 0135 Current Audit

## Lesson

- Lesson ID: 43
- Title: Parametric Curves
- Route: `/lessons/graphs-and-functions/43-parametric-curves`
- Target: `0135-interactive-foundational-advanced-2d-graphing-calculator-parametric-curves-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated parametric workspace | `ParametricCurvesTargetLesson43` replaces the generic graph renderer | Adapter regression test |
| Primary parametric path | `x = a cos(t)` and `y = b sin(t)` generate the live ellipse | Model geometry test |
| Comparison path | The target Lissajous equations generate an independent dashed path | Model geometry test |
| Real particle control | Time slider, pointer drag projected back to `t`, and keyboard stepping update the same particle | Model conversion test and component inspection |
| Radius controls | Sliders and numeric inputs update `a`, `b`, equations, paths, current point, velocity, and table | Component inspection |
| Motion controls | Speed factor drives a real play/pause animation interval | Component inspection |
| Direction feedback | Velocity is calculated from the derivatives and projected as a tangent arrow | Model test and component inspection |
| Values table | Cardinal times plus current `t` are evaluated from the active radii | Surface test |
| Lesson actions | Tabs, reset, share, calculator link, previous, and next navigation are wired | Component inspection |

## Mockup Correction

At `t = 1.2π`, the target prints `x = -2.8532` for `x = 3cos(t)`. The correct value is approximately `-2.4271`; its printed `y = -1.1756` is consistent with `y = 2sin(t)`. The implementation derives both coordinates from the displayed equations, so the marker and table remain mathematically truthful.

## Verification Run

- `parametricCurvesLesson43Model.test.ts`: passed
- `ParametricCurvesTargetLesson43.test.tsx`: passed
- focused lesson 43 adapter route test: passed
- ESLint on lesson 43 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the surface hierarchy and controls. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

