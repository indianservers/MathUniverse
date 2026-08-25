# Transformations and Loci target batch 0293-0320

Dedicated rebuild target: **56 of 130 lessons completed; 74 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0293 | 236 Translation by Vector | `rigid-vector-translation-pair` | Reworked individually and browser-validated |
| 0294 | 237 Reflection in Line | `point-line-orthogonal-reflection` | Reworked individually and browser-validated |
| 0295 | 238 Reflection in Point | `centre-midpoint-half-turn-reflection` | Reworked individually and browser-validated |
| 0296 | 239 Reflection in Circle | `opposite-ray-circle-inversion` | Reworked individually and browser-validated |
| 0297 | 240 Rotation Around Point | `fixed-centre-signed-angle-rotation` | Reworked individually and browser-validated |
| 0298 | 241 Dilation from Point | `centre-scale-triangle-dilation` | Reworked individually and browser-validated |
| 0299 | 242 Matrix Transformation | `editable-linear-map-basis-shape` | Reworked individually and browser-validated |
| 0300 | 243 Composite Transformations | `ordered-two-step-affine-composition` | Reworked individually and browser-validated |
| 0301 | 244 Transformation Mapping | `linked-preimage-image-rule-inference` | Reworked individually and browser-validated |
| 0302 | 245 Invariants | `measured-triangle-transformation-invariants` | Reworked individually and browser-validated |
| 0303 | 246 Symmetry Explorer | `draggable-motif-exact-symmetry-tests` | Reworked individually and browser-validated |
| 0304 | 247 Locus Generator | `anchor-radius-transformed-circle-locus` | Reworked individually and browser-validated |
| 0305 | 248 Equidistant Loci | `dependent-perpendicular-bisector-equal-distance` | Reworked individually and browser-validated |
| 0306 | 249 Moving-Linkage Loci | `fixed-foci-flexible-tether-ellipse` | Reworked individually and browser-validated |
| 0307 | 250 Envelope of Lines | `parameterized-tangent-family-parabola-envelope` | Reworked individually and browser-validated |
| 0308 | 251 Dynamic Trace | `dependent-dilation-image-with-temporal-trace` | Reworked individually and browser-validated |
| 0309 | 252 Conjecture Testing | `measured-translation-conjecture-trial-engine` | Reworked individually and browser-validated |
| 0310 | 253 Exact Proof | `exact-translation-isometry-proof-chain` | Reworked individually and browser-validated |
| 0311 | 254 Collinearity Test | `three-point-synchronized-exact-collinearity-tests` | Reworked individually and browser-validated |
| 0312 | 255 Concurrency Test | `triangle-cevians-exact-ceva-concurrency` | Reworked individually and browser-validated |
| 0313 | 256 Concyclicity Test | `four-point-circumcircle-determinant-angle-residual` | Reworked individually and browser-validated |
| 0314 | 257 Angle Measurement | `oriented-unit-circle-degree-radian-angle-measurement` | Reworked individually and browser-validated |
| 0315 | 258 Unit Circle | `linked-unit-circle-point-projection-coordinate-identity` | Reworked individually and browser-validated |
| 0316 | 259 Right-Triangle Ratios | `axis-aligned-right-triangle-dependent-vertex-ratio-model` | Reworked individually and browser-validated |
| 0317 | 260 Exact Trig Values | `snapped-special-angle-linked-circle-triangle-exact-value-model` | Reworked individually and browser-validated |
| 0318 | 261 Sine Graph | `linked-unit-circle-transformable-sine-function-model` | Reworked individually and browser-validated |

## Lesson 236 / Mockup 0293 - Translation by Vector

Reworked individually against the target mockup with a new lesson-specific adapter and `rigid-vector-translation-pair` object model. The main workspace owns source triangle A-B-C and vector `v`; the image triangle is derived by adding the same vector to every source vertex. Dragging any source vertex translates the complete source triangle rigidly while preserving its shape, and dragging the vector handle recalculates all three image vertices. Exact vector inputs and sliders, reverse, delete, reset, edit state, fullscreen, share, bookmark, five lesson stages, coordinate mapping, component form, construction rule, and adjacent navigation are functional.

The practice workspace owns a separate draggable source triangle and vector. Its six answer fields are graded against coordinates derived from the current practice geometry, so moving either object changes the correct answer. Incorrect checking, dynamic solution display, and correct rechecking are browser-validated.

Mockup 0293 prints A(-2,-1), B(0,1), C(-1,-3), vector (3,4), and image coordinates A'(1,3), B'(3,5), C'(2,1); those values are mathematically consistent and are preserved exactly. The drawn source and image triangles in the mockup do not occupy those printed coordinates or maintain one common visible displacement. The implementation intentionally keeps the printed coordinate rule and a genuine rigid translation rather than reproducing the contradictory drawing. The practice drawing also repeats a B label where A-B-C are required; the implementation uses the coherent A, B, and C labels.

Final 1024x1542 browser validation physically drags the main source triangle and vector, proves that source dragging preserves the vector, proves that vector dragging preserves the source while recalculating its image, exercises exact component edits, reverse, delete, reset, stages, bookmark, and edit state, physically drags the independent practice triangle and vector, and verifies both incorrect and correct grading paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1538.

Evidence:

- `0293-desktop.png`
- `0293-dedicated-target-validation.json`

## Lesson 237 / Mockup 0294 - Reflection in Line

Reworked individually against the target mockup with a new lesson-specific adapter and `point-line-orthogonal-reflection` object model. The main workspace owns source point P, a vertical or horizontal mirror line, and a dependent image P'. For a vertical line `x=a`, it derives `P'=(2a-x,y)`; for a horizontal line `y=b`, it derives `P'=(x,2b-y)`. It also calculates the perpendicular foot, midpoint, source and image distances, live equation, and coordinate mapping from the same state. P and the mirror line drag directly. Editing P updates P', while editing P' applies the inverse reflection to recover P. Objects/Line tabs, vertical/horizontal modes, exact coordinates, line slider and input, perpendicular visibility, fold/unfold, reset, share, print, stages, all rule cards, and adjacent navigation are functional.

