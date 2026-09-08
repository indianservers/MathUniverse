# Target 0449 / Lesson 486: Bar and Pie Charts

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0449-interactive-intermediate-advanced-statistics-and-regression-bar-and-pie-charts-redesigned.png`

Route: `/lessons/data-and-probability/486-bar-and-pie-charts`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Categorical data editor | Dedicated editable frequency table with total validation and reset | Browser interaction and visual comparison |
| Linked charts | Bar chart and pie chart modes use the same live category data | Pixel comparison at target viewport |
| Derived measures | Frequency, percent, and sector angle recalculate from total | Browser interaction and screenshot comparison |
| Learning/practice content | Suitability comparison, misconception guard, formulas, and self-check are present | Content/spacing comparison |

## Mathematical Notes

For each category, percentage is `f / n × 100%` and pie angle is `f / n × 360°`. Zero-total data is treated as invalid rather than producing misleading chart values.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0450 / lesson 487 Scatter Plot.
