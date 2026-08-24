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
| 0273 | 216 Rigid Polygon | `rigidPolygon` | Implemented and browser-validated |
| 0274 | 217 General Polygon | `generalPolygon` | Implemented and browser-validated |
| 0275 | 218 Circle Centre and Point | `circlePoint` | Implemented and browser-validated |
| 0276 | 219 Circle Centre and Radius | `circleRadius` | Implemented and browser-validated |
| 0277 | 220 Circle through Three Points | `circleThree` | Implemented and browser-validated |
| 0278 | 221 Compass | `compass` | Implemented and browser-validated |
| 0279 | 222 Semicircle | `semicircle` | Implemented and browser-validated |
| 0280 | 223 Circular Arc | `arc` | Implemented and browser-validated |
| 0281 | 224 Circumcircular Arc | `circumArc` | Implemented and browser-validated |
| 0282 | 225 Circular Sector | `sector` | Implemented and browser-validated |
| 0283 | 226 Conic through Five Points | `conicFive` | Implemented and browser-validated |
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
