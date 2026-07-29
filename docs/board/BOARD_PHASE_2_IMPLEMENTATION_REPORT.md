# Board Phase 2 Implementation Report

Date: 24 July 2026

## 1. Executive summary

Phase 2 turns inserted Board mathematics into actionable objects. A selected expression is validated, normalized, classified, matched to relevant actions, sent through thin adapters to existing application engines, and returned as a persistent, interactive Board result. The end-to-end algebra path—recognize, correct, insert, factor, find roots, graph, save, and reload—is operational.

The Board remains an orchestration layer. No symbolic, plotting, statistics, geometry, or 3D mathematics engine was reimplemented.

## 2. Phase 1 compatibility review

Phase 1's route, vector canvas, pointer/stylus handling, lasso selection, handwriting recognition abstraction, editable LaTeX, undo/redo, and local persistence remain intact. Phase 2 extends the document schema with result elements, relationships, and action history. Persistence migration supplies empty collections when an older Phase 1 document is loaded.

Phase 1's E2E workflow continues to pass after the Phase 2 changes.

## 3. Existing engine inventory

| Capability | Existing implementation inspected | Board use |
| --- | --- | --- |
| Problem classification | `src/lib/problem-solver/problemClassifier.ts` | Primary deterministic classification input |
| CAS/problem solving | `src/lib/problem-solver/problemSolverEngine.ts` | Evaluate, simplify, factor, expand, solve, roots, calculus, matrix summary, and statistics |
| Symbolic verification | `src/lib/problem-solver/symbolic.ts` | Mathematical equivalence verification |
| Function parsing/sampling | Existing graph parser and `src/lib/graphSampler.ts` | Validated 2D graph configuration |
| 2D rendering | Existing `FunctionGraphCanvas` | Embedded interactive graph result |
| Implicit/advanced 2D | Existing graph workspace routes | Routed result |
| Matrix operations | Existing symbolic/matrix-operation modules | Reached through existing solver/workspace capabilities |
| Statistics | Existing problem-solver statistics support and statistics workspace | Descriptive result and workspace routing |
| Geometry | Existing geometry workspace | Structured route result |
| 3D | Existing 3D workspace and graphing modules | Lazy route result; no Three.js import in Board |
| Math rendering | KaTeX and `MathKeyboardInput` | Validation, accessible preview, and correction |
| Recognition abstraction | Phase 1 `MathRecognitionProvider` | Original/corrected input retained |

No applicable pre-existing worker API was replaced. The existing graph worker remains owned by the graph engine.

## 4. Reused modules

Phase 2 reuses the problem classifier, problem solver, symbolic verification, graph sampler, function graph canvas, statistics solver path, existing `/workspace/graph`, `/workspace/geometry`, `/workspace/3d`, and `/statistics` routes, KaTeX, the shared Math Lab layout, and Phase 1 Board history/persistence primitives.

## 5. Adapter-to-engine mapping

| Board adapter | Actions | Existing target |
| --- | --- | --- |
| CAS | evaluate, simplify, factor, expand, solve, solve system/inequality, roots, differentiate, integrate, limit, matrix operation | `problemSolverEngine.solveProblem` |
| Graph 2D | explicit plot, value table | graph sampler + `FunctionGraphCanvas` |
| Graph route | implicit content | existing graph workspace |
| Statistics | dataset summary | existing problem-solver statistics path |
| Geometry | coordinate/geometry content | existing geometry workspace |
| Graph 3D | surfaces/3D content | existing 3D workspace |
| Verification | equivalence check | `symbolicVerifyIdentity` |

Adapters translate Board inputs/results, validate parameters, normalize errors, attach engine provenance, and never contain mathematical algorithms.

## 6. Expression-normalization architecture

`boardMathAnalyzer.ts` preserves raw LaTeX, validates it with KaTeX, enforces a 2,000-character limit, removes presentation-only commands, standardizes common powers/fractions/function names/multiplication, and emits an engine expression. Existing classification/parser APIs remain the semantic authority; regular expressions are limited to notation normalization and ambiguity flags.

Original handwriting, recognition output, corrected LaTeX, normalized expression, and action-time engine input remain separate values.

## 7. Mathematical classification rules

