# Trigonometry target batch 0321-0340

Dedicated rebuild target: **59 of 130 lessons completed; 71 pending.**

| Mockup | Lesson | Status | Dedicated model and validation |
|---|---:|---|---|
| 0321 | 264 Reciprocal Trig Functions | Complete | Linked base/reciprocal branch model; two physical graph drags; sec, cosec, cot, undefined-state, settings, stages, grading, solution, and reset checks; exact 1024x1536 target geometry |

## Lesson 264 / Mockup 0321 - Reciprocal Trig Functions

Reworked individually against the target mockup with a dedicated `linked-base-reciprocal-trig-branch-domain-asymptote-model`. The selected reciprocal function and angle drive the base function, reciprocal function, both graph markers, reciprocal branches, undefined points, asymptotes, domain, range, period, zeros, live angle card, and exact reciprocal calculation. The renderer splits secant, cosecant, and cotangent into valid branches so curves never connect across denominator zeros. Both graph points are physically draggable and update the same angle model.

The secant, cosecant, and cotangent selectors are functional; the angle slider, four angle steppers, three graph windows, asymptote setting, stage navigation, language, reset, share, workspace focus, solution reveal, practice grading, and adjacent navigation all perform real actions. Undefined reciprocal values are explicitly guarded at denominator zeros. The four-answer secant challenge rejects an incorrect value, accepts equivalent exact radical notation, and restores all target answers on solution or reset.

Final 1024x1536 browser validation verifies the initial `cos 30° = √3/2` and `sec 30° = 2/√3`; physically drags both linked graph handles; verifies `cosec 30° = 2`, `cot 45° = 1`, and undefined `sec 90°`; toggles asymptotes; changes the graph window; changes lesson stages; follows incorrect, corrected, and solution practice paths; and resets the complete surface. The screenshot loop fixes the misconception icon/graph sizing and practice-field arrangement, then matches the target section geometry exactly: header y=98-306, stages y=317-357, lab y=368-969, rules y=975-1137, examples y=1148-1320, practice y=1331-1478, and navigation y=1486-1527. It reports no horizontal overflow and zero console messages.

Evidence:

- `0321-reference.png`
- `0321-desktop.png`
- `0321-dedicated-target-validation.json`
