import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";

type WaveType = "square" | "sawtooth" | "triangle" | "halfRectified" | "fullRectified" | "custom";
type Point = { x: number; y: number };

const waveOptions: { id: WaveType; label: string }[] = [
  { id: "square", label: "Square wave" },
  { id: "sawtooth", label: "Sawtooth wave" },
  { id: "triangle", label: "Triangle wave" },
  { id: "halfRectified", label: "Half-wave rectified sine" },
  { id: "fullRectified", label: "Full-wave rectified sine" },
  { id: "custom", label: "Custom periodic wave" },
];

export default function FourierSeriesVisualizerPage() {
  const [wave, setWave] = useState<WaveType>("square");
  const [harmonics, setHarmonics] = useState(7);
  const [animatedN, setAnimatedN] = useState(7);
  const [playing, setPlaying] = useState(false);
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);
  const [xRange, setXRange] = useState(Math.PI * 2);
  const [showTarget, setShowTarget] = useState(true);
  const [showApprox, setShowApprox] = useState(true);
  const [showHarmonics, setShowHarmonics] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => setAnimatedN(harmonics), [harmonics]);
  useEffect(() => {
    if (!playing) return;
    setAnimatedN(1);
    const id = window.setInterval(() => {
      setAnimatedN((value) => {
        if (value >= harmonics) {
          window.clearInterval(id);
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 450);
    return () => window.clearInterval(id);
  }, [playing, harmonics]);

  const visibleN = playing ? animatedN : harmonics;
  const data = useMemo(() => buildWaveData(wave, visibleN, amplitude, frequency, phase, xRange), [wave, visibleN, amplitude, frequency, phase, xRange]);
  const components = useMemo(() => buildComponents(wave, Math.min(visibleN, 10), amplitude, frequency, phase, xRange), [wave, visibleN, amplitude, frequency, phase, xRange]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Fourier Series Visualizer" subtitle="Build periodic waves by adding sine and cosine harmonics, then compare the target wave, approximation, components, and error." difficulty="Signals / Calculus" estimatedMinutes={24} />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Wave and Harmonic Controls" description="Choose a periodic target wave and control how many harmonics are added.">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">Wave selector</span>
              <select value={wave} onChange={(event) => setWave(event.target.value as WaveType)} className="mt-2 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950">
                {waveOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <SliderGroup title="Wave parameters">
              <SliderControl density="compact" label="Number of harmonics N" value={harmonics} min={1} max={50} step={1} onChange={setHarmonics} />
              <SliderControl density="compact" label="Amplitude" value={amplitude} min={0.2} max={3} step={0.1} onChange={setAmplitude} />
              <SliderControl density="compact" label="Frequency" value={frequency} min={0.5} max={3} step={0.1} onChange={setFrequency} />
              <SliderControl density="compact" label="Phase" value={phase} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase} />
              <SliderControl density="compact" label="x-range" value={xRange} min={Math.PI} max={Math.PI * 6} step={0.1} onChange={setXRange} />
            </SliderGroup>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={playing ? "action-primary" : "action-secondary"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Animate harmonics"}</button>
              <button type="button" className="action-secondary" onClick={() => { setPlaying(false); setAnimatedN(harmonics); }}><RotateCcw className="h-4 w-4" />Reset</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Toggle label="Target" value={showTarget} setValue={setShowTarget} />
              <Toggle label="Approximation" value={showApprox} setValue={setShowApprox} />
              <Toggle label="Harmonics" value={showHarmonics} setValue={setShowHarmonics} />
              <Toggle label="Error" value={showError} setValue={setShowError} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Main Fourier Graph" description="Blue is target, orange is Fourier approximation, red is error when enabled.">
          <WaveGraph data={data} showTarget={showTarget} showApprox={showApprox} showError={showError} xRange={xRange} />
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Metric label="Current harmonics" value={`${visibleN} / ${harmonics}`} />
            <Metric label="Fundamental frequency" value={roundTo(frequency, 2).toString()} />
            <Metric label="Phase" value={roundTo(phase, 2).toString()} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Component Waves" description="First 10 harmonic components are shown for readability.">
          {showHarmonics ? <ComponentsGraph components={components} xRange={xRange} /> : <p className="text-sm font-semibold text-slate-500">Turn on Harmonics to view individual components.</p>}
        </SectionCard>

        <SectionCard title="Formula Panel">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p className="rounded-2xl bg-slate-100 p-3 font-mono text-xs font-bold dark:bg-slate-950">{formulaFor(wave)}</p>
            {wave === "square" && <p className="rounded-2xl bg-amber-50 p-3 font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">Near jump discontinuities, overshoot remains even with many harmonics. This is Gibbs phenomenon.</p>}
            <p>More harmonics add higher-frequency corrections. Smooth waves converge quickly; sharp corners and jumps need many harmonics.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Educational Explanation">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Info title="Periodic functions" text="A periodic function repeats after a fixed interval. Fourier series use this repeating structure." />
          <Info title="Harmonics" text="Harmonics are sine and cosine waves at whole-number multiples of the fundamental frequency." />
          <Info title="Fundamental frequency" text="The first harmonic sets the base cycle. Higher harmonics add finer detail." />
          <Info title="Sharp corners" text="Jumps and corners require more harmonics because they contain high-frequency features." />
        </div>
      </SectionCard>
    </div>
  );
}

function WaveGraph({ data, showTarget, showApprox, showError, xRange }: { data: { x: number; target: number; approx: number; error: number }[]; showTarget: boolean; showApprox: boolean; showError: boolean; xRange: number }) {
  return (
    <svg viewBox="0 0 760 420" className="h-[320px] w-full rounded-2xl bg-slate-50 dark:bg-slate-950 sm:h-[420px]">
      <GraphFrame xRange={xRange} yMax={3.2} />
      {showTarget && <path d={path(data.map((p) => ({ x: p.x, y: p.target })), xRange, 3.2)} fill="none" stroke="#0891b2" strokeWidth="4" />}
      {showApprox && <path d={path(data.map((p) => ({ x: p.x, y: p.approx })), xRange, 3.2)} fill="none" stroke="#f59e0b" strokeWidth="4" />}
      {showError && <path d={path(data.map((p) => ({ x: p.x, y: p.error })), xRange, 3.2)} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="7 6" />}
    </svg>
  );
}

function ComponentsGraph({ components, xRange }: { components: { harmonic: number; points: Point[] }[]; xRange: number }) {
  return (
    <svg viewBox="0 0 760 360" className="h-[280px] w-full rounded-2xl bg-slate-50 dark:bg-slate-950 sm:h-[360px]">
      <GraphFrame xRange={xRange} yMax={2.4} height={360} />
      {components.map((component, i) => <path key={component.harmonic} d={path(component.points, xRange, 2.4, 360)} fill="none" stroke={componentColor(i)} strokeWidth="2.5" opacity="0.82" />)}
    </svg>
  );
}

function buildWaveData(wave: WaveType, n: number, amplitude: number, frequency: number, phase: number, xRange: number) {
  return Array.from({ length: 640 }, (_, i) => {
    const x = -xRange + (i / 639) * xRange * 2;
    const u = frequency * x + phase;
    const target = amplitude * targetWave(wave, u);
    const approx = amplitude * fourierApprox(wave, u, n);
    return { x, target, approx, error: target - approx };
  });
}

function buildComponents(wave: WaveType, n: number, amplitude: number, frequency: number, phase: number, xRange: number) {
  return Array.from({ length: n }, (_, index) => {
    const harmonic = index + 1;
    return {
      harmonic,
      points: Array.from({ length: 220 }, (_, i) => {
        const x = -xRange + (i / 219) * xRange * 2;
        return { x, y: amplitude * componentValue(wave, frequency * x + phase, harmonic) };
      }),
    };
  });
}

function targetWave(wave: WaveType, x: number) {
  if (wave === "square") return Math.sin(x) >= 0 ? 1 : -1;
  if (wave === "sawtooth") return 2 * (mod(x + Math.PI, Math.PI * 2) / (Math.PI * 2)) - 1;
  if (wave === "triangle") return (2 / Math.PI) * Math.asin(Math.sin(x));
  if (wave === "halfRectified") return Math.max(0, Math.sin(x));
  if (wave === "fullRectified") return Math.abs(Math.sin(x));
  return 0.65 * Math.sin(x) + 0.25 * Math.cos(2 * x) + 0.18 * Math.sin(3 * x);
}

function fourierApprox(wave: WaveType, x: number, n: number) {
  let sum = 0;
  for (let k = 1; k <= n; k += 1) sum += componentValue(wave, x, k);
  if (wave === "halfRectified") sum += 1 / Math.PI;
  if (wave === "fullRectified") sum += 2 / Math.PI;
  return sum;
}

function componentValue(wave: WaveType, x: number, k: number) {
  if (wave === "square") return k % 2 ? (4 / Math.PI) * Math.sin(k * x) / k : 0;
  if (wave === "sawtooth") return (2 / Math.PI) * (k % 2 ? 1 : -1) * Math.sin(k * x) / k;
  if (wave === "triangle") return k % 2 ? (8 / (Math.PI * Math.PI)) * ((k % 4 === 1 ? 1 : -1) * Math.sin(k * x) / (k * k)) : 0;
  if (wave === "halfRectified") return k === 1 ? Math.sin(x) / 2 : k % 2 === 0 ? -(2 / Math.PI) * Math.cos(k * x) / (k * k - 1) : 0;
  if (wave === "fullRectified") return k % 2 === 0 ? -(4 / Math.PI) * Math.cos(k * x) / (k * k - 1) : 0;
  return k === 1 ? 0.65 * Math.sin(x) : k === 2 ? 0.25 * Math.cos(2 * x) : k === 3 ? 0.18 * Math.sin(3 * x) : 0;
}

function formulaFor(wave: WaveType) {
  if (wave === "square") return "f(x) ≈ 4/pi [sin(x) + sin(3x)/3 + sin(5x)/5 + ...]";
  if (wave === "sawtooth") return "f(x) ≈ 2/pi [sin(x) - sin(2x)/2 + sin(3x)/3 - ...]";
  if (wave === "triangle") return "f(x) ≈ 8/pi^2 [sin(x) - sin(3x)/9 + sin(5x)/25 - ...]";
  if (wave === "halfRectified") return "f(x) ≈ 1/pi + sin(x)/2 - 2/pi [cos(2x)/3 + cos(4x)/15 + ...]";
  if (wave === "fullRectified") return "f(x) ≈ 2/pi - 4/pi [cos(2x)/3 + cos(4x)/15 + ...]";
  return "f(x) = 0.65sin(x) + 0.25cos(2x) + 0.18sin(3x)";
}

function GraphFrame({ xRange, yMax, height = 420 }: { xRange: number; yMax: number; height?: number }) {
  const width = 760, pad = 42;
  return <g>{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={pad + i * (width - pad * 2) / 10} x2={pad + i * (width - pad * 2) / 10} y1={pad} y2={height - pad} stroke="#cbd5e1" opacity="0.65" />)}{Array.from({ length: 7 }).map((_, i) => <line key={`h-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 6} y2={pad + i * (height - pad * 2) / 6} stroke="#cbd5e1" opacity="0.65" />)}<line x1={pad} x2={width - pad} y1={scaleY(0, yMax, height)} y2={scaleY(0, yMax, height)} stroke="#0f172a" strokeWidth="2" /><text x="52" y="28" fontSize="12" fontWeight="900" fill="#0f172a">x: {-roundTo(xRange, 1)} to {roundTo(xRange, 1)}</text></g>;
}

function path(points: Point[], xRange: number, yMax: number, height = 420) {
  return points.map((p, i) => `${i ? "L" : "M"}${scaleX(p.x, xRange)},${scaleY(Math.max(-yMax, Math.min(yMax, p.y)), yMax, height)}`).join(" ");
}

function scaleX(x: number, xRange: number) { return 42 + ((x + xRange) / (2 * xRange)) * (760 - 84); }
function scaleY(y: number, yMax: number, height: number) { return height - 42 - ((y + yMax) / (2 * yMax)) * (height - 84); }
function componentColor(index: number) { return ["#06b6d4", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#ec4899", "#6366f1", "#14b8a6", "#84cc16", "#f97316"][index % 10]; }
function mod(value: number, modulus: number) { return ((value % modulus) + modulus) % modulus; }

function Toggle({ label, value, setValue }: { label: string; value: boolean; setValue: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-white/10"><input type="checkbox" checked={value} onChange={(event) => setValue(event.target.checked)} />{label}</label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><h3 className="font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>;
}
