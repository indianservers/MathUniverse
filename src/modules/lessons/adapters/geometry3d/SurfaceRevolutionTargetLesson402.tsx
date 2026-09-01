import {
  Line,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box, Grid3X3, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, LatheGeometry, Vector2 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./SurfaceRevolutionTargetLesson402.css";

type CurveKind = "sqrt" | "line" | "semicircle";
type Axis = "x" | "y";
type Method = "Washer" | "Shell";

const curves: Record<
  CurveKind,
  { formula: string; short: string; expected: "horn" | "cylinder" | "sphere" }
> = {
  sqrt: { formula: "y = √x", short: "√x", expected: "horn" },
  line: { formula: "y = 2", short: "2", expected: "cylinder" },
  semicircle: {
    formula: "y = √(4 − (x − 2)²)",
    short: "√(4−(x−2)²)",
    expected: "sphere",
  },
};

export default function SurfaceRevolutionTargetLesson402({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [curve, setCurve] = useState<CurveKind>("sqrt");
  const [a, setA] = useState(0);
  const [b, setB] = useState(4);
  const [axis, setAxis] = useState<Axis>("x");
  const [angle, setAngle] = useState(360);
  const [method, setMethod] = useState<Method>("Washer");
  const [complete, setComplete] = useState(true);
  const [section, setSection] = useState(2.5);
  const [playing, setPlaying] = useState(false);
  const [projection, setProjection] = useState<"Perspective" | "Orthographic">(
    "Perspective",
  );
  const [cameraReset, setCameraReset] = useState(0);
  const [tab, setTab] = useState("Explore");
  const [shared, setShared] = useState(false);
  const [prediction, setPrediction] = useState<"horn" | "cylinder" | "sphere">(
    "horn",
  );
  const [revealed, setRevealed] = useState(false);
  const [actions, setActions] = useState(0);

  const fn = useMemo(() => curveFunction(curve), [curve]);
  const volumeCoefficient = useMemo(
    () => volumeFor(fn, a, b, axis, method),
    [fn, a, b, axis, method],
  );
  const surfaceCoefficient = useMemo(
    () => surfaceFor(fn, a, b, axis),
    [fn, a, b, axis],
  );
  const expected = curves[curve].expected;
  const correct = revealed && prediction === expected;

  const act = (callback: () => void) => {
    callback();
    setRevealed(false);
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setCurve("sqrt");
    setA(0);
    setB(4);
    setAxis("x");
    setAngle(360);
    setMethod("Washer");
    setComplete(true);
    setSection(2.5);
    setPlaying(false);
    setProjection("Perspective");
    setCameraReset((value) => value + 1);
    setTab("Explore");
    setShared(false);
    setPrediction("horn");
    setRevealed(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSection((value) => (value >= b ? a : Math.min(b, value + 0.08)));
    }, 70);
    return () => window.clearInterval(timer);
  }, [playing, a, b]);

  const changeCurve = () =>
    act(() => {
      const next: CurveKind =
        curve === "sqrt" ? "line" : curve === "line" ? "semicircle" : "sqrt";
      setCurve(next);
      setPrediction(curves[next].expected);
    });
  const changeA = (value: number) =>
    act(() => {
      const next = clamp(value, 0, b - 0.5);
      setA(next);
      setSection((current) => clamp(current, next, b));
    });
  const changeB = (value: number) =>
    act(() => {
      const next = clamp(value, a + 0.5, 8);
      setB(next);
      setSection((current) => clamp(current, a, next));
    });

  return (
    <section
      className="cs378-page sor402-page"
      data-testid="geometry3d-mockup-0587"
      data-object-model="threejs-dedicated-generating-curve-draggable-domain-endpoint-x-y-axis-partial-complete-lathe-washer-shell-animated-cross-section-exact-numerical-volume-surface-area-prediction-challenge"
      data-curve={curve}
      data-a={round(a)}
      data-b={round(b)}
      data-axis={axis}
      data-angle={round(angle)}
      data-method={method}
      data-complete={complete}
      data-section={round(section)}
      data-playing={playing}
      data-projection={projection}
      data-volume-coefficient={round(volumeCoefficient)}
      data-surface-coefficient={round(surfaceCoefficient)}
      data-prediction={prediction}
      data-expected={expected}
      data-revealed={revealed}
      data-correct={correct}
      data-tab={tab}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="sor402-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>CALCULUS &amp; APPLICATIONS</small>
          <h1>Surface of Revolution</h1>
          <p>Create solids by rotating a plane curve about an axis.</p>
        </div>
        <nav>
          <button onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setShared(true);
                void navigator.clipboard?.writeText(
                  `${curves[curve].formula}, ${axis}-axis, V=${fmt(volumeCoefficient)}π`,
                );
              })
            }
          >
            <Share2 size={14} /> {shared ? "Shared" : "Share"}
          </button>
          <button
            onClick={() =>
              document
                .querySelector(".sor402-visuals")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Box size={14} /> Workspace
          </button>
        </nav>
      </header>

      <section className="sor402-workspace">
        <nav className="sor402-tabs">
          {["Explore", "Explain", "Examples", "Σ Formulas", "Challenge"].map(
            (item) => (
              <button
                key={item}
                className={tab === item ? "active" : ""}
                onClick={() => act(() => setTab(item))}
              >
                {item}
              </button>
            ),
          )}
        </nav>
        <div className="sor402-controls">
          <label className="sor402-curve-control">
            <b>Generating curve</b>
            <button aria-label="Change generating curve" onClick={changeCurve}>
              {curves[curve].formula} <span>✎</span>
            </button>
            <span>
              <i>a =</i>
              <input
                aria-label="Interval start a"
                type="number"
                step="0.5"
                value={a}
                onChange={(e) => changeA(Number(e.target.value))}
              />
              <i>b =</i>
              <input
                aria-label="Interval end b"
                type="number"
                step="0.5"
                value={b}
                onChange={(e) => changeB(Number(e.target.value))}
              />
            </span>
          </label>
          <fieldset>
            <legend>Axis of rotation</legend>
            <button
              className={axis === "x" ? "active" : ""}
              onClick={() => act(() => setAxis("x"))}
            >
              ↔ x-axis
            </button>
            <button
              className={axis === "y" ? "active" : ""}
              onClick={() => act(() => setAxis("y"))}
            >
              ↕ y-axis
            </button>
          </fieldset>
          <label className="sor402-angle">
            <b>Rotation angle</b>
            <strong>θ = {fmt(angle)}°</strong>
            <input
              aria-label="Rotation angle"
              type="range"
              min="30"
              max="360"
              value={angle}
              onChange={(e) =>
                act(() => {
                  const next = Number(e.target.value);
                  setAngle(next);
                  setComplete(next === 360);
                })
              }
            />
            <small>
              <i>0°</i>
              <i>360°</i>
            </small>
          </label>
          <fieldset>
            <legend>Washer view</legend>
            <button
              className={method === "Washer" ? "active" : ""}
              onClick={() => act(() => setMethod("Washer"))}
            >
              Washer
            </button>
            <button
              className={method === "Shell" ? "active" : ""}
              onClick={() => act(() => setMethod("Shell"))}
            >
              Shell
            </button>
          </fieldset>
          <label className="sor402-complete">
            <b>Complete revolution</b>
            <input
              aria-label="Complete revolution"
              type="checkbox"
              checked={complete}
              onChange={() =>
                act(() => {
                  const next = !complete;
                  setComplete(next);
                  setAngle(next ? 360 : 240);
                })
              }
            />
            <strong>{fmt(angle)}°</strong>
          </label>
        </div>

        <div className="sor402-visuals">
          <article>
            <h2>1. Generating curve in the xy-plane</h2>
            <CurvePlot curve={curve} a={a} b={b} fn={fn} onB={changeB} />
            <footer>
              <span>
                ━ &nbsp; {curves[curve].formula}
                <small>Generating curve</small>
              </span>
              <span>
                ━ &nbsp; {fmt(a)} ≤ x ≤ {fmt(b)}
                <small>Interval [a, b]</small>
              </span>
              <b>
                a = {fmt(a)}, b = {fmt(b)}
              </b>
            </footer>
          </article>
          <article>
            <h2>2. Surface of revolution (about {axis}-axis)</h2>
            <div className="sor402-scene">
              <Canvas
                key={cameraReset}
                data-testid="geometry3d-surface-revolution-canvas"
                camera={{ position: [0, 3.5, 9], fov: 42 }}
                gl={{ antialias: true, preserveDrawingBuffer: true }}
              >
                <color attach="background" args={["#071a38"]} />
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 7, 8]} intensity={2.2} />
                {projection === "Perspective" ? (
                  <PerspectiveCamera
                    makeDefault
                    position={[0, 3.5, 9]}
                    fov={42}
                  />
                ) : (
                  <OrthographicCamera
                    makeDefault
                    position={[0, 3.5, 9]}
                    zoom={58}
                  />
                )}
                <RevolutionModel
                  fn={fn}
                  a={a}
                  b={b}
                  axis={axis}
                  angle={angle}
                  section={section}
                  method={method}
                />
                <OrbitControls
                  makeDefault
                  enableDamping={false}
                  target={[0, 0, 0]}
                />
              </Canvas>
              <aside>
                <span>— &nbsp; Tracing path</span>
                <span>━ &nbsp; Current cross-section</span>
              </aside>
              <nav>
                <button
                  aria-label="Restart animation"
                  onClick={() =>
                    act(() => {
                      setSection(a);
                      setPlaying(true);
                    })
                  }
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  aria-label={playing ? "Pause animation" : "Play animation"}
                  onClick={() => act(() => setPlaying((value) => !value))}
                >
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  aria-label="Toggle 3D projection"
                  onClick={() =>
                    act(() =>
                      setProjection((value) =>
                        value === "Perspective"
                          ? "Orthographic"
                          : "Perspective",
                      ),
                    )
                  }
                >
                  3D
                </button>
              </nav>
            </div>
          </article>
        </div>
        <p className="sor402-rotation-note">
          We rotate the curve about the <b>{axis}-axis</b>.
        </p>
      </section>

      <section className="sor402-formulas">
        <article>
          <h2>Volume ({method} Method)</h2>
          <p>
            Cross-sections perpendicular to the axis are {method.toLowerCase()}
            s.
          </p>
          <div>
            V = π ∫<sub>a</sub>
            <sup>b</sup> [R(x)]² − [r(x)]² dx
          </div>
          <p>
            About the {axis}-axis: R(x) = {curves[curve].short}, r(x) = 0
          </p>
          <FormulaDerivation
            kind="volume"
            curve={curve}
            a={a}
            b={b}
            axis={axis}
            value={volumeCoefficient}
          />
          <strong>
            V = {fmt(volumeCoefficient)}π <span>cubic units</span>
          </strong>
        </article>
        <article>
          <h2>Surface Area</h2>
          <p>Surface area of the surface of revolution.</p>
          <div>
            S = 2π ∫<sub>a</sub>
            <sup>b</sup> y √(1 + (dy/dx)²) dx
          </div>
          <p>
            For {curves[curve].formula}, integrate circumference × arc length.
          </p>
          <FormulaDerivation
            kind="surface"
            curve={curve}
            a={a}
            b={b}
            axis={axis}
            value={surfaceCoefficient}
          />
          <strong>
            S = {fmt(surfaceCoefficient)}π <span>square units</span>
          </strong>
        </article>
      </section>

      <section className="sor402-bottom">
        <article className="sor402-steps">
          <h2>Step-by-step</h2>
          {[
            `Select a generating curve ${curves[curve].formula} on [a, b].`,
            `Choose an axis of rotation (here, the ${axis}-axis).`,
            "Divide the interval into thin slices at position x.",
            `Each slice generates a ${method.toLowerCase()} with radius R(x).`,
            "Integrate the area of slices to get volume.",
            "Integrate circumference times arc length for surface area.",
          ].map((step, index) => (
            <p key={step}>
              <b>{index + 1}</b>
              {step}
            </p>
          ))}
        </article>
        <article className="sor402-challenge">
          <h2>Challenge: Predict the solid</h2>
          <p>Before revealing the 3D solid, predict what shape you expect.</p>
          <div>
            <PredictionCard
              value="horn"
              selected={prediction === "horn"}
              onClick={() => {
                setPrediction("horn");
                setRevealed(false);
              }}
              label="A horn-shaped solid"
            />
            <PredictionCard
              value="cylinder"
              selected={prediction === "cylinder"}
              onClick={() => {
                setPrediction("cylinder");
                setRevealed(false);
              }}
              label="A cylinder"
            />
            <PredictionCard
              value="sphere"
              selected={prediction === "sphere"}
              onClick={() => {
                setPrediction("sphere");
                setRevealed(false);
              }}
              label="A sphere"
            />
          </div>
          <button
            onClick={() => {
              setRevealed(true);
              setActions((value) => value + 1);
              onInteraction();
            }}
          >
            Reveal answer
          </button>
          <p className={revealed ? (correct ? "correct" : "incorrect") : ""}>
            ⓘ{" "}
            {revealed
              ? correct
                ? `Correct! Rotating ${curves[curve].formula} forms this solid.`
                : `Try again. Follow the radius ${curves[curve].formula}.`
              : "Choose a prediction, then reveal the result."}
          </p>
        </article>
      </section>

      <nav className="sor402-nav">
        <a href="/lessons/3d-mathematics/401-frustum">
          ←{" "}
          <span>
            Previous Lesson
            <br />
            <b>Frustum</b>
          </span>
        </a>
        <a href="/lessons/3d-mathematics">
          <Grid3X3 size={14} /> Back to 3D Mathematics
        </a>
        <a href="/lessons/3d-mathematics/403-extrusion">
          <span>
            Next Lesson
            <br />
            <b>Extrusion</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function CurvePlot({
  curve,
  a,
  b,
  fn,
  onB,
}: {
  curve: CurveKind;
  a: number;
  b: number;
  fn: (x: number) => number;
  onB: (value: number) => void;
}) {
  const width = 300,
    height = 400,
    left = 42,
    bottom = 300,
    xScale = 42,
    yScale = 52;
  const points = Array.from({ length: 81 }, (_, index) => {
    const x = a + ((b - a) * index) / 80;
    return `${left + x * xScale},${bottom - fn(x) * yScale}`;
  }).join(" ");
  const endpointX = left + b * xScale,
    endpointY = bottom - fn(b) * yScale;
  const drag = (event: React.PointerEvent<SVGCircleElement>) => {
    if (!(event.buttons & 1)) return;
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * width;
    onB(clamp((x - left) / xScale, a + 0.5, 6));
  };
  return (
    <svg
      className="sor402-plot"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="Generating curve graph"
    >
      <defs>
        <pattern
          id="sor-grid"
          width="42"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <path d="M 42 0 L 0 0 0 52" fill="none" stroke="#17345a" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="#071a38" />
      <rect x={left} y="30" width="252" height="322" fill="url(#sor-grid)" />
      <line x1="0" y1={bottom} x2="292" y2={bottom} stroke="#e8f4ff" />
      <line x1={left} y1="22" x2={left} y2="360" stroke="#e8f4ff" />
      {[0, 1, 2, 3, 4, 5].map((value) => (
        <text
          key={`x${value}`}
          x={left + value * xScale}
          y={bottom + 19}
          fill="#d9e7fa"
        >
          {value}
        </text>
      ))}
      {[-1, 1, 2, 3].map((value) => (
        <text
          key={`y${value}`}
          x={left - 20}
          y={bottom - value * yScale + 4}
          fill="#d9e7fa"
        >
          {value}
        </text>
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="#16e6f5"
        strokeWidth="2.5"
      />
      <line
        x1={endpointX}
        y1={endpointY}
        x2={endpointX}
        y2={bottom}
        stroke="#f0a300"
        strokeDasharray="6 5"
      />
      <line
        x1={left}
        y1={bottom}
        x2={endpointX}
        y2={bottom}
        stroke="#f0a300"
        strokeWidth="2"
      />
      <circle
        aria-label="Drag interval endpoint"
        cx={endpointX}
        cy={endpointY}
        r="7"
        fill="#12d8e8"
        onPointerDown={(event) =>
          event.currentTarget.setPointerCapture(event.pointerId)
        }
        onPointerMove={drag}
      />
      <text
        x={Math.max(120, endpointX - 35)}
        y={Math.max(45, endpointY - 18)}
        fill="#16e6f5"
        fontSize="16"
        fontWeight="700"
      >
        {curves[curve].formula}
      </text>
      <text x="278" y={bottom - 10} fill="#fff">
        x
      </text>
      <text x={left + 9} y="30" fill="#fff">
        y
      </text>
    </svg>
  );
}

function RevolutionModel({
  fn,
  a,
  b,
  axis,
  angle,
  section,
  method,
}: {
  fn: (x: number) => number;
  a: number;
  b: number;
  axis: Axis;
  angle: number;
  section: number;
  method: Method;
}) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 65 }, (_, index) => {
      const x = a + ((b - a) * index) / 64;
      return axis === "x"
        ? new Vector2(Math.max(0.01, fn(x)), x - (a + b) / 2)
        : new Vector2(Math.max(0.01, x), fn(x) - 1);
    });
    return new LatheGeometry(points, 72, 0, (angle * Math.PI) / 180);
  }, [fn, a, b, axis, angle]);
  const radius = axis === "x" ? fn(section) : section;
  const axial = axis === "x" ? section - (a + b) / 2 : fn(section) - 1;
  const circle = Array.from({ length: 65 }, (_, index) => {
    const theta = (index / 64) * Math.PI * 2;
    return [Math.cos(theta) * radius, axial, Math.sin(theta) * radius];
  }) as [number, number, number][];
  return (
    <group
      rotation={axis === "x" ? [0, 0, -Math.PI / 2] : [0, 0, 0]}
      position={axis === "x" ? [-0.19, 0.315, 0] : [0, 0, 0]}
      scale={axis === "x" ? [0.886, 1.1, 0.886] : 0.95}
    >
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#31a9ec"
          transparent
          opacity={0.44}
          roughness={0.25}
          side={DoubleSide}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#50c9ff"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
      <Line
        points={circle}
        color="#11e7ef"
        lineWidth={method === "Washer" ? 3 : 1.5}
        dashed={method === "Shell"}
      />
      <Line
        points={[
          [0, -(b - a) * 0.7, 0],
          [0, (b - a) * 0.7, 0],
        ]}
        color="#f0a300"
        lineWidth={2}
      />
    </group>
  );
}

