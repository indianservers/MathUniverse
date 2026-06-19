import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeHighlight: string | null;
  onValueChange: (id: string, value: number) => void;
};

type Point = { x: number; y: number };

const colors = {
  curve: "#38bdf8",
  focus: "#f97316",
  guide: "#facc15",
  directrix: "#fb7185",
  axis: "#94a3b8",
  fill: "#0f172a",
  net: "#a78bfa",
  success: "#22c55e",
};

export function CircleLocusVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const center = p(values.h, values.k);
  const r = values.r;
  const theta = values.theta;
  const point = p(center.x + r * Math.cos(theta), center.y + r * Math.sin(theta));
  const left = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
  return (
    <Frame label="Circle as equal distance from center">
      <Grid />
      <circle cx={sx(center.x)} cy={sy(center.y)} r={r * scale} fill="#075985" opacity="0.18" stroke={colors.curve} strokeWidth="5" />
      <line x1={sx(center.x)} y1={sy(center.y)} x2={sx(point.x)} y2={sy(point.y)} stroke={highlight(activeHighlight, ["radius", "r-squared"]) ? colors.guide : colors.focus} strokeWidth="5" />
      <GuideTriangle a={center} b={point} active={activeHighlight} />
      <PointMark point={center} label="C(h,k)" color={colors.focus} active={activeHighlight === "center"} />
      <PointMark point={point} label="P(x,y)" color={colors.curve} />
      <DraggableHandle label="Drag center" position={sp(center)} bounds={bounds()} onChange={(next) => { const q = unsp(next); onValueChange("h", q.x); onValueChange("k", q.y); }} />
      <DraggableHandle label="Drag point on circle" position={sp(point)} bounds={bounds()} onChange={(next) => { const q = unsp(next); onValueChange("theta", Math.atan2(q.y - center.y, q.x - center.x)); onValueChange("r", Math.max(1, Math.min(5, dist(center, q)))); }} />
      {toggles.labels ? <Info lines={[`center = (${fmt(center.x)}, ${fmt(center.y)})`, `r = ${fmt(r)}`, `P = (${fmt(point.x)}, ${fmt(point.y)})`, `distance CP = ${fmt(dist(center, point))}`, `left side = ${fmt(left)}`, `r^2 = ${fmt(r ** 2)}`]} /> : null}
    </Frame>
  );
}

export function ParabolaFocusDirectrixVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const par = parabola(values.p, values.t);
  const focus = p(0, values.p);
  const directrixY = -values.p;
  return (
    <Frame label="Parabola as focus-directrix locus">
      <Grid />
      <Curve points={range(-5, 5, 0.25).map((x) => p(x, (x * x) / (4 * values.p)))} active={activeHighlight === "x-squared-4py"} />
      <line x1={sx(-6)} y1={sy(directrixY)} x2={sx(6)} y2={sy(directrixY)} stroke={highlight(activeHighlight, ["directrix", "distance-directrix"]) ? colors.directrix : "#fda4af"} strokeWidth="4" strokeDasharray="8 7" />
      <line x1={sx(par.x)} y1={sy(par.y)} x2={sx(focus.x)} y2={sy(focus.y)} stroke={activeHighlight === "pf" ? colors.guide : colors.focus} strokeWidth="4" />
      <line x1={sx(par.x)} y1={sy(par.y)} x2={sx(par.x)} y2={sy(directrixY)} stroke={activeHighlight === "distance-directrix" ? colors.guide : colors.net} strokeWidth="4" />
      <PointMark point={focus} label="F" color={colors.focus} active={activeHighlight === "focus"} />
      <PointMark point={par} label="P" color={colors.curve} />
      <DraggableHandle label="Drag focus parameter p" position={sp(focus)} bounds={{ x: [origin.x, origin.x], y: [origin.y - 170, origin.y - 40] }} onChange={(next) => onValueChange("p", Math.max(0.8, Math.min(4.5, unsp(next).y)))} />
      <DraggableHandle label="Drag point P" position={sp(par)} bounds={bounds()} onChange={(next) => onValueChange("t", Math.max(-5, Math.min(5, unsp(next).x)))} />
      {toggles.labels ? <Info lines={[`p = ${fmt(values.p)}`, `focus = (0, ${fmt(values.p)})`, `directrix y = ${fmt(directrixY)}`, `P = (${fmt(par.x)}, ${fmt(par.y)})`, `PF = ${fmt(dist(par, focus))}`, `distance to directrix = ${fmt(Math.abs(par.y - directrixY))}`, `error = ${fmt(Math.abs(dist(par, focus) - Math.abs(par.y - directrixY)))}`]} /> : null}
    </Frame>
  );
}