The independent practice model reflects draggable A across a draggable horizontal line and derives A' continuously. Its four property checks are graded against the current construction, requiring equal distances, perpendicularity, midpoint incidence, and the live coordinate rule rather than accepting static target text.

The mockup's initial values P(-4,2), `l:x=1`, and P'(6,2) are mathematically consistent: both distances are 5 and the midpoint is (1,2). Its practice values A(3,4), `l:y=1`, and A'(3,-2) are also preserved exactly. Final 1026x1533 browser validation physically drags P and the main mirror line, proves equal-distance invariance and source independence during line movement, edits both source and dependent image coordinates, tests fold/unfold and perpendicular visibility, switches to horizontal reflection and verifies `y'=2b-y`, restores the target state, physically drags the separate practice point and line, and verifies incorrect and correct grading paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1527.

Evidence:

- `0294-desktop.png`
- `0294-dedicated-target-validation.json`

## Lesson 238 / Mockup 0295 - Reflection in Point

Reworked individually against the target mockup with a new lesson-specific adapter and `centre-midpoint-half-turn-reflection` object model. The main workspace owns centre P and source A, derives `A'=(2h-x,2k-y)`, and continuously calculates the complete collinear segment, midpoint invariant, equal centre distances, midpoint of PA, and midpoint of PA'. A and P drag independently. Move mode translates P and A together while preserving their relative vector and therefore translates A' rigidly. Exact centre/source inputs, source slider, origin, Quadrant I and deterministic random presets, five independent layer controls, Select/Move/Centre tools, result coordinates, reset, share, lesson guide, five stages, formula cards, and adjacent navigation are functional.

The independent practice task owns P(2,-1) and A(5,3), derives the exact expected image A'(-1,-5), grades both coordinate fields, reports incorrect and correct outcomes, and exposes real worked steps. The mockup's printed main coordinates P(0,0), A(3,1), and A'(-3,-1) are mathematically consistent and are preserved exactly. Its plotted points appear at roughly twice their printed vertical coordinates, so the implementation intentionally keeps a truthful coordinate plane rather than reproducing that graphical contradiction.

Final 1044x1506 browser validation physically drags A and proves P remains fixed, physically drags P and proves A remains fixed while A' updates, verifies exact coordinate edits against `A'=2P-A`, exercises all centre presets and layer visibility, physically translates the complete construction in Move mode while preserving the source-centre vector, exercises the source slider, lesson guide, share and stages, and verifies incorrect, worked-step, and correct practice paths. It reports zero overflow, zero console errors, an exact one-viewport page height, a lesson surface ending at y=1380, and the target-aligned full footer below it.

Evidence:

- `0295-desktop.png`
- `0295-dedicated-target-validation.json`

## Lesson 239 / Mockup 0296 - Reflection in Circle

Reworked individually against the target mockup with a new lesson-specific adapter and `opposite-ray-circle-inversion` object model. The main workspace owns circle centre O, radius r, and source point P, and derives the opposite-ray image `P' = O - (r²/OP²)(P-O)`. It continuously calculates OP, OP', their product, and the invariant `OP · OP' = r²`; P, O, and the radius handle all drag directly and independently. Exact point/centre/radius inputs, point and radius modes, grid and axes controls, all five lesson stages, construction and insight panels, reset, solution reveal, grading, and adjacent navigation are functional.

The independent practice task uses the target's circle `x²+y²=25` and P(-2,1), deriving and grading P'(10,-5) from the live signed-inversion rule. Mockup 0296 displays OP=5, OP'=1.8, and product 9, which requires P'=(-1.08,-1.44), but its plotted label and final worked-example line instead show P'=(-2.25,-3). The implementation preserves the target's stated opposite-ray rule and invariant with mathematically coherent coordinates rather than reproducing those contradictory labels.

Final 1027x1532 browser validation physically drags P while preserving O, drags O while preserving P, drags the radius and verifies that the product changes to the new r², restores exact target inputs, toggles grid and stages, and verifies incorrect, solution, and correct practice paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1426 with the target-aligned footer below it.

Evidence:

- `0296-desktop.png`
- `0296-dedicated-target-validation.json`

## Lesson 240 / Mockup 0297 - Rotation Around Point

Reworked individually against the target mockup with a new lesson-specific adapter and `fixed-centre-signed-angle-rotation` object model. The workspace owns fixed centre O, source P, angle magnitude, and clockwise/counterclockwise direction, and derives P' using the full translated rotation matrix. It continuously calculates source and image radii and polar angles. O and P drag independently, while dragging P' changes the angle without changing the radius. Exact centre/source inputs, the angle dial, four signed presets, direction controls, image/arc/axis-label layers, five tabs, reset, share, fullscreen, and adjacent navigation are functional.

The independent practice model rotates P(-2,5) by 120 degrees counterclockwise and grades P'=(-3.33,-4.23) to two decimal places. Final 1474x1067 browser validation physically drags P and O, checks their independent state, exercises exact coordinate edits, verifies 180-degree rotation, switches direction and applies the 90-degree preset, toggles image visibility, and verifies incorrect and correct grading paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1066.

Evidence:

- `0297-desktop.png`
- `0297-dedicated-target-validation.json`

## Lesson 241 / Mockup 0298 - Dilation from Point

