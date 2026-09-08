# Target 0469 / Lesson 506: Independent Events

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0469-interactive-intermediate-advanced-probability-and-distributions-independent-events-redesigned.png`

Route: `/lessons/data-and-probability/506-independent-events`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Spinner and coin experiment | Dedicated reproducible trial simulation, live run/pause, trial and speed controls, reset, and independent/dependent modes | Browser interaction and visual comparison |
| Joint outcomes | Six-cell count/probability tables, row and column totals, empirical marginal probabilities, and complete sample space | Pixel comparison at target viewport |
| Independence verdict | Linked `P(A)P(B)` and `P(A intersection B)` values, numerical difference, and threshold verdict | Browser interaction and screenshot comparison |
| Dependency controls | Three normalized spinner-weight sliders and a coin-dependence toggle alter the joint and conditional distributions | Pointer/keyboard interaction validation |
| Practice | Three independent Yes/No exercises with individual checks and reveal-all solutions | Content, feedback, and spacing comparison |

## Mathematical Notes

The independence verdict compares the empirical joint probability for Blue and Heads with the product of their empirical marginal probabilities. Dependent mode changes `P(H | color)` by spinner color while retaining valid complementary outcome probabilities and a total count equal to the requested trials.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0470 / lesson 507 Mutually Exclusive Events.
