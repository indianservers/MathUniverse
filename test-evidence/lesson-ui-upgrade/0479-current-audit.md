# Target 0479 / Lesson 516: Distribution Calculator

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0479-interactive-intermediate-advanced-probability-and-distributions-distribution-calculator-redesigned.png`

Route: `/lessons/data-and-probability/516-distribution-calculator`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Distribution controls | Dedicated normal, binomial, and exponential models with real parameter steppers and inputs | Browser interaction and visual comparison |
| Interval queries | Between, left-tail, and right-tail modes with editable bounds and normal symmetric-interval option | Keyboard/pointer validation |
| Linked PDF/CDF | Generated density/CDF paths, interval markers, shaded area, optional grid, and independent visibility toggles | Pixel comparison at target viewport |
| Exact result | Probability, CDF bounds, z-scores, percentage, substitution, and distribution summary derive from the current query | Browser rendering comparison |
| Knowledge check | Two real multiple-choice normal-probability questions with independent checked feedback | Content and spacing comparison |

## Mathematical Notes

For the default `N(50,10^2)` distribution, bounds 40 and 60 standardize to -1 and 1. The calculator gives `Phi(1)-Phi(-1)=0.8413-0.1587=0.6827`. Tail calculations and additional distribution CDFs are handled by the same query API.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (distribution model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0480 / lesson 517 Probability Plot.
