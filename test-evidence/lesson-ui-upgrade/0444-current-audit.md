# Target 0444 / Lesson 481: Dot Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0444-interactive-intermediate-advanced-statistics-and-regression-dot-plot-redesigned.png`

Route: `/lessons/data-and-probability/481-dot-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Build-your-own observation editor | Dedicated observation entry, Add, editable value inputs, random data, and reset controls | Browser interaction and visual comparison |
| Stacked dot plot | Values are grouped with a dedicated count model and rendered as vertically stacked dots with frequency labels | Pixel comparison at target viewport |
| Linked statistics | n, mean, median, mode, range, and IQR recalculate from the editable observations | Browser interaction and screenshot comparison |
| Explanatory sections | Notice pattern, definition/rule, misconception, worked example, and practice are present | Content/spacing comparison |

## Mathematical Notes

The default observations are `[2, 2, 3, 4, 4, 4, 5, 5, 5, 6, 7]`. The dedicated model uses the actual data for all displayed statistics. In particular, the median is `4`; inconsistent labels in the target image are not copied into the calculation model.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0445 / lesson 482 Stem-and-Leaf Plot.
