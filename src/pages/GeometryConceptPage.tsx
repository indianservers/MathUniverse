import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import VisualLearningPanel from "../components/ui/VisualLearningPanel";
import { getGeometryConcept, geometryConcepts, type GeometryConcept, type GeometryVisualType } from "../data/geometryConcepts";
import { degreesToRadians, roundTo } from "../utils/math";

export default function GeometryConceptPage() {
  const { conceptId } = useParams();
  const concept = getGeometryConcept(conceptId);
  if (!concept) return <Navigate to="/geometry" replace />;
  return <GeometryConceptDetail concept={concept} />;
}

function GeometryConceptDetail({ concept }: { concept: GeometryConcept }) {
  const [a, setA] = useState(concept.defaultA);
  const [b, setB] = useState(concept.defaultB);

  useEffect(() => {
    setA(concept.defaultA);
    setB(concept.defaultB);
  }, [concept]);

  const metrics = useMemo(() => geometryMetrics(concept.visual, a, b), [a, b, concept.visual]);
  const related = geometryConcepts.filter((item) => item.category === concept.category && item.id !== concept.id).slice(0, 4);

  return (
    <div className="space-y-6">
      <Link to="/geometry" className="action-secondary w-fit">
        <ArrowLeft className="h-4 w-4" />
        Geometry index
      </Link>
      <TopicHeader title={concept.title} subtitle={concept.summary} difficulty={concept.category} estimatedMinutes={12} />

      <SectionCard title="Interactive Concept Lab" description="Move the controls and read the geometry directly on the diagram.">
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
              <GeometryConceptSvg visual={concept.visual} a={a} b={b} title={concept.title} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Info label="Concept" value={concept.summary} />
              <Info label="What changes" value={changeText(concept.visual, concept.sliderA, concept.sliderB)} />
              <Info label="Used in" value={concept.use} />
            </div>
          </div>
        </div>
      </SectionCard>

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
              <Link key={item.id} to={`/geometry/${item.id}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
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

function GeometryConceptSvg({ visual, a, b, title }: { visual: GeometryVisualType; a: number; b: number; title: string }) {
  return (
    <svg viewBox="0 0 720 440" className="h-[440px] w-full">
      <title>{title}</title>
      <rect width="720" height="440" rx="24" fill="#f8fafc" />
      <Grid />
      {renderVisual(visual, a, b)}
    </svg>
  );
}

function renderVisual(visual: GeometryVisualType, a: number, b: number) {
  if (visual === "line") return <LineVisual a={a} b={b} />;
  if (visual === "angle") return <AngleVisual angle={a} radius={b} />;
  if (visual === "parallel") return <ParallelVisual angle={a} gap={b} />;
  if (visual === "triangle") return <TriangleVisual base={a} height={b} />;
  if (visual === "pythagoras") return <PythagorasVisual a={a} b={b} />;
  if (visual === "similarity") return <SimilarityVisual scale={a} base={b} />;
  if (visual === "quadrilateral") return <QuadrilateralVisual base={a} slant={b} />;
  if (visual === "polygon") return <PolygonVisual sides={Math.round(a)} radius={b} />;
  if (visual === "circle") return <CircleVisual radius={a} offset={b} />;
  if (visual === "arc") return <ArcVisual radius={a} angle={b} />;
  if (visual === "tangent") return <TangentVisual angle={a} radius={b} />;
  if (visual === "coordinate") return <CoordinateVisual x2={a} y2={b} />;
  if (visual === "transform") return <TransformVisual angle={a} scale={b} />;
  if (visual === "symmetry") return <SymmetryVisual x={a} y={b} />;
  if (visual === "area") return <AreaVisual length={a} breadth={b} />;
  if (visual === "solid") return <SolidVisual size={a} height={b} />;
  if (visual === "construction") return <ConstructionVisual gap={a} radius={b} />;
  if (visual === "locus") return <LocusVisual radius={a} angle={b} />;
  return <TrigVisual angle={a} adjacent={b} />;
}

function Grid() {
  return (
    <g opacity="0.55">
      {Array.from({ length: 15 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 46} y1="30" x2={40 + i * 46} y2="410" stroke="#e2e8f0" />)}
      {Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="30" y1={40 + i * 45} x2="690" y2={40 + i * 45} stroke="#e2e8f0" />)}
    </g>
  );
}

function LineVisual({ a, b }: { a: number; b: number }) {
  const ax = 150, ay = 300;
  return <g><line x1="70" y1={ay + 42} x2="650" y2={b - 40} stroke="#94a3b8" strokeDasharray="8 8" strokeWidth="2" /><line x1={ax} y1={ay} x2={a} y2={b} stroke="#06b6d4" strokeWidth="5" /><Point x={ax} y={ay} label="A" /><Point x={a} y={b} label="B" /><Label x={(ax + a) / 2} y={(ay + b) / 2 - 16} text="segment AB" /></g>;
}

function AngleVisual({ angle, radius }: { angle: number; radius: number }) {
  const cx = 250, cy = 275;
  const rad = degreesToRadians(angle);
  const x = cx + radius * Math.cos(rad);
  const y = cy - radius * Math.sin(rad);
  return <g><line x1={cx} y1={cy} x2={cx + radius + 80} y2={cy} stroke="#0f172a" strokeWidth="5" /><line x1={cx} y1={cy} x2={x} y2={y} stroke="#06b6d4" strokeWidth="5" /><path d={`M ${cx + 55} ${cy} A 55 55 0 ${angle > 180 ? 1 : 0} 0 ${cx + 55 * Math.cos(rad)} ${cy - 55 * Math.sin(rad)}`} fill="none" stroke="#f59e0b" strokeWidth="6" /><Point x={cx} y={cy} label="O" /><Label x={cx + 90} y={cy - 35} text={`theta = ${roundTo(angle, 0)} deg`} /></g>;
}

function ParallelVisual({ angle, gap }: { angle: number; gap: number }) {
  const rad = degreesToRadians(angle);
  const x1 = 360 - 260 * Math.cos(rad), y1 = 220 + 260 * Math.sin(rad);
  const x2 = 360 + 260 * Math.cos(rad), y2 = 220 - 260 * Math.sin(rad);
  return <g><line x1="90" y1={220 - gap / 2} x2="630" y2={220 - gap / 2} stroke="#06b6d4" strokeWidth="5" /><line x1="90" y1={220 + gap / 2} x2="630" y2={220 + gap / 2} stroke="#06b6d4" strokeWidth="5" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="5" /><Label x="150" y={205 - gap / 2} text="parallel line" /><Label x="485" y="160" text="matching angles" /></g>;
}

function TriangleVisual({ base, height }: { base: number; height: number }) {
  const x = 150, y = 330;
  const apexX = x + base * 0.58;
  const apexY = y - height;
  return <g><rect x={x} y={apexY} width={base} height={height} fill="#22d3ee" opacity="0.08" stroke="#94a3b8" strokeDasharray="8 8" /><polygon points={`${x},${y} ${x + base},${y} ${apexX},${apexY}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" /><line x1={apexX} y1={apexY} x2={apexX} y2={y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" /><Label x={x + base / 2} y={y + 32} text="base b" /><Label x={apexX + 18} y={(apexY + y) / 2} text="height h" /></g>;
}

function PythagorasVisual({ a, b }: { a: number; b: number }) {
  const x = 210, y = 320;
  const c = Math.hypot(a, b);
  return <g><polygon points={`${x},${y} ${x + a},${y} ${x},${y - b}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" /><rect x={x} y={y} width={a} height={a} fill="#f59e0b" opacity="0.18" stroke="#f59e0b" /><rect x={x - b} y={y - b} width={b} height={b} fill="#8b5cf6" opacity="0.16" stroke="#8b5cf6" /><Label x={x + a / 2} y={y + 24} text="a" /><Label x={x - 28} y={y - b / 2} text="b" /><Label x={x + a / 2 + 30} y={y - b / 2 - 12} text={`c=${roundTo(c, 1)}`} /></g>;
}

function SimilarityVisual({ scale, base }: { scale: number; base: number }) {
  const h = base * 0.62;
  return <g><polygon points={`135,330 ${135 + base},330 ${135 + base * 0.52},${330 - h}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><polygon points={`430,330 ${430 + base * scale * 0.62},330 ${430 + base * scale * 0.32},${330 - h * scale * 0.62}`} fill="#f59e0b" opacity="0.18" stroke="#f59e0b" strokeWidth="4" /><Label x="178" y="118" text="same angles" /><Label x="462" y="120" text={`scale ${roundTo(scale, 2)}x`} /></g>;
}

function QuadrilateralVisual({ base, slant }: { base: number; slant: number }) {
  const x = 175, y = 320, h = 160;
  return <g><polygon points={`${x},${y} ${x + base},${y} ${x + base + slant},${y - h} ${x + slant},${y - h}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" /><line x1={x + slant} y1={y - h} x2={x + slant} y2={y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 6" /><Label x={x + base / 2} y={y + 32} text="base" /><Label x={x + slant + 18} y={y - h / 2} text="height" /></g>;
}

function PolygonVisual({ sides, radius }: { sides: number; radius: number }) {
  const cx = 360, cy = 225;
  const points = Array.from({ length: sides }, (_, i) => {
    const rad = -Math.PI / 2 + (i * Math.PI * 2) / sides;
    return `${cx + radius * Math.cos(rad)},${cy + radius * Math.sin(rad)}`;
  }).join(" ");
  return <g><polygon points={points} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" />{points.split(" ").map((pair, i) => { const [x, y] = pair.split(",").map(Number); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#f59e0b" opacity="0.55" />; })}<Point x={cx} y={cy} label="O" /><Label x="360" y="395" text={`${sides} equal center triangles`} /></g>;
}

function CircleVisual({ radius, offset }: { radius: number; offset: number }) {
  const cx = 360, cy = 225;
  const chordY = cy + offset * 0.7;
  const dx = Math.sqrt(Math.max(0, radius ** 2 - (chordY - cy) ** 2));
  return <g><circle cx={cx} cy={cy} r={radius} fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="5" /><line x1={cx} y1={cy} x2={cx + radius} y2={cy} stroke="#f59e0b" strokeWidth="5" /><line x1={cx - dx} y1={chordY} x2={cx + dx} y2={chordY} stroke="#8b5cf6" strokeWidth="5" /><Point x={cx} y={cy} label="O" /><Label x={cx + radius / 2} y={cy - 14} text="r" /><Label x={cx} y={chordY - 14} text="chord" /></g>;
}

function ArcVisual({ radius, angle }: { radius: number; angle: number }) {
  const cx = 360, cy = 235, rad = degreesToRadians(angle), x = cx + radius * Math.cos(rad), y = cy - radius * Math.sin(rad);
  return <g><path d={`M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 0 ${x} ${y} Z`} fill="#f59e0b" opacity="0.22" stroke="#f59e0b" strokeWidth="4" /><circle cx={cx} cy={cy} r={radius} fill="none" stroke="#06b6d4" strokeWidth="4" /><Label x={cx + 80} y={cy - 42} text={`${roundTo(angle, 0)} deg sector`} /></g>;
}

function TangentVisual({ angle, radius }: { angle: number; radius: number }) {
  const cx = 360, cy = 225, rad = degreesToRadians(angle);
  const px = cx + radius * Math.cos(rad), py = cy - radius * Math.sin(rad);
  const tx = -Math.sin(rad), ty = -Math.cos(rad);
  return <g><circle cx={cx} cy={cy} r={radius} fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="5" /><line x1={cx} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="5" /><line x1={px - tx * 160} y1={py - ty * 160} x2={px + tx * 160} y2={py + ty * 160} stroke="#0f172a" strokeWidth="5" /><Point x={px} y={py} label="T" /><Label x={px + 24} y={py - 22} text="90 deg" /></g>;
}

function CoordinateVisual({ x2, y2 }: { x2: number; y2: number }) {
  const ox = 360, oy = 220, scale = 32, ax = ox - 3 * scale, ay = oy + 2 * scale, bx = ox + x2 * scale, by = oy - y2 * scale;
  return <g><line x1="80" y1={oy} x2="650" y2={oy} stroke="#94a3b8" strokeWidth="3" /><line x1={ox} y1="55" x2={ox} y2="390" stroke="#94a3b8" strokeWidth="3" /><line x1={ax} y1={ay} x2={bx} y2={by} stroke="#06b6d4" strokeWidth="5" /><Point x={ax} y={ay} label="A" /><Point x={bx} y={by} label="B" /><Label x={(ax + bx) / 2} y={(ay + by) / 2 - 18} text="slope and distance" /></g>;
}

function TransformVisual({ angle, scale }: { angle: number; scale: number }) {
  const original = "250,310 360,130 470,310";
  return <g><polygon points={original} fill="#06b6d4" opacity="0.16" stroke="#06b6d4" strokeWidth="4" /><g transform={`translate(360 240) rotate(${angle}) scale(${scale}) translate(-360 -240)`}><polygon points={original} fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="4" /></g><Label x="360" y="375" text={`rotate ${roundTo(angle, 0)} deg, scale ${roundTo(scale, 2)}`} /></g>;
}

function SymmetryVisual({ x, y }: { x: number; y: number }) {
  const cx = 360, px = cx - x, mirror = cx + x;
  return <g><line x1={cx} y1="60" x2={cx} y2="390" stroke="#0f172a" strokeWidth="4" strokeDasharray="8 8" /><circle cx={px} cy={y + 80} r="34" fill="#06b6d4" opacity="0.25" stroke="#06b6d4" strokeWidth="4" /><circle cx={mirror} cy={y + 80} r="34" fill="#f59e0b" opacity="0.25" stroke="#f59e0b" strokeWidth="4" /><line x1={px} y1={y + 80} x2={mirror} y2={y + 80} stroke="#94a3b8" strokeDasharray="7 6" /><Label x={cx + 12} y="75" text="mirror line" /></g>;
}

function AreaVisual({ length, breadth }: { length: number; breadth: number }) {
  const x = 180, y = 115;
  return <g><rect x={x} y={y} width={length} height={breadth} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" />{Array.from({ length: Math.floor(length / 40) }).map((_, i) => <line key={`lv-${i}`} x1={x + i * 40} y1={y} x2={x + i * 40} y2={y + breadth} stroke="#67e8f9" />)}{Array.from({ length: Math.floor(breadth / 40) }).map((_, i) => <line key={`lh-${i}`} x1={x} y1={y + i * 40} x2={x + length} y2={y + i * 40} stroke="#67e8f9" />)}<Label x={x + length / 2} y={y + breadth + 34} text="length l" /><Label x={x - 42} y={y + breadth / 2} text="breadth b" /></g>;
}

function SolidVisual({ size, height }: { size: number; height: number }) {
  const x = 250, y = 300, d = size * 0.38;
  return <g><polygon points={`${x},${y} ${x + size},${y} ${x + size + d},${y - d} ${x + d},${y - d}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><polygon points={`${x + size},${y} ${x + size + d},${y - d} ${x + size + d},${y - height - d} ${x + size},${y - height}`} fill="#0ea5e9" opacity="0.14" stroke="#06b6d4" strokeWidth="4" /><polygon points={`${x},${y} ${x + size},${y} ${x + size},${y - height} ${x},${y - height}`} fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="4" /><Label x={x + size / 2} y={y + 32} text="base" /><Label x={x + size + 28} y={y - height / 2} text="height" /></g>;
}

function ConstructionVisual({ gap, radius }: { gap: number; radius: number }) {
  const ax = 360 - gap / 2, bx = 360 + gap / 2, y = 260;
  return <g><line x1={ax} y1={y} x2={bx} y2={y} stroke="#0f172a" strokeWidth="5" /><circle cx={ax} cy={y} r={radius} fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="8 7" /><circle cx={bx} cy={y} r={radius} fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><line x1="360" y1="75" x2="360" y2="390" stroke="#8b5cf6" strokeWidth="4" /><Point x={ax} y={y} label="A" /><Point x={bx} y={y} label="B" /><Label x="382" y="105" text="perpendicular bisector" /></g>;
}

function LocusVisual({ radius, angle }: { radius: number; angle: number }) {
  const cx = 360, cy = 225, rad = degreesToRadians(angle), px = cx + radius * Math.cos(rad), py = cy - radius * Math.sin(rad);
  return <g><circle cx={cx} cy={cy} r={radius} fill="#06b6d4" opacity="0.1" stroke="#06b6d4" strokeWidth="5" strokeDasharray="10 7" /><line x1={cx} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="5" /><Point x={cx} y={cy} label="C" /><Point x={px} y={py} label="P" /><Label x="360" y="395" text="all positions of P form the locus" /></g>;
}

function TrigVisual({ angle, adjacent }: { angle: number; adjacent: number }) {
  const x = 180, y = 320, rad = degreesToRadians(angle), opp = Math.min(245, Math.tan(rad) * adjacent);
  return <g><polygon points={`${x},${y} ${x + adjacent},${y} ${x + adjacent},${y - opp}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="5" /><path d={`M ${x + 55} ${y} A 55 55 0 0 0 ${x + 55 * Math.cos(rad)} ${y - 55 * Math.sin(rad)}`} fill="none" stroke="#f59e0b" strokeWidth="6" /><Label x={x + adjacent / 2} y={y + 32} text="adjacent" /><Label x={x + adjacent + 20} y={y - opp / 2} text="opposite" /><Label x={x + 70} y={y - 28} text={`${roundTo(angle, 0)} deg`} /></g>;
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="8" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" /><text x={x + 12} y={y - 10} fill="#0f172a" className="text-sm font-bold">{label}</text></g>;
}

function Label({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} fill="#0f172a" textAnchor="middle" className="text-sm font-bold">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{value}</p></div>;
}

function geometryMetrics(visual: GeometryVisualType, a: number, b: number) {
  if (visual === "pythagoras") return [{ label: "hypotenuse", value: roundTo(Math.hypot(a, b), 2).toString() }, { label: "a^2+b^2", value: roundTo(a * a + b * b, 0).toString() }];
  if (visual === "triangle") return [{ label: "area", value: roundTo((a * b) / 2, 1).toString() }, { label: "base", value: roundTo(a, 1).toString() }];
  if (visual === "circle" || visual === "arc") return [{ label: "area", value: roundTo(Math.PI * a * a, 1).toString() }, { label: "circumference", value: roundTo(2 * Math.PI * a, 1).toString() }];
  if (visual === "polygon") return [{ label: "sides", value: Math.round(a).toString() }, { label: "angle step", value: `${roundTo(360 / Math.round(a), 1)} deg` }];
  if (visual === "coordinate") return [{ label: "distance", value: roundTo(Math.hypot(a + 3, b - 2), 2).toString() }, { label: "slope", value: roundTo((b - 2) / (a + 3 || 1), 2).toString() }];
  if (visual === "trig") return [{ label: "opposite", value: roundTo(Math.tan(degreesToRadians(a)) * b, 2).toString() }, { label: "tan theta", value: roundTo(Math.tan(degreesToRadians(a)), 3).toString() }];
  if (visual === "solid") return [{ label: "volume model", value: roundTo(a * a * b, 0).toString() }, { label: "base area", value: roundTo(a * a, 0).toString() }];
  if (visual === "area") return [{ label: "area", value: roundTo(a * b, 0).toString() }, { label: "perimeter", value: roundTo(2 * (a + b), 0).toString() }];
  return [{ label: "control A", value: roundTo(a, 2).toString() }, { label: "control B", value: roundTo(b, 2).toString() }];
}

function changeText(visual: GeometryVisualType, sliderA: string, sliderB: string) {
  const base = `${sliderA} and ${sliderB} update the diagram, measurements, and formula interpretation.`;
  if (visual === "angle" || visual === "trig") return `${base} Angle changes rotate the ray and alter side ratios.`;
  if (visual === "circle" || visual === "arc" || visual === "tangent") return `${base} Radius changes scale circular measurements; angle controls the selected position or sector.`;
  if (visual === "solid") return `${base} Volume reacts multiplicatively, so height and base size compound.`;
  return base;
}

function learningSteps(concept: GeometryConcept, a: number, b: number) {
  const metrics = geometryMetrics(concept.visual, a, b);
  return [
    `Start with ${concept.title.toLowerCase()} and identify the marked dimensions.`,
    `Set ${concept.sliderA} to ${roundTo(a, 2)} and ${concept.sliderB} to ${roundTo(b, 2)}.`,
    `Apply ${concept.formula}.`,
    `Read the live check: ${metrics.map((metric) => `${metric.label} = ${metric.value}`).join(", ")}.`,
  ];
}
