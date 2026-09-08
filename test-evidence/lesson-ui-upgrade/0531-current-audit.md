# Target 0531 / Lesson 346: Recurrence Modelling

Status: dedicated implementation strengthened and focused code tests passed. Browser interaction and screenshot acceptance remain pending after the current changes. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0531-interactive-intermediate-advanced-sequences-and-series-recurrence-modelling-redesigned.png`

Route: `/lessons/advanced-mathematics/346-recurrence-modelling`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Affine recurrence model | Dedicated model independently iterates `P(n+1)=rP(n)+k`, calculates its closed form, changes, equilibrium, stability, and graph domain | Browser numerical validation |
| Scenarios | City population, savings, bacteria, and medication presets set meaningful parameters, units, and descriptions | Browser scenario validation |
| Parameters | Growth factor, scenario-specific additive input, initial state, units, and comparison index are functional | Browser control validation |
| Time-series graph | Model-derived line and points; dragging the initial point changes `P0`, pure geometric points solve for `r`, and affine points solve backward for `P0` | Browser drag and pixel comparison |
| Tables | Timeline and computed state/change tables share the iterated recurrence states | Browser table/layout comparison |
| Closed-form comparison | Recursive iteration and closed-form calculation are independent and compared at the selected index | Browser selector validation |
| Equilibrium/stability | Handles `r=1`, stable/unstable behavior, and oscillatory convergence or divergence | Browser content validation |
| Commands/navigation | English/Hindi selector, reset, share, workspace, tabs, and fullscreen state are functional | Browser API/navigation validation |
| Practice | Population-growth calculation and stability questions have real grading and progression | Browser click validation |

## Mathematical Notes

For the target city model `P0 = 50,000`, `r = 1.10`, and `k = 0`, independently iterated states end at `P10 = 129,687.123005`. The closed form `P10 = 50,000(1.1)^10` gives the same displayed value. The equilibrium is `E = 0`, but it is unstable because `abs(r) > 1`.

Iteration retains full internal precision and rounds only display values. This avoids accumulating a one-millionth drift in affine scenarios and makes the independent recursive/closed-form comparison meaningful. For `r = 1`, the model uses `Pn = P0 + nk`; for `r = 0`, inverse drag solving correctly reports that `P0` cannot be recovered from a later state.

## Checks Executed

- Vitest: `8 tests passed across 3 files` after correcting iterative precision (dedicated recurrence model, target surface, complete sequence adapter routing).
- Target population states, independent closed form, affine savings, `r=1`, stable medication equilibrium, drag inversion, and hostile-input bounds covered by focused tests.
- Targeted TypeScript scan: no errors in the recurrence model, surface, or adapter.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed after these changes.

Next pending target by uncovered-range reconciliation: target 0131 / lesson 39 Cartesian Graphing.
