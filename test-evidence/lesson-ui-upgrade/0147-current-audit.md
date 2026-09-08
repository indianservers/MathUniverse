# Target 0147 Current Audit

## Lesson

- Lesson ID: 55
- Title: Dynamic Parameters
- Route: `/lessons/graphs-and-functions/55-dynamic-parameters`
- Target: `0147-interactive-foundational-advanced-2d-graphing-calculator-dynamic-parameters-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated parameter workspace | `DynamicParametersTargetLesson55` replaces the generic graph renderer | Adapter regression test |
| Shared sine-family model | Current graph, history curves, formula, guides, and readouts derive from `y = a sin(bx) + c` | Model and surface tests |
| Amplitude control | The `a` slider changes the wave height, range, and amplitude guide | Model tests and component inspection |
| Frequency control | The `b` slider changes horizontal compression and the calculated period | Model tests |
| Vertical-shift control | The `c` slider moves the curve and generated midline | Model tests and component inspection |
| Previous-value curves | Parameter edits retain up to four prior family members as dashed curves | Component inspection |
| Animated sweep | Play/pause runs a bounded, real parameter animation | Model sweep test and component inspection |
| View controls | Zoom in, zoom out, and expanded graph update the graph viewport | Model mapping test and component inspection |
| Functional tabs | Interaction, Explain, Examples, Formulas, and Know more switch rendered content | Component inspection |
| Lesson actions | Language, reset, share, workspace, previous, and next controls are wired | Component inspection |

## Verification Run

- `dynamicParametersLesson55Model.test.ts`: passed
- `DynamicParametersTargetLesson55.test.tsx`: passed
- focused lesson 55 adapter route test: passed
- ESLint on lesson 55 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the sine graph, parameter rail, annotations, tabs, explanatory cards, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
