# Sequential lesson rebuild 0001-0130

Dedicated rebuild target: **17 of 130 lessons completed; 113 pending.**

| Mockup |                  Lesson | Status   | Dedicated model and validation                                                                                                                                                                                                     |
| ------ | ----------------------: | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001   |      1 Basic Calculator | Complete | Editable arithmetic expression and BODMAS parse-trace model; real keypad families, direct expression input, automatic trace, history recall/reset, practice rotation, grading, solution, and exact 1489x1056 target geometry       |
| 0002   |   2 Fraction Calculator | Complete | Linked two-fraction model with live LCD, equivalent bars, numerator-only addition, exact/mixed/decimal outputs, editable fields, functional keypad/modes, problem rotation, practice loading, and exact 1536x1024 target geometry  |
| 0003   |         3 Mixed Numbers | Complete | Dual mixed-number model with linked whole blocks/fraction strips, improper conversion, LCD expansion, exact/mixed/decimal results, active-field keypad modes, proof sidebar, practice reveal, and exact 1503x1047 target geometry  |
| 0004   | 4 Percentage Calculator | Complete | Draggable percent/base model with live hundred grid, segmented percent scale, whole/part bars, equation, quick table, trace, direct inputs, result, and graded inverse-percent practice at exact 1506x1045 target geometry         |
| 0005   |      5 Ratio Calculator | Complete | Dual draggable/steppable ratio model with live GCF grouping, simplification proof, grouped bars, tile arrays, double number line, trace, action count, examples, and graded comparison practice at exact 1536x1024 target geometry |
| 0006   |      6 Powers and Roots | Complete | Linked radicand/root area grid and base/exponent repeated-power model with cube, combined expression, steppers, trace, action state, and practice reveal at exact 1068x1472 target geometry                                        |
| 0007   |   7 Scientific Notation | Complete | Linked coefficient/exponent model with real steppers, number-line marker, directional decimal-shift sequence, standard form, concept trace, powers ladder, instructions, and practice checking at exact 1508x1043 target geometry  |
| 0008   |            8 Logarithms | Complete | Bidirectional base/exponent/power model with visible steppers, real drag ranges, power ladder, inverse-operation proof, dynamic trace, help, views, reset, and practice reveal at exact 1508x1043 target geometry                  |
| 0009   | 9 Exponential Calculations | Complete | Linked base/exponent factor-chain model with real steppers and drag control, animated doubling staircase, growth chart, live concept trace, reset/views, rotating graded practice, and exact 1472x1069 target geometry |
| 0010   | 10 Trigonometric Calculator | Complete | Dual draggable unit-circle angle model with linked exact-value triangles, DEG/RAD calculations, live sum and trace, special-angle table, reset/views, and rotating graded practice at exact 1068x1472 target geometry |
| 0011   | 11 Inverse Trigonometry | Complete | Draggable sine-ratio and unit-circle-ray model with calculated principal angle, right triangle, DEG/RAD values, verification, principal range, trace, and independent graded practice at exact 1068x1472 target geometry |
| 0012   | 12 Hyperbolic Functions | Complete | Draggable x model with exact dual exponentials, continuous linked curves/probes, sinh difference construction, live trace, hyperbola context, views/reset, and rotating reveal practice at exact 1068x1472 target geometry |
| 0013   | 13 Factorial, Permutation and Combination | Complete | Native draggable/clickable distinct-item slots with factorial, ordered permutation, unordered combination calculations, n/r inputs, mode-specific trace, comparison cards, and reveal practice at exact 1007x1562 target geometry |
| 0014   | 14 Absolute Value | Complete | Dual draggable signed/mirrored point model with number-line distance arc, direction and nonnegative output trace, symmetry proof, mode switch, reset/views, and two-field graded practice at exact 1065x1477 target geometry |
| 0015   | 15 Rounding and Precision | Complete | Editable exact fraction with denominator guard, real precision slider, decimal/report/next-digit/error pipeline, local number-line comparison, trace, reset/views, and rotating reveal practice at exact 1068x1473 target geometry |
| 0016   | 16 Constants Library | Complete | Selectable high-precision constants with dedicated circle/exponential/golden-ratio visual models, real precision slider, formula/output trace, early-rounding comparison, reset/views, and reveal practice at exact 1050x1498 target geometry |
| 0017   | 17 Calculation History | Complete | Selectable provenance-linked history rows with real reuse/copy/pin/inspect actions, live source/result trace, dependency-chain validation, reset/views, and immediate graded practice at exact 1536x1024 target geometry |

