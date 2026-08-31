# Sequences and Series target batch 0519-0531

Dedicated rebuild target: **13 of 13 lessons completed; 0 pending.**

| Mockup | Lesson                          | Dedicated object model                                                                                                                                                                                                                                         | Status                                      |
| ------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0519   | 334 Sequence Generator          | `editable-polynomial-parser-explicit-recursive-range-generator-differences-ratios-cumulative-sums-pattern-detector-draggable-constant-export-practice`                                                                                                         | Reworked individually and browser-validated |
| 0520   | 335 Arithmetic Sequences        | `constant-difference-number-line-stepper-autoplay-term-table-draggable-index-graph-explicit-recursive-bidirectional-nth-term-solver-guided-practice`                                                                                                           | Reworked individually and browser-validated |
| 0521   | 336 Geometric Sequences         | `constant-ratio-multiplicative-step-chain-term-table-linear-log-plot-draggable-ratio-explicit-recursive-growth-classifier-three-mode-inverse-solver-practice`                                                                                                  | Reworked individually and browser-validated |
| 0522   | 337 Recursive Sequences         | `editable-affine-logistic-recurrence-parser-presets-initial-condition-dependency-chain-memoized-table-cobweb-draggable-seed-time-series-fixed-point-error-export-practice`                                                                                     | Reworked individually and browser-validated |
| 0523   | 338 Fibonacci Sequence          | `two-positive-integer-seeds-pairwise-recurrence-auto-build-speed-generated-term-list-fibonacci-square-spiral-draggable-seed-ratio-phi-convergence-binet-practice`                                                                                              | Reworked individually and browser-validated |
| 0524   | 339 Sigma Notation              | `polynomial-summand-parser-editable-bounds-presets-finite-nested-sum-term-expansion-partial-accumulator-animation-draggable-index-stem-index-substitution-copy-practice`                                                                                       | Reworked individually and browser-validated |
| 0525   | 340 Arithmetic Series           | `arithmetic-progression-first-difference-count-generated-terms-partial-sums-paired-ends-draggable-line-endpoints-finite-sum-proof-trapezoid-area-practice`                                                                                                     | Reworked individually and browser-validated |
| 0526   | 341 Geometric Series            | `geometric-first-ratio-count-finite-terms-partial-sums-infinite-convergence-draggable-term-bars-limit-line-formula-verification-multi-challenge-practice`                                                                                                      | Reworked individually and browser-validated |
| 0527   | 342 Convergence and Divergence  | `five-series-models-generated-terms-partial-sums-draggable-analysis-point-tolerance-band-nth-term-test-ratio-test-classification-counterexample-comparison-worked-proof-multi-question-practice`                                                               | Reworked individually and browser-validated |
| 0528   | 343 Power Series                | `centered-power-series-preset-taylor-coefficients-manual-coefficient-editor-target-function-partial-sum-graph-draggable-highest-coefficient-truncation-error-radius-estimator-convergence-interval-endpoint-tests-expanded-polynomial-multi-question-practice` | Reworked individually and browser-validated |
| 0529   | 344 Taylor and Maclaurin Series | `five-function-taylor-coefficients-expansion-center-order-target-interval-function-polynomial-graph-draggable-center-animation-remainder-error-convergence-bars-derivative-table-expanded-form-multi-question-practice`                                        | Reworked individually and browser-validated |
| 0530   | 345 Binomial Series             | `generalized-binomial-exponent-evaluation-point-truncation-recursive-coefficients-target-partial-graph-draggable-evaluation-point-expansion-partial-table-error-by-order-endpoint-rules-multi-question-practice`                                               | Reworked individually and browser-validated |
| 0531   | 346 Recurrence Modelling        | `scenario-aware-geometric-affine-recurrence-growth-factor-additive-input-initial-value-units-generated-state-change-tables-draggable-time-series-closed-form-verification-equilibrium-stability-multi-question-practice`                                       | Reworked individually and browser-validated |

## Lesson 334 / Mockup 0519 - Sequence Generator

Reworked individually as an editable sequence-generation and pattern-analysis surface. The explicit formula parser handles quadratic, linear, and constant polynomial terms; index start, end, and step controls generate the actual term set; and recursive mode uses an editable first term and common difference. The same model derives first differences, second differences, ratios, cumulative sums, and an arithmetic/geometric/quadratic pattern classification.

