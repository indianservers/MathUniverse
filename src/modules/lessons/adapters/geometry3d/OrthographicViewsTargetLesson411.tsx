import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Box,
  Check,
  CircleHelp,
  ExternalLink,
  Eye,
  Move,
  Rotate3D,
  RotateCcw,
  Search,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MOUSE } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./OrthographicViewsTargetLesson411.css";

type Block = readonly [number, number, number];
type View = "front" | "top" | "right";
type Tool = "rotate" | "pan" | "zoom";
type RenderMode = "edges" | "faces" | "shaded";
type Unit = "mm" | "cm";
const targetBlocks: Block[] = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [2, 1, 0],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];
const tabs = ["Explore", "Learn", "Compare", "Worked Example", "Challenge"];

export default function OrthographicViewsTargetLesson411({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [tool, setTool] = useState<Tool>("rotate"),
    [renderMode, setRenderMode] = useState<RenderMode>("edges"),
    [hidden, setHidden] = useState(false),
    [rays, setRays] = useState(true),
    [dimensions, setDimensions] = useState(true),
    [layout, setLayout] = useState<"first" | "third">("first"),
    [scale, setScale] = useState("1:1"),
    [unit, setUnit] = useState<Unit>("mm"),
    [tab, setTab] = useState("Explore"),
    [selected, setSelected] = useState(6),
    [viewVersion, setViewVersion] = useState(0),
    [shared, setShared] = useState(false),
    [building, setBuilding] = useState(false),
    [layer, setLayer] = useState(0),
    [builder, setBuilder] = useState<Block[]>([]),
    [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
      "idle",
    ),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setTool("rotate");
    setRenderMode("edges");
    setHidden(false);
    setRays(true);
    setDimensions(true);
    setLayout("first");
    setScale("1:1");
    setUnit("mm");
    setTab("Explore");
    setSelected(6);
    setViewVersion((value) => value + 1);
    setShared(false);
    setBuilding(false);
    setLayer(0);
    setBuilder([]);
    setFeedback("idle");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const sizes = useMemo(
    () => measure(targetBlocks, unit, scale),
    [unit, scale],
  );
  const toggleBuilder = (block: Block) =>
    act(() => {
      setBuilder((current) =>
        contains(current, block)
          ? current.filter((item) => key(item) !== key(block))
          : [...current, block],
      );
      setFeedback("idle");
    });
  const checkBuilder = () =>
    act(() =>
      setFeedback(equalBlocks(builder, targetBlocks) ? "correct" : "incorrect"),
    );
  return (
    <section
      className="cs378-page ortho411-page"
      data-testid="geometry3d-mockup-0596"
      data-object-model="threejs-dedicated-stepped-block-solid-linked-front-top-right-orthographic-projections-scale-layout-builder"
      data-direct-interaction="true"
      data-tool={tool}
      data-render={renderMode}
      data-hidden={hidden}
      data-rays={rays}
      data-dimensions={dimensions}
      data-layout={layout}
      data-scale={scale}
      data-unit={unit}
      data-selected={selected}
      data-width={sizes.width}
      data-height={sizes.height}
      data-depth={sizes.depth}
      data-building={building}
      data-builder-count={builder.length}
      data-feedback={feedback}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="ortho411-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>Orthographic Views</h1>
          <p>Connect 3D and engineering views.</p>
          <div className="ortho411-badges">
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
                    `Orthographic size ${sizes.width} × ${sizes.height} × ${sizes.depth} ${unit}`,
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
        </div>
        <aside>
          <h3>What you’ll learn</h3>
          {[
            "Project 3D solids to orthographic views",
            "Interpret exact front, top and right views",
            "Use first-angle and third-angle layouts",
            "Apply dimensions, scale and hidden lines",
            "Rebuild solids from three views",
          ].map((item) => (
            <p key={item}>
              <Check />
              {item}
            </p>
          ))}
        </aside>
      </header>
      <nav className="ortho411-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="ortho411-work">
        <article className="ortho411-solid">
          <header>
            <h2>
              3D Solid (Rotatable) <CircleHelp />
            </h2>
            <nav>
              <button
                className={tool === "rotate" ? "active" : ""}
                onClick={() => act(() => setTool("rotate"))}
              >
                <Rotate3D />
                Rotate
              </button>
              <button
                className={tool === "pan" ? "active" : ""}
                onClick={() => act(() => setTool("pan"))}
              >
                <Move />
                Pan
              </button>
              <button
                className={tool === "zoom" ? "active" : ""}
                onClick={() => act(() => setTool("zoom"))}
              >
                <Search />
                Zoom
              </button>
              <button
                onClick={() => act(() => setViewVersion((value) => value + 1))}
              >
                <RotateCcw />
                Reset
              </button>
            </nav>
          </header>
          <div className="ortho411-stage">
            <SolidCanvas
              blocks={targetBlocks}
              tool={tool}
              mode={renderMode}
              selected={selected}
              version={viewVersion}
              onSelect={(index) => act(() => setSelected(index))}
              onInteraction={onInteraction}
            />
          </div>
          <nav className="ortho411-render">
            {(["edges", "faces", "shaded"] as RenderMode[]).map((item) => (
              <button
                key={item}
                className={renderMode === item ? "active" : ""}
                onClick={() => act(() => setRenderMode(item))}
              >
                {item}
              </button>
            ))}
            <label>
              Hidden lines{" "}
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => act(() => setHidden(e.target.checked))}
              />
            </label>
            <label>
              Projection rays{" "}
              <input
                type="checkbox"
                checked={rays}
                onChange={(e) => act(() => setRays(e.target.checked))}
              />
            </label>
          </nav>
          <div className="ortho411-controls">
            <section>
              <h3>Display options</h3>
              <label>
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => act(() => setHidden(e.target.checked))}
                />
                Hidden lines
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={rays}
                  onChange={(e) => act(() => setRays(e.target.checked))}
                />
                Projection rays
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={dimensions}
                  onChange={(e) => act(() => setDimensions(e.target.checked))}
                />
                Dimensions
              </label>
            </section>
            <section>
              <h3>Layout</h3>
              <button
                className={layout === "first" ? "active" : ""}
                onClick={() => act(() => setLayout("first"))}
              >
                First-angle <FirstAngleIcon />
              </button>
              <button
                className={layout === "third" ? "active" : ""}
                onClick={() => act(() => setLayout("third"))}
              >
                Third-angle <ThirdAngleIcon />
              </button>
            </section>
          </div>
          <div className="ortho411-scale">
            <label>
              Scale{" "}
              <select
                aria-label="Scale"
                value={scale}
                onChange={(e) => act(() => setScale(e.target.value))}
              >
                <option>1:1</option>
                <option>1:2</option>
                <option>2:1</option>
              </select>
            </label>
            <span>
              1 unit = {scale === "1:2" ? 20 : scale === "2:1" ? 5 : 10} mm
            </span>
            <label>
              Units{" "}
              <select
                aria-label="Units"
                value={unit}
                onChange={(e) => act(() => setUnit(e.target.value as Unit))}
              >
                <option>mm</option>
                <option>cm</option>
              </select>
            </label>
          </div>
          <footer>
            Overall size ({unit}){" "}
            <span>
              W <b>{sizes.width}</b>
            </span>
            <span>
              H <b>{sizes.height}</b>
            </span>
            <span>
              D <b>{sizes.depth}</b>
            </span>
          </footer>
        </article>
        <article className={`ortho411-views ${layout}`}>
          <h2>
            Orthographic Views <CircleHelp />
          </h2>
          {(["front", "top", "right"] as View[]).map((view) => (
            <ProjectionCard
              key={view}
              view={view}
              blocks={targetBlocks}
              hidden={hidden}
              rays={rays}
              dimensions={dimensions}
              selected={selected}
              onSelect={(index) => act(() => setSelected(index))}
              size={sizes}
            />
          ))}
        </article>
        {rays && <ProjectionRays />}
      </section>
      <section className="ortho411-how">
        <h2>How it works</h2>
        <p>
          Orthographic views are 2D projections of a 3D object onto mutually
          perpendicular planes. Select any edge of the solid to highlight its
          exact projections in all views.
        </p>
      </section>
      <section className="ortho411-compare">
        <h2>
          Compare: Perspective vs Orthographic <CircleHelp />
        </h2>
        <div>
          <h3>Perspective view (3D)</h3>
          <MiniSolid blocks={targetBlocks} />
        </div>
        <strong>→</strong>
        <div>
          <h3>Orthographic set (exact)</h3>
          <section>
            {(["front", "top", "right"] as View[]).map((view) => (
              <Projection
                key={view}
                view={view}
                blocks={targetBlocks}
                hidden
                selected={selected}
              />
            ))}
          </section>
        </div>
        <aside>
          <h3>Key difference</h3>
          <p>Perspective shows how the object looks to the eye.</p>
          <p>
            Orthographic shows the exact size and shape of each face — no
            distortion.
          </p>
          <span>
            <Check />
            Parallel lines remain parallel
          </span>
          <span>
            <Check />
            Measurements are exact
          </span>
        </aside>
      </section>
      <section className="ortho411-example">
        <h2>
          Worked Example: Given three views, identify the solid <CircleHelp />
        </h2>
        <article>
          <h3>Given views</h3>
          <div>
            {(["front", "top", "right"] as View[]).map((view) => (
              <Projection
                key={view}
                view={view}
                blocks={targetBlocks}
                hidden
                selected={-1}
              />
            ))}
          </div>
        </article>
        <article>
          <h3>Steps</h3>
          {[
            "Read overall dimensions from views.",
            "Identify step heights and depths.",
            "Match corresponding edges.",
            "Visualise and construct the solid.",
          ].map((item, index) => (
            <p key={item}>
              <b>{index + 1}</b>
              {item}
            </p>
          ))}
        </article>
        <article>
          <h3>Answer (Isometric)</h3>
          <Check />
          <MiniSolid blocks={targetBlocks} />
        </article>
      </section>
      <section className="ortho411-challenge">
        <h2>
          Challenge: Rebuild the solid from three views <CircleHelp />
        </h2>
        <article>
          <h3>Given views</h3>
          <div>
            {(["front", "top", "right"] as View[]).map((view) => (
              <Projection
                key={view}
                view={view}
                blocks={targetBlocks}
                hidden
                selected={-1}
              />
            ))}
          </div>
        </article>
        <article className="ortho411-builder">
          <h3>Your workspace</h3>
          {building ? (
            <>
              <nav>
                <button
                  className={layer === 0 ? "active" : ""}
                  onClick={() => setLayer(0)}
                >
                  Layer 1
                </button>
                <button
                  className={layer === 1 ? "active" : ""}
                  onClick={() => setLayer(1)}
                >
                  Layer 2
                </button>
              </nav>
              <div>
                {Array.from({ length: 6 }, (_, index) => {
                  const block = [
                    index % 3,
                    Math.floor(index / 3),
                    layer,
                  ] as const;
                  return (
                    <button
                      key={key(block)}
                      className={contains(builder, block) ? "active" : ""}
                      aria-label={`Toggle block ${key(block)}`}
                      onClick={() => toggleBuilder(block)}
                    >
                      <Box />
                    </button>
                  );
                })}
              </div>
              <small>{builder.length} blocks placed</small>
            </>
          ) : (
            <>
              <p>
                Rotate, explore and rebuild the solid. Your 3D model will appear
                here.
              </p>
              <button onClick={() => act(() => setBuilding(true))}>
                <Box />
                Start building
              </button>
            </>
          )}
        </article>
        <aside>
          <h3>Instructions</h3>
          {[
            "Analyze all three views carefully.",
            "Note all dimensions and relationships.",
            "Rebuild the solid in this workspace.",
            "Check your model using all views.",
          ].map((item) => (
            <p key={item}>
              <Check />
              {item}
            </p>
          ))}
          <button
            onClick={() =>
              act(() => {
                setBuilding(true);
                setBuilder(targetBlocks);
                setFeedback("idle");
              })
            }
          >
            <Rotate3D />
            Rebuild solid
          </button>
          <button onClick={checkBuilder}>
            <Eye />
            Check answer
          </button>
          {feedback !== "idle" && (
            <strong className={feedback}>
              {feedback === "correct"
                ? "Exact solid rebuilt"
                : "Views do not match yet"}
            </strong>
          )}
        </aside>
      </section>
      <nav className="ortho411-next">
        <a href="/lessons/3d-mathematics/410-camera-controls">
          ←{" "}
          <span>
            Previous<small>Camera Controls</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/412-ar-placement">
          <span>
            Next<small>AR Placement</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function SolidCanvas({
  blocks,
  tool,
  mode,
  selected,
  version,
  onSelect,
  onInteraction,
}: {
  blocks: Block[];
  tool: Tool;
  mode: RenderMode;
  selected: number;
  version: number;
  onSelect: (index: number) => void;
  onInteraction: () => void;
}) {
  return (
    <Canvas camera={{ position: [6, 5, 7], fov: 40 }} shadows>
      <color attach="background" args={["#07182b"]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 8, 7]} intensity={2.4} castShadow />
      <CameraReset version={version} />
      <group position={[-1, -0.5, -0.5]}>
        {blocks.map((block, index) => (
          <mesh
            key={key(block)}
            position={block}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(index);
            }}
            castShadow
          >
            <boxGeometry />
            <meshStandardMaterial
              color={
                selected === index
                  ? "#f4b53d"
                  : mode === "faces"
                    ? "#8eacd1"
                    : "#7899c0"
              }
              transparent={mode !== "shaded"}
              opacity={mode === "edges" ? 0.72 : 0.92}
            />
            {mode !== "faces" && (
              <Edges color={selected === index ? "#ffd35c" : "#d8efff"} />
            )}
          </mesh>
        ))}
      </group>
      <gridHelper args={[10, 10, "#24415d", "#183149"]} />
      <axesHelper args={[4]} />
      <OrbitControls
        enableRotate={tool === "rotate"}
        enablePan={tool === "pan"}
        enableZoom={tool === "zoom" || tool === "rotate"}
        mouseButtons={
          tool === "pan"
            ? { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }
            : { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }
        }
        onStart={onInteraction}
      />
    </Canvas>
  );
}
function CameraReset({ version }: { version: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(6, 5, 7);
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera, version]);
  return null;
}
function MiniSolid({ blocks }: { blocks: Block[] }) {
  return (
    <div className="ortho411-mini">
      <Canvas orthographic camera={{ position: [5, 4, 6], zoom: 20 }}>
        <color attach="background" args={["#f8fbff"]} />
        <ambientLight intensity={2} />
        <directionalLight position={[5, 8, 7]} intensity={2} />
        <group position={[-1, -0.5, -0.5]}>
          {blocks.map((block) => (
            <mesh key={key(block)} position={block}>
              <boxGeometry />
              <meshStandardMaterial color="#88a9ce" />
              <Edges color="#49647f" />
            </mesh>
          ))}
        </group>
        <MiniCamera />
      </Canvas>
    </div>
  );
}
function MiniCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}
function ProjectionCard({
  view,
  blocks,
  hidden,
  rays,
  dimensions,
  selected,
  onSelect,
  size,
}: {
  view: View;
  blocks: Block[];
  hidden: boolean;
  rays: boolean;
  dimensions: boolean;
  selected: number;
  onSelect: (index: number) => void;
  size: ReturnType<typeof measure>;
}) {
  return (
    <section className="ortho411-view-card">
      <h3>{capitalize(view)} view</h3>
      <Projection
        view={view}
        blocks={blocks}
        hidden={hidden}
        selected={selected}
        onSelect={onSelect}
        dimensions={dimensions}
        size={size}
      />
      <aside>
        <h4>View options</h4>
        <label>
          <input type="checkbox" checked={hidden} readOnly />
          Hidden lines
        </label>
        <label>
          <input type="checkbox" checked={rays} readOnly />
          Projection rays
        </label>
        <label>
          <input type="checkbox" checked={dimensions} readOnly />
          Dimensions
        </label>
        <hr />
        <h4>Legend</h4>
        <span className="selected">Selected edge</span>
        <span className="corresponding">Corresponding</span>
        <span className="hidden">Hidden</span>
      </aside>
    </section>
  );
}
function Projection({
  view,
  blocks,
  hidden,
  selected,
  onSelect,
  dimensions = false,
  size,
}: {
  view: View;
  blocks: Block[];
  hidden: boolean;
  selected: number;
  onSelect?: (index: number) => void;
  dimensions?: boolean;
  size?: ReturnType<typeof measure>;
}) {
  const projected = project(blocks, view),
    cols = Math.max(...projected.map((item) => item.a)) + 1,
    rows = Math.max(...projected.map((item) => item.b)) + 1,
    cell = 34,
    ox = 16,
    oy = 12,
    w = cols * cell,
    h = rows * cell;
  return (
    <svg
      className="ortho411-projection"
      viewBox={`0 0 ${w + 65} ${h + 42}`}
      role="img"
      aria-label={`${capitalize(view)} orthographic projection`}
    >
      <defs>
        <pattern
          id={`grid-${view}`}
          width={cell}
          height={cell}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cell} 0 L 0 0 0 ${cell}`}
            fill="none"
            stroke="#dce6ef"
          />
        </pattern>
      </defs>
      <rect x={ox} y={oy} width={w} height={h} fill={`url(#grid-${view})`} />
      {projected.map((item) => (
        <g
          key={`${item.a}-${item.b}`}
          onClick={() => onSelect?.(item.source)}
          className="projection-cell"
        >
          <rect
            x={ox + item.a * cell}
            y={oy + (rows - 1 - item.b) * cell}
            width={cell}
            height={cell}
            fill={item.source === selected ? "#fff4cc" : "#fff"}
            stroke={item.source === selected ? "#f1a400" : "#16213a"}
            strokeWidth={item.source === selected ? 2 : 1.4}
          />
          {hidden && (
            <line
              x1={ox + item.a * cell}
              y1={oy + (rows - 1 - item.b) * cell + cell / 2}
              x2={ox + (item.a + 1) * cell}
              y2={oy + (rows - 1 - item.b) * cell + cell / 2}
              stroke="#617089"
              strokeDasharray="4 3"
            />
          )}
        </g>
      ))}
      {dimensions && size && (
        <>
          <line
            x1={ox}
            y1={oy + h + 12}
            x2={ox + w}
            y2={oy + h + 12}
            stroke="#17213a"
          />
          <text x={ox + w / 2} y={oy + h + 25} textAnchor="middle">
            {view === "right" ? size.depth : size.width}
          </text>
          <line
            x1={ox + w + 12}
            y1={oy}
            x2={ox + w + 12}
            y2={oy + h}
            stroke="#17213a"
          />
          <text x={ox + w + 25} y={oy + h / 2}>
            {view === "top" ? size.depth : size.height}
          </text>
        </>
      )}
    </svg>
  );
}
function ProjectionRays() {
  return (
    <svg
      className="ortho411-rays"
      viewBox="0 0 720 630"
      preserveAspectRatio="none"
    >
      <path d="M318 180L430 110M318 205L430 315M318 235L430 520" />
      <path
        className="blue"
        d="M318 260L430 145M318 285L430 350M318 310L430 555"
      />
    </svg>
  );
}
function FirstAngleIcon() {
  return <span className="angle-icon">◁ □</span>;
}
function ThirdAngleIcon() {
  return <span className="angle-icon">□ ○</span>;
}
function project(blocks: Block[], view: View) {
  const map = new Map<string, { a: number; b: number; source: number }>();
  blocks.forEach((block, index) => {
    const [x, y, z] = block,
      [a, b] = view === "front" ? [x, z] : view === "top" ? [x, y] : [y, z],
      id = `${a}-${b}`;
    if (!map.has(id) || index === 6) map.set(id, { a, b, source: index });
  });
  return [...map.values()];
}
function measure(blocks: Block[], unit: Unit, scale: string) {
  const factor =
    (unit === "cm" ? 0.1 : 1) *
    (scale === "1:2" ? 2 : scale === "2:1" ? 0.5 : 1) *
    20;
  return {
    width: round((Math.max(...blocks.map((b) => b[0])) + 1) * factor),
    height: round((Math.max(...blocks.map((b) => b[2])) + 1) * factor),
    depth: round((Math.max(...blocks.map((b) => b[1])) + 1) * factor),
  };
}
function equalBlocks(a: Block[], b: Block[]) {
  return a.length === b.length && a.every((item) => contains(b, item));
}
function contains(blocks: Block[], block: Block) {
  return blocks.some((item) => key(item) === key(block));
}
function key(block: Block) {
  return block.join(":");
}
function round(value: number) {
  return Number(value.toFixed(2));
}
function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}
