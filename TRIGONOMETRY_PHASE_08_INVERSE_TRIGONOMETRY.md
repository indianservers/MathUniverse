# Phase 08 - Inverse Trigonometry

## 1. Phase Objective

Teach inverse trigonometry through domain restriction, graph reflection, principal values, and common misconceptions.

## 2. Existing Code / Components to Inspect

- `src/pages/TrigonometryConceptPage.tsx`: `InverseTrig`, `trigMetrics`.
- `src/data/trigonometryConcepts.ts`: `inverse-trig`, `inverse-principal-values`, `trig-equations`, `general-solutions`.
- `src/pages/NCERTConceptPage.tsx`: inverse trig graph visual for class 12.
- `src/pages/BoardSyllabusVisualizer.tsx`: inverse trig visual.
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` for shared layout ideas.

## 3. Existing Features to Preserve

- Current inverse trig concept routes.
- Existing NCERT inverse trig visualization.
- Existing concept page fallback visuals.
- Existing slider boundaries for ratio input.

## 4. Concepts Covered in This Phase

- `sin^-1 x`, `cos^-1 x`, `tan^-1 x`
- Domain and range.
- Principal value branches.
- Restricted domains.
- Reflection across `y = x`.
- Difference between `sin^2 x` and `sin^-1 x`.

## 5. Student Learning Goal

A beginner should understand that inverse trig returns an angle, not a reciprocal, and that domains are restricted so the inverse can be a function.

## 6. Professor-Level Explanation Strategy

Start with a sine graph failing the horizontal-line test. Restrict the domain, then reflect the restricted graph across `y = x`. Connect a ratio input to a principal angle output.

## 7. UI/UX Design Strategy

- Side-by-side original graph and inverse graph.
- Highlight restricted domain segment.
- Use a draggable point on the original graph and mirrored point on inverse graph.
- Show input/output cards: ratio in, angle out.
- Add misconception warning beside notation.
- Use tabs for arcsin, arccos, arctan.

## 8. Interaction Design

- Sliders: input x, selected function.
- Drag handles: draggable point on restricted graph.
- Toggle buttons: show full graph, show restricted branch, show reflection, degrees/radians.
- Step-by-step reveal: restrict, reflect, read principal value.
- Graph movement: mirrored point moves live.
- Unit circle movement: optional matching angle on circle.
- Formula transformation: `y = sin x` becomes `x = sin y`, then `y = sin^-1 x`.
- Quiz interactions: identify domain/range.
- Challenge mode interactions: choose valid principal value.

## 9. Visualization Requirements

- Original graph with restricted branch.
- Inverse graph reflected across `y = x`.
- Draggable point and mirror line.
- Unit circle mini panel for principal angle.
- Domain/range interval panel.
- Misconception panel: inverse vs reciprocal vs square.

## 10. Formula / Math Correctness Requirements

- `sin^-1 x` domain `[-1,1]`, range `[-pi/2, pi/2]`.
- `cos^-1 x` domain `[-1,1]`, range `[0, pi]`.
- `tan^-1 x` domain all real, range `(-pi/2, pi/2)`.
- Do not label `sin^-1 x` as `1/sin x`.
- Degree/radian toggle must convert output angle labels correctly.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": inverse asks which angle produced this ratio.
- "Common mistake": reading `sin^-1 x` as reciprocal.
- "Try it yourself": input 0.5 and compare arcsin and arccos.
- "Real-life meaning": finding an angle from a measured ratio.
- "Visual memory trick": inverse graph is the restricted graph flipped across `y=x`.

## 12. Advanced Learner Extension

Add composition identities, restricted branches for all six trig functions, inverse trig derivatives preview, and solution-family warnings.

## 13. Implementation Plan

1. Create inverse graph reflection scene.
2. Add tabs for arcsin, arccos, arctan.
3. Add input slider/drag point.
4. Add domain/range table.
5. Add misconception panel.
6. Add unit-circle principal value preview.
7. Verify edge cases.

## 14. Component Design Recommendation

- `InverseTrigGraphScene`
- `RestrictedDomainHighlighter`
- `ReflectionGraphPanel`
- `PrincipalValueCard`
- `NotationMisconceptionBox`
- `DomainRangeTable`

## 15. Data Structure Recommendation

```ts
type InverseTrigDefinition = {
  id: "asin" | "acos" | "atan";
  domain: string;
  range: string;
  originalFunction: string;
  restrictedInterval: [number, number];
  evaluate: (x: number) => number;
};
```

## 16. Testing Checklist

- Test x = -1, -0.5, 0, 0.5, 1 for arcsin/arccos.
- Test large negative and positive x for arctan.
- Confirm invalid input is disabled or warned.
- Confirm reflection coordinates match.
- Confirm degree/radian output.
- Confirm mobile graph labels fit.

## 17. Risks / Things Not to Touch

- Do not modify NCERT pages unless integrating shared components safely.
- Do not confuse inverse notation with reciprocal notation.
- Do not remove existing inverse concept pages.
- Do not add backend/server code.

## 18. Acceptance Criteria

- Inverse trig pages explain principal values visually.
- Domain and range are impossible to miss.
- Misconceptions are addressed directly.
- Existing Trigonometry routes remain stable.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Add inverse trigonometry visual explanations inside the existing module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

