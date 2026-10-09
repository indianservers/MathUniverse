# Ruhi v6 Phase 1 final report

Implemented the execution/verification contracts, canonical MathIR projection, bounded request-ID worker transport, stale specialist-result protection, serialized scene transactions, constrained AB side edits, cycle/undefined-state handling and versioned semantic persistence. Existing engines, routes, motion engine and published weights are preserved. Phase 2 had not begun when these source hashes and test results were captured. No commit, push, promotion or deployment was performed.

## Results

| Evidence | Before | Final |
|---|---|---|
| Frozen100 | 100/100 | 100/100, 0 failed |
| NLP300 | 292 passed, 5 failed, 3 blocked | 297 passed, 0 failed, 3 blocked; source fingerprint valid |
| Scoped tests | 7739 | 7798 passed, 0 failed; 35 Phase 1 additions and 24 other-task tests |
| Native workspace matrix | Historical 170/170 | 170/170 |
| New native edits/import checks | — | 24/24, zero page errors |
| Native graph save/reload | Historical evidence | All 7 checks passed |
| TypeScript errors | 218 | 218 |
| ESLint | 439 errors, 133 warnings | 439 errors, 133 warnings |
| Student bundle | Historical build | Build succeeded; existing chunk-size warnings remain |
| Published model integrity | Six JSON/binary hashes | All unchanged |

Newly introduced tested regressions: 0. Baseline named-function plot failures were repaired by stripping the f(x)= declaration from the scalar renderer expression, preserving the other task's creation-parser additions. No benchmark expectation or published weight was edited. Historical baseline neural scores are not new measurements.

## Implementation and acceptance

A: pass in tested scope (all prior scoped tests remain passing). B: worker abort/error/timeout capacity and stale replies tested; queued scene cancellation rolls back after an adapter settles. C: seven typed execution outcomes are threaded through workers, kernel/CAS adapters, orchestration and UI. D: new verified outcomes require independent evidence; numerical scene invariants and decimal rounding are labelled numerical consistency. E: stable IDs, labels, styles and dependencies survive tested edits and both semantic/native saves. F: invalid AB side constraints, duplicate IDs, cycles and native commit failures reject or roll back without scene corruption. G: exact five transcripts are tested in all four modes; ambiguity and unsupported features remain exposed, rather than fabricated complete conversations. H: frozen100/NLP300 raw evidence retained. I: all published model hashes unchanged. J: contracts, migration, coverage, provenance and handoff delivered.

Independent verification covers bounded rational evaluation, polynomial coefficient identities/differentiation/integration, exact definite-integral bounds, modular congruence and positional reconstruction. Other solver classes complete as valid_unverified. The new status is authoritative; legacy confidence fields remain compatibility adapters. Typed exact-geometric confidence is reserved, not emitted for floating scene coordinates.

## Limitations

The work does not provide complete CAS verification. Many transcendental/equation/geometry-kernel answers remain independently unverified. Natural-language constrained side policies currently cover AB with complete anchoring/direction/orientation wording; other labelled-side policies require more language work. Parent-defined triangles cannot drop dependencies to force a side length. A native adapter that never settles cannot be safely rolled back within a hard deadline; synchronous no-Worker computation also cannot be interrupted mid-JavaScript execution. New envelope import/export supplements native Save/Restore controls; it does not migrate every legacy native file format or persist every native undo stack across browser reloads. Exact transcripts 3 and 5 omit required endpoints/angles and remain blocked until those are supplied. 3D circumcircle construction remains unsupported. Static debt still blocks a claim of a clean typechecked production release.

## Evidence and reproducibility

final-evidence.json contains the frozen source/model hashes, seed and final counters. Full commands are in baseline-manifest.json. Raw results: final-frozen100.json, final-nlp300.json, after-full-scoped.txt, final-typescript.txt, final-eslint.json, browser-results.json, persistence.json, phase1-native-browser.json, five-transcripts-matrix.json and build-student.txt. Two concurrent-edit baseline attempts were invalidated and retained as inconclusive logs. One 100-pass run encountered a report-write error and was rerun successfully. Reproduced unit/frozen baselines began before the other task's final clear/function edits; the accepted NLP baseline was captured after that task stopped editing. The final native and scoped suites include its completed changes.

Rollback only the Phase 1 files/hunks listed in final-evidence.json. Preserve other-task workspace-clear handling and function-creation additions. Published model files and native save keys were not changed. Reports/fixtures generated by test runs remain evidence artifacts.
