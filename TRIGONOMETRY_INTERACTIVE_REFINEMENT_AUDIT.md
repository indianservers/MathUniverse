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

