# Page density improvements

The excess space came from stacked shared navigation, a breadcrumb width rule that forced an extra row, tall introductory cards, and scene heights sized without subtracting the full page chrome.

Changes:
- Shared back button and breadcrumb now share one row while breadcrumbs still wrap when needed.
- Reduced shared studio navigation spacing and lab title/tool spacing.
- Geometry, trigonometry and other mockup-studio lab introductions use native expandable guidance. All explanation and Try this content remains available.
- AR introduction is compact, view-mode buttons are shorter on desktop, nested horizontal padding is removed, and the desktop controls column is 320px wide.
- AR preview height accounts for the entire page chrome; controls remain independently scrollable.
- Number Systems inner-page heading, card padding, and navigation spacing are reduced.
- Mobile retains larger touch targets and wrapping.

Measured at 1440×900: AR scene begins approximately 134px higher (about 373px to 239px); its drawing canvas occupies y≈256–864 and fits above the footer. Shared geometry/trigonometry headers are roughly 40px shorter before the additional guide disclosure savings.

Verified representative routes: AR lab, geometry/circles, trigonometry/right-triangle, number-systems/integers, algebra, calculus, shapes and linear algebra. Six screenshot routes plus mobile AR have no horizontal overflow or browser errors. Opening the shared lab guide reveals its full explanation. Scoped ESLint passes. Production build passes with the existing large-chunk advisory.

This reduces common layout overhead across affected page families. A precise “10% unused space” guarantee for every page is not claimed: content, graph aspect ratios and device sizes vary.

Evidence: before.log, after.log, check.json, interaction.log, lint.log, build-final.log, desktop and mobile screenshots.
