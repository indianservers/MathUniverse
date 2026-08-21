# Phase 2 — 3D Geometry Defects

Build 1.0.1, commit `2662c27`, tested 2026-08-20 in Chromium via the actual `/workspace/3d` UI.

### BUG-P2-001 — Core 3D construction and analytic-geometry operations are absent

* Module: 3D Geometry
* Severity: S1 — Critical
* Priority: P0
* Related test case: 3DG-009, 011, 013–030, 034, 037, 039, 047, 049–050, 053, 055
* Environment: Desktop Chromium, 127.0.0.1:5173
* Preconditions: Open 3D Object Studio
* Test data: segment, ray, vector components `<3,4,12>`, plane `x+y+z=6`, intersections, distances, nets, reflections
* Steps to reproduce:
  1. Inspect Create/Transform/Measure modes and Shape Library.
  2. Search each named construction.
  3. Attempt to define parent points/vectors/planes.
* Expected result: School-level dependent constructions, validation, results, and live updates are available.
* Actual result: Only standalone Point/Vector/Line/Plane visuals and fixed solids are available; the listed constructions have no UI workflow.
* Reproducibility: 100%
* Mathematical impact: Required vector, line, plane, intersection, distance, and solid-analysis mathematics cannot be performed.
* Student impact: A student may mistake decorative objects for mathematical constructions and cannot complete standard lessons.
* Workaround: None in this module.
* Evidence: `test-evidence/phase-2/3d-geometry/EVIDENCE_LOG.md`
* Console or log details: No crash or console error; capability is absent.
* Suggested correction: Add dependency-aware construction tools backed by validated geometry kernels and visible results.
* Retest status: Open

### BUG-P2-002 — Cuboid measurements do not describe the visible cuboid

* Module: 3D Geometry
* Severity: S1 — Critical
* Priority: P0
* Related test case: 3DG-032
* Environment: Desktop Chromium
* Preconditions: Shape Library on Primitives
* Test data: Cuboid at displayed dimensions 2.50 × 2.50 × 2.50
* Steps to reproduce:
  1. Click Add Cuboid.
  2. Read Width, Height, Depth, Volume, and Surface area.
  3. Compare the visible non-cube mesh to the reported equal dimensions and implementation geometry factors.
* Expected result: Visible extents and measurements use the same length, width, and height.
* Actual result: The mesh applies 1.45 × 0.78 × 1 factors, while the dock reports 2.50 × 2.50 × 2.50, V 15.63, SA 37.50 as if it were a cube.
* Reproducibility: 100%
* Mathematical impact: Volume, area, face sizes, and diagonal inferred from the rendered cuboid are wrong.
* Student impact: Teaches a materially incorrect relationship between dimensions and measurements.
* Workaround: Use Cube only; no independent cuboid dimensions exist.
* Evidence: Evidence log, measurement samples
* Console or log details: No console error.
* Suggested correction: Store true cuboid dimensions once and use them for geometry and all measurements.
* Retest status: Open

### BUG-P2-003 — Standard camera view set is incomplete

* Module: 3D Geometry
* Severity: S2 — High
* Priority: P1
* Related test case: 3DG-004
* Environment: Desktop Chromium
* Preconditions: Open View menu
* Test data: Front/back/left/right/top/bottom/isometric
* Steps to reproduce:
  1. Open the current camera preset menu.
  2. Inspect every option.
  3. Attempt Back, Left, and Bottom.
* Expected result: All seven standard views are available and correctly labelled.
* Actual result: Perspective, Top, Front, Right, and Free exist; Back, Left, and Bottom do not.
* Reproducibility: 100%
* Mathematical impact: Students cannot reliably inspect orientation-dependent constructions from all standard directions.
* Student impact: Spatial interpretation and hidden/overlapping object disambiguation are harder.
* Workaround: Manually orbit approximately.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add the missing orthographic presets and preserve selection during switching.
* Retest status: Open

### BUG-P2-004 — Invalid numeric values are silently rejected or clamped

* Module: 3D Geometry
* Severity: S3 — Medium
* Priority: P1
* Related test case: 3DG-006, 032, 041, 054
* Environment: Desktop Chromium
* Preconditions: Select an object and expose Transform inputs
* Test data: text, blank, 0 scale, negative scale
* Steps to reproduce:
  1. Enter non-numeric text in a coordinate input.
  2. Enter 0 or a negative value in Uniform scale.
  3. Press Enter and inspect the value/message.
