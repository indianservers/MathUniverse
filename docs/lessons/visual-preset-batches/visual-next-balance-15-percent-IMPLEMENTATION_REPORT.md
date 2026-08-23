# Visual Next Balance 15 Percent Implementation Report

Status: implemented and smoke-tested.

Scope:
- Remaining rollout balance before this pass: 607 lessons.
- Implemented next 15 percent of balance: 91 lessons.
- Completed visual-batch-08 rows 3-30.
- Completed visual-batch-09 rows 1-30.
- Completed visual-batch-10 rows 1-30.
- Started visual-batch-11 through row 3.

Implemented:
- Confirmed coordinate geometry lesson 182 uses the reusable 2D geometry guidance preset.
- Confirmed vector lessons 183-197 use vector-specific visual and measurement guidance.
- Confirmed dynamic geometry lessons 198-240 use construction-specific reusable 2D geometry guidance.
- Confirmed transformation and loci lessons 241-256 use transformation/loci-specific reusable 2D geometry guidance.
- Confirmed trigonometry lessons 257-259, 267-268, and 272 use linked angle/unit-circle/trig guidance.
- Confirmed Frequency Polygon uses statistics-specific data and graph guidance.
- Confirmed Reset Construction and Construction Challenge use authoring-specific visual guidance.
- Confirmed Proof Methods uses discrete proof-specific interactive guidance.
- Confirmed school theorem/CAS rows for Remainder Theorem, Factor Theorem, Total Probability Theorem, Bayes' Theorem, and Increasing and Decreasing Functions route to their dedicated proof/school surfaces.
- Confirmed core workspace lessons 20-22 use algebra-linked variable/slider guidance.

Validation:
- `npx vitest run src/modules/lessons/adapters/VectorLessonAdapter.test.tsx src/modules/lessons/adapters/Geometry2DLessonAdapter.test.tsx --reporter=dot`
- `npx vitest run src/modules/lessons/adapters/TrigonometryLessonAdapter.test.tsx src/modules/lessons/adapters/StatisticsLessonAdapter.test.tsx src/modules/lessons/adapters/AuthoringLessonAdapter.test.tsx --reporter=dot`
- `npx vitest run src/modules/lessons/adapters/DiscreteLessonAdapter.test.tsx src/modules/lessons/adapters/AlgebraLessonAdapter.test.tsx src/modules/lessons/components/SchoolProofMiniTool.test.tsx --reporter=dot`

Browser smoke:
- `/lessons/geometry/182-barycentric-coordinates`
- `/lessons/geometry/186-vector-addition`
- `/lessons/geometry/192-vector-projection`
- `/lessons/geometry/205-segment-with-given-length`
- `/lessons/geometry/218-circle-centre-and-point`
- `/lessons/geometry/227-ellipse`
- `/lessons/geometry/241-dilation-from-point`
- `/lessons/geometry/249-moving-linkage-loci`
- `/lessons/trigonometry/257-angle-measurement`
- `/lessons/data-and-probability/484-frequency-polygon`
- `/lessons/authoring-and-learning-system/630-reset-construction`
- `/lessons/discrete-and-applied-mathematics/590-proof-methods`
- `/lessons/school/class-12/class-12-probability-total-probability-theorem`
- `/lessons/school/class-12/class-12-formal-calculus-increasing-and-decreasing-functions`
- `/lessons/core-workspaces/22-integer-sliders`

Next batch recommendation:
- Continue visual-batch-11 from row 4 through row 30.
- Then continue into visual-batch-12 for the next numbered block.
