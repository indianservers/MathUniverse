# Dynamic Geometry target batch 0263-0292

Updated 2026-08-24. This batch replaces the generic construction fallback for lessons 206-235 with dedicated lesson exports, lesson-specific object models, controls, formulas, construction guidance, tasks, and direct SVG interaction.

## Validation loop

- Compared each route with its matching target mockup at the target image dimensions.
- Exercised the first lesson control and the construction verifier on every route.
- Reloaded before each clean-state screenshot.
- Checked object-model identity, horizontal overflow, browser console errors, and page errors.
- Corrected the 960-1024 px navigation breakpoint so portrait mockups retain the desktop sidebar.
- Expanded the shared lesson grammar to include the target identity header, five lesson stages, model and measurements, definition, construction method, key rule, ordered steps, practice verification, adjacent navigation, and footer.

## Completed lessons

| Mockup | Lesson | Dedicated object model | Status |
|---:|---:|---|---|
| 0263 | 206 Ray | `ray` | Implemented and browser-validated |
| 0264 | 207 Polyline | `polyline` | Implemented and browser-validated |
| 0265 | 208 Perpendicular Line | `perpendicular` | Implemented and browser-validated |
| 0266 | 209 Parallel Line | `parallel` | Implemented and browser-validated |
| 0267 | 210 Perpendicular Bisector | `perpendicularBisector` | Implemented and browser-validated |
| 0268 | 211 Angle Bisector | `angleBisector` | Implemented and browser-validated |
| 0269 | 212 Tangent | `tangent` | Implemented and browser-validated |
| 0270 | 213 Best Fit Line | `bestFit` | Implemented and browser-validated |
| 0271 | 214 Triangle Constructor | `triangle` | Implemented and browser-validated |
| 0272 | 215 Regular Polygon | `regularPolygon` | Implemented and browser-validated |
| 0273 | 216 Rigid Polygon | `rigidTriangleMotion` | Reworked individually and browser-validated |
| 0274 | 217 General Polygon | `editableGeneralPolygon` | Reworked individually and browser-validated |
| 0275 | 218 Circle Centre and Point | `circleCentreThroughPoint` | Reworked individually and browser-validated |
| 0276 | 219 Circle Centre and Radius | `circleCentreFixedRadius` | Reworked individually and browser-validated |
| 0277 | 220 Circle through Three Points | `threePointCircumcircle` | Reworked individually and browser-validated |
| 0278 | 221 Compass | `compassDistanceTransfer` | Reworked individually and browser-validated |
| 0279 | 222 Semicircle | `diameterDefinedSemicircle` | Reworked individually and browser-validated |
| 0280 | 223 Circular Arc | `centerRadiusTwoPointArc` | Reworked individually and browser-validated |
| 0281 | 224 Circumcircular Arc | `threePointCircumcircleArc` | Reworked individually and browser-validated |
| 0282 | 225 Circular Sector | `centerRadiusAngleSector` | Reworked individually and browser-validated |
| 0283 | 226 Conic through Five Points | `fivePointHomogeneousConic` | Reworked individually and browser-validated |
| 0284 | 227 Ellipse | `ellipse` | Implemented and browser-validated |
| 0285 | 228 Hyperbola | `hyperbola` | Implemented and browser-validated |
| 0286 | 229 Parabola | `parabola` | Implemented and browser-validated |
| 0287 | 230 Distance / Length | `distance` | Implemented and browser-validated |
| 0288 | 231 Area | `area` | Implemented and browser-validated |
| 0289 | 232 Angle | `angle` | Implemented and browser-validated |
| 0290 | 233 Fixed Angle | `fixedAngle` | Implemented and browser-validated |
| 0291 | 234 Relation Checker | `relation` | Implemented and browser-validated |
| 0292 | 235 Construction Steps | `steps` | Implemented and browser-validated |

## Batch count

