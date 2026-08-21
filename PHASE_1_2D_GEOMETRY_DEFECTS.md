# Phase 1 — 2D Geometry Defects

## Summary

| Severity | Count |
| --- | ---: |
| S0 | 1 |
| S1 | 5 |
| S2 | 10 |
| S3 | 5 |
| S4 | 1 |
| Enhancement | 1 |
| **Total** | **23** |

### BUG-2DG-001 — Unsaved construction is lost on navigation or refresh

* Severity: S0 – Blocker
* Priority: P0
* Related test case: TC-065
* Feature/tool: Persistence and navigation
* Environment: In-app Chromium, desktop
* Preconditions: Create a construction without pressing Save.
* Test data: Four-object construction after editing a square.
* Steps to reproduce:
  1. Create or edit geometry.
  2. Follow Home, then use Back; alternatively refresh.
  3. Return to `/workspace/geometry`.
* Expected result: Warn before leaving or recover the draft automatically.
* Actual result: Construction count changes from four to zero with no warning.
* Reproducibility: 100% in tested flow
* Mathematical impact: All student work and reasoning steps are lost.
* Student impact: Severe; a student cannot recover unsaved work.
* Workaround: Press Save and later press Load manually.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-008--unsaved-navigation-loss`
* Console/log details: No visible crash or error boundary.
* Suggested correction: Add draft autosave/versioning plus `beforeunload` and in-app navigation confirmation.
* Retest status: Open

### BUG-2DG-002 — Degenerate triangle receives 100% certification and three 90° angles

* Severity: S1 – Critical
* Priority: P0
* Related test case: TC-016, TC-021
* Feature/tool: Triangle, measurements, certification
* Environment: In-app Chromium, desktop
* Preconditions: Empty canvas; snapping enabled.
* Test data: Three coincident vertices.
* Steps to reproduce:
  1. Select Triangle.
  2. Click the same snapped position three times.
  3. Read measurements and Construction Accuracy.
* Expected result: Reject the construction or classify it as degenerate with undefined angles.
* Actual result: Area 0, perimeter 0, angles 90°/90°/90°, and “Geometry accuracy certified,” 100%.
* Reproducibility: 100%
* Mathematical impact: Materially false triangle mathematics; angle sum is 270°.
* Student impact: Teaches an invalid result as certified truth.
* Workaround: None reliable; student must identify degeneracy independently.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-003--degenerate-triangle-false-certification`
* Console/log details: No visible console or application error.
* Suggested correction: Fail closed on repeated/coincident vertices and zero-area polygons; never certify undefined angles.
* Retest status: Open

### BUG-2DG-003 — Undo deletes object categories and Redo does not restore them

* Severity: S1 – Critical
* Priority: P0
* Related test case: TC-002, TC-034, TC-063, TC-064
* Feature/tool: Undo/Redo
* Environment: In-app Chromium, desktop
* Preconditions: Create a rectangle and edit a vertex.
* Test data: Rectangle area 7.88, perimeter 11.5; edited area 6.75.
* Steps to reproduce:
  1. Create a rectangle.
  2. Change one vertex x coordinate.
  3. Press Undo, then Redo.
