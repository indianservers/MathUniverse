# Problem Solver Audit - Phase 1

## 1. Executive Summary

The `/problem-solver` route is currently a small browser-only algebra solver page backed by Nerdamer through the shared `src/utils/symbolic.ts` helper. It is useful for simple equations in `x`, especially linear and quadratic equations written in parser-friendly notation, and it displays a short generic sequence of steps plus a KaTeX-rendered final answer.

The module is not yet ready for Wolfram Alpha-style solving. It does not classify the user's intent, does not route natural-language prompts such as "derivative of ..." or "mean of ...", does not support multi-variable systems through the UI, and its "steps" are mostly explanatory placeholders around a CAS call rather than actual transformation-by-transformation derivations.

No backend dependency is present or required. The current implementation is fully browser-based and offline-compatible, using React, KaTeX, and Nerdamer.

Temporary Fixes: none. No application code was changed during this audit.

## 2. Files Reviewed

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Defines the lazy route `problem-solver` -> `StepByStepProblemSolver`. |
| `src/pages/StepByStepProblemSolver.tsx` | Main `/problem-solver` page: input state, preset examples, solve/simplify flow, step rendering, final KaTeX output. |
| `src/utils/symbolic.ts` | Shared browser-side symbolic wrapper around Nerdamer for simplify, expand, factor, derivative, integral, limit, substitution, system solving, polynomial division, partial fractions, LaTeX conversion, and equation solving. |
| `src/types/nerdamer.d.ts` | Local Nerdamer TypeScript declaration used by the symbolic utilities. |
| `src/utils/symbolic.test.ts` | Unit coverage for symbolic helper functions, including derivative, integral, limit, systems, substitution, division, and partial fractions. These capabilities exist in the helper but are not exposed by `/problem-solver`. |
| `src/components/ui/UiFeedback.tsx` | Provides toolbar controls used by the page: copy, reset, print, related links, preset chips. |
| `src/components/ui/TopicHeader.tsx` | Shared page header used by the solver page. |
| `src/components/ui/SectionCard.tsx` | Shared section container used by the solver page. |
| `src/components/layout/navItems.ts` | Navigation entries include "Problem Solver" linking to `/problem-solver`. Reviewed from search results only. |
| `src/data/mathLabTools.ts` | Math Lab tool metadata links to `/problem-solver`. Reviewed from search results only. |

## 3. Current Architecture

Routing:

- `src/App.tsx` lazy-loads `StepByStepProblemSolver` with:
  - `const StepByStepProblemSolver = lazy(() => import("./pages/StepByStepProblemSolver"));`
  - `<Route path="problem-solver" element={<StepByStepProblemSolver />} />`

Main component:

- `StepByStepProblemSolver` owns one React state value: `equation`.
- Default input is `2*x+5=17`.
- The page is divided into:
  - `TopicHeader`
  - `Equation Input` section
  - `Animated Algebra Steps` section

Solver flow:

1. User types into a single text input.
2. `useMemo` calls `trySymbolic(() => symbolicSolve(equation, "x"))`.
3. A second `useMemo` computes `symbolicSimplify(...)`, but this is only used if `symbolicSolve` returns `null`.
4. If the input contains `=`, simplification only sees the substring before the first equals sign.
5. Rendered steps are `solution?.steps ?? simplified?.steps ?? fallback`.
6. The final rendered answer only appears when `solution?.result` exists. Simplification results are not rendered as a final answer card.

Parsing:

- All equation solving assumes variable `x`.
- `normalizeSymbolic` removes whitespace and inserts `*` for limited implicit multiplication cases.
- No problem classifier exists.
- No natural language parser exists.
- No command parser exists for prompts such as `derivative of x^3`, `integrate 2x`, `mean of ...`, or `solve ... and ...`.

Rendering:

- Step cards are plain text.
- Final equation result uses `symbolicLatex` and KaTeX.
- There is no graph, table, domain panel, assumptions panel, or alternate-method panel.

State flow:

