# AP Class 8 to JNTUK M.Tech lesson audit

Date: 2026-10-12  
Target: AP school mathematics → AP Intermediate → engineering foundations → JNTUK M.Tech CSE / AI / Data Science.  
Result: substantial foundational coverage, but the lesson collection cannot yet claim verified syllabus completeness. The largest identified lesson gaps are in PG applications and AP-specific paper alignment.

## Evidence and limits

Freshly extracted the four core source catalogs and school catalog, and checked the advanced lesson seeds: **919 registered lessons = 674 core + 220 school + 25 advanced**. These include platform/workspace lessons, so 919 is not a count of syllabus learning outcomes.

The [evidence matrix](AP_JNTUK_LESSON_COVERAGE_MATRIX.md) screens **79 topic groups**: 46 have lexical lesson candidates, 22 have only supporting source candidates, and 11 have no match in the searched fields/files. These are search classifications, not 46 completed outcomes or 33 certified missing topics. The [JSON evidence](AP_JNTUK_LESSON_COVERAGE_EVIDENCE.json) preserves all matching IDs, routes where extracted, and supporting paths. Broad topic groups require outcome-by-outcome review; one matched component does not cover an entire group.

Catalog search includes titles, descriptions, purposes, outcomes and objectives. Supporting search includes non-test TypeScript/TSX outside lesson and internal math-robo directories. It does not evaluate every teaching overlay, dynamic route, mathematical engine or browser lesson. A negative result is a strong authoring candidate, not proof of absolute absence. The advanced seed titles were extracted in order and IDs inferred from the existing sequential seed mapping.

