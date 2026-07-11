import { useMemo, useState, type ReactNode } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  CheckCircle2,
  Eye,
  FunctionSquare,
  Grid3X3,
  Layers3,
  LocateFixed,
  Maximize2,
  MousePointer2,
  RefreshCcw,
  Ruler,
  Search,
  Sigma,
  Target,
  Waves,
  Zap,
} from "lucide-react";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import ResponsiveLineChart from "../components/charts/ResponsiveLineChart";
import TopicTabs from "../components/ui/TopicTabs";
import { compileFunctionExpression } from "../utils/functionParser";

type ComparePreset = {
  title: string;
  f: string;
  g: string;
  tag: string;
  note: string;
};

type CompareRange = {
  xMin: number;
  xMax: number;
  samples: number;
};

type CurvePoint = {
  x: number;
  y: number;
};

type CombinedPoint = {
  x: number;
  f: number;
  g: number;
  diff: number;
  absDiff: number;
};

type CurveResult = {
  f: CurvePoint[];
  g: CurvePoint[];
  diff: CurvePoint[];
  absDiff: CurvePoint[];
  combined: CombinedPoint[];
  error?: string;
};

const presets: ComparePreset[] = [
  { title: "Sine vs cosine", f: "sin(x)", g: "cos(x)", tag: "phase", note: "Compare two waves shifted by a quarter turn." },
  { title: "Line vs parabola", f: "x", g: "x^2/4", tag: "growth", note: "Spot where linear and quadratic growth switch." },
  { title: "Exponential vs quadratic", f: "exp(x/3)", g: "x^2/6", tag: "rate", note: "Watch slow start and later acceleration." },
  { title: "Approximation near zero", f: "sin(x)", g: "x", tag: "limit", note: "Zoom near zero to see why sin x behaves like x." },
  { title: "Tangent comparison", f: "x^2", g: "2*x-1", tag: "slope", note: "A tangent touches and shares local direction." },
  { title: "Damped wave", f: "sin(x)", g: "sin(x)*exp(-x/8)", tag: "model", note: "Compare ideal motion with damping." },
  { title: "Reciprocal vs hyperbola", f: "1/x", g: "2/x", tag: "scale", note: "See vertical scaling and asymptote behavior." },
  { title: "Log vs root", f: "log(x+9)", g: "sqrt(x+9)", tag: "domain", note: "Compare two slow-growing functions." },
];

const rangePresets = [
  { label: "Tight", xMin: -2, xMax: 2, samples: 140 },
  { label: "Standard", xMin: -8, xMax: 8, samples: 180 },
  { label: "Wide", xMin: -16, xMax: 16, samples: 220 },
  { label: "Positive", xMin: 0, xMax: 12, samples: 180 },
] as const;

const learningPrompts = [
  "Where are the graphs equal?",
  "Which graph grows faster after the last intersection?",
  "Where is the difference curve closest to zero?",
  "Does a vertical shift change the shape or only the position?",
  "Which interval has the largest error?",
  "What happens if the viewing window is tightened?",
] as const;

