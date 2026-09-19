# Phase 01 - Foundation and Architecture

## 1. Phase Objective

Prepare the existing Trigonometry module for staged refinement without rebuilding it. This phase should inventory existing routes, stabilize concept metadata, define reusable lesson structures, and create a safe architecture for later visual upgrades.

## 2. Existing Code / Components to Inspect

- `src/pages/Trigonometry.tsx`
- `src/pages/TrigonometryConceptPage.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/visualizations/trigonometry/TrigConcept3DView.tsx`
- `src/visualizations/trigonometry/TrigonometryExperimentCatalog.tsx`
- `src/components/ui/TopicTabs.tsx`
- `src/components/ui/FormulaBlock.tsx`
- `src/components/ui/SliderControl.tsx`
- `src/components/ui/VisualLearningPanel.tsx`
- `src/components/layout/navItems.ts`
- Routes in `src/App.tsx`: `/trigonometry`, `/trigonometry/:conceptId`, `/math-lab/trigonometry`.

## 3. Existing Features to Preserve

- Current Trigonometry page tabs: Lab, Visualizations, Concepts, Formulas, Syllabus.
- All dynamic concept routes from `trigonometryConcepts.ts`.
- Existing `TrigIdentityVisualizations` formula selector and live controls.
- Existing concept metadata fields and current URL compatibility.
- Existing 2D and 3D tabs on concept pages.
- Existing Visual Showcase and menu routes.

## 4. Concepts Covered in This Phase

- Metadata architecture for all current concepts.
- Lesson structure, categorization, difficulty, visual model type, interaction type, and formula grouping.
- Preservation of current formulas and routes.

## 5. Student Learning Goal

A student will not see major content changes yet, but future phases should become easier to navigate, more consistent, and less confusing because every concept will have a clear learning design behind it.

## 6. Professor-Level Explanation Strategy

Define a teaching sequence for each concept: visual intuition first, formula second, numerical check third, misconception fourth, practice last. This should become a shared design principle for future phases.

## 7. UI/UX Design Strategy

- Keep the current Trigonometry page shell.
- Introduce a stable lesson metadata model that can power formula cards, step panels, difficulty labels, and mode toggles.
- Avoid large layout changes in Phase 01.
- Define common regions: selector, visual scene, control panel, explanation panel, proof/value panel, practice prompt.
- Keep mobile layout as stacked sections.

## 8. Interaction Design

- Sliders: preserve current `SliderControl` behavior.
- Drag handles: document where future drag handles should be introduced.
- Toggle buttons: beginner/professor, degree/radian, animation, grid, labels.
- Step-by-step reveal: define shared step metadata.
- Graph movement: document marker and scrubber requirements.
- Unit circle movement: document angle arm interaction requirements.
- Formula transformation: define highlighted formula token state.
- Quiz interactions: define metadata only.
- Challenge mode interactions: define metadata only.

## 9. Visualization Requirements

- Create a map of each formula to best model: unit circle, right triangle, graph, area model, quadrant model, vector projection, or reflection model.
- Identify visualizers that can be reused safely.
- Identify formulas still using generic diagrams.
- Keep existing fallback visuals for concept pages.

## 10. Formula / Math Correctness Requirements

- Ensure every formula has declared domain, range, undefined conditions, quadrant behavior, degree/radian assumptions, and numerical tolerance.
- Reciprocal functions must handle zero denominators.
- Tangent and secant must not display Infinity or NaN.
- Inverse trig must declare principal ranges.

## 11. Beginner-Friendly Explanation Requirements

- "Why this works": every lesson needs a one-sentence visual reason.
- "Common mistake": each lesson should declare a likely misconception.
- "Try it yourself": each lesson should include a small interaction prompt.
- "Real-life meaning": each lesson needs an application line.
- "Visual memory trick": every major group needs one visual anchor.

## 12. Advanced Learner Extension

Add optional derivation notes, symbolic transformations, radians-only calculus warnings, proof variants, and links to calculus or complex-number extensions.

## 13. Implementation Plan

1. Add or refine lesson metadata without changing visual output.
2. Map current concepts to future phase ownership.
3. Define shared types for formula lessons, visual model, interaction model, and explanation steps.
4. Add non-rendered metadata gradually or keep it local to Trigonometry data until stable.
5. Add tests or script checks that every route has metadata.
6. Document untouched current behavior before Phase 02 starts.

## 14. Component Design Recommendation

- `FormulaCard`
- `SmartFormulaCard`
- `StepByStepPanel`
- `AngleSlider`
- `ModeToggle`
- `ConceptProgressTracker`
- `MisconceptionBox`
- `PracticeQuestionCard`
- `FormulaSceneLayout`

## 15. Data Structure Recommendation

Create a metadata shape like:

```ts
type TrigLesson = {
  id: string;
  title: string;
  formula: string;
  category: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  visualModel: "unit-circle" | "triangle" | "graph" | "area" | "quadrant" | "vector" | "reflection";
  interactions: string[];
  steps: string[];
  commonMistake: string;
  realLifeMeaning: string;
  edgeCases: string[];
};
```

## 16. Testing Checklist

- Confirm `/trigonometry` still loads.
- Confirm all `/trigonometry/:conceptId` routes still resolve.
- Confirm no concept metadata id is duplicated.
- Confirm no current tabs disappear.
- Confirm mobile layout is unchanged.
- Confirm build passes.

