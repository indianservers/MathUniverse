# 3D Geometry and Solids UI Upgrade

Target references begin at `0563` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup |                                Lesson | Dedicated surface                   | Real model and controls                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Exact-size evidence                                                                                                                                                                                                                                    | Status   |
| ------ | ------------------------------------: | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 0563   |              378 3D Coordinate System | `CoordinateSystemTargetLesson378`   | React Three Fiber spatial axes and projection planes, orbit/zoom, directly draggable point, synchronized x/y/z numeric and range controls, live ordered triple, step path, projection coordinates, distance, three display toggles, camera reset/fullscreen, tabs/reset, and graded coordinate-order challenge                                                                                                                                                                                                                                                           | 1002 x 1569; nonblank 498 x 560 WebGL canvas; no overflow or application console errors                                                                                                                                                                | Complete |
| 0564   |                         379 3D Points | `PointsTargetLesson379`             | React Three Fiber multi-point plotter with independently selectable A/B/C points, direct selected-point dragging at fixed height, synchronized x/y/z range and numeric controls, dynamic add-point and snap-to-grid commands, orbit/zoom, spatial wall grids, axis ticks, drop lines, xy shadows, selected step path, labels, coordinate table, live height/octant/highest-point calculations, four display toggles, camera reset/fullscreen, tabs/reset, and graded highest-point challenge                                                                             | 987 x 1593 desktop plus 390 x 844 mobile viewport; nonblank 517 x 459 WebGL canvas; no overflow or application console errors                                                                                                                          | Complete |
| 0565   |                    380 Distance in 3D | `DistanceTargetLesson380`           | React Three Fiber two-point distance model with independently editable and directly draggable A/B points, per-point reset, live Δx/Δy/Δz and squared-distance calculations, distance segment, rectangular component box, component-step arrows, three display toggles, orbit/zoom, camera reset/fullscreen, tabs/reset, and target formula/worked/practice derivations                                                                                                                                                                                                   | 1003 x 1568 desktop plus 390 x 844 mobile viewport; nonblank 478 x 498 WebGL canvas; no overflow or application console errors                                                                                                                         | Complete |
| 0566   |                       381 Lines in 3D | `LinesTargetLesson381`              | React Three Fiber parametric-line model with editable anchor and direction vectors, live t range/numeric control, calculated selected and t=-1 points, sample-point layer, direction-step layer, equation layer, orbit/zoom and camera reset/fullscreen, tabs/reset, and interactive challenge-solution disclosure                                                                                                                                                                                                                                                       | 1002 x 1569 desktop plus 390 x 844 mobile viewport; nonblank 467 x 544 WebGL canvas; no overflow or application console errors                                                                                                                         | Complete |
| 0567   |                            382 Planes | `PlanesTargetLesson382`             | React Three Fiber plane-equation model with editable A/B/C/D coefficients, live intercept triangle, normal vector, test-point substitution and pass/fail state, equation/intercept construction modes, four display layers, orbit/zoom/pan and camera reset/fullscreen, tabs/reset, and graded normal-vector challenge with solution disclosure                                                                                                                                                                                                                          | 963 x 1633 desktop plus 390 x 844 mobile viewport; nonblank 459 x 476 WebGL canvas; no overflow or application console errors                                                                                                                          | Complete |
| 0568   | 383 Parallel and Perpendicular Planes | `ParallelPlanesTargetLesson383`     | React Three Fiber two-plane comparator with eight editable coefficients, automatic parallel/perpendicular/neither classification, scalar-multiple and dot-product calculations, exact parallel-plane separation, three classification controls with correctness state, normal/separation/dot visibility layers, comparison-spaced default scene, real nonparallel orientations, orbit/zoom, fullscreen/tabs/reset, and interactive challenge validation                                                                                                                  | 1006 x 1564 desktop plus 390 x 844 mobile viewport; nonblank 470 x 513 WebGL canvas; no overflow or application console errors                                                                                                                         | Complete |
| 0569   |           384 Line-Plane Intersection | `LinePlaneTargetLesson384`          | React Three Fiber parametric-line and plane model with editable line point/direction and plane coefficients, exact numerator/denominator solver for single/parallel/contained cases, live substitution and intersection calculations, orbit/zoom/pan, camera reset/fullscreen, tabs/reset, and graded challenge with solution disclosure                                                                                                                                                                                                                                 | 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 458 x 526 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0570   |          385 Plane-Plane Intersection | `PlanePlaneTargetLesson385`         | React Three Fiber two-plane model with eight editable coefficients, exact normal/cross-product/intersection-line solver, computed sample point and simplified direction, explicit intersecting/parallel/coincident classifications, four live scene layers, orbit/zoom/pan and camera reset/fullscreen, active tabs, clipboard result actions, and a genuinely graded challenge                                                                                                                                                                                          | 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 488 x 471 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0571   |               386 Angle Between Lines | `AngleLinesTargetLesson386`         | React Three Fiber two-vector angle model with directly draggable arrowheads, six synchronized coefficient inputs, exact dot product/magnitude/cosine/angle calculations, acute and obtuse branches, zero-vector validation, normalized display arrows, angle arc and translated-line layers, orbit/zoom, fullscreen/tabs/reset/share, and live computed challenge cycling                                                                                                                                                                                                | 989 x 1589 desktop plus 390 px mobile rendering; nonblank 459 x 499 WebGL canvas; no overflow or application console errors                                                                                                                            | Complete |
| 0572   |              387 Angle Between Planes | `AnglePlanesTargetLesson387`        | React Three Fiber two-plane dihedral model with six editable coefficients and directly draggable normal endpoints, exact dot product/magnitude/cosine/angle calculations, computed cross-product hinge, acute/obtuse and zero/parallel branches, three live scene layers, orbit/zoom, fullscreen/tabs/reset/share, and a genuinely graded challenge                                                                                                                                                                                                                      | 975 x 1614 desktop plus 390 px mobile rendering; nonblank 481 x 565 WebGL canvas; no overflow or application console errors                                                                                                                            | Complete |
| 0573   |      388 Angle Between Line and Plane | `AngleLinePlaneTargetLesson388`     | React Three Fiber line/plane inclination model with six editable coefficients and directly draggable line/normal endpoints, exact projection, dot product, magnitudes, sine, line-plane angle and complementary normal angle, coordinate-plane selector with custom-normal state, projection/normal layers, orbit/zoom, fullscreen/tabs/reset/share, and a computed 45-degree experiment                                                                                                                                                                                 | 1586 x 992 landscape desktop plus 390 px mobile rendering; nonblank 873 x 417 WebGL canvas; no overflow or application console errors                                                                                                                  | Complete |
| 0574   |           389 Point-to-Plane Distance | `PointPlaneDistanceTargetLesson389` | React Three Fiber point/plane distance model with seven editable coordinates and coefficients, directly draggable point, exact numerator/denominator/distance and perpendicular-foot calculations, valid/on-plane/zero-normal branches, perpendicular and foot layers, orbit/zoom, camera reset, tabs/reset/share, and a computed z=2 experiment                                                                                                                                                                                                                         | 963 x 1633 desktop plus 390 px mobile rendering; nonblank 403 x 737 WebGL canvas; no overflow or application console errors                                                                                                                            | Complete |
| 0575   |                        390 3D Vectors | `VectorsTargetLesson390`            | React Three Fiber two-vector operations model with six working component steppers, directly draggable vector endpoints, exact sum/dot/cross/magnitude/cosine/angle calculations, Add/Dot/Cross modes, axes layer, orbit/zoom, fullscreen, result steps, tabs/reset/share, right-hand-rule guidance, and checked vector-addition practice                                                                                                                                                                                                                                 | 992 x 1586 desktop plus 390 px mobile rendering; nonblank 467 x 697 WebGL canvas; no overflow or application console errors                                                                                                                            | Complete |
| 0576   |                              391 Cube | `CubeTargetLesson391`               | React Three Fiber parametric cube model with synchronized side slider/numeric control, exact volume/surface/face-diagonal/space-diagonal calculations, independent diagonal layers, genuine six-face net, clickable face/net highlighting, orbit/zoom, reversible fullscreen, tabs/reset/share, Euler topology, and a computed a=5 experiment                                                                                                                                                                                                                            | 1009 x 1558 desktop plus 390 px mobile rendering; nonblank 425 x 619 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0577   |                            392 Cuboid | `CuboidTargetLesson392`             | React Three Fiber parametric cuboid model with six working length/width/height steppers, exact volume/surface/base/face-diagonal/space-diagonal calculations, independent diagonal layers, genuine six-face rectangular net, orbit/zoom, tabs/reset/share, edge/face/right-angle structure, and a computed 4×2×3 practice model                                                                                                                                                                                                                                          | 1173 x 1341 desktop plus 390 px mobile rendering; nonblank 536 x 477 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0578   |                             393 Prism | `PrismTargetLesson393`              | React Three Fiber generated Triangle/Rectangle/Hexagon cross-sections extruded by editable length, synchronized base/height/length sliders and numeric controls, exact base/perimeter/volume/lateral/surface calculations, independent base/lateral/net layers, orbit/zoom, reversible fullscreen, tabs/reset/share, and practice guidance                                                                                                                                                                                                                               | 1173 x 1341 desktop plus 390 px mobile rendering; nonblank 509 x 526 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0579   |                           394 Pyramid | `PyramidTargetLesson394`            | React Three Fiber generated regular Square/Triangle/Pentagon pyramids with editable side/height controls, exact apothem/radius/base/volume/slant/lateral/surface calculations, independent height/slant/net layers, orbit/zoom, reversible fullscreen, tabs/reset/share, action count, and validated practice                                                                                                                                                                                                                                                            | 1173 x 1341 desktop plus 390 px mobile rendering; nonblank 507 x 578 WebGL canvas; no overflow or application console errors                                                                                                                           | Complete |
| 0580   |                       395 Tetrahedron | `TetrahedronTargetLesson395`        | React Three Fiber four-vertex tetrahedron with directly draggable A/B/C/D points, four selectable base faces, exact face normals/areas/perpendicular heights/determinant volume/centroid/edge measurements, live selected-base height mutation, slice plane, Select/Move/Measure/Slice/Explode tools, net and auto-rotation, tabs/reset/share, and computed volume challenge                                                                                                                                                                                             | 864 x 1821 desktop plus 390 px mobile rendering; nonblank 452 x 635 WebGL canvas; no overflow or application console errors                                                                                                                            | Complete |
| 0581   |                 396 Regular Polyhedra | `RegularPolyhedraTargetLesson396`   | Six React Three Fiber canvases: a dedicated selectable main model and real rendered previews for all five Platonic solids; exact face/edge/vertex/Euler/Schläfli data, actual dual-geometry replacement, orbit/pan/zoom/reset, face hover state, tabs, exact comparison table, and graded octahedron challenge with hint and solution                                                                                                                                                                                                                                    | Exact 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 397 x 369 main WebGL canvas and five solid preview canvases; no overflow or application console errors                                                                                | Complete |
| 0582   |                          397 Cylinder | `CylinderTargetLesson397`           | React Three Fiber parametric outer cylinder and independent liquid mesh driven by editable radius, height, and fill; Fill/Unfold/Cross-section modes, four real camera presets, orbit/zoom/reset, animated and restartable fill, generated dimension-aware net, three calculated cross-sections, exact volume/curved-area/total-area formulas, tabs/reset/share, worked example, and graded target-volume challenge                                                                                                                                                      | Exact 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 340 x 455 WebGL canvas; no overflow or application console errors                                                                                                                     | Complete |
| 0583   |                              398 Cone | `ConeTargetLesson398`               | React Three Fiber parametric cone driven by editable radius and height with computed locked slant length, real orbit/reset, dynamically generated sector net and base circle, exact arc length and sector angle, live same-dimension cylinder comparison, exact volume/curved-area/total-area formulas, tabs/reset/share, worked example, and four-step computed 3–4–5 cone challenge                                                                                                                                                                                    | Exact 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 276 x 286 WebGL canvas inside the target dark stage; no overflow or application console errors                                                                                        | Complete |
| 0584   |                            399 Sphere | `SphereTargetLesson399`             | React Three Fiber parametric transparent sphere with editable radius, slice height, computed slice radius, great-circle and slice layers, rotatable longitude meridian, spatial axes and radius line; real orbit/pan/zoom, orthographic/perspective cameras, timed rotation, layer intensity, exact area/volume/scaling formulas, Archimedes comparison, graded tripling challenge, tabs/reset/share, persistent save, and real PNG export                                                                                                                               | Exact 864 x 1821 desktop plus 390 px mobile rendering; nonblank 467 x 575 WebGL canvas; no overflow or application console errors                                                                                                                      | Complete |
| 0585   |                        400 Hemisphere | `HemisphereTargetLesson400`         | React Three Fiber spherical-cut model with a solid selected cap and complementary translucent spherical section, editable radius and cut plane, computed cut radius, top/bottom and solid/open-bowl modes, independent plane/base/radius/isolation layers, whole-sphere comparison, undo/redo history, real orbit/zoom/reset, orthographic/perspective cameras, timed rotation, reversible fullscreen, exact volume/curved-area/total-area formulas, tabs/reset/share, and two genuinely graded area challenges                                                          | Exact 928 x 1695 desktop plus 390 px mobile rendering; nonblank 359 x 560 desktop and 347 x 562 mobile WebGL canvases; target-aligned section coordinates; no overflow or application console errors                                                   | Complete |
| 0586   |                           401 Frustum | `FrustumTargetLesson401`            | React Three Fiber parametric conical frustum with directly draggable top-radius, bottom-radius, and height handles; synchronized range/numeric controls; removable original-cone construction; exact similar-triangle recovery; dynamic mathematically correct annular-sector net and circular bases; folded-solid mode; real orbit/reset and reversible fullscreen; exact slant, volume, curved-area, total-area, original-height, original-volume, and net-angle calculations; live worked example; and genuinely graded two-value original-cone challenge             | Exact 984 x 1599 desktop plus 390 px mobile rendering; nonblank 439 x 445 desktop and 352 x 445 mobile WebGL canvases; exact target section coordinates and exact primary-object color bounds; no overflow or application console errors               | Complete |
| 0587   |             402 Surface of Revolution | `SurfaceRevolutionTargetLesson402`  | React Three Fiber lathed surface generated from a selectable curve and editable interval, with a directly draggable graph endpoint, x/y rotation axes, partial/full revolution angle, washer/shell interpretations, animated current cross-section, real orbit and perspective/orthographic cameras; exact default washer volume and symbolic surface result plus numerical integration for alternate curves/axes; synchronized 2D graph, 3D surface, derivations, tabs/reset/share/workspace actions; and a genuinely graded curve-dependent solid-prediction challenge | Exact 1024 x 1536 desktop plus 390 px mobile rendering; nonblank 426 x 432 desktop and 320 x 432 mobile WebGL canvases; exact target section/canvas coordinates and target-matched surface pixel bounds; no overflow or application console errors     | Complete |
| 0588   |                         403 Extrusion | `ExtrusionTargetLesson403`          | React Three Fiber extrusion geometry generated from selectable triangle, circle, and L-shaped profiles; draggable sweep-depth range with real undo/redo; straight and oblique paths; invariant and linearly tapered cross-sections; synchronized profile area, perimeter, volume, and lateral-area calculations; real orbit, zoom, camera reset, fullscreen, tabs/reset/share/language actions; exact worked example; and a genuinely graded target-volume challenge                                                                                                     | 1024 px target-width desktop plus 390 px mobile rendering; nonblank 245 x 310 desktop and 133 x 310 mobile WebGL canvases; target-aligned hero/tabs/builder/stage/formula coordinates; no overflow or application console errors                       | Complete |
| 0589   |                    404 Nets of Solids | `NetsSolidsTargetLesson404`         | React Three Fiber linked solid/net system with six independently colored cube faces, continuous unfold/fold state, timed animation, real OrbitControls, and distinct cube/triangular-prism/square-pyramid geometries; directly draggable and click-rotatable SVG faces with connected-net validity feedback; working edge tabs, eight selectable cube nets and deterministic random-net action; synchronized face count and surface area; clipboard share; and a genuinely graded six-net challenge                                                                      | Exact 987 x 1593 target viewport plus 390 px mobile rendering; nonblank 375 x 445 desktop and mobile WebGL canvases; target-aligned hero/picker/builder/net/scene/gallery/challenge/navigation coordinates; no overflow or application console errors  | Complete |
| 0590   |                    405 Cross-Sections | `CrossSectionsTargetLesson405`      | React Three Fiber cube/cone/cylinder slicing engine with a directly draggable and range-controlled plane, editable tilt, trace toggle and timed sweep; exact edge-plane intersection polygon for cube slices with ordered vertices, side lengths, perimeter and local-plane area; generated circle/ellipse conic sections; real orbit, zoom, fullscreen/exit, tabs/reset/share/calculation disclosure; live challenge completion, six-way prediction grading, and three working example presets                                                                          | Exact 1024 x 1536 target viewport plus 390 px mobile rendering; nonblank 555 x 465 desktop and mobile WebGL canvases; target-aligned hero/tabs/lab/scene/result/prediction/examples/tip coordinates; no overflow or application console errors         | Complete |
| 0591   |                            406 Volume | `VolumeTargetLesson406`             | Six React Three Fiber canvases with dedicated rectangular-prism, cylinder, square-pyramid, cone, and sphere models; generated layer slices, cross-section planes, floor grids, measurement guides, real orbit dragging, solid selection, timed auto/manual fill animation, synchronized base/height/prism dimensions, exact volume ratios, seven-unit conversion engine with six working quick conversions, worked derivation, clipboard share/reset, and genuinely graded target-volume challenge using the selected solid's formula                                    | Exact 957 x 1644 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned hero/selector/comparison/ratio/slice/tools/challenge/navigation composition; no overflow or application console errors        | Complete |
| 0592   |                      407 Surface Area | `SurfaceAreaTargetLesson407`        | React Three Fiber seven-solid gallery with a six-face clickable cuboid model linked to a clickable dimension-aware SVG net and face visibility list; real orbit/auto-rotate/wireframe controls, editable length/breadth/height, open-top subtraction, per-solid area formulas, fold/reset, timed paint coverage, synchronized options, three unit modes, curved-vs-total comparison, working packing layouts with computed waste, clipboard share/bookmark, worked derivation, and genuinely graded minimum-material challenge                                           | Exact 938 x 1677 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned hero/tabs/picker/linked lab/cover/context/example/challenge/navigation coordinates; no overflow or application console errors | Complete |
| 0593   |        408 Euler's Polyhedron Formula | `EulerFormulaTargetLesson408`       | React Three Fiber topology counter with generated cube/tetrahedron/octahedron/dodecahedral vertex and nearest-neighbor edge graphs, clickable unique vertex/edge/face objects, duplicate-safe counted sets, keyboard-accessible element counters, per-kind and global reset, four real solid replacements, rotate/pan/zoom/unfold modes, live Euler verification, dual-solid and torus comparisons, real icosahedron hero/challenge models, reference table, worked cube, clipboard share/workspace, and genuinely graded 12/30/20 no-double-counting challenge          | Exact 1006 x 1564 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned hero/interaction/stage/counts/concepts/reference/challenge coordinates; no overflow or application console errors            | Complete |
| 0594   |          409 Transparent / X-Ray Mode | `XRayModeTargetLesson409`           | Three synchronized React Three Fiber views of one composite prism object model with an internal cylindrical cavity, inscribed sphere, space and base diagonals, cross-section plane, and center lines; real opacity control, seven independent structure layers, three hidden-edge treatments, orbit controls, six tabs, rendering-pipeline guidance, clipboard share/reset/workspace actions, exact live measurements, and an interactive opaque/transparent/X-Ray hidden-diagonal challenge with length and solution disclosures                                       | Exact 890 x 1767 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned hero/tabs/explorer/comparison/guides/challenge/measurements/navigation coordinates; no overflow or application console errors | Complete |
| 0595   |                 410 Camera Controls | `CameraControlsTargetLesson410`     | React Three Fiber camera-training model with a fixed asymmetric solid, real orbit/pan/zoom modes, perspective and orthographic cameras, live position/target/azimuth/elevation/distance telemetry, fit/reset and viewpoint presets, mouse/touch gesture coach, functional keyboard shortcuts, four guided camera exercises, selectable before/after views, synchronized camera previews, clipboard share, and a genuinely scored orientation/centering/zoom view-matching challenge | Exact 960 x 1639 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned 190 px sidebar and hero/tabs/lab/guides/comparison/reference/challenge/navigation coordinates; no overflow or application console errors | Complete |
| 0596   |              411 Orthographic Views | `OrthographicViewsTargetLesson411`  | One explicit nine-block stepped-solid topology shared by a rotatable React Three Fiber model, generated front/top/right projection engine, corresponding-cell selection, exact width/height/depth dimensions, hidden-line and projection-ray layers, Edges/Faces/Shaded modes, real rotate/pan/zoom controls, first- and third-angle layouts, scale and unit conversion, worked reconstruction, and a layer-aware block builder with genuinely graded exact-topology challenge | Exact 946 x 1662 target viewport plus 390 x 844 mobile rendering; nonblank desktop/mobile WebGL canvases; target-aligned 197 px sidebar and hero/tabs/linked workspace/how/compare/example/challenge/navigation coordinates; no overflow or application console errors | Complete |

