# Target 0463 / Lesson 500: Sample Spaces

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0463-interactive-intermediate-advanced-probability-and-distributions-sample-spaces-redesigned.png`

Route: `/lessons/data-and-probability/500-sample-spaces`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Compound experiment builder | Dedicated three-step controls for coin, die, and card outcome counts, plus reset/random actions | Browser interaction and visual comparison |
| Complete sample space | Cartesian-product model renders every unique tuple and updates total/individual probability | Pixel comparison at target viewport |
| Event calculator | Event selector, favorable outcomes, count, fraction, and percentage recalculate from the sample space | Browser interaction and screenshot comparison |
| Learning/practice content | Multiplication principle, completeness guidance, misconception guard, and practice are present | Content/spacing comparison |

## Mathematical Notes

The object model constructs the Cartesian product of each experiment step. The default `2 × 6 × 3` experiment produces 36 unique, equiprobable outcomes; Heads and a die result of 5 has three favorable outcomes, so its probability is `3/36 = 1/12`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed after removing an unused shared-adapter import.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0464 / lesson 501 Events.
