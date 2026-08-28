import {
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./CoordinateTransformationsTargetLesson179.css";
type Point = { x: number; y: number };
type Kind =
  "translation" | "reflectX" | "reflectY" | "rotate90" | "rotate180" | "scale";
const INITIAL = [
    { x: -3, y: 4 },
    { x: 1, y: 4 },
    { x: -1, y: 1 },
  ],
  names = ["A", "B", "C"];
const fmt = (v: number) =>
  Math.abs(v - Math.round(v)) < 0.005 ? String(Math.round(v)) : v.toFixed(1);
const mapPoint = (p: Point, kind: Kind, a: number, b: number): Point =>
  kind === "translation"
    ? { x: p.x + a, y: p.y + b }
    : kind === "reflectX"
      ? { x: p.x, y: -p.y }
      : kind === "reflectY"
        ? { x: -p.x, y: p.y }
        : kind === "rotate90"
          ? { x: -p.y, y: p.x }
          : kind === "rotate180"
            ? { x: -p.x, y: -p.y }
            : { x: p.x * a, y: p.y * a };
const rule = (kind: Kind, a: number, b: number) =>
  kind === "translation"
    ? `(x, y) → (x + ${fmt(a)}, y ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))})`
    : kind === "reflectX"
      ? "(x, y) → (x, −y)"
      : kind === "reflectY"
        ? "(x, y) → (−x, y)"
        : kind === "rotate90"
          ? "(x, y) → (−y, x)"
          : kind === "rotate180"
            ? "(x, y) → (−x, −y)"
            : `(x, y) → (${fmt(a)}x, ${fmt(a)}y)`;
function Graph({
  points,
  images,
  showVectors,
  snap,
  tool,
  onMove,
  onPoint,
}: {
  points: Point[];
  images: Point[];
  showVectors: boolean;
  snap: boolean;
  tool: string;
  onMove: (dx: number, dy: number) => void;
  onPoint: (index: number, point: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<{ point: Point; index: number } | null>(null),
    W = 560,
    H = 420,
    u = 28,
    ox = 280,
    oy = 210,
    sx = (x: number) => ox + x * u,
    sy = (y: number) => oy - y * u,
    poly = (ps: Point[]) => ps.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ");
  const from = (e: PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect();
    return {
      x: (((e.clientX - r.left) / r.width) * W - ox) / u,
      y: (oy - ((e.clientY - r.top) / r.height) * H) / u,
    };
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    const d: { [k: string]: Point } = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    if (d[e.key]) {
      e.preventDefault();
      onMove(d[e.key].x, d[e.key].y);
    }
  };
  return (
    <svg
      ref={ref}
      className="ct179-graph"
      viewBox={`0 0 ${W} ${H}`}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const p = from(e);
        const step = snap ? 1 : 0.25;
        if (tool === "shape") {
          onPoint(drag.current.index, {
            x: Math.round(p.x / step) * step,
            y: Math.round(p.y / step) * step,
          });
        } else {
          onMove(
            Math.round((p.x - drag.current.point.x) / step) * step,
            Math.round((p.y - drag.current.point.y) / step) * step,
          );
        }
        drag.current = { point: p, index: drag.current.index };
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <defs>
        <pattern
          id="ct179-grid"
          width={u}
          height={u}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${u} 0H0V${u}`} fill="none" stroke="#dce7f0" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#ct179-grid)" />
      <line x1="0" x2={W} y1={oy} y2={oy} />
      <line x1={ox} x2={ox} y1="0" y2={H} />
      <polygon points={poly(points)} className="ct179-original" />
      <polygon points={poly(images)} className="ct179-image" />
      {points.map((p, i) => (
        <g key={names[i]}>
          {showVectors ? (
            <line
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(images[i].x)}
              y2={sy(images[i].y)}
              className="ct179-vector"
            />
          ) : null}
          <circle
            data-testid={i === 0 ? "transform-source-handle" : undefined}
            role={i === 0 ? "slider" : undefined}
            aria-label={i === 0 ? "Drag source triangle" : undefined}
            tabIndex={i === 0 ? 0 : undefined}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r="6"
            className="ct179-dot"
            onPointerDown={(e) => {
              drag.current = { point: from(e), index: i };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onKeyDown={i === 0 ? key : undefined}
          />
          <circle
            cx={sx(images[i].x)}
            cy={sy(images[i].y)}
            r="6"
            className="ct179-image-dot"
          />
          <text x={sx(p.x) - 15} y={sy(p.y) - 10}>
            {names[i]}
          </text>
          <text x={sx(images[i].x) + 8} y={sy(images[i].y) - 8}>
            {names[i]}′
          </text>
        </g>
      ))}
    </svg>
  );
}
export default function CoordinateTransformationsTargetLesson179({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(INITIAL),
    [kind, setKind] = useState<Kind>("translation"),
    [a, setA] = useState(3),
    [b, setB] = useState(-2),
    [stage, setStage] = useState(0),
    [tool, setTool] = useState("select"),
    [snap, setSnap] = useState(false),
    [vectors, setVectors] = useState(true),
    [playing, setPlaying] = useState(false),
    [animation, setAnimation] = useState(1),
    [answers, setAnswers] = useState(["", "", "", "", "", ""]),
    [status, setStatus] = useState("");
  const images = points.map((p) => mapPoint(p, kind, a, b)),
    displayedImages = images.map((image, index) => ({
      x: points[index].x + (image.x - points[index].x) * animation,
      y: points[index].y + (image.y - points[index].y) * animation,
    })),
    currentRule = rule(kind, a, b);
  const move = (dx: number, dy: number) => {
    if (!dx && !dy) return;
    setPoints((ps) => ps.map((p) => ({ x: p.x + dx, y: p.y + dy })));
    onInteraction();
  };
  const movePoint = (index: number, point: Point) => {
    setPoints((current) =>
      current.map((value, i) => (i === index ? point : value)),
    );
    onInteraction();
  };
  const reset = () => {
    setPoints(INITIAL);
    setKind("translation");
    setA(3);
    setB(-2);
    setStage(0);
    setTool("select");
    setSnap(false);
    setVectors(true);
    setPlaying(false);
    setAnimation(1);
    setAnswers(["", "", "", "", "", ""]);
    setStatus("");
    onInteraction();
  };
  useEffect(() => {
    setPoints(INITIAL);
    setKind("translation");
    setA(3);
    setB(-2);
    setStage(0);
    setTool("select");
    setSnap(false);
    setVectors(true);
    setPlaying(false);
    setAnimation(1);
    setAnswers(["", "", "", "", "", ""]);
    setStatus("");
  }, [resetToken]);
  useEffect(() => {
    if (!playing) {
      setAnimation(1);
      return;
    }
    setAnimation(0);
    const timer = window.setInterval(() => {
      setAnimation((value) => (value >= 1 ? 0 : Math.min(1, value + 0.05)));
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing]);
  const practice = [-1, 1, 2, 4, 0, -1],
    correct = answers.every((v, i) => Number(v) === practice[i]);
  return (
    <main
      className="ct179-page"
      data-testid="geometry-mockup-0236"
      data-dedicated-lesson="179"
      data-object-model="draggable-polygon-coordinate-transformation-rule-engine"
      data-kind={kind}
      data-vector={`${a}:${b}`}
      data-source={points.map((p) => `${p.x}:${p.y}`).join("|")}
      data-image={images.map((p) => `${p.x}:${p.y}`).join("|")}
      data-rule={currentRule}
      data-stage={stage}
      data-animation={animation.toFixed(2)}
      data-vectors={vectors}
      data-snap={snap}
      data-tool={tool}
      data-status={status}
    >
      <header className="ct179-header">
        <span>COORDINATE GEOMETRY</span>
        <h1>Coordinate Transformations</h1>
        <p>
          Map points algebraically. Observe → Manipulate → Notice → Understand →
          Try.
        </p>
        <section>
          <b>♙ Intermediate</b>
          <b>⌁ Construction Lab</b>
          <b>▣ Geometry / Graphing View</b>
          <b>◷ 6-10 min</b>
        </section>
        <footer>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(currentRule);
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              setStage(1);
              onInteraction();
            }}
          >
            ↗ Workspace
          </button>
        </footer>
      </header>
      <nav className="ct179-stages">
        {[
          ["Observe", "See the transformation"],
          ["Manipulate", "Drag and adjust"],
          ["Notice", "Find the pattern"],
          ["Understand", "Learn the rule"],
          ["Try", "Practice independently"],
        ].map(([x, y], i) => (
          <button
            className={stage === i ? "active" : ""}
            onClick={() => {
              setStage(i);
              onInteraction();
            }}
            key={x}
          >
            <i>{i + 1}</i>
            <b>{x}</b>
            <small>{y}</small>
          </button>
        ))}
      </nav>
      <section className="ct179-work">
        <article>
          <aside>
            {["select", "move", "shape"].map((x) => (
              <button
                className={tool === x ? "active" : ""}
                onClick={() => {
                  setTool(x);
                  onInteraction();
                }}
                key={x}
              >
                {x[0].toUpperCase()}
              </button>
            ))}
            <button onClick={reset}>
              <Trash2 />
            </button>
          </aside>
          <header>
            <label>
              <input
                type="checkbox"
                checked={vectors}
                onChange={() => {
                  setVectors((v) => !v);
                  onInteraction();
                }}
              />
              Show vectors
            </label>
            <label>
              <input
                type="checkbox"
                checked={snap}
                onChange={() => {
                  setSnap((v) => !v);
                  onInteraction();
                }}
              />
              Snap to grid
            </label>
          </header>
          <Graph
            points={points}
            images={displayedImages}
            showVectors={vectors}
            snap={snap}
            tool={tool}
            onMove={move}
            onPoint={movePoint}
          />
          <section className="ct179-controls">
            <label>
              Transformation
              <select
                aria-label="Transformation type"
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value as Kind);
                  onInteraction();
                }}
              >
                <option value="translation">Translation</option>
                <option value="reflectX">Reflection in x-axis</option>
                <option value="reflectY">Reflection in y-axis</option>
                <option value="rotate90">Rotation 90° CCW</option>
                <option value="rotate180">Rotation 180°</option>
                <option value="scale">Scaling</option>
              </select>
            </label>
            <label>
              Vector (a, b)
              <input
                aria-label="Transformation a"
                type="number"
                value={a}
                onChange={(e) => {
                  setA(Number(e.target.value));
                  onInteraction();
                }}
              />
              <input
                aria-label="Transformation b"
                type="number"
                value={b}
                onChange={(e) => {
                  setB(Number(e.target.value));
                  onInteraction();
                }}
              />
            </label>
            <div>
              {[
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [2, 2],
                [-3, 1],
              ].map((v) => (
                <button
                  onClick={() => {
                    setKind("translation");
                    setA(v[0]);
                    setB(v[1]);
                    onInteraction();
                  }}
                  key={v.join()}
                >{`(${v[0]}, ${v[1]})`}</button>
              ))}
            </div>
            <button
              onClick={() => {
                setPlaying((v) => !v);
                onInteraction();
              }}
            >
              <Play />
              {playing ? "Pause animation" : "Play animation"}
            </button>
          </section>
        </article>
        <aside>
          <section className="ct179-table">
            <div>
              <b>Original</b>
              <b>Image</b>
            </div>
            <div className="ct179-column-head">
              <b>Point</b>
              <b>x</b>
              <b>y</b>
              <b>Point</b>
              <b>x′</b>
              <b>y′</b>
            </div>
            {points.map((p, i) => (
              <p key={names[i]}>
                <b>{names[i]}</b>
                <span>{fmt(p.x)}</span>
                <span>{fmt(p.y)}</span>
                <b>{names[i]}′</b>
                <span>{fmt(images[i].x)}</span>
                <span>{fmt(images[i].y)}</span>
              </p>
            ))}
          </section>
          <section>
            <h3>✓ Result / Observation</h3>
            <p>
              {kind === "translation"
                ? `Each point moved by the vector ⟨${fmt(a)}, ${fmt(b)}⟩.`
                : "Every vertex follows the selected coordinate rule."}
            </p>
            <output>Rule: {currentRule}</output>
          </section>
          <section>
            <h3>Live vectors</h3>
            {points.map((p, i) => (
              <p key={names[i]}>
                {names[i]}
                {names[(i + 1) % 3]} = ⟨{fmt(points[(i + 1) % 3].x - p.x)},{" "}
                {fmt(points[(i + 1) % 3].y - p.y)}⟩
              </p>
            ))}
          </section>
          <section>
            <h3>Transformation summary</h3>
            <b>{kind}</b>
            <output>{currentRule}</output>
          </section>
        </aside>
      </section>
      <section className="ct179-learn">
        <article>
          <h3>Construction steps</h3>
          <ol>
            <li>Select a transformation type.</li>
            <li>Adjust the vector (a, b).</li>
            <li>Drag the shape to any position.</li>
            <li>Observe image coordinates and vectors.</li>
            <li>Use the rule to predict results.</li>
          </ol>
        </article>
        <article>
          <h3>Insight — Rule</h3>
          <p>A translation shifts every point by the same vector (a, b).</p>
          <output>(x, y) → (x + a, y + b)</output>
          <p>Equivalently: (x′, y′) = (x + a, y + b)</p>
        </article>
        <article>
          <h3>Other transformations</h3>
          <p>Reflection in x-axis: (x,−y)</p>
          <p>Reflection in y-axis: (−x,y)</p>
          <p>Rotation 90° CCW: (−y,x)</p>
          <p>Rotation 180°: (−x,−y)</p>
          <p>Scaling by k: (kx,ky)</p>
        </article>
      </section>
      <section className="ct179-practice">
        <div>
          <h3>Try it yourself</h3>
          <p>
            Translate the triangle by vector ⟨−2, 3⟩. Enter the image
            coordinates.
          </p>
          <svg viewBox="0 0 300 140">
            <polygon points="70,80 190,35 130,115" />
            <text x="70" y="75">
              A (1,−2)
            </text>
            <text x="190" y="30">
              B (4,1)
            </text>
            <text x="130" y="132">
              C (2,−4)
            </text>
          </svg>
        </div>
        <div>
          <b>Point</b>
          <b>x′</b>
          <b>y′</b>
          {["A′", "B′", "C′"].map((n, row) => (
            <span key={n}>
              <b>{n}</b>
              <input
                aria-label={`${n} x`}
                type="number"
                value={answers[row * 2]}
                onChange={(e) =>
                  setAnswers((v) =>
                    v.map((x, i) => (i === row * 2 ? e.target.value : x)),
                  )
                }
              />
              <input
                aria-label={`${n} y`}
                type="number"
                value={answers[row * 2 + 1]}
                onChange={(e) =>
                  setAnswers((v) =>
                    v.map((x, i) => (i === row * 2 + 1 ? e.target.value : x)),
                  )
                }
              />
            </span>
          ))}
        </div>
        <aside>
          <button
            onClick={() => {
              setStatus(
                correct ? "Correct transformed triangle" : "Check every vertex",
              );
              onInteraction();
            }}
          >
            ✓ Check
          </button>
          <button
            onClick={() => {
              setAnswers(practice.map(String));
              setStatus("Answer shown");
              onInteraction();
            }}
          >
            ◉ Show answer
          </button>
          <button
            onClick={() => {
              setAnswers(["", "", "", "", "", ""]);
              setStatus("");
              onInteraction();
            }}
          >
            ↻ New task
          </button>
          <output>{status}</output>
        </aside>
      </section>
      <nav className="ct179-nav">
        <a href="/lessons/geometry/178-coordinate-loci">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Coordinate Loci</b>
          </span>
        </a>
        <a href="/lessons/geometry/180-polar-coordinates">
          <span>
            <small>Next</small>
            <b>Polar Coordinates</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="ct179-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <a>Sitemap</a>
        <a>Docs</a>
        <a>About</a>
      </footer>
    </main>
  );
}
