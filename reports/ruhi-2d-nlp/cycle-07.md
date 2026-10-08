# Ruhi 2D NLP cycle-07

209/210 passed; 0 failed; 1 blocked. End-to-end record accuracy: 99.52%. Scenario success: 168/169.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 181/181 | 100.00% |
| entities | 74/74 | 100.00% |
| numeric | 9/9 | 100.00% |
| context | 83/83 | 100.00% |
| clarification | 20/20 | 100.00% |
| geometry | 166/166 | 100.00% |
| execution | 187/187 | 100.00% |
| response | 201/201 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
