# Board Phase 3 Implementation Report

Date: 24 July 2026

## 1. Executive summary

Phase 3 adds the supported intelligent-learning layer to Board: structured tutor context, progressive hints, verified next-step/full-solution routing, multi-line solution sequences, deterministic step verification, first-error highlighting, evidence-limited misconception hints, local camera/image intake, multi-region review, pause-based recognition controls, speech playback, command palette, accessible outline, export, and existing mastery-store integration.

The repository has no production AI or vision backend, authentication, account sharing, or real-time collaboration system. The implementation therefore provides an explicitly labelled offline deterministic tutor and typed extension boundaries. It does not place credentials in the browser or pretend unavailable infrastructure exists.

## 2. Phase 1 and Phase 2 compatibility review

The Phase 1 canvas, recognition correction, undo/redo, autosave, and Board library continue to operate. Phase 2 classification, contextual actions, CAS, graphing, result cards, relationships, and action history remain available when tutor or vision services are unavailable. Older documents migrate with defaults for sequences, tutor messages, and automatic-recognition settings.

The Phase 1 and Phase 2 Playwright scenarios still pass.

## 3. Existing systems reused

- Phase 2 analyzer, CAS/graph/statistics/geometry adapters, symbolic verifier, and result cache.
- Existing `problemSolverEngine` for equation solution-set comparison and tutor calculations.
- Existing `symbolicVerifyIdentity` for alternative-expression equivalence.
- Existing `MathRecognitionProvider` for explicit and pause-triggered handwriting recognition.
- Existing `html2canvas` and `jsPDF` packages for Board PNG/PDF export.
- Existing browser speech-synthesis pattern from visual proofs.
- Existing NCERT mastery store and update functions.
- Existing lazy graph, geometry, statistics, calculus, lesson, and 3D routes.
- Existing Board persistence, relationship cleanup, and history commands.

No duplicate math engine, learner profile, storage backend, or sharing service was created.

## 4. AI tutor architecture

`boardTutor.ts` is a provider-ready orchestration boundary. The current runtime is an offline deterministic tutor because repository audit found only a preview tutor and no credential-safe server AI route. `BoardTutorPanel` is lazy-loaded, collapsible, cancellable, and clearly labels this state.

Tutor modes include Hint, Next step, Check my work, Find my mistake, Concept, Visual, Alternative method, Full solution, Concise, Exam-style, and open question. Exact calculations route to the existing engines; unverified conceptual prose is labelled as guidance.

## 5. Tutor context model

`buildBoardTutorContext` sends selected structured expressions/results, relevant graph configuration, the last 20 action records, and prior hint count. It caps expressions/results and truncates individual mathematical strings. Unselected Board content and raw image pixels are not included.

## 6. Tool-calling architecture

A strict typed allowlist covers inspection, analysis, simplify/factor/expand, solve, calculus, verification, plotting, and statistics. Inputs are limited by key count and expression size. Unknown or destructive tools raise `INVALID_TOOL_CALL`. The offline tutor never receives arbitrary Board mutation access; insertion and highlighting occur only through explicit UI callbacks.

## 7. Deterministic verification strategy

Equation-to-equation steps are checked by comparing solution sets returned by the existing equation solver. Expression transformations use the existing symbolic equivalence verifier. Recognition confidence is checked before mathematics, and low-confidence lines remain ambiguous instead of being marked wrong.

Tutor full solutions and supported next steps call the Phase 2 deterministic adapter and retain engine provenance.

## 8. Hint ladder

Seven levels progress from a concept reminder through direction, rule, setup, next transformation, intermediate work, and an explicit full-solution handoff. Hint count is derived from persisted tutor messages. The first hint never reveals the final answer.

## 9. Next-step mode

Next-step mode returns one transformation or one engine-provided step and stops. Equation requests use the existing solver; other classifications use a deterministic classification rule. The response records whether it was engine-verified and which selected element it references.

## 10. Multi-line recognition architecture

Selected recognized expressions are sorted by spatial reading order and converted into `BoardSolutionSequence` plus ordered `BoardSolutionStepElement` records. The model preserves source strokes, confidence, orientation, problem/final references, and relationships. Sequence steps are positioned as a separate readable stack so source handwriting remains intact.

Manual stroke merge/split remains available from Phase 1. Imported image regions have editable order and selected-state review.

## 11. Work-verification architecture

“Check my work” accepts two or more selected expressions, creates a persisted sequence, checks each transition from the previous valid line, writes verification status/explanation onto each solution-step element, and presents a concise verification panel.

## 12. First incorrect-step detection

Verification stops its diagnosis at the earliest unjustified transformation. That step is selected and highlighted. Later dependent steps are not independently labelled with additional misconceptions. The user can inspect the failing line from the verification panel or Board Outline.

## 13. Misconception rules

Evidence rules cover sign distribution, product-rule patterns, inequality direction, and integral constant/bound checks. A detected item explicitly states that it is evidence from one step, not a persistent learner diagnosis. Low-confidence recognition never creates persistent evidence.

