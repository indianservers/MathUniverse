# Phase 05 - Angle Sum and Difference

## 1. Phase Objective

Create individual visual derivations for angle addition and subtraction formulas using rotating vectors, projections, and live direct-versus-expanded comparison.

## 2. Existing Code / Components to Inspect

- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `sin-add`, `cos-add`, `sin-sub`, `cos-sub`, A/B sliders, formula proof panel.
- `src/data/trigonometryConcepts.ts`: `sum-difference`, `product-to-sum`.
- `src/pages/TrigonometryConceptPage.tsx`: generic identity visual.
- `src/utils/math.ts`: angle helpers.

## 3. Existing Features to Preserve

- Existing addition/subtraction formula cards.
- Existing A and B sliders.
- Existing degree/radian toggle.
- Existing animation controls.
- Existing route `/trigonometry/sum-difference`.

## 4. Concepts Covered in This Phase

- `sin(A+B) = sinA cosB + cosA sinB`
- `sin(A-B) = sinA cosB - cosA sinB`
- `cos(A+B) = cosA cosB - sinA sinB`
- `cos(A-B) = cosA cosB + sinA sinB`
- `tan(A+B) = (tanA + tanB) / (1 - tanA tanB)`
- `tan(A-B) = (tanA - tanB) / (1 + tanA tanB)`

## 5. Student Learning Goal

A beginner should understand that `A+B` means combining two rotations, and the formulas calculate the same final projection without directly measuring the combined angle.

## 6. Professor-Level Explanation Strategy

Use rotation composition. Show angle A first, then rotate by B. Project the final vector onto x and y axes. Decompose the final projection into parts built from `sinA`, `cosA`, `sinB`, and `cosB`.

## 7. UI/UX Design Strategy

- Central diagram with two rotating arms.
- Distinct colors for A, B, and A+B.
- Right panel for direct value, expanded value, and match state.
- Formula card highlights terms as the visual projection is explained.
- Beginner mode uses "combine two turns" language.
- Professor mode shows vector/rotation matrix derivation.

## 8. Interaction Design

- Sliders: A, B, optional theta for examples.
- Drag handles: draggable arm endpoints for A and B.
- Toggle buttons: addition/subtraction, sine/cosine/tangent, degree/radian.
- Step-by-step reveal: draw A, draw B, draw combined arm, project, compare terms.
- Graph movement: optional graph of direct and expanded expressions.
- Unit circle movement: two arms on unit circle.
- Formula transformation: direct form to expansion.
- Quiz interactions: choose correct sign in formula.
- Challenge mode interactions: predict formula sign before reveal.

## 9. Visualization Requirements

- Unit circle with arm A, arm B, combined arm.
- Projection lines from final point.
- Term builders for `sinA cosB`, `cosA sinB`, etc.
- Direct vs expanded numeric proof panel.
- Safe warning for tangent denominator zero.

## 10. Formula / Math Correctness Requirements

- Keep all angles in radians internally.
- Degree/radian toggle only changes display/input.
- Tangent formulas undefined when denominators approach zero.
- Floating equality uses tolerance.
- Sign handling for subtraction must be explicit.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": a combined turn has x/y shadows that can be built from smaller turns.
- "Common mistake": writing `sin(A+B) = sinA + sinB`.
- "Try it yourself": set A=30, B=45 and compare direct/expanded.
- "Real-life meaning": rotations, navigation, waves, signals.
- "Visual memory trick": sine addition has plus-plus; cosine addition has minus between products.

## 12. Advanced Learner Extension

Add rotation matrix derivation, complex exponential derivation, and exact-value examples like 75 degrees and 15 degrees.

## 13. Implementation Plan

1. Add an angle-composition scene in the existing identity visualizer.
2. Build shared direct/expanded value panel.
3. Add tangent sum/difference cards if missing.
4. Add safe undefined warnings.
5. Add formula-term highlighting.
6. Add beginner/professor explanation variants.
7. Verify A/B sliders and degree/radian toggle.

## 14. Component Design Recommendation

- `AngleCompositionScene`
- `TwoAngleControlPanel`
- `DirectExpandedProofPanel`
- `FormulaTermHighlighter`
- `RotationProjectionDiagram`
- `MisconceptionBox`

## 15. Data Structure Recommendation

