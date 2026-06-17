# Phase 10 Mobile Visual QA Checklist

Use this checklist for each `phase-upgraded` proof until a real browser visual regression suite exists.

## Mobile Viewports

- Check 320 px, 375 px, 390 px, 430 px, and a tablet width.
- Confirm `visual-proof-shell` does not create horizontal page scroll.
- Confirm the primary visual, formula panel, controls, timeline, inspector, and practice exit stack in a readable order.
- Confirm sticky side controls are desktop-only and do not pin over the visual on mobile.

## Nonblank Visuals

- Confirm `data-testid="visual-proof-primary-visual"` is present.
- Confirm the expected primary selector is `[data-testid="visual-proof-primary-visual"] svg` for current phase-upgraded proofs.
- Confirm the SVG has visible marks, not just an empty wrapper.
- Confirm the SVG has `role="img"` and a useful accessible label.

## Label Overlap

- Confirm long formulas are in the formula panel, not forced into the SVG.
- Confirm SVG labels stay compact on mobile.
- Confirm point, angle, and region labels do not cover key handles.
- Confirm dense live values stay in the formula/state panels.

## Controls

- Confirm play, reset, previous, next, labels, formula, reveal, challenge, and teacher controls wrap without clipping.
- Confirm sliders and steppers remain touch-sized.
- Confirm direct drag handles remain reachable by touch and keyboard fallback remains available.

## Formula Panel

- Confirm formulas wrap or scroll inside the panel.
- Confirm exact and rounded values stay within their cards.
- Confirm formula-token buttons wrap cleanly and remain tappable.
- Confirm KaTeX display blocks do not force horizontal page scroll.

## Snapshot Export

- Confirm teacher mode exposes `data-testid="visual-proof-snapshot-button"`.
- Confirm JSON snapshot copy remains visible.
- Confirm fallback JSON appears if clipboard is unavailable.
- Confirm SVG export is enabled for SVG-backed proofs.
- Confirm SVG export is disabled with the message `SVG export unavailable for this proof.` when no SVG is available.

## Reduced Motion And Contrast

- Confirm reduced-motion users can advance with Previous/Next instead of autoplay.
- Confirm the reduced-motion warning appears in proof state where relevant.
- Confirm dark mode keeps visual contrast, active states, borders, and text readable.
- Confirm focus rings remain visible on controls, token buttons, timeline buttons, and drag handles.

## Static Guardrails Added In Phase 10

- `visual-proof-shell` applies horizontal overflow containment.
- Shared grid/flex children use `min-width: 0` where the shell controls layout.
- `visual-proof-responsive-svg` constrains SVGs to responsive width and stable aspect ratio.
- `visual-proof-formula-wrap` contains long formula and panel text.
- `visual-proof-controls-wrap` allows narrow control labels to wrap instead of clipping.
