import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Eye,
  Lightbulb,
  RotateCcw,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  linearRegression,
  type ResultTableRow,
} from "../../../components/workspace/panels/graphPanelUtils";
import {
  mean,
  median,
  mode,
  range,
} from "../../../utils/mathEngine/statisticsUtils";
import type { LessonAdapterProps } from "../types";

type Kind =
  "classify" | "table" | "summary" | "distribution" | "paired" | "regression";
type Summary = {
  mean: number;
  median: number;
  mode: number;
  range: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  variance: number;
  sd: number;
};

const titles = [
  "Data Types",
  "Frequency Tables",
  "Grouped Frequency Tables",
  "Mean",
  "Median",
  "Mode",
  "Weighted Mean",
  "Range",
  "Quartiles and IQR",
  "Variance and Standard Deviation",
  "Percentiles",
  "Z-Scores",
  "Outliers",
  "Box Plot",
  "Dot Plot",
  "Stem-and-Leaf Plot",
  "Histogram",
  "Frequency Polygon",
  "Cumulative Frequency Curve",
  "Bar and Pie Charts",
  "Scatter Plot",
  "Time-Series Plot",
  "Correlation Coefficient",
  "Linear Regression",
  "Polynomial Regression",
  "Exponential Regression",
  "Logarithmic Regression",
  "Power Regression",
  "Logistic Regression",
  "Sinusoidal Regression",
  "Residual Plot",
  "Model Comparison",
  "Interpolation and Extrapolation",
];
const formulas: Record<string, string> = {
  "Data Types": "categorical | discrete | continuous",
  "Frequency Tables": "relative frequency = f / n",
  "Grouped Frequency Tables": "density = frequency / class width",
  Mean: "x-bar = sum(x) / n",
  Median: "middle ordered value",
  Mode: "value with greatest frequency",
  "Weighted Mean": "sum(wx) / sum(w)",
  Range: "max - min",
  "Quartiles and IQR": "IQR = Q3 - Q1",
  "Variance and Standard Deviation": "s² = sum((x - x-bar)²) / (n - 1)",
  Percentiles: "rank = 100 x count below / n",
  "Z-Scores": "z = (x - mean) / standard deviation",
  Outliers: "Q1 - 1.5 IQR to Q3 + 1.5 IQR",
  "Box Plot": "min, Q1, median, Q3, max",
  Histogram: "density = frequency / class width",
  "Frequency Polygon": "midpoint = (lower + upper) / 2",
  "Cumulative Frequency Curve": "F(k) = f(1) + ... + f(k)",
  "Bar and Pie Charts": "sector = 360 degrees x f / n",
  "Correlation Coefficient": "-1 <= r <= 1",
  "Linear Regression": "y-hat = mx + b",
  "Polynomial Regression": "y-hat = a(n)x^n + ... + a(0)",
  "Exponential Regression": "y-hat = ab^x",
  "Logarithmic Regression": "y-hat = a + b ln(x), x > 0",
  "Power Regression": "y-hat = ax^b",
  "Logistic Regression": "P(y=1|x) = 1 / (1 + e^(-z))",
  "Sinusoidal Regression": "y-hat = A sin(Bx + C) + D",
  "Residual Plot": "residual = observed - predicted",
  "Interpolation and Extrapolation": "inside range | outside range",
};
const base = [2, 3, 4, 4, 5, 6, 7, 8, 9];
const paired: ResultTableRow[] = [
  { x: 1, y: 2.5 },
  { x: 2, y: 3.3 },
  { x: 3, y: 4.1 },
  { x: 4, y: 5.2 },
  { x: 5, y: 5.9 },
  { x: 6, y: 7.1 },
  { x: 7, y: 7.9 },
  { x: 8, y: 9.2 },
];

