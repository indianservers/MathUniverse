import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Check,
  CheckCircle2,
  Play,
  RotateCcw,
  Share2,
  Shuffle,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, ExtrudeGeometry, Shape } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./NetsSolidsTargetLesson404.css";

type Solid = "cube" | "prism" | "pyramid";
type Face = { id: string; x: number; y: number; color: string };
type FaceTransform = { dx: number; dy: number; rotation: number };

const colors = [
  "#8b4de8",
  "#ff8b47",
  "#347de0",
  "#58c87a",
  "#f7c22b",
  "#25bbc8",
];
const cubeFaceColors = [
  "#8b4de8",
  "#58c87a",
  "#ff8b47",
  "#347de0",
  "#f7c22b",
  "#25bbc8",
];
const cubeNets: Array<Array<[number, number]>> = [
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
    [1, 3],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [1, 3],
  ],
  [
    [1, 0],
    [1, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [1, 3],
  ],
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 2],
    [2, 3],
  ],
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [2, 2],
  ],
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
  [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [2, 2],
  ],
];
const challengeNets = [
  { id: "A", valid: true, coords: cubeNets[0] },
  {
    id: "B",
    valid: false,
    coords: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
    ] as Array<[number, number]>,
  },
  { id: "C", valid: true, coords: cubeNets[7] },
  {
    id: "D",
    valid: true,
    coords: [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
    ] as Array<[number, number]>,
  },
  {
    id: "E",
    valid: false,
    coords: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
    ] as Array<[number, number]>,
  },
  { id: "F", valid: true, coords: cubeNets[2] },
];

