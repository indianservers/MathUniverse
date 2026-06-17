import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

type Point = { x: number; y: number };
type Triangle = { a: Point; b: Point; c: Point };

const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const radToDeg = (radians: number) => (radians * 180) / Math.PI;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const cosDeg = (degrees: number) => Math.cos(degToRad(degrees));
const normalize = (degrees: number) => ((degrees % 360) + 360) % 360;

export const phaseSixDoubleAngleTabs = ["sin(2theta)", "cos(2theta)", "alternate cosine forms"] as const;

export function closeWithin(left: number, right: number, tolerance = 0.005) {
  return Math.abs(left - right) <= tolerance;
}

export function CosineAngleAdditionVisual(props: VisualState) {
  return <TwoAngleUnitCircleModel {...props} mode="cos" />;
}

export function SineAngleAdditionVisual(props: VisualState) {
  return <TwoAngleUnitCircleModel {...props} mode="sin" />;
}

export function DoubleAngleIdentitiesVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const doubled = normalize(theta * 2);
  const center = { x: 255, y: 270 };
  const r = 125;
  const p = pointOnCircle(center, r, theta);
  const p2 = pointOnCircle(center, r, doubled);
  return (
    <Frame label="Double angle identities">
      <Axes center={center} r={r} />
      <circle cx={center.x} cy={center.y} r={r} fill="#0f172a" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke="#22d3ee" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={p2.x} y2={p2.y} stroke={strokeFor("sin2", activeHighlight, "#f97316")} strokeWidth={widthFor("sin2", activeHighlight)} onMouseEnter={() => onHighlight("sin2")} onMouseLeave={() => onHighlight(null)} />
      <line x1={p2.x} y1={center.y} x2={p2.x} y2={p2.y} stroke={strokeFor("sin2", activeHighlight, "#f97316")} strokeWidth={widthFor("sin2", activeHighlight)} />
      <line x1={center.x} y1={center.y} x2={p2.x} y2={center.y} stroke={strokeFor("cos2", activeHighlight, "#a855f7")} strokeWidth={widthFor("cos2", activeHighlight)} onMouseEnter={() => onHighlight("cos2")} onMouseLeave={() => onHighlight(null)} />
      <AngleArc center={center} r={48} theta={theta} label="theta" active={activeHighlight === "theta"} />
      <AngleArc center={center} r={68} theta={doubled} label="2theta" active={activeHighlight === "sin2" || activeHighlight === "cos2"} />
      <Tabs x={530} y={92} active={activeStep < 3 ? 0 : activeStep < 5 ? 1 : 2} />
      <FormulaBlock x={530} y={205} lines={[`theta = ${round(theta, 1)} deg`, `2theta = ${round(doubled, 1)} deg`, `sin(2theta) = ${round(sinDeg(doubled))}`, `2sin(theta)cos(theta) = ${round(2 * sinDeg(theta) * cosDeg(theta))}`, `cos(2theta) = ${round(cosDeg(doubled))}`, `cos^2 - sin^2 = ${round(cosDeg(theta) ** 2 - sinDeg(theta) ** 2)}`]} />
      {toggles.labels ? <text x="132" y="470" fill="#f8fafc" fontSize="15" fontWeight="900">Blue is theta; orange/purple is doubled angle.</text> : null}
      <AngleHandle center={center} radius={r} theta={theta} label="Drag theta" onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

export function SineRuleVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const tri = safeTriangle(values);
  const metrics = triangleMetrics(tri);
  const circum = circumcircle(tri);
  return (
    <Frame label="Law of sines triangle model">
      <TriangleShape tri={tri} activeHighlight={activeHighlight} onHighlight={onHighlight} />
      {circum ? (
        <>
          <circle cx={circum.center.x} cy={circum.center.y} r={circum.radius} fill="none" stroke={strokeFor("2R", activeHighlight, "#64748b")} strokeWidth={activeHighlight === "2R" ? "6" : "3"} strokeDasharray="10 8" onMouseEnter={() => onHighlight("2R")} onMouseLeave={() => onHighlight(null)} />
          <line x1={circum.center.x - circum.radius} y1={circum.center.y} x2={circum.center.x + circum.radius} y2={circum.center.y} stroke="#a855f7" strokeWidth="4" />
        </>
      ) : null}
      <AngleMarks tri={tri} activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <FormulaBlock x={560} y={105} lines={[`A = ${round(metrics.A, 1)} deg`, `B = ${round(metrics.B, 1)} deg`, `C = ${round(metrics.C, 1)} deg`, `a/sin A = ${round(metrics.a / sinDeg(metrics.A))}`, `b/sin B = ${round(metrics.b / sinDeg(metrics.B))}`, `c/sin C = ${round(metrics.c / sinDeg(metrics.C))}`, `2R = ${circum ? round(2 * circum.radius / 42) : "n/a"}`]} />
      {toggles.labels ? <TriangleLabels tri={tri} metrics={metrics} /> : null}
      <TriangleHandles tri={tri} onValueChange={onValueChange} />
    </Frame>
  );
}