Completed in this family: **34 / 50**. Pending in this family: **16 / 50**.

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

## Lesson 394 validation

- Reference: `0579-reference.png`
- Current capture: `0579-desktop.png`
- Mobile capture: `0579-mobile.png`
- Canvas-only capture: `0579-canvas.png`
- Machine-readable interaction and layout audit: `0579-dedicated-target-validation.json`
- The capture harness verifies the default square pyramid s=4, h=6, base area 16, volume 32, slant height ≈6.32, lateral area ≈50.60, and total area ≈66.60; switches to an equilateral-triangle base and proves 6.93/13.86/6.11/36.66/43.59, switches to a regular pentagon and proves 27.53/55.06/6.60/66.01/93.54, then edits the square to s=6, h=8 and proves base area 36, volume 96, and slant height ≈8.54; exercises all three height/slant/net layers, practice, clipboard/share state, orbit, reversible fullscreen, tabs, and shell reset; confirms exact 1173 x 1341 dimensions, a nonblank 507 x 578 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 395 validation

- Reference: `0580-reference.png`
- Current capture: `0580-desktop.png`
- Mobile capture: `0580-mobile.png`
- Canvas-only capture: `0580-canvas.png`
- Machine-readable interaction and layout audit: `0580-dedicated-target-validation.json`
- The capture harness verifies A=(0,0,0), B=(6,0,0), C=(0,4,0), D=(2,4/3,5), base ABC area 12, perpendicular height 5, centroid (2,1.333,1.25), and volume 20; selects bases ABD/ACD/BCD and proves each independently computed area/height still yields invariant volume 20; changes the ABC height to 7 and proves volume 28, changes slice position, exercises Move/Measure/Slice/Explode, net, auto-rotation, challenge grading, clipboard/share, tabs, and shell reset; physically drags A to (1.086,0.459,0), verifies orbit pixel changes, and confirms exact 864 x 1821 dimensions, a nonblank 452 x 635 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 396 validation

