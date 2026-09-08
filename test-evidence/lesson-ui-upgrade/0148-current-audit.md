# Target 0148 Current Audit

## Lesson

- Lesson ID: 56
- Title: Export Graph
- Route: `/lessons/graphs-and-functions/56-export-graph`
- Target: `0148-interactive-foundational-advanced-2d-graphing-calculator-export-graph-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated export workspace | `ExportGraphTargetLesson56` replaces the generic graph renderer | Adapter regression test |
| Live logistic preview | Curve, axes, asymptote, formula, legend, and selected point derive from the logistic model | Model and surface tests |
| Direct selected-point control | The point supports pointer dragging and keyboard movement along the curve | Model mapping test and component inspection |
| Real SVG export | Current SVG state is serialized with selected scale and optional layers | Component inspection |
| Real PNG export | The serialized SVG is rendered to a scaled canvas and downloaded as PNG | Component inspection |
| Real PDF export | The rendered canvas is embedded into a generated `jsPDF` document | Component inspection |
| Export options | Format, transparency, grid, labels, scale, and filename affect generated output | Component inspection |
| Preview controls | Fit-to-view and expanded preview change the exported graph viewport | Component inspection |
| Sharing controls | Copy-link and classroom-embed actions write real values to the clipboard | Component inspection |
| Export checklist | Visible metadata follows current grid, label, selected-point, scale, and filename state | Surface test and component inspection |

## Verification Run

- `exportGraphLesson56Model.test.ts`: passed
- `ExportGraphTargetLesson56.test.tsx`: passed
- focused lesson 56 adapter route test: passed
- ESLint on lesson 56 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the preview, export settings rail, checklist, filename panel, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot, pixel diff, or browser download acceptance was performed. Exact visual parity and end-browser file inspection remain pending; code routing, calculations, export pipelines, interactions, and structural correspondence are verified.
