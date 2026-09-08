# Target 0142 Current Audit

## Lesson

- Lesson ID: 50
- Title: Axis Controls
- Route: `/lessons/graphs-and-functions/50-axis-controls`
- Target: `0142-interactive-foundational-advanced-2d-graphing-calculator-axis-controls-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated axis workspace | `AxisControlsTargetLesson50` replaces the generic graph renderer | Adapter regression test |
| Independent bounds | x/y minimum and maximum fields own normalized ranges | Model tests and component inspection |
| Tick controls | Positive x/y tick spacing is stored and reflected in the summary | Model and component inspection |
| Linear/log scales | Independent transforms are real; log selection normalizes domains above zero | Model tests |
| Context and visible curves | Gray context and teal `2ˣ` viewport are generated separately | Model geometry test and component inspection |
| Direct range manipulation | Four corners support pointer dragging and keyboard bound changes | Component inspection |
| Origin shift | Central control supports pointer and keyboard axis-origin movement | Adapter and component tests |
| Presets | Default, zoom, focus-origin, and wide buttons apply real ranges | Model tests |
| Guardrails | Invalid/reversed bounds and nonpositive tick steps are normalized | Model tests |
| Lesson actions | Language, reset, share, previous, and next controls are wired | Component inspection |

## Verification Run

- `axisControlsLesson50Model.test.ts`: passed
- `AxisControlsTargetLesson50.test.tsx`: passed
- focused lesson 50 adapter route test: passed
- ESLint on lesson 50 and adapter files: passed with zero warnings
- targeted TypeScript error scan: passed

## Acceptance Boundary

The target PNG was inspected and used for the graph, handles, summary, warning, and axis-control hierarchy. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.

