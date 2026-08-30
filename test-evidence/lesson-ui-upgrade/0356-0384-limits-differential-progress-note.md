# Limits and Differential Calculus target batch 0356-0384

Dedicated rebuild target: **9 of 29 lessons completed; 20 pending.**

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
| 0365 | 286 Derivative From First Principles | Pending audit | Pending |
| 0366 | 287 Tangent Line | Pending audit | Pending |
| 0367 | 288 Normal Line | Pending audit | Pending |
| 0368 | 289 Derivative Graph | Pending audit | Pending |
| 0369 | 290 Higher Derivatives | Pending audit | Pending |
| 0370 | 291 Product Rule | Pending audit | Pending |
| 0371 | 292 Quotient Rule | Pending audit | Pending |
| 0372 | 293 Chain Rule | Pending audit | Pending |
| 0373 | 294 Implicit Differentiation | Pending audit | Pending |
| 0374 | 295 Parametric Differentiation | Pending audit | Pending |
| 0375 | 296 Critical Points | Pending audit | Pending |
| 0376 | 297 Increasing and Decreasing | Pending audit | Pending |
| 0377 | 298 Local and Global Extrema | Pending audit | Pending |
| 0378 | 299 Concavity | Pending audit | Pending |
| 0379 | 300 Inflection Points | Pending audit | Pending |
| 0380 | 301 Optimisation | Pending audit | Pending |
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
