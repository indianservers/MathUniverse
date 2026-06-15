# Phase 06 - Double Angle and Half Angle

## 1. Phase Objective

Teach double-angle and half-angle formulas as natural consequences of angle addition, visual transformations, and graph comparison.

## 2. Existing Code / Components to Inspect

- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `sin-double`, `cos-double`, `cos-double-sin`, `cos-double-cos`, `tan-double`.
- `src/data/trigonometryConcepts.ts`: `double-angle`, `half-angle`, `triple-angle`.
- Phase 05 components once implemented.
- Existing graph utilities in `TrigIdentityVisualizations` and `TrigonometricFunctionsVisualizer`.

## 3. Existing Features to Preserve

- Existing double-angle visual cards.
- Existing `/trigonometry/double-angle` and `/trigonometry/half-angle` routes.
- Existing play/pause and speed controls.
- Existing degree/radian toggle.

## 4. Concepts Covered in This Phase

- `sin 2theta = 2sin theta cos theta`
- `cos 2theta = cos^2 theta - sin^2 theta`
- `cos 2theta = 1 - 2sin^2 theta`
- `cos 2theta = 2cos^2 theta - 1`
- `tan 2theta = 2tan theta / (1 - tan^2 theta)`
- `sin^2(theta/2) = (1 - cos theta) / 2`
- `cos^2(theta/2) = (1 + cos theta) / 2`
- `tan(theta/2)` standard forms.

## 5. Student Learning Goal

A beginner should understand that double angle means adding an angle to itself, and half angle works by reversing that idea.

## 6. Professor-Level Explanation Strategy

Derive double-angle formulas from sum formulas by setting `A = B = theta`. Then derive half-angle formulas by replacing `theta` with `theta/2` in cosine double-angle identities and solving for squares.

## 7. UI/UX Design Strategy

- Show theta and 2theta arms together.
- Show "A+B becomes theta+theta" transformation.
- Use graph comparison for `sin theta` vs `sin 2theta`.
- Use area comparison for cosine double-angle variants.
- Add a formula transformation ladder.

## 8. Interaction Design

- Sliders: theta, optional graph scale.
- Drag handles: draggable theta arm.
- Toggle buttons: double/half, sine/cosine/tangent, formula variant.
- Step-by-step reveal: start from sum formula, substitute, simplify.
- Graph movement: compare parent and double-frequency graph.
- Unit circle movement: show theta and 2theta points.
- Formula transformation: `A+B -> theta+theta`.
- Quiz interactions: choose correct formula variant.
- Challenge mode interactions: find where denominator becomes zero.

## 9. Visualization Requirements

- Unit circle with theta and 2theta.
- Formula ladder for derivation.
- Graph overlay: `sin theta` and `sin 2theta`; `cos theta` and `cos 2theta`.
- Tangent undefined warning when `1 - tan^2 theta = 0`.
- Half-angle triangle/area model where useful.

## 10. Formula / Math Correctness Requirements

- Half-angle square-root sign depends on quadrant; do not hide sign ambiguity.
- Tangent double angle undefined when denominator approaches zero.
- Values must match direct computation where defined.
- Radian mode must be correct for graph/calc explanations.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": double angle is the same turn repeated twice.
- "Common mistake": thinking `sin 2theta = 2sin theta`.
- "Try it yourself": set theta=45 and inspect `sin 90`.
- "Real-life meaning": wave frequency doubling and rotation.
- "Visual memory trick": double angle makes the point move twice as fast around the circle.

## 12. Advanced Learner Extension

Add tangent half-angle substitution, exact values for 15 degrees, graph frequency analysis, and links to integration substitutions.

## 13. Implementation Plan

1. Reuse Phase 05 angle-composition logic.
2. Add double-angle derivation mode.
3. Add half-angle derivation mode.
4. Add graph comparison panel.
5. Add sign ambiguity warning for half-angle.
6. Add tangent undefined handling.
7. Verify all formula variants.

## 14. Component Design Recommendation

- `RepeatedAngleScene`
- `FormulaDerivationLadder`
- `GraphComparisonPanel`
- `HalfAngleSignPanel`
- `IdentityProofPanel`
- `PracticeQuestionCard`

## 15. Data Structure Recommendation

```ts
type DerivedIdentity = {
  id: string;
  sourceFormula: string;
  substitutions: string[];
  simplifiedFormula: string;
  variants: string[];
  edgeCases: string[];
};
```

## 16. Testing Checklist

- Test theta 0, 15, 30, 45, 60, 90, 135, 180.
- Confirm direct/expanded values match.
- Confirm tangent denominator warnings.
- Confirm half-angle sign explanation.
- Confirm graph overlay aligns.
- Confirm mobile layout remains usable.

## 17. Risks / Things Not to Touch

- Do not implement triple-angle in this phase unless tiny and safe.
- Do not remove existing double-angle cards.
- Do not merge half-angle into a generic identity without sign explanation.
- Do not add backend/server code.

## 18. Acceptance Criteria

- Double-angle and half-angle identities have clear visual derivations.
- Students can see the connection to angle-sum formulas.
- Edge cases and sign ambiguity are displayed correctly.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Improve double-angle and half-angle visual derivations in the existing Trigonometry module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## Phase 06 Implementation Status

