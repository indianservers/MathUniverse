# Target 0481 / Lesson 518: Cumulative Distribution

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0481-interactive-intermediate-advanced-probability-and-distributions-cumulative-distribution-redesigned.png`

Route: `/lessons/data-and-probability/518-cumulative-distribution`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Continuous CDF lab | Dedicated `f(x)=x/2` and `F(x)=x^2/4` object model on `[0,2]` | Browser interaction and visual comparison |
| Linked graphs | Native SVG density/area and cumulative plots share a pointer-draggable marker and range control | Pointer and touch validation |
| Discrete mode | Functional probability-mass dataset, cumulative sums, graph points, and worked values | Browser toggle and visual comparison |
| Definition and values | Live probability value, six-row continuous table, endpoint behavior, and CDF properties | Content and spacing comparison |
| Knowledge check | Two selectable questions with independent checking and calculated score | Browser interaction validation |

## Mathematical Notes

For the target example, `f(1.4)=0.7` and `F(1.4)=1.4^2/4=0.49`. The model clamps the domain to `[0,2]`, preserves CDF bounds, and independently accumulates the discrete mode's masses to 1.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (CDF model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- Git diff whitespace check: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0482 / lesson 519 Interval / Tail Probability.
