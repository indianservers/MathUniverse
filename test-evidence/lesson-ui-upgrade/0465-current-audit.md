# Target 0465 / Lesson 502: Probability Scale

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0465-interactive-intermediate-advanced-probability-and-distributions-probability-scale-redesigned.png`

Route: `/lessons/data-and-probability/502-probability-scale`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Probability scale | Dedicated 0–1 scenario position controls with impossible/even/certain anchors and likelihood labels | Browser interaction and visual comparison |
| Experiment simulation | Adjustable trial count and actual Bernoulli simulation for all five scenarios | Pixel comparison at target viewport |
| Linked representations | Favorable/total counts, fraction, decimal, percent, and theoretical/simulated values remain synchronized | Browser interaction and screenshot comparison |
| Learning/practice content | Sample-space calculation, calibration challenge, misconception guard, and quick practice are present | Content/spacing comparison |

## Mathematical Notes

Theoretical probability is `n(E)/n(S)`. Simulated probability counts successes over independently generated trials and approaches the theoretical value as trials increase.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0466 / lesson 503 Complement Rule.