| Syllabus reference | Evidence used | Status |
| --- | --- | --- |
| AP school | [AP Department of School Education textbook portal](https://cse.ap.gov.in/loadacademictextbookpublicview) and [bilingual index](https://cse.ap.gov.in/textBooksDownloadingPageTEBilingual) | Official indices located. Exact current Class 8/9/10 editions and chapter outcomes were not verified; school checklist is provisional. |
| AP Intermediate | [BIE syllabus portal](https://bie.ap.gov.in/SylabousReport/) | Portal did not expose readable current syllabus details through the browser tool. |
| AP Intermediate historical baseline | [Official first-year science syllabus](https://bieap.apcfss.in/Uploads/syllabus_Uploads/1st_year_(Science_Group)_Syllabus_(TM_and_EM).pdf), [official second-year science syllabus](https://bieap.apcfss.in/Uploads/syllabus_Uploads/2nd_year_(Science_Group)_Syllabus_(TM_and_EM).pdf), [2023–24 IB academic plan](https://bieap.apcfss.in/Uploads/Materials/MATHEMATICS_IB_I_YR.pdf) | Readable official documents. First-year file includes a 2015–16 plan; none establishes current 2026–27 applicability. Historical omissions below must be checked against the revised cohort syllabus. |
| JNTUK UG | [R23 document on a constituent-college host](https://jntukucen.ac.in/wp-content/uploads/2023/11/R23-REGULATIONS.pdf) | Located; detailed mathematical pages could not be reliably retrieved. UG checklist remains a bridge checklist, not a completed branch/semester audit. |
| JNTUK PG CSE | [University-authored R25 CSE PDF, public mirror](https://files-cdn.jntufastupdates.com/wpdm/2026/03/48041/R25-M.Tech-CSE-Syllabus.pdf) | Readable; masthead states JNTUK R25, effective 2025–26. Compared mathematical portions of ML, NLP, quantum and related electives. Official-host equivalence not independently confirmed. |
| JNTUK PG AI/Data Science | [University-authored R25 AI & DS PDF, public mirror](https://files-cdn.jntufastupdates.com/wpdm/2026/03/48028/R25-M.Tech-AI-DS-Syllabus.pdf) | Readable; used mathematical foundations, feature engineering and deep learning sections. Separate AI & ML and CSE-Data Science downloads were located but not readable; their full equivalence remains unverified. |

This audit covers mathematical teaching, not every software, cloud, security, IPR or dissertation requirement in a full M.Tech programme. No exact coverage percentage is justified until the current authoritative source denominator is established.

## What we missed in the audit system

1. **AP Intermediate and JNTUK traceability.** `src/modules/lessons/syllabus/lessonSyllabusTypes.ts` lacks `AP_BIE` and a JNTUK board identifier, although the separate truth layer does include `AP_BIE`. Lesson tags do not encode JNTUK regulation, programme, semester, course, unit, source page or syllabus edition. Generic `AP_SCERT` tagging cannot verify AP Intermediate coverage.
2. **A PG learning path.** `src/data/syllabus.ts` exposes school, degree and engineering filters, with no PG filter. `PG_FOUNDATION` and `PG_ADVANCED` exist in the lesson type, but school catalog lookup accepts Classes 6–12 only. A type value alone does not create a PG catalog or student pathway.
3. **Outcome-level coverage checks.** The existing syllabus audit test asserts that all original lessons have broad board tags and that an old remediation backlog contains 220 entries. It does not compare current AP/JNTUK official requirements against the complete lesson collection.
4. **Distinguishing lessons from supporting resources.** A formula entry, dictionary definition, planned roadmap item, studio or generic simulator is not evidence of a complete lesson with derivation, practice and assessment.
5. **Current teaching-quality evidence.** The July audit and September launch scores are historical. Their structural passes and heuristic scores must not be reused as proof that every current lesson teaches its syllabus outcome adequately.

## School and Intermediate findings

School remediation counts are Class 8: **12**, Class 9: **43**, Class 10: **29**, Class 11: **40**, Class 12: **69**. These are additions to core lessons, not complete grade course counts. The Class 8 additions concentrate on constructions, data comparison and pattern/logic work; chapter completeness must therefore be assessed across core and school routes together.

Most broad school foundations have lesson candidates. **Similarity/BPT needs a dedicated lesson review:** the matrix finds a dilation lesson as a related candidate, while `src/pages/Geometry.tsx` explicitly contains Basic Proportionality Theorem and Similar Triangles. That proves supporting teaching exists; it does not establish a complete Class 10 lesson and assessment sequence. Grouped statistics and ogives already have school lessons 10102–10109; the older statistics report's suggestion that this workflow is missing is stale.

Against the historical AP Intermediate papers, these deserve explicit lessons or mappings:

| Topic | Current evidence | Action |
| --- | --- | --- |
| Translation/rotation of axes | Exact terms found in `src/data/upcomingCurriculum.ts`; no catalog candidate | Treat roadmap text as planned coverage; author derivations and worked coordinate conversions if retained in the target edition. |
| Pair of straight lines, bisectors and homogenisation | Roadmap/support terms; no catalog candidate | Add a paper-specific sequence after current-syllabus confirmation. Generic line intersections are insufficient. |
| Theory/transformation of equations and reciprocal equations | Planned curriculum text; no catalog candidate | Add coefficient/root transformations and assessed reciprocal-equation problems. |
| Systems of circles and radical axis | Implemented supporting lab in `src/studios/geometry/circles/PowerOfPointLab.tsx`; no catalog candidate | Promote existing geometry work into a mapped lesson with the required algebra and assessment. |
| Families/concurrency of lines | Lessons 250 and 255 are related geometry candidates | Verify algebraic line-family problems separately from geometric concurrency demonstrations. |

These historical paper topics are stated in the official [first-year](https://bieap.apcfss.in/Uploads/syllabus_Uploads/1st_year_(Science_Group)_Syllabus_(TM_and_EM).pdf) and [second-year](https://bieap.apcfss.in/Uploads/syllabus_Uploads/2nd_year_(Science_Group)_Syllabus_(TM_and_EM).pdf) documents. Their current applicability remains unresolved.

## Engineering and PG findings

Engineering resources are broader than the registered lesson titles suggest. `src/data/syllabus.ts` already links higher-order ODEs, series solutions, boundary problems, transforms, PDEs, numerical methods, complex analysis, stochastic processes and optimization. Existing curriculum teaching includes SVD, conditioning, integral theorems and generating functions. **Do not rebuild these as absent topics.** Map and assess them against the relevant regulation first.

For the PG target, prioritize the following gaps identified by the matrix and manual source checks:

| Priority | Lesson work | Existing foothold / remaining need |
| --- | --- | --- |
| P0 | Mathematical foundations | Reuse discrete, matrix and calculus lessons; add or verify the homogeneous-function theorem lesson. Generating functions, definiteness, groups/rings and rank-nullity have supporting resources but need exact course mapping and assessments. |
| P0 | Machine-learning lessons | Logistic regression already has lesson 495. Other classifier and clustering topics have mostly absent or incidental evidence; dedicated mathematical and evaluated examples are needed. |
| P0 | Feature engineering | Reuse standardisation lesson 535 and linear algebra studios. Add an assessed feature-transformation workflow; dictionary entries do not establish mastery. |
| P0 | Neural-network training | `src/pages/AIApplications.tsx` mentions backpropagation, but this is insufficient evidence of a worked, graded training lesson. Build forward/gradient/update explanations with numerical checks. |
| P0 | Deep-learning mathematics | Several required architecture/training groups have no relevant source match; isolated formula or theory references need conversion into teachable lessons. |
| P1 | Statistical NLP | General grammars and Markov resources do not establish the specified probabilistic language-model workflows. |
| P1 | Quantum mathematics | Source mentions are sparse or decorative, and there is no qubit lesson match. Requires an actual mathematical sequence if included in the chosen programme/electives. |

The exact PG topic names, syllabus page references, matching lesson IDs and supporting files are in the matrix. Compare core and elected courses separately: an elective requirement is not compulsory for every student.

## Recommended completion order

1. Obtain/version current AP Class 8–10 books and Intermediate revised syllabus, plus the selected JNTUK programme and branch regulations. Store source URL, effective cohort, page and outcome for each requirement.
2. Add AP_BIE/JNTUK identifiers and programme/regulation/course-unit metadata, and expose a PG pathway. Resolve duplicated curriculum identifiers across the truth and lesson layers.
3. Convert existing supporting engineering and foundation resources into mapped lesson sequences, preserving existing IDs/routes and reusing studios.
4. Author the P0 PG lessons in the matrix, then required P1/elected modules. Verify examples, proofs/derivations, assessment answers and interactive model limits.
5. Replace broad board-tag assurances with requirement-to-lesson evidence. Mark outcomes as verified, partial, support-only, planned, missing or source-unverified. Keep content quality separate from route/structure validity.

## Validation performed

- Re-extracted the live source catalogs; did not rely on the dated `tmp/lesson-audit-data.json` snapshot.
- Ran `node scripts/audit-ap-jntuk-lesson-coverage.mjs` successfully. Regenerates the JSON evidence and Markdown matrix.
- Existing catalog/syllabus subset: **4 test files, 22 tests passed** (`lessonCatalog`, school catalog, advanced catalog and `lessonSyllabusAudit`). These tests establish existing structural expectations, not AP/JNTUK completeness.
- Manually checked negative PG term searches and several AP-specific and existing studio findings.
- Audit artifacts only; no lesson or app changes. Current AP edition parity, full UG branch coverage, separate AI/ML and CSE-Data Science equivalence, and full lesson visual/content QA remain unverified.