export function CosineRuleVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  return <TwoSideTriangleModel values={values} toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={onValueChange} mode="cosine-rule" />;
}

export function TriangleAreaSineVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  return <TwoSideTriangleModel values={values} toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={onValueChange} mode="area" />;
}

export function ComplementaryAngleIdentitiesVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const theta = values.theta;
  const complement = 90 - theta;
  const base = 260;
  const hyp = 220;
  const ox = 150;
  const oy = 405;
  const ax = ox + base;
  const py = oy - hyp * sinDeg(theta);
  const px = ax;
  return (
    <Frame label="Complementary angle identities">
      <polygon points={`${ox},${oy} ${ax},${oy} ${px},${py}`} fill="#2563eb" opacity="0.34" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={ox} y1={oy} x2={ax} y2={oy} stroke={strokeFor("cos", activeHighlight, "#22d3ee")} strokeWidth={widthFor("cos", activeHighlight)} onMouseEnter={() => onHighlight("cos")} onMouseLeave={() => onHighlight(null)} />
      <line x1={ax} y1={oy} x2={px} y2={py} stroke={strokeFor("sin", activeHighlight, "#f97316")} strokeWidth={widthFor("sin", activeHighlight)} onMouseEnter={() => onHighlight("sin")} onMouseLeave={() => onHighlight(null)} />
      <line x1={ox} y1={oy} x2={px} y2={py} stroke="#a855f7" strokeWidth="5" />
      <AngleArc center={{ x: ox, y: oy }} r={58} theta={theta} label="theta" active={activeHighlight === "theta"} />
      <text x={px - 62} y={py + 45} fill="#fde68a" fontSize="15" fontWeight="900">{round(complement, 1)} deg</text>
      <FormulaBlock x={555} y={125} lines={[`theta = ${round(theta, 1)} deg`, `90 - theta = ${round(complement, 1)} deg`, `sin(90-theta) = ${round(sinDeg(complement))}`, `cos theta = ${round(cosDeg(theta))}`, `cos(90-theta) = ${round(cosDeg(complement))}`, `sin theta = ${round(sinDeg(theta))}`]} />
      {toggles.labels ? <text x="132" y="470" fill="#f8fafc" fontSize="15" fontWeight="900">Changing viewpoint swaps opposite and adjacent.</text> : null}
      <AngleHandle center={{ x: ox, y: oy }} radius={hyp} theta={theta} label="Drag theta" min={5} max={85} onTheta={(next) => onValueChange("theta", next)} />
    </Frame>
  );
}

