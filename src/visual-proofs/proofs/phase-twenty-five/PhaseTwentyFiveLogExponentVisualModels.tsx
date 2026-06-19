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
  guide: "#facc15",
  accent: "#f97316",
  green: "#22c55e",
  purple: "#a78bfa",
  axis: "#94a3b8",
  panel: "#0f172a",
};

export function ExponentsRepeatedMultiplicationVisual({ values, toggles, activeHighlight }: VisualState) {
  const base = Math.round(values.base);
  const exponent = Math.round(values.exponent);
  const result = power(base, exponent);
  return (
    <Frame label="Exponents as repeated multiplication">
      <FactorChain count={exponent} base={base} y={150} active={activeHighlight} />
      <GrowthBars values={range(0, exponent, 1).map((n) => power(base, n))} activeIndex={exponent} />
      <SpecialCases active={activeHighlight === "zero-exponent"} base={base} />
      {toggles.labels ? <Info lines={[`base a = ${base}`, `exponent n = ${exponent}`, `factors = ${factorText(base, exponent)}`, `a^n = ${fmt(result)}`, `previous step x a`, "invariant: each step multiplies by a"]} /> : null}
    </Frame>
  );
}

export function ExponentLawsVisual({ values, toggles, activeHighlight }: VisualState) {
  const base = Math.round(values.base);
  const m = Math.round(values.m);
  const n = Math.round(values.n);
  const mode = lawMode(values.mode);
  const simplified = mode === "product" ? m + n : mode === "quotient" ? m - n : m * n;
  return (
    <Frame label="Laws of exponents with the same base">
      <LawBadge mode={mode} active={highlight(activeHighlight, ["m-plus-n", "m-minus-n", "mn"])} />
      <FactorChain count={m} base={base} y={145} label="first group m" active={activeHighlight} />
      <FactorChain count={n} base={base} y={235} label="second group n" active={activeHighlight} />
      {mode === "quotient" ? <CancelBand count={Math.min(m, n)} /> : null}
      <Text x={115} y={375} text={`simplified exponent = ${simplified}`} />
      <Text x={115} y={415} text={`expanded value = simplified value = ${fmt(power(base, simplified))}`} />
      {toggles.labels ? <Info lines={[`base a = ${base}`, `m = ${m}`, `n = ${n}`, `law = ${mode}`, `simplified exponent = ${simplified}`, `invariant: expanded expression equals simplified expression`]} /> : null}
    </Frame>
  );
}

export function ExponentialGrowthDecayVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = values.initial;
  const b = values.multiplier;
  const x = values.x;
  const y = a * b ** x;
  return (
    <Frame label="Exponential growth and decay">
      <Grid />
      <Curve points={range(0, 6, 0.12).map((t) => p(t, a * b ** t))} active={highlight(activeHighlight, ["a", "b", "a-b-x"])} />
      <StepMarkers a={a} b={b} />
      <PointMark point={p(x, y)} label="current" color={colors.guide} />
      <DraggableHandle label="Drag x" position={{ x: gx(x), y: gy(clamp(y, 0, 9)) }} bounds={gridBounds()} onChange={(next) => onValueChange("x", clamp(fromGx(next.x), 0, 6))} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `x = ${fmt(x)}`, `y = ${fmt(y)}`, `status = ${b > 1 ? "growth" : "decay"}`, `y(x+1)/y(x) = ${fmt(b)}`]} /> : null}
    </Frame>
  );
}

export function LogInverseExponentialVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const b = values.base;
  const x = values.exponent;
  const y = b ** x;
  return (
    <Frame label="Logarithm as inverse of exponential">
      <Grid />
      <line x1={gx(0)} y1={gy(0)} x2={gx(9)} y2={gy(9)} stroke={activeHighlight === "inverse" ? colors.guide : colors.axis} strokeWidth="4" strokeDasharray="8 7" />
      <Curve points={range(0, 4.2, 0.08).map((t) => p(t, b ** t))} active={activeHighlight === "b-x"} />
      <Curve points={range(0.2, 9, 0.16).map((t) => p(t, logBase(t, b)))} active={activeHighlight === "log-b-y"} color={colors.purple} />
      <PointMark point={p(x, y)} label="(x,y)" color={colors.accent} />
      <PointMark point={p(y, x)} label="(y,x)" color={colors.green} />
      <line x1={gx(x)} y1={gy(y)} x2={gx(y)} y2={gy(x)} stroke={colors.guide} strokeWidth="3" strokeDasharray="6 6" />
      <DraggableHandle label="Drag exponent x" position={{ x: gx(x), y: gy(clamp(y, 0, 9)) }} bounds={gridBounds()} onChange={(next) => onValueChange("exponent", clamp(fromGx(next.x), 0, 4))} />
      {toggles.labels ? <Info lines={[`base b = ${fmt(b)}`, `x = ${fmt(x)}`, `y = b^x = ${fmt(y)}`, `log_b(y) = ${fmt(logBase(y, b))}`, `reflected point = (${fmt(y)}, ${fmt(x)})`, "invariant: log_b(b^x)=x"]} /> : null}
    </Frame>
  );
}