The Line/Points chart modes render the generated terms. A chart point is a physical vertical drag handle that adjusts the polynomial constant and immediately regenerates the chart, table, differences, and classification. Difference, ratio, and cumulative-sum checkboxes control real table rows. Reset, Export CSV, Share, six lesson tabs, quick-check grading, two-field practice grading, and shell Reset are functional.

Browser validation confirms the initial formula `3n^2+2n+1` generates `6, 17, 34, 57, 86, 121, 162, 209, 262, 321` with constant second difference 6. Editing the formula to `2n^2-n+4` and the range to 2 through 8 in steps of 2 generates `10, 32, 70, 124`; ratios and cumulative sums appear on demand; and Points and Explain activate their real states. A captured pointer drag changes the constant to approximately `66.24884853` and recomputes every term. Recursive inputs 5 and 3 generate `5, 8, 11, 14` and classify the result as arithmetic. CSV export downloads `sequence-generator.csv`. The quick check rejects 418 and accepts 457; the independent two-answer task accepts 706 and 1241. Shell Reset restores the complete initial model and zero actions.

The reference prints `a_n=3n^2+2n+1`, but its graph and assessment values do not satisfy that formula: it displays later terms such as 119, 158, 203, 254, and 311, and grades `a_12=462`, `a_15=721`, and `a_20=1281`. Direct substitution gives `a_12=457`, `a_15=706`, and `a_20=1241`. The dedicated lesson preserves the target composition and interaction design while keeping the formula, graph, generated table, worked values, and graded answers mathematically coherent.

Final browser validation uses a 941x1672 document with sidebar width 204, hero y=87-263, tabs y=273-314, generator lab y=324-1275, checks y=1285-1451, adjacent navigation y=1463-1512, and footer y=1523-1672. It reports no horizontal overflow and zero console messages.

Evidence:

- `0519-reference.png`
- `0519-desktop.png`
- `0519-dedicated-target-validation.json`

## Lesson 335 / Mockup 0520 - Arithmetic Sequences

Reworked individually around one constant-difference sequence model. The first-term and common-difference controls regenerate ten terms, all consecutive differences, the animated number-line construction, the synchronized table, the linear term-versus-index graph, explicit and recursive formulas, the 40th-term calculation, and every live result. First, previous, play/pause, next, last, and Auto controls advance the actual highlighted term rather than a decorative animation.

Every graph point is a physical pointer-captured vertical handle. Dragging any point after the first solves back to the common difference using `d=(a_n-a_1)/(n-1)` and immediately rebuilds every dependent representation. The nth-term solver works in both directions: it finds a term from an index and finds an integer index from a term, including no-solution and zero-difference cases. Seven lesson tabs, language, Reset, Share, Workspace, quick-check grading, guided calculation, practice navigation, and shell Reset are functional.

Browser validation confirms the initial `a_1=5`, `d=3` sequence `5, 8, 11, 14, 17, 20, 23, 26, 29, 32` with nine differences equal to 3. Changing to `a_1=-2`, `d=4` regenerates `-2, 2, 6, 10, 14, 18, 22, 26, 30, 34`; Last selects term 10, and autoplay wraps and advances the same step state. A captured graph drag changes `d` to approximately `4.549675` and regenerates the terms through `45.947075`. The solver returns `a_25=77` and identifies 17 as term `n=5`. Quick Check rejects 34 and accepts 38, the Formulas tab updates, and shell Reset restores the complete initial model and zero actions.

The reference's Quick Check asks for the 12th term of the displayed rule `a_n=3n+2`. Its selected option is 36, while the feedback immediately below says `a_12=3(12)+2=38`. The dedicated surface grades 38, the value consistent with the formula, table, graph, and worked arithmetic.

Final exact 944x1665 browser validation matches the target stack: sidebar width 191, hero y=97-301, tabs y=301-343, arithmetic explorer y=353-744, table/graph y=754-1037, formulas/solver y=1047-1270, calculation/practice y=1280-1486, adjacent lessons y=1495-1540, and footer y=1549-1665. Dedicated content spans x=206-929, with no horizontal overflow and zero console messages.

Evidence:

- `0520-reference.png`
- `0520-desktop.png`
- `0520-dedicated-target-validation.json`

## Lesson 336 / Mockup 0521 - Geometric Sequences