function TwoAngleUnitCircleModel({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange, mode }: VisualState & { mode: "cos" | "sin" }) {
  const a = values.A;
  const b = values.B;
  const sum = normalize(a + b);
  const center = { x: 260, y: 270 };
  const r = 126;
  const pa = pointOnCircle(center, r, a);
  const ps = pointOnCircle(center, r, sum);
  const positive = mode === "cos" ? cosDeg(a) * cosDeg(b) : sinDeg(a) * cosDeg(b);
  const cross = mode === "cos" ? sinDeg(a) * sinDeg(b) : cosDeg(a) * sinDeg(b);
  const lhs = mode === "cos" ? cosDeg(sum) : sinDeg(sum);
  const rhs = mode === "cos" ? positive - cross : positive + cross;
  return (
    <Frame label={`${mode === "cos" ? "Cosine" : "Sine"} angle addition`}>
      <Axes center={center} r={r} />
      <circle cx={center.x} cy={center.y} r={r} fill="#0f172a" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={center.x} y1={center.y} x2={pa.x} y2={pa.y} stroke="#22d3ee" strokeWidth="5" />
      <line x1={center.x} y1={center.y} x2={ps.x} y2={ps.y} stroke={strokeFor(mode === "cos" ? "cos-sum" : "sin-sum", activeHighlight, "#f97316")} strokeWidth={widthFor(mode === "cos" ? "cos-sum" : "sin-sum", activeHighlight)} />
      <line x1={ps.x} y1={center.y} x2={ps.x} y2={ps.y} stroke={strokeFor("sin-sum", activeHighlight, "#f97316")} strokeWidth={widthFor("sin-sum", activeHighlight)} />
      <line x1={center.x} y1={center.y} x2={ps.x} y2={center.y} stroke={strokeFor("cos-sum", activeHighlight, "#a855f7")} strokeWidth={widthFor("cos-sum", activeHighlight)} />
      <ProjectionBars x={555} y={135} rows={mode === "cos" ? [["cos A cos B", positive, "#22d3ee"], ["sin A sin B", cross, "#f97316"], ["cos(A+B)", lhs, "#a855f7"]] : [["sin A cos B", positive, "#22d3ee"], ["cos A sin B", cross, "#f97316"], ["sin(A+B)", lhs, "#a855f7"]]} active={activeHighlight} onHighlight={onHighlight} />
      <FormulaBlock x={555} y={340} lines={[`A = ${round(a, 1)} deg, B = ${round(b, 1)} deg`, `A + B = ${round(sum, 1)} deg`, `LHS = ${round(lhs)}`, `RHS = ${round(rhs)}`, closeWithin(lhs, rhs) ? "invariant holds" : "rounding check"]} />
      <AngleArc center={center} r={48} theta={a} label="A" active={activeHighlight === "A"} />
      <AngleArc center={center} r={68} theta={sum} label="A+B" active={activeHighlight === "cos-sum" || activeHighlight === "sin-sum"} />
      {activeStep >= 1 ? <path d={arcPath(center, r + 24, a, sum)} fill="none" stroke="#fde68a" strokeWidth="4" strokeDasharray="8 7" /> : null}
      {toggles.labels ? <text x="112" y="470" fill="#f8fafc" fontSize="15" fontWeight="900">Drag A, then drag A+B to change B.</text> : null}
      <AngleHandle center={center} radius={r} theta={a} label="Drag A" onTheta={(next) => onValueChange("A", next)} />
      <AngleHandle center={center} radius={r + 24} theta={sum} label="Drag B via A+B" onTheta={(next) => onValueChange("B", normalize(next - a))} />
    </Frame>
  );
}

