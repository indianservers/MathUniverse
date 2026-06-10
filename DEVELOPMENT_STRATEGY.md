# Math Universe 10-Phase Development Strategy

This roadmap turns Math Universe from a collection of strong math labs into a unified, GeoGebra-class and Wolfram-style interactive math workspace. The goal is not to add ten isolated features. The goal is a 10x product shift: one living math environment where users can type, drag, calculate, graph, construct, prove, simulate, explain, save, export, and teach from the same workspace.

## Product North Star

Math Universe should become a browser-first mathematics operating system:

- GeoGebra-level interactivity: linked graph, algebra, geometry, table, CAS, 3D, probability, and construction views.
- Wolfram-style intelligence: natural input, exact and numeric computation, step-by-step explanations, assumptions, alternate methods, and validation.
- Better learning flow: every computation can become a visualization, every visualization can become a problem, every problem can become a guided lesson.
- Better classroom flow: teachers can author, present, export, assign, and assess activities.
- Better UI: dense but calm, tool-first, touch-friendly, keyboard-friendly, and visually consistent across all labs.

## Global Engineering Principles

- Build a shared math kernel before adding more isolated pages.
- Keep the browser-only path strong, but use a secure backend for AI and heavyweight computation when needed.
- Prefer exact symbolic computation when possible, numeric approximation when necessary, and always label approximations clearly.
- Store large user projects in IndexedDB, not only localStorage.
- Make every major tool exportable and shareable.
- Treat mobile, tablet, mouse, keyboard, and stylus as first-class input modes.
- Add tests around engines first, then UI smoke tests for core workflows.

## Phase 1: Workspace Foundation and UI System

### Objective

Create the foundation for a unified Math Workspace and upgrade the visual/UI system so future phases have a stable, polished shell.

### What We Lack Today

- Workspace features exist, but they are still mostly page-local.
- No central object model connects graphing, CAS, tables, geometry, and 3D.
- UI controls vary across modules.
- Some pages feel like separate prototypes instead of one professional tool.

### Core Features

- Create a shared `MathObject` model for:
  - expressions
  - equations
  - functions
  - points
  - vectors
  - matrices
  - tables
  - geometry objects
  - 3D objects
  - result cards
- Create a central workspace store:
  - active objects
  - selected object
  - object dependencies
  - visibility
  - color/style
  - history
  - saved project metadata
- Add a consistent workspace layout:
  - left tool rail
  - central canvas
  - right inspector
  - bottom results/timeline drawer
  - command bar
- Add object inspector panels:
  - label
  - type
  - value/equation
  - style
  - dependencies
  - linked views
- Add a command palette for tools and examples.

### UI Enhancements

- Replace page-heavy navigation for Math Lab tools with a workspace-first shell.
- Add consistent icon-only tool buttons with tooltips.
- Add segmented controls for modes.
- Add denser but readable panels for mathematical tools.
- Standardize:
  - toolbar buttons
  - sliders
  - toggles
  - object chips
  - formula blocks
  - status badges
  - result cards
  - error/warning states
- Add responsive tablet layout:
  - collapsible inspector
  - bottom sheet tools
  - larger touch targets
  - non-overlapping canvases

### Engineering Tasks

- Add `src/workspace/`:
  - `types.ts`
  - `workspaceStore.ts`
  - `objectRegistry.ts`
  - `dependencyGraph.ts`
  - `workspacePersistence.ts`
  - `workspaceHistory.ts`
- Add shared UI components:
  - `WorkspaceShell`
  - `ToolRail`
  - `InspectorPanel`
  - `CommandBar`
  - `ObjectList`
  - `ResultTimeline`
  - `WorkspaceCanvas`
- Move reusable graph/table/result logic out of page-local files where possible.

### Acceptance Criteria

- `/workspace` opens a polished unified shell.
- Users can add, select, rename, hide, show, and delete math objects.
- Object changes appear in the inspector and timeline.
- Workspace state persists locally.
- Existing MathWorkspace behavior is not broken.
- Build passes.

## Phase 2: Linked Graphing, Tables, and Expression Engine

### Objective

