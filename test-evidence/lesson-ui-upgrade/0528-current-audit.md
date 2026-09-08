# Target 0528 / Lesson 343: Power Series

Status: dedicated implementation strengthened and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0528-interactive-intermediate-advanced-sequences-and-series-power-series-redesigned.png`

Route: `/lessons/advanced-mathematics/343-power-series`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Power-series model | Dedicated model owns Taylor coefficients, manual coefficients, polynomial evaluation, graph sampling, approximation error, radius estimate, interval, recognition, and expanded form | Browser numerical validation |
| Coefficient editor | Preset/manual segmented control, center stepper, fraction-aware coefficient fields, and add-term command update the same model | Browser keyboard/control validation |
| Function approximation | Target selector supports cosine, sine, exponential, and geometric rational functions; truncation degree and x-range regenerate both curves | Browser graph and pixel comparison |
| Drag interaction | Graph handle changes the highest active coefficient by solving for the required value at the dragged sample point | Browser drag validation |
| Convergence analysis | Recognized entire functions report infinite radius; `1/(1-x)` uses distance to its singularity; custom coefficients use a Cauchy-Hadamard root estimate | Browser interval/layout comparison |
| Endpoint/current sum | Endpoint guidance and current expanded polynomial are generated from active target, center, coefficients, and degree | Browser content validation |
| Commands/navigation | English/Hindi selector, reset, share, workspace, tabs, and fullscreen state are functional | Browser API/navigation validation |
| Practice | Two real radius-of-convergence questions with grading and challenge progression | Browser click validation |

## Mathematical Notes

The target default is the degree-8 Maclaurin approximation to cosine. Its coefficients are `1, 0, -1/2, 0, 1/24, 0, -1/720, 0, 1/40320`; it is recognized as `cos x`, has radius `R = infinity`, and interval `(-infinity, infinity)`. Signed floating-point zero is normalized so serialized coefficients remain stable.

For the preset expansion of `1/(1-x)` about center `c`, the nearest singularity is at `x = 1`, so the model reports `R = abs(1-c)`. Invalid fractions such as `1/0` and nonnumeric coefficient edits are rejected rather than silently becoming zero.

## Checks Executed

- Vitest: `8 tests passed across 3 files` after correcting signed-zero normalization (dedicated power-series model, target surface, complete sequence adapter routing).
- Target cosine coefficients, recognition, infinite radius, interval, polynomial evaluation, geometric radius, and safe coefficient parsing covered by focused tests.
- Targeted TypeScript scan: no errors in the power-series model, surface, or adapter.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0529 / lesson 344 Taylor and Maclaurin Series.
