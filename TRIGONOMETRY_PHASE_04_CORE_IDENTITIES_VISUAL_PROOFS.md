# Phase 04 - Core Identities Visual Proofs

## 1. Phase Objective

Build strong visual proof experiences for the three core Pythagorean identities while preserving the existing identity visualization lab.

## 2. Existing Code / Components to Inspect

- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `pythagorean`, `tan-sec`, `cot-csc`, proof panel/value logic.
- `src/pages/TrigonometryConceptPage.tsx`: identity visual fallback.
- `src/data/trigonometryConcepts.ts`: `pythagorean-identity`, related identities.
- Existing docs: `docs/trigonometry-visualization-design-plan.md`, `docs/trigonometry-visualization-final-report.md`.

## 3. Existing Features to Preserve

- Current Visualizations tab.
- Current search/filter/difficulty and teaching mode behavior.
- Current live numeric checks.
- Current concept routes.

## 4. Concepts Covered in This Phase

- `sin^2 theta + cos^2 theta = 1`
- `1 + tan^2 theta = sec^2 theta`
- `1 + cot^2 theta = cosec^2 theta`
- Unit circle proof, triangle proof, algebra proof.

## 5. Student Learning Goal

A beginner should understand that these identities are Pythagoras applied to different right triangles, not formulas to memorize blindly.

## 6. Professor-Level Explanation Strategy

Prove the first identity from the unit circle: radius squared equals x squared plus y squared. Then divide by `cos^2 theta` to derive `1 + tan^2 theta = sec^2 theta`, and divide by `sin^2 theta` to derive `1 + cot^2 theta = cosec^2 theta`.

## 7. UI/UX Design Strategy

- Use three dedicated proof cards, each with its own visual.
- Use area squares for `sin^2` and `cos^2`.
- Use tangent/secant triangle for `tan/sec`.
- Use cotangent/cosecant triangle for `cot/cosec`.
- Add LHS/RHS value panel with match indicator.
- Add beginner/professor explanation switch.

## 8. Interaction Design

- Sliders: theta, optional proof zoom.
- Drag handles: draggable unit-circle point.
- Toggle buttons: unit circle proof, triangle proof, algebra proof, hide measurements.
- Step-by-step reveal: geometry, substitute, square, add, conclude.
- Graph movement: optional identity value graph showing constant 1.
- Unit circle movement: active for all identities.
- Formula transformation: show division by `cos^2` or `sin^2`.
- Quiz interactions: fill missing proof step.
- Challenge mode interactions: try to break identity by changing theta.

## 9. Visualization Requirements

- Unit circle with radius 1, cos leg, sin leg.
- Area squares for `sin^2`, `cos^2`, and combined area.
- Tangent line triangle showing secant hypotenuse.
- Cotangent/cosecant companion model.
- Numeric LHS/RHS panel with tolerance.

## 10. Formula / Math Correctness Requirements

- Use safe division near zero denominators.
- `tan/sec` identity undefined where `cos theta = 0`.
- `cot/cosec` identity undefined where `sin theta = 0`.
- Do not imply the identity is numerically testable at undefined points.
- Use tolerance for floating-point equality.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": it is Pythagoras on a triangle.
- "Common mistake": squaring `sin theta + cos theta` as `sin^2 theta + cos^2 theta`.
- "Try it yourself": drag to 60 degrees and compare LHS/RHS.
- "Real-life meaning": distance from origin, slopes, reciprocal scaling.
- "Visual memory trick": two small squares fill the radius square.

## 12. Advanced Learner Extension

Add algebraic derivations, reciprocal identity derivations, exact-value checks, and discussion of domain restrictions.

## 13. Implementation Plan

1. Refine or split identity scenes inside the existing identity visualizer.
2. Add area-square proof for `sin^2 + cos^2`.
3. Add tangent/secant and cotangent/cosecant proof scenes.
4. Add reusable `IdentityProofPanel`.
5. Add step reveal and misconception box.
6. Verify undefined values and tolerance.

## 14. Component Design Recommendation

- `AreaSquareScene`
- `IdentityProofPanel`
- `ProofStepPanel`
- `TangentSecantScene`
- `CotangentCosecantScene`
- `MisconceptionBox`

## 15. Data Structure Recommendation

```ts
type IdentityProof = {
  id: string;
  formula: string;
  proofModels: Array<"unit-circle" | "triangle" | "algebra" | "area">;
  undefinedWhen: string[];
  steps: string[];
  lhs: (theta: number) => number | null;
  rhs: (theta: number) => number | null;
};
```

## 16. Testing Checklist

