import { useState, type PointerEvent, type ReactNode } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, StatusOk, clamp, fmt, useLabMode } from "../studioLabKit";
import { solveSsaAmbiguous } from "./trigonometryTargetMath";

type Point = { x: number; y: number };
type Vertex = "A" | "B" | "C";
type KnownValue = "a" | "b" | "c" | "A" | "B" | "C";

const DEG = Math.PI / 180;
const COLORS = {
  a: "#8b5cf6",
  b: "#06b6d4",
  c: "#f97316",
  paper: "#f9fcff",
} as const;

function distance(p: Point, q: Point) {
  return Math.hypot(p.x - q.x, p.y - q.y);
}

function angleAt(p: Point, q: Point, r: Point) {
  const ux = q.x - p.x;
  const uy = q.y - p.y;
  const vx = r.x - p.x;
  const vy = r.y - p.y;
  return Math.acos(clamp((ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy) || 1), -1, 1)) / DEG;
}

function signedDoubleArea(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.y);
}

function circumcircle(a: Point, b: Point, c: Point) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) return null;
  const aa = a.x * a.x + a.y * a.y;
  const bb = b.x * b.x + b.y * b.y;
  const cc = c.x * c.x + c.y * c.y;
  return {
    center: {
      x: (aa * (b.y - c.y) + bb * (c.y - a.y) + cc * (a.y - b.y)) / d,
      y: (aa * (c.x - b.x) + bb * (a.x - c.x) + cc * (b.x - a.x)) / d,
    },
    radius: 0,
  };
}

