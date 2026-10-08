# Ruhi 2D NLP validation

46/47 passed; 0 failed; 1 blocked. End-to-end record accuracy: 97.87%. Scenario success: 33/34.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 42/42 | 100.00% |
| entities | 15/15 | 100.00% |
| numeric | 2/2 | 100.00% |
| context | 15/15 | 100.00% |
| clarification | 4/4 | 100.00% |
| geometry | 37/37 | 100.00% |
| execution | 41/41 | 100.00% |
| response | 46/46 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-030 (S-030): Draw a regular trapezoid centered at (-2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
