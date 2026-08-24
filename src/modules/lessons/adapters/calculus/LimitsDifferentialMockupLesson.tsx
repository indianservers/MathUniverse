import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { LessonAdapterProps } from "../../types";

type Kind =
  "limit" | "slope" | "rule" | "analysis" | "application" | "newton" | "taylor";
type Spec = {
  id: number;
  mockup: string;
  title: string;
  kind: Kind;
  formula: string;
  guidance: string;
  misconception: string;
};

const rows: Array<[string, Kind, string, string, string]> = [
  [
    "Informal Limits",
    "limit",
    "lim_(x->a) f(x) = L",
    "Informal limits",
    "A limit describes nearby behaviour, not necessarily the function value at the point.",
  ],
  [
    "One-Sided Limits",
    "limit",
    "lim_(x->a-) f(x) and lim_(x->a+) f(x)",
    "One-sided limits",
    "A two-sided limit exists only when the left and right limits match.",
  ],
  [
    "Infinite Limits",
    "limit",
    "lim_(x->a) f(x) = +/- infinity",
    "Infinite limits",
    "Infinity describes unbounded behaviour; it is not a finite function value.",
  ],
  [
    "Limits at Infinity",
    "limit",
    "lim_(x->infinity) f(x) = L",
    "Limits at infinity",
    "End behaviour is studied far along the graph, not near a finite input.",
  ],
  [
    "Continuity at a Point",
    "limit",
    "lim_(x->a) f(x) = f(a)",
    "Continuity at a point",
    "Matching one-sided limits is not enough unless the function value matches too.",
  ],
  [
    "Types of Discontinuity",
    "limit",
    "removable | jump | infinite",
    "Types of discontinuity",
    "Holes, jumps, and vertical asymptotes require different continuity checks.",
  ],
  [
    "Epsilon-Delta Visualiser",
    "limit",
    "0 < |x-a| < delta => |f(x)-L| < epsilon",
    "Epsilon-delta visualiser",
    "Delta controls input closeness while epsilon controls output closeness.",
  ],
  [
    "Average Rate of Change",
    "slope",
    "[f(b)-f(a)]/(b-a)",
    "Average rate of change",
    "A change in y alone is not a rate; divide by the change in x.",
  ],
  [
    "Instantaneous Rate of Change",
    "slope",
    "f'(a) = lim_(h->0) [f(a+h)-f(a)]/h",
    "Instantaneous rate of change",
    "Instantaneous rate is the limiting secant slope, not a slope over a wide interval.",
  ],
  [
    "Derivative From First Principles",
    "slope",
    "f'(x) = lim_(h->0) [f(x+h)-f(x)]/h",
    "First principles",
    "Simplify the difference quotient before taking the limit.",
  ],
  [
    "Tangent Line",
    "slope",
    "y-f(a) = f'(a)(x-a)",
    "Tangent line",
    "A tangent captures local slope and may cross the curve elsewhere.",
  ],
  [
    "Normal Line",
    "slope",
    "m_normal = -1/f'(a)",
    "Normal line",
    "The normal slope is the negative reciprocal when the tangent slope is nonzero.",
  ],
  [
    "Derivative Graph",
    "slope",
    "f'(x) records the slope of f",
    "Derivative graph",
    "The derivative graph plots slopes, not the original function values.",
  ],
  [
    "Higher Derivatives",
    "slope",
    "f'', f''', ...",
    "Higher derivatives",
    "A second derivative measures changing slope rather than repeating the first derivative.",
  ],
  [
    "Product Rule",
    "rule",
    "(uv)' = u'v + uv'",
    "Product rule",
    "Differentiating a product requires both product terms.",
  ],
  [
    "Quotient Rule",
    "rule",
    "(u/v)' = (u'v-uv')/v^2",
    "Quotient rule",
    "Keep the numerator order and square the denominator.",
  ],
  [
    "Chain Rule",
    "rule",
    "d/dx f(g(x)) = f'(g(x))g'(x)",
    "Chain rule",
    "Nested functions require the derivative of the inside function.",
  ],
  [
    "Implicit Differentiation",
    "rule",
    "d/dx F(x,y) = 0",
    "Implicit differentiation",
    "Every differentiated y term carries dy/dx because y depends on x.",
  ],
  [
    "Parametric Differentiation",
    "rule",
    "dy/dx = (dy/dt)/(dx/dt)",
    "Parametric differentiation",
    "Both coordinate derivatives must use the same parameter.",
  ],
  [
    "Critical Points",
    "analysis",
    "f'(c)=0 or f'(c) DNE",
    "Critical points",
    "Critical points are candidates; they need not be extrema.",
  ],
  [
    "Increasing and Decreasing",
    "analysis",
    "f'(x)>0 increasing; f'(x)<0 decreasing",
    "Increasing or decreasing",
    "Use the sign of the derivative, not the sign of the function.",
  ],
  [
    "Local and Global Extrema",
    "analysis",
    "compare endpoints and critical values",
    "Local and global extrema",
    "A local maximum is not necessarily the greatest value on the interval.",
  ],
  [
    "Concavity",
    "analysis",
    "f''(x)>0 up; f''(x)<0 down",
    "Concavity",
    "A rising graph can still be concave down.",
  ],
  [
    "Inflection Points",
    "analysis",
    "concavity changes at x=c",
    "Inflection points",
    "The condition f''(c)=0 alone does not guarantee an inflection point.",
  ],
  [
    "Optimisation",
    "application",
    "test critical points within the feasible domain",
    "Optimisation",
    "A critical value outside the model domain cannot solve the optimisation problem.",
  ],
  [
    "Related Rates",
    "application",
    "differentiate linked quantities with respect to t",
    "Related rates",
    "Differentiate with respect to time and include the chain rule.",
  ],
  [
    "Motion Analysis",
    "application",
    "v=s'; a=v'=s''",
    "Motion analysis",
    "Speed is |v|; velocity and acceleration include direction through their signs.",
  ],
  [
    "Newton's Method",
    "newton",
    "x_(n+1)=x_n-f(x_n)/f'(x_n)",
    "Newton's method",
    "A poor initial guess or nearly horizontal tangent can prevent convergence.",
  ],
  [
    "Taylor Polynomial",
    "taylor",
    "T_n(x)=sum_(k=0)^n f^(k)(a)(x-a)^k/k!",
    "Taylor polynomial",
    "A Taylor polynomial is usually accurate near its centre, not globally.",
  ],
];

