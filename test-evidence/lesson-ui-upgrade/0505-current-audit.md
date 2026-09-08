# Target 0505 / Lesson 542: Difference of Proportions Interval

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0505-interactive-advanced-inferential-statistics-difference-of-proportions-interval-redesigned.png`

Route: `/lessons/data-and-probability/542-difference-of-proportions-interval`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-sample model | Dedicated unpooled two-proportion interval with clamped counts, normal critical value, margin, endpoints, and large-count conditions | Cross-browser numerical validation |
| Editable samples | Four real count/total inputs, confidence slider, example reset, and deterministic replacement samples | Browser input and slider validation |
| Distribution/interval | Live normal approximation, CI shading, observed marker, sample-proportion bars, and draggable difference view | Browser drag and pixel comparison |
| Formula/interpretation | Live substituted SE, margin, interval, condition result, and conclusion based on whether zero is included | Browser rendering comparison |
| Quick check | Selectable answer choices calculated from a second set of sample counts | Browser interaction validation |

## Mathematical Notes

For `x1 = 58`, `n1 = 200`, `x2 = 40`, and `n2 = 200`, the real unpooled standard error is approximately `0.04277`, giving a 95% interval `(0.0062, 0.1738)`. The target displays `(0.022, 0.158)`, which is incompatible with both its displayed counts and its displayed standard error. The implementation keeps the target structure and interaction design but retains the correct calculation. The target quick-check answer is inconsistent for the same reason; the implementation computes approximately `(-0.067, 0.093)`.

## Checks Executed

- Vitest: focused model, dedicated surface, and adapter routing checks passed.
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0506 / lesson 543 One-Sample z-Test.
