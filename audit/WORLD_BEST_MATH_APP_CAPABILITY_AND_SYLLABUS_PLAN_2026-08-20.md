# World-Best Mathematics App — Capability and Syllabus Plan

Date: 20 August 2026  
Scope: 2D graphing, 3D graphing, dynamic geometry, CAS, probability and statistics, concept learning, CBSE/NCERT, Andhra Pradesh and Telangana Intermediate, and state-board expansion  
Companion audits:

- `audit/CORE_MATH_ENGINES_CONCEPT_COMPETITIVE_AUDIT_2026-08-20.md`
- `audit/WORLD_BEST_OFFLINE_MATH_APP_COMPETITIVE_AUDIT_2026-08-20.md`

## Executive decision

Math Universe should not try to win by adding more isolated pages. It already has unusual breadth: the generated inventory reports 919 lessons, including 674 core lessons, 220 school lessons, and 25 advanced lessons. Its strongest differentiator is concept explanation and visual pedagogy.

The product does not yet lead GeoGebra, Desmos, or Wolfram|Alpha overall because many concepts are represented by lesson routes or presets rather than by general, reusable mathematical engines. The same distinction matters in syllabus coverage: a chapter title in navigation is not proof that the official learning outcomes, examples, exercises, assessments, and current board version are covered.

The route to a world-leading product is therefore:

1. Establish a truthful, evidence-backed capability and syllabus registry.
2. Build one universal mathematical object/dependency system shared by 2D, 3D, geometry, CAS, tables, and probability/statistics.
3. Turn the current breadth into executable depth: every priority concept must be explainable, manipulable, computable, assessable, and transferable between modules.
4. Complete and certify current CBSE/NCERT and AP/TS Intermediate pathways before claiming broad state-board coverage.
5. Make authoring, accessibility, assessment, and verification first-class product systems rather than final polish.

## Current position and target

The focused competitive audit placed the products as follows across the five core modules:

| Rank | Product | Current composite | Main advantage |
| --- | --- | ---: | --- |
| 1 | GeoGebra | 9.2 | Unified algebra, geometry, CAS, 2D, 3D, spreadsheet, and probability object system |
| 2 | Wolfram\|Alpha | 8.1 | Symbolic, statistical, probability, and natural-language computational depth |
| 3 | Desmos | 7.9 | Best direct-manipulation 2D graphing and accessibility; excellent modern 3D |
| 4 | Math Universe | 7.6 | Broadest teaching/concept layer, but uneven executable depth |

Math Universe's concept-learning score was estimated at 9.0/10, first among the four. The objective is to retain that lead while reaching these release gates:

| Product dimension | Current estimate | Leadership gate |
| --- | ---: | ---: |
| Concept learning | 9.0 | >= 9.5, with approved content and mastery evidence |
| 2D graphing | 7.5 | >= 9.5 |
| 3D graphing | 7.6 | >= 9.3 |
| Dynamic geometry | 8.0 | >= 9.5 |
| CAS | 7.7 | >= 9.2 for school/university core; transparent boundary for unsupported mathematics |
| Probability and statistics | 7.3 computational | >= 9.3, including general dataset workflows |
| Cross-module integration | fragmented transfer | one live mathematical document graph |
| Syllabus trust | catalog/tag based | official-source, versioned, evidence-backed certification |

These numbers are product acceptance targets, not marketing claims. They must be reproduced by a published benchmark suite.

---

## 1. The first missing capability: coverage truth

### Evidence found in the repository

- The audit inventory reports 220 school lessons: Class 6: 12, Class 7: 15, Class 8: 12, Class 9: 43, Class 10: 29, Class 11: 40, Class 12: 69.
- Every school brief file is marked `phase_1_brief_scaffold` and explicitly says it is not an approved lesson replacement.
- The phase-one backlog assigns the same generated concepts across NCERT, CBSE, AP SCERT, TN SCERT, and several international boards.
- The syllabus type system contains NCERT, CBSE, AP SCERT, and TN SCERT, but no Telangana SCERT or AP/TS Boards of Intermediate Education.
- Academic levels stop at generic `CLASS_11` and `CLASS_12`; there is no `INTER_1A`, `INTER_1B`, `INTER_2A`, or `INTER_2B` structure.
- The existing NCERT completion certificate deliberately claims a classroom-ready first pass for selected Grade 7, Class 10, and Class 12 routes—not full textbook-scale question-bank coverage. It describes Class 8, 9, and 11 support as representative and defers an exact Class 10 probability route.

### Required coverage states

Replace the single `DIRECT | SUPPORTING | ENRICHMENT` label with independently measured dimensions:

| Dimension | Meaning | Minimum evidence |
| --- | --- | --- |
| Catalogued | Concept can be found | Stable concept ID and searchable route |
| Explained | Correct instructional content exists | Approved definition, notation, conditions, examples, misconceptions, references |
| Visualized | Representation is mathematically meaningful | Interactive or animated model with declared limits |
| Computational | General inputs are evaluated | Reusable kernel, supported domain, correctness tests |
| Practised | Learner can solve varied tasks | Parameterized item families, hints, worked solutions |
| Assessed | Mastery can be measured | Diagnostic/formative/summative items and rubric |
| Textbook mapped | Official chapter/outcome is linked | Board, year, subject/paper, chapter, outcome, source page |
| Board certified | Required scope is complete | Automated coverage report plus SME approval and date |

