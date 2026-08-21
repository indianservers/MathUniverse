# Phase 3 3D Graph evidence index

Run date: 2026-08-20 (Asia/Calcutta)

## Artifacts

- `3DGR-001-desktop-launch.png` — real 1440×900 browser render of the launch scene.
- `3DGR-ui-audit-failure.png` — real browser render captured during a timed-out UI run; footer records 1 FPS.
- `ui-audit-results.json` — machine-readable timestamps, footer readings, progress, and the stress timeout.
- `ui-audit.mjs` — reproducible Playwright audit used for the final stress replay.

## Manual exploratory evidence

- Default scene: `z=sin(x)*cos(y)`, 44×44 samples, reported range about `[-0.997, 0.997]`.
- Correct point/gradient checks: `z=x+y` gave origin value 0 and gradient `(1,1)`; `(1,2,3)` satisfies the expression independently. `z=x²-y²` displayed a saddle at the origin. Exact partials of `x²+y²` were `2*x` and `2*y`.
- Explicit surface batch attempted through the expression editor: constants 3, 0, −2; linear plane; elliptic/hyperbolic paraboloids; hemisphere; cone; sine, two-direction sine/cosine, egg-crate, radial ripple, damped radial wave; exponential, logarithmic, reciprocal, `1/(xy)`, absolute-value, and floor surfaces.
- Invalid/unsupported input attempted through the editor: `x=2`, `y=-3`, sphere, cylinder, ellipsoid, both hyperboloids, helix, flower, torus, piecewise syntax, blank/incomplete forms, and unsupported names.
- Camera presets Top, Front, Side, Isometric, and Reset were exercised. Grid, axes/coordinates, labels, and base-plane toggles were exercised. All eight graph themes were inspected and Aurora Neon was selected.
- Cross-sections at x=1, y=1, and z=1 produced a 2D preview. Parameter expression `a*sin(x)+b` was exercised with negative/decimal values and timeline play, pause, speed, loop, and ping-pong.
- Ten surfaces were created by repeated Add Expression operations. The footer fell to a sustained 1 FPS and browser operations timed out. A clean replay lowered resolution to 12×12, then attempted the required 50 additions; it reached 11 surfaces after 145.844 seconds and timed out during the next actual DOM click.
- Explicit Save created a library entry. Reload returned to one default surface; manually loading Settings restored the 10-surface project. This contradicts the persistent footer claim “Auto-saved locally.”
- Export menu exposed PNG, CSV, project JSON, and Copy equation. Clipboard read was empty after Copy; a CSV download event was not observed within five seconds. These are recorded as unverified/failing, not as successful exports.

## Limitation

Browser screenshot capture was available in the independent Playwright replay. Some long-running interaction sequences timed out because the page's UI thread became unresponsive; that behavior is itself retained as stress evidence. No screenshot or successful export was fabricated.
