# Target 0482 / Lesson 519: Interval / Tail Probability

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0482-interactive-intermediate-advanced-probability-and-distributions-interval-tail-probability-redesigned.png`

Route: `/lessons/data-and-probability/519-interval-tail-probability`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Four probability modes | Left tail, right tail, between, and outside use a dedicated normal-interval model | Browser mode interaction and visual comparison |
| Distribution controls | Editable mean, positive standard deviation, lower/upper bounds, two range handles, and sigma/IQR presets | Pointer and keyboard validation |
| Normal curve | Generated SVG density curve, selected-region shading, and live boundary markers | Pixel comparison at target viewport |
| Exact results | Live interval/tail metrics, z-scores, CDF values, and complement verification | Browser rendering comparison |
| Knowledge check | Selectable normal-probability question with checked feedback | Browser interaction validation |

## Mathematical Notes

For the target bounds `a=-1` and `b=1.5` under `N(0,1)`, the calculated interval probability is `0.77454`, using full-precision normal CDF values. The mockup shows `0.77449`; that does not equal either the full-precision result or its displayed rounded-table subtraction, so the interactive result remains mathematically correct.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (interval model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- The final low-concurrency render test took about 148 seconds to initialize while unrelated Node/Vite work was active on the machine.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0483 / lesson 520 Inverse Probability.
