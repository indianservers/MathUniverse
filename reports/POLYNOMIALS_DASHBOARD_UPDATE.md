# Polynomials reference dashboards

Rebuilt all five `/algebra/polynomials` modes using the supplied October 12 illustrations: Roots, Factors, Division, End Behavior, and Multiplicity.

The dashboard follows the reference's cyan/blue active tabs, navy typography, glass panels, colored root rows, orange root handles, pale grid, formula bars, copy buttons, gear controls, degree buttons, three-column desktop layout, pastel learning cards, and planet header artwork. Mode icons include the radical, cube, division sign, rising arrow, and three-ring multiplicity symbol. Mobile panels stack with editing controls visible.

Multiplicity includes independent root and multiplicity editors, merged repeated-root analysis, actual-degree reporting, odd/even crossing behavior, colored callouts, and matching arrows. Roots supports degree presets, numeric root editing, deletion, keyboard/mouse dragging, and root tables. Factors includes grouped factors, expanded form, coefficients and zeros. Division supports a linear root divisor or a custom polynomial divisor, quotient/remainder coefficients and formulas, the division identity, remainder theorem, and expandable steps. End Behavior includes both endpoint arrows, positive/negative parity cases, and constant/zero exceptions.

Other controls include leading coefficient, zoom fit, grid/label/annotation toggles, undo, reset, formula copying, help and mode-specific challenges. The shared app navigation and existing assistant remain available. Scoped integration keeps these panels visible within the lab shell and avoids its mobile control-collapsing rule.

The formula, graph and analysis use the same root factors. Equal root values merge their multiplicities. Multiplicity increases actual degree; degree buttons explicitly load simple-factor presets. A zero leading coefficient is treated as the zero polynomial, whose isolated-root multiplicities and degree are undefined.

Reference mathematics corrected: the stated default factors expand to `0.08x^4 − 0.16x^3 − 1.04x² + 1.12x + 1.92`. The quotient upon division by `x + 1` is `0.08x³ − 0.24x² − 0.8x + 1.92`, with remainder 0. The curve plots that actual polynomial rather than the inconsistent vertical scaling/coefficient expansion in some illustrations.

Custom divisors use a structural polynomial parser, accepting parentheses, implicit multiplication, decimal coefficients, constant division, and integer powers through degree 8. Non-polynomial functions, variable denominators, negative/fractional powers and zero divisors are rejected. Long division computes a quotient and a lower-degree remainder and records steps.

Implementation: `PolynomialsDashboard.tsx`, `PolynomialsGraph.tsx`, `polynomialsDashboardMath.ts`, `polynomialsDashboard.css`. `PolynomialsLab` now renders this dashboard.

Validation: 13 mathematical tests cover the reference coefficients/quotient, repeated roots, multiplicity behavior, division identities, custom parsing, all endpoint directions, constant/zero cases and finite zoom fitting. Three browser tests cover all five modes on desktop/mobile, dragging/keyboard edits, custom division, challenges, settings and zero-polynomial behavior. Targeted TypeScript and lint checks pass. Build and production logs are saved under `tmp/polynomials-*`.

The final production build passed (`tmp/polynomials-build-delivery.log`), and all three browser tests passed against that build (`tmp/polynomials-production.log`). Mobile checks explicitly verify the editing panel remains visible and analysis tables fill their panel.

Screenshots: `artifacts/polynomials-reference-{roots,factors,division,end-behavior,multiplicity,mobile}.png`. Artifact screenshots temporarily remove ancestor scroll clipping; the app retains its normal scrolling behavior.