## Lesson 1 / Mockup 0001 - Basic Calculator

Reworked individually against the target mockup with a dedicated `editable-arithmetic-expression-bodmas-parse-trace-history-practice-model`. The editable expression, numeric keypad, six real keypad families, BODMAS trace, current result, calculation history, automatic-step setting, practice set, grading result, and solution state are linked to explicit lesson state. The initial `(12 + 8) / 4` construction resolves brackets first and then division to produce 5.

All lesson views, expression editing, Enter-to-evaluate, number and operator keys, clear, backspace, sign, evaluate, history recall, preset reset, automatic trace toggle, six keypad mode selectors, rotating practice challenges, numerical grading, solution toggle, Try another, and Next example controls perform real actions. No initial-screen control is decorative.

Final 1489x1056 browser validation verifies the initial expression and result; directly evaluates `7 + 4 x 6 - 3 = 28`; disables automatic trace; switches to the Functions keypad and back; physically enters `9 + 3` through keypad buttons and verifies 12; confirms history entries; rejects 27 and accepts 28 for the BODMAS challenge; closes the revealed solution; advances the challenge; and resets every state. The screenshot loop matches the target section geometry exactly: header y=109-274, tabs y=292-341, calculator workspace y=356-930, success strip y=946-1025, rule panel y=292-597, and practice panel y=613-940. It reports no horizontal overflow and zero console messages.

Evidence:

- `0001-reference.png`
- `0001-desktop.png`
- `0001-dedicated-target-validation.json`

## Lesson 2 / Mockup 0002 - Fraction Calculator

Reworked individually against the target mockup with a dedicated `linked-two-fraction-lcd-equivalent-bars-exact-mixed-decimal-model`. The four editable numerator and denominator fields drive the common denominator, equivalent numerators, original and converted fraction bars, unsimplified numerator-addition trace, simplified exact result, mixed number, and decimal check from one explicit state model.

All visible controls perform real actions: direct field editing; clear and swap; numeric entry, backspace, fraction-field navigation, sign change, decimal-tenths conversion, and operand navigation from the keypad; three keypad modes; evaluate counting; five visibly stateful lesson views; rotating new problems; and practice-problem loading. Denominators are guarded against zero, negative proper fractions retain their sign, and every output recalculates immediately.

Final 1536x1024 browser validation edits the model to `2/3 + 1/6 = 5/6`, evaluates it, swaps operands, changes keypad modes, navigates fraction fields, verifies negative-fraction output, switches lesson views, rotates the problem, loads the practice problem, and clears the model. The screenshot loop matches the target geometry exactly: header y=102-221, tabs y=231-280, workspace y=289-852, entry/visual/output panels y=323-842 at target widths 298/567/302, practice y=863-929, and navigation y=939-999. It reports no horizontal overflow and zero console messages.

Evidence:

- `0002-reference.png`
- `0002-desktop.png`
- `0002-dedicated-target-validation.json`

## Lesson 3 / Mockup 0003 - Mixed Numbers

Reworked individually against the target mockup with a dedicated `dual-mixed-number-whole-block-fraction-strip-improper-lcd-exact-decimal-model`. Six editable whole/numerator/denominator fields drive the whole blocks, fractional strips, improper forms, least common denominator, expanded numerators, unsimplified sum, simplified exact fraction, mixed number, decimal check, and right-side proof cards from one calculation model.

All visible controls perform real actions: direct field editing; calculator, fraction, and symbol keypad families with distinct keysets; digit entry; sign change; active-part and operand navigation; focused clearing; evaluation counting; five visibly stateful lesson views; and practice solution reveal. Denominators are guarded against zero and all visual and textual representations update immediately.

Final 1503x1047 browser validation changes the model to `1 1/2 + 2 1/4 = 15/4 = 3 3/4`, evaluates it, switches to the fraction keypad, navigates to a denominator, switches lesson view, reveals the practice answer, and clears the active denominator safely. The screenshot loop matches the target geometry: lesson x=284-1481, header y=102-196, tabs y=200-244, workspace y=257-904, proof sidebar x=1221-1480 and y=102-975, practice y=915-971, and navigation y=994-1037. It reports no horizontal overflow and zero console messages.

Evidence:

- `0003-reference.png`
- `0003-desktop.png`
- `0003-dedicated-target-validation.json`

## Lesson 4 / Mockup 0004 - Percentage Calculator

