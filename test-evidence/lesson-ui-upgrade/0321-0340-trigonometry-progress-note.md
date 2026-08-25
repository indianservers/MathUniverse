# Trigonometry target batch 0321-0340

Dedicated rebuild target: **60 of 130 lessons completed; 70 pending.**

| Mockup | Lesson | Status | Dedicated model and validation |
|---|---:|---|---|
| 0321 | 264 Reciprocal Trig Functions | Complete | Linked base/reciprocal branch model; two physical graph drags; sec, cosec, cot, undefined-state, settings, stages, grading, solution, and reset checks; exact 1024x1536 target geometry |
| 0322 | 265 Inverse Trig Functions | Complete | Restricted-branch reflection model; two physical construction drags plus independent practice drag; arcsine, arccosine, arctangent, stages, grading, hint, and reset checks; target-aligned 976x1612 composition |

## Lesson 264 / Mockup 0321 - Reciprocal Trig Functions

Reworked individually against the target mockup with a dedicated `linked-base-reciprocal-trig-branch-domain-asymptote-model`. The selected reciprocal function and angle drive the base function, reciprocal function, both graph markers, reciprocal branches, undefined points, asymptotes, domain, range, period, zeros, live angle card, and exact reciprocal calculation. The renderer splits secant, cosecant, and cotangent into valid branches so curves never connect across denominator zeros. Both graph points are physically draggable and update the same angle model.

The secant, cosecant, and cotangent selectors are functional; the angle slider, four angle steppers, three graph windows, asymptote setting, stage navigation, language, reset, share, workspace focus, solution reveal, practice grading, and adjacent navigation all perform real actions. Undefined reciprocal values are explicitly guarded at denominator zeros. The four-answer secant challenge rejects an incorrect value, accepts equivalent exact radical notation, and restores all target answers on solution or reset.

Final 1024x1536 browser validation verifies the initial `cos 30° = √3/2` and `sec 30° = 2/√3`; physically drags both linked graph handles; verifies `cosec 30° = 2`, `cot 45° = 1`, and undefined `sec 90°`; toggles asymptotes; changes the graph window; changes lesson stages; follows incorrect, corrected, and solution practice paths; and resets the complete surface. The screenshot loop fixes the misconception icon/graph sizing and practice-field arrangement, then matches the target section geometry exactly: header y=98-306, stages y=317-357, lab y=368-969, rules y=975-1137, examples y=1148-1320, practice y=1331-1478, and navigation y=1486-1527. It reports no horizontal overflow and zero console messages.

Evidence:

- `0321-reference.png`
- `0321-desktop.png`
- `0321-dedicated-target-validation.json`

## Lesson 265 / Mockup 0322 - Inverse Trig Functions

Reworked individually against the target mockup with a dedicated `restricted-branch-reflection-principal-inverse-trigonometry-model`. The selected inverse function and one principal angle drive the valid restricted branch, unit-circle point, reflected output point, input trig ratio, inverse value, principal range, three base-function readouts, and three inverse-function readouts. The large input and output points are independently draggable but update the same model. Arcsine is restricted to `[−90°, 90°]`, arccosine to `[0°, 180°]`, and arctangent to the open branch represented safely inside `(−90°, 90°)`.

The angle slider and numeric input, inverse-output slider and numeric input, three range selectors, lesson stages, language, reset, share, workspace focus, and adjacent navigation are functional. The worked `sin⁻¹(0.6)` reflection and verification are mathematically coherent. The independent practice construction owns its own draggable point, ratio, inverse answer, grading result, hint, and reset path rather than borrowing the main lesson state.

Final 976x1612 browser validation verifies the initial `sin 45° = √2/2` and `arcsin(√2/2) = 45°`; physically drags both reflected construction handles; verifies `arccos(−1/2) = 120°`, `arctan(1) = 45°`, and `arcsin(−1/2) = −30°`; changes lesson stages; physically drags the practice point and proves its expected inverse updates; follows incorrect, hint, corrected, practice-reset, and lesson-reset paths. The screenshot loop aligns tabs at y=257-308, the flow strip at y=316-381, workspace at y=389-889, principal-range rules at y=901-1058, example at y=1077-1264, misconception at y=1279-1355, and practice at y=1373-1601. It also reproduces the target's compact three-group sidebar with functional footer links, reports no horizontal overflow, and records zero console messages.

Evidence:

- `0322-reference.png`
- `0322-desktop.png`
- `0322-dedicated-target-validation.json`
