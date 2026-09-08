# Target 0518 / Lesson 555: Power of a Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0518-interactive-advanced-inferential-statistics-power-of-a-test-redesigned.png`

Route: `/lessons/data-and-probability/555-power-of-a-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Test setup | Real two-sided, right-tailed, and left-tailed one-sample z-test power calculations | Browser control validation |
| Parameters | Editable null/true means, effect size, sample size, standard deviation, and alpha | Browser input validation |
| Distributions | Dedicated null/alternative sampling curves, live critical boundaries, and horizontal drag to change the true mean | Browser drag and pixel comparison |
| Power summary | Live standard error, effect size, noncentrality, alpha, beta, and power | Cross-browser numerical validation |
| Power curve | Generated power-by-sample-size curve from the current effect size, variability, alpha, and tail | Browser layout comparison |
| Sample planning | Target-power and effect-size controls with an exact integer search for the minimum sample size | Browser interaction validation |
| Guidance/check | Guided substitution, lever table, assumptions, misconception, and editable numeric check | Browser keyboard validation |

## Mathematical Notes

The target parameters `mu0 = 100`, `mu1 = 105`, `sigma = 10`, and `n = 64` imply `SE = 1.25`, standardised effect size `0.50`, and noncentrality `4.00`. For a two-sided 5% z test, the resulting power is approximately `0.9793`, not the target's displayed `0.8417`.

For target power `0.80`, effect size `0.50`, alpha `0.05`, and a two-sided z test, the first integer sample size achieving the target is `n = 32`, not the target's displayed `n = 51`. The implementation preserves the target controls and composition while calculating all outputs from their actual values.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (power model, dedicated surface, adapter routing).
- Tail-aware power, minimum sample size, and increasing power curve covered by focused model tests.
- Targeted TypeScript scan: no errors in the power model, surface, or adapter.
- ESLint passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0519 / lesson 334 Sequence Generator, identified from the Phase 4 catalog and target breadcrumb.