No user-facing “covered” or “directly aligned” badge should appear until the required dimensions pass. A route can be honestly labelled “concept overview,” “interactive support,” or “full board coverage.”

### Required syllabus record

Each mapping should include at least:

```ts
type CurriculumMapping = {
  jurisdiction: "INDIA";
  board: string;
  curriculumYear: string;
  effectiveFrom: string;
  supersedes?: string;
  gradeOrCourse: string;
  subjectCode?: string;
  paper?: "IA" | "IB" | "IIA" | "IIB" | string;
  medium?: string;
  officialSourceUrl: string;
  sourceChecksum: string;
  sourcePageOrSection: string;
  unit: string;
  chapter: string;
  learningOutcome: string;
  canonicalConceptIds: string[];
  assessmentBlueprintIds: string[];
  evidence: {
    explanation?: string[];
    visualization?: string[];
    computation?: string[];
    practice?: string[];
    assessment?: string[];
  };
  status: "UNMAPPED" | "SUPPORTING" | "PARTIAL" | "COMPLETE" | "CERTIFIED";
  reviewedBy?: string[];
  reviewedAt?: string;
};
```

Automated validation must reject a `COMPLETE` or `CERTIFIED` record without an official source, page/section, evidence routes, tests, and reviewer.

---

## 2. Missing mathematical capabilities by module

### 2D graphing — P0/P1

Current strength: explicit, implicit, parametric, polar, piecewise, inequalities, tables, scatter, and basic regression are present.

Highest-value missing capabilities:

1. A typed expression language shared with CAS, not per-module string evaluation.
2. Arbitrary variables and sliders; lists, sequences, indexed objects, folders, actions, and animation timelines.
3. Automatic points of interest: roots, intercepts, intersections, extrema, holes, discontinuities, and asymptotes.
4. Full analysis: domain/range, monotonic intervals, concavity, derivative/integral overlays, tangent/normal, arc length, curvature, and numerical error estimates.
5. Robust inequalities and Boolean regions with open/closed boundaries and compound restrictions.
6. Adaptive sampling, interval-aware discontinuity detection, robust implicit contouring, and high-precision probing.
7. General regression expressions, residual plots, diagnostics, confidence/prediction bands, and parameter uncertainty.
8. Complex graphing, including domain coloring, real/imaginary/modulus/argument views, branch cuts, and loci.
9. Audio trace/sonification, keyboard exploration, semantic graph narration, and tactile/export alternatives.
10. Large linked tables, transformations, imports, and live spreadsheet relationships.

Acceptance gate:

- A public benchmark corpus of explicit, implicit, parametric, polar, discontinuous, complex, and region problems passes accuracy and interaction tests.
- Every graph-created object is usable live in CAS, geometry, tables, and lesson activities without copy/transfer duplication.
- Blind keyboard users can create, inspect, and understand a graph without a pointer.

### 3D graphing — P1/P2

Current strength: multiple scene objects, explicit height surfaces, solids, transformations, styling, projections, cross-sections, and teaching views.

Highest-value missing capabilities:

1. General parametric surfaces `r(u,v)`, not a torus preset.
2. General implicit surfaces `F(x,y,z)=0`, not a sphere preset.
3. Space curves `r(t)`, curve/surface and surface/surface intersections, tangents, normals, and Frenet frames.
4. Adaptive meshing and isosurface extraction with singularity, discontinuity, and topology handling.
5. Bounded regions and solids described by Boolean inequalities; clipping planes and multiple cross-sections.
6. Contours, level sets, projected 2D maps, coordinate readouts, and linked slices.
7. Vector and gradient fields, divergence, curl, flux, flow lines, tangent planes, curvature, and differential-geometry overlays.
8. Cartesian, cylindrical, spherical, and user-defined coordinate systems.
9. Exact/approximate volume, area, centroid, inertia, and intersection measurement with declared error bounds.
10. GPU-aware performance profiles, deterministic export, accessible narrated inspection, and nonvisual slice/table alternatives.

Acceptance gate:

- General textbook and university examples—not presets—can be entered directly.
- Geometry objects, equations, meshes, slices, and CAS results share identities and dependencies.
- Numerical results expose method, precision, convergence status, and failure reasons.

### Dynamic geometry — P0/P1

Current strength: broad construction palette, dependency recomputation, snapping, measurements, loci, protocol/history, and 2D/3D transfer.

Highest-value missing capabilities:

1. A general exact/numeric constraint solver rather than a fixed set of cases.
2. Live algebraic definitions for every object and bidirectional algebra/geometry edits.
3. Robust degeneracy predicates and complete line/circle/conic/curve intersection families.
4. Fully parameterized transforms, measurements, styles, and construction operations.
5. Exact loci, locus-equation inference, envelopes, and dependency-driven animation.
6. Construction protocol replay, branching, editable steps, proofs, and error diagnosis.
7. Custom tools/macros, reusable constructions, templates, and a versioned native document format.
8. Euclidean, coordinate, transformational, vector, analytic, and introductory non-Euclidean geometry modes.
9. Theorem-condition checking: necessary assumptions, counterexamples, and proof-step validation.
10. One object model spanning 2D geometry, 3D geometry, graph equations, and CAS symbols.