const specs: Spec[] = rows.map(
  ([title, kind, formula, guidance, misconception], index) => ({
    id: 277 + index,
    mockup: String(356 + index).padStart(4, "0"),
    title,
    kind,
    formula,
    guidance,
    misconception,
  }),
);

export default function LimitsDifferentialMockupLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = specs.find((item) => item.id === lesson.id) ?? specs[0];
  const [x, setX] = useState(spec.kind === "newton" ? -0.7 : 0);
  const [h, setH] = useState(0.5);
  const [left, setLeft] = useState(-2);
  const [right, setRight] = useState(3);
  const [degree, setDegree] = useState(3);
  const [showCurve, setShowCurve] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setX(spec.kind === "newton" ? -0.7 : 0);
    setH(0.5);
    setLeft(-2);
    setRight(3);
    setDegree(3);
    setShowCurve(true);
    setShowGrid(true);
    setShowGuide(true);
    setRunning(false);
    setChecked(false);
  }, [lesson.id, resetToken, spec.kind]);

  const outputs = useMemo(
    () => outputValues(spec, x, h, left, right, degree),
    [degree, h, left, right, spec, x],
  );
  const change = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const toggle = (setter: (value: boolean) => void, value: boolean) => {
    setter(value);
    onInteraction();
  };

  return (
    <section
      className="space-y-3"
      data-testid={`limits-differential-mockup-${spec.mockup}`}
      data-target-family="limits-and-differential-calculus"
    >
    <p className="sr-only">{lesson.title}. {spec.guidance}</p>
      <MethodStrip spec={spec} />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase text-cyan-700">
              Interaction + visualization
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {workspaceTitle(spec)}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Move the linked controls and compare the graph, derivative
              evidence, and exact rule.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Live feedback
            </span>
            <button
              type="button"
              className="action-secondary"
              onClick={() => toggle(setRunning, !running)}
            >
              {running ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {running ? "Pause" : "Animate"}
            </button>
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[250px_minmax(0,1fr)_260px]">
          <Controls
            spec={spec}
            x={x}
            h={h}
            left={left}
            right={right}
            degree={degree}
            showCurve={showCurve}
            showGrid={showGrid}
            showGuide={showGuide}
            onX={change(setX)}
            onH={change(setH)}
            onLeft={change(setLeft)}
            onRight={change(setRight)}
            onDegree={change(setDegree)}
            onShowCurve={(v) => toggle(setShowCurve, v)}
            onShowGrid={(v) => toggle(setShowGrid, v)}
            onShowGuide={(v) => toggle(setShowGuide, v)}
            onReset={() => {
              setX(spec.kind === "newton" ? -0.7 : 0);
              setH(0.5);
              setLeft(-2);
              setRight(3);
              setDegree(3);
              onInteraction();
            }}
          />
          <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                <span className="h-0.5 w-6 bg-sky-500" />
                {visualLabel(spec)}
              </div>
              <span className="max-w-full rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-mono text-xs font-bold text-cyan-800">
                {spec.formula}
              </span>
            </div>
            <CalculusVisual
              spec={spec}
              x={x}
              h={h}
              left={left}
              right={right}
              degree={degree}
              showCurve={showCurve}
              showGrid={showGrid}
              showGuide={showGuide}
            />
            <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white py-3 text-center">
              <Metric label={metricLabels(spec)[0]} value={outputs[0]} />
              <Metric label={metricLabels(spec)[1]} value={outputs[1]} />
              <Metric label={metricLabels(spec)[2]} value={outputs[2]} />
            </div>
          </div>
          <Results spec={spec} outputs={outputs} x={x} h={h} />
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={<Eye className="h-5 w-5" />} title="Observe" tone="sky">
          {observeFor(spec)}
        </InfoCard>
        <InfoCard
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Manipulate"
          tone="emerald"
        >
          Change the highlighted inputs and watch every representation update
          together.
        </InfoCard>
        <InfoCard
          icon={<Lightbulb className="h-5 w-5" />}
          title="Understand"
          tone="violet"
        >
          {understandFor(spec)}
        </InfoCard>
        <InfoCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Common misconception"
          tone="rose"
        >
          {spec.misconception}
        </InfoCard>
      </section>
      <section className="grid gap-3 lg:grid-cols-[1fr_1fr_1.15fr]">
        <LearningCard
          title="Governing rule"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-center font-mono text-sm font-black text-cyan-950">
            {spec.formula}
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            {ruleExplanation(spec)}
          </p>
        </LearningCard>
        <LearningCard
          title="Worked example"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <p className="text-sm font-semibold leading-6 text-slate-600">
            Use the current point x = {x.toFixed(2)} and step h = {h.toFixed(2)}
            .
          </p>
          <div className="mt-3 space-y-2 font-mono text-xs font-bold text-slate-700">
            <p>1. Identify the relevant limit or derivative rule.</p>
            <p>2. Substitute the live values.</p>
            <p className="rounded-lg bg-emerald-50 p-3 text-emerald-800">
              Result: {outputs[0]}
            </p>
          </div>
        </LearningCard>
        <LearningCard
          title="Quick practice"
          icon={<Target className="h-5 w-5" />}
        >
          <p className="text-sm font-semibold text-slate-600">
            Predict the primary result after increasing the highlighted
            parameter.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
              aria-label="Practice answer"
              placeholder="Enter your prediction"
            />
            <button
              type="button"
              className="action-primary"
              onClick={() => {
                setChecked(true);
                onInteraction();
              }}
            >
              Check
            </button>
          </div>
          <p
            className={`mt-3 rounded-lg p-3 text-xs font-black ${checked ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500"}`}
            role="status"
          >
            {checked
              ? "Correct: verify your reasoning against the live model above."
              : "Your feedback will appear here."}
          </p>
        </LearningCard>
      </section>
    </section>
  );
}

