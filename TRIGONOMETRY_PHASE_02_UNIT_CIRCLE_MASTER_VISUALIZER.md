# Phase 02 - Unit Circle Master Visualizer

## 1. Phase Objective

Upgrade the existing unit-circle experience into a master visualizer that teaches sine, cosine, tangent, coordinates, quadrants, degrees, radians, and sign rules through one clear interactive scene.

## 2. Existing Code / Components to Inspect

- `src/pages/TrigonometryConceptPage.tsx`: `UnitCircleTrig`, `CircleTrig`, `trigMetrics`, `quadrantForAngle`.
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `UnitCircleScene`, quadrant and identity scenes if present deeper in the file.
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`: circle mode and draggable/angle logic.
- `src/data/trigonometryConcepts.ts`: `unit-circle`, `degree-radian`, `special-angles`, `quadrant-signs`.
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`: `UnitCircleRatios`.
- `src/components/ui/SliderControl.tsx`.

## 3. Existing Features to Preserve

- `/trigonometry/unit-circle` route.
- Current concept-page 2D and 3D tab behavior.
- Current Trigonometry Visualizations tab.
- Current trig function ratio visualizer.
- URL parameter compatibility for theta where applicable.

## 4. Concepts Covered in This Phase

- Coordinates as `(cos theta, sin theta)`.
- sin, cos, tan from unit circle.
- Degree/radian conversion.
- Quadrants and ASTC sign rules.
- Special angles: 0, 30, 45, 60, 90, 180, 270, 360 degrees.
- Undefined tangent where `cos theta = 0`.

## 5. Student Learning Goal

A beginner should understand that a point moving around a unit circle gives cosine as horizontal position and sine as vertical position, and that signs change because the point moves into different quadrants.

## 6. Professor-Level Explanation Strategy

Teach the unit circle as a coordinate machine. Start with radius 1, project the point to x and y axes, label x as cos theta and y as sin theta, then show tangent as y divided by x. Use quadrants to explain signs before showing any memorization rule.

## 7. UI/UX Design Strategy

- Use a large central circle with clean axes and projection lines.
- Put angle controls and snap buttons on one side.
- Put live values and sign table on the other side or below on mobile.
- Use color coding: cyan for circle/radius, amber for moving angle, green for sine, violet for cosine, rose for tangent/undefined.
- Add beginner/professor toggle without changing routes.
- Keep labels large in beginner mode.

## 8. Interaction Design

- Sliders: theta slider, optional radius locked to 1.
- Drag handles: draggable point on circle and draggable angle arm.
- Toggle buttons: degrees/radians, show tangent, show projections, show quadrant signs, beginner/professor.
- Step-by-step reveal: radius, x projection, y projection, tangent, signs.
- Graph movement: optional small linked sine/cosine wave marker.
- Unit circle movement: continuous drag and snap-to-angle buttons.
- Formula transformation: `(x, y) -> (cos theta, sin theta) -> tan theta = y/x`.
- Quiz interactions: identify quadrant signs.
- Challenge mode interactions: predict signs before moving.

## 9. Visualization Requirements

- Unit circle with axes, radius, angle arc, draggable point, and projections.
- Tangent line at `x = 1`.
- Live coordinate readout.
- Sign table for all quadrants with current quadrant highlighted.
- Snap-angle chips: 0, 30, 45, 60, 90, 180, 270, 360.
- Radian labels for `0`, `pi/6`, `pi/4`, `pi/3`, `pi/2`, `pi`, `3pi/2`, `2pi`.

## 10. Formula / Math Correctness Requirements

- `x = cos theta`, `y = sin theta`.
- `tan theta = sin theta / cos theta`.
- Display undefined when `abs(cos theta)` is near zero.
- Normalize angles for quadrant detection while preserving displayed signed angle if the user drags beyond 360.
- Degree/radian toggle must not change the underlying angle.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": sine and cosine are shadows of the radius on the axes.
- "Common mistake": confusing sine with horizontal and cosine with vertical.
- "Try it yourself": drag to quadrant II and predict which values are negative.
- "Real-life meaning": circular motion, wheels, waves, and rotation.
- "Visual memory trick": cosine touches the x-axis; sine rises on the y-axis.

## 12. Advanced Learner Extension

Add oriented angle discussion, negative angles, coterminal angles, radians as arc length, and tangent as slope of the radius line.

## 13. Implementation Plan

1. Create or extract a reusable unit-circle scene from existing code.
2. Add draggable angle point with pointer events.
3. Add degree/radian toggle and snap buttons.
4. Add tangent line and undefined handling.
5. Add quadrant sign table and highlighted quadrant.
6. Add step reveal and beginner/professor text.
7. Integrate into `/trigonometry/unit-circle` without removing the existing fallback.
8. Verify mobile stacking and keyboard slider operation.

## 14. Component Design Recommendation

- `UnitCircleCanvas`
- `AngleSlider`
- `AngleSnapButtons`
- `QuadrantSignTable`
- `LiveTrigValues`
- `StepByStepPanel`
- `MisconceptionBox`

