# Lesson 0882: Production Planning Problem

Status: completed for the current one-by-one pass; browser and visual acceptance recorded below.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0882-school-class-12-linear-programming-production-planning-problem-redesigned.png`.
Catalog ID: 10208. Route: `/lessons/school/class-12/class-12-linear-programming-production-planning-problem`.

## Implementation and Comparison

| Target area | Implementation | Remaining review / deliberate difference |
| --- | --- | --- |
| Problem and resource strip | Table/chair per-unit wood, labour and profit; available resources | Small decorative resource icons omitted; precise target spacing deferred |
| Factory planning board | Dedicated table/chair cards, quantity inputs, ranges and +/- controls | Lucide Box/Armchair icons replace target illustrations; tenth-unit vs whole-unit input steps |
| Whole products | Snaps current quantities, updates feasibility and shows integer graph points | Snapping (3.6, 3.6) produces infeasible (4, 4), accurately flagged; separate optimal integer action selects (3, 4) |
| Profit, point, feasibility | Live 40x + 50y calculation and both resource inequalities | Exact dimensions/colors need visual review |
| Resource meters | Live wood/labour totals, remaining or excess quantities | Meter fill saturates at capacity; excess remains explicit numerically |
| Feasible graph | Calculated polygon, correct lines/axis coordinates, draggable point with pointer capture and arrow-key controls | Reference graph's plotted positions do not consistently agree with its labels; implementation uses actual coordinates |
| Graph controls | Reset to continuous optimum and actual SVG download | Downloaded text receives standalone font attributes; browser execution of download remains untested |
| Corner table | Calculated coordinates, resource totals, feasibility and profit | CSS and row sizing unverified against rendered reference |
| Optimum comparison | Continuous (3.6, 3.6), profit 324; integer (3, 4), profit 320; actionable optimum buttons | Both optimum modes update the board and graph |
| Modeling / misconception | Four modeling steps; infeasible (6, 6) example can be inspected on the board | Corrected reference's false claim that any movement from optimum violates constraints; explains comparison of corner profits instead |
| Practice | Four radio options and checked feedback; starts unanswered | Explicitly asks for continuous optimum so integer option is not ambiguous |
| Navigation and shell | Section navigation and verified Diet / Transportation lesson links | Application header/sidebar/footer and exact responsive screenshot fidelity remain outside this verified pass |

## Verification

- Six focused Vitest model and initial-markup tests pass.
- Continuous optimum checked against every feasible tenth-step plan in the 0..6 production grid (3,721 candidate plans).
- Integer optimum independently checked over the larger 0..10 grid.
- Targeted strict TypeScript and ESLint checks pass.
- The earlier surface-only status is superseded by the one-by-one browser pass below.

Next sequential lesson: 0883 / 10209 Transportation-Style LPP Introduction. Earlier aggregate completion claims have not been re-audited here.

## One-by-one acceptance — 2026-09-08

- Desktop route rendered at 1024 × 1536 and captured at `artifacts/studio-control-audit/0882-current.png`.
- Reference comparison confirms the ordered composition: problem/resource strip, planning board, product controls, resource meters, feasible graph, corner usage, continuous/integer optimum cards, model notes, misconception, practice and navigation/footer.
- Live validation passed for quantity editing, integer optimum action, infeasible example inspection and practice grading.
- Scoped SVG sizing keeps factory, status, optimum and action icons proportional under the shared stylesheet.
