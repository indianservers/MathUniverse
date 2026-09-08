# Lesson 0881: Diet Problem

Status: completed for the current one-by-one pass; browser and visual acceptance recorded below.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0881-school-class-12-linear-programming-diet-problem-redesigned.png`.
Catalog ID: 10207. Route: `/lessons/school/class-12/class-12-linear-programming-diet-problem`.

## Implementation and Comparison

| Target area | Implemented | Remaining review / deliberate differences |
| --- | --- | --- |
| Food mix | Separate A/B numeric inputs and decrement/increment controls; quarter servings or integer steps | Lucide food icons currently replace the reference's bowl photos; exact spacing and imagery remain pending |
| Nutrient progress | Protein = 3x + y, calcium = x + 3y; native progress meters and actual totals | Meters saturate at requirement while numeric totals show surplus; visual comparison deferred |
| Cost | Live 4x + 5y calculation | Exact panel styling deferred |
| Feasible region | Mathematical half-plane intersection, grid, hatching, correctly positioned constraint lines and corners | Reference plots labels at inconsistent coordinates; corrected rather than copied |
| Cost line | Pointer-drag hit area and keyboard-accessible range; independent exploratory line position | Moving the mix aligns the line with its cost; dragging only the line does not change the selected mix |
| Mix point | Pointer capture, drag in two dimensions, arrow-key adjustment, clamping and quarter/integer snapping | Real-browser pointer and keyboard checks remain deferred |
| Whole servings | Integer lattice and separate integer optimization; correct infeasibility after snapping when applicable | Default continuous optimum is (2.25, 2.25), cost 20.25; integer optimum is (3, 2), cost 22 |
| Data / linear model / solution | Actual nutrient table, inequalities, current feasibility and computed optimum | Dedicated three-column layout; precise target sizing deferred |
| Worked example | Five modeling steps, calculated optimum breakdown and misconception | Continuous and integer explanations update with mode |
| Practice | Opens the 12/12 requirement in the same lab; checks selected mix for feasibility and minimum cost | Practice optimum is (3, 3), cost 27; no separate generic practice page |
| Navigation | Section scroll controls, full reset, optimal-mix action, verified previous and next lesson routes | Footer and application-wide shell fidelity not addressed in this lesson-only change |

## Verification

- Seven focused Vitest model/initial-markup tests pass.
- Integer optimizer independently cross-checked by enumeration for 36 requirement pairs, including zero and asymmetric requirements.
- Focused strict TypeScript and ESLint checks pass.
- The earlier surface-only status is superseded by the one-by-one browser pass below.
- Initial test expectation incorrectly assumed integer optimum (2, 3), cost 23. Enumeration proved (3, 2), cost 22; the expectation and user-facing report were corrected, not the solver.

Next sequential lesson: 0882 / 10208 Production Planning Problem. Prior aggregate completion counts remain unaudited.

## One-by-one acceptance — 2026-09-08

- Desktop route rendered at 1024 × 1536 and captured at `artifacts/studio-control-audit/0881-current.png`.
- Reference comparison confirms the ordered composition: lesson header, tabs, food mix, nutrient meters, feasible-region graph, cost controls, model table, equations, live solution, worked example, practice and navigation/footer.
- Live validation passed for Food A editing, optimal-mix action, practice workspace opening and practice feedback.
- Scoped icon sizing keeps food, status and action icons proportional. Food photos from the reference are unavailable in project assets, so the existing Salad/Soup icons remain the lightweight representation.
