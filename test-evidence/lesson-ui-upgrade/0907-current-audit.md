# Lesson 0907: Hypothesis Tests

Status: dedicated implementation; exact visual match and browser interaction acceptance remain deferred under the user-directed workflow. Not certified as a pixel match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0907-advanced-advanced-statistical-inference-hypothesis-tests-redesigned.png`.
Advanced concept ID: 2013. Route: `/lessons/advanced-concepts/2013-hypothesis-tests`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated model | Existing normal CDF/survival/quantile helpers; mean z test and coin normal approximation | Exact z = 0 probabilities handled explicitly to avoid the helper's small approximation error |
| Workflow | Five selectable steps navigate to real sections and update contextual explanations | Added step-detail text; exact card sizing/spacing unverified |
| Test setup | σ 1–30, n 4–400, observed mean 40–60, α 0.001–0.20, three alternatives | All duplicated alternative controls synchronized; H₀ fixed at μ = 50 |
| Conditions | Independent normal observations and known σ explicitly assumed | Corrects target's implication that n >= 30 verifies all conditions; summary inputs cannot establish sampling design |
| Distribution | Standard-normal curve, computed critical lines, two-/one-sided rejection regions and statistic marker | Axis fixed to [-4,4]; extreme statistics labeled off scale, not drawn as false in-range values |
| p-value shading | Separate working toggle for observed-tail probability vs rejection regions | Added distinction so α regions are not mistaken for p-value areas |
| Interaction | Mean graph handle, native mean/alpha ranges, numeric inputs, alternative selectors and tail buttons | Real pointer/keyboard behavior and graph framing unverified in browser |
| Graph enlargement | Working expanded page layout toggle with matching icon/title | Expands inline layout rather than invoking browser fullscreen |
| Decision | Unrounded p < α drives reject/fail-to-reject and directional conclusion | Default z = 2, two-sided p approximately 0.0455; no claim that nonsignificance proves H₀ |
| Coin practice | Editable tosses/heads/p₀/alternative, predicted decision, actual Check and cycling examples | Solution starts hidden, not pre-revealed; normal approximation without continuity correction explicitly labeled |
| Coin suitability | Expected heads and tails must each be at least 10 before presenting approximate decision | Invalid cases direct learners to an exact binomial method; exact test not implemented in this exercise |
| Resources | Working formula/assumptions/examples/glossary disclosures, source link and example loading | Target's Video explainer replaced by actual assumptions content, not a dummy video control |
| Illustration | Lucide bulb and coin symbols | Artwork differs from reference's raster illustrations; no exact artwork claim |
| Layout / navigation | Dedicated route and reference-like sections, catalog-valid previous and p-Values links | Shared shell/footer, typography, overlaps, desktop/mobile screenshots and pixel parity unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed after the zero-statistic correction.
- Default test statistic, p-value and critical value checked against known numerical references.
- Directional tails, opposite-tail complements, two-sided symmetry, alpha-dependent decisions and extreme p formatting checked.
- Coin z = 1.6 and approximate p = 0.1096 checked; inadequate expected counts flagged.
- Invalid mean/sigma/n/alpha/coin domains rejected.
- One dedicated-route test passed; 222 unrelated cases skipped.
- Targeted strict TypeScript and focused ESLint passed after final model edit.
- Existing app listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- No full build, full-suite test, real browser interaction, authentic screenshots or pixel comparison performed.

## Source

[NIST: Are the data consistent with the assumed process mean?](https://www.itl.nist.gov/div898/handbook/prc/section2/prc22.htm) supports the known-sigma one-sample z statistic and directional testing framework. Numerical tails use the repository's approximation helpers rather than a new handwritten probability engine.

Next sequential target: 0908 / advanced concept 2014 p-Values. Earlier aggregate completion counts have not been re-audited.
