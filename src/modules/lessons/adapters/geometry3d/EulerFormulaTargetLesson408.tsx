import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Check,
  ExternalLink,
  Move,
  Rotate3D,
  RotateCcw,
  Share2,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./EulerFormulaTargetLesson408.css";

type Solid = "tetra" | "cube" | "octa" | "irregular";
type Kind = "v" | "e" | "f";
type Point = [number, number, number];
const info: Record<
  Solid,
  { label: string; v: number; e: number; f: number; color: string }
> = {
  tetra: { label: "Tetrahedron", v: 4, e: 6, f: 4, color: "#8751df" },
  cube: { label: "Cube", v: 8, e: 12, f: 6, color: "#4d70e4" },
  octa: { label: "Octahedron", v: 6, e: 12, f: 8, color: "#28b6aa" },
  irregular: {
    label: "Irregular convex polyhedron",
    v: 20,
    e: 30,
    f: 12,
    color: "#ef8c32",
  },
};

export default function EulerFormulaTargetLesson408({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [solid, setSolid] = useState<Solid>("cube"),
    [mode, setMode] = useState<"rotate" | "pan" | "zoom">("rotate"),
    [unfold, setUnfold] = useState(false),
    [countedV, setCountedV] = useState<Set<number>>(new Set(range(8))),
    [countedE, setCountedE] = useState<Set<number>>(new Set(range(12))),
    [countedF, setCountedF] = useState<Set<number>>(new Set(range(6))),
    [challengeV, setChallengeV] = useState(0),
    [challengeE, setChallengeE] = useState(0),
    [challengeF, setChallengeF] = useState(0),
    [checked, setChecked] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const data = info[solid],
    value = countedV.size - countedE.size + countedF.size,
    verified =
      countedV.size === data.v &&
      countedE.size === data.e &&
      countedF.size === data.f &&
      value === 2,
    challengeCorrect =
      checked && challengeV === 12 && challengeE === 30 && challengeF === 20;
  const selectSolid = (next: Solid) => {
    const d = info[next];
    setSolid(next);
    setCountedV(new Set(range(d.v)));
    setCountedE(new Set(range(d.e)));
    setCountedF(new Set(range(d.f)));
    setUnfold(false);
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setSolid("cube");
    setMode("rotate");
    setUnfold(false);
    setCountedV(new Set(range(8)));
    setCountedE(new Set(range(12)));
    setCountedF(new Set(range(6)));
    setChallengeV(0);
    setChallengeE(0);
    setChallengeF(0);
    setChecked(false);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const count = (kind: Kind, id: number) => {
    const setter =
      kind === "v" ? setCountedV : kind === "e" ? setCountedE : setCountedF;
    setter((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setActions((v) => v + 1);
    onInteraction();
  };
  const clear = (kind?: Kind) => {
    if (!kind || kind === "v") setCountedV(new Set());
    if (!kind || kind === "e") setCountedE(new Set());
    if (!kind || kind === "f") setCountedF(new Set());
    setActions((v) => v + 1);
    onInteraction();
  };
  return (
    <section
      className="cs378-page eu408-page"
      data-testid="geometry3d-mockup-0593"
      data-object-model="threejs-dedicated-countable-polyhedron-topology-euler-dual-hole-challenge"
      data-direct-interaction="true"
      data-solid={solid}
      data-mode={mode}
      data-unfold={unfold}
      data-vertices={countedV.size}
      data-edges={countedE.size}
      data-faces={countedF.size}
      data-euler={value}
      data-verified={verified}
      data-challenge-v={challengeV}
      data-challenge-e={challengeE}
      data-challenge-f={challengeF}
      data-checked={checked}
      data-correct={challengeCorrect}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="eu408-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>Euler's Polyhedron Formula</h1>
          <span className="sr-only">Euler's polyhedron formula</span>
          <p>Relate vertices, edges and faces.</p>
          <div className="eu408-badges">
            <span>Intermediate–Advanced</span>
            <span>3D Lab</span>
            <span>3D Calculator</span>
            <span>6–10 min</span>
          </div>
          <nav>
            <select aria-label="Language">
              <option>English (English)</option>
            </select>
            <button onClick={() => clear()}>
              <RotateCcw />
              Reset count
            </button>
            <button
              onClick={() => {
                setShared(true);
                void navigator.clipboard?.writeText(
                  `${countedV.size} - ${countedE.size} + ${countedF.size} = ${value}`,
                );
                onInteraction();
              }}
            >
              <Share2 />
              {shared ? "Shared" : "Share"}
            </button>
            <a href="/workspace">
              <ExternalLink />
              Workspace
            </a>
          </nav>
        </div>
        <MiniCanvas solid="hero" />
      </header>
      <section className="eu408-interact">
        <header>
          <small>INTERACTION</small>
          <h2>Count the vertices, edges and faces</h2>
          <p>Rotate the solid. Click to count. Unfold to see faces.</p>
        </header>
        <aside className="eu408-picker">
          <b>Choose a solid</b>
          {(Object.keys(info) as Solid[]).map((item) => (
            <button
              key={item}
              className={solid === item ? "active" : ""}
              onClick={() => selectSolid(item)}
            >
              <MiniCanvas solid={item} />
              <span>{info[item].label}</span>
              {solid === item && <Check />}
            </button>
          ))}
        </aside>
        <article className="eu408-stage">
          <nav>
            <button
              className={mode === "rotate" ? "active" : ""}
              onClick={() => setMode("rotate")}
            >
              <Rotate3D />
              Rotate
            </button>
            <button
              className={mode === "pan" ? "active" : ""}
              onClick={() => setMode("pan")}
            >
              <Move />
              Pan
            </button>
            <button
              className={mode === "zoom" ? "active" : ""}
              onClick={() => setMode("zoom")}
            >
              <ZoomIn />
              Zoom
            </button>
            <button
              className={unfold ? "active" : ""}
              onClick={() => {
                setUnfold((v) => !v);
                onInteraction();
              }}
            >
              Unfold
            </button>
          </nav>
          <Canvas
            data-testid="geometry3d-euler-canvas"
            aria-label="Drag solid to rotate and click topology elements"
            camera={{ position: [4.8, 4, 6], fov: 40 }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <color attach="background" args={["#07142d"]} />
            <ambientLight intensity={1.6} />
            <directionalLight position={[5, 7, 6]} intensity={2} />
            <gridHelper
              args={[12, 12, "#173359", "#102646"]}
              position={[0, -2.1, 0]}
            />
            <CountableSolid
              solid={solid}
              unfold={unfold}
              countedV={countedV}
              countedE={countedE}
              countedF={countedF}
              count={count}
            />
            <OrbitControls
              makeDefault
              enableRotate={mode === "rotate"}
              enablePan={mode === "pan"}
              enableZoom={mode === "zoom"}
            />
          </Canvas>
          <p>Drag to rotate · Click a vertex, edge or face to count</p>
        </article>
        <aside className="eu408-counts">
          <p>Click an element to count it</p>
          <div className="eu408-legend">
            <button onClick={() => count("v", nextMissing(countedV, data.v))}>
              vertex
            </button>
            <button onClick={() => count("e", nextMissing(countedE, data.e))}>
              edge
            </button>
            <button onClick={() => count("f", nextMissing(countedF, data.f))}>
              face
            </button>
          </div>
          <CountCard
            kind="v"
            label="Vertices"
            value={countedV.size}
            clear={() => clear("v")}
          />
          <CountCard
            kind="e"
            label="Edges"
            value={countedE.size}
            clear={() => clear("e")}
          />
          <CountCard
            kind="f"
            label="Faces"
            value={countedF.size}
            clear={() => clear("f")}
          />
          <div className="eu408-check">
            <b>Euler check</b>
            <strong>V − E + F = 2</strong>
            <p>
              <i>{countedV.size}</i> − <i>{countedE.size}</i> +{" "}
              <i>{countedF.size}</i> = {value}
            </p>
            {verified && <span>✓ Verified</span>}
          </div>
        </aside>
        <footer>Tip: Each element should be counted exactly once.</footer>
      </section>
      <section className="eu408-concepts">
        <article>
          <h3>Dual solid comparison</h3>
          <p>A polyhedron and its dual have the same Euler characteristic.</p>
          <div>
            <MiniCanvas solid="cube" />
            <b>⇄</b>
            <MiniCanvas solid="octa" />
          </div>
          <footer>
            Both satisfy <i>V − E + F = 2</i>
          </footer>
        </article>
        <article>
          <h3>Why holes change Euler characteristic</h3>
          <p>A hole reduces the characteristic.</p>
          <Canvas camera={{ position: [4, 3, 5], fov: 42 }}>
            <ambientLight intensity={2} />
            <directionalLight position={[4, 6, 5]} intensity={2} />
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.25, 0.48, 24, 64]} />
              <meshStandardMaterial color="#8149c7" />
              <Edges color="#c177e8" />
            </mesh>
            <OrbitControls autoRotate enableZoom={false} enablePan={false} />
          </Canvas>
          <b>
            Torus (one hole)
            <br />
            <i>V − E + F = 0</i>
          </b>
        </article>
        <article>
          <h3>Euler's Polyhedron Formula</h3>
          <p>For any convex polyhedron:</p>
          <strong>V − E + F = 2</strong>
          <small>
            Vertices − Edges + Faces = 2<br />
            (V = vertices, E = edges, F = faces)
          </small>
          <footer>Helps check solids and detect mistakes!</footer>
        </article>
      </section>
      <section className="eu408-reference">
        <article>
          <h3>Worked example: Cube</h3>
          <p>Count carefully and verify.</p>
          <div>
            <MiniCanvas solid="cube" />
            <ul>
              <li>
                Vertices (V): 8<small>Eight corner points.</small>
              </li>
              <li>
                Edges (E): 12<small>Twelve line segments.</small>
              </li>
              <li>
                Faces (F): 6<small>Six square faces.</small>
              </li>
            </ul>
            <div className="eu408-check">
              <b>Euler check</b>
              <strong>V − E + F = 2</strong>
              <p>8 − 12 + 6 = 2</p>
              <span>✓ Verified</span>
            </div>
          </div>
        </article>
        <article>
          <h3>Correct counts for common convex polyhedra</h3>
          <table>
            <thead>
              <tr>
                <th>Solid</th>
                <th>V</th>
                <th>E</th>
                <th>F</th>
                <th>V − E + F</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tetrahedron</td>
                <td>4</td>
                <td>6</td>
                <td>4</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Cube</td>
                <td>8</td>
                <td>12</td>
                <td>6</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Octahedron</td>
                <td>6</td>
                <td>12</td>
                <td>8</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Dodecahedron</td>
                <td>20</td>
                <td>30</td>
                <td>12</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Icosahedron</td>
                <td>12</td>
                <td>30</td>
                <td>20</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Irregular convex</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>
      <section className="eu408-challenge">
        <h3>Challenge: Count without double-counting</h3>
        <article>
          <b>Guidelines</b>
          <p>✓ Go slow and be systematic.</p>
          <p>✓ Count each vertex, edge and face exactly once.</p>
          <p>✓ Use rotation and unfolding to help.</p>
          <p>✓ Verify using V − E + F = 2.</p>
        </article>
        <MiniCanvas solid="challenge" />
        <div className="eu408-challenge-inputs">
          <Stepper
            label="Vertices (V)"
            value={challengeV}
            set={setChallengeV}
          />
          <Stepper label="Edges (E)" value={challengeE} set={setChallengeE} />
          <Stepper label="Faces (F)" value={challengeF} set={setChallengeF} />
        </div>
        <div className="eu408-challenge-check">
          <b>Euler check</b>
          <strong>
            {challengeV || "—"} − {challengeE || "—"} + {challengeF || "—"} = 2
          </strong>
          <button
            onClick={() => {
              setChecked(true);
              onInteraction();
            }}
          >
            <Check />
            Check
          </button>
          {checked && (
            <span className={challengeCorrect ? "correct" : "wrong"}>
              {challengeCorrect
                ? "Verified: 12 − 30 + 20 = 2"
                : "Count every element once, then check again."}
            </span>
          )}
        </div>
        <footer>Answer is not shown. Try first, then check!</footer>
      </section>
    </section>
  );
}

function CountableSolid({
  solid,
  unfold,
  countedV,
  countedE,
  countedF,
  count,
}: {
  solid: Solid;
  unfold: boolean;
  countedV: Set<number>;
  countedE: Set<number>;
  countedF: Set<number>;
  count: (k: Kind, id: number) => void;
}) {
  const topology = useMemo(() => makeTopology(solid), [solid]),
    d = info[solid];
  return (
    <group scale={unfold ? 1.18 : 1}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          count(
            "f",
            solid === "cube"
              ? Math.floor((event.faceIndex ?? 0) / 2)
              : solid === "irregular"
                ? Math.floor((event.faceIndex ?? 0) / 3)
                : (event.faceIndex ?? 0) % d.f,
          );
        }}
      >
        {solid === "cube" ? (
          <boxGeometry args={[3, 3, 3]} />
        ) : solid === "tetra" ? (
          <tetrahedronGeometry args={[2.3]} />
        ) : solid === "octa" ? (
          <octahedronGeometry args={[2.3]} />
        ) : (
          <dodecahedronGeometry args={[2.2]} />
        )}
        <meshStandardMaterial
          color={d.color}
          transparent
          opacity={countedF.size ? 0.48 : 0.17}
        />
        <Edges color="#66f2ff" />
      </mesh>
      {topology.edges.map(([a, b], id) => (
        <EdgePiece
          key={id}
          a={topology.vertices[a]}
          b={topology.vertices[b]}
          active={countedE.has(id)}
          onClick={() => count("e", id)}
        />
      ))}
      {topology.vertices.map((point, id) => (
        <mesh
          key={id}
          position={point}
          onClick={(event) => {
            event.stopPropagation();
            count("v", id);
          }}
        >
          <sphereGeometry args={[0.12, 18, 12]} />
          <meshStandardMaterial
            color={countedV.has(id) ? "#ff8b16" : "#5b657d"}
          />
        </mesh>
      ))}
    </group>
  );
}
function EdgePiece({
  a,
  b,
  active,
  onClick,
}: {
  a: Point;
  b: Point;
  active: boolean;
  onClick: () => void;
}) {
  const start = new Vector3(...a),
    end = new Vector3(...b),
    mid = start.clone().add(end).multiplyScalar(0.5),
    direction = end.clone().sub(start),
    length = direction.length(),
    quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction.normalize(),
    );
  return (
    <mesh
      position={mid}
      quaternion={quaternion}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <cylinderGeometry args={[0.035, 0.035, length, 8]} />
      <meshBasicMaterial color={active ? "#34e3f0" : "#53617d"} />
    </mesh>
  );
}
function MiniCanvas({ solid }: { solid: Solid | "challenge" | "hero" }) {
  const special = solid === "challenge" || solid === "hero";
  const actual: Solid = special ? "octa" : solid;
  return (
    <Canvas
      aria-label={`${solid} preview`}
      camera={{ position: [4, 3, 5], fov: 42 }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 5]} intensity={2} />
      <mesh rotation={[0.2, 0.45, 0]}>
        {special ? (
          <icosahedronGeometry args={[1.8]} />
        ) : actual === "cube" ? (
          <boxGeometry args={[2, 2, 2]} />
        ) : actual === "tetra" ? (
          <tetrahedronGeometry args={[1.7]} />
        ) : actual === "octa" ? (
          <octahedronGeometry args={[1.8]} />
        ) : (
          <dodecahedronGeometry args={[1.7]} />
        )}
        <meshStandardMaterial
          color={special ? "#5355d9" : info[actual].color}
          transparent
          opacity={0.82}
        />
        <Edges color="#50e7f1" />
      </mesh>
      <OrbitControls autoRotate enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
function CountCard({
  kind,
  label,
  value,
  clear,
}: {
  kind: Kind;
  label: string;
  value: number;
  clear: () => void;
}) {
  return (
    <div className={`eu408-count ${kind}`}>
      <i />
      <span>
        {label}
        <b>{value}</b>
      </span>
      <button aria-label={`Reset ${label.toLowerCase()}`} onClick={clear}>
        <RotateCcw />
      </button>
    </div>
  );
}
function Stepper({
  label,
  value,
  set,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <button onClick={() => set(Math.max(0, value - 1))}>−</button>
      <input
        aria-label={label}
        type="number"
        min="0"
        value={value}
        onChange={(e) => set(Math.max(0, Number(e.target.value)))}
      />
      <button onClick={() => set(value + 1)}>↻</button>
    </label>
  );
}
function makeTopology(solid: Solid) {
  let vertices: Point[] = [];
  if (solid === "cube")
    vertices = [
      [-1.5, -1.5, -1.5],
      [-1.5, -1.5, 1.5],
      [-1.5, 1.5, -1.5],
      [-1.5, 1.5, 1.5],
      [1.5, -1.5, -1.5],
      [1.5, -1.5, 1.5],
      [1.5, 1.5, -1.5],
      [1.5, 1.5, 1.5],
    ];
  else if (solid === "tetra")
    vertices = [
      [1.33, 1.33, 1.33],
      [-1.33, -1.33, 1.33],
      [-1.33, 1.33, -1.33],
      [1.33, -1.33, -1.33],
    ];
  else if (solid === "octa")
    vertices = [
      [2.3, 0, 0],
      [-2.3, 0, 0],
      [0, 2.3, 0],
      [0, -2.3, 0],
      [0, 0, 2.3],
      [0, 0, -2.3],
    ];
  else {
    const p = (1 + Math.sqrt(5)) / 2,
      q = 1 / p;
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1]) vertices.push([x, y, z]);
    for (const a of [-1, 1])
      for (const c of [-1, 1]) {
        vertices.push([0, a * q, c * p], [a * q, c * p, 0], [c * p, 0, a * q]);
      }
    vertices = vertices.map(([x, y, z]) => [x * 1.35, y * 1.35, z * 1.35]);
  }
  let minimum = Infinity;
  for (let i = 0; i < vertices.length; i++)
    for (let j = i + 1; j < vertices.length; j++)
      minimum = Math.min(minimum, dist(vertices[i], vertices[j]));
  const edges: [number, number][] = [];
  for (let i = 0; i < vertices.length; i++)
    for (let j = i + 1; j < vertices.length; j++)
      if (Math.abs(dist(vertices[i], vertices[j]) - minimum) < 0.04)
        edges.push([i, j]);
  return { vertices, edges };
}
const dist = (a: Point, b: Point) =>
    Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
  range = (n: number) => Array.from({ length: n }, (_, i) => i),
  nextMissing = (set: Set<number>, limit: number) =>
    range(limit).find((id) => !set.has(id)) ?? limit - 1;
