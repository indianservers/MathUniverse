# Ruhi 2D NLP cycle-05

191/210 passed; 18 failed; 1 blocked. End-to-end record accuracy: 90.95%. Scenario success: 150/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 174/181 | 96.13% |
| entities | 71/74 | 95.95% |
| numeric | 9/9 | 100.00% |
| context | 78/83 | 93.98% |
| clarification | 20/20 | 100.00% |
| geometry | 151/166 | 90.96% |
| execution | 172/187 | 91.98% |
| response | 186/201 | 92.54% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-054 (S-054): Move the blue polygon 4 units down.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-058 (S-058): Move the blue polygon 4 units down.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-062 (S-062): Move the blue polygon 4 units down.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-066 (S-066): Move the blue polygon 4 units down.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-070 (S-070): Move the blue polygon 4 units down.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-156 (CLAR-04): I mean angle ABC. Increase it to 84 degrees.
  GEOMETRY_SOLVER_ERROR: actual vertex angle
- RUHI2D-158 (CLAR-05): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-168 (CLAR-10): I mean angle ABC. Increase it to 84 degrees.
  GEOMETRY_SOLVER_ERROR: actual vertex angle
- RUHI2D-180 (CLAR-16): I mean angle ABC. Increase it to 84 degrees.
  GEOMETRY_SOLVER_ERROR: actual vertex angle
- RUHI2D-182 (CLAR-17): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-194 (CLAR-23): Fill it with forest green.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; style fill; completion response agrees with execution
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
