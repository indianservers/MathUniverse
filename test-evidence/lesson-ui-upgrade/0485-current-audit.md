# Target 0485 / Lesson 522: Binomial Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0485-interactive-intermediate-advanced-probability-and-distributions-binomial-distribution-redesigned.png`

Route: `/lessons/data-and-probability/522-binomial-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Experiment controls | Live `n` and `p` sliders plus exact/range event selection and bounded integer steppers | Browser pointer and keyboard validation |
| PMF visualization | Clickable generated PMF bars highlight the selected `k` and recalculate with every parameter change | Pixel comparison at target viewport |
| Probability calculations | Exact PMF, range sum, CDF, substitution, normalized table, mean, variance, and standard deviation share one model | Browser rendering comparison |
| Simulation | Seeded repeated-binomial engine provides empirical histogram, mean, variance, and total-variation distance | Runtime and browser interaction validation |
| Knowledge check | Three independently selectable and checked questions use mathematically correct target-state results | Browser interaction validation |

## Mathematical Notes

For `X ~ Bin(10,0.6)`, the correct values are `P(X=6)=0.25082`, `P(4<=X<=7)=0.77795`, and `P(X<=6)=0.61772`. The mockup instead displays `0.2001`, `0.5701`, and `0.4271`; its shown table also ends at a CDF below 1. The dedicated surface preserves the stated parameters and computes all values from the normalized binomial PMF.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (binomial model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0486 / lesson 523 Hypergeometric Distribution.
