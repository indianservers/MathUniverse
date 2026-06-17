import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { formatNumber, taylorPolynomial } from "../../utils/calculusMath";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  revealed: boolean;
  challengeMode: boolean;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

type GraphSpec = { xMin: number; xMax: number; yMin: number; yMax: number; left: number; top: number; width: number; height: number };

const graph: GraphSpec = { xMin: -3.4, xMax: 4.2, yMin: -3, yMax: 6, left: 78, top: 58, width: 540, height: 380 };
const trigGraph: GraphSpec = { xMin: -Math.PI, xMax: Math.PI * 2, yMin: -1.6, yMax: 1.6, left: 265, top: 68, width: 350, height: 330 };
const colors = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#6366f1"];

export function MeanValueTheoremVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = Math.min(values.a, values.b - 0.4);
  const b = Math.max(values.b, a + 0.4);
  const c = clamp(values.c, a + 0.1, b - 0.1);
  const secant = (mvtFunction(b) - mvtFunction(a)) / (b - a);
  const tangent = mvtDerivative(c);
  return (
    <Frame label="Mean value theorem secant tangent match">
      <Curve fn={mvtFunction} spec={graph} token="c" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <LineBySlope x={a} y={mvtFunction(a)} slope={secant} spec={graph} token="secant-slope" activeHighlight={activeHighlight} />
      <LineBySlope x={c} y={mvtFunction(c)} slope={tangent} spec={graph} token="f-prime-c" activeHighlight={activeHighlight} dashed />
      <Point x={a} y={mvtFunction(a)} spec={graph} label="A" fill={colors[0]} active={activeHighlight === "f-b-minus-f-a" || activeHighlight === "b-minus-a"} />
      <Point x={b} y={mvtFunction(b)} spec={graph} label="B" fill={colors[1]} active={activeHighlight === "f-b-minus-f-a" || activeHighlight === "b-minus-a"} />
      <Point x={c} y={mvtFunction(c)} spec={graph} label="c" fill="#fde68a" active={activeHighlight === "c" || activeHighlight === "f-prime-c"} />
      <line x1={sx(a, graph)} y1={sy(mvtFunction(a), graph)} x2={sx(b, graph)} y2={sy(mvtFunction(a), graph)} stroke={activeHighlight === "b-minus-a" ? "#fde68a" : "#f8fafc"} strokeWidth="4" />
      <line x1={sx(b, graph)} y1={sy(mvtFunction(a), graph)} x2={sx(b, graph)} y2={sy(mvtFunction(b), graph)} stroke={activeHighlight === "f-b-minus-f-a" ? "#fde68a" : "#f8fafc"} strokeWidth="4" />
      {toggles.labels ? <Info x={640} y={150} lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `c = ${fmt(c)}`, `secant = ${fmt(secant)}`, `f'(c) = ${fmt(tangent)}`, `gap = ${fmt(Math.abs(secant - tangent))}`]} /> : null}
      <DraggableHandle label="Drag a" position={{ x: sx(a, graph), y: sy(mvtFunction(a), graph) }} bounds={{ x: [sx(-2.7, graph), sx(b - 0.4, graph)], y: [sy(5, graph), sy(-2, graph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, graph))} />
      <DraggableHandle label="Drag b" position={{ x: sx(b, graph), y: sy(mvtFunction(b), graph) }} bounds={{ x: [sx(a + 0.4, graph), sx(3.7, graph)], y: [sy(5, graph), sy(-2, graph)] }} onChange={(point) => onValueChange("b", xFrom(point.x, graph))} />
      <DraggableHandle label="Drag c" position={{ x: sx(c, graph), y: sy(mvtFunction(c), graph) }} bounds={{ x: [sx(a + 0.1, graph), sx(b - 0.1, graph)], y: [sy(5, graph), sy(-2, graph)] }} onChange={(point) => onValueChange("c", xFrom(point.x, graph))} />
    </Frame>
  );
}

export function FundamentalTheoremCalculusVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const x = Math.max(a + 0.1, values.x);
  const dx = values.dx;
  const area = integrate(ftcFunction, a, x, 160);
  const strip = ftcFunction(x) * dx;
  return (
    <Frame label="Fundamental theorem accumulated area">
      <SignedArea a={a} b={x} n={36} fn={ftcFunction} spec={graph} active={activeHighlight === "A-x" || activeHighlight === "integral-a-x"} />
      <Curve fn={ftcFunction} spec={graph} token="f-x" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <rect x={sx(x, graph)} y={sy(ftcFunction(x), graph)} width={Math.max(4, sx(x + dx, graph) - sx(x, graph))} height={sy(0, graph) - sy(ftcFunction(x), graph)} fill={activeHighlight === "A-prime-x" || activeHighlight === "f-x" ? "#fde68a" : "#f97316"} opacity="0.55" />
      <GuideX x={a} spec={graph} token="integral-a-x" activeHighlight={activeHighlight} label="a" />
      <Point x={x} y={ftcFunction(x)} spec={graph} label="x" fill="#fde68a" active={activeHighlight === "f-x" || activeHighlight === "A-prime-x"} />
      {toggles.labels ? <Info x={635} y={145} lines={[`a = ${fmt(a)}`, `x = ${fmt(x)}`, `f(x) = ${fmt(ftcFunction(x))}`, `A(x) = ${fmt(area)}`, `strip ~= ${fmt(strip)}`, `dA/dx ~= ${fmt(ftcFunction(x))}`]} /> : null}
      <DraggableHandle label="Drag moving endpoint x" position={{ x: sx(x, graph), y: sy(ftcFunction(x), graph) }} bounds={{ x: [sx(a + 0.1, graph), sx(4, graph)], y: [sy(5, graph), sy(-2, graph)] }} onChange={(point) => onValueChange("x", xFrom(point.x, graph))} />
    </Frame>
  );
}

export function IntegrationByPartsVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const u = values.u;
  const v = values.v;
  const du = values.du;
  const dv = values.dv;
  const scale = 52;
  const x = 120;
  const y = 405;
  const w = u * scale;
  const h = v * scale;
  const duw = du * scale;
  const dvh = dv * scale;
  return (
    <Frame label="Integration by parts product rule strips">
      <Region x={x} y={y - h} w={w} h={h} token="uv" activeHighlight={activeHighlight} onHighlight={onHighlight} fill={colors[0]} />
      <Region x={x} y={y - h - dvh} w={w} h={dvh} token="u-dv" activeHighlight={activeHighlight} onHighlight={onHighlight} fill={colors[2]} />
      <Region x={x + w} y={y - h} w={duw} h={h} token="v-du" activeHighlight={activeHighlight} onHighlight={onHighlight} fill={colors[1]} />
      <rect x={x + w} y={y - h - dvh} width={duw} height={dvh} rx="8" fill="#64748b" opacity="0.45" />
      <Text x={380} y={94} text="d(uv) = u dv + v du" />
      <Text x={390} y={500} text="integral u dv = uv - integral v du" small />
      {toggles.labels ? <Info x={620} y={170} lines={[`uv = ${fmt(u * v)}`, `u dv = ${fmt(u * dv)}`, `v du = ${fmt(v * du)}`, `d(uv) ~= ${fmt(u * dv + v * du)}`, "rearrange product rule"]} /> : null}
      <DraggableHandle label="Drag u" position={{ x: x + w, y }} axis="x" bounds={{ x: [x + 80, x + 320] }} onChange={(point) => onValueChange("u", (point.x - x) / scale)} />
      <DraggableHandle label="Drag v" position={{ x, y: y - h }} axis="y" bounds={{ y: [y - 300, y - 70] }} onChange={(point) => onValueChange("v", (y - point.y) / scale)} />
      <DraggableHandle label="Drag du" position={{ x: x + w + duw, y: y - h / 2 }} axis="x" bounds={{ x: [x + w + 10, x + w + 120] }} onChange={(point) => onValueChange("du", (point.x - x - w) / scale)} />
      <DraggableHandle label="Drag dv" position={{ x: x + w / 2, y: y - h - dvh }} axis="y" bounds={{ y: [y - h - 120, y - h - 10] }} onChange={(point) => onValueChange("dv", (y - h - point.y) / scale)} />
    </Frame>
  );
}

