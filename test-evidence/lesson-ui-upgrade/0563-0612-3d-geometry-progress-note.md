# 3D Geometry and Solids UI Upgrade

Target references begin at `0563` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0563 | 378 3D Coordinate System | `CoordinateSystemTargetLesson378` | React Three Fiber spatial axes and projection planes, orbit/zoom, directly draggable point, synchronized x/y/z numeric and range controls, live ordered triple, step path, projection coordinates, distance, three display toggles, camera reset/fullscreen, tabs/reset, and graded coordinate-order challenge | 1002 x 1569; nonblank 498 x 560 WebGL canvas; no overflow or application console errors | Complete |
| 0564 | 379 3D Points | `PointsTargetLesson379` | React Three Fiber multi-point plotter with independently selectable A/B/C points, direct selected-point dragging at fixed height, synchronized x/y/z range and numeric controls, dynamic add-point and snap-to-grid commands, orbit/zoom, spatial wall grids, axis ticks, drop lines, xy shadows, selected step path, labels, coordinate table, live height/octant/highest-point calculations, four display toggles, camera reset/fullscreen, tabs/reset, and graded highest-point challenge | 987 x 1593 desktop plus 390 x 844 mobile viewport; nonblank 517 x 459 WebGL canvas; no overflow or application console errors | Complete |
| 0565 | 380 Distance in 3D | `DistanceTargetLesson380` | React Three Fiber two-point distance model with independently editable and directly draggable A/B points, per-point reset, live Δx/Δy/Δz and squared-distance calculations, distance segment, rectangular component box, component-step arrows, three display toggles, orbit/zoom, camera reset/fullscreen, tabs/reset, and target formula/worked/practice derivations | 1003 x 1568 desktop plus 390 x 844 mobile viewport; nonblank 478 x 498 WebGL canvas; no overflow or application console errors | Complete |
| 0566 | 381 Lines in 3D | `LinesTargetLesson381` | React Three Fiber parametric-line model with editable anchor and direction vectors, live t range/numeric control, calculated selected and t=-1 points, sample-point layer, direction-step layer, equation layer, orbit/zoom and camera reset/fullscreen, tabs/reset, and interactive challenge-solution disclosure | 1002 x 1569 desktop plus 390 x 844 mobile viewport; nonblank 467 x 544 WebGL canvas; no overflow or application console errors | Complete |
| 0567 | 382 Planes | `PlanesTargetLesson382` | React Three Fiber plane-equation model with editable A/B/C/D coefficients, live intercept triangle, normal vector, test-point substitution and pass/fail state, equation/intercept construction modes, four display layers, orbit/zoom/pan and camera reset/fullscreen, tabs/reset, and graded normal-vector challenge with solution disclosure | 963 x 1633 desktop plus 390 x 844 mobile viewport; nonblank 459 x 476 WebGL canvas; no overflow or application console errors | Complete |
| 0568 | 383 Parallel and Perpendicular Planes | `ParallelPlanesTargetLesson383` | React Three Fiber two-plane comparator with eight editable coefficients, automatic parallel/perpendicular/neither classification, scalar-multiple and dot-product calculations, exact parallel-plane separation, three classification controls with correctness state, normal/separation/dot visibility layers, comparison-spaced default scene, real nonparallel orientations, orbit/zoom, fullscreen/tabs/reset, and interactive challenge validation | 1006 x 1564 desktop plus 390 x 844 mobile viewport; nonblank 470 x 513 WebGL canvas; no overflow or application console errors | Complete |
| 0569 | 384 Line-Plane Intersection | `LinePlaneTargetLesson384` | React Three Fiber parametric-line and plane model with editable line point/direction and plane coefficients, exact numerator/denominator solver for single/parallel/contained cases, live substitution and intersection calculations, orbit/zoom/pan, camera reset/fullscreen, tabs/reset, and graded challenge with solution disclosure | 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 458 x 526 WebGL canvas; no overflow or application console errors | Complete |
| 0570 | 385 Plane-Plane Intersection | `PlanePlaneTargetLesson385` | React Three Fiber two-plane model with eight editable coefficients, exact normal/cross-product/intersection-line solver, computed sample point and simplified direction, explicit intersecting/parallel/coincident classifications, four live scene layers, orbit/zoom/pan and camera reset/fullscreen, active tabs, clipboard result actions, and a genuinely graded challenge | 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 488 x 471 WebGL canvas; no overflow or application console errors | Complete |
| 0571 | 386 Angle Between Lines | `AngleLinesTargetLesson386` | React Three Fiber two-vector angle model with directly draggable arrowheads, six synchronized coefficient inputs, exact dot product/magnitude/cosine/angle calculations, acute and obtuse branches, zero-vector validation, normalized display arrows, angle arc and translated-line layers, orbit/zoom, fullscreen/tabs/reset/share, and live computed challenge cycling | 989 x 1589 desktop plus 390 px mobile rendering; nonblank 459 x 499 WebGL canvas; no overflow or application console errors | Complete |
| 0572 | 387 Angle Between Planes | `AnglePlanesTargetLesson387` | React Three Fiber two-plane dihedral model with six editable coefficients and directly draggable normal endpoints, exact dot product/magnitude/cosine/angle calculations, computed cross-product hinge, acute/obtuse and zero/parallel branches, three live scene layers, orbit/zoom, fullscreen/tabs/reset/share, and a genuinely graded challenge | 975 x 1614 desktop plus 390 px mobile rendering; nonblank 481 x 565 WebGL canvas; no overflow or application console errors | Complete |
| 0573 | 388 Angle Between Line and Plane | `AngleLinePlaneTargetLesson388` | React Three Fiber line/plane inclination model with six editable coefficients and directly draggable line/normal endpoints, exact projection, dot product, magnitudes, sine, line-plane angle and complementary normal angle, coordinate-plane selector with custom-normal state, projection/normal layers, orbit/zoom, fullscreen/tabs/reset/share, and a computed 45-degree experiment | 1586 x 992 landscape desktop plus 390 px mobile rendering; nonblank 873 x 417 WebGL canvas; no overflow or application console errors | Complete |
| 0574 | 389 Point-to-Plane Distance | `PointPlaneDistanceTargetLesson389` | React Three Fiber point/plane distance model with seven editable coordinates and coefficients, directly draggable point, exact numerator/denominator/distance and perpendicular-foot calculations, valid/on-plane/zero-normal branches, perpendicular and foot layers, orbit/zoom, camera reset, tabs/reset/share, and a computed z=2 experiment | 963 x 1633 desktop plus 390 px mobile rendering; nonblank 403 x 737 WebGL canvas; no overflow or application console errors | Complete |
| 0575 | 390 3D Vectors | `VectorsTargetLesson390` | React Three Fiber two-vector operations model with six working component steppers, directly draggable vector endpoints, exact sum/dot/cross/magnitude/cosine/angle calculations, Add/Dot/Cross modes, axes layer, orbit/zoom, fullscreen, result steps, tabs/reset/share, right-hand-rule guidance, and checked vector-addition practice | 992 x 1586 desktop plus 390 px mobile rendering; nonblank 467 x 697 WebGL canvas; no overflow or application console errors | Complete |
| 0576 | 391 Cube | `CubeTargetLesson391` | React Three Fiber parametric cube model with synchronized side slider/numeric control, exact volume/surface/face-diagonal/space-diagonal calculations, independent diagonal layers, genuine six-face net, clickable face/net highlighting, orbit/zoom, reversible fullscreen, tabs/reset/share, Euler topology, and a computed a=5 experiment | 1009 x 1558 desktop plus 390 px mobile rendering; nonblank 425 x 619 WebGL canvas; no overflow or application console errors | Complete |
| 0577 | 392 Cuboid | `CuboidTargetLesson392` | React Three Fiber parametric cuboid model with six working length/width/height steppers, exact volume/surface/base/face-diagonal/space-diagonal calculations, independent diagonal layers, genuine six-face rectangular net, orbit/zoom, tabs/reset/share, edge/face/right-angle structure, and a computed 4×2×3 practice model | 1173 x 1341 desktop plus 390 px mobile rendering; nonblank 536 x 477 WebGL canvas; no overflow or application console errors | Complete |
| 0578 | 393 Prism | `PrismTargetLesson393` | React Three Fiber generated Triangle/Rectangle/Hexagon cross-sections extruded by editable length, synchronized base/height/length sliders and numeric controls, exact base/perimeter/volume/lateral/surface calculations, independent base/lateral/net layers, orbit/zoom, reversible fullscreen, tabs/reset/share, and practice guidance | 1173 x 1341 desktop plus 390 px mobile rendering; nonblank 509 x 526 WebGL canvas; no overflow or application console errors | Complete |

