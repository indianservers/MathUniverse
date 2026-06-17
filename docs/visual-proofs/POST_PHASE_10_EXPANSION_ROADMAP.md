# Post-Phase-10 Visual Proofs Expansion Roadmap

## 1. Current Upgraded Status

The first 10-phase upgrade cycle established the Visual Proofs module as a reusable, browser-only proof learning system rather than a collection of isolated diagrams.

Current status:

- Phase-upgraded routes: 41.
- Fully upgraded categories:
  - Trigonometry: 15 of 15 available routes.
  - Coordinate Geometry: 15 of 15 available routes.
- Partially upgraded categories:
  - Geometry: 5 upgraded routes.
  - Algebraic Identities: 4 upgraded routes.
  - Sequences and Series: 2 upgraded routes.
- Available legacy routes still pending: 54.
- Coming-soon starter categories still pending real proof implementation: 11.

Partially upgraded route families should now be treated as the next conversion pool. Their legacy routes still work, but they do not yet share the full `VisualProofShell` learning loop: manipulate, predict, reveal, inspect, export, and practice.

Legacy category work still pending:

- Geometry: remaining area, similarity, polygon, circle, sector, trapezoid, and exterior-angle routes.
- Algebraic Identities: remaining distributive, trinomial, completing-square, factorization, cube, and sum/difference routes.
- Sequences and Series: remaining arithmetic, geometric, Fibonacci, Pascal, induction, and harmonic routes.
- Calculus: all available routes remain legacy.
- Number Theory: all available routes remain legacy.
- Probability: starter route only.
- Statistics: starter route only.
- Matrices and Linear Algebra: starter route only.
- Vectors: starter route only.
- Complex Numbers: starter route only.
- Mensuration: starter route only.
- Conic Sections: starter route only.
- Inequalities: starter route only.
- Logarithms and Exponents: starter route only.
- Transformations and Symmetry: starter route only.
- Engineering Mathematics: starter route only.

## 2. Highest Priority Engineering Improvements

These should be treated as platform investments, not one-off proof work.

1. Browser E2E route smoke tests
   - Add a real browser test runner only when the team is ready to own it.
   - Cover `/visual-proofs`, category pages, and every `phase-upgraded` proof route.
   - Assert no error overlay, visible title, primary visual, controls, formula panel, inspector, and snapshot button.

2. Nonblank SVG/canvas checks
   - Start with SVG-backed proofs because all 41 current upgraded proofs declare SVG expectations.
   - Check for actual SVG child elements and visible bounding boxes.
   - Add canvas pixel checks only when canvas-backed proofs enter the upgraded pool.

3. Mobile label collision detection
   - Add viewport checks at 320, 375, 390, 430, and tablet widths.
   - Flag horizontal page scroll, overlapping labels, clipped controls, and formula panel overflow.
   - Keep per-proof fixes conservative and route-family based.

4. PNG export
   - Add after SVG export is proven reliable.
   - Prefer a browser-native or already-installed path; do not add a heavy dependency casually.
   - Export should include title, route, timestamp, current step, and visible proof state.

5. `VisualProofPage` category-level lazy splitting
   - Split proof component loading by category first, then by component key only if needed.
   - Preserve direct URLs and legacy route behavior.
   - Use browser route smoke coverage before and after the split.

6. Teacher lesson-link export with encoded proof state
   - Encode route, active step, parameters, toggles, reveal state, and teacher-visible labels.
   - Keep URLs shareable and bounded in length.
   - Fall back to JSON snapshot when state is too large.

7. Olympyard deep-link integration
   - Replace broad practice exits with proof-specific practice starts.
   - Carry topic, difficulty, misconception type, and proof route source into practice.
   - Track proof-to-practice conversion once analytics exist.

## 3. Next Proof-Family Upgrade Roadmap

Priority order:

1. Remaining Geometry
   - Rationale: closest to current area/angle/SVG primitives and high classroom value.
   - Best next cluster: exterior angle, similar triangles, sector area, trapezoid area, polygon interior angle sum, circle area unrolling.

2. Remaining Algebraic Identities
   - Rationale: current tile-model infrastructure already covers the visual language.
   - Best next cluster: distributive law, three-term square, completing the square, quadratic factorization, cube identities, sum/difference product.

3. Sequences and Series
   - Rationale: strong beginner impact and pattern-model reuse.
   - Best next cluster: arithmetic progression sum, finite/infinite geometric series, triangular numbers, square numbers, Fibonacci tiling.

4. Calculus
   - Rationale: premium differentiation, but requires careful graph-limit and approximation primitives.
   - Best next cluster: limit approaching point, derivative as tangent slope, secant becomes tangent, Riemann sums, accumulated area.

5. Number Theory
   - Rationale: excellent visual reasoning category, but needs array, clock, divisibility, and Euclidean algorithm primitives.

6. Probability
   - Rationale: create the first real simulation-board category and establish random/seeded visual proof conventions.

7. Statistics
   - Rationale: create the first real data-display category with sampling, distribution, and summary-statistic visuals.

8. Matrices and Linear Algebra
   - Rationale: high value for senior students; needs matrix/grid/vector transformation primitives.

