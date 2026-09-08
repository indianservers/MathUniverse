import { useState, type ReactNode } from "react";
import * as calc from "./calculusEnhancementEngine";

function Tool({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <article className="cs-card calc-enhancement-tool" data-enhancement-id={id}><h2>{title}</h2>{children}</article>;
}
function Input({ label, value, onChange, min, step = .1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; step?: number }) {
  return <label><span>{label}</span><input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
function show(value: unknown) { return JSON.stringify(value, (_key, item) => typeof item === "number" ? Number.isFinite(item) ? Math.round(item * 1e6) / 1e6 : String(item) : item); }

export default function CalculusEnhancementWorkbench() {
  const [a, setA] = useState(1), [b, setB] = useState(2), [x, setX] = useState(1), [epsilon, setEpsilon] = useState(.1), [n, setN] = useState(20);
  const fn = (t: number) => a * t * t + b * t;
  const derivative = (t: number) => 2 * a * t + b;
  const positiveN = Math.max(2, Math.round(Math.abs(n)));
  return <div className="calc-enhancement-page">
    <section className="cs-card calc-enhancement-intro"><h2>Advanced Calculus Workbench</h2><p>Twenty-five linked calculus investigations. Change the model parameters to recompute limits, derivatives, integrals, series, differential equations, and vector-calculus checks.</p></section>
    <section className="cs-card calc-enhancement-controls" aria-label="Shared calculus parameters">
      <Input label="Quadratic coefficient a" value={a} onChange={setA} /><Input label="Linear coefficient b" value={b} onChange={setB} />
      <Input label="Evaluation point x" value={x} onChange={setX} /><Input label="Epsilon" value={epsilon} min={.001} step={.01} onChange={setEpsilon} />
      <Input label="Partitions / degree n" value={n} min={2} step={1} onChange={setN} />
    </section>
    <section className="calc-enhancement-grid" aria-label="Twenty-five Calculus enhancements">
      <Tool id="CALC-01" title="1. Epsilon–delta bands"><output>{show(calc.epsilonDelta(fn, x, fn(x), Math.max(.001, epsilon)))}</output></Tool>
      <Tool id="CALC-02" title="2. One-sided limits"><output>{show(calc.oneSidedLimits(fn, x))}</output></Tool>
      <Tool id="CALC-03" title="3. Sequential limit"><output>{show(calc.sequenceLimit((index) => x + 1 / index, x))}</output></Tool>
      <Tool id="CALC-04" title="4. Discontinuity classification"><p>Left={a}, right={b}, defined value={x}</p><output>{calc.classifyDiscontinuity(a, b, x)}</output></Tool>
      <Tool id="CALC-05" title="5. L’Hôpital prerequisite check"><output>{show(calc.lhopitalEligibility({ numeratorLimit: a === 0 ? 0 : Infinity, denominatorLimit: b === 0 ? 0 : Infinity, differentiableNearby: true, derivativeDenominatorNonzero: b !== 0 }))}</output></Tool>
      <Tool id="CALC-06" title="6. Secant to tangent"><output>{show(calc.secantToTangent(fn, x, Math.max(.0001, Math.abs(epsilon))))}</output></Tool>
      <Tool id="CALC-07" title="7. Derivative rule tree"><p>sin({a}x²+{b}x)</p><output>{show(calc.derivativeRuleTree(`sin(${a}*x^2+${b}*x)`))}</output></Tool>
      <Tool id="CALC-08" title="8. Implicit tangent and normal"><p>Circle point ({a}, {b}), radius √(a²+b²)</p><output>{show(calc.implicitCircleTangent(a, b, Math.hypot(a, b)))}</output></Tool>
      <Tool id="CALC-09" title="9. Higher-derivative motion"><output>{show(calc.polynomialMotion([a, b, 1, 0], x))}</output></Tool>
      <Tool id="CALC-10" title="10. Linearization error"><output>{show(calc.linearization(fn, derivative, 0, x))}</output></Tool>
      <Tool id="CALC-11" title="11. Related rates"><p>Circle radius={Math.abs(x)}, dr/dt={a}</p><output>{show(calc.circleRelatedRates(Math.abs(x), a))}</output></Tool>
      <Tool id="CALC-12" title="12. Constrained optimization"><p>Rectangle perimeter={Math.abs(b) * 10}</p><output>{show(calc.rectangleOptimization(Math.abs(b) * 10))}</output></Tool>
      <Tool id="CALC-13" title="13. Mean Value Theorem point"><output>{show(calc.meanValuePointQuadratic(a, b, 0, x || 1))}</output></Tool>
      <Tool id="CALC-14" title="14. FTC accumulator"><output>{show(calc.ftcAccumulator(fn, 0, x))}</output></Tool>
      <Tool id="CALC-15" title="15. Riemann-method comparison"><output>{show(calc.riemannComparison(fn, 0, x, positiveN))}</output></Tool>
      <Tool id="CALC-16" title="16. Adaptive quadrature"><output>{show(calc.adaptiveIntegral(fn, 0, x, Math.max(1e-10, epsilon / 1000)))}</output></Tool>
      <Tool id="CALC-17" title="17. Substitution bounds"><p>u={a}x²+{b}x</p><output>{show(calc.substitutionBounds(fn, 0, x))}</output></Tool>
      <Tool id="CALC-18" title="18. Integration by parts"><p>∫₀ˣ t·eᵗ dt</p><output>{show(calc.integrationByParts((t) => t, Math.exp, () => 1, 0, x))}</output></Tool>
      <Tool id="CALC-19" title="19. Partial fractions"><p>({a}x+{b}) / ((x−{x})(x−{x + 1}))</p><output>{show(calc.partialFractionsLinear(a, b, x, x + 1))}</output></Tool>
      <Tool id="CALC-20" title="20. Improper integral convergence"><p>∫₁∞ x^-{Math.abs(b)} dx</p><output>{show(calc.improperPIntegral(Math.abs(b)))}</output></Tool>
      <Tool id="CALC-21" title="21. Washer and shell volumes"><output>{show(calc.revolutionVolumes((t) => Math.abs(a * t + b), 0, Math.abs(x)))}</output></Tool>
      <Tool id="CALC-22" title="22. ODE method comparison"><p>y′={a}y, y(0)=1</p><output>{show(calc.odeMethodComparison((_t, y) => a * y, 0, 1, Math.abs(x), positiveN))}</output></Tool>
      <Tool id="CALC-23" title="23. Convergence-test explorer"><output>{show(calc.convergenceTest({ kind: "p-series", parameter: Math.abs(b) }))}</output></Tool>
      <Tool id="CALC-24" title="24. Taylor remainder"><p>eˣ, degree {Math.min(18, positiveN)}</p><output>{show(calc.taylorApproximation("exp", x, Math.min(18, positiveN)))}</output></Tool>
      <Tool id="CALC-25" title="25. Divergence-flux theorem"><output>{show(calc.divergenceFluxLinear({ pX: a, qY: b }, { width: Math.abs(x), height: Math.max(epsilon, .001) }))}</output></Tool>
    </section>
  </div>;
}
