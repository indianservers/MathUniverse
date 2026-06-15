# Phase 03 - Basic Ratios: Triangle + Circle

## 1. Phase Objective

Teach sin, cos, tan, cosec, sec, and cot as connected right-triangle ratios and unit-circle projections, not isolated formulas.

## 2. Existing Code / Components to Inspect

- `src/pages/TrigonometryConceptPage.tsx`: `TriangleTrig`, `UnitCircleTrig`, `InverseTrig`, `trigMetrics`.
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`: function metadata, ratio tab, safe divide.
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `tan-ratio`, `sec-reciprocal`, `csc-reciprocal`, `cot-ratio`.
- `src/data/trigonometryConcepts.ts`: `right-triangle-ratios`, `reciprocal-ratios`, `trigonometric-functions`.
- `src/pages/ShapesExplorer.tsx`: right triangle reference.

## 3. Existing Features to Preserve

- Existing Trigonometric Functions visualizer.
- Existing right-triangle concept route.
- Existing formulas and concept cards.
- Existing safe undefined display behavior.

## 4. Concepts Covered in This Phase

- `sin theta = opposite / hypotenuse`
- `cos theta = adjacent / hypotenuse`
- `tan theta = opposite / adjacent`
- `cosec theta = hypotenuse / opposite = 1 / sin theta`
- `sec theta = hypotenuse / adjacent = 1 / cos theta`
- `cot theta = adjacent / opposite = 1 / tan theta`

## 5. Student Learning Goal

A beginner should be able to point to a side of a right triangle and explain which ratio uses it, then connect the same ratio to the unit circle.

## 6. Professor-Level Explanation Strategy

Start with a right triangle inside the unit circle. Show that hypotenuse becomes radius. When radius is 1, opposite becomes sine and adjacent becomes cosine. Tangent is then rise over run. Reciprocal ratios are the same comparisons inverted.

## 7. UI/UX Design Strategy

- Side-by-side triangle and unit circle.
- Color side labels consistently: opposite green, adjacent violet, hypotenuse cyan.
- Ratio cards update live.
- Avoid dense text; use one sentence per ratio.
- Add a "triangle only / circle only / both" segmented control.
- Mobile layout should stack triangle, circle, values.

## 8. Interaction Design

- Sliders: angle theta, hypotenuse/radius scale.
- Drag handles: draggable acute angle point on triangle.
- Toggle buttons: show labels, show reciprocals, show exact values, beginner/professor.
- Step-by-step reveal: identify sides, form ratios, set radius to 1, show reciprocal pairs.
- Graph movement: optional mini graph for selected ratio.
- Unit circle movement: synced with triangle angle.
- Formula transformation: side ratio to projection formula.
- Quiz interactions: choose correct ratio from highlighted sides.
- Challenge mode interactions: hide labels and ask student to name opposite/adjacent.

## 9. Visualization Requirements

- Right triangle with labeled opposite, adjacent, hypotenuse.
- Unit circle with matching projections.
- Six ratio cards with live numeric values.
- Reciprocal pairing arrows: sin/cosec, cos/sec, tan/cot.
- Undefined warning for zero denominator.

## 10. Formula / Math Correctness Requirements

- Angle must stay between 0 and 90 degrees for triangle mode.
- Undefined when opposite or adjacent is zero.
- Reciprocal values must use safe divide.
- Do not show NaN or Infinity.
- Unit-circle and triangle values must match numerically when radius is normalized.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": ratios compare side lengths in similar right triangles.
- "Common mistake": using the wrong side as adjacent.
- "Try it yourself": drag theta bigger and observe opposite grows.
- "Real-life meaning": ramps, ladders, shadows, heights, navigation.
- "Visual memory trick": SOH-CAH-TOA plus reciprocal flip pairs.

## 12. Advanced Learner Extension

Show similarity proof, slope interpretation of tangent, reciprocal graph preview, and connection to all-quadrant definitions.

## 13. Implementation Plan

1. Create a synced triangle/circle scene.
2. Add angle drag and theta slider sync.
3. Add six ratio cards using safe numeric formatting.
4. Add reciprocal-pair mode.
5. Integrate into `right-triangle-ratios`, `reciprocal-ratios`, and possibly the functions visualizer.
6. Add misconception and practice cards.
7. Verify all edge cases.

## 14. Component Design Recommendation

- `RightTriangleScene`
- `TriangleCircleRatioScene`
- `RatioCardGrid`
- `ReciprocalPairPanel`
- `SideLabelLegend`
- `PracticeQuestionCard`

## 15. Data Structure Recommendation

```ts
type TrigRatio = {
  id: "sin" | "cos" | "tan" | "csc" | "sec" | "cot";
  numerator: "opposite" | "adjacent" | "hypotenuse";
  denominator: "opposite" | "adjacent" | "hypotenuse";
  reciprocalOf?: string;
  undefinedWhen: string;
};
```

## 16. Testing Checklist

- Test theta 0, 30, 45, 60, 90.
- Confirm side labels remain correct after dragging.
- Confirm reciprocal pairs match.
- Confirm undefined handling at 0 and 90.
- Confirm mobile layout does not crop labels.
- Confirm existing trig function page still works.

## 17. Risks / Things Not to Touch

- Do not break `TrigonometricFunctionsVisualizer`.
- Do not remove existing ratio tabs.
- Do not change generic concept routing.
- Do not add backend/server code.

## 18. Acceptance Criteria

- Basic ratios are visually explained through triangle and circle together.
- All six ratios have live values and clear labels.
- Beginner students can identify sides and ratios from the visual.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Improve the existing basic ratio visual experience using triangle and unit-circle connections. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## Phase 03 Implementation Status

Phase 03 has been implemented as an additive triangle + unit-circle ratio lesson. Existing Trigonometry routes, concept tabs, fallback 2D/3D views, Math Lab, and the existing Trigonometric Functions visualizer were preserved.

Files inspected:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/components/ui/SliderControl.tsx`
- Phase 01/02 Trigonometry planning and visualizer files

