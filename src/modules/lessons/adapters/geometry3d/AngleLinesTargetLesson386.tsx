import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import {
  ExternalLink,
  Maximize2,
  RefreshCcw,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./AngleLinesTargetLesson386.css";

type V3 = [number, number, number];
type AngleResult = {
  dot: number;
  magnitudeU: number;
  magnitudeV: number;
  cosine: number | null;
  acute: number | null;
  angle: number | null;
  valid: boolean;
};
const initialU: V3 = [1, 0, 0];
const initialV: V3 = [1, 1, 0];
const vectorScale = 5;
const visualVector = (value: V3): V3 => {
  const length = Math.hypot(...value) || 1;
  return value.map((item) => (item / length) * vectorScale) as V3;
};
const clean = (value: number) => Number(value.toFixed(4));
const calculate = (u: V3, v: V3, mode: "Acute" | "Obtuse"): AngleResult => {
  const rawDot = u.reduce((sum, item, index) => sum + item * v[index], 0);
  const rawMagnitudeU = Math.hypot(...u);
  const rawMagnitudeV = Math.hypot(...v);
  const dot = clean(rawDot);
  const magnitudeU = clean(rawMagnitudeU);
  const magnitudeV = clean(rawMagnitudeV);
  if (magnitudeU < 0.0001 || magnitudeV < 0.0001)
    return {
      dot,
      magnitudeU,
      magnitudeV,
      cosine: null,
      acute: null,
      angle: null,
      valid: false,
    };
  const rawCosine = Math.max(
    -1,
    Math.min(1, rawDot / (rawMagnitudeU * rawMagnitudeV)),
  );
  const cosine = clean(rawCosine);
  const acute = clean((Math.acos(Math.abs(rawCosine)) * 180) / Math.PI);
  return {
    dot,
    magnitudeU,
    magnitudeV,
    cosine,
    acute,
    angle: mode === "Acute" ? acute : clean(180 - acute),
    valid: true,
  };
};

const challenges: Array<{ u: V3; v: V3 }> = [
  { u: [1, 0, 0], v: [0, 1, 0] },
  { u: [1, 1, 0], v: [1, -1, 0] },
  { u: [1, 0, 0], v: [1, 1, 0] },
];

export default function AngleLinesTargetLesson386({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [u, setU] = useState<V3>(initialU);
  const [v, setV] = useState<V3>(initialV);
  const [mode, setMode] = useState<"Acute" | "Obtuse">("Acute");
  const [layers, setLayers] = useState([true, true, true]);
  const [translate, setTranslate] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [challenge, setChallenge] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [shared, setShared] = useState(false);
  const [actions, setActions] = useState(0);
  const result = calculate(u, v, mode);
  const challengeResult = calculate(
    challenges[challenge].u,
    challenges[challenge].v,
    "Acute",
  );
  const act = (action: () => void) => {
    action();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setU(initialU);
    setV(initialV);
    setMode("Acute");
    setLayers([true, true, true]);
    setTranslate(true);
    setTab("Interaction + visualization");
    setChallenge(0);
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
        `u=(${u.join(",")}), v=(${v.join(",")}), theta=${result.angle ?? "undefined"} degrees`,
      );
      setShared(true);
    });

  return (
    <section
      className={`cs378-page al386-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0571"
      data-object-model="threejs-two-directly-draggable-direction-vectors-dot-magnitude-cosine-acute-obtuse-angle-arc-translated-line-orbit-live-challenges"
      data-u={JSON.stringify(u)}
      data-v={JSON.stringify(v)}
      data-dot={result.dot}
      data-magnitude-u={result.magnitudeU}
      data-magnitude-v={result.magnitudeV}
      data-cosine={result.cosine ?? ""}
      data-acute={result.acute ?? ""}
      data-angle={result.angle ?? ""}
      data-valid={result.valid}
      data-mode={mode}
      data-layers={JSON.stringify(layers)}
      data-translate={translate}
      data-tab={tab}
      data-challenge={challenge}
      data-challenge-angle={challengeResult.angle ?? ""}
      data-expanded={expanded}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Angle Between Lines</h1>
        <p>Measure spatial angles.</p>
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
      <section className="al386-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Measure the angle between two lines in space</h2>
          </div>
          <strong>● Live</strong>
          <span>All changes update in real time</span>
        </header>
        <div className="al386-main">
          <article className="al386-scene">
            <div
              className="al386-canvas"
              data-testid="geometry3d-angle-lines-canvas"
            >
              <Canvas
                camera={{ position: [2.5, 7, 12], fov: 42 }}
                dpr={[1, 1.5]}
              >
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <AngleScene
                  u={u}
                  v={v}
                  result={result}
                  layers={layers}
                  translate={translate}
                  cameraReset={cameraReset}
                  onU={(value) => act(() => setU(value))}
                  onV={(value) => act(() => setV(value))}
                />
              </Canvas>
            </div>
            <b className="al386-drag">DRAG TO ROTATE</b>
            <button
              className="al386-expand"
              title="Toggle fullscreen"
              onClick={() => act(() => setExpanded((value) => !value))}
            >
              <Maximize2 />
            </button>
            <label className="al386-translate">
              ⌘{" "}
              <span>
                <b>Translate a line parallel to itself.</b>
                <small>
                  The angle depends only on direction, not position.
                </small>
              </span>
              <input
                aria-label="Translate a line parallel to itself"
                type="checkbox"
                checked={translate}
                onChange={() => act(() => setTranslate((value) => !value))}
              />
            </label>
          </article>
          <aside className="al386-side">
            <h3>Lines and vectors</h3>
            <VectorInputs
              title="Vector u (direction of line 1)"
              color="#12c7d5"
              values={u}
              update={(index, value) => update(setU, index, value)}
            />
            <VectorInputs
              title="Vector v (direction of line 2)"
              color="#8b43ef"
              values={v}
              update={(index, value) => update(setV, index, value)}
            />
            <section className="al386-modes">
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
              {[
                "Show dot product",
                "Show angle arc",
                "Show translated line",
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
            </section>
            <section className="al386-results">
              <h3>Live results</h3>
              <p>
                <i>u · v</i>
                <b>=</b>
                <span>{result.dot}</span>
              </p>
              <p>
                |u|<b>=</b>
                <span>{result.magnitudeU}</span>
              </p>
              <p>
                |v|<b>=</b>
                <span>
                  {result.magnitudeV}{" "}
                  {result.magnitudeV === 1.4142 ? "≈ √2" : ""}
                </span>
              </p>
              <p>
                cos θ<b>=</b>
                <span>{result.cosine ?? "undefined"}</span>
              </p>
              <strong>
                θ = {result.valid ? `${result.angle}°` : "undefined"}
              </strong>
            </section>
          </aside>
        </div>
        <footer>
          💡 Angle is measured between direction vectors. Translation does not
          change direction.
        </footer>
      </section>
      <section className="al386-learning">
        <article>
          <h2>Formula</h2>
          <div>
            cos θ ={" "}
            <span>
              u · v<br />
              ────
              <br />
              |u| |v|
            </span>
          </div>
          <p>
            where u · v is the dot product of the direction vectors and |u|, |v|
            are their magnitudes.
          </p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Find the angle between u=(1,0,0) and v=(1,1,0).</p>
          <ol>
            <li>u · v = 1</li>
            <li>|u| = 1</li>
            <li>|v| = √2</li>
            <li>cos θ = 1/√2</li>
            <li>
              θ = cos⁻¹(1/√2) = <b>45°</b>
            </li>
          </ol>
        </article>
        <article className="al386-challenge">
          <h2>Practice challenge</h2>
          <p>
            Find the angle between ({challenges[challenge].u.join(", ")}) and (
            {challenges[challenge].v.join(", ")}).
          </p>
          <small>Hint: Use the formula above.</small>
          <strong>Correct! θ = {challengeResult.angle}° ✓</strong>
          <button
            onClick={() =>
              act(() =>
                setChallenge((value) => (value + 1) % challenges.length),
              )
            }
          >
            Try another <RefreshCcw />
          </button>
        </article>
      </section>
      <section className="al386-misconception">
        <b>ⓘ</b>
        <div>
          <h3>Common misconception</h3>
          <strong>
            Use direction vectors, not arbitrary points on the lines, to measure
            the angle.
          </strong>
          <p>
            Different points on the same line can give different (and incorrect)
            angles.
          </p>
        </div>
        <div className="al386-good">
          ∠<small>Correct: use direction vectors</small>
        </div>
        <div className="al386-bad">
          ●╲ / ╱●<small>Incorrect: using arbitrary points</small>
        </div>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/385-planeplane-intersection">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Plane–Plane Intersection
          </span>
        </a>
        <a href="/lessons/3d-mathematics/387-angle-between-planes">
          <span>
            <small>NEXT</small>Angle Between Planes
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function VectorInputs({
  title,
  color,
  values,
  update,
}: {
  title: string;
  color: string;
  values: V3;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="al386-vector">
      <b>{title}</b>
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
        <i style={{ background: color }} />
      </div>
    </section>
  );
}
function AngleScene({
  u,
  v,
  result,
  layers,
  translate,
  cameraReset,
  onU,
  onV,
}: {
  u: V3;
  v: V3;
  result: AngleResult;
  layers: boolean[];
  translate: boolean;
  cameraReset: number;
  onU: (value: V3) => void;
  onV: (value: V3) => void;
}) {
  const [dragging, setDragging] = useState<"u" | "v" | null>(null);
  const world = (value: V3): V3 => visualVector(value);
  const move = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const current = dragging === "u" ? u : v;
    const next: V3 = [
      clean(event.point.x / vectorScale),
      clean(event.point.y / vectorScale),
      current[2],
    ];
    if (dragging === "u") onU(next);
    else if (dragging === "v") onV(next);
  };
  const arc = useMemo(() => {
    if (!result.valid) return [] as V3[];
    const a = new Vector3(...world(u)).normalize();
    const b = new Vector3(...world(v)).normalize();
    const angle = a.angleTo(b);
    const axis = new Vector3().crossVectors(a, b).normalize();
    if (axis.lengthSq() < 0.001) return [] as V3[];
    return Array.from({ length: 25 }, (_, index) => {
      const point = a
        .clone()
        .applyAxisAngle(axis, (angle * index) / 24)
        .multiplyScalar(2.5);
      return [point.x, point.y, point.z] as V3;
    });
  }, [u, v, result.valid]);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        enabled={!dragging}
        target={[1.5, 0.6, 0]}
        minDistance={6}
        maxDistance={20}
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
      <VectorArrow
        value={u}
        color="#12c7d5"
        label={`u = ⟨${u.join(", ")}⟩`}
        onDrag={() => setDragging("u")}
        onStop={() => setDragging(null)}
      />
      <VectorArrow
        value={v}
        color="#8b43ef"
        label={`v = ⟨${v.join(", ")}⟩`}
        onDrag={() => setDragging("v")}
        onStop={() => setDragging(null)}
      />
      {layers[1] && arc.length > 1 && (
        <Line points={arc} color="#ff9d00" lineWidth={4} />
      )}
      {layers[0] && result.valid && (
        <Billboard position={[1.3, 1.1, 0.2]}>
          <Text fontSize={0.28} color="#ff9d00">
            θ = {result.angle}°
          </Text>
        </Billboard>
      )}
      {layers[2] && translate && (
        <Line
          points={[
            [1, 0, 2],
            [1 + world(v)[0], world(v)[1], 2 + world(v)[2]],
          ]}
          color="#8b43ef"
          dashed
          lineWidth={2}
        />
      )}
      {dragging && (
        <mesh
          position={[0, 0, (dragging === "u" ? u[2] : v[2]) * vectorScale]}
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
function VectorArrow({
  value,
  color,
  label,
  onDrag,
  onStop,
}: {
  value: V3;
  color: string;
  label: string;
  onDrag: () => void;
  onStop: () => void;
}) {
  const end = visualVector(value);
  return (
    <>
      <Line points={[[0, 0, 0], end]} color={color} lineWidth={6} />
      <mesh
        position={end}
        onPointerDown={(event) => {
          event.stopPropagation();
          onDrag();
        }}
        onPointerUp={onStop}
      >
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[end[0] + 0.5, end[1] + 0.35, end[2]]}>
        <Text fontSize={0.3} color={color}>
          {label}
        </Text>
      </Billboard>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2.5, 7, 12);
    camera.lookAt(1.5, 0.6, 0);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
