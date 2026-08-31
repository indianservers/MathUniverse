# Sequences and Series target batch 0519-0531

Dedicated rebuild target: **3 of 13 lessons completed; 10 pending.**

| Mockup | Lesson                        | Dedicated object model                                                                                                                                        | Status                                      |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0519   | 334 Sequence Generator        | `editable-polynomial-parser-explicit-recursive-range-generator-differences-ratios-cumulative-sums-pattern-detector-draggable-constant-export-practice`        | Reworked individually and browser-validated |
| 0520   | 335 Arithmetic Sequences      | `constant-difference-number-line-stepper-autoplay-term-table-draggable-index-graph-explicit-recursive-bidirectional-nth-term-solver-guided-practice`          | Reworked individually and browser-validated |
| 0521   | 336 Geometric Sequences       | `constant-ratio-multiplicative-step-chain-term-table-linear-log-plot-draggable-ratio-explicit-recursive-growth-classifier-three-mode-inverse-solver-practice` | Reworked individually and browser-validated |
| 0522   | 337 Recursive Sequences       | Pending                                                                                                                                                       | Pending                                     |
| 0523   | 338 Sigma Notation            | Pending                                                                                                                                                       | Pending                                     |
| 0524   | 339 Arithmetic Series         | Pending                                                                                                                                                       | Pending                                     |
| 0525   | 340 Geometric Series          | Pending                                                                                                                                                       | Pending                                     |
| 0526   | 341 Infinite Geometric Series | Pending                                                                                                                                                       | Pending                                     |
| 0527   | 342 Convergence of Series     | Pending                                                                                                                                                       | Pending                                     |
| 0528   | 343 Power Series              | Pending                                                                                                                                                       | Pending                                     |
| 0529   | 344 Taylor Series             | Pending                                                                                                                                                       | Pending                                     |
| 0530   | 345 Fibonacci Sequence        | Pending                                                                                                                                                       | Pending                                     |
| 0531   | 346 Recurrence Relations      | Pending                                                                                                                                                       | Pending                                     |

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
