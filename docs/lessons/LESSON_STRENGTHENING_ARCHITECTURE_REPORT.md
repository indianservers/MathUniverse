# Lesson Strengthening Architecture Report

Generated: 2026-08-06

## Relevant Files and Directories

- Main catalog: `src/modules/lessons/catalog/lessonCatalog.ts`
- Generated main lessons: `src/modules/lessons/catalog/phase*.generated.ts`
- School catalog: `src/modules/lessons/catalog/school/schoolSyllabusCatalog.ts`
- Generated school lessons: `src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts`
- Main content factory: `src/modules/lessons/engine/lessonContent.ts`
- Preset resolution: `src/modules/lessons/engine/lessonPresets.ts`
- Contracts and enrichment: `src/modules/lessons/engine/lessonContracts.ts`
- Challenge runtime: `src/modules/lessons/engine/lessonRuntime.ts`
- Render shell: `src/modules/lessons/components/LessonShell.tsx`
- Main adapters: `src/modules/lessons/adapters/`
- School renderer: `src/modules/lessons/pages/SchoolLessonPage.tsx`
- School lab: `src/modules/lessons/components/SchoolLessonInteractiveLab.tsx`
- Math rendering: `src/components/ui/MathExpression.tsx` with KaTeX dependency
- Graphing and charting: Recharts, D3, React Flow, and workspace graph modules
- 3D rendering: Three.js and React Three Fiber
- Test infrastructure: Vitest, React Testing Library patterns, and Playwright e2e tests

## Existing Lesson Data Flow

Main lessons are generated in phase catalog files. `lessonCatalog.ts` combines them and calls `enrichLessonDefinition`. Enrichment resolves a preset, builds an interaction contract, and calls `createLessonContent`. `LessonPage.tsx` finds the route and renders `LessonShell`. The shell renders lesson content, the selected adapter, progress, challenge, formulas, examples, and language packs.

School lessons are generated in `schoolSyllabusLessons.generated.ts`. `schoolSyllabusCatalog.ts` exposes route lookup and search. `SchoolLessonPage.tsx` renders the generated content and `SchoolLessonInteractiveLab`.

## Where Generic Content Enters

- `lessonPresets.ts` falls back to family presets for most main lessons.
- `lessonContent.ts` builds shared summaries, explanations, examples, formulas, and control guides by adapter or topic regex.
- `lessonRuntime.ts` falls back to adapter-level challenges.
- `lessonContracts.ts` uses adapter-level contract templates when no lesson override exists.
- `SchoolLessonPage.tsx` renders generated syllabus content from title-injected arrays.
- `SchoolLessonInteractiveLab` is shared by concept family rather than exact lesson.

## Safe Shared Components to Retain

Keep the route system, shell layout, cards, progress storage, language loader, MathExpression renderer, adapter frame, existing graph and 3D engines, form controls, accessibility styling, and test setup. These are platform supports, not the source of generic teaching content.

## Content Generators to Replace or Bypass

Replace adapter-wide content and challenge fallbacks with structured lesson content. Keep shared mathematical generators only when the underlying mathematics is truly the same. School generated copy should be replaced by structured content loaded by route or lesson id.

## Recommended Migration Architecture

Add a structured content layer keyed by stable route and id. Validate each `StrengthenedLesson` before it can be used. Let adapters consume lesson-specific interaction specs, representations, misconceptions, practice, and challenge config. Keep existing lesson routes and renderers, then gradually switch families to the validated content source.

## No-Change Boundaries

Do not change authentication, payments, profiles, analytics, deployment, global navigation, unrelated workspaces, existing lesson IDs, or route URLs.

## Risks

- Some briefs are scaffolds and require expert review before approval.
- Formula validation is structural in Phase 1, not a proof of mathematical correctness.
- Route smoke testing for all 882 routes can be slow.
- Shared adapters may need small capability upgrades in Phase 2 for exact interactions.

## Phase 1 Baseline

The manifest contains 882 lessons: 662 main and 220 school.
