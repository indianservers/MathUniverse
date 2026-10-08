# Ruhi TensorFlow.js contextual intelligence

Ruhi now combines the unchanged v4 action model with a separate, actually trained TensorFlow.js contextual classifier. The context model ranks intent and meaning using the question, page vocabulary, previous topic, selection types and simulation features. Grounded records and existing engines provide answers; the classifier is not a knowledge database. Drawing, plotting, specialist calculations and pending parameter answers keep their existing validated execution path.

## Measured quality

| Measure | Result |
|---|---|
| Held-out contextual questions | 648 |
| Intent classification | 68.7% |
| Context/meaning classification | 89.0% |
| Joint intent + meaning | 65.6% |
| Ambiguous terminology subset | 100.0% |
| Confidence-accepted held-out coverage | 79.9% |
| Confidence-accepted held-out joint precision | 77.0% |
| Calibration accepted joint precision | 98.0% |
| Real browser acceptance answers | 14/14 |
| Native Pigeonhole simulation | Passed: actual boxes [4, 3, 3] |
| False simulation actions in 15 negative/read-only/uncertain tests | 0 |

**The 95% contextual target was not achieved.** Classification quality is measured separately from the successful authored application scenarios. Definitions can remain mathematically correct even when a requested response style is misclassified. Class-specific thresholds were fitted only on calibration rows, including conservative abstention; calibration precision does not guarantee the same precision on unseen phrasing.

Both linear and 64-unit architectures were trained and measured. Calibration joint accuracy selected the 64-unit network (89.2%), without choosing by test score. It has 56,026 parameters and 2,24,104 bytes of weights. The first unbalanced benchmark is retained in initial-model-evaluation.json; balanced intent/meaning sampling and varied contextual flags corrected its weak rare-meaning performance. Final training used 6888 source rows: 4992 train, 1248 calibration, 648 untouched test. Semantic syntax groups stay entirely within one split. Concepts/context vocabulary recur across splits; this is a template-held-out benchmark, not a claim of independent unseen-domain or natural student-language accuracy.

## Real application evidence

The browser verified Pigeonhole explanation, Explain this → Example → Why, graph-theoretic tree, computing tree, explicit biological override, uncertainty, page transitions and two warm offline turns. Ten objects in three boxes updated the mounted React PigeonholeLab to [4,3,3]; existing ceilDivision/evenOccupancy and independent committed-state checks produced the guaranteed occupancy of four. The context model loaded once across SPA navigation. Existing character answer/uncertainty/workspace events remain connected.

There is no standalone Data Structures route. Scenario C used the existing /discrete-world/algorithms page as a computing context; this is disclosed rather than claiming a nonexistent page was tested. The Graph Theory module also contains a native binary/AVL/expression tree visualization, but that panel is not separately connected to the contextual simulation bridge.

Reference tests cover the previous topic, selected stable object IDs, current topic and follow-up chains. Their focused assertions passed; they are not a statistically broad reference-resolution accuracy estimate. The context adapter has no destructive workspace executor. Existing mathematical actions independently validate parameters/capabilities and verify committed state regardless of neural confidence.

## Actual page and knowledge coverage

Automatic discovery found 1056 navigation/lesson records, including 674 real lessons. 674 records have ingested definitions/summaries. Lesson formulas and worked connections are reused from existing content. Five reviewed specialist meaning records cover pigeonholes, graph trees, computing trees, real trees and ordinary pigeonholes. Only pigeonhole and graph-tree records currently carry reviewed contextual proofs.

Discovery is not the same as full conversational/action coverage. Not every discovered studio has a reviewed definition, proof, example, practice family or native simulation adapter. Runtime can explain available lesson records; missing records/actions are reported explicitly. The training corpus samples actual introductory lesson contexts plus the contextual terminology records, rather than covering all 1,056 pages in training. The independent held-out set spans 13 context IDs and 57 syntax groups. Generated lesson prose was ingested from repository content, not independently re-audited for mathematical completeness in this task.

## Offline performance

Browser backend: cpu, mean warm inference 0.662 ms, p95 0.800 ms over 150 predictions. Tensor count 24 → 24, with no inference growth. Node CPU mean: 0.246 ms over 150 predictions. CPU-compatible operation was verified; the existing TFJS backend setup can use supported WebGL. Loading is cached, tensors use tidy, and administrator training runs in a worker.

The mobile screenshot is a 390×844 viewport on desktop hardware, not a physical mobile-device performance benchmark. Low-end phones and cold-install offline caching remain unverified. Warm offline behavior after model/page loading passed.

## Training, distribution and model files

The administrator browser check loaded all 6,888 rows and received worker epoch/loss progress while the main thread remained responsive; that check was stopped after verifying worker operation. Complete training and model benchmarking were performed in the local training runner.

The existing Training Lab now has a Context Intelligence section for loading discovered-page rows, guarded JSONL import, worker training, candidate metrics, reviewed export and candidate rollback. Candidates persist separately at indexeddb://ruhi-context-v1-candidate; student inference uses the immutable bundled /models/ruhi-context-v1/model.json. Export gates require a reviewed candidate reaching 95% held-out joint accuracy, which the current contextual model does not reach. Initial task-authorized model artifacts are available for the tested runtime and inspection; further broad production distribution should account for the reported quality gap.

Weights: public/models/ruhi-context-v1/weights.bin. Architecture/calibration/version: public/models/ruhi-context-v1/model.json. Existing v4 weights unchanged from Git HEAD: true. No v4 dataset rows or capabilities were removed.

The app is browser-only. Training APIs reject student builds; production routes exclude the Training Lab. This build/distribution separation cannot strongly authorize an administrator against somebody controlling their own browser. There is no backend publishing endpoint to secure. Publishing a version means an administrator reviews/export artifacts, updates the immutable bundled version and distributes a rebuilt student app. Candidate rollback restores the bundled version; rollback of a distributed release requires redistribution of the prior bundle. Fine-tuning from an existing contextual checkpoint and automatic multi-version production rollback are not implemented.

## Verification and remaining gaps

- 5646 intelligence/offline regression tests passed; 9 focused contextual/security tests passed.
- The original native 35-turn four-workspace browser suite passed after repairing matrix-call and numeric-continuation priority.
- Production build: true; scoped intelligence TypeScript: true; context training panel TypeScript: true; student production security: true.
- Full-project TypeScript errors documented by the earlier orchestration audit remain outside this scoped integration; no clean repository-wide typecheck is claimed.
- Generalization is below target. Broad proof generation, arbitrary page-control changes, all-studio simulations, unrestricted general chat and complete contextual practice coverage remain unsupported. Existing specialist math/practice engines continue to handle their established commands.

Evidence: audit.md; page-inventory.json; dataset.jsonl; model-evaluation.json; held-out-results.json; calibration.json; browser-results.json/screenshots; cpu-performance.json; false-action-results.json; regression/build/typecheck/security logs. Changes remain reviewable in the workspace.
