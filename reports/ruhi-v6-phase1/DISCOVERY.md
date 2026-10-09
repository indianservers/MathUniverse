# Ruhi v6 Phase 1 discovery

Starting revision: 249a5cc139ed1a9b4aa99bf6dadd3310b224c8ca. The working tree was clean. No AGENTS.md was found in the repository. `final-report(6).md` was not supplied as a local path; the accessible equivalent is `reports/ruhi-v5.3/final-report.md`, with its referenced JSON/log evidence and exact `focused-conversations.json` transcripts.

Existing mathematical IR: `src/math-foundation/types.ts` defines MathAstNode, MathValue, MathDomain, assumptions, units and mathematical results; parser/evaluator/values implement it. `src/math-foundation/dependencyGraph.ts` manages formula dependencies/history. `src/math-robo/intelligence/commandIR.ts` describes interpretation and command constraints. These are extended rather than replaced.

Kernel: `src/math-robo/kernel/{kernel,exact,safeExpression,domains,advancedCas,symbolic,geometry2d,geometry3d,numerical}.ts`. Typed workers in `client.ts`, `kernel.worker.ts`, `specialistClient.ts`, and `specialist.worker.ts` run bounded local computations. `kernel/types.ts` currently combines verification with failure using five legacy statuses. Worker failure/abort/timeout collapse to unsupported. Exact arithmetic has no meaningfully separate result certificate at the boundary.

Orchestration: `intelligence/{engineRegistryCore,engineRegistry,engineRouter,semanticEngine,conversationEngine,executionPlanner,commandValidator,resultVerifier}.ts`. Scene mutation uses prepare/validate before native commits and affected-object rollback. Verification has independent geometric checks but also marks generic finite/count-only checks verified. EngineRouter cancellation can leave an older result updating specialist memory; direct concurrent SemanticEngine calls are not serialized.

Native integration: `src/offline-intelligence/{workspaceBridge,geometryAdapter,graph3dAdapter}.ts`, `src/pages/{MathWorkspace,MathLab3DGraphing}.tsx` and geometry renderers. v5.3 preserved IDs/styles in native metadata and added the 2D Restore saved control. Distinct native histories remain; edits/imports require registry synchronization and dependency validation.

Dependencies: `workspaceDependencies.ts` recomputes through the 2D construction engine and a 3D DFS. 3D detects cycles; 2D can recursively expand cyclic vertex references before evaluation. Undefined dependent objects are hidden without structured state explanations. Requested triangle side edits lack an explicit constraint policy; missing endpoints/angles already have partial pending slots.

Phase 1 boundaries: offline only; no fitting, promotion, production cleanup, deployment, commit or push. Student/trainer flags and published weights stay intact. Historical scores are not inferred current correctness. New baseline logs are kept separately before edits; final results will retain unchanged frozen100/NLP300 expectations and their exposure limitations.
