# Equations & Inequalities reference dashboard

Implemented the four supplied October 12 references in `/algebra/equations`: Linear, Quadratic, Absolute Value, and Inequalities. The existing app navigation and global learning assistant remain available.

The dashboard includes a calculator heading, gradient mode tabs, compact desktop panels, responsive mobile stacking, original/current expressions, editable coefficients, expression parsing, goal selection, quadratic method selection, a glowing SVG scale with dynamic colored tiles, a values toggle, a quadratic graph, guided step replay, four arithmetic operations, editable operands, undo, reset, auto-balance exploration, adaptive number lines, exact rational labels, solution validation, five pastel learning cards, new problems, and checked challenges. State is preserved separately for each mode.

The scale is a symbolic teaching model. Its help explains that the expressions satisfy equality at a solution. Labels describe equivalence rather than claiming arbitrary expressions have equal numerical weights.

Both sides are represented explicitly, including quadratic terms. Absolute-value operations apply outside the bars. Negative scaling reverses inequalities. Zero scales and variable divisors are rejected. One-sided exploration is marked as potentially changing the solution set. Quadratic parsing includes the right-hand side. Strict and inclusive number-line boundaries remain distinct, and inequality challenges require the complete solution set.

Reference results: linear x = −6; quadratic x = −1 or −2/3; absolute value with negative right side has no real solution; inequality x > −2.

Source: `EquationsLab.tsx`, `equationsDashboard.css`, `equationsDashboardMath.ts`. New mathematical tests cover reference results, reversible transformations, signed subtraction, inequality reversal, absolute transformations, zero operands, quadratic normalization, degenerate cases, one-sided changes, and challenge checking. Browser tests cover all four modes on desktop/mobile plus operation controls, history, replay, edits, and validation.

Screenshots: `artifacts/equations-dashboard-linear.png`, `equations-dashboard-quadratic.png`, `equations-dashboard-absolute-value.png`, `equations-dashboard-inequalities.png`, and `equations-dashboard-mobile.png`.

Validation: 13 mathematical tests passed, both dashboard browser tests passed, targeted ESLint passed, and the production build passed. The existing repository-wide TypeScript check previously reported 127 unrelated errors; the two new full-check attempts were stopped after unusually long runtimes, so this update does not claim a clean repository-wide typecheck. Mobile layout screenshots temporarily remove the app's enclosing scroll-container clipping for export; the live layout retains its normal scroll behavior.
