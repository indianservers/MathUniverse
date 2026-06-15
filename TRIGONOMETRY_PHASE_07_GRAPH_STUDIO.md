# Phase 07 - Graph Studio

## 1. Phase Objective

Create a polished graph studio for sine, cosine, and tangent transformations with amplitude, frequency, phase shift, vertical shift, animation, comparison, and graph-matching challenges.

## 2. Existing Code / Components to Inspect

- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`: graph tab, sampled segments, undefined handling.
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`: graph mode and wave controls.
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`: `wave-transform`, `curve-compare`.
- `src/data/trigonometryConcepts.ts`: sine/cosine/tangent graphs, reciprocal graphs, amplitude, period/frequency, phase shift.
- `src/pages/FunctionsGraphsVisualizer.tsx` for general graph UI ideas.

## 3. Existing Features to Preserve

- Existing six-function graphs.
- Existing compact lab graph behavior.
- Existing reciprocal graph undefined handling.
- Existing wave application routes.

## 4. Concepts Covered in This Phase

- `y = sin x`, `y = cos x`, `y = tan x`
- `y = a sin(bx + c) + d`
- `y = a cos(bx + c) + d`
- Amplitude, frequency, period, phase shift, vertical shift.
- Parent functions and transformations.

## 5. Student Learning Goal

A beginner should understand how changing `a`, `b`, `c`, and `d` changes the graph's height, cycle length, horizontal shift, and middle line.

## 6. Professor-Level Explanation Strategy

Teach transformations one at a time. Start with parent graph, then apply amplitude, then frequency/period, then phase shift, then vertical shift. Use moving points to connect unit-circle motion to wave graphs.

## 7. UI/UX Design Strategy

- Large graph canvas with stable axes and labeled key points.
- Control panel with sliders grouped as Shape, Position, Animation.
- Comparison mode overlaying parent and transformed graphs.
- Use color and dashed lines for midline, amplitude bounds, and period markers.
- Challenge panel for match-the-graph.

## 8. Interaction Design

- Sliders: amplitude `a`, frequency `b`, phase `c`, vertical shift `d`, theta scrubber.
- Drag handles: draggable phase shift marker and moving point on graph.
- Toggle buttons: sin/cos/tan, parent overlay, grid, labels, animate.
- Step-by-step reveal: parent, stretch, compress, shift, lift.
- Graph movement: animated point and vertical marker.
- Unit circle movement: optional linked mini circle.
- Formula transformation: highlight `a`, `b`, `c`, `d`.
- Quiz interactions: match equation to graph.
- Challenge mode interactions: adjust sliders to match target graph.

## 9. Visualization Requirements

- Main graph for transformed function.
- Parent graph overlay.
- Midline and amplitude bounds.
- Period bracket.
- Phase-shift arrow.
- Moving point with live `(x, y)` readout.
- Safe tangent asymptote rendering.

## 10. Formula / Math Correctness Requirements

- Period for `sin` and `cos`: `2pi / |b|`.
- Period for `tan`: `pi / |b|`.
- Amplitude applies to sin/cos, not tangent in the same bounded sense.
- Tangent graph must break at asymptotes.
- Radian x-axis labels should be used for graph interpretation.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": the graph records height as the angle changes.
- "Common mistake": confusing frequency with amplitude.
- "Try it yourself": double amplitude and observe max/min.
- "Real-life meaning": sound, tides, AC current, vibrations.
- "Visual memory trick": `a` affects height, `b` affects speed, `c` slides, `d` lifts.

## 12. Advanced Learner Extension

Add harmonic comparison, phase in radians, angular frequency, signal interpretation, and Fourier preview links.

## 13. Implementation Plan

1. Extract graph plotting helpers if safe.
2. Add a dedicated graph studio panel or tab within existing Trigonometry visualizations.
3. Add transformation sliders and formula highlighting.
4. Add parent overlay and moving marker.
5. Add tangent asymptote handling.
6. Add match-the-graph challenge state.
7. Verify mobile and reduced motion.

## 14. Component Design Recommendation

- `TrigGraphStudio`
- `TrigGraphCanvas`
- `TransformationControlPanel`
- `FormulaParameterHighlighter`
- `GraphChallengeCard`
- `UnitCircleWaveLink`

## 15. Data Structure Recommendation

```ts
type GraphTransformState = {
  fn: "sin" | "cos" | "tan";
  amplitude: number;
  frequency: number;
  phase: number;
  verticalShift: number;
  showParent: boolean;
  challengeTarget?: GraphTransformState;
};
```

## 16. Testing Checklist

- Test amplitude 0, 1, 2, negative values if allowed.
- Test frequency 0.5, 1, 2.
- Test phase `pi/2`, `-pi/2`.
- Test vertical shift positive/negative.
- Test tangent asymptotes.
- Test challenge matching tolerance.
- Test mobile graph readability.

## 17. Risks / Things Not to Touch

- Do not break `TrigonometricFunctionsVisualizer`.
- Do not reuse a generic graph library if current SVG plotting is sufficient.
- Do not show tangent as a connected line through asymptotes.
- Do not add backend/server code.

## 18. Acceptance Criteria

- Students can manipulate and understand trig graph transformations.
- Parent and transformed graphs are visually distinguishable.
- Tangent graph remains mathematically safe.
- Challenge mode works locally in browser.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Add a Trigonometry Graph Studio to the existing module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