export function LogLawsVisual({ values, toggles, activeHighlight }: VisualState) {
  const b = values.base;
  const m = values.m;
  const n = values.n;
  const pValue = values.p;
  const mode = logLawMode(values.mode);
  const mValue = b ** m;
  const nValue = b ** n;
  const right = mode === "product" ? m + n : mode === "quotient" ? m - n : pValue * m;
  return (
    <Frame label="Laws of logarithms from exponent laws">
      <PowerBlocks base={b} m={m} n={n} active={activeHighlight} />
      <LawBadge mode={mode} active={highlight(activeHighlight, ["plus", "minus", "p-log-b-m"])} />
      <Text x={110} y={350} text={`M = b^m = ${fmt(mValue)}`} />
      <Text x={110} y={388} text={`N = b^n = ${fmt(nValue)}`} />
      <Text x={110} y={426} text={`left side exponent = right side = ${fmt(right)}`} />
      {toggles.labels ? <Info lines={[`base b = ${fmt(b)}`, `M = ${fmt(mValue)}`, `N = ${fmt(nValue)}`, `m = log_b M = ${fmt(m)}`, `n = log_b N = ${fmt(n)}`, `law = ${mode}`, `left = right = ${fmt(right)}`]} /> : null}
    </Frame>
  );
}

export function ChangeOfBaseVisual({ values, toggles, activeHighlight }: VisualState) {
  const b = values.baseB;
  const k = values.baseK;
  const x = values.xValue;
  const direct = logBase(x, b);
  const numerator = logBase(x, k);
  const denominator = logBase(b, k);
  return (
    <Frame label="Change of base formula">
      <ScaleRail y={175} label={`base ${fmt(b)} scale`} ticks={[1, b, b ** 2, b ** 3]} active={activeHighlight === "log-b-x"} />
      <ScaleRail y={285} label={`base ${fmt(k)} scale`} ticks={[1, k, k ** 2, k ** 3]} active={highlight(activeHighlight, ["log-k-x", "log-k-b", "ratio"])} />
      <RatioPanel lines={[`log_b x = ${fmt(direct)}`, `log_k x = ${fmt(numerator)}`, `log_k b = ${fmt(denominator)}`, `ratio = ${fmt(numerator / denominator)}`]} active={activeHighlight === "ratio"} />
      {toggles.labels ? <Info lines={[`b = ${fmt(b)}`, `k = ${fmt(k)}`, `x = ${fmt(x)}`, `direct log_b x = ${fmt(direct)}`, `numerator = ${fmt(numerator)}`, `denominator = ${fmt(denominator)}`, `ratio = ${fmt(numerator / denominator)}`]} /> : null}
    </Frame>
  );
}

export function LogScaleVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const x = values.xValue;
  const logX = Math.log10(x);
  return (
    <Frame label="Logarithmic scale and orders of magnitude">
      <Text x={90} y={125} text="linear scale" />
      <line x1="92" y1="170" x2="552" y2="170" stroke={colors.axis} strokeWidth="5" />
      <circle cx={92 + Math.min(x / 1000, 1) * 460} cy="170" r="10" fill={colors.accent} />
      <Text x={90} y={270} text="log10 scale" />
      <line x1="92" y1="315" x2="552" y2="315" stroke={colors.axis} strokeWidth="5" />
      {[1, 10, 100, 1000].map((tick, index) => <ScaleTick key={tick} x={92 + index * 153} y={315} label={String(tick)} active={activeHighlight === "orders-magnitude"} />)}
      <circle cx={92 + clamp(logX / 3, 0, 1) * 460} cy="315" r="11" fill={activeHighlight === "log10-x" ? colors.guide : colors.green} />
      <Text x={115} y={365} text="equal x10 steps have equal log spacing" />
      <DraggableHandle label="Drag value x" position={{ x: 92 + clamp(logX / 3, 0, 1) * 460, y: 360 }} bounds={{ x: [92, 552], y: [360, 360] }} onChange={(next) => onValueChange("xValue", 10 ** (((next.x - 92) / 460) * 3))} />
      {toggles.labels ? <Info lines={[`x = ${fmt(x)}`, `log10(x) = ${fmt(logX)}`, `nearest power of 10 = ${nearestPower10(x)}`, `order = ${Math.floor(logX)}`, `linear position compresses large values`, `log position = ${fmt(logX)}`]} /> : null}
    </Frame>
  );
}

