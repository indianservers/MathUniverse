# Target 0522 / Lesson 337: Recursive Sequences

Status: dedicated implementation strengthened and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0522-interactive-intermediate-advanced-sequences-and-series-recursive-sequences-redesigned.png`

Route: `/lessons/advanced-mathematics/337-recursive-sequences`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Recurrence model | Dedicated affine/logistic parser, evaluator, rule formatter, term generator, fixed-point analysis, errors, and monotonicity | Browser numerical validation |
| Definition/presets | Editable custom relation plus real linear-growth, linear-decay, doubling, and logistic presets | Browser input and preset validation |
| Computation views | Dependency chain, substituted step evaluation, precision control, and functional reveal/compute controls | Browser interaction validation |
| Cobweb/time plots | Shared orbit drives both plots; draggable seed is clamped to the visible domain | Browser drag and pixel comparison |
| Behavior | Distinguishes convergence, divergence, constant sequences, period-two cycles, and bounded nonlinear orbits | Browser scenario validation |
| Data/export | Memoized table, fixed-point errors, rate summary, and working CSV export | Browser export validation |
| Navigation/check | Tabs scroll to actual sections; fixed target sixth-term check provides feedback | Browser navigation validation |

## Mathematical Notes

For `a1 = 2` and `a_n = 0.6a_(n-1) + 4`, the generated terms begin `2, 5.2, 7.12, 8.272, 8.9632, 9.37792`. The fixed point solves `L = 0.6L + 4`, giving `L = 10`; because `|0.6| < 1`, the absolute error contracts by a factor of `0.6` per step. These values agree with the target.

The strengthened model does not collapse all other rules into a generic nonlinear/divergent label. It recognises affine divergence and period-two behavior and analyzes logistic presets from a longer probe orbit.

## Checks Executed

- Vitest: `7 tests passed across 3 files` (dedicated recurrence model, target surface, complete sequence adapter routing).
- Target orbit, fixed point, convergence, affine divergence, affine/logistic cycles, and invalid parsing covered by focused tests.
- Targeted TypeScript scan: no errors in the recurrence model, surface, or adapter.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0523 / lesson 338 Fibonacci Sequence.
