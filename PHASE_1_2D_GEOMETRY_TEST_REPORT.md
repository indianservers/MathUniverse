# Phase 1 — 2D Geometry Test Report

## 1. Executive summary

Phase 1 was executed against the complete `/workspace/geometry` module as a first-time school-student workflow. All 70 mandatory operations were attempted through the current UI. The strict result is **NOT READY FOR RELEASE**: 2 Pass, 15 Fail, 33 Partial, 0 Blocked, and 20 Not Implemented.

The module launches and provides a broad, attractive tool palette. Quick-created rectangles and common regular polygons generally report correct area, perimeter, and angle values. However, release-blocking findings include loss of unsaved constructions after navigation or refresh, destructive Undo/Redo, 100% “certified” degenerate geometry, canvas-pixel values exposed as exact mathematical coordinates, and nonsensical automatic point names after Z.

## 2. Application build/version/commit tested

- Package: `math-universe-visualizations` 1.0.1
- Commit: `2662c27`
- Working tree: dirty before testing; existing user changes were preserved
- Route: `http://127.0.0.1:5173/workspace/geometry`

## 3. Date and environment

- Date: 2026-08-20
- OS: Windows, PowerShell host
- Server: Vite 6.4.2 development server
- Production build: passed; 5,536 modules, 57.76 seconds
- Relevant automated regression: 8 files and 61 tests passed

## 4. Devices, viewports, browsers, or platforms tested

- In-app Chromium browser, desktop viewport
- Tablet emulation: 768×1024
- Mobile emulation: 390×844
- Mouse/button, form, and keyboard interaction
- Light color scheme
- Touch gestures, physical devices, Firefox, Safari, Edge, Android, iOS, screen readers, and dark theme were not tested

## 5. Build and launch results

`npm run build` exited 0. The module opened without an error boundary or visible crash. The build emitted existing warnings for chunks over 900 kB; `MathWorkspace` was 1,434.53 kB minified. The route displayed its canvas, tool palette, object registry, inspector, navigation, measurements, constraints, Save/Load, and Export controls.

## 6. Test coverage

Coverage included all 70 requested operations, clean and cumulative constructions, invalid/coincident input, 100-point stress, responsive layouts, persistence, navigation loss, export discovery, keyboard focus, mathematical spot checks, and child-like repeated/wrong-order input. Pointer dragging and touch gestures could not be fully exercised because the browser-control surface could click the SVG board but could not reliably drive the app's child-element `pointerdown` gesture path; inspector edits were used where possible.

## 7. Mandatory test-case execution

