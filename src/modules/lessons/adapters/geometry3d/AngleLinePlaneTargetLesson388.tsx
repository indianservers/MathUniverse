import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./AngleLinePlaneTargetLesson388.css";

type V3 = [number, number, number];
type Result = {
  dot: number;
  magnitudeV: number;
  magnitudeN: number;
  sine: number | null;
  angle: number | null;
  normalAngle: number | null;
  projection: V3 | null;
  valid: boolean;
};
const initialV: V3 = [1, 1, 1],
  initialN: V3 = [0, 0, 1];
const clean = (value: number, digits = 4) => Number(value.toFixed(digits));
function solve(v: V3, n: V3): Result {
  const rawDot = v.reduce((sum, item, index) => sum + item * n[index], 0),
    rawV = Math.hypot(...v),
    rawN = Math.hypot(...n),
    dot = clean(rawDot),
    magnitudeV = clean(rawV),
    magnitudeN = clean(rawN);
  if (rawV < 0.0001 || rawN < 0.0001)
    return {
      dot,
      magnitudeV,
      magnitudeN,
      sine: null,
      angle: null,
      normalAngle: null,
      projection: null,
      valid: false,
    };
  const rawSine = Math.max(0, Math.min(1, Math.abs(rawDot) / (rawV * rawN))),
    angle = clean((Math.asin(rawSine) * 180) / Math.PI, 1),
    factor = rawDot / (rawN * rawN),
    projection = v.map((item, index) => clean(item - factor * n[index])) as V3;
  return {
    dot,
    magnitudeV,
    magnitudeN,
    sine: clean(rawSine),
    angle,
    normalAngle: clean(90 - angle, 1),
    projection,
    valid: true,
  };
}
const planeOptions: { label: string; normal: V3 }[] = [
  { label: "x = 0", normal: [1, 0, 0] },
  { label: "y = 0", normal: [0, 1, 0] },
  { label: "z = 0", normal: [0, 0, 1] },
];
const planeLabel = (normal: V3) =>
  planeOptions.find((option) =>
    option.normal.every((value, index) => value === normal[index]),
  )?.label ?? "Custom plane";