Reworked individually against the target mockup with a dedicated `draggable-percent-base-hundred-grid-part-equation-practice-model`. The percent and base values drive the 10x10 hundred grid, segmented percent scale, whole and result bars, equation, quick-look table, concept trace, adjustment panel, and result card from one live calculation model.

Both target handles are real range controls and both values also support direct numeric editing. Reset, Share, language/view selection, all lesson tabs, the percent drag, base drag, practice answer input, and Check action perform real state changes. The inverse-percent practice grader rejects an incorrect answer and explains the correct `36 / 0.15 = 240` calculation after success.

Final 1506x1045 browser validation drags percent from 15 to 25 and verifies part 60, drags base from 240 to 320 and verifies part 80, restores the target model through direct inputs, switches lesson view, rejects 200, and accepts 240. The screenshot loop matches the target geometry: lesson/header x=285-1484 and y=107-273, tabs y=285-328, visual model x=285-1127 and y=338-856, trace/controls x=1141-1480 and y=338-967, practice y=866-966, and navigation y=977-1038. It reports no horizontal overflow and zero console messages.

Evidence:

- `0004-reference.png`
- `0004-desktop.png`
- `0004-dedicated-target-validation.json`

## Lesson 5 / Mockup 0005 - Ratio Calculator

Reworked individually against the target mockup with a dedicated `dual-draggable-ratio-gcf-equal-groups-tiles-double-number-line-practice-model`. The two ratio quantities drive their greatest common factor, grouped comparison bars, simplest form, tile arrays, double number lines, equation proof, concept trace, action counter, and comparison wording from one live model.

Both target quantity handles are real range controls, and both quantities also have direct inputs and working increment/decrement steppers. Reset, Share, Workspace, view tabs, expand action, rotating examples, four-field practice entry, and grading all perform real actions. Every quantity change recomputes the factor and all representations immediately.

Final 1536x1024 browser validation drags `24:36` to `30:45` and verifies GCF 15 with simplest form `2:3`, increments A to verify a `31:45` coprime result, resets, switches view, rejects an incorrect practice simplification, accepts `18:30 = 3:5`, and loads the next example. The target frame matches at x=280-1521: header y=109-295, tabs y=301-353, ratio lab y=353-826, and practice y=835-1016. It reports no horizontal overflow and zero console messages.

Evidence:

- `0005-reference.png`
- `0005-desktop.png`
- `0005-dedicated-target-validation.json`

## Lesson 6 / Mockup 0006 - Powers and Roots

Reworked individually against the target mockup with a dedicated `linked-square-root-area-grid-repeated-power-cube-combined-expression-practice-model`. The radicand drives the square-root value, side length, area grid, trace, and combined expression; base and exponent drive repeated factors, the cube model, power trace, and final sum.

All four target steppers are real controls with guarded ranges. Reset, Share, Workspace, all lesson tabs, action status, and practice reveal/hide also perform real actions. Irrational roots are calculated and formatted rather than being restricted to the initial perfect square.

Final 1068x1472 browser validation increments 144 to 145 and verifies the irrational root/total, resets, changes base from 2 to 3 and verifies `3^3 = 27`, decreases the exponent and verifies `3^2 = 9`, switches lesson view, and hides/reveals the practice answer. The screenshot loop matches the tall target frame exactly: lesson/header x=228-1052 and y=102-338, tabs y=348-403, lab y=414-1286, models x=241-835, proof trace x=849-1039, practice y=1159-1270, and navigation y=1296-1347. It reports no horizontal overflow and zero console messages.

Evidence:

- `0006-reference.png`
- `0006-desktop.png`
- `0006-dedicated-target-validation.json`

## Lesson 7 / Mockup 0007 - Scientific Notation

Reworked individually against the target mockup with a dedicated `coefficient-power-ten-number-line-decimal-shift-standard-form-ladder-practice-model`. Coefficient and exponent drive the number-line marker, directional decimal movement sequence, equation, standard form, four concept cards, and active powers-of-ten ladder from one calculation model.

Both target steppers perform real bounded changes, including negative exponents and leftward decimal movement. Reset, Share, language/view tabs, Instructions, and Check Answer also perform real state changes. Standard form is calculated and locale-formatted rather than hard-coded.

Final 1508x1043 browser validation changes coefficient 6.02 to 6.03 and verifies 603,000, decreases exponent from 5 to 4 and verifies 60,300, resets, opens instructions, switches lesson view, and checks the practice answer. The screenshot loop matches the target frame: header/tabs x=302-1462, header y=102-294, tabs y=304-362, lab x=309-1173 and y=371-1024, proof sidebar x=1183-1462, and practice x=322-1160. It reports no horizontal overflow and zero console messages.

