# Target 0451 / Lesson 488: Time-Series Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0451-interactive-intermediate-advanced-statistics-and-regression-time-series-plot-redesigned.png`

Route: `/lessons/data-and-probability/488-time-series-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Time-series controls | Dedicated editable monthly values, time-step slider, moving-average window, visibility toggles, and reset | Browser interaction and visual comparison |
| Live plot | Chronological raw-data line, moving-average points, and OLS trend line update from values | Pixel comparison at target viewport |
| Diagnostics | Current value, moving average, trend estimate, change, and OLS slope recalculate | Browser interaction and screenshot comparison |
| Learning/practice content | Definition, interpretation, diagnostics, misconception guard, and practice section are present | Content/spacing comparison |

## Mathematical Notes

The moving average is centered on the trailing window of editable observations. The trend diagnostic uses ordinary least squares over chronological indices.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed after wrapping the practice interaction callback.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0452 / lesson 489 Correlation Coefficient.