## 14. Alternative-method support

Deterministic applicability guidance covers algebraic/graphical equation methods, factorization/completing-square/graph comparisons, and integration method choices. Alternative user transformations are accepted when the deterministic equivalence or solution-set check succeeds.

## 15. Camera and image-import architecture

`BoardImageImportDialog` supports upload, drag/drop, screenshot files, and user-initiated camera capture. Camera permission is explained before request, never starts automatically, and all media tracks are stopped on capture, close, or unmount. PNG/JPEG/WebP files are limited to 8 MB, resized locally to 1,600 pixels maximum, re-encoded without original metadata, and inserted only after confirmation.

## 16. Multi-region recognition

Local image analysis detects separated horizontal ink bands and creates ordered `BoardRecognitionRegion` objects. Users can include/exclude regions, add a region, enter corrected LaTeX per region, and insert selected regions as editable expressions linked by `detected-from-image`.

There is no production OCR/vision provider, so automatic region content recognition is not claimed. Detection is boundary/read-order assistance, while mathematical content remains user-reviewed.

## 17. Automatic-recognition controls

Settings provide Manual only (default), Suggest after pause, and Recognize completed group. Pause duration is configurable. Stroke fingerprints prevent duplicate requests; new writing cancels obsolete recognition. Suggestions are non-blocking and conversion still requires the normal review/insert step.

## 18. Voice capabilities implemented or deferred

Optional spoken tutor responses reuse browser `speechSynthesis` with Read, Pause, and Stop controls plus a visible transcript. Common powers, derivatives, integrals, and pi receive simple verbalization. Voice command input was deferred because no speech-to-text provider or command-recognition infrastructure exists.

## 19. Visual explanation integrations

Visual tutor requests route selected expressions to the existing interactive graph adapter/workspace. Phase 2 graph cards remain linked to sources. Existing calculus/geometry/statistics workspaces remain the destination for richer tangent, area, construction, and distribution visuals; no static substitute renderer was created.

## 20. Learner-model integration

Verified Board work maps supported classifications into the existing NCERT mastery store using its exported read/update/write functions. Evidence is recorded only when recognition confidence is at least 0.70 and the verification is not ambiguous. No separate learner record is maintained.

## 21. Curriculum integration

Board classifications map to existing curriculum-style concept IDs for linear/simultaneous equations, inequalities, expressions, derivatives, integration, limits, matrices, descriptive statistics, and coordinate geometry. Direct lesson recommendation remains deferred until the catalog exposes a stable concept-ID lookup API.

## 22. Export and sharing

Exports include PNG, PDF, print, structured Board JSON, LaTeX, and tutor transcript. JSON can exclude tutor conversation through the export utility contract. Export libraries are dynamically imported.

Account-based sharing is clearly marked unavailable because the repository has no authentication/permission backend. No insecure pseudo-sharing backend was added.

## 23. Privacy and security controls

- Camera and files require explicit user action.
- Images are validated, resized, and re-encoded locally.
- No image or handwriting upload occurs.
- Structured tutor context is selected and bounded.
- Tutor/tool strings are length limited and rendered as text.
- AI/vision credentials are absent from the client.
- Requests and media preparation support cancellation.
- Imported text is treated as untrusted content.
- No `eval`, `new Function`, raw HTML tutor rendering, or unrestricted tool execution is used.

## 24. Prompt-injection protections

Known instruction-injection forms—ignore prior instructions, reveal prompts/secrets, execute code, delete/clear Board, send content elsewhere, and change system behavior—are detected in tutor input. The response treats them as untrusted content and performs no tool action. The tool allowlist independently rejects destructive or unknown calls.

## 25. Accessibility changes

- Keyboard-operable Board command palette.
- Structured Board Outline in visual reading order.
- Accessible tutor transcript and status announcements.
- Visible selected/invalid step states.
- Text alternatives for imported images and graphs.
- Full text fallback for camera, handwriting, and speech.
- Native inputs/buttons, non-drag selection alternatives, and existing result movement controls.
- `Ctrl/Cmd+K` is captured only inside Board to avoid opening the application-wide palette simultaneously.

## 26. Offline and degraded mode

The tutor explicitly displays “Offline verified mode.” When provider-like tutor work fails, it displays “AI Tutor unavailable” while drawing, typed math, recognition correction, CAS, graphing, statistics, geometry routing, saving, and export remain available.

## 27. Performance improvements

- Tutor and camera dialog are lazy components.
- CAS, verification, graph, PDF, canvas export, and 3D remain dynamic imports/routes.
- Image dimensions and stored payload size are bounded.
- Recognition uses stable fingerprints and pause debouncing.
- Obsolete tutor/recognition/image work is cancellable.
- Camera streams and speech resources are cleaned up.
- Production output keeps `BoardTutorPanel` in a separate 14.55 kB chunk (5.33 kB gzip).

## 28. Files added