Reworked individually against the target mockup with a new lesson-specific adapter and `centre-scale-triangle-dilation` object model. The workspace owns centre C and source triangle A-B-D, derives every image vertex with `V' = C + k(V-C)`, and calculates source/image distances, perimeter, area, and their live ratios. C and all three source vertices drag independently. Positive and negative scale modes, scale slider and steppers, exact centre inputs, construction rays, clear/reset, stages, language, sharing, workspace jump, and adjacent navigation are functional.

The task state sets C=(0,0) and k=1.5, grades the live construction, and reports score and accuracy. Final 1054x1492 browser validation physically drags A and C independently, switches to negative scale, verifies the area ratio changes to k squared, toggles rays, clears the image, restores the task state, and verifies correct grading. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1396 with the target-aligned footer below it.

Evidence:

- `0298-desktop.png`
- `0298-dedicated-target-validation.json`

## Lesson 242 / Mockup 0299 - Matrix Transformation

Reworked individually against the target mockup with a new lesson-specific adapter and `editable-linear-map-basis-shape` object model. The workspace owns a draggable source quadrilateral and editable 2x2 matrix, derives every transformed vertex with `x'=Ax`, and calculates determinant, absolute area scale factor, orientation, transformed coordinates, and images of both basis vectors from the same state. Overlay/before/after modes, direct coefficient inputs, six matrix presets, five lesson stages, five workspace tabs, reset, share, challenge, hint, and navigation are functional.

The composition task grades all four entries of the matrix produced by stretching by (2,1) and then applying an x-shear, and reports the resulting image of P(1,2). Mockup 0299's displayed matrix `[[2,1],[0,1]]` conflicts with several plotted and tabulated transformed coordinates; the implementation preserves that visible matrix and applies it consistently rather than reproducing contradictory outputs.

Final 1045x1505 browser validation physically drags source A, edits all matrix coefficients, verifies determinant updates, applies the reflection preset and verifies negative determinant, checks before/overlay visibility, and exercises incorrect and correct composition grading. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1423 with the target-aligned footer below it.

Evidence:

- `0299-desktop.png`
- `0299-dedicated-target-validation.json`

## Lesson 243 / Mockup 0300 - Composite Transformations

Reworked individually against the target mockup with a new lesson-specific adapter and `ordered-two-step-affine-composition` object model. The workspace owns draggable source triangle A-B-C and two ordered operations, derives the complete intermediate and final triangles, and drives the graph, mapping strip, order comparison, worked table, and learning cards from that same composition. The default sequence exactly implements the target's 90-degree counterclockwise rotation followed by translation (3,-1). Step selection, operation-library replacement, order swap, grid/axes layers, reset, and practice controls are functional.

The practice model requires the learner to choose the two transformations in the correct order and rejects the reversed order. Final 988x1592 browser validation physically drags source A and verifies both dependent images update, swaps the main order and verifies a different final mapping, replaces a selected step with reflection, toggles the grid, resets the full model, and exercises incorrect and correct practice orders. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1530 with the target-aligned footer below it.

Evidence:

- `0300-desktop.png`
- `0300-dedicated-target-validation.json`

## Lesson 244 / Mockup 0301 - Transformation Mapping

Reworked individually against the target mockup with a new lesson-specific adapter and `linked-preimage-image-rule-inference` object model. The workspace owns draggable pre-image triangle A-B-C and derives a linked image triangle from the selected transformation. Rotation angle and direction, translation, reflection, and dilation selectors all update the image coordinates, inferred mapping rule, transformation description, verification rows, invariant list, orientation note, and table from one model. Label visibility, snap-to-grid, stages, reset, share, reveal, and adjacent navigation are functional.

The hidden-rule practice uses three target-consistent point pairs and grades both symbolic coordinate expressions, accepting `(-y,x)` only. Final 1001x1572 browser validation physically drags A, changes rotation angle and direction, exercises all four transformation modes, verifies their live rules, toggles labels and snapping, resets the model, reveals the answer, and verifies incorrect and correct grading. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1562. Browser-box validation also confirms the invariant cards end at y=1120 and the following misconception band begins at y=1132 with no overlap.

Evidence:

- `0301-desktop.png`
- `0301-dedicated-target-validation.json`

## Lesson 245 / Mockup 0302 - Invariants

Reworked individually against the target mockup with a dedicated `measured-triangle-transformation-invariants` object model. The workspace owns draggable source triangle A-B-C and derives its image from the selected translation, rotation, reflection, or dilation. Side lengths, three angles, parallelism, signed orientation, area, and scale are calculated from the live geometry and populate both the coordinate table and invariants tracker. All three source vertices drag directly; translation components, rotation angle, reflection line, dilation factor, grid, axes, stages, reset, share, tabs, and adjacent navigation are functional.

The independent practice model rotates A(1,1), B(2,3), C(3,0) by 90 degrees counterclockwise and grades all six resulting coordinate fields against A'(-1,1), B'(-3,2), and C'(0,3). The target marks scale as changed under a unit-scale translation, which conflicts with the stated translation rule; the implementation reports scale unchanged for rigid transformations and changed only for dilation with k not equal to 1.

Final 893x1762 browser validation physically drags source A and verifies the dependent image updates, changes translation components, exercises reflection, dilation, and rotation controls, verifies that dilation by 2 multiplies area by 4, toggles grid and axes, resets the model, and checks both incorrect and correct practice paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1697 with the target-aligned footer below it.

Evidence:

- `0302-desktop.png`
- `0302-dedicated-target-validation.json`

## Lesson 246 / Mockup 0303 - Symmetry Explorer

Reworked individually against the target mockup with a dedicated `draggable-motif-exact-symmetry-tests` object model. The workspace owns a draggable motif, selectable mirror axis, reflected fold image, rotation image, fold opacity, and rotation angle. It tests reflected and rotated point sets for exact coincidence and derives line-symmetry validity, rotational validity, order, side length, vertex angle, and perimeter from the live geometry. Direct point dragging can break both symmetries; reset restores a genuine equilateral motif with symmetry about `x=0`, 120-degree rotational symmetry, and order 3. Mirror, fold, rotate and motif views, drag/transform modes, tool palette, axis selection, fold visibility, opacity, angle steppers and slider, tabs, guide, reset, share, and navigation are functional.

