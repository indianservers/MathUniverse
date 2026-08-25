# Sequential lesson rebuild 0001-0130

Dedicated rebuild target: **4 of 130 lessons completed; 126 pending.**

| Mockup |                  Lesson | Status   | Dedicated model and validation                                                                                                                                                                                                    |
| ------ | ----------------------: | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001   |      1 Basic Calculator | Complete | Editable arithmetic expression and BODMAS parse-trace model; real keypad families, direct expression input, automatic trace, history recall/reset, practice rotation, grading, solution, and exact 1489x1056 target geometry      |
| 0002   |   2 Fraction Calculator | Complete | Linked two-fraction model with live LCD, equivalent bars, numerator-only addition, exact/mixed/decimal outputs, editable fields, functional keypad/modes, problem rotation, practice loading, and exact 1536x1024 target geometry |
| 0003   |         3 Mixed Numbers | Complete | Dual mixed-number model with linked whole blocks/fraction strips, improper conversion, LCD expansion, exact/mixed/decimal results, active-field keypad modes, proof sidebar, practice reveal, and exact 1503x1047 target geometry |
| 0004   | 4 Percentage Calculator | Complete | Draggable percent/base model with live hundred grid, segmented percent scale, whole/part bars, equation, quick table, trace, direct inputs, result, and graded inverse-percent practice at exact 1506x1045 target geometry        |

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