Make graphing feel closer to GeoGebra/Desmos: expressions, tables, traces, sliders, and graph views should be linked through shared objects.

### What We Lack Today

- Graphing tools are good but mostly isolated.
- Sliders are not global workspace objects.
- Tables do not fully drive graphs and graphs do not fully drive tables.
- Inequality, piecewise, implicit, polar, parametric, and regression support is incomplete.

### Core Features

- Add expression objects that can render as:
  - graph
  - table
  - CAS result
  - transformation panel
  - slider-linked expression
- Add graph types:
  - explicit functions
  - inequalities
  - implicit equations
  - piecewise functions
  - parametric curves
  - polar curves
  - scatter plots
  - regression curves
- Add global sliders:
  - create from variables
  - animate
  - set min/max/step
  - bind to expressions
- Add table view:
  - generated value tables
  - editable datasets
  - table-to-graph plotting
  - CSV import/export
- Add trace and analysis:
  - roots
  - intercepts
  - extrema
  - intersections
  - asymptote warnings
  - domain/range approximations

### UI Enhancements

- Add graph layer panel with visibility, color, line style, and delete.
- Add floating graph controls for zoom, reset, trace, grid, axes, snap, export.
- Add graph/table split view.
- Add clear approximation badges.
- Improve graph empty/error states.

### Engineering Tasks

- Extend `functionParser` and `mathEngine/graphSampler`.
- Add `GraphObjectRenderer`.
- Add `TableObjectRenderer`.
- Add `SliderObject`.
- Add expression dependency recomputation.
- Add unit tests for sampling, parsing, roots, intersections, and slider substitution.

### Acceptance Criteria

- A user can type `a sin(bx + c)`, auto-create sliders, animate them, see graph and table update.
- A user can paste points and generate scatter plus regression.
- A user can export graph/table data.
- Graph errors are readable, not crashes.

## Phase 3: CAS, Step-by-Step Solver, and Natural Query Layer

### Objective

Move from lightweight symbolic helpers to a serious CAS and step-by-step explanation system.

### What We Lack Today

- CAS notebook is partial.
- Step-by-step solving is limited.
- Natural language only routes by keywords.
- No strong assumptions/domain handling.

### Core Features

- Build a CAS notebook panel:
  - multiple cells
  - expression history
  - rendered math
  - exact and decimal results
  - linked graph/table buttons
- Add symbolic tasks:
  - simplify
  - expand
  - factor
  - solve
  - inequalities
  - systems
  - derivatives
  - integrals
  - limits
  - series
  - partial fractions
  - trig identities
- Add step engine:
  - algebra transformations
  - derivative rules
  - integral methods
  - equation-solving steps
  - matrix row-reduction steps
  - proof-by-induction templates
- Add query understanding:
  - parse intent
  - detect variables
  - detect target operation
  - route to CAS/graph/geometry/table
  - show confidence and alternatives

### UI Enhancements

- Add notebook-style math cells.
- Add expandable steps with method labels.
- Add "why this step" explanations.
- Add "try another method" where available.
- Add mistake diagnosis cards for invalid input.

### Engineering Tasks

- Create `src/cas/`:
  - `casAdapter.ts`
  - `stepEngine.ts`
  - `queryParser.ts`
  - `assumptions.ts`
  - `resultFormatter.ts`
- Keep Nerdamer as current local engine where useful.
- Design adapter so a future backend/WASM CAS can replace or augment Nerdamer.
- Add engine tests for each symbolic task.

### Acceptance Criteria

- Users can solve, factor, differentiate, integrate, and graph from one notebook.
- At least algebra, derivatives, integrals, and matrices have meaningful steps.
- Natural queries route to the correct tool with editable interpretation.

## Phase 4: GeoGebra-Class Geometry and Construction Kernel

### Objective

Upgrade geometry from a useful visualizer into a dynamic construction system.

### What We Lack Today

- Geometry workspace supports many objects, but not a full robust construction kernel.
- Constraint solving is limited.
- Locus, macros, theorem helpers, and rich measurements are missing.

### Core Features

