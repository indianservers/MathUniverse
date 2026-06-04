import { useEffect, useMemo, useRef, useState } from "react";
import AITutorPanel from "../components/ui/AITutorPanel";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import AIApplicationsGrid from "../visualizations/ai/AIApplicationsGrid";
import CryptographyVisualizer from "../visualizations/ai/CryptographyVisualizer";
import GPSTriangulationVisualizer from "../visualizations/ai/GPSTriangulationVisualizer";
import GradientDescentVisualizer from "../visualizations/ai/GradientDescentVisualizer";
import ImageCompressionVisualizer from "../visualizations/ai/ImageCompressionVisualizer";
import NeuralNetworkVisualizer from "../visualizations/ai/NeuralNetworkVisualizer";
import RoboticsPathVisualizer from "../visualizations/ai/RoboticsPathVisualizer";
import SignalProcessingVisualizer from "../visualizations/ai/SignalProcessingVisualizer";

const MODULES = [
  { id: "neural", label: "Neural Network", component: <NeuralNetworkVisualizer /> },
  { id: "gradient", label: "Gradient Descent", component: <GradientDescentVisualizer /> },
  { id: "signal", label: "Signal Processing", component: <SignalProcessingVisualizer /> },
  { id: "image", label: "Image Compression", component: <ImageCompressionVisualizer /> },
  { id: "gps", label: "GPS Triangulation", component: <GPSTriangulationVisualizer /> },
  { id: "crypto", label: "Cryptography", component: <CryptographyVisualizer /> },
  { id: "robotics", label: "Robotics Path", component: <RoboticsPathVisualizer /> },
  { id: "graphics", label: "Computer Graphics", component: <ComputerGraphicsVisualizer /> },
  { id: "radar", label: "Radar Systems", component: <RadarSystemsVisualizer /> },
  { id: "medical", label: "Medical Imaging", component: <MedicalImagingVisualizer /> },
  { id: "grid", label: "All Applications", component: <AIApplicationsGrid /> },
];

type Point = [number, number];

function transformPoint([x, y]: Point, angle: number, scale: number, tx: number, ty: number): Point {
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [scale * (cos * x - sin * y) + tx, scale * (sin * x + cos * y) + ty];
}

function ComputerGraphicsVisualizer() {
  const [angle, setAngle] = useState(35);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians) * scale;
  const sin = Math.sin(radians) * scale;
  const toSvg = ([x, y]: Point) => `${x + 220},${180 - y}`;
  const triangle = [[-70, -40], [10, -55], [-25, 35]] as Point[];
  const square = [[35, -35], [95, -35], [95, 25], [35, 25]] as Point[];
  const circleCenter = transformPoint([-5, 70], angle, scale, tx, ty);
  const transformedTriangle = triangle.map((point) => transformPoint(point, angle, scale, tx, ty));
  const transformedSquare = square.map((point) => transformPoint(point, angle, scale, tx, ty));
  const matrix = [
    [cos, -sin, tx],
    [sin, cos, ty],
    [0, 0, 1],
  ];

  return (
    <SectionCard title="Matrix Transformations in Graphics" description="2D graphics pipelines rotate, scale, and translate object coordinates through homogeneous matrices.">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Rotation angle" value={angle} min={0} max={360} step={1} onChange={setAngle} />
          <SliderControl label="Scale" value={scale} min={0.5} max={2} step={0.05} onChange={setScale} />
          <SliderControl label="Translate X" value={tx} min={-100} max={100} step={1} onChange={setTx} />
          <SliderControl label="Translate Y" value={ty} min={-80} max={80} step={1} onChange={setTy} />
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Homogeneous matrix</p>
            <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-sm">
              {matrix.flat().map((value, index) => <span key={index} className="rounded bg-white px-2 py-1 text-center dark:bg-slate-950">{value.toFixed(2)}</span>)}
            </div>
          </div>
        </div>
        <svg className="h-[380px] w-full rounded-2xl bg-slate-950" viewBox="0 0 440 360" role="img" aria-label="Transformed 2D shapes">
          <line x1="0" y1="180" x2="440" y2="180" stroke="#334155" />
          <line x1="220" y1="0" x2="220" y2="360" stroke="#334155" />
          <polygon points={transformedTriangle.map(toSvg).join(" ")} fill="#22d3ee" opacity="0.82" stroke="#a5f3fc" strokeWidth="2" />
          <polygon points={transformedSquare.map(toSvg).join(" ")} fill="#a78bfa" opacity="0.78" stroke="#ddd6fe" strokeWidth="2" />
          <circle cx={circleCenter[0] + 220} cy={180 - circleCenter[1]} r={24 * scale} fill="#34d399" opacity="0.78" stroke="#bbf7d0" strokeWidth="2" />
          <text x="16" y="30" fill="#e2e8f0" fontSize="14">Matrix Transformations in Graphics</text>
        </svg>
      </div>
    </SectionCard>
  );
}

