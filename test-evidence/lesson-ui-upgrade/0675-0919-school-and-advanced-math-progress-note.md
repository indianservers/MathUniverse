# School and Advanced Mathematics UI Upgrade

Targets run from `0675` through `0919` in `D:\Math App Screenshots for UI Update\Updated UI`.

## Progress

| Mockup    | Lesson                                            | Dedicated surface                        | Real model and controls                                                                                                                                                                                                                                                                               | Exact-size evidence                                                                                                                                                                                                                                                                          | Status   |
| --------- | ------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0675      | 10001 Place Value Explorer                        | `PlaceValueTargetLesson10001`            | Dedicated four-place base-ten model with selected-place click entry, real HTML digit drag/drop, live number/expanded-form/name calculations, International/Indian system selector, speech, tabs, reset, zero explanation, generated independent practice, hint, and separately graded quick challenge | Exact 967 x 1642 target viewport plus overflow-free 390 px mobile rendering; target-aligned 190 px sidebar, hero y=94-224, tabs y=234-273, interaction y=275-745, pattern/rule y=755-1055, worked/practice y=1065-1395, challenge y=1405-1505, and navigation y=1515-1579; no console errors | Complete |
| 0676-0919 | Remaining school and advanced mathematics lessons | Pending one-at-a-time dedicated surfaces | Pending                                                                                                                                                                                                                                                                                               | Pending                                                                                                                                                                                                                                                                                      | Pending  |

Completed in this batch: **1 / 245**. Pending in this batch: **244 / 245**.

## Lesson 10001 validation

- Reference: `0675-reference.png`
- Current capture: `0675-desktop.png`
- Mobile capture: `0675-mobile.png`
- Machine-readable interaction and layout audit: `0675-validation.json`
- The capture harness verifies the initial 4,382 model; selects the thousands column and places 7 by click; drags 5 into the tens column with real HTML drag/drop; proves the number, expanded form, and name update; switches number systems; rejects and then accepts the independent digit exercise; rejects and then accepts the 50,632 quick challenge; and resets exact defaults. It confirms the target's 967 x 1642 viewport geometry, an overflow-free 390 px mobile rendering, and absence of console errors.
