# Phase 3 pre-change curriculum and lesson baseline

Generated: 2026-08-20 before Phase 3 implementation changes.

## Inventory

| Catalogue | Records | Existing evidence | Baseline workflow classification |
|---|---:|---|---|
| Core lesson catalogue | 674 | Stable unique IDs/routes; adapter contracts; `existingLessonCoverage.generated.json` | Review required (12 not present in the former generic-content manifest); draft/review required (662 previously audited as generic) |
| School syllabus catalogue | 220 | Schema-valid routes, objectives, learn/explore/practice arrays, assessment prompts | Draft/review required; none has Phase 3 reviewer approval or official-source evidence |
| Advanced concepts | 25 | Five strands; objectives, explanations, practice and studio links | Draft/review required; none has Phase 3 reviewer approval |
| Total | 919 | Existing routes preserved | Approved: 0; certified: 0 under the Phase 3 evidence rules |

The older strengthening manifest contains 882 entries (662 core plus 220 school) and labels all `interaction_complete`. That status means interaction implementation work was reported complete; it is not equivalent to content approval, board mapping, or certification. Seventy-seven entries were separately flagged for expert review. All 21 lesson-brief bundle files still identify themselves as `phase_1_brief_scaffold` and explicitly say they are not approved lesson replacements.

## Reported catalogue shape

- Core: 674
- School: 220 (Class 6: 12; Class 7: 15; Class 8: 12; Class 9: 43; Class 10: 29; Class 11: 40; Class 12: 69)
- Advanced: 25
- Existing strengthening lesson modules discovered: 727
- Existing original core ID/route duplicates: 0/0

## Existing mapping risks

Every one of the 674 core audit records is tagged to all of NCERT, CBSE, AP SCERT, TN SCERT, Cambridge IGCSE, IB AA, IB AI, and Common Core. This is broad catalogue metadata, not outcome-by-outcome evidence. It cannot support certification.

The school generator creates 56 board/class pathways across eight broad board tags, but does not represent Andhra Pradesh BIE or Telangana BIE as independent senior-secondary authorities and does not model IA/IB/IIA/IIB papers. It also uses AP SCERT and TN SCERT, not Telangana BIE. Existing generic Class 11/12 tags therefore require remapping rather than promotion.

## Coverage-dimension baseline

The following is the honest baseline under the Phase 3 definitions:

| Dimension | Core 674 | School 220 | Advanced 25 |
|---|---|---|---|
| Catalogued | Yes | Yes | Yes |
| Explained | Mixed; automated per-lesson validation required | Draft content arrays exist | Draft content arrays exist |
| Visualized | Mixed; adapter/route links exist | Mixed | Studio links exist |
| Computational | Mixed | Mixed | Mixed |
| Practised | Mixed | Draft prompt arrays exist | Draft prompt arrays exist |
| Assessed | Mixed | Draft assessment prompts exist | Draft assessment prompts exist |
| Textbook mapped | No source-level evidence | No source-level evidence | Not applicable/unmapped |
| Board certified | No | No | No |

No existence-based percentage is reported because it would hide missing evidence dimensions.

## Existing assessment and interaction observations

- The school schema requires diagnostic/formative flags and content arrays but does not provide reproducible parameter seeds, independent answer verification, equivalence checking, staged hints, or review state.
- The classroom practice evaluator primarily scores token overlap or response length; it is not safe as a mathematical equivalence engine.
- Existing lesson adapters and Phase 1/2 workspaces provide substantial reusable interaction infrastructure. They must be referenced by stable mathematical node IDs in Phase 3 blocks rather than copied into lesson JSON.
- Existing NCERT completion/certificate reports are legacy audit artifacts. They do not satisfy the new official-source, reviewer, expiry, and outcome-level certification rules.

## Pre-change certification result

All pathways: **FAIL / PENDING**.

Blocking reasons: no ingested official-source records with checksums and page/section evidence; no independent AP BIE or Telangana BIE paper structures; no Phase 3 lesson workflow records; no genuine SME/teacher/QA approvals; no course-level outcome/practice/assessment evidence; no expiry-aware certification record.

This report is immutable baseline evidence. Phase 3 end-state comparison must preserve it and report improvements separately.
