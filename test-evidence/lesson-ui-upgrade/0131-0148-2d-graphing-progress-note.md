# 2D Graphing Calculator UI Upgrade

Completed the 18-lesson 2D Graphing Calculator workspace family against target mockups `0131-0148`.

## What Changed

- Rebuilt lessons `39-56` with a shared target-style 2D graphing workspace in `GraphLessonAdapter`.
- Added lesson-specific graph canvases, left teaching panels, right inspector/control panels, output cards, sample-value tables, and responsive screenshots for every lesson.
- Removed generic lesson workbench heading/chips for lessons `39-56` so the interaction area matches the target mockup structure more closely.
- Disabled the generic decorative workbench overlay for the target graphing family.
- Added `scripts/audit-2d-graphing-ui.mjs` to rerun the full 18-lesson screenshot/control audit.

## Completed Lessons

| Mockup | Lesson | Route |
|---|---:|---|
| 0131 | 39 Cartesian Graphing | `/lessons/graphs-and-functions/39-cartesian-graphing` |
| 0132 | 40 Function Plotter | `/lessons/graphs-and-functions/40-function-plotter` |
| 0133 | 41 Equation Grapher | `/lessons/graphs-and-functions/41-equation-grapher` |
| 0134 | 42 Inequality Grapher | `/lessons/graphs-and-functions/42-inequality-grapher` |
| 0135 | 43 Parametric Curves | `/lessons/graphs-and-functions/43-parametric-curves` |
| 0136 | 44 Polar Graphs | `/lessons/graphs-and-functions/44-polar-graphs` |
| 0137 | 45 Point Plotter | `/lessons/graphs-and-functions/45-point-plotter` |
| 0138 | 46 Data Plotter | `/lessons/graphs-and-functions/46-data-plotter` |
| 0139 | 47 Table of Values | `/lessons/graphs-and-functions/47-table-of-values` |
| 0140 | 48 Trace Mode | `/lessons/graphs-and-functions/48-trace-mode` |
| 0141 | 49 Zoom and Pan | `/lessons/graphs-and-functions/49-zoom-and-pan` |
| 0142 | 50 Axis Controls | `/lessons/graphs-and-functions/50-axis-controls` |
| 0143 | 51 Grid Controls | `/lessons/graphs-and-functions/51-grid-controls` |
| 0144 | 52 Multiple Graphics Views | `/lessons/graphs-and-functions/52-multiple-graphics-views` |
| 0145 | 53 Special Points | `/lessons/graphs-and-functions/53-special-points` |
| 0146 | 54 Graph Inspector | `/lessons/graphs-and-functions/54-graph-inspector` |
| 0147 | 55 Dynamic Parameters | `/lessons/graphs-and-functions/55-dynamic-parameters` |
| 0148 | 56 Export Graph | `/lessons/graphs-and-functions/56-export-graph` |

## Verification

- `npm run typecheck -- --pretty false` passed.
- `node scripts/audit-2d-graphing-ui.mjs` passed for all 18 lessons.
- Evidence generated for each mockup: `*-reference.png`, `*-desktop.png`, `*-tablet.png`, `*-mobile.png`, `*-interacted.png`, and `*-control-audit.json`.
- Summary: `0131-0148-2d-graphing-validation-summary.json`.

## Pending In This Family

0 lessons pending.
