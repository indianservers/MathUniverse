import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./ParallelPlanesTargetLesson383.css";

type Plane = [number, number, number, number];
type Point3 = [number, number, number];
const initialA: Plane = [1, 2, 2, 6],
  initialB: Plane = [2, 4, 4, 10],
  clean = (value: number) => Number(value.toFixed(2));
const normal = (plane: Plane) => plane.slice(0, 3) as [number, number, number];
const dot = (first: number[], second: number[]) =>
  first.reduce((sum, value, index) => sum + value * second[index], 0);
const cross = (u: number[], v: number[]) => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
const magnitude = (vector: number[]) => Math.hypot(...vector);
function relationOf(first: Plane, second: Plane) {
  const n1 = normal(first),
    n2 = normal(second),
    valid = magnitude(n1) >= 0.001 && magnitude(n2) >= 0.001,
    parallel = magnitude(cross(n1, n2)) < 0.001,
    perpendicular = Math.abs(dot(n1, n2)) < 0.001;
  return !valid
    ? "Neither"
    : parallel
      ? "Parallel"
      : perpendicular
        ? "Perpendicular"
        : "Neither";
}
function separationOf(first: Plane, second: Plane) {
  const n1 = normal(first),
    n2 = normal(second),
    index = n1.findIndex((value) => Math.abs(value) > 0.001),
    scale = index >= 0 ? n2[index] / n1[index] : 0;
  return relationOf(first, second) === "Parallel"
    ? clean(Math.abs(second[3] / scale - first[3]) / magnitude(n1))
    : null;
}

