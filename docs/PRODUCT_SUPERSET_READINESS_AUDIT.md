# Math Universe Superset Readiness Audit

Date: 2026-06-19

## Executive Verdict

Math Universe is already broader than any one of Brilliant, GeoGebra, or Wolfram Alpha in product ambition: it combines visual proofs, formula reference, theorem reference, visual dictionary, syllabus labs, Olympyard practice, workspace construction, graphing, 3D, CAS-style notebooks, and problem solving inside one browser-only app.

It is not yet a true production superset of all three. The strongest claim today is:

**Browser-based visual mathematics learning platform with early superset architecture, Visual Proofs production-ready, and Workspace/Formula/Theorem/Dictionary layers moving toward unified premium readiness.**

To honestly claim "better than Brilliant + GeoGebra + Wolfram Alpha" the app still needs deeper adaptive learning, more exact computation reliability, curated concept graph links, classroom/LMS workflows, and stronger cross-browser visual regression coverage.

## Competitor Baseline

### Brilliant

Public positioning: interactive problem solving, step-by-step thinking, personalized learning paths, feedback, motivation, and courses from basic arithmetic through calculus, vectors, discrete math, statistics, number theory, and applied math.

Superset implication:

- Match guided interactive lessons.
- Beat it with live visual proofs, construction workspace, formulas, theorem links, and solver integration.
- Must add mastery tracking, adaptive lesson sequencing, and teacher/classroom analytics.

### GeoGebra

Public positioning: browser calculator suite with graphing, geometry, 3D, and classic calculator experiences.

Superset implication:

- Match dynamic construction, graphing, 3D, spreadsheet/CAS style workflows, import/export, sharing, and classroom projection.
- Beat it with syllabus-aware lessons, visual proofs, theorem/formula/dictionary links, practice exits, and guided explanation modes.
- Must improve construction UX, command parity, visual QA, and object reliability.

### Wolfram Alpha

Public positioning: broad mathematical computation across arithmetic, geometry, numbers, number theory, applied math, statistics, algebra, differential equations, trigonometry, discrete math, logic, probability, calculus, plotting, linear algebra, complex analysis, and special functions.

Superset implication:

- Match natural-language math query breadth and step-by-step computational correctness.
- Beat it with visual-first reasoning, classroom worksheets, proof links, and browser-only offline modes.
- Must harden solver correctness before advertising Wolfram-grade answers.

## Current App Inventory

Observed local evidence:

- 183 phase-upgraded Visual Proof routes across 18 categories.
- Full Visual Proof browser smoke coverage exists for 183 routes.
- Full SVG-backed PNG export matrix exists for 183 routes.
- Visual Proof route chunk has already been lazy-split down to about 53 kB uncompressed in recent QA.
- Formula library has large formula coverage and symbol explanations.
- Theorem library has 216 theorem entries across broad categories.
- Visual dictionary has expanded term coverage and lazy category navigation.
- Workspace includes graph, geometry, 3D, data/CAS, teacher studio, object graph, import/export, and offline/share architecture.
- Problem Solver has deterministic school math, result cards, recognition, visual verification, and CAS-style fallback, but previous audit records correctness blockers.
- CAS notebook supports worksheet memory, references, named assignments, matrix/list summaries, and markdown export.
- 113 test files exist locally.
- 44 documentation/audit files exist locally.

## Overall Ranking

| Product | Current Rank | Why |
|---|---:|---|
| Wolfram Alpha | 1 | Still far ahead in computational breadth, symbolic correctness, natural language, special functions, differential equations, and trusted answer reliability. |
| GeoGebra | 2 | Still ahead in mature dynamic construction UX, ecosystem, object manipulation, classroom usage, and calculator polish. |
| Math Universe | 3 | Already broader as an integrated learning platform and stronger than GeoGebra/Wolfram in visual-proof learning depth, but not as reliable/mature in computation or construction yet. |
| Brilliant | 4 | Stronger than Math Universe in polished guided learning and personalization, but narrower for construction, computation, formulas, theorems, and browser math tools. |

