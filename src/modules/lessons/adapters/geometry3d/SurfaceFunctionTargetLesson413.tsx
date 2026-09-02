import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Check, CircleHelp, RotateCcw, Share2, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./SurfaceFunctionTargetLesson413.css";

type Preset = "plane" | "paraboloid" | "saddle" | "ripple";
type Point = { x: number; y: number; z: number };
type Domain = { xMin: number; xMax: number; yMin: number; yMax: number };
const initialDomain: Domain = { xMin: -3, xMax: 3, yMin: -3, yMax: 3 };
export default function SurfaceFunctionTargetLesson413({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [preset, setPreset] = useState<Preset>("saddle"),
    [a, setA] = useState(1),
    [b, setB] = useState(-1),
    [c, setC] = useState(0),
    [domain, setDomain] = useState(initialDomain),
    [hover, setHover] = useState<Point>({ x: 0, y: 0, z: 0 }),
    [tab, setTab] = useState("Surface"),
    [traceX, setTraceX] = useState(0),
    [traceY, setTraceY] = useState(0),
    [heightMode, setHeightMode] = useState("Height z"),
    [challenge, setChallenge] = useState<"idle" | "correct" | "incorrect">(
      "correct",
    ),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setPreset("saddle");
    setA(1);
    setB(-1);
    setC(0);
    setDomain(initialDomain);
    setHover({ x: 0, y: 0, z: 0 });
    setTab("Surface");
    setTraceX(0);
    setTraceY(0);
    setHeightMode("Height z");
    setChallenge("correct");
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const value = (x: number, y: number) => evaluate(preset, a, b, c, x, y),
    gradient = derive(preset, a, b, hover.x, hover.y),
    range = sampleRange(preset, a, b, c, domain),
    equation = equationText(preset, a, b, c);
  const choose = (next: Preset) =>
    act(() => {
      setPreset(next);
      if (next === "plane") {
        setA(1);
        setB(1);
        setC(0);
      } else if (next === "paraboloid") {
        setA(1);
        setB(1);
        setC(0);
      } else if (next === "saddle") {
        setA(1);
        setB(-1);
        setC(0);
      } else {
        setA(1);
        setB(1);
        setC(0);
      }
      setChallenge(next === "saddle" ? "correct" : "idle");
    });
  const updateDomain = (key: keyof Domain, next: number) =>
    act(() => setDomain((current) => ({ ...current, [key]: next })));
  return (
    <section
      className="cs378-page sf413-page"
      data-testid="geometry3d-mockup-0598"
      data-lesson-title="Surface z=f(x,y)"
      data-object-model="threejs-dedicated-parametric-height-surface-contours-traces-gradient-tangent-plane-saddle-challenge"
      data-direct-interaction="true"
      data-preset={preset}
      data-a={a}
      data-b={b}
      data-c={c}
      data-x={round(hover.x)}
      data-y={round(hover.y)}
      data-z={round(hover.z)}
      data-gradient={`${round(gradient.x)},${round(gradient.y)}`}
      data-range={`${round(range.min)},${round(range.max)}`}
      data-equation={equation}
      data-trace-x={traceX}
      data-trace-y={traceY}
      data-challenge={challenge}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="sf413-hero">
        <small>3D MATHEMATICS</small>
        <h1>
          Surfaces <i>z = f(x, y)</i>
        </h1>
        <p>Explore and understand two-variable surfaces.</p>
        <div>
          <span>Advanced</span>
          <span>3D Analysis Lab</span>
          <span>Graphing / CAS</span>
          <span>6–10 min</span>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setShared(true);
                void navigator.clipboard?.writeText(equation);
              })
            }
          >
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
        </div>
      </header>
      <nav className="sf413-tabs">
        {["Surface", "Contour map", "x-trace", "y-trace"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="sf413-main">
        <aside>
          <h2>Equation editor</h2>
          <output>{equation}</output>
          <h3>Presets</h3>
          <div>
            {(["plane", "paraboloid", "saddle", "ripple"] as Preset[]).map(
              (item) => (
                <button
                  key={item}
                  className={preset === item ? "active" : ""}
                  onClick={() => choose(item)}
                >
                  <PresetIcon preset={item} />
                  <b>{capitalize(item)}</b>
                  <small>
                    {equationText(
                      item,
                      item === "ripple" ? 1 : 1,
                      item === "saddle" ? -1 : 1,
                      0,
                    )}
                  </small>
                </button>
              ),
            )}
          </div>
        </aside>
        <article>
          <header>
            <h2>
              Surface <CircleHelp />
            </h2>
            <select
              aria-label="Surface color"
              value={heightMode}
              onChange={(e) => act(() => setHeightMode(e.target.value))}
            >
              <option>Height z</option>
              <option>Gradient magnitude</option>
            </select>
            <button
              onClick={() =>
                act(() => setHover({ x: 0, y: 0, z: value(0, 0) }))
              }
            >
              Plot surface
            </button>
          </header>
          <div className="sf413-stage">
            <SurfaceCanvas
              preset={preset}
              a={a}
              b={b}
              c={c}
              domain={domain}
              mode={heightMode}
              onHover={(point) => setHover(point)}
              onInteraction={onInteraction}
            />
            <output>
              (x, y, z) = ({fmt(hover.x)}, {fmt(hover.y)}, {fmt(hover.z)})
            </output>
          </div>
          <nav>
            <button>↖</button>
            <button>✥</button>
            <button>⌕</button>
            <button>⊕</button>
            <button>⛶</button>
            <button>◇</button>
            <button
              onClick={() =>
                act(() => setHover({ x: 0, y: 0, z: value(0, 0) }))
              }
            >
              ↻
            </button>
          </nav>
        </article>
      </section>
      <section className="sf413-domain">
        <article>
          <h2>Domain & range</h2>
          <div>
            <label>
              x (min, max)
              <input
                aria-label="x minimum"
                type="number"
                value={domain.xMin}
                onChange={(e) => updateDomain("xMin", Number(e.target.value))}
              />
              <input
                aria-label="x maximum"
                type="number"
                value={domain.xMax}
                onChange={(e) => updateDomain("xMax", Number(e.target.value))}
              />
            </label>
            <label>
              y (min, max)
              <input
                aria-label="y minimum"
                type="number"
                value={domain.yMin}
                onChange={(e) => updateDomain("yMin", Number(e.target.value))}
              />
              <input
                aria-label="y maximum"
                type="number"
                value={domain.yMax}
                onChange={(e) => updateDomain("yMax", Number(e.target.value))}
              />
            </label>
            <label>
              z range (auto)<output>{round(range.min)}</output>
              <output>{round(range.max)}</output>
              <button>♙</button>
            </label>
          </div>
        </article>
        <article>
          <h2>Parameters</h2>
          <Parameter
            label="a (x² coef.)"
            value={a}
            onChange={(next) =>
              act(() => {
                setA(next);
                setChallenge(
                  preset === "saddle" && next > 0 && b < 0
                    ? "correct"
                    : "incorrect",
                );
              })
            }
          />
          <Parameter
            label="b (y² coef.)"
            value={b}
            onChange={(next) =>
              act(() => {
                setB(next);
                setChallenge(
                  preset === "saddle" && a > 0 && next < 0
                    ? "correct"
                    : "incorrect",
                );
              })
            }
          />
          <Parameter
            label="c (constant)"
            value={c}
            onChange={(next) =>
              act(() => {
                setC(next);
                setChallenge("idle");
              })
            }
          />
        </article>
      </section>
      <section className="sf413-plots">
        <article>
          <header>
            <h2>
              Contour map <CircleHelp />
            </h2>
            <select>
              <option>Levels 15</option>
              <option>Levels 10</option>
            </select>
          </header>
          <ContourPlot
            preset={preset}
            a={a}
            b={b}
            c={c}
            domain={domain}
            point={hover}
            onPoint={(point) =>
              act(() => setHover({ ...point, z: value(point.x, point.y) }))
            }
          />
          <p>Contours show lines of constant z.</p>
        </article>
        <article>
          <header>
            <h2>x-trace (y = {traceY})</h2>
            <select aria-label="x trace">
              <option>Auto</option>
            </select>
          </header>
          <TracePlot
            axis="x"
            fixed={traceY}
            domain={domain}
            evaluate={value}
            point={hover}
          />
          <input
            aria-label="y trace value"
            type="range"
            min={domain.yMin}
            max={domain.yMax}
            step="0.1"
            value={traceY}
            onChange={(e) => act(() => setTraceY(Number(e.target.value)))}
          />
          <p>Slice along y = {traceY} (xz-plane).</p>
        </article>
        <article>
          <header>
            <h2>y-trace (x = {traceX})</h2>
            <select aria-label="y trace">
              <option>Auto</option>
            </select>
          </header>
          <TracePlot
            axis="y"
            fixed={traceX}
            domain={domain}
            evaluate={value}
            point={hover}
          />
          <input
            aria-label="x trace value"
            type="range"
            min={domain.xMin}
            max={domain.xMax}
            step="0.1"
            value={traceX}
            onChange={(e) => act(() => setTraceX(Number(e.target.value)))}
          />
          <p>Slice along x = {traceX} (yz-plane).</p>
        </article>
      </section>
      <section className="sf413-analysis">
        <article>
          <h2>Hover point</h2>
          <b>
            (x, y, z) = ({fmt(hover.x)}, {fmt(hover.y)}, {fmt(hover.z)})
          </b>
          <p>{equation}</p>
        </article>
        <article>
          <h2>Gradient ∇z</h2>
          <b>
            (∂z/∂x, ∂z/∂y) = ({fmt(gradient.x)}, {fmt(gradient.y)})
          </b>
          <p>
            At point: ({fmt(hover.x)}, {fmt(hover.y)}) → ({fmt(gradient.x)},{" "}
            {fmt(gradient.y)})
          </p>
          <GradientIcon gradient={gradient} />
        </article>
        <article>
          <h2>Tangent plane</h2>
          <b>
            z = {fmt(hover.z)} + {fmt(gradient.x)}(x − {fmt(hover.x)}) +{" "}
            {fmt(gradient.y)}(y − {fmt(hover.y)})
          </b>
          <p>
            z = {fmt(hover.z - gradient.x * hover.x - gradient.y * hover.y)} +{" "}
            {fmt(gradient.x)}x + {fmt(gradient.y)}y
          </p>
          <PlaneIcon />
        </article>
      </section>
      <section className="sf413-challenge">
        <Target />
        <div>
          <h2>Challenge: Make a saddle</h2>
          <p>Adjust parameters to create a saddle surface.</p>
        </div>
        <ul>
          <li>Make a saddle surface.</li>
          <li>Ensure it opens upward in x-direction.</li>
          <li>Ensure it opens downward in y-direction.</li>
        </ul>
        <aside>
          <span>
            Your equation: <b>{equation}</b>
          </span>
          {challenge !== "idle" && (
            <strong className={challenge}>
              <Check />
              {challenge === "correct"
                ? "Great! This is a saddle surface."
                : "Not a saddle yet."}
            </strong>
          )}
        </aside>
        <button onClick={reset}>
          <RotateCcw />
          Reset
        </button>
        <button
          onClick={() =>
            act(() => {
              setPreset("saddle");
              setA(-1);
              setB(1);
              setC(0);
              setChallenge("idle");
            })
          }
        >
          New challenge
        </button>
      </section>
      <footer className="sf413-tip">
        ⓘ Interactive tip: Drag on the 3D surface to rotate, scroll to zoom,
        Shift + drag to pan. Hover anywhere to see (x, y, z).
      </footer>
    </section>
  );
}