- Add construction objects:
  - free point
  - dependent point
  - segment
  - ray
  - line
  - vector
  - circle
  - arc
  - polygon
  - angle
  - conic
  - locus
  - transformation result
- Add construction tools:
  - perpendicular bisector
  - angle bisector
  - tangent
  - parallel
  - perpendicular
  - midpoint
  - intersection
  - reflection
  - rotation
  - translation
  - dilation
  - locus trace
- Add measurement tools:
  - distance
  - angle
  - area
  - perimeter
  - slope
  - equation
  - coordinates
- Add construction history and dependency graph.
- Add macros/custom tools.

### UI Enhancements

- Geometry-specific tool palette with icon tools.
- Hover/pick feedback for objects.
- Object inspector with dependency warnings.
- Construction protocol timeline.
- Snap/grid controls.
- Touch-friendly point dragging.

### Engineering Tasks

- Create `src/geometry-kernel/`:
  - `geometryTypes.ts`
  - `constructionStore.ts`
  - `constraintSolver.ts`
  - `geometryMeasurements.ts`
  - `geometryTransforms.ts`
  - `constructionProtocol.ts`
- Move geometry code out of the giant `MathWorkspace.tsx` into reusable modules.
- Add robust geometry engine tests.

### Acceptance Criteria

- Users can construct a theorem diagram, drag source points, and dependent objects update.
- Construction protocol shows each step.
- Measurements update live.
- Geometry objects can be linked to algebra expressions.

## Phase 5: 3D Math Studio

### Objective

Turn 3D graphing into an exploratory 3D math studio, not just surface previews.

### What We Lack Today

- 3D surfaces exist, but 3D geometry, vectors, planes, intersections, and measurements are shallow.
- Cross-sections and clipping are limited.

### Core Features

- Add 3D objects:
  - points
  - vectors
  - lines
  - planes
  - parametric curves
  - parametric surfaces
  - implicit surfaces
  - solids
  - polyhedra
- Add 3D operations:
  - dot/cross product visualization
  - plane intersections
  - line-plane intersections
  - tangent plane
  - normal vector
  - gradient vector
  - contour slices
  - clipping planes
  - volume approximation
- Add camera and scene tools:
  - reset
  - orbit
  - pan
  - zoom
  - view presets
  - axes/grid toggles
  - export snapshot

### UI Enhancements

- Full-bleed 3D canvas mode.
- Compact scene object list.
- Numeric inspector for selected 3D object.
- Cross-section slider panel.
- Preset gallery with real math examples.

### Engineering Tasks

- Create `src/space3d/`:
  - `spaceTypes.ts`
  - `surfaceCompiler.ts`
  - `meshBuilder.ts`
  - `spaceMeasurements.ts`
  - `threeObjectRenderers.tsx`
- Add Playwright/browser screenshot checks for nonblank 3D canvas.
- Add workerized surface sampling for heavier meshes.

### Acceptance Criteria

- Users can create surfaces, planes, vectors, and curves in one scene.
- Users can inspect intersections and cross-sections.
- 3D canvas works on desktop and mobile without blank render failures.

## Phase 6: Learning Intelligence, AI Tutor, and Adaptive Practice

### Objective

Make the app teach, not just calculate.

### What We Lack Today

- AI Tutor is a rule-based placeholder.
- Practice is mostly quiz-based.
- No student model, misconception tracking, or adaptive remediation.

### Core Features

- Add secure AI tutor backend:
  - no browser-exposed API keys
  - workspace-aware prompts
  - math-safe answer constraints
  - citations to local lesson content where possible
- Add Socratic mode:
  - hints
  - next question
  - misconception detection
  - final answer only after attempts
- Add adaptive practice:
  - topic mastery
  - spaced repetition
  - difficulty scaling
  - generated variants from templates
  - solution checking
- Add worked example generator:
  - step-by-step
  - visual companion
  - practice follow-up

### UI Enhancements

- Tutor side panel docked to workspace.
- Hint ladder UI.
- Practice queue with mastery badges.
- Mistake review timeline.
- Calm feedback states, not noisy gamification.

### Engineering Tasks