export function DerivativeOfSineVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const x = values.x;
  const r = 86;
  const cx = 145;
  const cy = 230;
  const px = cx + r * Math.cos(x);
  const py = cy - r * Math.sin(x);
  const slope = Math.cos(x);
  return (
    <Frame label="Derivative of sine from unit circle and graph">
      <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#fde68a" strokeWidth="4" />
      <line x1={px} y1={py} x2={px} y2={cy} stroke={activeHighlight === "sin-x" ? "#fde68a" : "#38bdf8"} strokeWidth="4" />
      <line x1={cx} y1={cy} x2={px} y2={cy} stroke={activeHighlight === "cos-x" ? "#fde68a" : "#22c55e"} strokeWidth="4" />
      <circle cx={px} cy={py} r="9" fill="#fde68a" />
      <Axis spec={trigGraph} />
      <Curve fn={Math.sin} spec={trigGraph} token="sin-x" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <LineBySlope x={x} y={Math.sin(x)} slope={slope} spec={trigGraph} token="d-dx" activeHighlight={activeHighlight} />
      <Point x={x} y={Math.sin(x)} spec={trigGraph} label="x" fill="#fde68a" active={activeHighlight === "cos-x" || activeHighlight === "d-dx"} />
      {toggles.labels ? <Info x={640} y={150} lines={[`x rad = ${fmt(x)}`, `sin x = ${fmt(Math.sin(x))}`, `cos x = ${fmt(Math.cos(x))}`, `slope = ${fmt(slope)}`, `error = ${fmt(Math.abs(slope - Math.cos(x)))}`]} /> : null}
      <DraggableHandle label="Drag angle x" position={{ x: px, y: py }} bounds={{ x: [cx - r, cx + r], y: [cy - r, cy + r] }} onChange={(point) => onValueChange("x", Math.atan2(cy - point.y, point.x - cx))} />
    </Frame>
  );
}

export function DerivativeOfExponentialVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const y = expCurve(a);
  return (
    <Frame label="Derivative of exponential height slope match">
      <Curve fn={expCurve} spec={graph} token="exp-x" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <LineBySlope x={a} y={y} slope={y} spec={graph} token="derivative-exp-x" activeHighlight={activeHighlight} dashed />
      <line x1={sx(a, graph)} y1={sy(0, graph)} x2={sx(a, graph)} y2={sy(y, graph)} stroke={activeHighlight === "exp-x" || activeHighlight === "height-equals-slope" ? "#fde68a" : "#22c55e"} strokeWidth="5" />
      <Point x={a} y={y} spec={graph} label="a" fill="#fde68a" active={activeHighlight === "height-equals-slope"} />
      {toggles.labels ? <Info x={640} y={150} lines={[`a = ${fmt(a)}`, `e^a = ${fmt(y)}`, `tangent slope = ${fmt(y)}`, `slope - value = 0`, "variable is exponent"]} /> : null}
      <DraggableHandle label="Drag exponent a" position={{ x: sx(a, graph), y: sy(y, graph) }} bounds={{ x: [sx(-2.4, graph), sx(1.7, graph)], y: [sy(5.5, graph), sy(0, graph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, graph))} />
    </Frame>
  );
}

export function TaylorSeriesApproximationVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const n = Math.round(values.n);
  const x = values.x;
  const approx = (input: number) => taylorSin(a, n, input);
  const trueValue = Math.sin(x);
  const approxValue = approx(x);
  return (
    <Frame label="Taylor series local approximation">
      <Curve fn={Math.sin} spec={trigGraph} token="f-a" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <Curve fn={approx} spec={trigGraph} token={n <= 1 ? "linear-term" : "higher-terms"} activeHighlight={activeHighlight} onHighlight={onHighlight} stroke="#f97316" />
      <GuideX x={a} spec={trigGraph} token="f-a" activeHighlight={activeHighlight} label="a" />
      <Point x={x} y={trueValue} spec={trigGraph} label="x" fill="#fde68a" active={activeHighlight === "degree-n" || activeHighlight === "higher-terms"} />
      {toggles.labels ? <Info x={640} y={150} lines={[`center a = ${fmt(a)}`, `degree n = ${n}`, `test x = ${fmt(x)}`, `true f(x) = ${fmt(trueValue)}`, `approx = ${fmt(approxValue)}`, `error = ${fmt(Math.abs(trueValue - approxValue))}`]} /> : null}
      <DraggableHandle label="Drag Taylor center a" position={{ x: sx(a, trigGraph), y: sy(Math.sin(a), trigGraph) }} bounds={{ x: [sx(-2.8, trigGraph), sx(2.8, trigGraph)], y: [sy(1.4, trigGraph), sy(-1.4, trigGraph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, trigGraph))} />
      <DraggableHandle label="Drag test x" position={{ x: sx(x, trigGraph), y: sy(trueValue, trigGraph) }} bounds={{ x: [sx(-3, trigGraph), sx(4.5, trigGraph)], y: [sy(1.4, trigGraph), sy(-1.4, trigGraph)] }} onChange={(point) => onValueChange("x", xFrom(point.x, trigGraph))} />
    </Frame>
  );
}

