import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  annulusInertia,
  boxTriple,
  cylinderVolume,
  diskInertia,
  foliumPoint,
  lagrangeCircle,
  lagrangeLine,
  polarPoint,
  rationalCurve,
  rationalDerivative,
  rectangleCentroid,
  rectangleInertia,
  rightTriangleCentroid,
  runNamedTest,
  semicubical,
  seriesCases,
  sphereVolume,
  splitRegionOrder,
  taylorExp,
  taylorPolynomialExpansion,
  taylorTrig,
  triangleInertia,
  triangleOrder,
  variableDensityCentroid,
} from "./engineeringCalculusMath";
import "../differential-equations/differentialEquations.css";

const tests = [
  ["nth", "nth-term"],
  ["comparison", "Comparison"],
  ["limit-comparison", "Limit comparison"],
  ["ratio", "Ratio"],
  ["root", "Root"],
  ["integral", "Integral"],
  ["alternating", "Alternating"],
  ["absolute", "Absolute"],
  ["raabe", "Raabe"],
  ["log", "Logarithmic"],
] as const;

const hypotheses: Record<string, string> = {
  nth: "If the terms do not tend to 0, the series diverges. A limit of 0 does not decide the series.",
  comparison: "For positive terms, a larger convergent series implies convergence, and a smaller divergent series implies divergence.",
  "limit-comparison": "For positive terms, a positive finite limit of a_n / b_n means the two series converge or diverge together. A limit of 0 or infinity is inconclusive.",
  ratio: "L = lim |a_(n+1)/a_n|. L < 1 gives absolute convergence, L > 1 gives divergence, and L = 1 is inconclusive.",
  root: "The root test uses the same three-way rule on lim |a_n|^(1/n).",
  integral: "The integral test needs a positive, continuous, decreasing function. It does not apply to alternating terms.",
  alternating: "Leibniz needs b_n ≥ 0, a monotone decrease, and b_n → 0. That gives convergence, which may still be conditional.",
  absolute: "Absolute convergence means Σ |a_n| converges. If the signed series converges and the absolute series diverges, convergence is conditional.",
  raabe: "Raabe looks at n(|a_n/a_(n+1)| − 1) when the ratio test returns 1. A limit of 1 is inconclusive.",
  log: "The logarithmic test looks at ln(1/|a_n|) / ln n. A limit of 1 is inconclusive.",
};

function Plot({ points, label }: { points: Array<{ x: number; y: number } | null>; label: string }) {
  const mapX = (x: number) => 28 + ((x + 4) / 8) * 304;
  const mapY = (y: number) => 150 - ((y + 4) / 8) * 130;
  const branches: Array<Array<{ x: number; y: number }>> = [];
  let branch: Array<{ x: number; y: number }> = [];
  points.forEach((point) => {
    const usable = point !== null && Number.isFinite(point.x) && Number.isFinite(point.y) && Math.abs(point.y) < 8;
    const jump = usable && branch.length > 0 && Math.abs(point.y - branch[branch.length - 1].y) > 6;
    if (!usable || jump) {
      if (branch.length > 1) branches.push(branch);
      branch = usable && !jump ? [point] : [];
      if (usable && jump) branch = [point];
      return;
    }
    branch.push(point);
  });
  if (branch.length > 1) branches.push(branch);
  return (
    <svg className="odes-plot" viewBox="0 0 360 180" role="img" aria-label={label}>
      <line x1="28" y1={mapY(0)} x2="332" y2={mapY(0)} stroke="currentColor" opacity="0.35" />
      <line x1={mapX(0)} y1="12" x2={mapX(0)} y2="168" stroke="currentColor" opacity="0.35" />
      {branches.map((item, index) => (
        <polyline key={index} fill="none" stroke="#0f766e" strokeWidth="2" points={item.map((point) => `${mapX(point.x)},${mapY(point.y)}`).join(" ")} />
      ))}
    </svg>
  );
}

