# Studio control repair audit — 8 September 2026

Reviewed 12 entrypoints: Algebra, Calculus, Trigonometry, Geometry, Probability and Statistics, Linear Algebra, Discrete World, Complex Numbers, Mathematical Modelling, Project Center, and the 2D and 3D graphing tools.

## Repairs

- Replaced nine Algebra lab scaffolds with computed models and working actions, covering 42 selectable modes. Added functional help, display settings, theme switching, grading, CAS operations, proof steps and signed numeric entry.
- Replaced Geometry accuracy exercises and theorem demonstrations with distinct examples, answers, constructions and working controls. Corrected solid geometry and measurements, added selectable planar nets, and repaired circle placement, annulus controls and tangent orientation. Removed fabricated minimum progress.
- Connected Trigonometry playback to changing model values.
- Made Linear Algebra, Discrete World, Algebra, Geometry and Modelling mode selection survive reload and browser navigation. Invalid regular expressions now show an error rather than silently using a different expression.
- Corrected Modelling calculations and shared parameter restoration. Comparison data stays fixed while fitting parameters change.
- Made Project Center restore saved projects and shared links, update titles through undo/redo, and report save/copy outcomes.
- Made shared slider locks disable editing and scoped keyboard undo to the focused slider. Added share/copy feedback and failure handling.

## Verification

- 33 desktop Playwright checks passed, including 16 route smoke checks and functional interactions. A separate phone check passed at 390 × 844; two Algebra checks were rerun after the final numeric-input change and passed.
- 96 unit tests across 25 files passed.
- Focused TypeScript check passed: `npx tsc -p tests/studios/tsconfig.json --pretty false`.
- ESLint passed for the changed studio components and browser tests.
- A source scan followed relative imports through 167 files and found no remaining native buttons/selects/inputs without an interaction handler, excluding disabled, read-only, submit and spread-prop controls. This is a structural check, not proof of every possible interaction.
- Browser logs, scan results and inspected phone screenshots are in `artifacts/studio-control-audit/`.

Run browser checks against a local development server with `PLAYWRIGHT_TEST_BASE_URL` set to its URL, then `npx playwright test tests/studios/studioControls.e2e.ts --workers=1`.

## Remaining validation limitations

The full application TypeScript check fails in unrelated lesson/visual-proof files. A production Vite build also fails on an unclosed bracket in `src/modules/lessons/adapters/RangeLesson474.css`. These issues prevent a passing whole-application build claim. Concurrent lesson work was preserved. The checks above cover the repaired behaviors and studio entrypoints; they do not certify every mathematical input or every browser/device combination.
