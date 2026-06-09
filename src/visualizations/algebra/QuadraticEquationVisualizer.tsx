import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

type Point = { x: number; y: number };

const alpha = (1 + Math.sqrt(5)) / 2;
const beta = (1 - Math.sqrt(5)) / 2;
const sequence = Array.from({ length: 10 }, (_, index) => fibonacci(index + 1));

export default function QuadraticEquationVisualizer() {
  const [scale, setScale] = useState(1);
  const [activeN, setActiveN] = useState(1);
  const [playing, setPlaying] = useState(true);
  const points = useMemo(() => buildParabola(scale), [scale]);
  const current = sequence[activeN - 1];
  const ratio = current / 10 ** activeN;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setActiveN((value) => (value >= 10 ? 1 : value + 1)), 650);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <SectionCard title="Quadratic Roots and Sequence Convergence" description="The left plot marks the roots of x^2 - x - 1. The right panel shows Fibonacci-style terms shrinking after division by powers of 10.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="mini-chip">
              scale
              <input className="ml-2 w-36 accent-cyan-500" type="range" min="0.7" max="2.4" step="0.05" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
            </label>
            <span className="mini-chip">f(x) = x^2 - x - 1</span>
            <span className="mini-chip">roots alpha, beta</span>
          </div>
          <FastParabolaPlot points={points} scale={scale} />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button className={playing ? "action-primary" : "action-secondary"} type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button className="action-secondary" type="button" onClick={() => { setActiveN(1); setPlaying(false); }}>
              <RotateCcw className="h-4 w-4" />Reset
            </button>
          </div>
          <SequenceBars activeN={activeN} onSelect={setActiveN} />
          <div className="grid grid-cols-2 gap-2">
            <Metric label="n" value={activeN.toString()} />
            <Metric label="a_n" value={current.toString()} />
            <Metric label="a_n / 10^n" value={ratio.toExponential(3)} />
            <Metric label="series sum" value="10/89" />
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">
            The decimal-like series uses Fibonacci-style terms:
            <span className="font-mono font-black"> 1/10 + 1/100 + 2/1000 + 3/10000 + ... = 10/89</span>.
          </div>
        </div>
      </div>
      <div className="mt-4">
        <VisualLearningPanel
          concept="The same characteristic equation x^2 - x - 1 = 0 appears behind Fibonacci-style growth."
          formula="sum_{n>=1} a_n/10^n = 10/89"
          changes="The bars grow as a_n, but the digital ratio a_n/10^n rapidly shrinks because powers of 10 dominate."
          realWorldUse="Recurrences, generating functions, convergence tests, numerical series, and algorithm growth."
          steps={[`alpha = ${roundTo(alpha, 5)}, beta = ${roundTo(beta, 5)}`, `a_${activeN} = ${current}`, `a_${activeN}/10^${activeN} = ${ratio.toExponential(4)}`, "The infinite tail becomes small enough to settle at 10/89."]}
          tasks={["Drag the scale slider rapidly.", "Pause the bars at n = 10.", "Compare a_n growth with a_n/10^n shrinkage.", "Locate alpha and beta on the parabola."]}
        />
      </div>
    </SectionCard>
  );
}

