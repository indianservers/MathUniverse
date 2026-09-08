# Target 0440 / Lesson 477: Percentiles

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0440-interactive-intermediate-advanced-statistics-and-regression-percentiles-redesigned.png`

Route: `/lessons/data-and-probability/477-percentiles`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Ordered distribution | Shared generic statistics surface | Editable ordered values and percentile marker | Browser editing and screenshot comparison |
| Direct lookup | Generic controls | Percentile slider, rank calculation and interpolated value | Browser slider interaction |
| Inverse lookup | Missing | Editable value lookup with computed percentile rank | Browser input flow |
| Rules/content | Generic summary | Direct/inverse percentile definitions and interpolation explanation | Full-page visual comparison |
| Practice | Shared generic exercise | P30 value and percentile-rank answer checks | Browser answer flow |

## Mathematical Notes

- For the default ordered data `[2,3,4,4,5,6,7,8,10]`, the implemented rank rule is `r=(p/100)(n+1)`.
- P80 has rank 8 and value 8. The model interpolates fractional ranks between adjacent ordered observations.
- Empty data returns null rather than an invented percentile value.

## Checks Executed

- Vitest: `percentilesLessonModel.test.ts`, `PercentilesLesson477.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover direct interpolation, inverse lookup, empty data, answer validation, dedicated routing and absence of generic controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0441 / lesson 478, Z-Scores.
