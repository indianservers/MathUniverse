import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { definiteIntegralApprox, formatNumber, riemannSum } from "../../utils/calculusMath";

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

type GraphSpec = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

const graph: GraphSpec = { xMin: -3.5, xMax: 4.2, yMin: -2, yMax: 8, left: 82, top: 60, width: 540, height: 380 };
const areaGraph: GraphSpec = { xMin: -3.5, xMax: 4.2, yMin: -3, yMax: 5, left: 82, top: 60, width: 540, height: 380 };
const palette = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#14b8a6", "#6366f1"];

export function LimitApproachesPointVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const h = Math.max(0.05, values.h);
  const leftX = a - h;
  const rightX = a + h;
  const target = square(a);
  return (
    <GraphFrame label="Limit approaches point graph">
      <Curve fn={square} spec={graph} token="f-x" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <GuideX x={a} spec={graph} token="x-to-a" activeHighlight={activeHighlight} label="x = a" />
      <GuideY y={target} spec={graph} token="L" activeHighlight={activeHighlight} label="L" />
      <PointMark x={leftX} y={square(leftX)} spec={graph} fill={palette[1]} label="left" active={activeHighlight === "lim"} />
      <PointMark x={rightX} y={square(rightX)} spec={graph} fill={palette[2]} label="right" active={activeHighlight === "lim"} />
      <circle cx={sx(a, graph)} cy={sy(target, graph)} r="11" fill={toggles.hole ? "#020617" : "#fde68a"} stroke="#fde68a" strokeWidth="4" />
      {toggles.labels ? <Info x={650} y={170} lines={[`a = ${fmt(a)}`, `h = ${fmt(h)}`, `f(a-h) = ${fmt(square(leftX))}`, `f(a+h) = ${fmt(square(rightX))}`, `L = ${fmt(target)}`]} /> : null}
      <DraggableHandle label="Drag approach point a" position={{ x: sx(a, graph), y: sy(target, graph) }} bounds={{ x: [sx(-2.6, graph), sx(2.6, graph)], y: [sy(6.8, graph), sy(0, graph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, graph))} />
      <DraggableHandle label="Drag approach distance h" position={{ x: sx(rightX, graph), y: sy(square(rightX), graph) }} axis="x" bounds={{ x: [sx(a + 0.05, graph), sx(Math.min(4, a + 1.5), graph)] }} keyboardStep={12} onChange={(point) => onValueChange("h", Math.abs(xFrom(point.x, graph) - a))} />
    </GraphFrame>
  );
}

export function DerivativeSlopeOfTangentVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const h = Math.max(0.05, values.h);
  return <DerivativeGraph values={{ a, h }} fn={square} derivative={(x) => 2 * x} spec={graph} title="Derivative as tangent slope" toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={onValueChange} />;
}

export function SecantBecomesTangentVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.x1;
  const h = Math.max(0.05, values.dx);
  return <DerivativeGraph values={{ a, h }} fn={softCubic} derivative={(x) => 0.75 * x * x - 1.1} spec={graph} title="Secant becomes tangent" toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={(id, value) => onValueChange(id === "a" ? "x1" : "dx", value)} />;
}

export function DerivativePowerRuleVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const n = Math.round(values.n);
  const a = values.a;
  const h = Math.max(0.04, values.h);
  const fn = (x: number) => Math.max(-1.5, Math.min(7, powerFunction(x, n)));
  const derivative = (x: number) => n * x ** Math.max(0, n - 1);
  return (
    <GraphFrame label="Power rule difference quotient graph">
      <Curve fn={fn} spec={graph} token="x-power" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <DerivativeOverlays a={a} h={h} fn={fn} derivative={derivative} spec={graph} activeHighlight={activeHighlight} />
      <Text x={655} y={132} text={`y = x^${n}`} />
      {toggles.labels ? <Info x={650} y={190} lines={[`n = ${n}`, `a = ${fmt(a)}`, `h = ${fmt(h)}`, `secant slope = ${fmt(secant(fn, a, h))}`, `n*a^(n-1) = ${fmt(derivative(a))}`]} /> : null}
      <DraggableHandle label="Drag x value" position={{ x: sx(a, graph), y: sy(fn(a), graph) }} bounds={{ x: [sx(0.2, graph), sx(2.4, graph)], y: [sy(7, graph), sy(-1, graph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, graph))} />
      <DraggableHandle label="Drag h" position={{ x: sx(a + h, graph), y: sy(fn(a + h), graph) }} axis="x" bounds={{ x: [sx(a + 0.04, graph), sx(a + 1.4, graph)] }} keyboardStep={12} onChange={(point) => onValueChange("h", Math.abs(xFrom(point.x, graph) - a))} />
    </GraphFrame>
  );
}