Evidence:

- `0007-reference.png`
- `0007-desktop.png`
- `0007-dedicated-target-validation.json`

## Lesson 8 / Mockup 0008 - Logarithms

Reworked individually against the target mockup with a dedicated `bidirectional-base-exponent-power-logarithm-ladder-drag-practice-model`. Base and exponent determine the target power; moving the target control steps through valid powers and recovers the corresponding exponent. The ladder, logarithm question, power check, output, inverse-operation proof, and concept trace all share that state.

The Base, Target, and Exponent cards each provide visible steppers plus real range-based drag interaction behind the card value. Reset, Share, language/view tabs, How to interact, expand/action state, and practice reveal also perform real actions. Values remain exact and bounded throughout the inverse relationship.

Final 1508x1043 browser validation drags base 10 to 2 and verifies target 8, drags target to the fourth power and verifies 16/exponent 4, increments exponent and verifies 32, resets, opens interaction help, switches lesson view, and hides/reveals the practice answer. The screenshot loop matches the target frame: lesson x=331-1474 and y=79-1024, header y=79-286, tabs y=295-354, inverse lab y=367-915, and practice y=927-1024. It reports no horizontal overflow and zero console messages.

Evidence:

- `0008-reference.png`
- `0008-desktop.png`
- `0008-dedicated-target-validation.json`

## Lesson 9 / Mockup 0009 - Exponential Calculations

Reworked individually against the target mockup with a dedicated `base-exponent-factor-chain-draggable-staircase-growth-chart-animation-practice-model`. Base and exponent drive the repeated-factor chain, equation, output, staircase, transition multipliers, growth chart, draggable exponent row, and concept trace from one live calculation model.

Both steppers and the exponent range perform real bounded changes. Animate growth reveals each staircase/chart stage in sequence; Reset, Share, all lesson views, nine exponent-step buttons, rotating practice problems, answer editing, and grading all perform real actions. Changing either input immediately recomputes every representation.

Final 1472x1069 browser validation changes the base to 3, drags the exponent to 4 and verifies 81, selects exponent 2 and verifies 9, runs animation through the selected exponent, resets to `2^8 = 256`, switches view, rejects 80, accepts 81, and advances the practice problem. The screenshot loop matches the target frame exactly: surface x=271-1449 and y=112-1050, header x=271-1173 and y=112-232, tabs y=240-276, lab y=282-897, practice y=903-1050, and concept trace x=1182-1449. It reports no horizontal overflow and zero console messages.

Evidence:

- `0009-reference.png`
- `0009-desktop.png`
- `0009-dedicated-target-validation.json`

## Lesson 10 / Mockup 0010 - Trigonometric Calculator

Reworked individually against the target mockup with a dedicated `dual-draggable-unit-circle-special-angle-triangle-mode-trace-practice-model`. The sine and cosine angles drive separate unit-circle rays and handles, their exact-value right triangles, decimal values, combined output, and concept trace. DEG and RAD perform genuinely different calculations, so the target mode warning reflects the current result.

Both angle handles can be dragged directly on the unit circle and are backed by real range controls for keyboard and pointer accessibility. DEG/RAD, Reset, Share, Workspace, all lesson views, practice answer entry, grading, and rotating problems perform real state changes. The special-angle exact forms and decimal approximations update together.

Final 1068x1472 browser validation drags sine to 45 degrees and cosine to 30 degrees, verifies the linked output, switches to RAD and verifies a different calculation, resets to `sin(30°) + cos(60°) = 1`, switches view, rejects 1, accepts 1.414, and advances the practice problem. The final frame matches the target: surface x=227-1046 and y=100-1460, header y=100-335, tabs y=344-400, lab y=410-1270, workspace x=238-1035 and y=476-1036, practice/table y=1046-1261, navigation y=1280-1333, and footer y=1355-1472. It reports no horizontal overflow and zero console messages.

Evidence:

- `0010-reference.png`
- `0010-desktop.png`
- `0010-dedicated-target-validation.json`

## Lesson 11 / Mockup 0011 - Inverse Trigonometry

Reworked individually against the target mockup with a dedicated `draggable-ratio-principal-angle-unit-circle-triangle-range-verification-practice-model`. The sine ratio drives the principal angle, unit-circle point and ray, horizontal guide, right-triangle side values, inverse result, forward-sine verification, principal-range marker, and concept trace from one calculation model.

