# Integral Calculus and Differential Equations target batch 0385-0412

Dedicated rebuild target: **5 of 28 lessons completed; 23 pending.**

| Mockup | Lesson                           | Dedicated object model                                                                                                     | Status                                      |
| ------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0385   | 306 Area by Rectangles           | `cubic-partition-dual-endpoint-drag-left-midpoint-right-rectangles-signed-positive-negative-sums-layer-toggles-practice`   | Reworked individually and browser-validated |
| 0386   | 307 Riemann Sums                 | `cosine-plus-two-uniform-partition-draggable-boundary-and-sample-left-midpoint-right-sum-exact-error-convergence-practice` | Reworked individually and browser-validated |
| 0387   | 308 Definite Integral            | `quadratic-oriented-area-dual-bound-drag-signed-region-decomposition-limit-swap-layer-visibility-zoom-practice`            | Reworked individually and browser-validated |
| 0388   | 309 Indefinite Integral          | `six-x-antiderivative-parabola-family-draggable-constant-linked-derivative-compare-symbolic-practice`                      | Reworked individually and browser-validated |
| 0389   | 310 Fundamental Theorem          | `accumulation-function-dual-bound-drag-selectable-integrand-area-instant-rate-ftc-symbolic-practice`                       | Reworked individually and browser-validated |
| 0390   | 311 Area Between Curves          | Pending audit                                                                                                              | Pending                                     |
| 0391   | 312 Substitution                 | Pending audit                                                                                                              | Pending                                     |
| 0392   | 313 Integration by Parts         | Pending audit                                                                                                              | Pending                                     |
| 0393   | 314 Partial Fractions            | Pending audit                                                                                                              | Pending                                     |
| 0394   | 315 Improper Integrals           | Pending audit                                                                                                              | Pending                                     |
| 0395   | 316 Numerical Integration        | Pending audit                                                                                                              | Pending                                     |
| 0396   | 317 Volume by Slicing            | Pending audit                                                                                                              | Pending                                     |
| 0397   | 318 Disc and Washer Methods      | Pending audit                                                                                                              | Pending                                     |
| 0398   | 319 Shell Method                 | Pending audit                                                                                                              | Pending                                     |
| 0399   | 320 Arc Length                   | Pending audit                                                                                                              | Pending                                     |
| 0400   | 321 Surface Area of Revolution   | Pending audit                                                                                                              | Pending                                     |
| 0401   | 322 Accumulation Functions       | Pending audit                                                                                                              | Pending                                     |
| 0402   | 323 Direction Fields             | Pending audit                                                                                                              | Pending                                     |
| 0403   | 324 Euler's Method               | Pending audit                                                                                                              | Pending                                     |
| 0404   | 325 Separable Equations          | Pending audit                                                                                                              | Pending                                     |
| 0405   | 326 First-Order Linear Equations | Pending audit                                                                                                              | Pending                                     |
| 0406   | 327 Logistic Growth              | Pending audit                                                                                                              | Pending                                     |
| 0407   | 328 Second-Order Equations       | Pending audit                                                                                                              | Pending                                     |
| 0408   | 329 Phase Plane                  | Pending audit                                                                                                              | Pending                                     |
| 0409   | 330 Equilibrium and Stability    | Pending audit                                                                                                              | Pending                                     |
| 0410   | 331 Discrete Dynamical Systems   | Pending audit                                                                                                              | Pending                                     |
| 0411   | 332 Cobweb Diagrams              | Pending audit                                                                                                              | Pending                                     |
| 0412   | 333 Chaos and Bifurcation        | Pending audit                                                                                                              | Pending                                     |

## Lesson 306 / Mockup 0385 - Area by Rectangles

Reworked individually around the target's printed cubic `f(x)=x^3/4-x+1`. The linked interval endpoints, rectangle count, and left/midpoint/right sampling type drive the exact partition width, sample points, generated SVG rectangles, signed sum, positive and negative decompositions, summary cards, CAS antiderivative, and action count. The native endpoint/count controls and captured SVG endpoint dragging are real. Rectangle, curve, axes, and grid checkboxes remove their actual graph layers. Five lesson tabs, Reset, Share, increment/decrement controls, numerical practice validation, shell Reset, and target tool buttons are functional.

