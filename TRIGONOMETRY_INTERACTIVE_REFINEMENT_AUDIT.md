# Trigonometry Interactive Refinement Audit

## Purpose

This audit records the current Trigonometry implementation and prepares a staged planning path for improving the existing module only. The goal is not to create a new Trigonometry module, not to disturb routes, and not to rewrite working panels. Future implementation should improve the current browser-based Trigonometry experience step by step.

## Current Route Inventory

| Route | Current Role | Notes |
| --- | --- | --- |
| `/trigonometry` | Main Trigonometry page | Hosts Lab, Visualizations, Concepts, Formulas, and Syllabus tabs. |
| `/trigonometry/:conceptId` | Dynamic concept detail page | Uses metadata from `src/data/trigonometryConcepts.ts`. |
| `/trigonometry/trigonometric-functions` | Full six-function visualizer | Rendered through concept metadata using `visual: "trig-functions"`. |
| `/math-lab/trigonometry` | Math Lab tool route | Uses `TrigonometryMathLab`. |
| `/visual-showcase` | Visual showcase entry | Links to Trigonometry visuals but does not own them. |

## Current File and Component Inventory

| File | Current Responsibility |
| --- | --- |
| `src/pages/Trigonometry.tsx` | Main topic page, tab shell, concept cards, formula groups, syllabus grouping. |
| `src/pages/TrigonometryConceptPage.tsx` | Dynamic concept page, sliders, 2D SVG visuals, 3D tab, learning panel, resource links. |
| `src/data/trigonometryConcepts.ts` | Metadata for all Trigonometry concepts: id, category, formula, visual type, sliders, tasks. |
| `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` | Rich identity visualization lab with formula selector, search, categories, animation, angle mode, teaching mode. |
| `src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx` | Six trig functions, ratio tab, graph tab, 3D ribbons, safe undefined handling. |
| `src/visualizations/trigonometry/TrigonometryMathLab.tsx` | Compact and full lab for circle, graph, identity, inverse, application, and 3D views. |
| `src/visualizations/trigonometry/TrigConcept3DView.tsx` | Generic concept-level 3D visual support. |
| `src/visualizations/trigonometry/TrigonometryExperimentCatalog.tsx` | Catalog of 50+ experiment ideas with compact lab embed. |
| `src/visualizations/trigonometry/EclipseTrigonometryVisualizer.tsx` | Dedicated application visualizer. |
| `src/visualizations/trigonometry/WaveApplications.tsx` | Dedicated real-world wave application visualizer. |
| `src/components/ui/TopicTabs.tsx` | Existing tab layout used by Trigonometry pages. |
| `src/components/ui/FormulaBlock.tsx` | Formula rendering block used across concept pages. |
| `src/components/ui/SliderControl.tsx` | Existing slider control component. |
| `src/components/ui/VisualLearningPanel.tsx` | Student explanation panel on concept detail pages. |
| `src/components/layout/navItems.ts` | Navigation entries for Trigonometry, Visualize, concepts, and visual routes. |

## Existing Strengths

- The module already has stable routes and a clear topic entry page.
- Concept metadata is centralized in `trigonometryConcepts.ts`.
- Many visual types already exist: unit circle, right triangle, graph transform, inverse, law, bearing, polar, identity, trig functions, eclipse, wave applications.
- `TrigIdentityVisualizations.tsx` already contains a broad formula visualization lab with search, categories, beginner/professor mode, play/pause, speed, angle mode, and live values.
- `TrigonometricFunctionsVisualizer.tsx` safely handles undefined values near asymptotes and reads URL theta values.
- The concept page already supports 2D and 3D tabs for many concepts.
- The app is fully browser-based with no backend dependency.

## Existing Gaps

- Some concept pages are still generic by visual type rather than individually optimized per formula.
- Unit circle, right triangle, graph, and identity scenes are not yet a single polished reusable learning system.
- Drag handles are limited; most interaction is slider-based.
- Some formulas need more explicit proof-by-animation, misconception correction, and student prompts.
- Inverse trigonometry needs a stronger graph reflection and restricted-domain explanation.
- Practice and challenge flows are present as experiments but not yet adaptive or embedded as lesson checkpoints.
- Accessibility, keyboard interaction, reduced motion, and mobile polish need a final pass.
- The current visualizations contain strong pieces but need a phased architecture so improvements do not become a risky rewrite.

## Current Concept Coverage Snapshot

The existing metadata covers:

