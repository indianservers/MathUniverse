# Proof Explanation Stabilization Roadmap

## Purpose

This roadmap stabilizes explanation quality across Math Universe proof surfaces: Visual Proof routes, Theorem Library proof drafts, formula-linked proof panels, and future step-by-step theorem pages.

The goal is not just "more text." The goal is a reliable learning pattern:

- State the result plainly.
- Show what each symbol or object means.
- Explain why the proof move is allowed.
- Tie each step to a visual representation.
- Name common mistakes before students make them.
- Connect the proof to formulas, theorem pages, and Visual Proof routes.

## Current Baseline

Phase 1 audit results:

- Visual Proof entries: 183
- Phase-upgraded Visual Proof entries: 183
- Theorem Library entries: 216
- Draft-ready theorem proofs: 72
- Planned theorem proofs: 144
- Blocking explanation errors: 0
- Stabilization warnings: 184

The current library is structurally ready, but many theorem explanations still need stronger student-facing polish and many theorem pages are intentionally scaffolded.

## Phase 1 - Explanation Audit and Quality Gate

Target: Shared proof explanation infrastructure.

Technical goals:

- Add a typed audit for Visual Proof and Theorem Library explanation fields.
- Separate blocking errors from stabilization warnings.
- Make the audit runnable as a focused test.
- Keep the gate conservative so it does not block planned theorem scaffolds.

Educational goals:

- Define the minimum explanation standard for proof surfaces.
- Identify terse proof steps, missing visual representation notes, and planned proof gaps.
- Prepare later phases to improve content category by category.

QA goals:

- Focused Vitest coverage for proof explanation counts and structural readiness.
- Typecheck after adding the audit module.

Acceptance criteria:

- Audit covers Visual Proof metadata and Theorem Library proof drafts.
- Draft-ready proofs must have proof idea, at least three steps, and step explanations.
- Planned theorem proofs are tracked as warnings, not failures.
- Focused test passes.

## Phase 2 - Theorem Draft Explanation Stabilization

Target: 72 draft-ready theorem proofs.

Technical goals:

- Normalize proof step lengths and representation notes.
- Expand terse theorem statements and thin proof steps.
- Add a consistent proof step shape for title, reason, visual cue, and takeaway.

Educational goals:

- Make every draft-ready theorem teachable without teacher improvisation.
- Add clearer "why this step works" language.
- Strengthen common mistakes and exam memory notes.

QA goals:

- Reduce warnings for draft-ready theorem proofs.
- Add category-level checks for algebra, geometry, trigonometry, and number theory theorem drafts.

Acceptance criteria:

- No draft-ready theorem has terse step warnings.
- Every draft-ready theorem has at least one visual representation note per step.
- Common mistakes are present and student-friendly.

## Phase 3 - Visual Proof Explanation Stabilization

Target: 183 phase-upgraded Visual Proof routes.

Technical goals:

- Audit and improve proof route metadata, learning outcomes, prerequisites, and summary copy.
- Confirm formula tokens, prediction prompts, misconception checks, and snapshot metadata stay aligned with explanations.
- Add category-level explanation consistency checks.

Educational goals:

- Make each Visual Proof answer: what is changing, what stays invariant, and why the result follows.
- Improve low-friction student explanations for weak learners.
- Strengthen teacher projection language and practice exits.

QA goals:

- Focused tests for all Visual Proof categories.
- Ensure `hasVisualRegressionTest` remains false unless real browser visual tests exist.
- Keep route smoke metadata tied to `visualProofsIndex`.

Acceptance criteria:

- All Visual Proofs have clear short and long explanations.
- All categories have consistent explanation style.
- No metadata drift between route, proof component, and explanation.

## Phase 4 - Cross-Link Formulas, Theorems, and Visual Proofs

Target: Connected proof learning graph.

Technical goals:

- Add explicit relation fields or stable lookup utilities connecting theorem entries, formula entries, and Visual Proof routes.
- Surface "related formula", "related theorem", and "visual proof" links where safe.
- Avoid circular manual duplication by using source-of-truth data maps.

Educational goals:

- Let students move from formula to theorem to visual proof naturally.
- Make the app feel like one connected math lab instead of separate islands.
- Support teacher lesson paths and student revision paths.

QA goals:

- Link integrity tests for internal routes.
- Tests for missing or stale proof/formula/theorem references.

Acceptance criteria:

- Major theorem families link to relevant formulas and Visual Proofs.
- Formula pages can point to theorem proof pages where available.
- Visual Proof pages can show related theorem/formula context.

## Phase 5 - Browser Explanation Certification

Target: Launch-grade proof explanation reliability.

Technical goals:

- Add browser smoke checks for representative proof explanation pages.
- Add visual nonblank checks for proof visuals where browser testing exists.
- Add mobile checks for explanation panels, cards, and step timelines.

Educational goals:

- Certify that explanations are readable on classroom projection and mobile screens.
- Confirm visual proof, theorem text, and formula meaning appear together without layout confusion.
- Prepare screen-recording lesson workflows.

QA goals:

- Browser certification matrix by category.
- Mobile overflow and readability checks.
- Snapshot/export checks where applicable.

Acceptance criteria:

- Representative proof routes pass browser smoke and readability checks.
- Major linked theorem/formula/proof journeys are verified.
- A final readiness certificate summarizes explanation stability by module.

## Immediate Recommendation

Start with Phase 1 and keep it intentionally conservative. The platform already has a large proof surface, so the next useful move is a reliable audit that finds weak explanation areas without forcing unrelated proof rewrites in one pass.
