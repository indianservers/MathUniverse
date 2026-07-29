import { ArrowLeft, BookOpen, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import TopicHeader from "../../../components/ui/TopicHeader";
import { statisticsLearningContent } from "../data/learningContent";
import LearningExpansion from "./LearningExpansion";

export type ProbabilityStatisticsPhaseTwoPageId = "sampling" | "inference" | "regression";

type PageConfig = {
  id: ProbabilityStatisticsPhaseTwoPageId;
  title: string;
  subtitle: string;
  formula: string;
  difficulty: string;
};

const configs: Record<ProbabilityStatisticsPhaseTwoPageId, PageConfig> = {
  sampling: {
    id: "sampling",
    title: "Sampling Distributions Studio",
    subtitle: "Watch noisy samples settle into standard errors, confidence bands, and Central Limit Theorem shape.",
    formula: "SE = sigma/sqrt(n),  z = (xbar - mu)/(sigma/sqrt(n))",
    difficulty: "Phase 2",
  },
  inference: {
    id: "inference",
    title: "Inference & Hypothesis Testing Studio",
    subtitle: "Connect confidence intervals, p-values, rejection regions, error types, and sample-size pressure.",
    formula: "z = (phat - p0)/sqrt(p0(1-p0)/n)",
    difficulty: "Phase 2",
  },
  regression: {
    id: "regression",
    title: "Regression Diagnostics Studio",
    subtitle: "Fit a trend, inspect residuals, compare signal/noise, and see why model checks matter.",
    formula: "yhat = b0 + b1x,  R^2 = 1 - SSE/SST",
    difficulty: "Phase 2",
  },
};

export default function ProbabilityStatisticsPhaseTwoPage({ page }: { page: ProbabilityStatisticsPhaseTwoPageId }) {
  const config = configs[page];
  return (
    <div className="space-y-6">
      <TopicHeader
        title={config.title}
        subtitle={config.subtitle}
        difficulty={config.difficulty}
        estimatedMinutes={15}
        formula={{ title: "Core formula", formula: config.formula, explanation: "The sliders update the statistic, uncertainty, decision region, or fit quality directly." }}
      />
      <div className="flex flex-wrap gap-2">
        <Link className="mini-chip" to="/probability-statistics/module"><ArrowLeft className="h-3.5 w-3.5" /> Module</Link>
        <Link className="mini-chip" to="/probability-statistics/distributions/normal"><Sigma className="h-3.5 w-3.5" /> Normal model</Link>
      </div>
      {page === "sampling" && <SamplingStudio />}
      {page === "inference" && <InferenceStudio />}
      {page === "regression" && <RegressionStudio />}
    </div>
  );
}

function SamplingStudio() {
  const [sampleSize, setSampleSize] = useState(36);
  const [populationSigma, setPopulationSigma] = useState(12);
  const [samples, setSamples] = useState(60);
  const [skew, setSkew] = useState(0.4);
  const model = useMemo(() => {
    const n = Math.max(1, Math.round(sampleSize));
    const se = populationSigma / Math.sqrt(n);
    const rawSpread = populationSigma;
    const capture = normalCdf(1.96) - normalCdf(-1.96);
    const means = Array.from({ length: Math.round(samples) }, (_, index) => {
      const angle = index * 1.73;
      return 50 + se * (Math.sin(angle) + 0.55 * Math.sin(angle * 2.1 + skew * 2) + 0.25 * Math.cos(angle * 3.2)) * 1.9;
    });
    return {
      n,
      se,
      capture,
      means,
      population: curve(-4, 4, 100, (x) => 0.7 * normalPdf(x, -skew * 1.4, 1.1) + 0.3 * normalPdf(x, 1.8 + skew, 0.55 + skew * 0.35)),
      sampling: curve(50 - 4 * se, 50 + 4 * se, 100, (x) => normalPdf(x, 50, se)),
      rawSpread,
    };
  }, [populationSigma, sampleSize, samples, skew]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Sampling Controls" description="Increase n to shrink the standard error and tighten the cloud of sample means.">
          <SliderGroup>
            <SliderControl density="compact" label="Sample size n" value={sampleSize} min={4} max={200} step={1} onChange={setSampleSize} />
            <SliderControl density="compact" label="Population sigma" value={populationSigma} min={2} max={30} step={0.5} onChange={setPopulationSigma} />
            <SliderControl density="compact" label="Sample runs" value={samples} min={20} max={160} step={1} onChange={setSamples} />
            <SliderControl density="compact" label="Population skew" value={skew} min={0} max={1} step={0.05} onChange={setSkew} />
          </SliderGroup>
          <MetricGrid items={[
            ["Standard error", fmt(model.se)],
            ["95% CI half width", fmt(1.96 * model.se)],
            ["CLT capture", `${Math.round(model.capture * 100)}%`],
            ["Raw sigma", fmt(model.rawSpread)],
          ]} />
        </SectionCard>
        <VisualFrame title="Population to Sampling Distribution">
          <SamplingSvg population={model.population} sampling={model.sampling} means={model.means} se={model.se} />
        </VisualFrame>
      </section>
      <TheoryBlock
        cards={[
          ["Sampling distribution", "The sampling distribution is the distribution of a statistic over repeated samples, not the distribution of raw data."],
          ["Standard error", "Standard error measures how much a sample statistic varies. For means, it shrinks like 1/sqrt(n)."],
          ["Central Limit Theorem", "For many populations, sample means become approximately normal as n grows, even when the population is skewed."],
        ]}
      />
      <LearningExpansion content={statisticsLearningContent.sampling} />
    </>
  );
}

function InferenceStudio() {
  const [pHat, setPHat] = useState(0.58);
  const [p0, setP0] = useState(0.5);
  const [n, setN] = useState(120);
  const [alpha, setAlpha] = useState(0.05);
  const model = useMemo(() => {
    const size = Math.round(n);
    const seNull = Math.sqrt((p0 * (1 - p0)) / size);
    const seEstimate = Math.sqrt((pHat * (1 - pHat)) / size);
    const z = (pHat - p0) / seNull;
    const pValue = 2 * (1 - normalCdf(Math.abs(z)));
    const zCrit = alpha <= 0.01 ? 2.576 : alpha <= 0.05 ? 1.96 : 1.645;
    const ciLow = Math.max(0, pHat - zCrit * seEstimate);
    const ciHigh = Math.min(1, pHat + zCrit * seEstimate);
    return { size, seNull, z, pValue, zCrit, ciLow, ciHigh, reject: pValue < alpha };
  }, [alpha, n, p0, pHat]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Inference Controls" description="Move the sample evidence and significance level to see how the decision changes.">
          <SliderGroup>
            <SliderControl density="compact" label="Sample proportion phat" value={pHat} min={0.05} max={0.95} step={0.01} onChange={setPHat} />
            <SliderControl density="compact" label="Null proportion p0" value={p0} min={0.05} max={0.95} step={0.01} onChange={setP0} />
            <SliderControl density="compact" label="Sample size n" value={n} min={30} max={600} step={5} onChange={setN} />
            <SliderControl density="compact" label="Alpha" value={alpha} min={0.01} max={0.1} step={0.01} onChange={setAlpha} />
          </SliderGroup>
          <MetricGrid items={[
            ["z statistic", fmt(model.z)],
            ["p-value", fmt(model.pValue)],
            ["Decision", model.reject ? "Reject H0" : "Do not reject"],
            ["CI", `${fmt(model.ciLow)} to ${fmt(model.ciHigh)}`],
          ]} />
        </SectionCard>
        <VisualFrame title="p-value and Confidence Interval">
          <InferenceSvg z={model.z} zCrit={model.zCrit} pHat={pHat} p0={p0} ciLow={model.ciLow} ciHigh={model.ciHigh} reject={model.reject} />
        </VisualFrame>
      </section>
      <TheoryBlock
        cards={[
          ["Confidence interval", "A confidence interval gives a range of plausible parameter values under the sampling method, not a probability that this fixed interval contains the fixed parameter."],
          ["p-value", "A p-value is the probability of data this extreme or more extreme if the null model is true."],
          ["Power", "Power rises when sample size grows, noise falls, alpha rises, or the true effect moves farther from the null."],
        ]}
      />
      <LearningExpansion content={statisticsLearningContent.inference} />
    </>
  );
}

function RegressionStudio() {
  const [trueSlope, setTrueSlope] = useState(1.4);
  const [noise, setNoise] = useState(1.2);
  const [outlier, setOutlier] = useState(0.4);
  const [curvature, setCurvature] = useState(0.1);
  const model = useMemo(() => {
    const points = Array.from({ length: 18 }, (_, index) => {
      const x = index / 2;
      const wave = Math.sin(index * 1.9) * noise + Math.cos(index * 0.8) * noise * 0.35;
      const y = 3 + trueSlope * x + curvature * (x - 4.5) ** 2 + wave + (index === 15 ? outlier * 8 : 0);
      return { x, y };
    });
    const fit = leastSquares(points);
    const fitted = points.map((point) => ({ ...point, yhat: fit.intercept + fit.slope * point.x, residual: point.y - (fit.intercept + fit.slope * point.x) }));
    const yMean = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const sse = fitted.reduce((sum, point) => sum + point.residual ** 2, 0);
    const sst = points.reduce((sum, point) => sum + (point.y - yMean) ** 2, 0);
    return { points: fitted, fit, r2: 1 - sse / sst, rmse: Math.sqrt(sse / points.length) };
  }, [curvature, noise, outlier, trueSlope]);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard title="Regression Controls" description="Inject noise, curvature, and an outlier to stress-test the fitted line.">
          <SliderGroup>
            <SliderControl density="compact" label="True slope" value={trueSlope} min={-1} max={3} step={0.1} onChange={setTrueSlope} />
            <SliderControl density="compact" label="Noise" value={noise} min={0} max={4} step={0.1} onChange={setNoise} />
            <SliderControl density="compact" label="Outlier strength" value={outlier} min={0} max={1} step={0.05} onChange={setOutlier} />
            <SliderControl density="compact" label="Curvature" value={curvature} min={-0.4} max={0.4} step={0.02} onChange={setCurvature} />
          </SliderGroup>
          <MetricGrid items={[
            ["Fitted slope", fmt(model.fit.slope)],
            ["Intercept", fmt(model.fit.intercept)],
            ["R squared", fmt(model.r2)],
            ["RMSE", fmt(model.rmse)],
          ]} />
        </SectionCard>
        <VisualFrame title="Fit Line, Residuals, and Influence">
          <RegressionSvg points={model.points} slope={model.fit.slope} intercept={model.fit.intercept} />
        </VisualFrame>
      </section>
      <TheoryBlock
        cards={[
          ["Least squares", "The fitted line minimizes the sum of squared vertical residuals, which makes large errors especially influential."],
          ["Residual diagnostics", "Residuals should look patternless for a linear model. Curved residual patterns are a warning that the model form is too simple."],
          ["Prediction vs explanation", "A high R squared can still hide bias, outliers, or non-causal association. Always inspect the graph."],
        ]}
      />
      <LearningExpansion content={statisticsLearningContent.regression} />
    </>
  );
}

