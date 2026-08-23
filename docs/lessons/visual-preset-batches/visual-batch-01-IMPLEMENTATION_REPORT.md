# Visual Batch 01 Implementation Report

Status: implemented and smoke-tested.

## Scope

- Batch: visual-batch-01
- Lesson count: 30
- Domain: Calculus
- Engine: reusable 2D graph + CAS adapter
- Preset registry: `src/modules/lessons/presets/calculusVisualPresets.ts`

## Implemented

- Added exact lesson visual presets for calculus lesson IDs 277-305 and 310.
- Each preset defines expression, viewport, default x/h values, mode, labels, guide copy, highlighted x-values, asymptote/end-behavior markers where needed, and output labels.
- Updated the calculus lesson adapter to use preset parameters before title fallback.
- Added direct graph click and drag interaction for the calculus graph workspace.
- Kept sliders as linked controls, with x ranges driven by each lesson viewport.
- Rendered accumulation visuals for Fundamental Theorem using rectangles instead of the generic secant model.
- Preserved the tabbed lesson layout so Interaction + visualization, Explain, Examples, Formulas, and Know more swap in place.
- Removed visible Learning progress and Phase labels from the lesson shell.

## Live Browser Smoke Evidence

Representative routes checked:

- `/lessons/calculus/298-local-and-global-extrema?v_x=-2.08&v_h=1` rendered `4-x^2`.
- `/lessons/calculus/277-informal-limits` rendered `sin(x)/x`.
- `/lessons/calculus/287-tangent-line` rendered `x^2-2*x+1`.
- `/lessons/calculus/310-fundamental-theorem` rendered `x^2`.

Observed behavior:

- The four sample lessons exposed different graph aria labels and visible point labels.
- Interaction tab was present as a real tab.
- Examples/Formulas selection hid the interaction graph.
- Learning progress and Phase labels were not present in the rendered page text.
- Direct graph click changed x from `-2.1` to `2.5`.
- Direct graph drag changed the x control again after the click.

Note: browser automation reports scroll when it starts at the very top because it first scrolls the tab bar into clickable view. The app tab handler now prevents focus anchoring and restores scroll during tab panel swaps.

## Validation

- `npx eslint src/modules/lessons/components/LessonShell.tsx src/modules/lessons/presets/calculusVisualPresets.ts src/modules/lessons/adapters/CalculusLessonAdapter.tsx --max-warnings=0`
- `npx vitest run src/modules/lessons/adapters/CalculusLessonAdapter.test.tsx --reporter=dot`
- `npm run typecheck -- --pretty false`

## Next Batch Recommendation

Start visual-batch-02 with the next calculus/integral lessons, keeping the same contract:

- no title-only fallback for batch lessons
- exact expression or geometric object per lesson
- route smoke test across at least four representative lessons
- direct interaction check for the active engine