- Reference: `0581-reference.png`
- Current capture: `0581-desktop.png`
- Mobile capture: `0581-mobile.png`
- Canvas-only capture: `0581-canvas.png`
- Machine-readable interaction and layout audit: `0581-dedicated-target-validation.json`
- The capture harness selects every Platonic solid and verifies Tetrahedron 4/6/4 {3,3}, Cube 6/12/8 {4,3}, Octahedron 8/12/6 {3,4}, Dodecahedron 12/30/20 {5,3}, and Icosahedron 20/30/12 {3,5}; proves the Cube dual command replaces the actual model with Octahedron; exercises orbit, pan, zoom, camera reset, tabs, back-to-lesson, wrong and correct grading, hint, solution, and shell reset; confirms physical orbit pixel changes, exact 1024 x 1536 dimensions, a nonblank 397 x 369 main canvas plus five rendered solid previews, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 397 validation

- Reference: `0582-reference.png`
- Current capture: `0582-desktop.png`
- Mobile capture: `0582-mobile.png`
- Canvas-only capture: `0582-canvas.png`
- Machine-readable interaction and layout audit: `0582-dedicated-target-validation.json`
- The capture harness verifies the target r=3, h=5, fill=72%, V≈141.372, curved area≈94.248, total area≈150.796, and horizontal area≈28.274; edits to r=4, h=6, fill=55% and proves V≈301.593, curved area≈150.796, and total area≈251.327; exercises Fill/Unfold/Cross-section modes, Top/Front/Right/Rotate cameras, physical orbit pixel change, animated fill and restart, axial and half-axial section calculations, wrong/correct challenge grading, new challenge, clipboard/share, tabs, and shell reset; confirms exact 1024 x 1536 dimensions, a nonblank 340 x 455 WebGL canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 398 validation

