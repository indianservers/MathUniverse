# Target 0483 / Lesson 520: Inverse Probability

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0483-interactive-intermediate-advanced-probability-and-distributions-inverse-probability-redesigned.png`

Route: `/lessons/data-and-probability/520-inverse-probability`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Quantile finder | Dedicated probability-to-quantile model with normal, logistic, and uniform location-scale distributions | Browser selector and visual comparison |
| Probability controls | Fine-grained probability slider, percentile presets, mean control, and positive spread control | Pointer and keyboard validation |
| Linked CDF/PDF | Generated SVG curves share the calculated cutoff; dragging the CDF marker updates the probability and both plots | Pointer/touch and pixel comparison |
| Result and verification | Quantile, standardized score, percentile, inverse notation, forward-CDF check, tail area, preset table, and summary table | Browser rendering comparison |
| Knowledge check | Selectable 97.5th-percentile question with calculated score and feedback | Browser interaction validation |

## Mathematical Notes

The default target probability `p=0.95` gives the standard-normal quantile `x=1.6449`, and the forward CDF check returns approximately `0.9500`. Quantile and CDF methods use the same distribution-specific model so dragging remains reversible.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (inverse model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0484 / lesson 521 Bernoulli Distribution.