function FormulaDerivation({
  kind,
  curve,
  a,
  b,
  axis,
  value,
}: {
  kind: "volume" | "surface";
  curve: CurveKind;
  a: number;
  b: number;
  axis: Axis;
  value: number;
}) {
  return (
    <div className="sor402-derivation">
      {kind === "volume" && curve === "sqrt" && axis === "x" ? (
        <>
          V = π ∫<sub>{fmt(a)}</sub>
          <sup>{fmt(b)}</sup> x dx = {fmt(value)}π
        </>
      ) : kind === "surface" && curve === "sqrt" && axis === "x" ? (
        <>
          S = π/6 [(4x + 1)<sup>3/2</sup>]<sub>{fmt(a)}</sub>
          <sup>{fmt(b)}</sup> = {fmt(value)}π
        </>
      ) : (
        <>
          {kind === "volume" ? "V" : "S"} = {fmt(value)}π by numerical
          integration on [{fmt(a)}, {fmt(b)}]
        </>
      )}
    </div>
  );
}

function PredictionCard({
  value,
  selected,
  onClick,
  label,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button className={selected ? "selected" : ""} onClick={onClick}>
      <i>{value === "horn" ? "◀▰▶" : value === "cylinder" ? "▰" : "●"}</i>
      <b>{label}</b>
    </button>
  );
}

