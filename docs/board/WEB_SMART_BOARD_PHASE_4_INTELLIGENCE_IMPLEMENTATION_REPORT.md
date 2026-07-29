# Web Smart Board Phase 4 — Unified Intelligence

Date: 24 July 2026

## 1. Executive summary

Phase 4 is implemented inside the existing `/board` module. The Board now builds selection-scoped context, identifies the active subject/concept/problem, infers intent conservatively, ranks deterministic next actions with concise rationales, plans reviewable workflows, executes approved engine steps, persists Board-scoped memory, and remains useful without an AI provider. Mathematics is fully routed through the existing Board adapters. Unsupported subject operations are disabled honestly.

## 2. Scope

The implementation covers unified context, subject delegation, goal detection, recommendations, workflow planning and control, typed tools, permissions, verification labels, ambiguity/session memory, five intelligence modes, stable-pause suggestions, natural-language workflow commands, offline/partial modes, security validation, a lazy Intelligence panel, command-palette integration, tests, and documentation. It does not add a new Board route or any new subject calculation engine.

## 3. Existing architecture reviewed

- React 18.3, TypeScript 5.7, Vite 6, React Router 7, Tailwind, Vitest, and Playwright.
- Lazy `/board` route in `src/App.tsx`; Board state is page-local React state with versioned local persistence.
- Phase 1 canvas, recognition, history, document model, and persistence.
- Phase 2 math analysis, CAS/problem-solver adapter, graph sampler/canvas, statistics, geometry, 2D/3D routing, verification, results, relationships, and action history.
- Phase 3 tutor, work verification, image import, Board Outline, export, and learning evidence adapter.
- No application backend, authenticated server routes, production AI provider, streaming tool-call service, collaboration backend, or reusable non-math subject engine layer exists in this client repository.

## 4. Isolation verification

Phase 4 extends only the existing Board implementation and its tests/report. No new route, canvas, global store, subject module, dependency, AI credential, or arbitrary Board mutation API was added. The pre-existing unrelated edit in `docs/lessons/LESSONS_REMEDIATION_IMPLEMENTATION_REPORT.md` was not modified by this phase.

## 5. Existing systems reused

| Intelligence requirement | Existing capability | Integration method | Verified status |
| --- | --- | --- | --- |
| Expression analysis | `boardMathAnalyzer` + existing problem classifier | Direct adapter | Available |
| Solving/factor/roots/calculus | Existing certified problem solver/Nerdamer CAS | Existing `executeBoardAction` adapter | Available |
| Graphing | `graphSampler` + `FunctionGraphCanvas` | Existing graph adapter | Available |
| Statistics | Existing statistics solver path | Existing Board adapter | Available |
| Geometry/2D/3D | Existing workspace routes | Capability routing | Available |
| Symbolic verification | Existing symbolic verifier | Verification adapter/gate label | Available |
| Learner evidence | Phase 3 `boardLearningIntegration` | Existing guarded evidence adapter | Available, limited |
| Subject detection | No shared classifier | Conservative local subject handler | Implemented |
| Physics unit work | Existing `/unit-converter` page | Safe workspace routing only | Available as route, not Board calculation API |
| Chemistry engine | None exposed | Structured unsupported state | Missing |
| English engine | None exposed | Structured unsupported state | Missing |
| Biology model verifier | None exposed | Structured unsupported state | Missing |

## 6. Intelligence orchestrator

`BoardIntelligenceOrchestrator` coordinates context construction, understanding, recommendations, and workflow planning. It receives cancellation signals and delegates math semantics to the existing analyzer/adapters; it does not calculate subject results.

## 7. Context model

`boardIntelligenceTypes.ts` defines subject-neutral context, goal, problem, recommendation, workflow, tool, verification, error, confidence, ambiguity, service-availability, and memory contracts. Board content is marked untrusted.

## 8. Context builder

`buildBoardIntelligenceContext` starts from the current selection or persisted active problem, traverses explicit source/result relationships, preserves top-to-bottom/left-to-right order, includes recent relevant action metadata, and emits context metrics.

## 9. Context minimization

The default payload is bounded to 24 elements and about 2,400 estimated tokens. Omitted IDs/counts are recorded. Image data URLs and pixels are never copied into structured context; only local source and reviewed-region metadata are included. Unrelated elements and tutor history are excluded.

## 10. Subject delegation

Mathematics receives full deterministic handling. Physics classification can recommend the existing Unit Converter route while retaining Physics ownership. Chemistry, English, and Biology produce structured unsupported recommendations with exact disabled reasons because verified engines are absent. Mixed selections preserve primary and supporting subjects.

## 11. Goal detection

