# Target 0498 / Lesson 535: Standardisation

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0498-interactive-intermediate-advanced-probability-and-distributions-standardisation-redesigned.png`

Route: `/lessons/data-and-probability/535-standardisation`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Transformation model | Dedicated standardise/reverse functions, normal CDF percentile, upper tail, and inverse-CDF mapping table | Cross-browser numerical validation |
| Controls | Live mean, positive standard deviation, and observation sliders with full reset | Browser input validation |
| Paired graphs | Generated raw and standard bell curves, synchronized markers, and direct raw-marker dragging | Browser drag and pixel comparison |
| Preserved area/table | Live equivalent probabilities, percentile ring, and six reversible mapping rows | Browser rendering comparison |
| Walkthrough/checks | Working animation toggle and four independently selectable checks | Browser interaction validation |

## Mathematical Notes

For `mu=50`, `sigma=10`, and `x=65`, the model gives `z=1.50`, percentile `0.93319`, and upper tail `0.06681`. The mapping reverses exactly to `x=65`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (standardisation model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0499 / lesson 536 Distribution Simulation.
