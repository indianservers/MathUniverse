# Complex Numbers UI Upgrade

Target references: `0550` through `0562` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0550 | 365 Complex Plane | `ComplexPlaneTargetLesson365` | Draggable Argand point, live real/imaginary components, Euler rotation, modulus/argument, rotated coordinates, zoom/reset/expand, four display toggles, tabs, worked derivation, and graded quadrant challenge | 1536 x 1024; no overflow or console errors | Complete |
| 0551 | 366 Real and Imaginary Parts | `RealImaginaryTargetLesson366` | Draggable complex point, synchronized real/imaginary steppers and sliders, live horizontal/vertical projections, quadrant and sign classification, three real display toggles, decomposition warning, worked geometry, tabs/reset, and independently graded three-field practice | 982 x 1601; no overflow or console errors | Complete |
| 0552 | 367 Complex Addition | `ComplexAdditionTargetLesson367` | Two independently editable/draggable complex addends, derived coordinate sum, tip-to-tail and origin-vector modes, parallelogram and component-sum toggles, synchronized numeric/range controls, live arithmetic, fullscreen, tabs/reset, and revealable practice sum | 1002 x 1569; no overflow or console errors | Complete |
| 0553 | 368 Complex Multiplication | `ComplexMultiplicationTargetLesson368` | Two independently editable/draggable factors, exact rectangular expansion, modulus scaling and argument addition, product vector and trace, scale circles, algebra/rotation/scale/trace toggles, live polar results, tabs/reset, exploratory multiplier, and graded rotation-direction challenge | 1001 x 1570; no overflow or console errors | Complete |
| 0554 | 369 Complex Conjugate | Pending | Pending | Pending | Pending |
| 0555 | 370 Modulus and Argument | Pending | Pending | Pending | Pending |
| 0556 | 371 Polar Form | Pending | Pending | Pending | Pending |
| 0557 | 372 Euler Form | Pending | Pending | Pending | Pending |
| 0558 | 373 Powers | Pending | Pending | Pending | Pending |
| 0559 | 374 Roots | Pending | Pending | Pending | Pending |
| 0560 | 375 Polynomial Roots | Pending | Pending | Pending | Pending |
| 0561 | 376 Mobius Transformations | Pending | Pending | Pending | Pending |
| 0562 | 377 Complex Functions | Pending | Pending | Pending | Pending |

Completed in this family: **4 / 13**. Pending in this family: **9 / 13**.

## Lesson 365 validation

- Reference: `0550-reference.png`
- Current capture: `0550-desktop.png`
- Machine-readable interaction and layout audit: `0550-dedicated-target-validation.json`
- The capture harness verifies the exact initial complex value, Euler-rotated value, modulus and argument; recomputation after changing `a` and `theta`; component visibility; physical point drag and resulting recomputation; graph zoom; a correctly graded quadrant-II challenge; tabs; shell reset; exact 1536 x 1024 dimensions; and absence of overflow or console errors.

## Lesson 366 validation

- Reference: `0551-reference.png`
- Current capture: `0551-desktop.png`
- Machine-readable interaction and layout audit: `0551-dedicated-target-validation.json`
- The capture harness verifies stepper and slider synchronization, live quadrant changes, projection visibility, physical point drag with recomputed components, rejected and accepted practice answers, solution reveal, tabs, shell reset, exact 982 x 1601 dimensions, and absence of overflow or console errors.

## Lesson 367 validation

- Reference: `0552-reference.png`
- Current capture: `0552-desktop.png`
- Machine-readable interaction and layout audit: `0552-dedicated-target-validation.json`
- The capture harness verifies independent numeric and range edits, exact recomputed sums, parallelogram visibility, a physical addend drag with a changed resultant, practice reveal, tabs, shell reset, exact 1002 x 1569 dimensions, and absence of overflow or console errors.

## Lesson 368 validation

- Reference: `0553-reference.png`
- Current capture: `0553-desktop.png`
- Machine-readable interaction and layout audit: `0553-dedicated-target-validation.json`
- The capture harness verifies rectangular products, modulus and argument values, independent factor editing, a negative-angle multiplier, algebra visibility, physical multiplier drag with recomputed product, rejected and accepted clockwise-rotation answers, tabs, shell reset, exact 1001 x 1570 dimensions, and absence of overflow or console errors.
- The challenge correctly treats multiplication by `2-i` as a clockwise rotation because `arg(2-i)<0`.