* Expected result: Undo only the edit; Redo restore it exactly.
* Actual result: Undo removes the polygon but leaves its four points; Redo leaves the polygon missing.
* Reproducibility: 100%
* Mathematical impact: Construction/dependency state becomes inconsistent.
* Student impact: History controls destroy work.
* Workaround: Save before each edit and Load manually.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-004--undoredo-loses-polygon`
* Console/log details: Implementation removes the last polygon/circle/line/point rather than restoring snapshots.
* Suggested correction: Implement bounded immutable undo/redo snapshot or command history, including selections, styles, constraints, and dependencies.
* Retest status: Open

### BUG-2DG-004 — Exact-coordinate editor uses canvas pixels instead of mathematical coordinates

* Severity: S1 – Critical
* Priority: P0
* Related test case: TC-002, TC-004
* Feature/tool: Point inspector
* Environment: In-app Chromium, desktop
* Preconditions: Create and select a point.
* Test data: Enter x=0 and y=0.
* Steps to reproduce:
  1. Select a point from Objects & Algebra.
  2. Enter `0` in both inspector coordinate fields.
  3. Read the object-list coordinate.
* Expected result: Point is `(0,0)`.
* Actual result: Point is `(-8,5.5)` because fields use raw 640×420 SVG pixels.
* Reproducibility: 100%
* Mathematical impact: Exact constructions are placed at the wrong coordinates.
* Student impact: Basic coordinate-plane learning is contradicted by the UI.
* Workaround: Convert manually using `pixelX=40(x+8)`, `pixelY=40(5.5-y)`.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-002--exact-coordinate-mismatch`
* Console/log details: No error.
* Suggested correction: Expose mathematical values in the inspector and transform them internally at one coordinate boundary.
* Retest status: Open

### BUG-2DG-005 — Zero-radius circle is accepted and certified

* Severity: S1 – Critical
* Priority: P0
* Related test case: TC-047
* Feature/tool: Circle and certification
* Environment: In-app Chromium, desktop
* Preconditions: Empty canvas, snapping enabled.
* Test data: Coincident center and edge.
* Steps to reproduce:
  1. Select Circle.
  2. Click the same snapped position twice.
  3. Inspect radius and certification.
* Expected result: Reject radius zero with a student-friendly message.
* Actual result: Circle reports `r=0` and receives 100% certification.
* Reproducibility: 100%
* Mathematical impact: Invalid circle is represented as valid.
* Student impact: Misstates the domain of a circle construction.
* Workaround: Avoid coincident points.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-005--circle-unit-and-degeneracy-defects`
* Console/log details: No error.
* Suggested correction: Enforce a positive radius tolerance in builder and certification layers.
* Retest status: Open

### BUG-2DG-006 — Self-intersecting polygon is certified without area-convention disclosure

* Severity: S1 – Critical
* Priority: P0
* Related test case: TC-044
* Feature/tool: Polygon measurements and certification
* Environment: In-app Chromium, desktop
* Preconditions: Create a four-vertex polygon.
* Test data: `(0,0),(2,2),(0,2),(2,0)`.
* Steps to reproduce:
  1. Create a square.
  2. Edit vertices to the bow-tie coordinates.
  3. Inspect area and certification.
* Expected result: Reject self-intersection or clearly identify the area convention and uncertified topology.
* Actual result: Area is 0 and construction is certified 100% with no warning.
* Reproducibility: 100%
* Mathematical impact: Ambiguous polygon area is presented as settled truth.
* Student impact: Conceals a key topology/domain condition.
* Workaround: Manually ensure a simple vertex order.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-006--self-intersecting-polygon-false-certification`
* Console/log details: No error.
* Suggested correction: Detect segment intersections; reject or label winding/even-odd/signed-area semantics and fail certification.
* Retest status: Open

### BUG-2DG-007 — Circle measurement mixes mathematical radius with pixel center coordinates

* Severity: S2 – High
* Priority: P1
* Related test case: TC-047
* Feature/tool: Circle live measurements
* Environment: In-app Chromium, desktop
* Preconditions: Create Circle Shape.
* Test data: Center listed as `(0,0.25)` in registry.
* Steps to reproduce:
  1. Create Circle Shape.
  2. Compare registry and Live Measurements.