Phase 06 has been implemented as an additive Double and Half Angle Visual Derivation Lab. Existing routes, tabs, Math Lab, 2D/3D concept fallback views, Phase 03-05 visualizers, and the existing identity visualizer were preserved.

Files inspected:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx`
- `src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx`
- `src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx`
- `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/data/trigonometryLessonExperience.ts`
- `src/components/ui/SliderControl.tsx`

Files created:

- `src/visualizations/trigonometry/DoubleHalfAngleVisualizer.tsx`
- `src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts`

Files changed:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `TRIGONOMETRY_PHASE_06_DOUBLE_HALF_ANGLE.md`
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`

Visualizer integration points:

- `/trigonometry/double-angle` now opens the new lab with `sin-double` selected by default.
- `/trigonometry/half-angle` now opens the new lab with `sin-half-square` selected by default.
- The classic concept lab remains below the new lab on both concept routes.
- The existing Trigonometry Visualizations tab now includes a focused "Double and Half Angle Derivations" section below the Phase 04 and Phase 05 focused labs.

Formulas implemented:

| Formula | Visual Strategy | Safety |
| --- | --- | --- |
| `sin(2theta) = 2sin(theta)cos(theta)` | repeated theta rotation from angle addition | direct/expanded tolerance check |
| `cos(2theta) = cos^2(theta) - sin^2(theta)` | repeated theta rotation and final x-projection | direct/expanded tolerance check |
| `cos(2theta) = 1 - 2sin^2(theta)` | Pythagorean rewrite of cosine double angle | direct/expanded tolerance check |
| `cos(2theta) = 2cos^2(theta) - 1` | Pythagorean rewrite of cosine double angle | direct/expanded tolerance check |
| `tan(2theta) = 2tan(theta)/(1 - tan^2(theta))` | doubled slope with tangent-line warning | undefined if tangent input, final tangent, or denominator fails |
| `sin^2(theta/2) = (1 - cos(theta))/2` | reverse cosine double-angle derivation | direct/expanded tolerance check |
| `cos^2(theta/2) = (1 + cos(theta))/2` | reverse cosine double-angle derivation | direct/expanded tolerance check |
| `tan(theta/2) = sin(theta)/(1 + cos(theta))` | half-angle tangent form | undefined when denominator fails |
| `tan(theta/2) = (1 - cos(theta))/sin(theta)` | alternate half-angle tangent form | undefined when denominator fails |
| `tan(theta/2) = +/-sqrt((1 - cos(theta))/(1 + cos(theta)))` | signed radical with quadrant panel | sign note required and denominator checked |

Drag/click interactions implemented:

- Draggable theta arm in both repeated-angle and half-angle scenes.
- Keyboard-accessible theta slider and numeric input fallback.
- Snap buttons for `0`, `15`, `30`, `45`, `60`, `90`, `120`, `135`, `150`, `180`, `270`, and `360` degrees.
- Formula group toggle for Double Angle / Half Angle.
- Function toggle for Sine / Cosine / Tangent.
- Display toggles for theta arm, 2theta arm, theta/2 arm, formula steps, values, graph, and challenge.
- Beginner/professor mode toggle.

Formula builder:

- Implemented as a polished click-to-fill mini challenge.
- Includes Check and Clear actions plus immediate feedback.
- Full drag/drop is still pending and can be considered in a later interaction-polish phase.

Direct/expanded verification:

- Every formula computes direct and expanded values through `evaluateDoubleHalfFormula`.
- Undefined states return `null`, never `NaN` or `Infinity`.
- Numeric equality uses `1e-6` tolerance.
- Helper functions are exported for focused tests.

Graph comparison:

- Added a compact graph panel.
- Double-angle view compares `sin(theta)`, `cos(theta)`, or `tan(theta)` with the corresponding `f(2theta)`.
- Half-angle view compares `f(theta)` with `f(theta/2)`.
- Tangent graph safely breaks near undefined values.

Half-angle sign handling:

- Added a sign panel for half-angle formulas.
- Shows `theta/2`, quadrant, sign prediction, and sign note.
- Radical tangent form applies the sign from `tan(theta/2)` instead of silently using positive square root.

Undefined handling:

- `tan(2theta)` checks undefined tangent input, final-angle undefined tangent, and `1 - tan^2(theta)` denominator breaks.
- `tan(theta/2) = sin(theta)/(1 + cos(theta))` checks `1 + cos(theta)`.
- `tan(theta/2) = (1 - cos(theta))/sin(theta)` checks `sin(theta)`.
- Radical form checks denominator and sign ambiguity.

Verification completed:

- `npx vitest run src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 44 tests.
- `npx eslint src/visualizations/trigonometry/DoubleHalfAngleVisualizer.tsx src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint debt outside Phase 06 files.

Pending issues:

- Formula builder is click-to-fill rather than full drag/drop.
- The visual graph comparison is intentionally compact and not a full graph studio.
- The Visualizations tab continues to grow because all previous labs are intentionally preserved.

Recommendation for Phase 07:

Move to complementary-angle and cofunction visual derivations. Reuse the half-angle sign/quadrant panel pattern, but center the experience around right-triangle side swapping and quadrant-aware reciprocal relationships.
