import { Line, OrbitControls, Text } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import TopicTabs from "../../components/ui/TopicTabs";
import { degreesToRadians, roundTo } from "../../utils/math";

type TrigFunctionId = "sin" | "cos" | "tan" | "sec" | "csc" | "cot";

type TrigFunctionInfo = {
  id: TrigFunctionId;
  name: string;
  formula: string;
  reciprocal: string;
  period: string;
  domain: string;
  range: string;
  color: string;
  evaluate: (x: number) => number | null;
};

const functions: TrigFunctionInfo[] = [
  { id: "sin", name: "Sine", formula: "sin theta = y/r", reciprocal: "csc theta", period: "2pi", domain: "all real theta", range: "[-1, 1]", color: "#06b6d4", evaluate: Math.sin },
  { id: "cos", name: "Cosine", formula: "cos theta = x/r", reciprocal: "sec theta", period: "2pi", domain: "all real theta", range: "[-1, 1]", color: "#8b5cf6", evaluate: Math.cos },
  { id: "tan", name: "Tangent", formula: "tan theta = sin theta / cos theta", reciprocal: "cot theta", period: "pi", domain: "cos theta != 0", range: "all real values", color: "#f59e0b", evaluate: (x) => safeDivide(Math.sin(x), Math.cos(x)) },
  { id: "sec", name: "Secant", formula: "sec theta = 1 / cos theta", reciprocal: "cos theta", period: "2pi", domain: "cos theta != 0", range: "(-inf, -1] U [1, inf)", color: "#ef4444", evaluate: (x) => safeDivide(1, Math.cos(x)) },
  { id: "csc", name: "Cosecant", formula: "csc theta = 1 / sin theta", reciprocal: "sin theta", period: "2pi", domain: "sin theta != 0", range: "(-inf, -1] U [1, inf)", color: "#10b981", evaluate: (x) => safeDivide(1, Math.sin(x)) },
  { id: "cot", name: "Cotangent", formula: "cot theta = cos theta / sin theta", reciprocal: "tan theta", period: "pi", domain: "sin theta != 0", range: "all real values", color: "#ec4899", evaluate: (x) => safeDivide(Math.cos(x), Math.sin(x)) },
];

export default function TrigonometricFunctionsVisualizer() {
  const [selectedId, setSelectedId] = useState<TrigFunctionId>("sin");
  const [degrees, setDegrees] = useState(readInitialThetaDegrees);
  const selected = functions.find((item) => item.id === selectedId) ?? functions[0];
  const theta = degreesToRadians(degrees);
  const value = selected.evaluate(theta);

  return (
    <SectionCard title="Trigonometric Functions" description="All six core functions in compact 2D, ratio, and Three.js 3D views.">
      <TopicTabs
        initialId="all"
        tabs={[
          { id: "all", label: "All Functions", content: <FunctionOverview selectedId={selectedId} onSelect={setSelectedId} /> },
          { id: "graphs", label: "2D Graphs", content: <GraphTab selected={selected} selectedId={selectedId} setSelectedId={setSelectedId} degrees={degrees} setDegrees={setDegrees} value={value} /> },
          { id: "circle", label: "Ratios", content: <RatioTab selected={selected} degrees={degrees} setDegrees={setDegrees} value={value} /> },
          { id: "space", label: "3D View", content: <TrigSurfaceTab selectedId={selectedId} setSelectedId={setSelectedId} /> },
        ]}
      />
    </SectionCard>
  );
}

