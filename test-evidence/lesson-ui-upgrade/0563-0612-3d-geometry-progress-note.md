# 3D Geometry and Solids UI Upgrade

Target references begin at `0563` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0563 | 378 3D Coordinate System | `CoordinateSystemTargetLesson378` | React Three Fiber spatial axes and projection planes, orbit/zoom, directly draggable point, synchronized x/y/z numeric and range controls, live ordered triple, step path, projection coordinates, distance, three display toggles, camera reset/fullscreen, tabs/reset, and graded coordinate-order challenge | 1002 x 1569; nonblank 498 x 560 WebGL canvas; no overflow or application console errors | Complete |
| 0564 | 379 3D Points | `PointsTargetLesson379` | React Three Fiber multi-point plotter with independently selectable A/B/C points, direct selected-point dragging at fixed height, synchronized x/y/z range and numeric controls, dynamic add-point and snap-to-grid commands, orbit/zoom, spatial wall grids, axis ticks, drop lines, xy shadows, selected step path, labels, coordinate table, live height/octant/highest-point calculations, four display toggles, camera reset/fullscreen, tabs/reset, and graded highest-point challenge | 987 x 1593 desktop plus 390 x 844 mobile viewport; nonblank 517 x 459 WebGL canvas; no overflow or application console errors | Complete |
| 0565 | 380 Distance in 3D | Pending | Pending | Pending | Pending |
| 0566 | 381 Lines in 3D | Pending | Pending | Pending | Pending |
| 0567 | 382 Planes | Pending | Pending | Pending | Pending |
| 0568 | 383 Parallel and Perpendicular Planes | Pending | Pending | Pending | Pending |
| 0569 | 384 Line-Plane Intersection | Pending | Pending | Pending | Pending |

Completed in this family: **2 / 50**. Pending in this family: **48 / 50**.

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
