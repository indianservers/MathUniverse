import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";

type Matrix = { a: number; b: number; c: number; d: number };
type Vec = { x: number; y: number };
type Preset = { name: string; matrix: Matrix };

const presets: Preset[] = [
  { name: "Identity", matrix: { a: 1, b: 0, c: 0, d: 1 } },
  { name: "Scaling", matrix: { a: 1.6, b: 0, c: 0, d: 0.7 } },
  { name: "Reflection across x-axis", matrix: { a: 1, b: 0, c: 0, d: -1 } },
  { name: "Reflection across y-axis", matrix: { a: -1, b: 0, c: 0, d: 1 } },
  { name: "Rotation 45°", matrix: rotation(Math.PI / 4) },
  { name: "Rotation 90°", matrix: rotation(Math.PI / 2) },
  { name: "Shear x", matrix: { a: 1, b: 1, c: 0, d: 1 } },
  { name: "Shear y", matrix: { a: 1, b: 0, c: 1, d: 1 } },
  { name: "Projection", matrix: { a: 1, b: 0, c: 0, d: 0 } },
  { name: "Singular collapse", matrix: { a: 1, b: 1, c: 1, d: 1 } },
];

export default function MatrixTransformationsVisualizerPage() {
  const [matrix, setMatrix] = useState<Matrix>({ a: 1, b: 0, c: 0, d: 1 });
  const [vector, setVector] = useState<Vec>({ x: 2, y: 1 });
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);
  const det = matrix.a * matrix.d - matrix.b * matrix.c;
  const av = multiply(matrix, vector);

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
      <TopicHeader title="Matrix Transformations Visualizer" subtitle="See how a 2x2 matrix moves the whole plane, transforms basis vectors, reshapes grids, and scales area." difficulty="Linear Algebra" estimatedMinutes={22} />
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Matrix and Vector Controls" description="Edit the matrix entries and selected vector.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <NumberBox label="a" value={matrix.a} onChange={(a) => setMatrix((m) => ({ ...m, a }))} />
              <NumberBox label="b" value={matrix.b} onChange={(b) => setMatrix((m) => ({ ...m, b }))} />
              <NumberBox label="c" value={matrix.c} onChange={(c) => setMatrix((m) => ({ ...m, c }))} />
              <NumberBox label="d" value={matrix.d} onChange={(d) => setMatrix((m) => ({ ...m, d }))} />
            </div>
            <SliderControl label="vector x" value={vector.x} min={-4} max={4} step={0.1} onChange={(x) => setVector((v) => ({ ...v, x }))} />
            <SliderControl label="vector y" value={vector.y} min={-4} max={4} step={0.1} onChange={(y) => setVector((v) => ({ ...v, y }))} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className={playing ? "action-primary" : "action-secondary"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Animate"}</button>
              <button type="button" className="action-secondary" onClick={() => setT(1)}><RotateCcw className="h-4 w-4" />End state</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="det(A)" value={roundTo(det, 4).toString()} />
              <Metric label="Av" value={`<${roundTo(av.x, 2)}, ${roundTo(av.y, 2)}>`} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Grid, Basis, Vector, and Shape Transformation" description="Grey shows original structure; colored elements show transformed space.">
          <TransformGraph matrix={matrix} vector={vector} t={t} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Matrix Presets">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {presets.map((preset) => <button key={preset.name} type="button" onClick={() => { setMatrix(preset.matrix); setPlaying(true); }} className="rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-black transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">{preset.name}</button>)}
          </div>
        </SectionCard>

        <SectionCard title="Determinant Explanation">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p className="rounded-2xl bg-slate-100 p-3 font-mono text-xs font-bold dark:bg-slate-950">det(A) = ad - bc = {roundTo(det, 4)}</p>
            <p>Area scaling factor is <strong>{roundTo(Math.abs(det), 4)}</strong>.</p>
            <p>{Math.abs(det) < 0.001 ? "The matrix is singular: it collapses the plane into a line or point and is not invertible." : det > 0 ? "Orientation is preserved and the matrix is invertible." : "Orientation is reversed and the matrix is invertible."}</p>
            <p>The columns of the matrix are exactly where the basis vectors <strong>i</strong> and <strong>j</strong> move.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function TransformGraph({ matrix, vector, t }: { matrix: Matrix; vector: Vec; t: number }) {
  const morph = (v: Vec) => lerp(v, multiply(matrix, v), t);
  const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }];
  const triangle = [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2.5, y: 1 }];
  const tv = morph(vector);
  return (
    <svg viewBox="0 0 760 520" className="h-[360px] w-full rounded-2xl bg-slate-50 dark:bg-slate-950 sm:h-[520px]">
      <PlaneGrid transform={(p) => p} color="#cbd5e1" opacity={0.55} />
      <PlaneGrid transform={morph} color="#06b6d4" opacity={0.75} />
      <Axes />
      <Arrow from={{ x: 0, y: 0 }} to={{ x: 1, y: 0 }} color="#94a3b8" label="i" />
      <Arrow from={{ x: 0, y: 0 }} to={{ x: 0, y: 1 }} color="#94a3b8" label="j" />
      <Arrow from={{ x: 0, y: 0 }} to={morph({ x: 1, y: 0 })} color="#f59e0b" label="Ai" />
      <Arrow from={{ x: 0, y: 0 }} to={morph({ x: 0, y: 1 })} color="#8b5cf6" label="Aj" />
      <Polygon points={square} color="#94a3b8" opacity={0.18} />
      <Polygon points={square.map(morph)} color="#f59e0b" opacity={0.28} />
      <Polygon points={triangle} color="#94a3b8" opacity={0.18} />
      <Polygon points={triangle.map(morph)} color="#8b5cf6" opacity={0.28} />
      <Arrow from={{ x: 0, y: 0 }} to={vector} color="#64748b" label="v" />
      <Arrow from={{ x: 0, y: 0 }} to={tv} color="#ef4444" label="Av" />
    </svg>
  );
}

