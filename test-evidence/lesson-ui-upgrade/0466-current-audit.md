# Target 0466 / Lesson 503: Complement Rule

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0466-interactive-intermediate-advanced-probability-and-distributions-complement-rule-redesigned.png`

Route: `/lessons/data-and-probability/503-complement-rule`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Twelve-sided experiment | Dedicated event selector, highlighted die outcomes, editable observed counts, total, reroll, and reset | Browser interaction and visual comparison |
| Complement partition | Linked A/Aᶜ partition bar, counts, probabilities, and sum-to-one check | Pixel comparison at target viewport |
| Calculation challenge | Complement formula and hide-A/hide-complement challenge remain synchronized | Browser interaction and screenshot comparison |
| Learning/practice content | Key takeaway, misconception guard, and four practice cards are present | Content/spacing comparison |

## Mathematical Notes

The sample space is partitioned into A and Aᶜ. Counts satisfy `n(Aᶜ)=n(S)−n(A)` and probabilities satisfy `P(Aᶜ)=1−P(A)`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0467 / lesson 504 Addition Rule.
