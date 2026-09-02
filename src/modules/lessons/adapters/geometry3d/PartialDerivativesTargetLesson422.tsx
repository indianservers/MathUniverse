import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PartialDerivativesTargetLesson422.css";
type Point = { x: number; y: number };
const initial: Point = { x: 1.5, y: -1 },
  fix = (n: number) => Number(n.toFixed(2)),
  z = (p: Point) => p.x * p.x + p.y * p.y;
export default function PartialDerivativesTargetLesson422({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [answer, setAnswer] = useState({ x: "-1", y: "0" }),
    [graded, setGraded] = useState(true),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0),
    height = z(p),
    dx = 2 * p.x,
    dy = 2 * p.y,
    correct = Number(answer.x) === -1 && Number(answer.y) === 0,
    act = (f: () => void) => {
      f();
      setActions((n) => n + 1);
      onInteraction();
    },
    update = (k: keyof Point, v: number) =>
      act(() => setP((q) => ({ ...q, [k]: v }))),
    reset = () => {
      setP(initial);
      setTab("Interact");
      setAnswer({ x: "-1", y: "0" });
      setGraded(true);
      setHint(false);
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page pd422-page"
      aria-label="Partial derivatives"
      data-testid="geometry3d-mockup-0607"
      data-lesson-title="Partial Derivatives"
      data-guidance="Drag surface point P to compare directional slopes."
      data-object-model="threejs-dedicated-draggable-paraboloid-point-x-y-slices-tangent-lines-partial-derivative-slopes-graded-challenge"
      data-direct-interaction="true"
      data-x={fix(p.x)}
      data-y={fix(p.y)}
      data-z={fix(height)}
      data-dx={fix(dx)}
      data-dy={fix(dy)}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="pd422-hero">
        <h1>Partial Derivatives – reusable 3D graph engine</h1>
        <p>
          <b>Objective:</b> Understand ∂z/∂x and ∂z/∂y at a point as directional
          slopes of the surface z=f(x,y).
        </p>
        <div>
          {[
            ["Level", "Advanced"],
            ["Topic", "Multivariable Calculus"],
            ["Estimated time", "6-10 min"],
            ["Interactives", "1"],
          ].map(([a, b]) => (
            <span key={a}>
              <small>{a}</small>
              {b}
            </span>
          ))}
          <button>♧ Share</button>
        </div>
      </header>
      <nav className="pd422-tabs">
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
      <section className="pd422-lab">
        <header>
          <div>
            <h2>Explore the surface</h2>
            <p>Move the point P on the surface z=x²+y².</p>
          </div>
          <button onClick={() => act(() => setViewKey((n) => n + 1))}>
            ↻ Reset view
          </button>
        </header>
        <div className="pd422-work">
          <article className="pd422-canvas">
            <ParaboloidCanvas
              key={viewKey}
              point={p}
              onChange={(q) => act(() => setP(q))}
              onOrbit={onInteraction}
            />
            <b>z = x² + y²</b>
            <i>
              ↻<br />
              3D
            </i>
          </article>
          <aside>
            <section>
              <h3>Move point P</h3>
              {(["x", "y"] as const).map((k) => (
                <label key={k}>
                  <b>{k}</b>
                  <input
                    aria-label={`${k} coordinate`}
                    type="range"
                    min="-3"
                    max="3"
                    step=".05"
                    value={p[k]}
                    onChange={(e) => update(k, Number(e.target.value))}
                  />
                  <output>{fix(p[k]).toFixed(2)}</output>
                </label>
              ))}
            </section>
            <section>
              <h3>
                At P ({fix(p.x).toFixed(2)}, {fix(p.y).toFixed(2)},{" "}
                {fix(height).toFixed(2)})
              </h3>
              <p>
                f({fix(p.x)}, {fix(p.y)}) = {fix(height)}
              </p>
              <hr />
              <h3>Slices through P</h3>
              <p className="blue">
                <b>x-direction slice (y={fix(p.y).toFixed(2)})</b>
                <br />
                z=x²+{fix(p.y * p.y)}
              </p>
              <p>
                Tangent slope (∂z/∂x){" "}
                <strong>
                  {fix(dx)}x = {fix(dx).toFixed(2)}
                </strong>
              </p>
              <p className="orange">
                <b>y-direction slice (x={fix(p.x).toFixed(2)})</b>
                <br />
                z={fix(p.x * p.x)}+y²
              </p>
              <p>
                Tangent slope (∂z/∂y){" "}
                <strong>
                  {fix(dy)}y = {fix(dy).toFixed(2)}
                </strong>
              </p>
            </section>
            <section>
              <h3>Interpretation</h3>
              <p>
                At P, the surface{" "}
                <b>
                  {dx >= 0 ? "rises" : "falls"} {Math.abs(dx).toFixed(2)}
                </b>{" "}
                units per +1 x unit and{" "}
                <b>
                  {dy >= 0 ? "rises" : "falls"} {Math.abs(dy).toFixed(2)}
                </b>{" "}
                units per +1 y unit.
              </p>
            </section>
          </aside>
        </div>
        <section className="pd422-cross">
          <h3>Cross-sections and tangents at P</h3>
          <SliceChart axis="x" fixed={p.y} point={p.x} slope={dx} />
          <SliceChart axis="y" fixed={p.x} point={p.y} slope={dy} />
          <article>
            <p>
              ◉ P = ({fix(p.x)}, {fix(p.y)}, {fix(height)})
            </p>
            <p className="blue">— x-slice (vary x, fix y)</p>
            <p className="orange">— y-slice (vary y, fix x)</p>
            <p>--- Tangent line at P</p>
            <p>··· Projection of P</p>
          </article>
        </section>
      </section>
      <section className="pd422-info">
        <article>
          <h3>Notice the pattern</h3>
          <p>What happens to the slopes when you move P?</p>
          <p>
            ✅ Move P right (increase x):
            <br />
            ∂z/∂x increases.
          </p>
          <p>
            ✅ Move P left (decrease x):
            <br />
            ∂z/∂x decreases.
          </p>
          <p>
            ✅ Move P up (increase y):
            <br />
            ∂z/∂y increases.
          </p>
          <p>
            ✅ Move P down (decrease y):
            <br />
            ∂z/∂y decreases.
          </p>
        </article>
        <article>
          <h3>Key rule (definition)</h3>
          <p>
            For z=f(x,y), the partial derivatives at P(x₀,y₀) give directional
            slopes:
          </p>
          <section>
            <output>∂z/∂x(x₀,y₀)=lim [f(x₀+h,y₀)-f(x₀,y₀)]/h</output>
            <b>Slope in the +x direction (y fixed).</b>
          </section>
          <section>
            <output>∂z/∂y(x₀,y₀)=lim [f(x₀,y₀+k)-f(x₀,y₀)]/k</output>
            <b>Slope in the +y direction (x fixed).</b>
          </section>
        </article>
        <article>
          <h3>Common misconception</h3>
          <p className="wrong">
            ✕ <b>Wrong:</b> The partial derivatives are the height z or the
            value of f.
          </p>
          <p className="correct">
            ☑ <b>Correct:</b> They are slopes (rates of change) along the
            coordinate directions.
          </p>
          <b>
            Think: “How fast does z change if I move only in x (or only in y)?”
          </b>
        </article>
      </section>
      <section className="pd422-bottom">
        <article>
          <h3>Worked example</h3>
          <p>Find ∂z/∂x and ∂z/∂y for z=x²+y² at P(1.50,-1.00).</p>
          <div>
            <section>
              <output>∂z/∂x=2x</output>
              <p>
                At x=1.50:
                <br />
                ∂z/∂x=2(1.50)=<b>3.00</b>
              </p>
            </section>
            <section>
              <output>∂z/∂y=2y</output>
              <p>
                At y=-1.00:
                <br />
                ∂z/∂y=2(-1.00)=<b>-2.00</b>
              </p>
            </section>
          </div>
          <p>These match the tangent slopes shown in the interactive.</p>
        </article>
        <article>
          <h3>Your turn</h3>
          <h4>Challenge 1 (Quick check)</h4>
          <p>For z=x²+xy+y², find ∂z/∂x and ∂z/∂y at (1,-2).</p>
          <div>
            {(["x", "y"] as const).map((k) => (
              <label key={k}>
                ∂z/∂{k}(1,-2) ={" "}
                <input
                  aria-label={`Challenge ${k}`}
                  value={answer[k]}
                  onChange={(e) =>
                    act(() => {
                      setAnswer((a) => ({ ...a, [k]: e.target.value }));
                      setGraded(false);
                    })
                  }
                />
                {graded && correct && "✓"}
              </label>
            ))}
          </div>
          <button onClick={() => act(() => setGraded(true))}>
            Check answers
          </button>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct
                ? "Correct! Well done."
                : "Try each partial before substituting."}
            </strong>
          )}
          <button onClick={() => act(() => setHint((x) => !x))}>♧ Hint</button>
          {hint && <p>∂f/∂x=2x+y and ∂f/∂y=x+2y.</p>}
        </article>
      </section>
      <nav className="pd422-adjacent">
        <button>
          ← <small>Previous lesson</small>
          <b>Level Surfaces</b>
        </button>
        <button>
          <small>Next lesson</small>
          <b>Gradient Vector</b> →
        </button>
      </nav>
      <footer>
        <b>⚒ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
      </footer>
    </section>
  );
}
function ParaboloidCanvas({
  point,
  onChange,
  onOrbit,
}: {
  point: Point;
  onChange: (p: Point) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false),
    geometry = useMemo(paraboloid, []),
    h = z(point),
    move = (e: ThreeEvent<PointerEvent>) => {
      if (!drag) return;
      e.stopPropagation();
      onChange({
        x: Math.max(-3, Math.min(3, e.point.x)),
        y: Math.max(-3, Math.min(3, e.point.z)),
      });
    },
    xs = Array.from({ length: 45 }, (_, i) => {
      const x = -2.2 + (4.4 * i) / 44;
      return [x, x * x + point.y * point.y, point.y] as [
        number,
        number,
        number,
      ];
    }),
    ys = Array.from({ length: 45 }, (_, i) => {
      const y = -2.2 + (4.4 * i) / 44;
      return [point.x, point.x * point.x + y * y, y] as [
        number,
        number,
        number,
      ];
    });
  return (
    <Canvas
      camera={{ position: [6.8, 5.8, 8.2], fov: 46 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#061b3b"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 7, 5]} intensity={1.7} />
      <gridHelper args={[7, 14, "#34516e", "#173451"]} />
      <axesHelper args={[3.8]} />
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#3467d2"
          transparent
          opacity={0.44}
          side={DoubleSide}
          wireframe
        />
      </mesh>
      <Line points={xs} color="#16d8df" lineWidth={3} />
      <Line points={ys} color="#ffbd17" lineWidth={3} />
      <Line
        points={[
          [point.x, 0, point.y],
          [point.x, h, point.y],
        ]}
        color="#fff"
        dashed
      />
      <mesh
        position={[point.x, h, point.y]}
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
        <sphereGeometry args={[0.13, 20, 14]} />
        <meshStandardMaterial color="#fff" />
        <Html position={[0.2, 0.2, 0]} style={{ pointerEvents: "none" }}>
          <b className="pd422-label">
            P ({fix(point.x)}, {fix(point.y)}, {fix(h)})
          </b>
        </Html>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <OrbitControls enabled={!drag} target={[0, 2, 0]} onStart={onOrbit} />
    </Canvas>
  );
}
function paraboloid() {
  const rings = 24,
    sectors = 56,
    pos: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= rings; j++)
    for (let i = 0; i <= sectors; i++) {
      const radius = (2.2 * j) / rings,
        angle = (2 * Math.PI * i) / sectors,
        x = radius * Math.cos(angle),
        y = radius * Math.sin(angle);
      pos.push(x, radius * radius, y);
    }
  for (let j = 0; j < rings; j++)
    for (let i = 0; i < sectors; i++) {
      const p = j * (sectors + 1) + i;
      idx.push(
        p,
        p + 1,
        p + sectors + 1,
        p + 1,
        p + sectors + 2,
        p + sectors + 1,
      );
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function SliceChart({
  axis,
  fixed,
  point,
  slope,
}: {
  axis: "x" | "y";
  fixed: number;
  point: number;
  slope: number;
}) {
  const sx = (n: number) => 112 + n * 31,
    sy = (n: number) => 112 - Math.min(6, n) * 14,
    base = fixed * fixed,
    curve = Array.from({ length: 50 }, (_, i) => {
      const q = -3 + (6 * i) / 49;
      return `${i ? "L" : "M"}${sx(q)},${sy(q * q + base)}`;
    }).join(" "),
    px = sx(point),
    py = sy(point * point + base);
  return (
    <article className={axis === "x" ? "blue" : "orange"}>
      <h4>
        {axis}-direction ({axis === "x" ? `y=${fix(fixed)}` : `x=${fix(fixed)}`}
        )
      </h4>
      <svg viewBox="0 0 225 135">
        <path d="M15 112H215M112 8V125" stroke="#7c8b9d" />
        <path d={curve} fill="none" stroke="currentColor" strokeWidth="2" />
        <line
          x1={px - 38}
          y1={py + 38 * slope * 0.3}
          x2={px + 38}
          y2={py - 38 * slope * 0.3}
          stroke="#111"
          strokeDasharray="4 3"
        />
        <circle cx={px} cy={py} r="4" fill="#7dc6e5" stroke="#234" />
        <text x={px + 7} y={py - 7}>
          P
        </text>
        <text x="147" y="98">
          slope = {fix(slope).toFixed(2)}
        </text>
      </svg>
    </article>
  );
}
