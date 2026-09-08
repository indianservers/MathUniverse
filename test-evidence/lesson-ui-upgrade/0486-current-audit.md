# Target 0486 / Lesson 523: Hypergeometric Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0486-interactive-intermediate-advanced-probability-and-distributions-hypergeometric-distribution-redesigned.png`

Route: `/lessons/data-and-probability/523-hypergeometric-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Population controls | Bounded `N`, `K`, and `n` sliders preserve valid finite-population constraints | Browser pointer and keyboard validation |
| Sampling surface | Population jar, true without-replacement sample, current success count, manual draw, reset, and working auto-draw timer | Browser animation and visual comparison |
| Exact distribution | Valid support, normalized PMF/CDF table, clickable PMF bars, combinatorial substitution, moments, and selected result | Pixel comparison at target viewport |
| Simulation/comparison | Seeded repeated samples provide empirical history and moments alongside a calculated binomial approximation | Runtime and browser interaction validation |
| Knowledge check | Two independently selectable and checked questions use the actual default distribution | Browser interaction validation |

## Mathematical Notes

For `N=20`, `K=7`, `n=5`, and `x=3`, the correct values are `P(X=3)=0.17608`, `P(X<=3)=0.96930`, and `P(X>=3)=0.20679`. The target mockup shows a different PMF while labeling it with these parameters. The dedicated surface retains the stated parameters and derives every value from `C(K,x)C(N-K,n-x)/C(N,n)`.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (hypergeometric model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0487 / lesson 524 Poisson Distribution.
