# Lesson 0884: Conditional Probability

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0884-school-class-12-probability-conditional-probability-redesigned.png`.
Catalog ID: 10210. Route: `/lessons/school/class-12/class-12-probability-conditional-probability`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Scenario | 40 persistent student identities, initial counts 10 A-only / 8 both / 8 B-only / 14 neither | Reference illustration appears to contain more than 40 dots; actual count is exactly 40 |
| Editable Venn diagram | Pointer-captured student dragging, region hit testing, keyboard reassignment, accessible membership labels | Deterministic non-overlapping positions replace reference's scattered dot layout; exact circle positions and density need screenshot review |
| Conditioned sample | Same students, outside-condition dots dimmed; given B / given A selectors update included counts | Event B or A with zero students produces undefined probability, never a numeric zero |
| Probability builder | Real numerator/denominator event selectors, selected ratio and instructional feedback; actual conditional result stays separately labeled | Choices do not alter student counts; source of truth remains the student model |
| Frequency table | All four cells, row totals and column totals derived from current memberships | Exact visual table spacing deferred |
| Reverse condition | Toggle reveals the reverse conditional probability and its changed denominator | Hidden when off; reference shows reverse calculation despite its off-looking toggle |
| Misconception | Explains that reverse probabilities need not be equal | Corrected reference's unconditional not-equal assertion; some counts produce equality |
| Learning sections | Takeaway, fixed 40-student worked example, and application explanation | Fixed worked example remains distinct from the editable scenario |
| Practice | Three radio choices, unanswered initial state and checked feedback for 7/15 and 7/20 | Exact option styling and placement deferred |
| Save / reset / navigation | Persistent local bookmark with error handling; reset scenario; real section and catalog navigation | Save storage not exercised in browser; adjacent catalog lesson is Multiplication Rule, not target's Addition Rule |
| Shared shell / footer | Existing application shell retained | No blocking shell mismatch found in the accepted desktop viewport |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- Tests confirm initial probabilities, all four membership hit regions, moving a student's counts, undefined denominators, reduced fractions and all-student overlap.
- All 40 positions tested as finite, unique and inside their assigned region when every student is placed in each single region.
- Focused strict TypeScript and ESLint checks pass.
- Captured desktop evidence: `artifacts/studio-control-audit/0884-current.png` and `artifacts/studio-control-audit/0884-interaction.png`.
- One-by-one browser acceptance: opened the real route, switched to reverse conditioning, changed the numerator selector to event A, enabled the reverse-condition control, selected a practice answer, and verified the live “Correct” feedback.
- Added explicit 16px sizing for lesson action icons so inherited global SVG rules cannot create oversized reset/expand controls.
- Focused model/surface tests pass; `git diff --check` is clean for the lesson CSS and audit evidence.

Next sequential lesson: 0885 / 10211 Multiplication Rule. Earlier aggregate completion counts have not been re-audited here.