export function SeriesTestsLab({ mode }: { mode: string }) {
  const [seriesId, setSeriesId] = useState(seriesCases[0].id);
  const [test, setTest] = useState("ratio");
  const series = seriesCases.find((item) => item.id === seriesId) ?? seriesCases[0];
  const result = runNamedTest(series, test);
  const ratios = useMemo(() => Array.from({ length: 12 }, (_, index) => {
    const n = index + 2;
    const current = series.absolute(n);
    return { x: n, y: current === 0 ? 0 : Math.abs(series.absolute(n + 1) / current) };
  }), [series]);
  const partials = useMemo(() => {
    let sum = 0;
    return Array.from({ length: 16 }, (_, index) => {
      sum += series.term(index + series.start);
      return { x: index + 1, y: sum };
    });
  }, [series]);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode === "selector" ? "Choose a test" : mode === "alternating" ? "Alternating partial sums" : "Term behavior"}</h2>
        <label>Series
          <select aria-label="Series preset" value={seriesId} onChange={(event) => setSeriesId(event.target.value)}>
            {seriesCases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <div className="odes-choice">
          {tests.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={test === id} onClick={() => setTest(id)}>{label}</button>
          ))}
        </div>
        <Plot points={mode === "alternating" ? partials : ratios} label={mode === "alternating" ? "Partial sums" : "Successive ratios"} />
      </section>
      <aside className="odes-side">
        <h2>{result.verdict}</h2>
        <p><strong>Conditions.</strong> {hypotheses[test]}</p>
        <p>{result.detail}</p>
        <p className="odes-note">An inconclusive test stays inconclusive. Another test may still decide the series.</p>
        <p><Link to="/calculus/series-parametric-polar?mode=convergence">The existing series page keeps its partial-sum view.</Link></p>
      </aside>
    </div>
  );
}

