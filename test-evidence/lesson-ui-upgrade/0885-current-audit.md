# Lesson 0885: Multiplication Rule

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0885-school-class-12-probability-multiplication-rule-redesigned.png`.
Catalog ID: 10211. Route: `/lessons/school/class-12/class-12-probability-multiplication-rule`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Bag asset | Generated transparent cotton-pouch PNG copied to `public/assets/lessons/multiplication-rule-pouch.png` | Generated approximation, not the exact reference pouch |
| Balls and experiment | Five individual red/blue ball buttons over the image; drawn balls disappear without replacement; two-draw limit | Explicit user-selected draws, not claimed to be randomized sampling |
| Replacement mode | Resets draw history and recalculates conditional branches; physical ball can be redrawn with replacement | With-replacement bag always retains five balls |
| Draw display | First and second color slots, outcome text, remaining count and draw-again action | Actual browser interactions and exact positioning unverified |
| Probability tree | Four individually selectable outcome paths, both conditional stages, path highlighting and calculated table | Corrected confusing duplicated/incorrect fraction labels in reference; precise tree geometry deferred |
| Path product | Derived first and conditional factors, unreduced product, reduced fraction and decimal | Changes with selected path and replacement mode |
| Comparison | Without-replacement RR = 3/10; replacement RR = 9/25; each comparison activates its experiment mode | Adds explicit mode actions, retaining real behavior rather than decorative toggle artwork |
| Rule / worked example / mistake | Conditional product, symmetric form, worked RR example and dependence warning | Exact spacing and typography deferred |
| Understanding check | Four radio statements and explanation; starts unanswered | Reference preselects a correct statement; real learner choice required here |
| Practice | Three fraction/decimal inputs with checks; correct outcomes 1/5, 1/10, 9/25 | Adds answer inputs to make reference Check controls operational |
| Generalization | Reveal/hide R(R-1)/[N(N-1)], N >= 2, including fewer-than-two-red case | Actual browser execution deferred |
| Navigation / reset | Working section tabs, reset, previous Conditional Probability and next Independent Events routes | No blocking shell mismatch found in the accepted desktop viewport |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- Tests cover four path probabilities and normalization in both modes, repeated-ball prevention, two-draw cap, all three practice results and safe fraction/decimal checking.
- Targeted strict TypeScript and ESLint checks pass.
- Generated PNG was visually inspected as an asset and copied into the project's public directory. No browser rendering of that asset was verified.
- Captured desktop evidence: `artifacts/studio-control-audit/0885-current.png`.
- One-by-one browser acceptance: opened the real route, selected a ball for the first draw, enabled the with-replacement switch, and verified the draw state updated in the live page.
- Added explicit 16px sizing for lesson action icons so inherited global SVG rules cannot create oversized controls.
- Focused model/surface tests pass (6 tests); `git diff --check` is clean for the lesson CSS and audit evidence.

Next sequential lesson: 0886 / 10212 Independent Events. Earlier aggregate completion counts have not been re-audited here.
