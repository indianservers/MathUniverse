import {
  Check,
  CircleHelp,
  Play,
  RefreshCw,
  Shuffle,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ConicIdentificationTargetLesson10151.css";

type Coefficients = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
};
const initial: Coefficients = { A: 1, B: 2, C: -3, D: 2, E: -4, F: 1 };
const examples: Array<Coefficients & { name: string }> = [
  { name: "Ellipse", A: 1, B: 4, C: 5, D: -2, E: 6, F: -3 },
  { name: "Parabola", A: 0, B: 4, C: 1, D: 2, E: 4, F: 1 },
  { name: "Hyperbola", ...initial },
];
const randomSets: Coefficients[] = [
  { A: 1, B: 0, C: 1, D: -4, E: 6, F: -3 },
  { A: 1, B: 0, C: 2, D: -2, E: 4, F: -8 },
  { A: 1, B: 2, C: 1, D: -6, E: -6, F: 5 },
  { A: 2, B: 1, C: -1, D: 3, E: -2, F: -5 },
];
const nearZero = (n: number) => Math.abs(n) < 1e-8;
const fmt = (n: number, digits = 3) =>
  nearZero(n) ? "0" : Number(n.toFixed(digits)).toString();

function determinant3(c: Coefficients) {
  const { A, B, C, D, E, F } = c;
  return (
    A * (C * F - (E * E) / 4) -
    (B / 2) * ((B * F) / 2 - (D * E) / 4) +
    (D / 2) * ((B * E) / 4 - (C * D) / 2)
  );
}

function classify(c: Coefficients) {
  const delta = c.B * c.B - 4 * c.A * c.C;
  const allZero = Object.values(c).every(nearZero);
  const quadraticZero = nearZero(c.A) && nearZero(c.B) && nearZero(c.C);
  const degenerate = nearZero(determinant3(c));
  let kind =
    delta > 1e-8 ? "HYPERBOLA" : delta < -1e-8 ? "ELLIPSE-TYPE" : "PARABOLA";
  if (allZero) kind = "ALL PLANE";
  else if (quadraticZero) kind = "LINEAR / EMPTY";
  else if (degenerate) kind = "DEGENERATE CONIC";
  const centerDen = 4 * c.A * c.C - c.B * c.B;
  const center = nearZero(centerDen)
    ? null
    : {
        x: (c.B * c.E - 2 * c.C * c.D) / centerDen,
        y: (c.B * c.D - 2 * c.A * c.E) / centerDen,
      };
  const angle = Math.atan2(c.B, c.A - c.C) / 2;
  return { delta, allZero, quadraticZero, degenerate, kind, center, angle };
}

function contourPath(c: Coefficients, zoom: number, principal: boolean) {
  const W = 700,
    H = 330,
    cols = 100,
    rows = 56;
  const rangeX = 12 / zoom,
    rangeY = 8 / zoom;
  const angle = principal ? classify(c).angle : 0;
  const value = (screenX: number, screenY: number) => {
    const x = screenX * Math.cos(angle) - screenY * Math.sin(angle);
    const y = screenX * Math.sin(angle) + screenY * Math.cos(angle);
    return c.A * x * x + c.B * x * y + c.C * y * y + c.D * x + c.E * y + c.F;
  };
  const p = (i: number, j: number) => ({
    x: -rangeX + (2 * rangeX * i) / cols,
    y: rangeY - (2 * rangeY * j) / rows,
  });
  const sx = (x: number) => ((x + rangeX) / (2 * rangeX)) * W;
  const sy = (y: number) => ((rangeY - y) / (2 * rangeY)) * H;
  let d = "";
  const edge = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    va: number,
    vb: number,
  ) => {
    const t = Math.abs(va - vb) < 1e-9 ? 0.5 : va / (va - vb);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const q = [p(i, j), p(i + 1, j), p(i + 1, j + 1), p(i, j + 1)];
      const v = q.map(({ x, y }) => value(x, y));
      const cuts: { x: number; y: number }[] = [];
      for (let e = 0; e < 4; e++) {
        const n = (e + 1) % 4;
        if (v[e] <= 0 !== v[n] <= 0) cuts.push(edge(q[e], q[n], v[e], v[n]));
      }
      if (cuts.length === 2)
        d += `M${sx(cuts[0].x).toFixed(1)},${sy(cuts[0].y).toFixed(1)}L${sx(cuts[1].x).toFixed(1)},${sy(cuts[1].y).toFixed(1)}`;
      else if (cuts.length === 4)
        d += `M${sx(cuts[0].x).toFixed(1)},${sy(cuts[0].y).toFixed(1)}L${sx(cuts[1].x).toFixed(1)},${sy(cuts[1].y).toFixed(1)}M${sx(cuts[2].x).toFixed(1)},${sy(cuts[2].y).toFixed(1)}L${sx(cuts[3].x).toFixed(1)},${sy(cuts[3].y).toFixed(1)}`;
    }
  return { d, W, H, sx, sy, rangeX, rangeY };
}

