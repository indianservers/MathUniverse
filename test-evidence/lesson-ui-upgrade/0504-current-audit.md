# Target 0504 / Lesson 541: Difference of Means Interval

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0504-interactive-advanced-inferential-statistics-difference-of-means-interval-redesigned.png`

Route: `/lessons/data-and-probability/541-difference-of-means-interval`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-sample model | Dedicated pooled, Welch, and paired intervals with real df, t critical, p-value, and effect size | Cross-browser numerical validation |
| Editable data | Two editable samples and labels, generated replacement data, relationship/method controls, and confidence selector | Browser input validation |
| Distributions/interval | Live dual histograms, group summary table, draggable difference interval, and contextual conclusion | Browser drag and pixel comparison |
| Formula/effect | Live substitution, standard error, margin, test statistic, p-value, pooled SD, and Cohen's d | Browser rendering comparison |
| Assumptions/check | Method-sensitive cautions and a selectable conclusion question | Browser interaction validation |

## Mathematical Notes

The internally consistent default data reproduce means `15.35` and `8.75`, SDs `1.4422` and `1.0541`, and difference `6.60`. Those variances imply pooled SE `0.3994` and a 95% interval `(5.791, 7.409)`. The target's displayed SE `0.3684` and interval `(5.855, 7.345)` conflict with its own displayed sample sizes and variances, so the implementation retains the real calculation.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (difference-means model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0505 / lesson 542 Difference of Proportions Interval.
