import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  arithmeticSum,
  arithmeticTerm,
  binomialCoefficient,
  fibonacci,
  fibonacciList,
  fibonacciSum,
  finiteGeometricSum,
  formatNumber,
  geometricTerm,
  harmonicPartialSum,
  infiniteGeometricSum,
  naturalNumberSum,
  oddNumberSum,
} from "../../utils/sequenceSeriesMath";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

const colors = ["#0ea5e9", "#22c55e", "#a855f7", "#f97316", "#14b8a6", "#6366f1"];
const phi = (1 + Math.sqrt(5)) / 2;

export function ArithmeticProgressionVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const d = values.d;
  const n = values.n;
  const terms = Array.from({ length: n }, (_, index) => arithmeticTerm(a, d, index + 1));
  const min = Math.min(...terms, 0);
  const max = Math.max(...terms, 1);
  const span = Math.max(1, max - min);
  const xFor = (value: number) => 100 + ((value - min) / span) * 620;
  return (
    <Frame label="Arithmetic progression equal step number line">
      <line x1="90" y1="285" x2="760" y2="285" stroke="#94a3b8" strokeWidth="4" />
      {terms.map((term, index) => {
        const token = index === 0 ? "a" : index === n - 1 ? "a-n" : "d";
        const x = xFor(term);
        return (
          <g key={`${term}-${index}`} onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}>
            {index > 0 ? <line x1={xFor(terms[index - 1])} y1="250" x2={x} y2="250" stroke={stroke("d", activeHighlight)} strokeWidth={width("d", activeHighlight)} markerEnd="url(#arrow)" /> : null}
            <circle cx={x} cy="285" r={activeHighlight === token ? 17 : 13} fill={activeHighlight === token ? "#fde68a" : colors[index % colors.length]} />
            <text x={x} y="323" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="900">{term}</text>
            {toggles.labels && index > 0 ? <text x={(xFor(terms[index - 1]) + x) / 2} y="235" textAnchor="middle" fill="#fed7aa" fontSize="12" fontWeight="900">+d</text> : null}
          </g>
        );
      })}
      {activeHighlight === "n-minus-1" ? <Text x={420} y={375} text={`${n - 1} jumps`} /> : null}
      {toggles.labels ? <Info x={540} y={390} lines={[`a = ${a}`, `d = ${d}`, `n - 1 = ${n - 1}`, `a_${n} = ${arithmeticTerm(a, d, n)}`]} /> : null}
      <DraggableHandle label="Drag first term" position={{ x: xFor(a), y: 350 }} axis="x" bounds={{ x: [90, 760] }} keyboardStep={18} onChange={(point) => onValueChange("a", Math.round(min + ((point.x - 100) / 620) * span))} />
      <DraggableHandle label="Drag common difference" position={{ x: Math.min(780, xFor(terms[Math.min(1, terms.length - 1)]) + 24), y: 225 }} axis="x" bounds={{ x: [120, 800] }} keyboardStep={18} onChange={(point) => onValueChange("d", Math.max(-8, Math.min(12, Math.round((point.x - xFor(a)) / Math.max(1, 620 / span)))))} />
    </Frame>
  );
}

export function ArithmeticProgressionSumVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const d = values.d;
  const n = values.n;
  const terms = Array.from({ length: n }, (_, index) => arithmeticTerm(a, d, index + 1));
  const last = terms[terms.length - 1];
  const pair = a + last;
  return (
    <Frame label="Arithmetic progression sum duplicate reverse pairing">
      <PatternBarSeries terms={terms} x={95} y={415} width={34} gap={12} maxHeight={220} activeIndex={activeHighlight === "a" ? 0 : activeHighlight === "l" ? n - 1 : -1} />
      {toggles.duplicate ? <PatternBarSeries terms={[...terms].reverse()} x={95} y={155} width={34} gap={12} maxHeight={110} reverse activeIndex={activeHighlight === "a-plus-l" ? 0 : -1} /> : null}
      {activeHighlight === "half" ? <Text x={370} y={470} text="duplicated, then divided by 2" /> : null}
      {toggles.labels ? <Info x={540} y={330} lines={[`first a = ${a}`, `last l = ${last}`, `pair sum = ${pair}`, `S_${n} = ${arithmeticSum(a, d, n)}`]} /> : null}
    </Frame>
  );
}