export default function ParallelPlanesTargetLesson383({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [planeA, setPlaneA] = useState<Plane>(initialA),
    [planeB, setPlaneB] = useState<Plane>(initialB),
    [normals, setNormals] = useState(true),
    [separation, setSeparation] = useState(true),
    [dotLayer, setDotLayer] = useState(true),
    [choice, setChoice] = useState("Parallel"),
    [challenge, setChallenge] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [expanded, setExpanded] = useState(false),
    [cameraReset, setCameraReset] = useState(0),
    [actions, setActions] = useState(0);
  const n1 = normal(planeA),
    n2 = normal(planeB),
    dotProduct = dot(n1, n2),
    relation = relationOf(planeA, planeB),
    distance = separationOf(planeA, planeB),
    scalar =
      relation === "Parallel"
        ? clean(
            n2[n1.findIndex((value) => Math.abs(value) > 0.001)] /
              n1[n1.findIndex((value) => Math.abs(value) > 0.001)],
          )
        : null,
    correctChoice = choice === relation;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setPlaneA(initialA);
    setPlaneB(initialB);
    setNormals(true);
    setSeparation(true);
    setDotLayer(true);
    setChoice("Parallel");
    setChallenge(true);
    setTab("Interaction + visualization");
    setExpanded(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const update = (
    setter: React.Dispatch<React.SetStateAction<Plane>>,
    index: number,
    value: number,
  ) =>
    act(() =>
      setter(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as Plane,
      ),
    );
  return (
    <section
      className={`cs378-page pp383-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0568"
      data-object-model="threejs-two-editable-planes-normal-relation-cross-dot-scalar-multiple-separation-classification-orbit-challenge"
      data-plane-a={JSON.stringify(planeA)}
      data-plane-b={JSON.stringify(planeB)}
      data-normal-a={JSON.stringify(n1)}
      data-normal-b={JSON.stringify(n2)}
      data-dot={dotProduct}
      data-relation={relation}
      data-separation={distance}
      data-scalar={scalar}
      data-choice={choice}
      data-choice-correct={correctChoice}
      data-normals={normals}
      data-separation-layer={separation}
      data-dot-layer={dotLayer}
      data-challenge={challenge}
      data-tab={tab}
      data-expanded={expanded}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Parallel and Perpendicular Planes</h1>
        <p>Explore spatial orientation.</p>
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
      <section className="pp383-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Compare two planes by their normals</h2>
          </div>
          <strong>● Live</strong>
          <span>Auto-updated</span>
          <button onClick={() => act(() => {})}>▣ Actions</button>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="pp383-main">
          <article className="pp383-scene">
            <div
              className="pp383-canvas"
              data-testid="geometry3d-parallel-planes-canvas"
            >
              <Canvas camera={{ position: [9, 7, 11], fov: 43 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <ComparisonScene
                  planeA={planeA}
                  planeB={planeB}
                  normals={normals}
                  separation={separation}
                  cameraReset={cameraReset}
                />
              </Canvas>
            </div>
            <b className="pp383-drag">
              ☝ DRAG SCENE
              <br />
              <small>Rotate · Pan · Zoom</small>
            </b>
            <div className="pp383-cube">
              TOP
              <br />
              FRONT / RIGHT
            </div>
          </article>
          <aside className="pp383-side">
            <h3>Define the planes (ax + by + cz = d)</h3>
            <PlaneInputs
              name="Plane A"
              color="blue"
              plane={planeA}
              update={(index, value) => update(setPlaneA, index, value)}
            />
            <PlaneInputs
              name="Plane B"
              color="purple"
              plane={planeB}
              update={(index, value) => update(setPlaneB, index, value)}
            />
            <h3>Classify relationship</h3>
            <div className="pp383-choices">
              {["Parallel", "Perpendicular", "Neither"].map((item) => (
                <button
                  key={item}
                  className={
                    choice === item
                      ? correctChoice
                        ? "selected correct"
                        : "selected wrong"
                      : ""
                  }
                  onClick={() => act(() => setChoice(item))}
                >
                  {item}
                </button>
              ))}
            </div>
            <h3>Display options</h3>
            <Toggle
              label="Show normals (n₁, n₂)"
              checked={normals}
              set={setNormals}
              act={act}
            />
            <Toggle
              label="Show separation distance"
              checked={separation}
              set={setSeparation}
              act={act}
            />
            <Toggle
              label="Show dot product (n₁ · n₂)"
              checked={dotLayer}
              set={setDotLayer}
              act={act}
            />
            <section className="pp383-results">
              <h3>Live results</h3>
              <p>
                n₁ = ⟨{n1.join(", ")}⟩<br />
                n₂ = ⟨{n2.join(", ")}⟩
              </p>
              {scalar !== null && <p>n₂ = {scalar}n₁</p>}
              {dotLayer && <p>n₁ · n₂ = {dotProduct}</p>}
              <strong>Classification: {relation} planes</strong>
              {distance !== null && (
                <small>Exact separation: {distance} units</small>
              )}
            </section>
          </aside>
        </div>
        <div className="pp383-summary">
          <b>✓ Comparison</b>
          <span>
            {relation === "Parallel"
              ? `n₂ = ${scalar}n₁ → normals are scalar multiples.`
              : relation === "Perpendicular"
                ? `n₁ · n₂ = 0 → normals are perpendicular.`
                : "Normals are neither scalar multiples nor perpendicular."}
          </span>
          <strong>Therefore, the planes are {relation.toLowerCase()}.</strong>
        </div>
      </section>
      <section className="pp383-learning">
        <article>
          <h2>▣ The rule</h2>
          <p>Let planes be defined as ax+by+cz=d₁ and ex+fy+gz=d₂.</p>
          <strong>
            Parallel planes:
            <br />
            n₂=kn₁ for some scalar k≠0.
          </strong>
          <strong>
            Perpendicular planes:
            <br />
            n₁·n₂=0
          </strong>
          <small>Scalars d₁ and d₂ do not affect orientation.</small>
        </article>
        <article>
          <h2>☆ Worked example (parallel)</h2>
          <p>
            <b>Plane A:</b> x+2y+2z=6; n₁=(1,2,2)
          </p>
          <p>
            <b>Plane B:</b> 2x+4y+4z=10; n₂=(2,4,4)
          </p>
          <p>n₂=(2,4,4)=2(1,2,2)=2n₁</p>
          <p>
            • The normals are scalar multiples.
            <br />• Therefore, the planes are parallel.
            <br />• They are distinct because 6≠10.
          </p>
          <strong>Answer: Parallel and distinct planes.</strong>
        </article>
        <article>
          <h2>☆ Example (perpendicular)</h2>
          <p>
            <b>Plane 1:</b> x+2y+2z=6; n₁=(1,2,2)
          </p>
          <p>
            <b>Plane 3:</b> 2x−y+0z=1; n₃=(2,−1,0)
          </p>
          <p>
            Dot product:
            <br />
            n₁·n₃=1·2+2·(−1)+2·0=0
          </p>
          <strong>Answer: Perpendicular planes.</strong>
        </article>
      </section>
      <section className="pp383-bottom">
        <article>
          <h2>
            🏆 Practice challenge{" "}
            <button onClick={() => act(() => setChallenge((value) => !value))}>
              Check
            </button>
          </h2>
          <p>Are the planes x+y+z=1 and 2x−y−z=3 perpendicular?</p>
          <p>
            <b>Plane P:</b> x+y+z=1; n₁=(1,1,1)
            <br />
            <b>Plane Q:</b> 2x−y−z=3; n₂=(2,−1,−1)
          </p>
          <p>n₁·n₂=1·2+1·(−1)+1·(−1)=0</p>
          {challenge && (
            <strong>
              Correct! The planes are perpendicular.
              <br />
              <small>Explanation: Their normals have dot product 0.</small>
            </strong>
          )}
        </article>
        <article>
          <h2>⚠ Common misconception</h2>
          <p>
            <b>Parallel equations are not required to have the same D value.</b>
          </p>
          <p>
            x+2y+2z=6; same normal direction; distinct D values
            <br />
            2x+4y+4z=10 → distinct but parallel planes.
          </p>
          <small>
            Only when both the normal and D match (up to the same scalar) are
            the planes coincident.
          </small>
        </article>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/382-planes">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Planes
          </span>
        </a>
        <a href="/lessons/3d-mathematics/384-line-plane-intersection">
          <span>
            <small>NEXT</small>Line–Plane Intersection
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function PlaneInputs({
  name,
  color,
  plane,
  update,
}: {
  name: string;
  color: string;
  plane: Plane;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className={`pp383-plane ${color}`}>
      <h3>{name}</h3>
      <div>
        {plane.map((value, index) => (
          <label key={index}>
            {["a", "b", "c", "d"][index]}
            <input
              aria-label={`${name} ${["a", "b", "c", "d"][index]}`}
              type="number"
              min="-12"
              max="12"
              step="1"
              value={value}
              onChange={(event) => update(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <p>Normal n = ⟨{plane.slice(0, 3).join(", ")}⟩</p>
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
function PlaneMesh({
  plane,
  color,
  opacity,
}: {
  plane: Plane;
  color: string;
  opacity: number;
}) {
  const [a, b, c, d] = plane,
    norm = new Vector3(a, c, b),
    center = norm.clone().multiplyScalar(d / norm.lengthSq()),
    quaternion = useMemo(
      () =>
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1),
          new Vector3(a, c, b).normalize(),
        ),
      [a, b, c],
    );
  return (
    <mesh position={center} quaternion={quaternion}>
      <planeGeometry args={[7, 5, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={DoubleSide}
      />
    </mesh>
  );
}
function ComparisonScene({
  planeA,
  planeB,
  normals,
  separation,
  cameraReset,
}: {
  planeA: Plane;
  planeB: Plane;
  normals: boolean;
  separation: boolean;
  cameraReset: number;
}) {
  const n1 = normal(planeA),
    n2 = normal(planeB),
    parallel = relationOf(planeA, planeB) === "Parallel",
    worldNormal = (n: number[]) => new Vector3(n[0], n[2], n[1]).normalize(),
    center = (plane: Plane) => {
      const n = new Vector3(plane[0], plane[2], plane[1]);
      return n.multiplyScalar(plane[3] / n.lengthSq());
    },
    c1 = parallel ? new Vector3(0, 2.1, 0) : center(planeA),
    c2 = parallel ? new Vector3(0, -1.1, 0) : center(planeB),
    e1 = c1
      .clone()
      .add(parallel ? new Vector3(0, 2, 0) : worldNormal(n1).multiplyScalar(2)),
    e2 = c2
      .clone()
      .add(parallel ? new Vector3(0, 2, 0) : worldNormal(n2).multiplyScalar(2));
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[0, 1, 0]}
        minDistance={7}
        maxDistance={24}
      />
      <gridHelper args={[16, 16, "#244a78", "#173150"]} />
      <Line
        points={[
          [-7, 0, 0],
          [8, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -7],
          [0, 0, 8],
        ]}
        color="#56b43c"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -6, 0],
          [0, 8, 0],
        ]}
        color="#168fe0"
        lineWidth={3}
      />
      {parallel ? (
        <>
          <ComparisonPlane position={[0, 2.1, 0]} color="#159ad5" />
          <ComparisonPlane position={[0, -1.1, 0]} color="#8247df" />
        </>
      ) : (
        <>
          <PlaneMesh plane={planeA} color="#159ad5" opacity={0.5} />
          <PlaneMesh plane={planeB} color="#8247df" opacity={0.5} />
        </>
      )}
      {normals && (
        <>
          <Line points={[c1, e1]} color="#35cdeb" lineWidth={6} />
          <Line points={[c2, e2]} color="#bd6dff" lineWidth={6} />
        </>
      )}
      {separation && parallel && (
        <Line points={[c1, c2]} color="#fff" dashed lineWidth={2} />
      )}
      <Billboard position={[c1.x - 2, c1.y + 0.35, c1.z]}>
        <Text fontSize={0.28} color="#35cdeb">
          Plane A{"\n"}
          {planeA[0]}x+{planeA[1]}y+{planeA[2]}z={planeA[3]}
          {"\n"}n₁=({n1.join(",")})
        </Text>
      </Billboard>
      <Billboard position={[c2.x - 2, c2.y + 0.35, c2.z]}>
        <Text fontSize={0.28} color="#c28bff">
          Plane B{"\n"}
          {planeB[0]}x+{planeB[1]}y+{planeB[2]}z={planeB[3]}
          {"\n"}n₂=({n2.join(",")})
        </Text>
      </Billboard>
    </>
  );
}
function ComparisonPlane({
  position,
  color,
}: {
  position: Point3;
  color: string;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[7, 5, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.52}
        side={DoubleSide}
      />
    </mesh>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(9, 7, 11);
    camera.lookAt(0, 1, 0);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
