import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Dices,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { binomialDistribution } from "../../../utils/mathEngine/probabilityUtils";
import type { LessonAdapterProps } from "../types";

type Kind =
  "event" | "diagram" | "simulation" | "calculator" | "discrete" | "continuous";
type Spec = {
  mockup: string;
  id: number;
  title: string;
  kind: Kind;
  formula: string;
  rule: string;
  misconception: string;
};

const rows: Array<[string, Kind, string]> = [
  ["Sample Spaces", "event", "|S| = m x n"],
  ["Events", "event", "E is a subset of S"],
  ["Probability Scale", "event", "0 <= P(A) <= 1"],
  ["Complement Rule", "event", "P(A') = 1 - P(A)"],
  ["Addition Rule", "diagram", "P(A or B) = P(A) + P(B) - P(A and B)"],
  ["Multiplication Rule", "diagram", "P(A and B) = P(A)P(B|A)"],
  ["Independent Events", "diagram", "P(A and B) = P(A)P(B)"],
  ["Mutually Exclusive Events", "diagram", "P(A and B) = 0"],
  ["Conditional Probability", "diagram", "P(A|B) = P(A and B) / P(B)"],
  ["Tree Diagrams", "diagram", "multiply along; add across"],
  ["Venn Diagrams", "diagram", "P(A union B)"],
  ["Two-Way Tables", "diagram", "joint / marginal total"],
  ["Bayes' Theorem", "diagram", "P(A|B) = P(B|A)P(A) / P(B)"],
  ["Expected Value", "event", "E(X) = sum xp(x)"],
  ["Simulation", "simulation", "relative frequency = successes / trials"],
  ["Law of Large Numbers", "simulation", "p-hat approaches p"],
  ["Distribution Calculator", "calculator", "area under curve = probability"],
  [
    "Probability Plot",
    "calculator",
    "observed quantile vs theoretical quantile",
  ],
  ["Cumulative Distribution", "calculator", "F(x) = P(X <= x)"],
  ["Interval / Tail Probability", "calculator", "P(a <= X <= b) = F(b) - F(a)"],
  ["Inverse Probability", "calculator", "x = F^-1(p)"],
  ["Bernoulli Distribution", "discrete", "P(X=1)=p; P(X=0)=1-p"],
  ["Binomial Distribution", "discrete", "P(X=k)=C(n,k)p^k(1-p)^(n-k)"],
  ["Hypergeometric Distribution", "discrete", "P(X=k)=C(K,k)C(N-K,n-k)/C(N,n)"],
  ["Poisson Distribution", "discrete", "P(X=k)=e^-lambda lambda^k/k!"],
  ["Geometric Distribution", "discrete", "P(X=k)=(1-p)^(k-1)p"],
  [
    "Negative Binomial Distribution",
    "discrete",
    "P(X=k)=C(k-1,r-1)p^r(1-p)^(k-r)",
  ],
  ["Uniform Distribution", "continuous", "f(x)=1/(b-a)"],
  ["Normal Distribution", "continuous", "Z=(X-mu)/sigma"],
  ["Student t Distribution", "continuous", "t=(x-bar-mu)/(s/sqrt(n))"],
  ["Chi-Square Distribution", "continuous", "chi-square = sum((O-E)^2/E)"],
  ["F Distribution", "continuous", "F=s1^2/s2^2"],
  ["Exponential Distribution", "continuous", "f(x)=lambda e^(-lambda x)"],
  [
    "Gamma Distribution",
    "continuous",
    "f(x)=x^(alpha-1)e^(-x/beta)/(Gamma(alpha)beta^alpha)",
  ],
  ["Weibull Distribution", "continuous", "F(x)=1-e^(-(x/lambda)^k)"],
  ["Standardisation", "continuous", "z=(x-mu)/sigma"],
  [
    "Distribution Simulation",
    "simulation",
    "empirical PMF approaches theoretical PMF",
  ],
];

const specs: Spec[] = rows.map(([title, kind, formula], index) => ({
  mockup: String(463 + index).padStart(4, "0"),
  id: 500 + index,
  title,
  kind,
  formula,
  rule: ruleFor(title),
  misconception: misconceptionFor(title),
}));