export function GeometricProgressionVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const r = values.r;
  const n = values.n;
  const terms = Array.from({ length: n }, (_, index) => geometricTerm(a, r, index + 1));
  return (
    <Frame label="Geometric progression repeated scaling bars">
      <PatternBarSeries terms={terms} x={90} y={415} width={38} gap={18} maxHeight={260} activeIndex={activeHighlight === "a" ? 0 : activeHighlight === "a-n" ? n - 1 : -1} />
      {toggles.labels ? <Info x={535} y={330} lines={[`a = ${a}`, `r = ${formatNumber(r)}`, `n - 1 multiplications = ${n - 1}`, `a_${n} = ${formatNumber(geometricTerm(a, r, n))}`]} /> : null}
      {activeHighlight === "r" ? <Text x={335} y={125} text="multiply by r each step" /> : null}
    </Frame>
  );
}

export function FiniteGeometricSeriesVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const r = values.r;
  const n = values.n;
  const terms = Array.from({ length: n }, (_, index) => geometricTerm(a, r, index + 1));
  const sum = finiteGeometricSum(a, r, n);
  return (
    <Frame label="Finite geometric series shifted cancellation">
      <PatternBarSeries terms={terms} x={90} y={330} width={34} gap={12} maxHeight={155} activeIndex={activeHighlight === "s-n" ? 0 : -1} />
      <PatternBarSeries terms={terms.map((term) => term * r)} x={120} y={455} width={34} gap={12} maxHeight={155} reverse activeIndex={activeHighlight === "r-s-n" ? 0 : -1} />
      <CancellationBand active={activeHighlight === "one-minus-r-n"} />
      {toggles.labels ? <Info x={540} y={320} lines={[`S_${n} = ${formatNumber(sum)}`, `rS_${n} shifts terms`, `remaining = a - ar^n`, Math.abs(r - 1) < 0.001 ? "r = 1 special case: S = na" : `divide by 1-r = ${formatNumber(1 - r)}`]} /> : null}
    </Frame>
  );
}

export function InfiniteGeometricConvergenceVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.a;
  const r = values.r;
  const n = values.n;
  const converges = Math.abs(r) < 1;
  const terms = Array.from({ length: n }, (_, index) => a * r ** index);
  const partial = terms.reduce((total, value) => total + value, 0);
  const limit = infiniteGeometricSum(a, r);
  return (
    <Frame label="Infinite geometric series convergence">
      <PatternBarSeries terms={terms.map(Math.abs)} x={90} y={415} width={32} gap={9} maxHeight={230} activeIndex={activeHighlight === "a" ? 0 : -1} />
      <ConvergencePanel x={540} y={180} lines={[`|r| ${converges ? "<" : ">="} 1`, `partial sum = ${formatNumber(partial)}`, converges ? `limit = ${formatNumber(limit)}` : "diverges", converges ? `gap = ${formatNumber(Math.abs(limit - partial))}` : "terms do not shrink enough"]} active={activeHighlight === "condition" || activeHighlight === "limit-factor"} />
      {toggles.labels && activeHighlight === "r" ? <Text x={270} y={126} text={`ratio r = ${formatNumber(r)}`} /> : null}
    </Frame>
  );
}

export function TriangularNumbersVisual({ values, toggles, activeHighlight }: VisualState) {
  return <TriangleDotVisual n={values.n} duplicate={toggles.duplicate} activeHighlight={activeHighlight} />;
}

