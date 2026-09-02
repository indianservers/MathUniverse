# Combinatorics, Graph Theory, and Logic UI Upgrade

Target references begin at `0613` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup | Lesson | Dedicated surface | Real model and controls | Exact-size evidence | Status |
| --- | ---: | --- | --- | --- | --- |
| 0613 | 556 Fundamental Counting Principle | `FundamentalCountingTargetLesson556` | Dedicated three-stage Cartesian-product wardrobe tree with independent top/pants/shoe steppers, dynamically generated selectable outfit leaves, live product and additive comparison, stage table and rule, separate starter/main/dessert practice model, genuine wrong/correct grading, five working tabs, reset, and adjacent navigation | Exact 1208 x 1302 target viewport plus full-width 390 px mobile rendering; target-aligned 240 px sidebar and hero/tabs/tree/manipulation/theory/practice/navigation bands; no overlap, horizontal overflow, or console errors | Complete |
| 0614 | 557 Factorials | `FactorialsTargetLesson557` | Dedicated distinct-object arrangement model with native drag-and-drop and click placement, shrinking remaining choices, live n! product, completed-arrangement history, true permutation enumeration, editable n, exact factorial growth table and graph, independent challenge n, genuine wrong/correct grading, five working tabs, tray/shell reset, and navigation | Exact 1024 x 1536 target viewport plus full-width 390 px mobile rendering; target-aligned 221 px sidebar and hero/tabs/observe/builder/growth/rule/challenge/navigation/footer bands; no overlap, horizontal overflow, or console errors | Complete |

Completed in this family: **2 / 35**. Pending in this family: **33 / 35**.

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
