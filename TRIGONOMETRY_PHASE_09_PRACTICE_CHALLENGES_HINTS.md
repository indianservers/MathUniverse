# Phase 09 - Practice, Challenges, and Adaptive Hints

## 1. Phase Objective

Add local, browser-based practice and challenge experiences that reinforce visual understanding without requiring a backend.

## 2. Existing Code / Components to Inspect

- `src/visualizations/trigonometry/TrigonometryExperimentCatalog.tsx`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/pages/Quiz.tsx`
- `src/pages/WorkedExamplesLibrary.tsx`
- `src/hooks/useProgress.ts`
- `src/components/ui/VisualLearningPanel.tsx`
- `src/data/trigonometryConcepts.ts`

## 3. Existing Features to Preserve

- Existing experiment catalog.
- Existing Quiz page.
- Existing progress actions and local progress.
- Existing visual tasks in concept metadata.
- Existing routes and UI tabs.

## 4. Concepts Covered in This Phase

- Visual MCQs for ratios, signs, identities, graphs, inverse trig.
- Drag-to-match: formula to diagram, graph to equation, side to ratio.
- Fill missing proof step.
- Quadrant signs.
- Angle from ratio.
- Graph-to-equation.
- Progressive hints.

## 5. Student Learning Goal

A beginner should practice by looking, predicting, dragging, and receiving hints rather than only reading formulas.

## 6. Professor-Level Explanation Strategy

Practice should follow the learning cycle: predict, test visually, explain, correct misconception, then try a near-transfer problem.

## 7. UI/UX Design Strategy

- Add practice cards inside existing visualizers, not a separate app.
- Keep each question short and visual.
- Use hint levels: nudge, visual cue, formula cue, full explanation.
- Store progress locally.
- Avoid shame-based feedback; use correction beside the diagram.

## 8. Interaction Design

- Sliders: used to set target angles or graph parameters.
- Drag handles: match labels to diagram parts.
- Toggle buttons: reveal hint, check answer, try again.
- Step-by-step reveal: proof step fill-in.
- Graph movement: match graph challenge.
- Unit circle movement: quadrant sign prediction.
- Formula transformation: reorder terms or fill signs.
- Quiz interactions: MCQ, multi-select, drag-match, numeric input.
- Challenge mode interactions: timed optional local challenges, no backend.

## 9. Visualization Requirements

- Small reusable question cards embedded near scenes.
- Visual answer feedback with highlighted correct diagram parts.
- Hint panel with progressive reveal.
- Challenge summary with local score/progress.
- Misconception correction beside mistaken state.

## 10. Formula / Math Correctness Requirements

- Questions must use safe generated values.
- Avoid undefined angles unless the question is specifically about undefined values.
- Exact values should be accepted in equivalent numeric form.
- Graph challenge tolerance must be clear.
- Principal-value questions must respect inverse trig ranges.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": after each question, one visual reason.
- "Common mistake": explain wrong choices.
- "Try it yourself": a similar follow-up.
- "Real-life meaning": add for application questions.
- "Visual memory trick": repeat when correction is shown.

## 12. Advanced Learner Extension

Add mixed identity challenges, proof ordering, exact-value derivations, radians-only graph challenges, and timed local mastery mode.

## 13. Implementation Plan

1. Define question metadata and local answer state.
2. Add reusable practice card components.
3. Add practice blocks to unit circle, ratios, identities, graphs, inverse trig.
4. Add progressive hints.
5. Add local progress tracking with existing hooks if safe.
6. Add challenge mode without backend.
7. Verify no disruption to existing visual interaction.

## 14. Component Design Recommendation

- `PracticeQuestionCard`
- `ProgressiveHintPanel`
- `DragMatchQuestion`
- `VisualMCQ`
- `ProofStepQuestion`
- `ChallengeModePanel`
- `ConceptProgressTracker`

## 15. Data Structure Recommendation

```ts
type TrigPracticeQuestion = {
  id: string;
  conceptId: string;
  type: "mcq" | "drag-match" | "fill-step" | "numeric" | "graph-match";
  prompt: string;
  visualState: Record<string, number | string | boolean>;
  answer: unknown;
  hints: string[];
  misconception?: string;
};
```

## 16. Testing Checklist

- Test every question type.
- Confirm answers and hints are mathematically correct.
- Confirm no backend calls.
- Confirm keyboard users can answer.
- Confirm mobile drag alternatives exist.
- Confirm local progress does not corrupt existing progress.

## 17. Risks / Things Not to Touch

- Do not merge with global Quiz page unless minimal and safe.
- Do not require login or backend.
- Do not block free exploration behind quizzes.
- Do not add heavy dependencies.

## 18. Acceptance Criteria

- Trigonometry has visual practice cards with hints.
- Challenge mode works locally.
- Students receive useful correction for mistakes.
- Existing Trigonometry visualizers still work.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Add browser-only practice, challenges, and progressive hints to the existing Trigonometry module. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

