# Target 0471 / Lesson 508: Conditional Probability

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0471-interactive-intermediate-advanced-probability-and-distributions-conditional-probability-redesigned.png`

Route: `/lessons/data-and-probability/508-conditional-probability`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Event selectors | Dedicated numerator-event and condition-event models with three meaningful choices each | Browser interaction and visual comparison |
| Population grid | Complete 6 by 6 ordered-pair sample space with intersection, A-only, B-only, neither, and outside-B dimming | Pixel comparison at target viewport |
| Two-way table | Synchronized A/A-complement by B/B-complement counts with row, column, and grand totals | Browser interaction and screenshot comparison |
| Conditional calculation | Live `|A intersection B| / |B|`, percentage, complement within B, and denominator explanation | Content and spacing comparison |
| Self-check | Real four-option selection, answer checking, and corrective explanation | Keyboard/pointer validation |

## Mathematical Notes

For the default events, A is “sum is 7” and B is “first die is 1.” B contains six outcomes and only `(1,6)` lies in the intersection, so `P(A|B) = 1/6`. Every alternative selector pair derives its sets, contingency table, and conditional probability from the same 36 ordered pairs.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (event model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0472 / lesson 509 Tree Diagrams.