Explicit commands, current selection, content structure, and Board context map to the Phase 4 goal vocabulary. “Solve and graph this” is classified as a user-confirmed solve goal with graph steps; unresolved selection produces missing-information metadata.

## 12. Intent-confidence rules

Explicit commands are high confidence. A single structured selection is review-recommended. Multiple/ambiguous selections require confirmation. No inferred intent automatically invokes an engine.

## 13. Active-problem model

The active problem stores subject ownership, relevant element IDs, goal, known/unknown facts, attempted steps, stage, warnings, and completion state. It is persisted inside the Board document and restored after save/refresh.

## 14. Recommendation engine

Local rules generate Math actions from actual analyzer output. Quadratics produce Factor, Find roots, Solve/Verify where applicable, and Graph. Other structures reuse their existing suggested actions. Recommendations are limited, actionable, and never fabricate results.

## 15. Recommendation ranking

Ranking is deterministic and exposes goal match, subject match, concept match, prerequisite fit, learning value, engine availability, duplicate penalty, ambiguity penalty, user-mode fit, and total. Completed, dismissed, snoozed, and hidden-category suggestions are suppressed.

## 16. Recommendation UI

The panel shows up to five primary recommendations with subject/engine, a short observable rationale, disabled reason, Use, Dismiss, Snooze, Hide similar, and per-Board disable/enable controls. It does not cover the canvas.

## 17. Workflow planning

Natural-language requests create typed plans with ordered steps, dependencies, tool IDs, Board action types, permission classes, retry/skip metadata, warnings, and status. A quadratic solve-and-graph plan contains confirmation, factor, roots, verification-gate, and 2D graph steps.

## 18. Workflow approval

Users can review the full plan, approve all non-sensitive steps, approve one step, retry failed steps, skip optional steps, cancel, and resume approved work. Sensitive steps remain pending during bulk approval.

## 19. Controlled execution

Only approved steps execute. Existing `executeAction` creates loading/results/relationships through undo-aware Board commands. Dependency failures stop downstream steps. Abort controllers cancel workflow and in-flight engine work.

## 20. Tool registry

`BoardToolRegistry` owns a fixed allowlist. It rejects duplicates, unknown IDs, subject-mismatched tools, offline-incompatible tools, out-of-context source IDs, invalid inputs, injection-like arguments, and unconfirmed sensitive calls. No content-defined or dynamically imported tool is allowed.

## 21. Capability resolver

Capabilities are derived from actual service availability. CAS, graph, statistics, geometry, and 3D actions remain tied to their existing engines. Physics can open the existing converter. Missing engines disable actions with a reason while unrelated available capabilities remain enabled.

## 22. Verification gate

`verifyBoardResult` distinguishes symbolic verification, CAS-computed-with-conditions, numerical graph sampling, partial workspace validation, pending, and failed states. Workflow verification records deterministic provenance; it does not claim that matching display text alone proves a result.

## 23. Confidence model

Recognition, subject, concept, intent, recommendation, and verification use user-facing levels: High confidence, Review recommended, Needs confirmation, and Unresolved. No false percentage precision is introduced.

## 24. Ambiguity model

Low recognition confidence becomes a focused ambiguity with source IDs, candidates, required-resolution status, and subject ownership. Required ambiguities disable calculations without blocking unrelated Board work.

## 25. Ambiguity memory

Resolved ambiguity values are stored by ambiguity/problem key in Board-scoped session memory. A resolution removes the matching pending ambiguity without applying it to unrelated future content.

## 26. Session memory

Persisted memory covers active problem/workflow IDs, resolved ambiguities, completed actions, dismissed/snoozed/hidden recommendations, hint levels, methods, graph settings, mode, explanation preference, proactive setting, and stable-pause delay. It is not treated as long-term learner mastery.

## 27. Intelligence modes

Manual, Assistive, Guided learning, Fast solve, and Exploration are selectable and persisted. Manual disables proactive analysis. All modes still require explicit action approval and deterministic verification.

## 28. Stable-pause analysis

Assistive modes wait for the configured stable delay, require a real selection, fingerprint selected structured content, cancel superseded analysis, and avoid repeat analysis. It does not trigger on pointer movement or remote AI.

## 29. Proactive error detection

The local layer detects low recognition confidence, unresolved subject/selection, missing math variable where applicable, unavailable engines, prompt-injection-like content, dependency failure, and invalid tool parameters. Blocking issues are displayed without interrupting minor work.

## 30. Completion assistance

The active workflow displays pending, approved, running, success, failed, skipped, and cancelled states. Incomplete work can be resumed, retried, checked, or cancelled; Guided mode never auto-finishes it.