- Lessons completed in this batch: **30**
- Lessons pending in this requested batch: **0**
- Evidence: `0263-desktop.png` through `0292-desktop.png`
- Machine validation: `0263-0292-dedicated-target-validation.json`

## Real-control rework

### Lesson 206 / Mockup 0263 - Ray

Reworked individually against the target mockup. Removed the placeholder Direction and Scale sliders. The surface now uses draggable endpoint A and direction point B, editable coordinates, live length/angle/slope measurements, grid visibility, zoom, fullscreen, reset, clipboard sharing, stage navigation, and validated slope/angle/notation practice inputs. Final exact-viewport check at 1031x1526: no overflow, no console errors, and the full footer is visible.

### Lesson 207 / Mockup 0264 - Polyline

Reworked individually against the target mockup. Removed the placeholder Vertices and Spread sliders. The surface now owns an ordered vertex collection with direct point creation and dragging, real open/closed topology, snapshot undo, clear, zoom, fullscreen, closure tolerance, segment-by-segment Euclidean lengths, computed total length, loadable worked example, and coordinate-validated practice construction. Final exact-viewport check at 1024x1536: no overflow or console errors; automated verification confirms that dragging changes the underlying SVG point coordinate.

### Lesson 208 / Mockup 0265 - Perpendicular Line

Reworked individually against the target mockup. Replaced the Base angle and Point offset stand-ins with a given-line slope, draggable/editable point P, computed perpendicular slope, right-angle invariant, real Select/Point/Line/Perpendicular/Clear tools, random examples, zoom, fullscreen, compass-style construction sequence, and a gated practice construction. Fixed the 90-degree annotation so it no longer intercepts pointer input. Final exact-viewport check at 998x1576: no overflow or console errors; automated verification physically drags P and confirms its SVG coordinate changes before completing the practice construction.

### Lesson 209 / Mockup 0266 - Parallel Line

Reworked individually against the target mockup. The surface now owns a given line `y = sx + c`, an independently draggable/editable point P, and a dependent parallel line whose intercept is calculated as `P.y - s*P.x`. Slope edits rotate both lines while preserving equality; moving P translates only the constructed line. Angle/slope overlays, snap mode, zoom, fullscreen, reset, exact inputs, steppers, live invariant cards, worked construction, and checkbox-validated practice are functional. Final exact-viewport check at 1024x1536 physically drags P and verifies successful target practice with no overflow or console errors.

### Lesson 210 / Mockup 0267 - Perpendicular Bisector

Reworked individually against the target mockup. Removed the generic Segment angle and Half length stand-ins. The surface now owns draggable and editable endpoints A and B, computes midpoint M and the perpendicular direction, and derives construction intersections P and Q from two equal-radius circles. Auto and custom radius modes, arc and annotation visibility, zoom, fullscreen, reset, sharing, live equidistance measurements, and the five-stage navigation are functional. The practice point C is directly draggable and its answer is checked from the perpendicular-bisector dot-product invariant. Final exact-viewport check at 1024x1536 physically drags A, exercises both radius modes and every visibility control, and verifies the practice result with no overflow or console errors.

### Lesson 211 / Mockup 0268 - Angle Bisector

Reworked individually against the target mockup. Removed the generic Full angle and Ray length sliders. The surface now owns draggable vertex and arm points A, B, and C, derives the interior angle and normalized angle-bisector ray from those points, and keeps both half-angle measurements live. Arc visibility, Select, Pan, Compass, fullscreen, reset, sharing, construction overlays, proof-by-SSS content, and target navigation are functional. The practice panel owns a second draggable two-ray model; its angle cards recalculate from that model, and New Angle generates a new construction. Final exact-viewport check at 1059x1485 physically drags a main ray and a practice ray, exercises every workspace tool and overlay, and confirms a generated practice angle with no overflow or console errors.

### Lesson 212 / Mockup 0269 - Tangent

