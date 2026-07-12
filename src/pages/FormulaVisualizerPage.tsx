import { BookOpen, CheckCircle2, RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formulaVisualizerConfigs, getFormulaVisualizerConfig, type FormulaVisualizerEntry, type FormulaVisualizerRouteConfig } from "../data/formulaVisualizerRoutes";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";

type FormulaVisualizerPageProps = {
  conceptId: string;
};

type FormulaParameters = {
  a: number;
  b: number;
  c: number;
  n: number;
  p: number;
};

const defaultParams: FormulaParameters = { a: 3, b: 2, c: 1, n: 8, p: 45 };
const baseTabs = ["Explore", "Formula Bank", "Examples", "Why it Works", "Practice"] as const;
type Tab = (typeof baseTabs)[number] | "Teacher Notes";

export const realFormulaVisualizerModelTypes = [
  "graph",
  "area",
  "geometry",
  "coordinate",
  "calculus",
  "matrix",
  "vector",
  "probability",
  "statistics",
  "mensuration",
  "number-system",
  "complex",
  "sequence",
  "combinatorics",
  "set-logic",
  "function",
  "linear-programming",
  "polynomial",
  "inequality",
  "distribution",
  "limits-continuity",
  "differential-equations",
  "determinant",
  "three-d-geometry",
  "early-number-sense",
  "fraction-percent",
  "commercial-math",
  "speed-work",
  "mental-math",
  "pre-algebra",
  "number-theory",
  "euclidean-geometry",
  "analytic-geometry",
  "precalculus",
  "calculus-applications",
  "multivariable-calculus",
  "advanced-linear-algebra",
  "abstract-algebra",
  "real-analysis",
  "complex-analysis",
  "topology",
  "differential-geometry",
  "discrete-math",
  "optimization",
  "numerical-methods",
  "dynamical-systems",
  "pde",
  "transforms",
  "mathematical-physics",
  "information-theory",
  "machine-learning",
  "cryptography",
] as const satisfies readonly FormulaVisualizerEntry["visualizerType"][];

export default function FormulaVisualizerPage({ conceptId }: FormulaVisualizerPageProps) {
  const config = getFormulaVisualizerConfig(conceptId);

  if (!config) {
    return (
      <main className="desktop-page-shell">
        <section className="desktop-card p-5">
          <h1 className="text-2xl font-black">Formula visualizer not found</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This concept does not have a configured visualizer route.</p>
          <Link to="/formulas" className="action-primary mt-4 w-fit">
            Open Formula Library
          </Link>
        </section>
      </main>
    );
  }

  return <FormulaVisualizerShell config={config} />;
}

