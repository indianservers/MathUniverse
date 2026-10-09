# Ruhi v6 Phase 3

Production release is **BLOCKED**. Results below apply to bounded, reproducible fixtures and this desktop host, not arbitrary mathematical language or all devices.

## Results

- Adversarial corpus:10000 generated/validated/executed/passed;0 failed,44 grammar families. Controlled synthetic/state-expanded coverage.
- Development/regression baseline:7919/8677→8677/8677 after758 fixture failures repaired.
- Scoped tests:7864 passed/65files; final focused30 passed; legacy-output-isolation23 passed. Suites overlap.
- Frozen conversations:100/100. Original NLP300:293 passed,4 failed missing-C oracle conflicts,3 blocked underdefined trapezoids.
- Native workspaces:38/38. Installed-student cold-offline/UI checks:11/11. Packaging checks:3/3.
- TypeScript:218→123. ESLint:439→437 errors;133→133 warnings. Student build succeeds; checked release fails.
- Published context188/408 versus candidate195/408 on new controlled stress rows; primary four-head exact20/102. No broad unseen-human accuracy claim and no model promotion.
- Six published model artifacts unchanged. No commit/push/deploy/retrain/v7.

## Fixed behavior

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

## Unresolved blockers

Static diagnostics remain across lesson/adaptor/studio modules; they are preserved without suppressions. Neural historical provenance/human generalization, complete major-studio acceptance, low-end physical-device compatibility and full browser/theme/recovery breadth remain incomplete. The original NLP oracle conflicts stay visible. One historical Phase1 matrix report lost its original bytes during a legacy test and cannot be claimed preserved. The initial source was fingerprinted rather than fully archived before edits.

## Verdict

**Production release BLOCKED.** This is a tested local Phase3 implementation and partial acceptance assessment, not completion of every capability in the master prompt or approval to ship. Gates B,K,L fail; F,G,I remain blocked. The code, original failures, limits and recovery incident are reviewable alongside machine-readable evidence.

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


## Detailed reports

- [RUHI-V6-ADVERSARIAL-10000-REPORT.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-ADVERSARIAL-10000-REPORT.md>)
- [RUHI-V6-CONVERSATION-RELIABILITY.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-CONVERSATION-RELIABILITY.md>)
- [RUHI-V6-CROSS-STUDIO-REPORT.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-CROSS-STUDIO-REPORT.md>)
- [RUHI-V6-MATH-VERIFICATION-REPORT.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-MATH-VERIFICATION-REPORT.md>)
- [RUHI-V6-NEURAL-BENCHMARK.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-NEURAL-BENCHMARK.md>)
- [RUHI-V6-PERFORMANCE-REPORT.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-PERFORMANCE-REPORT.md>)
- [RUHI-V6-PHASE3-ARCHITECTURE.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-PHASE3-ARCHITECTURE.md>)
- [RUHI-V6-RELEASE-GATES.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-RELEASE-GATES.md>)
- [RUHI-V6-SECURITY-AND-OFFLINE-AUDIT.md](<C:/Indian Servers/Math Universe Visualizations/reports/ruhi-v6-phase3/RUHI-V6-SECURITY-AND-OFFLINE-AUDIT.md>)
