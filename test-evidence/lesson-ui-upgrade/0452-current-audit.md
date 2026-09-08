# Target 0452 / Lesson 489: Correlation Coefficient

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0452-interactive-intermediate-advanced-statistics-and-regression-correlation-coefficient-redesigned.png`

Route: `/lessons/data-and-probability/489-correlation-coefficient`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Paired-data editor | Dedicated editable x/y table, selectable points, reset, and live point view | Browser interaction and visual comparison |
| Pearson analysis | Correlation value, direction, strength, covariance components, means, and standard deviations recalculate | Browser interaction and screenshot comparison |
| Visual diagnostics | Scatter plot, optional regression line, metric strip, and interpretation cards are present | Pixel comparison at target viewport |
| Learning/practice content | Formula, worked example, causation warning, and practice section are present | Content/spacing comparison |

## Mathematical Notes

Pearson's `r` is calculated from centered paired deviations. The dedicated model also exposes population covariance and standard deviations for the diagnostic panel.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed after wrapping the practice interaction callback.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0453 / lesson 490 Linear Regression.
