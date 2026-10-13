# Systems of Equations dashboard

Rebuilt `/algebra/systems` around the five layouts in the supplied dashboard reference. The mode query parameter continues to select Graphing, Substitution, Elimination, Matrices or Inequalities.

| Mode | Layout and working controls |
| --- | --- |
| Graphing | Editable equations, grid/labels/intersection/animation options, draggable lines and slope handles, zoom, solution classification and next-method buttons |
| Substitution | Variable selection, progressive solution steps, verification in every equation and a key-idea card |
| Elimination | Add/subtract/multiply-and-add selection, progressive derivation, translucent equation planes and a different-coefficients example |
| Matrices | Coefficients and constants, augmented matrix, RREF, inverse/determinant tools, solution and glass matrix visualization |
| Inequalities | Editable comparisons, clipped common region, strict dashed boundaries, boundary/color/shading options and point testing |

Every mode uses the same equations. Up to four equations/inequalities can be entered. Edits, graph drags, resets and undo/redo use the existing studio figure history. Added equations are checked for consistency rather than silently ignored. Mobile panels stack into one column.

The default equations are `y=2x+1` and `y=−x+4`, with solution `(1,3)`. The coefficient matrix uses mathematically consistent signs: `[[2,−1],[1,1]]` with constants `[−1,4]`. Elimination yields `3x=3`. The default inequalities do not contain `(0,0)`; `(0,2)` satisfies both. Some arithmetic and sign details in the supplied reference are corrected in the working implementation.

## Validation

- 17 targeted mathematical tests pass, covering default solutions, dependent/inconsistent/extra equations, editing syntax, strict boundaries and common-region clipping.
- Both dashboard browser tests pass: all five desktop/mobile layouts, editing, progressive steps, verification, matrix calculations, inequality point tests and extra-equation consistency.
- Targeted ESLint passes.
- The final student production build passes. All five modes also load in the built app without runtime errors.
- The repository type check reports 127 existing errors and no diagnostics in the new Systems dashboard/math files or the modified Algebra lab wrapper.
- A wider existing Algebra controls test fails before reaching Systems because the Expressions page lacks the old `x coefficient` selector. That unrelated test failure is not claimed fixed.
- Five preview images are saved under `artifacts/systems-dashboard-*.png`.
