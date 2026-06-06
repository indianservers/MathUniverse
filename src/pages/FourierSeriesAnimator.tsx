import { ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";

type WaveType = "square" | "triangle";

const PRESETS: Array<{ label: string; harmonics: number; time: number; wave: WaveType }> = [
  { label: "Square wave (9 harmonics)", harmonics: 9, time: 0, wave: "square" },
  { label: "Triangle wave (9 harmonics)", harmonics: 9, time: 0, wave: "triangle" },
  { label: "Square - max convergence", harmonics: 25, time: 0, wave: "square" },
  { label: "Triangle - max convergence", harmonics: 25, time: 0, wave: "triangle" },
  { label: "Square - single harmonic", harmonics: 1, time: 0, wave: "square" },
  { label: "Animated square (mid)", harmonics: 9, time: Math.PI, wave: "square" },
];

export default function FourierSeriesAnimator() {
  const [harmonics, setHarmonics] = useState(9);
  const [time, setTime] = useState(0);
  const [wave, setWave] = useState<WaveType>("square");
  const [presetOpen, setPresetOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const data = useMemo(() => seriesData(wave, Math.round(harmonics)), [wave, harmonics]);
  const circles = useMemo(() => harmonicCircles(wave, Math.round(harmonics), time), [wave, harmonics, time]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTime((value) => (value + 0.035) % (Math.PI * 2)), 28);
    return () => window.clearInterval(id);
  }, [playing]);

  function applyPreset(preset: typeof PRESETS[0]) {
    setHarmonics(preset.harmonics);
    setTime(preset.time);
    setWave(preset.wave);
    setPresetOpen(false);
  }

  return (
    <div className="space-y-5">
      <TopicHeader title="Fourier Series Animator" subtitle="Decompose square and triangle waves into spinning harmonic circles and convergence curves." difficulty="Visualizer" estimatedMinutes={10} />

      <SectionCard title="Harmonic Controls" description="Tune the wave, then let the epicycles run for a clean demo loop.">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"
              onClick={() => setPresetOpen((v) => !v)}
            >
              Presets
              <ChevronDown className={`h-4 w-4 transition ${presetOpen ? "rotate-180" : ""}`} />
            </button>
            {presetOpen && (
              <div className="absolute left-0 top-12 z-30 min-w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
                {PRESETS.map((p) => (
                  <button key={p.label} type="button" className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-400/10" onClick={() => applyPreset(p)}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${wave === "square" ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200" : "border-slate-200 bg-white/80 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
            type="button"
            onClick={() => setWave("square")}
          >
            Square
          </button>
          <button
            className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition ${wave === "triangle" ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200" : "border-slate-200 bg-white/80 text-slate-600 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}
            type="button"
            onClick={() => setWave("triangle")}
          >
            Triangle
          </button>
          <button type="button" className={playing ? "action-primary" : "action-secondary"} onClick={() => setPlaying((value) => !value)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="action-secondary" onClick={() => setTime(0)}>
            <RotateCcw className="h-4 w-4" />
            Reset phase
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SliderControl label="Harmonics" value={harmonics} min={1} max={25} step={2} onChange={setHarmonics} />
          <SliderControl label="Animation time" value={time} min={0} max={Math.PI * 2} step={0.03} onChange={setTime} />
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Spinning Harmonic Circles" description="Each glowing circle contributes one rotating harmonic." compact tone="spotlight">
          <div className="cinematic-graph-stage"><EpicycleView circles={circles} /></div>
        </SectionCard>
        <SectionCard title="Fourier Convergence" description="The target waveform emerges as harmonic energy accumulates." compact tone="spotlight">
          <div className="cinematic-graph-stage p-2"><ResponsiveLineChart data={data} /></div>
        </SectionCard>
      </div>
    </div>
  );
}

function ResponsiveLineChart({ data }: { data: { x: number; y: number }[] }) {
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 18, right: 18, bottom: 10, left: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(103,232,249,.22)" /><XAxis dataKey="x" stroke="#bae6fd" tick={{ fill: "#bae6fd", fontSize: 11 }} /><YAxis stroke="#bae6fd" tick={{ fill: "#bae6fd", fontSize: 11 }} /><Line type="monotone" dataKey="y" stroke="#22d3ee" dot={false} strokeWidth={4} /></LineChart></ResponsiveContainer>;
}

function EpicycleView({ circles }: { circles: { x: number; y: number; r: number }[] }) {
  const scale = 65;
  return (
    <svg viewBox="-220 -160 440 320" className="h-full w-full">
      <defs>
        <radialGradient id="fourier-bg" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
          <stop offset="55%" stopColor="#07182d" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="fourier-glow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="-220" y="-160" width="440" height="320" fill="url(#fourier-bg)" />
      <line x1="-220" x2="220" y1="0" y2="0" stroke="#64748b" strokeOpacity="0.55" />
      <line x1="0" x2="0" y1="-160" y2="160" stroke="#64748b" strokeOpacity="0.55" />
      {circles.map((circle, index) => <CircleSvg key={index} x={circle.x * scale} y={-circle.y * scale} r={Math.abs(circle.r) * scale} />)}
      {circles.length > 1 && <polyline points={circles.map((c) => `${c.x * scale},${-c.y * scale}`).join(" ")} fill="none" stroke="#f97316" strokeWidth="4" filter="url(#fourier-glow)" />}
    </svg>
  );
}

function CircleSvg({ x, y, r }: { x: number; y: number; r: number }) {
  return <><circle cx={x} cy={y} r={r} fill="none" stroke="rgba(103,232,249,.46)" strokeWidth="1.5" /><circle cx={x} cy={y} r="4" fill="#f97316" filter="url(#fourier-glow)" /></>;
}

function harmonicCircles(wave: WaveType, n: number, t: number) {
  const points = [{ x: 0, y: 0, r: 0 }];
  let x = 0;
  let y = 0;
  for (let k = 1; k <= n; k += 2) {
    const amp = wave === "square" ? 4 / (Math.PI * k) : (8 / (Math.PI * Math.PI)) * (((k - 1) / 2) % 2 === 0 ? 1 : -1) / (k * k);
    x += amp * Math.cos(k * t);
    y += amp * Math.sin(k * t);
    points.push({ x, y, r: amp });
  }
  return points;
}

function seriesData(wave: WaveType, n: number) {
  return Array.from({ length: 240 }, (_, index) => {
    const x = -Math.PI + (index / 239) * Math.PI * 2;
    let y = 0;
    for (let k = 1; k <= n; k += 2) {
      y += wave === "square" ? (4 / Math.PI) * Math.sin(k * x) / k : (8 / (Math.PI * Math.PI)) * (((k - 1) / 2) % 2 === 0 ? 1 : -1) * Math.sin(k * x) / (k * k);
    }
    return { x: Number(x.toFixed(2)), y };
  });
}
