import { useState, type ReactNode } from "react";
import * as calc from "./calculusEnhancementEngine";

function Tool({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <article className="cs-card calc-enhancement-tool" data-enhancement-id={id}><h2>{title}</h2>{children}</article>;
}
function Input({ label, value, onChange, min, step = .1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; step?: number }) {
  return <label><span>{label}</span><input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
function fmt(value: number) {
  return Number.isFinite(value) ? String(Math.round(value * 1e6) / 1e6) : String(value);
}

export default function CalculusEnhancementWorkbench() {
  const [a, setA] = useState(1), [b, setB] = useState(2), [x, setX] = useState(1), [epsilon, setEpsilon] = useState(.1), [n, setN] = useState(20);
  const [selected, setSelected] = useState("CALC-01");
  const fn = (t: number) => a * t * t + b * t;
  const derivative = (t: number) => 2 * a * t + b;
  const positiveN = Math.max(2, Math.round(Math.abs(n)));
  const eps = calc.epsilonDelta(fn, x, fn(x), Math.max(.001, epsilon));
  const sides = calc.oneSidedLimits(fn, x);
  const seq = calc.sequenceLimit((index) => x + 1 / index, x);
  const disc = calc.classifyDiscontinuity(a, b, x);
  const lhopital = calc.lhopitalEligibility({ numeratorLimit: a === 0 ? 0 : Infinity, denominatorLimit: b === 0 ? 0 : Infinity, differentiableNearby: true, derivativeDenominatorNonzero: b !== 0 });
  const secant = calc.secantToTangent(fn, x, Math.max(.0001, Math.abs(epsilon)));
  const tree = calc.derivativeRuleTree(`sin(${a}*x^2+${b}*x)`);
  const implicit = calc.implicitCircleTangent(a, b, Math.hypot(a, b));
  const motion = calc.polynomialMotion([a, b, 1, 0], x);
  const linear = calc.linearization(fn, derivative, 0, x);
  const related = calc.circleRelatedRates(Math.abs(x), a);
  const opt = calc.rectangleOptimization(Math.abs(b) * 10);
  const mvt = calc.meanValuePointQuadratic(a, b, 0, x || 1);
  const ftc = calc.ftcAccumulator(fn, 0, x);
  const riemann = calc.riemannComparison(fn, 0, x, positiveN);
  const adaptive = calc.adaptiveIntegral(fn, 0, x, Math.max(1e-10, epsilon / 1000));
  const sub = calc.substitutionBounds(fn, 0, x);
  const parts = calc.integrationByParts((t) => t, Math.exp, () => 1, 0, x);
  const partial = calc.partialFractionsLinear(a, b, x, x + 1);
  const improper = calc.improperPIntegral(Math.abs(b));
  const volumes = calc.revolutionVolumes((t) => Math.abs(a * t + b), 0, Math.abs(x));
  const ode = calc.odeMethodComparison((_t, y) => a * y, 0, 1, Math.abs(x), positiveN);
  const series = calc.convergenceTest({ kind: "p-series", parameter: Math.abs(b) });
  const taylor = calc.taylorApproximation("exp", x, Math.min(18, positiveN));
  const flux = calc.divergenceFluxLinear({ pX: a, qY: b }, { width: Math.abs(x), height: Math.max(epsilon, .001) });
  const tools = [
    { id: "CALC-01", title: "1. Epsilon–delta bands", body: <p>{eps?.verified ? `A δ of ${fmt(eps.delta)} keeps |f(x)−L| inside ε = ${fmt(eps.epsilon)}.` : `No δ was found that stays inside ε = ${fmt(Math.max(.001, epsilon))}.`}</p> },
    { id: "CALC-02", title: "2. One-sided limits", body: <p>Left is {fmt(sides.left)} and right is {fmt(sides.right)}; the two-sided limit {sides.exists ? "exists" : "does not exist"}.</p> },
    { id: "CALC-03", title: "3. Sequential limit", body: <p>The sequence x + 1/n approaches {fmt(seq.target)} with final error {fmt(seq.finalError)}.</p> },
    { id: "CALC-04", title: "4. Discontinuity classification", body: <p>Left={a}, right={b}, defined value={x}. Classification: {disc}.</p> },
    { id: "CALC-05", title: "5. L’Hôpital prerequisite check", body: <p>The 0/0 or ∞/∞ form is {lhopital.indeterminate ? "present" : "absent"}; L’Hôpital is {lhopital.eligible ? "eligible" : "not eligible"} with these limits.</p> },
    { id: "CALC-06", title: "6. Secant to tangent", body: <p>Secant slope {fmt(secant.secant)} vs tangent {fmt(secant.tangent)}; absolute error {fmt(secant.error)}.</p> },
    { id: "CALC-07", title: "7. Derivative rule tree", body: <p>sin({a}x²+{b}x) matches the {tree.rule} rule{tree.children.length ? ` with inner pieces ${tree.children.join(", ")}` : ""}.</p> },
    { id: "CALC-08", title: "8. Implicit tangent and normal", body: <p>At ({a}, {b}) on the circle, the tangent slope is {implicit.slope === Infinity ? "vertical" : fmt(implicit.slope)} and the residual is {fmt(implicit.residual)}.</p> },
    { id: "CALC-09", title: "9. Higher-derivative motion", body: <p>At t={x}, position {fmt(motion.position)}, velocity {fmt(motion.velocity)}, acceleration {fmt(motion.acceleration)}, jerk {fmt(motion.jerk)}.</p> },
    { id: "CALC-10", title: "10. Linearization error", body: <p>L(x) ≈ {fmt(linear.approximation)} while f(x) = {fmt(linear.actual)}; error {fmt(linear.error)}.</p> },
    { id: "CALC-11", title: "11. Related rates", body: <p>For radius {fmt(Math.abs(x))} with dr/dt = {a}, area grows at {fmt(related.areaRate)} and circumference at {fmt(related.circumferenceRate)}.</p> },
    { id: "CALC-12", title: "12. Constrained optimization", body: <p>A rectangle of perimeter {fmt(Math.abs(b) * 10)} has maximum area {fmt(opt.maximumArea)} as a {fmt(opt.width)} by {fmt(opt.height)} square.</p> },
    { id: "CALC-13", title: "13. Mean Value Theorem point", body: <p>{mvt ? `A Mean Value point sits at c = ${fmt(mvt.c)} with secant slope ${fmt(mvt.secantSlope)}.` : "Need a nonzero quadratic coefficient and a genuine interval."}</p> },
    { id: "CALC-14", title: "14. FTC accumulator", body: <p>F({fmt(x)}) = {fmt(ftc.value)}; F′ ≈ {fmt(ftc.derivative)} vs f = {fmt(ftc.integrand)} (residual {fmt(ftc.residual)}).</p> },
    { id: "CALC-15", title: "15. Riemann-method comparison", body: <p>Left {fmt(riemann.left)}, right {fmt(riemann.right)}, midpoint {fmt(riemann.midpoint)}, trapezoid {fmt(riemann.trapezoid)} on n = {positiveN}.</p> },
    { id: "CALC-16", title: "16. Adaptive quadrature", body: <p>Adaptive Simpson gives {fmt(adaptive.value)} with error estimate {fmt(adaptive.errorEstimate)} using {adaptive.intervals} intervals.</p> },
    { id: "CALC-17", title: "17. Substitution bounds", body: <p>u={a}x²+{b}x maps [{fmt(sub.original[0])}, {fmt(sub.original[1])}] to [{fmt(sub.transformed[0])}, {fmt(sub.transformed[1])}].</p> },
    { id: "CALC-18", title: "18. Integration by parts", body: <p>∫₀ˣ t·eᵗ dt: boundary {fmt(parts.boundary)} minus remainder {fmt(parts.remainder)} equals {fmt(parts.value)}.</p> },
    { id: "CALC-19", title: "19. Partial fractions", body: <p>{partial ? `(${a}x+${b}) / ((x−${x})(x−${x + 1})) = ${fmt(partial.A)}/(x−${fmt(x)}) + ${fmt(partial.B)}/(x−${fmt(x + 1)}).` : "Need two distinct linear factors."}</p> },
    { id: "CALC-20", title: "20. Improper integral convergence", body: <p>{`∫₁∞ x^−${fmt(Math.abs(b))} dx ${improper.converges ? `converges to ${fmt(improper.value)}` : "diverges"}; ${improper.criterion}.`}</p> },
    { id: "CALC-21", title: "21. Washer and shell volumes", body: <p>Washer volume {fmt(volumes.washers)} versus shell volume {fmt(volumes.shells)} for the current radius.</p> },
    { id: "CALC-22", title: "22. ODE method comparison", body: <p>y′={a}y, y(0)=1: Euler {fmt(ode.euler)}, Heun {fmt(ode.heun)}, RK4 {fmt(ode.rk4)}.</p> },
    { id: "CALC-23", title: "23. Convergence-test explorer", body: <p>The p-series with p = {fmt(Math.abs(b))} {series.converges ? "converges" : "diverges"} because {series.reason}.</p> },
    { id: "CALC-24", title: "24. Taylor remainder", body: <p>eˣ at degree {taylor.degree}: T ≈ {fmt(taylor.approximation)} vs {fmt(taylor.actual)}, remainder {fmt(taylor.error)}.</p> },
    { id: "CALC-25", title: "25. Divergence-flux theorem", body: <p>div F = {fmt(flux.divergence)} on area {fmt(flux.area)} yields flux {fmt(flux.flux)} ({flux.theorem}).</p> },
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
