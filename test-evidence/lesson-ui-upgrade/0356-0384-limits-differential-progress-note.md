# Limits and Differential Calculus target batch 0356-0384

Dedicated rebuild target: **25 of 29 lessons completed; 4 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0356 | 277 Informal Limits | `removable-hole-two-sided-approach-draggable-markers-linked-table-limit-practice` | Reworked individually and browser-validated |
| 0357 | 278 One-Sided Limits | `piecewise-one-sided-approach-independent-sliders-trace-verdict` | Reworked individually and browser-validated |
| 0358 | 279 Infinite Limits | `rational-vertical-asymptote-one-sided-infinite-approach-sign-domain-practice` | Reworked individually and browser-validated |
| 0359 | 280 Limits at Infinity | `even-rational-end-behavior-horizontal-asymptote-linked-view-dominant-terms-practice` | Reworked individually and browser-validated |
| 0360 | 281 Continuity at a Point | `parabola-removable-hole-editable-point-five-condition-continuity-drag-practice` | Reworked individually and browser-validated |
| 0361 | 282 Types of Discontinuity | `three-break-graphs-six-draggable-approach-markers-derived-limits-classification` | Reworked individually and browser-validated |
| 0362 | 283 Epsilon-Delta Visualiser | `linear-epsilon-delta-linked-input-output-bands-draggable-handles-proof-practice` | Reworked individually and browser-validated |
| 0363 | 284 Average Rate of Change | `quadratic-two-draggable-secants-linked-rise-run-rate-independent-practice` | Reworked individually and browser-validated |
| 0364 | 285 Instantaneous Rate of Change | `quadratic-fixed-base-movable-secant-h-limit-tangent-convergence-practice` | Reworked individually and browser-validated |
| 0365 | 286 Derivative From First Principles | `selectable-quadratic-base-point-h-secant-difference-quotient-symbolic-limit-practice` | Reworked individually and browser-validated |
| 0366 | 287 Tangent Line | `quadratic-draggable-point-derivative-tangent-slope-triangle-point-slope-practice` | Reworked individually and browser-validated |
| 0367 | 288 Normal Line | `concave-quadratic-draggable-point-tangent-negative-reciprocal-normal-right-angle-step-practice` | Reworked individually and browser-validated |
| 0368 | 289 Derivative Graph | `integrated-cubic-linked-derivative-shared-draggable-cursor-tangent-sign-zeros-scales-challenge` | Reworked individually and browser-validated |
| 0369 | 290 Higher Derivatives | `quartic-four-linked-derivative-levels-shared-drag-cursor-domain-visibility-sign-concavity-practice` | Reworked individually and browser-validated |
| 0370 | 291 Product Rule | `editable-factor-pair-independent-product-derivative-product-rule-decomposition-domain-step-display-practice` | Reworked individually and browser-validated |
| 0371 | 292 Quotient Rule | `editable-numerator-denominator-automatic-poles-quotient-derivative-tangent-rule-comparison-practice` | Reworked individually and browser-validated |
| 0372 | 293 Chain Rule | `input-sine-inner-square-outer-composition-linked-rates-invertible-output-drag-tangent-practice` | Reworked individually and browser-validated |
| 0373 | 294 Implicit Differentiation | `upper-semicircle-constrained-linked-x-y-direct-drag-implicit-slope-tangent-classification-practice` | Reworked individually and browser-validated |
| 0374 | 295 Parametric Differentiation | `parameter-driven-coordinate-curve-direct-drag-component-rates-quotient-tangent-vector-meters-choice-practice` | Reworked individually and browser-validated |
| 0375 | 296 Critical Points | `piecewise-corner-stationary-max-min-direct-drag-sign-chart-finite-step-layer-toggles-classification-challenge` | Reworked individually and browser-validated |
| 0376 | 297 Increasing and Decreasing | `editable-shape-coefficients-symmetric-critical-roots-direct-root-drag-synchronized-function-derivative-sign-interval-practice` | Reworked individually and browser-validated |
| 0377 | 298 Local and Global Extrema | `closed-interval-quadratic-two-draggable-endpoints-linked-sliders-candidate-comparison-local-global-range-practice` | Reworked individually and browser-validated |
| 0378 | 299 Concavity | `selectable-analytic-functions-shared-x-direct-graph-drag-finite-step-second-derivative-synchronized-graphs-sign-regions-inflection-practice` | Reworked individually and browser-validated |
| 0379 | 300 Inflection Points | `four-coefficient-cubic-analytic-second-derivative-direct-inflection-drag-concavity-sign-map-step-practice` | Reworked individually and browser-validated |
| 0380 | 301 Optimisation | `fixed-concave-quadratic-domain-critical-endpoint-comparison-direct-x-drag-finite-derivative-cas-optimisation-practice` | Reworked individually and browser-validated |
| 0381 | 302 Related Rates | Pending audit | Pending |
| 0382 | 303 Motion Analysis | Pending audit | Pending |
| 0383 | 304 Newton's Method | Pending audit | Pending |
| 0384 | 305 Taylor Polynomial | Pending audit | Pending |

## Lesson 277 / Mockup 0356 - Informal Limits

Reworked individually around a dedicated removable-hole approach model. The same left/right marker state drives two graph handles, two pairs of numeric inputs, vertical guides, function samples, the linked four-row value table, action count, and two-sided limit evidence. Real SVG pointer dragging, direct input editing, six lesson tabs, fullscreen, Reset, Share, independent challenge selection/checking, shell Reset, and Previous/Next navigation are functional.

Browser validation starts from `A=-0.5` and `B=0.5`, deriving `f(A)=f(B)=0.2397127693` for `f(x)=x sin(x)`. It independently edits the markers to `-0.25` and `0.4`, then performs a real pointer drag on A and confirms the graph, state, and table move together. The challenge rejects `1`, accepts `0`, and shell Reset restores both markers, the correct challenge state, selected Interact tab, and zero action count. The mockup's table and stated limit correspond to `x sin(x)`, while its pictured bounded hump corresponds to a different function; this implementation keeps every linked calculation coherent with the displayed formula and table.

