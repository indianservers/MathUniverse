# AP school chapter plan and upcoming lesson reservations

Date: 2026-10-12

Created the Excel authoring tracker and an app-visible upcoming queue at `/lessons/upcoming`. The queue is linked from the lesson collection and school lesson pages. IDs and page names are reserved; teaching pages are not implemented and these reservations are excluded from the 919 existing catalog entries.

## Inventory

| Class | Topic / learning-work rows | Explicit catalog mapping candidates | Upcoming reservations |
| --- | ---: | ---: | ---: |
| 8 | 208 | 9 | 199 |
| 9 | 135 | 41 | 94 |
| 10 | 143 | 21 | 122 |
| Total school | 486 | 71 | 415 |
| Earlier Intermediate / UG / PG gap groups | — | — | 33 |
| Total upcoming | — | — | 448 |

School IDs are reserved in **30001–30415**; earlier higher-level groups use **32001–32033**. Existing IDs and routes are retained. Regeneration reuses IDs by stable topic key. Do not reuse or renumber reservations when mockups arrive.

## Workbook

`outputs/ap-jntuk-lesson-plan-20261012/AP_Class_8_to_JNTUK_Upcoming_Lessons.xlsx`

- **Upcoming lessons:** IDs, level, chapter/area, topic, page name, type, Upcoming status, editable mockup/development fields, related existing IDs, reserved route and source references.
- **School topics:** all indexed concept, guided-practice, assessment, exercise-family and supplement work, including existing catalog mapping candidates.
- **Chapters:** chapter-level and class-level counts with live completion formulas and a 100% target. Coverage verified on School topics is the authoritative input for these school totals.
- **Source register:** edition controls, official links, downloaded-source hashes and outstanding source records.

Use the lesson ID in the mockup filename, for example `30001-square-numbers.png`, and enter the filename/link in the mockup field. Excel edits are a planning snapshot and are not automatically imported into the app.

## Source findings

Queried the official AP textbook portal for 2026–27, Classes 8–10, Telugu-English medium. Also checked English-medium records for Classes 8–9; no maths books were returned in that query.

- Class 8 Semester 1 is a **new 2026 book**, with seven chapters: A Square and a Cube, Power Play, A Story of Numbers, Quadrilaterals, Number Play, We Distribute Yet Things Multiply, and Proportional Reasoning-1. The earlier generic Class 8 audit was not an adequate current-edition checklist.
- Class 9 Semester 1 lists six chapters, Number Systems through Lines and Angles.
- Class 10 lists both semesters and all fourteen chapters, plus proof and modelling appendices.
- Current Class 8 and 9 Semester 2 documents were **not listed in the queried portal**. Their 2025–26 editions are retained and clearly marked prior-edition planning. In particular, the old Class 8 Semester 2 must not be assumed to complete the new 2026 Class 8 sequence.

358 school rows use current portal documents; 128 use prior-edition Semester 2 documents. The plan includes 279 original concept-breakdown rows plus four additional numeral-system rows, 39 guided-practice rows, 39 chapter-assessment rows, 101 source practice families and 24 supplement rows. Source PDF page references are section/chapter anchors rather than a claim that every authored topic is a separately titled official section.

## Coverage meaning

“Existing—review required” is an explicit catalog mapping, not proof of complete instruction. Related IDs identify reusable mathematics but do not prove exact topic coverage. “Upcoming” means the dedicated topic/work item has not been mapped to a complete catalog lesson. It does not assert the mathematics is absent from every existing studio.

**100% is the completion target, not the achieved result.** Complete annual coverage still requires confirmation of current Semester 2 sources, reconciliation of every current learning outcome, review of unnumbered activities and individual exercise questions, original explanations and worked examples, validated practice and assessment, and accessibility/interaction review. No topic is marked verified merely because it has a title, route or reserved ID.

## Validation

- Unique reservations checked against core, school and advanced IDs; unique future routes and valid source-page bounds checked.
- Registry/landing/school catalog tests: 3 files, 11 tests passed.
- App browser check: upcoming route renders; searching ID 30001 returns its reserved topic; desktop and mobile screenshots captured; no page errors or mobile horizontal overflow.
- Excel formulas respond to a temporary completion change and were restored to zero verified coverage. Formula scan found no errors. All four worksheets were rendered and visually checked.
- Repository-wide typecheck reports 127 errors in unrelated workspace/studio code. No diagnostics reference the changed app/lesson pages or new registry files; it is not a clean repository-wide validation.

Implementation: `scripts/ap-school-topic-plan.mjs`, `scripts/build-ap-upcoming-registry.mjs`, and `src/modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json`.
