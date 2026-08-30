# Integral Calculus and Differential Equations target batch 0385-0412

Dedicated rebuild target: **21 of 28 lessons completed; 7 pending.**

| Mockup | Lesson                           | Dedicated object model                                                                                                     | Status                                      |
| ------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0385   | 306 Area by Rectangles           | `cubic-partition-dual-endpoint-drag-left-midpoint-right-rectangles-signed-positive-negative-sums-layer-toggles-practice`   | Reworked individually and browser-validated |
| 0386   | 307 Riemann Sums                 | `cosine-plus-two-uniform-partition-draggable-boundary-and-sample-left-midpoint-right-sum-exact-error-convergence-practice` | Reworked individually and browser-validated |
| 0387   | 308 Definite Integral            | `quadratic-oriented-area-dual-bound-drag-signed-region-decomposition-limit-swap-layer-visibility-zoom-practice`            | Reworked individually and browser-validated |
| 0388   | 309 Indefinite Integral          | `six-x-antiderivative-parabola-family-draggable-constant-linked-derivative-compare-symbolic-practice`                      | Reworked individually and browser-validated |
| 0389   | 310 Fundamental Theorem          | `accumulation-function-dual-bound-drag-selectable-integrand-area-instant-rate-ftc-symbolic-practice`                       | Reworked individually and browser-validated |
| 0390   | 311 Area Between Curves          | `selectable-top-bottom-curves-editable-domain-draggable-slice-generated-vertical-slices-area-integration-practice`         | Reworked individually and browser-validated |
| 0391   | 312 Substitution                 | `branch-aware-x-to-u-substitution-du-scaling-dual-bound-drag-linked-graphs-transformed-integral-practice`                  | Reworked individually and browser-validated |
| 0392   | 313 Integration by Parts         | `reverse-product-rule-selectable-u-dv-computed-du-v-draggable-evaluation-finite-difference-residual-symbolic-practice`     | Reworked individually and browser-validated |
| 0393   | 314 Partial Fractions            | `factored-rational-coefficient-solver-asymptotes-draggable-probe-component-overlay-recombination-antiderivative-practice`  | Reworked individually and browser-validated |
| 0394   | 315 Improper Integrals           | `symmetric-improper-integral-truncation-tail-error-draggable-bounds-convergence-practice`                                  | Reworked individually and browser-validated |
| 0395   | 316 Numerical Integration        | `three-method-quadrature-generated-midpoint-trapezoid-simpson-overlays-exact-errors-draggable-partition-practice`          | Reworked individually and browser-validated |
| 0396   | 317 Volume by Slicing            | `sphere-cross-section-slice-position-thickness-area-parabola-draggable-band-differential-volume-exact-integral-practice`   | Reworked individually and browser-validated |
| 0397   | 318 Disc and Washer Methods      | `washer-region-axis-piecewise-radii-slice-thickness-layer-controls-draggable-bound-accumulated-volume-symbolic-practice`    | Reworked individually and browser-validated |
| 0398   | 319 Shell Method                 | `cylindrical-shell-radius-height-thickness-area-draggable-strip-volume-accumulation-bounds-practice`                       | Reworked individually and browser-validated |
| 0399   | 320 Arc Length                   | `parabola-domain-polyline-segments-draggable-ds-triangle-exact-arc-integral-error-practice`                                | Reworked individually and browser-validated |
| 0400   | 321 Surface Area of Revolution   | `generating-curve-revolved-surface-mesh-axis-bounds-draggable-differential-ring-animation-surface-integral-practice`       | Reworked individually and browser-validated |
| 0401   | 322 Accumulation Functions       | `linked-integrand-accumulation-function-generated-midpoint-rectangles-draggable-x-animation-ftc-derivative-prediction`     | Reworked individually and browser-validated |
| 0402   | 323 Direction Fields             | `direction-field-generated-local-slopes-exact-solution-family-draggable-seeds-slope-triangle-prediction`                   | Reworked individually and browser-validated |
| 0403   | 324 Euler's Method               | `forward-euler-generated-steps-slope-field-exact-solution-draggable-initial-condition-live-table-errors-animation-practice` | Reworked individually and browser-validated |
| 0404   | 325 Separable Equations          | `draggable-variable-separation-dual-antiderivatives-combined-constant-solution-family-k-graph-practice`                    | Reworked individually and browser-validated |
| 0405   | 326 First-Order Linear Equations | `integrating-factor-pipeline-generated-slope-field-forcing-transient-solution-coefficient-controls-residual-verification-export` | Reworked individually and browser-validated |
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

## Lesson 311 / Mockup 0390 - Area Between Curves

Reworked individually as a bounded-region and vertical-slice explorer. Selectable top curves (parabola, semicircle, tent), bottom curves (zero, line, negative constant), editable interval endpoints, native inspection-slice and slice-count sliders, and a captured direct slice drag all drive the same object model. The model generates both curves, the region polygon, every visible vertical slice, the inspection segment, top/bottom/height readouts, midpoint area integration, selected-method formula, and conceptual panels. Six tabs, Reset, Share, Workspace, full-screen, two-expression practice validation, Hint, shell Reset, adjacent lessons, action counting, and the target-specific footer are functional.

