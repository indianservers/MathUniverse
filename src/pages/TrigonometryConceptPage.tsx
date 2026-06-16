import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import FormulaBlock from "../components/ui/FormulaBlock";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import TopicTabs from "../components/ui/TopicTabs";
import VisualLearningPanel from "../components/ui/VisualLearningPanel";
import { getTrigonometryConcept, type TrigonometryConcept, type TrigonometryVisualType } from "../data/trigonometryConcepts";
import { degreesToRadians, roundTo } from "../utils/math";
import AngleSumDifferenceVisualizer, { type AngleSumDifferenceFormulaId } from "../visualizations/trigonometry/AngleSumDifferenceVisualizer";
import DoubleHalfAngleVisualizer, { type DoubleHalfFormulaId } from "../visualizations/trigonometry/DoubleHalfAngleVisualizer";
import EclipseTrigonometryVisualizer from "../visualizations/trigonometry/EclipseTrigonometryVisualizer";
import CoreIdentityProofVisualizer, { type CoreIdentityId } from "../visualizations/trigonometry/CoreIdentityProofVisualizer";
import InverseTrigVisualizer, { type InverseTrigId } from "../visualizations/trigonometry/InverseTrigVisualizer";
import TrigConcept3DView from "../visualizations/trigonometry/TrigConcept3DView";
import TrigGraphStudio, { type TrigGraphFunction } from "../visualizations/trigonometry/TrigGraphStudio";
import TrigPracticeChallengeSystem from "../visualizations/trigonometry/TrigPracticeChallengeSystem";
import TrigonometricFunctionsVisualizer from "../visualizations/trigonometry/TrigonometricFunctionsVisualizer";
import TrigonometryExperimentCatalog from "../visualizations/trigonometry/TrigonometryExperimentCatalog";
import TriangleCircleRatioVisualizer, { type TriangleCircleRatioFocus } from "../visualizations/trigonometry/TriangleCircleRatioVisualizer";
import UnitCircleMasterVisualizer, { type UnitCircleMasterFocus } from "../visualizations/trigonometry/UnitCircleMasterVisualizer";
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
  const shapeLinks = shapeLinksForConcept(concept);
  const fullPage = fullVisualizer(concept.visual);
  const unitCircleMasterFocus = unitCircleMasterFocusForConcept(concept.id);
  const triangleCircleFocus = triangleCircleRatioFocusForConcept(concept.id);
  const coreIdentityFocus = coreIdentityFocusForConcept(concept.id);
  const angleSumDifferenceFocus = angleSumDifferenceFocusForConcept(concept.id);
  const doubleHalfFocus = doubleHalfFocusForConcept(concept.id);
  const graphStudioFocus = graphStudioFocusForConcept(concept.id);
  const inverseTrigFocus = inverseTrigFocusForConcept(concept.id);

  return (
    <div className="space-y-6">
      <Link to="/trigonometry" className="action-secondary w-fit">
        <ArrowLeft className="h-4 w-4" />
        Trigonometry index
      </Link>
      <TopicHeader title={concept.title} subtitle={concept.summary} difficulty={concept.category} estimatedMinutes={12} />

      {fullPage ? (
        <>
          {fullPage}
          {triangleCircleFocus && <TriangleCircleRatioVisualizer focus={triangleCircleFocus} title={`${concept.title} Triangle + Circle Bridge`} />}
        </>
      ) : unitCircleMasterFocus ? (
        <>
          <UnitCircleMasterVisualizer focus={unitCircleMasterFocus} title={`${concept.title} Master Visualizer`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : triangleCircleFocus ? (
        <>
          <TriangleCircleRatioVisualizer focus={triangleCircleFocus} title={`${concept.title} Triangle + Circle Visualizer`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : coreIdentityFocus ? (
        <>
          <CoreIdentityProofVisualizer defaultIdentity={coreIdentityFocus} title={`${concept.title} Core Proof Visualizer`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : angleSumDifferenceFocus ? (
        <>
          <AngleSumDifferenceVisualizer defaultFormula={angleSumDifferenceFocus} title={`${concept.title} Visual Derivation Lab`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : doubleHalfFocus ? (
        <>
          <DoubleHalfAngleVisualizer defaultFormula={doubleHalfFocus} title={`${concept.title} Visual Derivation Lab`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : graphStudioFocus ? (
        <>
          <TrigGraphStudio defaultFunction={graphStudioFocus.fn} emphasis={graphStudioFocus.emphasis} title={`${concept.title} Graph Studio`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : inverseTrigFocus ? (
        <>
          <InverseTrigVisualizer defaultFunction={inverseTrigFocus.fn} focus={inverseTrigFocus.focus} title={`${concept.title} Visual Lab`} />
          <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
        </>
      ) : (
        <ConceptLabSection concept={concept} a={a} b={b} setA={setA} setB={setB} metrics={metrics} />
      )}

      <VisualLearningPanel
        concept={concept.summary}
        formula={concept.formula}
        changes={changeText(concept.visual, concept.sliderA, concept.sliderB)}
        realWorldUse={concept.use}
        steps={learningSteps(concept, a, b)}
        tasks={concept.tasks}
      />

      <TrigPracticeChallengeSystem conceptId={concept.id} />

      <SectionCard title={`${concept.title} Visual Resources`} description="Only this unit's formula, live model, and matching shape tools are shown here.">
        <div className="grid gap-3 md:grid-cols-3">
          <Info label="Formula" value={concept.formula} />
          <Info label="Visualization" value={visualResourceText(concept.visual)} />
          <Info label="Interactive task" value={concept.tasks[0] ?? "Move the controls and explain what changes."} />
        </div>
        {shapeLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {shapeLinks.map((link) => (
              <Link key={link.to} to={link.to} className="action-secondary">
                Open {link.label}
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ConceptLabSection({
  concept,
  a,
  b,
  setA,
  setB,
  metrics,
}: {
  concept: TrigonometryConcept;
  a: number;
  b: number;
  setA: (value: number) => void;
  setB: (value: number) => void;
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <SectionCard title="Classic Concept Lab" description="The existing 2D and 3D concept views are preserved as a fallback beside the upgraded lesson.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <FormulaBlock title="Core Formula" formula={concept.formula} explanation={concept.summary} />
          <SliderGroup title="Concept controls">
            <SliderControl density="compact" label={concept.sliderA} value={a} min={concept.minA} max={concept.maxA} step={concept.stepA} onChange={setA} />
            <SliderControl density="compact" label={concept.sliderB} value={b} min={concept.minB} max={concept.maxB} step={concept.stepB} onChange={setB} />
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}
          </div>
        </div>
        <div className="space-y-4">
          <TopicTabs
            tabs={[
              {
                id: "view-2d",
                label: "2D View",
                content: (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950">
                    <TrigConceptSvg visual={concept.visual} a={a} b={b} title={concept.title} />
                  </div>
                ),
              },
              {
                id: "view-3d",
                label: "3D View",
                content: <TrigConcept3DView visual={concept.visual} a={a} b={b} title={concept.title} />,
              },
            ]}
          />
          <div className="grid gap-3 md:grid-cols-3">
            <Info label="Concept" value={concept.summary} />
            <Info label="What changes" value={changeText(concept.visual, concept.sliderA, concept.sliderB)} />
            <Info label="Used in" value={concept.use} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function fullVisualizer(visual: TrigonometryVisualType) {
  if (visual === "eclipse") return <EclipseTrigonometryVisualizer />;
  if (visual === "wave-applications") return <WaveApplications />;
  if (visual === "experiment-catalog") return <TrigonometryExperimentCatalog />;
  if (visual === "trig-functions") return <TrigonometricFunctionsVisualizer />;
  return null;
}

function unitCircleMasterFocusForConcept(conceptId: string): UnitCircleMasterFocus | null {
  if (conceptId === "unit-circle") return "unit-circle";
  if (conceptId === "degree-radian") return "degree-radian";
  if (conceptId === "special-angles") return "special-angles";
  if (conceptId === "quadrant-signs") return "quadrant-signs";
  return null;
}

function triangleCircleRatioFocusForConcept(conceptId: string): TriangleCircleRatioFocus | null {
  if (conceptId === "right-triangle-ratios") return "basic";
  if (conceptId === "reciprocal-ratios") return "reciprocal";
  if (conceptId === "trigonometric-functions") return "functions";
  return null;
}

function coreIdentityFocusForConcept(conceptId: string): CoreIdentityId | null {
  if (conceptId === "pythagorean-identity") return "sin2-plus-cos2";
  return null;
}

function angleSumDifferenceFocusForConcept(conceptId: string): AngleSumDifferenceFormulaId | null {
  if (conceptId === "sum-difference") return "sin-add";
  return null;
}

function doubleHalfFocusForConcept(conceptId: string): DoubleHalfFormulaId | null {
  if (conceptId === "double-angle") return "sin-double";
  if (conceptId === "half-angle") return "sin-half-square";
  return null;
}

function graphStudioFocusForConcept(conceptId: string): { fn: TrigGraphFunction; emphasis: "a" | "b" | "c" | "d" | "parent" } | null {
  if (conceptId === "sine-graph") return { fn: "sin", emphasis: "parent" };
  if (conceptId === "cosine-graph") return { fn: "cos", emphasis: "parent" };
  if (conceptId === "tangent-graph") return { fn: "tan", emphasis: "parent" };
  if (conceptId === "wave-amplitude" || conceptId === "amplitude") return { fn: "sin", emphasis: "a" };
  if (conceptId === "wave-period-frequency" || conceptId === "period-frequency") return { fn: "sin", emphasis: "b" };
  if (conceptId === "phase-shift") return { fn: "sin", emphasis: "c" };
  return null;
}

function inverseTrigFocusForConcept(conceptId: string): { fn: InverseTrigId; focus: "inverse" | "principal" | "equations" | "general" } | null {
  if (conceptId === "inverse-trig") return { fn: "asin", focus: "inverse" };
  if (conceptId === "inverse-principal-values") return { fn: "asin", focus: "principal" };
  if (conceptId === "trig-equations") return { fn: "asin", focus: "equations" };
  if (conceptId === "general-solutions") return { fn: "asin", focus: "general" };
  return null;
}

function TrigConceptSvg({ visual, a, b, title }: { visual: TrigonometryVisualType; a: number; b: number; title: string }) {
  return (
    <svg viewBox="0 0 720 440" className="h-[320px] w-full sm:h-[440px]">
      <title>{title}</title>
      <rect width="720" height="440" rx="24" className="fill-slate-50 dark:fill-slate-900" />
      <Grid />
      {renderVisual(visual, a, b)}
    </svg>
  );
}

function renderVisual(visual: TrigonometryVisualType, a: number, b: number) {
  if (visual === "unit-circle") return <UnitCircleTrig angle={a} radius={b} />;
  if (visual === "right-triangle" || visual === "ratio" || visual === "height-distance") return <TriangleTrig angle={a} size={b} visual={visual} />;
  if (visual === "angle-measure" || visual === "identity" || visual === "polar") return <CircleTrig angle={a} radius={b} visual={visual} />;
  if (visual === "inverse") return <InverseTrig ratio={a} scale={b} />;
  if (visual === "law") return <TriangleLaw a={a} b={b} />;
  if (visual === "bearing") return <BearingVisual angle={a} distance={b} />;
  return <WaveTransform a={a} b={b} visual={visual} />;
}

function UnitCircleTrig({ angle, radius }: { angle: number; radius: number }) {
  const cx = 360;
  const cy = 220;
  const r = 135;
  const rad = degreesToRadians(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const x = cx + r * cos;
  const y = cy - r * sin;
  const coordX = roundTo(radius * cos, 3);
  const coordY = roundTo(radius * sin, 3);
  const largeArc = angle > 180 ? 1 : 0;
  const arcX = cx + 46 * Math.cos(rad);
  const arcY = cy - 46 * Math.sin(rad);

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.1" stroke="#06b6d4" strokeWidth="5" />
      <line x1={cx - r - 34} y1={cy} x2={cx + r + 34} y2={cy} stroke="#94a3b8" strokeWidth="3" />
      <line x1={cx} y1={cy + r + 34} x2={cx} y2={cy - r - 34} stroke="#94a3b8" strokeWidth="3" />
      <path d={`M${cx + 46},${cy} A46,46 0 ${largeArc} 0 ${arcX},${arcY}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#f59e0b" strokeWidth="5" />
      <line x1={x} y1={cy} x2={x} y2={y} stroke="#10b981" strokeDasharray="8 8" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={x} y2={cy} stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth="4" />
      <Point x={x} y={y} label={`P(${coordX}, ${coordY})`} />
      <Label x={cx + r + 12} y={cy + 24} text="(1, 0)" />
      <Label x={cx - r - 60} y={cy + 24} text="(-1, 0)" />
      <Label x={cx + 12} y={cy - r - 12} text="(0, 1)" />
      <Label x={cx + 12} y={cy + r + 28} text="(0, -1)" />
      <Label x={cx + 58} y={cy - 16} text={`${roundTo(angle, 1)} deg`} />
      <Label x={(cx + x) / 2 - 34} y={cy + 34} text="cos θ" />
      <Label x={x + 14} y={(cy + y) / 2} text="sin θ" />
      <Label x="72" y="78" text="unit circle: x = cos θ, y = sin θ" />
    </g>
  );
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
      <Label x={x - 70} y={cy + 28} text="cos θ" />
      <Label x={x + 18} y={(y + cy) / 2} text="sin θ" />
    </g>
  );
}

function WaveTransform({ a, b }: { a: number; b: number; visual: TrigonometryVisualType }) {
  const amp = a;
  const freq = b;
  const points = Array.from({ length: 240 }, (_, i) => {
    const x = 70 + i * 2.45;
    const t = (i / 240) * Math.PI * 4;
    const y = 220 - Math.sin(freq * t) * amp * 34;
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
  return <text x={x} y={y} className="fill-slate-900 dark:fill-slate-100" fontSize="16" fontWeight="800">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  const isFormula = label.toLowerCase().includes("formula");
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6">{isFormula ? <MathExpression value={value} className="text-sm" /> : value}</p>
    </div>
  );
}

function trigMetrics(visual: TrigonometryVisualType, a: number, b: number) {
  const rad = degreesToRadians(a);
  if (visual === "unit-circle") {
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    return [
      { label: "point", value: `(${roundTo(b * cos, 3)}, ${roundTo(b * sin, 3)})` },
      { label: "sin", value: `${roundTo(sin, 3)}` },
      { label: "cos", value: `${roundTo(cos, 3)}` },
      { label: "quadrant", value: quadrantForAngle(a) },
    ];
  }
  if (visual === "inverse") {
    const clamped = Math.max(-1, Math.min(1, a));
    return [{ label: "theta", value: `${roundTo(Math.asin(clamped) * 180 / Math.PI, 2)} deg` }, { label: "ratio", value: `${roundTo(clamped, 3)}` }];
  }
  if (visual === "height-distance") return [{ label: "height", value: `${roundTo(b * Math.tan(rad), 2)}` }, { label: "tan", value: `${roundTo(Math.tan(rad), 3)}` }];
  return [{ label: "sin", value: `${roundTo(Math.sin(rad), 3)}` }, { label: "cos", value: `${roundTo(Math.cos(rad), 3)}` }, { label: "tan", value: `${roundTo(Math.tan(rad), 3)}` }, { label: "theta", value: `${roundTo(a, 2)} deg` }];
}

function changeText(visual: TrigonometryVisualType, sliderA: string, sliderB: string) {
  if (visual === "unit-circle") return `${sliderA} rotates the point around the circle; ${sliderB} keeps the unit scale for exact sine and cosine coordinates.`;
  if (visual === "graph-transform") return `${sliderA} and ${sliderB} reshape the wave without changing the basic repeating pattern.`;
  if (visual === "height-distance") return `${sliderA} changes steepness; ${sliderB} changes the baseline measurement.`;
  return `${sliderA} changes the angle or input; ${sliderB} changes the scale or comparison value.`;
}

function learningSteps(concept: TrigonometryConcept, a: number, b: number) {
  if (concept.visual === "unit-circle") {
    const rad = degreesToRadians(a);
    return [
      "Start on the circle, not on a wave graph.",
      `At ${roundTo(a, 2)} degrees, the point is (${roundTo(b * Math.cos(rad), 3)}, ${roundTo(b * Math.sin(rad), 3)}).`,
      "Read cosine from the horizontal projection and sine from the vertical projection.",
      "Move through all four quadrants and predict the signs before checking.",
    ];
  }
  return [
    `Start with the displayed formula.`,
    `Set ${concept.sliderA} to ${roundTo(a, 2)} and ${concept.sliderB} to ${roundTo(b, 2)}.`,
    "Read the visual measurement before calculating.",
    "Compare the diagram with the formula result.",
  ];
}

function quadrantForAngle(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) return "axis";
  if (normalized < 90) return "QI";
  if (normalized < 180) return "QII";
  if (normalized < 270) return "QIII";
  return "QIV";
}

function visualResourceText(visual: TrigonometryVisualType) {
  if (visual === "unit-circle") return "Circle, rotating point, sine/cosine projections, quadrant signs, and coordinate readout.";
  if (visual === "right-triangle" || visual === "ratio" || visual === "height-distance") return "Right triangle with live opposite, adjacent, hypotenuse, angle, and measurement changes.";
  if (visual === "angle-measure" || visual === "identity" || visual === "polar") return "Circle or arc model with radius, angle, coordinate, and identity connections.";
  if (visual === "law") return "Triangle-solving diagram with changing sides, angles, and measurements.";
  if (visual === "bearing") return "Compass and direction model for north-based navigation angles.";
  if (visual === "inverse") return "Inverse-ratio triangle showing how an input value recovers an angle.";
  return "Graph visualization with live controls for amplitude, frequency, scale, or comparison values.";
}

function shapeLinksForConcept(concept: TrigonometryConcept) {
  if (concept.visual === "unit-circle" || concept.visual === "angle-measure" || concept.visual === "identity" || concept.visual === "polar") {
    return [{ label: "Circle in Shapes", to: "/shapes?shape=circle" }];
  }
  if (concept.visual === "right-triangle" || concept.visual === "ratio" || concept.visual === "height-distance" || concept.visual === "inverse") {
    return [{ label: "Right Triangle in Shapes", to: "/shapes?shape=right-triangle" }];
  }
  if (concept.visual === "law") return [{ label: "Triangle in Shapes", to: "/shapes?shape=triangle" }];
  return [];
}
