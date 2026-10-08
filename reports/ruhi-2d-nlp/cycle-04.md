# Ruhi 2D NLP cycle-04

185/210 passed; 24 failed; 1 blocked. End-to-end record accuracy: 88.10%. Scenario success: 147/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 174/181 | 96.13% |
| entities | 66/74 | 89.19% |
| numeric | 9/9 | 100.00% |
| context | 80/83 | 96.39% |
| clarification | 17/20 | 85.00% |
| geometry | 153/166 | 92.17% |
| execution | 176/187 | 94.12% |
| response | 187/201 | 93.03% |

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
