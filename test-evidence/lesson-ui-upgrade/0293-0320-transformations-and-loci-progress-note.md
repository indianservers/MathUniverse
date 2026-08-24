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
