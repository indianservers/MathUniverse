# Board — Intelligent AI Canvas

## Phase 1 implementation status

Phase 1 is implemented at `/board`. It adds the handwriting input, structured vector document, recognition review, correction, insertion, history, and local persistence layers. It deliberately does not add solving, graph generation, geometry construction, tutoring, or collaboration.

## 1. Repository audit

- Framework: React 18, TypeScript, Vite, Tailwind CSS, and React Router.
- Routing: lazy route modules are registered in `src/App.tsx` and rendered inside the shared `AppLayout`.
- State: local React state is used for page-local interactions; Zustand with persistence is used by larger existing modules such as Workspace, Graph Theory, Set Theory, Combinatorics, and Algebraic Structures.
- Design system: the Board reuses `MathLabLayout`, `SectionCard`, the existing action/tool button classes, responsive page shells, theme tokens, typography, focus behavior, and Lucide icon package.
- Math input/rendering: the Board reuses `MathKeyboardInput` for correction and KaTeX for validated notation preview.
- Existing math engines: the repository already contains Nerdamer/CAS utilities, function graph sampling, 2D geometry, Three.js/React Three Fiber 3D, matrix, probability, statistics, spreadsheet, and authoring systems. Phase 1 does not duplicate or invoke those execution engines.
- Canvas implementations: existing canvas/SVG work was reviewed in Math Workspace, Graph Theory, AI Applications, and other visualizations. No new major canvas dependency was required.
- Persistence: existing projects use versioned local browser storage, Zustand persistence, and the generic offline project library. The Board follows the same browser-only/versioned approach with Board-specific keys so it cannot corrupt unrelated workspace snapshots.
- AI/provider layer: no production handwriting-recognition provider or server API is currently configured. Phase 1 therefore exposes a provider-neutral interface and an explicitly labelled deterministic development adapter.
- Backend/authentication: no application backend, API route layer, or authentication/session system is present in this Vite client repository. No secret key or provider credential is shipped to the browser.
- Project saving: Workspace persistence and offline project-library conventions informed Board serialization, migration, autosave, recovery, named saves, loading, renaming, and deletion.

## 2. Reused existing modules

- `src/components/math-lab/MathLabShared.tsx` — shared page shell.
- `src/components/math-keyboard/MathKeyboardInput.tsx` — editable mathematical correction input.
- `src/components/ui/SectionCard.tsx` — shared compact information surface.
- `katex` — safe recognition preview with malformed-input handling.
- `lucide-react` — toolbar and navigation icons.
- Existing `localStorage` and versioned migration conventions from `src/workspace/workspacePersistence.ts`, `src/workspace/offlineProjectLibrary.ts`, and `src/hooks/useLocalStorage.ts`.
- Existing App routing, navigation, sitemap/search metadata, theme, responsive, and accessibility conventions.

## 3. Files added

- `src/modules/board/types.ts`
- `src/modules/board/boardGeometry.ts`
- `src/modules/board/boardHistory.ts`
- `src/modules/board/boardPersistence.ts`
- `src/modules/board/mathRecognition.ts`
- `src/modules/board/BoardCanvas.tsx`
- `src/modules/board/BoardPage.tsx`
- `src/modules/board/boardGeometry.test.ts`
- `src/modules/board/boardHistory.test.ts`
- `src/modules/board/boardPersistence.test.ts`
- `src/modules/board/mathRecognition.test.ts`
- `src/modules/board/BoardPage.test.tsx`
- `tests/board/boardPhase1.e2e.ts`
- `docs/board/BOARD_PHASE_1_IMPLEMENTATION_REPORT.md`

## 4. Files modified

- `src/App.tsx` — lazy `/board` route.
- `src/components/layout/navItems.ts` — primary and searchable Board navigation.
- `src/data/siteLinks.ts` — sitemap/search metadata.

## 5. Board architecture

The page separates:

1. `BoardPage` — document state, commands, recognition workflow, persistence, toolbar, settings, and responsive panel.
2. `BoardCanvas` — high-DPI imperative rendering and pointer gestures.
3. Geometry utilities — coordinate transforms, bounds, smoothing, simplification, collision tests, movement, snapping, and lasso math.
4. Recognition service — provider-neutral request/result contract and recognition image preparation.
5. Persistence service — versioned serialization, migration, library CRUD, and draft recovery.

