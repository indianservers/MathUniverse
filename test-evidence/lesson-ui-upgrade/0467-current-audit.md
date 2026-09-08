# Target 0467 / Lesson 504: Addition Rule

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0467-interactive-intermediate-advanced-probability-and-distributions-addition-rule-redesigned.png`

Route: `/lessons/data-and-probability/504-addition-rule`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Two-dice event experiment | Dedicated 36-outcome model for A: sum is 7 and B: first die is 4, with clickable event cards and a mutually-exclusive mode | Browser interaction and visual comparison |
| Venn and sample-space views | Linked Venn counts, 6 by 6 ordered-pair grid, region highlighting, and A-only/intersection/B-only/neither legend | Pixel comparison at target viewport |
| Live calculation | Counts and probabilities remain synchronized with `6 + 6 - 1 = 11`, `P(A union B) = 11/36`, and the double-count warning | Browser interaction and screenshot comparison |
| Learning and worked example | Addition Rule formula, notation guide, worked counts, common-error guidance, and result are present | Content and spacing comparison |
| Quick practice | Real radio selection, answer checking, correction feedback, and mathematical explanation | Browser keyboard/pointer validation |

## Mathematical Notes

The default events have 6 outcomes each and one shared outcome, `(4, 3)`. Inclusion-exclusion therefore gives `|A union B| = 6 + 6 - 1 = 11`. Mutually-exclusive mode changes B to “sum is 2,” producing zero overlap and a seven-outcome union.

## Checks Executed

- Vitest: `6 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0468 / lesson 505 Multiplication Rule.