export function CurveTracingLab({ mode }: { mode: string }) {
  const [curve, setCurve] = useState<"rational" | "cusp" | "folium">("rational");
  const [polar, setPolar] = useState<"cardioid" | "limacon" | "rose" | "lemniscate" | "spiral">("cardioid");
  const [theta, setTheta] = useState(0.8);
  const [play, setPlay] = useState(false);
  const [layers, setLayers] = useState({ asymptotes: true, derivative: true });
  const [reveal, setReveal] = useState(3);
  useEffect(() => {
    if (!play) return undefined;
    const timer = window.setInterval(() => setTheta((value) => (value + 0.08) % (Math.PI * 2)), 80);
    return () => window.clearInterval(timer);
  }, [play]);
  const cartesian = useMemo(() => {
    if (curve === "folium") {
      return Array.from({ length: 80 }, (_, index) => foliumPoint(-6 + (index / 79) * 12)).filter((point): point is { x: number; y: number } => point !== null && Math.abs(point.x) < 6);
    }
    return Array.from({ length: 80 }, (_, index) => {
      const x = -3.2 + (index / 79) * 6.4;
      if (curve === "cusp") {
        const point = semicubical(x);
        return point ? { x, y: point.upper } : null;
      }
      const y = rationalCurve(x);
      return Number.isFinite(y) ? { x, y } : null;
    });
  }, [curve]);
  const polarPath = useMemo(() => Array.from({ length: 180 }, (_, index) => {
    const angle = (index / 179) * Math.PI * 2;
    const radius = polarPoint(angle, polar);
    if (!Number.isFinite(radius)) return null;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  }), [polar]);
  const markerRadius = polarPoint(theta, polar);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode === "polar" ? "Polar trace" : "Cartesian checklist"}</h2>
        {mode === "polar" ? (
          <>
            <label>Curve
              <select aria-label="Polar curve" value={polar} onChange={(event) => setPolar(event.target.value as typeof polar)}>
                <option value="cardioid">Cardioid</option>
                <option value="limacon">Limaçon with a loop</option>
                <option value="rose">Four-petal rose</option>
                <option value="lemniscate">Lemniscate</option>
                <option value="spiral">Spiral</option>
              </select>
            </label>
            <label>Angle
              <input aria-label="Polar angle" type="range" min={0} max={6.28} step={0.02} value={theta} onChange={(event) => setTheta(Number(event.target.value))} />
            </label>
            <button type="button" aria-pressed={play} onClick={() => setPlay((value) => !value)}>{play ? "Pause trace" : "Play trace"}</button>
            <Plot points={polarPath} label="Polar curve" />
          </>
        ) : (
          <>
            <div className="odes-choice">
              <button type="button" aria-pressed={curve === "rational"} onClick={() => setCurve("rational")}>Rational with asymptotes</button>
              <button type="button" aria-pressed={curve === "cusp"} onClick={() => setCurve("cusp")}>Semicubical parabola</button>
              <button type="button" aria-pressed={curve === "folium"} onClick={() => setCurve("folium")}>Folium</button>
            </div>
            <label><input type="checkbox" checked={layers.asymptotes} onChange={(event) => setLayers({ ...layers, asymptotes: event.target.checked })} /> Asymptotes</label>
            <label><input type="checkbox" checked={layers.derivative} onChange={(event) => setLayers({ ...layers, derivative: event.target.checked })} /> Derivative sign</label>
            <Plot points={cartesian} label="Traced curve" />
          </>
        )}
      </section>
      <aside className="odes-side">
        {mode === "polar" ? (
          <>
            <h2>{polar}</h2>
            <label>Reveal steps
              <input aria-label="Polar tracing step" type="range" min={1} max={5} step={1} value={Math.min(reveal, 5)} onChange={(event) => setReveal(Number(event.target.value))} />
            </label>
            <ol>
              {[
                "Check symmetry in θ before tracing the whole turn.",
                "Mark the θ values where r is zero or largest.",
                "A negative r is plotted in the opposite direction.",
                "Loops and petals come from those zeros and maxima.",
                "Trace θ from 0 to 2π only after those marks are in place.",
              ].slice(0, reveal).map((item) => <li key={item}>{item}</li>)}
            </ol>
            <p>r({theta.toFixed(2)}) = {Number.isFinite(markerRadius) ? markerRadius.toFixed(2) : "undefined"}. A negative radius is plotted in the opposite direction.</p>
            <p>Cardioid and rose use symmetry in θ. The limaçon loop appears because the constant term is smaller than the cosine coefficient. The lemniscate is drawn only where cos 2θ is nonnegative.</p>
          </>
        ) : curve === "rational" ? (
          <>
            <h2>y = x³ / (x² − 1)</h2>
            <label>Reveal steps
              <input aria-label="Cartesian tracing step" type="range" min={1} max={6} step={1} value={reveal} onChange={(event) => setReveal(Number(event.target.value))} />
            </label>
            <ol>
              {[
                "Domain excludes x = ±1.",
                "The origin is an intercept, and the function is odd.",
                "At the origin the derivative is 0, so the tangent is horizontal.",
                "Vertical asymptotes sit at x = ±1, and the oblique asymptote is y = x.",
                "Stationary points sit at 0 and ±√3.",
                "Draw the three branches separately so the curve does not cross a vertical asymptote.",
              ].slice(0, reveal).map((item) => <li key={item}>{item}</li>)}
            </ol>
            <p>Domain excludes x = ±1. The origin is an intercept, and the function is odd.</p>
            {layers.asymptotes ? <p>Vertical asymptotes at x = ±1. The oblique asymptote is y = x because the gap is x / (x² − 1).</p> : null}
            {layers.derivative ? <p>At x = 2, y&apos; = {rationalDerivative(2).toFixed(3)}. Stationary points sit at 0 and ±√3.</p> : null}
          </>
        ) : curve === "cusp" ? (
          <>
            <h2>y² = x³</h2>
            <ol>
              <li>Domain is x ≥ 0.</li>
              <li>Both branches meet the origin.</li>
              <li>Each branch has slope 0 at the origin, so the origin is a cusp.</li>
            </ol>
            <p>Domain x ≥ 0. Both branches meet at the origin with slope 0, so the origin is a cusp.</p>
          </>
        ) : (
          <>
            <h2>Folium</h2>
            <ol>
              <li>The parametric point at t = 1 is (1.5, 1.5).</li>
              <li>The loop passes through the origin.</li>
              <li>The line x + y + 1 = 0 is the asymptote for a = 1.</li>
            </ol>
            <p>The parametric point at t = 1 is (1.5, 1.5). The loop passes through the origin, and the line x + y + 1 = 0 is the asymptote for a = 1.</p>
          </>
        )}
        <p><Link to="/calculus/limits?mode=asymptotes">Vertical asymptotes also appear in the limits lab.</Link></p>
      </aside>
    </div>
  );
}

