# Target 0514 / Lesson 551: Variance Tests

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0514-interactive-advanced-inferential-statistics-variance-tests-redesigned.png`

Route: `/lessons/data-and-probability/551-variance-tests`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-variance model | Dedicated F-ratio test with three alternatives, exact F CDF/quantiles, two-sided critical region, p-value, and decision | Cross-browser numerical validation |
| One-variance model | Dedicated chi-square variance test with three alternatives, chi-square CDF/quantiles, critical region, p-value, and decision | Browser mode-switch validation |
| Inputs/modes | Real mode switch, sample sizes, variances, null ratio/variance, alternative, alpha, and reset controls | Browser input validation |
| Distribution | Mode-specific F or chi-square density, critical markers, tail region, and draggable observed statistic that changes sample variance 1 | Browser drag and pixel comparison |
| Guidance/check | Live interpretation, substituted statistic, assumptions, cautions, and selectable conclusion check | Browser interaction validation |

## Mathematical Notes

For `n1 = 20`, `s1^2 = 16`, `n2 = 25`, `s2^2 = 25`, and null ratio `1`, the observed statistic is `F = 0.64` with `(19, 24)` degrees of freedom. Independent verification against SciPy gives the two-sided 5% acceptance bounds `(0.407777, 2.345154)` and p-value `0.324050`. The target's bounds `(0.3548, 2.8190)` and p-value `0.5258` do not match the labeled two-sided F test. The implementation preserves the target structure and conclusion while using the correct distribution values.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (variance-test model, dedicated surface, adapter routing).
- F quantiles and p-value independently checked against SciPy.
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0515 / lesson 552 ANOVA.
