# Target 0437 / Lesson 474: Range

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0437-interactive-intermediate-advanced-statistics-and-regression-range-redesigned.png`

Route: `/lessons/data-and-probability/474-range`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Dataset | Generic statistics values and controls | Eight editable data values matching the target context | Browser editing and screenshot comparison |
| Spread visual | Generic chart | Dedicated number line with highlighted minimum and maximum | Browser visual comparison |
| Range calculation | Generic summary | Live max − min result and linked dataset count | Browser interaction |
| Outlier control | No range-specific behavior | Real toggle adds/removes value 20 and recalculates range | Browser toggle flow |
| Teaching content | Shared generic prose | Range rule, endpoint-only notice, outlier insight and misconception guard | Full-page visual comparison |
| Practice | Shared generic exercise | Real answer validation for `11,4,9,7,3` | Browser answer flow |

## Mathematical Notes

- Default data has min 2, max 10 and range 8.
- Adding outlier 20 changes the maximum and range; values between the endpoints do not change the range.
- Empty data returns a null range rather than producing an invalid number.

## Checks Executed

- Vitest: `rangeLessonModel.test.ts`, `RangeLesson474.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover endpoint calculations, order independence, empty data, exact answer validation, dedicated routing and absence of generic controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0438 / lesson 475, Quartiles and IQR.
