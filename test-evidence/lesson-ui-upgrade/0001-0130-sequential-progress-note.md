# Sequential lesson rebuild 0001-0130

Dedicated rebuild target: **8 of 130 lessons completed; 122 pending.**

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
