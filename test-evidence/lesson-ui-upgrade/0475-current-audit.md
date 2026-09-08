# Target 0475 / Lesson 512: Bayes' Theorem

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0475-interactive-intermediate-advanced-probability-and-distributions-bayes-theorem-redesigned.png`

Route: `/lessons/data-and-probability/512-bayes-theorem`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Diagnostic experiment | Dedicated base-rate, sensitivity, and specificity controls with a linked population visualization | Browser interaction and visual comparison |
| Probability tree and table | Four path probabilities, confusion-matrix counts, margins, and population totals derive from one model | Pixel comparison at target viewport |
| Bayes calculation | Live formula substitution, posterior percentage, gauge, and interpretation | Browser interaction and screenshot comparison |
| Misconception | Expandable base-rate explanation distinguishes sensitivity from posterior probability | Content and spacing comparison |
| Practice | Three generated parameter scenarios with real answer selection and checked feedback | Keyboard/pointer validation |

## Mathematical Notes

The default parameters produce 90 true positives, 10 false negatives, 90 false positives, and 810 true negatives, so `P(D|+) = 90/180 = 0.50`. The target practice text claims 16.7% for a 5% base rate, 95% sensitivity, and 95% specificity; those values mathematically yield 50%, so the implementation uses the correct result rather than reproducing the mockup error.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (diagnostic model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0476 / lesson 513 Expected Value.