- Create backend route/service for AI calls.
- Create `src/learning/`:
  - `studentModel.ts`
  - `practiceGenerator.ts`
  - `answerChecker.ts`
  - `hintPolicy.ts`
  - `misconceptionTags.ts`
- Store learning progress in IndexedDB.
- Add safety tests for prompt and response formatting.

### Acceptance Criteria

- Tutor can explain selected workspace objects.
- Practice adapts based on correctness and hints used.
- Generated explanations are tied to the user's current math state.

## Phase 7: Classroom Authoring, Worksheets, and Presentation Mode

### Objective

Let teachers and creators build activities from the interactive tools.

### What We Lack Today

- No first-class authoring flow.
- No shareable lessons or worksheets.
- No presentation/classroom mode.

### Core Features

- Add activity builder:
  - intro card
  - instruction card
  - embedded workspace
  - question card
  - hint card
  - checkpoint
  - reflection prompt
- Add worksheet export:
  - PDF
  - printable answer key
  - QR/share link
  - selected graph/geometry snapshots
- Add presentation mode:
  - full-screen teaching view
  - step reveal
  - focus object
  - annotation tools
  - timer
- Add classroom assessment:
  - local activity attempt
  - score summary
  - misconception summary

### UI Enhancements

- Authoring timeline.
- Slide/activity canvas.
- Preview mode.
- Teacher/student mode toggle.
- Export center.

### Engineering Tasks

- Create `src/authoring/`:
  - `activityTypes.ts`
  - `activityStore.ts`
  - `worksheetRenderer.ts`
  - `presentationMode.tsx`
  - `activityPlayer.tsx`
- Reuse workspace snapshots as embedded activity states.
- Add export tests for PDF/PNG where practical.

### Acceptance Criteria

- Teacher can build a short interactive lesson from workspace objects.
- Lesson can be played by a student.
- Worksheet exports include math notation and visuals.

## Phase 8: Sharing, Project Files, Import/Export, and Offline Scale

### Objective

Make Math Universe projects portable, persistent, shareable, and reliable offline.

### What We Lack Today

- Persistence is mostly localStorage.
- Project export is inconsistent.
- No universal file format.
- No robust share/remix flow.

### Core Features

- Add project system:
  - create
  - rename
  - duplicate
  - tag
  - search
  - autosave
  - version history
- Add file format:
  - `.mathuniverse.json`
  - workspace objects
  - dependencies
  - snapshots
  - activity data
  - metadata
- Add imports:
  - CSV
  - JSON
  - supported expression lists
  - graph/project files
- Add exports:
  - project JSON
  - PNG
  - SVG
  - PDF
  - CSV
  - LaTeX snippets
- Add offline-first IndexedDB stores.

### UI Enhancements

- Project dashboard.
- Save status indicator.
- Export modal.
- Import preview and conflict handling.
- Version history drawer.

### Engineering Tasks

- Create `src/storage/`:
  - `indexedDbClient.ts`
  - `projectRepository.ts`
  - `migrationRunner.ts`
  - `exporters.ts`
  - `importers.ts`
- Add schema versioning and migration tests.
- Harden PWA caching strategy for larger assets.

### Acceptance Criteria

- Users can save multiple projects locally.
- Users can export/import project files.
- Offline reload restores projects and recent workspace state.

## Phase 9: Performance, Exam Mode, Accessibility, and Production Hardening

### Objective

Make the whole product reliable enough for serious classroom and study use.

### What We Lack Today

- Some engines are classroom-scale, not large-scale.
- No exam mode.
- Accessibility is partially addressed but not systematically verified.
- No broad visual regression workflow.

### Core Features

- Add exam mode:
  - tool whitelist
  - locked navigation
  - timer
  - reset session
  - local attempt log
  - offline-safe mode
- Add performance hardening:
  - workerized computations
  - virtualized tables
  - Canvas/WebGL for large graphs
  - lazy-loaded heavy panels
  - memory cleanup for 3D scenes
- Add accessibility:
  - keyboard navigation
  - screen-reader labels
  - contrast checks
  - reduced-motion path
  - focus management
- Add QA:
  - Playwright smoke tests
  - mobile screenshots
  - 3D nonblank checks
  - route loading tests
  - engine unit tests