export default function AngleLinePlaneTargetLesson388({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [vector, setVector] = useState<V3>(initialV),
    [normal, setNormal] = useState<V3>(initialN),
    [layers, setLayers] = useState([true, true]),
    [tab, setTab] = useState("Interaction + visualization"),
    [expanded, setExpanded] = useState(false),
    [cameraReset, setCameraReset] = useState(0),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const result = solve(vector, normal);
  const act = (action: () => void) => {
    action();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setVector(initialV);
    setNormal(initialN);
    setLayers([true, true]);
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
        `v=(${vector.join(",")}), n=(${normal.join(",")}), theta=${result.angle ?? "undefined"} degrees`,
      );
      setShared(true);
    });
  return (
    <section
      className={`cs378-page alp388-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0573"
      data-object-model="threejs-editable-directly-draggable-line-direction-and-plane-normal-projection-line-plane-angle-arcsin-complementary-normal-angle-coordinate-plane-selector-orbit-experiment"
      data-vector={JSON.stringify(vector)}
      data-normal={JSON.stringify(normal)}
      data-plane={planeLabel(normal)}
      data-dot={result.dot}
      data-magnitude-v={result.magnitudeV}
      data-magnitude-n={result.magnitudeN}
      data-sine={result.sine ?? ""}
      data-angle={result.angle ?? ""}
      data-normal-angle={result.normalAngle ?? ""}
      data-projection={JSON.stringify(result.projection)}
      data-valid={result.valid}
      data-layers={JSON.stringify(layers)}
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
        <h1>Angle Between Line and Plane</h1>
        <p>Measure inclination.</p>
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
      <section className="alp388-lab">
        <div
          className="alp388-canvas"
          data-testid="geometry3d-angle-line-plane-canvas"
        >
          <Canvas camera={{ position: [6, 6, 12], fov: 40 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#06172b"]} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[7, 9, 5]} intensity={2} />
            <LinePlaneAngleScene
              vector={vector}
              normal={normal}
              result={result}
              layers={layers}
              cameraReset={cameraReset}
              onVector={(value) => act(() => setVector(value))}
              onNormal={(value) => act(() => setNormal(value))}
            />
          </Canvas>
        </div>
        <div className="alp388-legend">
          <span>Line: v = ⟨{vector.join(", ")}⟩</span>
          {result.projection && (
            <span>Projection: ⟨{result.projection.join(", ")}⟩</span>
          )}
          <span>Normal: n = ⟨{normal.join(", ")}⟩</span>
          <span>Plane: {planeLabel(normal)}</span>
        </div>
        <footer>🖱 Drag to rotate • Scroll to zoom • Shift + drag to pan</footer>
        <button
          className="alp388-expand"
          title="Toggle fullscreen"
          onClick={() => act(() => setExpanded((value) => !value))}
        >
          <Maximize2 />
        </button>
      </section>
      <aside className="alp388-controls">
        <h2>Lesson controls</h2>
        <VectorFields
          title="Line direction"
          symbol="v = ⟨a, b, c⟩"
          values={vector}
          update={(index, value) => update(setVector, index, value)}
        />
        <VectorFields
          title="Plane normal"
          symbol="n = ⟨a, b, c⟩"
          values={normal}
          update={(index, value) => update(setNormal, index, value)}
        />
        <label className="alp388-plane">
          <b>Plane equation</b>
          <select
            aria-label="Plane equation"
            value={planeLabel(normal)}
            onChange={(event) => {
              const option = planeOptions.find(
                (item) => item.label === event.target.value,
              );
              if (option) act(() => setNormal(option.normal));
            }}
          >
            {planeOptions.map((option) => (
              <option key={option.label}>{option.label}</option>
            ))}
            {planeLabel(normal) === "Custom plane" && (
              <option>Custom plane</option>
            )}
          </select>
        </label>
        {["Show projection on plane", "Show normal to plane"].map(
          (label, index) => (
            <label className="alp388-toggle" key={label}>
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
      </aside>
      <aside className="alp388-calculation">
        <h2>▣ Live calculation</h2>
        <p>
          <i>v · n</i>
          <b>=</b>
          <span>{result.dot}</span>
        </p>
        <p>
          |v|<b>=</b>
          <span>
            {result.magnitudeV}
            {result.magnitudeV === 1.7321 ? " = √3" : ""}
          </span>
        </p>
        <p>
          |n|<b>=</b>
          <span>{result.magnitudeN}</span>
        </p>
        <p>
          sin θ = |v·n|/(|v||n|)<b>=</b>
          <span>{result.sine ?? "undefined"}</span>
        </p>
        <strong>
          θ <b>≈ {result.valid ? `${result.angle}°` : "undefined"}</b>
        </strong>
      </aside>
      <aside className="alp388-key">
        <b>ⓘ Key idea</b>
        <p>
          The angle between a line and a plane is the angle between the line and
          its projection on the plane.
        </p>
      </aside>
      <aside className="alp388-warning">
        <b>△ Common misconception</b>
        <p>
          Line-plane angle is measured to the projection, not directly to the
          normal.
        </p>
      </aside>
      <section className="alp388-try">
        <div>
          <b>⚗ Try it yourself</b>
          <p>Try: direction ⟨0,1,1⟩ with plane z=0 → θ=45°</p>
        </div>
        <button
          onClick={() =>
            act(() => {
              setVector([0, 1, 1]);
              setNormal([0, 0, 1]);
            })
          }
        >
          <RotateCcw />
          Use these values
        </button>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/387-angle-between-planes">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Angle Between Planes
          </span>
        </a>
        <a href="/lessons/3d-mathematics/389-point-to-plane-distance">
          <span>
            <small>NEXT</small>Point-to-Plane Distance
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function VectorFields({
  title,
  symbol,
  values,
  update,
}: {
  title: string;
  symbol: string;
  values: V3;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="alp388-vector">
      <h3>
        {title} <i>{symbol}</i>
      </h3>
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
function PlanePatch({ normal }: { normal: V3 }) {
  const rotation = useMemo(() => {
    const mapped = new Vector3(normal[0], normal[2], normal[1]);
    return new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      mapped.lengthSq() > 0.001 ? mapped.normalize() : new Vector3(0, 1, 0),
    );
  }, [normal]);
  return (
    <mesh quaternion={rotation}>
      <planeGeometry args={[9, 7, 8, 8]} />
      <meshStandardMaterial
        color="#2789ad"
        transparent
        opacity={0.35}
        side={DoubleSide}
      />
    </mesh>
  );
}
function LinePlaneAngleScene({
  vector,
  normal,
  result,
  layers,
  cameraReset,
  onVector,
  onNormal,
}: {
  vector: V3;
  normal: V3;
  result: Result;
  layers: boolean[];
  cameraReset: number;
  onVector: (value: V3) => void;
  onNormal: (value: V3) => void;
}) {
  const [dragging, setDragging] = useState<"vector" | "normal" | null>(null),
    scale = 4.5,
    world = (value: V3): V3 => [
      value[0] * scale,
      value[2] * scale,
      value[1] * scale,
    ],
    move = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const current = dragging === "vector" ? vector : normal,
        next: V3 = [
          clean(event.point.x / scale),
          clean(event.point.z / scale),
          current[2],
        ];
      if (dragging === "vector") onVector(next);
      else if (dragging === "normal") onNormal(next);
    };
  const arc = useMemo(() => {
    if (!result.valid || !result.projection) return [] as V3[];
    const a = new Vector3(...world(result.projection)).normalize(),
      b = new Vector3(...world(vector)).normalize(),
      angle = a.angleTo(b),
      axis = new Vector3().crossVectors(a, b).normalize();
    if (axis.lengthSq() < 0.001) return [] as V3[];
    return Array.from({ length: 25 }, (_, index) => {
      const point = a
        .clone()
        .applyAxisAngle(axis, (angle * index) / 24)
        .multiplyScalar(2);
      return [point.x, point.y, point.z] as V3;
    });
  }, [vector, result]);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        enabled={!dragging}
        target={[0, 0.3, 0]}
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
        lineWidth={2}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 0, 6],
        ]}
        color="#e7edf7"
        lineWidth={2}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 6, 0],
        ]}
        color="#e7edf7"
        lineWidth={2}
      />
      <PlanePatch normal={normal} />
      <DragArrow
        value={vector}
        color="#29cc45"
        label={`line  v = ⟨${vector.join(", ")}⟩`}
        onStart={() => setDragging("vector")}
        onStop={() => setDragging(null)}
      />
      {layers[0] && result.projection && (
        <>
          <Line
            points={[[0, 0, 0], world(result.projection)]}
            color="#ffe229"
            dashed
            lineWidth={4}
          />
          <Billboard position={world(result.projection)}>
            <Text fontSize={0.25} color="#ffe229">
              projection ⟨{result.projection.join(", ")}⟩
            </Text>
          </Billboard>
        </>
      )}
      {layers[1] && (
        <DragArrow
          value={normal}
          color="#1fc7e3"
          label={`normal n = ⟨${normal.join(", ")}⟩`}
          onStart={() => setDragging("normal")}
          onStop={() => setDragging(null)}
        />
      )}{" "}
      {arc.length > 1 && <Line points={arc} color="#ffd42a" lineWidth={4} />}{" "}
      {result.valid && (
        <>
          <Billboard position={[1.4, 0.8, 0.1]}>
            <Text fontSize={0.28} color="#ffd42a">
              θ ≈ {result.angle}°
            </Text>
          </Billboard>
          <Billboard position={[-0.5, 1.25, 0.1]}>
            <Text fontSize={0.22} color="#58d9ee">
              normal angle ≈ {result.normalAngle}°
            </Text>
          </Billboard>
        </>
      )}
      {dragging && (
        <mesh
          position={[
            0,
            (dragging === "vector" ? vector[2] : normal[2]) * scale,
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
function DragArrow({
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
  const length = Math.hypot(...value) || 1,
    visualLength = label.startsWith("line") ? 8.5 : 4,
    end = value.map((item) => (item / length) * visualLength) as V3,
    mapped: V3 = [end[0], end[2], end[1]];
  return (
    <>
      <Line points={[[0, 0, 0], mapped]} color={color} lineWidth={5} />
      <mesh
        position={mapped}
        onPointerDown={(event) => {
          event.stopPropagation();
          onStart();
        }}
        onPointerUp={onStop}
      >
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[mapped[0] + 0.45, mapped[1] + 0.25, mapped[2]]}>
        <Text fontSize={0.25} color={color}>
          {label}
        </Text>
      </Billboard>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(6, 6, 12);
    camera.lookAt(0, 0.3, 0);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
