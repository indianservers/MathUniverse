import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./TangentPlaneTargetLesson424.css";
type Point = { a: number; b: number };
const initial: Point = { a: 0.6, b: 0.3 },
  fn = (x: number, y: number) => Math.sin(x) * Math.cos(y),
  parts = (a: number, b: number) => ({
    fx: Math.cos(a) * Math.cos(b),
    fy: -Math.sin(a) * Math.sin(b),
  }),
  fix = (n: number, d = 4) => Number(n.toFixed(d));
function maxError(p: Point, window = 0.35) {
  const q = parts(p.a, p.b),
    z0 = fn(p.a, p.b);
  let max = 0;
  for (let i = 0; i <= 12; i++)
    for (let j = 0; j <= 12; j++) {
      const x = p.a - window + (2 * window * i) / 12,
        y = p.b - window + (2 * window * j) / 12,
        t = z0 + q.fx * (x - p.a) + q.fy * (y - p.b);
      max = Math.max(max, Math.abs(fn(x, y) - t));
    }
  return max;
}
export default function TangentPlaneTargetLesson424({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [zoomed, setZoomed] = useState(false),
    [answer, setAnswer] = useState({ c: "", fx: "", a: "", fy: "", b: "" }),
    [graded, setGraded] = useState(false),
    [hint, setHint] = useState(false),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0),
    z0 = fn(p.a, p.b),
    q = parts(p.a, p.b),
    error = maxError(p, zoomed ? 0.15 : 0.35),
    correct =
      Math.abs(Number(answer.c) - 1) < 0.01 &&
      Math.abs(Number(answer.fx)) < 0.01 &&
      Math.abs(Number(answer.a) - 1) < 0.01 &&
      Math.abs(Number(answer.fy) - 1) < 0.01 &&
      Math.abs(Number(answer.b)) < 0.01,
    act = (f: () => void) => {
      f();
      setActions((n) => n + 1);
      onInteraction();
    },
    setPoint = (v: Point) => act(() => setP(v)),
    reset = () => {
      setP(initial);
      setTab("Interact");
      setZoomed(false);
      setAnswer({ c: "", fx: "", a: "", fy: "", b: "" });
      setGraded(false);
      setHint(false);
      setSolution(false);
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page tp424-page"
      aria-label="Tangent plane"
      data-testid="geometry3d-mockup-0609"
      data-lesson-title="Tangent Plane"
      data-guidance="Drag surface point to rebuild the local tangent plane."
      data-object-model="threejs-dedicated-draggable-sinx-cosy-contact-point-live-partials-tangent-plane-local-error-neighborhood-graded-linearization"
      data-direct-interaction="true"
      data-a={fix(p.a)}
      data-b={fix(p.b)}
      data-z={fix(z0)}
      data-fx={fix(q.fx)}
      data-fy={fix(q.fy)}
      data-error={fix(error)}
      data-zoomed={zoomed}
      data-graded={graded}
      data-correct={correct}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="tp424-hero">
        <small>3D MATHEMATICS &nbsp; 3D FUNCTIONS AND SURFACES</small>
        <h1>Tangent Plane</h1>
        <p>Approximate surfaces locally.</p>
        <div>
          {[
            ["♧ Level", "Advanced"],
            ["▣ Topic", "Multivariable Calculus"],
            ["Class", "Class 12+"],
            ["◴ Duration", "6-10 min"],
            ["⌘ Skills", "Partial derivatives, linearization"],
          ].map(([a, b]) => (
            <span key={a}>
              <b>{a}</b>
              {b}
            </span>
          ))}
        </div>
        <aside>
          ⊙ <b>Objective:</b> Approximate a surface near a point using its
          tangent plane.
        </aside>
      </header>
      <nav className="tp424-tabs">
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
      <section className="tp424-lab">
        <header>
          <small>INTERACT</small>
          <h2>Explore the surface, tangent plane & local approximation</h2>
        </header>
        <div className="tp424-work">
          <article className="tp424-canvas">
            <TangentCanvas
              key={viewKey}
              point={p}
              zoomed={zoomed}
              onPoint={setPoint}
              onOrbit={onInteraction}
            />
            <b>
              Surface
              <br />
              <i>f(x,y)=sin(x)cos(y)</i>
            </b>
            <span>♧ Drag the blue point on the surface to move (a,b).</span>
            <button onClick={() => act(() => setViewKey((n) => n + 1))}>
              ↻ Reset view
            </button>
          </article>
          <aside>
            <section>
              <h3>1. Choose point (a,b)</h3>
              {(["a", "b"] as const).map((k) => (
                <label key={k}>
                  {k} ({k === "a" ? "x" : "y"})
                  <input
                    aria-label={`${k} coordinate`}
                    type="range"
                    min={-Math.PI}
                    max={Math.PI}
                    step=".01"
                    value={p[k]}
                    onChange={(e) =>
                      setPoint({ ...p, [k]: Number(e.target.value) })
                    }
                  />
                  <output>{fix(p[k], 2).toFixed(2)}</output>
                </label>
              ))}
            </section>
            <section>
              <h3>2. Live partial derivatives</h3>
              <div>
                <span>
                  f(a,b)<b>{fix(z0)}</b>
                </span>
                <span>
                  fₓ(a,b)<b>{fix(q.fx)}</b>
                </span>
                <span>
                  fᵧ(a,b)<b>{fix(q.fy)}</b>
                </span>
              </div>
            </section>
            <section>
              <h3>3. Tangent plane (z=T)</h3>
              <output>
                z={fix(z0)}+{fix(q.fx)}(x-{fix(p.a, 2)})<br />
                {q.fy < 0 ? "−" : "+"}
                {Math.abs(fix(q.fy))}(y-{fix(p.b, 2)})
              </output>
            </section>
            <section>
              <h3>4. Local approximation error</h3>
              <p>Max |f(x,y)-T(x,y)| on view window</p>
              <b>{fix(error)}</b>
              <strong>✓ Small error near P — good fit!</strong>
            </section>
          </aside>
        </div>
        <section className="tp424-explain">
          <article>
            <h3>At the point P(a,b,f(a,b))</h3>
            <p>
              a={fix(p.a, 2)}, b={fix(p.b, 2)}
            </p>
            <p>
              f(a,b)=sin({fix(p.a, 2)})cos({fix(p.b, 2)})={fix(z0)}
            </p>
            <p>fₓ(a,b)=cos(a)cos(b)={fix(q.fx)}</p>
            <p>fᵧ(a,b)=-sin(a)sin(b)={fix(q.fy)}</p>
          </article>
          <article>
            <h3>Why this plane?</h3>
            <p>
              The tangent plane matches the surface value and slope in both x
              and y directions at P.
            </p>
            <p>✓ Same height at P</p>
            <p>✓ Same slope in x-direction</p>
            <p>✓ Same slope in y-direction</p>
            <p>✓ Best linear approximation nearby</p>
          </article>
          <article>
            <h3>♧ Tip</h3>
            <p>
              Zoom in near P (use smaller view window) to see the plane hugging
              the surface.
            </p>
            <button onClick={() => act(() => setZoomed((x) => !x))}>
              ⌕ {zoomed ? "Show full surface" : "Zoom to neighborhood"}
            </button>
          </article>
        </section>
      </section>
      <section className="tp424-worked">
        <header>
          <small>WORKED EXAMPLE</small>
          <h2>
            Example: Find the tangent plane to f(x,y)=x²y+sin y at (1,π/6)
          </h2>
        </header>
        <div>
          <article>
            <i>1</i>
            <h3>Compute values</h3>
            <p>f(1,π/6)=1²(π/6)+sin(π/6)=π/6+1/2</p>
          </article>
          <article>
            <i>2</i>
            <h3>Partial derivatives</h3>
            <p>fₓ=2xy ⇒ fₓ(1,π/6)=π/3</p>
            <p>fᵧ=x²+cos y ⇒ fᵧ(1,π/6)=1+√3/2</p>
          </article>
          <article>
            <i>3</i>
            <h3>Tangent plane</h3>
            <p>z=f(a,b)+fₓ(a,b)(x-a)+fᵧ(a,b)(y-b)</p>
          </article>
        </div>
        <strong>
          Check: Substitute (x,y)=(1,π/6); both surface and plane give
          z=π/6+1/2.
        </strong>
      </section>
      <section className="tp424-info">
        <article>
          <h3>KEY RULE (DEFINITION)</h3>
          <h2>Tangent Plane to z=f(x,y) at (a,b)</h2>
          <p>
            If f has continuous first partial derivatives near (a,b), then the
            tangent plane at P(a,b,f(a,b)) is
          </p>
          <output>z=f(a,b)+fₓ(a,b)(x-a)+fᵧ(a,b)(y-b)</output>
          <p>where fₓ and fᵧ are the partial derivatives.</p>
        </article>
        <article>
          <h3>MISCONCEPTION ALERT</h3>
          <p>
            <b>Common mistake:</b> Using (x,y) instead of (x-a,y-b).
          </p>
          <p>
            The shifts (x-a) and (y-b) are essential for the plane to pass
            through P.
          </p>
          <Comparison />
        </article>
      </section>
      <section className="tp424-challenge">
        <article>
          <h3>TRY INDEPENDENTLY</h3>
          <h2>Challenge 1</h2>
          <p>Find the tangent plane to f(x,y)=eˣʸ at (1,0).</p>
          <h4>Your answer</h4>
          <label>
            z=
            <input
              aria-label="Challenge c"
              value={answer.c}
              onChange={(e) =>
                act(() => {
                  setAnswer((v) => ({ ...v, c: e.target.value }));
                  setGraded(false);
                })
              }
            />
            +
            <input
              aria-label="Challenge fx"
              value={answer.fx}
              onChange={(e) =>
                act(() => {
                  setAnswer((v) => ({ ...v, fx: e.target.value }));
                  setGraded(false);
                })
              }
            />
            (x-
            <input
              aria-label="Challenge a"
              value={answer.a}
              onChange={(e) =>
                act(() => {
                  setAnswer((v) => ({ ...v, a: e.target.value }));
                  setGraded(false);
                })
              }
            />
            ) +{" "}
            <input
              aria-label="Challenge fy"
              value={answer.fy}
              onChange={(e) =>
                act(() => {
                  setAnswer((v) => ({ ...v, fy: e.target.value }));
                  setGraded(false);
                })
              }
            />
            (y-
            <input
              aria-label="Challenge b"
              value={answer.b}
              onChange={(e) =>
                act(() => {
                  setAnswer((v) => ({ ...v, b: e.target.value }));
                  setGraded(false);
                })
              }
            />
            )
          </label>
          <button onClick={() => act(() => setGraded(true))}>
            ⊙ Check Answer
          </button>
          <button onClick={() => act(() => setHint((x) => !x))}>
            ☆ Show Hint
          </button>
          <button onClick={() => act(() => setSolution((x) => !x))}>
            ◉ Show Solution
          </button>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct ? "Correct: z=1+y." : "Recompute f, fₓ and fᵧ at (1,0)."}
            </strong>
          )}
        </article>
        <aside>
          <h3>♧ Need a hint?</h3>
          <p>
            {solution
              ? "f=1, fₓ=0, fᵧ=1, so z=1+y."
              : hint
                ? "Compute f, fₓ, fᵧ first, then plug into the tangent plane formula."
                : "Use the point shifts (x-1) and (y-0)."}
          </p>
        </aside>
      </section>
      <nav className="tp424-adjacent">
        <button>
          ← <small>Previous</small>
          <b>Gradient Vector</b>
        </button>
        <button>☷ Back to Lesson List</button>
        <button>
          <small>Next</small>
          <b>Normal Vector</b> →
        </button>
      </nav>
    </section>
  );
}
function TangentCanvas({
  point,
  zoomed,
  onPoint,
  onOrbit,
}: {
  point: Point;
  zoomed: boolean;
  onPoint: (p: Point) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false),
    surface = useMemo(() => surfaceGeometry(), []),
    plane = useMemo(() => planeGeometry(point, zoomed), [point, zoomed]),
    z0 = fn(point.a, point.b),
    move = (e: ThreeEvent<PointerEvent>) => {
      if (!drag) return;
      e.stopPropagation();
      onPoint({
        a: Math.max(-Math.PI, Math.min(Math.PI, e.point.x)),
        b: Math.max(-Math.PI, Math.min(Math.PI, e.point.z)),
      });
    };
  return (
    <Canvas
      camera={{ position: zoomed ? [2.2, 1.6, 2.4] : [6, 4.3, 7], fov: 43 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#071b38"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 7, 5]} intensity={1.8} />
      <gridHelper args={[7, 14, "#344f6c", "#18334f"]} />
      <axesHelper args={[3.6]} />
      <mesh geometry={surface}>
        <meshStandardMaterial color="#3b75df" vertexColors side={DoubleSide} />
      </mesh>
      <mesh geometry={surface}>
        <meshBasicMaterial
          color="#70a8e8"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      <mesh geometry={plane}>
        <meshStandardMaterial
          color="#6ae1d6"
          transparent
          opacity={0.58}
          side={DoubleSide}
        />
      </mesh>
      <LineDrop point={point} />
      <Html position={[3.45, 0, 0]} style={{ pointerEvents: "none" }}>
        <b className="tp424-axis">x</b>
      </Html>
      <Html position={[0, 1.45, 0]} style={{ pointerEvents: "none" }}>
        <b className="tp424-axis">z</b>
      </Html>
      <Html position={[0, 0, 3.45]} style={{ pointerEvents: "none" }}>
        <b className="tp424-axis">y</b>
      </Html>
      <mesh
        position={[point.a, z0, point.b]}
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
        <sphereGeometry args={[0.16, 20, 14]} />
        <meshStandardMaterial color="#0aaee1" />
        <Html position={[0.25, 0.25, 0]} style={{ pointerEvents: "none" }}>
          <b className="tp424-label">
            P(a,b,f(a,b))
            <br />
            (a,b)=({fix(point.a, 2)},{fix(point.b, 2)})
          </b>
        </Html>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <OrbitControls enabled={!drag} target={[0, 0, 0]} onStart={onOrbit} />
    </Canvas>
  );
}
function surfaceGeometry() {
  const n = 52,
    pos: number[] = [],
    colors: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++) {
      const x = -Math.PI + (2 * Math.PI * i) / n,
        y = -Math.PI + (2 * Math.PI * j) / n,
        z = fn(x, y);
      pos.push(x, z, y);
      colors.push(
        0.22 + 0.25 * (z + 1),
        0.45 + 0.25 * (z + 1),
        0.8 - 0.2 * (z + 1),
      );
    }
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const p = j * (n + 1) + i;
      idx.push(p, p + 1, p + n + 1, p + 1, p + n + 2, p + n + 1);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(colors, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function planeGeometry(p: Point, small: boolean) {
  const q = parts(p.a, p.b),
    z0 = fn(p.a, p.b),
    d = small ? 0.55 : 1.35,
    pos = [
      p.a - d,
      z0 - q.fx * d - q.fy * d,
      p.b - d,
      p.a + d,
      z0 + q.fx * d - q.fy * d,
      p.b - d,
      p.a - d,
      z0 - q.fx * d + q.fy * d,
      p.b + d,
      p.a + d,
      z0 + q.fx * d + q.fy * d,
      p.b + d,
    ],
    g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex([0, 1, 2, 1, 3, 2]);
  g.computeVertexNormals();
  return g;
}
function LineDrop({ point: p }: { point: Point }) {
  return (
    <>
      <mesh position={[p.a, fn(p.a, p.b) / 2, p.b]}>
        <cylinderGeometry args={[0.008, 0.008, Math.abs(fn(p.a, p.b)), 6]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </>
  );
}
function Comparison() {
  return (
    <svg viewBox="0 0 280 100">
      <path
        d="M10 76Q50 28 100 70T140 52"
        fill="none"
        stroke="#a45bd3"
        strokeWidth="6"
      />
      <path
        d="M142 76Q180 28 230 70T275 52"
        fill="none"
        stroke="#55b9db"
        strokeWidth="6"
      />
      <path d="M45 28L118 42L77 76Z" fill="#69c8e5aa" />
      <path d="M178 42L250 57L211 84Z" fill="#69c8e5aa" />
      <text x="40" y="18" fill="#d33">
        Wrong ×
      </text>
      <text x="184" y="18" fill="#15914e">
        Correct ✓
      </text>
    </svg>
  );
}