function hessianVerdict(gradient: number[], hessian: number[][]) {
  const size = Math.hypot(gradient[0] ?? 0, gradient[1] ?? 0);
  if (size > 0.08) return "The second-derivative test applies at a critical point. Move the expansion point until the gradient is near zero.";
  const xx = hessian[0]?.[0] ?? 0;
  const xy = hessian[0]?.[1] ?? 0;
  const yy = hessian[1]?.[1] ?? 0;
  const det = xx * yy - xy * xy;
  if (Math.abs(det) < 1e-6) return "Inconclusive: the Hessian determinant is zero, so this test does not decide the point.";
  if (det < 0) return "Saddle: the Hessian determinant is negative.";
  if (xx > 0) return "Local minimum: f_xx is positive and the Hessian determinant is positive.";
  return "Local maximum: f_xx is negative and the Hessian determinant is positive.";
}

export function TaylorTwoLab({ mode }: { mode: string }) {
  const [kind, setKind] = useState<"exp" | "trig" | "poly">("exp");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [h, setH] = useState(0.3);
  const [k, setK] = useState(-0.2);
  const data = kind === "exp" ? taylorExp(a, b, h, k) : kind === "trig" ? taylorTrig(a, b, h, k) : taylorPolynomialExpansion(a, b, h, k);
  const approx = mode === "linear" ? data.linear : data.quadratic;
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode === "linear" ? "Tangent plane" : "Quadratic approximation"}</h2>
        <label>Surface
          <select aria-label="Taylor surface" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}>
            <option value="exp">e^(x+y)</option>
            <option value="trig">sin x cos y</option>
            <option value="poly">x² + xy + y²</option>
          </select>
        </label>
        <label>a <input aria-label="Expansion x" type="range" min={-1} max={1} step={0.05} value={a} onChange={(event) => setA(Number(event.target.value))} /></label>
        <label>b <input aria-label="Expansion y" type="range" min={-1} max={1} step={0.05} value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
        <label>h <input aria-label="Step h" type="range" min={-1} max={1} step={0.05} value={h} onChange={(event) => setH(Number(event.target.value))} /></label>
        <label>k <input aria-label="Step k" type="range" min={-1} max={1} step={0.05} value={k} onChange={(event) => setK(Number(event.target.value))} /></label>
      </section>
      <aside className="odes-side">
        <h2>Values</h2>
        <p>f = {data.f.toFixed(4)}</p>
        <p>Approximation = {approx.toFixed(4)}</p>
        <p>Error = {(data.f - approx).toFixed(4)}</p>
        <p>Gradient ({data.gradient[0].toFixed(3)}, {data.gradient[1].toFixed(3)})</p>
        <p>Hessian [[{data.hessian[0][0].toFixed(2)}, {data.hessian[0][1].toFixed(2)}], [{data.hessian[1][0].toFixed(2)}, {data.hessian[1][1].toFixed(2)}]]</p>
        <p className="odes-note">{hessianVerdict(data.gradient, data.hessian)}</p>
        <p className="odes-note">The linear part is the tangent plane. The quadratic part adds the Hessian. The polynomial preset is exact at order 2. Constrained extrema are in Lagrange multipliers.</p>
      </aside>
    </div>
  );
}

export function LagrangeLab({ mode }: { mode: string }) {
  const [radius, setRadius] = useState(1);
  const [angle, setAngle] = useState(Math.PI / 4);
  const circle = lagrangeCircle(radius);
  const line = lagrangeLine();
  const point = mode === "line"
    ? { x: angle, y: 1 - angle }
    : { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  const gradF = mode === "line" ? [2 * point.x, 2 * point.y] : [1, 1];
  const gradG = mode === "line" ? [1, 1] : [2 * point.x, 2 * point.y];
  const cross = gradF[0] * gradG[1] - gradF[1] * gradG[0];
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode === "line" ? "Constraint line" : "Constraint circle"}</h2>
        {mode === "line" ? null : <label>Radius <input aria-label="Circle radius" type="range" min={0.4} max={2} step={0.05} value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label>}
        <label>Position <input aria-label="Constraint position" type="range" min={mode === "line" ? -1 : 0} max={mode === "line" ? 2 : 6.28} step={0.02} value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <svg className="odes-plot" viewBox="-2.2 -2.2 4.4 4.4" role="img" aria-label="Constraint and gradients">
          {mode === "line" ? <line x1="-1" y1="-2" x2="2" y2="1" stroke="#64748b" /> : <circle cx="0" cy="0" r={radius} fill="none" stroke="#64748b" />}
          <line x1={point.x} y1={-point.y} x2={point.x + gradF[0] * 0.35} y2={-(point.y + gradF[1] * 0.35)} stroke="#0f766e" />
          <line x1={point.x} y1={-point.y} x2={point.x + gradG[0] * 0.25} y2={-(point.y + gradG[1] * 0.25)} stroke="#b45309" />
          <circle cx={point.x} cy={-point.y} r="0.06" fill="#0f172a" />
        </svg>
      </section>
      <aside className="odes-side">
        <h2>{Math.abs(cross) < 0.08 ? "Gradients are parallel" : "Keep moving"}</h2>
        <p>∇f = λ ∇g. The cross product of the two gradients is {cross.toFixed(3)}.</p>
        {mode === "line" ? <p>Minimum of x² + y² on x + y = 1 is ({line.x}, {line.y}), value {line.value}, λ = {line.lambda}.</p> : <p>Maximum of x + y on the circle is ({circle.max.x.toFixed(3)}, {circle.max.y.toFixed(3)}), value {circle.max.value.toFixed(3)}.</p>}
        <p><Link to="/calculus/derivative-applications?mode=optimization">Unconstrained optimization stays on the derivative-applications page.</Link></p>
      </aside>
    </div>
  );
}

