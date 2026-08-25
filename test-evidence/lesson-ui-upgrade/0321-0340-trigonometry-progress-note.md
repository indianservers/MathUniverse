# Trigonometry target batch 0321-0340

Dedicated rebuild target: **67 of 130 lessons completed; 63 pending.**

| Mockup |                              Lesson | Status   | Dedicated model and validation                                                                                                                                                                                                                        |
| ------ | ----------------------------------: | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0321   |       264 Reciprocal Trig Functions | Complete | Linked base/reciprocal branch model; two physical graph drags; sec, cosec, cot, undefined-state, settings, stages, grading, solution, and reset checks; exact 1024x1536 target geometry                                                               |
| 0322   |          265 Inverse Trig Functions | Complete | Restricted-branch reflection model; two physical construction drags plus independent practice drag; arcsine, arccosine, arctangent, stages, grading, hint, and reset checks; target-aligned 976x1612 composition                                      |
| 0323   |                 266 Trig Identities | Complete | Unit-circle, symbolic-transformation, and numerical-verification model; physical point drag; domain exclusion, automatic verification, stages, practice, proof reveal, accordions, and reset checks; exact 1023x1537 target stack                     |
| 0324   |         267 Compound-Angle Formulae | Complete | Dual unit-circle rotation and sum/difference projection model; two independent physical angle drags; live components, four identities, display settings, worked construction, challenge grading, and reset checks; exact 985x1597 target stack        |
| 0325   | 268 Double- and Half-Angle Formulae | Complete | Linked theta, double-angle, and half-angle unit-circle model; three physical inverse-linked drags; Sin/Cos/Tan modes, sign/domain guards, exact-value grading, hint, challenge cycling, and reset checks; exact 991x1587 target stack                 |
| 0326   |                  269 Trig Equations | Complete | Periodic cosine graph and movable level-line intersection model; physical line drag; independent interval endpoints, radian/degree modes, exact solution families, symbolic grading, hint, derivation, and reset checks; exact 1003x1568 target stack |
| 0327   |                       270 Sine Rule | Complete | Draggable triangle and opposite side-angle sine-ratio model; three physical vertex drags; real SSA zero/one/two ambiguity classification, tangent-boundary handling, numerical grading, hint, and reset checks; exact 1024x1536 target stack          |
| 0328   |                     271 Cosine Rule | Complete | Draggable coordinate triangle and square-decomposition model; two physical vertex drags; live Cosine Rule identity, independent editable SAS solvers, practice checking, and reset checks; exact 1013x1553 target composition                        |
| 0329   |           272 Triangle Area Formula | Complete | Draggable coordinate triangle with altitude, determinant, SAS, and base-height equivalence model; three physical vertex drags; real SAS sliders, coordinate editor, generated practice, grading, and reset checks; exact 1006x1563 target composition |

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

## Lesson 266 / Mockup 0323 - Trig Identities

Reworked individually against the target mockup with a dedicated `unit-circle-symbolic-transformation-numerical-identity-verification-model`. One angle drives the unit-circle point, sine, cosine, tangent, exact-value labels, quadrant, signs, the left side `tanθ`, the right side `sinθ/cosθ`, their numerical difference, and domain validity. The point is physically draggable and recovers the nearest signed turn. At denominator zeros, both sides become genuinely undefined rather than displaying a large floating-point artifact.

The symbolic transformation provides justified steps from tangent to the sine/cosine quotient, while the numerical cards independently calculate both sides from the same state. The angle slider, automatic-verification toggle, six lesson tabs, language, reset, share, workspace focus, editable practice identity, grading, step-by-step proof, two expandable follow-up identities, and adjacent navigation are functional. The sidebar learning-progress card uses real progress semantics, and the compact global footer retains functional Sitemap, Docs, and About links.

Final 1023x1537 browser validation verifies the initial 60-degree exact values and equality at `√3`; physically drags the unit-circle point and proves both sides remain equal; verifies both sides equal 1 at 45 degrees; verifies the domain guard at 90 degrees; toggles automatic verification; switches lesson stages; follows incorrect and equivalent `cosec θ` practice paths; reveals the complete algebraic proof; opens both follow-up challenges; and resets the full model. The screenshot loop aligns the header at y=101-246, tabs at y=253-295, lab at y=306-779, identity notice at y=789-836, learning grid at y=847-1375, navigation at y=1386-1438, site footer at y=1449-1537, and sidebar progress at y=891-971. It reports no horizontal overflow and zero console messages.

Evidence:

- `0323-reference.png`
- `0323-desktop.png`
- `0323-dedicated-target-validation.json`

## Lesson 267 / Mockup 0324 - Compound-Angle Formulae

Reworked individually against the target mockup with a dedicated `dual-unit-circle-rotation-sum-difference-projection-formula-model`. Independent alpha and beta angles drive two genuinely draggable unit-circle vectors, Cartesian projections, coordinate labels, the sum and difference angles, all four compound-angle identities, and their evaluated results. Unlike the reference artwork's inconsistent quadrant-II beta drawing, the implementation plots beta from its real cosine and sine so the visual construction, coordinate table, and formula calculations always agree.

