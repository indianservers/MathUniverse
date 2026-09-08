# Lesson 0887: Total Probability Theorem

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0887-school-class-12-probability-total-probability-theorem-redesigned.png`.
Catalog ID: 10213. Route: `/lessons/school/class-12/class-12-probability-total-probability-theorem`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Source mix | Numeric/range pairs linked so source weights sum to one | Actual pointer/keyboard execution and exact dimensions deferred |
| Conditional defect rates | Independent numeric/range pairs with complements | Inputs bounded to [0,1], one-percent increments |
| Live result | Weighted total and percentage derived from current model | Default 0.032 = 3.2%; exact typography deferred |
| Production stream | 100 source dots split according to mixture, expected defect/nondefect outputs and totals | Correctly labels fractional item counts as expectations; Lucide factory and HTML stream geometry differ from reference artwork |
| Probability tree | Both machine branches, four outcome leaves and joint path probabilities | Corrected reference's incorrect M2 defect/complement leaf labeling; exact branch placement deferred |
| Contributions | Weighted values, source shares and stacked bar with a labeled adaptive axis | Defaults use 0-4% scale; expands for larger probabilities. Zero total has undefined contribution shares rather than division by zero |
| Theorem | Complete-partition formula and two partition conditions | Includes explicit zero-weight-source caveat; formula uses text math rather than full display typesetting |
| Derivation/example | Four proof steps, fixed factory example and average-count explanation | Fixed example remains distinct from changing controls |
| Misconception | Raw-rate sum vs weighted conditional sum | Exact illustration and spacing deferred |
| Practice | Three independent answer toggles with calculated solutions | Results: 0.039, 0.0235, 0.068; medical scenario is explicitly hypothetical mathematics |
| Reset/navigation | All section tabs, full reset and slider-only reset; verified catalog links | Actual previous/next are Independent Events and Bayes' Theorem, not the mockup's Bayes / Expectation sequence |
| Shared shell/footer | Existing application shell retained | No blocking shell mismatch found in the accepted desktop viewport |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- 1,331 combinations tested for joint probability normalization and the weighted total lying between source rates.
- Tests cover default contribution shares, zero totals, zero-weight sources, all-defective sources, three practice results and invalid inputs.
- Targeted strict TypeScript and ESLint checks pass.
- Initial markup test expected hydration comments that static rendering does not emit; corrected to assert the actual static button labels.
- Captured desktop evidence: `artifacts/studio-control-audit/0887-current.png`.
- One-by-one browser acceptance: opened the real route and verified the source-mix controls, defect-rate controls, live result, production stream, probability tree, contributions, theorem, examples, practice, and reset/navigation shell.
- Added explicit 16px sizing for lesson action icons so inherited global SVG rules cannot create oversized controls.
- Focused model/surface tests pass (6 tests); `git diff --check` is clean for the lesson CSS and audit evidence.

Next sequential lesson: 0888 / 10214 Bayes' Theorem. Earlier aggregate completion counts have not been re-audited here.