export function SquareNumbersOddLayersVisual({ values, toggles, activeHighlight }: VisualState) {
  const n = values.n;
  const cell = Math.min(34, 330 / Math.max(n, 2));
  const x = 145;
  const y = 120;
  return (
    <Frame label="Square numbers from odd L-shaped layers">
      {Array.from({ length: n }).map((_, row) => Array.from({ length: n }).map((__, col) => {
        const layer = Math.max(row, col) + 1;
        const latest = layer === n;
        return <rect key={`${row}-${col}`} x={x + col * cell} y={y + row * cell} width={cell - 2} height={cell - 2} rx="5" fill={latest ? "#f97316" : colors[layer % colors.length]} stroke={activeHighlight === "odd-layers" && latest ? "#fde68a" : "#f8fafc"} strokeWidth={activeHighlight === "odd-layers" && latest ? "4" : "1.5"} />;
      }))}
      {activeHighlight === "n-square" ? <rect x={x - 5} y={y - 5} width={n * cell + 6} height={n * cell + 6} fill="none" stroke="#fde68a" strokeWidth="6" /> : null}
      {toggles.labels ? <Info x={540} y={330} lines={[`n = ${n}`, `latest odd layer = ${2 * n - 1}`, `total cells = ${oddNumberSum(n)}`, `square area = ${n}^2`]} /> : null}
    </Frame>
  );
}

export function FibonacciTilingVisual({ values, toggles, activeHighlight }: VisualState) {
  return <FibonacciTilingGuide n={values.n} spiral={false} labels={toggles.labels} activeHighlight={activeHighlight} />;
}

export function FibonacciSpiralVisual({ values, toggles, activeHighlight }: VisualState) {
  return <FibonacciTilingGuide n={values.n} spiral labels={toggles.labels} activeHighlight={activeHighlight} />;
}

export function FibonacciSumVisual({ values, toggles, activeHighlight }: VisualState) {
  const n = values.n;
  const fibs = fibonacciList(n);
  return (
    <Frame label="Sum of Fibonacci numbers missing one unit model">
      {fibs.map((value, index) => <Badge key={`${index}-${value}`} x={95 + (index % 6) * 68} y={150 + Math.floor(index / 6) * 64} text={String(value)} fill={activeHighlight === "fib-sum" ? "#fde68a" : "#0ea5e9"} darkText={activeHighlight === "fib-sum"} />)}
      <rect x="92" y="340" width="300" height="44" rx="10" fill={activeHighlight === "f-n-plus-2" ? "#fde68a" : "#22c55e"} opacity="0.9" />
      <rect x="92" y="340" width="24" height="44" rx="8" fill={activeHighlight === "minus-one" ? "#020617" : "#f97316"} stroke="#f8fafc" />
      <Text x={250} y={370} text={`F_${n + 2} = ${fibonacci(n + 2)}, remove 1`} small />
      {toggles.labels ? <Info x={530} y={330} lines={[`sum = ${fibonacciSum(n)}`, `F_${n + 2} - 1 = ${fibonacci(n + 2)} - 1`, "one unit gap explains -1"]} /> : null}
    </Frame>
  );
}

export function PascalTriangleVisual({ values, toggles, activeHighlight }: VisualState) {
  const n = values.n;
  const k = Math.min(values.k, n);
  const rows = Array.from({ length: n + 1 }, (_, row) => Array.from({ length: row + 1 }, (__, col) => binomialCoefficient(row, col)));
  return (
    <Frame label="Pascal triangle binomial coefficients">
      {rows.map((row, rowIndex) => row.map((value, col) => {
        const selected = rowIndex === n && col === k;
        const rowActive = activeHighlight === "row-n" && rowIndex === n;
        return <Badge key={`${rowIndex}-${col}`} x={435 + (col - rowIndex / 2) * 62} y={98 + rowIndex * 39} text={String(value)} fill={selected || rowActive ? "#f97316" : "#6366f1"} small />;
      }))}
      {toggles.labels ? <Info x={540} y={410} lines={[`row n = ${n}`, `selected k = ${k}`, `C(${n}, ${k}) = ${binomialCoefficient(n, k)}`, "interior entry = two above"]} /> : null}
      {activeHighlight === "expansion" ? <Text x={280} y={470} text={`(a+b)^${n} uses this row`} /> : null}
    </Frame>
  );
}

