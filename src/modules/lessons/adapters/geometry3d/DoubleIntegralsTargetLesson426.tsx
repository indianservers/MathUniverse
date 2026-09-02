import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BufferGeometry, DoubleSide, Float32BufferAttribute } from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./DoubleIntegralsTargetLesson426.css";

type Bounds = { a: number; b: number; c: number; d: number };
type Surface = "linear" | "tilted" | "bowl";
const start: Bounds = { a: 0, b: 3, c: 0, d: 2 };
const evaluate = (surface: Surface, x: number, y: number) =>
  surface === "linear"
    ? x + y + 1
    : surface === "tilted"
      ? 2 * x - y + 3
      : x * x + y * y;
const expression = (surface: Surface) =>
  surface === "linear"
    ? "x + y + 1"
    : surface === "tilted"
      ? "2x - y + 3"
      : "x² + y²";
const fix = (value: number, digits = 3) => Number(value.toFixed(digits));
function stats(surface: Surface, bounds: Bounds) {
  const { a, b, c, d } = bounds;
  const area = Math.max(0, (b - a) * (d - c));
  let volume = 0;
  if (surface === "linear") volume = area * ((a + b + c + d) / 2 + 1);
  else if (surface === "tilted") volume = area * (a + b - (c + d) / 2 + 3);
  else
    volume =
      ((d - c) * (b ** 3 - a ** 3)) / 3 + ((b - a) * (d ** 3 - c ** 3)) / 3;
  const corners = [
    evaluate(surface, a, c),
    evaluate(surface, a, d),
    evaluate(surface, b, c),
    evaluate(surface, b, d),
  ];
  if (surface === "bowl")
    corners.push(
      evaluate(
        surface,
        Math.max(a, Math.min(0, b)),
        Math.max(c, Math.min(0, d)),
      ),
    );
  return {
    area,
    volume,
    average: area ? volume / area : 0,
    min: Math.min(...corners),
    max: Math.max(...corners),
  };
}

