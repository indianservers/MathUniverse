import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./LinePlaneTargetLesson384.css";

type Point = [number, number, number];
type Plane = [number, number, number, number];
type SolveResult = {
  numerator: number;
  denominator: number;
  status: "single intersection" | "no intersection" | "line in plane";
  t: number | null;
  intersection: Point | null;
};

const initialPoint: Point = [1, 1, 1];
const initialVector: Point = [1, 2, 0];
const initialPlane: Plane = [1, 1, 1, 6];
const clean = (value: number) => Number(value.toFixed(2));
const pointAt = (point: Point, vector: Point, t: number): Point =>
  point.map((value, index) => clean(value + t * vector[index])) as Point;

function solveLinePlane(
  point: Point,
  vector: Point,
  plane: Plane,
): SolveResult {
  const numerator = clean(
    plane[3] -
      (plane[0] * point[0] + plane[1] * point[1] + plane[2] * point[2]),
  );
  const denominator = clean(
    plane[0] * vector[0] + plane[1] * vector[1] + plane[2] * vector[2],
  );
  if (Math.abs(denominator) < 0.001) {
    return {
      numerator,
      denominator,
      status: Math.abs(numerator) < 0.001 ? "line in plane" : "no intersection",
      t: null,
      intersection: null,
    };
  }
  const t = clean(numerator / denominator);
  return {
    numerator,
    denominator,
    status: "single intersection",
    t,
    intersection: pointAt(point, vector, t),
  };
}

