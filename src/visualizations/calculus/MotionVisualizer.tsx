import { useMemo, useState } from "react";
import ResponsiveLineChart from "../../components/charts/ResponsiveLineChart";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { generateRange } from "../../utils/graph";
import { roundTo } from "../../utils/math";

export default function MotionVisualizer() {
  const [t, setT] = useState(4);
  const [kind, setKind] = useState<"square" | "cube" | "sine">("square");
  const data = useMemo(() => generateRange(0, 10, 0.25), []);
  const position = (x: number) => kind === "square" ? x * x : kind === "cube" ? x ** 3 / 10 : Math.sin(x);
  const velocity = (x: number) => kind === "square" ? 2 * x : kind === "cube" ? 0.3 * x * x : Math.cos(x);
  const acceleration = (x: number) => kind === "square" ? 2 : kind === "cube" ? 0.6 * x : -Math.sin(x);
  const sData = data.map((x) => ({ x, y: position(x) }));
  const vData = data.map((x) => ({ x, y: velocity(x) }));
  const aData = data.map((x) => ({ x, y: acceleration(x) }));
  const pos = position(t);
  const vel = velocity(t);
  const acc = acceleration(t);
  const trackX = Math.max(5, Math.min(95, kind === "sine" ? 50 + pos * 35 : 5 + (pos / Math.max(...sData.map((p) => p.y))) * 90));
  return (
    <SectionCard title="Motion Visualizer" description="Velocity is the derivative of position; acceleration is the derivative of velocity.">
      <SliderControl label="Time t" value={t} min={0} max={10} step={0.1} onChange={setT} />
      <label className="mt-4 block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">Position function<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={kind} onChange={(e) => setKind(e.target.value as "square" | "cube" | "sine")}><option value="square">s(t) = t²</option><option value="cube">s(t) = t³ / 10</option><option value="sine">s(t) = sin(t)</option></select></label>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat label="Position" value={pos} /><Stat label="Velocity" value={vel} /><Stat label="Acceleration" value={acc} />
      </div>
      <div className="mt-5 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
        <div className="relative h-10 rounded-full bg-white dark:bg-slate-950"><div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-300 dark:bg-slate-700" /><div className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cyan-400 shadow-lg" style={{ left: `calc(${trackX}% - 12px)` }} /></div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Velocity direction: {vel > 0.001 ? "forward" : vel < -0.001 ? "backward" : "momentarily stopped"} · Acceleration direction: {acc > 0.001 ? "positive" : acc < -0.001 ? "negative" : "zero"}</p>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SmallChart title="Position" data={sData} t={t} color="#06b6d4" />
        <SmallChart title="Velocity" data={vData} t={t} color="#8b5cf6" />
        <SmallChart title="Acceleration" data={aData} t={t} color="#f59e0b" />
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Motion links position, velocity, and acceleration through derivatives."
          formula="position -> derivative -> velocity -> derivative -> acceleration"
          changes="Changing the function changes the derivative relationships. Changing t moves the object and chart readouts."
          realWorldUse="Physics, robotics, animation, vehicle tracking, and control systems."
          steps={[`Position at t=${roundTo(t, 2)} is ${roundTo(pos, 3)}.`, `Velocity is ${roundTo(vel, 3)} (${vel >= 0 ? "forward" : "backward"}).`, `Acceleration is ${roundTo(acc, 3)}.`, "Acceleration changes velocity over time."]}
          tasks={["Try s(t)=sin(t).", "Find a time where velocity is negative.", "Compare t² and t³ motion."]}
        />
      </div>
    </SectionCard>
  );
}
function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{roundTo(value, 2)}</p></div>; }
function SmallChart({ title, data, color }: { title: string; data: { x: number; y: number }[]; t: number; color: string }) {
  return <GraphCard title={title}><ResponsiveLineChart data={data} lineColor={color} /></GraphCard>;
}