export default function DoubleIntegralsTargetLesson426({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [bounds, setBounds] = useState(start);
  const [surface, setSurface] = useState<Surface>("linear");
  const [nx, setNx] = useState(12);
  const [ny, setNy] = useState(10);
  const [columns, setColumns] = useState(true);
  const [mesh, setMesh] = useState(false);
  const [order, setOrder] = useState("dy dx");
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const result = stats(surface, bounds);
  const correct = graded && Math.abs(Number(answer) - 84) < 0.01;
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setBounds(start);
    setSurface("linear");
    setNx(12);
    setNy(10);
    setColumns(true);
    setMesh(false);
    setOrder("dy dx");
    setTab("Interact");
    setAnswer("");
    setGraded(false);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const setBound = (key: keyof Bounds, value: number) =>
    act(() =>
      setBounds((old) => {
        const next = { ...old, [key]: value };
        if (next.a > next.b) [next.a, next.b] = [next.b, next.a];
        if (next.c > next.d) [next.c, next.d] = [next.d, next.c];
        return next;
      }),
    );
  return (
    <section
      className="cs378-page di426-page"
      aria-label="Double integrals"
      data-testid="geometry3d-mockup-0611"
      data-lesson-title="Double Integrals"
      data-guidance="Drag solid surface orbit and manipulate the region, function, order, and Riemann partition."
      data-object-model="linked-svg-region-threejs-surface-generated-riemann-columns-editable-bounds-orders-exact-integral-real-challenge"
      data-direct-interaction="true"
      data-a={bounds.a}
      data-b={bounds.b}
      data-c={bounds.c}
      data-d={bounds.d}
      data-surface={surface}
      data-nx={nx}
      data-ny={ny}
      data-volume={fix(result.volume)}
      data-area={fix(result.area)}
      data-average={fix(result.average)}
      data-min={fix(result.min)}
      data-max={fix(result.max)}
      data-order={order}
      data-columns={columns}
      data-mesh={mesh}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="di426-hero">
        <section>
          <div>
            <small>LESSON 426</small>
            <small>3D MATHEMATICS</small>
          </div>
          <h1>Double Integrals</h1>
          <p>Interpret volume under surfaces.</p>
          <b>
            Objective:{" "}
            <span>
              Build a region in the xy-plane, visualise the surface z=f(x,y),
              and interpret ∫∫<sub>R</sub> f(x,y)dA as the volume under the
              surface.
            </span>
          </b>
        </section>
        <aside>
          <span>
            <b>Level</b>Senior Secondary
          </span>
          <span>
            <b>Time</b>30-45 min
          </span>
          <span>
            <b>Topics</b>Double integrals, Volume, Fubini
          </span>
        </aside>
      </header>
      <nav className="di426-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
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
      <section className="di426-lab">
        <header>
          <div>
            <h2>1. Observe &amp; Manipulate</h2>
            <p>
              Build a region R, choose the surface z=f(x,y), and explore the
              volume.
            </p>
          </div>
          <label>
            Order of integration{" "}
            <button
              className={order === "dy dx" ? "active" : ""}
              onClick={() => act(() => setOrder("dy dx"))}
            >
              dy dx
            </button>
            <button
              className={order === "dx dy" ? "active" : ""}
              onClick={() => act(() => setOrder("dx dy"))}
            >
              dx dy
            </button>
          </label>
        </header>
        <div className="di426-work">
          <Controls
            bounds={bounds}
            surface={surface}
            nx={nx}
            ny={ny}
            columns={columns}
            mesh={mesh}
            setBound={setBound}
            setSurface={(value) => act(() => setSurface(value))}
            setNx={(value) => act(() => setNx(value))}
            setNy={(value) => act(() => setNy(value))}
            setColumns={() => act(() => setColumns((value) => !value))}
            setMesh={() => act(() => setMesh((value) => !value))}
          />
          <Region bounds={bounds} />
          <article className="di426-scene">
            <h3>Surface and volume</h3>
            <output>z = {expression(surface)}</output>
            <IntegralCanvas
              bounds={bounds}
              surface={surface}
              nx={nx}
              ny={ny}
              columns={columns}
              mesh={mesh}
              onOrbit={onInteraction}
            />
          </article>
        </div>
        <div className="di426-metrics">
          {[
            ["Volume", result.volume],
            ["Min z on R", result.min],
            ["Max z on R", result.max],
            ["Avg height", result.average],
            ["Area of R", result.area],
          ].map(([name, value]) => (
            <span key={String(name)}>
              <b>{name}</b>
              <output>{fix(Number(value)).toFixed(3)}</output>
            </span>
          ))}
        </div>
        <div className="di426-integral">
          <article>
            <b>Volume as double integral ({order})</b>
            <output>
              ∫<sub>{bounds.a}</sub>
              <sup>{bounds.b}</sup> ∫<sub>{bounds.c}</sub>
              <sup>{bounds.d}</sup> ({expression(surface)}) {order} ={" "}
              {fix(result.volume)}
            </output>
          </article>
          <article>
            <b>Accumulated volume (approx.)</b>
            <progress max="100" value="100" />
            <span>100%</span>
            <output>{fix(result.volume)}</output>
          </article>
        </div>
      </section>
      <section className="di426-pattern">
        <h2>2. Notice the pattern</h2>
        <p>For z=x+y+1 over a rectangle [a,b] x [c,d].</p>
        <div>
          <article>
            <b>Average height</b>
            <output>[f(a,c)+f(b,c)+f(a,d)+f(b,d)] / 4</output>
          </article>
          <article>
            <b>Volume pattern</b>
            <output>
              ∫∫<sub>R</sub>f(x,y)dA = (Average height) x Area(R)
            </output>
          </article>
          <article>
            <b>Here</b>
            <p>Avg height = (1+4+3+6)/4 = 3.5</p>
            <p>Volume = 3.5 x (3 x 2) = 21</p>
          </article>
        </div>
      </section>
      <section className="di426-rule">
        <article>
          <h2>3. Understand the rule</h2>
          <b>Definition (Double Integral as Volume)</b>
          <p>
            If f(x,y)≥0 on a region R, then the volume under z=f(x,y) and above
            R is
          </p>
          <output>
            V = ∫∫<sub>R</sub> f(x,y)dA
          </output>
          <div>
            <b>Fubini's Theorem (Iterated Integrals)</b>
            <p>For a rectangle, either order integrates the same volume.</p>
          </div>
          <aside>
            <b>Common Misconception</b>
            <p>
              Do not add the limits. Integrate with respect to the inner
              variable first; the order of limits matters.
            </p>
          </aside>
        </article>
        <article>
          <h2>4. Worked Example</h2>
          <p>Find the volume under z=x+y+1 over R: 0≤x≤3, 0≤y≤2.</p>
          <div>
            <b>Solution (dy dx)</b>
            <output>
              V = ∫₀³∫₀²(x+y+1)dy dx
              <br />= ∫₀³(2x+4)dx
              <br />= [x²+4x]₀³ = 21
            </output>
          </div>
          <aside>
            <b>Check (dx dy)</b>
            <p>V=∫₀²∫₀³(x+y+1)dx dy=21</p>
          </aside>
        </article>
      </section>
      <section className="di426-challenge">
        <div>
          <h2>5. Try independently</h2>
          <p>Find the volume under z=x+2y+2 over 0≤x≤4, 0≤y≤3.</p>
          <button onClick={() => act(() => setGraded(true))}>
            Check my answer
          </button>
        </div>
        <label>
          Your answer
          <input
            aria-label="Challenge volume"
            type="number"
            value={answer}
            onChange={(event) =>
              act(() => {
                setAnswer(event.target.value);
                setGraded(false);
              })
            }
          />
        </label>
        <span>
          <b>Correct answer</b>
          <output>
            {graded ? (correct ? "84 - Correct" : "Try again") : "?"}
          </output>
        </span>
        <button onClick={() => act(() => setHint((value) => !value))}>
          Hint
        </button>
        {hint && <aside>Area is 12 and the average corner height is 7.</aside>}
      </section>
      <nav className="di426-adjacent">
        <button>
          <small>Previous Lesson</small>
          <b>425 Normal Vector</b>
        </button>
        <button>
          <small>Next Lesson</small>
          <b>427 Multivariable Optimisation</b>
        </button>
      </nav>
    </section>
  );
}

function Controls({
  bounds,
  surface,
  nx,
  ny,
  columns,
  mesh,
  setBound,
  setSurface,
  setNx,
  setNy,
  setColumns,
  setMesh,
}: {
  bounds: Bounds;
  surface: Surface;
  nx: number;
  ny: number;
  columns: boolean;
  mesh: boolean;
  setBound: (key: keyof Bounds, value: number) => void;
  setSurface: (value: Surface) => void;
  setNx: (value: number) => void;
  setNy: (value: number) => void;
  setColumns: () => void;
  setMesh: () => void;
}) {
  return (
    <aside className="di426-controls">
      <section>
        <h3>Region R in the xy-plane</h3>
        <label>
          Region type
          <select aria-label="Region type">
            <option>Rectangle</option>
          </select>
        </label>
        <b>x from a to b</b>
        <div>
          <input
            aria-label="Bound a"
            type="number"
            value={bounds.a}
            onChange={(e) => setBound("a", Number(e.target.value))}
          />
          <input
            aria-label="Bound b"
            type="number"
            value={bounds.b}
            onChange={(e) => setBound("b", Number(e.target.value))}
          />
        </div>
        <b>y from c to d</b>
        <div>
          <input
            aria-label="Bound c"
            type="number"
            value={bounds.c}
            onChange={(e) => setBound("c", Number(e.target.value))}
          />
          <input
            aria-label="Bound d"
            type="number"
            value={bounds.d}
            onChange={(e) => setBound("d", Number(e.target.value))}
          />
        </div>
      </section>
      <section>
        <h3>Surface</h3>
        <label>
          z=f(x,y)
          <select
            aria-label="Surface function"
            value={surface}
            onChange={(e) => setSurface(e.target.value as Surface)}
          >
            <option value="linear">x + y + 1</option>
            <option value="tilted">2x - y + 3</option>
            <option value="bowl">x² + y²</option>
          </select>
        </label>
        <p>Function: f(x,y)={expression(surface)}</p>
      </section>
      <section>
        <h3>Riemann columns</h3>
        <label>
          Nx (along x)
          <input
            aria-label="Nx partition"
            type="range"
            min="2"
            max="30"
            value={nx}
            onChange={(e) => setNx(Number(e.target.value))}
          />
          <output>{nx}</output>
        </label>
        <label>
          Ny (along y)
          <input
            aria-label="Ny partition"
            type="range"
            min="2"
            max="30"
            value={ny}
            onChange={(e) => setNy(Number(e.target.value))}
          />
          <output>{ny}</output>
        </label>
        <label>
          <input type="checkbox" checked={columns} onChange={setColumns} />
          Show columns
        </label>
        <label>
          <input type="checkbox" checked={mesh} onChange={setMesh} />
          Show mesh
        </label>
      </section>
    </aside>
  );
}

function Region({ bounds }: { bounds: Bounds }) {
  const sx = (x: number) => 45 + (x + 1) * 43,
    sy = (y: number) => 267 - (y + 1) * 62;
  return (
    <article className="di426-region">
      <h3>Region R in the xy-plane</h3>
      <svg viewBox="0 0 260 300">
        <path d="M28 267H246M45 285V20" className="axis" />
        <path
          d={`M${sx(bounds.a)} ${sy(bounds.c)}H${sx(bounds.b)}V${sy(bounds.d)}H${sx(bounds.a)}Z`}
          className="region"
        />
        <text
          x={(sx(bounds.a) + sx(bounds.b)) / 2}
          y={(sy(bounds.c) + sy(bounds.d)) / 2}
        >
          R
        </text>
        {[
          [bounds.a, bounds.c],
          [bounds.b, bounds.c],
          [bounds.a, bounds.d],
          [bounds.b, bounds.d],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={sx(x)} cy={sy(y)} r="4" />
            <text x={sx(x) + 6} y={sy(y) - 7}>
              ({x},{y})
            </text>
          </g>
        ))}
      </svg>
    </article>
  );
}