export function EllipseDistanceSumVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = Math.max(values.a, values.b + 0.5);
  const b = values.b;
  const c = Math.sqrt(Math.max(0, a * a - b * b));
  const point = p(a * Math.cos(values.theta), b * Math.sin(values.theta));
  const f1 = p(-c, 0);
  const f2 = p(c, 0);
  return (
    <Frame label="Ellipse as constant sum of distances">
      <Grid />
      <Curve points={range(0, Math.PI * 2, 0.08).map((t) => p(a * Math.cos(t), b * Math.sin(t)))} />
      <AxisLine a={p(-a, 0)} b={p(a, 0)} label={`2a=${fmt(2 * a)}`} active={activeHighlight === "a"} />
      <AxisLine a={p(0, -b)} b={p(0, b)} label={`2b=${fmt(2 * b)}`} active={activeHighlight === "b"} />
      <DistanceLine a={point} b={f1} active={highlight(activeHighlight, ["f1", "pf1-pf2", "constant"])} />
      <DistanceLine a={point} b={f2} active={highlight(activeHighlight, ["f2", "pf1-pf2", "constant"])} />
      <PointMark point={f1} label="F1" color={colors.focus} />
      <PointMark point={f2} label="F2" color={colors.focus} />
      <PointMark point={point} label="P" color={colors.curve} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `c = ${fmt(c)}`, `F1,F2 = (+/-${fmt(c)},0)`, `PF1 = ${fmt(dist(point, f1))}`, `PF2 = ${fmt(dist(point, f2))}`, `sum = ${fmt(dist(point, f1) + dist(point, f2))}`, `2a = ${fmt(2 * a)}`]} /> : null}
    </Frame>
  );
}

export function HyperbolaDifferenceVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const b = values.b;
  const c = Math.sqrt(a * a + b * b);
  const x = a * Math.cosh(values.t);
  const y = b * Math.sinh(values.t);
  const point = p(x, y);
  const f1 = p(-c, 0);
  const f2 = p(c, 0);
  const right = range(0, 1.55, 0.08).map((t) => p(a * Math.cosh(t), b * Math.sinh(t)));
  const rightLow = right.map((q) => p(q.x, -q.y)).reverse();
  return (
    <Frame label="Hyperbola as constant difference of distances">
      <Grid />
      <Curve points={right} />
      <Curve points={rightLow} />
      <Curve points={right.map((q) => p(-q.x, q.y))} />
      <Curve points={rightLow.map((q) => p(-q.x, q.y))} />
      <line x1={sx(-6)} y1={sy((-b / a) * 6)} x2={sx(6)} y2={sy((b / a) * 6)} stroke={highlight(activeHighlight, ["asymptotes"]) ? colors.guide : "#64748b"} strokeWidth="3" strokeDasharray="8 8" />
      <line x1={sx(-6)} y1={sy((b / a) * 6)} x2={sx(6)} y2={sy((-b / a) * 6)} stroke={highlight(activeHighlight, ["asymptotes"]) ? colors.guide : "#64748b"} strokeWidth="3" strokeDasharray="8 8" />
      <DistanceLine a={point} b={f1} active={highlight(activeHighlight, ["f1", "pf1-minus-pf2"])} />
      <DistanceLine a={point} b={f2} active={highlight(activeHighlight, ["f2", "pf1-minus-pf2", "constant"])} />
      <PointMark point={f1} label="F1" color={colors.focus} />
      <PointMark point={f2} label="F2" color={colors.focus} />
      <PointMark point={point} label="P" color={colors.curve} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `c = ${fmt(c)}`, `PF1 = ${fmt(dist(point, f1))}`, `PF2 = ${fmt(dist(point, f2))}`, `|difference| = ${fmt(Math.abs(dist(point, f1) - dist(point, f2)))}`, `2a = ${fmt(2 * a)}`, `asymptote slopes = +/-${fmt(b / a)}`]} /> : null}
    </Frame>
  );
}

