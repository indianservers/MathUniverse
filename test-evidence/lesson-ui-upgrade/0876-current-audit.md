# Lesson 0876: Corner-Point Method

Status: completed for the current one-by-one pass; browser and visual acceptance recorded below.

Target inspected: `D:/Math App Screenshots for UI Update/Updated UI/0876-school-class-12-linear-programming-corner-point-method-redesigned.png`.

## Implemented

- Independent c1/c2 constraint constants, c3/c4 objective coefficients, draggable and keyboard-operable constraint intercepts.
- Recomputed feasible polygon, vertex evaluation table, maximum and tied-optimum results.
- Objective line slider, Auto Best, expanded workspace, reset, section navigation and practice grading.
- Verified adjacent lesson routes for Feasible Region and Bounded Feasible Region.
- Model tests cover default (maximum 18 at (6,0)), changed boundary, tied edge, zero objective, negative objective and practice maximum 12.

## Deferred

- Browser interactions and screenshot comparison are deferred at the user's request; do not block subsequent lessons solely on this gate.
- Exact graph placement, typography, footer, reset-view semantics, mobile geometry/legend overlap and pointer interactions still require review.
- The target drawing has coordinate-placement inconsistencies; this implementation maps calculated points to a uniform coordinate scale.

## One-by-one acceptance — 2026-09-08

- Desktop route rendered at 1024 × 1536 with the shared shell and no application error.
- Screenshot captured at `artifacts/studio-control-audit/0876-current.png` and compared against the supplied reference. The repaired view keeps the same ordered structure: lesson header, section tabs, graph and constraints, live vertex evaluation, learning cards, practice, navigation and footer.
- Fixed a visual regression found during review: global SVG sizing was enlarging the Reset, Expand, heading and result icons. Scoped icon dimensions now keep these controls at 16 px.
- Live route validation passed for editing c₁, Auto Best, graph expand/collapse and practice grading.