function VisualFrame({ title, children }: { title: string; children: JSX.Element }) {
  return (
    <SectionCard title={title} description="A compact visual lab designed for quick mathematical inspection." allowFullscreen>
      <div className="min-h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 shadow-inner dark:border-white/10">
        {children}
      </div>
    </SectionCard>
  );
}

function SamplingSvg({ population, sampling, means, se }: { population: Point[]; sampling: Point[]; means: number[]; se: number }) {
  const width = 880;
  const height = 380;
  const maxY = Math.max(...population.map((p) => p.y), ...sampling.map((p) => p.y));
  const xp = scale(-4, 4, 56, 390);
  const xs = scale(50 - 4 * se, 50 + 4 * se, 490, 824);
  const y = scale(0, maxY, 322, 54);
  const popPath = pathFor(population, xp, y);
  const samplingPath = pathFor(sampling, xs, y);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Sampling distribution visual">
      <VisualBg />
      <text x="58" y="42" fill="#e0f2fe" fontSize="16" fontWeight="800">Population shape</text>
      <text x="490" y="42" fill="#e0f2fe" fontSize="16" fontWeight="800">Sample means shrink by SE</text>
      <path d={popPath} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <path d={samplingPath} fill="none" stroke="#a78bfa" strokeWidth="5" />
      {means.slice(0, 90).map((mean, index) => <circle key={index} cx={xs(mean)} cy={335 - (index % 10) * 7} r="3.5" fill="#facc15" opacity="0.82" />)}
      <line x1={xs(50 - 1.96 * se)} y1="70" x2={xs(50 - 1.96 * se)} y2="330" stroke="#fb7185" strokeDasharray="7 7" />
      <line x1={xs(50 + 1.96 * se)} y1="70" x2={xs(50 + 1.96 * se)} y2="330" stroke="#fb7185" strokeDasharray="7 7" />
      <text x="620" y="358" textAnchor="middle" fill="#bae6fd" fontSize="13" fontWeight="800">95% zone around true mean</text>
    </svg>
  );
}