Reworked individually around a constant-ratio model. First-term and ratio controls regenerate the multiplicative step chain, ten-row calculation table, graph, explicit and recursive forms, growth/constant/decay classification, worked example, and assessment. Linear and semi-log graph modes are real. Every graph point after the first is a pointer-captured vertical handle that solves back to `r`, clamped to the target parameter domain; negative and zero cases are guarded.

The inverse solver has independent Find n, Find a1, and Find r modes with real logarithmic, division, and root calculations plus domain messages. Five lesson stages and four-option assessment grading are functional. Browser validation confirms the initial `3, 6, 12, 24, 48, 96, 192, 384, 768, 1536` growth sequence. Changing to `a1=4`, `r=0.5` produces the coherent decay sequence through `0.007813` and activates the semi-log plot. A captured graph drag changes `r` to 3. The solvers return `n=7`, `a1=3`, and `r=2`; assessment rejects 384 and accepts 1536; shell Reset restores the initial model and zero actions.

Final exact 864x1821 validation matches the target stack: sidebar width 166, hero y=89-229, tabs y=239-284, objective/parameters y=294-444, step chain y=454-598, table/graph y=608-950, formulas/classifier y=960-1142, worked example/solver y=1152-1407, notes y=1417-1549, quick check y=1559-1663, adjacent lessons y=1668-1712, and footer y=1720-1821. Dedicated content spans x=181-849, with no horizontal overflow and zero console messages.

Evidence:

- `0521-reference.png`
- `0521-desktop.png`
- `0521-dedicated-target-validation.json`

## Lesson 337 / Mockup 0522 - Recursive Sequences

Reworked individually around an editable recurrence engine. The parser accepts affine rules such as `0.6a+4` and normalized logistic rules such as `3.2a(1-a)`. Custom mode owns the editable field; selecting Linear growth, Linear decay, Doubling, or Logistic switches to preset mode and updates the rule and a meaningful initial condition. The same recurrence generates the dependency chain, substitution steps, memoized table, absolute errors, cobweb, time series, fixed-point diagnostics, and assessment.

Both cobweb and time-series seeds are pointer-captured vertical drag handles that update the initial condition and regenerate the full orbit. Precision controls actual displayed values, Compute sequence reveals all ten evaluation steps, Export downloads `recursive-sequence.csv`, and Reset, five lesson stages, incorrect/correct grading, and shell Reset are functional. Browser validation confirms the target affine orbit through `9.919378`, fixed point 10, and convergence factor 0.6. Logistic mode uses `a1=0.2` and produces a bounded orbit. Custom `0.5a+5`, `a1=4`, precision 4 generates terms through `9.9883`; dragging changes the seed to approximately `7.10764`; assessment rejects 9.2 and accepts 9.37792.

Final exact 986x1594 validation matches the target stack: sidebar width 205, tabs y=101-144, header y=154-294, recurrence setup y=310-550, dependency/evaluation/cobweb y=562-848, memoized table/time series/insights y=860-1298, quick check y=1310-1426, adjacent lessons y=1440-1497, and footer y=1509-1594. Dedicated content spans x=219-972, with no horizontal overflow and zero console messages.

Evidence:

- `0522-reference.png`
- `0522-desktop.png`
- `0522-dedicated-target-validation.json`

## Lesson 338 / Mockup 0523 - Fibonacci Sequence

Reworked individually around two positive integer seeds. Seed steppers regenerate twelve terms, the pairwise-addition chain, term list, Fibonacci-square spiral, ratio table, φ errors, and current state. Auto Build, speed, Play/Pause, Reset Seeds, Save, Reset, Share, Workspace, and five lesson stages are functional. The smallest generated spiral square is a pointer-captured horizontal drag handle that changes F2 and rebuilds every dependent representation.

Browser validation confirms the standard `1,1,2,3,5,8,13,21,34,55,89,144` sequence and ratios converging to φ. Changing the seeds to 2 and 3 produces `2,3,5,8,13,21,34,55,89,144,233,377`. Auto Build advances at speed 7; dragging changes F2 from 3 to 8 and regenerates the sequence through 822; Save toggles real state. Quick Check rejects 34 and accepts 55, Formulas activates, and shell Reset restores the complete initial model and zero actions.

