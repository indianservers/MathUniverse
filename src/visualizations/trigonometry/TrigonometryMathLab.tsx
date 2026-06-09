import { Line, OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Calculator, CircleDot, Mountain, Pause, Play, RadioTower, RotateCcw, RotateCw, Triangle, Waves, ZoomIn, ZoomOut } from "lucide-react";
import { type PointerEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { degreesToRadians, roundTo } from "../../utils/math";

type LabMode = "unit-circle" | "triangle" | "wave" | "identity" | "inverse" | "navigation";
type TrigFn = "sin" | "cos" | "tan";

const modes: Array<{ id: LabMode; label: string; icon: typeof CircleDot }> = [
  { id: "unit-circle", label: "Unit Circle", icon: CircleDot },
  { id: "triangle", label: "Triangle Ratios", icon: Triangle },
  { id: "wave", label: "Waves", icon: Waves },
  { id: "identity", label: "Identities", icon: Calculator },
  { id: "inverse", label: "Inverse", icon: Mountain },
  { id: "navigation", label: "Heights", icon: RadioTower },
];

export default function TrigonometryMathLab({ compact = false }: { compact?: boolean }) {
  const [searchParams] = useSearchParams();
  const initialAngle = clamp(Number(searchParams.get("v_angle_theta") ?? 45), -360, 360);
  const initialRadius = clamp(Number(searchParams.get("v_radius_scale") ?? 120), 70, 180);
  const [mode, setMode] = useState<LabMode>("unit-circle");
  const [fn, setFn] = useState<TrigFn>("sin");
  const [angle, setAngle] = useState(initialAngle);
  const [radius, setRadius] = useState(initialRadius);
  const [amplitude, setAmplitude] = useState(2);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [distance, setDistance] = useState(160);
  const [animate2d, setAnimate2d] = useState(false);
  const [animate3d, setAnimate3d] = useState(true);
  const [diagramZoom, setDiagramZoom] = useState(1.25);
  const [diagramRotation, setDiagramRotation] = useState(0);
  const [graphZoom, setGraphZoom] = useState(1.15);
  const [graphRotation, setGraphRotation] = useState(0);
  const [zoom3d, setZoom3d] = useState(1);

  const theta = degreesToRadians(angle);
  const values = computeValues(theta, radius, amplitude, frequency, phase, distance, fn);

  return (
    <SectionCard
      title="Trigonometry Math Lab"
      description="Interactive unit circle, triangle ratios, wave transforms, identities, inverse trig, heights, and 3D scenes."
      compact={compact}
    >
      <div className="grid min-w-0 gap-4 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {modes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border px-2 text-center text-xs font-black transition ${
                    mode === item.id
                      ? "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100"
                      : "border-slate-200 bg-white/75 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["sin", "cos", "tan"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setFn(item)} className={fn === item ? "action-primary justify-center px-2 py-2 text-xs" : "tool-button justify-center px-2 py-2 text-xs"}>
                {item}
              </button>
            ))}
          </div>
          <SliderControl label="Angle theta" value={angle} min={mode === "triangle" || mode === "navigation" ? 5 : -360} max={mode === "triangle" || mode === "navigation" ? 85 : 360} step={1} unit="deg" onChange={setAngle} />
          {(mode === "unit-circle" || mode === "identity" || mode === "inverse") && <SliderControl label="Radius / scale" value={radius} min={70} max={180} step={5} onChange={setRadius} />}
          {mode === "wave" && (
            <>
              <SliderControl label="Amplitude" value={amplitude} min={0.5} max={5} step={0.1} onChange={setAmplitude} />
              <SliderControl label="Frequency" value={frequency} min={0.5} max={5} step={0.1} onChange={setFrequency} />
              <SliderControl label="Phase" value={phase} min={-180} max={180} step={1} unit="deg" onChange={setPhase} />
            </>
          )}
          {(mode === "triangle" || mode === "navigation") && <SliderControl label="Distance / hypotenuse" value={distance} min={80} max={260} step={5} onChange={setDistance} />}
          <MetricGrid mode={mode} values={values} fn={fn} />
        </div>

        <div className="min-w-0 space-y-3">
          <div className="grid min-w-0 gap-3 2xl:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">2D interactive diagram</p>
                <span className="mini-chip">drag/tap theta</span>
              </div>
              <ViewControlBar
                label="2D"
                zoom={diagramZoom}
                rotation={diagramRotation}
                playing={animate2d}
                onZoomIn={() => setDiagramZoom((value) => clamp(roundTo(value + 0.1, 2), 0.55, 2.25))}
                onZoomOut={() => setDiagramZoom((value) => clamp(roundTo(value - 0.1, 2), 0.55, 2.25))}
                onRotateLeft={() => setDiagramRotation((value) => value - 15)}
                onRotateRight={() => setDiagramRotation((value) => value + 15)}
                onReset={() => {
                  setDiagramZoom(1.25);
                  setDiagramRotation(0);
                  setAnimate2d(false);
                }}
                onTogglePlay={() => setAnimate2d((value) => !value)}
              />
              <TrigLabSvg mode={mode} fn={fn} angle={angle} theta={theta} radius={radius} amplitude={amplitude} frequency={frequency} phase={phase} distance={distance} zoom={diagramZoom} rotation={diagramRotation} animate={animate2d} onAngleChange={setAngle} />
            </div>
            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Live function graph</p>
                <span className="mini-chip">marker follows theta</span>
              </div>
              <ViewControlBar
                label="Graph"
                zoom={graphZoom}
                rotation={graphRotation}
                playing={animate2d}
                onZoomIn={() => setGraphZoom((value) => clamp(roundTo(value + 0.1, 2), 0.55, 2.25))}
                onZoomOut={() => setGraphZoom((value) => clamp(roundTo(value - 0.1, 2), 0.55, 2.25))}
                onRotateLeft={() => setGraphRotation((value) => value - 15)}
                onRotateRight={() => setGraphRotation((value) => value + 15)}
                onReset={() => {
                  setGraphZoom(1.15);
                  setGraphRotation(0);
                }}
                onTogglePlay={() => setAnimate2d((value) => !value)}
              />
              <GraphSvg fn={fn} angle={angle} amplitude={amplitude} frequency={frequency} phase={phase} zoom={graphZoom} rotation={graphRotation} animate={animate2d} />
            </div>
          </div>
          <ViewControlBar
            label="3D"
            zoom={zoom3d}
            rotation={0}
            playing={animate3d}
            onZoomIn={() => setZoom3d((value) => clamp(roundTo(value + 0.1, 2), 0.55, 2.25))}
            onZoomOut={() => setZoom3d((value) => clamp(roundTo(value - 0.1, 2), 0.55, 2.25))}
            onRotateLeft={() => setAngle((value) => value - 15)}
            onRotateRight={() => setAngle((value) => value + 15)}
            onReset={() => {
              setZoom3d(1);
              setAnimate3d(false);
            }}
            onTogglePlay={() => setAnimate3d((value) => !value)}
          />
          <TrigLab3D mode={mode} fn={fn} angle={angle} amplitude={amplitude} frequency={frequency} phase={phase} distance={distance} animate={animate3d} zoom={zoom3d} onToggleAnimate={() => setAnimate3d((value) => !value)} />
        </div>
      </div>
      {!compact && (
        <div className="mt-4">
          <VisualLearningPanel
            concept={modeConcept(mode)}
            formula={modeFormula(mode, fn)}
            changes="Move theta and the sliders. The diagram, graph, numeric values, and 3D scene update together."
            realWorldUse="Surveying, navigation, waves, signals, rotation, robotics, astronomy, and calculus."
            steps={[
              `theta = ${roundTo(angle, 2)} degrees.`,
              `${fn}(theta) = ${formatValue(values.selected)}`,
              mode === "navigation" ? `height = distance * tan(theta) = ${roundTo(values.height, 2)}` : `point = (${roundTo(values.cos, 3)}, ${roundTo(values.sin, 3)})`,
              "Switch tabs to compare the same mathematics in 2D, graph, and 3D.",
            ]}
            tasks={["Set theta to 30, 45, and 60 degrees.", "Compare sin, cos, and tan.", "Switch to Waves and change frequency.", "Switch to Heights and estimate a tower."]}
          />
        </div>
      )}
    </SectionCard>
  );
}

