# Transformations and Loci target batch 0293-0320

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
