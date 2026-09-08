# Lesson 0893: Bernoulli Trials

Status: dedicated implementation; browser interaction and visual acceptance deferred under the user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0893-school-class-12-probability-bernoulli-trials-redesigned.png`.
Catalog ID: 10219. Route: `/lessons/school/class-12/class-12-probability-bernoulli-trials`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Free-throw laboratory | Independent random sampling, observed sequence, success count and individual hoop illustrations | Starts empty, not with fabricated reference results; custom SVG basketball imagery differs from reference artwork |
| Trial controls | Native draggable/keyboard ranges for n and p; run and full reset | Actual browser pointer/keyboard execution unverified; n ranges from 1 to 12 |
| Probability rows | Actual pre-draw conditional probabilities for each recorded trial | Unrun urn probabilities after trial 1 are unknown and shown as dashes |
| Live conditions | Fixed count, binary recording, independence and constant-p checks | Adds explicit fourth constant-p check missing from target's three status panels; checks conservatively state not guaranteed in altered modes |
| Fatigue | Decreases success propensity by 0.05 per trial, clamped at zero | Probability and tree update; actual live UI execution pending |
| No replacement | Finite urn of 20 balls with success count derived from p; conditional probabilities reflect prior draws | Separate experiment from fatigue/foul modes; enabling these switches disables the urn mode to retain valid semantics |
| Third outcome | Foul probability 0.10, with remaining mass split between success/failure | Tree expands to three branches and scrolls horizontally; precise responsive rendering unverified |
| Probability tree | First up to three trials; conditional edge probabilities and expandable path-probability table | Zero-probability branches have no descendants; corrects reference's misleading two-level title |
| Essentials and misconception | Bernoulli indicator, mean, variance, count distinction and modified-model warning | Additional baseline warning keeps displayed formulas scoped correctly |
| Classification | All three scenarios accept answers and provide checked feedback | Corrects reference: independent die rolls recorded as 6/not-6 are Bernoulli trials |
| Practice | Four individually checked yes/no questions | Clarifies ambiguous batter example: same pitcher alone does not establish constant p and independence |
| Navigation | Section links and catalog-correct previous/next lessons | Previous is Variance, correcting reference's duplicate Binomial Distribution links; shell/footer parity deferred |

## Verification

- Six focused Vitest tests passed: five model tests and one initial-markup test.
- 105 probability/mode combinations checked for normalized tree leaves at every depth.
- 63 urn sampling configurations checked against finite ball counts.
- Tests cover deterministic sampling, fatigue, third outcomes, certainty, invalid settings and invalid random values.
- Focused strict TypeScript and ESLint checks passed.
- No authentic browser screenshot, pixel comparison, responsive overlap verification or real browser interaction tests performed. These remain required before full acceptance.

Next sequential lesson: 0894 / 10220 Binomial Distribution. Earlier aggregate completion counts remain unaudited.