* Expected result: One consistent mathematical coordinate system.
* Actual result: Registry shows `(0,0.25)` while measurement shows `center=(320,210)` and duplicates `r=1.8`.
* Reproducibility: 100%
* Mathematical impact: Units are inconsistent in one result.
* Student impact: Confusing and likely interpreted as two different centers.
* Workaround: Ignore the center measurement and use registry conversion.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-005--circle-unit-and-degeneracy-defects`
* Console/log details: No error.
* Suggested correction: Convert center to mathematical coordinates and remove duplicate radius text.
* Retest status: Open

### BUG-2DG-008 — Automatic point names become control characters after Z

* Severity: S2 – High
* Priority: P1
* Related test case: TC-003, TC-007, TC-069
* Feature/tool: Point naming/object registry
* Environment: In-app Chromium, desktop
* Preconditions: Empty construction.
* Test data: 100 points.
* Steps to reproduce:
  1. Select Point.
  2. Create at least 27 points.
  3. Inspect labels after Z.
* Expected result: A1/B1 or another readable collision-free naming scheme.
* Actual result: ASCII punctuation then C1 control characters are used.
* Reproducibility: 100%
* Mathematical impact: Objects cannot be referenced reliably.
* Student impact: Registry and labels become unreadable.
* Workaround: Manually rename each point, limited to three characters.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-009--100-point-stress-and-naming-failure`
* Console/log details: No crash; 100 creations took 28.582 s.
* Suggested correction: Generate A–Z, A1–Z1, A2–Z2 with uniqueness validation.
* Retest status: Open

### BUG-2DG-009 — Deleting a parent point silently changes a square into a triangle

* Severity: S2 – High
* Priority: P1
* Related test case: TC-020, TC-063
* Feature/tool: Delete and dependency handling
* Environment: In-app Chromium, desktop
* Preconditions: Create a square and select one vertex.
* Test data: Default square.
* Steps to reproduce:
  1. Delete vertex A using Selected object actions.
  2. Inspect the remaining polygon.
  3. Attempt Undo.
* Expected result: Warn, cascade safely, or mark dependent object broken; Undo fully restores.
* Actual result: Square silently becomes a three-vertex polygon with triangle measurements; Undo is destructive.
* Reproducibility: 100%
* Mathematical impact: Object identity and constraints change without consent.
* Student impact: Unexpected mutation and unrecoverable work.
* Workaround: Save first; delete the entire polygon instead.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-007--parent-deletion-mutates-square`
* Console/log details: No warning dialog or error.
* Suggested correction: Model parent/dependent deletion policy explicitly and make the action atomic/reversible.
* Retest status: Open

### BUG-2DG-010 — Pan, Zoom, and Fit controls do not change the 2D viewport

* Severity: S2 – High
* Priority: P1
* Related test case: TC-008, TC-012, TC-040, TC-068
* Feature/tool: Canvas navigation
* Environment: In-app Chromium, desktop
* Preconditions: Open geometry board.
* Test data: SVG viewBox `0 0 640 420`.
* Steps to reproduce:
  1. Select Zoom and interact with canvas.
  2. Select Pan and interact with canvas.
  3. Press Fit view.
* Expected result: Viewport scale/translation changes and Fit restores it.
* Actual result: ViewBox remains `0 0 640 420`; Fit has no action handler.
* Reproducibility: 100%
* Mathematical impact: Extreme-scale constructions cannot be inspected.
* Student impact: Prominent navigation controls appear broken.
* Workaround: None.
* Evidence: Recorded DOM/viewBox comparison in execution notes.
* Console/log details: No error.
* Suggested correction: Add explicit 2D view state, bounded wheel/pinch zoom, pan, fit-to-construction, and snap transforms.
* Retest status: Open

### BUG-2DG-011 — Ellipse is only an unmeasured 48-sample locus

* Severity: S2 – High
* Priority: P1
* Related test case: TC-053, TC-055
* Feature/tool: Ellipse
* Environment: In-app Chromium, desktop
* Preconditions: Empty canvas.
* Test data: Default ellipse.
* Steps to reproduce:
  1. Select Ellipse and click canvas.
  2. Inspect Objects, Measurements, and Properties.
* Expected result: Center, radii, axes, foci, eccentricity, and area.
* Actual result: Registry says `ellipse — 48 samples`; no measurements or ellipse properties.
* Reproducibility: 100%
* Mathematical impact: The object has no semantic ellipse model.
* Student impact: Tool looks complete but cannot teach ellipse mathematics.
* Workaround: None in this module.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-011--ellipse-is-a-sampled-locus`
* Console/log details: No error.
* Suggested correction: Add a typed ellipse object with invariant definitions and derived properties.
* Retest status: Open