export default function StatisticsLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const index = Math.max(0, lesson.id - 467);
  const mockup = String(430 + index).padStart(4, "0");
  const kind = kindFor(index);
  const [shift, setShift] = useState(0),
    [spread, setSpread] = useState(1),
    [outlier, setOutlier] = useState(10);
  const [slope, setSlope] = useState(1),
    [intercept, setIntercept] = useState(2),
    [showModel, setShowModel] = useState(true);
  useEffect(() => {
    setShift(0);
    setSpread(1);
    setOutlier(10);
    setSlope(1);
    setIntercept(2);
    setShowModel(true);
  }, [lesson.id, resetToken]);
  const values = useMemo(
    () => [
      ...base.slice(0, -1).map((v) => 5 + (v - 5) * spread + shift),
      outlier + shift,
    ],
    [outlier, shift, spread],
  );
  const points = useMemo(
    () =>
      paired.map((p, i) => ({
        x: p.x,
        y: p.y + shift + (i === 7 ? spread - 1 : 0),
      })),
    [shift, spread],
  );
  const stats = useMemo(() => describe(values), [values]);
  const fit = useMemo(() => linearRegression(points), [points]);
  const r2 = useMemo(
    () => coefficientOfDetermination(points, fit.slope, fit.intercept),
    [fit.intercept, fit.slope, points],
  );
  const change = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    onInteraction();
  };
  const title = titles[index] ?? lesson.title;

  return (
    <section
      className="space-y-3"
      data-testid={`statistics-mockup-${mockup}`}
      data-target-family="statistics-and-regression"
    >
      <MethodStrip kind={kind} />
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-700">
              Interact
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {workspaceTitle(title, kind)}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Edit the data and controls. Every representation updates together.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />n = {values.length}
            </span>
            <button
              type="button"
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-700"
              onClick={() => {
                setShift(((shift + 2) % 5) - 2);
                setSpread(spread >= 1.5 ? 0.75 : spread + 0.25);
                setOutlier(outlier >= 14 ? 9 : outlier + 2);
                onInteraction();
              }}
            >
              <Shuffle className="h-4 w-4" />
              Randomise
            </button>
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)_270px]">
          <DataPanel title={title} kind={kind} values={values} stats={stats} />
          <Visual
            title={title}
            kind={kind}
            values={values}
            points={points}
            stats={stats}
            r2={r2}
            slope={slope}
            intercept={intercept}
            show={showModel}
          />
          <aside className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase text-cyan-700">
                {kind === "regression" ? "Model controls" : "Data controls"}
              </p>
              <div className="mt-3 space-y-4">
                {kind === "regression" ? (
                  <>
                    <RangeInput
                      label="Slope"
                      value={slope}
                      min={-2}
                      max={3}
                      step={0.1}
                      onChange={change(setSlope)}
                    />
                    <RangeInput
                      label="Intercept"
                      value={intercept}
                      min={-5}
                      max={5}
                      step={0.25}
                      onChange={change(setIntercept)}
                    />
                  </>
                ) : (
                  <>
                    <RangeInput
                      label="Shift all data"
                      value={shift}
                      min={-3}
                      max={3}
                      step={1}
                      onChange={change(setShift)}
                    />
                    <RangeInput
                      label="Add spread"
                      value={spread}
                      min={0.5}
                      max={2}
                      step={0.25}
                      onChange={change(setSpread)}
                    />
                    <RangeInput
                      label="Extreme value"
                      value={outlier}
                      min={7}
                      max={20}
                      step={1}
                      onChange={change(setOutlier)}
                    />
                  </>
                )}
              </div>
              <label className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-xs font-black text-slate-700">
                Show {kind === "regression" ? "model" : "summary line"}
                <input
                  type="checkbox"
                  checked={showModel}
                  onChange={(e) => {
                    setShowModel(e.target.checked);
                    onInteraction();
                  }}
                  className="h-4 w-4 accent-blue-600"
                />
              </label>
              <button
                type="button"
                className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-black text-slate-700"
                onClick={() => {
                  setShift(0);
                  setSpread(1);
                  setOutlier(10);
                  setSlope(1);
                  setIntercept(2);
                  onInteraction();
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-black uppercase text-slate-500">
                Key results
              </p>
              <Result label="Mean" value={stats.mean.toFixed(2)} />
              <Result
                label={kind === "regression" ? "Slope (fit)" : "Variance"}
                value={
                  kind === "regression"
                    ? fit.slope.toFixed(2)
                    : stats.variance.toFixed(2)
                }
              />
              <Result
                label={kind === "regression" ? "R squared" : "Std. deviation"}
                value={
                  kind === "regression" ? r2.toFixed(3) : stats.sd.toFixed(2)
                }
              />
            </div>
            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900">
              <BarChart3 className="mb-2 h-5 w-5" />
              Changing one value updates the table, visual, and diagnostics
              together.
            </div>
          </aside>
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Mean" value={stats.mean.toFixed(2)} color="#2563eb" />
        <Metric
          label="Median"
          value={stats.median.toFixed(2)}
          color="#0f766e"
        />
        <Metric
          label={
            kind === "paired" || kind === "regression"
              ? "Correlation r"
              : "Standard deviation"
          }
          value={
            kind === "paired" || kind === "regression"
              ? Math.sqrt(r2).toFixed(3)
              : stats.sd.toFixed(2)
          }
          color="#7c3aed"
        />
        <Metric
          label={kind === "regression" ? "R squared" : "Range"}
          value={kind === "regression" ? r2.toFixed(3) : stats.range.toFixed(2)}
          color="#db2777"
        />
      </section>
      <section className="grid gap-3 lg:grid-cols-3">
        <Info
          icon={<BookOpen className="h-4 w-4" />}
          tone="blue"
          title="Definition and rule"
          body={ruleFor(title)}
          formula={
            formulas[title] ?? "Read the data, calculate, then interpret."
          }
        />
        <Info
          icon={<Lightbulb className="h-4 w-4" />}
          tone="green"
          title="Worked example"
          body={exampleFor(title, stats)}
          formula={`Current mean = ${stats.mean.toFixed(2)}`}
        />
        <Info
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="red"
          title="Misconception guard"
          body={misconceptionFor(title)}
          formula="Check variable type, data range, assumptions, and context."
        />
      </section>
      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-[10px] font-black uppercase text-blue-700">
            Try it
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-950">
            Lesson practice
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Apply {title.toLowerCase()} to a new dataset and justify your
            interpretation.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              aria-label="Practice answer"
              className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500"
              placeholder="Type your answer or reasoning"
            />
            <button
              type="button"
              className="min-h-10 rounded-xl bg-blue-600 px-4 text-sm font-black text-white"
              onClick={() => onInteraction()}
            >
              Check answer
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-cyan-800">
            <Target className="h-5 w-5" />
            Self-check rubric
          </div>
          <p className="mt-3 text-xs font-bold leading-6 text-slate-600">
            Correct method
            <br />
            Calculation or graph evidence
            <br />
            Interpretation in context
          </p>
        </div>
      </section>
    </section>
  );
}

