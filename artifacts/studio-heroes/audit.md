# Studio home hero audit

Reference folder: `D:/Math App Screenshots for UI Update/Studios/herosection`.
All 18 numbered mockups were inspected together before implementation. They guide the headline, 40/60 composition, subject matter, white-to-observatory transition and accent colors. No reference image is shipped or cropped into the interface.

## Route and reference checklist

| Complete | Reference | Existing route | Native mathematical scene |
|---|---|---|---|
| ✓ | 01_Algebra_Studio.png | /algebra | Balance and term transposition |
| ✓ | 02_Algebraic_Structures_Studio.png | /algebraic-structures | Cayley cells, modular orbit and symmetry rings |
| ✓ | 03_Geometry_Studio.png | /geometry | Circle construction, triangle, tangent and rotating cube |
| ✓ | 04_Calculus_Studio.png | /calculus | Moving tangent and growing Riemann sum |
| ✓ | 05_Number_Systems_Studio.png | /number-systems | Nested sets, fractions and irrational positions |
| ✓ | 06_Linear_Algebra_Studio.png | /linear-algebra | Real shear/scale matrix acting on grid and vector |
| ✓ | 07_Complex_Numbers_Studio.png | /complex-numbers | Rotating complex point with rectangular components |
| ✓ | 08_Mathematical_Modelling_Studio.png | /mathematical-modelling | World-to-data-to-equation-to-prediction flow |
| ✓ | 09_Number_and_Discrete_Mathematics_Studio.png | /discrete-world | Pascal coefficients, modular clock and recurrence |
| ✓ | 10_Set_Theory_and_Relations.png | /set-theory | Sets, intersection elements and relation arrows |
| ✓ | 11_Graph_Theory.png | /graph-theory | Shortest path, spanning tree and proper coloring |
| ✓ | 12_Statistics_and_Probability_Studio.png | /probability-statistics | Histogram, Gaussian density and sample motion |
| ✓ | 13_Differential_Equations_Studio.png | /differential-equations | Logistic solution moving through direction field |
| ✓ | 14_Continued_Fractions_Lab.png | /math-lab/continued-fractions | Nested fraction, convergents and golden subdivision |
| ✓ | 15_Famous_Problems_Atlas.png | /math-lab/famous-problems | Illuminated atlas of mathematical landmarks |
| ✓ | 16_Statistics_Inference_Studio.png | /math-lab/stats-inference | Sampling distribution, confidence interval and hypothesis tails |
| ✓ | 17_Special_Functions_Gallery.png | /math-lab/special-functions | Gamma, Bessel wave, Legendre and Beta gallery |
| ✓ | 18_Advanced_Differential_Equations_Studio.png | /math-lab/differential-equations | Separated heat mode, ripples and Lorenz trajectory |

## Scope

- Trigonometry source and hero remain unchanged by this task.
- Existing routes, solvers, lessons, datasets and tools were not changed.
- Only home hero render branches and new hero files were edited. The shared chrome insertion explicitly checks home page and the listed studio IDs.
- Existing below-hero JSX content is preserved. Hero search/help/settings and geometry's original construction controls remain available in “More studio controls”. The number-system labs anchor is preserved.
- The five advanced studios have no separate landing component in this application: their existing direct routes share AdvancedConceptStudios. A hero precedes the unchanged switcher and workbench; no new routes or lab behavior were introduced.
- Calculus had no import of its existing stylesheet and rendered oversized navigation icons before the hero. That stylesheet is now inserted only while its home page is mounted, restoring the existing intended layout without changing the inner-page branch.

## Animation and performance

Native React text and links accompany procedural canvas diagrams. Scenes use subject-specific formulas, points, paths and transformations; the headline/equation/CTAs remain native text. One requestAnimationFrame loop runs for the mounted visible hero. IntersectionObserver, document visibility, resize observer, capped device pixel ratio and complete cleanup keep inactive heroes paused. Reduced motion produces a frozen final composition and disables pointer parallax. No dependencies were added.

Diagrams scale uniformly with containment; intrinsic canvas sizing cannot expand the hero. Desktop height uses clamp(300px,32vh,390px); at the requested desktop sizes observed heights are 300px or approximately 346px. Mobile stacks copy over a 240px mathematical scene. This follows the explicit minimum-height rule: at 768px viewport height 300px is about 39%, rather than forcing 32% and clipping copy.

These are cinematic introductions, not new full laboratory simulations. Supporting mathematical diagrams are illustrative; the existing labs remain the place for input, computation and investigation. No measured hardware FPS claim is made.

## Verification

- All 18 actual routes checked at 1920×1080, 1600×900, 1440×900, 1366×768, and 390×844 (90 viewport checks).
- Desktop hero and start of following section visible; copy contained; no horizontal document overflow.
- Native canvas frames change in normal motion and remain unchanged under reduced motion.
- Trigonometry checked to ensure no new hero is mounted there.
- Screenshots saved for desktop and mobile, plus reference and implementation contact sheets.
- Production build passes; existing chunk-size warnings remain.
- New hero files pass ESLint and scoped TypeScript compilation.
- Repository-wide typecheck does not pass: existing geometry/workspace and other diagnostics remain. Existing lint errors in the large GraphTheoryModule and CalculusStudio files remain; this task does not expand into unrelated repairs.

Final Calculus-only follow-up at all five viewport sizes passed after simplifying the header wrapper. Follow-up TypeScript compilation with Vite declarations reports no diagnostics in CalculusStudio or the hero modules; unrelated imported-module errors remain. The earlier repository-wide log also contains header-narrowing diagnostics that this final refactor removed.

Evidence: calculus-final-browser.json, calculus-typecheck.log, browser-audit.json, browser-audit.log, build-final.log, hero-lint.log, typecheck.log, repository-typecheck.log.