Reworked individually against the target mockup. Removed the generic Contact angle and Radius sliders. The surface now owns a draggable circle center O and contact point T, projects T onto the circle while snap is active, and derives the radial unit vector, perpendicular tangent, right-angle marker, OT length, center-to-line distance, and power value. Disabling snap creates a real off-circle state; secant visibility, grid visibility, zoom, reset view, fullscreen, reset, sharing, language, and generated practice positions are functional. Final exact-viewport check at 1024x1536 physically tests constrained and free T dragging, secant and grid switches, every viewport tool, and New Position with no overflow or console errors.

### Lesson 213 / Mockup 0270 - Best Fit Line

Reworked individually against the target mockup. Replaced the shared two-slider graph with an eight-observation regression model: every point is directly draggable, the line itself can be dragged through its intercept, and m/b sliders, residual segments, equation visibility, SSE, least-squares coefficients, minimum SSE, and R-squared are calculated from the same dataset. Reset, Randomize, bookmark, share, visibility controls, fit-to-optimum, challenge grading, New challenge, and section navigation are functional. The calibrated initial dataset independently reproduces the target's calculated SSE 5.86, R-squared 0.953, and best SSE 1.72. Final exact-viewport check at 1534x1025 exercises point and line dragging, sliders, all visibility controls, least-squares fitting, grading, and challenge generation with no overflow or console errors; the lesson surface ends at the mockup's 1007px boundary.

### Lesson 214 / Mockup 0271 - Triangle Constructor

Reworked individually against the target mockup. Removed the generic Apex x and Apex y sliders. The surface now owns draggable vertices A, B, and C and independently implements SSS through circle-intersection lengths, SAS through two sides and the included angle, and ASA through angle sum and the sine rule. Every drag synchronizes the side and angle controls; side lengths, three angles, perimeter, shoelace area, side classification, and angle classification are derived from the vertices. Triangle-inequality and angle-sum failures produce a real non-constructible state. Select, Pan, fit view, fullscreen, reset, share, language, target generation, and SAS practice grading are functional. Final exact-viewport check at 1029x1528 exercises vertex dragging, successful SAS practice, infeasible SSS and ASA inputs, pan and fit view, and New values with no overflow or console errors; all major content bands and the full footer remain visible.

### Lesson 215 / Mockup 0272 - Regular Polygon

Reworked individually against the target mockup. Replaced the shared Sides n and Radius sliders with a generated vertex collection whose vertices are rotations of a first radius by 360 degrees divided by n. The center O and every generated vertex are directly draggable: moving O translates the construction, while moving a vertex updates radius and orientation without breaking equal sides or angles. Side count, radius, rotation, center placement, radii, grid, vertex, circumcircle, symmetry-axis, label, and fullscreen controls are functional. Central and interior angles, side length, apothem, perimeter, area, symmetry counts, coordinate labels, and construction formulas are derived from the same model. The octagon practice form numerically validates side length, perimeter, and area. Final exact-viewport check at 1027x1532 exercises both drag dependencies, n/r regeneration, rotation, center placement, all visibility controls, hint, and practice grading with no overflow or console errors; the page and three-column footer fit without scrolling.

### Lesson 216 / Mockup 0273 - Rigid Polygon

Reworked individually against the target mockup. Removed the generic quadrilateral, Rotation and Translate x sliders, repeated definition/rule cards, generic construction strip, and template verification record. The dedicated surface owns triangle ABC, a dependent translated copy A'B'C', rigid-body position and rotation, and visibility state for labels, lengths, angles, and overlay. Dragging the triangle in Move mode translates every vertex equally; dragging a vertex in Rotate mode turns the complete triangle around its centroid. Both transformations preserve the three computed side lengths byte-for-byte, and the overlay remains the exact vector (6, -2) image. The worked coordinate table, distance and angle invariants, rigid-motion taxonomy, adjacent navigation, and six-field 90-degree counterclockwise practice check match the target structure. The mockup labels two sides as 4.47 despite its stated coordinates producing 5.66 and 5.00; the implementation intentionally displays the correct live Euclidean calculations. Final 1027x1531 browser validation exercises translation, rotation, every visibility control, reset, and all practice fields, verifies the invariant data before and after both drags, reports no overflow or console errors, and fits the complete footer without scrolling.

