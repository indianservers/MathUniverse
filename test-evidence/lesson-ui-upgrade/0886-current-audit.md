# Lesson 0886: Independent Events

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0886-school-class-12-probability-independent-events-redesigned.png`.
Catalog ID: 10212. Route: `/lessons/school/class-12/class-12-probability-independent-events`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Dual experiment | Separate random fair coin flip and six-sided die roll; live outcome and highlighted grid cell | CSS coin and Lucide die faces replace photographic reference artwork; no exact asset match claimed |
| Select events | Heads, tails or either; six die event choices; all probabilities update | Changes stop Auto and clear prior simulation history to avoid mixing experiments |
| Probability summary | Counts from twelve enumerated equally likely outcomes; product and conditional checks | Exact formula typesetting, spacing and panel sizing deferred |
| Outcome grid | All twelve outcomes, event membership and intersection highlights; last-result marker | Correct die icon agrees with numeric roll, unlike reference's inconsistent last-result depiction |
| Live independence / conditioning | Both identities derived from current counts, before/after bars identical as required | Visual comparison remains pending |
| Simulation | Run 1/100/1000 draw actual independent random pairs; cumulative snapshots; Auto/Pause with effect cleanup | Starts with no fabricated trials; reference's static count rows are intentionally not copied. Real timer/button execution still unverified |
| Independent/dependent comparison | Actual mode-specific coin/die vs two-red/one-blue urn table and explanation | Reference displays dependent content despite independent-looking selection; content now follows selected mode |
| Rule / misconception | Correct distinction from mutual exclusivity, including positive-probability qualification | Exact mini-panel styling deferred |
| Worked example | Explicit first-red and second-blue events with replacement; 35/144 product | Clarifies ambiguity in reference event labels |
| Practice | Three question groups and solution toggle; answer feedback | Both 1/2 and 3/6 accepted for the third question because they are equivalent |
| Navigation/reset | Real section tabs, full lab reset, catalog-correct previous and next links | Actual next lesson is Total Probability Theorem, not reference's Mutually Exclusive Events |
| Shared shell/footer | Existing app shell retained | Exact global shell and responsive screenshot fidelity remain unverified |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- All 18 selectable event pairs satisfy both product and conditioning identities in tests.
- Simulation tested with deterministic random inputs, including exhaustive twelve-outcome sampling, certain events and invalid batch sizes.
- Focused strict TypeScript and ESLint checks pass.
- No browser screenshot, pixel-difference acceptance, actual random-control/timer execution or responsive overlap verification was performed. These remain required for full acceptance.

Next sequential lesson: 0887 / 10213 Total Probability Theorem. Earlier aggregate completion counts have not been re-audited here.