- Reference: `0583-reference.png`
- Current capture: `0583-desktop.png`
- Mobile capture: `0583-mobile.png`
- Canvas-only capture: `0583-canvas.png`
- Machine-readable interaction and layout audit: `0583-dedicated-target-validation.json`
- The capture harness verifies the target 3–4–5 cone with slant 5, cone volume 12π, comparison-cylinder volume 36π, curved area 15π, total area 24π, and sector angle 216°; scales to a similar 6–8–10 cone and proves 96π/288π/60π/96π with the invariant 216° sector; changes to a non-similar 5–12–13 cone and proves 100π/300π/65π/90π and θ≈138.462°; exercises physical orbit, camera reset, tabs, clipboard/share, local reset, all four computed challenge steps and invalidation after changing radius, plus shell reset; confirms exact 1024 x 1536 dimensions, a nonblank 276 x 286 WebGL canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 399 validation

- Reference: `0584-reference.png`
- Current capture: `0584-desktop.png`
- Mobile capture: `0584-mobile.png`
- Canvas-only capture: `0584-canvas.png`
- Machine-readable interaction and layout audit: `0584-dedicated-target-validation.json`
- The capture harness verifies target R=5, z=2, slice radius √21≈4.5826, area coefficient 100, and volume coefficient 500/3≈166.6667; edits to R=6 and z=3 and proves slice radius √27≈5.1962, area 144π, and volume 288π; reduces R to 2 and proves z clamps to 2 with zero slice radius; exercises longitude 120°, great-circle/layer toggles, layer intensity, orthographic/perspective cameras, physical orbit, camera reset, timed rotation and stop, wrong/correct tripling challenge grading, persistent workspace JSON, real sphere-lesson-399.png download, clipboard/share, tabs, and shell reset; confirms exact 864 x 1821 dimensions, a nonblank 467 x 575 WebGL canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 400 validation