function TrigLabSvg({
  mode,
  fn,
  angle,
  theta,
  radius,
  amplitude,
  frequency,
  phase,
  distance,
  zoom,
  rotation,
  animate,
  onAngleChange,
}: {
  mode: LabMode;
  fn: TrigFn;
  angle: number;
  theta: number;
  radius: number;
  amplitude: number;
  frequency: number;
  phase: number;
  distance: number;
  zoom: number;
  rotation: number;
  animate: boolean;
  onAngleChange: (angle: number) => void;
}) {
  const animatedRotation = animate ? rotation + angle : rotation;
  const handlePointer = (event: PointerEvent<SVGSVGElement>) => {
    if (mode === "wave") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 760;
    const y = ((event.clientY - rect.top) / rect.height) * 460;
    const origin = mode === "triangle" || mode === "navigation" ? { x: 150, y: 355 } : { x: 360, y: 230 };
    const raw = Math.atan2(origin.y - y, x - origin.x) * (180 / Math.PI);
    const next = mode === "triangle" || mode === "navigation" ? clamp(raw, 5, 85) : clamp(raw, -360, 360);
    onAngleChange(roundTo(next, 0));
  };

  return (
    <svg
      viewBox="0 0 760 460"
      className="h-[460px] w-full touch-none sm:h-[540px]"
      role="application"
      aria-label="Interactive trigonometry diagram"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        handlePointer(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons === 1) handlePointer(event);
      }}
      onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
    >
      <rect width="760" height="460" rx="18" fill="#020617" />
      <Grid />
      <g transform={`translate(380 230) rotate(${animatedRotation}) scale(${zoom}) translate(-380 -230)`}>
        {mode === "wave" ? <WaveDiagram amplitude={amplitude} frequency={frequency} phase={phase} /> : null}
        {mode === "triangle" || mode === "navigation" ? <TriangleDiagram angle={angle} distance={distance} navigation={mode === "navigation"} /> : null}
        {mode === "unit-circle" || mode === "identity" || mode === "inverse" ? <CircleDiagram fn={fn} angle={angle} theta={theta} radius={radius} identity={mode === "identity"} inverse={mode === "inverse"} /> : null}
      </g>
    </svg>
  );
}

