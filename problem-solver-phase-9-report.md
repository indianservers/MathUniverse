# Problem Solver Phase 9 Report

## 1. Summary

Phase 9 adds browser-only graphing and visual verification support to `/problem-solver`. The visual layer supports existing solvers without replacing them: algebra, systems, calculus, and selected expression workflows can now show SVG graphs, markers, intercepts, and tables of values when safe graph data is available.

No online graphing dependency or CDN was added.

## 2. Files Added

| File | Purpose |
| --- | --- |
| `src/problem-solver/graphingUtils.ts` | Safe expression compilation, point sampling, visual-data builders, equation/system/calculus graph metadata. |
| `src/problem-solver/ProblemGraph.tsx` | Local SVG graph and table component with collapsible visual verification UI. |
| `src/problem-solver/valueTable.ts` | Table-of-values generator with undefined-value handling. |
| `src/problem-solver/graphingUtils.test.ts` | Tests for function sampling, unsafe rejection, roots, intersections, and derivative visuals. |
| `src/problem-solver/valueTable.test.ts` | Tests for table values and undefined points. |
| `problem-solver-phase-9-report.md` | Phase 9 implementation and verification report. |

## 3. Files Modified

| File | Change |
| --- | --- |
| `src/pages/StepByStepProblemSolver.tsx` | Adds visual verification section after solver response and graph-focused examples. |
| `src/problem-solver/calculusSolver.ts` | Safely handles simple definite integral inputs such as `integrate x from 0 to 2`. |
| `src/problem-solver/calculusSolver.test.ts` | Adds regression test for simple definite integrals. |

## 4. Graphing Architecture

The graphing layer is local and deterministic:

- Expressions are normalized and compiled only if they use allowed numeric syntax, `x`, and safe math functions.
- Function points are sampled over a default viewport of `x = -10..10`, `y = -10..10`.
- Viewport y-range auto-expands when sampled values exceed the default range.
- Unsafe expressions return no visual instead of attempting evaluation.
- The React component renders SVG axes, grid lines, curves, markers, optional shaded integral area, legend chips, warnings, and a value table.

## 5. Visual Verification Features

| Feature | Example | Status | Notes |
| --- | --- | --- | --- |
| Linear equation intersection | `2x + 5 = 15` | Implemented | Graphs both sides and marks `x = 5`. |
| Quadratic roots | `x^2 - 5x + 6 = 0` | Implemented | Graphs parabola and marks roots `2`, `3`. |
| Function/table support | `factor x^2 - 5x + 6` | Implemented where graphable | Uses expression graph/table when safe. |
| 2x2 system intersection | `solve 2x + y = 7 and x - y = 2` | Implemented | Graphs both lines and marks `(3, 1)`. |
| Derivative comparison | `derivative of x^2` | Implemented | Graphs original function and derivative. |
| Definite integral area | `integrate x from 0 to 2` | Implemented | Shows approximate shaded area and exact simple result. |
| Unsupported/unsafe visual | Complex or unsafe expression | Implemented | No blank graph; visual section is omitted or warning is shown. |

## 6. Table of Values

Graphable functions produce a table of values. Defaults are:

```text
x = -3, -2, -1, 0, 1, 2, 3
```

Equation visuals add known root x-values to the table. Undefined values, such as `1/(x-1)` at `x = 1`, are marked as `undefined`.

## 7. Equation Graph Handling

For equations like `2x + 5 = 15`, the visual layer graphs:

- `y = 2x + 5`
- `y = 15`
- intersection marker at the solver result.

For equations like `x^2 - 5x + 6 = 0`, the visual layer graphs:

- `y = x^2 - 5x + 6`
- root markers at solver roots.

## 8. System Graph Handling

For 2x2 linear systems, the visual layer parses each line into `y = mx + b` form when possible, graphs both lines, and marks the solution from the systems solver.

Example:

```text
solve 2x + y = 7 and x - y = 2
```

The visual marks `(3, 1)`.

## 9. Calculus Visual Handling

Derivative visuals graph the original function and derivative when both are safe to evaluate.

Definite integral visuals are supported for simple inputs with bounds, such as:

```text
integrate x from 0 to 2
```

The visual shades approximate area under the curve. The calculus solver now also returns the exact simple result `2` for this case.

Indefinite integrals do not shade area; they can show the integrand graph when safe.

## 10. Test Results

Command run:

```bash
npm test -- graphingUtils valueTable calculusSolver matrixSolver statisticsSolver systemSolver expressionOperationSolver algebraStepSolver problemClassifier symbolic
```

Result: 10 test files passed, 118 tests passed.

Command run:

```bash
npm run typecheck
```

Result: passed.

## 11. Manual Browser Verification

Manual browser verification was performed at `http://localhost:3526/problem-solver`.

| Input | Verified Browser Behavior |
| --- | --- |
| `2x + 5 = 15` | Shows algebra steps, SVG visual section, table of values, and intersection marker. |
| `x^2 - 5x + 6 = 0` | Shows parabola visual, table of values, and root markers. |
| `solve 2x + y = 7 and x - y = 2` | Shows two-line visual and intersection `(3, 1)`. |
| `derivative of x^2` | Shows derivative result `2x` and visual comparison graph. |
| `integrate x from 0 to 2` | Shows result `2`, visual section, table, and shaded area support. |

No console errors or warnings were observed during visual verification. Previous solver categories remain covered by the focused regression suite.

## 12. Before vs After

| Input | Previous Behavior | Phase 9 Behavior |
| --- | --- | --- |
| `2x + 5 = 15` | Algebra steps only. | Algebra steps plus visual intersection. |
| `x^2 - 5x + 6 = 0` | Algebra steps only. | Algebra steps plus parabola roots. |
| `solve 2x + y = 7 and x - y = 2` | System steps only. | System steps plus two-line intersection graph. |
| `derivative of x^2` | Derivative steps only. | Derivative steps plus function/derivative comparison. |
| `integrate x from 0 to 2` | Not safely handled as a definite integral. | Exact simple result `2` plus shaded area visual support. |

## 13. Risk Review

- No unrelated modules changed.
- Previous phases still work according to focused regression tests.
- No online graphing/CDN dependency was added.
- Graphing is local SVG and safe expression compilation rejects unsupported expressions.
- Visual support is additive and does not replace solver output.

## 14. Known Limitations

- Graphing is approximate visual support, not symbolic proof.
- Complex functions may not graph safely.
- Advanced 3D and multivariable graphs are not included.
- Tangent-line drawing at a specific point is not fully implemented yet.
- Definite integral visualization is limited to simple bounded forms.

## 15. Recommended Phase 10

Phase 10 should implement Wolfram Alpha Style Workspace polish: multi-card result layout, assumptions, alternate methods, related concepts, printable solution report, examples library, and final UI refinement.