* Expected result: Friendly, mathematically specific validation explains invalid/degenerate values.
* Actual result: Native number input rejects text without guidance; 0 becomes 0.1 silently and negative dilation is unavailable.
* Reproducibility: 100%
* Mathematical impact: Degenerate and signed transformations cannot be explored correctly.
* Student impact: Unexpected value changes look like student error.
* Workaround: Use positive values ≥0.1.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Preserve entered value until validation and display an inline explanation; distinguish geometric scale from signed dilation.
* Retest status: Open

### BUG-P2-005 — Object names and scene labels cannot be managed

* Module: 3D Geometry
* Severity: S2 — High
* Priority: P1
* Related test case: 3DG-007, 008, 057
* Environment: Desktop/mobile viewport emulation
* Preconditions: Add points and many objects
* Test data: duplicates, subscripts, blank/long/special labels, 30+ objects
* Steps to reproduce:
  1. Add a point and duplicate it.
  2. Inspect Object Inspector/Functions/Appearance.
  3. Attempt rename, label visibility, label size, and group label controls.
* Expected result: Names and readable labels are editable, persistent, and manageable in crowded scenes.
* Actual result: Generated names are fixed; no rename or scene-label controls are exposed.
* Reproducibility: 100%
* Mathematical impact: Definitions and dependencies cannot be communicated unambiguously.
* Student impact: Crowded constructions become difficult to understand and keyboard navigation grows very long.
* Workaround: Use object-list generated names.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add accessible naming, label, collision, grouping, and show/hide controls.
* Retest status: Open

### BUG-P2-006 — Solid analysis is limited to opaque width/height/depth and aggregate V/SA

* Module: 3D Geometry
* Severity: S2 — High
* Priority: P1
* Related test case: 3DG-031, 033, 035–036, 038, 040, 042–046, 051–052
* Environment: Desktop Chromium
* Preconditions: Add any supported solid
* Test data: cube, prism, pyramid, cylinder, cone, hemisphere, frustum, torus, Platonic solids
* Steps to reproduce:
  1. Add each supported solid.
  2. Open Measurements and Object Inspector.
  3. Attempt independent dimension, topology, face/edge/vertex, diagonal, slant, radius, and component-area inspection.
* Expected result: Shape-appropriate parameters and school measurements are editable and visible.
* Actual result: Most shapes expose only generic W/H/D plus aggregate volume/surface area; topology and defining measures are missing.
* Reproducibility: 100%
* Mathematical impact: Many mandatory formulas cannot be independently checked from UI data.
* Student impact: Measurements lack context and instructional value.
* Workaround: Infer parameters from generic width where possible.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add shape-specific parameter panels, topology selection, and derived-measure explanations.
* Retest status: Open

### BUG-P2-007 — Cross-section plane is visual only and provides no section result

* Module: 3D Geometry
* Severity: S1 — Critical
* Priority: P1
* Related test case: 3DG-048
* Environment: Desktop Chromium
* Preconditions: Solid and slice visible
* Test data: cube, prism, pyramid, cylinder, cone, sphere; horizontal/vertical/oblique cuts
* Steps to reproduce:
  1. Add a solid and Cross-section object.
  2. Translate/rotate the plane through the solid.
  3. Inspect Measurements and scene objects for the resulting section.
* Expected result: Dynamic clipped section shape, classification, dimensions, and area.
* Actual result: A translucent plane/overlay is shown, but no section object, shape classification, clipping result, or measurement is produced.
* Reproducibility: 100%
* Mathematical impact: Standard-solid cross-sections cannot be verified.
* Student impact: The term “Cross-section” overpromises a result the UI does not compute.
* Workaround: Visual estimation only.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Compute exact plane-solid intersections and expose the resulting polygon/curve and measurements.
* Retest status: Open

### BUG-P2-008 — Reopening after Save shows defaults until hidden manual Load action

