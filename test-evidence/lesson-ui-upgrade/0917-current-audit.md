# Lesson 0917: Error Function

Status: dedicated implementation pass. Browser interaction and exact visual acceptance remain deferred under the user-directed workflow. Not certified as an exact mockup match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0917-advanced-advanced-special-functions-error-function-redesigned.png`.
Advanced concept: 2023. Route: `/lessons/advanced-concepts/2023-error-function`.

## Comparison

| Target area | Implementation | Difference / remaining verification |
| --- | --- | --- |
| Dedicated accumulation model | Existing Simpson integrator evaluates signed Gaussian integral; scaled erf, complement, derivative and normal CDF calculated | Default values agree with reference readouts at shown precision |
| Gaussian graph | True exp(-t^2), area between zero and current x, current curve and axis handles | Corrects reference's broad curve: actual height at x=1 is exp(-1), not about .65 |
| Negative x | Left-side shading plus explicitly signed integral and negative erf | Geometric area not falsely described as negative; integration orientation explained |
| Linked erf graph | Actual S-curve, +/-1 asymptotes and synchronized point | Pointer selection on either graph, native draggable/keyboard slider and numeric input share one state |
| Toolbar | Reset x=1, expand/restore graph layout and CSV export of 361 calculated rows | Does not reproduce unidentified target toolbar icon as dummy action; export is actual numeric CSV, not a screenshot. Browser download unverified |
| Key properties | Correct definition, odd symmetry, limits and derivative; live values | Main kernel described as unnormalized, not a probability density by itself |
| Normal CDF | Correct x/sqrt(2) scaling, current value and fixed Phi(1) checkpoint | Values update with x; no stale checkpoint confusion |
| Complement | True erfc curve with vertical scale covering 0..2 | Corrects reference's negative-x values below 1; erfc approaches 2 as x tends to minus infinity |
| Diffusion | Exact heat kernel with working alpha*t selector .1,.25,.5,1,2 | Displays only [-3,3]; full-line unit mass distinguished from visible area |
| Study views | Learn, Explore and Practice with actual changed content; reflection/zero/edge presets | Numeric practice starts blank, interpretation unselected, actual per-answer checking |
| Reference | Live calculated reference values and working show/hide control | Hidden values do not imply successful checking; formulas remain available |
| Objectives | Learning aims, explicitly not automatic completion certification | Reference's checked styling not used to claim achieved mastery |
| Layout / navigation | Dedicated linked graph/readout stack, properties sidebar, three lower panels and study/reference/objectives | Exact shell/footer, typography, dimensions, responsive layout and pixel parity unverified. Previous Beta / next Zeta catalog links verified |

## Verification

- Eight focused Vitest tests passed: seven model tests and one initial-markup test.
- Known Gaussian integral, erf(1), erfc(1) and Phi(1) checked to 11 decimal places.
- Exact zero, oriented integral, odd symmetry and complement identities tested.
- Normal CDF independently compared to existing phase4 approximation.
- Numerical derivative residual and bounded monotonic erf samples checked.
- Full-line diffusion mass verified by independent integration; broadening and heat-equation residual tested.
- Practice rejects blank and incorrect interpretation/sign answers.
- Initial markup confirms default calculated values, slider, diffusion selector, corrected erfc explanation, no pregraded state, no KaTeX errors and valid next route.
- Focused ESLint passed after final mini-graph scale-label edit; targeted strict TypeScript passed before that display-only edit.
- One dedicated route test passed; 232 unrelated cases skipped.
- No full build, full suite, actual browser pointer/download interactions, screenshots or image comparison performed.

Next sequential target: 0918 / 2024 Zeta Function. Previous aggregate completion counts have not been re-audited.
