import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./AnglePlanesTargetLesson387.css";

type V3 = [number, number, number];
type Result = {
  dot: number;
  magnitudeA: number;
  magnitudeB: number;
  cosine: number | null;
  acute: number | null;
  angle: number | null;
  hinge: V3 | null;
  valid: boolean;
};
const initialA: V3 = [0, 0, 1],
  initialB: V3 = [0, 1, 1];
const clean = (value: number) => Number(value.toFixed(4));
const cross = (a: V3, b: V3): V3 => [
  clean(a[1] * b[2] - a[2] * b[1]),
  clean(a[2] * b[0] - a[0] * b[2]),
  clean(a[0] * b[1] - a[1] * b[0]),
];
function solve(a: V3, b: V3, mode: "Acute" | "Obtuse"): Result {
  const rawDot = a.reduce((sum, item, index) => sum + item * b[index], 0),
    rawA = Math.hypot(...a),
    rawB = Math.hypot(...b),
    dot = clean(rawDot),
    magnitudeA = clean(rawA),
    magnitudeB = clean(rawB);
  if (rawA < 0.0001 || rawB < 0.0001)
    return {
      dot,
      magnitudeA,
      magnitudeB,
      cosine: null,
      acute: null,
      angle: null,
      hinge: null,
      valid: false,
    };
  const rawCos = Math.max(-1, Math.min(1, rawDot / (rawA * rawB))),
    cosine = clean(rawCos),
    acute = clean((Math.acos(Math.abs(rawCos)) * 180) / Math.PI),
    hinge = cross(a, b);
  return {
    dot,
    magnitudeA,
    magnitudeB,
    cosine,
    acute,
    angle: mode === "Acute" ? acute : clean(180 - acute),
    hinge: Math.hypot(...hinge) > 0.0001 ? hinge : null,
    valid: true,
  };
}
const equation = (n: V3) => {
  const parts = [
    n[0] ? `${n[0]}x` : "",
    n[1] ? `${n[1] < 0 ? "-" : "+"}${Math.abs(n[1])}y` : "",
    n[2] ? `${n[2] < 0 ? "-" : "+"}${Math.abs(n[2])}z` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/^\+/, "");
  return `${parts || "0"} = 0`;
};