Browser validation confirms the target controls `a=-1`, `b=6`, `n=12`, right sampling, `dx=7/12`, and the coherent sum `84.963108`. Changing to `[-2,3]`, `n=24`, midpoint sampling derives `dx=0.208333` and sum `6.555718`; a real pointer drag moves a to approximately `-1.485806` and recomputes the partition and sum. All four graph layers toggle off. Practice rejects `6`, accepts the exact midpoint approximation `6.555718`, and shell Reset restores endpoints, count, sampling type, layers, solved target practice state, selected tab, and zero actions.

The reference prints this cubic but draws a differently scaled curve with negative rectangles at the left endpoint and labels the initial sum `12.0625`, which does not evaluate from the function, interval, count, or right-sampling rule. This implementation preserves the target composition and controls while keeping the displayed function, antiderivative, generated curve, rectangle heights, signed decomposition, worked example, and checked practice value mathematically consistent.

Final exact 1024x1536 validation matches the target stack: sidebar width 211, hero y=101-239, tabs y=251-286, rectangle/CAS lab y=286-996, four learning cards y=1012-1232, and rule/worked/misconception/practice row y=1248-1508. The dedicated content spans x=226-1008, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0385-reference.png`
- `0385-desktop.png`
- `0385-dedicated-target-validation.json`

## Lesson 307 / Mockup 0386 - Riemann Sums

Reworked individually around the target's printed function `f(x)=cos(x)+2` on `[-pi,pi]`. The rectangle count and left/midpoint/right sample selector drive the exact partition width, sample points, generated SVG rectangles, Riemann sum, exact integral, absolute error, percentage error, and convergence panel. A captured partition-boundary drag changes the actual partition count, while dragging the first sample point continuously changes its relative position within every subinterval and resolves to left, midpoint, right, or custom sampling. The rectangle checkbox removes the generated rectangle layer. Five lesson tabs, Reset, Share, Workspace, Tutorial, full-screen, practice validation, Show steps, solution reveal, shell Reset, and action counting are functional.

Browser validation confirms the target initial state `n=8`, left sampling, sum `12.566371`, and exact integral `4pi=12.566371`. Changing to `n=12` and midpoint sampling recomputes the model. A real boundary drag changes `n` to 6, and a real sample-point drag changes the sampling position from midpoint to right. Practice rejects an incorrect response, accepts the midpoint sum `0.328125` for `x^2` on `[0,1]` with `n=4`, and reveals the derivation; both local and shell Reset restore all initial state.

The reference labels the initial left sum as `13.65738` with error `1.09101`, but a uniform left, midpoint, or right sum for `cos(x)+2` over the complete period `[-pi,pi]` is exactly `4pi` for this partition. The dedicated surface preserves the target's function, interval, chart composition, controls, and result hierarchy while keeping the generated rectangles and all calculations mathematically consistent.

Final exact 1007x1562 capture matches the target stack: sidebar width 208, hero y=95-322, tabs y=329-378, learning flow y=385-456, interactive lab y=464-985, rule y=990-1160, worked example y=1161-1321, practice y=1327-1502, and adjacent lessons y=1510-1555. Dedicated content spans x=233-993, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0386-reference.png`
- `0386-desktop.png`
- `0386-dedicated-target-validation.json`

## Lesson 308 / Mockup 0387 - Definite Integral

Reworked individually around the target's printed quadratic `f(x)=-(x-1)(x+3)=-x^2-2x+3`. The lower and upper limits drive the analytic antiderivative, net oriented integral, root-aware positive/negative region split, generated SVG shading, draggable bound handles, result summary, and explanation card. Both native range controls and captured direct graph dragging are real. Swap limits reverses the orientation and signs. Axes, grid, curve, areas, and labels independently remove their actual SVG layers; zoom in/out and Fit change the graph domain. Five lesson tabs, Reset, Share, Workspace, full-screen, multiple-choice practice validation, shell Reset, and action counting are functional.

Browser validation confirms the coherent initial values `a=-4`, `b=4`, positive contribution `32/3`, negative contribution `-88/3`, and total `-56/3=-18.666667`. Changing the bounds to `[-3,2]` gives `25/3`; a real pointer drag moves the lower bound to approximately `-1.998447` and recomputes every region. Swapping those limits changes the total from `6.662005` to `-6.662005` and reverses each oriented piece. Curve and area layers disappear, zoom changes to `1.1`, practice rejects `-2` and accepts `20/3`, and both local and shell Reset restore all initial state.