export function ProductRuleVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const u = values.u;
  const v = values.v;
  const du = values.du;
  const dv = values.dv;
  const scale = 52;
  const x = 120;
  const y = 400;
  const w = u * scale;
  const h = v * scale;
  const duw = du * scale;
  const dvh = dv * scale;
  return (
    <GraphFrame label="Product rule rectangle area">
      <g onMouseEnter={() => onHighlight("uv")} onMouseLeave={() => onHighlight(null)}>
        <rect x={x} y={y - h} width={w} height={h} rx="8" fill={activeHighlight === "uv" ? "#fde68a" : "#0ea5e9"} opacity="0.86" stroke="#f8fafc" />
      </g>
      <g onMouseEnter={() => onHighlight("u-prime-v")} onMouseLeave={() => onHighlight(null)}>
        <rect x={x + w} y={y - h} width={duw} height={h} rx="8" fill={activeHighlight === "u-prime-v" ? "#fde68a" : "#22c55e"} opacity="0.9" />
      </g>
      <g onMouseEnter={() => onHighlight("u-v-prime")} onMouseLeave={() => onHighlight(null)}>
        <rect x={x} y={y - h - dvh} width={w} height={dvh} rx="8" fill={activeHighlight === "u-v-prime" ? "#fde68a" : "#f97316"} opacity="0.9" />
      </g>
      {toggles.corner ? (
        <g onMouseEnter={() => onHighlight("tiny-corner")} onMouseLeave={() => onHighlight(null)}>
          <rect x={x + w} y={y - h - dvh} width={duw} height={dvh} rx="8" fill={activeHighlight === "tiny-corner" ? "#fde68a" : "#a855f7"} opacity="0.88" />
        </g>
      ) : null}
      {toggles.labels ? <Info x={610} y={190} lines={[`base area uv = ${fmt(u * v)}`, `v du = ${fmt(v * du)}`, `u dv = ${fmt(u * dv)}`, `du dv = ${fmt(du * dv)}`, "corner vanishes in limit"]} /> : null}
      <DraggableHandle label="Drag u" position={{ x: x + w, y }} axis="x" bounds={{ x: [x + 80, x + 320] }} onChange={(point) => onValueChange("u", (point.x - x) / scale)} />
      <DraggableHandle label="Drag v" position={{ x, y: y - h }} axis="y" bounds={{ y: [y - 300, y - 70] }} onChange={(point) => onValueChange("v", (y - point.y) / scale)} />
      <DraggableHandle label="Drag du" position={{ x: x + w + duw, y: y - h / 2 }} axis="x" bounds={{ x: [x + w + 10, x + w + 120] }} onChange={(point) => onValueChange("du", (point.x - x - w) / scale)} />
      <DraggableHandle label="Drag dv" position={{ x: x + w / 2, y: y - h - dvh }} axis="y" bounds={{ y: [y - h - 120, y - h - 10] }} onChange={(point) => onValueChange("dv", (y - h - point.y) / scale)} />
    </GraphFrame>
  );
}