export default function LinePlaneTargetLesson384({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState<Point>(initialPoint);
  const [vector, setVector] = useState<Point>(initialVector);
  const [plane, setPlane] = useState<Plane>(initialPlane);
  const [answer, setAnswer] = useState("2");
  const [grade, setGrade] = useState("correct");
  const [solution, setSolution] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization");
  const [expanded, setExpanded] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [actions, setActions] = useState(0);
  const result = solveLinePlane(point, vector, plane);

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setPoint(initialPoint);
    setVector(initialVector);
    setPlane(initialPlane);
    setAnswer("2");
    setGrade("correct");
    setSolution(false);
    setTab("Interaction + visualization");
    setExpanded(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const update = <T extends Point | Plane>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    index: number,
    value: number,
  ) =>
    act(() =>
      setter(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as T,
      ),
    );
  const check = () =>
    act(() => setGrade(Number(answer) === 2 ? "correct" : "incorrect"));

  return (
    <section
      className={`cs378-page lp384-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0569"
      data-object-model="threejs-editable-parametric-line-plane-equation-exact-intersection-solver-single-parallel-contained-orbit-graded-challenge"
      data-point={JSON.stringify(point)}
      data-vector={JSON.stringify(vector)}
      data-plane={JSON.stringify(plane)}
      data-numerator={result.numerator}
      data-denominator={result.denominator}
      data-status={result.status}
      data-t={result.t ?? ""}
      data-intersection={JSON.stringify(result.intersection)}
      data-answer={answer}
      data-grade={grade}
      data-solution={solution}
      data-tab={tab}
      data-expanded={expanded}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Line–Plane Intersection</h1>
        <p>Find spatial intersections.</p>
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
      <section className="lp384-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Solve the line–plane intersection</h2>
            <p>Find where the line meets the plane and determine t.</p>
          </div>
          <strong>{result.status}</strong>
          <span>{actions} actions</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="lp384-main">
          <article className="lp384-scene">
            <div
              className="lp384-canvas"
              data-testid="geometry3d-line-plane-canvas"
            >
              <Canvas camera={{ position: [13, 7, 6], fov: 43 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <IntersectionScene
                  point={point}
                  vector={vector}
                  plane={plane}
                  result={result}
                  cameraReset={cameraReset}
                />
              </Canvas>
            </div>
            <div className="lp384-legend">
              <span>
                Line: r(t)=({point.join(",")})+t({vector.join(",")})
              </span>
              <span>
                Plane: {plane[0]}x+{plane[1]}y+{plane[2]}z={plane[3]}
              </span>
              <span>
                Intersection{" "}
                {result.t !== null ? `(t=${result.t})` : result.status}
              </span>
            </div>
            <footer>
              Tip: Drag to rotate, scroll to zoom, right-drag to pan.
            </footer>
          </article>
          <aside className="lp384-side">
            <h3>Line r(t)=P₀+tv</h3>
            <p>P₀ (point on line)</p>
            <Triple
              name="Point"
              values={point}
              update={(index, value) => update(setPoint, index, value)}
            />
            <p>v (direction vector)</p>
            <Triple
              name="Vector"
              values={vector}
              update={(index, value) => update(setVector, index, value)}
            />
            <h3>Plane Ax+By+Cz=D</h3>
            <Quad
              values={plane}
              update={(index, value) => update(setPlane, index, value)}
            />
            <section>
              <h3>Solve for t</h3>
              <p>
                Parameter t <output>{result.t ?? "—"}</output>
              </p>
            </section>
            <section>
              <h3>Live calculation</h3>
              <p>Substitute into plane:</p>
              <p className="lp384-equation">
                {plane[0]}({point[0]}+{vector[0]}t) + {plane[1]}({point[1]}+
                {vector[1]}t) + {plane[2]}({point[2]}+{vector[2]}t) = {plane[3]}
              </p>
              <p>Simplify:</p>
              <p className="lp384-equation">
                {clean(plane[3] - result.numerator)} + {result.denominator}t ={" "}
                {plane[3]}
              </p>
              {result.t !== null && (
                <p>
                  Solve for t: <strong>t = {result.t}</strong>
                </p>
              )}
              {result.t === null && (
                <p>
                  <b>Status:</b> {result.status}
                </p>
              )}
            </section>
            <section>
              <h3>Intersection point</h3>
              {result.intersection ? (
                <>
                  <p>
                    r({result.t})=({point.join(",")})+{result.t}(
                    {vector.join(",")})
                  </p>
                  <strong>
                    I=({result.intersection.join(",")}), t={result.t}
                  </strong>
                </>
              ) : (
                <strong>{result.status}</strong>
              )}
            </section>
          </aside>
        </div>
      </section>
      <section className="lp384-workflow">
        <article>
          <h2>How it works (formula workflow)</h2>
          <div>
            <span>
              Line
              <br />
              r(t)=P₀+tv
            </span>
            →
            <span>
              Plane
              <br />
              Ax+By+Cz=D
            </span>
            →
            <span>
              Substitute
              <br />
              A(x₀+at)+B(y₀+bt)+C(z₀+ct)=D
            </span>
            →
            <span>
              Solve for t<br />
              Find t
            </span>
            →
            <span>
              Intersection
              <br />
              r(t)=I
            </span>
          </div>
        </article>
        <aside>
          <h2>Common misconception</h2>
          <p>
            An intersection point must satisfy{" "}
            <b>both the line equation and the plane equation.</b>
          </p>
        </aside>
      </section>
      <section className="lp384-bottom">
        <article>
          <h2>Worked example</h2>
          <p>Line r(t)=(1,1,1)+t(1,2,0) meets plane x+y+z=6.</p>
          <p>
            1. Substitute: (1+t)+(1+2t)+1=6
            <br />
            2. Simplify: 3+3t=6
            <br />
            3. Solve: t=1
            <br />
            4. Intersection: I=(2,3,1), t=1
          </p>
          <strong>The line meets the plane at t=1.</strong>
        </article>
        <article>
          <h2>Practice challenge</h2>
          <p>Line (0,0,1)+t(2,1,0) meets plane x+y+z=7. Find t.</p>
          <label>
            Your answer
            <input
              aria-label="Challenge t"
              type="number"
              value={answer}
              onChange={(event) => act(() => setAnswer(event.target.value))}
            />
            <button onClick={check}>Check</button>
          </label>
          <strong className={grade}>
            {grade === "correct"
              ? "Correct! t=2"
              : "Substitute the line into the plane."}
          </strong>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            {solution ? "Hide solution" : "Show solution"}
          </button>
          {solution && <p>2t+t+1=7 ⇒ 3t=6 ⇒ t=2.</p>}
        </article>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/383-parallel-and-perpendicular-planes">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Parallel and Perpendicular Planes
          </span>
        </a>
        <a href="/lessons/3d-mathematics/385-planeplane-intersection">
          <span>
            <small>NEXT</small>Plane–Plane Intersection
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Triple({
  name,
  values,
  update,
}: {
  name: string;
  values: Point;
  update: (index: number, value: number) => void;
}) {
  return (
    <div className="lp384-triple">
      {values.map((value, index) => (
        <input
          key={index}
          aria-label={`${name} ${["x", "y", "z"][index]}`}
          type="number"
          min="-12"
          max="12"
          step="1"
          value={value}
          onChange={(event) => update(index, Number(event.target.value))}
        />
      ))}
    </div>
  );
}
function Quad({
  values,
  update,
}: {
  values: Plane;
  update: (index: number, value: number) => void;
}) {
  return (
    <div className="lp384-quad">
      {values.map((value, index) => (
        <label key={index}>
          {["A", "B", "C", "D"][index]}
          <input
            aria-label={`Plane ${["A", "B", "C", "D"][index]}`}
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
  );
}
function PlaneMesh({ plane }: { plane: Plane }) {
  const [a, b, c, d] = plane;
  const normal = new Vector3(a, c, b);
  const center =
    normal.lengthSq() > 0.001
      ? normal.clone().multiplyScalar(d / normal.lengthSq())
      : new Vector3();
  const quaternion = useMemo(
    () =>
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        a * a + b * b + c * c > 0.001
          ? new Vector3(a, c, b).normalize()
          : new Vector3(0, 1, 0),
      ),
    [a, b, c],
  );
  return (
    <mesh position={center} quaternion={quaternion}>
      <planeGeometry args={[5, 4, 8, 8]} />
      <meshStandardMaterial
        color="#7657da"
        transparent
        opacity={0.55}
        side={DoubleSide}
      />
    </mesh>
  );
}
function IntersectionScene({
  point,
  vector,
  plane,
  result,
  cameraReset,
}: {
  point: Point;
  vector: Point;
  plane: Plane;
  result: SolveResult;
  cameraReset: number;
}) {
  const world = (value: Point): Point => [value[0], value[2], value[1]];
  const start = world(pointAt(point, vector, -5));
  const end = world(pointAt(point, vector, 5));
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1, 1, 1]}
        minDistance={7}
        maxDistance={23}
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
      <PlaneMesh plane={plane} />
      <Line points={[start, end]} color="#a74ff1" lineWidth={5} />
      {result.intersection && (
        <group position={world(result.intersection)}>
          <mesh>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshStandardMaterial
              color="#f38cff"
              emissive="#f38cff"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Billboard position={[0.5, 0.3, 0]}>
            <Text fontSize={0.42} color="#fff">
              I=({result.intersection.join(",")}), t={result.t}
            </Text>
          </Billboard>
        </group>
      )}
      <Billboard position={[2, 2, 1]}>
        <Text fontSize={0.36} color="#ddd0ff">
          {plane[0]}x+{plane[1]}y+{plane[2]}z={plane[3]}
        </Text>
      </Billboard>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(13, 7, 6);
    camera.lookAt(1, 1, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
