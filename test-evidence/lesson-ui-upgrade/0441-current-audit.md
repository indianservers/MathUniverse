# Target 0441 / Lesson 478: Z-Scores

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0441-interactive-intermediate-advanced-statistics-and-regression-z-scores-redesigned.png`

Route: `/lessons/data-and-probability/478-z-scores`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Distribution view | Shared generic statistics visual | Dedicated normal-curve SVG with mean/value marker and percentile result | Browser visual comparison |
| Controls | Generic statistics controls | Editable mean, standard deviation, data point and z-position slider | Browser control flow |
| Standardization | Generic summary | Live `z=(x−μ)/σ` and normal-CDF percentile | Browser values |
| Learning content | Shared generic prose | Positive/negative z explanation, 68/95/99.7 rule and variance misconception guard | Full-page visual comparison |
| Practice | Shared generic exercise | Real z-score answer validation for μ=100, σ=15, x=118 | Browser answer flow |

## Mathematical Notes

- Default controls produce `z=(64−50)/10=1.40` and percentile approximately 91.92%.
- A non-positive standard deviation returns null instead of an invalid z-score.
- The practice value gives z=1.20; percentile interpretation is shown in the worked example.

## Checks Executed

- Vitest: `zScoresLessonModel.test.ts`, `ZScoresLesson478.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **4 tests passed across 3 files**.
- Tests cover standardization, normal percentile mapping, invalid spread, practice validation, dedicated routing and absence of generic model controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0442 / lesson 479, Outliers.
