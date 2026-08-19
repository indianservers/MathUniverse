import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, BookOpen, Bot, BrainCircuit, CheckCircle2, ChevronRight, CircleAlert, Clock3, Cpu, Eye, Gauge, HelpCircle, Image, ListChecks, LockKeyhole, MapPin, Maximize2, Minus, MoreHorizontal, Play, Plus, Radio, Rotate3D, RotateCcw, Satellite, Search, Shield, Sigma, SlidersHorizontal, Stethoscope, Trophy, Waves, Zap } from "lucide-react";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
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
  { id: "neural", label: "Neural Networks", icon: BrainCircuit, component: <NeuralNetworkVisualizer /> },
  { id: "gradient", label: "Gradient Descent", icon: Activity, component: <GradientDescentVisualizer /> },
  { id: "signal", label: "Signal Processing", icon: Waves, component: <SignalProcessingVisualizer /> },
  { id: "image", label: "Image Compression", icon: Image, component: <ImageCompressionVisualizer /> },
  { id: "gps", label: "GPS", icon: MapPin, component: <GPSTriangulationVisualizer /> },
  { id: "crypto", label: "Cryptography", icon: LockKeyhole, component: <CryptographyVisualizer /> },
  { id: "robotics", label: "Robotics", icon: Rotate3D, component: <RoboticsPathVisualizer /> },
  { id: "graphics", label: "Graphics", icon: Cpu, component: <ComputerGraphicsVisualizer /> },
  { id: "radar", label: "Radar", icon: Radio, component: <RadarSystemsVisualizer /> },
  { id: "medical", label: "Medical Imaging", icon: Stethoscope, component: <MedicalImagingVisualizer /> },
  { id: "grid", label: "More", icon: MoreHorizontal, component: <AIApplicationsGrid /> },
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
          <SliderGroup title="Transform controls">
            <SliderControl density="compact" label="Rotation angle" value={angle} min={0} max={360} step={1} onChange={setAngle} />
            <SliderControl density="compact" label="Scale" value={scale} min={0.5} max={2} step={0.05} onChange={setScale} />
            <SliderControl density="compact" label="Translate X" value={tx} min={-100} max={100} step={1} onChange={setTx} />
            <SliderControl density="compact" label="Translate Y" value={ty} min={-80} max={80} step={1} onChange={setTy} />
          </SliderGroup>
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
          <SliderGroup title="Radar sweep">
            <SliderControl density="compact" label="Sweep speed" value={speed} min={0.5} max={3} step={0.1} onChange={setSpeed} />
            <SliderControl density="compact" label="Range scale" value={rangeScale} min={90} max={180} step={5} onChange={setRangeScale} />
          </SliderGroup>
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
          <SliderGroup title="Windowing">
            <SliderControl density="compact" label="Window center" value={windowCenter} min={0} max={255} step={1} onChange={setWindowCenter} />
            <SliderControl density="compact" label="Window width" value={windowWidth} min={1} max={255} step={1} onChange={setWindowWidth} />
            <SliderControl density="compact" label="Noise level" value={noiseLevel} min={0} max={35} step={1} onChange={setNoiseLevel} />
          </SliderGroup>
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
  const { getTopicProgress, markTopicVisited, markTopicInteracted, markTopicCompleted } = useProgress();
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const [dataset, setDataset] = useState("Spiral (3 classes)");
  const [inputs, setInputs] = useState(3);
  const [hiddenLayers, setHiddenLayers] = useState(2);
  const [neurons, setNeurons] = useState(4);
  const [activation, setActivation] = useState("ReLU");
  const [learningRate, setLearningRate] = useState(0.01);
  const [bias, setBias] = useState(true);
  const [showWeights, setShowWeights] = useState(true);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(42);
  const [selected, setSelected] = useState("h1-2");
  const [learnTab, setLearnTab] = useState<"explain" | "inspect" | "challenge">("explain");
  const [validationTopic, setValidationTopic] = useState("Gradient Descent");
  const [scenario, setScenario] = useState("Convex bowl");
  const [assessmentMode, setAssessmentMode] = useState("Calculation");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  const active = MODULES.find((m) => m.id === activeId) ?? MODULES[0];
  const progress = getTopicProgress(topic.id);
  const loss = Math.max(0.018, 0.18 / (1 + epoch / 26) + (hiddenLayers > 3 ? 0.035 : 0) + (learningRate > 0.06 ? 0.08 : 0));
  const accuracy = Math.min(98.4, 78 + hiddenLayers * 4.5 + neurons * 1.35 - Math.abs(learningRate - 0.02) * 120);
  const prediction = activation === "Sigmoid" ? 0.73 : activation === "Tanh" ? 0.41 : 0.86;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setEpoch((current) => (current >= 100 ? 1 : current + 1)), 650);
    return () => window.clearInterval(timer);
  }, [running]);

  const resetNetwork = () => {
    setInputs(3);
    setHiddenLayers(2);
    setNeurons(4);
    setActivation("ReLU");
    setLearningRate(0.01);
    setBias(true);
    setShowWeights(true);
    setEpoch(1);
    setRunning(false);
  };

  return (
    <div className="ai-studio-page" onPointerDown={() => markTopicInteracted(topic.id)}>
      <AIApplicationsHeader progress={progress} estimatedMinutes={topic.estimatedMinutes} onContinue={() => setRunning(true)} />
      <AIModuleTabs activeId={activeId} setActiveId={setActiveId} />

      {activeId === "neural" ? (
        <>
          <section className="ai-network-studio" aria-label="Neural network workspace">
            <ExperimentControls
              dataset={dataset}
              setDataset={setDataset}
              inputs={inputs}
              setInputs={setInputs}
              hiddenLayers={hiddenLayers}
              setHiddenLayers={setHiddenLayers}
              neurons={neurons}
              setNeurons={setNeurons}
              activation={activation}
              setActivation={setActivation}
              learningRate={learningRate}
              setLearningRate={setLearningRate}
              bias={bias}
              setBias={setBias}
              showWeights={showWeights}
              setShowWeights={setShowWeights}
              onReset={resetNetwork}
              onRun={() => setRunning((value) => !value)}
              running={running}
            />
            <NeuralNetworkPlayground
              inputs={inputs}
              hiddenLayers={hiddenLayers}
              neurons={neurons}
              activation={activation}
              showWeights={showWeights}
              running={running}
              epoch={epoch}
              loss={loss}
              accuracy={accuracy}
              prediction={prediction}
              selected={selected}
              setSelected={setSelected}
            />
            <LearnInspectPanel tab={learnTab} setTab={setLearnTab} selected={selected} activation={activation} prediction={prediction} />
          </section>
          <FormulaFlow running={running} />
          <ChallengeStrip />
        </>
      ) : (
        <ModuleSpecificWorkspace active={active} />
      )}

      <section className="ai-validation-grid" aria-label="Accuracy, assumptions and evidence">
        <ValidationWorkspace activeTopic={validationTopic} setActiveTopic={setValidationTopic} scenario={scenario} setScenario={setScenario} />
        <EvidenceDashboard progress={progress} assessmentMode={assessmentMode} setAssessmentMode={setAssessmentMode} questionIndex={questionIndex} setQuestionIndex={setQuestionIndex} answer={answer} setAnswer={setAnswer} checked={checked} setChecked={setChecked} />
      </section>

      <RealWorldApplications setActiveId={setActiveId} />
      <BottomProgress progress={progress} onComplete={() => markTopicCompleted(topic.id)} />
      <AIFooter />
    </div>
  );
}