function CircleDiagram({ fn, angle, theta, radius, identity, inverse }: { fn: TrigFn; angle: number; theta: number; radius: number; identity: boolean; inverse: boolean }) {
  const cx = 360;
  const cy = 230;
  const r = radius;
  const x = cx + Math.cos(theta) * r;
  const y = cy - Math.sin(theta) * r;
  const tanY = cy - Math.tan(theta) * 72;
  const selected = fn === "sin" ? Math.sin(theta) : fn === "cos" ? Math.cos(theta) : Math.tan(theta);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#22d3ee" opacity="0.1" stroke="#67e8f9" strokeWidth="4" />
      <line x1="120" x2="620" y1={cy} y2={cy} stroke="#94a3b8" strokeWidth="2" />
      <line x1={cx} x2={cx} y1="40" y2="420" stroke="#94a3b8" strokeWidth="2" />
      <path d={`M ${cx + 44} ${cy} A 44 44 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle >= 0 ? 0 : 1} ${cx + Math.cos(theta) * 44} ${cy - Math.sin(theta) * 44}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#a78bfa" strokeWidth="5" />
      <line x1={x} y1={cy} x2={x} y2={y} stroke="#34d399" strokeWidth="4" strokeDasharray="7 5" />
      <line x1={cx} y1={y} x2={x} y2={y} stroke="#38bdf8" strokeWidth="4" strokeDasharray="7 5" />
      <line x1={cx + r} y1="55" x2={cx + r} y2="405" stroke="#f59e0b" strokeWidth="3" />
      {Number.isFinite(tanY) && Math.abs(tanY - cy) < 180 && <line x1={cx} y1={cy} x2={cx + r} y2={tanY} stroke="#f59e0b" strokeWidth="4" />}
      <circle cx={x} cy={y} r="9" fill="#f59e0b" stroke="#020617" strokeWidth="3" />
      <SvgLabel x={52} y={58} text={`${fn}(theta) = ${formatValue(selected)}`} />
      <SvgLabel x={x + 14} y={y - 12} text={`P(${roundTo(Math.cos(theta), 2)}, ${roundTo(Math.sin(theta), 2)})`} />
      <SvgLabel x={cx + 16} y={cy - 16} text={`${roundTo(angle, 1)} deg`} />
      {identity && <SvgLabel x={52} y={92} text={`sin^2 + cos^2 = ${roundTo(Math.sin(theta) ** 2 + Math.cos(theta) ** 2, 4)}`} />}
      {inverse && <SvgLabel x={52} y={92} text={`inverse angle from ${fn} value`} />}
    </g>
  );
}

function TriangleDiagram({ angle, distance, navigation }: { angle: number; distance: number; navigation: boolean }) {
  const theta = degreesToRadians(angle);
  const x0 = 105;
  const y0 = 372;
  const adjacent = navigation ? distance : distance * Math.cos(theta);
  const opposite = navigation ? distance * Math.tan(theta) : distance * Math.sin(theta);
  const scale = Math.min(1.75, 560 / Math.max(adjacent, opposite, 1));
  const adj = adjacent * scale;
  const opp = opposite * scale;
  return (
    <g>
      <polygon points={`${x0},${y0} ${x0 + adj},${y0} ${x0 + adj},${y0 - opp}`} fill="#22d3ee" opacity="0.18" stroke="#67e8f9" strokeWidth="5" />
      <path d={`M ${x0 + 46} ${y0} A 46 46 0 0 0 ${x0 + Math.cos(theta) * 46} ${y0 - Math.sin(theta) * 46}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <SvgLabel x={x0 + adj / 2 - 30} y={y0 + 32} text={navigation ? "distance" : "adjacent"} />
      <SvgLabel x={x0 + adj + 18} y={y0 - opp / 2} text={navigation ? "height" : "opposite"} />
      <SvgLabel x={x0 + adj / 2 - 34} y={y0 - opp / 2 - 22} text={navigation ? "line of sight" : "hypotenuse"} />
      <SvgLabel x={54} y={58} text={navigation ? `height = ${roundTo(opposite, 2)}` : `sin=${roundTo(Math.sin(theta), 3)} cos=${roundTo(Math.cos(theta), 3)}`} />
      <SvgLabel x={54} y={92} text={`tan(theta) = ${roundTo(Math.tan(theta), 3)}`} />
    </g>
  );
}

