# Lesson 0874: Formulating Linear Programming Problems

Status: completed at the user's explicit request; visual review deferred until later. This does not claim automated visual acceptance.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0874-school-class-12-linear-programming-formulating-linear-programming-problems-redesigned.png`.

Route: `/lessons/school/class-12/class-12-linear-programming-formulating-linear-programming-problems` (numeric ID 10200).

## Implemented

- Added an initial-surface regression test for both named builders, twenty independently named fields, draggable quantity tiles, two reset/check controls and empty initial progress. Ten tests now pass across the model and server-rendered surface suites. This does not exercise browser events or prove visual fidelity.

- Coefficient source highlighting now traces individual numbers, resource terms and limits to matching scenario facts. Plain-language output describes the selected quantity instead of merely repeating the token. Shared numbers can correctly highlight more than one source; substring matches no longer highlight unrelated profits.

- Dedicated workshop and factory models with distinct profits, resource coefficients and limits.
- Ten independently validated fields, native drag/drop and keyboard-accessible click placement, reset and explicit model check.
- Main four-column model layout, source highlighting, language and units toggles, inequality guide, reference and independent practice.
- Four model tests pass, covering all ten slots, reversed inequalities, missing non-negativity and factory coefficients. Focused lint passes.

## Still Required

Latest interaction refinement: filled slots now have a named clear button, and clearing invalidates stale submission feedback. Validation accepts reversed variable and additive-term order while rejecting duplicate terms and missing Maximize. Eight model tests and focused lint pass. These are model/source checks, not browser interaction evidence.

- Quantity palette and compositional placement are now implemented for variables, profit terms, resource terms and non-negativity. Whole objective/variable answer tiles were removed; resource expression tiles remain as in the mockup. Tests assemble both scenarios using individual quantities. Placement order flexibility and browser usability still need verification.
- Match practice's compact arrangement and target typography, spacing, dimensions and shell.
- Verify dragging and touch/click workflows in the running app, including wrong placements and correction.
- Capture and compare authentic desktop/mobile screenshots. Prior URL-policy restriction has not been bypassed; no screenshot acceptance is claimed.