The alpha and beta numeric controls, projection, coordinate, and grid settings, lesson stages, language, reset, share, workspace focus, worked exact-value construction, challenge selector, automatic grading, new challenge action, and adjacent navigation are functional. The practice model distinguishes wrong and correct exact values and cycles to a second independently graded compound-angle problem. The target-only sidebar groups and premium action are real navigation links rather than decorative controls.

Final 985x1597 browser validation verifies the initial 40-degree and 75-degree model and all eight derived trigonometric values; physically drags alpha and beta independently; verifies the exact 45-degree and 30-degree sum/difference calculations; toggles projections, coordinates, and grid; follows wrong, corrected, next-challenge, and second-correct grading paths; and resets the complete model. The screenshot loop matches the target geometry exactly: header y=98-222, learning flow y=230-317, workspace y=334-854, formula strip y=867-976, worked learning section y=989-1284, practice y=1298-1532, navigation y=1544-1597, sidebar links starting y=864, and premium panel y=1427-1583. It reports no horizontal overflow and zero console messages.

Evidence:

- `0324-reference.png`
- `0324-desktop.png`
- `0324-dedicated-target-validation.json`

## Lesson 268 / Mockup 0325 - Double- and Half-Angle Formulae

Reworked individually against the target mockup with a dedicated `linked-theta-double-half-unit-circle-sign-aware-identity-model`. One theta state drives three unit-circle objects at theta, twice theta, and half theta, their degree and radian values, Cartesian coordinates, direct identity values, expanded identity values, and the correct half-angle sign. All three points are physical handles: dragging theta updates the family directly, dragging the double-angle point solves back for theta, and dragging the half-angle point doubles back into the same state.

The angle slider and numeric field, Sin/Cos/Tan formula modes, six lesson stages, language, reset, share, workspace focus, automatic direct-versus-expanded checks, sign guidance, exact worked solution, four-option practice, grading, hint, and three-question cycle are functional. Tangent calculations guard both double-angle and half-angle denominator singularities instead of displaying floating-point artifacts. The half-angle radical selects its sign from the actual half-angle quadrant.

Final 991x1587 browser validation verifies the initial 45-degree, 90-degree, and 22.5-degree linked construction; physically drags all three handles and proves each inverse relationship; verifies sine and cosine identities at 60 degrees; guards tan(90 degrees); verifies the negative sine half-angle root at theta = -150 degrees; guards the tangent half-angle domain at theta = 180 degrees; changes lesson stages; follows wrong, corrected, hint, next-question, and second-correct practice paths; and resets the entire lesson. The screenshot loop matches the target stack exactly: header y=102-295, tabs y=307-351, linked-angle lab y=359-749, formulas y=757-990, learning flow y=997-1118, worked learning section y=1125-1373, and practice y=1381-1578, inside an exact 991x1587 document. It reports no horizontal overflow and zero console messages.

Evidence:

- `0325-reference.png`
- `0325-desktop.png`
- `0325-dedicated-target-validation.json`

## Lesson 269 / Mockup 0326 - Trig Equations

Reworked individually against the target mockup with a dedicated `cosine-horizontal-level-periodic-interval-intersection-solution-family-model`. The horizontal level k and two interval endpoints drive the sampled cosine graph, exact intersection points, sorted interval solutions, decimal approximations, principal arccos value, and general periodic family. The horizontal level has a physical graph handle, and both interval endpoints are independent range controls. Coincident endpoint solutions at k = 1 or k = -1 are deduplicated mathematically.

The k slider and numeric field, minimum and maximum interval controls, radian/degree modes, five lesson views, language, reset, share, workspace focus, live graph, exact and decimal result panels, free-response parser, grading, hint, solution derivation, challenge cycling, and adjacent navigation are functional. The answer parser accepts π or `pi` fractions and compares complete numerical solution sets, so a plausible but incomplete principal-angle answer is rejected.

Final 1003x1568 browser validation verifies the initial four solutions of cos(x) = 1/2 on [-2π, 2π]; physically drags the graph level; verifies the three boundary solutions at k = 1 and two at k = -1; restricts the interval to [-π, π] and verifies only two solutions remain; switches to degrees and the Examples view; rejects an incomplete periodic answer; accepts the full symbolic π-family; opens the hint and derivation; grades the second challenge; and resets the entire model. The screenshot loop matches the target geometry exactly: header y=100-279, tabs y=287-329, flow y=337-435, graph solver y=441-806, input/output map y=814-899, learning panels y=911-1216, practice y=1232-1392, navigation y=1405-1454, and site footer y=1464-1568. It reports no horizontal overflow and zero console messages.

Evidence:

- `0326-reference.png`
- `0326-desktop.png`
- `0326-dedicated-target-validation.json`

## Lesson 270 / Mockup 0327 - Sine Rule

Reworked individually against the target mockup with a dedicated `draggable-triangle-opposite-side-angle-sine-ratio-ssa-ambiguity-model`. Three independent physical vertices drive all side lengths, opposite angles, angle sum, the three values `a/sin A`, `b/sin B`, and `c/sin C`, and their common value. The implementation keeps every side paired with its mathematically opposite angle even though the reference artwork permutes some displayed angle labels.