Final exact 1024x1536 validation matches the target stack: sidebar width 215, dedicated header y=101-331, tabs y=341-384, learning flow y=393-474, graph/approach lab y=484-1390, proof y=1091-1161, worked/misconception/challenge row y=1168-1383, adjacent navigation y=1398-1436, and site footer y=1444-1536. It reports no horizontal overflow and zero console messages.

Evidence:

- `0356-reference.png`
- `0356-desktop.png`
- `0356-dedicated-target-validation.json`

## Lesson 278 / Mockup 0357 - One-Sided Limits

Reworked individually around a dedicated piecewise one-sided-limit model. The selected scenario drives both graph branches, open or filled break points, left/right formulas, function value at zero, five-row numeric trace, and two-sided verdict. Independent native range dragging, left/right trace visibility, jump/matching/removable scenario selection, five lesson tabs, Reset, Share, shell Reset, and Previous/Next navigation are functional.

Browser validation starts with the jump `f(x)=-1` for `x<0` and `f(x)=1` for `x>0`, correctly deriving left limit `-1`, right limit `1`, and a nonexistent two-sided limit. It drags the approach distances to `-0.08` and `0.12`, hides the left trace, switches to matching sides and derives an existing limit of `1`, then switches to a removable hole while preserving the same two-sided limit but removing the function value. Shell Reset restores the jump, both traces, ±0.25 markers, selected interaction tab, and zero action count.

Final exact 1507x1044 validation matches the target landscape stack: sidebar width 291, compact header y=101-175, tabs y=184-227, two-column graph and verdict workspace y=236-933, graph y=305-575, trace y=700-890, adjacent navigation y=951-1009, and no site footer. It reports no horizontal overflow and zero console messages.

Evidence:

- `0357-reference.png`
- `0357-desktop.png`
- `0357-dedicated-target-validation.json`

## Lesson 279 / Mockup 0358 - Infinite Limits

Reworked individually around the exact rational model `f(x)=-2/(x-1)^3`. The selected approach side and constrained range value drive the sampled graph marker, live function value, classification, sign behavior, domain, and vertical-asymptote evidence. Left/right switching, native range dragging, marker visibility, five lesson tabs, fullscreen, Reset, Share, six-field practice classification, exact checking, practice reset, shell Reset, and Previous/Next navigation are functional.

Browser validation starts at `x=0.9`, deriving `f(x)=2000`, then moves to `x=0.98` and derives approximately `250000`. Switching to the right starts at `x=1.1` with `f(x)=-2000`; moving to `1.02` derives approximately `-250000`. It hides the approach markers, rejects an incorrect first-row left limit, accepts the restored `+infinity, -infinity, Yes` classification, and shell Reset restores the left side, `x=0.9`, visible markers, correct practice, selected interaction tab, and zero action count.

Final exact 1024x1536 validation matches the target stack: sidebar width 228, dedicated header y=96-321, tabs y=328-377, full interactive lab y=384-1468, graph/control model y=486-933, four-stage flow y=942-1043, rule/worked/misconception row y=1052-1236, practice y=1245-1450, adjacent navigation y=1475-1526, and no site footer. It reports no horizontal overflow and zero console messages.

Evidence:

- `0358-reference.png`
- `0358-desktop.png`
- `0358-dedicated-target-validation.json`

## Lesson 280 / Mockup 0359 - Limits at Infinity

Reworked individually around the coherent even rational family `f(x)=h*x^2/(1+x^2)`. The linked asymptote-height state drives the function, sampled SVG curve, dashed asymptote, both end limits, feedback, sample table, dominant-term ratio, and output cards. View-window, vertical-range, and asymptote-height dragging, six lesson tabs, fullscreen, Reset, Share, independent three-answer practice checking, hint toggle, shell Reset, and Previous/Next navigation are functional.

Browser validation starts with view window `16`, vertical range `12`, and `h=2`, deriving both end limits and horizontal asymptote as `2`. It changes the real ranges to `12` and `8`, moves the asymptote to `3.5`, and confirms both limits and the plotted line update to `3.5`. Practice rejects an asymptote answer of `2`, accepts all three values as `3`, reveals the leading-coefficient hint, and shell Reset restores every target control, blank practice, hidden hint, selected interaction tab, and zero action count.

Final exact 1009x1558 validation matches the target stack: sidebar width 205, dedicated header y=98-292, tabs y=306-348, full end-behavior lab y=362-1491, linked model y=407-894, feedback y=903-937, insight row y=946-1196, misconception y=1205-1253, practice y=1262-1460, adjacent navigation y=1501-1549, and no site footer. It reports no horizontal overflow and zero console messages.

Evidence:

- `0359-reference.png`
- `0359-desktop.png`
- `0359-dedicated-target-validation.json`

## Lesson 281 / Mockup 0360 - Continuity at a Point

Reworked individually around the target's removable-point parabola model `f(x)=2x^2`. The continuity point `a` drives the open limit point, both one-sided limits, the common limit, five condition checks, coordinate labels, domain/range summary, and continuity verdict. The independent filled function-value point can be moved with a native range control or dragged directly in the SVG, so a learner can create or repair the discontinuity instead of operating a decorative control.

Browser validation starts at `a=0`, limit `0`, and `f(0)=-1`, correctly classifying the function as not continuous. It moves `a` to `0.5`, derives the new limit `0.5`, sets `f(a)=0.5` to satisfy all continuity conditions, then performs a real upward pointer drag and confirms the function value changes to `1.5` while continuity becomes false again. Independent practice rejects `-1`, accepts `0`, and shell Reset restores the target's initial hole/filled-point state, selected tab, and zero action count.