- Foundations: unit circle, trigonometric functions, right triangle ratios, degree/radian, special angles, quadrant signs.
- Graphs and ratios: sine graph, cosine graph, tangent graph, reciprocal graphs, reciprocal ratios.
- Identities: Pythagorean identity, complementary angles, sum/difference, double angle, half angle, product-to-sum, triple angle.
- Equations: inverse trig, inverse principal values, trig equations, general solutions, inequalities.
- Applications and triangle solving: heights and distances, bearings, law of sines, law of cosines, SSA ambiguous case, triangle area.
- Advanced/calculus/waves: polar coordinates, polar roses, De Moivre, trig limits, trig derivatives, trig integrals, orthogonality, Fourier trig series, spherical trig, hyperbolic functions, amplitude, period/frequency, phase shift, eclipse, real-world waves, inquiry experiments.

## Preservation Rules

- Do not remove `/trigonometry` or `/trigonometry/:conceptId`.
- Do not remove existing tabs: Lab, Visualizations, Concepts, Formulas, Syllabus.
- Do not remove `TrigIdentityVisualizations`, `TrigonometricFunctionsVisualizer`, `TrigonometryMathLab`, concept pages, or concept metadata.
- Do not introduce backend/server code.
- Do not break URL parameter behavior such as `v_theta` or `v_angle_theta`.
- Do not replace current working visualizers with a new module; incrementally improve existing files and components.

## Phase Plan Links

1. [Phase 01 - Foundation and Architecture](TRIGONOMETRY_PHASE_01_FOUNDATION_AND_ARCHITECTURE.md)
2. [Phase 02 - Unit Circle Master Visualizer](TRIGONOMETRY_PHASE_02_UNIT_CIRCLE_MASTER_VISUALIZER.md)
3. [Phase 03 - Basic Ratios Triangle Circle](TRIGONOMETRY_PHASE_03_BASIC_RATIOS_TRIANGLE_CIRCLE.md)
4. [Phase 04 - Core Identities Visual Proofs](TRIGONOMETRY_PHASE_04_CORE_IDENTITIES_VISUAL_PROOFS.md)
5. [Phase 05 - Angle Sum Difference](TRIGONOMETRY_PHASE_05_ANGLE_SUM_DIFFERENCE.md)
6. [Phase 06 - Double Half Angle](TRIGONOMETRY_PHASE_06_DOUBLE_HALF_ANGLE.md)
7. [Phase 07 - Graph Studio](TRIGONOMETRY_PHASE_07_GRAPH_STUDIO.md)
8. [Phase 08 - Inverse Trigonometry](TRIGONOMETRY_PHASE_08_INVERSE_TRIGONOMETRY.md)
9. [Phase 09 - Practice Challenges Hints](TRIGONOMETRY_PHASE_09_PRACTICE_CHALLENGES_HINTS.md)
10. [Phase 10 - Polish Accessibility Reaudit](TRIGONOMETRY_PHASE_10_POLISH_ACCESSIBILITY_REAUDIT.md)

## Recommended First Phase

Start with Phase 01. It should establish metadata, shared lesson layout conventions, and a non-destructive architecture before any heavy visual implementation begins.

## Known Risks

- `TrigIdentityVisualizations.tsx` is already large; future implementation should split only when safe and covered by tests.
- Generic concept-page visuals are useful as fallback; replacing them too early may break many concept routes.
- Trig graph undefined behavior around 90 degrees, 270 degrees, and reciprocal functions must remain safe.
- Drag interactions on SVG/canvas must be mobile-safe and keyboard-accessible.
- The navigation has many Trigonometry links; route stability matters.

## Phase 01 Completion Notes

Phase 01 has been implemented as a foundation-only enhancement. No route rewrites, visualizer replacements, backend code, or new Trigonometry module were added.

Completed:

- Added `src/data/trigonometryLessonExperience.ts` as a typed, browser-safe lesson metadata layer that derives one experience record for every current `trigonometryConcepts` entry.
- Added metadata for difficulty, future phase owner, visual model, interaction model, formula list, learning sequence, and math safety.
- Added `validateTrigonometryLessonExperienceMetadata` to check duplicate concept IDs, duplicate experience IDs, orphaned experience records, missing titles, missing categories, and missing experience mappings.
- Added `src/data/trigonometryLessonExperience.test.ts` with focused Vitest coverage for metadata completeness and safety fields.
- Added small non-disruptive difficulty/model/phase badges to concept cards on `/trigonometry`.
- Preserved current route behavior, tab structure, full visualizers, concept detail pages, Math Lab, Visual Showcase links, and URL slider parameters.