The language, reset, share, workspace focus, three triangle handles, SSA sides and angle inputs, SSA side slider, live zero/one/two-solution cards, exact tangent case, numerical practice fields, grading, hint, and adjacent navigation are functional. The SSA solver uses the altitude test and validates both inverse-sine branches, rather than reproducing the reference's reversed ambiguity captions. Its equality boundary explicitly collapses floating-point duplicate 90-degree branches to one tangent triangle.

Final 1024x1536 browser validation verifies the initial side lengths and equal sine ratios; physically drags A, B, and C separately while rechecking the 180-degree sum and all ratio equalities; verifies no triangle below the altitude, one tangent triangle at the altitude, two triangles in the ambiguous interval, and one triangle when the opposite side is at least the known side; rejects incorrect practice values; accepts B=25.4 degrees, C=114.6 degrees, and c=17.0; opens the hint; and resets the complete model. The screenshot loop matches the target stack exactly: lesson header y=104-253, flow y=264-339, draggable model y=349-671, rule and SSA explorer y=681-1045, worked example y=1053-1329, practice y=1346-1471, and navigation y=1480-1536. It reports no horizontal overflow and zero console messages.

Evidence:

- `0327-reference.png`
- `0327-desktop.png`
- `0327-dedicated-target-validation.json`

## Lesson 271 / Mockup 0328 - Cosine Rule

Reworked individually against the target mockup with a dedicated `draggable-coordinate-triangle-cosine-square-decomposition-sas-solver-model`. The two physical vertices A and B drive all three side lengths, the included angle C, the three square areas, the signed `-2ab cos C` correction, and both sides of `c² = a² + b² - 2ab cos C`. The implementation keeps the coordinate triangle and every numerical label mathematically coherent even though the reference image combines incompatible coordinates, side lengths, and angle values.

The language, lesson reset, share, workspace focus, both SVG vertex handles, editable worked-example sides and angle, editable practice sides and angle, practice checking, practice reset, and adjacent navigation are functional. The square decomposition resizes from the actual model areas. The misconception comparison retains the target presentation while correcting its plus-sign calculation: with two sides 5 and angle 120 degrees, the incorrect plus version gives 25 and side 5, not 75 and side 8.660.

Final 1013x1553 browser validation verifies the initial `a=sqrt(29)`, `b=4`, `c=sqrt(61)`, and 61=61 identity; physically drags A and B independently while rechecking the identity after each drag; changes the worked solver to sides 5 and 5 with included angle 120 degrees and verifies `sqrt(75)`; changes practice to the 3-4-5 right-triangle case, verifies its live answer and checked state; and resets the complete lesson. The screenshot loop matches the target composition exactly: header y=89-202, flow y=212-311, lab y=327-738, rule y=747-895, worked example y=905-1086, misconception y=1098-1255, practice y=1270-1399, navigation y=1410-1450, and footer through y=1553. It reports no horizontal overflow and zero console messages.

Evidence:

- `0328-reference.png`
- `0328-desktop.png`
- `0328-dedicated-target-validation.json`

## Lesson 272 / Mockup 0329 - Triangle Area Formula

Reworked individually against the target mockup with a dedicated `draggable-coordinate-triangle-sas-determinant-altitude-area-equivalence-model`. Three independent physical vertices drive the adjacent sides a and b, base AB, included angle C, perpendicular foot D, altitude CD, sine-formula area, base-height area, and determinant area. All three methods remain numerically equal after arbitrary coordinate changes. This replaces the reference image's contradictory initial claim that `1/2(4)(3)sin(53.13 degrees) = 4.789` and simultaneously equals `1/2(4)(3) = 6` with one coherent geometric model.

The five lesson-view controls, workspace focus, reset, share, Sides & Angle and Coordinates tabs, three SAS sliders and number fields, six coordinate fields, three SVG vertex handles, answer input, grading, generated-question cycling, and adjacent navigation are functional. SAS edits reconstruct the coordinate triangle from the requested sides and included angle; coordinate edits update the same model directly. Practice questions own independent expected values and reject incorrect numerical answers before accepting answers within the stated rounding tolerance.

Final 1006x1563 browser validation verifies the initial isosceles coordinate triangle and exact area 6; physically drags A, B, and C separately while rechecking all three area methods after every drag; reconstructs a 5-by-6 triangle with included angle 90 degrees and verifies area 15; opens the coordinate editor, creates A(0,0), B(5,0), C(2,4), and verifies area 10; activates the Practice lesson view; rejects 10, accepts 16.97, advances to a new generated question, and resets the full lesson. The screenshot loop matches the target stack exactly: header y=97-191, tabs y=199-241, flow y=256-333, explorer y=348-1027, learning cards y=1038-1291, practice y=1302-1499, and navigation y=1508-1558. It reports no horizontal overflow and zero console messages.

Evidence:

- `0329-reference.png`
- `0329-desktop.png`
- `0329-dedicated-target-validation.json`