type ExperimentControlsProps = {
  dataset: string;
  setDataset: (value: string) => void;
  inputs: number;
  setInputs: (value: number) => void;
  hiddenLayers: number;
  setHiddenLayers: (value: number) => void;
  neurons: number;
  setNeurons: (value: number) => void;
  activation: string;
  setActivation: (value: string) => void;
  learningRate: number;
  setLearningRate: (value: number) => void;
  bias: boolean;
  setBias: (value: boolean) => void;
  showWeights: boolean;
  setShowWeights: (value: boolean) => void;
  onReset: () => void;
  onRun: () => void;
  running: boolean;
};

function AIApplicationsHeader({ progress, estimatedMinutes, onContinue }: { progress: number; estimatedMinutes: number; onContinue: () => void }) {
  return (
    <section className="ai-studio-header">
      <div className="ai-header-title">
        <span><BrainCircuit /></span>
        <div>
          <h1>Math in AI & Real Life</h1>
          <p>Explore the mathematics behind intelligent systems</p>
        </div>
      </div>
      <div className="ai-header-progress">
        <span>In progress <b>{Math.round(progress)}%</b></span>
        <i><em style={{ width: `${Math.max(8, progress)}%` }} /></i>
      </div>
      <div className="ai-header-actions">
        <span><Gauge />Intermediate</span>
        <span><Clock3 />{estimatedMinutes} min</span>
        <button type="button" onClick={onContinue}><Play />Continue lesson</button>
      </div>
    </section>
  );
}

