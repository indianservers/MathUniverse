# Visual Next 50 Implementation Report

Status: implemented and smoke-tested.

## Scope

- Batch coverage: visual-batch-02 rows 1-30, visual-batch-03 rows 1-20.
- Lesson count: 50.
- Domains: Integral Calculus and Differential Equations, 2D Graphing Calculator, Functions.
- Engines: reusable 2D graph engine, calculus graph + CAS adapter.
- Preset registries:
  - `src/modules/lessons/presets/calculusVisualPresets.ts`
  - `src/modules/lessons/presets/graphVisualPresets.ts`

## Implemented

- Added 27 calculus presets for lessons 306-333, excluding the already completed lesson 310.
- Added 23 graph/function presets for lessons 39-56, 129-132, and 153.
- Extended the reusable 2D graph engine with per-lesson viewport, slider labels/ranges/defaults, graph kind, visual labels, and lesson-aware aria labels.
- Updated graph lessons to prefer exact lesson visual presets before title fallback.
- Updated calculus lessons so explicit visual preset modes control whether the lesson renders secant/point work or accumulation rectangles.
- Hardened graph fallback guidance for the function transformation cluster so title variants such as Vertical Translation, Reflection in x-Axis, Transformation Order, Parent-Function Library, and Graph Matching render lesson-specific guidance.

## Representative Routes

- `/lessons/calculus/306-area-by-rectangles`
- `/lessons/calculus/309-indefinite-integral`
- `/lessons/calculus/327-logistic-growth`
- `/lessons/graphs-and-functions/41-equation-grapher`
- `/lessons/graphs-and-functions/44-polar-graphs`
- `/lessons/graphs-and-functions/130-domain-and-range`

Browser smoke evidence:

- Area by Rectangles rendered lesson-specific rectangle language and `rectangle sum`.
- Indefinite Integral rendered `3*x^2+2` and antiderivative language.
- Logistic Growth rendered `8/(1+3*exp(-x))` and carrying-capacity language.
- Equation Grapher rendered `x^2+y^2=a^2`, solution-set language, and an aria label for the equation graph.
- Polar Graphs rendered `r=a*sin(3*theta)`, rose-curve language, and an aria label for the polar graph.
- Domain and Range rendered `sqrt(x+a)+b`, domain-start language, and an aria label for the square-root graph.
- All six representative routes avoided visible `Learning progress` and `Phase` text.

## Validation

- `npx vitest run src/modules/lessons/adapters/CalculusLessonAdapter.test.tsx src/modules/lessons/adapters/GraphLessonAdapter.test.tsx --reporter=dot`
- `npx eslint src/modules/lessons/components/ReusableLessonEngine.tsx src/modules/lessons/adapters/GraphLessonAdapter.tsx src/modules/lessons/adapters/CalculusLessonAdapter.tsx src/modules/lessons/presets/graphVisualPresets.ts src/modules/lessons/presets/calculusVisualPresets.ts --max-warnings=0`
- `npm run typecheck -- --pretty false`

## Next Batch Recommendation

Continue with visual-batch-03 rows 21-30, then move into visual-batch-04. Prioritize the remaining Functions lessons because the repeated generic graph issue is most visible there.