Browser validation confirms the coherent initial parabola/zero region on `[-sqrt(12),sqrt(12)]`, 100 slices, inspection at 0, height 4, and numerical area `18.476132`. Editing the interval to `[-3,3]`, moving the native inspection slider to 1, and selecting 40 slices gives area `18.00375`. A real pointer drag moves the inspection slice to approximately `2.068711` and updates its height. Switching to the tent over `x/4` produces area 15 and updated live slice values. Practice rejects the wrong sign, accepts `1-x^2/4` over `0`, and reveals the hint. Local and shell Reset restore the full initial model.

The reference prints `f(x)=-(1/3)x^2+4` over its roots but labels the full symmetric region as `9.2376`, exactly half the actual area. The coherent result is `32sqrt(3)/3`, approximately `18.4752`; the generated graph, numerical sum, and worked answer use that full region. The target's teaching composition and controls remain intact without reproducing the arithmetic error.

Final exact 959x1639 capture matches the target stack: sidebar width 208, hero y=105-300, tabs y=309-348, lesson flow y=357-444, bounded-region lab y=456-986, concept cards y=993-1191, worked example y=1198-1365, practice y=1375-1491, adjacent lessons y=1499-1549, and footer y=1560-1639. Dedicated content spans x=224-939, with no horizontal overflow, no shared mobile dock or menu trigger, no duplicate lesson chrome, and zero console messages.

Evidence:

- `0390-reference.png`
- `0390-desktop.png`
- `0390-dedicated-target-validation.json`

## Lesson 312 / Mockup 0391 - Substitution

Reworked individually as a bidirectional x-space/u-space substitution mapper. Selectable substitutions (`x^2`, `3x+1`, `sin(x)`), exact/half/double differential scaling, editable x-bounds, and captured direct graph-bound dragging drive the original integrand, mapped bounds, orientation status, transformed integrand, numerical integral, both linked SVG graphs, shaded x-region, and u-bound guides. The model detects the turning point of `u=x^2` and splits intervals that cross zero into two monotone oriented branches. Five tabs, Reset, Share, Workspace, Clear all, practice choices, solution feedback, shell Reset, adjacent lessons, action counting, and the target-specific footer are functional.

Browser validation confirms the initial `u=x^2`, exact differential, `[-1,1]` state is split at zero and evaluates to 0. Editing the bounds to `[0.2,1.5]` maps to `[0.04,2.25]`, preserves orientation, and evaluates to `0.738085`. A real pointer drag moves the lower bound to approximately `0.752047`, producing mapped lower bound `0.565575` and integral `0.242172`. Switching to `u=3x+1` with half differential recomputes mapped bounds and integral `-0.295621`. Practice rejects `cos(x^2)+C`, accepts `-cos(x^2)+C`, and shows the matching `du=2x dx` solution. Local and shell Reset restore the complete initial mapper.

The reference maps `u=x^2` across `[-1,1]` directly to `[1,1]` while also claiming a single reversed order. Since `x^2` is not one-to-one across that interval, a valid substitution must split at zero; treating `[1,1]` as one transformed interval would erase both oriented branches. The dedicated lesson preserves the target mapper UI while making the branch logic, transformed integral, and result mathematically valid.

Final exact 1024x1536 capture matches the target stack: sidebar width 214, hero/core-rule y=98-303, tabs y=313-352, learning flow y=366-472, substitution mapper y=483-1110, worked/misconception/practice cards y=1118-1354, adjacent lessons y=1364-1412, and footer y=1422-1532. Dedicated content spans x=230-1008, with no horizontal overflow, no duplicate shared lesson chrome, no shared footer, and zero console messages.

Evidence:

- `0391-reference.png`
- `0391-desktop.png`
- `0391-dedicated-target-validation.json`

## Lesson 313 / Mockup 0392 - Integration by Parts

Reworked individually as a reverse-product-rule verifier. Selectable `u` (`x`, `x^2`, `1`) and `dv` (`e^x dx`, `cos(x) dx`, `dx`) compute the corresponding `du` and `v`, product `F=uv`, analytic derivative terms `u'v` and `uv'`, reconstructed derivative, finite-difference derivative, and residual. The evaluation slider and captured direct graph-point drag drive both colored terms, the product-rule graph, output summary, and validation strip; the `h` slider changes the actual central-difference check. Five tabs, Reset, Share, Workspace, full-screen, symbolic practice validation, Show steps, shell Reset, adjacent lessons, action counting, and the target footer are functional.