function IntegralCanvas({
  bounds,
  surface,
  nx,
  ny,
  columns,
  mesh,
  onOrbit,
}: {
  bounds: Bounds;
  surface: Surface;
  nx: number;
  ny: number;
  columns: boolean;
  mesh: boolean;
  onOrbit: () => void;
}) {
  const cells = useMemo(() => {
    const result = [];
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < ny; j++) {
        const dx = (bounds.b - bounds.a) / nx,
          dy = (bounds.d - bounds.c) / ny,
          x = bounds.a + (i + 0.5) * dx,
          y = bounds.c + (j + 0.5) * dy,
          z = Math.max(0, evaluate(surface, x, y));
        result.push({ x, y, z, dx, dy });
      }
    return result;
  }, [bounds, surface, nx, ny]);
  return (
    <Canvas camera={{ position: [7, 7, 8], fov: 42 }}>
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 8, 5]} intensity={1.5} />
      <gridHelper args={[8, 8, "#b7c1cd", "#e1e6eb"]} />
      {columns &&
        cells.map((cell, index) => (
          <mesh key={index} position={[cell.x, cell.z / 2, cell.y]}>
            <boxGeometry
              args={[cell.dx * 0.9, Math.max(0.01, cell.z), cell.dy * 0.9]}
            />
            <meshStandardMaterial color="#47d6c8" transparent opacity={0.72} />
          </mesh>
        ))}
      <SurfaceSheet bounds={bounds} surface={surface} wire={mesh} />
      <axesHelper args={[4]} />
      <OrbitControls
        target={[(bounds.a + bounds.b) / 2, 2, (bounds.c + bounds.d) / 2]}
        onStart={onOrbit}
      />
    </Canvas>
  );
}
function SurfaceSheet({
  bounds,
  surface,
  wire,
}: {
  bounds: Bounds;
  surface: Surface;
  wire: boolean;
}) {
  const geometry = useMemo(() => {
    const n = 18,
      pos: number[] = [],
      idx: number[] = [];
    for (let j = 0; j <= n; j++)
      for (let i = 0; i <= n; i++) {
        const x = bounds.a + ((bounds.b - bounds.a) * i) / n,
          y = bounds.c + ((bounds.d - bounds.c) * j) / n;
        pos.push(x, evaluate(surface, x, y), y);
      }
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const p = j * (n + 1) + i;
        idx.push(p, p + 1, p + n + 1, p + 1, p + n + 2, p + n + 1);
      }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geometry.setIndex(idx);
    geometry.computeVertexNormals();
    return geometry;
  }, [bounds, surface]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#c16ea6"
        transparent
        opacity={0.6}
        wireframe={wire}
        side={DoubleSide}
      />
    </mesh>
  );
}
