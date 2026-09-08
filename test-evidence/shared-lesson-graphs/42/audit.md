# Inequality Grapher baseline audit

Source: GraphLessonAdapter.tsx (baseline copy retained here). Stated rules: y≤0.8x+1 and y>−0.5x+2. Sample A(1,2). Trace default 1.5, bounds [-5,5], step .5. Existing preset view is [-6,6] on both axes. Retain the displayed pair of rules rather than the unrelated parameterized preset formula.

Confirmed defects: fixed polygons and line coordinates use axes/ticks with inconsistent origins and scales. The sample A(1,2) is marked true, but 2≤1.8 is false. The trace uses an unrelated sine-derived screen ordinate. The sample table falls through to sin(x)+0.3x, which is unrelated to these inequalities.

Correct region: -0.5x+2 < y ≤ 0.8x+1. This interval is nonempty only when x>10/13. The lower boundary is excluded and the upper included. Preserve the original three region colors and two boundary colors/styles. Clip each original half-plane and their intersection to the current view, retaining the exact equations. Sample table x values remain unchanged and show the resulting y interval, or no overlap.

Unresolved existing controls: “Boundary A” and “Boundary B” sliders have numeric state 2 and 3 but labels “solid” and “dashed”; neither state affects any calculation or boundary style. Preserve their original behavior, bounds and steps rather than invent a parameter relationship. This is an existing limitation, not a fixed control. No additional user preference has been received.

Verification: all half-plane and overlap vertices satisfy their constraints; each half-step trace checks both boundary ordinates, endpoint inclusion and interval existence. Mouse, touch, keyboard, pan/zoom/reset/fit/share/inspect and original slider behavior pass. Captions retain all coordinates with shorter wording. Shared caption placement now searches a free row rather than cycling; two unit tests and a browser bounding-box check cover the defect. All 60 browser checks across 20 lessons and 29 unit tests pass, along with scoped lint.

Control correction: the request forbids inert controls. Show Boundary A/B checkboxes now replace the unused numeric sliders. They start checked, preserve the original equations and initial display, hide/show the corresponding line and half-plane overlays, and update table visibility statuses. The overlap always remains the intersection of both inequalities, explicitly described when an overlay is hidden. Reset restores both overlays. Loading-only timeouts were retained separately; the warmed single-worker regression is recorded in visibility-controls.log.