### Lesson 217 / Mockup 0274 - General Polygon

Reworked individually against the target mockup. Removed the generic regular pentagon, Vertices and Irregularity sliders, generic object-model panel, repeated construction cards, and template verification record. The dedicated surface owns an ordered collection of three to ten unrestricted vertices. Point and Polygon add vertices, every vertex is directly draggable, double-click removes a vertex, Move translates the complete polygon, Measure selects a real edge, and Clear All, reset, snap, and grid controls update the editor. Side lengths, perimeter, shoelace area, oriented interior angles, angle sum, expected angle sum, convexity, and pairwise non-adjacent edge intersection are recalculated from the same point collection. The Properties copy controls, n-gon pattern and formula panels, seven-gon example, learning flow, adjacent navigation, and independently graded hexagon sums follow mockup 0274. The screenshot uses live coordinate calculations rather than copying internally inconsistent property values from the mockup. Final 1022x1538 browser validation reshapes a vertex and confirms area changes, adds and removes a sixth vertex, translates the complete polygon and confirms area is preserved, selects an edge, exercises both display toggles, clears and restores the model, and verifies 720-degree/360-degree hexagon sums with no overflow or console errors.

### Lesson 218 / Mockup 0275 - Circle Centre and Point

Reworked individually against the target mockup. Removed the generic circle, Point angle and Point distance sliders, generic object-model panel, repeated construction cards, and template verification record. The dedicated construction owns independently draggable and editable centre C and circumference point P; the radius is always the Euclidean distance CP, the diameter is 2r, and the rendered circle, dashed radius, coordinate labels, measurement panel, and distance check derive from those two points. Coordinate locks prevent both direct dragging and field edits. Grid, axes, circle, radius, centre, and point visibility controls are functional. Reset restores the initial C(1, 2), P(5, 4) model. The learning goal, five-stage navigation, object editor, construction explanation, defining property, worked equation, challenge generator/loader, reminder, lesson index, and adjacent navigation reproduce mockup 0275's content hierarchy. Final 1024x1536 browser validation physically drags C and P and confirms each changes CP, edits all four coordinates, verifies the centre lock, exercises all six display controls, generates and loads a challenge, resets the model, and reports no overlap, overflow, or console errors. The dedicated surface ends at 1505px against the target's 1503px boundary.

### Lesson 219 / Mockup 0276 - Circle Centre and Radius

Reworked individually against the target mockup. Removed the generic circle, Radius and Centre x sliders, generic object-model panel, repeated construction cards, and template verification record. The dedicated surface owns centre C, an independent numeric radius r, and an angular compass handle P derived from those values. Dragging C translates the circle and P without changing r; dragging P changes radius and orientation without moving C. Both pointer paths use the SVG screen transformation matrix so the model remains aligned with the cursor at the target aspect ratio. Centre steppers and exact inputs, radius slider/input/steppers, units menu, Select, Move, Compass, reset, language, share, stage navigation, and section navigation are functional. The live CP measurement, dynamic centre-radius equation, observation/compass panel, four-step worked construction, target diagram, and C(-3, 2), r=4 practice check follow mockup 0276. Final 997x1578 browser validation proves translation preserves the exact radius attribute, proves compass dragging preserves the exact centre coordinate, exercises all tools and controls, submits the target construction successfully, reports no overflow or console errors, and places the lesson boundary at 1459px against the target's 1461px boundary.

### Lesson 220 / Mockup 0277 - Circle Through Three Points