- Reference: `0585-reference.png`
- Current capture: `0585-desktop.png`
- Mobile capture: `0585-mobile.png`
- Canvas-only capture: `0585-canvas.png`
- Machine-readable interaction and layout audit: `0585-dedicated-target-validation.json`
- The capture harness verifies target r=4, cut height 0, cut radius 4, volume coefficient 128/3, curved-area coefficient 32, and total-area coefficient 48; changes the cut to 0.6 and proves cut radius 3.2; edits to r=6, bottom half, open bowl, and 45% opacity and proves cut radius 4.8, volume 144π, curved area 72π, and total area 108π; exercises every plane/base/radius/isolation layer, undo/redo, whole-sphere and isolated views, zoom, orthographic/perspective cameras, physical orbit pixel changes, timed rotation and stop, reversible fullscreen, curved/total challenge grading, clipboard/share, tabs, and shell reset; confirms exact target section coordinates in a 928 x 1695 desktop capture, a nonblank 359 x 560 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 401 validation

- Reference: `0586-reference.png`
- Current capture: `0586-desktop.png`
- Mobile capture: `0586-mobile.png`
- Canvas-only capture: `0586-canvas.png`
- Machine-readable interaction and layout audit: `0586-dedicated-target-validation.json`
- The capture harness verifies target R=5, r=2, h=4, s=5, volume 52π, curved area 35π, total area 64π, recovered original height 20/3, removed height 8/3, original-cone volume 500π/9, and mathematically correct 216° annular-sector angle; edits to R=6, r=3, h=8 and proves s=√73, volume 168π, curved area 9√73π, and total area (45+9√73)π; physically drags the top-radius handle from 3 to 3.7059 and proves all dependent values change; exercises removed-cone and folded-net states, physical OrbitControls pixel changes, camera reset, reversible fullscreen, every hero command, incorrect/correct two-value challenge grading, and a final reset to the target values; confirms exact 984 x 1599 dimensions and every target section coordinate, exact primary-object blue bounds x=360–590/y=402–654, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 402 validation

