# Functions & Transformations reference dashboards

Rebuilt all five `/algebra/functions` modes from the supplied October 12 screenshots: Families, Transformations, Composition, Inverse, and Piecewise. The common studio navigation and global assistant remain part of the app shell.

The new dashboard uses icy blue backgrounds, navy headings, cyan/violet gradient tabs and buttons, glass panels, colored graph curves, formula cards, numbered explanations, and five pastel learning cards. Desktop controls, graph, and analysis sit side by side; mobile panels stack and editing controls remain visible.

Piecewise includes editable expressions, independently editable intervals, open/closed endpoint ownership, bounded ranges, up to six pieces, add/delete controls, input evaluation, a live graph, piecewise definition, active-piece reasoning, a continuity boundary selector, one-sided limits, and continuity/jump feedback. Overlapping intervals return an ambiguous-output warning; gaps return undefined. The challenge verifies an actual continuous join at x = 2.

Families includes nine parent families, parameter sliders and numeric inputs, transformed formulas, function machines, domains/ranges, and quadratic properties. Transformations adds quick operations, numbered explanations, and a vertex/width challenge. Composition allows independent f and g choices, parameters, order switching, algebraic substitution, evaluation steps, domain guards, and a linked function machine. Inverse includes domain restrictions, right/left branches, reflection points, y = x, an inverse toggle, explanatory tabs, and round-trip evaluation.

The graph supports click/drag input selection, keyboard arrows, grid/point/interval visibility, and zoom. Save persists experiments locally and can restore them after reload. Share copies a URL containing the current experiment; its data is validated when loaded. Fullscreen, reset, undo, and help are connected controls.

The supplied illustration contains several inconsistent graph labels/shapes. The implementation plots the stated mathematics: the piecewise line 1.5x − 1 has y-intercept −1; x² has slope 4 at x = 2; and f(2) for f(x) = 1.5x² is 6. The visual treatment follows the references while displayed values and curves stay consistent.

Implementation: `FunctionsDashboard.tsx`, `FunctionsGraph.tsx`, `functionsDashboardMath.ts`, `functionsDashboard.css`; `FunctionsLab` now renders this dashboard. Styles use a distinct namespace to avoid older global `.functions-dashboard` layouts. The dashboard preserves its integrated panels against the shared lab section filter and mobile control-collapsing rules.

Validation: 16 mathematical tests passed; four desktop/mobile browser tests passed against both the development server and production build, including interval edits, continuity, inverse restrictions, saved experiments, sharing, keyboard graph controls, and challenges. Targeted TypeScript checked the new files and their dependencies with zero errors. Targeted ESLint passed. Production validation is recorded in `tmp/functions-build-final.log`, `tmp/functions-build-release.log`, and `tmp/functions-production.log`.

Screenshots: `artifacts/functions-reference-dashboard-{families,transformations,composition,inverse,piecewise,mobile}.png`. Screenshot exports temporarily remove ancestor scroll clipping; live scrolling retains the app shell's behavior.