| ID | Operation | Variations Tested | Expected Result | Actual Result | Status | Defect ID | Evidence |
| -- | --------- | ----------------- | --------------- | ------------- | ------ | --------- | -------- |
| TC-001 | Open module | Desktop, tablet, mobile; canvas/toolbox/registry/inspector | Complete, understandable launch | Opened correctly; responsive with no horizontal overflow, but nested `main` landmarks and dense mobile controls | Pass | BUG-2DG-021, BUG-2DG-022 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-001--initial-launch-and-responsive-layout` |
| TC-002 | Create one free point | Multiple placements, exact edit, keyboard focus, Escape | Correct quadrant/axis coordinates; draggable with Undo/Redo | Creation works; displayed coordinate updates through inspector, but direct drag was not reliably automatable and Undo is destructive | Partial | BUG-2DG-003, BUG-2DG-004 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-002--exact-coordinate-mismatch` |
| TC-003 | Create multiple points | 20 and 100 points, overlaps, naming, deletion | Readable unique names and selectable overlap | A–Z are usable; after Z labels become punctuation/control characters; overlap has no selection menu | Fail | BUG-2DG-008 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-009--100-point-stress-and-naming-failure` |
| TC-004 | Exact-coordinate point | Positive, zero, blank, large; fraction discoverability | Inputs represent mathematical coordinates with helpful validation | Inspector fields are raw 640×420 canvas pixels; `x=0,y=0` displays `(-8,5.5)`; huge values accepted without error | Fail | BUG-2DG-004, BUG-2DG-020 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-002--exact-coordinate-mismatch` |
| TC-005 | Rename points | Duplicate, blank, long | Unique supported mathematical labels with validation | Duplicate `A` allowed; names silently limited to three characters; blank silently reverts | Fail | BUG-2DG-017 | — |
| TC-006 | Point appearance | Size 18, opacity .5, hidden label, color attempt, Save/Load | Style changes and persists | Size, opacity, and label mode persisted after manual Load; color automation did not commit, so color persistence is unverified | Partial | — | — |
| TC-007 | Select overlapping points | 100 coincident points; registry selection | Each point selectable with disambiguation | Registry can select entries; canvas offers no overlap chooser and child hit testing could not be fully automated | Partial | BUG-2DG-008 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-009--100-point-stress-and-naming-failure` |
| TC-008 | Grid, axes, snapping | Toggle controls, reload, grid/object snap UI | Accurate toggles and snap at zoom levels | Controls exist and Save payload includes settings; axis-specific/intersection snap and zoom-dependent accuracy were not demonstrable | Partial | BUG-2DG-010 | — |
| TC-009 | Line through points | Line/vertical/horizontal/degenerate attempts | Dynamic line plus equation, slope, intercept | Line object renders, but no equation/slope/intercept is exposed; zero-length line can be certified | Partial | BUG-2DG-013 | — |
| TC-010 | Line from equation | Tool search and inspector | Parse supported equation forms with validation | No equation-line creation UI | Not Implemented | BUG-2DG-013 | — |
| TC-011 | Segment | Coincident input, live length, inspector edit | Finite segment and correct length | Finite segment and length exist; arbitrary endpoint drag/very long cases not fully exercised | Partial | — | — |
| TC-012 | Ray | Creation, coincident input, SVG rendering review | Correct direction and arrow at zoom levels | Ray/arrow implementation exists; reverse and zoom behavior not fully testable because zoom is inert | Partial | BUG-2DG-010 | — |
| TC-013 | Parallel lines | Three-pick and degenerate input | Preserved parallel constraint | Constraint tool creates objects, but complete dynamic drag verification was unavailable and degenerate input lacks useful validation | Partial | BUG-2DG-020 | — |
| TC-014 | Perpendicular lines | Three-pick and degenerate input | Preserved 90° constraint | Constraint path exists; complete dynamic and vertical/horizontal verification was unavailable | Partial | BUG-2DG-020 | — |
| TC-015 | Perpendicular bisector | Two-pick coincident input | Midpoint/perpendicular/equidistance | Tool creates midpoint, line, and constraint; coincident invalid input is still certified | Partial | BUG-2DG-020 | — |
| TC-016 | Three-point angle | Coincident/degenerate points | Correct acute/right/obtuse/reflex measurement | Coincident points produce three 90° angles in a zero-size triangle and receive 100% certification | Fail | BUG-2DG-002 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-003--degenerate-triangle-false-certification` |
| TC-017 | Fixed-size angle | Search for fixed-angle tool | Constrained requested angles/orientations | No fixed-angle tool or input | Not Implemented | BUG-2DG-013 | — |
| TC-018 | Angle bisector | Three-pick and coincident input | Equal dynamic angles | Tool exists, but numerical equality/reflex/near-straight handling is not exposed and invalid input is certified | Partial | BUG-2DG-020 | — |
| TC-019 | Point distance | Segment measurement, coincident input | 3-4-5 and live point distance | Line/segment distance is displayed; no dedicated two-point measure workflow and exact 3-4-5 UI construction was impeded by pointer automation | Partial | — | — |
| TC-020 | Midpoint | Two-point tool, coincident input, parent deletion review | Correct dependent midpoint and safe deletion | Midpoint constraint exists; parent deletion/recovery is unsafe | Partial | BUG-2DG-009 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-007--parent-deletion-mutates-square` |
| TC-021 | General triangle | Degenerate triangle, live area/perimeter/angles | Correct values, 180° sum, degeneracy rejection | Area/perimeter are zero but angles are 90°+90°+90° and accuracy is certified 100% | Fail | BUG-2DG-002 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-003--degenerate-triangle-false-certification` |
| TC-022 | Equilateral triangle | Tool search and available shape list | Constrained equilateral construction | No equilateral-triangle tool or constraint | Not Implemented | BUG-2DG-012 | — |
| TC-023 | Isosceles triangle | Tool search | Constrained isosceles construction | No isosceles-triangle workflow | Not Implemented | BUG-2DG-012 | — |
| TC-024 | Right triangle | Tool search | Constrained right triangle with marker | No right-triangle workflow | Not Implemented | BUG-2DG-012 | — |
| TC-025 | Scalene triangle | Tool search/classification review | Dynamic scalene classification | No triangle classification | Not Implemented | BUG-2DG-012 | — |
| TC-026 | Acute triangle | Classification review | Live acute/right/obtuse transitions | No triangle classification | Not Implemented | BUG-2DG-012 | — |
| TC-027 | Obtuse triangle | Classification review | Live classification | No triangle classification | Not Implemented | BUG-2DG-012 | — |
| TC-028 | Medians and centroid | Tool search | Three medians, centroid, 2:1 proof | No median/centroid workflow | Not Implemented | BUG-2DG-012 | — |
| TC-029 | Altitudes and orthocenter | Tool search | Altitudes and orthocenter | No altitude/orthocenter workflow | Not Implemented | BUG-2DG-012 | — |
| TC-030 | Circumcenter/circumcircle | Tool search | Three bisectors and circumcircle | Low-level bisector/circle tools exist, but no complete centre construction workflow | Not Implemented | BUG-2DG-012 | — |
| TC-031 | Incenter/incircle | Tool search | Three angle bisectors and incircle | No incenter/incircle workflow | Not Implemented | BUG-2DG-012 | — |
| TC-032 | Heron's formula | UI and measurement review | Side-based Heron calculation and invalid handling | No Heron result or method disclosure | Not Implemented | BUG-2DG-012 | — |
| TC-033 | Square | Quick create; area/perimeter/angles; move/rotate/dilate; point edit | Preserved square constraints and correct properties | Initial math is correct (`8.41`, `11.6`, four 90°); arbitrary vertex edits can destroy the square without reclassification | Partial | — | — |
| TC-034 | Rectangle | Quick create, known 140×90 px shape, vertex edit, Undo/Redo | Correct dynamic rectangle constraints | Initial area `7.88`, perimeter `11.5`, four 90°; individual edit breaks rectangle and Undo/Redo loses polygon | Partial | BUG-2DG-003 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-004--undoredo-loses-polygon` |
| TC-035 | Parallelogram | Quick create, math, transforms | Parallel/equal sides retained | Correct-looking initial angles `75.4/104.6`; no classification/constraint protection after arbitrary edits | Partial | — | — |
| TC-036 | Rhombus | Quick create, math, transforms | Equal sides, diagonal facts, area | Initial area/perimeter/angles shown; side equality and diagonal properties are not explicitly reported or constrained | Partial | — | — |
| TC-037 | Trapezoid | Quick create, math | Parallel-pair, height, median, classification | Isosceles-looking preset with valid angles; no height/median/classification or non-isosceles mode | Partial | — | — |
| TC-038 | Kite | Quick create, math | Adjacent equal sides and diagonal properties | Preset renders and measures; defining properties/classification are absent | Partial | — | — |
| TC-039 | Regular pentagon | Quick create, measurements, transforms | Equal sides/angles and 540° sum | Five 108° angles, area, and perimeter were correctly displayed; move/rotate/dilate commands remained responsive | Pass | — | — |
| TC-040 | Regular hexagon | Quick create, measurements, transforms | Correct 120° angles and circle relationships | Six 120° angles and measurements pass; inscribed/circumscribed circle workflow and extreme zoom are unavailable | Partial | BUG-2DG-010 | — |
| TC-041 | Regular polygon side counts | Tool search and regular-polygon tool | 3–50/max and invalid-count validation | Tool is fixed to five sides; no side-count input or validation | Not Implemented | BUG-2DG-014 | — |
| TC-042 | Irregular polygon | Generic polygon tool and editable vertices | 8+ vertices, area/perimeter, add/remove vertex | Generic polygon path exists and coordinates can be edited; no explicit vertex add/remove UI | Partial | — | — |
| TC-043 | Concave polygon | Vertex edits and classification review | Correct area/fill and convexity transition | Geometry can be reshaped, but concave/convex classification is absent | Partial | — | — |
| TC-044 | Self-intersecting polygon | Exact bow-tie vertices `(0,0),(2,2),(0,2),(2,0)` | Reject or disclose area convention | Accepted, displays area `0`, and is certified 100% without warning | Fail | BUG-2DG-006 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-006--self-intersecting-polygon-false-certification` |
| TC-045 | Polygon properties | Known quick shapes and live edits | Sides, lengths, angles, diagonals, area, perimeter, class | Area/perimeter/angles update; individual side lengths, diagonals, and classification are missing | Partial | — | — |
| TC-046 | Edit/resize polygon | Exact point edit; move/rotate/dilate selected | Correct live transformations | Fixed move/rotation/dilation commands work and measurements update; free resize/reflection and constraint semantics are incomplete | Partial | — | — |
| TC-047 | Center-radius circle | Quick circle, zero radius, radius editor | Valid radius; diameter/circumference/area; reject ≤0 | Zero-radius circle is accepted and certified; center is displayed in pixels; circumference/area absent | Fail | BUG-2DG-005, BUG-2DG-007 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-005--circle-unit-and-degeneracy-defects` |
| TC-048 | Circle through three points | Coincident/collinear attempt | Valid circle or constructive error | Coincident points do not produce a circle but no student-facing validation appears; accuracy still says certified | Fail | BUG-2DG-020 | — |
| TC-049 | Circle using diameter | Tool search | Diameter-defined circle and Thales check | No diameter-circle tool | Not Implemented | BUG-2DG-015 | — |
| TC-050 | Circle tangents | Tangent/polar tool attempts | Perpendicular tangent and external-point validation | Tangent tool exists; full external/inside-point validation and numeric perpendicular proof are absent | Partial | BUG-2DG-020 | — |
| TC-051 | Secants/chords | Tool search | Dedicated chord/secant relations | No discoverable chord/secant workflow | Not Implemented | BUG-2DG-015 | — |
| TC-052 | Arc/sector | Arc/sector tools with coincident input | Arc length, central angle, sector area | Visual tools exist; required numerical arc/sector properties and invalid-input handling are absent | Partial | BUG-2DG-020 | — |
| TC-053 | Center-radii ellipse | Quick ellipse and registry/measurements | Center, axes, foci, eccentricity, area, validation | Implemented as a 48-sample locus only; no ellipse mathematics | Fail | BUG-2DG-011 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-011--ellipse-is-a-sampled-locus` |
| TC-054 | Ellipse using foci | Tool search | Sum-of-distances ellipse | No ellipse-by-foci workflow | Not Implemented | BUG-2DG-015 | — |
| TC-055 | Transform ellipse | Locus hide/show and generic controls | Move/resize/rotate/reflect with updated foci | Generic locus can be hidden/resized, but no ellipse-specific properties, foci, or guarantees | Partial | BUG-2DG-011 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-011--ellipse-is-a-sampled-locus` |
| TC-056 | Semicircle/quarter circle | Semicircle quick tool; quarter-circle search | Correct area/arc/perimeter and endpoints | Semicircle is an unmeasured sampled locus; quarter circle absent | Fail | BUG-2DG-015 | — |
| TC-057 | Translate objects | Selected square Move and translate tool | Exact vector and invariant math | Fixed translation preserves square area/perimeter; arbitrary exact-vector UI is absent | Partial | — | — |
| TC-058 | Rotate objects | Selected square Rotate and 45° tool | Requested arbitrary centers/angles | Fixed rotation preserves measurements; no arbitrary angle/center input | Partial | — | — |
| TC-059 | Reflect objects | Mirror/Reflect discovery | Axes, custom line, point, double reflection | General mirror tool exists, but requested axis/point presets and double-reflection verification are incomplete | Partial | — | — |
| TC-060 | Dilate/scale | Selected square dilation and 1.5× tool | Exact factors including invalid values | Fixed dilation scales area/perimeter correctly; no arbitrary factor/center validation UI | Partial | — | — |
| TC-061 | Duplicate/copy/paste | Inspector Duplicate and tool search | Independent copy with preserved dependencies | Duplicate implementation is exposed, but copy/paste is absent and full dependency independence was not confirmed | Partial | — | — |
| TC-062 | Layer order/visibility | Hide/show; Layers tab; Add layer | Working order, custom layers, lock, visibility | Hide/show works; Add layer is inert and there are no bring-forward/send-back controls | Fail | BUG-2DG-018 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-014--layers-and-export` |
| TC-063 | Delete parent/dependents | Delete square vertex via selected actions; inspect; Undo | Warning and safe cascade; full recovery | No warning; square silently becomes a triangle. Undo does not restore parent/dependencies | Fail | BUG-2DG-009, BUG-2DG-003 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-007--parent-deletion-mutates-square` |
| TC-064 | Long Undo/Redo | Create rectangle, edit vertex, Undo, Redo | Exact reversible history | Undo removes polygon but leaves points; Redo does not restore polygon | Fail | BUG-2DG-003 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-004--undoredo-loses-polygon` |
| TC-065 | Save/close/reopen | Save, reload, manual Load; unsaved navigate/back; refresh | Automatic safe restoration or warning, exact state | Manual Save/Load restores construction/style/settings; unsaved navigate/back or refresh loses all objects without warning | Fail | BUG-2DG-001 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-008--unsaved-navigation-loss` |
| TC-066 | Export construction | Open dialog with selected complex shape | All formats accurate, including selected export | PNG, JSON, CSV, and print/PDF offered; selected-object export remains disabled despite selection; file fidelity not fully inspected | Partial | BUG-2DG-019 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-014--layers-and-export` |
| TC-067 | Import malformed content | Search UI; Load behavior review | Safe file import and damaged-file error | No file import UI; Load only reads browser-saved construction. Malformed storage injection was not performed | Not Implemented | BUG-2DG-016 | — |
| TC-068 | Zoom/pan | Zoom, Pan, Fit; compare SVG viewBox | Viewport changes from min to max | ViewBox remains `0 0 640 420` after every command; Fit has no action | Not Implemented | BUG-2DG-010 | — |
| TC-069 | Crowded construction | 100 point clicks, overlap, registry, timing | Responsive readable mixed construction | No crash; 100 clicks took 28.582 s and UI claimed 60 FPS, but labels after Z are control characters and all automation clicks overlapped | Fail | BUG-2DG-008 | `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-009--100-point-stress-and-naming-failure` |
| TC-070 | Complete school construction | Search and attempt constituent tools | Full triangle-centre dependency construction, save/export | Required medians, centroid, altitudes, orthocenter, circumcenter workflow, incenter workflow, and incircle are unavailable | Not Implemented | BUG-2DG-012 | — |

