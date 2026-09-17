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
  const [selected, setSelected] = useState("CALC-01");
  const fn = (t: number) => a * t * t + b * t;
  const derivative = (t: number) => 2 * a * t + b;
  const positiveN = Math.max(2, Math.round(Math.abs(n)));
  const tools = [
    { id: "CALC-01", title: "1. Epsilon–delta bands", body: <output>{show(calc.epsilonDelta(fn, x, fn(x), Math.max(.001, epsilon)))}</output> },
    { id: "CALC-02", title: "2. One-sided limits", body: <output>{show(calc.oneSidedLimits(fn, x))}</output> },
    { id: "CALC-03", title: "3. Sequential limit", body: <output>{show(calc.sequenceLimit((index) => x + 1 / index, x))}</output> },
    { id: "CALC-04", title: "4. Discontinuity classification", body: <><p>Left={a}, right={b}, defined value={x}</p><output>{calc.classifyDiscontinuity(a, b, x)}</output></> },
    { id: "CALC-05", title: "5. L’Hôpital prerequisite check", body: <output>{show(calc.lhopitalEligibility({ numeratorLimit: a === 0 ? 0 : Infinity, denominatorLimit: b === 0 ? 0 : Infinity, differentiableNearby: true, derivativeDenominatorNonzero: b !== 0 }))}</output> },
    { id: "CALC-06", title: "6. Secant to tangent", body: <output>{show(calc.secantToTangent(fn, x, Math.max(.0001, Math.abs(epsilon))))}</output> },
    { id: "CALC-07", title: "7. Derivative rule tree", body: <><p>sin({a}x²+{b}x)</p><output>{show(calc.derivativeRuleTree(`sin(${a}*x^2+${b}*x)`))}</output></> },
    { id: "CALC-08", title: "8. Implicit tangent and normal", body: <><p>Circle point ({a}, {b}), radius √(a²+b²)</p><output>{show(calc.implicitCircleTangent(a, b, Math.hypot(a, b)))}</output></> },
    { id: "CALC-09", title: "9. Higher-derivative motion", body: <output>{show(calc.polynomialMotion([a, b, 1, 0], x))}</output> },
    { id: "CALC-10", title: "10. Linearization error", body: <output>{show(calc.linearization(fn, derivative, 0, x))}</output> },
    { id: "CALC-11", title: "11. Related rates", body: <><p>Circle radius={Math.abs(x)}, dr/dt={a}</p><output>{show(calc.circleRelatedRates(Math.abs(x), a))}</output></> },
    { id: "CALC-12", title: "12. Constrained optimization", body: <><p>Rectangle perimeter={Math.abs(b) * 10}</p><output>{show(calc.rectangleOptimization(Math.abs(b) * 10))}</output></> },
    { id: "CALC-13", title: "13. Mean Value Theorem point", body: <output>{show(calc.meanValuePointQuadratic(a, b, 0, x || 1))}</output> },
    { id: "CALC-14", title: "14. FTC accumulator", body: <output>{show(calc.ftcAccumulator(fn, 0, x))}</output> },
    { id: "CALC-15", title: "15. Riemann-method comparison", body: <output>{show(calc.riemannComparison(fn, 0, x, positiveN))}</output> },
    { id: "CALC-16", title: "16. Adaptive quadrature", body: <output>{show(calc.adaptiveIntegral(fn, 0, x, Math.max(1e-10, epsilon / 1000)))}</output> },
    { id: "CALC-17", title: "17. Substitution bounds", body: <><p>u={a}x²+{b}x</p><output>{show(calc.substitutionBounds(fn, 0, x))}</output></> },
    { id: "CALC-18", title: "18. Integration by parts", body: <><p>∫₀ˣ t·eᵗ dt</p><output>{show(calc.integrationByParts((t) => t, Math.exp, () => 1, 0, x))}</output></> },
    { id: "CALC-19", title: "19. Partial fractions", body: <><p>({a}x+{b}) / ((x−{x})(x−{x + 1}))</p><output>{show(calc.partialFractionsLinear(a, b, x, x + 1))}</output></> },
    { id: "CALC-20", title: "20. Improper integral convergence", body: <><p>∫₁∞ x^-{Math.abs(b)} dx</p><output>{show(calc.improperPIntegral(Math.abs(b)))}</output></> },
    { id: "CALC-21", title: "21. Washer and shell volumes", body: <output>{show(calc.revolutionVolumes((t) => Math.abs(a * t + b), 0, Math.abs(x)))}</output> },
    { id: "CALC-22", title: "22. ODE method comparison", body: <><p>y′={a}y, y(0)=1</p><output>{show(calc.odeMethodComparison((_t, y) => a * y, 0, 1, Math.abs(x), positiveN))}</output></> },
    { id: "CALC-23", title: "23. Convergence-test explorer", body: <output>{show(calc.convergenceTest({ kind: "p-series", parameter: Math.abs(b) }))}</output> },
    { id: "CALC-24", title: "24. Taylor remainder", body: <><p>eˣ, degree {Math.min(18, positiveN)}</p><output>{show(calc.taylorApproximation("exp", x, Math.min(18, positiveN)))}</output></> },
    { id: "CALC-25", title: "25. Divergence-flux theorem", body: <output>{show(calc.divergenceFluxLinear({ pX: a, qY: b }, { width: Math.abs(x), height: Math.max(epsilon, .001) }))}</output> },
  ];
  const active = tools.find((tool) => tool.id === selected) ?? tools[0];
  const samples = Array.from({ length: 80 }, (_, i) => {
    const t = -2 + i / 79 * 4;
    return { x: t, y: fn(t) };
  });
  return <div className="calc-enhancement-page">
    <section className="cs-card calc-enhancement-intro"><h2>Advanced Calculus Workbench</h2><p>Pick one investigation to visualize. The other 24 stay as a compact live index.</p></section>
    <section className="cs-card calc-enhancement-controls" aria-label="Shared calculus parameters">
      <Input label="Quadratic coefficient a" value={a} onChange={setA} /><Input label="Linear coefficient b" value={b} onChange={setB} />
      <Input label="Evaluation point x" value={x} onChange={setX} /><Input label="Epsilon" value={epsilon} min={.001} step={.01} onChange={setEpsilon} />
      <Input label="Partitions / degree n" value={n} min={2} step={1} onChange={setN} />
    </section>
    <div className="calc-enhancement-layout">
      <nav className="calc-tool-index" aria-label="Twenty-five Calculus enhancements">
        {tools.map((tool) => <button key={tool.id} type="button" className={tool.id === selected ? "active" : ""} onClick={() => setSelected(tool.id)}>{tool.title}</button>)}
      </nav>
      <div>
        <article className="cs-card calc-enhancement-tool">
          <h2>{active.title}</h2>
          {active.body}
        </article>
        <svg className="cs-card calc-selected-visual" viewBox="0 0 640 240" role="img" aria-label="Selected investigation graph">
          <rect width="640" height="240" fill="#071d35" />
          <path d={samples.map((point, i) => `${i ? "L" : "M"}${40 + (point.x + 2) * 140},${180 - point.y * 8}`).join(" ")} fill="none" stroke="#22c5ea" strokeWidth="3" />
          <circle cx={40 + (x + 2) * 140} cy={180 - fn(x) * 8} r="6" fill="#f97316" />
        </svg>
        <div hidden>{tools.map((tool) => <Tool key={tool.id} id={tool.id} title={tool.title}>{tool.body}</Tool>)}</div>
      </div>
    </div>
  </div>;
}
