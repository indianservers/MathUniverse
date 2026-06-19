# Mobile Label Collision Strategy

## Current Structural Guardrails

- Visual Proofs use bounded parameter ranges.
- SVG visuals use responsive viewBox layouts.
- Labels can be hidden through the shared labels toggle.
- The shell provides responsive layout guardrails.
- Recent phases added compact scene headers that explain what the grid or graph is displaying.

## Known Limitation

There is no automated label-overlap or label-overflow detection today. Mobile QA is currently based on design constraints, metadata tests, and manual/HTTP smoke rather than browser bounding-box assertions.

## Proposed Detection Method

Use browser automation to inspect SVG text and handle elements:

1. Visit each proof route at mobile viewport widths.
2. Collect bounding boxes for SVG labels, draggable handles, formula callouts, and state panels.
3. Compare label-label intersections.
4. Compare label-handle intersections.
5. Detect labels overflowing beyond the SVG viewport.
6. Detect horizontal document overflow.
7. Report route, viewport, element text, and overlapping box coordinates.

## Priority Routes For Collision Checks

- dense graph routes
- conic sections
- calculus graph-limit routes
- engineering mathematics
- statistics and regression
- vector-field routes
- complex-plane routes
- coordinate geometry transformation routes

## Manual QA Checklist Updates

- Check 320 px, 375 px, 390 px, 430 px, and tablet widths.
- Toggle labels on and off.
- Test default values and extreme slider values.
- Verify the top scene summary remains readable.
- Verify controls and formula panels do not overflow horizontally.
- Verify state inspector values wrap instead of clipping.

## Future Automated Test Design

Add a Playwright test that uses generated smoke routes, visits selected dense routes first, then expands to every phase-upgraded route. Fail only on severe overlaps initially, and report moderate overlaps as warnings until thresholds are tuned.
