import { useMemo, useState } from "react";
import { Line, OrbitControls, Text } from "@react-three/drei";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import TopicHeader from "../components/ui/TopicHeader";
import { compileFunctionExpression } from "../utils/functionParser";
import { roundTo } from "../utils/math";

type Point = { x: number; y: number; defined: boolean };

const presets = ["x^2", "x^3", "sin(x)", "cos(x)", "exp(x)", "log(x)", "abs(x)", "1/x"];

export default function DerivativesTangentVisualizer() {
  const [expression, setExpression] = useState("x^2");
  const [draft, setDraft] = useState("x^2");
  const [a, setA] = useState(1);
  const [h, setH] = useState(1);
  const [showSecant, setShowSecant] = useState(true);
  const [showDerivative, setShowDerivative] = useState(false);

  const compiled = useMemo(() => {
    try {
      return { fn: compileFunctionExpression(expression), error: "" };
    } catch (error) {
      return { fn: null, error: error instanceof Error ? error.message : "Invalid function" };
    }
  }, [expression]);

  const samples = useMemo(() => compiled.fn ? sample(compiled.fn, -8, 8) : [], [compiled.fn]);
  const derivativeSamples = useMemo(() => compiled.fn ? sample((x) => derivativeAt(compiled.fn!, x, 0.001), -8, 8) : [], [compiled.fn]);
  const fa = compiled.fn ? safeValue(compiled.fn, a) : NaN;
  const derivative = compiled.fn ? derivativeAt(compiled.fn, a, Math.min(0.01, Math.max(0.0001, Math.abs(h) / 10))) : NaN;
  const secantSlope = compiled.fn ? secantAt(compiled.fn, a, h) : NaN;
  const edgeNote = edgeCaseNote(expression, a, fa, derivative);

  return (
    <div className="space-y-6">
      <TopicHeader title="Derivatives and Tangent Lines Visualizer" subtitle="See the derivative as tangent slope, compare secants approaching tangents, and interpret rate of change numerically and visually." difficulty="Differential Calculus" estimatedMinutes={20} />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Controls" description="Type a function and move the tangent point.">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold">f(x)</span>
              <div className="mt-2 flex gap-2">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") setExpression(draft); }} className="premium-input min-h-11" />
                <button type="button" className="action-primary px-4" onClick={() => setExpression(draft)}>Plot</button>
              </div>
              {compiled.error && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">{compiled.error}</p>}
            </label>
            <SliderControl label="Tangent point x = a" value={a} min={-6} max={6} step={0.05} onChange={setA} />
            <SliderControl label="Secant distance h" value={h} min={-3} max={3} step={0.05} onChange={setH} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowSecant((value) => !value)} className={showSecant ? "action-primary" : "action-secondary"}>Secant line</button>
              <button type="button" onClick={() => setShowDerivative((value) => !value)} className={showDerivative ? "action-primary" : "action-secondary"}>Derivative graph</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric label="f(a)" value={formatValue(fa)} />
              <Metric label="f'(a)" value={formatValue(derivative)} />
              <Metric label="secant slope" value={formatValue(secantSlope)} />
              <Metric label="behavior" value={slopeMeaning(derivative)} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Tangent and Secant Graph" description="Blue is f(x), orange is tangent, violet is secant, green is f'(x) when enabled." tone="spotlight">
          <DerivativeGraph samples={samples} derivativeSamples={derivativeSamples} fn={compiled.fn} a={a} h={h} derivative={derivative} showSecant={showSecant} showDerivative={showDerivative} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="3D Labelled Tangent View" description="Rotate the same curve in 3D. Labels identify axes, curve, tangent, secant, and local slope.">
          <ThreeSceneWrapper height="520px" mobileHeight="420px" cameraPosition={[5.2, 4, 6.5]} fov={44} quality="high" chrome="cinematic" sceneLabel="Derivative 3D labels" interactionLabel="Drag rotate - wheel or pinch zoom">
            <DerivativeScene3D samples={samples} fn={compiled.fn} a={a} h={h} derivative={derivative} showSecant={showSecant} />
          </ThreeSceneWrapper>
        </SectionCard>

        <SectionCard title="Secant to Tangent Animation" description="As h becomes small, the secant slope approaches the tangent slope.">
          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="a" value={roundTo(a, 3).toString()} />
            <Metric label="a + h" value={roundTo(a + h, 3).toString()} />
            <Metric label="central difference" value="[f(a+h)-f(a-h)] / 2h" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{edgeNote}</p>
        </SectionCard>

        <SectionCard title="Explanation Panel">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>At <strong>x = {roundTo(a, 2)}</strong>, the derivative is approximately <strong>{formatValue(derivative)}</strong>.</p>
            <p>{slopeMeaning(derivative) === "increasing" ? "A positive slope means the function is increasing at this point." : slopeMeaning(derivative) === "decreasing" ? "A negative slope means the function is decreasing at this point." : "A near-zero slope can indicate a flat tangent and possible maximum or minimum."}</p>
            <p>The tangent line uses the local slope. The secant line uses two nearby points. Shrinking <strong>h</strong> makes the secant behave more like the tangent.</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Presets" description="Load common functions and inspect tangent behavior.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((preset) => (
            <button key={preset} type="button" onClick={() => { setDraft(preset); setExpression(preset); }} className="cinematic-preset-button font-mono">
              {preset}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DerivativeGraph({ samples, derivativeSamples, fn, a, h, derivative, showSecant, showDerivative }: { samples: Point[]; derivativeSamples: Point[]; fn: ((x: number) => number) | null; a: number; h: number; derivative: number; showSecant: boolean; showDerivative: boolean }) {
  const width = 760, height = 460, pad = 44, xMin = -8, xMax = 8, yMin = -8, yMax = 8;
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const fa = fn ? safeValue(fn, a) : NaN;
  const fb = fn ? safeValue(fn, a + h) : NaN;
  const tangent = Number.isFinite(fa) && Number.isFinite(derivative) ? [[a - 2, fa - derivative * 2], [a + 2, fa + derivative * 2]] : null;
  const secant = fn && Number.isFinite(fa) && Number.isFinite(fb) && Math.abs(h) > 0.0001 ? [[a, fa], [a + h, fb]] : null;
  const secantSlope = secant ? (secant[1][1] - secant[0][1]) / Math.max(1e-8, secant[1][0] - secant[0][0]) : 0;
  const run = 1;
  const rise = Number.isFinite(derivative) ? derivative * run : 0;
  return (
    <svg viewBox="0 0 760 460" className="cinematic-svg-stage sm:h-[460px]">
      <defs>
        <radialGradient id="derivative-bg" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
          <stop offset="56%" stopColor="#07182d" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <filter id="derivative-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <marker id="axis-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#e2e8f0" /></marker>
        <marker id="label-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L8,3 L0,6 Z" fill="#f8fafc" /></marker>
      </defs>
      <rect x="0" y="0" width="760" height="460" fill="url(#derivative-bg)" />
      {grid(width, height, pad)}
      <line x1={sx(0)} x2={sx(0)} y1={height - pad} y2={pad} stroke="#e2e8f0" strokeOpacity="0.82" strokeWidth="2.4" markerEnd="url(#axis-arrow)" />
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} stroke="#e2e8f0" strokeOpacity="0.82" strokeWidth="2.4" markerEnd="url(#axis-arrow)" />
      <text x={width - pad + 12} y={sy(0) + 6} fontSize="22" fontWeight="900" fill="#e2e8f0">x</text>
      <text x={sx(0) - 16} y={pad - 12} fontSize="22" fontWeight="900" fill="#e2e8f0">y</text>
      <path d={path(samples, sx, sy, yMin, yMax)} fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#derivative-glow)" />
      {showDerivative && <path d={path(derivativeSamples, sx, sy, yMin, yMax)} fill="none" stroke="#34d399" strokeWidth="4" opacity="0.85" filter="url(#derivative-glow)" />}
      {tangent && <line x1={sx(tangent[0][0])} y1={sy(tangent[0][1])} x2={sx(tangent[1][0])} y2={sy(tangent[1][1])} stroke="#f59e0b" strokeWidth="4" filter="url(#derivative-glow)" />}
      {showSecant && secant && <line x1={sx(secant[0][0])} y1={sy(secant[0][1])} x2={sx(secant[1][0])} y2={sy(secant[1][1])} stroke="#c084fc" strokeWidth="4" strokeDasharray="8 7" filter="url(#derivative-glow)" />}
      {showSecant && secant && <g opacity="0.75">
        <line x1={sx(secant[0][0])} x2={sx(secant[0][0])} y1={sy(0)} y2={sy(secant[0][1])} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="7 7" />
        <line x1={sx(secant[1][0])} x2={sx(secant[1][0])} y1={sy(0)} y2={sy(secant[1][1])} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="7 7" />
      </g>}
      {Number.isFinite(fa) && <g><circle cx={sx(a)} cy={sy(fa)} r="8" fill="#ef4444" stroke="#020617" strokeWidth="2" /><text x={sx(a) + 12} y={sy(fa) - 10} fontSize="13" fontWeight="900" fill="#f8fafc">point of tangency</text></g>}
      {Number.isFinite(fa) && Number.isFinite(rise) && <g><line x1={sx(a)} y1={sy(fa)} x2={sx(a + run)} y2={sy(fa)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="3" /><line x1={sx(a + run)} y1={sy(fa)} x2={sx(a + run)} y2={sy(fa + rise)} stroke="#e2e8f0" strokeOpacity="0.72" strokeWidth="3" /><text x={sx(a + run) + 8} y={sy(fa + rise)} fontSize="13" fontWeight="900" fill="#f8fafc">rise/run</text></g>}
      <text x={width * 0.58} y={height * 0.2} fontSize="20" fontWeight="900" fill="#22d3ee">y = f(x)</text>
      {tangent && <g><line x1={sx(a - 1.5)} y1={sy(fa + derivative * -1.5) - 54} x2={sx(a - 0.52)} y2={sy(fa + derivative * -0.52)} stroke="#f8fafc" strokeWidth="2" markerEnd="url(#label-arrow)" /><text x={sx(a - 2.2)} y={sy(fa + derivative * -1.5) - 62} fontSize="15" fontWeight="900" fill="#f8fafc">Tangent line</text></g>}
      {showSecant && secant && <g><line x1={sx(a + h * 0.35)} y1={sy(fa) + 64} x2={sx(a + h * 0.5)} y2={sy(fa + secantSlope * h * 0.5)} stroke="#f8fafc" strokeWidth="2" markerEnd="url(#label-arrow)" /><text x={sx(a + h * 0.1)} y={sy(fa) + 84} fontSize="15" fontWeight="900" fill="#f8fafc">Secant line</text></g>}
      <text x="58" y="28" fontSize="13" fontWeight="900" fill="#67e8f9">curve f(x)</text>
      <text x="142" y="28" fontSize="13" fontWeight="900" fill="#f59e0b">tangent</text>
      {showDerivative && <text x="192" y="28" fontSize="13" fontWeight="900" fill="#10b981">f'(x)</text>}
    </svg>
  );
}

function DerivativeScene3D({ samples, fn, a, h, derivative, showSecant }: { samples: Point[]; fn: ((x: number) => number) | null; a: number; h: number; derivative: number; showSecant: boolean }) {
  const scaleX = 0.42;
  const scaleY = 0.28;
  const to3D = (x: number, y: number): [number, number, number] => [x * scaleX, Math.max(-8, Math.min(8, y)) * scaleY, 0];
  const curve = samples.filter((point) => point.defined && point.y >= -8 && point.y <= 8).map((point) => to3D(point.x, point.y));
  const fa = fn ? safeValue(fn, a) : NaN;
  const fb = fn ? safeValue(fn, a + h) : NaN;
  const tangent: [number, number, number][] = Number.isFinite(fa) && Number.isFinite(derivative)
    ? [to3D(a - 2.4, fa - derivative * 2.4), to3D(a + 2.4, fa + derivative * 2.4)]
    : [];
  const secant: [number, number, number][] = showSecant && Number.isFinite(fa) && Number.isFinite(fb) && Math.abs(h) > 0.0001
    ? [to3D(a, fa), to3D(a + h, fb)]
    : [];
  const tangentPoint = Number.isFinite(fa) ? to3D(a, fa) : [0, 0, 0] as [number, number, number];
  const runEnd = Number.isFinite(fa) && Number.isFinite(derivative) ? to3D(a + 1, fa) : tangentPoint;
  const riseEnd = Number.isFinite(fa) && Number.isFinite(derivative) ? to3D(a + 1, fa + derivative) : tangentPoint;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.4} />
      <gridHelper args={[8, 16, "#38bdf8", "#334155"]} position={[0, -2.28, 0]} />
      <axesHelper args={[3.8]} />
      <Line points={[[-3.6, 0, 0], [3.6, 0, 0]]} color="#67e8f9" lineWidth={2} />
      <Line points={[[0, -2.4, 0], [0, 2.8, 0]]} color="#86efac" lineWidth={2} />
      <Line points={[[0, 0, -2.8], [0, 0, 2.8]]} color="#c4b5fd" lineWidth={2} />
      {curve.length > 1 && <Line points={curve} color="#22d3ee" lineWidth={5} />}
      {tangent.length > 1 && <Line points={tangent} color="#f59e0b" lineWidth={5} />}
      {secant.length > 1 && <Line points={secant} color="#c084fc" lineWidth={4} dashed dashSize={0.2} gapSize={0.12} />}
      <Line points={[tangentPoint, runEnd, riseEnd]} color="#f8fafc" lineWidth={3} />
      <mesh position={tangentPoint}>
        <sphereGeometry args={[0.08, 20, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.35} />
      </mesh>
      <Text position={[3.85, 0.1, 0]} fontSize={0.22} color="#67e8f9" anchorX="center" outlineWidth={0.012} outlineColor="#020617">x</Text>
      <Text position={[0.14, 3, 0]} fontSize={0.22} color="#86efac" anchorX="center" outlineWidth={0.012} outlineColor="#020617">y</Text>
      <Text position={[0, 0.14, 3]} fontSize={0.22} color="#c4b5fd" anchorX="center" outlineWidth={0.012} outlineColor="#020617">z</Text>
      <Text position={[1.4, 1.95, 0]} fontSize={0.2} color="#22d3ee" anchorX="center" outlineWidth={0.012} outlineColor="#020617">curve y = f(x)</Text>
      <Text position={[tangentPoint[0] + 0.55, tangentPoint[1] + 0.35, 0]} fontSize={0.17} color="#f59e0b" anchorX="left" outlineWidth={0.012} outlineColor="#020617">tangent slope f'(a) = {formatValue(derivative)}</Text>
      {secant.length > 1 && <Text position={[secant[1][0], secant[1][1] + 0.28, 0]} fontSize={0.17} color="#c084fc" anchorX="center" outlineWidth={0.012} outlineColor="#020617">secant line</Text>}
      <Text position={[runEnd[0] + 0.28, runEnd[1] + 0.18, 0]} fontSize={0.16} color="#f8fafc" anchorX="left" outlineWidth={0.012} outlineColor="#020617">rise / run</Text>
      <OrbitControls enablePan enableZoom enableDamping dampingFactor={0.08} />
    </>
  );
}

function sample(fn: (x: number) => number, min: number, max: number) {
  return Array.from({ length: 520 }, (_, i) => {
    const x = min + (i / 519) * (max - min);
    const y = safeValue(fn, x);
    return { x, y, defined: Number.isFinite(y) && Math.abs(y) < 1e5 };
  });
}

function derivativeAt(fn: (x: number) => number, x: number, h: number) {
  const left = safeValue(fn, x - h);
  const right = safeValue(fn, x + h);
  return Number.isFinite(left) && Number.isFinite(right) ? (right - left) / (2 * h) : NaN;
}

function secantAt(fn: (x: number) => number, x: number, h: number) {
  if (Math.abs(h) < 0.0001) return NaN;
  const y1 = safeValue(fn, x), y2 = safeValue(fn, x + h);
  return Number.isFinite(y1) && Number.isFinite(y2) ? (y2 - y1) / h : NaN;
}

function safeValue(fn: (x: number) => number, x: number) {
  try {
    const y = fn(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

function path(points: Point[], sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
  let open = false;
  return points.map((point) => {
    if (!point.defined || point.y < yMin - 8 || point.y > yMax + 8) {
      open = false;
      return "";
    }
    const command = open ? "L" : "M";
    open = true;
    return `${command}${sx(point.x)},${sy(point.y)}`;
  }).join(" ");
}

function grid(width: number, height: number, pad: number) {
  return <g>{Array.from({ length: 11 }).map((_, i) => <line key={`v-${i}`} x1={pad + i * (width - pad * 2) / 10} x2={pad + i * (width - pad * 2) / 10} y1={pad} y2={height - pad} stroke="#67e8f9" opacity="0.16" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1={pad} x2={width - pad} y1={pad + i * (height - pad * 2) / 8} y2={pad + i * (height - pad * 2) / 8} stroke="#67e8f9" opacity="0.16" />)}</g>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="cinematic-stat"><p className="cinematic-stat-label">{label}</p><p className="cinematic-stat-value">{value}</p></div>;
}

function formatValue(value: number) {
  return Number.isFinite(value) ? roundTo(value, 4).toString() : "undefined";
}

function slopeMeaning(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (value > 0.05) return "increasing";
  if (value < -0.05) return "decreasing";
  return "flat / possible extremum";
}

function edgeCaseNote(expression: string, a: number, fa: number, derivative: number) {
  const exp = expression.toLowerCase();
  if (exp.includes("abs") && Math.abs(a) < 0.05) return "For abs(x), the left slope and right slope disagree at 0, so the derivative does not exist there.";
  if ((exp.includes("1/x") || exp.includes("log")) && !Number.isFinite(fa)) return "The function is undefined at this x-value, so the tangent and derivative are not defined.";
  if (!Number.isFinite(derivative)) return "The derivative could not be computed here because nearby function values are undefined or unstable.";
  return "The numerical derivative uses central difference, which compares points on both sides of a.";
}

