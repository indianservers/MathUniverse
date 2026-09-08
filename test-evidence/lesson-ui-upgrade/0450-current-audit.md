# Target 0450 / Lesson 487: Scatter Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0450-interactive-intermediate-advanced-statistics-and-regression-scatter-plot-redesigned.png`

Route: `/lessons/data-and-probability/487-scatter-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Paired-data editor | Dedicated editable x/y table, add/delete/reset controls, and selectable points | Browser interaction and visual comparison |
| Scatter visualization | Live SVG points with optional regression trend line | Pixel comparison at target viewport |
| Analysis panel | Direction, strength, Pearson correlation, and correlation slider are linked to the data | Browser interaction and screenshot comparison |
| Learning/practice content | Definition, formula, causation warning, worked example, and negative-pattern practice are present | Content/spacing comparison |

## Mathematical Notes

The model computes Pearson's `r`, least-squares slope, and intercept directly from the current paired observations. Editing or deleting a point recalculates the analysis.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0451 / lesson 488 Time-Series Plot.