export function NaturalExponentialVisual({ values, toggles, activeHighlight }: VisualState) {
  const x = values.x;
  const n = Math.round(values.n);
  const height = Math.E ** x;
  const approx = (1 + 1 / n) ** n;
  return (
    <Frame label="Natural exponential and Euler's number e">
      <Grid />
      <Curve points={range(-2, 2.4, 0.08).map((t) => p(t + 3, Math.E ** t))} active={activeHighlight === "e-x"} />
      <TangentAt shiftedX={x + 3} x={x} active={activeHighlight === "slope"} />
      <PointMark point={p(x + 3, height)} label="height=slope" color={colors.guide} />
      <ApproxPanel n={n} approx={approx} active={highlight(activeHighlight, ["compound-growth", "e"])} />
      {toggles.labels ? <Info lines={[`x = ${fmt(x)}`, `e^x = ${fmt(height)}`, `tangent slope = ${fmt(height)}`, `difference = ${fmt(0)}`, `n = ${n}`, `(1+1/n)^n = ${fmt(approx)}`, `e = ${fmt(Math.E)}`]} /> : null}
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

function FactorChain({ count, base, y, active, label = "repeated factors" }: { count: number; base: number; y: number; active: string | null; label?: string }) {
  const items = count === 0 ? ["1"] : Array.from({ length: count }, () => String(base));
  return (
    <g>
      <Text x={95} y={y - 28} text={label} />
      {items.map((item, index) => (
        <g key={`${item}-${index}`}>
          <rect x={95 + index * 58} y={y} width="42" height="42" rx="9" fill={highlight(active, ["a", "n", "m"]) ? colors.guide : colors.panel} stroke={colors.curve} />
          <Text x={110 + index * 58} y={y + 27} text={item} />
          {index < items.length - 1 ? <Text x={142 + index * 58} y={y + 28} text="x" /> : null}
        </g>
      ))}
    </g>
  );
}

function GrowthBars({ values, activeIndex }: { values: number[]; activeIndex: number }) {
  const max = Math.max(...values, 1);
  return <g>{values.map((value, index) => <rect key={index} x={100 + index * 54} y={425 - (value / max) * 140} width="34" height={(value / max) * 140} rx="6" fill={index === activeIndex ? colors.guide : colors.green} opacity="0.85" />)}</g>;
}

function SpecialCases({ active, base }: { active: boolean; base: number }) {
  return <g><rect x="105" y="265" width="260" height="78" rx="14" fill={active ? "#713f12" : colors.panel} stroke="#334155" /><Text x={125} y={302} text={`a^0 = 1, so ${base}^0 = 1`} /><Text x={125} y={330} text={`a^1 = a, so ${base}^1 = ${base}`} /></g>;
}

function CancelBand({ count }: { count: number }) {
  return <g>{Array.from({ length: count }, (_, index) => <line key={index} x1={95 + index * 58} y1="130" x2={137 + index * 58} y2="278" stroke={colors.guide} strokeWidth="4" />)}</g>;
}

function LawBadge({ mode, active }: { mode: string; active: boolean }) {
  return <g><rect x="520" y="125" width="230" height="96" rx="16" fill={active ? "#713f12" : colors.panel} stroke="#334155" /><Text x={545} y={164} text={mode} /><Text x={545} y={196} text={mode === "product" ? "factor counts add" : mode === "quotient" ? "common factors cancel" : "groups multiply"} /></g>;
}

function PowerBlocks({ base, m, n, active }: { base: number; m: number; n: number; active: string | null }) {
  return <g><FactorChain count={Math.round(m)} base={Math.round(base)} y={135} active={active} label="M = b^m" /><FactorChain count={Math.round(n)} base={Math.round(base)} y={225} active={active} label="N = b^n" /></g>;
}

function Grid() {
  return (
    <g>
      {range(0, 9, 1).map((v) => <line key={`x${v}`} x1={gx(v)} y1={gy(0)} x2={gx(v)} y2={gy(9)} stroke="#1e293b" />)}
      {range(0, 9, 1).map((v) => <line key={`y${v}`} x1={gx(0)} y1={gy(v)} x2={gx(9)} y2={gy(v)} stroke="#1e293b" />)}
      <line x1={gx(0)} y1={gy(0)} x2={gx(9)} y2={gy(0)} stroke={colors.axis} strokeWidth="3" />
      <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(9)} stroke={colors.axis} strokeWidth="3" />
    </g>
  );
}

function Curve({ points, active = false, color = colors.curve }: { points: Point[]; active?: boolean; color?: string }) {
  return <polyline points={points.map((q) => `${gx(q.x)},${gy(clamp(q.y, 0, 9))}`).join(" ")} fill="none" stroke={active ? colors.guide : color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
}

function StepMarkers({ a, b }: { a: number; b: number }) {
  return <g>{range(0, 5, 1).map((x) => <circle key={x} cx={gx(x)} cy={gy(clamp(a * b ** x, 0, 9))} r="6" fill={colors.accent} />)}</g>;
}

function PointMark({ point, label, color }: { point: Point; label: string; color: string }) {
  return <g><circle cx={gx(point.x)} cy={gy(clamp(point.y, 0, 9))} r="8" fill={color} /><Text x={gx(point.x) + 10} y={gy(clamp(point.y, 0, 9)) - 8} text={label} /></g>;
}

function TangentAt({ shiftedX, x, active }: { shiftedX: number; x: number; active: boolean }) {
  const y = Math.E ** x;
  const slope = y;
  const x1 = shiftedX - 1.4;
  const x2 = shiftedX + 1.4;
  return <line x1={gx(x1)} y1={gy(y + slope * (x1 - shiftedX))} x2={gx(x2)} y2={gy(y + slope * (x2 - shiftedX))} stroke={active ? colors.guide : colors.accent} strokeWidth="4" />;
}

function ScaleRail({ y, label, ticks, active }: { y: number; label: string; ticks: number[]; active: boolean }) {
  return <g><Text x={90} y={y - 35} text={label} /><line x1="92" y1={y} x2="552" y2={y} stroke={active ? colors.guide : colors.axis} strokeWidth="5" />{ticks.map((tick, index) => <ScaleTick key={`${label}-${tick}`} x={92 + index * 153} y={y} label={fmt(tick)} active={active} />)}</g>;
}

function ScaleTick({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return <g><line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={active ? colors.guide : "#cbd5e1"} strokeWidth="3" /><Text x={x - 12} y={y + 40} text={label} /></g>;
}

function RatioPanel({ lines, active }: { lines: string[]; active: boolean }) {
  return <g><rect x="105" y="360" width="370" height="115" rx="14" fill={active ? "#713f12" : colors.panel} stroke="#334155" />{lines.map((line, index) => <Text key={line} x={125} y={392 + index * 24} text={line} />)}</g>;
}

function ApproxPanel({ n, approx, active }: { n: number; approx: number; active: boolean }) {
  return <g><rect x="520" y="135" width="280" height="140" rx="14" fill={active ? "#713f12" : colors.panel} stroke="#334155" /><Text x={542} y={175} text={`n = ${n}`} /><Text x={542} y={210} text={`(1+1/n)^n = ${fmt(approx)}`} /><Text x={542} y={245} text={`e = ${fmt(Math.E)}`} /></g>;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="612" y="104" width="252" height={Math.max(95, lines.length * 23 + 34)} rx="14" fill={colors.panel} stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="628" y={134 + index * 22} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

const origin = { x: 95, y: 460 };
const scale = 42;
function gx(x: number) { return origin.x + x * scale; }
function gy(y: number) { return origin.y - y * scale; }
function fromGx(x: number) { return (x - origin.x) / scale; }
function gridBounds(): { x: [number, number]; y: [number, number] } {
  return { x: [gx(0), gx(9)], y: [gy(9), gy(0)] };
}
function p(x: number, y: number): Point { return { x, y }; }
function range(start: number, end: number, step: number) {
  const items: number[] = [];
  for (let value = start; value <= end + 0.0001; value += step) items.push(Number(value.toFixed(3)));
  return items;
}
function power(base: number, exponent: number) { return exponent === 0 ? 1 : base ** exponent; }
function factorText(base: number, exponent: number) { return exponent === 0 ? "empty product = 1" : Array.from({ length: exponent }, () => base).join(" x "); }
function lawMode(value: number) { return Math.round(value) === 0 ? "product" : Math.round(value) === 1 ? "quotient" : "power of power"; }
function logLawMode(value: number) { return Math.round(value) === 0 ? "product" : Math.round(value) === 1 ? "quotient" : "power"; }
function logBase(value: number, base: number) { return Math.log(value) / Math.log(base); }
function nearestPower10(value: number) { return `10^${Math.round(Math.log10(value))}`; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function highlight(active: string | null, ids: string[]) { return !!active && ids.includes(active); }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