Acceptance gate:

- Standard school constructions, conic constructions, loci, transformations, and theorem investigations remain valid through dragging and degenerate cases.
- A construction can be replayed, parameterized as a macro, and embedded as an assessable lesson activity.

### CAS — P0/P2

Current strength: a substantial educational command inventory for algebra, equations, calculus, Taylor/Laplace/ODE, and matrices, plus structured explanation surfaces.

Highest-value missing capabilities:

1. Shared typed AST with canonical simplification rules and exact numeric types.
2. Explicit assumptions: real/complex domains, positivity, integer constraints, branches, units, and parameter conditions.
3. Result conditions and solution sets, including extraneous-solution checks and excluded domains.
4. Comprehensive step derivations with verifiable rule IDs—not narrative text generated independently of the computation.
5. Strong polynomial/rational algebra, systems, inequalities, trigonometric equations, recurrence relations, and piecewise/distributional expressions.
6. Multivariable/vector calculus, sequences/series convergence, transforms, ODE systems, eigen/Jordan/SVD workflows, and symbolic linear algebra.
7. Complex analysis foundations, special functions, exact combinatorics/number theory, and arbitrary precision.
8. Units and dimensional analysis for applied mathematics and science.
9. Numeric fallbacks with certified tolerance/convergence reporting and explicit unsupported-result states.
10. Reactive notebook cells where assumptions, definitions, graphs, geometry, and datasets form a dependency DAG.

Acceptance gate:

- Golden tests compare exact forms, equivalent forms, domains, branches, assumptions, and numeric verification—not only display strings.
- Unsupported or uncertain operations fail clearly; the product never fabricates algebraic steps.
- Every displayed step is replayable against a transformation rule.

### Probability and statistics — P0/P2

Current strength: broad conceptual coverage, 27 distributions, simulation laboratories, and strong syllabus-oriented explanation.

Highest-value missing capabilities:

1. A general data table connected to every analysis—not parameter-only studios.
2. Data import, cleaning, missing values, recoding, filtering, grouping, joins, calculated columns, and reproducible transformations.
3. Exploratory analysis: linked plots, distributions, outliers, quantiles, robust statistics, and multivariate views.
4. Complete regression: linear, polynomial, logistic, nonlinear, multiple regression, diagnostics, residuals, leverage, intervals, and validation.
5. Hypothesis testing and confidence intervals driven by arbitrary datasets with assumptions and effect sizes.
6. Probability models: events, conditional probability, Bayes, combinatorics, random variables, expectation, transformations, and joint/conditional distributions.
7. Simulation-first inference: sampling distributions, bootstrap, randomization/permutation tests, law of large numbers, and central limit theorem.
8. Experimental design, bias/confounding, causal-vs-associational reasoning, time series, and index numbers.
9. Exact distribution calculations plus stable numerical tails, inverse CDFs, fitting, goodness-of-fit, and Q-Q plots.
10. Reproducible analysis cards that can be moved between a lesson, spreadsheet, graph, report, and assessment.

Critical current mismatch to remove: the main CAS/spreadsheet studio disables several analysis families—including polynomial/exponential/logistic regression, hypothesis tests, confidence intervals, and distribution analysis. A concept page is not a substitute for a general data-driven engine.

Acceptance gate:

- A learner can paste a dataset, clean it, explore it, fit an appropriate model, check assumptions, quantify uncertainty, and produce a reproducible explanation.
- Statistical methods disclose prerequisites and refuse or warn on invalid usage.

---

## 3. CBSE and NCERT coverage gaps

### Current official baseline

CBSE's official 2026–27 curriculum page now lists Mathematics and Mathematics at Advanced Level in Class IX, and both Mathematics and Applied Mathematics for XI–XII. The Class IX mathematics document is redesigned around NEP 2020/NCF-SE 2023 and explicitly emphasizes reasoning, visualization, modelling, communication, computational thinking, data analytics, projects/investigations, applications, and Indian Knowledge Systems. The XI–XII Mathematics document retains major senior-secondary units including relations/functions, algebra, calculus, vectors/3D, linear programming, and probability. Applied Mathematics adds a distinct pathway with financial mathematics, statistics, probability, numerical applications, modelling, and project work.

### What is genuinely strong now

- Many Grade 7, Class 10, and Class 12 priority topics have dedicated visual or guided routes.
- The raw engines and concept catalog cover much of school algebra, geometry, trigonometry, calculus, vectors, matrices, probability, statistics, and mensuration.
- Existing internal audits document remaining chapter-specific improvements rather than pretending no gaps exist.

### What is missing or not yet certifiable

