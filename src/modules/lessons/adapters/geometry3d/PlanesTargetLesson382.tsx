import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BufferGeometry, DoubleSide, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PlanesTargetLesson382.css";

type Coefficients = [number, number, number, number];
type Point = [number, number, number];
const initial: Coefficients = [2, 3, 1, 6];
const testPoint: Point = [1, 1, 1];
const clean = (value: number) => Number(value.toFixed(2));

export default function PlanesTargetLesson382({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [coefficients, setCoefficients] = useState<Coefficients>(initial);
  const [intercepts, setIntercepts] = useState(true),
    [normal, setNormal] = useState(true),
    [point, setPoint] = useState(true),
    [equation, setEquation] = useState(true);
  const [mode, setMode] = useState("equation"),
    [answer, setAnswer] = useState("1, 2, 2"),
    [grade, setGrade] = useState("correct"),
    [solution, setSolution] = useState(false);
  const [tab, setTab] = useState("Interaction + visualization"),
    [expanded, setExpanded] = useState(false),
    [cameraReset, setCameraReset] = useState(0),
    [actions, setActions] = useState(0);
  const [a, b, c, d] = coefficients;
  const cuts: Point[] = [
    [clean(d / a), 0, 0],
    [0, clean(d / b), 0],
    [0, 0, clean(d / c)],
  ];
  const testValue = clean(
      a * testPoint[0] + b * testPoint[1] + c * testPoint[2],
    ),
    passes = testValue === d;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setCoefficients(initial);
    setIntercepts(true);
    setNormal(true);
    setPoint(true);
    setEquation(true);
    setMode("equation");
    setAnswer("1, 2, 2");
    setGrade("correct");
    setSolution(false);
    setTab("Interaction + visualization");
    setExpanded(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const update = (index: number, value: number) =>
    act(() =>
      setCoefficients(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? Math.max(1, clean(value)) : item,
          ) as Coefficients,
      ),
    );
  const check = () =>
    act(() =>
      setGrade(
        answer.replace(/[()<>\s]/g, "") === "1,2,2" ? "correct" : "incorrect",
      ),
    );

  return (
    <section
      className={`cs378-page pl382-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0567"
      data-object-model="threejs-plane-equation-coefficients-intercepts-normal-vector-test-point-orbit-live-substitution-graded-normal-challenge"
      data-coefficients={JSON.stringify(coefficients)}
      data-intercepts={JSON.stringify(cuts)}
      data-normal={JSON.stringify([a, b, c])}
      data-test-value={testValue}
      data-passes={passes}
      data-show-intercepts={intercepts}
      data-show-normal={normal}
      data-show-point={point}
      data-show-equation={equation}
      data-mode={mode}
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
        <h1>Planes</h1>
        <p>Construct and graph planes.</p>
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
      <section className="pl382-lab">
        <div className="pl382-left">
          <header>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Build and graph a plane in 3D</h2>
          </header>
          <article className="pl382-scene">
            <div
              className="pl382-canvas"
              data-testid="geometry3d-planes-canvas"
            >
              <Canvas
                camera={{ position: [10, 8, 14], fov: 43 }}
                dpr={[1, 1.5]}
              >
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.4} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <PlaneScene
                  coefficients={coefficients}
                  cuts={cuts}
                  showIntercepts={intercepts}
                  showNormal={normal}
                  showPoint={point}
                  showEquation={equation}
                  cameraReset={cameraReset}
                />
              </Canvas>
            </div>
            <b className="pl382-drag">DRAG SOLID</b>
            <div className="pl382-legend">
              <span>x-axis</span>
              <span>y-axis</span>
              <span>z-axis</span>
              <span>Plane</span>
              <span>Normal vector</span>
              <span>Test point</span>
            </div>
            <footer>
              Drag to rotate | Scroll to zoom | Hold Shift + drag to pan{" "}
              <button
                onClick={() => act(() => setCameraReset((value) => value + 1))}
              >
                Reset view
              </button>
            </footer>
          </article>
          <div className="pl382-summary">
            <b>
              ▦ Plane: {a}x + {b}y + {c}z = {d}
            </b>
            <b>
              ↗ Normal: ({a}, {b}, {c})
            </b>
            <b>
              P &nbsp; {passes ? "Passes through" : "Does not pass through"} P
              (1,1,1) {passes && "✓"}
            </b>
          </div>
        </div>
        <aside className="pl382-side">
          <select
            aria-label="Plane construction mode"
            value={mode}
            onChange={(event) => act(() => setMode(event.target.value))}
          >
            <option value="equation">Plane from equation</option>
            <option value="intercepts">Plane from intercepts</option>
          </select>
          <h3>Ax + By + Cz = D</h3>
          {["A (x)", "B (y)", "C (z)", "D"].map((label, index) => (
            <label className="pl382-coefficient" key={label}>
              {label}
              <input
                aria-label={label}
                type="number"
                min="1"
                max="12"
                step="1"
                value={coefficients[index]}
                onChange={(event) => update(index, Number(event.target.value))}
              />
            </label>
          ))}
          <Toggle
            label="Show intercepts"
            checked={intercepts}
            set={setIntercepts}
            act={act}
          />
          <Toggle
            label="Show normal vector"
            checked={normal}
            set={setNormal}
            act={act}
          />
          <Toggle
            label="Show test point"
            checked={point}
            set={setPoint}
            act={act}
          />
          <Toggle
            label="Show equation"
            checked={equation}
            set={setEquation}
            act={act}
          />
          <section className="pl382-results">
            <h3>Live results</h3>
            <p>
              Plane equation
              <strong>
                {a}x + {b}y + {c}z = {d}
              </strong>
            </p>
            <p>
              Normal vector
              <strong>
                n = ({a}, {b}, {c})
              </strong>
            </p>
            <p>
              Intercepts
              <strong>
                x-intercept: ({cuts[0].join(", ")})<br />
                y-intercept: ({cuts[1].join(", ")})<br />
                z-intercept: ({cuts[2].join(", ")})
              </strong>
            </p>
            <p>
              Test point
              <strong>
                P = (1, 1, 1)
                <br />
                <i className={passes ? "pass" : "fail"}>
                  {a}(1)+{b}(1)+{c}(1) = {testValue} {passes ? "✓" : `≠ ${d}`}
                </i>
              </strong>
            </p>
          </section>
          <button
            className="pl382-expand"
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </aside>
      </section>
      <section className="pl382-learning">
        <article>
          <h2>∑ &nbsp; Formula</h2>
          <p>The general equation of a plane is:</p>
          <strong>Ax + By + Cz = D</strong>
          <p>The normal vector to the plane is:</p>
          <strong>n = ⟨A, B, C⟩</strong>
          <p>Any point (x,y,z) on the plane satisfies Ax+By+Cz=D.</p>
        </article>
        <article>
          <h2>▣ &nbsp; Worked example</h2>
          <p>Find the intercepts of 2x+3y+z=6.</p>
          <p>
            • x-intercept: set y=0,z=0
            <br />
            2x=6 ⇒ x=3 ⇒ (3,0,0)
          </p>
          <p>
            • y-intercept: set x=0,z=0
            <br />
            3y=6 ⇒ y=2 ⇒ (0,2,0)
          </p>
          <p>
            • z-intercept: set x=0,y=0
            <br />
            z=6 ⇒ (0,0,6)
          </p>
          <small>These points match the axis cuts shown in the graph.</small>
        </article>
        <article>
          <h2>💡 &nbsp; Key idea</h2>
          <p>
            <b>The normal vector is perpendicular to the plane</b> and points in
            the direction ⟨A,B,C⟩.
          </p>
          <div className="pl382-mini-plane">
            <i>n</i>
          </div>
          <strong>⚠ Misconception</strong>
          <p>
            <b>The normal vector is perpendicular to the plane;</b> it does not
            lie flat on the plane.
          </p>
        </article>
      </section>
      <section className="pl382-practice">
        <div>
          <h2>Practice challenge</h2>
          <p>1. For x + 2y + 2z = 8, what is the normal vector?</p>
          <label>
            Your answer
            <input
              aria-label="Challenge normal vector"
              value={answer}
              onChange={(event) => act(() => setAnswer(event.target.value))}
            />
            <button onClick={check}>Check</button>
            <strong className={grade}>
              {grade === "correct" ? "✓ Correct!" : "Try ⟨A,B,C⟩."}
            </strong>
          </label>
          <button
            onClick={() =>
              act(() => {
                setAnswer("");
                setGrade("idle");
              })
            }
          >
            ⟳ New challenge
          </button>
        </div>
        <aside>
          <h3>Hint</h3>
          <p>For Ax+By+Cz=D, the normal vector is ⟨A,B,C⟩.</p>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            ◉ {solution ? "Hide solution" : "Show solution"}
          </button>
          {solution && <strong>⟨1,2,2⟩</strong>}
        </aside>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/381-lines-in-3d">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Lines in 3D
          </span>
        </a>
        <a href="/lessons/3d-mathematics/383-parallel-and-perpendicular-planes">
          <span>
            <small>NEXT</small>Parallel and Perpendicular Planes
          </span>{" "}
          →
        </a>
      </nav>
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
function PlaneScene({
  coefficients,
  cuts,
  showIntercepts,
  showNormal,
  showPoint,
  showEquation,
  cameraReset,
}: {
  coefficients: Coefficients;
  cuts: Point[];
  showIntercepts: boolean;
  showNormal: boolean;
  showPoint: boolean;
  showEquation: boolean;
  cameraReset: number;
}) {
  const [a, b, c, d] = coefficients,
    world = (point: Point): Point => [point[0], point[2], point[1]],
    geometry = useMemo(() => {
      const localCuts: Point[] = [
        [d / a, 0, 0],
        [0, d / b, 0],
        [0, 0, d / c],
      ];
      const shape = new BufferGeometry().setFromPoints(
        localCuts.map((value) => new Vector3(value[0], value[2], value[1])),
      );
      shape.setIndex([0, 1, 2]);
      shape.computeVertexNormals();
      return shape;
    }, [a, b, c, d]),
    start = world(testPoint),
    length = Math.hypot(a, b, c),
    end: Point = [
      start[0] + (2 * a) / length,
      start[1] + (2 * c) / length,
      start[2] + (2 * b) / length,
    ];
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1.5, 1.5, 1.5]}
        minDistance={6}
        maxDistance={22}
      />
      <gridHelper args={[14, 14, "#244a78", "#173150"]} />
      <Line
        points={[
          [-1, 0, 0],
          [8, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -1],
          [0, 0, 8],
        ]}
        color="#56b43c"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -1, 0],
          [0, 8, 0],
        ]}
        color="#23bcd9"
        lineWidth={3}
      />
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#7657da"
          transparent
          opacity={0.58}
          side={DoubleSide}
        />
      </mesh>
      {showIntercepts &&
        cuts.map((cut, index) => (
          <group key={index} position={world(cut)}>
            <mesh>
              <sphereGeometry args={[0.11, 18, 18]} />
              <meshStandardMaterial
                color={["#ef5148", "#56b43c", "#23bcd9"][index]}
              />
            </mesh>
            <Billboard position={[0.35, 0.28, 0]}>
              <Text
                fontSize={0.25}
                color={["#ff625a", "#65d94c", "#36d2eb"][index]}
              >
                ({cut.join(", ")})
              </Text>
            </Billboard>
          </group>
        ))}
      {showNormal && (
        <>
          <Line points={[start, end]} color="#f6bd2a" lineWidth={5} />
          <Billboard position={[end[0] + 0.2, end[1] + 0.2, end[2]]}>
            <Text fontSize={0.25} color="#f6bd2a">
              n = ({a}, {b}, {c})
            </Text>
          </Billboard>
        </>
      )}
      {showPoint && (
        <group position={start}>
          <mesh>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
          <Billboard position={[0.35, 0.25, 0]}>
            <Text fontSize={0.24} color="#fff">
              P (1, 1, 1)
            </Text>
          </Billboard>
        </group>
      )}
      {showEquation && (
        <Billboard position={[2.5, 3.1, 1]}>
          <Text fontSize={0.3} color="#d9ccff">
            {a}x + {b}y + {c}z = {d}
          </Text>
        </Billboard>
      )}
      <Text position={[7.5, 0.2, 0]} fontSize={0.35} color="#ef5148">
        x
      </Text>
      <Text position={[0, 0.2, 7.5]} fontSize={0.35} color="#56b43c">
        y
      </Text>
      <Text position={[0.2, 7.5, 0]} fontSize={0.35} color="#23bcd9">
        z
      </Text>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(10, 8, 14);
    camera.lookAt(1.5, 2.5, 1.5);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