- Reference: `0587-reference.png`
- Current capture: `0587-desktop.png`
- Mobile capture: `0587-mobile.png`
- Canvas-only capture: `0587-canvas.png`
- Machine-readable interaction and layout audit: `0587-dedicated-target-validation.json`
- The capture harness verifies the target y=√x curve on [0,4], x-axis, 360° revolution, washer mode, V=8π, and surface coefficient (17√17−1)/6≈11.5155; changes to a 240° partial revolution and restores 360°, switches to y-axis washer and shell modes and proves the common 25.6π volume, cycles to constant and semicircle curves with corresponding cylinder/sphere predictions, edits the interval to [1,5], physically drags b to 5.6166, and proves dependent integrations change; exercises animated section restart/advance/pause, perspective/orthographic cameras, physical OrbitControls pixel changes, incorrect/correct curve-dependent prediction grading, tabs, clipboard/share, and full reset; confirms exact 1024 x 1536 dimensions, target workspace/controls/plot/scene/formula/bottom/navigation coordinates, target-matched surface bounds x=624–910/y=499–710, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 403 validation

- Reference: `0588-reference.png`
- Current capture: `0588-desktop.png`
- Mobile capture: `0588-mobile.png`
- Canvas-only capture: `0588-canvas.png`
- Machine-readable interaction and layout audit: `0588-dedicated-target-validation.json`
- The capture harness verifies the target triangle profile with area 6, perimeter 6, depth 8, volume 48, and lateral area 48; drags depth to 10 and proves the volume-60 challenge grades correctly; verifies real undo and redo; switches to an oblique path and a linearly tapered cross-section and proves the integrated volume 41.45; replaces the actual Three.js geometry with a circle extrusion; exercises Select, fullscreen and exit, physical OrbitControls pixel changes, and full reset; confirms target-aligned hero/tabs/builder/stages/formula coordinates at 1024 px, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 404 validation