## 8. Totals

| Status | Total |
| --- | ---: |
| Pass | 2 |
| Fail | 15 |
| Partial | 33 |
| Blocked | 0 |
| Not Implemented | 20 |
| **Total** | **70** |

## 9. Detailed defect records

Twenty-three unique findings are recorded in `PHASE_1_2D_GEOMETRY_DEFECTS.md`. Severity totals: S0 1, S1 5, S2 10, S3 5, S4 1, Enhancement 1.

## 10. Mathematical-accuracy findings

- Known rectangle, square, pentagon, hexagon, parallelogram, trapezoid, rhombus, and kite preset calculations were numerically plausible and internally consistent.
- A degenerate triangle reports area/perimeter zero but three 90° angles, violating the 180° triangle-angle sum, while still showing 100% certification.
- A bow-tie polygon reports area zero without explaining the signed-area convention and is certified 100%.
- A zero-radius circle is accepted and certified.
- Circle centers and exact point fields expose canvas pixels while the registry uses mathematical units.

## 11. Child-usability findings

The broad palette is initially inviting, Escape cancels an unfinished tool, and common actions are visible. However, the interface exposes advanced terms without progressive guidance, accepts invalid geometry without constructive feedback, uses control characters for point names after Z, loses unsaved work silently, and contains many advertised tools that lack the expected school-level measurements or constraints.