export default function AnglePlanesTargetLesson387({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [normalA, setNormalA] = useState<V3>(initialA),
    [normalB, setNormalB] = useState<V3>(initialB),
    [mode, setMode] = useState<"Acute" | "Obtuse">("Acute"),
    [layers, setLayers] = useState([true, true, true]),
    [answer, setAnswer] = useState("45"),
    [grade, setGrade] = useState<"correct" | "incorrect">("correct"),
    [tab, setTab] = useState("Interaction + visualization"),
    [expanded, setExpanded] = useState(false),
    [cameraReset, setCameraReset] = useState(0),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const result = solve(normalA, normalB, mode);
  const act = (action: () => void) => {
    action();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setNormalA(initialA);
    setNormalB(initialB);
    setMode("Acute");
    setLayers([true, true, true]);
    setAnswer("45");
    setGrade("correct");
    setTab("Interaction + visualization");
    setExpanded(false);
    setShared(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const update = (
    setter: React.Dispatch<React.SetStateAction<V3>>,
    index: number,
    value: number,
  ) =>
    act(() =>
      setter(
        (current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as V3,
      ),
    );
  const share = () =>
    act(() => {
      void navigator.clipboard?.writeText(
        `Plane A ${equation(normalA)}; Plane B ${equation(normalB)}; angle ${result.angle ?? "undefined"} degrees`,
      );
      setShared(true);
    });
  return (
    <section
      className={`cs378-page ap387-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0572"
      data-object-model="threejs-two-planes-editable-directly-draggable-normals-dihedral-angle-dot-magnitudes-hinge-line-wedge-acute-obtuse-orbit-graded-challenge"
      data-normal-a={JSON.stringify(normalA)}
      data-normal-b={JSON.stringify(normalB)}
      data-dot={result.dot}
      data-magnitude-a={result.magnitudeA}
      data-magnitude-b={result.magnitudeB}
      data-cosine={result.cosine ?? ""}
      data-acute={result.acute ?? ""}
      data-angle={result.angle ?? ""}
      data-hinge={JSON.stringify(result.hinge)}
      data-valid={result.valid}
      data-mode={mode}
      data-layers={JSON.stringify(layers)}
      data-answer={answer}
      data-grade={grade}
      data-tab={tab}
      data-expanded={expanded}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Angle Between Planes</h1>
        <p>Understand dihedral angles.</p>
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
          <button onClick={share}>
            <Share2 />
            {shared ? "Shared" : "Share"}
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
      <section className="ap387-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore dihedral angles between planes</h2>
          </div>
          <strong>● All systems normal</strong>
          <span>{actions} actions</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="ap387-main">
          <article className="ap387-scene">
            <div
              className="ap387-canvas"
              data-testid="geometry3d-angle-planes-canvas"
            >
              <Canvas camera={{ position: [9, 7, 11], fov: 42 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <AnglePlanesScene
                  normalA={normalA}
                  normalB={normalB}
                  result={result}
                  layers={layers}
                  cameraReset={cameraReset}
                  onA={(value) => act(() => setNormalA(value))}
                  onB={(value) => act(() => setNormalB(value))}
                />
              </Canvas>
            </div>
            <b className="ap387-drag">DRAG TO ROTATE</b>
          </article>
          <aside className="ap387-side">
            <h2>Controls</h2>
            <NormalInputs
              title="Plane A (Base)"
              equation={equation(normalA)}
              name="Normal vector n₁"
              values={normalA}
              update={(index, value) => update(setNormalA, index, value)}
            />
            <NormalInputs
              title="Plane B (Tilted)"
              equation={equation(normalB)}
              name="Normal vector n₂"
              values={normalB}
              update={(index, value) => update(setNormalB, index, value)}
            />
            <section className="ap387-modes">
              <b>Angle type</b>
              <div>
                <button
                  className={mode === "Acute" ? "active" : ""}
                  onClick={() => act(() => setMode("Acute"))}
                >
                  Acute
                </button>
                <button
                  className={mode === "Obtuse" ? "active" : ""}
                  onClick={() => act(() => setMode("Obtuse"))}
                >
                  Obtuse
                </button>
              </div>
              {["Show normals", "Show hinge line", "Show dihedral wedge"].map(
                (label, index) => (
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
                ),
              )}
            </section>
            <section className="ap387-results">
              <h3>Live Results</h3>
              <p>n₁ · n₂ = {result.dot}</p>
              <p>|n₁| = {result.magnitudeA}</p>
              <p>
                |n₂| = {result.magnitudeB}
                {result.magnitudeB === 1.4142 ? " ≈ √2" : ""}
              </p>
              <p>cos θ = {result.cosine ?? "undefined"}</p>
              <strong>
                Angle between planes (θ)
                <b>{result.valid ? `${result.angle}°` : "undefined"}</b>
              </strong>
            </section>
          </aside>
        </div>
        <footer>
          💡 Hint: The angle between planes equals the angle between their
          normal vectors.
        </footer>
      </section>
      <section className="ap387-learning">
        <article>
          <h2>⚛ Key Formula</h2>
          <p>
            The angle between two planes equals the angle between their normal
            vectors.
          </p>
          <div>
            cos θ ={" "}
            <span>
              n₁ · n₂
              <br />
              ──────
              <br />
              |n₁| |n₂|
            </span>
          </div>
          <small>where n₁ and n₂ are normal vectors to the planes.</small>
        </article>
        <article>
          <h2>▣ Worked Example</h2>
          <p>Find the angle between planes z=0 and y+z=0.</p>
          <b>Normals:</b>
          <p>
            n₁=(0,0,1)
            <br />
            n₂=(0,1,1)
          </p>
          <p>cos θ = 1/(1·√2) = 1/√2</p>
          <strong>θ = 45°</strong>
        </article>
        <article className="ap387-challenge">
          <h2>▣ Practice Challenge</h2>
          <p>Find the angle between planes x=0 and x+y=0.</p>
          {["30", "45", "60", "90"].map((choice, index) => (
            <label key={choice} className={answer === choice ? grade : ""}>
              <input
                type="radio"
                name="ap387-answer"
                value={choice}
                checked={answer === choice}
                onChange={() => act(() => setAnswer(choice))}
              />
              <b>{String.fromCharCode(65 + index)}</b>
              {choice}°
            </label>
          ))}
          <button
            onClick={() =>
              act(() => setGrade(answer === "45" ? "correct" : "incorrect"))
            }
          >
            Check Answer
          </button>
          <strong>
            {grade === "correct"
              ? "Correct! The angle is 45°."
              : "Use normals (1,0,0) and (1,1,0)."}
          </strong>
        </article>
      </section>
      <section className="ap387-misconception">
        <b>△</b>
        <div>
          <h3>Common Misconception</h3>
          <strong>
            Do not measure plane orientation by the size of the drawn patch.
          </strong>
          <p>
            Only the direction of the normal vectors matters. Changing patch
            size or position will not change the angle.
          </p>
        </div>
        <div className="ap387-patches">
          Patch size different
          <br />
          Angle unchanged ✓
        </div>
        <div className="ap387-wrong">Wrong: measuring the patch ✕</div>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/386-angle-between-lines">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Angle Between Lines
          </span>
        </a>
        <a href="/lessons/3d-mathematics/388-angle-between-line-and-plane">
          <span>
            <small>NEXT</small>Angle Between Line and Plane
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function NormalInputs({
  title,
  equation: planeEquation,
  name,
  values,
  update,
}: {
  title: string;
  equation: string;
  name: string;
  values: V3;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="ap387-normal">
      <h3>{title}</h3>
      <p>Equation: {planeEquation}</p>
      <b>{name}</b>
      <div>
        {values.map((value, index) => (
          <input
            key={index}
            aria-label={`${title} ${["x", "y", "z"][index]}`}
            type="number"
            step=".1"
            value={value}
            onChange={(event) => update(index, Number(event.target.value))}
          />
        ))}
      </div>
    </section>
  );
}
function PlanePatch({ normal, color }: { normal: V3; color: string }) {
  const rotation = useMemo(() => {
    const mapped = new Vector3(normal[0], normal[2], -normal[1]);
    return new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      mapped.lengthSq() > 0.001
        ? mapped.clone().normalize()
        : new Vector3(0, 1, 0),
    );
  }, [normal]);
  return (
    <mesh quaternion={rotation}>
      <planeGeometry args={[6, 5, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.48}
        side={DoubleSide}
      />
    </mesh>
  );
}
function AnglePlanesScene({
  normalA,
  normalB,
  result,
  layers,
  cameraReset,
  onA,
  onB,
}: {
  normalA: V3;
  normalB: V3;
  result: Result;
  layers: boolean[];
  cameraReset: number;
  onA: (value: V3) => void;
  onB: (value: V3) => void;
}) {
  const [dragging, setDragging] = useState<"a" | "b" | null>(null),
    scale = 3.5,
    world = (value: V3): V3 => [
      value[0] * scale,
      value[2] * scale,
      -value[1] * scale,
    ],
    move = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const current = dragging === "a" ? normalA : normalB,
        next: V3 = [
          clean(event.point.x / scale),
          clean(-event.point.z / scale),
          current[2],
        ];
      if (dragging === "a") onA(next);
      else if (dragging === "b") onB(next);
    };
  const arc = useMemo(() => {
    if (!result.valid) return [] as V3[];
    const a = new Vector3(...world(normalA)).normalize(),
      b = new Vector3(...world(normalB)).normalize(),
      angle = Math.acos(Math.max(-1, Math.min(1, Math.abs(a.dot(b))))),
      axis = new Vector3().crossVectors(a, b).normalize();
    if (axis.lengthSq() < 0.001) return [] as V3[];
    return Array.from({ length: 25 }, (_, index) => {
      const point = a
        .clone()
        .applyAxisAngle(axis, (angle * index) / 24)
        .multiplyScalar(1.3);
      return [point.x, point.y, point.z] as V3;
    });
  }, [normalA, normalB, result.valid]);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        enabled={!dragging}
        target={[0, 0, 0]}
        minDistance={7}
        maxDistance={22}
      />
      <gridHelper args={[12, 12, "#244a78", "#173150"]} />
      <Line
        points={[
          [0, 0, 0],
          [6, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 0, 6],
        ]}
        color="#38d36d"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 6, 0],
        ]}
        color="#20a8ef"
        lineWidth={3}
      />
      <PlanePatch normal={normalA} color="#42d9e8" />
      <PlanePatch normal={normalB} color="#9e4bea" />
      {layers[0] && (
        <>
          <NormalArrow
            value={normalA}
            color="#55d9f2"
            label={`n₁ = ⟨${normalA.join(", ")}⟩`}
            onStart={() => setDragging("a")}
            onStop={() => setDragging(null)}
          />
          <NormalArrow
            value={normalB}
            color="#e46bff"
            label={`n₂ = ⟨${normalB.join(", ")}⟩`}
            onStart={() => setDragging("b")}
            onStop={() => setDragging(null)}
          />
        </>
      )}
      {layers[1] && result.hinge && (
        <Line
          points={[
            world(result.hinge),
            world(result.hinge.map((value) => -value) as V3),
          ]}
          color="#ffe325"
          lineWidth={5}
        />
      )}{" "}
      {layers[2] && arc.length > 1 && (
        <Line points={arc} color="#ff9d00" lineWidth={4} />
      )}{" "}
      {result.valid && (
        <Billboard position={[1.2, 1.3, 0.2]}>
          <Text fontSize={0.3} color="#ff9d00">
            {result.angle}°
          </Text>
        </Billboard>
      )}
      {dragging && (
        <mesh
          position={[
            0,
            (dragging === "a" ? normalA[2] : normalB[2]) * scale,
            0,
          ]}
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
function NormalArrow({
  value,
  color,
  label,
  onStart,
  onStop,
}: {
  value: V3;
  color: string;
  label: string;
  onStart: () => void;
  onStop: () => void;
}) {
  const end: V3 = [value[0] * 3.5, value[2] * 3.5, -value[1] * 3.5];
  return (
    <>
      <Line points={[[0, 0, 0], end]} color={color} lineWidth={5} />
      <mesh
        position={end}
        onPointerDown={(event) => {
          event.stopPropagation();
          onStart();
        }}
        onPointerUp={onStop}
      >
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[end[0] + 0.45, end[1] + 0.3, end[2]]}>
        <Text fontSize={0.28} color={color}>
          {label}
        </Text>
      </Billboard>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(9, 7, 11);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
