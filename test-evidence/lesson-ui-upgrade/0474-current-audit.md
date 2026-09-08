# Target 0474 / Lesson 511: Two-Way Tables

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0474-interactive-intermediate-advanced-probability-and-distributions-two-way-tables-redesigned.png`

Route: `/lessons/data-and-probability/511-two-way-tables`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Editable 2 by 2 table | Four sanitized whole-number inputs with automatic row, column, and grand totals | Browser interaction and visual comparison |
| Conditional focus | Real condition selector highlights the applicable joint cell and row denominator | Pixel comparison at target viewport |
| Probability summary | Joint, marginal, conditional, and complement values derive from current counts | Browser interaction and screenshot comparison |
| Independence check | Compares the current empirical joint probability with the product of marginals and updates the verdict | Content and spacing comparison |
| Practice | Three editable numerical/fraction answers with actual parsed correctness checks | Keyboard/pointer validation |

## Mathematical Notes

The target default counts are `RR=3`, `RB=3`, `BR=2`, and `BB=2`, giving row totals 6 and 4, column totals 5 and 5, and grand total 10. Thus `P(R,B)=3/10=0.30`, `P(Blue|First Red)=3/6=0.50`, and the displayed independence equality holds exactly.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (table model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0475 / lesson 512 Bayes' Theorem.