function FunctionOverview({ selectedId, onSelect }: { selectedId: TrigFunctionId; onSelect: (id: TrigFunctionId) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {functions.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`rounded-lg border p-3 text-left transition ${selectedId === item.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/50 dark:bg-cyan-400/10" : "border-slate-200 bg-white/75 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">{item.name}</p>
              <p className="mt-1 font-mono text-[12px] text-slate-600 dark:text-slate-300">{item.formula}</p>
            </div>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
          </div>
          <MiniGraph fn={item} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <MiniFact label="period" value={item.period} />
            <MiniFact label="reciprocal" value={item.reciprocal} />
            <MiniFact label="domain" value={item.domain} wide />
            <MiniFact label="range" value={item.range} wide />
          </div>
        </button>
      ))}
    </div>
  );
}

function GraphTab({
  selected,
  selectedId,
  setSelectedId,
  degrees,
  setDegrees,
  value,
}: {
  selected: TrigFunctionInfo;
  selectedId: TrigFunctionId;
  setSelectedId: (id: TrigFunctionId) => void;
  degrees: number;
  setDegrees: (value: number) => void;
  value: number | null;
}) {
  const [showAll, setShowAll] = useState(true);
  return (
    <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-3">
        <FunctionPicker selectedId={selectedId} setSelectedId={setSelectedId} />
        <SliderControl label="theta" value={degrees} min={-360} max={360} step={1} unit="deg" onChange={setDegrees} />
        <FormulaBlock title={selected.name} formula={selected.formula} />
        <div className="grid grid-cols-2 gap-2">
          <MiniFact label="value" value={value === null ? "undefined" : roundTo(value, 3).toString()} />
          <MiniFact label="period" value={selected.period} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setShowAll(true)} className={showAll ? "action-primary py-2 text-xs" : "tool-button py-2 text-xs"}>All 6</button>
          <button type="button" onClick={() => setShowAll(false)} className={!showAll ? "action-primary py-2 text-xs" : "tool-button py-2 text-xs"}>Focus</button>
        </div>
      </div>
      {showAll ? (
        <div className="grid gap-3 md:grid-cols-2">
          {functions.map((item) => (
            <article key={item.id} className={`rounded-lg border bg-white p-2 dark:bg-slate-950/40 ${selectedId === item.id ? "border-cyan-300 dark:border-cyan-300/50" : "border-slate-200 dark:border-white/10"}`}>
              <div className="mb-1 flex items-center justify-between gap-2 px-1">
                <p className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">{item.name}</p>
                <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">y={item.id}(theta)</span>
              </div>
              <FunctionGraph selected={item} theta={degreesToRadians(degrees)} compact />
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-lg border border-cyan-300 bg-white p-2 dark:border-cyan-300/50 dark:bg-slate-950/40">
          <div className="mb-1 flex items-center justify-between gap-2 px-1">
            <p className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">{selected.name}</p>
            <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">y={selected.id}(theta)</span>
          </div>
          <FunctionGraph selected={selected} theta={degreesToRadians(degrees)} />
        </article>
      )}
    </div>
  );
}

function RatioTab({ selected, degrees, setDegrees, value }: { selected: TrigFunctionInfo; degrees: number; setDegrees: (value: number) => void; value: number | null }) {
  const theta = degreesToRadians(degrees);
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = safeDivide(sin, cos);

  return (
    <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-3">
        <SliderControl label="theta" value={degrees} min={0} max={360} step={1} unit="deg" onChange={setDegrees} />
        <div className="grid grid-cols-2 gap-2">
          <MiniFact label="sin" value={roundTo(sin, 3).toString()} />
          <MiniFact label="cos" value={roundTo(cos, 3).toString()} />
          <MiniFact label="tan" value={tan === null ? "undefined" : roundTo(tan, 3).toString()} />
          <MiniFact label={selected.id} value={value === null ? "undefined" : roundTo(value, 3).toString()} />
        </div>
        <p className="rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-white/10 dark:text-slate-300">
          Sine and cosine are projections. Tangent, cotangent, secant, and cosecant appear when a projection is used as a denominator.
        </p>
      </div>
      <UnitCircleRatios theta={theta} selected={selected} />
    </div>
  );
}

function TrigSurfaceTab({
  selectedId,
  setSelectedId,
}: {
  selectedId: TrigFunctionId;
  setSelectedId: (id: TrigFunctionId) => void;
}) {
  const selected = functions.find((item) => item.id === selectedId) ?? functions[0];
  return (
    <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-3">
        <FunctionPicker selectedId={selectedId} setSelectedId={setSelectedId} />
        <div className="rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-white/10 dark:text-slate-300">
          All six functions are drawn as separate 3D ribbons. The selected function is brighter; drag the scene to compare period, height, and asymptote behavior.
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MiniFact label="selected" value={selected.name} />
          <MiniFact label="period" value={selected.period} />
          <MiniFact label="domain" value={selected.domain} wide />
          <MiniFact label="range" value={selected.range} wide />
        </div>
      </div>
      <ThreeSceneWrapper height="560px" mobileHeight="460px" cameraPosition={[5.8, 4.4, 7.2]} fov={43} quality="high" chrome="cinematic" sceneLabel="six trigonometric surfaces" interactionLabel="Drag rotate - scroll zoom">
        <AllTrigSurfaces selectedId={selectedId} />
        <gridHelper args={[9, 18, "#38bdf8", "#334155"]} />
        <OrbitControls enableDamping />
      </ThreeSceneWrapper>
    </div>
  );
}

function FunctionPicker({ selectedId, setSelectedId }: { selectedId: TrigFunctionId; setSelectedId: (id: TrigFunctionId) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {functions.map((item) => (
        <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={selectedId === item.id ? "action-primary justify-center px-2 py-2 text-xs" : "tool-button justify-center px-2 py-2 text-xs"}>
          {item.id}
        </button>
      ))}
    </div>
  );
}

function FunctionGraph({ selected, theta, compact = false }: { selected: TrigFunctionInfo; theta: number; compact?: boolean }) {
  const width = 720;
  const height = compact ? 190 : 300;
  const graphLimit = 2.3;
  const yScale = height / (graphLimit * 2.25);
  const points = sampledSegments(selected, width, height, graphLimit);
  const xMarker = ((theta + Math.PI * 2) / (Math.PI * 4)) * width;
  const markerValue = selected.evaluate(theta);
  const markerInRange = markerValue !== null && Number.isFinite(markerValue) && Math.abs(markerValue) <= graphLimit;
  const yMarker = markerInRange ? height / 2 - markerValue * yScale : null;
  const offScaleValue = markerValue !== null && Number.isFinite(markerValue) && Math.abs(markerValue) > graphLimit ? markerValue : null;
  const yOffScale = offScaleValue !== null
    ? height / 2 - Math.sign(offScaleValue) * graphLimit * yScale
    : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`${compact ? "h-[190px]" : "h-[300px]"} w-full`}>
      <Grid2D width={width} height={height} />
      {points.map((path, index) => <path key={index} d={path} fill="none" stroke={selected.color} strokeWidth="3" />)}
      <line x1={xMarker} x2={xMarker} y1="18" y2={height - 18} stroke="#0f172a" strokeDasharray="5 5" opacity="0.55" />
      {yMarker !== null && <circle cx={xMarker} cy={yMarker} r="6" fill={selected.color} stroke="#0f172a" strokeWidth="2" />}
      {yOffScale !== null && offScaleValue !== null && (
        <g>
          <path d={`M ${xMarker - 7} ${yOffScale} L ${xMarker + 7} ${yOffScale} L ${xMarker} ${yOffScale + (offScaleValue > 0 ? -11 : 11)} Z`} fill={selected.color} stroke="#0f172a" strokeWidth="1.5" />
          {!compact && <text x={Math.min(width - 118, xMarker + 10)} y={offScaleValue > 0 ? yOffScale + 16 : yOffScale - 8} className="fill-slate-700 text-[12px] font-bold dark:fill-slate-200">off graph: {roundTo(offScaleValue, 2)}</text>}
        </g>
      )}
      {!compact && <text x="16" y="28" className="fill-slate-700 text-[13px] font-bold dark:fill-slate-200">y = {selected.id}(theta), theta from -2pi to 2pi</text>}
    </svg>
  );
}

function UnitCircleRatios({ theta, selected }: { theta: number; selected: TrigFunctionInfo }) {
  const cx = 220;
  const cy = 185;
  const r = 120;
  const x = cx + Math.cos(theta) * r;
  const y = cy - Math.sin(theta) * r;
  const tangentY = cy - safeNumber(Math.tan(theta)) * 52;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/40">
      <svg viewBox="0 0 520 360" className="h-[360px] w-full">
        <rect width="520" height="360" rx="12" fill="#f8fafc" />
        <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.1" stroke="#06b6d4" strokeWidth="3" />
        <line x1="60" x2="420" y1={cy} y2={cy} stroke="#94a3b8" />
        <line x1={cx} x2={cx} y1="40" y2="320" stroke="#94a3b8" />
        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#8b5cf6" strokeWidth="4" />
        <line x1={x} y1={cy} x2={x} y2={y} stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" />
        <line x1={cx} y1={cy} x2={x} y2={cy} stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 4" />
        <line x1={cx + r} y1="45" x2={cx + r} y2="315" stroke="#f59e0b" strokeWidth="2" />
        {Number.isFinite(tangentY) && Math.abs(tangentY - cy) < 150 && <line x1={cx} y1={cy} x2={cx + r} y2={tangentY} stroke="#f59e0b" strokeWidth="3" />}
        <circle cx={x} cy={y} r="7" fill={selected.color} stroke="#0f172a" strokeWidth="2" />
        <Label x={x + 12} y={y - 10} text={`selected: ${selected.id}`} />
        <Label x={x - 44} y={cy + 24} text="cos" />
        <Label x={x + 12} y={(y + cy) / 2} text="sin" />
        <Label x={cx + r + 10} y={tangentY} text="tan line" />
      </svg>
    </div>
  );
}

function MiniGraph({ fn }: { fn: TrigFunctionInfo }) {
  const paths = sampledSegments(fn, 250, 68, 2.1);
  return (
    <svg viewBox="0 0 250 68" className="mt-3 h-16 w-full rounded-md bg-slate-50 dark:bg-slate-950/60">
      <line x1="0" x2="250" y1="34" y2="34" stroke="#cbd5e1" />
      {paths.map((path, index) => <path key={index} d={path} fill="none" stroke={fn.color} strokeWidth="2.4" />)}
    </svg>
  );
}

function AllTrigSurfaces({ selectedId }: { selectedId: TrigFunctionId }) {
  return (
    <group rotation={[0, -0.08, 0]}>
      {functions.map((item, index) => (
        <TrigRibbon key={item.id} fn={item} row={index} active={item.id === selectedId} />
      ))}
    </group>
  );
}

function TrigRibbon({ fn, row, active }: { fn: TrigFunctionInfo; row: number; active: boolean }) {
  const zOffset = (row - 2.5) * 1.15;
  const geometry = useMemo(() => {
    const xSteps = 88;
    const zSteps = 6;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const color = new THREE.Color(fn.color);

    for (let iz = 0; iz < zSteps; iz += 1) {
      const stripDepth = -0.28 + (iz / (zSteps - 1)) * 0.56;
      for (let ix = 0; ix < xSteps; ix += 1) {
        const x = -Math.PI * 2 + (ix / (xSteps - 1)) * Math.PI * 4;
        const raw = fn.evaluate(x);
        const y = raw === null ? 0 : clamp(raw, -2.8, 2.8) * 0.34;
        positions.push((x / (Math.PI * 2)) * 3.2, y, zOffset + stripDepth);
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let iz = 0; iz < zSteps - 1; iz += 1) {
      for (let ix = 0; ix < xSteps - 1; ix += 1) {
        const a = iz * xSteps + ix;
        indices.push(a, a + 1, a + xSteps, a + 1, a + xSteps + 1, a + xSteps);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [fn, zOffset]);

  const curve = useMemo(() => {
    return Array.from({ length: 150 }, (_, index) => {
      const x = -Math.PI * 2 + (index / 149) * Math.PI * 4;
      const raw = fn.evaluate(x);
      return new THREE.Vector3((x / (Math.PI * 2)) * 3.2, raw === null ? 0 : clamp(raw, -2.8, 2.8) * 0.34 + 0.035, zOffset - 0.33);
    });
  }, [fn, zOffset]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.4} metalness={0.06} transparent opacity={active ? 0.96 : 0.55} />
      </mesh>
      <Line points={curve} color={active ? "#ffffff" : fn.color} lineWidth={active ? 2.5 : 1.4} />
      <Text position={[-3.65, 0.62, zOffset - 0.36]} fontSize={0.14} color={active ? "#ffffff" : "#cbd5e1"} anchorX="left">
        {fn.id}
      </Text>
    </group>
  );
}

function sampledSegments(fn: TrigFunctionInfo, width: number, height: number, limit: number) {
  const paths: string[] = [];
  let current = "";
  for (let i = 0; i <= width; i += 1) {
    const x = -Math.PI * 2 + (i / width) * Math.PI * 4;
    const value = fn.evaluate(x);
    if (value === null || Math.abs(value) > limit || !Number.isFinite(value)) {
      if (current) paths.push(current);
      current = "";
      continue;
    }
    const y = height / 2 - value * (height / (limit * 2.25));
    current += `${current ? " L" : "M"}${i.toFixed(1)},${y.toFixed(1)}`;
  }
  if (current) paths.push(current);
  return paths;
}

function Grid2D({ width, height }: { width: number; height: number }) {
  return (
    <g opacity="0.7">
      {Array.from({ length: 9 }).map((_, index) => <line key={`x-${index}`} x1={(index / 8) * width} x2={(index / 8) * width} y1="0" y2={height} stroke="#e2e8f0" />)}
      {Array.from({ length: 7 }).map((_, index) => <line key={`y-${index}`} x1="0" x2={width} y1={(index / 6) * height} y2={(index / 6) * height} stroke="#e2e8f0" />)}
      <line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#64748b" />
    </g>
  );
}

function MiniFact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-lg bg-slate-100 p-2 dark:bg-white/10 ${wide ? "col-span-2" : ""}`}>
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-[12px] font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return <text x={x} y={y} fill="#0f172a" fontSize="13" fontWeight="800">{text}</text>;
}

function safeDivide(numerator: number, denominator: number) {
  if (Math.abs(denominator) < 0.025) return null;
  return numerator / denominator;
}

function safeNumber(value: number | null) {
  return value === null ? Number.NaN : value;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function readInitialThetaDegrees() {
  if (typeof window === "undefined") return 45;
  const params = new URLSearchParams(window.location.search);
  const rawTheta = params.get("v_theta") ?? params.get("v_angle_theta");
  const parsed = Number(rawTheta);
  return Number.isFinite(parsed) ? clamp(parsed, -360, 360) : 45;
}