function TwoSideTriangleModel({ values, toggles, activeHighlight, onHighlight, onValueChange, mode }: Pick<VisualState, "values" | "toggles" | "activeHighlight" | "onHighlight" | "onValueChange"> & { mode: "cosine-rule" | "area" }) {
  const a = values.a;
  const b = values.b;
  const C = values.C;
  const scale = 36;
  const o = { x: 170, y: 405 };
  const pB = { x: o.x + b * scale, y: o.y };
  const pA = { x: o.x + a * scale * cosDeg(C), y: o.y - a * scale * sinDeg(C) };
  const c = Math.hypot(pA.x - pB.x, pA.y - pB.y) / scale;
  const height = a * sinDeg(C);
  const correction = 2 * a * b * cosDeg(C);
  const rhs = a * a + b * b - correction;
  return (
    <Frame label={mode === "area" ? "Triangle area using sine" : "Law of cosines"}>
      <polygon points={`${o.x},${o.y} ${pB.x},${pB.y} ${pA.x},${pA.y}`} fill="#2563eb" opacity="0.34" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={o.x} y1={o.y} x2={pA.x} y2={pA.y} stroke={strokeFor("a", activeHighlight, "#f97316")} strokeWidth={widthFor("a", activeHighlight)} onMouseEnter={() => onHighlight("a")} onMouseLeave={() => onHighlight(null)} />
      <line x1={o.x} y1={o.y} x2={pB.x} y2={pB.y} stroke={strokeFor("b", activeHighlight, "#22d3ee")} strokeWidth={widthFor("b", activeHighlight)} onMouseEnter={() => onHighlight("b")} onMouseLeave={() => onHighlight(null)} />
      <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke={strokeFor("c2", activeHighlight, "#a855f7")} strokeWidth={widthFor("c2", activeHighlight)} onMouseEnter={() => onHighlight("c2")} onMouseLeave={() => onHighlight(null)} />
      <line x1={pA.x} y1={pA.y} x2={pA.x} y2={o.y} stroke={strokeFor("sinC", activeHighlight, "#fde68a")} strokeWidth={widthFor("sinC", activeHighlight)} strokeDasharray="8 7" onMouseEnter={() => onHighlight("sinC")} onMouseLeave={() => onHighlight(null)} />
      <line x1={o.x} y1={o.y + 24} x2={pA.x} y2={o.y + 24} stroke={strokeFor("correction", activeHighlight, "#ef4444")} strokeWidth={widthFor("correction", activeHighlight)} onMouseEnter={() => onHighlight("correction")} onMouseLeave={() => onHighlight(null)} />
      <AngleArc center={o} r={58} theta={C} label="C" active={activeHighlight === "cosC" || activeHighlight === "sinC"} />
      <FormulaBlock x={555} y={120} lines={mode === "area" ? [`a = ${a}`, `b = ${b}`, `C = ${round(C, 1)} deg`, `height = a sin C = ${round(height)}`, `area = ${round(0.5 * a * b * sinDeg(C))}`] : [`a = ${a}, b = ${b}`, `C = ${round(C, 1)} deg`, `c = ${round(c)}`, `c^2 = ${round(c * c)}`, `a^2+b^2 = ${round(a * a + b * b)}`, `2ab cos C = ${round(correction)}`, `RHS = ${round(rhs)}`]} />
      {toggles.labels ? <text x="118" y="470" fill="#f8fafc" fontSize="15" fontWeight="900">{mode === "area" ? "Height is controlled by sin C." : "At C = 90 deg, the correction vanishes."}</text> : null}
      <AngleHandle center={o} radius={a * scale} theta={C} min={15} max={165} label="Drag C" onTheta={(next) => onValueChange("C", next)} />
      <DraggableHandle label="Drag side a" position={pA} axis="xy" bounds={{ x: [o.x - 7 * scale, o.x + 7 * scale], y: [o.y - 7 * scale, o.y - 1 * scale] }} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.max(2, Math.min(7, round(Math.hypot(point.x - o.x, point.y - o.y) / scale, 1))))} />
      <DraggableHandle label="Drag side b" position={pB} axis="x" bounds={{ x: [o.x + 2 * scale, o.x + 7 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.round((point.x - o.x) / scale))} />
    </Frame>
  );
}

function TriangleShape({ tri, activeHighlight, onHighlight }: { tri: Triangle; activeHighlight: string | null; onHighlight: (token: string | null) => void }) {
  return (
    <g>
      <polygon points={`${tri.a.x},${tri.a.y} ${tri.b.x},${tri.b.y} ${tri.c.x},${tri.c.y}`} fill="#2563eb" opacity="0.34" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={tri.b.x} y1={tri.b.y} x2={tri.c.x} y2={tri.c.y} stroke={strokeFor("a", activeHighlight, "#f97316")} strokeWidth={widthFor("a", activeHighlight)} onMouseEnter={() => onHighlight("a")} onMouseLeave={() => onHighlight(null)} />
      <line x1={tri.a.x} y1={tri.a.y} x2={tri.c.x} y2={tri.c.y} stroke={strokeFor("b", activeHighlight, "#22d3ee")} strokeWidth={widthFor("b", activeHighlight)} onMouseEnter={() => onHighlight("b")} onMouseLeave={() => onHighlight(null)} />
      <line x1={tri.a.x} y1={tri.a.y} x2={tri.b.x} y2={tri.b.y} stroke={strokeFor("c", activeHighlight, "#a855f7")} strokeWidth={widthFor("c", activeHighlight)} onMouseEnter={() => onHighlight("c")} onMouseLeave={() => onHighlight(null)} />
    </g>
  );
}