The independent practice task reflects B(2,3) across `x=0`, requires the learner to decide whether the complete asymmetric practice motif has line symmetry, and calculates the smallest angle for rotational order 4. It grades B'(-2,3), `No`, n=4, and 90 degrees together rather than accepting partial or static answers. Mockup 0303 draws a scalene triangle entirely to the right of `x=0` while simultaneously claiming that it has `x=0` line symmetry, 120-degree rotational symmetry, order 3, and a 60-degree invariant angle. The implementation uses a mathematically valid equilateral motif for those initial claims instead of reproducing the contradictory plot.

Final 933x1686 browser validation physically drags A and proves both exact-symmetry tests become false, resets the motif, switches to `y=0` and back to `x=0`, toggles and changes the fold overlay, opens the rotation preview, verifies that 60 degrees is invalid and 120 degrees restores order 3, then exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1588 with the target-aligned footer below it.

Evidence:

- `0303-desktop.png`
- `0303-dedicated-target-validation.json`

## Lesson 247 / Mockup 0304 - Locus Generator

Reworked individually against the target mockup with a dedicated `anchor-radius-transformed-circle-locus` object model. The workspace owns base anchor parameters h and k, radius r, translation, scale, and moving-point angle, then derives the transformed center, radius, point P, circle equation, distance AP, polar angle, midpoint, perimeter, and SVG locus from the same state. Anchor A and moving point P drag independently: moving A translates the full locus while preserving radius, while moving P recalculates radius and angle. Trace history records P only while tracing is active and is cleared whenever the defining parameters change, preventing old points from being presented under a new rule. Point/Trace/Path tabs, trace pause/resume, all six range and exact-value controls, lesson tabs, reset, share, workspace, object bar, and adjacent navigation are functional.

The practice model grades all six target parameters together: center C(-2,-1), radius 2.5, zero translation, and unit scale. The target's prefilled correct values and green detected-circle result are preserved in the initial rendered state, while changing any value and checking produces an incorrect result until all six values are restored.

Final 1006x1563 browser validation physically drags A and proves the locus translates without changing radius, drags P and proves radius and trace history update, edits h, k, r, translation, and scale and verifies transformed center (3,-1) with radius 6, pauses tracing and proves further dragging records no points, resets the complete model, and exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1452 with the target-aligned footer below it.

Evidence:

- `0304-desktop.png`
- `0304-dedicated-target-validation.json`

## Lesson 248 / Mockup 0305 - Equidistant Loci

Reworked individually against the target mockup with a dedicated `dependent-perpendicular-bisector-equal-distance` object model. The workspace owns draggable endpoints A and B, joint translation, and a signed parameter locating dependent anchor P along the computed perpendicular bisector. It derives midpoint M, unit perpendicular direction, P, AP, BP, absolute distance difference, and the normalized line equation from the same geometry. Dragging either endpoint reconstructs the bisector while retaining P on the new locus; dragging P projects the pointer onto that line, so `AP = BP` remains an actual invariant rather than a displayed claim. Exact A, B and P controls, translation, distance/angle interpretations, grid, axes, labels, tabs, reset, share, fullscreen, object bar, and adjacent navigation are functional. The angle mode interprets the shared symmetry line as the bisector of angle APB.

The practice task uses A(-4,2) and B(2,6). Their midpoint is (-1,4), the slope of AB is 2/3, and the perpendicular-bisector equation is `3x + 2y - 5 = 0`; the four choices are graded against that exact result. Mockup 0305 instead selects `3x + 2y - 2 = 0`, which does not pass through the midpoint. Its worked example for A(-2,1) and B(4,-3) also prints `2y - 3x + 1 = 0`, while the midpoint and perpendicular slope shown in the same card require `2y - 3x + 5 = 0`. The implementation preserves mathematically coherent equations rather than those two constant-term contradictions.

Final 953x1651 browser validation physically drags A and B independently and proves the dependent P retains zero distance difference, drags P along the locus, edits the endpoints and derives the exact practice equation, translates the construction while preserving midpoint dependency and equal distances, exercises grid, axes, labels and angle mode, resets the model, and verifies incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1561 with the target-aligned footer below it.

Evidence:

- `0305-desktop.png`
- `0305-dedicated-target-validation.json`

## Lesson 249 / Mockup 0306 - Moving-Linkage Loci

Reworked individually against the target mockup with a dedicated `fixed-foci-flexible-tether-ellipse` object model. The workspace owns two fixed pivots A and C, their separation d, two flexible tether-length contributions whose sum is L, moving parameter theta, translation, scale, and rotation. It derives ellipse validity, center, focal points, constrained P, semi-major axis `a=L/2`, semi-minor axis `b=sqrt(a^2-(d/2)^2)`, AP, PC, their sum, angle APC, bounds, and transformed SVG locus from the same state. Dragging P inverts the locus transform and recovers theta, keeping `AP+PC=L` exactly. Animate/pause, 1x/2x/4x speed, both length controls, all four transform controls, reset, sharing, tabs, feedback, and adjacent navigation are functional. When L is not greater than AC, the model reports an invalid closed locus and removes the ellipse instead of drawing impossible geometry.

The practice task uses total tether length 10 and AC=8, giving `a=5`, `c=4`, and `b=3`; it grades the ellipse and both semi-axis values together. Mockup 0306 describes two rigid links of fixed lengths AB=4 and BC=5 with fixed endpoints A and C, then claims their joint sweeps an ellipse. Two fixed-radius circles with fixed centers intersect in at most two points, so that rigid mechanism cannot produce the shown curve. The implementation uses the mathematically valid flexible-tether condition `AP+PC=constant`. The target practice additionally sets total length equal to AC (10), which degenerates to a segment while selecting a nondegenerate ellipse; the implementation uses AC=8 to retain the intended ellipse challenge.