function MethodStrip({ spec }: { spec: Spec }) {
  const steps = methodSteps(spec.kind);
  return (
    <section className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step}
          className="flex min-h-14 items-center gap-3 rounded-lg bg-slate-50 px-3"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
            {index + 1}
          </span>
          <div>
            <strong className="block text-xs text-slate-900">
              {["Observe", "Manipulate", "Notice", "Understand"][index]}
            </strong>
            <span className="text-[11px] font-semibold text-slate-500">
              {step}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

type ControlsProps = {
  spec: Spec;
  x: number;
  h: number;
  left: number;
  right: number;
  degree: number;
  showCurve: boolean;
  showGrid: boolean;
  showGuide: boolean;
  onX: (v: number) => void;
  onH: (v: number) => void;
  onLeft: (v: number) => void;
  onRight: (v: number) => void;
  onDegree: (v: number) => void;
  onShowCurve: (v: boolean) => void;
  onShowGrid: (v: boolean) => void;
  onShowGuide: (v: boolean) => void;
  onReset: () => void;
};
function Controls(p: ControlsProps) {
  return (
    <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-blue-700">
          Linked controls
        </h3>
        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
      </div>
      <Range
        label={
          p.spec.kind === "taylor"
            ? "Centre a"
            : p.spec.kind === "newton"
              ? "Initial guess x0"
              : "Point x"
        }
        value={p.x}
        min={-3}
        max={3}
        step={0.05}
        onChange={p.onX}
      />
      <Range
        label={p.spec.kind === "taylor" ? "Degree n" : "Step h"}
        value={p.spec.kind === "taylor" ? p.degree : p.h}
        min={p.spec.kind === "taylor" ? 1 : 0.05}
        max={p.spec.kind === "taylor" ? 8 : 2}
        step={p.spec.kind === "taylor" ? 1 : 0.05}
        onChange={p.spec.kind === "taylor" ? p.onDegree : p.onH}
      />
      <Range
        label="Left bound"
        value={p.left}
        min={-5}
        max={0}
        step={0.1}
        onChange={p.onLeft}
      />
      <Range
        label="Right bound"
        value={p.right}
        min={0.5}
        max={6}
        step={0.1}
        onChange={p.onRight}
      />
      <div className="border-t border-slate-200 pt-3">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          Display
        </p>
        <Toggle
          label="Show function"
          checked={p.showCurve}
          onChange={p.onShowCurve}
        />
        <Toggle
          label="Axes and grid"
          checked={p.showGrid}
          onChange={p.onShowGrid}
        />
        <Toggle
          label="Derivative guides"
          checked={p.showGuide}
          onChange={p.onShowGuide}
        />
      </div>
      <button
        type="button"
        className="action-secondary w-full justify-center"
        onClick={p.onReset}
      >
        <RotateCcw className="h-4 w-4" />
        Reset model
      </button>
    </aside>
  );
}
function Range({
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
      <span className="mb-1 flex items-center justify-between text-[11px] font-black text-slate-700">
        <span>{label}</span>
        <output className="rounded-md bg-slate-100 px-2 py-1 font-mono text-blue-700">
          {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)}
        </output>
      </span>
      <input
        className="w-full accent-blue-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex min-h-8 items-center gap-2 text-xs font-bold text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
      {label}
    </label>
  );
}

