import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Copy, ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PlanePlaneTargetLesson385.css";

type V3 = [number, number, number];
type Plane = [number, number, number, number];
type Result = {
  status:
    "Intersecting line" | "Parallel, no intersection" | "Coincident planes";
  normalA: V3;
  normalB: V3;
  cross: V3;
  direction: V3 | null;
  point: V3 | null;
};

const initialA: Plane = [1, 1, 1, 6];
const initialB: Plane = [1, -1, 1, 2];
const clean = (value: number) => Number(value.toFixed(2));
const cross = (a: V3, b: V3): V3 => [
  clean(a[1] * b[2] - a[2] * b[1]),
  clean(a[2] * b[0] - a[0] * b[2]),
  clean(a[0] * b[1] - a[1] * b[0]),
];
const gcd = (a: number, b: number): number =>
  b ? gcd(Math.abs(b), Math.abs(a % b)) : Math.abs(a);
const simplify = (value: V3): V3 => {
  const integers = value.every(Number.isInteger);
  const divisor = integers
    ? value.reduce((current, item) => gcd(current, item), 0) || 1
    : 1;
  return value.map((item) => clean(item / divisor)) as V3;
};

function solvePlanes(planeA: Plane, planeB: Plane): Result {
  const normalA = planeA.slice(0, 3) as V3;
  const normalB = planeB.slice(0, 3) as V3;
  const crossProduct = cross(normalA, normalB);
  const magnitude = crossProduct.reduce((sum, item) => sum + item * item, 0);
  if (magnitude < 0.0001) {
    const pivot = normalA.findIndex((item) => Math.abs(item) > 0.0001);
    const ratio = pivot >= 0 ? normalB[pivot] / normalA[pivot] : 0;
    const coincident =
      pivot >= 0 &&
      normalB.every(
        (item, index) => Math.abs(item - ratio * normalA[index]) < 0.001,
      ) &&
      Math.abs(planeB[3] - ratio * planeA[3]) < 0.001;
    return {
      status: coincident ? "Coincident planes" : "Parallel, no intersection",
      normalA,
      normalB,
      cross: crossProduct,
      direction: null,
      point: null,
    };
  }

  let point: V3 | null = null;
  for (const free of [2, 1, 0]) {
    const variables = [0, 1, 2].filter((index) => index !== free);
    const [u, v] = variables;
    const determinant = normalA[u] * normalB[v] - normalA[v] * normalB[u];
    if (Math.abs(determinant) < 0.0001) continue;
    const candidate: V3 = [0, 0, 0];
    candidate[u] = clean(
      (planeA[3] * normalB[v] - normalA[v] * planeB[3]) / determinant,
    );
    candidate[v] = clean(
      (normalA[u] * planeB[3] - planeA[3] * normalB[u]) / determinant,
    );
    point = candidate;
    break;
  }
  return {
    status: "Intersecting line",
    normalA,
    normalB,
    cross: crossProduct,
    direction: simplify(crossProduct),
    point,
  };
}

