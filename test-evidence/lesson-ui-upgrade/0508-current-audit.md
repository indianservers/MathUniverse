# Target 0508 / Lesson 545: Two-Sample t-Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0508-interactive-advanced-inferential-statistics-two-sample-t-test-redesigned.png`

Route: `/lessons/data-and-probability/545-two-sample-t-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Independent-groups model | Dedicated Welch and pooled tests with sample summaries, three alternatives, Student-t p-values, df, confidence interval, and decision | Cross-browser numerical validation |
| Editable samples | Two real raw-data editors, variance assumption switch, alternative selector, alpha input, and reset | Browser input validation |
| Visualizations | Dual mean-distribution view, tail-aware null plot, and draggable observed statistic that shifts Group 1 | Browser drag and pixel comparison |
| Calculation/summary | Live guided substitution, result table, confidence interval, conclusion, and functional text-summary download | Browser rendering and download validation |
| Quick check | Selectable conclusion question tied to the current computed decision | Browser interaction validation |

## Mathematical Notes

The target's visible Group 1 observations have mean `14.30`, sample SD `1.8886`, and variance `3.5667`; its visible Group 2 observations have mean `9.75`, sample SD `1.2154`, and variance `1.4773`. These differ from the target's displayed SDs and variances. A real Welch calculation from the visible values gives `SE = 0.6927`, `t = 6.5689`, and `df = 14.84`, rather than the target's `0.7028`, `6.752`, and `19.19`. The conclusion still agrees: reject the equal-means null with `p < 0.0001`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (two-sample model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0509 / lesson 546 Paired t-Test.
