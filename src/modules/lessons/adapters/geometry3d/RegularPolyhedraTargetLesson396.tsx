import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./RegularPolyhedraTargetLesson396.css";

type SolidName =
  "Tetrahedron" | "Cube" | "Octahedron" | "Dodecahedron" | "Icosahedron";
type Solid = {
  name: SolidName;
  faces: number;
  edges: number;
  vertices: number;
  face: string;
  symbol: string;
  dual: SolidName;
  color: string;
  glyph: string;
};
const solids: Solid[] = [
  {
    name: "Tetrahedron",
    faces: 4,
    edges: 6,
    vertices: 4,
    face: "Triangle",
    symbol: "{3, 3}",
    dual: "Tetrahedron",
    color: "#10a9d8",
    glyph: "△",
  },
  {
    name: "Cube",
    faces: 6,
    edges: 12,
    vertices: 8,
    face: "Square",
    symbol: "{4, 3}",
    dual: "Octahedron",
    color: "#54bfa8",
    glyph: "□",
  },
  {
    name: "Octahedron",
    faces: 8,
    edges: 12,
    vertices: 6,
    face: "Triangle",
    symbol: "{3, 4}",
    dual: "Cube",
    color: "#ed922d",
    glyph: "◇",
  },
  {
    name: "Dodecahedron",
    faces: 12,
    edges: 30,
    vertices: 20,
    face: "Pentagon",
    symbol: "{5, 3}",
    dual: "Icosahedron",
    color: "#8757c9",
    glyph: "⬠",
  },
  {
    name: "Icosahedron",
    faces: 20,
    edges: 30,
    vertices: 12,
    face: "Triangle",
    symbol: "{3, 5}",
    dual: "Dodecahedron",
    color: "#4097d6",
    glyph: "△",
  },
];
export default function RegularPolyhedraTargetLesson396({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [index, setIndex] = useState(0),
    [dual, setDual] = useState(false),
    [tab, setTab] = useState("Explore"),
    [cameraReset, setCameraReset] = useState(0),
    [viewMode, setViewMode] = useState("Orbit"),
    [hover, setHover] = useState("none"),
    [answer, setAnswer] = useState<SolidName>("Octahedron"),
    [graded, setGraded] = useState(false),
    [hint, setHint] = useState(false),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0),
    solid = solids[index],
    act = (action: () => void) => {
      action();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setIndex(0);
      setDual(false);
      setTab("Explore");
      setCameraReset((v) => v + 1);
      setViewMode("Orbit");
      setHover("none");
      setAnswer("Octahedron");
      setGraded(false);
      setHint(false);
      setSolution(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const select = (next: number) =>
      act(() => {
        setIndex((next + solids.length) % solids.length);
        setDual(false);
        setHover("none");
      }),
    toggleDual = () =>
      act(() => {
        const next = solids.findIndex((item) => item.name === solid.dual);
        setIndex(next);
        setDual((v) => !v);
      });
  return (
    <section
      className="cs378-page rp396-page"
      data-testid="geometry3d-mockup-0581"
      data-object-model="threejs-dedicated-five-platonic-solids-real-geometries-selector-dual-mapping-orbit-pan-zoom-hover-exact-faces-edges-vertices-euler-schlafli-graded-challenge"
      data-solid={solid.name}
      data-index={index}
      data-faces={solid.faces}
      data-edges={solid.edges}
      data-vertices={solid.vertices}
      data-euler={solid.vertices - solid.edges + solid.faces}
      data-face={solid.face}
      data-symbol={solid.symbol}
      data-dual={solid.dual}
      data-dual-mode={dual}
      data-view={viewMode}
      data-hover={hover}
      data-tab={tab}
      data-answer={answer}
      data-graded={graded}
      data-hint={hint}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="rp396-hero">
        <small>3D MATHEMATICS</small>
        <h1>Regular Polyhedra</h1>
        <p>Explore the five Platonic solids.</p>
        <nav>
          {["Learn", "Explore", "Compare", "Data", "Challenge", "About"].map(
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
      </header>
      <section className="rp396-explorer">
        <header>
          <b>Select a solid</b>
          <button aria-label="Previous solid" onClick={() => select(index - 1)}>
            ←
          </button>
          <strong>{index + 1} / 5</strong>
          <button aria-label="Next solid" onClick={() => select(index + 1)}>
            →
          </button>
          <label>
            <input
              aria-label="Show dual solid"
              type="checkbox"
              checked={dual}
              onChange={toggleDual}
            />{" "}
            Dual
          </label>
        </header>
        <div className="rp396-main">
          <aside className="rp396-summary">
            <div>{solid.glyph}</div>
            <h2>{solid.name}</h2>
            <small>({solid.face} solid)</small>
            <p>
              ▣ Faces (F)<b>{solid.faces}</b>
            </p>
            <p>
              ▱ Edges (E)<b>{solid.edges}</b>
            </p>
            <p>
              ♙ Vertices (V)<b>{solid.vertices}</b>
            </p>
            <section>
              Euler's formula V − E + F = 2<br />
              <strong>
                {solid.vertices} − {solid.edges} + {solid.faces} = 2 ✓
              </strong>
            </section>
          </aside>
          <article
            className="rp396-scene"
            data-testid="geometry3d-polyhedra-canvas"
          >
            <span>♙ Drag to rotate</span>
            <Canvas camera={{ position: [4, 4, 4], fov: 42 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#fff"]} />
              <ambientLight intensity={2} />
              <directionalLight position={[5, 8, 6]} intensity={2.4} />
              <SolidMesh solid={solid} onHover={setHover} />
              <OrbitControls
                key={cameraReset}
                makeDefault
                enablePan={viewMode === "Pan"}
                enableRotate={viewMode === "Orbit"}
                enableZoom={viewMode !== "Pan"}
                target={[0, 0, 0]}
                minDistance={3.2}
                maxDistance={10}
              />
            </Canvas>
            <nav>
              {["Orbit", "Pan", "Zoom"].map((name) => (
                <button
                  key={name}
                  className={viewMode === name ? "active" : ""}
                  onClick={() => act(() => setViewMode(name))}
                >
                  {name}
                </button>
              ))}
              <button onClick={() => act(() => setCameraReset((v) => v + 1))}>
                Reset
              </button>
            </nav>
          </article>
          <aside className="rp396-properties">
            <h2>Properties</h2>
            <p>
              Faces<b>{solid.faces}</b>
            </p>
            <p>
              Edges<b>{solid.edges}</b>
            </p>
            <p>
              Vertices<b>{solid.vertices}</b>
            </p>
            <h3>Face shape</h3>
            <div>
              {solid.glyph}
              <span>
                {solid.face}
                <small>(Regular)</small>
              </span>
            </div>
            <h3>Schläfli symbol</h3>
            <strong>{solid.symbol}</strong>
            <h3>Dual solid</h3>
            <strong>
              {solid.dual === solid.name ? "Self-dual" : solid.dual}
            </strong>
            <small>Hover: {hover}</small>
          </aside>
        </div>
        <div className="rp396-cards">
          <button
            aria-label="Previous selector"
            onClick={() => select(index - 1)}
          >
            ←
          </button>
          {solids.map((item, itemIndex) => (
            <button
              key={item.name}
              className={index === itemIndex ? "active" : ""}
              onClick={() => select(itemIndex)}
            >
              <span className="rp396-thumb" aria-hidden="true">
                <Canvas
                  frameloop="demand"
                  camera={{ position: [4.5, 4.5, 4.5], fov: 45 }}
                  dpr={[1, 1.25]}
                >
                  <ambientLight intensity={2.2} />
                  <directionalLight position={[5, 7, 6]} intensity={2.5} />
                  <SolidMesh solid={item} onHover={() => undefined} compact />
                </Canvas>
              </span>
              <b>{item.name}</b>
              <small>
                ({item.faces}, {item.edges}, {item.vertices})
              </small>
            </button>
          ))}
          <button aria-label="Next selector" onClick={() => select(index + 1)}>
            →
          </button>
        </div>
      </section>
      <section className="rp396-data">
        <article>
          <h2>Exact data for all five Platonic solids</h2>
          <table>
            <thead>
              <tr>
                <th>Solid</th>
                <th>Faces (F)</th>
                <th>Edges (E)</th>
                <th>Vertices (V)</th>
                <th>V − E + F</th>
                <th>Schläfli symbol</th>
                <th>Dual</th>
              </tr>
            </thead>
            <tbody>
              {solids.map((item) => (
                <tr key={item.name}>
                  <td>
                    {item.glyph} {item.name}
                  </td>
                  <td>{item.faces}</td>
                  <td>{item.edges}</td>
                  <td>{item.vertices}</td>
                  <td>2 ✓</td>
                  <td>{item.symbol}</td>
                  <td>{item.dual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <aside>
          <h2>💡 Key insight</h2>
          <strong>Only five convex regular polyhedra exist.</strong>
          <p>A regular polyhedron must have:</p>
          <p>
            ✓ All faces are congruent regular polygons.
            <br />
            <br />✓ The same number of faces meet at every vertex.
            <br />
            <br />✓ It is convex.
          </p>
          <p>These five satisfy V − E + F = 2.</p>
        </aside>
      </section>
      <section className="rp396-challenge">
        <h2>Challenge: Identify the solid</h2>
        <p>Examine the solid and choose its name.</p>
        <article>
          <div>◇</div>
          <p>
            <b>Clues</b>
            <br />
            Faces are triangular.
            <br />8 faces.
            <br />
            12 edges.
            <br />6 vertices.
          </p>
        </article>
        <fieldset>
          {solids.map((item) => (
            <label
              key={item.name}
              className={answer === item.name ? "selected" : ""}
            >
              <input
                type="radio"
                name="solid-answer"
                value={item.name}
                checked={answer === item.name}
                onChange={() =>
                  act(() => {
                    setAnswer(item.name);
                    setGraded(false);
                  })
                }
              />
              {item.name}
            </label>
          ))}
        </fieldset>
        <aside>
          <h3>☝ Need a hint?</h3>
          <p>
            {hint
              ? "Count faces, edges, and vertices; then verify Euler's formula."
              : "Use the clues to identify the solid."}
          </p>
          <button onClick={() => act(() => setGraded(true))}>
            {graded && answer === "Octahedron" ? "Correct" : "Check my answer"}
          </button>
          <button onClick={() => act(() => setHint((v) => !v))}>Hint</button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            {solution ? "Hide solution" : "Show solution"}
          </button>
          {solution && <strong>Octahedron</strong>}
        </aside>
      </section>
      <nav className="rp396-nav">
        <a href="/lessons/3d-mathematics/395-tetrahedron">
          ← Previous
          <br />
          Tetrahedron
        </a>
        <button
          onClick={() =>
            act(() => {
              setTab("Explore");
              setCameraReset((value) => value + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            })
          }
        >
          ▦ Back to Lesson
        </button>
        <a href="/lessons/3d-mathematics/397-cylinder">
          Next →<br />
          Cylinder
        </a>
      </nav>
      <p className="rp396-tip">
        ✣ Tip: Hover over a face, edge, or vertex in the 3D view to highlight
        it.
      </p>
    </section>
  );
}
function SolidMesh({
  solid,
  onHover,
  compact = false,
}: {
  solid: Solid;
  onHover: (value: string) => void;
  compact?: boolean;
}) {
  const props = {
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover("face");
    },
    onPointerOut: () => onHover("none"),
  };
  return (
    <mesh {...props} rotation={[0, 0, 0]} scale={compact ? 0.72 : 1.05}>
      <Geometry name={solid.name} />
      <meshStandardMaterial
        color={solid.color}
        roughness={0.35}
        metalness={0.08}
      />
      <Edges color="#ecfaff" lineWidth={2} />
    </mesh>
  );
}
function Geometry({ name }: { name: SolidName }) {
  if (name === "Tetrahedron") return <tetrahedronGeometry args={[2.15]} />;
  if (name === "Cube") return <boxGeometry args={[3, 3, 3]} />;
  if (name === "Octahedron") return <octahedronGeometry args={[2.1]} />;
  if (name === "Dodecahedron") return <dodecahedronGeometry args={[2.1]} />;
  return <icosahedronGeometry args={[2.15]} />;
}
