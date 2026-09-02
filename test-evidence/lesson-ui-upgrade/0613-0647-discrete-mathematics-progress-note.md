# Combinatorics, Graph Theory, and Logic UI Upgrade

Target references begin at `0613` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0613 | 556 Fundamental Counting Principle | `FundamentalCountingTargetLesson556` | Dedicated three-stage Cartesian-product wardrobe tree with independent top/pants/shoe steppers, dynamically generated selectable outfit leaves, live product and additive comparison, stage table and rule, separate starter/main/dessert practice model, genuine wrong/correct grading, five working tabs, reset, and adjacent navigation | Exact 1208 x 1302 target viewport plus full-width 390 px mobile rendering; target-aligned 240 px sidebar and hero/tabs/tree/manipulation/theory/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0614 | 557 Factorials | `FactorialsTargetLesson557` | Dedicated distinct-object arrangement model with native drag-and-drop and click placement, shrinking remaining choices, live n! product, completed-arrangement history, true permutation enumeration, editable n, exact factorial growth table and graph, independent challenge n, genuine wrong/correct grading, five working tabs, tray/shell reset, and navigation | Exact 1024 x 1536 target viewport plus full-width 390 px mobile rendering; target-aligned 221 px sidebar and hero/tabs/observe/builder/growth/rule/challenge/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0615 | 558 Permutations | `PermutationsTargetLesson558` | Dedicated ordered-selection model with editable n and r, native drag-and-drop and click placement, duplicate prevention, live nPr calculation, unique permutation history, board reset and shuffle state, generated choice tree, independent 4P2 practice tray, genuine incomplete/correct grading, five working tabs, shell reset, and navigation | Exact 999 x 1575 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 200 px sidebar and hero/tabs/board/tree/rule/example/practice/summary/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0616 | 559 Permutations with Repetition | `RepeatedPermutationsTargetLesson559` | Dedicated multiset model with repeated-count steppers, native drag-and-drop/click source tiles, multiplicity enforcement, live multinomial formula, true deduplicated arrangement enumeration, grid/list modes, random arrangement, independent repeated-letter challenge, five working tabs, shell reset, and navigation | Exact 981 x 1604 target viewport plus coherent full-width 390 px mobile rendering; target-aligned hero/tabs/multiset builder/arrangement grid/rule/example/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0617 | 560 Circular Permutations | `CircularPermutationsTargetLesson560` | Dedicated circular seating model with generated light-oak PNG tabletop, native person-to-seat drag swapping, click swapping, n selector, anchored-person and rotation-equivalence switches, canonical/rotated arrangements, working undo/redo, live (n-1)! calculation, rotation carousel, independent seven-person challenge, genuine wrong/correct grading and solution reveal, five tabs, reset, and navigation | Exact 1201 x 1309 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 240 px sidebar and hero/tabs/seating lab/live summaries/rule/example/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0618 | 561 Combinations | `CombinationsTargetLesson561` | Dedicated unordered-selection basket with pool and selection-size steppers, capped toggleable object selection, canonical set comparison, live nPr/r!/nCr relationship, symmetry table, independent editable committee challenge, genuine wrong/correct grading and hint, five tabs, reset, and navigation | Exact 1210 x 1300 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 240 px sidebar and hero/tabs/basket/relation/pattern/rule/challenge/example/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0619 | 562 Pascal's Triangle | `PascalTriangleTargetLesson562` | Dedicated binomial-coefficient model with dynamically generated selectable rows, parent highlighting, row sums and labels, row expansion slider/stepper, (n,r) jump controls, independent overlay toggles, exact Pascal-rule derivation, three live practice questions, hint, five tabs, reset, and navigation | Exact 854 x 1840 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 172 px sidebar and hero/tabs/triangle/selection details/pattern/rule/example/practice/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0620 | 563 Inclusion–Exclusion | `InclusionExclusionTargetLesson563` | Dedicated draggable numbered-counter Venn model with explicit A-only, overlap, B-only, pool, and optional C assignments; live set cardinalities and inclusion-exclusion verification; random identity redistribution; learning sequence; independent target-count model; genuine wrong/correct grading and solution reveal; five tabs, reset, and navigation | Exact 1023 x 1537 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 210 px sidebar and hero/tabs/Venn lab/breakdown/rule/example/practice/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |
| 0621 | 564 Pigeonhole Principle | `PigeonholeTargetLesson564` | Dedicated pigeon-to-hole assignment model using generated transparent pigeon and wooden-hole PNG assets, native drag reassignment, derived per-hole distribution, least/fullest readouts, exact ceil(n/k) guarantee, n/k sliders, random distribution, independent editable challenge, genuine wrong/correct grading and solution reveal, five tabs, reset, and navigation | Exact 1019 x 1543 target viewport plus coherent full-width 390 px mobile rendering; target-aligned 205 px sidebar and hero/tabs/distribution lab/theorem/misconception/example/practice/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |

