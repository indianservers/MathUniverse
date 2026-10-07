# Sine & Cosine Laws content preservation audit

Audited before implementation: `src/studios/mockup/labs/ObliqueTriangleLab.tsx`, `trigonometryTargetMath.ts`, its tests, `trigStudioCopy.ts`, `studioMockupCatalog.ts`, `studioTheoryContent.ts`, `studioSimpleWords.ts`, `studioLearningTabs.ts`, `StudioTheoryPanel.tsx`, `studioLabKit.tsx`, `MockupStudioChrome.tsx`, route dispatch in `MockupStudioApp.tsx` and `App.tsx`, and `StudioModelProvider.tsx` / `modelLedger.ts`.

All six reference PNGs in `D:/Math App Screenshots for UI Update/Studios/trigonometry-studio/Sin & Cosine` were opened at original resolution before implementation. The old implementation was one mode-driven lab, rather than a separate dashboard and five route pages.

| Existing material | Destination and treatment |
|---|---|
| Old oblique landing/lab introduction | New dashboard hero, five whole-card destinations, method selector, applications, and retained learning panel |
| Sine Law ratios / opposite pairs / circumdiameter | Sine Law page: live ratios, pair selection, optional circumcircle, circumdiameter derivation, ASA/AAS explanation and live ASA/SSA solver |
| Cosine Law / square decomposition / Pythagoras | Cosine Law page: live SAS/SSS solver, all cyclic forms, angle formula, acute/right/obtuse presets and slider, square decomposition, coordinate derivation |
| Trigonometric area / Heron / semiperimeter / altitude | Area page: three cyclic calculators, live height, shading, supplementary-angle and maximum-area experiments, base-height derivation, Heron comparison. Area comparison also appears in complete solver |
| SSA height / count / second triangle / acute and obtuse B | SSA page: actual swinging-circle construction, dashed second solution, complete candidate solutions, six outcome presets, acute/right/obtuse rules. Corrected old inaccurate height note and mockup side convention |
| Solve Triangle six quantities / known-value mask / validity checks | Complete solver supports distinct ASA, AAS, SAS, SSS, SSA input cases, steps, all complete solutions, known/solved labels, original six marker checkboxes, angle sums and three inequalities |
| Numeric controls and vertex dragging | Shared accurate SVG explorer, numeric solvers, arrow-key vertex controls, reset, paired-side highlighting, values/angle/height/circumcircle/altitude/second-solution toggles |
| Existing practice questions | Each mode’s original fixed concept question retained in “Original Concept Practice & Learning Notes”; these explicitly say they are independent of the live model. Additional quizzes use calculated model answers and detect stale submissions |
| Observe / understand / why / try learning strip | Reorganized into meanings, key ideas, derivations, conceptual experiments, and retained learning notes; no pedagogical concept removed |
| Theory & examples / In Simple words / Formulas / Real-time examples / Try these | Existing `StudioTheoryPanel` reused beneath every page; original three worked examples, explanatory copy and practice preserved |
| Geometry data/state and known masks | Existing figure payloads are decoded through `StudioModelProvider`; old point coordinates are converted at the original scale of 30 to current numeric data. Original known-mask key retained. New page inputs and length units use the model ledger, undo/redo and share |
| Existing components / math functions / SVG / CSS | Old lab, utility and content files remain intact. New SVG recomputes actual geometry; projections and circumcircle calculations are preserved/reorganized with safe validation. Styling is scoped to `.obl-*` |

Removed educational content: none. Replaced presentation mechanisms: old five query modes now migrate to child routes. The old no-op “Solve” and ineffective side-c editor were replaced with actual solvers and SSS editing; the old decorative Measure text was not retained as a fake control. The code itself remains available.

## New files and architecture

`src/studios/trigonometry/oblique/` contains six separate page components: `ObliqueStudioHome.tsx`, `SineLawPage.tsx`, `CosineLawPage.tsx`, `TriangleAreaPage.tsx`, `SSAAmbiguousPage.tsx`, `SolveTrianglePage.tsx`.

Shared files: `ObliqueStudio.tsx` (layout, route selection, search, ledger toolbar, preserved learning), `ObliqueShared.tsx` (panels, numeric fields, formula renderer, live practice, explorer controls), `ObliqueTriangle.tsx` (SVG engine), `ObliqueLandscape.tsx` (authored vector background), `obliqueStudio.css` (scoped styles), `triangleMath.ts` (validated mathematics), plus `triangleMath.test.ts` and `ObliqueStudio.test.tsx`.

Only two existing files changed for this task: `src/App.tsx` adds child routes and wildcard fallback; `src/studios/mockup/MockupStudioApp.tsx` dispatches the dedicated sub-studio before the old sidebar chrome. Existing changes in these two files from the previous inverse task were preserved. No inverse, AR or unrelated studio implementation was changed for this task.

## Routes

- `/trigonometry/oblique`
- `/trigonometry/oblique/sine-law`
- `/trigonometry/oblique/cosine-law`
- `/trigonometry/oblique/area`
- `/trigonometry/oblique/ssa-ambiguous-case`
- `/trigonometry/oblique/solve-triangle`

Legacy `?mode=` spellings with spaces and compact names redirect with `replace`, retaining other parameters and the hash. These pages are separately defined components and actual App routes, not a single mode-based lab.

## Math utilities

Degree/radian conversion, Law of Sines side solving, Cosine Law side/angle solving, SAS area, ASA/AAS/SAS/SSS/SSA solving, cyclic SAS forms, triangle-side and angle validation, canonical coordinates, point-derived geometry, perpendicular projection, circumcircle, legacy mode normalization. Floating domain tolerance handles the SSA tangent boundary without fabricating a solution for invalid measurements. All internal calculations retain precision; rounding occurs only in the display.

## Reference comparison

| Reference | Browser comparison |
|---|---|
| Dashboard | Mountain hero with correct A-apex/opposite-side notation, live pair highlight, formula rail, five colored destinations, why/applications/context sections |
| Sine Law | Large serif heading, meanings/formula/key idea left, live triangle center, inputs and calculation steps right, applications and quiz below |
| Cosine Law | Same three-panel hierarchy, SAS and SSS modes, cyclic laws, numeric correction and Pythagorean experiment |
| Area | Same hierarchy, shaded triangle/altitude, cyclic formula selector, live multiplication and square-unit answer; height label moved to avoid side-label overlap |
| SSA | Same hierarchy, height rules and separate obtuse guidance, accurate circle-ray construction, visible solid/dashed alternatives, both complete solutions |
| Solve Triangle | Problem types left, known/solved triangle center, case selection and step-by-step solution right, verification and quiz below |

Remaining visual differences: authored vector mountain/lake artwork instead of the mockup’s photograph; existing global app navigation above the sub-studio; extra genuine explorer controls and preserved educational content beneath the first screen; mathematically corrected values and SSA vertex convention. This is not a pixel-identical screenshot reproduction.

The mockup’s A48°, B62°, a6.7 example gives b≈7.9604, not 8.39. Its b9.1, c7.5, A58° example gives a≈8.1686, not 8.02. The area example b8.4, c10.2, A47° gives approximately 31.3312. Actual geometry and outputs use these calculations.

## Verification evidence

See `tests.log`, `typecheck.log`, `lint.log`, `build.log`, `browser-report.json`, `final-report.json`, desktop/laptop/tablet/mobile screenshots and executable Playwright scripts in this folder. Check results and whole-project limitations are recorded in `verification.md`.