* Module: 3D Geometry
* Severity: S2 — High
* Priority: P0
* Related test case: 3DG-058, 060
* Environment: Desktop Chromium
* Preconditions: Create and save a populated scene
* Test data: 15-shape scene and 106-visible-object stress scene
* Steps to reproduce:
  1. Click Save and observe confirmation.
  2. Reload the page.
  3. Observe the default 5-visible-object scene; then open Settings and click Load saved scene.
* Expected result: Reopen restores the last saved workspace or clearly prompts to restore it.
* Actual result: Defaults appear with no prompt; only Settings → Load saved scene restores the save.
* Reproducibility: 100%
* Mathematical impact: None to calculations; high persistence risk.
* Student impact: Students may believe work was lost and overwrite or abandon it.
* Workaround: Settings → Load saved scene.
* Evidence: Evidence log
* Console or log details: Save/load toasts appeared; no crash.
* Suggested correction: Auto-restore the last explicit save or present an unmistakable restore choice on load.
* Retest status: Open

### BUG-P2-009 — Near-transparent and crowded objects lack selection aids

* Module: 3D Geometry
* Severity: S3 — Medium
* Priority: P2
* Related test case: 3DG-056, 057, 060
* Environment: Desktop/mobile viewport emulation
* Preconditions: Overlap solids and lower opacity
* Test data: opacity .25, Glass/Wireframe, 100+ objects
* Steps to reproduce:
  1. Overlap several solids and set low opacity.
  2. Hide/show and select from canvas and list.
  3. Repeat in a 100-object scene.
* Expected result: Strong non-colour selection cues and manageable grouping/filtering.
* Actual result: Renderer remains stable, but there is no internal-object selection aid, grouping/filtering, or label decluttering.
* Reproducibility: 100%
* Mathematical impact: Selection ambiguity can cause edits to the wrong object.
* Student impact: Crowded scenes become error-prone.
* Workaround: Select generated names in the long object list.
* Evidence: Evidence log
* Console or log details: No crash; 75 FPS minimum observed immediately after creation.
* Suggested correction: Add outline/x-ray selection, layers/groups, filters, and label collision handling.
* Retest status: Open

### BUG-P2-010 — Gesture limits and camera state are not exposed numerically

* Module: 3D Geometry
* Severity: S4 — Low
* Priority: P2
* Related test case: 3DG-002, 003
* Environment: Desktop Chromium; responsive emulation
* Preconditions: Open viewport navigation tools
* Test data: orbit/pan/zoom/Fit
* Steps to reproduce:
  1. Select Orbit, Pan, and Zoom.
  2. Exercise controls and inspect status/properties.
  3. Attempt to determine camera angle and min/max zoom.
* Expected result: Limits and current camera state are discoverable and resettable.
* Actual result: Fit exists, but there is no numeric camera/zoom state or discoverable limits.
* Reproducibility: 100%
* Mathematical impact: Exact view reproduction is difficult.
* Student impact: Recovery from disorientation is less predictable.
* Workaround: Fit view or a camera preset.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Expose zoom percentage and optional camera orientation readout with documented limits.
* Retest status: Open

### BUG-P2-011 — Export is limited to workspace JSON with no format or outcome UI

* Module: 3D Geometry
* Severity: S2 — High
* Priority: P1
* Related test case: 3DG-059
* Environment: Desktop Chromium
* Preconditions: Empty or populated scene
* Test data: populated 15-type scene
* Steps to reproduce:
  1. Click Export.
  2. Inspect for format selection and completion/error feedback.
  3. Compare available formats with image/model/document expectations.
* Expected result: Every supported format is named, configurable, and confirmed; failed export preserves work.
* Actual result: The implementation initiates workspace JSON only and exposes no image/model/document option or visible result feedback.
* Reproducibility: 100%
* Mathematical impact: Visual constructions cannot be submitted or printed faithfully.
* Student impact: “Export” gives no indication of what was produced or where it went.
* Workaround: Use JSON as a workspace backup.
* Evidence: Evidence log
* Console or log details: No visible error.
* Suggested correction: Add an export dialog with JSON, PNG/SVG/PDF and appropriate 3D formats plus success/error status.
* Retest status: Open

## Severity summary

| Severity | Count |
| -- | --: |
| S0 | 0 |
| S1 | 3 |
| S2 | 5 |
| S3 | 2 |
| S4 | 1 |
| Enhancement | 0 |
