# Lesson 0916: Beta Function

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0916-advanced-advanced-special-functions-beta-function-redesigned.png`.
Advanced concept: 2022. Route: `/lessons/advanced-concepts/2022-beta-function`.

## Comparison

| Target area | Implementation | Difference / remaining verification |
| --- | --- | --- |
| Dedicated two-parameter model | Beta via existing Gamma evaluator, actual integrand and normalized density | Uses beta-gamma identity, not decorative curve shapes |
| Parameter controls | Numeric inputs, increment/decrement, native draggable/keyboard sliders, reset to (2,3) | Parameters restricted to .25..10; sliders added to target stepper controls |
| Integrand plot | Actual t^(a-1)(1-t)^(b-1), calculated area, adaptive linear vertical scale | Corrects default peak: 4/27 about .148148, not target's about .7 |
| Normalized density | Actual integrand divided by B(a,b), live mode and numerical total area | Corrects default peak: 16/9 about 1.777778, not target's about 1.25 |
| Endpoint singularities | Infinite endpoint values explicitly handled and visually clipped | Caption explains clipping; improper integral remains finite, no invented finite peak |
| Integral computation | Independent Simpson quadrature after splitting interval and smoothing both endpoints with power substitutions | Integral is independently evaluated, not simply copied from Gamma ratio |
| Presets | Four initial plus four additional working presets; two show/hide controls share expanded state | Corrects (2,5) to right-skewed; (5,2) left-skewed. Actual sampled mini-plots, not canned art |
| Symmetry | Live reflected integrand pair, working swap button, equal Beta values | Both reflected graphs calculated from parameters |
| Identities and special cases | Beta-Gamma identity, B(1,b)=1/b, B(a,1)=1/a and half-half value | Valid for positive parameters; primary NIST reference linked |
| Shape classification | Interior modes only when both parameters exceed one; uniform, U-shaped and endpoint maxima handled separately | Corrects reference's reversed skew terminology; never divides by a+b-2 when invalid |
| Practice values / exploration | Clickable values and preset actions update both graphs | No dummy links or buttons |
| Mastery | Four self-assessment checkboxes, actual progress and reset | Explicitly self-reported, not evidence of mathematically tested mastery; local mounted state only |
| Assessment | Four blank numeric answers with individual checking and feedback | Reference prompts made interactive; includes fixed Beta(2,3) mode and special values |
| Capstone | Working B(1,b) presets including b=10, editable reflection | Local mounted state, not automatically graded or saved across navigation |
| Layout and navigation | Dedicated paired graphs/presets, identities, learning and assessment columns, previous/next catalog links | Reference's incorrect pathway Next Gamma removed; actual next is Error Function. Exact shell/footer, typography, spacing, responsive geometry and pixel parity unverified |

## Verification

- Eight focused Vitest tests passed: seven model tests plus one initial-markup test.
- Default area, mode and both actual peak heights verified.
- Independent quadrature normalized to the Gamma-ratio value agrees across all presets, extreme (.25,10)/(10,.25)/(10,10) and near-one parameters.
- Parameter symmetry and reflected integrand values tested.
- Singular endpoints, finite boundary values, uniform and endpoint-mode cases tested.
- Special values and capstone B(1,10) checked; assessment rejects blank and nonfinite answers.
- Initial markup confirms calculated area/normalization/mode, corrected skew, swap and range controls, self-report label, no pregraded answer, no KaTeX errors and valid next route.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated route test passed; 231 unrelated cases skipped.
- Captured desktop evidence: `artifacts/studio-control-audit/0916-current.png`.
- One-by-one browser acceptance: opened the advanced route, changed the first Beta parameter slider from 2 to 3, and verified the control state updated while the paired-graph studio remained rendered.
- Focused surface/model tests pass: `BetaSurface.test.tsx` and `betaLessonModel.test.ts` (8 tests).

## Mathematical Reference

NIST DLMF 5.12: https://dlmf.nist.gov/5.12 (Euler beta integral and beta-gamma identity).

Next sequential target: 0917 / 2023 Error Function.