The analyzer maps existing classifier output plus structural inspection into numeric, arithmetic, algebraic expression, equation, system, inequality, function, derivative, integral, limit, matrix, vector, coordinate, geometry, data series, statistics, or unknown. It also records variables, dependent/independent variables, detected operations, polynomial degree where available, bounds, matrix dimensions, and explicit/implicit function metadata.

## 8. Suggested-action rules

Deterministic rules expose approximately three to five primary actions and place lower-priority valid actions under “More actions.” Algebra suggests factor/roots/graph rather than unrelated geometry or statistics actions; equations prioritize solve/verify/graph; datasets prioritize statistics/table actions; matrices and calculus receive their corresponding adapters. Unsupported actions are omitted or disabled with a reason. Unresolved material ambiguities disable execution.

Compact parameter controls cover the variable, verification comparison, and graph range. Engine-specific defaults are carried in action records.

## 9. CAS operations integrated

The adapter supports evaluate, simplify, factor, expand, equation/system/inequality solving, roots, differentiation, integration, limit evaluation, and matrix-operation requests using the existing solver. Exact LaTeX/plain output, approximations, assumptions, warnings, and engine-returned steps are preserved when available. The UI does not fabricate mathematical steps.

## 10. Graphing integration

Explicit 2D requests are translated into the existing graph configuration and rendered with the existing `FunctionGraphCanvas`. Graph cards expose supported zoom, reset, grid, axes, trace, and full-workspace controls. Implicit requests produce a linked result that opens the existing graph workspace.

## 11. Calculus visualization integration

Derivative, integral, and limit expressions receive calculus actions from the analyzer and execute through the existing CAS path. Plot actions reuse the same graph adapter. Advanced tangent overlays, signed-area shading, and one-sided-limit visualization remain delegated to the existing full calculus/graph workspaces rather than being reimplemented in Board.

## 12. Statistics integration

Comma-separated numerical input is classified as a dataset, parsed through the existing statistics solver path, and returned as a structured summary result. The statistics workspace route remains available for chart types and richer data review. The Board does not duplicate statistical formulas or chart rendering.

## 13. Geometry and 2D/3D routing

Coordinate, vector, implicit-equation, geometry, and surface classifications produce structured routing results to the existing graph, geometry, or 3D workspaces. These integrations are dynamically imported/routed; the Board initial chunk does not eagerly import the 3D renderer.

## 14. Result-element architecture

`BoardResultElement` stores source IDs, action, status, original and normalized input, exact/approximate/plain output, steps, assumptions, warnings, normalized error, engine provenance, parameters, graph/workspace configuration, bounds, collapse state, and timestamps.

Loading cards are created immediately and updated in place. Results can be selected, moved, collapsed, deleted, copied, rerun, opened in a workspace, or inserted as a new expression. Linked results are staggered so their headers remain reachable. All result-card movement has non-drag keyboard controls.

## 15. Relationship architecture

Documents now persist typed source/result edges such as `derived-from`, `graphs`, `verifies`, and `visualizes`. Selecting a result also selects its source. Deletion prunes edges whose source or target was removed; save/load migration preserves valid relationships.

## 16. Ambiguity handling

Structured candidates are produced for materially different readings including `1/l`, inverse-sine notation, and missing integral variables. Candidate buttons update the corrected source expression. An unresolved required ambiguity blocks engine execution and displays a user-facing instruction.

## 17. Error handling

Adapter failures are converted to stable error codes including invalid expression, unsupported operation, unavailable engine, timeout, domain error, no solution, singular matrix, parsing failure, cancellation, and unknown failure. Cards retain recoverability and suggested-action metadata. Raw stacks and raw HTML are never rendered.

## 18. Performance measures

- CAS, graph, statistics, geometry, verification, and 3D targets use dynamic imports or existing lazy routes.
- Requests receive abort signals and a 12-second timeout.
- Completed requests use normalized-expression/action/parameter cache keys.
- Loading is asynchronous and does not block drawing.
- Expression analysis is memoized for the selected object.
- The build emits Board separately (`59.60 kB`, `18.81 kB` gzip); the problem solver (`97.13 kB`) and symbolic engine (`14.63 kB`) remain separate lazy chunks.

## 19. Accessibility changes

Actions and result controls have accessible names and visible focus behavior. Status changes use the existing message/status region, graph results expose text alternatives, and result movement is keyboard-operable. Shortcuts are:

- `Ctrl/Cmd+Enter`: primary action
- `Ctrl/Cmd+G`: graph
- `Ctrl/Cmd+Shift+S`: solve
- `Ctrl/Cmd+Shift+D`: differentiate
- `Ctrl/Cmd+Shift+I`: integrate

Touch targets and responsive side-panel behavior reuse the application's mobile layout.

## 20. Files added

Phase 2 additions:

- `src/modules/board/boardMathAnalyzer.ts`
- `src/modules/board/boardMathAnalyzer.test.ts`
- `src/modules/board/boardEngineAdapters.ts`
- `src/modules/board/boardEngineAdapters.test.ts`
- `src/modules/board/BoardResultCard.tsx`
- `tests/board/boardPhase2.e2e.ts`
- `docs/board/BOARD_PHASE_2_IMPLEMENTATION_REPORT.md`

The Board module also includes Phase 1 files created in the same uncommitted worktree: canvas, page, history, geometry, recognition, persistence, types, tests, route, navigation, and Phase 1 report.

## 21. Files modified

Phase 2 extends:

- `src/modules/board/types.ts`
- `src/modules/board/boardPersistence.ts`
- `src/modules/board/boardPersistence.test.ts`
- `src/modules/board/BoardCanvas.tsx`
- `src/modules/board/BoardPage.tsx`
- `src/modules/board/BoardPage.test.tsx`

Phase 1 route/navigation integration remains in `src/App.tsx`, `src/components/layout/navItems.ts`, and `src/data/siteLinks.ts`.

## 22. Tests added

Seven focused Board unit/static suites now contain 34 tests. Coverage includes normalization, classification, variables, contextual priorities, suppression, ambiguities, adapter translation, statistics/geometry routing, verification, errors, cancellation, result persistence, relationships, history, canvas geometry, recognition, and page integration. Playwright covers Phase 1 recovery and the complete Phase 2 algebra scenario.

## 23. Formatter results

No formatter command or Prettier executable is configured in this repository. No unavailable formatter was claimed as run. ESLint's zero-warning style validation passed for all Board source and Board tests.

## 24. Linter results

Command:

`npx eslint src/modules/board tests/board --max-warnings=0`

Result: passed with exit code 0 and no warnings.

## 25. Type-check results

Command:

`npx tsc -b --pretty false`

Result: passed with exit code 0.

## 26. Automated-test results

Unit/integration command:

`npx vitest run src/modules/board --maxWorkers=1 --reporter=dot`

Result: 7 test files passed; 34 tests passed.

End-to-end command:

`npx playwright test tests/board/boardPhase1.e2e.ts tests/board/boardPhase2.e2e.ts`

Result: 2 Chromium scenarios passed in 9.0 seconds.

## 27. Production-build results

Command:

`npm run build`

Result: passed. TypeScript and Vite completed, 4,582 modules were transformed, and the production bundle was generated in 55.79 seconds. Vite retained the repository's pre-existing advisory for a minified application chunk above 900 kB; it did not fail the build.

## 28. Known limitations

- Embedded Board visualization currently covers explicit Cartesian graphs. Implicit, geometry, statistics charts, and 3D content open their existing full workspaces.
- Parametric and polar Board cards are not exposed until their existing workspace configuration APIs are unified with the adapter contract.
- Advanced calculus overlays—tangent construction, derivative comparison, signed-area shading, and one-sided-limit tables—remain full-workspace capabilities.
- Matrix UI currently exposes the operation through the existing solver path, not a full Board matrix-operation picker.
- Statistical parsed-data correction is performed by correcting the source expression; a dedicated row/column review editor is not embedded.
- Engine cancellation is immediate at the Board request layer; synchronous third-party CAS work already in progress cannot always be interrupted internally.
- Result cards expose engine-provided steps together; per-step insertion and visual diff highlighting are deferred.
- The repository-wide test suite was not represented by the focused result above; Phase 2's relevant unit, integration, E2E, lint, type-check, and build gates all pass.

These limitations are surfaced by routing or by omission of unsupported actions; the Board does not pretend unsupported embedded tools exist.

## 29. Phase 3 integration points

The provider-based recognition boundary, normalized analysis, stable action schema, adapter registry, typed result/error models, source-result graph, and action history are ready for Phase 3 tutor explanations, verified hints, multi-line work checking, richer capture providers, and collaboration. AI-generated prose can be added as a distinct adapter/output type without being mislabeled as CAS-verified mathematics.