Discovered differences from the original audit:

- `TrigIdentityVisualizations.tsx` is already more advanced than a generic identity panel. It includes formula search/filter, categories, beginner/professor mode, animation, angle mode, live values, proof panels, and several dedicated visual scenes.
- `TrigonometricFunctionsVisualizer.tsx` already reads `v_theta` and `v_angle_theta` and handles undefined reciprocal values with `"undefined"` instead of `NaN` or `Infinity`.
- Browser route checks showed that slider URL persistence may append query parameters during verification. This is existing behavior from `SliderControl`, not a route regression.
- The Trigonometry navigation is already broadly merged into the Visualize menu and Math Topics menu, so Phase 01 did not change navigation.

Phase 01 verification:

- `npm run typecheck`: passed.
- `npx vitest run src/data/trigonometryLessonExperience.test.ts`: passed, 2 tests.
- `npx eslint src/data/trigonometryLessonExperience.ts src/data/trigonometryLessonExperience.test.ts src/pages/Trigonometry.tsx --max-warnings=0`: passed.
- `npm run lint`: failed on unrelated existing lint issues outside the Phase 01 files, including service-worker globals, unused symbols, hook warnings, and escape-character warnings.
- `npm run build`: passed.
- Browser checks passed for:
  - `/trigonometry`
  - `/trigonometry/unit-circle`
  - `/trigonometry/right-triangle-ratios`
  - `/trigonometry/pythagorean-identity`
  - `/trigonometry/trigonometric-functions`
  - `/math-lab/trigonometry`

Final recommendation before Phase 02:

Start Phase 02 by upgrading the existing `unit-circle` pathway instead of creating a parallel visualizer route. Use `trigonometryLessonExperiences` for lesson intent and keep the current generic concept-page visual as a fallback until the new Unit Circle Master Visualizer is verified across desktop, mobile, degree/radian mode, special angles, quadrant boundaries, and URL parameter hydration.

## Phase 02 Completion Notes

Phase 02 has been implemented as an additive Unit Circle Master Visualizer. No backend code, new Trigonometry module, route rewrite, Math Lab rewrite, visual-showcase rewrite, or Phase 03-10 work was added.

Route/component changes:

- Added `src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx`.
- Added `src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so only these concept IDs use the master visualizer:
  - `unit-circle`
  - `degree-radian`
  - `special-angles`
  - `quadrant-signs`
- Preserved the existing classic concept lab, including 2D and 3D tabs, below the master visualizer on those routes.
- Left `TrigIdentityVisualizations`, `TrigonometricFunctionsVisualizer`, `TrigonometryMathLab`, and existing concept metadata intact.

Unit Circle Master Visualizer capabilities:

- Draggable unit-circle point with pointer events.
- Existing `SliderControl` angle slider fallback, preserving `v_angle_theta` URL behavior.
- Snap buttons for 0, 30, 45, 60, 90, 180, 270, and 360 degrees.
- Live degree/radian display and degree/radian/both toggle.
- Live `(cos theta, sin theta)` coordinate, sine, cosine, tangent, quadrant, and sign values.
- Safe tangent handling with `undefined` at 90 and 270 degrees.
- Quadrant sign table with symbol labels, not color alone.
- Exact values for special angles, including `360 deg = 2pi`.
- Beginner and Professor modes.
- Step-by-step teaching panel, misconception box, visual memory tricks, layer toggles, and optional mini sine-wave strip.

Verification:

- `npm run typecheck`: passed.
- `npx vitest run src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 6 tests.
- `npx eslint src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint issues outside Phase 02 files.
- Browser route checks passed for `/trigonometry`, `/trigonometry/unit-circle`, `/trigonometry/degree-radian`, `/trigonometry/special-angles`, `/trigonometry/quadrant-signs`, `/trigonometry/trigonometric-functions`, and `/math-lab/trigonometry`.

Known risks before Phase 03:

- Drag behavior is implemented in the SVG scene, but in-app browser coordinate-drag automation failed during verification. The slider fallback and snap buttons remain reliable and accessible.
- `TrigonometryConceptPage.tsx` now intentionally shows the master visualizer plus classic fallback on four routes; future phases should avoid stacking too many large panels on one page without a navigation strategy.
- Full repo lint debt should be resolved separately so future phase verification has a cleaner signal.

Final recommendation before Phase 03:

Start Phase 03 with right-triangle ratios and reciprocal ratios. Reuse the successful pattern from Phase 02: build one focused visualizer, wire it only to the target concept routes, preserve the classic fallback, add helper tests for math safety, and verify routes before expanding scope.

## Phase 03 Completion Notes

Phase 03 has been implemented as an additive Basic Ratios: Triangle + Circle upgrade. No backend code, new Trigonometry module, route rewrite, Math Lab rewrite, Visual Showcase rewrite, or Phase 04-10 work was added.

Route/component changes:

- Added `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx`.
- Added `src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so only these concept IDs use the new visualizer:
  - `right-triangle-ratios`
  - `reciprocal-ratios`
  - `trigonometric-functions`
