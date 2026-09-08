# Target 0507 / Lesson 544: One-Sample t-Test

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0507-interactive-advanced-inferential-statistics-one-sample-t-test-redesigned.png`

Route: `/lessons/data-and-probability/544-one-sample-t-test`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Student-t model | Dedicated sample statistics, Student-t CDF and inverse CDF, three alternatives, p-value, critical value, CI, decision, and Cohen's d | Cross-browser numerical validation |
| Editable sample | Ten editable observations, real add and clear actions, null mean, alternative, alpha slider, and reset | Browser input validation |
| Distribution | Degrees-of-freedom-sensitive t curve, alternative-sensitive tail areas, observed statistic, and drag-to-shift observations | Browser drag and pixel comparison |
| Formula/results | Live substituted statistic, hypothesis summary, decision, and confidence interval dual to the test | Browser rendering comparison |
| Knowledge check | Selectable conclusion question whose correct answer follows the current computed decision | Browser interaction validation |

## Mathematical Notes

The ten observations visibly shown in the target (`69, 72, 71, 75, 68, 74, 70, 73, 69, 76`) have mean `71.70` and sample SD `2.7508`, not the target's `72.30` and `2.848`. Against `mu0 = 70`, they produce `t = 1.9543`, two-sided `p = 0.0824`, and a 95% CI approximately `(69.73, 73.67)`, so the correct decision is to fail to reject. The implementation preserves the visible dataset and target interaction structure while keeping every result mathematically consistent.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (Student-t model, dedicated surface, adapter routing).
- Student-t numerical check: `t(9)` 97.5th percentile equals approximately `2.2622` and maps back to CDF `0.975`.
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0508 / lesson 545 Two-Sample t-Test.
