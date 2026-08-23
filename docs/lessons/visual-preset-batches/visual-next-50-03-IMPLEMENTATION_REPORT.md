# Visual Preset Rollout - Next 50 Pass 03

Status: implemented and smoke-tested.

## Scope

- Completed `visual-batch-11` rows 4-30.
- Completed `visual-batch-12` rows 1-23.
- Total lessons advanced in this pass: 50.
- Next cursor: resume at `visual-batch-12` row 24, lesson `92-algebra-tiles`.

## Implementation Notes

- Strengthened `NumberLessonAdapter` so every number, fraction, decimal, ratio, percentage, and scale lesson from IDs 57-91 exposes a lesson-specific visual cue in the live surface.
- Added missing lesson-specific language for `75-fraction-models` and `88-percentages`, removing the generic number fallback for this rollout range.
- Kept the existing reusable CAS/data and number manipulative engines; this pass only added exact per-lesson parameters/text where the live surface needed clearer distinction.

## Validation

- `npx vitest run src/modules/lessons/adapters/AlgebraLessonAdapter.test.tsx src/modules/lessons/adapters/NumberLessonAdapter.test.tsx --reporter=dot`
- `npx eslint src/modules/lessons/adapters/NumberLessonAdapter.tsx src/modules/lessons/adapters/NumberLessonAdapter.test.tsx --max-warnings=0`

## Browser Smoke

- `/lessons/core-workspaces/24-animation-controls`
- `/lessons/core-workspaces/35-piecewise-definitions`
- `/lessons/numbers-and-arithmetic/57-natural-numbers`
- `/lessons/numbers-and-arithmetic/63-complex-numbers`
- `/lessons/numbers-and-arithmetic/68-prime-factorisation`
- `/lessons/numbers-and-arithmetic/75-fraction-models`
- `/lessons/numbers-and-arithmetic/88-percentages`
- `/lessons/numbers-and-arithmetic/91-scale-drawings`

All checked routes rendered their expected `lesson-live-surface` lesson-specific snippets.