Final 1015x1550 browser validation physically drags P while preserving the constant distance sum, starts and pauses animation and proves theta advances only while playing, shortens the tether below AC and verifies the ellipse disappears, restores the valid initial dimensions, translates, doubles, and rotates the locus while checking center, axes, and scaled distance sum, resets the model, and exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, and an exact one-viewport page height.

Evidence:

- `0306-desktop.png`
- `0306-dedicated-target-validation.json`

## Lesson 250 / Mockup 0307 - Envelope of Lines

Reworked individually against the target mockup with a dedicated `parameterized-tangent-family-parabola-envelope` object model. The family is `F(x,y,m)=y-mx-c+m^2/4=0`; solving `F=0` together with `dF/dm=0` gives contact point `(m/2,m^2/4+c)`, current-line intercept `c-m^2/4`, and envelope `y=x^2+c`. Slope and vertical-offset controls drive the line, contact point, equation cards, vertex, bounds, and detected SVG envelope from that model. Dragging the contact point recovers m while keeping it on the parabola. Trace accumulation records actual contact samples, respects its enable/disable control, allows repeated slopes as distinct historical samples, and clears independently. Tabs, reset, sharing, workspace, fullscreen, and adjacent navigation are functional.

The practice task asks for the envelope of `y=mx+1-m^2/4` and grades `y=x^2+1`, including incorrect and corrected paths. Mockup 0307 labels the family only as `y=mx+c`, displays m=1 and c=0 with line `y=x`, marks (1,1) as its tangency point, and claims envelope `y=x^2`. The line `y=x` intersects that parabola at two points and is not tangent; the tangent with slope 1 is `y=x-1/4` at `(1/2,1/4)`. The implementation includes the required `-m^2/4` term and uses those coherent contact values rather than reproducing the contradiction.

Final 993x1583 browser validation physically drags the contact point and proves it remains on the envelope, sets m=2 and verifies contact `(1,1)` with intercept -1, sets c=2 and verifies the shifted contact and envelope, disables trace accumulation and proves slope edits add no samples, reenables it and proves a sample is added, clears all traces, resets the model, and exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1576.

Evidence:

- `0307-desktop.png`
- `0307-dedicated-target-validation.json`

## Lesson 251 / Mockup 0308 - Dynamic Trace

Reworked individually against the target mockup with a dedicated `dependent-dilation-image-with-temporal-trace` object model. Source A owns two coordinates and the image B′ is always derived by the dilation rule `B′=(kx_A,ky_A)`. Dragging A updates B′ and records its actual historical positions. Editing either B′ coordinate performs the inverse calculation to recover A, so the image controls are functional without breaking the dependency. Negative and fractional scale factors are supported. The trace toggle controls whether new history is recorded, fade changes historical opacity, speed changes animation rate, transport controls step or animate the construction, and clear removes history independently of the geometry.

The practice task grades the requested dilation with `k=3` and `A=(-2,1)`, giving `B′=(-6,3)`, with incorrect and corrected feedback paths. Mockup 0308 displays A at `(0,0)` and B′ at `(2,2)` while simultaneously stating `B′=(kx_A,ky_A)` with `k=2`; those values cannot satisfy the displayed rule. The implementation starts from the coherent state A `(1,1)`, B′ `(2,2)`, and `k=2` rather than presenting a false live invariant.

Final 1009x1559 browser validation physically drags A and proves both image coordinates remain exactly twice the source coordinates while history grows, edits B′ x and proves A x is recovered by inverse dilation, applies `k=-2` and verifies the dependent image, disables tracing and proves coordinate edits do not add samples, reenables tracing, starts and pauses animation while checking live state, clears the trace, resets the complete model, and exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1507 with the compact target-aligned footer below it.

Evidence:

- `0308-desktop.png`
- `0308-dedicated-target-validation.json`

## Lesson 252 / Mockup 0309 - Conjecture Testing

Reworked individually against the target mockup with a dedicated `measured-translation-conjecture-trial-engine` object model. The construction owns segment endpoints A and B and translation vector T, then derives A′, B′, original and image lengths, both midpoints, midpoint displacement, length difference, and orientation. A, B, and the translation-vector handle drag independently; six exact and range controls update the same model. The translated segment always remains dependent on the original, so its distance and orientation invariants are measured rather than printed as fixed text.

The conjecture panel evaluates the entered statement against current geometry, stores measured trials, and reports unverified, supported-so-far, or disproved states. It recognizes length, orientation, fixed-midpoint, and distance-from-origin claims. “New test case” changes both source geometry and translation before recording another trial, while clear removes evidence without resetting the construction. This preserves the key distinction requested by the lesson: repeated examples can support a conjecture but do not become an exact proof, while one measured counterexample disproves a universal claim. The quick challenge correctly grades that a non-zero translation moves the midpoint rather than leaving its coordinates unchanged.

Mockup 0309 shows A `(0,0)`, an image point labeled B′ `(2,1)`, and translation `(2,0)` beside the rule `P′=(x+a,y+b)`; that image coordinate does not follow the displayed vector. The implementation uses a complete source segment and its exact translated image, keeping every displayed coordinate and invariant coherent instead of reproducing that contradiction.

Final 986x1595 browser validation physically drags A, B, and the translation-vector handle while proving original and image lengths remain equal, sets all six exact controls and verifies zero length difference with midpoint displacement `sqrt(5)`, enters a false fixed-midpoint conjecture and obtains a counterexample across varied trials, clears the evidence, tests length preservation across two constructions and obtains supported-so-far status, and exercises incorrect and correct challenge paths. It reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1529 with the compact target-aligned footer below it.

