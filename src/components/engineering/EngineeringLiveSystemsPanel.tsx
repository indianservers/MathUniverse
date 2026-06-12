import { Activity, Cpu, GitBranch, RadioTower, Sigma, Thermometer, Waves, Zap } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  buildBodeResponse,
  buildConvolutionResponse,
  buildEigenMode,
  buildFourierSynthesis,
  buildStressStrainCurve,
  buildVectorField,
  simulateHeatRod,
  simulateWaveString,
  solveFirstOrderOde,
  type XYPoint,
} from "../../utils/mathEngine/engineeringSystems";
import { buildEngineeringLiveSystemWorkspaceObjects } from "../../workspace/universalObjectGraph";
import type { MathObject } from "../../workspace/types";

type EngineeringLiveSystemsPanelProps = {
  onWorkspaceObjectsChange?: (objects: MathObject[]) => void;
  workspaceParent?: { id: string; title: string };
};

export default function EngineeringLiveSystemsPanel({ onWorkspaceObjectsChange, workspaceParent }: EngineeringLiveSystemsPanelProps) {
  const [gain, setGain] = useState(1.4);
  const [timeConstant, setTimeConstant] = useState(0.8);
  const [harmonics, setHarmonics] = useState(7);
  const [pulseWidth, setPulseWidth] = useState(1.5);
  const [odeRate, setOdeRate] = useState(0.9);
  const [forcing, setForcing] = useState(1.2);
  const [heatSteps, setHeatSteps] = useState(140);
  const [waveMode, setWaveMode] = useState(2);
  const [time, setTime] = useState(0.45);
  const [swirl, setSwirl] = useState(0.65);
  const [source, setSource] = useState(0.2);
  const [elasticity, setElasticity] = useState(210);
  const [eigenMode, setEigenMode] = useState(2);

  const bode = useMemo(() => buildBodeResponse(gain, timeConstant), [gain, timeConstant]);
  const fourier = useMemo(() => buildFourierSynthesis(harmonics, 1.2), [harmonics]);
  const convolution = useMemo(() => buildConvolutionResponse(timeConstant, pulseWidth), [pulseWidth, timeConstant]);
  const ode = useMemo(() => solveFirstOrderOde(odeRate, forcing, 0), [forcing, odeRate]);
  const heat = useMemo(() => simulateHeatRod(0.9, heatSteps), [heatSteps]);
  const wave = useMemo(() => simulateWaveString(waveMode, 1.1, time), [time, waveMode]);
  const field = useMemo(() => buildVectorField(swirl, source), [source, swirl]);
  const stress = useMemo(() => buildStressStrainCurve(elasticity, 0.012), [elasticity]);
  const eigen = useMemo(() => buildEigenMode(eigenMode, elasticity, 12), [eigenMode, elasticity]);
  const liveWorkspaceObjects = useMemo(() => buildEngineeringLiveSystemWorkspaceObjects({
    parent: workspaceParent,
    systems: [
      {
        id: "bode-plot",
        title: "Live Bode plot",
        systemType: "control-frequency-response",
        kind: "function",
        metricLabel: "cutoff",
        metricValue: round(bode.cutoffFrequency),
        metricUnit: " rad/s",
        sampleCount: bode.points.length,
        controls: { gain, timeConstant },
        summary: "First-order low-pass magnitude and phase response.",
        color: "#38bdf8",
      },
      {
        id: "fourier-synthesis",
        title: "Live Fourier synthesis",
        systemType: "signals-series",
        kind: "function",
        metricLabel: "rms error",
        metricValue: round(fourier.rmsError),
        sampleCount: fourier.points.length,
        controls: { harmonics },
        summary: "Square-wave approximation from odd harmonic terms.",
        color: "#38bdf8",
      },
      {
        id: "convolution-response",
        title: "Live convolution response",
        systemType: "signals-convolution",
        kind: "function",
        metricLabel: "peak",
        metricValue: round(convolution.peak),
        sampleCount: convolution.points.length,
        controls: { pulseWidth, timeConstant },
        summary: "Rectangular pulse through a first-order impulse response.",
        color: "#f59e0b",
      },
      {
        id: "numerical-ode",
        title: "Live numerical ODE",
        systemType: "numerical-differential-equation",
        kind: "function",
        metricLabel: "steady state",
        metricValue: round(ode.steadyState),
        sampleCount: ode.points.length,
        controls: { odeRate, forcing },
        summary: "Runge-Kutta trajectory for a first-order forced ODE.",
        color: "#22c55e",
      },
      {
        id: "heat-wave-pde",
        title: "Live heat and wave PDE",
        systemType: "pde-educational-model",
        metricLabel: "stability ratio",
        metricValue: round(heat.stabilityRatio),
        sampleCount: heat.finalProfile.length + wave.profile.length,
        controls: { heatSteps, waveMode, time },
        summary: "One-dimensional heat diffusion and standing-wave mode profiles.",
        color: "#fb7185",
      },
      {
        id: "vector-field",
        title: "Live vector field",
        systemType: "field-analysis",
        kind: "vector",
        metricLabel: "curl",
        metricValue: round(field.curl),
        sampleCount: field.samples.length,
        controls: { swirl, source },
        summary: "Adjustable linear field with divergence and curl metrics.",
        color: "#f59e0b",
      },
      {
        id: "stress-strain",
        title: "Live stress-strain curve",
        systemType: "materials-mechanics",
        kind: "function",
        metricLabel: "yield stress",
        metricValue: round(stress.yieldStress),
        metricUnit: " MPa",
        sampleCount: stress.points.length,
        controls: { elasticity },
        summary: "Simplified bilinear material response with resilience estimate.",
        color: "#a855f7",
      },
      {
        id: "eigenmode",
        title: "Live eigenmode",
        systemType: "vibration-modal-analysis",
        kind: "function",
        metricLabel: "natural frequency",
        metricValue: round(eigen.naturalFrequency),
        metricUnit: " Hz",
        sampleCount: eigen.profile.length,
        controls: { eigenMode, elasticity },
        summary: "String-like mode shape with node and frequency readouts.",
        color: "#14b8a6",
      },
    ],
  }), [bode, convolution, eigen, eigenMode, elasticity, field, forcing, fourier, gain, harmonics, heat, heatSteps, ode, odeRate, pulseWidth, source, stress, swirl, time, timeConstant, wave, waveMode, workspaceParent]);

  useEffect(() => {
    onWorkspaceObjectsChange?.(liveWorkspaceObjects);
  }, [liveWorkspaceObjects, onWorkspaceObjectsChange]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Live Engineering Systems</p>
          <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Control, Signals, PDEs, Fields, Materials, Modes</h3>
        </div>
        <div className="grid min-w-[260px] gap-2">
          <MiniSlider label="gain" value={gain} min={0.2} max={4} step={0.05} onChange={setGain} />
          <MiniSlider label="time" value={time} min={0} max={1.5} step={0.01} onChange={setTime} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <SystemCard
          title="Bode Plot"
          icon={<RadioTower className="h-4 w-4" />}
          metrics={[`wc=${round(bode.cutoffFrequency)}`, `DC=${round(bode.dcGainDb)} dB`]}
          controls={<MiniSlider label="tau" value={timeConstant} min={0.1} max={3} step={0.05} onChange={setTimeConstant} />}
        >
          <BodeChart points={bode.points} />
        </SystemCard>

        <SystemCard
          title="Fourier Synthesis"
          icon={<Waves className="h-4 w-4" />}
          metrics={[`${harmonics} terms`, `rms=${round(fourier.rmsError)}`]}
          controls={<MiniSlider label="terms" value={harmonics} min={1} max={21} step={2} onChange={setHarmonics} />}
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px]">
            <LineChart points={fourier.points} color="#38bdf8" zero />
            <SpectrumChart points={fourier.harmonicAmplitudes} />
          </div>
        </SystemCard>

        <SystemCard
          title="Convolution Response"
          icon={<Activity className="h-4 w-4" />}
          metrics={[`peak=${round(convolution.peak)}`, `area=${round(convolution.area)}`]}
          controls={<MiniSlider label="pulse" value={pulseWidth} min={0.2} max={4} step={0.05} onChange={setPulseWidth} />}
        >
          <LineChart points={convolution.points} color="#f59e0b" />
        </SystemCard>

        <SystemCard
          title="Numerical ODE"
          icon={<Sigma className="h-4 w-4" />}
          metrics={[`steady=${round(ode.steadyState)}`, `settle=${round(ode.settlingTime)}s`]}
          controls={<div className="grid gap-2"><MiniSlider label="rate" value={odeRate} min={0.1} max={2.5} step={0.05} onChange={setOdeRate} /><MiniSlider label="input" value={forcing} min={0.1} max={3} step={0.05} onChange={setForcing} /></div>}
        >
          <LineChart points={ode.points} color="#22c55e" />
        </SystemCard>

        <SystemCard
          title="Heat And Wave PDE"
          icon={<Thermometer className="h-4 w-4" />}
          metrics={[`r=${round(heat.stabilityRatio)}`, `E=${round(wave.energy)}`]}
          controls={<div className="grid gap-2"><MiniSlider label="heat steps" value={heatSteps} min={20} max={400} step={10} onChange={setHeatSteps} /><MiniSlider label="mode" value={waveMode} min={1} max={6} step={1} onChange={setWaveMode} /></div>}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <LineChart points={heat.finalProfile} color="#fb7185" />
            <LineChart points={wave.profile} color="#38bdf8" zero />
          </div>
        </SystemCard>

        <SystemCard
          title="Vector Field"
          icon={<Zap className="h-4 w-4" />}
          metrics={[`div=${round(field.divergence)}`, `curl=${round(field.curl)}`]}
          controls={<div className="grid gap-2"><MiniSlider label="swirl" value={swirl} min={-1.5} max={1.5} step={0.05} onChange={setSwirl} /><MiniSlider label="source" value={source} min={-1.5} max={1.5} step={0.05} onChange={setSource} /></div>}
        >
          <VectorFieldChart samples={field.samples} />
        </SystemCard>

        <SystemCard
          title="Stress-Strain"
          icon={<Cpu className="h-4 w-4" />}
          metrics={[`yield=${round(stress.yieldStress)} MPa`, `U=${round(stress.resilience)}`]}
          controls={<MiniSlider label="E" value={elasticity} min={50} max={300} step={5} onChange={setElasticity} />}
        >
          <LineChart points={stress.points} color="#a855f7" />
        </SystemCard>

        <SystemCard
          title="Eigenmode"
          icon={<GitBranch className="h-4 w-4" />}
          metrics={[`mode=${eigenMode}`, `fn=${round(eigen.naturalFrequency)} Hz`, `${eigen.nodes.length} nodes`]}
          controls={<MiniSlider label="mode" value={eigenMode} min={1} max={5} step={1} onChange={setEigenMode} />}
        >
          <LineChart points={eigen.profile} color="#14b8a6" zero />
        </SystemCard>
      </div>
    </section>
  );
}