export default function GraphComparisonMode() {
  const [f, setF] = useState("sin(x)");
  const [g, setG] = useState("cos(x)");
  const [range, setRange] = useState<CompareRange>({ xMin: -8, xMax: 8, samples: 180 });
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [highlightArea, setHighlightArea] = useState(true);
  const [query, setQuery] = useState("");

  const curves = useMemo(() => makeCurves(f, g, range, normalize), [f, g, normalize, range]);
  const metrics = useMemo(() => analyzeCurves(curves), [curves]);
  const filteredPresets = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return presets;
    return presets.filter((preset) => `${preset.title} ${preset.tag} ${preset.note} ${preset.f} ${preset.g}`.toLowerCase().includes(text));
  }, [query]);

  function applyPreset(preset: ComparePreset) {
    setF(preset.f);
    setG(preset.g);
  }

  function applyRange(next: CompareRange) {
    setRange(next.xMin < next.xMax ? next : { ...next, xMax: next.xMin + 1 });
  }

  return (
    <div className="desktop-page-shell">
      <div className="desktop-page-header">
        <TopicHeader
          title="Graph Comparison Mode"
          subtitle="Compare functions with overlay, split panes, intersections, and error curves."
          difficulty="Visualizer"
          estimatedMinutes={8}
        />
      </div>

      <ComparisonCommandBar
        f={f}
        g={g}
        range={range}
        query={query}
        showGrid={showGrid}
        showPoints={showPoints}
        normalize={normalize}
        highlightArea={highlightArea}
        onF={setF}
        onG={setG}
        onRange={applyRange}
        onQuery={setQuery}
        onShowGrid={setShowGrid}
        onShowPoints={setShowPoints}
        onNormalize={setNormalize}
        onHighlightArea={setHighlightArea}
      />

      {curves.error && (
        <SectionCard title="Input Check" compact>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:border-amber-300/30 dark:bg-amber-300/10 dark:text-amber-100">
            {curves.error}
          </div>
        </SectionCard>
      )}

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0">
          <TopicTabs
            tabs={[
              {
                id: "compare",
                label: "Compare",
                content: (
                  <div className="grid gap-3">
                    <OverlayChart curves={curves} metrics={metrics} showGrid={showGrid} showPoints={showPoints} highlightArea={highlightArea} />
                    <div className="grid gap-3 lg:grid-cols-2">
                      <MiniChart title="f(x)" data={curves.f} color="#06b6d4" />
                      <MiniChart title="g(x)" data={curves.g} color="#f97316" />
                    </div>
                  </div>
                ),
              },
              {
                id: "difference",
                label: "Difference",
                content: (
                  <div className="grid gap-3 xl:grid-cols-[1fr_300px]">
                    <DifferenceChart curves={curves} showGrid={showGrid} showPoints={showPoints} />
                    <DifferenceInsights metrics={metrics} />
                  </div>
                ),
              },
              {
                id: "metrics",
                label: "Metrics",
                content: <MetricsDashboard metrics={metrics} range={range} />,
              },
              {
                id: "presets",
                label: "Presets",
                content: <PresetGallery presets={filteredPresets} onApply={applyPreset} />,
              },
              {
                id: "teacher",
                label: "Prompts",
                content: <PromptBoard />,
              },
            ]}
          />
        </main>

        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3" aria-label="Graph comparison support panel">
          <MetricSummary metrics={metrics} curves={curves} />
          <PresetGallery presets={filteredPresets.slice(0, 4)} onApply={applyPreset} compact />
          <WindowPanel range={range} onRange={applyRange} />
          <LearningChecklist />
        </aside>
      </div>
    </div>
  );
}

function ComparisonCommandBar({
  f,
  g,
  range,
  query,
  showGrid,
  showPoints,
  normalize,
  highlightArea,
  onF,
  onG,
  onRange,
  onQuery,
  onShowGrid,
  onShowPoints,
  onNormalize,
  onHighlightArea,
}: {
  f: string;
  g: string;
  range: CompareRange;
  query: string;
  showGrid: boolean;
  showPoints: boolean;
  normalize: boolean;
  highlightArea: boolean;
  onF: (value: string) => void;
  onG: (value: string) => void;
  onRange: (value: CompareRange) => void;
  onQuery: (value: string) => void;
  onShowGrid: (value: boolean) => void;
  onShowPoints: (value: boolean) => void;
  onNormalize: (value: boolean) => void;
  onHighlightArea: (value: boolean) => void;
}) {
  return (
    <SectionCard title="Functions" description="Type expressions, choose a window, then compare shape, intersections, and error." compact>
      <div className="grid gap-3 xl:grid-cols-[1fr_1fr_260px]">
        <ExpressionInput label="f(x)" value={f} color="cyan" onChange={onF} />
        <ExpressionInput label="g(x)" value={g} color="orange" onChange={onG} />
        <label className="relative block">
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">Find preset</span>
          <Search className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 text-slate-400" />
          <input
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="sine, tangent, limit..."
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_auto]">
        <div className="mobile-safe-scroll thin-scrollbar">
          <div className="inline-flex min-w-full gap-2 md:min-w-0">
            {rangePresets.map((preset) => (
              <button key={preset.label} type="button" className="tool-button shrink-0" onClick={() => onRange(preset)}>
                <Maximize2 className="h-4 w-4" />
                {preset.label}
              </button>
            ))}
            <button type="button" className="tool-button shrink-0" onClick={() => onRange({ xMin: -8, xMax: 8, samples: 180 })}>
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToggleButton icon={<Grid3X3 className="h-4 w-4" />} label="Grid" active={showGrid} onClick={() => onShowGrid(!showGrid)} />
          <ToggleButton icon={<MousePointer2 className="h-4 w-4" />} label="Points" active={showPoints} onClick={() => onShowPoints(!showPoints)} />
          <ToggleButton icon={<Ruler className="h-4 w-4" />} label="Normalize" active={normalize} onClick={() => onNormalize(!normalize)} />
          <ToggleButton icon={<Layers3 className="h-4 w-4" />} label="Area" active={highlightArea} onClick={() => onHighlightArea(!highlightArea)} />
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <NumberInput label="x min" value={range.xMin} onChange={(xMin) => onRange({ ...range, xMin })} />
        <NumberInput label="x max" value={range.xMax} onChange={(xMax) => onRange({ ...range, xMax })} />
        <NumberInput label="samples" value={range.samples} min={40} max={400} step={10} onChange={(samples) => onRange({ ...range, samples: Math.round(samples) })} />
      </div>
    </SectionCard>
  );
}

