# Target 0464 / Lesson 501: Events

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0464-interactive-intermediate-advanced-probability-and-distributions-events-redesigned.png`

Route: `/lessons/data-and-probability/501-events`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-dice sample space | Dedicated 6×6 ordered-outcome grid with direct cell selection | Browser interaction and visual comparison |
| Event builder | Presets for sum 7, even sum, doubles, at least one 6, plus arbitrary custom selection | Pixel comparison at target viewport |
| Event results | Event count, total, probability, complement count/probability, and set notation update live | Browser interaction and screenshot comparison |
| Comparisons/practice | Simple/compound event mini-grids, misconception guard, and self-check are present | Content/spacing comparison |

## Mathematical Notes

The model enumerates all 36 ordered outcomes for two fair dice. Event probabilities are subset counts divided by 36; complements use `36 − n(A)` and `1 − P(A)`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0465 / lesson 502 Probability Scale.