function FormulaVisualizerShell({ config }: { config: FormulaVisualizerRouteConfig }) {
  const [activeTab, setActiveTab] = useState<Tab>("Explore");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedId, setSelectedId] = useState(config.defaultFormulaId);
  const [params, setParams] = useState<FormulaParameters>(defaultParams);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const tabs = useMemo<Tab[]>(() => (config.teacherNotes ? [...baseTabs, "Teacher Notes"] : [...baseTabs]), [config.teacherNotes]);

  const groups = useMemo(() => ["All", ...Array.from(new Set(config.formulas.map((formula) => formula.group)))], [config.formulas]);
  const difficulties = useMemo(() => ["All", ...Array.from(new Set(config.formulas.map((formula) => formula.difficulty)))], [config.formulas]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return config.formulas.filter((formula) => {
      const matchesGroup = group === "All" || formula.group === group;
      const matchesDifficulty = difficulty === "All" || formula.difficulty === difficulty;
      const matchesText =
        !normalized ||
        [formula.title, formula.plainText, formula.description, formula.group, formula.difficulty, ...formula.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesGroup && matchesDifficulty && matchesText;
    });
  }, [config.formulas, difficulty, group, query]);

  const selected = config.formulas.find((formula) => formula.id === selectedId) ?? filtered[0] ?? config.formulas[0];
  const practiceExpected = Math.round(computeResult(selected, params) * 100) / 100;
  const practiceNumeric = Number(practiceAnswer);
  const practiceCorrect = practiceAnswer.trim() !== "" && Number.isFinite(practiceNumeric) && Math.abs(practiceNumeric - practiceExpected) <= 0.05;

  const updateParam = (key: keyof FormulaParameters, value: number) => setParams((current) => ({ ...current, [key]: value }));
  const reset = () => setParams(defaultParams);

  return (
    <main className="desktop-page-shell" data-testid={`${config.id}-formula-visualizer-page`}>
      <section className="mx-auto flex w-full max-w-[1580px] flex-col gap-3">
        <header className="desktop-card overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-violet-50 p-4 dark:border-white/10 dark:from-cyan-950/30 dark:via-slate-950 dark:to-violet-950/30">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  Visual Formula Visualizer
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{config.title}</h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{config.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/formulas" className="action-secondary">
                  All formulas
                </Link>
                <Link to={config.formulaLibraryRoute} className="action-secondary">
                  Reference sheet
                </Link>
                <button type="button" className="action-primary" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Reset controls
                </button>
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-2" aria-label={`${config.shortTitle} formula visualizer tabs`}>
            {tabs.map((tab) => (
              <button key={tab} type="button" className={activeTab === tab ? "action-primary shrink-0 px-3 py-2 text-sm" : "tool-button shrink-0 px-3 py-2 text-sm"} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "Explore" ? (
          <section className="grid min-h-0 gap-3 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
            <FormulaSelector
              config={config}
              difficulty={difficulty}
              difficulties={difficulties}
              filtered={filtered}
              group={group}
              groups={groups}
              query={query}
              selected={selected}
              setDifficulty={setDifficulty}
              setGroup={setGroup}
              setQuery={setQuery}
              setSelectedId={setSelectedId}
            />
            <InteractiveFormulaPanel config={config} formula={selected} params={params} />
            <FormulaParameterControls formula={selected} params={params} reset={reset} updateParam={updateParam} />
          </section>
        ) : null}

        {activeTab === "Formula Bank" ? <FormulaBank config={config} formulas={filtered} query={query} setQuery={setQuery} setSelectedId={setSelectedId} setActiveTab={setActiveTab} /> : null}
        {activeTab === "Examples" ? <ExamplePanel config={config} setParams={setParams} setActiveTab={setActiveTab} /> : null}
        {activeTab === "Why it Works" ? <ExplanationPanel config={config} formula={selected} /> : null}
        {activeTab === "Practice" ? (
          <PracticePanel
            formula={selected}
            params={params}
            answer={practiceAnswer}
            expected={practiceExpected}
            correct={practiceCorrect}
            setAnswer={setPracticeAnswer}
          />
        ) : null}
        {activeTab === "Teacher Notes" && config.teacherNotes ? <TeacherNotesPanel config={config} /> : null}
      </section>
    </main>
  );
}

function FormulaSelector({
  config,
  difficulty,
  difficulties,
  filtered,
  group,
  groups,
  query,
  selected,
  setDifficulty,
  setGroup,
  setQuery,
  setSelectedId,
}: {
  config: FormulaVisualizerRouteConfig;
  difficulty: string;
  difficulties: string[];
  filtered: FormulaVisualizerEntry[];
  group: string;
  groups: string[];
  query: string;
  selected: FormulaVisualizerEntry;
  setDifficulty: (value: string) => void;
  setGroup: (value: string) => void;
  setQuery: (value: string) => void;
  setSelectedId: (value: string) => void;
}) {
  return (
    <aside className="desktop-sidebar-panel min-h-0 space-y-3 xl:sticky xl:top-24">
      <label className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-950/70">
        <Search className="h-4 w-4 text-slate-400" />
        <span className="sr-only">Search {config.shortTitle} formulas</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search formula..." className="min-w-0 flex-1 bg-transparent outline-none" />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" value={group} onChange={(event) => setGroup(event.target.value)} aria-label="Formula group filter">
          {groups.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold dark:border-white/10 dark:bg-slate-950" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Formula difficulty filter">
          {difficulties.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1 thin-scrollbar">
        {filtered.map((formula) => (
          <button
            key={formula.id}
            type="button"
            className={`w-full rounded-xl border p-3 text-left transition ${formula.id === selected.id ? "border-cyan-300 bg-cyan-50 shadow-sm dark:border-cyan-300/50 dark:bg-cyan-400/10" : "border-slate-200 bg-white/80 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`}
            onClick={() => setSelectedId(formula.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-black text-slate-950 dark:text-white">{formula.title}</p>
              <span className="mini-chip">{formula.difficulty}</span>
            </div>
            <MathExpression value={formula.latex} className="mt-2 text-sm text-cyan-700 dark:text-cyan-200" />
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{formula.description}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}

function InteractiveFormulaPanel({ config, formula, params }: { config: FormulaVisualizerRouteConfig; formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  const result = computeResult(formula, params);
  return (
    <SectionCard
      title={formula.title}
      description={`${formula.group} visual model with live formula, diagram, and value updates.`}
      className="min-w-0"
      allowFullscreen
      headerAction={
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 dark:border-cyan-300/30 dark:bg-cyan-400/10 dark:text-cyan-100">
          Live value: {formatNumber(result)}
        </div>
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{formula.group}</p>
          <MathExpression value={formula.latex} display className="mt-2 text-lg text-slate-950 dark:text-white" />
        </div>
      </div>
      <FormulaCanvas formula={formula} params={params} />
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <InfoTile label="Formula type" value={formula.visualizerType} />
        <InfoTile label="Variables" value={formula.variables.join(", ")} />
        <InfoTile label="Reference" value={config.category} />
      </div>
    </SectionCard>
  );
}

function FormulaParameterControls({ formula, params, reset, updateParam }: { formula: FormulaVisualizerEntry; params: FormulaParameters; reset: () => void; updateParam: (key: keyof FormulaParameters, value: number) => void }) {
  const warning = getWarning(formula, params);
  return (
    <aside className="desktop-sidebar-panel space-y-3 xl:sticky xl:top-24">
      <SliderGroup title="Controls" description="Move values and watch the visual, result, and substitution update together.">
        <SliderControl density="compact" label="a" value={params.a} min={-6} max={8} step={0.25} onChange={(value) => updateParam("a", value)} />
        <SliderControl density="compact" label="b" value={params.b} min={-6} max={8} step={0.25} onChange={(value) => updateParam("b", value)} />
        <SliderControl density="compact" label="c" value={params.c} min={-6} max={8} step={0.25} onChange={(value) => updateParam("c", value)} />
        <SliderControl density="compact" label="n" value={params.n} min={1} max={24} step={1} onChange={(value) => updateParam("n", value)} />
        <SliderControl density="compact" label="p" value={params.p} min={0} max={100} step={1} unit="%" onChange={(value) => updateParam("p", value)} />
      </SliderGroup>
      {warning ? <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-100">{warning}</div> : null}
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-black text-slate-950 dark:text-white">Substitution</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{buildSubstitution(formula, params)}</p>
        <button type="button" className="action-secondary mt-3 w-full" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </aside>
  );
}

function FormulaCanvas({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  const result = computeResult(formula, params);
  const points = useMemo(() => makeCurvePoints(formula, params), [formula, params]);
  const bars = makeBars(params);
  const areaSize = Math.max(44, Math.min(128, Math.abs(params.a) * 18 + 40));
  const bSize = Math.max(34, Math.min(100, Math.abs(params.b) * 16 + 28));
  const vectorA = { x: 230 + params.a * 18, y: 190 - params.b * 18 };
  const vectorB = { x: 230 + params.c * 24, y: 190 - (params.n - 8) * 9 };
  const radius = Math.max(36, Math.min(112, Math.abs(params.a) * 12 + 44));
  const sectorAngle = (params.p / 100) * Math.PI * 2;
  const sectorEnd = { x: 230 + radius * Math.cos(-sectorAngle), y: 190 + radius * Math.sin(-sectorAngle) };

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner shadow-cyan-950/30 group-data-[fullscreen=true]/section:h-[calc(100vh-250px)] dark:border-white/10">
      <svg viewBox="0 0 760 390" role="img" aria-label={`${formula.title} interactive visual output`} className="h-[360px] w-full max-w-full group-data-[fullscreen=true]/section:h-full">
        <defs>
          <linearGradient id="formulaPane" x1="0" x2="1">
            <stop stopColor="#08111f" />
            <stop offset="1" stopColor="#10243c" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="760" height="390" rx="22" fill="url(#formulaPane)" />
        <Grid />
        {isProportionalReasoningFormula(formula.id) ? (
          <ProportionalReasoningVisual formula={formula} params={params} />
        ) : isTrigonometryFormula(formula.id) ? (
          <TrigonometryFormulaVisual formula={formula} params={params} />
        ) : isDeepenedPhaseOneFormula(formula.id) ? (
          <DeepenedPhaseOneVisual formula={formula} params={params} />
        ) : formula.visualizerType === "area" ? (
          <g transform="translate(240 78)">
            <rect x="0" y="0" width={areaSize} height={areaSize} fill="#22d3ee" opacity="0.78" />
            <rect x={areaSize} y="0" width={bSize} height={areaSize} fill="#f59e0b" opacity="0.78" />
            <rect x="0" y={areaSize} width={areaSize} height={bSize} fill="#f59e0b" opacity="0.72" />
            <rect x={areaSize} y={areaSize} width={bSize} height={bSize} fill="#a78bfa" opacity="0.82" />
            <path d={`M0 0 H${areaSize + bSize} V${areaSize + bSize} H0 Z`} fill="none" stroke="#e0f2fe" strokeWidth="4" />
            <Text x={areaSize / 2} y={areaSize / 2} value="a^2" />
            <Text x={areaSize + bSize / 2} y={areaSize / 2} value="ab" />
            <Text x={areaSize / 2} y={areaSize + bSize / 2} value="ab" />
            <Text x={areaSize + bSize / 2} y={areaSize + bSize / 2} value="b^2" />
          </g>
        ) : formula.visualizerType === "geometry" || formula.visualizerType === "mensuration" ? (
          <g>
            <circle cx="230" cy="190" r={radius} fill="#22d3ee" opacity="0.16" stroke="#67e8f9" strokeWidth="4" />
            <path d={`M230 190 L${230 + radius} 190 A${radius} ${radius} 0 ${params.p > 50 ? 1 : 0} 0 ${sectorEnd.x} ${sectorEnd.y} Z`} fill="#f59e0b" opacity="0.45" stroke="#fde68a" strokeWidth="3" />
            <polygon points={`430,280 ${430 + areaSize},280 ${430 + areaSize * 0.74},${280 - bSize}`} fill="#a78bfa" opacity="0.5" stroke="#ddd6fe" strokeWidth="4" />
            <line x1="230" y1="190" x2={230 + radius} y2="190" stroke="#e0f2fe" strokeWidth="3" />
            <Text x="230" y="185" value="r" />
            <Text x="508" y="304" value="base" />
            <Text x="610" y="218" value="height" />
          </g>
        ) : formula.visualizerType === "coordinate" || formula.visualizerType === "graph" || formula.visualizerType === "calculus" ? (
          <g>
            <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#softGlow)" />
            {formula.visualizerType === "calculus" ? bars.map((bar) => <rect key={bar.x} x={bar.x} y={bar.y} width={bar.w} height={bar.h} fill="#f59e0b" opacity="0.45" stroke="#fde68a" />) : null}
            <circle cx="380" cy={190 - result * 9} r="8" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
            <line x1="80" y1="190" x2="680" y2="190" stroke="#94a3b8" strokeWidth="2" />
            <line x1="380" y1="50" x2="380" y2="330" stroke="#94a3b8" strokeWidth="2" />
          </g>
        ) : formula.visualizerType === "matrix" ? (
          <MatrixVisual params={params} />
        ) : formula.visualizerType === "vector" ? (
          <g>
            <line x1="80" y1="190" x2="680" y2="190" stroke="#94a3b8" strokeWidth="2" />
            <line x1="230" y1="330" x2="230" y2="50" stroke="#94a3b8" strokeWidth="2" />
            <Arrow x1={230} y1={190} x2={vectorA.x} y2={vectorA.y} color="#22d3ee" label="a" />
            <Arrow x1={230} y1={190} x2={vectorB.x} y2={vectorB.y} color="#f59e0b" label="b" />
            <Arrow x1={230} y1={190} x2={vectorA.x + vectorB.x - 230} y2={vectorA.y + vectorB.y - 190} color="#a78bfa" label="a+b" />
          </g>
        ) : formula.visualizerType === "probability" ? (
          <g>
            <circle cx="330" cy="190" r={95 + params.a * 3} fill="#22d3ee" opacity="0.42" stroke="#67e8f9" strokeWidth="4" />
            <circle cx="430" cy="190" r={85 + params.b * 3} fill="#a78bfa" opacity="0.42" stroke="#ddd6fe" strokeWidth="4" />
            <Text x="285" y="190" value="A" />
            <Text x="475" y="190" value="B" />
            <Text x="380" y="190" value="A∩B" />
            <rect x="120" y="312" width={Math.max(20, params.p * 5)} height="18" rx="9" fill="#f59e0b" />
          </g>
        ) : isPhase2Visual(formula.visualizerType) ? (
          <Phase2Visual formula={formula} params={params} />
        ) : isPhase3Visual(formula.visualizerType) ? (
          <Phase3Visual formula={formula} params={params} />
        ) : (
          <StatisticsVisual params={params} />
        )}
        <foreignObject x="34" y="24" width="300" height="88">
          <div className="rounded-xl border border-cyan-300/40 bg-slate-950/75 p-3 text-white">
            <p className="text-xs font-black uppercase text-cyan-200">Selected model</p>
            <p className="mt-1 text-sm font-black">{formula.title}</p>
            <p className="mt-1 text-xs text-slate-300">Live value {formatNumber(result)}</p>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

function FormulaBank({ config, formulas, query, setQuery, setSelectedId, setActiveTab }: { config: FormulaVisualizerRouteConfig; formulas: FormulaVisualizerEntry[]; query: string; setQuery: (value: string) => void; setSelectedId: (value: string) => void; setActiveTab: (tab: Tab) => void }) {
  return (
    <section className="desktop-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black">Formula Bank</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{config.formulas.length} formulas grouped for fast visual practice.</p>
        </div>
        <label className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-950/70 lg:w-[360px]">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bank..." className="min-w-0 flex-1 bg-transparent outline-none" />
        </label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {formulas.map((formula) => (
          <article key={formula.id} className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-black">{formula.title}</h3>
              <span className="mini-chip">{formula.group}</span>
            </div>
            <MathExpression value={formula.latex} className="mt-2 text-cyan-700 dark:text-cyan-200" />
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formula.description}</p>
            <button type="button" className="action-secondary mt-3" onClick={() => { setSelectedId(formula.id); setActiveTab("Explore"); }}>
              Open visual
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExamplePanel({ config, setParams, setActiveTab }: { config: FormulaVisualizerRouteConfig; setParams: (params: FormulaParameters) => void; setActiveTab: (tab: Tab) => void }) {
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {config.examples.map((example) => (
        <article key={example.title} className="desktop-card p-4">
          <h2 className="text-xl font-black">{example.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{example.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(example.values).map(([key, value]) => <span key={key} className="mini-chip">{key}={value}</span>)}
          </div>
          <button type="button" className="action-primary mt-4" onClick={() => { setParams({ ...defaultParams, ...example.values }); setActiveTab("Explore"); }}>
            Load example
          </button>
        </article>
      ))}
    </section>
  );
}

function ExplanationPanel({ config, formula }: { config: FormulaVisualizerRouteConfig; formula: FormulaVisualizerEntry }) {
  return (
    <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
      <article className="desktop-card p-4">
        <h2 className="text-2xl font-black">Why it works</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{formula.description}</p>
        <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-300/30 dark:bg-cyan-400/10">
          <MathExpression value={formula.latex} display className="text-lg" />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The visual keeps the same mathematical quantity while changing the representation. Watch the highlighted length, area, slope, count, or probability region, then compare it with the live substitution.
        </p>
        {formula.commonMistake ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-100">
            Common mistake: {formula.commonMistake}
          </div>
        ) : null}
      </article>
      <aside className="desktop-sidebar-panel space-y-3">
        <h3 className="text-lg font-black">Related learning</h3>
        <Link to={config.formulaLibraryRoute} className="action-secondary w-full">
          <BookOpen className="h-4 w-4" /> Formula reference
        </Link>
        {config.relatedRoutes.map((route) => (
          <Link key={route.href} to={route.href} className="action-secondary w-full">
            {route.label}
          </Link>
        ))}
      </aside>
    </section>
  );
}

function PracticePanel({ formula, params, answer, expected, correct, setAnswer }: { formula: FormulaVisualizerEntry; params: FormulaParameters; answer: string; expected: number; correct: boolean; setAnswer: (value: string) => void }) {
  return (
    <section className="desktop-card p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <h2 className="text-2xl font-black">Quick Practice</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Estimate the live value for <strong>{formula.title}</strong> using the current controls: {buildSubstitution(formula, params)}
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-black">Your answer</span>
            <input className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-lg font-black outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950" value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="decimal" />
          </label>
          {answer.trim() ? (
            <p className={`mt-3 rounded-xl p-3 text-sm font-black ${correct ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100" : "bg-amber-50 text-amber-800 dark:bg-amber-300/10 dark:text-amber-100"}`}>
              {correct ? "Correct. Nice substitution." : `Close check: expected about ${expected}.`}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <CheckCircle2 className="h-7 w-7 text-cyan-500" />
          <h3 className="mt-2 text-lg font-black">Student prompt</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Change one slider only. Say what changed in the visual, what stayed the same, and which part of the formula explains it.
          </p>
        </div>
      </div>
    </section>
  );
}

function MatrixVisual({ params }: { params: FormulaParameters }) {
  const cells = [params.a, params.b, params.c, params.n / 2];
  const det = cells[0] * cells[3] - cells[1] * cells[2];
  return (
    <g transform="translate(250 74)">
      {cells.map((cell, index) => {
        const x = (index % 2) * 100;
        const y = Math.floor(index / 2) * 78;
        return (
          <g key={index}>
            <rect x={x} y={y} width="82" height="60" rx="12" fill="#22d3ee" opacity="0.25" stroke="#67e8f9" strokeWidth="3" />
            <Text x={x + 41} y={y + 36} value={formatNumber(cell)} />
          </g>
        );
      })}
      <Text x="300" y="32" value={`det=${formatNumber(det)}`} />
      <rect x="280" y="66" width={Math.abs(det) * 4 + 28} height="120" rx="12" fill="#f59e0b" opacity="0.44" />
    </g>
  );
}

function StatisticsVisual({ params }: { params: FormulaParameters }) {
  const values = [params.a, params.b, params.c, params.n / 2, params.p / 10].map((value) => Math.max(0.5, value + 4));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return (
    <g transform="translate(160 86)">
      {values.map((value, index) => (
        <rect key={index} x={index * 82} y={220 - value * 18} width="46" height={value * 18} rx="10" fill={index % 2 ? "#a78bfa" : "#22d3ee"} opacity="0.75" />
      ))}
      <line x1="0" y1={220 - mean * 18} x2="430" y2={220 - mean * 18} stroke="#facc15" strokeWidth="4" strokeDasharray="10 8" />
      <Text x="500" y={224 - mean * 18} value="mean" />
    </g>
  );
}

function isProportionalReasoningFormula(id: string) {
  return [
    "equivalent-ratios",
    "cross-multiplication",
    "missing-fourth-term",
    "representative-fraction",
    "actual-distance-map-scale",
    "map-distance-actual-scale",
    "multi-term-ratio-share",
    "ratio-to-percentage",
    "ratio-to-pie-angle",
    "direct-proportion",
    "inverse-proportion",
    "constant-check",
  ].includes(id);
}

function ProportionalReasoningVisual({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  const a = Math.max(0.25, Math.abs(params.a));
  const b = Math.max(0.25, Math.abs(params.b));
  const c = Math.max(0.25, Math.abs(params.c));
  const d = Math.max(1, Math.abs(params.n));
  const parts = [a, b, c].map((value) => Math.max(0.1, value));
  const partSum = parts.reduce((sum, value) => sum + value, 0);
  const widths = parts.map((part) => (part / partSum) * 430);
  const firstPercent = (a / partSum) * 100;
  const firstAngle = (a / partSum) * 360;
  const ratioDiff = a * d - b * c;
  const mapActualKm = (a * b) / 100000;
  const directK = b || 1;
  const inverseK = Math.max(0.1, a * b);
  const pieAngle = (firstAngle / 180) * Math.PI;
  const pieEnd = { x: 560 + 82 * Math.cos(pieAngle - Math.PI / 2), y: 190 + 82 * Math.sin(pieAngle - Math.PI / 2) };

  if (["equivalent-ratios", "cross-multiplication", "missing-fourth-term"].includes(formula.id)) {
    const leftHeight = 46 + a * 12;
    const leftWidth = 52 + d * 5;
    const rightHeight = 46 + b * 12;
    const rightWidth = 52 + c * 9;
    return (
      <g>
        <rect x="118" y={245 - leftHeight} width={leftWidth} height={leftHeight} rx="10" fill="#22d3ee" opacity="0.45" stroke="#67e8f9" strokeWidth="4" />
        <rect x="398" y={245 - rightHeight} width={rightWidth} height={rightHeight} rx="10" fill="#f59e0b" opacity="0.45" stroke="#fde68a" strokeWidth="4" />
        <Text x={118 + leftWidth / 2} y={222 - leftHeight} value={`a x d = ${formatNumber(a * d)}`} />
        <Text x={398 + rightWidth / 2} y={222 - rightHeight} value={`b x c = ${formatNumber(b * c)}`} />
        <line x1="110" y1="278" x2="650" y2="278" stroke="#94a3b8" strokeWidth="3" />
        <Text x="380" y="86" value={Math.abs(ratioDiff) < 0.01 ? "equivalent ratios" : `difference ${formatNumber(ratioDiff)}`} />
        <Text x="380" y="128" value={formula.id === "missing-fourth-term" ? `missing d = ${formatNumber((b * c) / a)}` : "compare cross-products"} />
      </g>
    );
  }

  if (["representative-fraction", "actual-distance-map-scale", "map-distance-actual-scale"].includes(formula.id)) {
    const mapWidth = Math.max(50, Math.min(240, a * 42));
    const actualWidth = Math.max(160, Math.min(520, mapWidth + Math.log10(Math.max(10, b)) * 84));
    return (
      <g>
        <line x1="120" y1="145" x2={120 + mapWidth} y2="145" stroke="#22d3ee" strokeWidth="12" strokeLinecap="round" />
        <line x1="120" y1="245" x2={120 + actualWidth} y2="245" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
        <line x1="120" y1="122" x2="120" y2="270" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="8 8" />
        <line x1={120 + mapWidth} y1="122" x2={120 + actualWidth} y2="270" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="8 8" />
        <Text x={120 + mapWidth / 2} y="112" value={`${formatNumber(a)} map units`} />
        <Text x={120 + actualWidth / 2} y="296" value={`${formatNumber(mapActualKm)} km actual`} />
        <Text x="560" y="118" value={`scale 1:${formatNumber(b)}`} />
        <Text x="560" y="164" value="same units first" />
      </g>
    );
  }

  if (["multi-term-ratio-share", "ratio-to-percentage", "ratio-to-pie-angle"].includes(formula.id)) {
    let x = 140;
    const colors = ["#22d3ee", "#f59e0b", "#a78bfa"];
    return (
      <g>
        {widths.map((width, index) => {
          const currentX = x;
          x += width;
          return (
            <g key={index}>
              <rect x={currentX} y="115" width={width} height="76" rx="14" fill={colors[index]} opacity="0.7" />
              <Text x={currentX + width / 2} y="154" value={`${formatNumber(parts[index])}`} />
            </g>
          );
        })}
        <circle cx="560" cy="190" r="82" fill="#172554" stroke="#67e8f9" strokeWidth="4" />
        <path d={`M560 190 L560 108 A82 82 0 ${firstAngle > 180 ? 1 : 0} 1 ${pieEnd.x} ${pieEnd.y} Z`} fill="#facc15" opacity="0.65" stroke="#fef08a" strokeWidth="3" />
        <Text x="350" y="250" value={`share=${formatNumber((a / partSum) * Math.abs(params.n))}`} />
        <Text x="560" y="302" value={`${formatNumber(firstPercent)}% / ${formatNumber(firstAngle)} deg`} />
      </g>
    );
  }

  return (
    <g>
      <line x1="100" y1="300" x2="670" y2="300" stroke="#94a3b8" strokeWidth="3" />
      <line x1="120" y1="62" x2="120" y2="320" stroke="#94a3b8" strokeWidth="3" />
      <polyline
        points={Array.from({ length: 9 }, (_, index) => {
          const x = 1 + index;
          const y = formula.id === "inverse-proportion" ? inverseK / x : directK * x;
          return `${120 + index * 58},${Math.max(70, Math.min(300, 300 - y * 9))}`;
        }).join(" ")}
        fill="none"
        stroke={formula.id === "inverse-proportion" ? "#f59e0b" : "#22d3ee"}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Text x="520" y="96" value={formula.id === "inverse-proportion" ? `xy=${formatNumber(inverseK)}` : `y/x=${formatNumber(directK)}`} />
      <Text x="520" y="142" value={formula.id === "constant-check" ? "ratio or product?" : formula.id === "inverse-proportion" ? "hyperbola model" : "line model"} />
    </g>
  );
}

function isTrigonometryFormula(id: string) {
  return [
    "sin-ratio",
    "cos-ratio",
    "tan-ratio",
    "pythagorean-identity",
    "tan-identity",
    "sine-rule",
    "cosine-rule",
    "angle-sum-sine",
  ].includes(id);
}

function TrigonometryFormulaVisual({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  const angle = (Math.max(5, Math.min(85, params.p)) / 180) * Math.PI;
  const r = 104;
  const cx = 220;
  const cy = 190;
  const px = cx + r * Math.cos(angle);
  const py = cy - r * Math.sin(angle);
  const tri = { ax: 420, ay: 284, bx: 660, by: 284, cx: 420 + Math.max(70, Math.abs(params.a) * 34), cy: 284 - Math.max(86, Math.abs(params.b) * 30) };
  const showTriangleRule = ["sine-rule", "cosine-rule"].includes(formula.id);

  if (showTriangleRule) {
    return (
      <g>
        <polygon points={`${tri.ax},${tri.ay} ${tri.bx},${tri.by} ${tri.cx},${tri.cy}`} fill="#22d3ee" opacity="0.28" stroke="#e0f2fe" strokeWidth="5" />
        <path d={`M${tri.bx - 46} ${tri.by} A46 46 0 0 0 ${tri.bx - 34} ${tri.by - 34}`} fill="none" stroke="#facc15" strokeWidth="5" />
        <Text x={(tri.ax + tri.bx) / 2} y={tri.ay + 28} value="a" />
        <Text x={(tri.bx + tri.cx) / 2 + 24} y={(tri.by + tri.cy) / 2} value="b" />
        <Text x={(tri.ax + tri.cx) / 2 - 28} y={(tri.ay + tri.cy) / 2} value="c" />
        <Text x={tri.bx - 34} y={tri.by - 26} value="C" />
        <Text x="240" y="116" value={formula.id === "cosine-rule" ? "c^2 = a^2+b^2-2ab cos C" : "a/sin A = b/sin B = c/sin C"} />
        <Text x="240" y="166" value={formula.id === "cosine-rule" ? "Pythagoras plus angle correction" : "same circumcircle ratio"} />
      </g>
    );
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.12" stroke="#67e8f9" strokeWidth="4" />
      <line x1={cx - 135} y1={cy} x2={cx + 145} y2={cy} stroke="#94a3b8" strokeWidth="3" />
      <line x1={cx} y1={cy + 135} x2={cx} y2={cy - 145} stroke="#94a3b8" strokeWidth="3" />
      <Arrow x1={cx} y1={cy} x2={px} y2={py} color="#facc15" label="r=1" />
      <line x1={px} y1={py} x2={px} y2={cy} stroke="#f59e0b" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#22d3ee" strokeWidth="5" />
      <polygon points={`${420},${284} ${650},${284} ${650},${py}`} fill="#a78bfa" opacity="0.24" stroke="#ddd6fe" strokeWidth="4" />
      <Text x={px + 38} y={(py + cy) / 2} value="sin" />
      <Text x={(cx + px) / 2} y={cy + 28} value="cos" />
      <Text x="535" y="118" value={formula.id === "pythagorean-identity" ? "sin^2 + cos^2 = 1" : formula.id === "tan-identity" ? "tan = sin / cos" : "triangle ratio"} />
      <Text x="535" y="164" value={`${formula.title}: ${formatNumber(computeResult(formula, params))}`} />
    </g>
  );
}

function TeacherNotesPanel({ config }: { config: FormulaVisualizerRouteConfig }) {
  const notes = config.teacherNotes;
  if (!notes) return null;
  return (
    <section className="desktop-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Teacher Notes</p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">{config.shortTitle} classroom support</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{notes.quickBoardExplanation}</p>
        </div>
        <Link to={config.formulaLibraryRoute} className="action-secondary shrink-0">
          <BookOpen className="h-4 w-4" /> Formula reference
        </Link>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <InfoBlock title="Discussion prompt" text={notes.discussionPrompt} />
        <InfoBlock title="Misconception check" text={notes.misconceptionPrompt} />
        <InfoBlock title="5-minute activity" text={notes.fiveMinuteActivity} />
        <InfoBlock title="Practice challenge" text={notes.practiceChallenge} />
        <InfoBlock title="Prerequisites" text={notes.prerequisites.join(", ")} />
        <InfoBlock title="Next concepts" text={notes.nextConcepts.join(", ")} />
      </div>
    </section>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function DeepenedPhaseOneVisual({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  if (["completing-square", "quadratic-standard"].includes(formula.id)) return <QuadraticDepthVisual params={params} formula={formula} />;
  if (["pythagoras", "circle-area", "sector-area"].includes(formula.id)) return <GeometryDepthVisual params={params} formula={formula} />;
  if (["section", "triangle-area-coordinates"].includes(formula.id)) return <CoordinateDepthVisual params={params} formula={formula} />;
  if (["chain-rule", "product-rule"].includes(formula.id)) return <DerivativeDepthVisual params={params} formula={formula} />;
  if (["area-under-curve", "area-between-curves"].includes(formula.id)) return <IntegrationDepthVisual params={params} formula={formula} />;
  if (["determinant-2x2", "linear-transform"].includes(formula.id)) return <MatrixDepthVisual params={params} formula={formula} />;
  if (["projection", "dot-product"].includes(formula.id)) return <VectorDepthVisual params={params} formula={formula} />;
  if (formula.id === "bayes") return <BayesDepthVisual params={params} />;
  if (["standard-deviation", "regression"].includes(formula.id)) return <StatisticsDepthVisual params={params} formula={formula} />;
  if (["cylinder-volume", "cone-volume", "sphere-volume"].includes(formula.id)) return <MensurationDepthVisual params={params} formula={formula} />;
  return <StatisticsVisual params={params} />;
}

function QuadraticDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const discriminant = params.b ** 2 - 4 * params.a * params.c;
  const vertexX = params.a === 0 ? 0 : -params.b / (2 * params.a);
  const curve = makeCurvePoints({ ...formula, visualizerType: "graph" }, params);
  return (
    <g>
      <polyline points={curve} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#softGlow)" />
      <line x1="80" y1="190" x2="680" y2="190" stroke="#94a3b8" strokeWidth="2" />
      <line x1="380" y1="50" x2="380" y2="330" stroke="#94a3b8" strokeWidth="2" />
      <line x1={380 + vertexX * 48} y1="70" x2={380 + vertexX * 48} y2="324" stroke="#facc15" strokeWidth="3" strokeDasharray="8 8" />
      <rect x="118" y="76" width="86" height="86" fill="#22d3ee" opacity="0.35" stroke="#67e8f9" strokeWidth="3" />
      <rect x="204" y="76" width="54" height="86" fill="#f59e0b" opacity="0.42" />
      <rect x="118" y="162" width="86" height="54" fill="#f59e0b" opacity="0.42" />
      <Text x="560" y="88" value={`D=${formatNumber(discriminant)}`} />
      <Text x="560" y="130" value={discriminant > 0 ? "2 real roots" : discriminant === 0 ? "1 repeated root" : "no real roots"} />
    </g>
  );
}

function GeometryDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const r = Math.max(44, Math.min(110, Math.abs(params.a) * 14 + 44));
  if (formula.id === "pythagoras") {
    const a = Math.max(70, Math.abs(params.a) * 22 + 70);
    const b = Math.max(60, Math.abs(params.b) * 22 + 60);
    return (
      <g transform="translate(175 82)">
        <polygon points={`0,210 ${a},210 ${a},${210 - b}`} fill="#22d3ee" opacity="0.36" stroke="#e0f2fe" strokeWidth="4" />
        <rect x="0" y={210 - a} width={a} height={a} fill="#22d3ee" opacity="0.2" stroke="#67e8f9" />
        <rect x={a} y={210 - b} width={b} height={b} fill="#f59e0b" opacity="0.22" stroke="#fde68a" />
        <rect x={a + 100} y={210 - Math.sqrt(a * a + b * b) * 0.56} width={Math.sqrt(a * a + b * b) * 0.56} height={Math.sqrt(a * a + b * b) * 0.56} fill="#a78bfa" opacity="0.24" stroke="#ddd6fe" />
        <Text x="74" y="230" value="a^2" />
        <Text x={a + 36} y={210 - b - 18} value="b^2" />
        <Text x={a + 205} y="112" value="c^2" />
      </g>
    );
  }
  const sectors = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;
    const next = ((index + 1) / 16) * Math.PI * 2;
    return `M230 190 L${230 + r * Math.cos(angle)} ${190 + r * Math.sin(angle)} A${r} ${r} 0 0 1 ${230 + r * Math.cos(next)} ${190 + r * Math.sin(next)} Z`;
  });
  return (
    <g>
      <circle cx="230" cy="190" r={r} fill="#22d3ee" opacity="0.14" stroke="#67e8f9" strokeWidth="4" />
      {sectors.map((path, index) => <path key={path} d={path} fill={index % 2 ? "#f59e0b" : "#22d3ee"} opacity="0.4" stroke="#e0f2fe" strokeWidth="1" />)}
      <path d={`M430 286 L560 286 L495 ${286 - r} Z`} fill="#f59e0b" opacity="0.42" stroke="#fde68a" strokeWidth="4" />
      <Text x="230" y="332" value="sector slices" />
      <Text x="504" y="308" value="near triangle" />
    </g>
  );
}

function CoordinateDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const p1 = { x: 180, y: 280 };
  const p2 = { x: 560, y: 110 };
  const t = Math.max(0.15, Math.min(0.85, Math.abs(params.a) / 8));
  const px = p1.x + (p2.x - p1.x) * t;
  const py = p1.y + (p2.y - p1.y) * t;
  return (
    <g>
      <line x1="80" y1="300" x2="680" y2="300" stroke="#94a3b8" />
      <line x1="120" y1="50" x2="120" y2="330" stroke="#94a3b8" />
      <polygon points="180,280 560,110 500,296" fill="#22d3ee" opacity="0.28" stroke="#67e8f9" strokeWidth="4" />
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#facc15" strokeWidth="5" />
      <circle cx={px} cy={py} r="11" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <Text x={px + 58} y={py - 16} value={formula.id === "section" ? "ratio point" : "det area"} />
      <Text x="530" y="330" value={formula.id === "section" ? "weighted average" : "shoelace sum"} />
    </g>
  );
}

function DerivativeDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const outer = makeCurvePoints({ ...formula, id: "quadratic-standard", visualizerType: "graph" }, params);
  return (
    <g>
      <polyline points={outer} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <rect x="168" y="116" width={Math.abs(params.a) * 28 + 82} height={Math.abs(params.b) * 20 + 82} fill="#f59e0b" opacity="0.28" stroke="#fde68a" strokeWidth="4" />
      <rect x="168" y="116" width={Math.abs(params.a) * 28 + 82} height="24" fill="#a78bfa" opacity="0.55" />
      <rect x="168" y="116" width="24" height={Math.abs(params.b) * 20 + 82} fill="#22d3ee" opacity="0.55" />
      <Text x="540" y="96" value={formula.id === "chain-rule" ? "outer rate x inner rate" : "two changing sides"} />
      <Text x="540" y="138" value={formula.id === "chain-rule" ? "f'(g(x))g'(x)" : "u'v + uv'"} />
    </g>
  );
}

function IntegrationDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const top = makeCurvePoints({ ...formula, id: "quadratic-standard", visualizerType: "graph" }, params);
  const bottom = makeCurvePoints({ ...formula, id: "sin-derivative", visualizerType: "graph" }, { ...params, a: params.a + 1 });
  const bars = makeBars(params);
  return (
    <g>
      <polyline points={top} fill="none" stroke="#22d3ee" strokeWidth="5" />
      {formula.id === "area-between-curves" ? <polyline points={bottom} fill="none" stroke="#f59e0b" strokeWidth="4" /> : null}
      {bars.slice(0, 12).map((bar) => <rect key={bar.x} x={bar.x} y={bar.y} width={bar.w} height={bar.h} fill="#a78bfa" opacity="0.34" stroke="#ddd6fe" />)}
      <Text x="540" y="88" value={formula.id === "area-between-curves" ? "top - bottom" : "accumulated area"} />
      <Text x="540" y="128" value="rectangles -> integral" />
    </g>
  );
}

function MatrixDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const det = params.a * (params.n / 2) - params.b * params.c;
  const skew = Math.max(-60, Math.min(60, params.b * 10));
  return (
    <g transform="translate(150 70)">
      {Array.from({ length: 5 }, (_, index) => <line key={`x-${index}`} x1={index * 58} y1="0" x2={index * 58 + skew} y2="230" stroke="#67e8f9" opacity="0.35" />)}
      {Array.from({ length: 5 }, (_, index) => <line key={`y-${index}`} x1="0" y1={index * 58} x2="250" y2={index * 58 + params.c * 7} stroke="#67e8f9" opacity="0.35" />)}
      <polygon points={`0,0 116,${params.c * 8} ${116 + skew},${116 + params.c * 8} ${skew},116`} fill="#f59e0b" opacity="0.36" stroke="#fde68a" strokeWidth="4" />
      <Text x="460" y="70" value={formula.id === "determinant-2x2" ? `area scale=${formatNumber(det)}` : "grid transform"} />
      <Text x="460" y="118" value="unit square moves" />
    </g>
  );
}

function VectorDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const origin = { x: 220, y: 220 };
  const a = { x: origin.x + params.a * 26 + 110, y: origin.y - params.b * 24 };
  const b = { x: origin.x + 230, y: origin.y - params.c * 28 - 30 };
  return (
    <g>
      <line x1="90" y1="220" x2="675" y2="220" stroke="#94a3b8" />
      <Arrow x1={origin.x} y1={origin.y} x2={a.x} y2={a.y} color="#22d3ee" label="a" />
      <Arrow x1={origin.x} y1={origin.y} x2={b.x} y2={b.y} color="#f59e0b" label="b" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#facc15" strokeWidth="3" strokeDasharray="8 8" />
      <circle cx={(a.x + b.x) / 2} cy={(a.y + b.y) / 2} r="8" fill="#facc15" />
      <Text x="560" y="86" value={formula.id === "projection" ? "shadow on b" : "acute + / obtuse -"} />
      <Text x="560" y="128" value={`dot=${formatNumber(computeResult(formula, params))}`} />
    </g>
  );
}

function BayesDepthVisual({ params }: { params: FormulaParameters }) {
  const prior = Math.max(0.05, Math.min(0.95, params.p / 100));
  const likelihood = Math.max(0.05, Math.min(0.95, Math.abs(params.a) / 8));
  const posterior = (likelihood * prior) / (likelihood * prior + (1 - likelihood) * (1 - prior));
  return (
    <g>
      <line x1="150" y1="190" x2="330" y2="120" stroke="#22d3ee" strokeWidth="5" />
      <line x1="150" y1="190" x2="330" y2="260" stroke="#a78bfa" strokeWidth="5" />
      <line x1="330" y1="120" x2="560" y2="100" stroke="#f59e0b" strokeWidth="5" />
      <line x1="330" y1="260" x2="560" y2="286" stroke="#f59e0b" strokeWidth="5" opacity="0.45" />
      <Text x="138" y="190" value="start" />
      <Text x="330" y="92" value={`prior=${formatNumber(prior)}`} />
      <Text x="565" y="78" value={`posterior=${formatNumber(posterior)}`} />
    </g>
  );
}

function StatisticsDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const values = [params.a, params.b, params.c, params.n / 2, params.p / 10].map((value) => value + 5);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return (
    <g transform="translate(150 80)">
      {values.map((value, index) => {
        const x = index * 78;
        const y = 230 - value * 16;
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="10" fill="#22d3ee" />
            <line x1={x} y1={y} x2={x} y2={230 - mean * 16} stroke="#facc15" strokeWidth="3" strokeDasharray="5 5" />
            {formula.id === "regression" ? <line x1={x} y1={y} x2={x} y2={250 - (index * 14 + mean * 12)} stroke="#f59e0b" strokeWidth="3" /> : null}
          </g>
        );
      })}
      <line x1="-20" y1={230 - mean * 16} x2="390" y2={230 - mean * 16} stroke="#facc15" strokeWidth="4" />
      <line x1="-10" y1="250" x2="390" y2="194" stroke="#a78bfa" strokeWidth="4" opacity={formula.id === "regression" ? 1 : 0.25} />
      <Text x="520" y="78" value={formula.id === "regression" ? "residuals" : "spread from mean"} />
    </g>
  );
}

function MensurationDepthVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const r = Math.max(28, Math.abs(params.a) * 7 + 34);
  const h = Math.max(80, Math.abs(params.b) * 18 + 100);
  return (
    <g>
      <ellipse cx="190" cy={250 - h} rx={r} ry="18" fill="#22d3ee" opacity="0.42" stroke="#67e8f9" strokeWidth="3" />
      <rect x={190 - r} y={250 - h} width={r * 2} height={h} fill="#22d3ee" opacity="0.18" stroke="#67e8f9" strokeWidth="3" />
      <ellipse cx="190" cy="250" rx={r} ry="18" fill="#22d3ee" opacity="0.42" stroke="#67e8f9" strokeWidth="3" />
      <path d={`M390 ${250 - h} L${390 - r} 250 Q390 ${268} ${390 + r} 250 Z`} fill="#f59e0b" opacity="0.34" stroke="#fde68a" strokeWidth="4" />
      <circle cx="590" cy="190" r={r} fill="#a78bfa" opacity="0.26" stroke="#ddd6fe" strokeWidth="4" />
      <Text x="190" y="300" value="cylinder" />
      <Text x="390" y="300" value="cone = 1/3" />
      <Text x="590" y="300" value={formula.id === "sphere-volume" ? "sphere" : "compare volumes"} />
    </g>
  );
}

function isDeepenedPhaseOneFormula(id: string) {
  return [
    "completing-square",
    "quadratic-standard",
    "pythagoras",
    "circle-area",
    "sector-area",
    "section",
    "triangle-area-coordinates",
    "chain-rule",
    "product-rule",
    "area-under-curve",
    "area-between-curves",
    "determinant-2x2",
    "linear-transform",
    "projection",
    "dot-product",
    "bayes",
    "standard-deviation",
    "regression",
    "cylinder-volume",
    "cone-volume",
    "sphere-volume",
  ].includes(id);
}

function Phase2Visual({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  switch (formula.visualizerType) {
    case "number-system":
      return <NumberSystemVisual params={params} />;
    case "complex":
      return <ComplexVisual params={params} />;
    case "sequence":
      return <SequenceVisual params={params} />;
    case "combinatorics":
      return <CombinatoricsVisual params={params} />;
    case "set-logic":
      return <SetLogicVisual params={params} />;
    case "function":
    case "polynomial":
      return <FunctionFamilyVisual params={params} formula={formula} />;
    case "linear-programming":
      return <LinearProgrammingVisual params={params} />;
    case "inequality":
      return <InequalityVisual params={params} />;
    case "distribution":
      return <DistributionVisual params={params} />;
    default:
      return <StatisticsVisual params={params} />;
  }
}

function NumberSystemVisual({ params }: { params: FormulaParameters }) {
  const n = Math.max(2, Math.round(Math.abs(params.n)));
  const a = Math.round(Math.abs(params.a) + 6);
  const b = Math.round(Math.abs(params.b) + 8);
  const gcd = gcdInt(a, b);
  return (
    <g>
      <line x1="110" y1="240" x2="650" y2="240" stroke="#e0f2fe" strokeWidth="4" />
      {Array.from({ length: 13 }, (_, index) => {
        const value = index - 6;
        return (
          <g key={value}>
            <line x1={110 + index * 45} y1="226" x2={110 + index * 45} y2="254" stroke="#94a3b8" />
            <text x={110 + index * 45} y="278" fill="#cbd5e1" fontSize="13" textAnchor="middle">{value}</text>
          </g>
        );
      })}
      <circle cx={110 + (params.a + 6) * 45} cy="240" r="13" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <g transform="translate(160 86)">
        {[2, 3, 5, 7].map((prime, index) => (
          <g key={prime} transform={`translate(${index * 92} 0)`}>
            <circle cx="0" cy="0" r="28" fill="#22d3ee" opacity="0.32" stroke="#67e8f9" strokeWidth="3" />
            <Text x="0" y="0" value={String(prime)} />
            <line x1="0" y1="30" x2="0" y2="78" stroke="#67e8f9" strokeDasharray="6 6" />
          </g>
        ))}
      </g>
      <Text x="520" y="104" value={`gcd(${a},${b})=${gcd}`} />
      <Text x="520" y="140" value={`lcm=${(a * b) / gcd}`} />
      <Text x="520" y="176" value={`n=${n}`} />
    </g>
  );
}

function ComplexVisual({ params }: { params: FormulaParameters }) {
  const zx = 380 + params.a * 35;
  const zy = 190 - params.b * 35;
  const conjugateY = 190 + params.b * 35;
  const r = Math.sqrt(params.a ** 2 + params.b ** 2);
  return (
    <g>
      <line x1="100" y1="190" x2="660" y2="190" stroke="#94a3b8" strokeWidth="3" />
      <line x1="380" y1="50" x2="380" y2="330" stroke="#94a3b8" strokeWidth="3" />
      <Arrow x1={380} y1={190} x2={zx} y2={zy} color="#22d3ee" label="z" />
      <Arrow x1={380} y1={190} x2={zx} y2={conjugateY} color="#f59e0b" label="conj" />
      <circle cx="380" cy="190" r={Math.max(24, r * 35)} fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="8 8" />
      <Text x="590" y="86" value={`|z|=${formatNumber(r)}`} />
      <Text x="590" y="126" value={`arg=${formatNumber((Math.atan2(params.b, params.a) * 180) / Math.PI)} deg`} />
    </g>
  );
}

function SequenceVisual({ params }: { params: FormulaParameters }) {
  const count = Math.max(4, Math.min(12, Math.round(params.n)));
  return (
    <g transform="translate(100 80)">
      {Array.from({ length: count }, (_, index) => {
        const value = params.a + index * params.b;
        const h = Math.max(18, Math.min(210, 80 + value * 10));
        return (
          <g key={index}>
            <rect x={index * 52} y={240 - h} width="34" height={h} rx="8" fill={index % 2 ? "#a78bfa" : "#22d3ee"} opacity="0.78" />
            <text x={index * 52 + 17} y="262" fill="#cbd5e1" fontSize="12" textAnchor="middle">{index + 1}</text>
          </g>
        );
      })}
      <Text x="560" y="70" value={`a_n=${formatNumber(params.a + (count - 1) * params.b)}`} />
      <Text x="560" y="112" value={`S_n=${formatNumber((count / 2) * (2 * params.a + (count - 1) * params.b))}`} />
    </g>
  );
}

function CombinatoricsVisual({ params }: { params: FormulaParameters }) {
  const n = Math.max(3, Math.min(10, Math.round(params.n)));
  const r = Math.max(1, Math.min(n, Math.round(Math.abs(params.b))));
  return (
    <g transform="translate(124 76)">
      {Array.from({ length: n }, (_, index) => (
        <circle key={index} cx={index * 48} cy="60" r="18" fill={index < r ? "#facc15" : "#22d3ee"} opacity="0.86" stroke="#e0f2fe" strokeWidth="3" />
      ))}
      {Array.from({ length: r }, (_, index) => (
        <rect key={index} x={120 + index * 76} y="166" width="54" height="54" rx="12" fill="#a78bfa" opacity="0.74" stroke="#ddd6fe" strokeWidth="3" />
      ))}
      <Text x="500" y="58" value={`n=${n}`} />
      <Text x="500" y="102" value={`r=${r}`} />
      <Text x="500" y="178" value={`nCr=${comb(n, r)}`} />
    </g>
  );
}

function SetLogicVisual({ params }: { params: FormulaParameters }) {
  const p = params.p > 50;
  const q = params.b >= 0;
  return (
    <g>
      <circle cx="330" cy="178" r="104" fill="#22d3ee" opacity="0.42" stroke="#67e8f9" strokeWidth="4" />
      <circle cx="430" cy="178" r="104" fill="#a78bfa" opacity="0.42" stroke="#ddd6fe" strokeWidth="4" />
      <Text x="286" y="178" value="A" />
      <Text x="474" y="178" value="B" />
      <Text x="380" y="178" value="A∩B" />
      <g transform="translate(162 308)">
        {["p", "q", "p=>q"].map((label, index) => <Text key={label} x={index * 150} y="0" value={label} />)}
        <Text x="0" y="38" value={p ? "T" : "F"} />
        <Text x="150" y="38" value={q ? "T" : "F"} />
        <Text x="300" y="38" value={!p || q ? "T" : "F"} />
      </g>
    </g>
  );
}

function FunctionFamilyVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const curve = makeCurvePoints({ ...formula, visualizerType: "graph" }, params);
  return (
    <g>
      <line x1="80" y1="190" x2="680" y2="190" stroke="#94a3b8" strokeWidth="2" />
      <line x1="380" y1="50" x2="380" y2="330" stroke="#94a3b8" strokeWidth="2" />
      <polyline points={curve} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <line x1={380 + params.a * 34} y1="56" x2={380 + params.a * 34} y2="330" stroke="#facc15" strokeWidth="3" strokeDasharray="8 8" />
      <Text x="560" y="88" value={formula.visualizerType === "polynomial" ? "roots / degree" : "input to output"} />
    </g>
  );
}

function LinearProgrammingVisual({ params }: { params: FormulaParameters }) {
  const x1 = 160 + Math.abs(params.a) * 24;
  const y1 = 300 - Math.abs(params.b) * 24;
  return (
    <g>
      <line x1="120" y1="310" x2="650" y2="310" stroke="#94a3b8" strokeWidth="3" />
      <line x1="120" y1="310" x2="120" y2="66" stroke="#94a3b8" strokeWidth="3" />
      <polygon points={`120,310 120,130 ${x1 + 230},${y1} 610,310`} fill="#22d3ee" opacity="0.28" stroke="#67e8f9" strokeWidth="4" />
      <line x1="120" y1="130" x2={x1 + 230} y2={y1} stroke="#facc15" strokeWidth="4" />
      <line x1={x1 + 230} y1={y1} x2="610" y2="310" stroke="#a78bfa" strokeWidth="4" />
      <circle cx={x1 + 230} cy={y1} r="10" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <Text x="500" y="96" value="best corner" />
      <Text x="510" y="138" value={`Z=${formatNumber(params.a * 2 + params.b * 3)}`} />
    </g>
  );
}

function InequalityVisual({ params }: { params: FormulaParameters }) {
  const boundary = 380 + params.a * 36;
  return (
    <g>
      <line x1="120" y1="210" x2="640" y2="210" stroke="#e0f2fe" strokeWidth="5" />
      <rect x="120" y="180" width={Math.max(0, boundary - 120)} height="60" rx="18" fill="#22d3ee" opacity="0.35" />
      <circle cx={boundary} cy="210" r="15" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <Text x="380" y="112" value="shade solution interval" />
      <path d={`M180 310 C300 ${260 - params.b * 10}, 460 ${260 + params.c * 12}, 600 310`} fill="none" stroke="#a78bfa" strokeWidth="5" />
    </g>
  );
}

function DistributionVisual({ params }: { params: FormulaParameters }) {
  const meanX = 380 + params.a * 18;
  const spread = Math.max(34, 84 + Math.abs(params.b) * 10);
  const normal = Array.from({ length: 100 }, (_, index) => {
    const x = 100 + index * 5.6;
    const z = (x - meanX) / spread;
    const y = 292 - Math.exp(-0.5 * z * z) * 170;
    return `${x},${y}`;
  }).join(" ");
  return (
    <g>
      <line x1="100" y1="292" x2="660" y2="292" stroke="#94a3b8" strokeWidth="3" />
      <polyline points={normal} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
      <line x1={meanX} y1="106" x2={meanX} y2="292" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" />
      {Array.from({ length: 9 }, (_, index) => (
        <rect key={index} x={130 + index * 42} y={292 - (index + 2) * 12} width="28" height={(index + 2) * 12} rx="7" fill="#a78bfa" opacity="0.62" />
      ))}
      <Text x="548" y="102" value={`p=${formatNumber(params.p / 100)}`} />
      <Text x="548" y="142" value={`mean=${formatNumber(params.a)}`} />
    </g>
  );
}

function Phase3Visual({ formula, params }: { formula: FormulaVisualizerEntry; params: FormulaParameters }) {
  switch (formula.visualizerType) {
    case "limits-continuity":
    case "real-analysis":
      return <LimitContinuityVisual params={params} formula={formula} />;
    case "differential-equations":
      return <DifferentialEquationVisual params={params} />;
    case "determinant":
      return <DeterminantVisual params={params} />;
    case "three-d-geometry":
    case "differential-geometry":
      return <IsometricGeometryVisual params={params} formula={formula} />;
    case "early-number-sense":
      return <NumberSenseVisual params={params} />;
    case "fraction-percent":
      return <FractionPercentVisual params={params} />;
    case "commercial-math":
      return <CommercialMathVisual params={params} />;
    case "speed-work":
      return <SpeedWorkVisual params={params} />;
    case "mental-math":
      return <MentalMathVisual params={params} formula={formula} />;
    case "pre-algebra":
      return <PreAlgebraVisual params={params} />;
    case "number-theory":
    case "cryptography":
      return <ModularClockVisual params={params} formula={formula} />;
    case "euclidean-geometry":
      return <EuclideanTheoremVisual params={params} />;
    case "analytic-geometry":
    case "precalculus":
      return <ConicFunctionVisual params={params} formula={formula} />;
    case "calculus-applications":
    case "optimization":
    case "numerical-methods":
      return <OptimizationNumericalVisual params={params} formula={formula} />;
    case "multivariable-calculus":
      return <VectorFieldVisual params={params} />;
    case "advanced-linear-algebra":
      return <LinearAlgebraAdvancedVisual params={params} />;
    case "abstract-algebra":
      return <CayleyTableVisual params={params} />;
    case "complex-analysis":
      return <ComplexMappingVisual params={params} />;
    case "topology":
      return <TopologyVisual params={params} />;
    case "discrete-math":
      return <DiscreteMathVisual params={params} />;
    case "dynamical-systems":
      return <DynamicalSystemsVisual params={params} />;
    case "pde":
      return <PdeVisual params={params} />;
    case "transforms":
      return <TransformVisual params={params} />;
    case "mathematical-physics":
      return <MathematicalPhysicsVisual params={params} />;
    case "information-theory":
      return <InformationTheoryVisual params={params} />;
    case "machine-learning":
      return <MachineLearningVisual params={params} />;
    default:
      return <FunctionFamilyVisual params={params} formula={{ ...formula, visualizerType: "graph" }} />;
  }
}

function LimitContinuityVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const a = 380 + params.a * 26;
  const eps = Math.max(18, params.p * 0.9);
  const curve = makeCurvePoints({ ...formula, visualizerType: "graph" }, params);
  return (
    <g>
      <rect x="80" y={190 - eps / 2} width="600" height={eps} rx="16" fill="#22d3ee" opacity="0.16" />
      <polyline points={curve} fill="none" stroke="#67e8f9" strokeWidth="5" />
      <line x1={a} y1="58" x2={a} y2="330" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" />
      <circle cx={a - 42} cy={190 + params.b * 10} r="10" fill="#f59e0b" stroke="#fff7ed" strokeWidth="4" />
      <circle cx={a + 42} cy={190 + params.c * 10} r="10" fill="#a78bfa" stroke="#fff7ed" strokeWidth="4" />
      <Text x="170" y="86" value="left / right approach" />
      <Text x="610" y="300" value="epsilon band" />
    </g>
  );
}

function DifferentialEquationVisual({ params }: { params: FormulaParameters }) {
  const k = params.a / 6;
  return (
    <g>
      {Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 13 }, (_, col) => {
          const x = 95 + col * 48;
          const y = 68 + row * 30;
          const slope = Math.tanh(k + (row - 4) * 0.16);
          return <line key={`${row}-${col}`} x1={x - 12} y1={y - slope * 12} x2={x + 12} y2={y + slope * 12} stroke="#67e8f9" strokeWidth="3" opacity="0.75" />;
        }),
      )}
      <path d={`M120 300 C250 ${250 - params.a * 18}, 420 ${190 - params.b * 20}, 640 ${100 + params.c * 14}`} fill="none" stroke="#facc15" strokeWidth="5" />
      <circle cx={260 + params.b * 16} cy={220 - params.c * 12} r="12" fill="#f59e0b" stroke="#fff7ed" strokeWidth="4" />
      <Text x="580" y="78" value="solution curve" />
      <Text x="190" y="330" value="initial value" />
    </g>
  );
}

function DeterminantVisual({ params }: { params: FormulaParameters }) {
  const det = params.a * params.n - params.b * params.c;
  const scale = Math.max(0.25, Math.min(1.8, Math.abs(det) / 12));
  const parallelogram = `360,230 ${360 + params.a * 24},${230 - params.b * 18} ${360 + params.a * 24 + params.c * 24},${230 - params.b * 18 - params.n * 8} ${360 + params.c * 24},${230 - params.n * 8}`;
  return (
    <g>
      <g transform="translate(110 92)">
        {[["a", params.a], ["b", params.b], ["c", params.c], ["d", params.n]].map(([label, value], index) => (
          <g key={String(label)} transform={`translate(${(index % 2) * 74} ${Math.floor(index / 2) * 64})`}>
            <rect width="58" height="48" rx="10" fill="#0f172a" stroke="#67e8f9" strokeWidth="3" />
            <Text x="29" y="24" value={`${label}=${formatNumber(Number(value))}`} />
          </g>
        ))}
      </g>
      <polygon points={parallelogram} fill="#22d3ee" opacity={0.26 + scale * 0.22} stroke="#67e8f9" strokeWidth="5" />
      <Text x="560" y="112" value={`det=${formatNumber(det)}`} />
      <Text x="560" y="158" value={Math.abs(det) < 0.3 ? "singular" : "invertible"} />
      <Text x="545" y="300" value="area / volume scale" />
    </g>
  );
}

function IsometricGeometryVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const px = 380 + params.a * 26;
  const py = 210 - params.b * 18;
  const pz = params.c * 18;
  return (
    <g>
      <Arrow x1={160} y1={280} x2={620} y2={280} color="#67e8f9" label="x" />
      <Arrow x1={160} y1={280} x2={300} y2={120} color="#facc15" label="y" />
      <Arrow x1={160} y1={280} x2={160} y2={80} color="#a78bfa" label="z" />
      <polygon points={`300,250 570,210 620,275 350,318`} fill="#22d3ee" opacity="0.16" stroke="#67e8f9" strokeWidth="3" />
      <line x1="450" y1="244" x2="520" y2="118" stroke="#f59e0b" strokeWidth="5" />
      <circle cx={px + pz * 0.4} cy={py - pz} r="11" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <Text x="560" y="88" value={formula.visualizerType === "differential-geometry" ? "tangent / normal" : "line / plane / point"} />
    </g>
  );
}

function NumberSenseVisual({ params }: { params: FormulaParameters }) {
  const value = Math.max(1, Math.min(99, Math.round(Math.abs(params.a * 10 + params.b))));
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return (
    <g>
      <line x1="100" y1="290" x2="650" y2="290" stroke="#e0f2fe" strokeWidth="5" />
      <circle cx={100 + value * 5.5} cy="290" r="13" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      {Array.from({ length: tens }, (_, i) => <rect key={i} x={120 + i * 34} y="94" width="24" height="120" rx="8" fill="#22d3ee" opacity="0.74" />)}
      {Array.from({ length: ones }, (_, i) => <circle key={i} cx={450 + (i % 5) * 32} cy={118 + Math.floor(i / 5) * 36} r="12" fill="#a78bfa" />)}
      <Text x="190" y="62" value={`${tens} tens`} />
      <Text x="520" y="62" value={`${ones} ones`} />
      <Text x="382" y="334" value={`number ${value}`} />
    </g>
  );
}

function FractionPercentVisual({ params }: { params: FormulaParameters }) {
  const denominator = Math.max(2, Math.min(12, Math.round(params.n)));
  const numerator = Math.max(1, Math.min(denominator, Math.round(Math.abs(params.a))));
  return (
    <g>
      {Array.from({ length: denominator }, (_, index) => (
        <rect key={index} x={120 + index * 42} y="120" width="36" height="120" rx="8" fill={index < numerator ? "#22d3ee" : "#1e293b"} stroke="#67e8f9" strokeWidth="2" />
      ))}
      {Array.from({ length: 100 }, (_, index) => (
        <rect key={index} x={170 + (index % 20) * 18} y={278 + Math.floor(index / 20) * 14} width="14" height="10" rx="2" fill={index < Math.round((numerator / denominator) * 100) ? "#f59e0b" : "#334155"} />
      ))}
      <Text x="380" y="76" value={`${numerator}/${denominator} = ${formatNumber(numerator / denominator)}`} />
      <Text x="580" y="330" value={`${Math.round((numerator / denominator) * 100)}%`} />
    </g>
  );
}

function CommercialMathVisual({ params }: { params: FormulaParameters }) {
  const price = Math.max(20, Math.round(Math.abs(params.n * 20)));
  const discount = Math.round(params.p);
  const finalPrice = price * (1 - discount / 100) * (1 + Math.max(0, params.b) / 100);
  return (
    <g>
      <rect x="120" y="80" width="250" height="250" rx="20" fill="#f8fafc" opacity="0.92" />
      {["Marked price", "Discount", "Tax", "Final bill"].map((label, index) => <text key={label} x="150" y={128 + index * 46} fill="#0f172a" fontSize="18" fontWeight="800">{label}</text>)}
      {[price, discount, Math.max(0, params.b), finalPrice].map((value, index) => <text key={index} x="330" y={128 + index * 46} fill="#0369a1" fontSize="18" fontWeight="900" textAnchor="end">{index === 0 || index === 3 ? formatNumber(value) : `${formatNumber(value)}%`}</text>)}
      <path d={`M470 300 V${300 - price * 0.35} M540 300 V${300 - finalPrice * 0.35}`} stroke="#22d3ee" strokeWidth="38" strokeLinecap="round" />
      <Text x="505" y="70" value="simple bill model" />
    </g>
  );
}

function SpeedWorkVisual({ params }: { params: FormulaParameters }) {
  const distance = Math.max(70, Math.min(500, Math.abs(params.a * params.n) * 9));
  const fill = Math.max(20, Math.min(190, params.p * 1.9));
  return (
    <g>
      <line x1="120" y1="145" x2="650" y2="145" stroke="#e0f2fe" strokeWidth="5" />
      <circle cx={120 + distance} cy="145" r="16" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <rect x="180" y="230" width="180" height="100" rx="16" fill="#0f172a" stroke="#67e8f9" strokeWidth="4" />
      <rect x="180" y={330 - fill / 2} width="180" height={fill / 2} rx="14" fill="#22d3ee" opacity="0.68" />
      <Arrow x1={450} y1={295} x2={600} y2={295 - params.b * 10} color="#f59e0b" label="rate" />
      <Text x="380" y="88" value="distance / time / work rate" />
    </g>
  );
}

function MentalMathVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const base = Math.max(10, Math.round(Math.abs(params.n)) * 10);
  const offset = Math.round(params.a);
  return (
    <g>
      <rect x="110" y="92" width="540" height="210" rx="28" fill="#0f172a" stroke="#67e8f9" strokeWidth="4" />
      <Text x="230" y="150" value={`base ${base}`} />
      <Text x="380" y="150" value={`offset ${offset}`} />
      <Text x="530" y="150" value={formula.id === "square-ending-5" ? "append 25" : "shortcut"} />
      <path d="M185 210 H575" stroke="#facc15" strokeWidth="5" strokeDasharray="10 8" />
      <Text x="380" y="250" value="normal method vs shortcut steps" />
    </g>
  );
}

function PreAlgebraVisual({ params }: { params: FormulaParameters }) {
  return (
    <g>
      <line x1="380" y1="105" x2="380" y2="285" stroke="#e0f2fe" strokeWidth="6" />
      <line x1="220" y1="150" x2="540" y2="150" stroke="#e0f2fe" strokeWidth="5" />
      <rect x="170" y={190 - params.a * 5} width="130" height="54" rx="14" fill="#22d3ee" opacity="0.74" />
      <rect x="460" y={190 - params.b * 5} width="130" height="54" rx="14" fill="#a78bfa" opacity="0.74" />
      <Text x="235" y={218 - params.a * 5} value="ax+b" />
      <Text x="525" y={218 - params.b * 5} value="c" />
      <Text x="380" y="318" value="balance equation model" />
    </g>
  );
}

function ModularClockVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const mod = Math.max(5, Math.min(26, Math.round(params.n)));
  const active = ((Math.round(params.a * params.b) % mod) + mod) % mod;
  return (
    <g>
      <circle cx="300" cy="190" r="118" fill="#22d3ee" opacity="0.12" stroke="#67e8f9" strokeWidth="4" />
      {Array.from({ length: mod }, (_, index) => {
        const angle = (index / mod) * Math.PI * 2 - Math.PI / 2;
        const x = 300 + Math.cos(angle) * 96;
        const y = 190 + Math.sin(angle) * 96;
        return <circle key={index} cx={x} cy={y} r={index === active ? 13 : 7} fill={index === active ? "#facc15" : "#a78bfa"} />;
      })}
      <Text x="560" y="116" value={`mod ${mod}`} />
      <Text x="560" y="166" value={`remainder ${active}`} />
      <Text x="560" y="230" value={formula.visualizerType === "cryptography" ? "toy learning model" : "clock arithmetic"} />
    </g>
  );
}

function EuclideanTheoremVisual({ params }: { params: FormulaParameters }) {
  const apexX = 350 + params.a * 12;
  const apexY = 100 + params.b * 8;
  return (
    <g>
      <polygon points={`150,290 610,290 ${apexX},${apexY}`} fill="#22d3ee" opacity="0.3" stroke="#e0f2fe" strokeWidth="5" />
      <line x1={apexX} y1={apexY} x2={380} y2="290" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" />
      <circle cx="610" cy="290" r="92" fill="none" stroke="#f472b6" strokeWidth="4" opacity="0.8" />
      <Text x="250" y="310" value="a" />
      <Text x="500" y="310" value="b" />
      <Text x="380" y="78" value="toggle theorem conditions" />
    </g>
  );
}

function ConicFunctionVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const e = Math.max(0.2, Math.min(1.8, Math.abs(params.a) / 4));
  const curve = Array.from({ length: 120 }, (_, index) => {
    const t = (index / 119) * Math.PI * 2;
    const x = 380 + Math.cos(t) * 150;
    const y = 190 + Math.sin(t) * 90 * e;
    return `${x},${y}`;
  }).join(" ");
  return (
    <g>
      <polyline points={curve} fill="none" stroke="#67e8f9" strokeWidth="5" />
      <line x1="165" y1="190" x2="595" y2="190" stroke="#facc15" strokeWidth="3" strokeDasharray="9 8" />
      <circle cx={380 - 80 * e} cy="190" r="10" fill="#f59e0b" />
      <circle cx={380 + 80 * e} cy="190" r="10" fill="#f59e0b" />
      <Text x="555" y="92" value={formula.visualizerType === "precalculus" ? "transform / inverse" : `e=${formatNumber(e)}`} />
    </g>
  );
}

function OptimizationNumericalVisual({ params, formula }: { params: FormulaParameters; formula: FormulaVisualizerEntry }) {
  const curve = Array.from({ length: 120 }, (_, index) => {
    const x = -5 + (index / 119) * 10;
    const y = 0.28 * (x - params.a / 2) ** 2 + Math.sin(x + params.b) * 0.7;
    return `${380 + x * 52},${300 - y * 34}`;
  }).join(" ");
  const stepX = 380 + params.a * 34;
  return (
    <g>
      <polyline points={curve} fill="none" stroke="#67e8f9" strokeWidth="5" />
      <Arrow x1={stepX + 70} y1={116} x2={stepX} y2={168} color="#facc15" label="step" />
      <circle cx={stepX} cy="170" r="12" fill="#f59e0b" stroke="#fff7ed" strokeWidth="4" />
      <Text x="560" y="300" value={formula.visualizerType === "numerical-methods" ? "iteration table" : "objective value"} />
    </g>
  );
}

function VectorFieldVisual({ params }: { params: FormulaParameters }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => {
          const x = 110 + col * 50;
          const y = 75 + row * 34;
          const dx = Math.sin(row + params.a) * 12;
          const dy = Math.cos(col + params.b) * 12;
          return <Arrow key={`${row}-${col}`} x1={x} y1={y} x2={x + dx} y2={y + dy} color="#67e8f9" label="" />;
        }),
      )}
      <Text x="575" y="330" value="gradient / divergence / curl" />
    </g>
  );
}

function LinearAlgebraAdvancedVisual({ params }: { params: FormulaParameters }) {
  const v1 = { x: 380 + params.a * 32, y: 210 - params.b * 24 };
  const v2 = { x: 380 + params.c * 42, y: 210 - params.n * 6 };
  return (
    <g>
      <line x1="110" y1="210" x2="650" y2="210" stroke="#94a3b8" strokeWidth="3" />
      <line x1="380" y1="60" x2="380" y2="330" stroke="#94a3b8" strokeWidth="3" />
      <polygon points={`380,210 ${v1.x},${v1.y} ${v1.x + v2.x - 380},${v1.y + v2.y - 210} ${v2.x},${v2.y}`} fill="#22d3ee" opacity="0.16" stroke="#67e8f9" strokeWidth="3" />
      <Arrow x1={380} y1={210} x2={v1.x} y2={v1.y} color="#22d3ee" label="basis 1" />
      <Arrow x1={380} y1={210} x2={v2.x} y2={v2.y} color="#f59e0b" label="basis 2" />
      <Text x="570" y="92" value="span / projection" />
    </g>
  );
}

function CayleyTableVisual({ params }: { params: FormulaParameters }) {
  const mod = Math.max(3, Math.min(7, Math.round(Math.abs(params.n / 2))));
  return (
    <g transform="translate(190 72)">
      {Array.from({ length: mod + 1 }, (_, r) =>
        Array.from({ length: mod + 1 }, (_, c) => {
          const label = r === 0 && c === 0 ? "+" : r === 0 ? String(c - 1) : c === 0 ? String(r - 1) : String((r + c - 2) % mod);
          return (
            <g key={`${r}-${c}`} transform={`translate(${c * 58} ${r * 42})`}>
              <rect width="52" height="36" rx="8" fill={r === 0 || c === 0 ? "#facc15" : "#22d3ee"} opacity={r === 0 || c === 0 ? 0.9 : 0.28} stroke="#e0f2fe" />
              <text x="26" y="23" fill="#f8fafc" fontSize="15" fontWeight="900" textAnchor="middle">{label}</text>
            </g>
          );
        }),
      )}
      <Text x="415" y="220" value={`Z_${mod} Cayley table`} />
    </g>
  );
}

function ComplexMappingVisual({ params }: { params: FormulaParameters }) {
  return (
    <g>
      <rect x="110" y="80" width="220" height="220" rx="20" fill="#22d3ee" opacity="0.12" stroke="#67e8f9" />
      <rect x="430" y="80" width="220" height="220" rx="20" fill="#a78bfa" opacity="0.12" stroke="#ddd6fe" />
      {Array.from({ length: 5 }, (_, i) => <line key={`l-${i}`} x1={135 + i * 40} y1="100" x2={135 + i * 40 + params.a * 5} y2="280" stroke="#67e8f9" />)}
      {Array.from({ length: 5 }, (_, i) => <path key={`m-${i}`} d={`M455 ${105 + i * 38} C520 ${90 + params.a * 8}, 560 ${230 - params.b * 6}, 625 ${105 + i * 38}`} fill="none" stroke="#facc15" strokeWidth="3" />)}
      <Text x="220" y="330" value="z-plane" />
      <Text x="540" y="330" value="w=f(z)" />
    </g>
  );
}

function TopologyVisual({ params }: { params: FormulaParameters }) {
  const r = Math.max(40, Math.min(130, params.p * 1.3));
  return (
    <g>
      <path d="M150 210 C140 80, 300 60, 350 145 C420 58, 610 110, 590 245 C500 330, 280 330, 150 210Z" fill="#22d3ee" opacity="0.18" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={370 + params.a * 18} cy={200 - params.b * 12} r={r} fill="#f59e0b" opacity="0.15" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" />
      <circle cx={370 + params.a * 18} cy={200 - params.b * 12} r="10" fill="#facc15" />
      <Text x="575" y="94" value="open ball / neighborhood" />
      <Text x="240" y="310" value="connected region" />
    </g>
  );
}

function DiscreteMathVisual({ params }: { params: FormulaParameters }) {
  const truth = params.p > 50;
  return (
    <g>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={190 + i * 120} cy={130 + (i % 2) * 110} r="28" fill="#22d3ee" opacity="0.72" stroke="#e0f2fe" strokeWidth="3" />)}
      <line x1="190" y1="130" x2="310" y2="240" stroke="#facc15" strokeWidth="4" />
      <line x1="310" y1="240" x2="430" y2="130" stroke="#facc15" strokeWidth="4" />
      <line x1="430" y1="130" x2="550" y2="240" stroke="#facc15" strokeWidth="4" />
      <rect x="160" y="305" width="420" height="48" rx="14" fill="#0f172a" stroke="#67e8f9" />
      <Text x="370" y="330" value={`p=>q is ${truth ? "true" : "check q"}`} />
    </g>
  );
}