export default function ConicIdentificationTargetLesson10151({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [coefficients, setCoefficients] = useState(initial);
  const [view, setView] = useState<"original" | "principal">("original");
  const [zoom, setZoom] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [actions, setActions] = useState(0);
  const result = useMemo(() => classify(coefficients), [coefficients]);
  const graph = useMemo(
    () => contourPath(coefficients, zoom, view === "principal"),
    [coefficients, zoom, view],
  );
  useEffect(() => {
    if (!animating) return;
    const timer = window.setInterval(
      () =>
        setCoefficients((old) => ({
          ...old,
          F: old.F >= 6 ? -6 : Number((old.F + 0.25).toFixed(2)),
        })),
      120,
    );
    return () => window.clearInterval(timer);
  }, [animating]);
  const update = (key: keyof Coefficients, value: number) => {
    setCoefficients((old) => ({
      ...old,
      [key]: Number.isFinite(value) ? value : 0,
    }));
    setActions((n) => n + 1);
  };
  const load = (c: Coefficients) => {
    setCoefficients(c);
    setActions((n) => n + 1);
  };
  const status = (ok: boolean) => (
    <span className={ok ? "ok" : "no"}>
      {ok ? <Check /> : <X />}
      {ok ? "OK" : "No"}
    </span>
  );
  const angleDegrees = (result.angle * 180) / Math.PI;
  return (
    <section
      className="ci10151-page"
      data-testid="school-mockup-0825"
      data-object-model="dedicated-general-conic-discriminant-and-contour-engine"
      data-classification={result.kind}
      data-discriminant={fmt(result.delta)}
      data-degenerate={result.degenerate}
      data-rotation={angleDegrees.toFixed(3)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Conic Identification from General Equation</h1>
        <p>
          Classify and visualize the conic represented by Ax² + Bxy + Cy² + Dx +
          Ey + F = 0.
        </p>
      </header>
      <main>
        <aside className="ci-input panel">
          <h2>EQUATION INPUT</h2>
          <div className="formula">Ax² + Bxy + Cy² + Dx + Ey + F = 0</div>
          <div className="coefficient-grid">
            {(["A", "B", "C", "D", "E", "F"] as const).map((key) => (
              <label key={key}>
                <b>{key}</b>
                <input
                  aria-label={`Coefficient ${key}`}
                  type="number"
                  step="1"
                  value={coefficients[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                />
              </label>
            ))}
          </div>
          <div className="input-actions">
            <button
              onClick={() =>
                load(randomSets[Math.floor(Math.random() * randomSets.length)])
              }
            >
              <Shuffle />
              Random example
            </button>
            <button
              onClick={() => load({ A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 })}
            >
              <Trash2 />
              Clear
            </button>
          </div>
        </aside>
        <section className="ci-classification panel">
          <h2>CLASSIFICATION</h2>
          <p>
            Discriminant &nbsp; <span className="formula">Δ = B² − 4AC</span>
          </p>
          <div className="delta formula">
            Δ = {fmt(coefficients.B)}² − 4({fmt(coefficients.A)})(
            {fmt(coefficients.C)}) = <strong>{fmt(result.delta)}</strong>
          </div>
          <div
            className={`result ${result.delta > 0 ? "hyper" : result.delta < 0 ? "ellipse" : "parabola"}`}
          >
            <b>Δ {result.delta > 0 ? ">" : result.delta < 0 ? "<" : "="} 0</b>
            <strong>{result.kind}</strong>
          </div>
          <div className="key">
            <span className="green-dot" />Δ &lt; 0{" "}
            <i>Ellipse-type (ellipse or circle)</i>
            <span className="yellow-dot" />Δ = 0 <i>Parabola</i>
            <span className="orange-dot" />Δ &gt; 0 <i>Hyperbola</i>
          </div>
          <hr />
          <h3>DEGENERACY CHECKS</h3>
          <p>All zero? (A=B=C=D=E=F=0) {status(result.allZero)}</p>
          <p>
            Quadratic part zero? (A=B=C=0) <CircleHelp />{" "}
            {status(result.quadraticZero)}
          </p>
          <p>
            Δ = 0 but not all A=B=C=0{" "}
            {status(nearZero(result.delta) && !result.quadraticZero)}
          </p>
          <p>
            For ellipse/circle, AC − (B/2)² ≠ 0{" "}
            {status(result.delta < 0 && !result.degenerate)}
          </p>
          <hr />
          <h3>ROTATION INDICATOR</h3>
          <p>B ≠ 0 ⇒ Axes are rotated.</p>
          <div className="rotation formula">
            θ = ½ tan⁻¹(B/(A−C)) = <strong>{angleDegrees.toFixed(3)}°</strong>
          </div>
          <small>
            {nearZero(coefficients.B)
              ? "When B = 0, axes are not rotated."
              : "Rotate to principal axes to remove the xy term."}
          </small>
        </section>
        <section className="ci-graph panel">
          <div className="graph-heading">
            <h2>GRAPH OF THE CONIC</h2>
            <label>
              View{" "}
              <select
                aria-label="Graph view"
                value={view}
                onChange={(e) => {
                  setView(e.target.value as "original" | "principal");
                  setActions((n) => n + 1);
                }}
              >
                <option value="original">Original (x, y)</option>
                <option value="principal">Principal axes (u, v)</option>
              </select>
            </label>
          </div>
          <div className="plot-row">
            <svg
              viewBox={`0 0 ${graph.W} ${graph.H}`}
              aria-label="Live implicit conic graph"
            >
              {Array.from({ length: 13 }, (_, i) => i - 6).map((n) => (
                <g key={n}>
                  <line
                    className="grid"
                    x1={graph.sx(n * 2)}
                    x2={graph.sx(n * 2)}
                    y1="0"
                    y2={graph.H}
                  />
                  <line
                    className="grid"
                    x1="0"
                    x2={graph.W}
                    y1={graph.sy(n * 2)}
                    y2={graph.sy(n * 2)}
                  />
                </g>
              ))}
              <line
                className="axis"
                x1="0"
                x2={graph.W}
                y1={graph.sy(0)}
                y2={graph.sy(0)}
              />
              <line
                className="axis"
                x1={graph.sx(0)}
                x2={graph.sx(0)}
                y1="0"
                y2={graph.H}
              />
              <path className="conic" d={graph.d} />
              {result.center && (
                <>
                  <circle
                    className="center"
                    cx={graph.sx(result.center.x)}
                    cy={graph.sy(result.center.y)}
                    r="6"
                  />
                  <text
                    x={graph.sx(result.center.x) + 9}
                    y={graph.sy(result.center.y) - 8}
                  >
                    C
                  </text>
                </>
              )}
            </svg>
            <aside>
              <p>
                <i className="conic-line" />
                Conic
              </p>
              {result.center && (
                <div>
                  <b>Center (h, k)</b>
                  <span className="formula">
                    ({fmt(result.center.x)}, {fmt(result.center.y)})
                  </span>
                </div>
              )}
            </aside>
          </div>
          <div className="graph-actions">
            <button
              className={animating ? "active" : ""}
              onClick={() => {
                setAnimating((v) => !v);
                setActions((n) => n + 1);
              }}
            >
              <Play /> {animating ? "Pause" : "Animate"}
            </button>
            <button onClick={() => setZoom(1)}>
              <ZoomIn />
              Zoom fit
            </button>
            <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}>
              <ZoomIn />
              Zoom in
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
              <ZoomOut />
              Zoom out
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setView("original");
                setAnimating(false);
              }}
            >
              <RefreshCw />
              Reset view
            </button>
          </div>
        </section>
      </main>
      <section className="ci-bottom">
        <article className="examples panel">
          <h2>WORKED EXAMPLES</h2>
          <div>
            {examples.map((ex, i) => (
              <button
                key={ex.name}
                className={`example ex-${i}`}
                onClick={() => load(ex)}
              >
                <b>
                  Example {i + 1} ({ex.name})
                </b>
                <span className="formula">
                  {fmt(ex.A)}x² + {fmt(ex.B)}xy + {fmt(ex.C)}y² + {fmt(ex.D)}x +{" "}
                  {fmt(ex.E)}y + {fmt(ex.F)} = 0
                </span>
                <span>
                  A = {ex.A}, B = {ex.B}, C = {ex.C}
                </span>
                <span>Δ = {fmt(ex.B * ex.B - 4 * ex.A * ex.C)}</span>
                <strong>{classify(ex).kind}</strong>
              </button>
            ))}
          </div>
        </article>
        <article className="circle-note panel">
          <h2>SPECIAL NOTE: CIRCLE</h2>
          <p>A circle is a special case of ellipse.</p>
          <p>Requirements:</p>
          <ul>
            <li>A = C</li>
            <li>B = 0</li>
            <li>A ≠ 0</li>
          </ul>
          <p>Example: &nbsp; x² + y² − 4x + 6y − 3 = 0</p>
          <small>(Center (2, −3), radius 4)</small>
        </article>
      </section>
    </section>
  );
}
