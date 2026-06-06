import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";

type Matrix = { a: number; b: number; c: number; d: number };
type Vec = { x: number; y: number };

const presets = [
  { name: "Diagonal matrix", matrix: { a: 2, b: 0, c: 0, d: 0.8 } },
  { name: "Scaling matrix", matrix: { a: 1.5, b: 0, c: 0, d: 1.5 } },
  { name: "Reflection matrix", matrix: { a: 1, b: 0, c: 0, d: -1 } },
  { name: "Shear matrix", matrix: { a: 1, b: 1, c: 0, d: 1 } },
  { name: "Rotation complex", matrix: { a: 0, b: -1, c: 1, d: 0 } },
  { name: "Symmetric matrix", matrix: { a: 2, b: 1, c: 1, d: 2 } },
  { name: "Singular matrix", matrix: { a: 1, b: 2, c: 2, d: 4 } },
];

export default function EigenvectorsVisualizerPage() {
  const [matrix, setMatrix] = useState<Matrix>({ a: 2, b: 0, c: 0, d: 1 });
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);
  const info = useMemo(() => eigenInfo(matrix), [matrix]);

  useEffect(() => {
    if (!playing) return;
    setT(0);
    const start = performance.now();
    const id = window.setInterval(() => {
      const next = Math.min(1, (performance.now() - start) / 1100);
      setT(next);
      if (next >= 1) setPlaying(false);
    }, 30);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Eigenvalues and Eigenvectors Visualizer" subtitle="Discover directions that keep their line under a matrix transformation and see how eigenvalues scale those directions." difficulty="Linear Algebra" estimatedMinutes={24} />
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Matrix Input" description="Edit a real 2x2 matrix and inspect its eigen-structure.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <NumberBox label="a" value={matrix.a} onChange={(a) => setMatrix((m) => ({ ...m, a }))} />
              <NumberBox label="b" value={matrix.b} onChange={(b) => setMatrix((m) => ({ ...m, b }))} />
              <NumberBox label="c" value={matrix.c} onChange={(c) => setMatrix((m) => ({ ...m, c }))} />
              <NumberBox label="d" value={matrix.d} onChange={(d) => setMatrix((m) => ({ ...m, d }))} />
            </div>
            <button type="button" className={playing ? "action-primary" : "action-secondary"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Animate Av"}</button>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="trace" value={roundTo(info.trace, 4).toString()} />
              <Metric label="determinant" value={roundTo(info.det, 4).toString()} />
              <Metric label="discriminant" value={roundTo(info.discriminant, 4).toString()} />
              <Metric label="eigen type" value={info.real ? "real" : "complex"} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Eigenvector Directions" description="Grey vectors show ordinary directions. Highlighted lines are real eigenvector directions when they exist." tone="spotlight">
          <EigenGraph matrix={matrix} info={info} t={t} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Presets">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {presets.map((preset) => <button key={preset.name} type="button" onClick={() => { setMatrix(preset.matrix); setPlaying(true); }} className="cinematic-preset-button">{preset.name}</button>)}
          </div>
        </SectionCard>

        <SectionCard title="Explanation Panel">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p className="rounded-2xl bg-slate-100 p-3 font-mono text-xs font-bold dark:bg-slate-950">A v = lambda v</p>
            <p><strong>v</strong> is an eigenvector when the matrix transforms it without changing its direction line.</p>
            <p><strong>lambda</strong> is the eigenvalue. It scales the vector length. Negative lambda points in the opposite direction on the same line.</p>
            {!info.real && <p>This matrix has complex eigenvalues, so real eigenvector directions are not visible in the 2D real plane.</p>}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Step-by-step Calculation">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Characteristic equation" value={`lambda^2 - ${roundTo(info.trace, 3)}lambda + ${roundTo(info.det, 3)} = 0`} />
          <Metric label="det(A - lambda I)" value={`(${matrix.a}-lambda)(${matrix.d}-lambda)-(${matrix.b})(${matrix.c})`} />
          <Metric label="Eigenvalues" value={info.real ? info.eigenvalues.map((v) => roundTo(v, 4)).join(", ") : `${roundTo(info.trace / 2, 3)} +/- ${roundTo(Math.sqrt(-info.discriminant) / 2, 3)}i`} />
          <Metric label="Eigenvectors" value={info.real ? info.eigenvectors.map((v) => `<${roundTo(v.x, 3)}, ${roundTo(v.y, 3)}>`).join("  ") : "none in real plane"} />
        </div>
      </SectionCard>
    </div>
  );
}

function EigenGraph({ matrix, info, t }: { matrix: Matrix; info: ReturnType<typeof eigenInfo>; t: number }) {
  const directions = Array.from({ length: 12 }, (_, i) => {
    const angle = i * Math.PI / 12;
    return { x: Math.cos(angle) * 2.2, y: Math.sin(angle) * 2.2 };
  });
  return (
    <svg viewBox="0 0 760 520" className="cinematic-svg-stage">
      <defs>
        <radialGradient id="eigen-bg" cx="50%" cy="44%" r="72%">
          <stop offset="0%" stopColor="#172554" stopOpacity="0.72" />
          <stop offset="54%" stopColor="#07182d" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="eigen-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="520" fill="url(#eigen-bg)" />
      <Axes />
      {directions.map((v, i) => {
        const av = multiply(matrix, v);
        const target = lerp(v, av, t);
        return <Arrow key={i} from={{ x: 0, y: 0 }} to={target} color="#94a3b8" label="" opacity={0.5} />;
      })}
      {info.real && info.eigenvectors.map((v, i) => {
        const lambda = info.eigenvalues[i];
        const scaled = lerp(v, { x: v.x * lambda, y: v.y * lambda }, t);
        return <g key={i}><line x1={sx(-v.x * 5)} y1={sy(-v.y * 5)} x2={sx(v.x * 5)} y2={sy(v.y * 5)} stroke={i === 0 ? "#f59e0b" : "#06b6d4"} strokeWidth="4" strokeDasharray="8 7" /><Arrow from={{ x: 0, y: 0 }} to={scaled} color={i === 0 ? "#f59e0b" : "#06b6d4"} label={`lambda ${roundTo(lambda, 2)}`} opacity={1} /></g>;
      })}
      {!info.real && <text x="120" y="250" fontSize="20" fontWeight="900" fill="#fecaca">Complex eigenvalues: no real eigenvector directions to draw.</text>}
    </svg>
  );
}

function eigenInfo(m: Matrix) {
  const trace = m.a + m.d;
  const det = m.a * m.d - m.b * m.c;
  const discriminant = trace * trace - 4 * det;
  if (discriminant < 0) return { trace, det, discriminant, real: false, eigenvalues: [], eigenvectors: [] as Vec[] };
  const root = Math.sqrt(discriminant);
  const eigenvalues = [(trace + root) / 2, (trace - root) / 2];
  const eigenvectors = eigenvalues.map((lambda) => normalize(eigenvectorFor(m, lambda)));
  return { trace, det, discriminant, real: true, eigenvalues, eigenvectors };
}

function eigenvectorFor(m: Matrix, lambda: number): Vec {
  const a = m.a - lambda, b = m.b, c = m.c, d = m.d - lambda;
  if (Math.abs(b) + Math.abs(a) > Math.abs(c) + Math.abs(d)) return Math.abs(b) > 1e-8 ? { x: b, y: -a } : { x: -d, y: c };
  return Math.abs(d) > 1e-8 ? { x: d, y: -c } : { x: -b, y: a };
}

function normalize(v: Vec): Vec {
  const mag = Math.hypot(v.x, v.y) || 1;
  return { x: (v.x / mag) * 2.4, y: (v.y / mag) * 2.4 };
}

function Axes() {
  return <g><line x1={sx(-5.5)} x2={sx(5.5)} y1={sy(0)} y2={sy(0)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" /><line x1={sx(0)} x2={sx(0)} y1={sy(-5)} y2={sy(5)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" />{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={sx(-5 + i)} y1={sy(-5)} x2={sx(-5 + i)} y2={sy(5)} stroke="#64748b" opacity="0.32" />)}{Array.from({ length: 11 }).map((_, i) => <line key={`h-${i}`} x1={sx(-5.5)} y1={sy(-5 + i)} x2={sx(5.5)} y2={sy(-5 + i)} stroke="#64748b" opacity="0.32" />)}</g>;
}

function Arrow({ from, to, color, label, opacity }: { from: Vec; to: Vec; color: string; label: string; opacity: number }) {
  return <g opacity={opacity} filter="url(#eigen-glow)"><line x1={sx(from.x)} y1={sy(from.y)} x2={sx(to.x)} y2={sy(to.y)} stroke={color} strokeWidth="5" markerEnd="url(#eigen-arrow)" /><circle cx={sx(to.x)} cy={sy(to.y)} r="6" fill={color} /><text x={sx(to.x) + 8} y={sy(to.y) - 8} fontSize="14" fontWeight="900" fill="#f8fafc">{label}</text><defs><marker id="eigen-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs></g>;
}

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="text-xs font-black uppercase text-slate-500">{label}</span><input type="number" step="0.1" value={roundTo(value, 4)} onChange={(event) => onChange(Number(event.target.value))} className="premium-input mt-1 min-h-10" /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function multiply(m: Matrix, v: Vec): Vec { return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }; }
function lerp(v: Vec, w: Vec, t: number): Vec { return { x: v.x + (w.x - v.x) * t, y: v.y + (w.y - v.y) * t }; }
function sx(x: number) { return 380 + x * 56; }
function sy(y: number) { return 260 - y * 56; }

