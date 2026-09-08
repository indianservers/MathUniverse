# Target 0442 / Lesson 479: Outliers

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0442-interactive-intermediate-advanced-statistics-and-regression-outliers-redesigned.png`

Route: `/lessons/data-and-probability/479-outliers`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Dataset | Generic statistics values | Editable custom dataset with include/remove flagged modes | Browser editing and screenshot comparison |
| Dot/box view | Generic chart | Dedicated dot plot and box/fence view linked to IQR | Browser visual comparison |
| Fence rule | Generic summary | 1.5×IQR lower/upper fences and calculated flagged list | Browser edge cases |
| Summary comparison | Missing | All-points versus outliers-removed mean/SD comparison | Browser toggle flow |
| Teaching content | Shared generic prose | Outlier context warning, worked example and practice | Full-page visual comparison |
| Practice | Shared generic exercise | Real comma-separated outlier answer validation | Browser answer flow |

## Mathematical Note

The target’s displayed fence labels and claimed flagged values are not consistent with its displayed dataset under the standard 1.5×IQR rule. The implementation follows the standard rule and reports the calculated result, avoiding false flags.

## Checks Executed

- Vitest: `outliersLessonModel.test.ts`, `OutliersLesson479.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover fence calculation, empty data, sorted answer validation, dedicated routing and absence of the old generic surface.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0443 / lesson 480, Box Plot.