| Priority | Gap | Required product work |
| --- | --- | --- |
| P0 | No curriculum-year/version/source fields in the current mapping model | Ingest and freeze official 2026–27 documents with checksums and page-level mappings |
| P0 | 220 school briefs remain unapproved scaffolds | Replace generic briefs with SME-authored definitions, conditions, worked examples, misconceptions, activities, and assessments |
| P0 | Existing “direct” board tags are not evidence-backed chapter mappings | Downgrade unverified claims; rebuild from official outcomes and chapter sequences |
| P0 | New Class IX Mathematics at Advanced Level is absent as a distinct pathway | Create standard/advanced pathway model, prerequisites, assessment blueprint, and differentiated activities |
| P0 | CBSE Applied Mathematics XI–XII is absent as a distinct course | Add numerical applications, financial mathematics, descriptive/inferential statistics, index/time-based data, modelling, and project work |
| P1 | Class 6, 8, 9, and 11 depth is uneven; Class 8/9/11 were internally described as representative | Perform official textbook-by-textbook, outcome-by-outcome audit and build missing dedicated routes |
| P1 | Chapter exercises and competency-style item coverage are incomplete | Parameterized question families, exemplars, case studies, assertion/reason, proof, application, and project rubrics |
| P1 | Class 10 exact probability pathway was explicitly deferred in the earlier certificate | Create the exact board-linked route and seeded experimental/theoretical probability tasks |
| P1 | Projects, investigations, modelling, computational thinking, data analytics, and math communication are not systematically mapped | Add project workspaces, modelling cycles, datasets, notebooks, oral/written explanation rubrics, and portfolios |
| P1 | Indian Knowledge Systems/history/context are not systematically supported | Source-reviewed contextual modules; avoid decorative or unverified historical claims |
| P1 | Proof expectations are not tracked by theorem and assumption | Proof dependency graphs, theorem conditions, counterexamples, and rubric-scored proof steps |
| P2 | No complete textbook exercise matrix | Map examples/exercises to concept and skill IDs without copying copyrighted textbook content wholesale |
| P2 | No persistent learner mastery | Local-first profiles, spaced review, misconception model, diagnostic-to-remediation pathways, and exportable progress |
| P2 | No annual syllabus-diff workflow | Scheduled official-source review, semantic diff, migration report, and expiring certification badge |

### CBSE/NCERT certification definition

A class/course is certified only when:

1. Every official unit, chapter, outcome, required activity/project, and assessment pattern is mapped.
2. Every mapping has an approved explanation and at least one appropriate practice/assessment path.
3. High-value mathematical concepts have a genuine interactive or computational experience, not just text.
4. The official academic year, source, page, medium, and last review are visible.
5. Coverage is tested by an automated report and signed off by two mathematics SMEs, including one teacher familiar with that board level.

---

## 4. Andhra Pradesh and Telangana Intermediate gaps

### Structural gap

The product currently models only generic Class 11/Class 12. AP and Telangana Intermediate mathematics must be represented as board-specific papers and years. At minimum:

- First Year Mathematics IA
- First Year Mathematics IB
- Second Year Mathematics IIA
- Second Year Mathematics IIB
- Separate AP BIE and Telangana BIE mappings, even where topics overlap
- English/Telugu medium metadata
- Board paper blueprint, model papers, question type, marks, and expected method

Do not infer that AP and Telangana are identical. Ingest and certify each board separately from its own official documents.

### AP Intermediate content cross-check

Official AP materials establish the following paper structure. The app has many underlying concepts, but it does not yet have official-paper pathways, complete chapter coverage evidence, or board-style assessment coverage.

| Paper | Official topic families checked | Current app assessment | Required additions |
| --- | --- | --- | --- |
| IA | Functions; mathematical induction; matrices/determinants and systems; vector addition/products and planes; trigonometric transformations/equations; inverse trig; hyperbolic functions; properties of triangles | Functions, matrices, vectors, and trig have general support. Mathematical induction, hyperbolic functions, full triangle identities, and the exact paper sequence are not certified. | Dedicated induction/proof engine activities; hyperbolic and inverse-hyperbolic graphs/identities; triangle formula derivations; AP exercise and exam families; official chapter mappings |
| IB | Locus; transformation of axes; straight lines; pairs of straight lines; 3D coordinates/direction cosines/planes; limits/continuity; differentiation; applications of derivatives | General geometry, graphing, 3D, and calculus support exists. Transformation of axes and pair-of-lines need dedicated depth; paper-specific workflows are absent. | General axis transformation lab; quadratic-form/pair-of-lines analyzer; exact 3D coordinate tasks; tangent/normal, errors/approximations, rates and curve-angle problem families |
| IIA | Complex numbers and De Moivre; quadratic/theory of equations; permutations/combinations; binomial theorem; partial fractions; dispersion; probability; random variables/distributions | Many concepts exist across CAS and P&S, but no paper certification or unified exercise progression. | Complex-plane/De Moivre engine; root/coefficient and transformed-equation tools; exact combinatorics; dataset-based dispersion; general random-variable/distribution engine; AP exam blueprint |
| IIB | Circle; system of circles; parabola, ellipse, hyperbola; integration; definite integration and area; differential equations | Conic, integration, and ODE concepts exist. System-of-circles, polar/chord/tangent cases, reduction formulae, and board methods are not established as complete. | Exact conic algebra/geometry linkage; radical axis/system-of-circles studio; method-selecting integral stepper; definite-integral properties/area; AP ODE families and marking-scheme steps |