Browser validation confirms initial `u=x`, `dv=e^x dx`, `x=0`, `h=0.05`, analytic derivative 1, numerical derivative `1.00125026`, and residual `0.001250260438`. Selecting `u=x^2`, `x=1`, and `h=0.01` gives analytic derivative `3e=8.15484549`; a real pointer drag moves x to approximately `1.42387671` and recomputes both terms and residual. Switching `dv` to `cos(x) dx` gives analytic derivative `3.1138718` and numerical derivative `3.11374064`. Practice rejects the wrong sign, accepts `e^x(x^2-2x+2)+C`, and reveals the repeated-parts step. Local and shell Reset restore the full initial verifier.

Final exact 970x1622 capture matches the target stack: sidebar width 197, hero y=89-301, tabs y=310-362, numbered flow y=373-437, reverse-product-rule lab y=447-1182, rule/worked/misconception cards y=1191-1351, practice y=1361-1452, adjacent lessons y=1463-1511, and footer y=1522-1615. Dedicated content spans x=208-960, with no horizontal overflow, no duplicate shared lesson chrome, no shared footer, and zero console messages.

Evidence:

- `0392-reference.png`
- `0392-desktop.png`
- `0392-dedicated-target-validation.json`

## Lesson 314 / Mockup 0393 - Partial Fractions

Reworked individually as a rational-function decomposition and verification workspace. The canonical target factors define `f(x)=1/[(x+2)(x+4)]`, whose solved decomposition is `-1/[2(x+4)]+1/[2(x+2)]`. Clear coefficients and Solve coefficients alter the real solved state. The x slider and captured direct graph-probe drag evaluate the original and split forms; zoom changes the plotted domain, while the asymptote and decomposition-overlay checkboxes remove their actual SVG layers. The live panel reports domain validity, both evaluations, and recombination match. Six tabs, Reset, Share, coefficient workflow, termwise logarithmic antiderivative, three-field practice validation, shell Reset, adjacent lessons, and action counting are functional.

Browser validation confirms the initial x=0 values `f(0)=0.125`, split value `0.125`, and exact match. Clearing removes solved coefficients; Solve coefficients restores them. At x=-3 and zoom 2, both forms evaluate to -1. A real pointer drag moves the probe to approximately `-2.35158462`, where both forms evaluate to `-1.72545436`. Asymptotes and overlay turn off, and the Formulas tab activates. Practice rejects swapped coefficients and accepts `A=2`, `B=1`, `2ln|x-1|+ln|x+2|`. Local and shell Reset restore the full initial workspace.

The reference's coefficient cards show `A=-1/2`, `B=1/2`, which are correct for the preset function `1/[(x+2)(x+4)]`. Its displayed expanded numerator instead describes an improper rational function that would require polynomial division and different residual coefficients. The dedicated lesson preserves the intended factors, graph, coefficients, logarithmic antiderivative, and recombination as one mathematically consistent model.

Final exact 1024x1536 capture matches the target stack: sidebar width 207, hero/learning flow y=104-341, tabs y=353-399, decomposition workspace y=410-1160, worked/misconception/practice cards y=1172-1447, and adjacent lessons y=1458-1517. Dedicated content spans x=223-1008, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0393-reference.png`
- `0393-desktop.png`
- `0393-dedicated-target-validation.json`

## Lesson 315 / Mockup 0394 - Improper Integrals

Reworked individually as a symmetric-tail truncation laboratory. The target Cauchy model `f(x)=1/(1+x^2)` uses a shared truncation parameter `c` across the two native sliders and the captured direct SVG-bound drag. Every change recomputes the shaded finite region, bound guides, accumulated area `2 arctan(c)`, finite total `pi`, and remainder outside `[-c,c]`. The tail-range control changes the actual graph domain. Selecting the Laplace or Gaussian model changes the plotted function, analytic or Simpson-computed truncated area, limiting total, remainder, formula, and convergence feedback. Five tabs, Reset, Share, Workspace, function selection, checked practice, Hint, shell Reset, adjacent lessons, action counting, and the target compact footer are functional.

Browser validation confirms the target initial state `c=2`, tail range 8, accumulated area `2.21429744`, total `3.14159265`, and remainder `0.92729522`. Native controls change to `c=4`, range 12, and the Gaussian model, producing accumulated area `1.77245382`, total `1.77245385`, and remainder approximately `3e-8`. A real pointer drag moves the visible bound to approximately `c=3.49725328` and recomputes accumulated area `2.58457843` and remainder `0.55701422`. Practice rejects "converges to 0", accepts "converges to 1", and reveals the limiting antiderivative; local and shell Reset restore the complete reference-visible state.

Final exact 998x1575 capture matches the target stack: sidebar width 196, hero y=94-277, tabs y=288-327, improper-integral lab y=338-918, rule/misconception y=929-1102, worked/practice y=1113-1415, adjacent lessons y=1426-1474, and compact footer y=1483-1574. Dedicated content spans x=211-983, with no horizontal overflow, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0394-reference.png`
- `0394-desktop.png`
- `0394-dedicated-target-validation.json`

## Lesson 316 / Mockup 0395 - Numerical Integration