export function ChangeOrderLab({ mode }: { mode: string }) {
  const [slice, setSlice] = useState(0.45);
  const simple = triangleOrder();
  const split = splitRegionOrder();
  const info = mode === "split" ? split : simple;
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode === "split" ? "A region that splits" : "Triangle, two orders"}</h2>
        <label>Slice <input aria-label="Slice position" type="range" min={0.05} max={0.95} step={0.01} value={slice} onChange={(event) => setSlice(Number(event.target.value))} /></label>
        <svg className="odes-plot" viewBox="0 0 220 140" role="img" aria-label="Integration region">
          {mode === "split" ? <polygon points="20,120 110,20 200,120" fill="#99f6e4" stroke="#0f766e" /> : <polygon points="20,120 200,120 200,20" fill="#99f6e4" stroke="#0f766e" />}
          <line x1={20 + slice * 180} y1="20" x2={20 + slice * 180} y2="120" stroke="#b45309" />
        </svg>
      </section>
      <aside className="odes-side">
        <h2>Area {info.area}</h2>
        {mode === "split" ? (
          <p>Vertical description splits at x = 1: ∫₀¹ ∫₀ˣ dy dx + ∫₁² ∫₀^(2−x) dy dx = {split.vertical}. Horizontal description is one piece: ∫₀¹ ∫_y^(2−y) dx dy = {split.horizontal}.</p>
        ) : (
          <p>Type I: ∫₀¹ ∫₀ˣ dy dx = {simple.vertical}. Type II: ∫₀¹ ∫_y¹ dx dy = {simple.horizontal}. The two iterated integrals agree.</p>
        )}
        <p><Link to="/calculus/jacobians-coordinate-transformations?mode=change">A change of variables is a different rewrite, on the Jacobian page.</Link></p>
      </aside>
    </div>
  );
}

export function CentroidLab({ mode }: { mode: string }) {
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(1);
  const [slope, setSlope] = useState(0.5);
  const uniform = rectangleCentroid(width, height);
  const variable = variableDensityCentroid(width, height, mode === "density" ? slope : 0);
  const triangle = rightTriangleCentroid();
  const point = mode === "triangle" ? triangle : variable;
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Balance point</h2>
        {mode === "triangle" ? null : (
          <>
            <label>Width <input aria-label="Lamina width" type="range" min={0.5} max={3} step={0.1} value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
            <label>Height <input aria-label="Lamina height" type="range" min={0.4} max={2} step={0.1} value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
          </>
        )}
        {mode === "density" ? <label>Density slope <input aria-label="Density slope" type="range" min={0} max={2} step={0.1} value={slope} onChange={(event) => setSlope(Number(event.target.value))} /></label> : null}
        <svg className="odes-plot" viewBox="0 0 220 140" role="img" aria-label="Centroid">
          <rect x="30" y="30" width={mode === "triangle" ? 140 : width * 50} height={mode === "triangle" ? 90 : height * 50} fill="#ccfbf1" stroke="#0f766e" />
          <circle cx={30 + point.x * (mode === "triangle" ? 140 : 50)} cy={30 + (mode === "triangle" ? 90 - point.y * 90 : height * 25)} r="5" fill="#b45309" />
        </svg>
      </section>
      <aside className="odes-side">
        <h2>({point.x.toFixed(3)}, {point.y.toFixed(3)})</h2>
        {mode === "density" ? <p>ρ = 1 + {slope.toFixed(1)} x. Mass {variable.mass.toFixed(3)}. The centroid shifts toward the heavier side.</p> : mode === "triangle" ? <p>Uniform right triangle of area {triangle.area}. Centroid is the average of the vertices (0,0), (1,0), (1,1).</p> : <p>Uniform rectangle area {uniform.area.toFixed(2)}. The balance point is the center.</p>}
      </aside>
    </div>
  );
}

