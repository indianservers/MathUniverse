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

const colors = { a: "#38bdf8", b: "#f97316", c: "#a855f7", ok: "#22c55e", warn: "#fde68a", muted: "#334155", red: "#fb7185" };
const dataKeys = ["x1", "x2", "x3", "x4", "x5", "x6"] as const;

export function MeanBalanceVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const data = dataValues(values);
  const m = mean(data);
  const positive = data.filter((x) => x >= m).reduce((sum, x) => sum + x - m, 0);
  const negative = data.filter((x) => x < m).reduce((sum, x) => sum + m - x, 0);
  return (
    <Frame label="Mean as balance point">
      <NumberLine y={345} />
      <g onMouseEnter={() => onHighlight("mean")} onMouseLeave={() => onHighlight(null)}>
        <line x1={scaleX(m)} y1="135" x2={scaleX(m)} y2="390" stroke={activeHighlight === "mean" ? colors.warn : colors.ok} strokeWidth="5" />
        <Text x={scaleX(m) - 26} y={124} text={`mean ${fmt(m)}`} small />
      </g>
      {data.map((x, index) => (
        <g key={index} onMouseEnter={() => onHighlight("deviations")} onMouseLeave={() => onHighlight(null)}>
          <line x1={scaleX(x)} y1={210 + index * 18} x2={scaleX(m)} y2={210 + index * 18} stroke={x >= m ? colors.a : colors.b} strokeWidth="3" opacity="0.75" />
          <circle cx={scaleX(x)} cy={330 - index * 22} r="13" fill={activeHighlight === "sum-x-i" ? colors.warn : colors.a} />
          <Text x={scaleX(x) - 10} y={330 - index * 22 + 5} text={`${index + 1}`} small />
          {index === 0 ? <DraggableHandle label="Drag first data point" position={{ x: scaleX(x), y: 430 }} axis="x" bounds={{ x: [axisX, axisX + axisW] }} onChange={(point) => onValueChange("x1", unscaleX(point.x))} /> : null}
        </g>
      ))}
      {toggles.labels ? <Info x={585} y={140} lines={[`data = ${data.join(", ")}`, `n = ${data.length}`, `sum = ${sum(data)}`, `mean = ${fmt(m)}`, `positive deviations = ${fmt(positive)}`, `negative deviations = ${fmt(negative)}`]} /> : null}
    </Frame>
  );
}

export function MedianQuartilesVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const data = dataValues(values);
  const sorted = [...data].sort((a, b) => a - b);
  const stats = quartiles(sorted);
  return (
    <Frame label="Median and quartiles">
      <NumberLine y={300} />
      <Text x={72} y={120} text={`raw data: ${data.join(", ")}`} small />
      <Text x={72} y={155} text={`sorted: ${sorted.join(", ")}`} small />
      {sorted.map((x, index) => <circle key={`${x}-${index}`} cx={scaleX(x)} cy={278} r="12" fill={colors.a} />)}
      <BoxPlot stats={stats} activeHighlight={activeHighlight} onHighlight={onHighlight} />
      <DraggableHandle label="Drag first data point" position={{ x: scaleX(data[0]), y: 430 }} axis="x" bounds={{ x: [axisX, axisX + axisW] }} onChange={(point) => onValueChange("x1", unscaleX(point.x))} />
      {toggles.labels ? <Info x={590} y={135} lines={[`min = ${stats.min}`, `Q1 = ${stats.q1}`, `median = ${stats.median}`, `Q3 = ${stats.q3}`, `max = ${stats.max}`, `IQR = ${stats.q3 - stats.q1}`]} /> : null}
    </Frame>
  );
}