- Local component state only.
- No Zustand/global workspace state is used by this route.
- Preset chip history is stored by the shared `PresetChips` helper in `localStorage`.
- Copy, print, and share are client-side browser actions.

Libraries used directly or indirectly:

- React: component state and memoization.
- React Router: route rendering and related links.
- Nerdamer: symbolic solve/simplify helpers.
- KaTeX: final result rendering.
- Lucide React: icons through shared UI components.

## 4. Existing Features

- Single-line equation/expression input.
- Auto-updating solve as the input changes.
- Preset examples:
  - `2*x+5=11`
  - `x^2-5*x+6=0`
  - `-2*x+4=8`
  - `x^3+2*x^2`
- Copy result button for equation-solve results.
- Reset example button.
- Print worksheet button.
- Related links to Calculator and Equation Solver.
- Generic step cards.
- KaTeX final answer rendering for symbolic solve output.
- Browser-only symbolic computation through Nerdamer.
- Offline-compatible implementation.

## 5. Existing Step-by-Step Capability

Already implemented:

- A fixed, generic sequence of steps is returned by `symbolicSolve`.
- The steps describe reading the equation, normalizing it, asking the CAS to solve for `x`, showing the exact solution set, and suggesting graph/table verification.
- `symbolicSimplify`, `symbolicDerivative`, `symbolicIntegral`, `symbolicLimit`, and other helpers also provide generic step arrays in `src/utils/symbolic.ts`.

Missing:

- Real algebraic transformations such as subtracting 5 from both sides, dividing by 2, factoring a quadratic, applying the zero-product property, or simplifying rational expressions step by step.
- A problem-type classifier.
- Natural-language command parsing.
- Multi-variable equation system UI.
- Calculus operation UI.
- Statistics operation UI.
- Matrix operation UI.
- Domain restrictions and excluded values.
- Assumptions and variable selection.
- Alternative solution methods.
- Error messages when the input is unsupported.
- Confidence/validity checks for returned solutions.
- Final answer rendering for simplification fallback results.

## 6. Supported Problem Types

| Problem Type | Supported Now | Accuracy | Step-by-Step Available | Notes |
| --- | --- | --- | --- | --- |
| Arithmetic | Partial / weak | Low in this route | Generic only, often misleading | The page tries `symbolicSolve(input, "x")` first, so plain arithmetic like `2+3` is treated as an equation to solve rather than as evaluation. |
| Algebraic simplification | Partial internally, weak in UI | Low to medium | Generic simplify steps only | `symbolicSimplify` exists, but the UI only uses it when equation solving fails. Inputs beginning with words like `simplify` are not parsed as commands. |
| Linear equations | Yes | Good for parser-friendly equations in `x` | Generic only | Works for `2x + 5 = 15` and normalizes implicit multiplication. |
| Quadratic equations | Yes | Good for parser-friendly equations in `x` | Generic only | Works for `x^2 - 5x + 6 = 0`, but does not show factoring or quadratic formula steps. |
| Simultaneous equations | Helper exists, route does not expose it | Low in route | No route-level support | `symbolicSystemSolve` is tested in `symbolic.test.ts`, but `/problem-solver` does not parse `and` or multiple equations. |
| Trigonometry | No route-level trig evaluation | Low | Misleading solve steps | `sin(30)` is converted to `sin(30)=0` and solved for `x`, producing no useful trig evaluation. |
| Calculus | Helper exists, route does not expose it | Low in route | No route-level support | `symbolicDerivative` and `symbolicIntegral` work in helper tests, but the page treats natural-language derivative/integral prompts as equations. |
| Limits | Helper exists, route does not expose it | Not available in route | No route-level support | `symbolicLimit` is tested, but there is no route-level parser or UI. |
| Differentiation | Helper exists, route does not expose it | Low in route | No route-level support | `derivative of x^3 + 2x` is misread as symbols multiplied together. |
| Integration | Helper exists, route does not expose it | Low in route | No route-level support | `integrate 2x` is interpreted as `integrate*2*x=0`. |
| Matrices | No | Not available | No | Matrix pages exist elsewhere, but `/problem-solver` does not support matrix input or routing. |
| Statistics | No | Not available | No | `mean of 4, 6, 8, 10` is not recognized. |
| Word problems | No | Not available | No | No NLP, entity extraction, equation formation, or explanation pipeline. |

