import { BookOpen, BrainCircuit, Calculator, Check, Command, FlaskConical, GitCompare, Plus, Ruler, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SliderControl from "../components/ui/SliderControl";
import { analyzeFunction, buildTransformation, runGraphCasAction, type CasAction, type IntelligenceStatus } from "./graphIntelligence";
import { defaultSimulationParameters, SIMULATION_MODELS, simulationSeries } from "./simulationEngine";
import { convertGraphUnit, GRAPH_UNITS } from "./unitEngine";

type Tab = "insights" | "cas" | "transform" | "simulations" | "notebook" | "units";

type Props = {
  expression: string;
  xMin: number;
  xMax: number;
  onAddExpression: (expression: string, label?: string) => void;
};

type NotebookEntry = { id: string; expression: string; note: string; createdAt: string };

const NOTEBOOK_KEY = "math-universe-graph-intelligence-notebook-v1";

export default function GraphIntelligencePanel({ expression, xMin, xMax, onAddExpression }: Props) {
  const [tab, setTab] = useState<Tab>("insights");
  const [casResult, setCasResult] = useState<ReturnType<typeof runGraphCasAction>>(null);
  const [casAction, setCasAction] = useState<CasAction>("simplify");
  const [transform, setTransform] = useState({ a: 1, b: 1, h: 0, k: 0 });
  const [commandOpen, setCommandOpen] = useState(false);
  const insights = useMemo(() => analyzeFunction(expression, xMin, xMax), [expression, xMax, xMin]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runCas = (action = casAction) => {
    setCasAction(action);
    setCasResult(runGraphCasAction(expression, action));
    setTab("cas");
    setCommandOpen(false);
  };

  const transformed = useMemo(() => buildTransformation(expression, transform.a, transform.b, transform.h, transform.k), [expression, transform]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-slate-950/70" aria-label="Graph intelligence">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 dark:border-white/10">
        {([
          ["insights", "Insights", BrainCircuit],
          ["cas", "CAS", Calculator],
          ["transform", "Transform", GitCompare],
          ["simulations", "Sim Lab", FlaskConical],
          ["notebook", "Notebook", BookOpen],
          ["units", "Units", Ruler],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" className={tab === id ? "action-primary" : "tool-button"} onClick={() => setTab(id)}><Icon className="h-4 w-4" />{label}</button>
        ))}
        <button type="button" className="tool-button ml-auto" onClick={() => setCommandOpen((value) => !value)} title="Command palette (Ctrl+K)"><Command className="h-4 w-4" /></button>
      </div>

      {commandOpen && <CommandPalette onRun={runCas} onOpenTab={(next) => { setTab(next); setCommandOpen(false); }} />}
      <div className="p-3">
        {tab === "insights" && <Insights findings={insights} />}
        {tab === "cas" && <CasPanel expression={expression} action={casAction} result={casResult} onRun={runCas} onAdd={() => casResult && onAddExpression(casResult.result.replace(/\+C$/, ""), `${casAction} result`)} />}
        {tab === "transform" && <TransformPanel values={transform} onChange={setTransform} expression={transformed} onAdd={() => onAddExpression(transformed, "transformation")} onAddExpression={onAddExpression} />}
        {tab === "simulations" && <SimulationPanel onAdd={onAddExpression} />}
        {tab === "notebook" && <NotebookPanel expression={expression} onOpen={(savedExpression) => onAddExpression(savedExpression, "notebook scene")} />}
        {tab === "units" && <UnitPanel />}
      </div>
    </section>
  );
}

function Insights({ findings }: { findings: ReturnType<typeof analyzeFunction> }) {
  return <div className="grid gap-2 md:grid-cols-2">
    {findings.map((finding) => <div key={finding.label} className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase text-slate-500">{finding.label}</p><Status status={finding.status} /></div>
      <p className="mt-1 text-sm font-bold">{finding.value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{finding.method}</p>
    </div>)}
  </div>;
}

function CasPanel({ expression, action, result, onRun, onAdd }: { expression: string; action: CasAction; result: ReturnType<typeof runGraphCasAction>; onRun: (action?: CasAction) => void; onAdd: () => void }) {
  const actions: CasAction[] = ["simplify", "expand", "factor", "differentiate", "integrate"];
  return <div>
    <p className="mb-2 break-all font-mono text-sm">Selected: {expression}</p>
    <div className="flex flex-wrap gap-2">{actions.map((item) => <button key={item} type="button" className={action === item ? "action-primary" : "tool-button"} onClick={() => onRun(item)}>{item}</button>)}</div>
    {result ? <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
      <div className="flex items-center justify-between gap-2"><Status status="exact" /><button type="button" className="tool-button" onClick={onAdd}><Plus className="h-4 w-4" />Plot result</button></div>
      <p className="mt-2 break-all font-mono font-bold">{result.result}</p>
      <ol className="mt-2 space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{result.steps.map((step, index) => <li key={`${step}-${index}`}>{index + 1}. {step}</li>)}</ol>
    </div> : <p className="mt-3 text-sm text-slate-500">Choose an operation. Unsupported relations remain unchanged and are never presented as exact results.</p>}
  </div>;
}

function TransformPanel({ values, onChange, expression, onAdd, onAddExpression }: { values: { a: number; b: number; h: number; k: number }; onChange: (value: { a: number; b: number; h: number; k: number }) => void; expression: string; onAdd: () => void; onAddExpression: Props["onAddExpression"] }) {
  const [comparison, setComparison] = useState("x^2");
  return <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
    <div className="space-y-2">
      <SliderControl density="compact" label={`Vertical scale a = ${values.a}`} min={-4} max={4} step={0.1} value={values.a} onChange={(a) => onChange({ ...values, a })} />
      <SliderControl density="compact" label={`Horizontal scale b = ${values.b}`} min={-4} max={4} step={0.1} value={values.b} onChange={(b) => onChange({ ...values, b })} />
      <SliderControl density="compact" label={`Horizontal shift h = ${values.h}`} min={-8} max={8} step={0.25} value={values.h} onChange={(h) => onChange({ ...values, h })} />
      <SliderControl density="compact" label={`Vertical shift k = ${values.k}`} min={-8} max={8} step={0.25} value={values.k} onChange={(k) => onChange({ ...values, k })} />
    </div>
    <div className="space-y-3"><div className="rounded-lg border border-slate-200 p-3 dark:border-white/10"><p className="text-xs font-black uppercase text-slate-500">a f(b(x-h)) + k</p><p className="mt-2 break-all font-mono text-sm">{expression}</p><button type="button" className="action-primary mt-3" onClick={onAdd}><Plus className="h-4 w-4" />Plot transformation</button></div><div className="rounded-lg border border-slate-200 p-3 dark:border-white/10"><label className="text-xs font-black uppercase text-slate-500">Comparison function<input className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-sm dark:border-white/10 dark:bg-slate-950" value={comparison} onChange={(event) => setComparison(event.target.value)} /></label><div className="mt-2 flex flex-wrap gap-2"><button type="button" className="tool-button" onClick={() => onAddComparison(comparison)}><Plus className="h-4 w-4" />Overlay</button><button type="button" className="tool-button" onClick={() => onAddComparison(`(${expression})-(${comparison})`)}><GitCompare className="h-4 w-4" />Plot difference</button></div></div></div>
  </div>;

  function onAddComparison(next: string) {
    onAddExpression(next, "comparison");
  }
}

function SimulationPanel({ onAdd }: { onAdd: Props["onAddExpression"] }) {
  const [modelId, setModelId] = useState(SIMULATION_MODELS[0].id);
  const model = SIMULATION_MODELS.find((item) => item.id === modelId) ?? SIMULATION_MODELS[0];
  const [parameters, setParameters] = useState(() => defaultSimulationParameters(model));
  const series = useMemo(() => simulationSeries(model, parameters), [model, parameters]);
  const min = Math.min(...series.map((point) => point.value));
  const max = Math.max(...series.map((point) => point.value));
  const span = Math.max(1e-8, max - min);
  const path = series.map((point, index) => `${index ? "L" : "M"}${(point.t / 10) * 600},${190 - ((point.value - min) / span) * 170}`).join(" ");
  const changeModel = (id: string) => { const next = SIMULATION_MODELS.find((item) => item.id === id)!; setModelId(id); setParameters(defaultSimulationParameters(next)); };
  return <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
    <div>
      <label className="text-xs font-black uppercase text-slate-500">Simulation<select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" value={model.id} onChange={(event) => changeModel(event.target.value)}>{SIMULATION_MODELS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <p className="mt-2 text-xs text-slate-500">{SIMULATION_MODELS.length} working offline models</p>
      <div className="mt-3 space-y-2">{model.parameters.map(([name, , minValue, maxValue]) => <SliderControl key={name} density="compact" label={`${name} = ${round(parameters[name])}`} min={minValue} max={maxValue} step={(maxValue - minValue) / 100} value={parameters[name]} onChange={(value) => setParameters((current) => ({ ...current, [name]: value }))} />)}</div>
    </div>
    <div><svg className="h-56 w-full rounded-lg border border-slate-200 bg-slate-950" viewBox="0 0 600 210" role="img" aria-label={`${model.name} simulation plot`}><path d={path} fill="none" stroke="#22d3ee" strokeWidth="3" /><line x1="0" x2="600" y1="190" y2="190" stroke="#64748b" /></svg><p className="mt-2 font-mono text-sm font-bold">{model.equation}</p><p className="mt-1 text-xs text-slate-500">{model.note} Range: {round(min)} to {round(max)}.</p><button type="button" className="tool-button mt-2" onClick={() => onAdd(seriesToExpression(series), model.name)}><Plus className="h-4 w-4" />Plot sampled result</button></div>
  </div>;
}

function NotebookPanel({ expression, onOpen }: { expression: string; onOpen: (expression: string) => void }) {
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<NotebookEntry[]>(() => { try { return JSON.parse(localStorage.getItem(NOTEBOOK_KEY) ?? "[]"); } catch { return []; } });
  const save = () => { const next = [{ id: crypto.randomUUID(), expression, note: note.trim(), createdAt: new Date().toISOString() }, ...entries].slice(0, 50); setEntries(next); localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(next)); setNote(""); };
  return <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><div><p className="break-all font-mono text-sm">{expression}</p><textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-950" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Observation, conjecture, or explanation" /><button type="button" className="action-primary mt-2" onClick={save}><BookOpen className="h-4 w-4" />Save story scene offline</button></div><div className="max-h-64 space-y-2 overflow-auto">{entries.length ? entries.map((entry) => <article key={entry.id} className="rounded-lg border border-slate-200 p-2 dark:border-white/10"><p className="break-all font-mono text-xs font-bold">{entry.expression}</p><p className="mt-1 text-sm">{entry.note || "Graph snapshot note"}</p><button type="button" className="tool-button mt-2" onClick={() => onOpen(entry.expression)}>Plot scene</button></article>) : <p className="text-sm text-slate-500">No notebook scenes yet.</p>}</div></div>;
}

function UnitPanel() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const result = convertGraphUnit(value, from, to);
  return <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr]">
    <label className="text-xs font-black uppercase text-slate-500">Value<input type="number" className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 font-mono dark:border-white/10 dark:bg-slate-950" value={value} onChange={(event) => setValue(Number(event.target.value))} /></label>
    <label className="text-xs font-black uppercase text-slate-500">From<select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950" value={from} onChange={(event) => setFrom(event.target.value)}>{GRAPH_UNITS.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.symbol} - {unit.name}</option>)}</select></label>
    <label className="text-xs font-black uppercase text-slate-500">To<select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950" value={to} onChange={(event) => setTo(event.target.value)}>{GRAPH_UNITS.map((unit) => <option key={unit.symbol} value={unit.symbol}>{unit.symbol} - {unit.name}</option>)}</select></label>
    <p className={`sm:col-span-3 rounded-lg p-3 text-sm font-bold ${result.ok ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100"}`}>{result.message}</p>
  </div>;
}