function DynamicalSystemsVisual({ params }: { params: FormulaParameters }) {
  const r = Math.max(1, Math.min(4, Math.abs(params.a) / 2 + 2));
  const points: string[] = [];
  let x = Math.max(0.05, Math.min(0.95, params.p / 100));
  for (let i = 0; i < 45; i += 1) {
    x = r * x * (1 - x);
    points.push(`${120 + i * 11},${300 - x * 210}`);
  }
  return (
    <g>
      <polyline points={points.join(" ")} fill="none" stroke="#67e8f9" strokeWidth="4" />
      <line x1="120" y1="300" x2="640" y2="300" stroke="#94a3b8" />
      <Text x="550" y="96" value={`r=${formatNumber(r)}`} />
      <Text x="550" y="140" value="time series / stability" />
    </g>
  );
}

function PdeVisual({ params }: { params: FormulaParameters }) {
  const time = params.p / 100;
  return (
    <g>
      {Array.from({ length: 24 }, (_, index) => {
        const heat = Math.exp(-time * 2) * Math.sin((index / 23) * Math.PI) * 130;
        return <rect key={index} x={110 + index * 22} y={300 - heat} width="18" height={heat} rx="5" fill={`hsl(${190 - heat / 2}, 85%, 58%)`} />;
      })}
      <path d={`M120 130 C240 ${80 + params.a * 8}, 360 ${180 + params.b * 10}, 620 ${110 + params.c * 12}`} fill="none" stroke="#facc15" strokeWidth="5" />
      <Text x="380" y="70" value="heat bar / wave string" />
    </g>
  );
}