- Reference: `0589-reference.png`
- Current capture: `0589-desktop.png`
- Mobile capture: `0589-mobile.png`
- Canvas-only capture: `0589-canvas.png`
- Machine-readable interaction and layout audit: `0589-dedicated-target-validation.json`
- The capture harness verifies the target cube, six unit-square faces, surface area 6, 100% fold, selected standard net, visible edge tabs, and initial 2/4 challenge state; physically drags a net face and proves the net becomes disconnected/invalid, then reconnects it; disables edge tabs; unfolds and animates the six-face model to 44%; replaces the actual 3D object and linked net with triangular-prism and square-pyramid models and verifies their five-face/area states; loads cube-net gallery item 3; selects D and F to produce the exact A/C/D/F valid set and proves the challenge grades correctly; exercises physical OrbitControls pixel changes and clipboard share; confirms the exact 987 x 1593 target viewport, target-aligned section coordinates, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 405 validation

- Reference: `0590-reference.png`
- Current capture: `0590-desktop.png`
- Mobile capture: `0590-mobile.png`
- Canvas-only capture: `0590-canvas.png`
- Machine-readable interaction and layout audit: `0590-dedicated-target-validation.json`
- The capture harness verifies the target diagonal cube section from exact plane/edge intersections: six vertices, six side lengths of 4, perimeter 24, and area 24√3 ≈ 41.5692; rotates to a horizontal plane and proves the resulting square has four vertices and area 32; moves the plane and then restores the diagonal state to complete the hexagon challenge; replaces the actual solid and section geometry with a horizontal cone/circle and oblique cylinder/ellipse; checks incorrect Triangle and correct Other/Hexagon predictions; exercises trace off/on, timed trace advance, calculation disclosure, reversible fullscreen, physical OrbitControls pixel changes, and clipboard share; confirms the exact 1024 x 1536 target viewport, target-aligned section coordinates, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 406 validation

- Reference: `0591-reference.png`
- Current capture: `0591-desktop.png`
- Mobile capture: `0591-mobile.png`
- Canvas-only capture: `0591-canvas.png`
- Machine-readable interaction and layout audit: `0591-validation.json`
- The capture harness verifies the target default B=12, h=5, ten layers, slice 2.5, prism/cylinder volume 60, pyramid/cone volume 20, and sphere volume 16π ≈ 50.2655; replaces the selected object across all five solid types; runs the manual fill animation from four through ten layers and proves it stops when Auto is off; disables the cross-section, recalculates a prism to volume 120, converts it to 120000 L, and grades incorrect then correct challenge dimensions; exercises physical OrbitControls pixel changes and clipboard share; confirms the exact 957 x 1644 target viewport, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 407 validation

