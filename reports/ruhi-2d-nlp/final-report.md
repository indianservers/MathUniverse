# Ruhi 2D NLP evaluation report

Stopped at your request. You said six cycles were enough; **nine cycles had already completed**. No further cycles or production builds were started.

## Results

| Evaluation | Passed | Failed | Blocked | Rate |
|---|---:|---:|---:|---:|
| Baseline, full 300 | 73/300 | 224 | 3 | 24.33% |
| Cycle 6, development only | 202/210 | 7 | 1 | 96.19% |
| Latest full regression | 297/300 | 0 | 3 | **99.00%** |
| Validation | 46/47 | 0 | 1 | 97.87% |
| Held-out scenario split | 42/43 | 0 | 1 | 97.67% |
| Independent frozen probes, confirmation | 16/16 | 0 | 0 | 100% |

Full-scenario success: **234/237 (98.73%)**. All 297 evaluable records passed. Blocked cases count against the full-suite rates; held-out therefore falls below 98% when its blocked record is included.

## What improved

- Rectangle/square origins, ellipse semiaxes, function expressions and rotation anchors.
- Distinct rendered fill/stroke, angle arcs and incident-side thickness.
- Active-angle memory, absolute/increment/percentage changes, three-letter angle names, and rejection of impossible triangle angles.
- Pending color/angle questions resume the original action and subject.
- Centroid/incircle/midpoint chains, perpendicular constructions, axis intersection and reflected copies.
- Selective color undo preserves geometry and thickness.
- Saved multi-row graph shapes restore one semantic object with their original name, geometry and styling.

## Measured accuracy

| Dimension | Passed / eligible | Rate |
|---|---:|---:|
| intent | 260/260 | 100.00% |
| entities | 101/101 | 100.00% |
| numeric | 11/11 | 100.00% |
| context | 108/108 | 100.00% |
| clarification | 27/27 | 100.00% |
| geometry | 239/239 | 100.00% |
| execution | 267/267 | 100.00% |
| response | 287/287 | 100.00% |

Clarification precision and recall: **100%** (27 true positives, zero false positives/negatives). All **27 clarification conversations** completed. All **39 multi-turn scenarios** passed. Denominators reflect explicit assertions; these are not claims that every dimension was independently tested on all 300 records.

## Training and model weights

TensorFlow.js fine-tuning used **150 compatible development rows and 30 validation rows**. No held-out rows were fitted. Three epochs reduced loss but did not improve primary validation classification (**16.67%**), so no candidate was promoted. Best checkpoint is **epoch 0**, the original weights.

Classifier-only held-out primary accuracy: **7/29 (24.14%)**; 14 records have no compatible independently supplied primary class in the existing model heads. This differs from hybrid execution accuracy: parser, context and geometry repairs produced the 99% full-suite result.

Active weights: `public/models/math-robo-intelligence-v4/weights.bin` (467,572 bytes; 116,893 parameters). Model topology: `public/models/math-robo-intelligence-v4/model.json`.

Retained checkpoint: `reports/ruhi-2d-nlp/checkpoints/best/model.json` and `weights.bin`.

Original and checkpoint weights SHA-256: `315d8161f4ff311db2e7850ef5e6d0f5362fa2f53cede767e2a12f2b2907ce3d`. Original weights remain unchanged.

## Remaining records

- **RUHI2D-010**: Draw a regular trapezoid centered at (-1,2) with circumradius 3. A regular trapezoid is not uniquely defined by center and circumradius; provide vertices or additional dimensions.
- **RUHI2D-020**: Draw a regular trapezoid centered at (2,2) with circumradius 3. A regular trapezoid is not uniquely defined by center and circumradius; provide vertices or additional dimensions.
- **RUHI2D-030**: Draw a regular trapezoid centered at (-2,2) with circumradius 3. A regular trapezoid is not uniquely defined by center and circumradius; provide vertices or additional dimensions.

## Regression and browser checks

- **7,365/7,365** unit/regression tests across 37 files.
- Original conversational suite: **100/100** in the real browser.
- Five requested conversations: **5/5**, with coordinate/angle assertions.
- Native rendering, undo, redo, selection, serialized metadata, reload/load and subsequent context editing: **7/7** persistence checks.
- No browser application errors in the final 300-record evaluation.

**Not completed before your stop request:** production rebuild, production browser checks and administrator-dashboard visual verification for these latest changes. Global typecheck still reports 218 existing repository errors; pilot files were clean in that run, which preceded the final inventory repair.

The administrator Training Lab now contains a “2D NLP Audit” tab backed by recorded results. Student builds exclude the Training Lab at compilation; a developer build requires a protected local/host distribution. UI visibility is not authentication. No shared-model write endpoint was added.

## Cycle history

| Cycle | Scope | Passed / total |
|---|---|---:|
| cycle-01 | train | 100/210 |
| cycle-02 | train | 117/210 |
| cycle-03 | train | 144/210 |
| cycle-04 | train | 185/210 |
| cycle-05 | train | 191/210 |
| cycle-06 | train | 202/210 |
| cycle-07 | train | 209/210 |
| cycle-08 | train | 209/210 |
| cycle-09 | all | 297/300 |

## Evaluation limits and audit

- 300-record all-suite figures are regression, not untouched language generalization. Related scenario turns remain together, but repeated templates cross splits.
- Original all-300 baseline was observed as explicitly required; only development diagnostics guided dataset repairs. Held-out records were not fitted or used for checkpoint selection.
- After first frozen held-out evaluation, an independent save/reload test drove a native inventory repair; repeated held-out results confirm compatibility, not a new untouched evaluation.
- Metrics credit only explicit assertions. Intent measures checked action-family correctness; response checks use bounded success/clarification templates.
- Training alone did not improve the classifier. Hybrid parser/dialogue/geometry software explains execution gains; arbitrary-language capability is not established.
- Administrator controls are excluded at the student build boundary; local developer UI is not authentication. No shared weights publication endpoint was added. Private checkpoints/reports remain outside public assets.
- Three regular-trapezoid records are structurally valid but geometrically underspecified. Blocked records count against full-suite success.
- Production build, production browser check, and administrator dashboard visual check remain unverified for the latest changes because the user requested stopping.

- Initial baseline fixture label syntax was corrected before application changes; the original failed harness run is retained.
- Oracle corrections covered newly created centroid/incenter outputs, color palette, three-letter angle naming, selective undo, and rotation anchor/about schema alias. Original expected semantics and stored scenes were preserved.
- Upper/lower triangle fixtures now use documented y offsets; blue polygon fixtures supply the mentioned color. Baseline common-oracle re-score remains 73/300. Fixture revisions make this a diagnostic comparison rather than a perfectly controlled A/B benchmark.
- Independent probes first scored 15/16 because of anchor/about mismatch. Stored actual origin rotation was correct; re-score and unchanged-semantics confirmation each score 16/16.


Detailed evidence: `final-report.json`, `failed-records.json`, `regression-results.json`, each cycle JSON/Markdown, `model-comparison.json`, `held-out-classifier.json`, `five-conversations.json`, `persistence.json`, `dataset-validation.json`, `dataset-partition.json` and `architecture.md`.
