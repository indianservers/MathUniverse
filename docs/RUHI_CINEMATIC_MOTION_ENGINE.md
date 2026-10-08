# Ruhi Cinematic Motion Engine

Implemented for Ruhi commands in the 2D graph, 2D geometry, 3D graph and 3D geometry workspaces. Open Ruhi with **Ask Math · Offline** to access Cinematic, speed (0.5×/1×/1.5×/2×), reduced motion, pause/resume, skip, cancel, replay, glow and 2D trails. Settings persist locally. The OS reduced-motion preference is used by default.

## Architecture

Ruhi resolves and validates the exact target using the existing semantic planner. The workspace bridge snapshots the start and schedules preview frames through a separate `RuhiCinematicMotionEngine`. `motionPreview` publishes transient commands to isolated SVG / React Three Fiber children. Affected native objects are temporarily hidden; their mathematical state, serialization and undo snapshots stay unchanged during playback. Linked Ruhi constructions are recomputed from each preview scene. On completion, the bridge commits the exact target and linked results, then removes the preview. Semantic verification and conversational history continue through the existing engine. Failed or cancelled isolated previews leave the original scene intact; the existing semantic rollback handles a partially committed compound turn.

Assistant turns are serialized per workspace so follow-up references resolve after the previous exact commit. Within each turn, effects retain their existing order. Playback uses requestAnimationFrame and cubic easing. Slow frames advance by at most 50 ms of animation time, avoiding a large visual jump. Preview components update independently of the workspace page. 2D expression compilation has a bounded cache; 3D mesh resources are disposed when replaced. Camera and existing viewport controls stay in place.

Translations interpolate world coordinates. Euler rotations interpolate angles; explicit 2D rotations use a rigid arc about the mathematical pivot. Scaling interpolates dimensions and scale. Reflection passes continuously through its degenerate midpoint. Graph expressions blend evaluated functions and retain the exact final expression. 2D outline morphs use resampled perimeter vertices. Solid 3D topology morphs interpolate complete triangle buffers while retaining both endpoint surfaces. Creation grows geometry, draws strokes and graph traces, and pulses points. Labels, vertex labels, radius/length/area readouts and angle arcs follow preview geometry; 3D preview labels follow the moving objects. Dependencies that become undefined temporarily are hidden until mathematically defined again.

## Files

- `src/math-robo/animation/RuhiCinematicMotionEngine.ts`: queue, easing, interpolation, settings and playback.
- `src/math-robo/animation/meshMorph.ts`: solid triangle-buffer morph interpolation.
- `src/math-robo/animation/motionPreview.ts`: transient preview publication and renderer registration.
- `src/math-robo/animation/CinematicSvgPreview.tsx`: isolated 2D renderer, labels, measurements, creation traces, glow and trails.
- `src/math-robo/animation/CinematicThreePreview.tsx`: isolated 3D geometry/surface previews and moving labels.
- `src/math-robo/animation/CinematicMotionControls.tsx`: compact Ruhi controls.
- `src/math-robo/animation/RuhiCinematicMotionEngine.test.ts`, `src/math-robo/animation/meshMorph.test.ts`: motion and mesh unit tests.
- `src/offline-intelligence/workspaceBridge.ts`: preview scheduling and exact final commit.
- `src/math-robo/intelligence/liveAssistant.ts`: sequential conversational turns and rotation hints.
- `src/offline-intelligence/OfflineMathAssistant.tsx`: motion controls in Ruhi.
- `src/components/math-lab/FunctionGraphCanvas.tsx`, `src/components/workspace/WorkspaceSvg.tsx`, `src/pages/MathWorkspace.tsx`, `src/pages/MathLab3DGraphing.tsx`: renderer integration.

## Examples

- Draw a circle of radius 5. Move it 5 units right. Move it to (8,3). Change its radius to 9.
- Create a triangle. Rotate it by 30 degrees. Reflect it across the y-axis.
- Draw a line from 0,0 to 6,8. Create a point at the midpoint. Move the line 3 units right.
- Plot y=x^2. Move it 4 units right. Change its expression to (x-2)^2+3.
- Create a sphere of radius 2. Move it 3 units right.
- Plot z=x^2+y^2. Move it 3 units right.

These use the existing NLP vocabulary; playback does not turn an unsupported mathematical request into a supported one.

## Validation

- Full Ruhi / offline-intelligence suite: **7,375 tests passed in 38 files** (`reports/cinematic-tests.txt`).
- Final motion suite: **16 tests passed** (`reports/cinematic-motion-tests.txt`) after adding outline-morph and full-turn checks. Covers exact endpoints, immutability, 3D positions, rigid/pivot rotation, graph morph, creation, reflection, ordered queue, pause/resume, skip, cancellation, reduced motion and disabled motion.
- Four-workspace browser checks: create/move/undo/redo succeeded in all four modes. Recorded 18 / 40 / 44 / 23 distinct intermediate frames in graph2d / geometry2d / geometry3d / graph3d. Native coordinates remained fixed during playback, then matched exact endpoints; undo and redo restored exact coordinates. No browser page errors (`reports/ruhi-cinematic-four-workspaces.json`).
- Solid 3D topology browser check: sphere-to-cube completed through **44 source-aware preview frames**, retaining the sphere as the start geometry and committing the cube without page errors.
- Actual rendered SVG paths changed during the browser circle test while native coordinates stayed fixed (`reports/ruhi-cinematic-browser.json`).
- Linked-midpoint browser check: **43 frames**, all satisfying midpoint = average of the moving line endpoints. Replay preserved exact state; preview cleanup passed (`reports/ruhi-cinematic-dependencies.json`).
- Student production build succeeded (`reports/cinematic-build.txt`).
- The repository has pre-existing global TypeScript errors. The last full typecheck, before the final mesh-morph additions, recorded **218 existing global errors** and no errors in the checked motion modules, workspace bridge, live assistant or SVG wrapper (`reports/cinematic-typecheck.txt`). Final additions were checked with focused tests, real browser checks and the production build. No clean global typecheck is claimed.

Reproduce browser checks with `node scripts/ruhi-cinematic-check.mjs`, `node scripts/ruhi-cinematic-four-workspaces.mjs`, and `node scripts/ruhi-cinematic-dependencies.mjs` while the app runs at port 9867.

## Current limits

- 3D previews use standard materials and a bounded surface sampling resolution. Complex native clipping, custom surface palettes and adaptive sampling can differ visually during preview; exact native rendering returns at commit.
- The motion adapters support 2D outline morphs and 3D triangle-buffer morphs across solid mesh topologies. Shape-changing NLP intents were not added; requests still use the existing semantic vocabulary. Directed objects and points do not participate in solid topology morphs.
- Trails are currently a 2D effect. Glow is a lightweight SVG/material effect, without a postprocessing cinematic renderer.
- Live preview readouts and linked Ruhi constructions update during playback. Existing side-panel inspectors and saved scene data show committed state until completion. Native constructions without Ruhi dependency metadata do not acquire new dependency definitions automatically.
- Undo/redo retains the existing semantic transaction boundaries. Preview frames never become individual history entries. Compound turns are ordered effects, rather than a parallel multi-object choreography editor.
