import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import VisualLearningPanel from "../components/ui/VisualLearningPanel";
import { getTrigonometryConcept, trigonometryConcepts, type TrigonometryConcept, type TrigonometryVisualType } from "../data/trigonometryConcepts";
import { degreesToRadians, roundTo } from "../utils/math";
import EclipseTrigonometryVisualizer from "../visualizations/trigonometry/EclipseTrigonometryVisualizer";
import SineCosineWaveVisualizer from "../visualizations/trigonometry/SineCosineWaveVisualizer";
import TrigonometryExperimentCatalog from "../visualizations/trigonometry/TrigonometryExperimentCatalog";
import UnitCircleVisualizer from "../visualizations/trigonometry/UnitCircleVisualizer";
import WaveApplications from "../visualizations/trigonometry/WaveApplications";

export default function TrigonometryConceptPage() {
  const { conceptId } = useParams();
  const concept = getTrigonometryConcept(conceptId);
  if (!concept) return <Navigate to="/trigonometry" replace />;
  return <TrigonometryConceptDetail concept={concept} />;
}

function TrigonometryConceptDetail({ concept }: { concept: TrigonometryConcept }) {
  const [a, setA] = useState(concept.defaultA);
  const [b, setB] = useState(concept.defaultB);

  useEffect(() => {
    setA(concept.defaultA);
    setB(concept.defaultB);
  }, [concept]);

  const metrics = useMemo(() => trigMetrics(concept.visual, a, b), [a, b, concept.visual]);
  const related = trigonometryConcepts.filter((item) => item.category === concept.category && item.id !== concept.id).slice(0, 4);
  const fullPage = fullVisualizer(concept.visual);

  return (
    <div className="space-y-6">
      <Link to="/trigonometry" className="action-secondary w-fit">
        <ArrowLeft className="h-4 w-4" />
        Trigonometry index
      </Link>
      <TopicHeader title={concept.title} subtitle={concept.summary} difficulty={concept.category} estimatedMinutes={12} />

      {fullPage ? (
        fullPage
      ) : (
        <SectionCard title="Interactive Concept Lab" description="Move the controls and connect the formula to the diagram.">
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-4">
              <FormulaBlock title="Core Formula" formula={concept.formula} explanation={concept.summary} />
              <SliderControl label={concept.sliderA} value={a} min={concept.minA} max={concept.maxA} step={concept.stepA} onChange={setA} />
              <SliderControl label={concept.sliderB} value={b} min={concept.minB} max={concept.maxB} step={concept.stepB} onChange={setB} />
              <div className="grid grid-cols-2 gap-2">
                {metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
                <TrigConceptSvg visual={concept.visual} a={a} b={b} title={concept.title} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Info label="Concept" value={concept.summary} />
                <Info label="What changes" value={changeText(concept.visual, concept.sliderA, concept.sliderB)} />
                <Info label="Used in" value={concept.use} />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      <VisualLearningPanel
        concept={concept.summary}
        formula={concept.formula}
        changes={changeText(concept.visual, concept.sliderA, concept.sliderB)}
        realWorldUse={concept.use}
        steps={learningSteps(concept, a, b)}
        tasks={concept.tasks}
      />

      {related.length > 0 && (
        <SectionCard title={`More ${concept.category} Pages`}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <Link key={item.id} to={`/trigonometry/${item.id}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{item.category}</p>
                <p className="mt-2 font-bold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
              </Link>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function fullVisualizer(visual: TrigonometryVisualType) {
  if (visual === "unit-circle") return <UnitCircleVisualizer />;
  if (visual === "sine-cosine-wave") return <SineCosineWaveVisualizer />;
  if (visual === "eclipse") return <EclipseTrigonometryVisualizer />;
  if (visual === "wave-applications") return <WaveApplications />;
  if (visual === "experiment-catalog") return <TrigonometryExperimentCatalog />;
  return null;
}

function TrigConceptSvg({ visual, a, b, title }: { visual: TrigonometryVisualType; a: number; b: number; title: string }) {
  return (
    <svg viewBox="0 0 720 440" className="h-[320px] w-full sm:h-[440px]">
      <title>{title}</title>
      <rect width="720" height="440" rx="24" fill="#f8fafc" />
      <Grid />
      {renderVisual(visual, a, b)}
    </svg>
  );
}

function renderVisual(visual: TrigonometryVisualType, a: number, b: number) {
  if (visual === "right-triangle" || visual === "ratio" || visual === "height-distance") return <TriangleTrig angle={a} size={b} visual={visual} />;
  if (visual === "angle-measure" || visual === "identity" || visual === "polar") return <CircleTrig angle={a} radius={b} visual={visual} />;
  if (visual === "inverse") return <InverseTrig ratio={a} scale={b} />;
  if (visual === "law") return <TriangleLaw a={a} b={b} />;
  if (visual === "bearing") return <BearingVisual angle={a} distance={b} />;
  return <WaveTransform a={a} b={b} visual={visual} />;
}

function TriangleTrig({ angle, size, visual }: { angle: number; size: number; visual: TrigonometryVisualType }) {
  const rad = degreesToRadians(Math.max(5, Math.min(85, angle)));
  const adj = size * Math.cos(rad);
  const opp = size * Math.sin(rad);
  const x = 170, y = 330;
  return (
    <g>
      <polygon points={`${x},${y} ${x + adj},${y} ${x + adj},${y - opp}`} fill="#22d3ee" opacity="0.22" stroke="#06b6d4" strokeWidth="5" />
      <path d={`M${x + 38},${y} A38,38 0 0 0 ${x + 38 * Math.cos(rad)},${y - 38 * Math.sin(rad)}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <Label x={x + adj / 2} y={y + 28} text={visual === "height-distance" ? "distance" : "adjacent"} />
      <Label x={x + adj + 22} y={y - opp / 2} text={visual === "height-distance" ? "height" : "opposite"} />
      <Label x={x + adj / 2 - 20} y={y - opp / 2 - 20} text="hypotenuse" />
      <Label x={x + 45} y={y - 14} text={`${roundTo(angle, 1)} deg`} />
    </g>
  );
}

function CircleTrig({ angle, radius, visual }: { angle: number; radius: number; visual: TrigonometryVisualType }) {
  const r = visual === "identity" ? 120 : radius;
  const cx = 360, cy = 220;
  const rad = degreesToRadians(angle);
  const x = cx + r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.12" stroke="#06b6d4" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#f59e0b" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={x} y2={cy} stroke="#8b5cf6" strokeWidth="4" />
      <line x1={x} y1={cy} x2={x} y2={y} stroke="#10b981" strokeWidth="4" />
      <Point x={x} y={y} label="P" />
      <Label x={cx + 18} y={cy - 12} text={`${roundTo(angle, 1)} deg`} />
      <Label x={x - 70} y={cy + 28} text="cos theta" />
      <Label x={x + 18} y={(y + cy) / 2} text="sin theta" />
    </g>
  );
}

function WaveTransform({ a, b, visual }: { a: number; b: number; visual: TrigonometryVisualType }) {
  const amp = a;
  const freq = b;
  const phase = visual === "graph-transform" && Math.abs(a) > 10 ? degreesToRadians(a) : 0;
  const points = Array.from({ length: 240 }, (_, i) => {
    const x = 70 + i * 2.45;
    const t = (i / 240) * Math.PI * 4;
    const y = 220 - Math.sin(freq * t + phase) * amp * 34;
    return `${i ? "L" : "M"}${x},${y}`;
  }).join(" ");
  return <g><line x1="55" x2="665" y1="220" y2="220" stroke="#94a3b8" /><path d={points} fill="none" stroke="#06b6d4" strokeWidth="5" /><Label x="80" y="80" text={`A=${roundTo(amp, 2)}, f=${roundTo(freq, 2)}`} /></g>;
}

function InverseTrig({ ratio, scale }: { ratio: number; scale: number }) {
  const theta = Math.asin(Math.max(-1, Math.min(1, ratio)));
  return <TriangleTrig angle={theta * 180 / Math.PI} size={scale} visual="right-triangle" />;
}

function TriangleLaw({ a, b }: { a: number; b: number }) {
  const ax = 160, ay = 330, bx = 520, by = 330;
  const cx = 250 + b * Math.cos(degreesToRadians(a)), cy = 330 - b * Math.sin(degreesToRadians(a));
  return <g><polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#22d3ee" opacity="0.2" stroke="#06b6d4" strokeWidth="5" /><Point x={ax} y={ay} label="A" /><Point x={bx} y={by} label="B" /><Point x={cx} y={cy} label="C" /><Label x="280" y="360" text="solve sides and angles" /></g>;
}

function BearingVisual({ angle, distance }: { angle: number; distance: number }) {
  const cx = 360, cy = 230;
  const rad = degreesToRadians(90 - angle);
  const x = cx + distance * Math.cos(rad), y = cy - distance * Math.sin(rad);
  return <g><line x1={cx} y1="60" x2={cx} y2="390" stroke="#94a3b8" strokeWidth="3" /><Label x={cx + 12} y="80" text="N" /><line x1={cx} y1={cy} x2={x} y2={y} stroke="#06b6d4" strokeWidth="5" /><Point x={cx} y={cy} label="Start" /><Point x={x} y={y} label="End" /><Label x={x + 12} y={y - 12} text={`${roundTo(angle, 1)} deg bearing`} /></g>;
}

function Grid() {
  return <g opacity="0.55">{Array.from({ length: 15 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 46} y1="30" x2={40 + i * 46} y2="410" stroke="#e2e8f0" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="30" y1={40 + i * 45} x2="690" y2={40 + i * 45} stroke="#e2e8f0" />)}</g>;
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="8" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" /><Label x={x + 12} y={y - 10} text={label} /></g>;
}

function Label({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} fill="#0f172a" fontSize="16" fontWeight="800">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm leading-6">{value}</p></div>;
}

function trigMetrics(visual: TrigonometryVisualType, a: number, b: number) {
  const rad = degreesToRadians(a);
  if (visual === "inverse") {
    const clamped = Math.max(-1, Math.min(1, a));
    return [{ label: "theta", value: `${roundTo(Math.asin(clamped) * 180 / Math.PI, 2)} deg` }, { label: "ratio", value: `${roundTo(clamped, 3)}` }];
  }
  if (visual === "height-distance") return [{ label: "height", value: `${roundTo(b * Math.tan(rad), 2)}` }, { label: "tan", value: `${roundTo(Math.tan(rad), 3)}` }];
  return [{ label: "sin", value: `${roundTo(Math.sin(rad), 3)}` }, { label: "cos", value: `${roundTo(Math.cos(rad), 3)}` }, { label: "tan", value: `${roundTo(Math.tan(rad), 3)}` }, { label: "theta", value: `${roundTo(a, 2)} deg` }];
}

function changeText(visual: TrigonometryVisualType, sliderA: string, sliderB: string) {
  if (visual === "graph-transform") return `${sliderA} and ${sliderB} reshape the wave without changing the basic repeating pattern.`;
  if (visual === "height-distance") return `${sliderA} changes steepness; ${sliderB} changes the baseline measurement.`;
  return `${sliderA} changes the angle or input; ${sliderB} changes the scale or comparison value.`;
}

function learningSteps(concept: TrigonometryConcept, a: number, b: number) {
  return [
    `Start with ${concept.formula}.`,
    `Set ${concept.sliderA} to ${roundTo(a, 2)} and ${concept.sliderB} to ${roundTo(b, 2)}.`,
    "Read the visual measurement before calculating.",
    "Compare the diagram with the formula result.",
  ];
}
