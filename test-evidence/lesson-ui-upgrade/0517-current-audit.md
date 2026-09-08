# Target 0517 / Lesson 554: Type I and Type II Errors

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0517-interactive-advanced-inferential-statistics-type-i-and-type-ii-errors-redesigned.png`

Route: `/lessons/data-and-probability/554-type-i-and-type-ii-errors`

| Target element | Current implementation | Remaining validation |
| --- | --- | --- |
| Hypothesis scenario | Editable null mean, alternative mean, population standard deviation, sample size, and right-tail critical cutoff | Browser input validation |
| Distribution view | Dedicated overlapping null and alternative normal curves with a draggable cutoff and live alpha/beta annotations | Browser drag and pixel comparison |
| Error probabilities | Live standard error, noncentrality, alpha, beta, power, and correct-null probability | Cross-browser numerical validation |
| Decision matrix | Four outcomes recomputed from current alpha and beta | Browser layout comparison |
| Context/guidance | Factory-fill consequences, guided substitution, tradeoff insight, and misconception warning | Browser layout comparison |
| Try/quiz | Alternative-mean slider updates power; concept check gives immediate feedback | Browser interaction validation |

## Mathematical Notes

With `mu0 = 50`, `mu1 = 54`, `sigma = 10`, and `n = 36`, the standard error is `1.6667` and the noncentral shift is `delta = 2.40`. At the target cutoff `c = 1.645`, alpha is approximately `0.0500`, while `beta = Phi(1.645 - 2.40) = 0.2251` and power is `0.7749`.

The target displays beta `0.1995` and power `0.8005`; those values are inconsistent with its labeled parameters and formulas. The implementation preserves the target scenario and structure while deriving every probability from the editable values.

## Checks Executed

- Vitest: `4 tests passed across 3 files` (error model, dedicated surface, adapter routing).
- Default scenario and monotonic power response covered by focused model tests.
- Targeted TypeScript scan: no errors in the error model, surface, or adapter.
- ESLint passed.
- No full application build, actual browser interaction, screenshot capture, or pixel comparison performed in this pass.

Next sequential candidate: target 0518 / lesson 555 Power of a Test.
