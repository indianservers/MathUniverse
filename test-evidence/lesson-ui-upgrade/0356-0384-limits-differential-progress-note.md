# Limits and Differential Calculus target batch 0356-0384

Dedicated rebuild target: **4 of 29 lessons completed; 25 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0356 | 277 Informal Limits | `removable-hole-two-sided-approach-draggable-markers-linked-table-limit-practice` | Reworked individually and browser-validated |
| 0357 | 278 One-Sided Limits | `piecewise-one-sided-approach-independent-sliders-trace-verdict` | Reworked individually and browser-validated |
| 0358 | 279 Infinite Limits | `rational-vertical-asymptote-one-sided-infinite-approach-sign-domain-practice` | Reworked individually and browser-validated |
| 0359 | 280 Limits at Infinity | `even-rational-end-behavior-horizontal-asymptote-linked-view-dominant-terms-practice` | Reworked individually and browser-validated |
| 0360 | 281 Continuity at a Point | Pending audit | Pending |
| 0361 | 282 Types of Discontinuity | Pending audit | Pending |
| 0362 | 283 Epsilon-Delta Visualiser | Pending audit | Pending |
| 0363 | 284 Average Rate of Change | Pending audit | Pending |
| 0364 | 285 Instantaneous Rate of Change | Pending audit | Pending |
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