Reworked individually as a simultaneous three-method quadrature comparison. Selectable wave, quadratic, and exponential-decay functions combine with three interval presets and an enforced-even subinterval count. One shared partition generates midpoint rectangles, trapezoids, Simpson parabolic arcs, sample points, step size, all three estimates, analytic reference value, absolute errors, and displayed convergence orders. The n slider and captured direct partition-boundary drag alter the actual partition and recompute every output. The three legend controls remove their corresponding SVG geometry rather than changing decorative state. Five tabs, Reset, Share, Workspace, worked example, formulas, three independently validated practice answers, shell Reset, adjacent lessons, and action counting are functional.

Browser validation confirms the coherent initial model `f(x)=sin(x)+0.3cos(2x)` on `[0,pi]`, `n=8`, `dx=pi/8`, exact integral 2, midpoint estimate `2.0129090856`, trapezoidal estimate `1.9742316019`, and Simpson estimate `2.0002691699`. Selecting `f(x)=x^2` on `[0,1]` with `n=16` produces midpoint `0.3330078125`, trapezoidal `0.333984375`, and Simpson exactly `1/3`. Midpoint and Simpson layers hide independently. A real pointer drag changes n from 8 to 4 and recomputes all three estimates. Practice rejects three zero answers and accepts midpoint `1.0028615`, trapezoidal `0.9942819`, and Simpson `1.0000263` for `sin(x)` on `[0,pi/2]` with `n=6`, reaching 3/3. Local and shell Reset restore the complete initial state.

The reference displays `f(x)=sin(x)+0.3cos(2x)` on `[0,pi]` but labels the exact integral `1.9543978640`; the displayed function integrates to exactly 2 because the cosine term contributes zero over that interval. The dedicated surface preserves the target's function, interval, method comparison, overlays, and information hierarchy while keeping the analytic reference, estimates, error table, and generated curve mathematically consistent.

Final exact 1024x1536 capture matches the target stack: sidebar width 215, hero y=92-270, tabs y=277-312, one-view concept band y=319-514, comparison lab y=521-908, learning flow y=915-1015, formulas y=1022-1176, worked/misconception band y=1183-1361, practice y=1368-1493, and adjacent lessons y=1500-1536. Dedicated content spans x=228-1011, with no horizontal overflow, no overlapping practice controls, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0395-reference.png`
- `0395-desktop.png`
- `0395-dedicated-target-validation.json`

## Lesson 317 / Mockup 0396 - Volume by Slicing

Reworked individually as a sphere cross-section and differential-volume laboratory. The shared slice position x and thickness dx drive the generated solid preview, orange cross-section, area-parabola band, both primary sliders, both linked learning-card sliders, instant area `A(x)=pi(9-x^2)`, differential volume `dV=A(x)dx`, and the exact total `36pi`. The area band is directly draggable. A real Actions menu centers the slice, changes thickness, or restores the preview. Five tabs, Reset, Share, Workspace/full-screen, exact rule, worked example, misconception diagram, multiple-choice practice validation, shell Reset, adjacent lessons, compact footer, and action counting are functional.

Browser validation confirms the initial `x=0.8`, `dx=0.1`, area `26.26371458`, differential volume `2.62637146`, and total volume `113.09733553`. Native controls change to `x=-1.5`, `dx=0.2`, producing area `21.20575041` and differential volume `4.24115008`. The action menu centers the slice and changes dx to 0.2, producing maximal area `9pi` and `dV=1.8pi`. A real pointer drag moves the visible graph band to approximately `x=-0.72807018` and recomputes area `26.60901903` and differential volume `2.6609019`. Practice rejects `16pi/3` and accepts the exact sphere volume `256pi/3`; local and shell Reset restore the complete initial state.

The reference's initial instant values `A(0.8)=7.226` and `dV=0.7226` do not follow its displayed `A(x)=pi(9-x^2)`; the coherent values are approximately `26.2637` and `2.6264`. Its practice displays `A(x)=pi(16-x^2)` on `[-4,4]` but omits the actual integral `256pi/3` from the answer choices. The dedicated surface preserves the target model, controls, information hierarchy, and orange cross-section while keeping every formula, graph, instant value, worked result, and checked practice answer mathematically consistent.

Final exact 1024x1536 capture matches the target stack: sidebar width 215, hero y=98-294, tabs y=301-350, slicing lab y=356-838, learning flow y=845-991, rule/worked/misconception cards y=998-1243, practice y=1249-1362, adjacent lessons y=1368-1425, and compact footer y=1435-1526. Dedicated content spans x=231-1010, with no horizontal overflow, no clipped mini diagrams, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0396-reference.png`
- `0396-desktop.png`
- `0396-dedicated-target-validation.json`

## Lesson 318 / Mockup 0397 - Disc and Washer Methods

