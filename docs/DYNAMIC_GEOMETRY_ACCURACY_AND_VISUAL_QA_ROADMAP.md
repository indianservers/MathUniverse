# Dynamic Geometry Accuracy and Visual QA Roadmap

## Product Target

Dynamic Geometry should become a browser-only construction lab that is stronger than a simple drawing board. The goal is not to copy GeoGebra feature-for-feature, but to exceed it for classroom trust: every construction should have a visible object, a mathematical invariant, a numeric residual, a proof hint, and browser visual QA evidence.

## Current Baseline

- The workspace already has a dedicated `/workspace/geometry` route.
- Geometry rendering is isolated in `GeometryWorkspacePanel`.
- Construction commands are partially extracted into typed builders and command controllers.
- Advanced builders already cover midpoint, parallel, perpendicular, intersections, compass copy, regular polygon, mirror, rotate, dilate, translate, fixed length, and point-on-circle constraints.
- Browser smoke tests already check route rendering and basic board interaction.
- The missing high-value layer was construction certification: the app could create objects, but did not consistently prove that the created objects still satisfy their defining geometry.

## Phase 1 Implemented: Construction Accuracy Certification

Created a pure certification layer:

- `src/workspace/geometryConstructionCertification.ts`
- `src/workspace/geometryConstructionCertification.test.ts`

The certification layer validates:

- midpoint residuals
- parallel angle residuals
- perpendicular angle residuals
- through-point incidence for constrained lines
- fixed-length residuals
- point-on-circle residuals
- intersection membership on both parent objects
- regular polygon side and angle residuals
- geometry visual QA contract metadata

The workspace QA suite now includes an advanced construction certification check.

## Why This Matters

GeoGebra-style tools often make a construction appear correct visually, but the classroom question is sharper: does the construction remain mathematically correct after drag, resize, or later dependency updates? The new certification layer turns every important construction into a measurable promise.

This gives the platform a foundation for:

- teacher trust badges
- construction protocol grading
- visual regression baselines with mathematical residuals
- automated bug detection after UI or engine refactors
- student feedback such as “your perpendicular is visually close, but not exact”

## Next Development Phases

### Phase 2 Implemented: Certification UI and Construction Inspector

Target:
- Show construction accuracy directly inside `/workspace/geometry`.

Technical goals:
- Add an “Accuracy” section to the geometry workspace.
- Display pass/warn/fail status, score, max residual, and failed invariant rows.
- Keep certification pure and browser-only.
- Add stable browser selectors for all geometry tool buttons.

Educational goals:
- Teach students that constructions are defined by invariants, not by appearance alone.
- Explain residuals in student language.
- Show visible keyboard guidance: select a point, use arrow keys to nudge, hold Shift for larger steps, and press Escape to clear selection.

QA goals:
- Component tests for pass/fail rendering.
- Browser smoke for certification panel after regular-polygon creation.

Acceptance criteria:
- A broken or drifted construction is visibly flagged.
- Valid constructions show “accuracy certified.”

Phase 2 implementation files:

- `src/components/workspace/panels/GeometryWorkspacePanel.tsx`
- `src/components/workspace/panels/GeometryWorkspacePanel.test.tsx`
- `src/pages/MathWorkspace.tsx`
- `tests/workspace/geometryAccuracyCertification.e2e.ts`

### Phase 3: Drag-Stable Dependency Revalidation

Target:
- Re-run certification after point drag and dependency recomputation.

Technical goals:
- Add low-cost certification after geometry drag events.
- Throttle certification with `requestAnimationFrame` or memoization.
- Add drag workflow tests for midpoint, fixed length, on-circle, parallel, and perpendicular.

Educational goals:
- Students see invariants survive movement.

QA goals:
- Unit tests for drag recomputation.
- Browser tests for point drag plus certification status.

Acceptance criteria:
- Certified constructions remain certified after supported drags.
- Broken dependencies fail clearly instead of silently drifting.

### Phase 4: Browser Visual Regression Baselines

Target:
- Add screenshot/pixel baselines for dynamic geometry tools.

Technical goals:
- Capture board screenshots for point, line, circle, midpoint, parallel, perpendicular, compass, intersection, and regular polygon.
- Add nonblank SVG checks and selected-object pixel-delta checks.
- Store route, viewport, action sequence, and max certification residual with each baseline.

Educational goals:
- Prevent accidental UI regressions that hide key construction cues.

QA goals:
- Playwright baseline suite for desktop and mobile.
- Console-error checks.

Acceptance criteria:
- Visual QA fails if board is blank, key objects are invisible, or certification fails.

### Phase 5: Robust Construction Protocol Engine

Target:
- Build a first-class construction protocol similar to professional geometry tools, but easier for students.

Technical goals:
- Record every construction step with parents, generated objects, invariant, residual, and explanation.
- Support undo/redo and replay from protocol.
- Export protocol as JSON and teacher lesson link.

Educational goals:
- Students can explain not just the answer, but how the figure was constructed.

QA goals:
- Protocol replay tests for all advanced construction tools.
- Import/export round-trip tests.

Acceptance criteria:
- Replaying a protocol reconstructs the same certified geometry.

### Phase 6: Stronger Exact Geometry Kernel

Target:
- Reduce floating-point drift and improve exactness for construction-heavy scenes.

Technical goals:
- Add normalized line/circle equations.
- Use squared distances where possible.
- Add determinant-based orientation and incidence helpers.
- Improve near-degenerate handling.

Educational goals:
- Make edge cases understandable: nearly parallel, tangent, collinear, duplicate points.

QA goals:
- Degenerate case tests for tangency, collinearity, near-zero radius, overlapping circles, and near-parallel lines.

Acceptance criteria:
- Degenerate geometry returns clear warnings instead of unstable objects.

### Phase 7: Advanced Tool Certification

Target:
- Certify richer tools beyond the first invariant set.

Tools:
- angle bisector
- perpendicular bisector
- tangent from point
- circle through three points
- circumcenter
- incenter
- centroid
- orthocenter
- transformations
- locus traces

Acceptance criteria:
- Each tool has a builder, certification check, tests, and protocol text.

### Phase 8: Teacher and Assessment Mode

Target:
- Grade constructions automatically.

Technical goals:
- Define rubric checks from certification results.
- Add “show hint,” “show invariant,” and “explain step” modes.
- Export results for classroom review.

Acceptance criteria:
- A teacher can assign “construct perpendicular through C to AB” and receive a pass/fail score with evidence.

### Phase 9: Performance and Large Construction Reliability

Target:
- Keep construction accurate and fast for large classroom scenes.

Technical goals:
- Benchmark 500, 1,000, and 5,000 object scenes.
- Cache parent lookup maps.
- Avoid full certification when only unrelated objects change.

Acceptance criteria:
- Large construction certification remains within a defined frame budget.

### Phase 10: Production Readiness Certification

Target:
- Issue a module readiness certificate for Dynamic Geometry.

Required evidence:
- typecheck pass
- build pass
- focused unit tests pass
- browser visual QA pass
- route smoke pass
- construction certification pass
- mobile viewport pass
- export/import protocol pass
- known limitations documented

## Immediate Recommendation

Implement Phase 2 next: surface construction certification in the geometry UI. The engine now has accuracy evidence, but students and teachers need to see it while constructing. This gives immediate product value and creates visible QA hooks for later browser automation.
