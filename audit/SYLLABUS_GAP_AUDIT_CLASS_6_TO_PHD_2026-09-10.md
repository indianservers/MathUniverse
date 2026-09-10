# Syllabus Gap Audit: Class 6 to PhD

Date: 10 September 2026  
Scope: Existing Math Universe source and curriculum registries compared with CBSE/NCERT 2026–27, Andhra Pradesh SCERT textbooks, representative Indian state-board sources, UGC/AICTE higher-education models, and current university mathematics programmes.

## Executive verdict

Math Universe has exceptional **mathematical tool breadth**, but it does **not yet have syllabus-complete coverage from Class 6 to PhD**.

The main distinction is:

- **Topic/tool present:** a concept, lesson card, generic visual, calculator, or lab exists.
- **Syllabus covered:** the current official board/university outcome is versioned, page-mapped, taught, practised, assessed, and reviewed.

By the second definition, no complete Class 6–PhD continuum exists. The strongest area is CBSE/NCERT Classes 7–12 concept support, especially Class 10 and selected Class 12 routes. The weakest areas are AP SCERT, state-board-specific sequencing and assessment, Class 6 entry, undergraduate/graduate course structure, and research-level mathematics.

## What the app currently contains

### Visible syllabus catalog

- Main syllabus roadmap: Class 7, 8, 9, 10, 11, 12, Degree, Engineering Mathematics.
- Main roadmap has **142 topic records**:
  - Class 7: 13 (11 available, 2 mapped)
  - Class 8: 13 (8 available, 5 mapped)
  - Class 9: 12 (9 available, 3 mapped)
  - Class 10: 14 (14 available)
  - Class 11: 14 (7 available, 3 mapped, 4 future)
  - Class 12: 13 (8 available, 2 mapped, 3 future)
  - Degree: 20 (6 available, 4 mapped, 10 future)
  - Engineering: 43 (43 marked available)
- Separate board catalog: 28 broad records for CBSE, Cambridge, IB, and an “International Core”, Grades/Classes 6–12.
- Lesson inventory: 919 records (674 core, 220 school, 25 advanced). The inventory is breadth evidence, not official syllabus certification.

### Evidence-backed curriculum layer

- Five official source records exist, all CBSE 2026–27.
- Only part of CBSE Class IX is normalized to unit/outcome records.
- NCERT Classes 6–8 pathways are explicitly unmapped.
- CBSE X, XI, XII, Applied Mathematics XI–XII, AP Intermediate, and Telangana Intermediate pathways exist mostly as empty structures awaiting mapping/review.
- The app itself reports 0 approved and 0 certified curriculum records.

## Highest-priority misses

### P0 — Curriculum integrity and navigation

1. **Class 6 is absent from the main syllabus roadmap.** It appears only in a separate broad board catalog and a special visual page.
2. **AP SCERT is absent from the selectable board catalog.** The catalog supports only International Core, CBSE, Cambridge IGCSE, and IB.
3. **No AP SCERT Class 6–10 chapter/outcome mapping exists.** AP Intermediate placeholders do not cover AP SCERT school mathematics.
4. **The curriculum registries disagree.** One type system knows AP SCERT/TN SCERT/Telangana SCERT; the active learning-system type and course explorer do not.
5. **Board visual pages are generic strand visualizations.** A generic concept map or mini-chart is reused across many board topics; this is not chapter-specific coverage.
6. **The alternate Class 6 visual route is hard-coded to seven International Core units**, regardless of incoming slug, so it is unsuitable as a general board-specific route.
7. **Current-year assessment scope is not represented.** CBSE’s summative/formative distinction, marks/weighting, projects, investigations, modelling, computational thinking, communication, data analytics, and Indian Knowledge Systems are not mapped end-to-end.
8. **No syllabus diff/migration workflow** exists for annual textbook or assessment changes.
9. **Medium/edition support is incomplete.** AP needs English, Telugu, Urdu, and minority-medium textbook variants with edition/semester metadata.
10. **“Available” is over-broad.** It often means a related route exists, not that explanation, practice, assessment, source mapping, and review all pass.

### P0 — Andhra Pradesh SCERT

Create distinct AP SCERT pathways for Classes 6–10, split by current textbook edition, semester/part, and medium. The first audit must ingest the official AP School Education textbook files and map every chapter, worked-example family, activity, exercise outcome, and assessment pattern.

Content most likely to be missed when treating AP as NCERT-equivalent includes:

- Class 6 ratio, proportion and unitary method; introductory algebra; practical constructions; AP textbook sequencing and semester split.
- State-specific geometry construction sequences, frequency tables/graphs, plane-figure area work, visualising 3D in 2D, and proof activities.
- Class 9/10 construction, areas, probability, proof-in-mathematics, and semester-specific examination grouping.
- Telugu mathematical terminology, bilingual notation/search aliases, and worked contexts used by AP textbooks.
- AP board question formats, blueprints, model papers, competency questions, and chapter weightings.

