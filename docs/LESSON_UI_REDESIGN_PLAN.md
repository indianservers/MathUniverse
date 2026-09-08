# Lesson UI Redesign Plan

## Scope

The application currently exposes 919 catalogued lessons:

- 674 interactive lessons rendered through 23 shared adapters.
- 220 school syllabus lessons.
- 25 advanced concept lessons.
- 199 school lessons already have dedicated target components and styles.

The redesign should use the Consistency of Linear Systems lesson as the density and interaction benchmark, while keeping each subject's visualization concept-specific.

## Reference Pattern

Every redesigned lesson should provide:

1. A compact title row with back navigation, one-sentence purpose, help, and lesson-specific presets.
2. A first-viewport work area containing controls, the main visualization, and the mathematical result together.
3. Numbered task panels with short instructions and immediate feedback.
4. Compact controls outside the visualization whenever they would obscure the mathematical content.
5. A small comparison or misconception strip showing what changes at an important boundary case.
6. Responsive layouts with one column on phones, two columns on tablets where useful, and the full working surface on desktop.

## Shared Components

Create a reusable lesson UI layer before migrating more routes:

- `LessonStudioShell`: compact title, back action, help popover, presets, and responsive content grid.
- `LessonStepCard`: numbered title, short instruction, body, and optional feedback footer.
- `LessonControlGroup`: inputs, selects, sliders, reset, and random/example actions.
- `LessonVisualPanel`: graph, diagram, table, matrix, proof, or simulation viewport with external view controls.
- `LessonResultCard`: rule, calculation, status, solution, and verification state.
- `LessonBoundaryStrip`: comparison, misconception, limiting case, or alternate example.

These components should define spacing, typography, focus behavior, touch targets, and responsive breakpoints. Lesson engines continue to own mathematics and visualization logic.

## Migration Sequence

### Phase 1 — Foundation

- Extract the reference pattern into the shared components above.
- Add design tokens for panel spacing, control height, feedback colors, and graph/result density.
- Add a lesson layout schema describing controls, visual type, result type, and boundary example.

### Phase 2 — Adapter-Driven Lessons

- Update the 23 shared adapters first.
- Pilot one representative lesson from every adapter.
- Once an adapter passes review, its full lesson family inherits the new shell.
- Prioritize graph, algebra, calculus, geometry, matrix, statistics, probability, and number adapters.

This phase covers most of the 674 interactive lessons without rewriting routes individually.

### Phase 3 — School Lessons

- Classify the 220 school lessons into reusable teaching patterns: graph exploration, geometry construction, algebra manipulation, matrix/table analysis, proof sequence, statistics experiment, probability simulation, and concept comparison.
- Migrate the 199 dedicated targets in batches by teaching pattern.
- Keep dedicated mathematical engines, but replace screenshot-sized page chrome and duplicated control styling with shared lesson components.
- Route the remaining school lessons through the closest shared pattern.

### Phase 4 — Advanced Lessons

- Apply the shared shell to the 25 advanced concept lessons.
- Permit denser formulas and multi-stage visualizations while retaining the same navigation, control, and result conventions.

### Phase 5 — Release Batches

- Release a 12-lesson pilot covering the major teaching patterns.
- Continue in batches of 50–75 routes.
- Freeze each completed batch with visual baselines before starting the next one.
- Keep a migration manifest with route, adapter/pattern, owner component, QA status, and known exceptions.

## Quality Gates

Every migrated lesson must pass:

- The primary control, visualization, and result are visible together at 1440px and 1024px widths when the lesson permits it.
- No horizontal page scrolling at 360px, 768px, 1024px, or 1440px.
- Controls remain usable with keyboard, touch, and 200% text enlargement.
- Main text is at least 16px; recurring control labels are at least 14px; secondary metadata is at least 12px.
- Interactive changes update every dependent representation consistently.
- Empty, invalid-input, boundary, and reset states are defined.
- Automated route smoke tests pass and representative visual regression images show no clipping or overlap.
- Mathematical outputs are checked against deterministic fixtures, independently of layout tests.

## Rollout Principle

Standardize the learning frame, control behavior, responsiveness, and feedback language. Do not force every lesson into the same visualization. The shared shell should make 919 lessons feel like one product while preserving the best representation for each mathematical idea.