- Reference: `0592-reference.png`
- Current capture: `0592-desktop.png`
- Mobile capture: `0592-mobile.png`
- Canvas-only capture: `0592-canvas.png`
- Machine-readable interaction and layout audit: `0592-validation.json`
- The capture harness verifies the closed 4 × 3 × 2 cuboid's six selected faces and total area 52; deselects the front face through the linked net and proves the exposed area becomes 44; resets and opens the top to produce area 40; edits dimensions to 5 × 4 × 3 and obtains area 94; replaces the object with a cube and cylinder and validates their formulas; folds the net, runs paint coverage from 0 to 100%, toggles dimensions/labels/net areas, switches to the 22-unit poor layout, grades it incorrect, then selects the 8-unit efficient layout and grades it correct; exercises physical OrbitControls pixel changes and clipboard share; confirms the exact 938 x 1677 target viewport, target-aligned section coordinates, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 408 validation

- Reference: `0593-reference.png`
- Current capture: `0593-desktop.png`
- Mobile capture: `0593-mobile.png`
- Canvas-only capture: `0593-canvas.png`
- Machine-readable interaction and layout audit: `0593-validation.json`
- The capture harness verifies the default cube's 8 vertices, 12 edges, 6 faces and Euler value 2; clears all count sets, counts one unique vertex/edge/face through the same topology model, and restores the complete cube; replaces the actual model and verifies tetrahedron 4/6/4, octahedron 6/12/8, and dodecahedral irregular 20/30/12 counts; exercises unfold, pan, zoom, rotate, and physical OrbitControls pixel changes; grades incorrect 10/20/12 and correct icosahedron 12/30/20 challenge counts; verifies clipboard share, exact 1006 x 1564 target viewport, target-aligned section coordinates, nonblank desktop/mobile WebGL canvases, no overflow, and no application console errors.

## Lesson 409 validation

- Reference: `0594-reference.png`
- Current capture: `0594-desktop.png`
- Mobile capture: `0594-mobile.png`
- Canvas-only capture: `0594-canvas.png`
- Machine-readable interaction and layout audit: `0594-validation.json`
- The capture harness verifies the shared 8 x 5 x 6 prism model's space diagonal sqrt(125) ~= 11.18, body diagonal sqrt(61) ~= 7.81, face diagonal sqrt(89) ~= 9.43, cylinder height 6, sphere diameter 5, and cross-section area 24; lowers opacity from 100% to 35% and proves rendered pixels change, disables and restores an internal layer and proves the model changes, exercises Show/Faint/Hide edge treatments, tabs, opaque/transparent/X-Ray challenge modes, length and solution disclosures, physical OrbitControls pixel changes, and clipboard share; confirms the exact 890 x 1767 target viewport, target-aligned section endpoints, a nonblank 141 x 275 canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 410 validation

- Reference: `0595-reference.png`
- Current capture: `0595-desktop.png`
- Mobile capture: `0595-mobile.png`
- Canvas-only capture: `0595-canvas.png`
- Machine-readable interaction and layout audit: `0595-validation.json`
- The capture harness verifies the default camera at (6.12, 4.38, 5.29), target (0, 0.25, 0), azimuth 49.16 degrees, elevation 27.05 degrees, distance 9.08, and 45-degree field of view; physically orbits and proves both pixels and telemetry change, pans and proves the controls target moves, wheel-zooms and proves distance decreases, switches to a real orthographic camera, exercises mouse/touch coaching, guided and before/after poses, top-view/projection/pan/zoom keyboard commands, computed orientation/centering/zoom challenge scoring, new target, clipboard share, and reset; confirms the exact 960 x 1639 target viewport, exact 190 px sidebar and section endpoints, a nonblank WebGL canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.

## Lesson 411 validation

- Reference: `0596-reference.png`
- Current capture: `0596-desktop.png`
- Mobile capture: `0596-mobile.png`
- Canvas-only capture: `0596-canvas.png`
- Machine-readable interaction and layout audit: `0596-validation.json`
- The capture harness verifies the shared stepped solid's exact 60 x 40 x 40 mm extents, front/top/right projections, first-angle layout and selected corresponding cell; physically orbits the WebGL solid and proves rendered pixels change, exercises Pan/Zoom and Edges/Faces/Shaded modes, enables hidden lines, disables and restores projection rays and dimensions, selects a projection cell and proves linked selection changes, switches to third-angle layout, scales from 1:1 to 1:2 and proves 120 x 80 x 80 mm, converts to 12 x 8 x 8 cm, enters build mode, rejects a one-block model, rebuilds the exact nine-block topology and accepts it, then exercises clipboard share and reset; confirms the exact 946 x 1662 target viewport, exact 197 px sidebar and section endpoints, a nonblank WebGL canvas, an overflow-free nonblank 390 px mobile rendering, and absence of application console errors.