- Test theta 0, 30, 45, 60, 90, 180, 270, 360.
- Confirm undefined states for tan/sec and cot/cosec identities.
- Confirm no NaN/Infinity.
- Confirm LHS/RHS match where defined.
- Confirm area squares scale correctly.
- Confirm mobile proof panel remains readable.

## 17. Risks / Things Not to Touch

- Do not replace the entire `TrigIdentityVisualizations` file in one step.
- Do not remove existing formula list or filters.
- Do not simplify away undefined warnings.
- Do not add backend/server code.

## 18. Acceptance Criteria

- The three core identities have dedicated visual proof experiences.
- Students can see why each identity is true.
- Undefined values are shown honestly.
- Existing Trigonometry page remains stable.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Improve only the core identity visual proof experiences in the existing Trigonometry module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## Phase 04 Implementation Status

Phase 04 has been implemented as an additive Core Identity Proof Lab. Existing Trigonometry routes, tabs, concept pages, Math Lab, 2D/3D fallback panels, and the existing large `TrigIdentityVisualizations.tsx` experience were preserved.

Files inspected:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/pages/Trigonometry.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx`
- `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/data/trigonometryLessonExperience.ts`
- Existing Trigonometry visualizer tests
- `src/components/ui/SliderControl.tsx`

Files created:

- `src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx`
- `src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts`

Files changed:

- `src/pages/TrigonometryConceptPage.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `TRIGONOMETRY_PHASE_04_CORE_IDENTITIES_VISUAL_PROOFS.md`
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`

Visualizer integration points:

- `/trigonometry/pythagorean-identity`: shows the new Core Identity Proof Visualizer with `sin^2 theta + cos^2 theta = 1` selected by default, then preserves the classic concept lab.
- `/trigonometry` Visualizations tab: keeps the existing identity visualization lab and adds the focused core identity proof section below it.
- No separate tan-sec or cot-cosec concept routes exist in `trigonometryConcepts`; both identities are available through the proof lab selector.

Identities implemented:

- `sin^2 theta + cos^2 theta = 1`
- `1 + tan^2 theta = sec^2 theta`
- `1 + cot^2 theta = cosec^2 theta`

Proof models implemented:

- Unit-circle and area-square proof for `sin^2 theta + cos^2 theta = 1`.
- Tangent/secant triangle proof for `1 + tan^2 theta = sec^2 theta`.
- Cotangent/cosecant companion triangle proof for `1 + cot^2 theta = cosec^2 theta`.
- Algebra transformation ladders showing division by `cos^2 theta` and `sin^2 theta`.
- Numeric LHS/RHS verification with tolerance.

Controls added:

- Identity selector.
- Angle theta slider from 0 degrees to 360 degrees.
- Snap buttons for 0, 30, 45, 60, 90, 180, 270, and 360 degrees.
- Proof model toggle: Geometry, Algebra, Numeric.
- Display toggles for squares, triangle, formula steps, and live values.
- Beginner/Professor mode toggle.

Undefined handling added:

- `sin^2 theta + cos^2 theta = 1` is defined for all theta.
- `1 + tan^2 theta = sec^2 theta` is undefined when `cos theta = 0`, including 90 degrees and 270 degrees.
- `1 + cot^2 theta = cosec^2 theta` is undefined when `sin theta = 0`, including 0, 180, and 360 degrees.
- Safe helpers return `null` for undefined values and display `undefined`; no `NaN` or `Infinity` is displayed.

Tests performed:

- `npx vitest run src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 20 tests.
- `npx eslint src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: failed on unrelated existing lint debt outside Phase 04 files.

Routes checked:

- Browser smoke checks passed with no visible crash state for:
  - `/trigonometry`
  - `/trigonometry/pythagorean-identity`
  - `/trigonometry/trigonometric-functions`
  - `/trigonometry/right-triangle-ratios`
  - `/trigonometry/reciprocal-ratios`
  - `/math-lab/trigonometry`
- `/trigonometry` Visualizations tab was checked directly and contains both the existing identity lab and the new Core Pythagorean Identity Proofs section.
- Mobile-width browser check passed for `/trigonometry/pythagorean-identity` with no horizontal overflow.

Pending issues:

- The proof lab is intentionally additive and appears below the existing Visualizations tab content. If future phases add more large labs, local navigation or collapsible sections may be needed.
- Direct drag on the proof point is not implemented in Phase 04; the theta slider and snap buttons provide the keyboard-accessible fallback.

Recommendation for Phase 05:

Proceed to angle addition and subtraction proofs next. Keep the same route-safe pattern: one focused visualizer, formula-specific proof scenes, helper tests for direct/expanded equality, and no wholesale rewrite of `TrigIdentityVisualizations.tsx`.
