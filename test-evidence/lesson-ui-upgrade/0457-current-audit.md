# Target 0457 / Lesson 494: Power Regression

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0457-interactive-intermediate-advanced-statistics-and-regression-power-regression-redesigned.png`

Route: `/lessons/data-and-probability/494-power-regression`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Positive-domain power data | Dedicated editable x/y table, scale factor, and reset | Browser interaction and visual comparison |
| Power-law fit | Log-log least-squares fit computes `a`, `b`, fitted curve, and scaling response | Pixel comparison at target viewport |
| Diagnostics | R², RMSE, residual bars, and exponent interpretation are linked to the current data | Browser interaction and screenshot comparison |
| Learning/practice content | Formula, domain rule, misconception guard, and practice section are present | Content/spacing comparison |

## Mathematical Notes

For positive x and y, the model fits `ln(y) = ln(a) + b ln(x)` and recovers `y = ax^b`. Scaling x by k multiplies y by `k^b`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0458 / lesson 495 Logistic Regression.