## 12. Accessibility findings

- Positive: `lang=en`, one H1, no duplicate IDs, all 263 visible controls had a detectable accessible name in the focused semantic scan, and keyboard focus on Save had a visible outline.
- Failures/risks: two nested `main` landmarks, extensive 10 px navigation/tool text, 313 sub-44-pixel buttons/elements reported in the mobile layout scan (including hidden/zero-sized responsive content), no discoverable dark-theme control, and the mobile panel button did not expose a dialog in this automation run.
- Screen-reader, zoom-reflow, color contrast, and full WCAG/axe testing were not performed.

## 13. Performance and stress findings

The module remained crash-free during the 100-point stress attempt. Creating 100 objects took 28.582 seconds through browser automation. The UI continued to display “60 FPS,” but this appears to be a status readout rather than independently captured frame timing. Labels became unusable after Z. Production build size is also a risk: the MathWorkspace chunk is 1,434.53 kB minified.

## 14. Persistence, import, and export findings

Manual Save then Load restores construction, graph settings, size, opacity, and label mode. Reload does not automatically restore saved work. Unsaved navigation/back and refresh lose the current construction without warning. Export exposes PNG, JSON, CSV, and print/PDF, but selected-object export is disabled even when a polygon is selected. No file import UI exists.

## 15. Unavailable or untested environments

Touch gestures, physical phones/tablets, stylus, Firefox, Safari, Edge, Android, iOS, screen readers, browser zoom, dark theme, low-end hardware profiling, downloaded-file pixel comparison, malformed-storage injection, and long freehand pointer drags were not tested. SVG child-object drag/pick automation was unreliable because the app is driven by `pointerdown` rather than the browser surface's reliable click path.

## 16. Release recommendation

**NOT READY FOR RELEASE**

The S0 unsaved-data-loss defect and S1 history/certification/coordinate defects must be corrected before external student use. The certification indicator must fail closed for degenerate and self-intersecting constructions.

## 17. Remaining risks

Major school-geometry workflows remain absent; gesture-heavy paths need physical-device testing; persistence needs recovery and migration testing; exports require file-level visual validation; accessibility needs screen-reader and contrast audits; and the large workspace bundle needs low-end performance profiling.