export function OptimizationDerivativeVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const x = values.x;
  const y = optFunction(x);
  const slope = optDerivative(x);
  const classification = classifyPoint(x);
  return (
    <Frame label="Optimization derivative sign and critical points">
      <Curve fn={optFunction} spec={graph} token="max" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <LineBySlope x={x} y={y} slope={slope} spec={graph} token="f-prime-zero" activeHighlight={activeHighlight} dashed />
      <DerivativeSignStrip activeHighlight={activeHighlight} />
      <Point x={-1} y={optFunction(-1)} spec={graph} label="max" fill="#f97316" active={activeHighlight === "max" || Math.abs(x + 1) < 0.15} />
      <Point x={1} y={optFunction(1)} spec={graph} label="min" fill="#22c55e" active={activeHighlight === "min" || Math.abs(x - 1) < 0.15} />
      <Point x={x} y={y} spec={graph} label="x" fill="#fde68a" active={activeHighlight === "f-prime-zero"} />
      {toggles.labels ? <Info x={640} y={150} lines={[`x = ${fmt(x)}`, `f(x) = ${fmt(y)}`, `f'(x) = ${fmt(slope)}`, `sign = ${slope > 0 ? "positive" : slope < 0 ? "negative" : "zero"}`, `status = ${classification}`]} /> : null}
      <DraggableHandle label="Drag x along curve" position={{ x: sx(x, graph), y: sy(y, graph) }} bounds={{ x: [sx(-2.5, graph), sx(2.5, graph)], y: [sy(5, graph), sy(-2, graph)] }} onChange={(point) => onValueChange("x", xFrom(point.x, graph))} />
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <Axis spec={graph} />
        {children}
      </svg>
    </div>
  );
}

function Axis({ spec }: { spec: GraphSpec }) {
  const x0 = sx(0, spec);
  const y0 = sy(0, spec);
  return <g><rect x={spec.left} y={spec.top} width={spec.width} height={spec.height} rx="12" fill="#0f172a" stroke="#334155" />{Array.from({ length: 9 }, (_, index) => spec.xMin + index).map((x) => <line key={`x-${x}`} x1={sx(x, spec)} y1={spec.top} x2={sx(x, spec)} y2={spec.top + spec.height} stroke="#1e293b" />)}{Array.from({ length: 10 }, (_, index) => spec.yMin + index).map((y) => <line key={`y-${y}`} x1={spec.left} y1={sy(y, spec)} x2={spec.left + spec.width} y2={sy(y, spec)} stroke="#1e293b" />)}<line x1={spec.left} y1={y0} x2={spec.left + spec.width} y2={y0} stroke="#94a3b8" strokeWidth="2" /><line x1={x0} y1={spec.top} x2={x0} y2={spec.top + spec.height} stroke="#94a3b8" strokeWidth="2" /></g>;
}

function Curve({ fn, spec, token, activeHighlight, onHighlight, stroke = "#38bdf8" }: { fn: (x: number) => number; spec: GraphSpec; token: string; activeHighlight: string | null; onHighlight: (token: string | null) => void; stroke?: string }) {
  return <path d={pathFor(fn, spec)} fill="none" stroke={activeHighlight === token ? "#fde68a" : stroke} strokeWidth={activeHighlight === token ? "7" : "4"} strokeLinecap="round" onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)} />;
}

function Region({ x, y, w, h, token, activeHighlight, onHighlight, fill }: { x: number; y: number; w: number; h: number; token: string; activeHighlight: string | null; onHighlight: (token: string | null) => void; fill: string }) {
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><rect x={x} y={y} width={w} height={h} rx="8" fill={activeHighlight === token ? "#fde68a" : fill} opacity="0.9" stroke="#f8fafc" /></g>;
}

function SignedArea({ a, b, n, fn, spec, active }: { a: number; b: number; n: number; fn: (x: number) => number; spec: GraphSpec; active: boolean }) {
  const dx = (b - a) / n;
  return <g>{Array.from({ length: n }, (_, index) => {
    const x0 = a + index * dx;
    const sample = x0 + dx / 2;
    const y = fn(sample);
    return <rect key={index} x={sx(x0, spec)} y={y >= 0 ? sy(y, spec) : sy(0, spec)} width={Math.max(2, sx(x0 + dx, spec) - sx(x0, spec))} height={Math.abs(sy(y, spec) - sy(0, spec))} fill={active ? "#fde68a" : y >= 0 ? "#22c55e" : "#f97316"} opacity="0.45" stroke="#f8fafc" />;
  })}</g>;
}