Files created:

- `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx`
- `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts`

Files changed:

- `src/pages/TrigonometryConceptPage.tsx`
- `TRIGONOMETRY_PHASE_03_BASIC_RATIOS_TRIANGLE_CIRCLE.md`
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`

Visualizer integration points:

- `/trigonometry/right-triangle-ratios`: shows the new triangle + unit-circle visualizer with basic ratios by default, then preserves the classic concept lab.
- `/trigonometry/reciprocal-ratios`: shows the same visualizer with all six ratios and reciprocal panel emphasis, then preserves the classic concept lab.
- `/trigonometry/trigonometric-functions`: preserves the existing six-function visualizer and adds the triangle + circle bridge below it.

Controls added:

- Angle theta slider from 1 degree to 89 degrees.
- Hypotenuse slider from 1 to 10.
- Diagram mode segmented control: Both, Triangle, Circle.
- Label/challenge toggle.
- Basic/all-six ratio-card toggle.
- Beginner/Professor explanation toggle.
- Normalize to radius 1 button.

Ratio cards added:

- `sin theta = opposite / hypotenuse`
- `cos theta = adjacent / hypotenuse`
- `tan theta = opposite / adjacent`
- `cosec theta = hypotenuse / opposite`
- `sec theta = hypotenuse / adjacent`
- `cot theta = adjacent / opposite`

Reciprocal handling added:

- Reciprocal pairs are shown as `sin <-> cosec`, `cos <-> sec`, and `tan <-> cot`.
- Ratio values use safe division and never render `NaN` or `Infinity`.
- Undefined values render as `undefined` when a denominator is zero or too close to zero.

Practice and teaching additions:

- Step-by-step panel for side naming, sine, cosine, tangent, unit-circle normalization, reciprocals, and scale invariance.
- Misconception box for wrong adjacent side, opposite-side confusion, tangent confusion, reciprocal confusion, and size confusion.
- Lightweight practice prompts for identifying the opposite side, sine, and the cosecant reciprocal example.

Math helpers added:

- `degToRad`
- `safeDivide`
- `formatRatioValue`
- `getTriangleSides`
- `getTrigRatios`

Tests performed:

- `npx vitest run src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts`: passed, 6 tests.
- `npx vitest run src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 12 tests.
- `npx eslint src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: failed on unrelated existing lint debt outside Phase 03 files.

Routes checked:

- Browser smoke checks passed with no visible crash state for:
  - `/trigonometry`
  - `/trigonometry/right-triangle-ratios`
  - `/trigonometry/reciprocal-ratios`
  - `/trigonometry/trigonometric-functions`
  - `/math-lab/trigonometry`
- Mobile-width browser check passed for `/trigonometry/right-triangle-ratios` with no horizontal overflow.

Pending issues:

- The Phase 03 implementation uses slider interaction as the accessible fallback for changing theta; direct dragging of the acute triangle point is not implemented in this phase.
- Full repo lint still has known unrelated lint debt from earlier files and should be handled separately.

Recommendation for Phase 04:

Proceed to core identity visual proofs only after browser verification confirms the Phase 03 routes remain stable. Reuse the same additive pattern: one focused visualizer, helper tests for math safety, and classic fallback preservation until each new proof scene is verified.
