# Phase 5 baseline — 2026-08-20

## Regression baseline

`npm run verify:phase4` was started before Phase 5 edits. Phase 1 math-foundation tests (39), truth tests (4), document tests (4), Phase 2 tests (15), Phase 2 benchmark tests (2), and the first production build passed. The remaining Phase 3–4 stages were allowed to continue while Phase 5 work was isolated in new modules.

## 3D baseline

- The graph studio supported general explicit `z=f(x,y)` sampling.
- Geometry 3D supported typed points, vectors, lines, planes and named sphere/cylinder/cone objects.
- Several visualizers used preset-specific Three.js scenes.
- There was no universal explicit/parametric/implicit/curve/field node union, shared 2D/3D/CAS identity workflow, general isosurface pipeline, deterministic 3D benchmark, or declared mesh error contract.
- `native-3d-adapter` was truthfully registered as unsupported.

## Authoring, boards and localization baseline

- Classroom authoring was a small lesson-step structure without a review/publish state machine.
- Phase 3 had official-source ingestion, checksums, corrections and structural diffs.
- AP and Telangana official syllabus evidence remained unavailable; no direct coverage claim was made.
- No Phase 5 AP SCERT, Telangana SCERT, or Tamil Nadu SCERT certification existed.
- Translation review, extension permissions, privacy-safe share documents and generated five-module scorecards were not implemented as unified systems.

## Known repository baseline issue

Full-repository ESLint already contained 60 unused-code errors in six older files. Phase-specific lint is used without suppressing or weakening those rules; the full failure remains reported.

