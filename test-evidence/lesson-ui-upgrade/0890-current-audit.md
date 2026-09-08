# Lesson 0890: Probability Distribution of a Random Variable

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0890-school-class-12-probability-probability-distribution-of-a-random-variable-redesigned.png`.
Catalog ID: 10216. Route: `/lessons/school/class-12/class-12-probability-probability-distribution-of-a-random-variable`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Outcome mapping | Four draggable/clickable outcomes and fixed correct head-count bins; wrong drops receive feedback | Individual curved flow arrow omitted; CSS coins differ from reference artwork; native drag execution unverified |
| Fair-coin reference | Correct bin counts and 1/4, 1/2, 1/4 probabilities | Explicit reference label in design mode prevents conflating custom PMF with fair coins |
| PMF table | Live masses, cumulative sums and interval calculation | Custom mode correctly labels masses as custom rather than outcome-derived; decimal entries replace some reference fractions |
| Chart/design mode | Locked theory by default; enabled pointer/keyboard bar handles and numeric inputs in design mode | Entering/leaving design resets to fair-coin masses; actual browser handling unverified |
| Simulation | 20/100/1000 trial selection and sampled categorical outcomes; empirical markers and counts | Starts empty, not with fabricated 1000-trial screenshot data; clears after mass edits |
| Validation | Nonnegativity, total-mass meter, explicit excess/missing mass and valid/invalid status | Invalid distributions cannot be simulated; invalid partial sums are not presented as probabilities |
| Definition/misconception/example | PMF rules, valid/invalid miniature charts, fixed fair-coin example | Exact chart icons, typography and spacing deferred |
| Practice | Four radio choices and explanation toggle | Correct PMF 2/3 for red and 1/3 for blue; starts unanswered |
| Navigation/reset | Working section tabs, full reset and verified catalog links | Actual adjacent lessons are Random Variables / Expected Value, not reference's Binomial / Mean and Variance labels |
| Shared shell/footer | Existing application shell retained | Exact global shell and responsive screenshot fidelity remain unverified |

## Verification

- Six focused Vitest model/initial-markup tests pass.
- All 5,151 normalized hundredth-step probability triples validated.
- Tests cover fair-coin grouping, cumulative mass, missing/excess/negative/nonfinite masses, drag coordinate clamping, deterministic categorical samples and invalid simulation counts.
- Focused strict TypeScript and ESLint checks pass.
- No authentic browser screenshot, pixel-difference acceptance, responsive overlap check, or actual drag/keyboard/button execution was performed. Full acceptance still requires these checks.

Next sequential lesson: 0891 / 10217 Expected Value. Earlier aggregate completion counts have not been re-audited here.