function OverlayChart({
  curves,
  metrics,
  showGrid,
  showPoints,
  highlightArea,
}: {
  curves: CurveResult;
  metrics: ReturnType<typeof analyzeCurves>;
  showGrid: boolean;
  showPoints: boolean;
  highlightArea: boolean;
}) {
  return (
    <GraphCard title="Overlaid Comparison" description="Use the shared axes to compare shape, crossing points, and vertical distance.">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={curves.combined} margin={{ top: 16, right: 18, bottom: 8, left: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />}
          <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => Number(value).toFixed(4)} labelFormatter={(label) => `x = ${label}`} />
          <Legend />
          <ReferenceLine y={0} stroke="#64748b" strokeDasharray="5 5" />
          {metrics.intersections.slice(0, 6).map((x) => (
            <ReferenceLine key={x} x={x} stroke="#a855f7" strokeDasharray="4 4" />
          ))}
          {highlightArea && <Line type="monotone" dataKey="absDiff" name="|f-g|" stroke="#a855f7" dot={false} strokeWidth={1.5} strokeDasharray="4 6" />}
          <Line type="monotone" dataKey="f" name="f(x)" stroke="#06b6d4" dot={showPoints ? { r: 2 } : false} strokeWidth={3} />
          <Line type="monotone" dataKey="g" name="g(x)" stroke="#f97316" dot={showPoints ? { r: 2 } : false} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </GraphCard>
  );
}

function DifferenceChart({ curves, showGrid, showPoints }: { curves: CurveResult; showGrid: boolean; showPoints: boolean }) {
  return (
    <GraphCard title="Difference Curve f(x) - g(x)" description="Zeroes on this curve are intersections of f and g.">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={curves.combined} margin={{ top: 16, right: 18, bottom: 8, left: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />}
          <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => Number(value).toFixed(4)} labelFormatter={(label) => `x = ${label}`} />
          <ReferenceLine y={0} stroke="#64748b" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="diff" name="f(x)-g(x)" stroke="#ef4444" dot={showPoints ? { r: 2 } : false} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </GraphCard>
  );
}

function MiniChart({ title, data, color }: { title: string; data: CurvePoint[]; color: string }) {
  return (
    <GraphCard title={title}>
      <ResponsiveLineChart data={data} lineColor={color} />
    </GraphCard>
  );
}