Evidence:

- `0309-desktop.png`
- `0309-dedicated-target-validation.json`

## Lesson 253 / Mockup 0310 - Exact Proof

Reworked individually against the target mockup with a dedicated `exact-translation-isometry-proof-chain` object model. The construction owns A, B, and translation vector T, then derives A′, B′, both segment lengths, midpoint M, translated midpoint M′, length difference, and the exact midpoint-map residual. A, B, and the translation-vector handle drag independently; six sliders and exact inputs update the same premises. Grid and label tools change real SVG layers, and reset restores the complete construction and proof state.

The six-row proof editor validates each statement against its required logical reason: given image relation, translation distance invariance, midpoint construction, midpoint preservation, midpoint definition, and substitution conclusion. Replacing the isometry theorem with a diagram measurement invalidates the proof; restoring the theorem repairs it. This makes the workspace an actual proof checker rather than a list of pre-approved rows. The practice model independently grades both the image `A′=(2,1)` for `A=(-1,2)` translated by `(3,-1)` and all four reasons in the coordinate derivation.

Final 887x1774 browser validation physically drags A, B, and the translation-vector handle while proving original and image lengths remain equal, toggles grid and labels off and back on, sets all six exact coordinates and verifies length `sqrt(32)` with image-midpoint x-coordinate 4, corrupts proof reason 2 and receives an invalid proof result, restores the exact translation theorem and receives a valid result, and exercises incorrect and corrected coordinate/practice-proof paths. The screenshot loop additionally caught the normal 960px responsive breakpoint hiding the sidebar at the target’s 887px width; the dedicated route now preserves the 179px desktop rail and suppresses the mobile dock to match mockup 0310. Final validation reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1699 with the compact footer below it.

Evidence:

- `0310-desktop.png`
- `0310-dedicated-target-validation.json`

## Lesson 254 / Mockup 0311 - Collinearity Test

Reworked individually against the target mockup with a dedicated `three-point-synchronized-exact-collinearity-tests` object model. Three independent draggable points feed one exact geometry calculation that derives AB, BC, AC, both consecutive slopes, the signed determinant, 2D cross product, triangle area, vertical-line state, line equation, and final classification. Six coordinate inputs update the same points. Snap, grid, zoom, reset, tabs, sharing, fullscreen, and adjacent navigation are functional, while the SVG line and non-collinear triangle region are derived from current geometry.

The slope, determinant, and vector panels stay synchronized from the shared model. Vertical lines are handled explicitly: both slopes become undefined, but equal vertical direction together with zero determinant and zero cross product still gives a valid collinear result. Dragging a point off the line immediately creates nonzero determinant and area and changes the result card to “Not collinear.” The practice task grades the exact classification of A(-2,1), B(1,3), C(4,5).

Mockup 0311’s worked card instead prints C(4,7), for which `m_AB=2/3` and `m_BC=4/3`, then marks determinant and cross product as zero and concludes collinear. The determinant is actually 6 and those points are not collinear. The implementation uses C(4,5), which gives both slopes `2/3` and exact determinant/cross product zero, preserving the target’s intended successful example without the contradiction.

Final 1015x1549 browser validation starts from the target’s coherent A(-3,-1), B(1,0.5), C(5,2) state and verifies slopes `0.375` with all exact tests zero, physically drags B off the line and proves the determinant becomes nonzero, drags A and C independently, sets a vertical line through x=2 and verifies both slopes are undefined while determinant remains zero and classification remains collinear, exercises grid, snap, zoom, and reset controls, and checks incorrect and corrected practice paths. The screenshot loop also removed excess shell space and restored the target-height footer. Final validation reports zero overflow, zero console errors, an exact one-viewport page height, and a lesson surface ending at y=1440.

Evidence:

- `0311-desktop.png`
- `0311-dedicated-target-validation.json`

## Lesson 255 / Mockup 0312 - Concurrency Test

Reworked individually against the target mockup with a dedicated `triangle-cevians-exact-ceva-concurrency` object model. The construction owns draggable triangle vertices A, B, C and side parameters for F on AB, D on BC, and E on CA. It derives all three side points, cevians AD, BE, CF, their three pairwise intersections, a common-point residual, triangle validity, the three Ceva ratios, and their product. Dragging F, D, or E projects the pointer back onto its owning side, while dragging a vertex reconstructs all dependent geometry without changing the side parameters. Exact ratio inputs, sliders, zoom, reset, tabs, sharing, fullscreen, object-view modes, and adjacent navigation are functional.

Concurrency requires two independent conditions from the same model: Ceva product approximately 1 and all three line intersections agreeing within tolerance. A collapsed triangle is explicitly invalid even if a ratio expression happens to remain finite. The independent practice model uses three live side-ratio sliders and grades its own product rather than reusing the worked construction’s result.

The implementation uses the standard Ceva assignment `F∈AB`, `D∈BC`, `E∈CA` and product `(AF/FB)(BD/DC)(CE/EA)=1`. Mockup 0312 draws that geometry but labels D as being on AC and E as being on BC in the control panel, then mixes `CD/DB` and `BE/EA` with the standard theorem card. The dedicated surface keeps side ownership, numerator order, graph labels, sliders, and theorem formula consistent.

Final 1004x1566 browser validation begins with exact ratios 1.25, 1.2, and 2/3 and verifies product 1 with a common intersection, physically drags F to break both product and concurrency, drags D and E independently along their sides, restores all three exact ratios and concurrency, drags A, B, and C while proving affine concurrency is preserved, exercises zoom controls, collapses C onto B and verifies the triangle is rejected, resets the model, switches object-view modes, and follows incorrect and corrected practice-product paths. The screenshot loop added the target’s missing three-item object strip and moved lesson navigation to the viewport bottom. Final validation reports zero overflow, zero console errors, exact one-viewport height, and a lesson surface ending at y=1566.

