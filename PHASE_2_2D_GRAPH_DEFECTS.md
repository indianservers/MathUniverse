# Phase 2 — 2D Graph Defects

Build 1.0.1, commit `2662c27`, tested 2026-08-20 in Chromium through the restarted `/workspace/graph` UI.

### BUG-P2-012 — Refresh destroys the graph workspace and no Save or Export exists

* Module: 2D Graph
* Severity: S0 — Blocker
* Priority: P0
* Related test case: 2DG-008, 044, 065
* Environment: Desktop Chromium
* Preconditions: Create a populated graph
* Test data: 10 plots, renamed/styled graph, x=-1000..0.0001, a=-3.5
* Steps to reproduce:
  1. Create/edit/style multiple plots and viewport.
  2. Confirm there is no Save or Export control.
  3. Refresh the page.
* Expected result: Work is saved/recoverable and can be exported.
* Actual result: 10 plots become the default single `sin(x)` plot and viewport resets; only slider URL values survive.
* Reproducibility: 100%
* Mathematical impact: Complete investigations and dependencies are lost.
* Student impact: Unavoidable accidental data loss on refresh/navigation.
* Workaround: None; manually copy expressions elsewhere.
* Evidence: `test-evidence/phase-2/2d-graph/EVIDENCE_LOG.md`
* Console or log details: No crash/error; state is simply reinitialized.
* Suggested correction: Implement explicit save/load, navigation guard, autosave recovery, and export with tests.
* Retest status: Open

### BUG-P2-013 — Unequal axis pixel scales turn circles into ellipses and distort conics

* Module: 2D Graph
* Severity: S1 — Critical
* Priority: P0
* Related test case: 2DG-003, 045–050, 052–053
* Environment: Desktop/tablet/mobile viewport emulation
* Preconditions: Default x/y ranges -10..10
* Test data: `x^2+y^2=25`, parametric/polar circles, ellipse, parabola, hyperbola
* Steps to reproduce:
  1. Plot `x^2+y^2=25`.
  2. Inspect the 640×360 SVG using equal numeric axis ranges.
  3. Compare horizontal and vertical radius in pixels.
* Expected result: Equal x/y unit scale or an explicit aspect-ratio choice; a circle looks circular.
* Actual result: x scale is 32 px/unit and y scale is 18 px/unit, producing a horizontally stretched ellipse.
* Reproducibility: 100%
* Mathematical impact: Shape, angle, slope appearance, eccentricity, and conic geometry are materially wrong.
* Student impact: Teaches incorrect visual geometry and undermines trust in equations.
* Workaround: Manually choose unequal numeric ranges to compensate; no equal-scale button exists.
* Evidence: Evidence log
* Console or log details: No console error.
* Suggested correction: Preserve equal unit scale by letterboxing/adjusting ranges and add an equal-scale toggle/reset.
* Retest status: Open

### BUG-P2-014 — Vertical lines are rejected as unsupported

* Module: 2D Graph
* Severity: S1 — Critical
* Priority: P0
* Related test case: 2DG-010, 036
* Environment: Desktop Chromium
* Preconditions: Graph editor open
* Test data: `x=4`, `x=0`, `x=-3`
* Steps to reproduce:
  1. Enter `x=4`.
  2. Click Add graph.
  3. Observe validation and object count.
* Expected result: A vertical line with x-intercept 4 and undefined slope.
* Actual result: `Unsupported expression`; the graph is not added.
* Reproducibility: 100%
* Mathematical impact: A fundamental linear relation and y-axis form cannot be graphed.
* Student impact: Contradicts standard school graphing.
* Workaround: None in the Graph module.
* Evidence: Evidence log
* Console or log details: Polite validation status only.
* Suggested correction: Parse single-variable implicit equalities and render vertical contours.
* Retest status: Open

### BUG-P2-015 — Advertised parameter expressions are blocked by validation

* Module: 2D Graph
* Severity: S1 — Critical
* Priority: P0
* Related test case: 2DG-011, 017, 034, 041, 044, 062
* Environment: Desktop Chromium
* Preconditions: a and b sliders visible
* Test data: `a*x+b`, a=2, b=3
* Steps to reproduce:
  1. Enter `a*x+b` in Add graph, following the on-page instruction.
  2. Click Add graph.
  3. Observe `Unsupported name: a`; then edit existing `sin(x)` to `a*x+b`.
* Expected result: The expression is added and responds to a/b sliders.
* Actual result: Add is blocked; editing an existing plot bypasses validation and works, while the stale error remains.
* Reproducibility: 100%
* Mathematical impact: Primary dynamic-function workflow is internally inconsistent.
* Student impact: Following the instruction produces an error and requires an undiscoverable workaround.
* Workaround: Edit an existing plot definition instead of adding a new one.
* Evidence: Evidence log; table showed (0,3),(1,5) after workaround.
* Console or log details: Validation status `Unsupported name: a`.
* Suggested correction: Validate after applying declared parameters and clear stale errors on successful edits.
* Retest status: Open

