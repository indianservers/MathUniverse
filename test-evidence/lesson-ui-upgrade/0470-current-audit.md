# Target 0470 / Lesson 507: Mutually Exclusive Events

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0470-interactive-intermediate-advanced-probability-and-distributions-mutually-exclusive-events-redesigned.png`

Route: `/lessons/data-and-probability/507-mutually-exclusive-events`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Draggable event sets | Dedicated ellipse geometry with pointer dragging and native card drop for A, B, A-complement, and B-complement | Browser pointer/touch interaction and visual comparison |
| Sample-space model | Twelve positioned outcomes derive A, B, intersection, union, and complement highlighting from the current ellipse positions | Pixel comparison at target viewport |
| Exclusivity summary | Live Yes/No verdict, intersection meter, event sizes, probabilities, and inclusion-exclusion calculation | Browser interaction and screenshot comparison |
| Overlap comparison | Disjoint and overlapping diagrams show the two applicable union formulas | Content and spacing comparison |
| Practice | Three real radio-choice tasks with checked correctness feedback | Keyboard/pointer validation |

## Mathematical Notes

The default event ellipses contain `A = {1,5,9}` and `B = {4,8,12}`. Their intersection is empty and `P(A union B) = 6/12 = 1/2`. Dragging either ellipse changes membership using an ellipse containment test and automatically switches to the general inclusion-exclusion rule when overlap occurs.

## Checks Executed

- Vitest: `5 tests passed across 3 files` (geometry model, dedicated surface, adapter routing).
- Strict targeted TypeScript check: passed.
- ESLint on the dedicated component, model, tests, and probability adapter: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0471 / lesson 508 Conditional Probability.