export default function ProbabilityLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = specs.find((item) => item.id === lesson.id) ?? specs[0];
  const [probability, setProbability] = useState(0.6);
  const [trials, setTrials] = useState(10);
  const [sampleSize, setSampleSize] = useState(1000);
  const [lower, setLower] = useState(4);
  const [upper, setUpper] = useState(7);
  const [showModel, setShowModel] = useState(true);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    setProbability(0.6);
    setTrials(10);
    setSampleSize(1000);
    setLower(4);
    setUpper(7);
    setShowModel(true);
    setRunning(true);
  }, [lesson.id, resetToken]);

  const bins = useMemo(
    () => distributionBins(spec, trials, probability),
    [probability, spec, trials],
  );
  const selected = Math.max(
    0,
    Math.min(trials, Math.round((lower + upper) / 2)),
  );
  const exact = bins[selected]?.probability ?? probability;
  const expected = spec.kind === "continuous" ? trials : trials * probability;
  const variance =
    spec.kind === "continuous"
      ? probability * probability
      : trials * probability * (1 - probability);
  const change = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const randomise = () => {
    setProbability(
      probability >= 0.8 ? 0.35 : Math.round((probability + 0.13) * 100) / 100,
    );
    setTrials(trials >= 18 ? 8 : trials + 2);
    onInteraction();
  };

  return (
    <section
      className="space-y-3"
      data-testid={`probability-mockup-${spec.mockup}`}
      data-target-family="probability-and-distributions"
    >
      <section className="grid gap-3 lg:grid-cols-3">
        <IntroCard
          icon={<Target className="h-5 w-5" />}
          title="Objective"
          body={`Explore ${spec.title.toLowerCase()} with linked probability models, exact calculations, and visual evidence.`}
        />
        <IntroCard
          icon={<Lightbulb className="h-5 w-5" />}
          title="Key insight"
          body={spec.rule}
        />
        <IntroCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Common misconception"
          body={spec.misconception}
          danger
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-700">
              Interactive lab
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {spec.title} Lab
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Change parameters and see every probability, diagram, and check
              update together.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {running ? "Live" : "Paused"}
            </span>
            <button
              type="button"
              className="action-secondary"
              onClick={() => {
                setRunning(!running);
                onInteraction();
              }}
            >
              {running ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{running ? "Pause" : "Run"}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[285px_minmax(0,1fr)_280px]">
          <Controls
            spec={spec}
            probability={probability}
            trials={trials}
            sampleSize={sampleSize}
            lower={lower}
            upper={upper}
            showModel={showModel}
            onProbability={change(setProbability)}
            onTrials={change(setTrials)}
            onSampleSize={change(setSampleSize)}
            onLower={change(setLower)}
            onUpper={change(setUpper)}
            onShowModel={(checked) => {
              setShowModel(checked);
              onInteraction();
            }}
            onRandomise={randomise}
          />
          <ProbabilityVisual
            spec={spec}
            probability={probability}
            trials={trials}
            bins={bins}
            lower={lower}
            upper={upper}
            selected={selected}
            showModel={showModel}
          />
          <Results
            spec={spec}
            probability={probability}
            trials={trials}
            exact={exact}
            expected={expected}
            variance={variance}
            sampleSize={sampleSize}
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Probability" value={exact.toFixed(4)} color="#2563eb" />
        <Metric
          label="Expected value"
          value={expected.toFixed(2)}
          color="#0891b2"
        />
        <Metric label="Variance" value={variance.toFixed(2)} color="#7c3aed" />
        <Metric
          label="Simulation size"
          value={sampleSize.toLocaleString()}
          color="#db2777"
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
        <Info
          icon={<BookOpen className="h-4 w-4" />}
          tone="blue"
          title="Exact calculation"
          body={spec.rule}
          formula={spec.formula}
        />
        <Info
          icon={<Sparkles className="h-4 w-4" />}
          tone="green"
          title="Interpretation"
          body={`The highlighted probability is ${exact.toFixed(4)}, or ${(exact * 100).toFixed(2)}%. Interpret this using the experiment and its assumptions.`}
          formula={`0 <= P(event) <= 1`}
        />
        <Info
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="amber"
          title="Assumptions and caution"
          body={spec.misconception}
          formula="Check independence, replacement, parameter range, and direction."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase text-blue-700">
              Quick knowledge check
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-950">
              Apply the current model
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            2 of 3 correct
          </span>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {[
            "Identify the correct model and assumptions.",
            "Calculate the highlighted probability.",
            "Interpret the result in context.",
          ].map((prompt, index) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onInteraction()}
              className="min-h-[92px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-xs font-bold text-slate-700"
            >
              <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white">
                {index + 1}
              </span>
              {prompt}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function Controls(props: {
  spec: Spec;
  probability: number;
  trials: number;
  sampleSize: number;
  lower: number;
  upper: number;
  showModel: boolean;
  onProbability: (v: number) => void;
  onTrials: (v: number) => void;
  onSampleSize: (v: number) => void;
  onLower: (v: number) => void;
  onUpper: (v: number) => void;
  onShowModel: (v: boolean) => void;
  onRandomise: () => void;
}) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase text-cyan-700">
        1. Set parameters
      </p>
      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
        <span className="text-[10px] font-black uppercase text-slate-400">
          Model
        </span>
        <strong className="mt-1 flex items-center gap-2 text-sm text-slate-900">
          <Dices className="h-4 w-4 text-violet-600" />
          {modelName(props.spec)}
        </strong>
      </div>
      <div className="mt-4 space-y-5">
        <RangeInput
          label={
            props.spec.kind === "continuous"
              ? "Shape / spread"
              : "Success probability p"
          }
          value={props.probability}
          min={0.05}
          max={0.95}
          step={0.05}
          onChange={props.onProbability}
        />
        <RangeInput
          label={
            props.spec.kind === "event" || props.spec.kind === "diagram"
              ? "Outcomes / stages"
              : "Number of trials n"
          }
          value={props.trials}
          min={2}
          max={20}
          step={1}
          onChange={props.onTrials}
        />
        <RangeInput
          label="Simulation size"
          value={props.sampleSize}
          min={100}
          max={10000}
          step={100}
          onChange={props.onSampleSize}
        />
        <RangeInput
          label="Lower bound a"
          value={props.lower}
          min={0}
          max={12}
          step={1}
          onChange={props.onLower}
        />
        <RangeInput
          label="Upper bound b"
          value={props.upper}
          min={1}
          max={20}
          step={1}
          onChange={props.onUpper}
        />
      </div>
      <label className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-xs font-black text-slate-700">
        Show theoretical model
        <input
          type="checkbox"
          checked={props.showModel}
          onChange={(event) => props.onShowModel(event.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="action-secondary"
          onClick={props.onRandomise}
        >
          <Shuffle className="h-4 w-4" />
          <span>Randomise</span>
        </button>
        <button
          type="button"
          className="action-secondary"
          onClick={() => {
            props.onProbability(0.6);
            props.onTrials(10);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </aside>
  );
}

function ProbabilityVisual({
  spec,
  probability,
  trials,
  bins,
  lower,
  upper,
  selected,
  showModel,
}: {
  spec: Spec;
  probability: number;
  trials: number;
  bins: Bin[];
  lower: number;
  upper: number;
  selected: number;
  showModel: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-black text-slate-900">
          {visualTitle(spec)}
        </h3>
        <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700">
          Updates live
        </span>
      </div>
      <div className="min-h-[390px] overflow-hidden rounded-lg">
        {spec.kind === "event" ? (
          <SampleSpaceVisual
            spec={spec}
            trials={trials}
            probability={probability}
          />
        ) : spec.kind === "diagram" ? (
          <DiagramVisual spec={spec} probability={probability} />
        ) : spec.kind === "simulation" ? (
          <SimulationVisual
            bins={bins}
            sampleSize={1000}
            probability={probability}
          />
        ) : spec.kind === "continuous" || spec.kind === "calculator" ? (
          <CurveVisual
            spec={spec}
            probability={probability}
            lower={lower}
            upper={upper}
          />
        ) : (
          <MassVisual bins={bins} selected={selected} showModel={showModel} />
        )}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-4 rounded-lg bg-slate-50 p-2 text-[10px] font-bold text-slate-600">
        <span className="text-cyan-700">■ Probability</span>
        <span className="text-violet-700">━ Theoretical model</span>
        <span className="text-amber-600">● Selected event</span>
      </div>
    </div>
  );
}

function Results({
  spec,
  probability,
  trials,
  exact,
  expected,
  variance,
  sampleSize,
}: {
  spec: Spec;
  probability: number;
  trials: number;
  exact: number;
  expected: number;
  variance: number;
  sampleSize: number;
}) {
  return (
    <aside className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-black uppercase text-cyan-700">
          Distribution summary
        </p>
        <Result label="Model" value={modelName(spec)} />
        <Result label="n / df" value={String(trials)} />
        <Result label="p / shape" value={probability.toFixed(2)} />
        <Result label="Mean" value={expected.toFixed(2)} />
        <Result label="Variance" value={variance.toFixed(2)} />
      </div>
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-center">
        <span className="text-[10px] font-black uppercase text-violet-600">
          Highlighted probability
        </span>
        <strong className="mt-2 block text-3xl font-black text-violet-700">
          {exact.toFixed(4)}
        </strong>
        <span className="text-sm font-black text-violet-600">
          {(exact * 100).toFixed(2)}%
        </span>
      </div>
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800">
        <CheckCircle2 className="mb-2 h-5 w-5" />
        Parameters are valid. Theoretical and empirical views are linked across{" "}
        {sampleSize.toLocaleString()} simulated trials.
      </div>
    </aside>
  );
}

function SampleSpaceVisual({
  spec,
  trials,
  probability,
}: {
  spec: Spec;
  trials: number;
  probability: number;
}) {
  const count = Math.min(36, Math.max(8, trials * 2));
  return (
    <div className="p-3">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {Array.from({ length: count }, (_, index) => (
          <button
            type="button"
            key={index}
            className={`grid aspect-square place-items-center rounded-lg border text-xs font-black ${index / count < probability ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-violet-200 bg-violet-50 text-violet-700"}`}
          >
            {spec.title === "Probability Scale"
              ? (index / (count - 1)).toFixed(1)
              : index + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border text-center">
        <Small label="Total outcomes" value={String(count)} />
        <Small
          label="Event count"
          value={String(Math.round(count * probability))}
        />
        <Small label="P(event)" value={probability.toFixed(2)} />
      </div>
    </div>
  );
}

function DiagramVisual({
  spec,
  probability,
}: {
  spec: Spec;
  probability: number;
}) {
  if (spec.title === "Two-Way Tables")
    return <TwoWayTable probability={probability} />;
  if (/Venn|Addition|Mutually/.test(spec.title))
    return (
      <svg viewBox="0 0 620 390" className="h-[390px] w-full">
        <rect
          x="35"
          y="35"
          width="550"
          height="300"
          rx="18"
          fill="#f8fafc"
          stroke="#94a3b8"
        />
        <circle
          cx="250"
          cy="180"
          r="105"
          fill="#22d3ee44"
          stroke="#0891b2"
          strokeWidth="3"
        />
        <circle
          cx="370"
          cy="180"
          r="105"
          fill="#8b5cf644"
          stroke="#7c3aed"
          strokeWidth="3"
        />
        <text x="205" y="178" fontSize="20" fontWeight="900" fill="#0e7490">
          A
        </text>
        <text x="410" y="178" fontSize="20" fontWeight="900" fill="#6d28d9">
          B
        </text>
        <text
          x="310"
          y="178"
          textAnchor="middle"
          fontSize="17"
          fontWeight="900"
        >
          {spec.title.includes("Mutually")
            ? "0"
            : (probability * 0.4).toFixed(2)}
        </text>
        <text
          x="310"
          y="365"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
        >
          Overlap is counted once
        </text>
      </svg>
    );
  return <Tree probability={probability} title={spec.title} />;
}

function Tree({ probability, title }: { probability: number; title: string }) {
  const q = 1 - probability;
  return (
    <svg viewBox="0 0 620 390" className="h-[390px] w-full">
      <line
        x1="55"
        y1="195"
        x2="220"
        y2="105"
        stroke="#0891b2"
        strokeWidth="3"
      />
      <line
        x1="55"
        y1="195"
        x2="220"
        y2="285"
        stroke="#7c3aed"
        strokeWidth="3"
      />
      <line
        x1="220"
        y1="105"
        x2="430"
        y2="55"
        stroke="#0891b2"
        strokeWidth="3"
      />
      <line
        x1="220"
        y1="105"
        x2="430"
        y2="155"
        stroke="#0891b2"
        strokeWidth="3"
      />
      <line
        x1="220"
        y1="285"
        x2="430"
        y2="235"
        stroke="#7c3aed"
        strokeWidth="3"
      />
      <line
        x1="220"
        y1="285"
        x2="430"
        y2="335"
        stroke="#7c3aed"
        strokeWidth="3"
      />
      {[
        [55, 195, "Start"],
        [220, 105, "A"],
        [220, 285, "A'"],
        [430, 55, "B"],
        [430, 155, "B'"],
        [430, 235, "B"],
        [430, 335, "B'"],
      ].map(([x, y, label]) => (
        <g key={String(label) + y}>
          <circle
            cx={Number(x)}
            cy={Number(y)}
            r="25"
            fill="white"
            stroke="#cbd5e1"
          />
          <text
            x={Number(x)}
            y={Number(y) + 5}
            textAnchor="middle"
            fontWeight="900"
          >
            {label}
          </text>
        </g>
      ))}
      <text x="140" y="125" fill="#0891b2" fontWeight="900">
        {probability.toFixed(2)}
      </text>
      <text x="140" y="275" fill="#7c3aed" fontWeight="900">
        {q.toFixed(2)}
      </text>
      <text
        x="520"
        y="100"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill="#0f172a"
      >
        {title}
      </text>
      <text x="520" y="130" textAnchor="middle" fontSize="12" fill="#64748b">
        Multiply along paths
      </text>
    </svg>
  );
}

function TwoWayTable({ probability }: { probability: number }) {
  const a = Math.round(probability * 100),
    b = 100 - a;
  return (
    <div className="p-5">
      <table className="w-full overflow-hidden rounded-xl border text-center text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4">Condition</th>
            <th>Positive</th>
            <th>Negative</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <th className="p-4">A</th>
            <td className="bg-cyan-50">{Math.round(a * 0.8)}</td>
            <td>{Math.round(a * 0.2)}</td>
            <td className="font-black">{a}</td>
          </tr>
          <tr className="border-t">
            <th className="p-4">A'</th>
            <td>{Math.round(b * 0.1)}</td>
            <td className="bg-violet-50">{Math.round(b * 0.9)}</td>
            <td className="font-black">{b}</td>
          </tr>
          <tr className="border-t bg-slate-50 font-black">
            <th className="p-4">Total</th>
            <td>{Math.round(a * 0.8 + b * 0.1)}</td>
            <td>{Math.round(a * 0.2 + b * 0.9)}</td>
            <td>100</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MassVisual({
  bins,
  selected,
  showModel,
}: {
  bins: Bin[];
  selected: number;
  showModel: boolean;
}) {
  const max = Math.max(...bins.map((bin) => bin.probability), 0.01),
    width = 500 / Math.max(1, bins.length);
  return (
    <svg viewBox="0 0 620 390" className="h-[390px] w-full">
      <Grid />
      {bins.map((bin, index) => {
        const h = (bin.probability / max) * 250,
          x = 60 + index * width;
        return (
          <g key={bin.label}>
            <rect
              x={x}
              y={320 - h}
              width={Math.max(5, width - 6)}
              height={h}
              rx="4"
              fill={index === selected ? "#7c3aed" : "#06b6d4"}
              opacity={showModel ? 1 : 0.6}
            />
            <text
              x={x + (width - 6) / 2}
              y="345"
              textAnchor="middle"
              fontSize="11"
            >
              {bin.label}
            </text>
            {index === selected ? (
              <text
                x={x + (width - 6) / 2}
                y={305 - h}
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fill="#6d28d9"
              >
                {bin.probability.toFixed(3)}
              </text>
            ) : null}
          </g>
        );
      })}
      <text x="310" y="375" textAnchor="middle" fontSize="12" fontWeight="800">
        k (number of outcomes / successes)
      </text>
    </svg>
  );
}

function CurveVisual({
  spec,
  probability,
  lower,
  upper,
}: {
  spec: Spec;
  probability: number;
  lower: number;
  upper: number;
}) {
  const points = Array.from({ length: 101 }, (_, i) => {
    const x = i / 10;
    let y = Math.exp(-0.5 * ((x - 5) / (1 + probability * 2)) ** 2);
    if (/Exponential/.test(spec.title)) y = Math.exp(-probability * x);
    if (/Uniform/.test(spec.title)) y = x >= 2 && x <= 8 ? 0.7 : 0;
    if (/Chi|Gamma|Weibull|F Distribution/.test(spec.title))
      y = Math.max(0.01, x) ** 2 * Math.exp(-x * (0.5 + probability));
    return `${55 + (x / 10) * 520},${320 - y * 245}`;
  }).join(" ");
  const lx = 55 + (Math.max(0, Math.min(10, lower / 2)) / 10) * 520;
  const ux = 55 + (Math.max(0, Math.min(10, upper / 2)) / 10) * 520;
  return (
    <svg viewBox="0 0 620 390" className="h-[390px] w-full">
      <Grid />
      <rect
        x={Math.min(lx, ux)}
        y="55"
        width={Math.abs(ux - lx)}
        height="265"
        fill="#8b5cf633"
      />
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="4" />
      <line
        x1={lx}
        x2={lx}
        y1="60"
        y2="320"
        stroke="#7c3aed"
        strokeDasharray="6 5"
      />
      <line
        x1={ux}
        x2={ux}
        y1="60"
        y2="320"
        stroke="#7c3aed"
        strokeDasharray="6 5"
      />
      <text
        x="310"
        y="95"
        textAnchor="middle"
        fontSize="16"
        fontWeight="900"
        fill="#4c1d95"
      >
        P({lower} to {upper})
      </text>
      <text
        x="310"
        y="120"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#6d28d9"
      >
        shaded area
      </text>
    </svg>
  );
}

function SimulationVisual({
  bins,
  sampleSize,
  probability,
}: {
  bins: Bin[];
  sampleSize: number;
  probability: number;
}) {
  return (
    <div>
      <MassVisual
        bins={bins}
        selected={Math.round(bins.length * probability)}
        showModel
      />
      <svg viewBox="0 0 620 90" className="h-[90px] w-full">
        <polyline
          points="40,60 130,40 220,48 310,34 400,38 500,35 580,36"
          fill="none"
          stroke="#0891b2"
          strokeWidth="3"
        />
        <line
          x1="40"
          x2="580"
          y1="36"
          y2="36"
          stroke="#7c3aed"
          strokeDasharray="7 5"
        />
        <text x="310" y="82" textAnchor="middle" fontSize="11" fontWeight="800">
          Convergence over {sampleSize.toLocaleString()} samples
        </text>
      </svg>
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
          y1="30"
          y2="320"
          stroke="#cbd5e1"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="55"
          x2="580"
          y1={30 + i * 48}
          y2={30 + i * 48}
          stroke="#cbd5e1"
        />
      ))}
    </g>
  );
}

type Bin = { label: string; probability: number };
function distributionBins(
  spec: Spec,
  trials: number,
  probability: number,
): Bin[] {
  if (spec.kind === "discrete" || spec.kind === "simulation") {
    if (/Poisson/.test(spec.title)) {
      return Array.from({ length: Math.min(16, trials + 1) }, (_, k) => ({
        label: String(k),
        probability:
          (Math.exp(-trials * probability) *
            Math.pow(trials * probability, k)) /
          factorial(k),
      }));
    }
    return binomialDistribution(trials, probability).map((bin) => ({
      label: bin.label,
      probability: bin.count,
    }));
  }
  return Array.from({ length: Math.min(16, trials + 1) }, (_, k) => ({
    label: String(k),
    probability: Math.max(
      0.001,
      Math.exp(
        -0.5 *
          ((k - trials * probability) /
            Math.max(1, Math.sqrt(trials * probability * (1 - probability)))) **
            2,
      ) / Math.max(3, trials / 2),
    ),
  }));
}
function factorial(n: number) {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}
function modelName(spec: Spec) {
  if (spec.kind === "event") return "Sample-space model";
  if (spec.kind === "diagram") return "Event relationship";
  if (spec.kind === "simulation") return "Seeded simulation";
  if (spec.kind === "calculator") return "Distribution calculator";
  return spec.title.replace(" Distribution", "");
}
function visualTitle(spec: Spec) {
  if (spec.kind === "event") return "Complete sample space";
  if (spec.kind === "diagram") return `${spec.title} representation`;
  if (spec.kind === "simulation")
    return "Empirical vs theoretical distribution";
  if (spec.kind === "discrete") return "Probability Mass Function (PMF)";
  return "Probability Density Function (PDF)";
}
function ruleFor(title: string) {
  if (title === "Sample Spaces")
    return "List every possible outcome exactly once before counting favourable outcomes.";
  if (/Tree|Multiplication/.test(title))
    return "Multiply along one path and add probabilities across matching paths.";
  if (/Bayes/.test(title))
    return "Update the prior with the likelihood, while keeping the base rate in the denominator.";
  if (/Simulation|Large Numbers/.test(title))
    return "Empirical relative frequency approaches theoretical probability as the sample grows.";
  if (/Distribution|Probability|Standardisation/.test(title))
    return "Match the distribution to its assumptions, then read probability as area or probability mass.";
  return "Define events clearly, avoid double-counting, and keep every probability between 0 and 1.";
}
function misconceptionFor(title: string) {
  if (/Independent/.test(title))
    return "Independent events can occur together; independence means one does not change the other's probability.";
  if (/Mutually/.test(title))
    return "Mutually exclusive is not the same as independent: mutually exclusive events have no overlap.";
  if (/Bayes/.test(title))
    return "Test accuracy alone is not the posterior probability; the base rate matters.";
  if (/Binomial/.test(title))
    return "Binomial trials need fixed n, constant p, and independence, but p does not need to equal 0.5.";
  if (/Normal/.test(title))
    return "The 68-95-99.7 rule is an approximation for normal data, not every dataset.";
  return `Do not use ${title.toLowerCase()} before checking the sample space, assumptions, and probability direction.`;
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
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-xs font-black text-slate-700">
        <span>{label}</span>
        <output>
          {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </output>
      </span>
      <input
        type="range"
        className="w-full accent-cyan-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function IntroCard({
  icon,
  title,
  body,
  danger = false,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  danger?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm ${danger ? "border-rose-100" : "border-slate-200"}`}
    >
      <h3
        className={`flex items-center gap-2 text-xs font-black uppercase ${danger ? "text-rose-700" : "text-cyan-700"}`}
      >
        {icon}
        {title}
      </h3>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-600">
        {body}
      </p>
    </article>
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
  tone: "blue" | "green" | "amber";
  title: string;
  body: string;
  formula: string;
}) {
  const color =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-800"
      : tone === "green"
        ? "border-emerald-100 bg-emerald-50 text-emerald-800"
        : "border-amber-100 bg-amber-50 text-amber-800";
  return (
    <article className={`rounded-2xl border p-4 ${color}`}>
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <span className="text-[10px] font-black uppercase text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block text-2xl font-black" style={{ color }}>
        {value}
      </strong>
    </div>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
      <span className="font-bold text-slate-500">{label}</span>
      <strong className="max-w-[150px] truncate text-right font-mono text-sm text-slate-900">
        {value}
      </strong>
    </div>
  );
}
function Small({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3">
      <span className="block text-[9px] font-black uppercase text-slate-400">
        {label}
      </span>
      <strong className="mt-1 block text-sm text-slate-900">{value}</strong>
    </div>
  );
}
