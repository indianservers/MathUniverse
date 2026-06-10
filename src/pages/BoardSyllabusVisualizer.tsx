import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ArrowLeft, Box, Layers3, Network, Pause, Play, Shapes } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { getBoardSyllabusTopic } from "../data/boardSyllabus";

type ViewMode = "concept-map" | "graph" | "measurement";

const strandColors: Record<string, string> = {
  algebra: "#22d3ee",
  geometry: "#34d399",
  trigonometry: "#f59e0b",
  calculus: "#a78bfa",
  probability: "#fb7185",
  statistics: "#60a5fa",
  vectors: "#f472b6",
  number: "#14b8a6",
};

function colorFor(text: string) {
  const lower = text.toLowerCase();
  const key = Object.keys(strandColors).find((item) => lower.includes(item));
  return key ? strandColors[key] : "#38bdf8";
}

export default function BoardSyllabusVisualizer() {
  const { topicId } = useParams();
  const topic = getBoardSyllabusTopic(topicId);
  const [mode, setMode] = useState<ViewMode>("concept-map");
  const [depth, setDepth] = useState(1.4);
  const [spread, setSpread] = useState(1);
  const [animate, setAnimate] = useState(true);

  const nodes = useMemo(() => topic?.topics.slice(0, 10) ?? [], [topic]);

  if (!topic) {
    return (
      <div className="space-y-4">
        <Link className="mini-chip w-fit" to="/syllabus"><ArrowLeft className="h-3.5 w-3.5" /> Back to syllabus</Link>
        <SectionCard title="Syllabus topic not found" description="Open a board topic from the syllabus coverage matrix to launch its 2D and 3D lab." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link className="mini-chip w-fit" to="/syllabus"><ArrowLeft className="h-3.5 w-3.5" /> Back to syllabus</Link>
      <TopicHeader
        title={topic.title}
        subtitle={`${topic.board} / ${topic.grade} / ${topic.phase}`}
        difficulty={topic.strand}
        estimatedMinutes={18}
      />

      <SectionCard title="Interactive 2D and 3D Coverage Lab" description="Every board topic opens with a concept map, graph/measurement controls, and a rotatable 3D model tied to the same syllabus strand.">
        <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {([
                ["concept-map", Network],
                ["graph", Layers3],
                ["measurement", Shapes],
              ] as const).map(([item, Icon]) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`inline-flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border px-2 text-xs font-bold transition ${mode === item ? "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100" : "border-slate-200 bg-white/75 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.replace("-", " ")}
                </button>
              ))}
            </div>
            <SliderControl label="2D spread" value={spread} min={0.6} max={1.6} step={0.1} onChange={setSpread} />
            <SliderControl label="3D depth" value={depth} min={0.5} max={3} step={0.1} onChange={setDepth} />
            <button type="button" className={animate ? "action-primary w-full justify-center" : "tool-button w-full justify-center"} onClick={() => setAnimate((value) => !value)}>
              {animate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {animate ? "Pause 3D rotation" : "Start 3D rotation"}
            </button>
            <div className="rounded-xl bg-slate-100 p-3 text-sm leading-6 dark:bg-white/10">
              <p className="font-bold">2D visual</p>
              <p className="text-slate-600 dark:text-slate-300">{topic.visual2D}</p>
              <p className="mt-3 font-bold">3D visual</p>
              <p className="text-slate-600 dark:text-slate-300">{topic.visual3D}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">2D map</p>
                  <h2 className="text-base font-bold">{mode.replace("-", " ")} view</h2>
                </div>
                <Box className="h-5 w-5 text-slate-400" />
              </div>
              <Syllabus2DCanvas mode={mode} nodes={nodes} accent={colorFor(topic.strand + topic.title)} spread={spread} />
            </div>

            <ThreeSceneWrapper
              height="520px"
              mobileHeight="430px"
              cameraPosition={[4.2, 3.2, 6]}
              fov={45}
              quality="high"
              chrome="cinematic"
              sceneLabel={animate ? "3D syllabus model - rotating" : "3D syllabus model - paused"}
              toolbar={(
                <button type="button" className={animate ? "action-primary" : "tool-button"} onClick={() => setAnimate((value) => !value)}>
                  {animate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {animate ? "Pause" : "Start"}
                </button>
              )}
            >
              <Syllabus3DScene nodes={nodes} accent={colorFor(topic.strand + topic.title)} depth={depth} animate={animate} />
              <OrbitControls enablePan={false} />
            </ThreeSceneWrapper>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Respective Content Visualizations" description="Each syllabus item gets a focused visual model so the page teaches the strand, not just lists it. The spread and depth controls above also influence these previews.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topic.topics.map((item, index) => (
            <StrandVisualizationCard
              key={item}
              title={item}
              index={index}
              accent={colorFor(`${topic.strand} ${item}`)}
              spread={spread}
              depth={depth}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Coverage Visual Checklist" description={topic.sourceNote}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topic.topics.map((item, index) => (
            <CoverageVisualUnit
              key={item}
              title={item}
              index={index}
              accent={colorFor(`${topic.strand} ${item}`)}
              spread={spread}
              depth={depth}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function StrandVisualizationCard({ title, index, accent, spread, depth }: { title: string; index: number; accent: string; spread: number; depth: number }) {
  const kind = visualKindForTitle(title);
  const note = strandNote(kind);
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white/78 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Visual {index + 1}</p>
          <h3 className="mt-1 line-clamp-2 font-black text-slate-950 dark:text-white">{title}</h3>
        </div>
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: accent }} />
      </div>
      <StrandMiniSvg kind={kind} accent={accent} spread={spread} depth={depth} seed={index + 1} />
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{note}</p>
    </div>
  );
}

function CoverageVisualUnit({ title, index, accent, spread, depth }: { title: string; index: number; accent: string; spread: number; depth: number }) {
  const kind = visualKindForTitle(title);
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Unit {index + 1}</p>
          <h3 className="mt-1 font-black">{title}</h3>
        </div>
        <span className="rounded-full px-2 py-1 text-[10px] font-black uppercase text-white" style={{ background: accent }}>{kind.replace("-", " ")}</span>
      </div>
      <StrandMiniSvg kind={kind} accent={accent} spread={spread} depth={depth} seed={index + 1} />
    </div>
  );
}

function visualKindForTitle(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("relation") || lower.includes("function")) return "relations";
  if (lower.includes("inverse trig")) return "inverse-trig";
  if (lower.includes("matrix") || lower.includes("matrices")) return "matrix";
  if (lower.includes("determinant")) return "determinant";
  if (lower.includes("continuity")) return "continuity";
  if (lower.includes("derivative")) return "derivative";
  if (lower.includes("integral")) return "integral";
  if (lower.includes("differential")) return "differential";
  if (lower.includes("vector")) return "vector";
  if (lower.includes("3d") || lower.includes("three-dimensional")) return "space3d";
  if (lower.includes("linear programming")) return "linear-programming";
  if (lower.includes("pattern") || lower.includes("sequence")) return "pattern";
  if (lower.includes("operation") || lower.includes("integer") || lower.includes("fraction")) return "operations";
  if (lower.includes("variable") || lower.includes("expression") || lower.includes("equation")) return "variables";
  if (lower.includes("geometric") || lower.includes("angle") || lower.includes("shape")) return "geometry";
  if (lower.includes("measurement") || lower.includes("measure") || lower.includes("area") || lower.includes("volume")) return "measurement";
  if (lower.includes("data") || lower.includes("statistics")) return "data";
  if (lower.includes("inquiry") || lower.includes("model")) return "inquiry";
  return "concept";
}

function strandNote(kind: string) {
  if (kind === "relations") return "Map inputs to outputs and inspect when each input has exactly one image.";
  if (kind === "inverse-trig") return "Restrict a trigonometric graph so the inverse relation becomes a function.";
  if (kind === "matrix") return "Read rows and columns as an organized transformation grid.";
  if (kind === "determinant") return "Use the signed area of a transformed square to understand determinant value.";
  if (kind === "continuity") return "Compare left approach, right approach, and function value at the same x-coordinate.";
  if (kind === "derivative") return "Move from secant slope toward tangent slope as the interval shrinks.";
  if (kind === "integral") return "Accumulate area with rectangles and compare it to the curve boundary.";
  if (kind === "differential") return "Follow a slope field to see how local rates create solution curves.";
  if (kind === "vector") return "Represent magnitude and direction with arrows and component movement.";
  if (kind === "space3d") return "Connect axes, planes, and points in a spatial coordinate model.";
  if (kind === "linear-programming") return "Shade constraints, find the feasible region, and test corner points.";
  if (kind === "pattern") return "Build, extend, and describe a visual rule from term number to term value.";
  if (kind === "operations") return "Use number movement and grouped quantities to connect operation meaning with calculation.";
  if (kind === "variables") return "Track how an input changes through a rule machine and becomes an output expression.";
  if (kind === "geometry") return "Reason from shapes, angles, and relationships rather than memorizing isolated facts.";
  if (kind === "measurement") return "Compare length, area, and volume as dimensions change in a measurable model.";
  if (kind === "data") return "Read a small data display, compare categories, and notice the average level.";
  if (kind === "inquiry") return "Move through an investigation cycle: predict, test, explain, and refine the model.";
  return "Connect the topic to a visible model and a short mathematical action.";
}

function StrandMiniSvg({ kind, accent, spread, depth, seed }: { kind: string; accent: string; spread: number; depth: number; seed: number }) {
  const width = 420;
  const height = 230;
  const scale = Math.max(0.7, Math.min(1.7, spread));
  const depthShift = Math.round(depth * 12);
  return (
    <svg className="mt-3 h-56 w-full rounded-xl bg-slate-950" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${kind} strand visualization`}>
      <rect width={width} height={height} rx="18" fill="#020617" />
      <GridLines width={width} height={height} />
      {kind === "pattern" && <PatternVisual accent={accent} scale={scale} seed={seed} />}
      {kind === "operations" && <OperationsVisual accent={accent} seed={seed} />}
      {kind === "variables" && <VariablesVisual accent={accent} seed={seed} />}
      {kind === "geometry" && <GeometryReasoningVisual accent={accent} depthShift={depthShift} />}
      {kind === "measurement" && <MeasurementVisual accent={accent} depthShift={depthShift} />}
      {kind === "data" && <DataVisual accent={accent} seed={seed} />}
      {kind === "inquiry" && <InquiryVisual accent={accent} />}
      {kind === "relations" && <RelationsVisual accent={accent} />}
      {kind === "inverse-trig" && <InverseTrigVisual accent={accent} />}
      {kind === "matrix" && <MatrixVisual accent={accent} seed={seed} />}
      {kind === "determinant" && <DeterminantVisual accent={accent} depthShift={depthShift} />}
      {kind === "continuity" && <ContinuityVisual accent={accent} />}
      {kind === "derivative" && <DerivativeVisual accent={accent} />}
      {kind === "integral" && <IntegralVisual accent={accent} />}
      {kind === "differential" && <DifferentialVisual accent={accent} />}
      {kind === "vector" && <VectorVisual accent={accent} depthShift={depthShift} />}
      {kind === "space3d" && <Space3DVisual accent={accent} depthShift={depthShift} />}
      {kind === "linear-programming" && <LinearProgrammingVisual accent={accent} />}
      {kind === "concept" && <ConceptVisual accent={accent} scale={scale} />}
    </svg>
  );
}

function GridLines({ width, height }: { width: number; height: number }) {
  return (
    <g opacity="0.28">
      {Array.from({ length: 8 }).map((_, index) => <line key={`x-${index}`} x1={30 + index * 52} y1="24" x2={30 + index * 52} y2={height - 24} stroke="#1e293b" />)}
      {Array.from({ length: 4 }).map((_, index) => <line key={`y-${index}`} x1="24" y1={42 + index * 42} x2={width - 24} y2={42 + index * 42} stroke="#1e293b" />)}
    </g>
  );
}

function PatternVisual({ accent, scale, seed }: { accent: string; scale: number; seed: number }) {
  const terms = [1, 3, 6, 10].map((value) => value + seed - 1);
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">pattern rule: add the next step</text>
      {terms.map((term, termIndex) => {
        const x = 42 + termIndex * 88;
        const size = 12 * scale;
        return (
          <g key={term} transform={`translate(${x} 66)`}>
            {Array.from({ length: Math.min(term, 12) }).map((_, dotIndex) => (
              <circle key={dotIndex} cx={(dotIndex % 4) * size} cy={Math.floor(dotIndex / 4) * size} r={size * 0.32} fill={accent} opacity={0.9} />
            ))}
            <text x="8" y="102" fill="#cbd5e1" fontSize="12" fontWeight="800">T{termIndex + 1} = {term}</text>
          </g>
        );
      })}
    </g>
  );
}

function OperationsVisual({ accent, seed }: { accent: string; seed: number }) {
  const start = seed;
  const jump = seed + 3;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">operation as movement</text>
      <line x1="48" y1="132" x2="368" y2="132" stroke="#94a3b8" strokeWidth="3" />
      {Array.from({ length: 9 }).map((_, index) => <g key={index}><line x1={64 + index * 36} y1="122" x2={64 + index * 36} y2="142" stroke="#64748b" /><text x={60 + index * 36} y="164" fill="#cbd5e1" fontSize="11">{index}</text></g>)}
      <path d={`M${64 + start * 36} 112 Q${64 + (start + jump / 2) * 36} 52 ${64 + (start + jump) * 36} 112`} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <polygon points={`${64 + (start + jump) * 36},112 ${64 + (start + jump) * 36 - 10},104 ${64 + (start + jump) * 36 - 8},118`} fill={accent} />
      <text x="112" y="204" fill="#f8fafc" fontSize="18" fontWeight="900">{start} + {jump} = {start + jump}</text>
    </g>
  );
}

