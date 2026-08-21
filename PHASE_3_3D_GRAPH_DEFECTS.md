# Phase 3 — 3D Graph Defects

Date: 2026-08-20  
Open defects: 14  
Severity totals: **S0 0 · S1 6 · S2 7 · S3 1 · S4 0**

| ID | Severity | Defect | Evidence / impact |
|---|---|---|---|
| BUG-P3-3DG-001 | S1 | Vertical-plane input is silently misinterpreted | `y=-3` is accepted and drawn as horizontal `z=-3`; students receive mathematically false output instead of an unsupported-form error. |
| BUG-P3-3DG-002 | S1 | General implicit surfaces are absent | Cylinder, sphere, ellipsoid, hyperboloids, and two-nappe cone cannot be entered, blocking 3DGR-015–020 and core accuracy checks. |
| BUG-P3-3DG-003 | S1 | General parametric curves and surfaces are absent | Flower, shell, torus, Möbius surface, helix family, Lissajous, ribbon, and knot cannot be authored; fixed overlays are not equivalent. |
| BUG-P3-3DG-004 | S1 | Valid `exp(...)` notation is rejected | Both `exp(-(x^2+y^2))` and `exp(x+y)` report `Unsupported name: xp`, blocking exponential mathematics advertised by presets/source. |
| BUG-P3-3DG-005 | S1 | Discontinuous floor surface receives a fabricated derivative | At `(0,0)`, `floor(x)+floor(y)` reports gradient `(500,500)` and derives a normal/tangent plane instead of marking the derivative undefined. |
| BUG-P3-3DG-006 | S1 | UI becomes effectively unusable under modest/stress load | Sustained footer reading of 1 FPS at 10 surfaces; 12×12 replay needed 145.844 s to reach 11 surfaces and timed out before 50. |
| BUG-P3-3DG-007 | S2 | Removable `sin(r)/r` centre is left undefined | Origin is reported outside the real surface rather than using the limit value 1, leaving a mathematical hole. |
| BUG-P3-3DG-008 | S2 | “Auto-saved locally” status is false/misleading | Reload after edits or explicit Save returns to the default one-surface scene; restoration requires manually loading the library entry. |
| BUG-P3-3DG-009 | S2 | Standard camera view set is incomplete | Back, Bottom, and distinct Left/Right views are missing, yet the mandatory view workflow expects all orthographic sides. |
| BUG-P3-3DG-010 | S2 | Major analysis workflows are absent | No contours/projection, intersections, vector fields, critical-point marking, surface area, or volume under a surface. |
| BUG-P3-3DG-011 | S2 | Invalid piecewise input creates a phantom animation variable | Rejected piecewise syntax also adds a `piecewise` parameter and enables animation, compounding an input error with misleading state. |
| BUG-P3-3DG-012 | S2 | Responsive layout hides primary persistence/history actions | Narrow desktop/tablet/mobile layouts remove Save/Undo/Redo from the reachable top action set without an equivalent mobile action. |
| BUG-P3-3DG-013 | S2 | Export success and artifacts are not reliably observable | Copy equation left the tested clipboard empty; CSV produced no observed download event; no in-app confirmation/error establishes outcome. |
| BUG-P3-3DG-014 | S3 | Even mesh resolutions omit known central extrema | At 44×44, `x²+y²`, `sqrt(x²+y²)`, and `abs(x)+abs(y)` show positive sampled minima although their minimum at the origin is zero. |

## Exit criteria

Do not approve release until all S1 issues are fixed and regression-tested, all S2 items have either fixes or accepted product-scope decisions with honest UI copy, and the 50-object stress case completes without UI-thread timeouts or data loss.
