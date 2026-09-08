# Lesson 0906: Margin of Error and Sample Size

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0906-advanced-advanced-statistical-inference-margin-of-error-and-sample-size-redesigned.png`.
Advanced concept ID: 2012. Route: `/lessons/advanced-concepts/2012-margin-of-error-sample-size`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated precision model | Known-sigma interval helper, full-precision normal critical values, inverse sample-size calculation | Independent normal observations and known σ explicitly disclosed; no generic studio surface used for this route |
| Planner controls | σ numeric/stepper/range 1–30; 90/95/99 confidence; target ME numeric/range 0.5–6 | Added σ range; real drag/keyboard use and exact control sizes unverified |
| Required sample size | Actual upward-rounded integer n and inspect action | Default n = 139. Internal real-valued requirement rounds to 138.29, versus target's 138.30 from rounded z = 1.96 |
| Formula / assumptions | Working Show/Hide formula and assumptions disclosure, source link | Ceiling notation distinguishes required integer n from the unrounded equation |
| Comparison plot | Computed intervals for n = 25, 64, 100 and 400, same illustrative estimate 50, selected-row highlight | Dynamic axis expands to fit σ/confidence changes; exact plot geometry unverified |
| Sample-size inspection | Row buttons, cost entries and required-size action select actual n; numeric inspector shows margin/bounds and target comparison | Additional working inspector rather than inert sample-size buttons |
| Data-cost meter | Exact n = 25, 100, 400, 1600 calculations and 1×/4×/16×/64× ratios | Ratios represent observation count, not a monetary cost estimate |
| Takeaway | Computed 29.3% reduction on doubling n; exact half-margin relationship for quadrupling n | Holds σ and confidence fixed explicitly |
| Worked example / derivation | Fixed σ = 12, 95%, ME = 2 example remains distinct from live planner | Uses full precision internally; displayed formulas approximate rounded z |
| Challenge | Three answer inputs, minimum-n validation, score and explanations | Starts blank; checks 62, 246 and 2213, not arbitrary larger sample sizes |
| Follow-on actions | Functional planner/formula/practice navigation, real existing statistics inference studio route | Target's Real data studio tile renamed to destination actually available |
| Layout / navigation | Dedicated planner, comparison/cost, takeaway, worked/challenge and follow-on sections; valid previous/next links | Shell/footer, typography, exact spacing, mobile/desktop overlap and pixel match unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed.
- Default required n = 139 checked, including achieved ME <= 2 and previous n = 138 exceeding 2.
- Minimal sufficient integer n verified across σ = 1, 5, 12, 30; confidence 90%, 95%, 99%; targets 0.5, 1, 2, 3, 6.
- Common interval values, exact cost ratios, inverse-square precision scaling and confidence/sigma responses checked.
- Invalid domains and blank/undersized/correct challenge answers checked.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated-route test passed; 221 unrelated cases skipped.
- Existing application listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- Captured desktop evidence: `artifacts/studio-control-audit/0906-current.png`.
- One-by-one browser acceptance: opened the advanced route and verified the planner controls, confidence options, sample-size result, comparison panel and challenge section rendered.
- Focused surface/model tests pass (6 tests); `git diff --check` is clean for the lesson evidence.

## Source

[NIST: Sample sizes required](https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm) supports the known-sigma mean-estimation margin and sample-size relationship. This planner does not perform power analysis, finite-population correction or nonresponse adjustment.

Next sequential target: 0907 / advanced concept 2013 Hypothesis Tests. Earlier aggregate completion counts have not been re-audited.