The reference prints this quadratic but labels the initial integral `-0.50`, positive area `4.50`, and negative pieces `-0.50` and `-4.50`; those values do not evaluate from the displayed function and bounds. Its practice options also omit the actual value `20/3`. The dedicated surface preserves the target layout, graph shape, roots, controls, and signed-area teaching sequence while keeping the curve, regions, antiderivative, breakdown, worked example, and checked practice answer mathematically consistent.

Final exact 999x1575 validation matches the target stack: sidebar width 218, hero y=104-327, tabs y=335-378, oriented-area lab y=386-1060, worked/misconception/tip section y=1068-1393, and practice y=1401-1538. Dedicated content spans x=232-985, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0387-reference.png`
- `0387-desktop.png`
- `0387-dedicated-target-validation.json`

## Lesson 309 / Mockup 0388 - Indefinite Integral

Reworked individually around the target's derivative `f(x)=6x` and antiderivative family `F(x)=3x^2+C`. The native constant slider, numeric constant input, five quick picks, and captured vertical graph drag all drive the same real `C` state. That state moves the selected parabola and drag handle, updates the current antiderivative and derivative confirmation, and positions the optional comparison point while leaving the linked derivative graph unchanged. Seven lesson tabs, Reset, Share, Workspace, full-screen, compare/hide comparison, symbolic practice validation, Hint, shell Reset, adjacent lessons, action counting, and the target-specific compact footer are functional.

Browser validation confirms the initial `C=0` family. The slider changes `C` to 2, the numeric input changes it to `-1.5`, and a real pointer drag changes it to `0.25`. Quick pick 3, point comparison, and the Formulas & rules tab produce their corresponding states. Practice rejects `x^2`, accepts `x^2+C`, and reveals the power-rule hint. Both local and shell Reset restore `C=0`, Explore, hidden comparison, empty practice, hidden hint, and zero shell actions.

Final exact 1024x1536 capture matches the target stack: sidebar width 214, hero content y=101-349, seven tabs y=349-399, four-step concept flow y=415-537, antiderivative/derivative family lab y=551-1156, four learning cards y=1170-1394, adjacent lessons y=1410-1457, and compact footer y=1470-1536. Dedicated content spans x=234-1001, with no horizontal overflow, no duplicate shared lesson chrome or shared adjacent navigation, and zero console messages.

Evidence:

- `0388-reference.png`
- `0388-desktop.png`
- `0388-dedicated-target-validation.json`

## Lesson 310 / Mockup 0389 - Fundamental Theorem

Reworked individually as an accumulation-function lab linking `A(x)=integral[a,x] f(t)dt` to `A'(x)=f(x)`. The upper and lower bound sliders, captured direct graph drag, and selectable cubic/quadratic/sine integrands drive the analytic antiderivative, signed accumulated area, instantaneous rate, generated SVG curve and shading, control readouts, process strip, and model verification. Six lesson tabs, Reset, Share, Workspace, full-screen, two-field symbolic practice, Hint, shell Reset, adjacent lessons, and action counting are functional.

Browser validation confirms the coherent initial cubic state `x=2.5`, `a=-1`, `A(x)=0.546875`, and `f(x)=2.708333`. Slider changes to `x=4`, `a=0` give `A(x)=13.333333` and `f(x)=17.333333`; a real pointer drag from the visible `x=2.5` handle moves it to `1.75` and recomputes `A(x)=-0.749674`, `f(x)=0.036458`. Selecting `f(t)=t^2-2` updates the same state to `A(x)=-1.713542`, `f(x)=1.0625`. Practice rejects an incomplete antiderivative, accepts `2/3x^3-3/2x^2+x` with derivative `2x^2-3x+1`, and reveals the hint. Local and shell Reset restore the complete initial model.

The reference prints `f(t)=(1/3)t^3-t`, `a=-1`, and `x=2.5` but labels `A(x)=1.6276` and `f(x)=3.8542`; those totals do not evaluate from the displayed function and bounds. The dedicated surface preserves the target accumulation/instant-rate composition and controls while keeping the antiderivative, shaded interval, worked derivation, model verification, and checked practice mathematically consistent.

Final exact 1024x1536 validation matches the target stack: sidebar width 222, hero y=102-318, tabs y=329-368, accumulation lab y=376-969, theorem/intuition y=981-1121, worked/misconception y=1129-1321, quick check y=1331-1463, and adjacent lessons y=1472-1519. Dedicated content spans x=241-1007, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0389-reference.png`
- `0389-desktop.png`
- `0389-dedicated-target-validation.json`