```ts
type AngleFormula = {
  id: string;
  directLabel: string;
  expansionLabel: string;
  direct: (a: number, b: number) => number | null;
  expanded: (a: number, b: number) => number | null;
  undefinedWhen?: string;
  signPattern: string;
};
```

## 16. Testing Checklist

- Test A/B at 0, 30, 45, 60, 90.
- Test negative B for subtraction.
- Test tangent denominator near zero.
- Confirm direct and expanded values match.
- Confirm drag handles sync with sliders.
- Confirm mobile layout stacks controls.

## 17. Risks / Things Not to Touch

- Do not remove current sum/difference cards.
- Do not rewrite all identity visualizations.
- Do not allow tangent formulas to show Infinity.
- Do not add backend/server code.

## 18. Acceptance Criteria

- Addition/subtraction formulas have visual rotating-arm derivations.
- A/B sliders work and values match live.
- Sign mistakes are clearly addressed.
- Existing Trigonometry routes remain stable.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Add rich angle sum and difference visual derivations inside the existing Trigonometry module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## 20. Phase 05 Implementation Status

Phase 05 has been implemented as an additive Angle Sum and Difference Derivation Lab. The existing Trigonometry routes, Visualizations submenu, Math Lab route, and earlier Phase 03/04 visualizers were preserved.

Files inspected:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx`
- `TRIGONOMETRY_PHASE_05_ANGLE_SUM_DIFFERENCE.md`

Files created:

- `src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx`
- `src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts`

Files updated:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `TRIGONOMETRY_PHASE_05_ANGLE_SUM_DIFFERENCE.md`
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`

Implemented formulas:

| Formula | Visual Model | Interaction | Safety |
| --- | --- | --- | --- |
| `sin(A+B)=sinAcosB+cosAsinB` | Two rotating arms with combined-angle projection | A/B sliders, drag handles, snaps, formula selector | Direct and expanded values compared with tolerance |
| `sin(A-B)=sinAcosB-cosAsinB` | Subtraction arm and signed projection terms | A/B sliders, drag handles, snaps | Sign table and misconception note |
| `cos(A+B)=cosAcosB-sinAsinB` | Horizontal projection of combined rotation | A/B sliders, drag handles, snaps | Explicit minus-product highlighting |
| `cos(A-B)=cosAcosB+sinAsinB` | Difference rotation with x-shadow check | A/B sliders, drag handles, snaps | Direct/expanded proof panel |
| `tan(A+B)=(tanA+tanB)/(1-tanAtanB)` | Slope/rise interpretation beside rotating arms | A/B sliders, drag handles, snaps | Undefined denominator handling |
| `tan(A-B)=(tanA-tanB)/(1+tanAtanB)` | Signed slope difference model | A/B sliders, drag handles, snaps | Undefined final angle and denominator handling |

Implemented learning features:

- Formula selector for all six sum/difference identities.
- Operation toggle for `A+B` and `A-B`.
- Function toggle for sine, cosine, and tangent.
- A and B sliders from `-180` to `180` degrees.
- Draggable endpoint handles for angle A and angle B.
- Snap buttons for common angles.
- Projection, term, value, formula-builder, and derivation visibility toggles.
- Direct value versus expanded value verification panel.
- Step-by-step derivation for beginner and professor modes.
- Formula-builder chips that students click to assemble the expansion.
- Sign prediction panel showing term signs and final match status.
- Misconception correction for common mistakes such as `sin(A+B)=sinA+sinB`.

Math and edge-case handling:

- Helpers expose `degToRad`, `safeDivide`, `nearZero`, `formatAngleFormulaValue`, and `evaluateAngleFormula` for focused testing.
- Tangent formulas return `null` for undefined values instead of `NaN` or `Infinity`.
- Tangent input breaks, expansion denominator breaks, and final-angle breaks are tested.
- Equality uses tolerance-based comparison.

Verification completed:

- `npx vitest run src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 30 tests.
- `npx eslint src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing repository lint issues outside the Phase 05 files.

Known limitations:

- Formula builder is click-to-fill, not full drag/drop yet.
- The angle-composition proof is visual and numeric; a full rotation-matrix proof is recommended for the next advanced layer.
- The Visualizations tab is becoming long because all labs are preserved additively.

Recommended Phase 06:

Build double-angle visual derivations on top of this component pattern. Reuse the direct/expanded proof panel and angle drag controls, then add a dedicated "theta added to itself" scene for `sin(2theta)`, the three `cos(2theta)` forms, and `tan(2theta)`.