- Preserved the existing classic concept lab, including 2D and 3D tabs, below the new visualizer on `right-triangle-ratios` and `reciprocal-ratios`.
- Preserved the existing `TrigonometricFunctionsVisualizer` on `trigonometric-functions` and added the triangle + circle bridge below it.

Triangle + Circle Ratio Visualizer capabilities:

- Synchronized right triangle and unit-circle mini scene.
- Angle theta slider constrained to 1-89 degrees for safe right-triangle definitions.
- Hypotenuse slider from 1 to 10 to show scale invariance.
- Diagram mode toggle: Both, Triangle, Circle.
- Label/challenge toggle.
- Basic/all-six ratio-card toggle.
- Beginner/Professor explanation toggle.
- Normalize to radius 1 button.
- Six live ratio cards for sine, cosine, tangent, cosecant/cosec, secant, and cotangent.
- Reciprocal pair panel for `sin <-> cosec`, `cos <-> sec`, and `tan <-> cot`.
- Safe helper functions for division, formatting, triangle sides, and trig ratios.
- Step-by-step explanation panel, misconception box, and lightweight practice prompts.

Verification so far:

- `npx vitest run src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts`: passed, 6 tests.
- `npx vitest run src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 12 tests.
- `npx eslint src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint issues outside Phase 03 files.
- Browser route checks passed for `/trigonometry`, `/trigonometry/right-triangle-ratios`, `/trigonometry/reciprocal-ratios`, `/trigonometry/trigonometric-functions`, and `/math-lab/trigonometry`.
- Mobile-width browser check passed for `/trigonometry/right-triangle-ratios` with no horizontal overflow.

Known risks before Phase 04:

- Direct drag on the triangle point is not implemented in Phase 03; the theta slider is the accessible interaction fallback.
- The new visualizer intentionally stacks with classic fallback content on two routes. Future phases should watch page length and consider local navigation if too many large panels accumulate.
- Full repo lint debt remains outside the Phase 03 files and should be resolved separately.

Final recommendation before Phase 04:

Start Phase 04 with one core identity visual proof, likely `sin^2 theta + cos^2 theta = 1`, and reuse this phase's safe helper/test pattern. Keep the new proof additive until browser checks confirm that the main Trigonometry, Math Lab, and concept routes remain stable.

## Phase 04 Completion Notes

Phase 04 has been implemented as an additive Core Identity Proof Lab. No backend code, new Trigonometry module, route rewrite, Math Lab rewrite, Visual Showcase rewrite, or Phase 05-10 work was added.

Route/component changes:

- Added `src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx`.
- Added `src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so `pythagorean-identity` uses the new proof visualizer, with the classic 2D/3D concept lab preserved below it.
- Updated `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` to add the focused core proof lab below the existing identity visualization layout.
- No standalone tan-sec or cot-cosec concept routes exist, so those identities are available through the new visualizer's identity selector.

Core Identity Proof Visualizer capabilities:

- Identity selector for `sin^2 theta + cos^2 theta = 1`, `1 + tan^2 theta = sec^2 theta`, and `1 + cot^2 theta = cosec^2 theta`.
- Unit-circle square proof with sine, cosine, and radius labels.
- Tangent/secant triangle proof with undefined warning at `cos theta = 0`.
- Cotangent/cosecant triangle proof with undefined warning at `sin theta = 0`.
- Formula transformation ladder for each identity.
- Live LHS/RHS verification with difference, tolerance, and match status.
- Angle slider from 0 degrees to 360 degrees plus snap buttons for standard angles.
- Proof model toggle: Geometry, Algebra, Numeric.
- Display toggles for squares, triangle, formula steps, and live values.
- Beginner/Professor mode, misconception correction, and lightweight practice prompts.

Verification so far:

- `npx vitest run src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 20 tests.
- `npx eslint src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint issues outside Phase 04 files.
- Browser route checks passed for `/trigonometry`, `/trigonometry/pythagorean-identity`, `/trigonometry/trigonometric-functions`, `/trigonometry/right-triangle-ratios`, `/trigonometry/reciprocal-ratios`, and `/math-lab/trigonometry`.
- Browser check of the `/trigonometry` Visualizations tab confirmed both the existing identity lab and the new Core Pythagorean Identity Proofs section.
- Mobile-width browser check passed for `/trigonometry/pythagorean-identity` with no horizontal overflow.

Known risks before Phase 05:

- The Trigonometry Visualizations tab now contains both the existing large identity lab and the new focused proof lab. This is intentionally safe but may become long as future phase labs are added.
- Direct point dragging is not implemented for Phase 04; angle slider and snap buttons are the accessible fallback.
- Full repo lint debt remains outside the Phase 04 files and should be resolved separately.

Final recommendation before Phase 05:

Start Phase 05 with addition and subtraction identities. Build the new proof scenes around direct value versus expanded value, keep A/B sliders independent, test edge cases, and continue preserving the existing identity visualizer until each focused proof scene is verified.

## Phase 05 Completion Notes

Phase 05 has been implemented as an additive Angle Sum and Difference Derivation Lab. No backend code, new Trigonometry module rewrite, route deletion, or existing visualizer removal was introduced.

Route/component changes:

- Added `src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx`.
- Added `src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so `sum-difference` opens the focused angle-sum/difference lab while preserving the classic concept lab below it.
- Updated `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` to add the focused lab beneath the existing visualization and Phase 04 proof sections.

Angle Sum and Difference Visualizer capabilities:

- Formula selector for six identities: sine addition, sine subtraction, cosine addition, cosine subtraction, tangent addition, and tangent subtraction.
- Two rotating angle arms for A and B, with a combined angle arm for `A+B` or `A-B`.
- A/B sliders, direct A/B drag handles, reset, and snap-to-common-angle buttons.
- Function and operation toggles so students can compare sine, cosine, and tangent behavior without losing the visual context.
- Direct value versus expanded value proof panel with live match status.
- Formula term breakdown, projection labels, value table, sign prediction, and click-to-fill formula-builder chips.
- Beginner/professor explanation modes, visual derivation steps, and misconception correction beside the diagram.
- Safe tangent handling for input breaks, expansion denominator breaks, and final-angle undefined cases.

Verification completed:

- `npx vitest run src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 30 tests.
- `npx eslint src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint debt outside Phase 05 files.

Known risks before Phase 06:

- The formula builder uses click-to-fill chips. Full drag/drop formula assembly is still a future enhancement.
- The visual proof is classroom-friendly and numeric; an advanced matrix/complex-number derivation layer is still pending.
- The Trigonometry Visualizations tab now contains several large preserved labs. Future navigation polish should consider sub-tabs or an internal formula finder without deleting any existing path.

Final recommendation before Phase 06:

Implement double-angle identities next. Reuse the Phase 05 angle-composition controls, but present `2theta` as theta added to itself so weak students can see the connection before reading the formulas.

## Phase 06 Completion Notes

Phase 06 has been implemented as an additive Double and Half Angle Visual Derivation Lab. Existing Trigonometry routes, tabs, concept fallbacks, Math Lab behavior, Phase 03-05 visualizers, and Visual Showcase behavior were not removed or rewritten.

Route/component changes:

- Added `src/visualizations/trigonometry/DoubleHalfAngleVisualizer.tsx`.
- Added `src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so `double-angle` opens the new lab with `sin-double` selected and `half-angle` opens it with `sin-half-square` selected.
- Updated `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` to include the focused lab under the existing Visualizations tab.

Double and Half Angle Visualizer capabilities:

- Formula selector for five double-angle identities and five half-angle identities.
- Repeated-rotation unit-circle scene showing theta, second theta, and final 2theta arm.
- Half-angle unit-circle scene showing theta and theta/2 arms.
- Draggable theta endpoint with slider and numeric input fallback.
- Snap buttons for common exact-value angles.
- Formula group and function toggles.
- Display toggles for theta arm, 2theta arm, theta/2 arm, formula steps, values, graph comparison, and challenge.
- Direct versus expanded verification panel for every formula.
- Formula transformation ladder deriving double angle from Phase 05 addition formulas and half angle by reversing cosine double-angle identities.
- Compact graph comparison for `f(theta)` versus `f(2theta)` or `f(theta/2)`.
- Click-to-fill formula builder with Check/Clear feedback.
- Half-angle sign panel explaining quadrant dependence for radical tangent form.
- Misconception correction for `sin(2theta) = 2sin(theta)`, tangent denominator failures, half-angle output-halving mistakes, and radical sign ambiguity.

Verification completed:

- `npx vitest run src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 44 tests.
- `npx eslint src/visualizations/trigonometry/DoubleHalfAngleVisualizer.tsx src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts src/visualizations/trigonometry/TrigIdentityVisualizations.tsx src/pages/TrigonometryConceptPage.tsx --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint debt outside Phase 06 files.

Known risks before Phase 07:

- The formula builder is click-to-fill only. Full drag/drop formula construction remains a future polish item.
- The graph comparison is intentionally compact and should not be treated as a full graphing studio.
- The Visualizations tab is now long because every previous lab is preserved additively.

Final recommendation before Phase 07:

Implement complementary-angle identities next with a right-triangle side-swap model. Keep the same route-preserving pattern and add a focused cofunction sign/quadrant panel for reciprocal forms.

## Phase 07 Completion Notes

Phase 07 has been implemented as an additive Trigonometry Graph Studio. No backend code, route deletion, Math Lab rewrite, Visual Showcase rewrite, or replacement of the existing six-function visualizer was introduced.

Route/component changes:

- Added `src/visualizations/trigonometry/TrigGraphStudio.tsx`.
- Added `src/visualizations/trigonometry/TrigGraphStudio.test.ts`.
- Updated `src/pages/TrigonometryConceptPage.tsx` so graph-related concepts open the new Graph Studio while preserving the classic concept lab below it.
- Updated `src/data/trigonometryConcepts.ts` to add safe aliases from `amplitude` to `wave-amplitude` and `period-frequency` to `wave-period-frequency`.
- Did not add the Graph Studio to `TrigIdentityVisualizations.tsx`, because that tab is already identity-lab heavy and Phase 07 is graph-route focused.

Graph Studio capabilities:

- Supports sine, cosine, and tangent transformations: `y = a f(bx + c) + d`.
- Includes sliders and numeric inputs for `a`, `b`, `c`, `d`, and x scrubber.
- Includes Explore, Step, and Challenge modes.
- Includes beginner/professor explanation toggle.
- Formula parameter highlighter explains `a`, `b`, `c`, and `d`.
- Main SVG graph shows transformed curve, optional parent overlay, optional challenge target, moving point, x marker, radian ticks, midline, amplitude bounds, period bracket, and phase-shift arrow.
- Unit-circle/wave link connects sine/cosine projections and tangent slope to graph behavior.
- Match-the-graph challenge gives local feedback on amplitude, period/frequency, phase, and vertical shift.
- Tangent asymptotes are drawn and undefined values are segmented safely.

Verification completed:

- `npx vitest run src/visualizations/trigonometry/TrigGraphStudio.test.ts src/visualizations/trigonometry/DoubleHalfAngleVisualizer.test.ts src/visualizations/trigonometry/AngleSumDifferenceVisualizer.test.ts src/visualizations/trigonometry/CoreIdentityProofVisualizer.test.ts src/visualizations/trigonometry/TriangleCircleRatioVisualizer.test.ts src/visualizations/trigonometry/UnitCircleMasterVisualizer.test.ts src/data/trigonometryLessonExperience.test.ts`: passed, 53 tests.
- `npx eslint src/visualizations/trigonometry/TrigGraphStudio.tsx src/visualizations/trigonometry/TrigGraphStudio.test.ts src/pages/TrigonometryConceptPage.tsx src/data/trigonometryConcepts.ts --max-warnings=0`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run lint`: still fails on unrelated existing lint debt outside Phase 07 files.

Known risks before Phase 08:

- Direct graph handles for amplitude, phase, and vertical shift are not implemented yet; the x scrubber is draggable and all parameters remain keyboard-accessible through sliders/numeric inputs.
- Tangent target challenge is intentionally deferred because safe visual matching around asymptotes needs a more specialized challenge design.
- The graph studio increases the concept-page bundle size; future phases should consider route-level lazy loading if bundle size becomes a priority.

Final recommendation before Phase 08:

Implement complementary-angle and cofunction identities next. Use the existing focused-lab pattern, keep right-triangle side swapping central, and add quadrant-aware reciprocal handling without replacing current identity or graph labs.
