# Ruhi 2D NLP cycle-02

117/210 passed; 92 failed; 1 blocked. End-to-end record accuracy: 55.71%. Scenario success: 103/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 164/181 | 90.61% |
| entities | 34/74 | 45.95% |
| numeric | 9/9 | 100.00% |
| context | 77/83 | 92.77% |
| clarification | 14/20 | 70.00% |
| geometry | 120/166 | 72.29% |
| execution | 155/187 | 82.89% |
| response | 163/201 | 81.09% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-077 (S-077): Change selected shape's outline to purple.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-078 (S-078): Change that triangle's interior to gold.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-079 (S-079): Change the most recent circle's outline to black.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-080 (S-080): Change selected shape's outline to cyan.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-101 (CONV-01): On triangle T1, set angle A to 77 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-102 (CONV-01): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-103 (CONV-01): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-104 (CONV-01): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-105 (CONV-02): On triangle T2, set angle B to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-106 (CONV-02): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-107 (CONV-02): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-108 (CONV-02): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-109 (CONV-03): On triangle T3, set angle A to 83 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-110 (CONV-03): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-111 (CONV-03): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-112 (CONV-03): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-113 (CONV-04): On triangle T4, set angle B to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-114 (CONV-04): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-115 (CONV-04): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-116 (CONV-04): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-117 (CONV-05): On triangle T5, set angle A to 89 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-118 (CONV-05): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-119 (CONV-05): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-120 (CONV-05): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-125 (CONV-07): On triangle T7, set angle A to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-126 (CONV-07): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-127 (CONV-07): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-128 (CONV-07): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-133 (CONV-09): On triangle T9, set angle A to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-134 (CONV-09): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-135 (CONV-09): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-136 (CONV-09): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-155 (CLAR-04): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-156 (CLAR-04): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-157 (CLAR-05): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-158 (CLAR-05): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-167 (CLAR-10): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-168 (CLAR-10): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-179 (CLAR-16): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-180 (CLAR-16): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-181 (CLAR-17): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-182 (CLAR-17): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-193 (CLAR-23): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-194 (CLAR-23): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-224 (S-224): Construct a circle tangent to all three sides of triangle T1, then connect its incenter to vertex A1.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-225 (S-225): Construct a circle tangent to all three sides of triangle T2, then connect its incenter to vertex A2.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-226 (S-226): Construct a circle tangent to all three sides of triangle T3, then connect its incenter to vertex A3.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-227 (S-227): Construct a circle tangent to all three sides of triangle T4, then connect its incenter to vertex A4.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-228 (S-228): Construct a circle tangent to all three sides of triangle T5, then connect its incenter to vertex A5.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-230 (S-230): Construct a circle tangent to all three sides of triangle T7, then connect its incenter to vertex A7.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-231 (S-231): Construct a circle tangent to all three sides of triangle T8, then connect its incenter to vertex A8.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-234 (S-234): Construct a circle tangent to all three sides of triangle T11, then connect its incenter to vertex A11.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-235 (S-235): Construct a circle tangent to all three sides of triangle T12, then connect its incenter to vertex A12.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-236 (S-236): Construct a circle tangent to all three sides of triangle T13, then connect its incenter to vertex A13.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-240 (S-240): Construct a circle tangent to all three sides of triangle T17, then connect its incenter to vertex A17.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-242 (S-242): Construct a circle tangent to all three sides of triangle T19, then connect its incenter to vertex A19.
  GEOMETRY_SOLVER_ERROR: segment connects intended endpoints
- RUHI2D-243 (S-243): Find the intersection of y=1x+1 and y=-x+5, put a dot there, and call it P0.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-245 (S-245): Find the intersection of y=3x+1 and y=-x+7, put a dot there, and call it P2.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-247 (S-247): Find the intersection of y=1x+1 and y=-x+9, put a dot there, and call it P4.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-250 (S-250): Find the intersection of y=4x+1 and y=-x+12, put a dot there, and call it P7.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-251 (S-251): Find the intersection of y=1x+1 and y=-x+13, put a dot there, and call it P8.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-252 (S-252): Find the intersection of y=2x+1 and y=-x+14, put a dot there, and call it P9.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-253 (S-253): Find the intersection of y=3x+1 and y=-x+15, put a dot there, and call it P10.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-254 (S-254): Find the intersection of y=4x+1 and y=-x+16, put a dot there, and call it P11.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-255 (S-255): Find the intersection of y=1x+1 and y=-x+17, put a dot there, and call it P12.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-256 (S-256): Find the intersection of y=2x+1 and y=-x+18, put a dot there, and call it P13.
  ENTITY_EXTRACTION_ERROR: intersection label
- RUHI2D-257 (S-257): Find the intersection of y=3x+1 and y=-x+19, put a dot there, and call it P14.
  ENTITY_EXTRACTION_ERROR: intersection label
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
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-293 (S-293): Find the midpoint of segment A2B2, label it M2, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-295 (S-295): Find the midpoint of segment A4B4, label it M4, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-297 (S-297): Find the midpoint of segment A6B6, label it M6, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-298 (S-298): Find the midpoint of segment A7B7, label it M7, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-299 (S-299): Find the midpoint of segment A8B8, label it M8, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
- RUHI2D-300 (S-300): Find the midpoint of segment A9B9, label it M9, and make the midpoint marker red.
  ENTITY_EXTRACTION_ERROR: midpoint label; style stroke