function PlaneGrid({ transform, color, opacity }: { transform: (v: Vec) => Vec; color: string; opacity: number }) {
  const lines = [];
  for (let k = -5; k <= 5; k += 1) {
    lines.push([{ x: -5, y: k }, { x: 5, y: k }]);
    lines.push([{ x: k, y: -5 }, { x: k, y: 5 }]);
  }
  return <g>{lines.map((line, i) => { const a = transform(line[0]); const b = transform(line[1]); return <line key={i} x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke={color} opacity={opacity} strokeWidth="2" />; })}</g>;
}

function Axes() {
  return <g><line x1={sx(-5.5)} x2={sx(5.5)} y1={sy(0)} y2={sy(0)} stroke="#0f172a" strokeWidth="2" /><line x1={sx(0)} x2={sx(0)} y1={sy(-5)} y2={sy(5)} stroke="#0f172a" strokeWidth="2" /></g>;
}

function Arrow({ from, to, color, label }: { from: Vec; to: Vec; color: string; label: string }) {
  return <g><line x1={sx(from.x)} y1={sy(from.y)} x2={sx(to.x)} y2={sy(to.y)} stroke={color} strokeWidth="5" markerEnd="url(#arrow)" /><circle cx={sx(to.x)} cy={sy(to.y)} r="6" fill={color} /><text x={sx(to.x) + 8} y={sy(to.y) - 8} fontSize="14" fontWeight="900" fill="#0f172a">{label}</text><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs></g>;
}

function Polygon({ points, color, opacity }: { points: Vec[]; color: string; opacity: number }) {
  return <polygon points={points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill={color} opacity={opacity} stroke={color} strokeWidth="4" />;
}

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="text-xs font-black uppercase text-slate-500">{label}</span><input type="number" step="0.1" value={roundTo(value, 4)} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none dark:border-white/10 dark:bg-slate-950" /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold">{value}</p></div>;
}

function multiply(m: Matrix, v: Vec): Vec { return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }; }
function lerp(v: Vec, w: Vec, t: number): Vec { return { x: v.x + (w.x - v.x) * t, y: v.y + (w.y - v.y) * t }; }
function rotation(theta: number): Matrix { return { a: Math.cos(theta), b: -Math.sin(theta), c: Math.sin(theta), d: Math.cos(theta) }; }
function sx(x: number) { return 380 + x * 56; }
function sy(y: number) { return 260 - y * 56; }

