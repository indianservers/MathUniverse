# Trigonometry Visualization Design Plan

## Phase 1 Audit

Target page: `/trigonometry`

Current integration:
- `src/pages/Trigonometry.tsx` imports `TrigIdentityVisualizations` and mounts it as the `Visualizations` tab inside the existing `TopicTabs` surface.
- The existing Trigonometry page remains intact: `Lab`, `Concepts`, `Formulas`, and `Syllabus` still sit beside the new `Visualizations` tab.
- The live browser audit confirmed the tab renders under the Trigonometry page, shows 20 visualization cards, and keeps the existing route/browser URL stable.

Current visualization implementation:
- `src/visualizations/trigonometry/TrigIdentityVisualizations.tsx` is self-contained.
- `VISUALIZATIONS` is a 20-item config list with `id`, `title`, `formula`, `summary`, `category`, and optional control flags.
- Shared state includes `thetaDeg`, `aDeg`, `bDeg`, `amplitude`, `frequency`, `phaseDeg`, and `angleMode`.
- `DegreeRadianToggle`, `AngleSlider`, `NumberSlider`, `FormulaDisplay`, `ExplanationCard`, `TrigValueTable`, `GraphPlot`, `UnitCircle`, and `IdentityVisualizationCard` are already present.
- Undefined tangent, cotangent, secant, and cosecant values are guarded through safe helpers and display as `undefined`.

Current live behavior:
- The Visualizations tab displays 20 cards.
- Degrees/radians toggle changes angle slider units.
- Formula cards update one active panel.
- Sliders and numeric inputs update values live.
- Unit-circle, graph, quadrant, wave, and angle-comparison views exist.
- The active explanation panel is collapsible via native `details`.

Audit findings:
- Several formulas currently reuse the same generic `UnitCircle` view with minor overlays. This is useful for consistency but not enough for beginner-level conceptual separation.
- Angle addition and subtraction formulas currently compare direct and expanded numeric values, but the visual model does not yet show the geometric projection breakdown that explains why the terms appear.
- Double-angle formulas currently show a second ray, but they need a stronger "theta copied twice" animation and formula term highlighting.
- Reciprocal identities need dedicated right-triangle/tangent-line diagrams instead of relying only on the unit circle.
- `sin²θ` and `cos²θ` need independent area-building views, not only the combined Pythagorean area panel.
- Complementary-angle identities need a right-triangle angle-swap diagram where labels visibly trade positions.
- The graph visualizations need live trace markers, phase/amplitude guides, asymptote warnings, and play/pause animation.
- Current formula text renders as readable inline text; a later phase can improve formula rendering through reusable formula fragments and highlighted terms.
- Some repeated logic should move into smaller view components during implementation: angle normalization, trig value formatting, graph path sampling, unit-circle geometry, formula-specific metadata, and safe reciprocal handling.

## Design Principles For The Upgrade

- Each formula gets one primary visual metaphor, not a generic reusable diagram by default.
- The first glance should answer: "What is moving?" and "What stays equal?"
- Colors should carry meaning consistently:
  - cyan = base/object/reference quantity
  - amber = changing/opposite/sine quantity
  - violet = proof relation/equality/combined result
  - rose = warning/undefined/asymptote
- Every formula should support experiment-first learning: drag or slide, watch labels move, then read the formula.
- Beginners should see values as lengths, areas, projections, rotations, or graph traces before seeing algebra.
- Engineering-level learners should still get exact values, edge cases, radians, and numeric proof.
- Undefined cases should be designed visually, not only as text: show zero denominator, vertical asymptote, or missing reciprocal ray.

## Component Direction

Planned reusable components for later phases:
- `TrigVisualizationShell`: consistent active formula layout with diagram, controls, values, and explanation.
- `FormulaHighlighter`: renders formula tokens and highlights the active geometric parts.
- `InteractiveUnitCircle`: draggable point, angle arc, projections, tangent/secant/cosecant overlays.
- `RightTriangleModel`: adjacent/opposite/hypotenuse triangle with swappable angle labels.
- `AreaSquareModel`: square-on-side visual for squared identities.
- `TrigGraphPlot`: graph plot with trace marker, asymptotes, labels, and optional animation.
- `AngleCompositionModel`: shows A, B, A+B, or A-B as arcs and projection rectangles.
- `QuadrantSignCompass`: ASTC compass with sign chips and live highlighted quadrant.
- `TransformationWaveModel`: amplitude, period, phase, midline, and live marker for `y = a sin(bx + c)`.
- `UndefinedStateCallout`: visible explanation beside the diagram when a denominator is zero or nearly zero.

## Formula Experience Design Table

