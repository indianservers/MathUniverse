# Ruhi 2D NLP held-out

42/43 passed; 0 failed; 1 blocked. End-to-end record accuracy: 97.67%. Scenario success: 33/34.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 37/37 | 100.00% |
| entities | 12/12 | 100.00% |
| numeric | 0/0 | N/A |
| context | 10/10 | 100.00% |
| clarification | 3/3 | 100.00% |
| geometry | 36/36 | 100.00% |
| execution | 39/39 | 100.00% |
| response | 40/40 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-010 (S-010): Draw a regular trapezoid centered at (-1,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
