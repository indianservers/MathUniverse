# Integral Calculus and Differential Equations target batch 0385-0412

Dedicated rebuild target: **2 of 28 lessons completed; 26 pending.**

| Mockup | Lesson                           | Dedicated object model                                                                                                     | Status                                      |
| ------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0385   | 306 Area by Rectangles           | `cubic-partition-dual-endpoint-drag-left-midpoint-right-rectangles-signed-positive-negative-sums-layer-toggles-practice`   | Reworked individually and browser-validated |
| 0386   | 307 Riemann Sums                 | `cosine-plus-two-uniform-partition-draggable-boundary-and-sample-left-midpoint-right-sum-exact-error-convergence-practice` | Reworked individually and browser-validated |
| 0387   | 308 Definite Integral            | Pending audit                                                                                                              | Pending                                     |
| 0388   | 309 Indefinite Integral          | Pending audit                                                                                                              | Pending                                     |
| 0389   | 310 Fundamental Theorem          | Pending audit                                                                                                              | Pending                                     |
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
