# Target 0503 / Lesson 540: Confidence Interval for Proportion

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0503-interactive-advanced-inferential-statistics-confidence-interval-for-proportion-redesigned.png`

Route: `/lessons/data-and-probability/540-confidence-interval-for-proportion`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Interval model | Dedicated Wilson score and Wald calculations with bounded endpoints and live standard errors | Cross-browser numerical validation |
| Controls | Editable successes, sample size, confidence, method, true proportion, and repetitions | Browser input validation |
| Interval construction | Live estimate/endpoints, method summary, and draggable sample-proportion marker | Browser drag and pixel comparison |
| Coverage simulation | Seeded binomial samples, Wilson/Wald repeated intervals, capture rate, width, and number-line display | Browser rerun validation |
| Comparison/checks | Side-by-side real method table and four independently selectable checks | Browser interaction validation |

## Mathematical Notes

For `x=180`, `n=250`, and 95% confidence, the standard Wilson score interval is `[0.6613, 0.7720]` with half-width `0.0553`; Wald is `[0.6643, 0.7757]`. The target shows a Wilson upper bound of about `0.771` and half-width `0.0550`, which do not match the standard score formula, so the implementation retains the mathematically correct values.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (proportion-CI model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0504 / lesson 541 Difference of Means Interval.