function MetricsDashboard({ metrics, range }: { metrics: ReturnType<typeof analyzeCurves>; range: CompareRange }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<LocateFixed className="h-4 w-4" />} label="Intersections" value={String(metrics.intersections.length)} detail={formatList(metrics.intersections)} />
        <StatCard icon={<Activity className="h-4 w-4" />} label="Max |f-g|" value={formatNumber(metrics.maxAbsDiff)} detail={`at x = ${formatNumber(metrics.maxAbsDiffX)}`} />
        <StatCard icon={<Sigma className="h-4 w-4" />} label="Average |f-g|" value={formatNumber(metrics.avgAbsDiff)} detail="mean sampled vertical gap" />
        <StatCard icon={<ArrowLeftRight className="h-4 w-4" />} label="Window" value={`${range.xMin} to ${range.xMax}`} detail={`${range.samples} samples`} />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <SectionCard title="Sample Table" description="Use these points for quick checks before reading the graph." compact>
          <div className="overflow-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2">x</th>
                  <th className="px-3 py-2">f(x)</th>
                  <th className="px-3 py-2">g(x)</th>
                  <th className="px-3 py-2">f-g</th>
                </tr>
              </thead>
              <tbody>
                {metrics.sampleRows.map((row) => (
                  <tr key={row.x} className="border-t border-slate-200 dark:border-white/10">
                    <td className="px-3 py-2 font-mono">{row.x}</td>
                    <td className="px-3 py-2 font-mono text-cyan-700 dark:text-cyan-200">{formatNumber(row.f)}</td>
                    <td className="px-3 py-2 font-mono text-orange-700 dark:text-orange-200">{formatNumber(row.g)}</td>
                    <td className="px-3 py-2 font-mono text-rose-700 dark:text-rose-200">{formatNumber(row.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <DifferenceInsights metrics={metrics} />
      </div>
    </div>
  );
}

function DifferenceInsights({ metrics }: { metrics: ReturnType<typeof analyzeCurves> }) {
  return (
    <SectionCard title="Comparison Notes" description="Fast reading of equality, gap, and dominance." compact>
      <div className="grid gap-2">
        <InfoRow icon={<CheckCircle2 className="h-4 w-4" />} title="Equal when" text={metrics.intersections.length ? `x is near ${formatList(metrics.intersections)}` : "no intersection was found in this window"} />
        <InfoRow icon={<Target className="h-4 w-4" />} title="Largest gap" text={`|f-g| is about ${formatNumber(metrics.maxAbsDiff)} near x = ${formatNumber(metrics.maxAbsDiffX)}.`} />
        <InfoRow icon={<Zap className="h-4 w-4" />} title="Average gap" text={`Mean sampled difference is ${formatNumber(metrics.avgAbsDiff)}.`} />
        <InfoRow icon={<Eye className="h-4 w-4" />} title="Reading tip" text="Use the difference curve first. Its zeroes are easier to read than two crossing curves." />
      </div>
    </SectionCard>
  );
}

function PresetGallery({ presets: items, onApply, compact = false }: { presets: ComparePreset[]; onApply: (preset: ComparePreset) => void; compact?: boolean }) {
  return (
    <SectionCard title={compact ? "Quick Presets" : "Comparison Presets"} description={compact ? undefined : "Ready-made pairs for teaching transformations, rates, limits, and intersections."} compact>
      <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {items.map((preset) => (
          <button
            key={preset.title}
            type="button"
            onClick={() => onApply(preset)}
            className="rounded-xl border border-slate-200 bg-white/85 p-3 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="mini-chip">{preset.tag}</span>
              <FunctionSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
            </div>
            <h3 className="mt-2 text-sm font-black text-slate-950 dark:text-white">{preset.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{preset.note}</p>
            <p className="mt-2 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
              {preset.f} vs {preset.g}
            </p>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

function MetricSummary({ metrics, curves }: { metrics: ReturnType<typeof analyzeCurves>; curves: CurveResult }) {
  return (
    <SectionCard title="Live Summary" compact>
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<LocateFixed className="h-4 w-4" />} label="Crossings" value={String(metrics.intersections.length)} detail={formatList(metrics.intersections)} compact />
        <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Samples" value={String(curves.combined.length)} detail="points" compact />
        <StatCard icon={<Activity className="h-4 w-4" />} label="Max gap" value={formatNumber(metrics.maxAbsDiff)} detail={`x ${formatNumber(metrics.maxAbsDiffX)}`} compact />
        <StatCard icon={<Waves className="h-4 w-4" />} label="Avg gap" value={formatNumber(metrics.avgAbsDiff)} detail="mean" compact />
      </div>
    </SectionCard>
  );
}

function WindowPanel({ range, onRange }: { range: CompareRange; onRange: (range: CompareRange) => void }) {
  return (
    <SectionCard title="Window" compact>
      <div className="grid gap-2">
        <NumberInput label="x min" value={range.xMin} onChange={(xMin) => onRange({ ...range, xMin })} />
        <NumberInput label="x max" value={range.xMax} onChange={(xMax) => onRange({ ...range, xMax })} />
        <NumberInput label="samples" value={range.samples} min={40} max={400} step={10} onChange={(samples) => onRange({ ...range, samples: Math.round(samples) })} />
      </div>
    </SectionCard>
  );
}

function PromptBoard() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_.8fr]">
      <SectionCard title="Student Prompts" description="Short questions that make students compare, not just look." compact>
        <div className="grid gap-2 sm:grid-cols-2">
          {learningPrompts.map((prompt, index) => (
            <div key={prompt} className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
              <span className="mini-chip">Prompt {index + 1}</span>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{prompt}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <LearningChecklist />
    </div>
  );
}

function LearningChecklist() {
  const items = ["Read axes first", "Find equal points", "Compare shape", "Compare rate", "Read error curve", "Explain with words"];
  return (
    <SectionCard title="Learning Checklist" compact>
      <div className="grid gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-100 p-2 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
            {item}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ExpressionInput({ label, value, color, onChange }: { label: string; value: string; color: "cyan" | "orange"; onChange: (value: string) => void }) {
  const accent = color === "cyan" ? "bg-cyan-400" : "bg-orange-400";
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
        {label}
      </span>
      <input
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberInput({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min?: number; max?: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-300">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm font-bold outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ToggleButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={active ? "action-primary min-h-10 px-3" : "tool-button min-h-10 px-3"}>
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, detail, compact = false }: { icon: ReactNode; label: string; value: string; detail: string; compact?: boolean }) {
  return (
    <div className={`rounded-xl bg-slate-100 dark:bg-white/10 ${compact ? "p-2" : "p-3"}`}>
      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 dark:text-slate-300">
        {icon}
        {label}
      </div>
      <div className={`${compact ? "text-base" : "text-xl"} mt-1 truncate font-black text-slate-950 dark:text-white`}>{value}</div>
      <div className="mt-0.5 truncate text-xs font-semibold text-slate-500 dark:text-slate-300">{detail}</div>
    </div>
  );
}

function InfoRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-800 dark:bg-cyan-300/15 dark:text-cyan-100">{icon}</span>
      <div className="min-w-0">
        <h3 className="text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </div>
  );
}

function makeCurves(f: string, g: string, range: CompareRange, normalize: boolean): CurveResult {
  try {
    const fn = compileFunctionExpression(f);
    const gn = compileFunctionExpression(g);
    const start = Number.isFinite(range.xMin) ? range.xMin : -8;
    const end = Number.isFinite(range.xMax) && range.xMax > start ? range.xMax : start + 1;
    const count = clamp(Math.round(range.samples), 40, 400);
    const xs = Array.from({ length: count }, (_, index) => start + (index / (count - 1)) * (end - start));
    const rawF = xs.map((x) => safe(fn(x)));
    const rawG = xs.map((x) => safe(gn(x)));
    const fScale = normalize ? maxAbs(rawF) : 1;
    const gScale = normalize ? maxAbs(rawG) : 1;
    const fValues = rawF.map((value) => value / fScale);
    const gValues = rawG.map((value) => value / gScale);
    const combined = xs.map((x, index) => {
      const nextF = fValues[index];
      const nextG = gValues[index];
      const diff = safe(nextF - nextG);
      return { x: Number(x.toFixed(3)), f: nextF, g: nextG, diff, absDiff: Math.abs(diff) };
    });
    return {
      f: combined.map((point) => ({ x: point.x, y: point.f })),
      g: combined.map((point) => ({ x: point.x, y: point.g })),
      diff: combined.map((point) => ({ x: point.x, y: point.diff })),
      absDiff: combined.map((point) => ({ x: point.x, y: point.absDiff })),
      combined,
    };
  } catch {
    return {
      f: [],
      g: [],
      diff: [],
      absDiff: [],
      combined: [],
      error: "One expression could not be graphed. Try functions like sin(x), x^2, exp(x/3), sqrt(x+9), or 2*x-1.",
    };
  }
}

function analyzeCurves(curves: CurveResult) {
  const points = curves.combined;
  const intersections: number[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const current = points[index];
    if (!prev || !current) continue;
    if (prev.diff === 0) intersections.push(prev.x);
    if (prev.diff * current.diff < 0) {
      const ratio = Math.abs(prev.diff) / (Math.abs(prev.diff) + Math.abs(current.diff));
      intersections.push(Number((prev.x + (current.x - prev.x) * ratio).toFixed(3)));
    }
  }
  const absValues = points.map((point) => Math.abs(point.diff));
  const maxAbsDiff = absValues.length ? Math.max(...absValues) : 0;
  const maxPoint = points.find((point) => Math.abs(point.diff) === maxAbsDiff);
  const avgAbsDiff = absValues.length ? absValues.reduce((sum, value) => sum + value, 0) / absValues.length : 0;
  const sampleRows = [0.1, 0.3, 0.5, 0.7, 0.9]
    .map((ratio) => points[Math.min(points.length - 1, Math.max(0, Math.round((points.length - 1) * ratio)))])
    .filter(Boolean);
  return {
    intersections: uniqueRounded(intersections).slice(0, 8),
    maxAbsDiff,
    maxAbsDiffX: maxPoint?.x ?? 0,
    avgAbsDiff,
    sampleRows,
  };
}

function uniqueRounded(values: number[]) {
  return Array.from(new Set(values.map((value) => Number(value.toFixed(2)))));
}

function safe(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(4)) : 0;
}

function maxAbs(values: number[]) {
  return Math.max(1, ...values.map((value) => Math.abs(value)));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3).replace(/\.?0+$/, "");
}

function formatList(values: number[]) {
  if (!values.length) return "none";
  return values.slice(0, 4).map(formatNumber).join(", ");
}
