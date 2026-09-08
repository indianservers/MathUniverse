# Target 0150 Current Audit

## Lesson

- Lesson ID: 93
- Title: Like Terms
- Route: `/lessons/algebra/93-like-terms`
- Target: `0150-interactive-intermediate-expressions-and-manipulation-like-terms-redesigned.png`
- Status: code reconciled; current browser screenshot acceptance deferred

## Target Reconciliation

| Target requirement | Implementation | Verification |
| --- | --- | --- |
| Dedicated Like Terms workspace | `LikeTermsTargetLesson93` remains the dedicated lesson renderer | Adapter regression test |
| Dedicated object model | Problems, coefficients, simplification, evaluation, term edits, and grading use `likeTermsLesson93Model` | Model tests |
| Real tile inventory | Positive variables, negative variables, and every constant unit render from actual coefficients | Surface test |
| Working drag controls | Bank terms can be dragged into the workspace and update the active problem | Component inspection |
| Combination stages | Matching, cancellation, constant preservation, and result all derive from current terms | Component inspection |
| Expression selector | Choosing a problem loads a separate modeled expression and recomputes all panels | Component inspection |
| Substitution check | Original and simplified forms are evaluated independently at the selected input | Model and surface tests |
| Graded practice | Normalized learner input is checked against the modeled result with reveal/hint state | Model tests |
| Functional lesson tabs | Learn, Examples, Formula, and Practice render distinct model-derived content | Component inspection |
| Lesson navigation | Reset, previous, and next actions are wired | Component inspection |

## Target Correction

The target image depicts `+4` using a single `+1` tile. The live workspace now renders four unit tiles so its object inventory, expression, and substitution check agree. Negative constants similarly render the correct number of negative unit tiles.

## Verification Run

- `likeTermsLesson93Model.test.ts`: passed
- `LikeTermsTargetLesson93.test.tsx`: passed
- focused lesson 93 adapter route test: passed
- ESLint on lesson 93 files: passed with zero warnings
- TypeScript project check: passed

## Acceptance Boundary

The target PNG was inspected and used for the tile lab, stage sequence, control rail, substitution proof, notes, practice card, and navigation. Per the current instruction to avoid the browser option, no post-change browser screenshot or pixel-diff acceptance was performed. Exact visual parity remains pending; code routing, calculations, interactions, and structural correspondence are verified.
