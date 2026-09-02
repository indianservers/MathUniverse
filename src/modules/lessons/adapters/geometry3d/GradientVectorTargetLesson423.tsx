import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./GradientVectorTargetLesson423.css";
type Point = { x: number; y: number };
const initial = { point: { x: 1, y: 0.5 }, opacity: 0.7, tool: "select" },
  f = ({ x, y }: Point) => x * x - x * y + y * y,
  gradient = ({ x, y }: Point): Point => ({ x: 2 * x - y, y: -x + 2 * y }),
  fix = (n: number, d = 3) => Number(n.toFixed(d));
export default function GradientVectorTargetLesson423({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [model, setModel] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [answer, setAnswer] = useState({ fx: "", fy: "", mag: "", ux: "", uy: "" }),
    [graded, setGraded] = useState(false),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0),
    g = gradient(model.point),
    height = f(model.point),
    mag = Math.hypot(g.x, g.y),
    unit = { x: g.x / mag, y: g.y / mag },
    t = { x: -g.y, y: g.x },
    dot = g.x * t.x + g.y * t.y,
    correct =
      Math.abs(Number(answer.fx) - 2) < 0.02 &&
      Math.abs(Number(answer.fy) - 2) < 0.02 &&
      Math.abs(Number(answer.mag) - Math.sqrt(8)) < 0.02 &&
      Math.abs(Number(answer.ux) - 1 / Math.sqrt(2)) < 0.02 &&
      Math.abs(Number(answer.uy) - 1 / Math.sqrt(2)) < 0.02,
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    setPoint = (p: Point) => act(() => setModel((m) => ({ ...m, point: p }))),
    reset = () => {
      setModel(initial);
      setTab("Interact");
      setAnswer({ fx: "", fy: "", mag: "", ux: "", uy: "" });
      setGraded(false);
      setHint(false);
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page gv423-page"
      aria-label="Gradient vector"
      data-testid="geometry3d-mockup-0608"
      data-lesson-title="Gradient Vector"
      data-guidance="Drag surface point to explore the gradient vector."
      data-object-model="threejs-dedicated-draggable-quadratic-height-field-gradient-vector-contour-map-unit-direction-tangent-orthogonality-graded-challenge"
      data-direct-interaction="true"
      data-x={fix(model.point.x)}
      data-y={fix(model.point.y)}
      data-z={fix(height)}
      data-gx={fix(g.x)}
      data-gy={fix(g.y)}
      data-magnitude={fix(mag)}
      data-ux={fix(unit.x)}
      data-uy={fix(unit.y)}
      data-dot={fix(dot)}
      data-tool={model.tool}
      data-opacity={model.opacity}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="gv423-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>423 Gradient Vector</h1>
          <p>Find steepest increase.</p>
        </section>
        <aside>
          <span>
            <small>Level</small>
            <b>High School+</b>
          </span>
          <span>
            <small>Time</small>
            <b>6-10 min</b>
          </span>
          <span>
            <small>Skills</small>
            <b>Multivariable Calculus</b>
          </span>
        </aside>
      </header>
      <nav className="gv423-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (x) => (
            <button
              key={x}
              className={tab === x ? "active" : ""}
              onClick={() => act(() => setTab(x))}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <section className="gv423-steps">
        {[
          ["1", "Observe", "See the gradient."],
          ["2", "Manipulate", "Drag and explore."],
          ["3", "Notice", "Spot the pattern."],
          ["4", "Understand", "Learn the rule."],
          ["5", "Try", "Solve on your own."],
        ].map(([a, b, c]) => (
          <span key={a}>
            <i>{a}</i>
            <b>{b}</b>
            <small>{c}</small>
          </span>
        ))}
      </section>
      <section className="gv423-lab">
        <article>
          <h3>EXPLORE: HEIGHT SURFACE & CONTOUR MAP</h3>
          <h4>3D HEIGHT SURFACE</h4>
          <output>f(x,y)=x²-xy+y²</output>
          <div className="gv423-canvas">
            <GradientCanvas
              key={viewKey}
              model={model}
              onPoint={setPoint}
              onOrbit={onInteraction}
            />
            <button onClick={() => act(() => setViewKey((n) => n + 1))}>
              ↻
            </button>
          </div>
          <h4>CONTOUR MAP (level curves of f)</h4>
          <Contour point={model.point} gradient={g} />
          <footer>
            <span>➜ ∇f (steepest ascent)</span>
            <span>----- Tangent to contour (⊥ ∇f)</span>
          </footer>
        </article>
        <aside>
          <section>
            <h3>CONTROLS</h3>
            <nav>
              {["select", "pan", "target", "reset"].map((x) => (
                <button
                  aria-label={`${x} tool`}
                  key={x}
                  className={model.tool === x ? "active" : ""}
                  onClick={() =>
                    x === "reset"
                      ? reset()
                      : act(() => setModel((m) => ({ ...m, tool: x })))
                  }
                >
                  {x === "select"
                    ? "⌁"
                    : x === "pan"
                      ? "♧"
                      : x === "target"
                        ? "⊙"
                        : "↻"}
                </button>
              ))}
            </nav>
            <h4>Drag the point on the surface</h4>
            <div>
              {(["x", "y"] as const).map((k) => (
                <label key={k}>
                  {k}
                  <input
                    aria-label={`${k} coordinate value`}
                    type="number"
                    min="-3"
                    max="3"
                    step=".1"
                    value={model.point[k]}
                    onChange={(e) =>
                      setPoint({ ...model.point, [k]: Number(e.target.value) })
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Surface opacity{" "}
              <output>{Math.round(model.opacity * 100)}%</output>
              <input
                aria-label="Surface opacity"
                type="range"
                min=".2"
                max="1"
                step=".05"
                value={model.opacity}
                onChange={(e) =>
                  act(() =>
                    setModel((m) => ({
                      ...m,
                      opacity: Number(e.target.value),
                    })),
                  )
                }
              />
            </label>
          </section>
          <section>
            <h3>GRADIENT READOUT</h3>
            <output>∇f(x,y)=(2x-y,-x+2y)</output>
            <p>
              At ({fix(model.point.x, 2)}, {fix(model.point.y, 2)}):
            </p>
            <output>
              ∇f=({fix(g.x, 2)}, {fix(g.y, 2)})
            </output>
            <p>‖∇f‖={fix(mag)}</p>
            <p>Direction (unit vector):</p>
            <output>
              ({fix(unit.x)}, {fix(unit.y)})
            </output>
          </section>
          <section>
            <h3>ORTHOGONALITY CHECK</h3>
            <p>Let t be a tangent direction to the contour.</p>
            <output>
              t=(-∂f/∂y, ∂f/∂x)=({fix(t.x)}, {fix(t.y)})
            </output>
            <strong>
              ✓ ∇f·t = {fix(dot)} ≈ 0<br />
              (Perpendicular)
            </strong>
          </section>
        </aside>
      </section>
      <section className="gv423-info">
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>For f(x,y)=x²-xy+y², at (1,0.5):</p>
          <output>∇f(x,y)=(2x-y,-x+2y)</output>
          <p>∇f(1,0.5)=(1.5,0)</p>
          <p>‖∇f‖=√(1.5²+0²)=1.5</p>
          <p>Steepest ascent direction is ∇f/‖∇f‖=(1,0).</p>
        </article>
        <article>
          <h3>KEY RULE / DEFINITION</h3>
          <h4>Gradient Vector</h4>
          <p>For a differentiable function f(x,y),</p>
          <output>∇f(x,y)=(fₓ,fᵧ)</output>
          <ul>
            <li>Points in the direction of steepest increase.</li>
            <li>Its magnitude equals the maximum rate of increase.</li>
            <li>It is perpendicular to the level curve through (x,y).</li>
          </ul>
          <strong>
            Steepest increase at (x,y) is in the direction of ∇f with rate ‖∇f‖.
          </strong>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <p className="wrong">
            ⚠ The gradient is NOT tangent to the contour.
            <br />
            It is perpendicular to the contour and points toward higher values.
          </p>
          <ContourMini />
          <b>Perpendicular, not tangent!</b>
        </article>
      </section>
      <section className="gv423-challenge">
        <article>
          <h3>YOUR TURN: MINI CHALLENGE</h3>
          <p>
            <b>Function:</b> f(x,y)=x²-y²
          </p>
          <p>
            <b>Point:</b> (1,-1)
          </p>
          <p>
            Find ∇f, its magnitude, and the unit direction of steepest increase.
          </p>
        </article>
        <div>
          <label>
            ∇f(1,-1)=(
            <input
              aria-label="Challenge fx"
              value={answer.fx}
              onChange={(e) =>
                act(() => {
                  setAnswer((a) => ({ ...a, fx: e.target.value }));
                  setGraded(false);
                })
              }
            />
            ,
            <input
              aria-label="Challenge fy"
              value={answer.fy}
              onChange={(e) =>
                act(() => {
                  setAnswer((a) => ({ ...a, fy: e.target.value }));
                  setGraded(false);
                })
              }
            />
            )
          </label>
          <label>
            ‖∇f(1,-1)‖=
            <input
              aria-label="Challenge magnitude"
              value={answer.mag}
              onChange={(e) =>
                act(() => {
                  setAnswer((a) => ({ ...a, mag: e.target.value }));
                  setGraded(false);
                })
              }
            />
          </label>
          <label>
            Unit direction=(
            <input
              aria-label="Challenge ux"
              value={answer.ux}
              onChange={(e) =>
                act(() => {
                  setAnswer((a) => ({ ...a, ux: e.target.value }));
                  setGraded(false);
                })
              }
            />
            ,
            <input
              aria-label="Challenge uy"
              value={answer.uy}
              onChange={(e) =>
                act(() => {
                  setAnswer((a) => ({ ...a, uy: e.target.value }));
                  setGraded(false);
                })
              }
            />
            )
          </label>
        </div>
        <aside>
          <button onClick={() => act(() => setGraded(true))}>
            Check Answer
          </button>
          <button onClick={() => act(() => setHint((x) => !x))}>
            ♧ Need a hint?
          </button>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct ? "Correct!" : "Differentiate x²-y² first."}
            </strong>
          )}
          {hint && <p>∇f=(2x,-2y).</p>}
        </aside>
      </section>
      <nav className="gv423-adjacent">
        <button>
          ← <small>PREVIOUS LESSON</small>
          <b>Partial Derivatives</b>
        </button>
        <button>
          <small>NEXT LESSON</small>
          <b>Tangent Plane</b> →
        </button>
      </nav>
    </section>
  );
}
function GradientCanvas({
  model,
  onPoint,
  onOrbit,
}: {
  model: typeof initial;
  onPoint: (p: Point) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false),
    geometry = useMemo(surface, []),
    p = model.point,
    h = f(p),
    g = gradient(p),
    move = (e: ThreeEvent<PointerEvent>) => {
      if (!drag) return;
      e.stopPropagation();
      onPoint({
        x: Math.max(-3, Math.min(3, e.point.x)),
        y: Math.max(-3, Math.min(3, e.point.z)),
      });
    };
  return (
    <Canvas
      camera={{ position: [7.2, 6.4, 8.6], fov: 48 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 7, 5]} intensity={1.7} />
      <gridHelper args={[7, 14, "#b9c2cf", "#e2e7ed"]} />
      <axesHelper args={[3.5]} />
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#286bd5"
          vertexColors
          transparent
          opacity={model.opacity}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        position={[p.x, h, p.y]}
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
        <sphereGeometry args={[0.2, 20, 14]} />
        <meshStandardMaterial color="#148dd3" />
        <Html position={[0.25, 0.2, 0]} style={{ pointerEvents: "none" }}>
          <b className="gv423-label">
            (x,y)=({fix(p.x, 2)},{fix(p.y, 2)})<br />
            f={fix(h)}
          </b>
        </Html>
      </mesh>
      <Line
        points={[
          [p.x, h, p.y],
          [p.x + g.x * 0.55, h + 0.2, p.y + g.y * 0.55],
        ]}
        color="#20bce0"
        lineWidth={4}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <OrbitControls enabled={!drag} target={[0, 2.4, 0]} onStart={onOrbit} />
    </Canvas>
  );
}
function surface() {
  const rings = 28,
    sectors = 64,
    pos: number[] = [],
    color: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= rings; j++)
    for (let i = 0; i <= sectors; i++) {
      const angle = (2 * Math.PI * i) / sectors,
        factor = 1 - 0.5 * Math.sin(2 * angle),
        radius = (j / rings) * Math.sqrt(6 / factor),
        x = radius * Math.cos(angle),
        y = radius * Math.sin(angle),
        height = f({ x, y });
      pos.push(x, height, y);
      color.push(
        0.2 + (0.5 * height) / 8,
        0.75 - (0.3 * height) / 8,
        0.9 - (0.2 * height) / 8,
      );
    }
  for (let j = 0; j < rings; j++)
    for (let i = 0; i < sectors; i++) {
      const p = j * (sectors + 1) + i;
      idx.push(p,p+1,p+sectors+1,p+1,p+sectors+2,p+sectors+1);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(color, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function Contour({ point, gradient: g }: { point: Point; gradient: Point }) {
  const px = 220 + point.x * 55,
    py = 150 - point.y * 43;
  return (
    <svg className="gv423-contour" viewBox="0 0 440 280">
      <path d="M25 150H420M220 20V260" stroke="#66758a" />
      {[1, 2, 3, 4, 5].map((k) => (
        <ellipse
          key={k}
          cx="220"
          cy="150"
          rx={45 * Math.sqrt(k)}
          ry={31 * Math.sqrt(k)}
          transform="rotate(28 220 150)"
          fill="#7864e612"
          stroke="#5d9ddd"
        />
      ))}
      <line
        x1={px}
        y1={py}
        x2={px + g.x * 32}
        y2={py - g.y * 25}
        stroke="#28b9dd"
        strokeWidth="4"
      />
      <line
        x1={px}
        y1={py}
        x2={px - g.y * 32}
        y2={py - g.x * 25}
        stroke="#64748b"
        strokeDasharray="5 4"
      />
      <circle
        cx={px}
        cy={py}
        r="7"
        fill="#087dc4"
        stroke="#fff"
        strokeWidth="3"
      />
    </svg>
  );
}
function ContourMini() {
  return (
    <svg viewBox="0 0 180 95">
      <ellipse cx="90" cy="53" rx="65" ry="26" fill="none" stroke="#54aee2" />
      <ellipse cx="90" cy="53" rx="42" ry="16" fill="none" stroke="#54aee2" />
      <line x1="90" y1="53" x2="90" y2="9" stroke="#8a2eda" strokeWidth="4" />
      <line
        x1="34"
        y1="84"
        x2="146"
        y2="23"
        stroke="#333"
        strokeDasharray="5 4"
      />
      <circle cx="90" cy="53" r="5" />
    </svg>
  );
}
