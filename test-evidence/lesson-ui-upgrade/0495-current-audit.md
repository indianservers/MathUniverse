# Target 0495 / Lesson 532: Exponential Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0495-interactive-intermediate-advanced-probability-and-distributions-exponential-distribution-redesigned.png`

Route: `/lessons/data-and-probability/532-exponential-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Waiting-time model | Dedicated density, CDF, survival, mean, variance, and seeded Poisson-arrival simulation | Cross-browser numerical validation |
| Core controls | Live rate and threshold sliders, unit selector, reset, resample, and pause/resume controls | Browser pointer and keyboard validation |
| Dual plots | Generated density and survival curves, live value callouts, tail shading, and direct threshold dragging on either graph | Browser drag and pixel comparison |
| Memorylessness | Live conditional-probability table proving `P(T>s+t | T>s)=P(T>t)` | Browser rendering comparison |
| Simulation | Actual exponential inter-arrival sampling, event count, observed mean, values, and histogram | Browser resampling validation |
| Knowledge check | Selectable answer with explicit check and feedback | Browser interaction validation |

## Mathematical Notes

For `lambda=0.40` and `t0=3`, the model gives density `0.1205`, survival `0.3012`, cumulative probability `0.6988`, mean `2.500`, and variance `6.250`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (Exponential model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0496 / lesson 533 Gamma Distribution.