Reworked individually as a region-to-washer and volume-accumulation workspace. The default region `y=3sqrt(x)`, `y=0` on `[0,9]` revolves around the x-axis, giving outer radius `R(x)=3sqrt(x)`, inner radius 0, washer area `9pi x`, differential volume `A(x)dx`, accumulated volume `9pi x^2/2`, and full volume `729pi/2`. The slice position and thickness drive the region graph, orange slice, washer cross-section, radii cards, instant area, differential volume, accumulation slider, and progress. The captured graph handle is directly draggable. Outer radius, inner radius, washer, and bounds controls remove their actual SVG layers. The rotation-axis selector is real: choosing `y=1` computes the piecewise radii and numerically accumulates that washer model. Six tabs, Reset, Share, Workspace, formula/example/misconception cards, symbolic practice validation, Hint, shell Reset, adjacent lessons, and action counting are functional.

Browser validation confirms the default `x=4`, `dx=0.1`, `R=6`, `r=0`, area `113.09733553`, differential volume `11.30973355`, accumulated volume `226.19467106`, total volume `1145.11052223`, and progress `44.44444444%`. With axis `y=1`, `x=0.05`, and `dx=0.2`, the model produces outer radius 1, inner radius `0.32917961`, area `2.80117214`, differential volume `0.56023443`, and accumulated volume `0.10515221`. Outer, washer, and bounds layers hide independently. A real pointer drag moves the default slice to approximately `x=5.94908944` and recomputes every radius, area, differential, and accumulated value. Practice rejects `32pi/15`, accepts `512pi/15`, and reveals the hint. Local and shell Reset restore the complete initial state.

The reference labels the accumulated volume at `x=4` as `62.712`, but integrating its own area `A(x)=9pi x` from 0 to 4 gives `72pi`, approximately `226.195`. It labels the full volume as `81pi/2`, but integrating from 0 to 9 gives `729pi/2`. Its practice placeholder suggests `32pi/15`, while `pi integral[-2,2](4-x^2)^2 dx = 512pi/15`. The dedicated surface preserves the target region, washer visualization, controls, and hierarchy while keeping the formulas, radii, accumulation, worked result, and checked practice answer mathematically consistent.