## 31. Explanation adaptation

Session preferences define one-line, brief, standard, detailed, visual-first, formula-first, exam-style, conceptual, and step-by-step modes. Phase 4 stores and exposes the preference for the existing tutor; it does not alter deterministic calculations.

## 32. Learner adaptation

Phase 4 reuses Phase 3’s guarded learning-evidence path and existing hint/tutor context. No separate learner profile or sensitive inference was created. Persistent mastery changes remain outside automated workflow execution.

## 33. Cross-element reasoning

The context builder follows explicit `derived-from`, `graphs`, `verifies`, `explains`, sequence, image-detection, and other Board relationships. Source/result ownership is retained through workflow-created results.

## 34. Mixed-subject reasoning

The verified mixed-subject test assigns Physics as primary and English as supporting for an English kinematics statement plus Physics quantities. The Unit Converter recommendation remains Physics-owned; original element subjects/content are unchanged.

## 35. Multi-modal context

Structured math/text/result content is preferred. Imported images contribute only local metadata and reviewed regions; raw pixels are excluded. Recognized, confirmed, unrecognized, inferred, and verification states remain distinguishable.

## 36. Intelligence panel

`BoardIntelligencePanel` is lazy-loaded. It displays mode, AI/engine availability, subject, confidence, concept, goal, compact known/unknown facts, warnings, recommendations, natural-language planning, and workflow controls. The existing Tutor panel remains separate.

## 37. Command palette

Ctrl/Cmd+K now includes context-ranked “Understand selection” and “Open Intelligence panel” commands while retaining all prior Board commands and disabled reasons.

## 38. Natural-language commands

Conservative local parsing supports solve, graph/plot, verify/check work, simplify, explain, hint, unit conversion, balance, grammar, label review, practice, continue, and generic understand requests. Pronouns resolve only to the current selected context.

## 39. Practice intelligence

The types, tool capability, and recommendation category are prepared, but no practice item is inserted because the repository exposes no validated Board question-bank adapter with private expected-answer storage. Unverified generation is intentionally disabled.

## 40. Revision recommendations

Existing lesson and learning evidence can be linked in a future adapter. Phase 4 does not infer repeated misconceptions from low-confidence or single events and does not create unverified revision links.

## 41. Offline intelligence

With AI unavailable, the Board reports deterministic mode and continues CAS/graph/local-rule work. Partial-engine tests keep graph enabled while disabling CAS actions. Basic Board fallback remains the Phase 1 typed/edit/save/export experience.

## 42. Local rules

Mathematics rules are executable. Physics route guidance is executable where the converter exists. Chemistry/English/Biology rules produce disabled recommendations until verified engines exist; this is intentional compliance with the non-fabrication boundary.

## 43. Privacy

Context is selection-scoped and size-bounded. No full-Board/image upload, microphone/camera activation, hidden learner history, raw analytics content, or client credential was added. AI status is visible.

## 44. Prompt-injection protection

Board text is untrusted. Detection covers instruction override, secret exfiltration, deletion, full upload/share, and hidden-tool activation language. Registry allowlisting, context boundaries, schema checks, permission gates, and validated output prevent content from changing authority.

## 45. Permission model

Tools are classified as read-only, reversible-write, or sensitive. Read-only inspection requires no mutation. Engine results use existing undo-aware Board writes. Sensitive operations require explicit confirmation and are never bulk-approved.

## 46. Security validation

The implementation enforces a 2,000-character expression limit, bounded numeric inputs, required keys, fixed tools, selection scope, cancellation, safe React text rendering, existing safe KaTeX handling, no `eval`, no `new Function`, no user-controlled imports, and normalized user-facing errors.

## 47. Accessibility

The panel uses semantic sections, labels, native controls, ordered workflow lists, status text, live analysis announcements, keyboard-operable actions, visible focus inherited from the design system, and compact non-color status labels. Ctrl/Cmd+K, reduced-motion mode, and 375 px layout are automated.

## 48. Browser compatibility

Automated Playwright verification passed on Chromium desktop and a 375×812 responsive viewport with reduced motion. Pointer/touch/camera features are capability-detected. Firefox, WebKit/Safari, iPadOS hardware, and stylus hardware were not installed in this environment and therefore are not claimed as executed tests.

## 49. Performance

The panel is emitted as a separate lazy chunk (`9.96 kB`, `2.76 kB` gzip). No AI SDK is loaded. Analysis is selection-scoped, bounded, fingerprinted, cancellable, and delayed. Existing CAS/graph/3D lazy boundaries and engine caches remain intact. Final Board chunk: `117.12 kB`, `35.91 kB` gzip.

