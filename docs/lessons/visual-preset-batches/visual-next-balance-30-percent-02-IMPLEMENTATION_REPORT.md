# Visual Preset Rollout - Balance 30 Percent Pass 02

Status: implemented and smoke-tested.

## Scope

- Completed `visual-batch-18` rows 29-30.
- Completed all of `visual-batch-19`.
- Completed all of `visual-batch-20`.
- Completed `visual-batch-21` rows 1-20.
- Total lessons advanced in this pass: 82.
- Next cursor: resume at `visual-batch-21` row 21, lesson `556-fundamental-counting-principle`.

## Implementation Notes

- Confirmed school geometry routes in rows 18.29-19.15 render topic-specific coordinate, mensuration, trigonometry, construction, and theorem lesson content.
- Confirmed complex-number lessons `365-377` render complex-plane-specific visual guidance instead of the repeated generic graph.
- Confirmed 3D mathematics lessons `378-427`, including coordinate systems, vectors, transformations, surfaces, slices, and CAD-style tools, render through the reusable 3D visual engine with topic-aware labels and measurements.
- Confirmed probability, calculator, CAS, and statistics lessons in this pass continue using the reusable engines with lesson-specific topic metadata.
- No new source edits were required in this pass because the strengthened reusable lesson engines already covered this range.

## Validation

- `npx vitest run src/modules/lessons/adapters/Geometry2DLessonAdapter.test.tsx src/modules/lessons/adapters/Geometry3DLessonAdapter.test.tsx src/modules/lessons/adapters/ComplexLessonAdapter.test.tsx src/modules/lessons/adapters/AlgebraLessonAdapter.test.tsx src/modules/lessons/adapters/ProbabilityLessonAdapter.test.tsx src/modules/lessons/adapters/CalculatorLessonAdapter.test.tsx src/modules/lessons/adapters/CasLessonAdapter.test.tsx src/modules/lessons/adapters/StatisticsLessonAdapter.test.tsx --reporter=dot`
- `npx eslint src/modules/lessons/adapters/Geometry2DLessonAdapter.tsx src/modules/lessons/adapters/Geometry3DLessonAdapter.tsx src/modules/lessons/adapters/ComplexLessonAdapter.tsx src/modules/lessons/adapters/AlgebraLessonAdapter.tsx src/modules/lessons/adapters/ProbabilityLessonAdapter.tsx src/modules/lessons/adapters/CalculatorLessonAdapter.tsx src/modules/lessons/adapters/CasLessonAdapter.tsx src/modules/lessons/adapters/StatisticsLessonAdapter.tsx src/modules/lessons/components/ReusableLessonEngine.tsx --max-warnings=0`

## Browser Smoke

All sampled routes rendered the expected lesson body text in the in-app browser:

- `/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula`
- `/lessons/school/class-10/class-10-coordinate-geometry-distance-formula`
- `/lessons/school/class-12/class-12-three-dimensional-geometry-skew-lines`
- `/lessons/advanced-mathematics/365-complex-plane`
- `/lessons/advanced-mathematics/376-mobius-transformations`
- `/lessons/3d-mathematics/378-3d-coordinate-system`
- `/lessons/3d-mathematics/384-lineplane-intersection`
- `/lessons/3d-mathematics/402-surface-of-revolution`
- `/lessons/3d-mathematics/409-transparent-x-ray-mode`
- `/lessons/3d-mathematics/413-surface-z-f-x-y`
- `/lessons/data-and-probability/500-sample-spaces`
- `/lessons/core-workspaces/13-factorial-permutation-and-combination`
- `/lessons/symbolic-mathematics/443-differential-equations`
- `/lessons/data-and-probability/480-box-plot`

Some catalog routes canonicalized internally, but each still rendered the expected lesson content.