### BUG-2DG-012 — Required triangle variants, centers, and complete construction are absent

* Severity: S2 – High
* Priority: P1
* Related test case: TC-022–TC-032, TC-070
* Feature/tool: School triangle constructions
* Environment: In-app Chromium, all tested layouts
* Preconditions: Search Geometry Tools.
* Test data: `centroid`, `orthocenter`, `circumcenter`, `incenter`.
* Steps to reproduce:
  1. Search each term.
  2. Inspect available Triangle and Construct groups.
* Expected result: Discoverable constrained triangle variants and centers.
* Actual result: No matching tools; only low-level operations exist.
* Reproducibility: 100%
* Mathematical impact: Mandatory curriculum constructions cannot be completed as requested.
* Student impact: Major release gap.
* Workaround: Assemble some low-level steps manually; several centers remain unsupported.
* Evidence: Search result counts were zero.
* Console/log details: No error.
* Suggested correction: Add guided, dependency-aware triangle constructors and centre tools with proofs/measurements.
* Retest status: Open

### BUG-2DG-013 — Line equations and fixed-angle construction are absent

* Severity: S2 – High
* Priority: P1
* Related test case: TC-009, TC-010, TC-017
* Feature/tool: Lines and angles
* Environment: In-app Chromium
* Preconditions: Search tools and inspect selected line.
* Test data: `equation`, `fixed angle`.
* Steps to reproduce:
  1. Search for equation and fixed angle.
  2. Select an existing line and inspect properties.
* Expected result: Equation entry/validation and constrained angle values.
* Actual result: Zero matching tools; line equation, slope/intercept, and fixed-angle input absent.
* Reproducibility: 100%
* Mathematical impact: Core analytic/school geometry workflows missing.
* Student impact: Important advertised module scope incomplete.
* Workaround: None in 2D Geometry.
* Evidence: Search result counts were zero.
* Console/log details: No error.
* Suggested correction: Add safe equation parser and exact-angle constraint.
* Retest status: Open

### BUG-2DG-014 — Regular polygon tool is fixed to five sides

* Severity: S2 – High
* Priority: P1
* Related test case: TC-041
* Feature/tool: Regular Polygon
* Environment: In-app Chromium
* Preconditions: Select Regular Polygon.
* Test data: Requested 3,4,5,6,8,10,12,20,50 and invalid counts.
* Steps to reproduce:
  1. Search/select Regular Polygon.
  2. Look for side-count input.
* Expected result: Bounded integer input with validation.
* Actual result: No side-count input; implementation is fixed to five sides.
* Reproducibility: 100%
* Mathematical impact: Cannot explore the regular-polygon family.
* Student impact: Tool label overstates capability.
* Workaround: Use separate Pentagon/Hexagon presets only.
* Evidence: UI inspection.
* Console/log details: No error.
* Suggested correction: Add integer `n` with clear bounds, performance profile, and derived angle formulas.
* Retest status: Open

### BUG-2DG-015 — Diameter, chord/secant, ellipse-by-foci, and quarter-circle workflows are absent

* Severity: S2 – High
* Priority: P1
* Related test case: TC-049, TC-051, TC-054, TC-056
* Feature/tool: Circle/ellipse family
* Environment: In-app Chromium
* Preconditions: Search tools.
* Test data: `ellipse foci`, `quarter circle`; inspect circle tools.
* Steps to reproduce:
  1. Search requested features.
  2. Inspect Curves and Shapes groups.
* Expected result: Curriculum-level constructions and measurements.
* Actual result: No matching workflows.
* Reproducibility: 100%
* Mathematical impact: Required theorems/relationships cannot be validated.
* Student impact: Major curriculum gaps.
* Workaround: Approximate with low-level objects where possible.
* Evidence: Search result counts were zero for ellipse foci and quarter circle.
* Console/log details: No error.
* Suggested correction: Add typed construction objects and guided protocols.
* Retest status: Open

