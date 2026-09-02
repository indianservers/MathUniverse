import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CylindricalCoordinatesTargetLesson418.css";

type Cylindrical = { r: number; theta: number; z: number };
type Cartesian = { x: number; y: number; z: number };
const initial: Cylindrical = { r: 3.61, theta: 40, z: 2 };
const toCartesian = ({ r, theta, z }: Cylindrical): Cartesian => {
  const a = (theta * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a), z };
};
const toCylindrical = ({ x, y, z }: Cartesian): Cylindrical => {
  const a = (Math.atan2(y, x) * 180) / Math.PI;
  return { r: Math.hypot(x, y), theta: a < 0 ? a + 360 : a, z };
};
const fixed = (n: number, digits = 2) => Number(n.toFixed(digits));

export default function CylindricalCoordinatesTargetLesson418({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [cyl, setCyl] = useState(initial),
    [mode, setMode] = useState<"cylindrical" | "cartesian">("cylindrical"),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [answer, setAnswer] = useState({ r: "", theta: "", z: "" }),
    [graded, setGraded] = useState(false),
    [actions, setActions] = useState(0);
  const cart = useMemo(() => toCartesian(cyl), [cyl]);
  const correct =
    Math.abs(Number(answer.r) - 5) < 0.02 &&
    Math.abs(Number(answer.theta) - 126.87) < 0.15 &&
    Math.abs(Number(answer.z) - 2) < 0.02;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
    onInteraction();
  };
  const update = (key: keyof Cylindrical, value: number) =>
    act(() => setCyl((old) => ({ ...old, [key]: value })));
  const reset = () => {
    setCyl(initial);
    setMode("cylindrical");
    setTab("Interact");
    setAnswer({ r: "", theta: "", z: "" });
    setGraded(false);
    setActions(0);
    setViewKey((n) => n + 1);
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page cc418-page"
      data-testid="geometry3d-mockup-0603"
      data-lesson-title="Cylindrical Coordinates"
      data-guidance="Drag surface point P or adjust radius, angle, and height."
      data-object-model="threejs-dedicated-draggable-cylindrical-point-bidirectional-coordinate-converter-radius-angle-height-cylinder-projections-graded-conversion"
      data-direct-interaction="true"
      data-r={fixed(cyl.r)}
      data-theta={fixed(cyl.theta)}
      data-z={fixed(cyl.z)}
      data-x={fixed(cart.x)}
      data-y={fixed(cart.y)}
      data-mode={mode}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="cc418-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>Cylindrical Coordinates ☆</h1>
          <p>Use radius-angle-height systems.</p>
          <h3>Objective</h3>
          <p>
            Convert between cylindrical coordinates (r, θ, z) and Cartesian
            coordinates (x, y, z) using an interactive 3D model.
          </p>
        </section>
        <aside>
          {[
            ["Level", "Grade 11-12"],
            ["Duration", "6-10 min"],
            ["Skills", "3D Geometry, Coordinate Conversion"],
            ["Prerequisites", "Cartesian Coordinates, Trigonometry"],
          ].map(([a, b]) => (
            <span key={a}>
              <b>{a}</b>
              {b}
            </span>
          ))}
        </aside>
      </header>
      <nav className="cc418-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
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
      <section className="cc418-lab">
        <header>
          <h2>♧ Interact & Explore</h2>
          <p>
            Drag the point or adjust the controls. Read the linked values update
            instantly.
          </p>
        </header>
        <div className="cc418-work">
          <article className="cc418-canvas">
            <CoordinateCanvas
              key={viewKey}
              cylindrical={cyl}
              onChange={(next) => act(() => setCyl(next))}
              onOrbit={onInteraction}
            />
            <button
              aria-label="Reset 3D view"
              onClick={() => act(() => setViewKey((n) => n + 1))}
            >
              ↗
            </button>
            <span>ⓘ Drag point P to move in space.</span>
          </article>
          <aside>
            <h3>Adjust Controls</h3>
            {(["r", "theta", "z"] as const).map((key) => (
              <label key={key}>
                <b>
                  {key === "r"
                    ? "Radius r"
                    : key === "theta"
                      ? "Angle θ (degrees)"
                      : "Height z"}
                  <output>
                    {key === "theta" ? `${fixed(cyl[key])}°` : fixed(cyl[key])}
                  </output>
                </b>
                <input
                  aria-label={
                    key === "r"
                      ? "Radius r"
                      : key === "theta"
                        ? "Angle theta"
                        : "Height z"
                  }
                  type="range"
                  min={key === "theta" ? 0 : key === "z" ? -6 : 0}
                  max={key === "theta" ? 360 : key === "z" ? 6 : 8}
                  step={key === "theta" ? 1 : 0.01}
                  value={cyl[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                />
                <small>
                  {key === "theta" ? "0°" : key === "z" ? "-6" : "0"}
                  <i>{key === "theta" ? "360°" : key === "z" ? "6" : "8"}</i>
                </small>
              </label>
            ))}
            <section className="cc418-values">
              <h3>Cylindrical Coordinates (r, θ, z)</h3>
              <div>
                <b>r = {fixed(cyl.r)}</b>
                <b>θ = {fixed(cyl.theta)}°</b>
                <b>z = {fixed(cyl.z)}</b>
              </div>
              <h3>Cartesian Coordinates (x, y, z)</h3>
              <div>
                <b>x = {fixed(cart.x)}</b>
                <b>y = {fixed(cart.y)}</b>
                <b>z = {fixed(cart.z)}</b>
              </div>
            </section>
            <section className="cc418-convert">
              <h3>Convert From</h3>
              <button
                className={mode === "cylindrical" ? "active" : ""}
                onClick={() => act(() => setMode("cylindrical"))}
              >
                Cylindrical
                <br />
                (r, θ, z)
              </button>
              <button
                aria-label="Swap conversion"
                onClick={() =>
                  act(() =>
                    setMode(
                      mode === "cylindrical" ? "cartesian" : "cylindrical",
                    ),
                  )
                }
              >
                ⇄
              </button>
              <button
                className={mode === "cartesian" ? "active" : ""}
                onClick={() => act(() => setMode("cartesian"))}
              >
                Cartesian
                <br />
                (x, y, z)
              </button>
              <p>Conversions update automatically.</p>
            </section>
          </aside>
        </div>
      </section>
      <section className="cc418-steps">
        {[
          ["◉", "1 Observe", "Watch how r, θ, z locate the point."],
          ["♧", "2 Manipulate", "Drag P or adjust controls."],
          ["⠿", "3 Notice the pattern", "See how values change."],
          ["▣", "4 Understand the rule", "Learn the conversion formulas."],
          ["◎", "5 Try independently", "Solve the challenge problem."],
        ].map(([i, h, p]) => (
          <article key={h}>
            <i>{i}</i>
            <b>{h}</b>
            <span>{p}</span>
          </article>
        ))}
      </section>
      <section className="cc418-middle">
        <article>
          <h2>◉ Worked Example</h2>
          <p>
            Convert cylindrical coordinates (r, θ, z) = (5, 30°, -2) to
            Cartesian.
          </p>
          <h3>Solution</h3>
          <ul>
            <li>x = r cos θ = 5 cos 30° = 5√3/2 ≈ 4.330</li>
            <li>y = r sin θ = 5 sin 30° = 5/2 = 2.500</li>
            <li>z = -2</li>
          </ul>
          <strong>
            Therefore, (x, y, z) = (5√3/2, 2.5, -2) ≈ (4.330, 2.500, -2.000)
          </strong>
        </article>
        <article>
          <h2>☆ Key Rule / Definition</h2>
          <p>
            Cylindrical coordinates (r, θ, z) relate to Cartesian (x, y, z) as:
          </p>
          <div>
            <b>Cylindrical → Cartesian</b>
            <output>
              x = r cos θ<br />y = r sin θ<br />z = z
            </output>
          </div>
          <div>
            <b>Cartesian → Cylindrical</b>
            <output>
              r = √(x²+y²)
              <br />θ = atan2(y,x)
              <br />z = z
            </output>
          </div>
          <small>Here, atan2(y, x) returns the correct quadrant for θ.</small>
        </article>
      </section>
      <section className="cc418-bottom">
        <article>
          <h2>△ Common Misconception</h2>
          <p>Mixing up sine and cosine.</p>
          <ProjectionDiagram />
          <strong>
            ✓ Tip: x uses cos θ (adjacent), y uses sin θ (opposite).
          </strong>
        </article>
        <article>
          <h2>◎ Your Turn: Challenge</h2>
          <p>Convert (x, y, z) = (-3, 4, 2) to cylindrical coordinates.</p>
          <h3>Your Answer</h3>
          <div className="cc418-answer">
            {(["r", "theta", "z"] as const).map((key) => (
              <label key={key}>
                {key === "theta" ? "θ" : key} ={" "}
                <input
                  aria-label={`Challenge ${key}`}
                  value={answer[key]}
                  onChange={(e) =>
                    act(() => {
                      setAnswer((old) => ({ ...old, [key]: e.target.value }));
                      setGraded(false);
                    })
                  }
                />
                {key === "theta" && "°"}
              </label>
            ))}
          </div>
          <button
            className="cc418-check"
            onClick={() => act(() => setGraded(true))}
          >
            Check Answer
          </button>
          <button
            className="cc418-plot"
            onClick={() =>
              act(() => setCyl(toCylindrical({ x: -3, y: 4, z: 2 })))
            }
          >
            ◇ Plot This Point
          </button>
          <strong className={graded ? (correct ? "correct" : "wrong") : ""}>
            {graded
              ? correct
                ? "Correct: (5, 126.87°, 2)."
                : "Check r = √(x²+y²) and use atan2(y,x)."
              : "Hint: r = √(x²+y²), θ = atan2(y,x), z = z."}
          </strong>
        </article>
      </section>
      <nav className="cc418-adjacent">
        <button>
          ← <small>Previous Lesson</small>
          <b>Quadric Surfaces</b>
        </button>
        <button>
          <small>Next Lesson</small>
          <b>Spherical Coordinates</b> →
        </button>
      </nav>
      <footer>
        <b>⚒ Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
      </footer>
    </section>
  );
}

function CoordinateCanvas({
  cylindrical,
  onChange,
  onOrbit,
}: {
  cylindrical: Cylindrical;
  onChange: (value: Cylindrical) => void;
  onOrbit: () => void;
}) {
  const [dragging, setDragging] = useState(false),
    point = toCartesian(cylindrical),
    p: [number, number, number] = [point.x, point.z, point.y],
    radial: [number, number, number] = [point.x, 0, point.y],
    arc = Array.from({ length: 25 }, (_, i) => {
      const a = (((cylindrical.theta * Math.PI) / 180) * i) / 24;
      return [1.1 * Math.cos(a), 0.03, 1.1 * Math.sin(a)] as [
        number,
        number,
        number,
      ];
    });
  const move = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    e.stopPropagation();
    const r = Math.min(8, Math.hypot(e.point.x, e.point.z)),
      theta = ((Math.atan2(e.point.z, e.point.x) * 180) / Math.PI + 360) % 360;
    onChange({ r, theta, z: cylindrical.z });
  };
  return (
    <Canvas
      camera={{ position: [8, 6, 9], fov: 43 }}
      onPointerUp={() => setDragging(false)}
    >
      <color attach="background" args={["#061b3b"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 7, 5]} intensity={1.7} />
      <gridHelper args={[11, 22, "#183f66", "#102d50"]} />
      <axesHelper args={[5.2]} />
      <mesh position={[0, cylindrical.z / 2, 0]}>
        <cylinderGeometry
          args={[
            cylindrical.r,
            cylindrical.r,
            Math.abs(cylindrical.z) || 0.02,
            64,
            1,
            true,
          ]}
        />
        <meshBasicMaterial
          color="#269fe7"
          transparent
          opacity={0.13}
          side={DoubleSide}
        />
      </mesh>
      <Line points={[[0, 0, 0], radial, p]} color="#d9e5f4" lineWidth={1} />
      <Line
        points={[[point.x, 0, point.y], p]}
        color="#16e2e4"
        lineWidth={2}
        dashed
      />
      <Line points={arc} color="#b84df1" lineWidth={3} />
      <mesh
        position={p}
        onPointerDown={(e) => {
          e.stopPropagation();
          setDragging(true);
          onOrbit();
        }}
      >
        <sphereGeometry args={[0.18, 24, 18]} />
        <meshStandardMaterial
          color="#21e2e4"
          emissive="#087c91"
          emissiveIntensity={0.8}
        />
        <Html position={[0.25, 0.28, 0]}>
          <b className="cc418-p-label">P</b>
        </Html>
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={move}
        onPointerUp={() => setDragging(false)}
      >
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html position={[point.x / 2, 0.25, point.y / 2]}>
        <b className="cc418-r-label">r = {fixed(cylindrical.r)}</b>
      </Html>
      <Html position={[1, 0.15, 0.35]}>
        <b className="cc418-theta-label">θ = {fixed(cylindrical.theta)}°</b>
      </Html>
      <Html position={[point.x + 0.3, cylindrical.z / 2, point.y]}>
        <b className="cc418-z-label">z = {fixed(cylindrical.z)}</b>
      </Html>
      <OrbitControls enabled={!dragging} onStart={onOrbit} />
    </Canvas>
  );
}
function ProjectionDiagram() {
  return (
    <svg
      className="cc418-diagram"
      viewBox="0 0 260 125"
      aria-label="Sine and cosine projection diagram"
    >
      <path d="M34 103H226M70 115V12" stroke="#53627c" />
      <path d="M70 103L180 28V103Z" fill="#eff8ff" stroke="#2484ef" />
      <circle cx="180" cy="28" r="4" fill="#13a66b" />
      <text x="233" y="107">
        x
      </text>
      <text x="64" y="14">
        y
      </text>
      <text x="120" y="55" fill="#2484ef">
        r
      </text>
      <text x="116" y="116" fill="#e64d4d">
        r cos θ
      </text>
      <text x="186" y="69" fill="#15914f">
        r sin θ
      </text>
      <text x="92" y="95">
        θ
      </text>
    </svg>
  );
}
