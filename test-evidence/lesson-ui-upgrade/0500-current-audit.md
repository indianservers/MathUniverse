# Target 0500 / Lesson 537: Sampling Distributions

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0500-interactive-advanced-inferential-statistics-sampling-distributions-redesigned.png`

Route: `/lessons/data-and-probability/537-sampling-distributions`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Population model | Five real source generators: normal, uniform, right/left skewed, and bimodal | Browser selection validation |
| Sampling controls | Live sample size, repetition count, speed, pause/resume, rerun, and genuine with/without-replacement branches | Browser timing/input validation |
| Repeated samples | Generated last sample, recent means, sample-mean histogram, and normal overlay | Browser rendering and pixel comparison |
| Inference metrics | Empirical mean, bias, standard error, empirical 95% range, and theoretical comparison | Cross-browser numerical validation |
| Convergence/check | Four independently simulated repetition counts and a selectable concept check | Browser interaction validation |

## Mathematical Notes

For a population with `mu=50`, `sigma=10`, and `n=25`, the theoretical standard error is `2.000`. The default run generates 20,000 sample means from a fixed seed; without-replacement sampling uses unique indices from a finite population and applies the finite-population correction.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (sampling model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0501 / lesson 538 Central Limit Theorem.