function InferenceSvg({ z, zCrit, pHat, p0, ciLow, ciHigh, reject }: { z: number; zCrit: number; pHat: number; p0: number; ciLow: number; ciHigh: number; reject: boolean }) {
  const width = 880;
  const height = 380;
  const curvePoints = curve(-4, 4, 120, (x) => normalPdf(x, 0, 1));
  const x = scale(-4, 4, 60, 820);
  const y = scale(0, 0.42, 310, 58);
  const clampedZ = Math.max(-4, Math.min(4, z));
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Hypothesis testing visual">
      <VisualBg />
      <path d={`${pathFor(curvePoints, x, y)} L ${x(4)} 310 L ${x(-4)} 310 Z`} fill="#38bdf8" opacity="0.16" />
      <path d={pathFor(curvePoints, x, y)} fill="none" stroke="#67e8f9" strokeWidth="5" />
      <rect x={x(-4)} y="286" width={x(-zCrit) - x(-4)} height="24" fill="#fb7185" opacity="0.75" />
      <rect x={x(zCrit)} y="286" width={x(4) - x(zCrit)} height="24" fill="#fb7185" opacity="0.75" />
      <line x1={x(clampedZ)} y1="60" x2={x(clampedZ)} y2="322" stroke="#facc15" strokeWidth="5" />
      <text x={x(clampedZ)} y="48" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="900">observed z={fmt(z)}</text>
      <text x="70" y="352" fill="#e0f2fe" fontSize="13" fontWeight="800">reject tails start at +/- {fmt(zCrit)}</text>
      <rect x="480" y="68" width="330" height="96" rx="14" fill={reject ? "#881337" : "#064e3b"} opacity="0.82" />
      <text x="500" y="100" fill="#fff" fontSize="18" fontWeight="900">{reject ? "Reject H0" : "Do not reject H0"}</text>
      <text x="500" y="128" fill="#e0f2fe" fontSize="13" fontWeight="800">phat={fmt(pHat)}, p0={fmt(p0)}</text>
      <line x1="508" y1="190" x2="792" y2="190" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
      <line x1={508 + ciLow * 284} y1="190" x2={508 + ciHigh * 284} y2="190" stroke="#facc15" strokeWidth="10" strokeLinecap="round" />
      <circle cx={508 + pHat * 284} cy="190" r="9" fill="#22d3ee" />
      <text x="508" y="220" fill="#bae6fd" fontSize="12" fontWeight="800">0</text>
      <text x="792" y="220" textAnchor="end" fill="#bae6fd" fontSize="12" fontWeight="800">1</text>
    </svg>
  );
}

