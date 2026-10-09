# Ruhi everyday command training

760 distinct authored template cases: 660 valid selective-clearing commands and 100 guarded invalid requests. All 760 passed scene-state execution checks across four workspaces; retained geometry was unchanged. These are generated cases, not collected human conversations. Scene tests use the real SemanticEngine with an in-memory native adapter.

Trained TensorFlow.js CPU candidate for 12 epochs on 3090 deduplicated examples including the existing starter corpus. Grouped split: 1883 train / 632 validation / 575 test. Alias families and mode copies of the new examples share semantic groups.

Held-out neural action accuracy: 95.30%; subaction: 84.00%; joint intent: 80.35%. Parser semanticExactMatch in metadata is a rule-parser metric, not neural exact match. Exception parameters are resolved by deterministic parsing, not predicted by the neural heads.

Actual model files: candidate-model/model.json, candidate-model/weights.bin, labels.json, metadata.json. Serialized weights reloaded and prediction verified: true. Production weights unchanged: true. Candidate is not active in the application. Publication gates: Held-out action accuracy must reach 97%.; Held-out subaction accuracy must reach 96%.; Both macro-F1 scores must reach 96%.; Every implemented operation needs a passing held-out execution regression.; Context accuracy must reach 95%..

Data: everyday-training.jsonl; full deduplicated corpus: combined-training.jsonl; complete execution evidence: case-results.json; metrics and release assessment: summary.json. Scoped deletion such as clear all circles except C1 is safely rejected rather than interpreted as global deletion.

Validation: 130 selective-clear/workspace tests, 487 conversation regressions, and 44 real-browser checks passed. Targeted ESLint and the student production build passed. The prior full repository typecheck had 123 existing errors outside the changed files; it was not repeated for this corpus run.

Baseline versus candidate on the same final grouped test split: action 74.26% → 95.30%; subaction 55.83% → 84.00%. The candidate has 480,832 bytes of learned weights.

The 660-row upload dataset is also available from the running development app at http://localhost:9867/datasets/ruhi-everyday-660.jsonl. Reproduce training with `node scripts/train-ruhi-everyday.mjs`, which explicitly enables training only in its isolated Node bundle. Student build training remains disabled.
