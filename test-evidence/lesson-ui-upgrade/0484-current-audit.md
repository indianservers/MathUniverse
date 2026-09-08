# Target 0484 / Lesson 521: Bernoulli Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0484-interactive-intermediate-advanced-probability-and-distributions-bernoulli-distribution-redesigned.png`

Route: `/lessons/data-and-probability/521-bernoulli-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Bernoulli parameter | Live probability slider recalculates failure/success PMF, table, mean, variance, graph, and simulation | Browser slider and visual comparison |
| Single trial | Real random Bernoulli flip using current `p`, visible outcome state, and independent reset | Browser interaction validation |
| Repeated trials | Seeded reproducible simulation supports 10 through 50,000 trials and reports counts and empirical probabilities | Runtime performance and visual comparison |
| PMF and moments | Two-bar PMF, normalized table, `E[X]=p`, and `Var(X)=p(1-p)` all derive from one model | Pixel comparison at target viewport |
| Knowledge check | Selectable probability/variance question with checked feedback | Browser interaction validation |

## Mathematical Notes

At the target default `p=0.65`, `P(X=0)=0.35`, `E[X]=0.65`, and `Var(X)=0.65(0.35)=0.2275`. Every seeded simulation run preserves successes plus failures equal to the selected trial count.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (Bernoulli model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0485 / lesson 522 Binomial Distribution.