export function VarianceStandardDeviationVisual({ values, toggles, onValueChange }: VisualState) {
  const data = dataValues(values);
  const m = mean(data);
  const deviations = data.map((x) => x - m);
  const squares = deviations.map((d) => d * d);
  const variance = mean(squares);
  return (
    <Frame label="Variance and standard deviation">
      <NumberLine y={330} />
      <line x1={scaleX(m)} y1="135" x2={scaleX(m)} y2="370" stroke={colors.ok} strokeWidth="5" />
      <Text x={scaleX(m) - 18} y={122} text="mu" small />
      {data.map((x, index) => {
        const squareH = Math.min(150, squares[index] * 3);
        return (
          <g key={index}>
            <circle cx={scaleX(x)} cy={300 - index * 15} r="11" fill={colors.a} />
            <line x1={scaleX(x)} y1={245 - index * 13} x2={scaleX(m)} y2={245 - index * 13} stroke={colors.b} strokeWidth="3" />
            <rect x={585 + index * 38} y={360 - squareH} width="26" height={Math.max(6, squareH)} fill={colors.c} opacity="0.85" />
          </g>
        );
      })}
      <DraggableHandle label="Drag first data point" position={{ x: scaleX(data[0]), y: 430 }} axis="x" bounds={{ x: [axisX, axisX + axisW] }} onChange={(point) => onValueChange("x1", unscaleX(point.x))} />
      {toggles.labels ? <Info x={585} y={135} lines={[`mean mu = ${fmt(m)}`, `deviations = ${deviations.map(fmt).join(", ")}`, `squared deviations = ${squares.map(fmt).join(", ")}`, `variance = ${fmt(variance)}`, `standard deviation = ${fmt(Math.sqrt(variance))}`]} /> : null}
    </Frame>
  );
}

export function HistogramFrequencyVisual({ values, toggles }: VisualState) {
  const data = dataValues(values);
  const binCount = Math.round(values.binCount);
  const bins = histogram(data, binCount);
  const maxFreq = Math.max(...bins.map((bin) => bin.count), 1);
  return (
    <Frame label="Histogram and frequency distribution">
      <NumberLine y={405} />
      {data.map((x, index) => <circle key={index} cx={scaleX(x)} cy={382 - (index % 3) * 16} r="8" fill={colors.a} />)}
      {bins.map((bin, index) => {
        const x = axisX + index * (axisW / binCount);
        const w = axisW / binCount - 8;
        const h = (bin.count / maxFreq) * 210;
        return <g key={index}><rect x={x + 4} y={365 - h} width={w} height={h} rx="8" fill={colors.b} opacity="0.86" /><Text x={x + 9} y={390} text={`${bin.start}-${bin.end}`} small /><Text x={x + w / 2} y={350 - h} text={`${bin.count}`} small /></g>;
      })}
      {toggles.labels ? <Info x={585} y={140} lines={[`bin count = ${binCount}`, `bin width = ${fmt(20 / binCount)}`, `frequencies = ${bins.map((bin) => bin.count).join(", ")}`, `total count = ${sum(bins.map((bin) => bin.count))}`, `n = ${data.length}`]} /> : null}
    </Frame>
  );
}

export function SamplingDistributionVisual({ values, toggles }: VisualState) {
  const sampleSize = Math.round(values.sampleSize);
  const samples = Math.round(values.samples);
  const population = [2, 4, 5, 7, 9, 11, 14, 16];
  const means = sampleMeans(population, sampleSize, samples);
  const latest = deterministicSample(population, sampleSize, samples);
  return (
    <Frame label="Sampling distribution of the mean">
      <Text x={75} y={120} text={`population: ${population.join(", ")}`} small />
      <NumberLine y={210} />
      {population.map((x, index) => <circle key={index} cx={scaleX(x)} cy={190} r="9" fill={colors.a} />)}
      <line x1={scaleX(mean(population))} y1="155" x2={scaleX(mean(population))} y2="230" stroke={colors.ok} strokeWidth="4" />
      <Text x={scaleX(mean(population)) - 30} y={145} text="population mean" small />
      <Text x={75} y={280} text={`latest sample: ${latest.join(", ")}; sample mean = ${fmt(mean(latest))}`} small />
      <DistributionDots values={means} y={390} color={colors.c} />
      {toggles.labels ? <Info x={585} y={135} lines={[`sample size = ${sampleSize}`, `number of samples = ${samples}`, `mean of sample means = ${fmt(mean(means))}`, `spread of sample means = ${fmt(std(means))}`, "center near population mean"]} /> : null}
    </Frame>
  );
}

