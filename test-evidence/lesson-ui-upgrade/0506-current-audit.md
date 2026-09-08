# Target 0506 / Lesson 543: One-Sample z-Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0506-interactive-advanced-inferential-statistics-one-sample-z-test-redesigned.png`

Route: `/lessons/data-and-probability/543-one-sample-z-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Known-sigma test model | Dedicated one-sample mean z-test with two-sided, right-tailed, and left-tailed p-values | Cross-browser numerical validation |
| Editable design | Real inputs for sigma, n, sample mean, null mean, alternative, and alpha; reset restores the example | Browser input validation |
| Distribution plot | Live normal curve, alternative-sensitive tail areas, observed z marker, and drag-to-change sample mean | Browser drag and pixel comparison |
| Calculation/results | Live SE, z, p-value, decision, hypotheses, contextual conclusion, and Cohen's d | Browser rendering comparison |
| Knowledge check | Selectable right-tail question with calculated interpretation | Browser interaction validation |

## Mathematical Notes

The target displays `x-bar = 106`, `mu0 = 100`, `sigma = 12`, and `n = 36`, but labels the resulting statistic `z = 2.50` and two-sided p-value `0.0124`. Those displayed inputs give `SE = 2`, `z = 3.00`, and two-sided p-value approximately `0.0027`. The implementation preserves the target's structure and behaviors while keeping all results synchronized with the actual inputs. Its right-tail quick-check therefore uses approximately `0.0013`.

## Checks Executed

- Vitest: focused model, dedicated surface, and adapter routing checks passed.
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0507 / lesson 544 One-Sample t-Test.
