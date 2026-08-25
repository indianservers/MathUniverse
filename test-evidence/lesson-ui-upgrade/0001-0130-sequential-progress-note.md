# Sequential lesson rebuild 0001-0130

Dedicated rebuild target: **1 of 130 lessons completed; 129 pending.**

| Mockup |             Lesson | Status   | Dedicated model and validation                                                                                                                                                                                               |
| ------ | -----------------: | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001   | 1 Basic Calculator | Complete | Editable arithmetic expression and BODMAS parse-trace model; real keypad families, direct expression input, automatic trace, history recall/reset, practice rotation, grading, solution, and exact 1489x1056 target geometry |

## Lesson 1 / Mockup 0001 - Basic Calculator

Reworked individually against the target mockup with a dedicated `editable-arithmetic-expression-bodmas-parse-trace-history-practice-model`. The editable expression, numeric keypad, six real keypad families, BODMAS trace, current result, calculation history, automatic-step setting, practice set, grading result, and solution state are linked to explicit lesson state. The initial `(12 + 8) / 4` construction resolves brackets first and then division to produce 5.

All lesson views, expression editing, Enter-to-evaluate, number and operator keys, clear, backspace, sign, evaluate, history recall, preset reset, automatic trace toggle, six keypad mode selectors, rotating practice challenges, numerical grading, solution toggle, Try another, and Next example controls perform real actions. No initial-screen control is decorative.

Final 1489x1056 browser validation verifies the initial expression and result; directly evaluates `7 + 4 x 6 - 3 = 28`; disables automatic trace; switches to the Functions keypad and back; physically enters `9 + 3` through keypad buttons and verifies 12; confirms history entries; rejects 27 and accepts 28 for the BODMAS challenge; closes the revealed solution; advances the challenge; and resets every state. The screenshot loop matches the target section geometry exactly: header y=109-274, tabs y=292-341, calculator workspace y=356-930, success strip y=946-1025, rule panel y=292-597, and practice panel y=613-940. It reports no horizontal overflow and zero console messages.

Evidence:

- `0001-reference.png`
- `0001-desktop.png`
- `0001-dedicated-target-validation.json`
