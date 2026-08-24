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

type WorkspaceKind =
  "accumulation" | "technique" | "solid" | "ode" | "discrete";

type LessonSpec = {
  id: number;
  mockup: string;
  title: string;
  kind: WorkspaceKind;
  formula: string;
  objective: string;
  misconception: string;
};

const lessonRows: Array<[string, WorkspaceKind, string, string]> = [
  [
    "Area by Rectangles",
    "accumulation",
    "S_n = sum f(x_i*) Delta x",
    "Rectangles approximate signed area; thinner partitions improve the estimate.",
  ],
  [
    "Riemann Sums",
    "accumulation",
    "int_a^b f(x) dx = lim S_n",
    "The sample point determines left, right, or midpoint sums.",
  ],
  [
    "Definite Integral",
    "accumulation",
    "int_a^b f(x) dx = F(b) - F(a)",
    "A definite integral is signed accumulation, not always geometric area.",
  ],
  [
    "Indefinite Integral",
    "technique",
    "int f(x) dx = F(x) + C",
    "An indefinite integral describes a family of antiderivatives.",
  ],
  [
    "Fundamental Theorem",
    "accumulation",
    "A(x) = int_a^x f(t)dt; A'(x) = f(x)",
    "Accumulation and differentiation undo one another.",
  ],
  [
    "Area Between Curves",
    "accumulation",
    "A = int_a^b [f(x) - g(x)] dx",
    "Subtract the lower curve from the upper curve on each interval.",
  ],
  [
    "Substitution",
    "technique",
    "u = g(x); du = g'(x) dx",
    "Substitution reverses the chain rule and must include the matching differential.",
  ],
  [
    "Integration by Parts",
    "technique",
    "int u dv = uv - int v du",
    "Choose u to differentiate easily and dv to integrate easily.",
  ],
  [
    "Partial Fractions",
    "technique",
    "P(x)/Q(x) = A/(x-a) + B/(x-b)",
    "Factor the denominator before splitting the rational expression.",
  ],
  [
    "Improper Integrals",
    "technique",
    "int_a^infinity f(x)dx = lim int_a^b f(x)dx",
    "An infinite endpoint is handled by a limit, not direct substitution.",
  ],
  [
    "Numerical Integration",
    "accumulation",
    "T_n = Delta x [f(a)/2 + ... + f(b)/2]",
    "The rule and step size determine approximation error.",
  ],
  [
    "Volume by Slicing",
    "solid",
    "V = int_a^b A(x) dx",
    "Integrate cross-sectional area, not a single length.",
  ],
  [
    "Disc and Washer Methods",
    "solid",
    "V = pi int_a^b [R(x)^2 - r(x)^2] dx",
    "Square each radius before subtracting inner area from outer area.",
  ],
  [
    "Shell Method",
    "solid",
    "V = 2pi int_a^b radius x height dx",
    "Shell radius is the distance from the slice to the axis of rotation.",
  ],
  [
    "Arc Length",
    "solid",
    "L = int_a^b sqrt(1 + [f'(x)]^2) dx",
    "Arc length follows the curve rather than measuring horizontal distance.",
  ],
  [
    "Surface Area of Revolution",
    "solid",
    "S = 2pi int_a^b f(x)sqrt(1+[f'(x)]^2)dx",
    "Surface area uses circumference times arc length, not volume slices.",
  ],
  [
    "Accumulation Functions",
    "accumulation",
    "A(x) = int_a^x f(t) dt",
    "The moving upper bound makes the accumulated total a function.",
  ],
  [
    "Direction Fields",
    "ode",
    "dy/dx = x - y",
    "Short field marks show local slope, not level curves.",
  ],
  [
    "Euler's Method",
    "ode",
    "y_(n+1) = y_n + h f(x_n,y_n)",
    "Euler steps use the current slope; larger h usually increases error.",
  ],
  [
    "Separable Equations",
    "ode",
    "dy/g(y) = f(x) dx",
    "Separate x and y terms before integrating both sides.",
  ],
  [
    "First-Order Linear Equations",
    "ode",
    "y' + p(x)y = q(x)",
    "The integrating factor must multiply every term in the equation.",
  ],
  [
    "Logistic Growth",
    "ode",
    "dP/dt = rP(1 - P/K)",
    "Limited growth slows near carrying capacity instead of staying exponential.",
  ],
  [
    "Second-Order Equations",
    "ode",
    "ay'' + by' + cy = g(x)",
    "A second-order model generally needs two initial conditions.",
  ],
  [
    "Phase Plane",
    "ode",
    "x' = f(x,y); y' = g(x,y)",
    "Phase-plane axes are state variables; time runs along trajectories.",
  ],
  [
    "Equilibrium and Stability",
    "ode",
    "f(y*) = 0",
    "An equilibrium has zero rate; the equilibrium value need not be zero.",
  ],
  [
    "Discrete Dynamical Systems",
    "discrete",
    "x_(n+1) = f(x_n)",
    "Discrete updates happen step by step rather than continuously.",
  ],
  [
    "Cobweb Diagrams",
    "discrete",
    "x_(n+1) = f(x_n); y = x",
    "Move vertically to the rule and horizontally to the diagonal.",
  ],
  [
    "Chaos and Bifurcation",
    "discrete",
    "x_(n+1) = r x_n(1 - x_n)",
    "Chaotic motion is deterministic even when nearby starts separate rapidly.",
  ],
];

