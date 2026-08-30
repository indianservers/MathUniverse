# Limits and Differential Calculus target batch 0356-0384

Dedicated rebuild target: **2 of 29 lessons completed; 27 pending.**

| Mockup | Lesson | Dedicated object model | Status |
|---|---|---|---|
| 0356 | 277 Informal Limits | `removable-hole-two-sided-approach-draggable-markers-linked-table-limit-practice` | Reworked individually and browser-validated |
| 0357 | 278 One-Sided Limits | `piecewise-one-sided-approach-independent-sliders-trace-verdict` | Reworked individually and browser-validated |
| 0358 | 279 Infinite Limits | Pending audit | Pending |
| 0359 | 280 Limits at Infinity | Pending audit | Pending |
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