## 50. Files added

- `src/modules/board/boardIntelligenceTypes.ts`
- `src/modules/board/boardIntelligence.ts`
- `src/modules/board/BoardIntelligencePanel.tsx`
- `src/modules/board/boardIntelligence.context.test.ts`
- `src/modules/board/boardIntelligence.workflow.test.ts`
- `src/modules/board/boardIntelligence.security.test.ts`
- `tests/board/boardPhase4.e2e.ts`
- `docs/board/WEB_SMART_BOARD_PHASE_4_INTELLIGENCE_IMPLEMENTATION_REPORT.md`

## 51. Files modified

- `src/modules/board/types.ts`
- `src/modules/board/boardPersistence.ts`
- `src/modules/board/BoardPage.tsx`
- `src/modules/board/boardEngineAdapters.ts`
- `src/modules/board/boardEngineAdapters.test.ts`

## 52. Unit tests

Phase 4 adds context scoping/traversal/order/limits/image exclusion, understanding, mixed subjects, recommendations, partial availability, ambiguity memory, workflow transitions, verification labels, registry, validation, permissions, and security unit coverage.

## 53. Integration tests

Integration coverage verifies goal → context → recommendations → plan, actual CAS factoring/roots, zero-form equation graphing, source/result relationships, persistence migration, unavailable engines, cancellation, and existing Phase 1–3 flows.

## 54. End-to-end tests

`boardPhase4.e2e.ts` verifies the full quadratic workflow, recommendation rationale/engine labels, workflow review/approval/execution, graph creation, save/refresh restoration, injection isolation, command-palette keyboard access, reduced motion, and mobile-width overflow. All six Board Phase 1–4 scenarios pass.

## 55. Security tests

Tests cover injection detection/isolation, hidden-tool rejection, duplicate registration, context-boundary enforcement, sensitive confirmation, expression/numeric limits, cancellation, and absence of image payloads/full-Board access.

## 56. Existing Smart Board regression results

Command: `npx playwright test tests/board --reporter=line`  
Result: 6 passed in 17.7 seconds, covering draw/recognize/correct/save, CAS/graph/relationships, tutor/work verification/export, and Phase 4.

## 57. Existing module regression results

Command: `npm test`  
Result: 216 test files passed; 1,343 tests passed in 110.30 seconds. No unrelated module regression was detected.

## 58. Formatter result

No Prettier dependency or formatter script exists. The configured safe formatter-equivalent checks were run: `npx eslint src/modules/board tests/board --fix` and `git diff --check`. Both completed successfully with no whitespace errors.

## 59. Linter result

Command: `npm run lint`  
Result: passed with zero errors and zero warnings.

## 60. Type-check result

Command: `npm run typecheck`  
Result: passed (`tsc -b`).

## 61. Unit-test result

Command: `npm test`  
Result: 216 files passed, 1,343 tests passed.

## 62. End-to-end-test result

Commands: `npx playwright test tests/board/boardPhase4.e2e.ts --reporter=line` and `npx playwright test tests/board --reporter=line`  
Results: Phase 4 scenarios passed; full Board suite 6/6 passed.

## 63. Production-build result

Command: `npm run build`  
Result: passed; Vite transformed 4,593 modules and built in 44.15 seconds. The existing global warning for a pre-existing chunk over 900 kB remains; the Phase 4 panel is separately lazy-loaded.

## 64. Known limitations

- No production AI/provider/server exists; visible deterministic mode is intentional.
- Physics has route-level unit conversion but no reusable Board calculation API.
- Chemistry balancing, English grammar, and Biology model verification remain unavailable.
- Workflow verification currently records existing engine/symbolic provenance; richer root-by-root substitution chains need an engine result contract extension.
- Persistent learner mastery, analytics, collaboration, and authenticated sharing are not available.
- Firefox/WebKit/iPad/stylus hardware execution remains unverified in this environment.

## 65. Deferred capabilities

Production server-side AI/recognition, streaming responses, subject engine adapters, validated question-bank practice insertion, curriculum revision links, authenticated learner updates, collaboration, shared Boards, hardware/browser lab coverage, cropped-diagram vision, and richer workflow parameter editing are deferred.

## 66. Recommended Phase 5 enhancements

Add a credential-safe server orchestration API; expose verified Physics/Chemistry/English/Biology adapters behind the existing handler/tool contracts; extend deterministic verification to consume prior workflow outputs; connect validated question-bank/curriculum adapters; add privacy-safe analytics and repeated-evidence mastery updates; run Firefox/WebKit/iPad/stylus device matrices; and move media-heavy persistence to IndexedDB or an authenticated project service.
