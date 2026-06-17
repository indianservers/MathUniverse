# Phase 01 Visual Proofs Architecture Audit

## Executive Summary

The Visual Proofs module already has a strong browser-only foundation: route-level lazy loading, a centralized proof index, category metadata, domain-specific proof templates, SVG-first visuals, shared controls, formula panels, symbol legends, and graceful coming-soon routes. The current library covers 95 available proof routes and 11 coming-soon starter routes across 18 categories, for 106 total routes.

Phase 1 adds the missing reusable architecture for the next nine phases: an opt-in `VisualProofShell`, accessible `ProofStepTimeline`, `FormulaInsightPanel`, `ProofStateInspector`, shared playback and reduced-motion hooks, richer proof metadata, and one safe demo migration for `sum-first-n-natural-numbers`. Existing routes remain available because the new shell is additive, not a replacement.

## Existing Route Inventory Summary

- Total routes documented in `INTERACTIVE_VISUAL_PROOFS_UPGRADE_SUGGESTIONS.md`: 106.
- Available routes: 95.
- Coming-soon starter routes: 11.
- Route pattern: `/visual-proofs/:categorySlug/:proofSlug`.
- Hub route: `/visual-proofs`.
- Category route: `/visual-proofs/:categorySlug`.
- Proof route renderer: `src/visual-proofs/pages/VisualProofPage.tsx`.
- Routing is lazy-loaded from `src/App.tsx`, which keeps Visual Proofs out of the initial app route bundle until requested.

## Existing Category Inventory

Available categories:

- Geometry Proofs: 11 available.
- Algebraic Identities: 12 available.
- Trigonometry Proofs: 15 available.
- Coordinate Geometry: 15 available.
- Calculus Visual Proofs: 15 available.
- Number Theory: 12 available.
- Sequences and Series: 15 available.

Coming-soon categories:

- Probability Proofs.
- Statistics Proofs.
- Matrices and Linear Algebra.
- Vectors.
- Complex Numbers.
- Mensuration.
- Conic Sections.
- Inequalities.
- Logarithms and Exponents.
- Transformations and Symmetry.
- Engineering Mathematics Proofs.

## Component Reuse Map

Strong shared pieces already present:

- `VisualProofLayout`: legacy page layout with visual area, side controls, steps, formula, notes, reflection, and next/previous navigation.
- `ProofControls`: shared play, reset, previous, next, label toggle, and formula toggle controls.
- `StepPanel`: reusable teacher-step list for existing proofs.
- `FormulaPanel`: reusable formula derivation card.
- `SymbolLegendPanel`: reusable symbol meaning panel.
- `ProofCard`, `CategoryCard`, `GeometryProofThumbnail`: reusable browsing cards.
- Domain templates: `AlgebraProofTemplate`, `GeometryProofTemplate`, `TrigProofTemplate`, `CoordinateProofTemplate`, `CalculusProofTemplate`, `NumberTheoryProofTemplate`, and `SequenceSeriesProofTemplate`.
- Utility modules: math helpers for algebra, calculus, coordinate geometry, geometry, number theory, probability, sequences, statistics, and trigonometry.

New Phase 1 shared pieces:

- `VisualProofShell`: opt-in three-panel learning surface for upgraded proofs.
- `ProofStepTimeline`: accessible click-to-step timeline with completed/current/locked states.
- `FormulaInsightPanel`: live formula, explanation, values, invariants, assumptions, and warnings.
- `ProofStateInspector`: collapsible teacher/developer state panel.
- `useProofPlayback`: shared local playback state without global coupling.
- `useReducedMotion`: shared media-query hook for future animations.
- Extended `proofTypes.ts`: proof metadata, live values, invariants, misconception checks, snapshots, and shell props.

## Current UX Gaps

- Most proofs use a good legacy layout, but not all are normalized around a three-panel learning surface.
- Manipulate, predict, reveal, practice is implied, not enforced.
- Formula panels are useful, but formula lines are not consistently tied to live visual state.
- Misconception checks are not yet standardized.
- Teacher controls are partial; export snapshot, freeze state, reveal layers, and copy lesson link are not yet fully implemented.
- Olympyard exits are not yet mapped per proof except the Phase 1 demo.