function VariablesVisual({ accent, seed }: { accent: string; seed: number }) {
  const x = seed + 2;
  const y = 2 * x + 3;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">variable machine</text>
      <rect x="52" y="86" width="78" height="54" rx="12" fill="#0f172a" stroke={accent} strokeWidth="3" />
      <rect x="170" y="72" width="96" height="82" rx="18" fill={accent} opacity="0.18" stroke={accent} strokeWidth="3" />
      <rect x="308" y="86" width="78" height="54" rx="12" fill="#0f172a" stroke={accent} strokeWidth="3" />
      <line x1="130" y1="113" x2="170" y2="113" stroke="#e2e8f0" strokeWidth="4" />
      <line x1="266" y1="113" x2="308" y2="113" stroke="#e2e8f0" strokeWidth="4" />
      <text x="77" y="120" fill="#f8fafc" fontSize="18" fontWeight="900">x={x}</text>
      <text x="185" y="109" fill="#f8fafc" fontSize="16" fontWeight="900">2x + 3</text>
      <text x="326" y="120" fill="#f8fafc" fontSize="18" fontWeight="900">{y}</text>
      <text x="122" y="194" fill="#cbd5e1" fontSize="14" fontWeight="800">A variable stores a value while the rule stays the same.</text>
    </g>
  );
}

