import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./MultivariableOptimisationTargetLesson427.css";

type Point = { x: number; y: number };
const initial: Point = { x: 1.2, y: -0.8 };
const fn = (x: number, y: number) => (x - y) ** 2;
const gradient = (x: number, y: number) => ({ x: 2 * (x - y), y: 2 * (y - x) });
const fix = (value: number, digits = 3) => Number(value.toFixed(digits));

export default function MultivariableOptimisationTargetLesson427({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPointState] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [constraint, setConstraint] = useState(false),
    [stationary, setStationary] = useState(""),
    [classification, setClassification] = useState(""),
    [graded, setGraded] = useState(false),
    [solution, setSolution] = useState(false),
    [complete, setComplete] = useState(false),
    [actions, setActions] = useState(0);
  const g = gradient(point.x, point.y),
    value = fn(point.x, point.y),
    magnitude = Math.hypot(g.x, g.y),
    onStationary = magnitude < 0.01,
    correct =
      graded && stationary === "x=2y" && classification === "minimum-trough";
  const act = (update: () => void) => {
      update();
      setActions((n) => n + 1);
      onInteraction();
    },
    setPoint = (p: Point) => act(() => setPointState(p)),
    reset = () => {
      setPointState(initial);
      setTab("Interact");
      setViewKey((n) => n + 1);
      setConstraint(false);
      setStationary("");
      setClassification("");
      setGraded(false);
      setSolution(false);
      setComplete(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page mo427-page"
      aria-label="Multivariable optimisation"
      data-testid="geometry3d-mockup-0612"
      data-lesson-title="Multivariable Optimisation"
      data-guidance="Drag surface point to inspect gradient, Hessian, stationary set, and constrained extrema."
      data-object-model="threejs-dedicated-draggable-quadratic-form-linked-exact-contours-gradient-field-hessian-eigenclassification-constraint-graded-degenerate-minimum"
      data-direct-interaction="true"
      data-x={fix(point.x)}
      data-y={fix(point.y)}
      data-z={fix(value)}
      data-gx={fix(g.x)}
      data-gy={fix(g.y)}
      data-magnitude={fix(magnitude)}
      data-det="0"
      data-classification={
        onStationary ? "Degenerate minimum trough" : "Non-stationary"
      }
      data-constraint={constraint}
      data-graded={graded}
      data-correct={correct}
      data-solution={solution}
      data-complete={complete}
      data-actions={actions}
    >
      <header className="mo427-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>427. Multivariable Optimisation</h1>
          <p>
            <b>Objective:</b> Find and classify extrema of z=f(x,y), and
            understand the role of the Hessian.
          </p>
          <div>
            <span>Level: Advanced</span>
            <span>Approx. time: 6-10 min</span>
            <span>Skills: Partial derivatives, Hessian, Stationary points</span>
          </div>
        </section>
        <aside>
          <b>Lesson Progress</b>
          <progress max="100" value={complete ? 100 : 0} />
          <output>{complete ? 100 : 0}%</output>
          <button onClick={() => act(() => setComplete((v) => !v))}>
            {complete ? "Completed" : "Mark as Complete"}
          </button>
        </aside>
      </header>
      <nav className="mo427-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="mo427-lab">
        <header>
          <div>
            <i>1</i>
            <h2>Observe &amp; Manipulate</h2>
            <p>
              Drag the point on the surface. See how gradient and Hessian
              determine the nature.
            </p>
          </div>
          <button onClick={() => act(() => setViewKey((n) => n + 1))}>
            Reset view
          </button>
        </header>
        <div className="mo427-work">
          <article className="mo427-surface">
            <h3>Surface: z=f(x,y)=x²+y²-2xy=(x-y)²</h3>
            <OptimisationCanvas
              key={viewKey}
              point={point}
              constraint={constraint}
              onPoint={setPoint}
              onOrbit={onInteraction}
            />
            <p>Drag the blue point on the surface</p>
          </article>
          <div className="mo427-linked">
            <Contour point={point} />
            <GradientMap point={point} />
          </div>
          <aside className="mo427-readout">
            <section>
              <h3>Point coordinates</h3>
              {(["x", "y"] as const).map((k) => (
                <label key={k}>
                  {k}
                  <input
                    aria-label={`${k} coordinate`}
                    type="number"
                    step=".1"
                    value={point[k]}
                    onChange={(e) =>
                      setPoint({ ...point, [k]: Number(e.target.value) })
                    }
                  />
                </label>
              ))}
            </section>
            <section>
              <h3>Function value</h3>
              <p>z=f(x,y)</p>
              <output>{fix(value)}</output>
            </section>
            <section>
              <h3>Gradient</h3>
              <p>∇f=(fₓ,fᵧ)</p>
              <label>
                fₓ
                <input readOnly value={fix(g.x)} />
              </label>
              <label>
                fᵧ
                <input readOnly value={fix(g.y)} />
              </label>
              <label>
                |∇f|
                <input readOnly value={fix(magnitude)} />
              </label>
            </section>
            <section>
              <h3>Hessian</h3>
              <output>H = [ 2 -2; -2 2 ]</output>
              <p>det(H)=0, eigenvalues 0 and 4</p>
            </section>
            <section>
              <h3>Classification at point</h3>
              <strong>
                {onStationary ? "Degenerate Minimum Trough" : "Non-stationary"}
              </strong>
            </section>
          </aside>
        </div>
        <section className="mo427-stationary">
          <article>
            <h3>Stationary points (∇f=0)</h3>
            <p>Solve 2(x-y)=0 and 2(y-x)=0</p>
            <output>(x,y)=(t,t), all real t</output>
          </article>
          <article>
            <p>At every point x=y:</p>
            <output>H=[2 -2; -2 2], det(H)=0</output>
            <strong>Minimum trough</strong>
          </article>
          <article>
            <label>
              <input
                type="checkbox"
                checked={constraint}
                onChange={() => act(() => setConstraint((v) => !v))}
              />
              Show constraint curve
            </label>
            <p>Add g(x,y)=x²+y²-4=0 to explore constrained optimisation.</p>
            <button onClick={() => act(() => setConstraint(true))}>
              Add Constraint
            </button>
          </article>
        </section>
      </section>
      <section className="mo427-pattern">
        <h2>
          <i>2</i> Notice the Pattern
        </h2>
        <div>
          <article>
            <b>Gradient tells direction</b>
            <p>
              ∇f points in the direction of steepest increase. At stationary
              points, ∇f=0.
            </p>
          </article>
          <article>
            <b>Hessian tells curvature</b>
            <p>
              Use eigenvalues or the Hessian determinant to classify isolated
              stationary points.
            </p>
          </article>
          <article>
            <b>Classification clues</b>
            <p>
              D&gt;0, fₓₓ&gt;0: local min
              <br />
              D&gt;0, fₓₓ&lt;0: local max
              <br />
              D&lt;0: saddle
              <br />
              D=0: inspect directly
            </p>
          </article>
        </div>
      </section>
      <section className="mo427-rule">
        <article>
          <h2>
            <i>3</i> Understand the Rule
          </h2>
          <b>Second Derivative (Hessian) Test</b>
          <p>At an isolated stationary point compute D=fₓₓfᵧᵧ-fₓᵧ².</p>
          <table>
            <tbody>
              <tr>
                <th>Condition</th>
                <th>Conclusion</th>
              </tr>
              <tr>
                <td>D&gt;0,fₓₓ&gt;0</td>
                <td>Local minimum</td>
              </tr>
              <tr>
                <td>D&gt;0,fₓₓ&lt;0</td>
                <td>Local maximum</td>
              </tr>
              <tr>
                <td>D&lt;0</td>
                <td>Saddle point</td>
              </tr>
              <tr>
                <td>D=0</td>
                <td>Test is inconclusive</td>
              </tr>
            </tbody>
          </table>
          <aside>
            <b>Misconception Alert</b>
            <p>
              D=0 does not mean saddle. Inspect the function or Hessian
              eigenvalues directly.
            </p>
          </aside>
        </article>
        <article>
          <h2>
            <i>4</i> Worked Example (Correct)
          </h2>
          <p>For f(x,y)=x²+y²-2xy=(x-y)²:</p>
          <ol>
            <li>
              <b>Stationary set:</b> ∇f=0 exactly when x=y.
            </li>
            <li>
              <b>Hessian:</b> eigenvalues are 0 and 4, so it is positive
              semidefinite.
            </li>
            <li>
              <b>Direct check:</b> f=(x-y)²≥0 and f=0 along x=y.
            </li>
          </ol>
          <strong>
            Answer: Every point on x=y is a global minimum; together they form a
            flat trough.
          </strong>
        </article>
      </section>
      <section className="mo427-challenge">
        <div>
          <h2>
            <i>5</i> Try Independently (Your Turn)
          </h2>
          <p>
            Find and classify stationary points of f(x,y)=x²+4y²-4xy=(x-2y)².
          </p>
          <small>Use ∇f=0, then inspect the degenerate Hessian.</small>
        </div>
        <label>
          Stationary set
          <select
            aria-label="Challenge stationary set"
            value={stationary}
            onChange={(e) =>
              act(() => {
                setStationary(e.target.value);
                setGraded(false);
              })
            }
          >
            <option value="">Choose</option>
            <option value="x=2y">x=2y</option>
            <option value="x=y">x=y</option>
            <option value="origin">origin only</option>
          </select>
        </label>
        <label>
          Classification
          <select
            aria-label="Challenge classification"
            value={classification}
            onChange={(e) =>
              act(() => {
                setClassification(e.target.value);
                setGraded(false);
              })
            }
          >
            <option value="">Choose</option>
            <option value="minimum-trough">global minimum trough</option>
            <option value="saddle">saddle</option>
            <option value="maximum">maximum</option>
          </select>
        </label>
        <button onClick={() => act(() => setGraded(true))}>
          Check My Answer
        </button>
        <button onClick={() => act(() => setSolution((v) => !v))}>
          Show Solution
        </button>
        {graded && (
          <strong className={correct ? "correct" : "wrong"}>
            {correct ? "Correct" : "Recheck the perfect square."}
          </strong>
        )}
        {solution && <aside>f=(x-2y)²≥0, with equality on x=2y.</aside>}
      </section>
      <nav className="mo427-adjacent">
        <button>
          <small>Previous</small>
          <b>426 Double Integrals</b>
        </button>
        <button>Back to Lessons</button>
        <button>
          <small>Next</small>
          <b>428 Lagrange Multipliers</b>
        </button>
      </nav>
    </section>
  );
}

function OptimisationCanvas({
  point,
  constraint,
  onPoint,
  onOrbit,
}: {
  point: Point;
  constraint: boolean;
  onPoint: (p: Point) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false),
    surface = useMemo(surfaceGeometry, []),
    z = fn(point.x, point.y),
    move = (e: ThreeEvent<PointerEvent>) => {
      if (!drag) return;
      e.stopPropagation();
      onPoint({
        x: fix(Math.max(-3, Math.min(3, e.point.x)), 2),
        y: fix(Math.max(-3, Math.min(3, e.point.z)), 2),
      });
    };
  return (
    <Canvas
      camera={{ position: [5, 5, 7], fov: 43 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} />
      <gridHelper args={[7, 14, "#bac4ce", "#e2e7ec"]} />
      <mesh geometry={surface}>
        <meshStandardMaterial color="#4fb6cf" vertexColors side={DoubleSide} />
      </mesh>
      <mesh geometry={surface}>
        <meshBasicMaterial
          color="#557aa3"
          transparent
          opacity={0.25}
          wireframe
        />
      </mesh>
      {constraint && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <torusGeometry args={[2, 0.025, 8, 80]} />
          <meshBasicMaterial color="#e43c74" />
        </mesh>
      )}
      <mesh
        position={[point.x, z, point.y]}
        onPointerMove={move}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.target as unknown as Element).setPointerCapture(e.pointerId);
          setDrag(true);
          onOrbit();
        }}
        onPointerUp={(e) => {
          (e.target as unknown as Element).releasePointerCapture(e.pointerId);
          setDrag(false);
        }}
      >
        <sphereGeometry args={[0.13, 20, 15]} />
        <meshStandardMaterial color="#078fce" />
        <Html position={[0.2, 0.2, 0]} style={{ pointerEvents: "none" }}>
          <b className="mo427-label">
            ({fix(point.x, 1)},{fix(point.y, 1)})
          </b>
        </Html>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <OrbitControls enabled={!drag} target={[0, 1.5, 0]} onStart={onOrbit} />
    </Canvas>
  );
}
function surfaceGeometry() {
  const n = 45,
    pos: number[] = [],
    colors: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++) {
      const x = -3 + (6 * i) / n,
        y = -3 + (6 * j) / n,
        z = fn(x, y) / 3;
      pos.push(x, z, y);
      const t = Math.min(1, z / 5);
      colors.push(0.18 + 0.65 * t, 0.65 - 0.35 * t, 0.8 - 0.25 * t);
    }
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const p = j * (n + 1) + i;
      idx.push(p, p + 1, p + n + 1, p + 1, p + n + 2, p + n + 1);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();
  return geometry;
}
function Contour({ point }: { point: Point }) {
  const map = (v: number) => 130 + v * 38;
  return (
    <article className="mo427-map">
      <h3>Contour map (level curves)</h3>
      <svg viewBox="0 0 260 210">
        <path d="M15 105H245M130 10V200" className="axis" />
        {[-2, -1, 1, 2].map((k) => (
          <g key={k}>
            <path
              d={`M${map(-3)} ${map(-3 - k)}L${map(3)} ${map(3 - k)}`}
              className="contour"
            />
            <path
              d={`M${map(-3)} ${map(-3 + k)}L${map(3)} ${map(3 + k)}`}
              className="contour"
            />
          </g>
        ))}
        <path d="M16 16L244 244" className="minimum" />
        <circle cx={map(point.x)} cy={map(-point.y)} r="6" />
      </svg>
    </article>
  );
}
function GradientMap({ point }: { point: Point }) {
  const map = (v: number) => 130 + v * 38;
  return (
    <article className="mo427-map">
      <h3>Gradient ∇f(x,y)</h3>
      <svg viewBox="0 0 260 210">
        <path d="M15 105H245M130 10V200" className="axis" />
        {[-2, -1, 0, 1, 2].flatMap((x) =>
          [-2, -1, 0, 1, 2].map((y) => {
            const g = gradient(x, y),
              m = Math.hypot(g.x, g.y) || 1;
            return (
              <line
                key={`${x}-${y}`}
                x1={map(x)}
                y1={map(-y)}
                x2={map(x) + (12 * g.x) / m}
                y2={map(-y) - (12 * g.y) / m}
                className="arrow"
              />
            );
          }),
        )}
        <circle cx={map(point.x)} cy={map(-point.y)} r="6" />
      </svg>
    </article>
  );
}