export function NormalEmpiricalRuleVisual({ values, toggles, onValueChange }: VisualState) {
  const mu = values.mu;
  const sigma = values.sigma;
  const curve = normalPoints(mu, sigma);
  return (
    <Frame label="Normal distribution empirical rule">
      <path d={`${curve.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")}`} fill="none" stroke={colors.a} strokeWidth="5" />
      {[1, 2, 3].map((k) => <Region key={k} mu={mu} sigma={sigma} k={k} />)}
      <line x1={scaleX(mu)} y1="135" x2={scaleX(mu)} y2="405" stroke={colors.ok} strokeWidth="5" />
      <Text x={scaleX(mu) - 8} y={126} text="mu" small />
      <DraggableHandle label="Drag mean" position={{ x: scaleX(mu), y: 435 }} axis="x" bounds={{ x: [axisX, axisX + axisW] }} onChange={(point) => onValueChange("mu", unscaleX(point.x))} />
      <DraggableHandle label="Drag sigma" position={{ x: scaleX(mu + sigma), y: 455 }} axis="x" bounds={{ x: [scaleX(mu + 1), scaleX(mu + 6)] }} onChange={(point) => onValueChange("sigma", Math.max(1, unscaleX(point.x) - mu))} />
      {toggles.labels ? <Info x={585} y={140} lines={[`mu = ${fmt(mu)}`, `sigma = ${fmt(sigma)}`, `mu +/- sigma = ${fmt(mu - sigma)} to ${fmt(mu + sigma)}`, `mu +/- 2sigma = ${fmt(mu - 2 * sigma)} to ${fmt(mu + 2 * sigma)}`, `mu +/- 3sigma = ${fmt(mu - 3 * sigma)} to ${fmt(mu + 3 * sigma)}`, "68%, 95%, 99.7%"]} /> : null}
    </Frame>
  );
}

export function CorrelationScatterplotVisual({ values, toggles }: VisualState) {
  const rTarget = values.r;
  const noise = values.noise;
  const points = scatterPoints(rTarget, noise);
  const fit = leastSquares(points);
  return (
    <Frame label="Correlation and scatterplots">
      <PlotFrame />
      {points.map((point, index) => <circle key={index} cx={plotX(point.x)} cy={plotY(point.y)} r="7" fill={colors.a} />)}
      <line x1={plotX(0)} y1={plotY(fit.intercept)} x2={plotX(10)} y2={plotY(fit.slope * 10 + fit.intercept)} stroke={colors.ok} strokeWidth="4" />
      {toggles.labels ? <Info x={585} y={140} lines={[`r = ${fmt(correlation(points))}`, `target direction = ${rTarget >= 0 ? "positive" : "negative"}`, `spread/noise = ${fmt(noise)}`, "r ranges from -1 to +1", "correlation is association"]} /> : null}
    </Frame>
  );
}