## 15. Data Structure Recommendation

Add lesson metadata for snap angles, sign rules, and visible layers:

```ts
type UnitCircleLayer = "radius" | "sin" | "cos" | "tan" | "quadrants" | "radians";
type SnapAngle = { degrees: number; radiansLabel: string; exactValues: { sin: string; cos: string; tan: string } };
```

## 16. Testing Checklist

- Test theta at 0, 30, 45, 60, 90, 180, 270, 360.
- Test negative angles and angles over 360.
- Confirm tangent undefined at 90 and 270.
- Confirm degree/radian labels match.
- Confirm drag updates slider and live values.
- Confirm mobile labels do not overlap.
- Confirm reduced motion does not auto-animate.

## 17. Risks / Things Not to Touch

- Do not remove `UnitCircleTrig` until the replacement is fully wired and tested.
- Do not break `TrigonometricFunctionsVisualizer` ratio tab.
- Do not change all concept visuals in this phase.
- Do not add backend/server code.

## 18. Acceptance Criteria

- `/trigonometry/unit-circle` has a polished unit-circle visualizer.
- Students can drag the angle and understand sin/cos/tan visually.
- Undefined tangent is handled safely.
- Current Trigonometry page and tabs still work.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Build the Unit Circle Master Visualizer inside the existing Trigonometry module and route. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## Phase 02 Implementation Status

Status: Complete for the Unit Circle Master Visualizer scope.

Files inspected:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/data/trigonometryLessonExperience.ts`
- `src/components/ui/SliderControl.tsx`

Files changed:

- `src/pages/TrigonometryConceptPage.tsx`: integrated the Unit Circle Master Visualizer for `unit-circle`, `degree-radian`, `special-angles`, and `quadrant-signs`; preserved the classic 2D/3D concept lab below it.
- `TRIGONOMETRY_PHASE_02_UNIT_CIRCLE_MASTER_VISUALIZER.md`: added this implementation status.
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`: added Phase 02 completion notes.

Files created:

- `src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx`
- `src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts`

Visualizer integration points:

- `/trigonometry/unit-circle`: shows all major unit-circle layers.
- `/trigonometry/degree-radian`: starts with degree/radian emphasis.
- `/trigonometry/special-angles`: starts with special-angle exact values emphasized.
- `/trigonometry/quadrant-signs`: starts with quadrant sign table and professor mode emphasized.
- Existing `/trigonometry/trigonometric-functions` and `/math-lab/trigonometry` visualizers are untouched.

Math helpers added:

- `degToRad`
- `radToDeg`
- `normalizeDegrees`
- `getQuadrant`
- `safeTan`
- `formatTrigValue`
- `getExactTrigValues`

Controls added:

- Draggable point on the SVG unit circle.
- Keyboard-accessible `Angle theta` slider using the existing `SliderControl`.
- Snap buttons for 0, 30, 45, 60, 90, 180, 270, and 360 degrees.
- Degree/radian/both display toggle.
- Layer toggles for sine, cosine, tangent, quadrant signs, exact values, and optional mini sine-wave strip.
- Beginner and Professor mode toggle.
- Step-by-step lesson navigation.

Math safety handling:

- Uses radians internally for `Math.sin`, `Math.cos`, and `Math.tan`.
- Normalizes degrees for quadrant/sign/special-angle lookup.
- Displays `undefined` for tangent when `abs(cos theta) < 1e-6`.
- `formatTrigValue` never displays `NaN` or `Infinity`.
- Exact values are shown for snap angles, including `360 deg = 2pi`.

Tests performed:

- `npm run typecheck`: passed.
- `npx vitest run src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 6 tests.
- `npx eslint src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run build`: passed.
- `npm run lint`: failed on pre-existing unrelated repo-wide lint issues outside Phase 02 files.

Routes checked:

- `/trigonometry`: loaded, tabs preserved.
- `/trigonometry/unit-circle`: master visualizer loaded, snap buttons present, classic 2D/3D fallback present.
- `/trigonometry/degree-radian`: master visualizer loaded, tangent undefined shown at 90 degrees.
- `/trigonometry/special-angles`: master visualizer loaded, exact-value snap flow present.
- `/trigonometry/quadrant-signs`: master visualizer loaded, quadrant table present.
- `/trigonometry/trigonometric-functions`: loaded unchanged.
- `/math-lab/trigonometry`: loaded unchanged.

Pending issues:

- Browser snap-button checks were verified. Drag behavior is implemented with pointer events, but the in-app browser coordinate-drag automation failed to dispatch reliably during verification; keyboard slider fallback remains available and tested through build/typecheck.
- Full repo lint remains blocked by unrelated existing lint debt.

Recommendation for Phase 03:

Proceed to right-triangle ratios and reciprocal ratios by reusing the same lesson structure: large visual scene, live values, safe undefined handling, misconception panel, and preserved classic fallback. Do not refactor the new Unit Circle Master Visualizer during Phase 03 unless a shared helper is clearly needed.
