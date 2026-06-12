import { ArrowLeft, ExternalLink, Play, RotateCcw } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { allNavigatorCards, priorityVisualizations, type NavigatorCard } from "../data/syllabusNavigator";

type VisualFamily = "calculus" | "linear" | "signals" | "probability" | "discrete" | "complex" | "optimization" | "mechanics";

export default function MathVisualizationPage() {
  const { visualizationId } = useParams();
  const route = `/math/${visualizationId}`;
  const card = allNavigatorCards.find((item) => item.route === route);

  if (!visualizationId || !card) return <Navigate to="/syllabus" replace />;

  return <InteractiveConceptVisualizer card={card} visualizationId={visualizationId} />;
}

function InteractiveConceptVisualizer({ card, visualizationId }: { card: NavigatorCard; visualizationId: string }) {
  const [a, setA] = useState(1.25);
  const [b, setB] = useState(0.7);
  const [t, setT] = useState(0.45);
  const family = useMemo(() => inferFamily(card), [card]);
  const metrics = useMemo(() => conceptMetrics(family, a, b, t), [family, a, b, t]);
  const related = priorityVisualizations.filter((item) => item.route !== card.route).slice(0, 4);
  const Icon = card.icon;

  return (
    <div className="space-y-6">
      <Link to="/syllabus" className="action-secondary w-fit">
        <ArrowLeft className="h-4 w-4" />
        Syllabus Navigator
      </Link>

      <TopicHeader
        title={card.title}
        subtitle={card.description}
        difficulty={`${card.category} / Interactive`}
        estimatedMinutes={18}
      />

      <SectionCard title="Interactive Visualization" description="Move the concept controls and read the metrics against the diagram.">
        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{card.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{card.route}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
              </div>
            </div>

            <SliderGroup title="Live Controls">
              <SliderControl density="compact" label="shape" value={a} min={0.25} max={2.5} step={0.05} onChange={setA} />
              <SliderControl density="compact" label="forcing" value={b} min={0.1} max={2} step={0.05} onChange={setB} />
              <SliderControl density="compact" label="position" value={t} min={0} max={1} step={0.01} onChange={setT} />
            </SliderGroup>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={() => { setA(1.25); setB(0.7); setT(0.45); }}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button type="button" className="action-secondary inline-flex items-center gap-2" onClick={() => setT((value) => Number(((value + 0.12) % 1).toFixed(2)))}>
                <Play className="h-4 w-4" />
                Step
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-3 dark:border-white/10">
              <ConceptSvg family={family} title={card.title} id={visualizationId} a={a} b={b} t={t} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {card.topics.slice(0, 6).map((topic) => (
                <div key={topic} className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Concept Checks" description="Use the live diagram before moving to a specialized lab or worksheet.">
        <div className="grid gap-3 md:grid-cols-3">
          {conceptChecks(card, family).map((check) => (
            <div key={check} className="rounded-lg bg-slate-100 p-3 text-sm font-semibold leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {check}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Related Priority Visualizations">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <Link key={item.route} to={item.route} className="rounded-lg border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <h3 className="font-black">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">
                Open <ExternalLink className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ConceptSvg({ family, title, id, a, b, t }: { family: VisualFamily; title: string; id: string; a: number; b: number; t: number }) {
  return (
    <svg viewBox="0 0 760 430" className="h-[320px] w-full sm:h-[430px]" role="img" aria-label={`${title} interactive visualization`}>
      <title>{title}</title>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
        </marker>
      </defs>
      <rect width="760" height="430" rx="22" fill="#020617" />
      <Grid />
      {family === "calculus" && <CalculusScene a={a} b={b} t={t} markerId={`arrow-${id}`} />}
      {family === "linear" && <LinearScene a={a} b={b} t={t} markerId={`arrow-${id}`} />}
      {family === "signals" && <SignalsScene a={a} b={b} t={t} />}
      {family === "probability" && <ProbabilityScene a={a} b={b} t={t} />}
      {family === "discrete" && <DiscreteScene a={a} b={b} t={t} markerId={`arrow-${id}`} />}
      {family === "complex" && <ComplexScene a={a} b={b} t={t} markerId={`arrow-${id}`} />}
      {family === "optimization" && <OptimizationScene a={a} b={b} t={t} />}
      {family === "mechanics" && <MechanicsScene a={a} b={b} t={t} markerId={`arrow-${id}`} />}
    </svg>
  );
}

function CalculusScene({ a, b, t, markerId }: SceneProps) {
  const f = (x: number) => Math.sin(a * x) + 0.2 * b * x * x;
  const x0 = -2.4 + t * 4.8;
  const y0 = f(x0);
  const slope = a * Math.cos(a * x0) + 0.4 * b * x0;
  const bars = Array.from({ length: 12 }, (_, index) => {
    const x = -3 + index * 0.5;
    const h = Math.max(0.08, f(x) + 2);
    return <rect key={index} x={gx(x)} y={gy(h - 2)} width="26" height={Math.max(0, gy(-2) - gy(h - 2))} fill="#0891b2" opacity="0.28" />;
  });
  return (
    <GraphFrame>
      {bars}
      {curvePath(f, -3.4, 3.4, "#22d3ee")}
      <line x1={gx(x0 - 1)} y1={gy(y0 - slope)} x2={gx(x0 + 1)} y2={gy(y0 + slope)} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${markerId})`} />
      <Point x={gx(x0)} y={gy(y0)} label={`slope ${round(slope)}`} />
    </GraphFrame>
  );
}

function LinearScene({ a, b, t, markerId }: SceneProps) {
  const angle = t * Math.PI * 2;
  const basisA = { x: 105 * a, y: 35 * Math.sin(angle) };
  const basisB = { x: 35 * Math.cos(angle), y: 90 * b };
  const det = (basisA.x * basisB.y - basisA.y * basisB.x) / 9000;
  const points = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => `${380 + x * basisA.x + y * basisB.x},${215 - x * basisA.y - y * basisB.y}`).join(" ");
  return (
    <g>
      <Text x="54" y="52" text={`determinant area scale ${round(det)}`} />
      <polygon points={points} fill="#0891b2" opacity="0.32" stroke="#22d3ee" strokeWidth="4" />
      <Arrow x1={380} y1={215} x2={380 + basisA.x} y2={215 - basisA.y} color="#22d3ee" markerId={markerId} />
      <Arrow x1={380} y1={215} x2={380 + basisB.x} y2={215 - basisB.y} color="#f59e0b" markerId={markerId} />
      {Array.from({ length: 7 }, (_, index) => <line key={index} x1={120 + index * 80} y1="70" x2={120 + index * 80 + basisB.x} y2={350 - basisB.y} stroke="#334155" strokeWidth="2" opacity="0.7" />)}
      <Point x={380 + Math.cos(angle) * 120 * a} y={215 - Math.sin(angle) * 80 * b} label="tracked vector" />
    </g>
  );
}

function SignalsScene({ a, b, t }: SceneOnlyProps) {
  const signal = (x: number) => Math.sin(a * x + t * 5) + 0.45 * Math.sin(3 * x + b);
  return (
    <g>
      <Text x="54" y="52" text={`${Math.round(2 + a * 4)} harmonic blend, phase ${round(t)}`} />
      <path d={samplePath(signal, 0, Math.PI * 4, 170, 90, 520, 210, 55)} fill="none" stroke="#22d3ee" strokeWidth="5" />
      {Array.from({ length: 9 }, (_, index) => {
        const height = 18 + Math.abs(Math.sin(index * a + b)) * 95;
        return <rect key={index} x={110 + index * 58} y={340 - height} width="28" height={height} rx="6" fill={index % 2 ? "#f59e0b" : "#8b5cf6"} opacity="0.82" />;
      })}
      <line x1="75" y1="210" x2="685" y2="210" stroke="#475569" strokeWidth="2" />
    </g>
  );
}

function ProbabilityScene({ a, b, t }: SceneOnlyProps) {
  const sigma = 0.45 + b * 0.55;
  const mean = -1.4 + t * 2.8;
  const pdf = (x: number) => Math.exp(-((x - mean) ** 2) / (2 * sigma * sigma)) * a;
  const sampleX = mean + sigma;
  return (
    <GraphFrame>
      {curvePath(pdf, -3.5, 3.5, "#22d3ee")}
      <line x1={gx(mean)} y1={gy(-1.6)} x2={gx(mean)} y2={gy(2.8)} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 6" />
      <Point x={gx(sampleX)} y={gy(pdf(sampleX))} label={`sigma ${round(sigma)}`} />
      <Text x="92" y="74" text={`mean ${round(mean)}, variance ${round(sigma * sigma)}`} />
    </GraphFrame>
  );
}

function DiscreteScene({ a, b, t, markerId }: SceneProps) {
  const n = Math.round(5 + a * 3);
  const positions = Array.from({ length: n }, (_, i) => ({ x: 380 + 145 * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n), y: 215 + 125 * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n) }));
  return (
    <g>
      <Text x="54" y="52" text={`${n} vertices, threshold ${round(b)}`} />
      {positions.flatMap((from, i) => positions.slice(i + 1).map((to, offset) => ({ from, to, key: `${i}-${i + offset + 1}`, draw: ((i * 17 + offset * 11 + Math.round(t * 20)) % 10) / 10 < b / 2 }))).filter((edge) => edge.draw).map((edge) => <line key={edge.key} x1={edge.from.x} y1={edge.from.y} x2={edge.to.x} y2={edge.to.y} stroke="#22d3ee" strokeWidth="3" opacity="0.6" />)}
      {positions.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r="19" fill="#8b5cf6" /><text x={point.x - 5} y={point.y + 6} fill="#fff" fontSize="14" fontWeight="900">{index}</text></g>)}
      <Arrow x1={positions[0].x} y1={positions[0].y} x2={positions[Math.min(n - 1, Math.max(1, Math.round(t * (n - 1))))].x} y2={positions[Math.min(n - 1, Math.max(1, Math.round(t * (n - 1))))].y} color="#f59e0b" markerId={markerId} />
    </g>
  );
}

function ComplexScene({ a, b, t, markerId }: SceneProps) {
  const theta = t * Math.PI * 2;
  const radius = 70 + a * 46;
  const z = { x: 380 + radius * Math.cos(theta), y: 215 - radius * Math.sin(theta) };
  const w = { x: 380 + radius * b * Math.cos(theta + Math.PI / 4) * 0.75, y: 215 - radius * b * Math.sin(theta + Math.PI / 4) * 0.75 };
  return (
    <g>
      <line x1="110" x2="650" y1="215" y2="215" stroke="#64748b" strokeWidth="3" />
      <line x1="380" x2="380" y1="55" y2="375" stroke="#64748b" strokeWidth="3" />
      <circle cx="380" cy="215" r={radius} fill="none" stroke="#334155" strokeWidth="3" />
      <Arrow x1={380} y1={215} x2={z.x} y2={z.y} color="#22d3ee" markerId={markerId} />
      <Arrow x1={380} y1={215} x2={w.x} y2={w.y} color="#f59e0b" markerId={markerId} />
      <Point x={z.x} y={z.y} label={`arg ${round(theta * 180 / Math.PI)} deg`} />
      <Text x="54" y="52" text={`|z| ${round(radius / 70)}, rotation and scaling shown`} />
    </g>
  );
}

function OptimizationScene({ a, b, t }: SceneOnlyProps) {
  const objectiveY = 330 - t * 190;
  return (
    <g>
      <Text x="54" y="52" text={`objective Z=${round(a * 18 + b * 12 + t * 10)}`} />
      <line x1="120" y1="360" x2="650" y2="360" stroke="#64748b" strokeWidth="3" />
      <line x1="150" y1="70" x2="150" y2="380" stroke="#64748b" strokeWidth="3" />
      <polygon points={`${150},360 ${150},185 ${300 + a * 38},110 ${610 - b * 50},255 ${525},360`} fill="#0891b2" opacity="0.32" stroke="#22d3ee" strokeWidth="4" />
      <line x1="120" y1={objectiveY} x2="650" y2={objectiveY - 90} stroke="#f59e0b" strokeWidth="5" />
      <circle cx={300 + t * 155} cy={250 - t * 115} r="11" fill="#fb7185" stroke="#fff" strokeWidth="2" />
      <Text x="480" y="390" text="corner sweep" />
    </g>
  );
}

function MechanicsScene({ a, b, t, markerId }: SceneProps) {
  const x = 120 + t * 500;
  const y = 260 - 80 * Math.sin(t * Math.PI) * a;
  return (
    <g>
      <Text x="54" y="52" text={`projectile range ${(a * b * 12).toFixed(1)}, energy cue ${(a * 9.8).toFixed(1)}`} />
      <path d={`M120 260 C260 ${140 - a * 18} 430 ${150 - b * 25} 620 260`} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <Arrow x1={x} y1={y} x2={x + 62} y2={y - 35 * b} color="#f59e0b" markerId={markerId} />
      <circle cx={x} cy={y} r="13" fill="#fb7185" stroke="#fff" strokeWidth="2" />
      <line x1="90" y1="260" x2="670" y2="260" stroke="#64748b" strokeWidth="3" />
    </g>
  );
}

type SceneOnlyProps = { a: number; b: number; t: number };
type SceneProps = SceneOnlyProps & { markerId: string };

function inferFamily(card: NavigatorCard): VisualFamily {
  const haystack = `${card.title} ${card.description} ${card.topics.join(" ")}`.toLowerCase();
  if (/matrix|eigen|vector|linear algebra|basis|rank|pca/.test(haystack)) return "linear";
  if (/fourier|signal|wave|transform|laplace|z-transform/.test(haystack)) return "signals";
  if (/probability|statistics|distribution|sampling|regression|variance/.test(haystack)) return "probability";
  if (/graph theory|discrete|permutation|combination|logic|tree|relation|recurrence/.test(haystack)) return "discrete";
  if (/complex|argand|euler|polar/.test(haystack)) return "complex";
  if (/optimization|gradient|linear programming|operations research|constraint/.test(haystack)) return "optimization";
  if (/mechanics|force|energy|motion|momentum/.test(haystack)) return "mechanics";
  return "calculus";
}

function conceptMetrics(family: VisualFamily, a: number, b: number, t: number) {
  if (family === "linear") return [{ label: "Area scale", value: round(a * b).toString() }, { label: "Trace cue", value: round(a + b).toString() }, { label: "Phase", value: round(t).toString() }, { label: "Rank cue", value: `${Math.max(1, Math.round(a + b))}` }];
  if (family === "signals") return [{ label: "Harmonics", value: `${Math.round(2 + a * 4)}` }, { label: "Gain", value: round(a + b).toString() }, { label: "Phase", value: round(t * 360).toString() }, { label: "Bandwidth", value: round(b * 4).toString() }];
  if (family === "probability") return [{ label: "Mean", value: round(-1.4 + t * 2.8).toString() }, { label: "Sigma", value: round(0.45 + b * 0.55).toString() }, { label: "Variance", value: round((0.45 + b * 0.55) ** 2).toString() }, { label: "Scale", value: round(a).toString() }];
  if (family === "discrete") return [{ label: "Nodes", value: `${Math.round(5 + a * 3)}` }, { label: "Density", value: round(b / 2).toString() }, { label: "Step", value: round(t).toString() }, { label: "Paths", value: `${Math.round(a * b * 4)}` }];
  if (family === "complex") return [{ label: "Modulus", value: round(1 + a * 0.66).toString() }, { label: "Argument", value: `${round(t * 360)} deg` }, { label: "Scale", value: round(b).toString() }, { label: "Rotation", value: "45 deg" }];
  if (family === "optimization") return [{ label: "Objective", value: round(a * 18 + b * 12 + t * 10).toString() }, { label: "Constraint A", value: round(a).toString() }, { label: "Constraint B", value: round(b).toString() }, { label: "Corner", value: `${Math.round(t * 4)}` }];
  if (family === "mechanics") return [{ label: "Range", value: round(a * b * 12).toString() }, { label: "Height", value: round(a * 80).toString() }, { label: "Velocity", value: round(b * 9.8).toString() }, { label: "Time", value: round(t).toString() }];
  return [{ label: "Slope", value: round(a * Math.cos(a * t * 3)).toString() }, { label: "Area cue", value: round(a * b * 2).toString() }, { label: "Position", value: round(t).toString() }, { label: "Curvature", value: round(a * b).toString() }];
}

function conceptChecks(card: NavigatorCard, family: VisualFamily) {
  const base = card.topics.slice(0, 3).map((topic) => `Explain how the diagram changes one idea from ${topic}.`);
  const familyCheck: Record<VisualFamily, string> = {
    calculus: "Compare the tangent, accumulated area, and point motion before calculating.",
    linear: "Predict whether the grid area expands, contracts, or flips from the transformed basis vectors.",
    signals: "Match the spectrum bars to visible waveform changes.",
    probability: "Move the mean and spread, then state what happens to probability mass.",
    discrete: "Use node degree or counting structure to justify the visual pattern.",
    complex: "Read modulus and argument from the moving complex vector.",
    optimization: "Find the corner where the objective line last touches the feasible region.",
    mechanics: "Connect the trajectory point to velocity, height, and range.",
  };
  return [...base, familyCheck[family]].slice(0, 4);
}

function GraphFrame({ children }: { children: ReactNode }) {
  return (
    <g>
      <line x1="80" y1="215" x2="680" y2="215" stroke="#64748b" strokeWidth="2" />
      <line x1="380" y1="55" x2="380" y2="380" stroke="#64748b" strokeWidth="2" />
      {children}
    </g>
  );
}

function Grid() {
  return (
    <g opacity="0.25">
      {Array.from({ length: 13 }, (_, i) => <line key={`v-${i}`} x1={80 + i * 50} y1="45" x2={80 + i * 50} y2="385" stroke="#334155" />)}
      {Array.from({ length: 8 }, (_, i) => <line key={`h-${i}`} x1="70" y1={65 + i * 45} x2="690" y2={65 + i * 45} stroke="#334155" />)}
    </g>
  );
}

function curvePath(fn: (x: number) => number, from: number, to: number, color: string) {
  let started = false;
  const d = Array.from({ length: 180 }, (_, index) => {
    const x = from + (index / 179) * (to - from);
    const y = fn(x);
    if (!Number.isFinite(y)) {
      started = false;
      return "";
    }
    const command = started ? "L" : "M";
    started = true;
    return `${command}${gx(x)},${gy(Math.max(-3.5, Math.min(3.5, y)))}`;
  }).filter(Boolean).join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />;
}

function samplePath(fn: (x: number) => number, start: number, end: number, count: number, x0: number, width: number, y0: number, scale: number) {
  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);
    const x = start + ratio * (end - start);
    return `${index === 0 ? "M" : "L"}${x0 + ratio * width},${y0 - fn(x) * scale}`;
  }).join(" ");
}

function Arrow({ x1, y1, x2, y2, color, markerId }: { x1: number; y1: number; x2: number; y2: number; color: string; markerId: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${markerId})`} />;
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="10" fill="#fb7185" stroke="#fff" strokeWidth="2" /><Text x={x + 14} y={y - 12} text={label} /></g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} fill="#f8fafc" fontSize="15" fontWeight="900">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-black">{value}</p></div>;
}

function gx(x: number) {
  return 380 + x * 84;
}

function gy(y: number) {
  return 215 - y * 45;
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
