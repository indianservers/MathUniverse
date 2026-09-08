# Target 0476 / Lesson 513: Expected Value

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0476-interactive-intermediate-advanced-probability-and-distributions-expected-value-redesigned.png`

Route: `/lessons/data-and-probability/513-expected-value`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Editable payoff distribution | Real payoff/probability inputs, calculated complements and contributions, add/delete rows, and dice preset | Browser interaction and visual comparison |
| Weighted balance | Contribution strip, movable expected-value marker, full weighted sum, and fairness verdict | Pixel comparison at target viewport |
| Long-run simulation | Reproducible weighted sampling for an editable trial count, rerun action, recent outcomes, running average, difference, and SVG convergence chart | Browser interaction and screenshot comparison |
| Learning guidance | Key takeaways and weighted-versus-unweighted misconception explanation | Content and spacing comparison |
| Practice | Real quick-check selection and expandable two-coin expected-value exercise | Keyboard/pointer validation |

## Mathematical Notes

The default eight-outcome payoff distribution has probabilities summing to 1 and weighted contributions summing to `₹35`. The simulation samples from the currently edited distribution and compares its running mean with the exact expected value.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (expected-value model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0477 / lesson 514 Simulation.