## 7. Test Results

Manual browser test target: `http://localhost:3526/problem-solver`

Console errors during these tests: none captured.

| Input | Current Output | Correct? | Steps? | Issues |
| --- | --- | --- | --- | --- |
| `2x + 5 = 15` | Final answer renders as `x = 5`; steps include normalized form `2*x+5=15` and exact solution set `[5]`. | Yes | Yes, generic | Steps do not show subtract 5 then divide by 2. |
| `x^2 - 5x + 6 = 0` | Final answer renders as `x = 2, 3`; steps include exact solution set `[2,3]`. | Yes | Yes, generic | No factoring, zero-product rule, discriminant, graph, or domain explanation. |
| `simplify (x^2 - 1)/(x - 1)` | Treated as equation `simplify(x^2-1)/(x-1)=0`; final answer `x = -1`. | No | Yes, but wrong task | Should simplify to `x + 1` with restriction `x != 1`; current output solves the numerator-like condition and ignores command intent. |
| `derivative of x^3 + 2x` | Treated as `derivativeofx^3+2*x=0`; final answer resembles `x = (-1/2)*derivativeofx^3`. | No | Yes, but wrong task | No derivative parser. Expected derivative is `3x^2 + 2`. |
| `integrate 2x` | Treated as `integrate*2*x=0`; final answer `x = 0`. | No | Yes, but wrong task | No integration parser. Expected antiderivative is `x^2 + C`. |
| `sin(30)` | Treated as `sin(30)=0`; final answer renders as `x = no symbolic solution`. | No | Yes, but misleading | Should evaluate trig expression, but route attempts to solve for `x`. Also degree/radian assumption is not stated. |
| `solve 2x + y = 7 and x - y = 2` | Solve fails, then simplification fallback uses only text before first `=`: `solve 2x + y`; output `2*solve*x+y`. | No | Simplify steps only, wrong task | Multiple equations are not parsed. The `equation.split("=")[0]` fallback discards most of the input. |
| `mean of 4, 6, 8, 10` | Simplification output `(4*meanof,6,8,10)`. | No | Simplify steps only, wrong task | No statistics parser. Expected mean is `7`. |

## 8. Bugs / Errors Found

- Natural-language commands are not recognized:
  - `simplify ...`
  - `derivative of ...`
  - `integrate ...`
  - `solve ... and ...`
  - `mean of ...`
- The route always attempts `symbolicSolve(input, "x")` before any task classification.
- Plain expressions and trig calls can produce misleading "solve for x" results.
- Simplification fallback for any input containing `=` only uses `equation.split("=")[0]`, which breaks simultaneous-equation text and discards important input.
- Simplification fallback results are displayed only as steps, not as a final answer card.
- Copy result is tied to `solution?.result`, so simplification fallback output cannot be copied.
- `symbolicSolve` formats an empty Nerdamer result as `x = no symbolic solution`; KaTeX then renders "no symbolic solution" as multiplied symbols.
- Step labels say "Animated Algebra Steps", but the steps are static cards and not animated.
- The page title and subtitle promise "step-by-step" and "algebraic path", but most steps are generic CAS wrapper explanations.
- Console errors: none captured during the required manual tests.

## 9. Gaps Compared to Wolfram Alpha Style Solver

