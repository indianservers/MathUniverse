# Target 0515 / Lesson 552: ANOVA

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0515-interactive-advanced-inferential-statistics-anova-redesigned.png`

Route: `/lessons/data-and-probability/552-anova`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Group data | Three independently editable six-value groups, visible group means, grand mean, presets, deterministic random groups, and reset | Browser input and preset validation |
| Group plots | Dedicated interactive strip plot with draggable observations and dynamically calculated box plots | Browser drag and pixel comparison |
| Variation split | Live SSB, SSW, SST, degrees of freedom, mean squares, F statistic, p-value, and eta-squared | Cross-browser numerical display validation |
| F distribution | Dedicated F density using current degrees of freedom, observed-statistic marker, and alpha-dependent critical marker | Browser layout and visual comparison |
| Post-hoc results | Multiplicity-adjusted pair comparisons using pooled ANOVA residual variance and Bonferroni-adjusted p-values | Browser interaction validation |
| Guidance/check | Dynamic decision, effect-size interpretation, assumptions, pitfall guidance, and selectable concept check | Browser interaction validation |

## Mathematical Notes

The visible target groups are `A = [8, 7, 6, 10, 8, 9]`, `B = [12, 13, 11, 14, 12, 13]`, and `C = [16, 17, 15, 18, 17, 16]`. Their means are `8.00`, `12.50`, and `16.50`, and the grand mean is `12.3333`.

For those values, the correct decomposition is `SSB = 217`, `SSW = 21`, and `SST = 238`; with degrees of freedom `(2, 15)`, `MSB = 108.5`, `MSW = 1.4`, and `F = 77.5`. The target instead displays `SSB = 216.33`, `SSW = 31`, `SST = 247.33`, and `F = 54.08`, which are inconsistent with its visible observations. The implementation preserves the target inputs and structure while calculating all statistics from the actual data.

The target labels its pairwise section as Tukey HSD. This implementation uses explicitly labeled Bonferroni-adjusted t comparisons because it computes that correction exactly and does not present a different method under a false label.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (ANOVA model, dedicated surface, adapter routing).
- Default-data decomposition and deterministic randomization covered by focused model tests.
- Targeted TypeScript scan: no errors in the ANOVA model, surface, or adapter.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0516 / lesson 553 p-Value Visualiser.