function TransformVisual({ params }: { params: FormulaParameters }) {
  const harmonics = [1, 2, 3, 4, 5];
  const wave = Array.from({ length: 130 }, (_, index) => {
    const x = (index / 129) * Math.PI * 4;
    const y = harmonics.reduce((sum, h) => sum + Math.sin(h * x) * (params.p / 100) / h, 0);
    return `${90 + index * 4.6},${190 - y * 54}`;
  }).join(" ");
  return (
    <g>
      <polyline points={wave} fill="none" stroke="#67e8f9" strokeWidth="5" />
      {harmonics.map((h, index) => <rect key={h} x={520 + index * 24} y={290 - (params.p / h)} width="18" height={params.p / h} fill="#facc15" />)}
      <Text x="570" y="92" value="frequency spectrum" />
      <Text x="250" y="310" value="signal reconstruction" />
    </g>
  );
}

function MathematicalPhysicsVisual({ params }: { params: FormulaParameters }) {
  const path = `M110 290 Q${310 + params.a * 20} ${70 - params.b * 6} 650 290`;
  return (
    <g>
      <path d={path} fill="none" stroke="#67e8f9" strokeWidth="5" />
      <circle cx="300" cy={155 - params.b * 4} r="15" fill="#facc15" stroke="#fff7ed" strokeWidth="4" />
      <rect x="130" y="320" width={Math.max(30, Math.abs(params.a) * 36)} height="20" rx="10" fill="#f59e0b" />
      <path d={`M500 210 C540 ${165 + params.c * 12}, 590 ${255 - params.c * 12}, 635 210`} fill="none" stroke="#a78bfa" strokeWidth="5" />
      <Text x="560" y="92" value="motion / energy / wave" />
    </g>
  );
}

