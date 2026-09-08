# Target 0468 / Lesson 505: Multiplication Rule

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0468-interactive-intermediate-advanced-probability-and-distributions-multiplication-rule-redesigned.png`

Route: `/lessons/data-and-probability/505-multiplication-rule`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Sequential experiment builder | Dedicated stage-one die/coin and stage-two fair/biased coin selectors with independent/dependent model controls | Browser interaction and visual comparison |
| Experiment tree | Every stage-one and stage-two node selects a real path and updates the conditional and joint probability product | Pixel comparison at target viewport |
| Sample space and probability check | Complete ordered path list, path probability summary, and sum-to-one invariant | Browser interaction and screenshot comparison |
| Rule and misconception | General conditional rule, independent special case, selected-path substitution, and add-versus-multiply correction | Content and spacing comparison |
| Practice | Three independently working checks with calculated products and feedback | Browser keyboard/pointer validation |

## Mathematical Notes

For the default die-then-fair-coin experiment, all 12 paths have probability `1/6 x 1/2 = 1/12`. Dependent mode assigns a distinct `P(H | die)` to each first-stage outcome while preserving complementary second-stage probabilities and a total path probability of 1.

## Checks Executed

- Vitest: `6 tests passed across 3 files` (model, dedicated surface, adapter routing), using the single-thread pool after a transient default worker startup timeout.
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0469 / lesson 506 Independent Events.