Final exact 1024x1536 validation matches the target stack: sidebar width 255, dedicated header y=101-340, tabs y=351-391, four-stage exploration flow y=403-511, continuity lab y=521-1017, concept rule y=1027-1131, worked/misconception/practice row y=1142-1388, adjacent navigation y=1399-1443, and site footer y=1453-1536. It reports no horizontal overflow and zero console messages.

Evidence:

- `0360-reference.png`
- `0360-desktop.png`
- `0360-dedicated-target-validation.json`

## Lesson 282 / Mockup 0361 - Types of Discontinuity

Reworked individually around three simultaneous discontinuity models: a removable hole, a finite jump, and an infinite vertical-asymptote break. Each graph owns independent left/right approach state, giving six real SVG drag handles whose coordinates remain attached to the displayed curve equations. Selecting a graph updates the derived one-sided limits, function value, continuity explanation, highlighted type, and independent classification controls in the analysis panel.

Browser validation starts on the removable model with left/right markers `-1.3` and `1.3`. A real pointer drag moves the removable left marker to `-1.18`; switching to Jump derives the jump-specific panel, an intentionally wrong Removable classification is rejected by state, and Jump restores a correct classification. Selecting Infinite updates the panel and its own marker pair without altering the other graph states. Shell Reset restores all six markers, the removable selection/classification, the interaction tab, and zero action count.

Final exact 1536x1024 validation matches the target landscape stack: sidebar width 273, target breadcrumb top band, title y=72-152, tabs y=152-201, three-graph lab y=214-704, graph cards y=270-688, selected-type analysis y=214-775, comparison/rule row y=718-936, and progress navigation y=954-1012. It reports no horizontal overflow, no site footer, and zero console messages.

Evidence:

- `0361-reference.png`
- `0361-desktop.png`
- `0361-dedicated-target-validation.json`

## Lesson 283 / Mockup 0362 - Epsilon-Delta Visualiser

Reworked individually around the coherent linear proof model `f(x)=2x`, with `L=2a` and containment passing exactly when `2*delta <= epsilon`. Epsilon, delta, and `a` drive the purple output band, orange input interval, graph point, interval guides, numeric outputs, containment verdict, formula labels, and action count. Native range controls, number steppers, and captured SVG pointer dragging all update the same model; the lesson-specific practice uses its own epsilon/delta pair and the same mathematical test.

Browser validation starts at `epsilon=2`, `delta=1`, `a=1`, and `L=2` with PASS. Widening delta to `1.5` produces FAIL; widening epsilon to `3` restores PASS; moving `a` to `2` derives `L=4`. A real pointer drag changes delta from `1.5` to `1.32`. Practice rejects delta `1` for epsilon `1.6`, accepts `0.8`, and shell Reset restores both proof models, the selected interaction tab, and zero actions.

Final exact 935x1683 validation matches the target portrait stack: desktop sidebar width 205, hero y=97-309, tabs y=320-364, proof laboratory y=376-1028, four-stage guide y=1038-1147, definition/worked/misconception row y=1158-1336, practice y=1346-1506, adjacent navigation y=1516-1567, and site footer y=1580-1683. It reports no horizontal overflow, no mobile dock, and zero console messages.

Evidence:

- `0362-reference.png`
- `0362-desktop.png`
- `0362-dedicated-target-validation.json`

## Lesson 284 / Mockup 0363 - Average Rate of Change

Reworked individually around a coherent upward quadratic that passes through the target's initial secant points `A=(-3,2)` and `B=(2,3)`. Both point inputs drive the graph handles, secant, rise/run guides, coordinates, delta values, exact average-rate fraction, linked sliders, and action count. Native range controls and captured SVG pointer dragging use the same model. The worked example and independent practice calculate their own `1+x^2/4` intervals instead of copying the mockup's inconsistent practice answer.

Browser validation confirms the target initial `rise=1`, `run=5`, and rate `0.2`. Sliders move A to `-2` and B to `3`, deriving a rate of `0.8`; a real pointer drag then moves B to `1.08` and recalculates the rate to `0.224`. Practice rejects `0.400`, accepts the mathematically correct `0.500`, and shell Reset restores both graph points, target outputs, selected interaction tab, and zero actions.

Final exact 1024x1536 validation matches the target stack: sidebar width 204, hero y=91-287, tabs y=298-341, secant laboratory y=352-872, four-stage learning flow y=883-1046, rule/worked/misconception row y=1061-1230, practice y=1240-1372, adjacent navigation y=1381-1432, and site footer y=1458-1536. It reports no horizontal overflow and zero console messages.

Evidence:

- `0363-reference.png`
- `0363-desktop.png`
- `0363-dedicated-target-validation.json`

## Lesson 285 / Mockup 0364 - Instantaneous Rate of Change

Reworked individually around `f(x)=x^2`, fixed base point `A=(1,1)`, and movable point `B=(1+h,(1+h)^2)`. The shared h state drives the graph handle, secant line, tangent comparison, B coordinates, exact secant slope `2+h`, error from the derivative, selected convergence-table row, feedback, and action count. Native range input and captured SVG dragging are both real. Practice uses the corrected coherent function `x^3-2x`, making the target B answer `10` mathematically valid.

Browser validation confirms `h=0.5` gives slope `2.5`, `h=0.01` gives `2.01`, and a real pointer drag reaches `h=0.0001`, slope `2.0001`, and error `0.0001`. It toggles convergence feedback off, rejects answer `7`, accepts `10`, and shell Reset restores `h=0.05`, B `(1.05,1.1025)`, slope `2.05`, feedback, selected interaction tab, and zero actions.

Final exact 1018x1544 validation matches the target stack: sidebar width 218, hero y=91-360, tabs y=374-424, four-stage flow y=448-512, graph/table model y=529-1099, derivative/example/misconception row y=1114-1321, and practice y=1338-1515. It reports no horizontal overflow, no site footer, and zero console messages.

Evidence:

