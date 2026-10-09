# Ruhi v6 Phase 3

Production release is **BLOCKED**. Results below apply to bounded, reproducible fixtures and this desktop host, not arbitrary mathematical language or all devices.

## Actual implementation

Ruhi remains a bounded hybrid: published TensorFlow.js classifiers propose intent/context; deterministic parsing, conversation state, typed action graphs, MathIR/kernel handlers, independent verification and native adapters govern execution. The Phase2 candidate remains outside public assets. No external LLM is required.

Working geometry, dependency recomputation, cinematic motion, undo/history and canonical persistence remain the execution authority. The new route registry describes 11 existing routes and requires confirmation before leaving a populated workspace.

## Changes

- Restrict shorthand radius/width/height expansion to creation/edit grammar while retaining Circle r5.; named rectangle R1 no longer silently becomes a movement distance.
- Accumulate relative angle words as degrees. Preserve a partially defined line point across clarification turns.
- Recognize Construct in impossible SSS triangle validation; reject before mutation.
- Move a named triangle vertex through its parent construction, propagate dependencies, verify the virtual point after editing, preserve identity/style and undo; reject degeneracy.
- Reject oversized requests/plans before inference/execution. Validate imported identity, finite coordinates, controls, references, budgets and safe plot expressions before renderer effects.
- Add a finite 2D tangent incidence verifier and explanatory Euclidean argument; do not represent numerical consistency as universal exact proof.
- Add a typed real-route capability registry and explicit unsaved-scene navigation confirmation.
- Install a production-only atomic SHA-256-verified offline asset cache, bounded concurrency, source-and-asset cache versions, deferred activation, cold navigation fallback and Vary-safe matching.
- Correct React18 nullable-ref annotations and 52 immutable tuple-array declarations; replace ES2023 findLastIndex with bounded backward iteration and fix writable overlay ref contracts.
- Isolate the legacy transcript test output to tmp/ruhi-test-reports after detecting its historical report overwrite.

## Limits

No general theorem prover, unconstrained plan search, all-domain tutoring, authenticated client-side trainer role or human-unseen accuracy claim. The initial source fingerprint and final archived source are different artifacts; baseline recovery limitations are explicit.

## Evidence integrity incident

The pre-existing `phase1Integrity.test.ts` unconditionally wrote `reports/ruhi-v6-phase1/five-transcripts-matrix.json`. Running it overwrote the untracked historical matrix. Original SHA-256 `5ea12a18487c9bbcf7f01845dbd602a3b37b0f6407522e4aa811c54ad06620e7` remains in the baseline manifest; original bytes were not backed up and were not recovered. The test now writes to `tmp/ruhi-test-reports/`; expectations are unchanged and its 23 tests pass. All other recorded historical report hashes match, and all six published model hashes match. This is a failed history-preservation requirement, not a clean immutable-baseline claim.

The initial uncommitted source was fingerprinted but not fully archived before edits, so its exact original bytes cannot be recreated from the manifest alone. A final source snapshot is supplied for future recovery.

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