### Telangana Intermediate

The current app has no Telangana board identifier or Intermediate paper structure, so Telangana Intermediate coverage is presently **uncertified**, regardless of overlapping Class 11/12 concepts.

Required work:

1. Ingest current Telangana BIE IA/IB/IIA/IIB syllabus and prescribed textbook editions from official sources.
2. Compare chapter order, inclusions/deletions, terminology, exercise emphasis, and examination blueprint against AP.
3. Reuse canonical concepts and engines, but create distinct mappings, presets, question families, and certification reports.
4. Support Telugu/English terminology pairs and notation/search aliases.
5. Add official model-paper indexing and board-style timed practice without reproducing protected material beyond allowed use.

### Intermediate acceptance gate

- A dashboard reports coverage by paper, chapter, subtopic, question type, marks, engine, lesson, practice family, and assessment.
- At least three independent reviewers validate each paper: content SME, active/recent Intermediate teacher, and QA reviewer.
- Model-paper dry runs demonstrate coverage of every method and question type.
- AP and Telangana badges are independent and year-labelled.

---

## 5. State-syllabus mathematics gaps

### Current reality

The current type system explicitly names AP SCERT and TN SCERT but omits Telangana SCERT and the many other state boards. More importantly, the generated catalog's same generic concept-to-all-boards pattern is not a reliable official alignment. State-board support should be described as an expansion framework until verified mappings exist.

### State expansion order

| Wave | Boards | Reason |
| --- | --- | --- |
| 1 | AP SCERT, Telangana SCERT, TN SCERT | Existing AP/TN tags plus likely target geography; correct the current claims first |
| 2 | Karnataka, Kerala, Maharashtra | Large learner populations, distinct language/board needs, high reuse of canonical engines |
| 3 | Gujarat, Rajasthan, West Bengal, Odisha, Punjab, Haryana | Extend verified ingestion and localization pipeline |
| 4 | Remaining states/UTs | Add according to demand, partnerships, and availability of authoritative digital sources |

This order is a delivery priority, not a claim that later boards matter less.

### Required state-board capabilities

- Board and governing-body identity, academic year, grade, term/semester, subject code, medium, textbook edition, and official source.
- Board-specific chapter order and learning outcomes mapped to canonical math concepts.
- Regional-language terminology, bilingual search, speech, fonts, notation aliases, and teacher-reviewed translations.
- State-specific examples, contexts, constructions, algorithms, and assessment patterns.
- Official exemplar/model-paper mapping and question-style generation.
- A difference viewer showing how the same canonical concept is taught and assessed by each board.
- Version migration when textbooks or rationalized syllabi change.
- Audit trail: parser output, human corrections, reviewer decisions, and certification expiry.

### What not to do

- Do not tag a lesson as directly aligned merely because its title resembles a syllabus topic.
- Do not use one generic unit/chapter label for several boards.
- Do not equate NCERT textbook coverage with CBSE curriculum coverage or with a state-board course.
- Do not claim “all state boards” until each named board has a current official-source report.

---

## 6. Product architecture required to support the plan

### A. Universal mathematical document graph

Create a shared document containing typed nodes and dependencies:

```text
Expression / definition
        ↓
Exact or numeric value ── dataset / table
        ↓                      ↓
2D graph ↔ geometry object ↔ statistical model
        ↓                      ↓
3D object / field       assessment evidence
        ↓                      ↓
Explanation / proof / report / lesson activity
```

Core node types should include scalar, complex, vector, matrix, set, relation, function, equation, inequality/region, sequence, distribution, dataset, statistical model, geometric object, curve, surface, field, proof step, unit quantity, and assessment result.

Every node needs:

- Stable ID and version
- Exact and approximate representations
- Domain, assumptions, units, and precision
- Dependency list and invalidation rules
- Provenance and transformation history
- Display, accessibility, serialization, and export forms
- Verification status and warnings

### B. Kernel separation

Separate UI from independently testable engines:

- Parser/type checker and expression runtime
- Exact arithmetic and symbolic algebra
- Numeric solvers and arbitrary precision
- 2D sampling/analysis
- 3D meshing/analysis
- Geometry predicates/constraints
- Probability distributions and simulation
- Statistics/dataframe and model fitting
- Units/dimensional analysis
- Step/proof verification

### C. Capability registry

For each mathematical operation, record:

- Supported input types and domains
- Exact vs numeric behavior
- Known limits
- Test corpus and accuracy tolerance
- UI surfaces that consume it
- Lessons and syllabus outcomes that depend on it
- Accessibility support
- Version and owner

This registry generates user help, developer tests, competitor benchmarks, and syllabus evidence from the same truth source.

### D. Authoring and assessment platform

Build a schema-driven authoring system so an SME can compose:

