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

const scale = 34;
const round = (value: number) => Math.round(value * 100) / 100;

export function DistributiveGridVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const { a, b, c, d } = values;
  const x = 130;
  const y = 120;
  const aw = a * scale;
  const bw = b * scale;
  const ch = c * scale;
  const dh = d * scale;
  return (
    <Frame label="Distributive law area model">
      <Tile x={x} y={y} w={aw} h={ch} token="ac" label="ac" active={activeHighlight} onHighlight={onHighlight} fill="#0ea5e9" />
      <Tile x={x} y={y + ch} w={aw} h={dh} token="ad" label="ad" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x + aw} y={y} w={bw} h={ch} token="bc" label="bc" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <Tile x={x + aw} y={y + ch} w={bw} h={dh} token="bd" label="bd" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <rect x={x} y={y} width={aw + bw} height={ch + dh} fill="none" stroke={strokeFor("full", activeHighlight)} strokeWidth={widthFor("full", activeHighlight)} onMouseEnter={() => onHighlight("full")} onMouseLeave={() => onHighlight(null)} />
      {toggles.labels ? <Info x={560} y={260} lines={[`full area = ${(a + b) * (c + d)}`, `ac + ad + bc + bd`, `${a * c} + ${a * d} + ${b * c} + ${b * d}`]} /> : null}
      <DraggableHandle label="Drag vertical split" position={{ x: x + aw, y: y - 28 }} axis="x" bounds={{ x: [x + 2 * scale, x + 7 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - x) / scale))} />
      <DraggableHandle label="Drag horizontal split" position={{ x: x - 28, y: y + ch }} axis="y" bounds={{ y: [y + 2 * scale, y + 7 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("c", Math.round((point.y - y) / scale))} />
    </Frame>
  );
}

export function ThreeTermSquareVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const { a, b, c } = values;
  const x = 120;
  const y = 90;
  const parts = [a, b, c].map((value) => value * scale);
  const labels = [["a2", "ab", "ca"], ["ab", "b2", "bc"], ["ca", "bc", "c2"]];
  const names = [["a^2", "ab", "ca"], ["ab", "b^2", "bc"], ["ca", "bc", "c^2"]];
  return (
    <Frame label="Three-term square tile model">
      <GridTiles x={x} y={y} widths={parts} heights={parts} labels={labels} names={names} active={activeHighlight} onHighlight={onHighlight} />
      <rect x={x} y={y} width={parts.reduce(sum, 0)} height={parts.reduce(sum, 0)} fill="none" stroke={strokeFor("full", activeHighlight)} strokeWidth={widthFor("full", activeHighlight)} onMouseEnter={() => onHighlight("full")} onMouseLeave={() => onHighlight(null)} />
      {toggles.labels ? <Info x={560} y={260} lines={[`full square = ${(a + b + c) ** 2}`, `squares = ${a ** 2 + b ** 2 + c ** 2}`, `mixed = ${2 * a * b + 2 * b * c + 2 * c * a}`]} /> : null}
      <DraggableHandle label="Drag a split" position={{ x: x + parts[0], y: y - 28 }} axis="x" bounds={{ x: [x + 2 * scale, x + 6 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - x) / scale))} />
      <DraggableHandle label="Drag b split" position={{ x: x + parts[0] + parts[1], y: y - 28 }} axis="x" bounds={{ x: [x + parts[0] + scale, x + parts[0] + 5 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.max(1, Math.round((point.x - x - parts[0]) / scale)))} />
    </Frame>
  );
}

export function CompletingSquareVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const { x: xValue, b } = values;
  const half = b / 2;
  const x0 = 150;
  const y0 = 140;
  const xs = xValue * scale;
  const hs = half * scale;
  return (
    <Frame label="Completing the square tile model">
      <Tile x={x0} y={y0} w={xs} h={xs} token="x2" label="x^2" active={activeHighlight} onHighlight={onHighlight} fill="#0ea5e9" />
      <Tile x={x0 + xs} y={y0} w={hs} h={xs} token="bx" label="x(b/2)" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x0} y={y0 + xs} w={xs} h={hs} token="bx" label="x(b/2)" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x0 + xs} y={y0 + xs} w={hs} h={hs} token="corner" label="(b/2)^2" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" opacity={0.52} />
      <rect x={x0} y={y0} width={xs + hs} height={xs + hs} fill="none" stroke={strokeFor("complete", activeHighlight)} strokeWidth={widthFor("complete", activeHighlight)} />
      {toggles.labels ? <Info x={560} y={260} lines={[`b/2 = ${half}`, `missing corner = ${round(half ** 2)}`, `completed square = ${round((xValue + half) ** 2)}`]} /> : null}
      <DraggableHandle label="Drag b half-strip" position={{ x: x0 + xs + hs, y: y0 + xs + hs }} axis="xy" bounds={{ x: [x0 + xs + scale, x0 + xs + 4 * scale], y: [y0 + xs + scale, y0 + xs + 4 * scale] }} snapToGrid={scale / 2} keyboardStep={scale / 2} onChange={(point) => onValueChange("b", round(((point.x - x0 - xs) / scale) * 2))} />
    </Frame>
  );
}

