import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  Circle,
  Eye,
  EyeOff,
  PaintRoller,
  Play,
  RotateCcw,
  Share2,
  Triangle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./SurfaceAreaTargetLesson407.css";

type Solid =
  "cuboid" | "cube" | "cylinder" | "cone" | "triPrism" | "pyramid" | "sphere";
type Face = "top" | "bottom" | "front" | "back" | "left" | "right";
const solids: { id: Solid; label: string }[] = [
  { id: "cuboid", label: "Cuboid" },
  { id: "cube", label: "Cube" },
  { id: "cylinder", label: "Cylinder" },
  { id: "cone", label: "Cone" },
  { id: "triPrism", label: "Triangular Prism" },
  { id: "pyramid", label: "Square Pyramid" },
  { id: "sphere", label: "Sphere" },
];
const faces: Face[] = ["top", "bottom", "front", "back", "left", "right"];
const colors: Record<Face, string> = {
  top: "#89c83f",
  bottom: "#ff964a",
  front: "#408ee2",
  back: "#f5c84e",
  left: "#3dc5bd",
  right: "#a34bcb",
};

export default function SurfaceAreaTargetLesson407({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [solid, setSolid] = useState<Solid>("cuboid"),
    [l, setL] = useState(4),
    [b, setB] = useState(3),
    [h, setH] = useState(2),
    [selected, setSelected] = useState<Face[]>(faces),
    [openTop, setOpenTop] = useState(false),
    [folded, setFolded] = useState(false),
    [rotating, setRotating] = useState(true),
    [wireframe, setWireframe] = useState(false),
    [tab, setTab] = useState("Explore"),
    [units, setUnits] = useState("u²"),
    [coverage, setCoverage] = useState(100),
    [covering, setCovering] = useState(false),
    [showDims, setShowDims] = useState(true),
    [showLabels, setShowLabels] = useState(true),
    [showNetAreas, setShowNetAreas] = useState(true),
    [snap, setSnap] = useState(true),
    [layout, setLayout] = useState<"good" | "poor">("good"),
    [challenge, setChallenge] = useState(false),
    [checked, setChecked] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const reset = () => {
    setSolid("cuboid");
    setL(4);
    setB(3);
    setH(2);
    setSelected(faces);
    setOpenTop(false);
    setFolded(false);
    setRotating(true);
    setWireframe(false);
    setTab("Explore");
    setUnits("u²");
    setCoverage(100);
    setCovering(false);
    setShowDims(true);
    setShowLabels(true);
    setShowNetAreas(true);
    setSnap(true);
    setLayout("good");
    setChallenge(false);
    setChecked(false);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!covering) return;
    const timer = window.setInterval(
      () =>
        setCoverage((v) => {
          if (v >= 100) {
            setCovering(false);
            return 100;
          }
          return Math.min(100, v + 5);
        }),
      90,
    );
    return () => window.clearInterval(timer);
  }, [covering]);
  const faceAreas = useMemo(
    () => ({
      top: l * b,
      bottom: l * b,
      front: l * h,
      back: l * h,
      left: b * h,
      right: b * h,
    }),
    [l, b, h],
  );
  const exposed = faces.filter(
    (face) => selected.includes(face) && !(openTop && face === "top"),
  );
  const cuboidArea = exposed.reduce((sum, face) => sum + faceAreas[face], 0),
    totalArea = surfaceArea(solid, l, b, h, openTop),
    displayArea = solid === "cuboid" ? cuboidArea : totalArea,
    covered = (displayArea * coverage) / 100,
    waste = layout === "good" ? 8 : 22;
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    setChecked(false);
    onInteraction();
  };
  const toggleFace = (face: Face) =>
    act(() =>
      setSelected((current) =>
        current.includes(face)
          ? current.filter((item) => item !== face)
          : [...current, face],
      ),
    );
  return (
    <section
      className="cs378-page sa407-page"
      data-testid="geometry3d-mockup-0592"
      data-object-model="threejs-dedicated-linked-solid-face-net-paint-surface-area-packing-challenge"
      data-direct-interaction="true"
      data-solid={solid}
      data-length={l}
      data-breadth={b}
      data-height={h}
      data-selected-faces={selected.length}
      data-open-top={openTop}
      data-folded={folded}
      data-coverage={coverage}
      data-total-area={round(displayArea)}
      data-covered-area={round(covered)}
      data-layout={layout}
      data-waste={waste}
      data-checked={checked}
      data-correct={checked && layout === "good"}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="sa407-hero">
        <h1>Surface Area</h1>
        <p>Explore, unfold, cover and calculate the total surface area.</p>
        <div className="sa407-badges">
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </div>
        <nav>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setShared(true);
                void navigator.clipboard?.writeText(
                  `Surface area ${fmt(displayArea)} ${units}`,
                );
              })
            }
          >
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <label>
            Units
            <select
              aria-label="Units"
              value={units}
              onChange={(e) => act(() => setUnits(e.target.value))}
            >
              <option>u²</option>
              <option>cm²</option>
              <option>m²</option>
            </select>
          </label>
        </nav>
      </header>
      <nav className="sa407-tabs">
        {[
          "Explore",
          "Unfold",
          "Cover",
          "Formula Builder",
          "Learn",
          "Challenge",
        ].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() =>
              act(() => {
                setTab(item);
                if (item === "Unfold") setFolded(false);
                if (item === "Cover") {
                  setCoverage(0);
                  setCovering(true);
                }
                if (item === "Challenge") setChallenge(true);
              })
            }
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="sa407-picker">
        <h2>1. Select a solid</h2>
        <div>
          {solids.map((item) => (
            <button
              key={item.id}
              className={solid === item.id ? "active" : ""}
              onClick={() => act(() => setSolid(item.id))}
            >
              <SolidIcon solid={item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="sa407-lab">
        <article className="sa407-solid">
          <h2>2. Select faces (click on faces or net)</h2>
          <nav>
            <label>
              Rotate
              <input
                aria-label="Rotate solid"
                type="checkbox"
                checked={rotating}
                onChange={() => act(() => setRotating((v) => !v))}
              />
            </label>
            <label>
              Wireframe
              <input
                aria-label="Wireframe"
                type="checkbox"
                checked={wireframe}
                onChange={() => act(() => setWireframe((v) => !v))}
              />
            </label>
          </nav>
          <div className="sa407-canvas">
            <Canvas
              data-testid="geometry3d-surface-area-canvas"
              camera={{ position: [6, 4.5, 7], fov: 32 }}
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <color attach="background" args={["#ffffff"]} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[6, 8, 5]} intensity={2} />
              <SolidModel
                solid={solid}
                l={l}
                b={b}
                h={h}
                selected={selected}
                wireframe={wireframe}
                onFace={toggleFace}
              />
              <OrbitControls
                makeDefault
                autoRotate={rotating}
                autoRotateSpeed={1.2}
                enablePan={false}
              />
            </Canvas>
            {showLabels && (
              <div className="sa407-face-labels">
                <b>Top</b>
                <b>Front</b>
                <b>Right</b>
              </div>
            )}
            {showDims && (
              <div className="sa407-dim">
                <b>2</b>
                <b>4</b>
                <b>3</b>
              </div>
            )}
            <span className="sr-only">Drag solid to rotate</span>
          </div>
          <div className="sa407-dims">
            <b>Dimensions</b>
            <Stepper label="l" value={l} onChange={(v) => act(() => setL(v))} />
            <Stepper label="b" value={b} onChange={(v) => act(() => setB(v))} />
            <Stepper label="h" value={h} onChange={(v) => act(() => setH(v))} />
            <label>
              Open top
              <input
                aria-label="Open top"
                type="checkbox"
                checked={openTop}
                onChange={() => act(() => setOpenTop((v) => !v))}
              />
            </label>
          </div>
          <div className="sa407-face-list">
            <b>Face areas ({units})</b>
            {faces.map((face) => (
              <button key={face} onClick={() => toggleFace(face)}>
                <i style={{ background: colors[face] }} />
                <span>{cap(face)}</span>
                <small>{formula(face, l, b, h)}</small>
                <strong>{fmt(faceAreas[face])}</strong>
                {selected.includes(face) ? <Eye /> : <EyeOff />}
              </button>
            ))}
            <footer>
              Total surface area{" "}
              <strong>
                {fmt(solid === "cuboid" ? cuboidArea : totalArea)} {units}
              </strong>
            </footer>
          </div>
        </article>
        <article className="sa407-net">
          <header>
            <h2>3. Unfold (net)</h2>
            <button onClick={() => act(() => setFolded((v) => !v))}>
              {folded ? "Unfold" : "Fold"}
            </button>
            <button onClick={() => act(() => setSelected(faces))}>
              Reset net
            </button>
          </header>
          <CuboidNet
            l={l}
            b={b}
            h={h}
            selected={selected}
            labels={showLabels}
            areas={showNetAreas}
            onFace={toggleFace}
          />
          <footer>
            <span>■ Selected</span>
            <span>⋯ Not selected</span>
          </footer>
        </article>
      </section>
      <section className="sa407-cover">
        <article>
          <h2>4. Cover (paint) and calculate</h2>
          <div className="sa407-cover-net">
            <CuboidNet
              l={l}
              b={b}
              h={h}
              selected={selected}
              labels={false}
              areas={false}
              onFace={toggleFace}
            />
            <PaintRoller aria-hidden="true" />
          </div>
          <div className="sa407-coverage">
            <b>Coverage animation</b>
            <button
              onClick={() =>
                act(() => {
                  setCoverage(0);
                  setCovering(true);
                })
              }
            >
              <Play />
              Paint
            </button>
            <progress max="100" value={coverage} />
            <span>{coverage}%</span>
            <b>Covered area</b>
            <strong>
              {fmt(covered)} {units}
            </strong>
            <p>
              ({exposed.map((face) => fmt(faceAreas[face])).join(" + ")}) ×{" "}
              {coverage}%
            </p>
            <output>
              Total surface area{" "}
              <b>
                {fmt(solid === "cuboid" ? cuboidArea : totalArea)} {units}
              </b>
            </output>
          </div>
        </article>
        <aside>
          <div>
            <h3>Options</h3>
            <Toggle
              label="Open top (no top face)"
              value={openTop}
              set={() => act(() => setOpenTop((v) => !v))}
            />
            <Toggle
              label="Show dimensions"
              value={showDims}
              set={() => act(() => setShowDims((v) => !v))}
            />
            <Toggle
              label="Show face labels"
              value={showLabels}
              set={() => act(() => setShowLabels((v) => !v))}
            />
            <Toggle
              label="Show area on net"
              value={showNetAreas}
              set={() => act(() => setShowNetAreas((v) => !v))}
            />
            <Toggle
              label="Snap to grid"
              value={snap}
              set={() => act(() => setSnap((v) => !v))}
            />
          </div>
          <div>
            <h3>Notes</h3>
            <p>
              Surface area is the total area of all the outer faces (closed
              surface) or selected faces (open surface).
            </p>
          </div>
        </aside>
      </section>
      <section className="sa407-context">
        <article>
          <h3>Curved vs Total Area (Cylinder)</h3>
          <div className="sa407-cylinder" />
          <p>
            Curved surface area
            <br />
            <b>2πrh</b>
            <br />
            Total surface area
            <br />
            <b>2πrh + 2πr²</b>
          </p>
          <button onClick={() => act(() => setSolid("cylinder"))}>
            Explore Cylinder
          </button>
        </article>
        <article>
          <h3>Packing context</h3>
          <Box />
          <p>
            Material comes in rectangular sheets.
            <br />
            <br />
            Minimize waste (cut efficiently).
          </p>
          <label>
            <input
              type="checkbox"
              checked={layout === "poor"}
              onChange={() =>
                act(() => setLayout((v) => (v === "good" ? "poor" : "good")))
              }
            />{" "}
            Overlaps increase material usage.
          </label>
        </article>
        <article>
          <h3>Waste / Overlap</h3>
          <button
            className={layout === "good" ? "active" : ""}
            onClick={() => act(() => setLayout("good"))}
          >
            Good layout
            <br />
            <NetMini good />
            <b>Waste: 8 {units}</b>
          </button>
          <button
            className={layout === "poor" ? "active bad" : "bad"}
            onClick={() => act(() => setLayout("poor"))}
          >
            Poor layout
            <br />
            <NetMini good={false} />
            <b>Waste: 22 {units}</b>
          </button>
        </article>
      </section>
      <section className="sa407-bottom">
        <article>
          <h3>Worked example</h3>
          <p>
            Cuboid with <i>l</i> = 4, <i>b</i> = 3, <i>h</i> = 2
          </p>
          <div>
            Top = l × b = 4 × 3 = 12 u²
            <br />
            Bottom = l × b = 4 × 3 = 12 u²
            <br />
            Front = l × h = 4 × 2 = 8 u²
            <br />
            Back = l × h = 4 × 2 = 8 u²
            <br />
            Left = b × h = 3 × 2 = 6 u²
            <br />
            Right = b × h = 3 × 2 = 6 u²
          </div>
          <strong>
            Total surface area
            <br />= 12 + 12 + 8 + 8 + 6 + 6<br />
            <b>= 52 u²</b>
          </strong>
          <output>Answer: 52 square units</output>
        </article>
        <article>
          <h3>Challenge</h3>
          <b>Cover the box with minimum material.</b>
          <p>
            <strong>Goal:</strong> Use one rectangular sheet (or minimum pieces)
            to cover the box.
          </p>
          <div>
            {challenge ? (
              <>
                Choose layout:{" "}
                <button
                  className={layout === "good" ? "active" : ""}
                  onClick={() => act(() => setLayout("good"))}
                >
                  Efficient
                </button>
                <button
                  className={layout === "poor" ? "active" : ""}
                  onClick={() => act(() => setLayout("poor"))}
                >
                  Overlap
                </button>
                <button
                  onClick={() => {
                    setChecked(true);
                    onInteraction();
                  }}
                >
                  Check
                </button>
                {checked && (
                  <strong>
                    {layout === "good"
                      ? "Correct: minimum waste is 8 u²."
                      : "Try again: this layout overlaps."}
                  </strong>
                )}
              </>
            ) : (
              "Drag and arrange faces on the net to find the minimum area sheet."
            )}
          </div>
          <button onClick={() => act(() => setChallenge((v) => !v))}>
            {challenge ? "Close Challenge" : "Try Challenge"}
          </button>
        </article>
      </section>
      <nav className="sa407-next">
        <a href="/lessons/3d-mathematics/406-volume">
          ←{" "}
          <span>
            Previous<small>Volume</small>
          </span>
        </a>
        <button onClick={() => act(() => setShared((v) => !v))}>
          Bookmark
        </button>
        <a href="/lessons/3d-mathematics/408-eulers-polyhedron-formula">
          <span>
            Next<small>Euler's Polyhedron Formula</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function SolidModel({
  solid,
  l,
  b,
  h,
  selected,
  wireframe,
  onFace,
}: {
  solid: Solid;
  l: number;
  b: number;
  h: number;
  selected: Face[];
  wireframe: boolean;
  onFace: (f: Face) => void;
}) {
  if (solid === "cuboid" || solid === "cube") {
    const x = solid === "cube" ? l : l,
      y = solid === "cube" ? l : h,
      z = solid === "cube" ? l : b;
    return (
      <group scale={1.05}>
        {faces.map((face) => (
          <FaceMesh
            key={face}
            face={face}
            x={x}
            y={y}
            z={z}
            active={selected.includes(face)}
            wireframe={wireframe}
            onClick={() => onFace(face)}
          />
        ))}
      </group>
    );
  }
  const r = l / 2;
  return (
    <mesh scale={0.8} onClick={() => onFace("front")}>
      {solid === "cylinder" ? (
        <cylinderGeometry args={[r, r, h, 48]} />
      ) : solid === "cone" ? (
        <coneGeometry args={[r, h, 48]} />
      ) : solid === "sphere" ? (
        <sphereGeometry args={[r, 48, 32]} />
      ) : solid === "pyramid" ? (
        <coneGeometry args={[b / Math.SQRT2, h, 4]} />
      ) : (
        <cylinderGeometry args={[b / 2, b / 2, l, 3]} />
      )}
      <meshStandardMaterial
        color="#54a6e7"
        transparent
        opacity={0.82}
        wireframe={wireframe}
      />
      <Edges color="#296795" />
    </mesh>
  );
}
function FaceMesh({
  face,
  x,
  y,
  z,
  active,
  wireframe,
  onClick,
}: {
  face: Face;
  x: number;
  y: number;
  z: number;
  active: boolean;
  wireframe: boolean;
  onClick: () => void;
}) {
  const config: Record<
    Face,
    {
      p: [number, number, number];
      r: [number, number, number];
      s: [number, number];
    }
  > = {
    front: { p: [0, 0, z / 2], r: [0, 0, 0], s: [x, y] },
    back: { p: [0, 0, -z / 2], r: [0, Math.PI, 0], s: [x, y] },
    left: { p: [-x / 2, 0, 0], r: [0, -Math.PI / 2, 0], s: [z, y] },
    right: { p: [x / 2, 0, 0], r: [0, Math.PI / 2, 0], s: [z, y] },
    top: { p: [0, y / 2, 0], r: [-Math.PI / 2, 0, 0], s: [x, z] },
    bottom: { p: [0, -y / 2, 0], r: [Math.PI / 2, 0, 0], s: [x, z] },
  };
  const c = config[face];
  return (
    <mesh
      position={c.p}
      rotation={c.r}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <planeGeometry args={c.s} />
      <meshStandardMaterial
        color={colors[face]}
        transparent
        opacity={active ? 0.88 : 0.18}
        wireframe={wireframe}
        side={DoubleSide}
      />
      <Edges color="#375172" />
    </mesh>
  );
}
function CuboidNet({
  l,
  b,
  h,
  selected,
  labels,
  areas,
  onFace,
}: {
  l: number;
  b: number;
  h: number;
  selected: Face[];
  labels: boolean;
  areas: boolean;
  onFace: (f: Face) => void;
}) {
  const s = 22,
    x = 105,
    y = 88,
    items: { f: Face; x: number; y: number; w: number; h: number }[] = [
      { f: "front", x, y, w: l * s, h: h * s },
      { f: "left", x: x - b * s, y, w: b * s, h: h * s },
      { f: "right", x: x + l * s, y, w: b * s, h: h * s },
      { f: "back", x: x + (l + b) * s, y, w: l * s, h: h * s },
      { f: "top", x, y: y - b * s, w: l * s, h: b * s },
      { f: "bottom", x, y: y + h * s, w: l * s, h: b * s },
    ];
  return (
    <svg
      viewBox="0 0 390 220"
      preserveAspectRatio="xMidYMin meet"
      role="img"
      aria-label="Clickable cuboid net"
    >
      {items.map((item) => (
        <g
          key={item.f}
          onClick={() => onFace(item.f)}
          role="button"
          tabIndex={0}
        >
          <rect
            x={item.x}
            y={item.y}
            width={item.w}
            height={item.h}
            fill={colors[item.f]}
            opacity={selected.includes(item.f) ? 0.9 : 0.2}
            stroke="#23395d"
            strokeDasharray={selected.includes(item.f) ? "0" : "5 4"}
          />
          {labels && (
            <text x={item.x + item.w / 2} y={item.y + item.h / 2 - 3}>
              {cap(item.f)}
            </text>
          )}
          {areas && (
            <text x={item.x + item.w / 2} y={item.y + item.h / 2 + 13}>
              {fmt(
                item.f === "top" || item.f === "bottom"
                  ? l * b
                  : item.f === "front" || item.f === "back"
                    ? l * h
                    : b * h,
              )}{" "}
              u²
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
function SolidIcon({ solid }: { solid: Solid }) {
  return (
    <span>
      {solid === "cuboid" || solid === "cube" ? (
        <Box />
      ) : solid === "cylinder" || solid === "sphere" ? (
        <Circle />
      ) : (
        <Triangle />
      )}
    </span>
  );
}
function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="sa407-step">
      <span>{label}</span>
      <button onClick={() => onChange(Math.max(0.5, value - 1))}>−</button>
      <input
        aria-label={`Dimension ${label}`}
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0.5, Number(e.target.value)))}
      />
      <button onClick={() => onChange(value + 1)}>+</button>
    </label>
  );
}
function Toggle({
  label,
  value,
  set,
}: {
  label: string;
  value: boolean;
  set: () => void;
}) {
  return (
    <label>
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={value}
        onChange={set}
      />
    </label>
  );
}
function NetMini({ good }: { good: boolean }) {
  return (
    <span className={`sa407-netmini ${good ? "good" : "poor"}`}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
function surfaceArea(s: Solid, l: number, b: number, h: number, open: boolean) {
  if (s === "cuboid") return 2 * (l * b + l * h + b * h) - (open ? l * b : 0);
  if (s === "cube") return (open ? 5 : 6) * l * l;
  const r = l / 2;
  if (s === "cylinder")
    return 2 * Math.PI * r * h + (open ? Math.PI * r * r : 2 * Math.PI * r * r);
  if (s === "cone") return Math.PI * r * (r + Math.hypot(r, h));
  if (s === "sphere") return 4 * Math.PI * r * r;
  if (s === "pyramid") return b * b + 2 * b * Math.hypot(b / 2, h);
  return b * h + 2 * l * Math.hypot(b / 2, h) + l * b;
}
const formula = (f: Face, l: number, b: number, h: number) =>
    f === "top" || f === "bottom"
      ? `(${l} × ${b})`
      : f === "front" || f === "back"
        ? `(${l} × ${h})`
        : `(${b} × ${h})`,
  cap = (v: string) => v[0].toUpperCase() + v.slice(1),
  round = (v: number) => Math.round(v * 1000) / 1000,
  fmt = (v: number) =>
    Number.isInteger(round(v)) ? String(round(v)) : v.toFixed(2);