- Explanation blocks, definitions, conditions, examples, non-examples, and misconceptions
- Live graph/geometry/CAS/data activities backed by document nodes
- Parameterized practice generators with constraints and solution strategies
- Hints that reference valid intermediate states
- Proof/construction step checking
- Rubrics for projects, modelling, communication, and investigations
- Diagnostics and prerequisite remediation
- Versioned translations and review workflow

---

## 7. Delivery roadmap

Timing below is an indicative sequence for a dedicated cross-functional team, not a fixed calendar commitment. Do not start mass content production before Phase 0's schemas and review workflow are stable.

### Phase 0 — Truth, stability, and benchmark baseline (0–6 weeks)

Deliverables:

1. Freeze current capability and syllabus claims into a generated baseline report.
2. Add the multidimensional coverage model and official-source curriculum schema.
3. Downgrade unsupported “direct” board labels to `UNVERIFIED` or `SUPPORTING`.
4. Add CBSE 2026–27, AP BIE, Telangana BIE, AP SCERT, Telangana SCERT, and TN SCERT identifiers and paper/course structures.
5. Establish competitor benchmark cases for all five core modules.
6. Establish correctness oracles and golden tests; document when an external oracle is used.
7. Fix the current lint/build/test baseline before architectural work; enforce no-new-failures CI.
8. Publish a product scorecard separating concept breadth, computational depth, interaction, assessment, accessibility, and syllabus certification.

Exit criteria:

- Claims in the UI can be traced to machine-readable evidence.
- CI can generate capability and syllabus gap reports.
- Current source builds and core test suites pass reliably in a clean isolated directory.

### Phase 1 — Universal AST, values, dependencies, and document format (weeks 4–16)

Deliverables:

1. Typed parser and canonical AST.
2. Exact integer/rational/surd/complex plus arbitrary-precision numeric values.
3. Assumption/domain/unit model.
4. Reactive dependency DAG and transaction/undo history.
5. Stable native document schema with migrations.
6. Adapter layer allowing existing pages to use new nodes without a full rewrite.
7. Shared serialization, clipboard, import/export, and accessibility descriptions.

Exit criteria:

- One expression can drive a graph, CAS result, geometry object, table, and 3D view live.
- Circular dependencies, invalid domains, and unsupported operations produce deterministic diagnostics.

### Phase 2 — 2D and geometry leadership (months 3–7)

Deliverables:

1. Arbitrary sliders, lists, sequences, restrictions, folders, actions, and animation.
2. Adaptive graphing and automatic points-of-interest/analysis objects.
3. Complex graph mode and full regression expressions.
4. General geometry constraints, exact intersections, algebra view, and degeneracy handling.
5. Parameterized transforms, exact loci, construction replay, and custom tools/macros.
6. Audio trace, keyboard graphing/geometry, semantic narration, and accessible data alternatives.

Exit criteria:

- Math Universe meets or exceeds the agreed Desmos benchmark for 2D workflows and the school-level GeoGebra benchmark for dynamic geometry.
- Existing lesson routes migrate without losing behavior.

### Phase 3 — CBSE/NCERT 2026–27 and Intermediate foundation (months 3–9, parallel with Phase 2)

Deliverables:

1. Official outcome maps for CBSE/NCERT Classes 6–12.
2. Separate Class IX Mathematics and Mathematics Advanced pathways.
3. Separate XI–XII Mathematics and Applied Mathematics pathways.
4. AP BIE and Telangana BIE IA/IB/IIA/IIB structures and source maps.
5. Replace all 220 school scaffolds with reviewed content, beginning with concepts required by the above pathways.
6. Dedicated missing studios: mathematical induction, hyperbolic functions, transformation of axes, pair of straight lines, system of circles, advanced conics, complex/De Moivre, theory of equations, board-style integral/ODE methods, and dataset inference.
7. Parameterized practice and board-style assessment blueprints.

Exit criteria:

- No scaffold is presented as a completed school lesson.
- CBSE/NCERT and AP/TS dashboards show evidence by official outcome and paper.
- At least one complete course is independently reviewed end to end before scaling the workflow.

### Phase 4 — CAS and probability/statistics depth (months 6–12)

Deliverables:

1. Assumption-aware symbolic workflows and verifiable steps.
2. Broader algebra, equation, calculus, sequence/series, ODE, matrix, complex, and transform coverage.
3. General dataframe/data-cleaning system.
4. General regression, confidence intervals, hypothesis tests, model diagnostics, and simulation inference.
5. Reproducible analysis notebooks/cards and lesson embedding.
6. Certified numeric fallback behavior and performance benchmarks.

Exit criteria:

- School and undergraduate-core benchmark suites meet target accuracy, domain, and step-verification thresholds.
- P&S studios operate on arbitrary learner datasets, not only presets.

### Phase 5 — General 3D engine and multivariable mathematics (months 8–14)

Deliverables:

1. General parametric and implicit surfaces, space curves, regions, and adaptive meshing.
2. Exact/numeric intersections and multi-plane slices.
3. Contours, coordinate systems, vector fields, calculus/differential geometry, and measured quantities.
4. Shared 2D/3D geometry identities and CAS-derived objects.
5. Accessibility and deterministic export/reporting.

