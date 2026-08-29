import {
  ArrowLeft,
  ArrowRight,
  Circle,
  Focus,
  Grid3X3,
  Link2,
  Maximize2,
  RotateCcw,
  Unlink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./AttachDetachTargetLesson202.css";

type Name = "P" | "Q";
type Point = { x: number; y: number };
const R = 4,
  round = (n: number) => Math.round(n * 100) / 100,
  clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
const initial = { P: { x: 2.83, y: 2.83 }, Q: { x: 4.2, y: 2.1 } };
const project = (p: Point, c: Point): Point => {
  const dx = p.x - c.x,
    dy = p.y - c.y,
    d = Math.hypot(dx, dy) || 1;
  return { x: round(c.x + (dx * R) / d), y: round(c.y + (dy * R) / d) };
};
const distance = (p: Point, c: Point) =>
  Math.abs(Math.hypot(p.x - c.x, p.y - c.y) - R);

function ConstraintCanvas({
  points,
  attached,
  selected,
  center,
  grid,
  zoom,
  pan,
  onPoint,
  onCenter,
  onPan,
  onSelect,
}: {
  points: Record<Name, Point>;
  attached: Record<Name, boolean>;
  selected: Name;
  center: Point;
  grid: boolean;
  zoom: number;
  pan: Point;
  onPoint: (n: Name, p: Point) => void;
  onCenter: (p: Point) => void;
  onPan: (p: Point) => void;
  onSelect: (n: Name) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Name | "O" | "pan" | null>(null),
    last = useRef({ x: 0, y: 0 }),
    ox = 380 + pan.x,
    oy = 205 + pan.y,
    s = 47 * zoom,
    toScreen = (p: Point) => ({
      x: ox + p.x * s,
      y: oy - p.y * s,
    }),
    fromEvent = (e: PointerEvent<SVGSVGElement>) => {
      const b = ref.current!.getBoundingClientRect();
      return {
        x: round((((e.clientX - b.left) / b.width) * 760 - ox) / s),
        y: round((oy - ((e.clientY - b.top) / b.height) * 410) / s),
      };
    };
  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    if (drag.current === "pan") {
      onPan({
        x: pan.x + e.clientX - last.current.x,
        y: pan.y + e.clientY - last.current.y,
      });
      last.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const p = fromEvent(e);
    if (drag.current === "O")
      return onCenter({ x: clamp(p.x, -3, 3), y: clamp(p.y, -3, 3) });
    onPoint(drag.current, p);
  };
  const start = (e: PointerEvent<SVGElement>, name: Name | "O") => {
    e.stopPropagation();
    drag.current = name;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const ps = { P: toScreen(points.P), Q: toScreen(points.Q) };
  const cp = toScreen(center);
  return (
    <svg
      ref={ref}
      className="ad202-canvas"
      viewBox="0 0 760 410"
      role="img"
      aria-label="Circle with attached point P and detached point Q"
      onPointerDown={(e) => {
        drag.current = "pan";
        last.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern
          id="ad202-grid"
          width={s}
          height={s}
          patternUnits="userSpaceOnUse"
          x={ox}
          y={oy}
        >
          <path d={`M${s} 0H0V${s}`} fill="none" stroke="#e7eef6" />
        </pattern>
        <marker
          id="ad202-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" />
        </marker>
      </defs>
      <rect width="760" height="410" fill="#fff" />
      {grid && <rect width="760" height="410" fill="url(#ad202-grid)" />}
      <line
        x1="10"
        y1={oy}
        x2="750"
        y2={oy}
        className="axis"
        markerEnd="url(#ad202-arrow)"
      />
      <line
        x1={ox}
        y1="400"
        x2={ox}
        y2="10"
        className="axis"
        markerEnd="url(#ad202-arrow)"
      />
      {[-6, -4, -2, 0, 2, 4, 6].map((t) => (
        <text key={`x${t}`} x={ox + t * s} y={oy + 22}>
          {t}
        </text>
      ))}
      {[-4, -2, 2, 4, 6].map((t) => (
        <text key={`y${t}`} x={ox - 14} y={oy - t * s + 4} textAnchor="end">
          {t}
        </text>
      ))}
      <text x="741" y={oy - 10} className="axis-name">
        x
      </text>
      <text x={ox + 9} y="18" className="axis-name">
        y
      </text>
      <circle cx={cp.x} cy={cp.y} r={R * s} className="parent-circle" />
      <g
        data-testid="constraint-circle-center"
        onPointerDown={(e) => start(e, "O")}
      >
        <circle cx={cp.x} cy={cp.y} r="7" className="center" />
        <text x={cp.x + 14} y={cp.y + 20} className="origin">
          O ({center.x.toFixed(1)}, {center.y.toFixed(1)})
        </text>
      </g>
      <line
        x1={ps.P.x}
        y1={ps.P.y}
        x2={ps.Q.x}
        y2={ps.Q.y}
        className="relation"
      />
      {(["P", "Q"] as Name[]).map((name) => {
        const p = ps[name],
          isAttached = attached[name];
        return (
          <g
            key={name}
            data-testid={`attach-point-${name.toLowerCase()}`}
            className={`point ${name.toLowerCase()} ${selected === name ? "selected" : ""}`}
            onPointerDown={(e) => {
              onSelect(name);
              start(e, name);
            }}
          >
            <circle cx={p.x} cy={p.y} r="9" />
            <g transform={`translate(${p.x + 14} ${p.y - 36})`}>
              <rect width="96" height="30" rx="7" />
              <text x="48" y="19" textAnchor="middle">
                {name} {isAttached ? "attached" : "detached"}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default function AttachDetachTargetLesson202({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState<Record<Name, Point>>(initial),
    [attached, setAttached] = useState<Record<Name, boolean>>({
      P: true,
      Q: false,
    }),
    [selected, setSelected] = useState<Name>("P"),
    [center, setCenter] = useState<Point>({ x: 0, y: 0 }),
    [grid, setGrid] = useState(true),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState<Point>({ x: 0, y: 0 }),
    [tab, setTab] = useState("Interaction + visualization");
  const interact = () => onInteraction(),
    reset = () => {
      setPoints(initial);
      setAttached({ P: true, Q: false });
      setSelected("P");
      setCenter({ x: 0, y: 0 });
      setGrid(true);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setTab("Interaction + visualization");
    };
  useEffect(reset, [resetToken]);
  const movePoint = (name: Name, p: Point) => {
    setPoints((old) => ({
      ...old,
      [name]: attached[name]
        ? project(p, center)
        : { x: clamp(round(p.x), -7, 7), y: clamp(round(p.y), -6, 6) },
    }));
    interact();
  };
  const moveCenter = (next: Point) => {
    const delta = { x: next.x - center.x, y: next.y - center.y };
    setCenter(next);
    setPoints((old) => ({
      P: attached.P
        ? { x: round(old.P.x + delta.x), y: round(old.P.y + delta.y) }
        : old.P,
      Q: attached.Q
        ? { x: round(old.Q.x + delta.x), y: round(old.Q.y + delta.y) }
        : old.Q,
    }));
    interact();
  };
  const constrain = (value: boolean) => {
    setAttached((old) => ({ ...old, [selected]: value }));
    if (value)
      setPoints((old) => ({
        ...old,
        [selected]: project(old[selected], center),
      }));
    interact();
  };
  const fit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    interact();
  };
  return (
    <main
      className="ad202-page"
      data-testid="dynamic-geometry-mockup-0259"
      data-dedicated-lesson="202"
      data-object-model="circle-parent-attach-project-detach-free-drag-follow"
      data-selected={selected}
      data-p={`${points.P.x}:${points.P.y}`}
      data-q={`${points.Q.x}:${points.Q.y}`}
      data-attached={`${attached.P}:${attached.Q}`}
      data-center={`${center.x}:${center.y}`}
      data-grid={grid}
      data-zoom={zoom}
      data-pan={`${pan.x}:${pan.y}`}
      data-tab={tab}
    >
      <header className="ad202-header">
        <section>
          <small>DYNAMIC GEOMETRY</small>
          <h1>Attach / Detach Point</h1>
          <p>
            Understand how points attach to objects and follow them - or detach
            and move freely.
          </p>
        </section>
        <aside>
          <article>
            <Focus />
            <span>
              Focus
              <b>
                Constraints &amp;
                <br />
                Transformations
              </b>
            </span>
          </article>
          <article>
            <b>◷</b>
            <span>
              Duration<strong>6-10 min</strong>
            </span>
          </article>
          <article>
            <b>▥</b>
            <span>
              Level<strong>Middle School</strong>
            </span>
          </article>
        </aside>
      </header>
      <nav className="ad202-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name, i) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              interact();
            }}
          >
            {["◉", "▤", "♧", "∑", "☼"][i]} {name}
          </button>
        ))}
      </nav>
      <section className="ad202-main">
        <article className="workspace">
          <header>
            <div>
              <h2>Drag directly on the model</h2>
              <p>Try attaching point P to the circle, then detaching it.</p>
            </div>
            <nav>
              <button
                onClick={() => {
                  reset();
                  interact();
                }}
              >
                <RotateCcw />
                Reset
              </button>
              <button onClick={fit}>
                <Maximize2 />
                Fit view
              </button>
              <button
                onClick={() => {
                  setGrid((v) => !v);
                  interact();
                }}
              >
                <Grid3X3 />
                Grid <i className={grid ? "on" : ""} />
              </button>
            </nav>
          </header>
          <div className="canvas-wrap">
            <ConstraintCanvas
              points={points}
              attached={attached}
              selected={selected}
              center={center}
              grid={grid}
              zoom={zoom}
              pan={pan}
              onPoint={movePoint}
              onCenter={moveCenter}
              onPan={(next) => {
                setPan(next);
                interact();
              }}
              onSelect={(name) => {
                setSelected(name);
                interact();
              }}
            />
            <input
              aria-label="Model zoom"
              type="range"
              min=".75"
              max="1.35"
              step=".05"
              value={zoom}
              onChange={(e) => {
                setZoom(Number(e.target.value));
                interact();
              }}
            />
          </div>
          <footer>
            <article>
              <b>Attached: follows object</b>
              <p>
                When attached, point P stays on the circle as the circle moves.
              </p>
            </article>
            <i>↔</i>
            <article>
              <b>Detached: moves freely</b>
              <p>When detached, point P moves anywhere on the plane.</p>
            </article>
          </footer>
        </article>
        <aside className="ad202-panel">
          <header>
            <Circle /> <b>Constraint: circle</b>
            <span>⌄</span>
          </header>
          <h3>Constraint mode &nbsp; ⓘ</h3>
          <nav>
            <button
              className={attached[selected] ? "active" : ""}
              onClick={() => constrain(true)}
            >
              <Link2 />
              Attached
            </button>
            <button
              className={!attached[selected] ? "detached" : ""}
              onClick={() => constrain(false)}
            >
              <Unlink />
              Detached
            </button>
          </nav>
          {(["P", "Q"] as Name[]).map((name) => (
            <button
              key={name}
              className={`row ${selected === name ? "selected" : ""}`}
              onClick={() => {
                setSelected(name);
                interact();
              }}
            >
              <header>
                <i className={name.toLowerCase()} />
                <b>Point {name}</b>
                <em className={attached[name] ? "attached" : "detached"}>
                  {attached[name] ? "Attached" : "Detached"}
                </em>
              </header>
              <section>
                <span>
                  x <b>{points[name].x.toFixed(2)}</b>
                </span>
                <span>
                  y <b>{points[name].y.toFixed(2)}</b>
                </span>
              </section>
              <footer>
                <span>Distance to object</span>
                <b>{distance(points[name], center).toFixed(2)}</b>
                <em>{attached[name] ? "✓ On path" : "Off path"}</em>
              </footer>
            </button>
          ))}
          <h3>Actions</h3>
          <section className="actions">
            <button onClick={() => constrain(true)}>
              <Link2 />
              Attach to circle
            </button>
            <button onClick={() => constrain(false)}>
              <Unlink />
              Detach point
            </button>
          </section>
          <p className="info">
            ⓘ &nbsp; Attached points are constrained to the object and follow
            it. Detached points have no constraint and can move freely on the
            plane.
          </p>
        </aside>
      </section>
      <nav className="ad202-nav">
        <a href="/lessons/geometry/201-midpoint-or-centre">
          <ArrowLeft />
          <span>
            PREVIOUS LESSON<b>Midpoint or Centre</b>
          </span>
        </a>
        <div>
          Lesson 3 of 28<i>● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○</i>
        </div>
        <a href="/lessons/geometry/203-line-through-two-points">
          <span>
            NEXT LESSON<b>Line Through Two Points</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="ad202-footer">
        <b>⚙ &nbsp; Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
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