## Current Accessibility Gaps

- Buttons and sliders are mostly keyboard-accessible through native controls.
- SVG visuals need more consistent `role`, `aria-label`, and text alternatives.
- Reduced-motion behavior was not centralized before Phase 1.
- High-contrast support exists through the app theme but proof-level contrast requirements are not yet audited route by route.
- Timeline state semantics were not standardized before `ProofStepTimeline`.

## Current Mobile and Responsive Gaps

- Existing layouts are responsive and generally stacked on smaller screens.
- Some large SVG labels can become dense on narrow mobile screens.
- Canvas and formula panels need consistent minimum heights and overflow rules.
- Side panels should avoid sticky behavior on mobile; the new shell keeps sticky behavior desktop-only.
- Future phases should add per-proof mobile label collision checks.

## Current Testing Gaps

- Vitest exists and is used elsewhere in the app.
- There are no visual-proof-specific route smoke tests yet.
- There is no Playwright visual regression setup.
- No automated nonblank-canvas check exists for proof visuals.
- No mobile viewport overlap regression exists.

## Risk Areas

- `VisualProofPage.tsx` imports every proof component in one route chunk. This is acceptable for Phase 1 but should be split by category or component key later.
- Many proof templates are domain-specific; future shell migrations must avoid duplicating visual logic.
- Coming-soon routes are intentionally lightweight and should not be treated as completed proofs.
- SVG coordinate systems vary across templates, so mobile label collision fixes must happen per proof family.
- Teacher/export features can become over-engineered if added before snapshot state is standardized.

## Recommended 10-Phase Roadmap

1. Phase 1: Audit, shared shell architecture, metadata, QA checklist, and one demo migration.
2. Phase 2: Upgrade the highest-value beginner proofs in Geometry and Sequences using the shell.
3. Phase 3: Add misconception checks and prediction prompts to shell-ready proofs.
4. Phase 4: Add keyboard steppers and draggable handles for area, tile, and pattern models.
5. Phase 5: Add proof-state snapshots, copy lesson link, and teacher reveal/freeze controls.
6. Phase 6: Upgrade Algebraic Identities with tile-model consistency and Olympyard exits.
7. Phase 7: Upgrade Trigonometry and Coordinate Geometry with angle/grid-specific inspectors.
8. Phase 8: Upgrade Calculus proofs with graph-limit inspectors and approximation warnings.
9. Phase 9: Add first real proofs for the coming-soon categories.
10. Phase 10: Add route-level visual regression, mobile overlap checks, and premium polish.

## Phase 2 Priority List

Start with proofs that are beginner-friendly, visually clear, and educationally foundational:

- `sum-first-n-natural-numbers`: finish full shell migration with misconception checks.
- `triangle-area-half-rectangle`: area model with base/height misconception.
- `parallelogram-area-shearing`: area-preserving transformation.
- `square-of-sum`: tile model foundation for algebra.
- `sum-first-n-odd-numbers`: pattern-model companion to the demo.
- `circle-circumference-unwrapping`: measurement scene with approximation warnings.

## Technical Implementation Plan

- Keep the new shell opt-in.
- Use metadata fields to track migration status and avoid guessing which proofs are upgraded.
- Move one proof family at a time from legacy layout to shell-ready layout.
- Preserve existing SVG/2D/3D visuals when migrating.
- Add live values and invariants before adding challenge mode.
- Add proof-specific misconception checks only after the visual state model is explicit.
- Add visual route smoke tests once a browser test runner is introduced.

## Acceptance Checklist For Future Phases

- Route loads without error overlay.
- Proof title is visible.
- Primary visual canvas is visible and nonblank.
- Step timeline is keyboard accessible.
- Previous, next, reset, reveal, and practice controls are visible where supported.
- Formula panel shows exact values separately from rounded values when approximation exists.
- State inspector exposes parameters, live values, invariants, and warnings.
- Mobile viewport has no overlapping critical labels, controls, or formula text.
- Reduced-motion mode does not auto-play animations.
- High-contrast mode remains readable.
- Olympyard practice exit exists for upgraded proofs.
- Existing legacy routes remain accessible.
- TypeScript, lint, tests, and build pass.