export function ChainRuleVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const x = values.x;
  const dx = Math.max(0.02, values.dx);
  const u = x * x;
  const du = (x + dx) ** 2 - x ** 2;
  const y = u * u;
  const dy = (u + du) ** 2 - u ** 2;
  const rateProduct = 2 * u * 2 * x;
  return (
    <GraphFrame label="Chain rule linked rate pipeline">
      <PipelineBox x={95} y={190} title="input" body={`x = ${fmt(x)}`} active={activeHighlight === "g-prime"} />
      <Arrow x1={225} y1={230} x2={305} y2={230} active={activeHighlight === "g-prime"} />
      <PipelineBox x={315} y={165} title="u = g(x)" body={`u = x^2 = ${fmt(u)}`} active={activeHighlight === "f-prime-g"} />
      <Arrow x1={445} y1={230} x2={525} y2={230} active={activeHighlight === "f-prime-g"} />
      <PipelineBox x={535} y={190} title="y = f(u)" body={`y = u^2 = ${fmt(y)}`} active={activeHighlight === "chain-derivative"} />
      <RateCard x={120} y={360} title="du/dx" value={fmt(2 * x)} active={activeHighlight === "g-prime"} />
      <RateCard x={320} y={360} title="dy/du" value={fmt(2 * u)} active={activeHighlight === "f-prime-g"} />
      <RateCard x={520} y={360} title="dy/dx" value={fmt(rateProduct)} active={activeHighlight === "rate-product" || activeHighlight === "chain-derivative"} />
      {toggles.labels ? <Info x={615} y={94} lines={[`dx = ${fmt(dx)}`, `du ~= ${fmt(du)}`, `dy ~= ${fmt(dy)}`, `dy/dx = ${fmt(rateProduct)}`]} /> : null}
      <DraggableHandle label="Drag input x" position={{ x: 180 + x * 70, y: 470 }} axis="x" bounds={{ x: [85, 390] }} onChange={(point) => onValueChange("x", (point.x - 180) / 70)} />
      <DraggableHandle label="Drag dx" position={{ x: 180 + (x + dx) * 70, y: 500 }} axis="x" bounds={{ x: [180 + x * 70 + 5, 180 + x * 70 + 90] }} onChange={(point) => onValueChange("dx", Math.abs((point.x - 180) / 70 - x))} />
    </GraphFrame>
  );
}

export function RiemannSumsAreaVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = Math.min(values.a, values.b - 0.2);
  const b = Math.max(values.b, a + 0.2);
  const n = Math.round(values.n);
  const method = methodFrom(values.method);
  const dx = (b - a) / n;
  return (
    <GraphFrame label="Riemann sums area under curve">
      <AreaAxis spec={areaGraph} />
      <RiemannRects a={a} b={b} n={n} method={method} fn={positiveCurve} spec={areaGraph} active={activeHighlight === "sigma" || activeHighlight === "height" || activeHighlight === "dx"} onHighlight={onHighlight} />
      <Curve fn={positiveCurve} spec={areaGraph} token="height" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <GuideX x={a} spec={areaGraph} token="a" activeHighlight={activeHighlight} label="a" />
      <GuideX x={b} spec={areaGraph} token="b" activeHighlight={activeHighlight} label="b" />
      {activeHighlight === "n-to-infinity" ? <Text x={350} y={500} text="as n grows, rectangles fit the curve better" /> : null}
      {toggles.labels ? <Info x={635} y={160} lines={[`method = ${method}`, `n = ${n}`, `dx = ${fmt(dx)}`, `sum ~= ${fmt(riemannSum("quadratic", a, b, n, "midpoint") + (b - a) * 1.3)}`]} /> : null}
      <DraggableHandle label="Drag lower bound a" position={{ x: sx(a, areaGraph), y: sy(0, areaGraph) }} axis="x" bounds={{ x: [sx(-3, areaGraph), sx(b - 0.3, areaGraph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, areaGraph))} />
      <DraggableHandle label="Drag upper bound b" position={{ x: sx(b, areaGraph), y: sy(0, areaGraph) }} axis="x" bounds={{ x: [sx(a + 0.3, areaGraph), sx(4, areaGraph)] }} onChange={(point) => onValueChange("b", xFrom(point.x, areaGraph))} />
    </GraphFrame>
  );
}

export function DefiniteIntegralAccumulatedAreaVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = Math.min(values.a, values.b - 0.1);
  const b = values.b;
  const n = Math.round(values.n);
  const signedArea = definiteIntegralApprox("sinLinear", a, b, 260);
  return (
    <GraphFrame label="Definite integral accumulated signed area">
      <AreaAxis spec={areaGraph} />
      <SignedArea a={a} b={b} n={n} fn={signedCurve} spec={areaGraph} activeHighlight={activeHighlight} />
      <Curve fn={signedCurve} spec={areaGraph} token="f-x" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <GuideX x={a} spec={areaGraph} token="a" activeHighlight={activeHighlight} label="a" />
      <GuideX x={b} spec={areaGraph} token="b" activeHighlight={activeHighlight} label="b" />
      <PointMark x={b} y={signedCurve(b)} spec={areaGraph} fill="#fde68a" label="moving x" active={activeHighlight === "integral"} />
      {toggles.labels ? <Info x={625} y={156} lines={[`from a = ${fmt(a)}`, `to b = ${fmt(b)}`, `slices n = ${n}`, `signed area ~= ${fmt(signedArea)}`, "below axis subtracts"]} /> : null}
      <DraggableHandle label="Drag start a" position={{ x: sx(a, areaGraph), y: sy(0, areaGraph) }} axis="x" bounds={{ x: [sx(-3, areaGraph), sx(b - 0.2, areaGraph)] }} onChange={(point) => onValueChange("a", xFrom(point.x, areaGraph))} />
      <DraggableHandle label="Drag endpoint b" position={{ x: sx(b, areaGraph), y: sy(signedCurve(b), areaGraph) }} bounds={{ x: [sx(a + 0.2, areaGraph), sx(4, areaGraph)], y: [sy(5, areaGraph), sy(-3, areaGraph)] }} onChange={(point) => onValueChange("b", xFrom(point.x, areaGraph))} />
    </GraphFrame>
  );
}

function DerivativeGraph({ values, fn, derivative, spec, title, toggles, activeHighlight, onHighlight, onValueChange }: { values: { a: number; h: number }; fn: (x: number) => number; derivative: (x: number) => number; spec: GraphSpec; title: string; toggles: PhaseTwoToggles; activeHighlight: string | null; onHighlight: (token: string | null) => void; onValueChange: (id: string, value: number) => void }) {
  const { a, h } = values;
  const sec = secant(fn, a, h);
  return (
    <GraphFrame label={title}>
      <Curve fn={fn} spec={spec} token="derivative" activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <DerivativeOverlays a={a} h={h} fn={fn} derivative={derivative} spec={spec} activeHighlight={activeHighlight} />
      {toggles.labels ? <Info x={650} y={160} lines={[`a = ${fmt(a)}`, `h = ${fmt(h)}`, `rise = ${fmt(fn(a + h) - fn(a))}`, `secant = ${fmt(sec)}`, `tangent = ${fmt(derivative(a))}`]} /> : null}
      <DraggableHandle label="Drag point a" position={{ x: sx(a, spec), y: sy(fn(a), spec) }} bounds={{ x: [sx(-2.4, spec), sx(2.4, spec)], y: [sy(7, spec), sy(-1, spec)] }} onChange={(point) => onValueChange("a", xFrom(point.x, spec))} />
      <DraggableHandle label="Drag h" position={{ x: sx(a + h, spec), y: sy(fn(a + h), spec) }} axis="x" bounds={{ x: [sx(a + 0.05, spec), sx(Math.min(4, a + 1.8), spec)] }} keyboardStep={12} onChange={(point) => onValueChange("h", Math.abs(xFrom(point.x, spec) - a))} />
    </GraphFrame>
  );
}

function DerivativeOverlays({ a, h, fn, derivative, spec, activeHighlight }: { a: number; h: number; fn: (x: number) => number; derivative: (x: number) => number; spec: GraphSpec; activeHighlight: string | null }) {
  const y0 = fn(a);
  const y1 = fn(a + h);
  const sec = secant(fn, a, h);
  const tangent = derivative(a);
  return (
    <>
      <LineBySlope x={a} y={y0} slope={sec} spec={spec} stroke={activeHighlight === "h-to-0" || activeHighlight === "avg-slope" ? "#fde68a" : "#22c55e"} />
      <LineBySlope x={a} y={y0} slope={tangent} spec={spec} stroke={activeHighlight === "instantaneous" || activeHighlight === "derivative" ? "#fde68a" : "#f97316"} dashed />
      <line x1={sx(a, spec)} y1={sy(y0, spec)} x2={sx(a + h, spec)} y2={sy(y0, spec)} stroke={activeHighlight === "h" || activeHighlight === "delta-x" || activeHighlight === "over-h" ? "#fde68a" : "#f8fafc"} strokeWidth="4" />
      <line x1={sx(a + h, spec)} y1={sy(y0, spec)} x2={sx(a + h, spec)} y2={sy(y1, spec)} stroke={activeHighlight === "rise" || activeHighlight === "delta-y" ? "#fde68a" : "#f8fafc"} strokeWidth="4" />
      <PointMark x={a} y={y0} spec={spec} fill="#0ea5e9" label="A" active={activeHighlight === "derivative"} />
      <PointMark x={a + h} y={y1} spec={spec} fill="#22c55e" label="B" active={activeHighlight === "h-to-0" || activeHighlight === "avg-slope"} />
    </>
  );
}

function GraphFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <defs>
          <marker id="calc-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#f8fafc" />
          </marker>
        </defs>
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
  return (
    <g>
      <rect x={spec.left} y={spec.top} width={spec.width} height={spec.height} rx="12" fill="#0f172a" stroke="#334155" />
      {Array.from({ length: 8 }, (_, index) => spec.xMin + index).map((x) => <line key={`x-${x}`} x1={sx(x, spec)} y1={spec.top} x2={sx(x, spec)} y2={spec.top + spec.height} stroke="#1e293b" />)}
      {Array.from({ length: 11 }, (_, index) => spec.yMin + index).map((y) => <line key={`y-${y}`} x1={spec.left} y1={sy(y, spec)} x2={spec.left + spec.width} y2={sy(y, spec)} stroke="#1e293b" />)}
      <line x1={spec.left} y1={y0} x2={spec.left + spec.width} y2={y0} stroke="#94a3b8" strokeWidth="2" />
      <line x1={x0} y1={spec.top} x2={x0} y2={spec.top + spec.height} stroke="#94a3b8" strokeWidth="2" />
    </g>
  );
}

function AreaAxis({ spec }: { spec: GraphSpec }) {
  return <Axis spec={spec} />;
}

function Curve({ fn, spec, token, activeHighlight, onHighlight }: { fn: (x: number) => number; spec: GraphSpec; token: string; activeHighlight: string | null; onHighlight: (token: string | null) => void }) {
  return <path d={pathFor(fn, spec)} fill="none" stroke={activeHighlight === token ? "#fde68a" : "#38bdf8"} strokeWidth={activeHighlight === token ? "7" : "4"} strokeLinecap="round" onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)} />;
}

function RiemannRects({ a, b, n, method, fn, spec, active, onHighlight }: { a: number; b: number; n: number; method: string; fn: (x: number) => number; spec: GraphSpec; active: boolean; onHighlight: (token: string | null) => void }) {
  const dx = (b - a) / n;
  return (
    <g onMouseEnter={() => onHighlight("sigma")} onMouseLeave={() => onHighlight(null)}>
      {Array.from({ length: n }, (_, index) => {
        const x0 = a + index * dx;
        const sample = method === "right" ? x0 + dx : method === "midpoint" ? x0 + dx / 2 : x0;
        const height = Math.max(0, fn(sample));
        return <rect key={index} x={sx(x0, spec)} y={sy(height, spec)} width={Math.max(2, sx(x0 + dx, spec) - sx(x0, spec))} height={sy(0, spec) - sy(height, spec)} fill={active ? "#fde68a" : palette[index % palette.length]} opacity="0.48" stroke="#f8fafc" />;
      })}
    </g>
  );
}

function SignedArea({ a, b, n, fn, spec, activeHighlight }: { a: number; b: number; n: number; fn: (x: number) => number; spec: GraphSpec; activeHighlight: string | null }) {
  const dx = (b - a) / n;
  return (
    <g>
      {Array.from({ length: n }, (_, index) => {
        const x0 = a + index * dx;
        const sample = x0 + dx / 2;
        const y = fn(sample);
        const yTop = y >= 0 ? sy(y, spec) : sy(0, spec);
        const height = Math.abs(sy(y, spec) - sy(0, spec));
        const fill = y >= 0 ? "#22c55e" : "#f97316";
        return <rect key={index} x={sx(x0, spec)} y={yTop} width={Math.max(2, sx(x0 + dx, spec) - sx(x0, spec))} height={height} fill={activeHighlight === "integral" || activeHighlight === "dx" ? "#fde68a" : fill} opacity="0.5" stroke="#f8fafc" />;
      })}
    </g>
  );
}

function GuideX({ x, spec, token, activeHighlight, label }: { x: number; spec: GraphSpec; token: string; activeHighlight: string | null; label: string }) {
  return <g><line x1={sx(x, spec)} y1={spec.top} x2={sx(x, spec)} y2={spec.top + spec.height} stroke={activeHighlight === token ? "#fde68a" : "#f8fafc"} strokeWidth={activeHighlight === token ? "5" : "2"} strokeDasharray="8 8" /><Text x={sx(x, spec)} y={spec.top + spec.height + 30} text={label} small /></g>;
}