export function InertiaLab({ mode }: { mode: string }) {
  const [radius, setRadius] = useState(1.4);
  const [inner, setInner] = useState(0.6);
  const rectangle = rectangleInertia(2, 1, 1);
  const disk = diskInertia(radius, 1);
  const ring = annulusInertia(inner, radius, 1);
  const triangle = triangleInertia();
  const value = mode === "disk" ? disk.io : mode === "annulus" ? ring.io : mode === "triangle" ? triangle.io : rectangle.io;
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>Mass moment about the origin</h2>
        {mode === "rectangle" || mode === "triangle" ? null : <label>Outer radius <input aria-label="Outer radius" type="range" min={0.8} max={2} step={0.05} value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label>}
        {mode === "annulus" ? <label>Inner radius <input aria-label="Inner radius" type="range" min={0.1} max={radius - 0.1} step={0.05} value={Math.min(inner, radius - 0.1)} onChange={(event) => setInner(Number(event.target.value))} /></label> : null}
        <p>I₀ = {value.toFixed(3)}</p>
      </section>
      <aside className="odes-side">
        <h2>Formula</h2>
        {mode === "disk" ? <p>I₀ = ½ M R² with M = π R² for density 1. I_x = I_y = half of that by symmetry.</p> : null}
        {mode === "annulus" ? <p>I₀ = ½ π (R₂⁴ − R₁⁴). Mass is π(R₂² − R₁²).</p> : null}
        {mode === "triangle" ? <p>For the right triangle, I_x = 1/12, I_y = 1/4, and I₀ = I_x + I_y = 1/3.</p> : null}
        {mode === "rectangle" ? <p>I_x = ∬ y² dA = a b³ / 3 = {rectangle.ix.toFixed(3)}. I_y = {rectangle.iy.toFixed(3)}. These are mass moments with density 1, which coincide with area second moments.</p> : null}
        <p><Link to="/calculus/centroid-center-of-mass">The centroid uses the first moments; inertia uses the second.</Link></p>
      </aside>
    </div>
  );
}

export function IntegralApplicationsLab({ mode }: { mode: string }) {
  const [a, setA] = useState(2);
  const [radius, setRadius] = useState(1);
  const [height, setHeight] = useState(2);
  const box = boxTriple(a, a, a);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        <h2>{mode}</h2>
        <label>Size <input aria-label="Solid size" type="range" min={0.5} max={3} step={0.1} value={a} onChange={(event) => setA(Number(event.target.value))} /></label>
        <label>Radius <input aria-label="Radius" type="range" min={0.4} max={2} step={0.05} value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label>
        <label>Height <input aria-label="Height" type="range" min={0.4} max={3} step={0.1} value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
      </section>
      <aside className="odes-side">
        {mode === "triple" ? <p>Box volume {box.volume.toFixed(2)}. Centroid ({box.centroid.map((value) => value.toFixed(2)).join(", ")}). Average of f = x is {box.averageX.toFixed(2)}.</p> : null}
        {mode === "volume" ? <p>Cylinder volume {cylinderVolume(radius, height).toFixed(3)}. Sphere volume {sphereVolume(radius).toFixed(3)}.</p> : null}
        {mode === "average" ? <p>On the cube [0, a]³ the average of x is a/2 = {(a / 2).toFixed(2)}, because the triple integral of x is a²/2 times the face area a², divided by volume a³.</p> : null}
        {mode === "area" ? <p>The unit-triangle area is 1/2, matching both orders on the change-of-order page.</p> : null}
        <p>Mass, centroid, and inertia have their own labs. The Jacobian supplies dA and dV when the region is easier in polar, cylindrical, or spherical coordinates.</p>
        <p><Link to="/calculus/jacobians-coordinate-transformations">Open coordinate transformations.</Link></p>
      </aside>
    </div>
  );
}
