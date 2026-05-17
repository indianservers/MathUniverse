import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";

export default function FourierSeriesAnimator() {
  const [harmonics, setHarmonics] = useState(9);
  const [time, setTime] = useState(0);
  const [wave, setWave] = useState<"square" | "triangle">("square");
  const data = useMemo(() => seriesData(wave, Math.round(harmonics)), [wave, harmonics]);
  const circles = useMemo(() => harmonicCircles(wave, Math.round(harmonics), time), [wave, harmonics, time]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Fourier Series Animator" subtitle="Decompose square and triangle waves into spinning harmonic circles and convergence curves." difficulty="Visualizer" estimatedMinutes={10} />
      <SectionCard title="Harmonic Controls">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <SliderControl label="Harmonics" value={harmonics} min={1} max={25} step={2} onChange={setHarmonics} />
          <SliderControl label="Animation time" value={time} min={0} max={Math.PI * 2} step={0.03} onChange={setTime} />
          <button className="action-secondary" type="button" onClick={() => setWave(wave === "square" ? "triangle" : "square")}>{wave}</button>
        </div>
      </SectionCard>
      <div className="grid gap-6 lg:grid-cols-2">
        <GraphCard title="Spinning Harmonic Circles"><EpicycleView circles={circles} /></GraphCard>
        <GraphCard title="Fourier Convergence"><ResponsiveLineChart data={data} /></GraphCard>
      </div>
    </div>
  );
}

function ResponsiveLineChart({ data }: { data: { x: number; y: number }[] }) {
  return <ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.3)" /><XAxis dataKey="x" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Line type="monotone" dataKey="y" stroke="#06b6d4" dot={false} strokeWidth={3} /></LineChart></ResponsiveContainer>;
}

function EpicycleView({ circles }: { circles: { x: number; y: number; r: number }[] }) {
  const scale = 65;
  return (
    <svg viewBox="-220 -160 440 320" className="h-full w-full">
      <line x1="-220" x2="220" y1="0" y2="0" stroke="#334155" />
      <line x1="0" x2="0" y1="-160" y2="160" stroke="#334155" />
      {circles.map((circle, index) => <CircleSvg key={index} x={circle.x * scale} y={-circle.y * scale} r={Math.abs(circle.r) * scale} />)}
      {circles.length > 1 && <polyline points={circles.map((c) => `${c.x * scale},${-c.y * scale}`).join(" ")} fill="none" stroke="#f97316" strokeWidth="3" />}
    </svg>
  );
}

function CircleSvg({ x, y, r }: { x: number; y: number; r: number }) {
  return <><circle cx={x} cy={y} r={r} fill="none" stroke="rgba(6,182,212,.35)" /><circle cx={x} cy={y} r="4" fill="#f97316" /></>;
}

function harmonicCircles(wave: "square" | "triangle", n: number, t: number) {
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

function seriesData(wave: "square" | "triangle", n: number) {
  return Array.from({ length: 240 }, (_, index) => {
    const x = -Math.PI + (index / 239) * Math.PI * 2;
    let y = 0;
    for (let k = 1; k <= n; k += 2) {
      y += wave === "square" ? (4 / Math.PI) * Math.sin(k * x) / k : (8 / (Math.PI * Math.PI)) * (((k - 1) / 2) % 2 === 0 ? 1 : -1) * Math.sin(k * x) / (k * k);
    }
    return { x: Number(x.toFixed(2)), y };
  });
}
