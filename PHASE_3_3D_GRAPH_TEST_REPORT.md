# Phase 3 — 3D Graph Test Report

Date: 2026-08-20  
Application: Math Universe Visualizations 1.0.1  
Commit: `2662c27` (working tree already contained unrelated changes)  
Route: `/math-lab/3d-graphing`  
Verdict: **NOT READY FOR RELEASE**

## Scope and method

All 65 mandatory operations were attempted in order before CAS testing. Testing used the real browser UI at desktop size, responsive viewport checks, mathematical spot calculations, source inspection only to distinguish unsupported capability from a broken control, and focused automated tests. An operation is `Not Implemented` when its required capability has no user-facing workflow; `Blocked` means the UI attempt could not finish because the application became unresponsive.

Evidence: [`test-evidence/phase-3/3d-graph/`](test-evidence/phase-3/3d-graph/)

## Totals

| Pass | Fail | Partial | Blocked | Not Implemented | Total |
|---:|---:|---:|---:|---:|---:|
| 14 | 8 | 16 | 1 | 26 | 65 |

## Operation results

| ID | Status | Result |
|---|---|---|
| 3DGR-001 | Pass | Opened without crash; axes, origin/grid, expression list, camera menu, properties, and default range were identifiable. |
| 3DGR-002 | Partial | Orbit interaction and preset rotation rendered, but sustained rapid/full-revolution coverage could not be completed reliably once FPS collapsed. |
| 3DGR-003 | Partial | Wheel/orbit/pan affordances exist and basic navigation worked; minimum/maximum clipping and selection hitboxes were not fully controllable under lag. |
| 3DGR-004 | Fail | Top, Front, Side, Isometric, Fit/Reset worked; Back, Bottom, and distinct Left/Right views are absent. |
| 3DGR-005 | Partial | Axes, grid, labels, and base plane toggled; x/y ranges exist, but independent z-range, ticks, coordinate-plane controls, and unequal-scale warning do not. |
| 3DGR-006 | Partial | Eight themes and good dark-scene contrast exist; background is not independently configurable and theme reopen fidelity was not demonstrated. |
| 3DGR-007 | Pass | `z=3`, `z=0`, and `z=-2` rendered as horizontal planes at correct heights. |
| 3DGR-008 | Pass | `z=x+y` rendered with correct origin and gradient `(1,1)`; known-point checks were correct. |
| 3DGR-009 | Fail | `x=2` was rejected, but `y=-3` was silently accepted as horizontal `z=-3`, a materially wrong vertical-plane interpretation. |
| 3DGR-010 | Pass | `z=x²+y²` rendered with origin analysis value 0 and circular slices; sampled range minimum was 0.01 because the even mesh omitted the origin. |
| 3DGR-011 | Pass | `z=x²+2y²` showed unequal curvature and correct live coefficient behavior. |
| 3DGR-012 | Pass | `z=x²-y²` showed positive/negative regions and an origin saddle. |
| 3DGR-013 | Pass | `sqrt(25-x²-y²)` rendered valid points only within the tested radius-3 viewport and gave origin height 5. |
| 3DGR-014 | Partial | `sqrt(x²+y²)` rendered the positive cone; negative nappe/implicit equivalent is unsupported and the even mesh missed the apex sample. |
| 3DGR-015 | Not Implemented | No implicit-surface input; `x²+y²=25` is rejected. |
| 3DGR-016 | Not Implemented | No implicit sphere workflow. |
| 3DGR-017 | Not Implemented | No implicit ellipsoid workflow. |
| 3DGR-018 | Not Implemented | No implicit hyperboloid-of-one-sheet workflow. |
| 3DGR-019 | Not Implemented | No implicit hyperboloid-of-two-sheets workflow. |
| 3DGR-020 | Not Implemented | No two-nappe implicit elliptic-cone workflow. |
| 3DGR-021 | Pass | `sin(x)` had amplitude about 1, x periodicity, y constancy, and origin gradient `(1,0)`; radians are used. |
| 3DGR-022 | Pass | `sin(x)+cos(y)` rendered directional waves with observed range about `[-1.989,1.997]`, consistent with `[-2,2]`. |
| 3DGR-023 | Pass | `sin(x)*sin(y)` rendered an egg-crate surface with expected symmetry and range about `[-1,1]`. |
| 3DGR-024 | Pass | `sin(sqrt(x²+y²))` rendered concentric radial ripples and remained continuous at the origin. |
| 3DGR-025 | Fail | `sin(r)/r` leaves the origin outside the surface instead of applying the removable limit 1. |
| 3DGR-026 | Not Implemented | No general parametric/polar flower input. |
| 3DGR-027 | Not Implemented | No general parametric shell/spiral curve input. |
| 3DGR-028 | Not Implemented | No general two-parameter torus input. |
| 3DGR-029 | Not Implemented | No general twisted parametric-surface input. |
| 3DGR-030 | Partial | `a*sin(x)+b` animated; pause/resume, 2×, loop and ping-pong worked, but sustained FPS fell to 1 and reset/stale-mesh assurance failed. |
| 3DGR-031 | Fail | `exp(-(x²+y²))` is rejected as `Unsupported name: xp`; required maximum-at-origin check cannot be graphed. |
| 3DGR-032 | Fail | `exp(x+y)` fails with the same parser defect; overflow protection could not be tested. |
| 3DGR-033 | Pass | `ln(x²+y²)` rendered valid samples and omitted the singular origin. |
| 3DGR-034 | Partial | `1/(x²+y²)` omitted the origin and rendered high nearby values, but has no explicit clipping/maximum-height control. |
| 3DGR-035 | Partial | `1/(x*y)` produced separate signed regions and omitted the origin; false-connection assurance at both asymptotes was limited by mesh resolution. |
| 3DGR-036 | Partial | `abs(x)+abs(y)` rendered the ridges/vertex, but numerical derivative presentation is not assumption-aware at nondifferentiable loci. |
| 3DGR-037 | Fail | Piecewise syntax is rejected as invalid characters and also creates a spurious `piecewise` animation parameter. |
| 3DGR-038 | Partial | `floor(x)+floor(y)` rendered steps, but reports gradient `(500,500)` at the discontinuity and consequently presents an invalid normal/tangent plane. |
| 3DGR-039 | Not Implemented | No general parametric 3D helix input; a fixed visual overlay is not an editable curve workflow. |
| 3DGR-040 | Not Implemented | No conical-helix parameterization workflow. |
| 3DGR-041 | Not Implemented | No 3D Lissajous input. |
| 3DGR-042 | Not Implemented | No editable parametric sphere input. |
| 3DGR-043 | Not Implemented | No editable parametric cylinder input. |
| 3DGR-044 | Not Implemented | No editable parametric cone input. |
| 3DGR-045 | Not Implemented | No general parametric saddle input. |
| 3DGR-046 | Not Implemented | No wave-tube/ribbon parameterization. |
| 3DGR-047 | Not Implemented | No knot-curve parameterization. |
| 3DGR-048 | Not Implemented | No contour-on-surface layer or interval control. |
| 3DGR-049 | Not Implemented | No 2D contour projection/legend workflow. |
| 3DGR-050 | Pass | x=c, y=c, and z=c slices opened a live 2D preview; x=1, y=1, z=1 were exercised. |
| 3DGR-051 | Not Implemented | No surface-intersection curve operation. |
| 3DGR-052 | Partial | Point gradient and exact partials work (`2*x`, `2*y`); there is no sampled gradient-vector layer/density control. |
| 3DGR-053 | Not Implemented | No 3D vector-field workflow. |
| 3DGR-054 | Not Implemented | No find/mark/classify critical-points operation across the surface. |
| 3DGR-055 | Partial | Numeric normal/tangent-plane data exist at a point, but singular/nondifferentiable points are presented without validity safeguards. |
| 3DGR-056 | Not Implemented | No surface-area calculator. |
| 3DGR-057 | Not Implemented | No volume-under-surface calculator. |
| 3DGR-058 | Partial | Ten surfaces were added, styled/hidden, saved, and reloaded manually; depth/order tooling is limited and performance fell to 1 FPS. |
| 3DGR-059 | Pass | a/b/t sliders accept decimal and negative values; rapid animation updated the surface and computed values. |
| 3DGR-060 | Partial | Palette, low/high colors, opacity, wireframe, sample points, and eight themes exist; numeric legends, gradient scale, reversal/log scale, and color-vision modes do not. |
| 3DGR-061 | Fail | 44×44 initially reported 60–144 FPS but later remained at 1 FPS; even 12×12 fell to 3 FPS in the independent run and controls timed out. |
| 3DGR-062 | Partial | Invalid inputs show alerts and valid input recovers; some equality/piecewise inputs are misleadingly reinterpreted and invalid names spawn parameters. |
| 3DGR-063 | Fail | Required complex scene types are unavailable; explicit save is not auto-restored even though the footer continuously says “Auto-saved locally.” |
| 3DGR-064 | Partial | PNG, CSV, project JSON, and copy-equation commands are exposed; clipboard stayed empty and no CSV download event was observed, so artifact correctness is unverified. |
| 3DGR-065 | Blocked | Required 50-object UI attempt was started. At 12×12 it reached 11 surfaces after 145.844 s, then the next Add Expression event timed out; a prior 10-surface scene was already at 1 FPS. |

## Mandatory accuracy conclusions

- Correct/consistent: `z=x+y`, explicit paraboloid/saddle, sine surfaces, exact partials, and cross-sections.
- Failed or unavailable: implicit sphere/ellipsoid, helix, torus, exponential Gaussian, removable `sin(r)/r` centre, disconnected implicit components, and an axis-scaling warning.
- Sampling caveat: even resolutions can omit `(0,0)`, so displayed sampled minima for zero-minimum surfaces are nonzero even while point analysis at the origin is correct.

## Focused automated verification

Command:

```text
npm test -- --run src/pages/GraphingModules.test.tsx src/utils/mathEngine/coreEngines.test.ts src/graph-studio/graph3dThemes.test.ts src/graph-studio/graph3dSurfaceModel.test.ts
```

Result: **4 files passed, 14 tests passed, 0 failed**. These tests do not cover the user-visible capability gaps or sustained UI performance failures above.

## Release decision

The module is not release-ready as a general 3D mathematics graphing tool. It is a useful explicit `z=f(x,y)` surface viewer, but mandatory implicit/parametric families and major analysis workflows are absent. S1 mathematical misinterpretation, discontinuity handling, false persistence messaging, and severe stress degradation are release blockers.
