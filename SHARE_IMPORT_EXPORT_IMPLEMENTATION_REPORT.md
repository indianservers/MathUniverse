# Share, Import and Export Implementation Report

Date: 2026-08-20  
Application: Math Universe 1.0.1

## Delivered architecture

A shared portability system now serves 2D Geometry, 3D Geometry, CAS, 2D Graph and 3D Graph. Four routes hosted by `MathWorkspace` use a state-snapshot adapter; Graph Studio 3D supplies a dedicated adapter. The reusable `ShareExportControl` owns the compact panel, image preview, file picker/drop zone, import preview, cross-route handoff and lesson-authoring flow. Serialization, file validation/hashing and image rendering remain separate services.

Every target workspace exposes the same small Share button with the “Share or export” tooltip, accessible label and focus treatment. On narrow screens it collapses to an icon. Graph Studio places it in its toolbar; the other workspaces keep it in the workspace chrome without shrinking the mathematical viewport.

## Files created

- `src/workspace/portableWorkspace.ts` and tests: schema, hashing, parsing, validation, filenames, download, lesson modes and adapter contract.
- `src/workspace/workspaceImageExport.ts` and tests: capture, scaling, backgrounds, encoding, preview lifetime, clipboard and native sharing.
- `src/components/workspace/ShareExportControl.tsx` and test: consistent UI and all import/export workflows.
- `scripts/generate-portable-samples.mjs` and `public/sample-lessons/*`: five working, integrity-signed lessons.
- `WORKSPACE_FILE_FORMAT_SPECIFICATION.md`: normative format documentation.
- `SHARE_IMPORT_EXPORT_IMPLEMENTATION_REPORT.md`: this report.

## Files modified

- `src/pages/MathWorkspace.tsx`: adapters and Share control for 2D Geometry, 3D Geometry, CAS and 2D Graph. Graph slider parameters now round-trip with the graph.
- `src/pages/MathLab3DGraphing.tsx`: complete Graph Studio 3D adapter.
- `src/graph-studio/GraphStudio3DWorkspace.tsx`: toolbar extension point.
- `src/index.css`: compact responsive dialog, preview, focus, motion and inline-toolbar styling.
- `public/manifest.webmanifest`: PWA handlers for `.mathworkspace` and `.mathlesson`.

Unrelated pre-existing working-tree changes were preserved.

## Portable file and workspace coverage

The selected format is self-contained UTF-8 JSON with official custom extensions and MIME types. It includes mandatory magic/header metadata, stable workspace type, engine versions, descriptive document data, preview counts/thumbnail, scene, optional lesson, extensible metadata and SHA-256 integrity.

- 2D Geometry restores points, lines, circles, polygons, arcs, loci, constraints/dependencies, styles, hidden/locked state, graph settings, images and construction protocol represented by the existing snapshot.
- 3D Geometry restores supported surfaces/solids, base and added objects, transforms, dimensions, materials, opacity, visibility, camera preset, cross-section and animation values represented by the existing engine.
- CAS restores ordered expressions, operations, assumptions and evaluation mode, then safely recalculates imported cells through the CAS evaluator. Composer and selection state are retained.
- 2D Graph restores plots, point series, regression/result data and the unified snapshot, plus linked parameter sliders (`a`, `b`, `c`, ranges, steps and values).
- 3D Graph restores all surface records, variables, domain ranges, sampling resolution, style/opacity/wireframe flags, grid/axes/labels, camera/object positions, slicing, analysis point, reference object, theme, auto-rotation and project metadata.

Cross-workspace imports store the already-validated payload in session storage, route to the declared workspace, then deserialize there. “Open in a New Tab” uses the same flow. Replacement of dirty work requires confirmation and offers “Export Current First.” Imports establish a clean checkpoint; successful portable exports update the file-saved checkpoint. Browser refresh warnings distinguish dirty state from a portable export.

## Image export

The service captures only each adapter’s mathematical target: geometry board, graph export panel, 3D viewport, CAS center/scrolling worksheet, or Graph Studio surface panel. Users can select current viewport or entire content, transparent/white/dark background, 1×/2×/4× and PNG/JPEG. A preview lists filename, format, pixel dimensions and background before download/copy/share.

Rendering is asynchronous and capped at 120 million output pixels. Temporary preview URLs are revoked and temporary canvases reduced after encoding. Native sharing sends an in-memory `File` directly to the device share sheet; nothing is uploaded. Abort is treated as cancellation, while unsupported Clipboard/Web Share APIs produce actionable download fallbacks.

