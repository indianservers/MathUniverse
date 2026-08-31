import { Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PointsTargetLesson379.css";

type Point = { id: string; color: string; value: [number, number, number] };
const defaults: Point[] = [
  { id: "A", color: "#22c7e5", value: [2, 1, 3] },
  { id: "B", color: "#8247df", value: [-2, 3, 1] },
  { id: "C", color: "#f4ad16", value: [3, -1, 2] },
];
const clean = (value: number) => Number(value.toFixed(1));
export default function PointsTargetLesson379({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<Point[]>(defaults),
    [selected, setSelected] = useState("A"),
    [labels, setLabels] = useState(true),
    [drops, setDrops] = useState(true),
    [shadow, setShadow] = useState(true),
    [path, setPath] = useState(true),
    [challenge, setChallenge] = useState("A"),
    [grade, setGrade] = useState("correct"),
    [expanded, setExpanded] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [actions, setActions] = useState(0);
  const current = points.find((point) => point.id === selected) ?? points[0],
    highest = points.reduce(
      (best, point) => (point.value[2] > best.value[2] ? point : best),
      points[0],
    );
  const reset = () => {
    setPoints(defaults);
    setSelected("A");
    setLabels(true);
    setDrops(true);
    setShadow(true);
    setPath(true);
    setChallenge("A");
    setGrade("correct");
    setExpanded(false);
    setTab("Interaction + visualization");
    setCameraReset((v) => v + 1);
    setActions(0);
  };
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(reset, [resetToken]);
  const update = (index: number, value: number) =>
    act(() =>
      setPoints((currentPoints) =>
        currentPoints.map((point) =>
          point.id === selected
            ? {
                ...point,
                value: point.value.map((item, itemIndex) =>
                  itemIndex === index ? clean(value) : item,
                ) as [number, number, number],
              }
            : point,
        ),
      ),
    );
  const setSelectedPoint = (value: [number, number, number]) =>
    act(() =>
      setPoints((currentPoints) =>
        currentPoints.map((point) =>
          point.id === selected ? { ...point, value } : point,
        ),
      ),
    );
  const addPoint = () =>
    act(() => {
      const id = String.fromCharCode(65 + points.length);
      setPoints((currentPoints) => [
        ...currentPoints,
        { id, color: "#ef5c68", value: [0, 0, 0] },
      ]);
      setSelected(id);
    });
  const snap = () =>
    act(() =>
      setPoints((currentPoints) =>
        currentPoints.map((point) =>
          point.id === selected
            ? {
                ...point,
                value: point.value.map(Math.round) as [number, number, number],
              }
            : point,
        ),
      ),
    );
  const signs = current.value
    .map((value) => (value > 0 ? "+" : value < 0 ? "-" : "0"))
    .join(", ");
  return (
    <section
      className={`cs378-page p379-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0564"
      data-object-model="threejs-multi-point-selector-draggable-selected-point-add-snap-labels-drop-lines-shadow-step-path-table-height-octant-challenge"
      data-points={JSON.stringify(points.map((point) => point.value))}
      data-selected={selected}
      data-highest={highest.id}
      data-labels={labels}
      data-drops={drops}
      data-shadow={shadow}
      data-path={path}
      data-grade={grade}
      data-expanded={expanded}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>3D Points</h1>
        <p>Plot locations in space.</p>
        <nav>
          <span>Intermediate-Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6-10 min</span>
        </nav>
        <div className="cs378-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>
            <ExternalLink />
            Workspace
          </button>
        </div>
      </header>
      <nav className="cs378-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="p379-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>3D Point Plotter</h2>
            <p>
              Plot points in 3D space, read coordinates, and compare positions.
            </p>
          </div>
          <strong>All changes saved</strong>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((v) => !v))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="p379-main">
          <article className="p379-plot">
            <div className="p379-canvas" data-testid="geometry3d-points-canvas">
              <Canvas camera={{ position: [9, 7, 10], fov: 43 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[6, 8, 5]} intensity={2} />
                <PointsScene
                  points={points}
                  selected={selected}
                  labels={labels}
                  drops={drops}
                  shadow={shadow}
                  path={path}
                  cameraReset={cameraReset}
                  onSelect={(id) => act(() => setSelected(id))}
                  onPoint={setSelectedPoint}
                />
              </Canvas>
            </div>
            <div className="p379-viewcube" aria-hidden="true">
              <span>TOP</span>
              <span>LEFT</span>
              <span>FRONT</span>
            </div>
            <div className="p379-legend">
              <span>x-axis</span>
              <span>y-axis</span>
              <span>z-axis</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Point</th>
                  <th>x</th>
                  <th>y</th>
                  <th>z</th>
                  <th>Ordered triple (x,y,z)</th>
                  <th>Controls height?</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr
                    key={point.id}
                    className={point.id === selected ? "selected" : ""}
                    onClick={() => act(() => setSelected(point.id))}
                  >
                    <td>
                      <i style={{ background: point.color }} />
                      {point.id}
                    </td>
                    <td>{point.value[0]}</td>
                    <td>{point.value[1]}</td>
                    <td>{point.value[2]}</td>
                    <td>({point.value.join(", ")})</td>
                    <td>z-coordinate</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <aside className="p379-side">
            <section>
              <h3>Controls</h3>
              <label>
                Selected point
                <select
                  aria-label="Selected point"
                  value={selected}
                  onChange={(event) =>
                    act(() => setSelected(event.target.value))
                  }
                >
                  {points.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.id} ({point.value.join(", ")})
                    </option>
                  ))}
                </select>
              </label>
              <Control
                label="x"
                value={current.value[0]}
                color="#ef5148"
                onChange={(value) => update(0, value)}
              />
              <Control
                label="y"
                value={current.value[1]}
                color="#56b43c"
                onChange={(value) => update(1, value)}
              />
              <Control
                label="z"
                value={current.value[2]}
                color="#1c8fe0"
                onChange={(value) => update(2, value)}
              />
              <div className="p379-commands">
                <button onClick={addPoint}>＋ Add point</button>
                <button onClick={snap}>▦ Snap to grid</button>
              </div>
            </section>
            <section>
              <h3>Display options</h3>
              <Toggle
                label="Show labels"
                checked={labels}
                setter={setLabels}
                act={act}
              />
              <Toggle
                label="Show drop lines"
                checked={drops}
                setter={setDrops}
                act={act}
              />
              <Toggle
                label="Show xy shadow"
                checked={shadow}
                setter={setShadow}
                act={act}
              />
              <Toggle
                label="Show step path (selected)"
                checked={path}
                setter={setPath}
                act={act}
              />
            </section>
            <section className="p379-results">
              <h3>Live results</h3>
              <p>
                Selected point{" "}
                <b style={{ color: current.color }}>{current.id}</b> (
                {current.value.join(", ")})
              </p>
              <p>
                Height (z) <b>{current.value[2]}</b>
              </p>
              <p>
                xy shadow{" "}
                <b>
                  ({current.value[0]}, {current.value[1]}, 0)
                </b>
              </p>
              <p>
                Quadrant/Octant <b>({signs})</b>
              </p>
              <small>Sign pattern shows (+ or -) for (x,y,z).</small>
            </section>
          </aside>
        </div>
      </section>
      <section className="p379-learning">
        <article>
          <h2>Rule</h2>
          <p>Point labels use ordered triples (x,y,z).</p>
          <p>The order matters:</p>
          <p>
            x: left/right
            <br />
            y: forward/back
            <br />
            z: up/down (height)
          </p>
          <strong>Height of a point is always the z-coordinate.</strong>
        </article>
        <article className="p379-worked">
          <h2>Worked example</h2>
          <p>Plot A=(2,1,3).</p>
          <p>
            ① Move 2 units along +x.
            <br />② Move 1 unit along +y.
            <br />③ Move 3 units up along +z.
          </p>
          <p>Result: A is at (2,1,3). Height (z)=3</p>
          <svg viewBox="0 0 110 110" role="img" aria-label="Point A step path">
            <line x1="25" y1="84" x2="88" y2="84" className="x" />
            <line x1="25" y1="84" x2="8" y2="101" className="y" />
            <line x1="25" y1="84" x2="25" y2="12" className="z" />
            <polyline points="25,84 58,84 72,70 72,34" />
            <circle cx="72" cy="34" r="5" />
            <text x="90" y="88">
              x
            </text>
            <text x="2" y="108">
              y
            </text>
            <text x="20" y="10">
              z
            </text>
            <text x="77" y="29">
              A
            </text>
          </svg>
        </article>
        <article className="p379-challenge">
          <h2>Practice challenge</h2>
          <h3>Which point is highest?</h3>
          <p>A=(2,1,3), B=(-2,3,1), C=(3,-1,2)</p>
          {points.slice(0, 3).map((point) => (
            <button
              key={point.id}
              className={challenge === point.id ? "selected" : ""}
              onClick={() =>
                act(() => {
                  setChallenge(point.id);
                  setGrade(point.id === highest.id ? "correct" : "incorrect");
                })
              }
            >
              {point.id}. {point.id} ({point.value.join(", ")})
            </button>
          ))}
          <strong className={grade}>
            ✓{" "}
            {grade === "correct"
              ? `Correct! Height is the z-coordinate. ${highest.id} is highest.`
              : "Compare the z-coordinates."}
          </strong>
        </article>
      </section>
      <section className="p379-warning">
        <h2>Common misconception</h2>
        <p>
          <b>Height is the z-coordinate,</b> not the last point drawn or the
          largest x-value.
        </p>
        <p>
          A point can have a small or negative x but still be the highest if its
          z-value is greatest.
        </p>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/378-3d-coordinate-system">
          ←{" "}
          <span>
            <small>PREVIOUS</small>3D Coordinate System
          </span>
        </a>
        <a href="/lessons/3d-mathematics/380-distance-in-3d">
          <span>
            <small>NEXT</small>Distance in 3D
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function PointsScene({
  points,
  selected,
  labels,
  drops,
  shadow,
  path,
  cameraReset,
  onSelect,
  onPoint,
}: {
  points: Point[];
  selected: string;
  labels: boolean;
  drops: boolean;
  shadow: boolean;
  path: boolean;
  cameraReset: number;
  onSelect: (id: string) => void;
  onPoint: (point: [number, number, number]) => void;
}) {
  const [dragging, setDragging] = useState(false),
    current = points.find((point) => point.id === selected) ?? points[0];
  const move = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onPoint([clean(event.point.x), clean(event.point.z), current.value[2]]);
  };
  return (
    <>
      <CameraHome resetToken={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[0, 1.5, 0]}
        minDistance={7}
        maxDistance={22}
        enabled={!dragging}
      />
      <gridHelper args={[12, 12, "#244a78", "#173150"]} />
      <gridHelper
        args={[12, 12, "#244a78", "#142c48"]}
        position={[0, 0, -6]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper
        args={[12, 12, "#244a78", "#142c48"]}
        position={[-6, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      <Line
        points={[
          [-5, 0, 0],
          [6, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -5],
          [0, 0, 6],
        ]}
        color="#56b43c"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -5, 0],
          [0, 6, 0],
        ]}
        color="#23bcd9"
        lineWidth={3}
      />
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((tick) => (
        <group key={tick}>
          <Text position={[tick, -0.23, 0.15]} fontSize={0.2} color="#e9f4ff">
            {tick}
          </Text>
          <Text position={[0.15, -0.23, tick]} fontSize={0.2} color="#e9f4ff">
            {tick}
          </Text>
          <Text position={[0.18, tick, 0]} fontSize={0.2} color="#e9f4ff">
            {tick}
          </Text>
        </group>
      ))}
      <Text position={[5.8, 0.22, 0]} fontSize={0.34} color="#ff625a">
        x
      </Text>
      <Text position={[0, 0.22, 5.8]} fontSize={0.34} color="#65d94c">
        y
      </Text>
      <Text position={[0.25, 5.7, 0]} fontSize={0.34} color="#36d2eb">
        z
      </Text>
      {points.map((point) => {
        const [x, y, z] = point.value,
          pos: [number, number, number] = [x, z, y];
        return (
          <group key={point.id}>
            {drops && (
              <Line
                points={[pos, [x, 0, y]]}
                color={point.color}
                dashed
                lineWidth={2}
              />
            )}{" "}
            {shadow && (
              <mesh position={[x, 0.02, y]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.12, 20]} />
                <meshBasicMaterial color={point.color} />
              </mesh>
            )}
            {path && point.id === selected && (
              <Line
                points={[[0, 0, 0], [x, 0, 0], [x, 0, y], pos]}
                color="#eaf5ff"
                dashed
              />
            )}
            <mesh
              position={pos}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect(point.id);
                setDragging(true);
              }}
              onPointerUp={() => setDragging(false)}
            >
              <sphereGeometry
                args={[point.id === selected ? 0.2 : 0.15, 24, 24]}
              />
              <meshStandardMaterial
                color={point.color}
                emissive={point.color}
                emissiveIntensity={0.4}
              />
            </mesh>
            {labels && (
              <Text position={[0.48, 0.38, 0]} fontSize={0.42} color="#fff">
                {point.id} ({point.value.join(", ")})
              </Text>
            )}
          </group>
        );
      })}
      {dragging && (
        <mesh
          position={[0, current.value[2], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={move}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
function CameraHome({ resetToken }: { resetToken: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(9, 7, 10);
    camera.lookAt(0, 1.5, 0);
    camera.updateProjectionMatrix();
  }, [camera, resetToken]);
  return null;
}
function Control({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="cs378-control">
      <b>{label}</b>
      <div>
        <input
          aria-label={label}
          style={{ accentColor: color }}
          type="range"
          min="-5"
          max="5"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min="-5"
          max="5"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>-5</span>
        <span>5</span>
      </small>
    </label>
  );
}
function Toggle({
  label,
  checked,
  setter,
  act,
}: {
  label: string;
  checked: boolean;
  setter: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="cs378-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => setter(event.target.checked))}
      />
    </label>
  );
}