| Formula | Best Visual Model | Interaction | Animation | Student Explanation | Implementation Notes |
|--------|-------------------|-------------|-----------|---------------------|----------------------|
| `sin²θ + cos²θ = 1` | Unit circle plus right triangle plus two square areas on the sine and cosine sides. | Drag point on circle or use `θ` slider; toggle show/hide squares. | Squares grow/shrink as the point moves; equality bar fills to exactly `1`. | The radius is always 1. The horizontal side is `cosθ` and the vertical side is `sinθ`, so their square areas always add to the square on the radius. | Dedicated `PythagoreanIdentityView`; keep cyan cosine square, amber sine square, violet radius square; handle all quadrants by using signed side labels but positive square areas. |
| `sinθ + cosθ` | Two signed component bars plus a combined violet resultant and a graph of `sinθ + cosθ`. | Drag `θ`; optionally show components as vertical stacked bars. | Moving trace marker travels on the sum graph; pulse at max `√2` and min `-√2`. | Sine and cosine are separate signed quantities. Adding them makes a new wave with a bigger possible height. | Dedicated `SinCosSumView`; show component signs, current sum, max/min markers at `45°` and `225°`; explain negative components below axis. |
| `sin²θ` | Sine height turned into a square/area tile. | Drag `θ`; toggle signed sine vs squared sine. | Amber height folds into a square; negative sine flips upward before squaring. | Squaring means "make an area from the length." Even when sine is negative, the square is positive. | Dedicated `SingleSquareView` variant; graph `sinθ` faintly and `sin²θ` strongly; emphasize range `[0,1]`. |
| `cos²θ` | Cosine base turned into a square/area tile. | Drag `θ`; toggle signed cosine vs squared cosine. | Cyan base folds into a square; negative cosine flips rightward before squaring. | Cosine can be positive or negative, but its square is always a positive area. | Reuse `SingleSquareView` with cosine orientation; graph `cosθ` faintly and `cos²θ` strongly; emphasize range `[0,1]`. |
| `tanθ = sinθ / cosθ` | Slope triangle and tangent line at `x = 1`. | Drag `θ`; switch between ratio triangle and tangent-line view. | Rise/run labels animate into a fraction; tangent segment grows very large near `90°`. | Tangent is how steep the radius line is: rise divided by run, or `sinθ` divided by `cosθ`. | Dedicated `TangentRatioView`; show denominator warning when `cosθ ≈ 0`; draw asymptote and `undefined` state visually. |
| `1 + tan²θ = sec²θ` | Tangent-line right triangle with adjacent side `1`, opposite side `tanθ`, hypotenuse `secθ`. | Drag `θ`; toggle square-on-side areas. | Three side squares appear; `1` square plus `tan²` square equals `sec²` square. | On the tangent line, the small base is always 1. Pythagoras gives `1² + tan²θ = sec²θ`. | Dedicated `SecantTriangleView`; edge case `cosθ = 0` hides hypotenuse endpoint and shows vertical/asymptote callout. |
| `1 + cot²θ = cosec²θ` | Cosecant/cotangent reciprocal triangle based on horizontal line `y = 1`. | Drag `θ`; toggle between tangent identity and cotangent identity for comparison. | Triangle rotates to the sine-side reciprocal version; side labels morph from tan/sec to cot/cosec. | Cotangent is the reciprocal-side partner of tangent. The triangle with side 1 gives `1 + cot²θ = cosec²θ`. | Dedicated `CosecantTriangleView`; edge case `sinθ = 0`; use `csc` label in code but display `cosec` if app convention prefers it. |
| `sin(A + B)` | Angle composition on unit circle plus projection-splitting rectangle. | Sliders for `A` and `B`; drag two arcs independently. | Arc A draws first, arc B attaches after it; projection splits into `sinA cosB` and `cosA sinB` colored pieces. | The height of the final angle can be built from two smaller projected heights. Those two pieces add. | Dedicated `SineAdditionView`; show direct final height beside two stacked expansion terms; include numeric proof and term highlighting. |
| `cos(A + B)` | Angle composition on unit circle plus horizontal projection with subtracting piece. | Sliders for `A` and `B`; toggle "show projection pieces." | Final horizontal projection forms; `sinA sinB` piece slides left to show subtraction. | The final horizontal length is one product minus another product. That is why cosine addition has a minus sign. | Dedicated `CosineAdditionView`; strong visual for negative term; show direct vs expanded difference close to zero. |
| `sin(A - B)` | Two angle rays with a removable B arc and vertical projection difference. | Sliders for `A`, `B`; drag B ray; toggle "subtract B from A." | B arc retracts from A; one projected height is removed. | Subtracting angles means compare the height after rotating back by B. One product is taken away. | Dedicated `SineSubtractionView`; show `A-B` ray, not just numeric comparison; include sign behavior when `B > A`. |
| `cos(A - B)` | Two rays with horizontal projection sum after reversing B. | Sliders for `A`, `B`; toggle "why plus?" | B ray mirrors/reverses; product pieces slide together to form a sum. | Cosine subtraction has a plus because reversing B changes the sign of sine's contribution. | Dedicated `CosineSubtractionView`; show even/odd behavior: `cos(-B)=cosB`, `sin(-B)=-sinB`. |
| `sin(2θ)` | Copy-the-angle model: θ arc duplicated to make `2θ`, plus rectangle/product model. | Drag `θ`; button "copy θ again." | First ray at θ, second ray at `2θ`; two `sinθcosθ` rectangles combine into final sine height. | Doubling the angle is not doubling sine. The height of `2θ` equals two matching projection products. | Dedicated `DoubleAngleSineView`; compare wrong guess `2sinθ` faintly to correct `2sinθcosθ`. |
| `cos(2θ)` | Double ray plus area difference model `cos²θ - sin²θ`. | Drag `θ`; toggle alternate forms: `1-2sin²θ`, `2cos²θ-1`. | Cosine square and sine square slide onto a number line; difference becomes final x-coordinate. | The horizontal coordinate after doubling equals cosine area minus sine area. | Dedicated `DoubleAngleCosineView`; show area difference and optional alternate identity chips. |
| `tan(2θ)` | Slope of doubled ray with denominator danger zone. | Drag `θ`; show `tanθ` input slope and `tan(2θ)` output slope. | Slope machine transforms `tanθ` through `2t/(1-t²)`; warning flashes when `t² = 1`. | Tangent of a double angle depends on the original slope, but it breaks when the denominator becomes zero. | Dedicated `DoubleAngleTangentView`; graph with asymptotes at `45°`, `135°`, etc.; show `undefined` beside zero denominator. |
| `sin(90° - θ) = cosθ` | Right triangle with the two acute angles labeled `θ` and `90° - θ`. | Drag `θ`; triangle shape changes while remaining right-angled. | Angle labels swap focus; side highlighted as "opposite to complement" and "adjacent to θ." | The side opposite the complement is the same side adjacent to θ, so sine of the complement equals cosine of θ. | Dedicated `ComplementSineView`; best as triangle, not unit circle; constrain `θ` between `0°` and `90°` for beginner mode, with advanced mode allowing all angles. |
| `cos(90° - θ) = sinθ` | Same right triangle, but highlight the other side. | Drag `θ`; toggle between sine-complement and cosine-complement views. | Highlight moves from adjacent-to-complement to opposite-to-θ. | The side adjacent to the complement is the same side opposite θ, so cosine of the complement equals sine of θ. | Dedicated `ComplementCosineView`; pair with previous view to reduce confusion; show both identities in a mini comparison card. |
| Quadrant signs / ASTC | Four-quadrant compass with moving point and sign table. | Drag point around circle; quick buttons for QI, QII, QIII, QIV and axes. | Active quadrant glows; sign chips flip between `+`, `-`, and `0/undefined`. | The signs depend on whether x and y are positive or negative. Sine follows y, cosine follows x, tangent follows y/x. | Dedicated `QuadrantSignView`; handle axis cases separately: sin/cos can be `0`, tan can be `0` or `undefined`. |
| Unit circle for `sin`, `cos`, `tan` | Full coordinate-reading unit circle with projections and tangent line. | Drag point; slider; snap buttons for common angles. | Point moves; projections drop; tangent line extends; graph marker can optionally sync below. | The point `(x,y)` on the unit circle is `(cosθ, sinθ)`. Tangent is the slope or `y/x`. | Upgrade `InteractiveUnitCircle`; add draggable point, special-angle labels, tangent undefined callout, and optional exact values for common angles. |
| `y = a sin(bx + c)` | Wave transformation lab with amplitude bracket, period ruler, phase-shift arrow, and moving trace. | Sliders for `a`, `b`, `c`; play/pause x-trace; reset buttons per slider. | Wave morphs smoothly; amplitude bracket expands; period ruler compresses; phase arrow slides. | `a` changes height, `b` changes how quickly the wave repeats, and `c` slides it left or right. | Dedicated `WaveTransformView`; show midline, amplitude, period `2π/|b|`, phase shift `-c/b`; handle negative `a` as reflection. |
| Compare `sinθ`, `cosθ`, `tanθ` curves | Three synchronized graphs plus unit-circle trace. | Drag `θ`; toggle each curve; snap to key angles. | Vertical trace line moves across all curves; unit-circle point moves in sync; tangent asymptotes stay fixed. | Sine and cosine are smooth bounded waves. Tangent is their ratio, so it breaks where cosine is zero. | Dedicated `CurveComparisonView`; split tan into path segments; show asymptote lines; avoid scale domination by clipping tan. |

## Edge Case Checklist

- `cosθ = 0`: `tanθ` and `secθ` undefined.
- `sinθ = 0`: `cotθ` and `cosecθ` undefined.
- `1 - tan²θ = 0`: `tan(2θ)` undefined.
- Axis angles: quadrant model should show axis state, not force a quadrant.
- Negative angles: normalize for quadrant display but preserve signed angle readout.
- Radians mode: sliders should use radian units while diagrams keep degree labels readable where helpful.
- Negative amplitude: wave should reflect across the midline.
- Frequency near zero: prevent division by zero in period/phase calculations.
- Phase shift: show both `c` and `-c/b` so students do not confuse the sign.

## Implementation Phasing Recommendation

1. Extract shared math/render helpers and clean visual metadata.
2. Build dedicated unit-circle and graph primitives with draggable point support.
3. Replace generic formula views with dedicated components in groups: core identities, reciprocal identities, angle addition/subtraction, double-angle/complementary, graph/quadrant.
4. Add animation controls: play/pause, step reveal, ghost previous position, and formula-term highlighting.
5. Run build and browser verification after each group so existing Trigonometry behavior stays stable.