### BUG-2DG-016 — Geometry project file import is absent

* Severity: S2 – High
* Priority: P1
* Related test case: TC-067
* Feature/tool: Import/Load
* Environment: In-app Chromium
* Preconditions: Open toolbar and Export dialog.
* Test data: Search `import`.
* Steps to reproduce:
  1. Search for Import.
  2. Inspect Load behavior.
* Expected result: Select JSON file, validate schema, quarantine damage, preserve current work.
* Actual result: Load reads only one browser-local save; no file chooser/import validation.
* Reproducibility: 100%
* Mathematical impact: Saved projects cannot be exchanged or safely recovered.
* Student impact: Exported JSON is described as editable later but cannot be imported here.
* Workaround: None in the UI.
* Evidence: Search result count zero.
* Console/log details: No error.
* Suggested correction: Add versioned, transactional file import with preview and rollback.
* Retest status: Open

### BUG-2DG-017 — Point renaming allows duplicates and silently truncates labels

* Severity: S3 – Medium
* Priority: P2
* Related test case: TC-005
* Feature/tool: Point Label inspector
* Environment: In-app Chromium
* Preconditions: At least two points.
* Test data: Duplicate `A`, blank, `ABCDEFGHIJ`.
* Steps to reproduce:
  1. Select B.
  2. Rename it A, then enter a long name, then blank.
* Expected result: Explain supported syntax and reject duplicates/blank.
* Actual result: Duplicate accepted; long text silently becomes `ABC`; blank silently reverts.
* Reproducibility: 100%
* Mathematical impact: Ambiguous dependent expressions.
* Student impact: Confusing naming behavior.
* Workaround: Manually use unique one-to-three-character labels.
* Evidence: Execution log.
* Console/log details: No error or alert.
* Suggested correction: Validate uniqueness/syntax and show inline messages.
* Retest status: Open

### BUG-2DG-018 — Add Layer is inert and layer ordering is unavailable

* Severity: S3 – Medium
* Priority: P2
* Related test case: TC-062
* Feature/tool: Layers
* Environment: In-app Chromium
* Preconditions: Open Layers tab.
* Test data: One polygon and four points.
* Steps to reproduce:
  1. Press Add layer.
  2. Look for bring-forward/send-back or reorder controls.
* Expected result: New layer appears and objects/layers can be reordered.
* Actual result: Layer count remains four; no reorder controls.
* Reproducibility: 100%
* Mathematical impact: None directly.
* Student impact: Overlapping constructions cannot be organized as advertised.
* Workaround: Use fixed layer visibility only.
* Evidence: DOM execution log.
* Console/log details: No error.
* Suggested correction: Implement or remove inert control; add accessible reorder commands.
* Retest status: Open

### BUG-2DG-019 — Selected-object export stays disabled after selecting an object

* Severity: S3 – Medium
* Priority: P2
* Related test case: TC-066
* Feature/tool: Export
* Environment: In-app Chromium
* Preconditions: Select a polygon and open Export.
* Test data: Selected square.
* Steps to reproduce:
  1. Select Polygon 1.
  2. Open Export.
