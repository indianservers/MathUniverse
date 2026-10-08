# Ruhi v4.1 implementation report

Implemented execution upgrade; neural release targets not met; candidates unpublished. App version remains 1.02. No candidate was deployed.

## Execution and coverage

The baseline has 90 distinct subaction labels across 118 action/subaction pairs, not 90 distinct canonical actions. The upgrade implements 150 pairs. 590/590 held-out execution cases pass, covering 150 pairs. Labeled context accuracy is 100.00%; query mutations: 0. Unsupported entries are explicitly listed with reasons in the JSON report.

## Model and dataset

2932 training-source rows; grouped held-out families; UTF-8 streaming upload limit 100,000 rows/100 MB. Exact parameters and geometry stay deterministic. Two actual candidates were trained locally with TensorFlow.js CPU. The larger candidate has 1,84,121 parameters and 719.2 KiB weights. Warm Node inference: 1.032 ms. These are Node measurements, not browser latency claims.

| Metric | Baseline on current held-out rows | Larger candidate |
|---|---:|---:|
| Action accuracy | 86.10% | 95.59% |
| Subaction accuracy | 78.31% | 96.27% |
| Action macro-F1 | 69.04% | 81.21% |
| Subaction macro-F1 | 88.13% | 96.14% |

Publication is blocked until all gates pass and an admin explicitly approves export. Baseline v3/v4 files are byte-for-byte preserved. Candidate files are in candidate-1/ and candidate-2/, outside public model assets.

## Verification

4269 tests passed, 0 failed, including 1,600 seeded geometry property cases. The 2,000 intent-negative checks passed with zero mutations. They contain 50 authored intent families plus grouped surface perturbations, and are not a claim of 2,000 diverse mathematical tasks. Browser conversation counts and the separate 100-command-per-workspace results are recorded in the JSON report. Student build excludes training page/worker assets and training UI strings; admin build preserves the lab. Scoped intelligence typecheck passes. Full-project typecheck retains existing geometry/mobile failures.

## Training review workflow

Overview, Dataset, Corrections, Train, Evaluate, Confusion Matrix, Adversarial Tests, Regression, Model Compare, and Publish panels are available in development/admin builds. Corrections only enter a review queue. Approval exports reviewed JSONL for import; it does not alter active mappings or weights. Candidate training saves separately. Publish runs held-out execution/context and intent-negative checks, requires real coverage and threshold metrics, then allows explicit approval/export. Student builds use VITE_ENABLE_MODEL_TRAINING=false; an admin build requires true and private distribution.

## Remaining limitations

- Neural action accuracy and action macro-F1 remain below requested publication thresholds.
- Adversarial corpus is 50 authored negative-intent families with formatting/speech perturbations; it does not establish unrestricted NLP accuracy or 2,000 independent mathematical intents.
- Dataset uses controlled baseline templates plus manually authored extension phrases; additional reviewed language is needed.
- Not every operation has a specialized independent numerical verifier; all use safety checks and selected operations additionally use independent formulas/invariants.
- Legacy 3D base/manual objects without semantic descriptors are not yet fully inventoried.
- LOCK prevents semantic edits and native geometry edits; graph manual controls do not enforce the semantic lock.
- Numeric graph roots/intersections are bounded approximations over [-100,100].
- An enabled training build is a development/admin distribution boundary, not authentication.
- 100K-row ingestion and worker training supported; no user 100K dataset was supplied or trained in this phase.