- No problem-type classification.
- No intent parser for solve, simplify, factor, expand, derivative, integral, limit, evaluate, matrix, statistics, or word-problem tasks.
- No symbolic parse preview.
- No exact transformation steps.
- No alternative solution methods.
- No graph support attached to equation solving.
- No assumptions panel.
- No domain restrictions or excluded-value reporting.
- No simplification-step explanations.
- No final answer formatting by problem type.
- No educational explanations tied to each algebra/calculus rule.
- No variable selector.
- No exact/numeric toggle.
- No support for multi-line input.
- No support for systems of equations in the route, despite helper support.
- No validation/substitution check of answers.
- No radians/degrees toggle for trigonometry.
- No matrix/statistics/word-problem solvers.
- No graceful unsupported-input state with suggestions.

## 10. Risk Areas

Files and features to avoid disturbing:

- `src/utils/symbolic.ts` is shared outside `/problem-solver`, including workspace logic and tests. Changes here can affect other modules.
- `src/components/ui/UiFeedback.tsx`, `TopicHeader.tsx`, and `SectionCard.tsx` are shared globally. Do not modify them for solver-specific behavior.
- `src/App.tsx` routing is global. Only touch it if adding nested solver routes is required in a later phase.
- `src/pages/MathWorkspace.tsx` has separate solver/CAS behavior and should not be used as the implementation surface for `/problem-solver`.
- `src/pages/MathLabCasNotebook.tsx` and `src/utils/mathEngine/*` contain adjacent math capabilities; do not refactor them in this module-focused effort unless a later phase explicitly introduces a narrowly scoped reusable parser.
- Navigation metadata such as `src/components/layout/navItems.ts` and `src/data/mathLabTools.ts` should remain stable unless labels or route names change.

Module-specific files that are safer to evolve:

- `src/pages/StepByStepProblemSolver.tsx`
- New files under a future solver-specific folder such as `src/problem-solver/*` or `src/utils/problemSolver/*`
- New tests scoped to problem-solver classification and rendering.

## 11. Recommended 10-Phase Roadmap

| Phase | Goal | Scope |
| --- | --- | --- |
| 1 | Audit current state | This report only. No feature changes. |
| 2 | Add problem classifier and safe result model | Create a route-local classifier for solve/simplify/evaluate/derivative/integral/limit/system/statistics/unsupported. Add tests. |
| 3 | Improve algebra solve steps | Implement deterministic linear and quadratic step builders before delegating to CAS fallback. |
| 4 | Add simplify/factor/expand workflows | Route explicit simplification commands to symbolic helpers and show final answer plus restrictions where possible. |
| 5 | Add calculus workflows | Expose derivative, integral, and limit helpers with operation-specific steps and final formatting. |
| 6 | Add systems of equations | Parse two-equation systems, call `symbolicSystemSolve`, show substitution/elimination style steps for 2x2 linear cases. |
| 7 | Add arithmetic, trig, and statistics evaluation | Add expression evaluation, degree/radian controls, mean/median/range/variance basics, and clear assumptions. |
| 8 | Add validation and visual supports | Add answer checks, substitution verification, small graph previews for equations/functions, and domain warnings. |
| 9 | Add educational explanation mode | Add rule explanations, common mistakes, alternate methods, and "why this step works" panels. |
| 10 | Add word-problem scaffolding | Add browser-only templates for common word-problem classes that extract quantities and build equations without backend NLP. |

## 12. Phase 2 Recommendation

Phase 2 should implement a solver-specific problem classifier and typed result model inside the Problem-Solver module only.

Recommended next implementation:

- Add a local classifier, for example `src/problem-solver/problemClassifier.ts`.
- Classify inputs into:
  - `linear-equation`
  - `quadratic-equation`
  - `simplify`
  - `evaluate`
  - `derivative`
  - `integral`
  - `limit`
  - `system`
  - `statistics`
  - `unsupported`
- Add a typed result shape:
  - `kind`
  - `normalizedInput`
  - `result`
  - `steps`
  - `warnings`
  - `assumptions`
  - `canCopy`
- Update `StepByStepProblemSolver.tsx` to call this route-local classifier before invoking `symbolicSolve`.
- Add tests for the eight audit inputs before changing UI design.

This phase would fix the largest correctness issue: the page currently treats most inputs as equations in `x`, which creates wrong but confident-looking results.