Completed in this family: **16 / 50**. Pending in this family: **34 / 50**.

## Lesson 378 validation

- Reference: `0563-reference.png`
- Current capture: `0563-desktop.png`
- Canvas-only capture: `0563-canvas.png`
- Machine-readable interaction and layout audit: `0563-dedicated-target-validation.json`
- The capture harness verifies the target `P=(3,2,4)` state and `sqrt(29) ~= 5.39` distance, synchronized coordinate edits to `Q=(-2,3,1)`, projection-plane visibility, a physical OrbitControls gesture with changed canvas pixels, nonblank canvas evidence with 25,594 colored sample pixels and 1,505 distinct colors, correctly graded z-coordinate challenge, fullscreen toggle, tabs, shell reset, exact 1002 x 1569 dimensions, and absence of overflow or application console errors.

## Lesson 379 validation

- Reference: `0564-reference.png`
- Current capture: `0564-desktop.png`
- Mobile capture: `0564-mobile.png`
- Canvas-only capture: `0564-canvas.png`
- Machine-readable interaction and layout audit: `0564-dedicated-target-validation.json`
- The capture harness verifies the target A/B/C coordinates, point selection, a live highest-point change after editing B to z=4, all four display toggles, adding D, snapping D from `(1.4,-2.6,2.2)` to `(1,-3,2)`, incorrect and correct challenge grades, a physical OrbitControls gesture with changed pixels, nonblank canvas evidence, fullscreen, tabs, shell reset, exact 987 x 1593 desktop dimensions, a nonblank overflow-free 390 px mobile rendering, and absence of application console errors.

