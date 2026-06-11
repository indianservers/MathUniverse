import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";

export default function SineCosineWaveVisualizer() {
  const [amplitude, setAmplitude] = useState(2);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [xPos, setXPos] = useState(Math.PI);
  const [playing, setPlaying] = useState(false);
  const [showTangent, setShowTangent] = useState(false);
  const [useCase, setUseCase] = useState("sound");
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPhase((p) => (p + 0.05 > Math.PI ? -Math.PI : p + 0.05)), 40);
    return () => window.clearInterval(id);
  }, [playing]);
  const data = useMemo(() => generateRange(0, Math.PI * 4, 0.08).map((x) => {
    const angle = frequency * x + phase;
    const cos = Math.cos(angle);
    const tangent = Math.abs(cos) < 0.08 ? null : Math.max(-8, Math.min(8, amplitude * Math.tan(angle)));
    return { x, sine: amplitude * Math.sin(angle), cosine: amplitude * cos, tangent };
  }), [amplitude, frequency, phase]);
  const sine = amplitude * Math.sin(frequency * xPos + phase);
  const cosine = amplitude * Math.cos(frequency * xPos + phase);
  const period = (Math.PI * 2) / frequency;
  const circleX = 80 + Math.cos(frequency * xPos + phase) * 48;
  const circleY = 80 - Math.sin(frequency * xPos + phase) * 48;
  const useExplanation: Record<string, string> = {
    sound: "Sound pitch increases with frequency and loudness follows amplitude.",
    "alternating current": "AC voltage oscillates like sine waves over time.",
    radar: "Radar reads reflected wave timing and frequency shifts.",
    "ocean wave": "Ocean height can be modeled with changing amplitude and period.",
    "signal processing": "Signals are decomposed into wave components for filtering and analysis.",
  };

  return (
    <SectionCard title="Sine and Cosine Wave Visualizer" description="Amplitude sets height, frequency sets cycles, and phase shifts the wave horizontally.">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-4 text-white"><p className="font-bold">y = A sin(fx + phi)</p><p className="text-sm opacity-90">A={roundTo(amplitude, 2)}, f={roundTo(frequency, 2)}, phi={roundTo(phase, 2)}</p></div>
          <SliderGroup title="Wave controls">
            <SliderControl density="compact" label="Amplitude A" value={amplitude} min={0.5} max={5} step={0.1} onChange={setAmplitude} />
            <SliderControl density="compact" label="Frequency f" value={frequency} min={0.5} max={5} step={0.1} onChange={setFrequency} />
            <SliderControl density="compact" label="Phase phi" value={phase} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase} />
            <SliderControl density="compact" label="Selected x" value={xPos} min={0} max={Math.PI * 4} step={0.05} onChange={setXPos} />
          </SliderGroup>
          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10"><input type="checkbox" checked={showTangent} onChange={(e) => setShowTangent(e.target.checked)} /> Show tangent wave</label>
          <label className="block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">Real-world use<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={useCase} onChange={(e) => setUseCase(e.target.value)}>{Object.keys(useExplanation).map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className="action-primary w-full" onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>
          <div className="grid grid-cols-2 gap-2 text-sm"><Metric label="sine" value={sine} /><Metric label="cosine" value={cosine} /><Metric label="period" value={period} /><Metric label="phase" value={phase} /></div>
          <p className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">{useExplanation[useCase]}</p>
        </div>
        <SectionCard title="Wave Graph" description="Sine and cosine move as a recording-friendly glowing waveform." compact tone="spotlight">
          <div className="cinematic-graph-stage p-2">
          <div className="hidden" />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(103,232,249,.2)" /><XAxis dataKey="x" stroke="#bae6fd" tick={{ fill: "#bae6fd", fontSize: 11 }} /><YAxis stroke="#bae6fd" tick={{ fill: "#bae6fd", fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(103,232,249,.25)", background: "rgba(2,6,23,.94)", color: "#f8fafc" }} labelStyle={{ color: "#e2e8f0" }} />
              <Line dataKey="sine" stroke="#22d3ee" strokeWidth={4} dot={false} /><Line dataKey="cosine" stroke="#fb7185" strokeWidth={4} dot={false} />
              {showTangent && <Line dataKey="tangent" stroke="#f59e0b" strokeWidth={2} dot={false} connectNulls={false} />}
              <ReferenceDot x={xPos} y={sine} r={6} fill="#22d3ee" stroke="#020617" /><ReferenceDot x={xPos} y={cosine} r={6} fill="#fb7185" stroke="#020617" />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
      <div className="mt-4 rounded-xl bg-slate-950 p-4 shadow-inner shadow-cyan-950/30">
        <svg viewBox="0 0 160 160" className="mx-auto h-40 max-w-full">
          <defs><filter id="wave-circle-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <circle cx="80" cy="80" r="48" fill="rgba(34,211,238,.08)" stroke="#67e8f9" strokeWidth="3" />
          <line x1="80" y1="80" x2={circleX} y2={circleY} stroke="#c084fc" strokeWidth="4" filter="url(#wave-circle-glow)" />
          <circle cx={circleX} cy={circleY} r="6" fill="#f59e0b" />
        </svg>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Circular motion unfolds into sine and cosine waves."
          formula="y = A sin(fx + phi), period = 2pi/f"
          changes="Amplitude changes height, frequency changes cycles, and phase shifts the graph left or right."
          realWorldUse={useExplanation[useCase]}
          warning={showTangent ? "Tangent is undefined near odd multiples of pi/2, so the graph safely breaks near asymptotes." : undefined}
          steps={[`Amplitude A=${roundTo(amplitude, 2)} sets height.`, `Frequency f=${roundTo(frequency, 2)} gives period ${roundTo(period, 3)}.`, `Phase phi=${roundTo(phase, 2)} shifts the wave.`, `Selected x gives sine=${roundTo(sine, 3)} and cosine=${roundTo(cosine, 3)}.`]}
          tasks={["Make sine wave amplitude 3.", "Double frequency and watch the period shrink.", "Move phase and watch the wave shift.", "Toggle tangent and observe safe gaps."]}
        />
      </div>
    </SectionCard>
  );
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{roundTo(value, 3)}</p></div>; }