Final exact 1024x1536 capture matches the target stack: sidebar width 223, hero y=102-292, learning flow y=303-381, tabs y=393-432, washer lab y=442-1133, formula/example/misconception cards y=1143-1353, practice y=1362-1464, and adjacent lessons y=1473-1524. Dedicated content spans x=243-1006, with no horizontal overflow, no overlapping controls, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0397-reference.png`
- `0397-desktop.png`
- `0397-dedicated-target-validation.json`

## Lesson 319 / Mockup 0398 - Shell Method

Reworked individually as a cylindrical-shell construction and accumulation workspace. The target region `y=-x+4`, `x=0`, `y=0` on `[0,4]` revolves around the y-axis. The shell position and thickness drive the vertical strip, generated cylindrical shell, radius `r=x`, height `h=4-x`, lateral area `2pi x(4-x)`, differential volume, accumulated exact integral, progress, and purple solid preview. The graph handle is directly draggable. Six tabs, Reset, Share, Workspace/full-screen, complete worked solution, misconception comparison, checked bounds practice, Show solution, shell Reset, and action counting are functional.

Browser validation confirms the initial `x=1.2`, `dx=0.1`, radius `1.2`, height `2.8`, shell area `21.11150263`, differential volume `2.11115026`, accumulated volume `14.47645895`, and full volume `64pi/3 = 67.02064328`. Native controls change to `x=2`, `dx=0.2`, producing height 2, area `8pi = 25.13274123`, differential volume `1.6pi = 5.02654825`, and accumulated volume `32pi/3 = 33.51032164`. A real pointer drag moves the visible shell to approximately `x=2.24851084` and recomputes every linked value. Practice rejects `[1,2]`, accepts `[0,3]`, scores 5/5, and reveals the exact setup; local and shell Reset restore the complete initial model.

The reference displays accumulated volume `14.346` at `x=1.2`, but evaluating its own printed integral `integral[0,1.2] 2pi t(4-t) dt` gives `14.47645895`. The dedicated surface preserves the target model, controls, shell geometry, composition, and exact full volume while keeping the partial accumulation mathematically consistent.

Final exact 941x1672 capture matches the target stack: sidebar width 202, hero y=98-334, tabs y=342-393, learning flow y=417-503, shell workspace y=518-1190, worked example y=1202-1407, misconception y=1419-1506, and practice y=1518-1655. Dedicated content spans x=217-922, with no horizontal overflow, no duplicate shared lesson chrome, no footer, and zero console messages.

Evidence:

- `0398-reference.png`
- `0398-desktop.png`
- `0398-dedicated-target-validation.json`

## Lesson 320 / Mockup 0399 - Arc Length

Reworked individually as a generated polygonal arc-length approximation and convergence workspace. The coherent model uses `y=x^2/2`, editable endpoints, adjustable segment count, and a draggable local `ds` triangle. Every change regenerates the sample points and polyline, computes `dx`, `dy`, `ds`, the polygonal sum, exact integral `integral sqrt(1+x^2) dx`, absolute error, and convergence feedback. Six tabs, Reset, Share, Workspace/full-screen, four lesson-specific mini learning diagrams, formula, worked solution, area-versus-length misconception visual, checked numerical practice, Show hint, shell Reset, adjacent lessons, and action counting are functional.

Browser validation confirms the initial domain `[-5,5]`, `N=20`, `x=1.2`, `dx=0.5`, `dy=0.725`, `ds=0.88069575`, polygonal length `27.78710689`, exact length `27.80753591`, and error `0.02042902`. Changing to `[-2,3]`, `N=40`, and `x=0.5` produces `dx=0.125`, `ds=0.14341844`, approximation `8.60932545`, exact length `8.61052543`, and error `0.00119998`. A real pointer drag moves the triangle to approximately `x=1.66225709` and recomputes `dy=0.21559464` and `ds=0.24921085`. Practice rejects 1, accepts `5.6526`, reveals the integral hint, and local/shell Reset restore the complete initial model.

The reference prints `y=x^2/2` on `[-5,5]` but displays exact arc length `8.0216`, which is impossible because any curve spanning a horizontal interval of length 10 has arc length at least 10. Its plotted curve and initial `dx=0.25` also do not follow the printed function, domain, and `N=20`. The dedicated surface preserves the target's controls, segment construction, `ds` triangle, composition, and convergence narrative while keeping the generated graph, polygonal sum, exact integral, errors, and practice answer mathematically consistent.

Final exact 1024x1536 capture matches the target stack: sidebar width 215, hero y=102-296, tabs y=307-346, arc-length lab y=358-1121, formula/worked/misconception cards y=1131-1376, practice y=1386-1463, and adjacent lessons y=1480-1536. Dedicated content spans x=235-1005, with no horizontal overflow, no duplicate shared lesson chrome, no site footer, and zero console messages.

Evidence:

- `0399-reference.png`
- `0399-desktop.png`
- `0399-dedicated-target-validation.json`

## Lesson 321 / Mockup 0400 - Surface Area of Revolution

Reworked individually as a linked generating-curve and revolved-surface laboratory. The default `y=sqrt(x)` model on `[1,6]` generates the 2D graph, bound guides, tangent `ds`, translucent 3D mesh, circular differential ring, radius, slope, arc-length factor, differential surface element, exact surface integral, and progress. The orange ring is directly draggable in both graph views. The rotation axis is real, and the curve editor switches among `sqrt(x)`, `ln(x+1)`, and `x/2`; each axis/curve combination is recomputed numerically rather than changing labels. Dual numeric/range bounds, animation play/pause/reset, speed, five tabs, derivation cards, worked result, numerical practice, Hint, shell Reset, adjacent lessons, compact footer, and action counting are functional.

Browser validation confirms the initial axis `x`, curve `sqrt`, interval `[1,6]`, ring position `x=3.7`, radius `1.92353841`, slope `0.25993762`, `ds/dx=1.03323161`, differential element `12.48758382`, and exact area `pi(125-5sqrt(5))/6 = 59.59583467`. Switching to the y-axis, selecting `ln(x+1)`, and changing the interval to `[2,5]` produces area `67.60397835`; speed 80 drives the live animation, Pause freezes it, and animation Reset returns the ring to `x=2`. A real pointer drag moves the 3D ring from approximately `x=3.96` to `x=4.94` and updates radius, slope, `ds`, element, and progress. Practice rejects 1, accepts `217.0319`, reveals the derivative hint, and shell Reset restores the complete initial model.

The reference prints `y=sqrt(x)` on `[1,6]` but reports `80pi/3`, approximately `83.7758`. Its own surface formula evaluates to `pi/6[(4x+1)^(3/2)]_1^6 = pi(125-5sqrt(5))/6`, approximately `59.5958`. The dedicated surface preserves the target's two-view construction, controls, orange ring, derivation hierarchy, and exact composition while keeping the curve, derivative, mesh, differential element, integral, and checked practice result mathematically consistent.

Final exact 1024x1536 capture matches the target stack: sidebar width 224, title y=109-208, two-view surface lab y=208-795, formula band y=804-955, how/worked band y=969-1247, practice y=1261-1365, adjacent lessons y=1379-1429, and compact footer y=1439-1536. Dedicated content spans x=243-1008, with no horizontal overflow, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0400-reference.png`
- `0400-desktop.png`
- `0400-dedicated-target-validation.json`

## Lesson 322 / Mockup 0401 - Accumulation Functions

Reworked individually as a linked integrand, quadrature, and accumulation-function laboratory. The shared endpoint x drives `f(t)=2+sin(t)`, the generated midpoint rectangles, signed/absolute integral mode, analytic accumulation `A(x)=2x-cos(x)+1`, bottom accumulation curve, tangent line, numerical derivative, all four metric cards, and action count. Both graph probes are directly draggable. Rectangle counts 12/24/48 regenerate the actual quadrature and error; Play, Pause, Step, local Reset, five tabs, Share, worked FTC derivation, five-option prediction validation, shell Reset, adjacent lessons, and compact footer are functional.