function WaveDiagram({ amplitude, frequency, phase }: { amplitude: number; frequency: number; phase: number }) {
  const phaseRad = degreesToRadians(phase);
  const path = Array.from({ length: 300 }, (_, index) => {
    const x = 70 + index * 2.05;
    const t = (index / 299) * Math.PI * 4;
    const y = 230 - amplitude * 38 * Math.sin(frequency * t + phaseRad);
    return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const cosPath = Array.from({ length: 300 }, (_, index) => {
    const x = 70 + index * 2.05;
    const t = (index / 299) * Math.PI * 4;
    const y = 230 - amplitude * 38 * Math.cos(frequency * t + phaseRad);
    return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <g>
      <line x1="54" x2="706" y1="230" y2="230" stroke="#94a3b8" strokeWidth="2" />
      <path d={path} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <path d={cosPath} fill="none" stroke="#fb7185" strokeWidth="4" opacity="0.85" />
      <SvgLabel x={54} y={58} text={`y=${roundTo(amplitude, 1)} sin(${roundTo(frequency, 1)}x + ${roundTo(phase, 0)}deg)`} />
      <SvgLabel x={54} y={92} text={`period = ${roundTo((2 * Math.PI) / frequency, 3)}`} />
    </g>
  );
}

function GraphSvg({ fn, angle, amplitude, frequency, phase, zoom, rotation, animate }: { fn: TrigFn; angle: number; amplitude: number; frequency: number; phase: number; zoom: number; rotation: number; animate: boolean }) {
  const width = 760;
  const height = 360;
  const phaseRad = degreesToRadians(phase);
  const normalizedTheta = wrapRadians(degreesToRadians(angle));
  const markerX = ((normalizedTheta + Math.PI * 2) / (Math.PI * 4)) * width;
  const markerRaw = trigValue(fn, frequency * normalizedTheta + phaseRad);
  const markerY = Number.isFinite(markerRaw) && Math.abs(markerRaw) <= 4 ? height / 2 - markerRaw * amplitude * 30 : null;
  const paths = graphSegments(fn, width, height, amplitude, frequency, phaseRad);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[360px] w-full sm:h-[430px]">
      <rect width={width} height={height} rx="18" fill="#020617" />
      <g transform={`translate(${width / 2} ${height / 2}) rotate(${animate ? rotation + angle : rotation}) scale(${zoom}) translate(${-width / 2} ${-height / 2})`}>
        <Grid width={width} height={height} />
        <line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#94a3b8" />
        {paths.map((path, index) => <path key={`${fn}-${index}`} d={path} fill="none" stroke={fn === "sin" ? "#22d3ee" : fn === "cos" ? "#fb7185" : "#f59e0b"} strokeWidth="4" />)}
        <line x1={markerX} x2={markerX} y1="24" y2={height - 24} stroke="#e2e8f0" strokeDasharray="6 6" opacity="0.7" />
        {markerY !== null && <circle cx={markerX} cy={markerY} r="7" fill="#ffffff" stroke={fn === "sin" ? "#22d3ee" : fn === "cos" ? "#fb7185" : "#f59e0b"} strokeWidth="4" />}
      </g>
      <SvgLabel x={24} y={34} text={`y = ${roundTo(amplitude, 1)} ${fn}(${roundTo(frequency, 1)}x + ${roundTo(phase, 0)}deg)`} />
    </svg>
  );
}

function graphSegments(fn: TrigFn, width: number, height: number, amplitude: number, frequency: number, phaseRad: number) {
  const paths: string[] = [];
  let current = "";
  let previousY: number | null = null;
  for (let index = 0; index <= width; index += 1) {
    const x = -Math.PI * 2 + (index / width) * Math.PI * 4;
    const raw = trigValue(fn, frequency * x + phaseRad);
    const jump = previousY !== null && Number.isFinite(raw) && Math.abs(raw - previousY) > 5;
    if (!Number.isFinite(raw) || Math.abs(raw) > 4 || jump) {
      if (current) paths.push(current);
      current = "";
      previousY = Number.isFinite(raw) ? raw : null;
      continue;
    }
    const y = height / 2 - raw * amplitude * 30;
    current += `${current ? " L" : "M"} ${index.toFixed(1)} ${y.toFixed(1)}`;
    previousY = raw;
  }
  if (current) paths.push(current);
  return paths;
}

function trigValue(fn: TrigFn, x: number) {
  if (fn === "sin") return Math.sin(x);
  if (fn === "cos") return Math.cos(x);
  return Math.tan(x);
}

function wrapRadians(value: number) {
  let result = value;
  while (result < -Math.PI * 2) result += Math.PI * 4;
  while (result > Math.PI * 2) result -= Math.PI * 4;
  return result;
}

function TrigLab3D({ mode, fn, angle, amplitude, frequency, phase, distance, animate, zoom, onToggleAnimate }: { mode: LabMode; fn: TrigFn; angle: number; amplitude: number; frequency: number; phase: number; distance: number; animate: boolean; zoom: number; onToggleAnimate: () => void }) {
  return (
    <ThreeSceneWrapper
      height="520px"
      mobileHeight="420px"
      cameraPosition={[4.8, 3.7, 6.5]}
      fov={44}
      quality="high"
      chrome="cinematic"
      sceneLabel={animate ? "trigonometry 3D lab - rotating" : "trigonometry 3D lab - paused"}
      interactionLabel="Left drag rotate - wheel/pinch zoom - right drag pan"
      toolbar={(
        <button type="button" className={animate ? "action-primary" : "tool-button"} onClick={onToggleAnimate}>
          {animate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {animate ? "Pause" : "Start"}
        </button>
      )}
    >
      <Trig3DScene mode={mode} fn={fn} angle={angle} amplitude={amplitude} frequency={frequency} phase={phase} distance={distance} animate={animate} zoom={zoom} />
      <OrbitControls enablePan enableZoom enableDamping autoRotate={animate} autoRotateSpeed={0.55} />
    </ThreeSceneWrapper>
  );
}

function Trig3DScene({ mode, fn, angle, amplitude, frequency, phase, distance, animate, zoom }: { mode: LabMode; fn: TrigFn; angle: number; amplitude: number; frequency: number; phase: number; distance: number; animate: boolean; zoom: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.y += delta * 0.22;
  });
  return (
    <group ref={ref} scale={zoom}>
      <gridHelper args={[8, 16, "#38bdf8", "#334155"]} position={[0, -1.6, 0]} />
      {mode === "triangle" || mode === "navigation" ? <Triangle3D angle={angle} distance={distance} /> : <Surface3D fn={fn} amplitude={amplitude} frequency={frequency} phase={phase} />}
      <Text position={[-3.4, 2.1, -2.8]} fontSize={0.16} color="#e0f2fe" anchorX="left">
        {modeConcept(mode)}
      </Text>
    </group>
  );
}

function ViewControlBar({
  label,
  zoom,
  rotation,
  playing,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  onTogglePlay,
}: {
  label: string;
  zoom: number;
  rotation: number;
  playing: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="mobile-safe-scroll thin-scrollbar mb-2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-white/5">
      <span className="mini-chip shrink-0">{label}</span>
      <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onZoomOut} aria-label={`${label} zoom out`}><ZoomOut className="h-4 w-4" /></button>
      <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onZoomIn} aria-label={`${label} zoom in`}><ZoomIn className="h-4 w-4" /></button>
      <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onRotateLeft} aria-label={`${label} rotate left`}><RotateCcw className="h-4 w-4" /></button>
      <button type="button" className="math-tool-button h-9 w-9 rounded-lg" onClick={onRotateRight} aria-label={`${label} rotate right`}><RotateCw className="h-4 w-4" /></button>
      <button type="button" className={playing ? "action-primary h-9 min-h-9 rounded-lg px-2" : "tool-button h-9 min-h-9 rounded-lg px-2"} onClick={onTogglePlay} aria-label={playing ? `${label} pause animation` : `${label} play animation`}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button type="button" className="tool-button h-9 min-h-9 rounded-lg px-2" onClick={onReset}>Reset</button>
      <span className="mini-chip shrink-0">Zoom {roundTo(zoom * 100, 0)}%</span>
      <span className="mini-chip shrink-0">Rot {roundTo(rotation, 0)} deg</span>
    </div>
  );
}

