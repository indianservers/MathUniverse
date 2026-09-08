# Target 0460 / Lesson 497: Residual Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0460-interactive-intermediate-advanced-statistics-and-regression-residual-plot-redesigned.png`

Route: `/lessons/data-and-probability/497-residual-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Observed/fitted editor | Dedicated editable table for observed and predicted values with reset | Browser interaction and visual comparison |
| Residual visualization | Linked observed/model chart and residual plot with vertical residual and zero-line toggles | Pixel comparison at target viewport |
| Fit diagnostics | Residual mean, SSE, RMSE, and pattern guidance recalculate from edits | Browser interaction and screenshot comparison |
| Learning/practice content | Reading workflow, key concept, misconception guard, worked example, and practice are present | Content/spacing comparison |

## Mathematical Notes

Each residual is `observed − predicted`. SSE is the sum of squared residuals and RMSE is `sqrt(SSE / n)`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0461 / lesson 498 Model Comparison.
