# Sequential lesson rebuild 0001-0130

Dedicated rebuild target: **2 of 130 lessons completed; 128 pending.**

| Mockup |                Lesson | Status   | Dedicated model and validation                                                                                                                                                                                                    |
| ------ | --------------------: | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001   |    1 Basic Calculator | Complete | Editable arithmetic expression and BODMAS parse-trace model; real keypad families, direct expression input, automatic trace, history recall/reset, practice rotation, grading, solution, and exact 1489x1056 target geometry      |
| 0002   | 2 Fraction Calculator | Complete | Linked two-fraction model with live LCD, equivalent bars, numerator-only addition, exact/mixed/decimal outputs, editable fields, functional keypad/modes, problem rotation, practice loading, and exact 1536x1024 target geometry |

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
