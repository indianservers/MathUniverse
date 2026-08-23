# Lesson-Specific Visual Preset Rollout

This is the controlled rollout plan for replacing repeated lesson visuals with exact lesson-specific visual states.

## Current State

- The full catalog has 919 classified resources.
- Engine-backed lessons are queued for visual-preset remediation.
- We will not create new mathematical engines.
- Existing engines remain the implementation boundary.

## Start Command

When the user says `start`, begin `visual-batch-01`.

## Batch Contract

Each batch contains about 30 lessons and must produce:

- A lesson-specific visual preset for every lesson in the batch.
- Exact graph expression, construction, CAS expression, data state, surface, or solid configuration.
- Draggable or adjustable controls only where mathematically meaningful.
- Highlighted outputs that match the lesson title.
- Screen-reader summary of the actual visual object.
- Route smoke test coverage proving lessons do not all render the same fallback.
- Browser spot-check on representative routes.

## Implementation Order

1. Calculus graph-heavy lessons.
2. Functions and graphs.
3. Geometry and theorem visuals.
4. CAS and symbolic lessons.
5. 3D geometry and surfaces.
6. Probability, statistics, and data experiments.
7. Remaining advanced and school resources.

## Done Definition

A lesson is considered visually remediated only when:

- The visible graph/construction/surface/data/CAS state is specific to the lesson.
- The visual state is loaded through reusable preset data, not hard-coded scattered adapter branches.
- The route still resolves.
- Existing standalone workspace behavior is unchanged.
- The interaction is keyboard-operable or has a documented keyboard alternative.
- Browser smoke testing confirms the rendered state is not the generic fallback.