function AIModuleTabs({ activeId, setActiveId }: { activeId: string; setActiveId: (value: string) => void }) {
  return (
    <nav className="ai-module-tabs" aria-label="AI application modules">
      {MODULES.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className={activeId === id ? "active" : ""} onClick={() => setActiveId(id)}>
          <Icon />{label}
        </button>
      ))}
    </nav>
  );
}

function ExperimentControls(props: ExperimentControlsProps) {
  const step = (value: number, setter: (value: number) => void, delta: number, min: number, max: number) => setter(Math.min(max, Math.max(min, value + delta)));
  return (
    <aside className="ai-experiment-panel">
      <h2>Experiment controls</h2>
      <label>Dataset<select value={props.dataset} onChange={(event) => props.setDataset(event.target.value)}><option>Spiral (3 classes)</option><option>XOR</option><option>Circles</option><option>Linear separation</option><option>User-entered values</option></select></label>
      <Stepper label="Inputs" value={props.inputs} onMinus={() => step(props.inputs, props.setInputs, -1, 1, 8)} onPlus={() => step(props.inputs, props.setInputs, 1, 1, 8)} />
      <Stepper label="Hidden layers" value={props.hiddenLayers} onMinus={() => step(props.hiddenLayers, props.setHiddenLayers, -1, 1, 4)} onPlus={() => step(props.hiddenLayers, props.setHiddenLayers, 1, 1, 4)} />
      <Stepper label="Neurons per layer" value={props.neurons} onMinus={() => step(props.neurons, props.setNeurons, -1, 2, 8)} onPlus={() => step(props.neurons, props.setNeurons, 1, 2, 8)} />
      <label>Activation<select value={props.activation} onChange={(event) => props.setActivation(event.target.value)}><option>ReLU</option><option>Sigmoid</option><option>Tanh</option><option>Linear</option></select></label>
      <label className="ai-range-row"><span>Learning rate <b>{props.learningRate.toFixed(3)}</b></span><input aria-label="Learning rate" type="range" min="0.001" max="0.1" step="0.001" value={props.learningRate} onChange={(event) => props.setLearningRate(Number(event.target.value))} /></label>
      <ToggleRow label="Bias" checked={props.bias} onChange={props.setBias} />
      <ToggleRow label="Show weights" checked={props.showWeights} onChange={props.setShowWeights} />
      <div className="ai-control-actions"><button type="button" onClick={props.onReset}><RotateCcw />Reset</button><button type="button" onClick={props.onRun} className="primary"><Play />{props.running ? "Pause" : "Run network"}</button></div>
    </aside>
  );
}

