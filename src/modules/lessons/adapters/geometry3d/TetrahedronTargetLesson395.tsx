import { Edges, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BufferGeometry, DoubleSide, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./TetrahedronTargetLesson395.css";

type V3 = [number, number, number];
type BaseName = "ABC" | "ABD" | "ACD" | "BCD";
type Tool = "Select" | "Move" | "Measure" | "Slice" | "Explode";
const initial: V3[] = [
    [0, 0, 0],
    [6, 0, 0],
    [0, 4, 0],
    [2, 4 / 3, 5],
  ],
  clean = (v: number, d = 3) => Number(v.toFixed(d)),
  sub = (a: V3, b: V3): V3 => a.map((v, i) => v - b[i]) as V3,
  cross = (a: V3, b: V3): V3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
  dot = (a: V3, b: V3) => a.reduce((s, v, i) => s + v * b[i], 0),
  mag = (a: V3) => Math.hypot(...a),
  indices: Record<BaseName, [number, number, number, number]> = {
    ABC: [0, 1, 2, 3],
    ABD: [0, 1, 3, 2],
    ACD: [0, 2, 3, 1],
    BCD: [1, 2, 3, 0],
  },
  names = ["A", "B", "C", "D"];
function model(points: V3[], base: BaseName) {
  const [i, j, k, o] = indices[base],
    p = points[i],
    q = points[j],
    r = points[k],
    op = points[o],
    normal = cross(sub(q, p), sub(r, p)),
    normalLength = mag(normal),
    area = normalLength / 2,
    signed = normalLength ? dot(sub(op, p), normal) / normalLength : 0,
    height = Math.abs(signed),
    volume = (area * height) / 3,
    centroid = [0, 1, 2].map(
      (axis) => points.reduce((s, v) => s + v[axis], 0) / 4,
    ) as V3,
    edges: [[number, number, string], ...Array<[number, number, string]>] = [
      [0, 1, "AB"],
      [1, 2, "BC"],
      [2, 0, "CA"],
      [0, 3, "AD"],
      [1, 3, "BD"],
      [2, 3, "CD"],
    ],
    faces: BaseName[] = ["ABC", "ABD", "ACD", "BCD"];
  return {
    area: clean(area),
    height: clean(height),
    volume: clean(volume),
    signed,
    normal: normalLength
      ? (normal.map((v) => v / normalLength) as V3)
      : ([0, 0, 1] as V3),
    centroid: centroid.map((v) => clean(v)) as V3,
    edges: edges.map(([a, b, name]) => ({
      name,
      value: clean(mag(sub(points[a], points[b]))),
    })),
    faces: faces.map((name) => {
      const [a, b, c] = indices[name];
      return {
        name,
        value: clean(
          mag(cross(sub(points[b], points[a]), sub(points[c], points[a]))) / 2,
        ),
      };
    }),
  };
}
export default function TetrahedronTargetLesson395({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<V3[]>(initial),
    [base, setBase] = useState<BaseName>("ABC"),
    [slice, setSlice] = useState(2.5),
    [tool, setTool] = useState<Tool>("Select"),
    [net, setNet] = useState(false),
    [rotating, setRotating] = useState(false),
    [exploded, setExploded] = useState(false),
    [tab, setTab] = useState("Interact"),
    [shared, setShared] = useState(false),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0),
    result = model(points, base),
    act = (action: () => void) => {
      action();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setPoints(initial);
      setBase("ABC");
      setSlice(2.5);
      setTool("Select");
      setNet(false);
      setRotating(false);
      setExploded(false);
      setTab("Interact");
      setShared(false);
      setChecked(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const setHeight = (value: number) =>
      act(() =>
        setPoints((current) => {
          const next = current.map((v) => [...v] as V3),
            [, , , o] = indices[base],
            sign = result.signed < 0 ? -1 : 1,
            difference = Math.max(0.1, Math.min(20, value)) - result.height;
          next[o] = next[o].map((v, axis) =>
            clean(v + result.normal[axis] * difference * sign),
          ) as V3;
          return next;
        }),
      ),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `Tetrahedron base=${base}, B=${result.area}, h=${result.height}, V=${result.volume}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page tet395-page"
      data-testid="geometry3d-mockup-0580"
      data-guidance="tetrahedron spatial solid workspace"
      data-formula="V = Bh / 3"
      data-object-model="threejs-dedicated-four-directly-draggable-vertices-selectable-base-exact-face-area-perpendicular-height-determinant-volume-centroid-edges-slice-net-tools-explode-challenge"
      data-points={JSON.stringify(points)}
      data-base={base}
      data-base-area={result.area}
      data-height={result.height}
      data-volume={result.volume}
      data-centroid={JSON.stringify(result.centroid)}
      data-slice={slice}
      data-tool={tool}
      data-net={net}
      data-rotating={rotating}
      data-exploded={exploded}
      data-tab={tab}
      data-shared={shared}
      data-checked={checked}
      data-actions={actions}
    >
      <header className="tet395-hero">
        <small>
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </small>
        <h1>Tetrahedron</h1>
        <p>Four triangular faces, one spatial solid.</p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>12–15 min</span>
        </nav>
        <div>
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
          <button>Workspace</button>
        </div>
      </header>
      <nav className="tet395-tabs">
        {[
          "Interact",
          "Explore",
          "Formulas",
          "Examples",
          "Challenge",
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
      <section className="tet395-work">
        <div className="tet395-top-actions">
          <button onClick={() => act(() => setRotating((v) => !v))}>
            ◉ {rotating ? "Stop rotation" : "Rotate"}
          </button>
          <button onClick={() => act(() => setNet((v) => !v))}>
            ▧ {net ? "Hide net" : "Show net"}
          </button>
        </div>
        <aside className="tet395-tools">
          {(["Select", "Move", "Measure", "Slice", "Explode"] as Tool[]).map(
            (name) => (
              <button
                key={name}
                className={tool === name ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setTool(name);
                    if (name === "Explode") setExploded((v) => !v);
                  })
                }
              >
                {name}
              </button>
            ),
          )}
          <button onClick={() => act(reset)}>Reset view</button>
        </aside>
        <article
          className="tet395-scene"
          data-testid="geometry3d-tetrahedron-canvas"
        >
          <Canvas camera={{ position: [9, 7, 11], fov: 42 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#fbfcff"]} />
            <ambientLight intensity={2} />
            <directionalLight position={[7, 9, 6]} intensity={2} />
            <TetraScene
              points={points}
              result={result}
              base={base}
              slice={slice}
              rotating={rotating}
              exploded={exploded}
              onPoint={(index, value) =>
                act(() =>
                  setPoints((current) =>
                    current.map((point, i) => (i === index ? value : point)),
                  ),
                )
              }
            />
          </Canvas>
          {net && (
            <div className="tet395-net">
              △<br />△ △ △
            </div>
          )}
          <p>
            ☝ Drag vertices A, B, C, or D to reshape.
            <br />
            <small>Select a base face · Adjust height · See live results</small>
          </p>
        </article>
        <aside className="tet395-side">
          <section>
            <h2>Choose base</h2>
            {(["ABC", "ABD", "ACD", "BCD"] as BaseName[]).map((name) => (
              <button
                key={name}
                className={base === name ? "active" : ""}
                onClick={() => act(() => setBase(name))}
              >
                △ {name}
              </button>
            ))}
          </section>
          <section>
            <h2>Height (perpendicular)</h2>
            <p>
              From {names[indices[base][3]]} to plane {base}
            </p>
            <input
              aria-label="Height"
              type="number"
              step=".1"
              value={result.height}
              onChange={(event) => setHeight(Number(event.target.value))}
            />
            <input
              aria-label="Height slider"
              type="range"
              min=".1"
              max="20"
              step=".1"
              value={result.height}
              onChange={(event) => setHeight(Number(event.target.value))}
            />
          </section>
          <section>
            <h2>Slice preview</h2>
            <p>Plane parallel to base</p>
            <input
              aria-label="Slice position slider"
              type="range"
              min="0"
              max={result.height}
              step=".1"
              value={Math.min(slice, result.height)}
              onChange={(event) =>
                act(() => setSlice(Number(event.target.value)))
              }
            />
            <label>
              Position{" "}
              <input
                aria-label="Slice position"
                type="number"
                step=".1"
                value={slice}
                onChange={(event) =>
                  act(() => setSlice(Number(event.target.value)))
                }
              />{" "}
              cm
            </label>
          </section>
          <section className="tet395-volume">
            <h2>Volume V = ⅓Bh</h2>
            <strong>{result.volume.toFixed(3)} cm³</strong>
            <p>B (base area) {result.area.toFixed(3)} cm²</p>
            <p>h (height) {result.height.toFixed(3)} cm</p>
          </section>
        </aside>
      </section>
      <section className="tet395-measures">
        <h2>Live measurements</h2>
        <article>
          <h3>Edge lengths (cm)</h3>
          {result.edges.map((item) => (
            <p key={item.name}>
              ● {item.name}
              <b>{item.value.toFixed(3)}</b>
            </p>
          ))}
        </article>
        <article>
          <h3>Face areas (cm²)</h3>
          {result.faces.map((item) => (
            <p key={item.name}>
              △ {item.name}
              <b>{item.value.toFixed(3)}</b>
            </p>
          ))}
        </article>
        <article>
          <h3>Centroid (G)</h3>
          {result.centroid.map((value, index) => (
            <p key={index}>
              {["x", "y", "z"][index]}
              <b>{value.toFixed(3)}</b>
            </p>
          ))}
        </article>
        <article>
          <h3>Volume</h3>
          <p>V = ⅓Bh</p>
          <strong>{result.volume.toFixed(3)} cm³</strong>
        </article>
      </section>
      <section className="tet395-insight">
        <article>
          <h2>Key insight</h2>
          <p>
            For any tetrahedron, volume is one third of base area times
            perpendicular height.
          </p>
          <strong>V = ⅓Bh</strong>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>If base area B = 12 cm² and height h = 5 cm,</p>
          <strong>V = ⅓(12)(5) = 20 cm³</strong>
        </article>
      </section>
      <section className="tet395-challenge">
        <h2>🏆 Challenge</h2>
        <h3>Set the volume to 20 cm³</h3>
        <p>Adjust vertices or height to make the volume 20 cm³.</p>
        <aside>
          <small>Your volume</small>
          <strong>{result.volume.toFixed(3)} cm³</strong>
          {checked && (
            <b>
              {Math.abs(result.volume - 20) < 0.01
                ? "Great!"
                : "Keep adjusting"}
            </b>
          )}
        </aside>
        <button onClick={() => act(() => setChecked(true))}>
          Check volume
        </button>
      </section>
      <nav className="tet395-nav">
        <a href="/lessons/3d-mathematics/394-pyramid">
          ←{" "}
          <span>
            Previous
            <br />
            <b>Regular Pyramid</b>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/399-octahedron">
          <span>
            Next
            <br />
            <b>Octahedron</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function TetraScene({
  points,
  result,
  base,
  slice,
  rotating,
  exploded,
  onPoint,
}: {
  points: V3[];
  result: ReturnType<typeof model>;
  base: BaseName;
  slice: number;
  rotating: boolean;
  exploded: boolean;
  onPoint: (index: number, value: V3) => void;
}) {
  const [drag, setDrag] = useState<number | null>(null),
    world = (v: V3): V3 => [v[0], v[2], v[1]],
    move = (event: ThreeEvent<PointerEvent>) => {
      if (drag === null) return;
      event.stopPropagation();
      onPoint(drag, [
        clean(event.point.x),
        clean(event.point.z),
        points[drag][2],
      ]);
    },
    centroid = world(result.centroid);
  return (
    <>
      <OrbitControls
        makeDefault
        autoRotate={rotating}
        enabled={drag === null}
        target={centroid}
        minDistance={7}
        maxDistance={24}
      />
      {result.faces.map((face, index) => {
        const ids = indices[face.name].slice(0, 3),
          geometry = new BufferGeometry().setFromPoints(
            ids.map((id) => new Vector3(...world(points[id]))),
          );
        geometry.setIndex([0, 1, 2]);
        geometry.computeVertexNormals();
        const offset = exploded
          ? new Vector3(
              ...world(
                sub(
                  ids
                    .map((id) => points[id])
                    .reduce((sum, p) => sum.map((v, i) => v + p[i]) as V3, [
                      0, 0, 0,
                    ] as V3)
                    .map((v) => v / 3) as V3,
                  result.centroid,
                ),
              ),
            )
              .normalize()
              .multiplyScalar(0.35)
          : new Vector3();
        return (
          <mesh key={face.name} geometry={geometry} position={offset}>
            <meshStandardMaterial
              color={["#32c5de", "#5b7df2", "#9f55e8", "#f59a2f"][index]}
              transparent
              opacity={face.name === base ? 0.38 : 0.17}
              side={DoubleSide}
            />
            <Edges
              color={["#18adc4", "#3479e8", "#9541d6", "#f48620"][index]}
              lineWidth={2}
            />
          </mesh>
        );
      })}
      {points.map((point, index) => (
        <group key={index} position={world(point)}>
          <mesh
            onPointerDown={(event) => {
              event.stopPropagation();
              setDrag(index);
            }}
          >
            <sphereGeometry args={[0.28, 18, 18]} />
            <meshStandardMaterial
              color={["#18b7c9", "#1974e8", "#f28b16", "#9633dd"][index]}
            />
          </mesh>
          <Text
            position={[0.25, 0.22, 0]}
            fontSize={0.28}
            color={["#0ba1b4", "#0865d7", "#df7609", "#8421c9"][index]}
          >
            {names[index]}
          </Text>
        </group>
      ))}
      <Line
        points={[world(points[indices[base][3]]), centroid]}
        color="#7135d7"
        dashed
        lineWidth={3}
      />
      {slice > 0 && (
        <mesh
          position={[
            centroid[0],
            centroid[1] + slice - result.height / 2,
            centroid[2],
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[2.2, 3]} />
          <meshBasicMaterial
            color="#8b73e8"
            transparent
            opacity={0.12}
            side={DoubleSide}
          />
        </mesh>
      )}
      {drag !== null && (
        <mesh
          position={[0, points[drag][2], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={move}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        >
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
