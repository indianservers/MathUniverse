# Phase 1 benchmark comparison

Environment: Windows, Node v24.13.1, initial main revision 249a5cc139ed1a9b4aa99bf6dadd3310b224c8ca. Test seed 20261009. Full command lines and published model SHA-256 values are in baseline-manifest.json. No frozen expected output was changed.

| Suite | Reproduced before | Latest completed after |
|---|---|---|
| Frozen100, normal assistant entry in browser | 100 passed / 0 failed | 100 passed / 0 failed; final-frozen100.json |
| NLP300, original corpus/oracles | 292 passed / 5 failed / 3 blocked | 297 passed / 0 failed / 3 blocked; final-nlp300.json; fingerprint verified |
| Existing scoped regressions plus additions | 7739 passed | 7798 passed; 35 Phase 1 additions and 24 tests from the other completed user task |
| Native four-workspace matrix | Historical 170/170 | 170/170; browser-results.json |
| New Phase 1 native edits/import | No baseline | 24/24, zero page errors |
| Native graph save/reload | Historical evidence | All checks passed; persistence.json |
| TypeScript | 218 errors | 218 errors; seven introduced diagnostics repaired |
| ESLint | 439 errors / 133 warnings | 439 errors / 133 warnings |

The five baseline failures are RUHI2D-032, -036, -040, -044 and -048: named-function plot definitions retained f(x)= as the expression instead of its scalar right-hand side. The Phase 1 parser repair fixes them without changing benchmark expectations. Details: baseline-failures.json.

Two initial NLP attempts were invalidated by source changes from the other task and retained as inconclusive logs. The accepted reproduced baseline has fingerprintVerified=true. A frozen100 run logged all 100 passes but encountered a report-write error; final-frozen100.json comes from the completed rerun. Historical v5.3 metrics are separate from the reproduced before column.

Published model integrity: model-integrity.json compares all six model JSON/binary hashes against the before manifest. No training/promotion or published-weight edits occurred. Existing test suites may fit disposable in-memory fixture models; that is not production model training.
