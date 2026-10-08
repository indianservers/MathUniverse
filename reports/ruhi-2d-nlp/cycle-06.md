# Ruhi 2D NLP cycle-06

202/210 passed; 7 failed; 1 blocked. End-to-end record accuracy: 96.19%. Scenario success: 161/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 181/181 | 100.00% |
| entities | 74/74 | 100.00% |
| numeric | 9/9 | 100.00% |
| context | 83/83 | 100.00% |
| clarification | 20/20 | 100.00% |
| geometry | 159/166 | 95.78% |
| execution | 187/187 | 100.00% |
| response | 201/201 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-260 (S-260): Draw a perpendicular from vertex A of triangle T2 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-261 (S-261): Draw a perpendicular from vertex A of triangle T3 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-267 (S-267): Draw a perpendicular from vertex A of triangle T9 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-268 (S-268): Draw a perpendicular from vertex A of triangle T10 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-269 (S-269): Draw a perpendicular from vertex A of triangle T11 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-270 (S-270): Draw a perpendicular from vertex A of triangle T12 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
- RUHI2D-272 (S-272): Draw a perpendicular from vertex A of triangle T14 onto side BC, then extend the perpendicular until it hits the x-axis.
  GEOMETRY_SOLVER_ERROR: perpendicular through triangle A to BC
