# Matrices and Linear Algebra UI Upgrade

Target references: `0532` through `0549` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0532 | 347 Matrix Builder | `MatrixBuilderTargetLesson347` | Editable/resizable matrix, cell drag, transpose, augmentation, rectangular identity, random/zero fill, validation, JSON export, tabs, reset, and graded checks | 864 x 1821; no overflow or console errors | Complete |
| 0533 | 348 Matrix Addition and Subtraction | Pending | Pending | Pending | Pending |
| 0534 | 349 Scalar Multiplication | Pending | Pending | Pending | Pending |
| 0535 | 350 Matrix Multiplication | Pending | Pending | Pending | Pending |
| 0536 | 351 Identity Matrix | Pending | Pending | Pending | Pending |
| 0537 | 352 Matrix Transpose | Pending | Pending | Pending | Pending |
| 0538 | 353 Determinant | Pending | Pending | Pending | Pending |
| 0539 | 354 Matrix Inverse | Pending | Pending | Pending | Pending |
| 0540 | 355 Row Operations | Pending | Pending | Pending | Pending |
| 0541 | 356 Reduced Row Echelon Form | Pending | Pending | Pending | Pending |
| 0542 | 357 Augmented Matrices | Pending | Pending | Pending | Pending |
| 0543 | 358 Linear Transformations | Pending | Pending | Pending | Pending |
| 0544 | 359 Eigenvalues and Eigenvectors | Pending | Pending | Pending | Pending |
| 0545 | 360 Basis and Dimension | Pending | Pending | Pending | Pending |
| 0546 | 361 Linear Independence | Pending | Pending | Pending | Pending |
| 0547 | 362 Vector Spaces | Pending | Pending | Pending | Pending |
| 0548 | 363 Gram-Schmidt Process | Pending | Pending | Pending | Pending |
| 0549 | 364 Least Squares | Pending | Pending | Pending | Pending |

Completed in this family: **1 / 18**. Pending in this family: **17 / 18**.

## Lesson 347 validation

- Reference: `0532-reference.png`
- Current capture: `0532-desktop.png`
- Machine-readable interaction and layout audit: `0532-dedicated-target-validation.json`
- Adapter tests exercise the dedicated route and object-model contract.
- The capture harness verifies edit, transpose, augmentation, identity fill, resize, pointer drag, rejected/correct answers, tab switching, and shell reset.
