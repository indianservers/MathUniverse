# Target 0513 / Lesson 550: Chi-Square Independence

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0513-interactive-advanced-inferential-statistics-chi-square-independence-redesigned.png`

Route: `/lessons/data-and-probability/550-chi-square-independence`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Contingency-table model | Dedicated row/column totals, expected counts, standardized residuals, contributions, chi-square statistic, df, p-value, and Cramer's V | Cross-browser numerical validation |
| Editable dataset | All eight observed cells are real inputs; totals and inference update immediately; reset and recalculate are functional | Browser input validation |
| Analysis views | Observed, expected, residual, and contribution view controls plus row highlighting and residual heatmap | Browser view switching and pixel comparison |
| Summary/guidance | Live hypothesis, expected-count example, statistic, df, right-tail p-value, conditions, and association conclusion | Browser rendering comparison |
| Quick check | Selectable conclusion question driven by the current computed result | Browser interaction validation |

## Mathematical Notes

The target's visible cells total `260` (`155 + 105`), not the displayed grand total `200`. Using the visible cells produces `E11 = 47.6923`, `chi-square = 0.8321`, `df = 3`, and `p approximately 0.8418`, so the correct conclusion is to fail to reject independence. The target's `E11 = 62`, `chi-square = 16.50`, and `p = 0.000875` rely on an incompatible grand total. The implementation preserves the visible table and target structure while calculating all downstream values from the actual cells.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (independence model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0514 / lesson 551 Variance Tests.
