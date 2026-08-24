# Dynamic Geometry Constructions UI Upgrade

Completed the 38-lesson Dynamic Geometry Constructions workspace family against target mockups `0255-0292`.

## What Changed

- Rebuilt lessons `198-235` with an immersive target-style dynamic geometry workspace.
- Added a target header, five-step lesson strip, construction tab bar, construction canvas, vertical tool rail, right properties/check panels, undo history, construction steps, insight/rule/practice cards, and progress footer.
- Kept unrelated geometry lessons on the existing reusable 2D geometry engine.
- Suppressed the generic lesson shell navigation for this immersive family so only the target-style geometry lesson UI appears.
- Added `scripts/audit-dynamic-geometry-ui.mjs` to rerun the full 38-lesson screenshot/control audit.

## Completed Lessons

| Mockup | Lesson | Route |
|---|---:|---|
| 0255 | 198 Free Point | `/lessons/geometry/198-free-point` |
| 0256 | 199 Point on Object | `/lessons/geometry/199-point-on-object` |
| 0257 | 200 Intersection Point | `/lessons/geometry/200-intersection-point` |
| 0258 | 201 Midpoint or Centre | `/lessons/geometry/201-midpoint-or-centre` |
| 0259 | 202 Attach / Detach Point | `/lessons/geometry/202-attach-detach-point` |
| 0260 | 203 Line Through Two Points | `/lessons/geometry/203-line-through-two-points` |
| 0261 | 204 Segment | `/lessons/geometry/204-segment` |
| 0262 | 205 Segment with Given Length | `/lessons/geometry/205-segment-with-given-length` |
| 0263 | 206 Ray | `/lessons/geometry/206-ray` |
| 0264 | 207 Polyline | `/lessons/geometry/207-polyline` |
| 0265 | 208 Perpendicular Line | `/lessons/geometry/208-perpendicular-line` |
| 0266 | 209 Parallel Line | `/lessons/geometry/209-parallel-line` |
| 0267 | 210 Perpendicular Bisector | `/lessons/geometry/210-perpendicular-bisector` |
| 0268 | 211 Angle Bisector | `/lessons/geometry/211-angle-bisector` |
| 0269 | 212 Tangent | `/lessons/geometry/212-tangent` |
| 0270 | 213 Best-Fit Line | `/lessons/geometry/213-best-fit-line` |
| 0271 | 214 Triangle Constructor | `/lessons/geometry/214-triangle-constructor` |
| 0272 | 215 Regular Polygon | `/lessons/geometry/215-regular-polygon` |
| 0273 | 216 Rigid Polygon | `/lessons/geometry/216-rigid-polygon` |
| 0274 | 217 General Polygon | `/lessons/geometry/217-general-polygon` |
| 0275 | 218 Circle: Centre and Point | `/lessons/geometry/218-circle-centre-and-point` |
| 0276 | 219 Circle: Centre and Radius | `/lessons/geometry/219-circle-centre-and-radius` |
| 0277 | 220 Circle Through Three Points | `/lessons/geometry/220-circle-through-three-points` |
| 0278 | 221 Compass | `/lessons/geometry/221-compass` |
| 0279 | 222 Semicircle | `/lessons/geometry/222-semicircle` |
| 0280 | 223 Circular Arc | `/lessons/geometry/223-circular-arc` |
| 0281 | 224 Circumcircular Arc | `/lessons/geometry/224-circumcircular-arc` |
| 0282 | 225 Circular Sector | `/lessons/geometry/225-circular-sector` |
| 0283 | 226 Conic Through Five Points | `/lessons/geometry/226-conic-through-five-points` |
| 0284 | 227 Ellipse | `/lessons/geometry/227-ellipse` |
| 0285 | 228 Hyperbola | `/lessons/geometry/228-hyperbola` |
| 0286 | 229 Parabola | `/lessons/geometry/229-parabola` |
| 0287 | 230 Distance / Length | `/lessons/geometry/230-distance-length` |
| 0288 | 231 Area | `/lessons/geometry/231-area` |
| 0289 | 232 Angle | `/lessons/geometry/232-angle` |
| 0290 | 233 Fixed Angle | `/lessons/geometry/233-fixed-angle` |
| 0291 | 234 Relation Checker | `/lessons/geometry/234-relation-checker` |
| 0292 | 235 Construction Steps | `/lessons/geometry/235-construction-steps` |

## Verification

- `npm run typecheck -- --pretty false` passed.
- `node scripts/audit-dynamic-geometry-ui.mjs` passed for all 38 lessons.
- Evidence generated for each mockup: `*-reference.png`, `*-desktop.png`, `*-tablet.png`, `*-mobile.png`, `*-interacted.png`, and `*-control-audit.json`.
- Summary: `0255-0292-dynamic-geometry-validation-summary.json`.

## Pending In This Family

0 lessons pending.