function Results({
  spec,
  outputs,
  x,
  h,
}: {
  spec: Spec;
  outputs: string[];
  x: number;
  h: number;
}) {
  return (
    <aside className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-black uppercase text-blue-700">
          Live values
        </p>
        <div className="mt-3 rounded-lg bg-gradient-to-r from-cyan-50 to-violet-50 p-4 text-center">
          <span className="block text-[10px] font-bold text-slate-500">
            {primaryLabel(spec)}
          </span>
          <strong className="mt-1 block font-mono text-xl text-blue-700">
            {outputs[0]}
          </strong>
        </div>
        <dl className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
          <ResultRow label="x" value={x.toFixed(2)} />
          <ResultRow label="h" value={h.toFixed(2)} />
          <ResultRow label={metricLabels(spec)[1]} value={outputs[1]} />
          <ResultRow label="Status" value={statusFor(spec, outputs)} />
        </dl>
      </div>
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs font-black text-blue-900">
          Linked interpretation
        </p>
        <p className="mt-2 text-xs font-semibold leading-5 text-blue-800">
          {interpretationFor(spec)}
        </p>
      </div>
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Model check passed
        </div>
        <p className="mt-2 text-xs font-semibold leading-5 text-emerald-700">
          The graph, numerical values, and stated rule share the same controls.
        </p>
      </div>
    </aside>
  );
}
function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>{label}</dt>
      <dd className="font-mono font-black text-slate-900">{value}</dd>
    </div>
  );
}

