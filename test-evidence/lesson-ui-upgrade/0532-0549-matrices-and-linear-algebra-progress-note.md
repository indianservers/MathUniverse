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
| 0540 | 355 Row Operations | `RowOperationsTargetLesson355` | Real swap/nonzero-scale/replacement preview and commit engine, draggable row reordering, linked equations, reversible history and undo, equation toggle, operation rules, zero-scale warning, and independent leading-one practice | 1024 x 1536; no overflow or console errors | Complete |
| 0541 | 356 Reduced Row Echelon Form | `RrefTargetLesson356` | Real Gauss-Jordan state sequence, selectable operations, pivot/rank/nullity derivation, all four RREF condition checks, unique-solution interpretation, tabs, reset, and graded next-pivot challenge | 1024 x 1536; no overflow or console errors | Complete |
| 0542 | 357 Augmented Matrices | `AugmentedMatricesTargetLesson357` | Editable equation-system model deriving A, x, b, and [A|b], determinant classification, computed line intersection, selected-row highlighting, equation insertion, genuine third-variable/free-variable mode, worked derivation, details, tabs, reset, and graded six-entry challenge | 1024 x 1536; no overflow or console errors | Complete |
| 0543 | 358 Linear Transformations | `LinearTransformationsTargetLesson358` | Editable 2x2 transformation matrix, draggable basis-column endpoint, derived unit-square parallelogram, four live point mappings, determinant/trace/area properties, eigendirection test, zoom controls, tabs, share/reset, and live multiplication table | 1046 x 1504; no overflow or console errors | Complete |
| 0544 | 359 Eigenvalues and Eigenvectors | `EigenTargetLesson359` | Editable real 2x2 eigensystem, characteristic polynomial and eigenpair derivation, draggable test vector, live Av/projection lambda/parallel test, matrix-mapped grid, invariant eigenlines, zoom, random matrices, tabs, reset, and independently graded other-direction challenge | 1024 x 1536; no overflow or console errors | Complete |
| 0545 | 360 Basis and Dimension | `BasisDimensionTargetLesson360` | Draggable/editable basis and target vectors, determinant independence and span/dimension states, solved coordinates and reconstruction parallelogram, randomized bases, worked derivation, tabs/reset, and selectable determinant-graded basis challenge | 1024 x 1536; no overflow or console errors | Complete |
| 0546 | 361 Linear Independence | Pending | Pending | Pending | Pending |
| 0547 | 362 Vector Spaces | Pending | Pending | Pending | Pending |
| 0548 | 363 Gram-Schmidt Process | Pending | Pending | Pending | Pending |
| 0549 | 364 Least Squares | Pending | Pending | Pending | Pending |

Completed in this family: **14 / 18**. Pending in this family: **4 / 18**.

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

## Lesson 355 validation

- Reference: `0540-reference.png`
- Current capture: `0540-desktop.png`
- Machine-readable interaction and layout audit: `0540-dedicated-target-validation.json`
- The capture harness verifies swap preview/commit, zero-scale rejection, valid scale, replacement preview/commit, history growth, undo, native drag reorder, equation hiding, a real practice scale, challenge acceptance, tabs, and shell reset.

## Lesson 356 validation

- Reference: `0541-reference.png`
- Current capture: `0541-desktop.png`
- Machine-readable interaction and layout audit: `0541-dedicated-target-validation.json`
- The capture harness verifies intermediate and final Gauss-Jordan states, exact pivots, rank and nullity, every RREF condition, rejected/correct pivot choices, interpretation-tab switching, and shell reset.
- The target screenshot's displayed rank-2 goal is inconsistent with its initial matrix. The real RREF is `[[1,0,0,1.5],[0,1,0,1],[0,0,1,0.5]]`, with rank 3, nullity 0, and unique solution `(1.5, 1, 0.5)`; the lesson preserves the target composition while using these mathematically correct derived values.

## Lesson 357 validation

- Reference: `0542-reference.png`
- Current capture: `0542-desktop.png`
- Machine-readable interaction and layout audit: `0542-dedicated-target-validation.json`
- The capture harness verifies all derived matrix forms, determinant and intersection solution, dependent and inconsistent systems, adding/removing an equation, introducing a real third free variable, rejected/correct challenge matrices, hint and detail controls, tab switching, shell reset, the compact target footer, and exact 1024 x 1536 layout.

## Lesson 358 validation

- Reference: `0543-reference.png`
- Current capture: `0543-desktop.png`
- Machine-readable interaction and layout audit: `0543-dedicated-target-validation.json`
- The capture harness verifies exact initial mapped points, determinant and trace, matrix-entry editing, pointer-driven basis-column updates, recomputed geometry and values, tab switching, shell reset, exact 1046 x 1504 dimensions, and absence of overflow or console errors.

## Lesson 359 validation

- Reference: `0544-reference.png`
- Current capture: `0544-desktop.png`
- Machine-readable interaction and layout audit: `0544-dedicated-target-validation.json`
- The capture harness verifies derived roots and eigenvectors, matrix editing and changed roots, pointer-dragged non-eigenvector rejection, preset eigenpair acceptance, rejection of the already-shown direction, acceptance of the other invariant direction, tabs, shell reset, exact 1024 x 1536 dimensions, and absence of overflow or console errors.

## Lesson 360 validation

- Reference: `0545-reference.png`
- Current capture: `0545-desktop.png`
- Machine-readable interaction and layout audit: `0545-dedicated-target-validation.json`
- The capture harness verifies determinant, independence, span/dimension, exact coordinates `(3,1)`, dependent-vector collapse, pointer drag and recomputation, rejected/correct decompositions, rejected collinear and accepted independent challenge pairs, tabs, shell reset, and exact 1024 x 1536 layout.
- The target mockup labels `v2=(1,-1)` and reconstructs `x=3v1+v2=(4,2)`, but draws its purple endpoint near `(-4,2)`. The lesson uses the stated and mathematically consistent `v2=(1,-1)` throughout the model and graph.
