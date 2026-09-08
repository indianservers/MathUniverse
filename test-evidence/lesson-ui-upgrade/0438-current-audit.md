# Target 0438 / Lesson 475: Quartiles and IQR

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0438-interactive-intermediate-advanced-statistics-and-regression-quartiles-and-iqr-redesigned.png`

Route: `/lessons/data-and-probability/475-quartiles-and-iqr`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Ordered dataset | Shared generic statistics controls | Nine editable data values with linked ordering and reset/random data | Browser editing and screenshot comparison |
| Box plot | Generic statistics visual | Dedicated min/Q1/median/Q3/max display with highlighted summary cards | Browser visual comparison |
| IQR and fences | Generic summary | Live IQR, 1.5×IQR lower/upper fences and range comparison | Browser interaction |
| Teaching content | Shared generic prose | Quartile rules, middle-50% explanation, outlier fences and misconception guard | Full-page visual comparison |
| Practice | Shared generic exercise | Real IQR answer validation for the target set | Browser answer flow |

## Mathematical Note

The target labels Q1=4 and Q3=8 for `[2,3,4,4,5,6,7,8,10]`. Using the standard median-of-halves method gives Q1=3.5 and Q3=7.5, while IQR remains 4. The model uses the standard method and calculates fences -2.5 and 13.5 accordingly.

## Checks Executed

- Vitest: `quartilesLessonModel.test.ts`, `QuartilesLesson475.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover five-number summary, IQR/fences, empty data, exact answer validation, dedicated routing and absence of generic controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0439 / lesson 476, Variance and Standard Deviation.