export function InductionDominoVisual({ values, toggles, activeHighlight }: VisualState) {
  const n = values.n;
  return (
    <Frame label="Visual induction domino chain">
      {Array.from({ length: n }, (_, index) => {
        const x = 90 + index * Math.min(31, 650 / n);
        const highlighted = (activeHighlight === "base-case" && index === 0) || (activeHighlight === "inductive-step" && index > 0 && index < 5) || activeHighlight === "all-n";
        return (
          <g key={index} transform={`rotate(${Math.min(index * 3.2, 42)} ${x + 10} 290)`}>
            <rect x={x} y="205" width="20" height="105" rx="6" fill={highlighted ? "#fde68a" : index === 0 ? "#f97316" : "#0ea5e9"} />
          </g>
        );
      })}
      {toggles.labels ? <Info x={520} y={340} lines={["base case starts the chain", "P(k) implies P(k+1)", `proven range reaches ${n}`, "not just many examples"]} /> : null}
    </Frame>
  );
}

export function HarmonicGrowthVisual({ values, toggles, activeHighlight }: VisualState) {
  const groups = values.groups;
  const terms = Math.min(128, 2 ** groups);
  const shown = Math.min(48, terms);
  const lower = 1 + Math.max(0, groups - 1) * 0.5;
  return (
    <Frame label="Harmonic series grouped lower bound divergence">
      {Array.from({ length: shown }, (_, index) => {
        const term = 1 / (index + 1);
        const group = Math.floor(Math.log2(index + 1));
        const active = activeHighlight === "one-over-n" || activeHighlight === "group-half" || activeHighlight === "diverges";
        return <rect key={index} x={75 + index * 15} y={410 - term * 245} width="11" height={term * 245} fill={active ? "#fde68a" : colors[group % colors.length]} opacity="0.92" />;
      })}
      {toggles.labels ? <Info x={535} y={300} lines={[`terms grouped to ${terms}`, `partial sum ~= ${formatNumber(harmonicPartialSum(terms))}`, `group lower bound >= ${formatNumber(lower)}`, "small terms still add without bound"]} /> : null}
    </Frame>
  );
}

function PatternBarSeries({ terms, x, y, width: barWidth, gap, maxHeight, reverse = false, activeIndex = -1 }: { terms: number[]; x: number; y: number; width: number; gap: number; maxHeight: number; reverse?: boolean; activeIndex?: number }) {
  const max = Math.max(...terms.map(Math.abs), 1);
  return (
    <>
      {terms.map((term, index) => {
        const h = (Math.abs(term) / max) * maxHeight;
        const active = activeIndex === index;
        return (
          <g key={`${term}-${index}`}>
            <rect x={x + index * (barWidth + gap)} y={reverse ? y : y - h} width={barWidth} height={h} rx="6" fill={active ? "#fde68a" : colors[index % colors.length]} stroke="#f8fafc" strokeWidth={active ? "4" : "1.5"} />
            <text x={x + index * (barWidth + gap) + barWidth / 2} y={reverse ? y + h + 18 : y + 20} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="900">{formatNumber(term)}</text>
          </g>
        );
      })}
    </>
  );
}

function TriangleDotVisual({ n, duplicate, activeHighlight }: { n: number; duplicate: boolean; activeHighlight: string | null }) {
  const gap = Math.min(30, 330 / Math.max(n + 1, 4));
  const dot = Math.max(4, Math.min(7, gap * 0.24));
  const originX = 150;
  const originY = 420;
  const dots = Array.from({ length: n }).flatMap((_, col) => Array.from({ length: col + 1 }, (__, row) => ({ x: originX + col * gap, y: originY - row * gap, key: `${col}-${row}` })));
  const copy = Array.from({ length: n }).flatMap((_, col) => Array.from({ length: n - col }, (__, row) => ({ x: originX + col * gap, y: originY - (col + 1 + row) * gap, key: `d-${col}-${row}` })));
  return (
    <Frame label="Triangular number dots duplicated into rectangle">
      {dots.map((item) => <circle key={item.key} cx={item.x} cy={item.y} r={dot} fill={activeHighlight === "t-n" ? "#fde68a" : "#22d3ee"} />)}
      {duplicate ? copy.map((item) => <circle key={item.key} cx={item.x} cy={item.y} r={dot} fill="#fb923c" opacity="0.92" />) : null}
      {duplicate ? <rect x={originX - gap / 2} y={originY - n * gap - gap / 2} width={n * gap} height={(n + 1) * gap} fill="none" stroke={stroke("n-plus-1", activeHighlight)} strokeWidth={width("n-plus-1", activeHighlight)} /> : null}
      <Info x={540} y={330} lines={[`n rows = ${n}`, `dots = ${naturalNumberSum(n)}`, `rectangle = ${n} x ${n + 1}`, "one triangle is half"]} />
    </Frame>
  );
}