function Stepper({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return <div className="ai-stepper"><span>{label}</span><div><button type="button" onClick={onMinus} aria-label={`Decrease ${label}`}><Minus /></button><b>{value}</b><button type="button" onClick={onPlus} aria-label={`Increase ${label}`}><Plus /></button></div></div>;
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="ai-toggle-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

function NeuralNetworkPlayground({ inputs, hiddenLayers, neurons, activation, showWeights, running, epoch, loss, accuracy, prediction, selected, setSelected }: { inputs: number; hiddenLayers: number; neurons: number; activation: string; showWeights: boolean; running: boolean; epoch: number; loss: number; accuracy: number; prediction: number; selected: string; setSelected: (value: string) => void }) {
  const layers = buildNetworkLayers(inputs, hiddenLayers, neurons);
  const connections = layers.slice(0, -1).flatMap((layer, layerIndex) => layer.nodes.flatMap((node, nodeIndex) => layers[layerIndex + 1].nodes.map((target, targetIndex) => ({ from: node, to: target, id: `${layerIndex}-${nodeIndex}-${targetIndex}`, weight: Math.sin((layerIndex + 1) * (nodeIndex + 2) * (targetIndex + 3)) }))));
  return (
    <main className="ai-playground">
      <div className="ai-playground-top"><h2>Neural Network Playground <span className={running ? "live" : ""}>{running ? "Live" : "Ready"}</span></h2><div><button type="button" aria-label="Zoom out"><Minus /></button><button type="button" aria-label="Zoom in"><Plus /></button><button type="button" aria-label="Fit network"><Maximize2 /></button></div></div>
      <svg className="ai-network-canvas" viewBox="0 0 760 360" role="img" aria-label="Interactive neural network canvas">
        <defs><filter id="aiNodeGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {connections.map((connection) => <line key={connection.id} x1={connection.from.x} y1={connection.from.y} x2={connection.to.x} y2={connection.to.y} stroke={connection.weight >= 0 ? "#25d7ff" : "#ffb020"} strokeOpacity={showWeights ? 0.25 + Math.abs(connection.weight) * 0.5 : 0.18} strokeWidth={showWeights ? 1 + Math.abs(connection.weight) * 3 : 1.2} />)}
        {running && connections.filter((_, index) => index % 4 === epoch % 4).slice(0, 18).map((connection) => <circle key={`pulse-${connection.id}`} r="4" fill="#e0f2fe"><animateMotion dur="1.4s" repeatCount="indefinite" path={`M${connection.from.x},${connection.from.y} L${connection.to.x},${connection.to.y}`} /></circle>)}
        {layers.map((layer) => <g key={layer.label}><text x={layer.x} y="38" fill="#e2e8f0" textAnchor="middle" fontSize="13" fontWeight="800">{layer.label}</text>{layer.nodes.map((node, nodeIndex) => <g key={node.id} tabIndex={0} role="button" aria-label={`Inspect ${node.id}`} onClick={() => setSelected(node.id)} onKeyDown={(event) => { if (event.key === "Enter") setSelected(node.id); }}><circle cx={node.x} cy={node.y} r="20" fill={layer.kind === "input" ? "#22d3ee" : layer.kind === "output" ? "#f59e0b" : "#8b5cf6"} stroke={selected === node.id ? "#fff" : "#312e81"} strokeWidth="3" filter="url(#aiNodeGlow)" /><text x={node.x} y={node.y + 5} textAnchor="middle" fill="#020617" fontSize="11" fontWeight="900">{layer.kind === "input" ? `x${nodeIndex + 1}` : layer.kind === "output" ? `y${nodeIndex + 1}` : ""}</text></g>)}</g>)}
      </svg>
      <div className="ai-network-legend"><span>Weight strength <i /></span><span><b className="positive" />Positive</span><span><b className="negative" />Negative</span><span><b className="signal" />Signal flow</span></div>
      <div className="ai-formula-band"><MathExpression value="y=\\sigma(Wx+b)" display /><span><b>W</b>: weights</span><span><b>x</b>: inputs</span><span><b>b</b>: bias</span><span><b>sigma</b>: {activation}</span></div>
      <div className="ai-metric-row"><MetricCard label="Loss" value={loss.toFixed(3)} trend="down" /><MetricCard label="Accuracy" value={`${accuracy.toFixed(1)}%`} trend="up" /><MetricCard label="Epoch" value={`${epoch}/100`} trend="up" /><MetricCard label="Prediction" value={prediction.toFixed(2)} trend="up" /></div>
    </main>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend: "up" | "down" }) {
  return <article><span>{label}</span><strong>{value}</strong><svg viewBox="0 0 100 24" aria-hidden="true"><path d={trend === "up" ? "M4 18L18 15L32 17L46 9L60 11L75 6L94 8" : "M4 5L20 8L34 10L50 15L66 16L80 18L96 19"} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" /></svg></article>;
}

function LearnInspectPanel({ tab, setTab, selected, activation, prediction }: { tab: "explain" | "inspect" | "challenge"; setTab: (value: "explain" | "inspect" | "challenge") => void; selected: string; activation: string; prediction: number }) {
  return (
    <aside className="ai-inspect-panel">
      <h2>Learn & Inspect</h2>
      <div className="ai-inspect-tabs">{(["explain", "inspect", "challenge"] as const).map((item) => <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "explain" && <div className="ai-explain-card"><h3>How a neuron decides</h3>{["Weighted sum", "Add bias", "Apply activation", "Produce output"].map((item, index) => <p key={item}><b>{index + 1}</b><span>{item}<small>{index === 0 ? "Combine inputs with weights." : index === 1 ? "Shift the decision boundary." : index === 2 ? `${activation} introduces model behavior.` : "Send the value onward."}</small></span></p>)}<MathExpression value="z=w*x+b" /><ActivationMiniGraph activation={activation} /></div>}
      {tab === "inspect" && <div className="ai-explain-card"><h3>Selected state</h3><dl><dt>Neuron ID</dt><dd>{selected}</dd><dt>Input values</dt><dd>[0.72, -0.18, 0.44]</dd><dt>Weights</dt><dd>[0.61, -0.25, 0.39]</dd><dt>Bias</dt><dd>0.12</dd><dt>Weighted sum</dt><dd>0.84</dd><dt>Activation output</dt><dd>{prediction.toFixed(2)}</dd></dl></div>}
      {tab === "challenge" && <div className="ai-explain-card"><h3>Challenge</h3><p className="plain">Adjust hidden layers and learning rate until loss falls below 0.05 without making the model unstable.</p><button type="button">Start challenge <ChevronRight /></button></div>}
      <div className="ai-tutor-card"><h3><Bot />AI Tutor</h3><p>I'm here to help you understand neural networks.</p>{["Why use hidden layers?", "How do weights update?", "What is backpropagation?", "Why ReLU activation?"].map((item) => <button type="button" key={item}>{item}</button>)}</div>
    </aside>
  );
}

function ActivationMiniGraph({ activation }: { activation: string }) {
  const path = activation === "Sigmoid" ? "M10 70C38 70 42 20 78 20" : activation === "Tanh" ? "M10 72C34 72 48 18 78 18" : activation === "Linear" ? "M12 70L80 18" : "M12 70H38L80 18";
  return <svg className="ai-activation-mini" viewBox="0 0 94 84" aria-label={`${activation} activation graph`}><path d="M12 72H86M20 8V76" stroke="#cbd5e1" /><path d={path} fill="none" stroke="#3b82f6" strokeWidth="3" /></svg>;
}

function FormulaFlow({ running }: { running: boolean }) {
  const steps = [["Input", "Raw features enter the network.", BrainCircuit], ["Weighted sum", "Each neuron computes z = w dot x + b.", Sigma], ["Activation", "Apply non-linearity to introduce complexity.", Zap], ["Output", "Network produces the final prediction.", Trophy]] as const;
  return <section className={`ai-flow-section ${running ? "running" : ""}`}><h2>From formula to prediction</h2><p>See how data flows through a neural network to produce an output.</p><div>{steps.map(([title, text, Icon], index) => <article key={title}><b>{index + 1}</b><span><strong>{title}</strong><small>{text}</small></span><Icon />{index < steps.length - 1 ? <i /> : null}</article>)}</div></section>;
}

function ChallengeStrip() {
  const challenges = [["Tune the network", "Adjust learning rate and hidden layers to minimize loss.", "Medium", "3-4 min", SlidersHorizontal], ["Find the unstable model", "Identify which setup will diverge and explain why.", "Hard", "4-5 min", Activity], ["Explain the prediction", "Why did the network output a high value for this input?", "Easy", "3 min", HelpCircle]] as const;
  return <section className="ai-challenge-section"><h2>Test your understanding</h2><p>Quick challenges to reinforce core ideas.</p><div>{challenges.map(([title, text, difficulty, time, Icon]) => <article key={title}><Icon /><span><strong>{title}</strong><small>{text}</small><b className={difficulty.toLowerCase()}>{difficulty}</b></span><em><Clock3 />{time}</em><button type="button" aria-label={`Open ${title}`}><ChevronRight /></button></article>)}</div></section>;
}

function ValidationWorkspace({ activeTopic, setActiveTopic, scenario, setScenario }: { activeTopic: string; setActiveTopic: (value: string) => void; scenario: string; setScenario: (value: string) => void }) {
  const topics = ["Gradient Descent", "Neural Networks", "Signal Processing", "Robotics & Transformations", "Engineering Simulations", "Cryptography Examples"];
  return <section className="ai-validation-panel"><h2>Accuracy, assumptions & validation</h2><p>Know when the mathematics works and when it does not.</p><div className="ai-validation-body"><div className="ai-accordion">{topics.map((item) => <button key={item} type="button" className={activeTopic === item ? "active" : ""} onClick={() => setActiveTopic(item)}><Shield />{item}<span>{activeTopic === item ? "Open" : "Review"}</span></button>)}</div><div className="ai-validation-detail"><article className="ai-update-rule"><span>Update rule</span><MathExpression value="x_{k+1}=x_k-\\eta\\nabla f(x_k)" display /></article><LossChart scenario={scenario} /><div className="ai-proof-cards">{["Assumptions", "Invariants", "Common misconception", "Independent check"].map((item, index) => <article key={item}><b>{index === 2 ? <CircleAlert /> : <CheckCircle2 />}</b><strong>{item}</strong><small>{index === 0 ? "Smooth objective and bounded learning rate." : index === 1 ? "Accepted steps reduce objective." : index === 2 ? "A larger learning rate can overshoot." : "Compare analytic and central differences."}</small></article>)}</div><div className="ai-scenario-row">{["Convex bowl", "Ill-conditioned valley", "Linear regression"].map((item) => <button key={item} type="button" className={scenario === item ? "active" : ""} onClick={() => setScenario(item)}>{item}</button>)}<button type="button" className="run"><Play />Run validation</button></div></div></div></section>;
}

function LossChart({ scenario }: { scenario: string }) {
  const amp = scenario === "Ill-conditioned valley" ? 1.8 : scenario === "Linear regression" ? 0.75 : 1;
  const path = Array.from({ length: 40 }, (_, index) => {
    const x = 18 + index * 5.3;
    const y = 26 + Math.log(index + 1) * 18 * amp + Math.sin(index * 0.6) * (scenario === "Ill-conditioned valley" ? 7 : 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return <article className="ai-loss-chart"><span>Loss over iterations</span><svg viewBox="0 0 250 130"><path d="M24 104H230M24 18V104" stroke="#cbd5e1" /><path d={path} fill="none" stroke="#7c3aed" strokeWidth="3" /><text x="104" y="124" fill="#64748b" fontSize="10">Iterations</text></svg></article>;
}

function EvidenceDashboard({ progress, assessmentMode, setAssessmentMode, questionIndex, setQuestionIndex, answer, setAnswer, checked, setChecked }: { progress: number; assessmentMode: string; setAssessmentMode: (value: string) => void; questionIndex: number; setQuestionIndex: (value: number) => void; answer: string; setAnswer: (value: string) => void; checked: boolean; setChecked: (value: boolean) => void }) {
  const questions = ["For f(x)=1/2 x^T A x-b^T x, compute one gradient descent step.", "Which assumption fails when eta is too large?", "Explain why ReLU can create sparse activations."];
  return <section className="ai-evidence-panel"><h2>Evidence dashboard</h2><div className="ai-evidence-top"><div className="ai-readiness" style={{ "--ready": `${progress}%` } as React.CSSProperties}><strong>{Math.round(progress)}%</strong><span>Ready</span></div><div className="ai-check-list"><span><CheckCircle2 />Passed <b>{progress >= 100 ? 12 : 3}</b></span><span><CircleAlert />Needs review <b>{progress >= 100 ? 0 : 3}</b></span><span><Clock3 />Pending <b>{progress >= 100 ? 0 : 2}</b></span></div><div className="ai-check-list"><span><CheckCircle2 />Formula verified</span><span><CheckCircle2 />Boundary tested</span><span><CircleAlert />Counterexample included</span><span><Clock3 />Accessibility review</span></div></div><div className="ai-assessment-modes">{["Recognition", "Calculation", "Interpretation", "Error analysis", "Transfer"].map((item) => <button key={item} type="button" className={assessmentMode === item ? "active" : ""} onClick={() => setAssessmentMode(item)}>{item}</button>)}</div><div className="ai-question-card"><small>Example question ({assessmentMode})</small><p>{questions[questionIndex]}</p><label><Search />Answer<input value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} placeholder="Type a short answer" /></label>{checked ? <b>{answer.trim().length > 3 ? "Good start. Compare with the solution steps." : "Add more mathematical detail."}</b> : null}<div><button type="button" onClick={() => setChecked(true)}>Check answer</button><button type="button">View solution <ChevronRight /></button><button type="button" onClick={() => { setQuestionIndex((questionIndex + 1) % questions.length); setAnswer(""); setChecked(false); }}>Next</button></div></div></section>;
}

function RealWorldApplications({ setActiveId }: { setActiveId: (value: string) => void }) {
  const apps = [["Signal Processing", "X(f)=integral x(t)e^{-j2*pi*f*t}dt", "signal", Waves], ["Robotics", "T=prod_i e^{[xi_i]theta_i}", "robotics", Rotate3D], ["Engineering Simulation", "du/dt=alpha*nabla^2 u", "gradient", Activity], ["Medical Imaging", "R(theta,s)=integral f(x)ds", "medical", Stethoscope], ["Cryptography", "c=m^e mod n", "crypto", LockKeyhole]] as const;
  return <section className="ai-app-grid-section"><h2>Explore real-world applications</h2><p>See how mathematics and AI solve problems across domains.</p><div>{apps.map(([title, formula, route, Icon]) => <article key={title}><span><strong>{title}</strong><MathExpression value={formula} /></span><ApplicationMiniVisual type={route} /><button type="button" onClick={() => setActiveId(route)}>Open module <ChevronRight /></button><Icon /></article>)}</div></section>;
}

function ApplicationMiniVisual({ type }: { type: string }) {
  if (type === "medical") return <canvas className="ai-mini-medical" width={96} height={56} aria-label="Medical imaging preview" />;
  return <svg className="ai-mini-visual" viewBox="0 0 120 64" aria-hidden="true"><path d={type === "signal" ? "M4 34C20 4 34 62 52 28S86 14 116 40" : type === "robotics" ? "M28 48L52 28L76 38L98 16" : type === "crypto" ? "M24 52V30H96V52ZM42 30V20C42 8 78 8 78 30" : "M10 54C34 20 62 8 110 30"} fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" /><circle cx="52" cy="28" r="5" fill="#8b5cf6" /></svg>;
}

function BottomProgress({ progress, onComplete }: { progress: number; onComplete: () => void }) {
  return <section className="ai-bottom-progress"><span>Module progress</span><i><em style={{ width: `${progress}%` }} /></i><b>{Math.round(progress)}%</b><small>{progress >= 100 ? "Completed activities ready" : "3 completed activities - 4 remaining checks"}</small><button type="button">View certification evidence</button><button type="button" onClick={onComplete} className="primary"><CheckCircle2 />Mark as complete</button></section>;
}

function AIFooter() {
  return <footer className="ai-footer"><div><BrainCircuit /><span><strong>Math Universe</strong><small>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</small></span></div><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav></footer>;
}

function ModuleSpecificWorkspace({ active }: { active: typeof MODULES[number] }) {
  return <section className="ai-module-workspace"><div className="ai-module-workspace-head"><span><active.icon /></span><div><h2>{active.label}</h2><p>Module-specific visualizer and controls preserved from the existing AI Applications page.</p></div></div>{active.component}</section>;
}

function buildNetworkLayers(inputCount: number, hiddenLayerCount: number, neuronsPerLayer: number) {
  const layerCount = hiddenLayerCount + 2;
  return Array.from({ length: layerCount }, (_, layerIndex) => {
    const kind = layerIndex === 0 ? "input" : layerIndex === layerCount - 1 ? "output" : "hidden";
    const count = kind === "input" ? inputCount : kind === "output" ? 3 : neuronsPerLayer;
    const x = 80 + layerIndex * (600 / Math.max(1, layerCount - 1));
    return {
      x,
      kind,
      label: kind === "input" ? `Input layer (${count})` : kind === "output" ? `Output layer (${count})` : `Hidden layer ${layerIndex} (${count})`,
      nodes: Array.from({ length: count }, (_, nodeIndex) => ({ id: `${kind[0]}${layerIndex}-${nodeIndex + 1}`, x, y: 86 + nodeIndex * (190 / Math.max(1, count - 1)) })),
    };
  });
}