function Triangle3D({ angle, distance }: { angle: number; distance: number }) {
  const theta = degreesToRadians(angle);
  const adj = Math.cos(theta) * distance / 70;
  const opp = Math.sin(theta) * distance / 70;
  const a = new THREE.Vector3(-1.8, -1, 0);
  const b = new THREE.Vector3(-1.8 + adj, -1, 0);
  const c = new THREE.Vector3(-1.8 + adj, -1 + opp, 0.8);
  return (
    <>
      <Line points={[a, b, c, a]} color="#22d3ee" lineWidth={4} />
      <Line points={[new THREE.Vector3(c.x, b.y, 0), c]} color="#34d399" lineWidth={3} />
      <mesh position={c}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7c2d12" emissiveIntensity={0.25} />
      </mesh>
    </>
  );
}

function Surface3D({ fn, amplitude, frequency, phase }: { fn: TrigFn; amplitude: number; frequency: number; phase: number }) {
  const geometry = useMemo(() => {
    const xSteps = 86;
    const zSteps = 24;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const color = new THREE.Color(fn === "sin" ? "#22d3ee" : fn === "cos" ? "#fb7185" : "#f59e0b");
    const phaseRad = degreesToRadians(phase);
    for (let zIndex = 0; zIndex < zSteps; zIndex += 1) {
      const z = -2.7 + (zIndex / (zSteps - 1)) * 5.4;
      for (let xIndex = 0; xIndex < xSteps; xIndex += 1) {
        const x = -Math.PI * 2 + (xIndex / (xSteps - 1)) * Math.PI * 4;
        const base = fn === "sin" ? Math.sin(frequency * x + phaseRad) : fn === "cos" ? Math.cos(frequency * x + phaseRad) : Math.tan(frequency * x + phaseRad);
        const y = clamp(Number.isFinite(base) ? base : 0, -2.5, 2.5) * amplitude * 0.22 + Math.cos(z * 1.4) * 0.08;
        positions.push((x / (Math.PI * 2)) * 3.2, y, z);
        colors.push(color.r, color.g, color.b);
      }
    }
    for (let zIndex = 0; zIndex < zSteps - 1; zIndex += 1) {
      for (let xIndex = 0; xIndex < xSteps - 1; xIndex += 1) {
        const start = zIndex * xSteps + xIndex;
        indices.push(start, start + 1, start + xSteps, start + 1, start + xSteps + 1, start + xSteps);
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [amplitude, fn, frequency, phase]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.38} metalness={0.08} transparent opacity={0.9} />
    </mesh>
  );
}

function MetricGrid({ mode, values, fn }: { mode: LabMode; values: ReturnType<typeof computeValues>; fn: TrigFn }) {
  const rows = [
    ["sin", roundTo(values.sin, 3)],
    ["cos", roundTo(values.cos, 3)],
    ["tan", values.tan === null ? "undefined" : roundTo(values.tan, 3)],
    [fn, formatValue(values.selected)],
    [mode === "navigation" ? "height" : "identity", mode === "navigation" ? roundTo(values.height, 2) : roundTo(values.identity, 4)],
    ["period", roundTo(values.period, 3)],
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map(([label, value], index) => (
        <div key={`${label}-${index}`} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words font-mono text-sm font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function computeValues(theta: number, radius: number, amplitude: number, frequency: number, phase: number, distance: number, fn: TrigFn) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = Math.abs(cos) < 0.025 ? null : Math.tan(theta);
  const selected = fn === "sin" ? sin : fn === "cos" ? cos : tan;
  return {
    sin,
    cos,
    tan,
    selected,
    identity: sin * sin + cos * cos,
    height: distance * (tan ?? 0),
    period: (2 * Math.PI) / frequency,
    radius,
    amplitude,
    phase,
  };
}

function Grid({ width = 760, height = 460 }: { width?: number; height?: number }) {
  return (
    <g opacity="0.42">
      {Array.from({ length: 15 }).map((_, index) => <line key={`x-${index}`} x1={(index / 14) * width} x2={(index / 14) * width} y1="0" y2={height} stroke="#334155" />)}
      {Array.from({ length: 9 }).map((_, index) => <line key={`y-${index}`} x1="0" x2={width} y1={(index / 8) * height} y2={(index / 8) * height} stroke="#334155" />)}
    </g>
  );
}

function SvgLabel({ x, y, text }: { x: number; y: number; text: string }) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return <text x={x} y={y} fill="#e0f2fe" fontSize="16" fontWeight="800">{text}</text>;
}

function modeConcept(mode: LabMode) {
  const map: Record<LabMode, string> = {
    "unit-circle": "Unit circle coordinates",
    triangle: "Right-triangle ratios",
    wave: "Sinusoidal wave transformations",
    identity: "Pythagorean and reciprocal identities",
    inverse: "Recovering angles from ratios",
    navigation: "Heights and distances",
  };
  return map[mode];
}

function modeFormula(mode: LabMode, fn: TrigFn) {
  if (mode === "triangle") return "sin=opposite/hypotenuse, cos=adjacent/hypotenuse, tan=opposite/adjacent";
  if (mode === "wave") return "y=A sin(fx+phi)";
  if (mode === "identity") return "sin^2(theta)+cos^2(theta)=1";
  if (mode === "inverse") return `theta=${fn}^-1(value)`;
  if (mode === "navigation") return "height = distance * tan(theta)";
  return "x=cos(theta), y=sin(theta), tan(theta)=sin(theta)/cos(theta)";
}

function formatValue(value: number | null) {
  return value === null || !Number.isFinite(value) ? "undefined" : roundTo(value, 3).toString();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