Completed in this family: **9 / 35**. Pending in this family: **26 / 35**.

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

## Lesson 560 validation

- Reference: `0617-reference.png`
- Current capture: `0617-desktop.png`
- Mobile capture: `0617-mobile.png`
- Machine-readable interaction and layout audit: `0617-validation.json`
- Generated tabletop asset: `public/assets/lessons/560-circular-permutations/light-oak-tabletop.png` (built-in ImageGen; clean top-down honey-oak texture with no text or objects)
- The capture harness starts with five people and proves (5-1)! = 24; physically drags Ben onto Cara's seat and proves the arrangement changes from ABCDE to ACBDE; verifies undo and redo; changes to six people and proves (6-1)! = 120 with a rebuilt ABCDEF arrangement; exercises both anchor and rotation-display switches; advances the rotation while preserving the canonical arrangement; exercises the Formula tab; rejects 5040 and accepts 720 for seven people; reveals the real solution and reloads exact defaults. It confirms exact 1201 x 1309 dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 561 validation

- Reference: `0618-reference.png`
- Current capture: `0618-desktop.png`
- Mobile capture: `0618-mobile.png`
- Machine-readable interaction and layout audit: `0618-validation.json`
- The capture harness starts with the unordered basket {B,D} and proves 5C2 = 10 and 5P2 = 20; proves a third selection is rejected at r=2; removes B and adds A, verifying the canonical set becomes AD regardless of click order; clears the basket; changes the model to 6C3 = 20 and selects ABC; exercises the Formula tab; changes the independent challenge from 7C3 = 35 to 8C3 = 56; rejects 35, accepts 56, reveals the real hint, and reloads exact defaults. It confirms exact 1210 x 1300 dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 562 validation

- Reference: `0619-reference.png`
- Current capture: `0619-desktop.png`
- Mobile capture: `0619-mobile.png`
- Machine-readable interaction and layout audit: `0619-validation.json`
- The capture harness begins at C(4,2)=6 with parents 3 and 3; selects C(6,3) and proves 20 with parents 10 and 10; expands through row 8; uses the jump controls to select C(8,3)=56 with parents 21 and 35; independently disables parent, row-sum, and label overlays; expands to row 9; exercises the Formula tab; changes one practice answer to reduce the score from 3/3 to 2/3 and restores it; reveals the real hint and reloads exact defaults. It confirms exact 854 x 1840 dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 563 validation

- Reference: `0620-reference.png`
- Current capture: `0620-desktop.png`
- Mobile capture: `0620-mobile.png`
- Machine-readable interaction and layout audit: `0620-validation.json`
- The capture harness starts with |A|=4, |B|=4, |A∩B|=2 and union 6; physically drags counter 7 from the pool into A-only and proves A and the union rise to 5 and 7; drags it into the overlap and proves A remains 5 while B and the overlap rise to 5 and 3; removes counter 3 and verifies B=4 and union=6; enables the third-set view and physically places counter 8 into C without changing the two-set formula; randomizes counter identities while preserving 4+4-2=6; exercises learning sequence and Formula controls; rejects incorrect target counts, accepts A-only=3/overlap=2/B-only=2 with union 7, reveals the solution, and reloads exact defaults. It confirms exact 1023 x 1537 dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.

## Lesson 564 validation

- Reference: `0621-reference.png`
- Current capture: `0621-desktop.png`
- Mobile capture: `0621-mobile.png`
- Machine-readable interaction and layout audit: `0621-validation.json`
- Generated assets: `public/assets/lessons/564-pigeonhole-principle/pigeon.png` and `hole.png` (built-in ImageGen; transparent isolated pigeon and wooden hole sprites with no text)
- The capture harness starts with seven pigeons distributed 2,1,1,2,1 across five holes and proves ceil(7/5)=2; physically drags pigeon 2 into hole 1 and verifies the distribution changes to 3,0,1,2,1 while the theorem still holds; rebuilds at n=10 and k=3 and proves 4,3,3 with guarantee 4; randomizes the assignment and verifies the theorem against the actual fullest hole; exercises the Formula tab; changes the independent challenge from ceil(13/6)=3 to ceil(13/4)=4; rejects 3, accepts 4, reveals the derivation, resets, and reloads exact defaults. It confirms exact 1019 x 1543 dimensions, an overflow-free full-width 390 px mobile rendering, and absence of console errors.