Final exact 864x1821 validation matches the target stack: sidebar width 166, hero y=90-295, tabs y=305-344, build lab y=352-667, spiral/ratio row y=676-1110, theory row y=1119-1392, guided explanation/check y=1401-1627, adjacent lessons y=1640-1690, and footer y=1705-1821. Dedicated content spans x=180-854, with no horizontal or internal grid overflow and zero console messages.

Evidence:

- `0523-reference.png`
- `0523-desktop.png`
- `0523-dedicated-target-validation.json`

## Lesson 339 / Mockup 0524 - Sigma Notation

Reworked individually around a polynomial summand parser supporting i, j, squared terms, mixed ij terms, and constants. Editable inclusive bounds, steppers, presets, custom summands, and optional nested j=1..i summation generate the exact term expansion, partial accumulator, total, table, graph stems, growth classification, and equivalent shifted-index form. Animation speed mode, Animate, Play/Pause, Reset, Share, Workspace, Copy, and five lesson stages are functional. Every graph point is a pointer-captured handle that selects the active index and synchronizes the animated expansion.

Browser validation confirms the target sum of `i^2+1` from 1 through 8 gives terms `2,5,10,17,26,37,50,65`, partial total 212. Custom `2i-1` from 0 through 5 gives `-1,1,3,5,7,9` and total 24. Nested `i+j` for i=1..3 gives `2,7,15` and total 24. Animation advances the index, dragging selects i=7, Copy records real state, Quick Check rejects 24 and accepts 25, Formulas activates, and shell Reset restores the initial model and zero actions.

Final exact 826x1903 validation matches the target stack: sidebar width 191, hero y=98-271, tabs y=281-315, sigma lab y=325-1115, learning cards y=1125-1435, assessment/worked solution y=1445-1745, adjacent lessons through y=1811, and footer ending at y=1903. Dedicated content spans x=204-813, with no horizontal overflow and zero console messages.

Evidence:

- `0524-reference.png`
- `0524-desktop.png`
- `0524-dedicated-target-validation.json`

## Lesson 340 / Mockup 0525 - Arithmetic Series

Reworked individually around one arithmetic-progression model. First term, common difference, and term-count controls generate every term, partial sum, first/last pair, common pair sum, formula-check row, linear graph, trapezoid, derivation, and final sum. Interactive/View mode genuinely enables or disables the parameters. The first and last graph points are pointer-captured vertical handles: the first solves back to a1, while every later point solves back to d. Reset, Share, Workspace, fullscreen, five lesson stages, and assessment grading are functional.

Browser validation confirms `a1=2`, `d=3`, `n=10` gives terms through 29, pair sum 31, and total 155. Changing to `a1=-1`, `d=2`, `n=6` gives `-1,1,3,5,7,9` and total 24. View mode disables the parameters; both graph drag inversions change their respective model parameter. Quick Check rejects 270 and accepts the coherent value 348; Formulas activates; shell Reset restores the initial model and zero actions.

The reference asks for `a1=7`, `d=4`, `n=12`, highlights 270, then prints `S12=6(14+44)=6x58=348`. The dedicated surface grades 348, the value consistent with its own displayed formula.

Final exact 862x1824 validation matches the target stack: sidebar width 188, hero beginning at y=89, objective and tabs aligned above the lab, arithmetic lab through y=1139, derivation/insights through y=1490, assessment through y=1620, adjacent lessons through y=1693, and footer ending at y=1824. Dedicated content spans x=200-851, with no horizontal overflow and zero console messages.

Evidence:

- `0525-reference.png`
- `0525-desktop.png`
- `0525-dedicated-target-validation.json`

## Lesson 341 / Mockup 0526 - Geometric Series

Reworked individually around one geometric-series model. First term, common ratio, and term-count controls regenerate the term bars, partial-sum curve, convergence limit, value table, finite sum, infinite sum, worked verification, and all displayed formulas. The model handles positive, negative, zero, and divergent ratios coherently. The first plotted term is a pointer-captured vertical handle for a1; every later term solves back to r and immediately rebuilds all dependent representations.

Browser validation confirms the initial `a=3`, `r=0.5`, `n=10` terms through `0.005859`, finite sum `5.994141`, and infinite limit 6. Changing to `a=4`, `r=-0.5`, `n=6` generates `4,-2,1,-0.5,0.25,-0.125`, finite sum `2.625`, and infinite sum `2.666667`. Setting `r=1.2` switches the model to divergent. Captured pointer drags independently change the first term and ratio, an out-of-domain numeric answer is rejected, both quick-check variants accept their mathematically correct values, Formulas activates, and shell Reset restores the initial model and zero actions.

