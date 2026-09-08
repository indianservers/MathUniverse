# Lesson 0905: Confidence Intervals

Status: dedicated implementation; browser interaction and exact visual acceptance remain deferred under the user-directed workflow. Not certified as a pixel match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0905-advanced-advanced-statistical-inference-confidence-intervals-redesigned.png`.
Advanced concept ID: 2011. Route: `/lessons/advanced-concepts/2011-confidence-intervals`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated simulation | Reuses existing seeded normal-observation engine and known-sigma interval helper; mean fixed at 50 | Explicit independent normal-population assumption, not an unspecified population |
| Cohort | 100 genuinely generated samples per seed/settings, with 20/100 selectable view | Coverage totals calculated from samples, not forced to target's 19/20 and 95/100 |
| Interval plot | Exact interval endpoints, sample means, fixed true-mean line, covers/misses marks and row selection | Corrects target's unequal interval widths and inconsistent coverage labels at fixed n/σ/confidence |
| Current sample | Selected cohort member drives mean, SE, margin, interval and containment | Does not copy target's fixed mean 50 into an unrelated random sample |
| Inspection | Pointer drag through rows, arrow/Home/End selection and sample dropdown | Actual pointer/keyboard interaction and responsive scrolling unverified |
| New samples | Incremented deterministic seed generates a new cohort; selected sample resets | Pseudorandom simulation, reproducible by seed; no manufactured confidence percentage |
| Controls | Editable/steppable/draggable n 4–400 and σ 1–30; 90/95/99 confidence; 20/100 intervals | Native ranges added; changing confidence preserves sample means, n/σ regenerates the cohort |
| Coverage summary | Current-view count and full-cohort count with observed percentages | The 100-sample summary includes the first 20, not an independent second experiment |
| Explanation controls | Working overview/help disclosures and section navigation; primary-source link | Adds explicit model assumptions and reproducibility note |
| Worked example | Separate illustrative mean 50, SE 1.5, margin about 2.94, interval about [47.06, 52.94] | Full precision used internally; rounded formulas marked approximate |
| Pitfall | Finite interval either contains fixed μ or not; miniature plot uses actual generated intervals | Miniature misses are not fabricated merely to resemble target |
| Practice | Four independent radio questions, real checks, explanations and score | Starts unanswered; target's preselected success not shown before work |
| Layout / navigation | Dedicated route, reference-like plot/sidebar/controls/explanations/practice arrangement; valid previous/next links | Exact fonts, dimensions, shell/footer, overlap and pixel parity unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed.
- Known-sigma worked interval, square-root scaling, sigma scaling and confidence-width ordering checked.
- Seed repeatability and seed changes checked; coverage independently recounted from bounds.
- Intervals verified centered on their sample means with matching widths; confidence changes retain means and nest intervals.
- Invalid setting/seed inputs and four-question grading checked.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated-route test passed; 220 unrelated cases skipped.
- Existing app listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- No full build, full-suite run, actual browser interaction, authentic screenshots or pixel comparison performed.

## Source

[NIST: What are confidence intervals?](https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm) supports the known-population-sigma normal interval and long-run coverage interpretation. Critical values use standard-normal two-sided 90%, 95% and 99% quantiles; no t-interval claim is made for this simulation.

Next sequential target: 0906 / advanced concept 2012 Margin of Error and Sample Size. Earlier aggregate completion counts have not been re-audited.