function curveFunction(kind: CurveKind) {
  if (kind === "line") return (_x: number) => 2;
  if (kind === "semicircle")
    return (x: number) => Math.sqrt(Math.max(0, 4 - (x - 2) ** 2));
  return (x: number) => Math.sqrt(Math.max(0, x));
}

function integrate(
  fn: (x: number) => number,
  a: number,
  b: number,
  steps = 800,
) {
  const n = steps % 2 ? steps + 1 : steps,
    h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * fn(a + i * h);
  return (sum * h) / 3;
}

function derivative(
  fn: (x: number) => number,
  x: number,
  a: number,
  b: number,
) {
  const h = Math.max(0.0001, (b - a) / 10000),
    left = Math.max(a, x - h),
    right = Math.min(b, x + h);
  return (fn(right) - fn(left)) / Math.max(0.000001, right - left);
}

function volumeFor(
  fn: (x: number) => number,
  a: number,
  b: number,
  axis: Axis,
  method: Method,
) {
  if (axis === "x") return integrate((x) => fn(x) ** 2, a, b);
  if (method === "Shell") return 2 * integrate((x) => x * fn(x), a, b);
  const ymax = Math.max(
    ...Array.from({ length: 201 }, (_, i) => fn(a + ((b - a) * i) / 200)),
  );
  return integrate(
    (y) => {
      const samples = Array.from(
        { length: 401 },
        (_, i) => a + ((b - a) * i) / 400,
      ).filter((x) => fn(x) >= y);
      if (!samples.length) return 0;
      return Math.max(...samples) ** 2 - Math.min(...samples) ** 2;
    },
    0,
    ymax,
    400,
  );
}

function surfaceFor(
  fn: (x: number) => number,
  a: number,
  b: number,
  axis: Axis,
) {
  return (
    2 *
    integrate(
      (x) =>
        (axis === "x" ? fn(x) : x) *
        Math.sqrt(1 + derivative(fn, x, a, b) ** 2),
      a + 0.0001,
      b - 0.0001,
    )
  );
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const round = (value: number) => Number(value.toFixed(4));
const fmt = (value: number) => Number(value.toFixed(2)).toString();