Browser validation confirms the initial `x=3.6`, `n=12`, signed mode, `f(x)=1.55747956`, `A(x)=9.09675842`, midpoint estimate `9.10388998`, error `0.00713156`, and numerical derivative `1.55747963`. Moving to approximately `x=1.4968`, selecting 24 rectangles and absolute mode produces `f=2.99726461`, `A=3.91971522`, midpoint estimate `3.91986533`, and error `0.00015011`. Animation advances the shared endpoint, Pause freezes it, Step advances by 0.25, and local Reset returns x to 0. A real pointer drag moves the top endpoint from 0 to approximately `1.88456188`, recomputing both graphs and every metric. Prediction rejects `(0,pi)` alone and accepts only `A is always increasing`; shell Reset restores the complete initial model.

The reference prints `f(t)=2+sin(t)` and `A(x)=integral[0,x] f(t)dt` but labels `f(3.60)=1.306` and `A(3.60)=2.016`; the coherent values are approximately `1.55748` and `9.09676`. It also marks only selected intervals as increasing even though `A'(x)=2+sin(x)` lies in `[1,3]`, so A is increasing everywhere. The dedicated surface preserves the target's dual graphs, rectangles, animation controls, metric hierarchy, and prediction layout while keeping the integrand, quadrature, accumulation, tangent slope, derivative check, and validated answer mathematically consistent.

Final exact 943x1667 capture matches the target stack: sidebar width 197, hero y=94-255, tabs y=256-298, integrand/rectangle lab y=311-707, accumulation graph y=710-1027, metric cards y=1037-1144, worked/prediction band y=1162-1448, adjacent lessons y=1470-1521, and footer y=1536-1667. Dedicated content spans x=210-930, with no horizontal overflow, no duplicate shared lesson chrome, and zero console messages.

Evidence:

- `0401-reference.png`
- `0401-desktop.png`
- `0401-dedicated-target-validation.json`

## Lesson 323 / Mockup 0402 - Direction Fields

Reworked individually as a generated slope-field and exact solution-family laboratory for `dy/dx=x-y`. Density and x/y scaling regenerate every local direction segment; axes, solution curves, slope triangle, and grid are real display layers. Two initial seeds create exact curves from `y=x-1+Ce^-x`, remain independently selectable and directly draggable, and drive the selected-point coordinates, local slope calculation, slope triangle, curve legend, and action count. Add seed, Clear curves, five tabs, Share, worked example, shell Reset, and the place-seed prediction exercise all update the dedicated model rather than static labels.

Browser validation confirms the initial 24-density field, seeds `(1,1)` and `(0,-1)`, and selected slope `1-1=0`. A real slider-coordinate interaction changes density to 28; display controls hide axes and reveal the grid; Add seed creates `(-1,2)` with slope `-3`; Clear curves removes all generated solutions; and shell Reset restores the complete initial field. A real pointer drag moves seed 1 to approximately `(2.081615,0.353986)` and recomputes its exact solution and local slope as `1.727629`. Practice rejects slope `3` with Rises, accepts slope `-3` with Falls, and reveals the computed hint. No console warnings or errors occur.

Focused ESLint passes. The broader `CalculusLessonAdapter.test.tsx` remains red on two earlier case-sensitive snippet expectations in Lessons 286 and 307 (`First principles` and `Riemann sums`); neither failure reaches or implicates the Lesson 323 model.

Final exact 1024x1536 capture matches the target stack: sidebar width 216, hero y=102-220, five-tab strip y=220-275, three-column direction-field laboratory y=291-847, learning/worked band y=863-1198, prediction practice y=1211-1341, adjacent lessons y=1353-1407, and compact footer y=1422-1536. Dedicated content spans x=231-1009 with no horizontal overflow and no duplicate shared lesson chrome.

Evidence:

- `0402-reference.png`
- `0402-desktop.png`
- `0402-dedicated-target-validation.json`

## Lesson 324 / Mockup 0403 - Euler's Method

Reworked individually as a forward-Euler numerical laboratory. The selected differential equation, draggable/numeric initial condition, step size, and x-range generate one shared model for the slope field, purple Euler polygon and points, cyan exact curve, orange current tangent, current-step strip, construction formulas, comparison table, maximum error, RMS error, and step count. Three equations (`y'=y`, `y'=-0.5y`, and `y'=y-x`) have matching analytic solutions. Five display layers, animation/pause, local Reset, five lesson tabs, shell Reset, worked rule cards, and numerical practice are functional.

