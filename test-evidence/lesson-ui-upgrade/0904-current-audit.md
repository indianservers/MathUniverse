# Lesson 0904: Four-Color Theorem

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0904-advanced-advanced-famous-problems-four-color-theorem-redesigned.png`.
Advanced concept ID: 2010. Route: `/lessons/advanced-concepts/2010-four-color-theorem`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated map model | Eleven polygon regions, canonical shared jagged borders, region labels and initial reference-like palette | Reconstructed contour is not an exact trace of target artwork; precise geometry/spacing unverified |
| Adjacency | Seventeen edges derived from shared border segments, excluding corner-only contacts | Corrects inconsistent reference graph diagonals, including cyan-to-cyan 1–5 despite reference's zero-conflict label |
| Linked coloring | Palette, clickable/keyboard regions and vertices, synchronized main/miniature views | Pointer/touch/focus behavior requires real browser verification |
| Tools | Undo with palette restoration, reset, clear, three/four-color mode and existing greedy-coloring helper | Added clear/greedy controls; selected-color undo edge case fixed |
| Three-color exploration | Fourth-color regions become uncolored; validity requires every region use a permitted color | This particular map has a verified three-color solution; no false claim that every map requires four |
| Graph | Correct region colors, derived edges, related-edge highlighting, draggable/keyboard-movable vertices and reset positions | User dragging can change the drawing or introduce crossings, not the underlying adjacency; drag/click separation unverified in browser |
| Conflict checking | Real used-color count, edge conflicts, incomplete regions, auto-check and manual check | No success unless all regions have permitted colors and no adjacent color matches |
| Transformation | Live miniature map and graph, computed vertex/border counts | Illustrative dimensions differ from reference; exact appearance deferred |
| Corner contact | Separate explanatory vector diagrams, point-only contact excluded by model | Replaces misleading red error icon for a valid differently colored shared-edge example with adjacency indicator |
| Practice | Dedicated five-region graph, three swatches, recoloring, clear and checked feedback | Starts with one uncolored region; reference's four-color practice image is not presented as a correct three-color solution |
| Proof story | Real expandable argument outline, minimal counterexample/unavoidable set/reducibility distinction, source link | Not a proof implementation; no claim that coloring this map verifies the theorem |
| Navigation / responsive source | Dedicated catalog route, section tabs, previous Fermat and next Confidence Intervals links; container layouts | App shell/footer, desktop/mobile overlap, actual rendered fonts and pixel match unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed after fixes.
- All 17 expected main-map edges checked explicitly, with corner-only 1–5 and 2–4 excluded; practice map has eight shared-border edges.
- Initial four-color map, a concrete three-color alternative, and existing greedy-helper result validated.
- Conflict, incomplete/empty, forbidden-fourth-color and practice cases tested.
- Region paths checked for closure and finite coordinates; these tests do not prove visual polygon fidelity or lack of rendered gaps.
- One targeted dedicated-route test passed; 219 unrelated tests skipped.
- Targeted strict TypeScript and focused ESLint passed after final edits.
- React SVG-title warning found and fixed; focused render test rerun without that warning.
- Existing application listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- Captured desktop evidence: `artifacts/studio-control-audit/0904-current.png`.
- One-by-one browser acceptance: opened the advanced route, applied greedy coloring, and verified the conflicts summary rendered.
- Focused surface/model tests pass (6 tests); `git diff --check` is clean for the lesson evidence.

## Sources

[University of Illinois Mathematics Library: Four Color Theorem resources](https://www.library.illinois.edu/mtx/four-color-theorem-resources/) and [Illinois Mathematics: Four Color Fest](https://math.illinois.edu/four-color-fest) support the theorem statement and Appel–Haken computer-assisted proof history (announced 1976; published 1977).

Next sequential target: 0905 / advanced concept 2011 Confidence Intervals. Earlier aggregate completion counts have not been re-audited.