Final exact 863x1822 validation matches the target page stack: sidebar and application header, hero and actions, lesson tabs, geometric-series explorer with control rail and two linked plots, term/partial-sum table, explanation and insight cards, three formula cards, worked verification, quick check, adjacent lessons, and footer. It reports no horizontal overflow, zero console errors, and zero page errors.

Evidence:

- `0526-reference.png`
- `0526-desktop.png`
- `0526-dedicated-target-validation.json`

## Lesson 342 / Mockup 0527 - Convergence and Divergence

Reworked individually as a five-model convergence-analysis surface. Geometric, p-series, alternating, factorial, and custom shifted-power modes each generate their own terms, partial sums, approximate or exact sum, nth-term limit, ratio-test limit, absolute/conditional status, and final classification. The tolerance slider controls the real limit band. The last partial-sum point is a pointer-captured handle that adjusts the active model parameter and recomputes the full analysis. The divergent comparison selector switches between growing and oscillating geometric counterexamples.

Browser validation confirms the initial geometric series has sum 8 and converges absolutely. Setting `r=1.2` produces a divergent classification and ratio-test limit 1.2. The p-series converges for `p=2` and diverges for `p=0.8`; the alternating model with `p=0.8` converges conditionally; the factorial model reports ratio limit 0 and sum `e-1 = 1.718282`; and custom `2/(n+1)^2` converges. A captured plot drag changes the geometric ratio, tolerance changes to 0.1, the counterexample selector changes the comparison model, both quick-check questions reject and accept the appropriate answers, Formulas activates, and shell Reset restores the initial model and zero actions.

Final exact 786x2001 validation matches the target stack: hero y=93-261, lesson tabs through y=311, objective through y=423, series definition through y=703, partial-sum analysis through y=1032, tests and classification through y=1377, worked proof through y=1689, assessment through y=1847, adjacent lessons through y=1913, and footer ending at y=2001. The dedicated surface has no horizontal overflow and emits no console warnings or errors.

Evidence:

- `0527-reference.png`
- `0527-desktop.png`
- `0527-dedicated-target-validation.json`

## Lesson 343 / Mockup 0528 - Power Series

Reworked individually around a centered power-series coefficient model. Cosine, sine, exponential, and geometric presets generate true Taylor coefficients about the selected center. Manual mode snapshots the visible coefficients into an editable semantic table. The same model drives the partial polynomial, target-function graph, truncation error, Cauchy-Hadamard radius estimate, convergence interval, endpoint results, expanded form, and recognized-series summary. The highlighted graph point is a pointer-captured handle that solves back to the highest active coefficient.

Browser validation confirms the initial manually entered cosine pattern is recognized and assigned infinite radius. The shifted sine preset at `c=1`, degree 6 generates the correct derivative-cycle coefficients and infinite radius. The geometric preset at `c=0.25` gives `R=0.75` and interval `(-0.5,1)`. Switching to Manual snapshots finite current coefficients, editing five rows updates the custom radius, dragging changes the degree-four coefficient and graph, and the x-range changes to 3.1. Both assessment questions reject and accept the correct options, Formulas activates, and shell Reset restores the initial model and zero actions. Selecting the geometric target at its singular center is represented as a stable radius-zero invalid expansion rather than emitting non-finite graph values.

Final exact 918x1714 validation matches the target stack: hero y=88-295, tabs through y=350, exploration lab through y=1194, insight row through y=1316, guided explanation through y=1431, assessment through y=1581, adjacent lessons through y=1647, and footer ending at y=1714. It reports no horizontal overflow and zero console warnings or errors.

Evidence:

- `0528-reference.png`
- `0528-desktop.png`
- `0528-dedicated-target-validation.json`

## Lesson 344 / Mockup 0529 - Taylor and Maclaurin Series

Reworked individually around a derivative-driven Taylor model for exponential, sine, cosine, logarithmic, and geometric functions. Function, expansion center, order, and target interval generate the derivative coefficients, displayed table, polynomial, target curve, expanded form, remainder, maximum error, and order-by-order convergence bars. Play, Pause, Step, and speed operate the actual displayed polynomial order. The center marker is pointer-captured and horizontally draggable, solving back to the expansion center and rebuilding every dependent result.

