# Target 0493 / Lesson 530: Chi-Square Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0493-interactive-intermediate-advanced-probability-and-distributions-chi-square-distribution-redesigned.png`

Route: `/lessons/data-and-probability/530-chi-square-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Numerical distribution | Dedicated regularized-gamma CDF, density, and bisected quantile model | Cross-browser numerical and rendering validation |
| Controls and graph | Degrees-of-freedom and alpha controls, PDF/CDF toggle, generated curve, right-tail shading, and draggable critical marker | Browser pointer and keyboard validation |
| Critical-value table | Live five-by-five upper-tail table with selectable cells and real CSV export | Download and browser rendering validation |
| Goodness of fit | Six editable observed counts, derived expected counts and contributions, statistic, critical value, p-value, and decision | Browser input validation |
| Knowledge check | Three independently selectable and checked questions | Browser interaction validation |

## Mathematical Notes

For `df=6` and right-tail `alpha=0.05`, the model gives a critical value of `12.592`. The die example gives statistic `3.700`, `df=5`, and exact upper-tail probability `0.593364`, displayed correctly as `0.593` to three decimal places.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (Chi-Square model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0494 / lesson 531 F Distribution.