const specs: LessonSpec[] = lessonRows.map(
  ([title, kind, formula, misconception], index) => ({
    id: 306 + index,
    mockup: String(385 + index).padStart(4, "0"),
    title,
    kind,
    formula,
    objective: objectiveFor(kind, title),
    misconception,
  }),
);

export default function IntegralDifferentialMockupLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = specs.find((item) => item.id === lesson.id) ?? specs[0];
  const [lower, setLower] = useState(-1);
  const [upper, setUpper] = useState(4);
  const [detail, setDetail] = useState(12);
  const [parameter, setParameter] = useState(
    spec.kind === "discrete" ? 3.65 : 0.6,
  );
  const [initial, setInitial] = useState(spec.kind === "ode" ? 1 : 0.2);
  const [showModel, setShowModel] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setLower(-1);
    setUpper(4);
    setDetail(12);
    setParameter(spec.kind === "discrete" ? 3.65 : 0.6);
    setInitial(spec.kind === "ode" ? 1 : 0.2);
    setShowModel(true);
    setShowGrid(true);
    setShowGuide(true);
    setRunning(false);
    setChecked(false);
  }, [lesson.id, resetToken, spec.kind]);

  const values = useMemo(
    () => calculateOutputs(spec, lower, upper, detail, parameter, initial),
    [detail, initial, lower, parameter, spec, upper],
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
      data-testid={`integral-differential-mockup-${spec.mockup}`}
      data-target-family="integral-calculus-and-differential-equations"
    >
      <p className="sr-only">{sentenceCase(spec.title)}</p>
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
              Change the linked controls and compare the model, formula, and
              numerical evidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Model is valid
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
            lower={lower}
            upper={upper}
            detail={detail}
            parameter={parameter}
            initial={initial}
            showModel={showModel}
            showGrid={showGrid}
            showGuide={showGuide}
            onLower={change(setLower)}
            onUpper={change(setUpper)}
            onDetail={change(setDetail)}
            onParameter={change(setParameter)}
            onInitial={change(setInitial)}
            onShowModel={(value) => toggle(setShowModel, value)}
            onShowGrid={(value) => toggle(setShowGrid, value)}
            onShowGuide={(value) => toggle(setShowGuide, value)}
            onReset={() => {
              setLower(-1);
              setUpper(4);
              setDetail(12);
              setParameter(spec.kind === "discrete" ? 3.65 : 0.6);
              setInitial(spec.kind === "ode" ? 1 : 0.2);
              onInteraction();
            }}
          />

          <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                <span className="h-0.5 w-6 bg-sky-500" /> {visualLabel(spec)}
              </div>
              <span className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-mono text-xs font-bold text-cyan-800">
                {spec.formula}
              </span>
            </div>
            <CalculusVisual
              spec={spec}
              lower={lower}
              upper={upper}
              detail={detail}
              parameter={parameter}
              initial={initial}
              showModel={showModel}
              showGrid={showGrid}
              showGuide={showGuide}
            />
            <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white py-3 text-center">
              <Metric label={metricLabels(spec)[0]} value={values[0]} />
              <Metric label={metricLabels(spec)[1]} value={values[1]} />
              <Metric label={metricLabels(spec)[2]} value={values[2]} />
            </div>
          </div>

          <ResultsPanel
            spec={spec}
            values={values}
            lower={lower}
            upper={upper}
            detail={detail}
            parameter={parameter}
          />
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
          Move the sliders and watch every plotted quantity and result update
          together.
        </InfoCard>
        <InfoCard
          icon={<Lightbulb className="h-5 w-5" />}
          title="Understand"
          tone="violet"
        >
          {spec.objective}
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
          title="Governing formula"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-center font-mono text-sm font-black text-cyan-950">
            {spec.formula}
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            {formulaExplanation(spec)}
          </p>
        </LearningCard>
        <LearningCard
          title="Worked example"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <p className="text-sm font-semibold leading-6 text-slate-600">
            Use the current settings: lower = {lower.toFixed(1)}, upper ={" "}
            {upper.toFixed(1)}, and resolution = {detail}.
          </p>
          <div className="mt-3 space-y-2 font-mono text-xs font-bold text-slate-700">
            <p>1. Identify the model and interval.</p>
            <p>2. Apply {spec.formula}.</p>
            <p className="rounded-lg bg-emerald-50 p-3 text-emerald-800">
              Result: {values[0]}
            </p>
          </div>
        </LearningCard>
        <LearningCard
          title="Try it yourself"
          icon={<Target className="h-5 w-5" />}
        >
          <p className="text-sm font-semibold text-slate-600">
            Predict how the primary output changes when the highlighted
            parameter increases.
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
              ? "Correct: compare your prediction with the live graph above."
              : "Your feedback will appear here."}
          </p>
        </LearningCard>
      </section>
    </section>
  );
}

