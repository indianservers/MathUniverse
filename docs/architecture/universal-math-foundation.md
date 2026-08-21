# Universal Math Foundation

## Existing architecture

Math Universe is an offline-capable React 18 and strict TypeScript application built with Vite. React Router owns routes, Zustand and local component state own interactive state, and the application uses a shared Tailwind-based UI language. Existing mathematical features are distributed across custom workspace kernels, a Nerdamer-backed/custom CAS command layer, graph samplers, React Three Fiber/Three.js 3D views, geometry kernels, D3/Recharts data views, and JSON/TypeScript lesson catalogues. Vitest is the unit/integration test runner and Playwright covers browser, visual, and accessibility workflows. Capacitor supplies native packaging and the Vite PWA integration supplies offline assets.

Before Phase 1, `src/data/syllabus.ts` used the broad labels `available`, `mapped`, and `future`. Those labels remain supported for old screens, but they are not certification evidence. Existing workspace `MathObject` records and import/export formats also remain intact.

## Phase 1 decisions

The foundation is deliberately additive. `src/math-foundation` separates parsing, typed ASTs, value arithmetic, evaluation, dependency recomputation, native-document persistence, and module adapters. No layer calls `eval` or `Function`. Unsupported operations return structured diagnostics.

The parser produces source-ranged, typed nodes with stable IDs inside a parsed definition. Exact integer, normalized rational, and complex arithmetic use `BigInt`; approximation is separate and labelled. The dependency graph is the sole owner of live definitions. Adapters retain source node IDs and derive module data on demand, preventing graph/table/geometry copies from diverging.

The truth layer in `src/truth-layer` models curriculum dimensions independently, validates advanced claims centrally, and keeps AP BIE and Telangana BIE—as well as IA, IB, IIA, and IIB—distinct. Registry entries begin only at statuses justified by repository tests. No sample record is marked complete or certified.

## Reused components

- Existing `AppLayout`, `TopicHeader`, `SectionCard`, action styles, dark mode, and responsive tokens.
- React Router lazy-route conventions.
- Browser-local persistence and existing file download/open patterns.
- Existing graph, geometry, CAS, table, and 3D modules remain untouched; the adapters form a gradual boundary to them.
- Vitest and existing strict TypeScript settings.

## New modules

- `types.ts`: typed AST, diagnostics, values, assumptions, domains, units, and results.
- `parser.ts`: deterministic tokenizer/parser and symbol dependency extraction.
- `values.ts` and `evaluator.ts`: exact arithmetic and typed evaluation results.
- `dependencyGraph.ts`: incremental invalidation, deterministic topological evaluation, cycles, subscriptions, transactions, undo, and redo.
- `document.ts`: version 1 native format, deterministic serialization, validation, quarantine, schema-0 migration, selection clipboard payloads, and graph restoration.
- `adapters.ts`: CAS/result, 2D graph, table, geometry point, and honest 3D-unsupported adapters.
- `truth-layer`: curriculum/capability schemas, central validation, initial evidence-backed registries, and repeatable legacy migration.
- `/math-document`: production integration surface.
- `/coverage-dashboard`: internal registry-derived evidence dashboard.

## Backward compatibility and migration

Legacy syllabus data remains readable by existing screens. `migrateLegacySyllabus` preserves IDs, never upgrades a claim, converts availability/complete/certified claims to `UNVERIFIED`, labels generated content `GENERATED_SCAFFOLD` with draft explanation coverage, and produces a deterministic summary. Rerunning it with the same source gives the same output. Recovery is source-preserving: keep the original legacy file, write migrated data to a new registry, validate it, and switch consumers only after review. Rollback consists of restoring the prior registry pointer; source records are never mutated.

Native documents use explicit schema version 1. Unknown fields can be retained under `extensions`. Version-0 documents are migrated in memory. Invalid or future-version files are quarantined and their definitions are not partially imported or silently discarded.

## Known limitations

- The Phase 1 parser does not yet accept piecewise syntax; its schema is reserved.
- Exact transcendental functions and general surd simplification are not implemented.
- The 2D adapter supports explicit one-variable functions through finite sampling; it does not infer discontinuities, implicit curves, roots, or extrema.
- Geometry consumes a linked two-coordinate vector only. Universal 3D conversion is explicitly unsupported.
- Curriculum entries are intentionally unverified until official sources, checksums, page references, evidence, and reviewer records are supplied.
- The pre-existing repository has lint findings outside the Phase 1 modules; Phase 1 commands isolate and enforce the new foundation while the broader cleanup remains visible.

## Extension points

New AST node evaluators can be added without changing parsing or presentation. Module adapters subscribe by stable node ID and can progressively call existing graph/geometry/3D kernels. Document migrations append version-to-version transforms. Capability and curriculum registries can move to generated JSON without changing validation contracts. Later phases should begin with 2D discontinuity/domain analysis and geometry constraint adapters, then add symbolic transforms and 3D meshing behind explicit capability statuses.
