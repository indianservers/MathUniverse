import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Text } from "@react-three/drei";
import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Eye, Lightbulb, Pause, Play, RotateCcw } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { roundTo } from "../utils/math";

type Matrix = { a: number; b: number; c: number; d: number };
type Matrix3 = [[number, number, number], [number, number, number], [number, number, number]];
type Vec = { x: number; y: number };
type Vec3 = [number, number, number];
type Preset = { name: string; matrix: Matrix };

const presets: Preset[] = [
  { name: "Identity", matrix: { a: 1, b: 0, c: 0, d: 1 } },
  { name: "Scaling", matrix: { a: 1.6, b: 0, c: 0, d: 0.7 } },
  { name: "Reflection across x-axis", matrix: { a: 1, b: 0, c: 0, d: -1 } },
  { name: "Reflection across y-axis", matrix: { a: -1, b: 0, c: 0, d: 1 } },
  { name: "Rotation 45 deg", matrix: rotation(Math.PI / 4) },
  { name: "Rotation 90 deg", matrix: rotation(Math.PI / 2) },
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
  const [powerStep, setPowerStep] = useState(0);
  const [powerPlaying, setPowerPlaying] = useState(true);
  const [guideOpen, setGuideOpen] = useState(true);
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

  useEffect(() => {
    if (!powerPlaying) return;
    const id = window.setInterval(() => setPowerStep((value) => (value >= 5 ? 0 : value + 1)), 900);
    return () => window.clearInterval(id);
  }, [powerPlaying]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Matrix Transformations Visualizer" subtitle="See how a 2x2 matrix moves the whole plane, transforms basis vectors, reshapes grids, and scales area." difficulty="Linear Algebra" estimatedMinutes={22} />
      <MatrixGuidePanel matrix={matrix} vector={vector} av={av} det={det} open={guideOpen} onToggle={() => setGuideOpen((value) => !value)} />
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

        <SectionCard title="Grid, Basis, Vector, and Shape Transformation" description="Grey shows original structure; colored elements show transformed space." tone="spotlight">
          <MatrixPictureGuide matrix={matrix} vector={vector} av={av} det={det} />
          <TransformGraph matrix={matrix} vector={vector} t={t} />
        </SectionCard>
      </div>

      <SectionCard title="3D A^5 Spatial Transformation" description="Orbit the scene. The cyan grid compounds A five times while the amber ghost grid evaluates 149A - 385I; the final states overlap for this Cayley-polynomial matrix." tone="spotlight">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[460px] overflow-hidden rounded-xl border border-white/10 bg-slate-950">
            <MatrixPowerScene step={powerStep} />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" className={powerPlaying ? "action-primary" : "action-secondary"} onClick={() => setPowerPlaying((value) => !value)}>
                {powerPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {powerPlaying ? "Pause" : "Play"}
              </button>
              <button type="button" className="action-secondary" onClick={() => { setPowerStep(0); setPowerPlaying(false); }}>
                <RotateCcw className="h-4 w-4" />Reset
              </button>
            </div>
            <label className="block rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
              Compound step A^n
              <input className="mt-3 w-full accent-cyan-500" type="range" min={0} max={5} step={1} value={powerStep} onChange={(event) => { setPowerStep(Number(event.target.value)); setPowerPlaying(false); }} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="cyan state" value={`A^${powerStep}`} />
              <Metric label="ghost state" value="149A - 385I" />
              <Metric label="proof frame" value={powerStep === 5 ? "overlap" : "animating"} />
              <Metric label="camera" value="orbit/zoom" />
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-sm leading-6 dark:bg-white/10">
              The demo uses a real 3D block matrix whose eigenvalues satisfy λ^5 - 149λ + 385 = 0. Therefore the same polynomial applied to A gives A^5 = 149A - 385I.
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="Matrix Presets">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {presets.map((preset) => <button key={preset.name} type="button" onClick={() => { setMatrix(preset.matrix); setPlaying(true); }} className="cinematic-preset-button">{preset.name}</button>)}
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

function MatrixGuidePanel({ matrix, vector, av, det, open, onToggle }: { matrix: Matrix; vector: Vec; av: Vec; det: number; open: boolean; onToggle: () => void }) {
  const basisI = multiply(matrix, { x: 1, y: 0 });
  const basisJ = multiply(matrix, { x: 0, y: 1 });
  const determinantState = Math.abs(det) < 0.001 ? "collapses the plane" : det > 0 ? "keeps orientation" : "flips orientation";

  return (
    <section className="rounded-3xl border border-cyan-400/30 bg-slate-950/80 p-4 shadow-xl shadow-cyan-950/20">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="flex items-center gap-2 text-base font-black text-white">
          <BookOpen className="h-5 w-5 text-cyan-300" />
          Proper guide: how to read this matrix transformation
        </span>
        <ChevronDown className={`h-5 w-5 text-cyan-200 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase text-cyan-200">1. Matrix as two destination arrows</p>
            <div className="mt-3 rounded-xl bg-slate-900 p-3 font-mono text-sm font-bold text-white">
              A = [[{formatNumber(matrix.a)}, {formatNumber(matrix.b)}], [{formatNumber(matrix.c)}, {formatNumber(matrix.d)}]]
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Column 1 tells where i goes: <strong className="text-amber-300">Ai = {formatVec(basisI)}</strong>. Column 2 tells where j goes: <strong className="text-violet-300">Aj = {formatVec(basisJ)}</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase text-cyan-200">2. Current vector calculation</p>
            <div className="mt-3 rounded-xl bg-slate-900 p-3 font-mono text-xs font-bold leading-6 text-white">
              A{xVec(vector)} = ({formatNumber(matrix.a)}*{formatNumber(vector.x)} + {formatNumber(matrix.b)}*{formatNumber(vector.y)}, {formatNumber(matrix.c)}*{formatNumber(vector.x)} + {formatNumber(matrix.d)}*{formatNumber(vector.y)})
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              So the red transformed vector is <strong className="text-red-300">Av = {formatVec(av)}</strong>.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase text-cyan-200">3. Determinant meaning</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Metric label="det(A)" value={formatNumber(det)} />
              <Metric label="area scale" value={formatNumber(Math.abs(det))} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This matrix <strong className="text-cyan-200">{determinantState}</strong>. If det is 0, many points land on the same line and the matrix has no inverse.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MatrixPictureGuide({ matrix, vector, av, det }: { matrix: Matrix; vector: Vec; av: Vec; det: number }) {
  return (
    <div className="mb-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-cyan-100">
          <Eye className="h-4 w-4" />
          Read the picture from the arrows first
        </div>
        <div className="mt-3 grid gap-2 text-xs font-bold text-slate-200 sm:grid-cols-2">
          <GuidePill color="bg-slate-400" label="grey" value="original grid, i, j, and v" />
          <GuidePill color="bg-cyan-300" label="cyan" value="where the whole grid moves" />
          <GuidePill color="bg-amber-400" label="Ai" value={`i becomes ${formatVec({ x: matrix.a, y: matrix.c })}`} />
          <GuidePill color="bg-violet-400" label="Aj" value={`j becomes ${formatVec({ x: matrix.b, y: matrix.d })}`} />
          <GuidePill color="bg-red-400" label="Av" value={`${xVec(vector)} becomes ${formatVec(av)}`} />
          <GuidePill color="bg-white" label="det" value={`${formatNumber(det)} controls area and flip`} />
        </div>
      </div>
      <div className="rounded-2xl border border-amber-300/20 bg-amber-950/20 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-amber-100">
          <Lightbulb className="h-4 w-4" />
          Best way to use it
        </div>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
          <li><strong>1.</strong> Pick a preset like Rotation or Shear.</li>
          <li><strong>2.</strong> Watch Ai and Aj. They define the whole transformation.</li>
          <li><strong>3.</strong> Move vector x/y and compare grey v with red Av.</li>
          <li><strong>4.</strong> Check det(A) to know area scaling and whether the plane flips or collapses.</li>
        </ol>
      </div>
    </div>
  );
}

function GuidePill({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex min-h-12 items-center gap-2 rounded-xl bg-slate-950/70 px-3 py-2">
      <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <span className="shrink-0 uppercase text-slate-400">{label}</span>
      <span className="min-w-0 text-slate-100">{value}</span>
    </div>
  );
}

function TransformGraph({ matrix, vector, t }: { matrix: Matrix; vector: Vec; t: number }) {
  const morph = (v: Vec) => lerp(v, multiply(matrix, v), t);
  const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }];
  const triangle = [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2.5, y: 1 }];
  const tv = morph(vector);
  return (
    <svg viewBox="0 0 760 520" className="cinematic-svg-stage">
      <defs>
        <radialGradient id="matrix-bg" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
          <stop offset="52%" stopColor="#07182d" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="matrix-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="760" height="520" fill="url(#matrix-bg)" />
      <PlaneGrid transform={(p) => p} color="#64748b" opacity={0.32} />
      <PlaneGrid transform={morph} color="#22d3ee" opacity={0.82} />
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
  return <g><line x1={sx(-5.5)} x2={sx(5.5)} y1={sy(0)} y2={sy(0)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" /><line x1={sx(0)} x2={sx(0)} y1={sy(-5)} y2={sy(5)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="2" /></g>;
}

function Arrow({ from, to, color, label }: { from: Vec; to: Vec; color: string; label: string }) {
  return <g filter="url(#matrix-glow)"><line x1={sx(from.x)} y1={sy(from.y)} x2={sx(to.x)} y2={sy(to.y)} stroke={color} strokeWidth="5" markerEnd="url(#arrow)" /><circle cx={sx(to.x)} cy={sy(to.y)} r="6" fill={color} /><text x={sx(to.x) + 8} y={sy(to.y) - 8} fontSize="14" fontWeight="900" fill="#f8fafc">{label}</text><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs></g>;
}

function Polygon({ points, color, opacity }: { points: Vec[]; color: string; opacity: number }) {
  return <polygon points={points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill={color} opacity={opacity} stroke={color} strokeWidth="4" />;
}

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="text-xs font-black uppercase text-slate-500">{label}</span><input type="number" step="0.1" value={roundTo(value, 4)} onChange={(event) => onChange(Number(event.target.value))} className="premium-input mt-1 min-h-10" /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function MatrixPowerScene({ step }: { step: number }) {
  const a = cayleyMatrix();
  const aStep = matrixPower3(a, step);
  const a5 = matrixPower3(a, 5);
  const rhs = subtract3(scale3(a, 149), scale3(identity3(), 385));
  const grid = cubeGridLines();
  const t = step / 5;
  const denominator = Math.max(1, maxMatrixAbs(aStep), maxMatrixAbs(rhs) * t);
  const cyanLines = grid.map(([from, to]) => [fitVec(transform3(aStep, from), denominator), fitVec(transform3(aStep, to), denominator)] as [Vec3, Vec3]);
  const ghostLines = grid.map(([from, to]) => [
    fitVec(lerp3(from, transform3(rhs, from), t), denominator),
    fitVec(lerp3(to, transform3(rhs, to), t), denominator),
  ] as [Vec3, Vec3]);
  const overlapError = maxMatrixDelta(a5, rhs);

  return (
    <Canvas camera={{ position: [5.5, 4.2, 6], fov: 48 }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <OrbitControls enablePan enableZoom enableDamping makeDefault />
      <group>
        <Grid3D lines={grid} color="#64748b" opacity={0.22} />
        <Grid3D lines={cyanLines} color="#22d3ee" opacity={0.95} />
        <Grid3D lines={ghostLines} color="#f59e0b" opacity={0.78} />
        <Axis3D />
        <Text position={[-2.6, 2.5, 0]} fontSize={0.18} color="#e2e8f0" anchorX="left">
          {`A^${step}  |  max error A^5-(149A-385I): ${overlapError.toExponential(1)}`}
        </Text>
        <Text position={[-2.6, 2.2, 0]} fontSize={0.16} color="#67e8f9" anchorX="left">
          cyan: compounded A, amber: 149A - 385I ghost
        </Text>
      </group>
    </Canvas>
  );
}

function Grid3D({ lines, color, opacity }: { lines: Array<[Vec3, Vec3]>; color: string; opacity: number }) {
  return (
    <group>
      {lines.map(([start, end], index) => (
        <Line key={index} points={[start, end]} color={color} transparent opacity={opacity} lineWidth={2} />
      ))}
    </group>
  );
}

function Axis3D() {
  return (
    <group>
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#f8fafc" transparent opacity={0.75} />
      <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="#f8fafc" transparent opacity={0.75} />
      <Line points={[[0, 0, -2.5], [0, 0, 2.5]]} color="#f8fafc" transparent opacity={0.75} />
      <Text position={[2.7, 0, 0]} fontSize={0.18} color="#f8fafc">x</Text>
      <Text position={[0, 2.7, 0]} fontSize={0.18} color="#f8fafc">y</Text>
      <Text position={[0, 0, 2.7]} fontSize={0.18} color="#f8fafc">z</Text>
    </group>
  );
}

function cubeGridLines(): Array<[Vec3, Vec3]> {
  const lines: Array<[Vec3, Vec3]> = [];
  const values = [-1, -0.5, 0, 0.5, 1];
  for (const y of values) for (const z of values) lines.push([[-1, y, z], [1, y, z]]);
  for (const x of values) for (const z of values) lines.push([[x, -1, z], [x, 1, z]]);
  for (const x of values) for (const y of values) lines.push([[x, y, -1], [x, y, 1]]);
  return lines;
}

function cayleyMatrix(): Matrix3 {
  return [
    [-3.9611340293775505, 0, 0],
    [0, 2.5, -0.8660254037844395],
    [0, 0.8660254037844395, 2.5],
  ];
}

function identity3(): Matrix3 {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

function matrixPower3(matrix: Matrix3, power: number): Matrix3 {
  let result = identity3();
  for (let i = 0; i < power; i += 1) result = multiply3(result, matrix);
  return result;
}

function multiply3(left: Matrix3, right: Matrix3): Matrix3 {
  return [0, 1, 2].map((row) => [0, 1, 2].map((column) => left[row][0] * right[0][column] + left[row][1] * right[1][column] + left[row][2] * right[2][column])) as Matrix3;
}

function scale3(matrix: Matrix3, scalar: number): Matrix3 {
  return matrix.map((row) => row.map((value) => value * scalar)) as Matrix3;
}

function subtract3(left: Matrix3, right: Matrix3): Matrix3 {
  return left.map((row, rowIndex) => row.map((value, columnIndex) => value - right[rowIndex][columnIndex])) as Matrix3;
}

function transform3(matrix: Matrix3, vector: Vec3): Vec3 {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

function fitVec(vector: Vec3, denominator: number): Vec3 {
  const scale = 2.1 / denominator;
  return [vector[0] * scale, vector[1] * scale, vector[2] * scale];
}

function lerp3(from: Vec3, to: Vec3, t: number): Vec3 {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, from[2] + (to[2] - from[2]) * t];
}

function maxMatrixDelta(left: Matrix3, right: Matrix3) {
  return Math.max(...left.flatMap((row, rowIndex) => row.map((value, columnIndex) => Math.abs(value - right[rowIndex][columnIndex]))));
}

function maxMatrixAbs(matrix: Matrix3) {
  return Math.max(...matrix.flatMap((row) => row.map((value) => Math.abs(value))));
}

function multiply(m: Matrix, v: Vec): Vec { return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }; }
function lerp(v: Vec, w: Vec, t: number): Vec { return { x: v.x + (w.x - v.x) * t, y: v.y + (w.y - v.y) * t }; }
function rotation(theta: number): Matrix { return { a: Math.cos(theta), b: -Math.sin(theta), c: Math.sin(theta), d: Math.cos(theta) }; }
function formatNumber(value: number) { return roundTo(value, 3).toString(); }
function formatVec(vector: Vec) { return `<${formatNumber(vector.x)}, ${formatNumber(vector.y)}>`; }
function xVec(vector: Vec) { return `<${formatNumber(vector.x)}, ${formatNumber(vector.y)}>`; }
function sx(x: number) { return 380 + x * 56; }
function sy(y: number) { return 260 - y * 56; }

