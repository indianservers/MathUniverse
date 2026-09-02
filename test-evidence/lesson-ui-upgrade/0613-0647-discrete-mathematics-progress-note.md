# Combinatorics, Graph Theory, and Logic UI Upgrade

Target references begin at `0613` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0613 | 556 Fundamental Counting Principle | `FundamentalCountingTargetLesson556` | Dedicated three-stage Cartesian-product wardrobe tree with independent top/pants/shoe steppers, dynamically generated selectable outfit leaves, live product and additive comparison, stage table and rule, separate starter/main/dessert practice model, genuine wrong/correct grading, five working tabs, reset, and adjacent navigation | Exact 1208 x 1302 target viewport plus full-width 390 px mobile rendering; target-aligned 240 px sidebar and hero/tabs/tree/manipulation/theory/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0614 | 557 Factorials | `FactorialsTargetLesson557` | Dedicated distinct-object arrangement model with native drag-and-drop and click placement, shrinking remaining choices, live n! product, completed-arrangement history, true permutation enumeration, editable n, exact factorial growth table and graph, independent challenge n, genuine wrong/correct grading, five working tabs, tray/shell reset, and navigation | Exact 1024 x 1536 target viewport plus full-width 390 px mobile rendering; target-aligned 221 px sidebar and hero/tabs/observe/builder/growth/rule/challenge/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0615 | 558 Permutations | `PermutationsTargetLesson558` | Dedicated ordered-selection model with editable n and r, native drag-and-drop and click placement, duplicate prevention, live nPr calculation, unique permutation history, board reset and shuffle state, generated choice tree, independent 4P2 practice tray, genuine incomplete/correct grading, five working tabs, shell reset, and navigation | Exact 999 x 1575 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 200 px sidebar and hero/tabs/board/tree/rule/example/practice/summary/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0616 | 559 Permutations with Repetition | `RepeatedPermutationsTargetLesson559` | Dedicated multiset model with repeated-count steppers, native drag-and-drop/click source tiles, multiplicity enforcement, live multinomial formula, true deduplicated arrangement enumeration, grid/list modes, random arrangement, independent repeated-letter challenge, five working tabs, shell reset, and navigation | Exact 981 x 1604 target viewport plus coherent full-width 390 px mobile rendering; target-aligned hero/tabs/multiset builder/arrangement grid/rule/example/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |

Completed in this family: **4 / 35**. Pending in this family: **31 / 35**.

## Lesson 556 validation

- Reference: `0613-reference.png`
- Current capture: `0613-desktop.png`
- Mobile capture: `0613-mobile.png`
- Machine-readable interaction and layout audit: `0613-validation.json`
- The capture harness verifies the initial 3 x 2 x 2 wardrobe product of 12; selects the generated top-2/pants-2/shoes-2 outfit leaf; increases tops to 4 and proves 16 combinations, then pants to 3 and proves 24; exercises the Formula tab; independently increases meal starters from 2 to 3 and proves the practice product changes from 12 to 18; rejects 12, accepts 18, and reloads the exact initial state. It confirms exact 1208 x 1302 dimensions, the complete 454 x 288 counting tree, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 557 validation

- Reference: `0614-reference.png`
- Current capture: `0614-desktop.png`
- Mobile capture: `0614-mobile.png`
- Machine-readable interaction and layout audit: `0614-validation.json`
- The capture harness physically drags object A into the first arrangement slot, clicks B/C/D/E to complete ABCDE, and proves remaining choices become empty and the completed counter becomes 1; resets the tray; changes n from 5 to 4 and proves the total changes from 120 to 24 with four empty slots; runs the true enumerator and verifies ABCD among all 24 permutations; exercises the Formula tab; changes the independent challenge from 7! to 6!, proves the expected value changes from 5040 to 720, rejects 5040, accepts 720, and reloads the exact initial state. It confirms exact 1024 x 1536 dimensions, target-aligned section coordinates, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 558 validation

- Reference: `0615-reference.png`
- Current capture: `0615-desktop.png`
- Mobile capture: `0615-mobile.png`
- Machine-readable interaction and layout audit: `0615-validation.json`
- The capture harness physically drags D into the first ordered slot and clicks E to complete DE, proving the unique history rises from 3 to 4; resets the board; changes the model from 5P2 = 20 to 4P3 = 24 and proves three empty slots are rebuilt; exercises shuffle and the Formula tab; tests the independent 4P2 practice tray by rejecting an incomplete selection and accepting AB; resets practice and reloads the exact initial state. It confirms exact 999 x 1575 dimensions, target-aligned section coordinates, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 559 validation

- Reference: `0616-reference.png`
- Current capture: `0616-desktop.png`
- Mobile capture: `0616-mobile.png`
- Machine-readable interaction and layout audit: `0616-validation.json`
- The capture harness begins with A²B²C and proves 30 true deduplicated arrangements; increases C to two and proves the rebuilt six-slot multiset has 90 arrangements; physically drags A into the first slot; runs the unique enumerator; switches from grid to list; creates a valid random arrangement; exercises the Formula tab; changes the independent R²E²DA challenge to R³E²DA and proves the count changes from 180 to 420; generates the answer and reloads exact defaults. It confirms exact 981 x 1604 viewport dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.
