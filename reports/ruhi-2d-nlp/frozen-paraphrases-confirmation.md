# Ruhi 2D NLP frozen-paraphrases-confirmation

16/16 passed; 0 failed; 0 blocked. End-to-end record accuracy: 100.00%. Scenario success: 15/15.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 15/15 | 100.00% |
| entities | 6/6 | 100.00% |
| numeric | 2/2 | 100.00% |
| context | 5/5 | 100.00% |
| clarification | 1/1 | 100.00% |
| geometry | 14/14 | 100.00% |
| execution | 14/14 | 100.00% |
| response | 16/16 | 100.00% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures


