import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ArrowLeft, Box, Layers3, Network, Shapes } from "lucide-react";
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
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-950/40">
              <input type="checkbox" checked={animate} onChange={(event) => setAnimate(event.target.checked)} />
              Animate 3D model
            </label>
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

            <ThreeSceneWrapper height="520px" mobileHeight="430px" cameraPosition={[4.2, 3.2, 6]} fov={45} quality="high" chrome="cinematic" sceneLabel="3D syllabus model">
              <Syllabus3DScene nodes={nodes} accent={colorFor(topic.strand + topic.title)} depth={depth} animate={animate} />
              <OrbitControls enablePan={false} />
            </ThreeSceneWrapper>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Coverage Checklist" description={topic.sourceNote}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topic.topics.map((item, index) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Unit {index + 1}</p>
              <h3 className="mt-1 font-bold">{item}</h3>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
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