function TriangleHandles({ tri, onValueChange }: { tri: Triangle; onValueChange: (id: string, value: number) => void }) {
  const bounds = { x: [105, 490] as [number, number], y: [95, 430] as [number, number] };
  return (
    <>
      <DraggableHandle label="Drag A" position={tri.a} axis="xy" bounds={bounds} keyboardStep={8} onChange={(p) => { onValueChange("ax", p.x); onValueChange("ay", p.y); }} />
      <DraggableHandle label="Drag B" position={tri.b} axis="xy" bounds={bounds} keyboardStep={8} onChange={(p) => { onValueChange("bx", p.x); onValueChange("by", p.y); }} />
      <DraggableHandle label="Drag C" position={tri.c} axis="xy" bounds={bounds} keyboardStep={8} onChange={(p) => { onValueChange("cx", p.x); onValueChange("cy", p.y); }} />
    </>
  );
}

function TriangleLabels({ tri, metrics }: { tri: Triangle; metrics: ReturnType<typeof triangleMetrics> }) {
  return (
    <g fill="#f8fafc" fontSize="14" fontWeight="900">
      <text x={tri.a.x - 24} y={tri.a.y - 12}>A</text>
      <text x={tri.b.x + 16} y={tri.b.y + 18}>B</text>
      <text x={tri.c.x + 14} y={tri.c.y - 12}>C</text>
      <text x={(tri.b.x + tri.c.x) / 2 + 12} y={(tri.b.y + tri.c.y) / 2}>a={round(metrics.a, 1)}</text>
      <text x={(tri.a.x + tri.c.x) / 2 - 50} y={(tri.a.y + tri.c.y) / 2}>b={round(metrics.b, 1)}</text>
      <text x={(tri.a.x + tri.b.x) / 2 - 12} y={(tri.a.y + tri.b.y) / 2 + 28}>c={round(metrics.c, 1)}</text>
    </g>
  );
}

function AngleMarks({ tri, activeHighlight, onHighlight }: { tri: Triangle; activeHighlight: string | null; onHighlight: (token: string | null) => void }) {
  return (
    <g>
      <circle cx={tri.a.x} cy={tri.a.y} r={activeHighlight === "sinA" ? 32 : 24} fill="none" stroke="#fde68a" strokeWidth="4" onMouseEnter={() => onHighlight("sinA")} onMouseLeave={() => onHighlight(null)} />
      <circle cx={tri.b.x} cy={tri.b.y} r={activeHighlight === "sinB" ? 32 : 24} fill="none" stroke="#22d3ee" strokeWidth="4" onMouseEnter={() => onHighlight("sinB")} onMouseLeave={() => onHighlight(null)} />
      <circle cx={tri.c.x} cy={tri.c.y} r={activeHighlight === "sinC" ? 32 : 24} fill="none" stroke="#f97316" strokeWidth="4" onMouseEnter={() => onHighlight("sinC")} onMouseLeave={() => onHighlight(null)} />
    </g>
  );
}

function safeTriangle(values: PhaseTwoValues): Triangle {
  return {
    a: { x: values.ax, y: values.ay },
    b: { x: values.bx, y: values.by },
    c: { x: values.cx, y: values.cy },
  };
}

function triangleMetrics(tri: Triangle) {
  const a = distance(tri.b, tri.c) / 42;
  const b = distance(tri.a, tri.c) / 42;
  const c = distance(tri.a, tri.b) / 42;
  const A = angleAt(tri.b, tri.a, tri.c);
  const B = angleAt(tri.a, tri.b, tri.c);
  const C = Math.max(1, 180 - A - B);
  return { a, b, c, A, B, C };
}