function projection(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1);
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function angleArc(center: Point, from: Point, to: Point, radius: number) {
  const a0 = Math.atan2(from.y - center.y, from.x - center.x);
  let delta = Math.atan2(to.y - center.y, to.x - center.x) - a0;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  const end = a0 + delta;
  const p0 = { x: center.x + radius * Math.cos(a0), y: center.y + radius * Math.sin(a0) };
  const p1 = { x: center.x + radius * Math.cos(end), y: center.y + radius * Math.sin(end) };
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 ${delta > 0 ? 1 : 0} ${p1.x} ${p1.y}`;
}

function placeTriangle(a: number, b: number, angleC: number): Record<Vertex, Point> {
  const scale = 30;
  const B = { x: 86, y: 348 };
  const C = { x: 86 + a * scale, y: 348 };
  const rad = angleC * DEG;
  return {
    A: { x: 86 + b * Math.cos(rad) * scale, y: 348 - b * Math.sin(rad) * scale },
    B,
    C,
  };
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle trig-target-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

export function ObliqueTriangleLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [points, setPoints] = useState<Record<Vertex, Point>>(placeTriangle(7.8, 10.5, 69.7));
  const [dragging, setDragging] = useState<Vertex | null>(null);
  const [showCircle, setShowCircle] = useState(true);
  const [showAltitudes, setShowAltitudes] = useState(false);
  const [showSecond, setShowSecond] = useState(true);
  const [known, setKnown] = useState<Record<KnownValue, boolean>>({ a: true, b: true, c: true, A: true, B: true, C: false });
  const A = points.A;
  const B = points.B;
  const C = points.C;
  const scale = 30;
  const a = distance(B, C) / scale;
  const b = distance(C, A) / scale;
  const c = distance(A, B) / scale;
  const angleA = angleAt(A, B, C);
  const angleB = angleAt(B, A, C);
  const angleC = 180 - angleA - angleB;
  const area = Math.abs(signedDoubleArea(A, B, C)) / 2 / (scale * scale);
  const semiperimeter = (a + b + c) / 2;
  const heronArea = Math.sqrt(Math.max(0, semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)));
  const rawCircle = circumcircle(A, B, C);
  const circle = rawCircle ? { ...rawCircle, radius: distance(rawCircle.center, A) } : null;
  const altitudeA = projection(A, B, C);
  const altitudeB = projection(B, A, C);
  const altitudeC = projection(C, A, B);
  const sineRatio = a / Math.sin(angleA * DEG);
  const knownCount = Object.values(known).filter(Boolean).length;
  const valid = area > 0.02 && a + b > c && b + c > a && c + a > b;
  const ssa = solveSsaAmbiguous(a, b, angleA);
  const second = ssa.obtuse && showSecond
    ? placeTriangle(a, b, ssa.obtuse.C)
    : null;

  const moveVertex = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const next = {
      x: clamp(((event.clientX - box.left) / box.width) * 420, 28, 392),
      y: clamp(((event.clientY - box.top) / box.height) * 420, 28, 392),
    };
    setPoints((current) => ({ ...current, [dragging]: next }));
  };

  const applyNumber = (key: KnownValue, value: number) => {
    if (key === "a") {
      setPoints(placeTriangle(Math.max(0.5, value), b, angleC));
      return;
    }
    if (key === "b") {
      setPoints(placeTriangle(a, Math.max(0.5, value), angleC));
      return;
    }
    if (key === "C") {
      setPoints(placeTriangle(a, b, clamp(value, 8, 170)));
      return;
    }
    if (key === "A") {
      setPoints(placeTriangle(a, b, clamp(180 - value - angleB, 8, 170)));
      return;
    }
    if (key === "B") {
      setPoints(placeTriangle(a, b, clamp(180 - angleA - value, 8, 170)));
      return;
    }
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs ob-target-tabs" aria-label="Oblique triangle modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab ob-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-ob-mode={mode}>
        <Panel title="Triangle Inputs" className="trig-target-card trig-target-oblique-controls ob-target-controls">
          <p className="msk-note">
            {mode === "Sine Law" ? "Sides stay proportional to the sines of the opposite angles."
              : mode === "Cosine Law" ? "c² = a² + b² − 2ab cos C generalizes Pythagoras."
                : mode === "Area" ? "Area is ½ab sin C, or Heron from three sides."
                  : mode === "SSA Ambiguous Case" ? "Compare a with height h = b sin A. Two triangles can appear."
                    : "Give enough known values, then solve the remaining parts."}
          </p>
          <div className="trig-target-section-title">Sides</div>
          {(["a", "b", "c"] as const).map((key) => (
            <Field key={key} label={`${key} (${key === "a" ? "BC" : key === "b" ? "CA" : "AB"})`}>
              <div className="msk-num-row">
                <input type="number" min={0.5} step={0.1} value={Number(fmt(key === "a" ? a : key === "b" ? b : c, 2))} onChange={(event) => applyNumber(key, Number(event.target.value))} />
              </div>
            </Field>
          ))}
          <div className="trig-target-section-title">Angles</div>
          {(["A", "B", "C"] as const).map((key) => (
            <Field key={key} label={`∠${key}`}>
              <div className="msk-num-row">
                <input type="number" min={1} max={178} step={0.1} value={Number(fmt(key === "A" ? angleA : key === "B" ? angleB : angleC, 2))} onChange={(event) => applyNumber(key, Number(event.target.value))} />
                <span>°</span>
              </div>
            </Field>
          ))}
          <div className="trig-target-known-heading"><b>Known values</b><span>{knownCount} / 6</span></div>
          <div className="trig-target-known-grid">
            {(Object.keys(known) as KnownValue[]).map((key) => (
              <Toggle key={key} checked={known[key]} onChange={(next) => setKnown((current) => ({ ...current, [key]: next }))}>{key}</Toggle>
            ))}
          </div>
          <button type="button" className="msk-primary trig-target-solve" onClick={() => setPoints(placeTriangle(a, b, angleC))}>✦ Solve</button>
          <button type="button" className="msk-soft" onClick={() => setPoints(placeTriangle(7.8, 10.5, 69.7))}>↻ Reset All</button>
        </Panel>

        <section className="msk-panel msk-canvas trig-target-canvas trig-target-oblique-canvas ob-target-canvas" data-trig-target-mode={mode} data-ob-mode={mode}>
          <div className="trig-target-canvas-bar">
            <Toggle checked={showCircle} onChange={setShowCircle}>Show circumcircle</Toggle>
            <Toggle checked={showAltitudes} onChange={setShowAltitudes}>Show altitudes</Toggle>
            {mode === "SSA Ambiguous Case" ? <Toggle checked={showSecond} onChange={setShowSecond}>Show second triangle</Toggle> : null}
            <span className="trig-target-measure">⌁ Measure</span>
          </div>
          <svg
            className="msk-graph is-interactive trig-target-triangle ob-target-triangle"
            viewBox="0 0 420 420"
            role="img"
            aria-label={`${mode} draggable oblique triangle`}
            onPointerMove={moveVertex}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
          >
            <defs>
              <pattern id="ob-target-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8eef6" strokeWidth="1" />
              </pattern>
              <radialGradient id="trig-oblique-fill">
                <stop offset="0" stopColor="#fff" stopOpacity=".92" />
                <stop offset="1" stopColor="#dbeafe" stopOpacity=".45" />
              </radialGradient>
            </defs>
            <rect width="420" height="420" fill={COLORS.paper} />
            <rect width="420" height="420" fill="url(#ob-target-grid)" />
            {showCircle && circle && circle.radius < 520 ? (
              <circle className="trig-target-circumcircle" cx={circle.center.x} cy={circle.center.y} r={circle.radius} fill="none" stroke="#93c5fd" strokeDasharray="7 6" />
            ) : null}
            {circle ? (
              <>
                <line x1={circle.center.x} y1={circle.center.y} x2={A.x} y2={A.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                <line x1={circle.center.x} y1={circle.center.y} x2={B.x} y2={B.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                <line x1={circle.center.x} y1={circle.center.y} x2={C.x} y2={C.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                <circle cx={circle.center.x} cy={circle.center.y} r="3" fill="#64748b" />
              </>
            ) : null}
            {(showAltitudes || mode === "Area") ? (
              <g className="trig-target-altitudes" stroke="#64748b" strokeDasharray="5 4">
                <line x1={A.x} y1={A.y} x2={altitudeA.x} y2={altitudeA.y} />
                <line x1={B.x} y1={B.y} x2={altitudeB.x} y2={altitudeB.y} />
                <line x1={C.x} y1={C.y} x2={altitudeC.x} y2={altitudeC.y} />
              </g>
            ) : null}
            {second ? (
              <polygon points={`${second.A.x},${second.A.y} ${second.B.x},${second.B.y} ${second.C.x},${second.C.y}`} fill="rgba(249,115,22,.10)" stroke="#f97316" strokeDasharray="7 5" strokeWidth="2" />
            ) : null}
            <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={mode === "Area" ? "rgba(139,92,246,.16)" : "url(#trig-oblique-fill)"} stroke="none" />
            <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={COLORS.a} strokeWidth="2.6" />
            <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke={COLORS.b} strokeWidth="2.6" />
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={COLORS.c} strokeWidth="2.6" />
            <path className="trig-target-angle-arc" d={angleArc(A, B, C, 34)} fill="none" stroke={COLORS.c} strokeWidth="2" />
            <path className="trig-target-angle-arc" d={angleArc(B, C, A, 34)} fill="none" stroke={COLORS.a} strokeWidth="2" />
            <path className="trig-target-angle-arc" d={angleArc(C, A, B, 34)} fill="none" stroke={COLORS.b} strokeWidth="2" />
            <text x={(B.x + C.x) / 2} y={(B.y + C.y) / 2 + 22} fill={COLORS.a} fontSize="13" textAnchor="middle">a = {fmt(a, 2)}</text>
            <text x={(C.x + A.x) / 2 + 16} y={(C.y + A.y) / 2} fill={COLORS.b} fontSize="13">b = {fmt(b, 2)}</text>
            <text x={(A.x + B.x) / 2 - 16} y={(A.y + B.y) / 2} fill={COLORS.c} fontSize="13" textAnchor="end">c = {fmt(c, 2)}</text>
            <text x={A.x} y={A.y + 48} fill={COLORS.c} fontSize="13" textAnchor="middle">{fmt(angleA, 1)}°</text>
            <text x={B.x + 42} y={B.y - 16} fill={COLORS.a} fontSize="13">{fmt(angleB, 1)}°</text>
            <text x={C.x - 42} y={C.y - 16} fill={COLORS.b} fontSize="13" textAnchor="end">{fmt(angleC, 1)}°</text>
            {(["A", "B", "C"] as Vertex[]).map((vertex) => {
              const point = points[vertex];
              const color = vertex === "A" ? COLORS.c : vertex === "B" ? COLORS.a : COLORS.b;
              return (
                <g key={vertex} className="trig-target-vertex" onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); setDragging(vertex); }}>
                  <circle cx={point.x} cy={point.y} r="16" fill="transparent" />
                  <circle cx={point.x} cy={point.y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
                  <text x={point.x + (vertex === "B" ? -14 : 0)} y={point.y + (vertex === "A" ? -12 : 20)} fill={color} fontWeight="700" fontSize="14" textAnchor="middle">{vertex}</text>
                </g>
              );
            })}
          </svg>
          <p className="msk-note trig-target-canvas-hint">Drag vertices (A, B, C) to explore. All values update in real time.</p>
          {mode === "SSA Ambiguous Case" ? (
            <div className="ob-target-ssa" aria-label="SSA ambiguous case explorer">
              <article data-state={ssa.count === 0 ? "on" : "off"}>
                <b>No triangle</b>
                <small>a &lt; h = {fmt(ssa.height, 2)}</small>
              </article>
              <article data-state={ssa.count === 1 ? "on" : "off"}>
                <b>One triangle</b>
                <small>a = h or a ≥ b</small>
              </article>
              <article data-state={ssa.count === 2 ? "on" : "off"}>
                <b>Two triangles</b>
                <small>{ssa.acute ? `B = ${fmt(ssa.acute.B, 1)}°` : "—"}{ssa.obtuse ? ` or ${fmt(ssa.obtuse.B, 1)}°` : ""}</small>
              </article>
            </div>
          ) : null}
          {mode === "Cosine Law" ? (
            <div className="ob-target-squares" aria-label="Cosine-rule square decomposition">
              <span>a² = {fmt(a * a, 2)}</span>
              <span>b² = {fmt(b * b, 2)}</span>
              <span>c² = {fmt(c * c, 2)}</span>
              <span>2ab cos C = {fmt(2 * a * b * Math.cos(angleC * DEG), 2)}</span>
            </div>
          ) : null}
        </section>

        <aside className="msk-panel msk-live trig-target-card trig-target-law-panel ob-target-rail">
          <h2>{mode === "Area" ? "Area formulas" : "Selected Law"}</h2>
          <span className="trig-target-law-badge">{mode === "Area" ? "AREA" : mode.toUpperCase()}</span>
          <p className="msk-formula">{mode === "Cosine Law" ? "c² = a² + b² − 2ab cos C" : mode === "Area" ? "K = ½ab sin C" : "a / sin A = b / sin B = c / sin C"}</p>
          <h2>Live substitution</h2>
          {mode === "Cosine Law" ? (
            <>
              <LiveRow color={COLORS.c} label="a² + b² − 2ab cos C" value={fmt(c * c, 3)} />
              <LiveRow color={COLORS.c} label="Side c" value={fmt(c, 3)} />
            </>
          ) : mode === "Area" ? (
            <>
              <LiveRow color="#10b981" label={`½(${fmt(a, 2)})(${fmt(b, 2)}) sin ${fmt(angleC, 1)}°`} value={fmt(area, 3)} />
              <LiveRow color="#0ea5e9" label="Heron √s(s−a)(s−b)(s−c)" value={fmt(heronArea, 3)} />
              <LiveRow color="#8b5cf6" label="Semiperimeter s" value={fmt(semiperimeter, 3)} />
              <div className="trig-target-area-pill">△ {fmt(area, 2)} square units</div>
            </>
          ) : mode === "SSA Ambiguous Case" ? (
            <>
              <LiveRow color="#8b5cf6" label="Altitude h = b sin A" value={fmt(ssa.height, 3)} />
              <LiveRow color="#f59e0b" label="Possible solutions" value={String(ssa.count)} />
              {ssa.acute ? <LiveRow color="#06b6d4" label="Acute ∠B" value={`${fmt(ssa.acute.B, 1)}°`} /> : null}
              {ssa.obtuse ? <LiveRow color="#f97316" label="Obtuse ∠B" value={`${fmt(ssa.obtuse.B, 1)}°`} /> : null}
            </>
          ) : (
            <>
              <LiveRow color={COLORS.a} label="a / sin A" value={fmt(sineRatio, 3)} />
              <LiveRow color={COLORS.b} label="b / sin B" value={fmt(b / Math.sin(angleB * DEG), 3)} />
              <LiveRow color={COLORS.c} label="c / sin C" value={fmt(c / Math.sin(angleC * DEG), 3)} />
            </>
          )}
          <h2>Triangle validity checks</h2>
          <StatusOk>{valid ? "✓ Angle sum 180° · triangle inequality valid" : "Move a vertex to form a non-degenerate triangle."}</StatusOk>
          {mode === "Solve Triangle" ? <LiveRow color="#10b981" label="Solution" value={`a ${fmt(a, 2)}, b ${fmt(b, 2)}, c ${fmt(c, 2)}`} /> : null}
          <LiveRow color="#10b981" label="Area" value={`${fmt(area, 2)} square units`} />
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
      <div className="trig-target-footer ob-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default ObliqueTriangleLab;
