# Ruhi v6 Phase 3

Production release is **BLOCKED**. Results below apply to bounded, reproducible fixtures and this desktop host, not arbitrary mathematical language or all devices.

## Corpus

Generated, structurally validated and executed: **10000**. Passed **10000**, failed **0**. Full-record duplicates and family partition leakage: zero. SHA-256 `87577ce22cc86dca8a54ab6a9810fd7fc7132494e71aae9ac5a87dabcc7b73cc`; seed 20261009. Families: 44; unique turn sequences: 7648.

| Category | Records |
|---|---:|
| drawing | 800 |
| transformations | 800 |
| context | 1000 |
| clarification | 800 |
| planning | 900 |
| algebra | 900 |
| geometry2d | 900 |
| geometry3d | 700 |
| verification | 900 |
| pages | 600 |
| tutor | 500 |
| negative | 700 |
| persistence | 500 |

Partitions: development 7679, regression 998, locked evaluation 1323. Entire grammar families stay in one partition; no model fitting used any partition. Locked cases were first evaluated after the development repairs and then checked again after a legacy-regression-driven shorthand correction; they are now exposed.

## Repair evidence

Baseline nonlocked: 7919/8677 passed, 758 failed (250 relative angle, 300 incremental line, 200 shorthand label/distance, 8 impossible SSS). Repair1: 8669/8677. Repair2: 8677/8677. Final: 10000/10000. An initial harness rejected exact numeric strings; its 1434 failures remain archived separately in baseline/harness-format-* and are not attributed to the app.

## Oracle and coverage limits

Coordinates, arithmetic, dimensions, true/false claims, identities, dependency counts and nonmutation expectations are authored independently of execution. Node uses a no-op native callback; native/browser commits are tested separately. Every row contains history/setup, page/mode, finite mathematical fixtures and terminal scene expectations, but expected semantic-plan/verification metadata are not fully granular for every language family. Numeric and irrelevant-context substitutions dominate some categories. Pages cover a reviewed Unit Circle topic plus unsupported pages; this is not 10000 distinct linguistic families or a complete algebra/equation-solving benchmark.

The baseline 758 failures are stored as complete fixtures with traces; failures were not removed or relabelled. `corpus-audit.json` and `final-corpus-results.jsonl` are machine-readable.

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