Evidence:

- `0312-desktop.png`
- `0312-dedicated-target-validation.json`

## Lesson 256 / Mockup 0313 - Concyclicity Test

Reworked individually against the target mockup with a dedicated `four-point-circumcircle-determinant-angle-residual` object model. Four independent draggable points feed an exact circumcircle fit through A, B, C and a fourth-point test. The model derives circumcenter, radius, D’s signed radial residual, the four-point determinant, all four interior angles, both opposite-angle sums, circle-fit validity, point distinctness, and final concyclicity. Eight coordinate inputs and four horizontal sliders update the same points. Tabs, reset, sharing, the two workspace modes, object-view strip, practice slider, and adjacent navigation are functional.

Concyclicity requires agreement among the fitted-circle residual, determinant, opposite-angle sums, and validity guards. Duplicate points are rejected as a four-distinct-point set, and collinear A/B/C are rejected because they cannot define a finite circumcircle. The independent practice model moves D radially while keeping A/B/C fixed and grades only when residual and determinant return to zero.

Mockup 0313 displays A(-5,1), B(3,4), C(5,-2), D(-2,-3), draws an origin-centered circle, and marks both angle sums and determinant as exact. Those four points have unequal distances from the origin, and the circle through A, B, C misses D substantially. The implementation preserves the target’s rotated-quadrilateral composition with coherent coordinates A(-5,1), B(1,5), C(5,-1), D(-1,-5). They share the circle `x²+y²=26`, have center (0,0), equal radius `sqrt(26)`, 90-degree interior angles, supplementary opposite pairs, and determinant zero.

Final 1024x1536 browser validation verifies the coherent initial center, radius, determinant and classification, physically drags A, B, C, and D and proves the changed construction is no longer concyclic, restores all eight coordinates and the exact circle, duplicates D with A and verifies distinctness failure, makes A/B/C collinear and verifies no circumcircle is accepted, resets the model, switches object-view modes, moves practice D to radial scale 1.3 and receives an incorrect result, then restores scale 1 and receives the correct result. The screenshot loop trims the page to an exact viewport and aligns bottom navigation and object modes with mockup 0313. Final validation reports zero overflow, zero console errors, and a lesson surface ending at y=1536.

Evidence:

- `0313-desktop.png`
- `0313-dedicated-target-validation.json`

## Lesson 257 / Mockup 0314 - Angle Measurement

Reworked individually against the target mockup with a dedicated `oriented-unit-circle-degree-radian-angle-measurement` object model. One signed angle in `[-360°, 360°]` drives its normalized angle, radian measure, unit-circle endpoint, cosine, sine, tangent, quadrant, sign table, ray, arc, protractor, current-value strip, and share text. The blue endpoint is physically draggable and recovers the nearest oriented angle rather than discarding the current revolution. The semicircular protractor is independently draggable and updates the same model. Degree and radian modes expose functional sliders and exact numeric inputs; the radian slider uses stable integer milliradian ticks so irrational bounds do not make standard values unrepresentable. All eight special-angle buttons, arrow-key fine adjustment, Shift fine adjustment, R reset, S nearest-special snap, workspace focus, reset, sharing, and wrong/correct practice paths are functional.

The target's main ray is visually close to 30° while its control reads 60°, and its nearby coordinate box prints `(cos θ, sin θ) = (0.866, 0.500)`; the current-values strip correctly prints `(0.500, 0.866)`. The implementation keeps the visible 60° ray and both coordinate displays mathematically synchronized at `(0.500, 0.866)` instead of reproducing the swapped local label. At 90°, tangent is reported as undefined rather than a large floating-point artifact. Signed and multi-turn angles remain available, while the sign table uses the normalized terminal side.

Final 1005x1565 browser validation starts at 60° and verifies `π/3`, cosine `0.5`, sine `sqrt(3)/2`, and tangent `sqrt(3)`; physically drags the unit-circle endpoint and proves all dependent values change; sets 135° and verifies Quadrant II with exact signs; switches to radians and reaches `π/2` with undefined tangent; physically drags the protractor; snaps to 45°; exercises arrow and S keyboard controls; follows incorrect and corrected practice paths; and resets the complete model. The screenshot loop replaces generic stage icons with the target's four mathematical mini-diagrams, aligns the full content stack and bottom lesson navigation, and reports no horizontal overflow, zero console errors, and a lesson surface ending at y=1565.

Evidence:

- `0314-desktop.png`
- `0314-dedicated-target-validation.json`

## Lesson 258 / Mockup 0315 - Unit Circle

Reworked individually against the target mockup with a dedicated `linked-unit-circle-point-projection-coordinate-identity` object model. One signed angle drives the normalized terminal angle, principal slider angle, radians, unit-circle point, horizontal and vertical projections, cosine, sine, quadrant, sign table, and Pythagorean-identity check. The point is physically draggable around the circle and recovers the nearest oriented representation of the new terminal side. The exact-angle input, principal `−180°..180°` slider, eight quick-angle controls including 270° and 360°, degree/radian mode, five lesson tabs, reset, share, workspace focus, and adjacent navigation all update real state.

The coordinate cards, SVG point label, dashed projection segments, quadrant row, and identity expansion are generated from the same model, so they cannot drift into contradictory values. Axis angles are classified separately from open quadrants while retaining the correct sine and cosine values. The independent quick check asks for the point at `−60°`, moves the construction to that angle when graded, and validates `(1/2, −sqrt(3)/2)` through both incorrect and corrected paths rather than preselecting a decorative answer.