Do not infer AP coverage from a matching NCERT chapter name. Store shared canonical concepts, but keep the AP source mapping and assessment evidence separate.

### P0 — CBSE/NCERT 2026–27

1. Complete source ingestion for Classes VI–XII; the current app explicitly records NCERT as partial discovery only.
2. Add a proper Class 6 route and full textbook/outcome matrix.
3. Normalize all Class IX standard units, the new **Mathematics at Advanced Level** course, and its distinct learning/assessment pathway.
4. Complete Class X official outcome and assessment mapping; add the still-deferred exact Class 10 probability route.
5. Add XI–XII summative versus formative-only topic status; do not present both as equivalent exam coverage.
6. Finish **Applied Mathematics XI–XII** as a separate course: numerical applications, financial mathematics, data handling, descriptive/inferential statistics, probability, time series/index numbers, modelling, and project work.
7. Map competency-based tasks, investigations, projects, reasoning, proof, communication, modelling, data analytics, computational thinking, and IKS—not only chapter titles.
8. Build exercise-family coverage without copying textbook content: examples, proof tasks, case studies, assertion/reason, multi-step applications, rubrics, and mastery thresholds.

### P1 — Representative state-board expansion

The app has no real state-board matrix beyond type placeholders. Add independent, versioned pathways for at least:

- Telangana SCERT and Telangana Intermediate
- Tamil Nadu State Board / SCERT
- Karnataka State Board
- Kerala SCERT
- Maharashtra Balbharati
- Odisha, West Bengal, Gujarat, Rajasthan, Uttar Pradesh, Madhya Pradesh, Bihar, Punjab/Haryana, Assam and remaining states/UTs in later waves

State-board work must capture differences in chapter order, depth, terminology, medium, practical activities, internal assessment, board-paper patterns, and current edition. A single “International Core” record cannot substitute for these pathways.

Representative content families that need explicit cross-board checking include commercial mathematics, GST/tax and banking, sets/logic introduced at different grades, constructions, transformations, coordinate geometry sequencing, statistics graphs, proof expectations, mathematical modelling, and vocational/applied mathematics.

### P1 — Undergraduate mathematics

The single 20-topic “Degree” level is too shallow. Split it into semester/credit-based BSc/BS/BA pathways and include at least:

- Rigorous proof and mathematical writing
- Logic and foundations at university depth
- Groups, rings, fields, modules, Galois theory
- Point-set topology and metric spaces
- Measure theory and Lebesgue integration
- Functional analysis and operator theory
- Differential geometry and manifolds
- Algebraic topology
- Commutative algebra and algebraic geometry
- Analytic/advanced number theory
- Advanced combinatorics and graph theory
- Dynamical systems and ergodic ideas
- Advanced probability, stochastic processes, stochastic calculus
- Mathematical physics, mechanics and fluid dynamics
- Finite element/finite volume methods and scientific computing
- Optimization beyond introductory linear programming
- Coding theory, cryptography, automata/formal languages where the programme includes them
- Mathematical computing in Python/R/MATLAB/Mathematica, reproducible notebooks, projects, seminars and thesis

The current “Degree” list names a few broad umbrellas but does not provide definitions, theorem chains, proof practice, course prerequisites, credits, assessment, labs, or university-specific mappings.

### P1 — MSc / postgraduate mathematics

There is no separate MSc level. Add core/elective structures such as:

- Measure and integration; analysis of several variables
- Advanced real/complex/functional analysis
- Abstract algebra sequences, module theory, commutative/non-commutative algebra
- General topology, differential topology and algebraic topology
- PDE/ODE theory, numerical ODE/PDE, finite element methods
- Differential geometry
- Probability theory, stochastic processes and advanced statistics
- Dynamical systems, chaos and topological dynamics
- Fluid dynamics and computational fluid dynamics
- Advanced optimization and nonsmooth optimization
- Seminars, reading courses, workshops, dissertation and oral defence

### P1 — PhD/research readiness

There is no universal “PhD syllabus”; programmes require institution-specific coursework plus research. The app should therefore offer a **research pathway model**, not one fixed PhD chapter list.

Missing research-level capabilities:

- Institution/programme-specific coursework and qualifying requirements
- Reading courses and faculty/research-area pathways
- Advanced electives tied to prerequisites
- Literature search and bibliography workflows
- LaTeX theorem/proof authoring, citations and versioned notebooks
- Conjecture/counterexample workspaces and computer-assisted proof interfaces
- Reproducible computation, datasets, code, provenance and error bounds
- Seminar presentation, research proposal, ethics, plagiarism/citation practice
- Thesis milestones, progress reviews, pre-submission seminar and viva preparation
- Research domains beyond the present catalog: algebraic geometry, topology, representation theory, operator algebras, harmonic analysis, advanced PDE, inverse problems, stochastic analysis, mathematical biology, mathematical finance, coding/information theory, and others selected by institution

