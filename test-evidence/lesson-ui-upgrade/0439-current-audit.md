# Target 0439 / Lesson 476: Variance and Standard Deviation

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0439-interactive-intermediate-advanced-statistics-and-regression-variance-and-standard-deviation-redesigned.png`

Route: `/lessons/data-and-probability/476-variance-and-standard-deviation`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Sample/population | Generic statistics kind | Real sample `(n−1)` and population `N` toggle changes variance and SD | Browser toggle and screenshot comparison |
| Deviation view | Generic chart | Dedicated mean/deviation dot plot and squared-deviation bars from editable values | Browser visual comparison |
| Controls | Generic stats sliders | Shift, spread, randomise and editable data controls | Browser interaction |
| Results | Shared summary | Mean, variance, standard deviation and spread comparison linked to current dataset | Browser value verification |
| Explanations | Generic statistics copy | Squaring rationale, sample/population misconception and formulas | Full-page visual comparison |
| Practice | Shared generic exercise | Real sample-variance answer validation | Browser answer flow |

## Mathematical Notes

- The default sample data is `[2,3,4,4,5,6,7,8,10]`, with mean 5.44, sample variance approximately 6.53 and sample SD approximately 2.55.
- Population mode divides by N and therefore reports a smaller variance/SD for the same values.
- A single-value sample has no defined sample variance; the model returns null instead of dividing by zero.

## Checks Executed

- Vitest: `varianceLessonModel.test.ts`, `VarianceLesson476.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover sample/population calculations, square-root SD, empty/insufficient data, practice validation and dedicated routing.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0440 / lesson 477, Percentiles.
