# Main home hero audit

Scope: the `/` hero component only. `Home.tsx` now mounts `UniverseHero` with the same lab count, topic count, progress and guided-tour callback. The CTA destinations remain `/math-lab` and `/learn`. The four statistics preserve their original expressions, labels and hints. The sections following the hero retain their existing implementation.

All visual assets are native: Canvas-projected globe, latitude/longitude grid, orbital rings, particles, platform, torus, tetrahedron and spiral; DOM studio card shells, titles and formulas; SVG mathematical diagrams. The reference was viewed only for comparison. No cropping, extraction, tracing, image reuse or reference-file runtime dependency. Searching the new component folder for raster extensions and reference path/name returns no matches.

Eight real studio links follow projected depth-dependent orbits with 48–62-second periods, billboard scale/opacity and depth sorting. Hover/focus damps the selected card's speed to zero, enlarges it and brightens its shell; neighbors continue. Mini-graphs advance independently and accelerate on hover. Pointer tilt adds local parallax. Collision separation keeps shells apart. Core hover slows the shared orbit and increases glow. Mobile displays the nearest three or four cards and stacks content/statistics.

Lifecycle: a single animation loop, delta-time timing, capped canvas DPR, ResizeObserver, IntersectionObserver, document-visibility suspension, reduced-motion freeze, and effect cleanup. Native links support keyboard focus; decorative canvas/SVG content is hidden from assistive technology.

Validation:
- Browser screenshots at 1920×1080, 1600×900, 1440×900, 1366×768 and 390×844; no horizontal overflow or browser errors.
- Cards change position; focused card settles while neighbors move; reduced-motion freeze confirmed.
- Additional desktop check: zero card-shell overlaps, copy fits, hero height 684px at 1440×900.
- Offscreen pause confirmed by scrolling the application's actual MAIN scroll container (the document itself is not the page scroll container).
- Scoped ESLint and standalone component TypeScript check pass.
- Production build passes; existing large-chunk advisory remains.

Evidence: check.json, pause.log, extra.json, typecheck.log, build.log and viewport PNGs in this folder. This is a native procedural interpretation of the composition; it does not reproduce the raster reference pixel for pixel.