## Lesson 380 validation

- Reference: `0565-reference.png`
- Current capture: `0565-desktop.png`
- Mobile capture: `0565-mobile.png`
- Canvas-only capture: `0565-canvas.png`
- Machine-readable interaction and layout audit: `0565-dedicated-target-validation.json`
- The capture harness verifies A=(1,2,1), B=(4,6,3), Δ=(3,4,2), d²=29, and d≈5.39; edits both points to the challenge pair P=(0,0,0), Q=(2,-1,2) and proves Δ=(2,-1,2), d²=9, and d=3; exercises all three display layers and per-point reset; checks a physical OrbitControls gesture and nonblank canvas pixels; verifies fullscreen, tabs, shell reset, exact 1003 x 1568 desktop dimensions, a nonblank overflow-free 390 px mobile rendering, and absence of application console errors.

## Lesson 381 validation

- Reference: `0566-reference.png`
- Current capture: `0566-desktop.png`
- Mobile capture: `0566-mobile.png`
- Canvas-only capture: `0566-canvas.png`
- Machine-readable interaction and layout audit: `0566-dedicated-target-validation.json`
- The capture harness verifies the default P₀=(1,2,1), v=(2,1,3), r(1)=(3,3,4), and r(-1)=(-1,1,-2); sets the challenge model P=(0,1,2), v=(1,-2,1), t=3 and proves r(3)=(3,-5,5); exercises all three display layers and both states of the solution disclosure; checks physical orbit pixel changes and a nonblank canvas; verifies fullscreen, tabs, shell reset, exact 1002 x 1569 desktop dimensions, a nonblank overflow-free 390 px mobile rendering, and absence of application console errors.

## Lesson 382 validation

- Reference: `0567-reference.png`
- Current capture: `0567-desktop.png`
- Mobile capture: `0567-mobile.png`
- Canvas-only capture: `0567-canvas.png`
- Machine-readable interaction and layout audit: `0567-dedicated-target-validation.json`
- The capture harness verifies 2x+3y+z=6, intercepts (3,0,0)/(0,2,0)/(0,0,6), normal (2,3,1), and the passing test point P=(1,1,1); mutates the model to x+2y+2z=8 and proves intercepts (8,0,0)/(0,4,0)/(0,0,4), normal (1,2,2), and a failing test-point substitution; exercises all four display layers, both construction modes, incorrect/correct challenge outcomes and solution disclosure; checks physical orbit pixel changes and a nonblank canvas; verifies fullscreen, tabs, shell reset, exact 963 x 1633 dimensions, an overflow-free mobile canvas, and absence of application console errors.

## Lesson 383 validation

- Reference: `0568-reference.png`
- Current capture: `0568-desktop.png`
- Mobile capture: `0568-mobile.png`
- Canvas-only capture: `0568-canvas.png`
- Machine-readable interaction and layout audit: `0568-dedicated-target-validation.json`
- The capture harness verifies the default planes n₁=(1,2,2), n₂=(2,4,4), n₂=2n₁, dot product 18, parallel classification, and exact separation 0.33; mutates Plane B to (2,-1,0,1) and proves a perpendicular dot product of 0, then to (1,1,0,1) and proves the neither case; exercises correct classification choices, all three display layers, both challenge states, physical orbit pixel changes, fullscreen, tabs, and shell reset; verifies exact 1006 x 1564 dimensions, a nonblank overflow-free 390 px mobile rendering, and absence of application console errors.