export function EccentricityClassifierVisual({ values, toggles, activeHighlight }: VisualState) {
  const e = values.e;
  const type = classifyE(e);
  return (
    <Frame label="Eccentricity classifies conics">
      <Grid />
      <ClassifierShape e={e} active={activeHighlight} />
      <line x1="140" y1="430" x2="610" y2="430" stroke="#e2e8f0" strokeWidth="5" />
      <circle cx={140 + Math.min(e, 1.8) * 260} cy="430" r="12" fill={colors.guide} />
      <Text x={132} y={462} text="0" />
      <Text x={390} y={462} text="1" />
      <Text x={595} y={462} text=">1" />
      <Text x={125} y={112} text={type} />
      {toggles.labels ? <Info lines={[`e = ${fmt(e)}`, `conic type = ${type}`, `ratio = distance to focus / distance to directrix`, `classification = ${type}`, e < 1 ? "0 < e < 1 gives ellipse; e=0 is circle" : e === 1 ? "e = 1 gives parabola" : "e > 1 gives hyperbola"]} /> : null}
    </Frame>
  );
}

export function ConeSlicingVisual({ values, toggles, activeHighlight }: VisualState) {
  const angle = values.sliceAngle;
  const type = sliceType(angle);
  return (
    <Frame label="Conic sections from slicing a double cone">
      <path d="M 270 95 L 120 290 L 420 290 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="4" />
      <path d="M 270 485 L 120 290 L 420 290 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="4" />
      <ellipse cx="270" cy="290" rx="150" ry="28" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="8 7" />
      <g transform={`rotate(${-angle} 270 290)`}>
        <rect x="90" y={260 - values.slicePosition * 18} width="360" height="34" fill={highlight(activeHighlight, ["slicing-angle", type.toLowerCase().replace(/ /g, "-")]) ? colors.guide : colors.net} opacity="0.65" stroke="#fde68a" />
      </g>
      <ResultBadge type={type} active={activeHighlight} />
      {toggles.labels ? <Info lines={[`slice angle = ${fmt(angle)} deg`, `slice position = ${fmt(values.slicePosition)}`, `cone angle = 38 deg`, `resulting conic = ${type}`, `condition = ${sliceNote(angle)}`]} /> : null}
    </Frame>
  );
}

export function ParabolaReflectionVisual({ values, toggles, activeHighlight }: VisualState) {
  const point = parabola(values.p, values.t);
  const focus = p(0, values.p);
  const slope = point.x / (2 * values.p);
  const tangentYAtLeft = point.y + slope * (-5 - point.x);
  const tangentYAtRight = point.y + slope * (5 - point.x);
  return (
    <Frame label="Parabola reflective property">
      <Grid />
      <Curve points={range(-5, 5, 0.25).map((x) => p(x, (x * x) / (4 * values.p)))} />
      <line x1={sx(point.x)} y1={sy(5)} x2={sx(point.x)} y2={sy(point.y)} stroke={activeHighlight === "parallel-ray" ? colors.guide : colors.net} strokeWidth="4" />
      <line x1={sx(point.x)} y1={sy(point.y)} x2={sx(focus.x)} y2={sy(focus.y)} stroke={activeHighlight === "focus" ? colors.guide : colors.focus} strokeWidth="4" />
      <line x1={sx(-5)} y1={sy(tangentYAtLeft)} x2={sx(5)} y2={sy(tangentYAtRight)} stroke={activeHighlight === "tangent" ? colors.guide : "#fda4af"} strokeWidth="4" />
      <PointMark point={focus} label="F" color={colors.focus} active={activeHighlight === "focus"} />
      <PointMark point={point} label="P" color={colors.curve} />
      {highlight(activeHighlight, ["equal-angles"]) ? <circle cx={sx(point.x)} cy={sy(point.y)} r="32" fill="none" stroke={colors.guide} strokeWidth="3" strokeDasharray="6 6" /> : null}
      {toggles.labels ? <Info lines={[`p = ${fmt(values.p)}`, `P = (${fmt(point.x)}, ${fmt(point.y)})`, `tangent slope = ${fmt(slope)}`, `incoming angle = parallel to axis`, `reflected ray = through focus`, `focus check = passes through F`]} /> : null}
    </Frame>
  );
}

