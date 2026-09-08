# Lesson 0909: Type I and Type II Error

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0909-advanced-advanced-statistical-inference-type-i-and-type-ii-error-redesigned.png`.
Advanced concept ID: 2015. Route: `/lessons/advanced-concepts/2015-type-i-type-ii-error`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated error/power model | Known σ = 6, μ₀ = 50, specified μ₁, one-/two-sided normal rejection rule | Existing CDF/survival/quantile helpers reused; UI dedicated to this lesson |
| Default mathematics | μ₁ = 56, n = 36 gives SE = 1, standardized separation = 6, β < 0.001 and power > 0.999 | Corrects target's inconsistent d = 1, β = 0.259, power = 0.741 and curve widths; exact numerical imitation would be false |
| Distribution plot | Null and comparison sample-mean densities use σ/√n; correctly calculated conditional shaded areas and x̄ critical cutoffs | Corrects target confusion between z critical and sample-mean cutoff; axis adapts to distributions; browser geometry unverified |
| Controls | α range/numeric 0.001–0.20, true mean 50–60, n 10–200, test-sidedness toggle | All update model, graph, metrics, matrix and tables; actual browser drag/keyboard behavior unverified |
| Probability readouts | Computed α, β, power and standardized separation | Tiny nonzero probabilities shown as < 0.001 / > 0.999 instead of implying exact zero/one |
| Zero effect | μ₁ = μ₀ uses exact rejection α and non-rejection 1−α | Labels identify this as the null case, not a false alternative or Type II error |
| Settings | Model assumptions, standard error, effect separation, z and x̄ cutoffs | Normal independent observations and known σ explicitly assumed |
| Decision framework | Selectable cells, conditional probabilities and contextual explanation | No assertion that correct non-rejection proves the null |
| Screening scenario | Illustrative absent/present-disease false-positive/false-negative explanation | Corrects reference's unrelated improvement hypothesis text; not a clinical recommendation; prevalence caveat included |
| Comparative tables | Live α and n sweeps with clickable settings and selection highlights | Corrected numerical entries follow the actual current effect, not static target numbers |
| Practice | Three radio questions, explicit checking, score and correct-answer feedback | Starts unanswered rather than showing target's preselected success |
| Capstone | Real inline planning workspace, target-power input, minimum-n search over 10–200, apply-n action and editable rationale | Reports unreachable target / zero-effect case; draft retained only while mounted, reasoning not automatically graded |
| Artwork / layout | Mathematical SVG curves, Lucide scenario icons, dedicated reference-like sections | Scenario artwork differs; exact fonts, spacing, shell/footer, responsive overlaps and pixel parity unverified |
| Navigation | Correct previous p-Values and next Slope Fields routes | No generic studio redirect for the lesson itself |

## Verification

- Seven focused model/initial-markup Vitest tests passed after final edits.
- Correct default SE, standardized separation and cutoff checked; near-unit power and small β verified.
- Known one-/two-sided probabilities tested at a one-unit effect.
- Probability conservation, exact zero-effect probabilities, and α/effect/n monotonicity tested.
- Capstone minimum sufficient n checked against n−1 for both test types; unreachable and invalid target cases tested.
- Invalid model domains rejected; initial controls, corrected metrics and unanswered practice markup verified.
- One dedicated-route test passed; 224 unrelated cases skipped.
- Targeted strict TypeScript and focused ESLint passed after final edits.
- Existing app listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- Captured desktop evidence: `artifacts/studio-control-audit/0909-current.png`.
- One-by-one browser acceptance: opened the advanced route, adjusted the significance-level control, and verified the decision/error visualization updated.
- Focused surface/model tests pass (7 tests); `git diff --check` is clean for the lesson evidence.

## Sources

- [Penn State: Power Analysis](https://online.stat.psu.edu/statprogram/reviews/statistical-concepts/power-analysis): specified alternative, normal-mean power, and α/β trade-off.
- [NIST: Sample sizes required](https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm): known-sigma mean testing and power/sample-size relationships.

Next sequential target: 0910 / advanced concept 2016 Slope Fields. Earlier aggregate completion counts have not been re-audited.