function FastParabolaPlot({ points, scale }: { points: string; scale: number }) {
  const yAlpha = 0;
  const yBeta = 0;
  return (
    <svg viewBox="0 0 720 390" className="h-[390px] w-full rounded-xl bg-slate-950">
      <defs>
        <pattern id="quad-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0 L0 0 0 36" fill="none" stroke="rgba(148,163,184,0.16)" />
        </pattern>
        <filter id="quad-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="720" height="390" fill="url(#quad-grid)" />
      <line x1="45" y1={qy(0, scale)} x2="690" y2={qy(0, scale)} stroke="#e2e8f0" strokeOpacity="0.7" strokeWidth="2" />
      <line x1={qx(0, scale)} y1="30" x2={qx(0, scale)} y2="360" stroke="#e2e8f0" strokeOpacity="0.7" strokeWidth="2" />
      <path d={points} fill="none" stroke="#a78bfa" strokeWidth="4" filter="url(#quad-glow)" />
      <RootNode x={alpha} y={yAlpha} scale={scale} label="alpha" value={alpha} color="#22d3ee" />
      <RootNode x={beta} y={yBeta} scale={scale} label="beta" value={beta} color="#f59e0b" />
      <text x="58" y="46" fill="#e2e8f0" fontSize="15" fontWeight="900">f(x) = x^2 - x - 1</text>
      <text x={qx(2.1, scale)} y={qy(3.3, scale)} fill="#c4b5fd" fontSize="13" fontWeight="900">custom SVG plot for fast scaling</text>
    </svg>
  );
}

function RootNode({ x, y, scale, label, value, color }: { x: number; y: number; scale: number; label: string; value: number; color: string }) {
  return (
    <g filter="url(#quad-glow)">
      <circle cx={qx(x, scale)} cy={qy(y, scale)} r="9" fill={color} stroke="#020617" strokeWidth="2" />
      <text x={qx(x, scale) + 12} y={qy(y, scale) - 14} fill={color} fontSize="14" fontWeight="900" paintOrder="stroke" stroke="#020617" strokeWidth="4">
        {label} = {roundTo(value, 3)}
      </text>
    </g>
  );
}

function SequenceBars({ activeN, onSelect }: { activeN: number; onSelect: (n: number) => void }) {
  const max = Math.max(...sequence);
  return (
    <svg viewBox="0 0 420 270" className="h-[270px] w-full rounded-xl bg-slate-950">
      <rect width="420" height="270" fill="#020617" />
      <line x1="36" y1="232" x2="395" y2="232" stroke="#e2e8f0" strokeOpacity="0.7" strokeWidth="2" />
      <line x1="36" y1="24" x2="36" y2="232" stroke="#e2e8f0" strokeOpacity="0.7" strokeWidth="2" />
      {sequence.map((value, index) => {
        const n = index + 1;
        const height = (value / max) * 180;
        const x = 48 + index * 34;
        const active = n === activeN;
        return (
          <g
            key={n}
            onClick={() => onSelect(n)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelect(n);
            }}
            tabIndex={0}
            role="button"
            aria-label={`Show sequence term ${n}`}
            className="cursor-pointer outline-none"
          >
            <rect x={x} y={232 - height} width="22" height={height} rx="4" fill={active ? "#22d3ee" : "#64748b"} opacity={active ? 1 : 0.6} />
            <text x={x + 5} y="250" fill="#cbd5e1" fontSize="11" fontWeight="800">{n}</text>
            {active && <text x={Math.max(48, x - 12)} y={220 - height} fill="#67e8f9" fontSize="12" fontWeight="900">a{n}={value}</text>}
          </g>
        );
      })}
      <line x1={48 + (activeN - 1) * 34 + 11} y1="24" x2={48 + (activeN - 1) * 34 + 11} y2="232" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 5" />
      <text x="52" y="42" fill="#e2e8f0" fontSize="13" fontWeight="900">a_n against n = 1..10</text>
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function buildParabola(scale: number) {
  const pts: Point[] = [];
  for (let x = -3; x <= 4; x += 0.035) pts.push({ x, y: x * x - x - 1 });
  return pts.map((point, index) => `${index === 0 ? "M" : "L"} ${qx(point.x, scale).toFixed(2)} ${qy(point.y, scale).toFixed(2)}`).join(" ");
}

function fibonacci(n: number): number {
  if (n <= 2) return 1;
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i += 1) [a, b] = [b, a + b];
  return b;
}

function qx(x: number, scale: number) {
  return 330 + x * 70 * scale;
}

function qy(y: number, scale: number) {
  return 220 - y * 42 * scale;
}
