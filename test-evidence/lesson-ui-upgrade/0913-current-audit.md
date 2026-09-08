# Lesson 0913: Logistic Differential Equation

Status: dedicated implementation pass. Browser interaction and exact visual acceptance remain deferred under the user-directed workflow. Not certified as an exact mockup match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0913-advanced-advanced-differential-equations-logistic-differential-equation-redesigned.png`.
Advanced concept: 2019. Route: `/lessons/advanced-concepts/2019-logistic-differential-equation`.

## Comparison

| Target area | Implemented behavior | Difference / remaining verification |
| --- | --- | --- |
| Dedicated logistic model | Exact P(t), growth-rate function, inflection event, snapshots, exponential comparison | Exact solution independently compared against existing RK4 engine |
| Parameter toolbar | Numeric inputs, increment/decrement, native draggable/keyboard sliders for r, K and P0; reset | Sliders/reset added to working stepper controls; r restricted to positive values 0.1..2 for stated stability analysis; K=10..500, P0=0..750 |
| Population graph | Actual 401-point curve on t=0..20, dynamic population range, K and K/2 guides, initial and inflection points | Corrects reference's misplaced time/inflection coordinates. Default inflection t=3.662, P=50 |
| Inflection annotation | Calculated event and maximum rate; reports out-of-window event or absence of future inflection | Annotation below graph rather than target's floating callout; no false S-shape claim for P0>=K/2 or equilibria |
| Exponential toggle | Controls exponential curve, legend and table column together | Target shows exponential with toggle apparently off; implementation consistently hides it when off |
| Exponential range | Curve clipped to graph window; table values retained | High values formatted scientifically. Geometry outside clipping region bounded to avoid extreme SVG coordinates |
| Growth-rate graph | True rP(1-P/K) parabola, zeroes at 0/K, actual peak rK/4 | Corrects target's plotted peak of about 10 when rK/4=15; extends beyond K to show negative rates |
| Phase line | Down above K, up between 0 and K, stable K and unstable zero for r>0 | Corrects reference's false claim that 50<P<100 decreases when K=100 |
| Solution formula | Live parameter formula, separate zero and K equilibrium cases | Displayed A coefficient rounded to four decimals, explicitly disclosed; evaluation never uses rounded coefficient |
| Misconception | Explains K is approached, not an instantaneous cap; actual above-K illustration | Target illustration approached from below; this one directly illustrates the above-K claim |
| Try it yourself | Initially unselected radio answers, real checking and Plot this case action | Corrects ambiguous distractor 'stays above K forever' (true for finite time) to 'stays bounded away from K forever' |
| Numerical snapshot | Eight rows calculated from selected parameters; comparison column conditional | Corrects target values: at t=2 default logistic is 26.949, not 24.726 |
| Summary / formulas | State-specific behavior, exact equations, positive initial-condition formula restriction | No false blanket S-shape statement for every initial condition |
| Capstone | Editable reflection retained while mounted | Not automatically graded or persisted across navigation |
| Layout and navigation | Dedicated two-graph/phase-line layout, three-column supporting rows, previous/next links | Exact fonts, shell/footer, icon artwork, callout placement, responsiveness and pixel fidelity unverified |

## Verification

- Eight focused Vitest tests passed: seven model tests and one initial-markup test.
- Initial conditions and exact values independently checked against existing RK4 solver for zero, below-K, K and above-K populations.
- Correct derivative signs, maximum growth, inflection time and corrected default snapshot checked.
- Constant equilibria, absence of false future inflection, monotone approach without crossing and finite values at supported extremes tested.
- Initial markup confirms three sliders, corrected peak/time/table, comparison initially absent, no pregraded answer, no KaTeX error and valid next catalog entry.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated route test passed; 228 unrelated cases skipped.
- No full build, full suite, actual browser events, screenshots or image comparison performed.

Next sequential target: 0914 / 2020 Second-Order Oscillator. Previous aggregate completion counts have not been re-audited.
