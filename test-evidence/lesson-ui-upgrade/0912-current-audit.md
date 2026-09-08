# Lesson 0912: Growth and Decay IVPs

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0912-advanced-advanced-differential-equations-growth-and-decay-ivps-redesigned.png`.
Advanced concept: 2018. Route: `/lessons/advanced-concepts/2018-growth-decay-ivps`.

## Comparison

| Target area | Implemented | Difference / remaining verification |
| --- | --- | --- |
| Dedicated proportional-change model | Exact y(t)=y0 exp(kt), paired positive/negative rates, signed selected solution | Positive initial amounts only, matching reference range |
| Parameters | Native draggable/keyboard sliders and numeric controls: k=-1..1, initial=10..1000, time window=1..16 | Lower time window is 1 to avoid zero-width graph; browser interaction unverified |
| Graph | 321 sampled values per curve, consistent linear x/y scales, dynamic vertical fit, growth/decay legend, selected sign emphasized | Corrects reference's inconsistent tick/curve positions. Consequently the graph does not have the same incorrect shape/spacing; exact screenshot parity not claimed |
| Markers | Actual initial point, first two doubling and half-life coordinates, same-time guides, show/hide switch | Marker values listed below plot and in point titles rather than overlapping labels; only in-window markers rendered |
| State | Growth/constant/decay indication follows signed k | k=0 is a horizontal constant curve with no infinite markers or division by zero |
| Solution preview | Current symbol, initial value and signed rate, calculated interval | Not static default content |
| Three solution cases | Growth/constant/decay equations and time formulas | Positive-initial-value assumption explicit |
| Real-world modes | Bacteria and radioactive presets update signed rate, initial amount, window, symbol and units | Bacteria uses Lucide Sprout artwork, not the target's bacteria illustration; nonnegative radioactive rate explicitly identified as nonphysical mathematical comparison |
| Worked example | Live exact solution, doubling/half-life, table evaluated at exact event times | Table times only rounded for display; constant case uses evenly spaced finite times |
| Challenge | Editable coefficient/rate for A exp(bt), half-life and y(3), independent checking, reveal/hide solution | Answers blank initially; reference has prompts without actual input controls |
| Presets/randomize/reset | All change real parameter state; randomization selects valid values and guarantees a different rate; reset restores default lab/context/markers | Reset is lab-only, preserves separate challenge work |
| Navigation | Previous Euler Method, next Logistic Differential Equation, advanced lesson index | Catalog links verified; metadata uses catalog's 15 minutes rather than reference's 20 |
| Layout | Dedicated parameters/state column, graph/cases/preview, three learning columns, takeaways/presets | Exact typography, shell/footer, dimensions, colors, responsive layout and pixel match unverified |

## Verification

- Eight focused Vitest tests passed: seven model tests and one initial-markup test.
- Exact solution checked against initial conditions, numerical derivative residuals and independent existing RK4 engine for positive, negative and zero rates.
- Doubling/half-life coordinates, initial-amount independence, off-window markers, constant case and all supported extreme rates tested.
- Fixed challenge accepts two-decimal answers, rejects wrong sign, blank and nonfinite values.
- Initial markup checks three range controls, calculated event times, challenge controls, hidden initial solution and valid next catalog entry.
- Dedicated route test passed; 227 unrelated cases skipped.
- Targeted strict TypeScript and focused ESLint passed. Only subsequent change was replacing a floating-point exact-equality assertion in the model test with a tolerance check.
- Existing app listener verified at 127.0.0.1:2266, PID 33880; left running.
- Captured desktop evidence: `artifacts/studio-control-audit/0912-current.png`.
- One-by-one browser acceptance: opened the advanced route, changed the proportional-rate control to a decay value, and verified the live solution graph/state updated.
- Focused surface/model tests pass (8 tests); `git diff --check` is clean for the lesson evidence.

Next sequential target: 0913 / 2019 Logistic Differential Equation. Previous aggregate completion counts have not been re-audited.