Exit criteria:

- The 3D benchmark includes arbitrary user-entered examples and failure cases, not preset demos.
- Results expose precision and computation method.

### Phase 6 — State-board expansion and localization (months 10–18+)

Deliverables:

1. Certify AP, Telangana, and Tamil Nadu school mathematics first.
2. Roll out the same ingestion/review pipeline to Wave 2 and Wave 3 boards.
3. Bilingual terminology/search and teacher-reviewed translations.
4. Board comparison/difference view and annual update workflow.
5. State-specific exam and project modes.

Exit criteria:

- A board appears in product marketing only after certification.
- Annual updates can be ingested, diffed, reviewed, and published without hand-editing core lesson code.

### Phase 7 — Authoring ecosystem and durable leadership (months 12–20+)

Deliverables:

1. Teacher/SME authoring studio, reusable components, templates, and custom tools.
2. Local-first learner profiles, mastery, spaced review, classroom packs, and portable exports.
3. Shareable deterministic documents with privacy controls and optional collaboration.
4. Extension/plugin API around typed math nodes—not arbitrary unsafe script execution.
5. Public capability benchmark and transparent release notes.

Exit criteria:

- New syllabus concepts can be authored and certified without creating bespoke page components.
- Third-party content cannot claim capabilities or alignment without passing schema, test, and review gates.

---

## 8. Prioritized build backlog

### P0 — must start now

- Coverage truth schema, certification rules, and UI labels
- CBSE 2026–27 and AP/TS curriculum ingestion
- Telangana SCERT/BIE and Intermediate academic types
- Clean lint/build/test baseline
- Universal AST/dependency architecture decision record and spike
- Convert generic school briefs from “coverage” to explicit draft state
- General dataset support in P&S and enable currently disabled core analyses
- Correctness/competitor benchmark repository

### P1 — leadership foundation

- 2D points of interest, analysis, arbitrary sliders/lists/actions, adaptive sampling
- Geometry constraints, algebra linkage, exact intersections, macros
- CAS assumptions/domains and verifiable steps
- General parametric/implicit 3D prototypes
- CBSE Mathematics Advanced and Applied Mathematics pathways
- AP/TS Intermediate dedicated missing-topic studios and exam blueprints
- Accessibility parity: keyboard, screen-reader semantics, audio trace, narrated constructions

### P2 — depth and certification

- Complex graphing and complex CAS/De Moivre depth
- Statistical inference and general regression/model diagnostics
- Vector fields, multivariable calculus, contours, coordinate systems
- Full exercise-skill matrices and parameterized item families
- Certified AP/TS/TN school pathways
- Teacher authoring and content review workflow

### P3 — expansion

- More state boards and regional languages
- Undergraduate core extensions and advanced CAS domains
- Collaboration/community ecosystem
- Research-grade numerical modules where correctness and maintenance can be sustained

---

## 9. Team and ownership model

Minimum durable workstreams:

| Workstream | Core ownership |
| --- | --- |
| Math kernel | AST, types, exact/numeric computation, assumptions, dependencies |
| Visualization | 2D/3D rendering, interaction, sampling/meshing, accessibility |
| Geometry | Predicates, constraints, constructions, loci, proof conditions |
| Data/P&S | Tables, distributions, simulation, inference, statistical models |
| Curriculum | Official-source ingestion, mappings, annual diffs, certification |
| Learning/assessment | Pedagogy, practice generation, mastery, rubrics, authoring |
| QA/reliability | Golden tests, property tests, differential tests, performance, device/browser QA |
| Accessibility/localization | WCAG workflows, sonification, keyboard use, terminology and translations |

Every engine capability and syllabus pathway needs a named technical owner and an SME reviewer. Avoid counting lesson/page volume as a success metric for these teams.

---

## 10. Verification strategy

### Mathematical correctness

- Golden exact-answer cases, equivalent-expression normalization, branch/domain cases, and counterexamples.
- Property-based tests for algebraic identities, transformations, distributions, and geometry invariants.
- Differential tests against at least two mature engines where licensing and automation allow.
- Independent high-precision numeric checks with declared tolerances.
- Adversarial tests: discontinuities, degenerate geometry, ill-conditioned matrices, extreme distribution tails, singular surfaces, and invalid assumptions.

### Learning quality

- SME review checklist for definition, notation, prerequisites, restrictions, examples, non-examples, misconceptions, and explanation accuracy.
- Classroom usability studies by grade and board.
- Item calibration and misconception diagnostics.
- Project/rubric moderation and teacher feedback.

### Syllabus accuracy

- Official-source-only ingestion for certification.
- Page-level mapping, document checksum, academic year, and review history.
- Automated detection of orphaned outcomes, duplicate claims, and unsupported `COMPLETE` statuses.
- Annual semantic diff and certification expiry.

### Product quality

- Unit, integration, visual regression, browser, accessibility, performance, migration, and corrupted-document recovery tests.
- Device matrix including low-memory/low-GPU systems.
- Deterministic seeded simulations and reproducible exports.

---

## 11. Scorecard and go/no-go gates

Track these metrics each release:

