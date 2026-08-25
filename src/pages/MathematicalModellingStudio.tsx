import { Activity, ArrowRight, BarChart3, BrainCircuit, FlaskConical, Network, RefreshCw, SlidersHorizontal, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../components/ui/MathExpression";
import StudioPageShell from "../components/ui/StudioPageShell";

type ModelId = "linear" | "exponential" | "logistic";

type ModelDefinition = {
  id: ModelId;
  label: string;
  formula: string;
  description: string;
  assumptions: string[];
};

const models: ModelDefinition[] = [
  {
    id: "linear",
    label: "Linear",
    formula: "y(t)=y_0+rt",
    description: "Use a constant rate when the same absolute change occurs in every time interval.",
    assumptions: ["Rate is constant", "No saturation", "Inputs act additively"],
  },
  {
    id: "exponential",
    label: "Exponential",
    formula: "y(t)=y_0e^{rt}",
    description: "Use proportional growth or decay when change depends on the current quantity.",
    assumptions: ["Relative rate is constant", "Resources are unconstrained", "State remains non-negative"],
  },
  {
    id: "logistic",
    label: "Logistic",
    formula: "y(t)=\\frac{K}{1+\\left(\\frac{K-y_0}{y_0}\\right)e^{-rt}}",
    description: "Use constrained growth when a system approaches a carrying capacity.",
    assumptions: ["Capacity is fixed", "Growth slows near capacity", "Initial state is positive"],
  },
];

const pathways = [
  { title: "Regression & inference", description: "Fit models to samples and inspect uncertainty.", route: "/probability-statistics/regression", icon: BarChart3 },
  { title: "Optimization", description: "Search objectives under practical constraints.", route: "/calculus/derivative-applications?mode=optimization", icon: Target },
  { title: "Differential equations", description: "Model rates of change with numerical solutions.", route: "/calculus/differential-equations", icon: Activity },
  { title: "AI & engineering models", description: "Explore gradients, signals, robotics, and imaging.", route: "/ai-applications", icon: BrainCircuit },
  { title: "Operations research", description: "Work with networks, schedules, games, and inventory.", route: "/syllabus-lab/network-pert-game-theory-lab", icon: Network },
  { title: "Engineering simulation", description: "Connect assumptions, parameters, and numerical outputs.", route: "/engineering-math", icon: FlaskConical },
];

export default function MathematicalModellingStudio() {
  const [modelId, setModelId] = useState<ModelId>("logistic");
  const [initialValue, setInitialValue] = useState(12);
  const [rate, setRate] = useState(0.35);
  const [capacity, setCapacity] = useState(100);
  const [selectedTime, setSelectedTime] = useState(6);
  const model = models.find((item) => item.id === modelId) ?? models[0];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("model");
    if (models.some((item) => item.id === requested)) setModelId(requested as ModelId);
  }, []);

  const selectModel = (next: ModelId) => {
    setModelId(next);
    const url = new URL(window.location.href);
    url.searchParams.set("model", next);
    window.history.pushState(null, "", `${url.pathname}${url.search}`);
  };

  const evaluate = (time: number) => {
    if (modelId === "linear") return Math.max(0, initialValue + rate * 20 * time);
    if (modelId === "exponential") return initialValue * Math.exp(rate * time);
    const safeInitial = Math.min(initialValue, capacity - 0.1);
    return capacity / (1 + ((capacity - safeInitial) / safeInitial) * Math.exp(-rate * time));
  };

  const points = useMemo(() => Array.from({ length: 41 }, (_, index) => {
    const time = index / 4;
    return { time, value: evaluateModel(modelId, time, initialValue, rate, capacity) };
  }), [capacity, initialValue, modelId, rate]);
  const observed = useMemo(() => points.filter((_, index) => index % 5 === 0).map((point, index) => ({
    ...point,
    value: point.value * (1 + Math.sin(index * 1.7) * 0.045),
  })), [points]);
  const maximum = Math.max(capacity, ...points.map((point) => point.value), ...observed.map((point) => point.value), 1);
  const rmse = Math.sqrt(observed.reduce((sum, point) => sum + (point.value - evaluateModel(modelId, point.time, initialValue, rate, capacity)) ** 2, 0) / observed.length);
  const selectedValue = evaluate(selectedTime);
  const linePoints = points.map((point) => `${48 + point.time * 64},${258 - (point.value / maximum) * 210}`).join(" ");

  const reset = () => {
    setModelId("logistic");
    setInitialValue(12);
    setRate(0.35);
    setCapacity(100);
    setSelectedTime(6);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <StudioPageShell
      className="modelling-studio"
      title="Mathematical Modelling Studio"
      subtitle="Translate real systems into assumptions, equations, simulations, and evidence-based decisions."
      breadcrumbs={["Home", "Studio", "Mathematical Modelling"]}
      difficulty="Intermediate"
      estimatedMinutes={35}
      status={[
        { id: "family", label: "Model", value: model.label, tone: "cyan" },
        { id: "fit", label: "Fit RMSE", value: rmse.toFixed(2), tone: "green" },
      ]}
      toolbar={(
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Model families">
          {models.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === modelId} onClick={() => selectModel(item.id)} className={`min-h-10 rounded-md border px-4 text-sm font-bold transition ${item.id === modelId ? "border-cyan-500 bg-cyan-500 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"}`}>
              {item.label}
            </button>
          ))}
          <button type="button" onClick={reset} className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:border-cyan-300">
            <RefreshCw className="h-4 w-4" />Reset
          </button>
        </div>
      )}
    >
      <div className="grid min-h-0 gap-3 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="min-h-0 overflow-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-950"><SlidersHorizontal className="h-4 w-4 text-cyan-600" />Parameters</div>
          <ModelSlider label="Initial value" value={initialValue} min={2} max={60} step={1} onChange={setInitialValue} />
          <ModelSlider label="Rate" value={rate} min={-0.2} max={0.8} step={0.01} onChange={setRate} />
          <ModelSlider label="Capacity" value={capacity} min={40} max={220} step={5} onChange={setCapacity} disabled={modelId !== "logistic"} />
          <ModelSlider label="Inspect time" value={selectedTime} min={0} max={10} step={0.25} onChange={setSelectedTime} />
          <div className="mt-3 border-t border-slate-200 pt-4">
            <span className="text-xs font-black uppercase text-cyan-700">Equation</span>
            <div className="mt-2 overflow-x-auto rounded-md bg-slate-950 p-3 text-center text-white"><MathExpression value={model.formula} display /></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{model.description}</p>
          </div>
        </aside>

        <section className="min-h-0 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-sm" aria-label="Live model graph">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><span className="text-xs font-black uppercase text-cyan-300">Live simulation</span><h2 className="mt-1 text-lg font-black">{model.label} response over time</h2></div>
            <div className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-right"><span className="block text-xs text-slate-300">y({selectedTime.toFixed(2)})</span><strong className="text-xl text-emerald-300">{selectedValue.toFixed(2)}</strong></div>
          </div>
          <svg className="mt-3 aspect-[16/7] min-h-[300px] w-full" viewBox="0 0 720 300" role="img" aria-label={`${model.label} model chart`}>
            {[0, 1, 2, 3, 4].map((line) => <line key={`h-${line}`} x1="48" y1={48 + line * 52.5} x2="688" y2={48 + line * 52.5} stroke="#1e3a5f" />)}
            {[0, 2, 4, 6, 8, 10].map((time) => <g key={time}><line x1={48 + time * 64} y1="48" x2={48 + time * 64} y2="258" stroke="#16314f" /><text x={48 + time * 64} y="280" fill="#94a3b8" textAnchor="middle" fontSize="12">{time}</text></g>)}
            <line x1="48" y1="258" x2="688" y2="258" stroke="#cbd5e1" />
            <line x1="48" y1="48" x2="48" y2="258" stroke="#cbd5e1" />
            <polyline points={linePoints} fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            {observed.map((point) => <circle key={point.time} cx={48 + point.time * 64} cy={258 - (point.value / maximum) * 210} r="4" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />)}
            <line x1={48 + selectedTime * 64} y1="48" x2={48 + selectedTime * 64} y2="258" stroke="#a78bfa" strokeDasharray="6 5" strokeWidth="2" />
            <circle cx={48 + selectedTime * 64} cy={258 - (selectedValue / maximum) * 210} r="7" fill="#a78bfa" stroke="#fff" strokeWidth="2" />
            <text x="368" y="297" fill="#cbd5e1" textAnchor="middle" fontSize="12">time</text>
          </svg>
          <div className="flex flex-wrap gap-5 border-t border-white/10 pt-3 text-xs font-bold text-slate-300"><span><i className="mr-2 inline-block h-1 w-6 bg-cyan-400" />Model prediction</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />Observed sample</span><span><i className="mr-2 inline-block h-3 w-0.5 bg-violet-400" />Inspection time</span></div>
        </section>

        <aside className="min-h-0 overflow-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-black uppercase text-emerald-700">Model audit</span>
          <h2 className="mt-1 text-lg font-black text-slate-950">Assumptions & fit</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Metric label="Prediction" value={selectedValue.toFixed(2)} />
            <Metric label="Fit RMSE" value={rmse.toFixed(2)} />
            <Metric label="Rate" value={rate.toFixed(2)} />
            <Metric label="Samples" value={observed.length.toString()} />
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-sm font-black text-slate-900">Declared assumptions</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">{model.assumptions.map((assumption) => <li key={assumption} className="flex gap-2"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />{assumption}</li>)}</ul>
          </div>
          <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm leading-6 text-cyan-950"><strong className="block">Interpretation</strong>{interpretModel(modelId, rate, selectedValue, capacity)}</div>
        </aside>
      </div>

      <section className="mt-3 border-t border-slate-200 bg-white/70 px-2 py-4">
        <div className="mb-3"><span className="text-xs font-black uppercase text-violet-700">Continue modelling</span><h2 className="text-lg font-black text-slate-950">Open a specialized workspace</h2></div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {pathways.map((pathway) => <Link key={pathway.title} to={pathway.route} className="group flex min-h-24 items-center gap-3 rounded-md border border-slate-200 bg-white p-3 hover:border-cyan-400 hover:shadow-sm"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-100 text-cyan-700"><pathway.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-950">{pathway.title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{pathway.description}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-cyan-600" /></Link>)}
        </div>
      </section>
    </StudioPageShell>
  );
}

function evaluateModel(model: ModelId, time: number, initial: number, rate: number, capacity: number) {
  if (model === "linear") return Math.max(0, initial + rate * 20 * time);
  if (model === "exponential") return initial * Math.exp(rate * time);
  const safeInitial = Math.min(initial, capacity - 0.1);
  return capacity / (1 + ((capacity - safeInitial) / safeInitial) * Math.exp(-rate * time));
}

function interpretModel(model: ModelId, rate: number, value: number, capacity: number) {
  if (model === "linear") return rate >= 0 ? "The quantity changes by the same absolute amount in every interval." : "The quantity declines at a constant absolute rate until the non-negative boundary is reached.";
  if (model === "exponential") return rate >= 0 ? "The quantity compounds, so equal intervals produce equal proportional increases." : "The quantity decays proportionally to its current size.";
  return `Growth is ${rate >= 0 ? "moving toward" : "moving away from"} the capacity. At the selected time, the model is ${((value / capacity) * 100).toFixed(1)}% of K.`;
}

function ModelSlider({ disabled = false, label, max, min, onChange, step, value }: { disabled?: boolean; label: string; max: number; min: number; onChange: (value: number) => void; step: number; value: number }) {
  return <label className={`mb-4 block ${disabled ? "opacity-40" : ""}`}><span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700"><span>{label}</span><output>{value.toFixed(step < 1 ? 2 : 0)}</output></span><input type="range" aria-label={label} disabled={disabled} min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan-500" /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-slate-200 bg-slate-50 p-2"><span className="block text-[11px] font-bold uppercase text-slate-500">{label}</span><strong className="mt-1 block text-base text-slate-950">{value}</strong></div>;
}