export function QuadraticFactorVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const { x: xv, m, n } = values;
  const x0 = 145;
  const y0 = 115;
  const xs = xv * scale;
  const ms = m * scale;
  const ns = n * scale;
  return (
    <Frame label="Quadratic factorization area model">
      <Tile x={x0} y={y0} w={xs} h={xs} token="x2" label="x^2" active={activeHighlight} onHighlight={onHighlight} fill="#0ea5e9" />
      <Tile x={x0 + xs} y={y0} w={ms} h={xs} token="mx" label="mx" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x0} y={y0 + xs} w={xs} h={ns} token="nx" label="nx" active={activeHighlight} onHighlight={onHighlight} fill="#a855f7" />
      <Tile x={x0 + xs} y={y0 + xs} w={ms} h={ns} token="mn" label="mn" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <rect x={x0} y={y0} width={xs + ms} height={xs + ns} fill="none" stroke={strokeFor("factors", activeHighlight)} strokeWidth={widthFor("factors", activeHighlight)} />
      {toggles.labels ? <Info x={560} y={260} lines={[`p = m+n = ${m + n}`, `q = mn = ${m * n}`, `(x+${m})(x+${n})`, `area = ${(xv + m) * (xv + n)}`]} /> : null}
      <DraggableHandle label="Drag m" position={{ x: x0 + xs + ms, y: y0 - 28 }} axis="x" bounds={{ x: [x0 + xs + scale, x0 + xs + 5 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("m", Math.round((point.x - x0 - xs) / scale))} />
      <DraggableHandle label="Drag n" position={{ x: x0 - 28, y: y0 + xs + ns }} axis="y" bounds={{ y: [y0 + xs + scale, y0 + xs + 5 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("n", Math.round((point.y - y0 - xs) / scale))} />
    </Frame>
  );
}

export function PerfectSquareRecognitionVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const { x: xv, a } = values;
  const x0 = 155;
  const y0 = 120;
  const xs = xv * scale;
  const as = a * scale;
  return (
    <Frame label="Perfect square trinomial recognition tile model">
      <Tile x={x0} y={y0} w={xs} h={xs} token="x2" label="x^2" active={activeHighlight} onHighlight={onHighlight} fill="#0ea5e9" />
      <Tile x={x0 + xs} y={y0} w={as} h={xs} token="twoax" label="ax" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x0} y={y0 + xs} w={xs} h={as} token="twoax" label="ax" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={x0 + xs} y={y0 + xs} w={as} h={as} token="a2" label="a^2" active={activeHighlight} onHighlight={onHighlight} fill="#f97316" />
      <rect x={x0} y={y0} width={xs + as} height={xs + as} fill="none" stroke={strokeFor("complete", activeHighlight)} strokeWidth={widthFor("complete", activeHighlight)} />
      {toggles.labels ? <Info x={560} y={245} lines={[`first term square: x^2`, `last term square: a^2`, `middle term: 2ax = ${2 * a * xv}`, `side = x + a = ${xv + a}`]} /> : null}
      <DraggableHandle label="Drag a split" position={{ x: x0 + xs + as, y: y0 + xs + as }} axis="xy" bounds={{ x: [x0 + xs + scale, x0 + xs + 5 * scale], y: [y0 + xs + scale, y0 + xs + 5 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - x0 - xs) / scale))} />
    </Frame>
  );
}

export function CubeSumVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  return <CubeBlockSchematic values={values} toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={onValueChange} mode="sum" />;
}

export function CubeDifferenceVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  return <CubeBlockSchematic values={values} toggles={toggles} activeHighlight={activeHighlight} onHighlight={onHighlight} onValueChange={onValueChange} mode="difference" />;
}

export function SumDifferenceProductVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = Math.min(values.b, a - 1);
  const x = 140;
  const y = 120;
  const width = (a + b) * scale;
  const height = (a - b) * scale;
  return (
    <Frame label="Sum and difference product tile model">
      <Tile x={x} y={y} w={width} h={height} token="rect" label="(a+b)(a-b)" active={activeHighlight} onHighlight={onHighlight} fill="#0ea5e9" />
      <Tile x={520} y={130} w={a * 24} h={a * 24} token="a2" label="a^2" active={activeHighlight} onHighlight={onHighlight} fill="#22c55e" />
      <Tile x={520 + a * 24 - b * 24} y={130 + a * 24 - b * 24} w={b * 24} h={b * 24} token="b2" label="b^2" active={activeHighlight} onHighlight={onHighlight} fill="#020617" />
      {toggles.labels ? <Info x={545} y={360} lines={[`a+b = ${a + b}`, `a-b = ${a - b}`, `rectangle = ${(a + b) * (a - b)}`, `a^2-b^2 = ${a ** 2 - b ** 2}`]} /> : null}
      <DraggableHandle label="Drag b split" position={{ x: 520 + a * 24 - b * 24, y: 130 + a * 24 - b * 24 }} axis="xy" bounds={{ x: [520 + 24, 520 + a * 24 - 24], y: [130 + 24, 130 + a * 24 - 24] }} snapToGrid={24} keyboardStep={24} onChange={(point) => onValueChange("b", Math.max(1, Math.min(a - 1, Math.round((520 + a * 24 - point.x) / 24))))} />
    </Frame>
  );
}