function FibonacciTilingGuide({ n, spiral, labels, activeHighlight }: { n: number; spiral: boolean; labels: boolean; activeHighlight: string | null }) {
  const fibs = fibonacciList(n);
  const max = Math.max(...fibs);
  const scale = 210 / max;
  let x = 110;
  let y = 305;
  return (
    <Frame label={spiral ? "Fibonacci spiral approximation" : "Fibonacci recurrence tiling"}>
      {fibs.map((size, index) => {
        const side = Math.max(12, size * scale);
        const active = (activeHighlight === "f-n" && index === fibs.length - 1) || activeHighlight === "quarter-arcs";
        const item = (
          <g key={`${index}-${size}`}>
            <rect x={x} y={y - side} width={side} height={side} fill={active ? "#fde68a" : colors[index % colors.length]} opacity="0.82" stroke="#f8fafc" />
            {spiral ? <path d={`M ${x} ${y} Q ${x} ${y - side} ${x + side} ${y - side}`} fill="none" stroke={active ? "#020617" : "#f8fafc"} strokeWidth="3" /> : null}
            {labels && side > 18 ? <text x={x + side / 2} y={y - side / 2 + 4} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="900">{size}</text> : null}
          </g>
        );
        x += index % 2 === 0 ? side : 0;
        y += index % 2 === 1 ? side : 0;
        return item;
      })}
      <Info x={545} y={330} lines={spiral ? [`ratio = ${formatNumber(fibonacci(n) / fibonacci(n - 1))}`, `phi ~= ${formatNumber(phi)}`, "quarter arcs approximate"] : [`F_${n} = ${fibonacci(n)}`, `previous two: ${fibonacci(n - 1)}, ${fibonacci(n - 2)}`, "next equals previous two"]} />
    </Frame>
  );
}

function CancellationBand({ active }: { active: boolean }) {
  return <rect x="125" y="245" width="300" height="56" rx="12" fill={active ? "#fde68a" : "#334155"} opacity="0.35" stroke={active ? "#fde68a" : "#64748b"} />;
}

function ConvergencePanel({ x, y, lines, active }: { x: number; y: number; lines: string[]; active: boolean }) {
  return <g><rect x={x - 18} y={y - 34} width="320" height={Math.max(82, lines.length * 28 + 24)} rx="16" fill={active ? "#422006" : "#0f172a"} opacity="0.94" stroke={active ? "#fde68a" : "#334155"} />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 28} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#fed7aa" /></marker></defs><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function Badge({ x, y, text, fill, small = false, darkText = false }: { x: number; y: number; text: string; fill: string; small?: boolean; darkText?: boolean }) {
  const w = small ? 44 : 54;
  const h = small ? 26 : 44;
  return <g><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="9" fill={fill} /><text x={x} y={y + 5} textAnchor="middle" fill={darkText ? "#0f172a" : "#f8fafc"} fontSize="12" fontWeight="900">{text}</text></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="320" height={Math.max(82, lines.length * 28 + 24)} rx="16" fill="#0f172a" opacity="0.94" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 28} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill="#f8fafc" fontSize={small ? "15" : "22"} fontWeight="900">{text}</text>;
}

function stroke(token: string, active: string | null) {
  return active === token ? "#fde68a" : "#f8fafc";
}

function width(token: string, active: string | null) {
  return active === token ? "7" : "3";
}
