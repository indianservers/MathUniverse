import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./DistanceTargetLesson380.css";

type Point = [number, number, number];
const initialA: Point = [1, 2, 1];
const initialB: Point = [4, 6, 3];
const clean = (value: number) => Number(value.toFixed(1));

export default function DistanceTargetLesson380({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>(initialA);
  const [b, setB] = useState<Point>(initialB);
  const [components, setComponents] = useState(true);
  const [segment, setSegment] = useState(true);
  const [box, setBox] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [expanded, setExpanded] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [actions, setActions] = useState(0);
  const delta: Point = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const squared = delta.reduce((sum, value) => sum + value * value, 0);
  const distance = Number(Math.sqrt(squared).toFixed(2));
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setA(initialA);
    setB(initialB);
    setComponents(true);
    setSegment(true);
    setBox(true);
    setTab("Interaction + visualization");
    setExpanded(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const update = (
    setter: React.Dispatch<React.SetStateAction<Point>>,
    index: number,
    value: number,
  ) =>
    act(() =>
      setter(
        (point) =>
          point.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as Point,
      ),
    );

  return (
    <section
      className={`cs378-page d380-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0565"
      data-object-model="threejs-two-draggable-points-component-differences-distance-segment-rectangular-box-orbit-live-formula"
      data-a={JSON.stringify(a)}
      data-b={JSON.stringify(b)}
      data-delta={JSON.stringify(delta)}
      data-squared={squared}
      data-distance={distance}
      data-components={components}
      data-segment={segment}
      data-box={box}
      data-tab={tab}
      data-expanded={expanded}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Distance in 3D</h1>
        <p>Measure spatial separation.</p>
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
      <section className="d380-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Build the distance between two points in 3D</h2>
          </div>
          <strong>● All set</strong>
          <span>{actions} actions</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="d380-main">
          <article className="d380-scene">
            <div
              className="d380-canvas"
              data-testid="geometry3d-distance-canvas"
            >
              <Canvas camera={{ position: [5, 4, 12], fov: 42 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <DistanceScene
                  a={a}
                  b={b}
                  components={components}
                  segment={segment}
                  box={box}
                  cameraReset={cameraReset}
                  onA={(point) => act(() => setA(point))}
                  onB={(point) => act(() => setB(point))}
                />
              </Canvas>
            </div>
            <div className="d380-drag">
              <b>⌁ DRAG POINTS</b>
              <span>Drag A or B to update.</span>
            </div>
            <div className="d380-formula">
              d = √({delta[0]}² + {delta[1]}² + {delta[2]}²) = √{squared} ≈{" "}
              {distance}
            </div>
          </article>
          <aside className="d380-side">
            <PointControls
              name="Point A"
              color="#22c7e5"
              point={a}
              reset={() => act(() => setA(initialA))}
              update={(index, value) => update(setA, index, value)}
            />
            <PointControls
              name="Point B"
              color="#8247df"
              point={b}
              reset={() => act(() => setB(initialB))}
              update={(index, value) => update(setB, index, value)}
            />
            <section>
              <h3>Display options</h3>
              <Toggle
                label="Show component steps"
                checked={components}
                set={setComponents}
                act={act}
              />
              <Toggle
                label="Show distance segment"
                checked={segment}
                set={setSegment}
                act={act}
              />
              <Toggle
                label="Show rectangular box"
                checked={box}
                set={setBox}
                act={act}
              />
            </section>
            <section className="d380-results">
              <h3>Live results</h3>
              <p>
                Δx = x₂ − x₁{" "}
                <b className="x">
                  = {b[0]} − {a[0]} = {delta[0]}
                </b>
              </p>
              <p>
                Δy = y₂ − y₁{" "}
                <b className="y">
                  = {b[1]} − {a[1]} = {delta[1]}
                </b>
              </p>
              <p>
                Δz = z₂ − z₁{" "}
                <b className="z">
                  = {b[2]} − {a[2]} = {delta[2]}
                </b>
              </p>
              <hr />
              <p>
                <strong>Distance d</strong>
                <b className="d">
                  = √{squared} ≈ {distance}
                </b>
              </p>
              <strong>≈ {distance} units</strong>
            </section>
          </aside>
        </div>
      </section>
      <section className="d380-learning">
        <article>
          <h2>Formula</h2>
          <strong>d = √((x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²)</strong>
          <p>The 3D distance between points A(x₁,y₁,z₁) and B(x₂,y₂,z₂).</p>
          <small>
            Use differences in each coordinate, square them, add, then take the
            square root.
          </small>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Find the distance between A(1,2,1), B(4,6,3).</p>
          <p className="x">Δx = 4−1 = 3</p>
          <p className="y">Δy = 6−2 = 4</p>
          <p className="z">Δz = 3−1 = 2</p>
          <p>
            d = √(3²+4²+2²)
            <br />= √(9+16+4)
            <br />= √29 ≈ 5.39
          </p>
          <strong>Distance ≈ 5.39 units</strong>
        </article>
        <article>
          <h2>Practice challenge</h2>
          <p>Find the distance from P=(0,0,0) to Q=(2,−1,2).</p>
          <p className="x">Δx = 2−0 = 2</p>
          <p className="y">Δy = −1−0 = −1</p>
          <p className="z">Δz = 2−0 = 2</p>
          <p>
            d = √(2²+(−1)²+2²)
            <br />= √9 = 3
          </p>
          <strong>Distance = 3 units ✓</strong>
        </article>
      </section>
      <section className="d380-warning">
        <h2>! &nbsp; Common misconception</h2>
        <p>
          Do not ignore the z-change; 3D distance uses all three coordinate
          differences.
        </p>
        <strong>
          Using only x and y would give √(3² + 4²) = 5 (too large).
        </strong>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/379-3d-points">
          ←{" "}
          <span>
            <small>PREVIOUS</small>3D Points
          </span>
        </a>
        <a href="/lessons/3d-mathematics/381-lines-in-3d">
          <span>
            <small>NEXT</small>Lines in 3D
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function PointControls({
  name,
  color,
  point,
  reset,
  update,
}: {
  name: string;
  color: string;
  point: Point;
  reset: () => void;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="d380-point">
      <header>
        <h3>
          <i style={{ background: color }} />
          {name}
        </h3>
        <button aria-label={`Reset ${name}`} onClick={reset}>
          <RotateCcw />
        </button>
      </header>
      <div>
        {point.map((value, index) => (
          <label key={index}>
            {["x", "y", "z"][index]}
            <sub>{name.endsWith("A") ? "1" : "2"}</sub>
            <input
              aria-label={`${name} ${["x", "y", "z"][index]}`}
              type="number"
              min="-6"
              max="6"
              step="1"
              value={value}
              onChange={(event) => update(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  set,
  act,
}: {
  label: string;
  checked: boolean;
  set: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="cs378-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => set(event.target.checked))}
      />
    </label>
  );
}

function DistanceScene({
  a,
  b,
  components,
  segment,
  box,
  cameraReset,
  onA,
  onB,
}: {
  a: Point;
  b: Point;
  components: boolean;
  segment: boolean;
  box: boolean;
  cameraReset: number;
  onA: (point: Point) => void;
  onB: (point: Point) => void;
}) {
  const [dragging, setDragging] = useState<"A" | "B" | null>(null);
  const world = (point: Point): Point => [point[0], point[2], point[1]];
  const aw = world(a),
    bw = world(b),
    c1: Point = [b[0], a[2], a[1]],
    c2: Point = [b[0], a[2], b[1]];
  const move = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const point: Point = [
      clean(event.point.x),
      clean(event.point.z),
      dragging === "A" ? a[2] : b[2],
    ];
    (dragging === "A" ? onA : onB)(point);
  };
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1, 1.5, 1]}
        minDistance={7}
        maxDistance={22}
        enabled={!dragging}
      />
      <gridHelper args={[14, 14, "#244a78", "#173150"]} />
      <Line
        points={[
          [-6, 0, 0],
          [7, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -6],
          [0, 0, 7],
        ]}
        color="#56b43c"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -5, 0],
          [0, 7, 0],
        ]}
        color="#23bcd9"
        lineWidth={3}
      />
      {box && (
        <>
          <Line
            points={[aw, [b[0], a[2], a[1]], c2, bw]}
            color="#8294aa"
            dashed
          />
          <Line points={[[b[0], 0, a[1]], c1]} color="#8294aa" dashed />
          <Line points={[[b[0], 0, b[1]], bw]} color="#8294aa" dashed />
          <Line points={[[a[0], 0, a[1]], aw]} color="#8294aa" dashed />
        </>
      )}
      {components && (
        <>
          <Line points={[aw, c1]} color="#ef5148" lineWidth={4} />
          <Line points={[c1, c2]} color="#56b43c" lineWidth={4} />
          <Line points={[c2, bw]} color="#23bcd9" lineWidth={4} />
          <Text
            position={[(a[0] + b[0]) / 2, a[2] - 0.3, a[1]]}
            fontSize={0.33}
            color="#ff625a"
          >
            Δx = {b[0] - a[0]}
          </Text>
          <Text
            position={[b[0], a[2] - 0.3, (a[1] + b[1]) / 2]}
            fontSize={0.33}
            color="#65d94c"
          >
            Δy = {b[1] - a[1]}
          </Text>
          <Text
            position={[b[0] + 0.35, (a[2] + b[2]) / 2, b[1]]}
            fontSize={0.33}
            color="#36d2eb"
          >
            Δz = {b[2] - a[2]}
          </Text>
        </>
      )}
      {segment && <Line points={[aw, bw]} color="#f5f8fb" lineWidth={5} />}
      <DraggablePoint
        id="A"
        point={a}
        color="#22c7e5"
        onDown={() => setDragging("A")}
      />
      <DraggablePoint
        id="B"
        point={b}
        color="#8247df"
        onDown={() => setDragging("B")}
      />
      {dragging && (
        <mesh
          position={[0, dragging === "A" ? a[2] : b[2], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={move}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
        >
          <planeGeometry args={[24, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

function DraggablePoint({
  id,
  point,
  color,
  onDown,
}: {
  id: string;
  point: Point;
  color: string;
  onDown: () => void;
}) {
  return (
    <group position={[point[0], point[2], point[1]]}>
      <mesh
        onPointerDown={(event) => {
          event.stopPropagation();
          onDown();
        }}
      >
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
        />
      </mesh>
      <Billboard position={[0.35, 0.35, 0]}>
        <Text fontSize={0.25} color={color}>
          {id} ({point.join(", ")})
        </Text>
      </Billboard>
    </group>
  );
}

function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(5, 4, 12);
    camera.lookAt(1, 1.5, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