Reworked individually against the target mockup. Removed the generic three-dot circle, Point C x and Point C y sliders, generic object-model panel, repeated construction cards, and template verification record. The dedicated model owns three unrestricted draggable points A, B, and C and calculates the unique circumcentre with the determinant formula. The circle radius, all three perpendicular bisectors, circumcentre label, coordinate list, and OA/OB/OC verification derive from that result. When the determinant reaches zero, the circle and circumcentre disappear and the surface reports that no unique circle exists. Points can be removed from the object list and restored by clicking the graph; reset, labels, grid, circle, bisectors, centre, bookmark, share, fullscreen, stage navigation, adjacent navigation, and Back to Lessons are functional. The construction-step diagram, collinearity tip, circumcentre/equidistance formulas, and six-field practice equation follow mockup 0277. Final 1087x1447 browser validation drags A and confirms O changes, makes all three points exactly collinear and confirms the circle disappears, removes and replaces C, exercises every visibility control, places O on the x-axis, submits values derived from the live SVG model, and reports no overflow or console errors. The viewport includes the complete practice controls, navigation, and Back to Lessons link without scrolling.

### Lesson 221 / Mockup 0278 - Compass

Reworked individually against the target mockup after the shared geometry surface was found to be visually and behaviorally incorrect. Removed the generic circle diagram, Centre x slider, repeated Object model card, generic Construction Steps strip, and template practice record. The dedicated surface now draws an actual two-legged compass above a live circle; its draggable center B translates the complete construction and its draggable drawing leg changes the opening. Select, Point, Circle (Center), Copy Distance, Clear, radius presets, radius slider and steppers, show-radius, snap-to-grid, coordinate editing, reset, stage navigation, and adjacent-lesson navigation are functional. Radius, center coordinates, circle statements, and step history all derive from one compass-distance-transfer model. The separate AB-to-C exercise owns a draggable point D and grades the computed Euclidean distance CD against AB. Final 1024x1536 browser validation physically drags both compass dependencies and the practice point, exercises every target control class, verifies `CD = AB`, reloads to a clean state, and reports no horizontal overflow or console errors.

### Lesson 222 / Mockup 0279 - Semicircle

Reworked individually against the target mockup. Removed the generic Diameter and Orientation sliders and the shared construction template. The dedicated model owns arbitrary endpoints A and B, derives midpoint O, radius AB/2, diameter, arc length, area, orientation, and an arc-constrained point P from those endpoints, and calculates angle APB directly from vectors. Dragging either endpoint rebuilds every dependent object; Move translates the complete construction without changing radius; Upper and Lower flip the arc; endpoint fields, reset, calculation disclosure, stage navigation, adjacent navigation, and the overflow calculation action are functional. The separate Thales challenge has its own draggable P, live right-angle marker, four answer choices, and real incorrect/correct grading. Final 1007x1562 browser validation exercises both endpoint drags, rigid translation, orientation, calculation disclosure, main and practice P drags, and both grading paths; it reports the `diameter-defined-semicircle` object model, zero overflow, zero console errors, and an exact one-viewport page height.

### Lesson 223 / Mockup 0280 - Circular Arc

Reworked individually against the target mockup. Removed the generic Radius and Arc angle sliders, disconnected orange point, repeated generic cards, and template construction verifier. The dedicated model owns center O, radius r, and independent circumference angles for A and B. It derives both endpoint coordinates, the minor or major central angle, directed SVG arc, arc length, chord length, sector area, circumference, and live angle marker from that one state. O translates the complete construction rigidly; A and B drag independently on the circle; exact center/endpoint fields, radius and angle controls, minor/major selection, grid, zoom, fit, Controls/Results tabs, language, reset, share, stages, and adjacent navigation are functional. The separate r=6, θ=90° task grades the calculated 3π arc length and exposes a real hint. Mockup 0280 simultaneously labels B as (-1, 3), shows an incompatible end angle, and draws B in a third incompatible position; the implementation preserves the target's 120° and 10.472-unit result while deriving a mathematically consistent B coordinate from the visible arc. Final 1024x1536 browser validation physically drags O/A/B, proves rigid translation and radius-length proportionality, verifies complementary major-arc selection, exercises all workspace controls and both grading paths, and reports zero overflow or console errors with an exact one-viewport page height.