- `0364-reference.png`
- `0364-desktop.png`
- `0364-dedicated-target-validation.json`

## Lesson 286 / Mockup 0365 - Derivative From First Principles

Reworked individually around a selectable quadratic `f(x)=ax^2+bx+c`, a selectable base point `P=(x,f(x))`, and a movable secant point `P_h=(x+h,f(x+h))`. One shared state model drives the plotted curve, both points, secant and tangent lines, live difference quotient, current derivative, symbolic simplification chain, general quadratic rule, result rail, and action count. The function selector, base-point selector, native h range, captured SVG point dragging, five lesson tabs, Reset, Share, practice answer checking, alternate practice problem, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the target initial model `f(x)=2x^2+2x`, `x=0`, and `h=0.25` gives difference quotient `2.5` and limiting derivative `2`. Moving h to `0.5` gives quotient `3`; moving x to `1` gives derivative `6`; changing the model to `f(x)=x^2` gives derivative `2`. A real pointer drag reaches `h=0.01` and recomputes the quotient as `2.01`. Practice rejects an invalid expression, accepts `2x+5`, and shell Reset restores the exact target function, base point, h value, correct practice state, selected interaction tab, and zero actions.

Final exact 1024x1536 validation matches the target stack: sidebar width 208, hero y=91-317, tabs y=327-363, four-stage flow y=373-448, graph/algebra/result laboratory y=458-1140, worked/practice row y=1150-1378, adjacent navigation y=1387-1431, and site footer y=1440-1534. It reports no horizontal overflow and zero console messages.

Evidence:

- `0365-reference.png`
- `0365-desktop.png`
- `0365-dedicated-target-validation.json`

## Lesson 287 / Mockup 0366 - Tangent Line

Reworked individually around the target function `f(x)=x^2-2` and a draggable point `P=(x,f(x))`. The shared point state drives the plotted point, derivative slope `2x`, tangent geometry, slope triangle, rise/run values, point-slope equation, simplified line, coordinate labels, and action count. Native range dragging and captured SVG pointer dragging are real. The six lesson tabs, Reset, Share, independent two-coefficient practice checking, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the target initial point `P=(-1,-1)`, slope `-2`, and tangent `y=-2x-3`. Moving to `x=2` derives `P=(2,2)`, slope `4`, and intercept `-6`. A real pointer drag moves the point to approximately `x=0.74`, deriving `y=-1.45`, slope `1.48`, and intercept `-2.55`. Practice rejects slope `8`, accepts the coherent answer `y=9x-15` for `f(x)=x^3-3x+1` at `x=2`, and shell Reset restores the target point, equation, selected tab, correct practice state, and zero actions.

Final exact 1029x1528 validation matches the target stack: sidebar width 219, hero y=89-288, tabs y=297-340, tangent model and learning flow y=350-1053, rule/worked/misconception row y=1063-1320, practice y=1330-1441, and adjacent navigation y=1451-1505. It reports no horizontal overflow and zero console messages.

Evidence:

- `0366-reference.png`
- `0366-desktop.png`
- `0366-dedicated-target-validation.json`

## Lesson 288 / Mockup 0367 - Normal Line

Reworked individually around the displayed concave quadratic `f(x)=-2x^2+x`, a draggable point `P=(x,f(x))`, its derivative tangent, and the perpendicular negative-reciprocal normal. The point state drives the curve coordinate, tangent slope/equation, normal classification/slope/equation, right-angle construction, CAS panel, perpendicularity proof, and action count. The step-size range changes the local construction scale, while native x dragging and captured SVG pointer dragging move the actual point. Five lesson tabs, Reset, Share, two-field practice checking, shell Reset, Previous/Next navigation, and footer controls are functional.

Browser validation starts at `x=0.25`, deriving the coherent point `P=(0.25,0.125)`, horizontal tangent, and vertical normal. Moving to `x=1` derives `P=(1,-1)`, tangent slope `-3`, and normal slope `1/3`; changing h to `0.12` updates the construction step; a real pointer drag moves to approximately `x=0.4`, deriving tangent `-0.6` and normal `1.6667`. Practice rejects slope `-1`, accepts `m=1, b=-0.5`, and shell Reset restores x, h, equations, selected tab, blank result, and zero actions.

The reference labels `f(x)=-2x^2+x` but prints `P(0.25,0.375)`; the visible function evaluates to `0.125`. This implementation keeps the graph, coordinate, tangent, and normal mutually consistent. At the horizontal-tangent start, the normal is classified truthfully as vertical while retaining the reference's `-2500` finite rendering approximation in the equation detail.

Final exact 1024x1536 validation matches the target stack: sidebar width 218, hero y=91-276, tabs y=285-328, four-stage flow y=338-462, normal-line lab y=472-928, rule/misconception row y=938-1135, worked/practice row y=1145-1389, adjacent navigation y=1399-1442, and footer y=1451-1529. It reports no horizontal overflow and zero console messages.

Evidence:

- `0367-reference.png`
- `0367-desktop.png`
- `0367-dedicated-target-validation.json`

## Lesson 289 / Mockup 0368 - Derivative Graph