export default function NetsSolidsTargetLesson404({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [solid, setSolid] = useState<Solid>("cube"),
    [fold, setFold] = useState(100),
    [gallery, setGallery] = useState(0);
  const [tabs, setTabs] = useState(true),
    [playing, setPlaying] = useState(false),
    [selected, setSelected] = useState<string[]>(["A", "C"]);
  const [checked, setChecked] = useState(true),
    [submitted, setSubmitted] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const [faceTransforms, setFaceTransforms] = useState<
    Record<string, FaceTransform>
  >({});
  const faceCount = solid === "cube" ? 6 : solid === "prism" ? 5 : 5,
    surfaceArea = solid === "cube" ? 6 : solid === "prism" ? 8 : 9;
  const valid = Object.values(faceTransforms).every(
    (item) => Math.hypot(item.dx, item.dy) < 18,
  );
  const correct =
    checked &&
    challengeNets.every((item) => selected.includes(item.id) === item.valid);
  const faces = useMemo(() => facesFor(solid, gallery), [solid, gallery]);
  const act = (fn: () => void) => {
    fn();
    setChecked(false);
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setSolid("cube");
    setFold(100);
    setGallery(0);
    setTabs(true);
    setPlaying(false);
    setSelected(["A", "C"]);
    setChecked(true);
    setSubmitted(false);
    setShared(false);
    setFaceTransforms({});
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setFold((value) => {
          if (value >= 100) {
            setPlaying(false);
            return 100;
          }
          return Math.min(100, value + 4);
        }),
      45,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const chooseSolid = (next: Solid) =>
    act(() => {
      setSolid(next);
      setFold(100);
      setFaceTransforms({});
    });
  const toggleAnswer = (id: string) =>
    act(() =>
      setSelected((items) =>
        items.includes(id)
          ? items.filter((item) => item !== id)
          : [...items, id],
      ),
    );
  return (
    <section
      className="cs378-page net404-page"
      data-testid="geometry3d-mockup-0589"
      data-object-model="threejs-dedicated-foldable-solid-net-linked-faces-hinges-tabs-gallery-validity-challenge"
      data-direct-interaction="true"
      data-solid={solid}
      data-fold={fold}
      data-gallery={gallery}
      data-tabs={tabs}
      data-valid={valid}
      data-face-count={faceCount}
      data-surface-area={surfaceArea}
      data-selected={selected.join(",")}
      data-checked={checked}
      data-submitted={submitted}
      data-correct={correct}
      data-playing={playing}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="net404-hero">
        <div>
          <h1>Nets of Solids</h1>
          <p>Build, fold, and explore 3D solids from 2D nets.</p>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <nav>
            <span>Beginner⌄</span>
            <span>3D Lab</span>
            <span>Calculator</span>
            <span>6-10 min</span>
          </nav>
        </div>
        <button
          onClick={() =>
            act(() => {
              setShared(true);
              void navigator.clipboard?.writeText(
                `${solid} net, ${fold}% folded`,
              );
            })
          }
        >
          <Share2 size={14} />
          {shared ? "Shared" : "Share"}
        </button>
      </header>
      <section className="net404-picker">
        <h2>Choose a solid</h2>
        <div>
          <SolidChoice
            type="cube"
            active={solid === "cube"}
            onClick={() => chooseSolid("cube")}
          />
          <SolidChoice
            type="prism"
            active={solid === "prism"}
            onClick={() => chooseSolid("prism")}
          />
          <SolidChoice
            type="pyramid"
            active={solid === "pyramid"}
            onClick={() => chooseSolid("pyramid")}
          />
        </div>
      </section>
      <section className="net404-builder">
        <article>
          <header>
            <h2>Build the net</h2>
            <p>Drag faces to move. Click a face to rotate.</p>
          </header>
          <nav className="net404-legend">
            <span>--- &nbsp; Hinge edge</span>
            <span>□ &nbsp; Face match</span>
            <label>
              Edge tabs{" "}
              <input
                aria-label="Edge tabs"
                type="checkbox"
                checked={tabs}
                onChange={() => act(() => setTabs((v) => !v))}
              />
            </label>
          </nav>
          <NetDrawing
            faces={faces}
            tabs={tabs}
            transforms={faceTransforms}
            onTransform={(id, next) =>
              act(() =>
                setFaceTransforms((items) => ({ ...items, [id]: next })),
              )
            }
          />
          <footer>
            <span className={valid ? "" : "invalid"}>
              {valid ? <CheckCircle2 size={14} /> : <X size={14} />}
              {valid ? "Valid net" : "Invalid net"}
            </span>
            <span>
              {valid ? <Check size={14} /> : <X size={14} />}
              {valid ? "Connected" : "Disconnected"}
            </span>
            <span>
              <Check size={14} /> No overlaps
            </span>
            <strong>
              Surface area
              <b>
                {faceCount} × (1 × 1) = {surfaceArea} sq. units
              </b>
            </strong>
          </footer>
        </article>
        <article>
          <header>
            <div>
              <h2>Fold the net</h2>
              <p>Use the slider or animate to form the 3D solid.</p>
            </div>
            <nav>
              <button
                onClick={() =>
                  act(() => {
                    setFold(0);
                    setPlaying(true);
                  })
                }
              >
                <Play size={14} />
                Animate
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setFold(100);
                    setPlaying(false);
                  })
                }
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </nav>
          </header>
          <div className="net404-scene" aria-label="Drag solid to rotate">
            <Canvas
              key={solid}
              data-testid="geometry3d-nets-canvas"
              camera={{ position: [5, 4.5, 6], fov: 39 }}
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <color attach="background" args={["#17214b"]} />
              <ambientLight intensity={1.7} />
              <directionalLight position={[5, 8, 6]} intensity={2.6} />
              <FoldedSolid solid={solid} fold={fold} />
              <OrbitControls makeDefault enableZoom enablePan />
            </Canvas>
            <label>
              <span>Unfold</span>
              <input
                aria-label="Fold net"
                type="range"
                min="0"
                max="100"
                value={fold}
                onChange={(event) =>
                  act(() => setFold(Number(event.target.value)))
                }
              />
              <span>Fold net</span>
              <output>{fold}%</output>
            </label>
          </div>
          <footer>
            <div>
              <b>
                Face match ({faceCount}/{faceCount})
              </b>
              <p>
                {colors.slice(0, faceCount).map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </p>
            </div>
            <span className={valid ? "" : "invalid"}>
              {valid ? <CheckCircle2 size={16} /> : <X size={16} />}
              {valid ? "Valid net" : "Invalid net"}
            </span>
          </footer>
        </article>
      </section>
      <section className="net404-middle">
        <article>
          <h2>Cube net gallery</h2>
          <p>Click a net to load it in the builder.</p>
          <div className="net404-gallery">
            {cubeNets.map((coords, index) => (
              <button
                key={index}
                aria-label={`Load cube net ${index + 1}`}
                className={gallery === index ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setSolid("cube");
                    setGallery(index);
                    setFold(0);
                    setFaceTransforms({});
                  })
                }
              >
                <MiniNet coords={coords} />
              </button>
            ))}
          </div>
          <button
            className="net404-random"
            onClick={() =>
              act(() => {
                const next = (gallery + 3) % cubeNets.length;
                setGallery(next);
                setSolid("cube");
                setFold(0);
                setFaceTransforms({});
              })
            }
          >
            <Shuffle size={14} />
            Load random net
          </button>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Standard cross net</p>
          <div className="net404-example">
            <MiniNet coords={cubeNets[0]} />
            <b>»</b>
            <FoldedPreview />
          </div>
          <strong>Surface area = 6 sq. units</strong>
          <p>This net folds to form a cube with all square faces equal.</p>
        </article>
      </section>
      <section className="net404-challenge">
        <header>
          <div>
            <h2>Challenge: Which net folds into a cube?</h2>
            <p>Select all the nets that are valid for a cube.</p>
          </div>
          <span>
            {
              selected.filter(
                (id) => challengeNets.find((item) => item.id === id)?.valid,
              ).length
            }
            /4 correct
          </span>
          <button
            onClick={() => {
              setChecked(true);
              setSubmitted(true);
              onInteraction();
            }}
          >
            Check answers
          </button>
        </header>
        <div>
          {challengeNets.map((item) => (
            <button
              key={item.id}
              className={`${selected.includes(item.id) ? "selected" : ""} ${checked ? (item.valid ? "valid" : "invalid") : ""}`}
              onClick={() => toggleAnswer(item.id)}
            >
              <b>{item.id}</b>
              {checked &&
                (item.valid ? <CheckCircle2 size={17} /> : <X size={17} />)}
              <MiniNet coords={item.coords} />
              {checked && !item.valid && (
                <small>
                  {item.id === "B" ? "Overlap detected" : "Disconnected faces"}
                </small>
              )}
            </button>
          ))}
        </div>
        {submitted && (
          <strong className={correct ? "correct" : "wrong"}>
            {correct
              ? "All four valid cube nets selected."
              : "Review connected faces and overlaps."}
          </strong>
        )}
        <footer>
          Tip: A cube net must have 6 connected squares and no overlaps when
          folded.
        </footer>
      </section>
      <nav className="net404-next">
        <a href="/lessons/3d-mathematics/403-extrusion">
          ←{" "}
          <span>
            PREVIOUS<small>Extrusion</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/405-cross-sections">
          <span>
            NEXT<small>Cross-Sections</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function SolidChoice({
  type,
  active,
  onClick,
}: {
  type: Solid;
  active: boolean;
  onClick: () => void;
}) {
  const label =
    type === "cube"
      ? "Cube"
      : type === "prism"
        ? "Triangular Prism"
        : "Square Pyramid";
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {active && <CheckCircle2 size={17} />}
      <span className={`net404-choice-icon ${type}`}>
        {type === "cube" ? "◇" : type === "prism" ? "△" : "⌂"}
      </span>
      <b>{label}</b>
    </button>
  );
}
function facesFor(solid: Solid, gallery: number): Face[] {
  if (solid === "cube")
    return cubeNets[gallery].map(([x, y], index) => ({
      id: String(index),
      x,
      y,
      color: cubeFaceColors[index],
    }));
  if (solid === "prism")
    return [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 0],
      [1, 2],
    ].map(([x, y], index) => ({
      id: String(index),
      x,
      y,
      color: colors[index],
    }));
  return [
    [1, 1],
    [0, 1],
    [2, 1],
    [1, 0],
    [1, 2],
  ].map(([x, y], index) => ({ id: String(index), x, y, color: colors[index] }));
}
function NetDrawing({
  faces,
  tabs,
  transforms,
  onTransform,
}: {
  faces: Face[];
  tabs: boolean;
  transforms: Record<string, FaceTransform>;
  onTransform: (id: string, next: FaceTransform) => void;
}) {
  const [drag, setDrag] = useState<{
    id: string;
    x: number;
    y: number;
    origin: FaceTransform;
    moved: boolean;
  } | null>(null);
  const minX = Math.min(...faces.map((f) => f.x)),
    maxX = Math.max(...faces.map((f) => f.x)),
    minY = Math.min(...faces.map((f) => f.y));
  return (
    <svg
      className="net404-net"
      viewBox="0 0 330 390"
      role="img"
      aria-label="Connected colored solid net"
    >
      {faces.map((face) => {
        const x = 45 + (face.x - (minX + maxX) / 2) * 82 + 70,
          y = 20 + (face.y - minY) * 82,
          current = transforms[face.id] ?? { dx: 0, dy: 0, rotation: 0 };
        return (
          <g
            key={face.id}
            aria-label={`Drag face ${Number(face.id) + 1}`}
            role="button"
            tabIndex={0}
            transform={`translate(${current.dx} ${current.dy}) rotate(${current.rotation} ${x + 40} ${y + 40})`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({
                id: face.id,
                x: event.clientX,
                y: event.clientY,
                origin: current,
                moved: false,
              });
            }}
            onPointerMove={(event) => {
              if (!drag || drag.id !== face.id) return;
              const dx = event.clientX - drag.x,
                dy = event.clientY - drag.y;
              setDrag({
                ...drag,
                moved: drag.moved || Math.hypot(dx, dy) > 3,
              });
              onTransform(face.id, {
                ...current,
                dx: drag.origin.dx + dx,
                dy: drag.origin.dy + dy,
              });
            }}
            onPointerUp={() => {
              if (drag && !drag.moved)
                onTransform(face.id, {
                  ...current,
                  rotation: (current.rotation + 90) % 360,
                });
              setDrag(null);
            }}
          >
            <rect
              x={x}
              y={y}
              width="80"
              height="80"
              rx="2"
              fill={face.color}
              stroke="#31426a"
              strokeWidth="2"
            />
            {tabs && (
              <path
                d={`M${x + 12} ${y}l8-10h40l8 10M${x + 80} ${y + 12}l10 8v40l-10 8`}
                fill="#fff"
                stroke="#c5cedb"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
function MiniNet({ coords }: { coords: Array<[number, number]> }) {
  return (
    <svg viewBox="0 0 80 70">
      {coords.map(([x, y], i) => (
        <rect
          key={i}
          x={8 + x * 15}
          y={4 + y * 15}
          width="15"
          height="15"
          fill="#f9fbff"
          stroke="#3978da"
        />
      ))}
    </svg>
  );
}
function FoldedPreview() {
  return (
    <div className="net404-preview-cube">
      <i />
      <i />
      <i />
    </div>
  );
}
function FoldedSolid({ solid, fold }: { solid: Solid; fold: number }) {
  const t = fold / 100;
  if (solid === "cube")
    return (
      <group rotation={[-0.25, 0.55, 0]} scale={1.22} position={[0, 0.22, 0]}>
        {[
          { p: [0, 0, 1], r: [0, 0, 0], c: colors[1] },
          { p: [0, 0, -1], r: [0, Math.PI, 0], c: colors[5] },
          { p: [-1, 0, 0], r: [0, -Math.PI / 2, 0], c: colors[3] },
          { p: [1, 0, 0], r: [0, Math.PI / 2, 0], c: colors[2] },
          { p: [0, 1, 0], r: [-Math.PI / 2, 0, 0], c: colors[0] },
          { p: [0, -1, 0], r: [Math.PI / 2, 0, 0], c: colors[4] },
        ].map((face, index) => {
          const flat = [(index - 2.5) * 1.25, 0, 0];
          const p = face.p.map((v, i) => flat[i] * (1 - t) + v * t) as [
            number,
            number,
            number,
          ];
          const r = face.r.map((v) => v * t) as [number, number, number];
          return (
            <mesh key={index} position={p} rotation={r}>
              <planeGeometry args={[2, 2]} />
              <meshStandardMaterial
                color={face.c}
                side={DoubleSide}
                transparent
                opacity={index === 0 ? 0.14 : 0.94}
                depthWrite={index !== 0}
              />
              <Edges color="#dfffdc" />
            </mesh>
          );
        })}
      </group>
    );
  if (solid === "pyramid")
    return (
      <mesh scale={[1, 0.7 + 0.3 * t, 1]} rotation={[0, 0.6, 0]}>
        <coneGeometry args={[2, 2.8, 4]} />
        <meshStandardMaterial color="#f18945" />
        <Edges color="#763d20" />
      </mesh>
    );
  const shape = new Shape();
  shape.moveTo(-1, -1);
  shape.lineTo(1, -1);
  shape.lineTo(0, 1);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 2.5,
    bevelEnabled: false,
  });
  return (
    <mesh
      geometry={geometry}
      position={[0, 0, -1.25]}
      rotation={[-0.1, 0.55, 0]}
      scale={[1, 0.7 + 0.3 * t, 1]}
    >
      <meshStandardMaterial color="#7450cb" />
      <Edges color="#38236d" />
    </mesh>
  );
}
