import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConeGeometry, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./VectorsTargetLesson390.css";

type V3 = [number, number, number];
type Mode = "Add" | "Dot" | "Cross";
const initialA: V3 = [3, 2, 1],
  initialB: V3 = [1, -1, 2],
  clean = (value: number) => Number(value.toFixed(2)),
  add = (a: V3, b: V3): V3 => a.map((value, i) => clean(value + b[i])) as V3,
  dot = (a: V3, b: V3) =>
    clean(a.reduce((sum, value, i) => sum + value * b[i], 0)),
  cross = (a: V3, b: V3): V3 => [
    clean(a[1] * b[2] - a[2] * b[1]),
    clean(a[2] * b[0] - a[0] * b[2]),
    clean(a[0] * b[1] - a[1] * b[0]),
  ],
  magnitude = (value: V3) => Math.hypot(...value),
  vectorText = (value: V3) => `⟨${value.join(", ")}⟩`;

export default function VectorsTargetLesson390({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<V3>(initialA),
    [b, setB] = useState<V3>(initialB),
    [mode, setMode] = useState<Mode>("Add"),
    [axes, setAxes] = useState(true),
    [expanded, setExpanded] = useState(false),
    [steps, setSteps] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [shared, setShared] = useState(false),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0),
    sum = add(a, b),
    product = dot(a, b),
    productVector = cross(a, b),
    magnitudeA = magnitude(a),
    magnitudeB = magnitude(b),
    cosine =
      magnitudeA && magnitudeB ? product / (magnitudeA * magnitudeB) : null,
    angle =
      cosine === null
        ? null
        : clean((Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI),
    valid = Boolean(magnitudeA && magnitudeB),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setA(initialA);
      setB(initialB);
      setMode("Add");
      setAxes(true);
      setExpanded(false);
      setSteps(false);
      setTab("Interaction + visualization");
      setCameraReset((value) => value + 1);
      setShared(false);
      setChecked(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const update = (
      setter: React.Dispatch<React.SetStateAction<V3>>,
      index: number,
      delta: number,
    ) =>
      act(() =>
        setter(
          (current) =>
            current.map((value, itemIndex) =>
              itemIndex === index ? clean(value + delta) : value,
            ) as V3,
        ),
      ),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `a=${vectorText(a)}, b=${vectorText(b)}, a+b=${vectorText(sum)}, a·b=${product}, a×b=${vectorText(productVector)}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page vec390-page"
      data-testid="geometry3d-mockup-0575"
      data-object-model="threejs-dedicated-directly-draggable-two-vector-add-dot-cross-exact-magnitudes-angle-steppers-modes-axes-orbit-validated-practice"
      data-a={JSON.stringify(a)}
      data-b={JSON.stringify(b)}
      data-sum={JSON.stringify(sum)}
      data-dot={product}
      data-cross={JSON.stringify(productVector)}
      data-magnitude-a={clean(magnitudeA)}
      data-magnitude-b={clean(magnitudeB)}
      data-cosine={cosine === null ? "" : clean(cosine)}
      data-angle={angle ?? ""}
      data-valid={valid}
      data-mode={mode}
      data-axes={axes}
      data-expanded={expanded}
      data-steps={steps}
      data-tab={tab}
      data-shared={shared}
      data-checked={checked}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>3D Vectors</h1>
        <p>Operate in space.</p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div className="cs378-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={share}>
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <button
            onClick={() => act(() => setCameraReset((value) => value + 1))}
          >
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
      <section className="vec390-layout">
        <article className={`vec390-lab ${expanded ? "expanded" : ""}`}>
          <header>
            <div>
              <small>VECTOR OPERATIONS LAB</small>
              <p>Visualize how vectors add, dot, and cross in 3D space.</p>
            </div>
          </header>
          <div className="vec390-scene" data-testid="geometry3d-vectors-canvas">
            <label>
              Axes
              <input
                aria-label="Show axes"
                type="checkbox"
                checked={axes}
                onChange={() => act(() => setAxes((value) => !value))}
              />
            </label>
            <button
              title="Toggle fullscreen"
              onClick={() => act(() => setExpanded((value) => !value))}
            >
              <Maximize2 />
            </button>
            <Canvas camera={{ position: [8, 7, 11], fov: 45 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#06172b"]} />
              <ambientLight intensity={1.8} />
              <directionalLight position={[7, 9, 5]} intensity={2} />
              <VectorScene
                a={a}
                b={b}
                mode={mode}
                axes={axes}
                cameraReset={cameraReset}
                onA={(value) => act(() => setA(value))}
                onB={(value) => act(() => setB(value))}
              />
            </Canvas>
            <div className="vec390-legend">
              <span className="a">● a = {vectorText(a)}</span>
              <span className="b">● b = {vectorText(b)}</span>
              <span className="sum">● a + b = {vectorText(sum)}</span>
              <span className="cross">
                ● a × b = {vectorText(productVector)}
              </span>
            </div>
            <p className="vec390-help">
              ⓘ Drag vectors · Drag to rotate · Scroll to zoom · Click axes to
              focus
            </p>
          </div>
        </article>
        <aside className="vec390-rail">
          <section className="vec390-components">
            <h2>
              Vector components <span>ⓘ</span>
            </h2>
            <VectorStepper
              name="Vector a"
              value={a}
              color="a"
              onStep={(index, delta) => update(setA, index, delta)}
            />
            <VectorStepper
              name="Vector b"
              value={b}
              color="b"
              onStep={(index, delta) => update(setB, index, delta)}
            />
            <b>Mode</b>
            <div className="vec390-modes">
              {(["Add", "Dot", "Cross"] as Mode[]).map((name) => (
                <button
                  key={name}
                  className={mode === name ? "active" : ""}
                  onClick={() => act(() => setMode(name))}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="vec390-hand">
              <b>Right-hand rule</b>
              <span>☝</span>
              <i>x</i>
              <i>y</i>
              <i>z</i>
            </div>
          </section>
          <section className="vec390-results">
            <h2>Live results</h2>
            <p>
              <i className="sum" />a + b = <b>{vectorText(sum)}</b>
            </p>
            <p>
              <i className="a" />a · b = <b>{product}</b>
            </p>
            <p>
              |a| = <b>√{clean(magnitudeA * magnitudeA)}</b>
            </p>
            <p>
              |b| = <b>√{clean(magnitudeB * magnitudeB)}</b>
            </p>
            <p>
              cos θ ={" "}
              <b>
                {valid
                  ? `${product} / √${clean(magnitudeA * magnitudeA * magnitudeB * magnitudeB)}`
                  : "undefined"}
              </b>
            </p>
            <p>
              θ ≈ <b>{angle === null ? "undefined" : `${angle}°`}</b>
            </p>
            <p>
              <i className="cross" />a × b = <b>{vectorText(productVector)}</b>
            </p>
            <button onClick={() => act(() => setSteps((value) => !value))}>
              ☷ {steps ? "Hide steps" : "Show steps"} &gt;
            </button>
            {steps && (
              <div className="vec390-steps">
                a·b = 3·1 + 2·(−1) + 1·2 = {product}
                <br />
                a×b = {vectorText(productVector)}
              </div>
            )}
          </section>
        </aside>
      </section>
      <section className="vec390-concept">
        <div>
          <h2>♧ Concept</h2>
          <p>Components tell how far a vector moves along x, y, and z.</p>
        </div>
        <article>
          <b>
            x <span>x-component</span>
          </b>
          <small>Right (+) or Left (−)</small>
        </article>
        <article>
          <b>
            y <span>y-component</span>
          </b>
          <small>Forward (+) or Back (−)</small>
        </article>
        <article>
          <b>
            z <span>z-component</span>
          </b>
          <small>Up (+) or Down (−)</small>
        </article>
        <aside>x ↗ y ↗ z</aside>
      </section>
      <section className="vec390-practice">
        <div>✎</div>
        <p>
          <b>Try this</b>
          <br />
          Practice vector addition with new values.
        </p>
        <strong>
          ⟨2, 0, 1⟩ <i>+</i> ⟨−1, 3, 2⟩ <i>=</i> <span>⟨1, 3, 3⟩</span>
        </strong>
        <button onClick={() => act(() => setChecked(true))}>
          {checked ? "Correct" : "Check my work"}
        </button>
      </section>
    </section>
  );
}

function VectorStepper({
  name,
  value,
  color,
  onStep,
}: {
  name: string;
  value: V3;
  color: string;
  onStep: (index: number, delta: number) => void;
}) {
  return (
    <fieldset className="vec390-vector">
      <legend>
        <i className={color} />
        {name}
      </legend>
      {["x", "y", "z"].map((axis, index) => (
        <label key={axis}>
          {axis}
          <button
            aria-label={`Decrease ${name} ${axis}`}
            onClick={() => onStep(index, -1)}
          >
            −
          </button>
          <output>{value[index]}</output>
          <button
            aria-label={`Increase ${name} ${axis}`}
            onClick={() => onStep(index, 1)}
          >
            +
          </button>
        </label>
      ))}
    </fieldset>
  );
}

function VectorScene({
  a,
  b,
  mode,
  axes,
  cameraReset,
  onA,
  onB,
}: {
  a: V3;
  b: V3;
  mode: Mode;
  axes: boolean;
  cameraReset: number;
  onA: (value: V3) => void;
  onB: (value: V3) => void;
}) {
  const [dragging, setDragging] = useState<"a" | "b" | null>(null),
    world = (value: V3): V3 => [value[0], value[2], value[1]],
    move = (event: ThreeEvent<PointerEvent>) => {
      if (!dragging) return;
      event.stopPropagation();
      const current = dragging === "a" ? a : b,
        next: V3 = [clean(event.point.x), clean(event.point.z), current[2]];
      (dragging === "a" ? onA : onB)(next);
    },
    sum = add(a, b),
    productVector = cross(a, b),
    product = dot(a, b),
    denominator = magnitude(a) * magnitude(b),
    angle = denominator
      ? clean(
          (Math.acos(Math.max(-1, Math.min(1, product / denominator))) * 180) /
            Math.PI,
        )
      : null;
  return (
    <>
      <CameraHome390 token={cameraReset} />
      <OrbitControls
        makeDefault
        enabled={!dragging}
        target={[1, 1, 1]}
        minDistance={7}
        maxDistance={24}
      />
      {axes && (
        <>
          <gridHelper args={[12, 12, "#244a78", "#173150"]} />
          <Axis end={[6, 0, 0]} color="#ef5148" label="x" />
          <Axis end={[0, 0, 6]} color="#38d36d" label="y" />
          <Axis end={[0, 6, 0]} color="#8bc8ee" label="z" />
        </>
      )}
      <VectorArrow
        value={world(a)}
        color="#13bee9"
        label={`a = ${vectorText(a)}`}
        onDown={() => setDragging("a")}
      />
      <VectorArrow
        value={world(b)}
        color="#906bff"
        label={`b = ${vectorText(b)}`}
        onDown={() => setDragging("b")}
      />
      {mode === "Add" && (
        <>
          <VectorArrow
            value={world(sum)}
            color="#49d65f"
            label={`a + b = ${vectorText(sum)}`}
          />
          <Line
            points={[world(a), world(sum), world(b)]}
            color="#cbd5e1"
            dashed
            lineWidth={2}
          />
        </>
      )}
      {mode === "Dot" && angle !== null && (
        <Billboard position={[0.9, 0.25, 0.7]}>
          <Text fontSize={0.28} color="#fff">
            angle ≈ {angle}°
          </Text>
        </Billboard>
      )}
      {mode === "Cross" && (
        <VectorArrow
          value={world(productVector.map((v) => v * 0.45) as V3)}
          color="#f6bd2f"
          label={`a × b = ${vectorText(productVector)}`}
        />
      )}
      {mode === "Add" && (
        <VectorArrow
          value={world(productVector.map((v) => v * 0.45) as V3)}
          color="#f6bd2f"
          label={`a × b = ${vectorText(productVector)}`}
        />
      )}
      {dragging && (
        <mesh
          position={[0, (dragging === "a" ? a : b)[2], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={move}
          onPointerUp={() => setDragging(null)}
          onPointerLeave={() => setDragging(null)}
        >
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

function Axis({
  end,
  color,
  label,
}: {
  end: V3;
  color: string;
  label: string;
}) {
  return (
    <>
      <Line points={[[0, 0, 0], end]} color={color} lineWidth={2} />
      <Billboard position={end}>
        <Text fontSize={0.28} color={color}>
          {label}
        </Text>
      </Billboard>
    </>
  );
}

function VectorArrow({
  value,
  color,
  label,
  onDown,
}: {
  value: V3;
  color: string;
  label: string;
  onDown?: () => void;
}) {
  const endpoint = new Vector3(...value),
    length = endpoint.length(),
    direction = endpoint.clone().normalize(),
    conePosition = endpoint.clone().addScaledVector(direction, -0.16),
    quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction,
    );
  if (length < 0.001) return null;
  return (
    <>
      <Line points={[[0, 0, 0], value]} color={color} lineWidth={5} />
      <mesh
        position={conePosition}
        quaternion={quaternion}
        onPointerDown={(event) => {
          event.stopPropagation();
          onDown?.();
        }}
      >
        <primitive
          object={new ConeGeometry(0.14, 0.38, 18)}
          attach="geometry"
        />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh
        position={endpoint}
        onPointerDown={(event) => {
          event.stopPropagation();
          onDown?.();
        }}
      >
        <sphereGeometry args={[0.35, 18, 18]} />
        <meshBasicMaterial transparent opacity={0.01} />
      </mesh>
      <Billboard position={endpoint.clone().add(new Vector3(0.35, 0.25, 0))}>
        <Text fontSize={0.25} color={color}>
          {label}
        </Text>
      </Billboard>
    </>
  );
}

function CameraHome390({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(8, 7, 11);
    camera.lookAt(1, 1, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
