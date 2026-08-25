import { CheckCircle2, Info, Lightbulb, Lock, Unlock } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./DependentObjectsTargetLesson25.css";

type Point = { x: number; y: number };
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const fmt = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

export default function DependentObjectsTargetLesson25({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>({ x: 1, y: 2 }),
    [b, setB] = useState<Point>({ x: 5, y: 2 }),
    [actions, setActions] = useState(0);
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    length = Math.hypot(b.x - a.x, b.y - a.y);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (name: "a" | "b", point: Point) => {
    const bounded = {
      x: clamp(Math.round(point.x), 0, 8),
      y: clamp(Math.round(point.y), -1, 5),
    };
    if (name === "a") setA(bounded);
    else setB(bounded);
    touch();
  };
  const nudge = (name: "a" | "b", axis: "x" | "y", delta: number) => {
    const source = name === "a" ? a : b;
    update(name, { ...source, [axis]: source[axis] + delta });
  };
  useEffect(() => {
    setA({ x: 1, y: 2 });
    setB({ x: 5, y: 2 });
    setActions(0);
  }, [resetToken]);
  return (
    <div
      className="dependency-page"
      data-testid="algebra-mockup-0025"
      data-dedicated-lesson="25"
      data-object-model="two-draggable-parent-points-derived-segment-midpoint-length-label-hierarchy-model"
      data-ax={a.x}
      data-ay={a.y}
      data-bx={b.x}
      data-by={b.y}
      data-mx={midpoint.x}
      data-my={midpoint.y}
      data-length={fmt(length)}
      data-actions={actions}
    >
      <nav className="dependency-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>25 Dependent And Independent Objects</b>
      </nav>
      <header className="dependency-header">
        <div>
          <h1>Dependent and Independent Objects</h1>
          <p>Teach construction hierarchy.</p>
          <nav>
            <b>
              <i />
              Independent: A and B
            </b>
            <b>
              <i />
              Dependent: segment AB and midpoint M
            </b>
          </nav>
        </div>
        <aside>
          <Lightbulb />
          <b>
            Move a parent object to
            <br />
            update its children.
          </b>
        </aside>
      </header>
      <main className="dependency-main">
        <section className="dependency-lab">
          <DependencyGraph a={a} b={b} midpoint={midpoint} onPoint={update} />
          <div className="dependency-lower">
            <section className="dependency-formula">
              <div className="parent-cards">
                <b>
                  <i />
                  A({a.x}, {a.y})
                </b>
                <b>
                  <i />
                  B({b.x}, {b.y})
                </b>
              </div>
              <div className="formula-flow">
                <span>↘</span>
                <span>↙</span>
                <strong>
                  M = (&nbsp;
                  <i className="fraction">
                    <span>x<sub>A</sub> + x<sub>B</sub></span>
                    <small>2</small>
                  </i>
                  , &nbsp;
                  <i className="fraction">
                    <span>y<sub>A</sub> + y<sub>B</sub></span>
                    <small>2</small>
                  </i>
                  &nbsp;)
                </strong>
                <em>↓</em>
                <b>
                  <i />
                  M({fmt(midpoint.x)}, {fmt(midpoint.y)})
                </b>
              </div>
            </section>
            <section className="dependency-hierarchy">
              <h2>Dependency hierarchy</h2>
              <div>
                <b>
                  <i />A
                </b>
                <b>
                  <i />B
                </b>
              </div>
              <span>└────┴────┘</span>
              <strong>
                Segment AB
                <i>
                  <u />
                  <u />
                </i>
              </strong>
              <em>↓</em>
              <strong>
                <i />
                Midpoint M
              </strong>
              <em>↓</em>
              <strong>
                M&nbsp; Label M({fmt(midpoint.x)}, {fmt(midpoint.y)})
              </strong>
            </section>
          </div>
        </section>
        <aside className="dependency-side">
          <h2>
            Independent objects <Info />
          </h2>
          <PointControls
            name="A"
            point={a}
            onNudge={(axis, delta) => nudge("a", axis, delta)}
          />
          <PointControls
            name="B"
            point={b}
            onNudge={(axis, delta) => nudge("b", axis, delta)}
          />
          <h2>
            Dependent objects <small>(auto-updated)</small>
          </h2>
          <section className="dependent-card">
            <header>
              <i />
              M({fmt(midpoint.x)}, {fmt(midpoint.y)})<span>Midpoint of AB</span>
              <Lock />
            </header>
            <label>
              x<output>{fmt(midpoint.x)}</output>
            </label>
            <label>
              y<output>{fmt(midpoint.y)}</output>
            </label>
          </section>
          <section className="dependent-card length">
            <header>
              <i />
              <u />
              AB = {fmt(length)}
              <span>Length of segment</span>
              <Lock />
            </header>
            <label>
              Length<output>{fmt(length)}</output>
            </label>
          </section>
          <p className="dependency-note">
            <CheckCircle2 />
            Move a parent object to
            <br />
            update its children.
          </p>
        </aside>
      </main>
      <nav className="dependency-neighbors">
        <a href="/lessons/core-workspaces/24-animation-controls">
          ←
          <span>
            <small>Previous</small>
            <b>Animation Controls</b>
          </span>
        </a>
        <a href="/lessons/core-workspaces/26-conditional-visibility">
          <span>
            <small>Next</small>
            <b>Conditional Visibility</b>
          </span>
          →
        </a>
      </nav>
    </div>
  );
}

function PointControls({
  name,
  point,
  onNudge,
}: {
  name: string;
  point: Point;
  onNudge: (axis: "x" | "y", delta: number) => void;
}) {
  return (
    <section className="parent-control">
      <header>
        <i />
        <b>
          {name}({point.x}, {point.y})
        </b>
        <Unlock />
      </header>
      {(["x", "y"] as const).map((axis) => (
        <label key={axis}>
          {axis}
          <button
            type="button"
            aria-label={`Decrease ${name} ${axis}`}
            onClick={() => onNudge(axis, -1)}
          >
            −
          </button>
          <output>{point[axis]}</output>
          <button
            type="button"
            aria-label={`Increase ${name} ${axis}`}
            onClick={() => onNudge(axis, 1)}
          >
            +
          </button>
        </label>
      ))}
    </section>
  );
}

function DependencyGraph({
  a,
  b,
  midpoint,
  onPoint,
}: {
  a: Point;
  b: Point;
  midpoint: Point;
  onPoint: (name: "a" | "b", point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    dragging = useRef<"a" | "b" | null>(null),
    map = (point: Point) => ({ x: 80 + point.x * 72, y: 300 - point.y * 52 });
  const pa = map(a),
    pb = map(b),
    pm = map(midpoint);
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svg.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(dragging.current, {
      x: (point.x - 80) / 72,
      y: (300 - point.y) / 52,
    });
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 720 365"
      role="img"
      aria-label="Draggable independent points A and B with dependent midpoint"
      onPointerMove={update}
      onPointerUp={() => {
        dragging.current = null;
      }}
    >
      <defs>
        <pattern
          id="dependency-grid"
          width="36"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path d="M36 0H0V26" fill="none" stroke="#e7ebef" />
        </pattern>
        <filter id="point-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".28" />
        </filter>
      </defs>
      <rect width="720" height="365" fill="url(#dependency-grid)" />
      <line className="axis" x1="8" y1="300" x2="705" y2="300" />
      <line className="axis" x1="80" y1="16" x2="80" y2="360" />
      <text x="700" y="291">
        x
      </text>
      <text x="89" y="19">
        y
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => (
        <text className="tick" key={`x${value}`} x={75 + value * 72} y="320">
          {value}
        </text>
      ))}
      {[-1, 1, 2, 3, 4, 5].map((value) => (
        <text className="tick" key={`y${value}`} x="58" y={305 - value * 52}>
          {value}
        </text>
      ))}
      <line className="segment" x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />
      <circle
        data-testid="dependency-handle-a"
        className="parent"
        cx={pa.x}
        cy={pa.y}
        r="8"
        onPointerDown={(event) => {
          dragging.current = "a";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <circle
        data-testid="dependency-handle-b"
        className="parent"
        cx={pb.x}
        cy={pb.y}
        r="8"
        onPointerDown={(event) => {
          dragging.current = "b";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <circle className="child" cx={pm.x} cy={pm.y} r="8" />
      <text className="parent-label" x={pa.x - 20} y={pa.y - 23}>
        A({a.x}, {a.y})
      </text>
      <text className="parent-label" x={pb.x - 20} y={pb.y - 23}>
        B({b.x}, {b.y})
      </text>
      <text className="child-label" x={pm.x - 30} y={pm.y - 23}>
        M({fmt(midpoint.x)}, {fmt(midpoint.y)})
      </text>
    </svg>
  );
}
