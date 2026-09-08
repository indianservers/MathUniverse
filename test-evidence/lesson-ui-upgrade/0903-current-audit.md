# Lesson 0903: Fermat's Last Theorem

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0903-advanced-advanced-famous-problems-fermat-s-last-theorem-redesigned.png`.
Advanced concept ID: 2009. Route: `/lessons/advanced-concepts/2009-fermats-last-theorem`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated object model | BigInt powers, exact integer-root brackets, finite power-lookup search and practice validation | No generic lab used for this route |
| a, b, n controls | Editable positive a/b up to 20, exponent 2–10, steppers and native drag ranges | Adds range controls; actual pointer/keyboard browser behavior unverified |
| Square comparison | Live unit-square diagrams, exact equality, Pythagorean triple or bounding squares | Common scale calculated from current sides; viewport proportions unverified |
| Cube comparison | Three.js geometry rendered through SVGRenderer, colored cube faces with unit subdivision lines, exact cube totals and neighboring cubes | No bitmap used; browser-mounted geometry, nonblank output, lighting, framing and visual parity remain unverified |
| Higher exponents | Exact higher-power values when n > 3; left panel retains square baseline | Uses symbolic powers rather than falsely treating higher-dimensional powers as cube volumes; when n = 2 the right panel compares n = 3 |
| Constraint | Candidate c slider respects c ≥ max(a,b) when enabled; exact residual displayed; finite-search candidate domain also honors switch | Adds a real candidate inspector to give the mockup toggle a visible effect |
| Search | User-triggered exact search, bound/exponent controls, unordered-pair lookup, truthful count/result, loadable small Pythagorean triples | Initial status is Not searched yet, not the reference's unearned completed-search state; search domain 5–100 |
| Important note | Finite search explicitly separated from universal theorem | No finite result presented as a proof |
| Proof bridge | Four selectable stages: Frey curve, Ribet, semistable modularity, contradiction; actual explanatory detail changes | Corrects reference's overbroad modularity wording and identifies 1995 paper; icons/text differ from reference's miniature illustrations |
| Practice | Opens real triple/sum/reason inputs with validation and feedback | Reference prompt expanded into checked work; free-form reasoning not automatically graded |
| Navigation and layout | Dedicated route, functional section tabs and catalog-valid previous/next links; responsive source layout | Shared shell/footer, type, spacing, overlap and mobile/desktop appearance unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed.
- Checked default 3² + 4² = 5² and 64 < 3³ + 4³ = 91 < 125.
- Integer-root tests bracket each perfect nth power and adjacent integers for roots 1–100 and exponents 2–10.
- Finite search independently cross-checked against exhaustive triples through 20 for exponents 2, 3 and 4.
- Through bound 100, tests find square solutions and no higher-power solutions for n = 3–10; this is finite computational evidence only.
- Tests reject invalid model domains, zero/incorrect practice triples, blank answers and mistaken proof reasoning.
- One dedicated-route test passed; 218 unrelated cases skipped.
- Targeted strict TypeScript and focused ESLint passed. Final lighting-intensity-only adjustment occurred afterward; no claim of browser rendering verification.
- Existing application listener confirmed at 127.0.0.1:2266, PID 33880; not restarted.
- Captured desktop evidence: `artifacts/studio-control-audit/0903-current.png`.
- One-by-one browser acceptance: opened the advanced route, exercised the finite-search action, and verified the evidence panels rendered.
- Focused surface/model tests pass (6 tests); `git diff --check` is clean for the lesson evidence.

## Source

[Andrew Wiles, Modular elliptic curves and Fermat's Last Theorem, Annals of Mathematics (1995)](https://annals.math.princeton.edu/1995/141-3/p01). The lesson provides only an explanatory proof outline, not an implementation or verification of that proof.

Next sequential target: 0904 / advanced concept 2010 Four-Color Theorem. Earlier aggregate completion counts have not been re-audited.