Reworked individually around one integrated cubic and its exact analytic derivative. The derivative is `f'(x)=sqrt(1/2)(x^2+x-1)`, giving the reference's golden-ratio zeros near `-1.62` and `0.62`; the integration constant is chosen so the target cursor `x=-0.64` produces `f(x)=0.70` and `f'(x)=-0.87`. One shared cursor drives both graph points, the function tangent, vertical guides, coordinate labels, derivative sign, legend values, and action count. Native cursor/scale ranges and captured SVG pointer dragging on the function graph are real; the separate function and derivative scale controls change their respective coordinate mappings.

Browser validation confirms the exact target start `x=-0.64`, `f(x)=0.70`, `f'(x)=-0.87`, and Negative sign. Moving to `x=1` derives a Positive derivative of approximately `0.71`; the independent vertical scales update from `3/6` to `5/8`; a real pointer drag moves the synchronized cursor to approximately `x=-0.07` and derives `f(x)=0.22`, `f'(x)=-0.75`. The challenge rejects interval A, accepts B (`x<-1.62` or `x>0.62`), and shell Reset restores both scales, cursor, target values, selected tab, correct challenge, and zero actions.

Final exact 1013x1553 validation matches the target stack: sidebar width 211, hero y=91-272, four-stage guide y=282-383, tabs y=393-435, synchronized graph laboratory y=445-1087, key-rule/worked/misconception/challenge row y=1097-1370, adjacent navigation y=1380-1425, and footer y=1435-1520. It reports no horizontal overflow and zero console messages.

Evidence:

- `0368-reference.png`
- `0368-desktop.png`
- `0368-dedicated-target-validation.json`

## Lesson 290 / Mockup 0369 - Higher Derivatives

Reworked individually around a selectable quartic and its exact first, second, and third analytic derivatives. One shared x state drives four graph points, four cursor guides, the function/derivative values, signs, concavity descriptions, inflection markers, worked table, and action count. Native cursor and domain inputs, three real visibility toggles, a model-changing Random example action, and captured SVG pointer dragging on every derivative level are functional. The practice has three independently editable values and checks the actual derivatives of `g(x)=2x^5-3x^4+x^2-7` at x=1.

Browser validation confirms the coherent target start `f(x)=x^4-6x^2+3` at x=0 gives `f=3`, `f'=0`, `f''=-12`, and `f'''=0`. Moving to x=1 derives `-2,-8,0,24`; changing the domain from `3.5` to `4` remaps all plots; Random example switches to `0.5x^4-4x^2+2`; a real drag on the second-derivative graph moves the shared cursor to approximately `0.12` and updates all four values. The visibility toggles remove real graph layers, practice rejects `0,0,48`, accepts the correct `0,6,48`, and shell Reset restores the initial model, domain, cursor, toggles, selected tab, blank practice result, and zero actions.

The reference mixes incompatible formulas, curves, and values: its printed quartic derivative chain gives `f'''(0)=0`, while a card states `24`, and its practice displays three zeroes as correct although direct differentiation gives `0,6,48`. This implementation keeps every graph, formula, value, interpretation, and checked answer mutually consistent.

Final exact 986x1596 validation matches the target stack: sidebar width 210, hero y=91-268, tabs y=278-318, four-graph laboratory y=328-966, derivative-meaning strip y=976-1038, chain/rule/misconception row y=1048-1208, worked/practice row y=1218-1430, adjacent navigation y=1440-1483, and footer y=1493-1584. It reports no horizontal overflow and zero console messages.

Evidence:

- `0369-reference.png`
- `0369-desktop.png`
- `0369-dedicated-target-validation.json`

## Lesson 291 / Mockup 0370 - Product Rule

Reworked individually around two editable factor expressions selected from a supported mathematical expression set. Each factor owns an actual value function and analytic derivative; their shared model drives four primary graph layers (`u`, `v`, `uv`, and `u'v+uv'`), five decomposition mini-graphs, the evaluation table, factor derivative labels, and action count. An independent central-difference derivative of the sampled product verifies the analytic product rule and reports a real error controlled by the step-size range. Domain inputs remap every graph, SVG pointer dragging changes the evaluation x, and axes/grid/legend toggles remove real layers.

Browser validation confirms the target start `u=sin(x)`, `v=x^2-2`, x=`1.2`, giving `u=0.9320`, `v=-0.5600`, and `uv=-0.5219`. The sampled derivative is `2.0322`, the analytic rule gives `2.0340`, and the finite-step error is `0.0018`. Editing the factors to `u=x`, `v=exp(x)` with step `0.01` and domain `5` derives product `3.9841` and rule value `7.3043`; a real graph drag moves x to approximately `2.1` and recomputes every value. Practice rejects the incomplete `e^x`, accepts `(x+1)e^x`, and shell Reset restores factors, x, domain, step, toggles, selected tab, target challenge, and zero actions.

The reference's initial derivative row states `1.2896`, which does not equal the derivative of its displayed product at x=`1.2`; direct product-rule evaluation gives approximately `2.0340`. This implementation keeps the graph, factor derivatives, decomposition, sampled model, analytic rule, and error mutually consistent.

Final exact 1024x1536 validation matches the target stack: sidebar width 216, hero y=91-333, tabs y=347-389, four-stage flow y=403-475, factor/graph/decomposition lab y=485-1062, rule/worked/misconception row y=1072-1305, practice y=1315-1462, and adjacent navigation y=1472-1529. It reports no horizontal overflow and zero console messages.

Evidence:

- `0370-reference.png`
- `0370-desktop.png`
- `0370-dedicated-target-validation.json`

## Lesson 292 / Mockup 0371 - Quotient Rule

Reworked individually around independently editable numerator and denominator expressions with analytic value/derivative models and denominator-zero metadata. The selected pair drives the quotient graph, optional derivative graph, vertical asymptotes, domain exclusions, movable evaluation point, tangent line, value cards, symbolic rule substitution, and action count. A central-difference slope computed from the quotient independently verifies the analytic quotient-rule slope. The x range and captured SVG pointer drag move the actual evaluation point while avoiding poles; changing to `x^2+1` removes the pole and updates the domain card in real time.

Browser validation confirms the target start `f=-(1+x^2)`, `g=x+2`, exclusion `x=-2`, x0=`0`, and y=`-0.5`, with sampled and rule slopes both `0.25`. Moving x0 to `1` derives y=`-0.6667` and slope `-0.4444`; hiding y' removes the real derivative layer; a pointer drag moves x0 to approximately `1.71`; switching the denominator to `x^2+1` removes all real exclusions and makes the quotient constantly `-1`. Practice rejects `3/(x^2+1)`, accepts `(-3x^2+2x+3)/(x^2+1)^2`, reveals the derivation, and shell Reset restores expressions, pole, point, derivative visibility, selected tab, hidden solution, blank result, and zero actions.

The reference alternates between `-0.250` and `+0.250` for the initial tangent and prints a simplified numerator with an incorrect leading sign. Direct differentiation of `-(1+x^2)/(x+2)` gives slope `+0.25` at x=0 and numerator `-x^2-4x+1`; this implementation keeps the function, graph, tangent, sampled slope, analytic rule, and evaluation cards coherent.

Final exact 1019x1543 validation matches the target stack: sidebar width 220, hero y=91-258, tabs y=268-306, four-stage flow y=316-410, quotient laboratory y=420-966, rule derivation y=976-1177, worked/misconception/practice row y=1187-1400, adjacent navigation y=1410-1460, and footer y=1469-1542. It reports no horizontal overflow and zero console messages.

Evidence:

- `0371-reference.png`
- `0371-desktop.png`
- `0371-dedicated-target-validation.json`

## Lesson 293 / Mockup 0372 - Chain Rule

Reworked individually around one shared composition pipeline `x -> g(x)=sin(x) -> f(g(x))=sin^2(x)`. The x state drives the inner value, output, inner rate `cos(x)`, outer rate `2sin(x)`, total chain rate `sin(2x)`, five visual-model cards, graph point/tangent, mini rate plots, worked numerical check, and action count. The input range and captured SVG graph dragging are real. The output range is also functional: it inverts `y=sin^2(x)` on the active principal branch to move x, rather than duplicating the input slider decoratively.

Browser validation confirms the target start x=`0.05`, inner=`0.0500`, output=`0.0025`, inner rate=`0.9988`, outer rate=`0.1000`, and total rate=`0.0998`. Moving x to `1` derives inner `0.8415`, output `0.7081`, and total rate `0.9093`; moving the output to `0.25` inversely selects x near `0.52`; a real graph drag then moves x to approximately `1.38` and updates the entire pipeline. Hint and Steps disclosures independently toggle. Practice rejects `4(3x^2+1)^3`, accepts `24x(3x^2+1)^3`, and shell Reset restores x, pipeline values, selected tab, visible hint, hidden steps, target answer state, and zero actions.

Final exact 1007x1562 validation matches the target stack: sidebar width 205, hero y=91-317, tabs y=327-372, four-stage guide y=387-475, visual pipeline y=488-730, graph/rates y=740-1033, worked/pitfall row y=1043-1331, practice y=1341-1496, and adjacent navigation y=1506-1561. It reports no horizontal overflow and zero console messages.

Evidence:

- `0372-reference.png`
- `0372-desktop.png`
- `0372-dedicated-target-validation.json`

## Lesson 294 / Mockup 0373 - Implicit Differentiation

Reworked individually around the constrained upper semicircle `x^2+y^2=9`, with `y=sqrt(9-x^2)` and implicit slope `dy/dx=-x/y`. One shared point state drives the graph handle, curve constraint, linked x/y controls, tangent line, point label, slope value and sign, horizontal/rising/falling/vertical classification, coordinates, feedback equation, and action count. The x range and captured SVG pointer dragging move the point directly. The y range is also real: it solves the curve constraint for x on the active left or right branch instead of acting as a decorative duplicate.

Browser validation confirms the target start `P=(0,3)`, slope `0`, Horizontal classification, and exact constraint value `9`. Moving x to `1` derives `y=2.828` and slope `-0.354`; moving y to `2` derives `x=2.236` and slope `-1.118`; a real pointer drag moves the curve point and recomputes every dependent value while preserving the constraint. Practice rejects `1/2`, accepts the mathematically correct `-1/2` for `2xy+y^2=5` at `(1,1)`, and shell Reset restores the point, tangent, practice state, selected tab, and zero actions.

Final exact 1024x1536 validation matches the target stack: sidebar width 205, hero y=109-255, tabs y=255-294, four-stage guide y=310-414, implicit-curve laboratory y=427-966, feedback y=978-1075, concept/rule/takeaway row y=1085-1245, worked example y=1257-1383, practice y=1391-1467, and adjacent navigation y=1479-1529. The dedicated content spans x=228-1004 exactly, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0373-reference.png`
- `0373-desktop.png`
- `0373-dedicated-target-validation.json`

## Lesson 295 / Mockup 0374 - Parametric Differentiation

Reworked individually around the displayed parameter equations `x(t)=1/4+cos(t)` and `y(t)=1/8 t^2-cos(t)+1`. One shared t state drives the actual coordinate curve, movable point, radius guide, tangent line, coordinates, `dx/dt=-sin(t)`, `dy/dt=t/4+sin(t)`, quotient slope, component-rate meters, and action count. The native t range and captured SVG pointer dragging are both real. Five lesson tabs, Reset, Share, independent multiple-choice selection, answer checking, solution disclosure, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the coherent start t=`1.25`, x=`0.5653`, y=`0.8800`, dx/dt=`-0.9490`, dy/dt=`1.2615`, and dy/dx=`-1.3293`. Moving t to `2` derives x=`-0.1661`, y=`1.9161`, and slope `-1.5499`; a real graph drag moves t to approximately `1.55` and recomputes the full model. Practice rejects A, accepts B for `dy/dx=tan(pi/4)=1`, reveals the actual derivation, and shell Reset restores t, cards, selected choice, hidden solution, blank result, selected tab, and zero actions.

The reference's initial rate `dx/dt=-0.9490` agrees with t=`1.25`, but its coordinate, `dy/dt`, and quotient cards do not agree with its printed equations or each other. Its plotted wide curve also cannot be the coordinate trace of the narrow-range displayed `x(t)=1/4+cos(t)`. This implementation keeps the printed equations, graph, coordinate, component rates, tangent, and quotient mathematically consistent.

Final exact 1024x1536 validation matches the target stack: sidebar width 220, hero y=102-340, tabs y=350-396, bordered graph-and-CAS surface y=405-1477, four-stage guide y=446-523, curve/rate lab y=531-1076, rule/worked/misconception row y=1085-1313, practice y=1322-1469, and adjacent navigation y=1486-1535. The dedicated content spans x=234-1010, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0374-reference.png`
- `0374-desktop.png`
- `0374-dedicated-target-validation.json`

## Lesson 296 / Mockup 0375 - Critical Points

Reworked individually around a continuous piecewise curve with a stationary local maximum at `(-1,2)`, a genuine nondifferentiable corner at `(0,0)`, and a stationary local minimum at `(1,-1)`. The left branch `2-2(x+1)^2` and right branch `(x-1)^2-1` meet at the origin but have different one-sided slopes. One shared x state drives the graph probe, function value, analytic derivative or DNE verdict, finite-step left/right slopes, concavity, sign-chart position, and action count. Native x and h controls and captured SVG pointer dragging are real; function, grid, and sign-chart toggles remove their actual SVG layers.

Browser validation confirms the origin has left slope `-3.9`, right slope `-1.95`, and derivative DNE at h=`0.05`. Moving to x=`-1` derives f=`2`, f'=`0`, Concave down; moving to x=`1` derives f=`-1`, f'=`0`, Concave up. Changing h to `0.1` updates the finite-step evidence; a real pointer drag moves x to approximately `1.55` and updates every live value. The function toggle removes the real curve, practice rejects B, accepts A for the critical points `x=-1,1` of `x^3-3x`, and shell Reset restores x, h, all layers, selected choice, blank result, selected tab, and zero actions.

The reference labels the origin nondifferentiable while also printing a smooth polynomial derivative that is defined there; that formula cannot produce the pictured corner or its stated classifications. This implementation preserves the target's graph shape, three candidate coordinates, classifications, and sign pattern with one mathematically valid model.

Final exact 1024x1536 validation matches the target stack: sidebar width 216, hero y=105-311, tabs y=321-368, four-stage guide y=378-516, graph/sign-chart laboratory y=526-1212, worked/misconception/challenge row y=1222-1466, and adjacent navigation y=1476-1524. The dedicated content spans x=231-1009, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0375-reference.png`
- `0375-desktop.png`
- `0375-dedicated-target-validation.json`

## Lesson 297 / Mockup 0376 - Increasing and Decreasing

Reworked individually around the target graph's coherent shape family `f(x)=(-2a/3)x^3-(8b/3)x`. At the target controls `a=-3`, `b=1`, this gives `f(x)=2x^3-(8/3)x`, critical points `x=+-2/3`, values `f(-2/3)=1.185` and `f(2/3)=-1.185`, and the displayed Increasing / Decreasing / Increasing interval pattern. The shared coefficients drive the function graph, exact derivative parabola, critical roots, draggable critical markers, interval sign labels, sign-chart table, extrema values, feedback sentence, and action count. Two real domain controls remap both graphs. Dragging the positive critical marker solves `b=-3ar^2/4`, so it edits the actual model rather than moving a decorative point.

Browser validation confirms the exact target start roots `-0.667,0.667` and interval classifications Increasing, Decreasing, Increasing. Moving `a` to `-2` and `b` to `2` derives roots `+-1.155`; changing the domain to `[-4,4]` remaps both plots; a real pointer drag moves the positive root to approximately `1.261` and solves `b=2.386`. Practice rejects an incorrect middle interval, accepts Increasing / Decreasing / Increasing for `g(x)=x^3-3x`, and shell Reset restores coefficients, domain, roots, classifications, practice state, selected tab, and zero actions.

The reference's graph labels, extrema coordinates, and interval signs require this symmetric odd cubic, while its small printed formula `-3x^3+x^2` would instead have critical points `0` and `2/9` and the opposite outer sign pattern. Its derivative curve is also drawn with the opposite opening direction from its own sign labels. This implementation preserves the dominant graph, labeled extrema, sign table, feedback, and increasing/decreasing classification with one mathematically consistent model; the printed polynomial remains as a separate worked example.

Final exact 965x1629 validation matches the target stack: sidebar width 224, hero y=98-319, tabs y=329-375, graph-and-CAS surface y=386-1557, four-stage guide y=456-528, synchronized graph lab y=542-1126, feedback y=1136-1180, rule/worked/misconception row y=1190-1350, practice y=1360-1532, and adjacent navigation y=1567-1620. The dedicated content spans x=239-951, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0376-reference.png`
- `0376-desktop.png`
- `0376-dedicated-target-validation.json`

## Lesson 298 / Mockup 0377 - Local and Global Extrema

Reworked individually around the printed quadratic `f(x)=-2x^2+4x+1` and a selectable closed interval `[a,b]`. The endpoint state drives the real function values, admissible candidate set, vertex inclusion, absolute maximum and minimum, local classification, domain, range, graph guides, interval bar, feedback, and action count. Native a/b controls and captured SVG interval-handle dragging are real. Moving the interval past x=`1` removes the vertex from the candidate set and immediately reclassifies the extrema. Five lesson tabs, Reset, Share, four-option practice checking, solution disclosure, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the coherent target interval `[-5,5]` gives endpoint values `-69` and `-29`, absolute maximum `(1,3)`, absolute minimum `(-5,-69)`, and range `[-69,3]`. Moving a to `2` excludes the vertex and makes `(2,1)` the maximum; moving the sliders to `[-4,4]` restores the vertex and derives range `[-47,3]`; a real pointer drag moves b from `4` to approximately `2.56` and recomputes every dependent value. Practice rejects B, accepts A with all tied endpoint/critical extrema for `x^3-3x` on `[-2,2]`, reveals the candidate comparison, and shell Reset restores interval, extrema, practice state, selected tab, and zero actions.

The reference prints `f(x)=-2x^2+4x+1` and vertex `(1,3)` but labels endpoint values `-34` and `-44`, which do not evaluate from that function. Its visual curve also uses normalized endpoint heights. This implementation preserves the target's normalized graph composition while every numeric card, classification, range, worked example, and checked practice answer uses exact mathematical values from the printed function.

Final exact 1024x1536 validation matches the target stack: sidebar width 208, hero y=95-285, tabs y=296-343, four-stage guide y=354-466, closed-interval lab y=478-1070, formula/worked/misconception row y=1082-1369, practice y=1381-1469, and adjacent navigation y=1478-1529. The dedicated content spans x=220-1013, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0377-reference.png`
- `0377-desktop.png`
- `0377-dedicated-target-validation.json`

## Lesson 299 / Mockup 0378 - Concavity

Reworked individually around three genuinely selectable analytic models, led by the target's printed `f(x)=-8x^4+4x^3`. Every model owns exact f, f', f'', and inflection candidates. One shared x state drives the function point, tangent, vertical cursor, second-derivative point, live values, sign, concavity verdict, and action count. The native x control and captured SVG pointer dragging are real. The h control independently computes the central finite-difference second derivative and reports its error from the analytic f'', so shrinking h produces measurable convergence rather than moving a decorative slider.

Browser validation confirms the coherent target start x=`-1.2`, h=`0.2`, f=`-23.5008`, f'=`72.576`, f''=`-167.04`, finite f''=`-167.68`, Concave down, and roots `0,0.25`. Moving x to `0.1` derives f''=`1.44` and Concave up; reducing h to `0.1` improves the approximation from `0.8` to `1.28`; switching to `x^3-3x` changes the inflection set to `0`; a real graph drag moves x to approximately `0.576` and updates all values. Practice rejects A, accepts the mathematically correct C (down for x<0, up for x>0, inflection at 0), reveals the derivation, and shell Reset restores model, x, h, practice state, selected tab, and zero actions.

The reference's initial value cards and colored f'' regions do not evaluate from its printed quartic, and its practice highlights an inflection boundary inconsistent with `x^3-3x`. This implementation preserves the target composition and printed primary function while keeping both graphs, tangent, exact values, finite approximation, sign regions, inflection roots, and checked answer mutually consistent.

Final exact 967x1627 validation matches the target stack: sidebar width 217, hero y=93-302, tabs y=316-355, graph-and-learning surface y=367-1565, linked graph workspace y=428-1038, four learning cards y=1051-1242, rule/worked/misconception row y=1254-1415, practice y=1427-1564, and adjacent navigation y=1574-1621. The dedicated content spans x=228-952, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0378-reference.png`
- `0378-desktop.png`
- `0378-dedicated-target-validation.json`

## Lesson 300 / Mockup 0379 - Inflection Points

Reworked individually around the target cubic family `f(x)=cx^3+kx^2+mx+d`, initially `f(x)=x^3-3x^2+x+2`. The four coefficient states drive the curve, exact second derivative, candidate root, point coordinate, sign map, concavity-change verdict, summary, feedback, and action count. All four native coefficient controls are real. Captured SVG pointer dragging moves the inflection point by solving `k=-3cx`, so the handle edits the underlying polynomial rather than a decorative marker. Five lesson tabs, Reset, Share, four-step practice validation, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the exact target start `c=1`, `k=-3`, `m=1`, `d=2`, inflection candidate `x=1`, point `(1,1)`, negative left second-derivative sign, positive right sign, and a true concavity change. Moving `c` to `2` derives `x=0.5`; changing `m` and `d` preserves x while changing y; a real pointer drag moves x to approximately `1.195` and solves `k=-7.171`. Setting `c=0` removes the cubic term and correctly reports no inflection point or sign change. Practice rejects incomplete work, accepts all four required derivative/sign-test steps, reveals `g''(x)=6x+2` and `IP=(-1/3,38/27)`, and shell Reset restores coefficients, point, practice state, selected tab, and zero actions.

Final exact 1024x1536 validation matches the target stack: sidebar width 220, hero y=107-331, tabs y=349-386, two-column model y=399-1066, rule/worked/misconception row y=1075-1313, practice y=1325-1466, and adjacent navigation y=1474-1529. The dedicated content spans x=234-1010, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0379-reference.png`
- `0379-desktop.png`
- `0379-dedicated-target-validation.json`

## Lesson 301 / Mockup 0380 - Optimisation

Reworked individually around the target objective `f(x)=-x^2+6x` on the closed domain `[-1,7]`. One shared x state drives the curve handle, quantity, analytic slope, central finite-difference slope, derivative/CAS output, and action count. The exact derivative determines the interior candidate `x=3`; the model separately evaluates both endpoints and compares all three candidates to derive the global maximum `f(3)=9`. The native x and h controls and captured SVG pointer dragging are real. Five lesson tabs, Reset, Share, computed challenge disclosure, shell Reset, and Previous/Next navigation are functional.

Browser validation confirms the target start `x=3`, `h=0.05`, `f(x)=9`, analytic slope `0`, finite slope `0`, best x `3`, and best value `9`. Moving x to `1` derives quantity `5` and slope `4`; moving h to `0.2` independently recomputes the finite derivative; a real pointer drag moves x to approximately `2.005` and derives quantity `8.011` and slope `1.989`. The challenge calculates the maximum of `-x^2+4x+1` on `[0,6]` as `5` at `x=2`, solution disclosure is functional, and shell Reset restores x, h, challenge state, selected tab, and zero actions.

Final exact 1015x1549 validation matches the target stack: sidebar width 210, hero y=100-322, tabs y=333-376, four-stage guide y=386-478, optimisation graph/CAS lab y=488-1173, rule/worked/misconception/challenge row y=1184-1405, adjacent navigation y=1418-1468, and compact site footer y=1479-1549. The dedicated content spans x=224-1000, with no horizontal overflow, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0380-reference.png`
- `0380-desktop.png`
- `0380-dedicated-target-validation.json`
