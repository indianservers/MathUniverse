# Ruhi v6 Phase 2 final report

Phase 2 extends the existing browser neuro-symbolic pipeline with mathematical conversation memory, ambiguity resumption, explicit ordered action graphs, live construction dependencies, page grounding and bounded tutoring. Neural outputs remain proposals. Actual validation, geometry/kernel execution and independent evidence determine answers. Production weights are unchanged; the experimental context model is not promoted. No commit, push, deployment or Phase 3 work was performed.

## Implemented scope

- Workspace/page-scoped specialist and conversation contexts; typed working/session/project projections; geometry-version invalidation and clean saved-scene session boundaries.
- Relative dimensions from current physical scale, cumulative angles, ordinal clarification, geometric 2D references, retained previous length, fuzzy-scale clarification and point-plus-angle infinite-line completion.
- Ordered create/transform/measure/explain/check action graphs through the existing atomic executor. Explicit construction references take precedence over newly created objects. Invalid steps leave the scene unchanged.
- Three live triangle medians, vertex-dependent centroids including three coordinates in both 3D workspaces, and existing dependent circumcircles. Translation, undo and explicit scene import preserve these constructions.
- Circumcenter equidistance and 2D parallel-direction checks with independent numerical evidence. Proof follow-ups retain the checked result and invalidate when geometry changes. Unsupported general proofs receive no verified certificate.
- Reviewed page context with current selected angle/expression; unit-circle metadata; unknown-page fallback. Existing registered simulation capabilities retain precedence.
- Scene-grounded rectangle/square area tutoring with equivalent numeric answers, progressive hints, specific wrong-answer feedback and detailed/brief explanations. This is bounded tutoring, not general theorem proving.

The final 3D regression exposed a distance bug: the suffix in label T1 could be read as a movement distance. Explicit directional distances now take precedence, and numeric label suffixes cannot fill missing distances.

## Files and architecture

New runtime modules under `src/math-robo/intelligence/`: `conversationState.ts`, `actionGraph.ts`, `mathQuestionRouter.ts`, `pageMathContext.ts`, `groundedTutor.ts`.

Updated runtime modules: `conversationEngine.ts`, `semanticEngine.ts`, `semanticParser.ts`, `executionPlanner.ts`, `workspaceDependencies.ts`, `actionRegistry.ts`, `targetResolver.ts`, `numberParser.ts`, `liveAssistant.ts`, `engineRouter.ts`, `contextAssistant.ts`, `contextKnowledge.ts`, `semanticDataset.ts`.

New verification: `phase2Conversation.test.ts` and development scripts `ruhi-v6-phase2-baseline.mjs`, `ruhi-v6-phase2-neural.ts/.mjs`, `ruhi-v6-phase2-dialogues.ts/.mjs`, `ruhi-v6-phase2-corpus-audit.mjs`, `ruhi-v6-phase2-evidence.mjs`, `ruhi-v6-phase2-native.mjs`, `ruhi-v6-phase2-cpu.mjs`, `ruhi-v6-phase2-student-offline.mjs`, `ruhi-v6-phase2-finalize.mjs`. `src/math-robo/testReport.ts` supplies bounded retries for transient Windows report writes; existing report-writing tests use it without changing their assertions. Generated artifacts and the complete dirty-file inventory are recorded separately in `final-evidence.json`.

Phase 1 mathematical IR, outcomes, independent kernel verification, worker transport and canonical dependency integrity remain in use. The other completed task's workspace-clear/function edits are preserved. This report does not attribute all pre-existing dirty files to Phase 2.

## Before/after measurements

| Measurement | Reproduced baseline | Phase 2 result |
|---|---:|---:|
| Frozen conversation regression | 100/100 | 100/100, 0 failures |
| NLP300 after Phase 1 | 297 passed, 0 failed, 3 blocked | 297 passed, 0 failed, 3 blocked; fingerprint verified: true |
| Scoped regression tests | 7,798 | 7,828 passed across 61 files |
| New focused conversation suite | Initial 4/11 | 30/30 |
| Published primary classifier, old exposed set | 7/29 | Unchanged weights; not a new holdout claim |
| Published context classifier, old exposed set | 425/648 joint | Unchanged weights |
| Same new synthetic context holdout | 335/1,088 (30.79%) | Candidate 942/1,088 (86.58%) |
| Context intent macro F1 | 0.2945 | Candidate 0.9063 |
| Context parameters / weight bytes | 56,026 / 224,104 | Candidate 28,026 / 112,104 |
| Controlled browser CPU median / p95 | 1.4 / 2.4 ms | Candidate 0.9 / 1.2 ms |

The candidate accepted 301/1,088 inputs, with 300 correct: 27.67% coverage and 99.67% selective classification accuracy. One accepted misclassification is retained. These figures do not measure mathematical verification or unrestricted human language understanding. Five OOD/typo probes all abstained; that small sample is not broad OOD validation.

## Data and candidate fitting

There are 6,528 controlled context rows: 102 authored base phrases, 204 utterances, 32 reviewed page vocabularies and six family groups. Whole phrase families partition into 3,264 train / 1,088 validation / 1,088 calibration / 1,088 holdout rows. Politeness variants stay together. Widths 32 and 64 are compared on validation only; width 32 is selected before the untouched holdout. CPU training uses 35 epochs, fixed initializer seeds 73/79/80, workflow seed 20261009, deterministic ordering and no shuffle. Only four context meaning classes are covered. Human unseen evaluation remains outstanding.

Dialogue development executes 456 complete conversations and 1,824 predeclared-status records with zero declared-status/nonmutation failures. Canonical deduplication removes 214 rows, leaving 1,610 dialogue candidates; total candidate records are 8,138. Exactly 192 dialogue records overlap known regression utterances and are explicitly labelled. Dialogue command labels are engine-generated development candidates, not independent ground truth or an unseen neural holdout. No frozen benchmark oracle was edited.

