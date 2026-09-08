# Lesson 0908: p-Values

Status: dedicated implementation; browser interaction and exact visual acceptance remain deferred under the user-directed workflow. Not certified as a pixel match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0908-advanced-advanced-statistical-inference-p-values-redesigned.png`.
Advanced concept ID: 2014. Route: `/lessons/advanced-concepts/2014-p-values`.

## Implementation and Comparison

| Target area | Implemented behavior | Difference / remaining review |
| --- | --- | --- |
| Dedicated p-value exploration | Standard-normal tails using existing probability helpers; z from -3.5 to 3.5; left/right/two-sided alternatives | Reuses math only, not the previous lesson's UI |
| Observed z | Numeric input, native range and graph drag/keyboard handle; linked tail formulas and probability | Actual browser pointer/keyboard behavior and overlay geometry unverified |
| Tail graph | Normal density, computed shaded tail areas and cutoffs | Visible axis truncates infinite tails; numerical p includes their full probability, explicitly noted |
| Probability readout | Correct conditional probability and percentage, including p = 1 for z = 0 in two-sided mode | Default approximately 0.0455, not a fixed label |
| Reset | Restores z = 2, two-sided alternative and original seed | Does not reset unrelated practice answers |
| Null simulation | D3 seeded normal generator, all 1,000 trials actually rendered, dynamic extreme/non-extreme counts | Target's illustrated dot count does not match its 1,000-trial label; simulation estimate is not forced to 0.046 |
| Dot arrangement | Non-overlapping bin/row slots, 160 narrow z bins, expanded domain includes all generated values | Quantized horizontal display, with raw-value tooltips and unrounded classification; source declares this. Desktop/mobile rendering and overlap checks deferred |
| Re-simulation | Working new-seed button, reproducible reset | Additional control rather than a static simulated sample |
| Definition / alpha | Conditional-null explanation, flow diagram, computed 5% rule and threshold caveat | Comparison is not presented as effect size, posterior truth probability or sufficient context for conclusions |
| Misconceptions | Truth probability, effect size and chance-as-cause distinctions | Copy adapted to avoid misleading interpretations |
| Practice | Four real radio choices and conditional feedback/explanation toggle | Starts unanswered, unlike preselected target; scenario's reported p = 0.03 is given, not recalculated without sample sizes/SDs |
| Resources | Working Learn more disclosure and ASA source link | No dummy informational controls |
| Layout / navigation | Dedicated explorer/simulation/definition/misconception/practice layout and correct previous/next routes | Shared shell/footer, exact fonts/spacing, responsive geometry and pixel parity unverified |

## Verification

- Six focused model/initial-markup Vitest tests passed.
- Exactly 1,000 seeded finite draws and 1,000 rendered trial marks verified; identical seeds reproduce and different seeds change the sample.
- Simulation counts independently recomputed for all alternatives; total extreme plus non-extreme is 1,000.
- Default theoretical p checked; inclusive extreme boundaries and zero two-sided case verified.
- Every trial has a unique bin/row slot and lies inside the computed dot-domain extent.
- Input domains and correct/incorrect interpretation choices checked.
- Targeted strict TypeScript and focused ESLint passed before final explanatory-caption-only edit.
- One dedicated-route test passed after the final caption edit; 223 unrelated cases skipped.
- Existing app listener verified at 127.0.0.1:2266, PID 33880; not restarted.
- No full build, full test suite, actual browser interaction, authentic screenshots or pixel comparison performed.

## Sources

[American Statistical Association statement on p-values](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf) supports the conditional-model interpretation and cautions about hypothesis probabilities, effect size and chance explanations. The installed D3 random-normal and random-LCG source implementations were inspected before reuse.

Next sequential target: 0909 / advanced concept 2015 Type I and Type II Error. Earlier aggregate completion counts have not been re-audited.
