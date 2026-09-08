# Target 0489 / Lesson 526: Negative Binomial Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0489-interactive-intermediate-advanced-probability-and-distributions-negative-binomial-distribution-redesigned.png`

Route: `/lessons/data-and-probability/526-negative-binomial-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Stopping-time controls | Adjustable required successes, success probability, run count, and seed drive one failures-before-rth-success model | Browser pointer and keyboard validation |
| Live experiment | Valid trial sequence always ends on exactly the r-th success; working run/pause/resume and rerun controls | Browser timer and visual comparison |
| PMF/CDF surface | Functional PMF/CDF toggle, selectable bars, theoretical moments/mode, simulation summary, and horizontal probability table | Pixel comparison at target viewport |
| Convention switch | Failures and total-trials views transform labels with `Y=X+r` without changing probabilities | Browser interaction validation |
| Knowledge check | Selectable failures-convention PMF question with checked feedback | Browser interaction validation |

## Mathematical Notes

For `r=5`, `p=0.30`, and failures `x=11`, `P(X=11)=0.06558694`, the mean is `11.6667`, and the variance is `38.8889`. The target shows `0.0096` and variance `27.222`, which do not follow its stated parameters, so the implementation keeps the exact negative-binomial results.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (negative-binomial model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0490 / lesson 527 Uniform Distribution.