function circumcircle(tri: Triangle) {
  const d = 2 * (tri.a.x * (tri.b.y - tri.c.y) + tri.b.x * (tri.c.y - tri.a.y) + tri.c.x * (tri.a.y - tri.b.y));
  if (Math.abs(d) < 1) return null;
  const ux = ((tri.a.x ** 2 + tri.a.y ** 2) * (tri.b.y - tri.c.y) + (tri.b.x ** 2 + tri.b.y ** 2) * (tri.c.y - tri.a.y) + (tri.c.x ** 2 + tri.c.y ** 2) * (tri.a.y - tri.b.y)) / d;
  const uy = ((tri.a.x ** 2 + tri.a.y ** 2) * (tri.c.x - tri.b.x) + (tri.b.x ** 2 + tri.b.y ** 2) * (tri.a.x - tri.c.x) + (tri.c.x ** 2 + tri.c.y ** 2) * (tri.b.x - tri.a.x)) / d;
  const center = { x: ux, y: uy };
  return { center, radius: distance(center, tri.a) };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleAt(p: Point, q: Point, r: Point) {
  const v1 = { x: p.x - q.x, y: p.y - q.y };
  const v2 = { x: r.x - q.x, y: r.y - q.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  return radToDeg(Math.acos(Math.max(-1, Math.min(1, dot / mag))));
}

function Axes({ center, r }: { center: Point; r: number }) {
  return <g><line x1={center.x - r - 28} y1={center.y} x2={center.x + r + 28} y2={center.y} stroke="#64748b" strokeWidth="3" /><line x1={center.x} y1={center.y + r + 28} x2={center.x} y2={center.y - r - 28} stroke="#64748b" strokeWidth="3" /></g>;
}

function ProjectionBars({ x, y, rows, active, onHighlight }: { x: number; y: number; rows: [string, number, string][]; active: string | null; onHighlight: (token: string | null) => void }) {
  return <g>{rows.map(([label, value, color], index) => <g key={label} onMouseEnter={() => onHighlight(label)} onMouseLeave={() => onHighlight(null)}><text x={x} y={y + index * 54} fill="#f8fafc" fontSize="14" fontWeight="900">{label}</text><rect x={x + 132} y={y + index * 54 - 16} width="130" height="20" rx="10" fill="#334155" /><rect x={x + 132} y={y + index * 54 - 16} width={Math.min(130, Math.abs(value) * 95)} height="20" rx="10" fill={active === label ? "#fde68a" : color} /><text x={x + 275} y={y + index * 54} fill="#cbd5e1" fontSize="13" fontWeight="800">{round(value)}</text></g>)}</g>;
}

function Tabs({ x, y, active }: { x: number; y: number; active: number }) {
  return <g>{phaseSixDoubleAngleTabs.map((tab, index) => <g key={tab}><rect x={x} y={y + index * 36} width="260" height="28" rx="14" fill={active === index ? "#7c3aed" : "#1e293b"} stroke={active === index ? "#ddd6fe" : "#334155"} /><text x={x + 16} y={y + index * 36 + 19} fill="#f8fafc" fontSize="13" fontWeight="900">{tab}</text></g>)}</g>;
}

function FormulaBlock({ x, y, lines }: { x: number; y: number; lines: (string | number)[] }) {
  return <g><rect x={x - 18} y={y - 30} width="310" height={Math.max(84, lines.length * 25 + 22)} rx="16" fill="#0f172a" opacity="0.93" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 25} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function AngleHandle({ center, radius, theta, label, min = 0, max = 360, onTheta }: { center: Point; radius: number; theta: number; label: string; min?: number; max?: number; onTheta: (theta: number) => void }) {
  const p = pointOnCircle(center, radius, theta);
  return <DraggableHandle label={label} position={p} axis="xy" bounds={{ x: [center.x - radius, center.x + radius], y: [center.y - radius, center.y + radius] }} keyboardStep={8} onChange={(next) => onTheta(Math.max(min, Math.min(max, round(angleFromPoint(center, next), 1))))} />;
}

function pointOnCircle(center: Point, radius: number, degrees: number): Point {
  return { x: center.x + radius * cosDeg(degrees), y: center.y - radius * sinDeg(degrees) };
}

function angleFromPoint(center: Point, point: Point) {
  return normalize(radToDeg(Math.atan2(center.y - point.y, point.x - center.x)));
}

function arcPath(center: Point, radius: number, start: number, end: number) {
  const a = pointOnCircle(center, radius, start);
  const b = pointOnCircle(center, radius, end);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${Math.abs(end - start) > 180 ? 1 : 0} 0 ${b.x} ${b.y}`;
}

function AngleArc({ center, r, theta, label, active }: { center: Point; r: number; theta: number; label: string; active: boolean }) {
  const p = pointOnCircle(center, r + 18, theta);
  return <g><path d={arcPath(center, r, 0, theta)} fill="none" stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth={active ? "7" : "4"} strokeLinecap="round" /><text x={p.x} y={p.y} fill="#fde68a" fontSize="13" fontWeight="900">{label}</text></g>;
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function strokeFor(token: string, active: string | null, fallback: string) {
  return active === token ? "#fde68a" : fallback;
}

function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "3";
}
