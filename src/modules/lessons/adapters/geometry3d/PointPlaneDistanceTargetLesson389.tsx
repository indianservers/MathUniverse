import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PointPlaneDistanceTargetLesson389.css";

type V3 = [number, number, number];
type Plane = [number, number, number, number];
type Result = {
  numerator: number;
  denominator: number;
  distance: number | null;
  signedFactor: number | null;
  foot: V3 | null;
  valid: boolean;
};
const initialPoint: V3 = [4, 4, 4],
  initialPlane: Plane = [1, 1, 1, 6],
  clean = (value: number) => Number(value.toFixed(2));
function solve(point: V3, plane: Plane): Result {
  const [a, b, c, d] = plane,
    raw = a * point[0] + b * point[1] + c * point[2] - d,
    numerator = clean(Math.abs(raw)),
    exactDenominator = Math.hypot(a, b, c),
    denominator = clean(exactDenominator);
  if (exactDenominator < 0.001)
    return {
      numerator,
      denominator,
      distance: null,
      signedFactor: null,
      foot: null,
      valid: false,
    };
  const signedFactor = raw / (a * a + b * b + c * c),
    foot = point.map((value, index) =>
      clean(value - signedFactor * plane[index]),
    ) as V3;
  return {
    numerator,
    denominator,
    distance: clean(Math.abs(raw) / exactDenominator),
    signedFactor: clean(signedFactor),
    foot,
    valid: true,
  };
}
export default function PointPlaneDistanceTargetLesson389({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [point, setPoint] = useState<V3>(initialPoint),
    [plane, setPlane] = useState<Plane>(initialPlane),
    [layers, setLayers] = useState([true, true]),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [checked, setChecked] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const result = solve(point, plane),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setPoint(initialPoint);
      setPlane(initialPlane);
      setLayers([true, true]);
      setTab("Interaction + visualization");
      setChecked(false);
      setShared(false);
      setCameraReset((value) => value + 1);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const update = <T extends V3 | Plane>(
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
      ),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `P=(${point.join(",")}), plane=${plane.join(",")}, distance=${result.distance ?? "undefined"}`,
        );
        setShared(true);
      }),
    experiment = () =>
      act(() => {
        setPoint([1, 1, 5]);
        setPlane([0, 0, 1, 2]);
        setChecked(true);
      });
  return (
    <section
      className="cs378-page ppd389-page"
      data-testid="geometry3d-mockup-0574"
      data-object-model="threejs-editable-directly-draggable-point-and-plane-equation-exact-point-plane-distance-perpendicular-foot-normal-layers-orbit-validated-experiment"
      data-point={JSON.stringify(point)}
      data-plane={JSON.stringify(plane)}
      data-numerator={result.numerator}
      data-denominator={result.denominator}
      data-distance={result.distance ?? ""}
      data-factor={result.signedFactor ?? ""}
      data-foot={JSON.stringify(result.foot)}
      data-valid={result.valid}
      data-layers={JSON.stringify(layers)}
      data-tab={tab}
      data-checked={checked}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Point-to-Plane Distance</h1>
        <p>Find shortest spatial distance.</p>
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
      <section className="ppd389-lab">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>3D Distance Lab</h2>
          </div>
          <strong>Live ●</strong>
          <span>All changes update instantly</span>
          <button
            onClick={() => act(() => setCameraReset((value) => value + 1))}
          >
            <RotateCcw />
            Reset view
          </button>
        </header>
        <div className="ppd389-main">
          <article className="ppd389-scene">
            <div
              className="ppd389-canvas"
              data-testid="geometry3d-point-plane-canvas"
            >
              <Canvas camera={{ position: [4, 6, 24], fov: 42 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <DistanceScene
                  point={point}
                  plane={plane}
                  result={result}
                  layers={layers}
                  cameraReset={cameraReset}
                  onPoint={(value) => act(() => setPoint(value))}
                />
              </Canvas>
            </div>
          </article>
          <aside className="ppd389-side">
            <VectorInputs
              title="Point P = (x₀, y₀, z₀)"
              labels={["x₀", "y₀", "z₀"]}
              values={point}
              update={(index, value) => update(setPoint, index, value)}
            />
            <VectorInputs
              title="Plane Ax + By + Cz = D"
              labels={["A", "B", "C", "D"]}
              values={plane}
              update={(index, value) => update(setPlane, index, value)}
            />
            <div className="ppd389-layers">
              {["Show perpendicular PH", "Show foot H"].map((label, index) => (
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
            <section className="ppd389-calc">
              <h3>⚙ Live calculation</h3>
              <div className="ppd389-formula">
                d = |Ax₀+By₀+Cz₀-D| / √(A²+B²+C²)
              </div>
              <p>Substitute values:</p>
              <div>
                d = |{plane[0] * point[0]} + {plane[1] * point[1]} +{" "}
                {plane[2] * point[2]} - {plane[3]}| / √({plane[0]}²+{plane[1]}²+
                {plane[2]}²)
              </div>
              <p>Numerator: {result.numerator}</p>
              <p>Denominator: {result.denominator}</p>
              <strong>
                d = {result.valid ? result.distance : "undefined"}
              </strong>
            </section>
            <section className="ppd389-foot">
              <b>Foot of perpendicular:</b>
              <br />H ={" "}
              {result.foot ? `(${result.foot.join(", ")})` : "undefined"}
            </section>
          </aside>
        </div>
        <section className="ppd389-key">
          <div>💡</div>
          <article>
            <h3>Key idea</h3>
            <strong>
              The shortest path from a point to a plane follows the plane
              normal.
            </strong>
            <p>
              • The perpendicular from the point to the plane is the shortest
              distance.
              <br />• The foot of the perpendicular lies on the plane.
              <br />• The distance is invariant along the normal direction.
            </p>
          </article>
          <aside>
            <span>n&nbsp;&nbsp;● P</span>
            <span>&nbsp;&nbsp;&nbsp;│</span>
            <span>▱ ● H</span>
          </aside>
        </section>
        <section className="ppd389-try">
          <div>✎</div>
          <p>
            <b>Try it yourself</b>
            <br />
            Try: distance from (1,1,5) to plane z=2 → 3
          </p>
          <button onClick={experiment}>
            {checked ? "Checked: 3 ✓" : "Check it"}
          </button>
        </section>
        <div className="ppd389-chips">
          <span>Unit: 3D Geometry</span>
          <span>Topic: Point-to-Plane Distance</span>
          <span>Level: Intermediate-Advanced</span>
          <span>Duration: 6-10 min</span>
        </div>
        <nav className="cs378-nav">
          <a href="/lessons/3d-mathematics/388-angle-between-line-and-plane">
            ←{" "}
            <span>
              <small>PREVIOUS LESSON</small>Angle Between Line and Plane
            </span>
          </a>
          <a href="/lessons/3d-mathematics/390-3d-vectors">
            <span>
              <small>NEXT LESSON</small>3D Vectors
            </span>{" "}
            →
          </a>
        </nav>
      </section>
    </section>
  );
}
function VectorInputs<T extends V3 | Plane>({
  title,
  labels,
  values,
  update,
}: {
  title: string;
  labels: string[];
  values: T;
  update: (index: number, value: number) => void;
}) {
  return (
    <section className="ppd389-inputs">
      <h3>
        {title}
        <span>⌃</span>
      </h3>
      {values.map((value, index) => (
        <label key={labels[index]}>
          {labels[index]}
          <input
            aria-label={`${title} ${labels[index]}`}
            type="number"
            step=".1"
            value={value}
            onChange={(event) => update(index, Number(event.target.value))}
          />
        </label>
      ))}
    </section>
  );
}
function PlanePatch({ plane }: { plane: Plane }) {
  const [a, b, c, d] = plane,
    mapped = new Vector3(a, c, b),
    center =
      mapped.lengthSq() > 0.001
        ? mapped.clone().multiplyScalar(d / mapped.lengthSq())
        : new Vector3(),
    rotation = useMemo(() => {
      const normal = new Vector3(a, c, b);
      return new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        normal.lengthSq() > 0.001 ? normal.normalize() : new Vector3(0, 1, 0),
      );
    }, [a, b, c]);
  return (
    <mesh position={center} quaternion={rotation}>
      <planeGeometry args={[7, 6, 8, 8]} />
      <meshStandardMaterial
        color="#35bfd1"
        transparent
        opacity={0.42}
        side={DoubleSide}
      />
    </mesh>
  );
}
function DistanceScene({
  point,
  plane,
  result,
  layers,
  cameraReset,
  onPoint,
}: {
  point: V3;
  plane: Plane;
  result: Result;
  layers: boolean[];
  cameraReset: number;
  onPoint: (value: V3) => void;
}) {
  const [dragging, setDragging] = useState(false),
    world = (value: V3): V3 => [value[0], value[2], value[1]],
    move = (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onPoint([clean(event.point.x), clean(event.point.z), point[2]]);
    },
    normal: V3 = [plane[0], plane[1], plane[2]],
    normalEnd = world(normal.map((value) => value * 2.2) as V3);
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        enabled={!dragging}
        target={[1, 1, 1]}
        minDistance={10}
        maxDistance={40}
      />
      <gridHelper args={[14, 14, "#244a78", "#173150"]} />
      <Line
        points={[
          [0, 0, 0],
          [7, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 0, 7],
        ]}
        color="#38d36d"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -3, 0],
          [0, 7, 0],
        ]}
        color="#20a8ef"
        lineWidth={3}
      />
      <PlanePatch plane={plane} />
      <Line points={[[0, 0, 0], normalEnd]} color="#9b51eb" lineWidth={3} />
      <Billboard position={normalEnd}>
        <Text fontSize={0.3} color="#ba77ff">
          n = ⟨{normal.join(", ")}⟩
        </Text>
      </Billboard>
      <group position={world(point)}>
        <mesh
          onPointerDown={(event) => {
            event.stopPropagation();
            setDragging(true);
          }}
          onPointerUp={() => setDragging(false)}
        >
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#ffd329"
            emissive="#ffbd16"
            emissiveIntensity={0.5}
          />
        </mesh>
        <Billboard position={[0.6, 0.25, 0]}>
          <Text fontSize={0.32} color="#ffd329">
            P = ({point.join(", ")})
          </Text>
        </Billboard>
      </group>
      {layers[0] && result.foot && (
        <Line
          points={[world(point), world(result.foot)]}
          color="#fff"
          dashed
          lineWidth={4}
        />
      )}{" "}
      {layers[1] && result.foot && (
        <group position={world(result.foot)}>
          <mesh>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color="#5ce5ef" />
          </mesh>
          <Billboard position={[0.55, -0.25, 0]}>
            <Text fontSize={0.28} color="#5ce5ef">
              H = ({result.foot.join(", ")})
            </Text>
          </Billboard>
        </group>
      )}{" "}
      {result.valid && result.foot && (
        <Billboard
          position={world(
            point.map(
              (value, index) => (value + result.foot![index]) / 2,
            ) as V3,
          )}
        >
          <Text fontSize={0.3} color="#fff">
            distance ≈ {result.distance}
          </Text>
        </Billboard>
      )}
      {dragging && (
        <mesh
          position={[0, point[2], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={move}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(4, 6, 24);
    camera.lookAt(1, 1, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
