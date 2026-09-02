import { Edges, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Check,
  Crosshair,
  ExternalLink,
  Grid3X3,
  Lightbulb,
  Lock,
  Maximize,
  Move,
  Rotate3D,
  RotateCcw,
  Ruler,
  Scale3D,
  Share2,
  ShieldCheck,
  Sun,
  Unlock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./ARPlacementTargetLesson412.css";

type Tool = "move" | "rotate" | "scale";
type Drag = {
  x: number;
  y: number;
  position: [number, number];
  rotation: number;
  scale: number;
} | null;
const targets = [1, 0.5, 1.5];
export default function ARPlacementTargetLesson412({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [placed, setPlaced] = useState(true),
    [tool, setTool] = useState<Tool>("move"),
    [position, setPosition] = useState<[number, number]>([0, 0]),
    [rotation, setRotation] = useState(0),
    [scale, setScale] = useState(1),
    [locked, setLocked] = useState(true),
    [occlusion, setOcclusion] = useState(true),
    [grid, setGrid] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [targetIndex, setTargetIndex] = useState(0),
    [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
      "idle",
    ),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const drag = useRef<Drag>(null),
    target = targets[targetIndex];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setPlaced(true);
    setTool("move");
    setPosition([0, 0]);
    setRotation(0);
    setScale(1);
    setLocked(true);
    setOcclusion(true);
    setGrid(true);
    setTab("Interaction + visualization");
    setTargetIndex(0);
    setFeedback("idle");
    setShared(false);
    setActions(0);
    drag.current = null;
  };
  useEffect(reset, [resetToken]);
  const place = () =>
    act(() => {
      setPlaced(true);
      setLocked(true);
      setFeedback("idle");
    });
  const begin = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!placed) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      position,
      rotation,
      scale,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || !placed) return;
    const dx = event.clientX - drag.current.x,
      dy = event.clientY - drag.current.y;
    if (tool === "move" && !locked)
      setPosition([
        clamp(drag.current.position[0] + dx / 130, -1.4, 1.4),
        clamp(drag.current.position[1] - dy / 130, -0.8, 0.8),
      ]);
    if (tool === "rotate") setRotation(drag.current.rotation + dx * 0.012);
    if (tool === "scale")
      setScale(clamp(drag.current.scale + (dx - dy) / 220, 0.25, 2));
    setFeedback("idle");
    onInteraction();
  };
  const check = () =>
    act(() =>
      setFeedback(
        Math.abs(scale - target) <= target * 0.02 ? "correct" : "incorrect",
      ),
    );
  return (
    <section
      className="cs378-page ar412-page"
      data-testid="geometry3d-mockup-0597"
      data-object-model="threejs-dedicated-ar-room-plane-placement-pose-anchor-occlusion-lighting-scale-verification"
      data-direct-interaction="true"
      data-placed={placed}
      data-tool={tool}
      data-position={`${round(position[0])},${round(position[1])}`}
      data-rotation={round(rotation)}
      data-scale={round(scale)}
      data-locked={locked}
      data-occlusion={occlusion}
      data-grid={grid}
      data-target={target}
      data-feedback={feedback}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="ar412-hero">
        <small>3D MATHEMATICS</small>
        <small>3D GEOMETRY AND SOLIDS</small>
        <h1>AR Placement</h1>
        <p>Place geometry in physical space and explore.</p>
        <div className="ar412-badges">
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
                  `AR cube ${round(scale)} m, rotation ${round(rotation)} rad`,
                );
              })
            }
          >
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <a href="/workspace">
            <ExternalLink />
            Workspace
          </a>
        </nav>
      </header>
      <nav className="ar412-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="ar412-simulator">
        <header>
          <small>INTERACTION · VISUALIZATION</small>
          <h2>AR lesson simulator</h2>
          <p>
            Use your room as a lab. Place, move, and explore solids and graphs
            in real-world scale.
          </p>
          <span className={locked ? "locked" : ""}>
            {locked ? <Lock /> : <Unlock />}Anchor {locked ? "locked" : "open"}
          </span>
          <label>
            Occlusion
            <input
              type="checkbox"
              checked={occlusion}
              onChange={(e) => act(() => setOcclusion(e.target.checked))}
            />
          </label>
        </header>
        <aside>
          <h3>GUIDED STEPS</h3>
          {[
            [
              "Scan surface",
              "Move around slowly to detect a flat, stable surface.",
            ],
            ["Aim", "Point the reticle at the detected surface."],
            ["Place", "Tap to place the object."],
            ["Inspect", "Move, rotate, scale and view from all sides."],
          ].map(([title, text], index) => (
            <article key={title} className={placed || index < 2 ? "done" : ""}>
              <b>{index + 1}</b>
              <h4>{title}</h4>
              <p>{text}</p>
              <Check />
            </article>
          ))}
        </aside>
        <div
          className="ar412-room"
          data-background="/assets/lesson-412/ar-study-room.png"
        >
          <div className={grid ? "ar412-plane" : "ar412-plane hidden"} />
          <ARScene
            placed={placed}
            position={position}
            rotation={rotation}
            scale={scale}
            occlusion={occlusion}
          />
          <div className="ar412-reticle">
            <Crosshair />
          </div>
          <div
            className="ar412-drag-layer"
            aria-label="Drag placed object"
            onPointerDown={begin}
            onPointerMove={move}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          />
          <button className="ar412-place" onClick={place}>
            <Move />
            Tap to place
          </button>
          <button
            className="ar412-center"
            onClick={() => act(() => setPosition([0, 0]))}
            aria-label="Center object"
          >
            <Crosshair />
          </button>
          <button
            className="ar412-grid"
            onClick={() => act(() => setGrid((value) => !value))}
            aria-label="Toggle detected grid"
          >
            <Grid3X3 />
          </button>
        </div>
      </section>
      <section className="ar412-tools">
        {[
          {
            id: "move",
            icon: <Move />,
            title: "Move",
            text: "Drag to move",
            key: "M",
          },
          {
            id: "rotate",
            icon: <Rotate3D />,
            title: "Rotate",
            text: "Drag to rotate",
            key: "R",
          },
          {
            id: "scale",
            icon: <Scale3D />,
            title: "Scale",
            text: "Pinch or drag",
            key: "S",
          },
        ].map((item) => (
          <button
            key={item.id}
            className={tool === item.id ? "active" : ""}
            onClick={() => act(() => setTool(item.id as Tool))}
          >
            {item.icon}
            <span>
              <b>{item.title}</b>
              {item.text}
              <kbd>{item.key}</kbd>
            </span>
          </button>
        ))}
        <button
          className={locked ? "active lock" : ""}
          onClick={() => act(() => setLocked((value) => !value))}
        >
          {locked ? <Lock /> : <Unlock />}
          <span>
            <b>Lock anchor</b>Keep object fixed<kbd>L</kbd>
          </span>
        </button>
        <button onClick={reset}>
          <RotateCcw />
          <span>
            <b>Reset</b>Clear & start over<kbd>Del</kbd>
          </span>
        </button>
      </section>
      <section className="ar412-status">
        <article>
          <Ruler />
          <span>
            Real-world scale<b>1 unit = {scale.toFixed(3)} m</b>
            <small>({(scale * 100).toFixed(1)} cm)</small>
          </span>
        </article>
        <article>
          <Lock />
          <span>
            Anchor status<b>{locked ? "Anchor locked" : "Anchor open"}</b>
            <small>{locked ? "Stable tracking" : "Can be moved"}</small>
          </span>
        </article>
        <article>
          <Maximize />
          <span>
            Surface<b>Horizontal</b>
            <small>± 1.2°</small>
          </span>
        </article>
        <article>
          <Sun />
          <span>
            Lighting<b>Good</b>
            <small>~ 620 lux</small>
          </span>
        </article>
        <article>
          <ShieldCheck />
          <span>
            Safety<b>Clear area</b>
            <small>Keep area clear</small>
          </span>
        </article>
      </section>
      <section className="ar412-challenge">
        <article>
          <small>CHALLENGE</small>
          <h2>Place a {target} m cube and verify scale</h2>
          <p>
            Place a cube with side length {target} meter. Then verify the scale
            using the on-screen ruler.
          </p>
          <h3>Steps</h3>
          <p>
            <b>1</b>Tap to place the cube.
          </p>
          <p>
            <b>2</b>Use the scale or ruler to measure an edge.
          </p>
          <p>
            <b>3</b>Confirm the edge length is {target.toFixed(2)} m (± 2%).
          </p>
        </article>
        <div className="ar412-measure">
          <CubeDiagram size={scale} />
          <aside className={feedback}>
            <Check />
            <b>
              {feedback === "correct"
                ? "Good scale!"
                : feedback === "incorrect"
                  ? "Adjust scale"
                  : "Scale check"}
            </b>
            <small>Edge length</small>
            <strong>{scale.toFixed(2)} m</strong>
            <span>({(scale * 100).toFixed(1)} cm)</span>
          </aside>
        </div>
        <footer>
          <button
            onClick={() =>
              act(() => {
                setTargetIndex((value) => (value + 1) % targets.length);
                setFeedback("idle");
                setScale(1);
              })
            }
          >
            Try another
          </button>
          <button onClick={check}>Check</button>
        </footer>
      </section>
      <section className="ar412-notes">
        <article>
          <h2>
            <Lightbulb />
            Tips
          </h2>
          <ul>
            <li>
              For best results, use a well-lit area with a flat, textured
              surface.
            </li>
            <li>Avoid highly reflective or transparent surfaces.</li>
            <li>Move slowly while scanning and keep the surface in view.</li>
          </ul>
        </article>
        <article>
          <h2>
            <ShieldCheck />
            Safety note
          </h2>
          <ul>
            <li>Ensure your surroundings are clear.</li>
            <li>Do not place virtual objects near edges.</li>
            <li>Take breaks and maintain good posture.</li>
          </ul>
        </article>
      </section>
      <nav className="ar412-tags">
        <span>primary-control</span>
        <span className="active">3D object</span>
        <span>measurement</span>
      </nav>
      <nav className="ar412-next">
        <a href="/lessons/3d-mathematics/411-orthographic-views">
          ←{" "}
          <span>
            Previous<small>Orthographic Views</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/413-surface-z-f-x-y">
          <span>
            Next<small>3D Transformations</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function ARScene({
  placed,
  position,
  rotation,
  scale,
  occlusion,
}: {
  placed: boolean;
  position: [number, number];
  rotation: number;
  scale: number;
  occlusion: boolean;
}) {
  return (
    <Canvas
      className="ar412-canvas"
      camera={{ position: [4, 3.2, 5.5], fov: 38 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 7, 5]} intensity={2} />
      {placed && (
        <group
          position={[position[0], scale / 2 - 0.35, position[1]]}
          rotation={[0, rotation, 0]}
          scale={scale}
        >
          <mesh>
            <boxGeometry />
            <meshPhysicalMaterial
              color="#24a8db"
              transparent
              opacity={occlusion ? 0.58 : 0.82}
              roughness={0.25}
            />
            <Edges color="#e9fbff" />
          </mesh>
          <Line
            points={[
              [0, 0, 0],
              [1.8, 0, 0],
            ]}
            color="#ef3d45"
            lineWidth={2}
          />
          <Line
            points={[
              [0, 0, 0],
              [0, 1.8, 0],
            ]}
            color="#177bea"
            lineWidth={2}
          />
          <Line
            points={[
              [0, 0, 0],
              [0, 0, 1.8],
            ]}
            color="#22b95a"
            lineWidth={2}
          />
        </group>
      )}
    </Canvas>
  );
}
function CubeDiagram({ size }: { size: number }) {
  const s = clamp(size, 0.5, 1.5),
    offset = (1 - s) * 16;
  return (
    <svg viewBox="0 0 210 145">
      <g
        transform={`translate(${offset} ${offset}) scale(${s})`}
        fill="#63b5d1"
        fillOpacity=".65"
        stroke="#fff"
        strokeWidth="2"
      >
        <path d="M60 40 110 16 160 40 110 66Z" />
        <path d="M60 40 110 66 110 126 60 98Z" />
        <path d="M110 66 160 40 160 98 110 126Z" />
      </g>
      <g fill="#176dc4" fontSize="10">
        <text x="25" y="75">
          {size.toFixed(2)} m
        </text>
        <text x="64" y="138">
          {size.toFixed(2)} m
        </text>
        <text x="158" y="126">
          {size.toFixed(2)} m
        </text>
      </g>
    </svg>
  );
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
function round(value: number) {
  return Number(value.toFixed(2));
}