function SystemCard({ title, icon, metrics, controls, children }: { title: string; icon: ReactNode; metrics: string[]; controls: ReactNode; children: ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><span className="text-cyan-600 dark:text-cyan-200">{icon}</span>{title}</h4>
          <div className="mt-2 flex flex-wrap gap-2">{metrics.map((metric) => <span key={metric} className="mini-chip">{metric}</span>)}</div>
        </div>
        <div className="min-w-[180px]">{controls}</div>
      </div>
      <div className="mt-3">{children}</div>
    </article>
  );
}

function MiniSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="grid grid-cols-[64px_minmax(0,1fr)_48px] items-center gap-2 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full accent-cyan-500" />
      <span className="text-right font-mono text-slate-700 dark:text-slate-200">{round(value)}</span>
    </label>
  );
}

function BodeChart({ points }: { points: Array<{ frequency: number; magnitudeDb: number; phaseDeg: number }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <LineChart points={points.map((point) => ({ x: Math.log10(point.frequency), y: point.magnitudeDb }))} color="#38bdf8" />
      <LineChart points={points.map((point) => ({ x: Math.log10(point.frequency), y: point.phaseDeg }))} color="#f59e0b" />
    </div>
  );
}

function LineChart({ points, color, zero = false }: { points: XYPoint[]; color: string; zero?: boolean }) {
  const width = 360;
  const height = 160;
  const padding = 18;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys, zero ? 0 : Infinity);
  const maxY = Math.max(...ys, zero ? 0 : -Infinity);
  const xSpan = maxX - minX || 1;
  const ySpan = maxY - minY || 1;
  const path = points.map((point, index) => {
    const x = padding + ((point.x - minX) / xSpan) * (width - padding * 2);
    const y = padding + (1 - (point.y - minY) / ySpan) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"} ${round(x)} ${round(y)}`;
  }).join(" ");
  const zeroY = padding + (1 - (0 - minY) / ySpan) * (height - padding * 2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full rounded-lg bg-slate-950">
      <g stroke="#334155" strokeWidth="1" opacity="0.55">
        {[0, 1, 2, 3].map((item) => <line key={`h-${item}`} x1={padding} x2={width - padding} y1={padding + item * 40} y2={padding + item * 40} />)}
      </g>
      {zero && zeroY >= padding && zeroY <= height - padding && <line x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} stroke="#64748b" strokeDasharray="5 5" />}
      <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x={padding} y={height - 8} fill="#94a3b8" fontSize="10">min {round(minY)} max {round(maxY)}</text>
    </svg>
  );
}

