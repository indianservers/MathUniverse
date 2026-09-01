import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  Circle,
  Cylinder,
  Lightbulb,
  Maximize2,
  Move3D,
  Play,
  RotateCcw,
  Share2,
  Triangle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CrossSectionsTargetLesson405.css";

type Solid = "cube" | "cone" | "cylinder";
type Prediction =
  "Triangle" | "Rectangle" | "Square" | "Circle" | "Ellipse" | "Other";
type Section = {
  shape: string;
  points: [number, number, number][];
  lengths: number[];
  perimeter: number;
  area: number;
};
const H = 2 * Math.SQRT2;

export default function CrossSectionsTargetLesson405({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [solid, setSolid] = useState<Solid>("cube"),
    [tilt, setTilt] = useState(-45),
    [position, setPosition] = useState(0),
    [trace, setTrace] = useState(true);
  const [playing, setPlaying] = useState(false),
    [prediction, setPrediction] = useState<Prediction>("Other"),
    [checked, setChecked] = useState(true),
    [calculations, setCalculations] = useState(false),
    [tab, setTab] = useState("Explore"),
    [shared, setShared] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [challengeDone, setChallengeDone] = useState(false),
    [actions, setActions] = useState(0);
  const section = useMemo(
    () => sectionFor(solid, tilt, position),
    [solid, tilt, position],
  );
  const expectedPrediction: Prediction = [
    "Triangle",
    "Rectangle",
    "Square",
    "Circle",
    "Ellipse",
  ].includes(section.shape)
    ? (section.shape as Prediction)
    : "Other";
  const correct = checked && prediction === expectedPrediction;
  const act = (fn: () => void) => {
    fn();
    setChecked(false);
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setSolid("cube");
    setTilt(-45);
    setPosition(0);
    setTrace(true);
    setPlaying(false);
    setPrediction("Other");
    setChecked(true);
    setCalculations(false);
    setTab("Explore");
    setShared(false);
    setFullscreen(false);
    setChallengeDone(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setPosition((value) => (value >= 2.2 ? -2.2 : value + 0.08)),
      60,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const chooseSolid = (next: Solid) =>
    act(() => {
      setSolid(next);
      setTilt(next === "cube" ? -45 : next === "cone" ? 0 : -30);
      setPosition(0);
      setPrediction(
        next === "cube" ? "Other" : next === "cone" ? "Circle" : "Ellipse",
      );
      setChallengeDone(false);
    });
  return (
    <section
      className="cs378-page cross405-page"
      data-testid="geometry3d-mockup-0590"
      data-catalog-title="Cross-sections"
      data-object-model="threejs-dedicated-plane-solid-intersection-exact-cube-polygon-drag-tilt-trace-prediction"
      data-direct-interaction="true"
      data-solid={solid}
      data-tilt={tilt}
      data-position={round(position)}
      data-shape={section.shape}
      data-vertices={section.points.length}
      data-perimeter={round(section.perimeter)}
      data-area={round(section.area)}
      data-trace={trace}
      data-playing={playing}
      data-prediction={prediction}
      data-checked={checked}
      data-correct={correct}
      data-fullscreen={fullscreen}
      data-tab={tab}
      data-shared={shared}
      data-actions={actions}
      data-challenge-done={challengeDone}
    >
      <header className="cross405-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>Cross-Sections of Solids</h1>
          <p>Slice solids with a plane to explore beautiful 2D shapes.</p>
          <nav>
            <span>Intermediate-Advanced</span>
            <span>3D Lab</span>
            <span>Calculator</span>
            <span>6-10 min</span>
          </nav>
          <aside>
            <button>English (English)⌄</button>
            <button onClick={reset}>
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={() =>
                act(() => {
                  setShared(true);
                  void navigator.clipboard?.writeText(
                    `${section.shape}: A=${fmt(section.area)}`,
                  );
                })
              }
            >
              <Share2 size={14} />
              {shared ? "Shared" : "Share"}
            </button>
          </aside>
        </div>
        <article>
          <h2>Challenge</h2>
          <p>Create a hexagonal section.</p>
          <div>
            <i style={{ width: `${challengeDone ? 100 : 0}%` }} />
            <b>{challengeDone ? 1 : 0} / 1</b>
          </div>
          <button
            onClick={() => {
              setSolid("cube");
              setTilt(-45);
              setPosition(0);
              setChallengeDone(false);
              onInteraction();
            }}
          >
            Hint
          </button>
        </article>
      </header>
      <nav className="cross405-tabs">
        {["Explore", "Learn", "Examples", "Formulas", "Know more"].map(
          (item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="cross405-lab">
        <article className="cross405-stage">
          <header>
            <small>INTERACTION · VISUALIZATION</small>
            <h2>Slice the solid</h2>
            <button>
              <Move3D size={14} />
              Move plane
            </button>
            <nav>
              <button
                className={solid === "cube" ? "active" : ""}
                title="Cube"
                onClick={() => chooseSolid("cube")}
              >
                <Box size={18} />
              </button>
              <button
                className={solid === "cone" ? "active" : ""}
                title="Cone"
                onClick={() => chooseSolid("cone")}
              >
                <Triangle size={18} />
              </button>
              <button
                className={solid === "cylinder" ? "active" : ""}
                title="Cylinder"
                onClick={() => chooseSolid("cylinder")}
              >
                <Cylinder size={18} />
              </button>
              <button
                title="Full screen"
                onClick={() => act(() => setFullscreen((v) => !v))}
              >
                <Maximize2 size={18} />
              </button>
            </nav>
          </header>
          <div
            className={`cross405-scene ${fullscreen ? "expanded" : ""}`}
            aria-label="Drag solid or plane to move section"
          >
            {fullscreen && (
              <button
                className="cross405-exit"
                title="Exit full screen"
                onClick={() => act(() => setFullscreen(false))}
              >
                <Maximize2 size={18} />
              </button>
            )}
            <Canvas
              key={solid}
              data-testid="geometry3d-cross-section-canvas"
              camera={{ position: [7, 5.5, 8], fov: 40 }}
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <color attach="background" args={["#eef6fb"]} />
              <ambientLight intensity={1.7} />
              <directionalLight position={[5, 8, 6]} intensity={2.1} />
              <group position={[0, -0.75, 0]}>
                <group scale={0.7}>
                  <SolidModel solid={solid} />
                </group>
                <group scale={0.58}>
                  <SlicePlane
                    section={section}
                    solid={solid}
                    tilt={tilt}
                    position={position}
                    trace={trace}
                    onPosition={(value) => act(() => setPosition(value))}
                  />
                </group>
              </group>
              <axesHelper args={[4.5]} />
              <OrbitControls makeDefault enableZoom enablePan />
            </Canvas>
          </div>
          <footer>
            <label>
              <Move3D size={16} />
              <span>
                <b>Move plane</b>Drag the plane on solid
              </span>
              <input
                aria-label="Plane position"
                type="range"
                min="-2.2"
                max="2.2"
                step=".1"
                value={position}
                onChange={(event) =>
                  act(() => {
                    const next = Number(event.target.value);
                    setPosition(next);
                    if (
                      solid === "cube" &&
                      Math.abs(tilt) >= 40 &&
                      Math.abs(next) < 0.4
                    )
                      setChallengeDone(true);
                  })
                }
              />
            </label>
            <label>
              <RotateCcw size={16} />
              <span>
                <b>Tilt plane</b>Rotate to change angle
              </span>
              <input
                aria-label="Plane tilt"
                type="range"
                min="-60"
                max="60"
                value={tilt}
                onChange={(event) =>
                  act(() => {
                    const next = Number(event.target.value);
                    setTilt(next);
                    if (
                      solid === "cube" &&
                      Math.abs(next) >= 40 &&
                      Math.abs(position) < 0.4
                    )
                      setChallengeDone(true);
                  })
                }
              />
              <output>{tilt}°</output>
            </label>
            <label>
              <input
                aria-label="Trace section"
                type="checkbox"
                checked={trace}
                onChange={() => act(() => setTrace((v) => !v))}
              />
              <span>
                <b>Trace section</b>Animate intersection
              </span>
              <input
                aria-label="Trace position"
                type="range"
                min="-2.2"
                max="2.2"
                step=".1"
                value={position}
                onChange={(event) =>
                  act(() => setPosition(Number(event.target.value)))
                }
              />
              <button
                title={playing ? "Pause trace" : "Play trace"}
                onClick={() => act(() => setPlaying((v) => !v))}
              >
                <Play size={16} />
              </button>
            </label>
          </footer>
        </article>
        <article className="cross405-result">
          <h2>Intersection shape</h2>
          <SectionGraphic shape={section.shape} />
          <h3>{section.shape}</h3>
          <div>
            <header>
              <span>Side lengths</span>
              <span>Length</span>
            </header>
            {section.lengths.map((length, index) => (
              <p key={index}>
                <span>{String.fromCharCode(97 + index)}</span>
                <b>{fmt(length)}</b>
              </p>
            ))}
          </div>
          <strong>
            <span>Perimeter</span>
            {fmt(section.perimeter)}
          </strong>
          <strong>
            <span>Area</span>
            {fmt(section.area)}
            <small>square units</small>
          </strong>
          <button onClick={() => setCalculations((v) => !v)}>
            Show calculations⌄
          </button>
          {calculations && (
            <p className="cross405-calc">
              Computed from the ordered plane-solid intersection polygon using
              the shoelace area in its local plane basis.
            </p>
          )}
        </article>
      </section>
      <section className="cross405-predict">
        <h2>Predict before slicing</h2>
        <p>What shape will the intersection be?</p>
        <div>
          {(
            [
              "Triangle",
              "Rectangle",
              "Square",
              "Circle",
              "Ellipse",
              "Other",
            ] as Prediction[]
          ).map((item) => (
            <button
              key={item}
              className={prediction === item ? "active" : ""}
              onClick={() => act(() => setPrediction(item))}
            >
              {item === "Triangle" ? (
                <Triangle size={18} />
              ) : item === "Circle" || item === "Ellipse" ? (
                <Circle size={18} />
              ) : item === "Other" ? (
                "•••"
              ) : (
                <span />
              )}
              {item}
            </button>
          ))}
        </div>
        <button
          className="cross405-check"
          onClick={() => {
            setChecked(true);
            onInteraction();
          }}
        >
          Check prediction
        </button>
        {checked && (
          <strong className={correct ? "correct" : "wrong"}>
            {correct
              ? `Correct! This plane creates a ${section.shape.toLowerCase()}.`
              : `The intersection is a ${section.shape.toLowerCase()}.`}
          </strong>
        )}
      </section>
      <section className="cross405-examples">
        <h2>Explore more cross-sections</h2>
        <p>Try classic examples and compare.</p>
        <div>
          <ExampleCard
            kind="cone"
            title="Horizontal slice (cone)"
            result="Circle"
            onClick={() => {
              setSolid("cone");
              setTilt(0);
              setPosition(0);
            }}
          />
          <ExampleCard
            kind="cylinder"
            title="Oblique slice (cylinder)"
            result="Ellipse"
            onClick={() => {
              setSolid("cylinder");
              setTilt(-30);
              setPosition(0);
            }}
          />
          <ExampleCard
            kind="cube"
            title="Diagonal slice (cube)"
            result="Hexagon"
            onClick={() => {
              setSolid("cube");
              setTilt(-45);
              setPosition(0);
            }}
          />
        </div>
      </section>
      <aside className="cross405-tip">
        <Lightbulb size={17} />
        <b>Tips</b>Different planes create different shapes. Try moving and
        tilting the plane to discover all possibilities.
      </aside>
      <nav className="cross405-next">
        <a href="/lessons/3d-mathematics/404-nets-of-solids">
          ← Previous · Nets of Solids
        </a>
        <a href="/lessons/3d-mathematics/406-volume">Next · Volume →</a>
      </nav>
    </section>
  );
}

function sectionFor(solid: Solid, tilt: number, offset: number): Section {
  if (solid !== "cube") {
    const radius = solid === "cone" ? Math.max(0.25, 2.3 - offset * 0.45) : 2.2,
      angle = (Math.abs(tilt) * Math.PI) / 180,
      a = radius / Math.max(0.35, Math.cos(angle)),
      b = radius,
      ellipse = Math.abs(tilt) > 5,
      perimeter = ellipse
        ? Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
        : 2 * Math.PI * radius;
    return {
      shape: ellipse ? "Ellipse" : "Circle",
      points: Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * Math.PI * 2;
        return [a * Math.cos(t), offset, b * Math.sin(t)] as [
          number,
          number,
          number,
        ];
      }),
      lengths: [],
      perimeter,
      area: Math.PI * a * b,
    };
  }
  const s = Math.min(1, Math.abs(tilt) / 45),
    normal = normalize([s, 1, s]),
    vertices: Array<[number, number, number]> = [
      [-H, -H, -H],
      [H, -H, -H],
      [-H, H, -H],
      [H, H, -H],
      [-H, -H, H],
      [H, -H, H],
      [-H, H, H],
      [H, H, H],
    ],
    edges = [
      [0, 1],
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 5],
      [2, 3],
      [2, 6],
      [3, 7],
      [4, 5],
      [4, 6],
      [5, 7],
      [6, 7],
    ],
    points: [number, number, number][] = [];
  for (const [a, b] of edges) {
    const p = vertices[a],
      q = vertices[b],
      dp = dot(normal, p) - offset,
      dq = dot(normal, q) - offset;
    if (Math.abs(dp) < 1e-7) uniquePush(points, p);
    if (dp * dq < 0) {
      const t = dp / (dp - dq);
      uniquePush(points, [
        p[0] + (q[0] - p[0]) * t,
        p[1] + (q[1] - p[1]) * t,
        p[2] + (q[2] - p[2]) * t,
      ]);
    }
  }
  const ordered = sortOnPlane(points, normal),
    lengths = ordered.map((p, i) =>
      distance(p, ordered[(i + 1) % ordered.length]),
    ),
    perimeter = lengths.reduce((a, b) => a + b, 0),
    area = polygonArea(ordered, normal);
  const shape =
    ordered.length === 6
      ? "Hexagon"
      : ordered.length === 4
        ? Math.max(...lengths) - Math.min(...lengths) < 0.05
          ? "Square"
          : "Rectangle"
        : ordered.length === 3
          ? "Triangle"
          : "Other";
  return { shape, points: ordered, lengths, perimeter, area };
}
function SolidModel({ solid }: { solid: Solid }) {
  if (solid === "cube")
    return (
      <mesh>
        <boxGeometry args={[H * 2, H * 2, H * 2]} />
        <meshStandardMaterial color="#aab9c8" transparent opacity={0.16} />
        <Edges color="#27384a" />
      </mesh>
    );
  if (solid === "cone")
    return (
      <mesh>
        <coneGeometry args={[2.5, 5, 64]} />
        <meshStandardMaterial
          color="#7f9dad"
          transparent
          opacity={0.22}
          side={DoubleSide}
        />
        <Edges color="#3c5869" />
      </mesh>
    );
  return (
    <mesh>
      <cylinderGeometry args={[2.3, 2.3, 5, 64]} />
      <meshStandardMaterial
        color="#7f9dad"
        transparent
        opacity={0.22}
        side={DoubleSide}
      />
      <Edges color="#3c5869" />
    </mesh>
  );
}
function SlicePlane({
  section,
  solid,
  tilt,
  position,
  trace,
  onPosition,
}: {
  section: Section;
  solid: Solid;
  tilt: number;
  position: number;
  trace: boolean;
  onPosition: (v: number) => void;
}) {
  const normal =
      solid === "cube"
        ? normalize([
            Math.min(1, Math.abs(tilt) / 45),
            1,
            Math.min(1, Math.abs(tilt) / 45),
          ])
        : normalize([
            Math.sin((tilt * Math.PI) / 180),
            Math.cos((tilt * Math.PI) / 180),
            0,
          ]),
    q = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      new Vector3(...normal),
    ),
    center = new Vector3(...normal).multiplyScalar(position);
  return (
    <group>
      <mesh
        position={center}
        quaternion={q}
        onPointerDown={(event) => {
          event.stopPropagation();
          (event.target as Element).setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) onPosition(clamp(event.point.y, -2.2, 2.2));
        }}
      >
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#59bdf2"
          transparent
          opacity={0.35}
          side={DoubleSide}
        />
      </mesh>
      {trace && section.points.length > 2 && (
        <Line
          points={[...section.points, section.points[0]]}
          color="#e64cff"
          lineWidth={4}
        />
      )}
    </group>
  );
}
function SectionGraphic({ shape }: { shape: string }) {
  const n =
      shape === "Hexagon"
        ? 6
        : shape === "Triangle"
          ? 3
          : shape === "Square" || shape === "Rectangle"
            ? 4
            : 48,
    rx = shape === "Ellipse" || shape === "Rectangle" ? 62 : 48,
    ry = shape === "Ellipse" || shape === "Rectangle" ? 38 : 48,
    points = Array.from(
      { length: n },
      (_, i) =>
        `${90 + rx * Math.cos(-Math.PI / 2 + (i / n) * Math.PI * 2)},${70 + ry * Math.sin(-Math.PI / 2 + (i / n) * Math.PI * 2)}`,
    ).join(" ");
  return (
    <svg viewBox="0 0 180 140">
      <polygon
        points={points}
        fill="#e2c6f5"
        stroke="#a52de6"
        strokeWidth="2"
      />
      {points.split(" ").map((point, i) => {
        const [x, y] = point.split(",");
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#a52de6" />
        );
      })}
    </svg>
  );
}
function ExampleCard({
  kind,
  title,
  result,
  onClick,
}: {
  kind: Solid;
  title: string;
  result: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}>
      <div className={`cross405-example-art ${kind}`}>
        <i />
        <i />
        <i />
      </div>
      <b>{title}</b>
      <span>Intersection: {result}</span>
      <em>{result}</em>
    </button>
  );
}
const dot = (a: number[], b: number[]) =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  normalize = (v: number[]) => {
    const m = Math.hypot(...v);
    return [v[0] / m, v[1] / m, v[2] / m] as [number, number, number];
  },
  distance = (a: number[], b: number[]) =>
    Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function uniquePush(
  points: [number, number, number][],
  p: [number, number, number],
) {
  if (!points.some((q) => distance(p, q) < 1e-5)) points.push([...p]);
}
function sortOnPlane(
  points: [number, number, number][],
  normal: [number, number, number],
) {
  if (points.length < 3) return points;
  const c = points.reduce(
      (a, p) => [
        a[0] + p[0] / points.length,
        a[1] + p[1] / points.length,
        a[2] + p[2] / points.length,
      ],
      [0, 0, 0],
    ),
    ref = Math.abs(normal[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0],
    u = normalize([
      normal[1] * ref[2] - normal[2] * ref[1],
      normal[2] * ref[0] - normal[0] * ref[2],
      normal[0] * ref[1] - normal[1] * ref[0],
    ]),
    v = [
      normal[1] * u[2] - normal[2] * u[1],
      normal[2] * u[0] - normal[0] * u[2],
      normal[0] * u[1] - normal[1] * u[0],
    ];
  return [...points].sort(
    (a, b) =>
      Math.atan2(
        dot(
          a.map((x, i) => x - c[i]),
          v,
        ),
        dot(
          a.map((x, i) => x - c[i]),
          u,
        ),
      ) -
      Math.atan2(
        dot(
          b.map((x, i) => x - c[i]),
          v,
        ),
        dot(
          b.map((x, i) => x - c[i]),
          u,
        ),
      ),
  );
}
function polygonArea(points: number[][], normal: number[]) {
  let cross = [0, 0, 0];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    cross = [
      cross[0] + p[1] * q[2] - p[2] * q[1],
      cross[1] + p[2] * q[0] - p[0] * q[2],
      cross[2] + p[0] * q[1] - p[1] * q[0],
    ];
  });
  return Math.abs(dot(cross, normal)) / 2;
}
const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v)),
  round = (v: number) => Math.round(v * 10000) / 10000,
  fmt = (v: number) =>
    Number.isInteger(round(v)) ? String(round(v)) : v.toFixed(2);