## Lesson implementation

Teacher authoring captures distinct starting and solution scenes, any number of checkpoint scenes, metadata, instructions, hints, solution steps, expected result, notes and tags. Import previews describe lesson difficulty, grades and included guidance. Practice and Guided modes load the initial scene; Solution and Teacher modes load the completed scene. The initial scene is also the top-level scene, preventing accidental solution display through the ordinary loader.

The sample library includes all required lessons and each contains three or more hints, instructions, expected result, a completed state, human-readable steps, metadata/tags and an embedded preview thumbnail.

## Validation and security

Files are treated as untrusted. The reader validates encoded size, JSON structure, unsafe keys, nesting, node/list/string sizes, internal magic, kind/extension/MIME consistency, stable workspace type, schema and minimum reader versions, required fields, lesson/workspace agreement, scene object count and SHA-256 integrity before state changes. It never evaluates JavaScript, inserts imported HTML or extracts paths. Filename normalization prevents traversal. CAS and graph parameter adapters additionally bound imported counts, strings, names and numeric ranges.

## Verification performed

- Focused Vitest suite: 3 files, 19 tests passed. It covers five-workspace normalized round trips, lesson initial/solution isolation, hints/checkpoints, SHA-256 tamper rejection, conflicting types, unsupported reader versions, malformed/deep/oversized/prototype-polluting input, filename safety, extension/MIME warnings, all five generated sample files, 500-object geometry serialization without mutation, URL cleanup, sharing fallbacks and accessible Share triggers for all workspace types.
- The 500-object create/hash/serialize/parse corpus completed in approximately 12 ms in the test environment, below the 2.5 s regression threshold.
- Production `npm run build` passed after the final TypeScript and responsive-toolbar changes. Vite reports only the repository's existing large-chunk advisory.
- Browser smoke testing confirmed visible Share triggers on all five production routes, all seven panel actions, viewport/background/1×-2×-4×/PNG-JPEG selectors, and the Graph Studio mobile trigger at 390×844. That check discovered and fixed the initial mobile toolbar omission and constrained the dialog to the mobile viewport.
- The complete repository Vitest run executed 1,639 tests: 1,635 passed and 4 failed in two unrelated existing areas (`src/dictionary/mathConceptIcons.test.ts` and `src/pages/TheoremLibraryPage.test.tsx`). The 19 focused portability tests all passed; no failing test was disabled or modified.

## Cross-device compatibility

The payload uses UTF-8 JSON, ISO dates, portable IDs, embedded thumbnails and Web Crypto-compatible SHA-256. It has no absolute paths and no origin-bound object references. PWA file handlers, picker filters, download MIME types and cross-route app opening use the same media-type constants. Clipboard and native sharing progressively enhance compatible desktop/mobile browsers.

## Known limitations

- Version 1 has no older public schema, so the migration boundary is implemented but has no historical transformation yet. New envelope versions must add sequential pure migration functions.
- WebGL/HTML output is composited through the browser DOM capture path. It preserves the visible 3D canvas and overlays, but it does not yet create an engine-native off-screen Three.js render target; maximum sharpness can therefore depend on the browser canvas backing store. The 2×/4× composite does not permanently modify camera or renderer state.
- “Entire construction” uses the current export target’s scroll bounds. Infinite-canvas semantic bounds and automatic fit-to-all are engine enhancements, not part of this change.
- Adapter-supported scene data is faithfully retained; capabilities that the existing workspace engines do not model (for example arbitrary 3D curve/vector-field objects in Graph Studio) cannot be synthesized by the file layer.
- Merge is deliberately disabled because none of the five current adapters can guarantee collision-free ID/dependency merging. The UI only shows Merge when an adapter explicitly opts in.
- Locally distributed lesson solutions are inspectable and are not secure examination material.

## Recommended next enhancements

Add engine-native off-screen WebGL rendering with an overlay compositor; semantic all-object export bounds; a ZIP-based schema version only if external assets become necessary; adapter-level read-only handling for unknown future scene objects; conflict-aware merge with ID remapping; and Playwright device/browser coverage for actual download, clipboard, file-handler launch and native-share mocks. When schema 2 is introduced, add and fixture-test `migrateV1ToV2` before changing exported defaults.