function CubeBlockSchematic({ values, toggles, activeHighlight, onHighlight, onValueChange, mode }: Pick<VisualState, "values" | "toggles" | "activeHighlight" | "onHighlight" | "onValueChange"> & { mode: "sum" | "difference" }) {
  const a = values.a;
  const b = mode === "difference" ? Math.min(values.b, a - 1) : values.b;
  const terms = mode === "sum"
    ? [["a3", "a^3", a ** 3, "#0ea5e9"], ["a2b", "3a^2b", 3 * a * a * b, "#22c55e"], ["ab2", "3ab^2", 3 * a * b * b, "#a855f7"], ["b3", "b^3", b ** 3, "#f97316"]]
    : [["a3", "a^3", a ** 3, "#0ea5e9"], ["minus-a2b", "-3a^2b", -3 * a * a * b, "#ef4444"], ["plus-ab2", "+3ab^2", 3 * a * b * b, "#22c55e"], ["minus-b3", "-b^3", -(b ** 3), "#f97316"]];
  return (
    <Frame label={mode === "sum" ? "Cube of a sum block model" : "Cube of a difference signed block model"}>
      {terms.map(([token, label, value, fill], index) => <Block key={token} x={130 + index * 145} y={210 - index * 16} token={String(token)} label={String(label)} value={Number(value)} fill={String(fill)} active={activeHighlight} onHighlight={onHighlight} />)}
      {toggles.labels ? <Info x={555} y={340} lines={[`a = ${a}`, `b = ${b}`, mode === "sum" ? `total = ${(a + b) ** 3}` : `final = ${(a - b) ** 3}`, "mixed terms come from orientations"]} /> : null}
      <DraggableHandle label="Drag b" position={{ x: 190 + b * 28, y: 455 }} axis="x" bounds={{ x: [190 + 28, 190 + (mode === "difference" ? (a - 1) * 28 : 5 * 28)] }} snapToGrid={28} keyboardStep={28} onChange={(point) => onValueChange("b", Math.max(1, Math.round((point.x - 190) / 28)))} />
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function GridTiles({ x, y, widths, heights, labels, names, active, onHighlight }: { x: number; y: number; widths: number[]; heights: number[]; labels: string[][]; names: string[][]; active: string | null; onHighlight: (token: string | null) => void }) {
  let cy = y;
  return <>{heights.map((h, row) => {
    let cx = x;
    const cells = widths.map((w, col) => {
      const cell = <Tile key={`${row}-${col}`} x={cx} y={cy} w={w} h={h} token={labels[row][col]} label={names[row][col]} active={active} onHighlight={onHighlight} fill={["#0ea5e9", "#22c55e", "#a855f7", "#f97316", "#14b8a6"][((row * 3) + col) % 5]} />;
      cx += w;
      return cell;
    });
    cy += h;
    return cells;
  })}</>;
}

function Tile({ x, y, w, h, token, label, active, onHighlight, fill, opacity = 0.76 }: { x: number; y: number; w: number; h: number; token: string; label: string; active: string | null; onHighlight: (token: string | null) => void; fill: string; opacity?: number }) {
  const highlighted = active === token || (token === "ab" && active === "twoab") || (token === "bc" && active === "twobc") || (token === "ca" && active === "twoca");
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><rect x={x} y={y} width={w} height={h} fill={fill} opacity={highlighted ? 0.96 : opacity} stroke={highlighted ? "#fde68a" : "#f8fafc"} strokeWidth={highlighted ? 6 : 2} /><text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="900">{label}</text></g>;
}

function Block({ x, y, token, label, value, fill, active, onHighlight }: { x: number; y: number; token: string; label: string; value: number; fill: string; active: string | null; onHighlight: (token: string | null) => void }) {
  const highlighted = active === token;
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><polygon points={`${x},${y} ${x + 88},${y - 30} ${x + 142},${y} ${x + 54},${y + 30}`} fill={fill} opacity={highlighted ? "0.96" : "0.72"} stroke={highlighted ? "#fde68a" : "#f8fafc"} strokeWidth={highlighted ? "6" : "2"} /><polygon points={`${x + 54},${y + 30} ${x + 142},${y} ${x + 142},${y + 82} ${x + 54},${y + 112}`} fill={fill} opacity="0.52" stroke="#f8fafc" strokeWidth="2" /><text x={x + 72} y={y + 70} textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="900">{label}</text><text x={x + 72} y={y + 92} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="800">{value}</text></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="310" height={Math.max(82, lines.length * 27 + 24)} rx="16" fill="#0f172a" opacity="0.93" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 27} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function strokeFor(token: string, active: string | null) {
  return active === token ? "#fde68a" : "#f8fafc";
}

function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "3";
}

function sum(total: number, value: number) {
  return total + value;
}