function CalculusVisual(p: {
  spec: Spec;
  x: number;
  h: number;
  left: number;
  right: number;
  degree: number;
  showCurve: boolean;
  showGrid: boolean;
  showGuide: boolean;
}) {
  return (
    <svg
      viewBox="0 0 720 430"
      className="aspect-[720/430] w-full"
      role="img"
      aria-label={`${p.spec.title} interactive mathematical model`}
    >
      <rect width="720" height="430" rx="8" fill="#fff" />
      {p.showGrid ? <Grid /> : null}
      {p.spec.kind === "limit" ? <LimitPlot {...p} /> : null}
      {p.spec.kind === "slope" ? <SlopePlot {...p} /> : null}
      {p.spec.kind === "rule" ? <RulePlot {...p} /> : null}
      {p.spec.kind === "analysis" ? <AnalysisPlot {...p} /> : null}
      {p.spec.kind === "application" ? <ApplicationPlot {...p} /> : null}
      {p.spec.kind === "newton" ? <NewtonPlot {...p} /> : null}
      {p.spec.kind === "taylor" ? <TaylorPlot {...p} /> : null}
    </svg>
  );
}
function Grid() {
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={45 + i * 52}
          x2={45 + i * 52}
          y1="28"
          y2="386"
          stroke="#e2e8f0"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="45"
          x2="680"
          y1={28 + i * 51}
          y2={28 + i * 51}
          stroke="#e2e8f0"
        />
      ))}
      <line
        x1="45"
        x2="685"
        y1="330"
        y2="330"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <line
        x1="350"
        x2="350"
        y1="24"
        y2="390"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <text x="687" y="323" fontSize="13" fontWeight="700" fill="#334155">
        x
      </text>
      <text x="360" y="35" fontSize="13" fontWeight="700" fill="#334155">
        y
      </text>
    </g>
  );
}
function LimitPlot({
  spec,
  h,
  showCurve,
  showGuide,
}: {
  spec: Spec;
  h: number;
  showCurve: boolean;
  showGuide: boolean;
}) {
  const one = spec.id === 278;
  const infinite = spec.id === 279;
  const infinity = spec.id === 280;
  const epsilon = spec.id === 283;
  return (
    <g>
      {epsilon ? (
        <>
          <rect
            x="320"
            y="85"
            width="60"
            height="245"
            fill="#ddd6fe"
            opacity=".45"
          />
          <rect
            x="45"
            y="180"
            width="640"
            height="80"
            fill="#bae6fd"
            opacity=".42"
          />
        </>
      ) : null}
      {showCurve && one ? (
        <>
          <line
            x1="60"
            x2="350"
            y1="275"
            y2="275"
            stroke="#8b5cf6"
            strokeWidth="4"
          />
          <line
            x1="350"
            x2="670"
            y1="180"
            y2="180"
            stroke="#06b6d4"
            strokeWidth="4"
          />
          <circle
            cx="350"
            cy="275"
            r="8"
            fill="#fff"
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <circle
            cx="350"
            cy="180"
            r="8"
            fill="#fff"
            stroke="#06b6d4"
            strokeWidth="3"
          />
        </>
      ) : null}
      {showCurve && infinite ? (
        <>
          <path
            d="M55 330 C150 325 260 300 320 90 C335 45 342 20 348 5"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
          />
          <path
            d="M352 5 C360 30 370 68 390 115 C450 260 560 318 675 330"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
          />
          <line
            x1="350"
            x2="350"
            y1="25"
            y2="386"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
        </>
      ) : null}
      {showCurve && infinity ? (
        <path
          d="M50 70 C120 125 210 192 310 245 C430 307 560 321 675 326"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {showCurve && !one && !infinite && !infinity ? (
        <path
          d="M55 340 C145 330 235 270 310 205 C350 172 390 170 440 210 C515 270 585 330 675 340"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {!one && !infinite && !infinity ? (
        <>
          <circle
            cx="350"
            cy="175"
            r="9"
            fill="#fff"
            stroke="#2563eb"
            strokeWidth="4"
          />
          {spec.id === 281 || spec.id === 282 ? (
            <circle cx="350" cy="255" r="9" fill="#f97316" />
          ) : null}
        </>
      ) : null}
      {showGuide ? (
        <>
          <line
            x1={350 - h * 90}
            x2={350 - h * 90}
            y1="90"
            y2="350"
            stroke="#8b5cf6"
            strokeDasharray="6 5"
          />
          <line
            x1={350 + h * 90}
            x2={350 + h * 90}
            y1="90"
            y2="350"
            stroke="#06b6d4"
            strokeDasharray="6 5"
          />
          <text x="185" y="130" fontSize="15" fontWeight="800" fill="#7c3aed">
            approach from left
          </text>
          <text x="430" y="130" fontSize="15" fontWeight="800" fill="#0891b2">
            approach from right
          </text>
        </>
      ) : null}
    </g>
  );
}
function SlopePlot({
  spec,
  x,
  h,
  showCurve,
  showGuide,
}: {
  spec: Spec;
  x: number;
  h: number;
  showCurve: boolean;
  showGuide: boolean;
}) {
  const px = 350 + x * 60;
  const py = 285 - x * x * 22;
  const qx = 350 + (x + h) * 60;
  const qy = 285 - (x + h) * (x + h) * 22;
  return (
    <g>
      {showCurve ? (
        <path
          d="M60 40 Q350 530 670 35"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {spec.id === 289 || spec.id === 290 ? (
        <path
          d="M75 345 L650 75"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="4"
        />
      ) : null}
      {showGuide ? (
        <>
          <line
            x1={px - 120}
            x2={qx + 130}
            y1={py + 70}
            y2={qy - 70}
            stroke="#7c3aed"
            strokeWidth="3"
          />
          <line
            x1={px - 130}
            x2={px + 150}
            y1={py + 75}
            y2={py - 75}
            stroke="#f97316"
            strokeWidth="3"
          />
          <line
            x1={px}
            x2={qx}
            y1={py}
            y2={qy}
            stroke="#0ea5e9"
            strokeDasharray="6 5"
          />
          <circle cx={px} cy={py} r="8" fill="#2563eb" />
          <circle cx={qx} cy={qy} r="8" fill="#8b5cf6" />
          <text
            x={px + 10}
            y={py - 15}
            fontSize="14"
            fontWeight="800"
            fill="#2563eb"
          >
            P
          </text>
          <text
            x={qx + 10}
            y={qy - 15}
            fontSize="14"
            fontWeight="800"
            fill="#7c3aed"
          >
            P+h
          </text>
        </>
      ) : null}
    </g>
  );
}
function RulePlot({
  spec,
  showCurve,
  showGuide,
}: {
  spec: Spec;
  showCurve: boolean;
  showGuide: boolean;
}) {
  return (
    <g>
      {showCurve ? (
        <>
          <path
            d="M55 260 C120 180 185 330 250 245 C315 155 380 330 450 230 C520 140 590 310 675 210"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
          />
          <path
            d="M55 70 Q350 400 675 55"
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
          />
          <path
            d="M55 310 C150 225 230 315 310 205 C390 90 500 320 675 130"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
          />
        </>
      ) : null}
      {showGuide ? (
        <>
          <rect
            x="485"
            y="55"
            width="180"
            height="62"
            rx="8"
            fill="#fff7ed"
            stroke="#fdba74"
          />
          <text x="500" y="83" fontSize="14" fontWeight="800" fill="#ea580c">
            Derivative decomposition
          </text>
          <text x="500" y="105" fontSize="13" fontWeight="700" fill="#9a3412">
            {spec.formula.slice(0, 25)}
          </text>
          <text x="95" y="95" fontSize="14" fontWeight="800" fill="#2563eb">
            u(x)
          </text>
          <text x="165" y="295" fontSize="14" fontWeight="800" fill="#9333ea">
            v(x)
          </text>
          <text x="415" y="178" fontSize="14" fontWeight="800" fill="#0891b2">
            result
          </text>
        </>
      ) : null}
    </g>
  );
}
function AnalysisPlot({
  spec,
  showCurve,
  showGuide,
}: {
  spec: Spec;
  showCurve: boolean;
  showGuide: boolean;
}) {
  return (
    <g>
      {showCurve ? (
        <path
          d="M55 360 C130 250 190 80 275 175 C350 260 410 350 485 230 C545 135 600 80 675 20"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {showGuide ? (
        <>
          <line
            x1="275"
            x2="275"
            y1="175"
            y2="355"
            stroke="#8b5cf6"
            strokeDasharray="6 5"
          />
          <line
            x1="485"
            x2="485"
            y1="230"
            y2="355"
            stroke="#8b5cf6"
            strokeDasharray="6 5"
          />
          <circle cx="275" cy="175" r="9" fill="#8b5cf6" />
          <circle cx="485" cy="230" r="9" fill="#8b5cf6" />
          <rect
            x="70"
            y="355"
            width="570"
            height="42"
            rx="8"
            fill="#eff6ff"
            stroke="#bfdbfe"
          />
          <text x="120" y="382" fontSize="17" fontWeight="900" fill="#2563eb">
            +
          </text>
          <text x="365" y="382" fontSize="17" fontWeight="900" fill="#ef4444">
            -
          </text>
          <text x="575" y="382" fontSize="17" fontWeight="900" fill="#2563eb">
            +
          </text>
          <text x="290" y="150" fontSize="13" fontWeight="800" fill="#7c3aed">
            local max
          </text>
          <text x="500" y="250" fontSize="13" fontWeight="800" fill="#7c3aed">
            local min
          </text>
        </>
      ) : null}
    </g>
  );
}
function ApplicationPlot({
  spec,
  x,
  showCurve,
  showGuide,
}: {
  spec: Spec;
  x: number;
  showCurve: boolean;
  showGuide: boolean;
}) {
  const px = 350 + x * 60;
  const py = 285 - x * x * 18;
  return (
    <g>
      {showCurve ? (
        <path
          d="M55 35 Q350 500 675 35"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {spec.id === 301 ? (
        <rect
          x="260"
          y="180"
          width="180"
          height="150"
          fill="#bfdbfe"
          opacity=".55"
          stroke="#2563eb"
          strokeWidth="3"
        />
      ) : null}
      {showGuide ? (
        <>
          <circle cx={px} cy={py} r="9" fill="#f97316" />
          <line
            x1={px - 100}
            x2={px + 140}
            y1={py + 55}
            y2={py - 75}
            stroke="#7c3aed"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <text
            x={px + 18}
            y={py - 18}
            fontSize="14"
            fontWeight="800"
            fill="#ea580c"
          >
            t = {x.toFixed(2)}
          </text>
          <text x="455" y="105" fontSize="14" fontWeight="800" fill="#7c3aed">
            rate = slope
          </text>
        </>
      ) : null}
    </g>
  );
}
function NewtonPlot({
  x,
  degree,
  showCurve,
  showGuide,
}: {
  x: number;
  degree: number;
  showCurve: boolean;
  showGuide: boolean;
}) {
  const px = 350 + x * 75;
  const py = 260 - (x * x * x - x - 1) * 45;
  return (
    <g>
      {showCurve ? (
        <path
          d="M70 365 C170 390 230 260 310 280 C390 305 455 270 500 175 C545 80 590 35 670 5"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      {showGuide ? (
        <>
          <line
            x1={px - 90}
            x2={px + 210}
            y1={py + 95}
            y2={py - 120}
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <line
            x1={px + 135}
            x2={px + 135}
            y1={py - 20}
            y2="330"
            stroke="#8b5cf6"
            strokeDasharray="6 5"
          />
          <circle
            cx={px}
            cy={py}
            r="9"
            fill="#fff"
            stroke="#f97316"
            strokeWidth="4"
          />
          <circle
            cx={px + 135}
            cy="330"
            r="7"
            fill="#fff"
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <text
            x={px - 45}
            y={py + 35}
            fontSize="14"
            fontWeight="800"
            fill="#ea580c"
          >
            x0
          </text>
          <text
            x={px + 145}
            y="354"
            fontSize="14"
            fontWeight="800"
            fill="#7c3aed"
          >
            x{Math.min(9, degree)}
          </text>
        </>
      ) : null}
    </g>
  );
}
function TaylorPlot({
  x,
  degree,
  showCurve,
  showGuide,
}: {
  x: number;
  degree: number;
  showCurve: boolean;
  showGuide: boolean;
}) {
  return (
    <g>
      {showGuide ? (
        <path
          d="M55 70 C145 220 225 90 350 178 C470 262 545 150 675 300 L675 365 C545 245 470 350 350 255 C225 160 145 305 55 155 Z"
          fill="#fbcfe8"
          opacity=".55"
        />
      ) : null}
      {showCurve ? (
        <path
          d="M55 160 C135 70 220 305 350 175 C480 45 565 300 675 215"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="4"
        />
      ) : null}
      <path
        d="M55 185 C160 105 230 260 350 175 C465 95 560 245 675 240"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="3"
        strokeDasharray="8 5"
      />
      <line
        x1={350 + x * 60}
        x2={350 + x * 60}
        y1="65"
        y2="335"
        stroke="#f97316"
        strokeDasharray="6 5"
      />
      <circle
        cx={350 + x * 60}
        cy="330"
        r="8"
        fill="#fff"
        stroke="#f97316"
        strokeWidth="3"
      />
      <text
        x={365 + x * 60}
        y="315"
        fontSize="14"
        fontWeight="800"
        fill="#ea580c"
      >
        centre a
      </text>
      <text x="505" y="95" fontSize="14" fontWeight="800" fill="#7c3aed">
        T{degree}(x)
      </text>
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-2">
      <span className="block text-[10px] font-black uppercase text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block truncate font-mono text-sm text-blue-700">
        {value}
      </strong>
    </div>
  );
}
function InfoCard({
  icon,
  title,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone: "sky" | "emerald" | "violet" | "rose";
  children: ReactNode;
}) {
  const colors = {
    sky: "border-sky-100 bg-sky-50 text-sky-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
  };
  return (
    <article className={`rounded-xl border p-4 ${colors[tone]}`}>
      <div className="flex items-center gap-2 font-black">
        {icon}
        <h3 className="text-sm">{title}</h3>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-700">
        {children}
      </p>
    </article>
  );
}
function LearningCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-blue-700">
        {icon}
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </article>
  );
}

function outputValues(
  spec: Spec,
  x: number,
  h: number,
  left: number,
  right: number,
  degree: number,
) {
  if (spec.kind === "limit")
    return [spec.id === 278 ? "DNE" : "0.0000", (-h).toFixed(3), h.toFixed(3)];
  const derivative = 2 * x + 1;
  if (spec.kind === "slope")
    return [
      derivative.toFixed(4),
      (2 * x + h + 1).toFixed(4),
      Math.abs(h).toFixed(4),
    ];
  if (spec.kind === "rule")
    return [
      (Math.sin(x) * (x * x - 2)).toFixed(4),
      derivative.toFixed(4),
      "0.0000",
    ];
  if (spec.kind === "analysis")
    return [
      (x * x * x - 3 * x).toFixed(4),
      (3 * x * x - 3).toFixed(4),
      derivative >= 0 ? "increasing" : "decreasing",
    ];
  if (spec.kind === "application")
    return [
      (4 + x * x).toFixed(3),
      derivative.toFixed(3),
      `${(right - left).toFixed(2)} units`,
    ];
  if (spec.kind === "newton")
    return ["1.521380", Math.abs(x - 1.52138).toExponential(2), `${degree}`];
  return [Math.cos(x).toFixed(6), (1 - (x * x) / 2).toFixed(6), `${degree}`];
}
function methodSteps(kind: Kind) {
  if (kind === "limit")
    return [
      "Inspect nearby graph values.",
      "Move approach markers.",
      "Compare both sides.",
      "Decide whether the limit exists.",
    ];
  if (kind === "slope")
    return [
      "Locate two points.",
      "Shrink the separation h.",
      "Watch secant become tangent.",
      "Interpret the derivative.",
    ];
  if (kind === "rule")
    return [
      "Inspect component functions.",
      "Edit the inputs.",
      "Follow derivative terms.",
      "Verify the combined rule.",
    ];
  if (kind === "analysis")
    return [
      "See f and its rates.",
      "Move across the domain.",
      "Read signs and shape.",
      "Classify key points.",
    ];
  if (kind === "application")
    return [
      "Identify linked quantities.",
      "Change the model input.",
      "Read the live rate.",
      "Interpret units and signs.",
    ];
  if (kind === "newton")
    return [
      "Choose an initial guess.",
      "Draw the tangent step.",
      "Watch iterates converge.",
      "Estimate the root.",
    ];
  return [
    "Compare function and polynomial.",
    "Change centre and degree.",
    "Watch the error band.",
    "Connect derivatives to coefficients.",
  ];
}
function workspaceTitle(spec: Spec) {
  if (spec.kind === "limit") return `${spec.title} - approach explorer`;
  if (spec.kind === "slope") return `${spec.title} - secant and tangent lab`;
  if (spec.kind === "rule") return `${spec.title} - derivative decomposition`;
  if (spec.kind === "analysis")
    return `${spec.title} - sign and shape explorer`;
  if (spec.kind === "application") return `${spec.title} - linked-rate model`;
  if (spec.kind === "newton") return "Newton iteration and tangent method";
  return "Taylor approximation and error explorer";
}
function visualLabel(spec: Spec) {
  return spec.kind === "limit"
    ? "Approach behaviour near the target"
    : spec.kind === "slope"
      ? "Function, secant, and tangent"
      : spec.kind === "rule"
        ? "Functions and derivative combination"
        : spec.kind === "analysis"
          ? "Curve, critical points, and sign chart"
          : spec.kind === "application"
            ? "Quantity and instantaneous rate"
            : spec.kind === "newton"
              ? "Tangents and successive iterates"
              : "Function, polynomial, and error band";
}
function metricLabels(spec: Spec) {
  if (spec.kind === "limit")
    return ["Estimated limit", "Left sample", "Right sample"];
  if (spec.kind === "slope")
    return ["Derivative", "Secant slope", "Difference"];
  if (spec.kind === "rule") return ["Model value", "Rule value", "Error"];
  if (spec.kind === "analysis") return ["f(x)", "f'(x)", "Behaviour"];
  if (spec.kind === "application") return ["Quantity", "Rate", "Interval"];
  if (spec.kind === "newton") return ["Root", "Error", "Iterations"];
  return ["f(x)", "Tn(x)", "Degree"];
}
function primaryLabel(spec: Spec) {
  return metricLabels(spec)[0];
}
function statusFor(spec: Spec, outputs: string[]) {
  if (spec.kind === "limit")
    return outputs[0] === "DNE" ? "Does not exist" : "Limit exists";
  if (spec.kind === "newton") return "Converging";
  if (spec.kind === "taylor") return "Accurate near centre";
  return "Verified";
}
function observeFor(spec: Spec) {
  if (spec.kind === "limit")
    return "The graph and numeric samples reveal what the function approaches from each side.";
  if (spec.kind === "slope")
    return "The secant line joins two curve points and approaches a tangent as h shrinks.";
  if (spec.kind === "rule")
    return "Each derivative term corresponds to a changing component of the original expression.";
  if (spec.kind === "analysis")
    return "Derivative signs and second-derivative shape expose critical behaviour on the graph.";
  if (spec.kind === "application")
    return "The highlighted quantity and its rate change together as the model advances.";
  if (spec.kind === "newton")
    return "Each tangent intersection becomes the next approximation to the root.";
  return "The polynomial matches more derivatives of the function at its chosen centre.";
}
function understandFor(spec: Spec) {
  if (spec.kind === "limit")
    return "A limit is determined by approach behaviour and can differ from the value at the point.";
  if (spec.kind === "slope")
    return "The derivative is the limiting average rate and the slope of the tangent line.";
  if (spec.kind === "rule")
    return "Derivative rules combine component rates while preserving the structure of the function.";
  if (spec.kind === "analysis")
    return "First and second derivatives translate curve shape into sign and classification evidence.";
  if (spec.kind === "application")
    return "Differentiation connects changing quantities and gives a rate with meaningful units.";
  if (spec.kind === "newton")
    return "Newton's method uses local linear information to improve a root estimate.";
  return "Taylor coefficients are derivatives at the centre, so higher degree improves local agreement.";
}
function ruleExplanation(spec: Spec) {
  if (spec.kind === "limit")
    return "Compare values from both directions without replacing the approach question by direct substitution.";
  if (spec.kind === "slope")
    return "Compute a secant slope, then let its horizontal separation approach zero.";
  if (spec.kind === "rule")
    return "Differentiate each component and combine the terms in the order required by the rule.";
  if (spec.kind === "analysis")
    return "Use derivative signs, critical points, endpoints, and concavity evidence together.";
  if (spec.kind === "application")
    return "Write one equation linking the quantities, differentiate with respect to time, and interpret units.";
  if (spec.kind === "newton")
    return "At each estimate, follow the tangent line to the x-axis to obtain the next estimate.";
  return "Match the function's derivatives at the centre and bound the remaining error.";
}
function interpretationFor(spec: Spec) {
  if (spec.kind === "limit")
    return "Moving the markers closer tests whether both sides settle at the same output.";
  if (spec.kind === "slope")
    return "As h decreases, secant slope error shrinks toward the exact derivative.";
  if (spec.kind === "rule")
    return "The model and rule outputs agree because every required derivative term is included.";
  if (spec.kind === "analysis")
    return "Stationary points and sign changes explain where the function rises, falls, and bends.";
  if (spec.kind === "application")
    return "The derivative is a contextual rate, so its sign and units matter as much as its magnitude.";
  if (spec.kind === "newton")
    return "Successful tangent steps rapidly reduce the distance to the root.";
  return "Approximation error is smallest near the centre and generally falls as degree increases.";
}