function CommandPalette({ onRun, onOpenTab }: { onRun: (action: CasAction) => void; onOpenTab: (tab: Tab) => void }) {
  return <div className="border-b border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-900"><p className="mb-2 text-xs font-black uppercase text-slate-500">Command palette</p><div className="flex flex-wrap gap-2"><button type="button" className="tool-button" onClick={() => onRun("differentiate")}>Differentiate selected</button><button type="button" className="tool-button" onClick={() => onRun("factor")}>Factor selected</button><button type="button" className="tool-button" onClick={() => onOpenTab("simulations")}>Open Sim Lab</button><button type="button" className="tool-button" onClick={() => onOpenTab("notebook")}>Capture notebook block</button></div></div>;
}

function Status({ status }: { status: IntelligenceStatus }) {
  const tone = status === "exact" ? "bg-emerald-100 text-emerald-800" : status === "numerical" ? "bg-cyan-100 text-cyan-800" : status === "heuristic" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700";
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-black uppercase ${tone}`}>{status === "exact" ? <Check className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}{status}</span>;
}

function seriesToExpression(series: Array<{ t: number; value: number }>) {
  return series.filter((_, index) => index % 8 === 0).map((point) => `(${round(point.t)},${round(point.value)})`).join(";");
}

function round(value: number) { return Math.round(value * 1000) / 1000; }