Target ranking after required hardening:

| Product | Target Rank | Condition |
|---|---:|---|
| Math Universe | 1 | Achieve solver correctness hardening, GeoGebra-grade workspace UX, Brilliant-grade guided lessons, and unified theorem/formula/proof knowledge graph. |
| Wolfram Alpha | 2 | Still best raw computation, but Math Universe can surpass for visual education and classroom use. |
| GeoGebra | 3 | Still excellent construction tool, but Math Universe can surpass if visual proofs, formulas, theorems, syllabus, and solver stay connected. |
| Brilliant | 4 | Still strong learning product, but Math Universe can exceed breadth if adaptive learning is built. |

## Readiness Certificate By Module

Certificate scale:

- **Certified**: safe to position as production-ready for its stated scope.
- **Classroom Ready**: safe for teacher/demo/classroom use with known limitations.
- **Beta**: valuable but must not be overpromised.
- **Prototype**: promising, not ready for external promise.

| Module | Score | Certificate | Current Strength | Main Gap |
|---|---:|---|---|---|
| Visual Proofs | 92/100 | Certified | 183 browser-tested routes, full SVG/PNG export QA, metadata-driven routing, category coverage. | Screenshot-baseline visual regression and curated theorem/formula graph still needed. |
| Formulas | 82/100 | Classroom Ready | Large formula library, category pages, symbol explanations, visual/theorem links. | Needs per-formula mini visualization quality grading and exact curated references. |
| Theorems | 68/100 | Beta | 216 theorem entries, category pages, cross-links to proofs/formulas. | Step-by-step proofs mostly planned, not complete. |
| Visual Dictionary | 78/100 | Classroom Ready | Broad term coverage, category-first navigation, visual representations. | Needs professor-level accuracy pass and term-to-formula/proof/theorem graph. |
| Trigonometry Formula Visualizer | 84/100 | Classroom Ready | Unit circle, identities, formula gallery, journey/practice/comparison modes. | Needs deeper assessment analytics and route-level visual regression. |
| Workspace Graphing | 72/100 | Beta | Browser graph/algebra route, object graph, dynamic links. | Needs GeoGebra-grade expression handling, performance, and polished graph inspector. |
| Workspace Geometry | 74/100 | Beta | 2D primitives, constraints, angle/measurement tools, drag recomputation, diagnostics. | Needs full GeoGebra tool parity, clearer construction protocol UI, and broader browser QA. |
| Workspace 3D | 69/100 | Beta | 3D calculator route and object manipulation architecture. | Needs richer 3D math objects, projection/measurement tools, and export reliability. |
| CAS Notebook | 70/100 | Beta | Worksheet memory, cell references, assignments, matrix/list summaries, markdown export. | Not Mathematica/Wolfram-grade; assumptions and symbolic coverage are limited. |
| Problem Solver | 55/100 | Prototype/Beta | Result cards, visual verification, deterministic school solvers, recognition panel. | Known correctness blocker for degenerate equations; not safe to call Wolfram-grade. |
| Olympyard | 66/100 | Beta | Dedicated route/practice direction, local progress patterns, contest roadmap. | Needs deep question bank, adaptive hints, mastery map, and visual solution linking. |
| Syllabus Labs | 76/100 | Classroom Ready | Board/syllabus topic coverage, advanced labs, visual tasks. | Needs consistent practice exits and teacher lesson-pack export. |
| Teacher Studio | 62/100 | Beta | Workspace teaching route and classroom-oriented architecture exists. | Needs class sessions, projector mode, assignments, LMS export/import. |
| Offline/Browser-Only Readiness | 74/100 | Classroom Ready | Vite/PWA dependencies, browser-only architecture, local storage/export patterns. | Needs formal offline install QA, cache policy, recovery testing, and no-network audit. |
| Accessibility | 64/100 | Beta | Many controls have labels/focus patterns in newer modules. | Needs app-wide keyboard, reduced-motion, screen-reader, and mobile overflow audit. |

