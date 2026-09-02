import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./QuadricSurfacesTargetLesson417.css";

type Coeff = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
};
type Kind =
  | "Ellipsoid"
  | "Hyperboloid (1-sheet)"
  | "Hyperboloid (2-sheet)"
  | "Elliptic Cone"
  | "Elliptic Paraboloid";
const initial: Coeff = { A: 1, B: 1, C: 1, D: 0, E: 0, F: 0, G: -1 };
const presets: Record<Kind, Coeff> = {
  Ellipsoid: initial,
  "Hyperboloid (1-sheet)": { A: -1, B: -1, C: 1, D: 0, E: 0, F: 0, G: 4 },
  "Hyperboloid (2-sheet)": { A: -1, B: -1, C: 1, D: 0, E: 0, F: 0, G: -1 },
  "Elliptic Cone": { A: 1, B: 1, C: -1, D: 0, E: 0, F: 0, G: 0 },
  "Elliptic Paraboloid": { A: 1, B: 1, C: 0, D: 0, E: 0, F: -1, G: 0 },
};
export default function QuadricSurfacesTargetLesson417({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [coef, setCoef] = useState(initial),
    [layers, setLayers] = useState({
      axes: true,
      planes: true,
      traces: true,
      grid: false,
    }),
    [tab, setTab] = useState("Interact"),
    [choice, setChoice] = useState("B"),
    [graded, setGraded] = useState(true),
    [viewKey, setViewKey] = useState(0),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setCoef(initial);
      setLayers({ axes: true, planes: true, traces: true, grid: false });
      setTab("Interact");
      setChoice("B");
      setGraded(true);
      setViewKey((n) => n + 1);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const analysis = classify(coef),
    set = (key: keyof Coeff, value: number) =>
      act(() => setCoef((c) => ({ ...c, [key]: value }))),
    choosePreset = (kind: Kind) => act(() => setCoef(presets[kind]));
  return (
    <section
      className="cs378-page qs417-page"
      data-testid="geometry3d-mockup-0602"
      data-lesson-title="Quadric Surfaces"
      data-guidance="Quadric surfaces are second-degree equations. Drag surface to rotate."
      data-object-model="threejs-dedicated-quadratic-coefficient-classifier-completing-square-quadric-presets-coordinate-traces-layers-graded-challenge"
      data-direct-interaction="true"
      data-kind={analysis.kind}
      data-center={analysis.center.join(",")}
      data-value={round(analysis.value)}
      data-bounded={analysis.bounded}
      data-choice={choice}
      data-graded={graded}
      data-actions={actions}
    >
      <header className="qs417-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>Quadric Surfaces</h1>
          <p>
            <b>Objective:</b> Classify and visualize quadric surfaces using the
            equation
          </p>
          <output>Ax² + By² + Cz² + Dx + Ey + Fz + G = 0.</output>
        </section>
        <aside>
          <span>
            Level<b>11-12 / UG</b>
          </span>
          <span>
            Time<b>15-20 min</b>
          </span>
          <span>
            Activity<b>Interact • Reason • Apply</b>
          </span>
          <button onClick={() => act(() => setTab("Interact"))}>
            ⊕ Add to Workspace
          </button>
        </aside>
      </header>
      <nav className="qs417-tabs">
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
      <section className="qs417-lab">
        <header>
          <div>
            <h2>Rotatable Quadric Classifier</h2>
            <p>
              Rotate, change coefficients, and see how the surface and traces
              change. The classifier updates instantly.
            </p>
          </div>
          <nav>
            {(["axes", "planes", "traces", "grid"] as const).map((key) => (
                <button
                  key={key}
                  aria-label={key}
                  className={layers[key] ? "active" : ""}
                onClick={() =>
                  act(() => setLayers((x) => ({ ...x, [key]: !x[key] })))
                }
              >
                <i>
                  {key === "axes"
                    ? "⌘"
                    : key === "planes"
                      ? "□"
                      : key === "traces"
                        ? "○"
                        : "⌗"}
                </i>
                {key}
              </button>
            ))}
            <button
              aria-label="Reset 3D view"
              onClick={() => act(() => setViewKey((n) => n + 1))}
            >
              ↻
            </button>
          </nav>
          <select
            aria-label="Quadric preset"
            value={analysis.kind}
            onChange={(e) => choosePreset(e.target.value as Kind)}
          >
            {Object.keys(presets).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </header>
        <section className="qs417-work">
          <article>
            <div className="qs417-canvas">
              <QuadricCanvas
                key={viewKey}
                kind={analysis.kind}
                layers={layers}
                onInteraction={onInteraction}
              />
              <button
                className="qs417-viewcube"
                aria-label="Reset orientation"
                onClick={() => act(() => setViewKey((n) => n + 1))}
              >
                <span>◇</span>
              </button>
              <div className="qs417-legend">
                <span>xy-plane</span>
                <span>xz-plane</span>
                <span>yz-plane</span>
              </div>
            </div>
            <small>
              Drag surface to rotate • Scroll to zoom • Double-click to reset
              view
            </small>
            <section className="qs417-traces">
              <h3>Traces (cross-sections)</h3>
              {["xy", "xz", "yz"].map((axis) => (
                <article key={axis}>
                  <b>
                    In {axis}-plane (
                    {axis === "xy"
                      ? "z = 0"
                      : axis === "xz"
                        ? "y = 0"
                        : "x = 0"}
                    )
                  </b>
                  <i>{traceEquation(axis, analysis.kind)}</i>
                  <strong>{traceName(axis, analysis.kind)}</strong>
                  <TraceIcon kind={analysis.kind} axis={axis} />
                </article>
              ))}
            </section>
          </article>
          <aside>
            <article className="qs417-coeff">
              <h3>
                Equation Coefficients <i>ⓘ</i>
              </h3>
              {(Object.keys(initial) as (keyof Coeff)[]).map((key) => (
                <label key={key}>
                  <b>
                    {key}{" "}
                    {key === "A"
                      ? "(x²)"
                      : key === "B"
                        ? "(y²)"
                        : key === "C"
                          ? "(z²)"
                          : key === "D"
                            ? "(x)"
                            : key === "E"
                              ? "(y)"
                              : key === "F"
                                ? "(z)"
                                : ""}
                  </b>
                  <input
                    aria-label={`${key} coefficient value`}
                    type="number"
                    min="-5"
                    max="5"
                    step="1"
                    value={coef[key]}
                    onChange={(e) => set(key, Number(e.target.value))}
                  />
                  <input
                    aria-label={`${key} coefficient`}
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={coef[key]}
                    onChange={(e) => set(key, Number(e.target.value))}
                  />
                </label>
              ))}
            </article>
            <article className="qs417-class">
              <h3>
                Surface Classification <b>{analysis.kind}</b>
              </h3>
              <p>Sign pattern (A, B, C, completed constant)</p>
              <div>
                {[coef.A, coef.B, coef.C, analysis.value].map((n, i) => (
                  <i key={i}>{n >= 0 ? "+" : "-"}</i>
                ))}
              </div>
              <p>{analysis.reason}</p>
              <strong>
                {analysis.bounded
                  ? "Bounded • Closed surface"
                  : "Unbounded surface"}
              </strong>
            </article>
            <article className="qs417-values">
              <h3>Key Values</h3>
              <span>
                Center <b>({analysis.center.map(format).join(", ")})</b>
              </span>
              <span>
                Semi-axes{" "}
                <b>
                  {analysis.kind === "Ellipsoid"
                    ? "a = 1, b = 1, c = 1"
                    : "depends on coefficients"}
                </b>
              </span>
              <span>
                Intercepts{" "}
                <b>
                  {analysis.kind === "Ellipsoid"
                    ? "(±1,0,0), (0,±1,0), (0,0,±1)"
                    : "see traces"}
                </b>
              </span>
              <span>
                Type <b>{analysis.bounded ? "Closed" : "Open"}</b>
              </span>
            </article>
          </aside>
        </section>
      </section>
      <section className="qs417-middle">
        <article>
          <h3>● Notice the pattern</h3>
          <ul>
            <li>All three squared terms have the same sign.</li>
            <li>The constant term G has the opposite sign.</li>
            <li>The surface is closed and bounded.</li>
            <li>Traces in the coordinate planes are ellipses or circles.</li>
          </ul>
        </article>
        <article>
          <h3>⌁ Understand the rule</h3>
          <p>
            For Ax²+By²+Cz²+Dx+Ey+Fz+G=0 (after completing squares to remove
            linear terms):
          </p>
          <table>
            <tbody>
              <tr>
                <th>Type</th>
                <th>Condition on A, B, C</th>
                <th>Condition on G</th>
              </tr>
              <tr>
                <td>Ellipsoid</td>
                <td>Same sign</td>
                <td>Opposite sign</td>
              </tr>
              <tr>
                <td>Hyperboloid (1-sheet)</td>
                <td>Same sign, one opposite</td>
                <td>Same sign</td>
              </tr>
              <tr>
                <td>Hyperboloid (2-sheet)</td>
                <td>Two same, one opposite</td>
                <td>Any</td>
              </tr>
              <tr>
                <td>Elliptic Cone</td>
                <td>Mixed signs</td>
                <td>G = 0</td>
              </tr>
              <tr>
                <td>Elliptic Paraboloid</td>
                <td>Same sign</td>
                <td>G = 0 and one linear term</td>
              </tr>
            </tbody>
          </table>
        </article>
        <article className="qs417-misconception">
          <h3>△ Common misconception</h3>
          <p>
            Don't decide only by G.
            <br />
            The relative signs of <b>A, B, C</b> are equally important.
          </p>
          <div>
            <span>
              <b>Correct</b>
              <small>A&gt;0, B&gt;0, C&gt;0, G&lt;0</small>
              <TraceIcon kind="Ellipsoid" axis="xy" />
            </span>
            <span>
              <b>Wrong</b>
              <small>
                A&gt;0, B&gt;0, C&gt;0
                <br />
                (ignoring G)
              </small>
              <i>×</i>
            </span>
          </div>
        </article>
      </section>
      <section className="qs417-bottom">
        <article>
          <h3>Worked Example</h3>
          <p>Classify and sketch 4x² + y² + 9z² − 36 = 0</p>
          <b>Step 1: Identify coefficients</b>
          <p>A=4&gt;0, B=1&gt;0, C=9&gt;0, G=-36&lt;0</p>
          <b>Step 2: Apply the rule</b>
          <p>
            All squared coefficients are positive and G&lt;0.
            <br />⇒ Ellipsoid.
          </p>
          <b>Step 3: Standard form</b>
          <output>x²/9 + y²/36 + z²/4 = 1</output>
          <b>Step 4: Semi-axes and intercepts</b>
          <p>
            {" "}
            a = 3, b = 6, c = 2<br />
            Intercepts: (±3,0,0), (0,±6,0), (0,0,±2)
          </p>
          <div className="qs417-example-sketch">
            <TraceIcon kind="Ellipsoid" axis="xy" />
            <i>x</i>
            <i>y</i>
            <i>z</i>
          </div>
        </article>
        <article>
          <h3>Try independently:</h3>
          <p>Use the classifier to determine the type of the quadric.</p>
          <output>-x² - y² + z² + 4 = 0</output>
          {[
            ["A", "Ellipsoid"],
            ["B", "Hyperboloid (1-sheet)"],
            ["C", "Hyperboloid (2-sheet)"],
            ["D", "Elliptic Paraboloid"],
          ].map(([k, v]) => (
            <button
              key={k}
              className={choice === k ? (k === "B" ? "correct" : "wrong") : ""}
              onClick={() =>
                act(() => {
                  setChoice(k);
                  setGraded(false);
                })
              }
            >
              <i>{k}</i>
              {v}
            </button>
          ))}
          <button
            className="qs417-check"
            onClick={() => act(() => setGraded(true))}
          >
            Check answer
          </button>
          {graded && (
            <strong className={choice === "B" ? "correct" : "wrong"}>
              {choice === "B"
                ? "✓ Correct! This is a hyperboloid of one sheet."
                : "Try again: compare the squared signs."}
            </strong>
          )}
        </article>
      </section>
      <nav className="qs417-adjacent">
        <button>
          ← <small>PREVIOUS LESSON</small>
          <b>Space Curves</b>
        </button>
        <button>All Lessons</button>
        <button>
          <small>NEXT LESSON</small>
          <b>Cylindrical Coordinates</b> →
        </button>
      </nav>
    </section>
  );
}
function classify(c: Coeff) {
  const center = [
      c.A ? -c.D / (2 * c.A) : 0,
      c.B ? -c.E / (2 * c.B) : 0,
      c.C ? -c.F / (2 * c.C) : 0,
    ],
    value =
      c.G -
      (c.A ? (c.D * c.D) / (4 * c.A) : 0) -
      (c.B ? (c.E * c.E) / (4 * c.B) : 0) -
      (c.C ? (c.F * c.F) / (4 * c.C) : 0);
  let kind: Kind = "Ellipsoid",
    reason =
      "All squared coefficients have the same sign and the completed constant has the opposite sign.",
    bounded = true;
  const sq = [c.A, c.B, c.C],
    nonzero = sq.filter((n) => n !== 0),
    pos = nonzero.filter((n) => n > 0).length,
    neg = nonzero.filter((n) => n < 0).length;
  if (nonzero.length < 3) {
    kind = "Elliptic Paraboloid";
    reason =
      "One squared term is missing while its linear term controls the opening.";
    bounded = false;
  } else if (Math.abs(value) < 1e-9 && pos && neg) {
    kind = "Elliptic Cone";
    reason = "Mixed squared signs meet at completed level zero.";
    bounded = false;
  } else if (pos && neg) {
    const majorityPositive = pos > neg;
    const rhs = -value;
    const majorityOnPositiveSide = majorityPositive ? rhs > 0 : rhs < 0;
    kind = majorityOnPositiveSide
      ? "Hyperboloid (1-sheet)"
      : "Hyperboloid (2-sheet)";
    reason =
      "Two squared terms share one sign and the third has the opposite sign.";
    bounded = false;
  }
  return { kind, center, value, bounded, reason };
}
function QuadricCanvas({
  kind,
  layers,
  onInteraction,
}: {
  kind: Kind;
  layers: { axes: boolean; planes: boolean; traces: boolean; grid: boolean };
  onInteraction: () => void;
}) {
  return (
    <Canvas camera={{ position: [5, 4, 6], fov: 42 }}>
      <color attach="background" args={["#061a38"]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 7, 6]} intensity={1.8} />
      <gridHelper args={[7, 14, "#1b5875", "#163b59"]} />
      <QuadricMesh kind={kind} />
      {layers.grid && <gridHelper args={[7, 28, "#1680a0", "#123e61"]} />}{" "}
      {layers.axes && (
        <>
          <axesHelper args={[3.2]} />
          <AxisLabel position={[3.35, 0, 0]} label="x  3" color="#ff3855" />
          <AxisLabel position={[0, 3.35, 0]} label="z  3" color="#74d7ff" />
          <AxisLabel position={[0, 0, 3.35]} label="y  -3" color="#79e384" />
        </>
      )}{" "}
      {layers.planes && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial
              color="#13cad7"
              transparent
              opacity={0.055}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial
              color="#a840ec"
              transparent
              opacity={0.055}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
        </>
      )}{" "}
      {layers.traces && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.05, 1, 1]}>
            <torusGeometry args={[1.45, 0.016, 8, 96]} />
            <meshBasicMaterial color="#12d8df" />
          </mesh>
          <mesh>
            <torusGeometry args={[1.45, 0.016, 8, 96]} />
            <meshBasicMaterial color="#ba49f2" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.45, 0.016, 8, 96]} />
            <meshBasicMaterial color="#ff781e" />
          </mesh>
        </>
      )}
      <OrbitControls onStart={onInteraction} />
    </Canvas>
  );
}
function AxisLabel({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  return (
    <Html position={position} center>
      <b style={{ color, fontSize: 11, textShadow: "0 1px 2px #001" }}>
        {label}
      </b>
    </Html>
  );
}
function QuadricMesh({ kind }: { kind: Kind }) {
  if (kind === "Ellipsoid")
    return (
      <mesh scale={[1.35, 1.6, 1.15]}>
        <sphereGeometry args={[1, 42, 28]} />
        <meshStandardMaterial
          color="#52d987"
          transparent
          opacity={0.42}
          wireframe={false}
        />
      </mesh>
    );
  if (kind === "Elliptic Cone")
    return (
      <mesh>
        <coneGeometry args={[2, 4, 48, 16, true]} />
        <meshStandardMaterial
          color="#42cdd0"
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>
    );
  if (kind === "Elliptic Paraboloid")
    return (
      <mesh geometry={revolved("paraboloid")}>
        <meshStandardMaterial
          color="#40bddc"
          transparent
          opacity={0.58}
          wireframe
        />
      </mesh>
    );
  return (
    <mesh geometry={revolved(kind.includes("1-sheet") ? "one" : "two")}>
      <meshStandardMaterial
        color="#57d69b"
        transparent
        opacity={0.5}
        wireframe
      />
    </mesh>
  );
}
function revolved(kind: "paraboloid" | "one" | "two") {
  const n = 45,
    m = 34,
    pos: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= m; j++) {
    const z = -2.5 + (5 * j) / m,
      r =
        kind === "paraboloid"
          ? Math.sqrt(Math.max(0, z + 2.5))
          : kind === "one"
            ? Math.sqrt(1 + (z * z) / 2)
            : Math.sqrt(Math.max(0.05, z * z - 1));
    for (let i = 0; i <= n; i++) {
      const a = (2 * Math.PI * i) / n;
      pos.push(r * Math.cos(a), z, r * Math.sin(a));
    }
  }
  for (let j = 0; j < m; j++)
    for (let i = 0; i < n; i++) {
      const p = j * (n + 1) + i;
      idx.push(p, p + 1, p + n + 1, p + 1, p + n + 2, p + n + 1);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function TraceIcon({ kind, axis }: { kind: Kind; axis: string }) {
  return (
    <svg viewBox="0 0 65 45">
      <ellipse
        cx="33"
        cy="23"
        rx="20"
        ry={kind.includes("Hyperboloid") && axis === "yz" ? 8 : 18}
        fill="none"
        stroke={
          axis === "xy" ? "#1fc4e1" : axis === "xz" ? "#aa45eb" : "#ff7b16"
        }
        strokeWidth="2"
        strokeDasharray={axis === "xz" ? "3 2" : "0"}
      />
    </svg>
  );
}
function traceEquation(axis: string, kind: Kind) {
  if (kind === "Ellipsoid")
    return axis === "xy" ? "x²+y²=1" : axis === "xz" ? "x²+z²=1" : "y²+z²=1";
  return kind.includes("Hyperboloid")
    ? `${axis[0]}²-${axis[1]}²=1`
    : `${axis[0]}²+${axis[1]}² trace`;
}
function traceName(axis: string, kind: Kind) {
  return kind === "Ellipsoid"
    ? "Circle"
    : kind.includes("Hyperboloid") && axis !== "xy"
      ? "Hyperbola"
      : "Conic";
}
function format(n: number) {
  return Math.abs(n) < 1e-8 ? "0" : n.toFixed(2);
}
function round(n: number) {
  return Number(n.toFixed(4));
}