### Lesson 224 / Mockup 0281 - Circumcircular Arc

Reworked individually against the target mockup with a new lesson-specific adapter and `three-point-circumcircle-arc` object model. The surface owns unrestricted points A, B, and C; calculates the unique circumcenter and radius from their determinant; derives the through-A arc, complementary arc, central angle, inscribed angle, and all measurement cards; and enters a real undefined state when a point is absent or the points are collinear. All three points drag directly and have exact coordinate fields and sliders. Select, point placement, segment, circle, delete/restore, grid, center, radii, central-angle, inscribed-angle, reset, share, language, fullscreen, staged replay, challenge grading, and adjacent navigation are functional. The mockup's printed O(0, -0.50), r=5.52, and angle values are incompatible with its printed A(0, 5), B(-4, -1), and C(4, -1); the implementation intentionally derives the mathematically correct live O(0, 0.67), r=4.33, central angle 112.62 degrees, and inscribed angle 56.31 degrees from those points. Final 1013x1553 browser validation physically drags A/B/C, edits their coordinates, exercises every construction and visibility control, removes and restores C, replays all five stages, verifies incorrect and correct practice paths, and reports zero overflow, zero console errors, and an exact one-viewport page height.

### Lesson 225 / Mockup 0282 - Circular Sector

Reworked individually against the target mockup with a new lesson-specific adapter and `center-radius-angle-sector` object model. The main construction owns center O, radius r, and central angle theta; derives A and B on the circle; and recalculates the SVG sector path, intercepted arc, simplified circle fraction, percentage, arc length, and sector area from one radian-based model. O, the radius handle A, and angle handle B drag independently. Main radius and angle sliders and exact inputs, move mode, reset, four learning stages, dynamic target matching, the r=6 and theta=90-degree worked example, handle visibility, all formula panels, Concept Map and adjacent navigation are functional. The separate practice model owns its own r=7 and theta=120-degree controls and grades incorrect and correct submissions. Final 1024x1536 browser validation proves that radius dragging changes area, angle dragging changes arc length, center dragging translates the model, every visible control updates state, and both grading paths work. The final screenshot aligns the target header, stage, workspace, graph center, lower cards, navigation, and footer bands; validation reports zero overflow, zero console errors, and an exact one-viewport page height.

### Lesson 226 / Mockup 0283 - Conic through Five Points

Reworked individually against the target mockup with a new lesson-specific adapter and `five-point-homogeneous-conic` object model. Each unrestricted point contributes one row `[x², xy, y², x, y, 1]` to a real 5x6 homogeneous system. The adapter computes its coefficient null vector from signed 5x5 minors, normalizes the six coefficients, evaluates residuals, classifies from `B² - 4AC`, estimates the constraint-matrix condition number from the eigenvalues of `MMᵀ`, derives ellipse center/axes/orientation when applicable, and traces general non-ellipse loci with marching squares. All five points drag directly and have exact x/y editors. Point creation, Move, Clear all, reset, zoom, fit, fullscreen, language, share, stages, practice loading, diagnostics, checks, Workspace, overview, and adjacent navigation are functional. The mockup's printed initial coefficient tuple does not satisfy its printed five points, so the implementation renders the actual solved rotated ellipse instead. The mockup's practice set contains four collinear points and therefore has rank below five rather than defining a unique parabola; the implementation uses five nearby honest samples from `y = 1 - x²/2` so the stated parabola goal is mathematically achievable. Final 1086x1448 browser validation physically drags P1 and P4, confirms the locus changes, edits independent coordinates, exercises viewport/stage/language controls, clears and rebuilds five constraints point-by-point, loads the practice set, and requires the solved classification to be Parabola. It reports zero overflow, zero console errors, and an exact one-viewport page height.
