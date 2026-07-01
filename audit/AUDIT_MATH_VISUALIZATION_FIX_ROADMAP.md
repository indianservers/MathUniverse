# Math Visualization Fix Roadmap

Generated on 2026-06-30.

## Priority 0 - Critical Mathematical/Broken Functionality Fixes

- Restore or complete placeholder visualizations before presenting them as learning tools.
- Fix any broken route, missing source path, lazy-loader mismatch, or cannot-run visualization reported in individual audits.
- Add explicit handling for undefined math states: division by zero, singular matrices, invalid triangles, zero vectors, empty sets, impossible probabilities, and out-of-domain functions.
- Prevent NaN, Infinity, or impossible geometry from appearing as normal student output.

## Priority 1 - Learning And Grade 6 Usability Fixes

- Mark advanced visualizations as teacher-guided and add prerequisite explanations.
- Add a Grade 6 first task to every visualization: predict, move/change one thing, observe, explain.
- Replace advanced vocabulary-first copy with simple-language explanations followed by formal terms.
- Add misconception checks and counterexamples for each major concept.
- Add teacher presets for default, edge case, and challenge states.

## Priority 2 - UI/UX And Accessibility Fixes

- Add keyboard and numeric alternatives for all drag/pan/zoom interactions.
- Add ARIA labels, diagram summaries, and live value descriptions.
- Verify color contrast in light/dark themes.
- Ensure labels do not overlap or disappear on mobile and projector viewports.
- Use tabs/progressive disclosure to reduce cognitive load in dense advanced labs.

## Priority 3 - Advanced Polish And Extension Ideas

- Add shareable state URLs for all major interactive visualizations.
- Add reduced-motion and high-contrast rendering modes.
- Add browser visual regression screenshots for core states.
- Add classroom worksheet export for teacher mode.
- Add analytics-free local progress checkpoints for student self-study.

## Suggested Execution Order

1. Fix placeholders and broken routes.
2. Add edge-case guards and tests for formula-heavy components.
3. Add Grade 6 guidance layer and teacher presets.
4. Improve accessibility and responsive layout.
5. Add polish, export, and visual regression coverage.
