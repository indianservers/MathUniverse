# Trigonometry home redesign

Scope: only the default Trigonometry Studio home page. Existing lab pages, advanced workbench, routes and the shared learning panel remain unchanged. The five tabs are rendered by the original StudioTheoryPanel: Theory & examples, In Simple words, Formulas, Real-time examples, Try these.

The supplied reference was inspected and used as a composition guide. No pixels or fragments were extracted. All eight topic illustrations, the logo and major icons are original SVG code. The home has horizontal navigation, a white-to-space split hero, a four-column topic grid, learning cards and a footer. Mobile retains a functional mathematical scene.

The hero uses one live angle for the orbit point, radius, projections, angle arc, numerical readout and sine/cosine wave paths. Animation uses requestAnimationFrame, with a 16-second orbit. Independent HUD rings use slow CSS animation. Pointer dragging, click pause/resume and arrow-key angle changes are supported. Reduced motion disables automatic movement; IntersectionObserver stops offscreen animation.

Verification:

- Visually reviewed at 1920×1080, 1600×900, 1440×900, 1366×768 and mobile. Eight viewport checks from 390 to 1920px found no horizontal overflow or sidebar, and all eight topic cards.
- All eight existing topic routes loaded successfully.
- All five original learning tabs switched successfully.
- Pointer dragging, keyboard angle changes and reduced-motion stability passed browser checks.
- Zero browser errors and zero scoped automated WCAG A/AA axe violations. Automated checking does not certify exhaustive accessibility.
- Three focused tests passed, including screen-coordinate correctness and synchronized waveform origins.
- Scoped ESLint and strict scoped TypeScript passed.
- Production build passed; large-bundle warnings remain.

Screenshots are named by viewport width. Results are in results.json, browser-checks.txt and build.txt. Visual comparison is qualitative; no numerical pixel-similarity score is asserted. Changes remain uncommitted.