- `src/modules/board/boardTutor.ts`
- `src/modules/board/BoardTutorPanel.tsx`
- `src/modules/board/boardWorkVerification.ts`
- `src/modules/board/boardImageImport.ts`
- `src/modules/board/BoardImageImportDialog.tsx`
- `src/modules/board/BoardCommandPalette.tsx`
- `src/modules/board/BoardOutline.tsx`
- `src/modules/board/boardExport.ts`
- `src/modules/board/boardLearningIntegration.ts`
- Five corresponding Phase 3 unit-test files
- `tests/board/boardPhase3.e2e.ts`
- `docs/board/BOARD_PHASE_3_IMPLEMENTATION_REPORT.md`

## 29. Files modified

- `src/modules/board/types.ts`
- `src/modules/board/boardPersistence.ts`
- `src/modules/board/BoardCanvas.tsx`
- `src/modules/board/BoardPage.tsx`

The existing Phase 1/2 Board files remain in the same uncommitted worktree. The unrelated pre-existing edit to `docs/lessons/LESSONS_REMEDIATION_IMPLEMENTATION_REPORT.md` was preserved.

## 30. Unit tests added

Phase 3 tests cover tutor context minimization, sanitization, prompt injection, tool validation, hint progression, degraded guidance, reading order, sequence relationships, alternative equivalence, first-invalid-step detection, recognition ambiguity, image type/size rules, multi-region detection, fingerprinting, export options, and learner-evidence confidence rules.

## 31. Integration tests added

The focused Vitest suite exercises the existing classifier, solver, symbolic verifier, persistence schema, mastery-store functions, and Phase 3 orchestration together. Static page integration continues to cover route/module composition.

## 32. End-to-end tests added

The Phase 3 Playwright scenario seeds `3x+7=22`, `3x=15`, `x=6`, selects the full sequence, runs Check my work, confirms the third line is the first invalid step, opens the degraded tutor, verifies the Board command palette, and confirms export plus honest sharing status.

## 33. Formatter result

No formatter script or Prettier executable is configured. No formatter result was fabricated. ESLint zero-warning validation covers all Board source and Board tests.

## 34. Linter result

Command: `npx eslint src/modules/board tests/board --max-warnings=0`

Result: passed with exit code 0 and no warnings.

## 35. Type-check result

Command: `npx tsc -b --pretty false`

Result: passed with exit code 0. The final production build also reran TypeScript successfully.

## 36. Test result

Unit/integration command:

`npx vitest run src/modules/board --maxWorkers=1 --reporter=dot`

Result: 12 files passed; 51 tests passed.

E2E command:

`npx playwright test tests/board/boardPhase1.e2e.ts tests/board/boardPhase2.e2e.ts tests/board/boardPhase3.e2e.ts`

Result: 3 Chromium scenarios passed in 8.5 seconds.

## 37. Production-build result

Command: `npm run build`

Result: passed. Vite transformed 4,591 modules and completed the final build in 45.61 seconds. `BoardPage` is 87.67 kB (27.08 kB gzip); the lazy tutor is 14.55 kB (5.33 kB gzip). The repository's existing advisory for an application chunk over 900 kB remains non-fatal.

## 38. Known limitations

- The tutor is deterministic/offline until a credential-safe server AI provider exists.
- Image region content requires user-entered/corrected LaTeX; no production vision OCR exists.
- Horizontal ink-band detection is conservative and is not semantic diagram reconstruction.
- Crop handles, arbitrary region resize/drag, brightness/contrast controls, region split/merge gestures, and clipboard-image reading are not exposed.
- Tutor hints cover major equation/algebra/calculus classes, not every curriculum concept.
- Equation work verification compares existing solver solution sets; transformations with changing declared domains need manual condition review.
- Spoken narration uses browser speech synthesis and does not provide sentence-level highlighting or speech input.
- Full graph/calculus/geometry/statistics visual explanations open existing workspaces rather than embedding every specialized control.
- Local image data is compressed into the Board document because no IndexedDB asset service exists; media-heavy Boards remain storage-limited.
- Exported PNG/PDF is a screen-faithful Board capture, not a paginated semantic worksheet editor.

## 39. Deferred infrastructure

- Production AI and vision server routes, provider credentials, rate limits, and retention controls.
- Account-based read/edit sharing, permission expiry, named-user/class sharing.
- Real-time cursors, presence, and conflict-safe collaboration.
- Speech-to-text and reliable mathematical voice-command parsing.
- Remote media asset storage.
- Persistent analytics events; repository audit found no stable privacy-aware analytics service for Board.
- Automatic geometry reconstruction from photographs.

## 40. Recommended future enhancements

1. Add a server-side tutor/vision provider implementing the existing typed context and tool contracts.
2. Introduce IndexedDB or authenticated asset storage before enabling multi-page camera workflows.
3. Expose stable curriculum concept-to-lesson lookup for prerequisite recommendations.
4. Add interactive crop/region handles and a production math OCR adapter.
5. Extend deterministic misconception fixtures and domain-condition verification.
6. Add semantic, paginated Board export and opt-in account sharing when backend infrastructure exists.