function DerivativeSignStrip({ activeHighlight }: { activeHighlight: string | null }) {
  return <g><rect x="150" y="462" width="130" height="22" rx="8" fill={activeHighlight === "f-prime-positive" ? "#fde68a" : "#22c55e"} /><rect x="280" y="462" width="180" height="22" rx="8" fill={activeHighlight === "f-prime-negative" ? "#fde68a" : "#f97316"} /><rect x="460" y="462" width="130" height="22" rx="8" fill={activeHighlight === "f-prime-positive" ? "#fde68a" : "#22c55e"} /><Text x={215} y={504} text="f'(x)>0" small /><Text x={370} y={504} text="f'(x)<0" small /><Text x={525} y={504} text="f'(x)>0" small /></g>;
}

function Point({ x, y, spec, label, fill, active }: { x: number; y: number; spec: GraphSpec; label: string; fill: string; active: boolean }) {
  return <g><circle cx={sx(x, spec)} cy={sy(y, spec)} r={active ? 14 : 10} fill={active ? "#fde68a" : fill} stroke="#f8fafc" strokeWidth="3" /><Text x={sx(x, spec)} y={sy(y, spec) - 18} text={label} small /></g>;
}

function LineBySlope({ x, y, slope, spec, token, activeHighlight, dashed = false }: { x: number; y: number; slope: number; spec: GraphSpec; token: string; activeHighlight: string | null; dashed?: boolean }) {
  const x1 = spec.xMin;
  const x2 = spec.xMax;
  return <line x1={sx(x1, spec)} y1={sy(y + slope * (x1 - x), spec)} x2={sx(x2, spec)} y2={sy(y + slope * (x2 - x), spec)} stroke={activeHighlight === token ? "#fde68a" : dashed ? "#f97316" : "#22c55e"} strokeWidth="4" strokeDasharray={dashed ? "10 8" : undefined} />;
}

function GuideX({ x, spec, token, activeHighlight, label }: { x: number; spec: GraphSpec; token: string; activeHighlight: string | null; label: string }) {
  return <g><line x1={sx(x, spec)} y1={spec.top} x2={sx(x, spec)} y2={spec.top + spec.height} stroke={activeHighlight === token ? "#fde68a" : "#f8fafc"} strokeWidth="3" strokeDasharray="8 8" /><Text x={sx(x, spec)} y={spec.top + spec.height + 30} text={label} small /></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="245" height={Math.max(82, lines.length * 27 + 24)} rx="16" fill="#0f172a" opacity="0.95" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 27} fill="#f8fafc" fontSize="13" fontWeight="800">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill="#f8fafc" fontSize={small ? "13" : "18"} fontWeight="900">{text}</text>;
}

function pathFor(fn: (x: number) => number, spec: GraphSpec) {
  const samples = 180;
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = spec.xMin + (index / samples) * (spec.xMax - spec.xMin);
    return `${index === 0 ? "M" : "L"} ${sx(x, spec)} ${sy(fn(x), spec)}`;
  }).join(" ");
}

function sx(x: number, spec: GraphSpec) {
  return spec.left + ((x - spec.xMin) / (spec.xMax - spec.xMin)) * spec.width;
}

function sy(y: number, spec: GraphSpec) {
  return spec.top + spec.height - ((y - spec.yMin) / (spec.yMax - spec.yMin)) * spec.height;
}

function xFrom(svgX: number, spec: GraphSpec) {
  return spec.xMin + ((svgX - spec.left) / spec.width) * (spec.xMax - spec.xMin);
}

function integrate(fn: (x: number) => number, a: number, b: number, samples: number) {
  const dx = (b - a) / samples;
  return Array.from({ length: samples }, (_, index) => fn(a + (index + 0.5) * dx) * dx).reduce((sum, item) => sum + item, 0);
}

function mvtFunction(x: number) {
  return 0.18 * x ** 3 - 0.9 * x + 2.6;
}

function mvtDerivative(x: number) {
  return 0.54 * x * x - 0.9;
}

function ftcFunction(x: number) {
  return Math.sin(x) + 0.5 * x + 1;
}

function expCurve(x: number) {
  return Math.exp(clamp(x, -3, 1.8));
}

function taylorSin(center: number, degree: number, x: number) {
  return taylorPolynomial("sin", center, degree, x);
}

function optFunction(x: number) {
  return x ** 4 / 4 - x * x / 2 + 2;
}

function optDerivative(x: number) {
  return x ** 3 - x;
}

function classifyPoint(x: number) {
  if (Math.abs(x + 1) < 0.12) return "local max";
  if (Math.abs(x - 1) < 0.12) return "local min";
  if (Math.abs(x) < 0.12) return "flat but not extremum";
  return optDerivative(x) > 0 ? "increasing" : "decreasing";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function fmt(value: number) {
  return formatNumber(value);
}
