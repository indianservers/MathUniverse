# Phase 2 — 2D Graph Evidence Log

Tested 2026-08-20 through the restarted browser UI at `http://127.0.0.1:5173/workspace/graph`, build 1.0.1, commit `2662c27` (dirty working tree preserved). The page opened as `/workspace/graph?v_a=1&v_b=0`; no saved 3D object UI/state appeared.

## Live UI evidence

- Launch: axes/grid SVG, expression editor, graph list, four viewport number inputs, value table, two sliders, and 1 default `sin(x)` plot loaded without a crash.
- Linear input: `y=2*x+3` was accepted and rendered, but classified as `implicit`. Its generated table included points consistent with slope 2 and intercept 3. `y=3` rendered. `x=4` was blocked as `Unsupported expression`, so vertical lines cannot be plotted.
- Notation: `2x`, `2*x`, `3(x+1)`, adjacent `(x+1)(x-1)`, `X^2`, `pi`, `e^x`, `sqrt(x)` were accepted. `xy` was rejected as `Unsupported name: y`; `|x|` was rejected as invalid even though `abs(x)` works. Mismatched `(` and `sin(` produced a clear message. `NaN` and `1e309` were blocked. `1/0` was added with a no-visible-points warning.
- Function families actually added through the UI: quadratics, cubics, degree 10, repeated roots, reciprocal/transformed rational, cancelled rational, square/cube roots, absolute value, piecewise `if`, floor, ceiling, bases `2` and `e`, `ln`, sine/cosine/tangent and reciprocal trig functions, inverse trig, circle/ellipse/sideways parabola/hyperbola/lemniscate implicit relations, parametric circle/Lissajous, polar circle/spiral/rose/cardioid, and an inequality.
- Validation inconsistencies: `exp(x)` was rejected as `Unsupported name: xp`; `sign(x)` was rejected; `a*x+b` was rejected as `Unsupported name: a` even though the UI explicitly instructs `Use expressions like a*x+b or a*sin(x)+b.` Editing the default graph to `a*x+b` bypassed validation; with a=2,b=3 the value table then correctly showed (0,3) and (1,5), leaving the stale error visible.
- Aspect-ratio defect: the sampler coordinate system is 640×360 while both axes default to -10..10. One unit is 32 pixels horizontally and 18 vertically. Consequently `x^2+y^2=25`, polar circles, and parametric circles render as horizontally stretched ellipses rather than circles; conics and angles are similarly distorted.
- Discontinuities: reciprocal and tangent expressions generated multiple path segments rather than a single aggregate path, but no asymptote markers/labels exist. Cancelled `(x^2-1)/(x-1)` has no visible open-circle hole marker. Floor/ceiling are sampled as ordinary continuous paths, so jumps have connecting segments and no open/closed endpoint markers.
- Table: the Table tab generated values for at most the first three visible plots and a -10..10 range produced 20+ samples. It is not an editable coordinate-pair table; cells cannot be entered, labelled, styled, or deleted. Step 0 silently changed to 1.
- Viewport: exact x/y min/max values accepted extreme/unequal ranges, e.g. x -1000..0.0001. There are no pan/zoom gestures/buttons, grid/axis toggles, tick controls, reset, or equal-scale control.
- Styling: selected graph name, colour, hide/show, lock/unlock, duplicate, edit, and delete worked. Thickness, opacity, line style, label controls, and reorder are absent.
- Capacity/data loss: after 10 plots, every additional accepted graph kept the list at `10/10` and silently removed an earlier plot. The required 50-plot stress scene is impossible.
- Persistence: before refresh the UI had 10 plots, viewport x=-1000..0.0001, and a=-3.5. After refresh it had only the default `sin(x)`, default viewport -10..10, while a=-3.5 survived through the URL. There is no Save, Export, Undo, Redo, or Reset control in the Graph module.
- Analysis inventory: no roots, intersections, trace, tangent, normal, extrema, inflection, derivative, integral/area, animation, radians/degrees, axes, or grid controls were present.
- Responsive: at 768×1024 and 390×844 the editor and SVG remained present with no document-level horizontal overflow. This is viewport emulation, not physical touch testing.
- Automated regression: Graph Workspace Panel, sampler, workflow regression, and analysis suites: 4 files, 18 tests passed.

## Independent accuracy checks

- `y=2x+3`: manual slope 2 and y-intercept 3; UI sampling was consistent, but no slope/intercept analysis is displayed.
- `x^2-5x+6=(x-2)(x-3)`: roots 2 and 3; curve plotted, but the UI has no root markers/readout.
- `(x-2)^2+1`: vertex (2,1); curve plotted, but no vertex analysis.
- `1/x`: asymptotes x=0,y=0; sampler segments discontinuities, but asymptotes are not shown.
- `sqrt(x)`: negative real x samples are omitted; table starts at x=0 for the tested range.
- `2^x`: table behavior is consistent with y-intercept 1. `ln(x)` is consistent with x-intercept 1.
- `sin(x)`, `cos(x)`, `tan(x)` render in radians; there is no degree mode or pi-based tick labelling.
- Circle/ellipse equations and parametric/polar circles are mathematically parsed, but unequal pixel scales make their visual geometry wrong.
- Repeated roots and piecewise endpoints have no semantic markers, so touching/crossing and open/closed endpoints cannot be certified visually.

## Evidence limitation

The in-app browser returned screenshot buffers but could not persist them to requested workspace paths in this environment. No screenshot filenames are fabricated. This log records exact expressions, visible messages, DOM/SVG observations, values, viewport sizes, and reproduction outcomes.
