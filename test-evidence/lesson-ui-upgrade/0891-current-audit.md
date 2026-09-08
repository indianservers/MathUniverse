# Lesson 0891: Expected Value

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0891-school-class-12-probability-expected-value-redesigned.png`.
Catalog ID: 10217. Route: `/lessons/school/class-12/class-12-probability-expected-value`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Balance beam | Three pointer/keyboard probability weights, accurate outcome positions and pivot at computed mean | SVG weights replace rendered block imagery; actual drag execution and exact dimensions pending |
| Probability controls | Accessible sliders redistribute other weights proportionally to preserve total 1 | Additional sliders provide alternatives to dragging; target block widths/height styling differs |
| Distribution/game modes | Separate probability states for [0,1,2] and [-2,1,5]; mode switches update beam/calculations/simulation | Sample history cleared when its distribution changes |
| Products and moments | Actual weighted products, mean, signed moments and equal left/right moments | Reference default left/right totals 0.50 are incorrect; each is 0.25 |
| Calculation table | All products and signed contributions calculated from active distribution | Decimal formatting replaces some target fractions; exact table styling deferred |
| Long-run simulation | Real weighted draws, first twenty outcomes, actual running averages and logarithmic trial axis | Starts empty rather than copying target's fabricated 0.998 result; real browser execution pending |
| Game example | Live linked payout probabilities and mean; note handles when mean coincides with an outcome | Default mean is 0.30, but arbitrary edits may yield an actual payout; wording stays correct |
| Misconception/takeaways | Expected value need not be a possible outcome, balance/long-run interpretation | Corrected reference's absolute claim that expected value is never an outcome |
| Two-dice example | Uses linearity of expectation, 3.5 + 3.5 = 7 | Corrected reference's invalid uniform averaging of dice sums |
| Practice | Four independently toggled solutions | Answers: 11/6, 0.5, 0.4, 1.6 |
| Reset/navigation | Full reset, simulation-only reset, section navigation and catalog-correct adjacent links | Reference bookmark and app shell/footer fidelity not implemented in this pass |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- One thousand sequential slider edits tested for nonnegative normalized probabilities and matching left/right moments.
- Tests cover point distributions, default means/moments, actual deterministic samples and running averages, invalid distributions and invalid trial counts.
- Targeted strict TypeScript and focused ESLint checks passed; lint exited successfully after a longer-running check.
- No authentic browser screenshot, pixel-difference acceptance, responsive overlap check or real browser interaction test was performed. These remain required for full acceptance.

Next sequential lesson: 0892 / 10218 Variance. Earlier aggregate completion counts have not been re-audited here.
