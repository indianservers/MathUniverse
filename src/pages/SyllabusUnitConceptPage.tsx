import { ArrowLeft, CheckCircle2, FlaskConical, Lightbulb, Link as LinkIcon, Route, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { createFallbackSyllabusUnitConcept, type SyllabusUnitConcept, type SyllabusUnitKind } from "../data/syllabusUnitConcepts";

type SyllabusUnitConceptPageProps = {
  concept?: SyllabusUnitConcept;
  conceptId?: string;
};

export default function SyllabusUnitConceptPage({ concept, conceptId }: SyllabusUnitConceptPageProps) {
  const unit = concept ?? createFallbackSyllabusUnitConcept(conceptId ?? "interactive-concept");
  const [a, setA] = useState(54);
  const [b, setB] = useState(38);
  const [mode, setMode] = useState(0);
  const insight = useMemo(() => buildInsight(unit.kind, a, b, mode), [a, b, mode, unit.kind]);
  const formula = formulaForKind(unit.kind, unit.title);
  const resources = resourceLinksForUnit(unit);
  const guidedSteps = guidedStepsForUnit(unit.kind);

  return (
    <div className="space-y-5">
      <Link className="mini-chip w-fit" to="/syllabus"><ArrowLeft className="h-3.5 w-3.5" /> Back to syllabus</Link>
      <TopicHeader title={unit.title} subtitle={`${unit.strand} / interactive unit page`} difficulty="Concept lab" estimatedMinutes={12} />

      <SectionCard
        title={`${unit.title} Visual Lab`}
        description={unit.summary}
        headerAction={<Link to="/workspace" className="action-secondary"><Route className="h-4 w-4" />Open workspace</Link>}
      >
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-cyan-300/30 bg-slate-950 p-4 text-white shadow-2xl shadow-cyan-950/20">
              <p className="text-[11px] font-black uppercase text-cyan-200">Concept formula</p>
              <p className="mt-2 break-words font-mono text-sm font-black text-cyan-50">{formula}</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-slate-300">{unit.summary}</p>
            </div>
            <SliderControl label={unit.controls.a} value={a} min={0} max={100} step={1} onChange={setA} />
            <SliderControl label={unit.controls.b} value={b} min={0} max={100} step={1} onChange={setB} />
            <div className="grid grid-cols-3 gap-2">
              {["predict", "check", "reflect"].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(index)}
                  className={`min-h-12 rounded-xl border px-2 text-xs font-black uppercase transition ${mode === index ? "border-cyan-400 bg-cyan-500 text-white" : "border-slate-200 bg-white/75 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/40">
              <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">{unit.controls.mode}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{insight}</p>
            </div>
            <div className="grid gap-2">
              {guidedSteps.map((step, index) => (
                <div key={step} className={`flex items-start gap-2 rounded-xl border p-3 text-xs font-bold leading-5 ${index === mode ? "border-cyan-300 bg-cyan-50 text-slate-900 dark:bg-cyan-400/10 dark:text-cyan-50" : "border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}>
                  {index === 0 ? <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> : index === 1 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <UnitConceptSvg kind={unit.kind} title={unit.title} a={a} b={b} mode={mode} />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title={`${unit.title} Examples`} compact>
          <div className="space-y-2">
            {unit.examples.map((example, index) => (
              <div key={example} className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Example {index + 1}</p>
                <p className="mt-1 text-sm font-bold">{example}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={`${unit.title} Interact`} compact>
          <div className="space-y-2">
            {unit.prompts.map((prompt, index) => (
              <div key={prompt} className="flex gap-2 rounded-xl border border-slate-200 bg-white/70 p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/5">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                <span>{index + 1}. {prompt}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title={`${unit.title} Tools`} compact>
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p className="flex gap-2"><Sparkles className="mt-1 h-4 w-4 shrink-0 text-cyan-500" />{unitOnlyToolText(unit.kind)}</p>
            <p className="flex gap-2"><LinkIcon className="mt-1 h-4 w-4 shrink-0 text-amber-500" />Shareable route: <span className="font-mono text-xs">{unit.route}</span></p>
            {resources.map((resource) => (
              <Link key={resource.to} to={resource.to} className="action-secondary w-fit">
                Open {resource.label}
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function buildInsight(kind: SyllabusUnitKind, a: number, b: number, mode: number) {
  const x = Math.round((a - 50) / 10);
  const y = Math.round((b - 50) / 10);
  if (kind === "polynomial") return `The graph is using a=${(0.5 + a / 55).toFixed(2)} and roots near ${x - 2}, ${x + 2}; zeros, factors, and intercepts move together.`;
  if (kind === "coordinate") return `Point P(${x}, ${y}) shows horizontal movement first and vertical movement second.`;
  if (kind === "linear-equation") return `The line reads approximately y=${((a - 50) / 18).toFixed(1)}x+${y}; every point on it satisfies the equation.`;
  if (kind === "quadrilateral") return `Skew ${a - 50} and height ${b} show that area can stay linked to base and height while angles change.`;
  if (kind === "circle") return `Radius ${Math.round(24 + a * 0.9)} and angle ${Math.round(30 + b * 3)} degrees connect arc, sector, chord, and tangent.`;
  if (kind === "triangle") return `The moving vertex changes side lengths and area, while the angle sum remains 180 degrees.`;
  if (kind === "statistics") return `Changing one value shifts the mean line; mode ${mode + 1} highlights bars, mean, or spread.`;
  if (kind === "matrix") return `Scale ${(a / 50).toFixed(1)} and shear ${((b - 50) / 25).toFixed(1)} transform the unit square and change determinant area.`;
  if (kind === "calculus") return `As the gap changes, the secant slope approaches the tangent idea behind derivative or accumulated area.`;
  if (kind === "vector") return `Magnitude ${a} and direction ${Math.round(b * 3.6)} degrees split into horizontal and vertical components.`;
  if (kind === "real-numbers") return `Marker ${((a - 50) / 8).toFixed(2)} is compared with rational ticks and irrational square-root positions.`;
  return `Control A=${a}, Control B=${b}, mode=${mode + 1}; observe what changes and what stays invariant.`;
}

function UnitConceptSvg({ kind, title, a, b, mode }: { kind: SyllabusUnitKind; title: string; a: number; b: number; mode: number }) {
  const accent = colorForKind(kind);
  return (
    <svg className="h-[520px] w-full rounded-xl bg-slate-950" viewBox="0 0 760 520" role="img" aria-label={`${title} interactive visualization`}>
      <defs>
        <radialGradient id={`stage-${kind}`} cx="48%" cy="40%" r="70%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="48%" stopColor="#0f172a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </radialGradient>
        <filter id={`glow-${kind}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="unit-stage-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="760" height="520" rx="22" fill={`url(#stage-${kind})`} />
      <Grid />
      <text x="34" y="48" fill="#e0f2fe" fontSize="22" fontWeight="900">{title}</text>
      <text x="34" y="76" fill="#94a3b8" fontSize="13" fontWeight="700">{["prediction layer", "measurement layer", "reflection layer"][mode]}</text>
      <AnimatedPulse accent={accent} mode={mode} />
      {kind === "real-numbers" && <RealNumberModel a={a} b={b} accent={accent} />}
      {kind === "polynomial" && <PolynomialModel a={a} b={b} accent={accent} />}
      {kind === "coordinate" && <CoordinateModel a={a} b={b} accent={accent} />}
      {kind === "linear-equation" && <LinearModel a={a} b={b} accent={accent} />}
      {kind === "euclid" && <EuclidModel a={a} b={b} accent={accent} />}
      {kind === "triangle" && <TriangleModel a={a} b={b} accent={accent} />}
      {kind === "quadrilateral" && <QuadrilateralModel a={a} b={b} accent={accent} />}
      {kind === "circle" && <CircleModel a={a} b={b} accent={accent} />}
      {kind === "statistics" && <StatisticsModel a={a} b={b} accent={accent} />}
      {kind === "relations" && <RelationsModel a={a} b={b} accent={accent} />}
      {kind === "matrix" && <MatrixModel a={a} b={b} accent={accent} />}
      {kind === "calculus" && <CalculusModel a={a} b={b} accent={accent} />}
      {kind === "vector" && <VectorModel a={a} b={b} accent={accent} />}
      {kind === "measurement" && <MeasurementModel a={a} b={b} accent={accent} />}
      {kind === "pattern" && <PatternModel a={a} b={b} accent={accent} />}
      {kind === "generic" && <GenericModel a={a} b={b} accent={accent} />}
    </svg>
  );
}

function AnimatedPulse({ accent, mode }: { accent: string; mode: number }) {
  return (
    <g opacity="0.85">
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={120 + i * 56} cy="112" r={mode === i ? 7 : 4} fill={mode === i ? "#f59e0b" : accent} filter="url(#unit-stage-glow)">
          <animate attributeName="opacity" values="0.25;1;0.25" dur={`${1.8 + i * 0.35}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

function Grid() {
  return (
    <g opacity="0.45">
      {Array.from({ length: 13 }).map((_, i) => <line key={`x-${i}`} x1={70 + i * 52} y1="96" x2={70 + i * 52} y2="470" stroke="#1e293b" />)}
      {Array.from({ length: 8 }).map((_, i) => <line key={`y-${i}`} x1="54" y1={112 + i * 48} x2="706" y2={112 + i * 48} stroke="#1e293b" />)}
    </g>
  );
}

function RealNumberModel({ a, accent }: ModelProps) {
  const x = 106 + a * 5.2;
  return <g><line x1="100" y1="290" x2="660" y2="290" stroke="#cbd5e1" strokeWidth="4" />{[-4,-3,-2,-1,0,1,2,3,4].map((n) => <g key={n}><line x1={380 + n * 62} y1="272" x2={380 + n * 62} y2="308" stroke="#cbd5e1" strokeWidth="3" /><text x={374 + n * 62} y="336" fill="#e2e8f0" fontSize="15">{n}</text></g>)}<rect x={x - 18} y="222" width="36" height="86" rx="12" fill={accent} opacity="0.45"><animate attributeName="height" values="70;92;70" dur="2.8s" repeatCount="indefinite" /></rect><circle cx={x} cy="290" r="12" fill="#f59e0b" filter="url(#glow-real-numbers)" /><text x="234" y="410" fill="#f8fafc" fontSize="18" fontWeight="900">rational and irrational values live on one line</text></g>;
}

function PolynomialModel({ a, b, accent }: ModelProps) {
  const scale = 0.006 + a / 19000;
  const shift = (b - 50) / 16;
  const points = Array.from({ length: 130 }).map((_, i) => {
    const x = -6 + (i / 129) * 12;
    const y = scale * 950 * (x - shift - 2) * (x - shift + 2);
    return `${100 + i * 4.4},${310 - y * 38}`;
  }).join(" ");
  return <g><Axis /><polyline points={points} fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" filter="url(#glow-polynomial)" /><circle cx={380 + (shift - 2) * 46} cy="310" r="11" fill="#f59e0b"><animate attributeName="r" values="8;14;8" dur="2.2s" repeatCount="indefinite" /></circle><circle cx={380 + (shift + 2) * 46} cy="310" r="11" fill="#f59e0b"><animate attributeName="r" values="14;8;14" dur="2.2s" repeatCount="indefinite" /></circle><text x="236" y="430" fill="#f8fafc" fontSize="18" fontWeight="900">zeros are x-intercepts and factors</text></g>;
}

function CoordinateModel({ a, b, accent }: ModelProps) {
  const x = 380 + (a - 50) * 4.8;
  const y = 290 - (b - 50) * 3.2;
  return <g><Axis /><line x1={x} y1="290" x2={x} y2={y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="9 7" /><line x1="380" y1={y} x2={x} y2={y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="9 7" /><circle cx={x} cy={y} r="16" fill={accent} stroke="#f8fafc" strokeWidth="4" filter="url(#glow-coordinate)"><animate attributeName="r" values="12;19;12" dur="2s" repeatCount="indefinite" /></circle><text x={x + 18} y={y - 14} fill="#f8fafc" fontSize="17" fontWeight="900">P</text><text x="238" y="430" fill="#f8fafc" fontSize="18" fontWeight="900">ordered pair = horizontal, then vertical</text></g>;
}

function LinearModel({ a, b, accent }: ModelProps) {
  const m = (a - 50) / 32;
  const c = (b - 50) * 2;
  return <g><Axis /><line x1="120" y1={290 - (m * -5.4 * 44 + c)} x2="640" y2={290 - (m * 5.4 * 44 + c)} stroke={accent} strokeWidth="6" /><text x="244" y="430" fill="#f8fafc" fontSize="18" fontWeight="900">slope and intercept control every solution point</text></g>;
}

function EuclidModel({ a, b, accent }: ModelProps) {
  const r = 48 + a * 0.9;
  const d = 120 + b * 1.4;
  return <g><line x1="180" y1="320" x2="580" y2="320" stroke="#cbd5e1" strokeWidth="4" /><circle cx={380 - d / 2} cy="320" r={r} fill="none" stroke={accent} strokeWidth="5" /><circle cx={380 + d / 2} cy="320" r={r} fill="none" stroke="#f59e0b" strokeWidth="5" /><circle cx={380 - d / 2} cy="320" r="7" fill="#f8fafc" /><circle cx={380 + d / 2} cy="320" r="7" fill="#f8fafc" /><text x="238" y="430" fill="#f8fafc" fontSize="18" fontWeight="900">equal radii preserve copied length</text></g>;
}

function TriangleModel({ a, b, accent }: ModelProps) {
  const cx = 250 + a * 2.6;
  const cy = 112 + b * 2.2;
  return <g><polygon points={`160,402 610,402 ${cx},${cy}`} fill={accent} opacity="0.2" stroke={accent} strokeWidth="6" /><line x1={cx} y1={cy} x2={cx} y2="402" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><text x="262" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">area = half x base x height</text></g>;
}

function QuadrilateralModel({ a, b, accent }: ModelProps) {
  const skew = (a - 50) * 2.2;
  const height = 110 + b * 1.8;
  return <g><polygon points={`${180 + skew},${390 - height} 580,${390 - height} ${620 - skew * 0.4},390 150,390`} fill={accent} opacity="0.24" stroke={accent} strokeWidth="6" /><line x1={180 + skew} y1={390 - height} x2={620 - skew * 0.4} y2="390" stroke="#f59e0b" strokeWidth="4" /><line x1="580" y1={390 - height} x2="150" y2="390" stroke="#f59e0b" strokeWidth="4" /><text x="246" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">diagonals and area respond to shape family</text></g>;
}

function CircleModel({ a, b, accent }: ModelProps) {
  const r = 55 + a * 1.25;
  const angle = (30 + b * 3) * Math.PI / 180;
  const cx = 380;
  const cy = 292;
  const end = { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
  return <g><circle cx={cx} cy={cy} r={r} fill={accent} opacity="0.14" stroke={accent} strokeWidth="6" /><line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#e2e8f0" strokeWidth="4" /><line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#f59e0b" strokeWidth="4" /><path d={`M${cx + 42} ${cy} A42 42 0 ${angle > Math.PI ? 1 : 0} 0 ${cx + Math.cos(angle) * 42} ${cy - Math.sin(angle) * 42}`} fill="none" stroke="#f59e0b" strokeWidth="5" /><line x1={cx + r} y1={cy - 80} x2={cx + r} y2={cy + 80} stroke="#f8fafc" strokeWidth="4" /><text x="250" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">radius, arc, sector, chord, tangent</text></g>;
}

function StatisticsModel({ a, b, accent }: ModelProps) {
  const bars = [70, 114, 52 + a * 1.5, 88 + b, 132];
  const mean = bars.reduce((sum, value) => sum + value, 0) / bars.length;
  return <g><line x1="150" y1="406" x2="620" y2="406" stroke="#cbd5e1" strokeWidth="4" />{bars.map((bar, i) => <rect key={i} x={190 + i * 78} y={406 - bar} width="42" height={bar} rx="8" fill={accent} opacity={i === 2 ? 0.95 : 0.55} />)}<line x1="170" y1={406 - mean} x2="600" y2={406 - mean} stroke="#f59e0b" strokeWidth="5" strokeDasharray="10 8" /><text x="276" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">mean shifts when data changes</text></g>;
}

function RelationsModel({ a, b, accent }: ModelProps) {
  const offset = Math.round((a + b) / 35) % 3;
  return <g>{[0,1,2].map((i) => <circle key={`l${i}`} cx="220" cy={210 + i * 72} r="24" fill="#0f172a" stroke={accent} strokeWidth="4" />)}{[0,1,2].map((i) => <circle key={`r${i}`} cx="540" cy={210 + i * 72} r="24" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />)}{[0,1,2].map((i) => <line key={i} x1="244" y1={210 + i * 72} x2="516" y2={210 + ((i + offset) % 3) * 72} stroke={accent} strokeWidth="5" />)}<text x="284" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">one output per input makes a function</text></g>;
}

function MatrixModel({ a, b, accent }: ModelProps) {
  const shear = (b - 50) * 1.2;
  const scale = 70 + a;
  return <g><rect x="160" y="210" width="110" height="110" fill="none" stroke="#64748b" strokeWidth="4" /><polygon points={`440,330 ${440 + shear},${330 - scale} ${560 + shear},${330 - scale} 560,330`} fill={accent} opacity="0.24" stroke={accent} strokeWidth="6" /><text x="250" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">matrix transforms area and direction</text></g>;
}

function CalculusModel({ a, b, accent }: ModelProps) {
  const p1 = 170 + a * 3.8;
  const p2 = p1 + 24 + b * 1.8;
  return <g><path d="M120 392 C230 120 430 170 650 280" fill="none" stroke={accent} strokeWidth="6" /><line x1={p1} y1="306" x2={p2} y2="236" stroke="#f59e0b" strokeWidth="5" /><circle cx={p1} cy="306" r="10" fill="#f59e0b" /><circle cx={p2} cy="236" r="10" fill="#f59e0b" /><text x="238" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">secants approach tangent rate</text></g>;
}

function VectorModel({ a, b, accent }: ModelProps) {
  const angle = b * Math.PI / 50;
  const len = 80 + a * 2.5;
  const x = 250 + Math.cos(angle) * len;
  const y = 365 - Math.sin(angle) * len;
  return <g><Axis /><line x1="250" y1="365" x2={x} y2={y} stroke={accent} strokeWidth="8" strokeLinecap="round" /><polygon points={`${x},${y} ${x - 20},${y - 8} ${x - 8},${y + 20}`} fill={accent} /><line x1="250" y1="365" x2={x} y2="365" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><line x1={x} y1="365" x2={x} y2={y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><text x="282" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">vector = components plus direction</text></g>;
}

function MeasurementModel({ a, b, accent }: ModelProps) {
  const w = 130 + a * 2.8;
  const h = 80 + b * 1.8;
  return <g><rect x="130" y={390 - h} width={w} height={h} fill={accent} opacity="0.22" stroke={accent} strokeWidth="6" /><g transform="translate(520 250)"><rect x="0" y="34" width="82" height="82" fill={accent} opacity="0.32" stroke={accent} strokeWidth="4" /><polygon points="0,34 34,0 116,0 82,34" fill={accent} opacity="0.18" stroke={accent} strokeWidth="4" /><polygon points="82,34 116,0 116,82 82,116" fill={accent} opacity="0.12" stroke={accent} strokeWidth="4" /></g><text x="244" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">length to area to volume</text></g>;
}

function PatternModel({ a, b, accent }: ModelProps) {
  const n = 4 + Math.round(a / 16);
  const step = 12 + b / 6;
  return <g>{Array.from({ length: n }).map((_, i) => <g key={i}>{Array.from({ length: i + 1 }).map((__, j) => <circle key={j} cx={170 + i * 82} cy={360 - j * step} r="10" fill={accent} opacity="0.85" />)}</g>)}<text x="234" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">term number controls visible growth</text></g>;
}

function GenericModel({ a, b, accent }: ModelProps) {
  return <g>{Array.from({ length: 7 }).map((_, i) => { const angle = i * Math.PI * 2 / 7; const x = 380 + Math.cos(angle) * (90 + a); const y = 290 + Math.sin(angle) * (70 + b); return <g key={i}><line x1="380" y1="290" x2={x} y2={y} stroke={accent} opacity="0.45" strokeWidth="4" /><circle cx={x} cy={y} r="22" fill={accent} opacity="0.78" /></g>; })}<circle cx="380" cy="290" r="48" fill="#0f172a" stroke={accent} strokeWidth="5" /><text x="276" y="452" fill="#f8fafc" fontSize="18" fontWeight="900">linked concept representations</text></g>;
}

function Axis() {
  return <g><line x1="100" y1="310" x2="660" y2="310" stroke="#94a3b8" strokeWidth="3" /><line x1="380" y1="120" x2="380" y2="430" stroke="#94a3b8" strokeWidth="3" /></g>;
}

type ModelProps = { a: number; b: number; accent: string };

function colorForKind(kind: SyllabusUnitKind) {
  const colors: Record<SyllabusUnitKind, string> = {
    "real-numbers": "#14b8a6",
    polynomial: "#22d3ee",
    coordinate: "#38bdf8",
    "linear-equation": "#60a5fa",
    euclid: "#34d399",
    triangle: "#f59e0b",
    quadrilateral: "#a78bfa",
    circle: "#fb7185",
    statistics: "#4ade80",
    relations: "#f472b6",
    matrix: "#818cf8",
    calculus: "#c084fc",
    vector: "#2dd4bf",
    measurement: "#facc15",
    pattern: "#fb923c",
    generic: "#38bdf8",
  };
  return colors[kind];
}

function formulaForKind(kind: SyllabusUnitKind, title: string) {
  const formulas: Record<SyllabusUnitKind, string> = {
    "real-numbers": "number line: x in R, rational and irrational values share one ordered scale",
    polynomial: "p(x)=a(x-r1)(x-r2), zeros occur where p(x)=0",
    coordinate: "distance = sqrt((x2-x1)^2+(y2-y1)^2), slope = (y2-y1)/(x2-x1)",
    "linear-equation": "y=mx+c; solution points satisfy the same equation",
    euclid: "equal-radius arcs preserve equal lengths and locate exact construction points",
    triangle: "A = 1/2 bh, angle A + angle B + angle C = 180 deg",
    quadrilateral: "parallelogram A=bh; diagonals and side rules identify each family",
    circle: "C=2 pi r, A=pi r^2, arc=(theta/360)2 pi r",
    statistics: "mean = sum(values)/n; spread changes interpretation",
    relations: "function rule: every input has exactly one output",
    matrix: "det([[a,b],[c,d]]) = ad-bc; transformation changes area by determinant",
    calculus: "derivative = limiting slope; integral = accumulated signed area",
    vector: "v = <x,y>, |v|=sqrt(x^2+y^2), components define direction",
    measurement: "area uses square units; volume uses cubic units",
    pattern: "arithmetic: an=a1+(n-1)d; geometric: an=a1*r^(n-1)",
    generic: `${title}: linked visual model, formula, examples, and checks`,
  };
  return formulas[kind];
}

function guidedStepsForUnit(kind: SyllabusUnitKind) {
  const steps: Record<SyllabusUnitKind, string[]> = {
    "real-numbers": ["Predict the marker's interval before moving it.", "Check the exact position against nearby integer ticks.", "Explain whether the value is rational, irrational, or two labels for one point."],
    polynomial: ["Predict where the zeros should appear.", "Move coefficient and root gap, then check x-intercepts.", "Explain how factor form and graph shape changed together."],
    coordinate: ["Predict the quadrant from the signs.", "Move x and y, then check horizontal and vertical traces.", "Explain distance, midpoint, or slope from the same point movement."],
    "linear-equation": ["Predict whether the line will rise or fall.", "Change slope and intercept separately.", "Explain why every point on the line satisfies the equation."],
    euclid: ["Predict where equal-radius arcs will meet.", "Move radius and separation, then check intersections.", "Explain the construction rule using equal lengths."],
    triangle: ["Predict how area changes when height changes.", "Move the vertex and check altitude and base.", "Explain the invariant angle sum."],
    quadrilateral: ["Predict the family from side and diagonal behavior.", "Skew the shape and check area or diagonal cues.", "Explain what distinguishes rectangle, rhombus, trapezium, and parallelogram."],
    circle: ["Predict arc and sector size from angle.", "Change radius and angle, then check tangent, chord, and radius relationships.", "Explain why radius controls every circular measure."],
    statistics: ["Predict how an outlier moves mean.", "Adjust the selected value and check the balance line.", "Explain which statistic best represents the data."],
    relations: ["Predict if the mapping is a function.", "Shift outputs and check one-output-per-input.", "Explain domain, range, and broken function rules."],
    matrix: ["Predict stretch, shear, or flip.", "Change scale or shear and check transformed area.", "Explain determinant as area scale."],
    calculus: ["Predict the local slope or accumulated area.", "Move point or gap and check the limiting visual.", "Explain rate or accumulation in words."],
    vector: ["Predict horizontal and vertical components.", "Move magnitude and direction and check projections.", "Explain resultant direction from components."],
    measurement: ["Predict which measure grows fastest.", "Change one dimension and check area or volume.", "Explain units: length, square units, cubic units."],
    pattern: ["Predict the next term.", "Change growth and check visible term structure.", "Explain the rule using term number."],
    generic: ["Predict the visible change.", "Move one control and check the model.", "Explain the invariant."],
  };
  return steps[kind];
}

function unitOnlyToolText(kind: SyllabusUnitKind) {
  const text: Record<SyllabusUnitKind, string> = {
    "real-numbers": "Number-line tools only: marker, interval, rational and irrational position, and zoom.",
    polynomial: "Polynomial tools only: roots, intercepts, coefficient movement, factor and graph link.",
    coordinate: "Coordinate tools only: point movement, traces, distance, midpoint, and slope.",
    "linear-equation": "Linear-equation tools only: slope, intercept, table-to-line, and solution points.",
    euclid: "Construction tools only: equal arcs, segment copy, bisectors, and exact intersection logic.",
    triangle: "Triangle tools only: vertex drag, altitude, area, angle sum, congruence and similarity cues.",
    quadrilateral: "Quadrilateral tools only: family rules, diagonals, parallel sides, area, and skew.",
    circle: "Circle tools only: radius, diameter, arc, sector, chord, tangent, and circumference.",
    statistics: "Statistics tools only: bars, mean, median, spread, outliers, and interpretation.",
    relations: "Relations tools only: mapping, domain, range, function test, and machine view.",
    matrix: "Matrix tools only: grid transform, determinant area, shear, scale, and row-column structure.",
    calculus: "Calculus tools only: secant, tangent, rate, accumulated area, and limiting motion.",
    vector: "Vector tools only: magnitude, direction, components, resultant, and projections.",
    measurement: "Measurement tools only: perimeter, area, surface area, volume, and unit conversion.",
    pattern: "Pattern tools only: term growth, sequence rule, partial sums, and comparison.",
    generic: "This unit uses only its own formula, model, examples, and checks.",
  };
  return text[kind];
}

function resourceLinksForUnit(unit: SyllabusUnitConcept) {
  if (unit.kind === "circle") return [{ label: "Circle Shape Explorer", to: "/shapes?shape=circle" }];
  if (unit.kind === "triangle") return [{ label: "Triangle Shape Explorer", to: "/shapes?shape=triangle" }];
  if (unit.kind === "quadrilateral") return [{ label: "Parallelogram Shape Explorer", to: "/shapes?shape=parallelogram" }];
  if (unit.kind === "measurement") return [{ label: "3D Shapes Explorer", to: "/shapes?shape=cuboid" }];
  if (unit.kind === "coordinate") return [{ label: "Geometry Coordinate Lab", to: "/geometry/coordinate-geometry" }];
  if (unit.kind === "polynomial") return [{ label: "Polynomial Graph Workspace", to: "/workspace?template=polynomials" }];
  if (unit.kind === "linear-equation") return [{ label: "Linear Equation Workspace", to: "/workspace?template=linear-equations" }];
  if (unit.kind === "vector") return [{ label: "3D Workspace", to: "/workspace?mode=3d" }];
  return [];
}
