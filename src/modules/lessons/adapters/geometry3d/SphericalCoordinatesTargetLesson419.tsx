import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./SphericalCoordinatesTargetLesson419.css";

type Spherical = { rho: number; theta: number; phi: number };
const initial: Spherical = { rho: 3, theta: 45, phi: 60 },
  rad = (d: number) => (d * Math.PI) / 180,
  fix = (n: number) => Number(n.toFixed(2));
function cart(s: Spherical) {
  return {
    x: s.rho * Math.sin(rad(s.phi)) * Math.cos(rad(s.theta)),
    y: s.rho * Math.sin(rad(s.phi)) * Math.sin(rad(s.theta)),
    z: s.rho * Math.cos(rad(s.phi)),
  };
}
export default function SphericalCoordinatesTargetLesson419({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [s, setS] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [answer, setAnswer] = useState({ x: "", y: "", z: "" }),
    [graded, setGraded] = useState(false),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0),
    c = useMemo(() => cart(s), [s]),
    expected = cart({ rho: 5, theta: 210, phi: 45 }),
    correct =
      Math.abs(Number(answer.x) - expected.x) < 0.03 &&
      Math.abs(Number(answer.y) - expected.y) < 0.03 &&
      Math.abs(Number(answer.z) - expected.z) < 0.03,
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    update = (key: keyof Spherical, n: number) =>
      act(() => setS((old) => ({ ...old, [key]: n }))),
    reset = () => {
      setS(initial);
      setTab("Interact");
      setAnswer({ x: "", y: "", z: "" });
      setGraded(false);
      setHint(false);
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page sc419-page"
      data-testid="geometry3d-mockup-0604"
      data-lesson-title="Spherical Coordinates"
      data-guidance="Drag surface point P on the sphere or adjust radius and angles."
      data-object-model="threejs-dedicated-draggable-sphere-point-rho-azimuth-polar-angle-cartesian-conversion-guides-graded-coordinate-challenge"
      data-direct-interaction="true"
      data-rho={fix(s.rho)}
      data-theta={fix(s.theta)}
      data-phi={fix(s.phi)}
      data-x={fix(c.x)}
      data-y={fix(c.y)}
      data-z={fix(c.z)}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="sc419-hero">
        <section>
          <small>3D MATHEMATICS | 3D FUNCTIONS AND SURFACES</small>
          <h1>Spherical Coordinates</h1>
          <p>Use radius and two angles.</p>
          <div>
            <b>
              ♙ Level<small>Advanced</small>
            </b>
            <b>
              ⏱ Length<small>6-10 min</small>
            </b>
            <b>
              ☼ Focus<small>Spherical coordinates in R³</small>
            </b>
          </div>
        </section>
        <aside>
          <h3>Objective</h3>
          <p>
            Understand and use spherical coordinates (ρ, θ, φ) to represent
            points in 3D, convert to Cartesian coordinates, and interpret θ
            (azimuth) and φ (polar angle).
          </p>
        </aside>
      </header>
      <nav className="sc419-tabs">
        {[
          ["Interact", "Observe & Manipulate"],
          ["Learn", "Notice the pattern"],
          ["Worked Example", "See it in action"],
          ["Formula", "Understand the rule"],
          ["Practice", "Try independently"],
        ].map(([a, b]) => (
          <button
            key={a}
            className={tab === a ? "active" : ""}
            onClick={() => act(() => setTab(a))}
          >
            <b>{a}</b>
            <small>{b}</small>
          </button>
        ))}
      </nav>
      <section className="sc419-lab">
        <article className="sc419-canvas">
          <SphereCanvas
            key={viewKey}
            value={s}
            onChange={(next) => act(() => setS(next))}
            onOrbit={onInteraction}
          />
          <aside>
            <b>ρ &nbsp; Radial distance</b>
            <b>
              θ &nbsp; Azimuth angle
              <br />
              <small>(in xy-plane)</small>
            </b>
            <b>
              φ &nbsp; Polar angle
              <br />
              <small>(from +z axis)</small>
            </b>
          </aside>
          <p>
            Drag point P on the sphere
            <br />
            or adjust sliders.
          </p>
          <button onClick={() => act(() => setViewKey((n) => n + 1))}>
            ↻ Reset view
          </button>
        </article>
        <aside className="sc419-controls">
          <h2>Point P (ρ, θ, φ)</h2>
          {(["rho", "theta", "phi"] as const).map((key) => (
            <label key={key}>
              <b>
                {key === "rho"
                  ? "ρ (radius)"
                  : key === "theta"
                    ? "θ (azimuth)"
                    : "φ (polar angle)"}
              </b>
              <span>
                <input
                  aria-label={key}
                  type="range"
                  min={key === "rho" ? 0.1 : 0}
                  max={key === "rho" ? 10 : key === "theta" ? 360 : 180}
                  step={key === "rho" ? 0.01 : 1}
                  value={s[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                />
                <output>
                  {fix(s[key])}
                  {key !== "rho" && "°"}
                </output>
              </span>
            </label>
          ))}
          <section>
            <h3>Cartesian coordinates (x, y, z)</h3>
            <p>
              x = <output>{fix(c.x)}</output>
            </p>
            <p>
              y = <output>{fix(c.y)}</output>
            </p>
            <p>
              z = <output>{fix(c.z)}</output>
            </p>
            <b>Exact values</b>
            <p>x = 3√2/2 | y = 3√2/2 | z = 3√3/2</p>
          </section>
        </aside>
      </section>
      <section className="sc419-guides">
        <article>
          <h3>Angle guides</h3>
          <p>🟡 θ: {fix(s.theta)}° in xy-plane from +x toward +y</p>
          <p>🟣 φ: {fix(s.phi)}° from +z axis down to OP</p>
          <p>🔵 ρ: {fix(s.rho)} units from O to P</p>
        </article>
        <article>
          <h3>⚠ Convention matters!</h3>
          <p>
            φ is measured from the positive z-axis,
            <br />
            not from the xy-plane.
            <br />
            0° ≤ φ ≤ 180°.
          </p>
        </article>
        <article>
          <h3>ⓘ Common misconception</h3>
          <p>
            Do not measure φ from the xy-plane.
            <br />
            That would give z = ρ sin φ (incorrect).
          </p>
        </article>
      </section>
      <section className="sc419-rule">
        <article>
          <h3>Worked Example</h3>
          <p>
              <b>Given:</b> ρ=4, θ=30°, φ=60°
            <br />
            Convert to Cartesian coordinates.
          </p>
          <b>Solution:</b>
          <p>x = ρ sin φ cos θ = 4(√3/2)(√3/2) = 3</p>
          <p>y = ρ sin φ sin θ = 4(√3/2)(1/2) = √3</p>
          <p>z = ρ cos φ = 4(1/2) = 2</p>
          <strong>(x, y, z) = (3, √3, 2)</strong>
        </article>
        <article>
          <h3>Key Rule / Definition</h3>
          <p>
            Spherical coordinates (ρ, θ, φ) relate to Cartesian (x, y, z) by
          </p>
          <output>
            x = ρ sin φ cos θ<br />y = ρ sin φ sin θ<br />z = ρ cos φ
          </output>
          <p>Ranges: ρ ≥ 0, 0 ≤ θ &lt; 360°, 0 ≤ φ ≤ 180°.</p>
          <p>
            <b>Inverse:</b> ρ=√(x²+y²+z²), θ=atan2(y,x), φ=cos⁻¹(z/ρ).
          </p>
        </article>
      </section>
      <section className="sc419-challenge">
        <div>
          <h3>Try Independently</h3>
          <p>
            Find the Cartesian coordinates of the point with spherical
            coordinates
            <br />
            ρ=5, θ=210°, φ=45°.
          </p>
        </div>
        {(["x", "y", "z"] as const).map((key) => (
          <label key={key}>
            {key} = ?
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
          </label>
        ))}
        <button onClick={() => act(() => setGraded(true))}>Check</button>
        <button onClick={() => act(() => setHint((x) => !x))}>♧ Hint</button>
        {(graded || hint) && (
          <strong className={graded ? (correct ? "correct" : "wrong") : ""}>
            {graded
              ? correct
                ? "Correct."
                : "Use x=ρsinφcosθ, y=ρsinφsinθ, z=ρcosφ."
              : "Expected signs: x<0, y<0, z>0."}
          </strong>
        )}
      </section>
      <nav className="sc419-adjacent">
        <button>
          ← <small>Previous</small>
          <b>Cylindrical Coordinates</b>
        </button>
        <button>
          <small>Next</small>
          <b>Contour Curves</b> →
        </button>
      </nav>
    </section>
  );
}
function SphereCanvas({
  value,
  onChange,
  onOrbit,
}: {
  value: Spherical;
  onChange: (s: Spherical) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false),
    c = cart(value),
    p: [number, number, number] = [c.x, c.z, c.y],
    move = (e: ThreeEvent<PointerEvent>) => {
      if (!drag) return;
      e.stopPropagation();
      const v = e.point.clone().normalize();
      const phi = (Math.acos(Math.max(-1, Math.min(1, v.y))) * 180) / Math.PI,
        theta = ((Math.atan2(v.z, v.x) * 180) / Math.PI + 360) % 360;
      onChange({ ...value, theta, phi });
    };
  return (
    <Canvas
      camera={{ position: [6, 4.5, 7], fov: 42 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#061b3b"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 7, 5]} intensity={1.5} />
      <gridHelper args={[8, 16, "#274c70", "#173555"]} />
      <axesHelper args={[4.2]} />
      <mesh onPointerMove={move} onPointerUp={() => setDrag(false)}>
        <sphereGeometry args={[value.rho, 48, 32]} />
        <meshStandardMaterial
          color="#8aa9ca"
          transparent
          opacity={0.18}
          wireframe
          side={DoubleSide}
        />
      </mesh>
      <Line points={[[0, 0, 0], p]} color="#1ed8df" lineWidth={4} />
      <Line points={[[c.x, 0, c.y], p]} color="#fff" dashed />
      <mesh
        position={p}
        onPointerDown={(e) => {
          e.stopPropagation();
          setDrag(true);
          onOrbit();
        }}
      >
        <sphereGeometry args={[0.16, 24, 18]} />
        <meshStandardMaterial color="#1de0e4" />
        <Html position={[0.25, 0.2, 0]}>
          <b className="sc419-p">P</b>
        </Html>
      </mesh>
      <OrbitControls enabled={!drag} onStart={onOrbit} />
    </Canvas>
  );
}
