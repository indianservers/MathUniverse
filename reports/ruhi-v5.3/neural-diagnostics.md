# Neural diagnostics

No retraining, recalibration, model architecture change or production weight replacement occurred. The historical fine-tuning run was inspected rather than repeated.

## Actual models

Primary: 768 input features, FNV-style hashing of normalized word/unigram, word-bigram and character-trigram tokens into 750 bins; L2 normalization; numeric/operator/coordinate-presence flags; five mode slots. Literal numeric values and live object/history snapshots are absent. Ten trailing slots are unused. Topology: 128 relu → 64 relu → 22 softmax → 90 softmax → 5 softmax → 40 softmax. Four softmax heads: action, subAction, mode, objectType. Exact taxonomy is in model.json.userDefinedMetadata.labels; no open-vocabulary decoding. Confidence is a maximum softmax score, not a calibrated correctness probability. Mode is supplied in the input, so 100% mode accuracy is a consistency result, not conversational understanding.

Separate context network: 848 features for question/page/history/selected-type/simulation input; 56026 parameters; intent/meaning heads with existing abstention thresholds. Its labels and test partition differ from the primary model's.

## Fresh measurements

Primary compatible first-action labels: 29 evaluable, 14 excluded rather than forced into unsupported heads. Primary action+subaction: 7/29 = 24.14%; heads: {"action":0.5862068965517241,"subAction":0.4827586206896552,"mode":1,"objectType":0.6551724137931034}. Four-head joint: 6/29 under the historical compatibility mapping. Object-type mappings for non-creation requests are limited; this is not target resolution accuracy.

Context test: 445/648 intent, 577/648 meaning, 425/648 joint; 518 predictions accepted by existing thresholds. This exposed controlled-template partition is not an untouched real-world holdout.

Hybrid results and per-record parser/model-source/final-state evidence: classifier-error-analysis.json and v53.json. A neural prediction can be computed without controlling execution; model-sourced proposal acceptance is distinguished. Context accuracy on the 300 phrases is unmeasurable without independently supplied context-intent/meaning labels.

## Dataset evidence

Starter: 3903 rows, 169 operations; class imbalance ratio 90; 1540 duplicates and 2236 near duplicates. Initial quality checker reported three equivalent-parameter forms as conflicts; that false rejection was repaired without changing any fixture/label. Raw aliases are retained in starter-conflicts.json. Genuine contradictory actions/values still fail regression tests. Current conflicts: 0.

300-record partition: 0 scenario crossings, 37 numeric-template families and 17 identical phrases cross splits. Original split names retained and exposure acknowledged. Vocabulary hashing has no explicit learned dictionary; collisions/order compression, absent numeric magnitudes and absent object/history features constrain context-dependent decisions. Whole multi-command plans and newer geometry operations exceed categorical primary labels.

## Fine-tuning failure

Historical configuration: 150 training and 30 compatible validation records, three epochs, fixed existing weights, deterministic sequential CPU batches. Training history: [{"epoch":1,"loss":8.256247285207113,"validation":{"action":0.6666666666666666,"subAction":0.23333333333333334,"mode":1,"objectType":0.6},"primaryAccuracy":0.16666666666666666,"priorAccuracy":1,"accepted":false},{"epoch":2,"loss":7.480748462677002,"validation":{"action":0.6666666666666666,"subAction":0.23333333333333334,"mode":1,"objectType":0.6333333333333333},"primaryAccuracy":0.16666666666666666,"priorAccuracy":1,"accepted":false},{"epoch":3,"loss":6.867899398803711,"validation":{"action":0.6666666666666666,"subAction":0.23333333333333334,"mode":1,"objectType":0.6333333333333333},"primaryAccuracy":0.16666666666666666,"priorAccuracy":1,"accepted":false}]. Lower loss did not improve validation primary accuracy (16.67%); original epoch-0 checkpoint retained. Small compatible support, distribution shift, incomplete head coverage and missing scene/context inputs are evidenced limitations. Overfitting is plausible, not proven by three epochs; model capacity alone is not established as the cause. Correct labels and split design must precede any v6 architecture/training decision.