function GuideY({ y, spec, token, activeHighlight, label }: { y: number; spec: GraphSpec; token: string; activeHighlight: string | null; label: string }) {
  return <g><line x1={spec.left} y1={sy(y, spec)} x2={spec.left + spec.width} y2={sy(y, spec)} stroke={activeHighlight === token ? "#fde68a" : "#f8fafc"} strokeWidth={activeHighlight === token ? "5" : "2"} strokeDasharray="8 8" /><Text x={spec.left - 28} y={sy(y, spec) + 5} text={label} small /></g>;
}

function PointMark({ x, y, spec, fill, label, active }: { x: number; y: number; spec: GraphSpec; fill: string; label: string; active: boolean }) {
  return <g><circle cx={sx(x, spec)} cy={sy(y, spec)} r={active ? 14 : 10} fill={active ? "#fde68a" : fill} stroke="#f8fafc" strokeWidth="3" /><Text x={sx(x, spec)} y={sy(y, spec) - 18} text={label} small /></g>;
}

function LineBySlope({ x, y, slope, spec, stroke, dashed = false }: { x: number; y: number; slope: number; spec: GraphSpec; stroke: string; dashed?: boolean }) {
  const x1 = spec.xMin;
  const x2 = spec.xMax;
  return <line x1={sx(x1, spec)} y1={sy(y + slope * (x1 - x), spec)} x2={sx(x2, spec)} y2={sy(y + slope * (x2 - x), spec)} stroke={stroke} strokeWidth="4" strokeDasharray={dashed ? "10 8" : undefined} />;
}

function PipelineBox({ x, y, title, body, active }: { x: number; y: number; title: string; body: string; active: boolean }) {
  return <g><rect x={x} y={y} width="130" height="80" rx="16" fill={active ? "#fde68a" : "#0ea5e9"} opacity="0.92" /><text x={x + 65} y={y + 30} textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="900">{title}</text><text x={x + 65} y={y + 58} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="800">{body}</text></g>;
}

function RateCard({ x, y, title, value, active }: { x: number; y: number; title: string; value: string; active: boolean }) {
  return <g><rect x={x} y={y} width="150" height="72" rx="14" fill={active ? "#fde68a" : "#1e293b"} stroke="#f8fafc" /><text x={x + 75} y={y + 28} textAnchor="middle" fill={active ? "#0f172a" : "#f8fafc"} fontSize="14" fontWeight="900">{title}</text><text x={x + 75} y={y + 54} textAnchor="middle" fill={active ? "#0f172a" : "#f8fafc"} fontSize="18" fontWeight="900">{value}</text></g>;
}

function Arrow({ x1, y1, x2, y2, active }: { x1: number; y1: number; x2: number; y2: number; active: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth="5" markerEnd="url(#calc-arrow)" />;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="235" height={Math.max(82, lines.length * 27 + 24)} rx="16" fill="#0f172a" opacity="0.95" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 27} fill="#f8fafc" fontSize="13" fontWeight="800">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill="#f8fafc" fontSize={small ? "13" : "18"} fontWeight="900">{text}</text>;
}

function pathFor(fn: (x: number) => number, spec: GraphSpec) {
  const samples = 180;
  return Array.from({ length: samples + 1 }, (_, index) => {
    const x = spec.xMin + (index / samples) * (spec.xMax - spec.xMin);
    const y = fn(x);
    return `${index === 0 ? "M" : "L"} ${sx(x, spec)} ${sy(y, spec)}`;
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

function secant(fn: (x: number) => number, a: number, h: number) {
  return (fn(a + h) - fn(a)) / h;
}

function square(x: number) {
  return x * x;
}

function softCubic(x: number) {
  return 0.25 * x ** 3 - 1.1 * x + 2.8;
}

function powerFunction(x: number, n: number) {
  return x ** n;
}

function positiveCurve(x: number) {
  return 0.2 * x * x + 1.2;
}

function signedCurve(x: number) {
  return Math.sin(x) + 0.5 * x;
}

function methodFrom(value: number) {
  if (value < 0.5) return "left";
  if (value < 1.5) return "midpoint";
  return "right";
}

function fmt(value: number) {
  return formatNumber(value);
}