Browser validation confirms the coherent default growth model `y'=y`, `(x0,y0)=(0,1)`, `h=0.2`, 10 steps, and step 3 values `x=0.6`, `yEuler=1.728`, `yExact=e^0.6=1.8221188`, error `0.0941188`, maximum error `1.19731968`, and RMS error `0.52868155`. A real slider-coordinate change sets `h=0.25`; selecting the forced equation regenerates eight rows and its exact solution; animation advances to step 2 and Pause freezes it; shell Reset restores the full initial model. A real pointer drag moves the initial condition to approximately `(0.38746439,1.83921587)` and regenerates the graph, row count, exact curve, and errors. Practice rejects the exact value `e`, then accepts the four-step Euler approximation `2.4414`.

The reference dropdown shows `y'=y-x` while its exact comparison column is `e^x`, which solves `y'=y`, and its displayed Euler rows do not follow either recurrence. The dedicated surface preserves the target's layout and controls while using `y'=y` for the default so every graph point, table row, tangent, exact value, and error is mathematically consistent. Focused ESLint and the dedicated Playwright harness pass with zero console warnings or errors.

Final exact 941x1672 capture matches the target stack: sidebar width 193, hero y=94-228, tabs y=229-278, three-column numerical lab y=297-1028, theory band y=1044-1313, practice y=1328-1458, adjacent lessons y=1474-1523, and footer y=1537-1672. Dedicated content spans x=204-927 with no horizontal overflow and no duplicate shared lesson chrome.

Evidence:

- `0403-reference.png`
- `0403-desktop.png`
- `0403-dedicated-target-validation.json`

## Lesson 325 / Mockup 0404 - Separable Equations

Reworked individually as a staged separation, integration, and solution-family laboratory for `dy/dx=y/x`. The `dx/x` and `dy/y` terms are real draggable/clickable objects with independently validated x-side and y-side drop zones. Correct placement unlocks four linked integration stages, constant combination, and `y=Kx`; changing K through decrement, numeric input, or increment redraws the active family member and recomputes `ln|K|`. Five tabs, Share, local Reset, hint, misconception checklist, solved practice graph, Try another, shell Reset, adjacent lessons, and compact footer are functional.

Browser validation deliberately drags `dx/x` to the wrong y-side, which sets `xPlaced=false`, `separated=false`, and clears the integrated state. Dragging it back to the x-side restores valid separation; Integrate both sides completes the derivation; entering `K=-1.5` updates the family graph; Formula, hint, and Try another update their dedicated states; and shell Reset restores both correctly placed terms, completed integration, `K=2`, Interact, and zero actions. Focused ESLint and the dedicated Playwright harness pass with zero console warnings or errors.

Final exact 992x1586 capture matches the target stack: sidebar width 198, hero y=100-262, tabs y=272-317, separation workspace y=327-667, integration stages y=676-924, family graph/explanation y=933-1248, practice y=1258-1442, adjacent lessons y=1451-1501, and footer y=1509-1586. Dedicated content spans x=212-973 with no horizontal overflow and no duplicate shared lesson chrome.

Evidence:

- `0404-reference.png`
- `0404-desktop.png`
- `0404-dedicated-target-validation.json`

## Lesson 326 / Mockup 0405 - First-Order Linear Equations

Reworked individually as a landscape integrating-factor laboratory for `y'+py=s e^x`. The shared coefficient model drives the five-stage pipeline, eight-row CAS derivation, integrating factor, forcing coefficient, initial-condition constant, generated slope field, exact solution, forcing and transient layers, solution-structure card, and substitution residual. The `p`, `y(0)`, and forcing-strength sliders, three equation presets, three graph-layer toggles, five tabs, verification, shell Reset, Share, Copy steps, and downloadable derivation export are functional. The `p=-1` special case uses `(y0+sx)e^x` instead of dividing by zero.

Browser validation confirms the reference model `p=2`, `y0=1`, `s=1`, forcing coefficient `1/3`, transient constant `2/3`, and residual zero. Real slider/input actions change the model to approximately `p=1.5`, `y0=-1`, `s=2`, yielding `A=0.8`, `C=-1.8`, and residual zero; the forcing layer hides, Examples activates, and substitution verifies. Selecting the gentle preset regenerates `p=1`, `y0=2`, `s=0.75`, `A=0.375`, and `C=1.625`. Copy steps updates the clipboard state; Export produces `first-order-linear-equation-derivation.txt`; and shell Reset restores every initial value and layer. Focused ESLint and the dedicated Playwright harness pass with zero console warnings or errors.

Final exact 1536x1024 capture matches the target landscape stack: sidebar width 240, hero y=104-207, tab strip y=217-253, three-column integrating-factor lab y=261-856, dedicated target navigation y=873-930, and footer y=942-1024. Dedicated content spans x=252-1516 with no horizontal overflow and no duplicate shared lesson chrome. The lesson-specific navigation uses the mockup's visible “Exact Equations” next label rather than the catalog shell's generic next title.

Evidence:

- `0405-reference.png`
- `0405-desktop.png`
- `0405-dedicated-target-validation.json`