## Lesson 384 validation

- Reference: `0569-reference.png`
- Current capture: `0569-desktop.png`
- Mobile capture: `0569-mobile.png`
- Canvas-only capture: `0569-canvas.png`
- Machine-readable interaction and layout audit: `0569-dedicated-target-validation.json`
- The capture harness verifies P₀=(1,1,1), v=(1,2,0), plane x+y+z=6, numerator 3, denominator 3, t=1, and I=(2,3,1); mutates the direction to (1,-1,0) and proves the no-intersection case, then moves P₀ to (2,3,1) and proves the line-contained-in-plane case; configures the challenge model and proves t=2 and I=(4,2,1); exercises incorrect/correct grading, solution disclosure, physical orbit pixel changes, fullscreen, tabs, and shell reset; verifies exact 1024 x 1536 dimensions, a nonblank 458 x 526 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 385 validation

- Reference: `0570-reference.png`
- Current capture: `0570-desktop.png`
- Mobile capture: `0570-mobile.png`
- Canvas-only capture: `0570-canvas.png`
- Machine-readable interaction and layout audit: `0570-dedicated-target-validation.json`
- The capture harness verifies Plane A x+y+z=6, Plane B x-y+z=2, normals n₁=(1,1,1) and n₂=(1,-1,1), cross product (2,0,-2), simplified direction (1,0,-1), sample point P=(4,2,0), and the resulting intersection line; changes Plane B to 2x+2y+2z=10 and proves the parallel/no-intersection branch, then to 2x+2y+2z=12 and proves the coincident branch; exercises all four scene layers, incorrect/correct challenge grades, clipboard result state, physical orbit pixel changes, fullscreen, tabs, and shell reset; verifies exact 1024 x 1536 dimensions with target-aligned section coordinates, a nonblank 488 x 471 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 386 validation

- Reference: `0571-reference.png`
- Current capture: `0571-desktop.png`
- Mobile capture: `0571-mobile.png`
- Canvas-only capture: `0571-canvas.png`
- Machine-readable interaction and layout audit: `0571-dedicated-target-validation.json`
- The capture harness verifies u=(1,0,0), v=(1,1,0), u·v=1, |u|=1, |v|=1.4142, cos θ=0.7071, and θ=45°; switches to the 135° obtuse result, proves 180° for opposite vectors, and proves the invalid state for a zero vector; exercises all three scene layers, translated-line mode, two additional computed challenges, clipboard/share state, fullscreen, tabs, and shell reset; physically drags the cyan vector endpoint and proves both the vector data and angle calculation change, verifies OrbitControls through changed canvas pixels, and confirms exact 989 x 1589 dimensions, target-aligned section coordinates, a nonblank 459 x 499 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 387 validation

- Reference: `0572-reference.png`
- Current capture: `0572-desktop.png`
- Mobile capture: `0572-mobile.png`
- Canvas-only capture: `0572-canvas.png`
- Machine-readable interaction and layout audit: `0572-dedicated-target-validation.json`
- The capture harness verifies n₁=(0,0,1), n₂=(0,1,1), n₁·n₂=1, |n₁|=1, |n₂|=1.4142, cos θ=0.7071, θ=45°, and hinge direction (-1,0,0); switches to the 135° obtuse result, proves 0° with no unique hinge for parallel normals, and proves the invalid state for a zero normal; exercises all three scene layers, incorrect/correct challenge grades, clipboard/share state, fullscreen, tabs, and shell reset; physically drags the cyan normal endpoint to (0.5815,-0.4301,1) and proves model/calculation changes, verifies OrbitControls through changed canvas pixels, and confirms exact 975 x 1614 dimensions with target-aligned section coordinates, a nonblank 481 x 565 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 388 validation

- Reference: `0573-reference.png`
- Current capture: `0573-desktop.png`
- Mobile capture: `0573-mobile.png`
- Canvas-only capture: `0573-canvas.png`
- Machine-readable interaction and layout audit: `0573-dedicated-target-validation.json`
- The capture harness verifies v=(1,1,1), n=(0,0,1), v·n=1, |v|=1.7321, |n|=1, sin θ=0.5774, θ=35.3°, complementary normal angle 54.7°, and projection (1,1,0); selects x=0 and proves projection (0,1,1), edits a custom normal, proves 90° for a perpendicular line, 0° for a parallel line, and invalidity for a zero direction; exercises both scene layers, the computed v=(0,1,1)/θ=45° experiment, clipboard/share state, fullscreen, tabs, and shell reset; physically drags the green line endpoint to update v=(1.2364,1.006,1), verifies OrbitControls through changed canvas pixels, and confirms exact 1586 x 992 target-aligned landscape dimensions, a nonblank 873 x 417 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 389 validation

