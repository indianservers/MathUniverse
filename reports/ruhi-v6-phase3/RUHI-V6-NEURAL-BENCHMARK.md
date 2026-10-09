# Ruhi v6 Phase 3

Production release is **BLOCKED**. Results below apply to bounded, reproducible fixtures and this desktop host, not arbitrary mathematical language or all devices.

## CPU-only evaluation

No model fitting, calibration changes, threshold tuning or promotion occurred. All six published artifacts are unchanged. The 408 context rows expand 68 new phrase forms across six vocabularies: 17 intent families and four meaning classes. They have zero exact phrase overlap with the saved Phase2 candidate corpus; semantic/template overlap and complete historical production-training provenance cannot be excluded.

| Model | Joint context accuracy | Intent macro F1 | Intent ECE | Accepted correct/accepted |
|---|---:|---:|---:|---:|
| public/models/ruhi-context-v1/model.json | 188/408 (46.08%) | 0.4732 | 0.3268 | 164/245 |
| reports/ruhi-v6-phase2/candidate-model.json | 195/408 (47.79%) | 0.4965 | 0.0723 | 19/21 |

Published primary: 102 deduplicated phrases from seven authored numeric command families, fixed graph2d mode. Action 80.39%, sub-action 60.78%, mode 100.00%, object type 39.22%, all four heads 19.61%. Full confusion matrices, class support/precision/recall/F1, calibration bins and latency are in neural-evaluation.json. Known/common command templates are diagnostic evidence, not guaranteed unseen primary training holdout.

## Comparisons and promotion decision

Phase2 candidate synthetic locked result was 942/1088 (86.58%); published context was 335/1088 (30.79%). This new corpus differs, so 195/408 versus 188/408 is a new stress measurement, not a controlled before/after accuracy improvement. Selective candidate accuracy is 19/21 (90.48%) at only 5.15% coverage; it falls below the historical calibration target. Candidate **NOT PROMOTED**. Human-authored held-out language and broader meanings remain blocked.

Node tensor count returns from 0 to 0 after disposal. Browser candidate CPU100 median 0.4ms, p95 0.7ms, tensors 24→30→24; memory estimates are explicitly unreliable.

## Reproduction

Run from `C:\Indian Servers\Math Universe Visualizations`; retain the local development server on port 9867 for native/frozen checks. Offline runner owns and stops only its preview on 9887.

```text
node scripts/ruhi-v6-phase3-corpus.mjs final
npx vitest run src/math-robo src/offline-intelligence src/graph-studio src/workspace/geometry2dKernel.test.ts src/workspace/mobile src/math-foundation/phase1Contracts.test.ts src/pwa-assets.test.ts src/ruhi-offline-install.test.ts --maxWorkers=1 --testTimeout=60000 --hookTimeout=60000 --reporter=dot
node scripts/ruhi-v6-phase3-neural.mjs
node scripts/ruhi-v6-phase3-native.mjs
node scripts/ruhi-v6-phase3-evidence.mjs frozen-entry
node scripts/ruhi-v6-phase3-evidence.mjs nlp
npm run build:student
node scripts/ruhi-v6-phase3-student-offline.mjs
node scripts/ruhi-v6-phase3-offline-packaging.mjs
npx tsc -b --pretty false
npx eslint . --max-warnings=0
node scripts/ruhi-v6-phase3-check.mjs
```

The bounded validation runner has a 10-minute limit per stage and never edits code, fits a model, promotes weights or publishes. A failed student build prevents testing stale dist. New locked evaluations require a fresh dataset; these published fixtures are now exposed regression evidence.