## Superset Feature Matrix

| Capability | Brilliant | GeoGebra | Wolfram Alpha | Math Universe Today | Superset Target |
|---|---:|---:|---:|---:|---|
| Guided lessons | Excellent | Limited | Limited | Medium | Brilliant-grade journeys in every topic. |
| Interactive visual intuition | Excellent | Excellent | Medium | Strong | Unify visual dictionary, proofs, formulas, and workspace. |
| Dynamic geometry | Low | Excellent | Medium | Medium | GeoGebra-grade tools plus proof mode. |
| Graphing | Low | Excellent | Excellent | Medium | Robust 2D/3D plotting, inequalities, parametric/polar, export. |
| CAS and symbolic computation | Low | Medium | Excellent | Medium-low | Harden exact algebra, calculus, matrices, ODEs, assumptions. |
| Step-by-step solving | Medium | Low | Excellent | Medium-low | Correctness-first solver with visual verification and proof links. |
| Visual proofs | Medium | Medium | Low | Excellent | Keep this as flagship differentiator. |
| Formula reference | Medium | Low | Medium | Strong | Add formula dependency graph and examples. |
| Theorem library | Medium | Low | Medium | Medium | Add step-by-step visual proof pages. |
| Practice/adaptive learning | Excellent | Medium | Low | Medium-low | Adaptive mastery, spaced repetition, classroom assignments. |
| Teacher/classroom tools | Medium | Excellent | Low | Medium-low | Projector mode, lesson links, LMS readiness. |
| Browser-only offline use | Medium | Medium | Low | Medium | Formal PWA offline certification. |

## Premium Superset Architecture

To become a true browser-only superset, every math concept should connect through one object graph:

1. **Concept**
2. **Formula**
3. **Theorem**
4. **Visual proof**
5. **Interactive workspace construction**
6. **Step-by-step solver**
7. **Practice question**
8. **Teacher lesson link**
9. **Export/share artifact**

The current app has most of these pieces separately. The next premium leap is making the links curated, typed, and visible everywhere.

## Module-Level Certification Notes

### Visual Proofs Certificate

Status: **Certified for browser classroom/release use.**

Reason:

- Full 183-route browser smoke matrix.
- Full 183-route PNG export artifact matrix.
- Lazy-split route chunk.
- Snapshot/SVG/PNG export coverage.
- Category metadata and route smoke manifest.

Remaining condition before "enterprise premium":

- Add screenshot-baseline visual regression for flagship proofs.
- Add exact theorem/formula linkage map.

### Workspace Certificate

Status: **Beta, not yet GeoGebra parity.**

Reason:

- Strong architecture exists: 2D, 3D, graph, data/CAS, object graph, teacher route.
- Geometry kernel has deterministic constraints and diagnostics.
- Release health model exists.

Blocking gaps:

- Tool UX, command coverage, and construction protocol are not yet as mature as GeoGebra.
- Need route-level browser smoke and visual correctness tests for graph/geometry/3D.
- Need more exact construction validation and export QA.

### Problem Solver Certificate

Status: **Prototype/Beta, not Wolfram-grade.**

Reason:

- Good UI, result cards, recognition, visual verification, deterministic rules.
- Prior audit found a critical wrong answer for a degenerate equation.

Blocking gaps:

- Fix correctness blockers before any premium claim.
- Add golden-answer suite across algebra, calculus, trigonometry, matrices, probability, and engineering math.
- Unsupported cases must say "not supported" clearly instead of appearing solved.

### Brilliant-Style Learning Certificate

Status: **Beta.**

Reason:

- Formula visualizer journey/practice modes, Olympyard, daily challenge, spaced repetition, visual proofs, and syllabus labs form a strong base.

Blocking gaps:

- No fully adaptive learning path engine yet.
- No diagnostic placement test feeding personalized lessons.
- No mastery model connecting all modules.

## Superset Readiness Score

Current product score: **74/100**

Interpretation:

- Strong enough to demo as a premium browser-based visual math universe.
- Strong enough to claim deeper visual proof coverage than the competitors.
- Not yet strong enough to claim complete superset of Brilliant + GeoGebra + Wolfram Alpha.

Target for public "superset" claim: **90/100**

## Top Risks

| Risk | Severity | Why It Matters | Required Action |
|---|---:|---|---|
| Solver correctness | Critical | A single confident wrong answer breaks trust. | Fix known blockers and add golden-answer test matrix. |
| Workspace parity | High | GeoGebra comparison will expose missing tools quickly. | Add tool parity roadmap and browser visual QA. |
| Curated graph missing | High | Heuristic links are useful but not premium-grade. | Add typed concept/formula/theorem/proof relation data. |
| Visual regression missing outside Visual Proofs | High | App can visually break without test failures. | Add Playwright smoke for formulas, theorems, dictionary, workspace. |
| Mobile density | Medium | Backbenchers/classrooms need big, readable, low-scroll UI. | Add mobile + projector modes per module. |
| Accessibility | Medium | Premium education requires keyboard and screen-reader readiness. | Add app-wide accessibility certification checklist. |
| Full lint/test debt | Medium | Release confidence drops if global CI is noisy. | Fix in focused debt phases, not during feature work. |

## Required Roadmap To Become The Superset

### Phase A: Trust First

- Fix problem-solver correctness blockers.
- Add golden-answer test matrix.
- Add unsupported-input honesty.
- Certify algebra/calculus/matrix/probability solvers separately.

Acceptance:

- No known critical wrong answers.
- 500+ solver golden cases pass.

### Phase B: GeoGebra Parity Track

- Add workspace route smoke tests.
- Add angle, measurement, construction, command, protocol, object inspector, and export QA.
- Improve construction UX for classroom use.

Acceptance:

- 50+ geometry construction workflows pass in browser.
- Graph/geometry/3D/data routes have nonblank and interaction smoke.

### Phase C: Brilliant Parity Track

- Add adaptive mastery engine.
- Add placement quiz.
- Add lesson journeys per topic.
- Add practice exits from formulas, theorems, visual proofs, and dictionary terms.

Acceptance:

- Every major category has learn -> visualize -> practice -> review loop.

### Phase D: Knowledge Graph Track

- Replace heuristic links with typed relations:
  - `formulaIds`
  - `theoremIds`
  - `visualProofIds`
  - `dictionaryTermIds`
  - `workspaceTemplateIds`
  - `practicePackIds`

Acceptance:

- Every theorem detail page has exact formula/proof/practice links where available.
- Every formula can show "used in theorems", "proved by", and "practice now".

### Phase E: Teacher And Classroom Track

- Projector mode.
- Lesson-link export with encoded state.
- LMS-ready export.
- Offline lesson packs.
- Class progress import/export without server.

Acceptance:

- Teacher can open a concept, project it, share a stateful link, export worksheet/practice, and run offline.

## Final Certification

**Certified as a premium browser-based visual math platform foundation.**

**Not yet certified as a full Brilliant + GeoGebra + Wolfram Alpha superset.**

The correct product positioning today:

> Math Universe is a browser-only visual mathematics universe combining proof, formula, theorem, dictionary, construction, graphing, CAS-style notebooks, solver workflows, and practice. Its Visual Proofs module is production-ready; the overall platform is in advanced beta on the path to becoming a true superset of Brilliant, GeoGebra, and Wolfram Alpha.

The most important next implementation phase:

**Trust First: Problem Solver Correctness Certification.**

Reason:

If the app wants to compete with Wolfram Alpha and become the computational layer behind formulas, theorems, and visual proofs, correctness must become the foundation. Visual brilliance can attract users, but mathematical trust keeps them.

