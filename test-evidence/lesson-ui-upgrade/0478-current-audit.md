# Target 0478 / Lesson 515: Law of Large Numbers

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0478-interactive-intermediate-advanced-probability-and-distributions-law-of-large-numbers-redesigned.png`

Route: `/lessons/data-and-probability/515-law-of-large-numbers`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Live experiment | Dedicated coin proportion, die sample mean, and spinner proportion models with batch, maximum, pause, and auto-advance controls | Browser timer and visual comparison |
| Convergence metrics | Current estimate, theoretical value, absolute deviation, confidence half-width, progress, and convergence stage | Pixel comparison at target viewport |
| Confidence chart | Sample path, theoretical line, upper/lower confidence paths, milestones, and checkpoint status derive from the run | Browser rendering comparison |
| Live table and theory | Checkpoint counts/estimates and LLN/confidence formulas update for the selected experiment | Content and spacing comparison |
| Quick check | Two real answer sets with selection, checking, and next-question behavior | Keyboard/pointer validation |

## Mathematical Notes

The default deterministic coin run reproduces the target checkpoint of 503 heads in 1,000 tosses: `p-hat=0.503`, theoretical `p=0.500`, and deviation `0.003`. Confidence half-width uses `1.96 sigma/sqrt(n)` and decreases as the run grows.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (LLN model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0479 / lesson 516 Distribution Calculator.