| Metric | Leadership target |
| --- | ---: |
| Core benchmark mathematical correctness | >= 99.9% on supported cases; 100% clear failure on unsupported cases |
| Cross-module live-object coverage | >= 95% of priority node types |
| Priority syllabus outcomes with approved explanation | 100% for a certified course |
| Outcomes with practice and assessment | 100% of required outcomes |
| Outcomes with meaningful interactive/computational support | >= 90%, with documented exceptions |
| Unverified board “direct” claims | 0 |
| Scaffold content exposed as complete | 0 |
| Keyboard-only completion of core workflows | 100% |
| Critical accessibility violations | 0 |
| Clean build/lint/core tests | 100% required for release |
| Syllabus certification age | <= 12 months or current academic-year review |

No “world's best” claim should ship until independent reviewers reproduce the benchmark, verify the five core modules, and confirm the named syllabus pathways.

---

## 12. First 30 implementation tickets

1. Add `curriculumYear`, `officialSource`, `sourcePage`, `reviewStatus`, and evidence arrays to syllabus mappings.
2. Add `TELANGANA_SCERT`, `AP_BIE`, and `TELANGANA_BIE` board identifiers.
3. Add Intermediate IA/IB/IIA/IIB course/paper types separate from generic classes.
4. Write a migration that marks current generated board mappings `UNVERIFIED`.
5. Generate a current coverage dashboard from mappings and route evidence.
6. Ingest CBSE 2026–27 Class IX Mathematics source.
7. Ingest CBSE 2026–27 Class IX Mathematics Advanced source.
8. Ingest CBSE 2026–27 XI–XII Mathematics source.
9. Ingest CBSE 2026–27 XI–XII Applied Mathematics source.
10. Ingest AP Intermediate IA/IB/IIA/IIB official sources.
11. Ingest Telangana Intermediate IA/IB/IIA/IIB official sources.
12. Define reviewer workflow and certification expiry.
13. Add CI rule rejecting unsupported `COMPLETE`/`CERTIFIED` mappings.
14. Fix current lint failures and isolate flaky/build-directory cleanup failures.
15. Approve a universal AST and math-value design.
16. Implement arbitrary symbol definitions and dependencies.
17. Replace the 2D graph's fixed shared-parameter limitation with arbitrary sliders.
18. Implement automatic roots/intersections/extrema objects.
19. Implement adaptive discontinuity-aware 2D sampling.
20. Add general dataset table and connect existing P&S analyses.
21. Enable and test polynomial/exponential/logistic regression from arbitrary data.
22. Enable and test confidence intervals and hypothesis tests from arbitrary data.
23. Prototype exact predicates/general constraint solving in geometry.
24. Prototype general `r(u,v)` parametric surfaces.
25. Prototype general `F(x,y,z)=0` isosurfaces.
26. Build a dedicated AP/TS mathematical-induction lesson/activity family.
27. Build transformation-of-axes and pair-of-straight-lines studios.
28. Build complex/De Moivre and system-of-circles studios.
29. Convert the first full board course from scaffold to reviewed lessons and assessments.
30. Run an external teacher/SME audit and publish the resulting gap delta.

---

## Official sources used for this syllabus cross-check

- [CBSE curriculum for academic year 2026–27](https://cbseacademic.nic.in/curriculum_2027.html)
- [CBSE Class IX Mathematics 2026–27](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf)
- [CBSE XI–XII Mathematics 2026–27](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf)
- [CBSE XI–XII Applied Mathematics 2026–27](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Applied_Mathematics_SecP2_2026-27.pdf)
- [NCERT textbook portal](https://ncert.nic.in/textbook.php)
- [Andhra Pradesh school textbook portal](https://cse.ap.gov.in/loadacademictextbookpublicview)
- [Telangana SCERT syllabus portal](https://scert.telangana.gov.in/Syllabus.aspx)
- [Telangana SCERT e-books portal](https://www.scert.telangana.gov.in/)
- [AP Board of Intermediate Education model-paper portal](https://bie.ap.gov.in/modelpapers)
- [AP Intermediate Mathematics IA textbook](https://bieap.apcfss.in/Uploads/Materials/Maths-_IA.pdf)
- [AP Intermediate Mathematics IB workbook](https://bieap.apcfss.in/Uploads/Materials/FIRST_YEAR_MATHS-IB_WORK_BOOK.pdf)
- [AP Intermediate Mathematics IIA textbook](https://bieap.apcfss.in/Uploads/Materials/Maths-_IIA.pdf)
- [AP Intermediate Mathematics IIB textbook](https://bieap.apcfss.in/Uploads/Materials/Maths_-IIB.pdf)
- [Telangana Board of Intermediate Education portal](https://satgbie.cgg.gov.in/home.do)

## Final product principle

Math Universe can become the best mathematics app by combining three qualities no current leader fully combines: GeoGebra's unified objects, Desmos's interaction/accessibility, and Wolfram's computational depth—inside Math Universe's stronger concept-learning layer. The defensible advantage will not be the number of routes. It will be the number of mathematical ideas that a learner can correctly understand, manipulate, compute, prove, apply, and master in one coherent document.
