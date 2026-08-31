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

Completed in this family: **9 / 50**. Pending in this family: **41 / 50**.

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
