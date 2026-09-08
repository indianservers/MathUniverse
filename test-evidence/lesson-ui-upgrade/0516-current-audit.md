# Target 0516 / Lesson 553: p-Value Visualiser

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0516-interactive-advanced-inferential-statistics-p-value-visualiser-redesigned.png`

Route: `/lessons/data-and-probability/553-p-value-visualiser`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Test controls | Real z, t, chi-square, and F test-family selection with applicable degrees-of-freedom controls | Browser control validation |
| Tail controls | Live left, right, and two-sided p-values with distribution-specific CDFs | Browser interaction validation |
| Statistic/alpha | Range and number inputs update the observed statistic, p-value, critical values, shading, and decision | Browser input validation |
| Distribution plot | Dedicated density curve with p-value shading, critical markers, observed marker, and horizontal drag interaction | Browser drag and pixel comparison |
| Fixed scenario | Target z-test data, substituted calculation, interpretation, decision rule, misconception, and assumptions | Browser layout comparison |
| Quick check | Three editable tail-probability responses with immediate numeric validation | Browser keyboard validation |

## Mathematical Notes

For the target scenario `mu0 = 100`, `sigma = 15`, `n = 36`, and `x-bar = 104.2`, the z statistic is `1.68`. The implementation computes the standard-normal probabilities rather than hard-coding the display: left tail `0.9535`, right tail `0.0465`, and two-sided p-value `0.0930` (minor last-digit differences depend on table rounding). At alpha `0.05`, the two-sided critical values are approximately `-1.960` and `1.960`, so the decision is to fail to reject the null.

For non-symmetric chi-square and F distributions, the implementation uses their actual CDFs and quantiles. A two-sided choice doubles the smaller attained tail probability; it does not mirror the positive statistic around zero.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (p-value model, dedicated surface, adapter routing).
- Test-family switching and target two-tail z scenario covered by focused model tests.
- Targeted TypeScript scan: no errors in the p-value model, surface, or adapter.
- ESLint passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0517 / lesson 554 Type I and Type II Errors.