function MethodStrip({ kind }: { kind: Kind }) {
  const texts =
    kind === "regression"
      ? [
          "Read observed points",
          "Adjust model parameters",
          "Inspect fit and residuals",
          "Connect model to formula",
          "Predict and justify",
        ]
      : [
          "See the data",
          "Change values and controls",
          "Watch summaries update",
          "Connect graph and formula",
          "Apply to new data",
        ];
  const icons = [Eye, SlidersHorizontal, Sparkles, BookOpen, Target];
  return (
    <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-2 xl:grid-cols-5">
      {["Observe", "Manipulate", "Notice", "Rule", "Try"].map((label, i) => {
        const Icon = icons[i];
        return (
          <article
            key={label}
            className="relative flex min-h-[98px] gap-3 border-b border-slate-200 p-4 sm:border-r xl:border-b-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-black text-slate-900">
                {i + 1} {label}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                {texts[i]}
              </p>
            </div>
            {i < 4 ? (
              <ArrowRight className="absolute -right-2 top-10 z-10 hidden h-4 w-4 text-slate-300 xl:block" />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function DataPanel({
  title,
  kind,
  values,
  stats,
}: {
  title: string;
  kind: Kind;
  values: number[];
  stats: Summary;
}) {
  const rows = freq(values);
  return (
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase text-slate-500">
        {kind === "paired" || kind === "regression"
          ? "Input paired data"
          : "Editable dataset"}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span
            key={i}
            className="grid h-9 min-w-9 place-items-center rounded-lg border border-blue-100 bg-white px-2 font-mono text-xs font-black text-blue-700"
          >
            {fmt(v)}
          </span>
        ))}
      </div>
      {kind === "classify" ? (
        <div className="mt-3 space-y-2">
          {[
            ["Blood type", "Categorical"],
            ["Class rank", "Ordinal"],
            ["Siblings", "Discrete"],
            ["Temperature", "Continuous"],
          ].map(([a, b]) => (
            <div key={a} className="rounded-lg border bg-white p-2">
              <strong className="block text-xs">{a}</strong>
              <span className="text-[11px] font-black text-cyan-700">{b}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">Value</th>
                <th className="p-2">Tally</th>
                <th className="p-2 text-right">f</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 7).map(([v, n]) => (
                <tr key={v} className="border-t">
                  <td className="p-2 font-black">{v}</td>
                  <td className="p-2 font-mono text-cyan-700">
                    {"|".repeat(n)}
                  </td>
                  <td className="p-2 text-right font-black">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <Small label="Minimum" value={fmt(stats.min)} />
        <Small label="Maximum" value={fmt(stats.max)} />
      </div>
      <p className="mt-3 text-[11px] font-semibold text-slate-500">
        {title}: totals and plots stay linked.
      </p>
    </aside>
  );
}

function Visual({
  title,
  kind,
  values,
  points,
  stats,
  r2,
  slope,
  intercept,
  show,
}: {
  title: string;
  kind: Kind;
  values: number[];
  points: ResultTableRow[];
  stats: Summary;
  r2: number;
  slope: number;
  intercept: number;
  show: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex justify-between">
        <h3 className="text-sm font-black">{title} (updates live)</h3>
        <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700">
          Live view
        </span>
      </div>
      <div className="min-h-[360px] overflow-hidden">
        {kind === "classify" ? (
          <Classify />
        ) : kind === "summary" ? (
          <Balance values={values} avg={stats.mean} />
        ) : kind === "distribution" ? (
          <Distribution title={title} values={values} stats={stats} />
        ) : kind === "paired" || kind === "regression" ? (
          <Regression
            title={title}
            points={points}
            r2={r2}
            slope={slope}
            intercept={intercept}
            show={show}
          />
        ) : (
          <Bars values={values} />
        )}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-4 rounded-lg bg-slate-50 p-2 text-[10px] font-bold text-slate-600">
        <span>● Observed data</span>
        <span className="text-violet-700">━ Current model</span>
        <span className="text-amber-600">■ Interactive value</span>
      </div>
    </div>
  );
}

function Classify() {
  return (
    <div className="grid h-[360px] gap-3 p-3 sm:grid-cols-2">
      {[
        ["Categorical", "Labels or ordered groups"],
        ["Numerical", "Counts or measurements"],
        ["Bar / pie chart", "Categorical data"],
        ["Dot / histogram", "Numerical data"],
      ].map(([a, b]) => (
        <div
          key={a}
          className="grid place-items-center rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/40 text-center"
        >
          <div>
            <strong className="text-cyan-800">{a}</strong>
            <span className="block text-xs text-slate-500">{b}</span>
            <span className="mt-5 inline-block rounded-lg border border-dashed bg-white px-4 py-3 text-[11px] font-black text-slate-500">
              Drop variable here
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
function Grid() {
  return (
    <g opacity=".35">
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={55 + i * 48}
          x2={55 + i * 48}
          y1="25"
          y2="315"
          stroke="#cbd5e1"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="55"
          x2="590"
          y1={25 + i * 48}
          y2={25 + i * 48}
          stroke="#cbd5e1"
        />
      ))}
    </g>
  );
}
function Bars({ values }: { values: number[] }) {
  const rows = freq(values),
    max = Math.max(...rows.map((r) => r[1]));
  return (
    <svg viewBox="0 0 620 360" className="h-[360px] w-full">
      <Grid />
      {rows.map(([v, n], i) => {
        const w = 440 / rows.length,
          h = (n / max) * 220,
          x = 80 + i * w;
        return (
          <g key={v}>
            <rect
              x={x}
              y={300 - h}
              width={Math.max(18, w - 14)}
              height={h}
              rx="3"
              fill={i === rows.length - 1 ? "#7c3aed" : "#06b6d4"}
            />
            <text
              x={x + (w - 14) / 2}
              y={290 - h}
              textAnchor="middle"
              fontWeight="900"
            >
              {n}
            </text>
            <text x={x + (w - 14) / 2} y="330" textAnchor="middle">
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
function Balance({ values, avg }: { values: number[]; avg: number }) {
  const sx = (v: number) => 55 + (v / 12) * 510;
  return (
    <svg viewBox="0 0 620 360" className="h-[360px] w-full">
      <Grid />
      <line
        x1="45"
        y1="225"
        x2="580"
        y2="225"
        stroke="#795548"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${sx(avg) - 24} 310 L ${sx(avg)} 225 L ${sx(avg) + 24} 310 Z`}
        fill="#475569"
      />
      <line
        x1={sx(avg)}
        x2={sx(avg)}
        y1="55"
        y2="225"
        stroke="#8b5cf6"
        strokeDasharray="6 5"
      />
      {values.map((v, i) => (
        <g key={i}>
          <rect
            x={sx(v) - 15}
            y="175"
            width="30"
            height="38"
            rx="6"
            fill={v < avg ? "#3b82f6" : "#7c3aed"}
          />
          <text
            x={sx(v)}
            y="200"
            textAnchor="middle"
            fill="white"
            fontWeight="900"
          >
            {fmt(v)}
          </text>
        </g>
      ))}
      <text
        x={sx(avg)}
        y="45"
        textAnchor="middle"
        fontWeight="900"
        fill="#7c3aed"
      >
        mean = {avg.toFixed(2)}
      </text>
    </svg>
  );
}
function Distribution({
  title,
  values,
  stats,
}: {
  title: string;
  values: number[];
  stats: Summary;
}) {
  if (/Box|Quartile|Outlier/.test(title)) {
    const sx = (v: number) => 55 + (v / Math.max(12, stats.max + 1)) * 510;
    return (
      <svg viewBox="0 0 620 360" className="h-[360px] w-full">
        <Grid />
        <line
          x1={sx(stats.min)}
          x2={sx(stats.q1)}
          y1="185"
          y2="185"
          stroke="#334155"
          strokeWidth="3"
        />
        <rect
          x={sx(stats.q1)}
          y="125"
          width={sx(stats.q3) - sx(stats.q1)}
          height="120"
          fill="#ede9fe"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        <line
          x1={sx(stats.median)}
          x2={sx(stats.median)}
          y1="125"
          y2="245"
          stroke="#f59e0b"
          strokeWidth="4"
        />
        <line
          x1={sx(stats.q3)}
          x2={sx(stats.max)}
          y1="185"
          y2="185"
          stroke="#334155"
          strokeWidth="3"
        />
        {[stats.min, stats.max].map((v) => (
          <line
            key={v}
            x1={sx(v)}
            x2={sx(v)}
            y1="150"
            y2="220"
            stroke="#334155"
            strokeWidth="3"
          />
        ))}
        <text x="310" y="290" textAnchor="middle" fontWeight="900">
          IQR = {(stats.q3 - stats.q1).toFixed(2)}
        </text>
      </svg>
    );
  }
  return <Bars values={values} />;
}
function Regression({
  title,
  points,
  r2,
  slope,
  intercept,
  show,
}: {
  title: string;
  points: ResultTableRow[];
  r2: number;
  slope: number;
  intercept: number;
  show: boolean;
}) {
  const sx = (x: number) => 65 + (x / 9) * 500,
    sy = (y: number) => 315 - (y / 12) * 265;
  const line = Array.from({ length: 81 }, (_, i) => {
    const x = i / 10;
    let y = slope * x + intercept;
    if (title.includes("Polynomial")) y = 0.12 * (x - 4) ** 2 + 3;
    if (title.includes("Exponential")) y = 1.5 * 1.25 ** x;
    if (title.includes("Logarithmic")) y = 2 + 2 * Math.log(Math.max(0.2, x));
    if (title.includes("Power")) y = 0.55 * Math.max(0.1, x) ** 1.4;
    if (title.includes("Logistic")) y = 10 / (1 + Math.exp(-(slope * x - 4)));
    if (title.includes("Sinusoidal")) y = 5 + 3 * Math.sin(x * 1.2);
    return `${sx(x)},${sy(y)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 620 360" className="h-[360px] w-full">
      <Grid />
      {show ? (
        <polyline points={line} fill="none" stroke="#7c3aed" strokeWidth="4" />
      ) : null}
      {points.map((p, i) => (
        <g key={i}>
          {title === "Residual Plot" ? (
            <line
              x1={sx(p.x)}
              x2={sx(p.x)}
              y1={sy(slope * p.x + intercept)}
              y2={sy(p.y)}
              stroke="#f97316"
            />
          ) : null}
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r="7"
            fill={i % 2 ? "#7c3aed" : "#0891b2"}
          />
        </g>
      ))}
      <rect
        x="390"
        y="38"
        width="170"
        height="58"
        rx="10"
        fill="white"
        stroke="#cbd5e1"
      />
      <text x="475" y="62" textAnchor="middle" fontWeight="800">
        Current model
      </text>
      <text x="475" y="85" textAnchor="middle" fontWeight="900" fill="#7c3aed">
        y = {slope.toFixed(2)}x + {intercept.toFixed(2)}
      </text>
      <text x="560" y="340" textAnchor="end" fontWeight="800">
        R² = {r2.toFixed(3)}
      </text>
    </svg>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-xs font-black">
        <span>{label}</span>
        <output>{value.toFixed(step < 1 ? 2 : 0)}</output>
      </span>
      <input
        type="range"
        className="w-full accent-cyan-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
      <span className="text-[10px] font-black uppercase text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block text-2xl font-black" style={{ color }}>
        {value}
      </strong>
    </div>
  );
}
function Small({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-2">
      <span className="block text-[9px] font-black uppercase text-slate-400">
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex justify-between border-t pt-2 text-xs">
      <span className="font-bold text-slate-500">{label}</span>
      <strong className="font-mono text-base">{value}</strong>
    </div>
  );
}
function Info({
  icon,
  tone,
  title,
  body,
  formula,
}: {
  icon: ReactNode;
  tone: "blue" | "green" | "red";
  title: string;
  body: string;
  formula: string;
}) {
  const c =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-800"
      : tone === "green"
        ? "border-emerald-100 bg-emerald-50 text-emerald-800"
        : "border-rose-100 bg-rose-50 text-rose-800";
  return (
    <article className={`rounded-2xl border p-4 ${c}`}>
      <h3 className="flex items-center gap-2 text-sm font-black">
        {icon}
        {title}
      </h3>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-700">
        {body}
      </p>
      <div className="mt-3 rounded-lg bg-white/80 p-3 font-mono text-xs font-black text-slate-800">
        {formula}
      </div>
    </article>
  );
}

function kindFor(i: number): Kind {
  if (i === 0) return "classify";
  if (i <= 2 || i === 15) return "table";
  if (i <= 8) return "summary";
  if (i <= 19) return "distribution";
  if (i <= 22) return "paired";
  return "regression";
}
function describe(values: number[]): Summary {
  const sorted = [...values].sort((a, b) => a - b),
    avg = mean(values),
    variance =
      values.reduce((s, v) => s + (v - avg) ** 2, 0) /
      Math.max(1, values.length - 1);
  return {
    mean: avg,
    median: median(values),
    mode: mode(values),
    range: range(values),
    min: sorted[0],
    max: sorted.at(-1)!,
    q1: q(sorted, 0.25),
    q3: q(sorted, 0.75),
    variance,
    sd: Math.sqrt(variance),
  };
}
function q(a: number[], p: number) {
  const x = (a.length - 1) * p,
    l = Math.floor(x),
    f = x - l;
  return a[l + 1] === undefined ? a[l] : a[l] + f * (a[l + 1] - a[l]);
}
function fmt(v: number) {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
function freq(values: number[]): [string, number][] {
  const m = new Map<string, number>();
  values.forEach((v) => m.set(fmt(v), (m.get(fmt(v)) ?? 0) + 1));
  return [...m].sort((a, b) => Number(a[0]) - Number(b[0]));
}
function coefficientOfDetermination(
  points: ResultTableRow[],
  slope: number,
  intercept: number,
) {
  const average =
    points.reduce((sum, point) => sum + point.y, 0) /
    Math.max(1, points.length);
  const total = points.reduce(
    (sum, point) => sum + (point.y - average) ** 2,
    0,
  );
  const residual = points.reduce(
    (sum, point) => sum + (point.y - (slope * point.x + intercept)) ** 2,
    0,
  );
  return total === 0 ? 1 : Math.max(0, Math.min(1, 1 - residual / total));
}
function workspaceTitle(title: string, kind: Kind) {
  if (kind === "classify") return "Classify variables and match the best graph";
  if (kind === "table") return "Your data, your counts";
  if (kind === "regression")
    return "Drag, adjust, and diagnose the fitted model";
  return `${title} explorer`;
}
function ruleFor(title: string) {
  if (title === "Data Types")
    return "The variable type determines which summaries and graphs are meaningful.";
  if (title.includes("Regression") || title === "Model Comparison")
    return "Choose a model using fit, residuals, simplicity, and context.";
  if (title === "Interpolation and Extrapolation")
    return "Predictions become less reliable farther beyond the observed range.";
  return `Use ${title.toLowerCase()} to describe the data, then interpret the result in context.`;
}
function exampleFor(title: string, stats: Summary) {
  return `${title} applied to the current nine values gives centre ${stats.median.toFixed(2)}, spread ${stats.range.toFixed(2)}, and mean ${stats.mean.toFixed(2)}.`;
}
function misconceptionFor(title: string) {
  if (title.includes("Correlation") || title === "Scatter Plot")
    return "Association does not prove causation, and a small r can hide a curved pattern.";
  if (title.includes("Regression") || title === "Residual Plot")
    return "A strong fit statistic does not excuse patterned residuals or unsafe extrapolation.";
  if (title === "Histogram")
    return "Histogram bars touch because intervals are continuous; unequal widths require frequency density.";
  if (title === "Mean")
    return "The mean is sensitive to outliers and is not always an observed value.";
  return `Do not choose ${title.toLowerCase()} without checking the data type, assumptions, and context.`;
}