function SurfaceCanvas({
  preset,
  a,
  b,
  c,
  domain,
  mode,
  onHover,
  onInteraction,
}: {
  preset: Preset;
  a: number;
  b: number;
  c: number;
  domain: Domain;
  mode: string;
  onHover: (point: Point) => void;
  onInteraction: () => void;
}) {
  const geometry = useMemo(
    () => surfaceGeometry(preset, a, b, c, domain, mode),
    [preset, a, b, c, domain, mode],
  );
  return (
    <Canvas camera={{ position: [7, 5.5, 8], fov: 40 }}>
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 8, 6]} intensity={1.7} />
      <mesh
        geometry={geometry}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHover({
            x: event.point.x,
            y: event.point.z,
            z: evaluate(preset, a, b, c, event.point.x, event.point.z),
          });
        }}
      >
        <meshStandardMaterial vertexColors side={DoubleSide} roughness={0.55} />
      </mesh>
      <gridHelper args={[8, 8, "#a7bdd4", "#d9e4ee"]} />
      <axesHelper args={[4.5]} />
      <OrbitControls onStart={onInteraction} />
    </Canvas>
  );
}
function surfaceGeometry(
  preset: Preset,
  a: number,
  b: number,
  c: number,
  domain: Domain,
  mode: string,
) {
  const n = 44,
    positions: number[] = [],
    colors: number[] = [],
    indices: number[] = [],
    samples: number[] = [];
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++) {
      const x = domain.xMin + ((domain.xMax - domain.xMin) * i) / n,
        y = domain.yMin + ((domain.yMax - domain.yMin) * j) / n,
        z = evaluate(preset, a, b, c, x, y);
      samples.push(z);
      positions.push(x, z * 0.32, y);
    }
  const min = Math.min(...samples),
    max = Math.max(...samples),
    span = max - min || 1;
  for (let index = 0; index < samples.length; index++) {
    const x = positions[index * 3],
      y = positions[index * 3 + 2],
      g = derive(preset, a, b, x, y),
      t =
        mode === "Gradient magnitude"
          ? Math.min(1, Math.hypot(g.x, g.y) / 8)
          : (samples[index] - min) / span,
      color = new Color().setHSL(0.72 - t * 0.7, 0.78, 0.52);
    colors.push(color.r, color.g, color.b);
  }
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const p = j * (n + 1) + i;
      indices.push(p, p + 1, p + n + 1, p + 1, p + n + 2, p + n + 1);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function Parameter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}
      <input
        aria-label={label}
        type="range"
        min="-3"
        max="3"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <input
        aria-label={`${label} value`}
        type="number"
        min="-3"
        max="3"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function ContourPlot({
  preset,
  a,
  b,
  c,
  domain,
  point,
  onPoint,
}: {
  preset: Preset;
  a: number;
  b: number;
  c: number;
  domain: Domain;
  point: Point;
  onPoint: (point: { x: number; y: number }) => void;
}) {
  const range = sampleRange(preset, a, b, c, domain),
    levels = Array.from(
      { length: 15 },
      (_, i) => range.min + ((range.max - range.min) * (i + 1)) / 16,
    ),
    paths = levels.map((level) => march(preset, a, b, c, domain, level));
  const sx = (x: number) =>
      18 + ((x - domain.xMin) / (domain.xMax - domain.xMin)) * 170,
    sy = (y: number) =>
      184 - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * 170;
  return (
    <svg
      className="sf413-contour"
      viewBox="0 0 210 205"
      onPointerDown={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        onPoint({
          x:
            domain.xMin +
            ((event.clientX - box.left) / box.width) *
              (domain.xMax - domain.xMin),
          y:
            domain.yMax -
            ((event.clientY - box.top) / box.height) *
              (domain.yMax - domain.yMin),
        });
      }}
    >
      <rect
        x="18"
        y="14"
        width="170"
        height="170"
        fill="#fbfdff"
        stroke="#dce5ef"
      />
      {paths.map((path, index) => (
        <path
          key={levels[index]}
          d={path}
          fill="none"
          stroke={`hsl(${240 - index * 14} 80% 52%)`}
          strokeWidth=".8"
        />
      ))}
      <line x1="18" x2="188" y1={sy(0)} y2={sy(0)} stroke="#25324a" />
      <line x1={sx(0)} x2={sx(0)} y1="14" y2="184" stroke="#25324a" />
      <circle cx={sx(point.x)} cy={sy(point.y)} r="4" fill="#111" />
      <text x={sx(point.x) + 6} y={sy(point.y) + 14}>
        ({fmt(point.x)}, {fmt(point.y)})
      </text>
    </svg>
  );
}
function march(
  preset: Preset,
  a: number,
  b: number,
  c: number,
  domain: Domain,
  level: number,
) {
  const n = 38,
    pieces: string[] = [];
  const sx = (x: number) =>
      18 + ((x - domain.xMin) / (domain.xMax - domain.xMin)) * 170,
    sy = (y: number) =>
      184 - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * 170;
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x0 = domain.xMin + ((domain.xMax - domain.xMin) * i) / n,
        x1 = domain.xMin + ((domain.xMax - domain.xMin) * (i + 1)) / n,
        y0 = domain.yMin + ((domain.yMax - domain.yMin) * j) / n,
        y1 = domain.yMin + ((domain.yMax - domain.yMin) * (j + 1)) / n,
        points = [
          [x0, y0],
          [x1, y0],
          [x1, y1],
          [x0, y1],
        ] as [number, number][],
        values = points.map(
          ([x, y]) => evaluate(preset, a, b, c, x, y) - level,
        ),
        hits: [number, number][] = [];
      [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ].forEach(([u, v]) => {
        if (values[u] <= 0 !== values[v] <= 0) {
          const t = values[u] / (values[u] - values[v]);
          hits.push([
            points[u][0] + t * (points[v][0] - points[u][0]),
            points[u][1] + t * (points[v][1] - points[u][1]),
          ]);
        }
      });
      if (hits.length >= 2)
        pieces.push(
          `M${sx(hits[0][0])},${sy(hits[0][1])}L${sx(hits[1][0])},${sy(hits[1][1])}`,
        );
    }
  return pieces.join("");
}
function TracePlot({
  axis,
  fixed,
  domain,
  evaluate: fn,
  point,
}: {
  axis: "x" | "y";
  fixed: number;
  domain: Domain;
  evaluate: (x: number, y: number) => number;
  point: Point;
}) {
  const min = axis === "x" ? domain.xMin : domain.yMin,
    max = axis === "x" ? domain.xMax : domain.yMax,
    samples = Array.from({ length: 100 }, (_, i) => {
      const t = min + ((max - min) * i) / 99;
      return { t, z: axis === "x" ? fn(t, fixed) : fn(fixed, t) };
    }),
    zMin = Math.min(...samples.map((item) => item.z), -1),
    zMax = Math.max(...samples.map((item) => item.z), 1),
    sx = (t: number) => 20 + ((t - min) / (max - min)) * 190,
    sy = (z: number) => 175 - ((z - zMin) / (zMax - zMin)) * 145,
    path = samples
      .map((item, index) => `${index ? "L" : "M"}${sx(item.t)},${sy(item.z)}`)
      .join(" "),
    t = axis === "x" ? point.x : point.y,
    z = axis === "x" ? fn(t, fixed) : fn(fixed, t);
  return (
    <svg className="sf413-trace" viewBox="0 0 230 195">
      <line x1="20" x2="215" y1={sy(0)} y2={sy(0)} stroke="#26334a" />
      <line x1={sx(0)} x2={sx(0)} y1="20" y2="175" stroke="#26334a" />
      <path
        d={path}
        fill="none"
        stroke={axis === "x" ? "#377eea" : "#ef5551"}
        strokeWidth="2"
      />
      <circle cx={sx(t)} cy={sy(z)} r="4" fill="#111" />
      <text x={sx(t) + 5} y={sy(z) - 7}>
        ({fmt(t)}, {fmt(z)})
      </text>
    </svg>
  );
}
function PresetIcon({ preset }: { preset: Preset }) {
  return (
    <svg viewBox="0 0 100 58">
      <path
        d={
          preset === "plane"
            ? "M10 43L78 12L92 29L24 53Z"
            : preset === "paraboloid"
              ? "M12 13Q50 60 88 13M18 20Q50 52 82 20M25 27Q50 45 75 27"
              : preset === "saddle"
                ? "M8 40Q50 5 92 40M8 18Q50 55 92 18"
                : "M8 30Q20 8 32 30T56 30T80 30T96 30"
        }
        fill="none"
        stroke="#e4ad2d"
        strokeWidth="2"
      />
    </svg>
  );
}
function GradientIcon({ gradient }: { gradient: { x: number; y: number } }) {
  return (
    <svg viewBox="0 0 80 55">
      <path d="M10 43L45 28L72 38L37 52Z" fill="#eef5f8" stroke="#8aa0b4" />
      <line
        x1="40"
        y1="40"
        x2={40 + gradient.x * 5}
        y2={40 - gradient.y * 5 - 22}
        stroke="#239d55"
        strokeWidth="2"
      />
    </svg>
  );
}
function PlaneIcon() {
  return (
    <svg viewBox="0 0 80 55">
      <path d="M8 34L48 10L75 29L35 53Z" fill="#d9f5f8" stroke="#31a7c3" />
    </svg>
  );
}
function evaluate(
  preset: Preset,
  a: number,
  b: number,
  c: number,
  x: number,
  y: number,
) {
  if (preset === "plane") return a * x + b * y + c;
  if (preset === "paraboloid") return a * x * x + Math.abs(b) * y * y + c;
  if (preset === "ripple")
    return (
      (a * Math.sin(Math.sqrt(x * x + y * y) * 2)) /
        (1 + 0.2 * (x * x + y * y)) +
      c
    );
  return a * x * x + b * y * y + c;
}
function derive(preset: Preset, a: number, b: number, x: number, y: number) {
  if (preset === "plane") return { x: a, y: b };
  if (preset === "paraboloid") return { x: 2 * a * x, y: 2 * Math.abs(b) * y };
  if (preset === "ripple") {
    const h = 0.001;
    return {
      x:
        (evaluate(preset, a, b, 0, x + h, y) -
          evaluate(preset, a, b, 0, x - h, y)) /
        (2 * h),
      y:
        (evaluate(preset, a, b, 0, x, y + h) -
          evaluate(preset, a, b, 0, x, y - h)) /
        (2 * h),
    };
  }
  return { x: 2 * a * x, y: 2 * b * y };
}
function sampleRange(
  preset: Preset,
  a: number,
  b: number,
  c: number,
  domain: Domain,
) {
  const values: number[] = [];
  for (let j = 0; j <= 24; j++)
    for (let i = 0; i <= 24; i++)
      values.push(
        evaluate(
          preset,
          a,
          b,
          c,
          domain.xMin + ((domain.xMax - domain.xMin) * i) / 24,
          domain.yMin + ((domain.yMax - domain.yMin) * j) / 24,
        ),
      );
  return { min: Math.min(...values), max: Math.max(...values) };
}
function equationText(preset: Preset, a: number, b: number, c: number) {
  if (preset === "plane")
    return `z = ${firstTerm(a, "x")} ${nextTerm(b, "y")} ${nextTerm(c, "")}`.trim();
  if (preset === "ripple") return `z = ${a} sin(2√(x²+y²))/(1+0.2r²) + ${c}`;
  return `z = ${firstTerm(a, "x²")} ${nextTerm(preset === "paraboloid" ? Math.abs(b) : b, "y²")} ${nextTerm(c, "")}`.trim();
}
function firstTerm(value: number, symbol: string) {
  if (value === 1 && symbol) return symbol;
  if (value === -1 && symbol) return `−${symbol}`;
  return `${value}${symbol}`;
}
function nextTerm(value: number, symbol: string) {
  if (value === 0) return "";
  const magnitude = Math.abs(value),
    coefficient = magnitude === 1 && symbol ? "" : magnitude;
  return `${value < 0 ? "−" : "+"} ${coefficient}${symbol}`;
}
function fmt(value: number) {
  return value.toFixed(2);
}
function round(value: number) {
  return Number(value.toFixed(2));
}
function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}
