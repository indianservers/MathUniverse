# Target 0145 Current Audit

## Lesson

- Lesson ID: 53
- Title: Special Points
- Route: `/lessons/graphs-and-functions/53-special-points`
- Target: `0145-interactive-foundational-advanced-2d-graphing-calculator-special-points-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated special-points workspace | `SpecialPointsTargetLesson53` replaces the generic graph renderer | Adapter regression test |
| Selectable equations | Quadratic and line selectors regenerate all curves and feature data | Component inspection |
| Real quadratic features | Roots, y-intercept, vertex, and turning point derive from the active coefficients | Model tests |
| Real intersections | The quadratic-line system is solved from both active equations | Model tests |
| Generated graph | Both graph paths use the selected equations and current viewport | Model geometry test |
| Feature labels | Coordinates and callouts use calculated points rather than fixed mock values | Surface test |
| Independent layers | Roots, y-intercept, vertex, intersections, and turning-point switches are functional | Component inspection |
| View controls | Zoom Fit, Show Grid, and expanded graph controls change rendered state | Component inspection |
| Lesson actions | Reset, share, previous, and next controls are wired | Component inspection |
| Explanatory section | The target's feature explanations accompany the live graph | Surface test |

## Mathematical Correction

The target mockup labels intersections at `(-2, -3)` and `(2, 1)`, but those points do not satisfy `f(x) = x² - 2x - 3`. The implementation keeps the target's displayed default equations and computes their true intersections with `g(x) = x - 1`: approximately `(-0.56, -1.56)` and `(3.56, 2.56)`. This preserves the requested real-calculation requirement instead of reproducing mathematically incorrect dummy labels.

## Verification Run

- `specialPointsLesson53Model.test.ts`: passed
- `SpecialPointsTargetLesson53.test.tsx`: passed
- focused lesson 53 adapter route test: passed
- ESLint on lesson 53 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the equation toolbar, graph composition, feature control rail, explanatory section, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