function SpectrumChart({ points }: { points: XYPoint[] }) {
  const max = Math.max(...points.map((point) => point.y), 1);
  return (
    <svg viewBox="0 0 160 160" className="h-40 w-full rounded-lg bg-slate-950">
      {points.map((point, index) => {
        const height = (point.y / max) * 112;
        return <rect key={point.x} x={12 + index * 13} y={132 - height} width="8" height={height} rx="3" fill={index % 2 ? "#38bdf8" : "#f59e0b"} />;
      })}
      <text x="12" y="150" fill="#94a3b8" fontSize="10">harmonics</text>
    </svg>
  );
}

function VectorFieldChart({ samples }: { samples: Array<{ x: number; y: number; u: number; v: number }> }) {
  const size = 220;
  const center = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-56 w-full rounded-lg bg-slate-950">
      <line x1={center} x2={center} y1="18" y2={size - 18} stroke="#334155" />
      <line x1="18" x2={size - 18} y1={center} y2={center} stroke="#334155" />
      {samples.map((sample, index) => {
        const x = center + sample.x * 80;
        const y = center - sample.y * 80;
        const endX = x + sample.u * 22;
        const endY = y - sample.v * 22;
        return <line key={index} x1={x} y1={y} x2={endX} y2={endY} stroke={index % 2 ? "#38bdf8" : "#f59e0b"} strokeWidth="3" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function round(value: number) {
  return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : 0;
}
