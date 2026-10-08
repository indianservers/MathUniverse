# Ruhi 2D NLP cycle-09

297/300 passed; 0 failed; 3 blocked. End-to-end record accuracy: 99.00%. Scenario success: 234/237.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 260/260 | 100.00% |
| entities | 101/101 | 100.00% |
| numeric | 11/11 | 100.00% |
| context | 108/108 | 100.00% |
| clarification | 27/27 | 100.00% |
| geometry | 239/239 | 100.00% |
| execution | 267/267 | 100.00% |
| response | 287/287 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-010 (S-010): Draw a regular trapezoid centered at (-1,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-030 (S-030): Draw a regular trapezoid centered at (-2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