function InformationTheoryVisual({ params }: { params: FormulaParameters }) {
  const p = Math.max(0.01, Math.min(0.99, params.p / 100));
  const entropy = -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  return (
    <g>
      <rect x="140" y={300 - p * 170} width="80" height={p * 170} rx="12" fill="#22d3ee" />
      <rect x="250" y={300 - (1 - p) * 170} width="80" height={(1 - p) * 170} rx="12" fill="#a78bfa" />
      <rect x="460" y={300 - entropy * 170} width="120" height={entropy * 170} rx="16" fill="#facc15" />
      <Text x="185" y="330" value="P(0)" />
      <Text x="295" y="330" value="P(1)" />
      <Text x="520" y="330" value={`H=${formatNumber(entropy)}`} />
    </g>
  );
}

function MachineLearningVisual({ params }: { params: FormulaParameters }) {
  const slope = params.a / 3;
  return (
    <g>
      {Array.from({ length: 16 }, (_, index) => {
        const x = 120 + (index % 8) * 62;
        const y = 105 + Math.floor(index / 8) * 110 + Math.sin(index) * 22;
        return <circle key={index} cx={x} cy={y} r="9" fill={index % 3 ? "#22d3ee" : "#f59e0b"} />;
      })}
      <line x1="120" y1={240 - slope * 80} x2="610" y2={120 + slope * 80} stroke="#facc15" strokeWidth="5" />
      <path d={`M130 320 C250 ${250 - params.a * 10}, 400 ${300 - params.b * 8}, 620 ${180 + params.c * 12}`} fill="none" stroke="#a78bfa" strokeWidth="5" />
      <Text x="555" y="80" value="model / loss / gradient" />
    </g>
  );
}

