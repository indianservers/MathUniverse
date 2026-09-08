# Target 0143 Current Audit

## Lesson

- Lesson ID: 51
- Title: Grid Controls
- Route: `/lessons/graphs-and-functions/51-grid-controls`
- Target: `0143-interactive-foundational-advanced-2d-graphing-calculator-grid-controls-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated grid workspace | `GridControlsTargetLesson51` replaces the generic graph renderer | Adapter regression test |
| Target parabola | `y = 0.5x²` generates the current curve and sample points | Model geometry test |
| Major spacing | 0.5, 1, 2, and 4 regenerate major grid lines | Model and component inspection |
| Minor subdivisions | 1, 2, 4, and 8 derive the actual minor interval and lines | Model tests |
| Real snapping | Selected x snaps to `majorSpacing / subdivisions`; disabling snap preserves hundredths | Model tests |
| Direct point control | Curve point supports pointer dragging and keyboard movement along x | Model mapping test and component inspection |
| Live construction guides | x/y guides, labels, and `f(x)` readout derive from the selected point | Surface test |
| Opacity control | Slider changes generated major and minor line opacity | Component inspection |
| Estimate and label layers | Independent toggles control construction guides and graph labels | Component inspection |
| Before/after comparison | Sparse baseline and current guided graph use the same curve model | Component inspection |
| Lesson actions | Reset, share, previous, and next controls are wired | Component inspection |

## Verification Run

- `gridControlsLesson51Model.test.ts`: passed
- `GridControlsTargetLesson51.test.tsx`: passed
- focused lesson 51 adapter route test: passed
- ESLint on lesson 51 and adapter files: passed with zero warnings
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the graph, grid controls, comparison panels, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

