# Target 0434 / Lesson 471: Median

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0434-interactive-intermediate-advanced-statistics-and-regression-median-redesigned.png`

Route: `/lessons/data-and-probability/471-median`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Unsorted data | Shared generic numeric controls | Seven editable values with shuffle/reset and live metric snapshot | Browser editing and screenshot comparison |
| Sorted centre finder | Generic statistics visual | Ordered values, highlighted median position and odd/even formula | Browser visual comparison |
| Even-number case | No dedicated paired-middle state | Six editable values with two highlighted middle positions and average | Browser interaction |
| Outlier comparison | Generic summary prose | Typical set versus 100-outlier comparison with median/mean values | Full-page visual comparison |
| Explanation | Shared adapter copy | Positional definition, odd/even rules and outlier misconception guard | Full-page visual comparison |
| Practice | Generic shared controls | Real numeric answer and validation for the target five-value set | Browser answer flow |
| Reset | Shared numeric reset | Restores odd/even datasets, practice and result state | Browser outer reset integration |

## Mathematical Notes

- The default values `[8,1,7,3,9,5,2]` sort to `[1,2,3,5,7,8,9]`, giving median 5.
- The even example `[1,3,5,7,8,2]` sorts to `[1,2,3,5,7,8]`, giving `(3+5)/2 = 4`.
- The practice set `11,4,9,7,3` sorts to `3,4,7,9,11`, giving median 7.

## Checks Executed

- Vitest: `medianLessonModel.test.ts`, `MedianLesson471.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover sorting, odd/even medians, empty data, answer tolerance, dedicated routing and absence of generic controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0435 / lesson 472, Mode.
