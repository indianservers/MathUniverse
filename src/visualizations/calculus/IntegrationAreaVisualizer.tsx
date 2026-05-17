import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

const f = (x: number) => x * x + 1;
const sx = (x: number) => 40 + (x / 5) * 500;
const sy = (y: number) => 310 - (y / 27) * 280;
type Mode = "Left" | "Right" | "Midpoint";

export default function IntegrationAreaVisualizer() {
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(4);
  const [n, setN] = useState(24);
  const [mode, setMode] = useState<Mode>("Midpoint");
  const start = Math.min(a, b), end = Math.max(a, b);
  const dx = (end - start) / n;
  const sampleX = (i: number) => mode === "Left" ? start + i * dx : mode === "Right" ? start + (i + 1) * dx : start + (i + 0.5) * dx;
  const area = useMemo(() => Array.from({ length: n }, (_, i) => f(sampleX(i)) * dx).reduce((s, v) => s + v, 0), [start, dx, n, mode]);
  const exact = (end ** 3 / 3 + end) - (start ** 3 / 3 + start);
  const path = useMemo(() => Array.from({ length: 160 }, (_, i) => {
    const x = (i / 159) * 5;
    return `${i === 0 ? "M" : "L"} ${sx(x)} ${sy(f(x))}`;
  }).join(" "), []);
  return (
    <SectionCard title="Integration as Area" description="Integration adds many thin rectangles to approximate area under a curve.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="Start a" value={a} min={0} max={5} step={0.05} onChange={setA} />
          <SliderControl label="End b" value={b} min={0} max={5} step={0.05} onChange={setB} />
          <SliderControl label="Rectangles n" value={n} min={4} max={100} step={1} onChange={setN} />
          <label className="block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">Riemann mode<select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900" value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option>Left</option><option>Right</option><option>Midpoint</option></select></label>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="font-bold">Approx area = {roundTo(area, 4)}</p><p className="mt-2 text-sm">Exact area = {roundTo(exact, 4)} · error = {roundTo(Math.abs(area - exact), 4)}</p></div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 580 330" className="h-[360px] w-full">
            <line x1="40" x2="540" y1={sy(0)} y2={sy(0)} stroke="#64748b" />
            {Array.from({ length: n }, (_, i) => {
              const x = start + i * dx, h = f(sampleX(i));
              return <rect key={i} x={sx(x)} y={sy(h)} width={Math.max(1, sx(x + dx) - sx(x))} height={sy(0) - sy(h)} fill="rgba(34,211,238,.22)" stroke="rgba(6,182,212,.55)" />;
            })}
            <path d={path} fill="none" stroke="#f59e0b" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Integration accumulates area under a curve. Riemann sums approximate that area with rectangles."
          formula="∫(x²+1)dx from a to b = (b³/3+b) - (a³/3+a)"
          changes="Changing n changes rectangle width. Midpoint usually improves accuracy faster than left or right sums."
          realWorldUse="Accumulated distance, work, probability, economics, and total change."
          steps={[`Interval is [${roundTo(start, 2)}, ${roundTo(end, 2)}].`, `Use ${n} ${mode.toLowerCase()} rectangles.`, `Approximation = ${roundTo(area, 4)}.`, `Exact error = ${roundTo(Math.abs(area - exact), 4)}.`]}
          tasks={["Increase rectangles.", "Change interval.", "Compare left and midpoint methods."]}
        />
      </div>
    </SectionCard>
  );
}