### BUG-P2-016 — Adding an 11th graph silently deletes earlier work

* Module: 2D Graph
* Severity: S0 — Blocker
* Priority: P0
* Related test case: 2DG-064
* Environment: Desktop Chromium
* Preconditions: 10 graphs already present
* Test data: 50+ mixed accepted expressions
* Steps to reproduce:
  1. Fill the list to 10/10.
  2. Add another valid expression.
  3. Inspect the list and try Undo.
* Expected result: Capacity expands or addition is blocked with a clear recoverable choice.
* Actual result: List remains 10/10 and an older graph is silently evicted; no Undo exists.
* Reproducibility: 100%
* Mathematical impact: Comparisons and investigations become incomplete without notice.
* Student impact: Silent unrecoverable data loss; required 50-plot stress is impossible.
* Workaround: Keep at most 10 and manually track which old graph will disappear.
* Evidence: Evidence log
* Console or log details: No warning/error.
* Suggested correction: Remove arbitrary cap or block additions explicitly; never evict without consent and Undo.
* Retest status: Open

### BUG-P2-017 — School graph analysis and calculus tools are absent

* Module: 2D Graph
* Severity: S1 — Critical
* Priority: P0
* Related test case: 2DG-014, 016, 018–023, 036, 038, 043–044, 054–061, 063
* Environment: Desktop Chromium
* Preconditions: One or more curves plotted
* Test data: line/quadratic/cubic/trig/conic examples
* Steps to reproduce:
  1. Plot representative functions.
  2. Inspect Graph/Studio/Table controls.
  3. Attempt roots, intersections, trace, tangent/normal, extrema, inflection, derivative, integral/area, and animation.
* Expected result: Accurate analysis tools with markers and values.
* Actual result: None of the listed analysis/dynamic tools is exposed in the Graph module.
* Reproducibility: 100%
* Mathematical impact: Mandatory school analysis cannot be performed or verified.
* Student impact: Curves are pictures without the instructional measurements needed for coursework.
* Workaround: Use another module/tool and manually transfer results.
* Evidence: Evidence log feature inventory
* Console or log details: No error; controls absent.
* Suggested correction: Surface the existing analysis kernels in an accessible dependency-aware graph UI.
* Retest status: Open

### BUG-P2-018 — “Table” is not an editable coordinate-pair table

* Module: 2D Graph
* Severity: S2 — High
* Priority: P1
* Related test case: 2DG-004, 005
* Environment: Desktop Chromium
* Preconditions: Table tab open
* Test data: 20 coordinate pairs, blanks/text/duplicates/incomplete rows
* Steps to reproduce:
  1. Open Table.
  2. Attempt to type coordinate pairs into cells.
  3. Attempt edit/delete/style/label individual points.
* Expected result: Editable rows produce point objects.
* Actual result: Read-only values are generated for at most the first three plots; cells are not editable.
* Reproducibility: 100%
* Mathematical impact: Data plotting and scatter investigations are unavailable.
* Student impact: The tab label suggests an input mode that it does not provide.
* Workaround: None within this panel.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add a true editable point-table object with row validation and styling.
* Retest status: Open

### BUG-P2-019 — Step functions are connected across jumps and sign is rejected

* Module: 2D Graph
* Severity: S1 — Critical
* Priority: P1
* Related test case: 2DG-031
* Environment: Desktop Chromium
* Preconditions: Default viewport
* Test data: `floor(x)`, `ceil(x)`, `sign(x)`
* Steps to reproduce:
  1. Add floor and ceiling functions.
  2. Inspect sampled SVG paths near integer boundaries.
  3. Attempt `sign(x)`.
* Expected result: Disconnected horizontal steps with correct open/closed endpoints; sign supported.
* Actual result: Ordinary sampled paths connect jumps and show no endpoints; sign is rejected as an unsupported name.
* Reproducibility: 100%
* Mathematical impact: Function values at/around discontinuities are visually misrepresented.
* Student impact: Teaches incorrect continuity and endpoint inclusion.
* Workaround: Manually create separate piecewise segments, still without endpoint markers.
* Evidence: Evidence log
* Console or log details: Validation `Unsupported name: sign`.
* Suggested correction: Split at discontinuities and render semantic open/closed endpoints; support sign.
* Retest status: Open

### BUG-P2-020 — Holes and piecewise endpoint inclusion are not rendered

* Module: 2D Graph
* Severity: S2 — High
* Priority: P1
* Related test case: 2DG-026, 030, 032
* Environment: Desktop Chromium
* Preconditions: Graph editor open
* Test data: `(x^2-1)/(x-1)`, piecewise interval boundaries
* Steps to reproduce:
  1. Plot the cancelled rational expression.
  2. Plot piecewise functions with boundary changes.
  3. Inspect the boundary/hole points.