Final 981x1603 browser validation verifies the initial 30° point `(sqrt(3)/2, 1/2)` and identity value 1; physically drags the point while proving the identity remains 1; enters 135° and verifies Quadrant II with both coordinates; drives the principal slider to −60° and verifies Quadrant IV; snaps to 270° and verifies `(0,−1)`; switches the dual-unit display to radians; exercises lesson tabs; follows incorrect and corrected practice paths; and resets the complete construction. The screenshot loop fixes the quadrant table structure, matches the target's linked-circle scale and center, constrains the lower bands and readout rail to their target widths, and reports exact 981x1603 document dimensions, no horizontal overflow, and zero console errors.

Evidence:

- `0315-desktop.png`
- `0315-dedicated-target-validation.json`

## Lesson 259 / Mockup 0316 - Right-Triangle Ratios

Reworked individually against the target mockup with a dedicated `axis-aligned-right-triangle-dependent-vertex-ratio-model` object model. Origin O, adjacent length, and opposite length own the construction; dependent points B and C are derived so OB remains horizontal, BC remains vertical, and the right angle remains exact. Dragging O translates the complete triangle without changing its side lengths, dragging B changes only the adjacent leg, and dragging C changes both legs. Snap mode projects C to the nearest special angle, while disabling snap preserves arbitrary angles. The angle slider rotates the hypotenuse at constant length, including an exact reachable 60-degree state.

The graph, coordinates, side labels, hypotenuse, angle arc, ratio cards, domain notes, ASTC sign table, SOH-CAH-TOA rule, worked example, and misconception diagrams all derive from coherent geometry. The five-field practice challenge grades opposite, hypotenuse, sine, cosine, and tangent against its stated 60-degree triangle; incorrect, corrected, and Show Solution paths are functional. Language selection, reset, share, workspace focus, snap control, and adjacent navigation also have real behavior.

Final 997x1578 browser validation verifies the initial 45-degree triangle and all three ratios; physically drags C, B, and O and proves each handle's constraints; reaches 60 degrees through the slider and verifies tangent `sqrt(3)`; disables snapping and preserves 37 degrees; follows incorrect and corrected practice paths; shows the complete solution; and resets the model. The screenshot loop replaces the former responsive shared-template collapse with the target's fixed composition, aligns the graph and ratio rail, prevents practice controls from overlapping navigation, and reports exact viewport/document dimensions, no horizontal overflow, and zero console errors.

Evidence:

- `0316-desktop.png`
- `0316-dedicated-target-validation.json`

## Lesson 260 / Mockup 0317 - Exact Trig Values

Reworked individually against the target mockup with a dedicated `snapped-special-angle-linked-circle-triangle-exact-value-model`. One first-quadrant special angle drives the radian form, unit-circle point, horizontal and vertical coordinates, linked triangle side ratio, sine, cosine, tangent, cotangent, axis/quadrant note, all four derivation cards, and the quick-reference table. The circle point is physically draggable and snaps to 0, 30, 45, 60, or 90 degrees. The angle selector and Unit Circle / Linked Triangle tabs update that same model, including mathematically guarded undefined tangent and cotangent values at axis angles.

The three-item practice carousel owns independent exact-form answers for 45, 30, and 60 degrees. Grading rejects rounded decimals and accepts equivalent symbolic input such as `sqrt(2)/2` and `√2/2`; incorrect, corrected, previous, next, and reset paths are functional. Language selection, reset, sharing, worked derivation, misconception treatment, and adjacent navigation are also implemented as real controls or model-derived content.

Final 993x1584 browser validation verifies the initial 60-degree values `π/3`, `√3/2`, `1/2`, `√3`, and `√3/3`; physically drags the unit-circle handle to 45 degrees and proves every linked exact value changes; selects 30 degrees; switches both visualization tabs; rejects decimal practice answers; accepts equivalent surd syntax; advances the challenge carousel; and resets the complete state. The screenshot loop aligns the circle frame and linked-triangle footprint with mockup 0317, places the quick-reference section exactly at y=1393-1573, and reports no horizontal overflow or console messages.

Evidence:

- `0317-desktop.png`
- `0317-dedicated-target-validation.json`

## Lesson 261 / Mockup 0318 - Sine Graph

Reworked individually against the target mockup with a dedicated `linked-unit-circle-transformable-sine-function-model`. One angle state drives the draggable unit-circle endpoint, vertical sine projection, current-angle card, synchronized point on the sine graph, slider, degree/radian readout, and live sine value. Dragging either the circle point or graph point updates the same angle from SVG coordinates. Play, pause, restart, and reset operate on that state rather than decorative animation.

The transformation model owns amplitude A, period factor B, phase shift C, and vertical shift D for `y = A sin(B(x − C)) + D`. Four real sliders regenerate the plotted curve and derive amplitude, period, phase shift, vertical shift, range, current value, and equation. Restore Defaults, language selection, sharing, workspace focus, fullscreen graph, worked transformation, sine/cosine comparison, and adjacent navigation are functional. The independent practice graph updates from editable A/B/C/D fields, accepts symbolic `−π/4` or `-pi/4`, and validates incorrect and corrected paths.

Final 878x1792 browser validation physically drags the unit-circle point to π/2 and proves the linked sine value reaches 1; physically drags the sine-graph point and proves the circle angle follows; sets A=2, B=2, C=π/3, D=1 and verifies amplitude 2, period π, phase shift π/3, vertical shift 1, and the transformed current value; runs and pauses the animation; follows incorrect and corrected practice paths; and resets the complete surface. The screenshot loop preserves the target's 198px desktop sidebar at its 878px viewport, removes the conflicting mobile dock, aligns the circle and graph frames, and places the sync, transform, practice, and navigation bands exactly at y=241, 718, 1532, and 1731. It reports no overflow or console messages.

Evidence:

- `0318-desktop.png`
- `0318-dedicated-target-validation.json`