The main ratio range and purple unit-circle ray both support real drag interaction. DEG/RAD, Reset, Share, Workspace, all lesson views, the independent practice-ratio slider, answer editing, reveal, and grading all perform real state changes. Domain limits are enforced at `[-1, 1]`, and the output remains inside asin's principal range.

Final 1068x1472 browser validation drags the ratio to 0.75 and verifies 48.59 degrees, switches to RAD and verifies 0.848 radians, physically drags the unit-circle ray to ratio -0.5 and verifies -30 degrees, resets, switches view, changes the practice ratio to 0.5, rejects 45, and accepts 30. The target frame is matched at surface x=227-1051 and y=100-1472, header y=100-332, tabs y=341-395, lab y=405-1281, three models y=492-891, result y=901-992, range y=1001-1137, practice y=1146-1279, navigation y=1291-1343, and footer y=1357-1468. It reports no horizontal overflow and zero console messages.

Evidence:

- `0011-reference.png`
- `0011-desktop.png`
- `0011-dedicated-target-validation.json`

## Lesson 12 / Mockup 0012 - Hyperbolic Functions

Reworked individually against the target mockup with a dedicated `draggable-x-dual-exponential-hyperbolic-sine-difference-trace-practice-model`. The input x drives `e^x`, `e^-x`, both continuous exponential curves and probes, their vertical difference, the defining fraction, `sinh(x)`, decomposition cards, average strip, and concept trace from one calculation model.

The blue x handle is a real bounded range control. Reset, Share, Workspace, every lesson view, answer reveal/hide, and rotating practice problems perform real actions. Negative x values correctly exchange the growing and decaying exponential roles and produce negative hyperbolic sine values.

Final 1068x1472 browser validation drags x to 1.5 and verifies `e^x = 4.482`, `e^-x = 0.223`, and `sinh(x) = 2.129`; drags to -1 and verifies -1.175; resets; switches view; hides the answer; advances practice; and reveals the new result. The final target frame matches at surface x=228-1052 and y=100-1472, header y=100-326, tabs y=336-392, lab y=398-1288, graph y=509-939, practice y=1133-1272, navigation y=1295-1345, and footer y=1355-1466. It reports no horizontal overflow and zero console messages.

Evidence:

- `0012-reference.png`
- `0012-desktop.png`
- `0012-dedicated-target-validation.json`

## Lesson 13 / Mockup 0013 - Factorial, Permutation and Combination

Reworked individually against the target mockup with a dedicated `draggable-distinct-items-factorial-permutation-combination-counting-trace-practice-model`. Distinct numbered items can be dragged or clicked into counting slots. The selected mode and n/r parameters drive decreasing-choice counts, slot quantity, expansion, result, order interpretation, equation strip, and concept trace.

Factorial, Permutation, and Combination are real modes rather than relabeled views: `n!`, `nPr`, and `nCr` use their correct formulas and update immediately. Native drag/drop, click placement, n/r editing, Reset, Share, Workspace, lesson views, and answer reveal/hide all perform real actions.

Final 1007x1562 browser validation drags Item 1 into a slot, click-places Item 2, verifies `5! = 120`, `6P2 = 30`, and `6C3 = 20`, resets to `6! = 720`, switches view, and hides/reveals the practice answer. The target frame matches at surface x=222-992 and y=99-1559, header y=99-327, tabs y=336-391, lab y=400-1395, work y=479-1055, comparison y=1074-1248, practice y=1258-1386, navigation y=1404-1456, and footer y=1464-1555. It reports no horizontal overflow and zero console messages.

Evidence:

- `0013-reference.png`
- `0013-desktop.png`
- `0013-dedicated-target-validation.json`

## Lesson 14 / Mockup 0014 - Absolute Value

Reworked individually against the target mockup with a dedicated `dual-draggable-signed-point-mirror-distance-arc-direction-trace-symmetry-practice-model`. The signed input drives its reflected point, distance from zero, arc, equation, direction, nonnegative output, trace chain, and symmetry proof from one live model.

Both the blue input point and purple mirrored point are real range controls. Dragging the mirrored point updates the signed source consistently. Distance/Direction modes, Reset, Share, Workspace, lesson views, two practice-answer fields, Check, and reveal/hide all perform real state changes.