* Expected result: Selected object export enabled.
* Actual result: Button remains disabled with “Available after selection.”
* Reproducibility: 100%
* Mathematical impact: None.
* Student impact: Promised export option cannot be used.
* Workaround: Export the entire project.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-014--layers-and-export`
* Console/log details: No error.
* Suggested correction: Wire selection to export serializer or remove option until supported.
* Retest status: Open

### BUG-2DG-020 — Invalid and degenerate input lacks constructive feedback

* Severity: S3 – Medium
* Priority: P2
* Related test case: TC-004, TC-013–TC-018, TC-041, TC-047, TC-048, TC-050, TC-052
* Feature/tool: Validation/error messages
* Environment: In-app Chromium
* Preconditions: Use coincident points, blank/huge coordinates, or invalid radius.
* Test data: radius 0/−1; three coincident points; x=1,000,000,000.
* Steps to reproduce:
  1. Enter invalid or degenerate data.
  2. Observe message/alert region.
* Expected result: Specific, age-appropriate error and recovery guidance.
* Actual result: Values are silently clamped/accepted, construction simply fails, or certification remains positive; no alert role appears.
* Reproducibility: Frequent across listed cases.
* Mathematical impact: Preconditions and domains are hidden.
* Student impact: Student cannot understand what to correct.
* Workaround: Trial and error.
* Evidence: Zero-radius and degenerate-triangle screenshots.
* Console/log details: No visible application exception.
* Suggested correction: Centralize validation diagnostics and expose them beside the active tool and affected object.
* Retest status: Open

### BUG-2DG-021 — Geometry route contains nested main landmarks and extensive 10 px text

* Severity: S4 – Low
* Priority: P2
* Related test case: TC-001 and accessibility review
* Feature/tool: Semantics/readability
* Environment: Desktop, tablet, mobile emulation
* Preconditions: Open route.
* Test data: Semantic DOM scan.
* Steps to reproduce:
  1. Count `main` and H1 elements.
  2. Inspect computed text sizes.
* Expected result: One main landmark and readable text.
* Actual result: Two nested `main` elements; many navigation/tool labels are 10 px.
* Reproducibility: 100%
* Mathematical impact: None.
* Student impact: Harder screen-reader navigation and small-text readability.
* Workaround: Browser zoom, although canvas zoom is unrelated/inert.
* Evidence: Semantic scan in execution report.
* Console/log details: No error.
* Suggested correction: Replace inner `main` with section/div and raise minimum instructional/control text size.
* Retest status: Open

### BUG-2DG-022 — Mobile controls frequently miss the 44 px touch-target target

* Severity: S3 – Medium
* Priority: P2
* Related test case: TC-001 and mobile accessibility review
* Feature/tool: Responsive/touch UI
* Environment: 390×844 emulation
* Preconditions: Open mobile layout.
* Test data: Visible-control geometry scan.
* Steps to reproduce:
  1. Set viewport to 390×844.
  2. Inspect top actions and visible buttons.
* Expected result: Primary touch controls at least 44×44 px and reliable mobile panel.
* Actual result: Examples include Rename 24.7×36 and top actions 40×36; responsive DOM also contains many zero-sized/hidden controls. Panel button did not expose a dialog in this automation run.
* Reproducibility: Layout sizes 100%; panel interaction requires physical retest.
* Mathematical impact: None.
* Student impact: Increased mis-taps and poor first-use navigation.
* Workaround: Use desktop/tablet.
* Evidence: `test-evidence/phase-1-2d-geometry/EVIDENCE_LOG.md#ev-001--initial-launch-and-responsive-layout`
* Console/log details: No crash.
* Suggested correction: Enforce 44 px minimum hit areas and test drawer focus-trap/open/close on physical touch devices.
* Retest status: Open

### BUG-2DG-023 — No discoverable light/dark theme control in the geometry route

* Severity: Enhancement
* Priority: P3
* Related test case: Environment matrix
* Feature/tool: Theme
* Environment: In-app Chromium
* Preconditions: Open route.
* Test data: Accessible-name search for theme/dark/light.
* Steps to reproduce:
  1. Inspect navigation and workspace controls.
  2. Search visible accessible names for theme controls.
* Expected result: If both themes are supported, provide a discoverable switch or documented system behavior.
* Actual result: Light color scheme only; no matching control.
* Reproducibility: 100%
* Mathematical impact: None.
* Student impact: Reduced comfort/accessibility options.
* Workaround: OS/browser-level appearance settings may affect other routes, not verified here.
* Evidence: Environment scan.
* Console/log details: No error.
* Suggested correction: Add or document theme selection and independently audit contrast in both modes.
* Retest status: Open
