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

