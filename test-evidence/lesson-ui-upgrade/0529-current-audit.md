# Target 0529 / Lesson 344: Taylor and Maclaurin Series

Status: dedicated implementation strengthened and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0529-interactive-intermediate-advanced-sequences-and-series-taylor-and-maclaurin-series-redesigned.png`

Route: `/lessons/advanced-mathematics/344-taylor-and-maclaurin-series`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Taylor model | Dedicated model owns five function families, derivatives, coefficients, polynomial evaluation, samples, remainder, order errors, and expanded form | Browser numerical validation |
| Function controls | Working function selector, center, order, interval, alternate-center slider, and synchronized number/range inputs | Browser control validation |
| Approximation graph | Function and Taylor curves share model samples; the center point is horizontally draggable and recalculates coefficients | Browser drag and pixel comparison |
| Animation | Real pause, play, step, and speed controls cycle through polynomial orders | Browser timing validation |
| Series builder | Derivative table, evaluated derivatives, coefficients, terms, and fraction-form expanded polynomial are model-derived | Browser table/layout comparison |
| Error/convergence | Remainder graph, exact sampled maximum error, and per-order error bars regenerate with function, center, interval, and order | Browser graph comparison |
| Commands/navigation | English/Hindi selector, reset commands, share, tabs, and fullscreen state are functional | Browser API/navigation validation |
| Practice | Two real Maclaurin questions with grading and next-question progression | Browser click validation |

## Mathematical Notes

For the target default `f(x) = e^x`, `a = 0`, and order `4`, the coefficients are `1, 1, 1/2, 1/6, 1/24`, producing `T4(x) = 1 + x + x^2/2 + x^3/6 + x^4/24`. The model formats the recognized reciprocal coefficients as fractions rather than decimal approximations.

The target mockup prints a maximum error of `1.304` on `[-3,3]`. Direct evaluation gives the largest endpoint error at `x = 3`: `e^3 - T4(3) = e^3 - 16.375`, approximately `3.71054`. The implementation intentionally displays the calculated value. This is a known mathematical content difference from the target.

Invalid Taylor centers at the singularities of `ln(1+x)` and `1/(1-x)`, as well as reversed intervals, produce an invalid analysis state instead of undefined coefficients or broken graph coordinates.

## Checks Executed

- Vitest: `8 tests passed across 3 files` after aligning the fraction-form assertion (dedicated Taylor/Maclaurin model, target surface, complete sequence adapter routing).
- Target coefficients, expanded polynomial, actual maximum error, nonzero-center evaluation, trigonometric derivatives, singular centers, invalid intervals, and order bounding covered by focused tests.
- Targeted TypeScript scan: no errors in the Taylor model, surface, or adapter.
- ESLint and Git diff whitespace checks: passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0530 / lesson 345 Binomial Series.
