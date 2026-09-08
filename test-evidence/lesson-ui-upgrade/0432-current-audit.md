# Target 0432 / Lesson 469: Grouped Frequency Tables

Status: dedicated implementation and focused code tests passed. Browser interaction and screenshot acceptance remain pending. This is not an exact visual-match certification.

Target inspected: `D:\Math App Screenshots for UI Update\Updated UI\0432-interactive-intermediate-advanced-statistics-and-regression-grouped-frequency-tables-redesigned.png`

Route: `/lessons/data-and-probability/469-grouped-frequency-tables`

| Target element | Previous implementation | Current implementation | Remaining validation |
| --- | --- | --- | --- |
| Raw data and intervals | Shared numeric dataset controls | Dedicated sorted dataset and contiguous class boundaries | Browser interaction and screenshot comparison |
| Interactive histogram | Generic statistics visual | Real boundary range inputs drive grouped bars and interval labels | Browser drag/keyboard behavior and visual comparison |
| Grouped table | Generic frequency rows | Frequency, class width and midpoint recalculate from boundaries | Browser edit verification |
| Checks and notice | No grouped-class validation | Coverage, continuity, positive-width and total checks | Boundary edge-case browser check |
| Learn/reference content | Generic statistics prose | Definition, gaps/overlaps guard and width/midpoint formulas | Full-page visual comparison |
| Practice | No grouped self-check | Four real frequency inputs derived against values 1-16 and width-4 classes | Browser answer flow |
| Reset | Shared numeric reset | Restores boundaries, practice state and feedback | Browser outer reset integration |

## Mathematical Notes

- The source values are 2 through 21, grouped with boundaries 2, 7, 12, 17, 22 using half-open classes except the final class, producing frequencies 5,5,5,5 and midpoints 4.5,9.5,14.5,19.5.
- Boundary controls enforce strictly increasing limits. The linked table uses the final upper boundary inclusively so the maximum observation cannot disappear.
- The self-check uses classes 1-5, 5-9, 9-13 and 13-17 with the final upper endpoint handled by the same inclusive rule; values 1-16 produce 4,4,4,4.

## Checks Executed

- Vitest: `groupedFrequencyModel.test.ts`, `GroupedFrequencyTablesLesson469.test.tsx`, `StatisticsLessonAdapter.test.tsx`: **5 tests passed across 3 files**.
- Tests cover exact grouped counts, midpoint/width calculations, boundary coverage checks, derived self-check frequencies, dedicated routing and absence of generic controls.
- Strict targeted TypeScript check and ESLint for the dedicated component, model and tests: passed.
- No full application build, actual browser interaction, screenshot capture or pixel comparison performed. Static markup and model tests do not substitute for these checks.

Next sequential candidate: target 0433 / lesson 470, Mean.
