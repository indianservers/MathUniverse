# Target 0512 / Lesson 549: Chi-Square Goodness-of-Fit

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0512-interactive-advanced-inferential-statistics-chi-square-goodness-of-fit-redesigned.png`

Route: `/lessons/data-and-probability/549-chi-square-goodness-of-fit`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Categorical model | Dedicated observed/expected model with normalized weights, contributions, chi-square statistic, fitted-parameter df, p-value, and decision | Cross-browser numerical validation |
| Data controls | Editable observed counts and expected weights, edit mode, presets, fitted parameters, alpha, apply, and reset | Browser input validation |
| Contribution views | Live residual-contribution bars with drag-to-change counts and cumulative chi-square plot | Browser drag and pixel comparison |
| Tail/results | Right-tail chi-square density, summary table, expected-count checks, formula, and guided category arithmetic | Browser rendering comparison |
| Quick check | Selectable alternate-data calculation with a computed answer | Browser interaction validation |

## Mathematical Notes

The main target example is consistent: observed `[21, 18, 24, 17, 20]` against expected `[20, 20, 20, 20, 20]` gives contributions `[0.05, 0.20, 0.80, 0.45, 0]`, `chi-square = 1.500`, `df = 4`, and right-tail `p approximately 0.8266`. The implementation reproduces those values. The target quick check is inconsistent: observed `[25, 25, 25, 25, 0]` against five expected counts of `20` gives `4(25/20) + 400/20 = 25`, not `10`; the implementation uses the correct result.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (goodness-of-fit model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0513 / lesson 550 Chi-Square Independence.
