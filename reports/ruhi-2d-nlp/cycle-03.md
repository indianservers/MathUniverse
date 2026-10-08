# Ruhi 2D NLP cycle-03

144/210 passed; 65 failed; 1 blocked. End-to-end record accuracy: 68.57%. Scenario success: 127/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 174/181 | 96.13% |
| entities | 46/74 | 62.16% |
| numeric | 9/9 | 100.00% |
| context | 80/83 | 96.39% |
| clarification | 17/20 | 85.00% |
| geometry | 132/166 | 79.52% |
| execution | 141/187 | 75.40% |
| response | 152/201 | 75.62% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-078 (S-078): Change that triangle's interior to gold.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-079 (S-079): Change the most recent circle's outline to black.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-080 (S-080): Change selected shape's outline to cyan.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-101 (CONV-01): On triangle T1, set angle A to 77 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-102 (CONV-01): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-103 (CONV-01): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-104 (CONV-01): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-105 (CONV-02): On triangle T2, set angle B to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-106 (CONV-02): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-107 (CONV-02): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-108 (CONV-02): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-109 (CONV-03): On triangle T3, set angle A to 83 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-110 (CONV-03): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-111 (CONV-03): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-112 (CONV-03): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-113 (CONV-04): On triangle T4, set angle B to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-114 (CONV-04): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-115 (CONV-04): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-116 (CONV-04): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-117 (CONV-05): On triangle T5, set angle A to 89 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-118 (CONV-05): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-119 (CONV-05): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-120 (CONV-05): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-125 (CONV-07): On triangle T7, set angle A to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-126 (CONV-07): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-127 (CONV-07): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-128 (CONV-07): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-133 (CONV-09): On triangle T9, set angle A to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-134 (CONV-09): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-135 (CONV-09): Make its two sides thicker and change the angle mark to violet.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-136 (CONV-09): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; completion response agrees with execution
- RUHI2D-156 (CLAR-04): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-157 (CLAR-05): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-158 (CLAR-05): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-168 (CLAR-10): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-180 (CLAR-16): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-181 (CLAR-17): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-182 (CLAR-17): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-193 (CLAR-23): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-194 (CLAR-23): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-260 (S-260): Draw a perpendicular from vertex A of triangle T2 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-261 (S-261): Draw a perpendicular from vertex A of triangle T3 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-267 (S-267): Draw a perpendicular from vertex A of triangle T9 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-268 (S-268): Draw a perpendicular from vertex A of triangle T10 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-269 (S-269): Draw a perpendicular from vertex A of triangle T11 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-270 (S-270): Draw a perpendicular from vertex A of triangle T12 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-272 (S-272): Draw a perpendicular from vertex A of triangle T14 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-273 (S-273): If the two lines intersect, mark the intersection in teal ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-274 (S-274): If the two lines intersect, mark the intersection in red ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-275 (S-275): If the two lines intersect, mark the intersection in navy blue ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-276 (S-276): If the two lines intersect, mark the intersection in orange ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-277 (S-277): If the two lines intersect, mark the intersection in lime ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-278 (S-278): If the two lines intersect, mark the intersection in magenta ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-281 (S-281): If the two lines intersect, mark the intersection in black ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-282 (S-282): If the two lines intersect, mark the intersection in cyan ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional color
- RUHI2D-285 (S-285): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  GEOMETRY_SOLVER_ERROR: reflected copy preserves original
- RUHI2D-286 (S-286): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  GEOMETRY_SOLVER_ERROR: reflected copy preserves original
- RUHI2D-287 (S-287): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  GEOMETRY_SOLVER_ERROR: reflected copy preserves original
- RUHI2D-292 (S-292): Find the midpoint of segment A1B1, label it M1, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-293 (S-293): Find the midpoint of segment A2B2, label it M2, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-295 (S-295): Find the midpoint of segment A4B4, label it M4, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-297 (S-297): Find the midpoint of segment A6B6, label it M6, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-298 (S-298): Find the midpoint of segment A7B7, label it M7, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-299 (S-299): Find the midpoint of segment A8B8, label it M8, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
- RUHI2D-300 (S-300): Find the midpoint of segment A9B9, label it M9, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; midpoint marker; midpoint label; style stroke; completion response agrees with execution