function GeometryReasoningVisual({ accent, depthShift }: { accent: string; depthShift: number }) {
  const ax = 88;
  const ay = 174;
  const bx = 332;
  const by = 174;
  const cx = 210 + depthShift;
  const cy = 60;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">geometric reasoning</text>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill={accent} opacity="0.16" stroke={accent} strokeWidth="4" />
      <path d={`M${ax + 34} ${ay} A34 34 0 0 1 ${ax + 18} ${ay - 30}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <path d={`M${bx - 34} ${by} A34 34 0 0 0 ${bx - 18} ${by - 30}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <path d={`M${cx - 20} ${cy + 30} A36 36 0 0 0 ${cx + 20} ${cy + 30}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <text x="155" y="207" fill="#f8fafc" fontSize="16" fontWeight="900">angles total 180°</text>
    </g>
  );
}

function MeasurementVisual({ accent, depthShift }: { accent: string; depthShift: number }) {
  const w = 140 + depthShift;
  const h = 72;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">measurement model</text>
      <rect x="62" y="76" width={w} height={h} fill={accent} opacity="0.18" stroke={accent} strokeWidth="4" />
      <line x1="62" y1="166" x2={62 + w} y2="166" stroke="#f8fafc" strokeWidth="3" />
      <line x1={62 + w + 18} y1="76" x2={62 + w + 18} y2={76 + h} stroke="#f8fafc" strokeWidth="3" />
      <text x={92 + w / 2} y="188" fill="#f8fafc" fontSize="13" fontWeight="800">length</text>
      <text x={98 + w} y="118" fill="#f8fafc" fontSize="13" fontWeight="800">width</text>
      <g transform="translate(282 78)">
        <rect x="0" y="20" width="58" height="58" fill={accent} opacity="0.28" stroke={accent} strokeWidth="3" />
        <polygon points="0,20 24,0 82,0 58,20" fill={accent} opacity="0.18" stroke={accent} strokeWidth="3" />
        <polygon points="58,20 82,0 82,58 58,78" fill={accent} opacity="0.12" stroke={accent} strokeWidth="3" />
      </g>
      <text x="74" y="214" fill="#cbd5e1" fontSize="13" fontWeight="800">area changes with two dimensions; volume adds depth.</text>
    </g>
  );
}

function DataVisual({ accent, seed }: { accent: string; seed: number }) {
  const bars = [54, 88, 64 + seed * 4, 118, 76];
  const mean = bars.reduce((sum, value) => sum + value, 0) / bars.length;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">data display</text>
      <line x1="56" y1="178" x2="360" y2="178" stroke="#94a3b8" strokeWidth="3" />
      <line x1="56" y1="60" x2="56" y2="178" stroke="#94a3b8" strokeWidth="3" />
      {bars.map((bar, index) => <rect key={index} x={82 + index * 52} y={178 - bar} width="30" height={bar} rx="6" fill={accent} opacity={0.82} />)}
      <line x1="70" y1={178 - mean} x2="346" y2={178 - mean} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 7" />
      <text x="266" y={172 - mean} fill="#fcd34d" fontSize="12" fontWeight="900">mean</text>
      <text x="86" y="210" fill="#cbd5e1" fontSize="13" fontWeight="800">Compare categories, then describe the centre.</text>
    </g>
  );
}

function InquiryVisual({ accent }: { accent: string }) {
  const steps = [
    { label: "Predict", x: 210, y: 54 },
    { label: "Test", x: 326, y: 132 },
    { label: "Explain", x: 210, y: 188 },
    { label: "Refine", x: 94, y: 132 },
  ];
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">inquiry modelling cycle</text>
      <path d="M210 76 C290 80 320 94 322 116 M302 148 C276 180 246 190 226 188 M190 188 C134 180 104 162 98 144 M96 116 C110 84 154 66 194 58" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" />
      {steps.map((step) => (
        <g key={step.label}>
          <circle cx={step.x} cy={step.y} r="35" fill={accent} opacity="0.18" stroke={accent} strokeWidth="3" />
          <text x={step.x} y={step.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="900">{step.label}</text>
        </g>
      ))}
    </g>
  );
}

function ConceptVisual({ accent, scale }: { accent: string; scale: number }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">concept connection</text>
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 6;
        const x = 210 + Math.cos(angle) * 86 * scale;
        const y = 120 + Math.sin(angle) * 58 * scale;
        return <g key={index}><line x1="210" y1="120" x2={x} y2={y} stroke={accent} opacity="0.35" strokeWidth="3" /><circle cx={x} cy={y} r="20" fill={accent} opacity="0.78" /></g>;
      })}
      <circle cx="210" cy="120" r="34" fill="#0f172a" stroke={accent} strokeWidth="4" />
    </g>
  );
}

function RelationsVisual({ accent }: { accent: string }) {
  const left = ["1", "2", "3"];
  const right = ["a", "b", "c"];
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">relation and function map</text>
      {left.map((item, index) => <circle key={item} cx="92" cy={78 + index * 46} r="18" fill="#0f172a" stroke={accent} strokeWidth="3" />)}
      {right.map((item, index) => <circle key={item} cx="320" cy={78 + index * 46} r="18" fill="#0f172a" stroke={accent} strokeWidth="3" />)}
      {left.map((item, index) => <text key={`l-${item}`} x="87" y={83 + index * 46} fill="#f8fafc" fontSize="14" fontWeight="900">{item}</text>)}
      {right.map((item, index) => <text key={`r-${item}`} x="315" y={83 + index * 46} fill="#f8fafc" fontSize="14" fontWeight="900">{item}</text>)}
      {[0, 1, 2].map((index) => <line key={index} x1="110" y1={78 + index * 46} x2="302" y2={78 + ((index + 1) % 3) * 46} stroke={accent} strokeWidth="4" opacity="0.75" />)}
      <text x="106" y="208" fill="#cbd5e1" fontSize="13" fontWeight="800">one input arrow each</text>
    </g>
  );
}

function InverseTrigVisual({ accent }: { accent: string }) {
  const points = Array.from({ length: 80 }).map((_, index) => {
    const x = -Math.PI / 2 + (index / 79) * Math.PI;
    return `${70 + (index / 79) * 280},${126 - Math.sin(x) * 62}`;
  }).join(" ");
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">restricted sine for inverse</text>
      <line x1="54" y1="126" x2="374" y2="126" stroke="#64748b" strokeWidth="2" />
      <line x1="210" y1="52" x2="210" y2="190" stroke="#64748b" strokeWidth="2" />
      <polyline points={points} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <rect x="70" y="54" width="280" height="144" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 7" />
      <text x="112" y="215" fill="#cbd5e1" fontSize="13" fontWeight="800">domain cut creates arcsin</text>
    </g>
  );
}

function MatrixVisual({ accent, seed }: { accent: string; seed: number }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">matrix grid</text>
      {Array.from({ length: 9 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (
          <g key={index}>
            <rect x={118 + col * 58} y={58 + row * 46} width="46" height="36" rx="8" fill={index % 2 ? "#0f172a" : accent} opacity={index % 2 ? 1 : 0.32} stroke={accent} strokeWidth="2" />
            <text x={135 + col * 58} y={81 + row * 46} fill="#f8fafc" fontSize="13" fontWeight="900">{seed + index}</text>
          </g>
        );
      })}
      <text x="106" y="214" fill="#cbd5e1" fontSize="13" fontWeight="800">rows x columns organize transformations</text>
    </g>
  );
}

function DeterminantVisual({ accent, depthShift }: { accent: string; depthShift: number }) {
  const skew = 28 + depthShift;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">determinant as area scale</text>
      <rect x="78" y="82" width="82" height="82" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
      <polygon points={`${242},${164} ${242 + skew},${74} ${342 + skew},${74} 342,164`} fill={accent} opacity="0.24" stroke={accent} strokeWidth="4" />
      <line x1="160" y1="123" x2="232" y2="123" stroke="#f8fafc" strokeWidth="3" />
      <text x="116" y="206" fill="#cbd5e1" fontSize="13" fontWeight="800">unit square becomes parallelogram</text>
    </g>
  );
}

function ContinuityVisual({ accent }: { accent: string }) {
  const points = Array.from({ length: 80 }).map((_, index) => {
    const x = -3 + (index / 79) * 6;
    return `${56 + (index / 79) * 312},${124 - (0.22 * x * x - 1) * 38}`;
  }).join(" ");
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">continuity check</text>
      <polyline points={points} fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <circle cx="210" cy="162" r="9" fill="#020617" stroke="#f59e0b" strokeWidth="4" />
      <circle cx="210" cy="162" r="4" fill="#f59e0b" />
      <text x="96" y="210" fill="#cbd5e1" fontSize="13" fontWeight="800">left limit = value = right limit</text>
    </g>
  );
}

function DerivativeVisual({ accent }: { accent: string }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">tangent slope</text>
      <path d="M54 180 C130 46 256 62 366 142" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      <line x1="124" y1="142" x2="316" y2="86" stroke="#f59e0b" strokeWidth="4" />
      <circle cx="218" cy="111" r="9" fill="#f59e0b" />
      <text x="122" y="210" fill="#cbd5e1" fontSize="13" fontWeight="800">instantaneous rate of change</text>
    </g>
  );
}

function IntegralVisual({ accent }: { accent: string }) {
  const bars = Array.from({ length: 8 });
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">area accumulation</text>
      {bars.map((_, index) => {
        const h = 34 + Math.sin(index * 0.55) * 20 + index * 5;
        return <rect key={index} x={72 + index * 34} y={176 - h} width="28" height={h} fill={accent} opacity="0.32" stroke={accent} />;
      })}
      <path d="M64 172 C122 90 212 84 350 62" fill="none" stroke="#f8fafc" strokeWidth="4" />
      <line x1="56" y1="176" x2="360" y2="176" stroke="#94a3b8" strokeWidth="3" />
      <text x="132" y="212" fill="#cbd5e1" fontSize="13" fontWeight="800">sum rectangles under curve</text>
    </g>
  );
}

function DifferentialVisual({ accent }: { accent: string }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">slope field</text>
      {Array.from({ length: 35 }).map((_, index) => {
        const col = index % 7;
        const row = Math.floor(index / 7);
        const x = 70 + col * 46;
        const y = 62 + row * 30;
        const angle = (col - 3) * 0.18 + (row - 2) * 0.12;
        return <line key={index} x1={x - 12 * Math.cos(angle)} y1={y - 12 * Math.sin(angle)} x2={x + 12 * Math.cos(angle)} y2={y + 12 * Math.sin(angle)} stroke={accent} strokeWidth="3" strokeLinecap="round" />;
      })}
      <path d="M72 170 C150 130 212 128 342 72" fill="none" stroke="#f59e0b" strokeWidth="4" />
      <text x="126" y="212" fill="#cbd5e1" fontSize="13" fontWeight="800">solutions follow local slopes</text>
    </g>
  );
}

function VectorVisual({ accent, depthShift }: { accent: string; depthShift: number }) {
  const endX = 280 + depthShift;
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">vector components</text>
      <line x1="76" y1="172" x2="360" y2="172" stroke="#64748b" strokeWidth="2" />
      <line x1="76" y1="172" x2="76" y2="52" stroke="#64748b" strokeWidth="2" />
      <line x1="86" y1="164" x2={endX} y2="82" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      <polygon points={`${endX},82 ${endX - 18},78 ${endX - 9},96`} fill={accent} />
      <line x1="86" y1="164" x2={endX} y2="164" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" />
      <line x1={endX} y1="164" x2={endX} y2="82" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" />
      <text x="122" y="212" fill="#cbd5e1" fontSize="13" fontWeight="800">horizontal plus vertical movement</text>
    </g>
  );
}

function Space3DVisual({ accent, depthShift }: { accent: string; depthShift: number }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">3D coordinate model</text>
      <line x1="104" y1="176" x2="330" y2="176" stroke="#94a3b8" strokeWidth="3" />
      <line x1="104" y1="176" x2="104" y2="58" stroke="#94a3b8" strokeWidth="3" />
      <line x1="104" y1="176" x2={168 + depthShift} y2="116" stroke="#94a3b8" strokeWidth="3" />
      <polygon points="174,116 302,92 330,154 204,178" fill={accent} opacity="0.2" stroke={accent} strokeWidth="3" />
      <circle cx="244" cy="124" r="9" fill="#f59e0b" />
      <text x="135" y="212" fill="#cbd5e1" fontSize="13" fontWeight="800">point, plane, and axes</text>
    </g>
  );
}

function LinearProgrammingVisual({ accent }: { accent: string }) {
  return (
    <g>
      <text x="26" y="34" fill="#e0f2fe" fontSize="15" fontWeight="900">linear programming region</text>
      <line x1="62" y1="178" x2="362" y2="178" stroke="#94a3b8" strokeWidth="3" />
      <line x1="62" y1="178" x2="62" y2="50" stroke="#94a3b8" strokeWidth="3" />
      <polygon points="64,178 64,104 146,76 286,132 236,178" fill={accent} opacity="0.28" stroke={accent} strokeWidth="4" />
      <line x1="60" y1="104" x2="332" y2="42" stroke="#f59e0b" strokeWidth="3" />
      <line x1="118" y1="48" x2="316" y2="178" stroke="#f59e0b" strokeWidth="3" />
      {[64,146,286,236].map((x, index) => <circle key={index} cx={x} cy={[178,76,132,178][index]} r="6" fill="#f8fafc" />)}
      <text x="112" y="212" fill="#cbd5e1" fontSize="13" fontWeight="800">test corner points for optimum</text>
    </g>
  );
}

function Syllabus2DCanvas({ mode, nodes, accent, spread }: { mode: ViewMode; nodes: string[]; accent: string; spread: number }) {
  const width = 720;
  const height = 460;
  const center = { x: width / 2, y: height / 2 };
  const radius = 145 * spread;
  const points = nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(nodes.length, 1) - Math.PI / 2;
    return { node, x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius, angle };
  });

  return (
    <svg className="mt-3 h-[430px] w-full rounded-xl bg-slate-950" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${mode} 2D syllabus visual`}>
      <defs>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={width} height={height} fill="#020617" />
      {mode === "graph" && Array.from({ length: 12 }).map((_, index) => <line key={`gx-${index}`} x1={40 + index * 58} y1={40} x2={40 + index * 58} y2={420} stroke="#1e293b" />)}
      {mode === "graph" && Array.from({ length: 7 }).map((_, index) => <line key={`gy-${index}`} x1={40} y1={55 + index * 55} x2={680} y2={55 + index * 55} stroke="#1e293b" />)}
      {mode === "measurement" && points.map((point, index) => {
        const size = 34 + (index % 4) * 14;
        return <rect key={point.node} x={point.x - size / 2} y={point.y - size / 2} width={size} height={size} rx={6} fill="none" stroke={accent} strokeWidth="3" opacity={0.8} />;
      })}
      {mode !== "measurement" && points.map((point) => <line key={`line-${point.node}`} x1={center.x} y1={center.y} x2={point.x} y2={point.y} stroke={accent} strokeWidth="2" opacity={0.35} />)}
      {mode === "graph" && (
        <polyline
          points={points.map((point, index) => `${70 + index * (580 / Math.max(points.length - 1, 1))},${350 - (index % 5) * 52 - (index * 9) % 35}`).join(" ")}
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#soft-glow)"
        />
      )}
      <circle cx={center.x} cy={center.y} r="58" fill={accent} opacity="0.18" />
      <circle cx={center.x} cy={center.y} r="42" fill="#0f172a" stroke={accent} strokeWidth="3" />
      <text x={center.x} y={center.y - 4} textAnchor="middle" fill="#e0f2fe" fontSize="15" fontWeight="800">Syllabus</text>
      <text x={center.x} y={center.y + 17} textAnchor="middle" fill="#94a3b8" fontSize="12">2D</text>
      {points.map((point, index) => (
        <g key={point.node}>
          <circle cx={point.x} cy={point.y} r="27" fill="#0f172a" stroke={accent} strokeWidth="3" />
          <text x={point.x} y={point.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="800">{index + 1}</text>
          <text x={point.x} y={point.y + 45} textAnchor="middle" fill="#cbd5e1" fontSize="12">
            {point.node.length > 18 ? `${point.node.slice(0, 17)}...` : point.node}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Syllabus3DScene({ nodes, accent, depth, animate }: { nodes: string[]; accent: string; depth: number; animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = new THREE.Color(accent);
  useFrame((_, delta) => {
    if (groupRef.current && animate) groupRef.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={groupRef}>
      <gridHelper args={[8, 16, "#38bdf8", "#334155"]} position={[0, -1.8, 0]} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.48, 36, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.24} metalness={0.22} />
      </mesh>
      {nodes.map((node, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(nodes.length, 1);
        const radius = 2.1 + (index % 3) * 0.32;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(index * 0.9) * depth * 0.45;
        return (
          <group key={node} position={[x, y, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.48 + (index % 4) * 0.12, 0.48]} />
              <meshStandardMaterial color={color} roughness={0.32} metalness={0.18} transparent opacity={0.86} />
            </mesh>
            <mesh position={[-x / 2, -y / 2, -z / 2]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.018, 0.018, Math.hypot(x, y, z), 12]} />
              <meshStandardMaterial color="#e2e8f0" transparent opacity={0.34} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
