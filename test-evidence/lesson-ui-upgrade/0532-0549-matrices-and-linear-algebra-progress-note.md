# Matrices and Linear Algebra UI Upgrade

Target references: `0532` through `0549` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0532 | 347 Matrix Builder | `MatrixBuilderTargetLesson347` | Editable/resizable matrix, cell drag, transpose, augmentation, rectangular identity, random/zero fill, validation, JSON export, tabs, reset, and graded checks | 864 x 1821; no overflow or console errors | Complete |
| 0533 | 348 Matrix Addition and Subtraction | `MatrixAdditionTargetLesson348` | Two editable operands, live add/subtract result, animation and step toggles, six cell traces, row-vector geometry, dimension validation, vectorization, tabs, reset, and graded subtraction check | 864 x 1821; no overflow or console errors | Complete |
| 0534 | 349 Scalar Multiplication | `ScalarMultiplicationTargetLesson349` | Editable 2x2 matrix, synchronized scalar number/range, cell products, vector and grid scaling SVGs, determinant derivation and verification, result flow, tabs, reset, and graded negative-scalar check | 864 x 1821; no overflow or console errors | Complete |
| 0535 | 350 Matrix Multiplication | `MatrixMultiplicationTargetLesson350` | Independently resizable/editable operands, compatibility failure/recovery, highlighted row-column dot products, formula and step controls, playback, derived result grid/log, transformation composition, tabs, reset, and graded check | 864 x 1821; no overflow or console errors | Complete |
| 0536 | 351 Identity Matrix | `IdentityMatrixTargetLesson351` | Editable 2x2 matrix, independently derived left/right identity products, expanded row-column proof, unchanged basis-vector SVGs, tabs, reset, and fully validated nine-entry I3 challenge | 1021 x 1540; no overflow or console errors | Complete |
| 0537 | 352 Transpose | `TransposeTargetLesson352` | Symbolic/numeric 2x3 matrix, derived 3x2 transpose, selectable source/target entries, curved mapping paths, live inspector, animated mapping cycle, randomize, numeric fill, reset, and tabs | 1619 x 972; no overflow or console errors | Complete |
| 0538 | 353 Determinant | `DeterminantTargetLesson353` | Editable 2x2 matrix, live ad/bc derivation, draggable column-vector endpoints, signed-area polygon, orientation and singularity states, unit/parallelogram views, animation, worked derivation, and independent zero-determinant challenge | 1146 x 1373; no overflow or console errors | Complete |
| 0539 | 354 Matrix Inverse | `MatrixInverseTargetLesson354` | Editable 2x2 matrix, determinant gate, formula inverse, genuine Gauss-Jordan states with hints and autoplay, singular failure state, geometric transform/undo SVGs, random/example controls, and A^-1y challenge | 1024 x 1536; no overflow or console errors | Complete |
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

Completed in this family: **8 / 18**. Pending in this family: **10 / 18**.

## Lesson 347 validation

- Reference: `0532-reference.png`
- Current capture: `0532-desktop.png`
- Machine-readable interaction and layout audit: `0532-dedicated-target-validation.json`
- Adapter tests exercise the dedicated route and object-model contract.
- The capture harness verifies edit, transpose, augmentation, identity fill, resize, pointer drag, rejected/correct answers, tab switching, and shell reset.

## Lesson 348 validation

- Reference: `0533-reference.png`
- Current capture: `0533-desktop.png`
- Machine-readable interaction and layout audit: `0533-dedicated-target-validation.json`
- The capture harness verifies operand editing, derived addition, subtraction switching, animation and step modes, rejected/correct answers, tab switching, and shell reset.

## Lesson 349 validation

- Reference: `0534-reference.png`
- Current capture: `0534-desktop.png`
- Machine-readable interaction and layout audit: `0534-dedicated-target-validation.json`
- The capture harness verifies matrix editing, scalar number and range inputs, positive and negative scaling, determinant scaling, rejected/correct answers, tab switching, and shell reset.

## Lesson 350 validation

- Reference: `0535-reference.png`
- Current capture: `0535-desktop.png`
- Machine-readable interaction and layout audit: `0535-dedicated-target-validation.json`
- The capture harness verifies operand editing, incompatible dimensions, resize recovery with zero-filled new entries, cell navigation, formula and step controls, composition equality, rejected/correct answers, tabs, and shell reset.
- The target screenshot contains two arithmetic errors: its default product shows `C21 = 12` although `[0,-1,4] dot [2,-1,3] = 13`, and its quick check marks `10` although `[1,3,4] dot [2,-1,1] = 3`. The interactive lesson uses the mathematically correct derived values instead of hard-coding those errors.

## Lesson 351 validation

- Reference: `0536-reference.png`
- Current capture: `0536-desktop.png`
- Machine-readable interaction and layout audit: `0536-dedicated-target-validation.json`
- The capture harness verifies matrix editing, both identity multiplication orders, the unchanged invariant, incomplete-practice rejection, all nine I3 entries, correct acceptance, tab switching, and shell reset.

## Lesson 352 validation

- Reference: `0537-reference.png`
- Current capture: `0537-desktop.png`
- Machine-readable interaction and layout audit: `0537-dedicated-target-validation.json`
- The capture harness verifies animation pause, source-entry selection, matching inspector state, numeric mode, randomized values, the transpose invariant after randomization, reset, tab switching, and shell reset.

## Lesson 353 validation

- Reference: `0538-reference.png`
- Current capture: `0538-desktop.png`
- Machine-readable interaction and layout audit: `0538-dedicated-target-validation.json`
- The capture harness verifies matrix editing, determinant products, draggable vector geometry, view switching, animation progress, a truly zero challenge determinant, challenge acceptance, tab switching, and shell reset.

## Lesson 354 validation

- Reference: `0539-reference.png`
- Current capture: `0539-desktop.png`
- Machine-readable interaction and layout audit: `0539-dedicated-target-validation.json`
- The capture harness verifies the formula inverse, determinant and expected challenge solution, transition to a singular matrix, inverse removal, example recovery, hint control, real Gauss-Jordan stepping and autoplay, rejected/correct challenge answers, solution reveal, tabs, and shell reset.