`candidate-manifest.json` pins topology/weights/data hashes and candidate-only status. `model-integrity.json` records the six original public model files. Candidate artifacts remain in this report directory, outside production assets.

## Verification and acceptance

Final results and immutable fingerprints are recorded in `final-evidence.json`. Raw logs retain earlier source-changing runs, transient Windows report-write errors and a contended test timeout. Assertions were not relaxed to erase failures. A mistaken palette oracle uses the existing app palette; missing-distance clarification uses the existing `ambiguous` status and asserts the actual question and unchanged coordinates.

| Gate | Assessment and evidence |
|---|---|
| 1 Mathematical execution | Scoped pass: independent coordinate/kernel oracles and negative proof tests; no known false verified result in tested scope. Not a general correctness proof. |
| 2 Frozen regressions | Scoped pass: 100/100 frozen, NLP 297/300 with 0 failures and 3 retained blocked cases; 7,828 scoped tests. |
| 3 Neural evaluation | Scoped pass for the isolated controlled context candidate with family-separated validation/calibration/holdout. Production primary improvement and unseen human accuracy are incomplete. |
| 4 References | Scoped pass: selected/ordinal/geometric/previous references and ambiguity tests. Targeted samples, not broad precision. |
| 5 Planner | Scoped pass: five-node compound graph, exact outputs, invalid-step atomic rejection and undo. |
| 6 Clarifications | Scoped pass: candidate selection, exact-scale and missing-line resumption; referenced geometry versions invalidate stale tasks. |
| 7 Grounded responses | Scoped pass: live areas, previous length, independent geometry evidence, equivalent tutor answers and proof follow-ups. |
| 8 Explanation/proof/visualization/verification | Scoped pass for declared coordinate proof, reviewed metadata, existing registered visualization routes and measurement verification. Unrestricted proofs/page intelligence remain unsupported. |
| 9 Model protection | Scoped pass for student build/API guards and immutable published artifacts. Offline client role flags cannot securely authenticate a device owner. |
| 10 Offline/CPU | Browser CPU and software-rendered native checks are measured. Built loaded-workspace disconnection is separately recorded. Cold-start offline installation/caching and minimum-device coverage remain incomplete; the existing app clears service-worker caches. |

## Reproduction

Run from the repository root. Candidate fitting is an explicitly authorized development-only command and does not promote weights.

```powershell
npx vitest run src/math-robo src/offline-intelligence src/graph-studio src/workspace/geometry2dKernel.test.ts src/math-foundation/phase1Contracts.test.ts --maxWorkers=1 --testTimeout=60000 --hookTimeout=60000 --reporter=dot
npx vitest run src/math-robo/intelligence/phase2Conversation.test.ts --maxWorkers=1 --testTimeout=60000 --reporter=verbose
node scripts/ruhi-v6-phase2-baseline.mjs
node scripts/ruhi-v6-phase2-neural.mjs --train-candidates
node scripts/ruhi-v6-phase2-dialogues.mjs
node scripts/ruhi-v6-phase2-corpus-audit.mjs
node scripts/ruhi-v6-phase2-evidence.mjs frozen-entry
node scripts/ruhi-v6-phase2-evidence.mjs nlp
node scripts/ruhi-v6-phase2-native.mjs
node scripts/ruhi-v6-phase2-cpu.mjs
npx tsc -b
npx eslint . --format json --output-file reports/ruhi-v6-phase2/eslint-final.json
npm run build:student
node scripts/ruhi-v6-phase2-student-offline.mjs
```

Browser evidence scripts use the existing local app on port 9867. The student disconnection script starts and stops its own preview on port 9887. Runtime inference needs local assets, not an external inference API. Run heavy typecheck/build jobs separately from CPU-learning benchmarks to avoid resource contention.

## Release limitations

Existing TypeScript and ESLint debt blocks a clean checked release. A successful bundle does not remove that debt. No production candidate promotion, human-language accuracy claim, general theorem prover, general tutor, universal simulation grounding or secure offline trainer authentication is claimed. Three pre-existing NLP cases remain explicitly blocked: RUHI2D-010, RUHI2D-020 and RUHI2D-030 request a “regular trapezoid” from only its center and circumradius. That has no unique conventional construction; they are retained dataset-expectation errors, with no invented vertices. See `RUHI-V6-PHASE3-HANDOFF.md` for the evidence and work needed before release.

The final TypeScript repair is a non-null assertion after target resolution in the centroid reducer. `type-only-correction.json` records identical emitted JavaScript before/after the correction. The student build, native tests and full regression therefore cover the same executable behavior; the NLP fingerprint is revalidated against the final source.

## Final build and verification record

Student build: passed. TypeScript: 218 errors; ESLint: 439 errors / 133 warnings. These reproduce existing debt and block a clean checked release. Native browser checks: 36 passed / 0 failed / 0 page errors. Loaded student UI without network: 8 passed / 0 failed / 0 errors. Cold-start offline caching remains incomplete. All six published model files unchanged: true.

Evidence: [final manifest](final-evidence.json), [scoped log](scoped-regression-final.txt), [focused log](final-focused.txt), [frozen100](100-question-v53-report.json), [NLP300](v53.json), [native browser](native-browser.json), [student offline](student-offline.json), [build log](build-student-final.txt), [TypeScript](typescript-final-stable.txt), [ESLint](eslint-final.json), [neural evaluation](neural-evaluation.json), [candidate manifest](candidate-manifest.json), [CPU comparison](browser-cpu-comparison.json), [corpus audit](combined-corpus-audit.json).