export function DirectrixFocusEquationsVisual({ values, toggles, activeHighlight }: VisualState) {
  const mode = Math.round(values.conicType);
  const title = mode === 0 ? "parabola" : mode === 1 ? "ellipse" : "hyperbola";
  const equation = mode === 0 ? "x^2 = 4py" : mode === 1 ? "x^2/a^2 + y^2/b^2 = 1" : "x^2/a^2 - y^2/b^2 = 1";
  return (
    <Frame label="Focus, directrix, and standard equations">
      <Grid />
      {mode === 0 ? <Curve points={range(-5, 5, 0.25).map((x) => p(x, (x * x) / (4 * values.p)))} active={activeHighlight === "four-p"} /> : null}
      {mode === 1 ? <Curve points={range(0, Math.PI * 2, 0.08).map((t) => p(values.a * Math.cos(t), values.b * Math.sin(t)))} active={activeHighlight === "plus-sign"} /> : null}
      {mode === 2 ? <HyperbolaMini a={values.a} b={values.b} active={activeHighlight} /> : null}
      <EquationPanel title={title} equation={equation} active={activeHighlight} />
      {toggles.labels ? <Info lines={[`selected conic = ${title}`, `p = ${fmt(values.p)}`, `a = ${fmt(values.a)}`, `b = ${fmt(values.b)}`, `standard equation = ${equation}`, mode === 1 ? "ellipse uses plus sign" : mode === 2 ? "hyperbola uses minus sign" : "4p encodes focus parameter"]} /> : null}
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <text x="58" y="70" className="fill-white text-xl font-black">{label}</text>
        {children}
      </svg>
    </div>
  );
}

function Grid() {
  return (
    <g>
      {range(-6, 6, 1).map((v) => <line key={`x${v}`} x1={sx(v)} y1={sy(-5)} x2={sx(v)} y2={sy(5)} stroke="#1e293b" />)}
      {range(-5, 5, 1).map((v) => <line key={`y${v}`} x1={sx(-6)} y1={sy(v)} x2={sx(6)} y2={sy(v)} stroke="#1e293b" />)}
      <line x1={sx(-6)} y1={sy(0)} x2={sx(6)} y2={sy(0)} stroke={colors.axis} strokeWidth="3" />
      <line x1={sx(0)} y1={sy(-5)} x2={sx(0)} y2={sy(5)} stroke={colors.axis} strokeWidth="3" />
    </g>
  );
}

function Curve({ points, active = false }: { points: Point[]; active?: boolean }) {
  return <polyline points={points.map((q) => `${sx(q.x)},${sy(q.y)}`).join(" ")} fill="none" stroke={active ? colors.guide : colors.curve} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
}

function PointMark({ point, label, color, active = false }: { point: Point; label: string; color: string; active?: boolean }) {
  return <g><circle cx={sx(point.x)} cy={sy(point.y)} r={active ? 11 : 8} fill={active ? colors.guide : color} /><Text x={sx(point.x) + 12} y={sy(point.y) - 10} text={label} /></g>;
}

function DistanceLine({ a, b, active }: { a: Point; b: Point; active: boolean }) {
  return <line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke={active ? colors.guide : colors.focus} strokeWidth="4" strokeDasharray={active ? undefined : "7 6"} />;
}

function AxisLine({ a, b, label, active }: { a: Point; b: Point; label: string; active: boolean }) {
  return <g><line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke={active ? colors.guide : colors.axis} strokeWidth="4" /><Text x={(sx(a.x) + sx(b.x)) / 2 + 10} y={(sy(a.y) + sy(b.y)) / 2 - 12} text={label} /></g>;
}