Browser validation confirms the initial fourth-order exponential coefficients `1,1,0.5,0.1666667,0.0416667`. Shifted sine at `a=1`, order 6 and shifted cosine at `a=0.5`, order 8 produce their derivative cycles. For `ln(1+x)` about zero, order 5 produces `0,1,-0.5,0.3333333,-0.25,0.2`; extending its interval below -1 sets the model's domain-valid flag false without emitting non-finite graphics. A captured drag changes the center, autoplay advances the shown order, Pause stops it, Step advances once, both assessment questions grade correctly, Key Insights activates, and shell Reset restores the complete initial model and zero actions.

Final exact 864x1821 validation matches the target stack: hero y=88-265, tabs through y=319, interactive lab through y=1197, insight cards through y=1357, assessment through y=1591, adjacent lessons through y=1663, and footer ending at y=1821. It reports no horizontal overflow and zero console warnings or errors.

Evidence:

- `0529-reference.png`
- `0529-desktop.png`
- `0529-dedicated-target-validation.json`

## Lesson 345 / Mockup 0530 - Binomial Series

Reworked individually around the generalized coefficient recurrence `C(alpha,k)=C(alpha,k-1)(alpha-k+1)/k`. Exponent, evaluation point, truncation count, and selected coefficient index drive the complete coefficient list, expansion, target value, partial sums, absolute errors, table, target/partial graph, and error-by-order plot. The highlighted graph point is pointer-captured and horizontally draggable, solving back to x and rebuilding every dependent result.

Browser validation confirms the initial coefficients begin `1,0.75,-0.09375,0.0390625`. For `alpha=0.5`, the coefficients begin `1,0.5,-0.125,0.0625`, and the coherent target is `sqrt(1.4)=1.183215957`. Selecting k=4 updates the coefficient builder. For `alpha=-1`, coefficients alternate `1,-1,1,-1`, matching the geometric expansion. A captured drag changes x, increasing truncation to ten terms reduces the error, both assessment questions grade correctly, Formulas activates, and shell Reset restores the complete initial model and zero actions.

The reference displays `(1.4)^0.75 = 1.314534`, but direct evaluation is approximately `1.287052`. The dedicated surface preserves the target composition while keeping the target curve, current value, partial sums, and errors numerically consistent.

Final exact 864x1821 validation matches the target stack: hero y=82-266, tabs through y=319, binomial lab through y=1146, learning and assessment section through y=1646, adjacent lessons through y=1716, and footer ending at y=1821. It reports no horizontal overflow and zero console warnings or errors.

Evidence:

- `0530-reference.png`
- `0530-desktop.png`
- `0530-dedicated-target-validation.json`

## Lesson 346 / Mockup 0531 - Recurrence Modelling

Reworked individually around a scenario-aware recurrence engine. City population, savings with deposits, bacteria culture, and medication decay presets configure geometric or affine rules `P(n+1)=rP(n)+k`. Growth factor, additive input, initial value, units, and comparison index generate the time series, timeline, state/change table, closed form, recursive comparison, equilibrium, stability result, and interpretation. Every graph point is pointer-captured: the initial point solves P0, while later points solve r for geometric scenarios or P0 for affine scenarios.

Browser validation confirms the city sequence begins `50000,55000,60500` and reaches `129687.123005` at n=10 with zero recursive/closed-form difference. Savings begins `10000,11500,13075`. Medication has stable equilibrium `71.428571`. Manual `r=0.8`, `k=100`, `P0=500` produces stable equilibrium 500 and exact recursive/closed-form agreement at n=5. A captured graph drag changes r, both assessment questions grade correctly, Formulas activates, and shell Reset restores the initial model and zero actions.

Final exact 921x1708 validation matches the target stack: hero y=89-287, tabs through y=342, model lab through y=1207, guided notes through y=1362, assessment through y=1517, adjacent navigation through y=1587, and footer ending at y=1708. It reports no horizontal overflow and zero console warnings or errors.

The reference shows a next lesson named “Solving Linear Recurrence Relations.” No lesson with that title or route exists in the current catalog; ID 347 is Matrix Builder. The dedicated page therefore retains the working Previous link and does not add a dead or incorrectly routed control.

Evidence:

- `0531-reference.png`
- `0531-desktop.png`
- `0531-dedicated-target-validation.json`
