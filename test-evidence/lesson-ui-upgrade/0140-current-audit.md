# Target 0140 Current Audit

## Lesson

- Lesson ID: 48
- Title: Trace Mode
- Route: `/lessons/graphs-and-functions/48-trace-mode`
- Target: `0140-interactive-foundational-advanced-2d-graphing-calculator-trace-mode-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated trace workspace | `TraceModeTargetLesson48` replaces the generic graph renderer | Adapter regression test |
| Target function | `f(x) = sin(x) + 0.3x` generates the complete curve | Model geometry test |
| Real trace interaction | Horizontal pointer drag, keyboard stepping, range, and numeric controls update x | Model mapping test and component inspection |
| Live coordinates | y is recalculated from the function for every x | Model and surface tests |
| Exact tangent | Derivative `cos(x) + 0.3` generates the tangent and slope readout | Model tests |
| Step controls | 0.01, 0.1, 0.5, and 1 control snapping and previous/next movement | Model and component inspection |
| Nearby table | Nine x and f(x) values derive from current x and step | Model test |
| Path history | Recent trace locations are retained and rendered with progressive opacity | Component inspection |
| Lesson actions | Tabs, reset, share, fullscreen, previous, and next navigation are wired | Component inspection |

## Mockup Correction

The target correctly shows `f(1.8) ≈ 1.51`, but prints a slope estimate of `1.021`. For the displayed function, the instantaneous slope is `f′(1.8) = cos(1.8) + 0.3 ≈ 0.073`. The implementation uses the exact derivative so the tangent and slope readout agree.

## Verification Run

- `traceModeLesson48Model.test.ts`: passed
- `TraceModeTargetLesson48.test.tsx`: passed
- focused lesson 48 adapter route test: passed
- ESLint on lesson 48 and adapter files: passed
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the trace graph, control panel, nearby table, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

