# Target 0511 / Lesson 548: Two-Proportion Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0511-interactive-advanced-inferential-statistics-two-proportion-test-redesigned.png`

Route: `/lessons/data-and-probability/548-two-proportion-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-proportion model | Dedicated pooled-null z test with three alternatives, p-value, decision, and unpooled confidence interval | Cross-browser numerical validation |
| Group controls | Real successes/totals for both groups, alternative and alpha controls, reset, and deterministic random examples | Browser input validation |
| Proportion/test views | Live proportion bars, null distribution, tail area, and draggable z marker that changes Group 1 | Browser drag and pixel comparison |
| Calculation/summary | Pooled proportion, null SE, test statistic, p-value, unpooled interval, observed table, and guided steps | Browser rendering comparison |
| Conditions/check | Four-count condition result and selectable decision check tied to the current model | Browser interaction validation |

## Mathematical Notes

For the target's visible counts `58/200` and `38/200`, the pooled proportion is `0.2400`, pooled null SE is `0.04271`, `z = 2.3415`, and the two-sided p-value is approximately `0.0192`. The target instead displays `SE = 0.030249`, `z = 3.306`, and `p = 0.0280`, which cannot all be true simultaneously. The real unpooled 95% interval is approximately `(0.0169, 0.1831)`, rather than the target's `(0.0404, 0.1596)`. The implementation preserves the visible inputs and target layout while keeping the test and interval internally correct. The rejection conclusion remains unchanged.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (two-proportion model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0512 / lesson 549 Chi-Square Goodness-of-Fit.