9. Vectors
   - Rationale: pairs well with coordinate and linear algebra primitives.

10. Complex Numbers
    - Rationale: benefits from coordinate-plane and rotation primitives.

11. Mensuration
    - Rationale: strong school value; can reuse measurement-scene patterns.

12. Conic Sections
    - Rationale: visually rich but requires robust geometric construction primitives.

13. Inequalities
    - Rationale: needs comparison, number-line, region-shading, and proof-by-transform primitives.

14. Logarithms and Exponents
    - Rationale: needs growth-scale and inverse-function visual language.

15. Transformations and Symmetry
    - Rationale: coordinate transformation primitives are already strong; can become a new fully upgraded category.

16. Engineering Mathematics
    - Rationale: should come after the platform can support applied-system proofs with parameterized scenarios.

## 4. Suggested Next 10 Phases

### Phase 11: Browser QA Foundation And Geometry Completion

- Target routes/categories: remaining high-value Geometry routes.
- Technical goals:
  - Add browser E2E smoke tests for all 41 upgraded routes and the new Phase 11 geometry routes.
  - Add nonblank SVG assertions for upgraded proofs.
  - Start mobile viewport smoke checks.
- Educational goals:
  - Complete the geometry proof story around angles, areas, polygons, circles, and similarity.
  - Keep explanations concrete, diagram-first, and misconception-led.
- QA goals:
  - Verify route load, nonblank visual, controls, formula panel, inspector, and snapshot button.
  - Check mobile stacking and no horizontal scroll on representative geometry routes.
- Acceptance criteria:
  - Remaining selected geometry routes are `phase-upgraded`.
  - Browser smoke suite passes locally.
  - Typecheck, build, Phase 10 audit, and new Phase 11 tests pass.
  - No legacy geometry route is removed.

### Phase 12: Algebraic Identities Completion

- Target routes/categories: remaining Algebraic Identities routes.
- Technical goals:
  - Extend tile-model primitives for trinomial, completing-square, factorization, cube, and sum/difference identities.
  - Add route-family formula token audits.
- Educational goals:
  - Make algebraic expansion and factorization feel like area conservation rather than symbol memorization.
- QA goals:
  - Browser smoke tests cover all algebra routes.
  - Mobile checks focus on tile labels and formula wrapping.
- Acceptance criteria:
  - Algebraic Identities becomes fully phase-upgraded.
  - Every route has prediction, misconception, formula tokens, state inspector, and snapshot support.

### Phase 13: Sequences And Series Completion

- Target routes/categories: remaining Sequences and Series routes.
- Technical goals:
  - Build pattern-model primitives for AP/GP sums, Fibonacci tiles, Pascal triangle, induction, and harmonic growth.
  - Add scalable term-count controls with safe bounds.
- Educational goals:
  - Shift sequence formulas from memorized results to visible structure.
- QA goals:
  - Browser tests assert nonblank pattern visuals and working term controls.
  - Mobile checks focus on dense repeated structures.
- Acceptance criteria:
  - Sequences and Series becomes fully phase-upgraded or has a documented split if harmonic/advanced routes need Phase 14.

### Phase 14: Calculus Graph-Limit Foundation

- Target routes/categories: first Calculus cluster.
- Technical goals:
  - Create graph-limit primitives for limit, tangent, secant, Riemann, and accumulated area visuals.
  - Standardize exact versus approximate numerical display.
- Educational goals:
  - Teach calculus as changing geometry: slopes, areas, accumulation, and limiting behavior.
- QA goals:
  - Browser smoke includes graph nonblank checks.
  - Reduced-motion checks prevent auto-animation dependency.
- Acceptance criteria:
  - At least five calculus routes are phase-upgraded with graph-limit metadata.

### Phase 15: Calculus Completion And PNG Export

- Target routes/categories: remaining Calculus routes plus PNG export.
- Technical goals:
  - Complete calculus route upgrades.
  - Add reliable PNG export for SVG-backed proof visuals.
- Educational goals:
  - Support teacher-ready calculus snapshots for classroom boards and worksheets.
- QA goals:
  - Export tests cover SVG fallback and PNG success path where feasible.
  - Browser smoke covers all calculus routes.
- Acceptance criteria:
  - Calculus becomes fully phase-upgraded.
  - PNG export is documented, tested, and gracefully unavailable where unsupported.

### Phase 16: Number Theory Visual Reasoning

- Target routes/categories: Number Theory.
- Technical goals:
  - Build array, clock, grouping, divisibility, factorization, and Euclidean algorithm primitives.
- Educational goals:
  - Make divisibility, primes, gcd/lcm, modular arithmetic, and irrationality visible.
- QA goals:
  - Browser smoke checks nonblank arrays/clocks and usable controls.
- Acceptance criteria:
  - A substantial Number Theory cluster is phase-upgraded with number-model metadata.

### Phase 17: Probability And Statistics Launch

- Target routes/categories: Probability and Statistics starter categories.
- Technical goals:
  - Replace starter routes with real simulation-board and data-display proofs.
  - Add deterministic seeds for repeatable classroom snapshots.