## 17. Risks / Things Not to Touch

- Do not rewrite `Trigonometry.tsx` heavily.
- Do not remove `trigonometryConcepts` fields used by existing pages.
- Do not change routing.
- Do not delete current visualizers.
- Do not add backend/server code.

## 18. Acceptance Criteria

- A complete metadata and architecture plan exists.
- Current routes, tabs, and visualizers remain unchanged.
- Future phases can be implemented one at a time.
- A route/metadata audit confirms no current concept is orphaned.

## 19. Suggested Codex Implementation Prompt for This Phase

Implement only this phase. Do not modify unrelated modules. Do not add backend/server code. Keep it pure browser-based. Preserve existing features. Inspect the current Trigonometry files and add only safe metadata/types or documentation needed for staged improvement. Run the app and verify the Trigonometry page works. Update this MD file with completed items, pending items, and issues found.

## Phase 01 Implementation Status

Status: Complete for the Phase 01 foundation scope.

Files inspected:

- `src/pages/Trigonometry.tsx`
- `src/pages/TrigonometryConceptPage.tsx`
- `src/data/trigonometryConcepts.ts`
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx`
- `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx`
- `src/visualizations/trigonometry/TrigonometryMathLab.tsx`
- `src/visualizations/trigonometry/TrigConcept3DView.tsx`
- `src/visualizations/trigonometry/TrigonometryExperimentCatalog.tsx`
- `src/components/ui/FormulaBlock.tsx`
- `src/components/ui/SliderControl.tsx`
- `src/components/ui/VisualLearningPanel.tsx`
- `src/App.tsx`
- `src/components/layout/navItems.ts`

Files changed:

- `src/pages/Trigonometry.tsx`: added small lesson metadata badges to existing concept cards without changing routes, tabs, or visualizer behavior.
- `TRIGONOMETRY_PHASE_01_FOUNDATION_AND_ARCHITECTURE.md`: added this implementation status.
- `TRIGONOMETRY_INTERACTIVE_REFINEMENT_AUDIT.md`: updated with Phase 01 completion notes.

Files created:

- `src/data/trigonometryLessonExperience.ts`
- `src/data/trigonometryLessonExperience.test.ts`

Metadata added:

- Added `TrigLessonExperience` metadata for every existing entry in `trigonometryConcepts`.
- Added typed categories, difficulty, visual model, interaction model, math safety, and phase owner fields.
- Added helpers: `getTrigonometryLessonExperience`, `getTrigonometryExperiencesByPhase`, and `validateTrigonometryLessonExperienceMetadata`.
- Added math-safety support for undefined trig values, graph edge cases, inverse trig domains/ranges, degree/radian mode, and numeric tolerance.

Concepts mapped:

- Phase 02: unit circle, degree/radian, special angles, quadrant signs.
- Phase 03: right triangle ratios, reciprocal ratios, trigonometric functions, and application/triangle-solving foundations.
- Phase 04: Pythagorean and core identity foundation.
- Phase 05: sum and difference formulas.
- Phase 06: double-angle, half-angle, product-to-sum, triple-angle.
- Phase 07: graph, wave, reciprocal graph, calculus graph, and Fourier graph concepts.
- Phase 08: inverse trig, principal values, trig equations, general solutions, inequalities.
- Phase 09: inquiry/practice experiments.
- Phase 10: advanced/polish topics that need careful re-audit before deep redesign.

Risks found:

- `TrigIdentityVisualizations.tsx` already contains many Phase 03-05 style components, so future phases should extract or upgrade carefully instead of duplicating scenes.
- Some formulas still rely on generic concept-page visuals; these should remain as fallbacks until dedicated visual scenes are verified.
- URL parameters are written by `SliderControl`, so route verification may preserve query strings like `v_angle_theta` and `v_radius`; future tests should expect that behavior.

Features preserved:

- `/trigonometry`
- `/trigonometry/:conceptId`
- `/trigonometry/trigonometric-functions`
- `/math-lab/trigonometry`
- Main Trigonometry tabs: Lab, Visualizations, Concepts, Formulas, Syllabus.
- Existing 2D and 3D concept tabs.
- Existing Math Lab, identity visualizer, trigonometric functions visualizer, Visual Showcase links, and URL slider parameters.

Build/run status:

- `npm run typecheck`: passed.
- `npx vitest run src/data/trigonometryLessonExperience.test.ts`: passed, 2 tests.
- `npx eslint src/data/trigonometryLessonExperience.ts src/data/trigonometryLessonExperience.test.ts src/pages/Trigonometry.tsx --max-warnings=0`: passed.
- `npm run lint`: failed on pre-existing unrelated lint issues in files such as `public/sw.js`, `src/pages/MathWorkspace.tsx`, `src/data/formulaLibrary.ts`, and other non-Phase-01 areas.
- `npm run build`: passed.
- Browser route checks passed with no app error boundary text on `/trigonometry`, `/trigonometry/unit-circle`, `/trigonometry/right-triangle-ratios`, `/trigonometry/pythagorean-identity`, `/trigonometry/trigonometric-functions`, and `/math-lab/trigonometry`.

Pending items for Phase 02:

- Build the Unit Circle Master Visualizer using the new metadata as the route-safe source of lesson intent.
- Preserve the current `unit-circle` concept route while upgrading the visual model.
- Add drag-point interaction, snap buttons, stronger quadrant sign explanation, and exact-value overlays only in Phase 02.
