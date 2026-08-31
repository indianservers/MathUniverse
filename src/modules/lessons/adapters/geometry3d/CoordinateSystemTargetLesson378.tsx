import { Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Box, ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";

type Point = [number, number, number];
const clean = (value: number) => Number(value.toFixed(1));
export default function CoordinateSystemTargetLesson378({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState<Point>([3, 2, 4]),
    [planes, setPlanes] = useState(true),
    [path, setPath] = useState(true),
    [labels, setLabels] = useState(true),
    [challenge, setChallenge] = useState("C"),
    [grade, setGrade] = useState("idle"),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [expanded, setExpanded] = useState(false),
    [actions, setActions] = useState(0);
  const distance = Number(Math.hypot(...point).toFixed(2));
  const reset = () => {
    setPoint([3, 2, 4]);
    setPlanes(true);
    setPath(true);
    setLabels(true);
    setChallenge("C");
    setGrade("idle");
    setTab("Interaction + visualization");
    setCameraReset((v) => v + 1);
    setExpanded(false);
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
      setPoint(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as Point,
      ),
    );
  return (
    <section
      className={`cs378-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0563"
      data-object-model="threejs-draggable-ordered-triple-spatial-axes-projection-planes-step-path-distance-orbit-graded-coordinate-order"
      data-point={JSON.stringify(point)}
      data-distance={distance}
      data-planes={planes}
      data-path={path}
      data-labels={labels}
      data-challenge={challenge}
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
        <h1>3D Coordinate System</h1>
        <p>Understand spatial axes.</p>
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
      <section className="cs378-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Locate a point in 3D using ordered triples (x, y, z).</h2>
          </div>
          <strong>
            {actions ? "Live interaction" : "Awaiting interaction"}
          </strong>
          <span>{actions} actions</span>
        </header>
        <div className="cs378-main">
          <article className="cs378-scene">
            <div className="cs378-path">
              <h3>Path to P({point.join(", ")}):</h3>
              <p>
                <i>1</i>Move {point[0]} along {point[0] >= 0 ? "+" : "-"}x
              </p>
              <p>
                <i>2</i>Move {Math.abs(point[1])} along{" "}
                {point[1] >= 0 ? "+" : "-"}y
              </p>
              <p>
                <i>3</i>Move {Math.abs(point[2])} along{" "}
                {point[2] >= 0 ? "+" : "-"}z
              </p>
            </div>
            <div className="cs378-canvas" data-testid="geometry3d-canvas">
              <Canvas camera={{ position: [9, 8, 10], fov: 42 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#07162d"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 8, 5]} intensity={2} />
                <SpatialScene
                  point={point}
                  planes={planes}
                  path={path}
                  labels={labels}
                  cameraReset={cameraReset}
                  onPoint={(next) => act(() => setPoint(next))}
                />
              </Canvas>
            </div>
            <div className="cs378-tools">
              <button
                title="Reset camera"
                onClick={() => act(() => setCameraReset((v) => v + 1))}
              >
                <RotateCcw />
              </button>
              <button
                title="Toggle projection planes"
                onClick={() => act(() => setPlanes((v) => !v))}
              >
                <Box />
              </button>
              <button
                title="Toggle fullscreen"
                onClick={() => act(() => setExpanded((v) => !v))}
              >
                <Maximize2 />
              </button>
            </div>
            <footer>
              ⓘ Drag the point to move it · Drag the scene to orbit · Scroll to
              zoom
            </footer>
          </article>
          <aside className="cs378-side">
            <section className="cs378-controls">
              <h3>Controls</h3>
              <Control
                label="x (left / right)"
                value={point[0]}
                color="#ef5148"
                onChange={(value) => update(0, value)}
              />
              <Control
                label="y (forward / back)"
                value={point[1]}
                color="#5eb93f"
                onChange={(value) => update(1, value)}
              />
              <Control
                label="z (up / down)"
                value={point[2]}
                color="#27b8d4"
                onChange={(value) => update(2, value)}
              />
              <Toggle
                label="Show projection planes"
                checked={planes}
                setter={setPlanes}
                act={act}
              />
              <Toggle
                label="Show step path"
                checked={path}
                setter={setPath}
                act={act}
              />
              <Toggle
                label="Show axis labels"
                checked={labels}
                setter={setLabels}
                act={act}
              />
            </section>
            <section className="cs378-current">
              <h3>Current point</h3>
              <div>
                <small>Ordered triple</small>
                <strong>
                  P = (<i>{point[0]}</i>, <i>{point[1]}</i>, <i>{point[2]}</i>)
                </strong>
              </div>
            </section>
            <section className="cs378-measure">
              <h3>Measurements</h3>
              <p>
                Distance from origin{" "}
                <b>
                  √{point[0] ** 2 + point[1] ** 2 + point[2] ** 2} ≈ {distance}{" "}
                  units
                </b>
              </p>
              <p>
                xy-plane projection{" "}
                <b>
                  ({point[0]}, {point[1]}, 0)
                </b>
              </p>
              <p>
                xz-plane projection{" "}
                <b>
                  ({point[0]}, 0, {point[2]})
                </b>
              </p>
              <p>
                yz-plane projection{" "}
                <b>
                  (0, {point[1]}, {point[2]})
                </b>
              </p>
            </section>
          </aside>
        </div>
      </section>
      <section className="cs378-learning">
        <article>
          <h2>Rule to remember</h2>
          <p>A 3D point is written (x, y, z):</p>
          <p>
            <b>x:</b> left (-) / right (+)
            <br />
            <b>y:</b> back (-) / forward (+)
            <br />
            <b>z:</b> down (-) / up (+)
          </p>
          <p>Order matters: (x,y,z) ≠ (y,x,z)</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Locate P=(3,2,4)</p>
          <p>
            ① Start at origin (0,0,0).
            <br />② Move 3 units along +x.
            <br />③ Move 2 units along +y.
            <br />④ Move 4 units along +z.
          </p>
          <p>That point is P=(3,2,4).</p>
        </article>
        <article className="cs378-challenge">
          <h2>Practice challenge</h2>
          <p>Place Q=(-2,3,1) on the 3D axes.</p>
          <h3>Which coordinate tells the height?</h3>
          <div>
            {[
              ["A", "-2"],
              ["B", "3"],
              ["C", "1"],
            ].map(([key, value]) => (
              <button
                key={key}
                className={challenge === key ? "selected" : ""}
                onClick={() =>
                  act(() => {
                    setChallenge(key);
                    setGrade("idle");
                  })
                }
              >
                {key} {value}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              act(() => setGrade(challenge === "C" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          {grade !== "idle" && (
            <strong className={grade}>
              {grade === "correct"
                ? "Correct: z=1 is the height."
                : "Height is the z-coordinate."}
            </strong>
          )}
        </article>
      </section>
      <section className="cs378-warning">
        <h2>Common misconception</h2>
        <p>
          <b>The order matters:</b> (3,2,4) and (2,3,4) are different points.
        </p>
        <p>
          Same height (z), but different left/right and forward/back positions.
        </p>
        <strong>(3,2,4) ≠ (2,3,4)</strong>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/graphs-and-functions/364-2d-graph-review">
          ←{" "}
          <span>
            <small>PREVIOUS</small>2D Graph Review
          </span>
        </a>
        <a href="/lessons/3d-mathematics/379-3d-points">
          <span>
            <small>NEXT</small>3D Points
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function SpatialScene({
  point,
  planes,
  path,
  labels,
  cameraReset,
  onPoint,
}: {
  point: Point;
  planes: boolean;
  path: boolean;
  labels: boolean;
  cameraReset: number;
  onPoint: (point: Point) => void;
}) {
  const dragging = useRef(false);
  const position: [number, number, number] = [point[0], point[2], point[1]];
  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    event.stopPropagation();
    onPoint([clean(event.point.x), point[1], clean(event.point.z)]);
  };
  return (
    <>
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1.5, 1.8, 1]}
        minDistance={7}
        maxDistance={22}
      />
      <gridHelper args={[12, 12, "#244a78", "#173150"]} />
      {planes && (
        <>
          <mesh position={[0, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[10, 8]} />
            <meshBasicMaterial
              color="#224f75"
              transparent
              opacity={0.2}
              side={2}
            />
          </mesh>
          <mesh position={[2, 3, 0]}>
            <planeGeometry args={[10, 8]} />
            <meshBasicMaterial
              color="#71363d"
              transparent
              opacity={0.18}
              side={2}
            />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial
              color="#17496c"
              transparent
              opacity={0.25}
              side={2}
            />
          </mesh>
        </>
      )}
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
        color="#5eb93f"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -1, 0],
          [0, 7, 0],
        ]}
        color="#27b8d4"
        lineWidth={3}
      />
      {path && (
        <Line
          points={[
            [0, 0, 0],
            [point[0], 0, 0],
            [point[0], 0, point[1]],
            position,
          ]}
          color="#f4f7fb"
          dashed
          lineWidth={2}
        />
      )}
      <Line
        points={[position, [point[0], 0, point[1]]]}
        color="#28bed6"
        dashed
      />
      <mesh
        position={position}
        onPointerDown={(event) => {
          event.stopPropagation();
          dragging.current = true;
        }}
        onPointerUp={() => (dragging.current = false)}
      >
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#25c1e4"
          emissive="#0b6a83"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh
        position={[0, point[2], 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={move}
        onPointerUp={() => (dragging.current = false)}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {labels && (
        <>
          <Text position={[6.3, 0, 0]} fontSize={0.35} color="#ff594e">
            x
          </Text>
          <Text position={[0, 0, 6.3]} fontSize={0.35} color="#66c94c">
            y
          </Text>
          <Text position={[0, 7.2, 0]} fontSize={0.35} color="#31c5e2">
            z
          </Text>
          <Text
            position={[point[0] + 0.4, point[2] + 0.4, point[1]]}
            fontSize={0.3}
            color="#31c5e2"
          >
            P = ({point.join(", ")})
          </Text>
        </>
      )}
    </>
  );
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
          min="-10"
          max="10"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min="-10"
          max="10"
          step=".1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <small>
        <span>-10</span>
        <span>10</span>
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
