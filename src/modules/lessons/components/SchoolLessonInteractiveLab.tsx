import { CheckCircle2, Gauge, Lightbulb, RotateCcw, SlidersHorizontal, Target } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import MathExpression from "../../../components/ui/MathExpression";
import VisualizationTools from "../../../components/ui/VisualizationTools";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { RepresentationType } from "../strengthening/strengthenedLessonSchema";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import SchoolProofMiniTool, { hasSchoolProofMiniTool } from "./SchoolProofMiniTool";

type LabModel = {
  family: "algebra" | "calculus" | "geometry" | "probability" | "statistics" | "trigonometry" | "vectors" | "number";
  representation: RepresentationType;
  title: string;
  formula: string;
  formulaNote: string;
  controlA: string;
  controlB: string;
  outputLabel: string;
  outputValue: string;
  secondaryOutput: string;
  visualLabel: string;
  challenge: string;
  expected: string;
  misconception: string;
  teacherMove: string;
  story: string;
  visualPurpose: string;
};

export default function SchoolLessonInteractiveLab({ lesson }: { lesson: SchoolSyllabusLesson }) {
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [showReason, setShowReason] = useState(false);
  const visualRef = useRef<HTMLElement>(null);
  const model = useMemo(() => createLabModel(lesson, a, b), [lesson, a, b]);

  if (hasSchoolProofMiniTool(lesson)) return <SchoolProofMiniTool lesson={lesson} />;

  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75" aria-label="Interactive lesson lab">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300"><SlidersHorizontal className="h-4 w-4" />Interactive lab</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{model.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{model.story}</p>
        </div>
        <button type="button" className="action-secondary" onClick={() => { setA(4); setB(3); setShowReason(false); }}><RotateCcw className="h-4 w-4" />Reset lab</button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.25fr)]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <Slider label={model.controlA} value={a} min={1} max={10} onChange={setA} />
          <Slider label={model.controlB} value={b} min={1} max={10} onChange={setB} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Metric label={model.outputLabel} value={model.outputValue} />
            <Metric label="Linked observation" value={model.secondaryOutput} />
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-white p-3 dark:border-cyan-300/20 dark:bg-slate-950/70">
            <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">Formula link</p>
            <div className="mt-2 overflow-x-auto rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/10"><MathExpression value={model.formula} /></div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{model.formulaNote}</p>
          </div>
        </div>

        <div className="space-y-3">
          <section ref={visualRef} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase text-slate-700 dark:text-slate-200"><Gauge className="h-4 w-4 text-cyan-600" />{model.visualLabel}</h3>
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{lesson.metadata.lessonType}</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-500 dark:text-slate-300">{model.visualPurpose}</p>
            <VisualizationTools title={`${lesson.title} ${model.visualLabel}`} targetRef={visualRef}>
              <ConceptVisual model={model} a={a} b={b} />
            </VisualizationTools>
          </section>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Lightbulb className="h-4 w-4" />Common mistake</h3>
              <p className="mt-2 text-sm font-semibold leading-6">{model.misconception}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase"><Target className="h-4 w-4" />Board-style check</h3>
              <p className="mt-2 text-sm font-semibold leading-6">{model.challenge}</p>
              <button type="button" className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-500" onClick={() => setShowReason((value) => !value)}>
                <CheckCircle2 className="h-4 w-4" />{showReason ? "Hide answer" : "Show answer"}
              </button>
              {showReason ? <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm font-black text-emerald-900 dark:bg-slate-950/40 dark:text-emerald-100">{model.expected}</p> : null}
            </div>
          </div>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">{model.teacherMove}</p>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-xs font-black uppercase text-slate-600 dark:text-slate-300"><span>{label}</span><span>{value}</span></span>
      <input className="mt-2 w-full accent-cyan-600" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function ConceptVisual({ model, a, b }: { model: LabModel; a: number; b: number }) {
  const label = `${displayRepresentationLabel(model)} visual model`;
  return (
    <div className="mt-4 space-y-3">
      <div className="min-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5" aria-label={label}>
        <VisualScene model={model} a={a} b={b} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <VisualChip label="First value" value={String(a)} />
        <VisualChip label="Second value" value={String(b)} />
        <VisualChip label="Model type" value={model.representation.replace(/_/g, " ")} />
      </div>
    </div>
  );
}

function VisualScene({ model, a, b }: { model: LabModel; a: number; b: number }) {
  if (model.representation === "number_line") return <NumberLineScene a={a} b={b} />;
  if (model.representation === "area_model" || model.representation === "bar_model") return <AreaBarScene a={a} b={b} mode={model.representation} />;
  if (model.representation === "coordinate_graph" || model.representation === "function_graph") return <FunctionGraphScene a={a} b={b} />;
  if (model.representation === "unit_circle") return <UnitCircleScene a={a} />;
  if (model.representation === "geometric_construction" || model.representation === "proof_diagram" || model.representation === "transformation_animation") return <GeometryConstructionScene a={a} b={b} />;
  if (model.representation === "vector_diagram") return <VectorScene a={a} b={b} />;
  if (model.representation === "matrix_grid" || model.representation === "spreadsheet_grid" || model.representation === "text_table") return <GridScene a={a} b={b} kind={model.representation} />;
  if (model.representation === "tree_diagram" || model.representation === "venn_diagram" || model.representation === "probability_simulation") return <ProbabilityScene a={a} b={b} kind={model.representation} />;
  if (model.representation === "distribution_plot" || model.representation === "sampling_animation") return <DistributionScene a={a} b={b} />;
  if (model.representation === "solid_3d" || model.representation === "cross_section" || model.representation === "surface_plot") return <SolidScene a={a} b={b} kind={model.representation} />;
  if (model.representation === "slope_field") return <SlopeFieldScene a={a} b={b} />;
  if (model.representation === "riemann_sum") return <RiemannScene a={a} b={b} />;
  if (model.representation === "financial_timeline") return <TimelineScene a={a} b={b} />;
  if (model.representation === "symbolic_steps" || model.representation === "calculator_trace") return <SymbolicScene a={a} b={b} />;
  return <FunctionGraphScene a={a} b={b} />;
}

function displayRepresentationLabel(model: LabModel) {
  if (/place value/i.test(model.title)) return "place value chart";
  return model.representation.replace(/_/g, " ");
}

function NumberLineScene({ a, b }: { a: number; b: number }) {
  const xA = 40 + a * 26;
  const xB = 40 + b * 26;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><line x1="34" y1="116" x2="306" y2="116" stroke="#64748b" strokeWidth="4" />{Array.from({ length: 11 }, (_, index) => <g key={index}><line x1={40 + index * 26} y1="104" x2={40 + index * 26} y2="128" stroke="#94a3b8" /><text x={35 + index * 26} y="150" className="text-[10px] font-bold fill-slate-500">{index}</text></g>)}<path d={`M${xA} 92 C ${Math.min(xA, xB) + 40} 38, ${Math.max(xA, xB) - 40} 38, ${xB} 92`} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" /><circle cx={xA} cy="116" r="11" fill="#f59e0b" /><circle cx={xB} cy="116" r="11" fill="#8b5cf6" /><text x="42" y="32" className="text-sm font-black fill-slate-700">distance and order stay visible</text></svg>;
}

function AreaBarScene({ a, b, mode }: { a: number; b: number; mode: "area_model" | "bar_model" }) {
  const cells = Math.min(60, a * b);
  return <svg viewBox="0 0 340 220" className="h-64 w-full">{mode === "area_model" ? Array.from({ length: cells }, (_, index) => <rect key={index} x={34 + (index % a) * 24} y={34 + Math.floor(index / a) * 18} width="19" height="14" rx="3" fill={index < a * b ? "#06b6d4" : "#cbd5e1"} opacity="0.82" />) : <><rect x="38" y="54" width={a * 24} height="42" rx="10" fill="#06b6d4" opacity="0.75" /><rect x="38" y="124" width={b * 24} height="42" rx="10" fill="#f59e0b" opacity="0.75" /></>}<text x="36" y="202" className="text-sm font-black fill-slate-700">{mode === "area_model" ? `${a} by ${b} array` : `${a}:${b} comparison`}</text></svg>;
}

function FunctionGraphScene({ a, b }: { a: number; b: number }) {
  const points = Array.from({ length: 70 }, (_, index) => {
    const x = -5 + (index / 69) * 10;
    const y = 0.16 * a * x * x - b;
    return `${34 + index * 4},${116 - y * 12}`;
  }).join(" ");
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><line x1="34" y1="116" x2="306" y2="116" stroke="#94a3b8" /><line x1="170" y1="22" x2="170" y2="194" stroke="#94a3b8" /><polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="170" cy={116 + b * 12} r="8" fill="#f59e0b" /><text x="36" y="32" className="text-sm font-black fill-slate-700">live curve: output changes with the rule</text></svg>;
}

function UnitCircleScene({ a }: { a: number }) {
  const angle = a * 9 * Math.PI / 180;
  const cx = 170;
  const cy = 110;
  const r = 72;
  const px = cx + Math.cos(angle) * r;
  const py = cy - Math.sin(angle) * r;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><circle cx={cx} cy={cy} r={r} fill="#e0f2fe" stroke="#06b6d4" strokeWidth="4" /><line x1="70" y1={cy} x2="270" y2={cy} stroke="#94a3b8" /><line x1={cx} y1="20" x2={cx} y2="200" stroke="#94a3b8" /><line x1={cx} y1={cy} x2={px} y2={py} stroke="#8b5cf6" strokeWidth="5" /><line x1={px} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 5" /><circle cx={px} cy={py} r="9" fill="#8b5cf6" /><text x="38" y="30" className="text-sm font-black fill-slate-700">angle, sine height, cosine width</text></svg>;
}

function GeometryConstructionScene({ a, b }: { a: number; b: number }) {
  const ax = 72;
  const ay = 166;
  const bx = 250;
  const by = 166;
  const cx = 84 + a * 14;
  const cy = 168 - b * 13;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#22d3ee33" stroke="#06b6d4" strokeWidth="5" /><circle cx={ax} cy={ay} r="44" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" /><circle cx={bx} cy={by} r="44" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 5" /><line x1={cx} y1={cy} x2={cx} y2={ay} stroke="#ef4444" strokeWidth="4" /><text x="36" y="32" className="text-sm font-black fill-slate-700">construction lines reveal the invariant</text></svg>;
}

function VectorScene({ a, b }: { a: number; b: number }) {
  const sx = 80;
  const sy = 166;
  const ex = sx + a * 20;
  const ey = sy - b * 16;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><defs><marker id="school-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#06b6d4" /></marker></defs><line x1="40" y1="166" x2="306" y2="166" stroke="#94a3b8" /><line x1="80" y1="30" x2="80" y2="194" stroke="#94a3b8" /><line x1={sx} y1={sy} x2={ex} y2={sy} stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 5" /><line x1={ex} y1={sy} x2={ex} y2={ey} stroke="#8b5cf6" strokeWidth="4" strokeDasharray="6 5" /><line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#06b6d4" strokeWidth="6" markerEnd="url(#school-arrow)" /><text x="36" y="28" className="text-sm font-black fill-slate-700">components build the resultant vector</text></svg>;
}

function GridScene({ a, b, kind }: { a: number; b: number; kind: RepresentationType }) {
  if (kind === "text_table") return <PlaceValueChartScene a={a} b={b} />;
  return <svg viewBox="0 0 340 220" className="h-64 w-full">{Array.from({ length: 16 }, (_, index) => <rect key={index} x={54 + (index % 4) * 54} y={38 + Math.floor(index / 4) * 36} width="42" height="26" rx="6" fill={(index + a + b) % 3 === 0 ? "#06b6d4" : "#e2e8f0"} opacity="0.9" />)}<path d="M54 182 H270" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" /><text x="54" y="202" className="text-sm font-black fill-slate-700">{kind.replace(/_/g, " ")} links cells to rules</text></svg>;
}

function PlaceValueChartScene({ a, b }: { a: number; b: number }) {
  const digits = [a, b, 8, 2];
  const places = ["thousands", "hundreds", "tens", "ones"];
  return (
    <svg viewBox="0 0 340 220" className="h-64 w-full" role="img" aria-label="place value chart visual model">
      {places.map((place, index) => (
        <g key={place}>
          <rect x={34 + index * 70} y="44" width="58" height="94" rx="10" fill={index % 2 ? "#e0f2fe" : "#ede9fe"} stroke={index % 2 ? "#06b6d4" : "#8b5cf6"} strokeWidth="3" />
          <text x={44 + index * 70} y="66" className="text-[9px] font-black uppercase fill-slate-600">{place}</text>
          <text x={54 + index * 70} y="112" className="text-3xl font-black fill-slate-900">{digits[index]}</text>
          <text x={45 + index * 70} y="130" className="text-[10px] font-bold fill-slate-500">x {10 ** (3 - index)}</text>
        </g>
      ))}
      <path d="M48 164 H286" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <text x="48" y="190" className="text-sm font-black fill-slate-700">a digit's value depends on its column</text>
    </svg>
  );
}

function ProbabilityScene({ a, b, kind }: { a: number; b: number; kind: RepresentationType }) {
  if (kind === "tree_diagram") return <svg viewBox="0 0 340 220" className="h-64 w-full"><circle cx="58" cy="108" r="10" fill="#0f172a" /><line x1="68" y1="108" x2="160" y2="62" stroke="#06b6d4" strokeWidth="4" /><line x1="68" y1="108" x2="160" y2="154" stroke="#f59e0b" strokeWidth="4" /><line x1="170" y1="62" x2="270" y2="38" stroke="#06b6d4" strokeWidth="4" /><line x1="170" y1="62" x2="270" y2="86" stroke="#8b5cf6" strokeWidth="4" /><line x1="170" y1="154" x2="270" y2="132" stroke="#06b6d4" strokeWidth="4" /><line x1="170" y1="154" x2="270" y2="178" stroke="#8b5cf6" strokeWidth="4" /><text x="38" y="206" className="text-sm font-black fill-slate-700">branches multiply along paths</text></svg>;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><circle cx="142" cy="110" r={44 + a * 3} fill="#06b6d455" stroke="#06b6d4" strokeWidth="4" /><circle cx="200" cy="110" r={44 + b * 3} fill="#f59e0b55" stroke="#f59e0b" strokeWidth="4" /><text x="120" y="114" className="text-sm font-black fill-slate-700">A</text><text x="214" y="114" className="text-sm font-black fill-slate-700">B</text><text x="64" y="202" className="text-sm font-black fill-slate-700">overlap and complement stay visible</text></svg>;
}

function DistributionScene({ a, b }: { a: number; b: number }) {
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><line x1="36" y1="178" x2="304" y2="178" stroke="#94a3b8" />{Array.from({ length: 18 }, (_, index) => { const dx = index - 9; const h = Math.max(10, 92 * Math.exp(-(dx * dx) / (a + b + 8))); return <rect key={index} x={42 + index * 14} y={178 - h} width="10" height={h} rx="5" fill={index % 2 ? "#06b6d4" : "#8b5cf6"} />; })}<path d="M42 172 C 92 86, 140 42, 174 86 S 242 176, 298 78" fill="none" stroke="#f59e0b" strokeWidth="4" /><text x="44" y="28" className="text-sm font-black fill-slate-700">shape, centre, spread, and sample wobble</text></svg>;
}

function SolidScene({ a, b, kind }: { a: number; b: number; kind: RepresentationType }) {
  const w = 70 + a * 7;
  const h = 54 + b * 7;
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><polygon points={`96,78 ${96 + w},78 ${218 + w / 2},42 148,42`} fill="#38bdf8" opacity="0.45" stroke="#06b6d4" strokeWidth="4" /><polygon points={`96,78 ${96 + w},78 ${96 + w},${78 + h} 96,${78 + h}`} fill="#06b6d4" opacity="0.3" stroke="#06b6d4" strokeWidth="4" /><polygon points={`${96 + w},78 ${218 + w / 2},42 ${218 + w / 2},${42 + h} ${96 + w},${78 + h}`} fill="#8b5cf6" opacity="0.25" stroke="#8b5cf6" strokeWidth="4" /><ellipse cx={152 + w / 2} cy={90 + h / 2} rx={40 + a * 2} ry={10 + b} fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" /><text x="42" y="204" className="text-sm font-black fill-slate-700">{kind.replace(/_/g, " ")} with cross-section cue</text></svg>;
}

function SlopeFieldScene({ a, b }: { a: number; b: number }) {
  return <svg viewBox="0 0 340 220" className="h-64 w-full">{Array.from({ length: 63 }, (_, index) => { const x = 44 + (index % 9) * 30; const y = 34 + Math.floor(index / 9) * 26; const tilt = ((index % 9) - 4 + b) / (a + 5); return <line key={index} x1={x - 8} y1={y + tilt * 8} x2={x + 8} y2={y - tilt * 8} stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />; })}<path d="M42 166 C 90 140, 128 88, 184 98 S 252 142, 298 58" fill="none" stroke="#f59e0b" strokeWidth="5" /><text x="42" y="204" className="text-sm font-black fill-slate-700">field slopes guide the solution path</text></svg>;
}

function RiemannScene({ a, b }: { a: number; b: number }) {
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><line x1="34" y1="178" x2="306" y2="178" stroke="#94a3b8" />{Array.from({ length: a + 3 }, (_, index) => { const x = 42 + index * (230 / (a + 3)); const h = 28 + ((index + b) ** 1.35); return <rect key={index} x={x} y={178 - h} width={210 / (a + 3)} height={h} fill="#06b6d455" stroke="#06b6d4" />; })}<path d="M42 166 C 92 126, 128 118, 178 84 S 250 46, 294 82" fill="none" stroke="#8b5cf6" strokeWidth="5" /><text x="42" y="204" className="text-sm font-black fill-slate-700">rectangles approximate accumulated area</text></svg>;
}

function TimelineScene({ a, b }: { a: number; b: number }) {
  return <svg viewBox="0 0 340 220" className="h-64 w-full"><line x1="44" y1="112" x2="296" y2="112" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />{Array.from({ length: 5 }, (_, index) => <g key={index}><circle cx={54 + index * 58} cy="112" r={10 + index * 2} fill={index <= b / 2 ? "#f59e0b" : "#e2e8f0"} /><text x={48 + index * 58} y="148" className="text-[10px] font-bold fill-slate-600">Y{index}</text></g>)}<path d={`M54 78 C 112 ${62 - a}, 180 ${52 + b}, 286 72`} fill="none" stroke="#8b5cf6" strokeWidth="4" /><text x="44" y="202" className="text-sm font-black fill-slate-700">money grows across time checkpoints</text></svg>;
}

function SymbolicScene({ a, b }: { a: number; b: number }) {
  const rows = [`start: ${a}x + ${b}`, `substitute x=2`, `${a}*2 + ${b}`, `result = ${a * 2 + b}`];
  return <div className="grid min-h-64 content-center gap-2 p-5">{rows.map((row, index) => <div key={row} className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm font-black text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"><span className="mr-3 text-cyan-600">0{index + 1}</span>{row}</div>)}</div>;
}

function VisualChip({ label, value }: { label: string; value: string }) {
  return <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{label}: {value}</span>;
}

function createLabModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
  const representation = strengthened?.representations[0]?.type;
  const purpose = strengthened?.representations[0]?.learningPurpose;
  const text = `${lesson.title} ${lesson.metadata.conceptFamily}`.toLowerCase();
  if (/probability|bayes|event|random|distribution|permutation|combination/.test(text)) return withRepresentation(probabilityModel(lesson, a, b), representation, purpose);
  if (/calculus|limit|derivative|integral|continuity|rolle|mean value|differential/.test(text)) return withRepresentation(calculusModel(lesson, a, b), representation, purpose);
  if (/trig|sine|cosine|tangent|angle|circle/.test(text)) return withRepresentation(trigonometryModel(lesson, a, b), representation, purpose);
  if (/vector|matrix|determinant|direction cosine|3d|plane|line/.test(text)) return withRepresentation(vectorModel(lesson, a, b), representation, purpose);
  if (/mean|median|mode|quartile|statistics|data|histogram|variance/.test(text)) return withRepresentation(statisticsModel(lesson, a, b), representation, purpose);
  if (/geometry|euclid|triangle|congruence|similar|construction|quadrilateral|area|volume|mensuration/.test(text)) return withRepresentation(geometryModel(lesson, a, b), representation, purpose);
  if (/algebra|equation|polynomial|identity|function|sequence|series|linear|quadratic/.test(text)) return withRepresentation(algebraModel(lesson, a, b), representation, purpose);
  return withRepresentation(numberModel(lesson, a, b), representation, purpose);
}

function probabilityModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const total = a + b + 2;
  const probability = a / total;
  return baseModel(lesson, "probability", "Probability balance board", "P(A)=\\frac{favourable}{total}", "Move favourable cases and total cases to see probability as a ratio.", "Favourable cases", "Other cases", "Probability", probability.toFixed(3), `Complement ${(1 - probability).toFixed(3)}`, "Sample-space bars", `Find P(A) when favourable=${a} and total=${total}.`, `P(A)=${a}/${total}=${probability.toFixed(3)}`, "Do not add probabilities unless the events are disjoint and the sample space is clear.");
}

function calculusModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const x = a;
  const h = b / 10;
  const slope = 2 * x + h;
  return baseModel(lesson, "calculus", "Limit and rate explorer", "\\frac{f(x+h)-f(x)}{h}", "Shrink h to watch a secant slope approach the tangent slope.", "Point x", "Step h x10", "Secant slope", slope.toFixed(2), `Target derivative ${(2 * x).toFixed(2)}`, "Changing-slope columns", `For f(x)=x^2, estimate the slope at x=${x} with h=${h.toFixed(1)}.`, `Secant slope = ${slope.toFixed(2)}; as h approaches 0, it approaches ${(2 * x).toFixed(2)}.`, "Do not treat one large secant step as the final derivative.");
}

function geometryModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const area = (a * b) / 2;
  return baseModel(lesson, "geometry", "Invariant geometry studio", "A=\\frac{1}{2}bh", "Change base and height while the relationship stays visible.", "Base", "Height", "Triangle area", area.toFixed(1), `Rectangle area ${a * b}`, "Area comparison model", `Find the area of a triangle with base ${a} and height ${b}.`, `Area = 1/2 x ${a} x ${b} = ${area.toFixed(1)} square units.`, "Do not use a slant side as height; height must be perpendicular to the base.");
}

function algebraModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const output = a * 2 + b;
  return baseModel(lesson, "algebra", "Function machine", "f(x)=mx+c", "Adjust the rule and inspect how each input maps to an output.", "Multiplier m", "Constant c", "f(2)", String(output), `Rate of change ${a}`, "Input-output table", `For f(x)=${a}x+${b}, find f(2).`, `f(2)=${a} x 2 + ${b} = ${output}.`, "Do not combine unlike terms; substitute first, then simplify.");
}

function trigonometryModel(lesson: SchoolSyllabusLesson, a: number, _b: number): LabModel {
  const angle = a * 9;
  const sine = Math.sin((angle * Math.PI) / 180);
  return baseModel(lesson, "trigonometry", "Angle ratio explorer", "\\sin\\theta=\\frac{opposite}{hypotenuse}", "Move the angle and compare the ratio with the visual height.", "Angle step", "Scale", "sin(theta)", sine.toFixed(3), `Angle ${angle} deg`, "Ratio bars", `Estimate sin(${angle} deg).`, `sin(${angle} deg) is about ${sine.toFixed(3)}.`, "Do not confuse sine with cosine; sine tracks the vertical/opposite side.");
}

function vectorModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const magnitude = Math.hypot(a, b);
  return baseModel(lesson, "vectors", "Vector component lab", "\\|v\\|=\\sqrt{x^2+y^2}", "Change components and watch magnitude and direction update together.", "x component", "y component", "Magnitude", magnitude.toFixed(2), `Dot with (1,1): ${a + b}`, "Component bars", `Find the magnitude of vector (${a}, ${b}).`, `Magnitude = sqrt(${a}^2 + ${b}^2) = ${magnitude.toFixed(2)}.`, "Do not add components directly when the question asks for length.");
}

function statisticsModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const values = [a, b, a + b];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return baseModel(lesson, "statistics", "Data balance lab", "\\bar{x}=\\frac{\\sum x}{n}", "Move data values and see the average as a balance point.", "Data value A", "Data value B", "Mean", mean.toFixed(2), `Range ${Math.max(...values) - Math.min(...values)}`, "Distribution bars", `Find the mean of ${values.join(", ")}.`, `Mean = (${values.join(" + ")})/3 = ${mean.toFixed(2)}.`, "Do not read the tallest bar as the mean; mean depends on all values.");
}

function numberModel(lesson: SchoolSyllabusLesson, a: number, b: number): LabModel {
  const ratio = a / b;
  return baseModel(lesson, "number", "Number relationship lab", "\\frac{a}{b}=a\\div b", "Move the two quantities and read the relationship as a ratio, decimal, and comparison.", "Quantity a", "Quantity b", "a divided by b", ratio.toFixed(3), `Difference ${a - b}`, "Ratio bars", `Write ${a}:${b} as a decimal.`, `${a}:${b} = ${a}/${b} = ${ratio.toFixed(3)}.`, "Do not compare only by subtraction when the concept asks for a multiplicative relationship.");
}