- Educational goals:
  - Teach randomness and data through repeatable experiments, not just formulas.
- QA goals:
  - Tests confirm deterministic defaults and stable snapshot data.
- Acceptance criteria:
  - Probability and Statistics each have at least one real phase-upgraded route.

### Phase 18: Linear Algebra, Vectors, And Complex Numbers

- Target routes/categories: Matrices and Linear Algebra, Vectors, Complex Numbers.
- Technical goals:
  - Build vector-plane, matrix-grid, transformation, eigenvector, and complex-rotation primitives.
- Educational goals:
  - Connect vectors, matrices, and complex multiplication as transformations.
- QA goals:
  - Mobile checks focus on coordinate labels and transformation overlays.
- Acceptance criteria:
  - Each category has at least one real phase-upgraded route.

### Phase 19: Measurement, Conics, Inequalities, And Growth

- Target routes/categories: Mensuration, Conic Sections, Inequalities, Logarithms and Exponents.
- Technical goals:
  - Add measurement-scene, conic-construction, comparison-region, and growth-scale primitives.
- Educational goals:
  - Expand visual proof coverage into school-to-competitive bridge topics.
- QA goals:
  - Browser smoke verifies each new category route and proof route.
- Acceptance criteria:
  - Each category has at least one real phase-upgraded route and a documented primitive family.

### Phase 20: Transformations, Engineering Mathematics, And Productization

- Target routes/categories: Transformations and Symmetry, Engineering Mathematics, platform polish.
- Technical goals:
  - Add applied-system proof primitives.
  - Implement teacher lesson-link export with encoded proof state.
  - Complete category-level lazy splitting of `VisualProofPage`.
- Educational goals:
  - Make the module classroom-ready across proof families, practice flows, and applied scenarios.
- QA goals:
  - Full upgraded-route browser smoke suite passes.
  - Lazy-loaded route chunks are validated by direct URLs.
- Acceptance criteria:
  - All starter categories have at least one real proof.
  - Route chunk strategy is improved.
  - Teacher lesson-link export is usable.

## 5. Premium Product Recommendations

Teacher mode:

- Add frozen state, reveal-layer controls, lesson notes, and export history.
- Keep JSON/SVG/PNG export actions clearly separated.

Classroom projection:

- Add a large-display mode with larger labels, fewer side panels, and high contrast.
- Include step-by-step reveal pacing for boards and projectors.

Practice exits:

- Make exits proof-specific, not just category-specific.
- Include misconception-linked practice sets.

LMS integration readiness:

- Keep snapshot payloads versioned.
- Define exportable metadata for route, topic, standard, difficulty, and learning objective.
- Prepare for LTI-style launches later without coupling the browser module to server code now.

Offline browser readiness:

- Keep core proof assets client-side.
- Avoid server dependencies for snapshot/export.
- Validate service-worker behavior only after existing app PWA debt is understood.

Accessibility polish:

- Add browser tests for focus order and visible focus.
- Add screen-reader summaries for each primary visual.
- Ensure all drag interactions have keyboard alternatives.

Low-IQ/student-friendly explanation mode:

- Add a "simple explanation" layer with shorter sentences, fewer symbols, and concrete wording.
- Use this as an accessibility and remediation mode, not as a replacement for rigorous derivation.
- Pair every simple explanation with a "show formal version" option.

Olympiad challenge mode:

- Add optional hidden-step and proof-completion tasks.
- Ask learners to predict invariants before reveal.
- Use stricter distractors based on common contest misconceptions.

## 6. Risk Register

Route chunk size:

- `VisualProofPage` remains a large static switch.
- Mitigation: add category-level lazy splitting after browser route smoke tests exist.

Lack of browser visual tests:

- Static metadata checks cannot prove visuals are nonblank in a real browser.
- Mitigation: prioritize browser E2E in Phase 11.

Mobile overlap risk:

- Shared containment helps, but dense SVG labels may still collide.
- Mitigation: add viewport checks and route-family mobile passes.

Legacy route inconsistency:

- Legacy routes remain useful but vary in interaction quality.
- Mitigation: complete one category at a time and preserve direct URLs.

Full repo lint/test debt:

- Existing unrelated failures can obscure proof-specific confidence.
- Mitigation: keep focused proof checks explicit until broader repo debt is addressed.

Export reliability:

- SVG export depends on accessible SVG availability; PNG export will add browser variability.
- Mitigation: keep graceful unavailable states and test export utilities separately.

Future maintainability:

- Phase-specific config files can sprawl if primitives are copied instead of extracted.
- Mitigation: extract shared primitives only when two or more proof families genuinely need them.

## 7. Immediate Phase 11 Recommendation

Recommended next implementation phase: Phase 11, Browser QA Foundation And Geometry Completion.

Why this one:

- It fixes the biggest confidence gap first: the lack of real browser visual smoke tests.
- It unlocks safer future work on route chunk splitting, mobile overlap checks, and PNG export.
- Geometry is the lowest-risk next proof family because the module already has strong area, angle, circle, and SVG primitives.
- Completing Geometry creates a third major category milestone after Trigonometry and Coordinate Geometry, which is valuable for both product positioning and classroom adoption.
