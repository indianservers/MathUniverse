# School and Advanced Mathematics UI Upgrade

Targets run from `0675` through `0919` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup    | Lesson                                               | Dedicated surface                        | Real model and controls                                                                                                                                                                                                                                                                                                            | Exact-size evidence                                                                                                                                                                                                                                                                                       | Status   |
| --------- | ---------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0675      | 10001 Place Value Explorer                           | `PlaceValueTargetLesson10001`            | Dedicated four-place base-ten model with selected-place click entry, real HTML digit drag/drop, live number/expanded-form/name calculations, International/Indian system selector, speech, tabs, reset, zero explanation, generated independent practice, hint, and separately graded quick challenge                              | Exact 967 x 1642 target viewport plus overflow-free 390 px mobile rendering; target-aligned 190 px sidebar, hero y=94-224, tabs y=234-273, interaction y=275-745, pattern/rule y=755-1055, worked/practice y=1065-1395, challenge y=1405-1505, and navigation y=1515-1579; no console errors              | Complete |
| 0676      | 10002 Indian and International Number Naming Systems | `NumberNamingTargetLesson10002`          | Dedicated dual-system grouping engine with live Indian and International comma formatting and mathematically generated number names, editable/random/clear number controls, clickable and HTML-draggable comma grouping state, copy actions, five tabs, reset, conversion entry with reveal, and graded multiple-choice challenge  | Exact 958 x 1641 target viewport plus overflow-free 390 px mobile rendering; target-aligned 190 px sidebar, hero y=93-219, tabs y=222-254, lab y=266-744, pattern y=754-848, rules/example y=858-1167, practice/challenge y=1177-1408, warning y=1418-1477, and navigation y=1487-1539; no console errors | Complete |
| 0677      | 10003 Estimation and Rounding Lab                    | `EstimationRoundingTargetLesson10003`    | Dedicated nearest-place rounding engine with tens/hundreds/thousands modes, quick values, pointer-draggable number-line marker, live midpoint/direction/rounded/error readouts, removable and addable estimate dataset, generated per-row and total absolute errors, five tabs, reset, and independently graded two-part challenge | Exact 958 x 1641 target viewport plus overflow-free 390 px mobile rendering; target-aligned 190 px sidebar, hero y=118-234, tabs y=248-287, rounding lab y=297-832, totals y=842-1144, theory y=1154-1369, challenge y=1379-1526, and navigation y=1546-1599; no console errors                           | Complete |
| 0678      | 10004 Approximation and Error Bounds                 | `ErrorBoundsTargetLesson10004`           | Dedicated half-open rounding-bound interval model with editable exact value and four place precisions, pointer-draggable exact marker, synchronized rounded/lower/upper/absolute/relative/maximum errors, three real visibility toggles, five tabs, reset, worked proof, misconception, and graded mini challenge                  | Exact 958 x 1641 target viewport plus overflow-free 390 px mobile rendering; target-aligned 190 px sidebar, hero y=93-220, tabs y=231-289, interval lab y=289-824, pattern/rule y=834-989, worked/challenge y=999-1469, and navigation y=1479-1531; no console errors                                     | Complete |
| 0679-0919 | Remaining school and advanced mathematics lessons    | Pending one-at-a-time dedicated surfaces | Pending                                                                                                                                                                                                                                                                                                                            | Pending                                                                                                                                                                                                                                                                                                   | Pending  |

Completed in this batch: **4 / 245**. Pending in this batch: **241 / 245**.

## Lesson 10001 validation

- Reference: `0675-reference.png`
- Current capture: `0675-desktop.png`
- Mobile capture: `0675-mobile.png`
- Machine-readable interaction and layout audit: `0675-validation.json`
- The capture harness verifies the initial 4,382 model; selects the thousands column and places 7 by click; drags 5 into the tens column with real HTML drag/drop; proves the number, expanded form, and name update; switches number systems; rejects and then accepts the independent digit exercise; rejects and then accepts the 50,632 quick challenge; and resets exact defaults. It confirms the target's 967 x 1642 viewport geometry, an overflow-free 390 px mobile rendering, and absence of console errors.

## Lesson 10002 validation

- Reference: `0676-reference.png`
- Current capture: `0676-desktop.png`
- Mobile capture: `0676-mobile.png`
- Machine-readable interaction and layout audit: `0676-validation.json`
- The capture harness verifies that 133215 becomes `1,33,215` and `133,215` with independently generated Indian and International names; changes the number to 24567890 and verifies both formats; swaps the comma representations and restores them with real HTML drag/drop; exercises randomize, clear, and reset; rejects an incorrect International conversion and accepts `78,965,432`; and selects and grades the correct name for 9,81,23,456. It confirms exact 958 x 1641 framing, an overflow-free 390 px mobile rendering, and absence of console errors.

## Lesson 10003 validation

- Reference: `0677-reference.png`
- Current capture: `0677-desktop.png`
- Mobile capture: `0677-mobile.png`
- Machine-readable interaction and layout audit: `0677-validation.json`
- The capture harness verifies the default 53 to 50 rounding with error 3 and the 53, 27, 48 dataset totals of estimate 130, actual 128, and error 2; selects 67; switches to nearest hundreds and proves all values recalculate; performs a real pointer drag on the number-line marker; adds and removes a value and proves totals change; clears and resets the dataset; rejects an incorrect two-part challenge response; and accepts estimate 80 with error 2. It confirms exact 958 x 1641 framing, an overflow-free 390 px mobile rendering, and absence of console errors.

## Lesson 10004 validation

- Reference: `0678-reference.png`
- Current capture: `0678-desktop.png`
- Mobile capture: `0678-mobile.png`
- Machine-readable interaction and layout audit: `0678-validation.json`
- The capture harness verifies 4.3268 rounded to the nearest tenth gives 4.3, bounds `[4.25, 4.35)`, absolute error 0.0268, and a live relative error; changes to 47.628 at hundredth precision and verifies 47.63, `[47.625, 47.635)`, and 0.0020; toggles every plotted layer off and on; performs a real pointer drag of the exact marker and proves all metrics recalculate; resets exact defaults; rejects 12.8 and accepts 12.9 for the mini challenge. It confirms exact 958 x 1641 framing, an overflow-free 390 px mobile rendering, and absence of console errors.