export function RegressionLeastSquaresVisual({ values, toggles, onValueChange }: VisualState) {
  const points = regressionData();
  const slope = values.slope;
  const intercept = values.intercept;
  const best = leastSquares(points);
  const residuals = points.map((point) => point.y - (slope * point.x + intercept));
  const loss = sum(residuals.map((r) => r * r));
  const bestLoss = sum(points.map((point) => {
    const r = point.y - (best.slope * point.x + best.intercept);
    return r * r;
  }));
  return (
    <Frame label="Linear regression least squares">
      <PlotFrame />
      {points.map((point, index) => {
        const yHat = slope * point.x + intercept;
        const residual = point.y - yHat;
        return <g key={index}><line x1={plotX(point.x)} y1={plotY(point.y)} x2={plotX(point.x)} y2={plotY(yHat)} stroke={colors.red} strokeWidth="3" /><rect x={570 + index * 32} y={380 - Math.min(150, residual * residual * 3)} width="20" height={Math.max(5, Math.min(150, residual * residual * 3))} fill={colors.c} opacity="0.8" /><circle cx={plotX(point.x)} cy={plotY(point.y)} r="7" fill={colors.a} /></g>;
      })}
      <line x1={plotX(0)} y1={plotY(intercept)} x2={plotX(10)} y2={plotY(slope * 10 + intercept)} stroke={colors.warn} strokeWidth="5" />
      <line x1={plotX(0)} y1={plotY(best.intercept)} x2={plotX(10)} y2={plotY(best.slope * 10 + best.intercept)} stroke={colors.ok} strokeWidth="3" strokeDasharray="8 8" />
      <DraggableHandle label="Drag slope" position={{ x: 470, y: plotY(slope * 10 + intercept) }} axis="y" bounds={{ y: [120, 410] }} onChange={(point) => onValueChange("slope", (unplotY(point.y) - intercept) / 10)} />
      {toggles.labels ? <Info x={585} y={135} lines={[`slope = ${fmt(slope)}`, `intercept = ${fmt(intercept)}`, `total squared error = ${fmt(loss)}`, `least-squares loss = ${fmt(bestLoss)}`, "green dashed line is best fit"]} /> : null}
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

function NumberLine({ y }: { y: number }) {
  return <g><line x1={axisX} y1={y} x2={axisX + axisW} y2={y} stroke="#94a3b8" strokeWidth="4" />{[0, 5, 10, 15, 20].map((tick) => <g key={tick}><line x1={scaleX(tick)} y1={y - 9} x2={scaleX(tick)} y2={y + 9} stroke="#94a3b8" strokeWidth="3" /><Text x={scaleX(tick) - 8} y={y + 32} text={`${tick}`} small /></g>)}</g>;
}

function BoxPlot({ stats, activeHighlight, onHighlight }: { stats: Quartiles; activeHighlight: string | null; onHighlight: (token: string | null) => void }) {
  return (
    <g onMouseEnter={() => onHighlight("IQR")} onMouseLeave={() => onHighlight(null)}>
      <line x1={scaleX(stats.min)} y1="370" x2={scaleX(stats.max)} y2="370" stroke="#94a3b8" strokeWidth="4" />
      <rect x={scaleX(stats.q1)} y="330" width={scaleX(stats.q3) - scaleX(stats.q1)} height="80" rx="12" fill={activeHighlight === "IQR" ? colors.warn : colors.c} opacity="0.7" />
      {[
        ["Q1", stats.q1],
        ["median", stats.median],
        ["Q3", stats.q3],
      ].map(([label, value]) => <g key={label}><line x1={scaleX(Number(value))} y1="322" x2={scaleX(Number(value))} y2="418" stroke={label === "median" ? colors.ok : colors.warn} strokeWidth="4" /><Text x={scaleX(Number(value)) - 24} y={316} text={`${label}`} small /></g>)}
    </g>
  );
}

function DistributionDots({ values, y, color }: { values: number[]; y: number; color: string }) {
  const counts = new Map<number, number>();
  return <g>{values.map((value, index) => {
    const rounded = Math.round(value);
    const stack = counts.get(rounded) ?? 0;
    counts.set(rounded, stack + 1);
    return <circle key={index} cx={scaleX(value)} cy={y - stack * 13} r="6" fill={color} opacity="0.85" />;
  })}</g>;
}

function Region({ mu, sigma, k }: { mu: number; sigma: number; k: number }) {
  const x1 = scaleX(mu - k * sigma);
  const x2 = scaleX(mu + k * sigma);
  const labels = { 1: "68%", 2: "95%", 3: "99.7%" } as Record<number, string>;
  return <g><rect x={x1} y={125 + k * 34} width={x2 - x1} height={24} rx="10" fill={[colors.ok, colors.b, colors.c][k - 1]} opacity="0.45" /><Text x={(x1 + x2) / 2 - 18} y={143 + k * 34} text={labels[k]} small /></g>;
}

function PlotFrame() {
  return <g><rect x="85" y="115" width="390" height="315" rx="16" fill="#0f172a" stroke="#64748b" /><line x1="105" y1="405" x2="455" y2="405" stroke="#94a3b8" /><line x1="105" y1="405" x2="105" y2="135" stroke="#94a3b8" /></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  if (!lines.length) return null;
  return <g><rect x={x - 16} y={y - 28} width="292" height={Math.max(76, lines.length * 25 + 28)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number | string; text: string; small?: boolean }) {
  return <text x={x} y={y} className={`fill-white ${small ? "text-sm" : "text-base"} font-black`}>{text}</text>;
}

const axisX = 85;
const axisW = 390;
function scaleX(value: number) { return axisX + (Math.max(0, Math.min(20, value)) / 20) * axisW; }
function unscaleX(x: number) { return Math.round(((x - axisX) / axisW) * 20); }
function plotX(value: number) { return 105 + (value / 10) * 350; }
function plotY(value: number) { return 405 - (value / 12) * 270; }
function unplotY(y: number) { return ((405 - y) / 270) * 12; }

function dataValues(values: PhaseTwoValues) {
  return dataKeys.map((key) => Math.round(values[key]));
}

function sum(items: number[]) {
  return items.reduce((total, item) => total + item, 0);
}

function mean(items: number[]) {
  return items.length ? sum(items) / items.length : 0;
}

type Quartiles = { min: number; q1: number; median: number; q3: number; max: number };
function quartiles(sorted: number[]): Quartiles {
  const mid = median(sorted);
  return { min: sorted[0], q1: median(sorted.slice(0, 3)), median: mid, q3: median(sorted.slice(3)), max: sorted[sorted.length - 1] };
}

function median(items: number[]) {
  const sorted = [...items].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function std(items: number[]) {
  const m = mean(items);
  return Math.sqrt(mean(items.map((item) => (item - m) ** 2)));
}

function histogram(data: number[], binCount: number) {
  const width = 20 / binCount;
  return Array.from({ length: binCount }, (_, index) => {
    const start = Math.round(index * width);
    const end = Math.round((index + 1) * width);
    const count = data.filter((value) => index === binCount - 1 ? value >= start && value <= end : value >= start && value < end).length;
    return { start, end, count };
  });
}

function deterministicSample(population: number[], sampleSize: number, offset: number) {
  return Array.from({ length: sampleSize }, (_, index) => population[(index * 3 + offset) % population.length]);
}

function sampleMeans(population: number[], sampleSize: number, samples: number) {
  return Array.from({ length: samples }, (_, index) => mean(deterministicSample(population, sampleSize, index)));
}

function normalPoints(mu: number, sigma: number) {
  return Array.from({ length: 81 }, (_, index) => {
    const xVal = (index / 80) * 20;
    const z = (xVal - mu) / sigma;
    const density = Math.exp(-0.5 * z * z);
    return { x: scaleX(xVal), y: 400 - density * 245 };
  });
}

type Point = { x: number; y: number };
function scatterPoints(rTarget: number, noise: number): Point[] {
  return Array.from({ length: 12 }, (_, index) => {
    const x = 0.8 + index * 0.78;
    const wave = ((index * 7) % 5 - 2) * noise;
    const y = 5 + rTarget * (x - 5) + wave;
    return { x, y: Math.max(0.5, Math.min(11.5, y)) };
  });
}

function regressionData(): Point[] {
  return [{ x: 1, y: 2.2 }, { x: 2, y: 3.7 }, { x: 3, y: 3.9 }, { x: 4, y: 5.8 }, { x: 5, y: 5.1 }, { x: 6, y: 7.2 }, { x: 7, y: 7.8 }, { x: 8, y: 9.6 }];
}

function correlation(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const mx = mean(xs);
  const my = mean(ys);
  const numerator = sum(points.map((p) => (p.x - mx) * (p.y - my)));
  const denominator = Math.sqrt(sum(xs.map((x) => (x - mx) ** 2)) * sum(ys.map((y) => (y - my) ** 2)));
  return denominator ? numerator / denominator : 0;
}

function leastSquares(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const mx = mean(xs);
  const my = mean(ys);
  const numerator = sum(points.map((p) => (p.x - mx) * (p.y - my)));
  const denominator = sum(xs.map((x) => (x - mx) ** 2));
  const slope = denominator ? numerator / denominator : 0;
  return { slope, intercept: my - slope * mx };
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
