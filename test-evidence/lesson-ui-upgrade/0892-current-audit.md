# Lesson 0892: Variance

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0892-school-class-12-probability-variance-redesigned.png`.
Catalog ID: 10218. Route: `/lessons/school/class-12/class-12-probability-variance`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Distribution controls | A/B presets, spread slider, weighted/equal/point probability modes and reset | Extra normalized modes extend the reference default; precise styling unverified |
| Probability plot | Symmetric outer values, pointer and keyboard drag handlers, mean and distance annotations | Real browser drag execution and marker placement remain unverified |
| Calculation rows | Live probabilities, deviations, squared distances, square areas and weighted contribution bars | Decorative reference arrows are not reproduced; precise geometry unverified |
| Results | Variance, standard deviation, second moment and both variance methods computed from active distribution | Formatting and exact panel sizing require screenshot comparison |
| Distribution comparison | A and B plots share the active probability mode and fixed mean | Zero-probability mode correctly explains why outer-value movement leaves variance unchanged |
| Worked example and practice | Mean, variance and standard deviation answers checked numerically; empty answers rejected | Browser feedback execution remains unverified |
| Navigation and responsive layout | Section navigation, adjacent lesson links and responsive constraints | No screenshot-based overlap or shell/footer parity checks performed |

## Verification

- Five focused Vitest tests passed: four model tests and one initial-markup test.
- Model tests cover 303 spread/mode combinations, fixed mean, agreement between variance methods, standard deviation, point masses and drag clamping.
- Targeted strict TypeScript and focused ESLint checks passed.
- No authentic browser screenshots, pixel-difference acceptance, responsive overlap verification or real browser interaction tests were performed. These are required before full acceptance.

Next sequential lesson: 0893 / 10219 Bernoulli Trials. Earlier aggregate completion counts have not been re-audited here.
