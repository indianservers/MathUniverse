import { Html, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ArrowLeft,
  ArrowRight,
  Hand,
  Link2,
  Maximize,
  Move,
  Rotate3D,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import * as THREE from "three";
import type { LessonAdapterProps } from "../types";
import "./CrossProductTargetLesson191.css";

type Vector3 = { x: number; y: number; z: number };
type DragMode = "rotate" | "pan" | "zoom";
const INITIAL_U = { x: 3, y: 2, z: 1 },
  INITIAL_V = { x: -1, y: 3, z: 2 },
  PRACTICE_U = { x: 1, y: -2, z: 2 },
  PRACTICE_V = { x: 3, y: 1, z: -1 };
const clamp = (n: number) => Math.max(-5, Math.min(5, Math.round(n))),
  scenePoint = (p: Vector3): [number, number, number] => [p.x, p.z, p.y],
  cross = (a: Vector3, b: Vector3) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  mag = (p: Vector3) => Math.hypot(p.x, p.y, p.z),
  unit = (p: Vector3) => {
    const m = mag(p);
    return m ? { x: p.x / m, y: p.y / m, z: p.z / m } : { x: 0, y: 0, z: 0 };
  },
  neg = (p: Vector3) => ({ x: -p.x, y: -p.y, z: -p.z });

function VectorArrow({
  vector,
  color,
  name,
  onVector,
  visualScale = 1,
}: {
  vector: Vector3;
  color: string;
  name: "u" | "v" | "cross";
  onVector?: (p: Vector3) => void;
  visualScale?: number;
}) {
  const arrow = useMemo(
    () =>
      new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(),
        1,
        color,
        0.28,
        0.16,
      ),
    [color],
  );
  useEffect(() => {
    const direction = new THREE.Vector3(...scenePoint(vector)).multiplyScalar(
        visualScale,
      ),
      length = direction.length();
    arrow.setDirection(
      length ? direction.normalize() : new THREE.Vector3(1, 0, 0),
    );
    arrow.setLength(
      Math.max(0.001, length),
      Math.min(0.32, length * 0.22),
      Math.min(0.18, length * 0.12),
    );
  }, [arrow, vector, visualScale]);
  const start = useRef<{ x: number; y: number; vector: Vector3 } | null>(null);
  return (
    <>
      <primitive object={arrow} />
      {name !== "cross" && (
        <Html
          position={[vector.x, vector.y, vector.z]}
          center
          transform={false}
        >
          <button
            data-testid={`cross-${name}-tip`}
            aria-label={`Vector ${name} 3D tip`}
            className={`cp191-tip ${name}`}
            onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              start.current = { x: event.clientX, y: event.clientY, vector };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
              if (!start.current || !event.buttons) return;
              event.stopPropagation();
              const dx = event.clientX - start.current.x,
                dy = event.clientY - start.current.y,
                onZ = event.shiftKey;
              onVector?.(
                onZ
                  ? {
                      ...start.current.vector,
                      z: clamp(start.current.vector.z - dy / 24),
                    }
                  : {
                      ...start.current.vector,
                      x: clamp(start.current.vector.x + dx / 28),
                      y: clamp(start.current.vector.y - dy / 28),
                    },
              );
            }}
            onPointerUp={() => {
              start.current = null;
            }}
          >
            {name}
          </button>
        </Html>
      )}
    </>
  );
}

function AxisArrow({
  end,
  color,
  label,
}: {
  end: [number, number, number];
  color: string;
  label: string;
}) {
  const arrow = useMemo(() => {
    const direction = new THREE.Vector3(...end);
    const length = direction.length();
    return new THREE.ArrowHelper(
      direction.normalize(),
      new THREE.Vector3(),
      length,
      color,
      0.18,
      0.1,
    );
  }, [color, end]);
  return (
    <>
      <primitive object={arrow} />
      <Html position={end} center>
        <span className="cp191-axis-label" style={{ color }}>
          {label}
        </span>
      </Html>
    </>
  );
}

function Parallelogram({ u, v }: { u: Vector3; v: Vector3 }) {
  const points = useMemo(() => {
    const a = scenePoint(u),
      b = scenePoint(v),
      c: [number, number, number] = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    return { a, b, c };
  }, [u, v]);
  const geometry = useMemo(() => {
    const value = new THREE.BufferGeometry();
    value.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [0, 0, 0, ...points.a, ...points.c, 0, 0, 0, ...points.c, ...points.b],
        3,
      ),
    );
    return value;
  }, [points]);
  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#4fc7d7"
          opacity={0.16}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={[[0, 0, 0], points.a, points.c, points.b, [0, 0, 0]]}
        color="#6a8df1"
        lineWidth={1.2}
        dashed
      />
    </>
  );
}