Pointer movement is held in refs and rendered through `requestAnimationFrame`; React state is updated when a stroke or gesture is committed rather than for every point.

## 6. Stroke data model

Board documents preserve vector elements rather than a raster-only image. Stroke points include board-space coordinates, pressure, and timestamp. Strokes retain tool, color, opacity, width, bounds, creation time, and optional recognition group. Math expression elements retain LaTeX, normalized expression, recognition confidence, bounds, and the source stroke IDs required by later phases.

The canvas keeps screen and board coordinates separate. Viewport translation and zoom are applied only during conversion/rendering. Recognition generates a temporary padded, high-contrast crop while preserving the original structured strokes.

## 7. Recognition provider architecture

`MathRecognitionProvider` accepts selected structured strokes, crop dimensions, optional rendered PNG data, and an abort signal. Results support LaTeX, normalized/plain forms, confidence, alternatives, mathematical structure type, and warnings.

The current `DevelopmentMathRecognitionProvider` is deterministic and visibly labelled as non-production. It never presents its result as a live AI service. A future server provider can implement the same interface without changing the Board document or UI.

Recognition is explicit, cancellable, deduplicated by aborting the previous request, and operates on selected strokes or all handwriting. The original handwriting is never automatically removed.

## 8. Persistence strategy

- Schema version: `1`.
- Saved-library key: `math-universe-board-library`.
- Autosave key: `math-universe-board-draft`.
- Autosave delay: 500 ms after document changes.
- Saves are capped at 32 Board documents.
- Load, rename, delete, new Board, and refresh recovery are supported.
- Migration normalizes missing viewport, background, and snap settings for future schema evolution.

## 9. Keyboard shortcuts

- `P` — pen
- `E` — eraser
- `V` — rectangle selection
- `H` — pan
- `Delete` / `Backspace` — delete selected elements
- `Ctrl/Cmd + Z` — undo
- `Ctrl/Cmd + Shift + Z` — redo
- `Ctrl/Cmd + S` — save
- `Ctrl/Cmd + Enter` — recognize selected strokes, or all handwriting when nothing is selected

Typing shortcuts do not fire while an input, textarea, or editable surface has focus.

## 10. Tests added

Focused Vitest coverage verifies coordinate conversion, bounds, collision/erasing, smoothing, add/delete/move/clear undo behavior, recognition cropping, success, alternatives, cancellation, invalid selection, versioned save/load/rename/delete, autosave recovery, route rendering, and malformed LaTeX handling.

The Playwright end-to-end flow opens `/board`, draws, selects, recognizes, corrects LaTeX, inserts the expression, saves, reloads, and verifies recovery.

Live verification on port 5537 completed the same critical flow with no browser console errors. A 375 px viewport had no page-level horizontal overflow.

## 11. Known limitations

- Recognition uses the explicit development adapter until a server-side provider is configured.
- Export is present as a disabled Phase 2 placeholder.
- Recognition grouping supports lasso/rectangle selection and manual merge/split metadata; automatic semantic grouping is intentionally conservative.
- Inserted expressions are movable Board elements and render as validated KaTeX in the recognition panel; high-fidelity KaTeX compositing directly inside the bitmap canvas is reserved for Phase 2.
- Documents use local browser storage. Large multi-page or media-heavy Boards should move to IndexedDB or a backend in a later phase.
- Shape/text element variants are reserved by the document model but are not authoring tools in Phase 1.

## 12. Phase 2 integration points

- Replace the development adapter with a credential-safe server recognition provider.
- Publish confirmed `MathExpressionElement` objects to the existing universal workspace object graph.
- Route confirmed expressions into existing CAS, graphing, geometry, 3D, spreadsheet, probability, and statistics engines only after explicit user intent.
- Add PNG/PDF/SVG/project export and richer math-element rendering.
- Add semantic stroke-group suggestions, equation-line segmentation, and production recognition telemetry.
- Move large Board storage to IndexedDB or an authenticated project service if one is introduced.

