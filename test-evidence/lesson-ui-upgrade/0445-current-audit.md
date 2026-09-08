# Target 0445 / Lesson 482: Stem-and-Leaf Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0445-interactive-intermediate-advanced-statistics-and-regression-stem-and-leaf-plot-redesigned.png`

Route: `/lessons/data-and-probability/482-stem-and-leaf-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Raw data manipulation | Dedicated editable two-digit observation controls, randomize, reset, and split-stem toggle | Browser interaction and visual comparison |
| Live stem-and-leaf table | Values are sorted into live stems/leaves; split stems use 0–4 and 5–9 rows | Pixel comparison at target viewport |
| Key and checks | Live key, reconstructed sorted data, median/range summary, and check action are present | Browser interaction and screenshot comparison |
| Learning and practice sections | Misconception guard plus expandable practice activity are present | Content/spacing comparison |

## Mathematical Notes

The model keeps split rows display-only (`10` and `15` represent the two halves of the tens stem) and reconstructs values from the tens base plus the leaf. This prevents split-row labels from changing the underlying data.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, and tests: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0446 / lesson 483 Histogram.
