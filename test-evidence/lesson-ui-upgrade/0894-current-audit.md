# Lesson 0894: Binomial Distribution

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0894-school-class-12-probability-binomial-distribution-redesigned.png`.
Catalog ID: 10220. Route: `/lessons/school/class-12/class-12-probability-binomial-distribution`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Header and scenario | Basketball/hoop illustration, live n/p summary, topic tags | Custom SVG art differs from reference rendered imagery; app shell/footer and exact typography unverified |
| Parameter controls | Native draggable/keyboard n and p sliders; live mean and variance; reset | n supports 1 to 20; real browser execution pending |
| Exact PMF | Calculated binomial masses, adaptive y-axis, keyboard/click bar selection, selected-query highlighting | Corrects inaccurate reference bar labels, including P(X=0) and P(X=4); precise plot dimensions unverified |
| Arrangement builder | Fixed success count, pointer swaps, click-pair swaps, keyboard adjacent swaps and previous/next arrangements | Adds explicit r slider; pointer capture and responsive token layouts require browser testing |
| Combination counter | Exact C(n,r), distinct lexicographic arrangement enumeration and per-pattern probability | Formula is text rather than reference's stacked mathematical notation; reference arrow-strip spacing differs |
| Probability queries | Exactly, at most, at least and inclusive interval; Compute applies bounds and highlights/sums selected masses | Invalid intervals disable Compute with validation feedback; layout and event execution unverified |
| Simulation | D3 randomBinomial sampling for 20/200/2000 experiments; actual frequencies, mean and population empirical variance | Starts empty rather than copying target's 2000-trial empirical results; n/p edits clear stale sample history |
| Overlay controls | Exact bars and empirical dots independently toggled | Main chart selection remains available when an overlay is hidden |
| Shape comparison | Separate live p slider using current n, exact shape plot | Corrects reference skew descriptions: small p is right-skewed, large p is left-skewed; endpoint point masses explained |
| Definitions and assumptions | Parameters, validity checklist and dependence/changing-p warnings | Static checklist describes this simulator's assumptions, not unimplemented switches |
| Worked example and practice | Exact reference example, three calculated solutions, three independently checked quiz questions | Questions initially unanswered, unlike target's preselected correct answers |
| Navigation | Previous Bernoulli Trials, lesson list and working applications-practice scroll action | No catalog lesson named Applications of Binomial was found; no fabricated next route added |

## Verification

- Seven focused Vitest tests passed: six model tests and one initial-markup test.
- Normalization tested for all 2,020 n/p combinations (n=1..20, p=0..1 in hundredths).
- Every arrangement for n=1..10 enumerated and checked for uniqueness and success-count preservation under swaps.
- Tests cover exact reference mean/variance/probability, query bounds and complementary tails, real deterministic-seeded D3 sampling, certainty, and invalid inputs.
- Targeted strict TypeScript and focused ESLint checks passed.
- Existing application listener verified on 127.0.0.1:2266.
- No authentic browser screenshot, pixel comparison, responsive overlap verification or real browser interaction tests performed. These remain required before full acceptance.

Next sequential target: 0895 / advanced concept 2001 Partial Quotients, route `/lessons/advanced-concepts/2001-partial-quotients`. Earlier aggregate completion counts have not been re-audited.