function RegressionSvg({ points, slope, intercept }: { points: Array<{ x: number; y: number; yhat: number; residual: number }>; slope: number; intercept: number }) {
  const width = 880;
  const height = 380;
  const minY = Math.min(...points.map((p) => p.y), ...points.map((p) => p.yhat)) - 1;
  const maxY = Math.max(...points.map((p) => p.y), ...points.map((p) => p.yhat)) + 1;
  const x = scale(0, 8.5, 64, 808);
  const y = scale(minY, maxY, 318, 58);
  const yLine = (v: number) => intercept + slope * v;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Regression diagnostics visual">
      <VisualBg />
      <line x1="64" y1="318" x2="808" y2="318" stroke="#64748b" />
      <line x1="64" y1="58" x2="64" y2="318" stroke="#64748b" />
      <line x1={x(0)} y1={y(yLine(0))} x2={x(8.5)} y2={y(yLine(8.5))} stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      {points.map((point, index) => (
        <g key={index}>
          <line x1={x(point.x)} y1={y(point.y)} x2={x(point.x)} y2={y(point.yhat)} stroke={Math.abs(point.residual) > 4 ? "#fb7185" : "#38bdf8"} strokeWidth="3" opacity="0.78" />
          <circle cx={x(point.x)} cy={y(point.y)} r={Math.abs(point.residual) > 4 ? 8 : 6} fill={Math.abs(point.residual) > 4 ? "#fb7185" : "#22d3ee"} />
        </g>
      ))}
      <text x="70" y="42" fill="#e0f2fe" fontSize="16" fontWeight="900">residual sticks show vertical errors</text>
      <text x="548" y="348" fill="#fef3c7" fontSize="13" fontWeight="900">yhat = {fmt(intercept)} + {fmt(slope)}x</text>
    </svg>
  );
}

