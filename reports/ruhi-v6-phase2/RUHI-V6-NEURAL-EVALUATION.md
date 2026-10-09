# Ruhi v6 neural evaluation

Historical/exposed results were reproduced before candidate fitting: primary classifier 7/29; context joint 425/648. These are exposed regression measurements, not unrestricted language accuracy. See `held-out-classifier.json`, `context-classifier.json` and their weights hashes.

The new controlled corpus has 6,528 context records: 102 authored base utterances, two politeness variants and 32 existing reviewed page vocabularies. All intent utterances in an authored family share one partition. Families 0–2 train, 3 validate, 4 calibrate and 5 form the untouched candidate holdout. This is synthetic language and context variation, not 6,528 independent human questions.

Both candidates use existing 848-feature encoding and existing intent/meaning heads; hidden widths 32 and 64, 35 epochs, CPU, fixed initializer seeds 73/79/80, deterministic order, shuffle disabled. Workflow seed is 20261009. Selection used validation only: joint accuracy 47.06% (32 units) versus 46.42% (64). The selected candidate was frozen before holdout evaluation.

| Same new synthetic holdout | Published context model | Selected candidate |
|---|---:|---:|
| Joint intent/meaning accuracy | 30.79% | 86.58% |
| Intent macro F1 | 0.2945 | 0.9063 |
| Parameters | 56,026 | 28,026 |
| Joint confidence ECE | 0.5074 | 0.1784 |

Holdout size is 1,088 context records but only 34 distinct utterances from one withheld family per intent. Do not derive an independent-binomial human-language confidence interval from those correlated rows. Per-class precision/recall/F1, calibration bins and CPU timings are in `neural-evaluation.json`.

The candidate accepted 301/1,088 records (27.67% coverage), with 300/301 correctly classified (99.67% selective accuracy). Abstention is deliberate; this is classification correctness, not mathematical verification. Five typo/command/OOD probes were rejected by the confidence gate. This small stress set is not a robust OOD benchmark.

Candidate weights are 112,104 bytes, outside `public/models`. Browser CPU results are in `native-browser.json` and `browser-cpu-comparison.json`; they measure this host, not minimum hardware. Tensor allocation and disposal are recorded separately from total browser process memory.

**Not promoted.** Only four meaning classes are covered by this corpus (active, previous, selected, unknown); five explicit topic meanings are excluded. Original model files remain unchanged. There is no human unseen evaluation or new multi-intent/reference head evaluation. Candidate improvement does not change the published primary classifier's 7/29 result.
