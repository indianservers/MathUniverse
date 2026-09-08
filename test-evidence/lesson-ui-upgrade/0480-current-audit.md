# Target 0480 / Lesson 517: Probability Plot

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0480-interactive-intermediate-advanced-probability-and-distributions-probability-plot-redesigned.png`

Route: `/lessons/data-and-probability/517-probability-plot`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Editable sample | Twenty editable values, ascending/descending ordering, CSV import, generated samples, and CSV export | Browser file-dialog and keyboard validation |
| Q-Q plot | Distribution-specific theoretical quantiles, plotted observations, draggable reference line, numeric slope/intercept controls, and moment-line action | Pointer interaction and pixel comparison |
| Distribution model | Normal, logistic, and uniform quantile models recalculate all plotted points and fit statistics | Browser selector validation |
| Fit diagnostics | Live regression line, correlation, R-squared, RMSE, residual plot, and two-RMSE outlier highlighting | Browser rendering comparison |
| Theory and assessment | Blom plotting positions, current-data moments, interpretation guidance, and a working knowledge check | Content and spacing comparison |

## Mathematical Notes

The shown sample has mean `1.015`, correlation `0.991`, and R-squared `0.983` under the implemented Blom-position normal Q-Q regression. The mockup labels the same visible values with mean `0.860` and correlation `0.986`; those labels do not agree with the displayed dataset, so the interactive surface keeps the calculated values.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (Q-Q model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0481 / lesson 518 Cumulative Distribution.