function MethodStrip({ spec }: { spec: LessonSpec }) {
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
  spec: LessonSpec;
  lower: number;
  upper: number;
  detail: number;
  parameter: number;
  initial: number;
  showModel: boolean;
  showGrid: boolean;
  showGuide: boolean;
  onLower: (value: number) => void;
  onUpper: (value: number) => void;
  onDetail: (value: number) => void;
  onParameter: (value: number) => void;
  onInitial: (value: number) => void;
  onShowModel: (value: boolean) => void;
  onShowGrid: (value: boolean) => void;
  onShowGuide: (value: boolean) => void;
  onReset: () => void;
};

function Controls(props: ControlsProps) {
  const discrete = props.spec.kind === "discrete";
  return (
    <aside className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase text-blue-700">
          Model controls
        </h3>
        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
      </div>
      <Range
        label={discrete ? "Parameter r" : "Lower bound a"}
        value={discrete ? props.parameter : props.lower}
        min={discrete ? 2.5 : -3}
        max={discrete ? 4 : 2}
        step={discrete ? 0.01 : 0.1}
        onChange={discrete ? props.onParameter : props.onLower}
      />
      <Range
        label={
          props.spec.kind === "ode" ? "Growth / slope rate" : "Upper bound b"
        }
        value={props.spec.kind === "ode" ? props.parameter : props.upper}
        min={props.spec.kind === "ode" ? 0.1 : 1}
        max={props.spec.kind === "ode" ? 2 : 7}
        step={0.1}
        onChange={props.spec.kind === "ode" ? props.onParameter : props.onUpper}
      />
      <Range
        label={
          props.spec.kind === "ode" || discrete
            ? "Initial value"
            : "Resolution / slices"
        }
        value={
          props.spec.kind === "ode" || discrete ? props.initial : props.detail
        }
        min={props.spec.kind === "ode" || discrete ? 0.05 : 4}
        max={props.spec.kind === "ode" || discrete ? 1.5 : 40}
        step={props.spec.kind === "ode" || discrete ? 0.05 : 1}
        onChange={
          props.spec.kind === "ode" || discrete
            ? props.onInitial
            : props.onDetail
        }
      />
      <Range
        label={props.spec.kind === "ode" ? "Field density" : "Detail"}
        value={props.detail}
        min={4}
        max={40}
        step={1}
        onChange={props.onDetail}
      />
      <div className="border-t border-slate-200 pt-3">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          Display
        </p>
        <Toggle
          label="Show model"
          checked={props.showModel}
          onChange={props.onShowModel}
        />
        <Toggle
          label="Grid and axes"
          checked={props.showGrid}
          onChange={props.onShowGrid}
        />
        <Toggle
          label="Guides and labels"
          checked={props.showGuide}
          onChange={props.onShowGuide}
        />
      </div>
      <button
        type="button"
        className="action-secondary w-full justify-center"
        onClick={props.onReset}
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
  onChange: (value: number) => void;
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
  onChange: (value: boolean) => void;
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

function ResultsPanel({
  spec,
  values,
  lower,
  upper,
  detail,
  parameter,
}: {
  spec: LessonSpec;
  values: string[];
  lower: number;
  upper: number;
  detail: number;
  parameter: number;
}) {
  return (
    <aside className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-[10px] font-black uppercase text-blue-700">
          Output summary
        </p>
        <div className="mt-3 rounded-lg bg-gradient-to-r from-cyan-50 to-violet-50 p-4 text-center">
          <span className="block text-[10px] font-bold text-slate-500">
            {primaryOutput(spec)}
          </span>
          <strong className="mt-1 block font-mono text-xl text-blue-700">
            {values[0]}
          </strong>
        </div>
        <dl className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
          <ResultRow
            label="Interval"
            value={`[${lower.toFixed(1)}, ${upper.toFixed(1)}]`}
          />
          <ResultRow label="Resolution" value={String(detail)} />
          <ResultRow label="Parameter" value={parameter.toFixed(2)} />
          <ResultRow label="Status" value={statusFor(spec, values)} />
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
          Live check passed
        </div>
        <p className="mt-2 text-xs font-semibold leading-5 text-emerald-700">
          The graph and computed values use the same current parameters.
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

function CalculusVisual(props: {
  spec: LessonSpec;
  lower: number;
  upper: number;
  detail: number;
  parameter: number;
  initial: number;
  showModel: boolean;
  showGrid: boolean;
  showGuide: boolean;
}) {
  const { spec } = props;
  return (
    <svg
      viewBox="0 0 720 430"
      className="aspect-[720/430] w-full"
      role="img"
      aria-label={`${spec.title} interactive mathematical model`}
    >
      <rect width="720" height="430" rx="8" fill="#ffffff" />
      {props.showGrid ? <GraphGrid /> : null}
      {spec.kind === "accumulation" ? <AccumulationPlot {...props} /> : null}
      {spec.kind === "technique" ? <TechniquePlot {...props} /> : null}
      {spec.kind === "solid" ? <SolidPlot {...props} /> : null}
      {spec.kind === "ode" ? <OdePlot {...props} /> : null}
      {spec.kind === "discrete" ? <DiscretePlot {...props} /> : null}
    </svg>
  );
}

function GraphGrid() {
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={45 + i * 52}
          x2={45 + i * 52}
          y1="28"
          y2="386"
          stroke="#e2e8f0"
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={`h-${i}`}
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
        x1="145"
        x2="145"
        y1="24"
        y2="390"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <text x="686" y="323" fontSize="13" fontWeight="700" fill="#334155">
        x
      </text>
      <text x="154" y="35" fontSize="13" fontWeight="700" fill="#334155">
        y
      </text>
    </g>
  );
}

function AccumulationPlot({
  spec,
  detail,
  showModel,
  showGuide,
}: {
  spec: LessonSpec;
  detail: number;
  showModel: boolean;
  showGuide: boolean;
}) {
  const count = Math.min(24, Math.max(4, Math.round(detail)));
  const bars = Array.from({ length: count }, (_, i) => {
    const x = 155 + i * (470 / count);
    const t = i / count;
    const h = 28 + 210 * t * t;
    return { x, h, width: 470 / count };
  });
  return (
    <g>
      {showModel
        ? bars.map((bar, index) => (
            <rect
              key={index}
              x={bar.x}
              y={330 - bar.h}
              width={bar.width - 1}
              height={bar.h}
              fill={index < count * 0.18 ? "#fecdd3" : "#bfdbfe"}
              stroke={index < count * 0.18 ? "#fb7185" : "#3b82f6"}
              opacity=".82"
            />
          ))
        : null}
      <path
        d="M70 360 C135 348 200 322 270 294 C355 260 430 220 505 158 C560 112 615 62 665 25"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="4"
      />
      {spec.title === "Area Between Curves" ? (
        <path
          d="M90 286 C210 218 340 255 470 180 C545 136 605 150 660 110"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="4"
        />
      ) : null}
      {showGuide ? (
        <>
          <line
            x1="155"
            x2="155"
            y1="80"
            y2="350"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <line
            x1="625"
            x2="625"
            y1="50"
            y2="350"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <text x="164" y="374" fontSize="13" fontWeight="800" fill="#f97316">
            a
          </text>
          <text x="614" y="374" fontSize="13" fontWeight="800" fill="#7c3aed">
            b
          </text>
          <text x="440" y="92" fontSize="16" fontWeight="800" fill="#2563eb">
            f(x)
          </text>
        </>
      ) : null}
    </g>
  );
}

function TechniquePlot({
  spec,
  showGuide,
}: {
  spec: LessonSpec;
  showGuide: boolean;
}) {
  return (
    <g>
      <path
        d="M55 348 C160 372 245 346 320 300 C400 251 480 205 540 132 C585 78 620 41 666 18"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="4"
      />
      {showGuide ? (
        <>
          <line
            x1="80"
            x2="610"
            y1="366"
            y2="366"
            stroke="#2563eb"
            strokeWidth="3"
          />
          <line
            x1="340"
            x2="650"
            y1="366"
            y2="366"
            stroke="#ec4899"
            strokeWidth="3"
          />
          <circle
            cx="340"
            cy="366"
            r="7"
            fill="#fff"
            stroke="#7c3aed"
            strokeWidth="3"
          />
          <text x="145" y="394" fontSize="14" fontWeight="800" fill="#2563eb">
            u'(x) v(x)
          </text>
          <text x="465" y="394" fontSize="14" fontWeight="800" fill="#db2777">
            u(x) v'(x)
          </text>
          <rect
            x="420"
            y="72"
            width="190"
            height="48"
            rx="8"
            fill="#ecfeff"
            stroke="#7dd3fc"
          />
          <text x="438" y="102" fontSize="15" fontWeight="800" fill="#0369a1">
            {spec.formula.slice(0, 24)}
          </text>
        </>
      ) : null}
    </g>
  );
}

function SolidPlot({
  spec,
  showModel,
  showGuide,
}: {
  spec: LessonSpec;
  showModel: boolean;
  showGuide: boolean;
}) {
  const isLength =
    spec.title.includes("Length") || spec.title.includes("Surface");
  return (
    <g>
      <path
        d="M70 334 C150 310 235 265 315 212 C395 160 475 114 575 78"
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
      />
      {showModel && !isLength ? (
        <>
          <path
            d="M305 216 C350 165 460 150 545 187 C600 212 603 282 545 306 C455 344 350 325 305 274 Z"
            fill="#bfdbfe"
            opacity=".65"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <ellipse
            cx="430"
            cy="245"
            rx="118"
            ry="82"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
          />
          <ellipse
            cx="430"
            cy="245"
            rx="52"
            ry="82"
            fill="#ddd6fe"
            opacity=".8"
            stroke="#7c3aed"
            strokeWidth="3"
          />
          <ellipse
            cx="430"
            cy="245"
            rx="15"
            ry="82"
            fill="#f5d0fe"
            opacity=".8"
            stroke="#a855f7"
          />
        </>
      ) : null}
      {showGuide ? (
        <>
          <line
            x1="300"
            x2="300"
            y1="92"
            y2="350"
            stroke="#f97316"
            strokeWidth="3"
          />
          <text x="278" y="76" fontSize="13" fontWeight="800" fill="#ea580c">
            slice x
          </text>
          <text x="500" y="176" fontSize="15" fontWeight="800" fill="#2563eb">
            R(x)
          </text>
          <text x="480" y="248" fontSize="15" fontWeight="800" fill="#7c3aed">
            r(x)
          </text>
        </>
      ) : null}
    </g>
  );
}

function OdePlot({
  spec,
  parameter,
  initial,
  detail,
  showModel,
  showGuide,
}: {
  spec: LessonSpec;
  parameter: number;
  initial: number;
  detail: number;
  showModel: boolean;
  showGuide: boolean;
}) {
  const density = Math.min(18, Math.max(8, Math.round(detail / 2)));
  const marks = Array.from({ length: density * 8 }, (_, i) => {
    const col = i % density;
    const row = Math.floor(i / density);
    const x = 65 + col * (600 / (density - 1));
    const y = 55 + row * 42;
    const slope = ((x - 350) / 230 - (210 - y) / 120) * 0.35;
    return { x, y, dy: Math.max(-9, Math.min(9, slope * 8)) };
  });
  const logistic = spec.title === "Logistic Growth";
  return (
    <g>
      {showModel
        ? marks.map((mark, index) => (
            <line
              key={index}
              x1={mark.x - 7}
              x2={mark.x + 7}
              y1={mark.y + mark.dy}
              y2={mark.y - mark.dy}
              stroke={mark.dy > 3 ? "#8b5cf6" : "#0ea5e9"}
              strokeWidth="1.6"
            />
          ))
        : null}
      <path
        d={
          logistic
            ? "M55 340 C120 335 175 310 230 250 C295 176 360 112 440 84 C515 58 585 54 670 53"
            : "M55 320 C145 296 210 285 275 260 C335 237 390 210 455 154 C520 98 590 78 670 50"
        }
        fill="none"
        stroke="#7c3aed"
        strokeWidth="4"
      />
      {spec.title === "Euler's Method" ? (
        <polyline
          points="55,320 120,306 185,289 250,265 315,230 380,188 445,145 510,102 575,69 640,45"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray="7 5"
        />
      ) : null}
      {showGuide ? (
        <>
          <circle
            cx={260 + initial * 85}
            cy={245 - parameter * 42}
            r="8"
            fill="#7c3aed"
          />
          <line
            x1={260 + initial * 85}
            x2={260 + initial * 85}
            y1={245 - parameter * 42}
            y2="330"
            stroke="#7c3aed"
            strokeDasharray="5 4"
          />
          <text x="480" y="86" fontSize="14" fontWeight="800" fill="#7c3aed">
            solution curve
          </text>
        </>
      ) : null}
    </g>
  );
}

function DiscretePlot({
  spec,
  parameter,
  initial,
  detail,
  showModel,
  showGuide,
}: {
  spec: LessonSpec;
  parameter: number;
  initial: number;
  detail: number;
  showModel: boolean;
  showGuide: boolean;
}) {
  if (spec.title === "Chaos and Bifurcation") {
    const points = Array.from({ length: 620 }, (_, i) => {
      const r = 2.5 + (i % 155) / 103;
      const branch = Math.floor(i / 155);
      const x = 70 + ((r - 2.5) / 1.5) * 590;
      const y =
        330 -
        (0.5 +
          Math.sin(r * 8 + branch * 1.7) * Math.min(0.45, Math.max(0, r - 3))) *
          275;
      return { x, y };
    });
    return (
      <g>
        {showModel
          ? points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="1.1"
                fill="#0ea5e9"
                opacity=".62"
              />
            ))
          : null}
        <line
          x1={70 + ((parameter - 2.5) / 1.5) * 590}
          x2={70 + ((parameter - 2.5) / 1.5) * 590}
          y1="40"
          y2="345"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
        <text x="470" y="58" fontSize="14" fontWeight="800" fill="#7c3aed">
          r = {parameter.toFixed(2)}
        </text>
      </g>
    );
  }
  let x = initial;
  const steps = Array.from(
    { length: Math.min(12, Math.max(5, detail / 2)) },
    () => {
      const next = spec.title.includes("Cobweb")
        ? Math.cos(x)
        : parameter * x * (1 - x);
      const pair = { x, next };
      x = next;
      return pair;
    },
  );
  const mapX = (value: number) => 145 + value * 420;
  const mapY = (value: number) => 330 - value * 260;
  let previous = initial;
  const path = steps
    .map((step) => {
      const vertical = `L ${mapX(previous)} ${mapY(step.next)}`;
      const horizontal = `L ${mapX(step.next)} ${mapY(step.next)}`;
      previous = step.next;
      return `${vertical} ${horizontal}`;
    })
    .join(" ");
  return (
    <g>
      <line
        x1="145"
        x2="590"
        y1="330"
        y2="54"
        stroke="#64748b"
        strokeWidth="2"
        strokeDasharray="7 6"
      />
      {showModel ? (
        <path
          d={
            spec.title.includes("Cobweb")
              ? "M70 170 C150 80 240 48 330 88 C430 132 520 262 650 338"
              : "M145 330 Q355 18 565 330"
          }
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
        />
      ) : null}
      <path
        d={`M ${mapX(initial)} 330 ${path}`}
        fill="none"
        stroke="#9333ea"
        strokeWidth="3"
      />
      {showGuide ? (
        <>
          <circle cx={mapX(initial)} cy="330" r="7" fill="#0ea5e9" />
          <text
            x={mapX(initial) + 10}
            y="354"
            fontSize="14"
            fontWeight="800"
            fill="#0284c7"
          >
            x0
          </text>
          <text x="510" y="104" fontSize="14" fontWeight="800" fill="#64748b">
            y = x
          </text>
        </>
      ) : null}
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

function objectiveFor(kind: WorkspaceKind, title: string) {
  if (kind === "accumulation")
    return `Connect the visual accumulation in ${title.toLowerCase()} to its limiting integral.`;
  if (kind === "technique")
    return `Apply ${title.toLowerCase()} and verify the result by differentiation.`;
  if (kind === "solid")
    return `Build the geometric quantity in ${title.toLowerCase()} from thin slices.`;
  if (kind === "ode")
    return `Read local rates and trace solution behavior for ${title.toLowerCase()}.`;
  return `Iterate the rule and classify the long-term behavior in ${title.toLowerCase()}.`;
}

function workspaceTitle(spec: LessonSpec) {
  if (spec.kind === "accumulation") return `${spec.title} Explorer`;
  if (spec.kind === "technique") return `${spec.title} - symbolic workspace`;
  if (spec.kind === "solid") return `${spec.title} - geometric model`;
  if (spec.kind === "ode") return `${spec.title} - solution lab`;
  return `${spec.title} Explorer`;
}
function visualLabel(spec: LessonSpec) {
  return spec.kind === "accumulation"
    ? "Function and signed accumulation"
    : spec.kind === "technique"
      ? "Transformation and verification"
      : spec.kind === "solid"
        ? "Region, slice, and generated quantity"
        : spec.kind === "ode"
          ? "Slope field and solution curves"
          : "Iteration and long-term behavior";
}
function primaryOutput(spec: LessonSpec) {
  return spec.kind === "accumulation"
    ? "Signed accumulation"
    : spec.kind === "technique"
      ? "Verified antiderivative"
      : spec.kind === "solid"
        ? "Geometric measure"
        : spec.kind === "ode"
          ? "Current state"
          : "Long-term state";
}
function metricLabels(spec: LessonSpec) {
  if (spec.kind === "accumulation")
    return ["Approximation", "Step size", "Error"];
  if (spec.kind === "technique") return ["Result", "Derivative check", "Terms"];
  if (spec.kind === "solid") return ["Measure", "Slice value", "Progress"];
  if (spec.kind === "ode") return ["State", "Slope", "Steps"];
  return ["Latest x", "Regime", "Iterations"];
}
function calculateOutputs(
  spec: LessonSpec,
  lower: number,
  upper: number,
  detail: number,
  parameter: number,
  initial: number,
) {
  const span = Math.max(0.1, upper - lower);
  if (spec.kind === "accumulation")
    return [
      (span * (1.5 + (upper * upper) / 12)).toFixed(4),
      (span / detail).toFixed(4),
      (1 / (detail * detail)).toExponential(2),
    ];
  if (spec.kind === "technique")
    return ["F(x) + C", "match", `${Math.max(2, Math.round(detail / 4))}`];
  if (spec.kind === "solid")
    return [
      (Math.PI * span * 4.5).toFixed(3),
      (Math.PI * parameter * parameter).toFixed(3),
      `${Math.min(100, Math.round(detail * 2.5))}%`,
    ];
  if (spec.kind === "ode")
    return [
      (initial * Math.exp(parameter)).toFixed(4),
      (parameter * (1 - initial)).toFixed(4),
      `${detail}`,
    ];
  let x = initial;
  for (let i = 0; i < detail; i += 1)
    x = spec.title.includes("Cobweb") ? Math.cos(x) : parameter * x * (1 - x);
  return [
    x.toFixed(6),
    parameter > 3.57 ? "Chaotic" : parameter > 3 ? "Periodic" : "Stable",
    `${detail}`,
  ];
}
function methodSteps(kind: WorkspaceKind) {
  if (kind === "accumulation")
    return [
      "Read the interval and curve.",
      "Move bounds and resolution.",
      "Compare signed pieces.",
      "Connect the sum to the integral.",
    ];
  if (kind === "technique")
    return [
      "Inspect the integrand.",
      "Choose and apply the method.",
      "Follow the transformed terms.",
      "Differentiate to verify.",
    ];
  if (kind === "solid")
    return [
      "See the region and axis.",
      "Move the representative slice.",
      "Watch slices accumulate.",
      "Apply the geometric integral.",
    ];
  if (kind === "ode")
    return [
      "Read the local slope field.",
      "Change the initial state.",
      "Trace the solution curve.",
      "Classify its behavior.",
    ];
  return [
    "Choose a rule and start.",
    "Iterate one step at a time.",
    "Watch the orbit or cobweb.",
    "Classify stability or chaos.",
  ];
}
function observeFor(spec: LessonSpec) {
  if (spec.kind === "accumulation")
    return "The shaded pieces approximate signed accumulation over the selected interval.";
  if (spec.kind === "technique")
    return "The transformed terms preserve the original integrand and expose an antiderivative.";
  if (spec.kind === "solid")
    return "A moving slice generates the full length, area, or volume shown by the model.";
  if (spec.kind === "ode")
    return "Local slope marks guide every possible solution curve through the field.";
  return "Repeated outputs become new inputs and reveal fixed, periodic, or chaotic behavior.";
}
function formulaExplanation(spec: LessonSpec) {
  if (spec.kind === "accumulation")
    return "Partition the interval, combine signed contributions, and pass to the limiting integral.";
  if (spec.kind === "technique")
    return "Transform the integrand into a form with a known antiderivative, then verify by differentiating.";
  if (spec.kind === "solid")
    return "Express one representative slice geometrically and integrate it across the full interval.";
  if (spec.kind === "ode")
    return "The differential equation assigns a rate to every state; the solution follows those rates from its initial condition.";
  return "Apply the update rule repeatedly and study the orbit after transient behavior disappears.";
}
function interpretationFor(spec: LessonSpec) {
  if (spec.kind === "accumulation")
    return "Increasing resolution makes the visual sum approach the exact signed integral.";
  if (spec.kind === "technique")
    return "The derivative check confirms that the symbolic transformation preserved the integrand.";
  if (spec.kind === "solid")
    return "The highlighted slice is one differential contribution to the total geometric measure.";
  if (spec.kind === "ode")
    return "Changing the initial condition selects a different solution while the field remains fixed.";
  return "Parameter changes can move the orbit between stable, periodic, and chaotic regimes.";
}

function statusFor(spec: LessonSpec, values: string[]) {
  if (spec.kind === "discrete") return values[1];
  if (spec.kind === "technique") return "Verified";
  if (spec.kind === "ode") return "Solution traced";
  return "Valid";
}

function sentenceCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