function GuideTriangle({ a, b, active }: { a: Point; b: Point; active: string | null }) {
  return <g><line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(a.y)} stroke={active === "x-minus-h" ? colors.guide : colors.net} strokeWidth="4" strokeDasharray="7 6" /><line x1={sx(b.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke={active === "y-minus-k" ? colors.guide : colors.net} strokeWidth="4" strokeDasharray="7 6" /></g>;
}

function ClassifierShape({ e, active }: { e: number; active: string | null }) {
  if (e <= 0.05) return <circle cx={sx(0)} cy={sy(0)} r="95" fill="#075985" opacity="0.2" stroke={highlight(active, ["e"]) ? colors.guide : colors.curve} strokeWidth="5" />;
  if (e < 1) return <ellipse cx={sx(0)} cy={sy(0)} rx={120 + e * 45} ry={95 - e * 25} fill="#075985" opacity="0.2" stroke={highlight(active, ["ellipse-range"]) ? colors.guide : colors.curve} strokeWidth="5" />;
  if (Math.abs(e - 1) < 0.05) return <Curve points={range(-5, 5, 0.25).map((x) => p(x, x * x / 8))} active={active === "parabola-equals-one"} />;
  return <HyperbolaMini a={2.1} b={1.1} active={active === "hyperbola-greater-one" ? "asymptotes" : null} />;
}

function HyperbolaMini({ a, b, active }: { a: number; b: number; active: string | null }) {
  const branch = range(0, 1.5, 0.08).map((t) => p(a * Math.cosh(t), b * Math.sinh(t)));
  return <g><Curve points={branch} active={active === "minus-sign"} /><Curve points={branch.map((q) => p(q.x, -q.y)).reverse()} /><Curve points={branch.map((q) => p(-q.x, q.y))} /><Curve points={branch.map((q) => p(-q.x, -q.y)).reverse()} /></g>;
}

function ResultBadge({ type, active }: { type: string; active: string | null }) {
  const key = type.toLowerCase().replace(/ /g, "-");
  return <g><rect x="510" y="170" width="230" height="120" rx="18" fill={active === key ? colors.guide : "#0f172a"} stroke="#e2e8f0" /><text x="535" y="238" className="fill-white text-3xl font-black">{type}</text></g>;
}

function EquationPanel({ title, equation, active }: { title: string; equation: string; active: string | null }) {
  return <g><rect x="455" y="145" width="330" height="170" rx="18" fill="#0f172a" stroke="#334155" /><Text x={480} y={185} text={`selected: ${title}`} /><Text x={480} y={230} text={equation} /><Text x={480} y={275} text={active === "plus-sign" ? "plus joins ellipse squared terms" : active === "minus-sign" ? "minus separates hyperbola terms" : active === "four-p" ? "4p carries focus distance" : "focus/directrix geometry -> equation"} /></g>;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="610" y="104" width="254" height={Math.max(95, lines.length * 24 + 34)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="627" y={135 + index * 23} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 300, y: 290 };
const scale = 34;
function sx(x: number) { return origin.x + x * scale; }
function sy(y: number) { return origin.y - y * scale; }
function sp(point: Point) { return { x: sx(point.x), y: sy(point.y) }; }
function unsp(point: { x: number; y: number }) { return p(Number(((point.x - origin.x) / scale).toFixed(2)), Number(((origin.y - point.y) / scale).toFixed(2))); }
function bounds(): { x: [number, number]; y: [number, number] } {
  return { x: [sx(-5.5), sx(5.5)], y: [sy(5), sy(-5)] };
}
function p(x: number, y: number): Point { return { x, y }; }
function parabola(focusP: number, t: number) { return p(t, (t * t) / (4 * focusP)); }
function dist(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
function range(start: number, end: number, step: number) {
  const values: number[] = [];
  for (let value = start; value <= end + 0.0001; value += step) values.push(Number(value.toFixed(3)));
  return values;
}
function highlight(active: string | null, ids: string[]) { return !!active && ids.includes(active); }
function classifyE(e: number) {
  if (e <= 0.05) return "circle";
  if (e < 1) return "ellipse";
  if (Math.abs(e - 1) < 0.05) return "parabola";
  return "hyperbola";
}
function sliceType(angle: number) {
  if (angle < 8) return "circle";
  if (angle < 35) return "ellipse";
  if (angle < 47) return "parabola";
  return "hyperbola";
}
function sliceNote(angle: number) {
  if (angle < 8) return "horizontal cut";
  if (angle < 35) return "tilted nonparallel cut";
  if (angle < 47) return "parallel to side";
  return "cuts both nappes";
}
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
