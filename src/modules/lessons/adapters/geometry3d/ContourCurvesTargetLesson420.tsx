import { Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./ContourCurvesTargetLesson420.css";

const PI = Math.PI,
  fn = (x: number, y: number) => Math.sin(x) * Math.cos(y),
  fix = (n: number) => Number(n.toFixed(2));
export default function ContourCurvesTargetLesson420({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [level, setLevel] = useState(0.3),
    [tab, setTab] = useState("Interact"),
    [viewKey, setViewKey] = useState(0),
    [choice, setChoice] = useState("A"),
    [graded, setGraded] = useState(true),
    [quick, setQuick] = useState("A"),
    [actions, setActions] = useState(0),
    segments = useMemo(() => march(level), [level]),
    act = (f: () => void) => {
      f();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setLevel(0.3);
      setTab("Interact");
      setChoice("A");
      setGraded(true);
      setQuick("A");
      setActions(0);
      setViewKey((n) => n + 1);
    };
  useEffect(reset, [resetToken]);
  const contourType =
    Math.abs(level) >= 0.98
      ? "Points"
      : Math.abs(level) < 0.02
        ? "Intersecting lines"
        : "Closed curve";
  return (
    <section
      className="cs378-page ct420-page"
      aria-label="Contour curves"
      data-testid="geometry3d-mockup-0605"
      data-lesson-title="Contour Curves"
      data-guidance="Drag surface slice plane or adjust the level to update its contour."
      data-object-model="threejs-dedicated-sinx-cosy-sampled-surface-movable-level-plane-marching-squares-linked-contour-map-graded-level-set"
      data-direct-interaction="true"
      data-level={fix(level)}
      data-segments={segments.length}
      data-contour={contourType}
      data-choice={choice}
      data-graded={graded}
      data-quick={quick}
      data-actions={actions}
    >
      <header className="ct420-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>420 Contour Curves</h1>
          <p>Connect surfaces and level maps.</p>
        </section>
        <aside>
          {[
            ["▣ Level", "Secondary +"],
            ["◴ Time", "6-10 min"],
            ["⊙ Focus", "Visual understanding"],
            ["♧ Skills", "3D reasoning, level sets"],
          ].map(([a, b]) => (
            <span key={a}>
              <b>{a}</b>
              {b}
            </span>
          ))}
        </aside>
      </header>
      <nav className="ct420-tabs">
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
      <section className="ct420-lab">
        <header>
          <small>OBSERVE & MANIPULATE</small>
          <h2>Drag the plane to slice the surface and see the contour.</h2>
          <output>z = sin(x) cos(y)</output>
        </header>
        <div className="ct420-linked">
          <article className="ct420-scene">
            <h3>3D Surface with Movable Horizontal Slice</h3>
            <div>
              <SurfaceCanvas
                key={viewKey}
                level={level}
                segments={segments}
                onOrbit={onInteraction}
              />
              <aside>
                Slice level (z)<b>{fix(level)}</b>
              </aside>
              <nav>
                <button onClick={() => act(() => setViewKey((n) => n + 1))}>
                  ↻
                </button>
                <button onClick={() => act(() => setViewKey((n) => n + 1))}>
                  ◇
                </button>
                <button
                  onClick={() =>
                    document.fullscreenElement
                      ? document.exitFullscreen()
                      : document.documentElement.requestFullscreen()
                  }
                >
                  ↗
                </button>
              </nav>
              <label>
                ♧ Drag the plane up/down
                <input
                  aria-label="Slice level"
                  type="range"
                  min="-1"
                  max="1"
                  step=".05"
                  value={level}
                  onChange={(e) => act(() => setLevel(Number(e.target.value)))}
                />
                <output>{fix(level)}</output>
                <small>Range: -1.00 to 1.00 | Step: 0.05</small>
              </label>
            </div>
          </article>
          <article className="ct420-map">
            <h3>Contour Map (Level Set in xy-plane)</h3>
            <ContourMap level={level} segments={segments} />
            <section>
              <b>Contour: z = {fix(level)}</b>
              <p>Intersect equation (level set):</p>
              <strong>sin(x)cos(y) = {fix(level)}</strong>
            </section>
          </article>
        </div>
        <footer>
          {[
            ["Slice level (z)", fix(level)],
            ["Min z", "-1.000"],
            ["Max z", "1.000"],
            ["Current contour", contourType],
          ].map(([a, b]) => (
            <span key={a}>
              <small>{a}</small>
              <b>{b}</b>
            </span>
          ))}
        </footer>
      </section>
      <section className="ct420-info">
        <article>
          <h3>♧ NOTICE THE PATTERN</h3>
          <ul>
            <li>As the plane moves up, the contour shrinks.</li>
            <li>As the plane moves down, the contour expands.</li>
            <li>For z=0, contours are x=nπ or y=(n+1/2)π.</li>
            <li>For z=±1, the contour collapses to points.</li>
          </ul>
          <button>？ Why do contour curves change this way?</button>
        </article>
        <article>
          <h3>⠿ UNDERSTAND THE RULE</h3>
          <p>
            A contour curve (level set) is the set of all (x,y) such that the
            surface has a constant height z=k.
          </p>
          <section>
            <b>Definition</b>
            <p>
              For z=f(x,y), the contour curve at level k is{" "}
              {"{(x,y) in R² | f(x,y)=k}"}.
            </p>
          </section>
          <aside>
            <b>△ Common Misconception</b>
            <p>
              Thinking the contour is always a circle.
              <br />
              Not always—shape depends on f(x,y) and k.
            </p>
          </aside>
        </article>
        <article>
          <h3>♧ WORKED EXAMPLE</h3>
          <p>Find and sketch the contour for z=sin(x)cos(y) at level k=0.</p>
          <b>Solution:</b>
          <p>
            sin(x)cos(y)=0
            <br />⇒ sin(x)=0 or cos(y)=0
            <br />⇒ x=nπ or y=(n+1/2)π
          </p>
          <ZeroContour />
          <small>---- x=nπ | ---- y=(n+1/2)π</small>
        </article>
      </section>
      <section className="ct420-practice">
        <article>
          <h3>☆ TRY INDEPENDENTLY</h3>
          <p>Find the contour(s) of z=sin(x)cos(y) at level k=0.60.</p>
          <h4>Your Answer</h4>
          {[
            ["A", "sin(x) cos(y) = 0.60"],
            ["B", "sin(x) + cos(y) = 0.60"],
            ["C", "sin(x) = 0.60 or cos(y) = 0.60"],
            ["D", "No contour exists for k = 0.60"],
          ].map(([k, v]) => (
            <button
              key={k}
              className={choice === k ? (k === "A" ? "correct" : "wrong") : ""}
              onClick={() =>
                act(() => {
                  setChoice(k);
                  setGraded(false);
                })
              }
            >
              ○ {k}. {v}
            </button>
          ))}
        </article>
        <article>
          <h3>
            {graded && choice === "A"
              ? "✓ Correct!"
              : "Check your level-set equation"}
          </h3>
          <p>
            Contours are given by the level set equation f(x,y)=k for the
            surface z=f(x,y).
          </p>
          <button
            onClick={() =>
              act(() => {
                setLevel(0.6);
                setGraded(true);
              })
            }
          >
            Check another value
          </button>
        </article>
        <article>
          <h3>♧ HINT</h3>
          <p>Keep the formula and change only the constant (level k).</p>
          <h4>QUICK CHECK</h4>
          <p>What happens to contours as k→1?</p>
          {[
            ["A", "They shrink to points"],
            ["B", "They expand to cover plane"],
            ["C", "They disappear"],
          ].map(([k, v]) => (
            <button
              key={k}
              className={quick === k ? "active" : ""}
              onClick={() => act(() => setQuick(k))}
            >
              ○ {v}
            </button>
          ))}
        </article>
      </section>
      <nav className="ct420-adjacent">
        <button>
          ← <small>PREVIOUS LESSON</small>
          <b>Spherical Coordinates</b>
        </button>
        <span>
          Lesson 420 of 520 <i>81% complete</i>
        </span>
        <button>
          <small>NEXT LESSON</small>
          <b>Level Surfaces</b> →
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
function SurfaceCanvas({
  level,
  segments,
  onOrbit,
}: {
  level: number;
  segments: number[][];
  onOrbit: () => void;
}) {
  const geometry = useMemo(surfaceGeometry, []),
    curves = segments.map((s, i) => (
      <Line
        key={i}
        points={[
          [s[0], level, s[1]],
          [s[2], level, s[3]],
        ]}
        color="#19dcea"
        lineWidth={3}
      />
    ));
  return (
    <Canvas camera={{ position: [7, 5.4, 7], fov: 42 }}>
      <color attach="background" args={["#071b39"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 7, 5]} intensity={1.8} />
      <gridHelper args={[7, 14, "#35506b", "#17324f"]} />
      <axesHelper args={[3.7]} />
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#53a9b9"
          roughness={0.5}
          metalness={0.1}
          side={DoubleSide}
          vertexColors
        />
      </mesh>
      <mesh position={[0, level, 0]} rotation={[-PI / 2, 0, 0]}>
        <planeGeometry args={[6.3, 6.3]} />
        <meshBasicMaterial
          color="#16cde0"
          transparent
          opacity={0.22}
          side={DoubleSide}
        />
      </mesh>
      {curves}
      <OrbitControls onStart={onOrbit} />
    </Canvas>
  );
}
function surfaceGeometry() {
  const n = 48,
    pos: number[] = [],
    colors: number[] = [],
    idx: number[] = [];
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++) {
      const x = -PI + (2 * PI * i) / n,
        y = -PI + (2 * PI * j) / n,
        z = fn(x, y);
      pos.push(x, z, y);
      colors.push(
        0.25 + (0.3 * (z + 1)) / 2,
        0.35 + (0.45 * (z + 1)) / 2,
        0.72 - (0.35 * (z + 1)) / 2,
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
function march(k: number) {
  const n = 54,
    out: number[][] = [];
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x = -PI + (2 * PI * i) / n,
        y = -PI + (2 * PI * j) / n,
        d = (2 * PI) / n,
        c = [
          [x, y, fn(x, y)],
          [x + d, y, fn(x + d, y)],
          [x + d, y + d, fn(x + d, y + d)],
          [x, y + d, fn(x, y + d)],
        ],
        hits: number[][] = [];
      for (let q = 0; q < 4; q++) {
        const a = c[q],
          b = c[(q + 1) % 4];
        if ((a[2] - k) * (b[2] - k) <= 0 && a[2] !== b[2]) {
          const t = (k - a[2]) / (b[2] - a[2]);
          hits.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
        }
      }
      if (hits.length >= 2)
        out.push([hits[0][0], hits[0][1], hits[1][0], hits[1][1]]);
    }
  return out;
}
function ContourMap({
  level,
  segments,
}: {
  level: number;
  segments: number[][];
}) {
  const s = (n: number) => 146 + (n / PI) * 110;
  return (
    <svg viewBox="0 0 292 275">
      <path d="M36 238H270M146 15V258" stroke="#6e7c92" />
      <path d="M36 126H270M146 15V258" stroke="#7a8ca7" strokeDasharray="4 4" />
      {segments.map((a, i) => (
        <line
          key={i}
          x1={s(a[0])}
          y1={s(-a[1])}
          x2={s(a[2])}
          y2={s(-a[3])}
          stroke="#0ebbd0"
          strokeWidth="2.2"
        />
      ))}
      <text x="248" y="265">
        x
      </text>
      <text x="151" y="22">
        y
      </text>
      <text x="185" y="32" fill="#118ea3">
        k={fix(level)}
      </text>
    </svg>
  );
}
function ZeroContour() {
  return (
    <svg viewBox="0 0 260 120">
      <path d="M20 60H245M130 8V112" stroke="#596a83" />
      {[65, 130, 195].map((x) => (
        <line
          key={x}
          x1={x}
          y1="15"
          x2={x}
          y2="108"
          stroke="#f35b58"
          strokeDasharray="5 4"
        />
      ))}
      {[32, 88].map((y) => (
        <line
          key={y}
          x1="24"
          y1={y}
          x2="240"
          y2={y}
          stroke="#55bf45"
          strokeDasharray="5 4"
        />
      ))}
    </svg>
  );
}