* Expected result: Removable hole and open/closed endpoints are explicit.
* Actual result: No open-circle hole or endpoint-inclusion markers are rendered.
* Reproducibility: 100%
* Mathematical impact: Domain and function-value semantics are ambiguous/wrong visually.
* Student impact: Students cannot distinguish included from excluded points.
* Workaround: None; annotate externally.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Preserve domain exclusions in descriptors and render accessible endpoint markers.
* Retest status: Open

### BUG-P2-021 — Canvas navigation, grid, axis, reset, labels, and equal-scale controls are missing

* Module: 2D Graph
* Severity: S2 — High
* Priority: P1
* Related test case: 2DG-002, 003, 015
* Environment: Desktop/tablet/mobile emulation
* Preconditions: Graph workspace open
* Test data: x=-1000..0.0001, unequal ranges
* Steps to reproduce:
  1. Inspect controls around the graph surface.
  2. Attempt pan/zoom/reset/grid/axes/ticks/equal scale/axis labels.
  3. Enter extreme/unequal numeric bounds.
* Expected result: Discoverable navigation/configuration with validation and reset.
* Actual result: Only four unvalidated numeric bound inputs exist.
* Reproducibility: 100%
* Mathematical impact: Scale and viewport mistakes are easy and exact geometry is distorted.
* Student impact: Recovery and labelled modelling are difficult.
* Workaround: Manually re-enter default bounds.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add gesture/buttons, reset, equal-scale, grid/axis/tick controls, labels/units, and bound validation.
* Retest status: Open

### BUG-P2-022 — Graph styling omits line and label controls

* Module: 2D Graph
* Severity: S3 — Medium
* Priority: P2
* Related test case: 2DG-008, 064
* Environment: Desktop/mobile emulation
* Preconditions: Select a graph
* Test data: rename, colour, opacity, thickness, dashed line, labels
* Steps to reproduce:
  1. Select a graph.
  2. Inspect Selected graph controls.
  3. Attempt opacity, thickness, line style, labels, and reorder.
* Expected result: Multiple non-colour styling options and persistent labels.
* Actual result: Name and colour plus hide/lock/duplicate/delete exist; other style/reorder controls do not.
* Reproducibility: 100%
* Mathematical impact: Limited distinction in multi-curve investigations.
* Student impact: Colour-only differentiation reduces accessibility and crowded-graph readability.
* Workaround: Use the seven preset colours and names in the list.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add accessible stroke/opacity/label/reorder controls with non-colour defaults.
* Retest status: Open

### BUG-P2-023 — Asymptotes, angle mode, pi ticks, and domain/range conventions are absent

* Module: 2D Graph
* Severity: S2 — High
* Priority: P1
* Related test case: 2DG-024–025, 033–043, 048
* Environment: Desktop Chromium
* Preconditions: Plot rational, logarithmic, trig, inverse-trig, or hyperbolic-style relations
* Test data: `1/x`, `tan(x)`, `ln(x)`, inverse trig
* Steps to reproduce:
  1. Add the representative expressions.
  2. Inspect graph and controls for asymptotes, radians/degrees, pi ticks, domain/range.
  3. Zoom via bounds near a discontinuity.
* Expected result: School conventions are explicit and discontinuities never visually mislead.
* Actual result: Sampling generally separates large discontinuities, but none of the explanatory controls/markers/readouts exists.
* Reproducibility: 100%
* Mathematical impact: Key properties cannot be verified from the UI.
* Student impact: Students must infer conventions and asymptotes unaided.
* Workaround: Calculate and annotate externally.
* Evidence: Evidence log
* Console or log details: None.
* Suggested correction: Add angle mode, symbolic ticks, asymptote/domain/range analysis, and labels.
* Retest status: Open

### BUG-P2-024 — Valid school notation is inconsistently rejected

* Module: 2D Graph
* Severity: S2 — High
* Priority: P1
* Related test case: 2DG-006, 007, 028–029, 033
* Environment: Desktop Chromium
* Preconditions: Expression editor open
* Test data: `|x|`, `exp(x)`, `xy`, `sign(x)`, malformed controls
* Steps to reproduce:
  1. Enter each valid expression.
  2. Click Add graph.
  3. Compare with accepted equivalents `abs(x)`, `e^x`, and explicit multiplication.
* Expected result: Standard notation is accepted or ambiguity is clearly explained.
* Actual result: `|x|` invalid; `exp(x)` reports `Unsupported name: xp`; `xy` reports unsupported y; `sign` unsupported.
* Reproducibility: 100%
* Mathematical impact: Equivalent standard forms behave inconsistently.
* Student impact: Correct textbook input appears wrong and messages can be nonsensical.
* Workaround: Use `abs(x)`, `e^x`, and explicit `*`; no sign workaround except piecewise.
* Evidence: Evidence log
* Console or log details: Polite live validation messages only.
* Suggested correction: Unify tokenizer/validator/evaluator grammar and test accepted school aliases end to end.
* Retest status: Open

## Severity summary

| Severity | Count |
| -- | --: |
| S0 | 2 |
| S1 | 5 |
| S2 | 5 |
| S3 | 1 |
| S4 | 0 |
| Enhancement | 0 |