Final 1065x1477 browser validation drags the primary point to -7 and verifies distance 7, drags the mirrored control across zero and verifies source 5 with `Right of zero`, moves to zero and verifies `At zero`, switches direction mode, resets to `|-12| = 12`, switches view, rejects 6, accepts both 7 answers, and hides the explanation. The target frame matches at surface x=229-1053 and y=99-1469, header y=99-336, tabs y=345-401, lab y=411-1269, model columns y=512-1052, number line y=621-826, symmetry y=903-1008, practice y=1064-1251, navigation y=1279-1332, and footer y=1346-1457. It reports no horizontal overflow and zero console messages.

Evidence:

- `0014-reference.png`
- `0014-desktop.png`
- `0014-dedicated-target-validation.json`

## Lesson 15 / Mockup 0015 - Rounding and Precision

Reworked individually against the target mockup with a dedicated `editable-fraction-exact-decimal-precision-slider-next-digit-reported-error-practice-model`. Editable numerator and denominator drive the exact quotient, decimal representation, selected report, next digit, rounding decision, absolute error, local number-line markers, equation, and concept trace.

The 1-4 decimal-place selector is a real range control and the denominator is guarded against zero. Reset, Share, Workspace, all lesson views, numerator/denominator editing, answer reveal/hide, and rotating practice problems all perform real state changes.

Final 1068x1473 browser validation changes the fraction to 1/6, drags precision to 3 places and verifies exact `0.16667…`, reported `0.167`, next digit 6, and error 0.000333; verifies zero denominator becomes 1; resets to `10/3 → 3.33`; switches view; hides the answer; advances practice; and reveals the new result. The target frame matches at surface x=226-1053 and y=99-1470, header y=99-332, tabs y=342-395, lab y=404-1408, columns y=417-1190, exact card y=488-621, precision y=631-921, number line y=1016-1190, practice y=1207-1408, and navigation y=1418-1469. It reports no horizontal overflow and zero console messages.

Evidence:

- `0015-reference.png`
- `0015-desktop.png`
- `0015-dedicated-target-validation.json`

## Lesson 16 / Mockup 0016 - Constants Library

Reworked individually against the target mockup with a dedicated `selectable-high-precision-constant-formula-visual-output-early-rounding-practice-model`. Selecting pi, e, tau, or phi updates the mathematical visual, stored high-precision value, defining formula, worked output, and concept trace from one explicit model. Pi and tau use the linked circle construction, e uses an exponential curve, and phi uses a golden-rectangle construction.

The 10-50 digit precision selector is a real range control. Constant selection, Reset, Share, Workspace, every lesson view, and practice answer reveal/hide all perform real state changes. The comparison panel demonstrates the numerical difference between rounding pi early and calculating with its stored precision.

Final 1050x1498 browser validation selects every constant and verifies pi `6.28319`, e `2.71828`, tau `6.28319`, and phi `1.61803`; changes stored precision to 20 digits; resets to pi at 40 digits; switches lesson view; and hides/reveals the practice answer. The final frame matches the target at surface x=231-1035 and y=99-1491, header y=99-337, tabs y=346-399, lab y=409-1308, model columns y=410-1185, visual y=543-948, precision y=968-1178, practice y=1198-1315, navigation y=1318-1371, and footer y=1385-1497. It reports no horizontal overflow and zero console messages.

Evidence:

- `0016-reference.png`
- `0016-desktop.png`
- `0016-dedicated-target-validation.json`

## Lesson 17 / Mockup 0017 - Calculation History

Reworked individually against the target mockup with a dedicated `selectable-provenance-history-row-reuse-copy-pin-inspection-dependency-chain-graded-practice-model`. Selecting any history row updates the large expression/result display, latest-input and latest-result trace, source inspection, and action context from one explicit provenance model.

Reuse input, Copy result, Pin note, and Inspect source are real actions on every row and in the action key. Copy uses the browser clipboard when permitted while preserving its visible source row; pin toggles persisted row state; reuse loads the exact originating expression. Reset, Share, Workspace, all lesson views, and four practice choices perform real state changes, and practice grades immediately to match the mockup.

Final 1536x1024 integrated browser validation inspects row 2, reuses `12 + 5` from row 3, copies `68` from row 4, pins row 2, switches to Examples, rejects row 3, accepts row 1, and resets the full state. The final frame matches the target at surface x=280-1490 and y=110-1036, header y=110-312, tabs y=321-370, lab y=380-809, table y=547-740, sidebar y=380-954, practice y=822-954, and navigation y=966-1027. It reports no horizontal overflow and zero console messages.

Evidence:

- `0017-reference.png`
- `0017-desktop.png`
- `0017-dedicated-target-validation.json`
