# Target 0462 / Lesson 499: Interpolation and Extrapolation

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0462-interactive-intermediate-advanced-statistics-and-regression-interpolation-and-extrapolation-redesigned.png`

Route: `/lessons/data-and-probability/499-interpolation-and-extrapolation`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Editable model data | Dedicated observed-y editor, prediction-x control, uncertainty toggle, and reset | Browser interaction and visual comparison |
| Range visualization | Interpolation and extrapolation regions, fitted quadratic, observed points, prediction point, and uncertainty band | Pixel comparison at target viewport |
| Reliability output | Region classification, prediction, R², RMSE, prediction interval, and distance beyond data range recalculate | Browser interaction and screenshot comparison |
| Learning/practice content | Explanation, reliability warning, misconception guard, and practice are present | Content/spacing comparison |

## Mathematical Notes

Prediction is interpolation when x lies within the observed minimum/maximum and extrapolation otherwise. The prediction interval widens with distance outside the observed range.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0463 / lesson 500 Regression Residuals.
