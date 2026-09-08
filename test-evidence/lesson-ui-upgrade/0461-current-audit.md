# Target 0461 / Lesson 498: Model Comparison

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0461-interactive-intermediate-advanced-statistics-and-regression-model-comparison-redesigned.png`

Route: `/lessons/data-and-probability/498-model-comparison`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Shared dataset editor | Dedicated editable dataset with reset and three synchronized model cards | Browser interaction and visual comparison |
| Model comparison | Linear, quadratic, and exponential fits report R², RMSE, AIC-style complexity score, and model selection | Pixel comparison at target viewport |
| Evidence-based choice | Selected model state shows the active evidence and complexity tradeoff | Browser interaction and screenshot comparison |
| Learning/practice content | Fit/error/complexity concepts, worked example, misconception guard, and practice are present | Content/spacing comparison |

## Mathematical Notes

The linear, quadratic, and exponential models are fitted from the same editable data. Model cards expose error and fit metrics so selection is based on more than R² alone.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0462 / lesson 499 Interpolation and Extrapolation.
