# Math Concepts Premium Upgrade Roadmap

## Purpose
This roadmap updates the Math Concepts Premium Upgrade Program around the rule: **Existing -> Upgrade, Partial -> Extend, Missing -> Create Safely**. This run is planning-only: no app behavior, routes, visualizers, or backend/server code are changed.

## Existing App Inventory Inspected
- Routes: `src/App.tsx`
- Navigation: `src/components/layout/navItems.ts`
- Topics and syllabus: `src/data/topics.ts`, `src/data/syllabus.ts`, `src/data/unitUpgradePlan.ts`
- Geometry data: `src/data/geometryConcepts.ts`
- Formula data: `src/data/formulaData.ts`, `src/data/formulaLibrary.ts`
- Math Lab tools: `src/data/mathLabTools.ts`
- Reusable UI/components: `src/components/ui/*`, `src/components/charts/*`, `src/components/calculator/*`, `src/components/math-lab/*`, `src/components/quiz/*`
- Visualizers: `src/visualizations/algebra/*`, `src/visualizations/geometry/*`, `src/visualizations/linear-algebra/*`, `src/visualizations/trigonometry/*`, `src/visualizations/calculus/*`
- Problem solver: `src/problem-solver/*`
- Workspaces: `src/workspace/*`, `src/pages/Workspace*.tsx`
- Visual proofs: `src/visual-proofs/*`
- Progress hooks: `src/hooks/useProgress.ts`, `src/hooks/useLocalStorage.ts`

## Preservation Rules
- If a route/component exists, upgrade it; do not create a duplicate.
- If coverage is partial, extend found pieces and reuse helpers.
- If a concept is missing, create a new browser-only module only after documenting no suitable route/file exists.
- Preserve existing routes, navigation, progress, quizzes, visual proofs, workspaces, and fallback UI.
- Keep all concept upgrades frontend-only.

## Concept Classification Table
| Concept | Current Status | Existing Route/File Found | Decision | Priority | Risk |
| --- | --- | --- | --- | --- | --- |
| Number Sense / Counting Blocks / Place Value | Partial | `/number-systems`; `src/pages/NumberSystems.tsx`; `src/data/syllabus.ts`; `src/pages/FormulasWorkspace.tsx`; `src/visual-proofs/proofs/number-theory/*`; Phase A: `MATH_01_NUMBER_SENSE_PHASE_A_AUDIT_DESIGN.md` | Extend | High | Medium |
| Arithmetic Operations | Partial | `/calculator`; `/magic-maths`; `/problem-solver`; `src/components/calculator/*`; `src/utils/calculator.ts` | Extend | High | Medium |
| Fractions | Partial | `/ncert/class-7-fractions-decimals`; `/number-systems`; `src/components/layout/navItems.ts`; `src/data/syllabus.ts` | Extend | High | Medium |
| Decimals and Percentages | Partial | `/ncert/class-7-fractions-decimals`; `/ncert/class-7-comparing-quantities`; `src/data/syllabus.ts`; `src/data/unitUpgradePlan.ts` | Extend | High | Medium |
| Ratios and Proportions | Partial | `/geometry/similar-triangles`; `/geometry/trig-in-geometry`; `/trigonometry/right-triangle-ratios`; `src/data/geometryConcepts.ts` | Extend | High | Medium |
| Linear Equations | Existing | `/algebra`; `src/visualizations/algebra/LinearEquationVisualizer.tsx`; `src/problem-solver/algebraStepSolver.ts` | Upgrade | High | Medium |
| Systems of Equations | Existing | `/algebra`; `src/visualizations/algebra/SimultaneousEquationsVisualizer.tsx`; `src/problem-solver/systemSolver.ts`; `/matrices/linear-equations` | Upgrade | High | Medium |
| Quadratic Equations | Existing | `/algebra`; `src/visualizations/algebra/QuadraticEquationVisualizer.tsx`; `src/problem-solver/algebraStepSolver.ts` | Upgrade | High | Medium |
| Functions and Graphs | Existing | `/math/functions-graphs`; `/math-lab/function-explorer`; `/workspace/graph`; `src/components/math-lab/FunctionGraphCanvas.tsx` | Upgrade | High | High |
| Polynomials and Algebraic Identities | Partial | `/ncert/class-10-polynomials`; `/visual-proofs/algebraic-identities`; `src/visual-proofs/proofs/algebra/*`; `src/data/formulaData.ts` | Extend | Medium | Medium |
| Coordinate Geometry | Existing | `/geometry/coordinate-geometry`; `/visual-proofs/coordinate-geometry`; `src/visual-proofs/proofs/coordinate-geometry/*` | Upgrade | Medium | Medium |
| Geometry Basics | Existing | `/geometry`; `/workspace/geometry`; `src/data/geometryConcepts.ts`; `src/workspace/geometry2dKernel.ts` | Upgrade | High | High |
| Circles | Existing | `/geometry/circles`; `/geometry/arcs-sectors`; `/geometry/tangents`; `src/visualizations/geometry/CircleExplorer.tsx` | Upgrade | Medium | Medium |
| Mensuration / Area / Volume | Existing | `/shapes`; `/geometry/area-perimeter`; `/geometry/mensuration-3d`; `/geometry/surface-area-volume`; `src/pages/ShapesExplorer.tsx` | Upgrade | Medium | Medium |
| Probability and Statistics | Existing | `/probability-statistics`; `/statistics`; `/math-lab/probability`; `src/utils/mathEngine/probabilityUtils.ts`; `src/utils/mathEngine/statisticsUtils.ts` | Upgrade | High | Medium |

## Extra Suitable Modules Found
Future batches can include calculus, vectors, matrices, complex numbers, combinatorics, sequences/series, graph theory, set theory, mathematical logic, conics, Fourier series, polar coordinates, and engineering mathematics.

## Two-Phase Rule
Every concept uses only:
- Phase A: Audit + Upgrade/Create Design
- Phase B: Implementation + Testing + Re-audit

## Shared Premium Standards
Every upgraded or created concept should include interactive visual models, drag/click fallback, snap zones, sliders, live values, formula builders, visual proof links, check/submit feedback, instant correction, progressive hints, misconception boxes, beginner/professor modes, responsive design, reduced-motion support, helper tests, no `NaN`/raw `Infinity`, and route verification.

## Recommended First Phase B
Start with **Number Sense / Counting Blocks / Place Value** because it is foundational, current coverage is partial, and it can extend `/number-systems` safely without duplicating routes.

## Concept 01 Phase A Status
- Classification: Partial — extend current pieces.
- No dedicated Number Sense / Place Value route was found.
- Recommended Phase B scope: extend `/number-systems` with `NumberSenseVisualizer`, counting cubes, ten-frame, base-ten blocks, place-value chart, regrouping, comparison, number line, practice/check/hints, click/keyboard fallback, and tests.
- Main Phase A file: `MATH_01_NUMBER_SENSE_PHASE_A_AUDIT_DESIGN.md`.
- Key risk: preserve existing rational, irrational, real-line, 3D, concept, NCERT, progress, calculator, and visual-proof behavior while adding primary-number-sense scenes.