- Reference: `0574-reference.png`
- Current capture: `0574-desktop.png`
- Mobile capture: `0574-mobile.png`
- Canvas-only capture: `0574-canvas.png`
- Machine-readable interaction and layout audit: `0574-dedicated-target-validation.json`
- The capture harness verifies P=(4,4,4), plane x+y+z=6, numerator 6, denominator 1.73, exact distance 2√3≈3.46, factor 2, and foot H=(2,2,2); configures P=(1,1,5) and z=2 and proves distance 3 with H=(1,1,2), proves distance 0 for an on-plane point, and proves invalidity for a zero normal; exercises both scene layers, the computed experiment, clipboard/share state, tabs, camera and shell resets; physically drags P to (4.54,8.74,4), verifies OrbitControls through changed canvas pixels, and confirms exact 963 x 1633 dimensions, a nonblank 403 x 737 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 390 validation

- Reference: `0575-reference.png`
- Current capture: `0575-desktop.png`
- Mobile capture: `0575-mobile.png`
- Canvas-only capture: `0575-canvas.png`
- Machine-readable interaction and layout audit: `0575-dedicated-target-validation.json`
- The capture harness verifies a=(3,2,1), b=(1,-1,2), a+b=(4,1,3), a·b=3, a×b=(5,-5,-5), |a|≈3.74, |b|≈2.45, and θ≈70.89°; increments aₓ and proves a=(4,2,1), sum=(5,1,3), dot=4, and cross=(5,-7,-6); exercises Add/Dot/Cross modes, axes, result steps, practice validation, clipboard/share state, fullscreen, tabs, orbit, and shell reset; physically drags a to (3.51,2.22,1), confirms exact 992 x 1586 dimensions, a nonblank 467 x 697 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 391 validation

- Reference: `0576-reference.png`
- Current capture: `0576-desktop.png`
- Mobile capture: `0576-mobile.png`
- Canvas-only capture: `0576-canvas.png`
- Machine-readable interaction and layout audit: `0576-dedicated-target-validation.json`
- The capture harness verifies side a=4, V=64, S=96, face diagonal 4√2≈5.66, space diagonal 4√3≈6.93, and topology 8/12/6; resizes to a=2.5 and proves V=15.63, S=37.5, dᶠ≈3.54, and d≈4.33; exercises both diagonal layers, the genuine six-face net, clickable face highlight, clipboard/share state, orbit, reversible fullscreen, tabs, shell reset, and the a=5 experiment with V=125 and S=150; confirms exact 1009 x 1558 dimensions, a nonblank 425 x 619 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 392 validation

- Reference: `0577-reference.png`
- Current capture: `0577-desktop.png`
- Mobile capture: `0577-mobile.png`
- Canvas-only capture: `0577-canvas.png`
- Machine-readable interaction and layout audit: `0577-dedicated-target-validation.json`
- The capture harness verifies l=5, w=3, h=2, V=30, S=62, base area 15, face diagonal √34≈5.83, and space diagonal √38≈6.16; steps to (6,2,3) and proves V=36, S=72, base 12, face diagonal ≈6.32, and space diagonal 7; exercises both diagonal layers, the genuine six-face rectangular net, clipboard/share state, tabs, shell reset, and the (4,2,3) practice model with V=24 and S=52; verifies physical orbit pixel changes, exact 1173 x 1341 dimensions, a nonblank 536 x 477 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 393 validation

- Reference: `0578-reference.png`
- Current capture: `0578-desktop.png`
- Mobile capture: `0578-mobile.png`
- Canvas-only capture: `0578-canvas.png`
- Machine-readable interaction and layout audit: `0578-dedicated-target-validation.json`
- The capture harness verifies the default triangular prism b=6, h=4, L=5, base area 12, perimeter 16, volume 60, lateral area 80, and total area 104; switches to a rectangle and proves 24/20/120/100/148, switches to a regular hexagon and proves 93.53/36/467.65/180/367.06, then edits the triangle to b=8, h=6, L=7 and proves base area 24 and volume 168; exercises all three display/net layers, clipboard/share state, orbit, reversible fullscreen, tabs, and shell reset; confirms exact 1173 x 1341 dimensions, a nonblank 509 x 526 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.