function CrossScene({
  u,
  v,
  result,
  mode,
  parallelogram,
  projection,
  speed,
  viewKey,
  onU,
  onV,
}: {
  u: Vector3;
  v: Vector3;
  result: Vector3;
  mode: DragMode;
  parallelogram: boolean;
  projection: boolean;
  speed: number;
  viewKey: number;
  onU: (p: Vector3) => void;
  onV: (p: Vector3) => void;
}) {
  return (
    <Canvas
      key={viewKey}
      className="cp191-canvas"
      camera={{ position: [7.4, 5.2, 7.4], fov: 43 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1.2} />
      <gridHelper args={[8, 8, "#b8c7cf", "#e0e7eb"]} />
      <AxisArrow end={[4.2, 0, 0]} color="#d91f2b" label="x" />
      <AxisArrow end={[0, 4.2, 0]} color="#2857be" label="z" />
      <AxisArrow end={[0, 0, 4.2]} color="#18853a" label="y" />
      <VectorArrow vector={u} color="#078fac" name="u" onVector={onU} />
      <VectorArrow vector={v} color="#f28b00" name="v" onVector={onV} />
      <VectorArrow
        vector={result}
        color="#8a28e8"
        name="cross"
        visualScale={0.3}
      />
      {parallelogram && <Parallelogram u={u} v={v} />}
      {projection && (
        <Line
          points={[
            scenePoint(v),
            [v.x, 0, v.y],
            [0, 0, 0],
          ]}
          color="#3478db"
          dashed
          lineWidth={1.5}
        />
      )}
      <OrbitControls
        makeDefault
        enableRotate={mode === "rotate"}
        enablePan={mode === "pan"}
        enableZoom={mode === "zoom"}
        target={[0, 0.65, 0]}
        rotateSpeed={speed}
        panSpeed={speed}
        zoomSpeed={speed}
      />
    </Canvas>
  );
}

function Components({
  name,
  value,
  color,
  onValue,
}: {
  name: "u" | "v";
  value: Vector3;
  color: string;
  onValue: (p: Vector3) => void;
}) {
  return (
    <article
      className="cp191-components"
      style={{ "--tone": color } as CSSProperties}
    >
      <h3>● Vector {name}</h3>
      {(["x", "y", "z"] as const).map((axis) => (
        <label key={axis}>
          <b>
            {name}
            <sub>{axis}</sub>
          </b>
          <span>-5</span>
          <input
            aria-label={`${name} ${axis} component`}
            type="range"
            min="-5"
            max="5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: +event.target.value })
            }
          />
          <span>5</span>
          <input
            aria-label={`${name} ${axis} value`}
            type="number"
            min="-5"
            max="5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: clamp(+event.target.value) })
            }
          />
        </label>
      ))}
      <footer>
        {name} = 〈{value.x}, {value.y}, {value.z}〉
      </footer>
    </article>
  );
}