## Product-depth gaps across all levels

Even where a topic is listed, these layers are commonly missing:

1. Official learning outcome and source page.
2. Prerequisite graph and vertical progression across grades.
3. Approved definition, notation, restrictions, theorem statements, and misconceptions.
4. Worked examples covering easy, standard, non-routine, proof, application, and counterexample cases.
5. Parameterized practice families and hints.
6. Diagnostic, formative, summative, project, and oral assessment blueprints.
7. Marking schemes/rubrics and mastery criteria.
8. Teacher lesson plans, worksheets, differentiation and accessibility alternatives.
9. Board/year/medium/edition labels visible to users.
10. Named reviewer approval and expiry/review date.

## Recommended target information architecture

Use one hierarchy:

`Jurisdiction → Board/University → Academic year/version → Medium → Programme/Class → Subject/Paper → Semester/Part → Unit → Chapter → Outcome → Concept → Learning/Practice/Assessment evidence`

Recommended top-level lanes:

1. School: Classes 6–8
2. Secondary: Classes 9–10
3. Senior secondary / Intermediate: Classes 11–12 and IA/IB/IIA/IIB
4. Undergraduate: BSc/BS/BA by semester
5. Engineering mathematics: discipline and semester
6. Postgraduate: MSc/MA by core/elective structure
7. Research: Integrated PhD/PhD coursework and research-area pathways

## Delivery order

1. Fix truth/navigation: add Class 6, AP SCERT, and consistent board IDs; remove or relabel unverified “available/coverage” claims.
2. Ingest AP SCERT Classes 6–10 official books, editions, semesters, media and model-paper/blueprint evidence.
3. Finish CBSE/NCERT 2026–27 standard, Advanced IX, Mathematics XI–XII, and Applied Mathematics XI–XII mappings.
4. Complete practice/assessment/reviewer evidence for Classes 6–12.
5. Add Telangana, Tamil Nadu, Karnataka, Kerala and Maharashtra as the first state-board wave.
6. Split Degree into UG and MSc structures; retain Engineering as a distinct professional pathway.
7. Add research/PhD programme modelling and advanced domains.
8. Introduce annual source diffing, certification expiry, and a public coverage dashboard.

## Acceptance rule

A syllabus unit may be called **covered** only when it has:

- checksum/versioned official source and page/section;
- current board/programme/medium/edition metadata;
- concept and prerequisite mappings;
- approved explanation and appropriate visualization/computation;
- sufficient practice and assessment evidence;
- automated validation; and
- named subject-matter review with a review date.

Everything else should be labelled **catalogued**, **supporting**, **partial**, or **unverified**.

## Sources checked

- CBSE 2026–27 curriculum index: https://cbseacademic.nic.in/curriculum_2027.html
- CBSE Class IX Mathematics 2026–27: https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf
- CBSE XI–XII Mathematics 2026–27: https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf
- NCERT textbooks I–XII: https://ncert.nic.in/textbook.php
- NCERT mathematics learning outcomes, Class VI example: https://ncert.nic.in/pdf/publication/otherpublications/tilops101.pdf
- AP School Education official textbook portal: https://cse.ap.gov.in/loadacademictextbookpublicview
- AP textbook download listings: https://cse.ap.gov.in/textBooksDownloadingPageTEBilingual
- Telangana SCERT e-books: https://www.scert.telangana.gov.in/Home.aspx/pdf/publication/ebooks/Pdf/DisplayContent.aspx?encry=ammkNW4%2Fgx+NeApstGPX+A%3D%3D
- Tamil Nadu Textbook and Educational Services Corporation: https://www.textbookcorp.in/
- Kerala SCERT Standard 6 and Standard 10 textbook pages: https://scert.kerala.gov.in/standard-6/ and https://scert.kerala.gov.in/standard-10/
- Maharashtra e-Balbharati Standard VI Mathematics: https://books.ebalbharati.in/pdfs/603020004.pdf
- UGC Model Curriculum page (Mathematics): https://www.ugc.gov.in/facultycorner/Model_Curriculum
- AICTE undergraduate model curriculum example: https://aicte-qa.aicte-india.org/sites/default/files/ug-vol2.pdf
- IIT Madras BS Mathematics curriculum: https://math.iitm.ac.in/program-bsms.php
- University of Delhi MSc Mathematics 2026–27: https://maths.du.ac.in/one-m-sc-programme/
- IISc Mathematics PhD programme: https://math.iisc.ac.in/degprog-phd.html

## Limitations

- “Various state” was sampled across official sources; it was not a page-by-page audit of every Indian state/UT and every medium.
- AP official portals expose multiple editions and interfaces. Exact current-year chapter matrices must be frozen only after downloading the selected academic-year files and recording checksums.
- University and PhD curricula are institution-specific. The higher-education comparison uses UGC/AICTE models and representative current university programmes, not a claim of one national syllabus.
- This was a source/code audit, not browser QA of every route.
