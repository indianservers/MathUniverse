# Target 0477 / Lesson 514: Simulation

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0477-interactive-intermediate-advanced-probability-and-distributions-simulation-redesigned.png`

Route: `/lessons/data-and-probability/514-simulation`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Experiment controls | Real coin, die, and spinner models with event, batch-size, run-count, animation, and theory-line controls | Browser interaction and visual comparison |
| Simulation transport | Start, pause, and step update actual trial progress; restarting creates a new seeded sample | Timer, pointer, and screenshot validation |
| Live outcomes and totals | Recent outcomes, per-outcome counts, empirical probabilities, progress, and theoretical values derive from sampled trials | Pixel comparison at target viewport |
| Convergence chart | Selected and complement probability paths plus optional theoretical line use the current run history | Browser rendering comparison |
| Try it yourself | Independent batch/runs selectors execute a real fair-coin simulation and assess convergence | Keyboard/pointer validation |

## Mathematical Notes

Each experiment has its own finite sample space and exact theoretical event probability. The seeded sampler creates reproducible evidence while rerunning increments the seed. Experimental probabilities, complements, and convergence points all derive from the same sampled sequence.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (simulation model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0478 / lesson 515 Law of Large Numbers.