function baseModel(
  lesson: SchoolSyllabusLesson,
  family: LabModel["family"],
  title: string,
  formula: string,
  formulaNote: string,
  controlA: string,
  controlB: string,
  outputLabel: string,
  outputValue: string,
  secondaryOutput: string,
  visualLabel: string,
  challenge: string,
  expected: string,
  misconception: string,
): LabModel {
  const representation = defaultRepresentationFor(family);
  return {
    family,
    representation,
    title,
    formula,
    formulaNote,
    controlA,
    controlB,
    outputLabel,
    outputValue,
    secondaryOutput,
    visualLabel,
    challenge,
    expected,
    misconception,
    teacherMove: `Best classroom move: ask learners to predict the change, move exactly one control, then explain ${lesson.title} using the displayed formula and the ${visualLabel.toLowerCase()}.`,
    story: `${lesson.title} becomes easier when learners can move inputs, see the representation update, and connect the result to the syllabus term used in ${lesson.metadata.academicLevel.replace("_", " ")}.`,
    visualPurpose: `Show the exact ${representation.replace(/_/g, " ")} structure for ${lesson.title}.`,
  };
}

function withRepresentation(model: LabModel, representation?: RepresentationType, purpose?: string): LabModel {
  if (!representation) return model;
  return {
    ...model,
    representation,
    visualLabel: representation.replace(/_/g, " "),
    visualPurpose: purpose ?? `Show the exact ${representation.replace(/_/g, " ")} structure for ${model.title}.`,
  };
}

function defaultRepresentationFor(family: LabModel["family"]): RepresentationType {
  if (family === "calculus") return "function_graph";
  if (family === "geometry") return "geometric_construction";
  if (family === "probability") return "venn_diagram";
  if (family === "statistics") return "distribution_plot";
  if (family === "trigonometry") return "unit_circle";
  if (family === "vectors") return "vector_diagram";
  if (family === "algebra") return "function_graph";
  return "number_line";
}