### UI Enhancements

- Accessibility review pass on every major workspace panel.
- Mobile overlap checks.
- Loading skeletons for heavy modules.
- Error recovery screens.
- Consistent empty states and diagnostics.

### Engineering Tasks

- Add `tests/` structure for:
  - engine unit tests
  - route smoke tests
  - visual checks
  - accessibility checks
- Add performance budgets.
- Add CI workflow if repository hosting supports it.
- Split large route chunks.

### Acceptance Criteria

- Core routes load without runtime errors.
- Workspace is usable by keyboard.
- Large data/graph examples do not freeze the UI.
- Exam mode locks to allowed tools.
- Production build passes consistently.

## Phase 10: Polish, Scale, Integration, and Release Readiness

### Objective

Turn the completed phase work into a coherent, shippable, demo-ready product with a focused integration layer for the separate probability/statistics/spreadsheet tool.

### Scope Boundary

Probability, statistics, and spreadsheet workflows are handled by a separate tool. Math Universe should link to or embed that tool where needed, but should not duplicate its core product surface.

### Core Features

- Add final product integration pass:
  - workspace entry points
  - learning hub links
  - syllabus links
  - external data-tool handoff
  - consistent empty states
- Add release readiness:
  - demo scripts
  - route health checks
  - sample projects
  - import/export fixtures
  - final accessibility checklist
- Add documentation:
  - user guide
  - teacher guide
  - keyboard shortcuts
  - known limits
  - comparison positioning against GeoGebra and Wolfram Alpha

### UI Enhancements

- Final responsive polish across core workspace routes.
- Consistent iconography, density, and panel layout.
- Demo-ready landing from dashboard into the unified workspace.
- Clear boundaries for tools powered elsewhere.

### Acceptance Criteria

- A complete demo flow can be run from dashboard to workspace to export without explanation.
- The separate probability/statistics/spreadsheet tool is clearly linked where relevant.
- No duplicate local probability/statistics/spreadsheet implementation is introduced.
- Build and route smoke checks pass.

## Phase Ordering Summary

| Phase | Name | Main Outcome |
| --- | --- | --- |
| 1 | Workspace Foundation and UI System | Unified shell, object model, inspector, history |
| 2 | Linked Graphing, Tables, Expressions | GeoGebra/Desmos-class graph-table-slider linkage |
| 3 | CAS, Steps, Natural Query | Wolfram-style solving foundation |
| 4 | Geometry Construction Kernel | Dynamic construction system |
| 5 | 3D Math Studio | Deep 3D math exploration |
| 6 | Learning Intelligence and AI Tutor | Adaptive explanations and practice |
| 7 | Classroom Authoring | Lessons, worksheets, presentation mode |
| 8 | Sharing and Offline Projects | Project files, IndexedDB, import/export |
| 9 | Production Hardening | Exam mode, performance, accessibility, QA |
| 10 | Polish, Scale, Integration, Release Readiness | Final integration and demo-ready product |

## Recommended Implementation Rhythm

Each phase should follow this rhythm:

1. Engine first: define types, state, and pure functions.
2. Minimal UI shell: expose the capability in the workspace.
3. Link it: connect to objects, inspector, history, and exports.
4. Polish it: mobile, empty states, errors, keyboard, visual consistency.
5. Verify it: unit tests, build, and targeted browser smoke checks.
6. Document it: update README/audit notes with exact scope and known limits.

## Phase 1 Immediate Backlog

Start with these tasks:

1. Add workspace domain types in `src/workspace/types.ts`.
2. Add Zustand workspace store in `src/workspace/workspaceStore.ts`.
3. Add object registry helpers in `src/workspace/objectRegistry.ts`.
4. Add history and dependency helpers.
5. Refactor `/workspace` to use `WorkspaceShell`.
6. Add `ToolRail`, `InspectorPanel`, `ObjectList`, `ResultTimeline`, and `CommandBar`.
7. Move current workspace tabs into the new shell without deleting existing behavior.
8. Add UI polish for responsive inspector and bottom drawer.
9. Persist workspace state.
10. Run build and fix type issues.