export default function PlanePlaneTargetLesson385({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [planeA, setPlaneA] = useState<Plane>(initialA);
  const [planeB, setPlaneB] = useState<Plane>(initialB);
  const [layers, setLayers] = useState([true, true, true, true]);
  const [answer, setAnswer] = useState("1");
  const [grade, setGrade] = useState<"correct" | "incorrect">("correct");
  const [tab, setTab] = useState("Interaction + visualization");
  const [expanded, setExpanded] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [copied, setCopied] = useState(false);
  const [actions, setActions] = useState(0);
  const result = solvePlanes(planeA, planeB);

  const act = (action: () => void) => {
    action();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setPlaneA(initialA);
    setPlaneB(initialB);
    setLayers([true, true, true, true]);
    setAnswer("1");
    setGrade("correct");
    setTab("Interaction + visualization");
    setExpanded(false);
    setCopied(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const updatePlane = (
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
  const resultText =
    result.point && result.direction
      ? `r(t)=(${result.point.join(",")})+t(${result.direction.join(",")})`
      : result.status;
  const copyResult = () =>
    act(() => {
      void navigator.clipboard?.writeText(resultText);
      setCopied(true);
    });

  return (
    <section
      className={`cs378-page pp385-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0570"
      data-object-model="threejs-two-editable-plane-equations-cross-product-intersection-line-parallel-coincident-solver-layers-orbit-graded-challenge"
      data-plane-a={JSON.stringify(planeA)}
      data-plane-b={JSON.stringify(planeB)}
      data-normal-a={JSON.stringify(result.normalA)}
      data-normal-b={JSON.stringify(result.normalB)}
      data-cross={JSON.stringify(result.cross)}
      data-direction={JSON.stringify(result.direction)}
      data-point={JSON.stringify(result.point)}
      data-status={result.status}
      data-layers={JSON.stringify(layers)}
      data-answer={answer}
      data-grade={grade}
      data-tab={tab}
      data-expanded={expanded}
      data-copied={copied}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Plane–Plane Intersection</h1>
        <p>Find intersection lines.</p>
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
          <button onClick={copyResult}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => setExpanded(true))}>
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
      <section className="pp385-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Two-plane intersection lab</h2>
          </div>
          <strong>
            {result.status === "Intersecting line"
              ? "All systems ready"
              : result.status}
          </strong>
          <span>{actions} actions</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="pp385-main">
          <article className="pp385-scene">
            <div
              className="pp385-canvas"
              data-testid="geometry3d-plane-plane-canvas"
            >
              <Canvas
                camera={{ position: [12, 8, 12], fov: 42 }}
                dpr={[1, 1.5]}
              >
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.4} />
                <directionalLight position={[8, 10, 6]} intensity={2} />
                <PlanePlaneScene
                  planeA={planeA}
                  planeB={planeB}
                  result={result}
                  layers={layers}
                  cameraReset={cameraReset}
                />
              </Canvas>
            </div>
            <div className="pp385-legend">
              <span>Plane A: {equation(planeA)}</span>
              <span>Plane B: {equation(planeB)}</span>
              <span>Intersection line</span>
            </div>
            <div className="pp385-view-cube" aria-hidden="true">
              <b>Top</b>
              <span>Front</span>
            </div>
            <button
              className="pp385-orbit-reset"
              title="Reset camera"
              onClick={() => act(() => setCameraReset((value) => value + 1))}
            >
              <RotateCcw />
            </button>
            <footer>
              Drag to rotate • Scroll to zoom • Hold Shift + drag to pan{" "}
              <button
                onClick={() => act(() => setCameraReset((value) => value + 1))}
              >
                <RotateCcw />
                Reset view
              </button>
            </footer>
          </article>
          <aside className="pp385-side">
            <PlaneInputs
              title="Plane A"
              symbols={["a₁", "b₁", "c₁", "d₁"]}
              values={planeA}
              update={(index, value) => updatePlane(setPlaneA, index, value)}
            />
            <PlaneInputs
              title="Plane B"
              symbols={["e₁", "f₁", "g₁", "h₁"]}
              values={planeB}
              update={(index, value) => updatePlane(setPlaneB, index, value)}
            />
            <div className="pp385-layers">
              {[
                "Show normals (n₁, n₂)",
                "Show intersection line",
                "Show sample point P",
                "Show cross product n₁ × n₂",
              ].map((label, index) => (
                <label key={label}>
                  {label}
                  <input
                    aria-label={label}
                    type="checkbox"
                    checked={layers[index]}
                    onChange={() =>
                      act(() =>
                        setLayers((current) =>
                          current.map((value, item) =>
                            item === index ? !value : value,
                          ),
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
            <section className="pp385-results">
              <h3>Live results</h3>
              <p>
                <b>Status</b>
                <strong>{result.status}</strong>
              </p>
              <p>
                <b>n₁</b> = ({result.normalA.join(", ")}) / <b>n₂</b> = (
                {result.normalB.join(", ")})
              </p>
              <p>
                <b>Direction d = n₁ × n₂</b>
                <br />
                {result.direction
                  ? `= (${result.cross.join(", ")}) ∼ (${result.direction.join(", ")})`
                  : "No unique direction"}
              </p>
              <p>
                <b>Sample point P</b> /{" "}
                {result.point ? `(${result.point.join(", ")})` : "—"}
              </p>
              <p>
                <b>Line of intersection</b>
                <br />
                {resultText}
              </p>
              <button onClick={copyResult}>
                <Copy />
                {copied ? "Copied" : "Copy results"}
              </button>
            </section>
          </aside>
        </div>
      </section>
      <section className="pp385-learning">
        <article>
          <h2>▣ Workflow</h2>
          <Step number="1" title="Compare normals">
            If n₁ and n₂ are not parallel, planes intersect in a line.
          </Step>
          <Step number="2" title="Cross product">
            Find d = n₁ × n₂. The line is parallel to d.
          </Step>
          <Step number="3" title="Find a point">
            Solve both plane equations to get any one point.
          </Step>
        </article>
        <article>
          <h2>Worked example (current planes)</h2>
          <p>Plane A: x + y + z = 6</p>
          <p>Plane B: x − y + z = 2</p>
          <p>
            Subtract (A) − (B):
            <br />
            2y = 4 ⇒ y = 2
          </p>
          <p>Let z = 0. From A: x = 4.</p>
          <p>Point on line: P = (4, 2, 0)</p>
          <p>Direction d = (2,0,−2) ∼ (1,0,−1)</p>
          <strong>Line r(t) = (4,2,0) + t(1,0,−1)</strong>
        </article>
        <article className="pp385-challenge">
          <h2>Practice challenge</h2>
          <p>
            For planes x+y+z=3 and x−y+z=1, find y on their intersection line.
          </p>
          {["1", "2", "0", "-1"].map((choice) => (
            <label key={choice} className={answer === choice ? grade : ""}>
              <input
                type="radio"
                name="pp385-answer"
                value={choice}
                checked={answer === choice}
                onChange={() => act(() => setAnswer(choice))}
              />
              y = {choice}
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setGrade(answer === "1" ? "correct" : "incorrect"))
            }
          >
            Check answer
          </button>
          <strong>
            {grade === "correct"
              ? "Correct! Subtracting gives 2y=2 ⇒ y=1."
              : "Subtract the second equation from the first."}
          </strong>
        </article>
        <aside>
          <h2>ⓘ Common misconception</h2>
          <strong>
            Two non-parallel planes do not meet at just one point; they
            intersect in a whole line.
          </strong>
          <div className="pp385-mini">╲ ╱</div>
          <p>
            Only parallel planes have no intersection (or infinitely many if
            they coincide).
          </p>
        </aside>
      </section>
      <section className="pp385-key">
        <b>☼ Key takeaway</b>
        <span>
          The intersection of two non-parallel planes is a line whose direction
          is given by n₁ × n₂. Any point satisfying both equations lies on this
          line.
        </span>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/384-lineplane-intersection">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Line–Plane Intersection
          </span>
        </a>
        <a href="/lessons/3d-mathematics/386-angle-between-lines">
          <span>
            <small>NEXT</small>Angle Between Lines
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function equation(plane: Plane) {
  return `${plane[0]}x ${signed(plane[1])}y ${signed(plane[2])}z = ${plane[3]}`;
}
function signed(value: number) {
  return value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;
}
function PlaneInputs({
  title,
  symbols,
  values,
  update,
}: {
  title: string;
  symbols: string[];
  values: Plane;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="pp385-plane">
      <h3>
        {title}: <i>{equation(values)}</i>
      </h3>
      <div>
        {values.map((value, index) => (
          <label key={symbols[index]}>
            {symbols[index]}
            <input
              aria-label={`${title} ${symbols[index]}`}
              type="number"
              value={value}
              onChange={(event) => update(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pp385-step">
      <b>{number}</b>
      <p>
        <strong>{title}</strong>
        <br />
        {children}
      </p>
    </div>
  );
}

function PlaneMesh({ plane, color }: { plane: Plane; color: string }) {
  const [a, b, c, d] = plane;
  const normal = new Vector3(a, c, b);
  const center =
    normal.lengthSq() > 0.001
      ? normal.clone().multiplyScalar(d / normal.lengthSq())
      : new Vector3();
  const rotation = useMemo(() => {
    const unitNormal = new Vector3(a, c, b);
    return new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      unitNormal.lengthSq() > 0.001
        ? unitNormal.normalize()
        : new Vector3(0, 1, 0),
    );
  }, [a, b, c]);
  return (
    <mesh position={center} quaternion={rotation}>
      <planeGeometry args={[7, 6, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.55}
        side={DoubleSide}
      />
    </mesh>
  );
}
function PlanePlaneScene({
  planeA,
  planeB,
  result,
  layers,
  cameraReset,
}: {
  planeA: Plane;
  planeB: Plane;
  result: Result;
  layers: boolean[];
  cameraReset: number;
}) {
  const world = (point: V3): V3 => [point[0], point[2], point[1]];
  const start =
    result.point && result.direction
      ? world(
          result.point.map(
            (value, index) => value - 6 * result.direction![index],
          ) as V3,
        )
      : ([0, 0, 0] as V3);
  const end =
    result.point && result.direction
      ? world(
          result.point.map(
            (value, index) => value + 6 * result.direction![index],
          ) as V3,
        )
      : ([0, 0, 0] as V3);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1, 1, 1]}
        minDistance={7}
        maxDistance={24}
      />
      <gridHelper args={[14, 14, "#244a78", "#173150"]} />
      <Line
        points={[
          [-7, 0, 0],
          [7, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -7],
          [0, 0, 7],
        ]}
        color="#43c65d"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -6, 0],
          [0, 7, 0],
        ]}
        color="#23bcd9"
        lineWidth={3}
      />
      <PlaneMesh plane={planeA} color="#3189e8" />
      <PlaneMesh plane={planeB} color="#8c48d7" />
      {layers[1] && result.point && result.direction && (
        <Line points={[start, end]} color="#ffb21d" lineWidth={5} />
      )}
      {layers[2] && result.point && (
        <group position={world(result.point)}>
          <mesh>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial
              color="#ffd329"
              emissive="#ffbd16"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Billboard position={[0.7, 0.3, 0]}>
            <Text fontSize={0.34} color="#ffd329">
              P ({result.point.join(", ")})
            </Text>
          </Billboard>
        </group>
      )}
      {layers[0] && (
        <>
          <Line
            points={[[0, 0, 0], world(result.normalA)]}
            color="#4ba5ff"
            lineWidth={3}
          />
          <Line
            points={[[0, 0, 0], world(result.normalB)]}
            color="#b15cf5"
            lineWidth={3}
          />
        </>
      )}
      {layers[3] && result.direction && (
        <Line
          points={[[0, 0, 0], world(result.direction)]}
          color="#ffffff"
          lineWidth={2}
          dashed
        />
      )}
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(12, 8, 12);
    camera.lookAt(1, 1, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
