# Lesson 0880: Infeasible Problems

Status: dedicated implementation; browser interaction and visual acceptance deferred under the user's latest workflow instruction. Not certified as an exact visual match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0880-school-class-12-linear-programming-infeasible-problems-redesigned.png`.
Catalog ID: 10206. Route: `/lessons/school/class-12/class-12-linear-programming-infeasible-problems`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review or deliberate difference |
| --- | --- | --- |
| Two bound editors | Independent sliders and numeric inputs, half-unit steps, finite inputs clamped to [-10, 10] | Exact dimensions and slider tick styling need screenshot review |
| Number line | Two draggable endpoints with pointer capture; keyboard arrows/Home/End; correctly positioned rays, ticks and interval/gap | Rays use separate heights so coincident endpoints remain selectable; target tick placement is inconsistent and was corrected |
| Results and certificate | Empty, singleton and interval states computed from current bounds | Exact typography, spacing and color comparison deferred |
| Transition examples | Three miniature diagrams; activating each example updates the lab | Cards are functional example selectors rather than static illustrations |
| 2D comparison | Dedicated plotted/shaded half-planes, inequality labels, empty strip and conclusion | Solid boundaries correctly represent inclusive inequalities; reference uses dashed lines. Text specifies vertical separation 3, not Euclidean distance 3 |
| Optimization sequence | Graph, shade, inspect overlap, stop before optimizing | Numbered sequence replaces reference pictograms; precise layout deferred |
| Definition and misconception | Target-specific explanation and empty-set notation | Exact styling deferred |
| Practice | Four radio systems and Check answer; feedback derived from the selected bounds; answer starts unselected | Reference shows a preselected correct answer; real practice intentionally requires a selection |
| Reset and Info | Reset restores both bounds and clears practice/help; Info expands explanatory content | Browser interaction verification deferred |
| Section and lesson navigation | All section buttons scroll; previous/next point to verified catalog lessons | Actual next lesson is Diet Problem, not the reference's Solvable Problems label |
| Page shell and footer | Existing application shell retained | Reference sidebar/header/footer are not recreated; exact visual parity not verified |

## Verification

- Seven focused Vitest tests passed: interval classification, all 1,681 slider-value pairs, drag coordinate mapping/clamping, practice classification, nonfinite inputs, and initial server-rendered markup.
- Focused strict TypeScript check passed after fixing tuple-union argument typing.
- Focused ESLint check passed.
- No authentic browser screenshots, pointer-event execution, responsive-layout verification, or image-difference threshold acceptance was performed. Model and markup tests do not establish visual equivalence.
- No bitmap assets needed: number lines and half-planes are mathematical SVG surfaces, not static screenshots.

Next sequential lesson: 0881 / 10207 Diet Problem. Prior aggregate completion claims have not been re-audited in this pass.