const radarTargets = [
  { id: "A", r: 0.32, theta: 35 },
  { id: "B", r: 0.58, theta: 112 },
  { id: "C", r: 0.78, theta: 207 },
  { id: "D", r: 0.46, theta: 302 },
];

function polarToXY(r: number, theta: number, scale: number) {
  const radians = (theta - 90) * Math.PI / 180;
  return [200 + r * scale * Math.cos(radians), 200 + r * scale * Math.sin(radians)] as Point;
}

function RadarSystemsVisualizer() {
  const [speed, setSpeed] = useState(1);
  const [rangeScale, setRangeScale] = useState(150);
  const [clutter, setClutter] = useState(true);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (time: number) => {
      const delta = time - last;
      last = time;
      setAngle((current) => (current + delta * 0.12 * speed) % 360);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const clutterPoints = useMemo(() => Array.from({ length: 16 }, (_, index) => ({
    r: 0.15 + pseudoRandom(index + 2) * 0.8,
    theta: pseudoRandom(index + 30) * 360,
    strength: 0.15 + pseudoRandom(index + 70) * 0.25,
  })), []);
  const sweepEnd = polarToXY(1, angle, 180);
  const opacityFor = (theta: number) => {
    const ageDegrees = (angle - theta + 360) % 360;
    const ageSeconds = ageDegrees / (120 * speed);
    return ageSeconds <= 1.5 ? Math.max(0, 1 - ageSeconds / 1.5) : 0;
  };

  return (
    <SectionCard title="Signal Detection & CFAR Filtering" description="Radar maps polar range and bearing, then detects targets as the sweep crosses their angle.">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Sweep speed" value={speed} min={0.5} max={3} step={0.1} onChange={setSpeed} />
          <SliderControl label="Range scale" value={rangeScale} min={90} max={180} step={5} onChange={setRangeScale} />
          <label className="flex items-center justify-between rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-white/10">
            Clutter
            <input type="checkbox" checked={clutter} onChange={(event) => setClutter(event.target.checked)} className="h-4 w-4 accent-cyan-500" />
          </label>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Target readout</p>
            <div className="mt-2 space-y-1 text-sm">
              {radarTargets.map((target) => <p key={target.id}>{target.id}: {(target.r * rangeScale).toFixed(0)} km, {target.theta} deg</p>)}
            </div>
          </div>
        </div>
        <svg className="h-[420px] w-full rounded-2xl bg-slate-950" viewBox="0 0 400 400" role="img" aria-label="Radar sweep">
          {[60, 110, 160].map((radius) => <circle key={radius} cx="200" cy="200" r={radius} fill="none" stroke="#164e63" strokeWidth="1.5" />)}
          <line x1="200" y1="200" x2={sweepEnd[0]} y2={sweepEnd[1]} stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
          {clutter && clutterPoints.map((point, index) => {
            const [x, y] = polarToXY(point.r, point.theta, rangeScale);
            return <circle key={index} cx={x} cy={y} r="2" fill="#67e8f9" opacity={point.strength * opacityFor(point.theta)} />;
          })}
          {radarTargets.map((target) => {
            const [x, y] = polarToXY(target.r, target.theta, rangeScale);
            const opacity = opacityFor(target.theta);
            return <g key={target.id}><circle cx={x} cy={y} r={5 + 8 * opacity} fill="#34d399" opacity={0.25 + opacity * 0.75} /><text x={x + 8} y={y - 8} fill="#bbf7d0" fontSize="13">{target.id}</text></g>;
          })}
        </svg>
      </div>
    </SectionCard>
  );
}

function MedicalImagingVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowCenter, setWindowCenter] = useState(128);
  const [windowWidth, setWindowWidth] = useState(160);
  const [noiseLevel, setNoiseLevel] = useState(8);

  const pixels = useMemo(() => {
    const size = 64;
    return Array.from({ length: size * size }, (_, index) => {
      const x = (index % size - size / 2) / (size / 2);
      const y = (Math.floor(index / size) - size / 2) / (size / 2);
      let value = 25;
      if ((x / 0.78) ** 2 + (y / 0.9) ** 2 < 1) value = 95;
      if (((x + 0.18) / 0.24) ** 2 + ((y + 0.1) / 0.32) ** 2 < 1) value = 185;
      if (((x - 0.25) / 0.18) ** 2 + ((y - 0.2) / 0.22) ** 2 < 1) value = 145;
      if ((x / 0.08) ** 2 + ((y - 0.45) / 0.12) ** 2 < 1) value = 230;
      return value + gaussian(index) * noiseLevel;
    });
  }, [noiseLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cell = canvas.width / 64;
    const min = windowCenter - windowWidth / 2;
    const max = windowCenter + windowWidth / 2;
    pixels.forEach((value, index) => {
      const normalized = Math.max(0, Math.min(1, (value - min) / Math.max(1, max - min)));
      const gray = Math.round(normalized * 255);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect((index % 64) * cell, Math.floor(index / 64) * cell, cell, cell);
    });
  }, [pixels, windowCenter, windowWidth]);

  return (
    <SectionCard title="Windowing & CT Hounsfield Scale" description="CT windowing remaps raw density values into a visible grayscale diagnostic range.">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Window center" value={windowCenter} min={0} max={255} step={1} onChange={setWindowCenter} />
          <SliderControl label="Window width" value={windowWidth} min={1} max={255} step={1} onChange={setWindowWidth} />
          <SliderControl label="Noise level" value={noiseLevel} min={0} max={35} step={1} onChange={setNoiseLevel} />
          <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
            Display range: {(windowCenter - windowWidth / 2).toFixed(0)} to {(windowCenter + windowWidth / 2).toFixed(0)} HU-like units
          </div>
        </div>
        <canvas ref={canvasRef} width={512} height={512} className="aspect-square w-full max-w-[520px] rounded-2xl bg-slate-950 [image-rendering:pixelated]" aria-label="Simulated CT scan" />
      </div>
    </SectionCard>
  );
}

function pseudoRandom(seed: number) {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

function gaussian(seed: number) {
  const u1 = Math.max(0.001, pseudoRandom(seed + 101));
  const u2 = pseudoRandom(seed + 202);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export default function AIApplications() {
  const topic = topics.find((item) => item.id === "ai")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [activeId, setActiveId] = useState(MODULES[0].id);
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  const active = MODULES.find((m) => m.id === activeId) ?? MODULES[0];

  return (
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />

      <div className="grid gap-3 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="desktop-sidebar-panel scroll-panel xl:sticky xl:top-24">
          <p className="mb-2 text-xs font-black uppercase text-slate-400">Modules</p>
          <nav className="grid gap-1.5">
            {MODULES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveId(m.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                  m.id === activeId
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-white/80 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                } border border-slate-200 dark:border-white/10`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          {active.component}
        </div>
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <SectionCard title="Math Powers Modern Intelligence" description="AI systems are built from algebra, calculus, probability, geometry, signals, and linear algebra." compact />
          <AITutorPanel />
        </aside>
      </div>

      <TopicProgressActions topicId={topic.id} />
    </div>
  );
}
