# Target 0487 / Lesson 524: Poisson Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0487-interactive-intermediate-advanced-probability-and-distributions-poisson-distribution-redesigned.png`

Route: `/lessons/data-and-probability/524-poisson-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Rate/window controls | Independent steppers and sliders for event rate and interval length produce the shared expected count | Browser pointer and keyboard validation |
| Event timeline | Seeded Poisson count and event positions regenerate with the simulation run | Browser rendering and visual comparison |
| PMF exploration | Selectable generated PMF bars, probability/percentage mode, selected result, table-compatible distribution, and exact substitution | Pixel comparison at target viewport |
| Moments/simulation | Mean, variance, standard deviation, adjustable simulation size, empirical moments, and rerun action share one model | Runtime and browser interaction validation |
| Knowledge check | Selectable rate-times-window Poisson question with checked feedback | Browser interaction validation |

## Mathematical Notes

At `lambda=4` and `t=2.5`, the expected count, mean, and variance are `10`, the standard deviation is `3.1623`, and `P(X=10)=0.12511`. For the quiz's mean `6`, `P(X=7)=0.1377`; the target's `0.1335` does not match the Poisson PMF, so the lesson uses the calculated value.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (Poisson model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0488 / lesson 525 Geometric Distribution.
