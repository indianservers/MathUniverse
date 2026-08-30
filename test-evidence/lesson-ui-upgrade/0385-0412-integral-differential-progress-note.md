# Integral Calculus and Differential Equations target batch 0385-0412

Dedicated rebuild target: **12 of 28 lessons completed; 16 pending.**

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
