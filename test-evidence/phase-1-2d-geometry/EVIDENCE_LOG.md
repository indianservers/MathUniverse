# Phase 1 — 2D Geometry Evidence Log

Environment: Math Universe 1.0.1, commit `2662c27`, in-app Chromium, Vite 6.4.2, Windows, 2026-08-20.

The browser-control surface returned screenshot byte buffers but did not persist its requested local paths. This file preserves the equivalent DOM-visible results, exact data, reproduction state, viewport measurements, and observed outcomes. No screenshot filename is claimed as a delivered artifact.

## EV-001 — Initial launch and responsive layout

- Route opened with `Dynamic Geometry Studio`, SVG application `Geometry constructor`, Geometry Tools, Objects & Algebra, Object Inspector, Save, Load, Export, grid, axes, labels, measurements, snapping, and navigation.
- Desktop semantic scan: `lang=en`, H1=1, main=2, duplicate IDs=0, visible named controls=263, unnamed visible controls=0.
- Mobile 390×844: `innerWidth=390`, `scrollWidth=390`, canvas height `537.2`, H1=1, main=2.
- Tablet 768×1024: `innerWidth=768`, `scrollWidth=768`, canvas `678.4×566.4`, H1=1, main=2.

## EV-002 — Exact coordinate mismatch

1. Created point A. Registry initially displayed `A (0, 0.5)`.
2. Inspector exposed `x=320`, `y=200`.
3. Entered inspector `x=0`, `y=0`.
4. Registry displayed `A (-8, 5.5)`.

This proves the inspector consumes raw canvas pixels while the registry reports mathematical coordinates.

## EV-003 — Degenerate triangle false certification

Input: Triangle tool; three clicks at the same snapped position.

Visible result:

```text
Construction Accuracy
Geometry accuracy certified.
100%
max residual 0

Polygon 1: area = 0, perimeter = 0
angle A = 90 deg
angle B = 90 deg
angle C = 90 deg
```

The reported angle sum is 270°.

## EV-004 — Undo/Redo loses polygon

1. Created rectangle: area `7.88`, perimeter `11.5`.
2. Edited one vertex: area `6.75`, perimeter `10.71`.
3. Pressed Undo: polygon disappeared; four points remained.
4. Pressed Redo: polygon remained missing; four points remained.

## EV-005 — Circle unit and degeneracy defects

Circle Shape result:

```text
Registry: A (0, 0.25), B (1.8, 0.25)
Live Measurements: Circle A: r = 1.8, center=(320, 210), r=1.8
```

Two coincident Circle clicks produced:

```text
Geometry accuracy certified.
100%
Circle A: r = 0, center=(320, 200), r=0
```

Radius editor values `0` and `-1` were silently clamped to `0.25` without a visible validation message.

## EV-006 — Self-intersecting polygon false certification

Bow-tie vertices: `(0,0),(2,2),(0,2),(2,0)`.

Visible result:

```text
Polygon 1: area = 0, perimeter = 9.66
Geometry accuracy certified.
100%
max residual 0
```

No self-intersection warning or area convention appeared.

## EV-007 — Parent deletion mutates square

1. Created default square: five registry objects (four points plus polygon).
2. Deleted vertex A using Selected object actions.
3. Registry contained four objects: three points plus `Polygon 1 — 3 vertices`.
4. Measurements changed to area `4.21`, perimeter `9.9`, angles `45°`, `90°`, `45°`.
5. No dependency-warning dialog appeared; Undo did not reconstruct the square.

## EV-008 — Unsaved navigation loss

1. Had four geometry objects and did not press Save.
2. Followed Home to `/workspace`.
3. Used Back to return to `/workspace/geometry`.
4. Geometry object count was zero; no warning appeared.

Refreshing an unsaved construction produced the same empty initial state.

## EV-009 — 100-point stress and naming failure

- 100 UI point clicks completed in 28,582 ms.
- Registry object count: 100.
- Status readout remained `60 FPS`; no independent frame sampling was available.
- A–Z were readable. Later labels progressed through punctuation and C1 control characters (`\x86` through `\x9f` appeared in the DOM), followed by symbols such as `¡`, `¢`, `£`, and `¤`.
- No application crash or visible error boundary occurred.

## EV-010 — Preset polygon calculation samples

| Shape | Area | Perimeter | Angles |
| --- | ---: | ---: | --- |
| Rectangle | 7.88 | 11.5 | 90, 90, 90, 90 |
| Square | 8.41 | 11.6 | 90, 90, 90, 90 |
| Regular pentagon | 7.7 | 10.58 | 108 × 5 |
| Regular hexagon | 9.88 | 11.7 | 120 × 6 |
| Parallelogram | 7.36 | 11.15 | 75.4, 104.6, 75.4, 104.6 |
| Trapezoid | 8.71 | 12.24 | 110.1, 110.1, 69.9, 69.9 |
| Rhombus | 7.38 | 10.91 | 97.4, 82.6, 97.4, 82.6 |
| Kite | 5.04 | 9.72 | 63.9, 110.4, 54.7, 131 |

Selected-square transformations preserved area/perimeter under Move and Rotate (`8.41`, `11.6`), then dilation produced area `11.12`, perimeter `13.34`.

## EV-011 — Ellipse is a sampled locus

Visible registry:

```text
Arcs & Loci
ellipse
48 samples
```

Live Measurements displayed: `Create lines, circles, or polygons to see measurements.` No center, radii, foci, eccentricity, or area was exposed.

## EV-012 — Missing-feature searches

The tool search returned zero tool buttons for every term below:

```json
{
  "equation": 0,
  "fixed angle": 0,
  "centroid": 0,
  "orthocenter": 0,
  "circumcenter": 0,
  "incenter": 0,
  "ellipse foci": 0,
  "import": 0,
  "copy paste": 0,
  "bring forward": 0,
  "quarter circle": 0
}
```

## EV-013 — Zoom, pan, and fit are inert

SVG viewBox sequence:

```json
{
  "initial": "0 0 640 420",
  "afterZoom": "0 0 640 420",
  "afterPan": "0 0 640 420",
  "afterFit": "0 0 640 420"
}
```

## EV-014 — Layers and export

- Layers showed Annotations, Shapes, Construction, and Points.
- Pressing Add layer left the layer count at four.
- No bring-forward, send-back, move-up, or move-down control was present.
- Export offered Canvas image (PNG), Project data (JSON), Object summary (CSV), and Worksheet (PDF/print).
- `Selected object — Available after selection` remained disabled while a polygon was selected.

## EV-015 — Persistence/style

- Manual Save, reload, then Load restored points A `(0,0)` and B `(3,0)`.
- Point size `18`, opacity `0.5`, and hidden label mode persisted.
- Reload before pressing Load showed an empty construction.

## EV-016 — Keyboard and touch-target observations

- Pressing Escape during an unfinished Segment changed the active hint from `Segment tool ready` to `Move tool ready`.
- Keyboard focus on Save had a visible solid outline and focus box-shadow.
- Mobile examples: Rename project approximately `24.7×36`; Undo/Redo/Save/Load/Export/settings approximately `40×36`, below the requested 44×44 target.
- No discoverable theme/dark/light control was present; computed color scheme was light.

## EV-017 — Build and regression commands

```text
npm run build
exit 0
5536 modules transformed
built in 57.76s
warning: chunks over 900 kB
MathWorkspace minified: 1434.53 kB, gzip 412.10 kB

npx vitest run [eight geometry suites] --maxWorkers=1 --reporter=dot
8 test files passed
61 tests passed
duration 3.60s
```