function TheoryBlock({ cards }: { cards: Array<[string, string]> }) {
  return (
    <SectionCard title="Theory" description="Use the visual first, then use these rules to explain what the result means.">
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map(([title, text]) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
            <BookOpen className="mb-3 h-5 w-5 text-cyan-500" />
            <h2 className="mb-2 font-black text-slate-950 dark:text-white">{title}</h2>
            {text}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function VisualBg() {
  return (
    <>
      <rect width="880" height="380" rx="22" fill="#020617" />
      <path d="M0 310 C160 250 260 360 420 284 S690 220 880 284 L880 380 L0 380 Z" fill="#0e7490" opacity="0.22" />
      <path d="M0 66 C160 128 248 16 420 78 S670 136 880 54" fill="none" stroke="#312e81" strokeWidth="28" opacity="0.42" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={64 + i * 90} y1="54" x2={64 + i * 90} y2="322" stroke="#1e293b" strokeWidth="1" />)}
    </>
  );
}

type Point = { x: number; y: number };

function curve(min: number, max: number, steps: number, fn: (x: number) => number): Point[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const x = min + (index / steps) * (max - min);
    return { x, y: fn(x) };
  });
}

function pathFor(points: Point[], xScale: (value: number) => number, yScale: (value: number) => number) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.x)} ${yScale(point.y)}`).join(" ");
}

function scale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) {
  return (value: number) => rangeMin + ((value - domainMin) / (domainMax - domainMin || 1)) * (rangeMax - rangeMin);
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCdf(z: number) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * a);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function leastSquares(points: Array<{ x: number; y: number }>) {
  const n = points.length;
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / n;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / n;
  const numerator = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0) || 1;
  const slope = numerator / denominator;
  return { slope, intercept: meanY - slope * meanX };
}

function fmt(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "0";
}
