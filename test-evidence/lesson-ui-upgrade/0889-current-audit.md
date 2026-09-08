# Lesson 0889: Random Variables

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0889-school-class-12-probability-random-variables-redesigned.png`.
Catalog ID: 10215. Route: `/lessons/school/class-12/class-12-probability-random-variables`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Mapping machine | Generated transparent PNG at `public/assets/lessons/random-variable-machine.png` | Generated approximation, not exact reference asset; browser image fit not verified |
| Coin outcomes | Four equally likely outcome controls with H/T coin pairs; selecting an outcome highlights its output group | CSS coins replace target bitmap coins; individual curved routing arrows not reproduced |
| Rule selectors | Synchronized heads/tails/match/payoff/custom presets | Selecting custom focuses the first score field; changing rules clears history |
| Custom scores | Four finite real-number inputs, including negatives and fractions | Browser editing behavior not executed; invalid/nonfinite numeric edits do not replace the last valid score |
| Mapped range | Derived distinct values sorted into outcome groups, with counts and selection highlighting | Up to four groups supported; exact target group spacing deferred |
| Toss / Run 20 | Independent random coin pairs, actual mapped values, last toss and last twenty results | History starts empty instead of copying fabricated screenshot results |
| Domain/table/editor | Fixed outcome domain, calculated range and live score table | Long custom values wrap; responsive screenshot checks pending |
| Three-step view | Selected outcome, rule image and current mapped number | Simplified arrows and graphic placement differ from reference |
| Definition/example | Function definition, many-to-one mapping and die-square worked example | Exact typography deferred |
| Practice | Corrected choice 4, checked feedback and explanation | Reference choices 0/1/2/3 omit the correct sum 0+1+1+2=4; distinction from expected value explained |
| Help/reset/navigation | Working help, full reset, section scrolls and verified catalog links | No blocking shell mismatch found in the accepted desktop viewport |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- Tests cover grouped outcomes, probability normalization for presets, finite real-value validation, negative/fractional/constant mappings, two RNG calls per toss and corrected practice sum.
- Focused strict TypeScript and ESLint checks pass.
- Generated asset visually inspected and copied into the project. Captured desktop evidence: `artifacts/studio-control-audit/0889-current.png`.
- One-by-one browser acceptance: opened the real route, ran a toss and batch run, and verified the practice checker returns its unanswered state.
- Added explicit 16px sizing for lesson action icons so inherited global SVG rules cannot create oversized controls.
- Focused model/surface tests pass (6 tests); `git diff --check` is clean for the lesson CSS and audit evidence.

Next sequential lesson: 0890 / 10216 Probability Distribution of a Random Variable. Earlier aggregate completion counts have not been re-audited here.