export default function CrossProductTargetLesson191({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [u, setU] = useState(INITIAL_U),
    [v, setV] = useState(INITIAL_V),
    [orientation, setOrientation] = useState<"uv" | "vu">("uv"),
    [mode, setMode] = useState<DragMode>("rotate"),
    [parallelogram, setParallelogram] = useState(true),
    [projection, setProjection] = useState(false),
    [speed, setSpeed] = useState(1),
    [viewKey, setViewKey] = useState(0),
    [expanded, setExpanded] = useState(false),
    [stage, setStage] = useState(0),
    [answers, setAnswers] = useState({ x: "", y: "", z: "" }),
    [feedback, setFeedback] = useState("");
  const uv = cross(u, v),
    result = orientation === "uv" ? uv : neg(uv),
    normal = unit(result),
    practice = cross(PRACTICE_U, PRACTICE_V),
    correct =
      answers.x !== "" &&
      Number(answers.x) === practice.x &&
      Number(answers.y) === practice.y &&
      Number(answers.z) === practice.z,
    interact = () => onInteraction();
  useEffect(() => {
    setU(INITIAL_U);
    setV(INITIAL_V);
    setOrientation("uv");
    setMode("rotate");
    setParallelogram(true);
    setProjection(false);
    setSpeed(1);
    setViewKey((k) => k + 1);
    setExpanded(false);
    setStage(0);
    setAnswers({ x: "", y: "", z: "" });
    setFeedback("");
  }, [resetToken]);
  return (
    <main
      className="cp191-page"
      data-testid="vector-mockup-0248"
      data-dedicated-lesson="191"
      data-object-model="three-dimensional-cross-product-oriented-area-normal-determinant-practice"
      data-u={`${u.x}:${u.y}:${u.z}`}
      data-v={`${v.x}:${v.y}:${v.z}`}
      data-cross={`${result.x}:${result.y}:${result.z}`}
      data-magnitude={mag(result).toFixed(4)}
      data-normal={`${normal.x.toFixed(3)}:${normal.y.toFixed(3)}:${normal.z.toFixed(3)}`}
      data-orientation={orientation}
      data-mode={mode}
      data-parallelogram={parallelogram}
      data-projection={projection}
      data-speed={speed}
      data-view={viewKey}
      data-expanded={expanded}
      data-stage={stage}
      data-answers={`${answers.x}:${answers.y}:${answers.z}`}
      data-correct={correct}
      data-feedback={feedback}
    >
      <header className="cp191-header">
        <div>
          <span>VECTORS</span>
          <span>GEOMETRY</span>
          <h1>Cross Product ☆</h1>
          <p>Find perpendicular direction and oriented area.</p>
          <section>
            <b>♙ Level: Intermediate-Advanced</b>
            <b>ϟ Focus: 3D vectors</b>
            <b>◷ Est. time: 6-10 min</b>
            <b>◉ Language: English (EN)</b>
          </section>
        </div>
        <a href="/workspace/geometry">
          <Link2 />
          Lesson tools
        </a>
        <nav>
          {[
            ["Observe", "Explore the model"],
            ["Manipulate", "Change & see"],
            ["Pattern", "Notice relationships"],
            ["Rule", "Understand the math"],
            ["Practice", "Try on your own"],
          ].map(([name, sub], index) => (
            <button
              key={name}
              className={stage === index ? "active" : ""}
              onClick={() => {
                setStage(index);
                document
                  .getElementById(
                    index === 4 ? "cp191-practice" : "cp191-model",
                  )
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                interact();
              }}
            >
              <i>{index + 1}</i>
              <b>{name}</b>
              <small>{sub}</small>
            </button>
          ))}
        </nav>
      </header>
      <section className="cp191-main" id="cp191-model">
        <article className="cp191-explorer">
          <header>
            <h2>3D Vector Explorer</h2>
            <nav>
              {(["rotate", "pan", "zoom"] as const).map((name) => (
                <button
                  key={name}
                  className={mode === name ? "active" : ""}
                  onClick={() => {
                    setMode(name);
                    interact();
                  }}
                >
                  {name === "rotate" ? (
                    <Rotate3D />
                  ) : name === "pan" ? (
                    <Move />
                  ) : (
                    <ZoomIn />
                  )}
                  {name[0].toUpperCase() + name.slice(1)}
                </button>
              ))}
              <button
                aria-label="Reset camera"
                onClick={() => {
                  setViewKey((k) => k + 1);
                  interact();
                }}
              >
                <RotateCcw />
              </button>
            </nav>
          </header>
          <div className={`cp191-scene${expanded ? " expanded" : ""}`}>
            <CrossScene
              u={u}
              v={v}
              result={result}
              mode={mode}
              parallelogram={parallelogram}
              projection={projection}
              speed={speed}
              viewKey={viewKey}
              onU={(p) => {
                setU(p);
                interact();
              }}
              onV={(p) => {
                setV(p);
                interact();
              }}
            />
            <aside>
              <b>Top</b>
              <span>Front</span>
              <span>Right</span>
            </aside>
            <button
              className="cp191-expand"
              aria-label={
                expanded ? "Exit expanded 3D explorer" : "Expand 3D explorer"
              }
              onClick={() => {
                setExpanded((value) => !value);
                interact();
              }}
            >
              <Maximize />
            </button>
          </div>
          <section>
            <article>
              <h3>Orientation (right-hand rule)</h3>
              <button
                className={orientation === "uv" ? "active" : ""}
                onClick={() => {
                  setOrientation("uv");
                  interact();
                }}
              >
                u × v
              </button>
              <button
                className={orientation === "vu" ? "active" : ""}
                onClick={() => {
                  setOrientation("vu");
                  interact();
                }}
              >
                v × u
              </button>
            </article>
            <article>
              <h3>Show</h3>
              <label>
                <input
                  aria-label="Show parallelogram"
                  type="checkbox"
                  checked={parallelogram}
                  onChange={() => {
                    setParallelogram((x) => !x);
                    interact();
                  }}
                />
                Parallelogram
              </label>
              <label>
                <input
                  aria-label="Show projection"
                  type="checkbox"
                  checked={projection}
                  onChange={() => {
                    setProjection((x) => !x);
                    interact();
                  }}
                />
                Projection
              </label>
            </article>
            <article>
              <h3>Speed</h3>
              <input
                aria-label="Rotation speed"
                type="range"
                min=".2"
                max="3"
                step=".2"
                value={speed}
                onChange={(event) => {
                  setSpeed(+event.target.value);
                  interact();
                }}
              />
            </article>
          </section>
          <footer>
            Drag vectors by their tips. Hold Shift while dragging to change z.
            <button
              onClick={() => {
                setViewKey((k) => k + 1);
                interact();
              }}
            >
              <RotateCcw />
              Reset view
            </button>
          </footer>
        </article>
        <aside className="cp191-rail">
          <Components
            name="u"
            value={u}
            color="#078fac"
            onValue={(p) => {
              setU(p);
              interact();
            }}
          />
          <Components
            name="v"
            value={v}
            color="#f28b00"
            onValue={(p) => {
              setV(p);
              interact();
            }}
          />
          <article className="cp191-results">
            <h3>● Results</h3>
            <output>
              {orientation === "uv" ? "u × v" : "v × u"} = 〈{result.x},{" "}
              {result.y}, {result.z}〉
            </output>
            <p>
              |u × v| = <b>{mag(result).toFixed(4)}</b>
            </p>
            <p>Area of parallelogram = |u × v|</p>
            <p>
              Unit normal = ({normal.x.toFixed(3)}, {normal.y.toFixed(3)},{" "}
              {normal.z.toFixed(3)})
            </p>
          </article>
        </aside>
      </section>
      <section className="cp191-middle">
        <article>
          <h2>Components & Determinant</h2>
          <output>
            &nbsp; i &nbsp; j &nbsp; k<br />| {u.x} &nbsp; {u.y} &nbsp; {u.z} |
            <br />| {v.x} &nbsp; {v.y} &nbsp; {v.z} |<br />
            <b>
              = 〈{uv.x}, {uv.y}, {uv.z}〉
            </b>
          </output>
        </article>
        <article>
          <h2>Right-Hand Rule</h2>
          <section>
            <Hand />
            <b>
              Point fingers along u, curl toward v. Thumb gives direction of u ×
              v.
            </b>
          </section>
        </article>
        <article>
          <h2>What's happening?</h2>
          <p>✓ u and v define a parallelogram.</p>
          <p>✓ Its area is |u × v|.</p>
          <p>✓ u × v is perpendicular to both u and v.</p>
          <p>✓ Direction follows the right-hand rule.</p>
        </article>
      </section>
      <section className="cp191-lower">
        <article>
          <h2>Key Formula</h2>
          <output>
            u × v = 〈uᵧv_z-u_zvᵧ,
            <br />
            u_zvₓ-uₓv_z,
            <br />
            uₓvᵧ-uᵧvₓ〉
          </output>
          <p>Anti-commutative: v × u = -(u × v)</p>
          <p>Distributive: u × (v+w) = u×v + u×w</p>
        </article>
        <article>
          <h2>Worked Example</h2>
          <p>Let u = 〈2,1,-1〉 and v = 〈0,2,3〉.</p>
          <output>u × v = 〈5,-6,4〉</output>
          <p>|u × v| = √77 ≈ 8.775</p>
        </article>
        <article id="cp191-practice">
          <h2>Your Turn</h2>
          <p>Compute u × v.</p>
          <p>u=〈1,-2,2〉 &nbsp; v=〈3,1,-1〉</p>
          <div>
            {(["x", "y", "z"] as const).map((axis, index) => (
              <label key={axis}>
                {["i", "j", "k"][index]}
                <input
                  aria-label={`Practice cross ${axis}`}
                  type="number"
                  value={answers[axis]}
                  onChange={(event) => {
                    setAnswers({ ...answers, [axis]: event.target.value });
                    setFeedback("");
                    interact();
                  }}
                />
              </label>
            ))}
          </div>
          <footer>
            <button
              onClick={() => {
                setFeedback(
                  correct
                    ? "Correct: u × v = (0,7,7)."
                    : "Not yet. Expand the determinant carefully.",
                );
                interact();
              }}
            >
              Check
            </button>
            <button
              onClick={() => {
                setAnswers({
                  x: String(practice.x),
                  y: String(practice.y),
                  z: String(practice.z),
                });
                setFeedback("Answer shown.");
                interact();
              }}
            >
              Show answer
            </button>
          </footer>
          <strong>{feedback}</strong>
        </article>
      </section>
      <nav className="cp191-nav">
        <a href="/lessons/geometry/190-dot-product">
          <ArrowLeft />
          Previous &nbsp; Dot Product
        </a>
        <a href="/lessons/geometry/192-vector-projection">
          Vector Projection &nbsp; Next
          <ArrowRight />
        </a>
      </nav>
      <footer className="cp191-footer">
        <b>Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </main>
  );
}
