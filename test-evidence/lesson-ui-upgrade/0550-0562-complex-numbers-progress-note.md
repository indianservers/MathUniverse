# Complex Numbers UI Upgrade

Target references: `0550` through `0562` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0550 | 365 Complex Plane | `ComplexPlaneTargetLesson365` | Draggable Argand point, live real/imaginary components, Euler rotation, modulus/argument, rotated coordinates, zoom/reset/expand, four display toggles, tabs, worked derivation, and graded quadrant challenge | 1536 x 1024; no overflow or console errors | Complete |
| 0551 | 366 Real and Imaginary Parts | Pending | Pending | Pending | Pending |
| 0552 | 367 Complex Addition | Pending | Pending | Pending | Pending |
| 0553 | 368 Complex Multiplication | Pending | Pending | Pending | Pending |
| 0554 | 369 Complex Conjugate | Pending | Pending | Pending | Pending |
| 0555 | 370 Modulus and Argument | Pending | Pending | Pending | Pending |
| 0556 | 371 Polar Form | Pending | Pending | Pending | Pending |
| 0557 | 372 Euler Form | Pending | Pending | Pending | Pending |
| 0558 | 373 Powers | Pending | Pending | Pending | Pending |
| 0559 | 374 Roots | Pending | Pending | Pending | Pending |
| 0560 | 375 Polynomial Roots | Pending | Pending | Pending | Pending |
| 0561 | 376 Mobius Transformations | Pending | Pending | Pending | Pending |
| 0562 | 377 Complex Functions | Pending | Pending | Pending | Pending |

Completed in this family: **1 / 13**. Pending in this family: **12 / 13**.

## Lesson 365 validation

- Reference: `0550-reference.png`
- Current capture: `0550-desktop.png`
- Machine-readable interaction and layout audit: `0550-dedicated-target-validation.json`
- The capture harness verifies the exact initial complex value, Euler-rotated value, modulus and argument; recomputation after changing `a` and `theta`; component visibility; physical point drag and resulting recomputation; graph zoom; a correctly graded quadrant-II challenge; tabs; shell reset; exact 1536 x 1024 dimensions; and absence of overflow or console errors.
