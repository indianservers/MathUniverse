import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./LevelSurfacesTargetLesson421.css";
type Style = "solid" | "wire" | "points" | "dotted";
const levels = [0.5, 1, 2, 4, 6],
  initial = {
    c: 2,
    style: "solid" as Style,
    axes: true,
    points: true,
    cross: false,
    labels: true,
  },
  fix = (n: number, d = 3) => Number(n.toFixed(d));
export default function LevelSurfacesTargetLesson421({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [model, setModel] = useState(initial),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [sampling, setSampling] = useState(true),
    [checked, setChecked] = useState(true),
    [actions, setActions] = useState(0),
    r = Math.sqrt(model.c),
    area = 4 * Math.PI * model.c,
    volume = (4 * Math.PI * r ** 3) / 3,
    act = (f: () => void) => {
      f();
      setActions((n) => n + 1);
      onInteraction();
    },
    set = <K extends keyof typeof model>(k: K, v: (typeof model)[K]) =>
      act(() => setModel((x) => ({ ...x, [k]: v }))),
    reset = () => {
      setModel(initial);
      setTab("Interact");
      setSampling(true);
      setChecked(true);
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page ls421-page"
      aria-label="Level surfaces"
      data-testid="geometry3d-mockup-0606"
      data-lesson-title="Level Surfaces"
      data-guidance="Drag surface to rotate and change the isovalue."
      data-object-model="threejs-dedicated-scalar-field-isovalue-sphere-concentric-levels-radius-area-volume-styles-layers-graded-c3-challenge"
      data-direct-interaction="true"
      data-c={model.c}
      data-radius={fix(r)}
      data-area={fix(area)}
      data-volume={fix(volume)}
      data-style={model.style}
      data-axes={model.axes}
      data-points={model.points}
      data-cross={model.cross}
      data-labels={model.labels}
      data-sampling={sampling}
      data-checked={checked}
      data-actions={actions}
    >
      <header className="ls421-hero">
        <small>3D MATHEMATICS | LEVEL 421</small>
        <h1>Level Surfaces – Reusable 3D Graph Engine</h1>
        <p>
          ▣ <b>Objective:</b> Visualize level surfaces of f(x,y,z)=c inside a
          scalar field.
        </p>
        <div>
          {[
            ["♧ Topic", "Level Surfaces"],
            ["☆ Grade", "12+"],
            ["◴ Time", "6-10 min"],
            ["♙ Prerequisite", "3D Coordinates"],
            ["▣ Skills", "Visualization, Interpretation"],
          ].map(([a, b]) => (
            <span key={a}>
              <b>{a}</b>
              {b}
            </span>
          ))}
        </div>
      </header>
      <nav className="ls421-tabs">
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
      <section className="ls421-lab">
        <header>
          <div>
            <h2>Explore the scalar field and its level surfaces</h2>
            <p>Rotate, change the isovalue c, and observe the surfaces.</p>
          </div>
          <button onClick={() => act(() => setViewKey((n) => n + 1))}>
            ↻ Reset view
          </button>
          <label>
            Sampling
            <select
              aria-label="Sampling"
              value={sampling ? "On" : "Off"}
              onChange={(e) => act(() => setSampling(e.target.value === "On"))}
            >
              <option>On</option>
              <option>Off</option>
            </select>
          </label>
          <button>↗</button>
        </header>
        <div className="ls421-work">
          <article className="ls421-canvas">
            <LevelCanvas key={viewKey} model={model} onOrbit={onInteraction} />
            <b>↻ Drag to rotate</b>
          </article>
          <aside>
            <h3>Scalar field</h3>
            <output>f(x,y,z) = x² + y² + z²</output>
            <label>
              <b>Isovalue c</b>
              <span>
                <input
                  aria-label="Isovalue c"
                  type="range"
                  min="0"
                  max="8"
                  step=".25"
                  value={model.c}
                  onChange={(e) => set("c", Number(e.target.value))}
                />
                <input
                  aria-label="Isovalue value"
                  type="number"
                  min="0"
                  max="8"
                  step=".25"
                  value={model.c}
                  onChange={(e) => set("c", Number(e.target.value))}
                />
              </span>
            </label>
            <section>
              <h3>Equation of level surface</h3>
              <output>
                x² + y² + z² = {model.c}
                <br />r = √{model.c} ≈ {fix(r)}
              </output>
            </section>
            <h3>Surface style</h3>
            <nav>
              {(["solid", "wire", "points", "dotted"] as Style[]).map((x) => (
                <button
                  aria-label={`${x} style`}
                  key={x}
                  className={model.style === x ? "active" : ""}
                  onClick={() => set("style", x)}
                >
                  {x === "solid"
                    ? "◉"
                    : x === "wire"
                      ? "◌"
                      : x === "points"
                        ? "▦"
                        : "⠿"}
                </button>
              ))}
            </nav>
            {(
              [
                ["axes", "Show axes"],
                ["points", "Show sample points"],
                ["cross", "Show cross-sections"],
                ["labels", "Show numeric labels"],
              ] as [keyof typeof model, string][]
            ).map(([k, label]) => (
              <label className="ls421-toggle" key={k}>
                {label}
                <input
                  aria-label={label}
                  type="checkbox"
                  checked={Boolean(model[k])}
                  onChange={(e) => set(k, e.target.checked as never)}
                />
                <i>{model[k] ? "On" : "Off"}</i>
              </label>
            ))}
          </aside>
        </div>
        <footer>
          {[
            [`At c = ${model.c}`, "Surface"],
            ["Sphere", "Center"],
            ["(0,0,0)", "Radius"],
            [`√${model.c} ≈ ${fix(r)}`, "Volume (inside)"],
            [`4/3π(√${model.c})³ ≈ ${fix(volume)}`, "Area"],
            [`4π(√${model.c})² ≈ ${fix(area)}`, ""],
          ].map(([a, b]) => (
            <span key={a}>
              <small>{b}</small>
              <b>{a}</b>
            </span>
          ))}
        </footer>
        <nav>
          {levels.map((c) => (
            <button
              key={c}
              className={model.c === c ? "active" : ""}
              onClick={() => set("c", c)}
            >
              ● c = {c.toFixed(2)}
            </button>
          ))}
        </nav>
      </section>
      <section className="ls421-info">
        <article>
          <h2>Notice the pattern</h2>
          <p>
            As c increases, the surfaces are concentric spheres centered at the
            origin.
          </p>
          <p>Radius grows with c by r=√c.</p>
          <table>
            <thead>
              <tr>
                <th>c</th>
                <th>Equation x²+y²+z²=c</th>
                <th>Radius r=√c</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {[0.25, 1, 2, 4, 6].map((c) => (
                <tr className={c === model.c ? "active" : ""} key={c}>
                  <td>{c.toFixed(2)}</td>
                  <td>x²+y²+z²={c}</td>
                  <td>{Math.sqrt(c).toFixed(3)}</td>
                  <td>{((4 * Math.PI * c ** 1.5) / 3).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article>
          <h2>Understand the rule</h2>
          <p>
            A level surface is the set of all points where f(x,y,z) equals a
            constant c.
          </p>
          <section>
            <h3>Key rule (Spherical level sets)</h3>
            <p>For f(x,y,z)=x²+y²+z² and c≥0, the level surface is a sphere:</p>
            <output>x²+y²+z²=c ⇔ r=√c</output>
          </section>
          <aside>
            <h3>⚠ Common misconception</h3>
            <p>
              Thinking larger c means smaller spheres.
              <br />
              Not true—radius increases with c.
            </p>
            <i>◎ Small c | ◉ Large c</i>
          </aside>
        </article>
      </section>
      <section className="ls421-bottom">
        <article>
          <h2>Worked Example</h2>
          <p>Find the radius and volume inside x²+y²+z²=5.</p>
          <b>Solution</b>
          <p>Radius: r=√5≈2.236</p>
          <p>V=4/3πr³=20/3π√5≈46.864</p>
          <strong>Answer: r=√5≈2.236, V=20/3π√5≈46.864</strong>
        </article>
        <article>
          <h2>Try independently</h2>
          <p>
            <b>Challenge:</b> Set c=3 and report radius, area, and volume.
          </p>
          <div>
            {[
              ["Radius r", Math.sqrt(3)],
              ["Surface area A", 12 * Math.PI],
              ["Volume inside V", 4 * Math.PI * Math.sqrt(3)],
            ].map(([a, b]) => (
              <span key={String(a)}>
                <b>{a}</b>
                <output>
                  {Number(b).toFixed(3)} {checked && "●"}
                </output>
              </span>
            ))}
          </div>
          <button
            onClick={() =>
              act(() => {
                setModel((x) => ({ ...x, c: 3 }));
                setChecked(true);
              })
            }
          >
            ✓ Check
          </button>
          <button
            onClick={() =>
              act(() => {
                setModel(initial);
                setChecked(false);
              })
            }
          >
            ↻ Reset
          </button>
        </article>
      </section>
      <nav className="ls421-adjacent">
        <button>
          ← <small>Previous</small>
          <b>Contour Curves</b>
        </button>
        <span>Lesson 3 of 18</span>
        <button>
          <small>Next</small>
          <b>Partial Derivatives</b> →
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
function LevelCanvas({
  model,
  onOrbit,
}: {
  model: typeof initial;
  onOrbit: () => void;
}) {
  const r = Math.sqrt(model.c),
    dots = [] as JSX.Element[];
  for (let a = 0; a < 12; a++)
    for (let b = 1; b < 7; b++) {
      const t = (2 * Math.PI * a) / 12,
        p = (Math.PI * b) / 7;
      dots.push(
        <mesh
          key={`${a}-${b}`}
          position={[
            r * Math.sin(p) * Math.cos(t),
            r * Math.cos(p),
            r * Math.sin(p) * Math.sin(t),
          ]}
        >
          <sphereGeometry args={[0.025, 6, 5]} />
          <meshBasicMaterial color="#fff" />
        </mesh>,
      );
    }
  return (
    <Canvas camera={{ position: [4.6, 3.4, 5.2], fov: 40 }}>
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} />
      {[0.5, 1, 2, 4, 6].map((c) => (
        <mesh key={c} scale={Math.sqrt(c)}>
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial
            color={c === model.c ? "#7b4ee4" : "#20b8d0"}
            transparent
            opacity={c === model.c ? 0.2 : 0.055}
            wireframe={model.style === "wire" || model.style === "dotted"}
            side={DoubleSide}
          />
        </mesh>
      ))}
      {model.points && dots}
      {model.cross && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 72]} />
          <meshBasicMaterial color="#f05a58" side={DoubleSide} />
        </mesh>
      )}
      {model.axes && <axesHelper args={[2.8]} />}{" "}
      {model.labels && (
        <Html position={[r, 0, 0]}>
          <b className="ls421-label">r={r.toFixed(2)}</b>
        </Html>
      )}
      <OrbitControls onStart={onOrbit} />
    </Canvas>
  );
}