function isPhase2Visual(type: FormulaVisualizerEntry["visualizerType"]) {
  return ["number-system", "complex", "sequence", "combinatorics", "set-logic", "function", "linear-programming", "polynomial", "inequality", "distribution"].includes(type);
}

function isPhase3Visual(type: FormulaVisualizerEntry["visualizerType"]) {
  return [
    "limits-continuity",
    "differential-equations",
    "determinant",
    "three-d-geometry",
    "early-number-sense",
    "fraction-percent",
    "commercial-math",
    "speed-work",
    "mental-math",
    "pre-algebra",
    "number-theory",
    "euclidean-geometry",
    "analytic-geometry",
    "precalculus",
    "calculus-applications",
    "multivariable-calculus",
    "advanced-linear-algebra",
    "abstract-algebra",
    "real-analysis",
    "complex-analysis",
    "topology",
    "differential-geometry",
    "discrete-math",
    "optimization",
    "numerical-methods",
    "dynamical-systems",
    "pde",
    "transforms",
    "mathematical-physics",
    "information-theory",
    "machine-learning",
    "cryptography",
  ].includes(type);
}

function Arrow({ x1, y1, x2, y2, color, label }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 12;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${x2 - head * Math.cos(angle - 0.45)} ${y2 - head * Math.sin(angle - 0.45)} L${x2 - head * Math.cos(angle + 0.45)} ${y2 - head * Math.sin(angle + 0.45)} Z`} fill={color} />
      <Text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} value={label} />
    </g>
  );
}

function Grid() {
  return (
    <g opacity="0.22">
      {Array.from({ length: 13 }, (_, index) => <line key={`v-${index}`} x1={80 + index * 50} y1="50" x2={80 + index * 50} y2="330" stroke="#67e8f9" />)}
      {Array.from({ length: 7 }, (_, index) => <line key={`h-${index}`} x1="80" y1={70 + index * 40} x2="680" y2={70 + index * 40} stroke="#67e8f9" />)}
    </g>
  );
}

function Text({ x, y, value }: { x: number | string; y: number | string; value: string }) {
  return <text x={x} y={y} fill="#f8fafc" fontSize="20" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{value}</text>;
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function computeResult(formula: FormulaVisualizerEntry, params: FormulaParameters) {
  const { a, b, c, n, p } = params;
  const iteration = Math.max(0, Math.round(n));
  if (formula.id === "sierpinski-retained-count") return 8 ** iteration;
  if (formula.id === "sierpinski-new-removed") return iteration === 0 ? 0 : 8 ** (iteration - 1);
  if (formula.id === "sierpinski-total-removed") return iteration === 0 ? 0 : (8 ** iteration - 1) / 7;
  if (formula.id === "sierpinski-side-scale") return 1 / 3 ** iteration;
  if (formula.id === "sierpinski-small-area") return 1 / 9 ** iteration;
  if (formula.id === "sierpinski-retained-area") return (8 / 9) ** iteration;
  if (formula.id === "sierpinski-removed-area") return 1 - (8 / 9) ** iteration;
  if (formula.id === "solid-top-projection") return Math.abs(a) > 0 ? 1 : 0;
  if (formula.id === "solid-front-projection" || formula.id === "solid-side-projection") return Math.max(Math.abs(a), Math.abs(b), Math.abs(c));
  if (formula.id === "equivalent-ratios") return Math.abs(a * n - b * c) < 1e-9 ? 1 : 0;
  if (formula.id === "cross-multiplication") return a * n - b * c;
  if (formula.id === "missing-fourth-term") return (b * c) / Math.max(0.001, a);
  if (formula.id === "representative-fraction") return Math.max(1, Math.abs(b * 100000) / Math.max(0.001, Math.abs(a)));
  if (formula.id === "actual-distance-map-scale") return Math.abs(a * b) / 100000;
  if (formula.id === "map-distance-actual-scale") return (Math.abs(a) * 100000) / Math.max(1, Math.abs(b));
  if (formula.id === "multi-term-ratio-share") return (Math.abs(a) / Math.max(1, Math.abs(a) + Math.abs(b) + Math.abs(c))) * Math.abs(n);
  if (formula.id === "ratio-to-percentage") return (Math.abs(a) / Math.max(1, Math.abs(a) + Math.abs(b) + Math.abs(c))) * 100;
  if (formula.id === "ratio-to-pie-angle") return (Math.abs(a) / Math.max(1, Math.abs(a) + Math.abs(b) + Math.abs(c))) * 360;
  if (formula.id === "direct-proportion") return a * b;
  if (formula.id === "inverse-proportion") return Math.abs(a * b) / Math.max(0.001, Math.abs(c));
  if (formula.id === "constant-check") return Math.abs(a * b - c * n);
  if (formula.id === "sin-ratio") return Math.sin((Math.max(5, Math.min(85, p)) / 180) * Math.PI);
  if (formula.id === "cos-ratio") return Math.cos((Math.max(5, Math.min(85, p)) / 180) * Math.PI);
  if (formula.id === "tan-ratio") return Math.tan((Math.max(5, Math.min(85, p)) / 180) * Math.PI);
  if (formula.id === "pythagorean-identity") {
    const angle = (Math.max(5, Math.min(85, p)) / 180) * Math.PI;
    return Math.sin(angle) ** 2 + Math.cos(angle) ** 2;
  }
  if (formula.id === "tan-identity") {
    const angle = (Math.max(5, Math.min(85, p)) / 180) * Math.PI;
    return Math.sin(angle) / Math.max(0.001, Math.cos(angle));
  }
  if (formula.id === "sine-rule") return Math.abs(a) / Math.max(0.001, Math.sin((Math.max(5, Math.min(85, p)) / 180) * Math.PI));
  if (formula.id === "cosine-rule") return Math.sqrt(Math.max(0, a ** 2 + b ** 2 - 2 * a * b * Math.cos((Math.max(5, Math.min(85, p)) / 180) * Math.PI)));
  if (formula.id === "angle-sum-sine") {
    const firstAngle = (Math.max(5, Math.min(85, p)) / 180) * Math.PI;
    const secondAngle = (Math.max(5, Math.min(85, Math.abs(a) * 10)) / 180) * Math.PI;
    return Math.sin(firstAngle + secondAngle);
  }
  switch (formula.visualizerType) {
    case "area":
      return formula.id.includes("difference") ? a * a - b * b : (a + b) ** 2;
    case "geometry":
      return formula.id.includes("circle") || formula.id.includes("sector") || formula.id.includes("arc") ? Math.PI * Math.abs(a) * Math.abs(a) * (p / 100 || 1) : Math.abs(a * b) / 2;
    case "coordinate":
      return Math.sqrt((a - c) ** 2 + (b - n / 2) ** 2);
    case "calculus":
      return 2 * a + b;
    case "matrix":
      return a * (n / 2) - b * c;
    case "vector":
      return a * c + b * (n / 2);
    case "probability":
      return Math.max(0, Math.min(1, p / 100));
    case "statistics": {
      const values = [a, b, c, n / 2, p / 10];
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
    case "mensuration":
      return formula.id.includes("volume") ? Math.abs(a * b * Math.max(1, c)) : Math.abs(a * b);
    case "number-system": {
      const x = Math.round(Math.abs(a) + 6);
      const y = Math.round(Math.abs(b) + 8);
      return formula.id.includes("lcm") ? (x * y) / gcdInt(x, y) : gcdInt(x, y);
    }
    case "complex":
      return Math.sqrt(a ** 2 + b ** 2);
    case "sequence":
      return a + (Math.max(1, Math.round(n)) - 1) * b;
    case "combinatorics":
      return comb(Math.max(1, Math.round(n)), Math.max(0, Math.min(Math.round(n), Math.round(Math.abs(b)))));
    case "set-logic":
      return p > 50 || b >= 0 ? 1 : 0;
    case "function":
    case "polynomial":
      return a * b + c;
    case "linear-programming":
      return a * 2 + b * 3;
    case "inequality":
      return c - b;
    case "distribution":
      return Math.max(0, Math.min(1, p / 100));
    case "limits-continuity":
    case "real-analysis":
      return Math.sin(a) + b / 4;
    case "differential-equations":
      return Math.max(0, Math.abs(c) * Math.exp(a / 6));
    case "determinant":
      return a * n - b * c;
    case "three-d-geometry":
    case "differential-geometry":
      return Math.sqrt(a ** 2 + b ** 2 + c ** 2);
    case "early-number-sense":
      return Math.max(1, Math.round(Math.abs(a * 10 + b)));
    case "fraction-percent":
      return Math.max(1, Math.round(Math.abs(a))) / Math.max(2, Math.round(n));
    case "commercial-math":
      return Math.max(20, Math.abs(n * 20)) * (1 - p / 100) * (1 + Math.max(0, b) / 100);
    case "speed-work":
      return Math.abs(a * n) / Math.max(1, Math.abs(b));
    case "mental-math":
      return formula.id.includes("square") ? (Math.round(Math.abs(n)) * 10 + 5) ** 2 : Math.round(Math.abs(a * b * 10));
    case "pre-algebra":
      return a * b + c;
    case "number-theory":
    case "cryptography":
      return ((Math.round(a * b) % Math.max(5, Math.round(n))) + Math.max(5, Math.round(n))) % Math.max(5, Math.round(n));
    case "euclidean-geometry":
      return Math.abs(a * b) / 2;
    case "analytic-geometry":
    case "precalculus":
      return Math.max(0.2, Math.min(1.8, Math.abs(a) / 4));
    case "calculus-applications":
    case "optimization":
    case "numerical-methods":
      return (a - b) ** 2 + c;
    case "multivariable-calculus":
      return Math.sqrt(a ** 2 + b ** 2);
    case "advanced-linear-algebra":
      return Math.abs(a * n - b * c);
    case "abstract-algebra":
      return Math.max(3, Math.min(7, Math.round(Math.abs(n / 2))));
    case "complex-analysis":
      return Math.sqrt(a ** 2 + b ** 2);
    case "topology":
      return p / 100;
    case "discrete-math":
      return p > 50 || b >= 0 ? 1 : 0;
    case "dynamical-systems": {
      const r = Math.max(1, Math.min(4, Math.abs(a) / 2 + 2));
      return r * (p / 100) * (1 - p / 100);
    }
    case "pde":
      return Math.exp(-p / 60) * Math.abs(a + b);
    case "transforms":
      return Math.abs(a) + Math.abs(b) / 2;
    case "mathematical-physics":
      return Math.abs(a * n + 0.5 * b * b);
    case "information-theory": {
      const q = Math.max(0.01, Math.min(0.99, p / 100));
      return -(q * Math.log2(q) + (1 - q) * Math.log2(1 - q));
    }
    case "machine-learning":
      return Math.max(0, (a - b) ** 2 + Math.abs(c));
    default:
      return a * 0.6 + b - c;
  }
}

function buildSubstitution(formula: FormulaVisualizerEntry, params: FormulaParameters) {
  return `a=${formatNumber(params.a)}, b=${formatNumber(params.b)}, c=${formatNumber(params.c)}, n=${formatNumber(params.n)}, p=${formatNumber(params.p)} gives ${formula.title} ≈ ${formatNumber(computeResult(formula, params))}.`;
}

function getWarning(formula: FormulaVisualizerEntry, params: FormulaParameters) {
  if (formula.visualizerType === "matrix" && Math.abs(computeResult(formula, params)) < 0.2) return "The determinant is near zero, so inverse calculations are unstable or unavailable.";
  if (formula.visualizerType === "probability" && (params.p <= 0 || params.p >= 100)) return "A probability at 0% or 100% is an edge case. Compare it with a middle value.";
  if (formula.visualizerType === "mensuration" && (params.a <= 0 || params.b <= 0)) return "Real dimensions should be positive. The visual uses absolute size but the sign is a warning.";
  if (formula.visualizerType === "sequence" && formula.id.includes("infinite") && Math.abs(params.b) >= 1) return "Infinite GP formulas need |r| < 1. Use b as the ratio and keep it between -1 and 1.";
  if (formula.visualizerType === "complex" && params.a === 0 && params.b === 0) return "The argument of 0 + 0i is undefined because the point has no direction.";
  if (formula.visualizerType === "linear-programming" && params.a < 0) return "Negative coefficients can change the best corner. Check all vertices, not only the visible high point.";
  if (formula.visualizerType === "determinant" && Math.abs(computeResult(formula, params)) < 0.5) return "The determinant is close to zero, so the matrix is near singular.";
  if (formula.visualizerType === "cryptography") return "Toy cryptography demos are for learning modular arithmetic only; they are not secure implementations.";
  if (formula.visualizerType === "fraction-percent" && params.n <= 1) return "Fractions need a denominator greater than 1. The visual clamps the denominator for safety.";
  if (formula.visualizerType === "limits-continuity" && Math.abs(params.a) < 0.2) return "Near the approach point, compare left and right behavior before deciding continuity.";
  return "";
}

function makeCurvePoints(formula: FormulaVisualizerEntry, params: FormulaParameters) {
  return Array.from({ length: 100 }, (_, index) => {
    const x = -5 + (index / 99) * 10;
    let y = params.a * x + params.b;
    if (formula.id.includes("quadratic") || formula.visualizerType === "calculus") y = 0.2 * params.a * x * x + params.b * x + params.c;
    if (formula.id.includes("gp") || formula.id.includes("exponent")) y = params.a * Math.pow(Math.max(0.2, Math.abs(params.b) / 2), x / 2);
    if (formula.id.includes("sin") || formula.id.includes("cos")) y = Math.sin(x + params.a) * 4;
    const sx = 380 + x * 48;
    const sy = Math.max(50, Math.min(330, 190 - y * 16));
    return `${sx},${sy}`;
  }).join(" ");
}

function makeBars(params: FormulaParameters) {
  const count = Math.max(2, Math.min(18, Math.round(params.n)));
  const width = 460 / count;
  return Array.from({ length: count }, (_, index) => {
    const x = 150 + index * width;
    const h = Math.max(16, Math.min(180, 36 + Math.abs(Math.sin(index + params.a)) * 120));
    return { x, y: 190 - h, w: width - 3, h };
  });
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  return Number(value.toFixed(2)).toString();
}

function gcdInt(a: number, b: number): number {
  let x = Math.max(1, Math.abs(Math.round(a)));
  let y = Math.max(1, Math.abs(Math.round(b)));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

function comb(n: number, r: number): number {
  const total = Math.max(0, Math.round(n));
  const choose = Math.max(0, Math.min(total, Math.round(r)));
  let result = 1;
  for (let index = 1; index <= choose; index += 1) {
    result = (result * (total - choose + index)) / index;
  }
  return Math.round(result);
}

export { formulaVisualizerConfigs };
