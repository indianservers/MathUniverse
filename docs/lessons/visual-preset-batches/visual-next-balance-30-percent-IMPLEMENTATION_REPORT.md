# Visual Preset Rollout - Balance 30 Percent Pass

Status: implemented and smoke-tested.

## Scope

- Completed `visual-batch-15` rows 3-30.
- Completed all of `visual-batch-16`.
- Completed all of `visual-batch-17`.
- Completed `visual-batch-18` rows 1-28.
- Total lessons advanced in this pass: 116.
- Next cursor: resume at `visual-batch-18` row 29, lesson `phase1-class-9-mensuration-03-coordinate-area-versus-heron-s-formula`.

## Implementation Notes

- Confirmed statistics lessons `482-499` render lesson-specific statistics guidance through the shared statistics adapter.
- Confirmed probability lessons `501-536` render lesson-specific probability/distribution guidance through the seeded probability adapter.
- Confirmed inference lessons `537-555` render lesson-specific interval, test, p-value, error, and power guidance through the inference adapter.
- Confirmed core graph and school graph routes in this slice render through the reusable graph/school lesson surfaces.
- Strengthened the reusable 3D engine so `378-427`, including this pass's `422-partial-derivatives` and `424-tangent-plane`, expose lesson-specific 3D guidance instead of generic spatial copy.
- Renamed generic non-surface 3D labels from "3D geometry" wording to "spatial" wording, keeping the focused reusable axis workspace behavior.

## Validation

- `npx vitest run src/modules/lessons/adapters/StatisticsLessonAdapter.test.tsx src/modules/lessons/adapters/ProbabilityLessonAdapter.test.tsx src/modules/lessons/adapters/InferenceLessonAdapter.test.tsx src/modules/lessons/adapters/GraphLessonAdapter.test.tsx src/modules/lessons/adapters/Geometry3DLessonAdapter.test.tsx src/modules/lessons/adapters/Geometry2DLessonAdapter.test.tsx --reporter=dot`
- `npx eslint src/modules/lessons/adapters/Geometry3DLessonAdapter.tsx src/modules/lessons/components/ReusableLessonEngine.tsx src/modules/lessons/adapters/StatisticsLessonAdapter.tsx src/modules/lessons/adapters/ProbabilityLessonAdapter.tsx src/modules/lessons/adapters/InferenceLessonAdapter.tsx src/modules/lessons/adapters/GraphLessonAdapter.tsx src/modules/lessons/adapters/Geometry2DLessonAdapter.tsx --max-warnings=0`

## Browser Smoke

- `/lessons/data-and-probability/482-stem-and-leaf-plot`
- `/lessons/data-and-probability/516-distribution-calculator`
- `/lessons/data-and-probability/555-power-of-a-test`
- `/lessons/core-workspaces/12-hyperbolic-functions`
- `/lessons/school/class-6/class-6-data-handling-pictograph-builder`
- `/lessons/school/class-11/class-11-relations-and-functions-types-of-relations`
- `/lessons/school/class-11/class-11-conic-sections-ellipse-standard-forms`
- `/lessons/school/class-12/class-12-linear-programming-feasible-region`
- `/lessons/3d-mathematics/422-partial-derivatives`
- `/lessons/3d-mathematics/424-tangent-plane`
- `/lessons/school/class-7/class-7-practical-geometry-copying-a-line-segment`
- `/lessons/school/class-8/class-8-practical-geometry-right-triangle-construction-by-rhs`

All checked routes rendered their expected lesson-specific body text. Some generated catalog routes canonicalized internally while preserving the intended lesson content.
